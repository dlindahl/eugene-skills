'use strict'

const fetch = require('isomorphic-fetch')
const find = require('lodash.find')
const fs = require('fs')
const map = require('lodash.map')
const path = require('path')
const querystring = require('querystring')
const wordify = require('./wordifyChannelNum')

const CallSignChannelsUrl = 'https://tv-listings.comet.aol.com/v1.1/lineups/USA-CA54023-X/channels'
const CallSignModifiers = /(P?(HD?\d?)?$|DT$)/
const isHD = /HD?P$|HD$|DT\d?$/
const isPacific = / West |\(Pacific\)/
const NetworkNameChannelsUrl = 'http://tv.rr.com/api/channels/1349.json'
const NetworkNameModifiers = /(?=[A-Z])DT(?= )| ?HD| Cable Network| West$| \(Pacific\)$|[:]/g
const ParentheticalNetworkId = /([^(]+\()([^)]+)(\))/
const REQUEST_ERROR = 400

function getChannels (url, qs, cfg) {
  let uri = url
  if (qs) {
    qs = querystring.stringify(qs)
    uri = `${uri}?${qs}`
  }
  return fetch(uri, cfg)
    .then((response) => {
      if (response.status >= REQUEST_ERROR) {
        console.info(response.status)
        throw new Error('Bad response from server')
      }
      return response.json()
    })
    .catch((err) => {
      console.error(uri, err)
      throw err
    })
}

Promise.all([
  // Get two different channels lists that contain different levels of detail
  getChannels(CallSignChannelsUrl, {
    apiKey: 'KNMxiiH4wItiOz6E15Ytoy9x9vKy5859', // Taken from the website
    imageSize: 'Sm',
    resize: '50,50,preserve_aspect'
  }),
  getChannels(NetworkNameChannelsUrl, null, {
    body: 'token=a6c5d8a9',
    headers: {
      Accept: 'application/json, text/javascript',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    method: 'POST'
  })
])
.then((data) => (
  // Merge channel listings, cleaning up data along the way
  map(data[0], (channel, i) => {
    const namedChannel = find(data[1].channel, { '@attributes': { channelNum: channel.channel } })
    channel.searchTerms = [i, channel.callSign.replace(CallSignModifiers, '')]
    if (channel.affiliateCallSign) {
      channel.spokenName = channel.affiliateCallSign.replace(CallSignModifiers, '')
      channel.searchTerms.push(channel.spokenName)
    }
    if (namedChannel) {
      channel.networkName = namedChannel.name
      channel.isPacific = isPacific.test(channel.networkName)
      const searchableName = channel.networkName.replace(NetworkNameModifiers, '')
      channel.searchTerms.push(searchableName)
      channel.spokenName = searchableName.replace(ParentheticalNetworkId, '$2')
    } else {
      channel.networkName = null
      channel.spokenName = channel.spokenName ||
        channel.callSign.replace(CallSignModifiers, '') ||
        wordify(channel.channel)
    }
    channel.isHD = isHD.test(channel.callSign)
    return channel
  })
))
.then((channels) => {
  fs.writeFileSync(path.join(__dirname, '../data/channels.json'), JSON.stringify(channels))
})
.catch((err) => console.error(err))
