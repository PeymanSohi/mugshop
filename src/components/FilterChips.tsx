import React from 'react';
import { X } from 'lucide-react';
import { FilterState } from './AdvancedFilters';

interface FilterChipsProps {
  filters: FilterState;
  onRemoveFilter: (filterType: keyof FilterState, value?: any) => void;
  onClearAll: () => void;
  categories: string[];
  priceRange: [number, number];
}

const FilterChips: React.FC<FilterChipsProps> = ({
  filters,
  onRemoveFilter,
  onClearAll,
  categories,
  priceRange
}) => {
  const getFilterChips = () => {
    const chips: Array<{
      id: string;
      label: string;
      type: keyof FilterState;
      value?: any;
    }> = [];

    // Category chips
    filters.categories.forEach(category => {
      chips.push({
        id: `category-${category}`,
        label: category,
        type: 'categories',
        value: category
      });
    });

    // Price range chip
    if (filters.priceRange[0] > priceRange[0] || filters.priceRange[1] < priceRange[1]) {
      chips.push({
        id: 'price-range',
        label: `${filters.priceRange[0].toLocaleString()} - ${filters.priceRange[1].toLocaleString()} تومان`,
        type: 'priceRange',
        value: priceRange
      });
    }

    // Rating chip
    if (filters.minRating > 0) {
      chips.push({
        id: 'rating',
        label: `${filters.minRating}+ ستاره`,
        type: 'minRating',
        value: 0
      });
    }

    // In stock chip
    if (filters.inStock) {
      chips.push({
        id: 'in-stock',
        label: 'فقط موجود',
        type: 'inStock',
        value: false
      });
    }

    // On sale chip
    if (filters.onSale) {
      chips.push({
        id: 'on-sale',
        label: 'تخفیف‌دار',
        type: 'onSale',
        value: false
      });
    }

    // Sort chip
    if (filters.sortBy !== 'relevance') {
      const sortLabels = {
        'price-asc': 'قیمت: کم به زیاد',
        'price-desc': 'قیمت: زیاد به کم',
        'newest': 'جدیدترین',
        'popularity': 'محبوب‌ترین',
        'rating': 'بالاترین امتیاز'
      };
      
      chips.push({
        id: 'sort',
        label: sortLabels[filters.sortBy],
        type: 'sortBy',
        value: 'relevance'
      });
    }

    return chips;
  };

  const chips = getFilterChips();

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <span className="text-sm text-gray-600 font-medium">فیلترهای فعال:</span>
      {chips.map(chip => (
        <div
          key={chip.id}
          className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium"
        >
          <span>{chip.label}</span>
          <button
            onClick={() => onRemoveFilter(chip.type, chip.value)}
            className="hover:bg-amber-200 rounded-full p-0.5 transition-colors"
            aria-label={`حذف فیلتر ${chip.label}`}
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}
      <button
        onClick={onClearAll}
        className="text-sm text-gray-500 hover:text-gray-700 font-medium underline"
      >
        پاک کردن همه
      </button>
    </div>
  );
};

export default FilterChips;
