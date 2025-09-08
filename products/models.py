from django.db import models
from django.utils.translation import gettext_lazy as _
from django.urls import reverse
from PIL import Image
import os

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    name_fa = models.CharField(max_length=100, blank=True, help_text=_('Persian name'))
    slug = models.SlugField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='categories/', blank=True, null=True)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, blank=True, null=True, related_name='children')
    is_active = models.BooleanField(default=True)
    sort_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = _('Category')
        verbose_name_plural = _('Categories')
        ordering = ['sort_order', 'name']
    
    def __str__(self):
        return self.name_fa or self.name
    
    def get_absolute_url(self):
        return reverse('products:category_detail', kwargs={'slug': self.slug})

class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)
    name_fa = models.CharField(max_length=50, blank=True)
    slug = models.SlugField(max_length=50, unique=True)
    color = models.CharField(max_length=7, default='#007bff', help_text=_('Hex color code'))
    
    class Meta:
        verbose_name = _('Tag')
        verbose_name_plural = _('Tags')
    
    def __str__(self):
        return self.name_fa or self.name

class Product(models.Model):
    PRODUCT_TYPES = [
        ('mug', _('Mug')),
        ('travel_mug', _('Travel Mug')),
        ('coffee_cup', _('Coffee Cup')),
        ('tea_cup', _('Tea Cup')),
        ('set', _('Set')),
    ]
    
    STATUS_CHOICES = [
        ('draft', _('Draft')),
        ('active', _('Active')),
        ('inactive', _('Inactive')),
        ('out_of_stock', _('Out of Stock')),
    ]
    
    name = models.CharField(max_length=200)
    name_fa = models.CharField(max_length=200, blank=True)
    slug = models.SlugField(max_length=200, unique=True)
    sku = models.CharField(max_length=50, unique=True)
    product_type = models.CharField(max_length=20, choices=PRODUCT_TYPES, default='mug')
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    tags = models.ManyToManyField(Tag, blank=True)
    
    description = models.TextField()
    description_fa = models.TextField(blank=True)
    short_description = models.CharField(max_length=500, blank=True)
    short_description_fa = models.CharField(max_length=500, blank=True)
    
    price = models.DecimalField(max_digits=10, decimal_places=2)
    compare_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    cost_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    
    weight = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True, help_text=_('Weight in grams'))
    dimensions = models.CharField(max_length=100, blank=True, help_text=_('L x W x H in cm'))
    material = models.CharField(max_length=100, blank=True)
    color = models.CharField(max_length=50, blank=True)
    capacity = models.CharField(max_length=50, blank=True, help_text=_('e.g., 350ml'))
    
    featured_image = models.ImageField(upload_to='products/')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    is_featured = models.BooleanField(default=False)
    is_digital = models.BooleanField(default=False)
    
    meta_title = models.CharField(max_length=200, blank=True)
    meta_description = models.CharField(max_length=300, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = _('Product')
        verbose_name_plural = _('Products')
        ordering = ['-created_at']
    
    def __str__(self):
        return self.name_fa or self.name
    
    def get_absolute_url(self):
        return reverse('products:product_detail', kwargs={'slug': self.slug})
    
    @property
    def is_on_sale(self):
        return self.compare_price and self.compare_price > self.price
    
    @property
    def discount_percentage(self):
        if self.is_on_sale:
            return int(((self.compare_price - self.price) / self.compare_price) * 100)
        return 0
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if self.featured_image:
            self.resize_image()
    
    def resize_image(self):
        if self.featured_image:
            img = Image.open(self.featured_image.path)
            if img.height > 800 or img.width > 800:
                output_size = (800, 800)
                img.thumbnail(output_size)
                img.save(self.featured_image.path)

class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='products/gallery/')
    alt_text = models.CharField(max_length=200, blank=True)
    sort_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        verbose_name = _('Product Image')
        verbose_name_plural = _('Product Images')
        ordering = ['sort_order']
    
    def __str__(self):
        return f"{self.product.name} - Image {self.sort_order}"
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if self.image:
            self.resize_image()
    
    def resize_image(self):
        if self.image:
            img = Image.open(self.image.path)
            if img.height > 800 or img.width > 800:
                output_size = (800, 800)
                img.thumbnail(output_size)
                img.save(self.image.path)

class ProductVariant(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='variants')
    name = models.CharField(max_length=100)
    sku = models.CharField(max_length=50, unique=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    compare_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    image = models.ImageField(upload_to='products/variants/', blank=True, null=True)
    is_active = models.BooleanField(default=True)
    sort_order = models.PositiveIntegerField(default=0)
    
    # Variant attributes
    color = models.CharField(max_length=50, blank=True)
    size = models.CharField(max_length=50, blank=True)
    material = models.CharField(max_length=100, blank=True)
    
    class Meta:
        verbose_name = _('Product Variant')
        verbose_name_plural = _('Product Variants')
        ordering = ['sort_order']
    
    def __str__(self):
        return f"{self.product.name} - {self.name}"
    
    @property
    def effective_price(self):
        return self.price or self.product.price