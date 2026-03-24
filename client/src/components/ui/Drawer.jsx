import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const Drawer = ({ isOpen, onClose, title, children, side = 'right', width = '420px' }) => {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const initial = side === 'right' ? { x: '100%' } : { x: '-100%' };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={initial}
            animate={{ x: 0 }}
            exit={initial}
            transition={{ type: 'spring', stiffness: 300, damping: 35 }}
            className={`fixed top-0 ${side === 'right' ? 'right-0' : 'left-0'} h-full z-50 flex flex-col`}
            style={{ width, maxWidth: '100vw' }}
          >
            <div className="h-full glass-dark border-l border-cyan/10 flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-navy shrink-0">
                <h2 className="font-mono text-sm tracking-widest uppercase text-cyan">{title}</h2>
                <button onClick={onClose} className="text-off-white/40 hover:text-cyan transition-colors">
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6">
                {children}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Drawer;
