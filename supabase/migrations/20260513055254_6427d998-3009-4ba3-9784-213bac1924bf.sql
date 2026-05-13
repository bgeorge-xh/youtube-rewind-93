ALTER TABLE public.portmail_messages REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.portmail_messages;