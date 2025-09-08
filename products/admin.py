from django.contrib import admin
from django.utils.html import format_html
from .models import Category, Tag, Product, ProductImage, ProductVariant

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    fields = ('image', 'alt_text', 'sort_order', 'is_active')

class ProductVariantInline(admin.TabularInline):
    model = ProductVariant
    extra = 0
    fields = ('name', 'sku', 'price', 'color', 'size', 'is_active', 'sort_order')

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'name_fa', 'parent', 'is_active', 'sort_order', 'created_at')
    list_filter = ('is_active', 'parent', 'created_at')
    search_fields = ('name', 'name_fa', 'description')
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ('is_active', 'sort_order')

@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ('name', 'name_fa', 'color_preview')
    search_fields = ('name', 'name_fa')
    prepopulated_fields = {'slug': ('name',)}
    
    def color_preview(self, obj):
        return format_html(
            '<span style="background-color: {}; padding: 5px 10px; color: white; border-radius: 3px;">{}</span>',
            obj.color,
            obj.color
        )
    color_preview.short_description = 'Color'

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'name_fa', 'sku', 'category', 'price', 'status', 'is_featured', 'created_at')
    list_filter = ('status', 'category', 'product_type', 'is_featured', 'created_at')
    search_fields = ('name', 'name_fa', 'sku', 'description')
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ('status', 'is_featured', 'price')
    inlines = [ProductImageInline, ProductVariantInline]
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'name_fa', 'slug', 'sku', 'product_type', 'category', 'tags')
        }),
        ('Description', {
            'fields': ('short_description', 'short_description_fa', 'description', 'description_fa')
        }),
        ('Pricing', {
            'fields': ('price', 'compare_price', 'cost_price')
        }),
        ('Product Details', {
            'fields': ('weight', 'dimensions', 'material', 'color', 'capacity')
        }),
        ('Media', {
            'fields': ('featured_image',)
        }),
        ('Status & Settings', {
            'fields': ('status', 'is_featured', 'is_digital')
        }),
        ('SEO', {
            'fields': ('meta_title', 'meta_description'),
            'classes': ('collapse',)
        }),
    )

@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ('product', 'image_preview', 'alt_text', 'sort_order', 'is_active')
    list_filter = ('is_active', 'product__category')
    search_fields = ('product__name', 'alt_text')
    list_editable = ('sort_order', 'is_active')
    
    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" width="50" height="50" style="object-fit: cover;" />', obj.image.url)
        return "No Image"
    image_preview.short_description = 'Preview'

@admin.register(ProductVariant)
class ProductVariantAdmin(admin.ModelAdmin):
    list_display = ('product', 'name', 'sku', 'price', 'color', 'size', 'is_active')
    list_filter = ('is_active', 'product__category', 'color', 'size')
    search_fields = ('product__name', 'name', 'sku')
    list_editable = ('price', 'is_active')