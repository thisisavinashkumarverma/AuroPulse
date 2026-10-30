import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaMinus, FaPlus, FaSearch, FaShoppingCart, FaTrash } from 'react-icons/fa';
import Badge from '../../components/Badge';
import Modal from '../../components/Modal';
import Pagination from '../../components/Pagination';
import PageHeader from '../../components/PageHeader';
import { Input, Select, Textarea } from '../../components/FormField';
import { EmptyState, ErrorState, PageLoader } from '../../components/Spinner';
import useFetch from '../../hooks/useFetch';
import { usePageTitle } from '../../hooks/useUtils';
import { errMsg, medicinesApi, ordersApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { MED_CATEGORIES } from '../../data/constants';
import { currency, todayISO } from '../../utils/helpers';

const PAGE_SIZE = 8;
const stockLabel = (s) => (s === 0 ? 'Out of Stock' : s < 20 ? 'Low Stock' : 'In Stock');

export default function Pharmacy() {
  usePageTitle('Online Pharmacy');
  const { user } = useAuth();
  const toast = useToast();
  const cart = useCart();
  const [params, setParams] = useSearchParams();
  const { data, loading, error, reload } = useFetch(() => medicinesApi.list(), []);
  const [category, setCategory] = useState('');
  const [inStock, setInStock] = useState(false);
  const [sort, setSort] = useState('name');
  const [page, setPage] = useState(1);
  const [showCart, setShowCart] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const [details, setDetails] = useState(null);
  const [form, setForm] = useState({ address: user.address || '', payment: 'Cash on Delivery' });
  const [busy, setBusy] = useState(false);

  const q = params.get('q') || '';

  const filtered = useMemo(() => {
    const t = q.toLowerCase();
    return (data || [])
      .filter((m) => (!category || m.category === category) && (!inStock || m.stock > 0) && (!t || `${m.name} ${m.description} ${m.category}`.toLowerCase().includes(t)))
      .sort((a, b) => (sort === 'price-asc' ? a.price - b.price : sort === 'price-desc' ? b.price - a.price : a.name.localeCompare(b.name)));
  }, [data, q, category, inStock, sort]);

  if (loading && !data) return <PageLoader />;
  if (error) return <ErrorState message={error} onRetry={reload} />;

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const placeOrder = async (e) => {
    e.preventDefault();
    if (form.address.trim().length < 8) { toast.error('Please enter a complete delivery address.'); return; }
    setBusy(true);
    try {
      const fresh = await medicinesApi.list();
      const short = cart.items.find((i) => (fresh.find((m) => m.id === i.id)?.stock ?? 0) < i.qty);
      if (short) { toast.error(`Not enough stock for ${short.name}.`); reload(); setBusy(false); return; }
      await ordersApi.create({
        userId: user.id, patientName: user.name,
        items: cart.items.map(({ id, name, price, qty }) => ({ id, name, price, qty })),
        total: cart.total, address: form.address.trim(), payment: form.payment, status: 'Placed', date: todayISO(),
      });
      await Promise.all(cart.items.map((i) => {
        const m = fresh.find((x) => x.id === i.id);
        return medicinesApi.update(i.id, { stock: m.stock - i.qty });
      }));
      cart.clear();
      setCheckout(false);
      setShowCart(false);
      toast.success('Order placed successfully! It will be delivered soon.');
      reload();
    } catch (err) { toast.error(errMsg(err)); } finally { setBusy(false); }
  };

  return (
    <>
      <PageHeader title="Online Pharmacy" subtitle="Genuine medicines delivered to your door." action={
        <button className="btn-primary relative" onClick={() => setShowCart(true)}><FaShoppingCart aria-hidden="true" /> Cart ({cart.count})</button>
      } />

      <div className="card mb-6 grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label htmlFor="med-search" className="label">Search medicines</label>
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input id="med-search" type="search" className="input pl-9" value={q} placeholder="Name, use, category" onChange={(e) => { const n = new URLSearchParams(params); if (e.target.value) n.set('q', e.target.value); else n.delete('q'); setParams(n, { replace: true }); setPage(1); }} />
          </div>
        </div>
        <Select id="med-cat" label="Category" value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }} options={MED_CATEGORIES} placeholder="All categories" />
        <Select id="med-sort" label="Sort by" value={sort} onChange={(e) => setSort(e.target.value)} options={[{ value: 'name', label: 'Name (A-Z)' }, { value: 'price-asc', label: 'Price: low to high' }, { value: 'price-desc', label: 'Price: high to low' }]} />
        <label className="flex items-end gap-2 pb-2 text-sm font-medium"><input type="checkbox" className="h-4 w-4" checked={inStock} onChange={(e) => { setInStock(e.target.checked); setPage(1); }} /> In stock only</label>
      </div>

      {filtered.length === 0 ? <EmptyState title="No medicines found" message="Try changing your search or filters." /> : (
        <>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {visible.map((m) => (
              <article key={m.id} className="card flex flex-col p-4">
                <div className="flex h-28 items-center justify-center rounded-xl bg-gradient-to-br from-primary-50 to-secondary-100 text-6xl dark:from-slate-700 dark:to-slate-600" role="img" aria-label={`${m.name} image`}>{m.emoji}</div>
                <div className="mt-3 flex items-start justify-between gap-2"><h2 className="font-bold leading-tight">{m.name}</h2><Badge>{stockLabel(m.stock)}</Badge></div>
                <p className="text-xs text-secondary-700 dark:text-secondary-400">{m.category}</p>
                <p className="mt-2 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">{m.description}</p>
                <button className="link mt-1 self-start text-xs" onClick={() => setDetails(m)}>Usage & side effects</button>
                <div className="mt-auto flex items-center justify-between pt-4">
                  <div><p className="text-lg font-extrabold">{currency(m.price)}</p><p className="text-xs text-slate-500">{m.stock} in stock</p></div>
                  <button className="btn-secondary btn-sm" disabled={m.stock === 0} onClick={() => { cart.add(m); toast.success(`${m.name} added to cart`); }}><FaPlus aria-hidden="true" /> Add</button>
                </div>
              </article>
            ))}
          </div>
          <Pagination page={page} pages={pages} onChange={setPage} total={filtered.length} pageSize={PAGE_SIZE} />
        </>
      )}

      <Modal open={!!details} onClose={() => setDetails(null)} title={details?.name || ''}>
        {details && (
          <dl className="space-y-3 text-sm">
            <div><dt className="font-semibold">Description</dt><dd className="text-slate-600 dark:text-slate-300">{details.description}</dd></div>
            <div><dt className="font-semibold">Usage</dt><dd className="text-slate-600 dark:text-slate-300">{details.usage}</dd></div>
            <div><dt className="font-semibold">Side effects</dt><dd className="text-slate-600 dark:text-slate-300">{details.sideEffects}</dd></div>
            <p className="rounded-lg bg-amber-50 p-3 text-xs text-amber-800">Always consult your doctor before starting any medicine.</p>
          </dl>
        )}
      </Modal>

      <Modal open={showCart} onClose={() => setShowCart(false)} title="Your Cart">
        {cart.items.length === 0 ? <p className="py-8 text-center text-slate-500">Your cart is empty.</p> : (
          <>
            <ul className="divide-y divide-slate-100 dark:divide-slate-700">
              {cart.items.map((i) => (
                <li key={i.id} className="flex items-center gap-3 py-3">
                  <span className="text-2xl" aria-hidden="true">{i.emoji}</span>
                  <div className="min-w-0 flex-1"><p className="truncate font-semibold">{i.name}</p><p className="text-xs text-slate-500">{currency(i.price)} each</p></div>
                  <div className="flex items-center gap-1" role="group" aria-label={`Quantity for ${i.name}`}>
                    <button className="btn-outline btn-sm" onClick={() => cart.setQty(i.id, i.qty - 1)} aria-label="Decrease quantity"><FaMinus /></button>
                    <span className="w-6 text-center text-sm font-semibold">{i.qty}</span>
                    <button className="btn-outline btn-sm" onClick={() => cart.setQty(i.id, i.qty + 1)} aria-label="Increase quantity"><FaPlus /></button>
                  </div>
                  <p className="w-16 text-right text-sm font-bold">{currency(i.price * i.qty)}</p>
                  <button className="text-red-600" onClick={() => cart.remove(i.id)} aria-label={`Remove ${i.name}`}><FaTrash /></button>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4 dark:border-slate-700">
              <p className="font-bold">Total: {currency(cart.total)}</p>
              <div className="flex gap-2"><button className="btn-outline" onClick={cart.clear}>Clear</button><button className="btn-primary" onClick={() => { setShowCart(false); setCheckout(true); }}>Checkout</button></div>
            </div>
          </>
        )}
      </Modal>

      <Modal open={checkout} onClose={() => setCheckout(false)} title="Checkout">
        <form onSubmit={placeOrder} className="space-y-4" noValidate>
          <Textarea name="address" label="Delivery Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          <Select name="payment" label="Payment Method" value={form.payment} onChange={(e) => setForm({ ...form, payment: e.target.value })} options={['Cash on Delivery', 'UPI', 'Card']} />
          <Input name="amount" label="Amount Payable" value={currency(cart.total)} readOnly />
          <p className="text-xs text-slate-500">Demo checkout - no real payment is processed.</p>
          <div className="flex justify-end gap-2"><button type="button" className="btn-outline" onClick={() => setCheckout(false)}>Back</button><button className="btn-primary" disabled={busy || cart.items.length === 0}>{busy ? 'Placing order...' : 'Place Order'}</button></div>
        </form>
      </Modal>
    </>
  );
}
