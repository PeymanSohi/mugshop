import { useState, useMemo, useEffect } from 'react';
import { useDebounce } from './hooks/useDebounce';
import { useUrlState } from './hooks/useUrlState';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import CategoryFilter from './components/CategoryFilter';
import AdvancedFilters from './components/AdvancedFilters';
import SortFilter from './components/SortFilter';
import Pagination from './components/Pagination';
import Cart from './components/Cart';
import MiniCart from './components/MiniCart';
import LoginModal from './components/LoginModal';
import Footer from './components/Footer';
import { categories } from './data/products';
import { useApiProducts } from './hooks/useApiProducts';
import { Product, CartState, CartItem, AuthState, SortOption, PaginationState, WishlistState, FilterState } from './types';

function App() {
  // Load products from API
  const { products: apiProducts, loading: productsLoading } = useApiProducts();
  const products = apiProducts.length ? apiProducts : [];
  
  // Load cart from localStorage on component mount
  const [cart, setCart] = useState<CartState>(() => {
    const savedCart = localStorage.getItem('mugshop-cart');
    if (savedCart) {
      try {
        return JSON.parse(savedCart);
      } catch (error) {
        console.error('Error parsing saved cart:', error);
      }
    }
    return {
      items: [],
      total: 0,
      itemCount: 0
    };
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMiniCartOpen, setIsMiniCartOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  // URL state management
  const { urlState, updateUrl } = useUrlState();
  const [selectedCategory, setSelectedCategory] = useState(urlState.category || 'همه');
  const [searchTerm, setSearchTerm] = useState(urlState.search || '');
  const [sortOption, setSortOption] = useState<SortOption>((urlState.sort as SortOption) || 'popularity');
  const [currentPage, setCurrentPage] = useState(parseInt(urlState.page || '1'));
  const itemsPerPage = 12;
  
  // Advanced filters state - no default filters applied
  const [filters, setFilters] = useState<FilterState>({
    selectedCategories: [],
    priceRange: { min: 0, max: 999999 }, // Set very high max to not filter by default
    inStockOnly: false
  });
  
  // Debounced search term
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    isAuthenticated: false
  });
  const [isProductOpen, setIsProductOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  
  // Wishlist state with localStorage persistence
  const [wishlist, setWishlist] = useState<WishlistState>(() => {
    const savedWishlist = localStorage.getItem('mugshop-wishlist');
    if (savedWishlist) {
      try {
        return JSON.parse(savedWishlist);
      } catch (error) {
        console.error('Error parsing saved wishlist:', error);
      }
    }
    return { items: [] };
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('mugshop-cart', JSON.stringify(cart));
  }, [cart]);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('mugshop-wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Filter, sort, and paginate products
  const { filteredProducts, pagination } = useMemo(() => {
    // Filter products
    let filtered = products.filter(product => {
      // Search filter
      const matchesSearch = product.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      
      // Category filter (legacy support)
      const matchesLegacyCategory = selectedCategory === 'همه' || product.category === selectedCategory;
      
      // Advanced category filter
      const matchesAdvancedCategory = filters.selectedCategories.length === 0 || 
                                     filters.selectedCategories.includes(product.category);
      
      // Price range filter - only apply if user has set a custom range
      const productPrice = product.salePrice || product.price;
      const isDefaultPriceRange = filters.priceRange.min === 0 && filters.priceRange.max === 999999;
      const matchesPriceRange = isDefaultPriceRange || 
                               (productPrice >= filters.priceRange.min && productPrice <= filters.priceRange.max);
      
      // Stock filter
      const matchesStock = !filters.inStockOnly || product.inStock;
      
      return matchesSearch && matchesLegacyCategory && matchesAdvancedCategory && 
             matchesPriceRange && matchesStock;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortOption) {
        case 'price-asc':
          return (a.salePrice || a.price) - (b.salePrice || b.price);
        case 'price-desc':
          return (b.salePrice || b.price) - (a.salePrice || a.price);
        case 'newest':
          return (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0);
        case 'popularity':
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
  }, [products, selectedCategory, debouncedSearchTerm, sortOption, currentPage, itemsPerPage, filters]);

  const openProduct = (product: Product) => {
    console.log('Opening product modal for:', product.name);
    setActiveProduct(product);
    setIsProductOpen(true);
  };

  const closeProduct = () => {
    setIsProductOpen(false);
    setActiveProduct(null);
  };

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.items.find(item => item.product.id === product.id);
      
      let newItems: CartItem[];
      if (existingItem) {
        newItems = prevCart.items.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newItems = [...prevCart.items, { product, quantity: 1 }];
      }

      const total = newItems.reduce((sum, item) => sum + ((item.product.salePrice || item.product.price) * item.quantity), 0);
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

      return { items: newItems, total, itemCount };
    });
    
    // Show mini-cart when item is added
    setIsMiniCartOpen(true);
  };

  const addToCartWithQuantity = (product: Product, quantity: number) => {
    if (quantity <= 0) return;
    setCart(prevCart => {
      const existingItem = prevCart.items.find(item => item.product.id === product.id);
      let newItems: CartItem[];
      if (existingItem) {
        newItems = prevCart.items.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newItems = [...prevCart.items, { product, quantity }];
      }
      const total = newItems.reduce((sum, item) => sum + ((item.product.salePrice || item.product.price) * item.quantity), 0);
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);
      return { items: newItems, total, itemCount };
    });
    
    // Show mini-cart when item is added
    setIsMiniCartOpen(true);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(productId);
      return;
    }

    setCart(prevCart => {
      const newItems = prevCart.items.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      );

      const total = newItems.reduce((sum, item) => sum + ((item.product.salePrice || item.product.price) * item.quantity), 0);
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

      return { items: newItems, total, itemCount };
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => {
      const newItems = prevCart.items.filter(item => item.product.id !== productId);
      const total = newItems.reduce((sum, item) => sum + ((item.product.salePrice || item.product.price) * item.quantity), 0);
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

      return { items: newItems, total, itemCount };
    });
  };

  const handleLogin = (email: string, name: string) => {
    setAuth({
      user: { id: Date.now().toString(), email, name },
      isAuthenticated: true
    });
    setIsLoginOpen(false);
  };

  const handleLogout = () => {
    setAuth({
      user: null,
      isAuthenticated: false
    });
    // Clear cart on logout
    setCart({
      items: [],
      total: 0,
      itemCount: 0
    });
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

  const handleCategoryToggle = (category: string) => {
    setFilters(prev => ({
      ...prev,
      selectedCategories: prev.selectedCategories.includes(category)
        ? prev.selectedCategories.filter(c => c !== category)
        : [...prev.selectedCategories, category]
    }));
    setCurrentPage(1);
  };

  const handlePriceRangeChange = (range: { min: number; max: number }) => {
    setFilters(prev => ({ ...prev, priceRange: range }));
    setCurrentPage(1);
  };

  const handleInStockToggle = () => {
    setFilters(prev => ({ ...prev, inStockOnly: !prev.inStockOnly }));
    setCurrentPage(1);
  };

  const handleClearAllFilters = () => {
    setFilters({
      selectedCategories: [],
      priceRange: { min: 0, max: 1000 },
      inStockOnly: false
    });
    setCurrentPage(1);
  };

  const toggleWishlist = (product: Product) => {
    setWishlist(prevWishlist => {
      const isInWishlist = prevWishlist.items.includes(product.id);
      if (isInWishlist) {
        return {
          items: prevWishlist.items.filter(id => id !== product.id)
        };
      } else {
        return {
          items: [...prevWishlist.items, product.id]
        };
      }
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.items.includes(productId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        cartItemCount={cart.itemCount}
        onCartToggle={() => setIsCartOpen(true)}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        user={auth.user}
        onLoginToggle={() => setIsLoginOpen(true)}
        onLogout={handleLogout}
      />

      <Hero />

      <main id="products" className="max-w-7xl mx-auto px-4 tb:px-6 lp:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">مجموعه ما</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            مجموعه‌ای از ماگ‌های باکیفیت که تجربه نوشیدن شما را لذت‌بخش‌تر می‌کند.
          </p>
        </div>

        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />

        <AdvancedFilters
          categories={categories.filter(cat => cat !== 'همه')}
          selectedCategories={filters.selectedCategories}
          onCategoryToggle={handleCategoryToggle}
          onClearAll={handleClearAllFilters}
          priceRange={filters.priceRange}
          onPriceRangeChange={handlePriceRangeChange}
          inStockOnly={filters.inStockOnly}
          onInStockToggle={handleInStockToggle}
        />

        <SortFilter
          sortOption={sortOption}
          onSortChange={handleSortChange}
        />

        <div className="grid grid-cols-1 tb:grid-cols-2 lp:grid-cols-3 dt:grid-cols-4 gap-6 tb:gap-7 lp:gap-8">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onOpen={() => openProduct(product)}
              onAddToCart={addToCart}
              onToggleWishlist={toggleWishlist}
              isInWishlist={isInWishlist(product.id)}
              searchTerm={debouncedSearchTerm}
            />
          ))}
        </div>

        <Pagination
          pagination={pagination}
          onPageChange={handlePageChange}
        />

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">محصولی مطابق فیلترها یافت نشد.</p>
            <button
              onClick={() => {
                setSelectedCategory('همه');
                setSearchTerm('');
              }}
              className="mt-4 text-amber-700 hover:text-amber-800 font-medium"
            >
              پاک کردن فیلترها
            </button>
          </div>
        )}
      </main>

      <Footer />

      <Cart
        cart={cart}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        user={auth.user}
        onLoginToggle={() => setIsLoginOpen(true)}
      />

      <MiniCart
        cart={cart}
        isOpen={isMiniCartOpen}
        onClose={() => setIsMiniCartOpen(false)}
        onOpenFullCart={() => {
          setIsMiniCartOpen(false);
          setIsCartOpen(true);
        }}
      />

      <ProductModal
        isOpen={isProductOpen}
        product={activeProduct}
        onClose={closeProduct}
        onAddToCart={addToCart}
        onAddToCartWithQuantity={addToCartWithQuantity}
      />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLogin={handleLogin}
      />
    </div>
  );
}

export default App;