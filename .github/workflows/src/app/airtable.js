const Airtable = require('airtable')

Airtable.configure({
  endpointUrl: 'https://api.airtable.com',
  apiKey: "key4mXwIMvKyFZQzB"
});

const GRADUATION_TABLE = "appnpTfSaHWAf964L"

class ATable {
  fetchGraduates() {
    const airtable = Airtable.base(GRADUATION_TABLE);
    return new Promise((resolve, reject)=>{
      const data = []
      airtable('Graduates Data').select({
        // Selecting the first 3 records in Pending Reviews:
        maxRecords: 3,
        view: "Pending Reviews",
        // filterByFormula: `{GitHub Username} = '${}'`
      }).eachPage(function page(records, fetchNextPage) {
        // This function (`page`) will get called for each page of records.
        records.forEach(function(record) {
          let login = record.get('GitHub Username')
          data.push(login)
        });

        // To fetch the next page of records, call `fetchNextPage`.
        // If there are more records, `page` will get called again.
        // If there are no more records, `done` will get called.
        // fetchNextPage();

      }, function done(err) {
        if (err) { console.error(err); return; }
      });

      resolve(data)
    })
  }
}

module.exports = new ATable()
