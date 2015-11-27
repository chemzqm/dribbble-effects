var Tween = require('tween')
var raf = require('raf')
var template = require('./template.html')
var domify = require('domify')
var detect = require('prop-detect')
var events = require('events')
var has3d = detect.has3d
var transform = detect.transform
var Emitter = require('emitter')

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
  this.docEvents.bind('touchend')
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

Footer.prototype.animate = function (x) {
  var tween = this.tween = Tween({x : this.x})
  .ease('out-quad')
  .to({x : x})
  .duration(600)

  var self = this
  tween.update(function(o){
    self.translate(o.x)
  })

  var promise = new Promise(function (resolve) {
    tween.on('end', function(){
      self.tween = null
      animate = function(){} // eslint-disable-line
      resolve()
    })
  })

  function animate() {
    raf(animate)
    tween.update()
  }

  animate()
  return promise
}

Footer.prototype.ontouchstart = function (e) {
  if (this.tween) return
  this.px = e.touches[0].pageX
  this.sx = this.x
}

Footer.prototype.ontouchmove = function (e) {
  if (this.tween || !this.px) return
  var dx = e.touches[0].pageX - this.px
  var x = this.sx + dx
  x = Math.min(width/3, x)
  x = Math.max(x, - (this.total - this.count)*width - width/3)
  this.translate(x)
}

Footer.prototype.ontouchend = function () {
  if (!this.px) return
  this.ps = this.sx = null
  var n = Math.round(Math.abs(this.x)/width)
  var cur = n + this.count - 1
  this.active(cur)
  this.animate(-n*width)
}
module.exports = Footer
