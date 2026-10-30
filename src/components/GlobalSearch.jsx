import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { doctorsApi, medicinesApi, patientsApi } from '../services/api';
import { DEPARTMENTS } from '../data/departments';
import { useDebounce } from '../hooks/useUtils';

/** "Search everywhere": searches departments, doctors, medicines (and patients in admin scope). */
export default function GlobalSearch({ scope = 'public', className = '' }) {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(null);
  const navigate = useNavigate();
  const ref = useRef(null);
  const dq = useDebounce(q, 200);

  useEffect(() => {
    if (!open || index) return;
    (async () => {
      try {
        const [d, m, p] = await Promise.all([
          doctorsApi.list(), medicinesApi.list(), scope === 'admin' ? patientsApi.list() : Promise.resolve([]),
        ]);
        setIndex([
          ...DEPARTMENTS.map((x) => ({ type: 'Department', label: x.name, sub: 'Specialty', to: '/departments' })),
          ...d.map((x) => ({ type: 'Doctor', label: x.name, sub: x.specialization, to: scope === 'admin' ? '/admin/doctors' : `/doctors?q=${encodeURIComponent(x.name)}` })),
          ...m.map((x) => ({ type: 'Medicine', label: x.name, sub: x.category, to: scope === 'admin' ? '/admin/medicines' : `/patient/pharmacy?q=${encodeURIComponent(x.name)}` })),
          ...p.map((x) => ({ type: 'Patient', label: x.name, sub: x.mobile, to: '/admin/patients' })),
        ]);
      } catch { setIndex([]); }
    })();
  }, [open, index, scope]);

  useEffect(() => {
    const onClick = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const results = useMemo(() => {
    const t = dq.trim().toLowerCase();
    if (!t) return [];
    return (index || []).filter((i) => `${i.label} ${i.sub}`.toLowerCase().includes(t)).slice(0, 8);
  }, [dq, index]);

  const go = (item) => { setOpen(false); setQ(''); navigate(item.to); };

  return (
    <div ref={ref} className={`relative ${className}`} role="search">
      <FaSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
      <input
        type="search"
        value={q}
        onChange={(e) => { setQ(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}
        placeholder="Search doctors, medicines..."
        aria-label="Search everywhere"
        className="input pl-9"
      />
      {open && q.trim() && (
        <ul className="card absolute left-0 right-0 z-50 mt-1 max-h-72 overflow-y-auto py-1 shadow-lg" role="listbox">
          {results.length === 0 && <li className="px-3 py-2 text-sm text-slate-500">{index ? 'No results' : 'Searching...'}</li>}
          {results.map((r) => (
            <li key={`${r.type}-${r.label}`} role="option" aria-selected="false">
              <button onClick={() => go(r)} className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-700">
                <span className="min-w-0"><span className="block truncate font-medium">{r.label}</span><span className="block truncate text-xs text-slate-500">{r.sub}</span></span>
                <span className="badge shrink-0 bg-primary-50 text-primary-700">{r.type}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
