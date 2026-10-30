import { useMemo } from 'react';
import {
  Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Area, AreaChart,
} from 'recharts';
import { FaCalendarCheck, FaRupeeSign, FaUserInjured, FaUserMd } from 'react-icons/fa';
import Badge from '../../components/Badge';
import StatCard from '../../components/StatCard';
import PageHeader from '../../components/PageHeader';
import { ErrorState, PageLoader } from '../../components/Spinner';
import useFetch from '../../hooks/useFetch';
import { usePageTitle } from '../../hooks/useUtils';
import { appointmentsApi, doctorsApi, ordersApi, patientsApi, reportsApi } from '../../services/api';
import { useTheme } from '../../context/ThemeContext';
import { currency, formatDate, MONTHS, monthIndex } from '../../utils/helpers';

function ChartCard({ title, children }) {
  return (
    <section className="card p-5" aria-label={title}>
      <h2 className="mb-4 font-bold">{title}</h2>
      <div className="h-64">{children}</div>
    </section>
  );
}

export default function AdminDashboard() {
  usePageTitle('Admin Dashboard');
  const { isDark } = useTheme();
  const { data, loading, error, reload } = useFetch(async () => {
    const [patients, doctors, appointments, orders, reports] = await Promise.all([
      patientsApi.list(), doctorsApi.list(), appointmentsApi.list(), ordersApi.list(), reportsApi.list(),
    ]);
    return { patients, doctors, appointments, orders, reports };
  }, []);

  const stats = useMemo(() => {
    if (!data) return null;
    const { patients, appointments, orders, reports } = data;
    const nowM = new Date().getMonth();
    const monthly = MONTHS.map((m) => ({ month: m, appointments: 0, patients: 0, revenue: 0 }));
    appointments.forEach((a) => { const i = monthIndex(a.date); if (i >= 0) { monthly[i].appointments += 1; if (a.status === 'Completed') monthly[i].revenue += a.fee; } });
    orders.forEach((o) => { const i = monthIndex(o.date); if (i >= 0) monthly[i].revenue += o.total; });
    reports.forEach((r) => { const i = monthIndex(r.date); if (i >= 0 && r.status === 'Ready') monthly[i].revenue += r.charge; });
    let running = 0;
    const growth = monthly.map((m, idx) => {
      running += patients.filter((p) => monthIndex(p.createdAt) === idx).length;
      return { ...m, patients: idx <= nowM ? running : null };
    });
    const revenue = appointments.filter((a) => a.status === 'Completed').reduce((s, a) => s + a.fee, 0)
      + orders.reduce((s, o) => s + o.total, 0) + reports.filter((r) => r.status === 'Ready').reduce((s, r) => s + r.charge, 0);
    return { growth, revenue };
  }, [data]);

  if (loading && !data) return <PageLoader />;
  if (error) return <ErrorState message={error} onRetry={reload} />;

  const axis = isDark ? '#cbd5e1' : '#475569';
  const grid = isDark ? '#334155' : '#e2e8f0';
  const tip = { contentStyle: { background: isDark ? '#1e293b' : '#fff', border: `1px solid ${grid}`, borderRadius: 8, color: isDark ? '#f1f5f9' : '#0f172a' } };
  const recent = [...data.appointments].sort((a, b) => b.id - a.id).slice(0, 5);

  return (
    <>
      <PageHeader title="Admin Dashboard" subtitle="Live overview from db.json" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={FaUserInjured} label="Total Patients" value={data.patients.length} />
        <StatCard icon={FaUserMd} label="Total Doctors" value={data.doctors.length} color="bg-secondary-100 text-secondary-700" />
        <StatCard icon={FaCalendarCheck} label="Total Appointments" value={data.appointments.length} color="bg-amber-100 text-amber-700" />
        <StatCard icon={FaRupeeSign} label="Total Revenue" value={currency(stats.revenue)} color="bg-purple-100 text-purple-700" hint="Consultations + pharmacy + labs" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <ChartCard title="Monthly Appointments (2026)">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.growth}><CartesianGrid stroke={grid} strokeDasharray="3 3" /><XAxis dataKey="month" stroke={axis} fontSize={12} /><YAxis allowDecimals={false} stroke={axis} fontSize={12} /><Tooltip {...tip} /><Bar dataKey="appointments" name="Appointments" fill="#0F4C81" radius={[4, 4, 0, 0]} /></BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Patient Growth (cumulative)">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats.growth}><CartesianGrid stroke={grid} strokeDasharray="3 3" /><XAxis dataKey="month" stroke={axis} fontSize={12} /><YAxis allowDecimals={false} stroke={axis} fontSize={12} /><Tooltip {...tip} /><Line type="monotone" dataKey="patients" name="Patients" stroke="#15803d" strokeWidth={3} dot={{ r: 3 }} /></LineChart>
          </ResponsiveContainer>
        </ChartCard>
        <div className="xl:col-span-2">
          <ChartCard title="Revenue Growth (₹)">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.growth}><CartesianGrid stroke={grid} strokeDasharray="3 3" /><XAxis dataKey="month" stroke={axis} fontSize={12} /><YAxis stroke={axis} fontSize={12} tickFormatter={(v) => `${v / 1000}k`} /><Tooltip {...tip} formatter={(v) => currency(v)} /><Area type="monotone" dataKey="revenue" name="Revenue" stroke="#0F4C81" fill="#22C55E" fillOpacity={0.3} strokeWidth={2} /></AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>

      <section className="card mt-6 p-5" aria-labelledby="recent-h">
        <h2 id="recent-h" className="mb-3 font-bold">Recent Appointments</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="text-xs uppercase text-slate-500"><tr><th scope="col" className="py-2">Patient</th><th scope="col">Doctor</th><th scope="col">Date</th><th scope="col">Status</th></tr></thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {recent.map((a) => (
                <tr key={a.id}><td className="py-2.5 font-medium">{a.patientName}</td><td>{a.doctorName}</td><td>{formatDate(a.date)} {a.time}</td><td><Badge>{a.status}</Badge></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
