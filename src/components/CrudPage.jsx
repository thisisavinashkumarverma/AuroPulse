import { useState } from 'react';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import DataTable from './DataTable';
import Modal, { ConfirmModal } from './Modal';
import PageHeader from './PageHeader';
import { Input, Select, Textarea } from './FormField';
import { ErrorState, PageLoader } from './Spinner';
import useFetch from '../hooks/useFetch';
import { useToast } from '../context/ToastContext';
import { errMsg } from '../services/api';

/**
 * Generic admin CRUD screen.
 * fields: [{ name, label, type: text|number|email|tel|date|select|textarea, options, required, placeholder }]
 */
export default function CrudPage({
  title, singular, api, columns, fields, defaults = {}, allowAdd = true, allowEdit = true,
  addLabel, transform, validate, extraActions, pageSize = 8, subtitle,
}) {
  const toast = useToast();
  const { data, loading, error, reload } = useFetch(() => api.list(), []);
  const [editing, setEditing] = useState(null); // null | 'new' | record
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const openNew = () => { setValues(defaults); setErrors({}); setEditing('new'); };
  const openEdit = (row) => { setValues(row); setErrors({}); setEditing(row); };
  const close = () => setEditing(null);
  const set = (name) => (e) => setValues((v) => ({ ...v, [name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    const errs = {};
    fields.forEach((f) => {
      if (f.required && String(values[f.name] ?? '').trim() === '') errs[f.name] = `${f.label} is required`;
    });
    Object.assign(errs, validate ? validate(values) : {});
    setErrors(errs);
    if (Object.keys(errs).length) return;

    const payload = { ...values };
    fields.forEach((f) => { if (f.type === 'number' && payload[f.name] !== '') payload[f.name] = Number(payload[f.name]); });
    setSaving(true);
    try {
      const body = transform ? await transform(payload, editing === 'new') : payload;
      if (editing === 'new') await api.create(body); else await api.update(editing.id, body);
      toast.success(`${singular} ${editing === 'new' ? 'added' : 'updated'} successfully`);
      close();
      reload();
    } catch (err) { toast.error(errMsg(err)); } finally { setSaving(false); }
  };

  const confirmDelete = async () => {
    setSaving(true);
    try {
      await api.remove(deleting.id);
      toast.success(`${singular} deleted`);
      setDeleting(null);
      reload();
    } catch (err) { toast.error(errMsg(err)); } finally { setSaving(false); }
  };

  if (loading && !data) return <PageLoader />;
  if (error) return <ErrorState message={error} onRetry={reload} />;

  return (
    <>
      <PageHeader
        title={title}
        subtitle={subtitle}
        action={allowAdd && <button className="btn-primary" onClick={openNew}><FaPlus aria-hidden="true" /> {addLabel || `Add ${singular}`}</button>}
      />
      <DataTable
        columns={columns}
        rows={data || []}
        pageSize={pageSize}
        searchPlaceholder={`Search ${title.toLowerCase()}...`}
        actions={(row) => (
          <div className="flex gap-1.5">
            {extraActions?.(row, reload)}
            {allowEdit && <button className="btn-outline btn-sm" onClick={() => openEdit(row)} aria-label={`Edit ${row.name || singular}`}><FaEdit /> Edit</button>}
            <button className="btn-danger btn-sm" onClick={() => setDeleting(row)} aria-label={`Delete ${row.name || singular}`}><FaTrash /> Delete</button>
          </div>
        )}
      />

      <Modal open={!!editing} onClose={close} title={editing === 'new' ? `Add ${singular}` : `Edit ${singular}`} size="max-w-2xl">
        <form onSubmit={submit} noValidate className="grid gap-4 sm:grid-cols-2">
          {fields.map((f) => {
            const common = { name: f.name, label: f.label, value: values[f.name] ?? '', onChange: set(f.name), error: errors[f.name], required: f.required };
            const wrap = f.type === 'textarea' ? 'sm:col-span-2' : '';
            return (
              <div key={f.name} className={wrap}>
                {f.type === 'select' ? <Select {...common} options={f.options} placeholder="Select..." />
                  : f.type === 'textarea' ? <Textarea {...common} placeholder={f.placeholder} />
                    : <Input {...common} type={f.type || 'text'} placeholder={f.placeholder} step={f.type === 'number' ? 'any' : undefined} />}
              </div>
            );
          })}
          <div className="flex justify-end gap-2 sm:col-span-2">
            <button type="button" className="btn-outline" onClick={close}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
        busy={saving}
        danger
        confirmLabel="Delete"
        title={`Delete ${singular}`}
        message={`This will permanently remove "${deleting?.name || singular}" from db.json. This cannot be undone.`}
      />
    </>
  );
}
