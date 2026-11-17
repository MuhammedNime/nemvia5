import React, { useEffect, useRef, useState } from 'react';
import {
  X,
  PenTool,
  Highlighter,
  Eraser,
  Minus,
  Square,
  Circle,
  Grid,
  Undo2,
  Trash2,
  Download,
  Send,
} from 'lucide-react';
import { saveOrShareBlobFile } from '../lib/native';

type ToolKind = 'pen' | 'highlighter' | 'line' | 'rect' | 'circle' | 'eraser';

interface WhiteboardModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  onSendImageToChat?: (file: File) => Promise<void> | void;
}

const COLORS = ['#0f233a', '#1677c7', '#dc2626', '#059669', '#d97706', '#7c3aed'];

export const WhiteboardModal: React.FC<WhiteboardModalProps> = ({
  open,
  onClose,
  title = 'السبورة التفاعلية للرسم والشرح',
  onSendImageToChat,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [tool, setTool] = useState<ToolKind>('pen');
  const [color, setColor] = useState<string>('#0f233a');
  const [lineWidth, setLineWidth] = useState<number>(4);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [busyExport, setBusyExport] = useState(false);

  const drawingRef = useRef(false);
  const startPtRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const snapshotRef = useRef<ImageData | null>(null);
  const historyRef = useRef<ImageData[]>([]);

  const initCanvasWhite = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    historyRef.current = [ctx.getImageData(0, 0, canvas.width, canvas.height)];
  };

  useEffect(() => {
    if (!open) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    initCanvasWhite(canvas);
  }, [open]);

  if (!open) return null;

  const getCoords = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * canvas.width,
      y: ((e.clientY - rect.top) / rect.height) * canvas.height,
    };
  };

  const pushHistory = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    historyRef.current = [...historyRef.current.slice(-19), ctx.getImageData(0, 0, canvas.width, canvas.height)];
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const pt = getCoords(e);
    drawingRef.current = true;
    startPtRef.current = pt;
    snapshotRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height);

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalAlpha = tool === 'highlighter' ? 0.35 : 1;
    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
    ctx.lineWidth = tool === 'eraser' ? lineWidth * 4 : tool === 'highlighter' ? lineWidth * 3 : lineWidth;

    if (tool === 'pen' || tool === 'highlighter' || tool === 'eraser') {
      ctx.beginPath();
      ctx.moveTo(pt.x, pt.y);
      ctx.lineTo(pt.x + 0.01, pt.y + 0.01);
      ctx.stroke();
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const pt = getCoords(e);

    if (tool === 'pen' || tool === 'highlighter' || tool === 'eraser') {
      ctx.lineTo(pt.x, pt.y);
      ctx.stroke();
    } else if (snapshotRef.current) {
      ctx.putImageData(snapshotRef.current, 0, 0);
      ctx.beginPath();
      const s = startPtRef.current;
      if (tool === 'line') {
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(pt.x, pt.y);
      } else if (tool === 'rect') {
        ctx.rect(s.x, s.y, pt.x - s.x, pt.y - s.y);
      } else if (tool === 'circle') {
        const r = Math.hypot(pt.x - s.x, pt.y - s.y);
        ctx.arc(s.x, s.y, r, 0, Math.PI * 2);
      }
      ctx.stroke();
    }
  };

  const handlePointerUp = () => {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) ctx.globalAlpha = 1;
    snapshotRef.current = null;
    pushHistory();
  };

  const handleUndo = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
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

  const buildMergedBlob = async (): Promise<Blob | null> => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const out = document.createElement('canvas');
    out.width = canvas.width;
    out.height = canvas.height;
    const octx = out.getContext('2d');
    if (!octx) return null;
    octx.drawImage(canvas, 0, 0);
    if (showGrid) {
      octx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
      octx.lineWidth = 1;
      for (let x = 0; x <= out.width; x += 40) {
        octx.beginPath(); octx.moveTo(x, 0); octx.lineTo(x, out.height); octx.stroke();
      }
      for (let y = 0; y <= out.height; y += 40) {
        octx.beginPath(); octx.moveTo(0, y); octx.lineTo(out.width, y); octx.stroke();
      }
    }
    return new Promise(resolve => out.toBlob(b => resolve(b), 'image/png'));
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
      const file = new File([blob], `whiteboard-${Date.now()}.png`, { type: 'image/png' });
      await onSendImageToChat(file);
      onClose();
    } finally {
      setBusyExport(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[80] bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4"
      dir="rtl"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-5xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[94dvh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-4 py-3 bg-[#0f233a] text-white flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <PenTool className="w-4 h-4 text-sky-400" />
            <h3 className="font-black text-sm">{title}</h3>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {onSendImageToChat && (
              <button
                type="button"
                disabled={busyExport}
                onClick={() => void handleSendChat()}
                className="min-h-[36px] px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>إرسال للمحادثة</span>
              </button>
            )}
            <button
              type="button"
              disabled={busyExport}
              onClick={() => void handleDownloadPng()}
              className="min-h-[36px] px-3 py-1.5 rounded-xl bg-[#1677c7] hover:bg-[#125fa0] disabled:opacity-60 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>حفظ PNG</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1 flex-wrap">
            {([
              ['pen', 'قلم', PenTool],
              ['highlighter', 'تظليل', Highlighter],
              ['line', 'خط', Minus],
              ['rect', 'مستطيل', Square],
              ['circle', 'دائرة', Circle],
              ['eraser', 'ممحاة', Eraser],
            ] as const).map(([id, label, Icon]) => (
              <button
                key={id}
                type="button"
                onClick={() => setTool(id)}
                className={`min-h-[34px] px-2.5 py-1 rounded-xl font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                  tool === id ? 'bg-[#1677c7] text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Colors */}
            <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-xl border border-slate-200">
              {COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    setColor(c);
                    if (tool === 'eraser') setTool('pen');
                  }}
                  className={`w-5 h-5 rounded-full cursor-pointer transition-transform ${
                    color === c && tool !== 'eraser' ? 'ring-2 ring-offset-1 ring-slate-900 scale-110' : ''
                  }`}
                  style={{ backgroundColor: c }}
                  aria-label={c}
                />
              ))}
            </div>

            {/* Stroke Width */}
            <select
              value={lineWidth}
              onChange={e => setLineWidth(Number(e.target.value))}
              className="px-2 py-1.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 outline-none"
            >
              <option value={2}>رفيع</option>
              <option value={4}>متوسط</option>
              <option value={8}>عريض</option>
            </select>

            <button
              type="button"
              onClick={() => setShowGrid(g => !g)}
              className={`min-h-[34px] px-2.5 py-1 rounded-xl font-bold flex items-center gap-1 cursor-pointer border ${
                showGrid ? 'bg-sky-50 border-sky-300 text-[#1677c7]' : 'bg-white border-slate-200 text-slate-600'
              }`}
              title="شبكة مربعات"
            >
              <Grid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">شبكة</span>
            </button>

            <button
              type="button"
              onClick={handleUndo}
              className="min-h-[34px] px-2.5 py-1 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold flex items-center gap-1 cursor-pointer"
              title="تراجع"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={handleClear}
              className="min-h-[34px] px-2.5 py-1 rounded-xl bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 font-bold flex items-center gap-1 cursor-pointer"
              title="مسح الكل"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="relative flex-1 bg-slate-100 p-2 sm:p-4 flex items-center justify-center overflow-hidden min-h-[320px]">
          <div className="relative w-full max-w-4xl aspect-[16/10] bg-white rounded-2xl border border-slate-300 shadow-inner overflow-hidden">
            <canvas
              ref={canvasRef}
              width={1120}
              height={700}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              className="w-full h-full touch-none cursor-crosshair block"
            />
            {showGrid && (
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, rgba(148,163,184,0.22) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.22) 1px, transparent 1px)',
                  backgroundSize: '40px 40px',
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
