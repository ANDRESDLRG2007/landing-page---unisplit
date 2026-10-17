const APK_URL = "https://raw.githubusercontent.com/ANDRESDLRG2007/Division-grupal/main/apk-unisplit.apk";
const downloadModal = document.getElementById("download-modal");
const downloadModalClose = document.getElementById("download-modal-close");
const downloadModalMessage = document.getElementById("download-modal-message");

function closeDownloadModal() {
  downloadModal.setAttribute("hidden", "");
  document.body.style.overflow = "";
}

function openDownloadModal() {
  downloadModal.removeAttribute("hidden");
  document.body.style.overflow = "hidden";
  downloadModalClose.focus();
}

downloadModalClose.addEventListener("click", closeDownloadModal);
downloadModal.addEventListener("click", (event) => {
  if (event.target === downloadModal) closeDownloadModal();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !downloadModal.hasAttribute("hidden")) {
    closeDownloadModal();
  }
});

// ─── Scroll-reveal: activa [data-animate] al entrar al viewport ───────────────
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target); // solo se anima una vez
      }
    });
  },
  { threshold: 0.12 }
);
document.querySelectorAll("[data-animate]").forEach((el) => revealObserver.observe(el));

window.addEventListener("hs-form-event:on-submission:success", (event) => {
  if (event.detail?.formId === "a94d1923-0170-4910-8b1c-b0fee7a1b127") {
    const signup = document.querySelector(".signup");
    if (signup?.classList.contains("signup--submitted")) return;
    signup?.classList.add("signup--submitted");

    downloadModalMessage.textContent = APK_URL
      ? "La descarga de UniSplit está comenzando. ¡Que disfrutes la app!"
      : "Recibimos tus datos. Te avisaremos cuando UniSplit esté disponible. ¡Gracias por tu interés!";
    openDownloadModal();

    if (APK_URL) {
      window.setTimeout(() => window.location.assign(APK_URL), 400);
    }
  }
});

// ─── Header: sombra al hacer scroll ──────────────────────────────────────────
const headerEl = document.querySelector(".header");
window.addEventListener(
  "scroll",
  () => headerEl.classList.toggle("is-scrolled", window.scrollY > 8),
  { passive: true }
);

// --- Acordeón de preguntas frecuentes ---
document.querySelectorAll(".faq-item__question").forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.closest(".faq-item");
    const isOpen = item.classList.contains("is-open");

    // Cierra los demás para que solo una pregunta esté abierta a la vez
    document.querySelectorAll(".faq-item.is-open").forEach((openItem) => {
      openItem.classList.remove("is-open");
      openItem.querySelector(".faq-item__question").setAttribute("aria-expanded", "false");
    });

    if (!isOpen) {
      item.classList.add("is-open");
      button.setAttribute("aria-expanded", "true");
    }
  });
});
