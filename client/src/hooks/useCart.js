import { useCartStore } from '@/store/cartStore';

const useCart = () => {
  const store = useCartStore();
  const totalItems = store.items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = store.items.reduce((s, i) => s + i.price * i.quantity, 0);
  return { ...store, totalItems, totalPrice };
};

export default useCart;
