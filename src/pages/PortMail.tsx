import { useEffect, useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Inbox, Send, PenSquare, Trash2, Loader2, Mail, AtSign } from "lucide-react";
import { AuthModal } from "@/components/AuthModal";
import { formatDistanceToNow } from "date-fns";

type Folder = "inbox" | "sent";
type Message = {
  id: string;
  sender_id: string;
  sender_handle: string;
  recipient_handle: string;
  recipient_id: string | null;
  subject: string;
  body: string;
  read_at: string | null;
  created_at: string;
};

const PortMail = () => {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();

  const [authOpen, setAuthOpen] = useState(false);
  const [handle, setHandle] = useState<string | null>(null);
  const [handleLoading, setHandleLoading] = useState(true);
  const [claimInput, setClaimInput] = useState("");
  const [claiming, setClaiming] = useState(false);

  const [folder, setFolder] = useState<Folder>("inbox");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMail, setLoadingMail] = useState(false);
  const [selected, setSelected] = useState<Message | null>(null);

  const [composeOpen, setComposeOpen] = useState(false);
  const [composeTo, setComposeTo] = useState("");
  const [composeSubject, setComposeSubject] = useState("");
  const [composeBody, setComposeBody] = useState("");
  const [sending, setSending] = useState(false);

  // Load handle
  useEffect(() => {
    if (!user) {
      setHandleLoading(false);
      return;
    }
    setHandleLoading(true);
    supabase
      .from("portcount_handles")
      .select("handle")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        setHandle(data?.handle ?? null);
        setHandleLoading(false);
      });
  }, [user]);

  // Load messages
  const loadMail = async () => {
    if (!user) return;
    setLoadingMail(true);
    const query = supabase
      .from("portmail_messages")
      .select("*")
      .order("created_at", { ascending: false });

    const { data, error } =
      folder === "inbox"
        ? await query.eq("recipient_id", user.id).eq("recipient_deleted", false)
        : await query.eq("sender_id", user.id).eq("sender_deleted", false);

    if (error) {
      toast({ title: "Failed to load mail", variant: "destructive" });
    } else {
      setMessages(data as Message[]);
    }
    setLoadingMail(false);
  };

  useEffect(() => {
    if (user && handle) loadMail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, handle, folder]);

  // Realtime
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel("portmail-rt")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "portmail_messages" },
        () => loadMail(),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, folder]);

  const claimHandle = async () => {
    if (!user) return;
    const clean = claimInput.trim().toLowerCase();
    if (!/^[a-z0-9_]{3,20}$/.test(clean)) {
      toast({
        title: "Invalid handle",
        description: "3–20 chars: lowercase letters, numbers, underscore.",
        variant: "destructive",
      });
      return;
    }
    setClaiming(true);
    const { error } = await supabase
      .from("portcount_handles")
      .insert({ user_id: user.id, handle: clean });
    if (error) {
      toast({
        title: "Couldn't claim handle",
        description: error.message.includes("duplicate")
          ? "That handle is already taken."
          : "Please try a different one.",
        variant: "destructive",
      });
    } else {
      setHandle(clean);
      toast({ title: `Welcome, @${clean}!`, description: "Your PortCount handle is live." });
    }
    setClaiming(false);
  };

  const openMessage = async (m: Message) => {
    setSelected(m);
    if (folder === "inbox" && !m.read_at && user) {
      await supabase
        .from("portmail_messages")
        .update({ read_at: new Date().toISOString() })
        .eq("id", m.id);
      setMessages((prev) =>
        prev.map((x) => (x.id === m.id ? { ...x, read_at: new Date().toISOString() } : x)),
      );
    }
  };

  const deleteMessage = async (m: Message) => {
    if (!user) return;
    const field = folder === "inbox" ? "recipient_deleted" : "sender_deleted";
    await supabase.from("portmail_messages").update({ [field]: true }).eq("id", m.id);
    setMessages((prev) => prev.filter((x) => x.id !== m.id));
    setSelected(null);
    toast({ title: "Moved to trash" });
  };

  const sendMail = async () => {
    if (!user || !handle) return;
    const to = composeTo.trim().toLowerCase().replace(/^@/, "").replace(/@portcount.*$/, "");
    if (!to || !composeSubject.trim()) {
      toast({ title: "Recipient and subject are required", variant: "destructive" });
      return;
    }
    setSending(true);
    const { error } = await supabase.from("portmail_messages").insert({
      sender_id: user.id,
      sender_handle: handle,
      recipient_handle: to,
      subject: composeSubject.trim(),
      body: composeBody,
    });
    if (error) {
      toast({
        title: "Couldn't send",
        description: error.message.includes("does not exist")
          ? `@${to} isn't a PortCount user yet.`
          : "Please try again.",
        variant: "destructive",
      });
    } else {
      toast({ title: "Sent!", description: `Delivered to @${to}` });
      setComposeOpen(false);
      setComposeTo("");
      setComposeSubject("");
      setComposeBody("");
      if (folder === "sent") loadMail();
    }
    setSending(false);
  };

  const unreadCount = useMemo(
    () => messages.filter((m) => !m.read_at && folder === "inbox").length,
    [messages, folder],
  );

  // ---- render states ----
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 max-w-md mx-auto px-4 py-16 text-center">
          <Mail className="w-12 h-12 text-primary mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Sign in to PortMail</h1>
          <p className="text-muted-foreground mb-6">
            You need a ViewPort account to use PortMail.
          </p>
          <Button onClick={() => setAuthOpen(true)}>Sign in</Button>
          <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
        </main>
        <Footer />
      </div>
    );
  }

  if (handleLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!handle) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 max-w-md mx-auto px-4 py-16">
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
            <AtSign className="w-10 h-10 text-primary mb-3" />
            <h1 className="text-2xl font-bold mb-1">Claim your PortCount handle</h1>
            <p className="text-sm text-muted-foreground mb-5">
              This is your address on ViewPort. People will mail you at @yourhandle.
            </p>
            <Label htmlFor="handle">Handle</Label>
            <div className="flex gap-2 mt-1.5">
              <div className="flex-1 flex items-center border border-input rounded-md bg-background pl-3">
                <span className="text-muted-foreground">@</span>
                <Input
                  id="handle"
                  value={claimInput}
                  onChange={(e) => setClaimInput(e.target.value)}
                  placeholder="yourname"
                  className="border-0 focus-visible:ring-0"
                  maxLength={20}
                />
              </div>
              <Button onClick={claimHandle} disabled={claiming}>
                {claiming && <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />}
                Claim
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              3–20 chars. Lowercase letters, numbers, underscore only.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ---- main inbox UI ----
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Mail className="w-6 h-6 text-primary" /> PortMail
            </h1>
            <p className="text-sm text-muted-foreground">
              Signed in as <span className="font-mono text-primary">@{handle}</span>
            </p>
          </div>
          <Button onClick={() => setComposeOpen(true)}>
            <PenSquare className="w-4 h-4 mr-2" /> Compose
          </Button>
        </div>

        <div className="grid md:grid-cols-[180px_1fr_1.5fr] gap-4">
          {/* Sidebar */}
          <aside className="bg-card border border-border rounded-lg p-2 h-fit">
            <FolderButton
              active={folder === "inbox"}
              onClick={() => {
                setFolder("inbox");
                setSelected(null);
              }}
              icon={<Inbox className="w-4 h-4" />}
              label="Inbox"
              badge={unreadCount > 0 ? unreadCount : undefined}
            />
            <FolderButton
              active={folder === "sent"}
              onClick={() => {
                setFolder("sent");
                setSelected(null);
              }}
              icon={<Send className="w-4 h-4" />}
              label="Sent"
            />
          </aside>

          {/* Message list */}
          <section className="bg-card border border-border rounded-lg overflow-hidden min-h-[400px]">
            {loadingMail ? (
              <div className="flex items-center justify-center h-40">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center text-sm text-muted-foreground p-8">
                No messages here yet.
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {messages.map((m) => {
                  const isUnread = folder === "inbox" && !m.read_at;
                  const other = folder === "inbox" ? m.sender_handle : m.recipient_handle;
                  return (
                    <li key={m.id}>
                      <button
                        onClick={() => openMessage(m)}
                        className={`w-full text-left px-3 py-2.5 hover:bg-secondary/50 transition-colors ${
                          selected?.id === m.id ? "bg-secondary/60" : ""
                        } ${isUnread ? "font-semibold" : ""}`}
                      >
                        <div className="flex items-baseline justify-between gap-2">
                          <span className="text-sm text-primary truncate">@{other}</span>
                          <span className="text-xs text-muted-foreground shrink-0">
                            {formatDistanceToNow(new Date(m.created_at), { addSuffix: true })}
                          </span>
                        </div>
                        <div className="text-sm truncate">{m.subject}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {m.body || "(no content)"}
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          {/* Reading pane */}
          <section className="bg-card border border-border rounded-lg p-4 min-h-[400px]">
            {selected ? (
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h2 className="text-lg font-semibold">{selected.subject}</h2>
                    <p className="text-xs text-muted-foreground mt-1">
                      From <span className="text-primary">@{selected.sender_handle}</span> to{" "}
                      <span className="text-primary">@{selected.recipient_handle}</span> ·{" "}
                      {new Date(selected.created_at).toLocaleString()}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteMessage(selected)}
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="whitespace-pre-wrap text-sm leading-relaxed border-t border-border pt-3">
                  {selected.body || (
                    <span className="text-muted-foreground italic">(empty message)</span>
                  )}
                </div>
                {folder === "inbox" && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setComposeTo(selected.sender_handle);
                        setComposeSubject(
                          selected.subject.startsWith("Re: ")
                            ? selected.subject
                            : `Re: ${selected.subject}`,
                        );
                        setComposeBody(
                          `\n\n— On ${new Date(
                            selected.created_at,
                          ).toLocaleString()}, @${selected.sender_handle} wrote:\n${selected.body
                            .split("\n")
                            .map((l) => `> ${l}`)
                            .join("\n")}`,
                        );
                        setComposeOpen(true);
                      }}
                    >
                      Reply
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-sm text-muted-foreground h-full flex items-center justify-center">
                Select a message to read it.
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Compose */}
      <Dialog open={composeOpen} onOpenChange={setComposeOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>New message</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label htmlFor="to">To</Label>
              <div className="flex items-center border border-input rounded-md bg-background pl-3 mt-1.5">
                <span className="text-muted-foreground">@</span>
                <Input
                  id="to"
                  value={composeTo}
                  onChange={(e) => setComposeTo(e.target.value)}
                  placeholder="recipient_handle"
                  className="border-0 focus-visible:ring-0"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="subj">Subject</Label>
              <Input
                id="subj"
                value={composeSubject}
                onChange={(e) => setComposeSubject(e.target.value)}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="body">Message</Label>
              <Textarea
                id="body"
                value={composeBody}
                onChange={(e) => setComposeBody(e.target.value)}
                rows={8}
                className="mt-1.5"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setComposeOpen(false)}>
                Cancel
              </Button>
              <Button onClick={sendMail} disabled={sending}>
                {sending && <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />}
                <Send className="w-4 h-4 mr-1.5" /> Send
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

const FolderButton = ({
  active,
  onClick,
  icon,
  label,
  badge,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  badge?: number;
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded text-sm transition-colors ${
      active
        ? "bg-primary text-primary-foreground"
        : "text-foreground hover:bg-secondary"
    }`}
  >
    <span className="flex items-center gap-2">
      {icon}
      {label}
    </span>
    {badge ? (
      <span
        className={`text-xs px-1.5 rounded ${
          active ? "bg-primary-foreground text-primary" : "bg-primary text-primary-foreground"
        }`}
      >
        {badge}
      </span>
    ) : null}
  </button>
);

export default PortMail;
