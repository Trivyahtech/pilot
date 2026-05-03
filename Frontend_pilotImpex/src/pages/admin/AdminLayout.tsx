import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { BarChart3, FileText, FolderTree, LogOut, Menu, Package, X } from "lucide-react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { logoutAdmin, type AdminUser } from "./adminApi";

const navItems = [
  { to: "/secret/dashboard", label: "Dashboard", icon: BarChart3 },
  { to: "/secret/groups", label: "Product Groups", icon: FolderTree },
  { to: "/secret/products", label: "Products", icon: Package },
  { to: "/secret/documents", label: "Documents", icon: FileText },
];

function AdminNav({ onSelect }: { onSelect?: () => void }) {
  return (
    <nav className="space-y-1">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          onClick={onSelect}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`
          }
        >
          <item.icon className="h-4 w-4" />
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}

export default function AdminLayout({ user }: { user: AdminUser }) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutAdmin();
      toast.success("Logged out.");
    } catch {
      toast.error("Logout failed. Clearing local session.");
    } finally {
      queryClient.removeQueries({ queryKey: ["admin"] });
      navigate("/secret", { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 text-foreground">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-border bg-background lg:block">
        <div className="flex h-full flex-col">
          <div className="border-b border-border px-6 py-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Pilot Impex</p>
            <h1 className="mt-1 font-heading text-xl font-bold text-primary">Admin Console</h1>
          </div>
          <div className="flex-1 px-4 py-5">
            <AdminNav />
          </div>
          <div className="border-t border-border p-4">
            <Badge variant="outline" className="mb-3 w-full justify-center bg-background py-1.5">
              {user.username}
            </Badge>
            <Button type="button" variant="outline" className="w-full" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur lg:px-8">
          <div className="flex items-center gap-3">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button type="button" variant="ghost" size="icon" className="lg:hidden">
                  {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0">
                <div className="border-b border-border px-6 py-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Pilot Impex</p>
                  <h2 className="mt-1 font-heading text-xl font-bold text-primary">Admin Console</h2>
                </div>
                <div className="px-4 py-5">
                  <AdminNav onSelect={() => setOpen(false)} />
                </div>
              </SheetContent>
            </Sheet>
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Catalog Management</p>
              <p className="font-heading text-lg font-semibold text-foreground">Pilot Impex Admin</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="hidden bg-background sm:inline-flex">
              {user.username}
            </Badge>
            <Button type="button" variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </header>
        <main className="px-4 py-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
