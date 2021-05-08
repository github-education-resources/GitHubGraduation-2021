
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
const fileValidator = require('./app/file-validator.js');

;(async ()=>{
  const results = await Promise.all([
    octokit.fetchPr(actionEvent.pullNumber),
    airtable.userParticipated2020(actionEvent.pullAuthor),
    educationWeb.hasPack(actionEvent.pullAuthor),
    airtable.fetch2021Graduate(actionEvent.pullAuthor)
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

  const fileNames = pull.files.edges.map((file)=>{
    return file.node.path
  })

  let isMarkdownValid
  const isFilePathValid = fileValidator.isValidPaths(fileNames)
  const content = isFilePathValid && await octokit.getContent(`_data/${actionEvent.pullAuthor}/${actionEvent.pullAuthor}.md`)

  if(content) {
    isMarkdownValid = fileValidator.isMarkdownValid(content)
  }

  console.log(content)

 // I have read the instructions on the README file before submitting my application.
 // I made my submission by creating a folder on the _data folder and followed the naming convention mentioned in the instructions (<username>) and markdown file.
 // I have submitted a swag shipping form.
 // I have used the Markdown file template to add my information to the Year Book.
 // I understand that a reviewer will merge my pull request after examining it or ask for changes in case needed.
 // I understand I should not tag or add a reviewer to this Pull Request.
 // I have added the event to my Calendar.

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
  } else if(!isFilePathValid.isValid) {
    console.log('Files have errors: \n' + isFilePathValid.errors.join('\n'))
  } else if(!isMarkdownValid.isValid) {
    console.log("markdown is invalid")
  } else if(!userAgreesCoc) {
    console.log("User has not agreed to COC")
  } else {
    // check for merge conflicts
    //
    console.log("Congrats you graduated!")
  }
})()
