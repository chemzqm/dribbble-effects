var toRgb = exports.toRgb = function (hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
  } : null;
}

exports.toRgba = function (hex, alpha) {
  var rgb = toRgb(hex)
  return 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ','  + alpha + ')'
}

exports.drawRoundRect = function (ctx, x, y , w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w ,y , x + w, y + r);
  ctx.lineTo(x + w , y + h - r);
  ctx.quadraticCurveTo(x + w , y + h, x + w - r, y + h);
  ctx.lineTo(x + r , y + h);
  ctx.quadraticCurveTo(x , y + h, x, y + h - r);
  ctx.lineTo(x , y + r);
  ctx.quadraticCurveTo(x , y , x + r, y);
}
