/**
 * SwiftUI-App-Screenshots: Reihenfolge abhängig von der Seitensprache.
 * Regel: gewählte Sprache → java_like → englisch → restliche natürliche Sprache(n).
 * Beispiel EN: english, java_like, portuguese, german.
 */
(function () {
  "use strict";

  var BASE = "/assets/swiftApp/visustruct-app-swift-";
  var SUFFIX = ".png";

  var SIMULATOR_KEY = "simulator";
  var SIMULATOR_VIDEO_SRC = "/assets/visustruct-movies/VisuStruct-Simulator.mp4";
  var SIMULATOR_VIDEO_TYPE = "video/mp4";

  var VARIANTS = ["english", "german", "portuguese", "java_like"];

  function langToChosen(htmlLang) {
    var l = (htmlLang || "en").toLowerCase().split("-")[0];
    if (l === "de") return "german";
    if (l === "pt") return "portuguese";
    return "english";
  }

  function buildOrder(chosen) {
    if (VARIANTS.indexOf(chosen) === -1) chosen = "english";
    var out = [SIMULATOR_KEY, chosen];
    if (chosen !== "java_like") out.push("java_like");
    var tail = ["english", "portuguese", "german"];
    for (var i = 0; i < tail.length; i++) {
      if (out.indexOf(tail[i]) === -1) out.push(tail[i]);
    }
    return out;
  }

  /** Screenshot keys = Karussell-Dateien, nicht zwingend die UI-Sprache im Bild (Stand 2026-04). */
  var ALT_LABELS = {
    en: {
      simulator:
        "VisuStruct (Mac/iPad): live demo — the structogram simulator steps through a complete diagram.",
      english:
        "VisuStruct (Mac): Fibonacci structogram, for-loop selected — init, condition, and step in the element editor.",
      german: "VisuStruct (Mac, German UI): CheckPin structogram with loop, input, and branching.",
      portuguese:
        "VisuStruct (Mac, German UI): same app — second view of the CheckPin example (carousel slot).",
      java_like:
        "VisuStruct (Mac): Code generator with Java, Python, and JavaScript from the Fibonacci structogram.",
    },
    de: {
      simulator:
        "VisuStruct (Mac/iPad): Live-Demo — der Struktogramm-Simulator läuft einmal komplett durch.",
      english:
        "VisuStruct (Mac): Struktogramm «Fibonacci», For-Schleife gewählt — Init, Bedingung und Schritt im Elementtext.",
      german: "VisuStruct (Mac, deutsche Oberfläche): Struktogramm «CheckPin» mit Schleife, Eingabe und Verzweigung.",
      portuguese:
        "VisuStruct (Mac, deutsche Oberfläche): dieselbe App — zweite Ansicht des CheckPin-Beispiels (Karussell-Folie).",
      java_like:
        "VisuStruct (Mac): Code erzeugen — Java, Python und JavaScript aus dem Fibonacci-Struktogramm.",
    },
    pt: {
      simulator:
        "VisuStruct (Mac/iPad): demonstração ao vivo — o simulador de structogramas percorre um diagrama completo.",
      english:
        "VisuStruct (Mac): diagrama structograma Fibonacci, com laço for selecionado e campos de início, condição e passo.",
      german: "VisuStruct (Mac, interface em alemão): structograma CheckPin com ciclo, entrada e ramificação.",
      portuguese:
        "VisuStruct (Mac, interface em alemão): a mesma app — segunda vista do exemplo CheckPin (diapositivo do carrossel).",
      java_like:
        "VisuStruct (Mac): gerador de código (Java, Python, JavaScript) a partir do structograma Fibonacci.",
    },
    es: {
      simulator:
        "VisuStruct (Mac/iPad): demostración en vivo — el simulador de structogramas recorre un diagrama completo.",
      english:
        "VisuStruct (Mac): structograma Fibonacci, con bucle for seleccionado y campos de inicio, condición y paso.",
      german: "VisuStruct (Mac, interfaz en alemán): structograma CheckPin con bucle, entrada y bifurcación.",
      portuguese:
        "VisuStruct (Mac, interfaz en alemán): la misma app — segunda vista del ejemplo CheckPin (diapositiva del carrusel).",
      java_like:
        "VisuStruct (Mac): generador de código (Java, Python, JavaScript) a partir del structograma Fibonacci.",
    },
    fr: {
      simulator:
        "VisuStruct (Mac/iPad) : démo en direct — le simulateur de structogrammes parcourt un diagramme complet.",
      english:
        "VisuStruct (Mac) : structogramme Fibonacci, boucle for sélectionnée avec champs d’initialisation, condition et pas.",
      german: "VisuStruct (Mac, interface allemande) : structogramme CheckPin avec boucle, saisie et branchement.",
      portuguese:
        "VisuStruct (Mac, interface allemande) : la même app — deuxième vue de l’exemple CheckPin (diapositive du carrousel).",
      java_like:
        "VisuStruct (Mac) : générateur de code (Java, Python, JavaScript) à partir du structogramme Fibonacci.",
    },
  };

  function uiLang() {
    var l = (document.documentElement.lang || "en").toLowerCase().split("-")[0];
    if (l === "de" || l === "pt" || l === "es" || l === "fr") return l;
    return "en";
  }

  function labels() {
    var u = uiLang();
    if (u === "de") {
      return {
        prev: "Vorheriges Bild",
        next: "Nächstes Bild",
        dot: "Folie",
        live: "Folie",
        of: "von",
      };
    }
    if (u === "pt") {
      return {
        prev: "Imagem anterior",
        next: "Imagem seguinte",
        dot: "Diapositivo",
        live: "Diapositivo",
        of: "de",
      };
    }
    if (u === "es") {
      return {
        prev: "Imagen anterior",
        next: "Imagen siguiente",
        dot: "Diapositiva",
        live: "Diapositiva",
        of: "de",
      };
    }
    if (u === "fr") {
      return {
        prev: "Image précédente",
        next: "Image suivante",
        dot: "Diapositive",
        live: "Diapositive",
        of: "sur",
      };
    }
    return {
      prev: "Previous screenshot",
      next: "Next screenshot",
      dot: "Slide",
      live: "Slide",
      of: "of",
    };
  }

  function init(root) {
    if (!root || root.getAttribute("data-swift-carousel-init") === "1") return;
    root.setAttribute("data-swift-carousel-init", "1");

    var chosen = root.getAttribute("data-chosen") || langToChosen(document.documentElement.lang);
    var order = buildOrder(chosen);
    var L = labels();
    var alts = ALT_LABELS[uiLang()] || ALT_LABELS.en;

    var reduceMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    root.classList.add("app-screenshot-carousel");
    root.innerHTML = "";

    if (!root.id) {
      root.id = "swift-carousel-" + Math.random().toString(36).slice(2, 10);
    }

    var viewport = document.createElement("div");
    viewport.className = "app-screenshot-carousel-viewport";
    viewport.setAttribute("tabindex", "0");
    viewport.setAttribute("role", "region");
    viewport.setAttribute("aria-roledescription", "carousel");
    viewport.setAttribute(
      "aria-label",
      root.getAttribute("data-aria-region") || "VisuStruct SwiftUI"
    );

    var track = document.createElement("div");
    track.id = root.id + "-track";
    track.className = "app-screenshot-carousel-track";
    if (reduceMotion) track.classList.add("app-screenshot-carousel-track--no-motion");

    var slides = [];
    var videos = [];
    for (var s = 0; s < order.length; s++) {
      var key = order[s];
      var slide = document.createElement("div");
      slide.className = "app-screenshot-carousel-slide";
      slide.setAttribute("role", "group");
      slide.setAttribute("aria-roledescription", "slide");
      slide.setAttribute("aria-label", L.dot + " " + (s + 1) + " " + L.of + " " + order.length);
      slide.setAttribute("aria-hidden", s === 0 ? "false" : "true");

      if (key === SIMULATOR_KEY) {
        slide.classList.add("app-screenshot-carousel-slide--video");

        var video = document.createElement("video");
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.controls = true;
        video.setAttribute("muted", "");
        video.setAttribute("loop", "");
        video.setAttribute("playsinline", "");
        video.setAttribute("preload", "metadata");
        video.setAttribute("aria-label", alts[key] || alts.english);

        var source = document.createElement("source");
        source.src = SIMULATOR_VIDEO_SRC;
        source.type = SIMULATOR_VIDEO_TYPE;
        video.appendChild(source);

        var fallback = document.createElement("p");
        fallback.className = "app-screenshot-carousel-video-fallback";
        fallback.textContent = alts[key] || alts.english;
        video.appendChild(fallback);

        slide.appendChild(video);
        videos.push({ index: s, el: video });
      } else {
        var img = document.createElement("img");
        img.src = BASE + key + SUFFIX;
        img.width = 1024;
        img.loading = s === 0 ? "eager" : "lazy";
        img.decoding = "async";
        img.alt = alts[key] || alts.english;
        slide.appendChild(img);
      }

      track.appendChild(slide);
      slides.push(slide);
    }

    viewport.appendChild(track);

    var live = document.createElement("div");
    live.className = "app-screenshot-carousel-live";
    live.setAttribute("aria-live", "polite");
    live.setAttribute("aria-atomic", "true");

    var controls = document.createElement("div");
    controls.className = "app-screenshot-carousel-controls";

    var prevBtn = document.createElement("button");
    prevBtn.type = "button";
    prevBtn.className = "app-screenshot-carousel-btn app-screenshot-carousel-btn--prev";
    prevBtn.setAttribute("aria-controls", track.id);
    prevBtn.setAttribute("aria-label", L.prev);
    prevBtn.innerHTML =
      '<span aria-hidden="true" class="app-screenshot-carousel-icon">‹</span>';

    var dots = document.createElement("div");
    dots.className = "app-screenshot-carousel-dots";
    dots.setAttribute("role", "tablist");
    dots.setAttribute("aria-label", L.dot);

    var dotButtons = [];
    for (var d = 0; d < slides.length; d++) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.className = "app-screenshot-carousel-dot";
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-selected", d === 0 ? "true" : "false");
      dot.setAttribute("aria-label", L.dot + " " + (d + 1));
      dotButtons.push(dot);
      dots.appendChild(dot);
    }

    var nextBtn = document.createElement("button");
    nextBtn.type = "button";
    nextBtn.className = "app-screenshot-carousel-btn app-screenshot-carousel-btn--next";
    nextBtn.setAttribute("aria-controls", track.id);
    nextBtn.setAttribute("aria-label", L.next);
    nextBtn.innerHTML =
      '<span aria-hidden="true" class="app-screenshot-carousel-icon">›</span>';

    controls.appendChild(prevBtn);
    controls.appendChild(dots);
    controls.appendChild(nextBtn);

    var figcaption = document.createElement("figcaption");
    figcaption.className = "app-screenshot-carousel-caption";
    figcaption.textContent =
      root.getAttribute("data-caption") ||
      "";

    var stage = document.createElement("div");
    stage.className = "app-screenshot-carousel-stage";
    stage.appendChild(viewport);
    stage.appendChild(controls);

    var figure = document.createElement("figure");
    figure.className = "app-screenshot-frame app-screenshot-carousel-frame";
    figure.appendChild(stage);
    figure.appendChild(live);
    if (figcaption.textContent) figure.appendChild(figcaption);

    root.appendChild(figure);

    var index = 0;

    function setLiveText() {
      live.textContent = L.live + " " + (index + 1) + " " + L.of + " " + slides.length;
    }

    function applyIndex(nextIndex) {
      var n = (nextIndex % slides.length + slides.length) % slides.length;
      index = n;
      track.style.transform = "translateX(-" + n * 100 + "%)";
      for (var i = 0; i < slides.length; i++) {
        slides[i].setAttribute("aria-hidden", i === n ? "false" : "true");
        dotButtons[i].setAttribute("aria-selected", i === n ? "true" : "false");
        dotButtons[i].classList.toggle("app-screenshot-carousel-dot--active", i === n);
      }
      for (var v = 0; v < videos.length; v++) {
        var entry = videos[v];
        if (entry.index === n && !reduceMotion) {
          var p = entry.el.play();
          if (p && typeof p.catch === "function") p.catch(function () {});
        } else {
          entry.el.pause();
          if (entry.index !== n) {
            try { entry.el.currentTime = 0; } catch (e) {}
          }
        }
      }
      setLiveText();
    }

    prevBtn.addEventListener("click", function () {
      applyIndex(index - 1);
    });
    nextBtn.addEventListener("click", function () {
      applyIndex(index + 1);
    });
    for (var j = 0; j < dotButtons.length; j++) {
      (function (ji) {
        dotButtons[ji].addEventListener("click", function () {
          applyIndex(ji);
        });
      })(j);
    }

    viewport.addEventListener("keydown", function (ev) {
      if (ev.key === "ArrowLeft") {
        ev.preventDefault();
        applyIndex(index - 1);
      } else if (ev.key === "ArrowRight") {
        ev.preventDefault();
        applyIndex(index + 1);
      }
    });

    applyIndex(0);
    setLiveText();
  }

  function run() {
    var roots = document.querySelectorAll("[data-visustruct-swift-carousel]");
    for (var r = 0; r < roots.length; r++) init(roots[r]);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();
