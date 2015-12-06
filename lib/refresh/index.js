var Iscroll = require('iscroll')
var Loader = require('./loader')

function Ptr(scrollable, cb) {
  var is = new Iscroll(scrollable, {
    handlebar: true
  })
  var loader = new Loader(scrollable.querySelector('.ptr'))
  loader.setColor('#1ea3e7')
  var stat
  is.on('scroll', function (y) {
    if (stat == null) {
      var el = scrollable.querySelector('.projects > li:first-child .content')
      var color = getComputedStyle(el)['background-color']
      loader.setColor(color)
      loader.draw(y)
    }
    loader.y = y
  })
  var duration = 400
  is.on('release', function () {
    if (stat != null) return
    var y = scrollable.scrollTop
    if (y < -40) {
      stat = 'loading'
      loader.load(duration)
      is.scrollTo(40, duration)
      var promise = cb()
      var end = function (err) {
        stat = err ? 'success': 'error'
        is.scrollTo(40, 200)
        if (err) {
          // not implemented
          loader.error(err)
        } else {
          loader.check()
        }
        setTimeout(function () {
          is.scrollTo(0, 300)
          stat = null
        }, 500)
      }
      promise.then(end, end)
    }
  })
}

module.exports = Ptr
