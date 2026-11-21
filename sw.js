// অফলাইনে অ্যাপ খুলতে সাহায্য করে + রোজকার করণীয়ের নোটিফিকেশন। নতুন সংস্করণ দিলে VERSION বদলান।
var VERSION = "sa-v2";
var CORE = ["./", "index.html", "config.js", "manifest.webmanifest",
  "logo-256.png", "icon-192.png", "icon-512.png"];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(VERSION).then(function (c) { return c.addAll(CORE); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== VERSION; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener("fetch", function (e) {
  var r = e.request;
  if (r.method !== "GET") return;
  var u = new URL(r.url);
  // Firestore/Auth-এর লাইভ রিকোয়েস্টে হাত দেব না
  if (/googleapis\.com$/.test(u.hostname) && u.hostname !== "fonts.googleapis.com") return;
  if (u.hostname.indexOf("firebaseapp.com") >= 0 || u.hostname.indexOf("firebaseio.com") >= 0) return;
  // আগে নেটওয়ার্ক, না পেলে ক্যাশ (যাতে নতুন আপডেট সাথে সাথে আসে)
  e.respondWith(fetch(r).then(function (res) {
    if (res && (res.ok || res.type === "opaque")) { var cp = res.clone(); caches.open(VERSION).then(function (c) { c.put(r, cp); }); }
    return res;
  }).catch(function () { return caches.match(r).then(function (m) { return m || caches.match("index.html"); }); }));
});

/* ---------- রোজকার করণীয়ের নোটিফিকেশন ---------- */
function idb() { return new Promise(function (res, rej) { var r = indexedDB.open("sa-notify", 1); r.onupgradeneeded = function () { r.result.createObjectStore("kv"); }; r.onsuccess = function () { res(r.result); }; r.onerror = function () { rej(r.error); }; }); }
function kvGet(k) { return idb().then(function (d) { return new Promise(function (res) { var q = d.transaction("kv").objectStore("kv").get(k); q.onsuccess = function () { res(q.result); }; q.onerror = function () { res(null); }; }); }).catch(function () { return null; }); }
function kvSet(k, v) { return idb().then(function (d) { return new Promise(function (res) { var t = d.transaction("kv", "readwrite"); t.objectStore("kv").put(v, k); t.oncomplete = res; t.onerror = res; }); }).catch(function () {}); }
function isoD(d) { var m = d.getMonth() + 1, x = d.getDate(); return d.getFullYear() + "-" + (m < 10 ? "0" : "") + m + "-" + (x < 10 ? "0" : "") + x; }
function bnN(n) { return String(n).replace(/\d/g, function (c) { return "০১২৩৪৫৬৭৮৯"[c]; }); }

function dailyTodo() {
  var now = new Date();
  if (now.getHours() < 6) return Promise.resolve();
  var day = isoD(now);
  return kvGet("notified").then(function (n) {
    if (n === day) return;
    return kvGet("forecast").then(function (fc) {
      var it = fc && fc.days && fc.days[day];
      if (!it || !it.length) return;
      return self.registration.showNotification("স্বদেশী এগ্রো · আজ " + bnN(it.length) + "টি করণীয়", {
        body: it.slice(0, 5).map(function (z) { return "• " + z.h; }).join("\n") + (it.length > 5 ? "\n…আরও " + bnN(it.length - 5) + "টি" : ""),
        icon: "logo-256.png", badge: "icon-32.png", tag: "sa-daily", data: { url: "./" }
      }).then(function () { return kvSet("notified", day); });
    });
  });
}
self.addEventListener("periodicsync", function (e) { if (e.tag === "daily-todo") e.waitUntil(dailyTodo()); });
self.addEventListener("notificationclick", function (e) {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (L) {
    for (var i = 0; i < L.length; i++) { if ("focus" in L[i]) return L[i].focus(); }
    return self.clients.openWindow(self.registration.scope);
  }));
});
