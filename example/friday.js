var Promise = require('es6-promise-polyfill').Promise
if (window.navigator.standalone) {
  // stop stupid safari over scroll
  document.addEventListener('touchmove', function(e) {
    e.preventDefault()
  })
}

screen.lockOrientationUniversal = screen.lockOrientation || screen.mozLockOrientation || screen.msLockOrientation;
try {
if (screen.lockOrientationUniversal && screen.lockOrientationUniversal("landscape-primary")) {
  // only works for Chrome for Android
  // https://developer.mozilla.org/en-US/docs/Web/API/Screen/lockOrientation
}
} catch (e) { } // eslint-disable-line

var Friday = require('..').friday

var el = document.getElementById('main')
var dateEl = document.getElementById('date')
var f = new Friday(el, dateEl)

// show time
f.process.then(function() {
  if (stopped) return Promise.reject()
  return f.next()
}).then(function() {
  if (stopped) return Promise.reject()
  return f.wait(200)
}).then(function() {
  if (stopped) return Promise.reject()
  return f.prev()
}).then(function() {
  if (stopped) return Promise.reject()
}).catch(function() {
  return false
})

var stopped
function stop() {
  stopped = true
}

var container = document.querySelector('.container')
container.addEventListener('touchstart', stop, false)
container.addEventListener('mousedown', stop, false)
