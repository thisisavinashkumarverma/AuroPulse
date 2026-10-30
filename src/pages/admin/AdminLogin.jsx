import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { FaUserShield } from 'react-icons/fa';
import { Input } from '../../components/FormField';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { usePageTitle } from '../../hooks/useUtils';
import { errMsg } from '../../services/api';
import { validators } from '../../utils/helpers';

export default function AdminLogin() {
  usePageTitle('Admin Login');
  const { admin, adminLogin } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [v, setV] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  if (admin) return <Navigate to="/admin" replace />;

  const submit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!validators.email(v.email)) errs.email = 'Enter a valid email address';
    if (!v.password) errs.password = 'Password is required';
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setBusy(true);
    try {
      await adminLogin(v.email.trim(), v.password);
      toast.success('Welcome, Admin!');
      navigate(location.state?.from?.pathname || '/admin', { replace: true });
    } catch (err) { toast.error(errMsg(err)); } finally { setBusy(false); }
  };

  return (
    <section className="container-x flex justify-center py-12">
      <div className="card w-full max-w-md p-8">
        <div className="mb-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-600 text-white"><FaUserShield aria-hidden="true" /></div>
          <h1 className="mt-3 text-2xl font-extrabold">Admin Login</h1>
          <p className="text-sm text-slate-500">Restricted area for hospital administrators.</p>
        </div>
        <form onSubmit={submit} noValidate className="space-y-4">
          <Input name="email" type="email" label="Email" value={v.email} onChange={(e) => setV({ ...v, email: e.target.value })} error={errors.email} autoComplete="username" />
          <Input name="password" type="password" label="Password" value={v.password} onChange={(e) => setV({ ...v, password: e.target.value })} error={errors.password} autoComplete="current-password" />
          <button className="btn-primary w-full" disabled={busy}>{busy ? 'Signing in...' : 'Login to Admin Panel'}</button>
        </form>
        
        <p className="mt-5 text-center text-sm"><Link to="/login" className="link">Patient login</Link></p>
      </div>
    </section>
  );
}
