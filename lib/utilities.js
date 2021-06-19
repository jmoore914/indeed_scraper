const separator = '|||';
const fs = require('fs');

function sleep(sec) {
	return new Promise(resolve => setTimeout(resolve, sec*1000));
}

const csvIndexes = {
	deleteIndex : 0,
	titleIndex : 1,
	indeedCompanyIndex : 2,
	indeedCompanyScoreIndex : 3,
	salaryIndex : 4,
	indeedUrlIndex : 5,
	idIndex : 6,
	glassdoorCompanyIndex: 7,
	glassdoorCompanyScoreIndex: 8,
	glassdoorCompanyReviewsIndex: 9,
	glassdoorCompanyUrlIndex: 10,
	companiesMatchIndex: 11
    
};

const csvGlassdoorIndexes = Object.keys(csvIndexes)
	.filter(colName => colName.startsWith('glassdoor'))
	.map(key => csvIndexes[key]);


function unique(arr){
	return [... new Set(arr)];
}

function getAllPreviouslyScrapedIds(){
	const prevJson = getPreviouslyScrapedIds();
	const allIds = [];
	Object.keys(prevJson).forEach(jobType =>{
		allIds.concat(prevJson[jobType]);
	});
}

function getQueryObjPreviouslyScrapedIds(title){
	const prevJson = getPreviouslyScrapedIds();
	return prevJson[title];
}

const filePathPrefix = __dirname + '/../files/';

const scrapedIdsFilePath = filePathPrefix + 'scrapedIds.json';
const jobsCsvFilePath = filePathPrefix + 'jobs.csv';
const scrapedCompaniesFilePath = filePathPrefix + 'scrapedCompanies.json';
const matchedCompaniesFilePath = filePathPrefix + 'matchedCompanies.json';

function getPreviouslyScrapedIds(){
	const idsRaw = fs.readFileSync(scrapedIdsFilePath, 'utf8');
	return JSON.parse(idsRaw);
}

function writePreviouslyScrapedIds(scrapedIds){
	fs.writeFileSync(scrapedIdsFilePath, JSON.stringify(scrapedIds, null, 2));

}

function getPreviouslyScrapedCompanies(){
	const companiesRaw = fs.readFileSync(scrapedCompaniesFilePath, 'utf8');
	return JSON.parse(companiesRaw);
}
function writePreviouslyScrapedCompanies(scrapedCompanies){
	fs.writeFileSync(scrapedCompaniesFilePath, JSON.stringify(scrapedCompanies, null, 2));
}


function getMatchedCompanies(){
	const companiesRaw = fs.readFileSync(matchedCompaniesFilePath, 'utf8');
	return JSON.parse(companiesRaw);
}

function writeMatchedCompanies(matchedCompanies){
	fs.writeFileSync(matchedCompaniesFilePath, JSON.stringify(matchedCompanies, null, 2));

}

function getCsvContents(){
	const csvContentsUltraRaw = fs.readFileSync(jobsCsvFilePath, 'utf8');
	const csvContentsRaw = csvContentsUltraRaw.split(/\r?\n/);
  
	return csvContentsRaw.map(row => row.split(separator));
}

function writeCsvContents(csvContents){
	fs.writeFileSync(jobsCsvFilePath, csvContents.map(job => {
		console.log(job);
		return job ? job.join(separator) : '';
	}).join('\n'));
}


	




module.exports = {
	separator:separator,
	csvIndexes: csvIndexes,
	getPreviouslyScrapedIds: getPreviouslyScrapedIds,
	getPreviouslyScrapedCompanies: getPreviouslyScrapedCompanies,
	getMatchedCompanies: getMatchedCompanies,
	getCsvContents: getCsvContents,
	writePreviouslyScrapedIds: writePreviouslyScrapedIds,
	writePreviouslyScrapedCompanies: writePreviouslyScrapedCompanies,
	writeMatchedCompanies: writeMatchedCompanies,
	writeCsvContents: writeCsvContents,
	sleep:sleep,
	getAllPreviouslyScrapedIds:getAllPreviouslyScrapedIds,
	getQueryObjPreviouslyScrapedIds: getQueryObjPreviouslyScrapedIds,
	scrapedIdsFilePath: scrapedIdsFilePath,
	scrapedCompaniesFilePath: scrapedCompaniesFilePath,
	jobsCsvFilePath: jobsCsvFilePath,
	csvGlassdoorIndexes:csvGlassdoorIndexes,
	unique:unique,
	matchedCompaniesFilePath:matchedCompaniesFilePath
};