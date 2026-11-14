// src/lib/questionBank.ts
var keyFor = (userId) => `nemvia-question-bank-${userId || "guest"}`;
function loadQuestionBank(userId) {
	try {
		const raw = localStorage.getItem(keyFor(userId));
		if (!raw) return [];
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
}
function persistQuestionBank(userId, items) {
	try {
		localStorage.setItem(keyFor(userId), JSON.stringify(items.slice(0, 200)));
	} catch {}
}
function saveQuestionsToBank(userId, subject, questions) {
	const existing = loadQuestionBank(userId);
	const existingTexts = new Set(existing.map((x) => `${x.question.type || "mcq"}::${x.question.question.trim()}`));
	const cleanSubject = subject.trim() || "عام";
	const toAdd = [];
	for (const q of questions) {
		const text = (q.question || "").trim();
		if (!text) continue;
		const sig = `${q.type || "mcq"}::${text}`;
		if (existingTexts.has(sig)) continue;
		existingTexts.add(sig);
		toAdd.push({
			id: `bank-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
			subject: q.topic?.trim() || cleanSubject,
			savedAt: (/* @__PURE__ */ new Date()).toISOString(),
			question: {
				...q,
				id: `q-${Math.random().toString(36).slice(2, 8)}`
			}
		});
	}
	const next = [...toAdd, ...existing];
	persistQuestionBank(userId, next);
	return next;
}
function removeQuestionFromBank(userId, bankId) {
	const next = loadQuestionBank(userId).filter((item) => item.id !== bankId);
	persistQuestionBank(userId, next);
	return next;
}
export { removeQuestionFromBank as n, saveQuestionsToBank as r, loadQuestionBank as t };
