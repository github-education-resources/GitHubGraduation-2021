
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
  console.log("load env")
  const result = require('dotenv').config()

  if (result.error) {
    throw result.error
  }
} else {

}

const airtable = require('./app/airtable.js');
const octokit = require('./app/octokit.js');
const actionEvent = require('./app/action-event.js');
const educationWeb = require('./app/education-web.js');

(async ()=>{
  const result = await educationWeb.hasPack()

  console.log(result)
  return


  console.log(actionEvent.pullRequest)
  const pull = await octokit.fetchPr(actionEvent.pullRequest?.number)

  // checks
  const user2020 = await airtable.userParticipated2020(pull.author.name)

  // const hasSdp = TODO

  const user2021 = await airtable.fetch2021Graduate(pull.author.name)
  const completedShippingForm = user2021.get("Address Line 1").length > 0

  // pull.files TODO
  // const pathIsCorrect = TODO

  // pull.body
  // const markdownValid = TODO

  // const userAgreesCoc = user2021.aggreesToCoc TODO

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
