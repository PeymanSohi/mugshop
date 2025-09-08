from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.db.models import Sum, Count, Avg
from django.utils import timezone
from datetime import timedelta
from products.models import Product
from orders.models import Order
from customers.models import Customer
from inventory.models import Stock

@login_required
def dashboard_view(request):
    # Get date ranges
    today = timezone.now().date()
    last_30_days = today - timedelta(days=30)
    last_7_days = today - timedelta(days=7)
    
    # Basic stats
    total_products = Product.objects.filter(status='active').count()
    total_customers = Customer.objects.count()
    total_orders = Order.objects.count()
    
    # Recent orders
    recent_orders = Order.objects.select_related('customer').order_by('-created_at')[:10]
    
    # Sales data for last 30 days
    sales_data = Order.objects.filter(
        created_at__date__gte=last_30_days,
        status__in=['completed', 'shipped']
    ).aggregate(
        total_sales=Sum('total_amount'),
        total_orders=Count('id'),
        avg_order_value=Avg('total_amount')
    )
    
    # Low stock products
    low_stock_products = Product.objects.filter(
        stock__quantity__lte=10,
        status='active'
    ).select_related('stock')[:10]
    
    # Popular products
    popular_products = Product.objects.annotate(
        order_count=Count('orderitem')
    ).order_by('-order_count')[:10]
    
    context = {
        'total_products': total_products,
        'total_customers': total_customers,
        'total_orders': total_orders,
        'recent_orders': recent_orders,
        'sales_data': sales_data,
        'low_stock_products': low_stock_products,
        'popular_products': popular_products,
    }
    
    return render(request, 'dashboard/dashboard.html', context)