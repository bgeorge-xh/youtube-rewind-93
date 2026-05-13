CREATE OR REPLACE FUNCTION public.resolve_portmail_recipient()
RETURNS trigger LANGUAGE plpgsql SECURITY INVOKER SET search_path = public AS $$
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

REVOKE EXECUTE ON FUNCTION public.resolve_portmail_recipient() FROM PUBLIC, anon, authenticated;