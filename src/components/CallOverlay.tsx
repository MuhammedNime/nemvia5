import React, { useEffect, useRef, useState } from 'react';
import {
  Phone,
  PhoneOff,
  Video,
  VideoOff,
  Mic,
  MicOff,
  SwitchCamera,
  Minimize2,
  Maximize2,
  Loader2,
  Volume2,
} from 'lucide-react';
import { CallSession, CallType } from '../types';
import * as api from '../lib/api';

const ICE_SERVERS: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun.cloudflare.com:3478' },
  ],
};

export interface OutgoingCallRequest {
  calleeId: string;
  calleeName: string;
  callType: CallType;
}

interface CallOverlayProps {
  currentUserId: string;
  currentUserName: string;
  outgoingRequest: OutgoingCallRequest | null;
  incomingCall: CallSession | null;
  onClearOutgoing: () => void;
  onClearIncoming: () => void;
  onNotify: (msg: string, ok?: boolean) => void;
}

export const CallOverlay: React.FC<CallOverlayProps> = ({
  currentUserId,
  currentUserName,
  outgoingRequest,
  incomingCall,
  onClearOutgoing,
  onClearIncoming,
  onNotify,
}) => {
  const [phase, setPhase] = useState<'idle' | 'calling' | 'ringing' | 'connected'>('idle');
  const [activeCallId, setActiveCallId] = useState<string | null>(null);
  const [peerName, setPeerName] = useState('');
  const [callType, setCallType] = useState<CallType>('audio');
  const [muted, setMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [minimized, setMinimized] = useState(false);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [remoteHasVideo, setRemoteHasVideo] = useState(false);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
  const pendingIceRef = useRef<RTCIceCandidateInit[]>([]);
  const callUnsubRef = useRef<(() => void) | null>(null);
  const candUnsubRef = useRef<(() => void) | null>(null);
  const answerSetRef = useRef(false);
  const activeCallIdRef = useRef<string | null>(null);
  const phaseRef = useRef(phase);
  phaseRef.current = phase;
  activeCallIdRef.current = activeCallId;

  const stopRingtone = useRef<(() => void) | null>(null);

  const startRingtone = (incoming: boolean) => {
    stopRingtone.current?.();
    let timerId: number | undefined;
    let audioCtx: AudioContext | null = null;
    try {
      const Ctx = window.AudioContext || (window as any).webkitAudioContext;
      if (!Ctx) return;
      audioCtx = new Ctx();
      const pulse = () => {
        if (!audioCtx || audioCtx.state === 'closed') return;
        if (audioCtx.state === 'suspended') void audioCtx.resume();
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(incoming ? 587.33 : 440, now);
        if (incoming) osc.frequency.setValueAtTime(783.99, now + 0.18);
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(0.06, now + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.42);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.45);
      };
      pulse();
      timerId = window.setInterval(pulse, incoming ? 1700 : 2400);
    } catch {
      /* ignore audio block */
    }
    stopRingtone.current = () => {
      if (timerId) window.clearInterval(timerId);
      if (audioCtx && audioCtx.state !== 'closed') void audioCtx.close().catch(() => {});
      stopRingtone.current = null;
    };
  };

  const cleanupMediaAndPeer = () => {
    stopRingtone.current?.();
    callUnsubRef.current?.();
    callUnsubRef.current = null;
    candUnsubRef.current?.();
    candUnsubRef.current = null;
    pendingIceRef.current = [];
    answerSetRef.current = false;

    if (pcRef.current) {
      try {
        pcRef.current.ontrack = null;
        pcRef.current.onicecandidate = null;
        pcRef.current.onconnectionstatechange = null;
        pcRef.current.close();
      } catch { /* ignore */ }
      pcRef.current = null;
    }

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(t => {
        try { t.stop(); } catch { /* ignore */ }
      });
      localStreamRef.current = null;
    }

    if (remoteStreamRef.current) {
      remoteStreamRef.current.getTracks().forEach(t => {
        try { t.stop(); } catch { /* ignore */ }
      });
      remoteStreamRef.current = null;
    }

    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    if (remoteAudioRef.current) remoteAudioRef.current.srcObject = null;

    setActiveCallId(null);
    setPhase('idle');
    setMuted(false);
    setCamOff(false);
    setMinimized(false);
    setElapsedSec(0);
    setRemoteHasVideo(false);
  };

  // Attach streams cleanly whenever refs/UI mount
  useEffect(() => {
    if (localVideoRef.current && localStreamRef.current) {
      localVideoRef.current.srcObject = localStreamRef.current;
    }
    if (remoteVideoRef.current && remoteStreamRef.current) {
      remoteVideoRef.current.srcObject = remoteStreamRef.current;
    }
    if (remoteAudioRef.current && remoteStreamRef.current) {
      remoteAudioRef.current.srcObject = remoteStreamRef.current;
    }
  }, [phase, minimized, remoteHasVideo, camOff]);

  // Call duration clock
  useEffect(() => {
    if (phase !== 'connected') return;
    const t = window.setInterval(() => setElapsedSec(s => s + 1), 1000);
    return () => window.clearInterval(t);
  }, [phase]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupMediaAndPeer();
    };
  }, []);

  const setupPeerConnection = (callId: string, stream: MediaStream) => {
    const pc = new RTCPeerConnection(ICE_SERVERS);
    pcRef.current = pc;
    const remoteStream = new MediaStream();
    remoteStreamRef.current = remoteStream;

    stream.getTracks().forEach(track => pc.addTrack(track, stream));

    pc.ontrack = ev => {
      ev.streams[0]?.getTracks().forEach(track => {
        if (!remoteStream.getTracks().some(t => t.id === track.id)) {
          remoteStream.addTrack(track);
        }
        if (track.kind === 'video') setRemoteHasVideo(true);
      });
      if (ev.track && !remoteStream.getTracks().some(t => t.id === ev.track.id)) {
        remoteStream.addTrack(ev.track);
        if (ev.track.kind === 'video') setRemoteHasVideo(true);
      }
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;
      if (remoteAudioRef.current) remoteAudioRef.current.srcObject = remoteStream;
    };

    pc.onicecandidate = ev => {
      if (ev.candidate) {
        const json = ev.candidate.toJSON();
        void api.addCallIceCandidate(callId, currentUserId, json as Record<string, any>);
      }
    };

    pc.onconnectionstatechange = () => {
      const state = pc.connectionState;
      if (state === 'connected') {
        stopRingtone.current?.();
        setPhase('connected');
      } else if (state === 'failed' || state === 'closed') {
        void hangup();
      }
    };

    return pc;
  };

  const flushPendingIce = async (pc: RTCPeerConnection) => {
    const queued = [...pendingIceRef.current];
    pendingIceRef.current = [];
    for (const cand of queued) {
      try {
        await pc.addIceCandidate(new RTCIceCandidate(cand));
      } catch { /* ignore stale candidate */ }
    }
  };

  // Start outgoing call when outgoingRequest arrives
  useEffect(() => {
    if (!outgoingRequest || phaseRef.current !== 'idle') return;
    let cancelled = false;

    const startOutgoing = async () => {
      if (!navigator.mediaDevices?.getUserMedia || typeof RTCPeerConnection === 'undefined') {
        onNotify('متصفحك أو جهازك لا يدعم مكالمات الصوت والفيديو المباشرة', false);
        onClearOutgoing();
        return;
      }

      setPeerName(outgoingRequest.calleeName);
      setCallType(outgoingRequest.callType);
      setPhase('calling');
      onClearOutgoing();

      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: outgoingRequest.callType === 'video' ? { facingMode: 'user' } : false,
        });
      } catch {
        onNotify('يرجى السماح بالوصول للمايكروفون والكاميرا لإجراء المكالمة', false);
        cleanupMediaAndPeer();
        return;
      }

      if (cancelled) {
        stream.getTracks().forEach(t => t.stop());
        return;
      }

      localStreamRef.current = stream;
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      startRingtone(false);

      try {
        const pc = new RTCPeerConnection(ICE_SERVERS);
        pcRef.current = pc;
        const remoteStream = new MediaStream();
        remoteStreamRef.current = remoteStream;
        stream.getTracks().forEach(track => pc.addTrack(track, stream));

        pc.ontrack = ev => {
          ev.streams[0]?.getTracks().forEach(t => {
            if (!remoteStream.getTracks().some(x => x.id === t.id)) remoteStream.addTrack(t);
            if (t.kind === 'video') setRemoteHasVideo(true);
          });
          if (ev.track && !remoteStream.getTracks().some(x => x.id === ev.track.id)) {
            remoteStream.addTrack(ev.track);
            if (ev.track.kind === 'video') setRemoteHasVideo(true);
          }
          if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;
          if (remoteAudioRef.current) remoteAudioRef.current.srcObject = remoteStream;
        };

        pc.onconnectionstatechange = () => {
          if (pc.connectionState === 'connected') {
            stopRingtone.current?.();
            setPhase('connected');
          } else if (pc.connectionState === 'failed') {
            onNotify('تعذّر إتمام الاتصال بسبب قيود الشبكة', false);
            void hangup();
          }
        };

        const offerDesc = await pc.createOffer({
          offerToReceiveAudio: true,
          offerToReceiveVideo: outgoingRequest.callType === 'video',
        });
        await pc.setLocalDescription(offerDesc);

        const callId = await api.createCallOffer({
          callerId: currentUserId,
          callerName: currentUserName,
          calleeId: outgoingRequest.calleeId,
          calleeName: outgoingRequest.calleeName,
          callType: outgoingRequest.callType,
          offer: { type: offerDesc.type, sdp: offerDesc.sdp || '' },
        });

        setActiveCallId(callId);
        activeCallIdRef.current = callId;

        pc.onicecandidate = ev => {
          if (ev.candidate) {
            void api.addCallIceCandidate(callId, currentUserId, ev.candidate.toJSON() as Record<string, any>);
          }
        };

        candUnsubRef.current = api.subscribeCallCandidates(callId, currentUserId, async cand => {
          if (pc.remoteDescription) {
            try { await pc.addIceCandidate(new RTCIceCandidate(cand)); } catch { /* ignore */ }
          } else {
            pendingIceRef.current.push(cand);
          }
        });

        callUnsubRef.current = api.subscribeCallSession(callId, async call => {
          if (!call) {
            cleanupMediaAndPeer();
            return;
          }
          if (call.status === 'rejected') {
            onNotify(`رفض ${call.callee_name} المكالمة`, false);
            cleanupMediaAndPeer();
            return;
          }
          if (call.status === 'ended' || call.status === 'missed') {
            cleanupMediaAndPeer();
            return;
          }
          if (call.status === 'accepted' && call.answer?.sdp && !answerSetRef.current) {
            answerSetRef.current = true;
            stopRingtone.current?.();
            setPhase('connected');
            try {
              await pc.setRemoteDescription(new RTCSessionDescription({ type: 'answer', sdp: call.answer.sdp }));
              await flushPendingIce(pc);
            } catch { /* ignore */ }
          }
        });
      } catch (err: any) {
        onNotify(err?.message || 'تعذّر بدء المكالمة الآن', false);
        cleanupMediaAndPeer();
      }
    };

    void startOutgoing();
    return () => { cancelled = true; };
  }, [outgoingRequest]);

  // Handle incoming call notification when idle
  useEffect(() => {
    if (!incomingCall) {
      if (phaseRef.current === 'ringing') {
        cleanupMediaAndPeer();
      }
      return;
    }
    if (phaseRef.current !== 'idle') return;
    setActiveCallId(incomingCall.id);
    setPeerName(incomingCall.caller_name);
    setCallType(incomingCall.call_type);
    setPhase('ringing');
    startRingtone(true);
  }, [incomingCall?.id]);

  const acceptIncomingCall = async () => {
    if (!incomingCall) return;
    stopRingtone.current?.();
    if (!navigator.mediaDevices?.getUserMedia || typeof RTCPeerConnection === 'undefined') {
      onNotify('جهازك لا يدعم المكالمات المباشرة', false);
      await api.updateCallStatus(incomingCall.id, 'rejected');
      onClearIncoming();
      cleanupMediaAndPeer();
      return;
    }

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: incomingCall.call_type === 'video' ? { facingMode: 'user' } : false,
      });
    } catch {
      onNotify('يرجى السماح بالمايكروفون والكاميرا للرد على المكالمة', false);
      return;
    }

    localStreamRef.current = stream;
    if (localVideoRef.current) localVideoRef.current.srcObject = stream;

    try {
      const pc = setupPeerConnection(incomingCall.id, stream);
      await pc.setRemoteDescription(
        new RTCSessionDescription({ type: 'offer', sdp: incomingCall.offer.sdp }),
      );
      await flushPendingIce(pc);

      const answerDesc = await pc.createAnswer();
      await pc.setLocalDescription(answerDesc);
      await api.acceptCallWithAnswer(incomingCall.id, {
        type: answerDesc.type,
        sdp: answerDesc.sdp || '',
      });

      setPhase('connected');

      candUnsubRef.current = api.subscribeCallCandidates(incomingCall.id, currentUserId, async cand => {
        if (pc.remoteDescription) {
          try { await pc.addIceCandidate(new RTCIceCandidate(cand)); } catch { /* ignore */ }
        } else {
          pendingIceRef.current.push(cand);
        }
      });

      callUnsubRef.current = api.subscribeCallSession(incomingCall.id, call => {
        if (!call || call.status === 'ended' || call.status === 'rejected' || call.status === 'missed') {
          onClearIncoming();
          cleanupMediaAndPeer();
        }
      });
    } catch (err: any) {
      onNotify(err?.message || 'تعذّر قبول المكالمة', false);
      await api.updateCallStatus(incomingCall.id, 'ended');
      onClearIncoming();
      cleanupMediaAndPeer();
    }
  };

  const rejectIncomingCall = async () => {
    const id = activeCallIdRef.current || incomingCall?.id;
    stopRingtone.current?.();
    if (id) await api.updateCallStatus(id, 'rejected');
    onClearIncoming();
    cleanupMediaAndPeer();
  };

  const hangup = async () => {
    const id = activeCallIdRef.current;
    const status = phaseRef.current === 'calling' ? 'missed' : 'ended';
    cleanupMediaAndPeer();
    onClearIncoming();
    if (id) await api.updateCallStatus(id, status);
  };

  const toggleMute = () => {
    const stream = localStreamRef.current;
    if (!stream) return;
    const nextMuted = !muted;
    stream.getAudioTracks().forEach(t => { t.enabled = !nextMuted; });
    setMuted(nextMuted);
  };

  const toggleCam = () => {
    const stream = localStreamRef.current;
    if (!stream) return;
    const nextOff = !camOff;
    stream.getVideoTracks().forEach(t => { t.enabled = !nextOff; });
    setCamOff(nextOff);
  };

  const switchCamera = async () => {
    if (callType !== 'video' || !navigator.mediaDevices?.getUserMedia) return;
    const nextMode = facingMode === 'user' ? 'environment' : 'user';
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: nextMode }, audio: false });
      const newTrack = newStream.getVideoTracks()[0];
      if (!newTrack) return;
      const oldTracks = localStreamRef.current?.getVideoTracks() || [];
      oldTracks.forEach(t => {
        localStreamRef.current?.removeTrack(t);
        t.stop();
      });
      localStreamRef.current?.addTrack(newTrack);
      if (localVideoRef.current && localStreamRef.current) {
        localVideoRef.current.srcObject = localStreamRef.current;
      }
      const sender = pcRef.current?.getSenders().find(s => s.track?.kind === 'video');
      if (sender) await sender.replaceTrack(newTrack);
      setFacingMode(nextMode);
      setCamOff(false);
    } catch {
      onNotify('تعذّر تبديل الكاميرا على هذا الجهاز', false);
    }
  };

  if (phase === 'idle') return null;

  const mm = String(Math.floor(elapsedSec / 60)).padStart(2, '0');
  const ss = String(elapsedSec % 60).padStart(2, '0');

  if (minimized && phase !== 'ringing') {
    return (
      <div
        className="fixed bottom-20 md:bottom-6 left-4 z-[85] bg-[#0f233a] text-white rounded-2xl shadow-2xl border border-slate-700 px-4 py-3 flex items-center gap-3 animate-in fade-in"
        dir="rtl"
      >
        <audio ref={remoteAudioRef} autoPlay playsInline className="hidden" />
        <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
          {callType === 'video' ? <Video className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
        </div>
        <div className="text-xs min-w-0">
          <p className="font-black truncate max-w-[140px]">{peerName}</p>
          <p className="text-[11px] text-sky-300 font-mono tabular-nums">
            {phase === 'connected' ? `${mm}:${ss}` : 'جاري الرنين...'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setMinimized(false)}
          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 cursor-pointer"
          title="تكبير شاشة المكالمة"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => void hangup()}
          className="p-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white cursor-pointer"
          title="إنهاء المكالمة"
        >
          <PhoneOff className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-[90] bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-4"
      dir="rtl"
    >
      <audio ref={remoteAudioRef} autoPlay playsInline className="hidden" />

      <div className="relative w-full max-w-2xl bg-[#0f233a] border border-slate-700/80 rounded-3xl overflow-hidden shadow-2xl text-white flex flex-col min-h-[420px] max-h-[88dvh]">
        {/* Top Bar */}
        <div className="px-5 py-4 flex items-center justify-between border-b border-white/10 z-10">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <div>
              <h3 className="font-black text-sm sm:text-base">{peerName}</h3>
              <p className="text-[11px] text-sky-300 font-bold">
                {phase === 'ringing'
                  ? callType === 'video' ? 'مكالمة فيديو واردة...' : 'مكالمة صوتية واردة...'
                  : phase === 'calling'
                    ? 'جاري الاتصال والرنين...'
                    : `متصل الآن · ${mm}:${ss}`}
              </p>
            </div>
          </div>

          {phase !== 'ringing' && (
            <button
              type="button"
              onClick={() => setMinimized(true)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              title="تصغير النافذة"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Media Stage */}
        <div className="relative flex-1 bg-slate-900 flex items-center justify-center overflow-hidden min-h-[260px]">
          {callType === 'video' && phase === 'connected' ? (
            <>
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              {!remoteHasVideo && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-slate-300 text-xs">
                  <Volume2 className="w-8 h-8 text-sky-400 animate-pulse" />
                  <span>بانتظار بث فيديو الطرف الآخر...</span>
                </div>
              )}
              <div className="absolute bottom-3 left-3 w-28 sm:w-36 aspect-[3/4] rounded-2xl overflow-hidden border-2 border-white/30 bg-slate-800 shadow-xl">
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''} ${camOff ? 'opacity-20' : ''}`}
                />
                {camOff && (
                  <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-slate-300">
                    الكاميرا متوقفة
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
              {callType === 'video' && phase === 'calling' && (
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-28 h-28 rounded-3xl object-cover border-2 border-sky-400/50 scale-x-[-1]"
                />
              )}
              {!(callType === 'video' && phase === 'calling') && (
                <div className="w-24 h-24 rounded-full bg-[#1677c7]/30 border-2 border-sky-400 flex items-center justify-center text-3xl font-black text-white shadow-lg">
                  {peerName.slice(0, 1) || 'ن'}
                </div>
              )}
              <div className="space-y-1">
                <p className="text-lg font-black">{peerName}</p>
                <p className="text-xs text-slate-300 flex items-center justify-center gap-1.5">
                  {phase === 'calling' && <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-400" />}
                  <span>
                    {phase === 'ringing'
                      ? 'يدعوك إلى مكالمة مباشرة عبر NEMVIA'
                      : phase === 'calling'
                        ? 'بانتظار رد الطرف الآخر...'
                        : 'مكالمة صوتية نشطة'}
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Controls */}
        <div className="px-6 py-5 bg-slate-950/70 border-t border-white/10 flex items-center justify-center gap-4">
          {phase === 'ringing' ? (
            <>
              <button
                type="button"
                onClick={() => void rejectIncomingCall()}
                className="min-h-[52px] px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <PhoneOff className="w-5 h-5" />
                <span>رفض</span>
              </button>
              <button
                type="button"
                onClick={() => void acceptIncomingCall()}
                className="min-h-[52px] px-7 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-lg animate-pulse"
              >
                {callType === 'video' ? <Video className="w-5 h-5" /> : <Phone className="w-5 h-5" />}
                <span>قبول والرد</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={toggleMute}
                className={`min-h-[48px] min-w-[48px] p-3.5 rounded-2xl transition-colors cursor-pointer ${
                  muted ? 'bg-amber-500 text-white' : 'bg-white/15 hover:bg-white/25 text-white'
                }`}
                title={muted ? 'تشغيل المايكروفون' : 'كتم المايكروفون'}
              >
                {muted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              {callType === 'video' && (
                <>
                  <button
                    type="button"
                    onClick={toggleCam}
                    className={`min-h-[48px] min-w-[48px] p-3.5 rounded-2xl transition-colors cursor-pointer ${
                      camOff ? 'bg-amber-500 text-white' : 'bg-white/15 hover:bg-white/25 text-white'
                    }`}
                    title={camOff ? 'تشغيل الكاميرا' : 'إيقاف الكاميرا'}
                  >
                    {camOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => void switchCamera()}
                    className="min-h-[48px] min-w-[48px] p-3.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white transition-colors cursor-pointer"
                    title="تبديل الكاميرا (أمامية / خلفية)"
                  >
                    <SwitchCamera className="w-5 h-5" />
                  </button>
                </>
              )}

              <button
                type="button"
                onClick={() => void hangup()}
                className="min-h-[48px] px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-lg"
                title="إنهاء المكالمة"
              >
                <PhoneOff className="w-5 h-5" />
                <span>إنهاء</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
