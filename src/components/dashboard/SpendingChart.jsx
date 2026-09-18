import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useCurrency } from '@/lib/CurrencyContext';

const COLORS = [
  'hsl(25, 85%, 57%)',
  'hsl(222, 47%, 18%)',
  'hsl(173, 58%, 39%)',
  'hsl(43, 74%, 66%)',
  'hsl(340, 65%, 55%)',
  'hsl(200, 60%, 50%)',
  'hsl(120, 40%, 50%)',
  'hsl(280, 50%, 55%)',
];

export default function SpendingChart({ subscriptions }) {
  const { fmtDecimals, fmt, currency } = useCurrency();
  const active = subscriptions.filter(s => s.status === 'active');

  const categoryData = {};
  active.forEach(s => {
    const cat = s.category || 'other';
    const monthlyCost = s.billing_cycle === 'yearly' ? s.cost / 12 : s.billing_cycle === 'quarterly' ? s.cost / 3 : s.cost;
    categoryData[cat] = (categoryData[cat] || 0) + monthlyCost;
  });

  const data = Object.entries(categoryData).map(([name, value]) => ({
    name: name.replace(/_/g, ' '),
    value: Math.round(value * 100) / 100,
  }));

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
        No active subscriptions
      </div>
    );
  }

  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="flex items-center gap-6">
      <div className="w-40 h-40 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={70}
              paddingAngle={3}
              dataKey="value"
              stroke="none"
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(val) => `${fmtDecimals(val)}/mo`}
              contentStyle={{
                background: 'hsl(0 0% 100%)',
                border: '1px solid hsl(40, 15%, 88%)',
                borderRadius: '12px',
                fontSize: '12px',
                padding: '8px 12px',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="space-y-2 flex-1 min-w-0">
        <p className="text-2xl font-display font-semibold">{fmtDecimals(total)}<span className="text-sm font-sans text-muted-foreground">/mo</span></p>
        {data.slice(0, 4).map((d, i) => (
          <div key={d.name} className="flex items-center gap-2 text-xs">
            <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
            <span className="capitalize truncate text-muted-foreground">{d.name}</span>
            <span className="ml-auto font-medium">{fmt(d.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
