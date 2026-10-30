import { useState } from 'react';
import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt, FaClock } from 'react-icons/fa';
import { Input, Textarea } from '../../components/FormField';
import { HOSPITAL } from '../../data/constants';
import { usePageTitle } from '../../hooks/useUtils';
import { messagesApi, errMsg } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { todayISO, validators } from '../../utils/helpers';

export default function Contact() {
  usePageTitle('Contact Us', 'Contact AuroPulse Healthcare Hospital - address, phone, email and enquiry form.');
  const toast = useToast();
  const [v, setV] = useState({ name: '', email: '', phone: '', message: '' });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const set = (k) => (e) => setV((s) => ({ ...s, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!v.name.trim()) errs.name = 'Name is required';
    if (!validators.email(v.email)) errs.email = 'Enter a valid email address';
    if (v.phone && !validators.mobile(v.phone)) errs.phone = 'Enter a valid 10-digit mobile number';
    if (v.message.trim().length < 10) errs.message = 'Message must be at least 10 characters';
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setSaving(true);
    try {
      await messagesApi.create({ ...v, createdAt: todayISO() });
      toast.success('Thank you! Your message has been saved. We will get back to you soon.');
      setV({ name: '', email: '', phone: '', message: '' });
    } catch (err) { toast.error(errMsg(err)); } finally { setSaving(false); }
  };

  const info = [
    [FaMapMarkerAlt, 'Address', HOSPITAL.address],
    [FaPhoneAlt, 'Phone', `${HOSPITAL.phone} (Emergency: ${HOSPITAL.emergency})`],
    [FaEnvelope, 'Email', HOSPITAL.email],
    [FaClock, 'OPD Hours', 'Mon - Sat: 9:00 AM - 7:00 PM · Emergency: 24/7'],
  ];

  return (
    <section className="container-x py-10">
      <h1 className="text-3xl font-extrabold">Contact Us</h1>
      <p className="mt-1 text-slate-600 dark:text-slate-300">We are here to help - reach out any time.</p>
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <form onSubmit={submit} noValidate className="card space-y-4 p-6" aria-label="Contact form">
          <Input name="name" label="Your name" value={v.name} onChange={set('name')} error={errors.name} autoComplete="name" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input name="email" type="email" label="Email" value={v.email} onChange={set('email')} error={errors.email} autoComplete="email" />
            <Input name="phone" type="tel" label="Phone (optional)" value={v.phone} onChange={set('phone')} error={errors.phone} autoComplete="tel" />
          </div>
          <Textarea name="message" label="Message" rows={5} value={v.message} onChange={set('message')} error={errors.message} />
          <button className="btn-primary w-full" disabled={saving}>{saving ? 'Sending...' : 'Send Message'}</button>
        </form>
        <div className="space-y-5">
          <ul className="card divide-y divide-slate-100 dark:divide-slate-700">
            {info.map(([Icon, l, t]) => (
              <li key={l} className="flex gap-4 p-4"><Icon className="mt-1 shrink-0 text-primary-600" aria-hidden="true" /><div><p className="text-sm font-semibold">{l}</p><p className="text-sm text-slate-600 dark:text-slate-300">{t}</p></div></li>
            ))}
          </ul>
          <div role="img" aria-label="Google Map placeholder" className="flex h-64 items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-100 text-center text-slate-500 dark:border-slate-600 dark:bg-slate-800">
            <div><FaMapMarkerAlt className="mx-auto text-4xl text-red-500" aria-hidden="true" /><p className="mt-2 font-semibold">Google Map Placeholder</p><p className="text-sm">Embed your Google Maps iframe here</p></div>
          </div>
        </div>
      </div>
    </section>
  );
}
