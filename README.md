# Django eCommerce Admin Panel

A comprehensive, production-ready admin panel for managing an eCommerce store specializing in mugs, travel mugs, and similar products.

## Features

### 🔐 Authentication & Security
- Secure login/logout with session management
- Role-based access control (Super Admin, Admin, Staff, Manager)
- Password hashing and CSRF protection
- Admin activity logging and audit trails
- IP tracking for security monitoring

### 📊 Dashboard
- Real-time overview of sales, customers, orders, and products
- Interactive charts using Chart.js
- Quick action buttons for common tasks
- Low stock alerts and notifications
- Recent orders and activity feed

### 🛍️ Product Management
- Complete CRUD operations for products
- Category and tag management
- Multiple product images with gallery
- Product variants (size, color, material)
- Bulk upload/update via CSV/Excel
- SEO optimization fields
- Stock level management

### 📦 Order Management
- Order listing with advanced filters
- Order status tracking and updates
- Customer information and contact details
- Order history and analytics
- Shipping and tracking integration

### 👥 Customer Management
- Customer profiles and order history
- Account activation/deactivation
- Customer analytics and insights
- Communication tools

### 🏷️ Discounts & Coupons
- Create and manage discount codes
- Percentage and fixed amount discounts
- Expiration dates and usage limits
- Bulk discount operations

### 📦 Inventory Management
- Real-time stock tracking
- Low stock alerts
- Stock movement history
- Bulk stock updates

### 💳 Payment Management
- Multiple payment gateway support
- Iranian payment gateways (Zarinpal, IDPay)
- Payment history and reconciliation
- Refund management

### ⚙️ Settings & Configuration
- Site configuration (name, logo, currency)
- Multi-language support (Persian/English)
- User role and permission management
- System settings and preferences

## Technology Stack

- **Backend**: Django 4.2, Django REST Framework
- **Database**: PostgreSQL
- **Cache**: Redis
- **Task Queue**: Celery
- **Frontend**: Bootstrap 5, Chart.js, Font Awesome
- **Deployment**: Docker, Nginx, Gunicorn

## Installation

### Using Docker (Recommended)

1. Clone the repository:
```bash
git clone <repository-url>
cd django-ecommerce-admin
```

2. Copy environment file:
```bash
cp .env.example .env
```

3. Update the `.env` file with your settings

4. Build and run with Docker Compose:
```bash
docker-compose up --build
```

5. Create superuser:
```bash
docker-compose exec web python manage.py createsuperuser
```

6. Access the admin panel at `http://localhost`

### Manual Installation

1. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up PostgreSQL database and update settings

4. Run migrations:
```bash
python manage.py migrate
```

5. Create superuser:
```bash
python manage.py createsuperuser
```

6. Collect static files:
```bash
python manage.py collectstatic
```

7. Run development server:
```bash
python manage.py runserver
```

## Configuration

### Environment Variables

Create a `.env` file with the following variables:

```env
SECRET_KEY=your-secret-key-here
DEBUG=True
DB_NAME=ecommerce_admin
DB_USER=postgres
DB_PASSWORD=password
DB_HOST=localhost
DB_PORT=5432
REDIS_URL=redis://127.0.0.1:6379/1
CELERY_BROKER_URL=redis://127.0.0.1:6379/0
CELERY_RESULT_BACKEND=redis://127.0.0.1:6379/0
```

### Database Setup

1. Install PostgreSQL
2. Create database:
```sql
CREATE DATABASE ecommerce_admin;
CREATE USER postgres WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE ecommerce_admin TO postgres;
```

### Redis Setup

Install and start Redis server:
```bash
# Ubuntu/Debian
sudo apt-get install redis-server
sudo systemctl start redis-server

# macOS
brew install redis
brew services start redis
```

## Usage

### Creating Admin Users

1. Access Django admin at `/admin/`
2. Create users with appropriate roles:
   - **Super Admin**: Full access to all features
   - **Admin**: Access to most features except user management
   - **Manager**: Access to products, orders, and customers
   - **Staff**: Limited access to basic operations

### Managing Products

1. Go to Products section
2. Click "Add Product" to create new products
3. Upload product images and set variants
4. Use bulk upload for multiple products via CSV

### Processing Orders

1. View orders in the Orders section
2. Update order status as they progress
3. Add tracking information for shipments
4. Generate invoices and reports

### Setting Up Payments

1. Configure payment gateways in Settings
2. Add Iranian payment methods (Zarinpal, IDPay)
3. Set up webhook URLs for payment notifications

## API Documentation

The admin panel includes a REST API for integration with external systems:

- **Products API**: `/api/products/`
- **Orders API**: `/api/orders/`
- **Customers API**: `/api/customers/`
- **Inventory API**: `/api/inventory/`

API authentication uses Django REST Framework tokens.

## Deployment

### Production Deployment

1. Set `DEBUG=False` in environment
2. Configure proper database and Redis URLs
3. Set up SSL certificates
4. Use Docker Compose for production:

```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Scaling

- Use multiple web workers with Gunicorn
- Set up Redis cluster for high availability
- Use CDN for static files
- Implement database read replicas

## Security

- All forms include CSRF protection
- SQL injection prevention with Django ORM
- XSS protection with template escaping
- Secure session management
- Admin activity logging
- IP-based access control

## Monitoring

- Admin activity logs
- Error logging to files
- Performance monitoring with Django Debug Toolbar (development)
- Health check endpoints

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes with tests
4. Submit pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Email: peymantahmasebi10@gmail.com
- Phone: +989120318120
- Location: Tehran, Iran

## Changelog

### Version 1.0.0
- Initial release with full admin panel functionality
- Persian/English language support
- Complete product and order management
- Payment gateway integration
- Docker deployment setup