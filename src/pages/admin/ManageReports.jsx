import CrudPage from '../../components/CrudPage';
import Badge from '../../components/Badge';
import useFetch from '../../hooks/useFetch';
import { PageLoader } from '../../components/Spinner';
import { doctorsApi, patientsApi, reportsApi } from '../../services/api';
import { usePageTitle } from '../../hooks/useUtils';
import { REPORT_TYPES } from '../../data/constants';
import { currency, formatDate, todayISO } from '../../utils/helpers';

const COLUMNS = [
  { key: 'name', label: 'Report' },
  { key: 'type', label: 'Type' },
  { key: 'patientName', label: 'Patient' },
  { key: 'doctorName', label: 'Doctor' },
  { key: 'date', label: 'Date', render: (r) => formatDate(r.date) },
  { key: 'charge', label: 'Charge', render: (r) => currency(r.charge) },
  { key: 'status', label: 'Status', render: (r) => <Badge>{r.status}</Badge> },
];

export default function ManageReports() {
  usePageTitle('Manage Reports');
  const lists = useFetch(async () => {
    const [patients, doctors] = await Promise.all([patientsApi.list(), doctorsApi.list()]);
    return { patients, doctors };
  }, []);
  if (!lists.data) return <PageLoader />;
  const { patients, doctors } = lists.data;

  const fields = [
    { name: 'patientId', label: 'Patient', type: 'select', required: true, options: patients.map((p) => ({ value: String(p.id), label: `${p.name} (PT-${String(p.id).padStart(4, '0')})` })) },
    { name: 'type', label: 'Report Type', type: 'select', options: REPORT_TYPES, required: true },
    { name: 'name', label: 'Report Name', required: true, placeholder: 'e.g. Complete Blood Count' },
    { name: 'doctorId', label: 'Doctor', type: 'select', required: true, options: doctors.map((d) => ({ value: String(d.id), label: d.name })) },
    { name: 'date', label: 'Report Date', type: 'date', required: true },
    { name: 'charge', label: 'Lab Charge (₹)', type: 'number', required: true },
    { name: 'status', label: 'Status', type: 'select', options: ['Ready', 'Processing'], required: true },
    { name: 'notes', label: 'Findings / Notes', type: 'textarea', required: true },
  ];

  return (
    <CrudPage
      title="Reports" singular="Report" subtitle="Upload and manage patient reports." addLabel="Upload Report"
      api={reportsApi} columns={COLUMNS} fields={fields} allowEdit={false}
      defaults={{ patientId: '', type: '', name: '', doctorId: '', date: todayISO(), charge: '', status: 'Ready', notes: '' }}
      validate={(v) => (Number(v.charge) < 0 ? { charge: 'Charge cannot be negative' } : {})}
      transform={(v) => {
        const p = patients.find((x) => String(x.id) === String(v.patientId));
        const d = doctors.find((x) => String(x.id) === String(v.doctorId));
        const { patientId, doctorId, ...rest } = v; // eslint-disable-line no-unused-vars
        return { ...rest, userId: p?.userId ?? null, patientName: p?.name, doctorName: d?.name };
      }}
    />
  );
}
