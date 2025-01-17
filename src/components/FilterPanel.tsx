import React from 'react';
import { ErrorLog } from '../types';
import { format } from 'date-fns';

interface Props {
  data: ErrorLog[];
  dateRange: [Date, Date];
  selectedGames: string[];
  selectedBrowsers: string[];
  selectedPlatforms: string[];
  onDateRangeChange: (range: [Date, Date]) => void;
  onGamesChange: (games: string[]) => void;
  onBrowsersChange: (browsers: string[]) => void;
  onPlatformsChange: (platforms: string[]) => void;
}

const FilterPanel: React.FC<Props> = ({
  data,
  dateRange,
  selectedGames,
  selectedBrowsers,
  selectedPlatforms,
  onDateRangeChange,
  onGamesChange,
  onBrowsersChange,
  onPlatformsChange,
}) => {
  const games = Array.from(new Set(data.map(log => log.bluescreen.gameName)));
  const browsers = Array.from(new Set(data.flatMap(log => 
    log.bluescreen.ua?.brands.map(b => b.brand) || []
  )));
  const platforms = Array.from(new Set(data.map(log => 
    log.bluescreen.ua?.platform
  ).filter(Boolean)));

  // Format dates for datetime-local input
  const formatDateForInput = (date: Date) => {
    try {
      return format(date, "yyyy-MM-dd'T'HH:mm");
    } catch (e) {
      return format(new Date(), "yyyy-MM-dd'T'HH:mm");
    }
  };

  return (
    <div className="grid grid-cols-4 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Date Range</label>
        <input
          type="datetime-local"
          value={formatDateForInput(dateRange[0])}
          onChange={e => onDateRangeChange([new Date(e.target.value), dateRange[1]])}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
        <input
          type="datetime-local"
          value={formatDateForInput(dateRange[1])}
          onChange={e => onDateRangeChange([dateRange[0], new Date(e.target.value)])}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Games</label>
        <select
          multiple
          value={selectedGames}
          onChange={e => onGamesChange(Array.from(e.target.selectedOptions, option => option.value))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          {games.map(game => (
            <option key={game} value={game}>{game}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Browsers</label>
        <select
          multiple
          value={selectedBrowsers}
          onChange={e => onBrowsersChange(Array.from(e.target.selectedOptions, option => option.value))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          {browsers.map(browser => (
            <option key={browser} value={browser}>{browser}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Platforms</label>
        <select
          multiple
          value={selectedPlatforms}
          onChange={e => onPlatformsChange(Array.from(e.target.selectedOptions, option => option.value))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          {platforms.map(platform => (
            <option key={platform} value={platform}>{platform}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FilterPanel;