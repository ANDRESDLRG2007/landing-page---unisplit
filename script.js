// Reemplaza esta URL por el link real del APK (por ejemplo, un release de GitHub o un archivo en /public)
const APK_URL = "https://raw.githubusercontent.com/ANDRESDLRG2007/Division-grupal/main/apk-unisplit.apk";

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
});