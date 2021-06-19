const {getCsvContents,writeCsvContents, csvIndexes} = require('./utilities');

const csvContents = getCsvContents();




function deleteJobs(){
	const deleteIds = process.argv[2].split(',');
	console.log(deleteIds);
	deleteIds.forEach(deleteId =>{
		const jobIndex = csvContents.findIndex(job => job[csvIndexes.idIndex] === deleteId);
		csvContents.splice(jobIndex, 1);
	});
	writeCsvContents(csvContents);
	console.log(new Date());
}

deleteJobs();