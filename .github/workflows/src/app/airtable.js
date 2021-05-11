const Airtable = require('airtable')
const fs = require('fs')

Airtable.configure({
  endpointUrl: 'https://api.airtable.com',
  apiKey: process.env.AIRTABLE_SECRET
});

const GITHUB_GRADUATION = "bipux0j8oGEJuReSb"
const GRADUATES_2020 = "Graduation 2020"
const GRADUATES_2021 = "Graduation 2021"

let cachedJson
let cachedData = {}

try {
  cachedJson = fs.readFileSync('./app/data/airtable.json"', 'utf8')
  cachedData = JSON.parse(json)
} catch(err) {
  // noop
}


class ATable {
  constructor() {

  }

  userParticipated2020(githubLogin) {
    const cachedData = this.fetchFromCache(githubLogin, GRADUATES_2020)
    if(cachedData) {
      console.log("found cached 2020 data")
      return new Promise(cachedData)
    }

    return this.fetchGraduate(githubLogin, GRADUATES_2020)
  }

  fetch2021Graduate(githubLogin) {
    const cachedData = this.fetchFromCache(githubLogin, GRADUATES_2021)
    if(cachedData) {
      console.log("found cached 2021 data")
      return new Promise(cachedData)
    }

    return this.fetchGraduate(githubLogin, GRADUATES_2021)
  }

  async fetchAll(table) {
    const airtable = Airtable.base(GITHUB_GRADUATION);
    const users = []

    return airtable(GRADUATES_2020).select().eachPage(function page(records, fetchNextPage) {
      // This function (`page`) will get called for each page of records.

      records.forEach(function(record) {
        users.push(record.fields)
      });

      // To fetch the next page of records, call `fetchNextPage`.
      // If there are more records, `page` will get called again.
      // If there are no more records, `done` will get called.
      fetchNextPage();

    }, function done(err) {
        if (err) { console.error(err); return; }
    });
  }

  async fetchAll2021() {
    return await this.fetchAll(GRADUATES_2021)
  }

  async fetchAll2020() {
    return await this.fetchAll(GRADUATES_2020)
  }

  fetchFromCache(githubLogin, table) {
    let data, userData

    if(table === GRADUATES_2020) {
      data = cachedData["grad2020"]
    } else if(table === GRADUATES_2021) {
      data = cachedData["grad2021"]
    }

    if(data) {
      userData = data.find((user)=>{
        return user["GitHub Username"] === githubLogin
      })
    }

    return userData
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
        if (err) {
          if(err.error === "NOT_FOUND") {
            resolve(false)
          }

          reject(err)
          return;
        }
      });

      resolve(data[0])
    }).catch((err)=>{
      reject(err)
    })
  }
}

module.exports = new ATable()
