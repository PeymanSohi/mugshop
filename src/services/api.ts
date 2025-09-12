const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('admin_token');
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'خطای شبکه' }));
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Auth methods
  async login(email: string, password: string) {
    const response = await this.request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    this.token = response.token;
    localStorage.setItem('admin_token', response.token);
    localStorage.setItem('admin_user', JSON.stringify(response.user));

    return response;
  }

  logout() {
    this.token = null;
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
  }

  async getProfile() {
    return this.request<{ user: any }>('/auth/profile');
  }

  // Product methods
  async getProducts(params?: {
    page?: number;
    limit?: number;
    category?: string;
    inStock?: boolean;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, String(value));
        }
      });
    }

    return this.request<{
      products: any[];
      pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
      };
    }>(`/products?${searchParams}`);
  }

  async getProduct(id: string) {
    return this.request<{ product: any }>(`/products/${id}`);
  }

  async createProduct(productData: any) {
    return this.request<{ product: any; message: string }>('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(id: string, productData: any) {
    return this.request<{ product: any; message: string }>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(id: string) {
    return this.request<{ message: string }>(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  async toggleProductStatus(id: string) {
    return this.request<{ product: any; message: string }>(`/products/${id}/toggle-status`, {
      method: 'PATCH',
    });
  }

  // User methods
  async getUsers(params?: {
    page?: number;
    limit?: number;
    role?: string;
    search?: string;
    isActive?: boolean;
  }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, String(value));
        }
      });
    }

    return this.request<{
      users: any[];
      pagination: any;
    }>(`/users?${searchParams}`);
  }

  async getUser(id: string) {
    return this.request<{ user: any }>(`/users/${id}`);
  }

  async updateUser(id: string, userData: any) {
    return this.request<{ user: any; message: string }>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async toggleUserStatus(id: string) {
    return this.request<{ user: any; message: string }>(`/users/${id}/toggle-status`, {
      method: 'PATCH',
    });
  }

  async deleteUser(id: string) {
    return this.request<{ message: string }>(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Order methods
  async getOrders(params?: {
    page?: number;
    limit?: number;
    status?: string;
    paymentStatus?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, String(value));
        }
      });
    }

    return this.request<{
      orders: any[];
      pagination: any;
    }>(`/orders?${searchParams}`);
  }

  async getOrder(id: string) {
    return this.request<{ order: any }>(`/orders/${id}`);
  }

  async updateOrderStatus(id: string, data: { status?: string; trackingNumber?: string; notes?: string }) {
    return this.request<{ order: any; message: string }>(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getOrderStats() {
    return this.request<{
      totalOrders: number;
      todayOrders: number;
      monthlyOrders: number;
      pendingOrders: number;
      totalRevenue: number;
      monthlyRevenue: number;
    }>('/orders/stats');
  }

  // Upload methods
  async uploadImage(file: File) {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${this.baseURL}/upload/image`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'خطای آپلود' }));
      throw new Error(errorData.message);
    }

    return response.json();
  }

  async uploadMultipleImages(files: File[]) {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });

    const response = await fetch(`${this.baseURL}/upload/images`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'خطای آپلود' }));
      throw new Error(errorData.message);
    }

    return response.json();
  }
}

export default new ApiService();