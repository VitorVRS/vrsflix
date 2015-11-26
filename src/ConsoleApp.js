var commander = require('commander');

var Stream = require('./Stream');
var Server = require('./Server');

var ConsoleApp = function ()
{

  this.options = {
    magnet : ''
  }

  this.parseArgs();
}

ConsoleApp.prototype = {

  parseArgs: function ()
  {

    var _this = this;

    commander
      .version(global.VERSION)
      .usage('[options]')
      .option('-m, --magnet <magnet>', 'Torrent magnet link')
      .option('-p, --player <player>', 'Player to execute')
      .parse(process.argv)

    if (commander.magnet) this.options.magnet = commander.magnet;

  },

  init: function ()
  {
    var stream = new Stream(this.options.magnet);
    var server = new Server(stream);

    console.log('Server running on: ', server.info().address)
  }

}

module.exports = ConsoleApp;