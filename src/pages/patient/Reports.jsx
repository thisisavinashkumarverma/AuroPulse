import { useState } from 'react';
import { FaDownload, FaEye, FaFlask, FaHeartbeat, FaXRay, FaBrain } from 'react-icons/fa';
import Badge from '../../components/Badge';
import Modal from '../../components/Modal';
import PageHeader from '../../components/PageHeader';
import { EmptyState, ErrorState, PageLoader } from '../../components/Spinner';
import useFetch from '../../hooks/useFetch';
import { usePageTitle } from '../../hooks/useUtils';
import { reportsApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { REPORT_TYPES } from '../../data/constants';
import { buildPdf, downloadBlob, formatDate } from '../../utils/helpers';

const ICONS = { 'Blood Test': FaFlask, 'X-Ray': FaXRay, MRI: FaBrain, ECG: FaHeartbeat };

export default function Reports() {
  usePageTitle('Medical Reports');
  const { user } = useAuth();
  const toast = useToast();
  const { data, loading, error, reload } = useFetch(() => reportsApi.list({ userId: user.id, _sort: 'date', _order: 'desc' }), [user.id]);
  const [type, setType] = useState('All');
  const [view, setView] = useState(null);

  if (loading && !data) return <PageLoader />;
  if (error) return <ErrorState message={error} onRetry={reload} />;

  const list = data.filter((r) => type === 'All' || r.type === type);

  const download = (r) => {
    if (r.status !== 'Ready') { toast.info('This report is still being processed.'); return; }
    const lines = [
      `Patient: ${r.patientName}`, `Report: ${r.name}`, `Type: ${r.type}`, `Date: ${r.date}`, `Referring Doctor: ${r.doctorName}`,
      '', 'Findings:', ...(r.notes.match(/.{1,80}(\s|$)/g) || []).map((s) => s.trim()), '',
      'This is a dummy report generated for demo purposes only.',
    ];
    downloadBlob(buildPdf('AuroPulse Healthcare - Medical Report', lines), `${r.type.replace(/\s/g, '-')}-${r.date}.pdf`);
    toast.success('Report downloaded');
  };

  return (
    <>
      <PageHeader title="Medical Reports" subtitle="View and download your lab and imaging reports." />
      <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label="Filter by report type">
        {['All', ...REPORT_TYPES].map((t) => (
          <button key={t} onClick={() => setType(t)} aria-pressed={type === t} className={`btn btn-sm ${type === t ? 'bg-primary-600 text-white' : 'btn-outline'}`}>{t}</button>
        ))}
      </div>
      {list.length === 0 ? <EmptyState title="No reports found" message="Reports uploaded by the hospital will appear here." /> : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((r) => {
            const Icon = ICONS[r.type] || FaFlask;
            return (
              <article key={r.id} className="card p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-slate-700"><Icon aria-hidden="true" /></div>
                  <Badge>{r.status}</Badge>
                </div>
                <h2 className="mt-3 font-bold">{r.name}</h2>
                <p className="text-sm text-slate-500">{r.type}</p>
                <dl className="mt-3 space-y-1 text-sm">
                  <div className="flex justify-between"><dt className="text-slate-500">Date</dt><dd>{formatDate(r.date)}</dd></div>
                  <div className="flex justify-between"><dt className="text-slate-500">Doctor</dt><dd>{r.doctorName}</dd></div>
                </dl>
                <div className="mt-4 flex gap-2">
                  <button className="btn-outline btn-sm flex-1" onClick={() => setView(r)}><FaEye aria-hidden="true" /> View</button>
                  <button className="btn-primary btn-sm flex-1" onClick={() => download(r)}><FaDownload aria-hidden="true" /> Download PDF</button>
                </div>
              </article>
            );
          })}
        </div>
      )}
      <Modal open={!!view} onClose={() => setView(null)} title={view?.name || 'Report'}>
        {view && (
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-3">
              {[['Patient', view.patientName], ['Type', view.type], ['Date', formatDate(view.date)], ['Doctor', view.doctorName]].map(([l, v]) => (
                <div key={l}><p className="text-xs text-slate-500">{l}</p><p className="font-semibold">{v}</p></div>
              ))}
            </div>
            <div><p className="text-xs text-slate-500">Status</p><Badge>{view.status}</Badge></div>
            <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-900"><p className="mb-1 text-xs font-semibold uppercase text-slate-500">Findings</p><p>{view.notes}</p></div>
            <div className="flex justify-end"><button className="btn-primary" onClick={() => download(view)}><FaDownload aria-hidden="true" /> Download PDF</button></div>
          </div>
        )}
      </Modal>
    </>
  );
}
