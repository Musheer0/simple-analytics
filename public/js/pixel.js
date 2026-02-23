document.addEventListener("DOMContentLoaded",(async function(){
    if(typeof window === "undefined") return;
   const base_url = 'http://localhost:3000/api/pixel'
   const script = document.currentScript;
   var path_changes = [] //track path changes
   if(!script) return
   const website_id =script.getAttribute('data-websiteid');
   if(!website_id|| typeof website_id!=="string") return
     let activeStart = performance.now();
   let activeTime = 0;
   const params =   new URLSearchParams(location.search);
   const utm_source = params.get("utm_source");
   const utm_campaign = params.get("utm_campaign");
   const pushState = history.pushState;
   const replaceState =history.replaceState
      const payload = (type, extra)=>JSON.stringify({
    type,
    screenWidth: window.innerWidth,
    website_id,
    url: location.href, //active path
    utm_campaign,
    utm_source,
    ...extra
    });
   const _session = await fetch(base_url+'/session?id='+website_id,{
     method: "POST",
      body: payload("session"),
      headers: {
        "Content-Type":"application/json"
      },
      keepalive:true
   });
   if(!_session.ok) return ;
 

    const sendEvent = (type, extra) => {
          const data = payload(type, extra);
    if(navigator.sendBeacon) {
            navigator.sendBeacon(base_url + "/collect", data);
            return;
    }
    fetch(base_url+'/collect', {
      method: "POST",
      body: payload(type, extra),
      headers: {
        "Content-Type":"application/json"
      },
      keepalive:true
    }).catch(() => {});

    };
    const sendExit = () => {
    activeTime += performance.now() - activeStart;

    sendEvent("page_exit", {
      active_time: Math.round(activeTime),
      path_history:path_changes
    })
    };
    const sendPathChange = ()=>{    
       path_changes.push(location.href);

  if (path_changes.length >= 5) {
    sendEvent("path_change", {
      path_history: path_changes
    });
    path_changes = [];
  }
    }
    history.pushState = function(...args){
        pushState.apply(this,args);
        sendPathChange();
    }
    history.replaceState =function(...args){
        replaceState.apply(this,args);
        sendPathChange();
    }
    sendEvent("page_view");
   document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") {
    activeTime += performance.now() - activeStart;
  } else {
    activeStart = performance.now();
  }
});
    window.addEventListener("popstate",sendPathChange)
    document.addEventListener("pagehide",sendExit);
})())