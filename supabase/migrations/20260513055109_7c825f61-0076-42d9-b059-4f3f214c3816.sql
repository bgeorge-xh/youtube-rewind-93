-- PortCount handles
CREATE TABLE public.portcount_handles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  handle text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT handle_format CHECK (handle ~ '^[a-z0-9_]{3,20}$')
);

ALTER TABLE public.portcount_handles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Handles are viewable by everyone"
  ON public.portcount_handles FOR SELECT USING (true);
CREATE POLICY "Users can claim their own handle"
  ON public.portcount_handles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own handle"
  ON public.portcount_handles FOR UPDATE USING (auth.uid() = user_id);

-- PortMail messages
CREATE TABLE public.portmail_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL,
  sender_handle text NOT NULL,
  recipient_handle text NOT NULL,
  recipient_id uuid,
  subject text NOT NULL DEFAULT '(no subject)',
  body text NOT NULL DEFAULT '',
  read_at timestamptz,
  sender_deleted boolean NOT NULL DEFAULT false,
  recipient_deleted boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.portmail_messages ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_portmail_recipient ON public.portmail_messages(recipient_id, created_at DESC);
CREATE INDEX idx_portmail_sender ON public.portmail_messages(sender_id, created_at DESC);

CREATE POLICY "Users can view their own mail"
  ON public.portmail_messages FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can send mail as themselves"
  ON public.portmail_messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update their own mail"
  ON public.portmail_messages FOR UPDATE
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

-- Auto-resolve recipient_id from handle on insert
CREATE OR REPLACE FUNCTION public.resolve_portmail_recipient()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  NEW.recipient_handle := lower(NEW.recipient_handle);
  SELECT user_id INTO NEW.recipient_id
  FROM public.portcount_handles
  WHERE handle = NEW.recipient_handle;
  IF NEW.recipient_id IS NULL THEN
    RAISE EXCEPTION 'Recipient handle @% does not exist', NEW.recipient_handle;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_resolve_portmail_recipient
  BEFORE INSERT ON public.portmail_messages
  FOR EACH ROW EXECUTE FUNCTION public.resolve_portmail_recipient();