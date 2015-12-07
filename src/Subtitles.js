var Hash = require('./subtitles/hash')
var OpenSubtitles = require('./subtitles/provider/OpenSubtitles')

var Subtitles = function (file) {
  this.file = file
  this.hashString = ''
  this.srtFilePath = ''

  // @todo improve this
  this.engine = new OpenSubtitles()
}

Subtitles.prototype = {

  computeHash: function (callback) {
    var _this = this
    var hash = new Hash(_this.file)

    hash.generate(function (hashString) {
      _this.hashString = hashString
      callback()
    })
  },

  loadFile: function () {
    console.log('Loading subtitles...')
    var _this = this

    _this.computeHash(function () {
      _this.getEngineFile()
    })
  },

  getEngineFile: function () {
    var _this = this

    try {
      _this.engine.setHash(_this.hashString)
      _this.engine.getFilePath(function (file) {
        console.log('Subtitle found')
        _this.srtFilePath = file
        global.events.emit('Subtitles::ready')
      })
    } catch (err) {
      console.error('Subtitle not found')
    }
  },

  addListener: function (event, cb) {
    global.events.on('Subtitles::' + event, cb)
  }

}

module.exports = Subtitles
