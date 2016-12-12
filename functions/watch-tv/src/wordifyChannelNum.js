const numberToWords = require('number-to-words')

/**
If the channel ID is a channel number, then convert the number to words so
that Alexa doesn't sound stupid pronouncing channel 7-0-3 as "seven hundred three"
*/
module.exports = function wordifyChannelNum (channelId) {
  if (typeof channelId !== 'string') {
    channelId = channelId.toString()
  }
  if (parseInt(channelId).toString() !== channelId) {
    return channelId
  }
  return channelId
    .split('')
    .map((n) => numberToWords.toWords(n))
    .join(' ')
    .replace(/zero/g, 'oh')
}
