import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';

const SAMPLE_DATA = [
  { month: 'Jan', revenue: 12400 },
  { month: 'Fév', revenue: 18900 },
  { month: 'Mar', revenue: 14200 },
  { month: 'Avr', revenue: 22100 },
  { month: 'Mai', revenue: 28400 },
  { month: 'Jun', revenue: 31200 },
  { month: 'Jul', revenue: 26800 },
  { month: 'Aoû', revenue: 35100 },
  { month: 'Sep', revenue: 29600 },
  { month: 'Oct', revenue: 38900 },
  { month: 'Nov', revenue: 42300 },
  { month: 'Déc', revenue: 47800 }
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: '8px 14px' }}>
        <p className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>{label}</p>
        <p className="font-mono text-sm font-bold" style={{ color: 'var(--blue)' }}>
          {payload[0].value.toLocaleString()} TND
        </p>
      </div>
    );
  }
  return null;
};

const ChartRevenue = ({ data = SAMPLE_DATA }) => (
  <div className="rounded-2xl p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}>
    <div className="mb-4">
      <h3 className="font-mono text-xs tracking-widest uppercase mb-1" style={{ color: 'var(--text-muted)' }}>Chiffre d'Affaires</h3>
      <p className="font-display text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Mensuel</p>
    </div>
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <defs>
          <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#2563eb" stopOpacity={0.18} />
            <stop offset="95%" stopColor="#2563eb" stopOpacity={0}    />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'Space Mono' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'Space Mono' }} axisLine={false} tickLine={false} tickFormatter={v => `${v / 1000}k`} />
        <Tooltip content={<CustomTooltip />} />
        <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2} fill="url(#revenueGrad)" />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

export default ChartRevenue;
