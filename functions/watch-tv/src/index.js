const Alexa = require('alexa-sdk')
const Intent = require('alexa-constants').Intent
const numberToWords = require('number-to-words')
const Telnet = require('telnet-client')

/* eslint-disable import/no-unassigned-import */
require('../model/intents.js')
/* eslint-enable import/no-unassigned-import */

function tivoExec (cmd) {
  return new Promise((resolve, reject) => {
    const conn = new Telnet()
    conn.on('timeout', () => reject(new Error('TIMEOUT')))
    conn.on('error', reject)
    return conn.connect({
      debug: true,
      execTimeout: 2000,
      host: '76.105.62.135',
      negotiationMandatory: false,
      ors: '\r',
      port: 31339,
      shellPrompt: 'CH_STATUS',
      timeout: 2000
    })
    .then(() => conn.exec(cmd, { waitFor: '\r' }))
    .then(() => conn.end())
    .then(resolve, reject)
  })
}

const handlers = {
  [Intent.Help] () {
    this.emit(':ask',
      'You can tell me to watch TV',
      'I have no idea what you are saying'
    )
  },
  TuneTvIntent () {
    const intent = this.event.request.intent
    let channelName
    let channelValue
    if (intent.slots.channel.value) {
      channelValue = intent.slots.channel.value
      channelName = channelValue
    } else if (intent.slots.channelNum) {
      channelValue = intent.slots.channelNum.value
      channelName =
        channelValue
          .split('')
          .map((n) => numberToWords.toWords(n))
          .join(' ')
          .replace(/zero/g, 'oh')
    }
    return tivoExec(`SETCH ${channelValue}`)
      .then(() => this.emit(':tell', `Watching ${channelName}`))
      .catch((err) => {
        this.emit(':tellWithCard',
          `Unfortunately, your TV said "${err}"`,
          'ERROR',
          err
        )
      })
  },
  WatchTvIntent () {
    this.emit(':tell',
      `I've turned the television on for you`
    )
  }
}

exports.handler = (event, context, callback) => {
  const alexa = Alexa.handler(event, context)
  alexa.registerHandlers(handlers)
  alexa.execute()
}
