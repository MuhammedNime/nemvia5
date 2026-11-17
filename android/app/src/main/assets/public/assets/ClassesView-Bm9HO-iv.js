import { r as __toESM } from "./rolldown-runtime-SbdDWaPq.js";
import { A as Share2, Ft as FileText, Lt as FileCheck2, M as Send, N as Search, U as Plus, Ut as Copy, V as QrCode, Vt as Download, Y as PenLine, Z as Paperclip, _n as BookOpen, an as Check, c as Users, cn as ChartColumn, dt as LogOut, f as Upload, fn as Building2, h as Trophy, in as ChevronDown, jt as Flame, kt as FolderOpen, mt as Link2, n as X, o as Video, pt as LoaderCircle, rn as ChevronLeft, st as Megaphone, tn as ChevronUp, v as Trash2, vn as BookMarked, wn as require_react, xn as Award, yt as Landmark, zt as ExternalLink } from "./icons-Ba0nzYf3.js";
import { t as require_browser } from "./browser-DRvmOQFv.js";
import { t as require_jsx_runtime } from "./react-vendor-Dpw1FlJl.js";
import { B as shareAppLink, I as isNativeApp, L as openExternalUrl, P as getApiBaseUrl, S as updateClassResource, a as createClassResource, s as deleteClassResource, y as subscribeClassResources } from "./index-Bhmlh-C3.js";
// src/components/views/InstitutionsView.tsx
var import_browser = /* @__PURE__ */ __toESM(require_browser(), 1);
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var inputCls = "w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#1677c7] focus:bg-white";
var InstitutionsView = ({ mode, currentUserId, currentUserName, ministries, schools, classes, quizzes, assignments, messages, myOrgIds, orgMembers, onCreateMinistry, onCreateSchool, onJoinByCode, onLinkSchoolToMinistry, onLinkClassToSchool, onCreateClassForSchool, onSendDirective, onRemoveMember, onLeaveOrg, onDeleteOrg }) => {
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const [copiedCode, setCopiedCode] = (0, import_react.useState)(null);
	const [showJoin, setShowJoin] = (0, import_react.useState)(false);
	const [joinCode, setJoinCode] = (0, import_react.useState)("");
	const [joinStatus, setJoinStatus] = (0, import_react.useState)(null);
	const [showCreateSchool, setShowCreateSchool] = (0, import_react.useState)(false);
	const [schoolName, setSchoolName] = (0, import_react.useState)("");
	const [schoolStage, setSchoolStage] = (0, import_react.useState)("ابتدائي / إعدادي / ثانوي");
	const [schoolRegion, setSchoolRegion] = (0, import_react.useState)("");
	const [schoolDesc, setSchoolDesc] = (0, import_react.useState)("");
	const [schoolMinistryId, setSchoolMinistryId] = (0, import_react.useState)("");
	const [showCreateMinistry, setShowCreateMinistry] = (0, import_react.useState)(false);
	const [minName, setMinName] = (0, import_react.useState)("");
	const [minRegion, setMinRegion] = (0, import_react.useState)("");
	const [minDesc, setMinDesc] = (0, import_react.useState)("");
	const [selectedSchoolId, setSelectedSchoolId] = (0, import_react.useState)(null);
	const [schoolTab, setSchoolTab] = (0, import_react.useState)("classes");
	const [selectedMinistryId, setSelectedMinistryId] = (0, import_react.useState)(null);
	const [ministryTab, setMinistryTab] = (0, import_react.useState)("schools");
	const [newClsTitle, setNewClsTitle] = (0, import_react.useState)("");
	const [newClsSubject, setNewClsSubject] = (0, import_react.useState)("");
	const [newClsGrade, setNewClsGrade] = (0, import_react.useState)("الصف العاشر");
	const [newClsType, setNewClsType] = (0, import_react.useState)("class");
	const [linkClassId, setLinkClassId] = (0, import_react.useState)("");
	const [linkSchoolId, setLinkSchoolId] = (0, import_react.useState)("");
	const [directiveText, setDirectiveText] = (0, import_react.useState)("");
	const [confirmDeleteId, setConfirmDeleteId] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const selectedSchool = (0, import_react.useMemo)(() => selectedSchoolId ? schools.find((s) => s.id === selectedSchoolId) || null : null, [schools, selectedSchoolId]);
	const selectedMinistry = (0, import_react.useMemo)(() => selectedMinistryId ? ministries.find((m) => m.id === selectedMinistryId) || null : null, [ministries, selectedMinistryId]);
	const copyCode = (code) => {
		navigator.clipboard?.writeText(code);
		setCopiedCode(code);
		setTimeout(() => setCopiedCode(null), 2e3);
	};
	const calcStatsForClasses = (clsList) => {
		const classIds = new Set(clsList.map((c) => c.id));
		const relQuizzes = quizzes.filter((q) => classIds.has(q.class_id));
		const relAssignments = assignments.filter((a) => classIds.has(a.class_id));
		let scoreSum = 0;
		let maxSum = 0;
		let attemptsCount = 0;
		relQuizzes.forEach((q) => {
			const maxPts = q.questions.reduce((s, qq) => s + (qq.points || 1), 0) || 1;
			(q.attempts || []).forEach((a) => {
				scoreSum += a.score;
				maxSum += maxPts;
				attemptsCount += 1;
			});
		});
		const avgPct = maxSum > 0 ? Math.round(scoreSum / maxSum * 100) : 0;
		const totalStudents = clsList.reduce((s, c) => s + (c.members_count || 0), 0);
		return {
			classesCount: clsList.length,
			quizzesCount: relQuizzes.length,
			assignmentsCount: relAssignments.length,
			attemptsCount,
			avgPct,
			totalStudents
		};
	};
	const filteredSchools = schools.filter((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.region.toLowerCase().includes(searchQuery.toLowerCase()) || s.stage.toLowerCase().includes(searchQuery.toLowerCase()));
	const filteredMinistries = ministries.filter((m) => m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.region.toLowerCase().includes(searchQuery.toLowerCase()));
	const handleJoinSubmit = async (e) => {
		e.preventDefault();
		if (!joinCode.trim() || busy) return;
		setBusy(true);
		const ok = await onJoinByCode(joinCode.trim().toUpperCase());
		setBusy(false);
		if (ok) {
			setJoinStatus({
				ok: true,
				msg: "تم الانضمام بنجاح!"
			});
			setTimeout(() => {
				setJoinStatus(null);
				setShowJoin(false);
				setJoinCode("");
			}, 1200);
		} else setJoinStatus({
			ok: false,
			msg: "الرمز غير صحيح أو غير متاح، تحقق من الرمز وأعد المحاولة."
		});
	};
	const handleCreateSchoolSubmit = async (e) => {
		e.preventDefault();
		if (!schoolName.trim() || busy) return;
		setBusy(true);
		const ok = await onCreateSchool({
			name: schoolName.trim(),
			stage: schoolStage.trim(),
			region: schoolRegion.trim() || "عام",
			description: schoolDesc.trim(),
			ministry_id: schoolMinistryId || void 0
		});
		setBusy(false);
		if (ok) {
			setShowCreateSchool(false);
			setSchoolName("");
			setSchoolRegion("");
			setSchoolDesc("");
			setSchoolMinistryId("");
		}
	};
	const handleCreateMinistrySubmit = async (e) => {
		e.preventDefault();
		if (!minName.trim() || busy) return;
		setBusy(true);
		const ok = await onCreateMinistry({
			name: minName.trim(),
			region: minRegion.trim() || "وطني / عام",
			description: minDesc.trim()
		});
		setBusy(false);
		if (ok) {
			setShowCreateMinistry(false);
			setMinName("");
			setMinRegion("");
			setMinDesc("");
		}
	};
	const handleCreateSchoolClass = (e) => {
		e.preventDefault();
		if (!selectedSchool || !newClsTitle.trim()) return;
		const code = "NEM" + Math.floor(1e3 + Math.random() * 9e3);
		onCreateClassForSchool({
			id: `cls-${Date.now()}`,
			teacher_id: currentUserId,
			teacher_name: currentUserName,
			school_id: selectedSchool.id,
			title: newClsTitle.trim(),
			subject: newClsSubject.trim() || "عام",
			grade_level: newClsGrade.trim() || "عام",
			join_code: code,
			description: `صف تابع لـ ${selectedSchool.name}`,
			class_type: newClsType,
			is_archived: false,
			members_count: 1,
			colorTheme: "from-blue-600 to-indigo-700",
			created_at: (/* @__PURE__ */ new Date()).toISOString()
		});
		setNewClsTitle("");
		setNewClsSubject("");
	};
	const handlePostDirective = async (orgId, orgName) => {
		if (!directiveText.trim() || busy) return;
		setBusy(true);
		const ok = await onSendDirective(orgId, orgName, directiveText.trim());
		setBusy(false);
		if (ok) setDirectiveText("");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-lg font-black text-slate-900 flex items-center gap-2",
					children: mode === "schools" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "w-5 h-5 text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "المدارس والمعاهد التعليمية" })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Landmark, { className: "w-5 h-5 text-[#1677c7]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "الوزارات والمجمعات التعليمية" })] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-slate-500",
					children: mode === "schools" ? "أنشئ مدرسة لطلابك ومعلميك، اربط الصفوف بها، وشارك رمز المدرسة للانضمام المباشر" : "مظلة إشرافية لمتابعة المدارس التابعة، مراقبة الأداء والاختبارات، وإصدار التعاميم"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setShowJoin(true),
						className: "px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-[#1677c7] font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: mode === "schools" ? "انضمام لمدرسة برمز" : "انضمام لإشراف برمز" })]
					}), mode === "schools" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setShowCreateSchool(true),
						className: "px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "إنشاء مدرسة / معهد" })]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setShowCreateMinistry(true),
						className: "px-4 py-2 bg-[#1677c7] hover:bg-[#125fa0] text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "إنشاء وزارة / مجمع تعليمي" })]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative max-w-md",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: searchQuery,
					onChange: (e) => setSearchQuery(e.target.value),
					placeholder: mode === "schools" ? "ابحث باسم المدرسة، المرحلة أو المنطقة..." : "ابحث باسم الوزارة أو المجمع أو المنطقة...",
					className: "w-full pr-9 pl-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-[#1677c7]"
				})]
			}),
			mode === "schools" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: filteredSchools.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white border border-dashed border-slate-300 rounded-2xl p-10 text-center space-y-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "w-8 h-8 text-slate-300 mx-auto" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-bold text-slate-700",
						children: "لا توجد مدارس أو معاهد مضافة بعد"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-slate-500",
						children: "يمكنك إنشاء مدرسة جديدة للطلاب والمعلمين، أو الانضمام إلى مدرسة قائمة باستخدام رمز الدعوة."
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-4",
				children: filteredSchools.map((s) => {
					const schoolClasses = classes.filter((c) => c.school_id === s.id);
					const parentMin = s.ministry_id ? ministries.find((m) => m.id === s.ministry_id) : void 0;
					const isMember = myOrgIds.includes(s.id) || s.owner_id === currentUserId;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white border border-slate-200 border-t-4 border-t-emerald-600 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-[#1677c7] transition-all",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2.5 min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "w-5 h-5" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
												className: "font-black text-sm text-slate-900 truncate",
												children: s.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-[11px] text-slate-500 truncate",
												children: [
													s.stage,
													" · ",
													s.region
												]
											})]
										})]
									}), isMember && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 shrink-0",
										children: s.owner_id === currentUserId ? "مدير" : "عضو"
									})]
								}),
								parentMin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[11px] font-bold text-[#1677c7] flex items-center gap-1 bg-sky-50 px-2.5 py-1 rounded-lg",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Landmark, { className: "w-3.5 h-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "truncate",
										children: ["تتبع لـ: ", parentMin.name]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-slate-600 line-clamp-2 leading-relaxed",
									children: s.description
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3 pt-3 border-t border-slate-100 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-2 text-center bg-slate-50 rounded-xl p-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-slate-500 block",
										children: "الصفوف المرتبطة"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-black text-slate-900 tabular-nums",
										children: schoolClasses.length
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-slate-500 block",
										children: "المنتسبون"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-black text-emerald-700 tabular-nums",
										children: s.members_count
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono font-black text-slate-800 tracking-wider",
										children: s.join_code
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => copyCode(s.join_code),
										className: "text-[11px] font-bold text-[#1677c7] flex items-center gap-1 cursor-pointer",
										children: [copiedCode === s.join_code ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-3.5 h-3.5 text-emerald-600" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: copiedCode === s.join_code ? "نُسخ" : "نسخ" })]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => {
										setSelectedSchoolId(s.id);
										setSchoolTab("classes");
									},
									className: "w-full py-2 bg-slate-900 hover:bg-[#1677c7] text-white font-bold rounded-xl cursor-pointer transition-colors",
									children: "دخول وإدارة المدرسة ←"
								})
							]
						})]
					}, s.id);
				})
			}) }),
			mode === "ministries" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: filteredMinistries.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white border border-dashed border-slate-300 rounded-2xl p-10 text-center space-y-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Landmark, { className: "w-8 h-8 text-slate-300 mx-auto" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-bold text-slate-700",
						children: "لا توجد وزارات أو مجمعات تعليمية مسجّلة بعد"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-slate-500",
						children: "أنشئ وزارة أو مجمّعاً تعليمياً لربط عدة مدارس تحته ومتابعة نتائجها وإصدار التعاميم."
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-4",
				children: filteredMinistries.map((m) => {
					const affSchools = schools.filter((s) => s.ministry_id === m.id);
					const affSchoolIds = new Set(affSchools.map((s) => s.id));
					const affClasses = classes.filter((c) => c.school_id && affSchoolIds.has(c.school_id));
					const stats = calcStatsForClasses(affClasses);
					const isMember = myOrgIds.includes(m.id) || m.owner_id === currentUserId;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white border border-slate-200 border-t-4 border-t-[#1677c7] rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-[#1677c7] transition-all",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2.5 min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-10 h-10 rounded-xl bg-sky-50 text-[#1677c7] flex items-center justify-center shrink-0",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Landmark, { className: "w-5 h-5" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "font-black text-sm text-slate-900 truncate",
											children: m.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-[11px] text-slate-500 truncate",
											children: ["النطاق: ", m.region]
										})]
									})]
								}), isMember && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] font-bold px-2 py-0.5 rounded-md bg-sky-50 text-[#1677c7] shrink-0",
									children: m.owner_id === currentUserId ? "مشرف عام" : "عضو"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-slate-600 line-clamp-2 leading-relaxed",
								children: m.description
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3 pt-3 border-t border-slate-100 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-3 gap-2 text-center bg-slate-50 rounded-xl p-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] text-slate-500 block",
											children: "المدارس"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-black text-slate-900 tabular-nums",
											children: affSchools.length
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] text-slate-500 block",
											children: "الصفوف"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-black text-[#1677c7] tabular-nums",
											children: stats.classesCount
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] text-slate-500 block",
											children: "المتوسط"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-black text-emerald-700 tabular-nums",
											children: [stats.avgPct, "%"]
										})] })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono font-black text-slate-800 tracking-wider",
										children: m.join_code
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => copyCode(m.join_code),
										className: "text-[11px] font-bold text-[#1677c7] flex items-center gap-1 cursor-pointer",
										children: [copiedCode === m.join_code ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-3.5 h-3.5 text-emerald-600" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: copiedCode === m.join_code ? "نُسخ" : "نسخ" })]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => {
										setSelectedMinistryId(m.id);
										setMinistryTab("schools");
									},
									className: "w-full py-2 bg-[#0f233a] hover:bg-[#1677c7] text-white font-bold rounded-xl cursor-pointer transition-colors",
									children: "لوحة المتابعة والإشراف ←"
								})
							]
						})]
					}, m.id);
				})
			}) }),
			showJoin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4",
				onClick: () => setShowJoin(false),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden",
					onClick: (e) => e.stopPropagation(),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-5 border-b border-slate-200 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-black text-sm text-slate-900",
							children: "الانضمام برمز المؤسسة"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setShowJoin(false),
							className: "text-slate-400 hover:text-slate-700 cursor-pointer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-5 h-5" })
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleJoinSubmit,
						className: "p-5 space-y-3 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-slate-600",
								children: "أدخل رمز الدعوة الخاص بالمدرسة أو الوزارة / المجمع للانضمام فوراً."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: joinCode,
								onChange: (e) => setJoinCode(e.target.value.toUpperCase()),
								placeholder: "مثال: AB12CD",
								className: "w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-center text-base font-black tracking-widest uppercase outline-none focus:border-[#1677c7]",
								required: true
							}),
							joinStatus && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `p-2.5 rounded-xl font-bold ${joinStatus.ok ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`,
								children: joinStatus.msg
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								disabled: busy,
								className: "w-full py-2.5 bg-[#1677c7] text-white font-bold rounded-xl cursor-pointer disabled:opacity-50",
								children: busy ? "جاري التحقق..." : "انضمام الآن"
							})
						]
					})]
				})
			}),
			showCreateSchool && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4",
				onClick: () => setShowCreateSchool(false),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden",
					onClick: (e) => e.stopPropagation(),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-5 border-b border-slate-200 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "font-black text-base text-slate-900 flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "w-5 h-5 text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "إنشاء مدرسة / معهد جديد" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setShowCreateSchool(false),
							className: "text-slate-400 hover:text-slate-700 cursor-pointer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-5 h-5" })
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleCreateSchoolSubmit,
						className: "p-5 space-y-3 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block font-bold text-slate-700 mb-1",
								children: "اسم المدرسة أو المعهد:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: schoolName,
								onChange: (e) => setSchoolName(e.target.value),
								placeholder: "مثال: ثانوية النخبة النموذجية",
								className: inputCls,
								required: true
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block font-bold text-slate-700 mb-1",
									children: "المرحلة الدراسية:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: schoolStage,
									onChange: (e) => setSchoolStage(e.target.value),
									placeholder: "ابتدائي / ثانوي...",
									className: inputCls
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block font-bold text-slate-700 mb-1",
									children: "المدينة / المديرية:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: schoolRegion,
									onChange: (e) => setSchoolRegion(e.target.value),
									placeholder: "الرياض، عمّان، دمشق...",
									className: inputCls
								})] })]
							}),
							ministries.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block font-bold text-slate-700 mb-1",
								children: "ربط بوزارة أو مجمع تعليمي (اختياري):"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: schoolMinistryId,
								onChange: (e) => setSchoolMinistryId(e.target.value),
								className: inputCls,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "بدون ربط حالياً (مدرسة مستقلة)"
								}), ministries.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: m.id,
									children: m.name
								}, m.id))]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block font-bold text-slate-700 mb-1",
								children: "نبذة عن المدرسة:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								value: schoolDesc,
								onChange: (e) => setSchoolDesc(e.target.value),
								rows: 2,
								placeholder: "رسالة المدرسة وتخصصاتها للطلاب والمعلمين...",
								className: inputCls
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								disabled: busy,
								className: "w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl cursor-pointer disabled:opacity-50",
								children: busy ? "جاري الإنشاء..." : "إنشاء المدرسة وتوليد رمز الدعوة"
							})
						]
					})]
				})
			}),
			showCreateMinistry && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4",
				onClick: () => setShowCreateMinistry(false),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden",
					onClick: (e) => e.stopPropagation(),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-5 border-b border-slate-200 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "font-black text-base text-slate-900 flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Landmark, { className: "w-5 h-5 text-[#1677c7]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "إنشاء وزارة / مجمع تعليمي" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setShowCreateMinistry(false),
							className: "text-slate-400 hover:text-slate-700 cursor-pointer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-5 h-5" })
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleCreateMinistrySubmit,
						className: "p-5 space-y-3 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block font-bold text-slate-700 mb-1",
								children: "اسم الوزارة أو المجمع التعليمي:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: minName,
								onChange: (e) => setMinName(e.target.value),
								placeholder: "مثال: مجمع مدارس الأمل التربوي / مديرية التربية",
								className: inputCls,
								required: true
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block font-bold text-slate-700 mb-1",
								children: "النطاق الجغرافي / المحافظة:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: minRegion,
								onChange: (e) => setMinRegion(e.target.value),
								placeholder: "مثال: المنطقة الوسطى / جميع الفروع",
								className: inputCls
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block font-bold text-slate-700 mb-1",
								children: "مهام المظلة الإشرافية:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								value: minDesc,
								onChange: (e) => setMinDesc(e.target.value),
								rows: 2,
								placeholder: "متابعة أداء المدارس، إصدار التوجيهات، ورصد مؤشرات الاختبارات...",
								className: inputCls
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								disabled: busy,
								className: "w-full py-2.5 bg-[#1677c7] hover:bg-[#125fa0] text-white font-bold rounded-xl cursor-pointer disabled:opacity-50",
								children: busy ? "جاري الإنشاء..." : "إنشاء المظلة الإشرافية وتوليد الرمز"
							})
						]
					})]
				})
			}),
			selectedSchool && (() => {
				const isOwner = selectedSchool.owner_id === currentUserId;
				const schoolClasses = classes.filter((c) => c.school_id === selectedSchool.id);
				const unlinkedOwnedClasses = classes.filter((c) => c.teacher_id === currentUserId && c.school_id !== selectedSchool.id);
				const membersList = orgMembers.filter((m) => m.class_id === selectedSchool.id && m.user_id !== selectedSchool.owner_id);
				const stats = calcStatsForClasses(schoolClasses);
				const parentMin = selectedSchool.ministry_id ? ministries.find((m) => m.id === selectedSchool.ministry_id) : void 0;
				const schoolMsgs = messages.filter((m) => m.channel_id === selectedSchool.id);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4",
					onClick: () => setSelectedSchoolId(null),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] border border-slate-200 shadow-2xl overflow-hidden flex flex-col",
						onClick: (e) => e.stopPropagation(),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-5 border-b border-slate-200 flex items-start justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md",
												children: [
													selectedSchool.stage,
													" · ",
													selectedSchool.region
												]
											}), parentMin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-[11px] font-bold text-[#1677c7] bg-sky-50 px-2.5 py-0.5 rounded-md",
												children: ["تتبع: ", parentMin.name]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "text-lg font-black text-slate-900",
											children: selectedSchool.name
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-slate-500",
											children: [
												"المدير/المنشئ: ",
												selectedSchool.owner_name,
												" · رمز المدرسة: ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
													className: "font-mono text-slate-900",
													children: selectedSchool.join_code
												})
											]
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setSelectedSchoolId(null),
									className: "p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-5 h-5" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "px-5 pt-3 border-b border-slate-200 flex flex-wrap gap-1.5 text-xs font-bold",
								children: [
									{
										id: "classes",
										label: `الصفوف والشُعَب (${schoolClasses.length})`,
										icon: BookOpen
									},
									{
										id: "members",
										label: `المعلمون والطلاب (${selectedSchool.members_count})`,
										icon: Users
									},
									{
										id: "stats",
										label: "الأداء والربط الوزاري",
										icon: ChartColumn
									},
									{
										id: "directives",
										label: `التعاميم (${schoolMsgs.length})`,
										icon: Megaphone
									}
								].map((t) => {
									const Icon = t.icon;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => setSchoolTab(t.id),
										className: `px-3 py-2 border-b-2 flex items-center gap-1.5 cursor-pointer transition-colors ${schoolTab === t.id ? "border-[#1677c7] text-[#1677c7]" : "border-transparent text-slate-500 hover:text-slate-800"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t.label })]
									}, t.id);
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-5 overflow-y-auto flex-1 space-y-4 text-xs",
								children: [
									schoolTab === "classes" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-4",
										children: [
											(isOwner || myOrgIds.includes(selectedSchool.id)) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
												onSubmit: handleCreateSchoolClass,
												className: "p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-black text-slate-900 block",
														children: "إنشاء صف دراسي جديد داخل هذه المدرسة:"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "grid sm:grid-cols-4 gap-2",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
																value: newClsTitle,
																onChange: (e) => setNewClsTitle(e.target.value),
																placeholder: "اسم الصف / الشعبة...",
																className: `${inputCls} sm:col-span-2`,
																required: true
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
																value: newClsSubject,
																onChange: (e) => setNewClsSubject(e.target.value),
																placeholder: "المادة (رياضيات...)",
																className: inputCls,
																required: true
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
																value: newClsGrade,
																onChange: (e) => setNewClsGrade(e.target.value),
																placeholder: "المرحلة (العاشر...)",
																className: inputCls
															})
														]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex flex-wrap items-center justify-between gap-2",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
															value: newClsType,
															onChange: (e) => setNewClsType(e.target.value),
															className: "p-2 bg-white border border-slate-200 rounded-xl text-xs font-bold",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																value: "class",
																children: "صف تعليمي رسمي"
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																value: "study",
																children: "مجموعة دراسة"
															})]
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
															type: "submit",
															className: "px-4 py-2 bg-[#1677c7] text-white font-bold rounded-xl cursor-pointer flex items-center gap-1",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "إضافة الصف للمدرسة" })]
														})]
													})
												]
											}),
											isOwner && unlinkedOwnedClasses.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "p-3 rounded-2xl bg-sky-50/70 border border-sky-200 flex flex-wrap items-center gap-2",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link2, { className: "w-4 h-4 text-[#1677c7] shrink-0" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
														value: linkClassId,
														onChange: (e) => setLinkClassId(e.target.value),
														className: "flex-1 min-w-[180px] p-2 bg-white border border-slate-200 rounded-xl text-xs font-bold",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
															value: "",
															children: "اختر صفاً قائماً لربطه بهذه المدرسة..."
														}), unlinkedOwnedClasses.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
															value: c.id,
															children: [
																c.title,
																" (",
																c.subject,
																")"
															]
														}, c.id))]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														disabled: !linkClassId || busy,
														onClick: async () => {
															const target = classes.find((c) => c.id === linkClassId);
															if (!target) return;
															setBusy(true);
															await onLinkClassToSchool(target, selectedSchool.id);
															setBusy(false);
															setLinkClassId("");
														},
														className: "px-3 py-2 bg-[#1677c7] disabled:opacity-50 text-white font-bold rounded-xl cursor-pointer",
														children: "ربط الصف"
													})
												]
											}),
											schoolClasses.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-center text-slate-400 py-6",
												children: "لا توجد صفوف مرتبطة بهذه المدرسة بعد."
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "grid sm:grid-cols-2 gap-3",
												children: schoolClasses.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "p-3.5 rounded-2xl border border-slate-200 bg-white space-y-1.5",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "flex items-center justify-between gap-2",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
																className: "font-black text-slate-900 text-sm truncate",
																children: c.title
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "font-mono text-[11px] font-bold text-[#1677c7] bg-sky-50 px-2 py-0.5 rounded-md",
																children: c.join_code
															})]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
															className: "text-slate-500",
															children: [
																c.subject,
																" · ",
																c.grade_level
															]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "flex items-center justify-between pt-1 text-[11px] text-slate-600",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["الأستاذ: ", c.teacher_name] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [c.members_count, " طالب"] })]
														})
													]
												}, c.id))
											})
										]
									}),
									schoolTab === "members" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-bold text-emerald-900 block",
												children: "رمز انضمام الطلاب والمعلمين للمدرسة:"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono font-black text-base text-emerald-800",
												children: selectedSchool.join_code
											})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => copyCode(selectedSchool.join_code),
												className: "px-3 py-1.5 bg-emerald-600 text-white font-bold rounded-lg cursor-pointer",
												children: "نسخ الرمز"
											})]
										}), membersList.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-center text-slate-400 py-6",
											children: isOwner ? "لم ينضم معلمون أو طلاب برمز المدرسة بعد — شارك الرمز أعلاه." : `إجمالي المنتسبين للمدرسة: ${selectedSchool.members_count}`
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "space-y-2",
											children: membersList.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-bold text-slate-800",
													children: m.name
												}), isOwner && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: () => void onRemoveMember(selectedSchool.id, m.user_id),
													className: "text-rose-600 hover:bg-rose-50 px-2.5 py-1 rounded-lg font-bold cursor-pointer",
													children: "إزالة"
												})]
											}, m.user_id))
										})]
									}),
									schoolTab === "stats" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid grid-cols-2 sm:grid-cols-4 gap-3 text-center",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "p-3 bg-slate-50 rounded-2xl border border-slate-200",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-[11px] text-slate-500 block",
														children: "الصفوف"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-lg font-black text-slate-900 tabular-nums",
														children: stats.classesCount
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "p-3 bg-slate-50 rounded-2xl border border-slate-200",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-[11px] text-slate-500 block",
														children: "الاختبارات"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-lg font-black text-[#1677c7] tabular-nums",
														children: stats.quizzesCount
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "p-3 bg-slate-50 rounded-2xl border border-slate-200",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-[11px] text-slate-500 block",
														children: "الواجبات"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-lg font-black text-amber-600 tabular-nums",
														children: stats.assignmentsCount
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "p-3 bg-slate-50 rounded-2xl border border-slate-200",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-[11px] text-slate-500 block",
														children: "متوسط الدرجات"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "text-lg font-black text-emerald-700 tabular-nums",
														children: [stats.avgPct, "%"]
													})]
												})
											]
										}), isOwner && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "font-black text-slate-900 block",
												children: "تبعية الوزارة / المجمع التعليمي:"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "flex flex-wrap gap-2",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
													value: selectedSchool.ministry_id || "",
													onChange: (e) => void onLinkSchoolToMinistry(selectedSchool, e.target.value),
													className: "flex-1 min-w-[200px] p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "",
														children: "مدرسة مستقلة (غير تابعة لوزارة محددة)"
													}), ministries.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
														value: m.id,
														children: [
															m.name,
															" (",
															m.region,
															")"
														]
													}, m.id))]
												})
											})]
										})]
									}),
									schoolTab === "directives" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-3",
										children: [(isOwner || myOrgIds.includes(selectedSchool.id)) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												value: directiveText,
												onChange: (e) => setDirectiveText(e.target.value),
												placeholder: "أصدر تعميماً أو إعلاناً لطلاب ومعلمي المدرسة...",
												className: inputCls
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												disabled: !directiveText.trim() || busy,
												onClick: () => void handlePostDirective(selectedSchool.id, selectedSchool.name),
												className: "px-4 py-2 bg-[#1677c7] disabled:opacity-50 text-white font-bold rounded-xl cursor-pointer flex items-center gap-1 shrink-0",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "نشر" })]
											})]
										}), schoolMsgs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-center text-slate-400 py-6",
											children: "لا توجد تعاميم مدرسية منشورة بعد."
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "space-y-2",
											children: schoolMsgs.slice().reverse().map((msg) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center justify-between text-[11px]",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-black text-slate-900",
														children: msg.sender_name
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-slate-400",
														children: new Date(msg.created_at).toLocaleString("ar")
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-slate-700 leading-relaxed whitespace-pre-line",
													children: msg.body
												})]
											}, msg.id))
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2 text-xs",
								children: [isOwner ? confirmDeleteId === selectedSchool.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-bold text-rose-700",
											children: "تأكيد حذف المدرسة؟"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: async () => {
												await onDeleteOrg(selectedSchool.id);
												setConfirmDeleteId(null);
												setSelectedSchoolId(null);
											},
											className: "px-3 py-1.5 bg-rose-600 text-white font-bold rounded-xl cursor-pointer",
											children: "نعم، احذف"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => setConfirmDeleteId(null),
											className: "px-3 py-1.5 bg-white border border-slate-200 font-bold rounded-xl cursor-pointer",
											children: "إلغاء"
										})
									]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setConfirmDeleteId(selectedSchool.id),
									className: "px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl flex items-center gap-1 cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "حذف المدرسة" })]
								}) : myOrgIds.includes(selectedSchool.id) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: async () => {
										await onLeaveOrg(selectedSchool.id);
										setSelectedSchoolId(null);
									},
									className: "px-3 py-2 bg-rose-50 text-rose-700 font-bold rounded-xl flex items-center gap-1 cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "مغادرة المدرسة" })]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setSelectedSchoolId(null),
									className: "px-5 py-2 bg-slate-900 text-white font-bold rounded-xl cursor-pointer",
									children: "إغلاق"
								})]
							})
						]
					})
				});
			})(),
			selectedMinistry && (() => {
				const isOwner = selectedMinistry.owner_id === currentUserId;
				const affSchools = schools.filter((s) => s.ministry_id === selectedMinistry.id);
				const affSchoolIds = new Set(affSchools.map((s) => s.id));
				const affClasses = classes.filter((c) => c.school_id && affSchoolIds.has(c.school_id));
				const totalStats = calcStatsForClasses(affClasses);
				const totalSchoolMembers = affSchools.reduce((sum, s) => sum + (s.members_count || 0), 0);
				const unlinkedOwnedSchools = schools.filter((s) => s.owner_id === currentUserId && s.ministry_id !== selectedMinistry.id);
				const minMsgs = messages.filter((m) => m.channel_id === selectedMinistry.id);
				const membersList = orgMembers.filter((m) => m.class_id === selectedMinistry.id && m.user_id !== selectedMinistry.owner_id);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4",
					onClick: () => setSelectedMinistryId(null),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] border border-slate-200 shadow-2xl overflow-hidden flex flex-col",
						onClick: (e) => e.stopPropagation(),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-5 border-b border-slate-200 flex items-start justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-[11px] font-bold text-[#1677c7] bg-sky-50 px-2.5 py-0.5 rounded-md inline-block",
											children: ["الإشراف التنفيذي · ", selectedMinistry.region]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "text-lg font-black text-slate-900",
											children: selectedMinistry.name
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-slate-500",
											children: [
												"المسؤول: ",
												selectedMinistry.owner_name,
												" · رمز الإشراف: ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
													className: "font-mono text-slate-900",
													children: selectedMinistry.join_code
												})
											]
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setSelectedMinistryId(null),
									className: "p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-5 h-5" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "px-5 py-3 bg-slate-50 border-b border-slate-200 grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-2.5 bg-white rounded-xl border border-slate-200",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] text-slate-500 block",
											children: "المدارس التابعة"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-base font-black text-slate-900 tabular-nums",
											children: affSchools.length
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-2.5 bg-white rounded-xl border border-slate-200",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] text-slate-500 block",
											children: "إجمالي الصفوف"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-base font-black text-[#1677c7] tabular-nums",
											children: totalStats.classesCount
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-2.5 bg-white rounded-xl border border-slate-200",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] text-slate-500 block",
											children: "الطلاب والمعلمون"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-base font-black text-emerald-700 tabular-nums",
											children: totalSchoolMembers
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-2.5 bg-white rounded-xl border border-slate-200",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] text-slate-500 block",
											children: "الاختبارات المنشورة"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-base font-black text-indigo-700 tabular-nums",
											children: totalStats.quizzesCount
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-2.5 bg-white rounded-xl border border-slate-200",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] text-slate-500 block",
											children: "متوسط التحصيل"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-base font-black text-amber-600 tabular-nums",
											children: [totalStats.avgPct, "%"]
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "px-5 pt-2 border-b border-slate-200 flex flex-wrap gap-1.5 text-xs font-bold",
								children: [
									{
										id: "schools",
										label: `المدارس التابعة (${affSchools.length})`,
										icon: Building2
									},
									{
										id: "directives",
										label: `التعاميم والتوجيهات (${minMsgs.length})`,
										icon: Megaphone
									},
									{
										id: "members",
										label: `فريق الإشراف (${selectedMinistry.members_count})`,
										icon: Users
									}
								].map((t) => {
									const Icon = t.icon;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => setMinistryTab(t.id),
										className: `px-3 py-2 border-b-2 flex items-center gap-1.5 cursor-pointer ${ministryTab === t.id ? "border-[#1677c7] text-[#1677c7]" : "border-transparent text-slate-500 hover:text-slate-800"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t.label })]
									}, t.id);
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-5 overflow-y-auto flex-1 space-y-4 text-xs",
								children: [
									ministryTab === "schools" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap items-center justify-between gap-2",
											children: [unlinkedOwnedSchools.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2 flex-1 min-w-[240px]",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
													value: linkSchoolId,
													onChange: (e) => setLinkSchoolId(e.target.value),
													className: "flex-1 p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "",
														children: "إلحاق مدرسة من مدارسك بهذا المجمع..."
													}), unlinkedOwnedSchools.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
														value: s.id,
														children: [
															s.name,
															" (",
															s.region,
															")"
														]
													}, s.id))]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													disabled: !linkSchoolId || busy,
													onClick: async () => {
														const sc = schools.find((s) => s.id === linkSchoolId);
														if (!sc) return;
														setBusy(true);
														await onLinkSchoolToMinistry(sc, selectedMinistry.id);
														setBusy(false);
														setLinkSchoolId("");
													},
													className: "px-3 py-2 bg-[#1677c7] disabled:opacity-50 text-white font-bold rounded-xl cursor-pointer",
													children: "إلحاق"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: () => {
													setSchoolMinistryId(selectedMinistry.id);
													setShowCreateSchool(true);
												},
												className: "px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center gap-1 cursor-pointer",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "إنشاء مدرسة تابعة للوزارة" })]
											})]
										}), affSchools.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-center text-slate-400 py-8",
											children: "لا توجد مدارس مرتبطة بهذه الوزارة/المجمع بعد."
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "grid sm:grid-cols-2 gap-3",
											children: affSchools.map((s) => {
												const sCls = classes.filter((c) => c.school_id === s.id);
												const st = calcStatsForClasses(sCls);
												return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-2.5",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "flex items-start justify-between gap-2",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
																className: "font-black text-sm text-slate-900",
																children: s.name
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
																className: "text-[11px] text-slate-500",
																children: [
																	s.stage,
																	" · ",
																	s.region,
																	" · مديرها: ",
																	s.owner_name
																]
															})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "font-mono text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md",
																children: s.join_code
															})]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "grid grid-cols-4 gap-2 text-center bg-white rounded-xl p-2 border border-slate-200",
															children: [
																/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "text-[10px] text-slate-400 block",
																	children: "صفوف"
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
																	className: "tabular-nums",
																	children: st.classesCount
																})] }),
																/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "text-[10px] text-slate-400 block",
																	children: "أعضاء"
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
																	className: "tabular-nums",
																	children: s.members_count
																})] }),
																/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "text-[10px] text-slate-400 block",
																	children: "اختبارات"
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
																	className: "tabular-nums",
																	children: st.quizzesCount
																})] }),
																/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "text-[10px] text-slate-400 block",
																	children: "المتوسط"
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
																	className: "text-emerald-700 tabular-nums",
																	children: [st.avgPct, "%"]
																})] })
															]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
															type: "button",
															onClick: () => {
																setSelectedMinistryId(null);
																setSelectedSchoolId(s.id);
																setSchoolTab("classes");
															},
															className: "w-full py-1.5 bg-white hover:bg-[#1677c7] hover:text-white border border-slate-200 text-slate-800 font-bold rounded-xl cursor-pointer flex items-center justify-center gap-1 transition-colors",
															children: [
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "w-3.5 h-3.5" }),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "معاينة تفاصيل وصفوف المدرسة" }),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "w-3.5 h-3.5" })
															]
														})
													]
												}, s.id);
											})
										})]
									}),
									ministryTab === "directives" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-3",
										children: [(isOwner || myOrgIds.includes(selectedMinistry.id)) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												value: directiveText,
												onChange: (e) => setDirectiveText(e.target.value),
												placeholder: "اكتب تعميماً أو توجيهاً إشرافياً للمدارس والمشرفين...",
												className: inputCls
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												disabled: !directiveText.trim() || busy,
												onClick: () => void handlePostDirective(selectedMinistry.id, selectedMinistry.name),
												className: "px-4 py-2 bg-[#1677c7] disabled:opacity-50 text-white font-bold rounded-xl cursor-pointer flex items-center gap-1 shrink-0",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "تعميم" })]
											})]
										}), minMsgs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-center text-slate-400 py-6",
											children: "لا توجد تعاميم وزارية صادرة بعد."
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "space-y-2",
											children: minMsgs.slice().reverse().map((msg) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "p-3 rounded-2xl bg-sky-50/50 border border-sky-200 space-y-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center justify-between text-[11px]",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-black text-[#0f233a]",
														children: msg.sender_name
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-slate-400",
														children: new Date(msg.created_at).toLocaleString("ar")
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-slate-700 leading-relaxed whitespace-pre-line",
													children: msg.body
												})]
											}, msg.id))
										})]
									}),
									ministryTab === "members" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "p-3 bg-sky-50 border border-sky-200 rounded-xl flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-bold text-slate-900 block",
												children: "رمز انضمام المشرفين ومديري المدارس:"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono font-black text-base text-[#0f233a]",
												children: selectedMinistry.join_code
											})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => copyCode(selectedMinistry.join_code),
												className: "px-3 py-1.5 bg-[#1677c7] text-white font-bold rounded-lg cursor-pointer",
												children: "نسخ الرمز"
											})]
										}), membersList.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-center text-slate-400 py-6",
											children: isOwner ? "لم ينضم مشرفون بعد — شارك الرمز أعلاه." : `إجمالي أعضاء فريق الإشراف: ${selectedMinistry.members_count}`
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "space-y-2",
											children: membersList.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-bold text-slate-800",
													children: m.name
												}), isOwner && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: () => void onRemoveMember(selectedMinistry.id, m.user_id),
													className: "text-rose-600 hover:bg-rose-50 px-2.5 py-1 rounded-lg font-bold cursor-pointer",
													children: "إزالة"
												})]
											}, m.user_id))
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2 text-xs",
								children: [isOwner ? confirmDeleteId === selectedMinistry.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-bold text-rose-700",
											children: "تأكيد حذف الوزارة/المجمع؟"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: async () => {
												await onDeleteOrg(selectedMinistry.id);
												setConfirmDeleteId(null);
												setSelectedMinistryId(null);
											},
											className: "px-3 py-1.5 bg-rose-600 text-white font-bold rounded-xl cursor-pointer",
											children: "نعم، احذف"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => setConfirmDeleteId(null),
											className: "px-3 py-1.5 bg-white border border-slate-200 font-bold rounded-xl cursor-pointer",
											children: "إلغاء"
										})
									]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setConfirmDeleteId(selectedMinistry.id),
									className: "px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl flex items-center gap-1 cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "حذف المجمع/الوزارة" })]
								}) : myOrgIds.includes(selectedMinistry.id) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: async () => {
										await onLeaveOrg(selectedMinistry.id);
										setSelectedMinistryId(null);
									},
									className: "px-3 py-2 bg-rose-50 text-rose-700 font-bold rounded-xl flex items-center gap-1 cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "مغادرة الإشراف" })]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setSelectedMinistryId(null),
									className: "px-5 py-2 bg-slate-900 text-white font-bold rounded-xl cursor-pointer",
									children: "إغلاق"
								})]
							})
						]
					})
				});
			})()
		]
	});
};
// src/components/views/ClassLibraryTab.tsx
var KIND_META = {
	book: {
		label: "كتاب دراسي",
		badgeCls: "bg-amber-50 text-amber-800 border-amber-200",
		icon: BookMarked
	},
	summary: {
		label: "ملخص / ملزمة",
		badgeCls: "bg-sky-50 text-[#1677c7] border-sky-200",
		icon: FileText
	},
	worksheet: {
		label: "ورقة عمل",
		badgeCls: "bg-emerald-50 text-emerald-700 border-emerald-200",
		icon: FileCheck2
	},
	link: {
		label: "رابط تعليمي",
		badgeCls: "bg-indigo-50 text-indigo-700 border-indigo-200",
		icon: Link2
	},
	video: {
		label: "فيديو شرح",
		badgeCls: "bg-rose-50 text-rose-700 border-rose-200",
		icon: Video
	}
};
var QUICK_UNITS = [
	"الوحدة الأولى",
	"الوحدة الثانية",
	"الوحدة الثالثة",
	"مراجعة نهائية",
	"موارد عامة"
];
var ClassLibraryTab = ({ cls, currentUserId, currentUserName, currentRole, isClassMember, onUpload }) => {
	const [resources, setResources] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const [unitFilter, setUnitFilter] = (0, import_react.useState)("all");
	const [kindFilter, setKindFilter] = (0, import_react.useState)("all");
	const [collapsedUnits, setCollapsedUnits] = (0, import_react.useState)({});
	const [showForm, setShowForm] = (0, import_react.useState)(false);
	const [editingId, setEditingId] = (0, import_react.useState)(null);
	const [title, setTitle] = (0, import_react.useState)("");
	const [unitName, setUnitName] = (0, import_react.useState)("الوحدة الأولى");
	const [kind, setKind] = (0, import_react.useState)("summary");
	const [description, setDescription] = (0, import_react.useState)("");
	const [externalUrl, setExternalUrl] = (0, import_react.useState)("");
	const [uploadedFile, setUploadedFile] = (0, import_react.useState)(null);
	const [uploading, setUploading] = (0, import_react.useState)(false);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [formError, setFormError] = (0, import_react.useState)(null);
	const [confirmDeleteId, setConfirmDeleteId] = (0, import_react.useState)(null);
	const [copiedId, setCopiedId] = (0, import_react.useState)(null);
	const canContribute = cls.teacher_id === currentUserId || currentRole === "admin" || isClassMember;
	(0, import_react.useEffect)(() => {
		setLoading(true);
		const unsub = subscribeClassResources(cls.id, (items) => {
			setResources(items);
			setLoading(false);
		});
		return () => unsub();
	}, [cls.id]);
	const units = (0, import_react.useMemo)(() => {
		return Array.from(new Set(resources.map((r) => r.unit_name).filter(Boolean))).sort((a, b) => a.localeCompare(b, "ar"));
	}, [resources]);
	const filtered = (0, import_react.useMemo)(() => {
		const q = searchQuery.trim().toLowerCase();
		return resources.filter((item) => {
			if (unitFilter !== "all" && item.unit_name !== unitFilter) return false;
			if (kindFilter !== "all" && item.kind !== kindFilter) return false;
			if (!q) return true;
			return item.title.toLowerCase().includes(q) || item.unit_name.toLowerCase().includes(q) || (item.description || "").toLowerCase().includes(q) || (item.file_name || "").toLowerCase().includes(q);
		});
	}, [
		resources,
		searchQuery,
		unitFilter,
		kindFilter
	]);
	const groupedByUnit = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		filtered.forEach((item) => {
			const key = item.unit_name || "موارد عامة";
			const bucket = map.get(key) || [];
			bucket.push(item);
			map.set(key, bucket);
		});
		return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0], "ar"));
	}, [filtered]);
	const resetForm = (presetUnit = "الوحدة الأولى") => {
		setEditingId(null);
		setTitle("");
		setUnitName(presetUnit);
		setKind("summary");
		setDescription("");
		setExternalUrl("");
		setUploadedFile(null);
		setFormError(null);
	};
	const openAddForm = (presetUnit = "الوحدة الأولى") => {
		resetForm(presetUnit);
		setShowForm(true);
	};
	const openEditForm = (item) => {
		setEditingId(item.id);
		setTitle(item.title);
		setUnitName(item.unit_name);
		setKind(item.kind);
		setDescription(item.description || "");
		setExternalUrl(item.external_url || "");
		setUploadedFile(null);
		setFormError(null);
		setShowForm(true);
	};
	const handleFileChange = async (e) => {
		const file = e.target.files?.[0];
		e.target.value = "";
		if (!file || !onUpload) return;
		setFormError(null);
		setUploading(true);
		try {
			const res = await onUpload(file, "class_library");
			setUploadedFile(res);
			if (!title.trim()) setTitle(file.name.replace(/\.[^.]+$/, ""));
		} catch (err) {
			setFormError(err?.message || "تعذّر رفع الملف.");
		} finally {
			setUploading(false);
		}
	};
	const handleSave = async (e) => {
		e.preventDefault();
		setFormError(null);
		if (!title.trim()) {
			setFormError("يرجى كتابة عنوان الملف أو الملزمة.");
			return;
		}
		const cleanUrl = externalUrl.trim();
		if (cleanUrl && !/^https?:\/\//i.test(cleanUrl)) {
			setFormError("يجب أن يبدأ الرابط الخارجي بـ https:// أو http://");
			return;
		}
		if (!editingId && !uploadedFile && !cleanUrl && !description.trim()) {
			setFormError("أرفق ملفاً أو أضف رابطاً تعليمياً أو وصفاً للمورد.");
			return;
		}
		setSaving(true);
		try {
			if (editingId) await updateClassResource(editingId, {
				title,
				unitName,
				kind,
				description,
				externalUrl: cleanUrl
			});
			else await createClassResource({
				classId: cls.id,
				uploaderId: currentUserId,
				uploaderName: currentUserName,
				title,
				unitName,
				kind,
				description,
				fileUrl: uploadedFile?.url,
				fileName: uploadedFile?.name,
				fileSize: uploadedFile?.size,
				externalUrl: cleanUrl || void 0
			});
			setShowForm(false);
			resetForm();
		} catch (err) {
			setFormError(err?.message || "تعذّر حفظ المورد في المكتبة.");
		} finally {
			setSaving(false);
		}
	};
	const handleDelete = async (id) => {
		try {
			await deleteClassResource(id);
			setConfirmDeleteId(null);
		} catch {}
	};
	const handleCopyUrl = (id, url) => {
		navigator.clipboard?.writeText(url).catch(() => {});
		setCopiedId(id);
		window.setTimeout(() => setCopiedId((prev) => prev === id ? null : prev), 2e3);
	};
	const toggleUnit = (u) => {
		setCollapsedUnits((prev) => ({
			...prev,
			[u]: !prev[u]
		}));
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
					className: "font-black text-slate-900 text-sm flex items-center gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderOpen, { className: "w-4 h-4 text-[#1677c7]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "مكتبة الملفات والملازم المنظمة" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] text-slate-500",
					children: "كتب، ملخصات، أوراق عمل وروابط تعليمية مرتبة حسب وحدات المادة"
				})] }), canContribute && !showForm && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => openAddForm(unitFilter !== "all" ? unitFilter : "الوحدة الأولى"),
					className: "px-3.5 py-2 bg-[#1677c7] hover:bg-[#125fa0] text-white font-bold rounded-xl text-xs inline-flex items-center gap-1.5 cursor-pointer shadow-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "إضافة ملف / ملزمة" })]
				})]
			}),
			!canContribute && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-bold",
				children: "انضم إلى الصف برمز الدعوة لتتمكن من إضافة الملازم والملفات مع زملائك."
			}),
			showForm && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSave,
				className: "p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 animate-in fade-in",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-black text-slate-900 text-xs",
							children: editingId ? "تعديل المورد التعليمي" : "إضافة مورد جديد لمكتبة الصف"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								setShowForm(false);
								resetForm();
							},
							className: "p-1 text-slate-400 hover:text-slate-700 cursor-pointer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid sm:grid-cols-2 gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block font-bold text-slate-700 mb-1 text-[11px]",
							children: "العنوان:"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							value: title,
							onChange: (e) => setTitle(e.target.value),
							placeholder: "مثال: ملزمة الفصل الأول — القوانين الأساسية",
							maxLength: 200,
							className: "w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#1677c7] text-xs",
							required: true
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block font-bold text-slate-700 mb-1 text-[11px]",
							children: "التصنيف:"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: kind,
							onChange: (e) => setKind(e.target.value),
							className: "w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#1677c7] text-xs font-bold",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "summary",
									children: "ملخص / ملزمة"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "book",
									children: "كتاب دراسي / مرجع"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "worksheet",
									children: "ورقة عمل / تمارين"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "link",
									children: "رابط تعليمي مفيد"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "video",
									children: "فيديو شرح"
								})
							]
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block font-bold text-slate-700 mb-1 text-[11px]",
							children: "الوحدة / الباب:"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							value: unitName,
							onChange: (e) => setUnitName(e.target.value),
							placeholder: "مثال: الوحدة الأولى",
							maxLength: 100,
							className: "w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#1677c7] text-xs",
							required: true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-1 mt-1.5",
							children: Array.from(/* @__PURE__ */ new Set([...units, ...QUICK_UNITS])).slice(0, 6).map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setUnitName(u),
								className: `px-2 py-0.5 rounded-lg text-[10px] font-bold border cursor-pointer transition-colors ${unitName === u ? "bg-[#1677c7] text-white border-[#1677c7]" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"}`,
								children: u
							}, u))
						})
					] }),
					!editingId && onUpload && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block font-bold text-slate-700 mb-1 text-[11px]",
						children: "رفع ملف (PDF، Word، صور، عروض تقديمية — حتى 10MB):"
					}), uploadedFile ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between gap-2 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 min-w-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paperclip, { className: "w-4 h-4 text-emerald-700 shrink-0" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold text-emerald-900 truncate",
									children: uploadedFile.name
								}),
								uploadedFile.size && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[10px] text-emerald-700 shrink-0",
									children: [
										"(",
										uploadedFile.size,
										")"
									]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setUploadedFile(null),
							className: "text-rose-600 font-bold text-[11px] cursor-pointer shrink-0",
							children: "إزالة"
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "w-full p-3 bg-white border border-dashed border-slate-300 hover:border-[#1677c7] rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-slate-600 cursor-pointer transition-colors",
						children: [uploading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-4 h-4 animate-spin text-[#1677c7]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "جاري رفع الملف..." })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "w-4 h-4 text-[#1677c7]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "اختر ملفاً من جهازك لرفعه" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "file",
							accept: ".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.png,.jpg,.jpeg,.webp",
							onChange: handleFileChange,
							disabled: uploading,
							className: "hidden"
						})]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block font-bold text-slate-700 mb-1 text-[11px]",
						children: "رابط تعليمي خارجي (اختياري):"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "url",
						dir: "ltr",
						value: externalUrl,
						onChange: (e) => setExternalUrl(e.target.value),
						placeholder: "https://...",
						maxLength: 2e3,
						className: "w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#1677c7] text-xs text-left"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block font-bold text-slate-700 mb-1 text-[11px]",
						children: "ملاحظات أو وصف مختصر (اختياري):"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						value: description,
						onChange: (e) => setDescription(e.target.value),
						placeholder: "محتوى الملزمة، الصفحات المطلوبة، أو تعليمات المذاكرة...",
						maxLength: 2e3,
						className: "w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#1677c7] text-xs min-h-[60px]"
					})] }),
					formError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-bold text-[11px]",
						children: formError
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "submit",
							disabled: saving || uploading,
							className: "flex-1 py-2.5 bg-[#1677c7] hover:bg-[#125fa0] disabled:opacity-60 text-white font-bold rounded-xl text-xs cursor-pointer inline-flex items-center justify-center gap-1.5",
							children: [saving && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: editingId ? "حفظ التعديلات" : "نشر في مكتبة الصف" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								setShowForm(false);
								resetForm();
							},
							className: "px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer",
							children: "إلغاء"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col sm:flex-row gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							value: searchQuery,
							onChange: (e) => setSearchQuery(e.target.value),
							placeholder: "ابحث داخل المكتبة بالعنوان أو الوحدة...",
							className: "w-full pr-8 pl-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1677c7] text-xs"
						})]
					}), units.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: unitFilter,
						onChange: (e) => setUnitFilter(e.target.value),
						className: "px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1677c7] text-xs font-bold text-slate-700",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
							value: "all",
							children: [
								"كل الوحدات (",
								resources.length,
								")"
							]
						}), units.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
							value: u,
							children: [
								u,
								" (",
								resources.filter((r) => r.unit_name === u).length,
								")"
							]
						}, u))]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setKindFilter("all"),
						className: `px-2.5 py-1 rounded-lg text-[11px] font-bold border cursor-pointer transition-colors ${kindFilter === "all" ? "bg-[#0f233a] text-white border-[#0f233a]" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`,
						children: [
							"الكل (",
							resources.length,
							")"
						]
					}), Object.keys(KIND_META).map((k) => {
						const meta = KIND_META[k];
						const count = resources.filter((r) => r.kind === k).length;
						const Icon = meta.icon;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setKindFilter(k),
							className: `px-2.5 py-1 rounded-lg text-[11px] font-bold border cursor-pointer inline-flex items-center gap-1 transition-colors ${kindFilter === k ? "bg-[#1677c7] text-white border-[#1677c7]" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "w-3 h-3" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: meta.label }),
								count > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "opacity-75",
									children: [
										"(",
										count,
										")"
									]
								})
							]
						}, k);
					})]
				})]
			}),
			loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "py-10 flex items-center justify-center text-slate-400 gap-2 text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-5 h-5 animate-spin text-[#1677c7]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "جاري تحميل مكتبة الصف..." })]
			}) : groupedByUnit.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-8 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center space-y-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderOpen, { className: "w-9 h-9 text-slate-300 mx-auto" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-bold text-slate-700 text-xs",
						children: resources.length === 0 ? "لا توجد ملفات أو ملازم مضافة في هذا الصف بعد." : "لا توجد نتائج مطابقة لبحثك."
					}),
					canContribute && resources.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => openAddForm(),
						className: "px-3.5 py-1.5 bg-[#1677c7] text-white font-bold rounded-xl text-[11px] cursor-pointer inline-flex items-center gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "أضف أول كتاب أو ملزمة" })]
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-3",
				children: groupedByUnit.map(([unit, items]) => {
					const isCollapsed = Boolean(collapsedUnits[unit]);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-slate-200 overflow-hidden bg-white",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "px-3.5 py-2.5 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => toggleUnit(unit),
								className: "flex items-center gap-2 font-black text-slate-900 text-xs cursor-pointer text-right flex-1 min-w-0",
								children: [
									isCollapsed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "w-4 h-4 text-slate-500 shrink-0" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "w-4 h-4 text-slate-500 shrink-0" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate",
										children: unit
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-[10px] font-bold text-[#1677c7] shrink-0",
										children: items.length
									})
								]
							}), canContribute && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => openAddForm(unit),
								className: "px-2 py-1 rounded-lg bg-white hover:bg-sky-50 border border-slate-200 text-[#1677c7] font-bold text-[10px] inline-flex items-center gap-1 cursor-pointer shrink-0",
								title: "إضافة مورد إلى هذه الوحدة",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-3 h-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "إضافة" })]
							})]
						}), !isCollapsed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "divide-y divide-slate-100",
							children: items.map((item) => {
								const meta = KIND_META[item.kind];
								const Icon = meta.icon;
								const canEditOrDelete = item.uploader_id === currentUserId || cls.teacher_id === currentUserId || currentRole === "admin";
								const primaryLink = item.file_url || item.external_url || "";
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3.5 space-y-2 hover:bg-slate-50/60 transition-colors",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start justify-between gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1 min-w-0 flex-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-1.5 flex-wrap",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: `px-2 py-0.5 rounded-lg border text-[10px] font-bold inline-flex items-center gap-1 ${meta.badgeCls}`,
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "w-3 h-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: meta.label })]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "text-[10px] text-slate-400",
														children: [
															"بواسطة ",
															item.uploader_name,
															" ·",
															" ",
															new Date(item.created_at).toLocaleDateString("ar-EG")
														]
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
													className: "font-black text-slate-900 text-xs leading-snug",
													children: item.title
												}),
												item.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-[11px] text-slate-600 leading-relaxed whitespace-pre-line",
													children: item.description
												}),
												item.file_name && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "inline-flex items-center gap-1 text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-lg",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paperclip, { className: "w-3 h-3 text-[#1677c7]" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "truncate max-w-[200px]",
															children: item.file_name
														}),
														item.file_size && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "text-slate-400",
															children: [
																"(",
																item.file_size,
																")"
															]
														})
													]
												})
											]
										}), canEditOrDelete && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1 shrink-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => openEditForm(item),
												className: "p-1.5 rounded-lg text-slate-500 hover:text-[#1677c7] hover:bg-sky-50 cursor-pointer",
												title: "تعديل",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, { className: "w-3.5 h-3.5" })
											}), confirmDeleteId === item.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: () => void handleDelete(item.id),
													className: "px-2 py-1 rounded-lg bg-rose-600 text-white font-bold text-[10px] cursor-pointer",
													children: "حذف"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: () => setConfirmDeleteId(null),
													className: "px-1.5 py-1 rounded-lg bg-slate-100 text-slate-600 font-bold text-[10px] cursor-pointer",
													children: "تراجع"
												})]
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => setConfirmDeleteId(item.id),
												className: "p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer",
												title: "حذف",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3.5 h-3.5" })
											})]
										})]
									}), (item.file_url || item.external_url) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-center gap-1.5 pt-1",
										children: [
											item.file_url && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: () => void openExternalUrl(item.file_url),
												className: "px-3 py-1.5 rounded-xl bg-[#1677c7] hover:bg-[#125fa0] text-white font-bold text-[11px] inline-flex items-center gap-1 cursor-pointer",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "فتح / تنزيل الملف" })]
											}),
											item.external_url && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: () => void openExternalUrl(item.external_url),
												className: "px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold text-[11px] inline-flex items-center gap-1 cursor-pointer",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link2, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "زيارة الرابط" })]
											}),
											primaryLink && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: () => handleCopyUrl(item.id, primaryLink),
												className: "px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] inline-flex items-center gap-1 cursor-pointer",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "w-3 h-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: copiedId === item.id ? "تم النسخ ✓" : "نسخ الرابط" })]
											})
										]
									})]
								}, item.id);
							})
						})]
					}, unit);
				})
			})
		]
	});
};
// src/components/views/ClassesView.tsx
var ClassesView = ({ currentRole, currentUserId, currentUserName, classes, schools = [], ministries = [], quizzes = [], assignments = [], messages = [], myOrgIds = [], myClassIds = [], orgMembers = [], initialTab = "classes", onAddClass, onJoinClass, members, onLeaveClass, onDeleteClass, onArchiveClass, onRemoveMember, contacts = [], currentUserPoints = 0, currentUserStreak = 0, onUpload, onCreateMinistry = async () => false, onCreateSchool = async () => false, onLinkSchoolToMinistry = async () => false, onLinkClassToSchool = async () => false, onSendDirective = async () => false, onRemoveOrgMember = async () => false, onLeaveOrg = async () => false, onDeleteOrg = async () => false }) => {
	const [spaceTab, setSpaceTab] = (0, import_react.useState)(initialTab);
	(0, import_react.useEffect)(() => {
		setSpaceTab(initialTab);
	}, [initialTab]);
	const [filterType, setFilterType] = (0, import_react.useState)("all");
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const [newSchoolId, setNewSchoolId] = (0, import_react.useState)("");
	const [showCreateModal, setShowCreateModal] = (0, import_react.useState)(false);
	const [newTitle, setNewTitle] = (0, import_react.useState)("");
	const [newSubject, setNewSubject] = (0, import_react.useState)("");
	const [newGrade, setNewGrade] = (0, import_react.useState)("الصف التاسع");
	const [newType, setNewType] = (0, import_react.useState)("study");
	const [newDescription, setNewDescription] = (0, import_react.useState)("");
	const [newTheme, setNewTheme] = (0, import_react.useState)("from-blue-600 to-indigo-700");
	const [showJoinModal, setShowJoinModal] = (0, import_react.useState)(false);
	const [joinCode, setJoinCode] = (0, import_react.useState)("");
	const [joinResult, setJoinResult] = (0, import_react.useState)(null);
	const [copiedCode, setCopiedCode] = (0, import_react.useState)(null);
	const [selectedClass, setSelectedClass] = (0, import_react.useState)(null);
	const [detailTab, setDetailTab] = (0, import_react.useState)("overview");
	const openClassDetail = (cls, tab = "overview") => {
		setDetailTab(tab);
		setSelectedClass(cls);
	};
	const [qrModal, setQrModal] = (0, import_react.useState)(null);
	const filteredClasses = classes.filter((c) => {
		const matchesFilter = filterType === "all" || c.class_type === filterType;
		const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.subject.toLowerCase().includes(searchQuery.toLowerCase());
		return matchesFilter && matchesSearch;
	});
	const handleCopyCode = (code) => {
		navigator.clipboard.writeText(code);
		setCopiedCode(code);
		setTimeout(() => setCopiedCode(null), 2500);
	};
	const resolvePublicAppUrl = () => {
		const origin = typeof window !== "undefined" ? window.location.origin : "";
		return !isNativeApp() && origin.startsWith("http") ? origin : getApiBaseUrl() || origin || "https://nemvia-app.onrender.com";
	};
	const handleShareInvite = (cls) => {
		const joinUrl = `${resolvePublicAppUrl()}/?join=${encodeURIComponent(cls.join_code)}`;
		shareAppLink(`دعوة للانضمام إلى ${cls.title} — NEMVIA`, `انضم إلى "${cls.title}" (${cls.subject}) على منصة NEMVIA باستخدام الرمز: ${cls.join_code}`, joinUrl);
	};
	const handleOpenQrModal = async (cls) => {
		const joinUrl = `${resolvePublicAppUrl()}/?join=${encodeURIComponent(cls.join_code)}`;
		try {
			const dataUrl = await import_browser.toDataURL(joinUrl, {
				width: 300,
				margin: 2,
				color: {
					dark: "#0f233a",
					light: "#ffffff"
				}
			});
			setQrModal({
				cls,
				dataUrl,
				joinUrl
			});
		} catch {}
	};
	const handleCreateSubmit = (e) => {
		e.preventDefault();
		if (!newTitle.trim()) return;
		const randomCode = "NEM" + Math.floor(1e3 + Math.random() * 9e3);
		onAddClass({
			id: `cls-${Date.now()}`,
			teacher_id: currentUserId,
			teacher_name: currentUserName,
			school_id: newSchoolId || void 0,
			title: newTitle.trim(),
			subject: newSubject.trim() || "عام",
			grade_level: newGrade,
			join_code: randomCode,
			description: newDescription.trim() || "مساحة دراسية تفاعلية مخصصة للنقاش وحل الواجبات والمذاكرة الجماعية.",
			class_type: newType,
			is_archived: false,
			members_count: 1,
			colorTheme: newTheme,
			created_at: (/* @__PURE__ */ new Date()).toISOString()
		});
		setShowCreateModal(false);
		setNewTitle("");
		setNewSubject("");
		setNewDescription("");
		setNewSchoolId("");
	};
	const handleJoinSubmit = async (e) => {
		e.preventDefault();
		if (!joinCode.trim()) return;
		if (await onJoinClass(joinCode.trim().toUpperCase())) {
			setJoinResult({
				success: true,
				msg: "تم الانضمام للصف بنجاح!"
			});
			setTimeout(() => {
				setJoinResult(null);
				setShowJoinModal(false);
				setJoinCode("");
			}, 1500);
		} else setJoinResult({
			success: false,
			msg: "رمز الانضمام غير صحيح، يرجى التأكد منه."
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5 animate-in fade-in",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-white p-2 rounded-2xl border border-slate-200 flex flex-wrap items-center gap-1.5 text-xs font-bold",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setSpaceTab("classes"),
					className: `flex-1 sm:flex-initial px-4 py-2 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${spaceTab === "classes" ? "bg-[#1677c7] text-white" : "text-slate-600 hover:bg-slate-100"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						"الصفوف والمجموعات (",
						classes.length,
						")"
					] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setSpaceTab("schools"),
					className: `flex-1 sm:flex-initial px-4 py-2 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${spaceTab === "schools" ? "bg-emerald-600 text-white" : "text-slate-600 hover:bg-slate-100"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						"المدارس والمعاهد (",
						schools.length,
						")"
					] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setSpaceTab("ministries"),
					className: `flex-1 sm:flex-initial px-4 py-2 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${spaceTab === "ministries" ? "bg-[#0f233a] text-white" : "text-slate-600 hover:bg-slate-100"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Landmark, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						"الوزارات والمجمعات (",
						ministries.length,
						")"
					] })]
				})
			]
		}), spaceTab !== "classes" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InstitutionsView, {
			mode: spaceTab,
			currentRole,
			currentUserId,
			currentUserName,
			ministries,
			schools,
			classes,
			quizzes,
			assignments,
			messages,
			myOrgIds,
			orgMembers,
			onCreateMinistry,
			onCreateSchool,
			onJoinByCode: onJoinClass,
			onLinkSchoolToMinistry,
			onLinkClassToSchool,
			onCreateClassForSchool: onAddClass,
			onSendDirective,
			onRemoveMember: onRemoveOrgMember,
			onLeaveOrg,
			onDeleteOrg
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-xl font-black text-slate-900",
					children: "الصفوف ومجموعات الدراسة الأكاديمية"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-slate-500",
					children: "انضم لمساحات التعلم المنظمة، شارك في مجموعات الدراسة التعاونية، وتابع واجباتك"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setShowJoinModal(true),
						className: "px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-[#1677c7] font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "الانضمام برمز الدعوة" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setShowCreateModal(true),
						className: "px-4 py-2 bg-[#1677c7] hover:bg-[#125fa0] text-white font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "إنشاء صف / مجموعة جديدة" })]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-full sm:w-auto",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setFilterType("all"),
							className: `flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${filterType === "all" ? "bg-white text-[#1677c7] shadow-xs" : "text-slate-600"}`,
							children: [
								"الكل (",
								classes.length,
								")"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setFilterType("class"),
							className: `flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${filterType === "class" ? "bg-white text-[#1677c7] shadow-xs" : "text-slate-600"}`,
							children: "صفوف تعليمية رسمية"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setFilterType("study"),
							className: `flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${filterType === "study" ? "bg-white text-emerald-700 shadow-xs" : "text-slate-600"}`,
							children: "مجموعات دراسة تعاونية"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative w-full sm:w-64",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						value: searchQuery,
						onChange: (e) => setSearchQuery(e.target.value),
						placeholder: "ابحث عن صف أو مادة...",
						className: "w-full pr-8 pl-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1677c7] text-xs"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-4",
				children: filteredClasses.map((cls) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:border-[#1677c7] transition-all flex flex-col justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `p-5 bg-gradient-to-r ${cls.colorTheme} text-white space-y-2`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] font-black uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full backdrop-blur-xs",
									children: cls.class_type === "study" ? "مجموعة دراسة طلابية" : "صف تعليمي رسمي"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] text-white/80 font-mono",
									children: cls.grade_level
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-extrabold text-base leading-snug line-clamp-1",
								children: cls.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs text-white/80 block",
								children: ["المادة: ", cls.subject]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-5 space-y-4 flex-1 flex flex-col justify-between text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-slate-600 leading-relaxed line-clamp-2",
							children: cls.description
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3 pt-2 border-t border-slate-100",
							children: [
								cls.school_id && (() => {
									const sc = schools.find((s) => s.id === cls.school_id);
									if (!sc) return null;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex items-center justify-between text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg font-bold",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-1 truncate",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "w-3.5 h-3.5 shrink-0" }),
												" ",
												sc.name
											]
										})
									});
								})(),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between text-slate-500",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "الأستاذ/المشرف:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-slate-800",
										children: cls.teacher_name
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between text-slate-500",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "الطلاب المسجلون:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-bold text-[#1677c7]",
										children: [cls.members_count, " طالباً"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 flex items-center justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-slate-400 block",
										children: "رمز الانضمام:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono font-black text-slate-900 text-sm tracking-wider",
										children: cls.join_code
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1 flex-wrap justify-end",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: () => void handleOpenQrModal(cls),
												className: "px-2 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-[#0f233a] font-bold rounded-lg text-[11px] flex items-center gap-1 cursor-pointer transition-colors",
												title: "عرض رمز الاستجابة السريعة QR للانضمام الفوري",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrCode, { className: "w-3.5 h-3.5 text-[#1677c7]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "QR" })]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: () => handleShareInvite(cls),
												className: "px-2 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold rounded-lg text-[11px] flex items-center gap-1 cursor-pointer transition-colors",
												title: "مشاركة دعوة الصف",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "w-3 h-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "مشاركة" })]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => handleCopyCode(cls.join_code),
												className: "px-2 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-[#1677c7] font-bold rounded-lg text-[11px] flex items-center gap-1 cursor-pointer transition-colors",
												children: copiedCode === cls.join_code ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-3 h-3 text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-emerald-700",
													children: "تم"
												})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "w-3 h-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "نسخ" })] })
											})
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => openClassDetail(cls, "overview"),
										className: "py-2 bg-slate-100 hover:bg-[#1677c7] hover:text-white text-slate-700 font-bold rounded-xl transition-all cursor-pointer text-center",
										children: "تفاصيل الصف"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => openClassDetail(cls, "library"),
										className: "py-2 bg-sky-50 hover:bg-[#1677c7] hover:text-white text-[#1677c7] border border-sky-200 font-bold rounded-xl transition-all cursor-pointer inline-flex items-center justify-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderOpen, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "مكتبة الملفات" })]
									})]
								})
							]
						})]
					})]
				}, cls.id))
			}),
			showCreateModal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-[#0f233a] text-white p-5 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-5 h-5 text-sky-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-bold text-base",
								children: "إنشاء صف أو مجموعة دراسة جديدة"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setShowCreateModal(false),
							className: "text-white/70 hover:text-white cursor-pointer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-5 h-5" })
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleCreateSubmit,
						className: "p-6 space-y-3.5 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block font-bold text-slate-700 mb-1",
								children: "اسم الصف أو المجموعة:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: newTitle,
								onChange: (e) => setNewTitle(e.target.value),
								placeholder: "مثال: مراجعة الفيزياء للشهادة الثانوية",
								className: "w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1677c7]",
								required: true
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block font-bold text-slate-700 mb-1",
									children: "نوع المساحة:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: newType,
									onChange: (e) => setNewType(e.target.value),
									className: "w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "study",
										children: "مجموعة دراسة تعاونية"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "class",
										children: "صف تعليمي رسمي"
									})]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block font-bold text-slate-700 mb-1",
									children: "المادة الدراسية:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: newSubject,
									onChange: (e) => setNewSubject(e.target.value),
									placeholder: "الرياضيات، برمجة، لغات...",
									className: "w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none",
									required: true
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block font-bold text-slate-700 mb-1",
								children: "المرحلة / الصف:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: newGrade,
								onChange: (e) => setNewGrade(e.target.value),
								placeholder: "الصف التاسع، العاشر، جامعي...",
								className: "w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
							})] }),
							schools.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block font-bold text-slate-700 mb-1",
								children: "ربط بمدرسة / معهد (اختياري):"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: newSchoolId,
								onChange: (e) => setNewSchoolId(e.target.value),
								className: "w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "صف مستقل (غير مربوط بمدرسة)"
								}), schools.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
									value: s.id,
									children: [
										s.name,
										" (",
										s.stage,
										")"
									]
								}, s.id))]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block font-bold text-slate-700 mb-1",
								children: "الوصف وأهداف المساحة:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								value: newDescription,
								onChange: (e) => setNewDescription(e.target.value),
								placeholder: "اكتب أهداف المجموعة، مواعيد المذاكرة، أو تعليمات الطلاب...",
								className: "w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none min-h-[70px]"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pt-2 flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "submit",
									className: "flex-1 py-2.5 bg-[#1677c7] text-white font-bold rounded-xl cursor-pointer",
									children: "إنشاء المساحة وتوليد رمز الانضمام"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setShowCreateModal(false),
									className: "px-4 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl cursor-pointer",
									children: "إلغاء"
								})]
							})
						]
					})]
				})
			}),
			showJoinModal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-[#1677c7] text-white p-5 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "font-bold text-base flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "w-5 h-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "الانضمام برمز الصف (Join Code)" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setShowJoinModal(false),
							className: "text-white/70 hover:text-white cursor-pointer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-5 h-5" })
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleJoinSubmit,
						className: "p-6 space-y-4 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-slate-600 leading-relaxed",
								children: "أدخل رمز الدعوة المكون من 6 إلى 8 أحرف المخصص للصف الدراسي."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: joinCode,
								onChange: (e) => setJoinCode(e.target.value.toUpperCase()),
								placeholder: "مثال: MATH9X أو CODE2026",
								className: "w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-center text-lg font-black tracking-widest uppercase outline-none focus:border-[#1677c7]",
								required: true
							}) }),
							joinResult && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `p-3 rounded-xl border text-xs font-bold ${joinResult.success ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-rose-50 text-rose-800 border-rose-200"}`,
								children: joinResult.msg
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "submit",
									className: "flex-1 py-2.5 bg-[#1677c7] text-white font-bold rounded-xl cursor-pointer",
									children: "انضمام الآن"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setShowJoinModal(false),
									className: "px-4 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl cursor-pointer",
									children: "إلغاء"
								})]
							})
						]
					})]
				})
			}),
			selectedClass && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 max-h-[85vh] flex flex-col",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `p-6 bg-gradient-to-r ${selectedClass.colorTheme} text-white space-y-2 relative`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setSelectedClass(null),
									className: "absolute top-4 left-4 p-1 rounded-full bg-black/20 text-white hover:bg-black/40 cursor-pointer",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-5 h-5" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[11px] font-bold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full inline-block",
									children: [
										selectedClass.grade_level,
										" · ",
										selectedClass.subject
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-xl font-black",
									children: selectedClass.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-white/90 leading-relaxed",
									children: selectedClass.description
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "px-6 pt-3 pb-2 border-b border-slate-200 bg-slate-50/70 flex items-center gap-2 text-xs font-bold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setDetailTab("overview"),
								className: `flex-1 py-2 px-3 rounded-xl cursor-pointer transition-colors inline-flex items-center justify-center gap-1.5 ${detailTab === "overview" ? "bg-[#0f233a] text-white shadow-xs" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "نظرة عامة والأعضاء" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setDetailTab("library"),
								className: `flex-1 py-2 px-3 rounded-xl cursor-pointer transition-colors inline-flex items-center justify-center gap-1.5 ${detailTab === "library" ? "bg-[#1677c7] text-white shadow-xs" : "bg-white text-slate-700 border border-slate-200 hover:bg-sky-50"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderOpen, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "مكتبة الملفات والملازم" })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "p-6 space-y-4 overflow-y-auto flex-1 text-xs",
							children: detailTab === "library" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClassLibraryTab, {
								cls: selectedClass,
								currentUserId,
								currentUserName,
								currentRole,
								isClassMember: myClassIds.includes(selectedClass.id) || members.some((m) => m.class_id === selectedClass.id && m.user_id === currentUserId),
								onUpload
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-3 text-slate-700",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-3 bg-slate-50 rounded-xl border border-slate-200",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] text-slate-400 block font-bold",
											children: "المعلم / المشرف"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-bold text-sm text-slate-900",
											children: selectedClass.teacher_name
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-3 bg-slate-50 rounded-xl border border-slate-200",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] text-slate-400 block font-bold",
											children: "عدد الطلاب المسجلين"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-bold text-sm text-[#1677c7]",
											children: [selectedClass.members_count, " طالباً"]
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3 bg-sky-50 rounded-xl border border-sky-200 flex items-center justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] font-bold text-slate-700 block",
										children: "رمز مشاركة الصف:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono font-black text-base text-[#0f233a]",
										children: selectedClass.join_code
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5 flex-wrap",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: () => void handleOpenQrModal(selectedClass),
												className: "px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-[#0f233a] font-bold rounded-lg cursor-pointer text-xs inline-flex items-center gap-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrCode, { className: "w-3.5 h-3.5 text-[#1677c7]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "رمز QR" })]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: () => handleShareInvite(selectedClass),
												className: "px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold rounded-lg cursor-pointer text-xs inline-flex items-center gap-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "مشاركة الدعوة" })]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => handleCopyCode(selectedClass.join_code),
												className: "px-3 py-1.5 bg-[#1677c7] text-white font-bold rounded-lg cursor-pointer text-xs",
												children: copiedCode === selectedClass.join_code ? "تم النسخ ✓" : "نسخ الرمز"
											})
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-slate-800 block",
										children: "معلومات الصف:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "p-2 bg-slate-50 rounded-lg flex items-center justify-between text-slate-700",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "المنشئ / المعلم" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-bold",
													children: selectedClass.teacher_name
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "p-2 bg-slate-50 rounded-lg flex items-center justify-between text-slate-700",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "عدد الأعضاء" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-bold",
													children: selectedClass.members_count
												})]
											}),
											selectedClass.is_archived && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "p-2 bg-amber-50 text-amber-800 rounded-lg font-bold",
												children: "هذا الصف مؤرشف"
											})
										]
									})]
								}),
								(() => {
									const contactMap = new Map(contacts.map((c) => [c.id, c]));
									const classRows = members.filter((m) => m.class_id === selectedClass.id);
									const seen = /* @__PURE__ */ new Set();
									const entries = classRows.filter((m) => {
										if (seen.has(m.user_id)) return false;
										seen.add(m.user_id);
										return true;
									}).map((m) => {
										const isMe = m.user_id === currentUserId;
										const c = contactMap.get(m.user_id);
										const points = isMe ? currentUserPoints : c?.points ?? 0;
										const streak = isMe ? currentUserStreak : c?.streakDays ?? 0;
										return {
											user_id: m.user_id,
											name: m.name || c?.name || "عضو الصف",
											avatar_url: c?.avatar_url,
											isTeacher: m.user_id === selectedClass.teacher_id,
											isMe,
											points,
											streak
										};
									});
									if (!entries.some((e) => e.user_id === selectedClass.teacher_id)) {
										const tc = contactMap.get(selectedClass.teacher_id);
										const isMeTeacher = selectedClass.teacher_id === currentUserId;
										entries.push({
											user_id: selectedClass.teacher_id,
											name: selectedClass.teacher_name,
											avatar_url: tc?.avatar_url,
											isTeacher: true,
											isMe: isMeTeacher,
											points: isMeTeacher ? currentUserPoints : tc?.points ?? 0,
											streak: isMeTeacher ? currentUserStreak : tc?.streakDays ?? 0
										});
									}
									const studentBoard = entries.filter((e) => !e.isTeacher || entries.length === 1).sort((a, b) => b.points - a.points || b.streak - a.streak);
									if (studentBoard.length === 0) return null;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-3.5 rounded-2xl bg-gradient-to-br from-amber-50/70 to-sky-50/70 border border-amber-200/80 space-y-2.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-black text-slate-900 flex items-center gap-1.5 text-xs",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "w-4 h-4 text-amber-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "لوحة شرف الصف والإنجازات الأسبوعية" })]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-[10px] font-bold text-slate-500",
												children: [studentBoard.length, " مشارك"]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "space-y-1.5 max-h-60 overflow-y-auto pr-0.5",
											children: studentBoard.slice(0, 12).map((row, idx) => {
												const rankBadge = idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `${idx + 1}`;
												const achievementLabel = row.points >= 500 ? "نجم الصف" : row.streak >= 5 ? "مواظب" : row.points >= 150 ? "متقدم" : "";
												return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: `p-2 rounded-xl border flex items-center justify-between gap-2 ${row.isMe ? "bg-white border-[#1677c7] shadow-xs" : idx < 3 ? "bg-white/90 border-amber-200" : "bg-white/70 border-slate-200/80"}`,
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center gap-2 min-w-0",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "w-6 text-center font-black text-xs shrink-0",
																children: rankBadge
															}),
															row.avatar_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
																src: row.avatar_url,
																alt: row.name,
																className: "w-7 h-7 rounded-full object-cover shrink-0 border border-slate-200"
															}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																className: "w-7 h-7 rounded-full bg-sky-100 text-[#0f233a] font-black text-[11px] flex items-center justify-center shrink-0",
																children: row.name.charAt(0)
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "min-w-0",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
																	className: "font-bold text-slate-900 truncate text-[11px]",
																	children: [
																		row.name,
																		" ",
																		row.isMe && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																			className: "text-[#1677c7]",
																			children: "(أنت)"
																		})
																	]
																}), achievementLabel && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																	className: "inline-flex items-center gap-0.5 text-[10px] font-bold text-amber-700",
																	children: [
																		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "w-2.5 h-2.5" }),
																		" ",
																		achievementLabel
																	]
																})]
															})
														]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center gap-2 shrink-0 text-[11px] font-black",
														children: [row.streak > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "inline-flex items-center gap-0.5 text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded-lg",
															title: "أيام المواظبة",
															children: [
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "w-3 h-3" }),
																" ",
																row.streak
															]
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "text-[#1677c7] bg-sky-50 px-2 py-0.5 rounded-lg tabular-nums",
															children: [row.points, " XP"]
														})]
													})]
												}, row.user_id);
											})
										})]
									});
								})(),
								selectedClass.teacher_id === currentUserId && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-bold text-slate-800 block",
											children: "الأعضاء:"
										}),
										members.filter((m) => m.class_id === selectedClass.id && m.user_id !== currentUserId).length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-slate-400",
											children: "لم ينضم أحد بعد. شارك الرمز أعلاه."
										}),
										members.filter((m) => m.class_id === selectedClass.id && m.user_id !== currentUserId).map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "p-2 bg-slate-50 rounded-lg flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-bold text-slate-700",
												children: m.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => onRemoveMember(selectedClass.id, m.user_id),
												className: "text-rose-600 hover:bg-rose-50 px-2 py-1 rounded-lg font-bold cursor-pointer",
												children: "إزالة"
											})]
										}, m.user_id)),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex gap-2 pt-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => {
													onArchiveClass(selectedClass.id, !selectedClass.is_archived);
													setSelectedClass(null);
												},
												className: "flex-1 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold rounded-xl cursor-pointer",
												children: selectedClass.is_archived ? "إلغاء الأرشفة" : "أرشفة الصف"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => {
													onDeleteClass(selectedClass.id);
													setSelectedClass(null);
												},
												className: "flex-1 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl cursor-pointer",
												children: "حذف الصف"
											})]
										})
									]
								}),
								selectedClass.teacher_id !== currentUserId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => {
										onLeaveClass(selectedClass.id);
										setSelectedClass(null);
									},
									className: "w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl cursor-pointer",
									children: "مغادرة الصف"
								})
							] })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "p-4 bg-slate-50 border-t border-slate-200 text-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setSelectedClass(null),
								className: "w-full py-2 bg-[#0f233a] text-white font-bold rounded-xl text-xs cursor-pointer",
								children: "إغلاق"
							})
						})
					]
				})
			}),
			qrModal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-[60] bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4",
				onClick: () => setQrModal(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white rounded-3xl max-w-sm w-full border border-slate-200 shadow-2xl p-6 space-y-4 text-center animate-in zoom-in-95",
					onClick: (e) => e.stopPropagation(),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-right",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] font-bold text-[#1677c7] block",
									children: "انضمام سريع عبر الكاميرا"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-black text-slate-900 text-sm line-clamp-1",
									children: qrModal.cls.title
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setQrModal(null),
								className: "p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-5 h-5" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: qrModal.dataUrl,
									alt: `QR ${qrModal.cls.join_code}`,
									className: "w-52 h-52 rounded-xl bg-white p-2 border border-slate-100"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono font-black text-base text-[#0f233a] tracking-widest",
									children: qrModal.cls.join_code
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-slate-500",
									children: "امسح الرمز بكاميرا الهاتف لينضم الطالب إلى الصف مباشرة"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: qrModal.dataUrl,
								download: `NEMVIA-QR-${qrModal.cls.join_code}.png`,
								className: "flex-1 py-2.5 bg-[#1677c7] hover:bg-[#125fa0] text-white font-bold rounded-xl inline-flex items-center justify-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "تنزيل الصورة" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => {
									navigator.clipboard.writeText(qrModal.joinUrl);
									setCopiedCode(qrModal.cls.join_code);
									setTimeout(() => setCopiedCode(null), 2e3);
								},
								className: "flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl cursor-pointer inline-flex items-center justify-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: copiedCode === qrModal.cls.join_code ? "تم النسخ ✓" : "نسخ الرابط" })]
							})]
						})
					]
				})
			})
		] })]
	});
};
export { ClassesView };
