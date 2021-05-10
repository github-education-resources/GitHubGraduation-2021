const fs = require('fs')

class ActionsEvent {
  constructor() {
    try {
      this.data = JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8'))
      this.initAttributes()
    } catch(err) {
      console.error(err)
      this.data = null
    }
  }

  initAttributes() {
    if(!this.data) {
      return
    }

    // I guess some event files don't have EventData
    this.event = this.data.eventData || this.data
    this.pull = this.data.pull_request
    this.requestedReviewer = this.data.requestedReviewer
    this.name = this.event.action
    this.pullNumber = this.pull.number
    this.pullRepo = this.pull.base.repo
    this.pullRepoOwner = this.pullRepo.owner.login
    this.pullAuthor = this.pull.user.login
  }
}

module.exports = new ActionsEvent()
