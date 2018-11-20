 /* eslint-disable */ 
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("net"));
	else if(typeof define === 'function' && define.amd)
		define("IpcProvider", ["net"], factory);
	else if(typeof exports === 'object')
		exports["IpcProvider"] = factory(require("net"));
	else
		root["IpcProvider"] = factory(root["net"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
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
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmory imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmory exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		Object.defineProperty(exports, name, {
/******/ 			configurable: false,
/******/ 			enumerable: true,
/******/ 			get: getter
/******/ 		});
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

/**
 * @original-authors:
 *   Marek Kotewicz <marek@ethdev.com>
 *   Marian Oancea <marian@ethdev.com>
 *   Fabian Vogelsteller <fabian@ethdev.com>
 * @date 2015
 */
var net = __webpack_require__(1);
/**
 * InvalidResponseError helper for invalid errors.
 */
function invalidResponseError(result, host) {
  var message = !!result && !!result.error && !!result.error.message ? '[ethjs-provider-ipc] ' + result.error.message : '[ethjs-provider-ipc] Invalid JSON RPC response from host provider ' + host + ': ' + JSON.stringify(result, null, 2);
  return new Error(message);
}

/**
 * IpcProvider should be used to send rpc calls over UNIX sockets.
 */
function IpcProvider(path) {
  if (!(this instanceof IpcProvider)) {
    throw new Error('[ethjs-provider-ipc] the IpcProvider instance requires the "new" flag in order to function normally (e.g. `const eth = new Eth(new IpcProvider());`).');
  }
  if (typeof path !== 'string') {
    throw new Error('[ethjs-provider-ipc] the IpcProvider instance requires that the path be specified (e.g. `/var/run/geth.ipc`)');
  }

  var self = this;
  self.path = path;
  self.responseCallbacks = {};
}

/**
 * Should be used to make async request
 *
 * @method sendAsync
 * @param {Object} payload
 * @param {Function} callback triggered on end with (err, result)
 */
IpcProvider.prototype.sendAsync = function (payload, callback) {
  // eslint-disable-line
  var self = this;

  try {
    if (!self.connection || !self.connection.writeable) {
      self.connection = net.connect(this.path);
    }
  } catch (error) {
    callback(new Error('[ethjs-provider-ipc] CONNECTION ERROR: Couldn\'t connect to path \'' + self.path + '\': ' + JSON.stringify(error, null, 2)), null);
  }

  self.connection.on('error', function (e) {
    console.error('IPC Connection Error', e); // eslint-disable-line
    callback(new Error('[ethjs-provider-ipc] CONNECTION TIMEOUT: request timeout. (i.e. your connect has timed out for whatever reason, check your provider).'), null);
  });

  self.connection.on('end', function (e) {
    console.error('IPC Connection Closed', e); // eslint-disable-line
    callback(new Error('[ethjs-provider-ipc] CONNECTION TIMEOUT: request timeout. (i.e. your connect has timed out for whatever reason, check your provider).'), null);
  });

  self.connection.on('data', function (data) {
    var result = null;
    try {
      result = JSON.parse(data);
      var _id = null;

      if (Array.isArray(result)) {
        result.forEach(function (load) {
          if (self.responseCallbacks[load.id]) {
            _id = load.id;
          }
        });
      } else {
        _id = result.id;
      }

      if (self.responseCallbacks[_id]) {
        self.responseCallbacks[_id](null, result);
        delete self.responseCallbacks[_id];
      }
    } catch (jsonError) {
      callback(invalidResponseError(data, self.path), null);
    }
  });

  var id = payload.id || payload[0].id;
  self.responseCallbacks[id] = callback;

  self.connection.write(JSON.stringify(payload));
};

module.exports = IpcProvider;

/***/ },
/* 1 */
/***/ function(module, exports) {

module.exports = require("net");

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(0);


/***/ }
/******/ ])
});
;
//# sourceMappingURL=ethjs-provider-ipc.js.map