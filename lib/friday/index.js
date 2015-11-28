var Promise = require('es6-promise-polyfill').Promise
var Circle = require('./circle')
var Icon = require('./icon')
var Time = require('./time')
var autoscale = require('autoscale-canvas')
var raf = require('raf')
var Footer = require('./footer')
var Emitter = require('emitter')

function View(el, dateEl) {
  this.el = el
  // text height
  this.th = 60
  this.width = el.clientWidth
  this.height = el.clientHeight
  var canvas = this.canvas  = document.createElement('canvas')
  el.appendChild(canvas);
  canvas.height = this.height
  canvas.width = this.width
  this.ctx = canvas.getContext('2d')
  autoscale(canvas)
  this.circle = new Circle(this)
  this.icon = new Icon(this)
  this.time = new Time(this)
  this.stat = 'stopped'
  var footer = this.footer = new Footer(dateEl)
  var self = this
  function onchange () {
    //self.promise = self.promise || Promise.resolve(null)
    self.process = self.cancel().then(function () {
      if (self.checked) {
        return self.reset().then(function () {
          return self.wait(300)
        })
      }
    }).then(function () {
      return self.pend()
    }).then(function () {
      return self.check()
    }).catch(function () {
      return true
    })
  }
  footer.on('change', onchange)
  // select yesterday
  footer.select(1)
}

Emitter(View.prototype)

View.prototype.wait = function (n) {
  var self = this
  var promise = this.promise = new Promise(function (resolve, reject) {
    if (self.canceled) return reject()
    var called
    var timeout = setTimeout(function () {
      called = true
      resolve()
    }, n)
    self.once('cancel', function () {
      if (!called) {
        clearTimeout(timeout)
        reject()
      }
    })
  })
  return promise
}

View.prototype.draw = function () {
  this.circle.draw()
  this.icon.draw()
  this.time.draw()
}

View.prototype.pend = function () {
  this.duration = 3300
  this.stat = 'pending'
  return this.animate()
}

View.prototype.check = function () {
  this.duration = 800
  this.stat = 'checking'
  var promise = this.animate()
  return promise
}

View.prototype.reset = function () {
  this.duration = 500
  this.stat = 'reseting'
  return this.animate()
}

View.prototype.animate = function () {
  var duration = this.duration
  var start
  var self = this
  self.checked = false
  var promise = this.promise = new Promise(function (resolve, reject) {
    function step(timestamp) {
      self.ctx.setTransform(window.devicePixelRatio || 1 ,0 ,0 ,window.devicePixelRatio || 1 ,0, 0);
      self.ctx.clearRect(0, 0, self.width, self.height)
      if (self.canceled === true) {
        return reject()
      }
      if (!start) start = timestamp
      var d = timestamp - start
      self.percent = Math.min(1, d/duration)
      self.draw()
      if (d > duration) {
        if (self.stat === 'checking') self.checked = true
        return resolve()
      }
      raf(step)
    }
    raf(step)
  })
  return promise
}

View.prototype.cancel = function () {
  this.emit('cancel')
  this.promise = this.promise || Promise.resolve(null)
  this.canceled = true
  var self = this
  return this.promise.then(function () {
    self.canceled = false
  }, function () {
    self.canceled = false
  })
}

View.prototype.next = function () {
  return this.footer.next()
}

View.prototype.prev = function () {
  return this.footer.prev()
}

module.exports = View
