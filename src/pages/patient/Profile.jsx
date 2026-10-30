import { useState } from 'react';
import { Input, Select, Textarea } from '../../components/FormField';
import PageHeader from '../../components/PageHeader';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { usePageTitle } from '../../hooks/useUtils';
import { errMsg } from '../../services/api';
import { BLOOD_GROUPS, GENDERS } from '../../data/constants';
import { validators } from '../../utils/helpers';

export default function Profile() {
  usePageTitle('My Profile');
  const { user, updateUser } = useAuth();
  const toast = useToast();
  const [v, setV] = useState({
    name: user.name || '', age: user.age ?? '', gender: user.gender || '', mobile: user.mobile || '',
    email: user.email || '', bloodGroup: user.bloodGroup || '', address: user.address || '',
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const set = (k) => (e) => setV((s) => ({ ...s, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (v.name.trim().length < 3) errs.name = 'Name must be at least 3 characters';
    if (v.age !== '' && (Number(v.age) < 0 || Number(v.age) > 120)) errs.age = 'Enter a valid age';
    if (!validators.mobile(v.mobile)) errs.mobile = 'Enter a valid 10-digit mobile number';
    if (!validators.email(v.email)) errs.email = 'Enter a valid email';
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setSaving(true);
    try {
      await updateUser({ ...v, age: v.age === '' ? '' : Number(v.age) });
      toast.success('Profile updated successfully');
    } catch (err) { toast.error(errMsg(err)); } finally { setSaving(false); }
  };

  return (
    <>
      <PageHeader title="My Profile" subtitle="Keep your personal and medical details up to date." />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card flex flex-col items-center p-6 text-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary-600 text-4xl font-bold text-white" aria-hidden="true">{user.name[0]}</div>
          <h2 className="mt-3 text-xl font-bold">{user.name}</h2>
          <p className="text-sm text-slate-500">Patient ID: PT-{String(user.id).padStart(4, '0')}</p>
          <p className="mt-1 text-sm text-slate-500">Member since {user.createdAt}</p>
          {user.bloodGroup && <span className="badge mt-3 bg-red-100 text-red-700">Blood Group {user.bloodGroup}</span>}
        </div>
        <form onSubmit={submit} noValidate className="card grid gap-4 p-6 sm:grid-cols-2 lg:col-span-2">
          <Input name="name" label="Full Name" value={v.name} onChange={set('name')} error={errors.name} />
          <Input name="age" type="number" min="0" max="120" label="Age" value={v.age} onChange={set('age')} error={errors.age} />
          <Select name="gender" label="Gender" value={v.gender} onChange={set('gender')} options={GENDERS} placeholder="Select gender" />
          <Select name="bloodGroup" label="Blood Group" value={v.bloodGroup} onChange={set('bloodGroup')} options={BLOOD_GROUPS} placeholder="Select blood group" />
          <Input name="mobile" type="tel" maxLength={10} label="Mobile" value={v.mobile} onChange={set('mobile')} error={errors.mobile} />
          <Input name="email" type="email" label="Email" value={v.email} onChange={set('email')} error={errors.email} />
          <div className="sm:col-span-2"><Textarea name="address" label="Address" value={v.address} onChange={set('address')} /></div>
          <div className="flex justify-end sm:col-span-2"><button className="btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Update Profile'}</button></div>
        </form>
      </div>
    </>
  );
}
