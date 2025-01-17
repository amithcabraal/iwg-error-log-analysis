import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ErrorLog } from '../types';

interface Props {
  data: ErrorLog[];
}

interface BrowserVersionData {
  name: string;
  value: number;
  children?: BrowserVersionData[];
  color?: string;
}

const COLORS = [
  ['#0088FE', '#4BA7FE', '#7FC1FE', '#B2DBFE'],
  ['#00C49F', '#40D3B4', '#80E1CA', '#BFF0E1'],
  ['#FFBB28', '#FFCC5E', '#FFDD94', '#FFEEC9'],
  ['#FF8042', '#FF9F71', '#FFBEA0', '#FFDDD0'],
];

const BrowserVersionChart: React.FC<Props> = ({ data }) => {
  const browserData = useMemo(() => {
    const browsers = new Map<string, Map<string, number>>();
    
    data.forEach(log => {
      if (log.bluescreen.ua?.brands) {
        const mainBrowser = log.bluescreen.ua.brands[0];
        if (!browsers.has(mainBrowser.brand)) {
          browsers.set(mainBrowser.brand, new Map());
        }
        const versions = browsers.get(mainBrowser.brand)!;
        const version = mainBrowser.version;
        versions.set(version, (versions.get(version) || 0) + 1);
      }
    });

    return Array.from(browsers.entries()).map(([browser, versions], browserIndex) => {
      const browserTotal = Array.from(versions.values()).reduce((a, b) => a + b, 0);
      const colorSet = COLORS[browserIndex % COLORS.length];
      
      return {
        name: browser,
        value: browserTotal,
        color: colorSet[0],
        children: Array.from(versions.entries()).map(([version, count], versionIndex) => ({
          name: `${browser} v${version}`,
          value: count,
          color: colorSet[versionIndex + 1] || colorSet[colorSet.length - 1],
        })),
      };
    });
  }, [data]);

  const allVersions = browserData.flatMap(b => b.children || []);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-2 border rounded shadow">
          <p className="font-semibold">{data.name}</p>
          <p>Count: {data.value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-full">
      <h2 className="text-lg font-semibold mb-4">Errors by Browser & Version</h2>
      <div className="grid grid-cols-2 h-[90%]">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={browserData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={90}
              label
            >
              {browserData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={allVersions}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={90}
              label
            >
              {allVersions.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BrowserVersionChart;