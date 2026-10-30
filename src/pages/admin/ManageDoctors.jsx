import CrudPage from '../../components/CrudPage';
import Badge from '../../components/Badge';
import { Avatar } from '../../components/DoctorCard';
import { doctorsApi } from '../../services/api';
import { usePageTitle } from '../../hooks/useUtils';
import { DEPARTMENT_NAMES } from '../../data/departments';
import { currency } from '../../utils/helpers';

const FIELDS = [
  { name: 'name', label: 'Doctor Name', required: true, placeholder: 'Dr. Full Name' },
  { name: 'department', label: 'Department', type: 'select', options: DEPARTMENT_NAMES, required: true },
  { name: 'specialization', label: 'Specialization', required: true },
  { name: 'qualification', label: 'Qualification' },
  { name: 'experience', label: 'Experience (years)', type: 'number', required: true },
  { name: 'fee', label: 'Consultation Fee (₹)', type: 'number', required: true },
  { name: 'availability', label: 'Availability', required: true, placeholder: 'Mon - Fri | 9:00 AM - 3:00 PM' },
  { name: 'available', label: 'Status', type: 'select', options: [{ value: 'true', label: 'Available' }, { value: 'false', label: 'On Leave' }], required: true },
  { name: 'rating', label: 'Rating (0-5)', type: 'number' },
  { name: 'photo', label: 'Photo URL', placeholder: 'https://...' },
];

const COLUMNS = [
  { key: 'photo', label: 'Photo', sortable: false, render: (d) => <Avatar src={d.photo} name={d.name} className="h-10 w-10" /> },
  { key: 'name', label: 'Name' },
  { key: 'department', label: 'Department' },
  { key: 'specialization', label: 'Specialization' },
  { key: 'experience', label: 'Exp.', render: (d) => `${d.experience} yrs` },
  { key: 'fee', label: 'Fee', render: (d) => currency(d.fee) },
  { key: 'available', label: 'Status', accessor: (d) => (d.available ? 1 : 0), render: (d) => <Badge>{d.available ? 'Available' : 'On Leave'}</Badge> },
];

export default function ManageDoctors() {
  usePageTitle('Manage Doctors');
  return (
    <CrudPage
      title="Doctors" singular="Doctor" subtitle="Manage the hospital's medical staff."
      api={doctorsApi} columns={COLUMNS} fields={FIELDS}
      defaults={{ name: '', department: '', specialization: '', qualification: '', experience: '', fee: '', availability: '', available: 'true', rating: 4.5, photo: '' }}
      validate={(v) => ({
        ...(Number(v.experience) < 0 ? { experience: 'Cannot be negative' } : {}),
        ...(Number(v.fee) <= 0 ? { fee: 'Fee must be greater than 0' } : {}),
        ...(v.rating !== '' && (Number(v.rating) < 0 || Number(v.rating) > 5) ? { rating: 'Rating must be between 0 and 5' } : {}),
      })}
      transform={(v) => ({ ...v, available: String(v.available) === 'true', rating: v.rating === '' ? 4.5 : Number(v.rating) })}
    />
  );
}
