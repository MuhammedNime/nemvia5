import { r as __toESM } from "./rolldown-runtime-SbdDWaPq.js";
import { A as RotateCw, Bt as BrainCircuit, Ct as Clock, F as Printer, I as Plus, Jt as Activity, Kt as Award, L as Play, Q as LoaderCircle, Yt as require_react, ft as Flame, j as RotateCcw, m as Trash2, n as X, rt as Layers, t as Zap, y as Sparkles, z as Pause } from "./icons-y6mUmdUg.js";
import { i as generateFlashcardsAI } from "./ai-CHroX9Wo.js";
import { t as require_jsx_runtime } from "./react-vendor-CpCOhAWp.js";
// src/components/views/StudyToolsView.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var INITIAL_CARDS = [
	{
		id: "c1",
		subject: "الرياضيات المتقدمة",
		category: "math",
		front: "ما هو قانون المميز (Δ) في المعادلة التربيعية ax² + bx + c = 0 وما دلالته؟",
		back: "Δ = b² - 4ac\n• إذا Δ > 0: يوجد حلان حقيقيان متمايزان.\n• إذا Δ = 0: يوجد حل وحيد مكرر.\n• إذا Δ < 0: لا توجد حلول حقيقية في ℝ (جذور مركبة).",
		hint: "المميز يحدد عدد وطبيعة الجذور"
	},
	{
		id: "c2",
		subject: "الفيزياء الكلاسيكية",
		category: "physics",
		front: "ما هو القانون الثاني لنيوتن في الحركة؟ وما هي وحداته الدولية؟",
		back: "F = m · a\n(القوة = الكتلة × التسارع)\n• القوة: نيوتن (N = kg·m/s²)\n• الكتلة: كيلوغرام (kg)\n• التسارع: م/ث² (m/s²)",
		hint: "يربط بين القوة الصافية وتغير سرعة الجسم"
	},
	{
		id: "c3",
		subject: "علوم الحاسوب والبرمجة",
		category: "cs",
		front: "ما هو التعقيد الزمني (Time Complexity) لخوارزمية البحث الثنائي (Binary Search)؟",
		back: "O(log n)\nلأن الخوارزمية تقسم نطاق البحث في المصفوفة المرتبة إلى النصف في كل خطوة.",
		hint: "تتطلب مصفوفة مرتبة سلفاً"
	},
	{
		id: "c4",
		subject: "اللغة الإنجليزية الأكاديمية",
		category: "english",
		front: "ما معنى واستخدام المصطلح الأكاديمي: \"Prerequisite\"؟",
		back: "المعنى: متطلب سابق إجباري.\nالاستخدام: كورس أو مهارة يجب إتمامها قبل التسجيل في مساق أعلى (e.g., \"Calculus I is a prerequisite for Calculus II\").",
		hint: "Pre = مسبق"
	}
];
var StudyToolsView = ({ currentProfile, onRewardXP, initialTab }) => {
	const [activeTab, setActiveTab] = (0, import_react.useState)(initialTab || "flashcards");
	(0, import_react.useEffect)(() => {
		if (initialTab) setActiveTab(initialTab);
	}, [initialTab]);
	const [cards, setCards] = (0, import_react.useState)(() => {
		try {
			const raw = localStorage.getItem(`nemvia-cards-${currentProfile.id}`);
			if (raw) return JSON.parse(raw);
		} catch {}
		return INITIAL_CARDS;
	});
	(0, import_react.useEffect)(() => {
		try {
			localStorage.setItem(`nemvia-cards-${currentProfile.id}`, JSON.stringify(cards));
		} catch {}
	}, [cards]);
	const [currentCardIndex, setCurrentCardIndex] = (0, import_react.useState)(0);
	const [isFlipped, setIsFlipped] = (0, import_react.useState)(false);
	const [selectedCategory, setSelectedCategory] = (0, import_react.useState)("all");
	const [reviewedCount, setReviewedCount] = (0, import_react.useState)(0);
	const [showAiCardsForm, setShowAiCardsForm] = (0, import_react.useState)(false);
	const [aiCardTopic, setAiCardTopic] = (0, import_react.useState)("");
	const [aiCardCategory, setAiCardCategory] = (0, import_react.useState)("math");
	const [aiCardCount, setAiCardCount] = (0, import_react.useState)(5);
	const [aiCardLoading, setAiCardLoading] = (0, import_react.useState)(false);
	const [aiCardError, setAiCardError] = (0, import_react.useState)(null);
	const [showAddCardForm, setShowAddCardForm] = (0, import_react.useState)(false);
	const [newCardSubject, setNewCardSubject] = (0, import_react.useState)("الرياضيات المتقدمة");
	const [newCardCategory, setNewCardCategory] = (0, import_react.useState)("math");
	const [newCardFront, setNewCardFront] = (0, import_react.useState)("");
	const [newCardBack, setNewCardBack] = (0, import_react.useState)("");
	const [newCardHint, setNewCardHint] = (0, import_react.useState)("");
	const filteredCards = cards.filter((c) => selectedCategory === "all" || c.category === selectedCategory);
	const safeIndex = filteredCards.length > 0 ? Math.min(currentCardIndex, filteredCards.length - 1) : 0;
	const activeCard = filteredCards[safeIndex];
	const handleNextCard = (difficulty) => {
		if (filteredCards.length === 0) return;
		setIsFlipped(false);
		setReviewedCount((prev) => prev + 1);
		if (difficulty === "easy") onRewardXP(15);
		else onRewardXP(25);
		setTimeout(() => {
			setCurrentCardIndex((safeIndex + 1) % filteredCards.length);
		}, 200);
	};
	const handleGenerateCardsAI = async (e) => {
		e.preventDefault();
		if (!aiCardTopic.trim() || aiCardLoading) return;
		setAiCardLoading(true);
		setAiCardError(null);
		try {
			const generated = await generateFlashcardsAI(aiCardTopic.trim(), aiCardCount, aiCardCategory);
			if (generated.length === 0) {
				setAiCardError("لم يتم توليد بطاقات صالحة. جرّب موضوعاً أكثر تحديداً.");
				return;
			}
			const mapped = generated.map((g, idx) => ({
				id: `ai-card-${Date.now()}-${idx}`,
				subject: g.subject || aiCardTopic.trim(),
				category: g.category,
				front: g.front,
				back: g.back,
				hint: g.hint || void 0
			}));
			const startIndex = cards.length;
			setCards((prev) => [...prev, ...mapped]);
			setSelectedCategory("all");
			setCurrentCardIndex(startIndex);
			setIsFlipped(false);
			setShowAiCardsForm(false);
			setAiCardTopic("");
			onRewardXP(10);
		} catch (err) {
			setAiCardError(err?.message || "تعذّر توليد البطاقات بالذكاء الاصطناعي.");
		} finally {
			setAiCardLoading(false);
		}
	};
	const handleAddManualCard = (e) => {
		e.preventDefault();
		if (!newCardFront.trim() || !newCardBack.trim()) return;
		const item = {
			id: `card-${Date.now()}`,
			subject: newCardSubject.trim() || "مراجعة عامة",
			category: newCardCategory,
			front: newCardFront.trim(),
			back: newCardBack.trim(),
			hint: newCardHint.trim() || void 0
		};
		const nextIndex = cards.length;
		setCards((prev) => [...prev, item]);
		setSelectedCategory("all");
		setCurrentCardIndex(nextIndex);
		setIsFlipped(false);
		setShowAddCardForm(false);
		setNewCardFront("");
		setNewCardBack("");
		setNewCardHint("");
	};
	const handleDeleteCard = (id) => {
		if (cards.length <= 1) return;
		setCards((prev) => prev.filter((c) => c.id !== id));
		setIsFlipped(false);
		setCurrentCardIndex(0);
	};
	const [timerSeconds, setTimerSeconds] = (0, import_react.useState)(1500);
	const [isTimerRunning, setIsTimerRunning] = (0, import_react.useState)(false);
	const [timerMode, setTimerMode] = (0, import_react.useState)("work");
	const [ambientSound, setAmbientSound] = (0, import_react.useState)("none");
	const audioContextRef = (0, import_react.useRef)(null);
	const soundNodeRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		let interval = null;
		if (isTimerRunning && timerSeconds > 0) interval = setInterval(() => {
			setTimerSeconds((sec) => sec - 1);
		}, 1e3);
		else if (timerSeconds === 0) {
			setIsTimerRunning(false);
			if (timerMode === "work") {
				onRewardXP(50);
				setTimerMode("break");
				setTimerSeconds(300);
			} else {
				setTimerMode("work");
				setTimerSeconds(1500);
			}
		}
		return () => clearInterval(interval);
	}, [
		isTimerRunning,
		timerSeconds,
		timerMode
	]);
	const stopAmbientSound = () => {
		if (soundNodeRef.current) {
			try {
				soundNodeRef.current.stop?.();
				soundNodeRef.current.disconnect();
			} catch (e) {}
			soundNodeRef.current = null;
		}
		setAmbientSound("none");
	};
	const playAmbientSound = (type) => {
		stopAmbientSound();
		try {
			const AudioCtx = window.AudioContext || window.webkitAudioContext;
			if (!AudioCtx) return;
			const ctx = audioContextRef.current || new AudioCtx();
			audioContextRef.current = ctx;
			if (ctx.state === "suspended") ctx.resume();
			const bufferSize = ctx.sampleRate * 2;
			const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
			const data = buffer.getChannelData(0);
			let lastOut = 0;
			for (let i = 0; i < bufferSize; i++) {
				const white = Math.random() * 2 - 1;
				lastOut = (lastOut + .02 * white) / 1.02;
				data[i] = lastOut * .4;
			}
			const noise = ctx.createBufferSource();
			noise.buffer = buffer;
			noise.loop = true;
			const filter = ctx.createBiquadFilter();
			if (type === "rain") {
				filter.type = "lowpass";
				filter.frequency.setValueAtTime(800, ctx.currentTime);
			} else if (type === "waves") {
				filter.type = "bandpass";
				filter.frequency.setValueAtTime(450, ctx.currentTime);
			} else {
				filter.type = "lowpass";
				filter.frequency.setValueAtTime(400, ctx.currentTime);
			}
			const gain = ctx.createGain();
			gain.gain.setValueAtTime(.15, ctx.currentTime);
			noise.connect(filter);
			filter.connect(gain);
			gain.connect(ctx.destination);
			noise.start();
			soundNodeRef.current = noise;
			setAmbientSound(type);
		} catch (err) {
			console.warn("Audio synthesis not supported:", err);
		}
	};
	const graphCanvasRef = (0, import_react.useRef)(null);
	const [fxExpr, setFxExpr] = (0, import_react.useState)("0.5x^2 - 2");
	const [gxExpr, setGxExpr] = (0, import_react.useState)("x + 1");
	const [graphScale, setGraphScale] = (0, import_react.useState)(35);
	const [probeX, setProbeX] = (0, import_react.useState)("2");
	const evaluateMath = import_react.useCallback((rawExpr, xVal) => {
		const clean = rawExpr.toLowerCase().replace(/π/g, "pi").replace(/\s+/g, "").replace(/(\d)(x|\(|pi|sin|cos|tan|sqrt|abs|log|ln|exp)/g, "$1*$2").replace(/(x|\))(x|\(|pi|sin|cos|tan|sqrt|abs|log|ln|exp)/g, "$1*$2").replace(/(x|\))(\d)/g, "$1*$2");
		if (!clean) return null;
		let pos = 0;
		const peek = () => clean[pos] || "";
		const consume = () => clean[pos++] || "";
		const parseNumber = () => {
			const start = pos;
			while (/[0-9.]/.test(peek())) pos++;
			if (start === pos) throw new Error("expected number");
			return parseFloat(clean.slice(start, pos));
		};
		const parseFactor = () => {
			if (peek() === "+") {
				consume();
				return parseFactor();
			}
			if (peek() === "-") {
				consume();
				return -parseFactor();
			}
			if (peek() === "(") {
				consume();
				const v = parseExpr();
				if (peek() === ")") consume();
				return v;
			}
			if (/[0-9.]/.test(peek())) return parseNumber();
			let ident = "";
			while (/[a-z]/.test(peek())) ident += consume();
			if (ident === "x") return xVal;
			if (ident === "pi") return Math.PI;
			if (ident === "e") return Math.E;
			if ([
				"sin",
				"cos",
				"tan",
				"sqrt",
				"abs",
				"log",
				"ln",
				"exp"
			].includes(ident)) {
				let arg = 0;
				if (peek() === "(") {
					consume();
					arg = parseExpr();
					if (peek() === ")") consume();
				} else arg = parseFactor();
				if (ident === "sin") return Math.sin(arg);
				if (ident === "cos") return Math.cos(arg);
				if (ident === "tan") return Math.tan(arg);
				if (ident === "sqrt") return arg < 0 ? NaN : Math.sqrt(arg);
				if (ident === "abs") return Math.abs(arg);
				if (ident === "log") return arg <= 0 ? NaN : Math.log10(arg);
				if (ident === "ln") return arg <= 0 ? NaN : Math.log(arg);
				if (ident === "exp") return Math.exp(arg);
			}
			throw new Error("unknown token");
		};
		const parsePower = () => {
			const base = parseFactor();
			if (peek() === "^") {
				consume();
				const exp = parsePower();
				return Math.pow(base, exp);
			}
			return base;
		};
		const parseTerm = () => {
			let v = parsePower();
			while (peek() === "*" || peek() === "/") {
				const op = consume();
				const rhs = parsePower();
				v = op === "*" ? v * rhs : rhs === 0 ? NaN : v / rhs;
			}
			return v;
		};
		const parseExpr = () => {
			let v = parseTerm();
			while (peek() === "+" || peek() === "-") {
				const op = consume();
				const rhs = parseTerm();
				v = op === "+" ? v + rhs : v - rhs;
			}
			return v;
		};
		try {
			const result = parseExpr();
			if (pos < clean.length) return null;
			return Number.isFinite(result) ? result : null;
		} catch {
			return null;
		}
	}, []);
	const fxSyntaxError = fxExpr.trim() !== "" && evaluateMath(fxExpr, 1) === null && evaluateMath(fxExpr, 2) === null;
	const gxSyntaxError = gxExpr.trim() !== "" && evaluateMath(gxExpr, 1) === null && evaluateMath(gxExpr, 2) === null;
	const probeNum = Number(probeX);
	const probeFx = Number.isFinite(probeNum) ? evaluateMath(fxExpr, probeNum) : null;
	const probeGx = Number.isFinite(probeNum) && gxExpr.trim() ? evaluateMath(gxExpr, probeNum) : null;
	(0, import_react.useEffect)(() => {
		if (activeTab !== "grapher") return;
		const canvas = graphCanvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		const width = canvas.width;
		const height = canvas.height;
		const originX = width / 2;
		const originY = height / 2;
		ctx.fillStyle = "#ffffff";
		ctx.fillRect(0, 0, width, height);
		ctx.strokeStyle = "#e2e8f0";
		ctx.lineWidth = 1;
		for (let x = originX % graphScale; x <= width; x += graphScale) {
			ctx.beginPath();
			ctx.moveTo(x, 0);
			ctx.lineTo(x, height);
			ctx.stroke();
		}
		for (let y = originY % graphScale; y <= height; y += graphScale) {
			ctx.beginPath();
			ctx.moveTo(0, y);
			ctx.lineTo(width, y);
			ctx.stroke();
		}
		ctx.strokeStyle = "#0f233a";
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(0, originY);
		ctx.lineTo(width, originY);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(originX, 0);
		ctx.lineTo(originX, height);
		ctx.stroke();
		ctx.fillStyle = "#64748b";
		ctx.font = "11px JetBrains Mono, monospace";
		for (let u = -12; u <= 12; u++) {
			if (u === 0) continue;
			const px = originX + u * graphScale;
			const py = originY - u * graphScale;
			if (px > 15 && px < width - 15) ctx.fillText(String(u), px - 4, originY + 14);
			if (py > 15 && py < height - 10) ctx.fillText(String(u), originX + 6, py + 4);
		}
		const plotCurve = (expr, color, lineWidth) => {
			if (!expr.trim()) return;
			ctx.strokeStyle = color;
			ctx.lineWidth = lineWidth;
			ctx.beginPath();
			let drawing = false;
			let prevPy = null;
			for (let px = 0; px <= width; px += 1.5) {
				const mathX = (px - originX) / graphScale;
				const mathY = evaluateMath(expr, mathX);
				if (mathY === null || Math.abs(mathY) > 500) {
					drawing = false;
					prevPy = null;
					continue;
				}
				const py = originY - mathY * graphScale;
				if (!drawing || prevPy !== null && Math.abs(py - prevPy) > height * .8) {
					ctx.moveTo(px, py);
					drawing = true;
				} else ctx.lineTo(px, py);
				prevPy = py;
			}
			ctx.stroke();
		};
		plotCurve(gxExpr, "#10b981", 2.5);
		plotCurve(fxExpr, "#1677c7", 3);
		if (Number.isFinite(probeNum) && probeFx !== null) {
			const px = originX + probeNum * graphScale;
			const py = originY - probeFx * graphScale;
			if (px >= 0 && px <= width && py >= 0 && py <= height) {
				ctx.fillStyle = "#e11d48";
				ctx.beginPath();
				ctx.arc(px, py, 6, 0, Math.PI * 2);
				ctx.fill();
				ctx.strokeStyle = "#ffffff";
				ctx.lineWidth = 2;
				ctx.stroke();
			}
		}
	}, [
		activeTab,
		fxExpr,
		gxExpr,
		graphScale,
		probeNum,
		probeFx,
		evaluateMath
	]);
	const handlePrintCertificate = () => {
		window.print();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 animate-in fade-in",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5 max-w-2xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-xs font-bold text-[#1677c7]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "مختبر وأدوات التفوق الأكاديمي" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-xl sm:text-2xl font-black text-slate-900",
							children: "بطاقات المراجعة الذكية، مؤقت بومودورو، محاكي الرياضيات، والشهادات"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs sm:text-sm text-slate-600 leading-relaxed",
							children: "ولّد بطاقات مراجعة تلقائياً بالذكاء الاصطناعي لأي درس، ركّز بمؤقت بومودورو، وارسم الدوال الرياضية مباشرة."
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 bg-slate-50 px-4 py-3 rounded-xl border border-slate-200 text-xs shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-sm",
						children: "XP"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-bold text-slate-500 block",
						children: "رصيد نقاطك"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-black text-slate-900 text-sm tabular-nums",
						children: [currentProfile.points, " نقطة"]
					})] })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none",
				children: [
					{
						id: "flashcards",
						label: "بطاقات المراجعة الذكية",
						icon: Layers
					},
					{
						id: "pomodoro",
						label: "مؤقت التركيز بومودورو",
						icon: Clock
					},
					{
						id: "grapher",
						label: "محاكي الدوال والمنحنيات",
						icon: Activity
					},
					{
						id: "certificate",
						label: "الشهادة الأكاديمية",
						icon: Award
					},
					{
						id: "badges",
						label: "الأوسمة والإنجازات",
						icon: Zap
					}
				].map((tab) => {
					const Icon = tab.icon;
					const isActive = activeTab === tab.id;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setActiveTab(tab.id),
						className: `px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${isActive ? "bg-slate-900 text-white" : "bg-white hover:bg-slate-50 text-slate-600 border border-slate-200"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: tab.label })]
					}, tab.id);
				})
			}),
			activeTab === "flashcards" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between text-xs flex-wrap gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl flex-wrap",
							children: [
								{
									id: "all",
									label: "كل المواد"
								},
								{
									id: "math",
									label: "رياضيات"
								},
								{
									id: "physics",
									label: "فيزياء"
								},
								{
									id: "cs",
									label: "برمجة"
								},
								{
									id: "english",
									label: "إنجليزية"
								}
							].map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => {
									setSelectedCategory(cat.id);
									setCurrentCardIndex(0);
									setIsFlipped(false);
								},
								className: `px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${selectedCategory === cat.id ? "bg-white text-[#1677c7] shadow-xs" : "text-slate-600"}`,
								children: cat.label
							}, cat.id))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-slate-500 font-bold tabular-nums ml-1",
									children: [
										filteredCards.length > 0 ? `البطاقة ${safeIndex + 1} من ${filteredCards.length}` : "0 بطاقات",
										" · تمت مراجعة ",
										reviewedCount
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => {
										setShowAiCardsForm((v) => !v);
										setShowAddCardForm(false);
									},
									className: "px-3 py-2 bg-sky-50 hover:bg-sky-100 text-[#1677c7] border border-sky-200 font-bold rounded-xl flex items-center gap-1.5 cursor-pointer whitespace-nowrap",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "توليد بطاقات بالذكاء" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => {
										setShowAddCardForm((v) => !v);
										setShowAiCardsForm(false);
									},
									className: "px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold rounded-xl flex items-center gap-1.5 cursor-pointer whitespace-nowrap",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "إضافة بطاقة" })]
								})
							]
						})]
					}),
					showAiCardsForm && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleGenerateCardsAI,
						className: "bg-white border border-sky-200 rounded-2xl p-4 sm:p-5 space-y-3 shadow-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 text-slate-900 font-black text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-4 h-4 text-[#1677c7]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "توليد مجموعة بطاقات مراجعة بالذكاء الاصطناعي" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setShowAiCardsForm(false),
									className: "text-slate-400 hover:text-slate-600 cursor-pointer",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid sm:grid-cols-6 gap-2.5 text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: aiCardTopic,
										onChange: (e) => setAiCardTopic(e.target.value),
										placeholder: "اكتب الموضوع أو الدرس (مثال: قوانين المشتقات أو الحث الكهرومغناطيسي)...",
										className: "sm:col-span-3 p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1677c7]",
										required: true
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: aiCardCategory,
										onChange: (e) => setAiCardCategory(e.target.value),
										className: "p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold outline-none focus:border-[#1677c7]",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "math",
												children: "رياضيات"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "physics",
												children: "فيزياء"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "cs",
												children: "برمجة وحاسوب"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "english",
												children: "لغة إنجليزية"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: aiCardCount,
										onChange: (e) => setAiCardCount(Number(e.target.value)),
										className: "p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold outline-none focus:border-[#1677c7]",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: 4,
												children: "4 بطاقات"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: 6,
												children: "6 بطاقات"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: 8,
												children: "8 بطاقات"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "submit",
										disabled: aiCardLoading || !aiCardTopic.trim(),
										className: "px-4 py-2.5 bg-[#1677c7] hover:bg-[#125fa0] disabled:opacity-50 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap",
										children: [aiCardLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: aiCardLoading ? "جاري التوليد..." : "توليد الآن" })]
									})
								]
							}),
							aiCardError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-rose-600 font-bold",
								children: aiCardError
							})
						]
					}),
					showAddCardForm && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleAddManualCard,
						className: "bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3 shadow-xs text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-black text-sm text-slate-900",
									children: "إضافة بطاقة مراجعة جديدة يدوياً"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setShowAddCardForm(false),
									className: "text-slate-400 hover:text-slate-600 cursor-pointer",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid sm:grid-cols-2 gap-2.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: newCardSubject,
										onChange: (e) => setNewCardSubject(e.target.value),
										placeholder: "اسم المادة أو الوحدة...",
										className: "p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1677c7]"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: newCardCategory,
										onChange: (e) => setNewCardCategory(e.target.value),
										className: "p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold outline-none focus:border-[#1677c7]",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "math",
												children: "رياضيات"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "physics",
												children: "فيزياء"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "cs",
												children: "برمجة وحاسوب"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "english",
												children: "لغة إنجليزية"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
										rows: 2,
										value: newCardFront,
										onChange: (e) => setNewCardFront(e.target.value),
										placeholder: "وجه البطاقة (السؤال أو المفهوم)...",
										className: "p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1677c7]",
										required: true
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
										rows: 2,
										value: newCardBack,
										onChange: (e) => setNewCardBack(e.target.value),
										placeholder: "ظهر البطاقة (الإجابة والقانون والشرح)...",
										className: "p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1677c7]",
										required: true
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: newCardHint,
									onChange: (e) => setNewCardHint(e.target.value),
									placeholder: "تلميح اختياري يظهر قبل قلب البطاقة...",
									className: "flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1677c7]"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "submit",
									className: "px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl cursor-pointer whitespace-nowrap",
									children: "حفظ البطاقة"
								})]
							})
						]
					}),
					activeCard ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "max-w-xl mx-auto space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							onClick: () => setIsFlipped(!isFlipped),
							className: "relative min-h-[280px] sm:min-h-[320px] rounded-2xl p-6 sm:p-8 cursor-pointer select-none transition-all duration-300 shadow-sm border border-slate-200 flex flex-col justify-between text-center overflow-hidden bg-white hover:border-[#1677c7]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between text-xs text-slate-400",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "px-2.5 py-1 bg-sky-50 text-[#1677c7] font-bold rounded-lg border border-sky-100",
										children: activeCard.subject
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-1 text-[11px] font-bold",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCw, { className: "w-3.5 h-3.5 text-slate-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "انقر على البطاقة لقلبها" })]
										}), cards.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: (e) => {
												e.stopPropagation();
												handleDeleteCard(activeCard.id);
											},
											title: "حذف هذه البطاقة",
											className: "p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3.5 h-3.5" })
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "my-auto py-4 space-y-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs font-black uppercase text-slate-400 tracking-wider block",
											children: isFlipped ? "الإجابة والشرح" : "السؤال أو المفهوم"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: `font-black text-slate-900 leading-relaxed whitespace-pre-wrap ${isFlipped ? "text-base sm:text-lg text-emerald-950 font-sans" : "text-lg sm:text-xl"}`,
											children: isFlipped ? activeCard.back : activeCard.front
										}),
										!isFlipped && activeCard.hint && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-[11px] text-slate-500 block",
											children: ["تلميح: ", activeCard.hint]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[11px] text-slate-400 border-t border-slate-100 pt-2",
									children: "نظام التكرار المتباعد · تقييم الحفظ يمنحك نقاط خبرة"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-center gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => handleNextCard("hard"),
									className: "flex-1 py-3 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-2xl border border-rose-200 transition-colors cursor-pointer",
									children: "صعب / يحتاج مراجعة (0 XP)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => handleNextCard("medium"),
									className: "flex-1 py-3 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs rounded-2xl border border-amber-200 transition-colors cursor-pointer",
									children: "متوسط الصعوبة (+15 XP)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => handleNextCard("easy"),
									className: "flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl shadow-md shadow-emerald-900/10 transition-colors cursor-pointer",
									children: "سهل وحفظته تماماً! (+25 XP)"
								})
							]
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "max-w-xl mx-auto p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-2 text-xs text-slate-500",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-bold text-slate-700",
							children: "لا توجد بطاقات ضمن هذا التصنيف حالياً."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "جرّب اختيار \"كل المواد\" أو توليد بطاقات جديدة بالذكاء الاصطناعي." })]
					})
				]
			}),
			activeTab === "pomodoro" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "max-w-xl mx-auto space-y-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white rounded-3xl border border-slate-200 p-8 shadow-sm text-center space-y-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center justify-center gap-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider ${timerMode === "work" ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"}`,
								children: timerMode === "work" ? "🔥 جلسة تركيز مكثفة (25 دقيقة)" : "☕ وقت استراحة قصيرة (5 دقائق)"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-6xl sm:text-7xl font-black text-slate-900 font-mono tracking-tight",
							children: [
								String(Math.floor(timerSeconds / 60)).padStart(2, "0"),
								":",
								String(timerSeconds % 60).padStart(2, "0")
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setIsTimerRunning(!isTimerRunning),
								className: `px-8 py-3.5 rounded-2xl font-black text-sm flex items-center gap-2 transition-all cursor-pointer shadow-lg ${isTimerRunning ? "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-900/20" : "bg-[#1677c7] hover:bg-[#125fa0] text-white shadow-sky-950/20"}`,
								children: [isTimerRunning ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "w-5 h-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "w-5 h-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isTimerRunning ? "إيقاف مؤقت" : "بدء التركيز الآن" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => {
									setIsTimerRunning(false);
									setTimerSeconds(timerMode === "work" ? 1500 : 300);
								},
								className: "p-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer",
								title: "إعادة ضبط المؤقت",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "w-5 h-5" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pt-6 border-t border-slate-100 space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-bold text-slate-600 block",
								children: "أصوات بيئية مهدئة ومحفزة للتركيز (توليد صوتي نقي بدون إنترنت):"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap items-center justify-center gap-2",
								children: [
									{
										id: "none",
										label: "صامت 🔇"
									},
									{
										id: "rain",
										label: "صوت المطر الهادئ 🌧️"
									},
									{
										id: "waves",
										label: "أمواج البحر الهادئة 🌊"
									},
									{
										id: "library",
										label: "مكتبة هادئة (Noise) 📚"
									}
								].map((snd) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => {
										if (snd.id === "none") stopAmbientSound();
										else playAmbientSound(snd.id);
									},
									className: `px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${ambientSound === snd.id ? "bg-[#0f233a] text-white shadow-xs" : "bg-slate-100 hover:bg-slate-200 text-slate-700"}`,
									children: snd.label
								}, snd.id))
							})]
						})
					]
				})
			}),
			activeTab === "grapher" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 space-y-4 text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 md:grid-cols-12 gap-3 items-end",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "md:col-span-5 space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "font-bold text-slate-700 flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-2.5 h-2.5 rounded-full bg-[#1677c7]" }), "المعادلة الأولى f(x)"]
									}), fxSyntaxError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-rose-600 text-[10px]",
										children: "صيغة غير صالحة"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: fxExpr,
									onChange: (e) => setFxExpr(e.target.value),
									dir: "ltr",
									placeholder: "e.g. 0.5x^2 - 2 or sin(x)",
									className: "w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono outline-none focus:border-[#1677c7]"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "md:col-span-4 space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "font-bold text-slate-700 flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-2.5 h-2.5 rounded-full bg-emerald-500" }), "معادلة مقارنة g(x) (اختياري)"]
									}), gxSyntaxError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-rose-600 text-[10px]",
										children: "صيغة غير صالحة"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: gxExpr,
									onChange: (e) => setGxExpr(e.target.value),
									dir: "ltr",
									placeholder: "e.g. x + 1",
									className: "w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono outline-none focus:border-emerald-500"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "md:col-span-3 flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1 space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "font-bold text-slate-700 block",
										children: "نقطة الفحص x ="
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "number",
										step: "0.5",
										value: probeX,
										onChange: (e) => setProbeX(e.target.value),
										dir: "ltr",
										className: "w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono outline-none"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1 pb-0.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setGraphScale((s) => Math.min(80, s + 8)),
										className: "px-2.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 font-black cursor-pointer",
										title: "تكبير",
										children: "+"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setGraphScale((s) => Math.max(16, s - 8)),
										className: "px-2.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 font-black cursor-pointer",
										title: "تصغير",
										children: "-"
									})]
								})]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-slate-500 font-bold",
								children: "أمثلة سريعة:"
							}), [
								{
									label: "0.5x^2 - 2",
									fx: "0.5x^2 - 2",
									gx: "x + 1"
								},
								{
									label: "sin(x)",
									fx: "2sin(x)",
									gx: "cos(x)"
								},
								{
									label: "0.2x^3 - x",
									fx: "0.2x^3 - x",
									gx: ""
								},
								{
									label: "abs(x) - 2",
									fx: "abs(x) - 2",
									gx: ""
								},
								{
									label: "1/x",
									fx: "1/x",
									gx: "x"
								}
							].map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => {
									setFxExpr(p.fx);
									setGxExpr(p.gx);
								},
								dir: "ltr",
								className: "px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-sky-50 hover:text-[#1677c7] font-mono font-bold cursor-pointer",
								children: p.label
							}, p.label))]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "font-mono text-[11px] font-bold text-slate-700 flex items-center gap-3",
							dir: "ltr",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								"f(",
								probeX || 0,
								") = ",
								probeFx !== null ? Number(probeFx.toFixed(3)) : "—"
							] }), gxExpr.trim() && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-emerald-700",
								children: [
									"g(",
									probeX || 0,
									") = ",
									probeGx !== null ? Number(probeGx.toFixed(3)) : "—"
								]
							})]
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "bg-white rounded-3xl border border-slate-200 p-4 overflow-hidden flex justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
						ref: graphCanvasRef,
						width: 800,
						height: 450,
						className: "max-w-full rounded-2xl bg-white border border-slate-100"
					})
				})]
			}),
			activeTab === "certificate" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-w-2xl mx-auto space-y-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-bold text-slate-700",
						children: "شهادة إتمام معتمدة قابلة للطباعة والتنزيل:"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: handlePrintCertificate,
						className: "px-4 py-2 bg-[#1677c7] hover:bg-[#125fa0] text-white font-bold rounded-xl flex items-center gap-2 cursor-pointer shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "طباعة / حفظ الشهادة PDF" })]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-amber-50/60 via-white to-sky-50/50 border-8 border-double border-amber-600/40 shadow-2xl relative overflow-hidden space-y-8 text-center print:border-none print:shadow-none",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-900/5 font-black text-9xl pointer-events-none select-none",
							children: "NEMVIA"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "inline-block p-2 rounded-2xl bg-gradient-to-br from-[#0f233a] to-[#1677c7] text-white font-black text-2xl shadow-lg",
								children: "NEMVIA"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-xs uppercase tracking-widest font-black text-amber-700 pt-2",
								children: "شهادة مشاركة وإنجاز · CERTIFICATE OF ACHIEVEMENT"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs sm:text-sm text-slate-500",
									children: [
										"تشهد إدارة منصة ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "NEMVIA التعليمية" }),
										" بأن الطالب(ـة) المتميز(ة):"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-2xl sm:text-3xl font-black text-slate-900 underline decoration-amber-400 decoration-2 underline-offset-8",
									children: currentProfile.display_name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed pt-2",
									children: [
										"شارك(ت) في منصة NEMVIA التعليمية وحصل(ت) على رصيد إنجاز ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [currentProfile.points, " XP"] }),
										" من خلال الاختبارات والمراجعة والنشاط. شهادة تحفيزية داخل المنصة."
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pt-8 border-t border-amber-900/10 flex items-center justify-between text-xs px-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-right space-y-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] text-slate-400 block font-mono",
											children: "رقم المرجع:"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-mono font-bold text-slate-700 text-xs",
											children: ["NEMVIA-", currentProfile.id.slice(0, 8).toUpperCase()]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-[10px] text-slate-400 block",
											children: ["التاريخ: ", (/* @__PURE__ */ new Date()).toLocaleDateString("ar")]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-white flex flex-col items-center justify-center shadow-lg border-2 border-white ring-4 ring-amber-200",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "w-6 h-6 text-white" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[8px] font-black uppercase",
										children: "NEMVIA"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-left space-y-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-bold text-[#0f233a] block text-sm",
											children: "محمد جمال نعمه"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] text-slate-500 block",
											children: "مؤسس المنصة ورئيس الهيئة التعليمية"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[9px] text-emerald-600 font-bold block",
											children: "✓ توقيع رقمي موثق"
										})
									]
								})
							]
						})
					]
				})]
			}),
			activeTab === "badges" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid sm:grid-cols-2 md:grid-cols-4 gap-4",
					children: [
						{
							title: "بداية الانطلاق",
							desc: "الوصول إلى 50 نقطة خبرة أو أكثر",
							icon: Flame,
							unlocked: currentProfile.points >= 50,
							color: "text-orange-500 bg-orange-50"
						},
						{
							title: "بطل المواظبة",
							desc: "استمرار المذاكرة 7 أيام متتالية",
							icon: Award,
							unlocked: currentProfile.streakDays >= 7,
							color: "text-amber-500 bg-amber-50"
						},
						{
							title: "مُتقن البطاقات",
							desc: "مراجعة 5 بطاقات أو امتلاك 8 بطاقات",
							icon: Sparkles,
							unlocked: reviewedCount >= 5 || cards.length >= 8,
							color: "text-sky-500 bg-sky-50"
						},
						{
							title: "نجم التميّز",
							desc: "جمع 300 نقطة خبرة (XP) في المنصة",
							icon: BrainCircuit,
							unlocked: currentProfile.points >= 300,
							color: "text-purple-500 bg-purple-50"
						}
					].map((badge, idx) => {
						const Icon = badge.icon;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `p-5 rounded-2xl border text-center space-y-3 transition-all ${badge.unlocked ? "bg-white border-slate-200 shadow-xs" : "bg-slate-50 border-slate-200 opacity-60"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `w-12 h-12 rounded-2xl mx-auto flex items-center justify-center ${badge.color}`,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "w-6 h-6" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "font-black text-slate-900 text-sm",
									children: badge.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-slate-500 pt-1 leading-relaxed",
									children: badge.desc
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${badge.unlocked ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-600"}`,
									children: badge.unlocked ? "✓ تم الحصول عليه" : "🔒 قيد الإنجاز"
								})
							]
						}, idx);
					})
				})
			})
		]
	});
};
export { StudyToolsView };
