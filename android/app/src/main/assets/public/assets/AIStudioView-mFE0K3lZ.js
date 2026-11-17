import { r as __toESM } from "./rolldown-runtime-SbdDWaPq.js";
import { Ft as FileText, M as Send, P as ScanLine, S as Square, Ut as Copy, Zt as CircleQuestionMark, _n as BookOpen, a as Volume2, an as Check, dn as Calculator, en as CircleAlert, f as Upload, hn as BookmarkPlus, i as VolumeX, ln as Camera, n as X, pt as LoaderCircle, rt as Mic, v as Trash2, w as Sparkles, wn as require_react } from "./icons-Ba0nzYf3.js";
import { l as scanPaperAI, o as generateQuizQuestionsAI, t as askTutor } from "./ai-DSRWe77_.js";
import { r as saveQuestionsToBank } from "./questionBank-BJzuY2YM.js";
import { t as require_jsx_runtime } from "./react-vendor-Dpw1FlJl.js";
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
async function imageFileToCompressedBase64(file) {
	const dataUrl = await new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onerror = () => reject(/* @__PURE__ */ new Error("تعذّر قراءة الصورة"));
		reader.onload = () => resolve(String(reader.result || ""));
		reader.readAsDataURL(file);
	});
	try {
		const img = await new Promise((resolve, reject) => {
			const el = new Image();
			el.onload = () => resolve(el);
			el.onerror = () => reject(/* @__PURE__ */ new Error("invalid image"));
			el.src = dataUrl;
		});
		const maxDim = 1400;
		const scale = Math.min(1, maxDim / Math.max(img.width || maxDim, img.height || maxDim));
		const w = Math.max(1, Math.round(img.width * scale));
		const h = Math.max(1, Math.round(img.height * scale));
		const canvas = document.createElement("canvas");
		canvas.width = w;
		canvas.height = h;
		const ctx = canvas.getContext("2d");
		if (ctx) {
			ctx.drawImage(img, 0, 0, w, h);
			const compressed = canvas.toDataURL("image/jpeg", .85);
			return {
				base64: compressed.split(",")[1] || "",
				mimeType: "image/jpeg",
				previewUrl: compressed
			};
		}
	} catch {}
	return {
		base64: dataUrl.split(",")[1] || "",
		mimeType: file.type || "image/jpeg",
		previewUrl: dataUrl
	};
}
var AIStudioView = ({ currentProfile, lessons, quizzes, onRewardXP }) => {
	const [mode, setMode] = (0, import_react.useState)("explain");
	const [selectedContextId, setSelectedContextId] = (0, import_react.useState)("");
	const [messages, setMessages] = (0, import_react.useState)([{
		role: "assistant",
		text: `أهلاً ${currentProfile.display_name}! أنا المعلّم الذكي في NEMVIA. اختر وضع المساعدة أو ارفق درساً من صفوفك، واكتب سؤالك أو التقط صورة لمسألتك وسأساعدك فوراً.`
	}]);
	const [input, setInput] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [copiedIdx, setCopiedIdx] = (0, import_react.useState)(null);
	const [savingToBankIdx, setSavingToBankIdx] = (0, import_react.useState)(null);
	const [savedBankMsg, setSavedBankMsg] = (0, import_react.useState)({});
	const [listeningVoice, setListeningVoice] = (0, import_react.useState)(false);
	const [speakingIdx, setSpeakingIdx] = (0, import_react.useState)(null);
	const recognitionRef = (0, import_react.useRef)(null);
	const listEndRef = (0, import_react.useRef)(null);
	const [scannerOpen, setScannerOpen] = (0, import_react.useState)(false);
	const [scanMode, setScanMode] = (0, import_react.useState)("solve");
	const [scanExtraPrompt, setScanExtraPrompt] = (0, import_react.useState)("");
	const [scanImage, setScanImage] = (0, import_react.useState)(null);
	const [scanBusy, setScanBusy] = (0, import_react.useState)(false);
	const [scanError, setScanError] = (0, import_react.useState)(null);
	const [scanResult, setScanResult] = (0, import_react.useState)(null);
	const cameraInputRef = (0, import_react.useRef)(null);
	const galleryInputRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		listEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages.length, busy]);
	(0, import_react.useEffect)(() => {
		return () => {
			try {
				recognitionRef.current?.stop?.();
			} catch {}
			if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
		};
	}, []);
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
	const handleScanImagePick = async (e) => {
		const file = e.target.files?.[0];
		e.target.value = "";
		if (!file) return;
		setScanError(null);
		setScanResult(null);
		setScannerOpen(true);
		try {
			const prepared = await imageFileToCompressedBase64(file);
			setScanImage(prepared);
		} catch (err) {
			setScanError(err?.message || "تعذّر تجهيز الصورة");
		}
	};
	const runPaperScan = async () => {
		if (!scanImage || scanBusy) return;
		setScanBusy(true);
		setScanError(null);
		try {
			const result = await scanPaperAI({
				imageBase64: scanImage.base64,
				mimeType: scanImage.mimeType,
				mode: scanMode,
				extraPrompt: scanExtraPrompt.trim() || void 0
			});
			setScanResult(result);
			onRewardXP?.(10);
		} catch (err) {
			setScanError(err?.message || "تعذّر تحليل الورقة بالذكاء الاصطناعي.");
		} finally {
			setScanBusy(false);
		}
	};
	const appendScanToChat = () => {
		if (!scanResult) return;
		const summaryText = [
			scanResult.extractedText ? `📄 النص المستخرج:\n${scanResult.extractedText}` : "",
			scanResult.analysis ? `🔍 التحليل:\n${scanResult.analysis}` : "",
			scanResult.steps.length ? `📝 الخطوات:\n${scanResult.steps.map((s, i) => `${i + 1}. ${s}`).join("\n")}` : "",
			scanResult.finalAnswer ? `✅ الخلاصة / النتيجة:\n${scanResult.finalAnswer}` : ""
		].filter(Boolean).join("\n\n");
		setMessages((prev) => [
			...prev,
			{
				role: "user",
				text: `📷 مسح ورقة (${scanMode === "solve" ? "حل مسألة" : scanMode === "grade" ? "تصحيح إجابة" : "تلخيص ملاحظات"})`
			},
			{
				role: "assistant",
				text: summaryText
			}
		]);
		setScannerOpen(false);
	};
	const copyMessage = async (text, idx) => {
		try {
			await navigator.clipboard.writeText(text);
			setCopiedIdx(idx);
			setTimeout(() => setCopiedIdx(null), 1500);
		} catch {}
	};
	const handleSaveReplyToQuestionBank = async (text, idx) => {
		if (savingToBankIdx !== null) return;
		setSavingToBankIdx(idx);
		setError(null);
		try {
			const topicPrompt = `استخرج وحوّل هذا المحتوى التعليمي إلى 3 أسئلة تقييمية منظمة:\n${text.slice(0, 3500)}`;
			const res = await generateQuizQuestionsAI(topicPrompt, 3, [
				"mcq",
				"true_false",
				"short_answer"
			]);
			if (res.questions.length > 0) {
				const subject = res.title || "من المعلم الذكي";
				saveQuestionsToBank(currentProfile.id, subject, res.questions);
				setSavedBankMsg((prev) => ({
					...prev,
					[idx]: `تم حفظ ${res.questions.length} أسئلة في بنك الأسئلة ✓`
				}));
			} else setError("لم يتم العثور على أسئلة قابلة للحفظ من هذا الرد.");
		} catch (err) {
			setError(err?.message || "تعذّر توليد وحفظ الأسئلة في بنك الأسئلة.");
		} finally {
			setSavingToBankIdx(null);
		}
	};
	const toggleSpeakMessage = (text, idx) => {
		if (typeof window === "undefined" || !("speechSynthesis" in window)) {
			setError("قراءة النصوص صوتياً غير مدعومة في هذا المتصفح.");
			return;
		}
		if (speakingIdx === idx) {
			window.speechSynthesis.cancel();
			setSpeakingIdx(null);
			return;
		}
		window.speechSynthesis.cancel();
		const utter = new SpeechSynthesisUtterance(text.replace(/[#*`>_~]/g, " "));
		const hasArabic = /[\u0600-\u06FF]/.test(text);
		utter.lang = hasArabic ? "ar-SA" : "en-US";
		const match = window.speechSynthesis.getVoices().find((v) => v.lang.toLowerCase().startsWith(hasArabic ? "ar" : "en"));
		if (match) utter.voice = match;
		utter.rate = .98;
		utter.onend = () => setSpeakingIdx(null);
		utter.onerror = () => setSpeakingIdx(null);
		setSpeakingIdx(idx);
		window.speechSynthesis.speak(utter);
	};
	const toggleVoiceInput = () => {
		if (listeningVoice) {
			try {
				recognitionRef.current?.stop?.();
			} catch {}
			setListeningVoice(false);
			return;
		}
		const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
		if (!SpeechRec) {
			setError("الإملاء الصوتي غير مدعوم في هذا المتصفح (جرّب متصفح Chrome أو تطبيق الأندرويد).");
			return;
		}
		setError(null);
		const rec = new SpeechRec();
		rec.lang = "ar-SA";
		rec.interimResults = true;
		rec.continuous = false;
		const baseText = input.trim();
		rec.onresult = (ev) => {
			let transcript = "";
			for (let k = 0; k < ev.results.length; k++) transcript += ev.results[k][0]?.transcript || "";
			setInput(baseText ? `${baseText} ${transcript}`.trim() : transcript.trim());
		};
		rec.onerror = () => {
			setListeningVoice(false);
		};
		rec.onend = () => {
			setListeningVoice(false);
		};
		recognitionRef.current = rec;
		setListeningVoice(true);
		try {
			rec.start();
		} catch {
			setListeningVoice(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5 animate-in fade-in",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				ref: cameraInputRef,
				type: "file",
				accept: "image/*",
				capture: "environment",
				onChange: handleScanImagePick,
				className: "hidden"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				ref: galleryInputRef,
				type: "file",
				accept: "image/*",
				onChange: handleScanImagePick,
				className: "hidden"
			}),
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
							children: "المعلّم الذكي التفاعلي وماسح الكاميرا"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-slate-500",
							children: "اسأل عن أي مفهوم، التقط صورة لأي ورقة أو مسألة لحلّها وتصحيحها، أو أرفق درساً من صفوفك."
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2 shrink-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setScannerOpen((v) => !v),
							className: `px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors ${scannerOpen ? "bg-[#1677c7] text-white" : "bg-sky-50 hover:bg-sky-100 text-[#1677c7] border border-sky-200"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "ماسح الكاميرا والورق" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: selectedContextId,
							onChange: (e) => setSelectedContextId(e.target.value),
							className: "p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-slate-900 max-w-[210px]",
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
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setMessages([{
								role: "assistant",
								text: `محادثة جديدة جاهزة يا ${currentProfile.display_name}. كيف أساعدك الآن؟`
							}]),
							className: "p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl cursor-pointer",
							title: "محادثة جديدة",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4" })
						})
					]
				})]
			}),
			scannerOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white border-2 border-sky-200 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xs animate-in fade-in",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-9 h-9 rounded-xl bg-sky-50 text-[#1677c7] flex items-center justify-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanLine, { className: "w-5 h-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-black text-sm text-slate-900",
							children: "ماسح الكاميرا والواجبات الورقية"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-slate-500",
							children: "صوّر مسألة رياضيات، صفحة دفتر، أو إجابة امتحان ليحلّلها الذكاء الاصطناعي بدقة"
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setScannerOpen(false),
						className: "p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 md:grid-cols-12 gap-4 items-start",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "md:col-span-5 space-y-3 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-3 gap-1.5 bg-slate-100 p-1 rounded-xl font-bold",
								children: [
									{
										id: "solve",
										label: "حل مسألة"
									},
									{
										id: "grade",
										label: "تصحيح إجابة"
									},
									{
										id: "notes",
										label: "تلخيص سبورة"
									}
								].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setScanMode(item.id),
									className: `py-2 rounded-lg transition-colors cursor-pointer ${scanMode === item.id ? "bg-white text-[#1677c7] shadow-2xs" : "text-slate-600"}`,
									children: item.label
								}, item.id))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => cameraInputRef.current?.click(),
									className: "py-2.5 px-3 rounded-xl bg-[#0f233a] hover:bg-slate-800 text-white font-bold flex items-center justify-center gap-1.5 cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "التقاط بالكاميرا" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => galleryInputRef.current?.click(),
									className: "py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold flex items-center justify-center gap-1.5 cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "اختيار صورة" })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: scanExtraPrompt,
								onChange: (e) => setScanExtraPrompt(e.target.value),
								placeholder: "ملاحظة اختيارية (مثال: ركّز على السؤال رقم ٢)...",
								className: "w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1677c7]"
							}),
							scanImage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 max-h-56 flex items-center justify-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: scanImage.previewUrl,
										alt: "معاينة الورقة",
										className: "max-h-56 w-auto object-contain"
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									disabled: scanBusy,
									onClick: () => void runPaperScan(),
									className: "w-full py-2.5 bg-[#1677c7] hover:bg-[#125fa0] disabled:opacity-60 text-white font-black rounded-xl flex items-center justify-center gap-2 cursor-pointer",
									children: [scanBusy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: scanBusy ? "جاري مسح وتحليل الصورة..." : "بدء التحليل بالذكاء الاصطناعي (+10 XP)" })]
								})]
							}),
							scanError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl font-bold",
								children: scanError
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "md:col-span-7 bg-slate-50 border border-slate-200 rounded-2xl p-4 min-h-[210px] space-y-3 text-xs",
						children: !scanResult ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "h-44 flex flex-col items-center justify-center text-center text-slate-400 space-y-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanLine, { className: "w-8 h-8 text-slate-300" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-bold text-slate-600",
									children: "التقط أو ارفع صورة المسألة أو الورقة"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] max-w-xs",
									children: "سيقوم الذكاء الاصطناعي بقراءة النص المكتوب يدوياً أو المطبوع واستخراج الحل والخطوات فوراً."
								})
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3 animate-in fade-in",
							children: [
								scanResult.extractedText && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "bg-white p-3 rounded-xl border border-slate-200 space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] font-black text-slate-500 block",
										children: "النص المستخرج من الورقة:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-slate-800 whitespace-pre-wrap leading-relaxed",
										children: scanResult.extractedText
									})]
								}),
								scanResult.analysis && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "bg-white p-3 rounded-xl border border-slate-200 space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] font-black text-[#1677c7] block",
										children: "التحليل والشرح:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-slate-800 whitespace-pre-wrap leading-relaxed",
										children: scanResult.analysis
									})]
								}),
								scanResult.steps.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "bg-white p-3 rounded-xl border border-slate-200 space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] font-black text-slate-600 block",
										children: "الخطوات التفصيلية:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
										className: "list-decimal pr-4 space-y-1 text-slate-800 leading-relaxed",
										children: scanResult.steps.map((st, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: st }, idx))
									})]
								}),
								scanResult.finalAnswer && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "bg-emerald-50 border border-emerald-200 p-3 rounded-xl space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] font-black text-emerald-800 block",
										children: "النتيجة النهائية:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-black text-emerald-950 whitespace-pre-wrap",
										children: scanResult.finalAnswer
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex items-center justify-end gap-2 pt-1",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: appendScanToChat,
										className: "px-4 py-2 bg-[#1677c7] hover:bg-[#125fa0] text-white font-bold rounded-xl cursor-pointer",
										children: "إدراج في المحادثة لمتابعة الأسئلة ←"
									})
								})
							]
						})
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
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: m.text }), !isUser && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap items-center justify-end gap-3 pt-1",
											children: [
												(currentProfile.role === "teacher" || currentProfile.role === "admin") && i > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													type: "button",
													disabled: savingToBankIdx === i,
													onClick: () => void handleSaveReplyToQuestionBank(m.text, i),
													className: "inline-flex items-center gap-1 text-[10px] font-bold text-[#1677c7] hover:text-[#125fa0] disabled:opacity-50 cursor-pointer",
													children: [savingToBankIdx === i ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-3 h-3 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookmarkPlus, { className: "w-3 h-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: savedBankMsg[i] || "استخراج وحفظ في بنك الأسئلة" })]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													type: "button",
													onClick: () => toggleSpeakMessage(m.text, i),
													className: `inline-flex items-center gap-1 text-[10px] font-bold cursor-pointer ${speakingIdx === i ? "text-emerald-600" : "text-slate-400 hover:text-slate-700"}`,
													title: "استماع للرد صوتياً",
													children: [speakingIdx === i ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "w-3 h-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "w-3 h-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: speakingIdx === i ? "إيقاف الصوت" : "استماع" })]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													type: "button",
													onClick: () => copyMessage(m.text, i),
													className: "inline-flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-slate-700 cursor-pointer",
													children: [copiedIdx === i ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-3 h-3 text-emerald-600" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "w-3 h-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: copiedIdx === i ? "تم النسخ" : "نسخ" })]
												})
											]
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
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								disabled: busy,
								onClick: toggleVoiceInput,
								className: `min-h-[44px] min-w-[44px] rounded-xl flex items-center justify-center cursor-pointer transition-colors shrink-0 ${listeningVoice ? "bg-rose-600 text-white animate-pulse" : "bg-slate-100 hover:bg-slate-200 text-slate-700"}`,
								title: listeningVoice ? "إيقاف الإملاء الصوتي" : "اسأل بالصوت",
								children: listeningVoice ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "w-4 h-4 fill-current" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "w-4 h-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: input,
								onChange: (e) => setInput(e.target.value),
								placeholder: listeningVoice ? "تحدث الآن... جاري الاستماع لصوتك" : "اكتب سؤالك، معادلتك، أو نص الدرس هنا...",
								className: "flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm outline-none focus:border-slate-900 focus:bg-white",
								disabled: busy
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "submit",
								disabled: busy || !input.trim(),
								className: "px-4 py-3 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "إرسال" })]
							})
						]
					})
				]
			})
		]
	});
};
export { AIStudioView };
