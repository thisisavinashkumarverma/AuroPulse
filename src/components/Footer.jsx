import { Link } from 'react-router-dom';
import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa';
import Logo from './Logo';
import { HOSPITAL } from '../data/constants';
import { DEPARTMENTS } from '../data/departments';

export default function Footer() {
  return (
    <footer className="bg-primary-900 text-primary-100">
      <div className="container-x grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo light />
          <p className="mt-4 text-sm text-primary-200">Compassionate care backed by advanced medicine. Serving families in Chennai for over 18 years.</p>
        </div>
        <div>
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-white">Quick Links</h2>
          <ul className="space-y-2 text-sm">
            {[['/about', 'About Us'], ['/doctors', 'Our Doctors'], ['/departments', 'Departments'], ['/contact', 'Contact'], ['/login', 'Patient Login'], ['/admin/login', 'Admin Login']].map(([to, l]) => (
              <li key={to}><Link to={to} className="hover:text-white hover:underline">{l}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-white">Departments</h2>
          <ul className="space-y-2 text-sm">
            {DEPARTMENTS.slice(0, 6).map((d) => <li key={d.slug}><Link to="/departments" className="hover:text-white hover:underline">{d.name}</Link></li>)}
          </ul>
        </div>
        <div>
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-white">Contact</h2>
          <address className="space-y-3 text-sm not-italic">
            <p className="flex gap-2"><FaMapMarkerAlt className="mt-1 shrink-0" aria-hidden="true" /> {HOSPITAL.address}</p>
            <p className="flex gap-2"><FaPhoneAlt className="mt-1 shrink-0" aria-hidden="true" /> {HOSPITAL.phone}</p>
            <p className="flex gap-2"><FaEnvelope className="mt-1 shrink-0" aria-hidden="true" /> {HOSPITAL.email}</p>
          </address>
        </div>
      </div>
      <div className="border-t border-primary-800 py-4 text-center text-xs text-primary-200">
        © {new Date().getFullYear()} AuroPulse Healthcare Hospital. Demo project for portfolio purposes - not a real hospital.
      </div>
    </footer>
  );
}
