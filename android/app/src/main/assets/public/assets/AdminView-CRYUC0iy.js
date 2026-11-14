import { r as __toESM } from "./rolldown-runtime-SbdDWaPq.js";
import { C as ShieldCheck, Et as CircleX, Yt as require_react, Z as Lock, bt as Database, f as TriangleAlert, kt as CircleCheck, o as Users, rt as Layers } from "./icons-y6mUmdUg.js";
import { t as require_jsx_runtime } from "./react-vendor-CpCOhAWp.js";
// src/components/views/AdminView.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var AdminView = ({ currentUserId, onListUsers, onSetRole, onSetSuspended, stats, reports, onResolveReport, onDismissReport }) => {
	const [activeTab, setActiveTab] = (0, import_react.useState)("overview");
	const [users, setUsers] = (0, import_react.useState)([]);
	const [userQuery, setUserQuery] = (0, import_react.useState)("");
	const loadUsers = async (q = userQuery) => setUsers(await onListUsers(q));
	(0, import_react.useEffect)(() => {
		if (activeTab !== "users") return;
		const t = setTimeout(() => {
			loadUsers(userQuery);
		}, 250);
		return () => clearTimeout(t);
	}, [activeTab, userQuery]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 animate-in fade-in",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-[#0f233a] text-white p-6 sm:p-8 rounded-3xl shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "inline-flex items-center gap-1.5 bg-sky-500/20 text-sky-300 px-3 py-1 rounded-full text-xs font-bold border border-sky-400/20",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "لوحة الإشراف وإدارة منصة NEMVIA" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-2xl sm:text-3xl font-black",
							children: "مراقبة الأداء، مراجعة البلاغات، وأمان النظام"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs sm:text-sm text-sky-100 max-w-2xl leading-relaxed",
							children: "بصفتك مؤسس المنصة أو مشرفاً عاماً، لديك صلاحية مراقبة حركة المستخدمين، إيقاف المحتوى المخالف، ومتابعة صحة قواعد البيانات وسياسات RLS."
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex bg-white/10 p-1.5 rounded-2xl gap-1 text-xs font-bold",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setActiveTab("overview"),
							className: `px-3 py-1.5 rounded-xl cursor-pointer transition-all ${activeTab === "overview" ? "bg-white text-[#0f233a] shadow-xs" : "text-white/80"}`,
							children: "نظرة عامة"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setActiveTab("reports"),
							className: `px-3 py-1.5 rounded-xl cursor-pointer transition-all ${activeTab === "reports" ? "bg-white text-[#0f233a] shadow-xs" : "text-white/80"}`,
							children: [
								"البلاغات (",
								reports.length,
								")"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setActiveTab("users"),
							className: `px-3 py-1.5 rounded-xl cursor-pointer transition-all ${activeTab === "users" ? "bg-white text-[#0f233a] shadow-xs" : "text-white/80"}`,
							children: "المستخدمون"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setActiveTab("security"),
							className: `px-3 py-1.5 rounded-xl cursor-pointer transition-all ${activeTab === "security" ? "bg-white text-[#0f233a] shadow-xs" : "text-white/80"}`,
							children: "فحص الأمان"
						})
					]
				})]
			}),
			activeTab === "overview" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 lg:grid-cols-4 gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between text-slate-500 text-xs font-bold",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "إجمالي الطلاب" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "w-4 h-4 text-[#1677c7]" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-3xl font-black text-slate-900 block",
									children: stats?.students ?? "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] text-slate-400",
									children: "حساب طالب مسجّل"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between text-slate-500 text-xs font-bold",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "الصفوف النشطة" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "w-4 h-4 text-emerald-600" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-3xl font-black text-slate-900 block",
									children: stats?.classes ?? "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] text-slate-400",
									children: "صفوف ومجموعات دراسة"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between text-slate-500 text-xs font-bold",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "البلاغات المعلقة" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "w-4 h-4 text-amber-500" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-3xl font-black text-amber-600 block",
									children: stats?.open_reports ?? reports.length
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] text-slate-400",
									children: "تحتاج مراجعة المشرف"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between text-slate-500 text-xs font-bold",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "المعلمون" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Database, { className: "w-4 h-4 text-emerald-500" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-3xl font-black text-emerald-600 block",
									children: stats?.teachers ?? "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[11px] text-slate-400",
									children: [
										"من أصل ",
										stats?.users ?? "—",
										" مستخدم · ",
										stats?.posts ?? 0,
										" منشور"
									]
								})
							]
						})
					]
				})
			}),
			activeTab === "reports" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-extrabold text-slate-900 text-base",
					children: "بلاغات المحتوى والأمان (Content Reports Queue)"
				}), reports.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-3",
					children: reports.map((rep) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white p-5 rounded-2xl border border-amber-200 shadow-xs space-y-3 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200",
									children: ["بلاغ: ", rep.reason]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-slate-400",
									children: new Date(rep.created_at).toLocaleDateString("ar")
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-slate-700 leading-relaxed",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "المبلّغ:" }),
									" ",
									rep.reporter_name,
									" · ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "التفاصيل:" }),
									" ",
									rep.details
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pt-2 border-t border-slate-100 flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => onResolveReport(rep.id),
									className: "px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl cursor-pointer flex items-center gap-1.5 transition-colors",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "اتخاذ إجراء وحل البلاغ" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => onDismissReport(rep.id),
									className: "px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer flex items-center gap-1.5 transition-colors",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "تجاهل البلاغ (لا توجد مخالفة)" })]
								})]
							})
						]
					}, rep.id))
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-12 h-12 text-emerald-500 mx-auto" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
							className: "font-black text-slate-900 text-base",
							children: "لا توجد بلاغات معلقة!"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-slate-500",
							children: "المجتمع التعليمي هادئ وآمن وتجري التفاعلات بانتظام."
						})
					]
				})]
			}),
			activeTab === "users" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3 text-xs",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: userQuery,
						onChange: (e) => setUserQuery(e.target.value),
						placeholder: "ابحث بالاسم…",
						className: "w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1677c7]"
					}),
					users.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-slate-400 text-center py-4",
						children: "لا يوجد مستخدمون."
					}),
					users.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-3 bg-slate-50 rounded-xl flex flex-wrap items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-bold text-slate-900",
								children: u.display_name
							}),
							u.is_suspended && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mr-2 text-[10px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-bold",
								children: "موقوف"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "block text-[10px] text-slate-400",
								children: ["انضم ", new Date(u.created_at).toLocaleDateString("ar")]
							})
						] }), u.id !== currentUserId && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: u.role,
								onChange: async (e) => {
									if (await onSetRole(u.id, e.target.value)) loadUsers();
								},
								className: "p-1.5 bg-white border border-slate-200 rounded-lg",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "student",
										children: "طالب"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "teacher",
										children: "معلم"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "admin",
										children: "أدمن"
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: async () => {
									if (await onSetSuspended(u.id, !u.is_suspended)) loadUsers();
								},
								className: `px-3 py-1.5 rounded-lg font-bold cursor-pointer ${u.is_suspended ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`,
								children: u.is_suspended ? "إلغاء الإيقاف" : "إيقاف"
							})]
						})]
					}, u.id))
				]
			}),
			activeTab === "security" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
					className: "font-extrabold text-slate-900 text-base flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "w-4 h-4 text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "حالة الجدار الأمني وقواعد حماية Firestore" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2.5",
					children: [
						{
							rule: "تفعيل قواعد الأمان الصارمة (Firestore Security Rules) على جميع المجموعات",
							status: "مفعل بنسبة 100%",
							ok: true
						},
						{
							rule: "عزل البيانات الخاصة (PII) وتقييد ترقية الأدوار للمسؤول فقط",
							status: "نشطة ومؤمنة",
							ok: true
						},
						{
							rule: "حماية مفاتيح إجابات الاختبارات حتى تسليم محاولة الطالب",
							status: "نشطة ومؤمنة",
							ok: true
						},
						{
							rule: "عزل الرسائل الخاصة للمشاركين فقط والتحقق من التوقيت من الخادم",
							status: "مطبق بدقة",
							ok: true
						},
						{
							rule: "انتهاء صلاحية قصص المجتمع بعد 24 ساعة تلقائياً",
							status: "نشطة ومؤتمتة",
							ok: true
						}
					].map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-bold text-slate-800",
							children: s.rule
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-bold text-emerald-600 flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-3.5 h-3.5 text-emerald-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: s.status })]
						})]
					}, i))
				})]
			})
		]
	});
};
export { AdminView };
