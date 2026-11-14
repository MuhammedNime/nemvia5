import { m as resolveApiUrl, r as auth } from "./index-CPo3jDak.js";
// src/lib/ai.ts
async function postAI(path, payload) {
	const headers = { "Content-Type": "application/json" };
	const token = await auth.currentUser?.getIdToken().catch(() => "");
	if (token) headers.Authorization = `Bearer ${token}`;
	const res = await fetch(resolveApiUrl(path), {
		method: "POST",
		headers,
		body: JSON.stringify(payload)
	});
	const data = await res.json().catch(() => ({}));
	if (!res.ok) throw new Error(data?.error || "تعذّر تنفيذ طلب الذكاء الاصطناعي");
	return data;
}
async function askTutor(messages, mode = "explain", context) {
	return (await postAI("/api/ai/tutor", {
		messages,
		mode,
		context
	})).reply;
}
async function generateQuizQuestionsAI(topic, count, types, options) {
	const raw = await postAI("/api/ai/generate-quiz", {
		topic,
		count,
		types,
		mode: options?.mode || "standard",
		sourceFile: options?.sourceFile || null,
		templateFile: options?.templateFile || null
	});
	const validTypes = /* @__PURE__ */ new Set([
		"mcq",
		"true_false",
		"multi_select",
		"short_answer",
		"fill_blank",
		"essay"
	]);
	const questions = (raw.questions || []).map((q, idx) => {
		const qType = validTypes.has(q?.type) ? q.type : "mcq";
		const opts = Array.isArray(q?.options) ? q.options.map(String) : [];
		const safeOpts = qType === "true_false" ? ["صح", "خطأ"] : qType === "mcq" || qType === "multi_select" ? opts.length >= 2 ? opts : [
			"الخيار أ",
			"الخيار ب",
			"الخيار ج",
			"الخيار د"
		] : opts;
		return {
			id: `ai-${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 6)}`,
			type: qType,
			question: String(q?.question || ""),
			topic: String(q?.topic || "").trim(),
			options: safeOpts,
			correctOptionIndex: Math.min(Math.max(0, Number(q?.correctOptionIndex) || 0), Math.max(0, safeOpts.length - 1)),
			correctOptionIndices: Array.isArray(q?.correctOptionIndices) ? q.correctOptionIndices.map((n) => Number(n)).filter((n) => !Number.isNaN(n)) : qType === "multi_select" ? [0] : void 0,
			acceptedAnswers: Array.isArray(q?.acceptedAnswers) ? q.acceptedAnswers.map(String).filter(Boolean) : qType === "short_answer" || qType === "fill_blank" ? [""] : void 0,
			modelAnswer: String(q?.modelAnswer || ""),
			caseSensitive: false,
			explanation: String(q?.explanation || ""),
			points: Math.max(1, Number(q?.points) || (qType === "essay" ? 5 : 1))
		};
	}).filter((q) => q.question.trim().length > 0);
	return {
		title: String(raw.title || ""),
		description: String(raw.description || ""),
		examHeader: raw.examHeader,
		questions
	};
}
async function generateFlashcardsAI(topic, count = 5, category = "math") {
	const res = await postAI("/api/ai/generate-flashcards", {
		topic,
		count,
		category
	});
	const allowedCats = /* @__PURE__ */ new Set([
		"math",
		"physics",
		"cs",
		"english"
	]);
	return (res.cards || []).map((c) => ({
		subject: String(c?.subject || topic),
		front: String(c?.front || ""),
		back: String(c?.back || ""),
		hint: String(c?.hint || ""),
		category: allowedCats.has(c?.category) ? c.category : category
	})).filter((c) => c.front && c.back);
}
async function summarizeLessonAI(title, content) {
	return postAI("/api/ai/lesson-summary", {
		title,
		content
	});
}
async function draftQuestionFeedbackAI(params) {
	return postAI("/api/ai/draft-feedback", params);
}
async function generateStudyPlanAI(params) {
	return postAI("/api/ai/study-plan", params);
}
async function reviewAssignmentAI(params) {
	return postAI("/api/ai/review-assignment", params);
}
async function transcribeAudioAI(params) {
	const res = await postAI("/api/ai/transcribe-audio", params);
	return String(res.transcript || "").trim();
}
async function generateMistakeDrillAI(quizTitle, mistakes) {
	return ((await postAI("/api/ai/mistake-drill", {
		quizTitle,
		mistakes
	})).questions || []).map((q, idx) => {
		const qType = q?.type === "true_false" ? "true_false" : "mcq";
		return {
			id: `drill-${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 6)}`,
			type: qType,
			question: String(q?.question || ""),
			topic: String(q?.topic || "").trim() || void 0,
			options: qType === "true_false" ? ["صح", "خطأ"] : Array.isArray(q?.options) ? q.options.map(String) : [],
			correctOptionIndex: Math.max(0, Number(q?.correctOptionIndex) || 0),
			explanation: String(q?.explanation || ""),
			points: 1
		};
	}).filter((q) => q.question && q.options.length >= 2);
}
async function generateClassInsightsAI(params) {
	return postAI("/api/ai/class-insights", params);
}
export { generateMistakeDrillAI as a, reviewAssignmentAI as c, generateFlashcardsAI as i, summarizeLessonAI as l, draftQuestionFeedbackAI as n, generateQuizQuestionsAI as o, generateClassInsightsAI as r, generateStudyPlanAI as s, askTutor as t, transcribeAudioAI as u };
