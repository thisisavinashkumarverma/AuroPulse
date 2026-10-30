import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaCalendarPlus, FaRedo, FaTimesCircle } from 'react-icons/fa';
import AppointmentForm from '../../components/AppointmentForm';
import Badge from '../../components/Badge';
import DataTable from '../../components/DataTable';
import DoctorCard from '../../components/DoctorCard';
import Modal, { ConfirmModal } from '../../components/Modal';
import PageHeader from '../../components/PageHeader';
import { Select } from '../../components/FormField';
import { ErrorState, PageLoader } from '../../components/Spinner';
import useFetch from '../../hooks/useFetch';
import { usePageTitle } from '../../hooks/useUtils';
import { appointmentsApi, doctorsApi, errMsg } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { DEPARTMENT_NAMES } from '../../data/departments';
import { currency, formatDate } from '../../utils/helpers';

export default function Appointments() {
  usePageTitle('Appointments');
  const { user } = useAuth();
  const toast = useToast();
  const [params, setParams] = useSearchParams();
  const apts = useFetch(() => appointmentsApi.list({ userId: user.id }), [user.id]);
  const docs = useFetch(() => doctorsApi.list(), []);
  const [tab, setTab] = useState('mine');
  const [booking, setBooking] = useState(null); // 'new' | doctor
  const [resched, setResched] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [dept, setDept] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const id = params.get('doctor');
    if (id && docs.data) {
      const d = docs.data.find((x) => String(x.id) === id);
      if (d) setBooking(d);
      setParams({}, { replace: true });
    }
  }, [params, docs.data, setParams]);

  const doctorList = useMemo(() => (docs.data || []).filter((d) => !dept || d.department === dept), [docs.data, dept]);

  if ((apts.loading && !apts.data) || (docs.loading && !docs.data)) return <PageLoader />;
  if (apts.error || docs.error) return <ErrorState message={apts.error || docs.error} onRetry={() => { apts.reload(); docs.reload(); }} />;

  const cancel = async () => {
    setBusy(true);
    try {
      await appointmentsApi.update(cancelTarget.id, { status: 'Cancelled' });
      toast.success('Appointment cancelled');
      setCancelTarget(null);
      apts.reload();
    } catch (e) { toast.error(errMsg(e)); } finally { setBusy(false); }
  };

  const saved = () => { setBooking(null); setResched(null); apts.reload(); };
  const canChange = (a) => ['Pending', 'Approved'].includes(a.status);

  const columns = [
    { key: 'doctorName', label: 'Doctor' },
    { key: 'department', label: 'Department' },
    { key: 'date', label: 'Date', render: (a) => formatDate(a.date) },
    { key: 'time', label: 'Time' },
    { key: 'reason', label: 'Reason', className: 'max-w-[220px] truncate' },
    { key: 'fee', label: 'Fee', render: (a) => currency(a.fee) },
    { key: 'status', label: 'Status', render: (a) => <Badge>{a.status}</Badge> },
  ];

  return (
    <>
      <PageHeader title="Appointments" subtitle="Book, reschedule or cancel your doctor visits." action={<button className="btn-primary" onClick={() => setBooking('new')}><FaCalendarPlus aria-hidden="true" /> Book Appointment</button>} />

      <div role="tablist" aria-label="Appointment sections" className="mb-5 flex gap-2">
        {[['mine', 'My Appointments'], ['doctors', 'View Doctors']].map(([k, l]) => (
          <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={`btn ${tab === k ? 'bg-primary-600 text-white' : 'btn-outline'}`}>{l}</button>
        ))}
      </div>

      {tab === 'mine' ? (
        <DataTable
          columns={columns}
          rows={apts.data}
          initialSort={{ key: 'date', dir: 'desc' }}
          searchPlaceholder="Search appointments..."
          actions={(a) => canChange(a) ? (
            <div className="flex gap-1.5">
              <button className="btn-outline btn-sm" onClick={() => setResched(a)}><FaRedo aria-hidden="true" /> Reschedule</button>
              <button className="btn-danger btn-sm" onClick={() => setCancelTarget(a)}><FaTimesCircle aria-hidden="true" /> Cancel</button>
            </div>
          ) : <span className="text-xs text-slate-400">-</span>}
          empty="You have no appointments yet."
        />
      ) : (
        <>
          <div className="mb-5 max-w-xs"><Select id="dept" label="Filter by department" value={dept} onChange={(e) => setDept(e.target.value)} options={DEPARTMENT_NAMES} placeholder="All departments" /></div>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">{doctorList.map((d) => <DoctorCard key={d.id} doctor={d} onBook={setBooking} />)}</div>
        </>
      )}

      <Modal open={!!booking} onClose={() => setBooking(null)} title="Book Appointment" size="max-w-2xl">
        {booking && <AppointmentForm doctors={docs.data} initialDoctor={booking === 'new' ? null : booking} user={user} onSaved={saved} onClose={() => setBooking(null)} />}
      </Modal>
      <Modal open={!!resched} onClose={() => setResched(null)} title="Reschedule Appointment" size="max-w-2xl">
        {resched && <AppointmentForm doctors={docs.data} appointment={resched} user={user} onSaved={saved} onClose={() => setResched(null)} />}
      </Modal>
      <ConfirmModal open={!!cancelTarget} onClose={() => setCancelTarget(null)} onConfirm={cancel} busy={busy} danger confirmLabel="Cancel appointment" title="Cancel appointment"
        message={cancelTarget ? `Cancel your appointment with ${cancelTarget.doctorName} on ${formatDate(cancelTarget.date)} at ${cancelTarget.time}?` : ''} />
    </>
  );
}
