const cheerio = require('cheerio');
const {default: axios} = require('axios');
const {gdCookie} = require('../config');


async function companyQuery(url) {
	
	const resp = await axios.get(encodeURI(url), 
		{headers: {'Cookie': gdCookie}}
	);
	try{const company = parseCompany(resp.data, url);
		return company;}
	catch(e){
		console.log(e);
		return {rating: '', reviews:'', url:''};
	}
}

function parseCompany(body, url){
	const $ = cheerio.load(body);
	const page = $('#PageContent');
	const reviews = page.find('*[data-label="Reviews"]*').first().text().split(' Reviews')[0];
	const rating = page.find('.mr-xsm.css-1c86vvj.eky1qiu0').first().text();
	const name = page.find('#DivisionsDropdownComponent').text();
	return {name: name, rating: rating, reviews:reviews, url:url} ;
}

async function test(){
	const compInfo = await companyQuery('https://www.glassdoor.com/Overview/Working-at-VMware-EI_IE12830.11,17.htm');
	console.log(compInfo);
}




module.exports = {
	companyQuery:companyQuery
};