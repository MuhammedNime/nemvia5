-- =====================================================================
-- NEMVIA — PATCH 04 (آمن للتكرار / idempotent)
-- شغّله في Supabase → SQL Editor بعد 01 و 02 و 03
-- يدعم أنواع الأسئلة المتنوعة (صح/خطأ، اختيار متعدد، إجابات قصيرة، أكمل الفراغ، مقالي)
-- مع تصحيح آلي على السيرفر + مراجعة وتصحيح المعلم للأسئلة المقالية.
-- =====================================================================

-- 1) توسيع جدول الأسئلة ومفاتيح الإجابات ومحاولات الطلاب
alter table public.quiz_questions
  add column if not exists question_type text not null default 'mcq',
  add column if not exists question_config jsonb not null default '{}'::jsonb;

alter table public.quiz_answer_keys
  add column if not exists answer_payload jsonb not null default '{}'::jsonb;

alter table public.quiz_attempts
  add column if not exists needs_manual_grading boolean not null default false,
  add column if not exists teacher_feedback text,
  add column if not exists graded_at timestamptz;

-- 2) دالة مساعدة لتوحيد النصوص العربية والإنجليزية عند المقارنة الآلية
create or replace function public.normalize_quiz_text(p_txt text, p_case_sensitive boolean default false)
returns text language plpgsql immutable set search_path = '' as $$
declare v text := coalesce(trim(p_txt), '');
begin
  v := regexp_replace(v, '\s+', ' ', 'g');
  -- إزالة التشكيل العربي والتطويل وتوحيد الألف والتاء المربوطة
  v := regexp_replace(v, '[\u064B-\u065F\u0670\u0640]', '', 'g');
  v := replace(replace(replace(v, 'أ', 'ا'), 'إ', 'ا'), 'آ', 'ا');
  v := replace(v, 'ة', 'ه');
  v := replace(v, 'ى', 'ي');
  if not coalesce(p_case_sensitive, false) then
    v := lower(v);
  end if;
  return v;
end; $$;

-- 3) تحديث دالة تصحيح الاختبار من السيرفر لدعم جميع الأنواع
create or replace function public.submit_quiz_attempt(p_quiz_id uuid, p_answers jsonb)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_uid uuid := (select auth.uid());
  v_class uuid;
  v_score numeric := 0;
  v_total numeric := 0;
  v_needs_manual boolean := false;
  v_key jsonb := '{}'::jsonb;
  r record;
  v_raw jsonb;
  v_correct_indices int[];
  v_user_indices int[];
  v_accepted text[];
  v_user_text text;
  v_norm_user text;
  v_case_sensitive boolean;
  v_is_correct boolean;
  v_item text;
begin
  if v_uid is null then raise exception 'Sign in required'; end if;
  select class_id into v_class from public.quizzes where id = p_quiz_id and is_published;
  if v_class is null or not public.is_class_member(v_class) then
    raise exception 'Quiz not available';
  end if;
  if exists(select 1 from public.quiz_attempts where quiz_id = p_quiz_id and student_id = v_uid) then
    raise exception 'لقد أجريت هذا الاختبار من قبل';
  end if;

  for r in
    select qq.id, qq.question_type, qq.question_config, qq.points, qq.explanation,
           k.correct_option, k.answer_payload
    from public.quiz_questions qq
    left join public.quiz_answer_keys k on k.question_id = qq.id
    where qq.quiz_id = p_quiz_id
  loop
    v_total := v_total + r.points;
    v_raw := p_answers -> r.id::text;
    v_is_correct := false;

    if coalesce(r.question_type, 'mcq') in ('mcq', 'true_false') then
      if v_raw is not null and jsonb_typeof(v_raw) = 'number' and (v_raw::text)::int = r.correct_option then
        v_is_correct := true;
      elsif v_raw is not null and jsonb_typeof(v_raw) = 'string' and (v_raw #>> '{}') ~ '^-?\d+$' and (v_raw #>> '{}')::int = r.correct_option then
        v_is_correct := true;
      end if;
      if v_is_correct then v_score := v_score + r.points; end if;
      v_key := v_key || jsonb_build_object(r.id::text, jsonb_build_object(
        'type', coalesce(r.question_type, 'mcq'),
        'correct', r.correct_option,
        'explanation', r.explanation,
        'isCorrect', v_is_correct
      ));

    elsif r.question_type = 'multi_select' then
      select coalesce(array_agg(x::int order by x::int), '{}') into v_correct_indices
      from jsonb_array_elements_text(coalesce(r.answer_payload -> 'correctIndices', '[]'::jsonb)) x;

      if v_raw is not null and jsonb_typeof(v_raw) = 'array' then
        select coalesce(array_agg(distinct x::int order by x::int), '{}') into v_user_indices
        from jsonb_array_elements_text(v_raw) x;
      else
        v_user_indices := '{}';
      end if;

      if array_length(v_correct_indices, 1) is not null and v_user_indices = v_correct_indices then
        v_is_correct := true;
        v_score := v_score + r.points;
      end if;
      v_key := v_key || jsonb_build_object(r.id::text, jsonb_build_object(
        'type', 'multi_select',
        'correctIndices', to_jsonb(v_correct_indices),
        'explanation', r.explanation,
        'isCorrect', v_is_correct
      ));

    elsif r.question_type in ('short_answer', 'fill_blank') then
      v_case_sensitive := coalesce((r.question_config ->> 'caseSensitive')::boolean, false);
      v_user_text := coalesce(v_raw #>> '{}', '');
      v_norm_user := public.normalize_quiz_text(v_user_text, v_case_sensitive);

      select coalesce(array_agg(x), '{}') into v_accepted
      from jsonb_array_elements_text(coalesce(r.answer_payload -> 'acceptedAnswers', '[]'::jsonb)) x;

      if v_norm_user <> '' then
        foreach v_item in array v_accepted loop
          if public.normalize_quiz_text(v_item, v_case_sensitive) = v_norm_user then
            v_is_correct := true;
            exit;
          end if;
        end loop;
      end if;

      if v_is_correct then v_score := v_score + r.points; end if;
      v_key := v_key || jsonb_build_object(r.id::text, jsonb_build_object(
        'type', r.question_type,
        'acceptedAnswers', to_jsonb(v_accepted),
        'explanation', r.explanation,
        'isCorrect', v_is_correct
      ));

    elsif r.question_type = 'essay' then
      v_needs_manual := true;
      v_key := v_key || jsonb_build_object(r.id::text, jsonb_build_object(
        'type', 'essay',
        'modelAnswer', coalesce(r.answer_payload ->> 'modelAnswer', ''),
        'explanation', r.explanation,
        'pendingReview', true
      ));
    end if;
  end loop;

  insert into public.quiz_attempts(quiz_id, student_id, answers, score, needs_manual_grading)
  values (p_quiz_id, v_uid, p_answers, v_score, v_needs_manual);

  return jsonb_build_object(
    'score', v_score,
    'total', v_total,
    'needsManualGrading', v_needs_manual,
    'key', v_key
  );
end; $$;
grant execute on function public.submit_quiz_attempt(uuid, jsonb) to authenticated;

-- 4) دالة تصحيح المعلم لمحاولات الاختبار (الأسئلة المقالية أو تعديل الدرجة)
create or replace function public.grade_quiz_attempt(p_attempt_id uuid, p_score numeric, p_feedback text default '')
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
         needs_manual_grading = false,
         graded_at = now()
   where id = p_attempt_id;

  insert into public.notifications(user_id, actor_id, kind, payload)
  values (
    v_student,
    v_uid,
    'grade',
    jsonb_build_object(
      'title', 'تم تصحيح اختبارك!',
      'body', 'تم رصد درجتك في اختبار «' || v_quiz_title || '»: ' || p_score::text || ' درجة.'
    )
  );
end; $$;
grant execute on function public.grade_quiz_attempt(uuid, numeric, text) to authenticated;

-- 5) السماح للمعلم بتحديث محاولات طلابه مباشرة إذا احتاج
drop policy if exists "teachers grade quiz attempts" on public.quiz_attempts;
create policy "teachers grade quiz attempts" on public.quiz_attempts for update to authenticated
using (exists(select 1 from public.quizzes q where q.id = quiz_id and (q.teacher_id = (select auth.uid()) or public.is_admin())))
with check (exists(select 1 from public.quizzes q where q.id = quiz_id and (q.teacher_id = (select auth.uid()) or public.is_admin())));
