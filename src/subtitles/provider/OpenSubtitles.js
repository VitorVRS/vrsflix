var OpenSubtitlesAPI = require('opensubtitles-api')
var http = require('http')
var fs = require('fs')

var OS_UserAgent = 'VitorVRS UA'
var OS_LanguageId = 'pob'
var OS_LanguageKey = 'pb'

var OpenSubtitles = function () {
  this.api = new OpenSubtitlesAPI(OS_UserAgent)
  this.hash = ''
}

OpenSubtitles.prototype = {
  getFilePath: function (callback) {
    var _this = this

    if (!_this.hash) throw new Error('File hash not informed.')

    _this.api.search({
      sublanguageid: OS_LanguageId,
      extensions: ['srt'],
      hash: _this.hash
    }).then(function (subtitles) {
      if (!subtitles[OS_LanguageKey])
        throw new Error('OS_LanguageKey: ' + OS_LanguageKey + ' not found')

      var subtitleFilename = '/tmp/' + _this.hash + '.srt'

      var file = fs.createWriteStream(subtitleFilename)
      http.get(subtitles[OS_LanguageKey].url, function (response) {
        response.pipe(file)
        file.on('finish', function () {
          callback(subtitleFilename)
        })
      })

    }).catch(function (err) {
      callback(null, err)
    })
  },

  setHash: function (hash) {
    this.hash = hash
  }

}

module.exports = OpenSubtitles
