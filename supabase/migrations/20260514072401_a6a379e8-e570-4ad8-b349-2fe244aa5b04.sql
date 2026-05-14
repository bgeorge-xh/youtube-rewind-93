
CREATE OR REPLACE FUNCTION public.handle_subscription_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.channels SET subscriber_count = subscriber_count + 1 WHERE id = NEW.channel_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.channels SET subscriber_count = GREATEST(subscriber_count - 1, 0) WHERE id = OLD.channel_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS subscriptions_count_trigger ON public.subscriptions;
CREATE TRIGGER subscriptions_count_trigger
AFTER INSERT OR DELETE ON public.subscriptions
FOR EACH ROW EXECUTE FUNCTION public.handle_subscription_count();
