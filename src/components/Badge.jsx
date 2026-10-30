const COLORS = {
  Pending: 'bg-amber-100 text-amber-800',
  Approved: 'bg-blue-100 text-blue-800',
  Completed: 'bg-green-100 text-green-800',
  Rejected: 'bg-red-100 text-red-800',
  Cancelled: 'bg-slate-200 text-slate-700',
  Ready: 'bg-green-100 text-green-800',
  Processing: 'bg-amber-100 text-amber-800',
  Paid: 'bg-green-100 text-green-800',
  Placed: 'bg-blue-100 text-blue-800',
  Delivered: 'bg-green-100 text-green-800',
  Available: 'bg-green-100 text-green-800',
  'On Leave': 'bg-slate-200 text-slate-700',
  'In Stock': 'bg-green-100 text-green-800',
  'Low Stock': 'bg-amber-100 text-amber-800',
  'Out of Stock': 'bg-red-100 text-red-800',
};

export default function Badge({ children }) {
  return <span className={`badge ${COLORS[children] || 'bg-slate-100 text-slate-700'}`}>{children}</span>;
}
