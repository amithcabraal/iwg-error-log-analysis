import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ErrorLog, PlatformData } from '../types';

interface Props {
  data: ErrorLog[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const PlatformPieChart: React.FC<Props> = ({ data }) => {
  const platformData: PlatformData[] = data.reduce((acc: PlatformData[], log) => {
    if (log.bluescreen.ua?.platform) {
      const platform = log.bluescreen.ua.platform;
      const existing = acc.find(d => d.platform === platform);
      
      if (existing) {
        existing.count++;
      } else {
        acc.push({ platform, count: 1 });
      }
    }
    return acc;
  }, []);

  return (
    <div className="h-full">
      <h2 className="text-lg font-semibold mb-4">Errors by Platform</h2>
      <ResponsiveContainer width="100%" height="80%">
        <PieChart>
          <Pie
            data={platformData}
            dataKey="count"
            nameKey="platform"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label
          >
            {platformData.map((entry, index) => (
              <Cell key={entry.platform} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PlatformPieChart;