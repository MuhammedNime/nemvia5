import { r as __toESM } from "./rolldown-runtime-SbdDWaPq.js";
import { Bt as Eraser, J as PenTool, Jt as Circle, M as Send, S as Square, St as Highlighter, Tt as Grid3x3, Vt as Download, n as X, p as Undo2, tt as Minus, v as Trash2, wn as require_react } from "./icons-Ba0nzYf3.js";
import { z as saveOrShareBlobFile } from "./index-Bhmlh-C3.js";
import { t as require_jsx_runtime } from "./react-vendor-Dpw1FlJl.js";
// src/components/WhiteboardModal.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var COLORS = [
	"#0f233a",
	"#1677c7",
	"#dc2626",
	"#059669",
	"#d97706",
	"#7c3aed"
];
var WhiteboardModal = ({ open, onClose, title = "السبورة التفاعلية للرسم والشرح", onSendImageToChat }) => {
	const canvasRef = (0, import_react.useRef)(null);
	const [tool, setTool] = (0, import_react.useState)("pen");
	const [color, setColor] = (0, import_react.useState)("#0f233a");
	const [lineWidth, setLineWidth] = (0, import_react.useState)(4);
	const [showGrid, setShowGrid] = (0, import_react.useState)(true);
	const [busyExport, setBusyExport] = (0, import_react.useState)(false);
	const drawingRef = (0, import_react.useRef)(false);
	const startPtRef = (0, import_react.useRef)({
		x: 0,
		y: 0
	});
	const snapshotRef = (0, import_react.useRef)(null);
	const historyRef = (0, import_react.useRef)([]);
	const initCanvasWhite = (canvas) => {
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		ctx.fillStyle = "#ffffff";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		historyRef.current = [ctx.getImageData(0, 0, canvas.width, canvas.height)];
	};
	(0, import_react.useEffect)(() => {
		if (!open) return;
		const canvas = canvasRef.current;
		if (!canvas) return;
		initCanvasWhite(canvas);
	}, [open]);
	if (!open) return null;
	const getCoords = (e) => {
		const canvas = canvasRef.current;
		const rect = canvas.getBoundingClientRect();
		return {
			x: (e.clientX - rect.left) / rect.width * canvas.width,
			y: (e.clientY - rect.top) / rect.height * canvas.height
		};
	};
	const pushHistory = () => {
		const canvas = canvasRef.current;
		const ctx = canvas?.getContext("2d");
		if (!canvas || !ctx) return;
		historyRef.current = [...historyRef.current.slice(-19), ctx.getImageData(0, 0, canvas.width, canvas.height)];
	};
	const handlePointerDown = (e) => {
		const canvas = canvasRef.current;
		const ctx = canvas?.getContext("2d");
		if (!canvas || !ctx) return;
		e.currentTarget.setPointerCapture(e.pointerId);
		const pt = getCoords(e);
		drawingRef.current = true;
		startPtRef.current = pt;
		snapshotRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height);
		ctx.lineCap = "round";
		ctx.lineJoin = "round";
		ctx.globalAlpha = tool === "highlighter" ? .35 : 1;
		ctx.strokeStyle = tool === "eraser" ? "#ffffff" : color;
		ctx.lineWidth = tool === "eraser" ? lineWidth * 4 : tool === "highlighter" ? lineWidth * 3 : lineWidth;
		if (tool === "pen" || tool === "highlighter" || tool === "eraser") {
			ctx.beginPath();
			ctx.moveTo(pt.x, pt.y);
			ctx.lineTo(pt.x + .01, pt.y + .01);
			ctx.stroke();
		}
	};
	const handlePointerMove = (e) => {
		if (!drawingRef.current) return;
		const canvas = canvasRef.current;
		const ctx = canvas?.getContext("2d");
		if (!canvas || !ctx) return;
		const pt = getCoords(e);
		if (tool === "pen" || tool === "highlighter" || tool === "eraser") {
			ctx.lineTo(pt.x, pt.y);
			ctx.stroke();
		} else if (snapshotRef.current) {
			ctx.putImageData(snapshotRef.current, 0, 0);
			ctx.beginPath();
			const s = startPtRef.current;
			if (tool === "line") {
				ctx.moveTo(s.x, s.y);
				ctx.lineTo(pt.x, pt.y);
			} else if (tool === "rect") ctx.rect(s.x, s.y, pt.x - s.x, pt.y - s.y);
			else if (tool === "circle") {
				const r = Math.hypot(pt.x - s.x, pt.y - s.y);
				ctx.arc(s.x, s.y, r, 0, Math.PI * 2);
			}
			ctx.stroke();
		}
	};
	const handlePointerUp = () => {
		if (!drawingRef.current) return;
		drawingRef.current = false;
		const ctx = canvasRef.current?.getContext("2d");
		if (ctx) ctx.globalAlpha = 1;
		snapshotRef.current = null;
		pushHistory();
	};
	const handleUndo = () => {
		const canvas = canvasRef.current;
		const ctx = canvas?.getContext("2d");
		if (!canvas || !ctx || historyRef.current.length <= 1) return;
		const next = historyRef.current.slice(0, -1);
		historyRef.current = next;
		ctx.putImageData(next[next.length - 1], 0, 0);
	};
	const handleClear = () => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		initCanvasWhite(canvas);
	};
	const buildMergedBlob = async () => {
		const canvas = canvasRef.current;
		if (!canvas) return null;
		const out = document.createElement("canvas");
		out.width = canvas.width;
		out.height = canvas.height;
		const octx = out.getContext("2d");
		if (!octx) return null;
		octx.drawImage(canvas, 0, 0);
		if (showGrid) {
			octx.strokeStyle = "rgba(148, 163, 184, 0.25)";
			octx.lineWidth = 1;
			for (let x = 0; x <= out.width; x += 40) {
				octx.beginPath();
				octx.moveTo(x, 0);
				octx.lineTo(x, out.height);
				octx.stroke();
			}
			for (let y = 0; y <= out.height; y += 40) {
				octx.beginPath();
				octx.moveTo(0, y);
				octx.lineTo(out.width, y);
				octx.stroke();
			}
		}
		return new Promise((resolve) => out.toBlob((b) => resolve(b), "image/png"));
	};
	const handleDownloadPng = async () => {
		setBusyExport(true);
		try {
			const blob = await buildMergedBlob();
			if (blob) await saveOrShareBlobFile(blob, `nemvia-whiteboard-${Date.now()}.png`);
		} finally {
			setBusyExport(false);
		}
	};
	const handleSendChat = async () => {
		if (!onSendImageToChat) return;
		setBusyExport(true);
		try {
			const blob = await buildMergedBlob();
			if (!blob) return;
			await onSendImageToChat(new File([blob], `whiteboard-${Date.now()}.png`, { type: "image/png" }));
			onClose();
		} finally {
			setBusyExport(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-[80] bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4",
		dir: "rtl",
		onClick: onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-white rounded-3xl w-full max-w-5xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[94dvh]",
			onClick: (e) => e.stopPropagation(),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "px-4 py-3 bg-[#0f233a] text-white flex flex-wrap items-center justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenTool, { className: "w-4 h-4 text-sky-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-black text-sm",
							children: title
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 flex-wrap",
						children: [
							onSendImageToChat && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								disabled: busyExport,
								onClick: () => void handleSendChat(),
								className: "min-h-[36px] px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "إرسال للمحادثة" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								disabled: busyExport,
								onClick: () => void handleDownloadPng(),
								className: "min-h-[36px] px-3 py-1.5 rounded-xl bg-[#1677c7] hover:bg-[#125fa0] disabled:opacity-60 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "حفظ PNG" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: onClose,
								className: "min-h-[36px] min-w-[36px] flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "px-3 py-2 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-1 flex-wrap",
						children: [
							[
								"pen",
								"قلم",
								PenTool
							],
							[
								"highlighter",
								"تظليل",
								Highlighter
							],
							[
								"line",
								"خط",
								Minus
							],
							[
								"rect",
								"مستطيل",
								Square
							],
							[
								"circle",
								"دائرة",
								Circle
							],
							[
								"eraser",
								"ممحاة",
								Eraser
							]
						].map(([id, label, Icon]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setTool(id),
							className: `min-h-[34px] px-2.5 py-1 rounded-xl font-bold flex items-center gap-1 cursor-pointer transition-colors ${tool === id ? "bg-[#1677c7] text-white" : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden sm:inline",
								children: label
							})]
						}, id))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 flex-wrap",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center gap-1 bg-white px-2 py-1 rounded-xl border border-slate-200",
								children: COLORS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => {
										setColor(c);
										if (tool === "eraser") setTool("pen");
									},
									className: `w-5 h-5 rounded-full cursor-pointer transition-transform ${color === c && tool !== "eraser" ? "ring-2 ring-offset-1 ring-slate-900 scale-110" : ""}`,
									style: { backgroundColor: c },
									"aria-label": c
								}, c))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: lineWidth,
								onChange: (e) => setLineWidth(Number(e.target.value)),
								className: "px-2 py-1.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 outline-none",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: 2,
										children: "رفيع"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: 4,
										children: "متوسط"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: 8,
										children: "عريض"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setShowGrid((g) => !g),
								className: `min-h-[34px] px-2.5 py-1 rounded-xl font-bold flex items-center gap-1 cursor-pointer border ${showGrid ? "bg-sky-50 border-sky-300 text-[#1677c7]" : "bg-white border-slate-200 text-slate-600"}`,
								title: "شبكة مربعات",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Grid3x3, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "hidden sm:inline",
									children: "شبكة"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: handleUndo,
								className: "min-h-[34px] px-2.5 py-1 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold flex items-center gap-1 cursor-pointer",
								title: "تراجع",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Undo2, { className: "w-3.5 h-3.5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: handleClear,
								className: "min-h-[34px] px-2.5 py-1 rounded-xl bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 font-bold flex items-center gap-1 cursor-pointer",
								title: "مسح الكل",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3.5 h-3.5" })
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative flex-1 bg-slate-100 p-2 sm:p-4 flex items-center justify-center overflow-hidden min-h-[320px]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative w-full max-w-4xl aspect-[16/10] bg-white rounded-2xl border border-slate-300 shadow-inner overflow-hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
							ref: canvasRef,
							width: 1120,
							height: 700,
							onPointerDown: handlePointerDown,
							onPointerMove: handlePointerMove,
							onPointerUp: handlePointerUp,
							onPointerCancel: handlePointerUp,
							className: "w-full h-full touch-none cursor-crosshair block"
						}), showGrid && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "pointer-events-none absolute inset-0",
							style: {
								backgroundImage: "linear-gradient(to right, rgba(148,163,184,0.22) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.22) 1px, transparent 1px)",
								backgroundSize: "40px 40px"
							}
						})]
					})
				})
			]
		})
	});
};
export { WhiteboardModal as t };
