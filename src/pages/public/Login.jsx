import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { FaSignInAlt } from 'react-icons/fa';
import { Input } from '../../components/FormField';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { usePageTitle } from '../../hooks/useUtils';
import { errMsg } from '../../services/api';
import { validators } from '../../utils/helpers';

export default function Login() {
  usePageTitle('Patient Login');
  const { user, login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from;
  const [v, setV] = useState({ mobile: '', password: '' });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/patient" replace />;

  const submit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!validators.mobile(v.mobile)) errs.mobile = 'Enter a valid 10-digit mobile number starting with 6-9';
    if (v.password.length < 6) errs.password = 'Password must be at least 6 characters';
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setBusy(true);
    try {
      const u = await login(v.mobile, v.password);
      toast.success(`Welcome back, ${u.name.split(' ')[0]}!`);
      navigate(from ? `${from.pathname}${from.search || ''}` : '/patient', { replace: true });
    } catch (err) { toast.error(errMsg(err)); } finally { setBusy(false); }
  };

  return (
    <section className="container-x flex justify-center py-12">
      <div className="card w-full max-w-md p-8">
        <div className="mb-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary-600"><FaSignInAlt aria-hidden="true" /></div>
          <h1 className="mt-3 text-2xl font-extrabold">Patient Login</h1>
          <p className="text-sm text-slate-500">Access appointments, reports and pharmacy.</p>
        </div>
        <form onSubmit={submit} noValidate className="space-y-4">
          <Input name="mobile" type="tel" inputMode="numeric" maxLength={10} label="Mobile Number" value={v.mobile} onChange={(e) => setV({ ...v, mobile: e.target.value.replace(/\D/g, '') })} error={errors.mobile} autoComplete="tel" />
          <Input name="password" type="password" label="Password" value={v.password} onChange={(e) => setV({ ...v, password: e.target.value })} error={errors.password} autoComplete="current-password" />
          <button className="btn-primary w-full" disabled={busy}>{busy ? 'Signing in...' : 'Login'}</button>
        </form>
       
        <p className="mt-5 text-center text-sm">New here? <Link to="/signup" className="link font-semibold">Create an account</Link></p>
        <p className="mt-2 text-center text-xs text-slate-500">Hospital staff? <Link to="/admin/login" className="link">Admin login</Link></p>
      </div>
    </section>
  );
}
