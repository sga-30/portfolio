(function () {
  // 1) EDIT THESE: your GitHub username and the repo name for each project.
  var GITHUB_USER = "sga-30";
  var REPOS = { "sibas": "sibas", "cafeteria-app": "cafeteria-app", "sante-lims": "sante-lims" };

  var toastEl = document.getElementById("toast"), timer;
  function toast(msg) {
    toastEl.textContent = msg; toastEl.classList.add("show");
    clearTimeout(timer); timer = setTimeout(function () { toastEl.classList.remove("show"); }, 2600);
  }

  // Source links: point to GitHub, or explain what is missing.
  document.querySelectorAll("a.repo").forEach(function (a) {
    if (GITHUB_USER === "sga-30") {
      a.addEventListener("click", function (e) { e.preventDefault(); toast("Set GITHUB_USER in script.js first"); });
    } else {
      a.href = "https://github.com/" + GITHUB_USER + "/" + REPOS[a.dataset.repo];
      a.target = "_blank"; a.rel = "noopener";
    }
  });

  // Copy email button.
  var copy = document.getElementById("copy");
  if (copy) copy.addEventListener("click", function () {
    var text = copy.dataset.copy;
    function ok() { toast("Email copied: " + text); }
    if (navigator.clipboard) { navigator.clipboard.writeText(text).then(ok, fallback); } else { fallback(); }
    function fallback() {
      var t = document.createElement("textarea"); t.value = text; document.body.appendChild(t);
      t.select(); try { document.execCommand("copy"); ok(); } catch (e) { toast(text); } t.remove();
    }
  });

  // Missing screenshot -> labelled placeholder box.
  document.querySelectorAll(".shot img").forEach(function (img) {
    function miss() { img.parentElement.classList.add("missing"); }
    img.addEventListener("error", miss);
    if (img.complete && !img.naturalWidth) miss();
  });

  // Scroll progress bar.
  var bar = document.getElementById("bar");
  addEventListener("scroll", function () {
    var h = document.documentElement;
    bar.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight || 1)) * 100 + "%";
  }, { passive: true });

  // Reveal on scroll, stamp slam, count-up numbers.
  var targets = document.querySelectorAll("main section, .item, .stamp");
  targets.forEach(function (el) { if (!el.classList.contains("stamp")) el.classList.add("reveal"); });
  document.querySelectorAll("[data-count]").forEach(function (el) { el.textContent = "0"; });
  function countUp(el) {
    var end = +el.dataset.count, n = 0;
    var t = setInterval(function () { el.textContent = ++n; if (n >= end) clearInterval(t); }, 350);
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      en.target.classList.add("in"); io.unobserve(en.target);
      en.target.querySelectorAll("[data-count]").forEach(countUp);
    });
  }, { threshold: 0.15 });
  targets.forEach(function (el) { io.observe(el); });

  // Highlight the nav link of the section on screen.
  var links = document.querySelectorAll("nav a[href^='index.html#'], nav a[href^='#']");
  var spy = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      links.forEach(function (l) { l.classList.toggle("on", l.getAttribute("href").split("#")[1] === en.target.id); });
    });
  }, { rootMargin: "-40% 0px -55% 0px" });
  document.querySelectorAll("main section[id]").forEach(function (s) { spy.observe(s); });
})();
