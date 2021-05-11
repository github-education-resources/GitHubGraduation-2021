const airtable = require('./airtable.js');
const fs = require('fs')

;(async ()=>{
  const grad2020 = airtable.fetchAll2020()
  const grad2021 = airtable.fetchAll2021()
  const content = JSON.stringify({grad2020, grad2021})

  fs.writeFile('./app/data/airtable.json', content, err => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
  })
})()
