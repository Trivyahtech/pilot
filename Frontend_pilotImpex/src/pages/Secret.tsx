import { FormEvent, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { LayoutDashboard } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getAdminMe, loginAdmin, type AdminUser } from "./admin/adminApi";
import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import ProductGroupsManagement from "./admin/ProductGroupsManagement";
import ProductsManagement from "./admin/ProductsManagement";
import ProductEditor from "./admin/ProductEditor";
import DocumentsManagement from "./admin/DocumentsManagement";

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    if (!username.trim() || !password) {
      toast.error("Username and password are required.");
      return;
    }

    setSaving(true);
    try {
      const user = await loginAdmin(username.trim(), password);
      queryClient.setQueryData<AdminUser>(["admin", "me"], user);
      await queryClient.invalidateQueries({ queryKey: ["catalog"] });
      toast.success("Admin session started.");
      navigate("/secret/dashboard", { replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-10">
      <Card className="w-full max-w-md border-border shadow-xl">
        <CardHeader>
          <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <LayoutDashboard className="h-5 w-5" />
          </div>
          <CardTitle className="font-heading text-primary">Pilot Impex Admin</CardTitle>
          <CardDescription>Sign in with the configured admin credentials.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleLogin}>
            <div className="space-y-2">
              <Label htmlFor="admin-username">Username</Label>
              <Input
                id="admin-username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                autoComplete="username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-password">Password</Label>
              <Input
                id="admin-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
              />
            </div>
            <Button className="w-full" disabled={saving}>
              {saving ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Secret() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["admin", "me"],
    queryFn: getAdminMe,
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30">
        <div className="text-sm text-muted-foreground">Loading admin session...</div>
      </div>
    );
  }

  if (!user) return <AdminLogin />;

  return (
    <Routes>
      <Route element={<AdminLayout user={user} />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="groups" element={<ProductGroupsManagement />} />
        <Route path="products" element={<ProductsManagement />} />
        <Route path="products/new" element={<ProductEditor />} />
        <Route path="products/:slug/edit" element={<ProductEditor />} />
        <Route path="documents" element={<DocumentsManagement />} />
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>
    </Routes>
  );
}
