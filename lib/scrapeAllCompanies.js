'use strict';
const utils = require('./utilities');
const {companySearchQuery} = require('./companySearchScraper.js');


async function scrapeAllCompanies(){
	const csvContents = utils.getCsvContents();
	const companiesJson = utils.getPreviouslyScrapedCompanies();

	for (const [index, job] of csvContents.entries()) {
		const company = job[utils.csvIndexes.indeedCompanyIndex];
		if(company !== 'Company'){
			let companyInfo;
			if(companiesJson.all.includes(company)){
				companyInfo = companiesJson[company];
			}
			else{
				companyInfo = await companySearchQuery(company);
				companiesJson[company] = companyInfo;
				companiesJson.all.push(company);
				await utils.sleep(30);
			}
        
			csvContents[index][utils.csvIndexes.glassdoorCompanyIndex] = companyInfo.name;
			csvContents[index][utils.csvIndexes.glassdoorCompanyReviewsIndex] = companyInfo.reviews;
			csvContents[index][utils.csvIndexes.glassdoorCompanyScoreIndex] = companyInfo.rating;
			csvContents[index][utils.csvIndexes.glassdoorCompanyUrlIndex] = companyInfo.url;
		}    
	}
	utils.writeCsvContents(csvContents);
	utils.writePreviouslyScrapedCompanies(companiesJson);

}



scrapeAllCompanies();