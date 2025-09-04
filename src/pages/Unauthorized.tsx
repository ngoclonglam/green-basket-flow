import { Link } from 'react-router-dom';
import { Shield, Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/auth';

export const Unauthorized = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <div className="rounded-full bg-muted p-4">
            <Shield className="h-12 w-12 text-muted-foreground" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Access Denied</h1>
          <p className="text-muted-foreground">
            You don't have permission to access this area. This section is restricted to administrators only.
          </p>
        </div>
        
        {user && (
          <div className="rounded-lg border bg-muted/50 p-4">
            <p className="text-sm text-muted-foreground">
              Logged in as: <span className="font-medium">{user.email}</span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              If you believe this is an error, please contact your administrator.
            </p>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button asChild variant="default" className="flex items-center gap-2">
            <Link to="/">
              <Home className="h-4 w-4" />
              Go Home
            </Link>
          </Button>
          
          <Button asChild variant="outline" onClick={() => window.history.back()}>
            <span className="flex items-center gap-2 cursor-pointer">
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </span>
          </Button>
        </div>
        
        {!user && (
          <div className="mt-6">
            <Button asChild variant="link">
              <Link to="/auth">
                Sign in with an admin account
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};