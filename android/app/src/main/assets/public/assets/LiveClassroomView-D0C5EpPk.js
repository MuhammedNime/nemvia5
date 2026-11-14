import { r as __toESM } from "./rolldown-runtime-SbdDWaPq.js";
import { Ct as Clock, I as Plus, P as Radio, Tt as ClipboardCheck, Yt as require_react, kt as CircleCheck, n as X, vt as ExternalLink, yt as Download } from "./icons-y6mUmdUg.js";
import { h as saveOrShareBlobFile } from "./index-Du_wEuvA.js";
import { t as require_jsx_runtime } from "./react-vendor-CpCOhAWp.js";
// src/components/views/LiveClassroomView.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var attKey = (sessionId) => `nemvia-attendance-${sessionId}`;
function loadAttendance(sessionId) {
	try {
		const raw = localStorage.getItem(attKey(sessionId));
		return raw ? JSON.parse(raw) : {};
	} catch {
		return {};
	}
}
function saveAttendance(sessionId, records) {
	try {
		localStorage.setItem(attKey(sessionId), JSON.stringify(records));
	} catch {}
}
var LiveClassroomView = ({ currentRole, currentUserId, currentUserName, sessions, classes, classMembers = [], onScheduleSession, onSetStatus }) => {
	const [showSchedule, setShowSchedule] = (0, import_react.useState)(false);
	const [sTitle, setSTitle] = (0, import_react.useState)("");
	const [sDesc, setSDesc] = (0, import_react.useState)("");
	const [sClass, setSClass] = (0, import_react.useState)("");
	const [sWhen, setSWhen] = (0, import_react.useState)("");
	const [sProvider, setSProvider] = (0, import_react.useState)("jitsi");
	const [sLink, setSLink] = (0, import_react.useState)("");
	const [formErr, setFormErr] = (0, import_react.useState)(null);
	const [confirmCancelId, setConfirmCancelId] = (0, import_react.useState)(null);
	const [attendanceModalSession, setAttendanceModalSession] = (0, import_react.useState)(null);
	const [attendanceMap, setAttendanceMap] = (0, import_react.useState)({});
	const myClasses = classes.filter((c) => c.teacher_id === currentUserId);
	const canHost = currentRole === "teacher" || currentRole === "admin";
	const submitSchedule = async (e) => {
		e.preventDefault();
		setFormErr(null);
		let url = sLink.trim();
		if (sProvider === "jitsi") url = `https://meet.jit.si/${"nemvia-" + Math.random().toString(36).slice(2, 8) + Math.random().toString(36).slice(2, 8)}`;
		else if (!/^https:\/\//i.test(url)) {
			setFormErr("الصق رابط الاجتماع كاملاً (يبدأ بـ https://)");
			return;
		}
		if (await onScheduleSession({
			title: sTitle.trim(),
			description: sDesc.trim(),
			class_id: sClass || void 0,
			meeting_url: url,
			starts_at: sWhen ? new Date(sWhen).toISOString() : (/* @__PURE__ */ new Date()).toISOString()
		})) {
			setShowSchedule(false);
			setSTitle("");
			setSDesc("");
			setSLink("");
			setSWhen("");
		}
	};
	const recordCheckIn = (session, userId = currentUserId, userName = currentUserName) => {
		const prev = loadAttendance(session.id);
		const next = {
			...prev,
			[userId]: {
				userId,
				name: userName,
				status: prev[userId]?.status || "present",
				checkedAt: prev[userId]?.checkedAt || (/* @__PURE__ */ new Date()).toISOString()
			}
		};
		saveAttendance(session.id, next);
		if (attendanceModalSession?.id === session.id) setAttendanceMap(next);
	};
	const openAttendanceSheet = (session) => {
		const merged = { ...loadAttendance(session.id) };
		if (session.class_id) classMembers.filter((m) => m.class_id === session.class_id).forEach((m) => {
			if (!merged[m.user_id]) merged[m.user_id] = {
				userId: m.user_id,
				name: m.name,
				status: "absent"
			};
		});
		saveAttendance(session.id, merged);
		setAttendanceMap(merged);
		setAttendanceModalSession(session);
	};
	const updateAttendanceStatus = (userId, status) => {
		if (!attendanceModalSession) return;
		const prev = attendanceMap[userId];
		if (!prev) return;
		const next = {
			...attendanceMap,
			[userId]: {
				...prev,
				status,
				checkedAt: status !== "absent" ? prev.checkedAt || (/* @__PURE__ */ new Date()).toISOString() : void 0
			}
		};
		setAttendanceMap(next);
		saveAttendance(attendanceModalSession.id, next);
	};
	const exportAttendanceCsv = () => {
		if (!attendanceModalSession) return;
		const list = Object.values(attendanceMap);
		const statusLabel = (s) => s === "present" ? "حاضر" : s === "late" ? "متأخر" : "غائب";
		const esc = (v) => `"${v.replace(/"/g, "\"\"")}"`;
		const lines = [[
			"الاسم",
			"الحالة",
			"وقت الحضور"
		].map(esc).join(","), ...list.map((r) => [
			r.name,
			statusLabel(r.status),
			r.checkedAt ? new Date(r.checkedAt).toLocaleString("ar") : "—"
		].map(esc).join(","))];
		const blob = new Blob(["﻿" + lines.join("\n")], { type: "text/csv;charset=utf-8;" });
		saveOrShareBlobFile(blob, `attendance-${attendanceModalSession.title.slice(0, 20)}-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 animate-in fade-in",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white border border-slate-200 p-6 sm:p-7 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2 max-w-xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs font-bold text-[#1677c7] inline-flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "الحصص المباشرة والمجدولة" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-xl sm:text-2xl font-black text-slate-900",
							children: "قاعات البث المباشر والاجتماعات الأكاديمية"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs sm:text-sm text-slate-600 leading-relaxed",
							children: "انضم مباشرة إلى حصص المعلمين عبر Jitsi أو Google Meet مع تسجيل الحضور التلقائي وتصدير الكشوف."
						})
					]
				}), canHost && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex shrink-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setShowSchedule(true),
						className: "min-h-[44px] px-5 py-2.5 bg-[#1677c7] hover:bg-[#125fa0] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors whitespace-nowrap",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "جدولة حصة جديدة" })]
					})
				})]
			}),
			showSchedule && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4",
				onClick: () => setShowSchedule(false),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: submitSchedule,
					onClick: (e) => e.stopPropagation(),
					className: "bg-white rounded-3xl w-full max-w-lg p-6 space-y-3.5 shadow-2xl border border-slate-200",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-black text-slate-900 text-base",
								children: "جدولة حصة مباشرة"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setShowSchedule(false),
								className: "min-h-[40px] min-w-[40px] flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: sTitle,
							onChange: (e) => setSTitle(e.target.value),
							placeholder: "عنوان الحصة",
							required: true,
							maxLength: 120,
							className: "w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#1677c7]"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: sDesc,
							onChange: (e) => setSDesc(e.target.value),
							placeholder: "وصف مختصر",
							rows: 2,
							className: "w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#1677c7]"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: sClass,
								onChange: (e) => setSClass(e.target.value),
								className: "p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#1677c7]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "حصة عامة (للجميع)"
								}), myClasses.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: c.id,
									children: c.title
								}, c.id))]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "datetime-local",
								value: sWhen,
								onChange: (e) => setSWhen(e.target.value),
								required: true,
								className: "p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#1677c7]"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-2 text-xs font-bold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setSProvider("jitsi"),
								className: `min-h-[44px] py-2 rounded-xl border cursor-pointer ${sProvider === "jitsi" ? "border-[#1677c7] bg-sky-50 text-[#1677c7]" : "border-slate-200 text-slate-500"}`,
								children: "Jitsi (تلقائي ومجاني)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setSProvider("custom"),
								className: `min-h-[44px] py-2 rounded-xl border cursor-pointer ${sProvider === "custom" ? "border-[#1677c7] bg-sky-50 text-[#1677c7]" : "border-slate-200 text-slate-500"}`,
								children: "رابط Google Meet / غيره"
							})]
						}),
						sProvider === "custom" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: sLink,
							onChange: (e) => setSLink(e.target.value),
							placeholder: "https://meet.google.com/xxx-xxxx-xxx",
							dir: "ltr",
							className: "w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#1677c7]"
						}),
						formErr && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-bold text-rose-600",
							children: formErr
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							className: "w-full min-h-[44px] py-3 bg-[#1677c7] hover:bg-[#125fa0] text-white font-black rounded-xl text-sm cursor-pointer transition-colors",
							children: "جدولة الحصة"
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-black text-slate-900 text-lg",
							children: "الحصص المجدولة والمباشرة"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs text-slate-500 tabular-nums",
							children: [sessions.length, " حصص متاحة"]
						})]
					}),
					sessions.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white rounded-2xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500",
						children: ["لا توجد حصص مجدولة حالياً.", canHost ? " اضغط «جدولة حصة جديدة» لإنشاء أول حصة." : ""]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid md:grid-cols-2 gap-4",
						children: sessions.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-white rounded-2xl border border-slate-200 p-5 hover:border-[#1677c7] transition-all flex flex-col justify-between space-y-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between gap-2 text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: `font-bold inline-flex items-center gap-1.5 ${s.status === "live" ? "text-rose-600" : s.status === "ended" ? "text-slate-500" : "text-[#1677c7]"}`,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: s.status === "live" ? "بث حي الآن" : s.status === "ended" ? "انتهت" : "مجدولة" })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-xs text-slate-400 flex items-center gap-1 font-mono tabular-nums",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-3.5 h-3.5" }), new Date(s.starts_at).toLocaleString("ar", {
												weekday: "short",
												day: "numeric",
												month: "short",
												hour: "2-digit",
												minute: "2-digit"
											})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
										className: "font-extrabold text-slate-900 text-base leading-snug",
										children: s.title
									}),
									s.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-slate-600 leading-relaxed",
										children: s.description
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-8 h-8 rounded-full bg-sky-100 text-[#1677c7] flex items-center justify-center font-bold text-xs shrink-0",
										children: s.host_name.slice(0, 1)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-slate-800 block",
										children: s.host_name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] text-slate-400",
										children: s.class_title || "حصة عامة"
									})] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 flex-wrap",
									children: [
										canHost && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => openAttendanceSheet(s),
											className: "min-h-[40px] px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer inline-flex items-center gap-1 whitespace-nowrap",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardCheck, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "الحضور" })]
										}),
										s.host_id === currentUserId && s.status !== "ended" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
											s.status === "scheduled" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => onSetStatus(s.id, "live"),
												className: "min-h-[40px] px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl cursor-pointer whitespace-nowrap",
												children: "ابدأ"
											}),
											s.status === "live" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => onSetStatus(s.id, "ended"),
												className: "min-h-[40px] px-3 py-2 bg-slate-700 hover:bg-slate-800 text-white font-bold rounded-xl cursor-pointer whitespace-nowrap",
												children: "إنهاء"
											}),
											confirmCancelId === s.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "inline-flex items-center gap-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: () => {
														setConfirmCancelId(null);
														onSetStatus(s.id, "cancelled");
													},
													className: "min-h-[40px] px-3 py-2 bg-rose-600 text-white font-bold rounded-xl cursor-pointer whitespace-nowrap",
													children: "تأكيد الإلغاء"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: () => setConfirmCancelId(null),
													className: "min-h-[40px] px-2.5 py-2 bg-slate-100 text-slate-600 font-bold rounded-xl cursor-pointer whitespace-nowrap",
													children: "تراجع"
												})]
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => setConfirmCancelId(s.id),
												className: "min-h-[40px] px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold rounded-xl cursor-pointer whitespace-nowrap",
												children: "إلغاء"
											})
										] }),
										s.meeting_url && s.status !== "ended" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
											href: s.meeting_url,
											target: "_blank",
											rel: "noopener noreferrer",
											onClick: () => recordCheckIn(s),
											className: "min-h-[40px] px-4 py-2 bg-[#1677c7] hover:bg-[#125fa0] text-white font-bold rounded-xl transition-colors cursor-pointer inline-flex items-center gap-1.5 whitespace-nowrap",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "انضم للحصة" })]
										})
									]
								})]
							})]
						}, s.id))
					})
				]
			}),
			attendanceModalSession && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4",
				onClick: () => setAttendanceModalSession(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white rounded-3xl border border-slate-200 w-full max-w-xl p-6 space-y-4 shadow-2xl",
					onClick: (e) => e.stopPropagation(),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "font-black text-slate-900 text-base",
								children: ["سجل حضور الحصة: ", attendanceModalSession.title]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-slate-500",
								children: "يتم تسجيل حضور الطلاب تلقائياً عند الانضمام أو يدوياً من هنا."
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setAttendanceModalSession(null),
								className: "min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl bg-slate-100 text-slate-500 cursor-pointer",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "max-h-72 overflow-y-auto divide-y divide-slate-100 border border-slate-200 rounded-2xl",
							children: Object.values(attendanceMap).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-slate-400 text-center py-8",
								children: "لم يسجّل أحد حضوره لهذه الحصة بعد."
							}) : Object.values(attendanceMap).map((rec) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3 flex items-center justify-between gap-2 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold text-slate-900 block",
									children: rec.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] text-slate-400",
									children: rec.checkedAt ? `سجّل ${new Date(rec.checkedAt).toLocaleTimeString("ar", {
										hour: "2-digit",
										minute: "2-digit"
									})}` : "لم يحضر بعد"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex items-center gap-1 font-bold",
									children: [
										[
											"present",
											"حاضر",
											"bg-emerald-100 text-emerald-800 border-emerald-300"
										],
										[
											"late",
											"متأخر",
											"bg-amber-100 text-amber-800 border-amber-300"
										],
										[
											"absent",
											"غائب",
											"bg-rose-100 text-rose-700 border-rose-300"
										]
									].map(([st, lbl, activeCls]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => updateAttendanceStatus(rec.userId, st),
										className: `min-h-[36px] px-2.5 py-1 rounded-lg border text-[11px] cursor-pointer ${rec.status === st ? activeCls : "bg-slate-50 text-slate-500 border-slate-200"}`,
										children: lbl
									}, st))
								})]
							}, rec.userId))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs font-bold text-slate-600 flex items-center gap-1.5 tabular-nums",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-4 h-4 text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									"الحاضرون: ",
									Object.values(attendanceMap).filter((r) => r.status === "present").length,
									" / ",
									Object.values(attendanceMap).length
								] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: exportAttendanceCsv,
								disabled: Object.values(attendanceMap).length === 0,
								className: "min-h-[40px] inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "تصدير CSV" })]
							})]
						})
					]
				})
			})
		]
	});
};
export { LiveClassroomView };
