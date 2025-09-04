import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, AlertTriangle, History, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth, useToast } from '@/hooks';
import type { UserProfile, UserRole } from '@/types';

interface RoleAuditLog {
  id: string;
  changed_user_id: string;
  previous_role: UserRole | null;
  new_role: UserRole;
  changed_by: string;
  changed_at: string;
  reason: string | null;
  // Joined data
  changed_user_email?: string;
  changed_by_email?: string;
}

export const AdminSecurity = () => {
  const { profile, isAdmin } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [auditLogs, setAuditLogs] = useState<RoleAuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  // Fetch users and audit logs
  useEffect(() => {
    const fetchData = async () => {
      if (!isAdmin()) return;

      try {
        // Fetch all user profiles
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (profilesError) throw profilesError;
        setUsers(profilesData || []);

        // Fetch audit logs with user information
        const { data: auditData, error: auditError } = await supabase
          .from('role_audit_log')
          .select(`
            *,
            changed_user:profiles!role_audit_log_changed_user_id_fkey(email),
            changed_by_user:profiles!role_audit_log_changed_by_fkey(email)
          `)
          .order('changed_at', { ascending: false })
          .limit(50);

        if (auditError) throw auditError;
        setAuditLogs(auditData || []);
      } catch (error) {
        console.error('Error fetching admin data:', error);
        toast({
          title: "Error",
          description: "Failed to load admin security data.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAdmin, toast]);

  const handleRoleUpdate = async (userId: string, newRole: UserRole) => {
    if (!isAdmin()) return;

    setUpdating(userId);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('user_id', userId);

      if (error) throw error;

      // Update local state
      setUsers(prev => prev.map(user => 
        user.user_id === userId ? { ...user, role: newRole } : user
      ));

      toast({
        title: "Role Updated",
        description: "User role has been successfully updated.",
      });

      // Refresh audit logs
      const { data: auditData, error: auditError } = await supabase
        .from('role_audit_log')
        .select(`
          *,
          changed_user:profiles!role_audit_log_changed_user_id_fkey(email),
          changed_by_user:profiles!role_audit_log_changed_by_fkey(email)
        `)
        .order('changed_at', { ascending: false })
        .limit(50);

      if (!auditError && auditData) {
        setAuditLogs(auditData);
      }
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: "Error",
        description: "Failed to update user role.",
        variant: "destructive"
      });
    } finally {
      setUpdating(null);
    }
  };

  const getRoleBadgeVariant = (role: UserRole) => {
    switch (role) {
      case 'owner': return 'default';
      case 'admin': return 'destructive';
      case 'staff': return 'secondary';
      case 'customer': return 'secondary';
      default: return 'secondary';
    }
  };

  if (!isAdmin()) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          You don't have permission to access security administration.
        </AlertDescription>
      </Alert>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Shield className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Security Administration</h1>
      </div>

      {/* User Role Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            User Role Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Current Role</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    {user.first_name} {user.last_name}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(user.role)}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.user_id !== profile?.user_id && (
                      <Select
                        value={user.role}
                        onValueChange={(newRole: UserRole) => handleRoleUpdate(user.user_id, newRole)}
                        disabled={updating === user.user_id}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="customer">Customer</SelectItem>
                          <SelectItem value="staff">Staff</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                          {profile?.role === 'owner' && (
                            <SelectItem value="owner">Owner</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    )}
                    {user.user_id === profile?.user_id && (
                      <span className="text-sm text-muted-foreground">You</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Role Change Audit Log */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Role Change Audit Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          {auditLogs.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Changed User</TableHead>
                  <TableHead>Previous Role</TableHead>
                  <TableHead>New Role</TableHead>
                  <TableHead>Changed By</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      {new Date(log.changed_at).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {(log as any).changed_user?.email || 'Unknown'}
                    </TableCell>
                    <TableCell>
                      {log.previous_role ? (
                        <Badge variant={getRoleBadgeVariant(log.previous_role)}>
                          {log.previous_role}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getRoleBadgeVariant(log.new_role)}>
                        {log.new_role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {(log as any).changed_by_user?.email || 'System'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground text-center py-4">
              No role changes recorded yet.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};