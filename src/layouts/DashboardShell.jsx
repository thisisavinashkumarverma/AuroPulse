import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { FaBars, FaSignOutAlt, FaTimes } from 'react-icons/fa';
import Logo from '../components/Logo';
import ThemeToggle from '../components/ThemeToggle';
import GlobalSearch from '../components/GlobalSearch';
import Breadcrumbs from '../components/Breadcrumbs';

/** Shared shell used by PatientLayout and AdminLayout. */
export default function DashboardShell({ nav, userName, roleLabel, onLogout, searchScope, logoTo, accent = 'bg-primary-700', cartSlot }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const sidebar = (
    <nav aria-label={`${roleLabel} navigation`} className="flex h-full flex-col">
      <div className={`flex h-16 items-center justify-between px-4 ${accent}`}>
        <Logo light to={logoTo} />
        <button className="text-white lg:hidden" onClick={() => setOpen(false)} aria-label="Close sidebar"><FaTimes /></button>
      </div>
      <ul className="flex-1 space-y-1 overflow-y-auto p-3">
        {nav.map(({ to, label, icon: Icon, end }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={end}
              onClick={() => setOpen(false)}
              className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold ${isActive ? 'bg-primary-600 text-white' : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700'}`}
            >
              <Icon aria-hidden="true" className="shrink-0" /> {label}
            </NavLink>
          </li>
        ))}
      </ul>
      <div className="border-t border-slate-200 p-3 dark:border-slate-700">
        <button onClick={() => { onLogout(); navigate(logoTo === '/admin' ? '/admin/login' : '/login'); }} className="btn-outline w-full"><FaSignOutAlt aria-hidden="true" /> Logout</button>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen lg:pl-64">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-[100] focus:rounded focus:bg-white focus:px-3 focus:py-2">Skip to main content</a>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-slate-200 bg-white lg:block dark:border-slate-700 dark:bg-slate-800">{sidebar}</aside>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/60" onClick={() => setOpen(false)} aria-hidden="true" />
          <aside className="absolute inset-y-0 left-0 w-64 bg-white dark:bg-slate-800">{sidebar}</aside>
        </div>
      )}
      <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/95 px-4 backdrop-blur dark:border-slate-700 dark:bg-slate-900/95">
        <button className="rounded-lg p-2 lg:hidden" onClick={() => setOpen(true)} aria-label="Open sidebar"><FaBars /></button>
        <GlobalSearch scope={searchScope} className="w-full max-w-sm" />
        <div className="ml-auto flex items-center gap-3">
          {cartSlot}
          <ThemeToggle />
          <div className="hidden text-right leading-tight sm:block">
            <p className="text-sm font-semibold">{userName}</p>
            <p className="text-xs text-slate-500">{roleLabel}</p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-600 text-sm font-bold text-white" aria-hidden="true">{userName?.[0]?.toUpperCase()}</div>
        </div>
      </header>
      <main id="main" className="p-4 sm:p-6">
        <Breadcrumbs className="mb-4" />
        <Outlet />
      </main>
    </div>
  );
}
