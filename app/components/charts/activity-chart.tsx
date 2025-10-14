"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const data = [
  { name: 'Jan', cleaning: 12, vaccination: 8, feeding: 15, maintenance: 5 },
  { name: 'Feb', cleaning: 15, vaccination: 10, feeding: 18, maintenance: 7 },
  { name: 'Mar', cleaning: 18, vaccination: 12, feeding: 20, maintenance: 8 },
  { name: 'Apr', cleaning: 20, vaccination: 15, feeding: 22, maintenance: 10 },
  { name: 'May', cleaning: 22, vaccination: 18, feeding: 25, maintenance: 12 },
  { name: 'Jun', cleaning: 25, vaccination: 20, feeding: 28, maintenance: 15 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900 mb-2">{`Month: ${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }}>
            {`${entry.dataKey}: ${entry.value} activities`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function ActivityChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="h-64 w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="cleaning" stackId="a" fill="#16a34a" name="Cleaning" />
          <Bar dataKey="vaccination" stackId="a" fill="#3b82f6" name="Vaccination" />
          <Bar dataKey="feeding" stackId="a" fill="#eab308" name="Feeding" />
          <Bar dataKey="maintenance" stackId="a" fill="#dc2626" name="Maintenance" />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

