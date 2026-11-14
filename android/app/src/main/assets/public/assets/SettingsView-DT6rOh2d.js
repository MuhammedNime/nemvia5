import { r as __toESM } from "./rolldown-runtime-SbdDWaPq.js";
import { H as Moon, Nt as Check, S as SlidersVertical, U as Monitor, V as Palette, Wt as Bell, Yt as require_react, a as Volume2, ct as Globe, d as Type, h as Sun, i as VolumeX, j as RotateCcw, y as Sparkles, yt as Download } from "./icons-y6mUmdUg.js";
import { a as isSoundEnabled, c as setDesktopNotifEnabled, d as useAppSettings, h as saveOrShareBlobFile, i as isDesktopNotifEnabled, l as setSoundEnabled, o as playNotificationChime, s as requestBrowserNotificationPermission, u as ACCENT_OPTIONS } from "./index-KBMaUlM9.js";
import { t as loadQuestionBank } from "./questionBank-CLFgLnk1.js";
import { t as require_jsx_runtime } from "./react-vendor-CpCOhAWp.js";
// src/components/views/SettingsView.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var LABELS = {
	ar: {
		title: "الإعدادات والتخصيص",
		subtitle: "تحكّم باللغة، شكل التطبيق، الألوان، حجم الخط، والأصوات كما يناسبك.",
		langTitle: "اللغة واتجاه الواجهة",
		langDesc: "تغيير لغة القوائم واتجاه العرض (RTL / LTR) فوراً.",
		themeTitle: "مظهر التطبيق",
		themeDesc: "اختر الوضع المناسب لوقت دراستك.",
		themeLight: "نهاري فاتح",
		themeDark: "ليلي داكن",
		themeWarm: "ورقي دافئ",
		accentTitle: "لون التمييز الأساسي",
		accentDesc: "يتغيّر لون الأزرار والتبويبات والعناصر النشطة في كامل المنصة.",
		previewBadge: "معاينة فورية",
		previewText: "هكذا يبدو المظهر والألوان المختارة الآن",
		previewBtn: "زر تجريبي",
		displayTitle: "الخط والعرض",
		fontSize: "حجم الخط العام",
		fontSm: "مضغوط",
		fontMd: "افتراضي",
		fontLg: "كبير مريح",
		compactMode: "وضع العرض المكثف",
		compactDesc: "يقلل الفراغات الجانبية لعرض محتوى أكثر في الشاشة.",
		reducedMotion: "تقليل الحركات والانتقالات",
		reducedMotionDesc: "يلغي الأنيميشن لراحة العين وسرعة الاستجابة.",
		soundTitle: "الأصوات والتنبيهات",
		soundToggle: "تشغيل صوت الإشعارات والرسائل",
		soundDesc: "رنّة لطيفة عند وصول رسالة جديدة أو إشعار أو درجة.",
		chimeTone: "نغمة الإشعارات",
		toneClassic: "كلاسيكية",
		toneSoft: "هادئة",
		toneBright: "مشرقة",
		testChime: "تجربة الصوت",
		desktopAlerts: "تنبيهات المتصفح / الجهاز",
		desktopDesc: "تظهر حتى عند استخدام تبويب آخر.",
		desktopOn: "مفعّلة ✓",
		desktopOff: "تفعيل الآن",
		desktopBlocked: "مرفوضة من المتصفح",
		dataTitle: "النسخ الاحتياطي وإعادة الضبط",
		dataDesc: "تصدير بطاقات المراجعة وبنك الأسئلة المحلي كملف JSON، أو استعادة الإعدادات.",
		exportBtn: "تصدير بياناتي (JSON)",
		resetBtn: "إعادة الإعدادات الافتراضية",
		exportedMsg: "تم تنزيل نسخة احتياطية من بياناتك المحلية بنجاح",
		resetMsg: "تمت استعادة الإعدادات الافتراضية",
		permDeniedMsg: "المتصفح يحظر الإشعارات، فعّلها من إعدادات الموقع في المتصفح",
		permGrantedMsg: "تم تفعيل تنبيهات الجهاز بنجاح"
	},
	en: {
		title: "Settings & Customization",
		subtitle: "Personalize language, theme mode, accent colors, typography, and notification chimes.",
		langTitle: "Language & Layout Direction",
		langDesc: "Switch interface language and RTL/LTR direction immediately.",
		themeTitle: "Appearance Mode",
		themeDesc: "Pick the theme that matches your study environment.",
		themeLight: "Clean Light",
		themeDark: "Night Dark",
		themeWarm: "Warm Paper",
		accentTitle: "Primary Accent Color",
		accentDesc: "Applies to active tabs, primary buttons, and highlights across the app.",
		previewBadge: "Live Preview",
		previewText: "This is how your active color & surface look",
		previewBtn: "Sample Button",
		displayTitle: "Typography & Layout",
		fontSize: "Global Font Size",
		fontSm: "Compact",
		fontMd: "Default",
		fontLg: "Large",
		compactMode: "Compact Spacing Mode",
		compactDesc: "Reduces outer padding to fit more content on screen.",
		reducedMotion: "Reduce Motion",
		reducedMotionDesc: "Minimizes animations and transitions across views.",
		soundTitle: "Sounds & Alerts",
		soundToggle: "Notification & Message Chime",
		soundDesc: "Plays a chime when new messages, grades, or alerts arrive.",
		chimeTone: "Chime Style",
		toneClassic: "Classic",
		toneSoft: "Soft",
		toneBright: "Bright",
		testChime: "Test Chime",
		desktopAlerts: "Device / Browser Notifications",
		desktopDesc: "Shown even when working in another tab.",
		desktopOn: "Enabled ✓",
		desktopOff: "Enable Now",
		desktopBlocked: "Blocked in Browser",
		dataTitle: "Backup & Reset",
		dataDesc: "Export your local flashcards & question bank as JSON, or restore defaults.",
		exportBtn: "Export Local Data (JSON)",
		resetBtn: "Reset to Defaults",
		exportedMsg: "Backup JSON downloaded successfully",
		resetMsg: "Settings restored to defaults",
		permDeniedMsg: "Notifications are blocked in your browser site settings",
		permGrantedMsg: "Device notifications enabled"
	},
	fr: {
		title: "Paramètres & Personnalisation",
		subtitle: "Personnalisez la langue, le thème, les couleurs, la taille du texte et les sons.",
		langTitle: "Langue & Direction",
		langDesc: "Changez la langue et le sens d’affichage (RTL / LTR) instantanément.",
		themeTitle: "Thème Visuel",
		themeDesc: "Choisissez le mode adapté à votre confort de lecture.",
		themeLight: "Clair",
		themeDark: "Sombre",
		themeWarm: "Papier Chaud",
		accentTitle: "Couleur Principale",
		accentDesc: "S’applique aux boutons principaux, onglets actifs et indicateurs.",
		previewBadge: "Aperçu en direct",
		previewText: "Voici l’apparence actuelle de votre thème",
		previewBtn: "Bouton test",
		displayTitle: "Texte & Affichage",
		fontSize: "Taille de police",
		fontSm: "Compact",
		fontMd: "Standard",
		fontLg: "Grand",
		compactMode: "Mode d’affichage compact",
		compactDesc: "Réduit les marges pour afficher plus d’informations.",
		reducedMotion: "Réduire les animations",
		reducedMotionDesc: "Désactive les transitions rapides pour plus de confort.",
		soundTitle: "Sons & Notifications",
		soundToggle: "Son des messages et alertes",
		soundDesc: "Joue une sonnerie lors d’un nouveau message ou d’une note.",
		chimeTone: "Style de sonnerie",
		toneClassic: "Classique",
		toneSoft: "Douce",
		toneBright: "Claire",
		testChime: "Tester le son",
		desktopAlerts: "Alertes Navigateur / Appareil",
		desktopDesc: "Visibles même depuis un autre onglet.",
		desktopOn: "Activées ✓",
		desktopOff: "Activer",
		desktopBlocked: "Bloquées",
		dataTitle: "Sauvegarde & Réinitialisation",
		dataDesc: "Exportez vos cartes et votre banque de questions en JSON ou réinitialisez.",
		exportBtn: "Exporter mes données (JSON)",
		resetBtn: "Réinitialiser",
		exportedMsg: "Sauvegarde JSON téléchargée avec succès",
		resetMsg: "Paramètres réinitialisés",
		permDeniedMsg: "Les notifications sont bloquées dans les paramètres du navigateur",
		permGrantedMsg: "Alertes appareil activées"
	}
};
var SettingsView = ({ currentProfile, onNotify }) => {
	const { settings, updateSettings, resetSettings } = useAppSettings();
	const t = LABELS[settings.lang];
	const [soundOn, setSoundOn] = (0, import_react.useState)(() => isSoundEnabled());
	const [desktopOn, setDesktopOn] = (0, import_react.useState)(() => isDesktopNotifEnabled());
	const [notifPerm, setNotifPerm] = (0, import_react.useState)(() => typeof window !== "undefined" && "Notification" in window ? Notification.permission : "unsupported");
	const handleSoundToggle = () => {
		const next = !soundOn;
		setSoundOn(next);
		setSoundEnabled(next);
		if (next) playNotificationChime("message", true, settings.chimeTone);
	};
	const handleToneSelect = (tone) => {
		updateSettings({ chimeTone: tone });
		playNotificationChime("message", true, tone);
	};
	const handleDesktopToggle = async () => {
		if (notifPerm === "granted") {
			const next = !desktopOn;
			setDesktopOn(next);
			setDesktopNotifEnabled(next);
			return;
		}
		const res = await requestBrowserNotificationPermission();
		setNotifPerm(res);
		if (res === "granted") {
			setDesktopOn(true);
			playNotificationChime("alert", true, settings.chimeTone);
			onNotify(t.permGrantedMsg, true);
		} else if (res === "denied") onNotify(t.permDeniedMsg, false);
	};
	const handleExportLocalData = () => {
		let flashcards = [];
		try {
			const rawCards = localStorage.getItem(`nemvia-cards-${currentProfile.id}`);
			if (rawCards) flashcards = JSON.parse(rawCards);
		} catch {}
		const bank = loadQuestionBank(currentProfile.id);
		const payload = {
			exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
			user: {
				id: currentProfile.id,
				name: currentProfile.display_name,
				role: currentProfile.role
			},
			settings,
			flashcards,
			questionBank: bank
		};
		const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
		saveOrShareBlobFile(blob, `nemvia-backup-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.json`);
		onNotify(t.exportedMsg, true);
	};
	const handleResetAll = () => {
		resetSettings();
		setSoundEnabled(true);
		setSoundOn(true);
		onNotify(t.resetMsg, true);
	};
	const accentLabel = (opt) => settings.lang === "en" ? opt.labelEn : settings.lang === "fr" ? opt.labelFr : opt.labelAr;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 max-w-4xl mx-auto",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white rounded-3xl border border-slate-200 p-6 flex items-center justify-between gap-4 flex-wrap",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-11 h-11 rounded-2xl bg-[#1677c7] text-white flex items-center justify-center shrink-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersVertical, { className: "w-5 h-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-xl font-black text-slate-900",
						children: t.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-slate-500 mt-0.5",
						children: t.subtitle
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[11px] font-bold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700",
					children: currentProfile.display_name
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 md:grid-cols-2 gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "bg-white rounded-3xl border border-slate-200 p-5 space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "w-4 h-4 text-[#1677c7]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-black text-sm text-slate-900",
							children: t.langTitle
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-slate-500",
							children: t.langDesc
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-3 gap-2",
						children: [
							{
								id: "ar",
								label: "العربية",
								sub: "RTL"
							},
							{
								id: "en",
								label: "English",
								sub: "LTR"
							},
							{
								id: "fr",
								label: "Français",
								sub: "LTR"
							}
						].map((lang) => {
							const active = settings.lang === lang.id;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => updateSettings({ lang: lang.id }),
								className: `p-3 rounded-2xl border text-center transition-all cursor-pointer ${active ? "bg-[#1677c7] text-white border-[#1677c7] shadow-xs" : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block font-black text-xs",
									children: lang.label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `block text-[10px] mt-0.5 ${active ? "text-white/80" : "text-slate-400"}`,
									children: lang.sub
								})]
							}, lang.id);
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "bg-white rounded-3xl border border-slate-200 p-5 space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Monitor, { className: "w-4 h-4 text-[#1677c7]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-black text-sm text-slate-900",
							children: t.themeTitle
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-slate-500",
							children: t.themeDesc
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-3 gap-2",
						children: [
							{
								id: "light",
								label: t.themeLight,
								icon: Sun,
								swatch: "bg-white border-slate-300"
							},
							{
								id: "dark",
								label: t.themeDark,
								icon: Moon,
								swatch: "bg-slate-900 border-slate-700"
							},
							{
								id: "warm",
								label: t.themeWarm,
								icon: Sparkles,
								swatch: "bg-[#f4ede0] border-[#d6c9b0]"
							}
						].map((item) => {
							const Icon = item.icon;
							const active = settings.theme === item.id;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => updateSettings({ theme: item.id }),
								className: `p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${active ? "border-[#1677c7] bg-sky-50 text-[#1677c7]" : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `w-6 h-6 rounded-full border ${item.swatch} flex items-center justify-center`,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "w-3.5 h-3.5 text-slate-600" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold text-[11px]",
									children: item.label
								})]
							}, item.id);
						})
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "bg-white rounded-3xl border border-slate-200 p-5 space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Palette, { className: "w-4 h-4 text-[#1677c7]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-black text-sm text-slate-900",
							children: t.accentTitle
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-slate-500",
							children: t.accentDesc
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5",
						children: ACCENT_OPTIONS.map((opt) => {
							const active = settings.accent === opt.id;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => updateSettings({ accent: opt.id }),
								className: `p-2.5 rounded-2xl border flex items-center gap-2 transition-all cursor-pointer ${active ? "border-[#1677c7] bg-slate-50 shadow-xs" : "border-slate-200 hover:bg-slate-50"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "w-6 h-6 rounded-xl flex items-center justify-center text-white shrink-0",
									style: { backgroundColor: opt.hex },
									children: active && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-3.5 h-3.5" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] font-bold text-slate-800 truncate",
									children: accentLabel(opt)
								})]
							}, opt.id);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 flex-wrap",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "px-2.5 py-1 rounded-lg bg-[#1677c7] text-white text-[10px] font-black",
								children: t.previewBadge
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-bold text-slate-700",
								children: t.previewText
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => playNotificationChime("grade", true, settings.chimeTone),
							className: "px-3.5 py-1.5 rounded-xl bg-[#1677c7] hover:bg-[#125fa0] text-white text-xs font-bold cursor-pointer",
							children: t.previewBtn
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 md:grid-cols-2 gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "bg-white rounded-3xl border border-slate-200 p-5 space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Type, { className: "w-4 h-4 text-[#1677c7]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-black text-sm text-slate-900",
								children: t.displayTitle
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-bold text-slate-700 block",
								children: t.fontSize
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-3 gap-2",
								children: [
									{
										id: "sm",
										label: t.fontSm
									},
									{
										id: "md",
										label: t.fontMd
									},
									{
										id: "lg",
										label: t.fontLg
									}
								].map((f) => {
									const active = settings.fontScale === f.id;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => updateSettings({ fontScale: f.id }),
										className: `py-2 px-3 rounded-xl border text-xs font-bold cursor-pointer transition-colors ${active ? "bg-[#1677c7] text-white border-[#1677c7]" : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"}`,
										children: f.label
									}, f.id);
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-xs font-bold text-slate-900",
								children: t.compactMode
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-[11px] text-slate-500",
								children: t.compactDesc
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: settings.compactMode,
								onChange: (e) => updateSettings({ compactMode: e.target.checked }),
								className: "w-4 h-4 accent-[#1677c7]"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-xs font-bold text-slate-900",
								children: t.reducedMotion
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-[11px] text-slate-500",
								children: t.reducedMotionDesc
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: settings.reducedMotion,
								onChange: (e) => updateSettings({ reducedMotion: e.target.checked }),
								className: "w-4 h-4 accent-[#1677c7]"
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "bg-white rounded-3xl border border-slate-200 p-5 space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "w-4 h-4 text-[#1677c7]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-black text-sm text-slate-900",
								children: t.soundTitle
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: handleSoundToggle,
							className: "w-full flex items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer text-start",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-xs font-bold text-slate-900",
								children: t.soundToggle
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-[11px] text-slate-500",
								children: t.soundDesc
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${soundOn ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-500"}`,
								children: soundOn ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "w-4 h-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "w-4 h-4" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-bold text-slate-700",
									children: t.chimeTone
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => playNotificationChime("message", true, settings.chimeTone),
									className: "text-[11px] font-bold text-[#1677c7] hover:underline cursor-pointer",
									children: t.testChime
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-3 gap-2",
								children: [
									{
										id: "classic",
										label: t.toneClassic
									},
									{
										id: "soft",
										label: t.toneSoft
									},
									{
										id: "bright",
										label: t.toneBright
									}
								].map((tone) => {
									const active = settings.chimeTone === tone.id;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => handleToneSelect(tone.id),
										className: `py-2 px-3 rounded-xl border text-xs font-bold cursor-pointer transition-colors ${active ? "bg-[#1677c7] text-white border-[#1677c7]" : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"}`,
										children: tone.label
									}, tone.id);
								})
							})]
						}),
						notifPerm !== "unsupported" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-xs font-bold text-slate-900",
								children: t.desktopAlerts
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-[11px] text-slate-500",
								children: t.desktopDesc
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: handleDesktopToggle,
								disabled: notifPerm === "denied",
								className: `px-3 py-1.5 rounded-xl text-[11px] font-bold cursor-pointer shrink-0 ${notifPerm === "denied" ? "bg-rose-50 text-rose-600 cursor-not-allowed" : notifPerm === "granted" && desktopOn ? "bg-emerald-100 text-emerald-800" : "bg-[#1677c7] text-white"}`,
								children: notifPerm === "denied" ? t.desktopBlocked : notifPerm === "granted" && desktopOn ? t.desktopOn : t.desktopOff
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "bg-white rounded-3xl border border-slate-200 p-5 flex items-center justify-between gap-4 flex-wrap",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-black text-sm text-slate-900",
					children: t.dataTitle
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] text-slate-500 mt-0.5",
					children: t.dataDesc
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 flex-wrap",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: handleExportLocalData,
						className: "inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t.exportBtn })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: handleResetAll,
						className: "inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-bold cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t.resetBtn })]
					})]
				})]
			})
		]
	});
};
export { SettingsView };
