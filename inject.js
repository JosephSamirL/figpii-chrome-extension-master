// this function gets ActiveVariationID and repository from FIGPII object and send it to content.js
function getFigpii() {
	let Figpii = window.FIGPII;
	let data = null;
	if (Figpii && Figpii.TestingEngine) {
		data = {
			activeTools: Figpii.TestingEngine.Options.ActiveVariationID,
			repository: Figpii.TestingEngine.Repository,
		};
	}
	window.postMessage(
		{
			from: 'FIG_page',
			subject: 'FIG_getFigpiiResponse',
			data,
		},
		'*'
	);
}
// appends getFigpii function to current tab document
(function () {
	let script = document.createElement('script');
	script.appendChild(document.createTextNode('(' + getFigpii + ')();'));
	(document.body || document.head || document.documentElement).appendChild(
		script
	);
})();
