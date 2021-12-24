// Update the relevant fields with the new data.
const renderTools = ({ repository, activeTools }) => {
	if (Object.entries(activeTools).length === 0) {
		document.getElementById('message').innerText =
			"This page doesn't have active A/B tests";
	} else {
		document.getElementById('message').style.display = 'none';
		for (const [key, value] of Object.entries(activeTools)) {
			let node = document.createElement('LI');
			node.classList.add('test-row');
			let title = document.createElement('P');
			title.classList.add('title');
			let textnode = document.createTextNode(repository[key].name);
			title.appendChild(textnode);
			node.appendChild(title);
			let testStatus = document.createElement('P');
			let testStatustextnode = document.createTextNode(repository[key].status);
			testStatus.appendChild(testStatustextnode);
			node.appendChild(testStatus);
			let variations = repository[key].pages;
			var selectList = document.createElement('select');
			repository[key].status === 19 ? (selectList.setAttribute('data-test-id', repository[key].id), 
			selectList.setAttribute('data-test-complete', "true")
			
			):(selectList.setAttribute('data-test-id', repository[key].id),selectList.setAttribute('data-test-complete', "false"))

			if(repository[key].status === 19){

				for (const key in variations) {

					if (variations[key].id === value) {
						var option = document.createElement('option');
						option.setAttribute('selected', 'selected');
						
						option.value = variations[key].id;
						option.text = variations[key].name;
						selectList.appendChild(option);
						node.appendChild(selectList);
						document.getElementById('tests').appendChild(node);
					}else if(variations[key].name ==="Original" || variations[key].name ==="NewOriginal"){
						var option = document.createElement('option');
						option.value = variations[key].id;
						option.text = variations[key].name;	
						selectList.appendChild(option);
						node.appendChild(selectList);
						document.getElementById('tests').appendChild(node);
					}
					
				}

			}else{
				
				selectList.setAttribute('data-test-id', repository[key].id);
				for (const key in variations) {
					var option = document.createElement('option');
					option.value = variations[key].id;
					option.text = variations[key].name;
					if (variations[key].id === value) {
						option.setAttribute('selected', 'selected');
					}
					selectList.appendChild(option);
				}
				node.appendChild(selectList);
				document.getElementById('tests').appendChild(node);
			}
			
				

				
			

		}
		chrome.storage.local.get( function(data) {
           
			if(data.key){
				data.key.map(keyy=>{
					let loop = true;
            if(document.querySelector(`[data-test-id="${keyy}"]`)){
			[...document.querySelector(`[data-test-id="${keyy}"]`).children].map(item=>{
				
				if(item.text==="Original" || item.text==="NewOriginal" && loop){
					item.setAttribute('selected', 'selected');
					loop = false;
					
				}else{
					item.removeAttribute("selected")
				}
			})
		}
		})
		}
			
		});
		let selections = document.querySelectorAll('select');
		selections.forEach((selection) => {
			selection.addEventListener('change', (e) => {
				//alert('mesa');
				handleVariationChange(e.currentTarget);
			});
		});
	}
};

const handleVariationChange = (target) => {
	let testID = target.getAttribute('data-test-id');
	let variationID = target.value;
	let completed = target.getAttribute('data-test-complete');
	let name = target.options[target.selectedIndex].text
	console.log(completed)
	completed === "false"? chrome.tabs.query(
		{
			active: true,
			currentWindow: true,
		},
		(tabs) => {
			// ...and send a request to get Figpii...
			chrome.tabs.sendMessage(tabs[0].id, {
				from: 'FIG_popup',
				subject: 'FIG_changeVariation',
				tabID: tabs[0].id,
				testID,
				variationID,
				name,
			});
		}
	):(function() {
		console.log(name)
		if(name !== "Original" && name !=="NewOriginal"){
			chrome.tabs.query(
				{
					active: true,
					currentWindow: true,
				},
				(tabs) => {
					// ...and send a request to get Figpii...
					chrome.tabs.sendMessage(tabs[0].id, {
						from: 'FIG_popup',
						subject: 'FIG_enableVariation',
						tabID: tabs[0].id,
						testID,
						variationID,
						name,
					});
				}
			);		
		}else{
			chrome.tabs.query(
				{
					active: true,
					currentWindow: true,
				},
				(tabs) => {
					// ...and send a request to get Figpii...
					chrome.tabs.sendMessage(tabs[0].id, {
						from: 'FIG_popup',
						subject: 'FIG_disableVariation',
						tabID: tabs[0].id,
						testID,
						variationID,
						name,
					});
				}
			);
		}
		}())
	window.close();
};

const renderFigpiiNotFound = () => {
	let msg = document.getElementById('message');
	msg.innerText = "We are sorry ... This website isn't using Figpii.";
	msg.style.color = '#ff0000';
};

// Once popup is opend ...
window.addEventListener('DOMContentLoaded', () => {
	document.getElementById('refresh').addEventListener('click', () => {
		// ... query for the active tab...
		chrome.tabs.query(
			{
				active: true,
				currentWindow: true,
			},
			(tabs) => {
				// ... and send a request to refresh current tab ...
				chrome.tabs.sendMessage(tabs[0].id, {
					from: 'FIG_popup',
					subject: 'FIG_refreshPage',
					tabID: tabs[0].id,
				});
			}
		);
		window.close();
	});
	// ... query for the active tab...
	chrome.tabs.query(
		{
			active: true,
			currentWindow: true,
		},
		(tabs) => {
			// ...and send a request to get Figpii...
			chrome.tabs.sendMessage(tabs[0].id, {
				from: 'FIG_popup',
				subject: 'FIG_getFigpii',
				tabID: tabs[0].id,
			});
		}
	);
});

chrome.runtime.onMessage.addListener((msg, sender, response) => {
	if (msg.from === 'FIG_content' && msg.subject === 'FIG_getFigpiiResponse') {
		if (msg.data) {
			renderTools(msg.data);
		} else {
			renderFigpiiNotFound();
		}
	}
});
