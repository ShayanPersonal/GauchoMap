chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.greeting == "createMap")
      localStorage["courseArray"] = JSON.stringify(request.courseArray)
      var mapWindow = chrome.windows.create({'width': 800, 'height': 700, 'type': 'popup', 'url': chrome.extension.getURL('gmap.html')}, function(tab) { });
  });