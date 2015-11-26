var _ = require('underscore');
var parseRange = require('range-parser');
var TorrentStream = require('torrent-stream');

/**
 * Manage stream and its files
 */
var Stream = function (magnet)
{
  this.magnet = magnet;
  this.engine = new TorrentStream(magnet);
  this.file = null;
  this.range = null;

  this.registerEvents();
};

Stream.prototype = {

  /**
   * Method executed when torrent-stream engine is ready
   */
  ready: function()
  {
    this.file = _.max(this.engine.files, function (file) { return file.length; });
  },

  /**
   * Method which register/start all events of this class
   */
  registerEvents: function()
  {
    this.engine.on('ready', this.ready.bind(this));
    this.engine.listen();
  },

  /**
   * Getter for file property
   * @return {Object} Object file from torrent-stream
   */
  getFile: function ()
  {
    return this.file
  },

  /**
   * Method which parse request data and get stream/file info
   * @param  {http.ClientRequest} request Node server request
   */
  parseRequest: function (request)
  {
    if (request.headers.range)
    {
      this.range = _.first(parseRange(this.file.length, request.headers.range));
    }
  },

  /**
   * Getter for range property
   * @return {Object} Object range from range-parser
   */
  getNextRange: function ()
  {
    return this.range;
  }

}

module.exports = Stream;