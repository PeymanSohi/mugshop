import React from 'react';
import { ChevronDown } from 'lucide-react';
import { SortOption } from '../types';

interface SortFilterProps {
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const SortFilter: React.FC<SortFilterProps> = ({ sortOption, onSortChange }) => {
  const sortOptions = [
    { value: 'popularity' as SortOption, label: 'محبوب‌ترین' },
    { value: 'newest' as SortOption, label: 'جدیدترین' },
    { value: 'price-asc' as SortOption, label: 'قیمت: کم به زیاد' },
    { value: 'price-desc' as SortOption, label: 'قیمت: زیاد به کم' },
  ];

  return (
    <div className="flex items-center gap-2 mb-6">
      <span className="text-gray-700 font-medium">مرتب‌سازی:</span>
      <div className="relative">
        <select
          value={sortOption}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-gray-700 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
};

export default SortFilter;
