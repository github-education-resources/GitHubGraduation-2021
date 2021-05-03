
if(!process.env.GITHUB_ACTIONS) {
  const result = require('dotenv').config();

  if (result.error) {
    throw result.error
  }
}

const Airtable = require('airtable');
const { Octokit, App, Action } = require("octokit");

Airtable.configure({
  endpointUrl: 'https://api.airtable.com',
  apiKey: process.env.AIRTABLE_SECRET
});

(async ()=>{

// "GITHUB_EVENT_NAME": "pull_request",
// "GITHUB_REF": "refs/pull/2/merge",
// "GITHUB_API_URL": "https://api.github.com",
// "GITHUB_SHA": "b69202fcb31aeca2d94b021bfe108df1251a53ca",
// "GITHUB_GRAPHQL_URL": "https://api.github.com/graphql",
// "GITHUB_ACTOR": "renz45",
// "GITHUB_JOB": "build",
// "GITHUB_BASE_REF": "main",
// "GITHUB_WORKFLOW": "Graduation Helper",
// "GITHUB_REPOSITORY": "campus-experts/GitHubGraduation-2021",

const GRADUATION_TABLE = "appnpTfSaHWAf964L"
const airtable = Airtable.base(GRADUATION_TABLE);
const [ owner, repoName ] = process.env.GITHUB_REPOSITORY.split('/')

const fs = require('fs')
const ev = JSON.parse(
  fs.readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8')
)

console.log(ev)
const pr = ev.pull_request.number

// let pr
// console.log("EVENT NAMEL: " + process.env.GITHUB_EVENT_NAME)
// console.log(process.env.GITHUB_REF)
// if (process.env.GITHUB_EVENT_NAME === "pull_request_target") {
//   pr = process.env.GITHUB_REF.split("/")[2]
// }

// Create a personal access token at https://github.com/settings/tokens/new?scopes=repo
const octokit = new Octokit({ auth: process.env.GH_SECRET });

// Compare: https://docs.github.com/en/rest/reference/users#get-the-authenticated-user
// const {
//   data: { login },
// } = await octokit.rest.users.getAuthenticated();
// console.log("Hello, %s", login);

console.log("Actor: " + process.env.GITHUB_ACTOR)
airtable('Graduates Data').select({
  // Selecting the first 3 records in Pending Reviews:
  maxRecords: 3,
  view: "Pending Reviews",
  // filterByFormula: `{GitHub Username} = '${}'`
}).eachPage(function page(records, fetchNextPage) {
  // This function (`page`) will get called for each page of records.
  records.forEach(function(record) {
      console.log('Retrieved', record.get('GitHub Username'));
  });

  // To fetch the next page of records, call `fetchNextPage`.
  // If there are more records, `page` will get called again.
  // If there are no more records, `done` will get called.
  // fetchNextPage();

}, function done(err) {
  if (err) { console.error(err); return; }
});

const { repository: { pullRequest } } = await octokit.graphql(
  `
    query myQuery($name: String!, $owner: String!, $pr: Int!){
      repository(name: $name, owner: $owner) {
          pullRequest(number: $pr) {
            author {
              login
            }
            bodyText
            closed
            comments(first: 100) {
              edges {
                node {
                  author {
                    login
                  }
                  body
                  url
                }
              }
            }

            files(first: 100) {
              edges {
                node {
                  path
                  additions
                  deletions
                }
              }
            }
          }
        }
    }

  `,
  {
    name: "GitHubGraduation-2021",
    owner: "campus-experts",
    pr: pr
  }
);

console.log(pullRequest)


// const {
//   data: { login },
// } = await octokit.rest.repos.pulls()
// console.log("Hello, %s", login);



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




})()
