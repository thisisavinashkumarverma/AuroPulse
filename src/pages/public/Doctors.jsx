import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import DoctorCard from '../../components/DoctorCard';
import Pagination from '../../components/Pagination';
import { EmptyState, ErrorState, PageLoader } from '../../components/Spinner';
import { Select } from '../../components/FormField';
import useFetch from '../../hooks/useFetch';
import { usePageTitle } from '../../hooks/useUtils';
import { doctorsApi } from '../../services/api';
import { DEPARTMENT_NAMES } from '../../data/departments';
import { useAuth } from '../../context/AuthContext';

const PAGE_SIZE = 8;

export default function Doctors() {
  usePageTitle('Our Doctors', 'Find experienced specialists at AuroPulse Healthcare Hospital. View availability and consultation fees.');
  const [params, setParams] = useSearchParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data, loading, error, reload } = useFetch(() => doctorsApi.list(), []);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('rating');

  const q = params.get('q') || '';
  const department = params.get('department') || '';
  const update = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value); else next.delete(key);
    setParams(next, { replace: true });
    setPage(1);
  };

  const filtered = useMemo(() => {
    const t = q.toLowerCase();
    return (data || [])
      .filter((d) => (!department || d.department === department) && (!t || `${d.name} ${d.specialization} ${d.department}`.toLowerCase().includes(t)))
      .sort((a, b) => (sort === 'fee' ? a.fee - b.fee : sort === 'experience' ? b.experience - a.experience : sort === 'name' ? a.name.localeCompare(b.name) : b.rating - a.rating));
  }, [data, q, department, sort]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const book = (doc) => navigate(user ? `/patient/appointments?doctor=${doc.id}` : '/login', { state: { from: { pathname: '/patient/appointments', search: `?doctor=${doc.id}` } } });

  return (
    <section className="container-x py-10">
      <h1 className="text-3xl font-extrabold">Our Doctors</h1>
      <p className="mt-1 text-slate-600 dark:text-slate-300">Search by name or specialty, then book a consultation.</p>

      <div className="card mt-6 grid gap-4 p-4 sm:grid-cols-3">
        <div>
          <label htmlFor="doc-search" className="label">Search</label>
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input id="doc-search" type="search" className="input pl-9" value={q} onChange={(e) => update('q', e.target.value)} placeholder="Doctor or specialization" />
          </div>
        </div>
        <Select id="doc-dept" label="Department" value={department} onChange={(e) => update('department', e.target.value)} options={DEPARTMENT_NAMES} placeholder="All departments" />
        <Select id="doc-sort" label="Sort by" value={sort} onChange={(e) => setSort(e.target.value)} options={[{ value: 'rating', label: 'Top rated' }, { value: 'experience', label: 'Most experienced' }, { value: 'fee', label: 'Lowest fee' }, { value: 'name', label: 'Name (A-Z)' }]} />
      </div>

      <div className="mt-8">
        {loading ? <PageLoader /> : error ? <ErrorState message={error} onRetry={reload} /> : filtered.length === 0 ? <EmptyState title="No doctors found" message="Try a different search or department." /> : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{visible.map((d) => <DoctorCard key={d.id} doctor={d} onBook={book} />)}</div>
            <Pagination page={page} pages={pages} onChange={setPage} total={filtered.length} pageSize={PAGE_SIZE} />
          </>
        )}
      </div>
    </section>
  );
}
