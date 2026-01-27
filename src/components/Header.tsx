import { Search, Upload, User } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();

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

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border shadow-header">
      {/* Top bar with logo and search */}
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-foreground">View</span>
              <span className="bg-primary text-primary-foreground text-2xl font-bold px-1.5 py-0.5 rounded-sm">
                Port
              </span>
            </div>
            <span className="text-xs text-muted-foreground italic mt-1 hidden sm:block">
              Your Videos, Your Way™
            </span>
          </div>

          {/* Search bar */}
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

          {/* User actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button className="classic-button hidden sm:flex gap-1.5">
              <Upload className="w-4 h-4" />
              <span>Upload</span>
            </button>
            <button className="classic-button">
              <User className="w-4 h-4" />
              <span className="ml-1.5 hidden sm:inline">Sign In</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation tabs */}
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
  );
};
