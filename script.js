(() => {
  const slides = Array.from(document.querySelectorAll(".slide"));
  const prev = document.getElementById("prevBtn");
  const next = document.getElementById("nextBtn");
  const counter = document.getElementById("slideCounter");
  const fill = document.getElementById("progressFill");
  const present = document.getElementById("presentBtn");
  let current = 0;
  const pad = n => String(n).padStart(2, "0");
  function showSlide(index, updateHash = true) {
    current = Math.max(0, Math.min(slides.length - 1, index));
    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === current);
      slide.setAttribute("aria-hidden", i === current ? "false" : "true");
    });
    counter.textContent = pad(current + 1) + " / " + pad(slides.length);
    fill.style.width = ((current + 1) / slides.length * 100) + "%";
    prev.disabled = current === 0;
    next.disabled = current === slides.length - 1;
    if (updateHash) history.replaceState(null, "", "#slide-" + (current + 1));
    document.title = slides[current].getAttribute("aria-label") + " — SmartyBiz";
  }
  prev.addEventListener("click", () => showSlide(current - 1));
  next.addEventListener("click", () => showSlide(current + 1));
  present.addEventListener("click", () => {
    document.body.classList.toggle("presentation-mode");
    const on = document.body.classList.contains("presentation-mode");
    present.innerHTML = on ? 'Exit <span>↙</span>' : 'Present <span>↗</span>';
    if (on && document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else if (!on && document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
  });
  document.addEventListener("keydown", event => {
    if (["ArrowRight", "PageDown", " "].includes(event.key)) {
      if (event.target.matches("input, textarea, button, a")) return;
      event.preventDefault(); showSlide(current + 1);
    }
    if (["ArrowLeft", "PageUp"].includes(event.key)) {
      if (event.target.matches("input, textarea, button, a")) return;
      event.preventDefault(); showSlide(current - 1);
    }
    if (event.key === "Home") showSlide(0);
    if (event.key === "End") showSlide(slides.length - 1);
    if (event.key === "Escape") {
      document.body.classList.remove("presentation-mode");
      present.innerHTML = 'Present <span>↗</span>';
    }
  });
  let touchStart = null;
  document.addEventListener("touchstart", event => { touchStart = event.changedTouches[0].clientX; }, {passive:true});
  document.addEventListener("touchend", event => {
    if (touchStart === null) return;
    const delta = event.changedTouches[0].clientX - touchStart;
    if (Math.abs(delta) > 70) showSlide(current + (delta < 0 ? 1 : -1));
    touchStart = null;
  }, {passive:true});
  const initial = Number((location.hash.match(/slide-(\d+)/) || [])[1]);
  showSlide(Number.isFinite(initial) && initial > 0 ? initial - 1 : 0, false);
})();