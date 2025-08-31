 // context/CartContext.js
import { createContext, useContext, useMemo, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  const inc = (it) =>
    setItems((arr) =>
      arr.map((x) => (x.id === it.id ? { ...x, qtd: (x.qtd ?? 1) + 1 } : x))
    );

  const dec = (it) =>
    setItems((arr) =>
      arr
        .map((x) =>
          x.id === it.id ? { ...x, qtd: Math.max((x.qtd ?? 1) - 1, 0) } : x
        )
        .filter((x) => (x.qtd ?? 1) > 0)
    );

  const clear = () => setItems([]);

  const add = (it) =>
    setItems((arr) => {
      const i = arr.findIndex((x) => x.id === it.id);
      if (i >= 0) {
        const copy = [...arr];
        copy[i] = { ...copy[i], qtd: (copy[i].qtd ?? 1) + (it.qtd ?? 1) };
        return copy;
      }
      return [...arr, { ...it, qtd: it.qtd ?? 1 }];
    });

  const total = useMemo(
    () =>
      items.reduce(
        (s, x) => s + Number(x.price ?? x.valor ?? 0) * Number(x.qtd ?? 1),
        0
      ),
    [items]
  );

  const value = useMemo(() => ({ items, total, inc, dec, clear, add }), [items, total]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
