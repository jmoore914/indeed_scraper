const axios = require('axios').default;
const cheerio = require('cheerio');
const {gdCookie} = require('../config');

const host = 'https://www.glassdoor.com';

async function companySearchQuery(companyName) {
	console.log(companyName);
	
	const url = `${host}/Search/results.htm?keyword="${companyName}"`;
	const resp = await axios.get(encodeURI(url), 
		{headers: {'Cookie': gdCookie}}
	);
	try{const company = parseCompany(resp.data);
		return company;}
	catch(e){
		console.log(e);
		return {name: '', rating: '', reviews:'', url:''};
	}
		
		
}

function parseCompany(body){
	const $ = cheerio.load(body);
	const page = $('#Discover');
	const company = $(page.find('.company-tile.d-flex.flex-column.flex-sm-row.align-items-start.p-std.mb-sm-std.css-poeuz4.css-1wh1oc8').first());
	const url = host + company.attr('href');
	const rating = company.find('.small.css-b63kyi').first().text().split(' ')[0].trim();
	const reviews = company.find('.d-flex.align-items-center.pt-std.css-1h49lgr').first().find('span').first().text().trim();
	const name = company.find('h3').first().text();
	return {name: name, rating: rating, reviews:reviews, url:url} ;
}

async function test(){
	const compInfo = await companySearchQuery('vmware');
	console.log(compInfo);
}


module.exports = {
	companySearchQuery:companySearchQuery
};