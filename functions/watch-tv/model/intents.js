// Alexa, tell the TV to...
module.exports = {
  TuneTvIntent: [
    '(change the channel to|tune in to|watch) {channel}',
    '(change the channel to|tune in to|watch) {channelNum}'
  ],
  WatchTvIntent: [
    'turn (on|off)'
  ]
}
