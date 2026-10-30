import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);
const KEY = 'auropulse_cart';

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; }
  });

  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(items)); }, [items]);

  const add = useCallback((med) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === med.id);
      if (existing) {
        return prev.map((i) => (i.id === med.id ? { ...i, qty: Math.min(i.qty + 1, med.stock) } : i));
      }
      return [...prev, { id: med.id, name: med.name, price: med.price, emoji: med.emoji, stock: med.stock, qty: 1 }];
    });
  }, []);

  const remove = useCallback((id) => setItems((p) => p.filter((i) => i.id !== id)), []);
  const setQty = useCallback((id, qty) => {
    setItems((p) => p.map((i) => (i.id === id ? { ...i, qty: Math.max(1, Math.min(qty, i.stock)) } : i)));
  }, []);
  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(() => ({
    items, add, remove, setQty, clear,
    count: items.reduce((s, i) => s + i.qty, 0),
    total: items.reduce((s, i) => s + i.qty * i.price, 0),
  }), [items, add, remove, setQty, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
