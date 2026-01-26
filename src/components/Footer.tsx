export const Footer = () => {
  return (
    <footer className="mt-8 border-t border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex flex-wrap gap-4">
            <a href="#" className="hover:text-foreground transition-colors">Company</a>
            <a href="#" className="hover:text-foreground transition-colors">About</a>
            <a href="#" className="hover:text-foreground transition-colors">Press</a>
            <a href="#" className="hover:text-foreground transition-colors">Copyright</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact us</a>
            <a href="#" className="hover:text-foreground transition-colors">Creators</a>
            <a href="#" className="hover:text-foreground transition-colors">Advertise</a>
            <a href="#" className="hover:text-foreground transition-colors">Developers</a>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Policy & Safety</a>
            <a href="#" className="hover:text-foreground transition-colors">How YouTube works</a>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-foreground">You</span>
            <span className="bg-primary text-primary-foreground text-2xl font-bold px-1.5 py-0.5 rounded-sm">
              Tube
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            © 2007-2012 YouTube, LLC
          </p>
        </div>
      </div>
    </footer>
  );
};
