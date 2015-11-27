// 2 degree
var gap = Math.PI*1/180
// 5 degree
var total = 2*Math.PI/180

var width = 5

/**
 * Tail
 *
 * @public
 * @param {Number} index tail index
 */
function Tail(circle, index) {
  this.index = index
  this.ctx = circle.ctx
  this.circle = circle
  this.x = circle.x
  this.y = circle.y
  this.r = circle.r
}

Tail.prototype.draw = function (percent) {
  var w = width*(1 - percent)
  var i = this.index
  var g = gap*(percent + 1)*4
  var s = this.circle.end + g + i*(g + total)
  var e = s + total*(1 - percent)
  var ctx = this.ctx
  ctx.lineWidth = w
  ctx.beginPath()
  ctx.arc(this.x, this.y, this.r, s, e)
  ctx.stroke()
}

module.exports = Tail
