import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaBars, FaPhoneAlt, FaTimes } from 'react-icons/fa';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import GlobalSearch from './GlobalSearch';
import { useAuth } from '../context/AuthContext';
import { HOSPITAL } from '../data/constants';

const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About' },
  { to: '/doctors', label: 'Doctors' },
  { to: '/departments', label: 'Departments' },
  { to: '/contact', label: 'Contact' },
];

const linkCls = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm font-semibold ${isActive ? 'bg-primary-50 text-primary-700 dark:bg-slate-700 dark:text-white' : 'text-slate-700 hover:text-primary-600 dark:text-slate-200'}`;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, admin } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-700 dark:bg-slate-900/95">
      <div className="bg-red-600 text-white">
        <div className="container-x flex items-center justify-between py-1.5 text-xs sm:text-sm">
          <span className="inline-flex items-center gap-2 font-semibold"><FaPhoneAlt aria-hidden="true" /> 24/7 Emergency: <a href={`tel:${HOSPITAL.emergency.replace(/\s/g, '')}`} className="underline">{HOSPITAL.emergency}</a></span>
          <span className="hidden sm:block">Ambulance: 108</span>
        </div>
      </div>
      <div className="container-x flex h-16 items-center justify-between gap-4">
        <Logo />
        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => <NavLink key={l.to} to={l.to} end={l.end} className={linkCls}>{l.label}</NavLink>)}
        </nav>
        <div className="flex items-center gap-2">
          <GlobalSearch className="hidden w-56 xl:block" />
          <ThemeToggle />
          {user ? (
            <Link to="/patient" className="btn-primary hidden sm:inline-flex">My Dashboard</Link>
          ) : admin ? (
            <Link to="/admin" className="btn-primary hidden sm:inline-flex">Admin Panel</Link>
          ) : (
            <>
              <Link to="/login" className="btn-outline hidden sm:inline-flex">Login</Link>
              <Link to="/signup" className="btn-secondary hidden sm:inline-flex">Sign Up</Link>
            </>
          )}
          <button className="rounded-lg p-2 lg:hidden" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="mobile-menu" aria-label="Toggle menu">
            {open ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>
      {open && (
        <nav id="mobile-menu" aria-label="Mobile" className="border-t border-slate-200 bg-white p-4 lg:hidden dark:border-slate-700 dark:bg-slate-900">
          <GlobalSearch className="mb-3" />
          <div className="flex flex-col gap-1" onClick={() => setOpen(false)}>
            {LINKS.map((l) => <NavLink key={l.to} to={l.to} end={l.end} className={linkCls}>{l.label}</NavLink>)}
            {user ? <Link to="/patient" className="btn-primary mt-2">My Dashboard</Link> : (
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Link to="/login" className="btn-outline">Login</Link>
                <Link to="/signup" className="btn-secondary">Sign Up</Link>
              </div>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
