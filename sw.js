
const CACHE_NAME = "fs-app-v1"

const ASSETS = [
"./",
"./index.html",
"./style.css",
"./js/app.js",
"./js/students.js",
"./js/sonderfahrten.js",
"./js/fahrten.js",
"./icons/icon-192.png",
"./icons/icon-512.png"
]

self.addEventListener("install", e => {

e.waitUntil(
caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
)

})

self.addEventListener("fetch", e => {

e.respondWith(
caches.match(e.request).then(r => r || fetch(e.request))
)

})
