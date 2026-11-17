const C='matprotokoll-v8', R='matprotokoll-ocr-v1';
const FILES=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png'];
const CDN=['cdn.jsdelivr.net','tessdata.projectnaptha.com','unpkg.com'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(FILES)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C&&x!==R).map(x=>caches.delete(x)))))});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const u=new URL(e.request.url);
  if(CDN.includes(u.hostname)){
    e.respondWith(caches.open(R).then(async c=>{
      const hit=await c.match(e.request);if(hit)return hit;
      const res=await fetch(e.request);
      if(res&&(res.ok||res.type==='opaque'))c.put(e.request,res.clone());
      return res;
    }));
    return;
  }
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
});
