var white = '#dfdfdf'
var gray = '#A4A3A3'
// second
var total = 24*60*60
var util = require('../util')

function Time(view) {
  this.view = view
  this.ctx = view.ctx
  var th = view.th
  this.x = view.width/2
  var h = view.height - th/2
  this.y = view.circle.y + view.circle.r + 50
  //this.y = Math.min(h ,view.width + th/2) - 30
  this.white = util.toRgba(white, 1)
  this.gray = util.toRgba(gray, 0.8)
}

Time.prototype.draw = function () {
  var ctx = this.ctx
  var percent = this.view.percent
  var stat = this.view.stat
  ctx.save()
  ctx.fillStyle = this.white
  ctx.font = '100 30px Helvetica'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  var hms = this.getHMS(stat, percent)
  ctx.fillText(hms.h + ' h  ' + hms.m + ' m  ' + hms.s + ' s', this.x, this.y)
  ctx.font = '100 12px Helvetica'
  var y = this.y + 35
  ctx.fillStyle = this.gray
  ctx.fillText('UNTIL NEXT DIGEST', this.x ,y)
  ctx.restore()
}

Time.prototype.getHMS = function (stat, percent) {
  if (stat === 'pending') {
    var n = total*(1 - percent)
    return toHMS(n)
  }
  if (stat === 'checking') {
    return {h: '00', m: '00', s: '00'}
  }
  if (stat === 'reseting') {
    var h = pad(Math.floor(24*percent))
    var m = pad(Math.floor(60*percent))
    if (m === '60') m = '00'
    var s = pad(Math.floor(60*percent))
    if (s === '60') s = '00'
    return { h: h, m: m, s: s}
  }
}

function pad(n) {
  return ('0' + String(n)).slice(-2)
}

function toHMS(n) {
  var h = Math.floor(n/3600)
  var m = Math.floor((n - h*3600)/60)
  var s = Math.floor(n%60)
  return {
    h: pad(h),
    m: pad(m),
    s: pad(s)
  }
}
module.exports = Time
