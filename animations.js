(() => {
  const root = document.documentElement;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!("IntersectionObserver" in window)) return;

  root.classList.add("motion-ready");
  if (reducedMotion) {
    root.classList.add("motion-reduced");
  }

  const progress = document.createElement("div");
  progress.className = "scroll-progress";
  progress.setAttribute("aria-hidden", "true");
  document.body.append(progress);

  let progressFrame = 0;
  const updateProgress = () => {
    if (progressFrame) return;
    progressFrame = window.requestAnimationFrame(() => {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      const amount = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
      progress.style.transform = `scaleX(${Math.min(1, Math.max(0, amount))})`;
      progressFrame = 0;
    });
  };

  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
  updateProgress();

  const marqueeSources = Array.from(document.querySelectorAll(".showcase__chip"));
  const marqueeHost = document.querySelector(".howto__cta");
  if (marqueeSources.length && marqueeHost) {
    const marquee = document.createElement("div");
    marquee.className = "howto__marquee";
    marquee.setAttribute("aria-hidden", "true");

    const track = document.createElement("div");
    track.className = "howto__marquee-track";
    const labels = marqueeSources.map((source) => source.textContent.trim());

    labels.concat(labels).forEach((label, index) => {
      const item = document.createElement("span");
      item.className = "howto__marquee-item";
      const icon = marqueeSources[index % marqueeSources.length].querySelector("svg");
      const text = document.createElement("span");
      text.textContent = label;
      if (icon) item.append(icon.cloneNode(true));
      item.append(text);
      track.append(item);
    });

    marquee.append(track);
    marqueeHost.prepend(marquee);
    marqueeSources.forEach((source) => source.remove());
  }

  if (reducedMotion) return;

  const shots = Array.from(document.querySelectorAll(".showcase__shot"));
  if (shots.length) {
    const animateShot = (shot) => {
      if (!shot.classList.contains("is-entered")) return;
      shot.style.setProperty("--shot-entry-x", shots.indexOf(shot) % 2 ? "24px" : "-24px");
      shot.classList.remove("is-entering");
      void shot.offsetWidth;
      shot.classList.add("is-entering");
    };

    const shotObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const shot = entry.target;
          shot.classList.add("is-entered");
          if (shot.classList.contains("is-active")) animateShot(shot);
          observer.unobserve(shot);
        });
      },
      { threshold: 0.15 }
    );
    shots.forEach((shot) => shotObserver.observe(shot));

    const showcase = document.querySelector(".showcase");
    if (showcase) {
      let activeShot = shots.find((shot) => shot.classList.contains("is-active"));
      const activeShotObserver = new MutationObserver(() => {
        const nextShot = shots.find((shot) => shot.classList.contains("is-active"));
        if (nextShot && nextShot !== activeShot) {
          activeShot = nextShot;
          animateShot(nextShot);
        }
      });

      shots.forEach((shot) => {
        activeShotObserver.observe(shot, {
          attributes: true,
          attributeFilter: ["class"],
        });
      });
    }
  }

})();
