import { r as __toESM } from "./rolldown-runtime-SbdDWaPq.js";
import { Et as Globe, O as ShieldCheck, Rt as Eye, Ut as Copy, an as Check, dt as LogOut, ft as Lock, g as TriangleAlert, jt as Flame, ln as Camera, pt as LoaderCircle, v as Trash2, wn as require_react, x as Star, z as RefreshCw } from "./icons-Ba0nzYf3.js";
import { I as isNativeApp, P as getApiBaseUrl, T as auth, g as revokeGuardianReport, h as publishGuardianReport, n as GuardianPortalModal, u as fetchMyGuardianReport } from "./index-Bhmlh-C3.js";
import { F as updatePassword } from "./firebase-ClLwtwdv.js";
import { t as require_jsx_runtime } from "./react-vendor-Dpw1FlJl.js";
// src/components/views/ProfileView.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var roleName = {
	student: "طالب",
	teacher: "معلم",
	admin: "مؤسس / أدمن"
};
var input = "w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#1677c7] focus:bg-white";
var ProfileView = ({ profile, email, classesCount, quizzes = [], assignments = [], submissions = [], onSave, onUpload, onSignOut, onDeleteAccount }) => {
	const [name, setName] = (0, import_react.useState)(profile.display_name);
	const [bio, setBio] = (0, import_react.useState)(profile.bio);
	const [visibility, setVisibility] = (0, import_react.useState)(profile.visibility);
	const [avatar, setAvatar] = (0, import_react.useState)(profile.avatar_url || "");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [pw, setPw] = (0, import_react.useState)("");
	const [pwMsg, setPwMsg] = (0, import_react.useState)(null);
	const [deleteOpen, setDeleteOpen] = (0, import_react.useState)(false);
	const [deleteConfirmText, setDeleteConfirmText] = (0, import_react.useState)("");
	const [deleting, setDeleting] = (0, import_react.useState)(false);
	const [deleteError, setDeleteError] = (0, import_react.useState)(null);
	const [guardianReport, setGuardianReport] = (0, import_react.useState)(null);
	const [guardianBusy, setGuardianBusy] = (0, import_react.useState)(false);
	const [guardianCopied, setGuardianCopied] = (0, import_react.useState)(null);
	const [guardianPreviewOpen, setGuardianPreviewOpen] = (0, import_react.useState)(false);
	const hasPasswordProvider = Boolean(auth.currentUser?.providerData?.some((p) => p.providerId === "password"));
	(0, import_react.useEffect)(() => {
		fetchMyGuardianReport(profile.id).then(setGuardianReport);
	}, [profile.id]);
	const handlePublishGuardian = async (rotateCode = false) => {
		setGuardianBusy(true);
		try {
			const next = await publishGuardianReport(profile, {
				classesCount,
				quizzes,
				assignments,
				submissions,
				existingCode: guardianReport?.report_code,
				rotateCode
			});
			setGuardianReport(next);
		} finally {
			setGuardianBusy(false);
		}
	};
	const handleRevokeGuardian = async () => {
		if (!guardianReport) return;
		setGuardianBusy(true);
		try {
			await revokeGuardianReport(guardianReport.report_code);
			setGuardianReport(null);
		} finally {
			setGuardianBusy(false);
		}
	};
	const guardianShareUrl = guardianReport ? `${!isNativeApp() && typeof window !== "undefined" && window.location.origin.startsWith("http") ? window.location.origin : getApiBaseUrl() || "https://nemvia-app.onrender.com"}/?guardian=${encodeURIComponent(guardianReport.report_code)}` : "";
	const pickAvatar = async (e) => {
		const f = e.target.files?.[0];
		e.target.value = "";
		if (!f || !f.type.startsWith("image/")) return;
		setBusy(true);
		try {
			setAvatar((await onUpload(f, "avatars")).url);
		} catch {}
		setBusy(false);
	};
	const save = async (e) => {
		e.preventDefault();
		if (!name.trim()) return;
		setBusy(true);
		await onSave({
			display_name: name.trim(),
			bio: bio.trim(),
			visibility,
			avatar_url: avatar || void 0
		});
		setBusy(false);
	};
	const changePassword = async (e) => {
		e.preventDefault();
		if (!auth.currentUser) return;
		try {
			await updatePassword(auth.currentUser, pw);
			setPwMsg({
				ok: true,
				text: "تم تغيير كلمة المرور"
			});
			setPw("");
		} catch (err) {
			setPwMsg({
				ok: false,
				text: err?.message || "تعذّر تغيير كلمة المرور"
			});
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5 animate-in fade-in max-w-2xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white border border-slate-200 rounded-3xl p-6 flex items-center gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative shrink-0",
					children: [avatar ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: avatar,
						alt: "",
						className: "w-20 h-20 rounded-2xl object-cover border border-slate-200"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-20 h-20 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-3xl font-black",
						children: name.slice(0, 1) || "؟"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "absolute -bottom-2 -left-2 w-8 h-8 rounded-full bg-white border border-slate-200 text-[#1677c7] flex items-center justify-center cursor-pointer shadow",
						children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "file",
							accept: "image/*",
							className: "hidden",
							onChange: pickAvatar
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-xl font-black text-slate-900 truncate",
							children: profile.display_name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-slate-500",
							children: [
								roleName[profile.role],
								" · منضم ",
								profile.joinedDate
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-3 mt-2 text-xs font-bold text-slate-700",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "w-3.5 h-3.5 text-amber-500" }),
										profile.points,
										" نقطة"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "w-3.5 h-3.5 text-orange-500" }),
										profile.streakDays,
										" يوم"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [classesCount, " صف"] })
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: save,
				className: "bg-white rounded-2xl border border-slate-200 p-5 space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-black text-slate-900 text-sm",
						children: "معلومات الحساب"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs font-bold text-slate-600",
							children: "الاسم الظاهر"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: name,
							onChange: (e) => setName(e.target.value),
							maxLength: 80,
							required: true,
							className: input
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs font-bold text-slate-600",
							children: "نبذة عنك"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: bio,
							onChange: (e) => setBio(e.target.value),
							maxLength: 300,
							rows: 3,
							className: input
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs font-bold text-slate-600",
							children: "البريد الإلكتروني"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: email,
							readOnly: true,
							dir: "ltr",
							className: `${input} text-slate-400`
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-2 gap-2 text-xs font-bold",
						children: [[
							"public",
							"عام",
							Globe,
							"منشوراتك وقصصك يراها كل المسجّلين"
						], [
							"private",
							"خاص",
							Lock,
							"منشوراتك لا تظهر إلا لك ولأعضاء صفوفك"
						]].map(([v, label, Icon, hint]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setVisibility(v),
							className: `p-3 rounded-xl border text-right cursor-pointer ${visibility === v ? "border-[#1677c7] bg-sky-50 text-[#1677c7]" : "border-slate-200 text-slate-500"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "w-3.5 h-3.5" }), label]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-[10px] font-normal mt-1 leading-relaxed",
								children: hint
							})]
						}, v))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						disabled: busy,
						className: "w-full py-3 bg-[#1677c7] hover:bg-[#125fa0] disabled:opacity-60 text-white font-black rounded-xl text-sm cursor-pointer",
						children: "حفظ التغييرات"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white rounded-2xl border border-slate-200 p-5 space-y-3 text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-start justify-between gap-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-0.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "font-black text-slate-900 text-sm flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "w-4 h-4 text-[#1677c7]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "بوابة ولي الأمر (رمز متابعة آمن للقراءة فقط)" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-slate-500 leading-relaxed",
							children: "أنشئ رمزاً سرياً يتيح لولي أمرك متابعة معدلك ودرجاتك وسلسلة المواظبة دون الوصول إلى رسائلك أو أي معلومات خاصة."
						})]
					})
				}), guardianReport ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3 pt-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-3 bg-sky-50/70 border border-sky-200 rounded-xl flex flex-wrap items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] font-bold text-slate-500 block",
							children: "رمز المتابعة الحالي:"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono font-black text-base text-[#0f233a] tracking-widest",
							dir: "ltr",
							children: guardianReport.report_code
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => {
										navigator.clipboard.writeText(guardianReport.report_code);
										setGuardianCopied("code");
										setTimeout(() => setGuardianCopied(null), 2e3);
									},
									className: "px-2.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg font-bold text-[#1677c7] flex items-center gap-1 cursor-pointer",
									children: [guardianCopied === "code" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-3.5 h-3.5 text-emerald-600" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: guardianCopied === "code" ? "نُسخ الرمز" : "نسخ الرمز" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => {
										navigator.clipboard.writeText(guardianShareUrl);
										setGuardianCopied("link");
										setTimeout(() => setGuardianCopied(null), 2e3);
									},
									className: "px-2.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg font-bold text-slate-700 flex items-center gap-1 cursor-pointer",
									children: [guardianCopied === "link" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-3.5 h-3.5 text-emerald-600" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: guardianCopied === "link" ? "نُسخ الرابط" : "نسخ الرابط" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setGuardianPreviewOpen(true),
									className: "px-2.5 py-1.5 bg-[#1677c7] text-white rounded-lg font-bold flex items-center gap-1 cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "معاينة" })]
								})
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								disabled: guardianBusy,
								onClick: () => void handlePublishGuardian(false),
								className: "px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl flex items-center gap-1.5 cursor-pointer",
								children: [guardianBusy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "تحديث الدرجات الآن" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								disabled: guardianBusy,
								onClick: () => void handlePublishGuardian(true),
								className: "px-3.5 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 font-bold rounded-xl cursor-pointer",
								children: "توليد رمز جديد"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								disabled: guardianBusy,
								onClick: () => void handleRevokeGuardian(),
								className: "px-3.5 py-2 bg-rose-50 hover:bg-rose-100 disabled:opacity-50 text-rose-700 font-bold rounded-xl cursor-pointer",
								children: "إيقاف المشاركة"
							})
						]
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					disabled: guardianBusy,
					onClick: () => void handlePublishGuardian(false),
					className: "px-4 py-2.5 bg-[#1677c7] hover:bg-[#125fa0] disabled:opacity-50 text-white font-bold rounded-xl inline-flex items-center gap-1.5 cursor-pointer",
					children: [guardianBusy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "إنشاء رمز متابعة لولي الأمر" })]
				})]
			}),
			hasPasswordProvider && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: changePassword,
				className: "bg-white rounded-2xl border border-slate-200 p-5 space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-black text-slate-900 text-sm",
						children: "تغيير كلمة المرور"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "password",
						value: pw,
						onChange: (e) => setPw(e.target.value),
						minLength: 6,
						required: true,
						dir: "ltr",
						placeholder: "كلمة مرور جديدة (6 أحرف فأكثر)",
						className: input
					}),
					pwMsg && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: `text-xs font-bold ${pwMsg.ok ? "text-emerald-600" : "text-rose-600"}`,
						children: pwMsg.text
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						className: "px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-xs cursor-pointer",
						children: "تغيير"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: onSignOut,
				className: "w-full py-3 bg-rose-50 hover:bg-rose-100 text-rose-600 font-black rounded-xl text-sm flex items-center justify-center gap-2 cursor-pointer",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "w-4 h-4" }), " تسجيل الخروج"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "bg-rose-50/60 border border-rose-200 rounded-2xl p-4 space-y-2.5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-3 flex-wrap",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-0.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "font-black text-rose-900 text-xs flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "w-4 h-4 text-rose-600" }), "منطقة الخطر — حذف الحساب نهائياً"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-rose-700 leading-relaxed",
							children: "يحذف حسابك وجميع منشوراتك ورسائلك وبياناتك نهائياً من المنصة ولا يمكن التراجع عن ذلك."
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => {
							setDeleteOpen(true);
							setDeleteConfirmText("");
							setDeleteError(null);
						},
						className: "px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shrink-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3.5 h-3.5" }), " حذف حسابي"]
					})]
				})
			}),
			deleteOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-[70] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4",
				onClick: () => !deleting && setDeleteOpen(false),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-rose-100",
					onClick: (e) => e.stopPropagation(),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2.5 text-rose-700",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "w-6 h-6 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-black text-base",
								children: "تأكيد حذف الحساب نهائياً"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-slate-600 leading-relaxed",
							children: [
								"سيتم حذف ملفك الشخصي وجميع صفوفك ومنشوراتك ورسائلك وتسليماتك نهائياً دون إمكانية الاسترجاع. اكتب كلمة ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-rose-700",
									children: "حذف"
								}),
								" للمتابعة."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: deleteConfirmText,
							onChange: (e) => setDeleteConfirmText(e.target.value),
							placeholder: "اكتب: حذف",
							className: input,
							disabled: deleting
						}),
						deleteError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-bold text-rose-600",
							children: deleteError
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-end gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								disabled: deleting,
								onClick: () => setDeleteOpen(false),
								className: "px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer",
								children: "إلغاء"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								disabled: deleting || deleteConfirmText.trim() !== "حذف",
								onClick: async () => {
									setDeleting(true);
									setDeleteError(null);
									try {
										await onDeleteAccount();
										setDeleteOpen(false);
									} catch (err) {
										setDeleteError(err?.message || "تعذّر حذف الحساب");
									} finally {
										setDeleting(false);
									}
								},
								className: "px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-black flex items-center gap-1.5 cursor-pointer",
								children: [deleting && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin" }), "تأكيد الحذف النهائي"]
							})]
						})
					]
				})
			}),
			guardianPreviewOpen && guardianReport && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GuardianPortalModal, {
				initialCode: guardianReport.report_code,
				onClose: () => setGuardianPreviewOpen(false)
			})
		]
	});
};
export { ProfileView };
