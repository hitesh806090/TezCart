import { redirect } from "next/navigation";
import { getServerAuthSession } from "@/server/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Users, Package, ShoppingBag, Settings, FolderTree } from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();

  // Redirect if not admin
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container flex h-16 items-center gap-4">
          <Link href="/admin" className="font-bold text-xl">
            Admin Console
          </Link>
          <nav className="flex gap-2 ml-8">
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/sellers">
                <Users className="mr-2 h-4 w-4" />
                Sellers
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/products">
                <Package className="mr-2 h-4 w-4" />
                Products
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/orders">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Orders
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/users">
                <Users className="mr-2 h-4 w-4" />
                Users
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/categories">
                <FolderTree className="mr-2 h-4 w-4" />
                Categories
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/reports">
                <Settings className="mr-2 h-4 w-4" />
                Reports
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/cms">
                <Settings className="mr-2 h-4 w-4" />
                CMS
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/fraud">
                <Settings className="mr-2 h-4 w-4" />
                Fraud
              </Link>
            </Button>
          </nav>
          <div className="ml-auto">
            <Button asChild variant="outline" size="sm">
              <Link href="/">Back to Site</Link>
            </Button>
          </div>
        </div>
      </div>
      <div className="container py-8">{children}</div>
    </div>
  );
}
