const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/ClassesView-Bm9HO-iv.js","assets/rolldown-runtime-SbdDWaPq.js","assets/icons-Ba0nzYf3.js","assets/browser-DRvmOQFv.js","assets/react-vendor-Dpw1FlJl.js","assets/CoursesView-yV2-8CU9.js","assets/ai-DSRWe77_.js","assets/questionBank-BJzuY2YM.js","assets/AssignmentsView-BEwbzsPa.js","assets/CommunityView-C9zWAIbT.js","assets/PollCard-hWJwowzh.js","assets/LiveClassroomView-C2LM99qe.js","assets/WhiteboardModal-D6jPSttl.js","assets/MessagesView-Bt-jlJm3.js","assets/StudyToolsView-CJU86TYL.js","assets/AIStudioView-mFE0K3lZ.js","assets/AdminView-Cmzxk_Hc.js","assets/ProfileView-BBh_jWk2.js","assets/firebase-ClLwtwdv.js","assets/SettingsView-gb_G5i3a.js","assets/CalendarView-DCPMyID7.js","assets/GradebookView-C78eOIX_.js"])))=>i.map(i=>d[i]);
import { n as __exportAll, r as __toESM } from "./rolldown-runtime-SbdDWaPq.js";
import { n as require_client, t as require_jsx_runtime } from "./react-vendor-Dpw1FlJl.js";
import { $t as CircleCheck, B as Radio, Dt as GraduationCap, F as Scale, Ft as FileText, G as Phone, I as RotateCw, It as FileCheck, K as PhoneOff, Kt as ClipboardList, Mt as Flag, N as Search, O as ShieldCheck, Sn as ArrowDown, T as Smartphone, Vt as Download, Xt as CircleUser, _n as BookOpen, _t as LayoutGrid, a as Volume2, an as Check, at as MessageSquare, bn as BellRing, c as Users, ct as Maximize2, dt as LogOut, en as CircleAlert, fn as Building2, ft as Lock, g as TriangleAlert, i as VolumeX, it as MicOff, j as Settings, jt as Flame, k as ShieldAlert, l as User, ln as Camera, lt as Mail, n as X, nn as ChevronRight, nt as Minimize2, o as Video, on as CheckCheck, pt as LoaderCircle, q as PhoneCall, r as WifiOff, rn as ChevronLeft, rt as Mic, s as VideoOff, un as Calendar, ut as MailCheck, vt as Layers, w as Sparkles, wn as require_react, x as Star, xn as Award, xt as House, y as SwitchCamera, yn as Bell, z as RefreshCw, zt as ExternalLink } from "./icons-Ba0nzYf3.js";
import { A as sendPasswordResetEmail, C as serverTimestamp, D as getRedirectResult, E as getAuth, I as updateProfile$2, L as initializeApp, M as signInWithEmailAndPassword, N as signInWithPopup, O as onAuthStateChanged, P as signOut, S as increment, T as createUserWithEmailAndPassword, _ as writeBatch, a as addDoc, b as doc, c as getDocFromServer, d as onSnapshot, f as orderBy, g as where, h as updateDoc, i as uploadBytes, j as signInWithCredential, k as sendEmailVerification, l as getDocs, m as setDoc, n as getStorage, o as deleteDoc, p as query, r as ref, s as getDoc, t as getDownloadURL, u as limit, v as Timestamp, w as GoogleAuthProvider, x as getFirestore, y as collection } from "./firebase-ClLwtwdv.js";
// \0vite/modulepreload-polyfill.js
(function polyfill() {
	const relList = document.createElement("link").relList;
	if (relList && relList.supports && relList.supports("modulepreload")) return;
	for (const link of document.querySelectorAll("link[rel=\"modulepreload\"]")) processPreload(link);
	new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			if (mutation.type !== "childList") continue;
			for (const node of mutation.addedNodes) if (node.tagName === "LINK" && node.rel === "modulepreload") processPreload(node);
		}
	}).observe(document, {
		childList: true,
		subtree: true
	});
	function getFetchOpts(link) {
		const fetchOpts = {};
		if (link.integrity) fetchOpts.integrity = link.integrity;
		if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
		if (link.crossOrigin === "use-credentials") fetchOpts.credentials = "include";
		else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
		else fetchOpts.credentials = "same-origin";
		return fetchOpts;
	}
	function processPreload(link) {
		if (link.ep) return;
		link.ep = true;
		const fetchOpts = getFetchOpts(link);
		fetch(link.href, fetchOpts);
	}
})();
// \0vite/preload-helper.js
var import_client = require_client();
var scriptRel = "modulepreload";
var assetsURL = function(dep) {
	return "/" + dep;
};
var seen = {};
var isCssPreloadUrl = function isCssPreloadUrl(url) {
	return url.pathname.endsWith(".css");
};
var preloadOnce = function preloadOnce(seen, href, preload) {
	if (href in seen) return seen[href];
	const promise = preload();
	if (!promise) {
		seen[href] = void 0;
		return;
	}
	const preloadPromise = promise.then(() => {
		seen[href] = void 0;
	}, (err) => {
		seen[href] = void 0;
		throw err;
	});
	seen[href] = preloadPromise;
	return preloadPromise;
};
var __vitePreload = function preload(baseModule, deps, importerUrl) {
	let promise = Promise.resolve();
	if (deps && deps.length > 0) {
		let preloadedHrefs;
		const cspNonceMeta = document.querySelector("meta[property=csp-nonce]");
		const cspNonce = cspNonceMeta?.nonce || cspNonceMeta?.getAttribute("nonce");
		function allSettled(promises) {
			return Promise.all(promises.map((p) => Promise.resolve(p).then((value) => ({
				status: "fulfilled",
				value
			}), (reason) => ({
				status: "rejected",
				reason
			}))));
		}
		function importMetaResolve(specifier) {
			if (import.meta.resolve) return new URL(import.meta.resolve(specifier));
			return new URL(
				specifier,
				/** #__KEEP__ */
				import.meta.url
			);
		}
		promise = allSettled(deps.map((depString) => {
			depString = assetsURL(depString, importerUrl);
			const dep = importMetaResolve(depString);
			const isCss = isCssPreloadUrl(dep);
			return preloadOnce(seen, dep.href, () => {
				if (preloadedHrefs === void 0) {
					preloadedHrefs = {
						all: /* @__PURE__ */ new Set(),
						styles: /* @__PURE__ */ new Set()
					};
					const links = document.getElementsByTagName("link");
					for (let i = links.length - 1; i >= 0; i--) {
						const link = links[i];
						preloadedHrefs.all.add(link.href);
						if (link.rel === "stylesheet") preloadedHrefs.styles.add(link.href);
					}
				}
				if ((isCss ? preloadedHrefs.styles : preloadedHrefs.all).has(dep.href)) return;
				const link = document.createElement("link");
				link.rel = isCss ? "stylesheet" : scriptRel;
				if (!isCss) link.as = "script";
				link.crossOrigin = "";
				link.href = dep.href;
				if (cspNonce) link.setAttribute("nonce", cspNonce);
				document.head.appendChild(link);
				if (isCss) return new Promise((res, rej) => {
					const handleSettle = (e) => {
						link.removeEventListener("load", handleSettle);
						link.removeEventListener("error", handleSettle);
						if (e.type === "error") rej(/* @__PURE__ */ new Error(`Unable to preload CSS for ${dep}`));
						else res(e);
					};
					link.addEventListener("load", handleSettle);
					link.addEventListener("error", handleSettle);
				});
			});
		}).filter((p) => p !== void 0));
	}
	function handlePreloadError(err) {
		const e = new Event("vite:preloadError", { cancelable: true });
		e.payload = err;
		window.dispatchEvent(e);
		if (!e.defaultPrevented) throw err;
	}
	return promise.then((res) => {
		for (const item of res || []) {
			if (item.status !== "rejected") continue;
			handlePreloadError(item.reason);
		}
		return baseModule().catch(handlePreloadError);
	});
};
// ../../@vite-plugin-pwa/virtual:pwa-register
var autoUpdateMode = "true";
var selfDestroying = "false";
var auto = autoUpdateMode === "true";
var autoDestroy = selfDestroying === "true";
function registerSW(options = {}) {
	const { immediate = false, onNeedReload, onNeedRefresh, onOfflineReady, onRegistered, onRegisteredSW, onRegisterError } = options;
	let wb;
	let registerPromise;
	let sendSkipWaitingMessage;
	const updateServiceWorker = async (_reloadPage = true) => {
		await registerPromise;
		if (!auto) sendSkipWaitingMessage?.();
	};
	async function register() {
		if ("serviceWorker" in navigator) {
			wb = await __vitePreload(async () => {
				const { Workbox } = await import("./workbox-window.prod.es5-CzJxx9q2.js");
				return { Workbox };
			}, []).then(({ Workbox }) => {
				return new Workbox("/sw.js", {
					scope: "/",
					type: "classic"
				});
			}).catch((e) => {
				onRegisterError?.(e);
			});
			if (!wb) return;
			sendSkipWaitingMessage = () => {
				wb?.messageSkipWaiting();
			};
			if (!autoDestroy) {
				if (auto) {
					wb.addEventListener("activated", (event) => {
						if (event.isUpdate || event.isExternal) {
							if (onNeedReload) onNeedReload();
							else window.location.reload();
						}
					});
					wb.addEventListener("installed", (event) => {
						if (!event.isUpdate) onOfflineReady?.();
					});
				} else {
					let onNeedRefreshCalled = false;
					const showSkipWaitingPrompt = () => {
						onNeedRefreshCalled = true;
						wb?.addEventListener("controlling", (event) => {
							if (event.isUpdate) {
								if (onNeedReload) onNeedReload();
								else window.location.reload();
							}
						});
						onNeedRefresh?.();
					};
					wb.addEventListener("installed", (event) => {
						if (typeof event.isUpdate === "undefined") {
							if (typeof event.isExternal !== "undefined") {
								if (event.isExternal) showSkipWaitingPrompt();
								else !onNeedRefreshCalled && onOfflineReady?.();
							} else !onNeedRefreshCalled && onOfflineReady?.();
						} else if (!event.isUpdate) onOfflineReady?.();
					});
					wb.addEventListener("waiting", showSkipWaitingPrompt);
				}
			}
			wb.register({ immediate }).then((r) => {
				if (onRegisteredSW) onRegisteredSW("/sw.js", r);
				else onRegistered?.(r);
			}).catch((e) => {
				onRegisterError?.(e);
			});
		}
	}
	registerPromise = register();
	return updateServiceWorker;
}
// src/components/ErrorBoundary.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var ErrorBoundary = class extends import_react.Component {
	constructor(..._args) {
		super(..._args);
		this.state = {
			hasError: false,
			message: ""
		};
		this.handleReset = () => {
			if (this.isDynamicImportError()) {
				window.location.reload();
				return;
			}
			this.setState({
				hasError: false,
				message: ""
			});
		};
		this.handleGoHome = () => {
			if (this.isDynamicImportError()) {
				window.location.reload();
				return;
			}
			this.setState({
				hasError: false,
				message: ""
			});
			this.props.onGoHome?.();
		};
	}
	static getDerivedStateFromError(error) {
		return {
			hasError: true,
			message: error?.message || "خطأ غير متوقع في عرض الواجهة."
		};
	}
	componentDidCatch(error, info) {
		console.error("[NEMVIA ErrorBoundary]", error, info.componentStack);
	}
	componentDidUpdate(prevProps) {
		if (this.state.hasError && prevProps.resetKey !== this.props.resetKey) this.setState({
			hasError: false,
			message: ""
		});
	}
	isDynamicImportError() {
		return /Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module|Loading chunk [\d]+ failed/i.test(this.state.message);
	}
	render() {
		if (!this.state.hasError) return this.props.children;
		const isChunkErr = this.isDynamicImportError();
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			dir: "rtl",
			className: "min-h-[60dvh] flex items-center justify-center p-6 font-['Cairo',sans-serif]",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-w-md w-full bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 text-center space-y-4 shadow-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-12 h-12 mx-auto rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "w-6 h-6" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-lg font-black text-slate-900",
							children: isChunkErr ? "تم تحديث ملفات المنصة" : "حدث خطأ غير متوقع"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-slate-600 leading-relaxed",
							children: isChunkErr ? "توفرت نسخة محدّثة من هذه الشاشة أو انقطع الاتصال مؤقتاً أثناء تحميلها. أعد التحميل للمتابعة." : "واجهت هذه الشاشة خللاً مفاجئاً. يمكنك المحاولة مجدداً أو العودة للشاشة الرئيسية."
						})]
					}),
					this.state.message && !isChunkErr && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						dir: "auto",
						className: "text-[11px] font-mono text-slate-500 bg-slate-50 border border-slate-200 rounded-xl p-2.5 break-words",
						children: this.state.message
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-center gap-2 pt-1",
						children: [this.props.onGoHome && !isChunkErr && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: this.handleGoHome,
							className: "min-h-[44px] px-4 py-2.5 bg-[#1677c7] hover:bg-[#125fa0] text-white font-bold text-xs rounded-xl inline-flex items-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(House, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "العودة للرئيسية" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: this.props.onGoHome && !isChunkErr ? this.handleReset : () => window.location.reload(),
							className: "min-h-[44px] px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl inline-flex items-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCw, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: this.props.onGoHome && !isChunkErr ? "إعادة المحاولة" : "تحديث التطبيق الآن" })]
						})]
					})
				]
			})
		});
	}
};
// src/lib/lazyWithRetry.ts
var RELOAD_STAMP_KEY = "nemvia:chunk_reload_at";
function isChunkLoadError(err) {
	const msg = String(err?.message || err || "");
	return /Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module|Loading chunk [\d]+ failed/i.test(msg);
}
function lazyWithRetry(factory) {
	return (0, import_react.lazy)(async () => {
		let lastError;
		const delays = [250, 650];
		for (let attempt = 0; attempt <= delays.length; attempt++) try {
			return await factory();
		} catch (err) {
			lastError = err;
			if (!isChunkLoadError(err) || attempt === delays.length) break;
			await new Promise((resolve) => window.setTimeout(resolve, delays[attempt]));
		}
		if (typeof window !== "undefined" && isChunkLoadError(lastError)) try {
			const lastReload = Number(sessionStorage.getItem(RELOAD_STAMP_KEY) || "0");
			const now = Date.now();
			if (!lastReload || now - lastReload > 15e3) {
				sessionStorage.setItem(RELOAD_STAMP_KEY, String(now));
				window.location.reload();
				return await new Promise(() => {});
			}
		} catch {}
		throw lastError;
	});
}
// node_modules/@capacitor/core/dist/index.js
/*! Capacitor: https://capacitorjs.com/ - MIT License */
var ExceptionCode;
(function(ExceptionCode) {
	/**
	* API is not implemented.
	*
	* This usually means the API can't be used because it is not implemented for
	* the current platform.
	*/
	ExceptionCode["Unimplemented"] = "UNIMPLEMENTED";
	/**
	* API is not available.
	*
	* This means the API can't be used right now because:
	*   - it is currently missing a prerequisite, such as network connectivity
	*   - it requires a particular platform or browser version
	*/
	ExceptionCode["Unavailable"] = "UNAVAILABLE";
})(ExceptionCode || (ExceptionCode = {}));
var CapacitorException = class extends Error {
	constructor(message, code, data) {
		super(message);
		this.message = message;
		this.code = code;
		this.data = data;
	}
};
var getPlatformId = (win) => {
	var _a, _b;
	if (win === null || win === void 0 ? void 0 : win.androidBridge) return "android";
	else if ((_b = (_a = win === null || win === void 0 ? void 0 : win.webkit) === null || _a === void 0 ? void 0 : _a.messageHandlers) === null || _b === void 0 ? void 0 : _b.bridge) return "ios";
	else return "web";
};
var createCapacitor = (win) => {
	const capCustomPlatform = win.CapacitorCustomPlatform || null;
	const cap = win.Capacitor || {};
	const Plugins = cap.Plugins = cap.Plugins || {};
	const getPlatform = () => {
		return capCustomPlatform !== null ? capCustomPlatform.name : getPlatformId(win);
	};
	const isNativePlatform = () => getPlatform() !== "web";
	const isPluginAvailable = (pluginName) => {
		const plugin = registeredPlugins.get(pluginName);
		if (plugin === null || plugin === void 0 ? void 0 : plugin.platforms.has(getPlatform())) return true;
		if (getPluginHeader(pluginName)) return true;
		return false;
	};
	const getPluginHeader = (pluginName) => {
		var _a;
		return (_a = cap.PluginHeaders) === null || _a === void 0 ? void 0 : _a.find((h) => h.name === pluginName);
	};
	const handleError = (err) => win.console.error(err);
	const registeredPlugins = /* @__PURE__ */ new Map();
	const registerPlugin = (pluginName, jsImplementations = {}) => {
		const registeredPlugin = registeredPlugins.get(pluginName);
		if (registeredPlugin) {
			console.warn(`Capacitor plugin "${pluginName}" already registered. Cannot register plugins twice.`);
			return registeredPlugin.proxy;
		}
		const platform = getPlatform();
		const pluginHeader = getPluginHeader(pluginName);
		let jsImplementation;
		const loadPluginImplementation = async () => {
			if (!jsImplementation && platform in jsImplementations) jsImplementation = typeof jsImplementations[platform] === "function" ? jsImplementation = await jsImplementations[platform]() : jsImplementation = jsImplementations[platform];
			else if (capCustomPlatform !== null && !jsImplementation && "web" in jsImplementations) jsImplementation = typeof jsImplementations["web"] === "function" ? jsImplementation = await jsImplementations["web"]() : jsImplementation = jsImplementations["web"];
			return jsImplementation;
		};
		const createPluginMethod = (impl, prop) => {
			var _a, _b;
			if (pluginHeader) {
				const methodHeader = pluginHeader === null || pluginHeader === void 0 ? void 0 : pluginHeader.methods.find((m) => prop === m.name);
				if (methodHeader) {
					if (methodHeader.rtype === "promise") return (options) => cap.nativePromise(pluginName, prop.toString(), options);
					else return (options, callback) => cap.nativeCallback(pluginName, prop.toString(), options, callback);
				} else if (impl) return (_a = impl[prop]) === null || _a === void 0 ? void 0 : _a.bind(impl);
			} else if (impl) return (_b = impl[prop]) === null || _b === void 0 ? void 0 : _b.bind(impl);
			else throw new CapacitorException(`"${pluginName}" plugin is not implemented on ${platform}`, ExceptionCode.Unimplemented);
		};
		const createPluginMethodWrapper = (prop) => {
			let remove;
			const wrapper = (...args) => {
				const p = loadPluginImplementation().then((impl) => {
					const fn = createPluginMethod(impl, prop);
					if (fn) {
						const p = fn(...args);
						remove = p === null || p === void 0 ? void 0 : p.remove;
						return p;
					} else throw new CapacitorException(`"${pluginName}.${prop}()" is not implemented on ${platform}`, ExceptionCode.Unimplemented);
				});
				if (prop === "addListener") p.remove = async () => remove();
				return p;
			};
			wrapper.toString = () => `${prop.toString()}() { [capacitor code] }`;
			Object.defineProperty(wrapper, "name", {
				value: prop,
				writable: false,
				configurable: false
			});
			return wrapper;
		};
		const addListener = createPluginMethodWrapper("addListener");
		const removeListener = createPluginMethodWrapper("removeListener");
		const addListenerNative = (eventName, callback) => {
			const call = addListener({ eventName }, callback);
			const remove = async () => {
				const callbackId = await call;
				removeListener({
					eventName,
					callbackId
				}, callback);
			};
			const p = new Promise((resolve) => call.then(() => resolve({ remove })));
			p.remove = async () => {
				console.warn(`Using addListener() without 'await' is deprecated.`);
				await remove();
			};
			return p;
		};
		const proxy = new Proxy({}, { get(_, prop) {
			switch (prop) {
				case "$$typeof": return;
				case "toJSON": return () => ({});
				case "addListener": return pluginHeader ? addListenerNative : addListener;
				case "removeListener": return removeListener;
				default: return createPluginMethodWrapper(prop);
			}
		} });
		Plugins[pluginName] = proxy;
		registeredPlugins.set(pluginName, {
			name: pluginName,
			proxy,
			platforms: /* @__PURE__ */ new Set([...Object.keys(jsImplementations), ...pluginHeader ? [platform] : []])
		});
		return proxy;
	};
	if (!cap.convertFileSrc) cap.convertFileSrc = (filePath) => filePath;
	cap.getPlatform = getPlatform;
	cap.handleError = handleError;
	cap.isNativePlatform = isNativePlatform;
	cap.isPluginAvailable = isPluginAvailable;
	cap.registerPlugin = registerPlugin;
	cap.Exception = CapacitorException;
	cap.DEBUG = !!cap.DEBUG;
	cap.isLoggingEnabled = !!cap.isLoggingEnabled;
	return cap;
};
var initCapacitorGlobal = (win) => win.Capacitor = createCapacitor(win);
var Capacitor = /*#__PURE__*/ initCapacitorGlobal(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
var registerPlugin = Capacitor.registerPlugin;
/**
* Base class web plugins should extend.
*/
var WebPlugin = class {
	constructor() {
		this.listeners = {};
		this.retainedEventArguments = {};
		this.windowListeners = {};
	}
	addListener(eventName, listenerFunc) {
		let firstListener = false;
		if (!this.listeners[eventName]) {
			this.listeners[eventName] = [];
			firstListener = true;
		}
		this.listeners[eventName].push(listenerFunc);
		const windowListener = this.windowListeners[eventName];
		if (windowListener && !windowListener.registered) this.addWindowListener(windowListener);
		if (firstListener) this.sendRetainedArgumentsForEvent(eventName);
		const remove = async () => this.removeListener(eventName, listenerFunc);
		return Promise.resolve({ remove });
	}
	async removeAllListeners() {
		this.listeners = {};
		for (const listener in this.windowListeners) this.removeWindowListener(this.windowListeners[listener]);
		this.windowListeners = {};
	}
	notifyListeners(eventName, data, retainUntilConsumed) {
		const listeners = this.listeners[eventName];
		if (!listeners) {
			if (retainUntilConsumed) {
				let args = this.retainedEventArguments[eventName];
				if (!args) args = [];
				args.push(data);
				this.retainedEventArguments[eventName] = args;
			}
			return;
		}
		listeners.forEach((listener) => listener(data));
	}
	hasListeners(eventName) {
		var _a;
		return !!((_a = this.listeners[eventName]) === null || _a === void 0 ? void 0 : _a.length);
	}
	registerWindowListener(windowEventName, pluginEventName) {
		this.windowListeners[pluginEventName] = {
			registered: false,
			windowEventName,
			pluginEventName,
			handler: (event) => {
				this.notifyListeners(pluginEventName, event);
			}
		};
	}
	unimplemented(msg = "not implemented") {
		return new Capacitor.Exception(msg, ExceptionCode.Unimplemented);
	}
	unavailable(msg = "not available") {
		return new Capacitor.Exception(msg, ExceptionCode.Unavailable);
	}
	async removeListener(eventName, listenerFunc) {
		const listeners = this.listeners[eventName];
		if (!listeners) return;
		const index = listeners.indexOf(listenerFunc);
		this.listeners[eventName].splice(index, 1);
		if (!this.listeners[eventName].length) this.removeWindowListener(this.windowListeners[eventName]);
	}
	addWindowListener(handle) {
		window.addEventListener(handle.windowEventName, handle.handler);
		handle.registered = true;
	}
	removeWindowListener(handle) {
		if (!handle) return;
		window.removeEventListener(handle.windowEventName, handle.handler);
		handle.registered = false;
	}
	sendRetainedArgumentsForEvent(eventName) {
		const args = this.retainedEventArguments[eventName];
		if (!args) return;
		delete this.retainedEventArguments[eventName];
		args.forEach((arg) => {
			this.notifyListeners(eventName, arg);
		});
	}
};
/******** END WEB VIEW PLUGIN ********/
/******** COOKIES PLUGIN ********/
/**
* Safely web encode a string value (inspired by js-cookie)
* @param str The string value to encode
*/
var encode = (str) => encodeURIComponent(str).replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent).replace(/[()]/g, escape);
/**
* Safely web decode a string value (inspired by js-cookie)
* @param str The string value to decode
*/
var decode = (str) => str.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent);
var CapacitorCookiesPluginWeb = class extends WebPlugin {
	async getCookies() {
		const cookies = document.cookie;
		const cookieMap = {};
		cookies.split(";").forEach((cookie) => {
			if (cookie.length <= 0) return;
			let [key, value] = cookie.replace(/=/, "CAP_COOKIE").split("CAP_COOKIE");
			key = decode(key).trim();
			value = decode(value).trim();
			cookieMap[key] = value;
		});
		return cookieMap;
	}
	async setCookie(options) {
		try {
			const encodedKey = encode(options.key);
			const encodedValue = encode(options.value);
			const expires = options.expires ? `; expires=${options.expires.replace("expires=", "")}` : "";
			const path = (options.path || "/").replace("path=", "");
			const domain = options.url != null && options.url.length > 0 ? `domain=${options.url}` : "";
			document.cookie = `${encodedKey}=${encodedValue || ""}${expires}; path=${path}; ${domain};`;
		} catch (error) {
			return Promise.reject(error);
		}
	}
	async deleteCookie(options) {
		try {
			document.cookie = `${options.key}=; Max-Age=0`;
		} catch (error) {
			return Promise.reject(error);
		}
	}
	async clearCookies() {
		try {
			const cookies = document.cookie.split(";") || [];
			for (const cookie of cookies) document.cookie = cookie.replace(/^ +/, "").replace(/=.*/, `=;expires=${(/* @__PURE__ */ new Date()).toUTCString()};path=/`);
		} catch (error) {
			return Promise.reject(error);
		}
	}
	async clearAllCookies() {
		try {
			await this.clearCookies();
		} catch (error) {
			return Promise.reject(error);
		}
	}
};
registerPlugin("CapacitorCookies", { web: () => new CapacitorCookiesPluginWeb() });
/**
* Read in a Blob value and return it as a base64 string
* @param blob The blob value to convert to a base64 string
*/
var readBlobAsBase64 = async (blob) => new Promise((resolve, reject) => {
	const reader = new FileReader();
	reader.onload = () => {
		const base64String = reader.result;
		resolve(base64String.indexOf(",") >= 0 ? base64String.split(",")[1] : base64String);
	};
	reader.onerror = (error) => reject(error);
	reader.readAsDataURL(blob);
});
/**
* Normalize an HttpHeaders map by lowercasing all of the values
* @param headers The HttpHeaders object to normalize
*/
var normalizeHttpHeaders = (headers = {}) => {
	const originalKeys = Object.keys(headers);
	return Object.keys(headers).map((k) => k.toLocaleLowerCase()).reduce((acc, key, index) => {
		acc[key] = headers[originalKeys[index]];
		return acc;
	}, {});
};
/**
* Builds a string of url parameters that
* @param params A map of url parameters
* @param shouldEncode true if you should encodeURIComponent() the values (true by default)
*/
var buildUrlParams = (params, shouldEncode = true) => {
	if (!params) return null;
	return Object.entries(params).reduce((accumulator, entry) => {
		const [key, value] = entry;
		let encodedValue;
		let item;
		if (Array.isArray(value)) {
			item = "";
			value.forEach((str) => {
				encodedValue = shouldEncode ? encodeURIComponent(str) : str;
				item += `${key}=${encodedValue}&`;
			});
			item.slice(0, -1);
		} else {
			encodedValue = shouldEncode ? encodeURIComponent(value) : value;
			item = `${key}=${encodedValue}`;
		}
		return `${accumulator}&${item}`;
	}, "").substr(1);
};
/**
* Build the RequestInit object based on the options passed into the initial request
* @param options The Http plugin options
* @param extra Any extra RequestInit values
*/
var buildRequestInit = (options, extra = {}) => {
	const output = Object.assign({
		method: options.method || "GET",
		headers: options.headers
	}, extra);
	const type = normalizeHttpHeaders(options.headers)["content-type"] || "";
	if (typeof options.data === "string") output.body = options.data;
	else if (type.includes("application/x-www-form-urlencoded")) {
		const params = new URLSearchParams();
		for (const [key, value] of Object.entries(options.data || {})) params.set(key, value);
		output.body = params.toString();
	} else if (type.includes("multipart/form-data") || options.data instanceof FormData) {
		const form = new FormData();
		if (options.data instanceof FormData) options.data.forEach((value, key) => {
			form.append(key, value);
		});
		else for (const key of Object.keys(options.data)) form.append(key, options.data[key]);
		output.body = form;
		const headers = new Headers(output.headers);
		headers.delete("content-type");
		output.headers = headers;
	} else if (type.includes("application/json") || typeof options.data === "object") output.body = JSON.stringify(options.data);
	return output;
};
var CapacitorHttpPluginWeb = class extends WebPlugin {
	/**
	* Perform an Http request given a set of options
	* @param options Options to build the HTTP request
	*/
	async request(options) {
		const requestInit = buildRequestInit(options, options.webFetchExtra);
		const urlParams = buildUrlParams(options.params, options.shouldEncodeUrlParams);
		const url = urlParams ? `${options.url}?${urlParams}` : options.url;
		const response = await fetch(url, requestInit);
		const contentType = response.headers.get("content-type") || "";
		let { responseType = "text" } = response.ok ? options : {};
		if (contentType.includes("application/json")) responseType = "json";
		let data;
		let blob;
		switch (responseType) {
			case "arraybuffer":
			case "blob":
				blob = await response.blob();
				data = await readBlobAsBase64(blob);
				break;
			case "json":
				data = await response.json();
				break;
			default: data = await response.text();
		}
		const headers = {};
		response.headers.forEach((value, key) => {
			headers[key] = value;
		});
		return {
			data,
			headers,
			status: response.status,
			url: response.url
		};
	}
	/**
	* Perform an Http GET request given a set of options
	* @param options Options to build the HTTP request
	*/
	async get(options) {
		return this.request(Object.assign(Object.assign({}, options), { method: "GET" }));
	}
	/**
	* Perform an Http POST request given a set of options
	* @param options Options to build the HTTP request
	*/
	async post(options) {
		return this.request(Object.assign(Object.assign({}, options), { method: "POST" }));
	}
	/**
	* Perform an Http PUT request given a set of options
	* @param options Options to build the HTTP request
	*/
	async put(options) {
		return this.request(Object.assign(Object.assign({}, options), { method: "PUT" }));
	}
	/**
	* Perform an Http PATCH request given a set of options
	* @param options Options to build the HTTP request
	*/
	async patch(options) {
		return this.request(Object.assign(Object.assign({}, options), { method: "PATCH" }));
	}
	/**
	* Perform an Http DELETE request given a set of options
	* @param options Options to build the HTTP request
	*/
	async delete(options) {
		return this.request(Object.assign(Object.assign({}, options), { method: "DELETE" }));
	}
};
registerPlugin("CapacitorHttp", { web: () => new CapacitorHttpPluginWeb() });
// node_modules/@capacitor/app/dist/esm/index.js
var App$1 = registerPlugin("App", { web: () => __vitePreload(() => import("./web-DHVc76nK.js").then((m) => new m.AppWeb()), []) });
// node_modules/@capacitor/browser/dist/esm/index.js
var Browser = registerPlugin("Browser", { web: () => __vitePreload(() => import("./web-CwjYc5O7.js").then((m) => new m.BrowserWeb()), []) });
// node_modules/@capacitor/synapse/dist/synapse.mjs
function s(t) {
	t.CapacitorUtils.Synapse = new Proxy({}, { get(e, n) {
		return new Proxy({}, { get(w, o) {
			return (c, p, r) => {
				const i = t.Capacitor.Plugins[n];
				if (i === void 0) {
					r(/* @__PURE__ */ new Error(`Capacitor plugin ${n} not found`));
					return;
				}
				if (typeof i[o] != "function") {
					r(/* @__PURE__ */ new Error(`Method ${o} not found in Capacitor plugin ${n}`));
					return;
				}
				(async () => {
					try {
						p(await i[o](c));
					} catch (a) {
						r(a);
					}
				})();
			};
		} });
	} });
}
function u(t) {
	t.CapacitorUtils.Synapse = new Proxy({}, { get(e, n) {
		return t.cordova.plugins[n];
	} });
}
function f(t = !1) {
	typeof window > "u" || (window.CapacitorUtils = window.CapacitorUtils || {}, window.Capacitor !== void 0 && !t ? s(window) : window.cordova !== void 0 && u(window));
}
// node_modules/@capacitor/filesystem/dist/esm/definitions.js
var Directory;
(function(Directory) {
	/**
	* The Documents directory.
	* On iOS it's the app's documents directory.
	* Use this directory to store user-generated content.
	* On Android it's the Public Documents folder, so it's accessible from other apps.
	* It's not accessible on Android 10 unless the app enables legacy External Storage
	* by adding `android:requestLegacyExternalStorage="true"` in the `application` tag
	* in the `AndroidManifest.xml`.
	* On Android 11 or newer the app can only access the files/folders the app created.
	*
	* @since 1.0.0
	*/
	Directory["Documents"] = "DOCUMENTS";
	/**
	* The Data directory.
	* On iOS it will use the Documents directory.
	* On Android it's the directory holding application files.
	* Files will be deleted when the application is uninstalled.
	*
	* @since 1.0.0
	*/
	Directory["Data"] = "DATA";
	/**
	* The Library directory.
	* On iOS it will use the Library directory.
	* On Android it's the directory holding application files.
	* Files will be deleted when the application is uninstalled.
	*
	* @since 1.1.0
	*/
	Directory["Library"] = "LIBRARY";
	/**
	* The Cache directory.
	* Can be deleted in cases of low memory, so use this directory to write app-specific files.
	* that your app can re-create easily.
	*
	* @since 1.0.0
	*/
	Directory["Cache"] = "CACHE";
	/**
	* The external directory.
	* On iOS it will use the Documents directory.
	* On Android it's the directory on the primary shared/external
	* storage device where the application can place persistent files it owns.
	* These files are internal to the applications, and not typically visible
	* to the user as media.
	* Files will be deleted when the application is uninstalled.
	*
	* @since 1.0.0
	*/
	Directory["External"] = "EXTERNAL";
	/**
	* The external storage directory.
	* On iOS it will use the Documents directory.
	* On Android it's the primary shared/external storage directory.
	* It's not accessible on Android 10 unless the app enables legacy External Storage
	* by adding `android:requestLegacyExternalStorage="true"` in the `application` tag
	* in the `AndroidManifest.xml`.
	* It's not accessible on Android 11 or newer.
	*
	* @since 1.0.0
	*/
	Directory["ExternalStorage"] = "EXTERNAL_STORAGE";
	/**
	* The external cache directory.
	* On iOS it will use the Documents directory.
	* On Android it's the primary shared/external cache.
	*
	* @since 7.1.0
	*/
	Directory["ExternalCache"] = "EXTERNAL_CACHE";
	/**
	* The Library directory without cloud backup. Used in iOS.
	* On Android it's the directory holding application files.
	*
	* @since 7.1.0
	*/
	Directory["LibraryNoCloud"] = "LIBRARY_NO_CLOUD";
	/**
	* A temporary directory for iOS.
	* On Android it's the directory holding the application cache.
	*
	* @since 7.1.0
	*/
	Directory["Temporary"] = "TEMPORARY";
})(Directory || (Directory = {}));
var Encoding;
(function(Encoding) {
	/**
	* Eight-bit UCS Transformation Format
	*
	* @since 1.0.0
	*/
	Encoding["UTF8"] = "utf8";
	/**
	* Seven-bit ASCII, a.k.a. ISO646-US, a.k.a. the Basic Latin block of the
	* Unicode character set
	* This encoding is only supported on Android.
	*
	* @since 1.0.0
	*/
	Encoding["ASCII"] = "ascii";
	/**
	* Sixteen-bit UCS Transformation Format, byte order identified by an
	* optional byte-order mark
	* This encoding is only supported on Android.
	*
	* @since 1.0.0
	*/
	Encoding["UTF16"] = "utf16";
})(Encoding || (Encoding = {}));
// node_modules/@capacitor/filesystem/dist/esm/index.js
var Filesystem = registerPlugin("Filesystem", { web: () => __vitePreload(() => import("./web-DzcN3AUh.js").then((m) => new m.FilesystemWeb()), []) });
f();
// node_modules/@capacitor/share/dist/esm/index.js
var Share = registerPlugin("Share", { web: () => __vitePreload(() => import("./web-BzlbNObS.js").then((m) => new m.ShareWeb()), []) });
// node_modules/@capacitor/splash-screen/dist/esm/index.js
var SplashScreen = registerPlugin("SplashScreen", { web: () => __vitePreload(() => import("./web-_hoTkXyH.js").then((m) => new m.SplashScreenWeb()), []) });
// node_modules/@capacitor/status-bar/dist/esm/definitions.js
var Style;
(function(Style) {
	/**
	* Light text for dark backgrounds.
	*
	* @since 1.0.0
	*/
	Style["Dark"] = "DARK";
	/**
	* Dark text for light backgrounds.
	*
	* @since 1.0.0
	*/
	Style["Light"] = "LIGHT";
	/**
	* The style is based on the device appearance.
	* If the device is using Dark mode, the statusbar text will be light.
	* If the device is using Light mode, the statusbar text will be dark.
	*
	* @since 1.0.0
	*/
	Style["Default"] = "DEFAULT";
})(Style || (Style = {}));
var Animation;
(function(Animation) {
	/**
	* No animation during show/hide.
	*
	* @since 1.0.0
	*/
	Animation["None"] = "NONE";
	/**
	* Slide animation during show/hide.
	* It doesn't work on iOS 15+.
	*
	* @deprecated Use Animation.Fade or Animation.None instead.
	*
	* @since 1.0.0
	*/
	Animation["Slide"] = "SLIDE";
	/**
	* Fade animation during show/hide.
	*
	* @since 1.0.0
	*/
	Animation["Fade"] = "FADE";
})(Animation || (Animation = {}));
// node_modules/@capacitor/status-bar/dist/esm/index.js
var StatusBar = registerPlugin("StatusBar");
// src/lib/native.ts
var ANDROID_AUTH_REDIRECT_URL = "com.nemvia.app://auth-callback";
var DEFAULT_REMOTE_API_BASE = "https://nemvia-app.onrender.com";
function isNativeApp() {
	try {
		return Capacitor.isNativePlatform();
	} catch {
		return false;
	}
}
function getApiBaseUrl() {
	const configured = "postgresql://postgres:[YOUR-PASSWORD]@db.lurvkowyzgjhdugmixej.supabase.co:5432/postgres".trim().replace(/\/+$/, "");
	if (isNativeApp()) return configured || DEFAULT_REMOTE_API_BASE;
	return configured;
}
function getRemoteAppBaseUrl() {
	return "postgresql://postgres:[YOUR-PASSWORD]@db.lurvkowyzgjhdugmixej.supabase.co:5432/postgres".trim().replace(/\/+$/, "") || DEFAULT_REMOTE_API_BASE;
}
function resolveApiUrl(path) {
	if (/^https?:\/\//i.test(path)) return path;
	const normalized = path.startsWith("/") ? path : `/${path}`;
	const base = getApiBaseUrl();
	return base ? `${base}${normalized}` : normalized;
}
async function openExternalUrl(url) {
	if (!url) return;
	if (isNativeApp()) try {
		await Browser.open({
			url,
			toolbarColor: "#0f233a"
		});
		return;
	} catch {}
	window.open(url, "_blank", "noopener,noreferrer");
}
function blobToBase64(blob) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onerror = () => reject(/* @__PURE__ */ new Error("Failed to read file data"));
		reader.onload = () => {
			const result = String(reader.result || "");
			const comma = result.indexOf(",");
			resolve(comma >= 0 ? result.slice(comma + 1) : result);
		};
		reader.readAsDataURL(blob);
	});
}
async function saveOrShareBlobFile(blob, filename) {
	const safeFilename = (filename || "nemvia-file").replace(/[\\/:*?"<>|]+/g, "_");
	if (isNativeApp()) try {
		const base64 = await blobToBase64(blob);
		const written = await Filesystem.writeFile({
			path: safeFilename,
			data: base64,
			directory: Directory.Cache,
			recursive: true
		});
		await Share.share({
			title: safeFilename,
			url: written.uri,
			dialogTitle: safeFilename
		});
		return;
	} catch {}
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = safeFilename;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	window.setTimeout(() => URL.revokeObjectURL(url), 1500);
}
async function shareAppLink(title, text, url) {
	if (isNativeApp()) try {
		await Share.share({
			title,
			text,
			url,
			dialogTitle: title
		});
		return;
	} catch {}
	if (typeof navigator !== "undefined" && navigator.share) try {
		await navigator.share({
			title,
			text,
			url
		});
		return;
	} catch {}
	if (typeof navigator !== "undefined" && navigator.clipboard) await navigator.clipboard.writeText(url).catch(() => {});
}
async function syncNativeStatusBar(theme) {
	if (!isNativeApp()) return;
	try {
		await StatusBar.setOverlaysWebView({ overlay: false });
		if (theme === "dark") {
			await StatusBar.setBackgroundColor({ color: "#111827" });
			await StatusBar.setStyle({ style: Style.Dark });
		} else if (theme === "warm") {
			await StatusBar.setBackgroundColor({ color: "#fffdf8" });
			await StatusBar.setStyle({ style: Style.Light });
		} else {
			await StatusBar.setBackgroundColor({ color: "#ffffff" });
			await StatusBar.setStyle({ style: Style.Light });
		}
	} catch {}
}
function initNativeAndroidShell(options) {
	if (!isNativeApp()) return () => {};
	const listeners = [];
	let disposed = false;
	(async () => {
		await syncNativeStatusBar(options.initialTheme || "light");
		try {
			await SplashScreen.hide();
		} catch {}
	})();
	const onDocumentClick = (e) => {
		const anchor = e.target?.closest("a[href]");
		if (!anchor) return;
		const href = anchor.getAttribute("href") || "";
		if (anchor.target === "_blank" && /^https?:\/\//i.test(href) && !href.startsWith("https://localhost")) {
			e.preventDefault();
			openExternalUrl(href);
		}
	};
	document.addEventListener("click", onDocumentClick, true);
	App$1.addListener("backButton", () => {
		if (!options.onBackButton()) App$1.exitApp();
	}).then((handle) => {
		if (disposed) handle.remove();
		else listeners.push(handle);
	});
	App$1.addListener("appUrlOpen", async ({ url }) => {
		if (url.startsWith("com.nemvia.app://auth-callback")) {
			await Browser.close().catch(() => {});
			try {
				const hashIdx = url.indexOf("#");
				const queryIdx = url.indexOf("?");
				const rawParams = hashIdx >= 0 ? url.slice(hashIdx + 1) : queryIdx >= 0 ? url.slice(queryIdx + 1) : "";
				const params = new URLSearchParams(rawParams);
				const idToken = params.get("id_token") || "";
				const accessToken = params.get("access_token") || "";
				const role = params.get("role") || "";
				if (idToken || accessToken) {
					const payload = {
						idToken,
						accessToken,
						role
					};
					window.__nemviaPendingNativeOAuth = payload;
					window.dispatchEvent(new CustomEvent("nemvia:native-oauth", { detail: payload }));
				}
			} catch {}
			options.onAuthDeepLink?.("signed_in");
			return;
		}
		try {
			const parsed = new URL(url);
			const join = (parsed.searchParams.get("join") || "").trim().toUpperCase();
			const guardian = (parsed.searchParams.get("guardian") || "").trim().toUpperCase();
			const cert = (parsed.searchParams.get("cert") || "").trim().toUpperCase();
			if (join || guardian || cert) window.dispatchEvent(new CustomEvent("nemvia:deep-link", { detail: {
				join,
				guardian,
				cert
			} }));
		} catch {}
	}).then((handle) => {
		if (disposed) handle.remove();
		else listeners.push(handle);
	});
	if (options.onResume) App$1.addListener("appStateChange", ({ isActive }) => {
		if (isActive) options.onResume?.();
	}).then((handle) => {
		if (disposed) handle.remove();
		else listeners.push(handle);
	});
	return () => {
		disposed = true;
		document.removeEventListener("click", onDocumentClick, true);
		listeners.forEach((l) => void l.remove());
	};
}
// src/lib/settings.ts
var DEFAULT_SETTINGS = {
	lang: "ar",
	theme: "light",
	accent: "blue",
	fontScale: "md",
	compactMode: false,
	reducedMotion: false,
	chimeTone: "classic",
	autoReadAloud: false
};
var SETTINGS_KEY = "nemvia-app-settings";
var SETTINGS_EVENT = "nemvia-settings-updated";
var ACCENT_OPTIONS = [
	{
		id: "blue",
		labelAr: "أزرق سماوي",
		labelEn: "Sky Blue",
		labelFr: "Bleu ciel",
		hex: "#1677c7"
	},
	{
		id: "emerald",
		labelAr: "أخضر زمردي",
		labelEn: "Emerald",
		labelFr: "Émeraude",
		hex: "#059669"
	},
	{
		id: "violet",
		labelAr: "بنفسجي ملكي",
		labelEn: "Violet",
		labelFr: "Violet",
		hex: "#7c3aed"
	},
	{
		id: "amber",
		labelAr: "كهرماني دافئ",
		labelEn: "Amber",
		labelFr: "Ambre",
		hex: "#d97706"
	},
	{
		id: "rose",
		labelAr: "وردي قرمزي",
		labelEn: "Rose",
		labelFr: "Rose",
		hex: "#e11d48"
	},
	{
		id: "slate",
		labelAr: "كحلي كلاسيكي",
		labelEn: "Classic Slate",
		labelFr: "Ardoise",
		hex: "#0f172a"
	}
];
function loadAppSettings() {
	try {
		const raw = localStorage.getItem(SETTINGS_KEY);
		if (!raw) return DEFAULT_SETTINGS;
		return {
			...DEFAULT_SETTINGS,
			...JSON.parse(raw)
		};
	} catch {
		return DEFAULT_SETTINGS;
	}
}
function applySettingsToDOM(s) {
	if (typeof document === "undefined") return;
	const root = document.documentElement;
	root.lang = s.lang;
	root.dir = s.lang === "ar" ? "rtl" : "ltr";
	root.classList.remove("theme-dark", "theme-warm");
	if (s.theme === "dark") root.classList.add("theme-dark");
	else if (s.theme === "warm") root.classList.add("theme-warm");
	root.setAttribute("data-accent", s.accent);
	root.setAttribute("data-font-scale", s.fontScale);
	root.setAttribute("data-density", s.compactMode ? "compact" : "comfortable");
	root.setAttribute("data-reduced-motion", s.reducedMotion ? "1" : "0");
	syncNativeStatusBar(s.theme);
}
function saveAppSettings(next) {
	try {
		localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
	} catch {}
	applySettingsToDOM(next);
	if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent(SETTINGS_EVENT, { detail: next }));
}
function useAppSettings() {
	const [settings, setSettings] = (0, import_react.useState)(() => loadAppSettings());
	(0, import_react.useEffect)(() => {
		applySettingsToDOM(settings);
		const handler = (ev) => {
			const detail = ev.detail;
			if (detail) setSettings(detail);
		};
		window.addEventListener(SETTINGS_EVENT, handler);
		return () => window.removeEventListener(SETTINGS_EVENT, handler);
	}, []);
	const updateSettings = (patch) => {
		const merged = {
			...loadAppSettings(),
			...patch
		};
		setSettings(merged);
		saveAppSettings(merged);
	};
	const resetSettings = () => {
		setSettings(DEFAULT_SETTINGS);
		saveAppSettings(DEFAULT_SETTINGS);
	};
	return {
		settings,
		updateSettings,
		resetSettings
	};
}
var UI_COPY = {
	ar: {
		nav: {
			home: "الرئيسية والمتابعة",
			ai: "المعلّم الذكي (AI)",
			classes: "الصفوف والمجموعات",
			courses: "المحتوى والاختبارات",
			calendar: "التقويم والمواعيد",
			grades: "سجل الدرجات",
			tools: "أدوات الدراسة والمختبر",
			flashcards: "بطاقات المراجعة (Flashcards)",
			pomodoro: "غرفة التركيز بومودورو",
			grapher: "محاكي الدوال والمختبر",
			certificate: "شهادة الإنجاز",
			badges: "لوحة الشرف والأوسمة",
			assignments: "الواجبات والتسليمات",
			community: "المجتمع والقصص 24h",
			live: "الحصص المباشرة",
			messages: "المجموعات وخزينة الملفات",
			admin: "لوحة الإدارة والأمان",
			profile: "ملفي الشخصي",
			settings: "الإعدادات والتخصيص",
			legal: "الخصوصية والشروط"
		},
		header: {
			aiAssistant: "المساعد الذكي",
			days: "أيام",
			roleTeacher: "معلم",
			roleAdmin: "إدارة",
			roleStudent: "طالب",
			signOut: "تسجيل الخروج",
			settings: "الإعدادات",
			notifications: "الإشعارات",
			unread: "جديد",
			markAllRead: "قراءة الكل",
			close: "إغلاق",
			noNotifications: "لا توجد إشعارات بعد",
			newBadge: "جديد",
			soundOn: "الصوت مفعّل",
			soundOff: "الصوت صامت",
			testChime: "تجربة الرنّة",
			deviceAlertsOn: "تنبيهات الجهاز ✓",
			deviceAlertsOff: "تنبيهات الجهاز (موقفة)",
			enableDeviceAlerts: "تفعيل تنبيهات الجهاز",
			search: "بحث شامل"
		},
		mobile: {
			home: "الرئيسية",
			classes: "الصفوف",
			assignments: "الواجبات",
			community: "المجتمع",
			messages: "الرسائل",
			more: "المزيد",
			close: "إغلاق"
		}
	},
	en: {
		nav: {
			home: "Home & Overview",
			ai: "AI Tutor Studio",
			classes: "Classes & Groups",
			courses: "Courses & Quizzes",
			calendar: "Calendar & Schedule",
			grades: "Gradebook",
			tools: "Study Tools & Lab",
			flashcards: "Smart Flashcards",
			pomodoro: "Pomodoro Focus",
			grapher: "Math Grapher Lab",
			certificate: "Certificates",
			badges: "Badges & Honors",
			assignments: "Assignments",
			community: "Community & Stories",
			live: "Live Classroom",
			messages: "Messages & Vault",
			admin: "Admin & Safety",
			profile: "My Profile",
			settings: "Settings & Theme",
			legal: "Privacy & Terms"
		},
		header: {
			aiAssistant: "AI Tutor",
			days: "days",
			roleTeacher: "Teacher",
			roleAdmin: "Admin",
			roleStudent: "Student",
			signOut: "Sign Out",
			settings: "Settings",
			notifications: "Notifications",
			unread: "new",
			markAllRead: "Mark all read",
			close: "Close",
			noNotifications: "No notifications yet",
			newBadge: "New",
			soundOn: "Sound On",
			soundOff: "Muted",
			testChime: "Test Chime",
			deviceAlertsOn: "Device Alerts ✓",
			deviceAlertsOff: "Device Alerts (Off)",
			enableDeviceAlerts: "Enable Device Alerts",
			search: "Search"
		},
		mobile: {
			home: "Home",
			classes: "Classes",
			assignments: "Tasks",
			community: "Community",
			messages: "Messages",
			more: "More",
			close: "Close"
		}
	},
	fr: {
		nav: {
			home: "Accueil & Suivi",
			ai: "Tuteur IA",
			classes: "Classes & Groupes",
			courses: "Cours & Quiz",
			calendar: "Calendrier",
			grades: "Relevé de notes",
			tools: "Outils d’étude",
			flashcards: "Cartes Mémoire",
			pomodoro: "Minuteur Pomodoro",
			grapher: "Laboratoire Maths",
			certificate: "Certificats",
			badges: "Badges & Honneurs",
			assignments: "Devoirs",
			community: "Communauté",
			live: "Classe en Direct",
			messages: "Messages & Fichiers",
			admin: "Administration",
			profile: "Mon Profil",
			settings: "Paramètres & Thème",
			legal: "Confidentialité"
		},
		header: {
			aiAssistant: "Tuteur IA",
			days: "jours",
			roleTeacher: "Enseignant",
			roleAdmin: "Admin",
			roleStudent: "Étudiant",
			signOut: "Déconnexion",
			settings: "Paramètres",
			notifications: "Notifications",
			unread: "nouveau",
			markAllRead: "Tout lire",
			close: "Fermer",
			noNotifications: "Aucune notification",
			newBadge: "Nouveau",
			soundOn: "Son activé",
			soundOff: "Muet",
			testChime: "Tester le son",
			deviceAlertsOn: "Alertes appareil ✓",
			deviceAlertsOff: "Alertes (Désactivé)",
			enableDeviceAlerts: "Activer alertes",
			search: "Rechercher"
		},
		mobile: {
			home: "Accueil",
			classes: "Classes",
			assignments: "Devoirs",
			community: "Réseau",
			messages: "Messages",
			more: "Plus",
			close: "Fermer"
		}
	}
};
// node_modules/@capacitor/local-notifications/dist/esm/definitions.js
/**
* Day of the week. Used for scheduling notifications on a particular weekday.
*/
var Weekday;
(function(Weekday) {
	Weekday[Weekday["Sunday"] = 1] = "Sunday";
	Weekday[Weekday["Monday"] = 2] = "Monday";
	Weekday[Weekday["Tuesday"] = 3] = "Tuesday";
	Weekday[Weekday["Wednesday"] = 4] = "Wednesday";
	Weekday[Weekday["Thursday"] = 5] = "Thursday";
	Weekday[Weekday["Friday"] = 6] = "Friday";
	Weekday[Weekday["Saturday"] = 7] = "Saturday";
})(Weekday || (Weekday = {}));
// node_modules/@capacitor/local-notifications/dist/esm/index.js
var LocalNotifications = registerPlugin("LocalNotifications", { web: () => __vitePreload(() => import("./web-jGZ71319.js").then((m) => new m.LocalNotificationsWeb()), []) });
// src/lib/notifications.ts
var SOUND_PREF_KEY = "nemvia-notif-sound-enabled";
var DESKTOP_PREF_KEY = "nemvia-notif-desktop-enabled";
var NATIVE_CHANNEL_ID = "nemvia-alerts";
var sharedAudioCtx = null;
var unlockBound = false;
var nativeNotifInitialized = false;
var nativeNotifSeq = 100;
function getAudioContext() {
	if (typeof window === "undefined") return null;
	const Ctx = window.AudioContext || window.webkitAudioContext;
	if (!Ctx) return null;
	if (!sharedAudioCtx) sharedAudioCtx = new Ctx();
	if (sharedAudioCtx.state === "suspended") sharedAudioCtx.resume().catch(() => {});
	return sharedAudioCtx;
}
function bindAudioUnlock() {
	if (typeof window === "undefined" || unlockBound) return;
	unlockBound = true;
	const unlock = () => {
		const ctx = getAudioContext();
		if (ctx && ctx.state === "suspended") ctx.resume().catch(() => {});
	};
	window.addEventListener("pointerdown", unlock, { passive: true });
	window.addEventListener("keydown", unlock, { passive: true });
}
function isSoundEnabled() {
	try {
		const raw = localStorage.getItem(SOUND_PREF_KEY);
		return raw === null ? true : raw === "1";
	} catch {
		return true;
	}
}
function setSoundEnabled(enabled) {
	try {
		localStorage.setItem(SOUND_PREF_KEY, enabled ? "1" : "0");
	} catch {}
}
function isDesktopNotifEnabled() {
	try {
		const raw = localStorage.getItem(DESKTOP_PREF_KEY);
		return raw === null ? true : raw === "1";
	} catch {
		return true;
	}
}
function setDesktopNotifEnabled(enabled) {
	try {
		localStorage.setItem(DESKTOP_PREF_KEY, enabled ? "1" : "0");
	} catch {}
}
function getSelectedTone() {
	try {
		const raw = localStorage.getItem("nemvia-app-settings");
		if (raw) {
			const parsed = JSON.parse(raw);
			if (parsed.chimeTone === "soft" || parsed.chimeTone === "bright") return parsed.chimeTone;
		}
	} catch {}
	return "classic";
}
async function initNativeNotifications() {
	if (!isNativeApp() || nativeNotifInitialized) return;
	nativeNotifInitialized = true;
	try {
		await LocalNotifications.createChannel({
			id: NATIVE_CHANNEL_ID,
			name: "إشعارات NEMVIA",
			description: "تنبيهات الرسائل والواجبات والاختبارات والحصص المباشرة",
			importance: 4,
			visibility: 1,
			vibration: true
		});
	} catch {}
	try {
		const perm = await LocalNotifications.checkPermissions();
		if (perm.display === "prompt" || perm.display === "prompt-with-rationale") {
			if ((await LocalNotifications.requestPermissions()).display === "granted") setDesktopNotifEnabled(true);
		} else if (perm.display === "granted") setDesktopNotifEnabled(true);
	} catch {}
	try {
		await LocalNotifications.addListener("localNotificationActionPerformed", (event) => {
			const targetSection = event?.notification?.extra?.targetSection;
			if (typeof targetSection === "string" && targetSection && typeof window !== "undefined") window.dispatchEvent(new CustomEvent("nemvia:open-section", { detail: { targetSection } }));
		});
	} catch {}
}
function playNotificationChime(kind = "message", force = false, toneOverride) {
	if (!force && !isSoundEnabled()) return;
	const ctx = getAudioContext();
	if (!ctx) return;
	const tone = toneOverride || getSelectedTone();
	const scheduleNotes = () => {
		const now = ctx.currentTime;
		let notes;
		if (tone === "soft") notes = kind === "grade" ? [{
			freq: 440,
			delay: 0,
			dur: .16,
			peak: .15,
			type: "sine"
		}, {
			freq: 554.37,
			delay: .12,
			dur: .22,
			peak: .16,
			type: "sine"
		}] : [{
			freq: 523.25,
			delay: 0,
			dur: .14,
			peak: .15,
			type: "sine"
		}, {
			freq: 659.25,
			delay: .11,
			dur: .24,
			peak: .15,
			type: "sine"
		}];
		else if (tone === "bright") notes = [
			{
				freq: 783.99,
				delay: 0,
				dur: .1,
				peak: .2,
				type: "triangle"
			},
			{
				freq: 987.77,
				delay: .08,
				dur: .1,
				peak: .2,
				type: "triangle"
			},
			{
				freq: 1318.51,
				delay: .16,
				dur: .26,
				peak: .22,
				type: "sine"
			}
		];
		else notes = kind === "grade" ? [
			{
				freq: 587.33,
				delay: 0,
				dur: .14,
				peak: .18,
				type: "triangle"
			},
			{
				freq: 739.99,
				delay: .1,
				dur: .16,
				peak: .2,
				type: "triangle"
			},
			{
				freq: 880,
				delay: .2,
				dur: .28,
				peak: .22,
				type: "sine"
			}
		] : kind === "alert" ? [{
			freq: 880,
			delay: 0,
			dur: .14,
			peak: .2,
			type: "sine"
		}, {
			freq: 1174.66,
			delay: .12,
			dur: .24,
			peak: .2,
			type: "sine"
		}] : [{
			freq: 783.99,
			delay: 0,
			dur: .12,
			peak: .22,
			type: "sine"
		}, {
			freq: 1046.5,
			delay: .09,
			dur: .26,
			peak: .22,
			type: "sine"
		}];
		notes.forEach((n) => {
			const osc = ctx.createOscillator();
			const gain = ctx.createGain();
			osc.type = n.type;
			osc.frequency.setValueAtTime(n.freq, now + n.delay);
			gain.gain.setValueAtTime(1e-4, now + n.delay);
			gain.gain.exponentialRampToValueAtTime(n.peak, now + n.delay + .015);
			gain.gain.exponentialRampToValueAtTime(1e-4, now + n.delay + n.dur);
			osc.connect(gain);
			gain.connect(ctx.destination);
			osc.start(now + n.delay);
			osc.stop(now + n.delay + n.dur + .02);
		});
	};
	if (ctx.state === "suspended") ctx.resume().then(scheduleNotes).catch(() => {});
	else scheduleNotes();
	try {
		if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") navigator.vibrate([
			80,
			40,
			80
		]);
	} catch {}
}
async function requestBrowserNotificationPermission() {
	if (isNativeApp()) try {
		if ((await LocalNotifications.requestPermissions()).display === "granted") {
			setDesktopNotifEnabled(true);
			return "granted";
		}
		return "denied";
	} catch {
		return "unsupported";
	}
	if (typeof window === "undefined" || !("Notification" in window)) return "unsupported";
	if (Notification.permission === "granted") {
		setDesktopNotifEnabled(true);
		return "granted";
	}
	const res = await Notification.requestPermission();
	if (res === "granted") setDesktopNotifEnabled(true);
	return res;
}
function showBrowserNotification(title, body, tag = "nemvia-alert", targetSection) {
	if (!isDesktopNotifEnabled()) return;
	if (isNativeApp()) {
		nativeNotifSeq = nativeNotifSeq % 9e5 + 1;
		LocalNotifications.schedule({ notifications: [{
			id: nativeNotifSeq,
			title,
			body,
			channelId: NATIVE_CHANNEL_ID,
			schedule: { at: new Date(Date.now() + 250) },
			extra: {
				tag,
				targetSection
			}
		}] }).catch(() => {});
		return;
	}
	if (typeof window === "undefined" || !("Notification" in window)) return;
	if (Notification.permission !== "granted") return;
	const opts = {
		body,
		tag,
		dir: "rtl",
		lang: "ar",
		silent: true
	};
	if (navigator.serviceWorker?.controller) {
		navigator.serviceWorker.ready.then((reg) => reg.showNotification(title, opts)).catch(() => {
			try {
				new Notification(title, opts);
			} catch {}
		});
		return;
	}
	try {
		new Notification(title, opts);
	} catch {}
}
// src/components/navigation/AppHeader.tsx
var AppHeader = ({ currentProfile, activeSection, notifications, unreadMessagesCount, pendingAssignmentsCount, onMarkNotificationRead, onMarkAllNotificationsRead, onSelectSection, onOpenSearch, onOpenHub }) => {
	const { settings } = useAppSettings();
	const copy = UI_COPY[settings.lang];
	const t = copy.header;
	const [showNotifications, setShowNotifications] = (0, import_react.useState)(false);
	const [soundOn, setSoundOn] = (0, import_react.useState)(() => isSoundEnabled());
	const [desktopOn, setDesktopOn] = (0, import_react.useState)(() => isDesktopNotifEnabled());
	const [notifPerm, setNotifPerm] = (0, import_react.useState)(() => typeof window !== "undefined" && "Notification" in window ? Notification.permission : "unsupported");
	const unreadCount = notifications.filter((n) => !n.read).length;
	const handleToggleSound = () => {
		const next = !soundOn;
		setSoundOn(next);
		setSoundEnabled(next);
		if (next) playNotificationChime("message", true, settings.chimeTone);
	};
	const handleEnableDesktop = async () => {
		if (notifPerm === "granted") {
			const next = !desktopOn;
			setDesktopOn(next);
			setDesktopNotifEnabled(next);
			return;
		}
		const res = await requestBrowserNotificationPermission();
		setNotifPerm(res);
		if (res === "granted") {
			setDesktopOn(true);
			playNotificationChime("alert", true, settings.chimeTone);
		}
	};
	const openNotificationTarget = (n) => {
		onMarkNotificationRead(n.id);
		setShowNotifications(false);
		if (n.kind === "grade") onSelectSection("courses");
		else if (n.kind === "live") onSelectSection("live");
		else if (n.kind === "social") onSelectSection("community");
		else onSelectSection("assignments");
	};
	const centerTabs = [
		{
			id: "home",
			label: copy.mobile.home,
			icon: House
		},
		{
			id: "classes",
			label: copy.mobile.classes,
			icon: BookOpen
		},
		{
			id: "courses",
			label: settings.lang === "en" ? "Quizzes" : settings.lang === "fr" ? "Quiz" : "الاختبارات",
			icon: Award
		},
		{
			id: "assignments",
			label: copy.mobile.assignments,
			icon: FileCheck,
			badge: pendingAssignmentsCount
		},
		{
			id: "community",
			label: copy.mobile.community,
			icon: Users
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
		className: "sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-7xl mx-auto px-3 sm:px-6 h-14 flex items-center justify-between gap-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: onOpenHub,
					title: settings.lang === "en" ? "Open Menu" : "فتح القائمة الشاملة",
					className: "min-h-[40px] flex items-center gap-2 px-1.5 py-1 rounded-xl hover:bg-slate-100 transition-colors shrink-0 cursor-pointer",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-9 h-9 rounded-xl bg-[#1677c7] text-white flex items-center justify-center font-black text-base",
							children: "N"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-black text-base sm:text-lg text-slate-900 tracking-tight whitespace-nowrap",
							children: "NEMVIA"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutGrid, { className: "w-4 h-4 text-slate-400" })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "hidden md:flex items-stretch h-full gap-1",
					children: centerTabs.map((tab) => {
						const Icon = tab.icon;
						const active = activeSection === tab.id;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => onSelectSection(tab.id),
							title: tab.label,
							className: `relative px-4 lg:px-6 flex items-center gap-2 text-xs font-bold whitespace-nowrap shrink-0 border-b-2 transition-colors cursor-pointer ${active ? "border-[#1677c7] text-[#1677c7]" : "border-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-900"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "w-4 h-4" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "hidden lg:inline",
									children: tab.label
								}),
								tab.badge !== void 0 && tab.badge > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "min-w-4 h-4 px-1 rounded-full bg-rose-600 text-white text-[10px] font-black flex items-center justify-center tabular-nums",
									children: tab.badge
								})
							]
						}, tab.id);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 shrink-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: onOpenSearch,
							title: `${t.search} (Ctrl+K)`,
							"aria-label": t.search,
							className: "w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer shrink-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-4 h-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => onSelectSection("messages"),
							title: copy.mobile.messages,
							"aria-label": copy.mobile.messages,
							className: "hidden sm:flex w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 items-center justify-center relative transition-colors cursor-pointer shrink-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "w-4 h-4" }), unreadMessagesCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-rose-600 text-white text-[10px] font-black flex items-center justify-center tabular-nums",
								children: unreadMessagesCount
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative shrink-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => {
									setSoundOn(isSoundEnabled());
									setShowNotifications(!showNotifications);
								},
								className: "w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors relative cursor-pointer",
								"aria-label": t.notifications,
								children: [unreadCount > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BellRing, { className: "w-4 h-4 text-[#1677c7]" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "w-4 h-4" }), unreadCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-rose-600 text-white text-[10px] font-black flex items-center justify-center tabular-nums",
									children: unreadCount
								})]
							}), showNotifications && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: `absolute ${settings.lang === "ar" ? "left-0" : "right-0"} mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-slate-200 shadow-xl p-4 space-y-3 z-50`,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between pb-2 border-b border-slate-100 gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-bold text-xs text-slate-900",
											children: [
												t.notifications,
												" ",
												unreadCount > 0 ? `(${unreadCount} ${t.unread})` : `(${notifications.length})`
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [unreadCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: onMarkAllNotificationsRead,
												className: "text-[11px] font-bold text-[#1677c7] hover:underline flex items-center gap-1 cursor-pointer",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckCheck, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t.markAllRead })]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => setShowNotifications(false),
												className: "text-slate-400 hover:text-slate-600 text-xs cursor-pointer",
												children: t.close
											})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-center gap-1.5 bg-slate-50 p-2 rounded-xl border border-slate-200 text-[11px] font-bold",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: handleToggleSound,
												className: `px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer transition-colors ${soundOn ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-600"}`,
												children: [soundOn ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "w-3.5 h-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: soundOn ? t.soundOn : t.soundOff })]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => playNotificationChime("message", true, settings.chimeTone),
												className: "px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 cursor-pointer",
												children: t.testChime
											}),
											notifPerm !== "unsupported" && notifPerm !== "denied" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: handleEnableDesktop,
												className: `px-2.5 py-1 rounded-lg cursor-pointer transition-colors ${notifPerm === "granted" && desktopOn ? "bg-sky-100 text-[#1677c7]" : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"}`,
												children: notifPerm === "granted" ? desktopOn ? t.deviceAlertsOn : t.deviceAlertsOff : t.enableDeviceAlerts
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2 max-h-72 overflow-y-auto",
										children: [notifications.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] text-slate-400 text-center py-4",
											children: t.noNotifications
										}), notifications.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											onClick: () => openNotificationTarget(n),
											className: `p-2.5 rounded-xl text-xs transition-colors cursor-pointer border ${n.read ? "bg-slate-50 border-slate-100 text-slate-600" : "bg-sky-50/70 border-sky-200 text-slate-800 font-bold"}`,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between mb-0.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[10px] text-slate-700 font-bold",
													children: n.title
												}), !n.read && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[10px] text-sky-700 font-bold",
													children: t.newBadge
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[11px] font-normal leading-relaxed",
												children: n.body
											})]
										}, n.id))]
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => onSelectSection("profile"),
							title: currentProfile.display_name,
							className: "hidden sm:flex w-10 h-10 rounded-full bg-slate-900 text-white items-center justify-center font-bold text-xs overflow-hidden cursor-pointer shrink-0",
							children: currentProfile.avatar_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: currentProfile.avatar_url,
								alt: "",
								className: "w-full h-full object-cover"
							}) : currentProfile.display_name.slice(0, 1)
						})
					]
				})
			]
		})
	});
};
// src/components/navigation/AppSidebar.tsx
var AppSidebar = ({ activeSection, onSelectSection, onOpenHub, currentRole, currentProfile }) => {
	const { settings } = useAppSettings();
	const copy = UI_COPY[settings.lang];
	const n = copy.nav;
	const shortcuts = [
		{
			id: "ai",
			label: n.ai,
			icon: Sparkles
		},
		{
			id: "calendar",
			label: n.calendar,
			icon: Calendar
		},
		{
			id: "grades",
			label: n.grades,
			icon: ClipboardList
		},
		{
			id: "tools",
			label: n.tools,
			icon: Layers
		},
		{
			id: "live",
			label: n.live,
			icon: Radio
		},
		...currentRole === "admin" ? [{
			id: "admin",
			label: n.admin,
			icon: ShieldCheck
		}] : [],
		{
			id: "settings",
			label: n.settings,
			icon: Settings
		}
	];
	const roleText = currentRole === "teacher" ? copy.header.roleTeacher : currentRole === "admin" ? copy.header.roleAdmin : copy.header.roleStudent;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "w-60 sticky top-14 h-[calc(100vh-3.5rem)] py-4 px-3 flex flex-col justify-between shrink-0 overflow-y-auto",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-1",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => onSelectSection("profile"),
					className: `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-start cursor-pointer ${activeSection === "profile" ? "bg-sky-50 text-[#1677c7]" : "hover:bg-slate-200/60 text-slate-900"}`,
					children: [currentProfile.avatar_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: currentProfile.avatar_url,
						alt: "",
						className: "w-8 h-8 rounded-full object-cover shrink-0"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0",
						children: currentProfile.display_name.slice(0, 1)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-bold text-xs block truncate",
							children: currentProfile.display_name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-[10px] text-slate-500 block truncate",
							children: [
								roleText,
								" · ",
								currentProfile.points,
								" XP"
							]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "my-2 border-t border-slate-200/80" }),
				shortcuts.map((item) => {
					const Icon = item.icon;
					const isActive = item.id === "tools" ? [
						"tools",
						"flashcards",
						"pomodoro",
						"grapher",
						"certificate",
						"badges"
					].includes(activeSection) : activeSection === item.id;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => onSelectSection(item.id),
						className: `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-colors text-start cursor-pointer ${isActive ? "bg-[#1677c7] text-white" : "text-slate-700 hover:bg-slate-200/60"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: `w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-[#1677c7]"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "truncate",
							children: item.label
						})]
					}, item.id);
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: onOpenHub,
					className: "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200/60 transition-colors text-start cursor-pointer",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutGrid, { className: "w-4 h-4 shrink-0 text-slate-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: copy.mobile.more })]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: () => onSelectSection("legal"),
			className: "px-3 py-2 text-[11px] text-slate-400 hover:text-slate-600 text-start cursor-pointer",
			children: n.legal
		})]
	});
};
// src/components/pwa/usePWAInstall.ts
function usePWAInstall() {
	const [deferredPrompt, setDeferredPrompt] = (0, import_react.useState)(null);
	const [isInstalled, setIsInstalled] = (0, import_react.useState)(false);
	const [isIOS, setIsIOS] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const isStandalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
		setIsInstalled(isStandalone);
		const userAgent = window.navigator.userAgent.toLowerCase();
		setIsIOS(/iphone|ipad|ipod/.test(userAgent));
		const handleBeforeInstallPrompt = (e) => {
			e.preventDefault();
			setDeferredPrompt(e);
		};
		const handleAppInstalled = () => {
			setIsInstalled(true);
			setDeferredPrompt(null);
		};
		window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
		window.addEventListener("appinstalled", handleAppInstalled);
		return () => {
			window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
			window.removeEventListener("appinstalled", handleAppInstalled);
		};
	}, []);
	const install = async () => {
		if (!deferredPrompt) return false;
		await deferredPrompt.prompt();
		const { outcome } = await deferredPrompt.userChoice;
		if (outcome === "accepted") {
			setIsInstalled(true);
			setDeferredPrompt(null);
			return true;
		}
		return false;
	};
	return {
		isInstallable: !!deferredPrompt,
		isInstalled,
		isIOS,
		install
	};
}
// src/components/pwa/PWAInstallButton.tsx
var PWAInstallButton = () => {
	const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
	const [showGuideModal, setShowGuideModal] = (0, import_react.useState)(false);
	if (isInstalled || isNativeApp()) return null;
	const handleInstallClick = async () => {
		if (isInstallable) await install();
		else setShowGuideModal(true);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "inline-flex flex-wrap items-center justify-center gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: handleInstallClick,
			className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-sm transition-all hover:scale-105 cursor-pointer",
			title: "تثبيت تطبيق NEMVIA على الهاتف أو سطح المكتب",
			children: [isInstallable ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "w-3.5 h-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "تثبيت تطبيق الهاتف" })]
		}), !isIOS && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
			href: resolveApiUrl("/download/nemvia.apk"),
			download: "NEMVIA.apk",
			className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition-all",
			title: "تنزيل ملف تثبيت أندرويد APK مباشرة",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "w-3.5 h-3.5 text-emerald-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "تنزيل Android APK" })]
		})]
	}), showGuideModal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4",
		onClick: () => setShowGuideModal(false),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			dir: "rtl",
			className: "bg-white rounded-3xl max-w-sm w-full border border-slate-200 shadow-2xl p-6 space-y-4 text-xs animate-in zoom-in-95",
			onClick: (e) => e.stopPropagation(),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between pb-2 border-b border-slate-100",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { className: "w-4 h-4" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-extrabold text-slate-900 text-sm",
							children: "تثبيت NEMVIA على جهازك"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] text-slate-400",
							children: "تطبيق ويب تقدمي (PWA)"
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setShowGuideModal(false),
						className: "text-slate-400 hover:text-slate-600 cursor-pointer",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3 text-slate-700 leading-relaxed",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-bold text-slate-900",
						children: "لتثبيت المنصة كأيقونة تطبيق على الشاشة الرئيسية:"
					}), isIOS ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "w-5 h-5 rounded-full bg-[#0f233a] text-white flex items-center justify-center text-[10px] font-bold shrink-0",
									children: "1"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									"اضغط على زر ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "مشاركة (Share)" }),
									" في شريط Safari."
								] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "w-5 h-5 rounded-full bg-[#1677c7] text-white flex items-center justify-center text-[10px] font-bold shrink-0",
									children: "2"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									"اختر ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "«إضافة إلى الشاشة الرئيسية» (Add to Home Screen)" }),
									"."
								] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0",
									children: "3"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "سيفتح التطبيق بكامل الشاشة كأنه تطبيق أصلي!" })]
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "w-5 h-5 rounded-full bg-[#0f233a] text-white flex items-center justify-center text-[10px] font-bold shrink-0",
									children: "1"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "افتح قائمة المتصفح (⋮) أو اضغط على أيقونة التثبيت في شريط العنوان." })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "w-5 h-5 rounded-full bg-[#1677c7] text-white flex items-center justify-center text-[10px] font-bold shrink-0",
									children: "2"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									"اختر ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "«تثبيت التطبيق» (Install App)" }),
									" أو ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "«إضافة إلى الشاشة الرئيسية»" }),
									"."
								] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0",
									children: "3"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "سيعمل NEMVIA في نافذة مستقلة تماماً مثل تطبيقات الجوال." })]
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setShowGuideModal(false),
					className: "w-full py-2.5 bg-[#0f233a] text-white font-bold rounded-xl cursor-pointer",
					children: "فهمت ذلك، حسناً"
				})
			]
		})
	})] });
};
// src/components/navigation/HubDrawerModal.tsx
var HubDrawerModal = ({ open, activeSection, currentProfile, currentRole, unreadMessagesCount, pendingAssignmentsCount, onSelectSection, onSignOut, onClose }) => {
	const { settings } = useAppSettings();
	const copy = UI_COPY[settings.lang];
	const n = copy.nav;
	const appDir = settings.lang === "ar" ? "rtl" : "ltr";
	(0, import_react.useEffect)(() => {
		if (!open) return;
		const onKey = (e) => {
			if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [open, onClose]);
	if (!open) return null;
	const jump = (id) => {
		onSelectSection(id);
		onClose();
	};
	const groups = [
		{
			title: settings.lang === "en" ? "Learning & Classes" : settings.lang === "fr" ? "Apprentissage" : "الدراسة والتقييم",
			items: [
				{
					id: "home",
					label: n.home,
					icon: House
				},
				{
					id: "classes",
					label: n.classes,
					icon: BookOpen
				},
				{
					id: "schools",
					label: settings.lang === "en" ? "Schools & Ministries" : settings.lang === "fr" ? "Écoles & Ministères" : "المدارس والوزارات",
					icon: Building2
				},
				{
					id: "courses",
					label: n.courses,
					icon: Award
				},
				{
					id: "assignments",
					label: n.assignments,
					icon: FileCheck,
					badge: pendingAssignmentsCount
				},
				{
					id: "calendar",
					label: n.calendar,
					icon: Calendar
				},
				{
					id: "grades",
					label: n.grades,
					icon: ClipboardList
				}
			]
		},
		{
			title: settings.lang === "en" ? "Smart Tools & Community" : settings.lang === "fr" ? "Outils & Réseau" : "الأدوات والتفاعل",
			items: [
				{
					id: "ai",
					label: n.ai,
					icon: Sparkles
				},
				{
					id: "tools",
					label: n.tools,
					icon: Layers
				},
				{
					id: "live",
					label: n.live,
					icon: Radio
				},
				{
					id: "community",
					label: n.community,
					icon: Users
				},
				{
					id: "messages",
					label: n.messages,
					icon: MessageSquare,
					badge: unreadMessagesCount
				}
			]
		},
		{
			title: settings.lang === "en" ? "Account & Preferences" : settings.lang === "fr" ? "Compte" : "الحساب والنظام",
			items: [
				{
					id: "profile",
					label: n.profile,
					icon: CircleUser
				},
				{
					id: "settings",
					label: n.settings,
					icon: Settings
				},
				...currentRole === "admin" ? [{
					id: "admin",
					label: n.admin,
					icon: ShieldCheck
				}] : [],
				{
					id: "legal",
					label: n.legal,
					icon: Scale
				}
			]
		}
	];
	const roleLabel = currentRole === "teacher" ? copy.header.roleTeacher : currentRole === "admin" ? copy.header.roleAdmin : copy.header.roleStudent;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-[65] bg-slate-900/50 backdrop-blur-xs flex items-end sm:items-stretch justify-start",
		onClick: onClose,
		dir: appDir,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			onClick: (e) => e.stopPropagation(),
			className: "w-full sm:w-96 max-h-[88vh] sm:max-h-full bg-white sm:h-full rounded-t-3xl sm:rounded-none sm:border-e border-slate-200 flex flex-col overflow-hidden shadow-2xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "sm:hidden w-10 h-1.5 bg-slate-300 rounded-full mx-auto mt-2.5" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "px-5 py-4 border-b border-slate-200 flex items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-9 h-9 rounded-xl bg-[#1677c7] text-white flex items-center justify-center font-black text-base",
							children: "N"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-black text-base text-slate-900 block leading-tight",
							children: "NEMVIA"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] text-slate-500 block",
							children: settings.lang === "en" ? "All-in-One Menu" : settings.lang === "fr" ? "Menu complet" : "القائمة الشاملة"
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						className: "min-w-[44px] min-h-[44px] rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer",
						"aria-label": copy.header.close,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-5 h-5" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "px-5 py-3 border-b border-slate-100 flex items-center justify-between gap-3 bg-slate-50",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => jump("profile"),
						className: "flex items-center gap-3 text-start min-w-0 cursor-pointer",
						children: [currentProfile.avatar_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: currentProfile.avatar_url,
							alt: "",
							className: "w-10 h-10 rounded-full object-cover shrink-0"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm shrink-0",
							children: currentProfile.display_name.slice(0, 1)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-bold text-sm text-slate-900 block truncate",
								children: currentProfile.display_name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[11px] text-slate-500 block tabular-nums",
								children: [
									roleLabel,
									" · ",
									currentProfile.points,
									" XP · ",
									currentProfile.streakDays,
									" ",
									copy.header.days
								]
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							onSignOut();
							onClose();
						},
						className: "p-2.5 rounded-xl bg-white border border-slate-200 text-rose-600 hover:bg-rose-50 cursor-pointer shrink-0",
						title: copy.header.signOut,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "w-4 h-4" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex-1 overflow-y-auto p-4 space-y-5",
					children: groups.map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-[11px] font-bold text-slate-400 px-1",
							children: group.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-2 gap-2",
							children: group.items.map((item) => {
								const Icon = item.icon;
								const active = item.id === "tools" ? [
									"tools",
									"flashcards",
									"pomodoro",
									"grapher",
									"certificate",
									"badges"
								].includes(activeSection) : activeSection === item.id;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => jump(item.id),
									className: `min-h-[48px] px-3 py-2.5 rounded-2xl border flex items-center justify-between gap-2 text-start text-xs font-bold transition-colors cursor-pointer ${active ? "bg-[#1677c7] text-white border-[#1677c7]" : "bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-2 min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: `w-4 h-4 shrink-0 ${active ? "text-white" : "text-[#1677c7]"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "truncate",
											children: item.label
										})]
									}), item.badge !== void 0 && item.badge > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `text-[10px] px-1.5 py-0.5 rounded-full font-black tabular-nums ${active ? "bg-white/20 text-white" : "bg-rose-600 text-white"}`,
										children: item.badge
									})]
								}, item.id);
							})
						})]
					}, group.title))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-center empty:hidden",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PWAInstallButton, {})
				})
			]
		})
	});
};
// src/components/views/HomeView.tsx
var HomeView = ({ currentProfile, classes, schools = [], ministries = [], assignments, quizzes, liveSessions, posts, onNavigate }) => {
	const { settings } = useAppSettings();
	const isEn = settings.lang === "en";
	const isFr = settings.lang === "fr";
	const quickActions = [
		{
			id: "ai",
			label: isEn ? "Ask AI Tutor" : isFr ? "Tuteur IA" : "اسأل المعلّم الذكي",
			icon: Sparkles
		},
		{
			id: "courses",
			label: isEn ? "Quizzes & Lessons" : isFr ? "Cours & Quiz" : "الدروس والاختبارات",
			icon: Award
		},
		{
			id: "assignments",
			label: isEn ? "Assignments" : isFr ? "Devoirs" : "الواجبات",
			icon: FileCheck
		},
		{
			id: "live",
			label: isEn ? "Live Class" : isFr ? "Direct" : "الحصص المباشرة",
			icon: Radio
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5 max-w-5xl mx-auto",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-sm shrink-0",
						children: currentProfile.display_name.slice(0, 1)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-black text-base sm:text-lg text-slate-900 truncate",
							children: isEn ? `Welcome, ${currentProfile.display_name}` : isFr ? `Bienvenue, ${currentProfile.display_name}` : `مرحباً، ${currentProfile.display_name}`
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-slate-500 tabular-nums",
							children: [
								classes.length,
								" ",
								isEn ? "classes" : "صفوف",
								" · ",
								quizzes.length,
								" ",
								isEn ? "quizzes" : "اختبارات",
								" · ",
								assignments.length,
								" ",
								isEn ? "tasks" : "واجبات"
							]
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hidden sm:flex items-center gap-4 text-xs font-bold tabular-nums shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex items-center gap-1 text-orange-600",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "w-4 h-4" }), currentProfile.streakDays]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex items-center gap-1 text-[#1677c7]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "w-4 h-4" }),
							currentProfile.points,
							" XP"
						]
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100",
				children: quickActions.map((act) => {
					const Icon = act.icon;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => onNavigate(act.id),
						className: "min-h-[44px] px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "w-4 h-4 text-[#1677c7] shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "truncate",
							children: act.label
						})]
					}, act.id);
				})
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 lg:grid-cols-12 gap-5 items-start",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg:col-span-8 space-y-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "font-black text-sm text-slate-900 flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "w-4 h-4 text-[#1677c7]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isEn ? "Up Next" : isFr ? "À venir" : "المهام والحصص القادمة" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => onNavigate("calendar"),
							className: "text-xs font-bold text-[#1677c7] hover:underline cursor-pointer",
							children: isEn ? "Full Calendar" : "التقويم الكامل"
						})]
					}), liveSessions.length === 0 && assignments.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-slate-400 py-4 text-center",
						children: isEn ? "No upcoming sessions or assignments right now." : "لا توجد حصص أو واجبات قريبة حالياً."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "divide-y divide-slate-100",
						children: [liveSessions.slice(0, 2).map((ls) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "py-3 flex items-center justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-bold text-xs text-slate-900 truncate",
									children: ls.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[11px] text-slate-500 tabular-nums",
									children: [
										"حصة مباشرة · ",
										ls.host_name,
										" · ",
										new Date(ls.starts_at).toLocaleTimeString("ar", {
											hour: "2-digit",
											minute: "2-digit"
										})
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => onNavigate("live"),
								className: "px-3 py-1.5 rounded-xl bg-[#1677c7] text-white font-bold text-xs shrink-0 cursor-pointer",
								children: "دخول"
							})]
						}, ls.id)), assignments.slice(0, 3).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "py-3 flex items-center justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-bold text-xs text-slate-900 truncate",
									children: a.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[11px] text-slate-500 tabular-nums",
									children: [
										"واجب · ",
										a.class_title,
										" · التسليم ",
										new Date(a.due_at).toLocaleDateString("ar", {
											day: "numeric",
											month: "short"
										})
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => onNavigate("assignments"),
								className: "px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs shrink-0 cursor-pointer",
								children: "فتح"
							})]
						}, a.id))]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "font-black text-sm text-slate-900 flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "w-4 h-4 text-[#1677c7]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isEn ? "Community Updates" : isFr ? "Communauté" : "آخر منشورات المجتمع" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => onNavigate("community"),
							className: "text-xs font-bold text-[#1677c7] hover:underline cursor-pointer",
							children: isEn ? "Open Community" : "عرض الكل"
						})]
					}), posts.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-slate-400 py-4 text-center",
						children: isEn ? "No posts yet." : "لا توجد منشورات بعد."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "divide-y divide-slate-100",
						children: posts.slice(0, 3).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							onClick: () => onNavigate("community"),
							className: "py-3 space-y-1 cursor-pointer hover:opacity-80",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold text-slate-900",
									children: p.author_name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[11px] text-slate-400 tabular-nums",
									children: [
										p.likes_count,
										" إعجاب · ",
										p.comments_count,
										" ردود"
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-slate-600 line-clamp-2 leading-relaxed",
								children: p.body
							})]
						}, p.id))
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
				className: "lg:col-span-4 space-y-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "bg-white border border-slate-200 rounded-2xl p-4 space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-black text-sm text-slate-900",
						children: isEn ? "Quick Access" : isFr ? "Accès rapide" : "اختصارات سريعة"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5 text-xs font-bold",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => onNavigate("classes"),
								className: "w-full min-h-[42px] px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-slate-800 cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "w-4 h-4 text-[#1677c7]" }), "الصفوف والمجموعات"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-slate-500 tabular-nums",
									children: classes.length
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => onNavigate("schools"),
								className: "w-full min-h-[42px] px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-slate-800 cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "w-4 h-4 text-emerald-600" }), "المدارس والوزارات"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-slate-500 tabular-nums",
									children: schools.length + ministries.length
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => onNavigate("grades"),
								className: "w-full min-h-[42px] px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-slate-800 cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardList, { className: "w-4 h-4 text-emerald-600" }), "سجل الدرجات"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-slate-500 tabular-nums",
									children: quizzes.length
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => onNavigate("ai"),
								className: "w-full min-h-[42px] px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-slate-800 cursor-pointer",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-4 h-4 text-amber-500" }), "استوديو الذكاء الاصطناعي"]
								})
							})
						]
					})]
				})
			})]
		})]
	});
};
// src/components/views/LegalView.tsx
var LegalView_exports = /* @__PURE__ */ __exportAll({ LegalView: () => LegalView$1 });
var CONTACT = "support@nemvia.app";
var Section = ({ title, children }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
	className: "space-y-1.5",
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
		className: "font-black text-slate-900 text-sm",
		children: title
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "text-xs leading-relaxed text-slate-600 space-y-1.5",
		children
	})]
});
var LegalContent = ({ tab }) => {
	return tab === "privacy" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "1. البيانات التي نجمعها",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "الاسم الظاهر والبريد الإلكتروني وكلمة المرور (مشفّرة ولا نراها)، والمحتوى الذي تنشره (منشورات، تعليقات، رسائل، واجبات، ملفات)، ومعلومات الاستخدام الأساسية كالنقاط وأيام النشاط." })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "2. كيف نستخدمها",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "لتشغيل حسابك والصفوف والواجبات والاختبارات والمراسلة وإرسال الإشعارات، ولمراجعة البلاغات وحماية المجتمع. لا نبيع بياناتك ولا نشاركها لأغراض إعلانية." })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				title: "3. من يرى بياناتك",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "اسمك وصورتك ونبذتك ظاهران للمستخدمين المسجّلين. المنشورات العامة يراها الجميع، والخاصة حسب إعدادك. معلّم الصف يرى تسليماتك ونتائجك. الرسائل الخاصة لا يراها إلا طرفاها، وقد تُراجع عند وجود بلاغ عنها." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "الملفات المرفوعة تُخزَّن بروابط عشوائية؛ من يملك الرابط المباشر يستطيع فتح الملف، فلا ترفع مستندات حساسة." })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "4. التخزين والأمان",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "تُحفظ البيانات لدى مزوّد الاستضافة والبيانات (Google Firebase) مع قواعد أمان وصلاحيات وصول دقيقة على مستوى المستخدمين والصفوف. لا يوجد نظام آمن بنسبة 100%، ونبذل جهدنا لحماية حسابك." })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "5. الأطفال والقاصرون",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "إن كنت دون السن القانوني في بلدك فاستخدم المنصة بإشراف وموافقة وليّ الأمر أو المدرسة. لا تشارك معلومات شخصية حساسة (عنوان، رقم هاتف) في أي محادثة." })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "6. حقوقك وحذف الحساب",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
					"يمكنك تعديل اسمك ونبذتك وخصوصية حسابك من «الملف الشخصي»، وحذف منشوراتك ورسائلك الجماعية، كما يمكنك حذف حسابك وجميع بياناتك المرتبطة به نهائياً من داخل «الملف الشخصي ← حذف الحساب نهائياً» أو بالتواصل معنا ",
					`عبر ${CONTACT}`,
					"."
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "7. التحديثات",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "قد نحدّث هذه السياسة، وسيظهر تاريخ آخر تحديث هنا. استمرارك في الاستخدام يعني موافقتك على النسخة الحالية." })
			})
		]
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "1. القبول",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "باستخدامك NEMVIA فأنت توافق على هذه الشروط. إن لم توافق فلا تستخدم المنصة." })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "2. الحساب",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "أنت مسؤول عن سرية كلمة مرورك وعن نشاط حسابك. استخدم معلومات صحيحة، وحساب واحد لكل شخص." })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "3. قواعد السلوك",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "يُمنع: الإساءة والتنمّر والتحرش، المحتوى الجنسي أو العنيف أو الكراهية، انتحال الشخصيات، السبام والاحتيال، نشر معلومات الآخرين الخاصة، الغش في الاختبارات، ورفع ملفات ضارة أو منتهكة لحقوق النشر." })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "4. المحتوى",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "تبقى ملكية ما تنشره لك، وتمنح المنصة ترخيصاً محدوداً لعرضه ضمن الخدمة. أنت مسؤول عن محتواك." })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "5. الإبلاغ والإشراف",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "يمكن لأي مستخدم الإبلاغ عن منشور أو تعليق أو رسالة. تراجع الإدارة البلاغات وقد تحذف المحتوى أو توقف الحساب (منع النشر والمراسلة) عند المخالفة، دون إشعار مسبق في الحالات الخطيرة." })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "6. المعلمون",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "المعلم مسؤول عن محتوى صفوفه وتقييمه لطلابه، ولا تتحمل المنصة مسؤولية الدرجات أو الشهادات الصادرة داخلها، فهي لأغراض تعليمية وتحفيزية." })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "7. الحصص المباشرة والروابط الخارجية",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "تعتمد الحصص على خدمات طرف ثالث (Jitsi / Google Meet) ولها شروطها الخاصة. لسنا مسؤولين عن محتوى الروابط الخارجية." })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "8. إخلاء المسؤولية",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "تُقدَّم الخدمة «كما هي» دون ضمانات، وقد تتوقف أو تتغير. لا نتحمل مسؤولية أضرار غير مباشرة ناتجة عن استخدامها." })
			})
		]
	});
};
var LegalView$1 = () => {
	const [tab, setTab] = (0, import_react.useState)("privacy");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5 animate-in fade-in max-w-3xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-xl font-black text-slate-900",
				children: "الخصوصية والشروط"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-slate-500",
				children: "آخر تحديث: 2026"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex bg-slate-100 p-1 rounded-2xl text-sm font-bold w-fit",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setTab("privacy"),
					className: `px-4 py-2 rounded-xl flex items-center gap-2 cursor-pointer ${tab === "privacy" ? "bg-white text-[#1677c7] shadow-xs" : "text-slate-500"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "w-4 h-4" }), " سياسة الخصوصية"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setTab("terms"),
					className: `px-4 py-2 rounded-xl flex items-center gap-2 cursor-pointer ${tab === "terms" ? "bg-white text-[#1677c7] shadow-xs" : "text-slate-500"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "w-4 h-4" }), " شروط الاستخدام"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "bg-white rounded-2xl border border-slate-200 p-5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LegalContent, { tab })
			})
		]
	});
};
// src/components/GlobalSearchModal.tsx
var GlobalSearchModal = ({ open, data, onClose, onNavigate }) => {
	const { settings } = useAppSettings();
	const [query, setQuery] = (0, import_react.useState)("");
	const [filter, setFilter] = (0, import_react.useState)("all");
	const inputRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (open) setTimeout(() => inputRef.current?.focus(), 40);
		else {
			setQuery("");
			setFilter("all");
		}
	}, [open]);
	(0, import_react.useEffect)(() => {
		if (!open) return;
		const onKey = (e) => {
			if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [open, onClose]);
	const entries = (0, import_react.useMemo)(() => {
		const list = [];
		data.classes.forEach((c) => {
			list.push({
				id: `cls-${c.id}`,
				kind: "class",
				title: c.title,
				subtitle: `${c.subject} · ${c.teacher_name}`,
				section: "classes",
				searchBlob: `${c.title} ${c.subject} ${c.grade_level} ${c.teacher_name} ${c.description}`.toLowerCase()
			});
		});
		data.lessons.forEach((l) => {
			list.push({
				id: `lsn-${l.id}`,
				kind: "lesson",
				title: l.title,
				subtitle: `${l.teacher_name} · درس`,
				section: "courses",
				searchBlob: `${l.title} ${l.content} ${l.teacher_name}`.toLowerCase()
			});
		});
		data.quizzes.forEach((q) => {
			list.push({
				id: `qz-${q.id}`,
				kind: "quiz",
				title: q.title,
				subtitle: `${q.class_title} · ${q.questions.length} سؤال`,
				section: "courses",
				searchBlob: `${q.title} ${q.description} ${q.class_title}`.toLowerCase()
			});
		});
		data.assignments.forEach((a) => {
			list.push({
				id: `asg-${a.id}`,
				kind: "assignment",
				title: a.title,
				subtitle: `${a.class_title} · ${a.total_points} درجة`,
				section: "assignments",
				searchBlob: `${a.title} ${a.instructions} ${a.class_title} ${a.teacher_name}`.toLowerCase()
			});
		});
		data.liveSessions.forEach((s) => {
			list.push({
				id: `lv-${s.id}`,
				kind: "live",
				title: s.title,
				subtitle: `${s.host_name} · ${s.status === "live" ? "بث مباشر" : "حصة مجدولة"}`,
				section: "live",
				searchBlob: `${s.title} ${s.description} ${s.host_name} ${s.class_title || ""}`.toLowerCase()
			});
		});
		data.posts.forEach((p) => {
			list.push({
				id: `pst-${p.id}`,
				kind: "post",
				title: p.body.slice(0, 80) + (p.body.length > 80 ? "..." : ""),
				subtitle: `${p.author_name} · المجتمع`,
				section: "community",
				searchBlob: `${p.body} ${p.author_name}`.toLowerCase()
			});
		});
		data.messages.slice(-150).forEach((m) => {
			const text = m.body || m.attachment?.name || "";
			if (!text) return;
			list.push({
				id: `msg-${m.id}`,
				kind: "message",
				title: text.slice(0, 80) + (text.length > 80 ? "..." : ""),
				subtitle: `${m.sender_name} ← ${m.recipient_name}`,
				section: "messages",
				searchBlob: `${text} ${m.sender_name} ${m.recipient_name}`.toLowerCase()
			});
		});
		return list;
	}, [data]);
	const filtered = (0, import_react.useMemo)(() => {
		const q = query.trim().toLowerCase();
		return entries.filter((e) => filter === "all" ? true : e.kind === filter).filter((e) => !q ? true : e.searchBlob.includes(q)).slice(0, 28);
	}, [
		entries,
		filter,
		query
	]);
	if (!open) return null;
	const isEn = settings.lang === "en";
	const isFr = settings.lang === "fr";
	const placeholder = isEn ? "Search lessons, quizzes, assignments, classes, posts, or messages..." : isFr ? "Rechercher cours, quiz, devoirs, classes, messages..." : "ابحث في الدروس، الاختبارات، الواجبات، الصفوف، المنشورات، أو الرسائل...";
	const kindLabel = (k) => {
		return (isEn ? {
			class: "Class",
			lesson: "Lesson",
			quiz: "Quiz",
			assignment: "Task",
			live: "Live",
			post: "Post",
			message: "Chat"
		} : isFr ? {
			class: "Classe",
			lesson: "Cours",
			quiz: "Quiz",
			assignment: "Devoir",
			live: "Direct",
			post: "Post",
			message: "Message"
		} : {
			class: "صف",
			lesson: "درس",
			quiz: "اختبار",
			assignment: "واجب",
			live: "حصة",
			post: "منشور",
			message: "رسالة"
		})[k];
	};
	const kindIcon = (k) => {
		if (k === "class") return BookOpen;
		if (k === "lesson") return FileText;
		if (k === "quiz") return Award;
		if (k === "assignment") return FileCheck;
		if (k === "live") return Radio;
		if (k === "post") return Users;
		return MessageSquare;
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-[70] bg-slate-900/50 backdrop-blur-xs flex items-start justify-center p-4 pt-16 sm:pt-24",
		onClick: onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden",
			onClick: (e) => e.stopPropagation(),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 px-4 py-3.5 border-b border-slate-200",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-5 h-5 text-[#1677c7] shrink-0" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							ref: inputRef,
							value: query,
							onChange: (e) => setQuery(e.target.value),
							placeholder,
							className: "flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
						}),
						query && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setQuery(""),
							className: "text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer",
							children: isEn ? "Clear" : isFr ? "Effacer" : "مسح"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: onClose,
							className: "p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 cursor-pointer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "px-4 py-2 bg-slate-50 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto text-[11px] font-bold",
					children: [
						["all", isEn ? "All" : isFr ? "Tout" : "الكل"],
						["lesson", isEn ? "Lessons" : isFr ? "Cours" : "الدروس"],
						["quiz", isEn ? "Quizzes" : isFr ? "Quiz" : "الاختبارات"],
						["assignment", isEn ? "Tasks" : isFr ? "Devoirs" : "الواجبات"],
						["class", isEn ? "Classes" : isFr ? "Classes" : "الصفوف"],
						["live", isEn ? "Live" : isFr ? "Direct" : "الحصص"],
						["post", isEn ? "Community" : isFr ? "Réseau" : "المجتمع"],
						["message", isEn ? "Messages" : isFr ? "Messages" : "الرسائل"]
					].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setFilter(id),
						className: `px-2.5 py-1 rounded-lg whitespace-nowrap cursor-pointer transition-colors ${filter === id ? "bg-[#1677c7] text-white" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"}`,
						children: label
					}, id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "max-h-96 overflow-y-auto divide-y divide-slate-100",
					children: filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-10 text-center text-xs text-slate-400",
						children: isEn ? "No matching results found." : isFr ? "Aucun résultat trouvé." : "لا توجد نتائج مطابقة لبحثك."
					}) : filtered.map((item) => {
						const Icon = kindIcon(item.kind);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => {
								onNavigate(item.section);
								onClose();
							},
							className: "w-full px-4 py-3 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors text-start cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-8 h-8 rounded-xl bg-sky-50 text-[#1677c7] flex items-center justify-center shrink-0",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "w-4 h-4" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-bold text-slate-900 truncate",
										children: item.title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] text-slate-500 truncate",
										children: item.subtitle
									})]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] font-bold px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 shrink-0",
								children: kindLabel(item.kind)
							})]
						}, item.id);
					})
				})
			]
		})
	});
};
var firebase_applet_config_default = {
	projectId: "gen-lang-client-0122004631",
	appId: "1:491857942459:web:1ebd1c46670a8e694e569e",
	apiKey: "AIzaSyD6KocEcM-08PJkfBmyfHRiYbUnStcoNG0",
	authDomain: "gen-lang-client-0122004631.firebaseapp.com",
	firestoreDatabaseId: "ai-studio-androidnemvia-d83c773f-47a3-4058-bd74-2760ff8c74a7",
	storageBucket: "gen-lang-client-0122004631.firebasestorage.app",
	messagingSenderId: "491857942459",
	measurementId: "",
	oAuthClientId: "491857942459-23ese1u0nq3rglhcfkb40c23srps2445.apps.googleusercontent.com",
	recaptchaSiteKey: ""
};
var app = initializeApp(firebase_applet_config_default);
var db = getFirestore(app, firebase_applet_config_default.firestoreDatabaseId);
var auth = getAuth(app);
auth.languageCode = "ar";
var storage = getStorage(app);
var googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });
var OperationType = /* @__PURE__ */ function(OperationType) {
	OperationType["CREATE"] = "create";
	OperationType["UPDATE"] = "update";
	OperationType["DELETE"] = "delete";
	OperationType["LIST"] = "list";
	OperationType["GET"] = "get";
	OperationType["WRITE"] = "write";
	return OperationType;
}({});
function handleFirestoreError(error, operationType, path) {
	const errInfo = {
		error: error instanceof Error ? error.message : String(error),
		authInfo: {
			userId: auth.currentUser?.uid,
			email: auth.currentUser?.email,
			emailVerified: auth.currentUser?.emailVerified,
			isAnonymous: auth.currentUser?.isAnonymous,
			tenantId: auth.currentUser?.tenantId,
			providerInfo: auth.currentUser?.providerData?.map((provider) => ({
				providerId: provider.providerId,
				email: provider.email
			})) || []
		},
		operationType,
		path
	};
	console.error("Firestore Error: ", JSON.stringify(errInfo));
	throw new Error(JSON.stringify(errInfo));
}
async function testConnection() {
	try {
		await getDocFromServer(doc(db, "test", "connection"));
	} catch (error) {
		if (error instanceof Error && error.message.includes("the client is offline")) console.error("Please check your Firebase configuration.");
	}
}
testConnection();
// src/lib/api.ts
function toIso(val) {
	if (!val) return (/* @__PURE__ */ new Date()).toISOString();
	if (typeof val === "string") return val;
	if (val instanceof Timestamp) return val.toDate().toISOString();
	if (typeof val?.toDate === "function") return val.toDate().toISOString();
	if (typeof val?.seconds === "number") return (/* @__PURE__ */ new Date(val.seconds * 1e3)).toISOString();
	return (/* @__PURE__ */ new Date()).toISOString();
}
function makeJoinCode() {
	const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
	let out = "";
	for (let i = 0; i < 8; i++) out += chars[Math.floor(Math.random() * 32)];
	return out;
}
function mapDoc(d) {
	return {
		id: d.id,
		...d.data()
	};
}
function mapProfile(r) {
	return {
		id: r.id,
		username: r.username || "",
		display_name: r.display_name || "مستخدم NEMVIA",
		bio: r.bio || "",
		avatar_url: r.avatar_url || void 0,
		role: r.role || "student",
		visibility: r.visibility || "public",
		points: Number(r.points ?? 0),
		streakDays: Number(r.streak_days ?? 0),
		is_suspended: !!r.is_suspended,
		joinedDate: r.created_at ? new Date(toIso(r.created_at)).toLocaleDateString("ar", {
			month: "long",
			year: "numeric"
		}) : ""
	};
}
var TW_HEX = {
	blue: "#2563eb",
	indigo: "#4f46e5",
	emerald: "#059669",
	rose: "#e11d48",
	amber: "#d97706",
	sky: "#0284c7",
	violet: "#7c3aed",
	teal: "#0d9488",
	purple: "#9333ea",
	slate: "#334155",
	orange: "#ea580c",
	cyan: "#0891b2",
	pink: "#db2777",
	green: "#16a34a",
	red: "#dc2626",
	fuchsia: "#c026d3"
};
var DEFAULT_THEME = "from-blue-600 to-indigo-700";
var MINISTRY_PREFIX = "__ORG__:ministry|";
var SCHOOL_PREFIX = "__ORG__:school|";
function cleanTheme(raw) {
	const base = (raw || "").split("|")[0];
	return base && base.includes("from-") ? base : DEFAULT_THEME;
}
function coverFor(theme, title) {
	const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='300'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='${TW_HEX[(theme.match(/from-([a-z]+)/) || [])[1]] || "#2563eb"}'/><stop offset='1' stop-color='${TW_HEX[(theme.match(/to-([a-z]+)/) || [])[1]] || "#4338ca"}'/></linearGradient></defs><rect width='600' height='300' fill='url(#g)'/><text x='300' y='165' font-size='120' text-anchor='middle' fill='white' fill-opacity='.25' font-family='sans-serif'>${(title || "N").trim().slice(0, 1).replace(/[<&>]/g, "")}</text></svg>`;
	return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
var ensureProfileInFlight = /* @__PURE__ */ new Map();
async function ensureOwnProfile(user, preferredRole) {
	const inflight = ensureProfileInFlight.get(user.uid);
	if (inflight) return inflight;
	const task = ensureOwnProfileImpl(user, preferredRole).finally(() => {
		ensureProfileInFlight.delete(user.uid);
	});
	ensureProfileInFlight.set(user.uid, task);
	return task;
}
async function ensureOwnProfileImpl(user, preferredRole) {
	const isBootAdmin = (user.email || "").trim().toLowerCase() === "jamalnama19@gmail.com" && Boolean(user.emailVerified);
	const profileRef = doc(db, "profiles", user.uid);
	const privateRef = doc(db, "users_private", user.uid);
	let snap;
	try {
		snap = await getDoc(profileRef);
	} catch (err) {
		handleFirestoreError(err, OperationType.GET, `profiles/${user.uid}`);
	}
	if (!snap.exists()) {
		const safeName = (user.displayName || "").trim().slice(0, 80) || (user.email ? user.email.split("@")[0].slice(0, 80) : "") || "مستخدم NEMVIA";
		const initialRole = isBootAdmin ? "admin" : preferredRole === "teacher" ? "teacher" : "student";
		const avatar = user.photoURL && user.photoURL.length <= 2e3 ? user.photoURL : void 0;
		const profilePayload = {
			id: user.uid,
			display_name: safeName,
			bio: "",
			role: initialRole,
			visibility: "public",
			points: 0,
			streak_days: 1,
			last_active_date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
			is_suspended: false,
			created_at: serverTimestamp(),
			updated_at: serverTimestamp()
		};
		if (avatar) profilePayload.avatar_url = avatar;
		try {
			await setDoc(profileRef, profilePayload);
			await setDoc(privateRef, {
				uid: user.uid,
				email: (user.email || "").slice(0, 254),
				created_at: serverTimestamp(),
				updated_at: serverTimestamp()
			});
			if (isBootAdmin) await setDoc(doc(db, "admins", user.uid), {
				uid: user.uid,
				email: (user.email || "").slice(0, 254),
				created_at: serverTimestamp()
			});
		} catch (err) {
			handleFirestoreError(err, OperationType.CREATE, `profiles/${user.uid}`);
		}
		const created = await getDoc(profileRef);
		return mapProfile({
			id: user.uid,
			...created.data() || profilePayload
		});
	}
	const existing = snap.data();
	if (isBootAdmin && existing.role !== "admin") try {
		await updateDoc(profileRef, {
			role: "admin",
			updated_at: serverTimestamp()
		});
		await setDoc(doc(db, "admins", user.uid), {
			uid: user.uid,
			email: (user.email || "").slice(0, 254),
			created_at: serverTimestamp()
		}, { merge: true });
		existing.role = "admin";
	} catch (err) {
		handleFirestoreError(err, OperationType.UPDATE, `profiles/${user.uid}`);
	}
	try {
		if (!(await getDoc(privateRef)).exists()) await setDoc(privateRef, {
			uid: user.uid,
			email: (user.email || "").slice(0, 254),
			created_at: serverTimestamp(),
			updated_at: serverTimestamp()
		});
	} catch {}
	return mapProfile({
		id: snap.id,
		...existing
	});
}
async function fetchOwnProfile(userId) {
	const profileRef = doc(db, "profiles", userId);
	try {
		const snap = await getDoc(profileRef);
		if (snap.exists()) {
			const data = snap.data();
			const cu = auth.currentUser;
			if (cu && cu.uid === userId && (cu.email || "").toLowerCase() === "jamalnama19@gmail.com" && cu.emailVerified && data.role !== "admin") return await ensureOwnProfile(cu);
			return mapProfile({
				id: snap.id,
				...data
			});
		}
		if (auth.currentUser?.uid === userId) {
			const preferred = localStorage.getItem("nemvia-pending-role");
			if (preferred) localStorage.removeItem("nemvia-pending-role");
			return await ensureOwnProfile(auth.currentUser, preferred || void 0);
		}
		return null;
	} catch (err) {
		handleFirestoreError(err, OperationType.GET, `profiles/${userId}`);
	}
}
async function updateProfile(userId, patch) {
	const clean = { updated_at: serverTimestamp() };
	if (patch.display_name !== void 0) clean.display_name = patch.display_name.slice(0, 80);
	if (patch.bio !== void 0) clean.bio = patch.bio.slice(0, 500);
	if (patch.visibility !== void 0) clean.visibility = patch.visibility;
	if (patch.avatar_url !== void 0 && patch.avatar_url) clean.avatar_url = patch.avatar_url.slice(0, 2e3);
	try {
		await updateDoc(doc(db, "profiles", userId), clean);
	} catch (err) {
		handleFirestoreError(err, OperationType.UPDATE, `profiles/${userId}`);
	}
}
async function touchStreak() {
	const uid = auth.currentUser?.uid;
	if (!uid) return;
	try {
		const refDoc = doc(db, "profiles", uid);
		const snap = await getDoc(refDoc);
		if (!snap.exists()) return;
		const data = snap.data();
		const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
		if (data.last_active_date === today) return;
		const yesterday = (/* @__PURE__ */ new Date(Date.now() - 864e5)).toISOString().slice(0, 10);
		const nextStreak = data.last_active_date === yesterday ? Number(data.streak_days || 0) + 1 : 1;
		await updateDoc(refDoc, {
			streak_days: nextStreak,
			last_active_date: today,
			updated_at: serverTimestamp()
		});
	} catch {}
}
async function awardPoints(xp) {
	const uid = auth.currentUser?.uid;
	if (!uid) return null;
	const delta = Math.round(xp);
	if (!Number.isFinite(delta) || delta === 0) return null;
	try {
		const refDoc = doc(db, "profiles", uid);
		await updateDoc(refDoc, {
			points: increment(delta),
			updated_at: serverTimestamp()
		});
		const snap = await getDoc(refDoc);
		return Number(snap.data()?.points ?? 0);
	} catch (err) {
		console.warn("[NEMVIA] awardPoints:", err);
		return null;
	}
}
async function searchContacts(meId, q = "") {
	try {
		const snap = await getDocs(query(collection(db, "profiles"), where("visibility", "in", ["public", "private"]), limit(100)));
		const needle = q.trim().toLowerCase();
		return snap.docs.map((d) => mapDoc(d)).filter((r) => r.id !== meId).filter((r) => !needle || String(r.display_name || "").toLowerCase().includes(needle)).sort((a, b) => toIso(b.created_at).localeCompare(toIso(a.created_at))).map((r) => ({
			id: r.id,
			name: r.display_name || "مستخدم",
			role: r.role || "student",
			avatar_url: r.avatar_url || void 0,
			bio: r.bio || "",
			visibility: r.visibility || "public",
			points: Number(r.points ?? 0),
			streakDays: Number(r.streak_days ?? 0)
		}));
	} catch (err) {
		handleFirestoreError(err, OperationType.LIST, "profiles");
	}
}
async function compressImageFile(file) {
	if (typeof document === "undefined" || !file.type.startsWith("image/") || file.type === "image/gif" || file.type === "image/svg+xml" || file.size <= 307200) return file;
	try {
		const objectUrl = URL.createObjectURL(file);
		try {
			const img = await new Promise((resolve, reject) => {
				const el = new Image();
				el.onload = () => resolve(el);
				el.onerror = () => reject(/* @__PURE__ */ new Error("image_load_failed"));
				el.src = objectUrl;
			});
			const maxDim = 1600;
			const w = img.naturalWidth || img.width;
			const h = img.naturalHeight || img.height;
			if (!w || !h) return file;
			const scale = Math.min(1, maxDim / Math.max(w, h));
			const targetW = Math.max(1, Math.round(w * scale));
			const targetH = Math.max(1, Math.round(h * scale));
			const canvas = document.createElement("canvas");
			canvas.width = targetW;
			canvas.height = targetH;
			const ctx = canvas.getContext("2d");
			if (!ctx) return file;
			ctx.drawImage(img, 0, 0, targetW, targetH);
			const blob = await new Promise((resolve) => canvas.toBlob((b) => resolve(b), "image/jpeg", .82));
			if (!blob || blob.size >= file.size) return file;
			const baseName = file.name.replace(/\.[^.]+$/, "") || "image";
			return new File([blob], `${baseName}.jpg`, {
				type: "image/jpeg",
				lastModified: Date.now()
			});
		} finally {
			URL.revokeObjectURL(objectUrl);
		}
	} catch {
		return file;
	}
}
async function uploadFile(userId, rawFile, folder) {
	const file = await compressImageFile(rawFile);
	if (file.size > 10485760) throw new Error("حجم الملف أكبر من 10 ميجابايت");
	const ext = (file.name.split(".").pop() || "bin").toLowerCase().replace(/[^a-z0-9]/g, "");
	const storagePath = `nemvia/${userId}/${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
	try {
		const storageRef = ref(storage, storagePath);
		await uploadBytes(storageRef, file, { contentType: file.type || void 0 });
		const publicUrl = await getDownloadURL(storageRef);
		const kb = file.size / 1024;
		const type = file.type.startsWith("audio/") || [
			"webm",
			"ogg",
			"mp3",
			"wav",
			"m4a",
			"aac",
			"opus"
		].includes(ext) ? "audio" : ext === "pdf" ? "pdf" : [
			"png",
			"jpg",
			"jpeg",
			"webp",
			"gif"
		].includes(ext) ? "image" : [
			"ts",
			"js",
			"py",
			"java",
			"html",
			"css",
			"sql",
			"txt"
		].includes(ext) ? "code" : "doc";
		return {
			url: publicUrl,
			name: file.name,
			size: kb > 1024 ? `${(kb / 1024).toFixed(1)} ميجابايت` : `${Math.round(kb)} كيلوبايت`,
			type
		};
	} catch (err) {
		const msg = String(err?.message || "").toLowerCase();
		if (msg.includes("unauthorized") || msg.includes("storage/")) throw new Error("يرجى تفعيل Firebase Storage في وحدة تحكم Firebase لرفع الملفات والصور.");
		throw new Error(err?.message || "تعذّر رفع الملف");
	}
}
async function safeList(path, q) {
	try {
		return (await getDocs(q)).docs.map((d) => mapDoc(d));
	} catch (err) {
		const msg = String(err?.message || "").toLowerCase();
		if (msg.includes("permission") || msg.includes("insufficient")) handleFirestoreError(err, OperationType.LIST, path);
		console.warn(`[NEMVIA] ${path}:`, err?.message || err);
		return [];
	}
}
function dedupeById(list) {
	const m = /* @__PURE__ */ new Map();
	list.forEach((r) => m.set(r.id, r));
	return [...m.values()];
}
async function loadAll(me) {
	const isAdm = me.role === "admin";
	const nowIso = (/* @__PURE__ */ new Date()).toISOString();
	const [classRowsRaw, lessonRows, assignRowsRaw, subRows, quizRowsRaw, attemptRows, keyRowsTeacher, postRows, commentRowsRaw, likeRows, storyRowsAll, liveRowsAll, dmRows, cmRows, notifRows, reportRows, contacts, memberRows, followRows, followReqRows] = await Promise.all([
		safeList("classes", query(collection(db, "classes"), where("class_type", "in", ["class", "study"]))),
		safeList("lessons", query(collection(db, "lessons"), where("position", ">=", 0), orderBy("position", "asc"))),
		safeList("assignments", query(collection(db, "assignments"), where("total_points", ">=", 1))),
		isAdm ? safeList("submissions", collection(db, "submissions")) : Promise.all([safeList("submissions", query(collection(db, "submissions"), where("student_id", "==", me.id))), safeList("submissions", query(collection(db, "submissions"), where("teacher_id", "==", me.id)))]).then(([a, b]) => dedupeById([...a, ...b])),
		safeList("quizzes", query(collection(db, "quizzes"), where("is_published", "in", [true, false]))),
		isAdm ? safeList("quiz_attempts", collection(db, "quiz_attempts")) : Promise.all([safeList("quiz_attempts", query(collection(db, "quiz_attempts"), where("student_id", "==", me.id))), safeList("quiz_attempts", query(collection(db, "quiz_attempts"), where("teacher_id", "==", me.id)))]).then(([a, b]) => dedupeById([...a, ...b])),
		isAdm ? safeList("quiz_answer_keys", collection(db, "quiz_answer_keys")) : safeList("quiz_answer_keys", query(collection(db, "quiz_answer_keys"), where("teacher_id", "==", me.id))),
		Promise.all([safeList("posts", query(collection(db, "posts"), where("visibility", "in", ["public", "followers"]), limit(100))), safeList("posts", query(collection(db, "posts"), where("author_id", "==", me.id), limit(50)))]).then(([a, b]) => dedupeById([...a, ...b]).sort((x, y) => toIso(y.created_at).localeCompare(toIso(x.created_at))).slice(0, 100)),
		safeList("comments", query(collection(db, "comments"), where("post_id", "!=", ""))),
		safeList("post_likes", query(collection(db, "post_likes"), where("post_id", "!=", ""))),
		safeList("stories", query(collection(db, "stories"), where("expires_at", ">", ""))),
		safeList("live_sessions", query(collection(db, "live_sessions"), where("status", "in", [
			"scheduled",
			"live",
			"ended"
		]))),
		safeList("direct_messages", query(collection(db, "direct_messages"), where("participants", "array-contains", me.id), limit(500))),
		safeList("class_messages", query(collection(db, "class_messages"), where("class_id", "!=", ""), limit(500))),
		safeList("notifications", query(collection(db, "notifications"), where("user_id", "==", me.id), limit(50))),
		isAdm ? safeList("content_reports", query(collection(db, "content_reports"), where("status", "in", ["open", "reviewing"]))) : Promise.resolve([]),
		searchContacts(me.id),
		safeList("class_members", query(collection(db, "class_members"), where("member_role", "in", ["student", "assistant"]))),
		Promise.all([safeList("follows", query(collection(db, "follows"), where("follower_id", "==", me.id))), safeList("follows", query(collection(db, "follows"), where("followed_id", "==", me.id)))]).then(([a, b]) => dedupeById([...a, ...b])),
		Promise.all([safeList("follow_requests", query(collection(db, "follow_requests"), where("target_id", "==", me.id))), safeList("follow_requests", query(collection(db, "follow_requests"), where("requester_id", "==", me.id)))]).then(([a, b]) => dedupeById([...a, ...b]).filter((r) => r.status === "pending"))
	]);
	const classRows = [...classRowsRaw].sort((a, b) => toIso(b.created_at).localeCompare(toIso(a.created_at)));
	const assignRows = [...assignRowsRaw].sort((a, b) => toIso(b.created_at).localeCompare(toIso(a.created_at)));
	const quizRows = [...quizRowsRaw].sort((a, b) => toIso(b.created_at).localeCompare(toIso(a.created_at)));
	const commentRows = [...commentRowsRaw].sort((a, b) => toIso(a.created_at).localeCompare(toIso(b.created_at)));
	const storyRows = storyRowsAll.filter((s) => String(s.expires_at || "") > nowIso).sort((a, b) => toIso(b.created_at).localeCompare(toIso(a.created_at))).slice(0, 60);
	const liveRows = liveRowsAll.filter((l) => l.status !== "cancelled").sort((a, b) => String(a.starts_at || "").localeCompare(String(b.starts_at || "")));
	const keyMap = /* @__PURE__ */ new Map();
	keyRowsTeacher.forEach((k) => keyMap.set(k.quiz_id || k.id, k));
	const missingKeyIds = [...new Set(attemptRows.filter((a) => a.student_id === me.id).map((a) => String(a.quiz_id)))].filter((qid) => !keyMap.has(qid));
	if (missingKeyIds.length > 0) (await Promise.all(missingKeyIds.map(async (qid) => {
		try {
			const s = await getDoc(doc(db, "quiz_answer_keys", qid));
			return s.exists() ? mapDoc(s) : null;
		} catch {
			return null;
		}
	}))).forEach((k) => {
		if (k) keyMap.set(k.quiz_id || k.id, k);
	});
	const known = /* @__PURE__ */ new Map();
	contacts.forEach((c) => known.set(c.id, {
		id: c.id,
		display_name: c.name,
		role: c.role,
		avatar_url: c.avatar_url
	}));
	known.set(me.id, {
		id: me.id,
		display_name: me.display_name,
		role: me.role,
		avatar_url: me.avatar_url
	});
	const nm = (id) => known.get(id)?.display_name || "مستخدم";
	const rl = (id) => known.get(id)?.role || "student";
	const av = (id) => known.get(id)?.avatar_url || void 0;
	const counts = {};
	memberRows.forEach((m) => {
		counts[m.class_id] = (counts[m.class_id] || 0) + 1;
	});
	const ministries = [];
	const schools = [];
	const classes = [];
	classRows.forEach((r) => {
		const rawTheme = String(r.color_theme || "");
		const createdAt = toIso(r.created_at);
		if (rawTheme.startsWith(MINISTRY_PREFIX)) {
			const parts = rawTheme.slice(17).split("|");
			const theme = parts[0] && parts[0].includes("from-") ? parts[0] : "from-slate-800 to-slate-900";
			const region = parts.slice(1).join("|") || r.grade_level || "عام";
			ministries.push({
				id: r.id,
				owner_id: r.teacher_id,
				owner_name: nm(r.teacher_id),
				name: r.title,
				region,
				description: r.description || "",
				join_code: r.join_code,
				colorTheme: theme,
				members_count: counts[r.id] ?? r.members_count ?? 1,
				created_at: createdAt
			});
		} else if (rawTheme.startsWith(SCHOOL_PREFIX)) {
			const parts = rawTheme.slice(15).split("|");
			const ministry_id = (parts.find((p) => p.startsWith("ministry:")) || "").slice(9) || void 0;
			const themePart = parts.find((p) => p.includes("from-")) || "from-emerald-600 to-teal-700";
			const regionPart = parts.find((p) => !p.startsWith("ministry:") && !p.includes("from-")) || "";
			schools.push({
				id: r.id,
				owner_id: r.teacher_id,
				owner_name: nm(r.teacher_id),
				ministry_id,
				name: r.title,
				stage: r.grade_level || "تعليم عام",
				region: regionPart || r.subject || "عام",
				description: r.description || "",
				join_code: r.join_code,
				colorTheme: themePart,
				members_count: counts[r.id] ?? r.members_count ?? 1,
				created_at: createdAt
			});
		} else {
			const schoolMatch = rawTheme.match(/\|school:([^|]+)/);
			const school_id = schoolMatch ? schoolMatch[1] : void 0;
			classes.push({
				id: r.id,
				teacher_id: r.teacher_id,
				teacher_name: nm(r.teacher_id),
				school_id,
				title: r.title,
				subject: r.subject || "",
				grade_level: r.grade_level || "",
				join_code: r.join_code,
				description: r.description || "",
				class_type: r.class_type || "class",
				is_archived: !!r.is_archived,
				members_count: counts[r.id] ?? r.members_count ?? 1,
				colorTheme: cleanTheme(rawTheme),
				created_at: createdAt
			});
		}
	});
	const classById = new Map(classes.map((c) => [c.id, c]));
	const spaceTitleById = new Map([
		...classes.map((c) => [c.id, c.title]),
		...schools.map((s) => [s.id, s.name]),
		...ministries.map((m) => [m.id, m.name])
	]);
	const lessons = lessonRows.map((r) => ({
		id: r.id,
		class_id: r.class_id,
		teacher_id: r.teacher_id,
		teacher_name: nm(r.teacher_id),
		title: r.title,
		content: r.content || "",
		video_url: r.video_url || void 0,
		duration: r.duration || void 0,
		attachment_url: r.attachment_url || void 0,
		attachment_name: r.attachment_name || void 0,
		position: Number(r.position ?? 0),
		published_at: r.published_at || toIso(r.created_at)
	}));
	const courses = classes.filter((c) => c.class_type === "class").map((c) => ({
		id: c.id,
		owner_id: c.teacher_id,
		owner_name: c.teacher_name,
		title: c.title,
		description: c.description,
		category: c.subject || "عام",
		lessons_count: lessons.filter((l) => l.class_id === c.id).length,
		students_count: c.members_count,
		rating: 0,
		image_url: coverFor(c.colorTheme, c.title)
	}));
	const submissions = subRows.map((r) => ({
		id: r.id,
		assignment_id: r.assignment_id,
		student_id: r.student_id,
		student_name: nm(r.student_id),
		answer_text: r.answer_text || "",
		attachment_url: r.attachment_url || void 0,
		submitted_at: toIso(r.submitted_at),
		grade: r.grade != null ? Number(r.grade) : void 0,
		teacher_feedback: r.teacher_feedback || void 0,
		graded_at: r.grade != null ? toIso(r.submitted_at) : void 0
	})).sort((a, b) => b.submitted_at.localeCompare(a.submitted_at));
	const assignments = assignRows.map((r) => ({
		id: r.id,
		class_id: r.class_id,
		class_title: classById.get(r.class_id)?.title || "",
		teacher_id: r.teacher_id,
		teacher_name: nm(r.teacher_id),
		title: r.title,
		instructions: r.instructions || "",
		due_at: r.due_at || toIso(r.created_at),
		total_points: Number(r.total_points ?? 20),
		submissions_count: submissions.filter((s) => s.assignment_id === r.id).length,
		created_at: toIso(r.created_at)
	}));
	const quizzes = quizRows.map((r) => {
		const keyDoc = keyMap.get(r.id);
		const keyEntries = keyDoc?.entries && typeof keyDoc.entries === "object" ? keyDoc.entries : {};
		const questions = Array.isArray(r.questions) ? r.questions.map((q, idx) => {
			const qid = String(q.id || `q_${idx}`);
			const k = keyEntries[qid];
			return {
				id: qid,
				type: q.type || "mcq",
				topic: typeof q.topic === "string" ? q.topic : "",
				question: q.question || "",
				options: Array.isArray(q.options) ? q.options : [],
				correctOptionIndex: k ? Number(k.correctOptionIndex ?? -1) : -1,
				correctOptionIndices: k && Array.isArray(k.correctOptionIndices) ? k.correctOptionIndices : void 0,
				acceptedAnswers: k && Array.isArray(k.acceptedAnswers) ? k.acceptedAnswers : void 0,
				modelAnswer: k && typeof k.modelAnswer === "string" ? k.modelAnswer : void 0,
				caseSensitive: Boolean(q.caseSensitive),
				explanation: k ? String(k.explanation || "") : "",
				points: Number(q.points) || 1
			};
		}) : [];
		const totalPts = questions.reduce((sum, qq) => sum + qq.points, 0);
		const quizAttempts = attemptRows.filter((a) => a.quiz_id === r.id).map((a) => ({
			id: a.id,
			quiz_id: a.quiz_id,
			student_id: a.student_id,
			student_name: nm(a.student_id),
			answers: a.answers && typeof a.answers === "object" ? a.answers : {},
			score: Number(a.score ?? 0),
			totalPoints: totalPts,
			needsManualGrading: Boolean(a.needs_manual_grading),
			teacherFeedback: a.teacher_feedback || "",
			questionFeedback: a.question_feedback && typeof a.question_feedback === "object" ? a.question_feedback : {},
			submitted_at: toIso(a.submitted_at || r.created_at)
		}));
		const myAttempt = quizAttempts.find((a) => a.student_id === me.id);
		return {
			id: r.id,
			class_id: r.class_id,
			class_title: classById.get(r.class_id)?.title || "",
			title: r.title,
			description: r.description || "",
			timeLimitMinutes: Number(r.time_limit_minutes ?? 10),
			questions,
			isPublished: !!r.is_published,
			attemptsCount: quizAttempts.length,
			attempted: !!myAttempt,
			myScore: myAttempt ? myAttempt.score : 0,
			myAnswers: myAttempt?.answers,
			needsManualGrading: myAttempt?.needsManualGrading,
			teacherFeedback: myAttempt?.teacherFeedback,
			questionFeedback: myAttempt?.questionFeedback,
			attempts: quizAttempts
		};
	});
	const posts = postRows.map((r) => {
		const comments = commentRows.filter((c) => c.post_id === r.id).map((c) => ({
			id: c.id,
			post_id: c.post_id,
			author_id: c.author_id,
			author_name: nm(c.author_id),
			author_avatar: av(c.author_id),
			body: c.body,
			created_at: toIso(c.created_at)
		}));
		const likes = likeRows.filter((l) => l.post_id === r.id);
		return {
			id: r.id,
			author_id: r.author_id,
			author_name: nm(r.author_id),
			author_role: rl(r.author_id),
			author_avatar: av(r.author_id),
			body: r.body || "",
			category: r.category || "all",
			media_url: r.media_url || void 0,
			media_type: r.media_type || void 0,
			visibility: r.visibility || "public",
			likes_count: likes.length,
			comments_count: comments.length,
			comments,
			is_liked: likes.some((l) => l.user_id === me.id),
			is_saved: false,
			created_at: toIso(r.created_at)
		};
	});
	const stories = storyRows.map((r) => ({
		id: r.id,
		user_id: r.user_id,
		user_name: nm(r.user_id),
		user_role: rl(r.user_id),
		user_avatar: av(r.user_id),
		body: r.body,
		bgGradient: r.bg_gradient,
		created_at: toIso(r.created_at),
		expires_at: r.expires_at
	}));
	const liveSessions = liveRows.map((r) => ({
		id: r.id,
		host_id: r.host_id,
		host_name: nm(r.host_id),
		class_id: r.class_id || void 0,
		class_title: r.class_id ? classById.get(r.class_id)?.title : void 0,
		title: r.title,
		description: r.description || "",
		meeting_url: r.meeting_url || void 0,
		starts_at: r.starts_at,
		status: r.status,
		participants_count: 0
	}));
	const messages = [...dmRows.map((r) => ({
		id: r.id,
		sender_id: r.sender_id,
		sender_name: nm(r.sender_id),
		sender_role: rl(r.sender_id),
		recipient_id: r.recipient_id,
		recipient_name: nm(r.recipient_id),
		body: r.body || "",
		attachment: r.attachment_url ? attachmentOf(r.attachment_url, r.attachment_name || null, r.sender_id, toIso(r.created_at), nm) : void 0,
		reactions: {},
		created_at: toIso(r.created_at),
		read_at: r.read_at || void 0
	})), ...cmRows.map((r) => ({
		id: r.id,
		sender_id: r.sender_id,
		sender_name: nm(r.sender_id),
		sender_role: rl(r.sender_id),
		recipient_id: r.class_id,
		recipient_name: spaceTitleById.get(r.class_id) || "",
		channel_id: r.class_id,
		body: r.body || "",
		attachment: r.attachment_url ? attachmentOf(r.attachment_url, r.attachment_name || null, r.sender_id, toIso(r.created_at), nm) : void 0,
		reactions: {},
		created_at: toIso(r.created_at)
	}))].sort((a, b) => a.created_at.localeCompare(b.created_at));
	const notifications = notifRows.map((r) => ({
		id: r.id,
		title: r.payload?.title || "إشعار",
		body: r.payload?.body || "",
		kind: [
			"academic",
			"social",
			"live",
			"grade"
		].includes(r.kind) ? r.kind : "academic",
		created_at: toIso(r.created_at),
		read: !!r.read_at
	})).sort((a, b) => b.created_at.localeCompare(a.created_at));
	const reports = reportRows.map((r) => ({
		id: r.id,
		target_id: r.target_id,
		target_type: r.target_type === "profile" ? "user" : r.target_type,
		reporter_name: nm(r.reporter_id),
		reason: r.reason,
		details: [r.details, r.snapshot ? `«${r.snapshot}»` : ""].filter(Boolean).join(" — "),
		status: r.status,
		created_at: toIso(r.created_at)
	})).sort((a, b) => b.created_at.localeCompare(a.created_at));
	const myTaught = new Set(classes.filter((c) => c.teacher_id === me.id).map((c) => c.id));
	const classMembers = memberRows.filter((r) => myTaught.has(r.class_id)).map((r) => ({
		class_id: r.class_id,
		user_id: r.user_id,
		name: nm(r.user_id),
		member_role: r.member_role
	}));
	const orgIdSet = /* @__PURE__ */ new Set([...schools.map((s) => s.id), ...ministries.map((m) => m.id)]);
	const orgMembers = memberRows.filter((r) => orgIdSet.has(r.class_id)).map((r) => ({
		class_id: r.class_id,
		user_id: r.user_id,
		name: nm(r.user_id),
		member_role: r.member_role
	}));
	const myOrgIds = [.../* @__PURE__ */ new Set([
		...schools.filter((s) => s.owner_id === me.id).map((s) => s.id),
		...ministries.filter((m) => m.owner_id === me.id).map((m) => m.id),
		...orgMembers.filter((m) => m.user_id === me.id).map((m) => m.class_id)
	])];
	const followingIds = followRows.filter((f) => f.follower_id === me.id).map((f) => String(f.followed_id));
	const followerIds = followRows.filter((f) => f.followed_id === me.id).map((f) => String(f.follower_id));
	const followRequests = followReqRows.map((r) => ({
		id: r.id,
		requester_id: r.requester_id,
		requester_name: nm(r.requester_id),
		requester_avatar: av(r.requester_id),
		requester_role: rl(r.requester_id),
		target_id: r.target_id,
		status: r.status,
		created_at: toIso(r.created_at)
	})).sort((a, b) => b.created_at.localeCompare(a.created_at));
	return {
		classes,
		schools,
		ministries,
		myOrgIds,
		orgMembers,
		courses,
		lessons,
		quizzes,
		assignments,
		submissions,
		posts,
		stories,
		liveSessions,
		messages,
		notifications,
		reports,
		contacts,
		classMembers,
		myClassIds: [.../* @__PURE__ */ new Set([...classes.filter((c) => c.teacher_id === me.id).map((c) => c.id), ...memberRows.filter((r) => r.user_id === me.id).map((r) => String(r.class_id))])],
		followingIds,
		followerIds,
		followRequests
	};
}
function attachmentOf(url, name, by, at, nm) {
	const fname = name || url.split("/").pop() || "ملف";
	const ext = (fname.split(".").pop() || "").toLowerCase();
	return {
		id: url,
		name: fname,
		size: "",
		type: [
			"webm",
			"ogg",
			"mp3",
			"wav",
			"m4a",
			"aac",
			"opus"
		].includes(ext) ? "audio" : ext === "pdf" ? "pdf" : [
			"png",
			"jpg",
			"jpeg",
			"webp",
			"gif"
		].includes(ext) ? "image" : [
			"ts",
			"js",
			"py",
			"java",
			"html",
			"css",
			"sql",
			"txt"
		].includes(ext) ? "code" : "doc",
		url,
		uploaded_by: nm(by),
		uploaded_at: at
	};
}
function subscribeRealtimeUpdates(uid, onChange) {
	const unsubs = [];
	const watch = (path, q) => {
		let first = true;
		const u = onSnapshot(q, () => {
			if (first) {
				first = false;
				return;
			}
			onChange();
		}, (err) => {
			if (String(err?.message || "").toLowerCase().includes("permission")) handleFirestoreError(err, OperationType.LIST, path);
		});
		unsubs.push(u);
	};
	watch("live_sessions", query(collection(db, "live_sessions"), where("status", "in", [
		"scheduled",
		"live",
		"ended"
	])));
	watch("posts", query(collection(db, "posts"), where("visibility", "in", ["public", "followers"])));
	watch("assignments", query(collection(db, "assignments"), where("total_points", ">=", 1)));
	watch("quizzes", query(collection(db, "quizzes"), where("is_published", "in", [true, false])));
	return () => {
		unsubs.forEach((u) => u());
	};
}
function subscribeRealtimeMessagesAndNotifications(uid, getLookup, callbacks) {
	const resolveActor = (actorId) => {
		const { me, contacts } = getLookup();
		if (me && actorId === me.id) return {
			name: me.display_name,
			role: me.role
		};
		const hit = contacts.find((c) => c.id === actorId);
		return {
			name: hit?.name || "مستخدم",
			role: hit?.role || "student"
		};
	};
	let firstDm = true;
	const unsubDm = onSnapshot(query(collection(db, "direct_messages"), where("participants", "array-contains", uid), limit(500)), (snap) => {
		if (firstDm) {
			firstDm = false;
			return;
		}
		const mapped = snap.docs.map((d) => {
			const r = mapDoc(d);
			const sender = resolveActor(r.sender_id);
			const recipient = resolveActor(r.recipient_id);
			return {
				id: r.id,
				sender_id: r.sender_id,
				sender_name: sender.name,
				sender_role: sender.role,
				recipient_id: r.recipient_id,
				recipient_name: recipient.name,
				body: r.body || "",
				attachment: r.attachment_url ? attachmentOf(r.attachment_url, r.attachment_name || null, r.sender_id, toIso(r.created_at), (id) => resolveActor(id).name) : void 0,
				reactions: {},
				created_at: toIso(r.created_at),
				read_at: r.read_at || void 0
			};
		});
		callbacks.onDirectMessages(mapped);
	}, (err) => {
		if (String(err?.message || "").toLowerCase().includes("permission")) handleFirestoreError(err, OperationType.LIST, "direct_messages");
	});
	let firstCm = true;
	const unsubCm = onSnapshot(query(collection(db, "class_messages"), where("class_id", "!=", ""), limit(500)), (snap) => {
		if (firstCm) {
			firstCm = false;
			return;
		}
		const { spaceTitles } = getLookup();
		const mapped = snap.docs.map((d) => {
			const r = mapDoc(d);
			const sender = resolveActor(r.sender_id);
			return {
				id: r.id,
				sender_id: r.sender_id,
				sender_name: sender.name,
				sender_role: sender.role,
				recipient_id: r.class_id,
				recipient_name: spaceTitles.get(r.class_id) || "",
				channel_id: r.class_id,
				body: r.body || "",
				attachment: r.attachment_url ? attachmentOf(r.attachment_url, r.attachment_name || null, r.sender_id, toIso(r.created_at), (id) => resolveActor(id).name) : void 0,
				reactions: {},
				created_at: toIso(r.created_at)
			};
		});
		callbacks.onClassMessages(mapped);
	}, (err) => {
		if (String(err?.message || "").toLowerCase().includes("permission")) handleFirestoreError(err, OperationType.LIST, "class_messages");
	});
	let firstNotif = true;
	const unsubNotif = onSnapshot(query(collection(db, "notifications"), where("user_id", "==", uid), limit(50)), (snap) => {
		if (firstNotif) {
			firstNotif = false;
			return;
		}
		const mapped = snap.docs.map((d) => {
			const r = mapDoc(d);
			return {
				id: r.id,
				title: r.payload?.title || "إشعار",
				body: r.payload?.body || "",
				kind: [
					"academic",
					"social",
					"live",
					"grade"
				].includes(r.kind) ? r.kind : "academic",
				created_at: toIso(r.created_at),
				read: !!r.read_at
			};
		}).sort((a, b) => b.created_at.localeCompare(a.created_at));
		callbacks.onNotifications(mapped);
	}, (err) => {
		if (String(err?.message || "").toLowerCase().includes("permission")) handleFirestoreError(err, OperationType.LIST, "notifications");
	});
	return () => {
		unsubDm();
		unsubCm();
		unsubNotif();
	};
}
async function createClassRecord(payload, uid, memberRole) {
	const joinCode = makeJoinCode();
	const clsRef = doc(collection(db, "classes"));
	try {
		await setDoc(clsRef, {
			...payload,
			teacher_id: uid,
			join_code: joinCode,
			is_archived: false,
			members_count: 1,
			created_at: serverTimestamp()
		});
		await Promise.all([setDoc(doc(db, "class_codes", joinCode), {
			join_code: joinCode,
			class_id: clsRef.id,
			teacher_id: uid,
			is_archived: false
		}), setDoc(doc(db, "class_members", `${clsRef.id}_${uid}`), {
			class_id: clsRef.id,
			user_id: uid,
			member_role: memberRole,
			joined_at: serverTimestamp()
		})]);
	} catch (err) {
		handleFirestoreError(err, OperationType.CREATE, "classes");
	}
}
async function createClass(uid, c) {
	const encodedTheme = c.school_id ? `${cleanTheme(c.colorTheme)}|school:${c.school_id}` : cleanTheme(c.colorTheme);
	await createClassRecord({
		title: c.title.slice(0, 120),
		subject: (c.subject || "").slice(0, 120),
		grade_level: (c.grade_level || "").slice(0, 120),
		description: (c.description || "").slice(0, 2e3),
		class_type: c.class_type || "class",
		color_theme: encodedTheme.slice(0, 250)
	}, uid, "assistant");
}
async function createMinistry(uid, m) {
	const theme = m.colorTheme || "from-slate-800 to-slate-900";
	const region = (m.region || "عام").replace(/\|/g, " ");
	await createClassRecord({
		title: m.name.trim().slice(0, 120),
		subject: "إشراف وزاري ومجمّع تعليمي",
		grade_level: region.slice(0, 120),
		description: (m.description.trim() || "مظلة إشرافية لمتابعة المدارس والصفوف وتوجيه التعاميم التربوية.").slice(0, 2e3),
		class_type: "class",
		color_theme: `${MINISTRY_PREFIX}${theme}|${region}`.slice(0, 250)
	}, uid, "assistant");
}
async function createSchool(uid, s) {
	const theme = s.colorTheme || "from-emerald-600 to-teal-700";
	const region = (s.region || "عام").replace(/\|/g, " ");
	await createClassRecord({
		title: s.name.trim().slice(0, 120),
		subject: region.slice(0, 120),
		grade_level: (s.stage.trim() || "تعليم عام").slice(0, 120),
		description: (s.description.trim() || "مؤسسة تعليمية لإدارة الصفوف والمعلمين والطلاب والاختبارات.").slice(0, 2e3),
		class_type: "class",
		color_theme: `${SCHOOL_PREFIX}ministry:${s.ministry_id || ""}|${theme}|${region}`.slice(0, 250)
	}, uid, "assistant");
}
async function linkSchoolToMinistry(school, ministryId) {
	const region = (school.region || "عام").replace(/\|/g, " ");
	const theme = cleanTheme(school.colorTheme);
	try {
		await updateDoc(doc(db, "classes", school.id), { color_theme: `${SCHOOL_PREFIX}ministry:${ministryId || ""}|${theme}|${region}`.slice(0, 250) });
	} catch (err) {
		handleFirestoreError(err, OperationType.UPDATE, `classes/${school.id}`);
	}
}
async function linkClassToSchool(cls, schoolId) {
	const base = cleanTheme(cls.colorTheme);
	try {
		await updateDoc(doc(db, "classes", cls.id), { color_theme: (schoolId ? `${base}|school:${schoolId}` : base).slice(0, 250) });
	} catch (err) {
		handleFirestoreError(err, OperationType.UPDATE, `classes/${cls.id}`);
	}
}
async function joinClass(code) {
	const uid = auth.currentUser?.uid;
	const cleanCode = (code || "").trim().toUpperCase().replace(/[^A-Z0-9_-]/g, "");
	if (!uid || !cleanCode) return false;
	try {
		const codeSnap = await getDoc(doc(db, "class_codes", cleanCode));
		if (!codeSnap.exists()) return false;
		const codeData = codeSnap.data();
		if (codeData.is_archived || !codeData.class_id) return false;
		const memberId = `${codeData.class_id}_${uid}`;
		const memberRef = doc(db, "class_members", memberId);
		if (!(await getDoc(memberRef)).exists()) {
			await setDoc(memberRef, {
				class_id: codeData.class_id,
				user_id: uid,
				member_role: "student",
				joined_at: serverTimestamp()
			});
			await updateDoc(doc(db, "classes", codeData.class_id), { members_count: increment(1) }).catch(() => {});
		}
		return true;
	} catch {
		return false;
	}
}
async function createLesson(uid, l) {
	const payload = {
		class_id: l.class_id,
		teacher_id: uid,
		title: l.title.slice(0, 200),
		content: (l.content || "").slice(0, 2e4),
		position: Math.max(0, Math.round(Number(l.position ?? 0)) || 0),
		published_at: (/* @__PURE__ */ new Date()).toISOString(),
		created_at: serverTimestamp()
	};
	if (l.video_url) payload.video_url = l.video_url.slice(0, 2e3);
	if (l.duration) payload.duration = l.duration.slice(0, 40);
	if (l.attachment_url) payload.attachment_url = l.attachment_url.slice(0, 2e3);
	if (l.attachment_name) payload.attachment_name = l.attachment_name.slice(0, 255);
	try {
		await addDoc(collection(db, "lessons"), payload);
	} catch (err) {
		handleFirestoreError(err, OperationType.CREATE, "lessons");
	}
}
function normalizeQuizText(txt, caseSensitive = false) {
	let v = (txt || "").trim().replace(/\s+/g, " ");
	v = v.replace(/[\u064B-\u065F\u0670\u0640]/g, "");
	v = v.replace(/[أإآ]/g, "ا").replace(/ة/g, "ه").replace(/ى/g, "ي");
	return caseSensitive ? v : v.toLowerCase();
}
async function createQuiz(uid, q) {
	const quizRef = doc(collection(db, "quizzes"));
	const sanitizedQuestions = [];
	const keyEntries = {};
	q.questions.forEach((qq, idx) => {
		const qid = qq.id && /^[a-zA-Z0-9_-]+$/.test(qq.id) ? qq.id : `q_${idx}_${Date.now()}`;
		sanitizedQuestions.push({
			id: qid,
			type: qq.type || "mcq",
			topic: (qq.topic || "").trim(),
			question: qq.question,
			options: Array.isArray(qq.options) ? qq.options : [],
			caseSensitive: Boolean(qq.caseSensitive),
			points: Number(qq.points) || 1
		});
		keyEntries[qid] = {
			type: qq.type || "mcq",
			correctOptionIndex: qq.correctOptionIndex ?? 0,
			correctOptionIndices: qq.correctOptionIndices || [],
			acceptedAnswers: qq.acceptedAnswers || [],
			modelAnswer: qq.modelAnswer || "",
			caseSensitive: Boolean(qq.caseSensitive),
			explanation: qq.explanation || "",
			points: Number(qq.points) || 1
		};
	});
	try {
		await setDoc(quizRef, {
			class_id: q.class_id,
			teacher_id: uid,
			title: q.title.slice(0, 200),
			description: (q.description || "").slice(0, 2e3),
			time_limit_minutes: Math.max(1, Number(q.timeLimitMinutes) || 10),
			is_published: Boolean(q.isPublished),
			questions: sanitizedQuestions,
			created_at: serverTimestamp()
		});
		await setDoc(doc(db, "quiz_answer_keys", quizRef.id), {
			quiz_id: quizRef.id,
			teacher_id: uid,
			entries: keyEntries,
			created_at: serverTimestamp()
		});
	} catch (err) {
		handleFirestoreError(err, OperationType.CREATE, "quizzes");
	}
}
async function submitQuiz(quizId, answers, questions = []) {
	const uid = auth.currentUser?.uid;
	if (!uid) throw new Error("يجب تسجيل الدخول لإرسال الاختبار");
	const quizSnap = await getDoc(doc(db, "quizzes", quizId));
	const quizData = quizSnap.exists() ? quizSnap.data() : {};
	const teacherId = String(quizData.teacher_id || "");
	const attemptRef = doc(db, "quiz_attempts", `${quizId}_${uid}`);
	try {
		await setDoc(attemptRef, {
			quiz_id: quizId,
			teacher_id: teacherId,
			student_id: uid,
			answers,
			score: 0,
			auto_graded: false,
			needs_manual_grading: false,
			submitted_at: serverTimestamp()
		});
	} catch (err) {
		handleFirestoreError(err, OperationType.CREATE, `quiz_attempts/${quizId}_${uid}`);
	}
	let keyEntries = {};
	try {
		const keySnap = await getDoc(doc(db, "quiz_answer_keys", quizId));
		if (keySnap.exists()) keyEntries = keySnap.data()?.entries || {};
	} catch (err) {
		handleFirestoreError(err, OperationType.GET, `quiz_answer_keys/${quizId}`);
	}
	const qList = questions.length > 0 ? questions : quizData.questions || [];
	let score = 0;
	let total = 0;
	let needsManual = false;
	const resultKey = {};
	for (const q of qList) {
		const k = keyEntries[q.id] || {};
		const qType = k.type || q.type || "mcq";
		const pts = Number(k.points ?? q.points ?? 1);
		const caseSens = Boolean(k.caseSensitive ?? q.caseSensitive);
		const explanation = String(k.explanation ?? q.explanation ?? "");
		const val = answers[q.id];
		total += pts;
		if (qType === "mcq" || qType === "true_false") {
			const correct = Number(k.correctOptionIndex ?? q.correctOptionIndex ?? -1);
			const ok = typeof val === "number" && val === correct;
			if (ok) score += pts;
			resultKey[q.id] = {
				type: qType,
				correct,
				explanation,
				isCorrect: ok
			};
		} else if (qType === "multi_select") {
			const expected = [...k.correctOptionIndices ?? q.correctOptionIndices ?? []].sort((a, b) => a - b);
			const given = Array.isArray(val) ? [...new Set(val)].sort((a, b) => a - b) : [];
			const ok = expected.length > 0 && expected.length === given.length && expected.every((v, idx) => v === given[idx]);
			if (ok) score += pts;
			resultKey[q.id] = {
				type: "multi_select",
				correctIndices: expected,
				explanation,
				isCorrect: ok
			};
		} else if (qType === "short_answer" || qType === "fill_blank") {
			const userStr = typeof val === "string" ? normalizeQuizText(val, caseSens) : "";
			const accepted = k.acceptedAnswers ?? q.acceptedAnswers ?? [];
			const ok = userStr !== "" && accepted.some((a) => normalizeQuizText(a, caseSens) === userStr);
			if (ok) score += pts;
			resultKey[q.id] = {
				type: qType,
				acceptedAnswers: accepted,
				explanation,
				isCorrect: ok
			};
		} else if (qType === "essay") {
			needsManual = true;
			resultKey[q.id] = {
				type: "essay",
				modelAnswer: String(k.modelAnswer ?? q.modelAnswer ?? ""),
				explanation,
				pendingReview: true
			};
		}
	}
	try {
		await updateDoc(attemptRef, {
			score,
			auto_graded: true,
			needs_manual_grading: needsManual
		});
	} catch (err) {
		handleFirestoreError(err, OperationType.UPDATE, `quiz_attempts/${quizId}_${uid}`);
	}
	return {
		score,
		total,
		needsManualGrading: needsManual,
		key: resultKey
	};
}
async function uploadQuizAudioFeedback(userId, blobOrFile, extHint = "webm") {
	if (blobOrFile.size > 10485760) throw new Error("حجم التسجيل الصوتي أكبر من 10 ميجابايت");
	const ext = ((blobOrFile instanceof File ? blobOrFile.name : `voice.${extHint}`).split(".").pop() || extHint).toLowerCase().replace(/[^a-z0-9]/g, "") || "webm";
	const storagePath = `nemvia/${userId}/quiz-feedback/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
	const contentType = blobOrFile.type || (ext === "mp3" ? "audio/mpeg" : ext === "m4a" ? "audio/mp4" : `audio/${ext}`);
	try {
		const storageRef = ref(storage, storagePath);
		await uploadBytes(storageRef, blobOrFile, { contentType });
		return await getDownloadURL(storageRef);
	} catch (err) {
		throw new Error(err?.message || "تعذّر رفع التسجيل الصوتي — تأكد من تفعيل Firebase Storage");
	}
}
async function gradeQuizAttempt(attemptId, score, feedback, questionFeedback = {}) {
	const attemptRef = doc(db, "quiz_attempts", attemptId);
	try {
		const snap = await getDoc(attemptRef);
		await updateDoc(attemptRef, {
			score,
			needs_manual_grading: false,
			teacher_feedback: (feedback || "").slice(0, 4e3),
			question_feedback: questionFeedback
		});
		if (snap.exists()) {
			const data = snap.data();
			if (data.student_id) await addDoc(collection(db, "notifications"), {
				user_id: data.student_id,
				kind: "grade",
				payload: {
					title: "تم رصد درجة اختبارك",
					body: `الدرجة النهائية: ${score}${feedback ? ` — ${feedback.slice(0, 120)}` : ""}`
				},
				created_at: serverTimestamp()
			}).catch(() => {});
		}
	} catch (err) {
		handleFirestoreError(err, OperationType.UPDATE, `quiz_attempts/${attemptId}`);
	}
}
var TYPE_AR_LABELS = {
	mcq: "اختيار من متعدد",
	true_false: "صح أم خطأ",
	multi_select: "تحديد متعدد",
	short_answer: "إجابة قصيرة",
	fill_blank: "أكمل الفراغ",
	essay: "سؤال مقالي"
};
function buildQuizPerformanceReport(quiz, answers = {}, result, questionFeedback) {
	const maxScore = result?.total ?? quiz.questions.reduce((sum, q) => sum + q.points, 0);
	const typeMap = /* @__PURE__ */ new Map();
	const topicMap = /* @__PURE__ */ new Map();
	let correctCount = 0;
	let incorrectCount = 0;
	let pendingCount = 0;
	let unansweredCount = 0;
	let computedScore = 0;
	const items = quiz.questions.map((q, index) => {
		const qType = q.type || "mcq";
		const userVal = answers[q.id];
		const keyEntry = result?.key?.[q.id];
		const qFb = questionFeedback?.[q.id] ?? quiz.questionFeedback?.[q.id];
		const hasAnswer = userVal !== void 0 && userVal !== null && !(Array.isArray(userVal) && userVal.length === 0) && !(typeof userVal === "string" && userVal.trim() === "");
		let status = "incorrect";
		let earnedPoints = 0;
		if (qFb?.points_awarded !== void 0) {
			earnedPoints = Math.max(0, Math.min(q.points, Number(qFb.points_awarded)));
			if (earnedPoints >= q.points * .6) {
				status = "correct";
				correctCount += 1;
			} else if (hasAnswer || earnedPoints > 0 || qType === "essay") {
				status = "incorrect";
				incorrectCount += 1;
			} else {
				status = "unanswered";
				unansweredCount += 1;
			}
		} else if (!hasAnswer) {
			status = "unanswered";
			unansweredCount += 1;
		} else if (qType === "essay" || keyEntry?.pendingReview) {
			if (hasAnswer) {
				status = "pending";
				pendingCount += 1;
			}
		} else if (keyEntry?.isCorrect !== void 0) {
			if (keyEntry.isCorrect) {
				status = "correct";
				earnedPoints = q.points;
				correctCount += 1;
			} else if (hasAnswer) {
				status = "incorrect";
				incorrectCount += 1;
			}
		} else if (hasAnswer) {
			if ((qType === "mcq" || qType === "true_false") && q.correctOptionIndex >= 0 && typeof userVal === "number") {
				if (userVal === q.correctOptionIndex) {
					status = "correct";
					earnedPoints = q.points;
					correctCount += 1;
				} else {
					status = "incorrect";
					incorrectCount += 1;
				}
			} else if (qType === "multi_select" && q.correctOptionIndices?.length) {
				const exp = [...q.correctOptionIndices].sort((a, b) => a - b);
				const got = Array.isArray(userVal) ? [...new Set(userVal)].sort((a, b) => a - b) : [];
				if (exp.length === got.length && exp.every((v, i) => v === got[i])) {
					status = "correct";
					earnedPoints = q.points;
					correctCount += 1;
				} else {
					status = "incorrect";
					incorrectCount += 1;
				}
			} else if ((qType === "short_answer" || qType === "fill_blank") && q.acceptedAnswers?.length) {
				const norm = typeof userVal === "string" ? normalizeQuizText(userVal, q.caseSensitive) : "";
				if (norm && q.acceptedAnswers.some((a) => normalizeQuizText(a, q.caseSensitive) === norm)) {
					status = "correct";
					earnedPoints = q.points;
					correctCount += 1;
				} else {
					status = "incorrect";
					incorrectCount += 1;
				}
			} else if (keyEntry?.correct !== void 0 && typeof userVal === "number") {
				if (userVal === keyEntry.correct) {
					status = "correct";
					earnedPoints = q.points;
					correctCount += 1;
				} else {
					status = "incorrect";
					incorrectCount += 1;
				}
			} else {
				status = "pending";
				pendingCount += 1;
			}
		}
		computedScore += earnedPoints;
		if (status !== "pending") {
			const tStat = typeMap.get(qType) || {
				totalQ: 0,
				okQ: 0,
				earned: 0,
				max: 0
			};
			tStat.totalQ += 1;
			if (status === "correct") tStat.okQ += 1;
			tStat.earned += earnedPoints;
			tStat.max += q.points;
			typeMap.set(qType, tStat);
			const topicName = (q.topic || "").trim();
			if (topicName) {
				const topStat = topicMap.get(topicName) || {
					totalQ: 0,
					okQ: 0,
					earned: 0,
					max: 0
				};
				topStat.totalQ += 1;
				if (status === "correct") topStat.okQ += 1;
				topStat.earned += earnedPoints;
				topStat.max += q.points;
				topicMap.set(topicName, topStat);
			}
		}
		return {
			question: q,
			index,
			type: qType,
			userAnswer: userVal,
			status,
			earnedPoints,
			maxPoints: q.points,
			keyEntry,
			teacherFeedback: qFb
		};
	});
	const totalScore = result?.score ?? (quiz.attempted ? quiz.myScore ?? computedScore : computedScore);
	const percentage = maxScore > 0 ? Math.min(100, Math.round(totalScore / maxScore * 100)) : 0;
	const gradeLabel = percentage >= 90 ? "ممتاز" : percentage >= 80 ? "جيد جداً" : percentage >= 70 ? "جيد" : percentage >= 55 ? "مقبول" : "يحتاج إلى مراجعة ودعم";
	const byType = [...typeMap.entries()].map(([t, s]) => ({
		key: t,
		label: TYPE_AR_LABELS[t] || t,
		totalQuestions: s.totalQ,
		correctQuestions: s.okQ,
		earnedPoints: s.earned,
		maxPoints: s.max,
		accuracy: s.max > 0 ? Math.round(s.earned / s.max * 100) : 0
	}));
	const byTopic = [...topicMap.entries()].map(([topic, s]) => ({
		key: topic,
		label: topic,
		totalQuestions: s.totalQ,
		correctQuestions: s.okQ,
		earnedPoints: s.earned,
		maxPoints: s.max,
		accuracy: s.max > 0 ? Math.round(s.earned / s.max * 100) : 0
	}));
	const strengths = [];
	const weaknesses = [];
	const recommendations = [];
	byTopic.forEach((tp) => {
		if (tp.accuracy >= 75) strengths.push(`إتقان واضح لموضوع «${tp.label}» بنسبة ${tp.accuracy}% (${tp.correctQuestions}/${tp.totalQuestions})`);
		else if (tp.accuracy < 60) weaknesses.push(`تحتاج إلى تقوية في موضوع «${tp.label}» (${tp.accuracy}%)`);
	});
	byType.forEach((bt) => {
		if (bt.accuracy >= 75) strengths.push(`أداء متميز في أسئلة «${bt.label}» بدقة ${bt.accuracy}%`);
		else if (bt.accuracy < 60) weaknesses.push(`انخفاض الدقة في أسئلة «${bt.label}» (${bt.accuracy}% — ${bt.correctQuestions}/${bt.totalQuestions})`);
	});
	if (unansweredCount > 0) {
		weaknesses.push(`تركت ${unansweredCount} ${unansweredCount === 1 ? "سؤالاً" : "أسئلة"} بدون إجابة قبل انتهاء الوقت`);
		recommendations.push("راقب مؤقت الاختبار ووزّع وقتك على جميع الأسئلة بحيث لا تترك سؤالاً فارغاً.");
	}
	if (byType.some((b) => (b.key === "short_answer" || b.key === "fill_blank") && b.accuracy < 60)) recommendations.push("راجع المصطلحات والتعريفات الأساسية بدقة لتحسين أدائك في الأسئلة الكتابية وإكمال الفراغ.");
	if (byType.some((b) => b.key === "multi_select" && b.accuracy < 60)) recommendations.push("في أسئلة التحديد المتعدد، تحقق من جميع الخيارات واحداً تلو الآخر ولا تكتفِ بأول إجابة صحيحة.");
	if (byType.some((b) => (b.key === "mcq" || b.key === "true_false") && b.accuracy < 60)) recommendations.push("اقرأ صيغة السؤال حتى النهاية وانتبه لكلمات النفي أو الاستثناء قبل اختيار الإجابة.");
	if (pendingCount > 0) recommendations.push(`لديك ${pendingCount} سؤال/أسئلة مقالية بانتظار تصحيح المعلم وإضافة تغذيته الراجعة.`);
	if (strengths.length === 0 && percentage >= 50) strengths.push("بداية جيدة في هذا الاختبار مع استيعاب عدد من المفاهيم الأساسية.");
	if (weaknesses.length === 0 && percentage >= 85) recommendations.push("مستواك ممتاز! جرّب مساعدة زملائك أو الانتقال للدرس والتحدي التالي.");
	else if (recommendations.length === 0) recommendations.push("أعد قراءة التفسيرات العلمية للأسئلة الخاطئة ثم راجع الدرس المرتبط بها.");
	return {
		totalScore,
		maxScore,
		percentage,
		gradeLabel,
		correctCount,
		incorrectCount,
		pendingCount,
		unansweredCount,
		byType,
		byTopic,
		strengths,
		weaknesses,
		recommendations,
		items
	};
}
async function createAssignment(uid, a) {
	try {
		await addDoc(collection(db, "assignments"), {
			class_id: a.class_id,
			teacher_id: uid,
			title: a.title.slice(0, 200),
			instructions: (a.instructions || "").slice(0, 1e4),
			due_at: a.due_at || "",
			total_points: Math.max(1, Math.round(Number(a.total_points) || 20)),
			created_at: serverTimestamp()
		});
	} catch (err) {
		handleFirestoreError(err, OperationType.CREATE, "assignments");
	}
}
async function submitAssignment(uid, s) {
	const subRef = doc(db, "submissions", `${s.assignment_id}_${uid}`);
	try {
		const [existingSnap, assignSnap] = await Promise.all([getDoc(subRef), getDoc(doc(db, "assignments", s.assignment_id))]);
		const assignData = assignSnap.exists() ? assignSnap.data() : {};
		if (existingSnap.exists()) {
			const updatePayload = {
				answer_text: (s.answer_text || "").slice(0, 15e3),
				submitted_at: serverTimestamp()
			};
			if (s.attachment_url) updatePayload.attachment_url = s.attachment_url.slice(0, 2e3);
			await updateDoc(subRef, updatePayload);
		} else {
			const createPayload = {
				assignment_id: s.assignment_id,
				class_id: String(assignData.class_id || ""),
				teacher_id: String(assignData.teacher_id || ""),
				student_id: uid,
				answer_text: (s.answer_text || "").slice(0, 15e3),
				submitted_at: serverTimestamp()
			};
			if (s.attachment_url) createPayload.attachment_url = s.attachment_url.slice(0, 2e3);
			await setDoc(subRef, createPayload);
		}
	} catch (err) {
		handleFirestoreError(err, OperationType.WRITE, `submissions/${s.assignment_id}_${uid}`);
	}
}
async function gradeSubmission(id, grade, feedback) {
	try {
		const subRef = doc(db, "submissions", id);
		const snap = await getDoc(subRef);
		await updateDoc(subRef, {
			grade,
			teacher_feedback: (feedback || "").slice(0, 4e3)
		});
		if (snap.exists()) {
			const data = snap.data();
			if (data.student_id) await addDoc(collection(db, "notifications"), {
				user_id: data.student_id,
				kind: "grade",
				payload: {
					title: "تم تصحيح واجبك",
					body: `الدرجة: ${grade}${feedback ? ` — ${feedback.slice(0, 120)}` : ""}`
				},
				created_at: serverTimestamp()
			}).catch(() => {});
		}
	} catch (err) {
		handleFirestoreError(err, OperationType.UPDATE, `submissions/${id}`);
	}
}
async function createPost(uid, p) {
	const payload = {
		author_id: uid,
		body: (p.body || "").slice(0, 1e4),
		category: p.category || "all",
		visibility: p.visibility || "public",
		created_at: serverTimestamp(),
		updated_at: serverTimestamp()
	};
	if (p.media_url) payload.media_url = p.media_url.slice(0, 2e3);
	if (p.media_type) payload.media_type = p.media_type;
	try {
		await addDoc(collection(db, "posts"), payload);
	} catch (err) {
		handleFirestoreError(err, OperationType.CREATE, "posts");
	}
}
async function setLike(uid, postId, liked) {
	const likeRef = doc(db, "post_likes", `${postId}_${uid}`);
	try {
		if (liked) await setDoc(likeRef, {
			post_id: postId,
			user_id: uid,
			created_at: serverTimestamp()
		});
		else await deleteDoc(likeRef);
	} catch (err) {
		handleFirestoreError(err, liked ? OperationType.CREATE : OperationType.DELETE, `post_likes/${postId}_${uid}`);
	}
}
async function addComment(uid, postId, body) {
	try {
		await addDoc(collection(db, "comments"), {
			post_id: postId,
			author_id: uid,
			body: body.slice(0, 3e3),
			created_at: serverTimestamp()
		});
	} catch (err) {
		handleFirestoreError(err, OperationType.CREATE, "comments");
	}
}
async function createStory(uid, s) {
	const expiresAt = new Date(Date.now() + 864e5).toISOString();
	try {
		await addDoc(collection(db, "stories"), {
			user_id: uid,
			body: s.body.slice(0, 500),
			bg_gradient: (s.bgGradient || "from-sky-500 to-indigo-600").slice(0, 120),
			created_at: serverTimestamp(),
			expires_at: expiresAt
		});
	} catch (err) {
		handleFirestoreError(err, OperationType.CREATE, "stories");
	}
}
async function createLive(uid, l) {
	const payload = {
		host_id: uid,
		title: l.title.slice(0, 200),
		description: (l.description || "").slice(0, 2e3),
		starts_at: l.starts_at || (/* @__PURE__ */ new Date()).toISOString(),
		status: "scheduled",
		created_at: serverTimestamp()
	};
	if (l.class_id) payload.class_id = l.class_id;
	if (l.meeting_url) payload.meeting_url = l.meeting_url.slice(0, 2e3);
	try {
		await addDoc(collection(db, "live_sessions"), payload);
	} catch (err) {
		handleFirestoreError(err, OperationType.CREATE, "live_sessions");
	}
}
async function setLiveStatus(id, status) {
	try {
		await updateDoc(doc(db, "live_sessions", id), { status });
	} catch (err) {
		handleFirestoreError(err, OperationType.UPDATE, `live_sessions/${id}`);
	}
}
async function sendMessage(uid, m) {
	const att = {};
	if (m.attachment?.url) att.attachment_url = m.attachment.url.slice(0, 2e3);
	if (m.attachment?.name) att.attachment_name = m.attachment.name.slice(0, 255);
	if (m.channel_id) try {
		await addDoc(collection(db, "class_messages"), {
			class_id: m.channel_id,
			sender_id: uid,
			body: (m.body || "").slice(0, 5e3),
			...att,
			created_at: serverTimestamp()
		});
	} catch (err) {
		handleFirestoreError(err, OperationType.CREATE, "class_messages");
	}
	else try {
		await addDoc(collection(db, "direct_messages"), {
			sender_id: uid,
			recipient_id: m.recipient_id,
			participants: [uid, m.recipient_id],
			body: (m.body || "").slice(0, 5e3),
			...att,
			created_at: serverTimestamp()
		});
	} catch (err) {
		handleFirestoreError(err, OperationType.CREATE, "direct_messages");
	}
}
async function markNotificationRead(id) {
	try {
		await updateDoc(doc(db, "notifications", id), { read_at: (/* @__PURE__ */ new Date()).toISOString() });
	} catch {}
}
async function markAllNotificationsRead(uid) {
	try {
		const snap = await getDocs(query(collection(db, "notifications"), where("user_id", "==", uid)));
		const batch = writeBatch(db);
		const now = (/* @__PURE__ */ new Date()).toISOString();
		let dirty = false;
		snap.docs.forEach((d) => {
			if (!d.data().read_at) {
				batch.update(d.ref, { read_at: now });
				dirty = true;
			}
		});
		if (dirty) await batch.commit();
	} catch {}
}
async function createReport(uid, r) {
	try {
		await addDoc(collection(db, "content_reports"), {
			reporter_id: uid,
			target_type: r.target_type,
			target_id: r.target_id,
			reason: r.reason.slice(0, 200),
			details: (r.details || "").slice(0, 2e3),
			snapshot: (r.snapshot || "").slice(0, 500),
			status: "open",
			created_at: serverTimestamp()
		});
	} catch (err) {
		handleFirestoreError(err, OperationType.CREATE, "content_reports");
	}
}
async function setReportStatus(id, status) {
	try {
		await updateDoc(doc(db, "content_reports", id), { status });
	} catch (err) {
		handleFirestoreError(err, OperationType.UPDATE, `content_reports/${id}`);
	}
}
async function deletePost(id) {
	try {
		await deleteDoc(doc(db, "posts", id));
	} catch (err) {
		handleFirestoreError(err, OperationType.DELETE, `posts/${id}`);
	}
}
async function updatePost(id, patch) {
	const clean = { updated_at: serverTimestamp() };
	if (patch.body !== void 0) clean.body = patch.body.slice(0, 1e4);
	if (patch.category !== void 0) clean.category = patch.category;
	if (patch.visibility !== void 0) clean.visibility = patch.visibility;
	try {
		await updateDoc(doc(db, "posts", id), clean);
	} catch (err) {
		handleFirestoreError(err, OperationType.UPDATE, `posts/${id}`);
	}
}
async function deleteComment(id) {
	try {
		await deleteDoc(doc(db, "comments", id));
	} catch (err) {
		handleFirestoreError(err, OperationType.DELETE, `comments/${id}`);
	}
}
async function deleteStory(id) {
	try {
		await deleteDoc(doc(db, "stories", id));
	} catch (err) {
		handleFirestoreError(err, OperationType.DELETE, `stories/${id}`);
	}
}
async function followUser(meId, targetId, targetVisibility = "public") {
	if (targetVisibility === "private") {
		const reqRef = doc(db, "follow_requests", `${meId}_${targetId}`);
		try {
			await setDoc(reqRef, {
				requester_id: meId,
				target_id: targetId,
				status: "pending",
				created_at: serverTimestamp()
			});
		} catch (err) {
			handleFirestoreError(err, OperationType.CREATE, `follow_requests/${meId}_${targetId}`);
		}
	} else {
		const folRef = doc(db, "follows", `${meId}_${targetId}`);
		try {
			await setDoc(folRef, {
				follower_id: meId,
				followed_id: targetId,
				created_at: serverTimestamp()
			});
		} catch (err) {
			handleFirestoreError(err, OperationType.CREATE, `follows/${meId}_${targetId}`);
		}
	}
}
async function unfollowUser(meId, targetId) {
	try {
		await deleteDoc(doc(db, "follows", `${meId}_${targetId}`));
	} catch (err) {
		handleFirestoreError(err, OperationType.DELETE, `follows/${meId}_${targetId}`);
	}
}
async function cancelFollowRequest(meId, targetId) {
	try {
		await deleteDoc(doc(db, "follow_requests", `${meId}_${targetId}`));
	} catch (err) {
		handleFirestoreError(err, OperationType.DELETE, `follow_requests/${meId}_${targetId}`);
	}
}
async function respondFollowRequest(requestId, accept) {
	const reqRef = doc(db, "follow_requests", requestId);
	try {
		const snap = await getDoc(reqRef);
		if (!snap.exists()) return;
		const req = snap.data();
		await updateDoc(reqRef, { status: accept ? "accepted" : "rejected" });
		if (accept && req.requester_id && req.target_id) await setDoc(doc(db, "follows", `${req.requester_id}_${req.target_id}`), {
			follower_id: req.requester_id,
			followed_id: req.target_id,
			created_at: serverTimestamp()
		});
	} catch (err) {
		handleFirestoreError(err, OperationType.UPDATE, `follow_requests/${requestId}`);
	}
}
async function adminStats() {
	try {
		const [profilesSnap, classesSnap, postsSnap, reportsSnap] = await Promise.all([
			getDocs(query(collection(db, "profiles"), where("visibility", "in", ["public", "private"]))),
			getDocs(query(collection(db, "classes"), where("class_type", "in", ["class", "study"]))),
			getDocs(query(collection(db, "posts"), where("visibility", "in", ["public", "followers"]))),
			getDocs(query(collection(db, "content_reports"), where("status", "in", ["open", "reviewing"])))
		]);
		const profiles = profilesSnap.docs.map((d) => d.data());
		return {
			users: profiles.length,
			students: profiles.filter((p) => p.role === "student").length,
			teachers: profiles.filter((p) => p.role === "teacher").length,
			classes: classesSnap.size,
			posts: postsSnap.size,
			open_reports: reportsSnap.size
		};
	} catch {
		return null;
	}
}
async function deleteRow(table, id) {
	try {
		if (table === "classes") {
			const code = (await getDoc(doc(db, "classes", id))).data()?.join_code;
			if (code) await deleteDoc(doc(db, "class_codes", String(code))).catch(() => {});
		}
		if (table === "quizzes") await deleteDoc(doc(db, "quiz_answer_keys", id)).catch(() => {});
		await deleteDoc(doc(db, table, id));
	} catch (err) {
		handleFirestoreError(err, OperationType.DELETE, `${table}/${id}`);
	}
}
async function leaveClass(uid, classId) {
	try {
		await deleteDoc(doc(db, "class_members", `${classId}_${uid}`));
	} catch (err) {
		handleFirestoreError(err, OperationType.DELETE, `class_members/${classId}_${uid}`);
	}
}
async function removeMember(classId, userId) {
	try {
		await deleteDoc(doc(db, "class_members", `${classId}_${userId}`));
	} catch (err) {
		handleFirestoreError(err, OperationType.DELETE, `class_members/${classId}_${userId}`);
	}
}
async function archiveClass(id, archived) {
	try {
		const snap = await getDoc(doc(db, "classes", id));
		await updateDoc(doc(db, "classes", id), { is_archived: archived });
		const code = snap.data()?.join_code;
		if (code) await updateDoc(doc(db, "class_codes", String(code)), { is_archived: archived }).catch(() => {});
	} catch (err) {
		handleFirestoreError(err, OperationType.UPDATE, `classes/${id}`);
	}
}
async function markDmRead(ids) {
	if (!ids.length) return;
	const now = (/* @__PURE__ */ new Date()).toISOString();
	await Promise.all(ids.map((id) => updateDoc(doc(db, "direct_messages", id), { read_at: now }).catch(() => {})));
}
async function listUsers(q = "") {
	try {
		const snap = await getDocs(query(collection(db, "profiles"), where("visibility", "in", ["public", "private"]), limit(100)));
		const needle = q.trim().toLowerCase();
		return snap.docs.map((d) => mapDoc(d)).filter((r) => !needle || String(r.display_name || "").toLowerCase().includes(needle)).sort((a, b) => toIso(b.created_at).localeCompare(toIso(a.created_at))).map((r) => ({
			id: r.id,
			display_name: r.display_name || "مستخدم",
			role: r.role || "student",
			is_suspended: !!r.is_suspended,
			created_at: toIso(r.created_at)
		}));
	} catch (err) {
		handleFirestoreError(err, OperationType.LIST, "profiles");
	}
}
async function setUserRole(id, role) {
	try {
		await updateDoc(doc(db, "profiles", id), {
			role,
			updated_at: serverTimestamp()
		});
		const adminRef = doc(db, "admins", id);
		if (role === "admin") await setDoc(adminRef, {
			uid: id,
			created_at: serverTimestamp()
		}, { merge: true });
		else await deleteDoc(adminRef).catch(() => {});
	} catch (err) {
		handleFirestoreError(err, OperationType.UPDATE, `profiles/${id}`);
	}
}
async function setSuspended(id, suspended) {
	try {
		await updateDoc(doc(db, "profiles", id), {
			is_suspended: suspended,
			updated_at: serverTimestamp()
		});
	} catch (err) {
		handleFirestoreError(err, OperationType.UPDATE, `profiles/${id}`);
	}
}
async function deleteOwnAccount() {
	const user = auth.currentUser;
	if (!user) throw new Error("يرجى تسجيل الدخول أولاً");
	const uid = user.uid;
	try {
		for (const [colName, field] of [
			["posts", "author_id"],
			["comments", "author_id"],
			["stories", "user_id"],
			["post_likes", "user_id"],
			["notifications", "user_id"],
			["class_members", "user_id"],
			["follows", "follower_id"],
			["follows", "followed_id"],
			["question_bank", "teacher_id"],
			["guardian_reports", "student_id"],
			["live_attendance", "user_id"],
			["certificates", "student_id"],
			["polls", "creator_id"],
			["class_resources", "uploader_id"]
		]) {
			const snap = await getDocs(query(collection(db, colName), where(field, "==", uid)));
			await Promise.all(snap.docs.map((d) => deleteDoc(d.ref).catch(() => {})));
		}
		await Promise.all([
			deleteDoc(doc(db, "profiles", uid)).catch(() => {}),
			deleteDoc(doc(db, "users_private", uid)).catch(() => {}),
			deleteDoc(doc(db, "admins", uid)).catch(() => {}),
			deleteDoc(doc(db, "chat_presence", uid)).catch(() => {})
		]);
		await user.delete();
	} catch (err) {
		if (String(err?.code || "") === "auth/requires-recent-login") throw new Error("لتأكيد الحذف النهائي، يرجى تسجيل الخروج والدخول مجدداً ثم الضغط على حذف الحساب.");
		throw new Error(err?.message || "تعذّر حذف الحساب");
	}
}
async function listCloudQuestionBank(teacherId) {
	if (!teacherId) return [];
	try {
		return (await getDocs(query(collection(db, "question_bank"), where("teacher_id", "==", teacherId), limit(250)))).docs.map((d) => {
			const r = mapDoc(d);
			return {
				id: r.id,
				teacher_id: String(r.teacher_id || teacherId),
				subject: String(r.subject || "عام"),
				q_type: r.q_type || "mcq",
				question: r.question,
				created_at: toIso(r.created_at)
			};
		}).sort((a, b) => b.created_at.localeCompare(a.created_at));
	} catch {
		return [];
	}
}
async function saveQuestionsToCloudBank(teacherId, subject, questions) {
	if (!teacherId || !questions.length) return [];
	const cleanSubject = (subject || "عام").trim().slice(0, 120) || "عام";
	const created = [];
	for (const q of questions) {
		const text = (q.question || "").trim().slice(0, 4e3);
		if (!text) continue;
		const qType = q.type || "mcq";
		const docRef = doc(collection(db, "question_bank"));
		const normalizedQ = {
			...q,
			id: q.id || docRef.id,
			type: qType,
			question: text,
			topic: (q.topic || cleanSubject).slice(0, 120),
			options: Array.isArray(q.options) ? q.options.map(String) : [],
			correctOptionIndex: Number(q.correctOptionIndex ?? 0),
			explanation: (q.explanation || "").slice(0, 1500),
			points: Math.max(1, Math.round(Number(q.points) || 1))
		};
		try {
			await setDoc(docRef, {
				teacher_id: teacherId,
				subject: (normalizedQ.topic || cleanSubject).slice(0, 120),
				q_type: qType,
				question: normalizedQ,
				created_at: serverTimestamp()
			});
			created.push({
				id: docRef.id,
				teacher_id: teacherId,
				subject: normalizedQ.topic || cleanSubject,
				q_type: qType,
				question: normalizedQ,
				created_at: (/* @__PURE__ */ new Date()).toISOString()
			});
		} catch {}
	}
	return created;
}
async function deleteCloudQuestionBankItem(itemId) {
	if (!itemId) return;
	try {
		await deleteDoc(doc(db, "question_bank", itemId));
	} catch {}
}
function makeGuardianCode() {
	const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
	let out = "GRD";
	for (let i = 0; i < 7; i++) out += chars[Math.floor(Math.random() * 32)];
	return out;
}
async function fetchMyGuardianReport(studentId) {
	if (!studentId) return null;
	try {
		const snap = await getDocs(query(collection(db, "guardian_reports"), where("student_id", "==", studentId), limit(1)));
		if (snap.empty) return null;
		const r = mapDoc(snap.docs[0]);
		return {
			report_code: String(r.report_code || r.id),
			student_id: String(r.student_id || studentId),
			student_name: String(r.student_name || "طالب"),
			avg_quiz_score: Number(r.avg_quiz_score ?? 0),
			completed_quizzes: Number(r.completed_quizzes ?? 0),
			submitted_assignments: Number(r.submitted_assignments ?? 0),
			points: Number(r.points ?? 0),
			streak_days: Number(r.streak_days ?? 0),
			classes_count: Number(r.classes_count ?? 0),
			recent_grades: Array.isArray(r.recent_grades) ? r.recent_grades : [],
			updated_at: toIso(r.updated_at)
		};
	} catch {
		return null;
	}
}
async function publishGuardianReport(me, summaryInput) {
	const completedQuizzes = summaryInput.quizzes.filter((q) => q.attempted);
	const mySubmissions = summaryInput.submissions.filter((s) => s.student_id === me.id);
	const recentGrades = [];
	let pctSum = 0;
	let pctCount = 0;
	completedQuizzes.forEach((q) => {
		const maxScore = Math.max(1, q.questions.reduce((s, qq) => s + (qq.points || 1), 0));
		const score = Number(q.myScore ?? 0);
		pctSum += Math.min(100, Math.round(score / maxScore * 100));
		pctCount += 1;
		recentGrades.push({
			title: String(q.title || "اختبار").slice(0, 80),
			kind: "اختبار",
			score,
			max_score: maxScore,
			status: q.needsManualGrading ? "بانتظار مراجعة المعلم" : "مكتمل"
		});
	});
	summaryInput.assignments.forEach((a) => {
		const sub = mySubmissions.find((s) => s.assignment_id === a.id);
		if (!sub) return;
		const maxScore = Math.max(1, Number(a.total_points) || 20);
		const hasGrade = sub.grade !== void 0 && sub.grade !== null;
		if (hasGrade) {
			pctSum += Math.min(100, Math.round(Number(sub.grade) / maxScore * 100));
			pctCount += 1;
		}
		recentGrades.push({
			title: String(a.title || "واجب").slice(0, 80),
			kind: "واجب",
			score: hasGrade ? Number(sub.grade) : 0,
			max_score: maxScore,
			status: hasGrade ? "مرصود الدرجة" : "تم التسليم"
		});
	});
	const avgScore = pctCount > 0 ? Math.round(pctSum / pctCount) : 0;
	const trimmedGrades = recentGrades.slice(0, 15);
	const oldCode = summaryInput.existingCode?.trim().toUpperCase();
	const code = !summaryInput.rotateCode && oldCode && oldCode.length >= 8 ? oldCode : makeGuardianCode();
	if (summaryInput.rotateCode && oldCode && oldCode !== code) await deleteDoc(doc(db, "guardian_reports", oldCode)).catch(() => {});
	const payload = {
		report_code: code,
		student_id: me.id,
		student_name: me.display_name.slice(0, 80),
		avg_quiz_score: Math.max(0, Math.min(100, avgScore)),
		completed_quizzes: completedQuizzes.length,
		submitted_assignments: mySubmissions.length,
		points: Math.max(0, Math.round(Number(me.points) || 0)),
		streak_days: Math.max(0, Math.round(Number(me.streakDays) || 0)),
		classes_count: Math.max(0, Math.round(Number(summaryInput.classesCount) || 0)),
		recent_grades: trimmedGrades,
		updated_at: serverTimestamp()
	};
	await setDoc(doc(db, "guardian_reports", code), payload);
	return {
		...payload,
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	};
}
async function revokeGuardianReport(reportCode) {
	const clean = reportCode.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, "");
	if (!clean) return;
	await deleteDoc(doc(db, "guardian_reports", clean));
}
async function fetchGuardianReportByCode(code) {
	const clean = (code || "").trim().toUpperCase().replace(/[^A-Z0-9_-]/g, "");
	if (clean.length < 8 || clean.length > 16) return null;
	try {
		const snap = await getDoc(doc(db, "guardian_reports", clean));
		if (!snap.exists()) return null;
		const r = snap.data();
		return {
			report_code: String(r.report_code || clean),
			student_id: String(r.student_id || ""),
			student_name: String(r.student_name || "طالب NEMVIA"),
			avg_quiz_score: Number(r.avg_quiz_score ?? 0),
			completed_quizzes: Number(r.completed_quizzes ?? 0),
			submitted_assignments: Number(r.submitted_assignments ?? 0),
			points: Number(r.points ?? 0),
			streak_days: Number(r.streak_days ?? 0),
			classes_count: Number(r.classes_count ?? 0),
			recent_grades: Array.isArray(r.recent_grades) ? r.recent_grades : [],
			updated_at: toIso(r.updated_at)
		};
	} catch {
		return null;
	}
}
async function listLiveAttendance(sessionId) {
	if (!sessionId) return [];
	try {
		return (await getDocs(query(collection(db, "live_attendance"), where("session_id", "==", sessionId)))).docs.map((d) => {
			const r = d.data();
			return {
				session_id: String(r.session_id || sessionId),
				user_id: String(r.user_id || ""),
				user_name: String(r.user_name || "طالب"),
				status: [
					"present",
					"late",
					"absent"
				].includes(r.status) ? r.status : "present",
				checked_at: r.checked_at ? String(r.checked_at) : void 0
			};
		});
	} catch {
		return [];
	}
}
async function upsertLiveAttendance(record) {
	if (!record.session_id || !record.user_id) return;
	const docId = `${record.session_id}_${record.user_id}`.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 128);
	const payload = {
		session_id: record.session_id.slice(0, 128),
		user_id: record.user_id.slice(0, 128),
		user_name: (record.user_name || "مستخدم").slice(0, 80),
		status: record.status,
		updated_at: serverTimestamp()
	};
	if (record.checked_at) payload.checked_at = record.checked_at.slice(0, 64);
	try {
		await setDoc(doc(db, "live_attendance", docId), payload);
	} catch {}
}
function mapCallDoc(id, r) {
	return {
		id,
		caller_id: String(r.caller_id || ""),
		caller_name: String(r.caller_name || "مستخدم"),
		callee_id: String(r.callee_id || ""),
		callee_name: String(r.callee_name || "مستخدم"),
		participants: Array.isArray(r.participants) ? r.participants.map(String) : [],
		call_type: r.call_type === "video" ? "video" : "audio",
		status: [
			"ringing",
			"accepted",
			"rejected",
			"ended",
			"missed"
		].includes(r.status) ? r.status : "ended",
		offer: r.offer && typeof r.offer === "object" ? r.offer : {
			type: "offer",
			sdp: ""
		},
		answer: r.answer && typeof r.answer === "object" ? r.answer : void 0,
		created_at: toIso(r.created_at),
		updated_at: toIso(r.updated_at)
	};
}
async function createCallOffer(params) {
	const callRef = doc(collection(db, "calls"));
	try {
		await setDoc(callRef, {
			caller_id: params.callerId,
			caller_name: (params.callerName || "مستخدم").slice(0, 80),
			callee_id: params.calleeId,
			callee_name: (params.calleeName || "مستخدم").slice(0, 80),
			participants: [params.callerId, params.calleeId],
			call_type: params.callType,
			status: "ringing",
			offer: {
				type: String(params.offer.type || "offer"),
				sdp: String(params.offer.sdp || "")
			},
			created_at: serverTimestamp(),
			updated_at: serverTimestamp()
		});
		return callRef.id;
	} catch (err) {
		handleFirestoreError(err, OperationType.CREATE, "calls");
	}
}
async function acceptCallWithAnswer(callId, answer) {
	try {
		await updateDoc(doc(db, "calls", callId), {
			status: "accepted",
			answer: {
				type: String(answer.type || "answer"),
				sdp: String(answer.sdp || "")
			},
			updated_at: serverTimestamp()
		});
	} catch (err) {
		handleFirestoreError(err, OperationType.UPDATE, `calls/${callId}`);
	}
}
async function updateCallStatus(callId, status) {
	try {
		await updateDoc(doc(db, "calls", callId), {
			status,
			updated_at: serverTimestamp()
		});
	} catch {}
}
async function addCallIceCandidate(callId, senderId, candidate) {
	try {
		await addDoc(collection(db, "calls", callId, "candidates"), {
			sender_id: senderId,
			candidate,
			created_at: serverTimestamp()
		});
	} catch {}
}
function subscribeIncomingCalls(uid, onIncoming) {
	if (!uid) return () => {};
	return onSnapshot(query(collection(db, "calls"), where("participants", "array-contains", uid), limit(20)), (snap) => {
		const nowMs = Date.now();
		const activeRinging = snap.docs.map((d) => mapCallDoc(d.id, d.data())).filter((c) => c.callee_id === uid && c.status === "ringing").filter((c) => nowMs - new Date(c.created_at).getTime() < 9e4).sort((a, b) => b.created_at.localeCompare(a.created_at))[0];
		onIncoming(activeRinging || null);
	}, (err) => {
		if (String(err?.message || "").toLowerCase().includes("permission")) handleFirestoreError(err, OperationType.LIST, "calls");
	});
}
function subscribeCallSession(callId, onUpdate) {
	if (!callId) return () => {};
	return onSnapshot(doc(db, "calls", callId), (snap) => {
		if (!snap.exists()) {
			onUpdate(null);
			return;
		}
		onUpdate(mapCallDoc(snap.id, snap.data()));
	}, (err) => {
		if (String(err?.message || "").toLowerCase().includes("permission")) handleFirestoreError(err, OperationType.GET, `calls/${callId}`);
	});
}
function subscribeCallCandidates(callId, myUid, onRemoteCandidate) {
	if (!callId) return () => {};
	const seen = /* @__PURE__ */ new Set();
	return onSnapshot(collection(db, "calls", callId, "candidates"), (snap) => {
		snap.docChanges().forEach((change) => {
			if (change.type !== "added") return;
			if (seen.has(change.doc.id)) return;
			seen.add(change.doc.id);
			const r = change.doc.data();
			if (r.sender_id !== myUid && r.candidate) onRemoteCandidate(r.candidate);
		});
	}, (err) => {
		if (String(err?.message || "").toLowerCase().includes("permission")) handleFirestoreError(err, OperationType.LIST, `calls/${callId}/candidates`);
	});
}
function makeCertificateCode() {
	const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
	let out = "CERT";
	for (let i = 0; i < 8; i++) out += chars[Math.floor(Math.random() * 32)];
	return out;
}
async function issueVerifiedCertificate(params) {
	const oldCode = (params.existingCode || "").trim().toUpperCase().replace(/[^A-Z0-9_-]/g, "");
	const code = oldCode.length >= 8 && oldCode.length <= 16 ? oldCode : makeCertificateCode();
	const nowIso = (/* @__PURE__ */ new Date()).toISOString();
	const payload = {
		cert_code: code,
		student_id: params.student.id,
		student_name: params.student.display_name.slice(0, 80),
		title: (params.title || "شهادة التفوق والمثابرة الأكاديمية — منصة NEMVIA").trim().slice(0, 140),
		issuer_name: (params.issuerName || "محمد جمال نعمه — إدارة منصة NEMVIA").trim().slice(0, 80),
		points: Math.max(0, Math.round(Number(params.student.points) || 0)),
		streak_days: Math.max(0, Math.round(Number(params.student.streakDays) || 0)),
		issued_at: nowIso,
		updated_at: serverTimestamp()
	};
	try {
		await setDoc(doc(db, "certificates", code), payload);
		return {
			...payload,
			updated_at: nowIso
		};
	} catch (err) {
		handleFirestoreError(err, OperationType.WRITE, `certificates/${code}`);
	}
}
async function fetchVerifiedCertificate(code) {
	const clean = (code || "").trim().toUpperCase().replace(/[^A-Z0-9_-]/g, "");
	if (clean.length < 8 || clean.length > 16) return null;
	try {
		const snap = await getDoc(doc(db, "certificates", clean));
		if (!snap.exists()) return null;
		const r = snap.data();
		return {
			cert_code: String(r.cert_code || clean),
			student_id: String(r.student_id || ""),
			student_name: String(r.student_name || "طالب NEMVIA"),
			title: String(r.title || "شهادة إنجاز أكاديمية"),
			issuer_name: String(r.issuer_name || "منصة NEMVIA التعليمية"),
			points: Number(r.points ?? 0),
			streak_days: Number(r.streak_days ?? 0),
			issued_at: String(r.issued_at || toIso(r.updated_at)),
			updated_at: toIso(r.updated_at)
		};
	} catch {
		return null;
	}
}
async function updateChatPresence(uid, state) {
	if (!uid) return;
	try {
		await setDoc(doc(db, "chat_presence", uid), {
			user_id: uid,
			is_online: Boolean(state.is_online),
			typing_to: (state.typing_to || "").slice(0, 128),
			updated_at: serverTimestamp()
		});
	} catch {}
}
function subscribeChatPresence(onUpdate) {
	return onSnapshot(query(collection(db, "chat_presence"), where("is_online", "in", [true, false]), limit(250)), (snap) => {
		const next = {};
		snap.docs.forEach((d) => {
			const r = d.data();
			const uid = String(r.user_id || d.id);
			next[uid] = {
				user_id: uid,
				is_online: Boolean(r.is_online),
				typing_to: String(r.typing_to || ""),
				updated_at: toIso(r.updated_at)
			};
		});
		onUpdate(next);
	}, (err) => {
		if (String(err?.message || "").toLowerCase().includes("permission")) handleFirestoreError(err, OperationType.LIST, "chat_presence");
	});
}
async function createPoll(params) {
	const cleanOptions = params.options.map((o) => o.trim()).filter(Boolean).slice(0, 6);
	if (cleanOptions.length < 2) throw new Error("أدخل خيارين على الأقل للتصويت.");
	const pollRef = doc(collection(db, "polls"));
	try {
		await setDoc(pollRef, {
			scope_type: params.scopeType,
			scope_id: params.scopeId.slice(0, 128),
			creator_id: params.creatorId,
			creator_name: (params.creatorName || "مستخدم").slice(0, 80),
			question: params.question.trim().slice(0, 300),
			options: cleanOptions,
			created_at: serverTimestamp()
		});
		return pollRef.id;
	} catch (err) {
		handleFirestoreError(err, OperationType.CREATE, "polls");
	}
}
async function castPollVote(pollId, userId, optionIndex) {
	if (!pollId || !userId) return;
	try {
		await setDoc(doc(db, "polls", pollId, "votes", userId), {
			user_id: userId,
			option_index: Math.max(0, Math.min(5, Math.round(optionIndex))),
			updated_at: serverTimestamp()
		});
	} catch (err) {
		handleFirestoreError(err, OperationType.WRITE, `polls/${pollId}/votes/${userId}`);
	}
}
async function deletePoll(pollId) {
	if (!pollId) return;
	try {
		const votesSnap = await getDocs(collection(db, "polls", pollId, "votes"));
		await Promise.all(votesSnap.docs.map((d) => deleteDoc(d.ref).catch(() => {})));
		await deleteDoc(doc(db, "polls", pollId));
	} catch (err) {
		handleFirestoreError(err, OperationType.DELETE, `polls/${pollId}`);
	}
}
function subscribePolls(scopeType, scopeId, onUpdate) {
	if (!scopeId) {
		onUpdate([]);
		return () => {};
	}
	let pollsList = [];
	const votesByPoll = /* @__PURE__ */ new Map();
	const voteUnsubs = /* @__PURE__ */ new Map();
	const emit = () => {
		onUpdate(pollsList.map((p) => ({
			...p,
			votes: votesByPoll.get(p.id) || []
		})).sort((a, b) => b.created_at.localeCompare(a.created_at)));
	};
	const unsubPolls = onSnapshot(query(collection(db, "polls"), where("scope_type", "==", scopeType), where("scope_id", "==", scopeId), limit(30)), (snap) => {
		const nextIds = /* @__PURE__ */ new Set();
		pollsList = snap.docs.map((d) => {
			const r = d.data();
			nextIds.add(d.id);
			return {
				id: d.id,
				scope_type: r.scope_type === "class" ? "class" : "community",
				scope_id: String(r.scope_id || scopeId),
				creator_id: String(r.creator_id || ""),
				creator_name: String(r.creator_name || "عضو"),
				question: String(r.question || ""),
				options: Array.isArray(r.options) ? r.options.map(String) : [],
				created_at: toIso(r.created_at)
			};
		});
		for (const [pid, unsub] of voteUnsubs.entries()) if (!nextIds.has(pid)) {
			unsub();
			voteUnsubs.delete(pid);
			votesByPoll.delete(pid);
		}
		pollsList.forEach((p) => {
			if (voteUnsubs.has(p.id)) return;
			const vUnsub = onSnapshot(query(collection(db, "polls", p.id, "votes"), where("user_id", "!=", ""), limit(250)), (vSnap) => {
				votesByPoll.set(p.id, vSnap.docs.map((vd) => {
					const vr = vd.data();
					return {
						user_id: String(vr.user_id || vd.id),
						option_index: Number(vr.option_index ?? 0),
						updated_at: toIso(vr.updated_at)
					};
				}));
				emit();
			}, () => {});
			voteUnsubs.set(p.id, vUnsub);
		});
		emit();
	}, (err) => {
		if (String(err?.message || "").toLowerCase().includes("permission")) handleFirestoreError(err, OperationType.LIST, "polls");
	});
	return () => {
		unsubPolls();
		voteUnsubs.forEach((u) => u());
		voteUnsubs.clear();
	};
}
function mapClassResourceDoc(id, r) {
	const kindRaw = String(r.kind || "summary");
	const kind = [
		"book",
		"summary",
		"worksheet",
		"link",
		"video"
	].includes(kindRaw) ? kindRaw : "summary";
	return {
		id,
		class_id: String(r.class_id || ""),
		uploader_id: String(r.uploader_id || ""),
		uploader_name: String(r.uploader_name || "معلم"),
		title: String(r.title || ""),
		unit_name: String(r.unit_name || "موارد عامة"),
		kind,
		description: r.description ? String(r.description) : void 0,
		file_url: r.file_url ? String(r.file_url) : void 0,
		file_name: r.file_name ? String(r.file_name) : void 0,
		file_size: r.file_size ? String(r.file_size) : void 0,
		external_url: r.external_url ? String(r.external_url) : void 0,
		created_at: toIso(r.created_at)
	};
}
function subscribeClassResources(classId, onUpdate) {
	if (!classId) {
		onUpdate([]);
		return () => {};
	}
	return onSnapshot(query(collection(db, "class_resources"), where("class_id", "==", classId), limit(250)), (snap) => {
		onUpdate(snap.docs.map((d) => mapClassResourceDoc(d.id, d.data())).sort((a, b) => b.created_at.localeCompare(a.created_at)));
	}, (err) => {
		if (String(err?.message || "").toLowerCase().includes("permission")) handleFirestoreError(err, OperationType.LIST, "class_resources");
	});
}
async function createClassResource(params) {
	const title = params.title.trim().slice(0, 200);
	const unitName = (params.unitName.trim() || "موارد عامة").slice(0, 100);
	if (!title) throw new Error("يرجى إدخال عنوان الملف أو الملزمة.");
	if (!params.classId) throw new Error("معرّف الصف غير صالح.");
	const payload = {
		class_id: params.classId.slice(0, 128),
		uploader_id: params.uploaderId.slice(0, 128),
		uploader_name: (params.uploaderName.trim() || "عضو الصف").slice(0, 80),
		title,
		unit_name: unitName,
		kind: params.kind,
		created_at: serverTimestamp()
	};
	if (params.description?.trim()) payload.description = params.description.trim().slice(0, 2e3);
	if (params.fileUrl?.trim()) payload.file_url = params.fileUrl.trim().slice(0, 2e3);
	if (params.fileName?.trim()) payload.file_name = params.fileName.trim().slice(0, 255);
	if (params.fileSize?.trim()) payload.file_size = params.fileSize.trim().slice(0, 40);
	if (params.externalUrl?.trim()) payload.external_url = params.externalUrl.trim().slice(0, 2e3);
	const resRef = doc(collection(db, "class_resources"));
	try {
		await setDoc(resRef, payload);
		return resRef.id;
	} catch (err) {
		handleFirestoreError(err, OperationType.CREATE, "class_resources");
	}
}
async function updateClassResource(resourceId, updates) {
	if (!resourceId) return;
	const payload = {
		title: updates.title.trim().slice(0, 200),
		unit_name: (updates.unitName.trim() || "موارد عامة").slice(0, 100),
		kind: updates.kind,
		description: (updates.description || "").trim().slice(0, 2e3),
		external_url: (updates.externalUrl || "").trim().slice(0, 2e3)
	};
	try {
		await updateDoc(doc(db, "class_resources", resourceId), payload);
	} catch (err) {
		handleFirestoreError(err, OperationType.UPDATE, `class_resources/${resourceId}`);
	}
}
async function deleteClassResource(resourceId) {
	if (!resourceId) return;
	try {
		await deleteDoc(doc(db, "class_resources", resourceId));
	} catch (err) {
		handleFirestoreError(err, OperationType.DELETE, `class_resources/${resourceId}`);
	}
}
// src/components/views/GuardianPortalModal.tsx
var GuardianPortalModal = ({ initialCode = "", onClose }) => {
	const [code, setCode] = (0, import_react.useState)(initialCode.toUpperCase());
	const [loading, setLoading] = (0, import_react.useState)(Boolean(initialCode));
	const [error, setError] = (0, import_react.useState)(null);
	const [report, setReport] = (0, import_react.useState)(null);
	const lookup = async (targetCode) => {
		const clean = targetCode.trim().toUpperCase();
		if (clean.length < 8) {
			setError("أدخل رمز متابعة صحيحاً (8 أحرف على الأقل، مثال: GRD7X9K2M4).");
			return;
		}
		setLoading(true);
		setError(null);
		try {
			const res = await fetchGuardianReportByCode(clean);
			if (!res) {
				setReport(null);
				setError("لم يتم العثور على تقرير مطابق لهذا الرمز. تأكد من الرمز مع الطالب.");
			} else setReport(res);
		} catch {
			setError("تعذّر تحميل التقرير حالياً، حاول مرة أخرى.");
		} finally {
			setLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		if (initialCode.trim().length >= 8) lookup(initialCode);
	}, [initialCode]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-[75] bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 font-['Cairo',sans-serif]",
		dir: "rtl",
		onClick: onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200 animate-in zoom-in-95",
			onClick: (e) => e.stopPropagation(),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-5 bg-[#0f233a] text-white flex items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-9 h-9 rounded-xl bg-sky-500/20 text-sky-300 flex items-center justify-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "w-5 h-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-black text-base",
						children: "بوابة ولي الأمر للمتابعة الأكاديمية"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] text-slate-300",
						children: "عرض آمن للقراءة فقط لدرجات وتقدّم الطالب دون بيانات حساسة"
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onClose,
					className: "p-1.5 text-white/70 hover:text-white rounded-lg cursor-pointer",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-5 h-5" })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-5 sm:p-6 overflow-y-auto space-y-4 text-xs",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: (e) => {
							e.preventDefault();
							lookup(code);
						},
						className: "flex flex-col sm:flex-row gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							dir: "ltr",
							value: code,
							onChange: (e) => setCode(e.target.value.toUpperCase()),
							placeholder: "مثال: GRD8X9K2M4",
							maxLength: 16,
							className: "flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-black text-sm tracking-widest text-center uppercase outline-none focus:border-[#1677c7]"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "submit",
							disabled: loading,
							className: "px-5 py-2.5 bg-[#1677c7] hover:bg-[#125fa0] disabled:opacity-60 text-white font-bold rounded-xl cursor-pointer flex items-center justify-center gap-1.5 shrink-0",
							children: [loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "عرض التقرير" })]
						})]
					}),
					error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl font-bold",
						children: error
					}),
					report && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4 animate-in fade-in",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 rounded-2xl bg-sky-50/70 border border-sky-200 flex flex-wrap items-center justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] font-bold text-[#1677c7] block",
										children: "بطاقة متابعة الطالب"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
										className: "text-lg font-black text-slate-900",
										children: report.student_name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[11px] text-slate-500",
										children: ["آخر تحديث: ", new Date(report.updated_at).toLocaleString("ar")]
									})
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "px-4 py-2 rounded-2xl bg-white border border-sky-200 text-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] font-bold text-slate-500 block",
										children: "المعدل العام"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
										className: "text-xl font-black text-[#1677c7] tabular-nums",
										children: [report.avg_quiz_score, "%"]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 sm:grid-cols-4 gap-2.5 tabular-nums",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-4 h-4 text-emerald-600 mx-auto" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] font-bold text-slate-500 block",
												children: "الاختبارات المنجزة"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
												className: "text-base font-black text-slate-900 block",
												children: report.completed_quizzes
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "w-4 h-4 text-[#1677c7] mx-auto" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] font-bold text-slate-500 block",
												children: "الواجبات المسلّمة"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
												className: "text-base font-black text-slate-900 block",
												children: report.submitted_assignments
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "w-4 h-4 text-amber-500 mx-auto" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] font-bold text-slate-500 block",
												children: "نقاط التفاعل"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
												className: "text-base font-black text-slate-900 block",
												children: report.points
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "w-4 h-4 text-orange-500 mx-auto" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] font-bold text-slate-500 block",
												children: "سلسلة المواظبة"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
												className: "text-base font-black text-slate-900 block",
												children: [report.streak_days, " يوم"]
											})
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex items-center justify-between",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h5", {
										className: "font-black text-slate-800 flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "w-4 h-4 text-[#1677c7]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											"سجل أحدث الدرجات والأنشطة (",
											report.classes_count,
											" صف مسجّل)"
										] })]
									})
								}), report.recent_grades.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center text-slate-500",
									children: "لم تُسجّل اختبارات أو واجبات مقيّمة بعد."
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "border border-slate-200 rounded-2xl overflow-hidden",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
										className: "w-full text-[11px] text-start",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
											className: "bg-slate-50 border-b border-slate-200 text-slate-600 font-bold",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "py-2.5 px-3 text-start",
													children: "النشاط"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "py-2.5 px-3 text-start",
													children: "النوع"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "py-2.5 px-3 text-start",
													children: "الدرجة"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "py-2.5 px-3 text-start",
													children: "الحالة"
												})
											] })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
											className: "divide-y divide-slate-100",
											children: report.recent_grades.map((g, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "py-2 px-3 font-bold text-slate-900",
													children: g.title
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "py-2 px-3 text-slate-600",
													children: g.kind
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
													className: "py-2 px-3 font-black tabular-nums text-[#1677c7]",
													children: [
														g.score,
														" / ",
														g.max_score
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "py-2 px-3 text-slate-700",
													children: g.status
												})
											] }, i))
										})]
									})
								})]
							})
						]
					})
				]
			})]
		})
	});
};
// src/components/auth/AuthScreen.tsx
function arabicAuthError(err) {
	const code = String(err?.code || "").toLowerCase();
	const m = String(err?.message || "");
	const ml = m.toLowerCase();
	if (code.includes("popup-closed-by-user")) return "تم إغلاق نافذة تسجيل الدخول قبل إتمام العملية.";
	if (code.includes("cancelled-popup-request")) return "تم إلغاء الطلب السابق، اضغط مجدداً للمتابعة.";
	if (code.includes("popup-blocked")) return "المتصفح منع النافذة المنبثقة لتسجيل الدخول. يرجى السماح بالنوافذ المنبثقة لهذا الموقع أو فتح التطبيق في تبويب مستقل والمحاولة مجدداً.";
	if (code.includes("operation-not-allowed")) return "طريقة تسجيل الدخول هذه غير مفعّلة حالياً في إعدادات المصادقة (Firebase Auth). يمكنك المتابعة بحساب Google أو تفعيل Email/Password من لوحة Firebase.";
	if (code.includes("invalid-email")) return "صيغة البريد الإلكتروني غير صحيحة.";
	if (code.includes("user-not-found") || code.includes("wrong-password") || code.includes("invalid-credential")) return "البريد الإلكتروني أو كلمة المرور غير صحيحة.";
	if (code.includes("email-already-in-use")) return "هذا البريد الإلكتروني مسجل مسبقاً. اختر «تسجيل الدخول» أو تابع بحساب Google.";
	if (code.includes("weak-password")) return "كلمة المرور ضعيفة، يجب أن تتكون من 6 أحرف على الأقل.";
	if (code.includes("too-many-requests")) return "تم حظر المحاولات مؤقتاً لكثرة المحاولات الخاطئة. انتظر قليلاً ثم أعد المحاولة.";
	if (code.includes("user-disabled")) return "تم تعطيل هذا الحساب في نظام المصادقة.";
	if (code.includes("network-request-failed") || ml.includes("network")) return "تعذّر الاتصال بالخادم، تحقق من اتصالك بالإنترنت.";
	if (code.includes("unauthorized-domain")) return `النطاق الحالي (${typeof window !== "undefined" ? window.location.hostname : ""}) غير مضاف ضمن Authorized Domains في Firebase Auth.`;
	if (m.startsWith("{") && ml.includes("\"error\"")) try {
		return `تعذّر تهيئة الحساب: ${JSON.parse(m).error || "خطأ في الصلاحيات"}`;
	} catch {}
	return m || "حدث خطأ أثناء تسجيل الدخول";
}
var AuthScreen = () => {
	const [role, setRole] = (0, import_react.useState)("student");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [infoMsg, setInfoMsg] = (0, import_react.useState)(null);
	const [agreed, setAgreed] = (0, import_react.useState)(true);
	const [legalTab, setLegalTab] = (0, import_react.useState)(null);
	const [showEmailForm, setShowEmailForm] = (0, import_react.useState)(false);
	const [emailMode, setEmailMode] = (0, import_react.useState)("signin");
	const [fullName, setFullName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [mobileCallbackUrl, setMobileCallbackUrl] = (0, import_react.useState)(null);
	const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
	const guardianCodeParam = (searchParams?.get("guardian") || "").trim().toUpperCase();
	const [guardianOpen, setGuardianOpen] = (0, import_react.useState)(Boolean(guardianCodeParam));
	const isMobileAuthHandoff = !isNativeApp() && searchParams?.get("mobile_auth") === "1";
	const handoffRole = searchParams?.get("role") === "teacher" ? "teacher" : "student";
	(0, import_react.useEffect)(() => {
		if (isMobileAuthHandoff) setRole(handoffRole);
	}, [isMobileAuthHandoff, handoffRole]);
	(0, import_react.useEffect)(() => {
		const completeNativeOAuth = async (detail) => {
			if (!detail || !detail.idToken && !detail.accessToken) return;
			setBusy(true);
			setError(null);
			try {
				const chosenRole = (detail.role === "teacher" || detail.role === "student" ? detail.role : localStorage.getItem("nemvia-pending-role")) || role;
				const credential = GoogleAuthProvider.credential(detail.idToken || null, detail.accessToken || null);
				const cred = await signInWithCredential(auth, credential);
				if (cred?.user) {
					localStorage.removeItem("nemvia-pending-role");
					await ensureOwnProfile(cred.user, chosenRole);
				}
			} catch (err) {
				setError(arabicAuthError(err));
			} finally {
				setBusy(false);
			}
		};
		const win = window;
		if (win.__nemviaPendingNativeOAuth) {
			const pending = win.__nemviaPendingNativeOAuth;
			delete win.__nemviaPendingNativeOAuth;
			completeNativeOAuth(pending);
		}
		const onNativeOAuth = (ev) => {
			const detail = ev.detail;
			delete win.__nemviaPendingNativeOAuth;
			completeNativeOAuth(detail);
		};
		window.addEventListener("nemvia:native-oauth", onNativeOAuth);
		getRedirectResult(auth).then(async (res) => {
			if (res?.user && res.user.emailVerified) {
				const pending = localStorage.getItem("nemvia-pending-role");
				if (pending) localStorage.removeItem("nemvia-pending-role");
				await ensureOwnProfile(res.user, pending || void 0);
			}
		}).catch((err) => setError(arabicAuthError(err)));
		return () => {
			window.removeEventListener("nemvia:native-oauth", onNativeOAuth);
		};
	}, [role]);
	const completeHandoffGoogle = async () => {
		setError(null);
		setBusy(true);
		try {
			const cred = await signInWithPopup(auth, googleProvider);
			const oauthCred = GoogleAuthProvider.credentialFromResult(cred);
			const idToken = oauthCred?.idToken || "";
			const accessToken = oauthCred?.accessToken || "";
			if (!idToken && !accessToken) {
				setError("تعذّر استلام رمز المصادقة من Google. حاول مجدداً.");
				return;
			}
			const params = new URLSearchParams();
			if (idToken) params.set("id_token", idToken);
			if (accessToken) params.set("access_token", accessToken);
			params.set("role", handoffRole);
			const targetUrl = `${ANDROID_AUTH_REDIRECT_URL}#${params.toString()}`;
			setMobileCallbackUrl(targetUrl);
			window.location.href = targetUrl;
		} catch (err) {
			setError(arabicAuthError(err));
		} finally {
			setBusy(false);
		}
	};
	const signInGoogle = async () => {
		setError(null);
		setInfoMsg(null);
		if (!agreed) {
			setError("يجب الموافقة على شروط الاستخدام وسياسة الخصوصية للمتابعة.");
			return;
		}
		if (isNativeApp()) {
			setBusy(true);
			try {
				localStorage.setItem("nemvia-pending-role", role);
				const handoffUrl = `${getRemoteAppBaseUrl()}/?mobile_auth=1&role=${encodeURIComponent(role)}`;
				await Browser.open({
					url: handoffUrl,
					toolbarColor: "#0f233a"
				});
				setInfoMsg("أكمل تسجيل الدخول في المتصفح المفتوح وسيتم إعادتك تلقائياً للتطبيق.");
			} catch (err) {
				setError(arabicAuthError(err));
			} finally {
				setBusy(false);
			}
			return;
		}
		setBusy(true);
		try {
			localStorage.setItem("nemvia-pending-role", role);
			const cred = await signInWithPopup(auth, googleProvider);
			if (cred?.user) {
				localStorage.removeItem("nemvia-pending-role");
				await ensureOwnProfile(cred.user, role);
			}
		} catch (err) {
			setError(arabicAuthError(err));
		} finally {
			setBusy(false);
		}
	};
	const handleEmailSubmit = async (e) => {
		e.preventDefault();
		setError(null);
		setInfoMsg(null);
		if (emailMode !== "reset" && !agreed) {
			setError("يجب الموافقة على شروط الاستخدام وسياسة الخصوصية للمتابعة.");
			return;
		}
		const cleanEmail = email.trim();
		if (!cleanEmail) {
			setError("يرجى إدخال البريد الإلكتروني.");
			return;
		}
		setBusy(true);
		try {
			if (emailMode === "reset") {
				await sendPasswordResetEmail(auth, cleanEmail);
				setInfoMsg("تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.");
				return;
			}
			if (emailMode === "signup") {
				localStorage.setItem("nemvia-pending-role", role);
				const cred = await createUserWithEmailAndPassword(auth, cleanEmail, password);
				if (fullName.trim()) await updateProfile$2(cred.user, { displayName: fullName.trim().slice(0, 80) });
				await sendEmailVerification(cred.user);
				setInfoMsg("تم إنشاء الحساب وإرسال رابط التفعيل إلى بريدك الإلكتروني.");
				return;
			}
			const cred = await signInWithEmailAndPassword(auth, cleanEmail, password);
			if (cred.user.emailVerified) {
				localStorage.removeItem("nemvia-pending-role");
				await ensureOwnProfile(cred.user, role);
			}
		} catch (err) {
			setError(arabicAuthError(err));
		} finally {
			setBusy(false);
		}
	};
	if (isMobileAuthHandoff) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-[100dvh] bg-gradient-to-br from-[#0f233a] via-[#164673] to-[#1677c7] flex items-center justify-center p-4 font-['Cairo',sans-serif]",
		dir: "rtl",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-7 space-y-5 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-[#0f233a] to-[#1677c7] text-white flex items-center justify-center shadow-md",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraduationCap, { className: "w-7 h-7" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-xl font-black text-slate-900",
						children: "تسجيل الدخول لتطبيق NEMVIA"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-slate-500",
						children: ["الدور المختار: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-bold text-[#1677c7]",
							children: handoffRole === "teacher" ? "معلم" : "طالب"
						})]
					})]
				}),
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-3 bg-rose-50 text-rose-800 rounded-xl border border-rose-200 flex items-start gap-2 text-xs font-bold text-right",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-4 h-4 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: error })]
				}),
				!mobileCallbackUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					disabled: busy,
					onClick: completeHandoffGoogle,
					className: "w-full min-h-[48px] py-3.5 px-4 bg-[#1677c7] hover:bg-[#125fa0] disabled:opacity-60 text-white font-black rounded-xl text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer",
					children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-4 h-4 animate-spin" }) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "اضغط هنا لتسجيل الدخول بحساب Google" })]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: mobileCallbackUrl,
					className: "w-full min-h-[48px] py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-sm flex items-center justify-center gap-2 shadow-md",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "تم التحقق — اضغط للعودة لتطبيق NEMVIA" })]
				})
			]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-[100dvh] bg-gradient-to-br from-[#0f233a] via-[#164673] to-[#1677c7] flex items-center justify-center p-4 font-['Cairo',sans-serif]",
		dir: "rtl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-7 space-y-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-center space-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-[#0f233a] to-[#1677c7] text-white flex items-center justify-center shadow-md",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraduationCap, { className: "w-7 h-7" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-2xl font-black text-slate-900",
							children: "NEMVIA"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-slate-500",
							children: "منصة تعليمية ومجتمع أكاديمي للجميع"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-bold text-slate-700 text-center",
						children: "اختر دورك عند التسجيل لأول مرة:"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-2 gap-2 text-xs font-bold",
						children: ["student", "teacher"].map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setRole(r),
							className: `min-h-[44px] py-2.5 rounded-xl border cursor-pointer transition-colors ${role === r ? "border-[#1677c7] bg-sky-50 text-[#1677c7]" : "border-slate-200 text-slate-500 hover:bg-slate-50"}`,
							children: r === "student" ? "🎓 طالب" : "👨‍🏫 معلم"
						}, r))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex items-start gap-2 text-[11px] text-slate-600 leading-relaxed cursor-pointer",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						checked: agreed,
						onChange: (e) => setAgreed(e.target.checked),
						className: "mt-0.5 accent-[#1677c7]"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						"أوافق على",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setLegalTab("terms"),
							className: "text-[#1677c7] font-bold underline cursor-pointer",
							children: "شروط الاستخدام"
						}),
						" ",
						"و",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setLegalTab("privacy"),
							className: "text-[#1677c7] font-bold underline cursor-pointer",
							children: "سياسة الخصوصية"
						})
					] })]
				}),
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-3 bg-rose-50 text-rose-800 rounded-xl border border-rose-200 flex items-start gap-2 text-xs font-bold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-4 h-4 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: error })]
				}),
				infoMsg && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 flex items-start gap-2 text-xs font-bold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-4 h-4 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: infoMsg })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					disabled: busy,
					onClick: signInGoogle,
					className: "w-full min-h-[48px] py-3.5 px-4 bg-[#1677c7] hover:bg-[#125fa0] disabled:opacity-60 text-white font-black rounded-xl text-sm flex items-center justify-center gap-2.5 shadow-md cursor-pointer transition-colors",
					children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "w-5 h-5 rounded-full bg-white flex items-center justify-center shrink-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
							className: "w-3.5 h-3.5",
							viewBox: "0 0 48 48",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
									fill: "#EA4335",
									d: "M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
									fill: "#4285F4",
									d: "M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.4c-.5 2.9-2.2 5.3-4.6 6.9l7.1 5.5c4.3-4 6.8-9.8 6.8-16.9z"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
									fill: "#FBBC05",
									d: "M10.5 28.7c-.5-1.4-.8-2.9-.8-4.7s.3-3.2.8-4.7l-7.9-6.1C.9 16.4 0 20.1 0 24s.9 7.6 2.6 10.8l7.9-6.1z"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
									fill: "#34A853",
									d: "M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.1-5.5c-2 1.4-4.7 2.3-8.8 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z"
								})
							]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "المتابعة بحساب Google" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "pt-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => {
							setShowEmailForm((v) => !v);
							setError(null);
							setInfoMsg(null);
						},
						className: "w-full py-2 text-xs font-bold text-slate-500 hover:text-[#1677c7] transition-colors cursor-pointer flex items-center justify-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: showEmailForm ? "إخفاء الدخول بالبريد الإلكتروني" : "أو الدخول بالبريد الإلكتروني وكلمة المرور" })]
					}), showEmailForm && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleEmailSubmit,
						className: "mt-3 pt-3 border-t border-slate-100 space-y-3 text-xs animate-in fade-in",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl font-bold",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => {
											setEmailMode("signin");
											setError(null);
											setInfoMsg(null);
										},
										className: `py-2 rounded-lg cursor-pointer transition-colors ${emailMode === "signin" ? "bg-white text-[#1677c7] shadow-2xs" : "text-slate-600"}`,
										children: "دخول"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => {
											setEmailMode("signup");
											setError(null);
											setInfoMsg(null);
										},
										className: `py-2 rounded-lg cursor-pointer transition-colors ${emailMode === "signup" ? "bg-white text-[#1677c7] shadow-2xs" : "text-slate-600"}`,
										children: "حساب جديد"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => {
											setEmailMode("reset");
											setError(null);
											setInfoMsg(null);
										},
										className: `py-2 rounded-lg cursor-pointer transition-colors ${emailMode === "reset" ? "bg-white text-[#1677c7] shadow-2xs" : "text-slate-600"}`,
										children: "استعادة"
									})
								]
							}),
							emailMode === "signup" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: fullName,
									onChange: (e) => setFullName(e.target.value),
									placeholder: "الاسم الكامل",
									required: true,
									maxLength: 80,
									className: "w-full pr-9 pl-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1677c7]"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "email",
									dir: "ltr",
									value: email,
									onChange: (e) => setEmail(e.target.value),
									placeholder: "name@example.com",
									required: true,
									className: "w-full pr-9 pl-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1677c7] text-right"
								})]
							}),
							emailMode !== "reset" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "password",
									dir: "ltr",
									value: password,
									onChange: (e) => setPassword(e.target.value),
									placeholder: "كلمة المرور (6 أحرف على الأقل)",
									required: true,
									minLength: 6,
									className: "w-full pr-9 pl-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1677c7] text-right"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								disabled: busy,
								className: "w-full min-h-[44px] py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white font-bold rounded-xl cursor-pointer transition-colors",
								children: emailMode === "signin" ? "تسجيل الدخول" : emailMode === "signup" ? "إنشاء الحساب وإرسال التفعيل" : "إرسال رابط استعادة كلمة المرور"
							})
						]
					})]
				}),
				legalTab && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4",
					onClick: () => setLegalTab(null),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white rounded-3xl max-w-lg w-full max-h-[80vh] overflow-y-auto p-6 space-y-4",
						onClick: (e) => e.stopPropagation(),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-black text-slate-900",
								children: legalTab === "terms" ? "شروط الاستخدام" : "سياسة الخصوصية"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LegalContent, { tab: legalTab }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setLegalTab(null),
								className: "w-full py-2.5 bg-[#1677c7] text-white font-bold rounded-xl text-sm cursor-pointer",
								children: "إغلاق"
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "pt-2 border-t border-slate-100 space-y-2.5 flex flex-col items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setGuardianOpen(true),
						className: "w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[#0f233a] font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "w-4 h-4 text-[#1677c7]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "بوابة ولي الأمر (متابعة درجات الطالب بالرمز السري)" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PWAInstallButton, {})]
				})
			]
		}), guardianOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GuardianPortalModal, {
			initialCode: guardianCodeParam,
			onClose: () => setGuardianOpen(false)
		})]
	});
};
// src/components/views/CertificateVerifyModal.tsx
var CertificateVerifyModal = ({ initialCode = "", onClose }) => {
	const [code, setCode] = (0, import_react.useState)(initialCode.toUpperCase());
	const [loading, setLoading] = (0, import_react.useState)(Boolean(initialCode));
	const [error, setError] = (0, import_react.useState)(null);
	const [cert, setCert] = (0, import_react.useState)(null);
	const lookup = async (targetCode) => {
		const clean = targetCode.trim().toUpperCase();
		if (clean.length < 8) {
			setError("أدخل رمز تحقق صحيحاً (8 أحرف على الأقل، مثال: CERT7K9X2M4P).");
			return;
		}
		setLoading(true);
		setError(null);
		try {
			const res = await fetchVerifiedCertificate(clean);
			if (!res) {
				setCert(null);
				setError("لم يتم العثور على شهادة موثّقة مطابقة لهذا الرمز.");
			} else setCert(res);
		} catch {
			setError("تعذّر التحقق من الشهادة الآن، حاول مرة أخرى.");
		} finally {
			setLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		if (initialCode.trim().length >= 8) lookup(initialCode);
	}, [initialCode]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-[75] bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 font-['Cairo',sans-serif]",
		dir: "rtl",
		onClick: onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200 animate-in zoom-in-95",
			onClick: (e) => e.stopPropagation(),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-5 bg-[#0f233a] text-white flex items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "w-5 h-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-black text-base",
						children: "بوابة التحقق من الشهادات الرقمية"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] text-slate-300",
						children: "تحقق فوري من صحة الشهادات الصادرة عن منصة NEMVIA"
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onClose,
					className: "p-1.5 text-white/70 hover:text-white rounded-lg cursor-pointer",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-5 h-5" })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-5 sm:p-6 overflow-y-auto space-y-4 text-xs",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: (e) => {
							e.preventDefault();
							lookup(code);
						},
						className: "flex flex-col sm:flex-row gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							dir: "ltr",
							value: code,
							onChange: (e) => setCode(e.target.value.toUpperCase()),
							placeholder: "CERT8X9K2M4P",
							maxLength: 16,
							className: "flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-black text-sm tracking-widest text-center uppercase outline-none focus:border-[#1677c7]"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "submit",
							disabled: loading,
							className: "px-5 py-2.5 bg-[#1677c7] hover:bg-[#125fa0] disabled:opacity-60 text-white font-bold rounded-xl cursor-pointer flex items-center justify-center gap-1.5 shrink-0",
							children: [loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "تحقق الآن" })]
						})]
					}),
					error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl font-bold",
						children: error
					}),
					cert && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-5 rounded-2xl bg-gradient-to-br from-emerald-50/80 via-white to-amber-50/70 border-2 border-emerald-200 space-y-4 animate-in fade-in",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 text-white font-black text-[11px]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "شهادة موثّقة وصالحة" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono font-black text-slate-600 text-[11px]",
									children: cert.cert_code
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] font-bold text-slate-500 block",
										children: "اسم الطالب(ـة):"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
										className: "text-xl font-black text-slate-900",
										children: cert.student_name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-bold text-[#1677c7]",
										children: cert.title
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-2.5 tabular-nums",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3 rounded-xl bg-white border border-slate-200",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] font-bold text-slate-500 block",
										children: "رصيد الإنجاز الموثّق"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
										className: "text-base font-black text-slate-900",
										children: [cert.points, " XP"]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3 rounded-xl bg-white border border-slate-200",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] font-bold text-slate-500 block",
										children: "سلسلة المواظبة"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
										className: "text-base font-black text-orange-600 inline-flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [cert.streak_days, " يوم"] })]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-600",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1 font-bold text-slate-800",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "w-3.5 h-3.5 text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: cert.issuer_name })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["تاريخ الإصدار: ", new Date(cert.issued_at).toLocaleDateString("ar")] })]
							})
						]
					})
				]
			})]
		})
	});
};
// src/components/OnboardingModal.tsx
var SLIDES = [
	{
		icon: Sparkles,
		badge: "خطوة ١ من ٣",
		title: "تعلّم أذكى مع المعلّم الذكي والماسح الضوئي",
		desc: "اسأل بالصوت أو النص، وصوّر أي مسألة أو ورقة واجب بالكاميرا ليحلّلها الذكاء الاصطناعي ويشرحها خطوة بخطوة.",
		accent: "bg-sky-50 text-[#1677c7] border-sky-200",
		ctaSection: "ai",
		ctaLabel: "جرّب المعلّم الذكي"
	},
	{
		icon: PhoneCall,
		badge: "خطوة ٢ من ٣",
		title: "تواصل وتعاون مباشر مع صفّك",
		desc: "مكالمات صوت وفيديو مباشرة، رسائل صوتية، سبورة رسم تفاعلية، وغرف مذاكرة صوتية وتصويتات سريعة داخل الصفوف.",
		accent: "bg-emerald-50 text-emerald-700 border-emerald-200",
		ctaSection: "messages",
		ctaLabel: "استكشف الرسائل والغرف"
	},
	{
		icon: Award,
		badge: "خطوة ٣ من ٣",
		title: "ذاكر بدون إنترنت ووثّق تفوقك",
		desc: "احفظ الدروس للمذاكرة دون اتصال، راقب ساعات تركيزك الأسبوعية بمؤقت بومودورو، وأصدر شهادة تفوق موثّقة برمز QR.",
		accent: "bg-amber-50 text-amber-700 border-amber-200",
		ctaSection: "tools",
		ctaLabel: "افتح أدوات التفوق"
	}
];
var OnboardingModal = ({ open, userName, onClose, onNavigate }) => {
	const [step, setStep] = (0, import_react.useState)(0);
	if (!open) return null;
	const current = SLIDES[step] || SLIDES[0];
	const Icon = current.icon;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-[80] bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 font-['Cairo',sans-serif]",
		dir: "rtl",
		onClick: onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-white rounded-3xl max-w-md w-full overflow-hidden border border-slate-200 shadow-2xl animate-in zoom-in-95",
			onClick: (e) => e.stopPropagation(),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-5 bg-[#0f233a] text-white flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "w-4 h-4 text-sky-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-black text-sm",
						children: [
							"أهلاً بك في NEMVIA، ",
							userName,
							"!"
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onClose,
					className: "p-1.5 rounded-lg text-white/70 hover:text-white cursor-pointer",
					"aria-label": "تخطي الجولة",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-6 space-y-5 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex justify-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `px-3 py-1 rounded-full border text-[11px] font-black ${current.accent}`,
							children: current.badge
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `w-16 h-16 rounded-2xl mx-auto flex items-center justify-center border ${current.accent}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "w-8 h-8" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-lg font-black text-slate-900",
							children: current.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs sm:text-sm text-slate-600 leading-relaxed",
							children: current.desc
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center justify-center gap-1.5 pt-1",
						children: SLIDES.map((_, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setStep(idx),
							className: `h-2 rounded-full transition-all cursor-pointer ${idx === step ? "w-7 bg-[#1677c7]" : "w-2 bg-slate-200"}`,
							"aria-label": `الخطوة ${idx + 1}`
						}, idx))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => {
									if (step === 0) onClose();
									else setStep((s) => s - 1);
								},
								className: "px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer inline-flex items-center gap-1",
								children: step === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "تخطي" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "السابق" })] })
							}),
							onNavigate && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => {
									onClose();
									onNavigate(current.ctaSection);
								},
								className: "px-3.5 py-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-[#1677c7] font-bold cursor-pointer",
								children: current.ctaLabel
							}),
							step < SLIDES.length - 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setStep((s) => s + 1),
								className: "px-4 py-2.5 rounded-xl bg-[#1677c7] hover:bg-[#125fa0] text-white font-bold cursor-pointer inline-flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "التالي" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "w-4 h-4" })]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: onClose,
								className: "px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer inline-flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "ابدأ الآن" })]
							})
						]
					})
				]
			})]
		})
	});
};
// src/components/ReportModal.tsx
var REASONS = [
	"محتوى مسيء أو شتائم",
	"تحرش أو تنمّر",
	"محتوى غير لائق",
	"احتيال أو انتحال",
	"رسائل مزعجة (سبام)",
	"أخرى"
];
var ReportModal = ({ target, onClose, onSubmit }) => {
	const [reason, setReason] = (0, import_react.useState)(REASONS[0]);
	const [details, setDetails] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	if (!target) return null;
	const send = async (e) => {
		e.preventDefault();
		setBusy(true);
		await onSubmit({
			reason,
			details: details.trim()
		});
		setBusy(false);
		setDetails("");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4",
		dir: "rtl",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: send,
			className: "bg-white rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "font-black text-slate-900 flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flag, { className: "w-4 h-4 text-rose-500" }),
							"الإبلاغ عن ",
							target.label
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						className: "p-1 text-slate-400 hover:text-slate-700 cursor-pointer",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
					})]
				}),
				target.snapshot && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-600 line-clamp-3",
					children: [
						"«",
						target.snapshot,
						"»"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-1.5",
					children: REASONS.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: `flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold cursor-pointer ${reason === r ? "border-rose-400 bg-rose-50 text-rose-700" : "border-slate-200 text-slate-600"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "radio",
							name: "reason",
							checked: reason === r,
							onChange: () => setReason(r),
							className: "accent-rose-500"
						}), r]
					}, r))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					value: details,
					onChange: (e) => setDetails(e.target.value),
					maxLength: 500,
					rows: 3,
					placeholder: "تفاصيل إضافية (اختياري)",
					className: "w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-rose-400"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "submit",
					disabled: busy,
					className: "w-full py-3 bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white font-black rounded-xl text-sm cursor-pointer",
					children: "إرسال البلاغ"
				})
			]
		})
	});
};
// node_modules/@capacitor/network/dist/esm/index.js
var Network = registerPlugin("Network", { web: () => __vitePreload(() => import("./web-SEn7zQAI.js").then((m) => new m.NetworkWeb()), []) });
// src/components/pwa/OfflineIndicator.tsx
function useOnlineStatus() {
	const [isOnline, setIsOnline] = (0, import_react.useState)(typeof navigator !== "undefined" ? navigator.onLine : true);
	(0, import_react.useEffect)(() => {
		const handleOnline = () => setIsOnline(true);
		const handleOffline = () => setIsOnline(false);
		window.addEventListener("online", handleOnline);
		window.addEventListener("offline", handleOffline);
		let netHandle = null;
		if (isNativeApp()) {
			Network.getStatus().then((status) => setIsOnline(status.connected)).catch(() => {});
			Network.addListener("networkStatusChange", (status) => {
				setIsOnline(status.connected);
			}).then((h) => {
				netHandle = h;
			}).catch(() => {});
		}
		return () => {
			window.removeEventListener("online", handleOnline);
			window.removeEventListener("offline", handleOffline);
			if (netHandle) netHandle.remove();
		};
	}, []);
	return isOnline;
}
var OfflineIndicator = () => {
	if (useOnlineStatus()) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		dir: "rtl",
		className: "fixed bottom-20 md:bottom-4 right-4 z-50 flex items-center gap-2 rounded-xl bg-amber-500 px-3.5 py-2 text-xs font-bold text-white shadow-lg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WifiOff, { className: "w-3.5 h-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "وضع عدم الاتصال — يتم استخدام البيانات المخزنة مؤقتاً" })]
	});
};
// src/components/pwa/AppInstallPromptBanner.tsx
var DISMISS_KEY = "nemvia-install-prompt-dismissed-at";
var DISMISS_TTL_MS = 6048e5;
var AppInstallPromptBanner = () => {
	const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
	const [visible, setVisible] = (0, import_react.useState)(false);
	const [showGuide, setShowGuide] = (0, import_react.useState)(false);
	const [apkAvailable, setApkAvailable] = (0, import_react.useState)(true);
	const [apkUrl, setApkUrl] = (0, import_react.useState)(resolveApiUrl("/download/nemvia.apk"));
	(0, import_react.useEffect)(() => {
		if (isInstalled || isNativeApp()) return;
		try {
			const raw = Number(localStorage.getItem(DISMISS_KEY) || 0);
			if (raw && Date.now() - raw < DISMISS_TTL_MS) return;
		} catch {}
		fetch(resolveApiUrl("/api/health")).then((r) => r.json()).then((d) => {
			if (d?.apkAvailable === false) setApkAvailable(false);
			else setApkAvailable(true);
			if (d?.apkUrl) setApkUrl(d.apkUrl.startsWith("http") ? d.apkUrl : resolveApiUrl(d.apkUrl));
		}).catch(() => {});
		const timer = window.setTimeout(() => {
			setVisible(true);
		}, 1e4);
		return () => window.clearTimeout(timer);
	}, [isInstalled]);
	if (isInstalled || isNativeApp()) return null;
	const dismiss = () => {
		setVisible(false);
		try {
			localStorage.setItem(DISMISS_KEY, String(Date.now()));
		} catch {}
	};
	const handleInstall = async () => {
		if (isInstallable) {
			if (await install()) setVisible(false);
		} else setShowGuide(true);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [visible && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		dir: "rtl",
		role: "dialog",
		"aria-label": "تثبيت تطبيق NEMVIA",
		className: "fixed bottom-20 md:bottom-5 left-3 right-3 sm:right-auto sm:w-96 z-50 bg-white border border-slate-200 rounded-2xl shadow-xl p-4 flex items-start gap-3 animate-in fade-in",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 text-[#1677c7] flex items-center justify-center shrink-0",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { className: "w-5 h-5" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex-1 min-w-0 space-y-2 text-xs",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
					className: "font-black text-slate-900 text-sm",
					children: "هل تريد تنزيل NEMVIA كتطبيق؟"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-slate-600 leading-relaxed mt-0.5",
					children: "أضفه إلى شاشتك الرئيسية أو حمّل تطبيق Android (APK) مباشرة على هاتفك."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: dismiss,
					"aria-label": "إغلاق",
					className: "p-1.5 -mt-1 -ml-1 text-slate-400 hover:text-slate-700 cursor-pointer shrink-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2 pt-0.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: handleInstall,
						className: "min-h-[40px] px-3.5 py-2 bg-[#1677c7] hover:bg-[#125fa0] text-white font-bold rounded-xl inline-flex items-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "تثبيت التطبيق" })]
					}),
					apkAvailable && !isIOS && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: apkUrl,
						download: "NEMVIA.apk",
						className: "min-h-[40px] px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl inline-flex items-center gap-1.5 whitespace-nowrap",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "تنزيل APK" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: dismiss,
						className: "min-h-[40px] px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer whitespace-nowrap",
						children: "لاحقاً"
					})
				]
			})]
		})]
	}), showGuide && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-[70] bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4",
		onClick: () => setShowGuide(false),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			dir: "rtl",
			className: "bg-white rounded-3xl max-w-sm w-full border border-slate-200 shadow-2xl p-6 space-y-4 text-xs animate-in zoom-in-95",
			onClick: (e) => e.stopPropagation(),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between pb-2 border-b border-slate-100",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-8 h-8 rounded-xl bg-sky-50 text-[#1677c7] flex items-center justify-center font-bold",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { className: "w-4 h-4" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-extrabold text-slate-900 text-sm",
							children: "تثبيت NEMVIA على جهازك"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] text-slate-400",
							children: "خطوات سريعة للتشغيل كتطبيق"
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setShowGuide(false),
						className: "text-slate-400 hover:text-slate-600 cursor-pointer p-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
					})]
				}),
				isIOS ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2 text-slate-700 leading-relaxed",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							"1. افتح الموقع في متصفح ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Safari" }),
							"."
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							"2. اضغط على زر ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "مشاركة (Share)" }),
							" في الأسفل."
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							"3. اختر ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "«إضافة إلى الشاشة الرئيسية» (Add to Home Screen)" }),
							"."
						] })
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2 text-slate-700 leading-relaxed",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							"1. افتح قائمة المتصفح (",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "⋮" }),
							") في الأعلى."
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							"2. اختر ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "«تثبيت التطبيق»" }),
							" أو ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "«إضافة إلى الشاشة الرئيسية»" }),
							"."
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "3. ستظهر أيقونة NEMVIA بجانب تطبيقات هاتفك فوراً." })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => {
						setShowGuide(false);
						dismiss();
					},
					className: "w-full min-h-[44px] py-2.5 bg-[#1677c7] hover:bg-[#125fa0] text-white font-bold rounded-xl cursor-pointer",
					children: "فهمت، حسناً"
				})
			]
		})
	})] });
};
// src/components/PullToRefresh.tsx
var THRESHOLD = 62;
var MAX_PULL = 98;
var PullToRefresh = ({ onRefresh, enabled = true, children }) => {
	const { settings } = useAppSettings();
	const isEn = settings.lang === "en";
	const isFr = settings.lang === "fr";
	const containerRef = (0, import_react.useRef)(null);
	const startYRef = (0, import_react.useRef)(null);
	const startXRef = (0, import_react.useRef)(null);
	const pullingActiveRef = (0, import_react.useRef)(false);
	const pullDistanceRef = (0, import_react.useRef)(0);
	const phaseRef = (0, import_react.useRef)("idle");
	const onRefreshRef = (0, import_react.useRef)(onRefresh);
	onRefreshRef.current = onRefresh;
	const [pullDistance, setPullDistance] = (0, import_react.useState)(0);
	const [phase, setPhase] = (0, import_react.useState)("idle");
	const [dragging, setDragging] = (0, import_react.useState)(false);
	const syncPhase = (next) => {
		phaseRef.current = next;
		setPhase(next);
	};
	(0, import_react.useEffect)(() => {
		const el = containerRef.current;
		if (!el || !enabled) return;
		const isInteractiveChild = (target) => {
			if (!(target instanceof HTMLElement)) return false;
			const tag = target.tagName;
			if ([
				"INPUT",
				"TEXTAREA",
				"SELECT",
				"OPTION"
			].includes(tag)) return true;
			return Boolean(target.closest("[data-no-pull=\"true\"]"));
		};
		const getScrollTop = () => Math.max(window.scrollY || 0, document.documentElement?.scrollTop || 0, document.body?.scrollTop || 0);
		const onTouchStart = (e) => {
			if (phaseRef.current === "refreshing" || phaseRef.current === "done") return;
			if (e.touches.length !== 1) return;
			if (getScrollTop() > 4) return;
			if (isInteractiveChild(e.target)) return;
			startYRef.current = e.touches[0].clientY;
			startXRef.current = e.touches[0].clientX;
			pullingActiveRef.current = false;
		};
		const onTouchMove = (e) => {
			if (startYRef.current === null || startXRef.current === null) return;
			if (phaseRef.current === "refreshing" || phaseRef.current === "done") return;
			const dy = e.touches[0].clientY - startYRef.current;
			const dx = Math.abs(e.touches[0].clientX - startXRef.current);
			if (!pullingActiveRef.current) {
				if (dx > 10 && dx > dy) {
					startYRef.current = null;
					return;
				}
				if (dy < 8 || getScrollTop() > 4) {
					if (dy < -6) startYRef.current = null;
					return;
				}
				pullingActiveRef.current = true;
				setDragging(true);
			}
			if (dy <= 0) {
				pullDistanceRef.current = 0;
				setPullDistance(0);
				syncPhase("idle");
				return;
			}
			if (e.cancelable) e.preventDefault();
			const damped = Math.round(MAX_PULL * (1 - Math.exp(-dy / 135)));
			pullDistanceRef.current = damped;
			setPullDistance(damped);
			syncPhase(damped >= THRESHOLD ? "ready" : "pulling");
		};
		const onTouchEnd = async () => {
			if (!pullingActiveRef.current) {
				startYRef.current = null;
				startXRef.current = null;
				return;
			}
			pullingActiveRef.current = false;
			startYRef.current = null;
			startXRef.current = null;
			setDragging(false);
			if (pullDistanceRef.current >= THRESHOLD) {
				syncPhase("refreshing");
				pullDistanceRef.current = 58;
				setPullDistance(58);
				const startedAt = Date.now();
				try {
					await onRefreshRef.current();
				} catch {}
				const elapsed = Date.now() - startedAt;
				if (elapsed < 550) await new Promise((r) => setTimeout(r, 550 - elapsed));
				syncPhase("done");
				await new Promise((r) => setTimeout(r, 550));
			}
			pullDistanceRef.current = 0;
			setPullDistance(0);
			syncPhase("idle");
		};
		el.addEventListener("touchstart", onTouchStart, { passive: true });
		el.addEventListener("touchmove", onTouchMove, { passive: false });
		el.addEventListener("touchend", onTouchEnd, { passive: true });
		el.addEventListener("touchcancel", onTouchEnd, { passive: true });
		return () => {
			el.removeEventListener("touchstart", onTouchStart);
			el.removeEventListener("touchmove", onTouchMove);
			el.removeEventListener("touchend", onTouchEnd);
			el.removeEventListener("touchcancel", onTouchEnd);
		};
	}, [enabled]);
	const progress = Math.min(1, pullDistance / THRESHOLD);
	const circumference = 2 * Math.PI * 15;
	const dashOffset = circumference * (1 - progress);
	const showIndicator = pullDistance > 6 || phase === "refreshing" || phase === "done";
	const statusLabel = phase === "done" ? isEn ? "Updated" : isFr ? "Actualisé" : "تم التحديث" : phase === "refreshing" ? isEn ? "Refreshing..." : isFr ? "Actualisation..." : "جاري التحديث..." : phase === "ready" ? isEn ? "Release to refresh" : isFr ? "Relâcher pour actualiser" : "أفلت للتحديث" : isEn ? "Pull to refresh" : isFr ? "Tirer pour actualiser" : "اسحب للتحديث";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: containerRef,
		className: "relative touch-pan-y",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			"aria-hidden": !showIndicator,
			className: "pointer-events-none absolute top-0 left-0 right-0 flex flex-col items-center justify-start z-20 overflow-hidden",
			style: {
				height: `${Math.max(0, pullDistance)}px`,
				opacity: showIndicator ? Math.min(1, Math.max(.25, progress * 1.15)) : 0,
				transition: dragging ? "none" : "height 280ms cubic-bezier(0.22, 1, 0.36, 1), opacity 220ms ease"
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-1.5 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative w-7 h-7 flex items-center justify-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
						className: "w-7 h-7 -rotate-90",
						viewBox: "0 0 36 36",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx: "18",
							cy: "18",
							r: "15",
							fill: "none",
							stroke: "currentColor",
							strokeWidth: "2.5",
							className: "text-slate-200"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx: "18",
							cy: "18",
							r: "15",
							fill: "none",
							stroke: "currentColor",
							strokeWidth: "2.5",
							strokeLinecap: "round",
							strokeDasharray: circumference,
							strokeDashoffset: phase === "refreshing" || phase === "done" ? 0 : dashOffset,
							className: phase === "done" ? "text-emerald-600" : "text-[#1677c7]",
							style: { transition: dragging ? "none" : "stroke-dashoffset 180ms ease" }
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute inset-0 flex items-center justify-center",
						children: phase === "done" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-3.5 h-3.5 text-emerald-600 animate-in zoom-in-75" }) : phase === "refreshing" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-3.5 h-3.5 text-[#1677c7] animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDown, { className: `w-3.5 h-3.5 transition-transform duration-200 ${phase === "ready" ? "rotate-180 text-[#1677c7]" : "text-slate-500"}` })
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: `text-[11px] font-bold whitespace-nowrap ${phase === "done" ? "text-emerald-700" : phase === "ready" || phase === "refreshing" ? "text-[#1677c7]" : "text-slate-600"}`,
					children: statusLabel
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			style: {
				transform: pullDistance > 0 ? `translate3d(0, ${pullDistance}px, 0)` : "none",
				transition: dragging ? "none" : "transform 300ms cubic-bezier(0.22, 1, 0.36, 1)"
			},
			children
		})]
	});
};
// src/components/CallOverlay.tsx
var ICE_SERVERS = { iceServers: [
	{ urls: "stun:stun.l.google.com:19302" },
	{ urls: "stun:stun1.l.google.com:19302" },
	{ urls: "stun:stun.cloudflare.com:3478" }
] };
var CallOverlay = ({ currentUserId, currentUserName, outgoingRequest, incomingCall, onClearOutgoing, onClearIncoming, onNotify }) => {
	const [phase, setPhase] = (0, import_react.useState)("idle");
	const [activeCallId, setActiveCallId] = (0, import_react.useState)(null);
	const [peerName, setPeerName] = (0, import_react.useState)("");
	const [callType, setCallType] = (0, import_react.useState)("audio");
	const [muted, setMuted] = (0, import_react.useState)(false);
	const [camOff, setCamOff] = (0, import_react.useState)(false);
	const [facingMode, setFacingMode] = (0, import_react.useState)("user");
	const [minimized, setMinimized] = (0, import_react.useState)(false);
	const [elapsedSec, setElapsedSec] = (0, import_react.useState)(0);
	const [remoteHasVideo, setRemoteHasVideo] = (0, import_react.useState)(false);
	const pcRef = (0, import_react.useRef)(null);
	const localStreamRef = (0, import_react.useRef)(null);
	const remoteStreamRef = (0, import_react.useRef)(null);
	const localVideoRef = (0, import_react.useRef)(null);
	const remoteVideoRef = (0, import_react.useRef)(null);
	const remoteAudioRef = (0, import_react.useRef)(null);
	const pendingIceRef = (0, import_react.useRef)([]);
	const callUnsubRef = (0, import_react.useRef)(null);
	const candUnsubRef = (0, import_react.useRef)(null);
	const answerSetRef = (0, import_react.useRef)(false);
	const activeCallIdRef = (0, import_react.useRef)(null);
	const phaseRef = (0, import_react.useRef)(phase);
	phaseRef.current = phase;
	activeCallIdRef.current = activeCallId;
	const stopRingtone = (0, import_react.useRef)(null);
	const startRingtone = (incoming) => {
		stopRingtone.current?.();
		let timerId;
		let audioCtx = null;
		try {
			const Ctx = window.AudioContext || window.webkitAudioContext;
			if (!Ctx) return;
			audioCtx = new Ctx();
			const pulse = () => {
				if (!audioCtx || audioCtx.state === "closed") return;
				if (audioCtx.state === "suspended") audioCtx.resume();
				const now = audioCtx.currentTime;
				const osc = audioCtx.createOscillator();
				const gain = audioCtx.createGain();
				osc.type = "sine";
				osc.frequency.setValueAtTime(incoming ? 587.33 : 440, now);
				if (incoming) osc.frequency.setValueAtTime(783.99, now + .18);
				gain.gain.setValueAtTime(.001, now);
				gain.gain.exponentialRampToValueAtTime(.06, now + .04);
				gain.gain.exponentialRampToValueAtTime(.001, now + .42);
				osc.connect(gain);
				gain.connect(audioCtx.destination);
				osc.start(now);
				osc.stop(now + .45);
			};
			pulse();
			timerId = window.setInterval(pulse, incoming ? 1700 : 2400);
		} catch {}
		stopRingtone.current = () => {
			if (timerId) window.clearInterval(timerId);
			if (audioCtx && audioCtx.state !== "closed") audioCtx.close().catch(() => {});
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
			} catch {}
			pcRef.current = null;
		}
		if (localStreamRef.current) {
			localStreamRef.current.getTracks().forEach((t) => {
				try {
					t.stop();
				} catch {}
			});
			localStreamRef.current = null;
		}
		if (remoteStreamRef.current) {
			remoteStreamRef.current.getTracks().forEach((t) => {
				try {
					t.stop();
				} catch {}
			});
			remoteStreamRef.current = null;
		}
		if (localVideoRef.current) localVideoRef.current.srcObject = null;
		if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
		if (remoteAudioRef.current) remoteAudioRef.current.srcObject = null;
		setActiveCallId(null);
		setPhase("idle");
		setMuted(false);
		setCamOff(false);
		setMinimized(false);
		setElapsedSec(0);
		setRemoteHasVideo(false);
	};
	(0, import_react.useEffect)(() => {
		if (localVideoRef.current && localStreamRef.current) localVideoRef.current.srcObject = localStreamRef.current;
		if (remoteVideoRef.current && remoteStreamRef.current) remoteVideoRef.current.srcObject = remoteStreamRef.current;
		if (remoteAudioRef.current && remoteStreamRef.current) remoteAudioRef.current.srcObject = remoteStreamRef.current;
	}, [
		phase,
		minimized,
		remoteHasVideo,
		camOff
	]);
	(0, import_react.useEffect)(() => {
		if (phase !== "connected") return;
		const t = window.setInterval(() => setElapsedSec((s) => s + 1), 1e3);
		return () => window.clearInterval(t);
	}, [phase]);
	(0, import_react.useEffect)(() => {
		return () => {
			cleanupMediaAndPeer();
		};
	}, []);
	const setupPeerConnection = (callId, stream) => {
		const pc = new RTCPeerConnection(ICE_SERVERS);
		pcRef.current = pc;
		const remoteStream = new MediaStream();
		remoteStreamRef.current = remoteStream;
		stream.getTracks().forEach((track) => pc.addTrack(track, stream));
		pc.ontrack = (ev) => {
			ev.streams[0]?.getTracks().forEach((track) => {
				if (!remoteStream.getTracks().some((t) => t.id === track.id)) remoteStream.addTrack(track);
				if (track.kind === "video") setRemoteHasVideo(true);
			});
			if (ev.track && !remoteStream.getTracks().some((t) => t.id === ev.track.id)) {
				remoteStream.addTrack(ev.track);
				if (ev.track.kind === "video") setRemoteHasVideo(true);
			}
			if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;
			if (remoteAudioRef.current) remoteAudioRef.current.srcObject = remoteStream;
		};
		pc.onicecandidate = (ev) => {
			if (ev.candidate) addCallIceCandidate(callId, currentUserId, ev.candidate.toJSON());
		};
		pc.onconnectionstatechange = () => {
			const state = pc.connectionState;
			if (state === "connected") {
				stopRingtone.current?.();
				setPhase("connected");
			} else if (state === "failed" || state === "closed") hangup();
		};
		return pc;
	};
	const flushPendingIce = async (pc) => {
		const queued = [...pendingIceRef.current];
		pendingIceRef.current = [];
		for (const cand of queued) try {
			await pc.addIceCandidate(new RTCIceCandidate(cand));
		} catch {}
	};
	(0, import_react.useEffect)(() => {
		if (!outgoingRequest || phaseRef.current !== "idle") return;
		let cancelled = false;
		const startOutgoing = async () => {
			if (!navigator.mediaDevices?.getUserMedia || typeof RTCPeerConnection === "undefined") {
				onNotify("متصفحك أو جهازك لا يدعم مكالمات الصوت والفيديو المباشرة", false);
				onClearOutgoing();
				return;
			}
			setPeerName(outgoingRequest.calleeName);
			setCallType(outgoingRequest.callType);
			setPhase("calling");
			onClearOutgoing();
			let stream;
			try {
				stream = await navigator.mediaDevices.getUserMedia({
					audio: true,
					video: outgoingRequest.callType === "video" ? { facingMode: "user" } : false
				});
			} catch {
				onNotify("يرجى السماح بالوصول للمايكروفون والكاميرا لإجراء المكالمة", false);
				cleanupMediaAndPeer();
				return;
			}
			if (cancelled) {
				stream.getTracks().forEach((t) => t.stop());
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
				stream.getTracks().forEach((track) => pc.addTrack(track, stream));
				pc.ontrack = (ev) => {
					ev.streams[0]?.getTracks().forEach((t) => {
						if (!remoteStream.getTracks().some((x) => x.id === t.id)) remoteStream.addTrack(t);
						if (t.kind === "video") setRemoteHasVideo(true);
					});
					if (ev.track && !remoteStream.getTracks().some((x) => x.id === ev.track.id)) {
						remoteStream.addTrack(ev.track);
						if (ev.track.kind === "video") setRemoteHasVideo(true);
					}
					if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;
					if (remoteAudioRef.current) remoteAudioRef.current.srcObject = remoteStream;
				};
				pc.onconnectionstatechange = () => {
					if (pc.connectionState === "connected") {
						stopRingtone.current?.();
						setPhase("connected");
					} else if (pc.connectionState === "failed") {
						onNotify("تعذّر إتمام الاتصال بسبب قيود الشبكة", false);
						hangup();
					}
				};
				const offerDesc = await pc.createOffer({
					offerToReceiveAudio: true,
					offerToReceiveVideo: outgoingRequest.callType === "video"
				});
				await pc.setLocalDescription(offerDesc);
				const callId = await createCallOffer({
					callerId: currentUserId,
					callerName: currentUserName,
					calleeId: outgoingRequest.calleeId,
					calleeName: outgoingRequest.calleeName,
					callType: outgoingRequest.callType,
					offer: {
						type: offerDesc.type,
						sdp: offerDesc.sdp || ""
					}
				});
				setActiveCallId(callId);
				activeCallIdRef.current = callId;
				pc.onicecandidate = (ev) => {
					if (ev.candidate) addCallIceCandidate(callId, currentUserId, ev.candidate.toJSON());
				};
				candUnsubRef.current = subscribeCallCandidates(callId, currentUserId, async (cand) => {
					if (pc.remoteDescription) try {
						await pc.addIceCandidate(new RTCIceCandidate(cand));
					} catch {}
					else pendingIceRef.current.push(cand);
				});
				callUnsubRef.current = subscribeCallSession(callId, async (call) => {
					if (!call) {
						cleanupMediaAndPeer();
						return;
					}
					if (call.status === "rejected") {
						onNotify(`رفض ${call.callee_name} المكالمة`, false);
						cleanupMediaAndPeer();
						return;
					}
					if (call.status === "ended" || call.status === "missed") {
						cleanupMediaAndPeer();
						return;
					}
					if (call.status === "accepted" && call.answer?.sdp && !answerSetRef.current) {
						answerSetRef.current = true;
						stopRingtone.current?.();
						setPhase("connected");
						try {
							await pc.setRemoteDescription(new RTCSessionDescription({
								type: "answer",
								sdp: call.answer.sdp
							}));
							await flushPendingIce(pc);
						} catch {}
					}
				});
			} catch (err) {
				onNotify(err?.message || "تعذّر بدء المكالمة الآن", false);
				cleanupMediaAndPeer();
			}
		};
		startOutgoing();
		return () => {
			cancelled = true;
		};
	}, [outgoingRequest]);
	(0, import_react.useEffect)(() => {
		if (!incomingCall) {
			if (phaseRef.current === "ringing") cleanupMediaAndPeer();
			return;
		}
		if (phaseRef.current !== "idle") return;
		setActiveCallId(incomingCall.id);
		setPeerName(incomingCall.caller_name);
		setCallType(incomingCall.call_type);
		setPhase("ringing");
		startRingtone(true);
	}, [incomingCall?.id]);
	const acceptIncomingCall = async () => {
		if (!incomingCall) return;
		stopRingtone.current?.();
		if (!navigator.mediaDevices?.getUserMedia || typeof RTCPeerConnection === "undefined") {
			onNotify("جهازك لا يدعم المكالمات المباشرة", false);
			await updateCallStatus(incomingCall.id, "rejected");
			onClearIncoming();
			cleanupMediaAndPeer();
			return;
		}
		let stream;
		try {
			stream = await navigator.mediaDevices.getUserMedia({
				audio: true,
				video: incomingCall.call_type === "video" ? { facingMode: "user" } : false
			});
		} catch {
			onNotify("يرجى السماح بالمايكروفون والكاميرا للرد على المكالمة", false);
			return;
		}
		localStreamRef.current = stream;
		if (localVideoRef.current) localVideoRef.current.srcObject = stream;
		try {
			const pc = setupPeerConnection(incomingCall.id, stream);
			await pc.setRemoteDescription(new RTCSessionDescription({
				type: "offer",
				sdp: incomingCall.offer.sdp
			}));
			await flushPendingIce(pc);
			const answerDesc = await pc.createAnswer();
			await pc.setLocalDescription(answerDesc);
			await acceptCallWithAnswer(incomingCall.id, {
				type: answerDesc.type,
				sdp: answerDesc.sdp || ""
			});
			setPhase("connected");
			candUnsubRef.current = subscribeCallCandidates(incomingCall.id, currentUserId, async (cand) => {
				if (pc.remoteDescription) try {
					await pc.addIceCandidate(new RTCIceCandidate(cand));
				} catch {}
				else pendingIceRef.current.push(cand);
			});
			callUnsubRef.current = subscribeCallSession(incomingCall.id, (call) => {
				if (!call || call.status === "ended" || call.status === "rejected" || call.status === "missed") {
					onClearIncoming();
					cleanupMediaAndPeer();
				}
			});
		} catch (err) {
			onNotify(err?.message || "تعذّر قبول المكالمة", false);
			await updateCallStatus(incomingCall.id, "ended");
			onClearIncoming();
			cleanupMediaAndPeer();
		}
	};
	const rejectIncomingCall = async () => {
		const id = activeCallIdRef.current || incomingCall?.id;
		stopRingtone.current?.();
		if (id) await updateCallStatus(id, "rejected");
		onClearIncoming();
		cleanupMediaAndPeer();
	};
	const hangup = async () => {
		const id = activeCallIdRef.current;
		const status = phaseRef.current === "calling" ? "missed" : "ended";
		cleanupMediaAndPeer();
		onClearIncoming();
		if (id) await updateCallStatus(id, status);
	};
	const toggleMute = () => {
		const stream = localStreamRef.current;
		if (!stream) return;
		const nextMuted = !muted;
		stream.getAudioTracks().forEach((t) => {
			t.enabled = !nextMuted;
		});
		setMuted(nextMuted);
	};
	const toggleCam = () => {
		const stream = localStreamRef.current;
		if (!stream) return;
		const nextOff = !camOff;
		stream.getVideoTracks().forEach((t) => {
			t.enabled = !nextOff;
		});
		setCamOff(nextOff);
	};
	const switchCamera = async () => {
		if (callType !== "video" || !navigator.mediaDevices?.getUserMedia) return;
		const nextMode = facingMode === "user" ? "environment" : "user";
		try {
			const newTrack = (await navigator.mediaDevices.getUserMedia({
				video: { facingMode: nextMode },
				audio: false
			})).getVideoTracks()[0];
			if (!newTrack) return;
			(localStreamRef.current?.getVideoTracks() || []).forEach((t) => {
				localStreamRef.current?.removeTrack(t);
				t.stop();
			});
			localStreamRef.current?.addTrack(newTrack);
			if (localVideoRef.current && localStreamRef.current) localVideoRef.current.srcObject = localStreamRef.current;
			const sender = pcRef.current?.getSenders().find((s) => s.track?.kind === "video");
			if (sender) await sender.replaceTrack(newTrack);
			setFacingMode(nextMode);
			setCamOff(false);
		} catch {
			onNotify("تعذّر تبديل الكاميرا على هذا الجهاز", false);
		}
	};
	if (phase === "idle") return null;
	const mm = String(Math.floor(elapsedSec / 60)).padStart(2, "0");
	const ss = String(elapsedSec % 60).padStart(2, "0");
	if (minimized && phase !== "ringing") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed bottom-20 md:bottom-6 left-4 z-[85] bg-[#0f233a] text-white rounded-2xl shadow-2xl border border-slate-700 px-4 py-3 flex items-center gap-3 animate-in fade-in",
		dir: "rtl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("audio", {
				ref: remoteAudioRef,
				autoPlay: true,
				playsInline: true,
				className: "hidden"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0",
				children: callType === "video" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "w-4 h-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "w-4 h-4" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-xs min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-black truncate max-w-[140px]",
					children: peerName
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] text-sky-300 font-mono tabular-nums",
					children: phase === "connected" ? `${mm}:${ss}` : "جاري الرنين..."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => setMinimized(false),
				className: "p-2 rounded-xl bg-white/10 hover:bg-white/20 cursor-pointer",
				title: "تكبير شاشة المكالمة",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Maximize2, { className: "w-4 h-4" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => void hangup(),
				className: "p-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white cursor-pointer",
				title: "إنهاء المكالمة",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhoneOff, { className: "w-4 h-4" })
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-[90] bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-4",
		dir: "rtl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("audio", {
			ref: remoteAudioRef,
			autoPlay: true,
			playsInline: true,
			className: "hidden"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative w-full max-w-2xl bg-[#0f233a] border border-slate-700/80 rounded-3xl overflow-hidden shadow-2xl text-white flex flex-col min-h-[420px] max-h-[88dvh]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "px-5 py-4 flex items-center justify-between border-b border-white/10 z-10",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-black text-sm sm:text-base",
							children: peerName
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-sky-300 font-bold",
							children: phase === "ringing" ? callType === "video" ? "مكالمة فيديو واردة..." : "مكالمة صوتية واردة..." : phase === "calling" ? "جاري الاتصال والرنين..." : `متصل الآن · ${mm}:${ss}`
						})] })]
					}), phase !== "ringing" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setMinimized(true),
						className: "p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer",
						title: "تصغير النافذة",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minimize2, { className: "w-4 h-4" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative flex-1 bg-slate-900 flex items-center justify-center overflow-hidden min-h-[260px]",
					children: callType === "video" && phase === "connected" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
							ref: remoteVideoRef,
							autoPlay: true,
							playsInline: true,
							className: "w-full h-full object-cover"
						}),
						!remoteHasVideo && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "absolute inset-0 flex flex-col items-center justify-center gap-2 text-slate-300 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "w-8 h-8 text-sky-400 animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "بانتظار بث فيديو الطرف الآخر..." })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "absolute bottom-3 left-3 w-28 sm:w-36 aspect-[3/4] rounded-2xl overflow-hidden border-2 border-white/30 bg-slate-800 shadow-xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
								ref: localVideoRef,
								autoPlay: true,
								muted: true,
								playsInline: true,
								className: `w-full h-full object-cover ${facingMode === "user" ? "scale-x-[-1]" : ""} ${camOff ? "opacity-20" : ""}`
							}), camOff && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute inset-0 flex items-center justify-center text-[10px] font-bold text-slate-300",
								children: "الكاميرا متوقفة"
							})]
						})
					] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-center justify-center gap-4 p-8 text-center",
						children: [
							callType === "video" && phase === "calling" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
								ref: localVideoRef,
								autoPlay: true,
								muted: true,
								playsInline: true,
								className: "w-28 h-28 rounded-3xl object-cover border-2 border-sky-400/50 scale-x-[-1]"
							}),
							!(callType === "video" && phase === "calling") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-24 h-24 rounded-full bg-[#1677c7]/30 border-2 border-sky-400 flex items-center justify-center text-3xl font-black text-white shadow-lg",
								children: peerName.slice(0, 1) || "ن"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-lg font-black",
									children: peerName
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-slate-300 flex items-center justify-center gap-1.5",
									children: [phase === "calling" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin text-sky-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: phase === "ringing" ? "يدعوك إلى مكالمة مباشرة عبر NEMVIA" : phase === "calling" ? "بانتظار رد الطرف الآخر..." : "مكالمة صوتية نشطة" })]
								})]
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "px-6 py-5 bg-slate-950/70 border-t border-white/10 flex items-center justify-center gap-4",
					children: phase === "ringing" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => void rejectIncomingCall(),
						className: "min-h-[52px] px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-lg",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhoneOff, { className: "w-5 h-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "رفض" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => void acceptIncomingCall(),
						className: "min-h-[52px] px-7 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-lg animate-pulse",
						children: [callType === "video" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "w-5 h-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "w-5 h-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "قبول والرد" })]
					})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: toggleMute,
							className: `min-h-[48px] min-w-[48px] p-3.5 rounded-2xl transition-colors cursor-pointer ${muted ? "bg-amber-500 text-white" : "bg-white/15 hover:bg-white/25 text-white"}`,
							title: muted ? "تشغيل المايكروفون" : "كتم المايكروفون",
							children: muted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MicOff, { className: "w-5 h-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "w-5 h-5" })
						}),
						callType === "video" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: toggleCam,
							className: `min-h-[48px] min-w-[48px] p-3.5 rounded-2xl transition-colors cursor-pointer ${camOff ? "bg-amber-500 text-white" : "bg-white/15 hover:bg-white/25 text-white"}`,
							title: camOff ? "تشغيل الكاميرا" : "إيقاف الكاميرا",
							children: camOff ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VideoOff, { className: "w-5 h-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "w-5 h-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => void switchCamera(),
							className: "min-h-[48px] min-w-[48px] p-3.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white transition-colors cursor-pointer",
							title: "تبديل الكاميرا (أمامية / خلفية)",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchCamera, { className: "w-5 h-5" })
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => void hangup(),
							className: "min-h-[48px] px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-lg",
							title: "إنهاء المكالمة",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhoneOff, { className: "w-5 h-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "إنهاء" })]
						})
					] })
				})
			]
		})]
	});
};
// src/App.tsx
var ClassesView = lazyWithRetry(() => __vitePreload(() => import("./ClassesView-Bm9HO-iv.js").then((m) => ({ default: m.ClassesView })), __vite__mapDeps([0,1,2,3,4])));
var CoursesView = lazyWithRetry(() => __vitePreload(() => import("./CoursesView-yV2-8CU9.js").then((m) => ({ default: m.CoursesView })), __vite__mapDeps([5,1,2,6,7,4])));
var AssignmentsView = lazyWithRetry(() => __vitePreload(() => import("./AssignmentsView-BEwbzsPa.js").then((m) => ({ default: m.AssignmentsView })), __vite__mapDeps([8,1,2,6,4])));
var CommunityView = lazyWithRetry(() => __vitePreload(() => import("./CommunityView-C9zWAIbT.js").then((m) => ({ default: m.CommunityView })), __vite__mapDeps([9,1,2,10,4])));
var LiveClassroomView = lazyWithRetry(() => __vitePreload(() => import("./LiveClassroomView-C2LM99qe.js").then((m) => ({ default: m.LiveClassroomView })), __vite__mapDeps([11,1,2,12,4])));
var MessagesView = lazyWithRetry(() => __vitePreload(() => import("./MessagesView-Bt-jlJm3.js").then((m) => ({ default: m.MessagesView })), __vite__mapDeps([13,1,2,12,4,10])));
var StudyToolsView = lazyWithRetry(() => __vitePreload(() => import("./StudyToolsView-CJU86TYL.js").then((m) => ({ default: m.StudyToolsView })), __vite__mapDeps([14,1,2,3,6,4])));
var AIStudioView = lazyWithRetry(() => __vitePreload(() => import("./AIStudioView-mFE0K3lZ.js").then((m) => ({ default: m.AIStudioView })), __vite__mapDeps([15,1,2,6,7,4])));
var AdminView = lazyWithRetry(() => __vitePreload(() => import("./AdminView-Cmzxk_Hc.js").then((m) => ({ default: m.AdminView })), __vite__mapDeps([16,1,2,4])));
var ProfileView = lazyWithRetry(() => __vitePreload(() => import("./ProfileView-BBh_jWk2.js").then((m) => ({ default: m.ProfileView })), __vite__mapDeps([17,1,2,18,4])));
var LegalView = lazyWithRetry(() => __vitePreload(() => Promise.resolve().then(() => LegalView_exports).then((m) => ({ default: m.LegalView })), void 0));
var SettingsView = lazyWithRetry(() => __vitePreload(() => import("./SettingsView-gb_G5i3a.js").then((m) => ({ default: m.SettingsView })), __vite__mapDeps([19,1,2,7,4])));
var CalendarView = lazyWithRetry(() => __vitePreload(() => import("./CalendarView-DCPMyID7.js").then((m) => ({ default: m.CalendarView })), __vite__mapDeps([20,1,2,4])));
var GradebookView = lazyWithRetry(() => __vitePreload(() => import("./GradebookView-C78eOIX_.js").then((m) => ({ default: m.GradebookView })), __vite__mapDeps([21,1,2,4])));
var EMPTY = {
	classes: [],
	schools: [],
	ministries: [],
	myOrgIds: [],
	orgMembers: [],
	courses: [],
	lessons: [],
	quizzes: [],
	assignments: [],
	submissions: [],
	posts: [],
	stories: [],
	liveSessions: [],
	messages: [],
	notifications: [],
	reports: [],
	contacts: [],
	classMembers: [],
	myClassIds: [],
	followingIds: [],
	followerIds: [],
	followRequests: []
};
function App() {
	const { settings } = useAppSettings();
	const ui = UI_COPY[settings.lang];
	const appDir = settings.lang === "ar" ? "rtl" : "ltr";
	const [firebaseUser, setFirebaseUser] = (0, import_react.useState)(null);
	const [authReady, setAuthReady] = (0, import_react.useState)(false);
	const [profile, setProfile] = (0, import_react.useState)(null);
	const [profileError, setProfileError] = (0, import_react.useState)(null);
	const [data, setData] = (0, import_react.useState)(EMPTY);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [activeSection, setActiveSectionRaw] = (0, import_react.useState)("home");
	const [toast, setToast] = (0, import_react.useState)(null);
	const [reportTarget, setReportTarget] = (0, import_react.useState)(null);
	const [hubOpen, setHubOpen] = (0, import_react.useState)(false);
	const [searchOpen, setSearchOpen] = (0, import_react.useState)(false);
	const [chatPeerId, setChatPeerId] = (0, import_react.useState)(null);
	const [stats, setStats] = (0, import_react.useState)(null);
	const [liveAlert, setLiveAlert] = (0, import_react.useState)(null);
	const [confirmState, setConfirmState] = (0, import_react.useState)(null);
	const [incomingCall, setIncomingCall] = (0, import_react.useState)(null);
	const [outgoingCall, setOutgoingCall] = (0, import_react.useState)(null);
	const [guardianRouteCode, setGuardianRouteCode] = (0, import_react.useState)(() => {
		if (typeof window === "undefined") return "";
		return (new URLSearchParams(window.location.search).get("guardian") || "").trim().toUpperCase();
	});
	const [certRouteCode, setCertRouteCode] = (0, import_react.useState)(() => {
		if (typeof window === "undefined") return "";
		return (new URLSearchParams(window.location.search).get("cert") || "").trim().toUpperCase();
	});
	const [onboardingOpen, setOnboardingOpen] = (0, import_react.useState)(false);
	const profileRef = (0, import_react.useRef)(null);
	const seenIdsRef = (0, import_react.useRef)(/* @__PURE__ */ new Set());
	const hydratedRef = (0, import_react.useRef)(false);
	const alertTimerRef = (0, import_react.useRef)(void 0);
	const backExitTimeRef = (0, import_react.useRef)(0);
	const joinHandledRef = (0, import_react.useRef)(null);
	const dataRef = (0, import_react.useRef)(EMPTY);
	const uiStateRef = (0, import_react.useRef)({
		activeSection: "home",
		hubOpen: false,
		searchOpen: false,
		hasReport: false,
		hasConfirm: false
	});
	profileRef.current = profile;
	dataRef.current = data;
	uiStateRef.current = {
		activeSection,
		hubOpen,
		searchOpen,
		hasReport: Boolean(reportTarget),
		hasConfirm: Boolean(confirmState)
	};
	const notify = (0, import_react.useCallback)((msg, ok = true) => {
		setToast({
			msg,
			ok
		});
		setTimeout(() => setToast(null), 3500);
	}, []);
	const sectionHistoryRef = (0, import_react.useRef)([]);
	const setActiveSection = (0, import_react.useCallback)((next) => {
		setActiveSectionRaw((prev) => {
			if (prev === next) return prev;
			sectionHistoryRef.current = [...sectionHistoryRef.current.slice(-15), prev];
			if (!isNativeApp() && prev === "home" && next !== "home" && typeof window !== "undefined") try {
				window.history.pushState({ nemviaHomeGuard: true }, "");
			} catch {}
			return next;
		});
	}, []);
	const refreshRef = (0, import_react.useRef)(async () => {});
	(0, import_react.useEffect)(() => {
		bindAudioUnlock();
		initNativeNotifications();
		const onOpenSection = (ev) => {
			const target = ev.detail?.targetSection;
			if (target) setActiveSection(target);
		};
		const onPopState = () => {
			if (isNativeApp()) return;
			const cur = uiStateRef.current;
			if (cur.hasConfirm) {
				setConfirmState(null);
				return;
			}
			if (cur.hasReport) {
				setReportTarget(null);
				return;
			}
			if (cur.searchOpen) {
				setSearchOpen(false);
				return;
			}
			if (cur.hubOpen) {
				setHubOpen(false);
				return;
			}
			if (cur.activeSection !== "home") {
				setActiveSectionRaw("home");
				sectionHistoryRef.current = [];
			}
		};
		const onKey = (e) => {
			if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
				e.preventDefault();
				setSearchOpen((v) => !v);
			}
		};
		const onVisibility = () => {
			if (!document.hidden) refreshRef.current();
		};
		const onReplayOnboarding = () => setOnboardingOpen(true);
		window.addEventListener("nemvia:open-section", onOpenSection);
		window.addEventListener("nemvia:replay-onboarding", onReplayOnboarding);
		window.addEventListener("popstate", onPopState);
		window.addEventListener("keydown", onKey);
		document.addEventListener("visibilitychange", onVisibility);
		const cleanupNative = initNativeAndroidShell({
			initialTheme: settings.theme,
			onResume: () => {
				refreshRef.current();
			},
			onBackButton: () => {
				const cur = uiStateRef.current;
				if (cur.hasConfirm) {
					setConfirmState(null);
					return true;
				}
				if (cur.hasReport) {
					setReportTarget(null);
					return true;
				}
				if (cur.searchOpen) {
					setSearchOpen(false);
					return true;
				}
				if (cur.hubOpen) {
					setHubOpen(false);
					return true;
				}
				if (cur.activeSection !== "home") {
					sectionHistoryRef.current = [];
					setActiveSectionRaw("home");
					return true;
				}
				const now = Date.now();
				if (now - backExitTimeRef.current < 2e3) return false;
				backExitTimeRef.current = now;
				notify("اضغط زر الرجوع مرة أخرى للخروج من التطبيق", true);
				return true;
			}
		});
		return () => {
			window.removeEventListener("nemvia:open-section", onOpenSection);
			window.removeEventListener("nemvia:replay-onboarding", onReplayOnboarding);
			window.removeEventListener("popstate", onPopState);
			window.removeEventListener("keydown", onKey);
			document.removeEventListener("visibilitychange", onVisibility);
			cleanupNative();
		};
	}, [notify, setActiveSection]);
	const seedSeenIds = (0, import_react.useCallback)((d) => {
		const s = seenIdsRef.current;
		d.messages.forEach((m) => s.add(`msg:${m.id}`));
		d.notifications.forEach((n) => s.add(`notif:${n.id}`));
		d.liveSessions.forEach((ls) => {
			if (ls.status === "live") s.add(`live:${ls.id}`);
		});
		d.assignments.forEach((a) => s.add(`asg:${a.id}`));
		d.quizzes.forEach((q) => s.add(`quiz:${q.id}`));
	}, []);
	const triggerIncomingAlert = (0, import_react.useCallback)((opts) => {
		if (seenIdsRef.current.has(opts.id)) return;
		seenIdsRef.current.add(opts.id);
		playNotificationChime(opts.chime);
		showBrowserNotification(opts.title, opts.body, opts.id, opts.targetSection);
		setLiveAlert({
			title: opts.title,
			body: opts.body,
			targetSection: opts.targetSection
		});
		window.clearTimeout(alertTimerRef.current);
		alertTimerRef.current = window.setTimeout(() => setLiveAlert(null), 6e3);
	}, []);
	(0, import_react.useEffect)(() => {
		const unsub = onAuthStateChanged(auth, (user) => {
			setFirebaseUser(user);
			setAuthReady(true);
		});
		return () => unsub();
	}, []);
	const refresh = (0, import_react.useCallback)(async () => {
		const me = profileRef.current;
		if (!me) return;
		const fresh = await loadAll(me);
		if (hydratedRef.current) {
			for (const m of fresh.messages) {
				const key = `msg:${m.id}`;
				if (!seenIdsRef.current.has(key)) {
					if (m.sender_id !== me.id) triggerIncomingAlert({
						id: key,
						title: m.channel_id ? `رسالة جديدة في ${m.recipient_name || "الصف"}` : `رسالة جديدة من ${m.sender_name}`,
						body: m.body || (m.attachment ? `مرفق: ${m.attachment.name}` : "رسالة جديدة"),
						chime: "message",
						targetSection: "messages"
					});
					else seenIdsRef.current.add(key);
				}
			}
			for (const n of fresh.notifications) {
				const key = `notif:${n.id}`;
				if (!seenIdsRef.current.has(key)) {
					if (!n.read) {
						const target = n.kind === "grade" ? "courses" : n.kind === "live" ? "live" : n.kind === "social" ? "community" : "assignments";
						triggerIncomingAlert({
							id: key,
							title: n.title,
							body: n.body,
							chime: n.kind === "grade" ? "grade" : "alert",
							targetSection: target
						});
					} else seenIdsRef.current.add(key);
				}
			}
			for (const ls of fresh.liveSessions) {
				const key = `live:${ls.id}`;
				if (ls.status === "live" && !seenIdsRef.current.has(key)) {
					if (ls.host_id !== me.id) triggerIncomingAlert({
						id: key,
						title: "حصة مباشرة بدأت الآن",
						body: `${ls.title} — ${ls.host_name}`,
						chime: "alert",
						targetSection: "live"
					});
					else seenIdsRef.current.add(key);
				}
			}
			for (const a of fresh.assignments) {
				const key = `asg:${a.id}`;
				if (!seenIdsRef.current.has(key)) {
					if (a.teacher_id !== me.id) triggerIncomingAlert({
						id: key,
						title: "واجب جديد",
						body: `${a.title} (${a.class_title})`,
						chime: "alert",
						targetSection: "assignments"
					});
					else seenIdsRef.current.add(key);
				}
			}
			for (const q of fresh.quizzes) {
				const key = `quiz:${q.id}`;
				if (!seenIdsRef.current.has(key)) {
					const ownerId = fresh.classes.find((c) => c.id === q.class_id)?.teacher_id;
					if (ownerId && ownerId !== me.id) triggerIncomingAlert({
						id: key,
						title: "اختبار جديد متاح",
						body: `${q.title} (${q.class_title})`,
						chime: "alert",
						targetSection: "courses"
					});
					else seenIdsRef.current.add(key);
				}
			}
		} else {
			seedSeenIds(fresh);
			hydratedRef.current = true;
		}
		setData(fresh);
	}, [seedSeenIds, triggerIncomingAlert]);
	const refreshProfile = (0, import_react.useCallback)(async () => {
		const uid = firebaseUser?.uid;
		if (!uid) return;
		const p = await fetchOwnProfile(uid);
		if (p) setProfile(p);
	}, [firebaseUser?.uid]);
	refreshRef.current = async () => {
		await Promise.all([refresh(), refreshProfile()]);
	};
	const loadUserSession = (0, import_react.useCallback)(async (uid, isCancelled) => {
		setLoading(true);
		setProfileError(null);
		try {
			const p = await fetchOwnProfile(uid);
			if (isCancelled?.()) return;
			if (!p) {
				setProfileError("تعذّر العثور على ملفك الشخصي أو إنشاؤه.");
				return;
			}
			await touchStreak();
			profileRef.current = p;
			setProfile(p);
			const loaded = await loadAll(p);
			if (isCancelled?.()) return;
			seedSeenIds(loaded);
			hydratedRef.current = true;
			setData(loaded);
		} catch (err) {
			console.error("[NEMVIA] Load error:", err);
			if (isCancelled?.()) return;
			let detail = String(err?.message || "تعذّر تحميل بيانات حسابك.");
			if (detail.startsWith("{")) try {
				const parsed = JSON.parse(detail);
				detail = `${parsed.path ? `[${parsed.path}] ` : ""}${parsed.error || detail}`;
			} catch {}
			setProfileError(detail);
		} finally {
			if (!isCancelled?.()) setLoading(false);
		}
	}, [seedSeenIds]);
	const [verifyBusy, setVerifyBusy] = (0, import_react.useState)(false);
	const [verifyNotice, setVerifyNotice] = (0, import_react.useState)(null);
	const [verifyTick, setVerifyTick] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		const uid = firebaseUser?.uid;
		seenIdsRef.current.clear();
		hydratedRef.current = false;
		if (!uid || !firebaseUser?.emailVerified) {
			setProfile(null);
			setData(EMPTY);
			setProfileError(null);
			return;
		}
		let cancelled = false;
		loadUserSession(uid, () => cancelled);
		return () => {
			cancelled = true;
		};
	}, [
		firebaseUser?.uid,
		firebaseUser?.emailVerified,
		verifyTick,
		loadUserSession
	]);
	(0, import_react.useEffect)(() => {
		if (!authReady || !profile) return;
		let timer;
		const bump = () => {
			window.clearTimeout(timer);
			timer = window.setTimeout(() => {
				refresh();
			}, 180);
		};
		const unsubRealtime = subscribeRealtimeUpdates(profile.id, bump);
		const mergeIncomingMessages = (nextSlice, isChannel) => {
			const me = profileRef.current;
			if (!me) return;
			if (hydratedRef.current) for (const m of nextSlice) {
				const key = `msg:${m.id}`;
				if (!seenIdsRef.current.has(key)) {
					if (m.sender_id !== me.id) triggerIncomingAlert({
						id: key,
						title: m.channel_id ? `رسالة جديدة في ${m.recipient_name || "الصف"}` : `رسالة جديدة من ${m.sender_name}`,
						body: m.body || (m.attachment ? `مرفق: ${m.attachment.name}` : "رسالة جديدة"),
						chime: "message",
						targetSection: "messages"
					});
					else seenIdsRef.current.add(key);
				}
			}
			setData((prev) => {
				const merged = [...prev.messages.filter((m) => isChannel ? !m.channel_id : Boolean(m.channel_id)), ...nextSlice].sort((a, b) => a.created_at.localeCompare(b.created_at));
				return {
					...prev,
					messages: merged
				};
			});
		};
		const unsubStreams = subscribeRealtimeMessagesAndNotifications(profile.id, () => {
			const curData = dataRef.current;
			const spaceTitles = new Map([
				...curData.classes.map((c) => [c.id, c.title]),
				...curData.schools.map((s) => [s.id, s.name]),
				...curData.ministries.map((m) => [m.id, m.name])
			]);
			return {
				me: profileRef.current,
				contacts: curData.contacts,
				spaceTitles
			};
		}, {
			onDirectMessages: (dms) => mergeIncomingMessages(dms, false),
			onClassMessages: (cms) => mergeIncomingMessages(cms, true),
			onNotifications: (notifs) => {
				if (hydratedRef.current) for (const n of notifs) {
					const key = `notif:${n.id}`;
					if (!seenIdsRef.current.has(key)) {
						if (!n.read) {
							const target = n.kind === "grade" ? "courses" : n.kind === "live" ? "live" : n.kind === "social" ? "community" : "assignments";
							triggerIncomingAlert({
								id: key,
								title: n.title,
								body: n.body,
								chime: n.kind === "grade" ? "grade" : "alert",
								targetSection: target
							});
						} else seenIdsRef.current.add(key);
					}
				}
				setData((prev) => ({
					...prev,
					notifications: notifs
				}));
			}
		});
		const unsubCalls = subscribeIncomingCalls(profile.id, (call) => {
			setIncomingCall(call);
			if (call) {
				const key = `call:${call.id}`;
				if (!seenIdsRef.current.has(key)) {
					seenIdsRef.current.add(key);
					if (document.hidden) showBrowserNotification(call.call_type === "video" ? `مكالمة فيديو واردة من ${call.caller_name}` : `مكالمة صوتية واردة من ${call.caller_name}`, "افتح تطبيق NEMVIA للرد على المكالمة", key, "messages");
				}
			}
		});
		const poll = window.setInterval(() => {
			if (!document.hidden) refresh();
		}, 15e3);
		return () => {
			window.clearTimeout(timer);
			window.clearInterval(poll);
			unsubRealtime();
			unsubStreams();
			unsubCalls();
		};
	}, [
		authReady,
		profile?.id,
		refresh,
		triggerIncomingAlert
	]);
	(0, import_react.useEffect)(() => {
		if (!profile?.id) return;
		try {
			const seenKey = `nemvia-onboarding-v1-${profile.id}`;
			if (!localStorage.getItem(seenKey)) setOnboardingOpen(true);
		} catch {}
		updateChatPresence(profile.id, {
			is_online: true,
			typing_to: ""
		});
		const ping = window.setInterval(() => {
			if (!document.hidden) updateChatPresence(profile.id, {
				is_online: true,
				typing_to: ""
			});
		}, 9e4);
		const onUnload = () => {
			updateChatPresence(profile.id, {
				is_online: false,
				typing_to: ""
			});
		};
		window.addEventListener("beforeunload", onUnload);
		return () => {
			window.clearInterval(ping);
			window.removeEventListener("beforeunload", onUnload);
		};
	}, [profile?.id]);
	(0, import_react.useEffect)(() => {
		const onDeepLink = (ev) => {
			const detail = ev.detail || {};
			if (detail.guardian) {
				setGuardianRouteCode(detail.guardian);
				return;
			}
			if (detail.cert) {
				setCertRouteCode(detail.cert);
				return;
			}
			if (detail.join) {
				if (profileRef.current) joinClass(detail.join).then(async (ok) => {
					if (ok) {
						await refresh();
						setActiveSection("classes");
						notify("تم الانضمام للصف تلقائياً بنجاح ✓");
					} else notify("رمز الدعوة أو QR غير صالح أو الصف مؤرشف.", false);
				});
				else try {
					sessionStorage.setItem("nemvia-pending-join", detail.join);
				} catch {}
			}
		};
		window.addEventListener("nemvia:deep-link", onDeepLink);
		return () => window.removeEventListener("nemvia:deep-link", onDeepLink);
	}, [
		refresh,
		setActiveSection,
		notify
	]);
	(0, import_react.useEffect)(() => {
		if (!profile || loading || typeof window === "undefined") return;
		const params = new URLSearchParams(window.location.search);
		let pendingJoin = "";
		try {
			pendingJoin = (sessionStorage.getItem("nemvia-pending-join") || "").trim().toUpperCase();
		} catch {}
		const joinParam = (params.get("join") || pendingJoin || "").trim().toUpperCase();
		if (!joinParam || joinHandledRef.current === joinParam) return;
		joinHandledRef.current = joinParam;
		try {
			sessionStorage.removeItem("nemvia-pending-join");
		} catch {}
		joinClass(joinParam).then(async (ok) => {
			params.delete("join");
			const qs = params.toString();
			const nextUrl = `${window.location.pathname}${qs ? `?${qs}` : ""}${window.location.hash}`;
			window.history.replaceState(null, "", nextUrl);
			if (ok) {
				await refresh();
				setActiveSection("classes");
				notify("تم الانضمام للصف تلقائياً بنجاح ✓");
			} else notify("رمز الدعوة أو QR غير صالح أو الصف مؤرشف.", false);
		});
	}, [
		profile?.id,
		loading,
		refresh,
		notify,
		setActiveSection
	]);
	(0, import_react.useEffect)(() => {
		if (profile?.role === "admin") adminStats().then(setStats);
	}, [
		profile?.id,
		profile?.role,
		data.reports.length
	]);
	const run = (0, import_react.useCallback)(async (fn, okMsg) => {
		try {
			await fn();
			await refresh();
			if (okMsg) notify(okMsg);
			return true;
		} catch (e) {
			notify(e?.message || "تعذّر تنفيذ العملية", false);
			return false;
		}
	}, [refresh, notify]);
	const uid = profile?.id || "";
	const upload = async (file, folder) => {
		try {
			return await uploadFile(uid, file, folder);
		} catch (e) {
			notify(e.message || "فشل رفع الملف", false);
			throw e;
		}
	};
	const handleAddClass = (c) => {
		run(() => createClass(uid, c), "تم إنشاء المساحة بنجاح");
	};
	const handleJoinClass = async (code) => {
		const ok = await joinClass(code);
		if (ok) await refresh();
		return ok;
	};
	const handleCreateMinistry = (m) => run(() => createMinistry(uid, m), "تم إنشاء الوزارة / المجمع التعليمي");
	const handleCreateSchool = (s) => run(() => createSchool(uid, s), "تم إنشاء المدرسة / المعهد بنجاح");
	const handleLinkSchoolMinistry = (school, ministryId) => run(() => linkSchoolToMinistry(school, ministryId), ministryId ? "تم ربط المدرسة بالوزارة/المجمع" : "تم فك ارتباط المدرسة");
	const handleLinkClassSchool = (cls, schoolId) => run(() => linkClassToSchool(cls, schoolId), schoolId ? "تم ربط الصف بالمدرسة" : "تم فك ارتباط الصف");
	const handleSendDirective = (orgId, orgName, body) => run(() => sendMessage(uid, {
		id: "new",
		sender_id: uid,
		sender_name: profile?.display_name || "",
		recipient_id: orgId,
		recipient_name: orgName,
		channel_id: orgId,
		body,
		created_at: (/* @__PURE__ */ new Date()).toISOString()
	}), "تم نشر التعميم بنجاح");
	const handleRemoveOrgMember = (orgId, userId) => run(() => removeMember(orgId, userId), "تمت إزالة العضو");
	const handleLeaveOrg = (orgId) => run(() => leaveClass(uid, orgId), "تمت المغادرة");
	const handleDeleteOrg = (orgId) => run(() => deleteRow("classes", orgId), "تم الحذف بنجاح");
	const handleAddLesson = (l) => {
		run(() => createLesson(uid, l), "تم نشر الدرس");
	};
	const handleAddQuiz = (q) => {
		run(() => createQuiz(uid, q), "تم نشر الاختبار");
	};
	const handleSubmitQuiz = async (quizId, answers, questions) => {
		try {
			const res = await submitQuiz(quizId, answers, questions);
			refresh();
			return res;
		} catch (e) {
			notify(e.message || "تعذّر إرسال الاختبار", false);
			throw e;
		}
	};
	const handleGradeQuizAttempt = (attemptId, score, feedback, questionFeedback) => run(() => gradeQuizAttempt(attemptId, score, feedback, questionFeedback), "تم حفظ الدرجة والتغذية الراجعة وإشعار الطالب");
	const handleRewardPoints = async (points) => {
		const total = await awardPoints(points);
		if (total !== null) setProfile((p) => p ? {
			...p,
			points: total
		} : p);
	};
	const handleCreateAssignment = (a) => run(() => createAssignment(uid, a), "تم نشر الواجب");
	const handleSubmitAssignment = (s) => {
		run(() => submitAssignment(uid, s), "تم تسليم الواجب");
	};
	const handleGradeSubmission = (id, grade, feedback) => {
		run(() => gradeSubmission(id, grade, feedback), "تم رصد الدرجة");
	};
	const handleAddPost = (p) => {
		run(() => createPost(uid, p), "تم نشر المنشور");
	};
	const handleUpdatePost = (postId, patch) => run(() => updatePost(postId, patch), "تم تحديث المنشور");
	const handleAddStory = (s) => {
		run(() => createStory(uid, s), "تم نشر القصة");
	};
	const handleDeleteStory = (storyId) => run(() => deleteStory(storyId), "تم حذف القصة");
	const handleToggleLike = (postId) => {
		const post = data.posts.find((p) => p.id === postId);
		if (!post) return;
		setData((d) => ({
			...d,
			posts: d.posts.map((p) => p.id === postId ? {
				...p,
				is_liked: !p.is_liked,
				likes_count: p.likes_count + (p.is_liked ? -1 : 1)
			} : p)
		}));
		setLike(uid, postId, !post.is_liked).catch((e) => {
			notify(e.message, false);
			refresh();
		});
	};
	const handleAddComment = (postId, c) => {
		run(() => addComment(uid, postId, c.body));
	};
	const handleDeleteComment = (commentId) => run(() => deleteComment(commentId), "تم حذف التعليق");
	const handleDeletePost = (id) => {
		run(() => deletePost(id), "تم حذف المنشور");
	};
	const handleFollowUser = (targetId, visibility) => run(() => followUser(uid, targetId, visibility), visibility === "private" ? "تم إرسال طلب المتابعة" : "تمت المتابعة");
	const handleUnfollowUser = (targetId) => run(() => unfollowUser(uid, targetId), "تم إلغاء المتابعة");
	const handleCancelFollowRequest = (targetId) => run(() => cancelFollowRequest(uid, targetId), "تم إلغاء طلب المتابعة");
	const handleRespondFollowRequest = (requestId, accept) => run(() => respondFollowRequest(requestId, accept), accept ? "تم قبول طلب المتابعة" : "تم رفض الطلب");
	const handleStartChat = (userId) => {
		setChatPeerId(userId);
		setActiveSection("messages");
	};
	const handlePullRefresh = (0, import_react.useCallback)(async () => {
		await Promise.all([refresh(), refreshProfile()]);
	}, [refresh, refreshProfile]);
	const handleScheduleLive = (l) => run(() => createLive(uid, l), "تمت جدولة الحصة");
	const handleLiveStatus = (id, status) => run(() => setLiveStatus(id, status));
	const handleSendMessage = (m) => {
		run(() => sendMessage(uid, m));
	};
	const handleMarkNotificationRead = (id) => {
		setData((d) => ({
			...d,
			notifications: d.notifications.map((n) => n.id === id ? {
				...n,
				read: true
			} : n)
		}));
		markNotificationRead(id);
	};
	const handleMarkAllNotificationsRead = () => {
		setData((d) => ({
			...d,
			notifications: d.notifications.map((n) => ({
				...n,
				read: true
			}))
		}));
		markAllNotificationsRead(uid);
	};
	const handleResolveReport = (id) => {
		run(() => setReportStatus(id, "resolved"), "تمت معالجة البلاغ");
	};
	const handleDismissReport = (id) => {
		run(() => setReportStatus(id, "dismissed"), "تم تجاهل البلاغ");
	};
	const handleCreateReport = async (r) => {
		if (!reportTarget) return;
		if (await run(() => createReport(uid, {
			target_type: reportTarget.type === "user" ? "profile" : reportTarget.type,
			target_id: reportTarget.id,
			reason: r.reason,
			details: r.details,
			snapshot: reportTarget.snapshot
		}), "شكراً لك، تم إرسال البلاغ للإدارة")) setReportTarget(null);
	};
	const handleSaveProfile = (patch) => run(async () => {
		await updateProfile(uid, patch);
		await refreshProfile();
	}, "تم حفظ ملفك الشخصي");
	const askConfirm = (0, import_react.useCallback)((message, onConfirm) => {
		setConfirmState({
			message,
			onConfirm
		});
	}, []);
	const handleDelete = (table, label) => (id) => {
		askConfirm(`حذف ${label} نهائياً؟`, () => {
			run(() => deleteRow(table, id), `تم حذف ${label}`);
		});
	};
	const handleLeaveClass = (classId) => {
		askConfirm("هل تريد مغادرة هذا الصف؟", () => {
			run(() => leaveClass(uid, classId), "تمت مغادرة الصف");
		});
	};
	const handleRemoveMember = (classId, userId) => {
		askConfirm("إزالة هذا العضو من الصف؟", () => {
			run(() => removeMember(classId, userId), "تمت إزالة العضو");
		});
	};
	const handleArchiveClass = (classId, archived) => {
		run(() => archiveClass(classId, archived), archived ? "تمت أرشفة الصف" : "تم إلغاء الأرشفة");
	};
	const handleMarkDmRead = (ids) => {
		if (!ids.length) return;
		setData((d) => ({
			...d,
			messages: d.messages.map((m) => ids.includes(m.id) ? {
				...m,
				read_at: (/* @__PURE__ */ new Date()).toISOString()
			} : m)
		}));
		markDmRead(ids);
	};
	const handleSetRole = (id, role) => run(() => setUserRole(id, role), "تم تغيير الدور");
	const handleSetSuspended = (id, v) => run(() => setSuspended(id, v), v ? "تم إيقاف الحساب" : "تم إلغاء الإيقاف");
	const handleSignOut = async () => {
		if (profileRef.current?.id) await updateChatPresence(profileRef.current.id, {
			is_online: false,
			typing_to: ""
		});
		await signOut(auth);
		setActiveSection("home");
	};
	const handleDeleteAccount = async () => {
		await deleteOwnAccount();
		await signOut(auth).catch(() => {});
		setActiveSection("home");
		notify("تم حذف حسابك وجميع بياناتك نهائياً");
	};
	if (typeof window !== "undefined" && (window.location.pathname === "/privacy" || window.location.pathname === "/terms")) {
		const publicTab = window.location.pathname === "/terms" ? "terms" : "privacy";
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "min-h-[100dvh] bg-slate-50 p-4 sm:p-8 font-['Cairo',sans-serif]",
			dir: "rtl",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-w-3xl mx-auto bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-5 shadow-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-3 border-b border-slate-100 pb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "text-xl font-black text-slate-900",
						children: ["NEMVIA — ", publicTab === "privacy" ? "سياسة الخصوصية" : "شروط الاستخدام"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-slate-500",
						children: "منصة نيمفيا التعليمية والمجتمع الأكاديمي"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "px-4 py-2 rounded-xl bg-[#1677c7] text-white text-xs font-bold",
						children: "العودة للمنصة"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LegalContent, { tab: publicTab })]
			})
		});
	}
	if (guardianRouteCode) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-[100dvh] bg-slate-100",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GuardianPortalModal, {
			initialCode: guardianRouteCode,
			onClose: () => {
				setGuardianRouteCode("");
				const params = new URLSearchParams(window.location.search);
				params.delete("guardian");
				const qs = params.toString();
				window.history.replaceState(null, "", `${window.location.pathname}${qs ? `?${qs}` : ""}${window.location.hash}`);
			}
		})
	});
	if (certRouteCode) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-[100dvh] bg-slate-100",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CertificateVerifyModal, {
			initialCode: certRouteCode,
			onClose: () => {
				setCertRouteCode("");
				const params = new URLSearchParams(window.location.search);
				params.delete("cert");
				const qs = params.toString();
				window.history.replaceState(null, "", `${window.location.pathname}${qs ? `?${qs}` : ""}${window.location.hash}`);
			}
		})
	});
	if (!isNativeApp() && typeof window !== "undefined" && new URLSearchParams(window.location.search).get("mobile_auth") === "1") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthScreen, {});
	if (!authReady) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-[100dvh] flex items-center justify-center bg-slate-50",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-8 h-8 animate-spin text-[#1677c7]" })
	});
	if (!firebaseUser) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthScreen, {});
	if (!firebaseUser.emailVerified) {
		const checkVerified = async () => {
			setVerifyBusy(true);
			setVerifyNotice(null);
			try {
				await firebaseUser.reload();
				await firebaseUser.getIdToken(true);
				if (auth.currentUser?.emailVerified) {
					setFirebaseUser(auth.currentUser);
					setVerifyTick((v) => v + 1);
				} else setVerifyNotice("لم يتم تأكيد البريد الإلكتروني بعد. افتح رسالة التفعيل في بريدك واضغط على الرابط ثم أعد المحاولة.");
			} catch (err) {
				setVerifyNotice(err?.message || "تعذّر التحقق من حالة التفعيل الآن.");
			} finally {
				setVerifyBusy(false);
			}
		};
		const resendVerification = async () => {
			setVerifyBusy(true);
			setVerifyNotice(null);
			try {
				await sendEmailVerification(firebaseUser);
				setVerifyNotice("تم إرسال رابط التفعيل مجدداً. راجع صندوق الوارد أو الرسائل غير المرغوب فيها (Spam).");
			} catch (err) {
				setVerifyNotice(err?.message || "تعذّر إعادة إرسال الرابط، انتظر لحظات وحاول مجدداً.");
			} finally {
				setVerifyBusy(false);
			}
		};
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "min-h-[100dvh] flex items-center justify-center p-6 bg-slate-50 font-['Cairo',sans-serif]",
			dir: "rtl",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-w-md w-full bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 text-center space-y-4 shadow-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-12 h-12 mx-auto rounded-2xl bg-sky-50 text-[#1677c7] border border-sky-200 flex items-center justify-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MailCheck, { className: "w-6 h-6" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-lg font-black text-slate-900",
							children: "تأكيد البريد الإلكتروني"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-slate-600 leading-relaxed",
							children: [
								"لحماية حسابك وبياناتك، أرسلنا رابط تفعيل إلى",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono font-bold text-slate-900",
									dir: "ltr",
									children: firebaseUser.email
								}),
								". افتح الرابط ثم اضغط «تم التفعيل — متابعة»."
							]
						})]
					}),
					verifyNotice && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-bold text-[#1677c7] bg-sky-50 border border-sky-200 rounded-xl p-3",
						children: verifyNotice
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2 pt-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								disabled: verifyBusy,
								onClick: checkVerified,
								className: "w-full min-h-[44px] py-2.5 bg-[#1677c7] hover:bg-[#125fa0] disabled:opacity-60 text-white rounded-xl font-bold text-xs cursor-pointer",
								children: verifyBusy ? "جاري التحقق..." : "تم التفعيل — متابعة الدخول"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								disabled: verifyBusy,
								onClick: resendVerification,
								className: "w-full min-h-[44px] py-2.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-60 text-slate-800 rounded-xl font-bold text-xs cursor-pointer",
								children: "إعادة إرسال رابط التفعيل"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: handleSignOut,
								className: "w-full py-2 text-xs font-bold text-slate-500 hover:text-rose-600 cursor-pointer",
								children: "تسجيل الخروج / تغيير الحساب"
							})
						]
					})
				]
			})
		});
	}
	if (profileError) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-[100dvh] flex flex-col items-center justify-center gap-4 p-6 text-center bg-slate-50",
		dir: "rtl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-10 h-10 text-rose-500" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-bold text-slate-800 max-w-md",
				children: "تعذّر تحميل بيانات حسابك من الخادم."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-slate-500 max-w-md break-words",
				dir: "auto",
				children: profileError
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => firebaseUser?.uid && void loadUserSession(firebaseUser.uid),
					className: "px-5 py-2.5 bg-[#1677c7] text-white rounded-xl font-bold text-sm cursor-pointer",
					children: "إعادة المحاولة"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: handleSignOut,
					className: "px-5 py-2.5 bg-slate-200 text-slate-800 rounded-xl font-bold text-sm cursor-pointer",
					children: "تسجيل الخروج"
				})]
			})
		]
	});
	if (!profile || loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-[100dvh] flex items-center justify-center bg-slate-50",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-8 h-8 animate-spin text-[#1677c7]" })
	});
	if (profile.is_suspended) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-[100dvh] flex flex-col items-center justify-center gap-4 p-6 text-center bg-slate-50",
		dir: "rtl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "w-12 h-12 text-rose-500" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-lg font-black text-slate-900",
				children: "تم إيقاف حسابك"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-slate-600 max-w-sm",
				children: "خالفت شروط الاستخدام أو صدر بحقك بلاغ. إن كنت تعتقد أن هذا خطأ تواصل مع إدارة المنصة."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: handleSignOut,
				className: "px-5 py-2.5 bg-[#1677c7] text-white rounded-xl font-bold text-sm cursor-pointer",
				children: "تسجيل الخروج"
			})
		]
	});
	const role = profile.role;
	const section = activeSection === "admin" && role !== "admin" ? "home" : activeSection;
	const unreadMessages = data.messages.filter((m) => !m.channel_id && m.recipient_id === uid && !m.read_at).length;
	const myPending = role === "student" ? data.assignments.filter((a) => !data.submissions.some((s) => s.assignment_id === a.id && s.student_id === uid)).length : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		dir: appDir,
		className: "min-h-[100dvh] bg-[#f8fafc] text-slate-800 flex flex-col font-['Cairo',sans-serif] selection:bg-[#1677c7]/20 selection:text-[#0f233a]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppHeader, {
				currentProfile: profile,
				activeSection: section,
				currentRole: role,
				notifications: data.notifications,
				unreadMessagesCount: unreadMessages,
				pendingAssignmentsCount: myPending,
				onMarkNotificationRead: handleMarkNotificationRead,
				onMarkAllNotificationsRead: handleMarkAllNotificationsRead,
				onSelectSection: setActiveSection,
				onOpenSearch: () => setSearchOpen(true),
				onOpenHub: () => setHubOpen(true)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 flex max-w-7xl w-full mx-auto",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "hidden lg:block",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppSidebar, {
						activeSection: section,
						onSelectSection: setActiveSection,
						onOpenHub: () => setHubOpen(true),
						currentRole: role,
						currentProfile: profile
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "flex-1 p-3 sm:p-5 lg:p-6 min-w-0 pb-24 md:pb-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PullToRefresh, {
						enabled: [
							"home",
							"community",
							"classes",
							"schools",
							"ministries",
							"courses",
							"assignments",
							"calendar",
							"grades"
						].includes(section),
						onRefresh: handlePullRefresh,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorBoundary, {
							resetKey: section,
							onGoHome: () => setActiveSection("home"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react.Suspense, {
								fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "py-16 flex items-center justify-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-7 h-7 animate-spin text-[#1677c7]" })
								}),
								children: [
									section === "home" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HomeView, {
										currentProfile: profile,
										classes: data.classes,
										schools: data.schools,
										ministries: data.ministries,
										assignments: data.assignments,
										quizzes: data.quizzes,
										liveSessions: data.liveSessions,
										posts: data.posts,
										onNavigate: setActiveSection
									}),
									[
										"classes",
										"schools",
										"ministries"
									].includes(section) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClassesView, {
										currentRole: role,
										currentUserId: uid,
										currentUserName: profile.display_name,
										classes: data.classes,
										schools: data.schools,
										ministries: data.ministries,
										quizzes: data.quizzes,
										assignments: data.assignments,
										messages: data.messages,
										myOrgIds: data.myOrgIds,
										myClassIds: data.myClassIds,
										orgMembers: data.orgMembers,
										initialTab: section === "schools" ? "schools" : section === "ministries" ? "ministries" : "classes",
										members: data.classMembers,
										contacts: data.contacts,
										currentUserPoints: profile.points,
										currentUserStreak: profile.streakDays,
										onUpload: upload,
										onAddClass: handleAddClass,
										onJoinClass: handleJoinClass,
										onLeaveClass: handleLeaveClass,
										onDeleteClass: handleDelete("classes", "الصف"),
										onArchiveClass: handleArchiveClass,
										onRemoveMember: handleRemoveMember,
										onCreateMinistry: handleCreateMinistry,
										onCreateSchool: handleCreateSchool,
										onLinkSchoolToMinistry: handleLinkSchoolMinistry,
										onLinkClassToSchool: handleLinkClassSchool,
										onSendDirective: handleSendDirective,
										onRemoveOrgMember: handleRemoveOrgMember,
										onLeaveOrg: handleLeaveOrg,
										onDeleteOrg: handleDeleteOrg
									}),
									section === "courses" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CoursesView, {
										currentRole: role,
										currentUserId: uid,
										currentUserName: profile.display_name,
										courses: data.courses,
										lessons: data.lessons,
										quizzes: data.quizzes,
										classes: data.classes,
										schools: data.schools,
										ministries: data.ministries,
										assignments: data.assignments,
										submissions: data.submissions,
										onAddQuiz: handleAddQuiz,
										onAddLesson: handleAddLesson,
										onSubmitQuiz: handleSubmitQuiz,
										onGradeQuizAttempt: handleGradeQuizAttempt,
										onRewardPoints: handleRewardPoints,
										onUpload: upload,
										onDeleteLesson: handleDelete("lessons", "الدرس"),
										onDeleteQuiz: handleDelete("quizzes", "الاختبار")
									}),
									section === "ai" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AIStudioView, {
										currentProfile: profile,
										lessons: data.lessons,
										quizzes: data.quizzes,
										onRewardXP: handleRewardPoints
									}),
									[
										"tools",
										"flashcards",
										"pomodoro",
										"grapher",
										"certificate",
										"badges"
									].includes(section) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudyToolsView, {
										currentProfile: profile,
										onRewardXP: handleRewardPoints,
										initialTab: section === "tools" ? "flashcards" : section
									}),
									section === "assignments" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AssignmentsView, {
										currentRole: role,
										currentUserId: uid,
										currentUserName: profile.display_name,
										assignments: data.assignments,
										submissions: data.submissions,
										classes: data.classes,
										onSubmitAssignment: handleSubmitAssignment,
										onGradeSubmission: handleGradeSubmission,
										onCreateAssignment: handleCreateAssignment,
										onUpload: upload,
										onDeleteAssignment: handleDelete("assignments", "الواجب")
									}),
									section === "community" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommunityView, {
										currentRole: role,
										currentUserId: uid,
										currentUserName: profile.display_name,
										currentUserAvatar: profile.avatar_url,
										posts: data.posts,
										stories: data.stories,
										contacts: data.contacts,
										followingIds: data.followingIds,
										followerIds: data.followerIds,
										followRequests: data.followRequests,
										openReportsCount: data.reports.length,
										onAddPost: handleAddPost,
										onUpdatePost: handleUpdatePost,
										onDeletePost: handleDeletePost,
										onAddStory: handleAddStory,
										onDeleteStory: handleDeleteStory,
										onToggleLike: handleToggleLike,
										onAddComment: handleAddComment,
										onDeleteComment: handleDeleteComment,
										onFollowUser: handleFollowUser,
										onUnfollowUser: handleUnfollowUser,
										onCancelFollowRequest: handleCancelFollowRequest,
										onRespondFollowRequest: handleRespondFollowRequest,
										onStartChat: handleStartChat,
										onNavigate: setActiveSection,
										onRefresh: handlePullRefresh,
										onUpload: upload,
										onReport: (t) => setReportTarget(t)
									}),
									section === "live" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveClassroomView, {
										currentRole: role,
										currentUserId: uid,
										currentUserName: profile.display_name,
										sessions: data.liveSessions,
										classes: data.classes,
										classMembers: data.classMembers,
										onScheduleSession: handleScheduleLive,
										onSetStatus: handleLiveStatus
									}),
									section === "calendar" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarView, {
										currentRole: role,
										currentUserId: uid,
										assignments: data.assignments,
										submissions: data.submissions,
										liveSessions: data.liveSessions,
										onNavigate: setActiveSection
									}),
									section === "grades" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GradebookView, {
										currentRole: role,
										currentUserId: uid,
										currentUserName: profile.display_name,
										classes: data.classes,
										classMembers: data.classMembers,
										quizzes: data.quizzes,
										assignments: data.assignments,
										submissions: data.submissions,
										onNavigate: setActiveSection
									}),
									section === "messages" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessagesView, {
										currentUserId: uid,
										currentUserName: profile.display_name,
										currentRole: role,
										messages: data.messages,
										groups: data.classes,
										contacts: data.contacts,
										onSendMessage: handleSendMessage,
										onCreateGroup: (c) => handleAddClass(c),
										onSearchContacts: (q) => searchContacts(uid, q),
										onUpload: upload,
										onMarkRead: handleMarkDmRead,
										initialPeerId: chatPeerId,
										onClearInitialPeer: () => setChatPeerId(null),
										onStartCall: (calleeId, calleeName, callType) => setOutgoingCall({
											calleeId,
											calleeName,
											callType
										}),
										onReport: (t) => setReportTarget(t)
									}),
									section === "admin" && role === "admin" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminView, {
										stats,
										reports: data.reports,
										currentUserId: uid,
										onResolveReport: handleResolveReport,
										onDismissReport: handleDismissReport,
										onListUsers: listUsers,
										onSetRole: handleSetRole,
										onSetSuspended: handleSetSuspended
									}),
									section === "profile" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileView, {
										profile,
										email: firebaseUser.email || "",
										classesCount: data.classes.length,
										quizzes: data.quizzes,
										assignments: data.assignments,
										submissions: data.submissions,
										onSave: handleSaveProfile,
										onUpload: upload,
										onSignOut: handleSignOut,
										onDeleteAccount: handleDeleteAccount
									}),
									section === "settings" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsView, {
										currentProfile: profile,
										onNotify: notify
									}),
									section === "legal" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LegalView, {})
								]
							})
						})
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 min-h-14 pb-[env(safe-area-inset-bottom)] px-2 grid grid-cols-4 items-center",
				children: [
					{
						id: "home",
						label: ui.mobile.home,
						icon: House
					},
					{
						id: "courses",
						label: settings.lang === "en" ? "Study" : settings.lang === "fr" ? "Étude" : "الدراسة",
						icon: BookOpen
					},
					{
						id: "community",
						label: ui.mobile.community,
						icon: Users
					},
					{
						id: "messages",
						label: ui.mobile.messages,
						icon: MessageSquare,
						badge: unreadMessages
					}
				].map((item) => {
					const Icon = item.icon;
					const isActive = section === item.id;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setActiveSection(item.id),
						className: `relative min-h-[44px] flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold transition-colors cursor-pointer ${isActive ? "text-[#1677c7]" : "text-slate-500"}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "w-5 h-5" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.label }),
							!!item.badge && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "absolute top-1 right-4 min-w-4 h-4 px-1 rounded-full bg-rose-600 text-white text-[9px] flex items-center justify-center tabular-nums",
								children: item.badge
							})
						]
					}, item.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HubDrawerModal, {
				open: hubOpen,
				activeSection: section,
				currentProfile: profile,
				currentRole: role,
				unreadMessagesCount: unreadMessages,
				pendingAssignmentsCount: myPending,
				onSelectSection: setActiveSection,
				onSignOut: handleSignOut,
				onClose: () => setHubOpen(false)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlobalSearchModal, {
				open: searchOpen,
				data,
				onClose: () => setSearchOpen(false),
				onNavigate: setActiveSection
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportModal, {
				target: reportTarget,
				onClose: () => setReportTarget(null),
				onSubmit: handleCreateReport
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppInstallPromptBanner, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OfflineIndicator, {}),
			liveAlert && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				onClick: () => {
					if (liveAlert.targetSection) setActiveSection(liveAlert.targetSection);
					setLiveAlert(null);
				},
				className: "fixed top-20 left-4 right-4 sm:right-auto sm:w-96 z-[65] bg-white border border-sky-200 rounded-2xl shadow-xl p-4 flex items-start justify-between gap-3 cursor-pointer hover:border-[#1677c7] transition-all",
				dir: "rtl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-9 h-9 rounded-xl bg-sky-50 text-[#1677c7] flex items-center justify-center shrink-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "w-4 h-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 min-w-0 space-y-0.5 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-black text-slate-900 truncate",
								children: liveAlert.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-slate-600 line-clamp-2 leading-relaxed",
								children: liveAlert.body
							}),
							liveAlert.targetSection && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "inline-block text-[11px] font-bold text-[#1677c7] pt-0.5",
								children: "انقر للانتقال الآن ←"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: (e) => {
							e.stopPropagation();
							setLiveAlert(null);
						},
						className: "p-1 text-slate-400 hover:text-slate-700 cursor-pointer shrink-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
					})
				]
			}),
			confirmState && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-[75] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4",
				onClick: () => setConfirmState(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-200",
					onClick: (e) => e.stopPropagation(),
					dir: appDir,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-black text-base text-slate-900",
							children: "تأكيد الإجراء"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-slate-600 leading-relaxed",
							children: confirmState.message
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-end gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setConfirmState(null),
								className: "px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer",
								children: "إلغاء"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => {
									const fn = confirmState.onConfirm;
									setConfirmState(null);
									fn();
								},
								className: "px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black cursor-pointer",
								children: "تأكيد"
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CallOverlay, {
				currentUserId: uid,
				currentUserName: profile.display_name,
				outgoingRequest: outgoingCall,
				incomingCall,
				onClearOutgoing: () => setOutgoingCall(null),
				onClearIncoming: () => setIncomingCall(null),
				onNotify: notify
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OnboardingModal, {
				open: onboardingOpen,
				userName: profile.display_name,
				onNavigate: setActiveSection,
				onClose: () => {
					setOnboardingOpen(false);
					try {
						localStorage.setItem(`nemvia-onboarding-v1-${profile.id}`, "1");
					} catch {}
				}
			}),
			toast && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-[60] px-4 py-2.5 rounded-xl shadow-lg text-xs font-bold flex items-center gap-2 text-white ${toast.ok ? "bg-emerald-600" : "bg-rose-600"}`,
				children: [toast.ok ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-4 h-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: toast.msg })]
			})
		]
	});
}
// src/main.tsx
registerSW({ immediate: true });
(0, import_client.createRoot)(document.getElementById("root")).render(/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorBoundary, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(App, {}) }));
export { setDesktopNotifEnabled as A, shareAppLink as B, uploadQuizAudioFeedback as C, isSoundEnabled as D, isDesktopNotifEnabled as E, getRemoteAppBaseUrl as F, WebPlugin as H, isNativeApp as I, openExternalUrl as L, ACCENT_OPTIONS as M, useAppSettings as N, playNotificationChime as O, getApiBaseUrl as P, resolveApiUrl as R, updateClassResource as S, auth as T, buildRequestInit as U, Encoding as V, saveQuestionsToCloudBank as _, createClassResource as a, subscribePolls as b, deleteCloudQuestionBankItem as c, fetchVerifiedCertificate as d, issueVerifiedCertificate as f, revokeGuardianReport as g, publishGuardianReport as h, castPollVote as i, setSoundEnabled as j, requestBrowserNotificationPermission as k, deletePoll as l, listLiveAttendance as m, GuardianPortalModal as n, createPoll as o, listCloudQuestionBank as p, buildQuizPerformanceReport as r, deleteClassResource as s, CertificateVerifyModal as t, fetchMyGuardianReport as u, subscribeChatPresence as v, upsertLiveAttendance as w, updateChatPresence as x, subscribeClassResources as y, saveOrShareBlobFile as z };
