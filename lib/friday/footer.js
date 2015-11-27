var Tween = require('tween')
var raf = require('raf')
var template = require('./template.html')
var domify = require('domify')
var detect = require('prop-detect')
var events = require('events')
var has3d = detect.has3d
var transform = detect.transform
var Emitter = require('emitter')
var tap = require('tap-event')

function createDates(n) {
  var oneday = 24*3600*1000
  var dates = []
  var date = new Date()
  while (n--) {
    var parts = date.toDateString().split(' ')
    var d = {
      month: parts[1],
      week: parts[0],
      date: parts[2]
    }
    dates.push(d)
    date = new Date(date.getTime() - oneday)
  }
  return dates
}

// item width
var width = 90

var hastouch = 'ontouchstart' in window

function Footer(el) {
  this.el = el
  var container = el.parentNode
  var w = container.clientWidth
  var n = this.count = Math.floor(w/width)
  var dates = createDates(n + 7).reverse()
  w = n*width
  container.style.width = w + 'px'
  dates.forEach(function (date) {
    var str = template.replace(/\{(\w+)\}/g, function (m, p1) {
      return date[p1]
    })
    var li = domify(str)
    li.style.width = width + 'px'
    el.appendChild(li)
  })
  this.total = dates.length
  this.events = events(el, this)
  this.docEvents = events(document, this)
  this.events.bind('touchstart')
  this.events.bind('touchmove')
  this.events.bind('mousedown', 'ontouchstart')
  this.events.bind('mousemove', 'ontouchmove')
  if (hastouch) {
    this.events.bind('touchstart li', 'ontap')
  } else {
    this.events.bind('click li')
  }
  this.docEvents.bind('touchend')
  this.docEvents.bind('mouseup', 'ontouchend')
}

Emitter(Footer.prototype)

/**
 * select without animation
 *
 * @public
 * @param  {Number}  number of days before
 */
Footer.prototype.select = function (num) {
  var index = this.total - 1 - num
  this.active(index)
  var x = - ((this.total - this.count - num)*width)
  this.translate(x)
}

Footer.prototype.active = function (index) {
  if (this.actived && this.actived === index) return
  if (this.tween) this.tween.stop()
  this.emit('change',  index)
  var list = this.el.children
  for (var i = 0, l = list.length; i < l; i++) {
    var li = list[i]
    if (i === index) {
      li.classList.add('active')
    } else {
      li.classList.remove('active')
    }
  }
  this.actived = index
}

Footer.prototype.translate = function (x) {
  var s = this.el.style
  if (has3d) {
    s[transform] = 'translate3d(' + x + 'px, 0, 0)'
  } else {
    s[transform] = 'translateX(' + x + 'px)'
  }

  this.x = x
}

Footer.prototype.next = function () {
  var n = this.actived + 1
  if (n >= this.total) return
  this.active(n)
  var x = this.x - width
  return this.animate(x)
}

Footer.prototype.prev = function () {
  var n = this.actived - 1
  if (n >= this.total) return
  this.active(n)
  var x = this.x + width
  return this.animate(x)
}

Footer.prototype.animate = function (x, ease, duration) {
  ease = ease || 'out-quad'
  duration = duration || 300
  var tween = this.tween = Tween({x : this.x})
  .ease(ease)
  .to({x : x})
  .duration(duration)

  var self = this
  tween.update(function(o){
    self.translate(o.x)
  })

  var promise = new Promise(function (resolve, reject) {
    var rejected
    tween.on('stop', function () {
      rejected = true
      reject()
    })
    tween.on('end', function(){
      self.tween = null
      animate = function(){} // eslint-disable-line
      if (!rejected) resolve()
    })
  })

  function animate() {
    raf(animate)
    tween.update()
  }

  animate()
  return promise
}

Footer.prototype.onclick = function (e) {
  var li = e.delegateTarget
  var children = this.el.children
  var index
  for (var i = 0, l = children.length; i < l; i++) {
    if (li === children[i]) {
      index = i
      break;
    }
  }
  this.active(index)
}

Footer.prototype.ontap = tap(Footer.prototype.onclick)

Footer.prototype.ontouchstart = function (e) {
  if (this.tween) this.tween.stop()
  var touch = this.getTouch(e)
  this.px = touch.pageX
  this.sx = this.x
  this.dx = 0
  this.ts = Date.now()
  this.pageX = touch.pageX
  this.down = {
    x: touch.pageX,
    y: touch.pageY,
    start: this.x,
    at: this.ts
  }
}

Footer.prototype.ontouchmove = function (e) {
  if (!this.down) return
  if (this.tween) this.tween.stop()
  e.preventDefault()
  var touch = this.getTouch(e)
  var dx = touch.pageX - this.px
  if (!this.pageX) this.pageX = touch.pageX
  //calculate speed every 100 milisecond
  this.calcuteSpeed(touch.pageX)

  var x = this.sx + dx
  x = Math.min(width/3, x)
  x = Math.max(x, - (this.total - this.count)*width - width/3)
  this.translate(x)
}

Footer.prototype.ontouchend = function (e) {
  if (!this.down) return
  var touch = this.getTouch(e)
  this.calcuteSpeed(touch.pageX)
  var m = this.momentum()
  this.ps = this.down = this.sx = null
  if (isNaN(m.x)) {
    // WTF
    return
  }
  this.animate(m.x, m.ease, m.duration).catch(function () {
  })
}

Footer.prototype.getTouch = function (e) {
  if (e.changedTouches && e.changedTouches.length > 0) {
    return e.changedTouches[0]
  }
  return e
}

Footer.prototype.momentum = function () {
  var deceleration = 0.0004
  var speed = this.speed
  var x = this.x
  speed = Math.min(speed, 0.6)
  var minX = - (this.total - this.count)*width
  var destination = x + ( speed * speed ) / ( 2 * deceleration ) * ( this.distance < 0 ? -1 : 1 )
  var duration = speed / deceleration
  var newX
  var ease = 'out-cube'
  if (destination > 0) {
    newX = 0
    ease = 'out-back'
  } else if (destination < minX) {
    newX = minX
    ease = 'out-back'
  }
  if (typeof newX === 'number') {
    duration = duration*Math.abs((newX - x + 50)/(destination - x))
    //duration = Math.max(200, duration)
    destination = newX
  }
  if (x > 0 || x < minX) {
    duration = 500
    ease = 'out-circ'
  }
  destination = Math.round(destination/width)*width
  return {
    x: destination,
    duration: duration,
    ease: ease
  }
}


Footer.prototype.calcuteSpeed = function (x) {
  var ts = Date.now()
  var dt = ts - this.ts
  if (ts - this.down.at < 100) {
    this.distance = x - this.pageX
    this.speed = Math.abs(this.distance/dt)
  } else if(dt > 100){
    this.distance = x - this.pageX
    this.speed = Math.abs(this.distance/dt)
    this.ts = ts
    this.pageX = x
  }
}

module.exports = Footer
