FIGPII.TestingEngine.Repository[321725].targetingGroups[1].targetRules[0].value;
FIGPII.TestingEngine.Repository[322030].name
	.toLocaleLowerCase()
	.includes('targeted');

for (const [key, value] of Object.entries(FIGPII.TestingEngine.Repository)) {
	//console.log(`${key}: ${JSON.stringify(value)}`);
	console.log(
		'id',
		value.id,
		'name',
		value.name,
		'targeting',
		value.targetingGroups,
		'targeting',
		value.targetingGroups[1].targetRules[0].value
	);
	console.log(typeof value.pages);
	for (const [pagesKey, pagesValue] of Object.entries(value.pages)) {
		console.log(
			'id',
			pagesValue.id,
			'is_original',
			pagesValue.is_original,
			'is_winner',
			pagesValue.is_winner,
			'name',
			pagesValue.name
		);
	}
	value.targetingGroups.forEach((target) => {
		console.log(target.type, target.inclusion);
		target.targetRules.forEach((rule) => {
			console.log('rule', rule, 'type', rule.type, 'value', rule.value);
		});
	});
}

FIGPII.GetAllActiveRepositories();

FIGPII.TestingEngine.Decision.FetchAllFromCookies();

FIGPII.TestingEngine.Repository;

FIGPII.TestingEngine.Options.ActiveVariationID;
