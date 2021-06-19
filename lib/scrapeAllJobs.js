'use strict';
const indeedScraper = require('./jobScraper.js');
const utils = require('./utilities');
const {companySearchQuery} = require('./companySearchScraper.js');
const{searchTerms, excludeTerms, location, age, gdCookie} = require('../config');



const idsJson = utils.getPreviouslyScrapedIds();
searchTerms.forEach(searchTerm => {
	if(!idsJson[searchTerm]){
		idsJson[searchTerm] = [];
	}
});
utils.writePreviouslyScrapedIds(idsJson);
const ids = idsJson.all;
const companiesJson = utils.getPreviouslyScrapedCompanies();
const csvContents = utils.getCsvContents();

async function queryAllQueryObjs(queryObjs){
	const sleepTime = 75;
	for (const queryObj of queryObjs){
		console.log(queryObj.title);
		await querySingleQueryObj(queryObj);
		await utils.sleep(sleepTime);		
	}
}

async function querySingleQueryObj(queryObj){
	const queryResults = await query(queryObj);
	console.log('Queried: ' + queryResults.length);
	const filteredResults = filterJobs(queryResults);
	console.log('Filtered: ' + filteredResults.length);

	for (const job of filteredResults) {
		if(job.title){
			ids.push(job.id);
			idsJson[queryObj.title]. push(job.id);
			let companyInfo;

			if(companiesJson.all.includes(job.company)){
				companyInfo = companiesJson[job.company];
			}
			else if(gdCookie){

				companyInfo = await companySearchQuery(job.company);
				companiesJson[job.company] = companyInfo;
				companiesJson.all.push(job.company);
			}
			const csvRow = new Array(Object.keys(utils.csvIndexes).length);
			csvRow[utils.csvIndexes.showIndex] = 'X';
			csvRow[utils.csvIndexes.titleIndex] = job.title;
			csvRow[utils.csvIndexes.indeedCompanyIndex] = job.company;
			csvRow[utils.csvIndexes.indeedCompanyScoreIndex] = job.companyRating;
			csvRow[utils.csvIndexes.salaryIndex] = `"${job.salary}"`;
			csvRow[utils.csvIndexes.indeedUrlIndex] = job.url;
			csvRow[utils.csvIndexes.idIndex] = job.id;
			csvRow[utils.csvIndexes.glassdoorCompanyIndex] = companyInfo.name;
			csvRow[utils.csvIndexes.glassdoorCompanyScoreIndex] = companyInfo.rating;
			csvRow[utils.csvIndexes.glassdoorCompanyReviewsIndex] = companyInfo.reviews;
			csvRow[utils.csvIndexes.glassdoorCompanyUrlIndex] = companyInfo.url;
			csvContents.push(csvRow);
		}
	}
}

function query(queryObject) {
	return indeedScraper.query(queryObject);
}

function filterJobs(queryResults){
	return queryResults
		.filter(job => {
			const lTitle = job.title.toLowerCase();
			return !ids.includes(job.id) 
    			&& job.companyRating >=3
				&& !excludeTerms.some(excludeTerm => lTitle.includes(excludeTerm.toLowerCase));
		
		});
}

function createAllQueryObjs(){
	
	const constQueryOptions = {
		host: 'www.indeed.com',
		city: location,
		jobType: 'fulltime',
		maxAge: age,
		sort: 'date',
		limit: 1000
	};

	return searchTerms.map(searchTerm => {
		return createQueryObject(searchTerm.toLowerCase());
	});


	function createQueryObject(query){
		const queryObj = cloneObject(constQueryOptions);
		queryObj.title = query;
		return queryObj;
	}

	function cloneObject(obj){
		return JSON.parse(JSON.stringify(obj));
	}
}


module.exports.main = async function main(){
	const allQueryObjs = createAllQueryObjs();
	await queryAllQueryObjs(allQueryObjs);
	idsJson.all = ids;
	utils.writeCsvContents(csvContents);
	utils.writePreviouslyScrapedIds(idsJson);
	utils.writePreviouslyScrapedCompanies(companiesJson);
};