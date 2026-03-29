import { useState, useEffect, useRef } from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, Bell, Plus, Pencil, Trash2, Check, X, Star,
  Upload, Image as ImageIcon, Package, ShoppingBag, Users,
  AlertTriangle, Eye, EyeOff, ChevronDown, Play
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
import { supabase, uploadVideo, uploadThumb, deleteFile } from '@/utils/supabase';
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
const PAY_COLORS = { paid: 'green', unpaid: 'red', refunded: 'gold' };
const PAY_LABELS = { paid: '✓ Payé', unpaid: '✗ Impayé', refunded: '↩ Remboursé' };

const RegistrationsManager = () => {
  const [regs, setRegs]           = useState([]);
  const [loading, setLoading]     = useState(true);
  const [editReg, setEditReg]     = useState(null); // reg being edited
  const { success, error: toastError } = useToastStore();

  useEffect(() => {
    api.get('/registrations')
      .then(r => { setRegs(r.data.registrations || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const updateField = async (id, patch) => {
    try {
      await api.put(`/registrations/${id}`, patch);
      setRegs(prev => prev.map(r => r._id === id ? { ...r, ...patch } : r));
      success('Mise à jour effectuée');
    } catch {
      toastError('Erreur lors de la mise à jour');
    }
  };

  const columns = [
    { key: 'userId',        label: 'Étudiant',  render: v => (
      <div>
        <div className="font-arabic text-sm">{v?.name || '—'}</div>
        <div className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>{v?.email || ''}</div>
      </div>
    )},
    { key: 'courseId',      label: 'Cours',     render: v => <span className="font-arabic text-xs">{v?.title_fr || v?.title_ar || '—'}</span> },
    { key: 'status',        label: 'Statut',    render: v => <Badge variant={v === 'confirmed' ? 'green' : v === 'cancelled' ? 'red' : v === 'completed' ? 'gold' : 'blue'}>{v}</Badge> },
    { key: 'paymentStatus', label: 'Paiement',  render: (v, row) => (
      <select
        value={v || 'unpaid'}
        onChange={e => updateField(row._id, { paymentStatus: e.target.value })}
        onClick={e => e.stopPropagation()}
        className="font-mono text-[10px] tracking-wide rounded-lg px-2 py-1 border cursor-pointer transition-all"
        style={{
          background: v === 'paid' ? 'rgba(34,197,94,0.12)' : v === 'refunded' ? 'rgba(245,158,11,0.12)' : 'rgba(239,68,68,0.12)',
          color:      v === 'paid' ? '#16a34a'               : v === 'refunded' ? '#b45309'                : '#dc2626',
          borderColor: v === 'paid' ? 'rgba(34,197,94,0.3)' : v === 'refunded' ? 'rgba(245,158,11,0.3)'  : 'rgba(239,68,68,0.3)',
        }}
      >
        <option value="unpaid">✗ Impayé</option>
        <option value="paid">✓ Payé</option>
        <option value="refunded">↩ Remboursé</option>
      </select>
    )},
    { key: 'createdAt', label: 'Date', render: v => v ? new Date(v).toLocaleDateString('fr-FR') : '—' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Inscriptions</h2>
          <p className="font-mono text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {regs.length} inscription{regs.length !== 1 ? 's' : ''} ·{' '}
            <span style={{ color: '#16a34a' }}>{regs.filter(r => r.paymentStatus === 'paid').length} payées</span>{' '}·{' '}
            <span style={{ color: '#dc2626' }}>{regs.filter(r => r.paymentStatus === 'unpaid').length} impayées</span>
          </p>
        </div>
      </div>

      <DataTable columns={columns} data={regs} loading={loading} actions={(row) => (
        <div className="flex gap-1">
          <button onClick={() => updateField(row._id, { status: 'confirmed' })} title="Confirmer"
            className="p-1.5 text-green-500/60 hover:text-green-600 transition-colors"><Check size={14} /></button>
          <button onClick={() => updateField(row._id, { status: 'cancelled' })} title="Annuler"
            className="p-1.5 text-red-400/60 hover:text-red-500 transition-colors"><X size={14} /></button>
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
// FRAME CAPTURE — status display
// ═══════════════════════════════
const FrameCapture = ({ videoFile, thumbFile, onCapture, thumbRef }) => (
  <div>
    <label className="font-mono text-xs mb-1.5 block" style={{ color: 'var(--text-muted)' }}>
      Miniature (optionnel)
    </label>
    {thumbFile ? (
      <div className="flex items-center gap-3 px-3 py-2 rounded-xl"
        style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(74,222,128,0.25)' }}>
        <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0">
          <img src={URL.createObjectURL(thumbFile)} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-mono text-xs font-bold" style={{ color: '#4ade80' }}>✓ Miniature capturée automatiquement</p>
          <p className="font-mono text-[10px] mt-0.5 truncate" style={{ color: 'var(--text-muted)' }}>thumbnail.jpg</p>
        </div>
        <button onClick={() => onCapture(null)}
          className="font-mono text-[10px] px-2 py-1 rounded-lg shrink-0"
          style={{ background: 'var(--bg-section)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
          ✕ Effacer
        </button>
      </div>
    ) : (
      <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
        style={{ background: 'var(--bg-section)', border: '1px dashed var(--border)' }}>
        {videoFile ? (
          <>
            <ImageIcon size={13} style={{ color: 'var(--blue)', flexShrink: 0 }} />
            <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
              Miniature auto-capturée · cliquez <strong style={{ color: 'var(--blue)' }}>Recapturer</strong> sur l'aperçu pour changer
            </span>
          </>
        ) : (
          <>
            <ImageIcon size={13} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
            <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
              Sélectionnez une vidéo pour capturer un frame
            </span>
          </>
        )}
      </div>
    )}
    <input ref={thumbRef} type="file" accept="image/*" className="hidden"
      onChange={e => onCapture(e.target.files[0])} />
  </div>
);

// ═══════════════════════════════
// REEL PREVIEW — phone mockup + frame capture
// ═══════════════════════════════
const ReelPreview = ({ videoFile, thumbFile, form, onCapture }) => {
  const videoUrl = videoFile ? URL.createObjectURL(videoFile) : null;
  const thumbUrl = thumbFile ? URL.createObjectURL(thumbFile) : null;
  const [playing, setPlaying] = useState(false);
  const [captured, setCaptured] = useState(false);
  const vRef = useRef(null);
  const canvasRef = useRef(null);

  const toggle = (e) => {
    e.stopPropagation();
    if (!vRef.current) return;
    if (playing) { vRef.current.pause(); setPlaying(false); }
    else         { vRef.current.play();  setPlaying(true);  }
  };

  const capture = (e) => {
    e.stopPropagation();
    const video  = vRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    video.pause(); setPlaying(false);
    canvas.width  = video.videoWidth  || 720;
    canvas.height = video.videoHeight || 1280;
    canvas.getContext('2d').drawImage(video, 0, 0);
    canvas.toBlob(blob => {
      if (!blob) return;
      const file = new File([blob], 'thumbnail.jpg', { type: 'image/jpeg' });
      onCapture(file);
      setCaptured(true);
      setTimeout(() => setCaptured(false), 2000);
    }, 'image/jpeg', 0.92);
  };

  if (!videoUrl) return (
    <div className="flex flex-col items-center justify-center h-full gap-3" style={{ color: 'var(--text-muted)' }}>
      <div className="w-16 h-16 rounded-full flex items-center justify-center"
        style={{ background: 'var(--bg-section)', border: '2px dashed var(--border)' }}>
        <Upload size={22} style={{ color: 'var(--text-muted)' }} />
      </div>
      <p className="font-mono text-xs text-center opacity-60">Aperçu reel</p>
    </div>
  );

  return (
    <div className="relative w-full h-full rounded-[28px] overflow-hidden bg-black" style={{ cursor: 'pointer' }}>
      {/* Video or captured thumb */}
      {thumbUrl && !playing && (
        <img src={thumbUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
      )}
      <video ref={vRef} src={videoUrl} className="absolute inset-0 w-full h-full object-cover"
        loop playsInline style={{ display: (!thumbUrl || playing) ? 'block' : 'none' }} />

      {/* Hidden canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Gradient overlay */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)' }} />

      {/* Play/pause — center */}
      <div className="absolute inset-0 flex items-center justify-center" onClick={toggle}>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
          className="w-14 h-14 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '2px solid rgba(255,255,255,0.3)' }}>
          {playing
            ? <span className="text-white text-xs font-bold tracking-widest">II</span>
            : <Play size={20} fill="white" color="white" className="ml-1" />}
        </motion.div>
      </div>

      {/* Capture button — top right */}
      <motion.button
        onClick={capture}
        whileTap={{ scale: 0.9 }}
        className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-lg font-mono text-[10px] font-bold transition-all"
        style={{
          background: captured ? 'rgba(34,197,94,0.85)' : 'rgba(0,0,0,0.55)',
          color: '#fff',
          backdropFilter: 'blur(8px)',
          border: `1px solid ${captured ? 'rgba(74,222,128,0.5)' : 'rgba(255,255,255,0.2)'}`,
        }}>
        {captured ? '✓ Capturé' : <><ImageIcon size={10} /> Recapturer</>}
      </motion.button>

      {/* Stars top-left */}
      <div className="absolute top-3 left-3">
        <span className="text-sm" style={{ color: '#facc15', textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}>
          {'★'.repeat(Number(form.stars))}
        </span>
      </div>

      {/* User info bottom */}
      <div className="absolute bottom-4 left-4 right-10">
        <p className="font-display text-sm font-bold text-white leading-tight drop-shadow-lg">
          {form.name || 'Nom de l\'étudiant(e)'}
        </p>
        {(form.role || form.city) && (
          <p className="font-mono text-[11px] mt-0.5 text-white/70">
            {[form.role, form.city].filter(Boolean).join(' · ')}
          </p>
        )}
      </div>

      {/* Right sidebar icons */}
      <div className="absolute right-3 bottom-16 flex flex-col items-center gap-4">
        {['♡', '💬', '➤'].map((icon, i) => (
          <span key={i} className="text-lg text-white drop-shadow">{icon}</span>
        ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════
// REEL CARD (list item)
// ═══════════════════════════════
const ReelCard = ({ item, onToggle, onDelete }) => {
  const [playing, setPlaying] = useState(false);
  const vRef = useRef(null);

  const toggle = (e) => {
    e.stopPropagation();
    if (!vRef.current) return;
    if (playing) { vRef.current.pause(); setPlaying(false); }
    else         { vRef.current.play();  setPlaying(true);  }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      className="relative rounded-2xl overflow-hidden group"
      style={{ aspectRatio: '9/16', background: '#000', opacity: item.is_active ? 1 : 0.45,
               border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}>

      {/* Media */}
      {item.thumbnail_url && !playing ? (
        <img src={item.thumbnail_url} alt="" className="absolute inset-0 w-full h-full object-cover" />
      ) : null}
      <video ref={vRef} src={item.video_url} className="absolute inset-0 w-full h-full object-cover"
        loop playsInline style={{ display: (!item.thumbnail_url || playing) ? 'block' : 'none' }} />

      {/* Gradient overlay */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.08) 55%, transparent 100%)' }} />

      {/* Status badge */}
      <div className="absolute top-3 left-3">
        <span className="font-mono text-[10px] px-2 py-0.5 rounded-full backdrop-blur-sm"
          style={{ background: item.is_active ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)',
                   color: item.is_active ? '#4ade80' : '#f87171',
                   border: `1px solid ${item.is_active ? 'rgba(74,222,128,0.3)' : 'rgba(248,113,113,0.3)'}` }}>
          {item.is_active ? 'Actif' : 'Masqué'}
        </span>
      </div>

      {/* Stars top-right */}
      <div className="absolute top-3 right-3">
        <span className="text-xs" style={{ color: '#facc15', textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
          {'★'.repeat(item.stars || 5)}
        </span>
      </div>

      {/* Play/pause button center */}
      <button onClick={toggle}
        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <motion.div whileTap={{ scale: 0.9 }}
          className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)', border: '1.5px solid rgba(255,255,255,0.35)' }}>
          {playing
            ? <span className="text-white text-sm font-bold">II</span>
            : <Play size={18} fill="white" color="white" className="ml-0.5" />}
        </motion.div>
      </button>

      {/* Bottom info */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <p className="font-display text-sm font-bold text-white leading-tight">
          {item.name || 'Anonyme'}
        </p>
        {(item.role || item.city) && (
          <p className="font-mono text-[11px] mt-0.5 text-white/65">
            {[item.role, item.city].filter(Boolean).join(' · ')}
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-3">
          <button onClick={() => onToggle(item)}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-mono transition-all"
            style={{ background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.8)',
                     backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)' }}>
            {item.is_active ? <><EyeOff size={11} /> Masquer</> : <><Eye size={11} /> Afficher</>}
          </button>
          <button onClick={() => onDelete(item)}
            className="p-1.5 rounded-lg transition-all"
            style={{ background: 'rgba(239,68,68,0.18)', color: '#f87171',
                     backdropFilter: 'blur(8px)', border: '1px solid rgba(239,68,68,0.25)' }}>
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// ═══════════════════════════════
// TESTIMONIALS MANAGER (Supabase)
// ═══════════════════════════════
const TestimonialsManager = () => {
  const [items, setItems]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showForm, setShowForm]   = useState(false);
  const [confirm, setConfirm]     = useState(null);
  const [form, setForm]           = useState({ name: '', city: '', role: '', stars: 5 });
  const [videoFile, setVideoFile] = useState(null);
  const [thumbFile, setThumbFile] = useState(null);
  const videoRef = useRef(null);
  const thumbRef = useRef(null);
  const { success, error: showError } = useToastStore();

  // Auto-capture thumbnail when video is selected
  useEffect(() => {
    if (!videoFile) { setThumbFile(null); return; }
    const video  = document.createElement('video');
    const canvas = document.createElement('canvas');
    video.preload = 'metadata';
    video.muted   = true;
    video.src     = URL.createObjectURL(videoFile);
    video.addEventListener('loadedmetadata', () => {
      video.currentTime = Math.min(1, video.duration * 0.1);
    });
    video.addEventListener('seeked', () => {
      canvas.width  = video.videoWidth  || 720;
      canvas.height = video.videoHeight || 1280;
      canvas.getContext('2d').drawImage(video, 0, 0);
      canvas.toBlob(blob => {
        if (!blob) return;
        setThumbFile(new File([blob], 'thumbnail.jpg', { type: 'image/jpeg' }));
        URL.revokeObjectURL(video.src);
      }, 'image/jpeg', 0.92);
    });
  }, [videoFile]);

  if (!supabase) {
    return (
      <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-6 text-center text-yellow-400">
        Supabase non configuré — ajoutez <code>VITE_SUPABASE_URL</code> et <code>VITE_SUPABASE_ANON_KEY</code> dans <code>client/.env</code>
      </div>
    );
  }

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async () => {
    if (!videoFile) { showError('Sélectionnez une vidéo'); return; }
    setUploading(true);
    try {
      const videoUrl = await uploadVideo(videoFile);
      const thumbUrl = thumbFile ? await uploadThumb(thumbFile) : null;
      await supabase.from('testimonials').insert([{
        name: form.name || null,
        city: form.city || null,
        role: form.role || null,
        stars: Number(form.stars),
        video_url: videoUrl,
        thumbnail_url: thumbUrl,
        is_active: true,
      }]);
      success('Témoignage ajouté ✓');
      setShowForm(false);
      setForm({ name: '', city: '', role: '', stars: 5 });
      setVideoFile(null);
      setThumbFile(null);
      load();
    } catch (e) { showError('Erreur: ' + e.message); }
    finally { setUploading(false); }
  };

  const toggleActive = async (item) => {
    await supabase.from('testimonials').update({ is_active: !item.is_active }).eq('id', item.id);
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, is_active: !i.is_active } : i));
  };

  const handleDelete = async (item) => {
    await deleteFile(item.video_url);
    if (item.thumbnail_url) await deleteFile(item.thumbnail_url);
    await supabase.from('testimonials').delete().eq('id', item.id);
    setItems(prev => prev.filter(i => i.id !== item.id));
    success('Supprimé ✓');
    setConfirm(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Témoignages
        </h2>
        <Button icon={<Plus size={16} />} onClick={() => setShowForm(true)} size="sm">
          Ajouter
        </Button>
      </div>

      {/* Add form — reel preview layout */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            className="rounded-2xl overflow-hidden"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>

            {/* Form header */}
            <div className="px-6 pt-5 pb-4" style={{ borderBottom: '1px solid var(--border)' }}>
              <h3 className="font-display font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
                Nouveau témoignage
              </h3>
              <p className="font-mono text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                Aperçu en temps réel · format Reel 9:16
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Left — fields */}
              <div className="p-6 space-y-4" style={{ borderRight: '1px solid var(--border)' }}>
                <div className="grid grid-cols-2 gap-3">
                  <Input placeholder="Nom (optionnel)" value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                  <Input placeholder="Ville (optionnel)" value={form.city}
                    onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
                </div>
                <Input placeholder="Rôle (ex: Étudiante Moulage)" value={form.role}
                  onChange={e => setForm(f => ({ ...f, role: e.target.value }))} />

                <div>
                  <label className="font-mono text-xs mb-1.5 block" style={{ color: 'var(--text-muted)' }}>Étoiles</label>
                  <div className="flex gap-2">
                    {[5,4,3,2,1].map(n => (
                      <button key={n} onClick={() => setForm(f => ({ ...f, stars: n }))}
                        className="flex-1 py-2 rounded-xl text-sm font-mono transition-all"
                        style={{
                          background: Number(form.stars) === n ? 'var(--blue)' : 'var(--bg-section)',
                          color: Number(form.stars) === n ? '#fff' : 'var(--text-muted)',
                          border: `1px solid ${Number(form.stars) === n ? 'var(--blue)' : 'var(--border)'}`,
                        }}>
                        {n}★
                      </button>
                    ))}
                  </div>
                </div>

                {/* Video drop zone */}
                <div>
                  <label className="font-mono text-xs mb-1.5 block" style={{ color: 'var(--text-muted)' }}>
                    Vidéo * (.mp4, .mov, .webm)
                  </label>
                  <div onClick={() => videoRef.current?.click()}
                    className="relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all group/drop"
                    style={{ borderColor: videoFile ? 'var(--blue)' : 'var(--border)',
                             background: videoFile ? 'rgba(37,99,235,0.04)' : 'var(--bg-section)' }}>
                    <input ref={videoRef} type="file" accept="video/*" className="hidden"
                      onChange={e => setVideoFile(e.target.files[0])} />
                    {videoFile ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: 'var(--blue)' }}>
                          <Play size={10} fill="white" color="white" />
                        </div>
                        <span className="font-mono text-xs" style={{ color: 'var(--blue)' }}>{videoFile.name}</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1">
                        <Upload size={18} style={{ color: 'var(--text-muted)' }} />
                        <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>Choisir une vidéo</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Thumbnail — capture from video */}
                <FrameCapture videoFile={videoFile} thumbFile={thumbFile} onCapture={setThumbFile} thumbRef={thumbRef} />

                <div className="flex gap-3 pt-1">
                  <Button onClick={handleSubmit} loading={uploading} icon={<Upload size={13} />}>
                    {uploading ? 'Upload...' : 'Enregistrer'}
                  </Button>
                  <Button variant="secondary" onClick={() => { setShowForm(false); setVideoFile(null); setThumbFile(null); }}>
                    Annuler
                  </Button>
                </div>
              </div>

              {/* Right — Reel phone preview */}
              <div className="flex items-center justify-center p-8" style={{ background: 'var(--bg-section)' }}>
                {/* Phone frame */}
                <div className="relative" style={{ width: 200 }}>
                  {/* Phone shell */}
                  <div className="relative rounded-[36px] p-[10px]"
                    style={{ background: 'linear-gradient(145deg, #2a2a2a, #1a1a1a)',
                             boxShadow: '0 0 0 1px rgba(255,255,255,0.08), 0 24px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)' }}>
                    {/* Notch */}
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 w-16 h-4 rounded-full z-10"
                      style={{ background: '#111' }} />
                    {/* Screen */}
                    <div className="rounded-[28px] overflow-hidden bg-black"
                      style={{ aspectRatio: '9/16', position: 'relative' }}>
                      <ReelPreview videoFile={videoFile} thumbFile={thumbFile} form={form} onCapture={setThumbFile} />
                    </div>
                    {/* Home bar */}
                    <div className="mx-auto mt-2 rounded-full" style={{ width: 60, height: 4, background: 'rgba(255,255,255,0.2)' }} />
                  </div>

                  {/* Label */}
                  <p className="text-center font-mono text-[10px] mt-4" style={{ color: 'var(--text-muted)' }}>
                    Aperçu · {videoFile ? 'cliquez pour lire' : 'choisissez une vidéo'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reel grid */}
      {loading ? (
        <div className="text-center py-12 font-mono text-sm" style={{ color: 'var(--text-muted)' }}>Chargement...</div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4" style={{ color: 'var(--text-muted)' }}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <Play size={24} style={{ color: 'var(--text-muted)' }} />
          </div>
          <p className="font-mono text-sm">Aucun témoignage · Ajoutez votre premier reel</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {items.map(item => (
            <ReelCard key={item.id} item={item} onToggle={toggleActive} onDelete={setConfirm} />
          ))}
        </div>
      )}

      <ConfirmModal isOpen={!!confirm} onClose={() => setConfirm(null)}
        message={`Supprimer le témoignage de "${confirm?.name || 'Anonyme'}" ? La vidéo sera supprimée définitivement.`}
        onConfirm={() => handleDelete(confirm)} />
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
            <Route path="gallery"        element={<GalleryManager />} />
            <Route path="testimonials"  element={<TestimonialsManager />} />
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
