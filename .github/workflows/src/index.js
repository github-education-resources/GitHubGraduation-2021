
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

if(!process.env.GITHUB_ACTIONS) {
  const result = require('dotenv').config()

  if (result.error) {
    throw result.error
  }
}

const airtable = require('./app/airtable.js');
const octokit = require('./app/octokit.js');
const actionEvent = require('./app/action-event.js');
const educationWeb = require('./app/education-web.js');

const pr = actionEvent.pullRequest
const prNumber = pr.number
const prRepo = pr.base.repo
const userLogin = pr.user.login
const repoName = prRepo.name
const repoOwner = prRepo.owner.login

process.env.REPO_NAME = repoName
process.env.REPO_OWNER = repoOwner

;(async ()=>{
  const results = await Promise.all([
    octokit.fetchPr(prNumber),
    airtable.userParticipated2020(userLogin),
    educationWeb.hasPack(userLogin),
    airtable.fetch2021Graduate(userLogin)
  ])

  const pull = results[0]
  const user2021 = results[3]

  // checks

  // graduated already in 2020?
  const user2020 = results[1]

  // approved for the student/teacher development pack
  const hasSdp = results[2]

  // Has the user completed the shipping form? (address must exist for the form to be submitted)
  const completedShippingForm = user2021?.get("Address Line 1").length > 0

  // pull.files TODO
  // const pathIsCorrect = TODO

  // pull.body
  // const markdownValid = TODO

  // #################### TODO CACHE AIR TABLE SOMEHOW ########################
  // * cache the entire base in a json file with actions
  // * if the user checks come back negative, query the api directly to double check
  // * if it comes back different, then trigger a cache rebuild

  const userAgreesCoc = user2021?.get("Code of Conduct").length > 0

  if(user2020) {
    console.log("user already Participated in 2020")
  } else if(!hasSdp) {
    console.log("User has not applied for SDP")
  } else if(!completedShippingForm) {
    console.log("user has not completed the shipping form")
  } else if(!pathIsCorrect) {
    console.log("user file path is incorrect")
  } else if(!markdownValid) {
    console.log("markdown is invalid")
  } else if(!userAgreesCoc) {
    console.log("User has not agreed to COC")
  } else {
    console.log("Congrats you graduated!")
  }
})()
