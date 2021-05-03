const { Octokit, App, Action } = require("octokit")

class Octo {
  async fetchPr(pr) {
    const octokit = new Octokit({ auth: process.env.GH_SECRET });

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
    )
    return pullRequest
  }
}

module.exports = new Octo()
