/*
 * site.js - vanilla JS, no build step, no framework.
 * Loaded on every page:
 *   1. Persists the inbound ?src attribution across internal navigation
 *      (relative links drop query strings, so sessionStorage carries it).
 *   2. On the Home contact module: the Calendly embed loads only after
 *      the visitor submits the two qualifying questions. Nothing
 *      Calendly-related (script tag, iframe, preconnect) exists in the
 *      document before that click. A plain fallback link renders with
 *      the embed so a blocked or failed iframe never dead-ends the page.
 */

(function () {
  var CALENDLY_URL = "https://calendly.com/cvetkovicd050/20";

  var params = new URLSearchParams(window.location.search);
  var inboundSrc = params.get("src");
  try {
    if (inboundSrc) {
      sessionStorage.setItem("dc_src", inboundSrc);
    }
  } catch (e) {
    /* storage unavailable (private mode etc.) - fall through */
  }

  function getSrc() {
    if (inboundSrc) {
      return inboundSrc;
    }
    try {
      return sessionStorage.getItem("dc_src") || "";
    } catch (e) {
      return "";
    }
  }

  var form = document.getElementById("qualify-form");
  var embedContainer = document.getElementById("calendly-embed");

  if (!form || !embedContainer) {
    return;
  }

  function loadCalendly(spendRange, currentSetup, src) {
    var prefillParams = new URLSearchParams();
    prefillParams.set("embed_type", "Inline");
    prefillParams.set("embed_domain", window.location.hostname || "davidcvetko.com");
    // Question order on the Calendly event: a1 = Store URL, a2 = Monthly
    // Meta ad spend, a3 = Biggest bottleneck, a4 = Who runs the account.
    if (spendRange) {
      prefillParams.set("a2", spendRange);
    }
    if (currentSetup) {
      prefillParams.set("a4", currentSetup);
    }
    if (src) {
      prefillParams.set("utm_source", src);
    }

    var separator = CALENDLY_URL.indexOf("?") === -1 ? "?" : "&";
    var embedUrl = CALENDLY_URL + separator + prefillParams.toString();

    embedContainer.innerHTML = "";
    embedContainer.hidden = false;

    var iframe = document.createElement("iframe");
    iframe.src = embedUrl;
    iframe.width = "100%";
    iframe.height = "630";
    iframe.frameBorder = "0";
    iframe.title = "Book a call";
    embedContainer.appendChild(iframe);

    // Failure fallback: if the embed is blocked or fails to load, the
    // visitor still has a direct path to the same calendar.
    var fallback = document.createElement("p");
    fallback.className = "calendly-fallback";
    var fallbackLink = document.createElement("a");
    fallbackLink.className = "text-link";
    fallbackLink.href = embedUrl;
    fallbackLink.target = "_blank";
    fallbackLink.rel = "noopener";
    fallbackLink.textContent = "Calendar not loading? Open it in a new tab.";
    fallback.appendChild(fallbackLink);
    embedContainer.appendChild(fallback);
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var spendRange = document.getElementById("q1-spend").value;
    var currentSetup = document.getElementById("q2-setup").value;

    form.hidden = true;
    loadCalendly(spendRange, currentSetup, getSrc());
  });
})();
