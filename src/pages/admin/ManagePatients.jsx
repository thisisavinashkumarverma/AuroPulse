import CrudPage from '../../components/CrudPage';
import { patientsApi } from '../../services/api';
import { usePageTitle } from '../../hooks/useUtils';
import { BLOOD_GROUPS, GENDERS } from '../../data/constants';
import { formatDate, todayISO, validators } from '../../utils/helpers';

const FIELDS = [
  { name: 'name', label: 'Full Name', required: true },
  { name: 'age', label: 'Age', type: 'number', required: true },
  { name: 'gender', label: 'Gender', type: 'select', options: GENDERS, required: true },
  { name: 'bloodGroup', label: 'Blood Group', type: 'select', options: BLOOD_GROUPS },
  { name: 'mobile', label: 'Mobile', type: 'tel', required: true },
  { name: 'email', label: 'Email', type: 'email', required: true },
  { name: 'address', label: 'Address', type: 'textarea' },
];

const COLUMNS = [
  { key: 'id', label: 'ID', render: (p) => `PT-${String(p.id).padStart(4, '0')}` },
  { key: 'name', label: 'Name' },
  { key: 'age', label: 'Age' },
  { key: 'gender', label: 'Gender' },
  { key: 'bloodGroup', label: 'Blood' },
  { key: 'mobile', label: 'Mobile' },
  { key: 'email', label: 'Email' },
  { key: 'createdAt', label: 'Registered', render: (p) => formatDate(p.createdAt) },
];

export default function ManagePatients() {
  usePageTitle('Manage Patients');
  return (
    <CrudPage
      title="Patients" singular="Patient" subtitle="Add, edit or remove patient records."
      api={patientsApi} columns={COLUMNS} fields={FIELDS}
      defaults={{ name: '', age: '', gender: '', bloodGroup: '', mobile: '', email: '', address: '' }}
      validate={(v) => ({
        ...(v.age !== '' && (Number(v.age) < 0 || Number(v.age) > 120) ? { age: 'Enter a valid age' } : {}),
        ...(v.mobile && !validators.mobile(v.mobile) ? { mobile: 'Enter a valid 10-digit mobile number' } : {}),
        ...(v.email && !validators.email(v.email) ? { email: 'Enter a valid email' } : {}),
      })}
      transform={(v, isNew) => (isNew ? { ...v, userId: null, createdAt: todayISO() } : v)}
    />
  );
}
