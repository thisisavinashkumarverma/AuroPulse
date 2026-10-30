import { FaBed, FaBullseye, FaEye, FaFlask, FaHeartbeat, FaParking, FaProcedures, FaUtensils, FaWifi, FaXRay } from 'react-icons/fa';
import { SectionHeading } from '../../components/PageHeader';
import { usePageTitle } from '../../hooks/useUtils';

const TIMELINE = [
  ['2008', 'AuroPulse opens as a 60-bed community hospital in Anna Nagar, Chennai.'],
  ['2012', 'Launch of the Cardiac Sciences and Trauma centres; NABH accreditation.'],
  ['2017', 'New 250-bed tower with Neuro-sciences and Oncology institutes.'],
  ['2022', 'Digital health platform introduced - online records, e-pharmacy and teleconsultation.'],
  ['2026', '450 beds, 120+ specialists and over 52,000 patients treated.'],
];

const INFRA = [
  { icon: FaBed, t: '450 Patient Beds', d: 'Private, semi-private and general wards.' },
  { icon: FaProcedures, t: '12 Modular OTs', d: 'Laminar-flow operation theatres.' },
  { icon: FaHeartbeat, t: '85 ICU Beds', d: 'Cardiac, neuro, surgical and neonatal ICUs.' },
  { icon: FaXRay, t: 'Imaging Centre', d: '3T MRI, 128-slice CT, digital X-ray.' },
  { icon: FaFlask, t: 'Pathology Lab', d: 'NABL-accredited 24/7 laboratory.' },
  { icon: FaUtensils, t: 'Dietary Services', d: 'Clinical nutrition and hygienic kitchen.' },
  { icon: FaParking, t: 'Parking', d: 'Basement parking for 300 vehicles.' },
  { icon: FaWifi, t: 'Patient Amenities', d: 'Free Wi-Fi, cafeteria and pharmacy.' },
];

export default function About() {
  usePageTitle('About Us', 'Learn about AuroPulse Healthcare Hospital - our history, mission, vision, infrastructure and facilities.');
  return (
    <>
      <section className="container-x py-12">
        <SectionHeading eyebrow="About us" title="Caring for Chennai since 2008" subtitle="AuroPulse Healthcare Hospital has grown from a 60-bed community hospital into a leading multi-specialty centre." />
        <ol className="relative mx-auto max-w-3xl border-l-2 border-primary-200 pl-6">
          {TIMELINE.map(([y, t]) => (
            <li key={y} className="mb-8 last:mb-0">
              <span className="absolute -left-[9px] mt-1 h-4 w-4 rounded-full border-2 border-white bg-secondary-500" aria-hidden="true" />
              <p className="font-extrabold text-primary-600 dark:text-primary-200">{y}</p>
              <p className="text-slate-600 dark:text-slate-300">{t}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-white py-14 dark:bg-slate-800/50">
        <div className="container-x grid gap-6 md:grid-cols-2">
          <div className="card p-8">
            <FaBullseye className="text-3xl text-primary-600" aria-hidden="true" />
            <h2 className="mt-3 text-2xl font-bold">Our Mission</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300">To deliver safe, affordable and compassionate healthcare through clinical excellence, continuous innovation and respect for every patient.</p>
          </div>
          <div className="card p-8">
            <FaEye className="text-3xl text-secondary-600" aria-hidden="true" />
            <h2 className="mt-3 text-2xl font-bold">Our Vision</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300">To be South India's most trusted healthcare institution, setting the benchmark for patient experience and medical outcomes.</p>
          </div>
        </div>
      </section>

      <section className="container-x py-14">
        <SectionHeading eyebrow="Infrastructure & Facilities" title="Built around your comfort and safety" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {INFRA.map(({ icon: Icon, t, d }) => (
            <div key={t} className="card p-5">
              <Icon className="text-2xl text-primary-600" aria-hidden="true" />
              <h3 className="mt-3 font-bold">{t}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">{d}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
