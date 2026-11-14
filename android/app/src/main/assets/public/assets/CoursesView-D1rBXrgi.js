import { r as __toESM } from "./rolldown-runtime-SbdDWaPq.js";
import { B as Paperclip, Ct as Clock, Et as CircleX, F as Printer, Ft as ChartColumn, G as MessageSquare, Ht as BookmarkPlus, I as Plus, Kt as Award, N as RefreshCw, Nt as Check, O as Search, Q as LoaderCircle, R as PenLine, W as Mic, Yt as require_react, _ as Square, a as Volume2, at as Image, et as Lightbulb, f as TriangleAlert, ft as Flame, gt as FileText, ht as FileUp, kt as CircleCheck, m as Trash2, n as X, o as Users, p as TrendingUp, tt as Library, u as Upload, v as SquareCheckBig, x as SlidersHorizontal, y as Sparkles, yt as Download } from "./icons-y6mUmdUg.js";
import { h as saveOrShareBlobFile, n as uploadQuizAudioFeedback, t as buildQuizPerformanceReport } from "./index-CPo3jDak.js";
import { a as generateMistakeDrillAI, l as summarizeLessonAI, n as draftQuestionFeedbackAI, o as generateQuizQuestionsAI, r as generateClassInsightsAI, s as generateStudyPlanAI, u as transcribeAudioAI } from "./ai-CHroX9Wo.js";
import { n as removeQuestionFromBank, r as saveQuestionsToBank, t as loadQuestionBank } from "./questionBank-CLFgLnk1.js";
import { t as require_jsx_runtime } from "./react-vendor-CpCOhAWp.js";
// src/lib/wordExport.ts
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
function fileToBase64Payload(file) {
	if (file.size > 12582912) return Promise.reject(/* @__PURE__ */ new Error("حجم الملف أكبر من 12 ميجابايت"));
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => {
			const res = String(reader.result || "");
			resolve({
				base64: res.includes(",") ? res.split(",").pop() || "" : res,
				mimeType: file.type || "application/octet-stream",
				name: file.name
			});
		};
		reader.onerror = () => reject(/* @__PURE__ */ new Error("تعذّر قراءة الملف المحدد"));
		reader.readAsDataURL(file);
	});
}
function escHtml(s) {
	return String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function downloadQuizAsWordDoc(opts) {
	const { title, classTitle = "", ministryName = "وزارة التربية والتعليم / المجمع التعليمي", schoolName = "منصة NEMVIA التعليمية", instructions = "اقرأ كل سؤال بعناية ثم أجب في المكان المخصص.", timeLimitMinutes = 20, questions, withAnswers = false } = opts;
	const totalPoints = questions.reduce((sum, q) => sum + (q.points || 1), 0);
	const letters = [
		"أ",
		"ب",
		"ج",
		"د",
		"هـ",
		"و"
	];
	const dateStr = (/* @__PURE__ */ new Date()).toLocaleDateString("ar");
	const questionsHtml = questions.map((q, idx) => {
		const qType = q.type || "mcq";
		const pts = q.points || 1;
		let answerArea = "";
		if (qType === "mcq" || qType === "multi_select" || qType === "true_false") {
			const list = qType === "true_false" ? ["صح", "خطأ"] : q.options;
			const rows = [];
			for (let i = 0; i < list.length; i += 2) {
				const left = list[i];
				const right = list[i + 1];
				const isAnsL = withAnswers && (qType === "multi_select" ? (q.correctOptionIndices || []).includes(i) : q.correctOptionIndex === i);
				const isAnsR = right !== void 0 && withAnswers && (qType === "multi_select" ? (q.correctOptionIndices || []).includes(i + 1) : q.correctOptionIndex === i + 1);
				rows.push(`
            <tr>
              <td style="width:50%; padding:6px 10px; border:1px solid #cbd5e1; background:${isAnsL ? "#ecfdf5" : "#ffffff"}; font-weight:${isAnsL ? "bold" : "normal"}; color:${isAnsL ? "#065f46" : "#0f172a"};">
                ${qType === "true_false" ? "&#9675;" : `${letters[i] || i + 1})`} ${escHtml(left)} ${isAnsL ? "&#10004;" : ""}
              </td>
              ${right !== void 0 ? `<td style="width:50%; padding:6px 10px; border:1px solid #cbd5e1; background:${isAnsR ? "#ecfdf5" : "#ffffff"}; font-weight:${isAnsR ? "bold" : "normal"}; color:${isAnsR ? "#065f46" : "#0f172a"};">
                      ${qType === "true_false" ? "&#9675;" : `${letters[i + 1] || i + 2})`} ${escHtml(right)} ${isAnsR ? "&#10004;" : ""}
                    </td>` : `<td style="width:50%; border:none;"></td>`}
            </tr>
          `);
			}
			answerArea = `<table dir="rtl" style="width:100%; border-collapse:collapse; margin-top:8px; font-size:11pt;">${rows.join("")}</table>`;
		} else if (qType === "short_answer" || qType === "fill_blank") {
			if (withAnswers) answerArea = `<div style="margin-top:8px; padding:8px 12px; background:#ecfdf5; border:1px solid #6ee7b7; color:#065f46; font-weight:bold; font-size:10.5pt;">الإجابة المعتمدة: ${escHtml((q.acceptedAnswers || []).join(" / ") || "—")}</div>`;
			else answerArea = `<div style="margin-top:12px; border-bottom:1px dashed #64748b; height:22px;"></div>`;
		} else if (withAnswers) answerArea = `<div style="margin-top:8px; padding:10px 12px; background:#ecfdf5; border:1px solid #6ee7b7; color:#065f46; font-size:10.5pt; white-space:pre-line;"><b>الإجابة النموذجية:</b> ${escHtml(q.modelAnswer || "تُقدّر حسب إجابة الطالب")}</div>`;
		else answerArea = `
            <div style="margin-top:10px; border-bottom:1px dashed #94a3b8; height:22px;"></div>
            <div style="margin-top:6px; border-bottom:1px dashed #94a3b8; height:22px;"></div>
            <div style="margin-top:6px; border-bottom:1px dashed #94a3b8; height:22px;"></div>
          `;
		const explanationBlock = withAnswers && q.explanation ? `<div style="margin-top:6px; font-size:10pt; color:#334155;"><b>التفسير العلمي:</b> ${escHtml(q.explanation)}</div>` : "";
		return `
        <div style="margin-bottom:16px; padding-bottom:12px; border-bottom:1px solid #e2e8f0; page-break-inside:avoid;">
          <table dir="rtl" style="width:100%; border-collapse:collapse;">
            <tr>
              <td style="font-size:12pt; font-weight:bold; color:#0f172a; line-height:1.6;">
                س${idx + 1}: ${escHtml(q.question).replace(/\n/g, "<br/>")}
              </td>
              <td style="width:90px; text-align:left; font-size:10pt; font-weight:bold; color:#1677c7; white-space:nowrap; vertical-align:top;">
                (${pts} ${pts === 1 ? "درجة" : "درجات"})
              </td>
            </tr>
          </table>
          ${answerArea}
          ${explanationBlock}
        </div>
      `;
	}).join("");
	const html = `
<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:w="urn:schemas-microsoft-com:office:word"
      xmlns="http://www.w3.org/TR/REC-html40"
      dir="rtl" lang="ar">
<head>
<meta charset="utf-8" />
<title>${escHtml(title)}</title>
<!--[if gte mso 9]>
<xml>
  <w:WordDocument>
    <w:View>Print</w:View>
    <w:Zoom>100</w:Zoom>
    <w:DoNotOptimizeForBrowser/>
  </w:WordDocument>
</xml>
<![endif]-->
<style>
  @page {
    size: A4 portrait;
    margin: 1.8cm 1.8cm 1.8cm 1.8cm;
  }
  body {
    font-family: 'Cairo', 'Simplified Arabic', 'Arial', sans-serif;
    direction: rtl;
    text-align: right;
    color: #0f172a;
    margin: 0;
    padding: 0;
  }
</style>
</head>
<body>
  <!-- Official 3-column Letterhead -->
  <table dir="rtl" style="width:100%; border-collapse:collapse; border:2px solid #0f233a; margin-bottom:14px;">
    <tr>
      <td style="width:34%; padding:10px 12px; vertical-align:top; border-left:1px solid #cbd5e1; font-size:10.5pt; line-height:1.6;">
        <div style="font-weight:bold; color:#0f233a;">${escHtml(ministryName)}</div>
        <div style="font-weight:bold; color:#1677c7;">${escHtml(schoolName)}</div>
        ${classTitle ? `<div>المادة / الصف: ${escHtml(classTitle)}</div>` : ""}
      </td>
      <td style="width:32%; padding:10px; text-align:center; vertical-align:middle; border-left:1px solid #cbd5e1; background:#f8fafc;">
        <div style="font-size:13pt; font-weight:bold; color:#0f233a;">${escHtml(title)}</div>
        <div style="font-size:9.5pt; color:#475569; margin-top:4px;">${withAnswers ? "نموذج الإجابة المعتمد للمعلم" : "ورقة أسئلة الطالب"}</div>
      </td>
      <td style="width:34%; padding:10px 12px; vertical-align:top; font-size:10.5pt; line-height:1.6;">
        <div><b>الزمن المحدد:</b> ${timeLimitMinutes} دقيقة</div>
        <div><b>الدرجة الكاملة:</b> ${totalPoints} درجة</div>
        <div><b>التاريخ:</b> ${escHtml(dateStr)}</div>
      </td>
    </tr>
  </table>

  ${!withAnswers ? `<table dir="rtl" style="width:100%; border-collapse:collapse; border:1px solid #94a3b8; background:#f8fafc; margin-bottom:14px; font-size:10.5pt;">
          <tr>
            <td style="padding:8px 12px; border-left:1px solid #cbd5e1; width:45%;"><b>اسم الطالب/ـة:</b> ........................................</td>
            <td style="padding:8px 12px; border-left:1px solid #cbd5e1; width:30%;"><b>الشعبة:</b> ......................</td>
            <td style="padding:8px 12px; width:25%;"><b>الدرجة:</b> ....... / ${totalPoints}</td>
          </tr>
        </table>` : ""}

  ${instructions ? `<div style="margin-bottom:14px; padding:7px 12px; background:#eff6ff; border-right:3px solid #1677c7; font-size:10pt; color:#1e3a8a;">
          <b>تعليمات الاختبار:</b> ${escHtml(instructions)}
        </div>` : ""}

  <!-- Questions Section -->
  <div>
    ${questionsHtml}
  </div>

  <div style="margin-top:20px; text-align:center; font-size:9.5pt; color:#64748b; border-top:1px solid #cbd5e1; padding-top:8px;">
    انتهت الأسئلة مع تمنياتنا بالنجاح والتوفيق — تم الإعداد عبر منصة NEMVIA التعليمية
  </div>
</body>
</html>`.trim();
	const blob = new Blob(["﻿", html], { type: "application/msword;charset=utf-8" });
	const filename = `${(title || "exam").replace(/[^\w\u0600-\u06FF-]+/g, "_")}${withAnswers ? "_نموذج_الحل" : ""}.doc`;
	saveOrShareBlobFile(blob, filename);
}
// src/components/ContentBuilder.tsx
var import_jsx_runtime = require_jsx_runtime();
var field = "w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#1677c7] focus:bg-white";
function toEmbed(url) {
	const u = url.trim();
	if (!u) return "";
	const m = u.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{6,})/);
	return m ? `https://www.youtube.com/embed/${m[1]}` : u;
}
var Shell = ({ title, onClose, onSubmit, children, busy }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: "fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4",
	dir: "rtl",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit,
		className: "bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-black text-slate-900",
					children: title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onClose,
					className: "p-1 text-slate-400 hover:text-slate-700 cursor-pointer",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
				})]
			}),
			children,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "submit",
				disabled: busy,
				className: "w-full py-3 bg-[#1677c7] hover:bg-[#125fa0] disabled:opacity-60 text-white font-black rounded-xl text-sm cursor-pointer flex items-center justify-center gap-2",
				children: [busy && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-4 h-4 animate-spin" }), " نشر"]
			})
		]
	})
});
var LessonBuilderModal = ({ classes, teacherName, onClose, onSubmit, onUpload }) => {
	const [classId, setClassId] = (0, import_react.useState)(classes[0]?.id || "");
	const [title, setTitle] = (0, import_react.useState)("");
	const [content, setContent] = (0, import_react.useState)("");
	const [video, setVideo] = (0, import_react.useState)("");
	const [duration, setDuration] = (0, import_react.useState)("");
	const [file, setFile] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const pick = async (e) => {
		const f = e.target.files?.[0];
		if (!f) return;
		setBusy(true);
		try {
			setFile(await onUpload(f, "lessons"));
		} catch {}
		setBusy(false);
	};
	const submit = (e) => {
		e.preventDefault();
		if (!classId || !title.trim()) return;
		onSubmit({
			id: "new",
			class_id: classId,
			teacher_id: "",
			teacher_name: teacherName,
			title: title.trim(),
			content: content.trim(),
			video_url: toEmbed(video) || void 0,
			duration: duration.trim() || void 0,
			attachment_url: file?.url,
			attachment_name: file?.name,
			position: 0,
			published_at: (/* @__PURE__ */ new Date()).toISOString()
		});
		onClose();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, {
		title: "إضافة درس جديد",
		onClose,
		onSubmit: submit,
		busy,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
				value: classId,
				onChange: (e) => setClassId(e.target.value),
				className: field,
				required: true,
				children: classes.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: c.id,
					children: c.title
				}, c.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				value: title,
				onChange: (e) => setTitle(e.target.value),
				placeholder: "عنوان الدرس",
				className: field,
				required: true,
				maxLength: 150
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
				value: content,
				onChange: (e) => setContent(e.target.value),
				placeholder: "شرح الدرس…",
				rows: 6,
				className: field
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid sm:grid-cols-2 gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: video,
					onChange: (e) => setVideo(e.target.value),
					placeholder: "رابط فيديو يوتيوب (اختياري)",
					className: field,
					dir: "ltr"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: duration,
					onChange: (e) => setDuration(e.target.value),
					placeholder: "المدة (مثال: 20 دقيقة)",
					className: field
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex items-center gap-2 p-2.5 border border-dashed border-slate-300 rounded-xl text-xs font-bold text-slate-600 cursor-pointer hover:bg-slate-50",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paperclip, { className: "w-4 h-4" }),
					" ",
					file ? file.name : "إرفاق ملف (PDF / مستند — حتى 10MB)",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "file",
						className: "hidden",
						onChange: pick
					})
				]
			})
		]
	});
};
var QUIZ_TYPE_META = {
	mcq: {
		label: "اختيار من متعدد",
		badge: "اختيار واحد",
		hint: "اختر الإجابة الصحيحة من الخيارات"
	},
	true_false: {
		label: "صح أم خطأ",
		badge: "صح / خطأ",
		hint: "حدد هل العبارة صحيحة أم خاطئة"
	},
	multi_select: {
		label: "اختيار أكثر من إجابة",
		badge: "تحديد متعدد",
		hint: "حدّد كل الإجابات الصحيحة (إجابتان فأكثر)"
	},
	short_answer: {
		label: "إجابة قصيرة (كتابة)",
		badge: "كتابة قصيرة",
		hint: "يكتب الطالب الإجابة وتُصحَّح تلقائياً"
	},
	fill_blank: {
		label: "أكمل الفراغ",
		badge: "أكمل الفراغ",
		hint: "استخدم ___ مكان الفراغ في نص السؤال"
	},
	essay: {
		label: "سؤال مقالي / كتابي",
		badge: "تصحيح المعلم",
		hint: "يكتب الطالب فقرة مفصلة ويراجعها المعلم"
	}
};
var blankQ = (type = "mcq") => ({
	id: Math.random().toString(36).slice(2),
	type,
	question: "",
	options: type === "true_false" ? ["صح", "خطأ"] : type === "mcq" || type === "multi_select" ? [
		"",
		"",
		"",
		""
	] : [],
	correctOptionIndex: 0,
	correctOptionIndices: type === "multi_select" ? [0] : void 0,
	acceptedAnswers: type === "short_answer" || type === "fill_blank" ? [""] : void 0,
	modelAnswer: "",
	caseSensitive: false,
	explanation: "",
	topic: "",
	points: type === "essay" ? 5 : 1
});
var QuizBuilderModal = ({ classes, onClose, onSubmit, userId = "", initialTitle = "", initialQuestions }) => {
	const [classId, setClassId] = (0, import_react.useState)(classes[0]?.id || "");
	const [title, setTitle] = (0, import_react.useState)(initialTitle);
	const [desc, setDesc] = (0, import_react.useState)("");
	const [minutes, setMinutes] = (0, import_react.useState)(15);
	const [qs, setQs] = (0, import_react.useState)(() => initialQuestions && initialQuestions.length > 0 ? initialQuestions.map((q) => ({
		...q,
		id: `q-${Math.random().toString(36).slice(2, 8)}`
	})) : [blankQ("mcq")]);
	const [error, setError] = (0, import_react.useState)("");
	const [aiOpen, setAiOpen] = (0, import_react.useState)(true);
	const [aiTopic, setAiTopic] = (0, import_react.useState)("");
	const [aiCount, setAiCount] = (0, import_react.useState)(5);
	const [aiTypes, setAiTypes] = (0, import_react.useState)([
		"mcq",
		"true_false",
		"short_answer",
		"fill_blank"
	]);
	const [aiBusy, setAiBusy] = (0, import_react.useState)(false);
	const [aiErr, setAiErr] = (0, import_react.useState)("");
	const [sourceFile, setSourceFile] = (0, import_react.useState)(null);
	const [templateFile, setTemplateFile] = (0, import_react.useState)(null);
	const [examHeader, setExamHeader] = (0, import_react.useState)(null);
	const [bankOpen, setBankOpen] = (0, import_react.useState)(false);
	const [bankItems, setBankItems] = (0, import_react.useState)(() => loadQuestionBank(userId));
	const [bankSelected, setBankSelected] = (0, import_react.useState)([]);
	const [savedQIds, setSavedQIds] = (0, import_react.useState)({});
	const toggleBankPick = (id) => {
		setBankSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
	};
	const importFromBank = () => {
		const picked = bankItems.filter((b) => bankSelected.includes(b.id));
		if (!picked.length) return;
		const clones = picked.map((b) => ({
			...b.question,
			id: `q-${Math.random().toString(36).slice(2, 8)}`
		}));
		setQs((prev) => {
			return prev.length === 1 && !prev[0].question.trim() ? clones : [...prev, ...clones];
		});
		setBankSelected([]);
		setBankOpen(false);
	};
	const handleSaveOneToBank = (q) => {
		if (!q.question.trim()) return;
		const subj = classes.find((c) => c.id === classId)?.subject || title.trim() || "عام";
		const next = saveQuestionsToBank(userId, subj, [q]);
		setBankItems(next);
		setSavedQIds((prev) => ({
			...prev,
			[q.id]: true
		}));
	};
	const toggleAiType = (t) => {
		setAiTypes((prev) => prev.includes(t) ? prev.length > 1 ? prev.filter((x) => x !== t) : prev : [...prev, t]);
	};
	const pickAiFile = async (e, target) => {
		const f = e.target.files?.[0];
		e.target.value = "";
		if (!f) return;
		setAiErr("");
		try {
			const payload = await fileToBase64Payload(f);
			if (target === "source") setSourceFile(payload);
			else setTemplateFile(payload);
		} catch (err) {
			setAiErr(err?.message || "تعذّر قراءة الملف");
		}
	};
	const handleGenerateQuizAI = async () => {
		if (!aiTopic.trim() && !sourceFile && !templateFile || aiBusy) return;
		setAiErr("");
		setAiBusy(true);
		try {
			const res = await generateQuizQuestionsAI(aiTopic, aiCount, aiTypes, {
				mode: templateFile ? "word_template" : sourceFile ? "from_media" : "standard",
				sourceFile,
				templateFile
			});
			if (res.title && !title.trim()) setTitle(res.title);
			if (res.description && !desc.trim()) setDesc(res.description);
			if (res.examHeader) setExamHeader(res.examHeader);
			if (res.questions.length > 0) {
				setQs(res.questions);
				setAiOpen(false);
			} else setAiErr("لم يتم توليد أسئلة، جرّب توضيح الموضوع أو إرفاق ملف أوضح.");
		} catch (err) {
			setAiErr(err?.message || "تعذّر توليد الاختبار");
		} finally {
			setAiBusy(false);
		}
	};
	const handleExportBuilderWord = (withAnswers) => {
		const validQs = qs.filter((q) => q.question.trim());
		if (!validQs.length) return;
		const selectedClass = classes.find((c) => c.id === classId);
		downloadQuizAsWordDoc({
			title: title.trim() || "اختبار دراسي",
			classTitle: selectedClass?.title || examHeader?.subject || "",
			ministryName: examHeader?.institution || "وزارة التربية والتعليم / المجمع التعليمي",
			schoolName: "منصة NEMVIA التعليمية",
			instructions: examHeader?.instructions || desc.trim() || "اقرأ كل سؤال بعناية ثم أجب في المكان المخصص.",
			timeLimitMinutes: Math.max(1, minutes),
			questions: validQs,
			withAnswers
		});
	};
	const upd = (i, patch) => setQs((list) => list.map((q, k) => k === i ? {
		...q,
		...patch
	} : q));
	const switchType = (i, nextType) => {
		setQs((list) => list.map((q, k) => {
			if (k !== i) return q;
			return {
				...blankQ(nextType),
				id: q.id,
				question: q.question,
				explanation: q.explanation,
				topic: q.topic || "",
				points: q.points,
				options: nextType === "true_false" ? ["صح", "خطأ"] : nextType === "mcq" || nextType === "multi_select" ? q.options.length >= 2 && q.type !== "true_false" ? q.options : [
					"",
					"",
					"",
					""
				] : []
			};
		}));
	};
	const updOpt = (i, j, v) => setQs((list) => list.map((q, k) => k === i ? {
		...q,
		options: q.options.map((o, x) => x === j ? v : o)
	} : q));
	const addOpt = (i) => setQs((list) => list.map((q, k) => k === i && q.options.length < 6 ? {
		...q,
		options: [...q.options, ""]
	} : q));
	const removeOpt = (i, j) => setQs((list) => list.map((q, k) => {
		if (k !== i || q.options.length <= 2) return q;
		const nextOpts = q.options.filter((_, x) => x !== j);
		const nextCorrect = q.correctOptionIndex >= nextOpts.length ? 0 : q.correctOptionIndex;
		const nextIndices = (q.correctOptionIndices || []).filter((idx) => idx !== j).map((idx) => idx > j ? idx - 1 : idx);
		return {
			...q,
			options: nextOpts,
			correctOptionIndex: nextCorrect,
			correctOptionIndices: nextIndices.length ? nextIndices : [0]
		};
	}));
	const toggleMulti = (i, j) => setQs((list) => list.map((q, k) => {
		if (k !== i) return q;
		const cur = new Set(q.correctOptionIndices || []);
		if (cur.has(j)) cur.delete(j);
		else cur.add(j);
		return {
			...q,
			correctOptionIndices: [...cur].sort((a, b) => a - b)
		};
	}));
	const submit = (e) => {
		e.preventDefault();
		setError("");
		if (!classId || !title.trim()) return;
		const prepared = [];
		for (let idx = 0; idx < qs.length; idx++) {
			const q = qs[idx];
			const qType = q.type || "mcq";
			const num = idx + 1;
			if (!q.question.trim()) {
				setError(`السؤال رقم ${num} يحتاج نصاً.`);
				return;
			}
			if (qType === "true_false") prepared.push({
				...q,
				type: "true_false",
				question: q.question.trim(),
				options: ["صح", "خطأ"],
				correctOptionIndex: q.correctOptionIndex === 1 ? 1 : 0
			});
			else if (qType === "mcq") {
				const keep = q.options.map((o, i) => ({
					o: o.trim(),
					i
				})).filter((x) => x.o);
				if (keep.length < 2) {
					setError(`السؤال رقم ${num} يحتاج خيارين على الأقل.`);
					return;
				}
				const mappedIdx = keep.findIndex((x) => x.i === q.correctOptionIndex);
				if (mappedIdx === -1) {
					setError(`السؤال رقم ${num}: الإجابة الصحيحة يجب أن تكون خياراً غير فارغ.`);
					return;
				}
				prepared.push({
					...q,
					type: "mcq",
					question: q.question.trim(),
					options: keep.map((x) => x.o),
					correctOptionIndex: mappedIdx
				});
			} else if (qType === "multi_select") {
				const keep = q.options.map((o, i) => ({
					o: o.trim(),
					i
				})).filter((x) => x.o);
				if (keep.length < 2) {
					setError(`السؤال رقم ${num} يحتاج خيارين على الأقل.`);
					return;
				}
				const mappedIndices = (q.correctOptionIndices || []).map((origIdx) => keep.findIndex((x) => x.i === origIdx)).filter((x) => x !== -1);
				if (mappedIndices.length === 0) {
					setError(`السؤال رقم ${num}: حدد إجابة صحيحة واحدة على الأقل.`);
					return;
				}
				prepared.push({
					...q,
					type: "multi_select",
					question: q.question.trim(),
					options: keep.map((x) => x.o),
					correctOptionIndex: mappedIndices[0],
					correctOptionIndices: [...new Set(mappedIndices)].sort((a, b) => a - b)
				});
			} else if (qType === "short_answer" || qType === "fill_blank") {
				const parsed = (q.acceptedAnswers || []).join("\n").split(/[\n،,;|]+/).map((s) => s.trim()).filter(Boolean);
				if (parsed.length === 0) {
					setError(`السؤال رقم ${num}: أضف إجابة صحيحة مقبولة واحدة على الأقل.`);
					return;
				}
				prepared.push({
					...q,
					type: qType,
					question: q.question.trim(),
					options: [],
					correctOptionIndex: 0,
					acceptedAnswers: parsed
				});
			} else prepared.push({
				...q,
				type: "essay",
				question: q.question.trim(),
				topic: (q.topic || "").trim() || void 0,
				options: [],
				correctOptionIndex: 0,
				modelAnswer: (q.modelAnswer || "").trim()
			});
		}
		const cleanedPrepared = prepared.map((item) => ({
			...item,
			topic: (item.topic || "").trim() || void 0
		}));
		onSubmit({
			id: "new",
			class_id: classId,
			class_title: "",
			title: title.trim(),
			description: desc.trim(),
			timeLimitMinutes: Math.max(1, minutes),
			isPublished: true,
			attemptsCount: 0,
			questions: cleanedPrepared
		});
		onClose();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, {
		title: "إنشاء اختبار متنوع ومتكامل",
		onClose,
		onSubmit: submit,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
				value: classId,
				onChange: (e) => setClassId(e.target.value),
				className: field,
				required: true,
				children: classes.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: c.id,
					children: c.title
				}, c.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				value: title,
				onChange: (e) => setTitle(e.target.value),
				placeholder: "عنوان الاختبار",
				className: field,
				required: true,
				maxLength: 150
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid sm:grid-cols-3 gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: desc,
					onChange: (e) => setDesc(e.target.value),
					placeholder: "وصف أو تعليمات الاختبار",
					className: `${field} sm:col-span-2`
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "number",
						min: 1,
						max: 180,
						value: minutes,
						onChange: (e) => setMinutes(Number(e.target.value)),
						className: field,
						title: "المدة بالدقائق"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "absolute left-3 top-2.5 text-[10px] text-slate-400 font-bold",
						children: "دقيقة"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-3.5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-xs font-black text-slate-900 flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-3.5 h-3.5 text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "توليد أسئلة الاختبار بالذكاء الاصطناعي" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setAiOpen((v) => !v),
						className: "text-[11px] font-bold text-[#1677c7] hover:underline cursor-pointer",
						children: aiOpen ? "إخفاء" : "فتح المولّد الذكي"
					})]
				}), aiOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3 pt-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: aiTopic,
							onChange: (e) => setAiTopic(e.target.value),
							rows: 2,
							placeholder: "اكتب موضوع الاختبار أو طلبك للذكاء (مثال: أنشئ اختباراً على نمط الملف المرفق مع 5 أسئلة متنوعة)...",
							className: field
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid sm:grid-cols-2 gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-2.5 bg-white border border-slate-200 rounded-xl space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[11px] font-bold text-slate-700 flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "w-3.5 h-3.5 text-[#1677c7]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "صورة / ملف الدرس المصدر (اختياري)" })]
								}), sourceFile ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-2 bg-sky-50 border border-sky-200 rounded-lg px-2 py-1 text-[11px]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate font-bold text-[#0f233a]",
										children: sourceFile.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setSourceFile(null),
										className: "text-rose-600 font-bold cursor-pointer",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-3.5 h-3.5" })
									})]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex items-center justify-center gap-1.5 py-1.5 px-2 border border-dashed border-slate-300 hover:border-[#1677c7] rounded-lg text-[11px] font-bold text-slate-600 cursor-pointer hover:bg-slate-50",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileUp, { className: "w-3.5 h-3.5 text-[#1677c7]" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "رفع صورة كتاب / PDF / Word" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "file",
											accept: "image/*,.pdf,.docx,.doc,.txt",
											className: "hidden",
											onChange: (e) => void pickAiFile(e, "source")
										})
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-2.5 bg-white border border-slate-200 rounded-xl space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[11px] font-bold text-slate-700 flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "w-3.5 h-3.5 text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "على نمط ملف وورد / نموذج اختبار (اختياري)" })]
								}), templateFile ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-2 bg-emerald-50 border border-emerald-200 rounded-lg px-2 py-1 text-[11px]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate font-bold text-emerald-900",
										children: templateFile.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setTemplateFile(null),
										className: "text-rose-600 font-bold cursor-pointer",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-3.5 h-3.5" })
									})]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex items-center justify-center gap-1.5 py-1.5 px-2 border border-dashed border-slate-300 hover:border-emerald-600 rounded-lg text-[11px] font-bold text-slate-600 cursor-pointer hover:bg-slate-50",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileUp, { className: "w-3.5 h-3.5 text-emerald-600" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "رفع قالب Word (.docx) أو صورة نموذج" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "file",
											accept: ".docx,.doc,.pdf,image/*,.txt",
											className: "hidden",
											onChange: (e) => void pickAiFile(e, "template")
										})
									]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap items-center gap-1.5",
								children: Object.keys(QUIZ_TYPE_META).map((t) => {
									const active = aiTypes.includes(t);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => toggleAiType(t),
										className: `px-2 py-1 rounded-lg text-[10px] font-bold border cursor-pointer transition-colors ${active ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200"}`,
										children: QUIZ_TYPE_META[t].badge
									}, t);
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									value: aiCount,
									onChange: (e) => setAiCount(Number(e.target.value)),
									className: "p-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold",
									children: [
										3,
										5,
										8,
										10,
										15
									].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
										value: n,
										children: [n, " أسئلة"]
									}, n))
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									disabled: aiBusy || !aiTopic.trim() && !sourceFile && !templateFile,
									onClick: handleGenerateQuizAI,
									className: "px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer",
									children: [aiBusy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: aiBusy ? "جاري التوليد..." : "توليد الآن" })]
								})]
							})]
						}),
						aiErr && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] font-bold text-rose-600",
							children: aiErr
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-3.5 rounded-2xl border border-slate-200 bg-white space-y-2.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-xs font-black text-slate-900 flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Library, { className: "w-3.5 h-3.5 text-[#1677c7]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							"استيراد من بنك الأسئلة المحفوظ (",
							bankItems.length,
							")"
						] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							setBankItems(loadQuestionBank(userId));
							setBankOpen((v) => !v);
						},
						className: "text-[11px] font-bold text-[#1677c7] hover:underline cursor-pointer",
						children: bankOpen ? "إغلاق البنك" : "تصفح البنك"
					})]
				}), bankOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2.5 pt-1",
					children: bankItems.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] text-slate-500",
						children: "بنك الأسئلة فارغ حالياً. يمكنك حفظ أي سؤال بالضغط على «حفظ بالبنك» أو استيراد أسئلة اختباراتك السابقة من تبويب الاختبارات."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "max-h-44 overflow-y-auto space-y-1.5 pr-1",
						children: bankItems.map((item) => {
							const checked = bankSelected.includes(item.id);
							const qType = item.question.type || "mcq";
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: `flex items-start gap-2 p-2 rounded-xl border text-xs cursor-pointer transition-colors ${checked ? "bg-sky-50 border-[#1677c7]" : "bg-slate-50 border-slate-200 hover:bg-slate-100"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked,
									onChange: () => toggleBankPick(item.id),
									className: "mt-0.5 accent-[#1677c7]"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1 min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-bold text-slate-800 line-clamp-1",
										children: item.question.question
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[10px] text-slate-500",
										children: [
											item.subject,
											" · ",
											QUIZ_TYPE_META[qType]?.badge || qType,
											" · ",
											item.question.points,
											" نقطة"
										]
									})]
								})]
							}, item.id);
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						disabled: bankSelected.length === 0,
						onClick: importFromBank,
						className: "px-3 py-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white rounded-xl text-xs font-bold cursor-pointer",
						children: [
							"إدراج المحدد (",
							bankSelected.length,
							") في الاختبار"
						]
					})] })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-3",
				children: qs.map((q, i) => {
					const qType = q.type || "mcq";
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-3.5 border border-slate-200 rounded-2xl space-y-2.5 bg-slate-50/70",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs font-black text-slate-800",
										children: ["السؤال ", i + 1]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
										value: qType,
										onChange: (e) => switchType(i, e.target.value),
										className: "px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-[11px] font-bold text-[#1677c7] outline-none cursor-pointer",
										children: Object.keys(QUIZ_TYPE_META).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: t,
											children: QUIZ_TYPE_META[t].label
										}, t))
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] text-slate-500",
											children: QUIZ_TYPE_META[qType].hint
										}),
										q.question.trim() && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => handleSaveOneToBank(q),
											className: `text-[10px] font-bold px-2 py-0.5 rounded-md border flex items-center gap-1 cursor-pointer ${savedQIds[q.id] ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-white text-slate-600 border-slate-200 hover:border-[#1677c7] hover:text-[#1677c7]"}`,
											title: "حفظ هذا السؤال في بنك الأسئلة لإعادة استخدامه",
											children: [savedQIds[q.id] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-3 h-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookmarkPlus, { className: "w-3 h-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: savedQIds[q.id] ? "محفوظ" : "للبنك" })]
										}),
										qs.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => setQs((l) => l.filter((_, k) => k !== i)),
											className: "text-rose-500 hover:text-rose-700 cursor-pointer",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3.5 h-3.5" })
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-1.5",
								children: qType === "fill_blank" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
										value: q.question,
										onChange: (e) => upd(i, { question: e.target.value }),
										placeholder: "مثال: عاصمة المملكة العربية السعودية هي ___ وتقع في وسط شبه الجزيرة.",
										rows: 2,
										className: field
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => upd(i, { question: `${q.question}${q.question.endsWith(" ") || !q.question ? "" : " "}___ ` }),
										className: "text-[10px] font-bold px-2 py-0.5 bg-sky-100 text-[#1677c7] rounded-md cursor-pointer",
										children: "+ إدراج فراغ (___)"
									})]
								}) : qType === "essay" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									value: q.question,
									onChange: (e) => upd(i, { question: e.target.value }),
									placeholder: "اكتب نص السؤال المقالي أو المسألة التي تتطلب شرحاً أو حلاً مكتوباً...",
									rows: 2,
									className: field
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: q.question,
									onChange: (e) => upd(i, { question: e.target.value }),
									placeholder: "نص السؤال",
									className: field
								})
							}),
							qType === "true_false" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-2 gap-2",
								children: ["صح", "خطأ"].map((lbl, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => upd(i, { correctOptionIndex: idx }),
									className: `py-2.5 px-3 rounded-xl border text-xs font-black cursor-pointer transition-all ${q.correctOptionIndex === idx ? idx === 0 ? "bg-emerald-50 border-emerald-500 text-emerald-700" : "bg-rose-50 border-rose-500 text-rose-700" : "bg-white border-slate-200 text-slate-600"}`,
									children: [
										q.correctOptionIndex === idx ? "✓ " : "",
										lbl,
										" ",
										q.correctOptionIndex === idx ? "(الإجابة الصحيحة)" : ""
									]
								}, lbl))
							}),
							(qType === "mcq" || qType === "multi_select") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [q.options.map((o, j) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [
										qType === "mcq" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "radio",
											name: `c-${q.id}`,
											checked: q.correctOptionIndex === j,
											onChange: () => upd(i, { correctOptionIndex: j }),
											className: "accent-emerald-500 cursor-pointer",
											title: "الإجابة الصحيحة"
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "checkbox",
											checked: (q.correctOptionIndices || []).includes(j),
											onChange: () => toggleMulti(i, j),
											className: "accent-emerald-500 cursor-pointer",
											title: "إجابة صحيحة"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											value: o,
											onChange: (e) => updOpt(i, j, e.target.value),
											placeholder: `الخيار ${j + 1}`,
											className: field
										}),
										q.options.length > 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => removeOpt(i, j),
											className: "text-slate-400 hover:text-rose-500 cursor-pointer text-xs px-1",
											title: "حذف الخيار",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-3.5 h-3.5" })
										})
									]
								}, j)), q.options.length < 6 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => addOpt(i),
									className: "text-[11px] font-bold text-[#1677c7] hover:underline cursor-pointer",
									children: "+ إضافة خيار آخر"
								})]
							}),
							(qType === "short_answer" || qType === "fill_blank") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5 bg-white p-2.5 rounded-xl border border-slate-200",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-[11px] font-bold text-slate-700",
										children: "الإجابات الصحيحة المقبولة (يمكنك وضع أكثر من صيغة مفصولة بفاصلة أو بسطر جديد):"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
										value: (q.acceptedAnswers || []).join("، "),
										onChange: (e) => upd(i, { acceptedAnswers: [e.target.value] }),
										placeholder: "مثال: الرياض، مدينة الرياض",
										rows: 2,
										className: field
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "flex items-center gap-2 text-[11px] text-slate-600 cursor-pointer",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "checkbox",
											checked: !!q.caseSensitive,
											onChange: (e) => upd(i, { caseSensitive: e.target.checked }),
											className: "accent-[#1677c7]"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "مطابقة حساسة لحالة الأحرف (للإنجليزية/الرموز البرمجية)" })]
									})
								]
							}),
							qType === "essay" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1 bg-white p-2.5 rounded-xl border border-slate-200",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-[11px] font-bold text-slate-700",
									children: "الإجابة النموذجية / معيار التصحيح (اختياري — يظهر للطالب بعد التسليم وللمعلم عند التصحيح):"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									value: q.modelAnswer || "",
									onChange: (e) => upd(i, { modelAnswer: e.target.value }),
									placeholder: "اكتب النقاط الأساسية المتوقعة في إجابة الطالب...",
									rows: 2,
									className: field
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid sm:grid-cols-6 gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: q.topic || "",
										onChange: (e) => upd(i, { topic: e.target.value }),
										placeholder: "الموضوع / المهارة (اختياري)",
										className: `${field} sm:col-span-2`,
										title: "يساعد تصنيف الموضوع في تحديد نقاط القوة والضعف في تقرير الطالب"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: q.explanation,
										onChange: (e) => upd(i, { explanation: e.target.value }),
										placeholder: "تفسير أو ملاحظة تعليمية (تظهر بعد التسليم)",
										className: `${field} sm:col-span-3`
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative sm:col-span-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "number",
											min: 1,
											max: 50,
											value: q.points,
											onChange: (e) => upd(i, { points: Math.max(1, Number(e.target.value)) }),
											className: field,
											title: "درجة السؤال"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "absolute left-2.5 top-2.5 text-[10px] text-slate-400 font-bold",
											children: "نقطة"
										})]
									})
								]
							})
						]
					}, q.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[11px] font-bold text-slate-500 block",
					children: "إضافة سؤال سريع حسب النوع:"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 sm:grid-cols-3 gap-1.5",
					children: Object.keys(QUIZ_TYPE_META).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setQs((l) => [...l, blankQ(t)]),
						className: "py-2 px-2.5 border border-dashed border-[#1677c7]/60 hover:border-[#1677c7] hover:bg-sky-50 text-[#1677c7] rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-3 h-3 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: QUIZ_TYPE_META[t].label })]
					}, t))
				})]
			}),
			qs.some((q) => q.question.trim()) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-3 rounded-2xl bg-sky-50/70 border border-sky-200 flex flex-wrap items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-[11px] font-bold text-slate-700 flex items-center gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "w-4 h-4 text-[#1677c7]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "تصدير ورقة الاختبار المنسّقة كملف Word (.doc):" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => handleExportBuilderWord(false),
						className: "px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 rounded-xl text-[11px] font-bold flex items-center gap-1 cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "w-3.5 h-3.5 text-[#1677c7]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "نسخة الطالب (.doc)" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => handleExportBuilderWord(true),
						className: "px-3 py-1.5 bg-[#0f233a] hover:bg-[#1677c7] text-white rounded-xl text-[11px] font-bold flex items-center gap-1 cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "نموذج الحل (.doc)" })]
					})]
				})]
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-bold text-rose-600",
				children: error
			})
		]
	});
};
// src/components/views/CoursePowerModals.tsx
var TYPE_LABELS = {
	mcq: "اختيار من متعدد",
	true_false: "صح وخطأ",
	multi_select: "تحديد متعدد",
	short_answer: "إجابة قصيرة",
	fill_blank: "أكمل الفراغ",
	essay: "سؤال مقالي"
};
var norm = (s) => s.trim().toLowerCase().replace(/\s+/g, " ");
function checkChallengeAnswer(q, val) {
	const t = q.type || "mcq";
	if (t === "mcq" || t === "true_false") return typeof val === "number" && val === q.correctOptionIndex;
	if (t === "multi_select") {
		const picked = Array.isArray(val) ? [...val].sort((a, b) => a - b) : [];
		const expected = [...q.correctOptionIndices || []].sort((a, b) => a - b);
		return expected.length > 0 && picked.length === expected.length && picked.every((v, i) => v === expected[i]);
	}
	if (t === "short_answer" || t === "fill_blank") {
		if (typeof val !== "string" || !val.trim()) return false;
		const ans = q.caseSensitive ? val.trim() : norm(val);
		return (q.acceptedAnswers || []).some((acc) => (q.caseSensitive ? acc.trim() : norm(acc)) === ans);
	}
	return typeof val === "string" && val.trim().length > 8;
}
var MistakeChallengeModal = ({ title, mistakes, onClose, onRewardPoints }) => {
	const [queue, setQueue] = (0, import_react.useState)(mistakes);
	const [idx, setIdx] = (0, import_react.useState)(0);
	const [answers, setAnswers] = (0, import_react.useState)({});
	const [checked, setChecked] = (0, import_react.useState)({});
	const [correctMap, setCorrectMap] = (0, import_react.useState)({});
	const [earnedXP, setEarnedXP] = (0, import_react.useState)(0);
	const [aiBusy, setAiBusy] = (0, import_react.useState)(false);
	const [aiError, setAiError] = (0, import_react.useState)(null);
	const [aiGeneratedCount, setAiGeneratedCount] = (0, import_react.useState)(0);
	const cur = queue[idx];
	const curVal = cur ? answers[cur.id] : void 0;
	const isChecked = cur ? Boolean(checked[cur.id]) : false;
	const isRight = cur ? Boolean(correctMap[cur.id]) : false;
	const masteredCount = Object.values(correctMap).filter(Boolean).length;
	const setVal = (qId, val) => {
		if (checked[qId]) return;
		setAnswers((prev) => ({
			...prev,
			[qId]: val
		}));
	};
	const toggleMulti = (qId, optIdx) => {
		if (checked[qId]) return;
		const prev = Array.isArray(answers[qId]) ? answers[qId] : [];
		const next = prev.includes(optIdx) ? prev.filter((x) => x !== optIdx) : [...prev, optIdx];
		setVal(qId, next);
	};
	const handleCheck = () => {
		if (!cur || isChecked) return;
		const ok = checkChallengeAnswer(cur, curVal);
		setChecked((prev) => ({
			...prev,
			[cur.id]: true
		}));
		setCorrectMap((prev) => ({
			...prev,
			[cur.id]: ok
		}));
		if (ok) {
			setEarnedXP((x) => x + 15);
			onRewardPoints(15);
		}
	};
	const handleGenerateAiDrill = async () => {
		if (aiBusy) return;
		setAiBusy(true);
		setAiError(null);
		try {
			const drillQs = await generateMistakeDrillAI(title, mistakes.slice(0, 5).map((m) => ({
				question: m.question,
				topic: m.topic,
				explanation: m.explanation
			})));
			if (drillQs.length === 0) {
				setAiError("تعذّر توليد أسئلة إضافية الآن. حاول مرة أخرى.");
				return;
			}
			const nextStart = queue.length;
			setQueue((prev) => [...prev, ...drillQs]);
			setAiGeneratedCount((c) => c + drillQs.length);
			setIdx(nextStart);
		} catch (err) {
			setAiError(err?.message || "تعذّر توليد جولة التحدي بالذكاء الاصطناعي.");
		} finally {
			setAiBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4",
		dir: "rtl",
		onClick: onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200",
			onClick: (e) => e.stopPropagation(),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-5 bg-white border-b border-slate-200 flex items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-0.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5 text-xs font-black text-amber-600",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "وضع التحدي وتصحيح الأخطاء" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-black text-slate-900 text-base",
							children: title
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "px-3 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 font-black text-xs tabular-nums",
							children: [
								"+",
								earnedXP,
								" XP مكتسبة"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: onClose,
							className: "p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-5 h-5" })
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-5 overflow-y-auto space-y-5 flex-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center justify-between gap-2 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center gap-1.5 flex-wrap",
								children: queue.map((item, i) => {
									const done = checked[item.id];
									const ok = correctMap[item.id];
									return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setIdx(i),
										className: `w-7 h-7 rounded-lg font-black text-[11px] cursor-pointer transition-all ${i === idx ? "bg-[#1677c7] text-white ring-2 ring-[#1677c7]/30" : done ? ok ? "bg-emerald-100 text-emerald-700 border border-emerald-300" : "bg-rose-100 text-rose-700 border border-rose-300" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`,
										children: i + 1
									}, item.id);
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-bold text-slate-500 tabular-nums",
								children: [
									"أُتقن ",
									masteredCount,
									" من ",
									queue.length
								]
							})]
						}),
						cur && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between text-xs font-bold text-slate-500",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										"السؤال ",
										idx + 1,
										" من ",
										queue.length,
										" · ",
										TYPE_LABELS[cur.type || "mcq"]
									] }), cur.topic && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[#1677c7]",
										children: cur.topic
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "font-black text-slate-900 text-base leading-relaxed whitespace-pre-line",
									children: cur.question
								}),
								(cur.type === "mcq" || cur.type === "true_false" || !cur.type) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: cur.type === "true_false" ? "grid grid-cols-2 gap-2.5" : "space-y-2",
									children: (cur.options.length ? cur.options : ["صح", "خطأ"]).map((opt, oIdx) => {
										const selected = curVal === oIdx;
										const showCorrect = isChecked && oIdx === cur.correctOptionIndex;
										const showWrong = isChecked && selected && oIdx !== cur.correctOptionIndex;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => setVal(cur.id, oIdx),
											className: `w-full p-3.5 rounded-xl border text-right text-xs sm:text-sm font-bold transition-all cursor-pointer ${showCorrect ? "bg-emerald-50 border-emerald-500 text-emerald-800" : showWrong ? "bg-rose-50 border-rose-500 text-rose-800" : selected ? "bg-sky-50 border-[#1677c7] text-slate-900" : "bg-white border-slate-200 hover:border-slate-300 text-slate-700"}`,
											children: opt
										}, oIdx);
									})
								}),
								cur.type === "multi_select" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "space-y-2",
									children: cur.options.map((opt, oIdx) => {
										const selected = (Array.isArray(curVal) ? curVal : []).includes(oIdx);
										const isExpected = (cur.correctOptionIndices || []).includes(oIdx);
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => toggleMulti(cur.id, oIdx),
											className: `w-full p-3.5 rounded-xl border text-right text-xs sm:text-sm font-bold flex items-center gap-2.5 cursor-pointer ${isChecked && isExpected ? "bg-emerald-50 border-emerald-500 text-emerald-800" : selected ? "bg-sky-50 border-[#1677c7] text-slate-900" : "bg-white border-slate-200 text-slate-700"}`,
											children: [selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquareCheckBig, { className: "w-4 h-4 text-[#1677c7]" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "w-4 h-4 text-slate-300" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: opt })]
										}, oIdx);
									})
								}),
								(cur.type === "short_answer" || cur.type === "fill_blank") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									dir: "auto",
									disabled: isChecked,
									value: typeof curVal === "string" ? curVal : "",
									onChange: (e) => setVal(cur.id, e.target.value),
									placeholder: "اكتب الإجابة الصحيحة هنا...",
									className: "w-full p-3.5 rounded-xl border border-slate-300 bg-white text-sm font-bold outline-none focus:border-[#1677c7]"
								}),
								cur.type === "essay" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									rows: 3,
									dir: "auto",
									disabled: isChecked,
									value: typeof curVal === "string" ? curVal : "",
									onChange: (e) => setVal(cur.id, e.target.value),
									placeholder: "أعد صياغة الإجابة النموذجية للتمرّن...",
									className: "w-full p-3.5 rounded-xl border border-slate-300 bg-white text-xs leading-relaxed outline-none focus:border-[#1677c7]"
								}),
								!isChecked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									disabled: curVal === void 0 || curVal === "" || Array.isArray(curVal) && curVal.length === 0,
									onClick: handleCheck,
									className: "w-full py-2.5 bg-[#1677c7] hover:bg-[#125fa0] disabled:opacity-40 text-white font-bold rounded-xl text-xs cursor-pointer",
									children: "تحقق من الإجابة الآن"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: `p-3.5 rounded-xl border text-xs space-y-1.5 ${isRight ? "bg-emerald-50 border-emerald-200 text-emerald-900" : "bg-rose-50 border-rose-200 text-rose-900"}`,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "font-black flex items-center gap-1.5",
											children: [isRight ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-4 h-4 text-emerald-600" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "w-4 h-4 text-rose-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isRight ? "ممتاز! إجابة صحيحة (+15 XP)" : "تحتاج لمراجعة هذه النقطة" })]
										}),
										(cur.type === "short_answer" || cur.type === "fill_blank") && cur.acceptedAnswers?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "الإجابة المقبولة:" }),
											" ",
											cur.acceptedAnswers.join(" / ")
										] }) : null,
										cur.type === "essay" && cur.modelAnswer && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "الإجابة النموذجية:" }),
											" ",
											cur.modelAnswer
										] }),
										cur.explanation && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "leading-relaxed",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "التفسير:" }),
												" ",
												cur.explanation
											]
										})
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4 rounded-2xl bg-sky-50/70 border border-sky-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-0.5 text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-black text-slate-900 flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-4 h-4 text-[#1677c7]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["تحدي إضافي بالذكاء الاصطناعي ", aiGeneratedCount > 0 ? `(أُضيف ${aiGeneratedCount})` : ""] })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-slate-600 text-[11px]",
										children: "ولّد أسئلة جديدة مشابهة للأخطاء التي واجهتك للتأكد من إتقانها تماماً."
									}),
									aiError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-rose-600 font-bold text-[11px]",
										children: aiError
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								disabled: aiBusy,
								onClick: handleGenerateAiDrill,
								className: "px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0",
								children: [aiBusy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: aiBusy ? "جاري التوليد..." : "توليد جولة تدريب (AI)" })]
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							disabled: idx === 0,
							onClick: () => setIdx((i) => Math.max(0, i - 1)),
							className: "px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold disabled:opacity-40 cursor-pointer",
							children: "السابق"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							disabled: idx >= queue.length - 1,
							onClick: () => setIdx((i) => Math.min(queue.length - 1, i + 1)),
							className: "px-4 py-2 bg-[#1677c7] text-white rounded-xl text-xs font-bold disabled:opacity-40 cursor-pointer",
							children: "التالي"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						className: "px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer",
						children: "إنهاء التحدي"
					})]
				})
			]
		})
	});
};
var PrintableExamModal = ({ title, classTitle, defaultMinistryName, defaultSchoolName, timeLimitMinutes = 20, questions, onClose }) => {
	const [withAnswers, setWithAnswers] = (0, import_react.useState)(false);
	const [showHeaderEditor, setShowHeaderEditor] = (0, import_react.useState)(false);
	const [ministryName, setMinistryName] = (0, import_react.useState)(defaultMinistryName || "وزارة التربية والتعليم / المجمع التعليمي");
	const [schoolName, setSchoolName] = (0, import_react.useState)(defaultSchoolName || "منصة NEMVIA التعليمية");
	const [instructions, setInstructions] = (0, import_react.useState)("اقرأ كل سؤال بعناية ثم أجب في المكان المخصص.");
	(0, import_react.useEffect)(() => {
		const cleanup = () => document.body.classList.remove("nemvia-printing-exam");
		window.addEventListener("afterprint", cleanup);
		return () => {
			cleanup();
			window.removeEventListener("afterprint", cleanup);
		};
	}, []);
	const handlePrint = () => {
		document.body.classList.add("nemvia-printing-exam");
		window.print();
		setTimeout(() => document.body.classList.remove("nemvia-printing-exam"), 800);
	};
	const handleDownloadWord = () => {
		downloadQuizAsWordDoc({
			title,
			classTitle,
			ministryName,
			schoolName,
			instructions,
			timeLimitMinutes,
			questions,
			withAnswers
		});
	};
	const totalPoints = questions.reduce((s, q) => s + (q.points || 1), 0);
	const letters = [
		"أ",
		"ب",
		"ج",
		"د",
		"هـ",
		"و"
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4",
		dir: "rtl",
		onClick: onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			id: "nemvia-printable-exam",
			className: "bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200",
			onClick: (e) => e.stopPropagation(),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "no-print p-4 sm:p-5 bg-white border-b border-slate-200 space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-black text-slate-900 text-base",
						children: "معاينة وتصدير ورقة الاختبار (Word / PDF)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] text-slate-500",
						children: "اختر نسخة الطالب أو نموذج المعلم المحلول ثم صدّر كملف Word أو اطبع PDF"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setWithAnswers(false),
									className: `px-3 py-1.5 rounded-lg cursor-pointer ${!withAnswers ? "bg-white text-slate-900 shadow-xs" : "text-slate-600"}`,
									children: "نسخة الطالب"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setWithAnswers(true),
									className: `px-3 py-1.5 rounded-lg cursor-pointer ${withAnswers ? "bg-white text-[#1677c7] shadow-xs" : "text-slate-600"}`,
									children: "نموذج المعلم المحلول"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setShowHeaderEditor((v) => !v),
								className: "px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer",
								title: "تخصيص ترويسة الوزارة والمدرسة والتعليمات",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "الترويسة" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: handleDownloadWord,
								className: "px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "تصدير Word (.doc)" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: handlePrint,
								className: "px-3.5 py-2 bg-[#1677c7] hover:bg-[#125fa0] text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "طباعة / PDF" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: onClose,
								className: "p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-5 h-5" })
							})
						]
					})]
				}), showHeaderEditor && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid sm:grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-xs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-[10px] font-bold text-slate-500 mb-1",
							children: "اسم الوزارة / المجمع:"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: ministryName,
							onChange: (e) => setMinistryName(e.target.value),
							className: "w-full p-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1677c7]"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-[10px] font-bold text-slate-500 mb-1",
							children: "اسم المدرسة / المعهد:"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: schoolName,
							onChange: (e) => setSchoolName(e.target.value),
							className: "w-full p-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1677c7]"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-[10px] font-bold text-slate-500 mb-1",
							children: "تعليمات الورقة:"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: instructions,
							onChange: (e) => setInstructions(e.target.value),
							className: "w-full p-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1677c7]"
						})] })
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-6 sm:p-8 overflow-y-auto space-y-5 bg-white text-slate-900",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-2 border-slate-900 grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x sm:divide-x-reverse divide-slate-300",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3 space-y-1 text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-black text-slate-900",
										children: ministryName
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-bold text-[#1677c7]",
										children: schoolName
									}),
									classTitle && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-slate-600 font-bold",
										children: ["المادة / الصف: ", classTitle]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3 bg-slate-50 flex flex-col items-center justify-center text-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-base font-black text-slate-900",
									children: title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] font-bold text-slate-500 mt-0.5",
									children: withAnswers ? "نموذج الإجابة المعتمد للمعلم" : "ورقة أسئلة الطالب"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3 text-xs space-y-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "font-bold",
										children: [
											"الزمن المحدد: ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "tabular-nums",
												children: timeLimitMinutes
											}),
											" دقيقة"
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "font-bold",
										children: [
											"الدرجة الكاملة: ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "tabular-nums",
												children: totalPoints
											}),
											" درجة"
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-slate-500",
										children: ["التاريخ: ", (/* @__PURE__ */ new Date()).toLocaleDateString("ar")]
									})
								]
							})
						]
					}),
					!withAnswers && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid sm:grid-cols-3 gap-3 p-3 border border-slate-300 bg-slate-50/70 rounded-xl text-xs font-bold",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "اسم الطالب/ـة: ................................." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "الشعبة / الرقم: ........................" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["الدرجة المستحقة: ...... / ", totalPoints] })
						]
					}),
					instructions && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-2.5 bg-sky-50 border-r-4 border-[#1677c7] text-xs font-bold text-slate-800",
						children: ["تعليمات الاختبار: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-normal",
							children: instructions
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-5",
						children: questions.map((q, i) => {
							const qType = q.type || "mcq";
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2 pb-4 border-b border-slate-200 last:border-none",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start justify-between gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "font-bold text-sm leading-relaxed whitespace-pre-line",
											children: [
												i + 1,
												". ",
												q.question
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-[11px] font-bold text-slate-500 shrink-0 tabular-nums",
											children: [
												"(",
												q.points,
												" ",
												q.points === 1 ? "درجة" : "درجات",
												")"
											]
										})]
									}),
									(qType === "mcq" || qType === "multi_select" || qType === "true_false") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid sm:grid-cols-2 gap-2 pr-4 text-xs",
										children: (qType === "true_false" ? ["صح", "خطأ"] : q.options).map((opt, j) => {
											const isAns = withAnswers && (qType === "multi_select" ? (q.correctOptionIndices || []).includes(j) : q.correctOptionIndex === j);
											return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: `p-2 rounded-lg border ${isAns ? "border-emerald-500 bg-emerald-50 font-black text-emerald-900" : "border-slate-200 text-slate-800"}`,
												children: [
													qType === "true_false" ? "○" : `${letters[j] || j + 1})`,
													" ",
													opt,
													" ",
													isAns ? "✓" : ""
												]
											}, j);
										})
									}),
									(qType === "short_answer" || qType === "fill_blank") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "pr-4 text-xs",
										children: withAnswers ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-emerald-800 font-bold bg-emerald-50 p-2 rounded-lg border border-emerald-200",
											children: ["الإجابة المقبولة: ", (q.acceptedAnswers || []).join(" / ") || "—"]
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8 border-b border-dashed border-slate-400" })
									}),
									qType === "essay" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "pr-4 text-xs",
										children: withAnswers ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-emerald-800 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200 whitespace-pre-line",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "الإجابة النموذجية:" }),
												" ",
												q.modelAnswer || "تُقدّر حسب إجابة الطالب"
											]
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-3 pt-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-5 border-b border-dashed border-slate-300" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-5 border-b border-dashed border-slate-300" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-5 border-b border-dashed border-slate-300" })
											]
										})
									}),
									withAnswers && q.explanation && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "pr-4 text-[11px] text-slate-600",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "التفسير:" }),
											" ",
											q.explanation
										]
									})
								]
							}, q.id || i);
						})
					})
				]
			})]
		})
	});
};
var QuestionBankModal = ({ userId, quizzes, onClose, onCreateQuizFromBank, onPrintQuestions }) => {
	const [items, setItems] = (0, import_react.useState)(() => loadQuestionBank(userId));
	const [query, setQuery] = (0, import_react.useState)("");
	const [subjectFilter, setSubjectFilter] = (0, import_react.useState)("all");
	const [selectedIds, setSelectedIds] = (0, import_react.useState)([]);
	const [syncNotice, setSyncNotice] = (0, import_react.useState)(null);
	const subjects = (0, import_react.useMemo)(() => {
		const s = new Set(items.map((i) => i.subject).filter(Boolean));
		return ["all", ...Array.from(s)];
	}, [items]);
	const filtered = (0, import_react.useMemo)(() => {
		return items.filter((it) => {
			if (subjectFilter !== "all" && it.subject !== subjectFilter) return false;
			if (query.trim()) {
				const q = query.trim().toLowerCase();
				return it.question.question.toLowerCase().includes(q) || it.subject.toLowerCase().includes(q);
			}
			return true;
		});
	}, [
		items,
		subjectFilter,
		query
	]);
	const handleSyncFromQuizzes = () => {
		let next = items;
		let added = 0;
		const before = items.length;
		quizzes.forEach((qz) => {
			if (qz.questions.length > 0) next = saveQuestionsToBank(userId, qz.class_title || qz.title, qz.questions);
		});
		added = next.length - before;
		setItems(next);
		setSyncNotice(added > 0 ? `تم استيراد ${added} سؤالاً جديداً من اختباراتك الحالية.` : "كل أسئلة اختباراتك محفوظة مسبقاً في البنك.");
	};
	const toggle = (id) => {
		setSelectedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
	};
	const handleDelete = (id) => {
		setItems(removeQuestionFromBank(userId, id));
		setSelectedIds((prev) => prev.filter((x) => x !== id));
	};
	const selectedQuestions = items.filter((i) => selectedIds.includes(i.id)).map((i) => i.question);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4",
		dir: "rtl",
		onClick: onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200",
			onClick: (e) => e.stopPropagation(),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-5 bg-white border-b border-slate-200 flex items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5 text-xs font-black text-[#1677c7]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Library, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "بنك الأسئلة القابل لإعادة الاستخدام" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "font-black text-slate-900 text-base",
						children: [
							"مكتبة الأسئلة المصنفة (",
							items.length,
							" سؤال)"
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						className: "p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-5 h-5" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-5 overflow-y-auto space-y-4 flex-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center justify-between gap-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-2 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative flex-1 min-w-[180px]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-3.5 h-3.5 text-slate-400 absolute right-3 top-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: query,
										onChange: (e) => setQuery(e.target.value),
										placeholder: "ابحث في نص السؤال أو المادة...",
										className: "w-full pr-8 pl-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#1677c7]"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									value: subjectFilter,
									onChange: (e) => setSubjectFilter(e.target.value),
									className: "p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none",
									children: subjects.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: s,
										children: s === "all" ? "كل المواد والمواضيع" : s
									}, s))
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: handleSyncFromQuizzes,
								className: "px-3 py-2 bg-sky-50 hover:bg-sky-100 text-[#1677c7] border border-sky-200 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer whitespace-nowrap",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "استيراد من الاختبارات الحالية" })]
							})]
						}),
						syncNotice && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl",
							children: syncNotice
						}),
						filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-10 text-center border border-dashed border-slate-300 rounded-2xl text-xs text-slate-500 space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-bold text-slate-700",
								children: "لا توجد أسئلة مطابقة في البنك حالياً."
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "اضغط على «استيراد من الاختبارات الحالية» أعلاه أو احفظ أسئلة جديدة من منشئ الاختبار." })]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-2",
							children: filtered.map((item) => {
								const picked = selectedIds.includes(item.id);
								const qType = item.question.type || "mcq";
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: `p-3 rounded-2xl border transition-colors flex items-start gap-3 text-xs ${picked ? "bg-sky-50 border-[#1677c7]" : "bg-slate-50 border-slate-200"}`,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "checkbox",
											checked: picked,
											onChange: () => toggle(item.id),
											className: "mt-1 accent-[#1677c7] cursor-pointer"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex-1 min-w-0 space-y-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-bold text-slate-900 leading-relaxed",
												children: item.question.question
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex flex-wrap items-center gap-1.5 text-[10px] text-slate-500",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "px-2 py-0.5 rounded bg-white border border-slate-200 font-bold text-slate-700",
														children: item.subject
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "px-2 py-0.5 rounded bg-white border border-slate-200 text-[#1677c7] font-bold",
														children: TYPE_LABELS[qType]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [item.question.points, " نقطة"] })
												]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => handleDelete(item.id),
											className: "p-1.5 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer shrink-0",
											title: "حذف من البنك",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3.5 h-3.5" })
										})
									]
								}, item.id);
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-xs font-bold text-slate-600",
						children: [
							"تم تحديد ",
							selectedQuestions.length,
							" سؤال"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							disabled: selectedQuestions.length === 0,
							onClick: () => onPrintQuestions("اختبار مختار من بنك الأسئلة", selectedQuestions),
							className: "px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 disabled:opacity-40 text-slate-800 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "طباعة المحدد PDF" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							disabled: selectedQuestions.length === 0,
							onClick: () => onCreateQuizFromBank(selectedQuestions, subjectFilter !== "all" ? `اختبار ${subjectFilter}` : "اختبار من بنك الأسئلة"),
							className: "px-4 py-2 bg-[#1677c7] hover:bg-[#125fa0] disabled:opacity-40 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "إنشاء اختبار من المحدد" })]
						})]
					})]
				})
			]
		})
	});
};
var TeacherAnalyticsPanel = ({ quizzes, classes, assignments, submissions, currentUserId }) => {
	const [insights, setInsights] = (0, import_react.useState)(null);
	const [insightsBusy, setInsightsBusy] = (0, import_react.useState)(false);
	const [insightsError, setInsightsError] = (0, import_react.useState)(null);
	const analytics = (0, import_react.useMemo)(() => {
		const teacherClasses = classes.filter((c) => c.teacher_id === currentUserId);
		const activeClasses = teacherClasses.length > 0 ? teacherClasses : classes;
		let totalAttempts = 0;
		let pendingManual = 0;
		let sumPercentages = 0;
		const quizBars = [];
		const questionStats = [];
		quizzes.forEach((qz) => {
			const atts = qz.attempts || [];
			if (atts.length === 0) {
				quizBars.push({
					id: qz.id,
					title: qz.title,
					classTitle: qz.class_title,
					attempts: 0,
					avgPct: 0
				});
				return;
			}
			const maxTotal = qz.questions.reduce((s, q) => s + (q.points || 1), 0) || 1;
			let qzPctSum = 0;
			const perQuestionTotals = {};
			qz.questions.forEach((qq) => {
				perQuestionTotals[qq.id] = {
					ok: 0,
					total: 0
				};
			});
			atts.forEach((att) => {
				totalAttempts += 1;
				if (att.needsManualGrading) pendingManual += 1;
				const pct = Math.min(100, Math.round((att.score || 0) / maxTotal * 100));
				sumPercentages += pct;
				qzPctSum += pct;
				buildQuizPerformanceReport(qz, att.answers || {}, null, att.questionFeedback).items.forEach((item) => {
					const stat = perQuestionTotals[item.question.id];
					if (!stat) return;
					if (item.status !== "pending") {
						stat.total += 1;
						if (item.status === "correct") stat.ok += 1;
					}
				});
			});
			quizBars.push({
				id: qz.id,
				title: qz.title,
				classTitle: qz.class_title,
				attempts: atts.length,
				avgPct: Math.round(qzPctSum / atts.length)
			});
			qz.questions.forEach((qq) => {
				const st = perQuestionTotals[qq.id];
				if (st && st.total > 0) questionStats.push({
					id: `${qz.id}-${qq.id}`,
					question: qq.question,
					quizTitle: qz.title,
					topic: qq.topic,
					accuracy: Math.round(st.ok / st.total * 100),
					attempts: st.total
				});
			});
		});
		const trickyQuestions = [...questionStats].sort((a, b) => a.accuracy - b.accuracy).slice(0, 5);
		const classSummaries = activeClasses.map((cls) => {
			const clsQuizzes = quizzes.filter((q) => q.class_id === cls.id);
			const clsBars = quizBars.filter((b) => clsQuizzes.some((q) => q.id === b.id) && b.attempts > 0);
			const clsAttempts = clsBars.reduce((s, b) => s + b.attempts, 0);
			const avgScore = clsBars.length > 0 ? Math.round(clsBars.reduce((s, b) => s + b.avgPct, 0) / clsBars.length) : 0;
			const clsAssignments = assignments.filter((a) => a.class_id === cls.id);
			const clsSubs = submissions.filter((s) => clsAssignments.some((a) => a.id === s.assignment_id));
			return {
				id: cls.id,
				title: cls.title,
				membersCount: cls.members_count,
				avgScore,
				totalAttempts: clsAttempts,
				submissionsCount: clsSubs.length
			};
		});
		const avgOverall = totalAttempts > 0 ? Math.round(sumPercentages / totalAttempts) : 0;
		const totalAssignmentsSubs = submissions.length;
		return {
			totalAttempts,
			pendingManual,
			avgOverall,
			totalAssignmentsSubs,
			quizBars,
			trickyQuestions,
			classSummaries
		};
	}, [
		quizzes,
		classes,
		assignments,
		submissions,
		currentUserId
	]);
	const handleGenerateInsights = async () => {
		if (insightsBusy) return;
		setInsightsBusy(true);
		setInsightsError(null);
		try {
			const res = await generateClassInsightsAI({
				classSummaries: analytics.classSummaries.map((c) => ({
					title: c.title,
					avgScore: c.avgScore,
					totalAttempts: c.totalAttempts
				})),
				trickyQuestions: analytics.trickyQuestions.map((q) => ({
					question: q.question,
					accuracy: q.accuracy,
					topic: q.topic
				}))
			});
			setInsights(res);
		} catch (err) {
			setInsightsError(err?.message || "تعذّر توليد توصيات التحليلات.");
		} finally {
			setInsightsBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 lg:grid-cols-4 gap-3.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white border border-slate-200 rounded-2xl p-4 space-y-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-xs text-slate-500 font-bold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "متوسط الدرجات العام" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "w-4 h-4 text-[#1677c7]" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-2xl font-black text-slate-900 tabular-nums",
								children: [analytics.avgOverall, "%"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] text-slate-400",
								children: "عبر جميع الاختبارات"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white border border-slate-200 rounded-2xl p-4 space-y-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-xs text-slate-500 font-bold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "محاولات الاختبارات" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "w-4 h-4 text-emerald-600" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-2xl font-black text-slate-900 tabular-nums",
								children: analytics.totalAttempts
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] text-slate-400",
								children: "تسليم مكتمل"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white border border-slate-200 rounded-2xl p-4 space-y-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-xs text-slate-500 font-bold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "بانتظار التصحيح اليدوي" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "w-4 h-4 text-amber-500" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-2xl font-black text-slate-900 tabular-nums",
								children: analytics.pendingManual
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] text-slate-400",
								children: "محاولة مقالية"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white border border-slate-200 rounded-2xl p-4 space-y-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-xs text-slate-500 font-bold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "تسليمات الواجبات" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "w-4 h-4 text-indigo-600" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-2xl font-black text-slate-900 tabular-nums",
								children: analytics.totalAssignmentsSubs
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] text-slate-400",
								children: "إجمالي الواجبات المستلمة"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white border border-sky-200 rounded-2xl p-5 space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-0.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
								className: "font-black text-sm text-slate-900 flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-4 h-4 text-[#1677c7]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "توصيات ذكية للمعلم بناءً على أداء الطلاب (AI)" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-slate-500",
								children: "يحلّل أكثر الأسئلة صعوبة ومتوسط الصفوف ليقترح عليك محاور المراجعة للحصة القادمة."
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							disabled: insightsBusy,
							onClick: handleGenerateInsights,
							className: "px-4 py-2 bg-[#1677c7] hover:bg-[#125fa0] disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap",
							children: [insightsBusy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: insights ? "تحديث التحليل الذكي" : "تحليل أداء الصفوف الآن" })]
						})]
					}),
					insightsError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-rose-600 font-bold",
						children: insightsError
					}),
					insights && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2.5 pt-1 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "p-3 bg-sky-50/70 border border-sky-100 rounded-xl text-slate-800 leading-relaxed",
							children: insights.summary
						}), insights.actions.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-1.5 list-disc list-inside text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200",
							children: insights.actions.map((act, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: "leading-relaxed",
								children: act
							}, i))
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid lg:grid-cols-2 gap-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white border border-slate-200 rounded-2xl p-5 space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 font-black text-sm text-slate-900",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "w-4 h-4 text-[#1677c7]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "متوسط الدرجات حسب الاختبار" })]
					}), analytics.quizBars.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-slate-500",
						children: "لا توجد اختبارات منشورة بعد."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-3",
						children: analytics.quizBars.map((bar) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-2 font-bold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-slate-800 truncate",
									children: bar.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-slate-600 tabular-nums shrink-0",
									children: bar.attempts > 0 ? `${bar.avgPct}% (${bar.attempts} محاولة)` : "بلا محاولات"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-full h-2 bg-slate-100 rounded-full overflow-hidden",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `h-full rounded-full ${bar.avgPct >= 75 ? "bg-emerald-500" : bar.avgPct >= 50 ? "bg-[#1677c7]" : "bg-amber-500"}`,
									style: { width: `${bar.attempts > 0 ? bar.avgPct : 0}%` }
								})
							})]
						}, bar.id))
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white border border-slate-200 rounded-2xl p-5 space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 font-black text-sm text-slate-900",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "w-4 h-4 text-rose-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "أكثر الأسئلة إرباكاً وصعوبة للطلاب" })]
					}), analytics.trickyQuestions.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-slate-500",
						children: "ستظهر إحصائيات صعوبة الأسئلة بمجرد حل الطلاب للاختبارات."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-2.5",
						children: analytics.trickyQuestions.map((q) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-2 font-bold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-slate-900 line-clamp-2",
									children: q.question
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: `px-2 py-0.5 rounded-md text-[11px] font-black shrink-0 tabular-nums ${q.accuracy < 50 ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-800"}`,
									children: [
										"صواب ",
										q.accuracy,
										"%"
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[10px] text-slate-500 block",
								children: [
									q.quizTitle,
									q.topic ? ` · ${q.topic}` : "",
									" · ",
									q.attempts,
									" إجابة مقيمة"
								]
							})]
						}, q.id))
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white border border-slate-200 rounded-2xl p-5 space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
					className: "font-black text-sm text-slate-900",
					children: "مقارنة تقدم الصفوف الدراسية"
				}), analytics.classSummaries.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-slate-500",
					children: "لا توجد صفوف مسجلة لعرض تقدمها."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-3",
					children: analytics.classSummaries.map((cls) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between font-black text-slate-900",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate",
								children: cls.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[#1677c7] tabular-nums",
								children: [cls.avgScore, "%"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-[11px] text-slate-500 flex items-center justify-between tabular-nums",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [cls.membersCount, " طالب"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								cls.totalAttempts,
								" اختبار · ",
								cls.submissionsCount,
								" واجب"
							] })]
						})]
					}, cls.id))
				})]
			})
		]
	});
};
// src/components/views/CoursesView.tsx
var formatQuestionAnswerText = (q, val) => {
	if (val === void 0 || val === null || val === -1) return "لم يُجب";
	if (typeof val === "number") return q.options[val] ?? String(val);
	if (Array.isArray(val)) return val.length ? val.map((idx) => q.options[idx] ?? idx).join("، ") : "لم يُجب";
	if (typeof val === "string") return val.trim() ? val : "لم يُجب";
	return "لم يُجب";
};
var QuizPerformanceReportPanel = ({ quiz, report, teacherFeedback, onStartChallenge }) => {
	const [aiPlan, setAiPlan] = (0, import_react.useState)(null);
	const [aiPlanLoading, setAiPlanLoading] = (0, import_react.useState)(false);
	const [aiPlanError, setAiPlanError] = (0, import_react.useState)(null);
	const [studentTranscripts, setStudentTranscripts] = (0, import_react.useState)({});
	const [transcribingQId, setTranscribingQId] = (0, import_react.useState)(null);
	const mistakeQuestions = report.items.filter((it) => it.status === "incorrect" || it.status === "unanswered").map((it) => it.question);
	const handleStudentTranscribe = async (qId, audioUrl) => {
		if (transcribingQId === qId) return;
		setTranscribingQId(qId);
		try {
			const text = await transcribeAudioAI({ audioUrl });
			setStudentTranscripts((prev) => ({
				...prev,
				[qId]: text
			}));
		} catch {
			setStudentTranscripts((prev) => ({
				...prev,
				[qId]: "تعذّر استخراج النص من التسجيل حالياً."
			}));
		} finally {
			setTranscribingQId(null);
		}
	};
	const handleBuildStudyPlan = async () => {
		if (aiPlanLoading) return;
		setAiPlanLoading(true);
		setAiPlanError(null);
		try {
			const plan = await generateStudyPlanAI({
				quizTitle: quiz.title,
				percentage: report.percentage,
				strengths: report.strengths,
				weaknesses: report.weaknesses
			});
			setAiPlan(plan);
		} catch (err) {
			setAiPlanError(err?.message || "تعذّر توليد الخطة العلاجية الآن.");
		} finally {
			setAiPlanLoading(false);
		}
	};
	const gradeTone = report.percentage >= 85 ? "bg-emerald-100 text-emerald-800 border-emerald-200" : report.percentage >= 65 ? "bg-sky-100 text-sky-800 border-sky-200" : report.percentage >= 50 ? "bg-amber-100 text-amber-800 border-amber-200" : "bg-rose-100 text-rose-800 border-rose-200";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5 text-right",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "w-4 h-4 text-[#1677c7]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "font-black text-sm text-slate-900",
								children: "تقرير الأداء التفصيلي"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: `px-3 py-1 rounded-full text-xs font-black border ${gradeTone}`,
							children: [
								report.gradeLabel,
								" · ",
								report.percentage,
								"%"
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-full h-2.5 bg-slate-200 rounded-full overflow-hidden",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `h-full rounded-full transition-all ${report.percentage >= 80 ? "bg-emerald-500" : report.percentage >= 55 ? "bg-[#1677c7]" : "bg-rose-500"}`,
							style: { width: `${report.percentage}%` }
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-2.5 bg-white rounded-xl border border-slate-200",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] text-slate-400 block font-bold",
									children: "إجابات صحيحة"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-base font-black text-emerald-600",
									children: report.correctCount
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-2.5 bg-white rounded-xl border border-slate-200",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] text-slate-400 block font-bold",
									children: "إجابات خاطئة"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-base font-black text-rose-600",
									children: report.incorrectCount
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-2.5 bg-white rounded-xl border border-slate-200",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] text-slate-400 block font-bold",
									children: "قيد المراجعة"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-base font-black text-amber-600",
									children: report.pendingCount
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-2.5 bg-white rounded-xl border border-slate-200",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] text-slate-400 block font-bold",
									children: "غير مجاب"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-base font-black text-slate-600",
									children: report.unansweredCount
								})]
							})
						]
					}),
					mistakeQuestions.length > 0 && onStartChallenge && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pt-1 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200/80",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-[11px] font-bold text-slate-600",
							children: [
								"لديك ",
								mistakeQuestions.length,
								" ",
								mistakeQuestions.length === 1 ? "سؤال يحتاج" : "أسئلة تحتاج",
								" لمراجعة وتحدٍ سريع"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => onStartChallenge(mistakeQuestions),
							className: "px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-[11px] flex items-center gap-1.5 cursor-pointer whitespace-nowrap",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "ابدأ تحدي تصحيح الأخطاء" })]
						})]
					})
				]
			}),
			teacherFeedback && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-3.5 rounded-2xl bg-sky-50 border border-sky-200 text-xs text-[#0f233a] space-y-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "font-black flex items-center gap-1.5 text-[#1677c7]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "ملاحظة المعلم العامة على المحاولة:" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "leading-relaxed whitespace-pre-line",
					children: teacherFeedback
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid sm:grid-cols-2 gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5 text-emerald-800 font-black text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "w-4 h-4 text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "نقاط القوة" })]
					}), report.strengths.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-1.5 text-[11px] text-emerald-950 list-disc list-inside",
						children: report.strengths.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "leading-relaxed",
							children: s
						}, i))
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] text-emerald-800/80",
						children: "ستظهر نقاط قوتك المميزة مع إكمال المزيد من الأسئلة المصحّحة."
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5 text-rose-800 font-black text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "w-4 h-4 text-rose-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "نقاط الضعف وتحتاج لتحسين" })]
					}), report.weaknesses.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-1.5 text-[11px] text-rose-950 list-disc list-inside",
						children: report.weaknesses.map((w, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "leading-relaxed",
							children: w
						}, i))
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] text-emerald-700 font-bold",
						children: "ممتاز! لم تُسجّل نقاط ضعف واضحة في هذا الاختبار."
					})]
				})]
			}),
			report.recommendations.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1.5 text-amber-900 font-black text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lightbulb, { className: "w-4 h-4 text-amber-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "توصيات مخصصة لرفع مستواك" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-1 text-[11px] text-amber-950 list-disc list-inside",
					children: report.recommendations.map((rec, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "leading-relaxed",
						children: rec
					}, i))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-3.5 rounded-2xl bg-sky-50/70 border border-sky-200 space-y-2.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5 text-slate-900 font-black text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-4 h-4 text-[#1677c7]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "خطة علاجية ذكية مبنية على نتيجتك (AI)" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							disabled: aiPlanLoading,
							onClick: handleBuildStudyPlan,
							className: "px-3 py-1.5 bg-[#1677c7] hover:bg-[#125fa0] disabled:opacity-50 text-white font-bold text-[11px] rounded-xl flex items-center gap-1.5 cursor-pointer whitespace-nowrap",
							children: [aiPlanLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: aiPlan ? "إعادة توليد الخطة" : "إنشاء خطة دراسة مخصصة" })]
						})]
					}),
					aiPlanError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] text-rose-600 font-bold",
						children: aiPlanError
					}),
					aiPlan && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2 pt-1 text-xs",
						children: [aiPlan.planSummary && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-slate-700 leading-relaxed bg-white p-2.5 rounded-xl border border-sky-100",
							children: aiPlan.planSummary
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid sm:grid-cols-2 gap-2",
							children: aiPlan.steps.map((st, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-2.5 bg-white rounded-xl border border-slate-200 space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-black text-slate-900 text-[11px]",
										children: [
											idx + 1,
											". ",
											st.title
										]
									}), st.duration && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] font-bold text-[#1677c7] bg-sky-50 px-2 py-0.5 rounded-md whitespace-nowrap",
										children: st.duration
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-slate-600 leading-relaxed",
									children: st.action
								})]
							}, idx))
						})]
					})
				]
			}),
			(report.byTopic.length > 0 || report.byType.length > 0) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid sm:grid-cols-2 gap-3",
				children: [report.byType.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-3.5 rounded-2xl bg-white border border-slate-200 space-y-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
						className: "font-black text-xs text-slate-800",
						children: "الأداء حسب نوع السؤال"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-2",
						children: report.byType.map((bt) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1 text-[11px]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between font-bold text-slate-700",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									bt.label,
									" (",
									bt.correctQuestions,
									"/",
									bt.totalQuestions,
									")"
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: bt.accuracy >= 75 ? "text-emerald-600" : bt.accuracy < 60 ? "text-rose-600" : "text-[#1677c7]",
									children: [bt.accuracy, "%"]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-full h-1.5 bg-slate-100 rounded-full overflow-hidden",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `h-full rounded-full ${bt.accuracy >= 75 ? "bg-emerald-500" : bt.accuracy < 60 ? "bg-rose-500" : "bg-[#1677c7]"}`,
									style: { width: `${bt.accuracy}%` }
								})
							})]
						}, bt.key))
					})]
				}), report.byTopic.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-3.5 rounded-2xl bg-white border border-slate-200 space-y-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
						className: "font-black text-xs text-slate-800",
						children: "الأداء حسب الموضوع / المهارة"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-2",
						children: report.byTopic.map((tp) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1 text-[11px]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between font-bold text-slate-700",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									tp.label,
									" (",
									tp.correctQuestions,
									"/",
									tp.totalQuestions,
									")"
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: tp.accuracy >= 75 ? "text-emerald-600" : tp.accuracy < 60 ? "text-rose-600" : "text-[#1677c7]",
									children: [tp.accuracy, "%"]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-full h-1.5 bg-slate-100 rounded-full overflow-hidden",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `h-full rounded-full ${tp.accuracy >= 75 ? "bg-emerald-500" : tp.accuracy < 60 ? "bg-rose-500" : "bg-[#1677c7]"}`,
									style: { width: `${tp.accuracy}%` }
								})
							})]
						}, tp.key))
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3 pt-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h5", {
					className: "font-black text-xs text-slate-800",
					children: [
						"مراجعة الأسئلة وتغذية المعلم (",
						quiz.questions.length,
						")"
					]
				}), report.items.map((item) => {
					const { question: q, index, type: qType, userAnswer, status, earnedPoints, maxPoints, keyEntry, teacherFeedback: qFb } = item;
					const statusMeta = status === "correct" ? {
						label: "✓ إجابة صحيحة",
						cls: "text-emerald-700 bg-emerald-50 border-emerald-200"
					} : status === "pending" ? {
						label: "⏳ بانتظار تصحيح المعلم",
						cls: "text-amber-700 bg-amber-50 border-amber-200"
					} : status === "unanswered" ? {
						label: "— لم يُجب",
						cls: "text-slate-600 bg-slate-100 border-slate-200"
					} : {
						label: "✗ إجابة خاطئة",
						cls: "text-rose-700 bg-rose-50 border-rose-200"
					};
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-3.5 bg-slate-50 rounded-2xl border border-slate-200/90 text-xs space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-start justify-between gap-2 font-bold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1 flex-1 min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-slate-900 leading-relaxed block",
										children: [
											index + 1,
											". ",
											q.question
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-center gap-1.5 text-[10px]",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600",
												children: QUIZ_TYPE_META[qType]?.badge || qType
											}),
											q.topic && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "px-2 py-0.5 rounded-md bg-sky-50 border border-sky-200 text-[#1677c7]",
												children: q.topic
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-slate-500",
												children: ["الدرجة: ", status === "pending" ? `— / ${maxPoints}` : `${earnedPoints} / ${maxPoints}`]
											})
										]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `text-[11px] px-2.5 py-0.5 rounded-full border shrink-0 ${statusMeta.cls}`,
									children: statusMeta.label
								})]
							}),
							(qType === "mcq" || qType === "true_false") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[11px] text-slate-600",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "إجابتك:" }),
									" ",
									formatQuestionAnswerText(q, userAnswer),
									" ·",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "text-emerald-700",
										children: "الصحيحة:"
									}),
									" ",
									keyEntry?.correct !== void 0 ? q.options[keyEntry.correct] ?? "—" : q.correctOptionIndex >= 0 ? q.options[q.correctOptionIndex] ?? "—" : "متاحة بعد التصحيح"
								]
							}),
							qType === "multi_select" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[11px] text-slate-600",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "إجابتك:" }),
									" ",
									formatQuestionAnswerText(q, userAnswer),
									" ·",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "text-emerald-700",
										children: "الصحيحة:"
									}),
									" ",
									(keyEntry?.correctIndices || q.correctOptionIndices || []).map((idx) => q.options[idx]).join("، ") || "—"
								]
							}),
							(qType === "short_answer" || qType === "fill_blank") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[11px] text-slate-600",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "إجابتك:" }),
									" ",
									formatQuestionAnswerText(q, userAnswer),
									" ·",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "text-emerald-700",
										children: "الإجابات المقبولة:"
									}),
									" ",
									(keyEntry?.acceptedAnswers || q.acceptedAnswers || []).join(" / ") || "—"
								]
							}),
							qType === "essay" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1 text-[11px] text-slate-600",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "whitespace-pre-line",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "إجابتك:" }),
										" ",
										formatQuestionAnswerText(q, userAnswer)
									]
								}), (keyEntry?.modelAnswer || q.modelAnswer) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-emerald-800 bg-emerald-50 p-2 rounded-lg border border-emerald-100",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "الإجابة النموذجية:" }),
										" ",
										keyEntry?.modelAnswer || q.modelAnswer
									]
								})]
							}),
							(keyEntry?.explanation || q.explanation) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-slate-600 text-[11px] leading-relaxed",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "التفسير العلمي:" }),
									" ",
									keyEntry?.explanation || q.explanation
								]
							}),
							(qFb?.text || qFb?.audio_url || qFb?.points_awarded !== void 0) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-2.5 rounded-xl bg-indigo-50/80 border border-indigo-200 space-y-1.5 text-[11px] text-indigo-950",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between font-black text-indigo-800",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "تغذية المعلم لهذا السؤال" })]
										}), qFb.points_awarded !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "px-2 py-0.5 rounded-md bg-white border border-indigo-200 text-indigo-700",
											children: [
												qFb.points_awarded,
												" / ",
												q.points,
												" نقطة"
											]
										})]
									}),
									qFb.text && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "leading-relaxed whitespace-pre-line",
										children: qFb.text
									}),
									qFb.audio_url && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5 pt-0.5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex flex-wrap items-center justify-between gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "inline-flex items-center gap-1 text-[10px] font-bold text-indigo-700",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "تعليق صوتي من المعلم:" })]
												}), !qFb.transcript && !studentTranscripts[q.id] && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													type: "button",
													disabled: transcribingQId === q.id,
													onClick: () => handleStudentTranscribe(q.id, qFb.audio_url),
													className: "px-2 py-0.5 bg-white hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-md text-[10px] font-bold flex items-center gap-1 cursor-pointer disabled:opacity-50",
													children: [transcribingQId === q.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-3 h-3 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-3 h-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: transcribingQId === q.id ? "جاري التفريغ..." : "عرض النص المكتوب (AI)" })]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("audio", {
												controls: true,
												preload: "metadata",
												src: qFb.audio_url,
												className: "w-full h-9"
											}),
											(qFb.transcript || studentTranscripts[q.id]) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "p-2 rounded-lg bg-white border border-indigo-100 text-[11px] text-slate-700 leading-relaxed",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-bold text-indigo-700 block text-[10px] mb-0.5",
													children: "النص المفرّغ من التسجيل:"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "whitespace-pre-line",
													children: qFb.transcript || studentTranscripts[q.id]
												})]
											})
										]
									})
								]
							})
						]
					}, q.id);
				})]
			})
		]
	});
};
var CoursesView = ({ currentRole, currentUserName, courses, lessons, quizzes, currentUserId, classes, schools = [], ministries = [], assignments = [], submissions = [], onSubmitQuiz, onGradeQuizAttempt, onUpload, onDeleteLesson, onDeleteQuiz, onAddQuiz, onAddLesson, onRewardPoints }) => {
	const [activeTab, setActiveTab] = (0, import_react.useState)("quizzes");
	const [selectedLesson, setSelectedLesson] = (0, import_react.useState)(null);
	const [activeQuiz, setActiveQuiz] = (0, import_react.useState)(null);
	const [currentQuestionIndex, setCurrentQuestionIndex] = (0, import_react.useState)(0);
	const [selectedAnswers, setSelectedAnswers] = (0, import_react.useState)({});
	const [quizSubmitted, setQuizSubmitted] = (0, import_react.useState)(false);
	const [quizScore, setQuizScore] = (0, import_react.useState)(0);
	const [timeLeft, setTimeLeft] = (0, import_react.useState)(600);
	const [showQuizBuilder, setShowQuizBuilder] = (0, import_react.useState)(false);
	const [quizBuilderPreset, setQuizBuilderPreset] = (0, import_react.useState)(null);
	const [showLessonBuilder, setShowLessonBuilder] = (0, import_react.useState)(false);
	const [showQuestionBank, setShowQuestionBank] = (0, import_react.useState)(false);
	const [printExam, setPrintExam] = (0, import_react.useState)(null);
	const [challengeData, setChallengeData] = (0, import_react.useState)(null);
	const [gradingQuizId, setGradingQuizId] = (0, import_react.useState)(null);
	const [reportQuizId, setReportQuizId] = (0, import_react.useState)(null);
	const [attemptEdits, setAttemptEdits] = (0, import_react.useState)({});
	const [savingAttemptId, setSavingAttemptId] = (0, import_react.useState)(null);
	const [recordingTarget, setRecordingTarget] = (0, import_react.useState)(null);
	const [recordSeconds, setRecordSeconds] = (0, import_react.useState)(0);
	const [uploadingAudioKey, setUploadingAudioKey] = (0, import_react.useState)(null);
	const [transcribingKey, setTranscribingKey] = (0, import_react.useState)(null);
	const [audioError, setAudioError] = (0, import_react.useState)(null);
	const [aiDraftKey, setAiDraftKey] = (0, import_react.useState)(null);
	const [lessonSummaries, setLessonSummaries] = (0, import_react.useState)({});
	const [lessonAiLoadingId, setLessonAiLoadingId] = (0, import_react.useState)(null);
	const [lessonAiError, setLessonAiError] = (0, import_react.useState)({});
	const mediaRecorderRef = (0, import_react.useRef)(null);
	const mediaStreamRef = (0, import_react.useRef)(null);
	const audioChunksRef = (0, import_react.useRef)([]);
	const recordTimerRef = (0, import_react.useRef)(null);
	const myClasses = classes.filter((c) => c.teacher_id === currentUserId);
	const canBuild = (currentRole === "teacher" || currentRole === "admin") && myClasses.length > 0;
	const [quizResult, setQuizResult] = (0, import_react.useState)(null);
	const answersRef = (0, import_react.useRef)({});
	const finishingRef = (0, import_react.useRef)(false);
	const cleanupRecording = () => {
		if (recordTimerRef.current) {
			window.clearInterval(recordTimerRef.current);
			recordTimerRef.current = null;
		}
		if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") try {
			mediaRecorderRef.current.stop();
		} catch {}
		if (mediaStreamRef.current) {
			mediaStreamRef.current.getTracks().forEach((t) => t.stop());
			mediaStreamRef.current = null;
		}
		mediaRecorderRef.current = null;
		setRecordingTarget(null);
		setRecordSeconds(0);
	};
	(0, import_react.useEffect)(() => () => cleanupRecording(), []);
	(0, import_react.useEffect)(() => {
		if (!activeQuiz || quizSubmitted) return;
		const interval = setInterval(() => {
			setTimeLeft((prev) => {
				if (prev <= 1) {
					handleFinishQuiz();
					return 0;
				}
				return prev - 1;
			});
		}, 1e3);
		return () => clearInterval(interval);
	}, [activeQuiz, quizSubmitted]);
	const handleStartQuiz = (q) => {
		setActiveQuiz(q);
		setCurrentQuestionIndex(0);
		setSelectedAnswers({});
		answersRef.current = {};
		finishingRef.current = false;
		setQuizResult(null);
		setQuizSubmitted(false);
		setTimeLeft(q.timeLimitMinutes * 60);
	};
	const setQuestionAnswer = (questionId, val) => {
		if (quizSubmitted) return;
		answersRef.current = {
			...answersRef.current,
			[questionId]: val
		};
		setSelectedAnswers((prev) => ({
			...prev,
			[questionId]: val
		}));
	};
	const toggleMultiOption = (questionId, optionIndex) => {
		if (quizSubmitted) return;
		const cur = Array.isArray(answersRef.current[questionId]) ? answersRef.current[questionId] : [];
		const next = cur.includes(optionIndex) ? cur.filter((i) => i !== optionIndex) : [...cur, optionIndex].sort((a, b) => a - b);
		setQuestionAnswer(questionId, next);
	};
	const isQuestionAnswered = (q) => {
		const val = selectedAnswers[q.id];
		if (val === void 0 || val === null) return false;
		if (Array.isArray(val)) return val.length > 0;
		if (typeof val === "string") return val.trim().length > 0;
		return true;
	};
	const handleFinishQuiz = async () => {
		if (!activeQuiz || finishingRef.current) return;
		finishingRef.current = true;
		try {
			const res = await onSubmitQuiz(activeQuiz.id, answersRef.current, activeQuiz.questions);
			setQuizResult(res);
			setQuizScore(res.score);
			setQuizSubmitted(true);
			onRewardPoints(res.score * 10);
		} catch {
			finishingRef.current = false;
			setActiveQuiz(null);
		}
	};
	const gradingQuiz = gradingQuizId ? quizzes.find((q) => q.id === gradingQuizId) || null : null;
	const reportQuiz = reportQuizId ? quizzes.find((q) => q.id === reportQuizId) || null : null;
	const openGradingModal = (q) => {
		cleanupRecording();
		setAudioError(null);
		const initial = {};
		(q.attempts || []).forEach((a) => {
			initial[a.id] = {
				score: String(a.score),
				feedback: a.teacherFeedback || "",
				questionFeedback: { ...a.questionFeedback || {} }
			};
		});
		setAttemptEdits(initial);
		setGradingQuizId(q.id);
	};
	const closeGradingModal = () => {
		cleanupRecording();
		setAudioError(null);
		setGradingQuizId(null);
	};
	const updateQuestionFeedback = (attemptId, questionId, patch) => {
		setAttemptEdits((prev) => {
			const cur = prev[attemptId] || {
				score: "0",
				feedback: "",
				questionFeedback: {}
			};
			const nextQ = {
				...cur.questionFeedback[questionId] || {},
				...patch
			};
			if (!nextQ.text?.trim()) delete nextQ.text;
			if (!nextQ.audio_url) delete nextQ.audio_url;
			if (!nextQ.transcript?.trim()) delete nextQ.transcript;
			if (nextQ.points_awarded === void 0 || Number.isNaN(nextQ.points_awarded)) delete nextQ.points_awarded;
			const nextMap = { ...cur.questionFeedback };
			if (Object.keys(nextQ).length === 0) delete nextMap[questionId];
			else nextMap[questionId] = nextQ;
			return {
				...prev,
				[attemptId]: {
					...cur,
					questionFeedback: nextMap
				}
			};
		});
	};
	const sumAttemptPointsFromQuestions = (quiz, att) => {
		const qMap = attemptEdits[att.id]?.questionFeedback || {};
		let sum = 0;
		quiz.questions.forEach((qq) => {
			const manual = qMap[qq.id]?.points_awarded;
			if (manual !== void 0) sum += manual;
			else {
				const rep = buildQuizPerformanceReport({
					...quiz,
					questions: [qq]
				}, att.answers || {}, null, {});
				sum += rep.items[0]?.earnedPoints || 0;
			}
		});
		setAttemptEdits((prev) => ({
			...prev,
			[att.id]: {
				...prev[att.id] || {
					score: String(att.score),
					feedback: att.teacherFeedback || "",
					questionFeedback: {}
				},
				score: String(Number(sum.toFixed(2)))
			}
		}));
	};
	const handleAiDraftFeedback = async (att, qq) => {
		const key = `${att.id}:${qq.id}`;
		if (aiDraftKey === key) return;
		setAiDraftKey(key);
		setAudioError(null);
		try {
			const qType = qq.type || "mcq";
			const studentAnswer = formatQuestionAnswerText(qq, att.answers?.[qq.id]);
			let modelAnswer = qq.modelAnswer || "";
			if (!modelAnswer && (qType === "mcq" || qType === "true_false") && qq.correctOptionIndex >= 0) modelAnswer = qq.options[qq.correctOptionIndex] || "";
			else if (!modelAnswer && qType === "multi_select" && qq.correctOptionIndices?.length) modelAnswer = qq.correctOptionIndices.map((i) => qq.options[i]).join("، ");
			else if (!modelAnswer && (qType === "short_answer" || qType === "fill_blank") && qq.acceptedAnswers?.length) modelAnswer = qq.acceptedAnswers.join(" / ");
			const res = await draftQuestionFeedbackAI({
				question: qq.question,
				studentAnswer,
				modelAnswer,
				maxPoints: qq.points
			});
			updateQuestionFeedback(att.id, qq.id, {
				text: res.feedbackText,
				points_awarded: res.suggestedPoints
			});
		} catch (err) {
			setAudioError(err?.message || "تعذّر صياغة التغذية الراجعة بالذكاء الاصطناعي.");
		} finally {
			setAiDraftKey(null);
		}
	};
	const handleSummarizeLesson = async (ls) => {
		if (lessonAiLoadingId === ls.id) return;
		setLessonAiLoadingId(ls.id);
		setLessonAiError((prev) => {
			const next = { ...prev };
			delete next[ls.id];
			return next;
		});
		try {
			const result = await summarizeLessonAI(ls.title, ls.content);
			setLessonSummaries((prev) => ({
				...prev,
				[ls.id]: result
			}));
		} catch (err) {
			setLessonAiError((prev) => ({
				...prev,
				[ls.id]: err?.message || "تعذّر تلخيص الدرس بالذكاء الاصطناعي."
			}));
		} finally {
			setLessonAiLoadingId(null);
		}
	};
	const startAudioRecording = async (attemptId, questionId) => {
		setAudioError(null);
		if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
			setAudioError("متصفحك لا يدعم التسجيل الصوتي المباشر. يمكنك رفع ملف صوتي جاهز بدلاً من ذلك.");
			return;
		}
		cleanupRecording();
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			const chosenMime = [
				"audio/webm;codecs=opus",
				"audio/webm",
				"audio/mp4",
				"audio/ogg"
			].find((m) => MediaRecorder.isTypeSupported(m)) || "";
			const recorder = chosenMime ? new MediaRecorder(stream, { mimeType: chosenMime }) : new MediaRecorder(stream);
			mediaStreamRef.current = stream;
			mediaRecorderRef.current = recorder;
			audioChunksRef.current = [];
			setRecordingTarget({
				attemptId,
				questionId
			});
			setRecordSeconds(0);
			recordTimerRef.current = window.setInterval(() => {
				setRecordSeconds((s) => s + 1);
			}, 1e3);
			recorder.ondataavailable = (ev) => {
				if (ev.data && ev.data.size > 0) audioChunksRef.current.push(ev.data);
			};
			recorder.onstop = async () => {
				if (recordTimerRef.current) {
					window.clearInterval(recordTimerRef.current);
					recordTimerRef.current = null;
				}
				stream.getTracks().forEach((t) => t.stop());
				mediaStreamRef.current = null;
				mediaRecorderRef.current = null;
				setRecordingTarget(null);
				setRecordSeconds(0);
				const mime = recorder.mimeType || chosenMime || "audio/webm";
				const blob = new Blob(audioChunksRef.current, { type: mime });
				audioChunksRef.current = [];
				if (blob.size < 200) return;
				const key = `${attemptId}:${questionId}`;
				setUploadingAudioKey(key);
				try {
					const ext = mime.includes("mp4") ? "m4a" : mime.includes("ogg") ? "ogg" : "webm";
					const url = await uploadQuizAudioFeedback(currentUserId, blob, ext);
					updateQuestionFeedback(attemptId, questionId, { audio_url: url });
					if (blob.size < 45e5) transcribeAudioBlob(attemptId, questionId, blob, mime);
				} catch (err) {
					setAudioError(err?.message || "تعذّر رفع التسجيل الصوتي");
				} finally {
					setUploadingAudioKey(null);
				}
			};
			recorder.start();
		} catch {
			cleanupRecording();
			setAudioError("تعذّر الوصول إلى الميكروفون. تحقق من أذونات المتصفح أو ارفع ملفاً صوتياً.");
		}
	};
	const stopAudioRecording = () => {
		if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") mediaRecorderRef.current.stop();
		else cleanupRecording();
	};
	const blobToBase64 = (blob) => new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onloadend = () => {
			const res = String(reader.result || "");
			const idx = res.indexOf(",");
			resolve(idx >= 0 ? res.slice(idx + 1) : res);
		};
		reader.onerror = () => reject(/* @__PURE__ */ new Error("تعذّر قراءة الملف الصوتي"));
		reader.readAsDataURL(blob);
	});
	const transcribeAudioBlob = async (attemptId, questionId, blob, mimeType) => {
		const key = `${attemptId}:${questionId}`;
		setTranscribingKey(key);
		try {
			const base64 = await blobToBase64(blob);
			const text = await transcribeAudioAI({
				audioBase64: base64,
				mimeType
			});
			if (text) updateQuestionFeedback(attemptId, questionId, { transcript: text });
		} catch {} finally {
			setTranscribingKey(null);
		}
	};
	const handleManualTranscribeUrl = async (attemptId, questionId, audioUrl) => {
		const key = `${attemptId}:${questionId}`;
		if (transcribingKey === key) return;
		setTranscribingKey(key);
		setAudioError(null);
		try {
			const text = await transcribeAudioAI({ audioUrl });
			updateQuestionFeedback(attemptId, questionId, { transcript: text });
		} catch (err) {
			setAudioError(err?.message || "تعذّر تفريغ الصوت إلى نص.");
		} finally {
			setTranscribingKey(null);
		}
	};
	const handleAudioFilePick = async (attemptId, questionId, file) => {
		if (!file) return;
		setAudioError(null);
		const key = `${attemptId}:${questionId}`;
		setUploadingAudioKey(key);
		try {
			const url = await uploadQuizAudioFeedback(currentUserId, file);
			updateQuestionFeedback(attemptId, questionId, { audio_url: url });
			if (file.size < 45e5) transcribeAudioBlob(attemptId, questionId, file, file.type || "audio/webm");
		} catch (err) {
			setAudioError(err?.message || "تعذّر رفع الملف الصوتي");
		} finally {
			setUploadingAudioKey(null);
		}
	};
	const saveAttemptGrade = async (a) => {
		const edit = attemptEdits[a.id] || {
			score: String(a.score),
			feedback: "",
			questionFeedback: {}
		};
		const numScore = Math.max(0, Number(edit.score) || 0);
		setSavingAttemptId(a.id);
		await onGradeQuizAttempt(a.id, numScore, edit.feedback, edit.questionFeedback);
		setSavingAttemptId(null);
	};
	const allStudentMistakes = quizzes.filter((q) => q.attempted && q.myAnswers).flatMap((q) => {
		return buildQuizPerformanceReport(q, q.myAnswers || {}, null, q.questionFeedback).items.filter((it) => it.status === "incorrect" || it.status === "unanswered").map((it) => it.question);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 animate-in fade-in",
		children: [
			activeQuiz && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-white border-b border-slate-200 text-slate-900 p-5 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-0.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] text-[#1677c7] font-bold block",
									children: "اختبار تقييم مستوى فوري"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-black text-base sm:text-lg",
									children: activeQuiz.title
								})]
							}), !quizSubmitted ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bg-white/15 px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-4 h-4 text-amber-300" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									Math.floor(timeLeft / 60),
									":",
									(timeLeft % 60).toString().padStart(2, "0")
								] })]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bg-emerald-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "اكتمل الاختبار" })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "p-6 overflow-y-auto space-y-6 flex-1 text-slate-800",
							children: !quizSubmitted ? (() => {
								const curQ = activeQuiz.questions[currentQuestionIndex];
								const qType = curQ.type || "mcq";
								const curVal = selectedAnswers[curQ.id];
								const letters = [
									"أ",
									"ب",
									"ج",
									"د",
									"هـ",
									"و"
								];
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex flex-wrap gap-1.5 pb-2 border-b border-slate-100",
											children: activeQuiz.questions.map((item, idx) => {
												const answered = isQuestionAnswered(item);
												return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: () => setCurrentQuestionIndex(idx),
													className: `w-7 h-7 rounded-lg text-[11px] font-black cursor-pointer transition-all ${idx === currentQuestionIndex ? "bg-[#1677c7] text-white ring-2 ring-[#1677c7]/30" : answered ? "bg-emerald-100 text-emerald-700 border border-emerald-300" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`,
													children: idx + 1
												}, item.id);
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between text-xs font-bold text-slate-500",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
													"السؤال ",
													currentQuestionIndex + 1,
													" من ",
													activeQuiz.questions.length
												] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "px-2 py-0.5 rounded-full bg-sky-50 text-[#1677c7] border border-sky-200 text-[10px]",
													children: QUIZ_TYPE_META[qType].badge
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
												"الدرجة: ",
												curQ.points,
												" ",
												curQ.points === 1 ? "نقطة" : "نقاط"
											] })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "font-extrabold text-base sm:text-lg text-slate-900 leading-relaxed whitespace-pre-line",
											children: curQ.question
										}),
										qType === "true_false" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "grid grid-cols-2 gap-3",
											children: (curQ.options.length ? curQ.options : ["صح", "خطأ"]).map((opt, idx) => {
												return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													type: "button",
													onClick: () => setQuestionAnswer(curQ.id, idx),
													className: `p-4 rounded-2xl border-2 text-center transition-all cursor-pointer font-black text-base ${curVal === idx ? idx === 0 ? "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-xs" : "bg-rose-50 border-rose-500 text-rose-700 shadow-xs" : "bg-white border-slate-200 hover:border-slate-300 text-slate-700"}`,
													children: [idx === 0 ? "✓ " : "✗ ", opt]
												}, idx);
											})
										}),
										qType === "mcq" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "space-y-2.5",
											children: curQ.options.map((opt, idx) => {
												const isSelected = curVal === idx;
												return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													type: "button",
													onClick: () => setQuestionAnswer(curQ.id, idx),
													className: `w-full p-4 rounded-2xl border text-right transition-all flex items-center gap-3 cursor-pointer text-sm font-semibold ${isSelected ? "bg-sky-50 border-[#1677c7] text-[#0f233a] shadow-xs" : "bg-white border-slate-200 hover:border-slate-300 text-slate-700"}`,
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: `w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${isSelected ? "bg-[#1677c7] text-white" : "bg-slate-100 text-slate-500"}`,
														children: letters[idx] || idx + 1
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "flex-1",
														children: opt
													})]
												}, idx);
											})
										}),
										qType === "multi_select" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[11px] font-bold text-[#1677c7]",
												children: "يمكنك تحديد أكثر من خيار صحيح:"
											}), curQ.options.map((opt, idx) => {
												const isSelected = (Array.isArray(curVal) ? curVal : []).includes(idx);
												return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													type: "button",
													onClick: () => toggleMultiOption(curQ.id, idx),
													className: `w-full p-4 rounded-2xl border text-right transition-all flex items-center gap-3 cursor-pointer text-sm font-semibold ${isSelected ? "bg-sky-50 border-[#1677c7] text-[#0f233a] shadow-xs" : "bg-white border-slate-200 hover:border-slate-300 text-slate-700"}`,
													children: [isSelected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquareCheckBig, { className: "w-5 h-5 text-[#1677c7] shrink-0" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "w-5 h-5 text-slate-300 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "flex-1",
														children: opt
													})]
												}, idx);
											})]
										}),
										(qType === "short_answer" || qType === "fill_blank") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "block text-xs font-bold text-slate-600",
												children: qType === "fill_blank" ? "اكتب الكلمة أو العبارة الناقصة في الفراغ:" : "اكتب إجابتك المختصرة:"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "text",
												dir: "auto",
												value: typeof curVal === "string" ? curVal : "",
												onChange: (e) => setQuestionAnswer(curQ.id, e.target.value),
												placeholder: "اكتب إجابتك هنا...",
												className: "w-full p-4 rounded-2xl border-2 border-slate-200 focus:border-[#1677c7] bg-slate-50 focus:bg-white text-sm font-bold outline-none transition-all"
											})]
										}),
										qType === "essay" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center justify-between text-xs",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-bold text-slate-600",
														children: "اكتب إجابتك المفصلة:"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-[11px] text-amber-600 font-bold",
														children: "يراجعه المعلم بعد التسليم"
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
													dir: "auto",
													rows: 5,
													value: typeof curVal === "string" ? curVal : "",
													onChange: (e) => setQuestionAnswer(curQ.id, e.target.value),
													placeholder: "اشرح إجابتك بوضوح...",
													className: "w-full p-4 rounded-2xl border-2 border-slate-200 focus:border-[#1677c7] bg-slate-50 focus:bg-white text-sm leading-relaxed outline-none transition-all"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-left text-[11px] text-slate-400",
													children: typeof curVal === "string" && curVal.trim() ? `${curVal.trim().split(/\s+/).length} كلمة` : "0 كلمة"
												})
											]
										})
									]
								});
							})() : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-6 text-center animate-in zoom-in-95",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-2xl shadow-inner",
										children: "🎉"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
											className: "text-2xl font-black text-slate-900",
											children: [
												"أحسنت عملاً يا ",
												currentUserName,
												"!"
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-slate-500",
											children: quizResult?.needsManualGrading ? "تم احتساب درجات الأسئلة الآلية مبدئياً، وبانتظار مراجعة المعلم للأسئلة المقالية" : "تم تصحيح إجاباتك تلقائياً وحساب نتيجتك"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "bg-slate-50 p-5 rounded-2xl border border-slate-200 max-w-sm mx-auto flex items-center justify-around",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs text-slate-400 block font-bold",
												children: quizResult?.needsManualGrading ? "الدرجة المبدئية" : "النتيجة النهائية"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-3xl font-black text-emerald-600",
												children: [
													quizScore,
													" ",
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "text-sm font-normal text-slate-400",
														children: ["/ ", quizResult?.total ?? 0]
													})
												]
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-10 w-px bg-slate-200" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs text-slate-400 block font-bold",
												children: "نقاط المكافأة"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-2xl font-black text-amber-500",
												children: [
													"+",
													Math.min(quizScore * 10, 100),
													" XP"
												]
											})] })
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-5 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl text-amber-950 text-right space-y-2 relative overflow-hidden shadow-xs",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between border-b border-amber-200 pb-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-xs font-black uppercase text-amber-800",
													children: "شهادة إتمام اختبار مصدقة · NEMVIA"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "w-5 h-5 text-amber-600" })]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-xs leading-relaxed",
												children: [
													"تشهد منصة ",
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "NEMVIA" }),
													" بأن الطالب/ـة ",
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: currentUserName }),
													" قد أتمّ اختبار ",
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("em", { children: [
														"\"",
														activeQuiz.title,
														"\""
													] }),
													"."
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "pt-2 border-t border-amber-200/80 flex items-center justify-between text-[11px] text-amber-900",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "التحقق: NEMVIA-CERT-PASS" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-bold",
													children: "توقيع المؤسس: محمد جمال نعمه ✍️"
												})]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuizPerformanceReportPanel, {
										quiz: activeQuiz,
										report: buildQuizPerformanceReport(activeQuiz, selectedAnswers, quizResult, activeQuiz.questionFeedback),
										teacherFeedback: activeQuiz.teacherFeedback,
										onStartChallenge: (qs) => {
											const title = activeQuiz.title;
											setActiveQuiz(null);
											setChallengeData({
												title: `تحدي أخطاء: ${title}`,
												questions: qs
											});
										}
									})
								]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center",
							children: !quizSubmitted ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1)),
								disabled: currentQuestionIndex === 0,
								className: "px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl text-xs disabled:opacity-40 cursor-pointer",
								children: "السابق"
							}), currentQuestionIndex < activeQuiz.questions.length - 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setCurrentQuestionIndex(currentQuestionIndex + 1),
								className: "px-5 py-2 bg-[#1677c7] text-white font-bold rounded-xl text-xs cursor-pointer",
								children: "التالي ←"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: handleFinishQuiz,
								className: "px-6 py-2 bg-emerald-600 text-white font-black rounded-xl text-xs shadow-md shadow-emerald-700/20 cursor-pointer",
								children: "تسليم الإجابات وإنهاء الاختبار ✓"
							})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setActiveQuiz(null),
								className: "w-full py-2.5 bg-[#0f233a] text-white font-bold rounded-xl text-xs cursor-pointer",
								children: "إغلاق ومتابعة الدروس"
							})
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col lg:flex-row lg:items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-xl font-black text-slate-900",
					children: "المحتوى الأكاديمي واختبارات المستوى"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-slate-500",
					children: "دروس تفاعلية، اختبارات ذكية، بنك أسئلة، وتقارير أداء شاملة"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [
						(currentRole === "teacher" || currentRole === "admin") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setShowQuestionBank(true),
							className: "px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Library, { className: "w-3.5 h-3.5 text-[#1677c7]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								"بنك الأسئلة (",
								loadQuestionBank(currentUserId).length,
								")"
							] })]
						}),
						canBuild && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-xs font-bold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setShowLessonBuilder(true),
								className: "px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl cursor-pointer whitespace-nowrap",
								children: "+ درس"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => {
									setQuizBuilderPreset(null);
									setShowQuizBuilder(true);
								},
								className: "px-3 py-2 bg-[#1677c7] hover:bg-[#125fa0] text-white rounded-xl cursor-pointer whitespace-nowrap",
								children: "+ اختبار"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl text-xs font-bold flex-wrap",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setActiveTab("quizzes"),
									className: `px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${activeTab === "quizzes" ? "bg-white text-[#1677c7] shadow-xs" : "text-slate-600"}`,
									children: [
										"الاختبارات (",
										quizzes.length,
										")"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setActiveTab("lessons"),
									className: `px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${activeTab === "lessons" ? "bg-white text-[#1677c7] shadow-xs" : "text-slate-600"}`,
									children: [
										"الدروس (",
										lessons.length,
										")"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setActiveTab("courses"),
									className: `px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${activeTab === "courses" ? "bg-white text-[#1677c7] shadow-xs" : "text-slate-600"}`,
									children: [
										"الدورات (",
										courses.length,
										")"
									]
								}),
								(currentRole === "teacher" || currentRole === "admin") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setActiveTab("analytics"),
									className: `px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1 whitespace-nowrap ${activeTab === "analytics" ? "bg-white text-[#1677c7] shadow-xs" : "text-slate-600"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "تحليلات المعلم" })]
								})
							]
						})
					]
				})]
			}),
			showLessonBuilder && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LessonBuilderModal, {
				classes: myClasses,
				teacherName: currentUserName,
				onClose: () => setShowLessonBuilder(false),
				onSubmit: onAddLesson,
				onUpload
			}),
			showQuizBuilder && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuizBuilderModal, {
				classes: myClasses,
				userId: currentUserId,
				initialTitle: quizBuilderPreset?.title,
				initialQuestions: quizBuilderPreset?.questions,
				onClose: () => {
					setShowQuizBuilder(false);
					setQuizBuilderPreset(null);
				},
				onSubmit: onAddQuiz
			}),
			showQuestionBank && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuestionBankModal, {
				userId: currentUserId,
				quizzes,
				onClose: () => setShowQuestionBank(false),
				onCreateQuizFromBank: (qs, suggestedTitle) => {
					setShowQuestionBank(false);
					if (myClasses.length > 0) {
						setQuizBuilderPreset({
							title: suggestedTitle,
							questions: qs
						});
						setShowQuizBuilder(true);
					}
				},
				onPrintQuestions: (title, qs) => {
					setShowQuestionBank(false);
					setPrintExam({
						title,
						questions: qs
					});
				}
			}),
			printExam && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrintableExamModal, {
				title: printExam.title,
				classTitle: printExam.classTitle,
				defaultMinistryName: printExam.defaultMinistryName,
				defaultSchoolName: printExam.defaultSchoolName,
				timeLimitMinutes: printExam.timeLimitMinutes,
				questions: printExam.questions,
				onClose: () => setPrintExam(null)
			}),
			challengeData && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MistakeChallengeModal, {
				title: challengeData.title,
				mistakes: challengeData.questions,
				onClose: () => setChallengeData(null),
				onRewardPoints
			}),
			(activeTab === "quizzes" && quizzes.length === 0 || activeTab === "lessons" && lessons.length === 0 || activeTab === "courses" && courses.length === 0) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white rounded-2xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500",
				children: [
					"لا يوجد محتوى هنا بعد. انضم إلى صف باستخدام رمز الانضمام",
					canBuild ? "، أو أضف درساً أو اختباراً من الأزرار أعلاه" : " ليظهر لك محتواه",
					"."
				]
			}),
			activeTab === "analytics" && (currentRole === "teacher" || currentRole === "admin") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeacherAnalyticsPanel, {
				quizzes,
				classes,
				assignments,
				submissions,
				currentUserId
			}),
			activeTab === "quizzes" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [currentRole === "student" && allStudentMistakes.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white border border-amber-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-0.5 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-black text-slate-900 flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "w-4 h-4 text-amber-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "وضع التحدي التفاعلي: حوّل أخطاءك السابقة إلى نقاط قوة" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-slate-600",
							children: [
								"لديك ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "tabular-nums",
									children: allStudentMistakes.length
								}),
								" سؤال لم تجب عنه بشكل صحيح في اختباراتك السابقة — أعد حلّها واكسب +15 XP لكل سؤال تتقنه."
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setChallengeData({
							title: "تحدي مراجعة الأخطاء الشامل",
							questions: allStudentMistakes
						}),
						className: "px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "ابدأ التحدي الآن" })]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid md:grid-cols-2 gap-4",
					children: quizzes.map((q) => {
						const isOwnerOrAdmin = currentRole === "admin" || classes.find((c) => c.id === q.class_id)?.teacher_id === currentUserId;
						const typesInQuiz = [...new Set(q.questions.map((qq) => qq.type || "mcq"))];
						const pendingReviewCount = (q.attempts || []).filter((a) => a.needsManualGrading).length;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-[#1677c7] transition-all flex flex-col justify-between space-y-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200",
											children: typesInQuiz.includes("essay") ? "تصحيح آلي + مراجعة المعلم" : "تصحيح تلقائي فوري"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-xs text-slate-400 font-mono flex items-center gap-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-3.5 h-3.5" }),
												q.timeLimitMinutes,
												" دقائق"
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-extrabold text-slate-900 text-base",
										children: q.title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-slate-600 leading-relaxed",
										children: q.description
									}),
									typesInQuiz.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex flex-wrap gap-1 pt-1",
										children: typesInQuiz.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600",
											children: QUIZ_TYPE_META[t]?.badge || t
										}, t))
									}),
									q.teacherFeedback && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-[11px] bg-sky-50 text-[#0f233a] p-2 rounded-xl border border-sky-100",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "ملاحظة المعلم:" }),
											" ",
											q.teacherFeedback
										]
									}),
									q.attempted && q.questionFeedback && Object.keys(q.questionFeedback).length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "inline-flex items-center gap-1.5 text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-xl border border-indigo-100",
										children: [Object.values(q.questionFeedback).some((f) => f.audio_url) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "w-3.5 h-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											"أضاف المعلم تغذية راجعة على ",
											Object.keys(q.questionFeedback).length,
											" ",
											Object.keys(q.questionFeedback).length === 1 ? "سؤال" : "أسئلة"
										] })]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-slate-400",
									children: [
										"الأسئلة: ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: q.questions.length }),
										" · إنجاز: ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: q.attemptsCount })
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center gap-2",
									children: [
										q.questions.length > 0 && (() => {
											const qCls = classes.find((c) => c.id === q.class_id);
											const qSchool = qCls?.school_id ? schools.find((s) => s.id === qCls.school_id) : void 0;
											const qMinistry = qSchool?.ministry_id ? ministries.find((m) => m.id === qSchool.ministry_id) : void 0;
											return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: () => downloadQuizAsWordDoc({
													title: q.title,
													classTitle: q.class_title,
													ministryName: qMinistry?.name || "وزارة التربية والتعليم / المجمع التعليمي",
													schoolName: qSchool?.name || "منصة NEMVIA التعليمية",
													instructions: q.description || "اقرأ كل سؤال بعناية ثم أجب في المكان المخصص.",
													timeLimitMinutes: q.timeLimitMinutes,
													questions: q.questions,
													withAnswers: false
												}),
												className: "px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold rounded-xl cursor-pointer flex items-center gap-1",
												title: "تنزيل ورقة الاختبار بصيغة Microsoft Word (.doc)",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Word" })]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: () => setPrintExam({
													title: q.title,
													classTitle: q.class_title,
													defaultMinistryName: qMinistry?.name,
													defaultSchoolName: qSchool?.name,
													timeLimitMinutes: q.timeLimitMinutes,
													questions: q.questions
												}),
												className: "px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold rounded-xl cursor-pointer flex items-center gap-1",
												title: "معاينة وطباعة الاختبار أو تعديل الترويسة",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "معاينة / PDF" })]
											})] });
										})(),
										isOwnerOrAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: () => openGradingModal(q),
											className: "px-3 py-2 bg-sky-50 hover:bg-sky-100 text-[#1677c7] font-bold rounded-xl cursor-pointer flex items-center gap-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "w-3.5 h-3.5" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
													"الإجابات (",
													q.attemptsCount,
													")"
												] }),
												pendingReviewCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[10px]",
													children: pendingReviewCount
												})
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => onDeleteQuiz(q.id),
											className: "px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold rounded-xl cursor-pointer",
											children: "حذف"
										})] }),
										q.attempted ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: `px-3 py-2 border font-bold rounded-xl ${q.needsManualGrading ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"}`,
												children: q.needsManualGrading ? `بانتظار التصحيح · ${q.myScore}` : `تم الحل ✓ · نتيجتك ${q.myScore}`
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: () => setReportQuizId(q.id),
												className: "px-3.5 py-2 bg-[#0f233a] hover:bg-[#1677c7] text-white font-bold rounded-xl cursor-pointer flex items-center gap-1.5 transition-colors",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "تقرير الأداء" })]
											})]
										}) : q.questions.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-slate-400",
											children: "لا توجد أسئلة"
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: () => handleStartQuiz(q),
											className: "px-4 py-2 bg-[#1677c7] hover:bg-[#125fa0] text-white font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "ابدأ الاختبار الآن" })]
										})
									]
								})]
							})]
						}, q.id);
					})
				})]
			}),
			reportQuiz && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4",
				dir: "rtl",
				onClick: () => setReportQuizId(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl",
					onClick: (e) => e.stopPropagation(),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-5 bg-white border-b border-slate-200 text-slate-900 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] text-[#1677c7] font-bold block",
								children: "تحليل الأداء ونقاط القوة والضعف"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-black text-base sm:text-lg",
								children: reportQuiz.title
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setReportQuizId(null),
								className: "p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-5 h-5" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "p-5 overflow-y-auto space-y-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuizPerformanceReportPanel, {
								quiz: reportQuiz,
								report: buildQuizPerformanceReport(reportQuiz, reportQuiz.myAnswers || {}, null, reportQuiz.questionFeedback),
								teacherFeedback: reportQuiz.teacherFeedback,
								onStartChallenge: (qs) => {
									const title = reportQuiz.title;
									setReportQuizId(null);
									setChallengeData({
										title: `تحدي أخطاء: ${title}`,
										questions: qs
									});
								}
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "p-4 bg-slate-50 border-t border-slate-200",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setReportQuizId(null),
								className: "w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs cursor-pointer",
								children: "إغلاق التقرير"
							})
						})
					]
				})
			}),
			gradingQuiz && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4",
				dir: "rtl",
				onClick: closeGradingModal,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl",
					onClick: (e) => e.stopPropagation(),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-5 bg-white border-b border-slate-200 text-slate-900 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "font-black text-base",
							children: ["إجابات وتصحيح: ", gradingQuiz.title]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[11px] text-slate-500",
							children: [
								(gradingQuiz.attempts || []).length,
								" محاولة · الدرجة الكاملة: ",
								gradingQuiz.questions.reduce((s, x) => s + x.points, 0),
								" · يدعم التغذية النصية والصوتية والمساعدة بالذكاء"
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: closeGradingModal,
							className: "p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-5 h-5" })
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-5 overflow-y-auto space-y-4",
						children: [audioError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: audioError }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setAudioError(null),
								className: "text-rose-500 hover:text-rose-800 cursor-pointer",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
							})]
						}), (gradingQuiz.attempts || []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-center text-sm text-slate-400 py-8",
							children: "لم يحلّ أي طالب هذا الاختبار بعد."
						}) : (gradingQuiz.attempts || []).map((att) => {
							const edit = attemptEdits[att.id] || {
								score: String(att.score),
								feedback: att.teacherFeedback || "",
								questionFeedback: att.questionFeedback || {}
							};
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3 text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-200",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-black text-slate-900 text-sm",
											children: att.student_name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[11px] text-slate-400 mr-2",
											children: new Date(att.submitted_at).toLocaleString("ar")
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `px-2.5 py-0.5 rounded-full text-[10px] font-bold ${att.needsManualGrading ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-700"}`,
											children: att.needsManualGrading ? "بانتظار تصحيح المقالي" : "مُصحّح"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "space-y-3",
										children: gradingQuiz.questions.map((qq, idx) => {
											const qType = qq.type || "mcq";
											const ans = att.answers?.[qq.id];
											const displayAns = formatQuestionAnswerText(qq, ans);
											const qFb = edit.questionFeedback[qq.id] || {};
											const targetKey = `${att.id}:${qq.id}`;
											const isRecordingThis = recordingTarget?.attemptId === att.id && recordingTarget?.questionId === qq.id;
											const isUploadingThis = uploadingAudioKey === targetKey;
											return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "p-3 bg-white rounded-2xl border border-slate-200/90 space-y-2.5",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-start justify-between gap-2 font-bold text-slate-800",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
															idx + 1,
															". ",
															qq.question
														] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "text-[10px] text-slate-500 shrink-0",
															children: [
																QUIZ_TYPE_META[qType].badge,
																" (",
																qq.points,
																" ن)"
															]
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
														className: "text-slate-700 whitespace-pre-line",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
																className: "text-[#1677c7]",
																children: "إجابة الطالب:"
															}),
															" ",
															displayAns
														]
													}),
													(qType === "mcq" || qType === "true_false") && qq.correctOptionIndex >= 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
														className: "text-[11px] text-emerald-700",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "الإجابة الصحيحة:" }),
															" ",
															qq.options[qq.correctOptionIndex] ?? "—"
														]
													}),
													qType === "multi_select" && qq.correctOptionIndices?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
														className: "text-[11px] text-emerald-700",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "الإجابات الصحيحة:" }),
															" ",
															qq.correctOptionIndices.map((i) => qq.options[i]).join("، ")
														]
													}) : null,
													(qType === "short_answer" || qType === "fill_blank") && qq.acceptedAnswers?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
														className: "text-[11px] text-emerald-700",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "الإجابات المقبولة:" }),
															" ",
															qq.acceptedAnswers.join(" / ")
														]
													}) : null,
													qType === "essay" && qq.modelAnswer && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
														className: "text-[11px] text-emerald-800 bg-emerald-50 p-2 rounded-lg",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "الإجابة النموذجية:" }),
															" ",
															qq.modelAnswer
														]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "pt-2 border-t border-slate-100 space-y-2 bg-slate-50/70 p-2.5 rounded-xl",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "grid sm:grid-cols-4 gap-2 items-start",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																	className: "relative",
																	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
																		type: "number",
																		min: 0,
																		max: qq.points,
																		step: "0.5",
																		value: qFb.points_awarded ?? "",
																		onChange: (e) => {
																			const val = e.target.value;
																			updateQuestionFeedback(att.id, qq.id, { points_awarded: val === "" ? void 0 : Math.max(0, Math.min(qq.points, Number(val))) });
																		},
																		placeholder: `من ${qq.points}`,
																		className: "w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#1677c7]",
																		title: "درجة هذا السؤال"
																	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																		className: "absolute left-2 top-2 text-[10px] text-slate-400",
																		children: ["/", qq.points]
																	})]
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
																	rows: 1,
																	value: qFb.text || "",
																	onChange: (e) => updateQuestionFeedback(att.id, qq.id, { text: e.target.value }),
																	placeholder: "تغذية راجعة نصية لهذا السؤال (اختياري)...",
																	className: "sm:col-span-3 w-full p-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-[#1677c7]"
																})]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "flex flex-wrap items-center gap-2",
																children: [
																	isRecordingThis ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
																		type: "button",
																		onClick: stopAudioRecording,
																		className: "px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-[11px] font-bold flex items-center gap-1.5 cursor-pointer animate-pulse",
																		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "w-3 h-3 fill-current" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
																			"إيقاف التسجيل (",
																			Math.floor(recordSeconds / 60),
																			":",
																			(recordSeconds % 60).toString().padStart(2, "0"),
																			")"
																		] })]
																	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
																		type: "button",
																		disabled: isUploadingThis,
																		onClick: () => startAudioRecording(att.id, qq.id),
																		className: "px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-[11px] font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50",
																		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "تسجيل ملاحظة صوتية" })]
																	}),
																	/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
																		className: "px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-[11px] font-bold flex items-center gap-1.5 cursor-pointer",
																		children: [
																			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "w-3.5 h-3.5" }),
																			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "رفع ملف صوتي" }),
																			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
																				type: "file",
																				accept: "audio/*",
																				className: "hidden",
																				onChange: (e) => {
																					const f = e.target.files?.[0];
																					e.target.value = "";
																					handleAudioFilePick(att.id, qq.id, f);
																				}
																			})
																		]
																	}),
																	/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
																		type: "button",
																		disabled: aiDraftKey === targetKey,
																		onClick: () => handleAiDraftFeedback(att, qq),
																		className: "px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-[#1677c7] border border-sky-200 rounded-xl text-[11px] font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50",
																		children: [aiDraftKey === targetKey ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: aiDraftKey === targetKey ? "جاري الصياغة..." : "صياغة بالذكاء" })]
																	}),
																	isUploadingThis && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																		className: "inline-flex items-center gap-1 text-[11px] font-bold text-[#1677c7]",
																		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "جاري رفع الصوت..." })]
																	})
																]
															}),
															qFb.audio_url && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "space-y-2 bg-white p-2.5 rounded-xl border border-indigo-200",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																	className: "flex items-center gap-2",
																	children: [
																		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "w-4 h-4 text-indigo-600 shrink-0" }),
																		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("audio", {
																			controls: true,
																			preload: "metadata",
																			src: qFb.audio_url,
																			className: "w-full h-8"
																		}),
																		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
																			type: "button",
																			disabled: transcribingKey === targetKey,
																			onClick: () => handleManualTranscribeUrl(att.id, qq.id, qFb.audio_url),
																			className: "px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer shrink-0 disabled:opacity-50",
																			title: "تحويل التسجيل الصوتي إلى نص مكتوب بالذكاء",
																			children: [transcribingKey === targetKey ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-3 h-3 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-3 h-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: transcribingKey === targetKey ? "تفريغ..." : "تفريغ لنص" })]
																		}),
																		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																			type: "button",
																			onClick: () => updateQuestionFeedback(att.id, qq.id, {
																				audio_url: void 0,
																				transcript: void 0
																			}),
																			className: "p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer shrink-0",
																			title: "حذف التسجيل الصوتي",
																			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3.5 h-3.5" })
																		})
																	]
																}), (qFb.transcript !== void 0 || transcribingKey === targetKey) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																	className: "space-y-1",
																	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																		className: "text-[10px] font-bold text-indigo-700 block",
																		children: "النص المفرّغ من التسجيل الصوتي (يظهر للطالب ويمكنك تعديله):"
																	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
																		rows: 2,
																		value: qFb.transcript || "",
																		onChange: (e) => updateQuestionFeedback(att.id, qq.id, { transcript: e.target.value }),
																		placeholder: transcribingKey === targetKey ? "جاري تحويل الصوت إلى نص..." : "النص المكتوب للتسجيل الصوتي...",
																		className: "w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-[11px] outline-none focus:border-[#1677c7]"
																	})]
																})]
															})
														]
													})
												]
											}, qq.id);
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid sm:grid-cols-5 gap-2 pt-2 items-center",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "relative sm:col-span-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "number",
													min: 0,
													step: "0.5",
													value: edit.score,
													onChange: (e) => setAttemptEdits((prev) => ({
														...prev,
														[att.id]: {
															...edit,
															score: e.target.value
														}
													})),
													className: "w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold outline-none focus:border-[#1677c7]",
													placeholder: "الدرجة"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "absolute left-2.5 top-2.5 text-[10px] text-slate-400",
													children: "درجة"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => sumAttemptPointsFromQuestions(gradingQuiz, att),
												className: "py-2.5 px-2.5 bg-sky-50 hover:bg-sky-100 text-[#1677c7] border border-sky-200 font-bold rounded-xl cursor-pointer text-[11px]",
												title: "حساب المجموع الكلي من درجات الأسئلة أعلاه",
												children: "جمع نقاط الأسئلة"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												value: edit.feedback,
												onChange: (e) => setAttemptEdits((prev) => ({
													...prev,
													[att.id]: {
														...edit,
														feedback: e.target.value
													}
												})),
												placeholder: "ملاحظة عامة للطالب (اختياري)",
												className: "sm:col-span-2 p-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#1677c7]"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												disabled: savingAttemptId === att.id || uploadingAudioKey !== null,
												onClick: () => saveAttemptGrade(att),
												className: "py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl cursor-pointer flex items-center justify-center gap-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: savingAttemptId === att.id ? "جاري الحفظ..." : "حفظ الدرجة والتغذية" })]
											})
										]
									})
								]
							}, att.id);
						})]
					})]
				})
			}),
			activeTab === "lessons" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid md:grid-cols-2 gap-4",
					children: lessons.map((ls) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md",
									children: "درس تفاعلي"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-slate-400 font-mono",
									children: ls.duration || ""
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-extrabold text-slate-900 text-base",
								children: ls.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: `text-xs text-slate-600 leading-relaxed whitespace-pre-line ${selectedLesson?.id === ls.id ? "" : "line-clamp-3"}`,
								children: ls.content
							}),
							selectedLesson?.id === ls.id && ls.video_url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "aspect-video rounded-xl overflow-hidden bg-slate-900",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
									src: ls.video_url,
									title: ls.title,
									className: "w-full h-full",
									allowFullScreen: true,
									allow: "accelerometer; encrypted-media; gyroscope; picture-in-picture"
								})
							}),
							selectedLesson?.id === ls.id && ls.attachment_url && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: ls.attachment_url,
								target: "_blank",
								rel: "noopener noreferrer",
								className: "inline-flex items-center gap-1.5 px-3 py-2 bg-sky-50 text-[#1677c7] font-bold rounded-xl text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "w-3.5 h-3.5" }),
									" تحميل المرفق: ",
									ls.attachment_name
								]
							}),
							selectedLesson?.id === ls.id && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-center justify-between gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-black text-slate-900 flex items-center gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-3.5 h-3.5 text-[#1677c7]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "تلخيص وأسئلة مراجعة بالذكاء الاصطناعي" })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											disabled: lessonAiLoadingId === ls.id,
											onClick: () => handleSummarizeLesson(ls),
											className: "px-3 py-1.5 bg-[#1677c7] hover:bg-[#125fa0] disabled:opacity-50 text-white font-bold rounded-lg text-[11px] flex items-center gap-1.5 cursor-pointer whitespace-nowrap",
											children: [lessonAiLoadingId === ls.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: lessonSummaries[ls.id] ? "تحديث الملخص" : "لخّص الدرس الآن" })]
										})]
									}),
									lessonAiError[ls.id] && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] text-rose-600 font-bold",
										children: lessonAiError[ls.id]
									}),
									lessonSummaries[ls.id] && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2.5 pt-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-slate-700 leading-relaxed bg-white p-3 rounded-xl border border-slate-200",
												children: lessonSummaries[ls.id].summary
											}),
											lessonSummaries[ls.id].keyPoints.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "bg-white p-3 rounded-xl border border-slate-200 space-y-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-black text-slate-800 block text-[11px]",
													children: "أهم النقاط الرئيسية:"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
													className: "list-disc list-inside space-y-1 text-[11px] text-slate-600",
													children: lessonSummaries[ls.id].keyPoints.map((pt, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: pt }, idx))
												})]
											}),
											lessonSummaries[ls.id].checkQuestions.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "bg-sky-50/70 p-3 rounded-xl border border-sky-200 space-y-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-black text-[#0f233a] block text-[11px]",
													children: "أسئلة تحقق سريعة مع الحل:"
												}), lessonSummaries[ls.id].checkQuestions.map((cq, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "text-[11px] space-y-0.5 border-b last:border-none border-sky-100 pb-1.5 last:pb-0",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
														className: "font-bold text-slate-900",
														children: [
															"س",
															idx + 1,
															": ",
															cq.question
														]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
														className: "text-emerald-800",
														children: ["ج: ", cq.answer]
													})]
												}, idx))]
											})
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pt-2 border-t border-slate-100 flex items-center justify-between text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-slate-500 font-medium",
										children: ["الأستاذ: ", ls.teacher_name]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [(ls.teacher_id === currentUserId || currentRole === "admin") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => onDeleteLesson(ls.id),
											className: "text-rose-600 font-bold cursor-pointer",
											children: "حذف"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => setSelectedLesson(selectedLesson?.id === ls.id ? null : ls),
											className: "text-[#1677c7] font-bold cursor-pointer",
											children: selectedLesson?.id === ls.id ? "إخفاء" : "فتح الدرس"
										})]
									}),
									ls.attachment_name && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[11px] text-[#1677c7] font-bold flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "w-3 h-3" }), ls.attachment_name]
									})
								]
							})
						]
					}, ls.id))
				})
			}),
			activeTab === "courses" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid md:grid-cols-2 gap-4",
				children: courses.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "h-40 relative overflow-hidden bg-slate-100",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: c.image_url,
							alt: c.title,
							className: "w-full h-full object-cover"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "absolute top-3 right-3 bg-[#0f233a]/80 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-lg",
							children: c.category
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-5 space-y-2.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-extrabold text-slate-900 text-base",
								children: c.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-slate-600 leading-relaxed",
								children: c.description
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									c.lessons_count,
									" دروس · ",
									c.students_count,
									" طالب مسجل"
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-bold text-amber-500",
									children: ["★ ", c.rating]
								})]
							})
						]
					})]
				}, c.id))
			})
		]
	});
};
export { CoursesView };
