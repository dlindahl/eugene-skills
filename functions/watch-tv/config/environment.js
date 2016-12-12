'use strict'

const convict = require('convict')

const config = convict({
  tivoIp: {
    default: '0.0.0.0',
    doc: 'IP Address the TiVO runs on',
    env: 'TIVO_IP',
    format: 'url'
  },
  tivoPort: {
    default: 31339,
    doc: 'Port the TiVO listens on',
    env: 'TIVO_PORT',
    format: 'port'
  }
})
config.validate()

module.exports = config
