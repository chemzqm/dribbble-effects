
if (window.navigator.standalone) {
  document.addEventListener('touchmove', function(e) {
    e.preventDefault()
  })
}

var Friday = require('..').friday

var el = document.getElementById('main')
var dateEl = document.getElementById('date')
var f = new Friday(el, dateEl)

// show time
function animate() {
  f.process.then(function() {
    return f.next()
  }).then(function() {
    return f.wait(200)
  }).then(function() {
    return f.prev()
  }).then(function() {
    animate()
  }).catch(function() {
    return false
  })
}

animate()

