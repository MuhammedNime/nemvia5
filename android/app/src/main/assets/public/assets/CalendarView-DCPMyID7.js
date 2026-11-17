import { r as __toESM } from "./rolldown-runtime-SbdDWaPq.js";
import { $t as CircleCheck, B as Radio, Gt as Clock, It as FileCheck, nn as ChevronRight, rn as ChevronLeft, un as Calendar, wn as require_react, zt as ExternalLink } from "./icons-Ba0nzYf3.js";
import { N as useAppSettings } from "./index-Bhmlh-C3.js";
import { t as require_jsx_runtime } from "./react-vendor-Dpw1FlJl.js";
// src/components/views/CalendarView.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var toDateKey = (iso) => {
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return "";
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
var CalendarView = ({ currentRole, currentUserId, assignments, submissions, liveSessions, onNavigate }) => {
	const { settings } = useAppSettings();
	const now = /* @__PURE__ */ new Date();
	const [viewMonth, setViewMonth] = (0, import_react.useState)(new Date(now.getFullYear(), now.getMonth(), 1));
	const [selectedDayKey, setSelectedDayKey] = (0, import_react.useState)(toDateKey(now.toISOString()));
	const locale = settings.lang === "en" ? "en-US" : settings.lang === "fr" ? "fr-FR" : "ar";
	const events = (0, import_react.useMemo)(() => {
		const out = [];
		const nowMs = Date.now();
		assignments.forEach((a) => {
			const key = toDateKey(a.due_at);
			if (!key) return;
			const mySub = submissions.find((s) => s.assignment_id === a.id && s.student_id === currentUserId);
			const dueMs = new Date(a.due_at).getTime();
			const overdue = !mySub && dueMs < nowMs;
			let statusLabel = `${a.total_points} درجة`;
			let statusTone = "amber";
			if (currentRole === "student") {
				if (mySub?.grade !== void 0) {
					statusLabel = `مُصحح (${mySub.grade}/${a.total_points})`;
					statusTone = "emerald";
				} else if (mySub) {
					statusLabel = "تم التسليم ✓";
					statusTone = "emerald";
				} else if (overdue) {
					statusLabel = "متأخر";
					statusTone = "rose";
				} else {
					statusLabel = "مطلوب التسليم";
					statusTone = "amber";
				}
			} else {
				statusLabel = `${a.submissions_count} تسليم`;
				statusTone = "sky";
			}
			out.push({
				id: `asg-${a.id}`,
				dateKey: key,
				iso: a.due_at,
				type: "assignment",
				title: a.title,
				meta: a.class_title || a.teacher_name,
				statusLabel,
				statusTone
			});
		});
		liveSessions.forEach((ls) => {
			const key = toDateKey(ls.starts_at);
			if (!key) return;
			out.push({
				id: `live-${ls.id}`,
				dateKey: key,
				iso: ls.starts_at,
				type: "live",
				title: ls.title,
				meta: ls.class_title || ls.host_name,
				statusLabel: ls.status === "live" ? "بث مباشر الآن" : ls.status === "ended" ? "انتهت" : "مجدولة",
				statusTone: ls.status === "live" ? "rose" : ls.status === "ended" ? "sky" : "emerald",
				meetingUrl: ls.meeting_url
			});
		});
		return out.sort((a, b) => a.iso.localeCompare(b.iso));
	}, [
		assignments,
		submissions,
		liveSessions,
		currentUserId,
		currentRole
	]);
	const eventsByDay = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		events.forEach((ev) => {
			const list = map.get(ev.dateKey) || [];
			list.push(ev);
			map.set(ev.dateKey, list);
		});
		return map;
	}, [events]);
	const year = viewMonth.getFullYear();
	const month = viewMonth.getMonth();
	const firstDayOffset = new Date(year, month, 1).getDay();
	const daysInMonth = new Date(year, month + 1, 0).getDate();
	const cells = [];
	for (let i = 0; i < firstDayOffset; i++) cells.push({
		day: null,
		key: `pad-${i}`
	});
	for (let d = 1; d <= daysInMonth; d++) {
		const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
		cells.push({
			day: d,
			key
		});
	}
	const todayKey = toDateKey(now.toISOString());
	const selectedEvents = eventsByDay.get(selectedDayKey) || [];
	const upcomingEvents = events.filter((ev) => ev.dateKey >= todayKey).slice(0, 12);
	const dayNames = settings.lang === "en" ? [
		"Sun",
		"Mon",
		"Tue",
		"Wed",
		"Thu",
		"Fri",
		"Sat"
	] : settings.lang === "fr" ? [
		"Dim",
		"Lun",
		"Mar",
		"Mer",
		"Jeu",
		"Ven",
		"Sam"
	] : [
		"الأحد",
		"الإثنين",
		"الثلاثاء",
		"الأربعاء",
		"الخميس",
		"الجمعة",
		"السبت"
	];
	const titleText = settings.lang === "en" ? "Academic Calendar & Schedule" : settings.lang === "fr" ? "Calendrier & Échéances" : "التقويم الدراسي والمواعيد";
	const subtitleText = settings.lang === "en" ? "All assignment deadlines and scheduled live sessions in one place." : settings.lang === "fr" ? "Suivez les dates limites des devoirs et les sessions en direct." : "تابع مواعيد تسليم الواجبات والحصص المباشرة المجدولة في تقويم واحد.";
	const badgeToneClass = (tone) => tone === "emerald" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : tone === "rose" ? "bg-rose-50 text-rose-700 border-rose-200" : tone === "amber" ? "bg-amber-50 text-amber-800 border-amber-200" : "bg-sky-50 text-[#1677c7] border-sky-200";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 animate-in fade-in",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-white rounded-3xl border border-slate-200 p-6 flex flex-wrap items-center justify-between gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-11 h-11 rounded-2xl bg-[#1677c7] text-white flex items-center justify-center shrink-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "w-5 h-5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-black text-slate-900",
					children: titleText
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-slate-500 mt-0.5",
					children: subtitleText
				})] })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 text-xs font-bold",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200",
					children: [
						assignments.length,
						" ",
						settings.lang === "en" ? "Tasks" : "واجبات"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200",
					children: [
						liveSessions.length,
						" ",
						settings.lang === "en" ? "Live" : "حصص"
					]
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 lg:grid-cols-12 gap-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-5 space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-black text-slate-900 text-base",
							children: viewMonth.toLocaleDateString(locale, {
								month: "long",
								year: "numeric"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setViewMonth(new Date(year, month - 1, 1)),
									className: "p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-4 h-4" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => {
										setViewMonth(new Date(now.getFullYear(), now.getMonth(), 1));
										setSelectedDayKey(todayKey);
									},
									className: "px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer",
									children: settings.lang === "en" ? "Today" : settings.lang === "fr" ? "Aujourd’hui" : "اليوم"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setViewMonth(new Date(year, month + 1, 1)),
									className: "p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "w-4 h-4" })
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-7 gap-1.5 text-center text-[11px] font-bold text-slate-500",
						children: dayNames.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "py-1.5",
							children: d
						}, d))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-7 gap-1.5",
						children: cells.map((c) => {
							if (!c.day) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-14 sm:h-16 rounded-xl bg-slate-50/40" }, c.key);
							const dayEvents = eventsByDay.get(c.key) || [];
							const isToday = c.key === todayKey;
							const isSelected = c.key === selectedDayKey;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setSelectedDayKey(c.key),
								className: `h-14 sm:h-16 rounded-xl border p-1.5 flex flex-col justify-between text-start transition-all cursor-pointer ${isSelected ? "border-[#1677c7] bg-sky-50" : isToday ? "border-slate-400 bg-slate-50" : "border-slate-200 bg-white hover:bg-slate-50"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `text-xs font-black tabular-nums ${isToday ? "text-[#1677c7]" : "text-slate-800"}`,
									children: c.day
								}), dayEvents.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1 flex-wrap",
									children: [dayEvents.slice(0, 3).map((ev) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `w-2 h-2 rounded-full ${ev.type === "live" ? "bg-rose-500" : "bg-amber-500"}` }, ev.id)), dayEvents.length > 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[9px] font-bold text-slate-500",
										children: ["+", dayEvents.length - 3]
									})]
								})]
							}, c.key);
						})
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg:col-span-5 space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white rounded-3xl border border-slate-200 p-5 space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-black text-sm text-slate-900",
							children: (/* @__PURE__ */ new Date(`${selectedDayKey}T12:00:00`)).toLocaleDateString(locale, {
								weekday: "long",
								day: "numeric",
								month: "long"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] font-bold text-slate-500",
							children: selectedEvents.length
						})]
					}), selectedEvents.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-slate-400 py-4 text-center",
						children: settings.lang === "en" ? "No events scheduled on this day." : "لا توجد مواعيد في هذا اليوم."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-2.5",
						children: selectedEvents.map((ev) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1.5 text-xs font-bold text-slate-900",
									children: [ev.type === "live" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { className: "w-3.5 h-3.5 text-rose-600" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileCheck, { className: "w-3.5 h-3.5 text-amber-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: ev.title })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeToneClass(ev.statusTone)}`,
									children: ev.statusLabel
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-[11px] text-slate-500",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-3 h-3" }),
										new Date(ev.iso).toLocaleTimeString(locale, {
											hour: "2-digit",
											minute: "2-digit"
										}),
										" · ",
										ev.meta
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [ev.meetingUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										href: ev.meetingUrl,
										target: "_blank",
										rel: "noopener noreferrer",
										className: "text-[#1677c7] font-bold inline-flex items-center gap-1 hover:underline",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "w-3 h-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "دخول" })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => onNavigate(ev.type === "live" ? "live" : "assignments"),
										className: "font-bold text-slate-700 hover:underline cursor-pointer",
										children: settings.lang === "en" ? "Open" : "فتح"
									})]
								})]
							})]
						}, ev.id))
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white rounded-3xl border border-slate-200 p-5 space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "font-black text-sm text-slate-900 flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-4 h-4 text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: settings.lang === "en" ? "Upcoming Agenda" : "الأجندة القادمة" })]
					}), upcomingEvents.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-slate-400 text-center py-4",
						children: settings.lang === "en" ? "All caught up!" : "لا توجد مواعيد قادمة حالياً."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-2 max-h-72 overflow-y-auto",
						children: upcomingEvents.map((ev) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => {
								setSelectedDayKey(ev.dateKey);
								const d = new Date(ev.iso);
								setViewMonth(new Date(d.getFullYear(), d.getMonth(), 1));
							},
							className: "w-full p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-between gap-2 text-start cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-bold text-slate-900 truncate",
									children: ev.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[10px] text-slate-500",
									children: [
										new Date(ev.iso).toLocaleDateString(locale, {
											day: "numeric",
											month: "short"
										}),
										" · ",
										ev.meta
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `text-[10px] font-bold px-2 py-0.5 rounded-lg border shrink-0 ${badgeToneClass(ev.statusTone)}`,
								children: ev.statusLabel
							})]
						}, ev.id))
					})]
				})]
			})]
		})]
	});
};
export { CalendarView };
