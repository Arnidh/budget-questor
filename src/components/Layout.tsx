
import { Outlet, NavLink } from "react-router-dom";
import { LayoutDashboard, TrendingUp, User, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { AuthForm } from "@/components/AuthForm";

const Layout = () => {
  const { user, signOut, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary p-4 md:p-8">
        <div className="container mx-auto max-w-md space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">Budget Buddy</h1>
            <p className="text-muted-foreground">Sign in to track your expenses</p>
          </div>
          <AuthForm />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-card border-r border-border min-h-screen p-4 space-y-4">
          <div className="text-xl font-bold mb-8">Budget Buddy</div>
          <nav className="space-y-2">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center gap-2 p-2 rounded-lg transition-colors ${
                  isActive ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"
                }`
              }
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </NavLink>
            <NavLink
              to="/investment"
              className={({ isActive }) =>
                `flex items-center gap-2 p-2 rounded-lg transition-colors ${
                  isActive ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"
                }`
              }
            >
              <TrendingUp className="h-4 w-4" />
              Investment Advice
            </NavLink>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `flex items-center gap-2 p-2 rounded-lg transition-colors ${
                  isActive ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"
                }`
              }
            >
              <User className="h-4 w-4" />
              Profile
            </NavLink>
          </nav>
          <div className="absolute bottom-4">
            <Button
              variant="ghost"
              onClick={signOut}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
