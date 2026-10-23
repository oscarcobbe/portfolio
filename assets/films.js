// Film cards open one shared player; on /films the chips filter by business.
(() => {
  const cards = [...document.querySelectorAll(".fcard")];
  if (!cards.length) return;

  let dlg = document.getElementById("player");
  if (!dlg) {
    dlg = document.createElement("dialog");
    dlg.id = "player";
    dlg.className = "player";
    dlg.setAttribute("aria-label", "Film player");
    dlg.innerHTML = `
      <div class="pbox">
        <button type="button" class="pclose" aria-label="Close">×</button>
        <div class="pvid"><video controls playsinline preload="metadata"></video></div>
        <div class="pinfo">
          <div><h3></h3><p class="pdesc"></p><small class="pmeta"></small></div>
          <div class="pnav"><button type="button" class="pprev" aria-label="Previous film">←</button><button type="button" class="pnext" aria-label="Next film">→</button></div>
        </div>
      </div>`;
    document.body.appendChild(dlg);
  }
  const video = dlg.querySelector("video");
  let list = cards, at = 0;

  const visible = () => cards.filter((c) => c.offsetParent !== null);
  function show(i) {
    at = (i + list.length) % list.length;
    const c = list[at];
    dlg.classList.toggle("vert", c.classList.contains("v"));
    video.poster = c.dataset.poster;
    video.src = c.dataset.src;
    dlg.querySelector("h3").textContent = c.dataset.title;
    dlg.querySelector(".pdesc").textContent = c.dataset.desc;
    dlg.querySelector(".pmeta").textContent = c.dataset.meta;
    video.play().catch(() => {});
  }
  function close() { video.pause(); video.removeAttribute("src"); video.load(); dlg.close(); }

  cards.forEach((c) => c.addEventListener("click", () => {
    list = visible(); show(list.indexOf(c));
    if (!dlg.open) dlg.showModal();
  }));
  dlg.querySelector(".pclose").addEventListener("click", close);
  dlg.querySelector(".pprev").addEventListener("click", () => show(at - 1));
  dlg.querySelector(".pnext").addEventListener("click", () => show(at + 1));
  dlg.addEventListener("click", (e) => { if (e.target === dlg) close(); });
  dlg.addEventListener("cancel", (e) => { e.preventDefault(); close(); });
  dlg.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" && e.target.tagName !== "VIDEO") show(at + 1);
    if (e.key === "ArrowLeft" && e.target.tagName !== "VIDEO") show(at - 1);
  });

  // Filters, on the films page only.
  const chips = [...document.querySelectorAll(".chip[data-filter]")];
  function filter(f) {
    chips.forEach((c) => { const on = c.dataset.filter === f; c.classList.toggle("on", on); c.setAttribute("aria-pressed", on); });
    document.querySelectorAll(".fgroup[data-group]").forEach((g) => { g.hidden = f !== "all" && g.dataset.group !== f; });
  }
  chips.forEach((c) => c.addEventListener("click", () => { filter(c.dataset.filter); history.replaceState(null, "", c.dataset.filter === "all" ? location.pathname : "#" + c.dataset.filter); }));
  const start = location.hash.slice(1);
  if (chips.some((c) => c.dataset.filter === start)) filter(start); else if (chips.length) filter("all");
})();
