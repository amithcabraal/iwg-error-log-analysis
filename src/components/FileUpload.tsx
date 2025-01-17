import React from 'react';
import { Upload } from 'lucide-react';
import { ErrorLog } from '../types';

interface Props {
  onDataLoaded: (data: ErrorLog[]) => void;
}

const FileUpload: React.FC<Props> = ({ onDataLoaded }) => {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target?.result as string);
        onDataLoaded(jsonData);
      } catch (error) {
        console.error('Error parsing JSON file:', error);
        alert('Error parsing JSON file. Please ensure it is valid JSON.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex items-center justify-center w-full p-6 border-2 border-dashed border-gray-300 rounded-lg">
      <label className="flex flex-col items-center cursor-pointer">
        <Upload className="w-12 h-12 text-gray-400" />
        <span className="mt-2 text-sm text-gray-500">Upload JSON file</span>
        <input
          type="file"
          className="hidden"
          accept="application/json"
          onChange={handleFileUpload}
        />
      </label>
    </div>
  );
};

export default FileUpload;