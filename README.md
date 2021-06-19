# indeed_scraper



### A Node.js app for getting job listings from Indeed.com

## Description

The app includes the following functionalities:
  * Get new job listings from Indeed that match the search terms and exclude terms
  * Gets company info from Glassdoor.com (optional)
  * Outputs job information into csv file
  * Excel file to run node scripts and organize/rank the jobs in the csv file


## Installation

Clone the repo into a folder of your choice.

```
git clone https://github.com/jmoore914/indeed_scraper.git
```

Install dependencies.
```
npm i
```

Configure the search parameters in config.js
```
// Glass door cookie; if left blank will not get company info from glassdoor
module.exports.gdCookie = 'yourGlassDoorCookie';

// Terms to search for (e.g. software, javascript, developer)
module.exports.searchTerms = ['software', 'developer', 'frontend', 'backend', 'fullstack', 'node', 'scala', 'express', 'javascript', 'typescript', 'js', 'ts'];

// Terms to exclude in search (e.g. senior, lead, c++)
module.exports.excludeTerms = ['senior', 'sr', 'staff', 'intern', 'temp'];

// Job location (e.g. remote, new york)
module.exports.location = 'remote';

// Job posting age in days 
module.exports.age = '3';
```

Excel App:

* Scrape: run the scipt getting all matching job listings
* Check: ensure that all Indeed companies match the Glassdoor companies
* Update: Update the excel sheet with any new information in the csv (runs automatically after Scrape and Check)
* Delete: Place an "X" in the "Delete?" column for any rows you would like removed then click the button to remove them

## Acknowledgements

This app is based-on and forked from rynobax's npm package here: https://www.npmjs.com/package/indeed-scraper
