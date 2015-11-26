var Http = require('http');
var pump = require('pump');
var mime = require('mime');

var Server = function (stream)
{
  this.stream = stream;
  this.http = Http.createServer();

  this.host = '127.0.0.1';
  this.port = 8888;

  this.registerEvents();
}

Server.prototype = {

  registerEvents: function ()
  {
    this.http.on('request', this.request.bind(this))
    this.http.listen(this.info().port)
  },

  request: function(request, response)
  {
    var file = this.stream.getFile();

    this.stream.parseRequest(request);
    this.response(response);
  },

  response: function (response)
  {
    var file = this.stream.getFile();
    var readStream = null;
    var range = this.stream.getNextRange();
    var contentLength = file.length + 1;

    response.setHeader('Content-Type', mime.lookup(file.name) )
    response.setHeader('transferMode.dlna.org', 'Streaming')
    response.setHeader('contentFeatures.dlna.org', 'DLNA.ORG_OP=01;DLNA.ORG_CI=0;DLNA.ORG_FLAGS=017000 00000000000000000000000000')
    response.statusCode = 206
    response.setHeader('Accept-Ranges', 'bytes')

    if (range)
    {
      contentLength = range.end - range.start + 1;
      response.setHeader('Content-Range', 'bytes ' + range.start + '-' + range.end + '/' + file.length)
    }

    response.setHeader('Content-Length', contentLength)

    readStream = file.createReadStream(range);
    pump(readStream, response);
  },

  info: function ()
  {

    var info = {
      host: this.host,
      port: this.port,
      address: 'http://' + this.host + ':' + this.port
    }

    return info;
  }
}

module.exports = Server;
