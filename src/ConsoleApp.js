var commander = require('commander')
var Stream = require('./Stream')
var Server = require('./Server')
var Subtitles = require('./Subtitles')
var Player = require('./Player')

var ConsoleApp = function () {
  this.options = {
    magnet: ''
  }

  this.parseArgs()
}

ConsoleApp.prototype = {

  parseArgs: function () {
    commander
      .version(global.VERSION)
      .usage('[options]')
      .option('-m, --magnet <magnet>', 'Torrent magnet link')
      .option('-p, --player <player>', 'Player to execute', /^(vlc)~/i)
      .parse(process.argv)

    if (!process.argv.slice(2).length) {
      commander.outputHelp()
      process.exit()
    }

    if (commander.magnet)
      this.options.magnet = commander.magnet

    this.options.player = 'vlc'
    if (commander.player)
      this.options.player = commander.player

  },

  init: function () {
    var stream = new Stream(this.options.magnet)
    var server = new Server(stream)
    var subtitles = null
    var player = null

    stream.addListener('ready', function () {
      subtitles = new Subtitles(stream.getFile())
      subtitles.loadFile()

      subtitles.addListener('ready', initPlayer.bind(this))
    }.bind(this))

    function initPlayer () {
      var playerOptions = {
        subtitles: subtitles,
        server: server
      }

      player = new Player(this.options.player, playerOptions)
      player.execute()
    }

    console.log('Server running on: ', server.info().address)
  }

}

module.exports = ConsoleApp
