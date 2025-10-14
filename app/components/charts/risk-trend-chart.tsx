"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const data = [
  { date: '2024-01-01', risk: 85, activities: 12 },
  { date: '2024-01-08', risk: 78, activities: 15 },
  { date: '2024-01-15', risk: 72, activities: 18 },
  { date: '2024-01-22', risk: 68, activities: 22 },
  { date: '2024-01-29', risk: 65, activities: 25 },
  { date: '2024-02-05', risk: 62, activities: 28 },
  { date: '2024-02-12', risk: 58, activities: 32 },
  { date: '2024-02-19', risk: 55, activities: 35 },
  { date: '2024-02-26', risk: 52, activities: 38 },
  { date: '2024-03-05', risk: 48, activities: 42 },
  { date: '2024-03-12', risk: 45, activities: 45 },
  { date: '2024-03-19', risk: 42, activities: 48 },
  { date: '2024-03-26', risk: 38, activities: 52 },
  { date: '2024-04-02', risk: 35, activities: 55 },
  { date: '2024-04-09', risk: 32, activities: 58 },
  { date: '2024-04-16', risk: 28, activities: 62 },
  { date: '2024-04-23', risk: 25, activities: 65 },
  { date: '2024-04-30', risk: 22, activities: 68 },
  { date: '2024-05-07', risk: 18, activities: 72 },
  { date: '2024-05-14', risk: 15, activities: 75 },
  { date: '2024-05-21', risk: 12, activities: 78 },
  { date: '2024-05-28', risk: 8, activities: 82 },
  { date: '2024-06-04', risk: 5, activities: 85 },
  { date: '2024-06-11', risk: 3, activities: 88 },
  { date: '2024-06-18', risk: 2, activities: 90 },
  { date: '2024-06-25', risk: 1, activities: 92 },
  { date: '2024-07-02', risk: 0, activities: 95 },
  { date: '2024-07-09', risk: 0, activities: 98 },
  { date: '2024-07-16', risk: 0, activities: 100 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900">{`Date: ${label}`}</p>
        <p className="text-green-600">
          {`Risk Level: ${payload[0].value}%`}
        </p>
        <p className="text-blue-600">
          {`Activities: ${payload[1].value}`}
        </p>
      </div>
    );
  }
  return null;
};

export function RiskTrendChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="h-64 w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            domain={[0, 100]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="risk" 
            stroke="#16a34a" 
            strokeWidth={3}
            dot={{ fill: '#16a34a', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#16a34a', strokeWidth: 2 }}
          />
          <Line 
            type="monotone" 
            dataKey="activities" 
            stroke="#3b82f6" 
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }}
            activeDot={{ r: 5, stroke: '#3b82f6', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

