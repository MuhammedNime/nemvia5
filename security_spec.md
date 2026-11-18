# NEMVIA Firestore Security Specification

## 1. Data Invariants
1. **PII Isolation**: User email addresses are stored exclusively in `/users_private/{userId}` and are readable/writable only by `userId == request.auth.uid` or a verified admin (`jamalnama19@gmail.com` or `/admins/{uid}`). Public `/profiles/{userId}` documents contain zero PII.
2. **Role Integrity**: Newly registered users can only create `/profiles/{userId}` with `role` in `['student', 'teacher']`, `is_suspended == false`, and `points == 0`, unless the authenticated verified user matches the bootstrapped admin email `jamalnama19@gmail.com` (`request.auth.token.email_verified == true`). Non-admins can never modify `role` or `is_suspended`.
3. **Quiz Key Protection**: Quiz answer keys in `/quiz_answer_keys/{quizId}` cannot be read by students until their `/quiz_attempts/{quizId}_{studentId}` document exists.
4. **Private Messaging Isolation**: `/direct_messages/{msgId}` documents require `participants` of size 2 containing `[sender_id, recipient_id]` and are strictly readable only by participants or admins.
5. **Membership & Ownership Binding**: Writes to classes, lessons, assignments, quizzes, posts, comments, stories, and live sessions strictly require `teacher_id`/`author_id`/`host_id == request.auth.uid` (verified email) and valid ID paths.
6. **Temporal Integrity**: All `created_at` and `updated_at` fields are enforced to match `request.time` via `serverTimestamp()`.

## 2. Adversarial Payloads ("Dirty Dozen")
1. Self-promotion to `admin` on `/profiles/{uid}` create (`role: 'admin'`) from non-admin email -> **DENIED**.
2. Role escalation on `/profiles/{uid}` update (`affectedKeys: ['role']`) by non-admin -> **DENIED**.
3. Spoofed unverified admin email (`email: 'jamalnama19@gmail.com'`, `email_verified: false`) -> **DENIED**.
4. Reading another user's `/users_private/{otherUid}` -> **DENIED**.
5. Reading another user's `/direct_messages/{msgId}` not in `participants` -> **DENIED**.
6. Reading `/quiz_answer_keys/{quizId}` before creating `/quiz_attempts/{quizId}_{uid}` -> **DENIED**.
7. Shadow update adding ghost field `isVerified: true` on `/posts/{postId}` -> **DENIED**.
8. Resource poisoning with oversized 1.5KB document ID (`isValidId` check) -> **DENIED**.
9. Spoofing `author_id` on `/posts/{postId}` create -> **DENIED**.
10. Client-forged `created_at` timestamp not equal to `request.time` -> **DENIED**.
11. Student grading their own `/submissions/{id}` (`affectedKeys: ['grade']`) -> **DENIED**.
12. Deleting another user's `/comments/{commentId}` without admin privileges -> **DENIED**.
13. Public/anonymous `list` on `/guardian_reports` or `/question_bank` -> **DENIED** (`guardian_reports` allows only exact `get` by 8-16 char code or owner `list`, zero PII).
14. Non-participant reading/writing `/calls/{callId}` or `/calls/{callId}/candidates/{candId}` -> **DENIED**.
15. Student overwriting another student's `/live_attendance/{attId}` without hosting the parent `live_sessions` doc -> **DENIED**.
16. Public/anonymous `list` on `/certificates` or forging another student's `student_id` -> **DENIED** (`certificates` allows only exact `get` by 8-16 char code or owner `list`, zero PII).
17. Writing another user's `/chat_presence/{otherUid}` or `/polls/{pollId}/votes/{otherUid}` -> **DENIED**.
18. Voting with an out-of-range `option_index >= options.size()` on `/polls/{pollId}/votes/{uid}` -> **DENIED**.
19. Non-member creating a `/class_resources/{resId}` inside a class they neither teach nor belong to, or spoofing `uploader_id` -> **DENIED**.
20. Non-teacher creating `/timetable_slots/{slotId}` for another teacher's class, or reading/modifying another student's `/class_attendance/{attId}` -> **DENIED**.
