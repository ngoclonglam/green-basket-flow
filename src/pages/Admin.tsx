import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  Package, 
  Users, 
  ShoppingCart, 
  Settings,
  FileText,
  TrendingUp,
  Shield
} from 'lucide-react';
import { AdminGuard } from '@/components/admin/AdminGuard';
import { useAuth } from '@/hooks/auth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  SidebarProvider,
  SidebarTrigger,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

const AdminSidebar = () => {
  const location = useLocation();
  const { profile } = useAuth();
  
  const currentPath = location.pathname;
  const isActive = (path: string) => currentPath === path || currentPath.startsWith(path + '/');

  const menuItems = [
    { title: 'Dashboard', url: '/admin', icon: BarChart3, exact: true },
    { title: 'Products', url: '/admin/products', icon: Package },
    { title: 'Orders', url: '/admin/orders', icon: ShoppingCart },
    { title: 'Users', url: '/admin/users', icon: Users, requiredRole: ['owner', 'admin'] },
    { title: 'Security', url: '/admin/security', icon: Shield, requiredRole: ['owner', 'admin'] },
    { title: 'Analytics', url: '/admin/analytics', icon: TrendingUp },
    { title: 'Reports', url: '/admin/reports', icon: FileText },
    { title: 'Settings', url: '/admin/settings', icon: Settings, requiredRole: ['owner', 'admin'] },
  ];

  const allowedItems = menuItems.filter(item => {
    if (!item.requiredRole) return true;
    return item.requiredRole.includes(profile?.role || 'customer');
  });

  return (
    <Sidebar className="w-64">
      <SidebarContent>
        <div className="p-4">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <div>
              <h2 className="text-lg font-semibold">Admin Panel</h2>
              <Badge variant="secondary" className="text-xs">
                {profile?.role?.toUpperCase()}
              </Badge>
            </div>
          </div>
        </div>
        
        <Separator />
        
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {allowedItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link 
                      to={item.url}
                      className={`flex items-center gap-2 ${
                        (item.exact ? currentPath === item.url : isActive(item.url))
                          ? "bg-primary text-primary-foreground font-medium" 
                          : "hover:bg-muted/50"
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export const AdminLayout = () => {
  return (
    <AdminGuard>
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AdminSidebar />
          
          <div className="flex-1 flex flex-col">
            <header className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="flex items-center gap-4 px-4 h-full">
                <SidebarTrigger />
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-semibold">Admin Dashboard</h1>
                </div>
              </div>
            </header>
            
            <main className="flex-1 p-6 overflow-auto">
              <Outlet />
            </main>
          </div>
        </div>
      </SidebarProvider>
    </AdminGuard>
  );
};

// Default admin dashboard content
export const AdminDashboard = () => {
  const { profile } = useAuth();
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Welcome back, {profile?.first_name || 'Admin'}</h2>
        <p className="text-muted-foreground">
          Here's what's happening with your store today.
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Total Revenue</h3>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">$45,231.89</div>
          <p className="text-xs text-muted-foreground">
            +20.1% from last month
          </p>
        </div>
        
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Orders</h3>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">+2350</div>
          <p className="text-xs text-muted-foreground">
            +180.1% from last month
          </p>
        </div>
        
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Products</h3>
            <Package className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">+12,234</div>
          <p className="text-xs text-muted-foreground">
            +19% from last month
          </p>
        </div>
        
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Active Users</h3>
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">+573</div>
          <p className="text-xs text-muted-foreground">
            +201 since last hour
          </p>
        </div>
      </div>
      
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            <p className="text-sm">New order #1234 received</p>
            <span className="text-xs text-muted-foreground ml-auto">2 minutes ago</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
            <p className="text-sm">Product "Organic Apples" updated</p>
            <span className="text-xs text-muted-foreground ml-auto">1 hour ago</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
            <p className="text-sm">Low stock alert: Bananas</p>
            <span className="text-xs text-muted-foreground ml-auto">3 hours ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};