const {companyQuery} = require('./companyScraper');
const prompts = require('prompts');
const utils = require('./utilities');

async function correctCompanyMismatches(){
	
	const matchedCompanies = utils.getMatchedCompanies();
	const csvContents = utils.getCsvContents();

	const scrapedCompanies = utils.getPreviouslyScrapedCompanies();
	const mismatches = Object.keys(matchedCompanies).filter(company => matchedCompanies[company] === 'n');
	for(const company of mismatches){
		await correctWrongCompanyInScrapedCompany(company);
	}

	utils.writeMatchedCompanies(matchedCompanies);


	async function correctWrongCompanyInScrapedCompany(company){
		const ans = await prompts({
			type: 'text',
			name: 'url',
			message: `What is the Glassdoor url for  "${company}"?
Search results: https://www.glassdoor.com/Reviews/${encodeURI(company)}-reviews-SRCH_KE0,6.htm
			`
		});
		
		const url = ans.url;
		matchedCompanies[company] = 'y';

		if(url){
			const companyInfo = await companyQuery(url);
			scrapedCompanies[company] = companyInfo;
		}
		else{
			scrapedCompanies[company = {name: '', rating: '', reviews:'', url:''}];
		}


		
	}
}