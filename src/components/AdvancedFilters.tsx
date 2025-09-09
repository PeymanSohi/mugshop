import React from 'react';
import { X, Filter } from 'lucide-react';

interface AdvancedFiltersProps {
  categories: string[];
  selectedCategories: string[];
  onCategoryToggle: (category: string) => void;
  onClearAll: () => void;
  priceRange: { min: number; max: number };
  onPriceRangeChange: (range: { min: number; max: number }) => void;
  inStockOnly: boolean;
  onInStockToggle: () => void;
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  categories,
  selectedCategories,
  onCategoryToggle,
  onClearAll,
  priceRange,
  onPriceRangeChange,
  inStockOnly,
  onInStockToggle
}) => {
  const hasActiveFilters = selectedCategories.length > 0 || 
                          priceRange.min > 0 || 
                          priceRange.max < 1000 || 
                          inStockOnly;

  return (
    <div>
      {/* Filter Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        {/* Category Multi-select */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">دسته‌بندی</h3>
          <div className="space-y-2">
            {categories.filter(cat => cat !== 'همه').map(category => (
              <label key={category} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() => onCategoryToggle(category)}
                  className="rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500 dark:bg-gray-700"
                />
                <span className="text-sm text-gray-700 dark:text-gray-200">{category}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">محدوده قیمت</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="حداقل"
                value={priceRange.min || ''}
                onChange={(e) => onPriceRangeChange({ ...priceRange, min: Number(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md text-sm focus:ring-primary-500 focus:border-primary-500"
              />
              <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">تومان</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="حداکثر"
                value={priceRange.max === 1000 ? '' : priceRange.max}
                onChange={(e) => onPriceRangeChange({ ...priceRange, max: Number(e.target.value) || 1000 })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md text-sm focus:ring-primary-500 focus:border-primary-500"
              />
              <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">تومان</span>
            </div>
          </div>
        </div>

        {/* Stock Filter */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">موجودی</h3>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={onInStockToggle}
              className="rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500 dark:bg-gray-700"
            />
            <span className="text-sm text-gray-700 dark:text-gray-200">فقط محصولات موجود</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFilters;
