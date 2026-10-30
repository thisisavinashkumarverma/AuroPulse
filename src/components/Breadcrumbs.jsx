import { Link, useLocation } from 'react-router-dom';
import { FaChevronRight, FaHome } from 'react-icons/fa';

const LABELS = { ent: 'ENT', admin: 'Admin', patient: 'Patient', faq: 'FAQ' };
const ROOTS = { patient: '/patient', admin: '/admin' };

const pretty = (s) => LABELS[s] || s.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

export default function Breadcrumbs({ className = '' }) {
  const { pathname } = useLocation();
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
        <li>
          <Link to="/" className="inline-flex items-center gap-1 hover:text-primary-600"><FaHome aria-hidden="true" /> Home</Link>
        </li>
        {parts.map((p, i) => {
          const to = i === 0 && ROOTS[p] ? ROOTS[p] : `/${parts.slice(0, i + 1).join('/')}`;
          const last = i === parts.length - 1;
          return (
            <li key={to} className="flex items-center gap-1.5">
              <FaChevronRight className="text-[10px]" aria-hidden="true" />
              {last
                ? <span aria-current="page" className="font-semibold text-slate-800 dark:text-slate-100">{pretty(p)}</span>
                : <Link to={to} className="hover:text-primary-600">{pretty(p)}</Link>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
