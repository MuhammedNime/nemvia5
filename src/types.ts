export type AppRole = 'student' | 'teacher' | 'admin';
export type AccountVisibility = 'public' | 'private';

export interface Profile {
  id: string;
  username: string;
  display_name: string;
  bio: string;
  avatar_url?: string;
  role: AppRole;
  visibility: AccountVisibility;
  points: number;
  streakDays: number;
  joinedDate: string;
  is_suspended?: boolean;
}

export interface MinistryItem {
  id: string;
  owner_id: string;
  owner_name: string;
  name: string;
  region: string;
  description: string;
  join_code: string;
  colorTheme: string;
  members_count: number;
  created_at: string;
}

export interface SchoolItem {
  id: string;
  owner_id: string;
  owner_name: string;
  ministry_id?: string;
  name: string;
  stage: string;
  region: string;
  description: string;
  join_code: string;
  colorTheme: string;
  members_count: number;
  created_at: string;
}

export interface ClassItem {
  id: string;
  teacher_id: string;
  teacher_name: string;
  school_id?: string;
  title: string;
  subject: string;
  grade_level: string;
  join_code: string;
  description: string;
  class_type: 'class' | 'study';
  is_archived: boolean;
  members_count: number;
  colorTheme: string;
  created_at: string;
}

export interface Lesson {
  id: string;
  class_id: string;
  teacher_id: string;
  teacher_name: string;
  title: string;
  content: string;
  video_url?: string;
  duration?: string;
  attachment_url?: string;
  attachment_name?: string;
  position: number;
  published_at: string;
}

export interface Assignment {
  id: string;
  class_id: string;
  class_title: string;
  teacher_id: string;
  teacher_name: string;
  title: string;
  instructions: string;
  due_at: string;
  total_points: number;
  submissions_count: number;
  created_at: string;
}

export interface Submission {
  id: string;
  assignment_id: string;
  student_id: string;
  student_name: string;
  answer_text: string;
  attachment_url?: string;
  submitted_at: string;
  grade?: number;
  teacher_feedback?: string;
  graded_at?: string;
}

export type QuizQuestionType =
  | 'mcq'
  | 'true_false'
  | 'multi_select'
  | 'short_answer'
  | 'fill_blank'
  | 'essay';

export type QuizAnswerValue = number | number[] | string;

export interface QuestionFeedbackItem {
  text?: string;
  audio_url?: string;
  transcript?: string;
  points_awarded?: number;
}

export interface QuizQuestion {
  id: string;
  type?: QuizQuestionType;
  topic?: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  correctOptionIndices?: number[];
  acceptedAnswers?: string[];
  modelAnswer?: string;
  caseSensitive?: boolean;
  explanation: string;
  points: number;
}

export interface QuizAttempt {
  id: string;
  quiz_id: string;
  student_id: string;
  student_name: string;
  answers: Record<string, QuizAnswerValue>;
  score: number;
  totalPoints?: number;
  needsManualGrading?: boolean;
  teacherFeedback?: string;
  questionFeedback?: Record<string, QuestionFeedbackItem>;
  passed?: boolean;
  submitted_at: string;
}

export interface Quiz {
  id: string;
  class_id: string;
  class_title: string;
  title: string;
  description: string;
  timeLimitMinutes: number;
  questions: QuizQuestion[];
  isPublished: boolean;
  attemptsCount: number;
  attempted?: boolean;
  myScore?: number;
  myAnswers?: Record<string, QuizAnswerValue>;
  needsManualGrading?: boolean;
  teacherFeedback?: string;
  questionFeedback?: Record<string, QuestionFeedbackItem>;
  attempts?: QuizAttempt[];
}

export interface PostComment {
  id: string;
  post_id: string;
  author_id: string;
  author_name: string;
  author_avatar?: string;
  body: string;
  created_at: string;
}

export interface Post {
  id: string;
  author_id: string;
  author_name: string;
  author_role: AppRole;
  author_avatar?: string;
  body: string;
  category: 'all' | 'questions' | 'notes' | 'announcements';
  media_url?: string;
  media_type?: 'image' | 'video' | 'document';
  visibility: 'public' | 'followers' | 'private';
  likes_count: number;
  comments_count: number;
  comments: PostComment[];
  is_liked?: boolean;
  is_saved?: boolean;
  created_at: string;
}

export interface Story {
  id: string;
  user_id: string;
  user_name: string;
  user_role: AppRole;
  user_avatar?: string;
  body: string;
  bgGradient: string;
  created_at: string;
  expires_at: string;
}

export interface LiveSession {
  id: string;
  host_id: string;
  host_name: string;
  class_id?: string;
  class_title?: string;
  title: string;
  description: string;
  meeting_url?: string;
  starts_at: string;
  status: 'scheduled' | 'live' | 'ended';
  participants_count: number;
}

export interface ChatAttachment {
  id: string;
  name: string;
  size: string;
  type: 'pdf' | 'image' | 'doc' | 'code';
  url: string;
  uploaded_by: string;
  uploaded_at: string;
}

export interface DirectMessage {
  id: string;
  sender_id: string;
  sender_name: string;
  sender_role?: AppRole;
  recipient_id: string;
  recipient_name: string;
  channel_id?: string;
  body: string;
  attachment?: ChatAttachment;
  reactions?: Record<string, number>;
  created_at: string;
  read_at?: string;
}

export interface StudyGroup {
  id: string;
  name: string;
  description: string;
  category: string;
  avatar_icon: string;
  members_count: number;
  unread_count: number;
  is_official?: boolean;
}

export interface Course {
  id: string;
  owner_id: string;
  owner_name: string;
  title: string;
  description: string;
  category: string;
  lessons_count: number;
  students_count: number;
  rating: number;
  image_url: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  kind: 'academic' | 'social' | 'live' | 'grade';
  created_at: string;
  read: boolean;
}

export interface ContentReport {
  id: string;
  target_id: string;
  target_type: 'post' | 'comment' | 'user' | 'message';
  reporter_name: string;
  reason: string;
  details: string;
  status: 'open' | 'resolved' | 'dismissed';
  created_at: string;
}

export interface ContactInfo {
  id: string;
  name: string;
  role: AppRole;
  avatar_url?: string;
  bio?: string;
  visibility?: AccountVisibility;
  points?: number;
  streakDays?: number;
}

export interface FollowRequestItem {
  id: string;
  requester_id: string;
  requester_name: string;
  requester_avatar?: string;
  requester_role: AppRole;
  target_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
}

export interface ClassMemberInfo {
  class_id: string;
  user_id: string;
  name: string;
  member_role: 'student' | 'assistant';
}
