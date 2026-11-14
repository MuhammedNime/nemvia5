-- =====================================================================
-- NEMVIA — PATCH 05 (آمن للتكرار / idempotent)
-- شغّله في Supabase → SQL Editor بعد 01 و 02 و 03 و 04
-- يضيف تغذية راجعة نصية وصوتية لكل سؤال على حدة في محاولات الاختبار
-- ويوسّع صيغ الصوت المسموحة في Storage لتسجيلات المتصفح المباشرة.
-- =====================================================================

-- 1) عمود التغذية الراجعة لكل سؤال (question_id -> { text, audio_url, points_awarded })
alter table public.quiz_attempts
  add column if not exists question_feedback jsonb not null default '{}'::jsonb;

-- 2) تحديث دالة تصحيح المعلم لتقبل التغذية الراجعة لكل سؤال على حدة
create or replace function public.grade_quiz_attempt(
  p_attempt_id uuid,
  p_score numeric,
  p_feedback text default '',
  p_question_feedback jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = '' as $$
declare
  v_uid uuid := (select auth.uid());
  v_student uuid;
  v_quiz_title text;
  v_teacher uuid;
begin
  if v_uid is null then raise exception 'Sign in required'; end if;
  select a.student_id, q.title, q.teacher_id
  into v_student, v_quiz_title, v_teacher
  from public.quiz_attempts a
  join public.quizzes q on q.id = a.quiz_id
  where a.id = p_attempt_id;

  if v_student is null then raise exception 'Attempt not found'; end if;
  if v_teacher <> v_uid and not public.is_admin() then
    raise exception 'Only the quiz teacher may grade this attempt';
  end if;

  update public.quiz_attempts
     set score = greatest(0, p_score),
         teacher_feedback = coalesce(p_feedback, ''),
         question_feedback = coalesce(p_question_feedback, '{}'::jsonb),
         needs_manual_grading = false,
         graded_at = now()
   where id = p_attempt_id;

  insert into public.notifications(user_id, actor_id, kind, payload)
  values (
    v_student,
    v_uid,
    'grade',
    jsonb_build_object(
      'title', 'تم تصحيح اختبارك مع تغذية راجعة!',
      'body', 'أضاف معلمك تصحيحاً وتغذية راجعة لاختبار «' || v_quiz_title || '» — الدرجة: ' || p_score::text
    )
  );
end; $$;
grant execute on function public.grade_quiz_attempt(uuid, numeric, text, jsonb) to authenticated;

-- 3) توسيع صيغ الصوت المسموحة في nemvia-files لتسجيلات المتصفح المباشرة (webm / ogg / wav / aac)
update storage.buckets
set allowed_mime_types = array(
  select distinct unnest(
    coalesce(allowed_mime_types, array[]::text[]) ||
    array['audio/webm', 'audio/ogg', 'audio/wav', 'audio/aac', 'audio/x-m4a', 'video/webm']
  )
)
where id = 'nemvia-files';
