import { Link } from 'react-router-dom';
import {
  FaCalendarCheck, FaCog, FaFileMedicalAlt, FaFileInvoiceDollar, FaPills, FaShoppingCart, FaTachometerAlt, FaUser, FaBell,
} from 'react-icons/fa';
import DashboardShell from './DashboardShell';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import useReminderAlerts from '../hooks/useReminderAlerts';

const NAV = [
  { to: '/patient', label: 'Dashboard', icon: FaTachometerAlt, end: true },
  { to: '/patient/profile', label: 'Profile', icon: FaUser },
  { to: '/patient/appointments', label: 'Appointments', icon: FaCalendarCheck },
  { to: '/patient/reports', label: 'Reports', icon: FaFileMedicalAlt },
  { to: '/patient/pharmacy', label: 'Pharmacy', icon: FaPills },
  { to: '/patient/reminders', label: 'Medicine Reminder', icon: FaBell },
  { to: '/patient/billing', label: 'Billing', icon: FaFileInvoiceDollar },
  { to: '/patient/settings', label: 'Settings', icon: FaCog },
];

export default function PatientLayout() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  useReminderAlerts(user?.id, user?.settings?.reminderAlerts !== false);

  return (
    <DashboardShell
      nav={NAV}
      userName={user?.name}
      roleLabel="Patient"
      onLogout={logout}
      searchScope="patient"
      logoTo="/patient"
      cartSlot={(
        <Link to="/patient/pharmacy" className="relative rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-700" aria-label={`Cart, ${count} items`}>
          <FaShoppingCart aria-hidden="true" />
          {count > 0 && <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-secondary-700 px-1 text-[10px] font-bold text-white">{count}</span>}
        </Link>
      )}
    />
  );
}
