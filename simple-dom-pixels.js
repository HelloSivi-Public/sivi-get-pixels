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

  var mimeType = 'image/jpeg'
  var defaultImageType = false

  if(type && type !== ''){
    mimeType = type.toLowerCase()

    if(type.includes('.jpg') || type.includes('.jpeg')) {
      defaultImageType = '.JPG'
    } else if (type.includes('.png')) {
      defaultImageType = '.PNG'
    }
  }
  var imageType = defaultImageType || path.extname(url).toUpperCase() || '.JPG'
  if(Buffer.isBuffer(url)) {
    url = 'data:' + mimeType + ';base64,' + url.toString('base64')
    defaultImage(url, cb)
  } else if (imageType === '.PNG' || imageType === '.JPEG' || imageType === '.JPG') {
    defaultImage(url, cb)
  } else {
    cb(new Error('Unsupported image type'))
  }
}
