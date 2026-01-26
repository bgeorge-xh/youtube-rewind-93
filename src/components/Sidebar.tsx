import { 
  Home, 
  Film, 
  Music, 
  Gamepad2, 
  Newspaper, 
  GraduationCap, 
  Lightbulb, 
  Heart,
  Trophy,
  Car,
  Clapperboard,
  PawPrint,
  Plane
} from "lucide-react";

const categories = [
  { icon: Home, label: "Home", active: true },
  { icon: Film, label: "Film & Animation" },
  { icon: Music, label: "Music" },
  { icon: Gamepad2, label: "Gaming" },
  { icon: Newspaper, label: "News & Politics" },
  { icon: GraduationCap, label: "Education" },
  { icon: Lightbulb, label: "Science & Tech" },
  { icon: Heart, label: "Nonprofits" },
  { icon: Trophy, label: "Sports" },
  { icon: Car, label: "Autos & Vehicles" },
  { icon: Clapperboard, label: "Entertainment" },
  { icon: PawPrint, label: "Pets & Animals" },
  { icon: Plane, label: "Travel & Events" },
];

export const Sidebar = () => {
  return (
    <aside className="w-48 shrink-0 hidden lg:block">
      <div className="sticky top-28 bg-card rounded border border-border overflow-hidden">
        <div className="bg-secondary/50 px-3 py-2 border-b border-border">
          <h2 className="text-sm font-bold text-foreground">Categories</h2>
        </div>
        <nav className="py-1">
          {categories.map(({ icon: Icon, label, active }) => (
            <a
              key={label}
              href="#"
              className={`category-link flex items-center gap-2 mx-1 ${
                active ? "active" : ""
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{label}</span>
            </a>
          ))}
        </nav>
      </div>

      {/* Featured channels */}
      <div className="mt-4 bg-card rounded border border-border overflow-hidden">
        <div className="bg-secondary/50 px-3 py-2 border-b border-border">
          <h2 className="text-sm font-bold text-foreground">Featured Channels</h2>
        </div>
        <div className="p-2 space-y-2">
          {["smosh", "RayWilliamJohnson", "NigaHiga", "freddiew"].map((channel) => (
            <a
              key={channel}
              href="#"
              className="flex items-center gap-2 p-1.5 rounded hover:bg-secondary/50 transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-muted" />
              <span className="text-xs text-accent hover:underline truncate">
                {channel}
              </span>
            </a>
          ))}
        </div>
      </div>
    </aside>
  );
};
