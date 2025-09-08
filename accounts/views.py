from django.shortcuts import render, redirect
from django.contrib.auth import login, logout
from django.contrib.auth.views import LoginView as BaseLoginView, LogoutView as BaseLogoutView
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.views.generic import ListView, CreateView, UpdateView, DeleteView, TemplateView
from django.urls import reverse_lazy
from django.contrib import messages
from django.utils.translation import gettext_lazy as _
from django.db.models import Q
from .models import User, AdminLog
from .forms import UserCreationForm, UserUpdateForm, ProfileUpdateForm

class LoginView(BaseLoginView):
    template_name = 'accounts/login.html'
    redirect_authenticated_user = True
    
    def form_valid(self, form):
        response = super().form_valid(form)
        # Log the login
        AdminLog.objects.create(
            user=self.request.user,
            action='login',
            description=f'User logged in',
            ip_address=self.get_client_ip()
        )
        return response
    
    def get_client_ip(self):
        x_forwarded_for = self.request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = self.request.META.get('REMOTE_ADDR')
        return ip

class LogoutView(BaseLogoutView):
    next_page = reverse_lazy('accounts:login')
    
    def dispatch(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            AdminLog.objects.create(
                user=request.user,
                action='logout',
                description=f'User logged out',
                ip_address=self.get_client_ip(request)
            )
        return super().dispatch(request, *args, **kwargs)
    
    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip

class ProfileView(LoginRequiredMixin, TemplateView):
    template_name = 'accounts/profile.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['form'] = ProfileUpdateForm(instance=self.request.user)
        return context
    
    def post(self, request, *args, **kwargs):
        form = ProfileUpdateForm(request.POST, request.FILES, instance=request.user)
        if form.is_valid():
            form.save()
            messages.success(request, _('Profile updated successfully.'))
            return redirect('accounts:profile')
        return self.render_to_response({'form': form})

class AdminRequiredMixin(UserPassesTestMixin):
    def test_func(self):
        return self.request.user.is_authenticated and self.request.user.is_admin

class UserListView(AdminRequiredMixin, ListView):
    model = User
    template_name = 'accounts/user_list.html'
    context_object_name = 'users'
    paginate_by = 20
    
    def get_queryset(self):
        queryset = User.objects.all().order_by('-created_at')
        search = self.request.GET.get('search')
        if search:
            queryset = queryset.filter(
                Q(username__icontains=search) |
                Q(first_name__icontains=search) |
                Q(last_name__icontains=search) |
                Q(email__icontains=search)
            )
        return queryset

class UserCreateView(AdminRequiredMixin, CreateView):
    model = User
    form_class = UserCreationForm
    template_name = 'accounts/user_form.html'
    success_url = reverse_lazy('accounts:user_list')
    
    def form_valid(self, form):
        response = super().form_valid(form)
        AdminLog.objects.create(
            user=self.request.user,
            action='create',
            model_name='User',
            object_id=str(self.object.id),
            description=f'Created user: {self.object.username}'
        )
        messages.success(self.request, _('User created successfully.'))
        return response

class UserUpdateView(AdminRequiredMixin, UpdateView):
    model = User
    form_class = UserUpdateForm
    template_name = 'accounts/user_form.html'
    success_url = reverse_lazy('accounts:user_list')
    
    def form_valid(self, form):
        response = super().form_valid(form)
        AdminLog.objects.create(
            user=self.request.user,
            action='update',
            model_name='User',
            object_id=str(self.object.id),
            description=f'Updated user: {self.object.username}'
        )
        messages.success(self.request, _('User updated successfully.'))
        return response

class UserDeleteView(AdminRequiredMixin, DeleteView):
    model = User
    template_name = 'accounts/user_confirm_delete.html'
    success_url = reverse_lazy('accounts:user_list')
    
    def delete(self, request, *args, **kwargs):
        self.object = self.get_object()
        AdminLog.objects.create(
            user=request.user,
            action='delete',
            model_name='User',
            object_id=str(self.object.id),
            description=f'Deleted user: {self.object.username}'
        )
        messages.success(request, _('User deleted successfully.'))
        return super().delete(request, *args, **kwargs)

class AdminLogListView(AdminRequiredMixin, ListView):
    model = AdminLog
    template_name = 'accounts/admin_logs.html'
    context_object_name = 'logs'
    paginate_by = 50
    
    def get_queryset(self):
        return AdminLog.objects.select_related('user').order_by('-timestamp')