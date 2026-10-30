import { useMemo, useState } from 'react';
import { FaSearch, FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';
import Pagination from './Pagination';

/**
 * Reusable table with search, column sorting and pagination.
 * columns: [{ key, label, sortable = true, accessor, render, className }]
 */
export default function DataTable({
  columns, rows, actions, pageSize = 8, searchPlaceholder = 'Search...', toolbar, empty = 'No records found.',
  initialSort = { key: 'id', dir: 'desc' },
}) {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState(initialSort);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => Object.values(r).some((v) => typeof v !== 'object' && String(v).toLowerCase().includes(q)));
  }, [rows, query]);

  const sorted = useMemo(() => {
    if (!sort.key) return filtered;
    const col = columns.find((c) => c.key === sort.key);
    const get = (r) => (col?.accessor ? col.accessor(r) : r[sort.key]);
    return [...filtered].sort((a, b) => {
      const x = get(a); const y = get(b);
      const cmp = typeof x === 'number' && typeof y === 'number'
        ? x - y
        : String(x ?? '').localeCompare(String(y ?? ''), undefined, { numeric: true });
      return sort.dir === 'asc' ? cmp : -cmp;
    });
  }, [filtered, sort, columns]);

  const pages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const current = Math.min(page, pages);
  const visible = sorted.slice((current - 1) * pageSize, current * pageSize);

  const toggleSort = (key) => setSort((s) => (s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }));

  return (
    <div className="card overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-700">
        <div className="relative w-full sm:max-w-xs">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            placeholder={searchPlaceholder}
            aria-label="Search table"
            className="input pl-9"
          />
        </div>
        {toolbar}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-900/50 dark:text-slate-400">
            <tr>
              {columns.map((c) => {
                const sortable = c.sortable !== false;
                const active = sort.key === c.key;
                const Icon = !active ? FaSort : sort.dir === 'asc' ? FaSortUp : FaSortDown;
                return (
                  <th key={c.key} scope="col" className="px-4 py-3 font-semibold" aria-sort={active ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'}>
                    {sortable ? (
                      <button onClick={() => toggleSort(c.key)} className="inline-flex items-center gap-1 uppercase hover:text-primary-600">
                        {c.label} <Icon aria-hidden="true" className={active ? 'text-primary-600' : 'opacity-40'} />
                      </button>
                    ) : c.label}
                  </th>
                );
              })}
              {actions && <th scope="col" className="px-4 py-3 font-semibold">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {visible.length === 0 && (
              <tr><td colSpan={columns.length + (actions ? 1 : 0)} className="px-4 py-10 text-center text-slate-500">{empty}</td></tr>
            )}
            {visible.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/40">
                {columns.map((c) => (
                  <td key={c.key} className={`px-4 py-3 ${c.className || ''}`}>
                    {c.render ? c.render(row) : row[c.key]}
                  </td>
                ))}
                {actions && <td className="whitespace-nowrap px-4 py-3">{actions(row)}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-4 pb-4">
        <Pagination page={current} pages={pages} onChange={setPage} total={sorted.length} pageSize={pageSize} />
      </div>
    </div>
  );
}
