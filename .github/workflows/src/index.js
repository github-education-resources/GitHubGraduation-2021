
// stepper

// reverse parse markdown from bot comment, determine which step the PR is on:

// * Participated in 2020
//   * no - close PR
// * SDP?
//   * no - request changes
// * Shipping form complete?
//   * no - request changes
// * Correct file path
//   * no - request changes
// * Markdown correct?
//   * no - request changes
// * Follows COC
//   * no - close PR
// * congrats!
// * merge PR

const fs = require('fs')
const airtable = require('./app/airtable.js');
const octokit = require('./app/octokit.js');

if(!process.env.GITHUB_ACTIONS) {
  const result = require('dotenv').config()

  if (result.error) {
    throw result.error
  }
} else {
  // const [ owner, repoName ] = process.env.GITHUB_REPOSITORY.split('/')
  const eventData = JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8'))
  const pr = eventData.pull_request.number
}

(async ()=>{
  const grads = await airtable.fetchGraduates()
  const pull = await octokit.fetchPr(3)
  console.log(grads)
  console.log(pull)
})()
