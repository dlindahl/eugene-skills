'use strict'

const channels = require('../data/channels.json')
const filter = require('lodash.filter')
const flatten = require('lodash.flatten')
const map = require('lodash.map')
const orderBy = require('lodash.orderby')
const partition = require('lodash.partition')
const Thinker = require('thinker-fts')

const stemmer = Thinker.processors.stemmers.english({
  movies: true
})
const stopwords = Thinker.processors.stopwords({
  '(Pacific)': true,
  dt: true,
  hd: true
})
const thinker = Thinker({
  caseSensitive: false,
  characters: /([a-zA-Z0-9'&]*)/g
})
thinker.addWordProcessor(stemmer)
thinker.addWordProcessor(stopwords)
thinker.ranker = Thinker.rankers.standard({
  fields: {
    1: {
      weight: 0 // Neuter callsign matches to prevent over-weighting non-HD
    }
  }
})
thinker.feed(map(channels, 'searchTerms'))

function preprocessQuery (query) {
  return query
    .replace(/ (?=\d$)/, '') // Remove spaces between letters and numbers (i.e. "VH 1")
    .replace(' and ', '&') // Prefer ampersands
}

function processResults (documents) {
  // Order larger weight docs higher
  const matches = orderBy(documents, 'weight', 'desc')
  // Take all docs with the same top-weight and map them to their respective channel instance
  const bestMatchedChannels =
    filter(matches, { weight: matches[0].weight })
      .reduce((set, match) => {
        set.push(channels[match.id])
        return set
      }, [])
  // Weigh all HD channels higher than non-HD while maintaining sort order
  const weightedChannels = flatten(partition(bestMatchedChannels, 'isHD'))
  // Return first search result
  return weightedChannels[0]
}

module.exports = function performSearch (input) {
  const query = preprocessQuery(input)
  const result = thinker.find(query)
  if (!result.documents.length) {
    return null
  }
  return processResults(result.documents)
}
