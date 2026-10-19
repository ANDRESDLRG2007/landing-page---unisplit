// Carrusel de pantallas de la sección "Cómo funciona".
// Autónomo: no depende de script.js ni toca ningún ID/evento de GTM.
(function () {
  var root = document.querySelector("[data-showcase]");
  if (!root) return;

  var tabs = Array.prototype.slice.call(root.querySelectorAll(".showcase__tab"));
  var shots = Array.prototype.slice.call(root.querySelectorAll(".showcase__shot"));
  var current = 0;

  function show(n) {
    current = (n + tabs.length) % tabs.length;
    tabs.forEach(function (tab, i) {
      var on = i === current;
      tab.classList.toggle("is-active", on);
      tab.setAttribute("aria-selected", on ? "true" : "false");
      shots[i].classList.toggle("is-active", on);
    });
  }

  // La barra de progreso es una animación CSS; cuando termina, pasamos a la siguiente pantalla.
  root.addEventListener("animationend", function (e) {
    if (e.target.classList && e.target.classList.contains("showcase__bar")) show(current + 1);
  });

  tabs.forEach(function (tab, i) {
    tab.addEventListener("click", function () {
      if (i === current) {
        // reinicia la barra
        tab.classList.remove("is-active");
        void tab.offsetWidth;
        tab.classList.add("is-active");
      } else {
        show(i);
      }
    });
  });

  // Solo avanza cuando la sección está en pantalla y el usuario no está encima.
  function setPlaying(on) { root.classList.toggle("is-playing", on); }
  var inView = false, hovering = false;
  function update() { setPlaying(inView && !hovering); }

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      inView = entries[0].isIntersecting;
      update();
    }, { threshold: 0.35 }).observe(root);
  } else {
    inView = true; update();
  }
  root.addEventListener("mouseenter", function () { hovering = true; update(); });
  root.addEventListener("mouseleave", function () { hovering = false; update(); });
  root.addEventListener("focusin", function (e) {
    // Solo pausa si se navega con teclado; un clic con el mouse no debe frenar el carrusel
    if (e.target.matches && e.target.matches(":focus-visible")) { hovering = true; update(); }
  });
  root.addEventListener("focusout", function () { hovering = false; update(); });
})();