import { useState } from 'react';
import { FaCheck, FaCheckDouble, FaTimes } from 'react-icons/fa';
import Badge from '../../components/Badge';
import DataTable from '../../components/DataTable';
import PageHeader from '../../components/PageHeader';
import { Select } from '../../components/FormField';
import { ErrorState, PageLoader } from '../../components/Spinner';
import useFetch from '../../hooks/useFetch';
import { usePageTitle } from '../../hooks/useUtils';
import { appointmentsApi, errMsg } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { currency, formatDate } from '../../utils/helpers';

const STATUSES = ['Pending', 'Approved', 'Completed', 'Rejected', 'Cancelled'];

export default function ManageAppointments() {
  usePageTitle('Manage Appointments');
  const toast = useToast();
  const { data, loading, error, reload } = useFetch(() => appointmentsApi.list(), []);
  const [status, setStatus] = useState('');
  const [busyId, setBusyId] = useState(null);

  if (loading && !data) return <PageLoader />;
  if (error) return <ErrorState message={error} onRetry={reload} />;

  const setState = async (a, next) => {
    setBusyId(a.id);
    try {
      await appointmentsApi.update(a.id, { status: next });
      toast.success(`Appointment ${next.toLowerCase()}`);
      reload();
    } catch (e) { toast.error(errMsg(e)); } finally { setBusyId(null); }
  };

  const columns = [
    { key: 'id', label: '#', render: (a) => `AP-${String(a.id).padStart(4, '0')}` },
    { key: 'patientName', label: 'Patient' },
    { key: 'doctorName', label: 'Doctor' },
    { key: 'department', label: 'Department' },
    { key: 'date', label: 'Date & Time', render: (a) => `${formatDate(a.date)}, ${a.time}` },
    { key: 'fee', label: 'Fee', render: (a) => currency(a.fee) },
    { key: 'status', label: 'Status', render: (a) => <Badge>{a.status}</Badge> },
  ];

  return (
    <>
      <PageHeader title="Appointments" subtitle="Approve, reject or complete patient appointments." />
      <DataTable
        columns={columns}
        rows={data.filter((a) => !status || a.status === status)}
        searchPlaceholder="Search appointments..."
        toolbar={<div className="w-full sm:w-48"><Select id="status-filter" aria-label="Filter by status" value={status} onChange={(e) => setStatus(e.target.value)} options={STATUSES} placeholder="All statuses" /></div>}
        actions={(a) => (
          <div className="flex gap-1.5">
            {a.status === 'Pending' && (
              <>
                <button className="btn-secondary btn-sm" disabled={busyId === a.id} onClick={() => setState(a, 'Approved')}><FaCheck aria-hidden="true" /> Approve</button>
                <button className="btn-danger btn-sm" disabled={busyId === a.id} onClick={() => setState(a, 'Rejected')}><FaTimes aria-hidden="true" /> Reject</button>
              </>
            )}
            {a.status === 'Approved' && <button className="btn-primary btn-sm" disabled={busyId === a.id} onClick={() => setState(a, 'Completed')}><FaCheckDouble aria-hidden="true" /> Complete</button>}
            {!['Pending', 'Approved'].includes(a.status) && <span className="text-xs text-slate-400">No actions</span>}
          </div>
        )}
      />
    </>
  );
}
