-- =====================================================================
-- NEMVIA Android / Google Play Compliance Patch: In-App Account Deletion
-- Run this in Supabase SQL Editor to enable self-service account deletion
-- required by Google Play Store policies.
-- =====================================================================

create or replace function public.delete_own_account()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := (select auth.uid());
begin
  if v_uid is null then
    raise exception 'You must be signed in to delete your account';
  end if;

  -- Clean up tables that reference profiles(id) with ON DELETE RESTRICT
  delete from public.assignments where teacher_id = v_uid;
  delete from public.lessons where teacher_id = v_uid;
  delete from public.classes where teacher_id = v_uid;

  -- Deleting from auth.users cascades to public.profiles and all dependent records
  delete from auth.users where id = v_uid;
end;
$$;

revoke all on function public.delete_own_account() from public;
grant execute on function public.delete_own_account() to authenticated;
