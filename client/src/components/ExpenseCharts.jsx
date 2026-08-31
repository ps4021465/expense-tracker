import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend
} from 'recharts';
import { PieChart as PieIcon, BarChart3, AlertCircle } from 'lucide-react';

// Curated vibrant color palette aligned with brand theme
const CATEGORY_COLORS = {
  'Food & Dining': '#fa6e06',
  'Transportation': '#425e6a',
  'Utilities': '#244c3c',
  'Entertainment': '#c026d3',
  'Housing': '#335c67',
  'Health & Fitness': '#526c5b',
  'Shopping': '#d97706',
  'Healthcare': '#e11d48',
  'Education': '#0f766e',
  'Miscellaneous': '#64748b'
};

const DEFAULT_COLORS = ['#244c3c', '#fa6e06', '#425e6a', '#526c5b', '#e67e22', '#335c67', '#0f766e', '#889e90'];

const formatCurrency = (val) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2
  }).format(val || 0);
};

// Custom Pie Chart Tooltip
const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="custom-tooltip">
        <p className="custom-tooltip-title">{data.name}</p>
        <p className="custom-tooltip-value">{formatCurrency(data.value)}</p>
        <p style={{ fontSize: '0.8rem', color: '#647a6d', marginTop: '0.2rem', fontWeight: 600 }}>
          {data.payload.count} transaction{data.payload.count > 1 ? 's' : ''}
        </p>
      </div>
    );
  }
  return null;
};

// Custom Bar Chart Tooltip
const CustomBarTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="custom-tooltip-title">{label}</p>
        <p className="custom-tooltip-value">{formatCurrency(payload[0].value)}</p>
        <p style={{ fontSize: '0.8rem', color: '#647a6d', marginTop: '0.2rem', fontWeight: 600 }}>
          {payload[0].payload.count} transaction{payload[0].payload.count > 1 ? 's' : ''}
        </p>
      </div>
    );
  }
  return null;
};

/**
 * ExpenseCharts Component
 * Renders Recharts Donut PieChart (category distribution) and BarChart (monthly spend trends)
 * @param {Object} props
 * @param {Object} props.summary - Summary data object containing categoryBreakdown and monthlyBreakdown
 * @param {boolean} props.isLoading - Loading state indicator
 */
export const ExpenseCharts = ({ summary = {}, isLoading = false }) => {
  const { categoryBreakdown = [], monthlyBreakdown = [] } = summary;

  if (isLoading) {
    return (
      <div className="charts-grid">
        <div className="chart-card skeleton" />
        <div className="chart-card skeleton" />
      </div>
    );
  }

  const pieData = categoryBreakdown.map((item) => ({
    name: item.category,
    value: item.totalAmount,
    count: item.count
  }));

  const barData = monthlyBreakdown.map((item) => ({
    name: item.monthLabel || item.month,
    total: item.totalAmount,
    count: item.count
  }));

  return (
    <div className="charts-grid">
      {/* 1. Category Distribution Pie Chart */}
      <div className="chart-card">
        <div className="chart-header">
          <div>
            <h3 className="chart-title">
              <PieIcon size={20} color="#fa6e06" />
              <span>Category Breakdown</span>
            </h3>
            <p className="chart-subtitle">Distribution of total expenditure</p>
          </div>
        </div>

        <div className="chart-body">
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={270}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => {
                    const color = CATEGORY_COLORS[entry.name] || DEFAULT_COLORS[index % DEFAULT_COLORS.length];
                    return <Cell key={`cell-${index}`} fill={color} stroke="#ffffff" strokeWidth={2} />;
                  })}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
                <Legend
                  formatter={(value) => <span style={{ color: '#193328', fontSize: '0.8rem', fontWeight: 600 }}>{value}</span>}
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                  wrapperStyle={{ paddingTop: '10px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="chart-empty">
              <AlertCircle size={32} />
              <p>No expense data available to display category chart.</p>
            </div>
          )}
        </div>
      </div>

      {/* 2. Monthly Spend Trend Bar Chart */}
      <div className="chart-card">
        <div className="chart-header">
          <div>
            <h3 className="chart-title">
              <BarChart3 size={20} color="#244c3c" />
              <span>Monthly Spend Trends</span>
            </h3>
            <p className="chart-subtitle">Aggregated totals per billing month</p>
          </div>
        </div>

        <div className="chart-body">
          {barData.length > 0 ? (
            <ResponsiveContainer width="100%" height={270}>
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e6eae0" vertical={false} />
                <XAxis
                  dataKey="name"
                  stroke="#526c5b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: '#dcdcbb' }}
                />
                <YAxis
                  stroke="#526c5b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: '#dcdcbb' }}
                  tickFormatter={(v) => `₹${v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}`}
                />
                <Tooltip content={<CustomBarTooltip />} />
                <Bar
                  dataKey="total"
                  fill="url(#barGradient)"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={50}
                />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#244c3c" stopOpacity={0.95} />
                    <stop offset="100%" stopColor="#526c5b" stopOpacity={0.75} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="chart-empty">
              <AlertCircle size={32} />
              <p>No monthly timeline records available to render bar chart.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
