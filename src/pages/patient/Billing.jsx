import { useState } from 'react';
import { FaFileInvoiceDollar, FaPlus } from 'react-icons/fa';
import Badge from '../../components/Badge';
import DataTable from '../../components/DataTable';
import InvoiceView from '../../components/InvoiceView';
import PageHeader from '../../components/PageHeader';
import { ErrorState, PageLoader } from '../../components/Spinner';
import useFetch from '../../hooks/useFetch';
import { usePageTitle } from '../../hooks/useUtils';
import { appointmentsApi, errMsg, invoicesApi, ordersApi, reportsApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { currency, formatDate, todayISO } from '../../utils/helpers';

export default function Billing() {
  usePageTitle('Billing');
  const { user } = useAuth();
  const toast = useToast();
  const { data, loading, error, reload } = useFetch(async () => {
    const q = { userId: user.id };
    const [appointments, orders, reports, mine, all] = await Promise.all([
      appointmentsApi.list(q), ordersApi.list(q), reportsApi.list(q), invoicesApi.list(q), invoicesApi.list(),
    ]);
    return { appointments, orders, reports, invoices: mine, allInvoices: all };
  }, [user.id]);
  const [invoice, setInvoice] = useState(null);
  const [busy, setBusy] = useState(false);

  if (loading && !data) return <PageLoader />;
  if (error) return <ErrorState message={error} onRetry={reload} />;

  const billed = (key) => new Set(data.invoices.flatMap((i) => i[key] || []));
  const bA = billed('appointmentIds'); const bO = billed('orderIds'); const bR = billed('reportIds');
  const apts = data.appointments.filter((a) => ['Approved', 'Completed'].includes(a.status) && !bA.has(a.id));
  const orders = data.orders.filter((o) => !bO.has(o.id));
  const reports = data.reports.filter((r) => r.status === 'Ready' && !bR.has(r.id));

  const consultation = apts.reduce((s, a) => s + a.fee, 0);
  const medicine = orders.reduce((s, o) => s + o.total, 0);
  const lab = reports.reduce((s, r) => s + r.charge, 0);
  const total = consultation + medicine + lab;

  const generate = async () => {
    setBusy(true);
    try {
      const year = new Date().getFullYear();
      const seq = data.allInvoices.reduce((m, i) => Math.max(m, Number(String(i.invoiceNo).split('-')[2]) || 0), 0) + 1;
      const created = await invoicesApi.create({
        invoiceNo: `INV-${year}-${String(seq).padStart(4, '0')}`, userId: user.id, patientName: user.name, date: todayISO(),
        appointmentIds: apts.map((a) => a.id), orderIds: orders.map((o) => o.id), reportIds: reports.map((r) => r.id),
        consultation, medicine, lab, total, status: 'Paid',
      });
      toast.success(`Invoice ${created.invoiceNo} generated`);
      setInvoice(created);
      reload();
    } catch (e) { toast.error(errMsg(e)); } finally { setBusy(false); }
  };

  const cards = [['Consultation Charges', consultation, `${apts.length} visit(s)`], ['Medicine Charges', medicine, `${orders.length} order(s)`], ['Lab Test Charges', lab, `${reports.length} report(s)`]];

  const columns = [
    { key: 'invoiceNo', label: 'Invoice No.' },
    { key: 'date', label: 'Date', render: (i) => formatDate(i.date) },
    { key: 'consultation', label: 'Consultation', render: (i) => currency(i.consultation) },
    { key: 'medicine', label: 'Medicine', render: (i) => currency(i.medicine) },
    { key: 'lab', label: 'Lab', render: (i) => currency(i.lab) },
    { key: 'total', label: 'Total', render: (i) => <strong>{currency(i.total)}</strong> },
    { key: 'status', label: 'Status', render: (i) => <Badge>{i.status}</Badge> },
  ];

  return (
    <>
      <PageHeader title="Billing" subtitle="Unbilled charges are grouped into an invoice you can print." />
      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map(([l, v, h]) => (
          <div key={l} className="card p-5"><p className="text-sm text-slate-500">{l}</p><p className="mt-1 text-2xl font-extrabold">{currency(v)}</p><p className="text-xs text-slate-400">{h}</p></div>
        ))}
      </div>
      <div className="card mt-4 flex flex-col items-center justify-between gap-3 p-5 sm:flex-row">
        <div><p className="text-sm text-slate-500">Total pending to invoice</p><p className="text-3xl font-extrabold text-primary-600 dark:text-primary-200">{currency(total)}</p></div>
        <button className="btn-primary" onClick={generate} disabled={busy || total === 0}><FaPlus aria-hidden="true" /> {busy ? 'Generating...' : 'Generate Invoice'}</button>
      </div>

      <h2 className="mb-3 mt-8 font-bold">Invoice History</h2>
      <DataTable columns={columns} rows={data.invoices} searchPlaceholder="Search invoices..." empty="No invoices generated yet."
        actions={(i) => <button className="btn-outline btn-sm" onClick={() => setInvoice(i)}><FaFileInvoiceDollar aria-hidden="true" /> View / Print</button>} />
      <InvoiceView invoice={invoice} onClose={() => setInvoice(null)} />
    </>
  );
}
