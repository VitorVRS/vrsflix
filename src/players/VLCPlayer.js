var VLCPlayer = function (opts) {
  this.options = opts
}

VLCPlayer.prototype = {

  getCommandLine: function () {
    var commandLine = '/usr/bin/env vlc '

    commandLine += this.options.server.info().address + ' '
    commandLine += '--sub-file="' + this.options.subtitles.getFilePath() + '"'

    return commandLine
  }
}

module.exports = VLCPlayer
