import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Breadcrumbs from '../components/Breadcrumbs';

export default function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-[100] focus:rounded focus:bg-white focus:px-3 focus:py-2">Skip to main content</a>
      <Navbar />
      <main id="main" className="flex-1">
        <div className="container-x pt-4"><Breadcrumbs /></div>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
