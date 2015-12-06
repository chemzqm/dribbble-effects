/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	var parentJsonpFunction = window["webpackJsonp"];
/******/ 	window["webpackJsonp"] = function webpackJsonpCallback(chunkIds, moreModules) {
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, callbacks = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(installedChunks[chunkId])
/******/ 				callbacks.push.apply(callbacks, installedChunks[chunkId]);
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			modules[moduleId] = moreModules[moduleId];
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(chunkIds, moreModules);
/******/ 		while(callbacks.length)
/******/ 			callbacks.shift().call(null, __webpack_require__);
/******/ 		if(moreModules[0]) {
/******/ 			installedModules[0] = 0;
/******/ 			return __webpack_require__(0);
/******/ 		}
/******/ 	};
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// "0" means "already loaded"
/******/ 	// Array means "loading", array contains callbacks
/******/ 	var installedChunks = {
/******/ 		2:0
/******/ 	};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/ 	// This file contains only the entry chunk.
/******/ 	// The chunk loading function for additional chunks
/******/ 	__webpack_require__.e = function requireEnsure(chunkId, callback) {
/******/ 		// "0" is the signal for "already loaded"
/******/ 		if(installedChunks[chunkId] === 0)
/******/ 			return callback.call(null, __webpack_require__);
/******/
/******/ 		// an array means "currently loading".
/******/ 		if(installedChunks[chunkId] !== undefined) {
/******/ 			installedChunks[chunkId].push(callback);
/******/ 		} else {
/******/ 			// start chunk loading
/******/ 			installedChunks[chunkId] = [callback];
/******/ 			var head = document.getElementsByTagName('head')[0];
/******/ 			var script = document.createElement('script');
/******/ 			script.type = 'text/javascript';
/******/ 			script.charset = 'utf-8';
/******/ 			script.async = true;
/******/
/******/ 			script.src = __webpack_require__.p + "" + chunkId + "." + ({"0":"friday","1":"refresh"}[chunkId]||chunkId) + ".bundle.js";
/******/ 			head.appendChild(script);
/******/ 		}
/******/ 	};
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/ })
/************************************************************************/
/******/ ([
/* 0 */,
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(global, setImmediate) {(function(global){
	
	//
	// Check for native Promise and it has correct interface
	//
	
	var NativePromise = global['Promise'];
	var nativePromiseSupported =
	  NativePromise &&
	  // Some of these methods are missing from
	  // Firefox/Chrome experimental implementations
	  'resolve' in NativePromise &&
	  'reject' in NativePromise &&
	  'all' in NativePromise &&
	  'race' in NativePromise &&
	  // Older version of the spec had a resolver object
	  // as the arg rather than a function
	  (function(){
	    var resolve;
	    new NativePromise(function(r){ resolve = r; });
	    return typeof resolve === 'function';
	  })();
	
	
	//
	// export if necessary
	//
	
	if (typeof exports !== 'undefined' && exports)
	{
	  // node.js
	  exports.Promise = nativePromiseSupported ? NativePromise : Promise;
	}
	else
	{
	  // AMD
	  if (true)
	  {
	    !(__WEBPACK_AMD_DEFINE_RESULT__ = function(){
	      return nativePromiseSupported ? NativePromise : Promise;
	    }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  }
	  else
	  {
	    // in browser add to global
	    if (!nativePromiseSupported)
	      global['Promise'] = Promise;
	  }
	}
	
	
	//
	// Polyfill
	//
	
	var PENDING = 'pending';
	var SEALED = 'sealed';
	var FULFILLED = 'fulfilled';
	var REJECTED = 'rejected';
	var NOOP = function(){};
	
	// async calls
	var asyncSetTimer = typeof setImmediate !== 'undefined' ? setImmediate : setTimeout;
	var asyncQueue = [];
	var asyncTimer;
	
	function asyncFlush(){
	  // run promise callbacks
	  for (var i = 0; i < asyncQueue.length; i++)
	    asyncQueue[i][0](asyncQueue[i][1]);
	
	  // reset async asyncQueue
	  asyncQueue = [];
	  asyncTimer = false;
	}
	
	function asyncCall(callback, arg){
	  asyncQueue.push([callback, arg]);
	
	  if (!asyncTimer)
	  {
	    asyncTimer = true;
	    asyncSetTimer(asyncFlush, 0);
	  }
	}
	
	
	function invokeResolver(resolver, promise) {
	  function resolvePromise(value) {
	    resolve(promise, value);
	  }
	
	  function rejectPromise(reason) {
	    reject(promise, reason);
	  }
	
	  try {
	    resolver(resolvePromise, rejectPromise);
	  } catch(e) {
	    rejectPromise(e);
	  }
	}
	
	function invokeCallback(subscriber){
	  var owner = subscriber.owner;
	  var settled = owner.state_;
	  var value = owner.data_;  
	  var callback = subscriber[settled];
	  var promise = subscriber.then;
	
	  if (typeof callback === 'function')
	  {
	    settled = FULFILLED;
	    try {
	      value = callback(value);
	    } catch(e) {
	      reject(promise, e);
	    }
	  }
	
	  if (!handleThenable(promise, value))
	  {
	    if (settled === FULFILLED)
	      resolve(promise, value);
	
	    if (settled === REJECTED)
	      reject(promise, value);
	  }
	}
	
	function handleThenable(promise, value) {
	  var resolved;
	
	  try {
	    if (promise === value)
	      throw new TypeError('A promises callback cannot return that same promise.');
	
	    if (value && (typeof value === 'function' || typeof value === 'object'))
	    {
	      var then = value.then;  // then should be retrived only once
	
	      if (typeof then === 'function')
	      {
	        then.call(value, function(val){
	          if (!resolved)
	          {
	            resolved = true;
	
	            if (value !== val)
	              resolve(promise, val);
	            else
	              fulfill(promise, val);
	          }
	        }, function(reason){
	          if (!resolved)
	          {
	            resolved = true;
	
	            reject(promise, reason);
	          }
	        });
	
	        return true;
	      }
	    }
	  } catch (e) {
	    if (!resolved)
	      reject(promise, e);
	
	    return true;
	  }
	
	  return false;
	}
	
	function resolve(promise, value){
	  if (promise === value || !handleThenable(promise, value))
	    fulfill(promise, value);
	}
	
	function fulfill(promise, value){
	  if (promise.state_ === PENDING)
	  {
	    promise.state_ = SEALED;
	    promise.data_ = value;
	
	    asyncCall(publishFulfillment, promise);
	  }
	}
	
	function reject(promise, reason){
	  if (promise.state_ === PENDING)
	  {
	    promise.state_ = SEALED;
	    promise.data_ = reason;
	
	    asyncCall(publishRejection, promise);
	  }
	}
	
	function publish(promise) {
	  promise.then_ = promise.then_.forEach(invokeCallback);
	}
	
	function publishFulfillment(promise){
	  promise.state_ = FULFILLED;
	  publish(promise);
	}
	
	function publishRejection(promise){
	  promise.state_ = REJECTED;
	  publish(promise);
	}
	
	/**
	* @class
	*/
	function Promise(resolver){
	  if (typeof resolver !== 'function')
	    throw new TypeError('Promise constructor takes a function argument');
	
	  if (this instanceof Promise === false)
	    throw new TypeError('Failed to construct \'Promise\': Please use the \'new\' operator, this object constructor cannot be called as a function.');
	
	  this.then_ = [];
	
	  invokeResolver(resolver, this);
	}
	
	Promise.prototype = {
	  constructor: Promise,
	
	  state_: PENDING,
	  then_: null,
	  data_: undefined,
	
	  then: function(onFulfillment, onRejection){
	    var subscriber = {
	      owner: this,
	      then: new this.constructor(NOOP),
	      fulfilled: onFulfillment,
	      rejected: onRejection
	    };
	
	    if (this.state_ === FULFILLED || this.state_ === REJECTED)
	    {
	      // already resolved, call callback async
	      asyncCall(invokeCallback, subscriber);
	    }
	    else
	    {
	      // subscribe
	      this.then_.push(subscriber);
	    }
	
	    return subscriber.then;
	  },
	
	  'catch': function(onRejection) {
	    return this.then(null, onRejection);
	  }
	};
	
	Promise.all = function(promises){
	  var Class = this;
	
	  if (!Array.isArray(promises))
	    throw new TypeError('You must pass an array to Promise.all().');
	
	  return new Class(function(resolve, reject){
	    var results = [];
	    var remaining = 0;
	
	    function resolver(index){
	      remaining++;
	      return function(value){
	        results[index] = value;
	        if (!--remaining)
	          resolve(results);
	      };
	    }
	
	    for (var i = 0, promise; i < promises.length; i++)
	    {
	      promise = promises[i];
	
	      if (promise && typeof promise.then === 'function')
	        promise.then(resolver(i), reject);
	      else
	        results[i] = promise;
	    }
	
	    if (!remaining)
	      resolve(results);
	  });
	};
	
	Promise.race = function(promises){
	  var Class = this;
	
	  if (!Array.isArray(promises))
	    throw new TypeError('You must pass an array to Promise.race().');
	
	  return new Class(function(resolve, reject) {
	    for (var i = 0, promise; i < promises.length; i++)
	    {
	      promise = promises[i];
	
	      if (promise && typeof promise.then === 'function')
	        promise.then(resolve, reject);
	      else
	        resolve(promise);
	    }
	  });
	};
	
	Promise.resolve = function(value){
	  var Class = this;
	
	  if (value && typeof value === 'object' && value.constructor === Class)
	    return value;
	
	  return new Class(function(resolve){
	    resolve(value);
	  });
	};
	
	Promise.reject = function(reason){
	  var Class = this;
	
	  return new Class(function(resolve, reject){
	    reject(reason);
	  });
	};
	
	})(typeof window != 'undefined' ? window : typeof global != 'undefined' ? global : typeof self != 'undefined' ? self : this);
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(2).setImmediate))

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(setImmediate, clearImmediate) {var nextTick = __webpack_require__(3).nextTick;
	var apply = Function.prototype.apply;
	var slice = Array.prototype.slice;
	var immediateIds = {};
	var nextImmediateId = 0;
	
	// DOM APIs, for completeness
	
	exports.setTimeout = function() {
	  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
	};
	exports.setInterval = function() {
	  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
	};
	exports.clearTimeout =
	exports.clearInterval = function(timeout) { timeout.close(); };
	
	function Timeout(id, clearFn) {
	  this._id = id;
	  this._clearFn = clearFn;
	}
	Timeout.prototype.unref = Timeout.prototype.ref = function() {};
	Timeout.prototype.close = function() {
	  this._clearFn.call(window, this._id);
	};
	
	// Does not start the time, just sets up the members needed.
	exports.enroll = function(item, msecs) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = msecs;
	};
	
	exports.unenroll = function(item) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = -1;
	};
	
	exports._unrefActive = exports.active = function(item) {
	  clearTimeout(item._idleTimeoutId);
	
	  var msecs = item._idleTimeout;
	  if (msecs >= 0) {
	    item._idleTimeoutId = setTimeout(function onTimeout() {
	      if (item._onTimeout)
	        item._onTimeout();
	    }, msecs);
	  }
	};
	
	// That's not how node.js implements it but the exposed api is the same.
	exports.setImmediate = typeof setImmediate === "function" ? setImmediate : function(fn) {
	  var id = nextImmediateId++;
	  var args = arguments.length < 2 ? false : slice.call(arguments, 1);
	
	  immediateIds[id] = true;
	
	  nextTick(function onNextTick() {
	    if (immediateIds[id]) {
	      // fn.call() is faster so we optimize for the common use-case
	      // @see http://jsperf.com/call-apply-segu
	      if (args) {
	        fn.apply(null, args);
	      } else {
	        fn.call(null);
	      }
	      // Prevent ids from leaking
	      exports.clearImmediate(id);
	    }
	  });
	
	  return id;
	};
	
	exports.clearImmediate = typeof clearImmediate === "function" ? clearImmediate : function(id) {
	  delete immediateIds[id];
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2).setImmediate, __webpack_require__(2).clearImmediate))

/***/ },
/* 3 */
/***/ function(module, exports) {

	// shim for using process in browser
	
	var process = module.exports = {};
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;
	
	function cleanUpNextTick() {
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}
	
	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = setTimeout(cleanUpNextTick);
	    draining = true;
	
	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    clearTimeout(timeout);
	}
	
	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        setTimeout(drainQueue, 0);
	    }
	};
	
	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};
	
	function noop() {}
	
	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	
	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};
	
	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	exports.friday = __webpack_require__(5)
	exports.refresh = __webpack_require__(34)


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var Promise = __webpack_require__(1).Promise
	var Circle = __webpack_require__(6)
	var Icon = __webpack_require__(9)
	var Time = __webpack_require__(10)
	var autoscale = __webpack_require__(11)
	var raf = __webpack_require__(12)
	var Footer = __webpack_require__(13)
	var Emitter = __webpack_require__(15)
	
	function View(el, dateEl) {
	  this.el = el
	  // text height
	  this.th = 60
	  this.width = el.clientWidth
	  this.height = el.clientHeight
	  var canvas = this.canvas  = document.createElement('canvas')
	  el.appendChild(canvas);
	  canvas.height = this.height
	  canvas.width = this.width
	  this.ctx = canvas.getContext('2d')
	  autoscale(canvas)
	  this.circle = new Circle(this)
	  this.icon = new Icon(this)
	  this.time = new Time(this)
	  this.stat = 'stopped'
	  var footer = this.footer = new Footer(dateEl)
	  var self = this
	  function onchange () {
	    //self.promise = self.promise || Promise.resolve(null)
	    self.process = self.cancel().then(function () {
	      if (self.checked) {
	        return self.reset().then(function () {
	          return self.wait(300)
	        })
	      }
	    }).then(function () {
	      return self.pend()
	    }).then(function () {
	      return self.check()
	    }).catch(function () {
	      return true
	    })
	  }
	  footer.on('change', onchange)
	  // select yesterday
	  footer.select(1)
	}
	
	Emitter(View.prototype)
	
	View.prototype.wait = function (n) {
	  var self = this
	  var promise = this.promise = new Promise(function (resolve, reject) {
	    if (self.canceled) return reject()
	    var called
	    var timeout = setTimeout(function () {
	      called = true
	      resolve()
	    }, n)
	    self.once('cancel', function () {
	      if (!called) {
	        clearTimeout(timeout)
	        reject()
	      }
	    })
	  })
	  return promise
	}
	
	View.prototype.draw = function () {
	  this.circle.draw()
	  this.icon.draw()
	  this.time.draw()
	}
	
	View.prototype.pend = function () {
	  this.duration = 3300
	  this.stat = 'pending'
	  return this.animate()
	}
	
	View.prototype.check = function () {
	  this.duration = 800
	  this.stat = 'checking'
	  var promise = this.animate()
	  return promise
	}
	
	View.prototype.reset = function () {
	  this.duration = 500
	  this.stat = 'reseting'
	  return this.animate()
	}
	
	View.prototype.animate = function () {
	  var duration = this.duration
	  var start
	  var self = this
	  self.checked = false
	  var promise = this.promise = new Promise(function (resolve, reject) {
	    function step(timestamp) {
	      self.ctx.setTransform(window.devicePixelRatio || 1 ,0 ,0 ,window.devicePixelRatio || 1 ,0, 0);
	      self.ctx.clearRect(0, 0, self.width, self.height)
	      if (self.canceled === true) {
	        return reject()
	      }
	      if (!start) start = timestamp
	      var d = timestamp - start
	      self.percent = Math.min(1, d/duration)
	      self.draw()
	      if (d > duration) {
	        if (self.stat === 'checking') self.checked = true
	        return resolve()
	      }
	      raf(step)
	    }
	    raf(step)
	  })
	  return promise
	}
	
	View.prototype.cancel = function () {
	  this.emit('cancel')
	  this.promise = this.promise || Promise.resolve(null)
	  this.canceled = true
	  var self = this
	  return this.promise.then(function () {
	    self.canceled = false
	  }, function () {
	    self.canceled = false
	  })
	}
	
	View.prototype.next = function () {
	  return this.footer.next()
	}
	
	View.prototype.prev = function () {
	  return this.footer.prev()
	}
	
	module.exports = View


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var gray = '#A4A3A3'
	var yellow = '#F3DD70'
	var PI = Math.PI
	var util = __webpack_require__(7)
	var steps = [0, 1, 2, 2, 3, 2, 2, 1, 0, 0]
	var step_len = steps.length
	var Tail = __webpack_require__(8)
	var width = 5
	
	function Circle(view) {
	  this.view = view
	  this.ctx = view.ctx
	  this.x = view.width/2
	  var th = view.th
	  var h = view.height - th
	  this.y = h/2 - 20
	  // min padding
	  var pad = 50
	  this.r = Math.max(100, Math.min(this.x, this.y) - pad)
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


/***/ },
/* 7 */
/***/ function(module, exports) {

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


/***/ },
/* 8 */
/***/ function(module, exports) {

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


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var util = __webpack_require__(7)
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
	  this.y = h/2 - 20
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
	  var m = 0.3
	  var p = percent/m
	  if (p <= 1) {
	    var translate = - width*p
	    var opacity = 0.5*(1 - p)
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


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var white = '#dfdfdf'
	var gray = '#A4A3A3'
	// second
	var total = 24*60*60
	var util = __webpack_require__(7)
	
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


/***/ },
/* 11 */
/***/ function(module, exports) {

	
	/**
	 * Retina-enable the given `canvas`.
	 *
	 * @param {Canvas} canvas
	 * @return {Canvas}
	 * @api public
	 */
	
	module.exports = function(canvas){
	  var ctx = canvas.getContext('2d');
	  var ratio = window.devicePixelRatio || 1;
	  if (1 != ratio) {
	    canvas.style.width = canvas.width + 'px';
	    canvas.style.height = canvas.height + 'px';
	    canvas.width *= ratio;
	    canvas.height *= ratio;
	    ctx.scale(ratio, ratio);
	  }
	  return canvas;
	};

/***/ },
/* 12 */
/***/ function(module, exports) {

	/**
	 * Expose `requestAnimationFrame()`.
	 */
	
	exports = module.exports = window.requestAnimationFrame
	  || window.webkitRequestAnimationFrame
	  || window.mozRequestAnimationFrame
	  || fallback;
	
	/**
	 * Fallback implementation.
	 */
	
	var prev = new Date().getTime();
	function fallback(fn) {
	  var curr = new Date().getTime();
	  var ms = Math.max(0, 16 - (curr - prev));
	  var req = setTimeout(fn, ms);
	  prev = curr;
	  return req;
	}
	
	/**
	 * Cancel.
	 */
	
	var cancel = window.cancelAnimationFrame
	  || window.webkitCancelAnimationFrame
	  || window.mozCancelAnimationFrame
	  || window.clearTimeout;
	
	exports.cancel = function(id){
	  cancel.call(window, id);
	};


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var Promise = __webpack_require__(1).Promise
	var Tween = __webpack_require__(14)
	var raf = __webpack_require__(12)
	var template = __webpack_require__(19)
	var domify = __webpack_require__(20)
	var detect = __webpack_require__(21)
	var events = __webpack_require__(27)
	var has3d = detect.has3d
	var transform = detect.transform
	var Emitter = __webpack_require__(15)
	var tap = __webpack_require__(33)
	
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
	
	var hastouch = 'ontouchstart' in window
	
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
	  this.events.bind('mousedown', 'ontouchstart')
	  this.events.bind('mousemove', 'ontouchmove')
	  if (hastouch) {
	    this.events.bind('touchstart li', 'ontap')
	  } else {
	    this.events.bind('click li')
	  }
	  this.docEvents.bind('touchend')
	  this.docEvents.bind('mouseup', 'ontouchend')
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
	  if (this.tween) this.tween.stop()
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
	
	Footer.prototype.animate = function (x, ease, duration) {
	  ease = ease || 'out-quad'
	  duration = duration || 300
	  var tween = this.tween = Tween({x : this.x})
	  .ease(ease)
	  .to({x : x})
	  .duration(duration)
	
	  var self = this
	  tween.update(function(o){
	    self.translate(o.x)
	  })
	
	  var promise = new Promise(function (resolve, reject) {
	    var rejected
	    tween.on('stop', function () {
	      rejected = true
	      reject()
	    })
	    tween.on('end', function(){
	      self.tween = null
	      animate = function(){} // eslint-disable-line
	      if (!rejected) resolve()
	    })
	  })
	
	  function animate() {
	    raf(animate)
	    tween.update()
	  }
	
	  animate()
	  return promise
	}
	
	Footer.prototype.onclick = function (e) {
	  var li = e.delegateTarget
	  var children = this.el.children
	  var index
	  for (var i = 0, l = children.length; i < l; i++) {
	    if (li === children[i]) {
	      index = i
	      break;
	    }
	  }
	  this.active(index)
	}
	
	Footer.prototype.ontap = tap(Footer.prototype.onclick)
	
	Footer.prototype.ontouchstart = function (e) {
	  if (this.tween) this.tween.stop()
	  var touch = this.getTouch(e)
	  this.px = touch.pageX
	  this.sx = this.x
	  this.dx = 0
	  this.ts = Date.now()
	  this.pageX = touch.pageX
	  this.down = {
	    x: touch.pageX,
	    y: touch.pageY,
	    start: this.x,
	    at: this.ts
	  }
	}
	
	Footer.prototype.ontouchmove = function (e) {
	  if (!this.down) return
	  if (this.tween) this.tween.stop()
	  e.preventDefault()
	  var touch = this.getTouch(e)
	  var dx = touch.pageX - this.px
	  if (!this.pageX) this.pageX = touch.pageX
	  //calculate speed every 100 milisecond
	  this.calcuteSpeed(touch.pageX)
	
	  var x = this.sx + dx
	  x = Math.min(width/3, x)
	  x = Math.max(x, - (this.total - this.count)*width - width/3)
	  this.translate(x)
	}
	
	Footer.prototype.ontouchend = function (e) {
	  if (!this.down) return
	  var touch = this.getTouch(e)
	  this.calcuteSpeed(touch.pageX)
	  var m = this.momentum()
	  this.ps = this.down = this.sx = null
	  if (isNaN(m.x)) {
	    // WTF
	    return
	  }
	  this.animate(m.x, m.ease, m.duration).catch(function () {
	  })
	}
	
	Footer.prototype.getTouch = function (e) {
	  if (e.changedTouches && e.changedTouches.length > 0) {
	    return e.changedTouches[0]
	  }
	  return e
	}
	
	Footer.prototype.momentum = function () {
	  var deceleration = 0.0004
	  var speed = this.speed
	  var x = this.x
	  speed = Math.min(speed, 0.6)
	  var minX = - (this.total - this.count)*width
	  var destination = x + ( speed * speed ) / ( 2 * deceleration ) * ( this.distance < 0 ? -1 : 1 )
	  var duration = speed / deceleration
	  var newX
	  var ease = 'out-cube'
	  if (destination > 0) {
	    newX = 0
	    ease = 'out-back'
	  } else if (destination < minX) {
	    newX = minX
	    ease = 'out-back'
	  }
	  if (typeof newX === 'number') {
	    duration = duration*Math.abs((newX - x + 50)/(destination - x))
	    //duration = Math.max(200, duration)
	    destination = newX
	  }
	  if (x > 0 || x < minX) {
	    duration = 500
	    ease = 'out-circ'
	  }
	  destination = Math.round(destination/width)*width
	  return {
	    x: destination,
	    duration: duration,
	    ease: ease
	  }
	}
	
	
	Footer.prototype.calcuteSpeed = function (x) {
	  var ts = Date.now()
	  var dt = ts - this.ts
	  if (ts - this.down.at < 100) {
	    this.distance = x - this.pageX
	    this.speed = Math.abs(this.distance/dt)
	  } else if(dt > 100){
	    this.distance = x - this.pageX
	    this.speed = Math.abs(this.distance/dt)
	    this.ts = ts
	    this.pageX = x
	  }
	}
	
	module.exports = Footer


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * Module dependencies.
	 */
	
	var Emitter = __webpack_require__(15);
	var clone = __webpack_require__(16);
	var type = __webpack_require__(17);
	var ease = __webpack_require__(18);
	
	/**
	 * Expose `Tween`.
	 */
	
	module.exports = Tween;
	
	/**
	 * Initialize a new `Tween` with `obj`.
	 *
	 * @param {Object|Array} obj
	 * @api public
	 */
	
	function Tween(obj) {
	  if (!(this instanceof Tween)) return new Tween(obj);
	  this._from = obj;
	  this.ease('linear');
	  this.duration(500);
	}
	
	/**
	 * Mixin emitter.
	 */
	
	Emitter(Tween.prototype);
	
	/**
	 * Reset the tween.
	 *
	 * @api public
	 */
	
	Tween.prototype.reset = function(){
	  this.isArray = 'array' === type(this._from);
	  this._curr = clone(this._from);
	  this._done = false;
	  this._start = Date.now();
	  return this;
	};
	
	/**
	 * Tween to `obj` and reset internal state.
	 *
	 *    tween.to({ x: 50, y: 100 })
	 *
	 * @param {Object|Array} obj
	 * @return {Tween} self
	 * @api public
	 */
	
	Tween.prototype.to = function(obj){
	  this.reset();
	  this._to = obj;
	  return this;
	};
	
	/**
	 * Set duration to `ms` [500].
	 *
	 * @param {Number} ms
	 * @return {Tween} self
	 * @api public
	 */
	
	Tween.prototype.duration = function(ms){
	  this._duration = ms;
	  return this;
	};
	
	/**
	 * Set easing function to `fn`.
	 *
	 *    tween.ease('in-out-sine')
	 *
	 * @param {String|Function} fn
	 * @return {Tween}
	 * @api public
	 */
	
	Tween.prototype.ease = function(fn){
	  fn = 'function' == typeof fn ? fn : ease[fn];
	  if (!fn) throw new TypeError('invalid easing function');
	  this._ease = fn;
	  return this;
	};
	
	/**
	 * Stop the tween and immediately emit "stop" and "end".
	 *
	 * @return {Tween}
	 * @api public
	 */
	
	Tween.prototype.stop = function(){
	  this.stopped = true;
	  this._done = true;
	  this.emit('stop');
	  this.emit('end');
	  return this;
	};
	
	/**
	 * Perform a step.
	 *
	 * @return {Tween} self
	 * @api private
	 */
	
	Tween.prototype.step = function(){
	  if (this._done) return;
	
	  // duration
	  var duration = this._duration;
	  var now = Date.now();
	  var delta = now - this._start;
	  var done = delta >= duration;
	
	  // complete
	  if (done) {
	    this._from = this._to;
	    this._update(this._to);
	    this._done = true;
	    this.emit('end');
	    return this;
	  }
	
	  // tween
	  var from = this._from;
	  var to = this._to;
	  var curr = this._curr;
	  var fn = this._ease;
	  var p = (now - this._start) / duration;
	  var n = fn(p);
	
	  // array
	  if (this.isArray) {
	    for (var i = 0; i < from.length; ++i) {
	      curr[i] = from[i] + (to[i] - from[i]) * n;
	    }
	
	    this._update(curr);
	    return this;
	  }
	
	  // objech
	  for (var k in from) {
	    curr[k] = from[k] + (to[k] - from[k]) * n;
	  }
	
	  this._update(curr);
	  return this;
	};
	
	/**
	 * Set update function to `fn` or
	 * when no argument is given this performs
	 * a "step".
	 *
	 * @param {Function} fn
	 * @return {Tween} self
	 * @api public
	 */
	
	Tween.prototype.update = function(fn){
	  if (0 == arguments.length) return this.step();
	  this._update = fn;
	  return this;
	};

/***/ },
/* 15 */
/***/ function(module, exports) {

	
	/**
	 * Expose `Emitter`.
	 */
	
	module.exports = Emitter;
	
	/**
	 * Initialize a new `Emitter`.
	 *
	 * @api public
	 */
	
	function Emitter(obj) {
	  if (obj) return mixin(obj);
	};
	
	/**
	 * Mixin the emitter properties.
	 *
	 * @param {Object} obj
	 * @return {Object}
	 * @api private
	 */
	
	function mixin(obj) {
	  for (var key in Emitter.prototype) {
	    obj[key] = Emitter.prototype[key];
	  }
	  return obj;
	}
	
	/**
	 * Listen on the given `event` with `fn`.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */
	
	Emitter.prototype.on =
	Emitter.prototype.addEventListener = function(event, fn){
	  this._callbacks = this._callbacks || {};
	  (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
	    .push(fn);
	  return this;
	};
	
	/**
	 * Adds an `event` listener that will be invoked a single
	 * time then automatically removed.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */
	
	Emitter.prototype.once = function(event, fn){
	  function on() {
	    this.off(event, on);
	    fn.apply(this, arguments);
	  }
	
	  on.fn = fn;
	  this.on(event, on);
	  return this;
	};
	
	/**
	 * Remove the given callback for `event` or all
	 * registered callbacks.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */
	
	Emitter.prototype.off =
	Emitter.prototype.removeListener =
	Emitter.prototype.removeAllListeners =
	Emitter.prototype.removeEventListener = function(event, fn){
	  this._callbacks = this._callbacks || {};
	
	  // all
	  if (0 == arguments.length) {
	    this._callbacks = {};
	    return this;
	  }
	
	  // specific event
	  var callbacks = this._callbacks['$' + event];
	  if (!callbacks) return this;
	
	  // remove all handlers
	  if (1 == arguments.length) {
	    delete this._callbacks['$' + event];
	    return this;
	  }
	
	  // remove specific handler
	  var cb;
	  for (var i = 0; i < callbacks.length; i++) {
	    cb = callbacks[i];
	    if (cb === fn || cb.fn === fn) {
	      callbacks.splice(i, 1);
	      break;
	    }
	  }
	  return this;
	};
	
	/**
	 * Emit `event` with the given args.
	 *
	 * @param {String} event
	 * @param {Mixed} ...
	 * @return {Emitter}
	 */
	
	Emitter.prototype.emit = function(event){
	  this._callbacks = this._callbacks || {};
	  var args = [].slice.call(arguments, 1)
	    , callbacks = this._callbacks['$' + event];
	
	  if (callbacks) {
	    callbacks = callbacks.slice(0);
	    for (var i = 0, len = callbacks.length; i < len; ++i) {
	      callbacks[i].apply(this, args);
	    }
	  }
	
	  return this;
	};
	
	/**
	 * Return array of callbacks for `event`.
	 *
	 * @param {String} event
	 * @return {Array}
	 * @api public
	 */
	
	Emitter.prototype.listeners = function(event){
	  this._callbacks = this._callbacks || {};
	  return this._callbacks['$' + event] || [];
	};
	
	/**
	 * Check if this emitter has `event` handlers.
	 *
	 * @param {String} event
	 * @return {Boolean}
	 * @api public
	 */
	
	Emitter.prototype.hasListeners = function(event){
	  return !! this.listeners(event).length;
	};


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Module dependencies.
	 */
	
	var type;
	try {
	  type = __webpack_require__(17);
	} catch (_) {
	  type = __webpack_require__(17);
	}
	
	/**
	 * Module exports.
	 */
	
	module.exports = clone;
	
	/**
	 * Clones objects.
	 *
	 * @param {Mixed} any object
	 * @api public
	 */
	
	function clone(obj){
	  switch (type(obj)) {
	    case 'object':
	      var copy = {};
	      for (var key in obj) {
	        if (obj.hasOwnProperty(key)) {
	          copy[key] = clone(obj[key]);
	        }
	      }
	      return copy;
	
	    case 'array':
	      var copy = new Array(obj.length);
	      for (var i = 0, l = obj.length; i < l; i++) {
	        copy[i] = clone(obj[i]);
	      }
	      return copy;
	
	    case 'regexp':
	      // from millermedeiros/amd-utils - MIT
	      var flags = '';
	      flags += obj.multiline ? 'm' : '';
	      flags += obj.global ? 'g' : '';
	      flags += obj.ignoreCase ? 'i' : '';
	      return new RegExp(obj.source, flags);
	
	    case 'date':
	      return new Date(obj.getTime());
	
	    default: // string, number, boolean, …
	      return obj;
	  }
	}


/***/ },
/* 17 */
/***/ function(module, exports) {

	/**
	 * toString ref.
	 */
	
	var toString = Object.prototype.toString;
	
	/**
	 * Return the type of `val`.
	 *
	 * @param {Mixed} val
	 * @return {String}
	 * @api public
	 */
	
	module.exports = function(val){
	  switch (toString.call(val)) {
	    case '[object Date]': return 'date';
	    case '[object RegExp]': return 'regexp';
	    case '[object Arguments]': return 'arguments';
	    case '[object Array]': return 'array';
	    case '[object Error]': return 'error';
	  }
	
	  if (val === null) return 'null';
	  if (val === undefined) return 'undefined';
	  if (val !== val) return 'nan';
	  if (val && val.nodeType === 1) return 'element';
	
	  val = val.valueOf
	    ? val.valueOf()
	    : Object.prototype.valueOf.apply(val)
	
	  return typeof val;
	};


/***/ },
/* 18 */
/***/ function(module, exports) {

	
	// easing functions from "Tween.js"
	
	exports.linear = function(n){
	  return n;
	};
	
	exports.inQuad = function(n){
	  return n * n;
	};
	
	exports.outQuad = function(n){
	  return n * (2 - n);
	};
	
	exports.inOutQuad = function(n){
	  n *= 2;
	  if (n < 1) return 0.5 * n * n;
	  return - 0.5 * (--n * (n - 2) - 1);
	};
	
	exports.inCube = function(n){
	  return n * n * n;
	};
	
	exports.outCube = function(n){
	  return --n * n * n + 1;
	};
	
	exports.inOutCube = function(n){
	  n *= 2;
	  if (n < 1) return 0.5 * n * n * n;
	  return 0.5 * ((n -= 2 ) * n * n + 2);
	};
	
	exports.inQuart = function(n){
	  return n * n * n * n;
	};
	
	exports.outQuart = function(n){
	  return 1 - (--n * n * n * n);
	};
	
	exports.inOutQuart = function(n){
	  n *= 2;
	  if (n < 1) return 0.5 * n * n * n * n;
	  return -0.5 * ((n -= 2) * n * n * n - 2);
	};
	
	exports.inQuint = function(n){
	  return n * n * n * n * n;
	}
	
	exports.outQuint = function(n){
	  return --n * n * n * n * n + 1;
	}
	
	exports.inOutQuint = function(n){
	  n *= 2;
	  if (n < 1) return 0.5 * n * n * n * n * n;
	  return 0.5 * ((n -= 2) * n * n * n * n + 2);
	};
	
	exports.inSine = function(n){
	  return 1 - Math.cos(n * Math.PI / 2 );
	};
	
	exports.outSine = function(n){
	  return Math.sin(n * Math.PI / 2);
	};
	
	exports.inOutSine = function(n){
	  return .5 * (1 - Math.cos(Math.PI * n));
	};
	
	exports.inExpo = function(n){
	  return 0 == n ? 0 : Math.pow(1024, n - 1);
	};
	
	exports.outExpo = function(n){
	  return 1 == n ? n : 1 - Math.pow(2, -10 * n);
	};
	
	exports.inOutExpo = function(n){
	  if (0 == n) return 0;
	  if (1 == n) return 1;
	  if ((n *= 2) < 1) return .5 * Math.pow(1024, n - 1);
	  return .5 * (-Math.pow(2, -10 * (n - 1)) + 2);
	};
	
	exports.inCirc = function(n){
	  return 1 - Math.sqrt(1 - n * n);
	};
	
	exports.outCirc = function(n){
	  return Math.sqrt(1 - (--n * n));
	};
	
	exports.inOutCirc = function(n){
	  n *= 2
	  if (n < 1) return -0.5 * (Math.sqrt(1 - n * n) - 1);
	  return 0.5 * (Math.sqrt(1 - (n -= 2) * n) + 1);
	};
	
	exports.inBack = function(n){
	  var s = 1.70158;
	  return n * n * (( s + 1 ) * n - s);
	};
	
	exports.outBack = function(n){
	  var s = 1.70158;
	  return --n * n * ((s + 1) * n + s) + 1;
	};
	
	exports.inOutBack = function(n){
	  var s = 1.70158 * 1.525;
	  if ( ( n *= 2 ) < 1 ) return 0.5 * ( n * n * ( ( s + 1 ) * n - s ) );
	  return 0.5 * ( ( n -= 2 ) * n * ( ( s + 1 ) * n + s ) + 2 );
	};
	
	exports.inBounce = function(n){
	  return 1 - exports.outBounce(1 - n);
	};
	
	exports.outBounce = function(n){
	  if ( n < ( 1 / 2.75 ) ) {
	    return 7.5625 * n * n;
	  } else if ( n < ( 2 / 2.75 ) ) {
	    return 7.5625 * ( n -= ( 1.5 / 2.75 ) ) * n + 0.75;
	  } else if ( n < ( 2.5 / 2.75 ) ) {
	    return 7.5625 * ( n -= ( 2.25 / 2.75 ) ) * n + 0.9375;
	  } else {
	    return 7.5625 * ( n -= ( 2.625 / 2.75 ) ) * n + 0.984375;
	  }
	};
	
	exports.inOutBounce = function(n){
	  if (n < .5) return exports.inBounce(n * 2) * .5;
	  return exports.outBounce(n * 2 - 1) * .5 + .5;
	};
	
	// aliases
	
	exports['in-quad'] = exports.inQuad;
	exports['out-quad'] = exports.outQuad;
	exports['in-out-quad'] = exports.inOutQuad;
	exports['in-cube'] = exports.inCube;
	exports['out-cube'] = exports.outCube;
	exports['in-out-cube'] = exports.inOutCube;
	exports['in-quart'] = exports.inQuart;
	exports['out-quart'] = exports.outQuart;
	exports['in-out-quart'] = exports.inOutQuart;
	exports['in-quint'] = exports.inQuint;
	exports['out-quint'] = exports.outQuint;
	exports['in-out-quint'] = exports.inOutQuint;
	exports['in-sine'] = exports.inSine;
	exports['out-sine'] = exports.outSine;
	exports['in-out-sine'] = exports.inOutSine;
	exports['in-expo'] = exports.inExpo;
	exports['out-expo'] = exports.outExpo;
	exports['in-out-expo'] = exports.inOutExpo;
	exports['in-circ'] = exports.inCirc;
	exports['out-circ'] = exports.outCirc;
	exports['in-out-circ'] = exports.inOutCirc;
	exports['in-back'] = exports.inBack;
	exports['out-back'] = exports.outBack;
	exports['in-out-back'] = exports.inOutBack;
	exports['in-bounce'] = exports.inBounce;
	exports['out-bounce'] = exports.outBounce;
	exports['in-out-bounce'] = exports.inOutBounce;


/***/ },
/* 19 */
/***/ function(module, exports) {

	module.exports = "<li>\n<div class=\"m\">{month}</div>\n<div class=\"d\">{date}</div>\n<div class=\"w\">{week}</div>\n</li>\n";

/***/ },
/* 20 */
/***/ function(module, exports) {

	
	/**
	 * Expose `parse`.
	 */
	
	module.exports = parse;
	
	/**
	 * Tests for browser support.
	 */
	
	var innerHTMLBug = false;
	var bugTestDiv;
	if (typeof document !== 'undefined') {
	  bugTestDiv = document.createElement('div');
	  // Setup
	  bugTestDiv.innerHTML = '  <link/><table></table><a href="/a">a</a><input type="checkbox"/>';
	  // Make sure that link elements get serialized correctly by innerHTML
	  // This requires a wrapper element in IE
	  innerHTMLBug = !bugTestDiv.getElementsByTagName('link').length;
	  bugTestDiv = undefined;
	}
	
	/**
	 * Wrap map from jquery.
	 */
	
	var map = {
	  legend: [1, '<fieldset>', '</fieldset>'],
	  tr: [2, '<table><tbody>', '</tbody></table>'],
	  col: [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],
	  // for script/link/style tags to work in IE6-8, you have to wrap
	  // in a div with a non-whitespace character in front, ha!
	  _default: innerHTMLBug ? [1, 'X<div>', '</div>'] : [0, '', '']
	};
	
	map.td =
	map.th = [3, '<table><tbody><tr>', '</tr></tbody></table>'];
	
	map.option =
	map.optgroup = [1, '<select multiple="multiple">', '</select>'];
	
	map.thead =
	map.tbody =
	map.colgroup =
	map.caption =
	map.tfoot = [1, '<table>', '</table>'];
	
	map.polyline =
	map.ellipse =
	map.polygon =
	map.circle =
	map.text =
	map.line =
	map.path =
	map.rect =
	map.g = [1, '<svg xmlns="http://www.w3.org/2000/svg" version="1.1">','</svg>'];
	
	/**
	 * Parse `html` and return a DOM Node instance, which could be a TextNode,
	 * HTML DOM Node of some kind (<div> for example), or a DocumentFragment
	 * instance, depending on the contents of the `html` string.
	 *
	 * @param {String} html - HTML string to "domify"
	 * @param {Document} doc - The `document` instance to create the Node for
	 * @return {DOMNode} the TextNode, DOM Node, or DocumentFragment instance
	 * @api private
	 */
	
	function parse(html, doc) {
	  if ('string' != typeof html) throw new TypeError('String expected');
	
	  // default to the global `document` object
	  if (!doc) doc = document;
	
	  // tag name
	  var m = /<([\w:]+)/.exec(html);
	  if (!m) return doc.createTextNode(html);
	
	  html = html.replace(/^\s+|\s+$/g, ''); // Remove leading/trailing whitespace
	
	  var tag = m[1];
	
	  // body support
	  if (tag == 'body') {
	    var el = doc.createElement('html');
	    el.innerHTML = html;
	    return el.removeChild(el.lastChild);
	  }
	
	  // wrap map
	  var wrap = map[tag] || map._default;
	  var depth = wrap[0];
	  var prefix = wrap[1];
	  var suffix = wrap[2];
	  var el = doc.createElement('div');
	  el.innerHTML = prefix + html + suffix;
	  while (depth--) el = el.lastChild;
	
	  // one element
	  if (el.firstChild == el.lastChild) {
	    return el.removeChild(el.firstChild);
	  }
	
	  // several elements
	  var fragment = doc.createDocumentFragment();
	  while (el.firstChild) {
	    fragment.appendChild(el.removeChild(el.firstChild));
	  }
	
	  return fragment;
	}


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	exports.transition = __webpack_require__(22)
	
	exports.transform = __webpack_require__(23)
	
	exports.touchAction = __webpack_require__(24)
	
	exports.transitionend = __webpack_require__(25)
	
	exports.has3d = __webpack_require__(26)


/***/ },
/* 22 */
/***/ function(module, exports) {

	var styles = [
	  'transition',
	  'webkitTransition',
	  'MozTransition',
	  'OTransition',
	  'msTransition'
	]
	
	var el = document.createElement('p')
	var style
	
	for (var i = 0; i < styles.length; i++) {
	  if (null != el.style[styles[i]]) {
	    style = styles[i]
	    break
	  }
	}
	el = null
	
	module.exports = style


/***/ },
/* 23 */
/***/ function(module, exports) {

	
	var styles = [
	  'webkitTransform',
	  'MozTransform',
	  'msTransform',
	  'OTransform',
	  'transform'
	];
	
	var el = document.createElement('p');
	var style;
	
	for (var i = 0; i < styles.length; i++) {
	  style = styles[i];
	  if (null != el.style[style]) {
	    module.exports = style;
	    break;
	  }
	}


/***/ },
/* 24 */
/***/ function(module, exports) {

	
	/**
	 * Module exports.
	 */
	
	module.exports = touchActionProperty();
	
	/**
	 * Returns "touchAction", "msTouchAction", or null.
	 */
	
	function touchActionProperty(doc) {
	  if (!doc) doc = document;
	  var div = doc.createElement('div');
	  var prop = null;
	  if ('touchAction' in div.style) prop = 'touchAction';
	  else if ('msTouchAction' in div.style) prop = 'msTouchAction';
	  div = null;
	  return prop;
	}


/***/ },
/* 25 */
/***/ function(module, exports) {

	/**
	 * Transition-end mapping
	 */
	
	var map = {
	  'WebkitTransition' : 'webkitTransitionEnd',
	  'MozTransition' : 'transitionend',
	  'OTransition' : 'oTransitionEnd',
	  'msTransition' : 'MSTransitionEnd',
	  'transition' : 'transitionend'
	};
	
	/**
	 * Expose `transitionend`
	 */
	
	var el = document.createElement('p');
	
	for (var transition in map) {
	  if (null != el.style[transition]) {
	    module.exports = map[transition];
	    break;
	  }
	}


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	
	var prop = __webpack_require__(23);
	
	// IE <=8 doesn't have `getComputedStyle`
	if (!prop || !window.getComputedStyle) {
	  module.exports = false;
	
	} else {
	  var map = {
	    webkitTransform: '-webkit-transform',
	    OTransform: '-o-transform',
	    msTransform: '-ms-transform',
	    MozTransform: '-moz-transform',
	    transform: 'transform'
	  };
	
	  // from: https://gist.github.com/lorenzopolidori/3794226
	  var el = document.createElement('div');
	  el.style[prop] = 'translate3d(1px,1px,1px)';
	  document.body.insertBefore(el, null);
	  var val = getComputedStyle(el).getPropertyValue(map[prop]);
	  document.body.removeChild(el);
	  module.exports = null != val && val.length && 'none' != val;
	}


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * Module dependencies.
	 */
	
	var events = __webpack_require__(28);
	var delegate = __webpack_require__(29);
	
	/**
	 * Expose `Events`.
	 */
	
	module.exports = Events;
	
	/**
	 * Initialize an `Events` with the given
	 * `el` object which events will be bound to,
	 * and the `obj` which will receive method calls.
	 *
	 * @param {Object} el
	 * @param {Object} obj
	 * @api public
	 */
	
	function Events(el, obj) {
	  if (!(this instanceof Events)) return new Events(el, obj);
	  if (!el) throw new Error('element required');
	  if (!obj) throw new Error('object required');
	  this.el = el;
	  this.obj = obj;
	  this._events = {};
	}
	
	/**
	 * Subscription helper.
	 */
	
	Events.prototype.sub = function(event, method, cb){
	  this._events[event] = this._events[event] || {};
	  this._events[event][method] = cb;
	};
	
	/**
	 * Bind to `event` with optional `method` name.
	 * When `method` is undefined it becomes `event`
	 * with the "on" prefix.
	 *
	 * Examples:
	 *
	 *  Direct event handling:
	 *
	 *    events.bind('click') // implies "onclick"
	 *    events.bind('click', 'remove')
	 *    events.bind('click', 'sort', 'asc')
	 *
	 *  Delegated event handling:
	 *
	 *    events.bind('click li > a')
	 *    events.bind('click li > a', 'remove')
	 *    events.bind('click a.sort-ascending', 'sort', 'asc')
	 *    events.bind('click a.sort-descending', 'sort', 'desc')
	 *
	 * @param {String} event
	 * @param {String|function} [method]
	 * @return {Function} callback
	 * @api public
	 */
	
	Events.prototype.bind = function(event, method){
	  var e = parse(event);
	  var el = this.el;
	  var obj = this.obj;
	  var name = e.name;
	  var method = method || 'on' + name;
	  var args = [].slice.call(arguments, 2);
	
	  // callback
	  function cb(){
	    var a = [].slice.call(arguments).concat(args);
	    obj[method].apply(obj, a);
	  }
	
	  // bind
	  if (e.selector) {
	    cb = delegate.bind(el, e.selector, name, cb);
	  } else {
	    events.bind(el, name, cb);
	  }
	
	  // subscription for unbinding
	  this.sub(name, method, cb);
	
	  return cb;
	};
	
	/**
	 * Unbind a single binding, all bindings for `event`,
	 * or all bindings within the manager.
	 *
	 * Examples:
	 *
	 *  Unbind direct handlers:
	 *
	 *     events.unbind('click', 'remove')
	 *     events.unbind('click')
	 *     events.unbind()
	 *
	 * Unbind delegate handlers:
	 *
	 *     events.unbind('click', 'remove')
	 *     events.unbind('click')
	 *     events.unbind()
	 *
	 * @param {String|Function} [event]
	 * @param {String|Function} [method]
	 * @api public
	 */
	
	Events.prototype.unbind = function(event, method){
	  if (0 == arguments.length) return this.unbindAll();
	  if (1 == arguments.length) return this.unbindAllOf(event);
	
	  // no bindings for this event
	  var bindings = this._events[event];
	  if (!bindings) return;
	
	  // no bindings for this method
	  var cb = bindings[method];
	  if (!cb) return;
	
	  events.unbind(this.el, event, cb);
	};
	
	/**
	 * Unbind all events.
	 *
	 * @api private
	 */
	
	Events.prototype.unbindAll = function(){
	  for (var event in this._events) {
	    this.unbindAllOf(event);
	  }
	};
	
	/**
	 * Unbind all events for `event`.
	 *
	 * @param {String} event
	 * @api private
	 */
	
	Events.prototype.unbindAllOf = function(event){
	  var bindings = this._events[event];
	  if (!bindings) return;
	
	  for (var method in bindings) {
	    this.unbind(event, method);
	  }
	};
	
	/**
	 * Parse `event`.
	 *
	 * @param {String} event
	 * @return {Object}
	 * @api private
	 */
	
	function parse(event) {
	  var parts = event.split(/ +/);
	  return {
	    name: parts.shift(),
	    selector: parts.join(' ')
	  }
	}


/***/ },
/* 28 */
/***/ function(module, exports) {

	var bind = window.addEventListener ? 'addEventListener' : 'attachEvent',
	    unbind = window.removeEventListener ? 'removeEventListener' : 'detachEvent',
	    prefix = bind !== 'addEventListener' ? 'on' : '';
	
	/**
	 * Bind `el` event `type` to `fn`.
	 *
	 * @param {Element} el
	 * @param {String} type
	 * @param {Function} fn
	 * @param {Boolean} capture
	 * @return {Function}
	 * @api public
	 */
	
	exports.bind = function(el, type, fn, capture){
	  el[bind](prefix + type, fn, capture || false);
	  return fn;
	};
	
	/**
	 * Unbind `el` event `type`'s callback `fn`.
	 *
	 * @param {Element} el
	 * @param {String} type
	 * @param {Function} fn
	 * @param {Boolean} capture
	 * @return {Function}
	 * @api public
	 */
	
	exports.unbind = function(el, type, fn, capture){
	  el[unbind](prefix + type, fn, capture || false);
	  return fn;
	};

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Module dependencies.
	 */
	
	var closest = __webpack_require__(30)
	  , event = __webpack_require__(28);
	
	/**
	 * Delegate event `type` to `selector`
	 * and invoke `fn(e)`. A callback function
	 * is returned which may be passed to `.unbind()`.
	 *
	 * @param {Element} el
	 * @param {String} selector
	 * @param {String} type
	 * @param {Function} fn
	 * @param {Boolean} capture
	 * @return {Function}
	 * @api public
	 */
	
	exports.bind = function(el, selector, type, fn, capture){
	  return event.bind(el, type, function(e){
	    var target = e.target || e.srcElement;
	    e.delegateTarget = closest(target, selector, true, el);
	    if (e.delegateTarget) fn.call(el, e);
	  }, capture);
	};
	
	/**
	 * Unbind event `type`'s callback `fn`.
	 *
	 * @param {Element} el
	 * @param {String} type
	 * @param {Function} fn
	 * @param {Boolean} capture
	 * @api public
	 */
	
	exports.unbind = function(el, type, fn, capture){
	  event.unbind(el, type, fn, capture);
	};


/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Module Dependencies
	 */
	
	var matches = __webpack_require__(31)
	
	/**
	 * Export `closest`
	 */
	
	module.exports = closest
	
	/**
	 * Closest
	 *
	 * @param {Element} el
	 * @param {String} selector
	 * @param {Element} scope (optional)
	 */
	
	function closest (el, selector, scope) {
	  scope = scope || document.documentElement;
	
	  // walk up the dom
	  while (el && el !== scope) {
	    if (matches(el, selector)) return el;
	    el = el.parentNode;
	  }
	
	  // check scope for match
	  return matches(el, selector) ? el : null;
	}


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Module dependencies.
	 */
	
	var query = __webpack_require__(32);
	
	/**
	 * Element prototype.
	 */
	
	var proto = Element.prototype;
	
	/**
	 * Vendor function.
	 */
	
	var vendor = proto.matches
	  || proto.webkitMatchesSelector
	  || proto.mozMatchesSelector
	  || proto.msMatchesSelector
	  || proto.oMatchesSelector;
	
	/**
	 * Expose `match()`.
	 */
	
	module.exports = match;
	
	/**
	 * Match `el` to `selector`.
	 *
	 * @param {Element} el
	 * @param {String} selector
	 * @return {Boolean}
	 * @api public
	 */
	
	function match(el, selector) {
	  if (!el || el.nodeType !== 1) return false;
	  if (vendor) return vendor.call(el, selector);
	  var nodes = query.all(selector, el.parentNode);
	  for (var i = 0; i < nodes.length; ++i) {
	    if (nodes[i] == el) return true;
	  }
	  return false;
	}


/***/ },
/* 32 */
/***/ function(module, exports) {

	function one(selector, el) {
	  return el.querySelector(selector);
	}
	
	exports = module.exports = function(selector, el){
	  el = el || document;
	  return one(selector, el);
	};
	
	exports.all = function(selector, el){
	  el = el || document;
	  return el.querySelectorAll(selector);
	};
	
	exports.engine = function(obj){
	  if (!obj.one) throw new Error('.one callback required');
	  if (!obj.all) throw new Error('.all callback required');
	  one = obj.one;
	  exports.all = obj.all;
	  return exports;
	};


/***/ },
/* 33 */
/***/ function(module, exports) {

	var endEvents = [
	  'touchend'
	]
	
	module.exports = Tap
	
	// default tap timeout in ms
	Tap.timeout = 200
	
	function Tap(callback, options) {
	  options = options || {}
	  // if the user holds his/her finger down for more than 200ms,
	  // then it's not really considered a tap.
	  // however, you can make this configurable.
	  var timeout = options.timeout || Tap.timeout
	
	  // to keep track of the original listener
	  listener.handler = callback
	
	  return listener
	
	  // el.addEventListener('touchstart', listener)
	  function listener(e1) {
	    // tap should only happen with a single finger
	    if (!e1.touches || e1.touches.length > 1) return
	
	    var el = e1.target
	    var context = this
	    var args = arguments;
	
	    var timeout_id = setTimeout(cleanup, timeout)
	
	    el.addEventListener('touchmove', cleanup)
	
	    endEvents.forEach(function (event) {
	      el.addEventListener(event, done)
	    })
	
	    function done(e2) {
	      // since touchstart is added on the same tick
	      // and because of bubbling,
	      // it'll execute this on the same touchstart.
	      // this filters out the same touchstart event.
	      if (e1 === e2) return
	      if (e2.clientX !== e1.clientX || e2.clientY !== e1.clientY) return
	
	      cleanup()
	
	      // already handled
	      if (e2.defaultPrevented) return
	
	      // overwrite these functions so that they all to both start and events.
	      var preventDefault = e1.preventDefault
	      var stopPropagation = e1.stopPropagation
	
	      e1.stopPropagation = function () {
	        stopPropagation.call(e1)
	        stopPropagation.call(e2)
	      }
	
	      e1.preventDefault = function () {
	        preventDefault.call(e1)
	        preventDefault.call(e2)
	      }
	
	      // calls the handler with the `end` event,
	      // but i don't think it matters.
	      callback.apply(context, args)
	    }
	
	    // cleanup end events
	    // to cancel the tap, just run this early
	    function cleanup(e2) {
	      // if it's the same event as the origin,
	      // then don't actually cleanup.
	      // hit issues with this - don't remember
	      if (e1 === e2) return
	
	      clearTimeout(timeout_id)
	
	      el.removeEventListener('touchmove', cleanup)
	
	      endEvents.forEach(function (event) {
	        el.removeEventListener(event, done)
	      })
	    }
	  }
	}


/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	var Iscroll = __webpack_require__(35)
	var Loader = __webpack_require__(39)
	
	function Ptr(scrollable, cb) {
	  var is = new Iscroll(scrollable, {
	    handlebar: true
	  })
	  var loader = new Loader(scrollable.querySelector('.ptr'))
	  loader.setColor('#1ea3e7')
	  var stat
	  is.on('scroll', function (y) {
	    if (stat == null) {
	      var el = scrollable.querySelector('.projects > li:first-child .content')
	      var color = getComputedStyle(el)['background-color']
	      loader.setColor(color)
	      loader.draw(y)
	    }
	    loader.y = y
	  })
	  var duration = 400
	  is.on('release', function () {
	    if (stat != null) return
	    var y = scrollable.scrollTop
	    if (y < -40) {
	      stat = 'loading'
	      loader.load(duration)
	      is.scrollTo(40, duration)
	      var promise = cb()
	      var end = function (err) {
	        stat = err ? 'success': 'error'
	        is.scrollTo(40, 200)
	        if (err) {
	          // not implemented
	          loader.error(err)
	        } else {
	          loader.check()
	        }
	        setTimeout(function () {
	          is.scrollTo(0, 300)
	          stat = null
	        }, 500)
	      }
	      promise.then(end, end)
	    }
	  })
	}
	
	module.exports = Ptr


/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	var detect = __webpack_require__(21)
	var touchAction = detect.touchAction
	var transform = detect.transform
	var has3d = detect.has3d
	var computedStyle = __webpack_require__(36)
	var Emitter = __webpack_require__(15)
	var events = __webpack_require__(27)
	var Tween = __webpack_require__(14)
	var raf = __webpack_require__(12)
	var throttle = __webpack_require__(37)
	var Handlebar = __webpack_require__(38)
	var max = Math.max
	var min = Math.min
	var now = Date.now
	
	var defineProperty = Object.defineProperty
	
	/**
	 * Create custom event
	 *
	 * @param {String} name
	 * @return {Event}
	 * @api private
	 */
	function customEvent(name) {
	  var e
	  try {
	    e = new CustomEvent(name)
	  } catch(error) {
	    try {
	      e = document.createEvent('CustomEvent')
	      e.initCustomEvent(name, false, false, 0)
	    } catch(err) {
	      return
	    }
	  }
	  return e
	}
	
	/**
	 * Init iscroll with el and optional options
	 * options.handlebar show handlebar if is true
	 *
	 * @param  {Element}  el
	 * @param {Object} opts
	 * @api public
	 */
	function Iscroll(el, opts) {
	  if (! (this instanceof Iscroll)) return new Iscroll(el, opts)
	  this.y = 0
	  this.scrollable = el
	  el.style.overflow = 'hidden'
	  var children = el.children
	  if (children.length !== 1) {
	    throw new Error('iscroll need single element child of scrollable to work')
	  }
	  this.el = children[0]
	  this.touchAction('none')
	  this.refresh()
	  this.bind()
	  var self = this
	  if (defineProperty) {
	    defineProperty(this.scrollable, 'scrollTop', {
	      set: function (v) {
	        return self.scrollTo(-v, 200)
	      },
	      get: function () {
	        return - self.y
	      }
	    })
	  }
	  this.on('scroll', function () {
	    var e = customEvent('scroll')
	    if (e) el.dispatchEvent(e)
	  })
	  opts = opts || {}
	  this.max = opts.max || 80
	  if (opts.handlebar) {
	    this.handlebar = new Handlebar(el)
	  }
	  this._refresh = this.refresh.bind(this)
	  window.addEventListener('orientationchange', this._refresh, false)
	  window.addEventListener('resize', this._refresh, false)
	}
	
	Emitter(Iscroll.prototype)
	
	/**
	 * Bind events
	 *
	 * @api private
	 */
	Iscroll.prototype.bind = function () {
	  this.events = events(this.el, this)
	  this.docEvents = events(document, this)
	
	   // W3C touch events
	  this.events.bind('touchstart')
	  this.events.bind('touchmove')
	  this.docEvents.bind('touchend')
	  this.docEvents.bind('touchcancel', 'ontouchend')
	}
	
	/**
	 * Recalculate the height
	 *
	 * @api public
	 */
	Iscroll.prototype.refresh = function () {
	  this.viewHeight = this.scrollable.getBoundingClientRect().height
	  this.height = this.el.getBoundingClientRect().height
	}
	
	/**
	 * Unbind all event listeners, and remove handlebar if necessary
	 *
	 * @api public
	 */
	Iscroll.prototype.unbind = function () {
	  this.off()
	  this.events.unbind()
	  this.docEvents.unbind()
	  window.removeEventListener('orientationchange', this._refresh, false)
	  window.removeEventListener('resize', this._refresh, false)
	  if (this.handlebar) this.scrollable.removeChild(this.handlebar.el)
	}
	
	Iscroll.prototype.restrict = function (y) {
	  y = min(y , this.max)
	  var h = Math.max(this.height, this.viewHeight)
	  y = max(y , this.viewHeight - h - this.max)
	  return y
	}
	
	/**
	 * touchstart event handler
	 *
	 * @param  {Event}  e
	 * @api private
	 */
	Iscroll.prototype.ontouchstart = function (e) {
	  this.speed = null
	  this.leftright = null
	  if (this.tween) this.tween.stop()
	  this.refresh()
	  this.dy = 0
	  this.ts = now()
	  if (this.handlebar) this.resizeHandlebar()
	
	  var touch = this.getTouch(e)
	  this.clientY = touch.clientY
	  this.down = {
	    x: touch.clientX,
	    y: touch.clientY,
	    start: this.y,
	    at: now()
	  }
	}
	
	/**
	 * touchmove event handler
	 *
	 * @param  {Event}  e
	 * @api private
	 */
	Iscroll.prototype.ontouchmove = function (e) {
	  e.preventDefault()
	  // do nothing if left right move
	  if (e.touches.length > 1 || !this.down || this.leftright) return
	  var touch = this.getTouch(e)
	  var down = this.down
	  var dy = this.dy = touch.clientY - down.y
	  var dx = touch.clientX - down.x
	  // can not determine
	  if (dx === 0 && dy === 0) return
	  // determine dy and the slope
	  if (null == this.leftright) {
	    // no move if contentHeight < viewHeight and move up
	    if (this.height <= this.viewHeight && dy < 0) return
	    var slope = dx / dy
	    // if is greater than 1 or -1, we're swiping up/down
	    if (slope > 1 || slope < -1) {
	      this.leftright = true
	      if (this.handlebar) this.hideHandlebar()
	      return
	    } else {
	      this.leftright = false
	    }
	  }
	
	  //calculate speed every 100 milisecond
	  this.calcuteSpeed(touch.clientY)
	  var start = this.down.start
	  var dest = this.restrict(start + dy)
	  this.translate(dest)
	}
	
	/**
	 * Calcute speed by clientY
	 *
	 * @param {Number} y
	 * @api priavte
	 */
	Iscroll.prototype.calcuteSpeed = function (y) {
	  var ts = now()
	  var dt = ts - this.ts
	  if (ts - this.down.at < 100) {
	    this.distance = y - this.clientY
	    this.speed = Math.abs(this.distance/dt)
	  } else if(dt > 100){
	    this.distance = y - this.clientY
	    this.speed = Math.abs(this.distance/dt)
	    this.ts = ts
	    this.clientY = y
	  }
	}
	
	/**
	 * Event handler for touchend
	 *
	 * @param  {Event}  e
	 * @api private
	 */
	Iscroll.prototype.ontouchend = function (e) {
	  if (!this.down || this.leftright) return
	  if (this.height <= this.viewHeight && this.dy <= 0) {
	    if(this.handlebar) this.handlebar.hide()
	    return
	  }
	  var touch = this.getTouch(e)
	  this.calcuteSpeed(touch.clientY)
	  var m = this.momentum()
	  this.scrollTo(m.dest, m.duration, m.ease)
	  this.emit('release', this.y)
	  this.down = null
	}
	
	/**
	 * Calculate the animate props for moveon
	 *
	 * @return {Object}
	 * @api private
	 */
	Iscroll.prototype.momentum = function () {
	  var deceleration = 0.0004
	  var speed = this.speed
	  speed = min(speed, 0.8)
	  var destination = this.y + ( speed * speed ) / ( 2 * deceleration ) * ( this.distance < 0 ? -1 : 1 )
	  var duration = speed / deceleration
	  var newY, ease
	  if (destination > 0) {
	    newY = 0
	    ease = 'out-back'
	  } else if (destination < this.viewHeight - this.height) {
	    newY = this.viewHeight - this.height
	    ease = 'out-back'
	  }
	  if (typeof newY === 'number') {
	    duration = duration*(newY - this.y + 160)/(destination - this.y)
	    destination = newY
	  }
	  if (this.y > 0 || this.y < this.viewHeight - this.height) {
	    duration = 500
	    ease = 'out-circ'
	  }
	  return {
	    dest: destination,
	    duration: duration,
	    ease: ease
	  }
	}
	
	
	/**
	 * Scroll to potions y with optional duration and ease function
	 *
	 * @param {Number} y
	 * @param {Number} duration
	 * @param {String} easing
	 * @api public
	 */
	Iscroll.prototype.scrollTo = function (y, duration, easing) {
	  if (this.tween) this.tween.stop()
	  var intransition = (duration > 0 && y !== this.y)
	  if (!intransition) {
	    this.onScrollEnd()
	    return this.translate(y)
	  }
	
	  easing = easing || 'out-cube'
	  var tween = this.tween = Tween({y : this.y})
	      .ease(easing)
	      .to({y: y})
	      .duration(duration)
	
	  var self = this
	  tween.update(function(o) {
	    self.translate(o.y)
	  })
	
	  tween.on('end', function () {
	    animate = function(){} // eslint-disable-line
	    if (!tween.stopped) {
	      self.onScrollEnd()
	    }
	  })
	
	  function animate() {
	    raf(animate)
	    tween.update()
	  }
	
	  animate()
	}
	
	/**
	 * Scrollend
	 *
	 * @api private
	 */
	Iscroll.prototype.onScrollEnd = function () {
	  this.hideHandlebar()
	  var top = this.y === 0
	  var bottom = this.y === (this.viewHeight - this.height)
	  this.emit('scrollend', {
	    top: top,
	    bottom: bottom
	  })
	}
	
	/**
	 * Gets the appropriate "touch" object for the `e` event. The event may be from
	 * a "mouse", "touch", or "Pointer" event, so the normalization happens here.
	 *
	 * @api private
	 */
	
	Iscroll.prototype.getTouch = function(e){
	  // "mouse" and "Pointer" events just use the event object itself
	  var touch = e
	  if (e.changedTouches && e.changedTouches.length > 0) {
	    // W3C "touch" events use the `changedTouches` array
	    touch = e.changedTouches[0]
	  }
	  return touch
	}
	
	
	/**
	 * Translate to `x`.
	 *
	 *
	 * @api private
	 */
	
	Iscroll.prototype.translate = function(y) {
	  var s = this.el.style
	  if (isNaN(y)) return
	  y = Math.floor(y)
	  //reach the end
	  if (this.y !== y) {
	    this.y = y
	    this.emit('scroll', - y)
	    if (this.handlebar) this.transformHandlebar()
	  }
	  if (has3d) {
	    s[transform] = 'translate3d(0, ' + y + 'px' + ', 0)'
	  } else {
	    s[transform] = 'translateY(' + y + 'px)'
	  }
	}
	
	/**
	 * Sets the "touchAction" CSS style property to `value`.
	 *
	 * @api private
	 */
	
	Iscroll.prototype.touchAction = function(value){
	  var s = this.el.style
	  if (touchAction) {
	    s[touchAction] = value
	  }
	}
	
	/**
	 * Transform handlebar
	 *
	 * @api private
	 */
	Iscroll.prototype.transformHandlebar = throttle(function(){
	  var vh = this.viewHeight
	  var h = this.height
	  var bh = vh - vh * vh/h
	  var ih = h - vh
	  var y = parseInt(- bh * this.y/ih)
	  this.handlebar.translateY(y)
	}, 100)
	
	/**
	 * show the handlebar and size it
	 * @api public
	 */
	Iscroll.prototype.resizeHandlebar = function(){
	  var h = this.viewHeight * this.viewHeight/this.height
	  this.handlebar.resize(h)
	}
	
	/**
	 * Hide handlebar
	 *
	 * @api private
	 */
	Iscroll.prototype.hideHandlebar = function () {
	  if (this.handlebar) this.handlebar.hide()
	}
	
	module.exports = Iscroll


/***/ },
/* 36 */
/***/ function(module, exports) {

	// DEV: We don't use var but favor parameters since these play nicer with minification
	function computedStyle(el, prop, getComputedStyle, style) {
	  getComputedStyle = window.getComputedStyle;
	  style =
	      // If we have getComputedStyle
	      getComputedStyle ?
	        // Query it
	        // TODO: From CSS-Query notes, we might need (node, null) for FF
	        getComputedStyle(el) :
	
	      // Otherwise, we are in IE and use currentStyle
	        el.currentStyle;
	  if (style) {
	    return style
	    [
	      // Switch to camelCase for CSSOM
	      // DEV: Grabbed from jQuery
	      // https://github.com/jquery/jquery/blob/1.9-stable/src/css.js#L191-L194
	      // https://github.com/jquery/jquery/blob/1.9-stable/src/core.js#L593-L597
	      prop.replace(/-(\w)/gi, function (word, letter) {
	        return letter.toUpperCase();
	      })
	    ];
	  }
	}
	
	module.exports = computedStyle;


/***/ },
/* 37 */
/***/ function(module, exports) {

	module.exports = throttle;
	
	/**
	 * Returns a new function that, when invoked, invokes `func` at most once per `wait` milliseconds.
	 *
	 * @param {Function} func Function to wrap.
	 * @param {Number} wait Number of milliseconds that must elapse between `func` invocations.
	 * @return {Function} A new function that wraps the `func` function passed in.
	 */
	
	function throttle (func, wait) {
	  var ctx, args, rtn, timeoutID; // caching
	  var last = 0;
	
	  return function throttled () {
	    ctx = this;
	    args = arguments;
	    var delta = new Date() - last;
	    if (!timeoutID)
	      if (delta >= wait) call();
	      else timeoutID = setTimeout(call, wait - delta);
	    return rtn;
	  };
	
	  function call () {
	    timeoutID = 0;
	    last = +new Date();
	    rtn = func.apply(ctx, args);
	    ctx = null;
	    args = null;
	  }
	}


/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	var detect = __webpack_require__(21)
	var has3d = detect.has3d
	var transform = detect.transform
	
	/**
	 * Handlebar contructor
	 *
	 * @param {Element} scrollable
	 * @contructor
	 * @api public
	 */
	function handlebar(scrollable) {
	  var el = this.el = document.createElement('div')
	  el.className = 'iscroll-handlebar'
	  scrollable.appendChild(el)
	}
	
	/**
	 * Show the handlebar and resize it
	 *
	 * @param {Number} h
	 * @api public
	 */
	handlebar.prototype.resize = function (h) {
	  var s = this.el.style
	  s.height = h + 'px'
	  s.backgroundColor = 'rgba(0,0,0,0.3)'
	}
	
	/**
	 * Hide this handlebar
	 *
	 * @api public
	 */
	handlebar.prototype.hide = function () {
	  this.el.style.backgroundColor = 'transparent'
	}
	
	/**
	 * Move handlebar by translateY
	 *
	 * @param {Number} y
	 * @api public
	 */
	handlebar.prototype.translateY= function(y){
	  var s = this.el.style
	  if (has3d) {
	    s[transform] = 'translate3d(0, ' + y + 'px' + ', 0)'
	  } else {
	    s[transform] = 'translateY(' + y + 'px)'
	  }
	}
	
	module.exports = handlebar


/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	var autoscale = __webpack_require__(11)
	var PI = Math.PI
	var raf = __webpack_require__(12)
	
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


/***/ }
/******/ ]);
//# sourceMappingURL=commons.chunk.js.map