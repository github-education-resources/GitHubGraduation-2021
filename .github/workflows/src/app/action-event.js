const fs = require('fs')

class ActionsEvent {
  constructor() {
    try {
      const data = JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8'))
      this.event = data.eventData
      this.pullRequest = data.pullRequest || {}
      this.requestedReviwer = data.requestedReviewer || {}
      this.name = this.event?.action || ""
    } catch(err) {
      this.event = {}
    }
  }
}

module.exports = new ActionsEvent()
