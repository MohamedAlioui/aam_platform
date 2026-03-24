import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from 'recharts';

const SAMPLE = [
  { name: 'Design',    value: 48 },
  { name: 'Couture',   value: 35 },
  { name: 'Moulage',   value: 22 },
  { name: 'Corsage',   value: 18 },
  { name: 'Mariage',   value: 27 },
  { name: 'Beauté',    value: 41 },
  { name: 'Marketing', value: 15 },
  { name: '6ix',       value: 31 },
];

const BAR_COLORS = ['#2563eb', '#3b82f6', '#4f46e5', '#be185d', '#7c3aed', '#d97706', '#0f766e', '#111827'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: '8px 14px' }}>
        <p className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>{label}</p>
        <p className="font-mono text-sm font-bold" style={{ color: 'var(--blue)' }}>{payload[0].value} inscrits</p>
      </div>
    );
  }
  return null;
};

const ChartCourses = ({ data = SAMPLE }) => (
  <div className="rounded-2xl p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}>
    <div className="mb-4">
      <h3 className="font-mono text-xs tracking-widest uppercase mb-1" style={{ color: 'var(--text-muted)' }}>Popularité</h3>
      <p className="font-display text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Cours</p>
    </div>
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'Space Mono' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'Space Mono' }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={36}>
          {data.map((_, i) => <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default ChartCourses;
