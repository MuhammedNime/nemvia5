import { r as __toESM } from "./rolldown-runtime-SbdDWaPq.js";
import { B as Paperclip, C as ShieldCheck, D as Send, G as MessageSquare, K as MessageCircle, M as Reply, Mt as ChevronLeft, N as RefreshCw, Nt as Check, O as Search, Q as LoaderCircle, R as PenLine, T as Share2, Vt as Bookmark, Yt as require_react, Z as Lock, c as UserPlus, ct as Globe, gt as FileText, jt as ChevronRight, l as UserCheck, m as Trash2, mt as Film, n as X, o as Users, pt as Flag, st as Heart, y as Sparkles } from "./icons-y6mUmdUg.js";
import { t as require_jsx_runtime } from "./react-vendor-CpCOhAWp.js";
// src/components/views/CommunityView.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var STORY_GRADIENTS = [
	{
		id: "blue",
		label: "أزرق أكاديمي",
		cls: "from-blue-900 via-indigo-900 to-slate-900"
	},
	{
		id: "purple",
		label: "بنفسجي",
		cls: "from-purple-900 via-pink-900 to-slate-900"
	},
	{
		id: "emerald",
		label: "أخضر زمردي",
		cls: "from-emerald-900 via-teal-900 to-slate-900"
	},
	{
		id: "amber",
		label: "ذهبي دافئ",
		cls: "from-amber-900 via-orange-900 to-slate-900"
	},
	{
		id: "cyan",
		label: "سماوي عميق",
		cls: "from-cyan-900 via-sky-900 to-slate-900"
	},
	{
		id: "rose",
		label: "وردي داكن",
		cls: "from-rose-900 via-red-900 to-slate-900"
	}
];
function formatRelativeTime(iso) {
	const diffSec = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1e3));
	if (diffSec < 60) return "الآن";
	const min = Math.floor(diffSec / 60);
	if (min < 60) return `منذ ${min} د`;
	const hrs = Math.floor(min / 60);
	if (hrs < 24) return `منذ ${hrs} س`;
	const days = Math.floor(hrs / 24);
	if (days < 7) return `منذ ${days} ي`;
	return new Date(iso).toLocaleDateString("ar", {
		day: "numeric",
		month: "short"
	});
}
function storyRemainingLabel(expiresAt) {
	return `متبقي ${Math.max(1, Math.ceil((new Date(expiresAt).getTime() - Date.now()) / 36e5))} س`;
}
var CommunityView = ({ currentRole, currentUserId, currentUserName, currentUserAvatar, posts, stories, contacts, followingIds, followerIds, followRequests, openReportsCount = 0, onAddPost, onUpdatePost, onDeletePost, onAddStory, onDeleteStory, onToggleLike, onAddComment, onDeleteComment, onFollowUser, onUnfollowUser, onCancelFollowRequest, onRespondFollowRequest, onStartChat, onNavigate, onRefresh, onUpload, onReport }) => {
	const [sectionTab, setSectionTab] = (0, import_react.useState)("feed");
	const [selectedCategory, setSelectedCategory] = (0, import_react.useState)("all");
	const [sortMode, setSortMode] = (0, import_react.useState)("latest");
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const [refreshingBtn, setRefreshingBtn] = (0, import_react.useState)(false);
	const [postText, setPostText] = (0, import_react.useState)("");
	const [postCategory, setPostCategory] = (0, import_react.useState)("questions");
	const [postVisibility, setPostVisibility] = (0, import_react.useState)("public");
	const [postAttachment, setPostAttachment] = (0, import_react.useState)(null);
	const [uploadingMedia, setUploadingMedia] = (0, import_react.useState)(false);
	const mediaInputRef = (0, import_react.useRef)(null);
	const [editingPostId, setEditingPostId] = (0, import_react.useState)(null);
	const [editBody, setEditBody] = (0, import_react.useState)("");
	const [editCategory, setEditCategory] = (0, import_react.useState)("questions");
	const [editVisibility, setEditVisibility] = (0, import_react.useState)("public");
	const [savingEdit, setSavingEdit] = (0, import_react.useState)(false);
	const [confirmDeletePostId, setConfirmDeletePostId] = (0, import_react.useState)(null);
	const [confirmDeleteCommentId, setConfirmDeleteCommentId] = (0, import_react.useState)(null);
	const [activeStoryIndex, setActiveStoryIndex] = (0, import_react.useState)(null);
	const [showStoryComposer, setShowStoryComposer] = (0, import_react.useState)(false);
	const [newStoryText, setNewStoryText] = (0, import_react.useState)("");
	const [newStoryGradient, setNewStoryGradient] = (0, import_react.useState)(STORY_GRADIENTS[0].cls);
	const [confirmDeleteStory, setConfirmDeleteStory] = (0, import_react.useState)(false);
	const [expandedComments, setExpandedComments] = (0, import_react.useState)({});
	const [commentInputs, setCommentInputs] = (0, import_react.useState)({});
	const commentRefs = (0, import_react.useRef)({});
	const storageKey = `nemvia:saved_posts:${currentUserId}`;
	const [savedPosts, setSavedPosts] = (0, import_react.useState)(() => {
		try {
			const raw = localStorage.getItem(storageKey);
			return raw ? JSON.parse(raw) : {};
		} catch {
			return {};
		}
	});
	(0, import_react.useEffect)(() => {
		try {
			localStorage.setItem(storageKey, JSON.stringify(savedPosts));
		} catch {}
	}, [savedPosts, storageKey]);
	const [copiedPostId, setCopiedPostId] = (0, import_react.useState)(null);
	const [lightboxUrl, setLightboxUrl] = (0, import_react.useState)(null);
	const [inspectMemberId, setInspectMemberId] = (0, import_react.useState)(null);
	const [membersFilter, setMembersFilter] = (0, import_react.useState)("all");
	const [memberSearch, setMemberSearch] = (0, import_react.useState)("");
	const [busyFollowId, setBusyFollowId] = (0, import_react.useState)(null);
	const followingSet = (0, import_react.useMemo)(() => new Set(followingIds), [followingIds]);
	const followerSet = (0, import_react.useMemo)(() => new Set(followerIds), [followerIds]);
	const incomingRequests = (0, import_react.useMemo)(() => followRequests.filter((r) => r.target_id === currentUserId && r.status === "pending"), [followRequests, currentUserId]);
	const outgoingRequestTargets = (0, import_react.useMemo)(() => new Set(followRequests.filter((r) => r.requester_id === currentUserId && r.status === "pending").map((r) => r.target_id)), [followRequests, currentUserId]);
	const contactById = (0, import_react.useMemo)(() => {
		const m = /* @__PURE__ */ new Map();
		contacts.forEach((c) => m.set(c.id, c));
		return m;
	}, [contacts]);
	const visiblePosts = (0, import_react.useMemo)(() => {
		const q = searchQuery.trim().toLowerCase();
		const list = posts.filter((p) => {
			if (sectionTab === "following" && p.author_id !== currentUserId && !followingSet.has(p.author_id)) return false;
			if (sectionTab === "saved" && !savedPosts[p.id]) return false;
			if (selectedCategory !== "all" && p.category !== selectedCategory) return false;
			if (q) {
				if (!`${p.body} ${p.author_name} ${p.comments.map((c) => c.body).join(" ")}`.toLowerCase().includes(q)) return false;
			}
			return true;
		});
		if (sortMode === "top") return [...list].sort((a, b) => b.likes_count + b.comments_count * 2 - (a.likes_count + a.comments_count * 2));
		return list;
	}, [
		posts,
		sectionTab,
		selectedCategory,
		searchQuery,
		sortMode,
		currentUserId,
		followingSet,
		savedPosts
	]);
	const visibleMembers = (0, import_react.useMemo)(() => {
		const q = memberSearch.trim().toLowerCase();
		return contacts.filter((c) => {
			if (membersFilter === "teachers" && c.role === "student") return false;
			if (membersFilter === "following" && !followingSet.has(c.id)) return false;
			if (membersFilter === "followers" && !followerSet.has(c.id)) return false;
			if (q && !`${c.name} ${c.bio || ""}`.toLowerCase().includes(q)) return false;
			return true;
		});
	}, [
		contacts,
		membersFilter,
		memberSearch,
		followingSet,
		followerSet
	]);
	const savedCount = (0, import_react.useMemo)(() => posts.filter((p) => savedPosts[p.id]).length, [posts, savedPosts]);
	const handleMediaSelect = async (e) => {
		const file = e.target.files?.[0];
		e.target.value = "";
		if (!file) return;
		setUploadingMedia(true);
		try {
			const up = await onUpload(file, "posts");
			const mediaType = file.type.startsWith("image/") ? "image" : file.type.startsWith("video/") ? "video" : "document";
			setPostAttachment({
				url: up.url,
				name: up.name,
				mediaType
			});
		} catch {} finally {
			setUploadingMedia(false);
		}
	};
	const handleCreatePost = (e) => {
		e.preventDefault();
		if (!postText.trim() && !postAttachment) return;
		onAddPost({
			id: `post-${Date.now()}`,
			author_id: currentUserId,
			author_name: currentUserName,
			author_role: currentRole,
			author_avatar: currentUserAvatar,
			body: postText.trim(),
			category: postCategory,
			media_url: postAttachment?.url,
			media_type: postAttachment?.mediaType,
			visibility: postVisibility,
			likes_count: 0,
			comments_count: 0,
			comments: [],
			is_liked: false,
			created_at: (/* @__PURE__ */ new Date()).toISOString()
		});
		setPostText("");
		setPostAttachment(null);
		setPostVisibility("public");
	};
	const startEditPost = (post) => {
		setEditingPostId(post.id);
		setEditBody(post.body);
		setEditCategory(post.category);
		setEditVisibility(post.visibility);
		setConfirmDeletePostId(null);
	};
	const saveEditPost = async (postId) => {
		if (!editBody.trim()) return;
		setSavingEdit(true);
		try {
			await onUpdatePost(postId, {
				body: editBody.trim(),
				category: editCategory,
				visibility: editVisibility
			});
			setEditingPostId(null);
		} finally {
			setSavingEdit(false);
		}
	};
	const handleCreateStory = (e) => {
		e.preventDefault();
		if (!newStoryText.trim()) return;
		onAddStory({
			id: `str-${Date.now()}`,
			user_id: currentUserId,
			user_name: currentUserName,
			user_role: currentRole,
			user_avatar: currentUserAvatar,
			body: newStoryText.trim(),
			bgGradient: newStoryGradient,
			created_at: (/* @__PURE__ */ new Date()).toISOString(),
			expires_at: new Date(Date.now() + 864e5).toISOString()
		});
		setNewStoryText("");
		setShowStoryComposer(false);
	};
	const handleSendComment = (postId) => {
		const body = (commentInputs[postId] || "").trim();
		if (!body) return;
		onAddComment(postId, {
			id: `cmt-${Date.now()}`,
			post_id: postId,
			author_id: currentUserId,
			author_name: currentUserName,
			author_avatar: currentUserAvatar,
			body,
			created_at: (/* @__PURE__ */ new Date()).toISOString()
		});
		setCommentInputs((prev) => ({
			...prev,
			[postId]: ""
		}));
		setExpandedComments((prev) => ({
			...prev,
			[postId]: true
		}));
	};
	const handleQuickReply = (postId, authorName) => {
		setExpandedComments((prev) => ({
			...prev,
			[postId]: true
		}));
		setCommentInputs((prev) => {
			const curr = prev[postId] || "";
			const prefix = `@${authorName} `;
			return {
				...prev,
				[postId]: curr.startsWith(prefix) ? curr : `${prefix}${curr}`
			};
		});
		window.setTimeout(() => {
			commentRefs.current[postId]?.focus();
		}, 60);
	};
	const handleSharePost = async (post) => {
		const shareText = `${post.author_name} في مجتمع NEMVIA:\n${post.body}`;
		if (navigator.share) try {
			await navigator.share({
				title: "مشاركة من NEMVIA",
				text: shareText
			});
			return;
		} catch {}
		try {
			await navigator.clipboard.writeText(shareText);
			setCopiedPostId(post.id);
			window.setTimeout(() => setCopiedPostId(null), 2e3);
		} catch {}
	};
	const handleFollowAction = async (targetId, visibility = "public") => {
		setBusyFollowId(targetId);
		try {
			if (followingSet.has(targetId)) await onUnfollowUser(targetId);
			else if (outgoingRequestTargets.has(targetId)) await onCancelFollowRequest(targetId);
			else await onFollowUser(targetId, visibility);
		} finally {
			setBusyFollowId(null);
		}
	};
	const handleManualRefresh = async () => {
		if (!onRefresh || refreshingBtn) return;
		setRefreshingBtn(true);
		try {
			await onRefresh();
		} finally {
			setRefreshingBtn(false);
		}
	};
	const roleText = (r) => r === "teacher" ? "أستاذ" : r === "admin" ? "إدارة المنصة" : "طالب";
	const categoryLabel = (c) => c === "questions" ? "سؤال علمي" : c === "notes" ? "ملخص ونصيحة" : c === "announcements" ? "إعلان رسمي" : "مناقشة عامة";
	const inspectedMember = (0, import_react.useMemo)(() => {
		if (!inspectMemberId) return null;
		if (inspectMemberId === currentUserId) return {
			id: currentUserId,
			name: currentUserName,
			role: currentRole,
			avatar_url: currentUserAvatar
		};
		const found = contactById.get(inspectMemberId);
		if (found) return found;
		const p = posts.find((x) => x.author_id === inspectMemberId);
		if (p) return {
			id: p.author_id,
			name: p.author_name,
			role: p.author_role,
			avatar_url: p.author_avatar
		};
		return null;
	}, [
		inspectMemberId,
		currentUserId,
		currentUserName,
		currentRole,
		currentUserAvatar,
		contactById,
		posts
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5 max-w-4xl mx-auto",
		children: [
			lightboxUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				onClick: () => setLightboxUrl(null),
				className: "fixed inset-0 z-50 bg-black/90 backdrop-blur-xs flex items-center justify-center p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setLightboxUrl(null),
					className: "absolute top-4 right-4 w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center cursor-pointer",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-5 h-5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: lightboxUrl,
					alt: "معاينة كاملة",
					onClick: (e) => e.stopPropagation(),
					className: "max-h-[88vh] max-w-full rounded-2xl object-contain"
				})]
			}),
			inspectedMember && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				onClick: () => setInspectMemberId(null),
				className: "fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					onClick: (e) => e.stopPropagation(),
					className: "w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl border border-slate-200 p-5 space-y-4 shadow-2xl animate-in slide-in-from-bottom-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 min-w-0",
								children: [inspectedMember.avatar_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: inspectedMember.avatar_url,
									alt: "",
									className: "w-12 h-12 rounded-full object-cover shrink-0"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-base shrink-0",
									children: inspectedMember.name.slice(0, 1)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-black text-base text-slate-900 truncate",
										children: inspectedMember.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-slate-500",
										children: [
											roleText(inspectedMember.role),
											inspectedMember.points !== void 0 ? ` · ${inspectedMember.points} XP` : "",
											inspectedMember.visibility === "private" ? " · حساب خاص" : ""
										]
									})]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setInspectMemberId(null),
								className: "w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
							})]
						}),
						inspectedMember.bio && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100",
							children: inspectedMember.bio
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs text-slate-500 flex items-center gap-4 tabular-nums",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [posts.filter((p) => p.author_id === inspectedMember.id).length, " منشور"] }), followerSet.has(inspectedMember.id) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "يتابعك" })]
						}),
						inspectedMember.id !== currentUserId && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 pt-2 border-t border-slate-100",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								disabled: busyFollowId === inspectedMember.id,
								onClick: () => handleFollowAction(inspectedMember.id, inspectedMember.visibility === "private" ? "private" : "public"),
								className: `flex-1 min-h-[42px] px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${followingSet.has(inspectedMember.id) ? "bg-slate-100 hover:bg-slate-200 text-slate-800" : outgoingRequestTargets.has(inspectedMember.id) ? "bg-amber-50 text-amber-800 border border-amber-200" : "bg-[#1677c7] hover:bg-[#125fa0] text-white"}`,
								children: followingSet.has(inspectedMember.id) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "متابَع (إلغاء)" })] }) : outgoingRequestTargets.has(inspectedMember.id) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "طلب متابعة مرسل" })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: inspectedMember.visibility === "private" ? "طلب متابعة" : "متابعة" })] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => {
									const id = inspectedMember.id;
									setInspectMemberId(null);
									onStartChat(id);
								},
								className: "flex-1 min-h-[42px] px-4 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "مراسلة مباشرة" })]
							})]
						})
					]
				})
			}),
			activeStoryIndex !== null && stories[activeStoryIndex] && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 bg-black/92 backdrop-blur-md flex items-center justify-center p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative max-w-sm w-full h-[540px] rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between p-5 text-white border border-white/15 animate-in zoom-in-95",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `absolute inset-0 bg-gradient-to-br ${stories[activeStoryIndex].bgGradient} -z-10` }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3 z-10",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex gap-1",
								children: stories.map((st, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-1 flex-1 rounded-full bg-white/25 overflow-hidden",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `h-full rounded-full ${idx <= activeStoryIndex ? "bg-white w-full" : "w-0"}` })
								}, st.id))
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2.5 min-w-0",
									children: [stories[activeStoryIndex].user_avatar ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: stories[activeStoryIndex].user_avatar,
										alt: "",
										className: "w-9 h-9 rounded-full object-cover shrink-0"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs shrink-0",
										children: stories[activeStoryIndex].user_name.slice(0, 1)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-bold text-xs block truncate",
											children: stories[activeStoryIndex].user_name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-[10px] text-white/75",
											children: [
												roleText(stories[activeStoryIndex].user_role),
												" · ",
												storyRemainingLabel(stories[activeStoryIndex].expires_at)
											]
										})]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5 shrink-0",
									children: [(stories[activeStoryIndex].user_id === currentUserId || currentRole === "admin") && (confirmDeleteStory ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: async () => {
											const targetId = stories[activeStoryIndex].id;
											setConfirmDeleteStory(false);
											setActiveStoryIndex(null);
											await onDeleteStory(targetId);
										},
										className: "px-2.5 py-1 rounded-full bg-rose-600 text-white text-[11px] font-bold cursor-pointer",
										children: "تأكيد الحذف"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setConfirmDeleteStory(true),
										title: "حذف القصة",
										className: "w-8 h-8 rounded-full bg-black/35 hover:bg-rose-600/80 text-white flex items-center justify-center cursor-pointer",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4" })
									})), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => {
											setActiveStoryIndex(null);
											setConfirmDeleteStory(false);
										},
										className: "w-8 h-8 rounded-full bg-black/35 hover:bg-black/55 text-white flex items-center justify-center cursor-pointer",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
									})]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "my-auto text-center px-3 py-6",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-lg sm:text-xl font-bold leading-relaxed whitespace-pre-wrap",
								children: stories[activeStoryIndex].body
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between z-10 pt-3 border-t border-white/15 text-xs text-white/80",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => {
										setConfirmDeleteStory(false);
										setActiveStoryIndex(Math.max(0, activeStoryIndex - 1));
									},
									disabled: activeStoryIndex === 0,
									className: "min-h-[36px] px-2 disabled:opacity-30 cursor-pointer flex items-center gap-1 font-bold",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "السابقة" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "tabular-nums",
									children: [
										activeStoryIndex + 1,
										" / ",
										stories.length
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => {
										setConfirmDeleteStory(false);
										setActiveStoryIndex(Math.min(stories.length - 1, activeStoryIndex + 1));
									},
									disabled: activeStoryIndex === stories.length - 1,
									className: "min-h-[36px] px-2 disabled:opacity-30 cursor-pointer flex items-center gap-1 font-bold",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "التالية" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "w-4 h-4" })]
								})
							]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white rounded-2xl border border-slate-200 p-2 sm:p-2.5 flex flex-wrap items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-1 overflow-x-auto scrollbar-none",
					"data-no-pull": "true",
					children: [
						{
							id: "feed",
							label: "الخلاصة",
							count: posts.length
						},
						{
							id: "following",
							label: "متابَعتي",
							count: followingIds.length
						},
						{
							id: "saved",
							label: "المحفوظات",
							count: savedCount
						},
						{
							id: "members",
							label: "الأعضاء والمتابعة",
							count: incomingRequests.length > 0 ? incomingRequests.length : contacts.length,
							badge: incomingRequests.length
						}
					].map((tab) => {
						const active = sectionTab === tab.id;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setSectionTab(tab.id),
							className: `min-h-[40px] px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-colors cursor-pointer ${active ? "bg-[#1677c7] text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: tab.label }), tab.badge !== void 0 && tab.badge > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `min-w-4 h-4 px-1 rounded-full text-[10px] font-black flex items-center justify-center tabular-nums ${active ? "bg-white text-[#1677c7]" : "bg-rose-600 text-white"}`,
								children: tab.badge
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `text-[10px] tabular-nums ${active ? "text-white/80" : "text-slate-400"}`,
								children: tab.count
							})]
						}, tab.id);
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [currentRole === "admin" && openReportsCount > 0 && onNavigate && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => onNavigate("admin"),
						className: "min-h-[36px] px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [openReportsCount, " بلاغ للمراجعة"] })]
					}), onRefresh && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: handleManualRefresh,
						title: "تحديث المنشورات",
						className: "w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center cursor-pointer",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `w-4 h-4 ${refreshingBtn ? "animate-spin text-[#1677c7]" : ""}` })
					})]
				})]
			}),
			sectionTab === "members" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-5",
				children: [incomingRequests.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "font-black text-sm text-slate-900 flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "w-4 h-4 text-[#1677c7]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							"طلبات المتابعة الواردة (",
							incomingRequests.length,
							")"
						] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "divide-y divide-slate-100",
						children: incomingRequests.map((req) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "py-3 flex items-center justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2.5 min-w-0",
								children: [req.requester_avatar ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: req.requester_avatar,
									alt: "",
									className: "w-9 h-9 rounded-full object-cover shrink-0"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0",
									children: req.requester_name.slice(0, 1)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-bold text-xs text-slate-900 truncate",
										children: req.requester_name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-[11px] text-slate-500",
										children: [
											roleText(req.requester_role),
											" · ",
											formatRelativeTime(req.created_at)
										]
									})]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 shrink-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => onRespondFollowRequest(req.id, true),
									className: "min-h-[36px] px-3 rounded-xl bg-[#1677c7] text-white font-bold text-xs cursor-pointer",
									children: "قبول"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => onRespondFollowRequest(req.id, false),
									className: "min-h-[36px] px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer",
									children: "رفض"
								})]
							})]
						}, req.id))
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-black text-sm text-slate-900",
								children: "دليل أعضاء المجتمع"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-slate-500 tabular-nums",
								children: [
									"تتابع ",
									followingIds.length,
									" · يتابعك ",
									followerIds.length,
									" · ",
									contacts.length,
									" عضو متاح"
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative w-full sm:w-64",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: memberSearch,
									onChange: (e) => setMemberSearch(e.target.value),
									placeholder: "ابحث عن طالب أو معلم...",
									className: "w-full pr-9 pl-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#1677c7]"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-1.5",
							children: [
								{
									id: "all",
									label: "الجميع"
								},
								{
									id: "teachers",
									label: "المعلمون والإدارة"
								},
								{
									id: "following",
									label: `أتابعهم (${followingIds.length})`
								},
								{
									id: "followers",
									label: `يتابعونني (${followerIds.length})`
								}
							].map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setMembersFilter(f.id),
								className: `px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${membersFilter === f.id ? "bg-slate-900 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-700"}`,
								children: f.label
							}, f.id))
						}),
						visibleMembers.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-slate-400 text-center py-8",
							children: "لا توجد نتائج مطابقة في هذا التصنيف."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
							children: visibleMembers.map((member) => {
								const isFollowing = followingSet.has(member.id);
								const isPending = outgoingRequestTargets.has(member.id);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => setInspectMemberId(member.id),
											className: "shrink-0 cursor-pointer",
											children: member.avatar_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
												src: member.avatar_url,
												alt: "",
												className: "w-10 h-10 rounded-full object-cover"
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs",
												children: member.name.slice(0, 1)
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0 flex-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: () => setInspectMemberId(member.id),
													className: "font-bold text-xs text-slate-900 hover:text-[#1677c7] truncate block text-start cursor-pointer",
													children: member.name
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "text-[11px] text-slate-500",
													children: [
														roleText(member.role),
														member.points !== void 0 ? ` · ${member.points} XP` : "",
														followerSet.has(member.id) ? " · يتابعك" : ""
													]
												}),
												member.bio && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-[11px] text-slate-600 mt-1 line-clamp-2",
													children: member.bio
												})
											]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											disabled: busyFollowId === member.id,
											onClick: () => handleFollowAction(member.id, member.visibility === "private" ? "private" : "public"),
											className: `flex-1 min-h-[38px] px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${isFollowing ? "bg-white border border-slate-200 text-slate-800 hover:bg-slate-100" : isPending ? "bg-amber-50 border border-amber-200 text-amber-800" : "bg-[#1677c7] hover:bg-[#125fa0] text-white"}`,
											children: isFollowing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "متابَع" })] }) : isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "طلب مرسل" })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: member.visibility === "private" ? "طلب متابعة" : "متابعة" })] })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => onStartChat(member.id),
											className: "min-h-[38px] px-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-1 cursor-pointer",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "مراسلة" })]
										})]
									})]
								}, member.id);
							})
						})
					]
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				sectionTab === "feed" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "space-y-2.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs font-bold text-slate-700 flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-3.5 h-3.5 text-amber-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "القصص اليومية (24 ساعة)" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[11px] text-slate-400 tabular-nums",
								children: [stories.length, " قصة نشطة"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2.5 overflow-x-auto pb-1 scrollbar-none",
							"data-no-pull": "true",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setShowStoryComposer((v) => !v),
								className: "shrink-0 w-28 h-40 rounded-2xl bg-white border-2 border-dashed border-slate-300 hover:border-[#1677c7] p-3 flex flex-col justify-between items-center text-center cursor-pointer transition-colors",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-9 h-9 rounded-full bg-[#1677c7] text-white flex items-center justify-center font-bold text-lg mt-2",
									children: "+"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold text-xs text-slate-800 block",
									children: "أضف قصة"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] text-slate-500",
									children: "تختفي بعد 24س"
								})] })]
							}), stories.map((st, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => {
									setConfirmDeleteStory(false);
									setActiveStoryIndex(i);
								},
								className: `shrink-0 w-28 h-40 rounded-2xl bg-gradient-to-br ${st.bgGradient} text-white p-3 flex flex-col justify-between text-start cursor-pointer hover:opacity-95 transition-opacity`,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5",
										children: [st.user_avatar ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: st.user_avatar,
											alt: "",
											className: "w-6 h-6 rounded-full object-cover ring-2 ring-white/50 shrink-0"
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold ring-2 ring-white/50 shrink-0",
											children: st.user_name.slice(0, 1)
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-bold truncate",
											children: st.user_name
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] font-semibold leading-relaxed line-clamp-4",
										children: st.body
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[9px] text-white/75",
										children: storyRemainingLabel(st.expires_at)
									})
								]
							}, st.id))]
						}),
						showStoryComposer && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4 bg-white rounded-2xl border border-slate-200 space-y-3 animate-in fade-in",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "text-xs font-black text-slate-900",
									children: "إنشاء قصة سريعة (24 ساعة)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setShowStoryComposer(false),
									className: "text-slate-400 hover:text-slate-600 cursor-pointer",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								onSubmit: handleCreateStory,
								className: "space-y-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									maxLength: 300,
									value: newStoryText,
									onChange: (e) => setNewStoryText(e.target.value),
									placeholder: "شارك إنجازاً دراسياً، تذكيراً سريعاً، أو سؤالاً لزملائك...",
									className: "w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#1677c7]",
									required: true
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex items-center gap-1.5",
										children: STORY_GRADIENTS.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											title: g.label,
											onClick: () => setNewStoryGradient(g.cls),
											className: `w-6 h-6 rounded-full bg-gradient-to-br ${g.cls} cursor-pointer ${newStoryGradient === g.cls ? "ring-2 ring-offset-2 ring-[#1677c7]" : "opacity-75 hover:opacity-100"}`
										}, g.id))
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "submit",
										className: "min-h-[38px] px-4 bg-[#1677c7] hover:bg-[#125fa0] text-white font-bold rounded-xl text-xs cursor-pointer",
										children: "نشر القصة"
									})]
								})]
							})]
						})
					]
				}),
				sectionTab === "feed" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2.5 min-w-0",
							children: [currentUserAvatar ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: currentUserAvatar,
								alt: "",
								className: "w-9 h-9 rounded-full object-cover shrink-0"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0",
								children: currentUserName.slice(0, 1)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold text-xs text-slate-900 block truncate",
									children: currentUserName
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] text-slate-500",
									children: "انشر سؤالاً، ملخصاً، ملفاً، أو فيديو تعليمي"
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: postVisibility,
							onChange: (e) => setPostVisibility(e.target.value),
							"aria-label": "الخصوصية",
							className: "px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-bold text-slate-700 outline-none",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "public",
									children: "عام للجميع"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "followers",
									children: "المتابعون فقط"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "private",
									children: "خاص بي"
								})
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleCreatePost,
						className: "space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								value: postText,
								onChange: (e) => setPostText(e.target.value),
								placeholder: "ماذا تريد أن تشارك أو تناقش مع زملائك ومعلميك اليوم؟",
								className: "w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm outline-none focus:border-[#1677c7] min-h-[88px] leading-relaxed"
							}),
							postAttachment && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2 max-w-full",
								children: [
									postAttachment.mediaType === "image" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: postAttachment.url,
										alt: "",
										className: "max-h-44 rounded-lg object-cover"
									}),
									postAttachment.mediaType === "video" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 px-2 py-1 text-xs font-bold text-slate-700",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Film, { className: "w-4 h-4 text-[#1677c7]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "truncate max-w-[200px]",
											children: postAttachment.name
										})]
									}),
									postAttachment.mediaType === "document" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 px-2 py-1 text-xs font-bold text-slate-700",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "w-4 h-4 text-[#1677c7]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "truncate max-w-[200px]",
											children: postAttachment.name
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setPostAttachment(null),
										className: "w-7 h-7 rounded-full bg-slate-900/80 text-white flex items-center justify-center cursor-pointer shrink-0",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-3.5 h-3.5" })
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											value: postCategory,
											onChange: (e) => setPostCategory(e.target.value),
											className: "min-h-[38px] px-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs outline-none",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "questions",
													children: "سؤال علمي"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "notes",
													children: "ملخص أو نصيحة"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "all",
													children: "مناقشة عامة"
												}),
												(currentRole === "teacher" || currentRole === "admin") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "announcements",
													children: "إعلان رسمي"
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "file",
											ref: mediaInputRef,
											onChange: handleMediaSelect,
											accept: "image/*,video/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt",
											className: "hidden"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											disabled: uploadingMedia,
											onClick: () => mediaInputRef.current?.click(),
											className: "min-h-[38px] px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center gap-1.5 cursor-pointer transition-colors disabled:opacity-60",
											children: [uploadingMedia ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin text-[#1677c7]" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paperclip, { className: "w-3.5 h-3.5 text-[#1677c7]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: uploadingMedia ? "جاري الرفع..." : "صورة / فيديو / ملف" })]
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "submit",
									disabled: uploadingMedia || !postText.trim() && !postAttachment,
									className: "min-h-[40px] px-5 bg-[#1677c7] hover:bg-[#125fa0] disabled:opacity-50 text-white font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "نشر" })]
								})]
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-1 bg-white border border-slate-200 p-1 rounded-xl overflow-x-auto scrollbar-none",
						"data-no-pull": "true",
						children: [
							{
								id: "all",
								label: "الكل"
							},
							{
								id: "questions",
								label: "أسئلة"
							},
							{
								id: "notes",
								label: "ملخصات"
							},
							{
								id: "announcements",
								label: "إعلانات"
							}
						].map((tab) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setSelectedCategory(tab.id),
							className: `px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-colors cursor-pointer ${selectedCategory === tab.id ? "bg-slate-900 text-white" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"}`,
							children: tab.label
						}, tab.id))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative flex-1 sm:w-52",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: searchQuery,
								onChange: (e) => setSearchQuery(e.target.value),
								placeholder: "بحث في المنشورات...",
								className: "w-full pr-8 pl-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-[#1677c7]"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: sortMode,
							onChange: (e) => setSortMode(e.target.value),
							className: "px-2.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "latest",
								children: "الأحدث"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "top",
								children: "الأكثر تفاعلاً"
							})]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [visiblePosts.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "w-8 h-8 text-slate-300 mx-auto" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-bold text-slate-700",
								children: sectionTab === "following" ? "لا توجد منشورات بعد في قائمة المتابَعين" : sectionTab === "saved" ? "لا توجد منشورات محفوظة بعد" : "لا توجد منشورات مطابقة للبحث"
							}),
							sectionTab === "following" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setSectionTab("members"),
								className: "mt-2 px-4 py-2 rounded-xl bg-[#1677c7] text-white font-bold text-xs cursor-pointer",
								children: "استكشاف الأعضاء ومتابعتهم"
							})
						]
					}), visiblePosts.map((post) => {
						const isCommentsOpen = Boolean(expandedComments[post.id]);
						const isSaved = Boolean(savedPosts[post.id]);
						const canManagePost = post.author_id === currentUserId || currentRole === "admin";
						const isEditing = editingPostId === post.id;
						const isFollowingAuthor = followingSet.has(post.author_id);
						const isPendingAuthor = outgoingRequestTargets.has(post.author_id);
						const authorContact = contactById.get(post.author_id);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 space-y-3.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2.5 min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => setInspectMemberId(post.author_id),
											className: "shrink-0 cursor-pointer",
											children: post.author_avatar ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
												src: post.author_avatar,
												alt: "",
												className: "w-10 h-10 rounded-full object-cover"
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "w-10 h-10 rounded-full bg-sky-100 text-[#1677c7] flex items-center justify-center font-black text-sm",
												children: post.author_name.slice(0, 1)
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex flex-wrap items-center gap-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: () => setInspectMemberId(post.author_id),
													className: "font-bold text-slate-900 text-sm hover:text-[#1677c7] truncate cursor-pointer",
													children: post.author_name
												}), post.author_id !== currentUserId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													disabled: busyFollowId === post.author_id,
													onClick: () => handleFollowAction(post.author_id, authorContact?.visibility === "private" ? "private" : "public"),
													className: `text-[11px] font-bold px-2 py-0.5 rounded-lg cursor-pointer transition-colors ${isFollowingAuthor ? "text-slate-500 hover:text-slate-800" : isPendingAuthor ? "text-amber-700" : "text-[#1677c7] hover:bg-sky-50"}`,
													children: isFollowingAuthor ? "متابَع ✓" : isPendingAuthor ? "قيد الطلب" : "+ متابعة"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-1.5 text-[11px] text-slate-400",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: roleText(post.author_role) }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: categoryLabel(post.category) }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "tabular-nums",
														children: formatRelativeTime(post.created_at)
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
													post.visibility === "private" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, {
														className: "w-3 h-3 inline",
														"aria-label": "خاص"
													}) : post.visibility === "followers" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, {
														className: "w-3 h-3 inline",
														"aria-label": "للمتابعين"
													}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, {
														className: "w-3 h-3 inline",
														"aria-label": "عام"
													})
												]
											})]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1 shrink-0",
										children: [
											canManagePost && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => isEditing ? setEditingPostId(null) : startEditPost(post),
												title: "تعديل المنشور",
												className: "w-8 h-8 rounded-lg text-slate-400 hover:text-[#1677c7] hover:bg-slate-100 flex items-center justify-center cursor-pointer",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, { className: "w-4 h-4" })
											}), confirmDeletePostId === post.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-1 bg-rose-50 border border-rose-200 rounded-lg px-2 py-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: () => {
														setConfirmDeletePostId(null);
														onDeletePost(post.id);
													},
													className: "text-[11px] font-bold text-rose-700 cursor-pointer",
													children: "حذف"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: () => setConfirmDeletePostId(null),
													className: "text-[11px] font-bold text-slate-500 cursor-pointer",
													children: "إلغاء"
												})]
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => setConfirmDeletePostId(post.id),
												title: "حذف المنشور",
												className: "w-8 h-8 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 flex items-center justify-center cursor-pointer",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4" })
											})] }),
											post.author_id !== currentUserId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => onReport({
													type: "post",
													id: post.id,
													label: "منشور",
													snapshot: post.body.slice(0, 200)
												}),
												title: "إبلاغ عن المنشور",
												className: "w-8 h-8 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 flex items-center justify-center cursor-pointer",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flag, { className: "w-4 h-4" })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => setSavedPosts((prev) => ({
													...prev,
													[post.id]: !prev[post.id]
												})),
												title: isSaved ? "إزالة من المحفوظات" : "حفظ المنشور",
												className: `w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${isSaved ? "text-[#1677c7] bg-sky-50" : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"}`,
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: `w-4 h-4 ${isSaved ? "fill-[#1677c7]" : ""}` })
											})
										]
									})]
								}),
								isEditing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
										value: editBody,
										onChange: (e) => setEditBody(e.target.value),
										className: "w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm outline-none focus:border-[#1677c7] min-h-[80px]"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-center justify-between gap-2 text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
												value: editCategory,
												onChange: (e) => setEditCategory(e.target.value),
												className: "px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "questions",
														children: "سؤال علمي"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "notes",
														children: "ملخص أو نصيحة"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "all",
														children: "مناقشة عامة"
													}),
													(currentRole === "teacher" || currentRole === "admin") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "announcements",
														children: "إعلان رسمي"
													})
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
												value: editVisibility,
												onChange: (e) => setEditVisibility(e.target.value),
												className: "px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "public",
														children: "عام"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "followers",
														children: "المتابعون"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "private",
														children: "خاص"
													})
												]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => setEditingPostId(null),
												className: "px-3 py-1.5 rounded-lg bg-slate-200 text-slate-700 font-bold cursor-pointer",
												children: "إلغاء"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												disabled: savingEdit || !editBody.trim(),
												onClick: () => saveEditPost(post.id),
												className: "px-3 py-1.5 rounded-lg bg-[#1677c7] text-white font-bold cursor-pointer disabled:opacity-60",
												children: savingEdit ? "حفظ..." : "حفظ التعديل"
											})]
										})]
									})]
								}) : post.body && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap",
									children: post.body
								}),
								post.media_url && (post.media_type === "video" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
									src: post.media_url,
									controls: true,
									playsInline: true,
									className: "w-full max-h-96 rounded-xl border border-slate-200 bg-black"
								}) : post.media_type === "document" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: post.media_url,
									target: "_blank",
									rel: "noopener noreferrer",
									className: "flex items-center justify-between gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2.5 min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "w-9 h-9 rounded-lg bg-sky-100 text-[#1677c7] flex items-center justify-center shrink-0",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "w-4 h-4" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-bold text-xs text-slate-900 block truncate",
												children: "ملف مرفق"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[11px] text-slate-500",
												children: "اضغط لفتح أو تحميل المستند"
											})]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-bold text-[#1677c7] shrink-0",
										children: "فتح"
									})]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setLightboxUrl(post.media_url),
									className: "w-full rounded-xl overflow-hidden border border-slate-200 max-h-96 bg-slate-50 flex items-center justify-center cursor-zoom-in",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: post.media_url,
										alt: "مرفق منشور",
										className: "max-h-96 w-auto object-contain"
									})
								})),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2 text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3 sm:gap-5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => onToggleLike(post.id),
											className: `min-h-[36px] px-2 rounded-lg flex items-center gap-1.5 font-bold cursor-pointer transition-colors ${post.is_liked ? "text-rose-600 bg-rose-50/70" : "text-slate-600 hover:bg-slate-100 hover:text-rose-600"}`,
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: `w-4 h-4 ${post.is_liked ? "fill-rose-500" : ""}` }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "tabular-nums",
													children: post.likes_count
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "hidden sm:inline",
													children: "إعجاب"
												})
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => setExpandedComments((prev) => ({
												...prev,
												[post.id]: !isCommentsOpen
											})),
											className: `min-h-[36px] px-2 rounded-lg flex items-center gap-1.5 font-bold cursor-pointer transition-colors ${isCommentsOpen ? "text-[#1677c7] bg-sky-50" : "text-slate-600 hover:bg-slate-100 hover:text-[#1677c7]"}`,
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "w-4 h-4" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "tabular-nums",
													children: post.comments.length
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "hidden sm:inline",
													children: "تعليقات"
												})
											]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => handleSharePost(post),
										className: "min-h-[36px] px-2.5 rounded-lg flex items-center gap-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 font-bold cursor-pointer transition-colors",
										children: copiedPostId === post.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-3.5 h-3.5 text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-emerald-700",
											children: "تم النسخ"
										})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "مشاركة" })] })
									})]
								}),
								isCommentsOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "pt-3 border-t border-slate-100 space-y-3 bg-slate-50/60 -mx-4 sm:-mx-5 -mb-4 sm:-mb-5 p-4 sm:p-5 rounded-b-2xl",
									children: [post.comments.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] text-slate-400 text-center py-2",
										children: "كن أول من يضيف تعليقاً علمياً أو رداً."
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "space-y-2",
										children: post.comments.map((c) => {
											const canDeleteComment = c.author_id === currentUserId || currentRole === "admin";
											return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "p-2.5 bg-white rounded-xl border border-slate-200 text-xs space-y-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center justify-between gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														onClick: () => setInspectMemberId(c.author_id),
														className: "font-bold text-slate-900 hover:text-[#1677c7] cursor-pointer",
														children: c.author_name
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center gap-2 text-[10px] text-slate-400 shrink-0",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatRelativeTime(c.created_at) }),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																type: "button",
																onClick: () => handleQuickReply(post.id, c.author_name),
																title: "رد",
																className: "text-slate-400 hover:text-[#1677c7] cursor-pointer",
																children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reply, { className: "w-3.5 h-3.5" })
															}),
															canDeleteComment && (confirmDeleteCommentId === c.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																type: "button",
																onClick: async () => {
																	setConfirmDeleteCommentId(null);
																	await onDeleteComment(c.id);
																},
																className: "text-rose-600 font-bold cursor-pointer",
																children: "تأكيد"
															}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																type: "button",
																onClick: () => setConfirmDeleteCommentId(c.id),
																title: "حذف التعليق",
																className: "text-slate-400 hover:text-rose-600 cursor-pointer",
																children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3 h-3" })
															})),
															c.author_id !== currentUserId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																type: "button",
																onClick: () => onReport({
																	type: "comment",
																	id: c.id,
																	label: "تعليق",
																	snapshot: c.body.slice(0, 200)
																}),
																title: "إبلاغ عن التعليق",
																className: "text-slate-400 hover:text-rose-600 cursor-pointer",
																children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flag, { className: "w-3 h-3" })
															})
														]
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-slate-700 leading-relaxed whitespace-pre-wrap",
													children: c.body
												})]
											}, c.id);
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
										onSubmit: (e) => {
											e.preventDefault();
											handleSendComment(post.id);
										},
										className: "flex gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											ref: (el) => {
												commentRefs.current[post.id] = el;
											},
											type: "text",
											value: commentInputs[post.id] || "",
											onChange: (e) => setCommentInputs((prev) => ({
												...prev,
												[post.id]: e.target.value
											})),
											placeholder: "اكتب تعليقك أو ردك...",
											className: "flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-[#1677c7]"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "submit",
											className: "min-h-[38px] px-4 bg-[#1677c7] hover:bg-[#125fa0] text-white rounded-xl text-xs font-bold cursor-pointer shrink-0",
											children: "إرسال"
										})]
									})]
								})
							]
						}, post.id);
					})]
				})
			] })
		]
	});
};
export { CommunityView };
