import { Link } from 'react-router-dom';
import { usePageTitle } from '../../hooks/useUtils';

export default function NotFound() {
  usePageTitle('Page not found');
  return (
    <section className="container-x flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <p className="text-8xl font-extrabold text-primary-600">404</p>
      <h1 className="mt-4 text-2xl font-bold">Page not found</h1>
      <p className="mt-2 max-w-md text-slate-600 dark:text-slate-300">The page you are looking for does not exist or has been moved.</p>
      <div className="mt-6 flex gap-3">
        <Link to="/" className="btn-primary">Back to Home</Link>
        <Link to="/doctors" className="btn-outline">Find a Doctor</Link>
      </div>
    </section>
  );
}
