
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
  ]).catch((errors)=>{
    for(const error of errors) {
      console.log(error)
    }
  })

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
  let content
  const isFilePathValid = fileValidator.isValidPaths(fileNames)

  try {
    content = isFilePathValid && await octokit.getContent(`_data/${actionEvent.pullAuthor}/${actionEvent.pullAuthor}.md`)
  } catch(err) {
    console.log(err)
  }

  if(content) {
    isMarkdownValid = await fileValidator.isMarkdownValid(content)
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


  // ############################ bot posting flow ############################
  // - show initial message with spinner when checks are running
  // - General message with a list of errors
  //   - Already Participated - close PR
  //   - Not applied for SDP
  //   - Not completed the shipping form
  //   - invalid files
  //     - comment on files review request changes
  //   - invalid markdown
  //     - comment on files review request changes
  // - collapse requested changes comment
  // - welcome and congrats
  // - merge PR

  const userAgreesCoc = user2021?.get("Code of Conduct").length > 0
  const feedback = []

  if(user2020) {
    console.log("user already Participated in 2020")
    feedback.push("**I'm really sorry! It looks like you've already graduated in a previous year.**")
    // TODO close PR
  } else {
    if(!hasSdp) {
      console.log("User has not applied for SDP")
      feedback.push("* *I'm not seeing a valid student developer pack approval, please submit an [application](https://education.github.com/discount_requests/student_application) to get started*")
    }

    if(!completedShippingForm) {
      console.log("user has not completed the shipping form")
      feedback.push("* *It looks like you still need to fill out the [shipping form](https://airtable.com/shrM5IigBuRFaj33H) to continue*")
    }

    if(!isFilePathValid.isValid) {
      console.log('Files have errors: \n' + isFilePathValid.errors.join('\n'))
      feedback.push(`* *Uh Oh! I've found some issues with where you have created your files!* \n\t${isFilePathValid.errors.join('\n')}`)
    }

    if(!isMarkdownValid.isValid) {
      console.log("markdown is invalid")
      feedback.push(`* *Please take another look at your markdown file, there are errors:* \n\t${isMarkdownValid.errors.join('\n')}`)
    }

    if(!userAgreesCoc) {
      console.log("User has not agreed to COC")
      feedback.push("* *You need to agree to our COC pretty please!*")
    }

    let feedBackMessage = ""

    if(feedback.length) {
      feedBackMessage = `
### I have a few items I need you to take care of before I can merge this PR:\n
${feedback.join('\n')}
      `
    } else {
      // All checks pass
      feedBackMessage = "It looks like you're all set! Thanks for the graduation submission."
      // TODO merge PR
    }

    console.log(feedBackMessage)
    try {
    await octokit.createReview(`
** Hi ${ actionEvent.pullAuthor }, **
** Welcome to graduation! **

${ feedBackMessage }
    `, feedback.length ? "REQUEST_CHANGES" : "APPROVE")
    } catch(err) {
      console.log(err)
    }
  }
})()
