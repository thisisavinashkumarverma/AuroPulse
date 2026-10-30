import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import PublicLayout from '../layouts/PublicLayout';
import PatientLayout from '../layouts/PatientLayout';
import AdminLayout from '../layouts/AdminLayout';
import { PageLoader } from '../components/Spinner';

const modules = import.meta.glob('../pages/*/*.jsx');
const page = (path) => lazy(modules[`../pages/${path}.jsx`]);

const Home = page('public/Home');
const About = page('public/About');
const Doctors = page('public/Doctors');
const Departments = page('public/Departments');
const Contact = page('public/Contact');
const Login = page('public/Login');
const Signup = page('public/Signup');
const NotFound = page('public/NotFound');
const AdminLogin = page('admin/AdminLogin');

const PatientDashboard = page('patient/Dashboard');
const Profile = page('patient/Profile');
const Appointments = page('patient/Appointments');
const Reports = page('patient/Reports');
const Pharmacy = page('patient/Pharmacy');
const Reminders = page('patient/Reminders');
const Billing = page('patient/Billing');
const Settings = page('patient/Settings');

const AdminDashboard = page('admin/AdminDashboard');
const ManagePatients = page('admin/ManagePatients');
const ManageDoctors = page('admin/ManageDoctors');
const ManageMedicines = page('admin/ManageMedicines');
const ManageReports = page('admin/ManageReports');
const ManageAppointments = page('admin/ManageAppointments');

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="doctors" element={<Doctors />} />
          <Route path="departments" element={<Departments />} />
          <Route path="contact" element={<Contact />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="admin/login" element={<AdminLogin />} />
        </Route>

        <Route path="patient" element={<ProtectedRoute role="patient" />}>
          <Route element={<PatientLayout />}>
            <Route index element={<PatientDashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="reports" element={<Reports />} />
            <Route path="pharmacy" element={<Pharmacy />} />
            <Route path="reminders" element={<Reminders />} />
            <Route path="billing" element={<Billing />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>

        <Route path="admin" element={<ProtectedRoute role="admin" />}>
          <Route element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="patients" element={<ManagePatients />} />
            <Route path="doctors" element={<ManageDoctors />} />
            <Route path="medicines" element={<ManageMedicines />} />
            <Route path="reports" element={<ManageReports />} />
            <Route path="appointments" element={<ManageAppointments />} />
          </Route>
        </Route>

        <Route element={<PublicLayout />}>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
