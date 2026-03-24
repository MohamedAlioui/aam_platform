import { useState, useEffect, useRef } from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, Bell, Plus, Pencil, Trash2, Check, X, Star,
  Upload, Image as ImageIcon, Package, ShoppingBag, Users,
  AlertTriangle, Eye, EyeOff, ChevronDown
} from 'lucide-react';
import Sidebar from '@/components/admin/Sidebar';
import StatsCard from '@/components/admin/StatsCard';
import DataTable from '@/components/admin/DataTable';
import ChartRevenue from '@/components/admin/ChartRevenue';
import ChartCourses from '@/components/admin/ChartCourses';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import ToastContainer, { useToastStore } from '@/components/ui/Toast';
import api from '@/utils/api';
import { io } from 'socket.io-client';
import { COURSE_CATEGORIES } from '@/utils/constants';

const LEVELS    = ['مبتدئ', 'متوسط', 'متقدم'];
const PROD_CATS = ['T-Shirt', 'Hoodie', 'Cap', 'Jacket', 'Accessories'];

// ─── Helpers ─────────────────────────────────────────────
const imgSrc = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return path.startsWith('/') ? path : `/${path}`;
};

const Select = ({ label, value, onChange, options }) => (
  <div>
    {label && <label className="block font-mono text-[10px] tracking-widest uppercase mb-1.5" style={{ color: 'var(--text-muted)' }}>{label}</label>}
    <select value={value} onChange={onChange} className="aam-input w-full" style={{ color: 'var(--text-primary)' }}>
      {options.map(o => <option key={o.value || o} value={o.value || o}>{o.label || o}</option>)}
    </select>
  </div>
);

const Toggle = ({ label, checked, onChange }) => (
  <div className="flex items-center justify-between px-4 py-3 rounded-xl" style={{ background: 'var(--bg-section)', border: '1px solid var(--border)' }}>
    <span className="font-mono text-xs tracking-wide" style={{ color: 'var(--text-secondary)' }}>{label}</span>
    <button type="button" onClick={() => onChange(!checked)} className="relative w-10 h-5 rounded-full transition-all duration-300" style={{ background: checked ? 'var(--blue)' : 'var(--border)' }}>
      <span className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-300" style={{ left: checked ? '22px' : '2px' }} />
    </button>
  </div>
);

// ─── Confirm Modal ────────────────────────────────────────
const ConfirmModal = ({ isOpen, onClose, onConfirm, title = 'Confirmer la suppression', message = 'Cette action est irréversible.' }) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] backdrop-blur-sm" style={{ background: 'rgba(0,0,0,0.4)' }} onClick={onClose} />
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none">
          <div className="w-full max-w-sm rounded-2xl p-6 pointer-events-auto"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-hover)' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                <AlertTriangle size={20} className="text-red-500" />
              </div>
              <h3 className="font-display text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{title}</h3>
            </div>
            <p className="font-arabic text-sm mb-6" style={{ color: 'var(--text-muted)' }}>{message}</p>
            <div className="flex gap-3 justify-end">
              <button onClick={onClose} className="px-4 py-2 rounded-xl font-mono text-xs transition-all" style={{ background: 'var(--bg-section)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                Annuler
              </button>
              <button onClick={() => { onConfirm(); onClose(); }} className="px-4 py-2 rounded-xl font-mono text-xs text-white transition-all bg-red-500 hover:bg-red-600">
                Supprimer
              </button>
            </div>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

// ─── Image Uploader ───────────────────────────────────────
const ImageUpload = ({ label = 'Image', preview, onChange }) => {
  const ref = useRef(null);
  return (
    <div>
      <label className="block font-mono text-[10px] tracking-widest uppercase mb-1.5" style={{ color: 'var(--text-muted)' }}>{label}</label>
      <div
        onClick={() => ref.current?.click()}
        className="relative w-full h-32 rounded-xl overflow-hidden cursor-pointer transition-all"
        style={{ border: '2px dashed var(--border)', background: 'var(--bg-section)' }}
        onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--blue)'}
        onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
      >
        {preview ? (
          <>
            <img src={preview} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <Upload size={20} className="text-white" />
            </div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <ImageIcon size={24} style={{ color: 'var(--text-muted)' }} />
            <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>Cliquer pour uploader</span>
          </div>
        )}
      </div>
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={onChange} />
    </div>
  );
};

// ═══════════════════════════════
// OVERVIEW PANEL
// ═══════════════════════════════
const Overview = () => {
  const [stats, setStats] = useState({ courses: 0, registrations: 0, products: 0, revenue: 0 });

  useEffect(() => {
    Promise.all([
      api.get('/courses'),
      api.get('/registrations'),
      api.get('/products'),
      api.get('/orders'),
    ]).then(([c, r, p, o]) => {
      setStats({
        courses:       c.data.total       ?? c.data.courses?.length  ?? 0,
        registrations: r.data.total       ?? r.data.registrations?.length ?? 0,
        products:      p.data.products?.length ?? 0,
        revenue:       o.data.revenue     ?? 0,
      });
    }).catch(() => {});
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Tableau de Bord</h1>
        <p className="font-mono text-xs tracking-widest" style={{ color: 'var(--text-muted)' }}>Vue d'ensemble — AAM Platform</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard label="Cours actifs"   value={stats.courses}        icon="📚" color="cyan"  index={0} />
        <StatsCard label="Inscriptions"   value={stats.registrations}  icon="📝" color="blue"  index={1} trend={12} />
        <StatsCard label="Produits 6ix"   value={stats.products}       icon="👕" color="green" index={2} />
        <StatsCard label="Revenus TND"    value={stats.revenue}        icon="💰" color="gold"  index={3} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartRevenue />
        <ChartCourses />
      </div>
    </div>
  );
};

// ═══════════════════════════════
// COURSES MANAGER
// ═══════════════════════════════
const EMPTY_COURSE = {
  title_ar: '', title_fr: '', price: '', seats: '', duration: '',
  level: 'مبتدئ', category: 'تصميم',
  description_ar: '', description_fr: '',
  instructor_name: '',
  featured: false, isActive: true,
};

const CoursesManager = () => {
  const [courses, setCourses]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing]   = useState(null);
  const [form, setForm]         = useState(EMPTY_COURSE);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [confirm, setConfirm]   = useState(null); // id to delete
  const { success, error: showError } = useToastStore();

  const load = () => { setLoading(true); api.get('/courses').then(r => { setCourses(r.data.courses || []); setLoading(false); }).catch(() => setLoading(false)); };
  useEffect(load, []);

  const openEdit = (course) => {
    setEditing(course);
    setForm({
      title_ar: course.title_ar || '', title_fr: course.title_fr || '',
      price: course.price || '', seats: course.seats || '',
      duration: course.duration || '', level: course.level || 'مبتدئ',
      category: course.category || 'تصميم',
      description_ar: course.description_ar || '', description_fr: course.description_fr || '',
      instructor_name: course.instructor?.name || '',
      featured: course.featured || false, isActive: course.isActive !== false,
    });
    setImageFile(null);
    setImagePreview(course.image ? imgSrc(course.image) : null);
    setModalOpen(true);
  };

  const openCreate = () => {
    setEditing(null); setForm(EMPTY_COURSE);
    setImageFile(null); setImagePreview(null);
    setModalOpen(true);
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    try {
      const fd = new FormData();
      Object.entries({ ...form, price: Number(form.price), seats: Number(form.seats) }).forEach(([k, v]) => {
        if (k !== 'instructor_name') fd.append(k, v);
      });
      fd.append('instructor[name]', form.instructor_name);
      if (imageFile) fd.append('image', imageFile);

      const cfg = { headers: { 'Content-Type': 'multipart/form-data' } };
      if (editing) await api.put(`/courses/${editing._id}`, fd, cfg);
      else         await api.post('/courses', fd, cfg);
      success(editing ? 'Cours mis à jour ✓' : 'Cours créé ✓');
      setModalOpen(false); load();
    } catch (e) { showError(e.response?.data?.message || 'Erreur'); }
  };

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const categoryOptions = COURSE_CATEGORIES.filter(c => c.value !== 'all').map(c => ({ value: c.value, label: `${c.value} — ${c.label_fr}` }));

  const columns = [
    { key: 'image', label: '', render: (v) => (
      v ? <img src={imgSrc(v)} alt="" className="w-10 h-10 rounded-lg object-cover" />
        : <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'var(--bg-section)' }}><ImageIcon size={14} style={{ color: 'var(--text-muted)' }} /></div>
    )},
    { key: 'title_fr',      label: 'Cours' },
    { key: 'category',      label: 'Catégorie',  render: v => <Badge variant="blue">{v}</Badge> },
    { key: 'price',         label: 'Prix',        render: v => <span className="font-mono" style={{ color: 'var(--blue)' }}>{v?.toLocaleString()} TND</span> },
    { key: 'enrolledCount', label: 'Inscrits' },
    { key: 'featured',      label: '⭐',           render: v => v ? <Star size={14} fill="#f59e0b" color="#f59e0b" /> : <span style={{ color: 'var(--text-muted)' }}>—</span> },
    { key: 'isActive',      label: 'Statut',      render: v => <Badge variant={v ? 'green' : 'red'}>{v ? 'Actif' : 'Inactif'}</Badge> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Cours</h2>
        <Button icon={<Plus size={16} />} onClick={openCreate} size="sm">Nouveau Cours</Button>
      </div>

      <DataTable columns={columns} data={courses} loading={loading} actions={(row) => (
        <>
          <button onClick={() => openEdit(row)} className="p-1.5 rounded-lg transition-colors" style={{ color: 'var(--text-muted)' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--blue)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
            <Pencil size={14} />
          </button>
          <button onClick={() => setConfirm(row._id)} className="p-1.5 rounded-lg text-red-400/60 hover:text-red-500 transition-colors">
            <Trash2 size={14} />
          </button>
        </>
      )} />

      {/* Course Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Modifier le Cours' : 'Nouveau Cours'} size="lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Titre arabe"    value={form.title_ar}        onChange={e => set('title_ar', e.target.value)}        placeholder="عنوان الكورس" />
          <Input label="Titre français" value={form.title_fr}        onChange={e => set('title_fr', e.target.value)}        placeholder="Titre du cours" />
          <Input label="Prix (TND)"     type="number" value={form.price}  onChange={e => set('price', e.target.value)}      placeholder="1200" />
          <Input label="Places"         type="number" value={form.seats}  onChange={e => set('seats', e.target.value)}      placeholder="20" />
          <Input label="Durée"          value={form.duration}        onChange={e => set('duration', e.target.value)}        placeholder="3 mois" />
          <Input label="Instructeur"    value={form.instructor_name} onChange={e => set('instructor_name', e.target.value)} placeholder="Nom" />
          <Select label="Catégorie" value={form.category} onChange={e => set('category', e.target.value)} options={categoryOptions} />
          <Select label="Niveau"    value={form.level}    onChange={e => set('level', e.target.value)}    options={LEVELS} />

          <div className="md:col-span-2">
            <ImageUpload label="Image du cours" preview={imagePreview} onChange={handleImage} />
          </div>

          <div className="md:col-span-2">
            <label className="block font-mono text-[10px] tracking-widest uppercase mb-1.5" style={{ color: 'var(--text-muted)' }}>Description (AR)</label>
            <textarea value={form.description_ar} onChange={e => set('description_ar', e.target.value)} rows={3} className="aam-input resize-none w-full" style={{ direction: 'rtl' }} />
          </div>
          <div className="md:col-span-2">
            <label className="block font-mono text-[10px] tracking-widest uppercase mb-1.5" style={{ color: 'var(--text-muted)' }}>Description (FR)</label>
            <textarea value={form.description_fr} onChange={e => set('description_fr', e.target.value)} rows={3} className="aam-input resize-none w-full" />
          </div>

          <Toggle label="⭐ Cours en vedette (Featured)" checked={form.featured}  onChange={v => set('featured', v)} />
          <Toggle label="✅ Cours actif (Visible)"       checked={form.isActive} onChange={v => set('isActive', v)} />
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="ghost" onClick={() => setModalOpen(false)}>Annuler</Button>
          <Button onClick={handleSave}>Sauvegarder</Button>
        </div>
      </Modal>

      <ConfirmModal isOpen={!!confirm} onClose={() => setConfirm(null)}
        message="Voulez-vous vraiment supprimer ce cours ?"
        onConfirm={async () => {
          try { await api.delete(`/courses/${confirm}`); success('Cours supprimé'); load(); }
          catch { showError('Erreur lors de la suppression'); }
        }}
      />
    </div>
  );
};

// ═══════════════════════════════
// PRODUCTS MANAGER (6ix)
// ═══════════════════════════════
const EMPTY_PRODUCT = { name: '', description: '', price: '', stock: '', category: 'T-Shirt', featured: false, isActive: true };

const ProductsManager = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing]   = useState(null);
  const [form, setForm]         = useState(EMPTY_PRODUCT);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [confirm, setConfirm]   = useState(null);
  const { success, error: showError } = useToastStore();

  const load = () => { setLoading(true); api.get('/products').then(r => { setProducts(r.data.products || []); setLoading(false); }).catch(() => setLoading(false)); };
  useEffect(load, []);

  const openEdit = (product) => {
    setEditing(product);
    setForm({ name: product.name, description: product.description, price: product.price, stock: product.stock, category: product.category, featured: product.featured, isActive: product.isActive !== false });
    setImageFiles([]);
    setImagePreviews(product.images?.map(imgSrc).filter(Boolean) || []);
    setModalOpen(true);
  };

  const openCreate = () => { setEditing(null); setForm(EMPTY_PRODUCT); setImageFiles([]); setImagePreviews([]); setModalOpen(true); };

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
    setImagePreviews(files.map(f => URL.createObjectURL(f)));
  };

  const handleSave = async () => {
    try {
      const fd = new FormData();
      Object.entries({ ...form, price: Number(form.price), stock: Number(form.stock) }).forEach(([k, v]) => fd.append(k, v));
      imageFiles.forEach(f => fd.append('images', f));
      const cfg = { headers: { 'Content-Type': 'multipart/form-data' } };
      if (editing) await api.put(`/products/${editing._id}`, fd, cfg);
      else         await api.post('/products', fd, cfg);
      success(editing ? 'Produit mis à jour ✓' : 'Produit créé ✓');
      setModalOpen(false); load();
    } catch (e) { showError(e.response?.data?.message || 'Erreur'); }
  };

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const columns = [
    { key: 'images', label: '', render: (v) => (
      v?.[0] ? <img src={imgSrc(v[0])} alt="" className="w-10 h-10 rounded-lg object-cover" />
              : <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'var(--bg-section)' }}><Package size={14} style={{ color: 'var(--text-muted)' }} /></div>
    )},
    { key: 'name',     label: 'Produit' },
    { key: 'category', label: 'Catégorie', render: v => <Badge variant="blue">{v}</Badge> },
    { key: 'price',    label: 'Prix',      render: v => <span className="font-mono" style={{ color: 'var(--blue)' }}>{v} TND</span> },
    { key: 'stock',    label: 'Stock',     render: v => <span className={`font-mono text-sm font-bold ${v <= 5 ? 'text-red-500' : ''}`}>{v}</span> },
    { key: 'featured', label: '⭐',         render: v => v ? <Star size={14} fill="#f59e0b" color="#f59e0b" /> : <span style={{ color: 'var(--text-muted)' }}>—</span> },
    { key: 'isActive', label: 'Statut',    render: v => <Badge variant={v ? 'green' : 'red'}>{v ? 'Actif' : 'Inactif'}</Badge> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Produits 6ix</h2>
          <p className="font-mono text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Streetwear collection</p>
        </div>
        <Button icon={<Plus size={16} />} onClick={openCreate} size="sm">Nouveau Produit</Button>
      </div>

      <DataTable columns={columns} data={products} loading={loading} actions={(row) => (
        <>
          <button onClick={() => openEdit(row)} className="p-1.5 rounded-lg transition-colors" style={{ color: 'var(--text-muted)' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--blue)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
            <Pencil size={14} />
          </button>
          <button onClick={() => setConfirm(row._id)} className="p-1.5 rounded-lg text-red-400/60 hover:text-red-500 transition-colors">
            <Trash2 size={14} />
          </button>
        </>
      )} />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Modifier le Produit' : 'Nouveau Produit'} size="md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Input label="Nom du produit" value={form.name} onChange={e => set('name', e.target.value)} placeholder="T-Shirt Oversized" />
          </div>
          <Input label="Prix (TND)" type="number" value={form.price} onChange={e => set('price', e.target.value)} placeholder="89" />
          <Input label="Stock"      type="number" value={form.stock} onChange={e => set('stock', e.target.value)} placeholder="100" />
          <div className="md:col-span-2">
            <Select label="Catégorie" value={form.category} onChange={e => set('category', e.target.value)} options={PROD_CATS} />
          </div>
          <div className="md:col-span-2">
            <label className="block font-mono text-[10px] tracking-widest uppercase mb-1.5" style={{ color: 'var(--text-muted)' }}>Description</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3} className="aam-input resize-none w-full" />
          </div>

          {/* Image upload (multiple) */}
          <div className="md:col-span-2">
            <label className="block font-mono text-[10px] tracking-widest uppercase mb-1.5" style={{ color: 'var(--text-muted)' }}>Photos (max 5)</label>
            <div className="flex gap-2 flex-wrap mb-2">
              {imagePreviews.map((src, i) => (
                <img key={i} src={src} alt="" className="w-16 h-16 rounded-lg object-cover" style={{ border: '1px solid var(--border)' }} />
              ))}
            </div>
            <label className="flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer font-mono text-xs w-fit transition-all"
              style={{ border: '1px dashed var(--border)', color: 'var(--text-muted)', background: 'var(--bg-section)' }}>
              <Upload size={14} /> Uploader des photos
              <input type="file" accept="image/*" multiple className="hidden" onChange={handleImages} />
            </label>
          </div>

          <Toggle label="⭐ Produit en vedette" checked={form.featured}  onChange={v => set('featured', v)} />
          <Toggle label="✅ Produit actif"       checked={form.isActive} onChange={v => set('isActive', v)} />
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="ghost" onClick={() => setModalOpen(false)}>Annuler</Button>
          <Button onClick={handleSave}>Sauvegarder</Button>
        </div>
      </Modal>

      <ConfirmModal isOpen={!!confirm} onClose={() => setConfirm(null)}
        message="Voulez-vous vraiment supprimer ce produit ?"
        onConfirm={async () => {
          try { await api.delete(`/products/${confirm}`); success('Produit supprimé'); load(); }
          catch { showError('Erreur suppression'); }
        }}
      />
    </div>
  );
};

// ═══════════════════════════════
// ORDERS MANAGER
// ═══════════════════════════════
const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const OrdersManager = () => {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const { success }           = useToastStore();

  useEffect(() => { api.get('/orders').then(r => { setOrders(r.data.orders || []); setLoading(false); }).catch(() => setLoading(false)); }, []);

  const updateStatus = async (id, status) => {
    await api.put(`/orders/${id}`, { status });
    setOrders(orders.map(o => o._id === id ? { ...o, status } : o));
    success('Statut mis à jour');
  };

  const statusColor = { pending: 'blue', processing: 'cyan', shipped: 'green', delivered: 'green', cancelled: 'red' };

  const columns = [
    { key: '_id',    label: 'Commande', render: v => <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>#{v?.slice(-6).toUpperCase()}</span> },
    { key: 'userId', label: 'Client',   render: v => <span className="font-arabic">{v?.name || '—'}</span> },
    { key: 'total',  label: 'Total',    render: v => <span className="font-mono font-bold" style={{ color: 'var(--blue)' }}>{v?.toLocaleString()} TND</span> },
    { key: 'status', label: 'Statut',   render: v => <Badge variant={statusColor[v] || 'blue'}>{v}</Badge> },
    { key: 'paymentMethod', label: 'Paiement', render: v => <span className="font-mono text-xs">{v || '—'}</span> },
    { key: 'createdAt', label: 'Date',  render: v => v ? new Date(v).toLocaleDateString('fr-FR') : '—' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Commandes</h2>
      <DataTable columns={columns} data={orders} loading={loading} actions={(row) => (
        <select
          value={row.status}
          onChange={e => updateStatus(row._id, e.target.value)}
          className="font-mono text-xs px-2 py-1 rounded-lg outline-none cursor-pointer"
          style={{ background: 'var(--bg-section)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
        >
          {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      )} />
    </div>
  );
};

// ═══════════════════════════════
// REGISTRATIONS MANAGER
// ═══════════════════════════════
const RegistrationsManager = () => {
  const [regs, setRegs]       = useState([]);
  const [loading, setLoading] = useState(true);
  const { success }           = useToastStore();

  useEffect(() => { api.get('/registrations').then(r => { setRegs(r.data.registrations || []); setLoading(false); }).catch(() => setLoading(false)); }, []);

  const updateStatus = async (id, status) => {
    await api.put(`/registrations/${id}`, { status });
    setRegs(regs.map(r => r._id === id ? { ...r, status } : r));
    success('Statut mis à jour');
  };

  const columns = [
    { key: 'userId',        label: 'Étudiant',  render: v => <div><div className="font-arabic text-sm">{v?.name || '—'}</div><div className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>{v?.email || ''}</div></div> },
    { key: 'courseId',      label: 'Cours',     render: v => <span className="font-arabic text-xs">{v?.title_fr || v?.title_ar || '—'}</span> },
    { key: 'status',        label: 'Statut',    render: v => <Badge variant={v === 'confirmed' ? 'green' : v === 'cancelled' ? 'red' : 'blue'}>{v}</Badge> },
    { key: 'paymentStatus', label: 'Paiement',  render: v => <Badge variant={v === 'paid' ? 'green' : 'red'}>{v}</Badge> },
    { key: 'createdAt',     label: 'Date',      render: v => v ? new Date(v).toLocaleDateString('fr-FR') : '—' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Inscriptions</h2>
      <DataTable columns={columns} data={regs} loading={loading} actions={(row) => (
        <div className="flex gap-1">
          <button onClick={() => updateStatus(row._id, 'confirmed')} title="Confirmer" className="p-1.5 text-green-500/60 hover:text-green-600 transition-colors"><Check size={14} /></button>
          <button onClick={() => updateStatus(row._id, 'cancelled')} title="Annuler"   className="p-1.5 text-red-400/60 hover:text-red-500 transition-colors"><X size={14} /></button>
        </div>
      )} />
    </div>
  );
};

// ═══════════════════════════════
// USERS MANAGER
// ═══════════════════════════════
const UsersManager = () => {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { api.get('/auth/users').then(r => { setUsers(r.data.users || []); setLoading(false); }).catch(() => setLoading(false)); }, []);

  const columns = [
    { key: 'name',      label: 'Nom',       render: (v, row) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-mono text-sm text-white font-bold" style={{ background: 'var(--blue)' }}>
          {v?.[0]?.toUpperCase() || '?'}
        </div>
        <div>
          <div className="font-arabic text-sm" style={{ color: 'var(--text-primary)' }}>{v}</div>
          <div className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>{row.email}</div>
        </div>
      </div>
    )},
    { key: 'phone',     label: 'Téléphone', render: v => <span className="font-mono text-xs">{v || '—'}</span> },
    { key: 'role',      label: 'Rôle',      render: v => <Badge variant={v === 'admin' ? 'gold' : 'blue'}>{v}</Badge> },
    { key: 'isActive',  label: 'Statut',    render: v => <Badge variant={v ? 'green' : 'red'}>{v !== false ? 'Actif' : 'Inactif'}</Badge> },
    { key: 'createdAt', label: 'Inscrit le', render: v => v ? new Date(v).toLocaleDateString('fr-FR') : '—' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Utilisateurs</h2>
        <p className="font-mono text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{users.length} compte{users.length !== 1 ? 's' : ''} enregistré{users.length !== 1 ? 's' : ''}</p>
      </div>
      <DataTable columns={columns} data={users} loading={loading} />
    </div>
  );
};

// ═══════════════════════════════
// GALLERY MANAGER
// ═══════════════════════════════
const GalleryManager = () => {
  const [images, setImages]       = useState([]);
  const [uploading, setUploading] = useState(false);
  const [confirm, setConfirm]     = useState(null);
  const fileRef = useRef(null);
  const { success, error: showError } = useToastStore();

  useEffect(() => { api.get('/gallery').then(r => setImages(r.data.images || [])).catch(() => {}); }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('image', file);
    fd.append('category', 'collection');
    try {
      const r = await api.post('/gallery', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setImages(prev => [r.data.image, ...prev]);
      success('Image uploadée ✓');
    } catch { showError('Erreur upload'); }
    finally { setUploading(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Galerie</h2>
        <Button icon={<Plus size={16} />} onClick={() => fileRef.current?.click()} loading={uploading} size="sm">Uploader</Button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {images.map(img => (
          <div key={img._id} className="relative group aspect-square rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            {img.url ? <img src={imgSrc(img.url)} alt="" className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center" style={{ background: 'var(--bg-section)' }}><ImageIcon size={16} style={{ color: 'var(--text-muted)' }} /></div>
            }
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button onClick={() => setConfirm(img._id)} className="text-white hover:text-red-300 transition-colors"><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
      </div>
      <ConfirmModal isOpen={!!confirm} onClose={() => setConfirm(null)}
        message="Supprimer cette image de la galerie ?"
        onConfirm={() => { api.delete(`/gallery/${confirm}`); setImages(images.filter(i => i._id !== confirm)); success('Image supprimée'); }}
      />
    </div>
  );
};

// ═══════════════════════════════
// MAIN DASHBOARD SHELL
// ═══════════════════════════════
const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const { info } = useToastStore();

  useEffect(() => {
    const socket = io('/', { transports: ['websocket'] });
    socket.emit('join_admin');
    socket.on('new_registration', (data) => { info(data.message); setNotifications(n => [data, ...n].slice(0, 10)); });
    socket.on('new_order',        (data) => { info(data.message); setNotifications(n => [data, ...n].slice(0, 10)); });
    return () => socket.disconnect();
  }, []);

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-page)' }}>
      <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 flex items-center justify-between px-6 backdrop-blur-xl"
          style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-card)' }}>
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden transition-colors" style={{ color: 'var(--text-muted)' }}>
            <Menu size={22} />
          </button>
          <div className="flex-1 lg:flex-none" />
          <div className="flex items-center gap-4">
            <div className="relative">
              <button className="relative transition-colors" style={{ color: 'var(--text-muted)' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--blue)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
                <Bell size={18} />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 text-white text-[8px] font-bold rounded-full flex items-center justify-center"
                    style={{ background: 'var(--blue)' }}>
                    {Math.min(notifications.length, 9)}
                  </span>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Routes>
            <Route index                element={<Overview />} />
            <Route path="courses"       element={<CoursesManager />} />
            <Route path="registrations" element={<RegistrationsManager />} />
            <Route path="gallery"       element={<GalleryManager />} />
            <Route path="products"      element={<ProductsManager />} />
            <Route path="orders"        element={<OrdersManager />} />
            <Route path="users"         element={<UsersManager />} />
            <Route path="*"             element={<Overview />} />
          </Routes>
        </main>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Dashboard;
