import CrudPage from '../../components/CrudPage';
import Badge from '../../components/Badge';
import { medicinesApi } from '../../services/api';
import { usePageTitle } from '../../hooks/useUtils';
import { MED_CATEGORIES } from '../../data/constants';
import { currency } from '../../utils/helpers';

const FIELDS = [
  { name: 'name', label: 'Medicine Name', required: true },
  { name: 'category', label: 'Category', type: 'select', options: MED_CATEGORIES, required: true },
  { name: 'price', label: 'Price (₹)', type: 'number', required: true },
  { name: 'stock', label: 'Stock', type: 'number', required: true },
  { name: 'emoji', label: 'Icon (emoji)', placeholder: '💊' },
  { name: 'description', label: 'Description', type: 'textarea', required: true },
  { name: 'usage', label: 'Usage', type: 'textarea', required: true },
  { name: 'sideEffects', label: 'Side Effects', type: 'textarea' },
];

const stockLabel = (s) => (s === 0 ? 'Out of Stock' : s < 20 ? 'Low Stock' : 'In Stock');

const COLUMNS = [
  { key: 'emoji', label: '', sortable: false, render: (m) => <span className="text-2xl" aria-hidden="true">{m.emoji}</span> },
  { key: 'name', label: 'Name' },
  { key: 'category', label: 'Category' },
  { key: 'price', label: 'Price', render: (m) => currency(m.price) },
  { key: 'stock', label: 'Stock', render: (m) => <span className="inline-flex items-center gap-2">{m.stock} <Badge>{stockLabel(m.stock)}</Badge></span> },
];

export default function ManageMedicines() {
  usePageTitle('Manage Medicines');
  return (
    <CrudPage
      title="Medicines" singular="Medicine" subtitle="Maintain pharmacy inventory and pricing." addLabel="Add Medicine"
      api={medicinesApi} columns={COLUMNS} fields={FIELDS}
      defaults={{ name: '', category: '', price: '', stock: '', emoji: '💊', description: '', usage: '', sideEffects: '' }}
      validate={(v) => ({
        ...(Number(v.price) <= 0 ? { price: 'Price must be greater than 0' } : {}),
        ...(Number(v.stock) < 0 ? { stock: 'Stock cannot be negative' } : {}),
      })}
      transform={(v) => ({ ...v, emoji: v.emoji || '💊' })}
    />
  );
}
