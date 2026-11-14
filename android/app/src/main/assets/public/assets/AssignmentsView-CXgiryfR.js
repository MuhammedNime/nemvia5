import { r as __toESM } from "./rolldown-runtime-SbdDWaPq.js";
import { Ct as Clock, D as Send, Kt as Award, Nt as Check, Q as LoaderCircle, Yt as require_react, f as TriangleAlert, gt as FileText, ht as FileUp, kt as CircleCheck, n as X, vt as ExternalLink, y as Sparkles, yt as Download } from "./icons-y6mUmdUg.js";
import { c as reviewAssignmentAI } from "./ai-DYfzclpk.js";
import { t as require_jsx_runtime } from "./react-vendor-CpCOhAWp.js";
// src/components/views/AssignmentsView.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var AssignmentsView = ({ currentRole, currentUserId, currentUserName, assignments, submissions, onSubmitAssignment, onGradeSubmission, classes, onCreateAssignment, onUpload, onDeleteAssignment }) => {
	const [showCreate, setShowCreate] = (0, import_react.useState)(false);
	const [uploading, setUploading] = (0, import_react.useState)(false);
	const [nClass, setNClass] = (0, import_react.useState)("");
	const [nTitle, setNTitle] = (0, import_react.useState)("");
	const [nInstr, setNInstr] = (0, import_react.useState)("");
	const [nDue, setNDue] = (0, import_react.useState)("");
	const [nPoints, setNPoints] = (0, import_react.useState)(20);
	const myClasses = classes.filter((c) => c.teacher_id === currentUserId);
	const canCreate = (currentRole === "teacher" || currentRole === "admin") && myClasses.length > 0;
	const submitCreate = async (e) => {
		e.preventDefault();
		if (await onCreateAssignment({
			class_id: nClass || myClasses[0].id,
			title: nTitle.trim(),
			instructions: nInstr.trim(),
			due_at: nDue ? new Date(nDue).toISOString() : new Date(Date.now() + 6048e5).toISOString(),
			total_points: Math.max(1, nPoints)
		})) {
			setShowCreate(false);
			setNTitle("");
			setNInstr("");
			setNDue("");
		}
	};
	const [activeAssignmentId, setActiveAssignmentId] = (0, import_react.useState)(assignments[0]?.id || null);
	const [solutionText, setSolutionText] = (0, import_react.useState)("");
	const [attachedFile, setAttachedFile] = (0, import_react.useState)(null);
	const [submitSuccess, setSubmitSuccess] = (0, import_react.useState)(false);
	const fileInputRef = (0, import_react.useRef)(null);
	const [gradeEdits, setGradeEdits] = (0, import_react.useState)({});
	const [gradedSuccess, setGradedSuccess] = (0, import_react.useState)(false);
	const [aiReviews, setAiReviews] = (0, import_react.useState)({});
	const [aiReviewingId, setAiReviewingId] = (0, import_react.useState)(null);
	const [aiReviewError, setAiReviewError] = (0, import_react.useState)({});
	const selectedAssignment = assignments.find((a) => a.id === activeAssignmentId) || assignments[0];
	const userSubmission = submissions.find((s) => s.assignment_id === selectedAssignment?.id && s.student_id === currentUserId);
	const classSubmissions = submissions.filter((s) => s.assignment_id === selectedAssignment?.id);
	const handleFileChange = async (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setUploading(true);
		try {
			const up = await onUpload(file, "submissions");
			setAttachedFile({
				name: up.name,
				size: up.size,
				type: file.type,
				url: up.url
			});
		} catch {}
		setUploading(false);
	};
	const handleSubmitSolution = (e) => {
		e.preventDefault();
		if (!solutionText.trim() || !selectedAssignment) return;
		onSubmitAssignment({
			id: `sub-${Date.now()}`,
			assignment_id: selectedAssignment.id,
			student_id: currentUserId,
			student_name: currentUserName,
			answer_text: solutionText.trim(),
			attachment_url: attachedFile ? attachedFile.url : void 0,
			submitted_at: (/* @__PURE__ */ new Date()).toISOString()
		});
		setSubmitSuccess(true);
		setTimeout(() => setSubmitSuccess(false), 3e3);
	};
	const getSubEdit = (sub) => {
		const cur = gradeEdits[sub.id];
		const maxPts = selectedAssignment?.total_points ?? 20;
		return {
			score: cur?.score ?? String(sub.grade ?? maxPts),
			feedback: cur?.feedback ?? (sub.teacher_feedback || "")
		};
	};
	const handleTeacherGrade = (sub) => {
		const edit = getSubEdit(sub);
		const maxPts = selectedAssignment?.total_points ?? 100;
		const numeric = Math.max(0, Math.min(maxPts, parseFloat(edit.score) || 0));
		onGradeSubmission(sub.id, numeric, edit.feedback.trim() || "عمل ممتاز ومتقن!");
		setGradedSuccess(true);
		setTimeout(() => setGradedSuccess(false), 2500);
	};
	const handleAiReviewSubmission = async (sub) => {
		if (!selectedAssignment || aiReviewingId === sub.id) return;
		setAiReviewingId(sub.id);
		setAiReviewError((prev) => {
			const next = { ...prev };
			delete next[sub.id];
			return next;
		});
		try {
			const result = await reviewAssignmentAI({
				assignmentTitle: selectedAssignment.title,
				instructions: selectedAssignment.instructions,
				totalPoints: selectedAssignment.total_points,
				studentAnswer: sub.answer_text,
				attachmentUrl: sub.attachment_url
			});
			setAiReviews((prev) => ({
				...prev,
				[sub.id]: result
			}));
			setGradeEdits((prev) => ({
				...prev,
				[sub.id]: {
					score: String(result.suggestedGrade),
					feedback: result.feedback
				}
			}));
		} catch (err) {
			setAiReviewError((prev) => ({
				...prev,
				[sub.id]: err?.message || "تعذّر مراجعة الواجب بالذكاء الاصطناعي."
			}));
		} finally {
			setAiReviewingId(null);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 animate-in fade-in",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-xl font-black text-slate-900",
					children: "الواجبات الدراسية والتسليمات"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-slate-500",
					children: "حل المهام الأسبوعية، إرفاق ملفات حقيقية، واستلام التقييمات والدرجات"
				})] }), canCreate && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setShowCreate(true),
					className: "px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs cursor-pointer",
					children: "+ إنشاء واجب"
				})]
			}),
			showCreate && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: submitCreate,
					className: "bg-white rounded-3xl w-full max-w-lg p-6 space-y-3 shadow-2xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-black text-slate-900",
								children: "واجب جديد"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setShowCreate(false),
								className: "p-1 text-slate-400 cursor-pointer",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: nClass || myClasses[0]?.id,
							onChange: (e) => setNClass(e.target.value),
							className: "w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs",
							children: myClasses.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: c.id,
								children: c.title
							}, c.id))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: nTitle,
							onChange: (e) => setNTitle(e.target.value),
							placeholder: "عنوان الواجب",
							required: true,
							maxLength: 150,
							className: "w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: nInstr,
							onChange: (e) => setNInstr(e.target.value),
							placeholder: "التعليمات",
							rows: 4,
							className: "w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "date",
								value: nDue,
								onChange: (e) => setNDue(e.target.value),
								className: "p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs",
								title: "موعد التسليم"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								min: 1,
								max: 1e3,
								value: nPoints,
								onChange: (e) => setNPoints(Number(e.target.value)),
								className: "p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs",
								title: "الدرجة الكاملة"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							className: "w-full py-3 bg-[#1677c7] text-white font-black rounded-xl text-sm cursor-pointer",
							children: "نشر الواجب"
						})
					]
				})
			}),
			assignments.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white rounded-2xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500",
				children: [
					"لا توجد واجبات بعد. انضم إلى صف باستخدام رمز الانضمام",
					canCreate ? "، أو أنشئ واجباً جديداً" : " لتظهر واجباتك هنا",
					"."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 lg:grid-cols-12 gap-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg:col-span-5 space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-bold text-slate-600 block",
						children: "قائمة الواجبات المطلوبة:"
					}), assignments.map((asg) => {
						const isSelected = selectedAssignment?.id === asg.id;
						const hasSubmitted = submissions.some((s) => s.assignment_id === asg.id && s.student_id === currentUserId);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							onClick: () => setActiveAssignmentId(asg.id),
							className: `p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${isSelected ? "bg-sky-50/80 border-[#1677c7] shadow-sm" : "bg-white border-slate-200 hover:border-slate-300"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700",
										children: asg.class_title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-slate-400 font-mono flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-3 h-3" }), new Date(asg.due_at).toLocaleDateString("ar")]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "font-bold text-slate-900 text-sm",
									children: asg.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between text-xs pt-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-slate-500",
										children: [
											"الدرجة: ",
											asg.total_points,
											" علامة"
										]
									}), hasSubmitted ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-emerald-700 font-bold flex items-center gap-1 text-[11px]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-3.5 h-3.5 text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "تم التسليم" })]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-amber-600 font-bold text-[11px]",
										children: "بانتظار الحل"
									})]
								})
							]
						}, asg.id);
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5",
					children: selectedAssignment ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2 pb-4 border-b border-slate-100",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-bold text-[#1677c7] bg-sky-50 px-2.5 py-0.5 rounded-full",
										children: selectedAssignment.class_title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs text-slate-400 flex items-center gap-3",
										children: [
											"المعلم: ",
											selectedAssignment.teacher_name,
											(selectedAssignment.teacher_id === currentUserId || currentRole === "admin") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => {
													onDeleteAssignment(selectedAssignment.id);
													setActiveAssignmentId(null);
												},
												className: "text-rose-600 font-bold cursor-pointer",
												children: "حذف الواجب"
											})
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-lg font-black text-slate-900",
									children: selectedAssignment.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-700 leading-relaxed space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-slate-900 block",
										children: "تعليمات الواجب:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: selectedAssignment.instructions })]
								})
							]
						}),
						currentRole === "student" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-4",
							children: userSubmission ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-xs font-bold text-emerald-800 flex items-center gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-4 h-4 text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "تم تسليم هذا الواجب بنجاح!" })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[11px] text-slate-400",
											children: new Date(userSubmission.submitted_at).toLocaleDateString("ar")
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "bg-white p-3 rounded-xl border border-emerald-100 text-xs text-slate-800 space-y-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-bold text-slate-500 block mb-1",
												children: "إجابتك المسلمة:"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "whitespace-pre-line leading-relaxed",
												children: userSubmission.answer_text
											}),
											userSubmission.attachment_url && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "pt-2 border-t border-slate-100 flex items-center justify-between",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-[11px] text-slate-600 flex items-center gap-1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "w-3.5 h-3.5 text-[#1677c7]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "الملف المرفق بالحل" })]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
													href: userSubmission.attachment_url,
													target: "_blank",
													rel: "noreferrer",
													download: "حل_الواجب",
													className: "text-xs text-[#1677c7] font-bold hover:underline flex items-center gap-1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "تحميل / معاينة الملف" })]
												})]
											})
										]
									}),
									userSubmission.grade !== void 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs space-y-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-black text-amber-950 flex items-center gap-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "w-4 h-4 text-amber-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "تقييم المعلم والدرجة:" })]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-base font-black text-amber-900",
												children: [
													userSubmission.grade,
													" / ",
													selectedAssignment.total_points
												]
											})]
										}), userSubmission.teacher_feedback && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-amber-900 leading-relaxed pt-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "ملاحظات الأستاذ:" }),
												" ",
												userSubmission.teacher_feedback
											]
										})]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-slate-500 text-center font-medium",
										children: "قيد المراجعة والتصحيح من قبل أستاذ المادة ⏳"
									})
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								onSubmit: handleSubmitSolution,
								className: "space-y-3 text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
										className: "font-bold text-slate-800",
										children: "تسليم الحل الخاص بك:"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
										value: solutionText,
										onChange: (e) => setSolutionText(e.target.value),
										placeholder: "اكتب خطوات الحل أو كود البرنامج أو الشرح هنا بالتفصيل...",
										className: "w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1677c7] min-h-[120px] text-xs leading-relaxed",
										required: true
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "file",
											ref: fileInputRef,
											onChange: handleFileChange,
											accept: "image/*,.pdf,.doc,.docx,.txt",
											className: "hidden"
										}), attachedFile ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "p-3 bg-sky-50 rounded-xl border border-sky-200 flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "w-8 h-8 rounded-lg bg-[#1677c7] text-white flex items-center justify-center font-bold",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "w-4 h-4" })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-bold text-slate-900 block truncate max-w-[200px] sm:max-w-xs",
													children: attachedFile.name
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[10px] text-slate-500",
													children: attachedFile.size
												})] })]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
													href: attachedFile.url,
													target: "_blank",
													rel: "noreferrer",
													className: "p-1 text-[#1677c7] hover:bg-sky-100 rounded-md",
													title: "معاينة الملف",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "w-4 h-4" })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: () => setAttachedFile(null),
													className: "p-1 text-rose-500 hover:bg-rose-50 rounded-md cursor-pointer",
													title: "حذف المرفق",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
												})]
											})]
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => fileInputRef.current?.click(),
											className: "w-full py-3 border-2 border-dashed border-slate-300 hover:border-[#1677c7] rounded-xl text-slate-600 hover:text-[#1677c7] font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer bg-slate-50/50",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileUp, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "إرفاق ملف الحل من جهازك (PDF، صورة، Word)" })]
										})]
									}),
									submitSuccess && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-2.5 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 flex items-center gap-2 font-bold",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-4 h-4 text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "تم إرسال حلك للمعلم بنجاح!" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "submit",
										className: "w-full py-2.5 bg-[#1677c7] hover:bg-[#125fa0] text-white font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "تسليم الواجب النهائي للمراجعة" })]
									})
								]
							})
						}),
						(currentRole === "teacher" || currentRole === "admin") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
										className: "font-bold text-slate-800 text-sm",
										children: [
											"مكتب تصحيح حلول الطلاب (",
											classSubmissions.length,
											")"
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs text-slate-500",
										children: ["الدرجة الكلية: ", selectedAssignment.total_points]
									})]
								}),
								classSubmissions.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "space-y-3",
									children: classSubmissions.map((sub) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between text-xs",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-bold text-slate-900",
													children: sub.student_name
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-slate-400",
													children: ["تاريخ التسليم: ", new Date(sub.submitted_at).toLocaleDateString("ar")]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 whitespace-pre-wrap leading-relaxed space-y-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: sub.answer_text }), sub.attachment_url && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "pt-2 border-t border-slate-100 flex items-center justify-between",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "text-[11px] text-slate-500 flex items-center gap-1",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "w-3.5 h-3.5 text-[#1677c7]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "مرفق الطالب" })]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
														href: sub.attachment_url,
														target: "_blank",
														rel: "noreferrer",
														className: "text-xs text-[#1677c7] font-bold hover:underline flex items-center gap-1",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "فتح الملف المرفق" })]
													})]
												})]
											}),
											(() => {
												const edit = getSubEdit(sub);
												const aiRev = aiReviews[sub.id];
												const isReviewing = aiReviewingId === sub.id;
												const revErr = aiReviewError[sub.id];
												return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex flex-wrap items-center justify-between gap-2 pt-1",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
															type: "button",
															disabled: isReviewing,
															onClick: () => handleAiReviewSubmission(sub),
															className: "px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-[#1677c7] border border-sky-200 font-bold rounded-xl text-[11px] flex items-center gap-1.5 cursor-pointer disabled:opacity-50",
															children: [isReviewing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isReviewing ? "جاري تحليل الإجابة والملف..." : sub.attachment_url ? "تقييم الحل والملف المرفق بالذكاء (AI)" : "تقييم وصياغة ملاحظات بالذكاء (AI)" })]
														}), sub.grade !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "text-[11px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full",
															children: [
																"الدرجة المرصودة: ",
																sub.grade,
																" / ",
																selectedAssignment.total_points
															]
														})]
													}),
													revErr && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-bold flex items-center gap-1.5",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "w-3.5 h-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: revErr })]
													}),
													aiRev && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "p-3 rounded-xl bg-white border border-sky-200 space-y-2 text-[11px]",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "flex items-center justify-between font-black text-slate-900",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																className: "flex items-center gap-1.5 text-[#1677c7]",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "تحليل الذكاء الاصطناعي لحل الطالب" })]
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																className: "text-emerald-700 tabular-nums",
																children: [
																	"المقترح: ",
																	aiRev.suggestedGrade,
																	" / ",
																	selectedAssignment.total_points
																]
															})]
														}), (aiRev.strengths.length > 0 || aiRev.improvements.length > 0) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "grid sm:grid-cols-2 gap-2",
															children: [aiRev.strengths.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "p-2 rounded-lg bg-emerald-50 border border-emerald-100 space-y-1",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "font-bold text-emerald-800 block",
																	children: "نقاط القوة:"
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
																	className: "list-disc list-inside text-emerald-900 space-y-0.5",
																	children: aiRev.strengths.map((st, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: st }, idx))
																})]
															}), aiRev.improvements.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "p-2 rounded-lg bg-amber-50 border border-amber-100 space-y-1",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "font-bold text-amber-800 block",
																	children: "نقاط للتحسين:"
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
																	className: "list-disc list-inside text-amber-950 space-y-0.5",
																	children: aiRev.improvements.map((im, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: im }, idx))
																})]
															})]
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "pt-2 border-t border-slate-200 grid sm:grid-cols-2 gap-2 text-xs",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
															className: "block font-bold text-slate-600 mb-1",
															children: [
																"الدرجة المستحقة (من ",
																selectedAssignment.total_points,
																"):"
															]
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
															type: "number",
															max: selectedAssignment.total_points,
															min: 0,
															step: "0.5",
															value: edit.score,
															onChange: (e) => setGradeEdits((prev) => ({
																...prev,
																[sub.id]: {
																	...edit,
																	score: e.target.value
																}
															})),
															className: "w-full p-2 bg-white border border-slate-200 rounded-xl outline-none font-bold tabular-nums"
														})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
															className: "block font-bold text-slate-600 mb-1",
															children: "ملاحظات وتشجيع المعلم:"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
															type: "text",
															value: edit.feedback,
															onChange: (e) => setGradeEdits((prev) => ({
																...prev,
																[sub.id]: {
																	...edit,
																	feedback: e.target.value
																}
															})),
															placeholder: "اكتب ملاحظة للطالب...",
															className: "w-full p-2 bg-white border border-slate-200 rounded-xl outline-none"
														})] })]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														onClick: () => handleTeacherGrade(sub),
														className: "w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer",
														children: "حفظ الدرجة وإشعار الطالب بنتيجته ✓"
													})
												] });
											})()
										]
									}, sub.id))
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-slate-400 text-center py-6",
									children: "لم يقم أي طالب بتسليم هذا الواجب حتى الآن."
								}),
								gradedSuccess && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-2.5 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 flex items-center gap-2 font-bold text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-4 h-4 text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "تم رصد الدرجة بنجاح وإرسال إشعار فوري للطالب!" })]
								})
							]
						})
					] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-slate-400",
						children: "اختر واجباً من القائمة لعرض تفاصيله وحله."
					})
				})]
			})
		]
	});
};
export { AssignmentsView };
