/**
 * Java-Desktop-Screenshots: Reihenfolge abhängig von der Seitensprache.
 * Regel: gewählte Sprache → Englisch → Code-Generator (generateCodeJS) → übrige Sprachen.
 * Zusatz: direkt nach „english“ → java-englisch-java_like; direkt nach „deutsch“ → java-deutsch-switchCase.
 */
(function () {
  "use strict";

  var BASE = "/assets/javaApp/visustruct-app-java-";
  var SUFFIX = ".png";

  var UI_LANGS = ["deutsch", "english", "portugues"];

  function langToChosenJava(htmlLang) {
    var l = (htmlLang || "en").toLowerCase().split("-")[0];
    if (l === "de") return "deutsch";
    if (l === "pt") return "portugues";
    return "english";
  }

  function buildJavaOrder(chosen) {
    if (UI_LANGS.indexOf(chosen) === -1) chosen = "english";
    var out = [chosen];
    if (out.indexOf("english") === -1) out.push("english");
    out.push("generateCodeJS");
    for (var i = 0; i < UI_LANGS.length; i++) {
      if (out.indexOf(UI_LANGS[i]) === -1) out.push(UI_LANGS[i]);
    }
    return out;
  }

  /** Datei: /assets/javaApp/visustruct-app-java-<fragment>.png */
  function expandJavaOrder(base) {
    var expanded = [];
    for (var i = 0; i < base.length; i++) {
      var k = base[i];
      expanded.push(k);
      if (k === "english") expanded.push("englisch-java_like");
      if (k === "deutsch") expanded.push("deutsch-switchCase");
    }
    return expanded;
  }

  var ALT_LABELS = {
    en: {
      deutsch: "VisuStruct Java on the desktop: interface in German.",
      english: "VisuStruct Java on the desktop: interface in English.",
      portugues: "VisuStruct Java on the desktop: interface in Portuguese.",
      generateCodeJS:
        "VisuStruct Java: generate code dialog or preview for JavaScript export.",
      "englisch-java_like":
        "VisuStruct Java: English UI with Java-style keywords in the diagram.",
      "deutsch-switchCase":
        "VisuStruct Java: German UI — switch / case structure in the diagram.",
    },
    de: {
      deutsch: "VisuStruct Java auf dem Desktop: Oberfläche auf Deutsch.",
      english: "VisuStruct Java auf dem Desktop: Oberfläche auf Englisch.",
      portugues: "VisuStruct Java auf dem Desktop: Oberfläche auf Portugiesisch.",
      generateCodeJS:
        "VisuStruct Java: Code-Generator / Vorschau für den JavaScript-Export.",
      "englisch-java_like":
        "VisuStruct Java: englische Oberfläche mit Java-ähnlichen Schlüsselwörtern im Struktogramm.",
      "deutsch-switchCase":
        "VisuStruct Java: deutsche Oberfläche — switch/case-Struktur im Struktogramm.",
    },
    pt: {
      deutsch: "VisuStruct Java no computador: interface em alemão.",
      english: "VisuStruct Java no computador: interface em inglês.",
      portugues: "VisuStruct Java no computador: interface em português.",
      generateCodeJS:
        "VisuStruct Java: gerador de código ou pré-visualização para exportação JavaScript.",
      "englisch-java_like":
        "VisuStruct Java: interface em inglês com palavras-chave ao estilo Java no diagrama.",
      "deutsch-switchCase":
        "VisuStruct Java: interface em alemão — estrutura switch/case no diagrama.",
    },
    es: {
      deutsch: "VisuStruct Java en el escritorio: interfaz en alemán.",
      english: "VisuStruct Java en el escritorio: interfaz en inglés.",
      portugues: "VisuStruct Java en el escritorio: interfaz en portugués.",
      generateCodeJS:
        "VisuStruct Java: generador de código o vista previa para exportación JavaScript.",
      "englisch-java_like":
        "VisuStruct Java: interfaz en inglés con palabras clave de estilo Java en el structograma.",
      "deutsch-switchCase":
        "VisuStruct Java: interfaz en alemán — estructura switch/case en el structograma.",
    },
    fr: {
      deutsch: "VisuStruct Java sur le bureau : interface en allemand.",
      english: "VisuStruct Java sur le bureau : interface en anglais.",
      portugues: "VisuStruct Java sur le bureau : interface en portugais.",
      generateCodeJS:
        "VisuStruct Java : générateur de code ou aperçu pour l’export JavaScript.",
      "englisch-java_like":
        "VisuStruct Java : interface anglaise avec mots-clés de style Java dans le structogramme.",
      "deutsch-switchCase":
        "VisuStruct Java : interface allemande — structure switch/case dans le structogramme.",
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
    if (!root || root.getAttribute("data-java-carousel-init") === "1") return;
    root.setAttribute("data-java-carousel-init", "1");

    var chosen = root.getAttribute("data-chosen") || langToChosenJava(document.documentElement.lang);
    var order = expandJavaOrder(buildJavaOrder(chosen));
    var L = labels();
    var alts = ALT_LABELS[uiLang()] || ALT_LABELS.en;

    var reduceMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    root.classList.add("app-screenshot-carousel");
    root.innerHTML = "";

    if (!root.id) {
      root.id = "java-carousel-" + Math.random().toString(36).slice(2, 10);
    }

    var viewport = document.createElement("div");
    viewport.className = "app-screenshot-carousel-viewport";
    viewport.setAttribute("tabindex", "0");
    viewport.setAttribute("role", "region");
    viewport.setAttribute("aria-roledescription", "carousel");
    viewport.setAttribute(
      "aria-label",
      root.getAttribute("data-aria-region") || "VisuStruct Java"
    );

    var track = document.createElement("div");
    track.id = root.id + "-track";
    track.className = "app-screenshot-carousel-track";
    if (reduceMotion) track.classList.add("app-screenshot-carousel-track--no-motion");

    var slides = [];
    for (var s = 0; s < order.length; s++) {
      var fragment = order[s];
      var slide = document.createElement("div");
      slide.className = "app-screenshot-carousel-slide";
      if (fragment === "generateCodeJS") {
        slide.classList.add("app-screenshot-carousel-slide--java-generate-code");
      }
      slide.setAttribute("role", "group");
      slide.setAttribute("aria-roledescription", "slide");
      slide.setAttribute("aria-label", L.dot + " " + (s + 1) + " " + L.of + " " + order.length);
      slide.setAttribute("aria-hidden", s === 0 ? "false" : "true");

      var img = document.createElement("img");
      img.src = BASE + fragment + SUFFIX;
      img.width = 1024;
      img.loading = s === 0 ? "eager" : "lazy";
      img.decoding = "async";
      img.alt = alts[fragment] || alts.english;

      slide.appendChild(img);
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
    figcaption.textContent = root.getAttribute("data-caption") || "";

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
    var roots = document.querySelectorAll("[data-visustruct-java-carousel]");
    for (var r = 0; r < roots.length; r++) init(roots[r]);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();
