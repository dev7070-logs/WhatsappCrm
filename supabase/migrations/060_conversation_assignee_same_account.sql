-- ============================================================
-- 060: a conversation can only be assigned to a member of its own
-- account.
--
-- `conversations.assigned_agent_id` (an auth user id) had no
-- membership check: the `conversations_update` RLS policy lets any
-- agent update the row, and automations / flows copy an agent id
-- from step config. An agent in account X could therefore assign one
-- of X's conversations to a user in account Y, and the 027
-- notifications trigger (SECURITY DEFINER) would drop an
-- attacker-worded notification into that user's bell — a cross-tenant
-- phishing channel.
--
-- Enforced here, in the database, so every path is covered: the
-- dashboard, the anon key from a browser, automations and flows.
-- Only fires when the assignee (or the account) actually changes, so
-- rows still pointing at a since-removed member keep updating fine.
-- ============================================================

CREATE OR REPLACE FUNCTION public.enforce_conversation_assignee_account()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.assigned_agent_id IS NULL THEN
    RETURN NEW;
  END IF;

  IF TG_OP = 'UPDATE'
     AND NEW.assigned_agent_id IS NOT DISTINCT FROM OLD.assigned_agent_id
     AND NEW.account_id IS NOT DISTINCT FROM OLD.account_id THEN
    RETURN NEW;
  END IF;

  IF NOT EXISTS (
    SELECT 1
      FROM public.profiles p
     WHERE p.user_id = NEW.assigned_agent_id
       AND p.account_id = NEW.account_id
  ) THEN
    RAISE EXCEPTION 'assigned agent is not a member of this account'
      USING ERRCODE = '23514';
  END IF;

  RETURN NEW;
END;
$$;

-- Trigger-only helper: nobody calls it directly.
REVOKE ALL ON FUNCTION public.enforce_conversation_assignee_account() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.enforce_conversation_assignee_account() FROM anon, authenticated;

DROP TRIGGER IF EXISTS conversations_assignee_same_account ON public.conversations;
CREATE TRIGGER conversations_assignee_same_account
  BEFORE INSERT OR UPDATE OF assigned_agent_id, account_id
  ON public.conversations
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_conversation_assignee_account();
