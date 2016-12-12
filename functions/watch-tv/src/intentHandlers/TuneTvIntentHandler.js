const channels = require('../../data/channels.json')
const find = require('lodash.find')
const findChannel = require('../searchChannelList')
const Telnet = require('telnet-client')
const wordify = require('../wordifyChannelNum')

function tivoExec (cmd) {
  console.info('Issuing TiVO command: ', cmd)
  if (process.env.NEVERTRUE === undefined) {
    return Promise.resolve()
  }
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

module.exports = function TuneTvIntentHandler () {
  const intent = this.event.request.intent
  let channel
  let channelValue
  if (intent.slots.channel.value) {
    channelValue = intent.slots.channel.value.toUpperCase()
    channel = findChannel(channelValue)
    if (!channel) {
      console.info(`Could not find channel for ${channelValue}`)
      return this.emit(':tellWithCard',
        `Unfortunately, I could not find a channel for ${wordify(channelValue)}`,
        'ERROR',
        'UNKNOWN CHANNEL'
      )
    }
  } else if (intent.slots.channelNum) {
    channelValue = intent.slots.channelNum.value
    channel = find(channels, { channel: channelValue })
    if (!channel) {
      console.info(`Could not find channel for ${channelValue}`)
      return this.emit(':tellWithCard',
        `Unfortunately, I could not find a channel for ${wordify(channelValue)}`,
        'ERROR',
        'UNKNOWN CHANNEL'
      )
    }
  }
  console.info('Changing channel to ', channel)
  return tivoExec(`SETCH ${channel.channel}`)
    .then(() => this.emit(':tell', `Watching ${channel.spokenName}`))
    .catch((err) => {
      console.info('ERROR', err)
      this.emit(':tellWithCard',
        `Unfortunately, your TV said "${err}"`,
        'ERROR',
        err
      )
    })
}
