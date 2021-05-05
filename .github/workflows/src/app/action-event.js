const fs = require('fs')

class ActionsEvent {
  constructor() {
    try {
      console.log("path: " + process.env.GITHUB_EVENT_PATH)
      this.eventData = JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8'))
      // add the number back to the PR object
      this.eventData.pull_request.number = this.eventData.number
      this.pullRequest = this.eventData?.pull_request || {}
      this.requestedReviwer = this.eventData?.requested_reviewer || {}
      this.name = this.eventData?.action || ""
    } catch(err) {
      this.eventData = {}
    }
  }
}

module.exports = new ActionsEvent()
