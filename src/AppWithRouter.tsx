import { useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDebounce } from './hooks/useDebounce';
import { useUrlState } from './hooks/useUrlState';
import { AppProvider, useAppContext } from './context/AppContext';
import { ToastProvider } from './context/ToastContext';
import { UserProvider, useUser } from './context/UserContext';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import CategoryFilter from './components/CategoryFilter';
import AdvancedFilters from './components/AdvancedFilters';
import Pagination from './components/Pagination';
import Cart from './components/Cart';
import MiniCart from './components/MiniCart';
import LoginModal from './components/LoginModal';
import RegisterModal from './components/RegisterModal';
import UserDashboardModal from './components/UserDashboardModal';
import Footer from './components/Footer';
import ProductPage from './pages/ProductPage';
import ResponsiveContainer from './components/ResponsiveContainer';
import ResponsiveGrid from './components/ResponsiveGrid';
import { products, categories } from './data/products';
import { Product, SortOption, PaginationState, FilterState } from './types';
import { Filter, ChevronDown, ChevronUp } from 'lucide-react';
import AnimatedBackground from './components/AnimatedBackground';
import FilterChips from './components/FilterChips';

function HomePage() {
  const { t } = useTranslation();
  const { cart, auth, addToCart, removeFromCart, updateQuantity, toggleWishlist, isInWishlist, isLoading } = useAppContext();
  const { user, orders, isAuthenticated, login, register, logout, updateProfile, addAddress, updateAddress, deleteAddress } = useUser();
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMiniCartOpen, setIsMiniCartOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  // URL state management
  const { urlState, updateUrl } = useUrlState();
  const [selectedCategory, setSelectedCategory] = useState(urlState.category || 'همه');
  const [searchTerm, setSearchTerm] = useState(urlState.search || '');
  const [sortOption, setSortOption] = useState<SortOption>((urlState.sort as SortOption) || 'popularity');
  const [currentPage, setCurrentPage] = useState(parseInt(urlState.page || '1'));
  const itemsPerPage = 12;
  
  // Advanced filters state
  // Calculate actual price range from products
  const priceRange = useMemo(() => {
    const prices = products.map(p => p.salePrice || p.price);
    return [Math.min(...prices), Math.max(...prices)] as [number, number];
  }, [products]);

  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    priceRange: priceRange,
    minRating: 0,
    inStock: false,
    onSale: false,
    sortBy: 'relevance'
  });
  
  // Debounced search term
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [isProductOpen, setIsProductOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  // Check if there are active filters
  const hasActiveFilters = filters.categories.length > 0 || 
                          filters.priceRange[0] > priceRange[0] || 
                          filters.priceRange[1] < priceRange[1] || 
                          filters.minRating > 0 ||
                          filters.inStock ||
                          filters.onSale;

  // Filter, sort, and paginate products
  const { filteredProducts, pagination } = useMemo(() => {
    // Filter products
    let filtered = products.filter(product => {
      // Search filter
      const matchesSearch = product.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                           product.category.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      
      // Category filter (legacy support)
      const matchesLegacyCategory = selectedCategory === 'همه' || product.category === selectedCategory;
      
      // Advanced category filter
      const matchesAdvancedCategory = filters.categories.length === 0 || 
                                     filters.categories.includes(product.category);
      
      // Price range filter
      const productPrice = product.salePrice || product.price;
      const matchesPriceRange = productPrice >= filters.priceRange[0] && 
                               productPrice <= filters.priceRange[1];
      
      // Rating filter
      const matchesRating = filters.minRating === 0 || (product.averageRating || 0) >= filters.minRating;
      
      // Stock filter
      const matchesStock = !filters.inStock || product.inStock;
      
      // Sale filter
      const matchesSale = !filters.onSale || (product.salePrice && product.salePrice < product.price);
      
      return matchesSearch && matchesLegacyCategory && matchesAdvancedCategory && 
             matchesPriceRange && matchesRating && matchesStock && matchesSale;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-asc':
          return (a.salePrice || a.price) - (b.salePrice || b.price);
        case 'price-desc':
          return (b.salePrice || b.price) - (a.salePrice || a.price);
        case 'newest':
          return (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0);
        case 'popularity':
          return (b.popularity || 0) - (a.popularity || 0);
        case 'rating':
          return (b.averageRating || 0) - (a.averageRating || 0);
        case 'relevance':
        default:
          return (b.popularity || 0) - (a.popularity || 0);
      }
    });

    // Calculate pagination
    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProducts = filtered.slice(startIndex, endIndex);

    const pagination: PaginationState = {
      currentPage,
      itemsPerPage,
      totalItems,
      totalPages
    };

    return { filteredProducts: paginatedProducts, pagination };
  }, [selectedCategory, debouncedSearchTerm, sortOption, currentPage, itemsPerPage, filters]);

  const openProduct = (product: Product) => {
    setActiveProduct(product);
    setIsProductOpen(true);
  };

  const closeProduct = () => {
    setIsProductOpen(false);
    setActiveProduct(null);
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    // Show mini-cart when item is added
    setIsMiniCartOpen(true);
  };

  const handleAddToCartWithQuantity = (product: Product, quantity: number) => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    // Show mini-cart when item is added
    setIsMiniCartOpen(true);
  };


  // Enhanced search handlers
  const handleProductSelect = (product: Product) => {
    setActiveProduct(product);
    setIsProductOpen(true);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  // Filter handlers
  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleRemoveFilter = (filterType: keyof FilterState) => {
    switch (filterType) {
      case 'categories':
        setFilters(prev => ({ ...prev, categories: [] }));
        break;
      case 'priceRange':
        setFilters(prev => ({ ...prev, priceRange: priceRange }));
        break;
      case 'minRating':
        setFilters(prev => ({ ...prev, minRating: 0 }));
        break;
      case 'inStock':
        setFilters(prev => ({ ...prev, inStock: false }));
        break;
      case 'onSale':
        setFilters(prev => ({ ...prev, onSale: false }));
        break;
      case 'sortBy':
        setFilters(prev => ({ ...prev, sortBy: 'relevance' }));
        break;
    }
  };

  const handleClearAllFilters = () => {
    setFilters({
      categories: [],
      priceRange: priceRange,
      minRating: 0,
      inStock: false,
      onSale: false,
      sortBy: 'relevance'
    });
    setCurrentPage(1);
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
      setIsLoginOpen(false);
    } catch (error) {
      console.error('Login failed:', error);
      // You could show a toast notification here
    }
  };

  const handleRegister = async (userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    dateOfBirth?: Date;
    gender?: 'male' | 'female' | 'other';
  }) => {
    try {
      await register(userData);
      setIsRegisterOpen(false);
    } catch (error) {
      console.error('Registration failed:', error);
      // You could show a toast notification here
    }
  };

  const handleLogout = () => {
    logout();
  };

  const handleSwitchToRegister = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(true);
  };

  const handleSwitchToLogin = () => {
    setIsRegisterOpen(false);
    setIsLoginOpen(true);
  };

  const handleOpenDashboard = () => {
    if (isAuthenticated && user) {
      setIsDashboardOpen(true);
    } else {
      setIsLoginOpen(true);
    }
  };

  const handleSortChange = (sort: SortOption) => {
    setSortOption(sort);
    setCurrentPage(1); // Reset to first page when sorting changes
    updateUrl({ sort, page: '1' });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateUrl({ page: page.toString() });
    // Scroll to top of products section
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    updateUrl({ category, page: '1' });
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
    updateUrl({ search: term, page: '1' });
  };



  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AnimatedBackground />
      <Header
        cartItemCount={cart.itemCount}
        onCartToggle={() => setIsCartOpen(true)}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        user={user}
        isAuthenticated={isAuthenticated}
        onLoginToggle={() => setIsLoginOpen(true)}
        onDashboardToggle={handleOpenDashboard}
        onLogout={handleLogout}
        onProductSelect={handleProductSelect}
        onCategorySelect={handleCategorySelect}
        products={products}
        categories={categories}
      />

      <Hero />

      <main id="products" className="py-8 sm:py-12">
        <ResponsiveContainer maxWidth="3xl" padding="lg">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">{t('products.title')}</h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              {t('products.subtitle')}
            </p>
        </div>

        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />

        {/* Filter Chips */}
        <FilterChips
          filters={filters}
          onRemoveFilter={handleRemoveFilter}
          onClearAll={handleClearAllFilters}
          categories={categories}
          priceRange={priceRange}
        />

        {/* Filter and Sort Control Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Left Side - Filter Toggle */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg transition-all duration-200 text-sm min-h-[44px] ${
                  hasActiveFilters 
                    ? 'bg-primary-100 dark:bg-primary-900 hover:bg-primary-200 dark:hover:bg-primary-800 text-primary-800 dark:text-primary-200 border border-primary-300 dark:border-primary-700 shadow-sm' 
                    : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600'
                }`}
              >
                <Filter className="h-4 w-4" />
                <span className="font-medium">فیلترها</span>
                {hasActiveFilters && (
                  <span className="bg-primary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    !
                  </span>
                )}
                {isFiltersOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>
              
              {/* Active Filter Count and Clear All */}
              {hasActiveFilters && (
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                    {filters.categories.length + 
                     (filters.priceRange[0] > priceRange[0] || filters.priceRange[1] < priceRange[1] ? 1 : 0) + 
                     (filters.minRating > 0 ? 1 : 0) +
                     (filters.inStock ? 1 : 0) +
                     (filters.onSale ? 1 : 0)} فیلتر فعال
                  </span>
                  <button
                    onClick={handleClearAllFilters}
                    className="text-xs sm:text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900 px-2 py-1 rounded transition-colors duration-200"
                  >
                    پاک کردن همه
                  </button>
                </div>
              )}
            </div>

            {/* Right Side - Results Count and Sort Options */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
              {/* Results Counter */}
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                <span className="font-medium text-gray-900 dark:text-white">{filteredProducts.length}</span>
                <span> محصول از </span>
                <span className="font-medium text-gray-900 dark:text-white">{products.length}</span>
                <span> محصول</span>
              </div>
              
              {/* Sort Options */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">مرتب‌سازی:</span>
                <div className="relative">
                  <select
                    value={sortOption}
                    onChange={(e) => handleSortChange(e.target.value as SortOption)}
                    className="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 sm:px-4 py-2 pr-6 sm:pr-8 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-xs sm:text-sm min-w-[140px] sm:min-w-[180px]"
                  >
                    <option value="popularity">محبوب‌ترین</option>
                    <option value="newest">جدیدترین</option>
                    <option value="price-asc">قیمت: کم به زیاد</option>
                    <option value="price-desc">قیمت: زیاد به کم</option>
                  </select>
                  <ChevronDown className="absolute left-1 sm:left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Advanced Filters - Conditionally Rendered with Animation */}
          <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
            isFiltersOpen ? 'max-h-screen opacity-100 mt-4' : 'max-h-0 opacity-0'
          }`}>
            {isFiltersOpen && (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <AdvancedFilters
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  products={products}
                  categories={categories.filter(cat => cat !== 'همه')}
                  isOpen={isFiltersOpen}
                  onClose={() => setIsFiltersOpen(false)}
                />
              </div>
            )}
          </div>
        </div>

        <ResponsiveGrid
          cols={{ default: 1, sm: 1, md: 2, lg: 3, xl: 4, '2xl': 4 }}
          gap="md"
          className="mb-8 sm:mb-12"
        >
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onOpen={() => openProduct(product)}
              onAddToCart={handleAddToCart}
              onToggleWishlist={toggleWishlist}
              isInWishlist={isInWishlist(product.id)}
              searchTerm={debouncedSearchTerm}
              isLoading={isLoading}
            />
          ))}
        </ResponsiveGrid>

        <Pagination
          pagination={pagination}
          onPageChange={handlePageChange}
        />

        {filteredProducts.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg">{t('products.noResults')}</p>
            <button
              onClick={() => {
                setSelectedCategory('همه');
                setSearchTerm('');
                handleClearAllFilters();
              }}
              className="mt-4 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium text-sm sm:text-base"
            >
              {t('products.clearFilters')}
            </button>
          </div>
        )}
        </ResponsiveContainer>
      </main>

      <Footer />

      <Cart
        cart={cart}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        user={user}
        onLoginToggle={() => setIsLoginOpen(true)}
        onAddToCart={addToCart}
        onToggleWishlist={toggleWishlist}
        isInWishlist={isInWishlist}
        isLoading={isLoading}
        products={products}
      />

      <MiniCart
        cart={cart}
        isOpen={isMiniCartOpen}
        onClose={() => setIsMiniCartOpen(false)}
        onOpenFullCart={() => {
          setIsMiniCartOpen(false);
          setIsCartOpen(true);
        }}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
      />

      <ProductModal
        isOpen={isProductOpen}
        product={activeProduct}
        onClose={closeProduct}
        onAddToCart={handleAddToCart}
        onAddToCartWithQuantity={handleAddToCartWithQuantity}
      />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLogin={handleLogin}
        onSwitchToRegister={handleSwitchToRegister}
      />

      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onRegister={handleRegister}
        onSwitchToLogin={handleSwitchToLogin}
      />

      <UserDashboardModal
        isOpen={isDashboardOpen}
        onClose={() => setIsDashboardOpen(false)}
        user={user!}
        orders={orders}
        onLogout={logout}
        onUpdateProfile={updateProfile}
        onAddAddress={addAddress}
        onUpdateAddress={updateAddress}
        onDeleteAddress={deleteAddress}
      />
    </div>
  );
}

function App() {
  return (
    <ToastProvider>
      <UserProvider>
        <AppProvider>
          <Router>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/product/:id" element={<ProductPage />} />
            </Routes>
          </Router>
        </AppProvider>
      </UserProvider>
    </ToastProvider>
  );
}

export default App;
