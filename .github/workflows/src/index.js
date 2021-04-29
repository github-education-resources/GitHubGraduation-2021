// "GITHUB_EVENT_NAME": "pull_request",
// "GITHUB_REF": "refs/pull/2/merge",
// "GITHUB_API_URL": "https://api.github.com",
// "GITHUB_SHA": "b69202fcb31aeca2d94b021bfe108df1251a53ca",
// "GITHUB_GRAPHQL_URL": "https://api.github.com/graphql",
// "GITHUB_ACTOR": "renz45",
// "GITHUB_JOB": "build",
// "GITHUB_BASE_REF": "main",
// "GITHUB_WORKFLOW": "Graduation Helper",


console.log("THIS IS NODE")
console.log(`sha: ${process.env.GITHUB_SHA}`)
console.log(`ref: ${process.env.GITHUB_REF}`)

// # Node:
const base = require('airtable').base('appnpTfSaHWAf964L');
// EXAMPLE USING CUSTOM CONFIGURATION
var Airtable = require('airtable');
Airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: process.env.AIRTABLE_SECRET
});
var base = Airtable.base('appnpTfSaHWAf964L');

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



