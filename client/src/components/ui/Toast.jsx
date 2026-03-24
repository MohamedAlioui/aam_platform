import { create } from 'zustand';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

// Toast store
export const useToastStore = create((set, get) => ({
  toasts: [],
  add: (toast) => {
    const id = Date.now();
    set({ toasts: [...get().toasts, { id, ...toast }] });
    setTimeout(() => get().remove(id), toast.duration || 4000);
    return id;
  },
  remove: (id) => set({ toasts: get().toasts.filter(t => t.id !== id) }),
  success: (message) => get().add({ type: 'success', message }),
  error: (message) => get().add({ type: 'error', message }),
  info: (message) => get().add({ type: 'info', message })
}));

const icons = {
  success: <CheckCircle size={18} className="text-green-400" />,
  error:   <AlertCircle size={18} className="text-red-400" />,
  info:    <Info size={18} className="text-cyan" />
};

const borders = {
  success: 'border-green-500/30',
  error:   'border-red-500/30',
  info:    'border-cyan/30'
};

const ToastItem = ({ toast, onRemove }) => (
  <motion.div
    layout
    initial={{ opacity: 0, x: 80, scale: 0.9 }}
    animate={{ opacity: 1, x: 0, scale: 1 }}
    exit={{ opacity: 0, x: 80, scale: 0.9 }}
    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
    className={`flex items-center gap-3 px-4 py-3 glass-dark rounded-lg border ${borders[toast.type]} min-w-[280px] max-w-sm`}
  >
    {icons[toast.type]}
    <p className="font-arabic text-sm text-off-white flex-1">{toast.message}</p>
    <button onClick={() => onRemove(toast.id)} className="text-off-white/30 hover:text-off-white transition-colors">
      <X size={14} />
    </button>
  </motion.div>
);

const ToastContainer = () => {
  const { toasts, remove } = useToastStore();

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3">
      <AnimatePresence mode="popLayout">
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} onRemove={remove} />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;
