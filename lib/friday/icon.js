var util = require('../util')
var width = 60
var height = 60
var pad = 10
var yellow = '#F3DD70'
var bgColor = '#171616'
var PI = Math.PI

function Icon(view) {
  this.view = view
  this.ctx = view.ctx
  var th = view.th
  var h = view.height - th
  this.x = view.width/2
  this.y = Math.min(view.width/2, h/2)
}

Icon.prototype.draw = function () {
  var stat = this.view.stat
  var ctx = this.ctx
  var percent = this.view.percent
  ctx.strokeStyle = yellow
  ctx.lineWidth = 2
  if (stat === 'checking') {
    this.check(percent)
  } else if (stat === 'reseting') {
    this.reset(percent)
  } else {
    this.rect(2)
    this.content(0)
  }
}

Icon.prototype.rect = function (r) {
  var ctx = this.ctx
  var x = this.x - width/2
  var y = this.y - height/2
  util.drawRoundRect(ctx, x, y, width, height, r)
  ctx.stroke()
}

Icon.prototype.content = function (translateX, opacity) {
  var ctx = this.ctx
  translateX = translateX || 0
  ctx.translate(translateX, 0)
  if (opacity) ctx.strokeStyle = util.toRgba(yellow, opacity)
  var x =  this.x - width/2 + pad
  var y = this.y - height/2 + pad
  var w = (width - pad*2)/2 - 1
  var h = (height - pad*2)*3/5
  ctx.strokeRect(x, y, w, h)
  for (var i = 0; i < 3; i++) {
    ctx.beginPath()
    ctx.moveTo(this.x + 5, y - i + 1)
    ctx.lineTo(this.x + width/2 - pad, y - i + 1)
    ctx.stroke()
    y = y + h/2
  }
  for (i = 0; i < 2; i++) {
    ctx.beginPath()
    var ty = this.y + 13 + i*(height - pad*2)/5
    ctx.moveTo(x + i*2, ty)
    ctx.lineTo(this.x + width/2 - pad - i*5, ty)
    ctx.stroke()
  }
  // reset transform
  ctx.setTransform(window.devicePixelRatio || 1 ,0 ,0 ,window.devicePixelRatio || 1 ,0, 0);
}

Icon.prototype.check = function (percent) {
  var r = 2 + (width/2 - 2)*percent
  if (percent === 1) {
    var ctx = this.ctx
    ctx.beginPath()
    ctx.arc(this.x, this.y, width/2, 0, Math.PI*2)
    ctx.stroke()
  } else {
    this.rect(r+2)
  }
  var m = 0.2
  var p = percent/m
  if (p <= 1) {
    var translate = - width*p
    var opacity = 0.4*(1 - p)
    this.content(translate, opacity)
    var mx = this.x - width/2 - width
    var my = this.y - height/2
    this.mask(mx, my)
  } else {
    p = (percent - m)/(1 - m)
    this.drawCorrect(p)
  }
}

Icon.prototype.mask = function (x, y) {
  var ctx = this.ctx
  ctx.fillStyle = bgColor
  ctx.fillRect(x, y, width, height)
}

Icon.prototype.drawCorrect = function (p, tx) {
  var l = 14
  var tl = 2.618*l
  var len = tl*(outBack(p))
  var ctx = this.ctx
  var x = this.x
  var y = this.y
  var sx = x - 10
  var sy = y - 3
  var subtense = Math.min(len, l)
  var mx = sx + subtense*Math.cos(45*PI/180)
  var my = sy + subtense*Math.sin(45*PI/180)
  tx = tx != null ? tx : - 8*(1 - outBack(p))
  ctx.translate(tx, 0)
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
  ctx.setTransform(window.devicePixelRatio || 1 ,0 ,0 ,window.devicePixelRatio || 1 ,0, 0);
}

Icon.prototype.reset = function (percent) {
  var ctx = this.ctx
  var m = 0.4
  var p = percent/m
  // rect
  var r = 2 + (width/2 - 2)*(1 - percent)
  if (percent === 0) {
    ctx.beginPath()
    ctx.arc(this.x, this.y, width/2, 0, Math.PI*2)
    ctx.stroke()
  } else {
    this.rect(r+2)
  }
  var mx
  var my
  // correct
  if (p <= 1) {
    var tx = - p*width
    ctx.strokeStyle = util.toRgba(yellow, 0.6)
    this.drawCorrect(1, tx)
    mx = this.x - width/2 - width
    my = this.y - height/2
    this.mask(mx, my)
  } else {
    // content
    p = (percent - m)/(1 - m)
    var translate = width*(1 - p)
    this.content(translate, 1)
    mx = this.x + width/2
    my = this.y - height/2
    this.mask(mx, my)
  }
}


function outBack(n){
  var s = 1.70158;
  return --n * n * ((s + 1) * n + s) + 1;
}

module.exports = Icon
