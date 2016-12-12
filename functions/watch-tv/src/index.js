const Alexa = require('alexa-sdk')
const Intent = require('alexa-constants').Intent
const TuneTvIntent = require('./intentHandlers/TuneTvIntentHandler')
const WatchTvIntent = require('./intentHandlers/watchTvIntentHandler')

/* eslint-disable import/no-unassigned-import */
require('../model/intents.js')
/* eslint-enable import/no-unassigned-import */

const handlers = {
  [Intent.Help] () {
    this.emit(':ask',
      'You can tell me to watch TV',
      'I have no idea what you are saying'
    )
  },
  TuneTvIntent,
  WatchTvIntent
}

exports.handler = (event, context, callback) => {
  const alexa = Alexa.handler(event, context)
  alexa.registerHandlers(handlers)
  alexa.execute()
}
