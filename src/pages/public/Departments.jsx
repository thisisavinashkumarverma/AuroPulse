import { Link } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import { DEPARTMENTS } from '../../data/departments';
import { usePageTitle } from '../../hooks/useUtils';
import useFetch from '../../hooks/useFetch';
import { doctorsApi } from '../../services/api';

export default function Departments() {
  usePageTitle('Departments', 'Explore AuroPulse specialties: Cardiology, Neurology, Orthopedics, Pediatrics, Oncology, Dermatology, ENT and Gynecology.');
  const { data: doctors } = useFetch(() => doctorsApi.list(), []);
  const count = (name) => (doctors || []).filter((d) => d.department === name).length;

  return (
    <section className="container-x py-10">
      <h1 className="text-3xl font-extrabold">Departments</h1>
      <p className="mt-1 text-slate-600 dark:text-slate-300">Eight centres of excellence under one roof.</p>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {DEPARTMENTS.map(({ slug, name, icon: Icon, description, services }) => (
          <article key={slug} id={slug} className="card p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary-600 text-2xl text-white"><Icon aria-hidden="true" /></div>
              <div>
                <h2 className="text-xl font-bold">{name}</h2>
                <p className="text-xs font-semibold text-secondary-700 dark:text-secondary-400">{doctors ? `${count(name)} specialists` : ' '}</p>
              </div>
            </div>
            <p className="mt-4 text-slate-600 dark:text-slate-300">{description}</p>
            <ul className="mt-3 space-y-1.5 text-sm">
              {services.map((s) => <li key={s} className="flex items-center gap-2"><FaCheckCircle className="text-secondary-600" aria-hidden="true" /> {s}</li>)}
            </ul>
            <Link to={`/doctors?department=${encodeURIComponent(name)}`} className="btn-outline mt-5">View {name} doctors</Link>
          </article>
        ))}
      </div>
    </section>
  );
}
