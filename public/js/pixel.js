document.addEventListener(
  "DOMContentLoaded",
  (async function () {
      if (window.__PIXEL_LOADED__) return;
  window.__PIXEL_LOADED__ = true;

    if (typeof window === "undefined") return;
    const base_url = "http://localhost:3000/api/pixel";
    const script = document.currentScript;
    var path_changes = []; //track path changes
    let heartbeat = null;
    if (!script) return;
    const website_id = script.getAttribute("data-websiteid");
    if (!website_id || typeof website_id !== "string") return;
    let activeStart = performance.now();
    let activeTime = 0;
    const params = new URLSearchParams(location.search);
    const utm_source = params.get("utm_source");
    const utm_campaign = params.get("utm_campaign");
    const pushState = history.pushState;
    const replaceState = history.replaceState;
    const payload = (type, extra) =>
      JSON.stringify({
        type: type.toUpperCase(),
        screenWidth: window.innerWidth,
        website_id,
        url: location.href, //active path
        utm_campaign,
        utm_source,
        ...extra,
      });
    const _session = await fetch(base_url + "/session?id=" + website_id, {
      method: "POST",
      body: payload("session"),
      headers: {
        "Content-Type": "application/json",
      },
      keepalive: true,
    });
    if (!_session.ok) return;

    const sendEvent = (type, extra, normal) => {
      const data = payload(type, extra);
      if (normal) {
        fetch(base_url + "/collect", {
          method: "POST",
          body: payload(type, extra),
          headers: {
            "Content-Type": "application/json",
          },
          keepalive: true,
        }).catch(() => {});
        return;
      }
      if (navigator.sendBeacon) {
        navigator.sendBeacon(base_url + "/collect", data);
        return;
      }
      fetch(base_url + "/collect", {
        method: "POST",
        body: payload(type, extra),
        headers: {
          "Content-Type": "application/json",
        },
        keepalive: true,
      }).catch(() => {});
    };
    const startHeartbeat = () => {
      if (!heartbeat) {
        heartbeat = setInterval(() => sendEvent("heartbeat"), 125000);
      }
    };
    const stopHeatbeat = () => {
      if (heartbeat) {
        clearInterval(heartbeat);
        heartbeat = null;
      }
    };

    const sendExit = () => {
      console.log(path_changes);
      activeTime += performance.now() - activeStart;

      sendEvent("page_exit", {
        active_time: Math.round(activeTime),
        path_history: path_changes,
      });
    };
    const sendPathChange = () => {
      path_changes.push(location.href);
      if (path_changes.length >= 5) {
        sendEvent("path_change", {
          path_history: path_changes,
        });
        path_changes = [];
      }
    };
    history.pushState = function (...args) {
      pushState.apply(this, args);
      sendPathChange();
    };
    history.replaceState = function (...args) {
      replaceState.apply(this, args);
      sendPathChange();
    };
    sendEvent("page_view");
    startHeartbeat();
    let timer = null;

    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        stopHeatbeat();

        activeTime += performance.now() - activeStart;

        timer = setTimeout(() => {
          sendEvent("page_blur", {
            active_time: Math.round(activeTime),
            path_history: path_changes,
          });
          if (timer) {
            clearTimeout(timer);
            timer = null;
          }
        }, 5000);
      } else {
        activeStart = performance.now();
        timer = setTimeout(() => {
          sendEvent("page_unblur");

          if (timer) {
            clearTimeout(timer);
            timer = null;
          }
          startHeartbeat();
        }, 1000);
      }
    });
    window.addEventListener("popstate", sendPathChange);
    window.addEventListener("pagehide", sendExit);
  })(),
);
