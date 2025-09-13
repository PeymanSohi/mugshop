import React, { useState, useEffect, useRef } from 'react';
import { Search, X, TrendingUp, Clock, Filter } from 'lucide-react';
import { Product } from '../types';

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'product' | 'category' | 'recent' | 'trending';
  product?: Product;
}

interface EnhancedSearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onProductSelect: (product: Product) => void;
  onCategorySelect: (category: string) => void;
  products: Product[];
  categories: string[];
  isOpen: boolean;
  onClose: () => void;
}

const EnhancedSearch: React.FC<EnhancedSearchProps> = ({
  searchTerm,
  onSearchChange,
  onProductSelect,
  onCategorySelect,
  products,
  categories,
  isOpen,
  onClose
}) => {
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [trendingSearches] = useState(['ماگ سفید', 'ماگ کلاسیک', 'ماگ مدرن', 'ست ماگ']);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Generate suggestions based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const newSuggestions: SearchSuggestion[] = [];

    // Product suggestions
    const productMatches = products
      .filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice(0, 5)
      .map(product => ({
        id: `product-${product.id}`,
        text: product.name,
        type: 'product' as const,
        product
      }));

    // Category suggestions
    const categoryMatches = categories
      .filter(category => 
        category.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice(0, 3)
      .map(category => ({
        id: `category-${category}`,
        text: category,
        type: 'category' as const
      }));

    newSuggestions.push(...productMatches, ...categoryMatches);
    setSuggestions(newSuggestions);
    setShowSuggestions(true);
  }, [searchTerm, products, categories]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onSearchChange(value);
    setSelectedIndex(-1);
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: SearchSuggestion) => {
    onSearchChange(suggestion.text);
    setShowSuggestions(false);
    
    // Save to recent searches
    if (!recentSearches.includes(suggestion.text)) {
      const newRecent = [suggestion.text, ...recentSearches].slice(0, 5);
      setRecentSearches(newRecent);
      localStorage.setItem('recentSearches', JSON.stringify(newRecent));
    }

    // Handle selection based on type
    if (suggestion.type === 'product' && suggestion.product) {
      onProductSelect(suggestion.product);
    } else if (suggestion.type === 'category') {
      onCategorySelect(suggestion.text);
    }
  };

  // Handle search execution
  const executeSearch = () => {
    if (searchTerm.trim()) {
      // Save to recent searches
      if (!recentSearches.includes(searchTerm.trim())) {
        const newRecent = [searchTerm.trim(), ...recentSearches].slice(0, 5);
        setRecentSearches(newRecent);
        localStorage.setItem('recentSearches', JSON.stringify(newRecent));
      }
      setShowSuggestions(false);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        if (showSuggestions) {
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < suggestions.length - 1 ? prev + 1 : prev
          );
        }
        break;
      case 'ArrowUp':
        if (showSuggestions) {
          e.preventDefault();
          setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        }
        break;
      case 'Enter':
        e.preventDefault();
        if (showSuggestions && selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSuggestionSelect(suggestions[selectedIndex]);
        } else {
          executeSearch();
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // Clear search
  const clearSearch = () => {
    onSearchChange('');
    setShowSuggestions(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  // Get suggestions to display
  const getDisplaySuggestions = () => {
    if (!showSuggestions) return [];
    
    if (searchTerm.trim()) {
      return suggestions;
    }

    // Show recent and trending when no search term
    const recentSuggestions: SearchSuggestion[] = recentSearches.map((search, index) => ({
      id: `recent-${index}`,
      text: search,
      type: 'recent' as const
    }));

    const trendingSuggestions: SearchSuggestion[] = trendingSearches.map((search, index) => ({
      id: `trending-${index}`,
      text: search,
      type: 'trending' as const
    }));

    return [...recentSuggestions, ...trendingSuggestions];
  };

  const displaySuggestions = getDisplaySuggestions();

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          placeholder="جستجو در محصولات..."
          className="block w-full pr-20 pl-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg leading-5 bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 dark:focus:placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:border-primary-500 text-sm text-gray-900 dark:text-white transition-all duration-200"
        />
        {/* Search Button */}
        <button
          onClick={executeSearch}
          className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
          type="button"
        >
          <Search className="h-4 w-4" />
        </button>
        
        {/* Clear Button */}
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 left-8 pl-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && displaySuggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-80 overflow-y-auto"
        >
          {displaySuggestions.map((suggestion, index) => (
            <div
              key={suggestion.id}
              onClick={() => handleSuggestionSelect(suggestion)}
              className={`px-4 py-3 cursor-pointer flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                index === selectedIndex ? 'bg-amber-50 dark:bg-amber-900/20 border-r-4 border-amber-500' : ''
              }`}
            >
              <div className="flex-shrink-0">
                {suggestion.type === 'product' && <Search className="h-4 w-4 text-gray-400" />}
                {suggestion.type === 'category' && <Filter className="h-4 w-4 text-blue-400" />}
                {suggestion.type === 'recent' && <Clock className="h-4 w-4 text-gray-400" />}
                {suggestion.type === 'trending' && <TrendingUp className="h-4 w-4 text-green-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {suggestion.text}
                </p>
                {suggestion.type === 'product' && suggestion.product && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {suggestion.product.category} • {suggestion.product.price} تومان
                  </p>
                )}
                {suggestion.type === 'recent' && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">جستجوی اخیر</p>
                )}
                {suggestion.type === 'trending' && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">محبوب</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EnhancedSearch;
