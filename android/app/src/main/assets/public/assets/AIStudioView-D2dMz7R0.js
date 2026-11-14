import { r as __toESM } from "./rolldown-runtime-SbdDWaPq.js";
import { At as CircleAlert, D as Send, Nt as Check, Ot as CircleQuestionMark, Q as LoaderCircle, Rt as Calculator, Ut as BookOpen, Yt as require_react, gt as FileText, m as Trash2, xt as Copy, y as Sparkles } from "./icons-y6mUmdUg.js";
import { t as askTutor } from "./ai-DYfzclpk.js";
import { t as require_jsx_runtime } from "./react-vendor-CpCOhAWp.js";
// src/components/views/AIStudioView.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var MODES = [
	{
		id: "explain",
		label: "شرح مبسّط",
		desc: "تبسيط المفاهيم خطوة بخطوة مع أمثلة",
		icon: BookOpen
	},
	{
		id: "solve",
		label: "حل مسألة",
		desc: "تفصيل خطوات الحل الرياضي أو العلمي",
		icon: Calculator
	},
	{
		id: "summarize",
		label: "تلخيص مركز",
		desc: "نقاط رئيسية مركّزة للمراجعة السريعة",
		icon: FileText
	},
	{
		id: "practice",
		label: "تدريب فوري",
		desc: "أسئلة تدريبية مع إجابات للتحقق",
		icon: CircleQuestionMark
	}
];
var QUICK_PROMPTS = [
	"اشرح لي مفهوم التكامل في الرياضيات بمثال بسيط من الحياة اليومية",
	"لخّص لي أهم النقاط في الدرس المحدد على شكل خطوات مراجعة",
	"أعطني 3 أسئلة تدريبية قصيرة لاختبار فهمي مع الإجابة النموذجية",
	"حل هذه المسألة خطوة بخطوة: 2x² - 5x - 3 = 0"
];
var AIStudioView = ({ currentProfile, lessons, quizzes, onRewardXP }) => {
	const [mode, setMode] = (0, import_react.useState)("explain");
	const [selectedContextId, setSelectedContextId] = (0, import_react.useState)("");
	const [messages, setMessages] = (0, import_react.useState)([{
		role: "assistant",
		text: `أهلاً ${currentProfile.display_name}! أنا المعلّم الذكي في NEMVIA. اختر وضع المساعدة أو ارفق درساً من صفوفك، واكتب سؤالك وسأساعدك فوراً.`
	}]);
	const [input, setInput] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [copiedIdx, setCopiedIdx] = (0, import_react.useState)(null);
	const listEndRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		listEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages.length, busy]);
	const resolvedContext = (() => {
		if (!selectedContextId) return "";
		if (selectedContextId.startsWith("lesson:")) {
			const l = lessons.find((x) => `lesson:${x.id}` === selectedContextId);
			return l ? `الدرس: ${l.title}\n${l.content}` : "";
		}
		if (selectedContextId.startsWith("quiz:")) {
			const q = quizzes.find((x) => `quiz:${x.id}` === selectedContextId);
			return q ? `الاختبار: ${q.title}\n${q.description}\nالأسئلة:\n${q.questions.map((qq, i) => `${i + 1}. ${qq.question}`).join("\n")}` : "";
		}
		return "";
	})();
	const sendMessage = async (textOverride) => {
		const content = (textOverride ?? input).trim();
		if (!content || busy) return;
		setError(null);
		const nextHistory = [...messages, {
			role: "user",
			text: content
		}];
		setMessages(nextHistory);
		if (!textOverride) setInput("");
		setBusy(true);
		try {
			const reply = await askTutor(nextHistory, mode, resolvedContext);
			setMessages((prev) => [...prev, {
				role: "assistant",
				text: reply
			}]);
			onRewardXP?.(5);
		} catch (err) {
			setError(err?.message || "تعذّر الاتصال بالمعلم الذكي");
		} finally {
			setBusy(false);
		}
	};
	const copyMessage = async (text, idx) => {
		try {
			await navigator.clipboard.writeText(text);
			setCopiedIdx(idx);
			setTimeout(() => setCopiedIdx(null), 1500);
		} catch {}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5 animate-in fade-in",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-xs font-bold text-emerald-700",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "استوديو NEMVIA للذكاء الاصطناعي" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-xl sm:text-2xl font-black text-slate-900",
							children: "المعلّم الذكي التفاعلي ومساعد المذاكرة"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-slate-500",
							children: "اسأل عن أي مفهوم، أرفق درساً من صفوفك لتلخيصه أو إنشاء تمارين، واحصل على شرح خطوة بخطوة."
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: selectedContextId,
						onChange: (e) => setSelectedContextId(e.target.value),
						className: "p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-slate-900 max-w-[240px]",
						"aria-label": "إرفاق سياق من دروسك أو اختباراتك",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "بدون سياق مرفق (سؤال عام)"
							}),
							lessons.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
								value: `lesson:${l.id}`,
								children: ["درس: ", l.title]
							}, l.id)),
							quizzes.map((q) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
								value: `quiz:${q.id}`,
								children: ["اختبار: ", q.title]
							}, q.id))
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setMessages([{
							role: "assistant",
							text: `محادثة جديدة جاهزة يا ${currentProfile.display_name}. كيف أساعدك الآن؟`
						}]),
						className: "p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl cursor-pointer",
						title: "محادثة جديدة",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4" })
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 md:grid-cols-4 gap-2.5",
				children: MODES.map((m) => {
					const Icon = m.icon;
					const active = mode === m.id;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setMode(m.id),
						className: `p-3.5 rounded-2xl border text-right transition-all cursor-pointer space-y-1 ${active ? "bg-slate-900 border-slate-900 text-white" : "bg-white border-slate-200 hover:border-slate-300 text-slate-800"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5 text-xs font-black",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: `w-4 h-4 ${active ? "text-amber-300" : "text-slate-600"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: m.label })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: `text-[11px] leading-snug ${active ? "text-slate-300" : "text-slate-500"}`,
							children: m.desc
						})]
					}, m.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col h-[520px]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 bg-slate-50/40",
						children: [
							messages.map((m, i) => {
								const isUser = m.role === "user";
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `flex ${isUser ? "justify-start" : "justify-end"}`,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: `max-w-[85%] sm:max-w-[78%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line space-y-1.5 ${isUser ? "bg-slate-900 text-white rounded-br-sm" : "bg-white border border-slate-200 text-slate-800 rounded-bl-sm"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: m.text }), !isUser && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex justify-end pt-1",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: () => copyMessage(m.text, i),
												className: "inline-flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-slate-700 cursor-pointer",
												children: [copiedIdx === i ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-3 h-3 text-emerald-600" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "w-3 h-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: copiedIdx === i ? "تم النسخ" : "نسخ" })]
											})
										})]
									})
								}, i);
							}),
							busy && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex justify-end",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "bg-white border border-slate-200 px-4 py-3 rounded-2xl text-xs text-slate-600 flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-4 h-4 animate-spin text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "المعلّم الذكي يجهز الإجابة..." })]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref: listEndRef })
						]
					}),
					error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-4 py-2.5 bg-rose-50 border-t border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-4 h-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: error })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "px-4 py-2 bg-white border-t border-slate-100 flex items-center gap-2 overflow-x-auto",
						children: QUICK_PROMPTS.map((q, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							disabled: busy,
							onClick: () => void sendMessage(q),
							className: "px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-bold whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-50",
							children: q
						}, idx))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: (e) => {
							e.preventDefault();
							sendMessage();
						},
						className: "p-3 bg-white border-t border-slate-200 flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: input,
							onChange: (e) => setInput(e.target.value),
							placeholder: "اكتب سؤالك، معادلتك، أو نص الدرس هنا...",
							className: "flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm outline-none focus:border-slate-900 focus:bg-white",
							disabled: busy
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "submit",
							disabled: busy || !input.trim(),
							className: "px-4 py-3 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "إرسال" })]
						})]
					})
				]
			})
		]
	});
};
export { AIStudioView };
