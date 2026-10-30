import { useState } from 'react';
import { FaBell, FaCheck, FaPlus, FaTrash } from 'react-icons/fa';
import DataTable from '../../components/DataTable';
import Modal, { ConfirmModal } from '../../components/Modal';
import PageHeader from '../../components/PageHeader';
import { Input } from '../../components/FormField';
import { ErrorState, PageLoader } from '../../components/Spinner';
import useFetch from '../../hooks/useFetch';
import { usePageTitle } from '../../hooks/useUtils';
import { errMsg, remindersApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { SLOTS } from '../../data/constants';
import { todayISO } from '../../utils/helpers';

const EMPTY = { medicine: '', morning: false, afternoon: false, night: false, food: 'After' };

export default function Reminders() {
  usePageTitle('Medicine Reminder');
  const { user } = useAuth();
  const toast = useToast();
  const { data, loading, error, reload } = useFetch(() => remindersApi.list({ userId: user.id }), [user.id]);
  const [open, setOpen] = useState(false);
  const [v, setV] = useState(EMPTY);
  const [err, setErr] = useState('');
  const [saving, setSaving] = useState(false);
  const [del, setDel] = useState(null);
  const today = todayISO();

  if (loading && !data) return <PageLoader />;
  if (error) return <ErrorState message={error} onRetry={reload} />;

  const doses = data.flatMap((r) => Object.keys(SLOTS).filter((k) => r[k]).map((k) => ({
    key: `${r.id}-${k}`, reminder: r, slot: k, medicine: r.medicine, food: r.food,
    taken: r.taken?.date === today && r.taken.slots?.includes(k),
  }))).sort((a, b) => SLOTS[a.slot].time.localeCompare(SLOTS[b.slot].time));

  const submit = async (e) => {
    e.preventDefault();
    if (v.medicine.trim().length < 2) { setErr('Enter the medicine name'); return; }
    if (!v.morning && !v.afternoon && !v.night) { setErr('Select at least one time of day'); return; }
    setSaving(true);
    try {
      await remindersApi.create({ ...v, medicine: v.medicine.trim(), userId: user.id, createdAt: today, taken: null });
      toast.success('Reminder added');
      setOpen(false); setV(EMPTY); setErr('');
      reload();
    } catch (e2) { toast.error(errMsg(e2)); } finally { setSaving(false); }
  };

  const markTaken = async (d) => {
    const prev = d.reminder.taken?.date === today ? d.reminder.taken.slots : [];
    try {
      await remindersApi.update(d.reminder.id, { taken: { date: today, slots: [...new Set([...prev, d.slot])] } });
      toast.success(`${d.medicine} marked as taken`);
      reload();
    } catch (e) { toast.error(errMsg(e)); }
  };

  const remove = async () => {
    setSaving(true);
    try { await remindersApi.remove(del.id); toast.success('Reminder deleted'); setDel(null); reload(); } catch (e) { toast.error(errMsg(e)); } finally { setSaving(false); }
  };

  const simulate = () => {
    const next = doses.find((d) => !d.taken);
    if (next) toast.info(`Time for ${next.medicine} (${SLOTS[next.slot].label}, ${next.food.toLowerCase()} food)`);
    else toast.success('All of today\'s doses are taken. Great job!');
  };

  const columns = [
    { key: 'medicine', label: 'Medicine' },
    { key: 'morning', label: 'Morning', render: (r) => (r.morning ? 'Yes' : '-') },
    { key: 'afternoon', label: 'Afternoon', render: (r) => (r.afternoon ? 'Yes' : '-') },
    { key: 'night', label: 'Night', render: (r) => (r.night ? 'Yes' : '-') },
    { key: 'food', label: 'Food', render: (r) => `${r.food} food` },
  ];

  const check = (k) => (e) => setV((s) => ({ ...s, [k]: e.target.checked }));

  return (
    <>
      <PageHeader title="Medicine Reminder" subtitle="Alerts are simulated with a 30-second timer while you are logged in." action={
        <div className="flex gap-2"><button className="btn-outline" onClick={simulate}><FaBell aria-hidden="true" /> Simulate alert</button><button className="btn-primary" onClick={() => setOpen(true)}><FaPlus aria-hidden="true" /> Add Reminder</button></div>
      } />

      <section className="card mb-6 p-5" aria-labelledby="sched">
        <h2 id="sched" className="mb-3 font-bold">Today's Medicine Schedule</h2>
        {doses.length === 0 ? <p className="py-4 text-center text-sm text-slate-500">No doses scheduled. Add a reminder to get started.</p> : (
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {doses.map((d) => (
              <li key={d.key} className={`flex items-center justify-between gap-3 rounded-xl border p-3 ${d.taken ? 'border-secondary-500 bg-secondary-50 dark:bg-slate-700' : 'border-slate-200 dark:border-slate-700'}`}>
                <div><p className="font-semibold">{d.medicine}</p><p className="text-xs text-slate-500">{SLOTS[d.slot].label} · {SLOTS[d.slot].time} · {d.food} food</p></div>
                {d.taken ? <span className="badge bg-green-100 text-green-800">Taken</span> : <button className="btn-secondary btn-sm" onClick={() => markTaken(d)}><FaCheck aria-hidden="true" /> Taken</button>}
              </li>
            ))}
          </ul>
        )}
      </section>

      <h2 className="mb-3 font-bold">All Reminders</h2>
      <DataTable columns={columns} rows={data} searchPlaceholder="Search reminders..." actions={(r) => <button className="btn-danger btn-sm" onClick={() => setDel(r)} aria-label={`Delete ${r.medicine} reminder`}><FaTrash aria-hidden="true" /> Delete</button>} empty="No reminders yet." />

      <Modal open={open} onClose={() => setOpen(false)} title="Add Reminder">
        <form onSubmit={submit} noValidate className="space-y-4">
          <Input name="medicine" label="Medicine Name" value={v.medicine} onChange={(e) => setV({ ...v, medicine: e.target.value })} />
          <fieldset><legend className="label">Time of day</legend>
            <div className="flex flex-wrap gap-4 text-sm">
              {Object.entries(SLOTS).map(([k, s]) => <label key={k} className="flex items-center gap-2"><input type="checkbox" className="h-4 w-4" checked={v[k]} onChange={check(k)} /> {s.label}</label>)}
            </div>
          </fieldset>
          <fieldset><legend className="label">Food</legend>
            <div className="flex gap-6 text-sm">
              {['Before', 'After'].map((f) => <label key={f} className="flex items-center gap-2"><input type="radio" name="food" className="h-4 w-4" checked={v.food === f} onChange={() => setV({ ...v, food: f })} /> {f} Food</label>)}
            </div>
          </fieldset>
          {err && <p role="alert" className="text-sm font-medium text-red-600">{err}</p>}
          <div className="flex justify-end gap-2"><button type="button" className="btn-outline" onClick={() => setOpen(false)}>Cancel</button><button className="btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Reminder'}</button></div>
        </form>
      </Modal>
      <ConfirmModal open={!!del} onClose={() => setDel(null)} onConfirm={remove} busy={saving} danger confirmLabel="Delete" title="Delete reminder" message={`Delete the reminder for ${del?.medicine}?`} />
    </>
  );
}
