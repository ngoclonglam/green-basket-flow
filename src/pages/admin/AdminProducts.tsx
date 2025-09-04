import { Package, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AdminGuard } from '@/components/admin/AdminGuard';

export const AdminProducts = () => {
  return (
    <AdminGuard>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Products</h2>
            <p className="text-muted-foreground">
              Manage your store's products and inventory.
            </p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </div>
        
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex items-center gap-4 mb-4">
            <Package className="h-6 w-6 text-muted-foreground" />
            <h3 className="text-lg font-medium">Product Management</h3>
          </div>
          <p className="text-muted-foreground">
            Product management functionality will be implemented here. This will include:
          </p>
          <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1">
            <li>View all products in a data table</li>
            <li>Add new products with images and details</li>
            <li>Edit existing products</li>
            <li>Manage inventory and stock levels</li>
            <li>Set product pricing and discounts</li>
            <li>Toggle product availability</li>
          </ul>
        </div>
      </div>
    </AdminGuard>
  );
};