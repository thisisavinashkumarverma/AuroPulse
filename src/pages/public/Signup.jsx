import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { FaUserPlus } from 'react-icons/fa';
import { Input } from '../../components/FormField';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { usePageTitle } from '../../hooks/useUtils';
import { errMsg } from '../../services/api';
import { validators } from '../../utils/helpers';

export default function Signup() {
  usePageTitle('Create Account');
  const { user, signup } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [v, setV] = useState({ name: '', mobile: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/patient" replace />;
  const set = (k) => (e) => setV((s) => ({ ...s, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (v.name.trim().length < 3) errs.name = 'Enter your full name (min 3 characters)';
    if (!validators.mobile(v.mobile)) errs.mobile = 'Enter a valid 10-digit mobile number starting with 6-9';
    if (!validators.email(v.email)) errs.email = 'Enter a valid email address';
    if (!validators.strongPassword(v.password)) errs.password = 'Min 8 characters with uppercase, lowercase and a number';
    if (v.confirm !== v.password) errs.confirm = 'Passwords do not match';
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setBusy(true);
    try {
      await signup({ name: v.name.trim(), mobile: v.mobile, email: v.email.trim().toLowerCase(), password: v.password });
      toast.success('Account created! Please complete your profile.');
      navigate('/patient/profile', { replace: true });
    } catch (err) { toast.error(errMsg(err)); } finally { setBusy(false); }
  };

  return (
    <section className="container-x flex justify-center py-12">
      <div className="card w-full max-w-md p-8">
        <div className="mb-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-secondary-100 text-secondary-700"><FaUserPlus aria-hidden="true" /></div>
          <h1 className="mt-3 text-2xl font-extrabold">Create your account</h1>
          <p className="text-sm text-slate-500">Your details are saved in db.json (demo only).</p>
        </div>
        <form onSubmit={submit} noValidate className="space-y-4">
          <Input name="name" label="Full Name" value={v.name} onChange={set('name')} error={errors.name} autoComplete="name" />
          <Input name="mobile" type="tel" inputMode="numeric" maxLength={10} label="Mobile Number" value={v.mobile} onChange={(e) => setV({ ...v, mobile: e.target.value.replace(/\D/g, '') })} error={errors.mobile} autoComplete="tel" />
          <Input name="email" type="email" label="Email" value={v.email} onChange={set('email')} error={errors.email} autoComplete="email" />
          <Input name="password" type="password" label="Password" value={v.password} onChange={set('password')} error={errors.password} autoComplete="new-password" />
          <Input name="confirm" type="password" label="Confirm Password" value={v.confirm} onChange={set('confirm')} error={errors.confirm} autoComplete="new-password" />
          <button className="btn-secondary w-full" disabled={busy}>{busy ? 'Creating account...' : 'Sign Up'}</button>
        </form>
        <p className="mt-5 text-center text-sm">Already registered? <Link to="/login" className="link font-semibold">Login</Link></p>
      </div>
    </section>
  );
}
