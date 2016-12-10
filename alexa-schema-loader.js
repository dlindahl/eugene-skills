const intentUtteranceGenerator = require('intent-utterance-generator')

module.exports = function alexaSchemaLoader (source, map) {
  /* eslint-disable no-eval */
  const intents = eval(source)
  /* eslint-enable no-eval */
  const utterances = intentUtteranceGenerator(intents).toString()
  this.cacheable()
  this.value = utterances
  this.emitFile('../dist/UTTERANCES', utterances)
  return `module.exports = null`
}
