const Airtable = require('airtable')

Airtable.configure({
  endpointUrl: 'https://api.airtable.com',
  apiKey: process.env.AIRTABLE_SECRET
});

const GITHUB_GRADUATION = "bipux0j8oGEJuReSb"
const GRADUATES_2020 = "Graduates Data"
const GRADUATES_2021 = "Graduation 2021"

class ATable {
  constructor() {

  }

  userParticipated2020(githubLogin) {
    return fetchGraduate(githubLogin, GRADUATES_2020)
  }

  fetch2021Graduate(githubLogin) {
    return fetchGraduate(githubLogin, GRADUATES_2021)
  }

  fetchGraduate(githubLogin, table) {
    const airtable = Airtable.base(GITHUB_GRADUATION);
    return new Promise((resolve, reject)=>{
      const data = []
      airtable(table).select({
        // Selecting the first 3 records in Pending Reviews:
        maxRecords: 1,
        filterByFormula: `({GitHub Username} = '${githubLogin}')`
        // view: "Pending Reviews",
        // filterByFormula: `{GitHub Username} = '${}'`
      }).eachPage(function page(records, fetchNextPage) {
        // This function (`page`) will get called for each page of records.
        data = records
      }, function done(err) {
        if (err) { console.error(err); return; }
      });

      resolve(data[0])
    })
  }
}

module.exports = new ATable()
