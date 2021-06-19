const prompts = require('prompts');

const utils = require('./utilities');

const matchedCompanies = utils.getMatchedCompanies();
const csvContents = utils.getCsvContents();


async function checkAllCompanies(){


	for (const [index, csvRow] of csvContents.entries()) {
		if(index > 0){
			const newRow = await checkCompany(csvRow);
			csvContents[index] = newRow;
		}

	}
	utils.writeMatchedCompanies(matchedCompanies);
	utils.writeCsvContents(csvContents);
}


async function checkCompany(csvRow){
    
	const indeedName = csvRow[utils.csvIndexes.indeedCompanyIndex];
	const lIndeedName = indeedName ? indeedName.toLowerCase() : '';
	const glassdoorName = csvRow[utils.csvIndexes.glassdoorCompanyIndex];
	const lGlassdoorName = glassdoorName ? glassdoorName.toLowerCase() : '';

	if(glassdoorName===''){
		matchedCompanies[lIndeedName] = 'n';
	}

	if(matchedCompanies[lIndeedName]){
		if(matchedCompanies[lIndeedName] === 'n'){
			csvRow[utils.csvIndexes.companiesMatchIndex] = 'X';
		}
		return csvRow;
	}


	const endTags= [
		', inc.',
		' inc',
		' inc.',
		', llc',
		' llc',
		' corporation'
	];

	const endTagIndeed = endTags.find(tag=> lIndeedName.endsWith(tag));
	const subbedIndeed = endTagIndeed ? lIndeedName.split(endTagIndeed).slice(0, -1).join(endTagIndeed) : lIndeedName;
	const endTagGlassdoor = endTags.find(tag=> lGlassdoorName.endsWith(tag));
	const subbedGlassDoor = endTagGlassdoor ? lIndeedName.split(endTagGlassdoor).slice(0, -1).join(endTagGlassdoor) : lGlassdoorName;
	





	if(subbedIndeed === subbedGlassDoor){
		matchedCompanies[lIndeedName] = 'y';
		return csvRow;
	}

	
    

	async function askUserInput(){
		const prompt = await prompts({
			type: 'text',
			name: 'ans',
			message: `Does "${indeedName}" match "${glassdoorName}"?
            [y]es, [n]o, [u]nsure?`
		});
        

		const lAns = prompt.ans.toLowerCase();
		if(['y', 'yes', 'n', 'no', 'u', 'unsure'].includes(lAns)){
			if('y' === lAns.charAt(0)){
				matchedCompanies[lIndeedName] = 'y';
			}
			else if('n' === lAns.charAt(0)){
				matchedCompanies[lIndeedName] = 'n';
			}
			else if('u' === lAns.charAt(0)){
				console.log('Indeed url: ' + csvRow[utils.csvIndexes.indeedUrlIndex]);
				console.log('Glassdoor url: ' + csvRow[utils.csvIndexes.glassdoorCompanyUrlIndex]);
				await askUserInput();
			}
			else{
				console.log('Invalid input.');
			}
		}
	}


	await askUserInput();

}



checkAllCompanies();

