import { FaDownload, FaPrint } from 'react-icons/fa';
import Modal from './Modal';
import { currency, formatDate, buildPdf, downloadBlob } from '../utils/helpers';
import { HOSPITAL } from '../data/constants';

export default function InvoiceView({ invoice, onClose }) {
  if (!invoice) return null;

  const rows = [
    ['Consultation Charges', invoice.consultation],
    ['Medicine Charges', invoice.medicine],
    ['Lab Test Charges', invoice.lab],
  ];

  const downloadPdf = () => {
    const lines = [
      `Invoice No: ${invoice.invoiceNo}`, `Date: ${invoice.date}`, `Patient: ${invoice.patientName}`, '',
      ...rows.map(([l, v]) => `${l}: Rs. ${v}`), '', `TOTAL: Rs. ${invoice.total}`, `Status: ${invoice.status}`,
      '', 'AuroPulse Healthcare Hospital - demo invoice',
    ];
    downloadBlob(buildPdf('AuroPulse Healthcare Hospital', lines), `${invoice.invoiceNo}.pdf`);
  };

  return (
    <Modal open={!!invoice} onClose={onClose} title={`Invoice ${invoice.invoiceNo}`} size="max-w-2xl">
      <div id="invoice-print" className="space-y-5 text-sm">
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 pb-4 dark:border-slate-700">
          <div>
            <p className="text-lg font-extrabold text-primary-600">{HOSPITAL.name}</p>
            <p className="text-slate-500">{HOSPITAL.address}</p>
            <p className="text-slate-500">{HOSPITAL.phone} · {HOSPITAL.email}</p>
          </div>
          <div className="text-right">
            <p className="font-bold">{invoice.invoiceNo}</p>
            <p className="text-slate-500">Date: {formatDate(invoice.date)}</p>
            <p className="font-semibold text-secondary-700">{invoice.status}</p>
          </div>
        </div>
        <p><span className="text-slate-500">Billed to:</span> <strong>{invoice.patientName}</strong></p>
        <table className="w-full text-left">
          <thead><tr className="border-b border-slate-200 text-xs uppercase text-slate-500 dark:border-slate-700"><th className="py-2">Description</th><th className="py-2 text-right">Amount</th></tr></thead>
          <tbody>
            {rows.map(([l, v]) => (
              <tr key={l} className="border-b border-slate-100 dark:border-slate-700"><td className="py-2">{l}</td><td className="py-2 text-right">{currency(v)}</td></tr>
            ))}
            <tr><td className="py-3 text-base font-bold">Total</td><td className="py-3 text-right text-base font-bold">{currency(invoice.total)}</td></tr>
          </tbody>
        </table>
        <p className="text-xs text-slate-400">This is a computer-generated demo invoice for portfolio purposes.</p>
      </div>
      <div className="no-print mt-4 flex justify-end gap-2">
        <button className="btn-outline" onClick={downloadPdf}><FaDownload aria-hidden="true" /> PDF</button>
        <button className="btn-primary" onClick={() => window.print()}><FaPrint aria-hidden="true" /> Print Invoice</button>
      </div>
    </Modal>
  );
}
