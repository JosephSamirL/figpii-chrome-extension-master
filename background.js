// Listening to messages from content script
chrome.runtime.onMessage.addListener((msg) => {
	if (msg.from && msg.from === 'FIG_content') {
		if (msg.subject === 'FIG_getFigpii') {
			chrome.tabs.executeScript(msg.tabID, {
				file: 'inject.js',
			});
		}
		if (msg.subject === 'FIG_changeVariation') {
			chrome.tabs.executeScript(
				msg.tabID,
				{
					code:
						'function changeVariation() {	window.FIGPII.TestingEngine.Decision.SetToCookie(' +
						msg.testID +
						',' +
						msg.variationID +
						");}(function () {let script = document.createElement('script');script.appendChild(document.createTextNode('(' + changeVariation + ')();'));(document.body || document.head || document.documentElement).appendChild(script);})();",
				},
				chrome.tabs.reload(msg.tabID)
			);
		}
		if(msg.subject === 'FIG_disableVariation'){
			
			chrome.storage.local.get("key", function(data) {
	
				if(data.key.length > 0){
					let urlcss = data.key.map(item=> `https://variations-cdn.figpii.com/css/te_page_ext_css_${item}_*`)
					let urljs = data.key.map(item=> `https://variations-cdn.figpii.com/js/te_page_ext_js_${item}_*`)
		            const blockList = urljs.concat(urlcss)
				chrome.webRequest.onBeforeRequest.addListener(
					function() {
						return {cancel: true};
					},
					{
						
						urls: blockList,
					},
					["blocking"]
				);
				}
			  });
			
			chrome.tabs.reload(msg.tabID);	
			chrome.runtime.reload()
		}
		if(msg.subject === 'FIG_enableVariation'){
			
			chrome.storage.local.get("key", function(data) {
			
				if(data.key.length > 0){
					let urlcss = data.key.map(item=> `https://variations-cdn.figpii.com/css/te_page_ext_css_${item}_*`)
					let urljs = data.key.map(item=> `https://variations-cdn.figpii.com/js/te_page_ext_js_${item}_*`)
					const blockList = urljs.concat(urlcss)

				chrome.webRequest.onBeforeRequest.addListener(
					function() {
						return {cancel: true};
					},
					{
						
						urls: blockList,
					},
					["blocking"]
				);
				}
			  });
			
			chrome.tabs.reload(msg.tabID);	
			chrome.runtime.reload()
		}

		if (msg.subject === 'FIG_refreshPage') {
			chrome.tabs.reload(msg.tabID);
		}
	}
});



chrome.storage.local.get("key", function(data) {
	
	if(data.key){
		let urlcss = data.key.map(item=> `https://variations-cdn.figpii.com/css/te_page_ext_css_${item}_*`)
		let urljs = data.key.map(item=> `https://variations-cdn.figpii.com/js/te_page_ext_js_${item}_*`)
		const blockList = urljs.concat(urlcss)
	chrome.webRequest.onBeforeRequest.addListener(
		function() {
			return {cancel: true};
		},
		{
			
			urls: blockList,
		},
		["blocking"]
	);
	}
	
  });
