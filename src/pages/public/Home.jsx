import { Link, useNavigate } from 'react-router-dom';
import {
  FaAmbulance, FaArrowRight, FaCheckCircle, FaClock, FaHeartbeat, FaMicroscope, FaPhoneAlt, FaShieldAlt, FaStar, FaUserMd, FaPills, FaHospital,
} from 'react-icons/fa';
import { SectionHeading } from '../../components/PageHeader';
import DoctorCard from '../../components/DoctorCard';
import { PageLoader } from '../../components/Spinner';
import useFetch from '../../hooks/useFetch';
import { useCountUp, usePageTitle } from '../../hooks/useUtils';
import { doctorsApi } from '../../services/api';
import { DEPARTMENTS } from '../../data/departments';
import { HOSPITAL, STATS, TESTIMONIALS } from '../../data/constants';
import { useAuth } from '../../context/AuthContext';

const FEATURES = [
  { icon: FaUserMd, title: 'Expert Specialists', text: 'Board-certified doctors with decades of combined experience across 8 specialties.' },
  { icon: FaAmbulance, title: '24/7 Emergency Care', text: 'Fully equipped trauma centre and ICU with rapid-response ambulances.' },
  { icon: FaMicroscope, title: 'Advanced Diagnostics', text: 'In-house MRI, CT, digital X-ray and a NABL-accredited pathology lab.' },
  { icon: FaPills, title: 'Online Pharmacy', text: 'Order genuine medicines online and set smart dosage reminders.' },
  { icon: FaShieldAlt, title: 'Safe & Hygienic', text: 'International infection-control standards across every ward.' },
  { icon: FaClock, title: 'Zero-Wait Booking', text: 'Book, reschedule and track appointments from any device.' },
];

function Counter({ stat }) {
  const [value, ref] = useCountUp(stat.value);
  return (
    <div ref={ref} className="text-center">
      <p className="text-4xl font-extrabold text-white sm:text-5xl">{value.toLocaleString('en-IN')}{stat.suffix}</p>
      <p className="mt-1 text-sm font-medium text-primary-100">{stat.label}</p>
    </div>
  );
}

export default function Home() {
  usePageTitle('Compassionate Care, Advanced Medicine', 'AuroPulse Healthcare Hospital - 24/7 emergency care, expert doctors, online appointments, e-pharmacy and digital medical reports.');
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: doctors, loading } = useFetch(() => doctorsApi.list({ _sort: 'rating', _order: 'desc', _limit: 4 }), []);

  const book = (doc) => navigate(user ? `/patient/appointments?doctor=${doc.id}` : '/login', { state: { from: { pathname: `/patient/appointments`, search: `?doctor=${doc.id}` } } });

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 text-white">
        <div className="container-x grid items-center gap-10 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold"><FaHeartbeat aria-hidden="true" /> NABH Accredited · 450 Beds</span>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight text-white sm:text-5xl">Compassionate Care,<br />Advanced Medicine.</h1>
            <p className="mt-4 max-w-lg text-lg text-primary-100">Book appointments, view reports, order medicines and manage your health journey with AuroPulse Healthcare Hospital - all in one place.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/patient/appointments" className="btn bg-white px-6 py-3 text-primary-700 hover:bg-primary-50">Book Appointment <FaArrowRight aria-hidden="true" /></Link>
              <Link to="/doctors" className="btn border border-white/60 px-6 py-3 text-white hover:bg-white/10">Find a Doctor</Link>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-md" aria-hidden="true">
            <div className="rounded-3xl bg-white/10 p-8 backdrop-blur">
              <FaHospital className="mx-auto h-40 w-40 text-white/90" />
              <div className="mt-6 grid grid-cols-2 gap-3 text-center">
                <div className="rounded-xl bg-white/15 p-3"><p className="text-2xl font-bold">120+</p><p className="text-xs text-primary-100">Doctors</p></div>
                <div className="rounded-xl bg-white/15 p-3"><p className="text-2xl font-bold">4.8 <FaStar className="inline text-amber-300" /></p><p className="text-xs text-primary-100">Patient rating</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency */}
      <section aria-label="Emergency contact" className="bg-red-600 text-white">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-5 text-center sm:flex-row sm:text-left">
          <div className="flex items-center gap-3"><FaAmbulance className="text-3xl" aria-hidden="true" /><div><p className="text-lg font-bold">Medical Emergency?</p><p className="text-sm text-red-100">Our trauma team is available round the clock.</p></div></div>
          <a href={`tel:${HOSPITAL.emergency.replace(/\s/g, '')}`} className="btn bg-white px-6 py-3 text-lg text-red-700 hover:bg-red-50"><FaPhoneAlt aria-hidden="true" /> {HOSPITAL.emergency}</a>
        </div>
      </section>

      {/* Overview */}
      <section className="container-x grid items-center gap-10 py-16 lg:grid-cols-2">
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-secondary-700 dark:text-secondary-400">Hospital Overview</p>
          <h2 className="mt-1 text-3xl font-extrabold sm:text-4xl">A multi-specialty hospital that puts patients first</h2>
          <p className="mt-4 text-slate-600 dark:text-slate-300">Since 2008, AuroPulse has combined clinical excellence with a human touch. From preventive health checks to complex surgeries, our integrated teams deliver safe, evidence-based care with transparent pricing.</p>
          <ul className="mt-6 space-y-3">
            {['450-bed multi-specialty hospital with 12 modular operation theatres', 'Dedicated cardiac, neuro and cancer care centres', 'Digital health records, online reports and telemedicine'].map((t) => (
              <li key={t} className="flex gap-3"><FaCheckCircle className="mt-1 shrink-0 text-secondary-600" aria-hidden="true" /> {t}</li>
            ))}
          </ul>
          <Link to="/about" className="btn-primary mt-8">Learn more about us</Link>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[['18+', 'Years of trust'], ['12', 'Operation theatres'], ['85', 'ICU beds'], ['24/7', 'Pharmacy & lab']].map(([n, l]) => (
            <div key={l} className="card p-6 text-center"><p className="text-3xl font-extrabold text-primary-600 dark:text-primary-200">{n}</p><p className="text-sm text-slate-500 dark:text-slate-400">{l}</p></div>
          ))}
        </div>
      </section>

      {/* Featured Doctors */}
      <section className="bg-white py-16 dark:bg-slate-800/50">
        <div className="container-x">
          <SectionHeading eyebrow="Meet our team" title="Featured Doctors" subtitle="Top-rated specialists ready to care for you and your family." />
          {loading ? <PageLoader /> : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {(doctors || []).map((d) => <DoctorCard key={d.id} doctor={d} onBook={book} />)}
            </div>
          )}
          <div className="mt-8 text-center"><Link to="/doctors" className="btn-outline">View all doctors</Link></div>
        </div>
      </section>

      {/* Departments */}
      <section className="container-x py-16">
        <SectionHeading eyebrow="Our specialties" title="Departments" subtitle="Comprehensive care across eight centres of excellence." />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {DEPARTMENTS.map(({ slug, name, icon: Icon, description }) => (
            <Link key={slug} to={`/doctors?department=${encodeURIComponent(name)}`} className="card group p-6 transition hover:-translate-y-1 hover:border-primary-400 hover:shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-xl text-primary-600 group-hover:bg-primary-600 group-hover:text-white dark:bg-slate-700"><Icon aria-hidden="true" /></div>
              <h3 className="mt-4 text-lg font-bold">{name}</h3>
              <p className="mt-1 line-clamp-3 text-sm text-slate-600 dark:text-slate-300">{description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Why choose us */}
      <section className="bg-primary-50 py-16 dark:bg-slate-800/50">
        <div className="container-x">
          <SectionHeading eyebrow="Why AuroPulse" title="Why Choose Us" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, text }) => (
              <div key={title} className="card flex gap-4 p-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-secondary-100 text-secondary-700"><Icon aria-hidden="true" /></div>
                <div><h3 className="font-bold">{title}</h3><p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{text}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section aria-label="Hospital statistics" className="bg-primary-700 py-14">
        <div className="container-x grid grid-cols-2 gap-8 lg:grid-cols-4">{STATS.map((s) => <Counter key={s.label} stat={s} />)}</div>
      </section>

      {/* Testimonials */}
      <section className="container-x py-16">
        <SectionHeading eyebrow="Patient stories" title="What Our Patients Say" />
        <div className="grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure key={t.name} className="card p-6">
              <div className="flex gap-1 text-amber-500" aria-label="5 out of 5 stars">{Array.from({ length: 5 }, (_, i) => <FaStar key={i} aria-hidden="true" />)}</div>
              <blockquote className="mt-3 text-slate-700 dark:text-slate-200">“{t.text}”</blockquote>
              <figcaption className="mt-4 text-sm"><strong>{t.name}</strong> <span className="text-slate-500">· {t.role}</span></figcaption>
            </figure>
          ))}
        </div>
      </section>
    </>
  );
}
