// Reemplaza esta URL por el link real del APK (por ejemplo, un release de GitHub o un archivo en /public)
const APK_URL = "https://raw.githubusercontent.com/ANDRESDLRG2007/Division-grupal/main/apk-unisplit.apk";

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

// --- Formulario de descarga ---
// El sitio es estático (sin backend), así que no hay dónde guardar un .json en un
// servidor. Lo que sí podemos hacer es guardar cada registro en localStorage, en el
// mismo formato en JSON que usarías si más adelante conectas un backend o agregas
// inicio de sesión: un arreglo de objetos {nombre, correo, fecha}.
const USUARIOS_KEY = "unisplit_usuarios";

function guardarUsuario(nombre, correo) {
  const usuarios = JSON.parse(localStorage.getItem(USUARIOS_KEY) || "[]");

  // Evita duplicar el mismo correo si ya se había registrado antes
  const yaExiste = usuarios.some((u) => u.correo.toLowerCase() === correo.toLowerCase());
  if (!yaExiste) {
    usuarios.push({ nombre, correo, fecha: new Date().toISOString() });
    localStorage.setItem(USUARIOS_KEY, JSON.stringify(usuarios));
  }

  return usuarios;
}

// Útil para revisar los registros guardados desde la consola del navegador,
// o para exportarlos manualmente mientras no haya backend.
function exportarUsuariosJSON() {
  const data = localStorage.getItem(USUARIOS_KEY) || "[]";
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "unisplit_usuarios.json";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
window.exportarUsuariosJSON = exportarUsuariosJSON;

const downloadForm = document.getElementById("download-form");
const modal        = document.getElementById("modal-descarga");
const modalCerrar  = document.getElementById("modal-cerrar");
const modalLink    = document.getElementById("modal-link-directo");

/** Abre el modal y mueve el foco al botón de cierre */
function abrirModal() {
  modal.removeAttribute("hidden");
  document.body.style.overflow = "hidden"; // evita scroll de fondo
  modalCerrar.focus();
}

/** Cierra el modal y devuelve el foco al formulario */
function cerrarModal() {
  modal.setAttribute("hidden", "");
  document.body.style.overflow = "";
  downloadForm.querySelector("button[type='submit']").focus();
}

// Cerrar con el botón "Entendido"
modalCerrar.addEventListener("click", cerrarModal);

// Cerrar al hacer clic en el fondo oscuro (fuera de .modal-box)
modal.addEventListener("click", (e) => {
  if (e.target === modal) cerrarModal();
});

// Cerrar con Escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !modal.hasAttribute("hidden")) cerrarModal();
});

// Enlace directo de respaldo dentro del modal
if (modalLink) {
  modalLink.href = APK_URL;
  modalLink.setAttribute("download", "");
  modalLink.addEventListener("click", () => {
    setTimeout(cerrarModal, 400);
  });
}

downloadForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const nombre = downloadForm.nombre.value.trim();
  const correo = downloadForm.correo.value.trim();

  if (!nombre || !correo) return;

  guardarUsuario(nombre, correo);

  // Dispara la descarga del APK
  const link = document.createElement("a");
  link.href = APK_URL;
  link.download = "";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Muestra el modal de agradecimiento
  abrirModal();
});