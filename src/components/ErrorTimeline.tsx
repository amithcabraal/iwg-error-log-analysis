import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { ErrorLog, ChartData } from '../types';

interface Props {
  data: ErrorLog[];
}

const ErrorTimeline: React.FC<Props> = ({ data }) => {
  const chartData: ChartData[] = data.reduce((acc: ChartData[], log) => {
    const timestamp = format(new Date(log['@timestamp']), 'yyyy-MM-dd HH:mm');
    const existing = acc.find(d => d.timestamp === timestamp && d.gameName === log.bluescreen.gameName);
    
    if (existing) {
      existing.count++;
    } else {
      acc.push({
        timestamp,
        count: 1,
        gameName: log.bluescreen.gameName
      });
    }
    
    return acc;
  }, []);

  const games = Array.from(new Set(data.map(log => log.bluescreen.gameName)));
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300'];

  return (
    <div className="h-full">
      <h2 className="text-lg font-semibold mb-4">Error Timeline</h2>
      <ResponsiveContainer width="100%" height="80%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />
          <YAxis />
          <Tooltip />
          <Legend />
          {games.map((game, index) => (
            <Bar
              key={game}
              dataKey="count"
              name={game}
              stackId="a"
              fill={colors[index % colors.length]}
              data={chartData.filter(d => d.gameName === game)}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ErrorTimeline;