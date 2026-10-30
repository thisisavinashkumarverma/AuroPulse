import { Link } from 'react-router-dom';
import { FaBell, FaCalendarCheck, FaFileMedicalAlt, FaPrescriptionBottleAlt } from 'react-icons/fa';
import StatCard from '../../components/StatCard';
import Badge from '../../components/Badge';
import PageHeader from '../../components/PageHeader';
import { ErrorState, PageLoader } from '../../components/Spinner';
import useFetch from '../../hooks/useFetch';
import { usePageTitle } from '../../hooks/useUtils';
import { appointmentsApi, remindersApi, reportsApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { SLOTS } from '../../data/constants';
import { formatDate, todayISO } from '../../utils/helpers';

export default function Dashboard() {
  usePageTitle('Patient Dashboard');
  const { user } = useAuth();
  const { data, loading, error, reload } = useFetch(async () => {
    const q = { userId: user.id };
    const [appointments, reports, reminders] = await Promise.all([
      appointmentsApi.list({ ...q, _sort: 'date', _order: 'asc' }),
      reportsApi.list({ ...q, _sort: 'date', _order: 'desc' }),
      remindersApi.list(q),
    ]);
    return { appointments, reports, reminders };
  }, [user.id]);

  if (loading && !data) return <PageLoader />;
  if (error) return <ErrorState message={error} onRetry={reload} />;

  const { appointments, reports, reminders } = data;
  const today = todayISO();
  const upcoming = appointments.filter((a) => a.date >= today && ['Pending', 'Approved'].includes(a.status));
  const doses = reminders.flatMap((r) => Object.keys(SLOTS).filter((k) => r[k]).map((k) => ({ id: `${r.id}-${k}`, medicine: r.medicine, slot: k, food: r.food, taken: r.taken?.date === today && r.taken.slots?.includes(k) })));

  return (
    <>
      <PageHeader title={`Welcome back, ${user.name.split(' ')[0]}`} subtitle="Here is your health overview for today." action={<Link to="/patient/appointments" className="btn-primary">Book Appointment</Link>} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={FaCalendarCheck} label="Upcoming Appointments" value={upcoming.length} />
        <StatCard icon={FaPrescriptionBottleAlt} label="Total Prescriptions" value={reminders.length} color="bg-secondary-100 text-secondary-700" hint="Active medicines" />
        <StatCard icon={FaFileMedicalAlt} label="Recent Reports" value={reports.length} color="bg-amber-100 text-amber-700" />
        <StatCard icon={FaBell} label="Medicine Reminders" value={doses.length} color="bg-purple-100 text-purple-700" hint="Doses scheduled today" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="card p-5" aria-labelledby="up-title">
          <div className="mb-3 flex items-center justify-between"><h2 id="up-title" className="font-bold">Upcoming Appointments</h2><Link to="/patient/appointments" className="link text-sm">View all</Link></div>
          {upcoming.length === 0 ? <p className="py-6 text-center text-sm text-slate-500">No upcoming appointments.</p> : (
            <ul className="divide-y divide-slate-100 dark:divide-slate-700">
              {upcoming.slice(0, 4).map((a) => (
                <li key={a.id} className="flex items-center justify-between gap-3 py-3">
                  <div><p className="font-semibold">{a.doctorName}</p><p className="text-xs text-slate-500">{a.department} · {formatDate(a.date)}, {a.time}</p></div>
                  <Badge>{a.status}</Badge>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card p-5" aria-labelledby="rep-title">
          <div className="mb-3 flex items-center justify-between"><h2 id="rep-title" className="font-bold">Recent Reports</h2><Link to="/patient/reports" className="link text-sm">View all</Link></div>
          {reports.length === 0 ? <p className="py-6 text-center text-sm text-slate-500">No reports yet.</p> : (
            <ul className="divide-y divide-slate-100 dark:divide-slate-700">
              {reports.slice(0, 4).map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-3 py-3">
                  <div><p className="font-semibold">{r.name}</p><p className="text-xs text-slate-500">{r.type} · {formatDate(r.date)}</p></div>
                  <Badge>{r.status}</Badge>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card p-5 lg:col-span-2" aria-labelledby="med-title">
          <div className="mb-3 flex items-center justify-between"><h2 id="med-title" className="font-bold">Today's Medicine Reminders</h2><Link to="/patient/reminders" className="link text-sm">Manage</Link></div>
          {doses.length === 0 ? <p className="py-6 text-center text-sm text-slate-500">No reminders set.</p> : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {doses.map((d) => (
                <div key={d.id} className="flex items-center justify-between rounded-lg border border-slate-200 p-3 dark:border-slate-700">
                  <div><p className="text-sm font-semibold">{d.medicine}</p><p className="text-xs text-slate-500">{SLOTS[d.slot].label} · {d.food} food</p></div>
                  <span className={`badge ${d.taken ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>{d.taken ? 'Taken' : 'Due'}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
