var exec = require('child_process').exec

var Player = function (id, opts) {
  this.id = id
  this.engine = null
  this.options = opts

  this.loadEngine()
}

Player.prototype = {

  loadEngine: function () {
    var Engine = null

    console.log('Loading player...')

    if (this.id.toLowerCase() === 'vlc') {
      Engine = require('./players/VLCPlayer')
      console.log('VLCPlayer loaded.')
      this.engine = new Engine(this.options)
      return
    }

    throw new Error('Unknow player: ' + this.id)
  },

  execute: function () {
    var commandLine = this.engine.getCommandLine()

    console.log('Player cmd: ', commandLine)
    exec(commandLine, function () {
      console.log('Player closed')
      process.exit()
    })
  }
}

module.exports = Player
