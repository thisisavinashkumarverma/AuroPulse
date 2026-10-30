import { useState } from 'react';
import { FaClock, FaRupeeSign, FaStar, FaUserMd } from 'react-icons/fa';
import Badge from './Badge';

export function Avatar({ src, name, className = 'h-24 w-24' }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div className={`${className} flex items-center justify-center rounded-full bg-primary-100 text-primary-600`} role="img" aria-label={name}>
        <FaUserMd className="h-1/2 w-1/2" aria-hidden="true" />
      </div>
    );
  }
  return (
    <img src={src} alt={name} loading="lazy" width="96" height="96" onError={() => setFailed(true)} className={`${className} rounded-full object-cover ring-4 ring-primary-100 dark:ring-slate-700`} />
  );
}

export default function DoctorCard({ doctor, onBook }) {
  return (
    <article className="card flex flex-col items-center p-5 text-center transition hover:-translate-y-1 hover:shadow-lg">
      <Avatar src={doctor.photo} name={doctor.name} />
      <h3 className="mt-3 text-lg font-bold">{doctor.name}</h3>
      <p className="text-sm font-medium text-primary-600 dark:text-primary-200">{doctor.specialization}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400">{doctor.department} · {doctor.qualification}</p>
      <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-slate-600 dark:text-slate-300">
        <span>{doctor.experience} yrs exp.</span>
        <span className="inline-flex items-center gap-1 text-amber-500"><FaStar aria-hidden="true" /> <span className="text-slate-600 dark:text-slate-300">{doctor.rating}</span></span>
      </div>
      <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400"><FaClock aria-hidden="true" /> {doctor.availability}</p>
      <div className="mt-3 flex items-center gap-3">
        <Badge>{doctor.available ? 'Available' : 'On Leave'}</Badge>
        <span className="inline-flex items-center text-sm font-bold"><FaRupeeSign className="text-xs" aria-hidden="true" />{doctor.fee}<span className="ml-1 text-xs font-normal text-slate-500">fee</span></span>
      </div>
      {onBook && (
        <button onClick={() => onBook(doctor)} disabled={!doctor.available} className="btn-primary mt-4 w-full">
          {doctor.available ? 'Book Appointment' : 'Unavailable'}
        </button>
      )}
    </article>
  );
}
