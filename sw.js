const CACHE_NAME = "fs-app-cache-v4"

const ASSETS = [
"./",
"./index.html",
"./style.css",

"./js/app.js",
"./js/students.js",
"./js/sonderfahrten.js",
"./js/fahrten.js",
"./js/diagrammData.js",
"./js/backup.js",

"./icons/icon-192.png",
"./icons/icon-512.png"
]

/* =============================
INSTALL
============================= */

self.addEventListener("install", event => {

self.skipWaiting()

event.waitUntil(
caches.open(CACHE_NAME)
.then(cache => cache.addAll(ASSETS))
)

})

/* =============================
ACTIVATE
============================= */

self.addEventListener("activate", event => {

event.waitUntil(

caches.keys().then(keys => {

return Promise.all(

keys.map(key => {

if(key !== CACHE_NAME){

return caches.delete(key)

}

})

)

})

)

self.clients.claim()

})

/* =============================
FETCH
============================= */

self.addEventListener("fetch", event => {

event.respondWith(

caches.match(event.request)
.then(response => {

if(response){
return response
}

return fetch(event.request)
.then(networkResponse => {

if(!networkResponse || networkResponse.status !== 200){
return networkResponse
}

let responseClone = networkResponse.clone()

caches.open(CACHE_NAME)
.then(cache => cache.put(event.request, responseClone))

return networkResponse

})

})

)

})
