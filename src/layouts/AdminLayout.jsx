import {
  FaCalendarAlt, FaFileMedical, FaPills, FaTachometerAlt, FaUserInjured, FaUserMd,
} from 'react-icons/fa';
import DashboardShell from './DashboardShell';
import { useAuth } from '../context/AuthContext';

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: FaTachometerAlt, end: true },
  { to: '/admin/patients', label: 'Patients', icon: FaUserInjured },
  { to: '/admin/doctors', label: 'Doctors', icon: FaUserMd },
  { to: '/admin/appointments', label: 'Appointments', icon: FaCalendarAlt },
  { to: '/admin/medicines', label: 'Medicines', icon: FaPills },
  { to: '/admin/reports', label: 'Reports', icon: FaFileMedical },
];

export default function AdminLayout() {
  const { admin, adminLogout } = useAuth();
  return (
    <DashboardShell
      nav={NAV}
      userName={admin?.name}
      roleLabel="Administrator"
      onLogout={adminLogout}
      searchScope="admin"
      logoTo="/admin"
      accent="bg-primary-900"
    />
  );
}
