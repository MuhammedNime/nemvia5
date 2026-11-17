import { r as __toESM } from "./rolldown-runtime-SbdDWaPq.js";
import { At as FolderLock, Ft as FileText, G as Phone, J as PenTool, M as Send, Mt as Flag, N as Search, O as ShieldCheck, S as Square, U as Plus, Vt as Download, Wt as CodeXml, Z as Paperclip, a as Volume2, an as Check, at as MessageSquare, bt as Image, c as Users, l as User, n as X, nn as ChevronRight, o as Video, on as CheckCheck, rt as Mic, sn as ChartNoAxesColumn, v as Trash2, wn as require_react, wt as Headphones } from "./icons-Ba0nzYf3.js";
import { b as subscribePolls, v as subscribeChatPresence, x as updateChatPresence } from "./index-Bhmlh-C3.js";
import { t as WhiteboardModal } from "./WhiteboardModal-D6jPSttl.js";
import { n as PollComposerModal, t as PollCard } from "./PollCard-hWJwowzh.js";
import { t as require_jsx_runtime } from "./react-vendor-Dpw1FlJl.js";
// src/components/views/MessagesView.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
function formatThreadTime(iso) {
	if (!iso) return "";
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return "";
	const now = /* @__PURE__ */ new Date();
	if (d.toDateString() === now.toDateString()) return d.toLocaleTimeString("ar", {
		hour: "2-digit",
		minute: "2-digit"
	});
	return d.toLocaleDateString("ar", {
		day: "numeric",
		month: "short"
	});
}
function formatDayLabel(iso) {
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return "";
	const now = /* @__PURE__ */ new Date();
	const yesterday = new Date(now);
	yesterday.setDate(now.getDate() - 1);
	if (d.toDateString() === now.toDateString()) return "اليوم";
	if (d.toDateString() === yesterday.toDateString()) return "أمس";
	return d.toLocaleDateString("ar", {
		weekday: "short",
		day: "numeric",
		month: "long"
	});
}
var MessagesView = ({ currentUserId, currentUserName, currentRole, messages, onSendMessage, groups, contacts: contactProps, onCreateGroup, onSearchContacts, onUpload, onReport, onMarkRead, initialPeerId, onClearInitialPeer, onStartCall }) => {
	const [activeTargetId, setActiveTargetId] = (0, import_react.useState)(initialPeerId || groups[0]?.id || "");
	const [activeTargetType, setActiveTargetType] = (0, import_react.useState)(initialPeerId ? "dm" : groups.length ? "group" : "dm");
	const [mobilePane, setMobilePane] = (0, import_react.useState)(initialPeerId ? "chat" : "list");
	const [listFilter, setListFilter] = (0, import_react.useState)("all");
	(0, import_react.useEffect)(() => {
		if (initialPeerId) {
			setActiveTargetType("dm");
			setActiveTargetId(initialPeerId);
			setMobilePane("chat");
			onClearInitialPeer?.();
		}
	}, [initialPeerId, onClearInitialPeer]);
	const [contactQuery, setContactQuery] = (0, import_react.useState)("");
	const [searchResults, setSearchResults] = (0, import_react.useState)(null);
	const [uploading, setUploading] = (0, import_react.useState)(false);
	const [showFilesVault, setShowFilesVault] = (0, import_react.useState)(false);
	const [vaultFilter, setVaultFilter] = (0, import_react.useState)("all");
	const [vaultSearch, setVaultSearch] = (0, import_react.useState)("");
	const [inputText, setInputText] = (0, import_react.useState)("");
	const [pendingFile, setPendingFile] = (0, import_react.useState)(null);
	const fileInputRef = (0, import_react.useRef)(null);
	const messagesEndRef = (0, import_react.useRef)(null);
	const [isRecording, setIsRecording] = (0, import_react.useState)(false);
	const [recordSeconds, setRecordSeconds] = (0, import_react.useState)(0);
	const [recordErr, setRecordErr] = (0, import_react.useState)(null);
	const mediaRecorderRef = (0, import_react.useRef)(null);
	const recordChunksRef = (0, import_react.useRef)([]);
	const recordTimerRef = (0, import_react.useRef)(void 0);
	const recordCancelledRef = (0, import_react.useRef)(false);
	const [whiteboardOpen, setWhiteboardOpen] = (0, import_react.useState)(false);
	const [presenceMap, setPresenceMap] = (0, import_react.useState)({});
	const typingTimerRef = (0, import_react.useRef)(void 0);
	const lastTypingPingRef = (0, import_react.useRef)(0);
	const [groupPolls, setGroupPolls] = (0, import_react.useState)([]);
	const [showPollModal, setShowPollModal] = (0, import_react.useState)(false);
	const [showGroupPollsStrip, setShowGroupPollsStrip] = (0, import_react.useState)(true);
	const [studyRoomGroup, setStudyRoomGroup] = (0, import_react.useState)(null);
	const [showNewGroupModal, setShowNewGroupModal] = (0, import_react.useState)(false);
	const [newGroupName, setNewGroupName] = (0, import_react.useState)("");
	const [newGroupDesc, setNewGroupDesc] = (0, import_react.useState)("");
	const roleLabel = (r) => r === "teacher" ? "معلم" : r === "admin" ? "الإدارة" : "طالب";
	(0, import_react.useEffect)(() => {
		return subscribeChatPresence(setPresenceMap);
	}, []);
	(0, import_react.useEffect)(() => {
		if (activeTargetType !== "group" || !activeTargetId) {
			setGroupPolls([]);
			return;
		}
		return subscribePolls("class", activeTargetId, setGroupPolls);
	}, [activeTargetType, activeTargetId]);
	(0, import_react.useEffect)(() => {
		return () => {
			window.clearTimeout(typingTimerRef.current);
			if (currentUserId) updateChatPresence(currentUserId, {
				is_online: true,
				typing_to: ""
			});
		};
	}, [currentUserId]);
	const isUserOnline = (uid) => {
		const p = presenceMap[uid];
		if (!p?.is_online || !p.updated_at) return false;
		return Date.now() - new Date(p.updated_at).getTime() < 3e5;
	};
	const isTypingToMe = (uid) => {
		const p = presenceMap[uid];
		if (!p || p.typing_to !== currentUserId || !p.updated_at) return false;
		return Date.now() - new Date(p.updated_at).getTime() < 12e3;
	};
	const notifyTyping = (nextValue) => {
		setInputText(nextValue);
		if (!currentUserId || activeTargetType !== "dm" || !activeTargetId) return;
		window.clearTimeout(typingTimerRef.current);
		if (!nextValue.trim()) {
			lastTypingPingRef.current = 0;
			updateChatPresence(currentUserId, {
				is_online: true,
				typing_to: ""
			});
			return;
		}
		const now = Date.now();
		if (now - lastTypingPingRef.current > 1600) {
			lastTypingPingRef.current = now;
			updateChatPresence(currentUserId, {
				is_online: true,
				typing_to: activeTargetId
			});
		}
		typingTimerRef.current = window.setTimeout(() => {
			lastTypingPingRef.current = 0;
			updateChatPresence(currentUserId, {
				is_online: true,
				typing_to: ""
			});
		}, 2600);
	};
	(0, import_react.useEffect)(() => {
		if (!contactQuery.trim()) {
			setSearchResults(null);
			return;
		}
		const t = setTimeout(async () => setSearchResults(await onSearchContacts(contactQuery)), 280);
		return () => clearTimeout(t);
	}, [contactQuery, onSearchContacts]);
	const mergedContacts = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		contactProps.forEach((c) => map.set(c.id, c));
		messages.forEach((m) => {
			if (m.channel_id) return;
			const otherId = m.sender_id === currentUserId ? m.recipient_id : m.sender_id;
			const otherName = m.sender_id === currentUserId ? m.recipient_name : m.sender_name;
			const otherRole = m.sender_id === currentUserId ? "student" : m.sender_role;
			if (otherId && !map.has(otherId)) map.set(otherId, {
				id: otherId,
				name: otherName || "مستخدم",
				role: otherRole || "student"
			});
		});
		return searchResults ?? Array.from(map.values());
	}, [
		contactProps,
		messages,
		currentUserId,
		searchResults
	]);
	const threads = (0, import_react.useMemo)(() => {
		const q = contactQuery.trim().toLowerCase();
		const groupThreads = groups.filter((g) => !q || g.title.toLowerCase().includes(q) || (g.subject || "").toLowerCase().includes(q)).map((c) => {
			const grpMsgs = messages.filter((m) => m.channel_id === c.id || m.recipient_id === c.id);
			const lastMessage = grpMsgs[grpMsgs.length - 1];
			const lastTimestamp = lastMessage ? new Date(lastMessage.created_at).getTime() : 0;
			return {
				id: c.id,
				type: "group",
				title: c.title,
				subtitle: c.class_type === "study" ? "مجموعة دراسة" : `صف · ${c.members_count} عضو`,
				avatarText: c.class_type === "study" ? "📚" : "🎓",
				membersCount: c.members_count,
				unreadCount: 0,
				lastMessage,
				lastTimestamp
			};
		});
		const dmThreads = mergedContacts.filter((c) => c.id !== currentUserId).filter((c) => !q || c.name.toLowerCase().includes(q)).map((c) => {
			const dmMsgs = messages.filter((m) => !m.channel_id && (m.sender_id === currentUserId && m.recipient_id === c.id || m.sender_id === c.id && m.recipient_id === currentUserId));
			const lastMessage = dmMsgs[dmMsgs.length - 1];
			const lastTimestamp = lastMessage ? new Date(lastMessage.created_at).getTime() : 0;
			const unreadCount = dmMsgs.filter((m) => m.sender_id === c.id && m.recipient_id === currentUserId && !m.read_at).length;
			return {
				id: c.id,
				type: "dm",
				title: c.name,
				subtitle: roleLabel(c.role),
				avatarText: c.name.slice(0, 1),
				unreadCount,
				lastMessage,
				lastTimestamp
			};
		});
		return (listFilter === "group" ? groupThreads : listFilter === "dm" ? dmThreads : [...dmThreads, ...groupThreads]).sort((a, b) => {
			if (b.unreadCount !== a.unreadCount) return b.unreadCount - a.unreadCount;
			if (b.lastTimestamp !== a.lastTimestamp) return b.lastTimestamp - a.lastTimestamp;
			return a.title.localeCompare(b.title, "ar");
		});
	}, [
		groups,
		mergedContacts,
		messages,
		currentUserId,
		contactQuery,
		listFilter
	]);
	const activeThread = (0, import_react.useMemo)(() => threads.find((t) => t.id === activeTargetId && t.type === activeTargetType) || (activeTargetType === "group" ? groups.find((g) => g.id === activeTargetId) ? {
		id: activeTargetId,
		type: "group",
		title: groups.find((g) => g.id === activeTargetId).title,
		subtitle: `${groups.find((g) => g.id === activeTargetId).members_count} عضواً`,
		avatarText: "🎓",
		unreadCount: 0,
		lastTimestamp: 0
	} : null : mergedContacts.find((c) => c.id === activeTargetId) ? {
		id: activeTargetId,
		type: "dm",
		title: mergedContacts.find((c) => c.id === activeTargetId).name,
		subtitle: roleLabel(mergedContacts.find((c) => c.id === activeTargetId).role),
		avatarText: mergedContacts.find((c) => c.id === activeTargetId).name.slice(0, 1),
		unreadCount: 0,
		lastTimestamp: 0
	} : null), [
		threads,
		activeTargetId,
		activeTargetType,
		groups,
		mergedContacts
	]);
	(0, import_react.useEffect)(() => {
		if (!activeTargetId && threads.length > 0) {
			setActiveTargetId(threads[0].id);
			setActiveTargetType(threads[0].type);
		}
	}, [activeTargetId, threads]);
	const activeTitle = activeThread?.title || "اختر محادثة";
	const activeSubtitle = activeThread?.subtitle || "ابدأ التواصل مع معلميك وزملائك";
	const unreadIds = (0, import_react.useMemo)(() => activeTargetType === "dm" && activeTargetId && (mobilePane === "chat" || typeof window !== "undefined" && window.innerWidth >= 768) ? messages.filter((m) => !m.channel_id && m.sender_id === activeTargetId && m.recipient_id === currentUserId && !m.read_at).map((m) => m.id) : [], [
		messages,
		activeTargetType,
		activeTargetId,
		currentUserId,
		mobilePane
	]);
	(0, import_react.useEffect)(() => {
		if (unreadIds.length) onMarkRead(unreadIds);
	}, [unreadIds.join(",")]);
	const currentMessages = (0, import_react.useMemo)(() => messages.filter((m) => {
		if (!activeTargetId) return false;
		if (activeTargetType === "group") return m.channel_id === activeTargetId || m.recipient_id === activeTargetId;
		return !m.channel_id && (m.sender_id === currentUserId && m.recipient_id === activeTargetId || m.sender_id === activeTargetId && m.recipient_id === currentUserId);
	}), [
		messages,
		activeTargetId,
		activeTargetType,
		currentUserId
	]);
	(0, import_react.useEffect)(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [
		activeTargetId,
		activeTargetType,
		currentMessages.length,
		mobilePane
	]);
	const conversationFiles = currentMessages.filter((m) => Boolean(m.attachment)).map((m) => m.attachment);
	const filteredVaultFiles = conversationFiles.filter((f) => {
		if (vaultFilter !== "all" && f.type !== vaultFilter) return false;
		if (vaultSearch.trim() && !f.name.toLowerCase().includes(vaultSearch.toLowerCase())) return false;
		return true;
	});
	const totalUnread = (0, import_react.useMemo)(() => messages.filter((m) => !m.channel_id && m.recipient_id === currentUserId && !m.read_at).length, [messages, currentUserId]);
	const openThread = (thread) => {
		setActiveTargetId(thread.id);
		setActiveTargetType(thread.type);
		setShowFilesVault(false);
		setMobilePane("chat");
	};
	const handleFileSelect = async (e) => {
		const file = e.target.files?.[0];
		e.target.value = "";
		if (!file) return;
		await attachUploadedFile(file);
	};
	const attachUploadedFile = async (file) => {
		setUploading(true);
		try {
			const up = await onUpload(file, "chat");
			setPendingFile({
				id: `att-${Date.now()}`,
				name: up.name,
				size: up.size,
				type: up.type,
				url: up.url,
				uploaded_by: currentUserName,
				uploaded_at: (/* @__PURE__ */ new Date()).toISOString()
			});
		} catch {}
		setUploading(false);
	};
	const startVoiceRecording = async () => {
		setRecordErr(null);
		if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
			setRecordErr("تسجيل الصوت غير مدعوم على هذا المتصفح.");
			return;
		}
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus") ? "audio/webm;codecs=opus" : MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : MediaRecorder.isTypeSupported("audio/mp4") ? "audio/mp4" : "";
			const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
			recordChunksRef.current = [];
			recordCancelledRef.current = false;
			mediaRecorderRef.current = recorder;
			recorder.ondataavailable = (ev) => {
				if (ev.data && ev.data.size > 0) recordChunksRef.current.push(ev.data);
			};
			recorder.onstop = async () => {
				stream.getTracks().forEach((t) => t.stop());
				if (recordTimerRef.current) window.clearInterval(recordTimerRef.current);
				setIsRecording(false);
				const dur = recordSeconds;
				setRecordSeconds(0);
				if (recordCancelledRef.current || recordChunksRef.current.length === 0) return;
				const actualType = recorder.mimeType || "audio/webm";
				const ext = actualType.includes("mp4") ? "m4a" : actualType.includes("ogg") ? "ogg" : "webm";
				const blob = new Blob(recordChunksRef.current, { type: actualType });
				const voiceFile = new File([blob], `voice-${Date.now()}.${ext}`, { type: actualType });
				setUploading(true);
				try {
					const up = await onUpload(voiceFile, "chat");
					if (activeTargetId) onSendMessage({
						id: `msg-${Date.now()}`,
						sender_id: currentUserId,
						sender_name: currentUserName,
						sender_role: currentRole,
						recipient_id: activeTargetId,
						recipient_name: activeTitle,
						channel_id: activeTargetType === "group" ? activeTargetId : void 0,
						body: `🎤 رسالة صوتية${dur > 0 ? ` (${dur} ث)` : ""}`,
						attachment: {
							id: `att-${Date.now()}`,
							name: up.name,
							size: up.size,
							type: "audio",
							url: up.url,
							uploaded_by: currentUserName,
							uploaded_at: (/* @__PURE__ */ new Date()).toISOString()
						},
						reactions: {},
						created_at: (/* @__PURE__ */ new Date()).toISOString()
					});
				} catch {
					setRecordErr("تعذّر رفع الرسالة الصوتية.");
				} finally {
					setUploading(false);
				}
			};
			recorder.start();
			setIsRecording(true);
			setRecordSeconds(0);
			recordTimerRef.current = window.setInterval(() => setRecordSeconds((s) => s + 1), 1e3);
		} catch {
			setRecordErr("يرجى السماح بصلاحية المايكروفون لتسجيل الرسائل الصوتية.");
		}
	};
	const stopVoiceRecording = (cancel = false) => {
		recordCancelledRef.current = cancel;
		if (recordTimerRef.current) window.clearInterval(recordTimerRef.current);
		const rec = mediaRecorderRef.current;
		if (rec && rec.state !== "inactive") rec.stop();
		else {
			setIsRecording(false);
			setRecordSeconds(0);
		}
	};
	const handleSend = (e) => {
		e.preventDefault();
		if (!activeTargetId) return;
		if (!inputText.trim() && !pendingFile) return;
		onSendMessage({
			id: `msg-${Date.now()}`,
			sender_id: currentUserId,
			sender_name: currentUserName,
			sender_role: currentRole,
			recipient_id: activeTargetId,
			recipient_name: activeTitle,
			channel_id: activeTargetType === "group" ? activeTargetId : void 0,
			body: inputText.trim() || (pendingFile ? `أرفق ملفاً: ${pendingFile.name}` : ""),
			attachment: pendingFile || void 0,
			reactions: {},
			created_at: (/* @__PURE__ */ new Date()).toISOString()
		});
		setInputText("");
		setPendingFile(null);
		window.clearTimeout(typingTimerRef.current);
		lastTypingPingRef.current = 0;
		if (activeTargetType === "dm") updateChatPresence(currentUserId, {
			is_online: true,
			typing_to: ""
		});
	};
	const handleCreateGroup = (e) => {
		e.preventDefault();
		if (!newGroupName.trim()) return;
		onCreateGroup({
			id: "new",
			teacher_id: currentUserId,
			teacher_name: currentUserName,
			title: newGroupName.trim(),
			subject: "",
			grade_level: "",
			join_code: "",
			class_type: "study",
			is_archived: false,
			members_count: 1,
			description: newGroupDesc.trim() || "مجموعة دراسية نشطة لمشاركة الأفكار والملفات.",
			colorTheme: "blue",
			created_at: (/* @__PURE__ */ new Date()).toISOString()
		});
		setShowNewGroupModal(false);
		setNewGroupName("");
		setNewGroupDesc("");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "animate-in fade-in",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white rounded-3xl border border-slate-200 overflow-hidden flex flex-col md:flex-row h-[calc(100dvh-10.5rem)] md:h-[calc(100dvh-7.5rem)] min-h-[500px]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
						className: `${mobilePane === "list" ? "flex" : "hidden md:flex"} w-full md:w-80 lg:w-96 md:border-l border-slate-200 bg-white flex-col shrink-0 min-h-0 flex-1 md:flex-initial`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4 border-b border-slate-200 space-y-3 shrink-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
											className: "font-black text-slate-900 text-base whitespace-nowrap",
											children: "المحادثات"
										}), totalUnread > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "px-2 py-0.5 rounded-full bg-rose-600 text-white text-[11px] font-black tabular-nums",
											children: totalUnread
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => setShowNewGroupModal(true),
										className: "min-h-[38px] px-3 py-1.5 bg-[#1677c7] hover:bg-[#125fa0] text-white font-bold rounded-xl text-xs inline-flex items-center gap-1 cursor-pointer transition-colors whitespace-nowrap shrink-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "مجموعة جديدة" })]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										value: contactQuery,
										onChange: (e) => setContactQuery(e.target.value),
										placeholder: "ابحث عن شخص أو مجموعة...",
										className: "w-full pr-9 pl-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#1677c7]"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold",
									children: [
										{
											id: "all",
											label: "الكل"
										},
										{
											id: "dm",
											label: "الأفراد"
										},
										{
											id: "group",
											label: "المجموعات"
										}
									].map((tab) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setListFilter(tab.id),
										className: `min-h-[36px] py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${listFilter === tab.id ? "bg-white text-[#1677c7] shadow-2xs" : "text-slate-600 hover:text-slate-900"}`,
										children: tab.label
									}, tab.id))
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex-1 overflow-y-auto divide-y divide-slate-100",
							children: threads.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-8 text-center space-y-2 text-slate-400 text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "w-8 h-8 mx-auto text-slate-300" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-bold text-slate-600",
										children: "لا توجد محادثات مطابقة"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "جرّب البحث باسم آخر أو أنشئ مجموعة دراسة جديدة." })
								]
							}) : threads.map((thread) => {
								const isSelected = activeTargetId === thread.id && activeTargetType === thread.type;
								const online = thread.type === "dm" && isUserOnline(thread.id);
								const typing = thread.type === "dm" && isTypingToMe(thread.id);
								const previewText = typing ? "يكتب الآن..." : thread.lastMessage ? thread.lastMessage.sender_id === currentUserId ? `أنت: ${thread.lastMessage.body}` : thread.type === "group" ? `${thread.lastMessage.sender_name}: ${thread.lastMessage.body}` : thread.lastMessage.body : thread.subtitle;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => openThread(thread),
									className: `w-full min-h-[68px] px-4 py-3 text-right transition-colors flex items-center gap-3 cursor-pointer ${isSelected ? "bg-sky-50 md:border-r-2 md:border-r-[#1677c7]" : "hover:bg-slate-50"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative shrink-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: `w-11 h-11 rounded-2xl flex items-center justify-center font-black text-sm ${thread.type === "group" ? "bg-sky-50 border border-sky-200 text-lg" : "bg-[#0f233a] text-white"}`,
											children: thread.avatarText
										}), online && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "absolute -bottom-0.5 -left-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white",
											title: "متصل الآن"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex-1 space-y-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: `text-xs sm:text-sm truncate ${thread.unreadCount > 0 ? "font-black text-slate-900" : "font-bold text-slate-800"}`,
												children: thread.title
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] text-slate-400 shrink-0 tabular-nums",
												children: formatThreadTime(thread.lastMessage?.created_at)
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: `text-xs truncate ${typing ? "font-black text-emerald-600" : thread.unreadCount > 0 ? "font-bold text-slate-700" : "text-slate-500"}`,
												children: previewText
											}), thread.unreadCount > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "min-w-5 h-5 px-1.5 rounded-full bg-rose-600 text-white text-[10px] font-black flex items-center justify-center shrink-0 tabular-nums",
												children: thread.unreadCount
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] text-slate-400 shrink-0",
												children: thread.type === "group" ? "مجموعة" : online ? "متصل" : "فردي"
											})]
										})]
									})]
								}, `${thread.type}:${thread.id}`);
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: `${mobilePane === "chat" ? "flex" : "hidden md:flex"} flex-1 flex-col min-w-0 min-h-0 bg-slate-50/40 relative`,
						children: !activeThread ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1 flex flex-col items-center justify-center text-center p-8 space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-14 h-14 rounded-2xl bg-sky-50 text-[#1677c7] flex items-center justify-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "w-7 h-7" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-black text-slate-900 text-base",
									children: "اختر محادثة أو مجموعة للبدء"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-slate-500 max-w-xs",
									children: "اضغط على أي اسم أو مجموعة من القائمة لفتح سجل الرسائل والملفات الخاصة بها."
								})]
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "px-3 sm:px-5 py-3 border-b border-slate-200 bg-white flex items-center justify-between gap-2 shrink-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2.5 min-w-0",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => {
												setShowFilesVault(false);
												setMobilePane("list");
											},
											className: "md:hidden min-h-[44px] min-w-[44px] -mr-1 rounded-xl hover:bg-slate-100 text-slate-700 flex items-center justify-center cursor-pointer shrink-0",
											"aria-label": "العودة للمحادثات",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-5 h-5" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "relative shrink-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: `w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm ${activeThread.type === "group" ? "bg-sky-50 border border-sky-200 text-lg" : "bg-[#0f233a] text-white"}`,
												children: activeThread.avatarText
											}), activeThread.type === "dm" && isUserOnline(activeThread.id) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute -bottom-0.5 -left-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
												className: "font-black text-slate-900 text-sm truncate",
												children: activeTitle
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: `text-[11px] truncate ${activeThread.type === "dm" && isTypingToMe(activeThread.id) ? "text-emerald-600 font-black" : activeThread.type === "dm" && isUserOnline(activeThread.id) ? "text-emerald-700 font-bold" : "text-slate-500"}`,
												children: activeThread.type === "dm" ? isTypingToMe(activeThread.id) ? "يكتب الآن..." : isUserOnline(activeThread.id) ? `${activeSubtitle} · متصل الآن` : activeSubtitle : activeSubtitle
											})]
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5 shrink-0",
									children: [
										activeThread.type === "dm" && onStartCall && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => onStartCall(activeThread.id, activeThread.title, "audio"),
											className: "min-h-[40px] min-w-[40px] px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors",
											title: "مكالمة صوتية مباشرة",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "hidden lg:inline",
												children: "اتصال"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => onStartCall(activeThread.id, activeThread.title, "video"),
											className: "min-h-[40px] min-w-[40px] px-2.5 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-[#1677c7] font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors",
											title: "مكالمة فيديو مباشرة",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "hidden lg:inline",
												children: "فيديو"
											})]
										})] }),
										activeThread.type === "group" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => setStudyRoomGroup({
												id: activeThread.id,
												title: activeThread.title
											}),
											className: "min-h-[40px] px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors",
											title: "فتح غرفة مذاكرة صوتية جماعية",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Headphones, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "hidden lg:inline",
												children: "غرفة دراسة"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => setShowPollModal(true),
											className: "min-h-[40px] px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors",
											title: "إنشاء استطلاع رأي للمجموعة",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartNoAxesColumn, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "hidden lg:inline",
												children: "استطلاع"
											})]
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => setWhiteboardOpen(true),
											className: "min-h-[40px] px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors",
											title: "رسم على السبورة وإرسالها",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenTool, { className: "w-4 h-4 text-[#1677c7]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "hidden xl:inline",
												children: "سبورة"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => setShowFilesVault((v) => !v),
											className: `min-h-[40px] px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${showFilesVault ? "bg-[#1677c7] text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-700"}`,
											title: "عرض الملفات المتبادلة في هذه المحادثة",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderLock, { className: "w-4 h-4" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "hidden sm:inline",
													children: "خزينة الملفات"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "tabular-nums",
													children: [
														"(",
														conversationFiles.length,
														")"
													]
												})
											]
										})
									]
								})]
							}),
							activeThread.type === "group" && groupPolls.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "px-3 sm:px-5 py-2.5 bg-sky-50/60 border-b border-sky-100 shrink-0 space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between text-[11px] font-black text-[#0f233a]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartNoAxesColumn, { className: "w-3.5 h-3.5 text-[#1677c7]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											"تصويتات المجموعة (",
											groupPolls.length,
											")"
										] })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setShowGroupPollsStrip((v) => !v),
										className: "text-[#1677c7] hover:underline cursor-pointer",
										children: showGroupPollsStrip ? "إخفاء" : "عرض"
									})]
								}), showGroupPollsStrip && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-1 lg:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto",
									children: groupPolls.map((poll) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PollCard, {
										poll,
										currentUserId,
										currentRole,
										compact: true
									}, poll.id))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1 overflow-y-auto p-3 sm:p-5 space-y-3 min-h-0",
								children: [currentMessages.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "h-full flex flex-col items-center justify-center text-center p-6 space-y-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "w-12 h-12 rounded-2xl bg-sky-50 text-[#1677c7] flex items-center justify-center",
											children: activeThread.type === "group" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "w-6 h-6" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "w-6 h-6" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
											className: "font-bold text-slate-800 text-sm",
											children: ["لا توجد رسائل بعد مع ", activeTitle]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-slate-500 max-w-xs",
											children: "اكتب رسالتك الأولى في الأسفل أو أرفق ملفاً لمشاركته فوراً."
										})
									]
								}) : currentMessages.map((msg, idx) => {
									const isMine = msg.sender_id === currentUserId;
									const isTeacher = msg.sender_role === "teacher";
									const isAdmin = msg.sender_role === "admin";
									const dayLbl = formatDayLabel(msg.created_at);
									const prevDayLbl = idx > 0 ? formatDayLabel(currentMessages[idx - 1].created_at) : "";
									const showDayDivider = idx === 0 || dayLbl !== prevDayLbl;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react.Fragment, { children: [showDayDivider && dayLbl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex justify-center py-1",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "px-3 py-0.5 rounded-full bg-white border border-slate-200 text-[10px] font-bold text-slate-500",
											children: dayLbl
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: `flex flex-col ${isMine ? "items-end mr-auto" : "items-start ml-auto"} space-y-1 max-w-[85%] sm:max-w-lg`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1.5 px-1 text-[11px]",
											children: [
												!isMine && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-bold text-slate-700",
													children: msg.sender_name
												}),
												!isMine && isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-indigo-700 text-[10px] font-bold inline-flex items-center gap-0.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "w-3 h-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "الإدارة" })]
												}),
												!isMine && isTeacher && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-amber-700 text-[10px] font-bold",
													children: "· معلم"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[10px] text-slate-400 font-mono tabular-nums",
													children: new Date(msg.created_at).toLocaleTimeString("ar", {
														hour: "2-digit",
														minute: "2-digit"
													})
												}),
												isMine && !msg.channel_id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: msg.read_at ? "text-[#1677c7]" : "text-slate-400",
													title: msg.read_at ? "تمت القراءة" : "تم الإرسال",
													children: msg.read_at ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckCheck, { className: "w-3.5 h-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-3.5 h-3.5" })
												}),
												!isMine && !msg.channel_id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: () => onReport({
														type: "message",
														id: msg.id,
														label: "رسالة",
														snapshot: msg.body.slice(0, 200)
													}),
													title: "إبلاغ عن الرسالة",
													className: "text-slate-400 hover:text-rose-600 cursor-pointer p-0.5",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flag, { className: "w-3 h-3" })
												})
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: `px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm space-y-2 leading-relaxed ${isMine ? "bg-[#1677c7] text-white rounded-tl-xs" : "bg-white border border-slate-200 text-slate-800 rounded-tr-xs"}`,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "whitespace-pre-wrap break-words",
												children: msg.body
											}), msg.attachment && (msg.attachment.type === "audio" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: `p-2 rounded-xl border space-y-1.5 ${isMine ? "bg-white/15 border-white/25 text-white" : "bg-slate-50 border-slate-200 text-slate-900"}`,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center justify-between gap-2 text-[11px] font-bold",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "inline-flex items-center gap-1",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "تسجيل صوتي" })]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
														href: msg.attachment.url,
														target: "_blank",
														rel: "noreferrer",
														download: msg.attachment.name,
														className: "opacity-80 hover:opacity-100",
														title: "تحميل الصوت",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "w-3.5 h-3.5" })
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("audio", {
													controls: true,
													preload: "metadata",
													src: msg.attachment.url,
													className: "w-56 sm:w-64 max-w-full h-9"
												})]
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-2",
												children: [msg.attachment.type === "image" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
													href: msg.attachment.url,
													target: "_blank",
													rel: "noreferrer",
													className: "block rounded-xl overflow-hidden border border-black/10 max-w-xs",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
														src: msg.attachment.url,
														alt: msg.attachment.name,
														className: "w-full max-h-56 object-cover",
														loading: "lazy"
													})
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: `p-2.5 rounded-xl border flex items-center justify-between gap-3 ${isMine ? "bg-white/10 border-white/20 text-white" : "bg-slate-50 border-slate-200 text-slate-900"}`,
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center gap-2 min-w-0",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "w-8 h-8 rounded-lg bg-sky-500/20 flex items-center justify-center shrink-0",
															children: [
																msg.attachment.type === "image" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "w-4 h-4 text-emerald-500" }),
																msg.attachment.type === "pdf" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "w-4 h-4 text-rose-500" }),
																msg.attachment.type === "code" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CodeXml, { className: "w-4 h-4 text-amber-500" }),
																msg.attachment.type === "doc" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "w-4 h-4 text-sky-500" })
															]
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "min-w-0",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "font-bold text-xs truncate block",
																children: msg.attachment.name
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "text-[10px] opacity-75 block",
																children: msg.attachment.size
															})]
														})]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
														href: msg.attachment.url,
														target: "_blank",
														rel: "noreferrer",
														download: msg.attachment.name,
														className: `p-2 rounded-lg transition-colors shrink-0 ${isMine ? "hover:bg-white/20 text-white" : "hover:bg-slate-200 text-[#1677c7]"}`,
														title: "تحميل / فتح الملف",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "w-4 h-4" })
													})]
												})]
											}))]
										})]
									})] }, msg.id);
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref: messagesEndRef })]
							}),
							pendingFile && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "px-4 py-2.5 bg-sky-50 border-t border-sky-200 flex items-center justify-between text-xs shrink-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 min-w-0",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "w-4 h-4 text-[#1677c7] shrink-0" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-bold text-slate-800 truncate",
											children: pendingFile.name
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-[10px] text-slate-500 shrink-0",
											children: [
												"(",
												pendingFile.size,
												")"
											]
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setPendingFile(null),
									className: "p-1.5 text-slate-500 hover:text-rose-600 cursor-pointer shrink-0",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
								})]
							}),
							recordErr && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "px-4 py-2 bg-rose-50 border-t border-rose-200 text-rose-700 text-xs font-bold flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: recordErr }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setRecordErr(null),
									className: "text-rose-500 cursor-pointer",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-3.5 h-3.5" })
								})]
							}),
							isRecording ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-2.5 sm:p-3.5 border-t border-rose-200 bg-rose-50 flex items-center justify-between gap-3 shrink-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2.5 text-xs font-black text-rose-700",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "جاري التسجيل الصوتي..." }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-mono tabular-nums",
											children: [
												String(Math.floor(recordSeconds / 60)).padStart(2, "0"),
												":",
												String(recordSeconds % 60).padStart(2, "0")
											]
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => stopVoiceRecording(true),
										className: "min-h-[40px] px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-rose-600 font-bold text-xs flex items-center gap-1 cursor-pointer",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "إلغاء" })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => stopVoiceRecording(false),
										className: "min-h-[40px] px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs flex items-center gap-1.5 cursor-pointer",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "w-3.5 h-3.5 fill-current" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "إرسال الصوت" })]
									})]
								})]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								onSubmit: handleSend,
								className: "p-2.5 sm:p-3.5 border-t border-slate-200 bg-white flex items-center gap-2 shrink-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "file",
										ref: fileInputRef,
										onChange: handleFileSelect,
										accept: "image/*,audio/*,.pdf,.doc,.docx,.txt,.ts,.js,.py",
										className: "hidden"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										disabled: uploading,
										onClick: () => fileInputRef.current?.click(),
										className: "min-h-[44px] min-w-[44px] rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-60 text-slate-600 flex items-center justify-center transition-colors cursor-pointer shrink-0",
										title: "إرفاق ملف أو صورة",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paperclip, { className: "w-4 h-4" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										disabled: uploading,
										onClick: () => void startVoiceRecording(),
										className: "min-h-[44px] min-w-[44px] rounded-xl bg-rose-50 hover:bg-rose-100 disabled:opacity-60 text-rose-600 flex items-center justify-center transition-colors cursor-pointer shrink-0",
										title: "تسجيل رسالة صوتية",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "w-4 h-4" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										value: inputText,
										onChange: (e) => notifyTyping(e.target.value),
										placeholder: `اكتب رسالتك إلى ${activeTitle}...`,
										className: "flex-1 min-h-[44px] px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm outline-none focus:border-[#1677c7]"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "submit",
										disabled: uploading || !inputText.trim() && !pendingFile,
										className: "min-h-[44px] px-4 bg-[#1677c7] hover:bg-[#125fa0] disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 whitespace-nowrap",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "hidden sm:inline",
											children: "إرسال"
										})]
									})
								]
							})
						] })
					}),
					showFilesVault && activeThread && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
						className: "fixed inset-0 z-50 md:static md:z-auto md:w-80 border-r border-slate-200 bg-white md:bg-slate-50 flex flex-col shrink-0 animate-in fade-in",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4 border-b border-slate-200 bg-white space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderLock, { className: "w-4 h-4 text-[#1677c7]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-black text-slate-900 text-xs",
											children: ["ملفات ", activeTitle]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setShowFilesVault(false),
										className: "min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										value: vaultSearch,
										onChange: (e) => setVaultSearch(e.target.value),
										placeholder: "بحث في الملفات...",
										className: "w-full pr-8 pl-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#1677c7]"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-[11px] font-bold",
									children: [
										{
											id: "all",
											label: "الكل"
										},
										{
											id: "pdf",
											label: "PDF"
										},
										{
											id: "image",
											label: "صور"
										},
										{
											id: "code",
											label: "كود"
										}
									].map((tab) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setVaultFilter(tab.id),
										className: `flex-1 py-1.5 rounded-lg transition-colors cursor-pointer ${vaultFilter === tab.id ? "bg-white text-[#1677c7] shadow-2xs" : "text-slate-500"}`,
										children: tab.label
									}, tab.id))
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex-1 overflow-y-auto p-3 space-y-2.5",
							children: filteredVaultFiles.length > 0 ? filteredVaultFiles.map((file) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3 bg-white rounded-2xl border border-slate-200 space-y-2 hover:border-[#1677c7] transition-colors",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "w-8 h-8 rounded-xl bg-sky-50 text-[#1677c7] flex items-center justify-center shrink-0",
											children: [
												file.type === "pdf" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "w-4 h-4 text-rose-500" }),
												file.type === "image" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "w-4 h-4 text-emerald-500" }),
												file.type === "audio" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "w-4 h-4 text-violet-600" }),
												file.type === "code" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CodeXml, { className: "w-4 h-4 text-amber-500" }),
												file.type === "doc" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "w-4 h-4 text-sky-500" })
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-bold text-xs text-slate-900 block truncate",
												title: file.name,
												children: file.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] text-slate-400 block font-mono",
												children: file.size
											})]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: file.url,
										target: "_blank",
										rel: "noreferrer",
										download: file.name,
										className: "p-2 bg-slate-100 hover:bg-[#1677c7] hover:text-white text-slate-600 rounded-lg transition-colors cursor-pointer shrink-0",
										title: "تحميل الملف",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "w-3.5 h-3.5" })
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: file.uploaded_by }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: new Date(file.uploaded_at).toLocaleDateString("ar") })]
								})]
							}, file.id)) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-center py-8 text-slate-400 text-xs space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderLock, { className: "w-8 h-8 mx-auto text-slate-300" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "لا توجد ملفات مطابقة في هذه المحادثة" })]
							})
						})]
					})
				]
			}),
			showNewGroupModal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4",
				onClick: () => setShowNewGroupModal(false),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4 text-xs animate-in zoom-in-95",
					onClick: (e) => e.stopPropagation(),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between pb-3 border-b border-slate-100",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-8 h-8 rounded-xl bg-sky-100 text-[#1677c7] flex items-center justify-center font-bold",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "w-4 h-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-bold text-slate-900 text-sm",
								children: "إنشاء مجموعة دراسية جديدة"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setShowNewGroupModal(false),
							className: "text-slate-400 hover:text-slate-600 cursor-pointer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleCreateGroup,
						className: "space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block font-bold text-slate-700 mb-1",
								children: "اسم المجموعة الدراسية:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: newGroupName,
								onChange: (e) => setNewGroupName(e.target.value),
								placeholder: "مثال: نادي الرياضيات المتقدمة، حلقة اللغة العربية...",
								className: "w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1677c7]",
								required: true
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block font-bold text-slate-700 mb-1",
								children: "وصف المجموعة والهدف منها:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								value: newGroupDesc,
								onChange: (e) => setNewGroupDesc(e.target.value),
								placeholder: "شرح بسيط لما ستناقشه هذه المجموعة وكيف ستساعد الطلاب...",
								className: "w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1677c7] min-h-[70px]"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "submit",
								className: "w-full min-h-[44px] py-2.5 bg-[#1677c7] hover:bg-[#125fa0] text-white font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "إنشاء وتفعيل المجموعة فوراً" })]
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WhiteboardModal, {
				open: whiteboardOpen,
				onClose: () => setWhiteboardOpen(false),
				title: `سبورة ${activeTitle}`,
				onSendImageToChat: async (file) => {
					await attachUploadedFile(file);
				}
			}),
			activeThread?.type === "group" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PollComposerModal, {
				open: showPollModal,
				scopeType: "class",
				scopeId: activeThread.id,
				creatorId: currentUserId,
				creatorName: currentUserName,
				onClose: () => setShowPollModal(false)
			}),
			studyRoomGroup && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-[72] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-6",
				onClick: () => setStudyRoomGroup(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-slate-900 rounded-3xl max-w-4xl w-full h-[80dvh] overflow-hidden border border-slate-700 shadow-2xl flex flex-col animate-in zoom-in-95",
					onClick: (e) => e.stopPropagation(),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-4 py-3 bg-[#0f233a] text-white flex items-center justify-between gap-3 border-b border-white/10",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2.5 min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Headphones, { className: "w-4 h-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
									className: "font-black text-xs sm:text-sm truncate",
									children: ["غرفة المذاكرة الصوتية: ", studyRoomGroup.title]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] text-slate-300 truncate",
									children: "صوت جماعي فوري مع زملاء الصف أو المجموعة"
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 shrink-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => {
									setStudyRoomGroup(null);
									setWhiteboardOpen(true);
								},
								className: "px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold inline-flex items-center gap-1 cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenTool, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "hidden sm:inline",
									children: "فتح السبورة"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setStudyRoomGroup(null),
								className: "px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer inline-flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "مغادرة" })]
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
						title: `غرفة مذاكرة ${studyRoomGroup.title}`,
						src: `https://meet.jit.si/nemvia-study-${encodeURIComponent(studyRoomGroup.id.replace(/[^a-zA-Z0-9_-]/g, ""))}#config.startWithVideoMuted=true&config.prejoinPageEnabled=false&userInfo.displayName=${encodeURIComponent(currentUserName)}`,
						allow: "camera; microphone; display-capture; fullscreen; autoplay",
						className: "flex-1 w-full border-0 bg-slate-950"
					})]
				})
			})
		]
	});
};
export { MessagesView };
