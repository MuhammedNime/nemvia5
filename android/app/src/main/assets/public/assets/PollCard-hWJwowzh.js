import { r as __toESM } from "./rolldown-runtime-SbdDWaPq.js";
import { $t as CircleCheck, U as Plus, n as X, sn as ChartNoAxesColumn, v as Trash2, wn as require_react } from "./icons-Ba0nzYf3.js";
import { i as castPollVote, l as deletePoll, o as createPoll } from "./index-Bhmlh-C3.js";
import { t as require_jsx_runtime } from "./react-vendor-Dpw1FlJl.js";
// src/components/PollCard.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var PollComposerModal = ({ open, scopeType, scopeId, creatorId, creatorName, onClose }) => {
	const [question, setQuestion] = (0, import_react.useState)("");
	const [options, setOptions] = (0, import_react.useState)(["", ""]);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	if (!open) return null;
	const submit = async (e) => {
		e.preventDefault();
		const validOpts = options.map((o) => o.trim()).filter(Boolean);
		if (!question.trim() || validOpts.length < 2) {
			setError("اكتب سؤال التصويت وخيارين على الأقل.");
			return;
		}
		setBusy(true);
		setError(null);
		try {
			await createPoll({
				scopeType,
				scopeId,
				creatorId,
				creatorName,
				question: question.trim(),
				options: validOpts
			});
			setQuestion("");
			setOptions(["", ""]);
			onClose();
		} catch (err) {
			setError(err?.message || "تعذّر نشر الاستطلاع.");
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-[70] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 font-['Cairo',sans-serif]",
		dir: "rtl",
		onClick: onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95",
			onClick: (e) => e.stopPropagation(),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-4 bg-[#0f233a] text-white flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartNoAxesColumn, { className: "w-4 h-4 text-sky-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-black text-sm",
						children: "إنشاء استطلاع تصويت سريع"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onClose,
					className: "text-white/70 hover:text-white cursor-pointer",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: submit,
				className: "p-5 space-y-3.5 text-xs",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block font-bold text-slate-700 mb-1",
						children: "سؤال التصويت:"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						value: question,
						onChange: (e) => setQuestion(e.target.value),
						placeholder: "مثال: ما أفضل موعد لحصة المراجعة؟",
						maxLength: 300,
						className: "w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1677c7]",
						required: true
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block font-bold text-slate-700",
								children: "الخيارات (2 إلى 6 خيارات):"
							}),
							options.map((opt, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: opt,
									onChange: (e) => setOptions((prev) => prev.map((v, i) => i === idx ? e.target.value : v)),
									placeholder: `الخيار ${idx + 1}`,
									maxLength: 120,
									className: "flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1677c7]",
									required: idx < 2
								}), options.length > 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setOptions((prev) => prev.filter((_, i) => i !== idx)),
									className: "p-2 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
								})]
							}, idx)),
							options.length < 6 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setOptions((prev) => [...prev, ""]),
								className: "text-[#1677c7] font-bold text-xs inline-flex items-center gap-1 cursor-pointer pt-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "إضافة خيار آخر" })]
							})
						]
					}),
					error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-rose-600 font-bold",
						children: error
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2 pt-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							disabled: busy,
							className: "flex-1 py-2.5 bg-[#1677c7] hover:bg-[#125fa0] disabled:opacity-60 text-white font-bold rounded-xl cursor-pointer",
							children: busy ? "جاري النشر..." : "نشر الاستطلاع"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: onClose,
							className: "px-4 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl cursor-pointer",
							children: "إلغاء"
						})]
					})
				]
			})]
		})
	});
};
var PollCard = ({ poll, currentUserId, currentRole, compact = false }) => {
	const [votingIdx, setVotingIdx] = (0, import_react.useState)(null);
	const votes = poll.votes || [];
	const totalVotes = votes.length;
	const myVote = votes.find((v) => v.user_id === currentUserId);
	const canDelete = poll.creator_id === currentUserId || currentRole === "admin";
	const vote = async (idx) => {
		setVotingIdx(idx);
		try {
			await castPollVote(poll.id, currentUserId, idx);
		} finally {
			setVotingIdx(null);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `bg-white border border-sky-200/80 rounded-2xl ${compact ? "p-3 space-y-2" : "p-4 space-y-3"} shadow-xs`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start justify-between gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-0.5 min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1.5 text-[10px] font-bold text-[#1677c7]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartNoAxesColumn, { className: "w-3.5 h-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["استطلاع رأي · ", poll.creator_name] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
					className: `font-black text-slate-900 leading-snug ${compact ? "text-xs" : "text-sm"}`,
					children: poll.question
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1.5 shrink-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full tabular-nums",
					children: [totalVotes, " صوت"]
				}), canDelete && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => void deletePoll(poll.id),
					className: "p-1 text-slate-400 hover:text-rose-600 cursor-pointer",
					title: "حذف الاستطلاع",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3.5 h-3.5" })
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-1.5",
			children: poll.options.map((opt, idx) => {
				const count = votes.filter((v) => v.option_index === idx).length;
				const pct = totalVotes > 0 ? Math.round(count / totalVotes * 100) : 0;
				const isMine = myVote?.option_index === idx;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					disabled: votingIdx !== null,
					onClick: () => void vote(idx),
					className: `w-full relative overflow-hidden rounded-xl border text-right px-3 py-2 text-xs font-bold transition-all cursor-pointer flex items-center justify-between gap-2 ${isMine ? "border-[#1677c7] bg-sky-50/70 text-[#0f233a]" : "border-slate-200 bg-slate-50/60 hover:border-sky-300 text-slate-700"}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `absolute inset-y-0 right-0 transition-all duration-300 ${isMine ? "bg-[#1677c7]/15" : "bg-slate-200/55"}`,
							style: { width: `${pct}%` }
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "relative z-10 flex items-center gap-1.5 truncate",
							children: [isMine && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-3.5 h-3.5 text-[#1677c7] shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate",
								children: opt
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "relative z-10 text-[11px] font-black tabular-nums shrink-0 text-slate-600",
							children: [
								pct,
								"% (",
								count,
								")"
							]
						})
					]
				}, idx);
			})
		})]
	});
};
export { PollComposerModal as n, PollCard as t };
