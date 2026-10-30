import { useEffect, useMemo, useState } from 'react';
import { Input, Select, Textarea } from './FormField';
import { appointmentsApi, errMsg } from '../services/api';
import { useToast } from '../context/ToastContext';
import { DEPARTMENT_NAMES } from '../data/departments';
import { TIME_SLOTS } from '../data/constants';
import { todayISO } from '../utils/helpers';

/** Used for both booking (appointment = null) and rescheduling (appointment = record). */
export default function AppointmentForm({ doctors, initialDoctor, user, appointment, onSaved, onClose }) {
  const toast = useToast();
  const reschedule = !!appointment;
  const [values, setValues] = useState({
    patientName: appointment?.patientName || user.name || '',
    department: appointment?.department || initialDoctor?.department || '',
    doctorId: String(appointment?.doctorId || initialDoctor?.id || ''),
    date: appointment?.date || '',
    time: appointment?.time || '',
    reason: appointment?.reason || '',
  });
  const [errors, setErrors] = useState({});
  const [taken, setTaken] = useState([]);
  const [saving, setSaving] = useState(false);

  const doctorList = useMemo(
    () => doctors.filter((d) => d.available && (!values.department || d.department === values.department)),
    [doctors, values.department],
  );
  const doctor = doctors.find((d) => String(d.id) === values.doctorId);

  useEffect(() => {
    if (!values.doctorId || !values.date) { setTaken([]); return; }
    appointmentsApi.list({ doctorId: values.doctorId, date: values.date })
      .then((list) => setTaken(list.filter((a) => a.id !== appointment?.id && !['Cancelled', 'Rejected'].includes(a.status)).map((a) => a.time)))
      .catch(() => setTaken([]));
  }, [values.doctorId, values.date, appointment?.id]);

  const set = (name) => (e) => setValues((v) => ({ ...v, [name]: e.target.value }));
  const setDepartment = (e) => setValues((v) => ({ ...v, department: e.target.value, doctorId: '' }));
  const setDoctor = (e) => {
    const d = doctors.find((x) => String(x.id) === e.target.value);
    setValues((v) => ({ ...v, doctorId: e.target.value, department: d?.department || v.department }));
  };

  const submit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!values.patientName.trim()) errs.patientName = 'Patient name is required';
    if (!values.doctorId) errs.doctorId = 'Please choose a doctor';
    if (!values.date) errs.date = 'Choose a date';
    else if (values.date < todayISO()) errs.date = 'Date cannot be in the past';
    if (!values.time) errs.time = 'Choose a time slot';
    else if (taken.includes(values.time)) errs.time = 'That slot is already booked';
    if (values.reason.trim().length < 5) errs.reason = 'Please describe the reason (min 5 characters)';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setSaving(true);
    try {
      if (reschedule) {
        await appointmentsApi.update(appointment.id, { date: values.date, time: values.time, status: 'Pending' });
        toast.success('Appointment rescheduled. Awaiting approval.');
      } else {
        await appointmentsApi.create({
          userId: user.id, patientName: values.patientName.trim(), doctorId: doctor.id, doctorName: doctor.name,
          department: doctor.department, date: values.date, time: values.time, reason: values.reason.trim(),
          status: 'Pending', fee: doctor.fee, createdAt: todayISO(),
        });
        toast.success('Appointment booked successfully!');
      }
      onSaved();
    } catch (err) { toast.error(errMsg(err)); } finally { setSaving(false); }
  };

  return (
    <form onSubmit={submit} noValidate className="grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2"><Input name="patientName" label="Patient Name" value={values.patientName} onChange={set('patientName')} error={errors.patientName} disabled={reschedule} /></div>
      <Select name="department" label="Department" value={values.department} onChange={setDepartment} options={DEPARTMENT_NAMES} placeholder="All departments" disabled={reschedule} />
      <Select name="doctorId" label="Doctor" value={values.doctorId} onChange={setDoctor} error={errors.doctorId} placeholder="Select doctor" disabled={reschedule}
        options={(reschedule ? doctors : doctorList).map((d) => ({ value: String(d.id), label: `${d.name} - ₹${d.fee}` }))} />
      <Input name="date" type="date" label="Date" min={todayISO()} value={values.date} onChange={set('date')} error={errors.date} />
      <Select name="time" label="Time" value={values.time} onChange={set('time')} error={errors.time} placeholder="Select time"
        options={TIME_SLOTS.map((t) => ({ value: t, label: taken.includes(t) ? `${t} (booked)` : t }))} />
      <div className="sm:col-span-2"><Textarea name="reason" label="Reason for visit" value={values.reason} onChange={set('reason')} error={errors.reason} disabled={reschedule} /></div>
      {doctor && <p className="text-sm text-slate-600 sm:col-span-2 dark:text-slate-300">Consultation fee: <strong>₹{doctor.fee}</strong> · {doctor.availability}</p>}
      <div className="flex justify-end gap-2 sm:col-span-2">
        <button type="button" className="btn-outline" onClick={onClose}>Cancel</button>
        <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving...' : reschedule ? 'Reschedule' : 'Book Appointment'}</button>
      </div>
    </form>
  );
}
