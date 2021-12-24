Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};


// Listen for messages from the popup.
chrome.runtime.onMessage.addListener((msg) => {
	//validate the message's structure.
	if (msg.from && msg.from === 'FIG_popup') {
		if (msg.subject === 'FIG_getFigpii') {
			chrome.runtime.sendMessage({
				from: 'FIG_content',
				subject: 'FIG_getFigpii',
			});
		}
		if(msg.subject==="FIG_disableVariation"){

			chrome.storage.local.get( function(data) {
				
			  if( data.key){
				chrome.storage.local.set({variations: msg.variationID, key: data.key}, function() {
					if(chrome.runtime.lastError) {
					  console.error(
						"Error setting " + key + " to " + JSON.stringify(data) +
						": " + chrome.runtime.lastError.message
					  );
					}
				  });
				
			  }else{
				chrome.storage.local.set({variations: msg.variationID, key: [msg.testID].concat(data.key)}, function() {
					if(chrome.runtime.lastError) {
					  console.error(
						"Error setting " + key + " to " + JSON.stringify(data) +
						": " + chrome.runtime.lastError.message
					  );
					}
				  });
			  }

				});
			

			  chrome.runtime.sendMessage({
				from: 'FIG_content',
				subject: 'FIG_disableVariation',
				testID: msg.testID,
				variationID: msg.variationID,
				
			});
			
			
		}
		if(msg.subject ==="FIG_enableVariation"){
			chrome.storage.local.get( function(data) {
				if(data.key.includes(msg.testID)){
					chrome.storage.local.set({variations: msg.variationID, key: data.key.remove(msg.testID)}, function() {
						if(chrome.runtime.lastError) {
						  console.error(
							"Error setting " + key + " to " + JSON.stringify(data) +
							": " + chrome.runtime.lastError.message
						  );
						}
					  });
					
				  }

			});
			chrome.runtime.sendMessage({
				from: 'FIG_content',
				subject: 'FIG_disableVariation',
				testID: msg.testID,
				variationID: msg.variationID,
				
			});
		}
		if (msg.subject === 'FIG_refreshPage') {
			chrome.runtime.sendMessage({
				from: 'FIG_content',
				subject: 'FIG_refreshPage',
			});
		}
		if (msg.subject === 'FIG_changeVariation') {
			chrome.runtime.sendMessage({
				from: 'FIG_content',
				subject: 'FIG_changeVariation',
				testID: msg.testID,
				variationID: msg.variationID,
			});
		}
	}
});

window.addEventListener(
	'message',
	(event) => {
		if (event.data.from && event.data.from === 'FIG_page') {
			chrome.runtime.sendMessage({
				from: 'FIG_content',
				subject: 'FIG_getFigpiiResponse',
				data: event.data.data,
			});
		}
	},
	false
);
chrome.storage.local.get( function(data) {
	console.log(data.key)
  });