/*
 * site.js - vanilla JS, no build step, no framework.
 * Handles the Home contact module: the Calendly embed loads only after
 * the visitor submits the two qualifying questions. Nothing Calendly-related
 * (script tag, iframe, preconnect) exists in the document before that click.
 */

(function () {
  var CALENDLY_URL = "https://calendly.com/cvetkovicd050/20";

  var form = document.getElementById("qualify-form");
  var embedContainer = document.getElementById("calendly-embed");

  if (!form || !embedContainer) {
    return;
  }

  function getSrcParam() {
    var params = new URLSearchParams(window.location.search);
    return params.get("src") || "";
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
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var spendRange = document.getElementById("q1-spend").value;
    var currentSetup = document.getElementById("q2-setup").value;
    var src = getSrcParam();

    form.hidden = true;
    loadCalendly(spendRange, currentSetup, src);
  });
})();
