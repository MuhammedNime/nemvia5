import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  RotateCw, 
  Play, 
  Pause, 
  RotateCcw, 
  Award, 
  CheckCircle, 
  Volume2, 
  VolumeX, 
  Download, 
  Printer, 
  Plus, 
  Zap, 
  BrainCircuit, 
  Activity, 
  TrendingUp, 
  Check, 
  X,
  Clock,
  Layers,
  ChevronRight,
  ChevronLeft,
  Flame,
  Target,
  Trash2,
  Loader2,
  ShieldCheck,
  Share2,
  Copy,
  BarChart2,
  PlusCircle,
} from 'lucide-react';
import QRCode from 'qrcode';
import { Profile, VerifiedCertificate } from '../../types';
import { generateFlashcardsAI } from '../../lib/ai';
import * as api from '../../lib/api';
import { getRemoteAppBaseUrl, shareAppLink } from '../../lib/native';
import {
  buildWeeklySummary,
  loadStudyTracker,
  logStudySession,
  removeStudyLog,
  setDailyStudyGoal,
  StudyTrackerState,
} from '../../lib/studyTracker';
import { CertificateVerifyModal } from './CertificateVerifyModal';

interface StudyToolsViewProps {
  currentProfile: Profile;
  onRewardXP: (xp: number) => void;
  initialTab?: 'flashcards' | 'pomodoro' | 'grapher' | 'certificate' | 'badges';
}

interface Flashcard {
  id: string;
  subject: string;
  front: string;
  back: string;
  hint?: string;
  category: 'math' | 'physics' | 'cs' | 'english';
}

const INITIAL_CARDS: Flashcard[] = [
  {
    id: 'c1',
    subject: 'الرياضيات المتقدمة',
    category: 'math',
    front: 'ما هو قانون المميز (Δ) في المعادلة التربيعية ax² + bx + c = 0 وما دلالته؟',
    back: 'Δ = b² - 4ac\n• إذا Δ > 0: يوجد حلان حقيقيان متمايزان.\n• إذا Δ = 0: يوجد حل وحيد مكرر.\n• إذا Δ < 0: لا توجد حلول حقيقية في ℝ (جذور مركبة).',
    hint: 'المميز يحدد عدد وطبيعة الجذور',
  },
  {
    id: 'c2',
    subject: 'الفيزياء الكلاسيكية',
    category: 'physics',
    front: 'ما هو القانون الثاني لنيوتن في الحركة؟ وما هي وحداته الدولية؟',
    back: 'F = m · a\n(القوة = الكتلة × التسارع)\n• القوة: نيوتن (N = kg·m/s²)\n• الكتلة: كيلوغرام (kg)\n• التسارع: م/ث² (m/s²)',
    hint: 'يربط بين القوة الصافية وتغير سرعة الجسم',
  },
  {
    id: 'c3',
    subject: 'علوم الحاسوب والبرمجة',
    category: 'cs',
    front: 'ما هو التعقيد الزمني (Time Complexity) لخوارزمية البحث الثنائي (Binary Search)؟',
    back: 'O(log n)\nلأن الخوارزمية تقسم نطاق البحث في المصفوفة المرتبة إلى النصف في كل خطوة.',
    hint: 'تتطلب مصفوفة مرتبة سلفاً',
  },
  {
    id: 'c4',
    subject: 'اللغة الإنجليزية الأكاديمية',
    category: 'english',
    front: 'ما معنى واستخدام المصطلح الأكاديمي: "Prerequisite"؟',
    back: 'المعنى: متطلب سابق إجباري.\nالاستخدام: كورس أو مهارة يجب إتمامها قبل التسجيل في مساق أعلى (e.g., "Calculus I is a prerequisite for Calculus II").',
    hint: 'Pre = مسبق',
  },
];

export const StudyToolsView: React.FC<StudyToolsViewProps> = ({
  currentProfile,
  onRewardXP,
  initialTab,
}) => {
  const [activeTab, setActiveTab] = useState<'flashcards' | 'pomodoro' | 'grapher' | 'certificate' | 'badges'>(
    initialTab || 'flashcards'
  );

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // FLASHCARDS STATE
  const [cards, setCards] = useState<Flashcard[]>(() => {
    try {
      const raw = localStorage.getItem(`nemvia-cards-${currentProfile.id}`);
      if (raw) return JSON.parse(raw) as Flashcard[];
    } catch { /* تجاهل */ }
    return INITIAL_CARDS;
  });
  useEffect(() => {
    try { localStorage.setItem(`nemvia-cards-${currentProfile.id}`, JSON.stringify(cards)); } catch { /* تجاهل */ }
  }, [cards]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [reviewedCount, setReviewedCount] = useState(0);

  // AI & Manual Flashcards Generator state
  const [showAiCardsForm, setShowAiCardsForm] = useState(false);
  const [aiCardTopic, setAiCardTopic] = useState('');
  const [aiCardCategory, setAiCardCategory] = useState<'math' | 'physics' | 'cs' | 'english'>('math');
  const [aiCardCount, setAiCardCount] = useState(5);
  const [aiCardLoading, setAiCardLoading] = useState(false);
  const [aiCardError, setAiCardError] = useState<string | null>(null);

  const [showAddCardForm, setShowAddCardForm] = useState(false);
  const [newCardSubject, setNewCardSubject] = useState('الرياضيات المتقدمة');
  const [newCardCategory, setNewCardCategory] = useState<'math' | 'physics' | 'cs' | 'english'>('math');
  const [newCardFront, setNewCardFront] = useState('');
  const [newCardBack, setNewCardBack] = useState('');
  const [newCardHint, setNewCardHint] = useState('');

  const filteredCards = cards.filter(c => selectedCategory === 'all' || c.category === selectedCategory);
  const safeIndex = filteredCards.length > 0 ? Math.min(currentCardIndex, filteredCards.length - 1) : 0;
  const activeCard = filteredCards[safeIndex];

  const handleNextCard = (difficulty: 'easy' | 'medium' | 'hard') => {
    if (filteredCards.length === 0) return;
    setIsFlipped(false);
    setReviewedCount(prev => prev + 1);
    if (difficulty === 'easy') onRewardXP(15);
    else onRewardXP(25);

    setTimeout(() => {
      setCurrentCardIndex((safeIndex + 1) % filteredCards.length);
    }, 200);
  };

  const handleGenerateCardsAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiCardTopic.trim() || aiCardLoading) return;
    setAiCardLoading(true);
    setAiCardError(null);
    try {
      const generated = await generateFlashcardsAI(aiCardTopic.trim(), aiCardCount, aiCardCategory);
      if (generated.length === 0) {
        setAiCardError('لم يتم توليد بطاقات صالحة. جرّب موضوعاً أكثر تحديداً.');
        return;
      }
      const mapped: Flashcard[] = generated.map((g, idx) => ({
        id: `ai-card-${Date.now()}-${idx}`,
        subject: g.subject || aiCardTopic.trim(),
        category: g.category,
        front: g.front,
        back: g.back,
        hint: g.hint || undefined,
      }));
      const startIndex = cards.length;
      setCards(prev => [...prev, ...mapped]);
      setSelectedCategory('all');
      setCurrentCardIndex(startIndex);
      setIsFlipped(false);
      setShowAiCardsForm(false);
      setAiCardTopic('');
      onRewardXP(10);
    } catch (err: any) {
      setAiCardError(err?.message || 'تعذّر توليد البطاقات بالذكاء الاصطناعي.');
    } finally {
      setAiCardLoading(false);
    }
  };

  const handleAddManualCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCardFront.trim() || !newCardBack.trim()) return;
    const item: Flashcard = {
      id: `card-${Date.now()}`,
      subject: newCardSubject.trim() || 'مراجعة عامة',
      category: newCardCategory,
      front: newCardFront.trim(),
      back: newCardBack.trim(),
      hint: newCardHint.trim() || undefined,
    };
    const nextIndex = cards.length;
    setCards(prev => [...prev, item]);
    setSelectedCategory('all');
    setCurrentCardIndex(nextIndex);
    setIsFlipped(false);
    setShowAddCardForm(false);
    setNewCardFront('');
    setNewCardBack('');
    setNewCardHint('');
  };

  const handleDeleteCard = (id: string) => {
    if (cards.length <= 1) return;
    setCards(prev => prev.filter(c => c.id !== id));
    setIsFlipped(false);
    setCurrentCardIndex(0);
  };

  // POMODORO TIMER + STUDY PLANNER STATE
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerMode, setTimerMode] = useState<'work' | 'break'>('work');
  const [ambientSound, setAmbientSound] = useState<'none' | 'rain' | 'library' | 'waves'>('none');
  const audioContextRef = useRef<AudioContext | null>(null);
  const soundNodeRef = useRef<AudioNode | null>(null);

  const [tracker, setTracker] = useState<StudyTrackerState>(() => loadStudyTracker(currentProfile.id));
  const [studySubject, setStudySubject] = useState('الرياضيات المتقدمة');
  const [manualSubject, setManualSubject] = useState('المراجعة اليومية');
  const [manualMinutes, setManualMinutes] = useState(30);
  const weeklySummary = React.useMemo(() => buildWeeklySummary(tracker), [tracker]);

  // VERIFIED QR CERTIFICATE STATE
  const certStorageKey = `nemvia-cert-code-${currentProfile.id}`;
  const [verifiedCert, setVerifiedCert] = useState<VerifiedCertificate | null>(null);
  const [certQrDataUrl, setCertQrDataUrl] = useState<string>('');
  const [issuingCert, setIssuingCert] = useState(false);
  const [certErr, setCertErr] = useState<string | null>(null);
  const [certVerifyOpen, setCertVerifyOpen] = useState(false);
  const [certCopied, setCertCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const savedCode = typeof window !== 'undefined' ? localStorage.getItem(certStorageKey) || '' : '';
    if (!savedCode) return;
    api.fetchVerifiedCertificate(savedCode).then(cert => {
      if (!cancelled && cert) setVerifiedCert(cert);
    });
    return () => { cancelled = true; };
  }, [certStorageKey]);

  useEffect(() => {
    if (!verifiedCert?.cert_code) {
      setCertQrDataUrl('');
      return;
    }
    let cancelled = false;
    const verifyUrl = `${getRemoteAppBaseUrl()}/?cert=${encodeURIComponent(verifiedCert.cert_code)}`;
    QRCode.toDataURL(verifyUrl, { width: 200, margin: 1 })
      .then(url => { if (!cancelled) setCertQrDataUrl(url); })
      .catch(() => { if (!cancelled) setCertQrDataUrl(''); });
    return () => { cancelled = true; };
  }, [verifiedCert?.cert_code]);

  // Timer Tick
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(sec => sec - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
      if (timerMode === 'work') {
        onRewardXP(50);
        setTracker(logStudySession(currentProfile.id, studySubject, 25, 'pomodoro'));
        setTimerMode('break');
        setTimerSeconds(5 * 60);
      } else {
        setTimerMode('work');
        setTimerSeconds(25 * 60);
      }
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds, timerMode, currentProfile.id, studySubject]);

  // Web Audio Synthesizer for ambient sounds (100% offline, pure Web Audio)
  const stopAmbientSound = () => {
    if (soundNodeRef.current) {
      try {
        (soundNodeRef.current as any).stop?.();
        soundNodeRef.current.disconnect();
      } catch (e) {}
      soundNodeRef.current = null;
    }
    setAmbientSound('none');
  };

  const playAmbientSound = (type: 'rain' | 'library' | 'waves') => {
    stopAmbientSound();
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = audioContextRef.current || new AudioCtx();
      audioContextRef.current = ctx;
      if (ctx.state === 'suspended') ctx.resume();

      // Synthesize pink/brown relaxing noise buffer
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Low pass filtering for warm ambient sound
        lastOut = (lastOut + (0.02 * white)) / 1.02;
        data[i] = lastOut * 0.4;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = ctx.createBiquadFilter();
      if (type === 'rain') {
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, ctx.currentTime);
      } else if (type === 'waves') {
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(450, ctx.currentTime);
      } else {
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(400, ctx.currentTime);
      }

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.15, ctx.currentTime);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
      soundNodeRef.current = noise;
      setAmbientSound(type);
    } catch (err) {
      console.warn('Audio synthesis not supported:', err);
    }
  };

  // MATHEMATICAL GRAPHER STATE (Interactive Custom Equation Parser)
  const graphCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [fxExpr, setFxExpr] = useState('0.5x^2 - 2');
  const [gxExpr, setGxExpr] = useState('x + 1');
  const [graphScale, setGraphScale] = useState(35);
  const [probeX, setProbeX] = useState('2');

  const evaluateMath = React.useCallback((rawExpr: string, xVal: number): number | null => {
    const clean = rawExpr
      .toLowerCase()
      .replace(/π/g, 'pi')
      .replace(/\s+/g, '')
      .replace(/(\d)(x|\(|pi|sin|cos|tan|sqrt|abs|log|ln|exp)/g, '$1*$2')
      .replace(/(x|\))(x|\(|pi|sin|cos|tan|sqrt|abs|log|ln|exp)/g, '$1*$2')
      .replace(/(x|\))(\d)/g, '$1*$2');
    if (!clean) return null;

    let pos = 0;
    const peek = () => clean[pos] || '';
    const consume = () => clean[pos++] || '';

    const parseNumber = (): number => {
      const start = pos;
      while (/[0-9.]/.test(peek())) pos++;
      if (start === pos) throw new Error('expected number');
      return parseFloat(clean.slice(start, pos));
    };

    const parseFactor = (): number => {
      if (peek() === '+') { consume(); return parseFactor(); }
      if (peek() === '-') { consume(); return -parseFactor(); }
      if (peek() === '(') {
        consume();
        const v = parseExpr();
        if (peek() === ')') consume();
        return v;
      }
      if (/[0-9.]/.test(peek())) return parseNumber();

      let ident = '';
      while (/[a-z]/.test(peek())) ident += consume();
      if (ident === 'x') return xVal;
      if (ident === 'pi') return Math.PI;
      if (ident === 'e') return Math.E;
      if (['sin', 'cos', 'tan', 'sqrt', 'abs', 'log', 'ln', 'exp'].includes(ident)) {
        let arg = 0;
        if (peek() === '(') {
          consume();
          arg = parseExpr();
          if (peek() === ')') consume();
        } else {
          arg = parseFactor();
        }
        if (ident === 'sin') return Math.sin(arg);
        if (ident === 'cos') return Math.cos(arg);
        if (ident === 'tan') return Math.tan(arg);
        if (ident === 'sqrt') return arg < 0 ? NaN : Math.sqrt(arg);
        if (ident === 'abs') return Math.abs(arg);
        if (ident === 'log') return arg <= 0 ? NaN : Math.log10(arg);
        if (ident === 'ln') return arg <= 0 ? NaN : Math.log(arg);
        if (ident === 'exp') return Math.exp(arg);
      }
      throw new Error('unknown token');
    };

    const parsePower = (): number => {
      const base = parseFactor();
      if (peek() === '^') {
        consume();
        const exp = parsePower();
        return Math.pow(base, exp);
      }
      return base;
    };

    const parseTerm = (): number => {
      let v = parsePower();
      while (peek() === '*' || peek() === '/') {
        const op = consume();
        const rhs = parsePower();
        v = op === '*' ? v * rhs : rhs === 0 ? NaN : v / rhs;
      }
      return v;
    };

    const parseExpr = (): number => {
      let v = parseTerm();
      while (peek() === '+' || peek() === '-') {
        const op = consume();
        const rhs = parseTerm();
        v = op === '+' ? v + rhs : v - rhs;
      }
      return v;
    };

    try {
      const result = parseExpr();
      if (pos < clean.length) return null;
      return Number.isFinite(result) ? result : null;
    } catch {
      return null;
    }
  }, []);

  const fxSyntaxError = fxExpr.trim() !== '' && evaluateMath(fxExpr, 1) === null && evaluateMath(fxExpr, 2) === null;
  const gxSyntaxError = gxExpr.trim() !== '' && evaluateMath(gxExpr, 1) === null && evaluateMath(gxExpr, 2) === null;
  const probeNum = Number(probeX);
  const probeFx = Number.isFinite(probeNum) ? evaluateMath(fxExpr, probeNum) : null;
  const probeGx = Number.isFinite(probeNum) && gxExpr.trim() ? evaluateMath(gxExpr, probeNum) : null;

  useEffect(() => {
    if (activeTab !== 'grapher') return;
    const canvas = graphCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const originX = width / 2;
    const originY = height / 2;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Coordinate grid aligned to origin
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    for (let x = originX % graphScale; x <= width; x += graphScale) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = originY % graphScale; y <= height; y += graphScale) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#0f233a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, originY);
    ctx.lineTo(width, originY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(originX, 0);
    ctx.lineTo(originX, height);
    ctx.stroke();

    // Unit tick numbers
    ctx.fillStyle = '#64748b';
    ctx.font = '11px JetBrains Mono, monospace';
    for (let u = -12; u <= 12; u++) {
      if (u === 0) continue;
      const px = originX + u * graphScale;
      const py = originY - u * graphScale;
      if (px > 15 && px < width - 15) ctx.fillText(String(u), px - 4, originY + 14);
      if (py > 15 && py < height - 10) ctx.fillText(String(u), originX + 6, py + 4);
    }

    const plotCurve = (expr: string, color: string, lineWidth: number) => {
      if (!expr.trim()) return;
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.beginPath();
      let drawing = false;
      let prevPy: number | null = null;
      for (let px = 0; px <= width; px += 1.5) {
        const mathX = (px - originX) / graphScale;
        const mathY = evaluateMath(expr, mathX);
        if (mathY === null || Math.abs(mathY) > 500) {
          drawing = false;
          prevPy = null;
          continue;
        }
        const py = originY - mathY * graphScale;
        if (!drawing || (prevPy !== null && Math.abs(py - prevPy) > height * 0.8)) {
          ctx.moveTo(px, py);
          drawing = true;
        } else {
          ctx.lineTo(px, py);
        }
        prevPy = py;
      }
      ctx.stroke();
    };

    plotCurve(gxExpr, '#10b981', 2.5);
    plotCurve(fxExpr, '#1677c7', 3);

    // Highlight evaluated probe point
    if (Number.isFinite(probeNum) && probeFx !== null) {
      const px = originX + probeNum * graphScale;
      const py = originY - probeFx * graphScale;
      if (px >= 0 && px <= width && py >= 0 && py <= height) {
        ctx.fillStyle = '#e11d48';
        ctx.beginPath();
        ctx.arc(px, py, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }
  }, [activeTab, fxExpr, gxExpr, graphScale, probeNum, probeFx, evaluateMath]);

  // CERTIFICATE DOWNLOAD / PRINT / ISSUE QR
  const handlePrintCertificate = () => {
    window.print();
  };

  const handleIssueOfficialCert = async () => {
    setIssuingCert(true);
    setCertErr(null);
    try {
      const existingCode = verifiedCert?.cert_code || (typeof window !== 'undefined' ? localStorage.getItem(certStorageKey) || '' : '');
      const issued = await api.issueVerifiedCertificate({
        student: currentProfile,
        existingCode: existingCode || undefined,
      });
      setVerifiedCert(issued);
      try { localStorage.setItem(certStorageKey, issued.cert_code); } catch { /* ignore */ }
    } catch (err: any) {
      setCertErr(err?.message || 'تعذّر توثيق الشهادة على الخادم.');
    } finally {
      setIssuingCert(false);
    }
  };

  const certVerifyUrl = verifiedCert
    ? `${getRemoteAppBaseUrl()}/?cert=${encodeURIComponent(verifiedCert.cert_code)}`
    : '';

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Crisp Architectural Header (no blue gradient banner) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-bold text-[#1677c7]">
            <Sparkles className="w-4 h-4" />
            <span>مختبر وأدوات التفوق الأكاديمي</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            بطاقات المراجعة الذكية، مؤقت بومودورو، محاكي الرياضيات، والشهادات
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            ولّد بطاقات مراجعة تلقائياً بالذكاء الاصطناعي لأي درس، ركّز بمؤقت بومودورو، وارسم الدوال الرياضية مباشرة.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-50 px-4 py-3 rounded-xl border border-slate-200 text-xs shrink-0">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-sm">
            XP
          </div>
          <div>
            <span className="font-bold text-slate-500 block">رصيد نقاطك</span>
            <span className="font-black text-slate-900 text-sm tabular-nums">{currentProfile.points} نقطة</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs for Tools */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'flashcards', label: 'بطاقات المراجعة الذكية', icon: Layers },
          { id: 'pomodoro', label: 'مؤقت التركيز بومودورو', icon: Clock },
          { id: 'grapher', label: 'محاكي الدوال والمنحنيات', icon: Activity },
          { id: 'certificate', label: 'الشهادة الأكاديمية', icon: Award },
          { id: 'badges', label: 'الأوسمة والإنجازات', icon: Zap },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white'
                  : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: 3D FLASHCARDS ENGINE + AI GENERATOR */}
      {activeTab === 'flashcards' && (
        <div className="space-y-5">
          {/* Categories Filter + AI / Manual Actions */}
          <div className="flex items-center justify-between text-xs flex-wrap gap-3">
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl flex-wrap">
              {[
                { id: 'all', label: 'كل المواد' },
                { id: 'math', label: 'رياضيات' },
                { id: 'physics', label: 'فيزياء' },
                { id: 'cs', label: 'برمجة' },
                { id: 'english', label: 'إنجليزية' },
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setCurrentCardIndex(0);
                    setIsFlipped(false);
                  }}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
                    selectedCategory === cat.id ? 'bg-white text-[#1677c7] shadow-xs' : 'text-slate-600'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-slate-500 font-bold tabular-nums ml-1">
                {filteredCards.length > 0 ? `البطاقة ${safeIndex + 1} من ${filteredCards.length}` : '0 بطاقات'} · تمت مراجعة {reviewedCount}
              </span>
              <button
                type="button"
                onClick={() => {
                  setShowAiCardsForm(v => !v);
                  setShowAddCardForm(false);
                }}
                className="px-3 py-2 bg-sky-50 hover:bg-sky-100 text-[#1677c7] border border-sky-200 font-bold rounded-xl flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>توليد بطاقات بالذكاء</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddCardForm(v => !v);
                  setShowAiCardsForm(false);
                }}
                className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold rounded-xl flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة بطاقة</span>
              </button>
            </div>
          </div>

          {/* AI Flashcards Generator Panel */}
          {showAiCardsForm && (
            <form onSubmit={handleGenerateCardsAI} className="bg-white border border-sky-200 rounded-2xl p-4 sm:p-5 space-y-3 shadow-xs">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-slate-900 font-black text-sm">
                  <Sparkles className="w-4 h-4 text-[#1677c7]" />
                  <span>توليد مجموعة بطاقات مراجعة بالذكاء الاصطناعي</span>
                </div>
                <button type="button" onClick={() => setShowAiCardsForm(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid sm:grid-cols-6 gap-2.5 text-xs">
                <input
                  value={aiCardTopic}
                  onChange={e => setAiCardTopic(e.target.value)}
                  placeholder="اكتب الموضوع أو الدرس (مثال: قوانين المشتقات أو الحث الكهرومغناطيسي)..."
                  className="sm:col-span-3 p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1677c7]"
                  required
                />
                <select
                  value={aiCardCategory}
                  onChange={e => setAiCardCategory(e.target.value as any)}
                  className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold outline-none focus:border-[#1677c7]"
                >
                  <option value="math">رياضيات</option>
                  <option value="physics">فيزياء</option>
                  <option value="cs">برمجة وحاسوب</option>
                  <option value="english">لغة إنجليزية</option>
                </select>
                <select
                  value={aiCardCount}
                  onChange={e => setAiCardCount(Number(e.target.value))}
                  className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold outline-none focus:border-[#1677c7]"
                >
                  <option value={4}>4 بطاقات</option>
                  <option value={6}>6 بطاقات</option>
                  <option value={8}>8 بطاقات</option>
                </select>
                <button
                  type="submit"
                  disabled={aiCardLoading || !aiCardTopic.trim()}
                  className="px-4 py-2.5 bg-[#1677c7] hover:bg-[#125fa0] disabled:opacity-50 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  {aiCardLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  <span>{aiCardLoading ? 'جاري التوليد...' : 'توليد الآن'}</span>
                </button>
              </div>
              {aiCardError && (
                <p className="text-xs text-rose-600 font-bold">{aiCardError}</p>
              )}
            </form>
          )}

          {/* Manual Add Card Panel */}
          {showAddCardForm && (
            <form onSubmit={handleAddManualCard} className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3 shadow-xs text-xs">
              <div className="flex items-center justify-between">
                <span className="font-black text-sm text-slate-900">إضافة بطاقة مراجعة جديدة يدوياً</span>
                <button type="button" onClick={() => setShowAddCardForm(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid sm:grid-cols-2 gap-2.5">
                <input
                  value={newCardSubject}
                  onChange={e => setNewCardSubject(e.target.value)}
                  placeholder="اسم المادة أو الوحدة..."
                  className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1677c7]"
                />
                <select
                  value={newCardCategory}
                  onChange={e => setNewCardCategory(e.target.value as any)}
                  className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold outline-none focus:border-[#1677c7]"
                >
                  <option value="math">رياضيات</option>
                  <option value="physics">فيزياء</option>
                  <option value="cs">برمجة وحاسوب</option>
                  <option value="english">لغة إنجليزية</option>
                </select>
                <textarea
                  rows={2}
                  value={newCardFront}
                  onChange={e => setNewCardFront(e.target.value)}
                  placeholder="وجه البطاقة (السؤال أو المفهوم)..."
                  className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1677c7]"
                  required
                />
                <textarea
                  rows={2}
                  value={newCardBack}
                  onChange={e => setNewCardBack(e.target.value)}
                  placeholder="ظهر البطاقة (الإجابة والقانون والشرح)..."
                  className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1677c7]"
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  value={newCardHint}
                  onChange={e => setNewCardHint(e.target.value)}
                  placeholder="تلميح اختياري يظهر قبل قلب البطاقة..."
                  className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1677c7]"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl cursor-pointer whitespace-nowrap"
                >
                  حفظ البطاقة
                </button>
              </div>
            </form>
          )}

          {/* Interactive 3D Flip Flashcard */}
          {activeCard ? (
            <div className="max-w-xl mx-auto space-y-4">
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className="relative min-h-[280px] sm:min-h-[320px] rounded-2xl p-6 sm:p-8 cursor-pointer select-none transition-all duration-300 shadow-sm border border-slate-200 flex flex-col justify-between text-center overflow-hidden bg-white hover:border-[#1677c7]"
              >
                {/* Header of Card */}
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="px-2.5 py-1 bg-sky-50 text-[#1677c7] font-bold rounded-lg border border-sky-100">
                    {activeCard.subject}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-[11px] font-bold">
                      <RotateCw className="w-3.5 h-3.5 text-slate-400" />
                      <span>انقر على البطاقة لقلبها</span>
                    </span>
                    {cards.length > 1 && (
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          handleDeleteCard(activeCard.id);
                        }}
                        title="حذف هذه البطاقة"
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Content: Front or Back */}
                <div className="my-auto py-4 space-y-3">
                  <span className="text-xs font-black uppercase text-slate-400 tracking-wider block">
                    {isFlipped ? 'الإجابة والشرح' : 'السؤال أو المفهوم'}
                  </span>
                  <p className={`font-black text-slate-900 leading-relaxed whitespace-pre-wrap ${
                    isFlipped ? 'text-base sm:text-lg text-emerald-950 font-sans' : 'text-lg sm:text-xl'
                  }`}>
                    {isFlipped ? activeCard.back : activeCard.front}
                  </p>
                  {!isFlipped && activeCard.hint && (
                    <span className="text-[11px] text-slate-500 block">
                      تلميح: {activeCard.hint}
                    </span>
                  )}
                </div>

                {/* Card Footer */}
                <div className="text-[11px] text-slate-400 border-t border-slate-100 pt-2">
                  نظام التكرار المتباعد · تقييم الحفظ يمنحك نقاط خبرة
                </div>
              </div>

              {/* Action Buttons for Card Spaced Repetition */}
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => handleNextCard('hard')}
                  className="flex-1 py-3 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-2xl border border-rose-200 transition-colors cursor-pointer"
                >
                  صعب / يحتاج مراجعة (0 XP)
                </button>
                <button
                  onClick={() => handleNextCard('medium')}
                  className="flex-1 py-3 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs rounded-2xl border border-amber-200 transition-colors cursor-pointer"
                >
                  متوسط الصعوبة (+15 XP)
                </button>
                <button
                  onClick={() => handleNextCard('easy')}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl shadow-md shadow-emerald-900/10 transition-colors cursor-pointer"
                >
                  سهل وحفظته تماماً! (+25 XP)
                </button>
              </div>
            </div>
          ) : (
            <div className="max-w-xl mx-auto p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-2 text-xs text-slate-500">
              <p className="font-bold text-slate-700">لا توجد بطاقات ضمن هذا التصنيف حالياً.</p>
              <p>جرّب اختيار "كل المواد" أو توليد بطاقات جديدة بالذكاء الاصطناعي.</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: POMODORO FOCUS ROOM & WEEKLY STUDY TRACKER */}
      {activeTab === 'pomodoro' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm text-center space-y-5">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className={`px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                timerMode === 'work' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
              }`}>
                {timerMode === 'work' ? '🔥 جلسة تركيز مكثفة (25 دقيقة)' : '☕ وقت استراحة قصيرة (5 دقائق)'}
              </span>
            </div>

            <div className="max-w-xs mx-auto text-xs space-y-1">
              <label className="font-bold text-slate-500 block">المادة الحالية للتركيز (تُسجّل تلقائياً عند انتهاء الجلسة):</label>
              <input
                type="text"
                value={studySubject}
                onChange={e => setStudySubject(e.target.value)}
                placeholder="اسم المادة..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-center outline-none focus:border-[#1677c7]"
              />
            </div>

            {/* Giant Digital Clock */}
            <div className="text-6xl sm:text-7xl font-black text-slate-900 font-mono tracking-tight">
              {String(Math.floor(timerSeconds / 60)).padStart(2, '0')}:
              {String(timerSeconds % 60).padStart(2, '0')}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className={`px-8 py-3.5 rounded-2xl font-black text-sm flex items-center gap-2 transition-all cursor-pointer shadow-lg ${
                  isTimerRunning
                    ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-900/20'
                    : 'bg-[#1677c7] hover:bg-[#125fa0] text-white shadow-sky-950/20'
                }`}
              >
                {isTimerRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                <span>{isTimerRunning ? 'إيقاف مؤقت' : 'بدء التركيز الآن'}</span>
              </button>

              <button
                onClick={() => {
                  setIsTimerRunning(false);
                  setTimerSeconds(timerMode === 'work' ? 25 * 60 : 5 * 60);
                }}
                className="p-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                title="إعادة ضبط المؤقت"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>

            {/* Ambient Sound Generator for Deep Focus */}
            <div className="pt-5 border-t border-slate-100 space-y-3">
              <span className="text-xs font-bold text-slate-600 block">
                أصوات بيئية مهدئة ومحفزة للتركيز (توليد صوتي نقي بدون إنترنت):
              </span>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {[
                  { id: 'none', label: 'صامت 🔇' },
                  { id: 'rain', label: 'صوت المطر الهادئ 🌧️' },
                  { id: 'waves', label: 'أمواج البحر الهادئة 🌊' },
                  { id: 'library', label: 'مكتبة هادئة (Noise) 📚' },
                ].map(snd => (
                  <button
                    key={snd.id}
                    onClick={() => {
                      if (snd.id === 'none') stopAmbientSound();
                      else playAmbientSound(snd.id as any);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      ambientSound === snd.id
                        ? 'bg-[#0f233a] text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {snd.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Weekly Study Planner & Time Analytics */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 space-y-5 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-sky-50 text-[#1677c7] flex items-center justify-center">
                  <BarChart2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-900">مخطط المذاكرة الأسبوعي وتحليل الوقت</h3>
                  <p className="text-[11px] text-slate-500">
                    إجمالي هذا الأسبوع: <strong className="text-slate-900">{weeklySummary.weeklyMinutes} دقيقة</strong> · اليوم: <strong className="text-[#1677c7]">{weeklySummary.todayMinutes} / {tracker.dailyGoalMinutes} د</strong>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-slate-500 font-bold">الهدف اليومي:</span>
                <select
                  value={tracker.dailyGoalMinutes}
                  onChange={e => setTracker(setDailyStudyGoal(currentProfile.id, Number(e.target.value)))}
                  className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-bold outline-none"
                >
                  {[30, 60, 90, 120, 180].map(m => (
                    <option key={m} value={m}>{m} دقيقة</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Daily Goal Progress Bar */}
            <div className="space-y-1.5">
              <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-l from-[#1677c7] to-emerald-500 transition-all duration-300"
                  style={{ width: `${Math.min(100, Math.round((weeklySummary.todayMinutes / Math.max(1, tracker.dailyGoalMinutes)) * 100))}%` }}
                />
              </div>
            </div>

            {/* 7-Day Bar Chart */}
            <div className="grid grid-cols-7 gap-2 items-end h-32 pt-3 px-2 bg-slate-50/70 rounded-2xl border border-slate-100">
              {(() => {
                const maxDay = Math.max(tracker.dailyGoalMinutes, ...weeklySummary.days.map(d => d.minutes), 30);
                return weeklySummary.days.map(d => {
                  const hPct = Math.max(6, Math.round((d.minutes / maxDay) * 100));
                  const reached = d.minutes >= tracker.dailyGoalMinutes;
                  return (
                    <div key={d.date} className="flex flex-col items-center justify-end h-full gap-1 pb-2">
                      <span className="text-[10px] font-bold text-slate-500 tabular-nums">{d.minutes}د</span>
                      <div className="w-full max-w-[28px] flex-1 flex items-end">
                        <div
                          className={`w-full rounded-t-lg transition-all ${reached ? 'bg-emerald-500' : 'bg-[#1677c7]'}`}
                          style={{ height: `${hPct}%` }}
                          title={`${d.label}: ${d.minutes} دقيقة`}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-slate-700 truncate max-w-full">{d.label}</span>
                    </div>
                  );
                });
              })()}
            </div>

            {/* Manual Session Logger */}
            <form
              onSubmit={e => {
                e.preventDefault();
                if (!manualSubject.trim() || manualMinutes < 1) return;
                setTracker(logStudySession(currentProfile.id, manualSubject.trim(), manualMinutes, 'manual'));
                onRewardXP(Math.min(30, Math.max(5, Math.round(manualMinutes / 3))));
              }}
              className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100"
            >
              <input
                type="text"
                value={manualSubject}
                onChange={e => setManualSubject(e.target.value)}
                placeholder="المادة (مثال: فيزياء، برمجة...)"
                className="flex-1 min-w-[160px] p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1677c7]"
                required
              />
              <input
                type="number"
                min={5}
                max={300}
                step={5}
                value={manualMinutes}
                onChange={e => setManualMinutes(Number(e.target.value) || 15)}
                className="w-24 p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-center outline-none"
              />
              <span className="text-slate-500 font-bold">دقيقة</span>
              <button
                type="submit"
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl inline-flex items-center gap-1.5 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>تسجيل جلسة دراسة</span>
              </button>
            </form>

            {/* Subject Breakdown & Recent Sessions */}
            {weeklySummary.bySubject.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="font-bold text-slate-700 block">توزيع ساعات المذاكرة حسب المادة (آخر ٧ أيام):</span>
                <div className="flex flex-wrap gap-2">
                  {weeklySummary.bySubject.map(s => (
                    <span key={s.subject} className="px-3 py-1.5 rounded-xl bg-sky-50 border border-sky-200 text-[#0f233a] font-bold">
                      {s.subject}: {s.minutes} د
                    </span>
                  ))}
                </div>
              </div>
            )}

            {tracker.logs.length > 0 && (
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <span className="font-bold text-slate-600 block">آخر الجلسات المسجلة:</span>
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {tracker.logs.slice(0, 6).map(log => (
                    <div key={log.id} className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-bold text-slate-800 truncate">{log.subject}</span>
                        <span className="text-[10px] text-slate-400">({log.source === 'pomodoro' ? 'بومودورو' : 'يدوي'})</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-black text-[#1677c7] tabular-nums">{log.minutes} د</span>
                        <button
                          type="button"
                          onClick={() => setTracker(removeStudyLog(currentProfile.id, log.id))}
                          className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                          title="حذف السجل"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: INTERACTIVE MATHEMATICAL LAB & FUNCTION GRAPHER */}
      {activeTab === 'grapher' && (
        <div className="space-y-4">
          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
              <div className="md:col-span-5 space-y-1">
                <label className="font-bold text-slate-700 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#1677c7]" />
                    المعادلة الأولى f(x)
                  </span>
                  {fxSyntaxError && <span className="text-rose-600 text-[10px]">صيغة غير صالحة</span>}
                </label>
                <input
                  value={fxExpr}
                  onChange={e => setFxExpr(e.target.value)}
                  dir="ltr"
                  placeholder="e.g. 0.5x^2 - 2 or sin(x)"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono outline-none focus:border-[#1677c7]"
                />
              </div>

              <div className="md:col-span-4 space-y-1">
                <label className="font-bold text-slate-700 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    معادلة مقارنة g(x) (اختياري)
                  </span>
                  {gxSyntaxError && <span className="text-rose-600 text-[10px]">صيغة غير صالحة</span>}
                </label>
                <input
                  value={gxExpr}
                  onChange={e => setGxExpr(e.target.value)}
                  dir="ltr"
                  placeholder="e.g. x + 1"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono outline-none focus:border-emerald-500"
                />
              </div>

              <div className="md:col-span-3 flex items-center gap-2">
                <div className="flex-1 space-y-1">
                  <label className="font-bold text-slate-700 block">نقطة الفحص x =</label>
                  <input
                    type="number"
                    step="0.5"
                    value={probeX}
                    onChange={e => setProbeX(e.target.value)}
                    dir="ltr"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono outline-none"
                  />
                </div>
                <div className="flex items-center gap-1 pb-0.5">
                  <button
                    type="button"
                    onClick={() => setGraphScale(s => Math.min(80, s + 8))}
                    className="px-2.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 font-black cursor-pointer"
                    title="تكبير"
                  >
                    +
                  </button>
                  <button
                    type="button"
                    onClick={() => setGraphScale(s => Math.max(16, s - 8))}
                    className="px-2.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 font-black cursor-pointer"
                    title="تصغير"
                  >
                    -
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-slate-500 font-bold">أمثلة سريعة:</span>
                {[
                  { label: '0.5x^2 - 2', fx: '0.5x^2 - 2', gx: 'x + 1' },
                  { label: 'sin(x)', fx: '2sin(x)', gx: 'cos(x)' },
                  { label: '0.2x^3 - x', fx: '0.2x^3 - x', gx: '' },
                  { label: 'abs(x) - 2', fx: 'abs(x) - 2', gx: '' },
                  { label: '1/x', fx: '1/x', gx: 'x' },
                ].map(p => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => { setFxExpr(p.fx); setGxExpr(p.gx); }}
                    dir="ltr"
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-sky-50 hover:text-[#1677c7] font-mono font-bold cursor-pointer"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              <div className="font-mono text-[11px] font-bold text-slate-700 flex items-center gap-3" dir="ltr">
                <span>f({probeX || 0}) = {probeFx !== null ? Number(probeFx.toFixed(3)) : '—'}</span>
                {gxExpr.trim() && (
                  <span className="text-emerald-700">g({probeX || 0}) = {probeGx !== null ? Number(probeGx.toFixed(3)) : '—'}</span>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-4 overflow-hidden flex justify-center">
            <canvas
              ref={graphCanvasRef}
              width={800}
              height={450}
              className="max-w-full rounded-2xl bg-white border border-slate-100"
            />
          </div>
        </div>
      )}

      {/* TAB 4: OFFICIAL QR-VERIFIED CERTIFICATE */}
      {activeTab === 'certificate' && (
        <div className="max-w-2xl mx-auto space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-bold text-slate-700">شهادة إتمام رقمية موثّقة برمز QR وقابلة للطباعة:</span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                disabled={issuingCert}
                onClick={() => void handleIssueOfficialCert()}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                {issuingCert ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                <span>{verifiedCert ? 'تحديث رصيد الشهادة الموثقة' : 'توثيق الشهادة وتوليد QR رسمي'}</span>
              </button>
              <button
                type="button"
                onClick={() => setCertVerifyOpen(true)}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl cursor-pointer"
              >
                التحقق من شهادة
              </button>
              <button
                type="button"
                onClick={handlePrintCertificate}
                className="px-4 py-2 bg-[#1677c7] hover:bg-[#125fa0] text-white font-bold rounded-xl flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <Printer className="w-4 h-4" />
                <span>طباعة / PDF</span>
              </button>
            </div>
          </div>

          {certErr && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
              {certErr}
            </div>
          )}

          {verifiedCert && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <span className="font-black text-emerald-900 block">
                  الشهادة موثقة رسمياً برمز: <span className="font-mono" dir="ltr">{verifiedCert.cert_code}</span>
                </span>
                <span className="text-[11px] text-emerald-800">يمكن لأي جهة مسح رمز QR أو فتح الرابط للتحقق الفوري من صحتها.</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={async () => {
                    await navigator.clipboard.writeText(certVerifyUrl).catch(() => {});
                    setCertCopied(true);
                    setTimeout(() => setCertCopied(false), 2000);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white border border-emerald-200 text-emerald-800 font-bold flex items-center gap-1 cursor-pointer"
                >
                  {certCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{certCopied ? 'تم النسخ' : 'نسخ رابط التحقق'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => void shareAppLink('شهادتي الموثقة من NEMVIA', `تحقق من شهادة ${currentProfile.display_name} على NEMVIA`, certVerifyUrl)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>مشاركة</span>
                </button>
              </div>
            </div>
          )}

          {/* Luxury Academic Certificate Preview */}
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-amber-50/60 via-white to-sky-50/50 border-8 border-double border-amber-600/40 shadow-2xl relative overflow-hidden space-y-8 text-center print:border-none print:shadow-none">
            {/* Watermark Logo */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-900/5 font-black text-9xl pointer-events-none select-none">
              NEMVIA
            </div>

            {/* Header */}
            <div className="space-y-2">
              <div className="inline-block p-2 rounded-2xl bg-gradient-to-br from-[#0f233a] to-[#1677c7] text-white font-black text-2xl shadow-lg">
                NEMVIA
              </div>
              <h3 className="text-xs uppercase tracking-widest font-black text-amber-700 pt-2">
                شهادة مشاركة وإنجاز · CERTIFICATE OF ACHIEVEMENT
              </h3>
            </div>

            {/* Certificate Body */}
            <div className="space-y-4">
              <p className="text-xs sm:text-sm text-slate-500">
                تشهد إدارة منصة <strong>NEMVIA التعليمية</strong> بأن الطالب(ـة) المتميز(ة):
              </p>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 underline decoration-amber-400 decoration-2 underline-offset-8">
                {currentProfile.display_name}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed pt-2">
                شارك(ت) في منصة NEMVIA التعليمية وحصل(ت) على رصيد إنجاز <strong>{verifiedCert ? verifiedCert.points : currentProfile.points} XP</strong> من خلال الاختبارات والمراجعة والنشاط.
              </p>
            </div>

            {/* Signatures, QR Verification & Seal */}
            <div className="pt-8 border-t border-amber-900/10 flex flex-wrap items-center justify-between gap-4 text-xs px-2 sm:px-4">
              <div className="text-right space-y-1">
                <span className="text-[10px] text-slate-400 block font-mono">رمز التحقق:</span>
                <span className="font-mono font-bold text-slate-700 text-xs" dir="ltr">
                  {verifiedCert ? verifiedCert.cert_code : `NEMVIA-${currentProfile.id.slice(0, 8).toUpperCase()}`}
                </span>
                <span className="text-[10px] text-slate-400 block">
                  التاريخ: {new Date(verifiedCert?.issued_at || Date.now()).toLocaleDateString('ar')}
                </span>
              </div>

              {certQrDataUrl ? (
                <div className="flex flex-col items-center gap-1">
                  <img
                    src={certQrDataUrl}
                    alt="رمز التحقق QR"
                    className="w-20 h-20 rounded-xl border border-slate-200 bg-white p-1"
                  />
                  <span className="text-[9px] font-bold text-emerald-700">امسح للتحقق</span>
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-white flex flex-col items-center justify-center shadow-lg border-2 border-white ring-4 ring-amber-200">
                  <Award className="w-6 h-6 text-white" />
                  <span className="text-[8px] font-black uppercase">NEMVIA</span>
                </div>
              )}

              {/* Founder Signature with exact spelling: محمد جمال نعمه */}
              <div className="text-left space-y-1">
                <span className="font-bold text-[#0f233a] block text-sm">محمد جمال نعمه</span>
                <span className="text-[10px] text-slate-500 block">مؤسس المنصة ورئيس الهيئة التعليمية</span>
                <span className="text-[9px] text-emerald-600 font-bold block">✓ توقيع رقمي موثق</span>
              </div>
            </div>
          </div>

          {certVerifyOpen && (
            <CertificateVerifyModal
              initialCode={verifiedCert?.cert_code || ''}
              onClose={() => setCertVerifyOpen(false)}
            />
          )}
        </div>
      )}

      {/* TAB 5: BADGES & REAL MILESTONES */}
      {activeTab === 'badges' && (
        <div className="space-y-6">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: 'بداية الانطلاق', desc: 'الوصول إلى 50 نقطة خبرة أو أكثر', icon: Flame, unlocked: currentProfile.points >= 50, color: 'text-orange-500 bg-orange-50' },
              { title: 'بطل المواظبة', desc: 'استمرار المذاكرة 7 أيام متتالية', icon: Award, unlocked: currentProfile.streakDays >= 7, color: 'text-amber-500 bg-amber-50' },
              { title: 'مُتقن البطاقات', desc: 'مراجعة 5 بطاقات أو امتلاك 8 بطاقات', icon: Sparkles, unlocked: reviewedCount >= 5 || cards.length >= 8, color: 'text-sky-500 bg-sky-50' },
              { title: 'نجم التميّز', desc: 'جمع 300 نقطة خبرة (XP) في المنصة', icon: BrainCircuit, unlocked: currentProfile.points >= 300, color: 'text-purple-500 bg-purple-50' },
            ].map((badge, idx) => {
              const Icon = badge.icon;
              return (
                <div
                  key={idx}
                  className={`p-5 rounded-2xl border text-center space-y-3 transition-all ${
                    badge.unlocked 
                      ? 'bg-white border-slate-200 shadow-xs' 
                      : 'bg-slate-50 border-slate-200 opacity-60'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-2xl mx-auto flex items-center justify-center ${badge.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 text-sm">{badge.title}</h4>
                    <p className="text-[11px] text-slate-500 pt-1 leading-relaxed">{badge.desc}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${
                    badge.unlocked ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {badge.unlocked ? '✓ تم الحصول عليه' : '🔒 قيد الإنجاز'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
