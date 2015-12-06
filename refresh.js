if (!('ontouchend' in window)) alert('仅支持触屏设备')

var Promise = require('es6-promise-polyfill').Promise
// stop stupid safari over scroll
document.addEventListener('touchmove', function(e) {
  e.preventDefault()
})

screen.lockOrientationUniversal = screen.lockOrientation || screen.mozLockOrientation || screen.msLockOrientation;
try {
if (screen.lockOrientationUniversal && screen.lockOrientationUniversal("landscape-primary")) {
  // only works for Chrome for Android
  // https://developer.mozilla.org/en-US/docs/Web/API/Screen/lockOrientation
}
} catch (e) { } // eslint-disable-line

var Swipe = require('swipe-it')
var tap = require('tap-event')
var Refresh = require('..').refresh
var scrollable = document.querySelector('.scrollable')
Refresh(scrollable, function () {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve()
    }, 1500)
  })
})

var template = '<div class="remove"><div class="trash"></div></div>'
var s = new Swipe(template, {
  ease: 'out-back'
})
var el = document.querySelector('.projects')
s.bind(el, '.content')
s.delegate('touchstart', '.trash', tap(function(e, el) {
  var li = el.parentNode
  li.removeChild(li.querySelector('.title'))
  // remove holder and swiped element with transition
  s.clear().then(function() {
    li.parentNode.removeChild(li)
  })
}))
