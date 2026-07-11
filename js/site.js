/*
 * site.js - vanilla JS, no build step, no framework.
 * Loaded on every page:
 *   1. Persists the inbound ?src attribution across internal navigation
 *      (relative links drop query strings, so sessionStorage carries it).
 *   2. On the Home contact module: "Book the call" redirects to the hosted
 *      Calendly booking page, carrying the two qualifying answers + the
 *      attribution src as prefill params. No embed - nothing third-party
 *      ever loads on this site. The handler binds to BOTH the form submit
 *      and the button click because some in-app browsers (LinkedIn, Upwork,
 *      chat apps) swallow form submit events; the static link under the
 *      button covers the no-JS case.
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

  function bookingUrl(spendRange, currentSetup, src) {
    var prefillParams = new URLSearchParams();
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
    var qs = prefillParams.toString();
    return qs ? CALENDLY_URL + "?" + qs : CALENDLY_URL;
  }

  var form = document.getElementById("qualify-form");
  if (!form) {
    return;
  }

  function book(event) {
    event.preventDefault();
    var spendRange = document.getElementById("q1-spend").value;
    var currentSetup = document.getElementById("q2-setup").value;
    window.location.href = bookingUrl(spendRange, currentSetup, getSrc());
  }

  form.addEventListener("submit", book);
  var bookBtn = document.getElementById("book-call");
  if (bookBtn) {
    bookBtn.addEventListener("click", book);
  }

  // The static fallback link works with JS disabled (plain calendar URL);
  // when JS runs, upgrade it to carry the attribution src.
  var directLink = document.getElementById("calendly-direct");
  if (directLink) {
    directLink.href = bookingUrl("", "", getSrc());
  }
})();
