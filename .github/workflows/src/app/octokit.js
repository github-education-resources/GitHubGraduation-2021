const { Octokit, App, Action } = require("octokit")
const actionEvent = require('./action-event.js');

class Octo {
  constructor() {
    this.octokit = new Octokit({ auth: process.env.GH_SECRET });
  }

  async getContent(path) {
    const { data }  = await this.octokit.rest.repos.getContent({
      mediaType: {
        format: "raw",
      },
      owner: actionEvent.pullRepoOwner,
      repo: actionEvent.pullRepo.name,
      path: path,
      ref: actionEvent.pull.head.sha
    });

    return data
   }

  async fetchPr(pr) {
    const { repository: { pullRequest } } = await this.octokit.graphql(
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
        name: actionEvent.pullRepo.name,
        owner: actionEvent.pullRepoOwner,
        pr: pr
      }
    )
    return pullRequest
  }
}

module.exports = new Octo()
