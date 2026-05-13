import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Mail, Shield, Zap, Users, Inbox, Send } from "lucide-react";

const PortMailLanding = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary/10 via-secondary/30 to-background border-b border-border">
          <div className="max-w-6xl mx-auto px-4 py-16 sm:py-24 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-6">
              <Zap className="w-3 h-3" /> NEW SUITE — 2026
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold text-foreground mb-4">
              Introducing <span className="text-primary">PortMail</span> &{" "}
              <span className="text-primary">PortCount</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              It vibes like Gmail. But you don't have to worry about privacy and
              stuff anymore — because it's now in <em>our</em> hands.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/mail"
                className="classic-button bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2.5 text-base"
              >
                <Mail className="w-4 h-4 mr-2 inline" />
                Open PortMail
              </Link>
              <a
                href="#features"
                className="classic-button px-6 py-2.5 text-base"
              >
                Learn more
              </a>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Other than your own email or Google account, we now offer our own service.
            </p>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="max-w-6xl mx-auto px-4 py-16">
          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Mail className="w-6 h-6" />}
              title="PortMail Inbox"
              body="A familiar, clean inbox right inside ViewPort. Compose, reply, send — to anyone with a PortCount handle."
            />
            <FeatureCard
              icon={<Users className="w-6 h-6" />}
              title="PortCount Handles"
              body="Claim a free @portcount handle like @yourname and become reachable across the platform."
            />
            <FeatureCard
              icon={<Shield className="w-6 h-6" />}
              title="Privacy in Our Hands"
              body="Your mail stays on ViewPort infrastructure. No third-party trackers, no ad scanning, no nonsense."
            />
            <FeatureCard
              icon={<Inbox className="w-6 h-6" />}
              title="Unified With Your Channel"
              body="Subscribers can reach out, creators can respond — all from one place."
            />
            <FeatureCard
              icon={<Send className="w-6 h-6" />}
              title="Instant Delivery"
              body="Messages between PortCount users arrive instantly. No queues, no delays."
            />
            <FeatureCard
              icon={<Zap className="w-6 h-6" />}
              title="It Just Vibes"
              body="Looks like the email you already love. No learning curve, no migration headaches."
            />
          </div>
        </section>

        {/* CTA */}
        <section className="bg-secondary/40 border-t border-border">
          <div className="max-w-4xl mx-auto px-4 py-16 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-3">
              Ready to claim your handle?
            </h2>
            <p className="text-muted-foreground mb-6">
              Sign in, claim your @portcount handle, and start sending mail.
            </p>
            <Link
              to="/mail"
              className="classic-button bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2.5 text-base"
            >
              Get started with PortMail
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

const FeatureCard = ({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) => (
  <div className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
    <div className="w-12 h-12 rounded-md bg-primary/10 text-primary flex items-center justify-center mb-4">
      {icon}
    </div>
    <h3 className="font-semibold text-foreground mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground">{body}</p>
  </div>
);

export default PortMailLanding;
