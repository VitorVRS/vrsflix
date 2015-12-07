var Hash = function (mediaFile) {
  this.mediaFile = mediaFile
  this.HASH_CHUNK_SIZE = 65536 // 64 * 1024
};

(function () {
  Hash.prototype = {
    start: '',
    end: '',
    hash: '',
    generate: function (callback) {
      this.getBeginData(function () {
        this.getEndData(function () {
          this.process(callback)
        })
      })
    },

    getBeginData: function (callback) {
      var _this = this
      var beginStream

      beginStream = _this.mediaFile.createReadStream({start: 0, end: _this.HASH_CHUNK_SIZE - 1})
      beginStream.on('data', function (chunk) {
        var text = chunk.toString('binary')

        _this.start += text

        if (_this.start.length === _this.HASH_CHUNK_SIZE) {
          callback.call(_this)
        }
      })
    },

    getEndData: function (callback) {
      var _this = this
      var endStream

      endStream = _this.mediaFile.createReadStream({start: (_this.mediaFile.length - _this.HASH_CHUNK_SIZE), end: _this.mediaFile.length - 1})
      endStream.on('data', function (chunk) {
        var text = chunk.toString('binary')

        _this.end += text

        if (_this.end.length === _this.HASH_CHUNK_SIZE) {
          callback.call(_this)
        }
      })
    },

    process: function (callback) {
      var temp = this.mediaFile.length
      var longs = []
      var proccessLongs
      var binl2hex

      proccessLongs = function (chunk) {
        for (var i = 0; i < chunk.length; i++) {
          longs[(i + 8) % 8] += chunk.charCodeAt(i)
        }
      }

      binl2hex = function (a) {
        var b = 255
        var d = '0123456789abcdef'
        var e = ''
        var c = 7

        a[1] += a[0] >> 8
        a[0] = a[0] & b
        a[2] += a[1] >> 8
        a[1] = a[1] & b
        a[3] += a[2] >> 8
        a[2] = a[2] & b
        a[4] += a[3] >> 8
        a[3] = a[3] & b
        a[5] += a[4] >> 8
        a[4] = a[4] & b
        a[6] += a[5] >> 8
        a[5] = a[5] & b
        a[7] += a[6] >> 8
        a[6] = a[6] & b
        a[7] = a[7] & b
        for (d, e, c; c > -1; c--) {
          e += d.charAt(a[c] >> 4 & 15) + d.charAt(a[c] & 15)
        }
        return e
      }

      for (var i = 0; i < 8; i++) {
        longs[i] = temp & 255
        temp = temp >> 8
      }

      proccessLongs(this.start)
      proccessLongs(this.end)

      callback.call(null, binl2hex(longs))
    }
  }
})()

module.exports = Hash
