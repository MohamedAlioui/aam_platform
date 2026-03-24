import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

const DataTable = ({
  columns = [],
  data = [],
  loading = false,
  searchable = true,
  pageSize = 10,
  actions
}) => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const filtered = data.filter(row =>
    !search || Object.values(row).some(v =>
      String(v).toLowerCase().includes(search.toLowerCase())
    )
  );

  const pages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="w-full">
      {/* Search bar */}
      {searchable && (
        <div className="relative mb-4">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Rechercher..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="aam-input pl-9 text-sm"
          />
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid var(--border)' }}>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-section)' }}>
              {columns.map(col => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-left font-mono text-[10px] tracking-widest uppercase"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {col.label}
                </th>
              ))}
              {actions && (
                <th className="px-4 py-3 font-mono text-[10px] tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                    {columns.map(col => (
                      <td key={col.key} className="px-4 py-3">
                        <div className="skeleton h-4 rounded w-3/4" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (actions ? 1 : 0)}
                    className="text-center py-12 font-arabic"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    لا توجد نتائج
                  </td>
                </tr>
              ) : (
                paginated.map((row, i) => (
                  <motion.tr
                    key={row._id || i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="transition-colors"
                    style={{ borderBottom: '1px solid var(--border)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-section)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    {columns.map(col => (
                      <td key={col.key} className="px-4 py-3 font-arabic text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {col.render ? col.render(row[col.key], row) : row[col.key] || '—'}
                      </td>
                    ))}
                    {actions && (
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {actions(row)}
                        </div>
                      </td>
                    )}
                  </motion.tr>
                ))
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
            {filtered.length} résultats
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg transition-all disabled:opacity-30"
              style={{ border: '1px solid var(--border)', color: 'var(--blue)' }}
            >
              <ChevronLeft size={14} />
            </button>
            <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>{page} / {pages}</span>
            <button
              onClick={() => setPage(p => Math.min(pages, p + 1))}
              disabled={page === pages}
              className="w-8 h-8 flex items-center justify-center rounded-lg transition-all disabled:opacity-30"
              style={{ border: '1px solid var(--border)', color: 'var(--blue)' }}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
