import { Search, Upload, User, LogOut } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "@/components/AuthModal";
import { UploadVideoModal } from "@/components/UploadVideoModal";
import { useQueryClient } from "@tanstack/react-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();
  const queryClient = useQueryClient();

  const navTabs = [
    { label: "Home", path: "/" },
    { label: "Videos", path: "/videos" },
    { label: "PortWiki", path: "/wiki" },
    { label: "PortNews", path: "/news" },
    { label: "Community", path: "/community" },
  ];

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const handleUploadClick = () => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    setUploadModalOpen(true);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-header">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <div className="flex items-center">
                <span className="text-2xl font-bold text-foreground">View</span>
                <span className="bg-primary text-primary-foreground text-2xl font-bold px-1.5 py-0.5 rounded-sm">
                  Port
                </span>
              </div>
              <span className="text-xs text-muted-foreground italic mt-1 hidden sm:block">
                Your Videos, Your Way™
              </span>
            </Link>

            <div className="flex-1 max-w-xl">
              <div className="flex">
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-sm border border-border rounded-l bg-background focus:outline-none focus:ring-1 focus:ring-primary/50"
                />
                <button className="classic-button rounded-l-none border-l-0">
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button className="classic-button hidden sm:flex gap-1.5" onClick={handleUploadClick}>
                <Upload className="w-4 h-4" />
                <span>Upload</span>
              </button>
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="classic-button">
                      <User className="w-4 h-4" />
                      <span className="ml-1.5 hidden sm:inline">
                        {user.email?.split("@")[0]}
                      </span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link to="/channel/me" className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        My Channel
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="flex items-center gap-2 text-destructive"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <button
                  className="classic-button"
                  onClick={() => setAuthModalOpen(true)}
                >
                  <User className="w-4 h-4" />
                  <span className="ml-1.5 hidden sm:inline">Sign In</span>
                </button>
              )}
            </div>
          </div>
        </div>

        <nav className="bg-secondary/50 border-t border-border">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex gap-1 overflow-x-auto">
              {navTabs.map((tab) => (
                <Link
                  key={tab.path}
                  to={tab.path}
                  className={`px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
                    isActive(tab.path)
                      ? "text-primary border-b-2 border-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </Link>
              ))}
            </div>
          </div>
        </nav>
      </header>

      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
      <UploadVideoModal
        open={uploadModalOpen}
        onOpenChange={setUploadModalOpen}
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ["videos"] })}
      />
    </>
  );
};
