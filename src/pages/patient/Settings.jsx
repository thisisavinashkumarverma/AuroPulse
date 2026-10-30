import { useState } from 'react';
import PageHeader from '../../components/PageHeader';
import { Input } from '../../components/FormField';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { usePageTitle } from '../../hooks/useUtils';
import { errMsg, usersApi } from '../../services/api';
import { validators } from '../../utils/helpers';

function Toggle({ label, checked, onChange, id }) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-center justify-between gap-4 py-3">
      <span className="text-sm font-medium">{label}</span>
      <input id={id} type="checkbox" role="switch" checked={checked} onChange={onChange} className="h-5 w-5 accent-primary-600" />
    </label>
  );
}

export default function Settings() {
  usePageTitle('Settings');
  const { user, updateUser } = useAuth();
  const { mode, setMode } = useTheme();
  const toast = useToast();
  const settings = { emailAlerts: true, smsAlerts: true, reminderAlerts: true, ...user.settings };
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const toggle = (key) => async (e) => {
    try {
      await updateUser({ settings: { ...settings, [key]: e.target.checked } });
      toast.success('Preferences saved');
    } catch (err) { toast.error(errMsg(err)); }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    const errs = {};
    try {
      const full = await usersApi.get(user.id);
      if (full.password !== pw.current) errs.current = 'Current password is incorrect';
    } catch (err) { toast.error(errMsg(err)); return; }
    if (!validators.strongPassword(pw.next)) errs.next = 'Min 8 characters with uppercase, lowercase and a number';
    if (pw.next !== pw.confirm) errs.confirm = 'Passwords do not match';
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setSaving(true);
    try {
      await updateUser({ password: pw.next });
      toast.success('Password updated');
      setPw({ current: '', next: '', confirm: '' });
    } catch (err) { toast.error(errMsg(err)); } finally { setSaving(false); }
  };

  return (
    <>
      <PageHeader title="Settings" subtitle="Manage appearance, notifications and security." />
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card p-6" aria-labelledby="theme-h">
          <h2 id="theme-h" className="font-bold">Appearance</h2>
          <div className="mt-3 grid grid-cols-3 gap-2" role="radiogroup" aria-label="Theme">
            {['light', 'dark', 'system'].map((m) => (
              <button key={m} role="radio" aria-checked={mode === m} onClick={() => setMode(m)} className={`btn capitalize ${mode === m ? 'bg-primary-600 text-white' : 'btn-outline'}`}>{m}</button>
            ))}
          </div>
        </section>
        <section className="card p-6" aria-labelledby="notif-h">
          <h2 id="notif-h" className="font-bold">Notifications</h2>
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            <Toggle id="n-email" label="Email alerts for appointments & reports" checked={settings.emailAlerts} onChange={toggle('emailAlerts')} />
            <Toggle id="n-sms" label="SMS alerts" checked={settings.smsAlerts} onChange={toggle('smsAlerts')} />
            <Toggle id="n-rem" label="In-app medicine reminder alerts" checked={settings.reminderAlerts} onChange={toggle('reminderAlerts')} />
          </div>
        </section>
        <form onSubmit={changePassword} noValidate className="card space-y-4 p-6 lg:col-span-2 lg:max-w-xl">
          <h2 className="font-bold">Change Password</h2>
          <Input name="current" type="password" label="Current password" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} error={errors.current} autoComplete="current-password" />
          <Input name="next" type="password" label="New password" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} error={errors.next} autoComplete="new-password" />
          <Input name="confirm" type="password" label="Confirm new password" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} error={errors.confirm} autoComplete="new-password" />
          <button className="btn-primary" disabled={saving}>{saving ? 'Updating...' : 'Update Password'}</button>
        </form>
      </div>
    </>
  );
}
