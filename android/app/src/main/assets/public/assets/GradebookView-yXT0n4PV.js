import { r as __toESM } from "./rolldown-runtime-SbdDWaPq.js";
import { Kt as Award, Yt as require_react, _t as FileCheck, kt as CircleCheck, ut as Funnel, wt as ClipboardList, yt as Download } from "./icons-y6mUmdUg.js";
import { d as useAppSettings, h as saveOrShareBlobFile } from "./index-CVEKnASN.js";
import { t as require_jsx_runtime } from "./react-vendor-CpCOhAWp.js";
// src/components/views/GradebookView.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var GradebookView = ({ currentRole, currentUserId, currentUserName, classes, quizzes, assignments, submissions, onNavigate }) => {
	const { settings } = useAppSettings();
	const isTeacherOrAdmin = currentRole === "teacher" || currentRole === "admin";
	const [selectedClass, setSelectedClass] = (0, import_react.useState)("all");
	const [typeFilter, setTypeFilter] = (0, import_react.useState)("all");
	const classMap = (0, import_react.useMemo)(() => new Map(classes.map((c) => [c.id, c.title])), [classes]);
	const rows = (0, import_react.useMemo)(() => {
		const out = [];
		if (isTeacherOrAdmin) {
			quizzes.forEach((q) => {
				if (selectedClass !== "all" && q.class_id !== selectedClass) return;
				const max = q.questions.reduce((s, qq) => s + qq.points, 0) || 1;
				(q.attempts || []).forEach((att) => {
					out.push({
						id: `qz-${q.id}-${att.id}`,
						studentName: att.student_name,
						className: q.class_title || classMap.get(q.class_id) || "صف",
						itemType: "اختبار",
						title: q.title,
						score: att.score,
						maxScore: att.totalPoints || max,
						status: att.needsManualGrading ? "submitted" : "graded",
						feedback: att.teacherFeedback
					});
				});
			});
			assignments.forEach((a) => {
				if (selectedClass !== "all" && a.class_id !== selectedClass) return;
				submissions.filter((s) => s.assignment_id === a.id).forEach((sub) => {
					out.push({
						id: `asg-${a.id}-${sub.id}`,
						studentName: sub.student_name,
						className: a.class_title || classMap.get(a.class_id) || "صف",
						itemType: "واجب",
						title: a.title,
						score: sub.grade ?? null,
						maxScore: a.total_points,
						status: sub.grade !== void 0 ? "graded" : "submitted",
						feedback: sub.teacher_feedback
					});
				});
			});
		} else {
			quizzes.forEach((q) => {
				if (selectedClass !== "all" && q.class_id !== selectedClass) return;
				const max = q.questions.reduce((s, qq) => s + qq.points, 0) || 1;
				out.push({
					id: `st-qz-${q.id}`,
					studentName: currentUserName,
					className: q.class_title || classMap.get(q.class_id) || "صف",
					itemType: "اختبار",
					title: q.title,
					score: q.attempted ? q.myScore ?? 0 : null,
					maxScore: max,
					status: !q.attempted ? "pending" : q.needsManualGrading ? "submitted" : "graded",
					feedback: q.teacherFeedback
				});
			});
			assignments.forEach((a) => {
				if (selectedClass !== "all" && a.class_id !== selectedClass) return;
				const sub = submissions.find((s) => s.assignment_id === a.id && s.student_id === currentUserId);
				out.push({
					id: `st-asg-${a.id}`,
					studentName: currentUserName,
					className: a.class_title || classMap.get(a.class_id) || "صف",
					itemType: "واجب",
					title: a.title,
					score: sub?.grade ?? null,
					maxScore: a.total_points,
					status: !sub ? "pending" : sub.grade !== void 0 ? "graded" : "submitted",
					feedback: sub?.teacher_feedback
				});
			});
		}
		return out.filter((r) => typeFilter === "all" ? true : r.itemType === typeFilter);
	}, [
		isTeacherOrAdmin,
		quizzes,
		assignments,
		submissions,
		selectedClass,
		typeFilter,
		currentUserId,
		currentUserName,
		classMap
	]);
	const gradedRows = rows.filter((r) => r.score !== null && r.maxScore > 0);
	const avgPercent = gradedRows.length > 0 ? Math.round(gradedRows.reduce((sum, r) => sum + (r.score ?? 0) / r.maxScore * 100, 0) / gradedRows.length) : 0;
	const pendingReviewCount = rows.filter((r) => r.status === "submitted").length;
	const exportCsv = () => {
		const header = [
			"الطالب",
			"الصف",
			"النوع",
			"العنوان",
			"الدرجة",
			"الدرجة العظمى",
			"النسبة %",
			"الحالة",
			"ملاحظة المعلم"
		];
		const escapeCell = (v) => `"${String(v ?? "").replace(/"/g, "\"\"")}"`;
		const lines = [header.map(escapeCell).join(","), ...rows.map((r) => {
			const pct = r.score !== null && r.maxScore > 0 ? Math.round(r.score / r.maxScore * 100) : "-";
			const st = r.status === "graded" ? "مرصود" : r.status === "submitted" ? "بانتظار التصحيح" : "لم يُسلّم";
			return [
				r.studentName,
				r.className,
				r.itemType,
				r.title,
				r.score ?? "-",
				r.maxScore,
				pct,
				st,
				r.feedback || ""
			].map(escapeCell).join(",");
		})];
		const blob = new Blob(["﻿" + lines.join("\n")], { type: "text/csv;charset=utf-8;" });
		saveOrShareBlobFile(blob, `nemvia-grades-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`);
	};
	const heading = settings.lang === "en" ? "Comprehensive Gradebook" : settings.lang === "fr" ? "Relevé de notes" : "سجل الدرجات الشامل";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 animate-in fade-in",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white rounded-3xl border border-slate-200 p-6 flex flex-wrap items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-11 h-11 rounded-2xl bg-[#1677c7] text-white flex items-center justify-center shrink-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardList, { className: "w-5 h-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-xl font-black text-slate-900",
						children: heading
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-slate-500 mt-0.5",
						children: isTeacherOrAdmin ? "استعراض جميع درجات الاختبارات والواجبات للطلاب وتصدير كشف CSV/Excel." : "متابعة درجاتك في كل الاختبارات والواجبات وملاحظات المعلم في مكان واحد."
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: exportCsv,
					disabled: rows.length === 0,
					className: "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold cursor-pointer",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: settings.lang === "en" ? "Export CSV / Excel" : "تصدير كشف الدرجات (CSV)" })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 sm:grid-cols-4 gap-3.5 tabular-nums",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white rounded-2xl border border-slate-200 p-4 space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-bold text-slate-500 block",
							children: "إجمالي السجلات"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-2xl font-black text-slate-900 block",
							children: rows.length
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white rounded-2xl border border-slate-200 p-4 space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-bold text-slate-500 block",
							children: "المعدل العام"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-2xl font-black text-[#1677c7] block",
							children: [avgPercent, "%"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white rounded-2xl border border-slate-200 p-4 space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-bold text-slate-500 block",
							children: "مرصود الدرجة"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-2xl font-black text-emerald-600 block",
							children: gradedRows.length
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white rounded-2xl border border-slate-200 p-4 space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-bold text-slate-500 block",
							children: "بانتظار المراجعة"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-2xl font-black text-amber-600 block",
							children: pendingReviewCount
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "bg-white rounded-2xl border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3 text-xs",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 flex-wrap",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "w-4 h-4 text-slate-400" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: selectedClass,
							onChange: (e) => setSelectedClass(e.target.value),
							className: "px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-bold outline-none",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "all",
								children: "كل الصفوف"
							}), classes.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: c.id,
								children: c.title
							}, c.id))]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center gap-1 bg-slate-100 p-1 rounded-xl font-bold",
							children: [
								["all", "الكل"],
								["اختبار", "الاختبارات"],
								["واجب", "الواجبات"]
							].map(([val, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setTypeFilter(val),
								className: `px-3 py-1 rounded-lg cursor-pointer ${typeFilter === val ? "bg-white text-[#1677c7] shadow-xs" : "text-slate-600"}`,
								children: label
							}, val))
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "bg-white rounded-3xl border border-slate-200 overflow-hidden",
				children: rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-10 text-center space-y-2 text-xs text-slate-500",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-bold text-slate-700",
						children: "لا توجد درجات أو محاولات مسجلة ضمن هذا التصنيف بعد."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-center gap-2 pt-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => onNavigate("courses"),
							className: "px-4 py-2 rounded-xl bg-[#1677c7] text-white font-bold cursor-pointer",
							children: "فتح الاختبارات"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => onNavigate("assignments"),
							className: "px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold cursor-pointer",
							children: "فتح الواجبات"
						})]
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-xs text-start",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "bg-slate-50 border-b border-slate-200 text-slate-600 font-bold",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								isTeacherOrAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 px-4 text-start",
									children: "الطالب"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 px-4 text-start",
									children: "العنوان"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 px-4 text-start",
									children: "النوع"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 px-4 text-start",
									children: "الصف"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 px-4 text-start",
									children: "الدرجة"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 px-4 text-start",
									children: "الحالة"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 px-4 text-start",
									children: "ملاحظات المعلم"
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
							className: "divide-y divide-slate-100",
							children: rows.map((r) => {
								const pct = r.score !== null && r.maxScore > 0 ? Math.round(r.score / r.maxScore * 100) : null;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "hover:bg-slate-50/70",
									children: [
										isTeacherOrAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3 px-4 font-bold text-slate-900 whitespace-nowrap",
											children: r.studentName
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3 px-4 font-bold text-slate-900",
											children: r.title
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3 px-4",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: `inline-flex items-center gap-1 px-2 py-0.5 rounded-lg font-bold ${r.itemType === "اختبار" ? "bg-sky-50 text-[#1677c7]" : "bg-amber-50 text-amber-800"}`,
												children: [r.itemType === "اختبار" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "w-3 h-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileCheck, { className: "w-3 h-3" }), r.itemType]
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3 px-4 text-slate-500",
											children: r.className
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3 px-4 font-black tabular-nums",
											children: r.score !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: pct !== null && pct >= 60 ? "text-emerald-700" : "text-rose-600",
												children: [
													r.score,
													" / ",
													r.maxScore,
													" (",
													pct,
													"%)"
												]
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-slate-400",
												children: ["— / ", r.maxScore]
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3 px-4",
											children: r.status === "graded" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-3 h-3" }), " مرصود"]
											}) : r.status === "submitted" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "inline-flex px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold",
												children: "بانتظار التصحيح"
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "inline-flex px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold",
												children: "لم يُسلّم بعد"
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3 px-4 text-slate-600 max-w-xs truncate",
											children: r.feedback || "—"
										})
									]
								}, r.id);
							})
						})]
					})
				})
			})
		]
	});
};
export { GradebookView };
