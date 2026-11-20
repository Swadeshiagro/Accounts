// অফলাইনে অ্যাপ খুলতে সাহায্য করে। নতুন সংস্করণ দিলে VERSION বদলান।
var VERSION = "sa-v1";
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
