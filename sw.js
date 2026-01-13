self.addEventListener("install", event => {
  event.waitUntil(
    caches.open("sleep-lecture").then(cache => {
      return cache.addAll([
        "./",
        "./index.html",
        "./style.css",
        "./app.js"
      ]);
    })
  );
});
