/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  let registry = {};

  // Used for `eval` and `importScripts` where we can't get script URL by other means.
  // In both cases, it's safe to use a global var because those functions are synchronous.
  let nextDefineUri;

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return registry[uri] || (
      
        new Promise(resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = uri;
            script.onload = resolve;
            document.head.appendChild(script);
          } else {
            nextDefineUri = uri;
            importScripts(uri);
            resolve();
          }
        })
      
      .then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  self.define = (depsNames, factory) => {
    const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
    if (registry[uri]) {
      // Module is already loading or loaded.
      return;
    }
    let exports = {};
    const require = depUri => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require
    };
    registry[uri] = Promise.all(depsNames.map(
      depName => specialDeps[depName] || require(depName)
    )).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}
define(['./workbox-afac4cd2'], (function (workbox) { 'use strict';

  self.skipWaiting();
  workbox.clientsClaim();
  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */
  workbox.precacheAndRoute([{
    "url": "pwa-maskable-512x512.png",
    "revision": "0a792a2bec7eb84de1ca4837ae206b2f"
  }, {
    "url": "pwa-icon.svg",
    "revision": "0369ad3830530df32f5fdc4cf3b9ab11"
  }, {
    "url": "index.html",
    "revision": "47b965d7ba93f22f4cabdd65f817e595"
  }, {
    "url": "icon-512.png",
    "revision": "0a792a2bec7eb84de1ca4837ae206b2f"
  }, {
    "url": "icon-192.png",
    "revision": "7d37abe057ae39319562e8443357c93e"
  }, {
    "url": "apple-touch-icon.png",
    "revision": "0ef766ff6f2d1b3b5a0262af1d00a802"
  }, {
    "url": "assets/workbox-window.prod.es5-Bd17z0YL.js",
    "revision": null
  }, {
    "url": "assets/web-xF4H7wHw.js",
    "revision": null
  }, {
    "url": "assets/web-YUy5tE9E.js",
    "revision": null
  }, {
    "url": "assets/web-KmuGquVs.js",
    "revision": null
  }, {
    "url": "assets/web-DJqX6VE1.js",
    "revision": null
  }, {
    "url": "assets/web-DDtt3CPU.js",
    "revision": null
  }, {
    "url": "assets/web-BP9LIdKe.js",
    "revision": null
  }, {
    "url": "assets/web-3PmeqBJ3.js",
    "revision": null
  }, {
    "url": "assets/rolldown-runtime-XKyaHtl9.js",
    "revision": null
  }, {
    "url": "assets/react-vendor-mhdx65Zr.js",
    "revision": null
  }, {
    "url": "assets/questionBank-CjRCzk5k.js",
    "revision": null
  }, {
    "url": "assets/index-MV8m9tYV.css",
    "revision": null
  }, {
    "url": "assets/index-CBoGF0ov.js",
    "revision": null
  }, {
    "url": "assets/icons-QIMNI0Ho.js",
    "revision": null
  }, {
    "url": "assets/firebase-Bj3jJbbP.js",
    "revision": null
  }, {
    "url": "assets/browser-J7lMOXco.js",
    "revision": null
  }, {
    "url": "assets/ai-CZkiOEQZ.js",
    "revision": null
  }, {
    "url": "assets/WhiteboardModal-_FLZu9T-.js",
    "revision": null
  }, {
    "url": "assets/StudyToolsView-5wmAA_Ag.js",
    "revision": null
  }, {
    "url": "assets/SettingsView-BiyCYyIa.js",
    "revision": null
  }, {
    "url": "assets/ProfileView-B-brC6cs.js",
    "revision": null
  }, {
    "url": "assets/PollCard-B2yCP9T3.js",
    "revision": null
  }, {
    "url": "assets/MessagesView-CljW7jEB.js",
    "revision": null
  }, {
    "url": "assets/LiveClassroomView-BFaSnxqS.js",
    "revision": null
  }, {
    "url": "assets/GradebookView-wdL9SQ6V.js",
    "revision": null
  }, {
    "url": "assets/CoursesView-uYrZ7y0Z.js",
    "revision": null
  }, {
    "url": "assets/CommunityView-q-pxs0SV.js",
    "revision": null
  }, {
    "url": "assets/ClassesView-C80K__ku.js",
    "revision": null
  }, {
    "url": "assets/CalendarView-BLvyJAv6.js",
    "revision": null
  }, {
    "url": "assets/AssignmentsView-CQhE9duG.js",
    "revision": null
  }, {
    "url": "assets/AdminView-DZBHzUVZ.js",
    "revision": null
  }, {
    "url": "assets/AIStudioView--Uw7VY2y.js",
    "revision": null
  }, {
    "url": "apple-touch-icon.png",
    "revision": "0ef766ff6f2d1b3b5a0262af1d00a802"
  }, {
    "url": "icon-192.png",
    "revision": "7d37abe057ae39319562e8443357c93e"
  }, {
    "url": "icon-512.png",
    "revision": "0a792a2bec7eb84de1ca4837ae206b2f"
  }, {
    "url": "pwa-icon.svg",
    "revision": "0369ad3830530df32f5fdc4cf3b9ab11"
  }, {
    "url": "pwa-maskable-512x512.png",
    "revision": "0a792a2bec7eb84de1ca4837ae206b2f"
  }, {
    "url": "manifest.webmanifest",
    "revision": "050dd9439bc2e459d5335d80ff52823c"
  }], {});
  workbox.cleanupOutdatedCaches();
  workbox.registerRoute(new workbox.NavigationRoute(workbox.createHandlerBoundToURL("index.html")));
  workbox.registerRoute(/^https:\/\/fonts\.googleapis\.com\/.*/i, new workbox.CacheFirst({
    "cacheName": "google-fonts-cache",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 10,
      maxAgeSeconds: 31536000
    }), new workbox.CacheableResponsePlugin({
      statuses: [0, 200]
    })]
  }), 'GET');
  workbox.registerRoute(/^https:\/\/fonts\.gstatic\.com\/.*/i, new workbox.CacheFirst({
    "cacheName": "gstatic-fonts-cache",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 10,
      maxAgeSeconds: 31536000
    }), new workbox.CacheableResponsePlugin({
      statuses: [0, 200]
    })]
  }), 'GET');

}));
