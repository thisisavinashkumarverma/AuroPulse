import { Link } from 'react-router-dom';

export default function Logo({ light = false, to = '/' }) {
  return (
    <Link to={to} className="flex items-center gap-2" aria-label="AuroPulse Healthcare Hospital - home">
      <svg viewBox="0 0 64 64" className="h-9 w-9" aria-hidden="true">
        <rect width="64" height="64" rx="14" fill={light ? '#fff' : '#0F4C81'} />
        <path d="M26 14h12v12h12v12H38v12H26V38H14V26h12z" fill={light ? '#0F4C81' : '#fff'} />
        <circle cx="32" cy="32" r="5" fill="#22C55E" />
      </svg>
      <span className="leading-tight">
        <span className={`block text-lg font-extrabold ${light ? 'text-white' : 'text-primary-600 dark:text-white'}`}>AuroPulse</span>
        <span className={`block text-[10px] font-semibold uppercase tracking-widest ${light ? 'text-primary-100' : 'text-secondary-700 dark:text-secondary-400'}`}>Healthcare Hospital</span>
      </span>
    </Link>
  );
}
