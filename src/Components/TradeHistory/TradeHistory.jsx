import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts';

const colors = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'];

const dummyTxHistory = [
  {
    type: 'sell',
    sellAmount: { amount: 50, currency: 'TOKEN' },
    buyAmount: { amount: 2.5, currency: 'SOL' },
    date: new Date('2025-03-01T10:00:00Z'),
  },
  {
    type: 'buy',
    sellAmount: { amount: 3, currency: 'SOL' },
    buyAmount: { amount: 60, currency: 'TOKEN' },
    date: new Date('2025-03-01T11:00:00Z'),
  },
  {
    type: 'sell',
    sellAmount: { amount: 20, currency: 'TOKEN' },
    buyAmount: { amount: 1, currency: 'SOL' },
    date: new Date('2025-03-01T12:00:00Z'),
  },
  {
    type: 'buy',
    sellAmount: { amount: 5, currency: 'SOL' },
    buyAmount: { amount: 100, currency: 'TOKEN' },
    date: new Date('2025-03-01T13:00:00Z'),
  },
  {
    type: 'sell',
    sellAmount: { amount: 15, currency: 'TOKEN' },
    buyAmount: { amount: 0.75, currency: 'SOL' },
    date: new Date('2025-03-01T14:00:00Z'),
  },
  {
    type: 'buy',
    sellAmount: { amount: 2, currency: 'SOL' },
    buyAmount: { amount: 40, currency: 'TOKEN' },
    date: new Date('2025-03-01T15:00:00Z'),
  },
  {
    type: 'sell',
    sellAmount: { amount: 30, currency: 'TOKEN' },
    buyAmount: { amount: 1.5, currency: 'SOL' },
    date: new Date('2025-03-01T16:00:00Z'),
  },
  {
    type: 'buy',
    sellAmount: { amount: 6, currency: 'SOL' },
    buyAmount: { amount: 120, currency: 'TOKEN' },
    date: new Date('2025-03-01T17:00:00Z'),
  },
  {
    type: 'sell',
    sellAmount: { amount: 10, currency: 'TOKEN' },
    buyAmount: { amount: 0.5, currency: 'SOL' },
    date: new Date('2025-03-01T18:00:00Z'),
  },
  {
    type: 'buy',
    sellAmount: { amount: 4, currency: 'SOL' },
    buyAmount: { amount: 80, currency: 'TOKEN' },
    date: new Date('2025-03-01T19:00:00Z'),
  },
];

// Customizing the chart structure for the dummy transaction data
const prepareData = (txHistory) => {
  return txHistory.map(({ type, sellAmount, buyAmount, date }) => ({
    date: date.toISOString(),
    open: type === 'buy' ? sellAmount.amount : buyAmount.amount,  // Open price (amount)
    close: type === 'buy' ? buyAmount.amount : sellAmount.amount, // Close price (amount)
    high: Math.max(sellAmount.amount, buyAmount.amount),          // High value
    low: Math.min(sellAmount.amount, buyAmount.amount),           // Low value
    type,                                                         // 'buy' or 'sell'
  }));
};

const Candlestick = ({ fill, x, y, width, height, low, high, openClose }) => {
  const [open,close] = openClose
  const isGrowing = open < close;
  const color = isGrowing ? 'green' : 'red';
  const ratio = Math.abs(height / (open - close));

  return (
    <g stroke={color} fill="none" strokeWidth="2">
      <path
        d={`M ${x},${y} L ${x},${y + height} L ${x + width},${y + height} L ${x + width},${y} L ${x},${y}`}
      />
      {/* Bottom line */}
      {isGrowing ? (
        <path
          d={`M ${x + width / 2}, ${y + height} v ${(open - low) * ratio}`}
        />
      ) : (
        <path
          d={`M ${x + width / 2}, ${y} v ${(close - low) * ratio}`}
        />
      )}
      {/* Top line */}
      {isGrowing ? (
        <path
          d={`M ${x + width / 2}, ${y} v ${(close - high) * ratio}`}
        />
      ) : (
        <path
          d={`M ${x + width / 2}, ${y + height} v ${(open - high) * ratio}`}
        />
      )}
    </g>
  );
};

const CustomShapeBarChart = () => {
  const data = prepareData(dummyTxHistory);

  // Safety check to avoid errors during reduce
  const minValue = data.reduce(
    (minValue, { low, openClose }) => {
      if (openClose && openClose.length === 2) {
        const [open, close] = openClose;
        const currentMin = Math.min(low, open, close);
        return minValue === null || currentMin < minValue ? currentMin : minValue;
      }
      return minValue;
    },
    null
  );

  const maxValue = data.reduce(
    (maxValue, { high, openClose }) => {
      if (openClose && openClose.length === 2) {
        const [open, close] = openClose;
        const currentMax = Math.max(high, open, close);
        return currentMax > maxValue ? currentMax : maxValue;
      }
      return maxValue;
    },
    minValue
  );

  return (
    <BarChart
      width={600}
      height={300}
      data={data}
      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
    >
      <XAxis dataKey="date" />
      <YAxis domain={[minValue, maxValue]} />
      <CartesianGrid strokeDasharray="3 3" />
      <Tooltip />
      <Bar dataKey="openClose" fill="#8884d8" shape={<Candlestick />}>
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.type === 'buy' ? '#2ca02c' : '#d62728'} />
        ))}
      </Bar>
    </BarChart>
  );
};

export default CustomShapeBarChart;
