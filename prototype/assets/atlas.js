// Theme toggle + đồng bộ theme vào iframe archify (?embed=1&theme=...)
(function () {
  var KEY = "atlas-theme";
  var root = document.documentElement;

  function stored() { try { return localStorage.getItem(KEY); } catch (_) { return null; } }
  function save(v) { try { localStorage.setItem(KEY, v); } catch (_) {} }
  function current() {
    var t = root.getAttribute("data-theme");
    if (t) return t;
    return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function syncFrames() {
    var theme = current();
    document.querySelectorAll("iframe[data-archify]").forEach(function (f) {
      var src = f.getAttribute("data-archify") + "?embed=1&theme=" + theme;
      if (f.getAttribute("src") !== src) f.setAttribute("src", src);
    });
    var btn = document.querySelector("[data-theme-toggle]");
    if (btn) {
      btn.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
      btn.querySelector("span").textContent = theme === "dark" ? "Bản đồ ngày" : "Bản đồ đêm";
    }
  }

  var s = stored();
  if (s === "light" || s === "dark") root.setAttribute("data-theme", s);

  document.addEventListener("DOMContentLoaded", function () {
    syncFrames();
    var btn = document.querySelector("[data-theme-toggle]");
    if (btn) btn.addEventListener("click", function () {
      var next = current() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      save(next);
      syncFrames();
    });
    matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function () {
      if (!stored()) syncFrames();
    });
  });
})();
