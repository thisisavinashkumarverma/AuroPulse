import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function Pagination({ page, pages, onChange, total, pageSize }) {
  if (pages <= 1) return null;
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);
  const nums = Array.from({ length: pages }, (_, i) => i + 1).filter(
    (n) => n === 1 || n === pages || Math.abs(n - page) <= 1,
  );

  return (
    <nav aria-label="Pagination" className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
      <p className="text-sm text-slate-500 dark:text-slate-400">Showing {start}-{end} of {total}</p>
      <ul className="flex items-center gap-1">
        <li>
          <button className="btn-outline btn-sm" onClick={() => onChange(page - 1)} disabled={page === 1} aria-label="Previous page">
            <FaChevronLeft />
          </button>
        </li>
        {nums.map((n, i) => (
          <li key={n} className="flex items-center">
            {i > 0 && n - nums[i - 1] > 1 && <span className="px-1 text-slate-400" aria-hidden="true">…</span>}
            <button
              onClick={() => onChange(n)}
              aria-current={n === page ? 'page' : undefined}
              className={`btn btn-sm ${n === page ? 'bg-primary-600 text-white' : 'btn-outline'}`}
            >
              {n}
            </button>
          </li>
        ))}
        <li>
          <button className="btn-outline btn-sm" onClick={() => onChange(page + 1)} disabled={page === pages} aria-label="Next page">
            <FaChevronRight />
          </button>
        </li>
      </ul>
    </nav>
  );
}
