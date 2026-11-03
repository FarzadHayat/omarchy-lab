(function () {
  var themes = window.OMARCHY_THEMES;
  var KEY = "omarchy-lab-theme";
  var root = document.documentElement;
  var select = document.getElementById("theme");
  var toast = document.getElementById("toast");

  function apply(name) {
    var t = themes[name];
    if (!t) return;
    var s = root.style;
    s.setProperty("--bg", t.bg); s.setProperty("--bg2", t.bg2); s.setProperty("--bg3", t.bg3);
    s.setProperty("--fg", t.fg); s.setProperty("--fg2", t.fg2);
    s.setProperty("--accent", t.accent); s.setProperty("--red", t.red);
    root.dataset.mode = t.mode;
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", t.bg);
  }

  function label(name) {
    return name.replace(/-/g, " ");
  }

  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}
  var current = themes[saved] ? saved : "tokyo-night";

  Object.keys(themes).sort().forEach(function (name) {
    var opt = document.createElement("option");
    opt.value = name;
    opt.textContent = label(name);
    if (name === current) opt.selected = true;
    select.appendChild(opt);
  });

  select.addEventListener("change", function () {
    apply(select.value);
    try { localStorage.setItem(KEY, select.value); } catch (e) {}
    toast.textContent = "Theme set to " + label(select.value);
  });

  // Copy buttons on every install block.
  document.querySelectorAll(".install pre").forEach(function (pre) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "copy";
    btn.textContent = "Copy";
    var name = pre.closest(".win").querySelector("h3").textContent;
    btn.setAttribute("aria-label", "Copy install command for " + name);
    btn.addEventListener("click", function () {
      var text = pre.querySelector("code").textContent;
      var done = function () {
        btn.textContent = "Copied";
        btn.classList.add("ok");
        toast.textContent = "Copied install command for " + name;
        setTimeout(function () { btn.textContent = "Copy"; btn.classList.remove("ok"); }, 1800);
      };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(done, function () { fallback(text); done(); });
      } else { fallback(text); done(); }
    });
    pre.parentNode.insertBefore(btn, pre);
  });

  function fallback(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); } catch (e) {}
    document.body.removeChild(ta);
  }
})();
