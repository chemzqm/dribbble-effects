var gray = '#A4A3A3'
var yellow = '#F3DD70'
var PI = Math.PI
var util = require('../util')
var steps = [0, 1, 2, 2, 3, 2, 2, 1, 0, 0]
var step_len = steps.length
var Tail = require('./tail')
var width = 5

function Circle(view) {
  this.view = view
  this.ctx = view.ctx
  this.x = view.width/2
  var th = view.th
  var h = view.height - th
  this.y = Math.min(view.width/2, h/2)
  // min padding
  var pad = 50
  this.r = Math.min(this.x, this.y) - pad
  this.gray = util.toRgba(gray, 0.1)
  this.tails = []
}

Circle.prototype.draw = function () {
  var stat = this.view.stat
  // gray circle
  var ctx = this.ctx
  ctx.save()
  ctx.lineWidth = width
  ctx.lineCap = 'round'
  ctx.strokeStyle = this.gray
  ctx.beginPath()
  ctx.arc(this.x, this.y, this.r, 0, PI*2)
  ctx.stroke()
  if (stat === 'pending') {
    this.pend()
  } else if (stat === 'reseting') {
    this.reset()
  }
  ctx.restore()
}

Circle.prototype.pend = function () {
  var ctx = this.ctx
  var percent = this.view.percent
  var s = - PI/2
  var e = this.end = s + PI*2*(1 - percent)
  ctx.strokeStyle = yellow
  ctx.beginPath()
  ctx.arc(this.x, this.y, this.r, s, e)
  ctx.stroke()
  var step = Math.floor(percent*step_len)
  if (step > this.step) {
    this.createTails()
  }
  this.step = step
  this.tails.forEach(function (tail) {
    var p = percent*step_len - step
    tail.draw(p)
  })
}

Circle.prototype.reset = function () {
  var ctx = this.ctx
  var p = this.view.percent
  var a = PI*p
  var s = PI/2 - a
  var e = PI/2 + a
  ctx.strokeStyle = yellow
  ctx.beginPath()
  ctx.arc(this.x, this.y, this.r, s, e)
  ctx.stroke()
}

Circle.prototype.createTails = function () {
  var n = this.step
  var num = steps[n]
  var tails = []
  for (var i = 0; i < num; i++) {
    var tail = new Tail(this, i)
    tails.push(tail)
  }
  this.tails = tails
}

module.exports = Circle
