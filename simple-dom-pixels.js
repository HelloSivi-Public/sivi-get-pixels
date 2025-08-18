'use strict'

var path          = require('path')
var ndarray       = require('ndarray')

function defaultImage(url, cb) {
  var img = new Image()
  img.crossOrigin = "Anonymous"
  img.onload = function() {
    var canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height
    var context = canvas.getContext('2d')
    context.drawImage(img, 0, 0)
    var pixels = context.getImageData(0, 0, img.width, img.height)
    cb(null, ndarray(new Uint8Array(pixels.data), [img.width, img.height, 4], [4, 4*img.width, 1], 0))
  }
  img.onerror = function(err) {
    cb(err)
  }
  img.src = url
}

module.exports = function getPixels(url, type, cb) {
  if(!cb) {
    cb = type
    type = ''
  }

  const MimeType = type?.toUpperCase() || path.extname(url).toUpperCase()
  console.log(MimeType)
  if(Buffer.isBuffer(url)) {
    console.log('buffer')
    url = 'data:' + type + ';base64,' + url.toString('base64')
    defaultImage(url, cb)
  } else if (MimeType === '.PNG' || MimeType === '.JPEG' || MimeType === '.JPG') {
    console.log('image')
    defaultImage(url, cb)
  } else {
    console.log('else')
    cb(new Error('Unsupported image type'))
  }
}
