var autoscale = require('autoscale-canvas')
var PI = Math.PI
var raf = require('raf')

var total = 80
function Loader(el) {
  this.el = el
  this.width = el.clientWidth
  this.height = el.clientHeight
  var canvas = this.canvas  = document.createElement('canvas')
  el.appendChild(canvas);
  canvas.height = this.height
  canvas.width = this.width
  this.ctx = canvas.getContext('2d')
  autoscale(canvas)
}

Loader.prototype.setColor = function (color) {
  this.color = color
}

Loader.prototype.draw = function (top) {
  var ctx = this.ctx
  ctx.setTransform(window.devicePixelRatio || 1 ,0 ,0 ,window.devicePixelRatio || 1 ,0, 0);
  ctx.clearRect(0, 0, this.width, this.height)
  this.drawRect(top)
  this.drawCircle(top)
}

Loader.prototype.drawRect = function (t, max) {
  var ctx = this.ctx
  ctx.fillStyle = this.color
  var y = t + total
  var h = Math.min(40, -t)
  var w = this.width
  var sy = y + h
  var d = w/20
  ctx.fillRect(0, y, w, h)
  if (max + t < 0) {
    ctx.fillStyle = '#ffffff'
    ctx.strokeStyle = '#ffffff'
  }
  max = max == null ? total : max
  if (t < - 40) {
    ctx.beginPath()
    ctx.moveTo(0, sy)
    ctx.bezierCurveTo(w/4 - d, sy, w/4 +d , max, w/2, max)
    ctx.bezierCurveTo(3*w/4 - d, max, 3*w/4 + d, sy, w, sy)
    ctx.fill()
  }
}

Loader.prototype.drawCircle = function (t, start, end) {
  var ctx = this.ctx
  ctx.beginPath()
  ctx.strokeStyle = '#ffffff'
  var x = this.width/2
  ctx.lineWidth = 1
  var y
  var s = - PI + PI/12
  var e = PI - PI/12
  var r = 8
  var h = this.height
  if (start && end) {
    y = h -6 -r - (-30 - t)
    s = start
    e = end
  } else if (start) {
    y = h -6 -r - (-30 - t)
    s = start
    e = start + 2*PI - PI/6
  } else if (t >= -30 && t <= -10) {
    // relative to element
    y = h - 6 - r
  } else if (t < -30) {
    y = h -6 -r - (-30 - t)
    if (t < -30 && t > -40) {
      s = s + (-30 - t)*PI/10
      e = e + (-30 - t)*PI/10
    } else {
      s = s + PI
      e = e + PI
    }
  }
  ctx.arc(x, y, r, s, e)
  ctx.stroke()
  return y
}

Loader.prototype.load = function (duration) {
  // start loading
  this.stopped = false
  var self = this
  var start
  var ctx = this.ctx
  function animate(timestamp) {
    if (self.stopped) return
    ctx.clearRect(0, 0, self.width, self.height)
    if (!start) start = timestamp
    // scrollTop
    var y = self.y
    var p = (timestamp - start)/duration
    p = Math.min(p, 1)
    var a = p*PI*4
    var m = 20*(1 - p)
    var max = total - m*Math.sin(a)
    self.drawRect(y, max)
    var ts = (timestamp - start)%500
    p = ts/500
    var angle = PI/6 + PI*2*p
    self.drawCircle(y, angle)
    raf(animate)
  }
  raf(animate)
}

Loader.prototype.check = function () {
  this.color = '#00BB67'
  this.stopped = true
  var start
  var duration = 300
  var self = this
  var ctx = this.ctx
  function animate(timestamp) {
    if (!start) start = timestamp
    ctx.clearRect(0, 0, self.width, self.height)
    var p = Math.min(1, (timestamp - start)/duration)
    self.drawRect(self.y)
    var s = PI/6
    var e = PI/6 + 2*PI - PI*(1 - p)/6
    var x = self.width/2
    var y = self.drawCircle(self.y, s, e)
    self.drawCorrect(x, y, p)
    if (timestamp - start > duration) return
    raf(animate)
  }
  raf(animate)
}

Loader.prototype.error = function () {
  this.color = '#FF543D'
  this.stopped = true
}

Loader.prototype.drawCorrect = function (x, y, p) {
  var l = 4.8
  var tl = 2.618*l
  var len = tl*(outBack(p))
  var ctx = this.ctx
  var sx = x - 4
  var sy = y - 1
  var subtense = Math.min(len, l)
  var mx = sx + subtense*Math.cos(45*PI/180)
  var my = sy + subtense*Math.sin(45*PI/180)
  ctx.beginPath()
  ctx.moveTo(sx, sy)
  ctx.lineTo(mx, my)
  if (len > l) {
    subtense = len - l
    var ex = mx + subtense*Math.cos(50*PI/180)
    var ey = my - subtense*Math.sin(50*PI/180)
    ctx.lineTo(ex, ey)
  }
  ctx.stroke()
}

function outBack(n){
  var s = 1.70158;
  return --n * n * ((s + 1) * n + s) + 1;
}

module.exports = Loader
