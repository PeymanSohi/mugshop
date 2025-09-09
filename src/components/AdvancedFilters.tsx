import React, { useState } from 'react';
import { X, ChevronDown, ChevronUp, Star, DollarSign, Package } from 'lucide-react';
import { Product } from '../types';

export interface FilterState {
  categories: string[];
  priceRange: [number, number];
  minRating: number;
  inStock: boolean;
  onSale: boolean;
  sortBy: 'relevance' | 'price-asc' | 'price-desc' | 'newest' | 'popularity' | 'rating';
}

interface AdvancedFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  products: Product[];
  categories: string[];
  isOpen: boolean;
  onClose: () => void;
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  filters,
  onFiltersChange,
  products,
  categories,
  isOpen,
  onClose
}) => {
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: true,
    rating: true,
    availability: true,
    sort: true
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Get price range from products
  const prices = products.map(p => p.salePrice || p.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  const handleCategoryToggle = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    
    onFiltersChange({
      ...filters,
      categories: newCategories
    });
  };

  const handlePriceChange = (index: 0 | 1, value: number) => {
    const newRange: [number, number] = [...filters.priceRange];
    newRange[index] = value;
    
    // Ensure min <= max
    if (index === 0 && newRange[0] > newRange[1]) {
      newRange[1] = newRange[0];
    } else if (index === 1 && newRange[1] < newRange[0]) {
      newRange[0] = newRange[1];
    }
    
    onFiltersChange({
      ...filters,
      priceRange: newRange
    });
  };

  const handleRatingChange = (rating: number) => {
    onFiltersChange({
      ...filters,
      minRating: rating
    });
  };

  const handleAvailabilityToggle = (type: 'inStock' | 'onSale') => {
    onFiltersChange({
      ...filters,
      [type]: !filters[type]
    });
  };

  const handleSortChange = (sortBy: FilterState['sortBy']) => {
    onFiltersChange({
      ...filters,
      sortBy
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      categories: [],
      priceRange: [minPrice, maxPrice],
      minRating: 0,
      inStock: false,
      onSale: false,
      sortBy: 'relevance'
    });
  };

  const hasActiveFilters = 
    filters.categories.length > 0 ||
    filters.priceRange[0] !== minPrice ||
    filters.priceRange[1] !== maxPrice ||
    filters.minRating > 0 ||
    filters.inStock ||
    filters.onSale;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-xl overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">فیلترها و مرتب‌سازی</h2>
            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-amber-600 hover:text-amber-700 font-medium"
                >
                  پاک کردن همه
                </button>
              )}
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Sort Section */}
          <div className="mb-6">
            <button
              onClick={() => toggleSection('sort')}
              className="flex items-center justify-between w-full text-right font-medium text-gray-900 mb-3"
            >
              <span>مرتب‌سازی</span>
              {expandedSections.sort ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            {expandedSections.sort && (
              <div className="space-y-2">
                {[
                  { value: 'relevance', label: 'مرتبط‌ترین' },
                  { value: 'price-asc', label: 'قیمت: کم به زیاد' },
                  { value: 'price-desc', label: 'قیمت: زیاد به کم' },
                  { value: 'newest', label: 'جدیدترین' },
                  { value: 'popularity', label: 'محبوب‌ترین' },
                  { value: 'rating', label: 'بالاترین امتیاز' }
                ].map(option => (
                  <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="sort"
                      value={option.value}
                      checked={filters.sortBy === option.value}
                      onChange={() => handleSortChange(option.value as FilterState['sortBy'])}
                      className="text-amber-600 focus:ring-amber-500"
                    />
                    <span className="text-sm text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Categories Section */}
          <div className="mb-6">
            <button
              onClick={() => toggleSection('categories')}
              className="flex items-center justify-between w-full text-right font-medium text-gray-900 mb-3"
            >
              <span>دسته‌بندی</span>
              {expandedSections.categories ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            {expandedSections.categories && (
              <div className="space-y-2">
                {categories.map(category => (
                  <label key={category} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.categories.includes(category)}
                      onChange={() => handleCategoryToggle(category)}
                      className="text-amber-600 focus:ring-amber-500 rounded"
                    />
                    <span className="text-sm text-gray-700">{category}</span>
                    <span className="text-xs text-gray-500">
                      ({products.filter(p => p.category === category).length})
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Price Range Section */}
          <div className="mb-6">
            <button
              onClick={() => toggleSection('price')}
              className="flex items-center justify-between w-full text-right font-medium text-gray-900 mb-3"
            >
              <span>محدوده قیمت</span>
              {expandedSections.price ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            {expandedSections.price && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {filters.priceRange[0].toLocaleString()} - {filters.priceRange[1].toLocaleString()} تومان
                  </span>
                </div>
                <div className="space-y-2">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">حداقل قیمت</label>
                    <input
                      type="number"
                      min={minPrice}
                      max={maxPrice}
                      value={filters.priceRange[0]}
                      onChange={(e) => handlePriceChange(0, Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">حداکثر قیمت</label>
                    <input
                      type="number"
                      min={minPrice}
                      max={maxPrice}
                      value={filters.priceRange[1]}
                      onChange={(e) => handlePriceChange(1, Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Rating Section */}
          <div className="mb-6">
            <button
              onClick={() => toggleSection('rating')}
              className="flex items-center justify-between w-full text-right font-medium text-gray-900 mb-3"
            >
              <span>امتیاز</span>
              {expandedSections.rating ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            {expandedSections.rating && (
              <div className="space-y-2">
                {[4, 3, 2, 1].map(rating => (
                  <label key={rating} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="rating"
                      checked={filters.minRating === rating}
                      onChange={() => handleRatingChange(rating)}
                      className="text-amber-600 focus:ring-amber-500"
                    />
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="text-sm text-gray-700 mr-2">و بالاتر</span>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Availability Section */}
          <div className="mb-6">
            <button
              onClick={() => toggleSection('availability')}
              className="flex items-center justify-between w-full text-right font-medium text-gray-900 mb-3"
            >
              <span>موجودی</span>
              {expandedSections.availability ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            {expandedSections.availability && (
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.inStock}
                    onChange={() => handleAvailabilityToggle('inStock')}
                    className="text-amber-600 focus:ring-amber-500 rounded"
                  />
                  <Package className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-700">فقط موجود</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.onSale}
                    onChange={() => handleAvailabilityToggle('onSale')}
                    className="text-amber-600 focus:ring-amber-500 rounded"
                  />
                  <DollarSign className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-gray-700">تخفیف‌دار</span>
                </label>
              </div>
            )}
          </div>

          {/* Apply Button */}
          <button
            onClick={onClose}
            className="w-full bg-amber-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-amber-700 transition-colors"
          >
            اعمال فیلترها
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFilters;