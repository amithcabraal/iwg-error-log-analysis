import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ErrorLog, BrowserData } from '../types';

interface Props {
  data: ErrorLog[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const BrowserPieChart: React.FC<Props> = ({ data }) => {
  const browserData: BrowserData[] = data.reduce((acc: BrowserData[], log) => {
    if (log.bluescreen.ua?.brands) {
      const mainBrowser = log.bluescreen.ua.brands[0].brand;
      const existing = acc.find(d => d.browser === mainBrowser);
      
      if (existing) {
        existing.count++;
      } else {
        acc.push({ browser: mainBrowser, count: 1 });
      }
    }
    return acc;
  }, []);

  return (
    <div className="h-full">
      <h2 className="text-lg font-semibold mb-4">Errors by Browser</h2>
      <ResponsiveContainer width="100%" height="80%">
        <PieChart>
          <Pie
            data={browserData}
            dataKey="count"
            nameKey="browser"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label
          >
            {browserData.map((entry, index) => (
              <Cell key={entry.browser} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BrowserPieChart;