-- =====================================================================
-- NEMVIA — 01B_MISSING_TABLES_SYNC.sql (آمن للتشغيل أكثر من مرة / idempotent)
-- شغّله في Supabase → SQL Editor إذا كانت جداول profiles/classes موجودة مسبقاً
-- وتريد إكمال باقي الجداول الناقصة (الاختبارات، القصص، البث المباشر، الرسائل، البلاغات)
-- ثم شغّل بعده: 02_NEMVIA_PATCH.sql ثم 03 ثم 04 ثم 05.
-- =====================================================================

alter table public.classes add column if not exists class_type text not null default 'class' check (class_type in ('class','study'));
drop policy if exists "teachers create own classes" on public.classes;
drop policy if exists "authenticated users create learning spaces" on public.classes;
create policy "authenticated users create learning spaces" on public.classes for insert to authenticated with check (teacher_id=(select auth.uid()));
drop policy if exists "classes visible to members" on public.classes;
drop policy if exists "active spaces discoverable" on public.classes;
create policy "active spaces discoverable" on public.classes for select to authenticated using (is_archived=false or teacher_id=(select auth.uid()) or public.is_class_member(id) or public.is_admin());

create or replace function public.join_class_by_code(p_join_code text) returns uuid language plpgsql security definer set search_path='' as $$
declare v_uid uuid := (select auth.uid()); v_cid uuid;
begin if v_uid is null then raise exception 'Sign in required'; end if;
select id into v_cid from public.classes where join_code=upper(trim(p_join_code)) and is_archived=false;
if v_cid is null then raise exception 'رمز الانضمام غير صحيح'; end if;
insert into public.class_members(class_id,user_id,member_role) values(v_cid,v_uid,case when exists(select 1 from public.profiles where id=v_uid and role='teacher') then 'assistant'::public.class_member_role else 'student'::public.class_member_role end) on conflict do nothing;
return v_cid; end $$;
grant execute on function public.join_class_by_code(text) to authenticated;

create or replace function public.add_class_creator_as_member() returns trigger language plpgsql security definer set search_path='' as $$
declare v_role public.class_member_role; begin select case when role='teacher' then 'assistant'::public.class_member_role else 'student'::public.class_member_role end into v_role from public.profiles where id=new.teacher_id; insert into public.class_members(class_id,user_id,member_role) values(new.id,new.teacher_id,coalesce(v_role,'student'::public.class_member_role)) on conflict do nothing; return new; end $$;
drop trigger if exists class_creator_membership on public.classes;
create trigger class_creator_membership after insert on public.classes for each row execute function public.add_class_creator_as_member();

create table if not exists public.stories(id uuid primary key default gen_random_uuid(),user_id uuid not null references public.profiles(id) on delete cascade,body text not null check(char_length(body) between 1 and 500),created_at timestamptz not null default now(),expires_at timestamptz not null default(now()+interval '24 hours'));
create index if not exists stories_expiry_idx on public.stories(expires_at desc);
alter table public.stories enable row level security;
drop policy if exists "stories read permitted" on public.stories;
create policy "stories read permitted" on public.stories for select to authenticated using(expires_at>now() and (user_id=(select auth.uid()) or exists(select 1 from public.profiles p where p.id=user_id and p.visibility='public') or public.is_accepted_follower(user_id)));
drop policy if exists "stories insert own" on public.stories;
create policy "stories insert own" on public.stories for insert to authenticated with check(user_id=(select auth.uid()));
drop policy if exists "stories delete own" on public.stories;
create policy "stories delete own" on public.stories for delete to authenticated using(user_id=(select auth.uid()) or public.is_admin());

create table if not exists public.courses(id uuid primary key default gen_random_uuid(),owner_id uuid not null references public.profiles(id) on delete cascade,title text not null,description text not null default '',cover_url text,visibility text not null default 'public' check(visibility in ('public','private')),created_at timestamptz not null default now());
alter table public.courses enable row level security;
drop policy if exists "courses public or owner read" on public.courses;
create policy "courses public or owner read" on public.courses for select to authenticated using(visibility='public' or owner_id=(select auth.uid()) or public.is_admin());
drop policy if exists "users create own courses" on public.courses;
create policy "users create own courses" on public.courses for insert to authenticated with check(owner_id=(select auth.uid()));
drop policy if exists "owners update courses" on public.courses;
create policy "owners update courses" on public.courses for update to authenticated using(owner_id=(select auth.uid()) or public.is_admin()) with check(owner_id=(select auth.uid()) or public.is_admin());
drop policy if exists "owners delete courses" on public.courses;
create policy "owners delete courses" on public.courses for delete to authenticated using(owner_id=(select auth.uid()) or public.is_admin());

create table if not exists public.live_sessions(id uuid primary key default gen_random_uuid(),host_id uuid not null references public.profiles(id) on delete cascade,class_id uuid references public.classes(id) on delete set null,title text not null,description text not null default '',meeting_url text,provider_room text,starts_at timestamptz not null,status text not null default 'scheduled' check(status in ('scheduled','live','ended','cancelled')),created_at timestamptz not null default now());
alter table public.live_sessions enable row level security;
drop policy if exists "live sessions visible to signed users" on public.live_sessions;
create policy "live sessions visible to signed users" on public.live_sessions for select to authenticated using(host_id=(select auth.uid()) or class_id is null or public.is_class_member(class_id) or public.is_admin());
drop policy if exists "users schedule own live sessions" on public.live_sessions;
create policy "users schedule own live sessions" on public.live_sessions for insert to authenticated with check(host_id=(select auth.uid()));
drop policy if exists "hosts manage live sessions" on public.live_sessions;
create policy "hosts manage live sessions" on public.live_sessions for update to authenticated using(host_id=(select auth.uid()) or public.is_admin()) with check(host_id=(select auth.uid()) or public.is_admin());
drop policy if exists "hosts delete live sessions" on public.live_sessions;
create policy "hosts delete live sessions" on public.live_sessions for delete to authenticated using(host_id=(select auth.uid()) or public.is_admin());

create table if not exists public.direct_messages(id uuid primary key default gen_random_uuid(),sender_id uuid not null references public.profiles(id) on delete cascade,recipient_id uuid not null references public.profiles(id) on delete cascade,body text not null check(char_length(body) between 1 and 5000),attachment_url text,read_at timestamptz,created_at timestamptz not null default now(),check(sender_id<>recipient_id));
create index if not exists direct_messages_pair_idx on public.direct_messages(sender_id,recipient_id,created_at desc);
alter table public.direct_messages enable row level security;
drop policy if exists "message participants read" on public.direct_messages;
create policy "message participants read" on public.direct_messages for select to authenticated using(sender_id=(select auth.uid()) or recipient_id=(select auth.uid()));
drop policy if exists "sender creates message" on public.direct_messages;
create policy "sender creates message" on public.direct_messages for insert to authenticated with check(sender_id=(select auth.uid()));
drop policy if exists "recipient marks message read" on public.direct_messages;
create policy "recipient marks message read" on public.direct_messages for update to authenticated using(recipient_id=(select auth.uid())) with check(recipient_id=(select auth.uid()));
drop policy if exists "sender deletes own message" on public.direct_messages;
create policy "sender deletes own message" on public.direct_messages for delete to authenticated using(sender_id=(select auth.uid()));

create table if not exists public.content_reports(id uuid primary key default gen_random_uuid(),reporter_id uuid not null references public.profiles(id) on delete cascade,target_type text not null check(target_type in ('post','profile','comment','message')),target_id uuid not null,reason text not null,details text not null default '',status text not null default 'open' check(status in ('open','reviewing','resolved','dismissed')),created_at timestamptz not null default now());
alter table public.content_reports enable row level security;
drop policy if exists "reporter and admin read reports" on public.content_reports;
create policy "reporter and admin read reports" on public.content_reports for select to authenticated using(reporter_id=(select auth.uid()) or public.is_admin());
drop policy if exists "users submit reports" on public.content_reports;
create policy "users submit reports" on public.content_reports for insert to authenticated with check(reporter_id=(select auth.uid()));
drop policy if exists "admins manage reports" on public.content_reports;
create policy "admins manage reports" on public.content_reports for update to authenticated using(public.is_admin()) with check(public.is_admin());

create table if not exists public.course_enrollments(course_id uuid not null references public.courses(id) on delete cascade,user_id uuid not null references public.profiles(id) on delete cascade,joined_at timestamptz not null default now(),primary key(course_id,user_id));
alter table public.course_enrollments enable row level security;
drop policy if exists "enrollment visible to participant or owner" on public.course_enrollments;
create policy "enrollment visible to participant or owner" on public.course_enrollments for select to authenticated using(user_id=(select auth.uid()) or exists(select 1 from public.courses c where c.id=course_id and c.owner_id=(select auth.uid())) or public.is_admin());
drop policy if exists "users enroll themselves" on public.course_enrollments;
create policy "users enroll themselves" on public.course_enrollments for insert to authenticated with check(user_id=(select auth.uid()));
drop policy if exists "users unenroll themselves" on public.course_enrollments;
create policy "users unenroll themselves" on public.course_enrollments for delete to authenticated using(user_id=(select auth.uid()) or public.is_admin());

create table if not exists public.quizzes(id uuid primary key default gen_random_uuid(),class_id uuid not null references public.classes(id) on delete cascade,teacher_id uuid not null references public.profiles(id) on delete cascade,title text not null,description text not null default '',opens_at timestamptz,closes_at timestamptz,created_at timestamptz not null default now());
create table if not exists public.quiz_questions(id uuid primary key default gen_random_uuid(),quiz_id uuid not null references public.quizzes(id) on delete cascade,question text not null,options jsonb not null default '[]'::jsonb,correct_option integer,points numeric(6,2) not null default 1,position integer not null default 0);
create table if not exists public.quiz_attempts(id uuid primary key default gen_random_uuid(),quiz_id uuid not null references public.quizzes(id) on delete cascade,student_id uuid not null references public.profiles(id) on delete cascade,answers jsonb not null default '{}'::jsonb,score numeric(7,2),submitted_at timestamptz not null default now(),unique(quiz_id,student_id));
DO $$ DECLARE t text; BEGIN FOREACH t IN ARRAY ARRAY['quizzes','quiz_questions','quiz_attempts'] LOOP EXECUTE format('alter table public.%I enable row level security',t); END LOOP; END $$;
drop policy if exists "class members read quizzes" on public.quizzes;
create policy "class members read quizzes" on public.quizzes for select to authenticated using(public.is_class_member(class_id) or public.is_admin());
drop policy if exists "class teachers create quizzes" on public.quizzes;
create policy "class teachers create quizzes" on public.quizzes for insert to authenticated with check(teacher_id=(select auth.uid()) and public.is_class_teacher(class_id));
drop policy if exists "quiz owners manage" on public.quizzes;
create policy "quiz owners manage" on public.quizzes for update to authenticated using(teacher_id=(select auth.uid()) or public.is_admin()) with check(teacher_id=(select auth.uid()) or public.is_admin());
drop policy if exists "quiz owners delete" on public.quizzes;
create policy "quiz owners delete" on public.quizzes for delete to authenticated using(teacher_id=(select auth.uid()) or public.is_admin());
drop policy if exists "quiz questions visible to class" on public.quiz_questions;
create policy "quiz questions visible to class" on public.quiz_questions for select to authenticated using(exists(select 1 from public.quizzes q where q.id=quiz_id and public.is_class_member(q.class_id)));
drop policy if exists "quiz teachers manage questions" on public.quiz_questions;
create policy "quiz teachers manage questions" on public.quiz_questions for all to authenticated using(exists(select 1 from public.quizzes q where q.id=quiz_id and (q.teacher_id=(select auth.uid()) or public.is_admin()))) with check(exists(select 1 from public.quizzes q where q.id=quiz_id and (q.teacher_id=(select auth.uid()) or public.is_admin())));
drop policy if exists "students read own attempts and teachers class attempts" on public.quiz_attempts;
create policy "students read own attempts and teachers class attempts" on public.quiz_attempts for select to authenticated using(student_id=(select auth.uid()) or exists(select 1 from public.quizzes q where q.id=quiz_id and public.is_class_teacher(q.class_id)) or public.is_admin());
drop policy if exists "students submit own attempts" on public.quiz_attempts;
create policy "students submit own attempts" on public.quiz_attempts for insert to authenticated with check(student_id=(select auth.uid()) and exists(select 1 from public.quizzes q where q.id=quiz_id and public.is_class_member(q.class_id)));
drop policy if exists "students update own attempts" on public.quiz_attempts;
create policy "students update own attempts" on public.quiz_attempts for update to authenticated using(student_id=(select auth.uid()) and score is null) with check(student_id=(select auth.uid()));

DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.direct_messages; EXCEPTION WHEN duplicate_object THEN NULL; WHEN undefined_object THEN NULL; END $$;
