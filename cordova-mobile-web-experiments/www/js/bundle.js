/******/ (function(modules) { // webpackBootstrap
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
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	__webpack_require__(2);
	var Horizon = __webpack_require__(3);
	var localforage = __webpack_require__(212);
	var maquette_1 = __webpack_require__(213);
	var app_1 = __webpack_require__(214);
	var router_1 = __webpack_require__(246);
	var data_service_1 = __webpack_require__(247);
	var route_registry_1 = __webpack_require__(248);
	var user_service_1 = __webpack_require__(266);
	// Bootstrapping code
	var horizon = Horizon({ host: 'nl1-lbs.afasgroep.nl:8181' });
	var store = localforage.createInstance({ storeName: 'mobile-web-experiments' });
	var horizonReady = false;
	var userServiceReady = false;
	var projector = maquette_1.createProjector({});
	var userService = user_service_1.createUserService(store, projector.scheduleRender);
	var dataService = data_service_1.createDataService(horizon, projector.scheduleRender);
	var startApp = function () {
	    userService.initializeHorizon(horizon);
	    var router = router_1.createRouter(window, projector, route_registry_1.createRouteRegistry(dataService, projector, userService));
	    var app = app_1.createApp(dataService, store, router, userService, projector);
	    document.body.innerHTML = '';
	    projector.merge(document.body, app.renderMaquette);
	};
	userService.initialize().then(function () {
	    userServiceReady = true;
	    if (horizonReady) {
	        userService.initializeHorizon(horizon);
	    }
	    startApp();
	});
	horizon.onReady(function () {
	    horizonReady = true;
	    if (userServiceReady) {
	        userService.initializeHorizon(horizon);
	    }
	});
	horizon.connect();


/***/ },
/* 2 */
/***/ function(module, exports) {

	if ('serviceWorker' in navigator) {
	    navigator.serviceWorker.register('service-worker.js').then(function (reg) {
	        // updatefound is fired if service-worker.js changes.
	        reg.onupdatefound = function () {
	            // The updatefound event implies that reg.installing is set; see
	            // https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#service-worker-container-updatefound-event
	            var installingWorker = reg.installing;
	            console.log('Installing new service worker...');
	            installingWorker.onstatechange = function () {
	                switch (installingWorker.state) {
	                    case 'installed':
	                        if (navigator.serviceWorker.controller) {
	                            // At this point, the old content will have been purged and the fresh content will
	                            // have been added to the cache.
	                            // It's the perfect time to display a "New content is available; please refresh."
	                            // message in the page's interface.
	                            console.log('New or updated content is available.');
	                        }
	                        else {
	                            // At this point, everything has been precached.
	                            // It's the perfect time to display a "Content is cached for offline use." message.
	                            console.log('Content is now available offline!');
	                        }
	                        break;
	                    case 'redundant':
	                        console.error('The installing service worker became redundant.');
	                        break;
	                }
	            };
	        };
	    }).catch(function (e) {
	        console.error('Error during service worker registration:', e);
	    });
	}


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _Observable = __webpack_require__(4);
	
	__webpack_require__(20);
	
	__webpack_require__(26);
	
	__webpack_require__(36);
	
	__webpack_require__(38);
	
	__webpack_require__(44);
	
	__webpack_require__(46);
	
	__webpack_require__(48);
	
	var _require = __webpack_require__(50);
	
	// Extra operators not used, but useful to Horizon end-users
	
	
	var Collection = _require.Collection;
	var UserDataTerm = _require.UserDataTerm;
	
	var HorizonSocket = __webpack_require__(161);
	
	var _require2 = __webpack_require__(170);
	
	var log = _require2.log;
	var logError = _require2.logError;
	var enableLogging = _require2.enableLogging;
	
	var _require3 = __webpack_require__(202);
	
	var authEndpoint = _require3.authEndpoint;
	var TokenStorage = _require3.TokenStorage;
	var clearAuthTokens = _require3.clearAuthTokens;
	
	
	var defaultHost = typeof window !== 'undefined' && window.location && '' + window.location.host || 'localhost:8181';
	var defaultSecure = typeof window !== 'undefined' && window.location && window.location.protocol === 'https:' || false;
	
	function Horizon() {
	  var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	
	  var _ref$host = _ref.host;
	  var host = _ref$host === undefined ? defaultHost : _ref$host;
	  var _ref$secure = _ref.secure;
	  var secure = _ref$secure === undefined ? defaultSecure : _ref$secure;
	  var _ref$path = _ref.path;
	  var path = _ref$path === undefined ? 'horizon' : _ref$path;
	  var _ref$lazyWrites = _ref.lazyWrites;
	  var lazyWrites = _ref$lazyWrites === undefined ? false : _ref$lazyWrites;
	  var _ref$authType = _ref.authType;
	  var authType = _ref$authType === undefined ? 'unauthenticated' : _ref$authType;
	
	  // If we're in a redirection from OAuth, store the auth token for
	  // this user in localStorage.
	
	  var tokenStorage = new TokenStorage({ authType: authType, path: path });
	  tokenStorage.setAuthFromQueryParams();
	
	  var socket = new HorizonSocket(host, secure, path, tokenStorage.handshake.bind(tokenStorage));
	
	  // Store whatever token we get back from the server when we get a
	  // handshake response
	  socket.handshake.subscribe({
	    next: function next(handshake) {
	      if (authType !== 'unauthenticated') {
	        tokenStorage.set(handshake.token);
	      }
	    },
	    error: function error(err) {
	      if (/JsonWebTokenError|TokenExpiredError/.test(err.message)) {
	        console.error('Horizon: clearing token storage since auth failed');
	        tokenStorage.remove();
	      }
	    }
	  });
	
	  // This is the object returned by the Horizon function. It's a
	  // function so we can construct a collection simply by calling it
	  // like horizon('my_collection')
	  function horizon(name) {
	    return new Collection(sendRequest, name, lazyWrites);
	  }
	
	  horizon.currentUser = function () {
	    return new UserDataTerm(horizon, socket.handshake, socket);
	  };
	
	  horizon.disconnect = function () {
	    socket.complete();
	  };
	
	  // Dummy subscription to force it to connect to the
	  // server. Optionally provide an error handling function if the
	  // socket experiences an error.
	  // Note: Users of the Observable interface shouldn't need this
	  horizon.connect = function () {
	    var onError = arguments.length <= 0 || arguments[0] === undefined ? function (err) {
	      console.error('Received an error: ' + err);
	    } : arguments[0];
	
	    socket.subscribe(function () {}, onError);
	  };
	
	  // Either subscribe to status updates, or return an observable with
	  // the current status and all subsequent status changes.
	  horizon.status = subscribeOrObservable(socket.status);
	
	  // Convenience method for finding out when disconnected
	  horizon.onDisconnected = subscribeOrObservable(socket.status.filter(function (x) {
	    return x.type === 'disconnected';
	  }));
	
	  // Convenience method for finding out when ready
	  horizon.onReady = subscribeOrObservable(socket.status.filter(function (x) {
	    return x.type === 'ready';
	  }));
	
	  // Convenience method for finding out when an error occurs
	  horizon.onSocketError = subscribeOrObservable(socket.status.filter(function (x) {
	    return x.type === 'error';
	  }));
	
	  horizon.utensils = {
	    sendRequest: sendRequest,
	    tokenStorage: tokenStorage,
	    handshake: socket.handshake
	  };
	  Object.freeze(horizon.utensils);
	
	  horizon._authMethods = null;
	  horizon._horizonPath = path;
	  horizon.authEndpoint = authEndpoint;
	  horizon.hasAuthToken = tokenStorage.hasAuthToken.bind(tokenStorage);
	
	  return horizon;
	
	  // Sends a horizon protocol request to the server, and pulls the data
	  // portion of the response out.
	  function sendRequest(type, options) {
	    // Both remove and removeAll use the type 'remove' in the protocol
	    var normalizedType = type === 'removeAll' ? 'remove' : type;
	    return socket.makeRequest({ type: normalizedType, options: options }) // send the raw request
	    .concatMap(function (resp) {
	      // unroll arrays being returned
	      if (resp.data) {
	        return _Observable.Observable.from(resp.data);
	      } else {
	        // Still need to emit a document even if we have no new data
	        return _Observable.Observable.from([{ state: resp.state, type: resp.type }]);
	      }
	    }).catch(function (e) {
	      return _Observable.Observable.create(function (subscriber) {
	        subscriber.error(e);
	      });
	    }); // on error, strip error message
	  }
	}
	
	function subscribeOrObservable(observable) {
	  return function () {
	    if (arguments.length > 0) {
	      return observable.subscribe.apply(observable, arguments);
	    } else {
	      return observable;
	    }
	  };
	}
	
	Horizon.log = log;
	Horizon.logError = logError;
	Horizon.enableLogging = enableLogging;
	Horizon.Socket = HorizonSocket;
	Horizon.clearAuthTokens = clearAuthTokens;
	
	module.exports = Horizon;
	//# sourceMappingURL=index.js.map

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var root_1 = __webpack_require__(5);
	var toSubscriber_1 = __webpack_require__(7);
	var $$observable = __webpack_require__(18);
	/**
	 * A representation of any set of values over any amount of time. This the most basic building block
	 * of RxJS.
	 *
	 * @class Observable<T>
	 */
	var Observable = (function () {
	    /**
	     * @constructor
	     * @param {Function} subscribe the function that is  called when the Observable is
	     * initially subscribed to. This function is given a Subscriber, to which new values
	     * can be `next`ed, or an `error` method can be called to raise an error, or
	     * `complete` can be called to notify of a successful completion.
	     */
	    function Observable(subscribe) {
	        this._isScalar = false;
	        if (subscribe) {
	            this._subscribe = subscribe;
	        }
	    }
	    /**
	     * Creates a new Observable, with this Observable as the source, and the passed
	     * operator defined as the new observable's operator.
	     * @method lift
	     * @param {Operator} operator the operator defining the operation to take on the observable
	     * @return {Observable} a new observable with the Operator applied
	     */
	    Observable.prototype.lift = function (operator) {
	        var observable = new Observable();
	        observable.source = this;
	        observable.operator = operator;
	        return observable;
	    };
	    /**
	     * Registers handlers for handling emitted values, error and completions from the observable, and
	     *  executes the observable's subscriber function, which will take action to set up the underlying data stream
	     * @method subscribe
	     * @param {PartialObserver|Function} observerOrNext (optional) either an observer defining all functions to be called,
	     *  or the first of three possible handlers, which is the handler for each value emitted from the observable.
	     * @param {Function} error (optional) a handler for a terminal event resulting from an error. If no error handler is provided,
	     *  the error will be thrown as unhandled
	     * @param {Function} complete (optional) a handler for a terminal event resulting from successful completion.
	     * @return {ISubscription} a subscription reference to the registered handlers
	     */
	    Observable.prototype.subscribe = function (observerOrNext, error, complete) {
	        var operator = this.operator;
	        var sink = toSubscriber_1.toSubscriber(observerOrNext, error, complete);
	        sink.add(operator ? operator.call(sink, this) : this._subscribe(sink));
	        if (sink.syncErrorThrowable) {
	            sink.syncErrorThrowable = false;
	            if (sink.syncErrorThrown) {
	                throw sink.syncErrorValue;
	            }
	        }
	        return sink;
	    };
	    /**
	     * @method forEach
	     * @param {Function} next a handler for each value emitted by the observable
	     * @param {PromiseConstructor} [PromiseCtor] a constructor function used to instantiate the Promise
	     * @return {Promise} a promise that either resolves on observable completion or
	     *  rejects with the handled error
	     */
	    Observable.prototype.forEach = function (next, PromiseCtor) {
	        var _this = this;
	        if (!PromiseCtor) {
	            if (root_1.root.Rx && root_1.root.Rx.config && root_1.root.Rx.config.Promise) {
	                PromiseCtor = root_1.root.Rx.config.Promise;
	            }
	            else if (root_1.root.Promise) {
	                PromiseCtor = root_1.root.Promise;
	            }
	        }
	        if (!PromiseCtor) {
	            throw new Error('no Promise impl found');
	        }
	        return new PromiseCtor(function (resolve, reject) {
	            var subscription = _this.subscribe(function (value) {
	                if (subscription) {
	                    // if there is a subscription, then we can surmise
	                    // the next handling is asynchronous. Any errors thrown
	                    // need to be rejected explicitly and unsubscribe must be
	                    // called manually
	                    try {
	                        next(value);
	                    }
	                    catch (err) {
	                        reject(err);
	                        subscription.unsubscribe();
	                    }
	                }
	                else {
	                    // if there is NO subscription, then we're getting a nexted
	                    // value synchronously during subscription. We can just call it.
	                    // If it errors, Observable's `subscribe` imple will ensure the
	                    // unsubscription logic is called, then synchronously rethrow the error.
	                    // After that, Promise will trap the error and send it
	                    // down the rejection path.
	                    next(value);
	                }
	            }, reject, resolve);
	        });
	    };
	    Observable.prototype._subscribe = function (subscriber) {
	        return this.source.subscribe(subscriber);
	    };
	    /**
	     * An interop point defined by the es7-observable spec https://github.com/zenparsing/es-observable
	     * @method Symbol.observable
	     * @return {Observable} this instance of the observable
	     */
	    Observable.prototype[$$observable] = function () {
	        return this;
	    };
	    // HACK: Since TypeScript inherits static properties too, we have to
	    // fight against TypeScript here so Subject can have a different static create signature
	    /**
	     * Creates a new cold Observable by calling the Observable constructor
	     * @static true
	     * @owner Observable
	     * @method create
	     * @param {Function} subscribe? the subscriber function to be passed to the Observable constructor
	     * @return {Observable} a new cold observable
	     */
	    Observable.create = function (subscribe) {
	        return new Observable(subscribe);
	    };
	    return Observable;
	}());
	exports.Observable = Observable;
	//# sourceMappingURL=Observable.js.map

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module, global) {"use strict";
	var objectTypes = {
	    'boolean': false,
	    'function': true,
	    'object': true,
	    'number': false,
	    'string': false,
	    'undefined': false
	};
	exports.root = (objectTypes[typeof self] && self) || (objectTypes[typeof window] && window);
	/* tslint:disable:no-unused-variable */
	var freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports;
	var freeModule = objectTypes[typeof module] && module && !module.nodeType && module;
	var freeGlobal = objectTypes[typeof global] && global;
	if (freeGlobal && (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal)) {
	    exports.root = freeGlobal;
	}
	//# sourceMappingURL=root.js.map
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)(module), (function() { return this; }())))

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Subscriber_1 = __webpack_require__(8);
	var rxSubscriber_1 = __webpack_require__(16);
	function toSubscriber(nextOrObserver, error, complete) {
	    if (nextOrObserver && typeof nextOrObserver === 'object') {
	        if (nextOrObserver instanceof Subscriber_1.Subscriber) {
	            return nextOrObserver;
	        }
	        else if (typeof nextOrObserver[rxSubscriber_1.$$rxSubscriber] === 'function') {
	            return nextOrObserver[rxSubscriber_1.$$rxSubscriber]();
	        }
	    }
	    return new Subscriber_1.Subscriber(nextOrObserver, error, complete);
	}
	exports.toSubscriber = toSubscriber;
	//# sourceMappingURL=toSubscriber.js.map

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var isFunction_1 = __webpack_require__(9);
	var Subscription_1 = __webpack_require__(10);
	var rxSubscriber_1 = __webpack_require__(16);
	var Observer_1 = __webpack_require__(17);
	/**
	 * Implements the {@link Observer} interface and extends the
	 * {@link Subscription} class. While the {@link Observer} is the public API for
	 * consuming the values of an {@link Observable}, all Observers get converted to
	 * a Subscriber, in order to provide Subscription-like capabilities such as
	 * `unsubscribe`. Subscriber is a common type in RxJS, and crucial for
	 * implementing operators, but it is rarely used as a public API.
	 *
	 * @class Subscriber<T>
	 */
	var Subscriber = (function (_super) {
	    __extends(Subscriber, _super);
	    /**
	     * @param {Observer|function(value: T): void} [destinationOrNext] A partially
	     * defined Observer or a `next` callback function.
	     * @param {function(e: ?any): void} [error] The `error` callback of an
	     * Observer.
	     * @param {function(): void} [complete] The `complete` callback of an
	     * Observer.
	     */
	    function Subscriber(destinationOrNext, error, complete) {
	        _super.call(this);
	        this.syncErrorValue = null;
	        this.syncErrorThrown = false;
	        this.syncErrorThrowable = false;
	        this.isStopped = false;
	        switch (arguments.length) {
	            case 0:
	                this.destination = Observer_1.empty;
	                break;
	            case 1:
	                if (!destinationOrNext) {
	                    this.destination = Observer_1.empty;
	                    break;
	                }
	                if (typeof destinationOrNext === 'object') {
	                    if (destinationOrNext instanceof Subscriber) {
	                        this.destination = destinationOrNext;
	                        this.destination.add(this);
	                    }
	                    else {
	                        this.syncErrorThrowable = true;
	                        this.destination = new SafeSubscriber(this, destinationOrNext);
	                    }
	                    break;
	                }
	            default:
	                this.syncErrorThrowable = true;
	                this.destination = new SafeSubscriber(this, destinationOrNext, error, complete);
	                break;
	        }
	    }
	    /**
	     * A static factory for a Subscriber, given a (potentially partial) definition
	     * of an Observer.
	     * @param {function(x: ?T): void} [next] The `next` callback of an Observer.
	     * @param {function(e: ?any): void} [error] The `error` callback of an
	     * Observer.
	     * @param {function(): void} [complete] The `complete` callback of an
	     * Observer.
	     * @return {Subscriber<T>} A Subscriber wrapping the (partially defined)
	     * Observer represented by the given arguments.
	     */
	    Subscriber.create = function (next, error, complete) {
	        var subscriber = new Subscriber(next, error, complete);
	        subscriber.syncErrorThrowable = false;
	        return subscriber;
	    };
	    /**
	     * The {@link Observer} callback to receive notifications of type `next` from
	     * the Observable, with a value. The Observable may call this method 0 or more
	     * times.
	     * @param {T} [value] The `next` value.
	     * @return {void}
	     */
	    Subscriber.prototype.next = function (value) {
	        if (!this.isStopped) {
	            this._next(value);
	        }
	    };
	    /**
	     * The {@link Observer} callback to receive notifications of type `error` from
	     * the Observable, with an attached {@link Error}. Notifies the Observer that
	     * the Observable has experienced an error condition.
	     * @param {any} [err] The `error` exception.
	     * @return {void}
	     */
	    Subscriber.prototype.error = function (err) {
	        if (!this.isStopped) {
	            this.isStopped = true;
	            this._error(err);
	        }
	    };
	    /**
	     * The {@link Observer} callback to receive a valueless notification of type
	     * `complete` from the Observable. Notifies the Observer that the Observable
	     * has finished sending push-based notifications.
	     * @return {void}
	     */
	    Subscriber.prototype.complete = function () {
	        if (!this.isStopped) {
	            this.isStopped = true;
	            this._complete();
	        }
	    };
	    Subscriber.prototype.unsubscribe = function () {
	        if (this.isUnsubscribed) {
	            return;
	        }
	        this.isStopped = true;
	        _super.prototype.unsubscribe.call(this);
	    };
	    Subscriber.prototype._next = function (value) {
	        this.destination.next(value);
	    };
	    Subscriber.prototype._error = function (err) {
	        this.destination.error(err);
	        this.unsubscribe();
	    };
	    Subscriber.prototype._complete = function () {
	        this.destination.complete();
	        this.unsubscribe();
	    };
	    Subscriber.prototype[rxSubscriber_1.$$rxSubscriber] = function () {
	        return this;
	    };
	    return Subscriber;
	}(Subscription_1.Subscription));
	exports.Subscriber = Subscriber;
	/**
	 * We need this JSDoc comment for affecting ESDoc.
	 * @ignore
	 * @extends {Ignored}
	 */
	var SafeSubscriber = (function (_super) {
	    __extends(SafeSubscriber, _super);
	    function SafeSubscriber(_parent, observerOrNext, error, complete) {
	        _super.call(this);
	        this._parent = _parent;
	        var next;
	        var context = this;
	        if (isFunction_1.isFunction(observerOrNext)) {
	            next = observerOrNext;
	        }
	        else if (observerOrNext) {
	            context = observerOrNext;
	            next = observerOrNext.next;
	            error = observerOrNext.error;
	            complete = observerOrNext.complete;
	            if (isFunction_1.isFunction(context.unsubscribe)) {
	                this.add(context.unsubscribe.bind(context));
	            }
	            context.unsubscribe = this.unsubscribe.bind(this);
	        }
	        this._context = context;
	        this._next = next;
	        this._error = error;
	        this._complete = complete;
	    }
	    SafeSubscriber.prototype.next = function (value) {
	        if (!this.isStopped && this._next) {
	            var _parent = this._parent;
	            if (!_parent.syncErrorThrowable) {
	                this.__tryOrUnsub(this._next, value);
	            }
	            else if (this.__tryOrSetError(_parent, this._next, value)) {
	                this.unsubscribe();
	            }
	        }
	    };
	    SafeSubscriber.prototype.error = function (err) {
	        if (!this.isStopped) {
	            var _parent = this._parent;
	            if (this._error) {
	                if (!_parent.syncErrorThrowable) {
	                    this.__tryOrUnsub(this._error, err);
	                    this.unsubscribe();
	                }
	                else {
	                    this.__tryOrSetError(_parent, this._error, err);
	                    this.unsubscribe();
	                }
	            }
	            else if (!_parent.syncErrorThrowable) {
	                this.unsubscribe();
	                throw err;
	            }
	            else {
	                _parent.syncErrorValue = err;
	                _parent.syncErrorThrown = true;
	                this.unsubscribe();
	            }
	        }
	    };
	    SafeSubscriber.prototype.complete = function () {
	        if (!this.isStopped) {
	            var _parent = this._parent;
	            if (this._complete) {
	                if (!_parent.syncErrorThrowable) {
	                    this.__tryOrUnsub(this._complete);
	                    this.unsubscribe();
	                }
	                else {
	                    this.__tryOrSetError(_parent, this._complete);
	                    this.unsubscribe();
	                }
	            }
	            else {
	                this.unsubscribe();
	            }
	        }
	    };
	    SafeSubscriber.prototype.__tryOrUnsub = function (fn, value) {
	        try {
	            fn.call(this._context, value);
	        }
	        catch (err) {
	            this.unsubscribe();
	            throw err;
	        }
	    };
	    SafeSubscriber.prototype.__tryOrSetError = function (parent, fn, value) {
	        try {
	            fn.call(this._context, value);
	        }
	        catch (err) {
	            parent.syncErrorValue = err;
	            parent.syncErrorThrown = true;
	            return true;
	        }
	        return false;
	    };
	    SafeSubscriber.prototype._unsubscribe = function () {
	        var _parent = this._parent;
	        this._context = null;
	        this._parent = null;
	        _parent.unsubscribe();
	    };
	    return SafeSubscriber;
	}(Subscriber));
	//# sourceMappingURL=Subscriber.js.map

/***/ },
/* 9 */
/***/ function(module, exports) {

	"use strict";
	function isFunction(x) {
	    return typeof x === 'function';
	}
	exports.isFunction = isFunction;
	//# sourceMappingURL=isFunction.js.map

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var isArray_1 = __webpack_require__(11);
	var isObject_1 = __webpack_require__(12);
	var isFunction_1 = __webpack_require__(9);
	var tryCatch_1 = __webpack_require__(13);
	var errorObject_1 = __webpack_require__(14);
	var UnsubscriptionError_1 = __webpack_require__(15);
	/**
	 * Represents a disposable resource, such as the execution of an Observable. A
	 * Subscription has one important method, `unsubscribe`, that takes no argument
	 * and just disposes the resource held by the subscription.
	 *
	 * Additionally, subscriptions may be grouped together through the `add()`
	 * method, which will attach a child Subscription to the current Subscription.
	 * When a Subscription is unsubscribed, all its children (and its grandchildren)
	 * will be unsubscribed as well.
	 *
	 * @class Subscription
	 */
	var Subscription = (function () {
	    /**
	     * @param {function(): void} [unsubscribe] A function describing how to
	     * perform the disposal of resources when the `unsubscribe` method is called.
	     */
	    function Subscription(unsubscribe) {
	        /**
	         * A flag to indicate whether this Subscription has already been unsubscribed.
	         * @type {boolean}
	         */
	        this.isUnsubscribed = false;
	        if (unsubscribe) {
	            this._unsubscribe = unsubscribe;
	        }
	    }
	    /**
	     * Disposes the resources held by the subscription. May, for instance, cancel
	     * an ongoing Observable execution or cancel any other type of work that
	     * started when the Subscription was created.
	     * @return {void}
	     */
	    Subscription.prototype.unsubscribe = function () {
	        var hasErrors = false;
	        var errors;
	        if (this.isUnsubscribed) {
	            return;
	        }
	        this.isUnsubscribed = true;
	        var _a = this, _unsubscribe = _a._unsubscribe, _subscriptions = _a._subscriptions;
	        this._subscriptions = null;
	        if (isFunction_1.isFunction(_unsubscribe)) {
	            var trial = tryCatch_1.tryCatch(_unsubscribe).call(this);
	            if (trial === errorObject_1.errorObject) {
	                hasErrors = true;
	                (errors = errors || []).push(errorObject_1.errorObject.e);
	            }
	        }
	        if (isArray_1.isArray(_subscriptions)) {
	            var index = -1;
	            var len = _subscriptions.length;
	            while (++index < len) {
	                var sub = _subscriptions[index];
	                if (isObject_1.isObject(sub)) {
	                    var trial = tryCatch_1.tryCatch(sub.unsubscribe).call(sub);
	                    if (trial === errorObject_1.errorObject) {
	                        hasErrors = true;
	                        errors = errors || [];
	                        var err = errorObject_1.errorObject.e;
	                        if (err instanceof UnsubscriptionError_1.UnsubscriptionError) {
	                            errors = errors.concat(err.errors);
	                        }
	                        else {
	                            errors.push(err);
	                        }
	                    }
	                }
	            }
	        }
	        if (hasErrors) {
	            throw new UnsubscriptionError_1.UnsubscriptionError(errors);
	        }
	    };
	    /**
	     * Adds a tear down to be called during the unsubscribe() of this
	     * Subscription.
	     *
	     * If the tear down being added is a subscription that is already
	     * unsubscribed, is the same reference `add` is being called on, or is
	     * `Subscription.EMPTY`, it will not be added.
	     *
	     * If this subscription is already in an `isUnsubscribed` state, the passed
	     * tear down logic will be executed immediately.
	     *
	     * @param {TeardownLogic} teardown The additional logic to execute on
	     * teardown.
	     * @return {Subscription} Returns the Subscription used or created to be
	     * added to the inner subscriptions list. This Subscription can be used with
	     * `remove()` to remove the passed teardown logic from the inner subscriptions
	     * list.
	     */
	    Subscription.prototype.add = function (teardown) {
	        if (!teardown || (teardown === this) || (teardown === Subscription.EMPTY)) {
	            return;
	        }
	        var sub = teardown;
	        switch (typeof teardown) {
	            case 'function':
	                sub = new Subscription(teardown);
	            case 'object':
	                if (sub.isUnsubscribed || typeof sub.unsubscribe !== 'function') {
	                    break;
	                }
	                else if (this.isUnsubscribed) {
	                    sub.unsubscribe();
	                }
	                else {
	                    (this._subscriptions || (this._subscriptions = [])).push(sub);
	                }
	                break;
	            default:
	                throw new Error('Unrecognized teardown ' + teardown + ' added to Subscription.');
	        }
	        return sub;
	    };
	    /**
	     * Removes a Subscription from the internal list of subscriptions that will
	     * unsubscribe during the unsubscribe process of this Subscription.
	     * @param {Subscription} subscription The subscription to remove.
	     * @return {void}
	     */
	    Subscription.prototype.remove = function (subscription) {
	        // HACK: This might be redundant because of the logic in `add()`
	        if (subscription == null || (subscription === this) || (subscription === Subscription.EMPTY)) {
	            return;
	        }
	        var subscriptions = this._subscriptions;
	        if (subscriptions) {
	            var subscriptionIndex = subscriptions.indexOf(subscription);
	            if (subscriptionIndex !== -1) {
	                subscriptions.splice(subscriptionIndex, 1);
	            }
	        }
	    };
	    Subscription.EMPTY = (function (empty) {
	        empty.isUnsubscribed = true;
	        return empty;
	    }(new Subscription()));
	    return Subscription;
	}());
	exports.Subscription = Subscription;
	//# sourceMappingURL=Subscription.js.map

/***/ },
/* 11 */
/***/ function(module, exports) {

	"use strict";
	exports.isArray = Array.isArray || (function (x) { return x && typeof x.length === 'number'; });
	//# sourceMappingURL=isArray.js.map

/***/ },
/* 12 */
/***/ function(module, exports) {

	"use strict";
	function isObject(x) {
	    return x != null && typeof x === 'object';
	}
	exports.isObject = isObject;
	//# sourceMappingURL=isObject.js.map

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var errorObject_1 = __webpack_require__(14);
	var tryCatchTarget;
	function tryCatcher() {
	    try {
	        return tryCatchTarget.apply(this, arguments);
	    }
	    catch (e) {
	        errorObject_1.errorObject.e = e;
	        return errorObject_1.errorObject;
	    }
	}
	function tryCatch(fn) {
	    tryCatchTarget = fn;
	    return tryCatcher;
	}
	exports.tryCatch = tryCatch;
	;
	//# sourceMappingURL=tryCatch.js.map

/***/ },
/* 14 */
/***/ function(module, exports) {

	"use strict";
	// typeof any so that it we don't have to cast when comparing a result to the error object
	exports.errorObject = { e: {} };
	//# sourceMappingURL=errorObject.js.map

/***/ },
/* 15 */
/***/ function(module, exports) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	/**
	 * An error thrown when one or more errors have occurred during the
	 * `unsubscribe` of a {@link Subscription}.
	 */
	var UnsubscriptionError = (function (_super) {
	    __extends(UnsubscriptionError, _super);
	    function UnsubscriptionError(errors) {
	        _super.call(this);
	        this.errors = errors;
	        this.name = 'UnsubscriptionError';
	        this.message = errors ? errors.length + " errors occurred during unsubscription:\n" + errors.map(function (err, i) { return ((i + 1) + ") " + err.toString()); }).join('\n') : '';
	    }
	    return UnsubscriptionError;
	}(Error));
	exports.UnsubscriptionError = UnsubscriptionError;
	//# sourceMappingURL=UnsubscriptionError.js.map

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var root_1 = __webpack_require__(5);
	var Symbol = root_1.root.Symbol;
	exports.$$rxSubscriber = (typeof Symbol === 'function' && typeof Symbol.for === 'function') ?
	    Symbol.for('rxSubscriber') : '@@rxSubscriber';
	//# sourceMappingURL=rxSubscriber.js.map

/***/ },
/* 17 */
/***/ function(module, exports) {

	"use strict";
	exports.empty = {
	    isUnsubscribed: true,
	    next: function (value) { },
	    error: function (err) { throw err; },
	    complete: function () { }
	};
	//# sourceMappingURL=Observer.js.map

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/* global window */
	'use strict';
	
	module.exports = __webpack_require__(19)(global || window || this);
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 19 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = function symbolObservablePonyfill(root) {
		var result;
		var Symbol = root.Symbol;
	
		if (typeof Symbol === 'function') {
			if (Symbol.observable) {
				result = Symbol.observable;
			} else {
				result = Symbol('observable');
				Symbol.observable = result;
			}
		} else {
			result = '@@observable';
		}
	
		return result;
	};


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Observable_1 = __webpack_require__(4);
	var of_1 = __webpack_require__(21);
	Observable_1.Observable.of = of_1.of;
	//# sourceMappingURL=of.js.map

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var ArrayObservable_1 = __webpack_require__(22);
	exports.of = ArrayObservable_1.ArrayObservable.of;
	//# sourceMappingURL=of.js.map

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Observable_1 = __webpack_require__(4);
	var ScalarObservable_1 = __webpack_require__(23);
	var EmptyObservable_1 = __webpack_require__(24);
	var isScheduler_1 = __webpack_require__(25);
	/**
	 * We need this JSDoc comment for affecting ESDoc.
	 * @extends {Ignored}
	 * @hide true
	 */
	var ArrayObservable = (function (_super) {
	    __extends(ArrayObservable, _super);
	    function ArrayObservable(array, scheduler) {
	        _super.call(this);
	        this.array = array;
	        this.scheduler = scheduler;
	        if (!scheduler && array.length === 1) {
	            this._isScalar = true;
	            this.value = array[0];
	        }
	    }
	    ArrayObservable.create = function (array, scheduler) {
	        return new ArrayObservable(array, scheduler);
	    };
	    /**
	     * Creates an Observable that emits some values you specify as arguments,
	     * immediately one after the other, and then emits a complete notification.
	     *
	     * <span class="informal">Emits the arguments you provide, then completes.
	     * </span>
	     *
	     * <img src="./img/of.png" width="100%">
	     *
	     * This static operator is useful for creating a simple Observable that only
	     * emits the arguments given, and the complete notification thereafter. It can
	     * be used for composing with other Observables, such as with {@link concat}.
	     * By default, it uses a `null` Scheduler, which means the `next`
	     * notifications are sent synchronously, although with a different Scheduler
	     * it is possible to determine when those notifications will be delivered.
	     *
	     * @example <caption>Emit 10, 20, 30, then 'a', 'b', 'c', then start ticking every second.</caption>
	     * var numbers = Rx.Observable.of(10, 20, 30);
	     * var letters = Rx.Observable.of('a', 'b', 'c');
	     * var interval = Rx.Observable.interval(1000);
	     * var result = numbers.concat(letters).concat(interval);
	     * result.subscribe(x => console.log(x));
	     *
	     * @see {@link create}
	     * @see {@link empty}
	     * @see {@link never}
	     * @see {@link throw}
	     *
	     * @param {...T} values Arguments that represent `next` values to be emitted.
	     * @param {Scheduler} [scheduler] A {@link Scheduler} to use for scheduling
	     * the emissions of the `next` notifications.
	     * @return {Observable<T>} An Observable that emits each given input value.
	     * @static true
	     * @name of
	     * @owner Observable
	     */
	    ArrayObservable.of = function () {
	        var array = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            array[_i - 0] = arguments[_i];
	        }
	        var scheduler = array[array.length - 1];
	        if (isScheduler_1.isScheduler(scheduler)) {
	            array.pop();
	        }
	        else {
	            scheduler = null;
	        }
	        var len = array.length;
	        if (len > 1) {
	            return new ArrayObservable(array, scheduler);
	        }
	        else if (len === 1) {
	            return new ScalarObservable_1.ScalarObservable(array[0], scheduler);
	        }
	        else {
	            return new EmptyObservable_1.EmptyObservable(scheduler);
	        }
	    };
	    ArrayObservable.dispatch = function (state) {
	        var array = state.array, index = state.index, count = state.count, subscriber = state.subscriber;
	        if (index >= count) {
	            subscriber.complete();
	            return;
	        }
	        subscriber.next(array[index]);
	        if (subscriber.isUnsubscribed) {
	            return;
	        }
	        state.index = index + 1;
	        this.schedule(state);
	    };
	    ArrayObservable.prototype._subscribe = function (subscriber) {
	        var index = 0;
	        var array = this.array;
	        var count = array.length;
	        var scheduler = this.scheduler;
	        if (scheduler) {
	            return scheduler.schedule(ArrayObservable.dispatch, 0, {
	                array: array, index: index, count: count, subscriber: subscriber
	            });
	        }
	        else {
	            for (var i = 0; i < count && !subscriber.isUnsubscribed; i++) {
	                subscriber.next(array[i]);
	            }
	            subscriber.complete();
	        }
	    };
	    return ArrayObservable;
	}(Observable_1.Observable));
	exports.ArrayObservable = ArrayObservable;
	//# sourceMappingURL=ArrayObservable.js.map

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Observable_1 = __webpack_require__(4);
	/**
	 * We need this JSDoc comment for affecting ESDoc.
	 * @extends {Ignored}
	 * @hide true
	 */
	var ScalarObservable = (function (_super) {
	    __extends(ScalarObservable, _super);
	    function ScalarObservable(value, scheduler) {
	        _super.call(this);
	        this.value = value;
	        this.scheduler = scheduler;
	        this._isScalar = true;
	    }
	    ScalarObservable.create = function (value, scheduler) {
	        return new ScalarObservable(value, scheduler);
	    };
	    ScalarObservable.dispatch = function (state) {
	        var done = state.done, value = state.value, subscriber = state.subscriber;
	        if (done) {
	            subscriber.complete();
	            return;
	        }
	        subscriber.next(value);
	        if (subscriber.isUnsubscribed) {
	            return;
	        }
	        state.done = true;
	        this.schedule(state);
	    };
	    ScalarObservable.prototype._subscribe = function (subscriber) {
	        var value = this.value;
	        var scheduler = this.scheduler;
	        if (scheduler) {
	            return scheduler.schedule(ScalarObservable.dispatch, 0, {
	                done: false, value: value, subscriber: subscriber
	            });
	        }
	        else {
	            subscriber.next(value);
	            if (!subscriber.isUnsubscribed) {
	                subscriber.complete();
	            }
	        }
	    };
	    return ScalarObservable;
	}(Observable_1.Observable));
	exports.ScalarObservable = ScalarObservable;
	//# sourceMappingURL=ScalarObservable.js.map

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Observable_1 = __webpack_require__(4);
	/**
	 * We need this JSDoc comment for affecting ESDoc.
	 * @extends {Ignored}
	 * @hide true
	 */
	var EmptyObservable = (function (_super) {
	    __extends(EmptyObservable, _super);
	    function EmptyObservable(scheduler) {
	        _super.call(this);
	        this.scheduler = scheduler;
	    }
	    /**
	     * Creates an Observable that emits no items to the Observer and immediately
	     * emits a complete notification.
	     *
	     * <span class="informal">Just emits 'complete', and nothing else.
	     * </span>
	     *
	     * <img src="./img/empty.png" width="100%">
	     *
	     * This static operator is useful for creating a simple Observable that only
	     * emits the complete notification. It can be used for composing with other
	     * Observables, such as in a {@link mergeMap}.
	     *
	     * @example <caption>Emit the number 7, then complete.</caption>
	     * var result = Rx.Observable.empty().startWith(7);
	     * result.subscribe(x => console.log(x));
	     *
	     * @example <caption>Map and flatten only odd numbers to the sequence 'a', 'b', 'c'</caption>
	     * var interval = Rx.Observable.interval(1000);
	     * var result = interval.mergeMap(x =>
	     *   x % 2 === 1 ? Rx.Observable.of('a', 'b', 'c') : Rx.Observable.empty()
	     * );
	     * result.subscribe(x => console.log(x));
	     *
	     * @see {@link create}
	     * @see {@link never}
	     * @see {@link of}
	     * @see {@link throw}
	     *
	     * @param {Scheduler} [scheduler] A {@link Scheduler} to use for scheduling
	     * the emission of the complete notification.
	     * @return {Observable} An "empty" Observable: emits only the complete
	     * notification.
	     * @static true
	     * @name empty
	     * @owner Observable
	     */
	    EmptyObservable.create = function (scheduler) {
	        return new EmptyObservable(scheduler);
	    };
	    EmptyObservable.dispatch = function (arg) {
	        var subscriber = arg.subscriber;
	        subscriber.complete();
	    };
	    EmptyObservable.prototype._subscribe = function (subscriber) {
	        var scheduler = this.scheduler;
	        if (scheduler) {
	            return scheduler.schedule(EmptyObservable.dispatch, 0, { subscriber: subscriber });
	        }
	        else {
	            subscriber.complete();
	        }
	    };
	    return EmptyObservable;
	}(Observable_1.Observable));
	exports.EmptyObservable = EmptyObservable;
	//# sourceMappingURL=EmptyObservable.js.map

/***/ },
/* 25 */
/***/ function(module, exports) {

	"use strict";
	function isScheduler(value) {
	    return value && typeof value.schedule === 'function';
	}
	exports.isScheduler = isScheduler;
	//# sourceMappingURL=isScheduler.js.map

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Observable_1 = __webpack_require__(4);
	var from_1 = __webpack_require__(27);
	Observable_1.Observable.from = from_1.from;
	//# sourceMappingURL=from.js.map

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var FromObservable_1 = __webpack_require__(28);
	exports.from = FromObservable_1.FromObservable.create;
	//# sourceMappingURL=from.js.map

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var isArray_1 = __webpack_require__(11);
	var isFunction_1 = __webpack_require__(9);
	var isPromise_1 = __webpack_require__(29);
	var isScheduler_1 = __webpack_require__(25);
	var PromiseObservable_1 = __webpack_require__(30);
	var IteratorObservable_1 = __webpack_require__(31);
	var ArrayObservable_1 = __webpack_require__(22);
	var ArrayLikeObservable_1 = __webpack_require__(33);
	var iterator_1 = __webpack_require__(32);
	var Observable_1 = __webpack_require__(4);
	var observeOn_1 = __webpack_require__(34);
	var $$observable = __webpack_require__(18);
	var isArrayLike = (function (x) { return x && typeof x.length === 'number'; });
	/**
	 * We need this JSDoc comment for affecting ESDoc.
	 * @extends {Ignored}
	 * @hide true
	 */
	var FromObservable = (function (_super) {
	    __extends(FromObservable, _super);
	    function FromObservable(ish, scheduler) {
	        _super.call(this, null);
	        this.ish = ish;
	        this.scheduler = scheduler;
	    }
	    /**
	     * Creates an Observable from an Array, an array-like object, a Promise, an
	     * iterable object, or an Observable-like object.
	     *
	     * <span class="informal">Converts almost anything to an Observable.</span>
	     *
	     * <img src="./img/from.png" width="100%">
	     *
	     * Convert various other objects and data types into Observables. `from`
	     * converts a Promise or an array-like or an
	     * [iterable](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#iterable)
	     * object into an Observable that emits the items in that promise or array or
	     * iterable. A String, in this context, is treated as an array of characters.
	     * Observable-like objects (contains a function named with the ES2015 Symbol
	     * for Observable) can also be converted through this operator.
	     *
	     * @example <caption>Converts an array to an Observable</caption>
	     * var array = [10, 20, 30];
	     * var result = Rx.Observable.from(array);
	     * result.subscribe(x => console.log(x));
	     *
	     * @example <caption>Convert an infinite iterable (from a generator) to an Observable</caption>
	     * function* generateDoubles(seed) {
	     *   var i = seed;
	     *   while (true) {
	     *     yield i;
	     *     i = 2 * i; // double it
	     *   }
	     * }
	     *
	     * var iterator = generateDoubles(3);
	     * var result = Rx.Observable.from(iterator).take(10);
	     * result.subscribe(x => console.log(x));
	     *
	     * @see {@link create}
	     * @see {@link fromEvent}
	     * @see {@link fromEventPattern}
	     * @see {@link fromPromise}
	     *
	     * @param {ObservableInput<T>} ish A subscribable object, a Promise, an
	     * Observable-like, an Array, an iterable or an array-like object to be
	     * converted.
	     * @param {function(x: any, i: number): T} [mapFn] A "map" function to call
	     * when converting array-like objects, where `x` is a value from the
	     * array-like and `i` is the index of that value in the sequence.
	     * @param {any} [thisArg] The context object to use when calling the `mapFn`,
	     * if provided.
	     * @param {Scheduler} [scheduler] The scheduler on which to schedule the
	     * emissions of values.
	     * @return {Observable<T>} The Observable whose values are originally from the
	     * input object that was converted.
	     * @static true
	     * @name from
	     * @owner Observable
	     */
	    FromObservable.create = function (ish, mapFnOrScheduler, thisArg, lastScheduler) {
	        var scheduler = null;
	        var mapFn = null;
	        if (isFunction_1.isFunction(mapFnOrScheduler)) {
	            scheduler = lastScheduler || null;
	            mapFn = mapFnOrScheduler;
	        }
	        else if (isScheduler_1.isScheduler(scheduler)) {
	            scheduler = mapFnOrScheduler;
	        }
	        if (ish != null) {
	            if (typeof ish[$$observable] === 'function') {
	                if (ish instanceof Observable_1.Observable && !scheduler) {
	                    return ish;
	                }
	                return new FromObservable(ish, scheduler);
	            }
	            else if (isArray_1.isArray(ish)) {
	                return new ArrayObservable_1.ArrayObservable(ish, scheduler);
	            }
	            else if (isPromise_1.isPromise(ish)) {
	                return new PromiseObservable_1.PromiseObservable(ish, scheduler);
	            }
	            else if (typeof ish[iterator_1.$$iterator] === 'function' || typeof ish === 'string') {
	                return new IteratorObservable_1.IteratorObservable(ish, null, null, scheduler);
	            }
	            else if (isArrayLike(ish)) {
	                return new ArrayLikeObservable_1.ArrayLikeObservable(ish, mapFn, thisArg, scheduler);
	            }
	        }
	        throw new TypeError((ish !== null && typeof ish || ish) + ' is not observable');
	    };
	    FromObservable.prototype._subscribe = function (subscriber) {
	        var ish = this.ish;
	        var scheduler = this.scheduler;
	        if (scheduler == null) {
	            return ish[$$observable]().subscribe(subscriber);
	        }
	        else {
	            return ish[$$observable]().subscribe(new observeOn_1.ObserveOnSubscriber(subscriber, scheduler, 0));
	        }
	    };
	    return FromObservable;
	}(Observable_1.Observable));
	exports.FromObservable = FromObservable;
	//# sourceMappingURL=FromObservable.js.map

/***/ },
/* 29 */
/***/ function(module, exports) {

	"use strict";
	function isPromise(value) {
	    return value && typeof value.subscribe !== 'function' && typeof value.then === 'function';
	}
	exports.isPromise = isPromise;
	//# sourceMappingURL=isPromise.js.map

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var root_1 = __webpack_require__(5);
	var Observable_1 = __webpack_require__(4);
	/**
	 * We need this JSDoc comment for affecting ESDoc.
	 * @extends {Ignored}
	 * @hide true
	 */
	var PromiseObservable = (function (_super) {
	    __extends(PromiseObservable, _super);
	    function PromiseObservable(promise, scheduler) {
	        if (scheduler === void 0) { scheduler = null; }
	        _super.call(this);
	        this.promise = promise;
	        this.scheduler = scheduler;
	    }
	    /**
	     * Converts a Promise to an Observable.
	     *
	     * <span class="informal">Returns an Observable that just emits the Promise's
	     * resolved value, then completes.</span>
	     *
	     * Converts an ES2015 Promise or a Promises/A+ spec compliant Promise to an
	     * Observable. If the Promise resolves with a value, the output Observable
	     * emits that resolved value as a `next`, and then completes. If the Promise
	     * is rejected, then the output Observable emits the corresponding Error.
	     *
	     * @example <caption>Convert the Promise returned by Fetch to an Observable</caption>
	     * var result = Rx.Observable.fromPromise(fetch('http://myserver.com/'));
	     * result.subscribe(x => console.log(x), e => console.error(e));
	     *
	     * @see {@link bindCallback}
	     * @see {@link from}
	     *
	     * @param {Promise<T>} promise The promise to be converted.
	     * @param {Scheduler} [scheduler] An optional Scheduler to use for scheduling
	     * the delivery of the resolved value (or the rejection).
	     * @return {Observable<T>} An Observable which wraps the Promise.
	     * @static true
	     * @name fromPromise
	     * @owner Observable
	     */
	    PromiseObservable.create = function (promise, scheduler) {
	        if (scheduler === void 0) { scheduler = null; }
	        return new PromiseObservable(promise, scheduler);
	    };
	    PromiseObservable.prototype._subscribe = function (subscriber) {
	        var _this = this;
	        var promise = this.promise;
	        var scheduler = this.scheduler;
	        if (scheduler == null) {
	            if (this._isScalar) {
	                if (!subscriber.isUnsubscribed) {
	                    subscriber.next(this.value);
	                    subscriber.complete();
	                }
	            }
	            else {
	                promise.then(function (value) {
	                    _this.value = value;
	                    _this._isScalar = true;
	                    if (!subscriber.isUnsubscribed) {
	                        subscriber.next(value);
	                        subscriber.complete();
	                    }
	                }, function (err) {
	                    if (!subscriber.isUnsubscribed) {
	                        subscriber.error(err);
	                    }
	                })
	                    .then(null, function (err) {
	                    // escape the promise trap, throw unhandled errors
	                    root_1.root.setTimeout(function () { throw err; });
	                });
	            }
	        }
	        else {
	            if (this._isScalar) {
	                if (!subscriber.isUnsubscribed) {
	                    return scheduler.schedule(dispatchNext, 0, { value: this.value, subscriber: subscriber });
	                }
	            }
	            else {
	                promise.then(function (value) {
	                    _this.value = value;
	                    _this._isScalar = true;
	                    if (!subscriber.isUnsubscribed) {
	                        subscriber.add(scheduler.schedule(dispatchNext, 0, { value: value, subscriber: subscriber }));
	                    }
	                }, function (err) {
	                    if (!subscriber.isUnsubscribed) {
	                        subscriber.add(scheduler.schedule(dispatchError, 0, { err: err, subscriber: subscriber }));
	                    }
	                })
	                    .then(null, function (err) {
	                    // escape the promise trap, throw unhandled errors
	                    root_1.root.setTimeout(function () { throw err; });
	                });
	            }
	        }
	    };
	    return PromiseObservable;
	}(Observable_1.Observable));
	exports.PromiseObservable = PromiseObservable;
	function dispatchNext(arg) {
	    var value = arg.value, subscriber = arg.subscriber;
	    if (!subscriber.isUnsubscribed) {
	        subscriber.next(value);
	        subscriber.complete();
	    }
	}
	function dispatchError(arg) {
	    var err = arg.err, subscriber = arg.subscriber;
	    if (!subscriber.isUnsubscribed) {
	        subscriber.error(err);
	    }
	}
	//# sourceMappingURL=PromiseObservable.js.map

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var root_1 = __webpack_require__(5);
	var isObject_1 = __webpack_require__(12);
	var tryCatch_1 = __webpack_require__(13);
	var Observable_1 = __webpack_require__(4);
	var isFunction_1 = __webpack_require__(9);
	var iterator_1 = __webpack_require__(32);
	var errorObject_1 = __webpack_require__(14);
	/**
	 * We need this JSDoc comment for affecting ESDoc.
	 * @extends {Ignored}
	 * @hide true
	 */
	var IteratorObservable = (function (_super) {
	    __extends(IteratorObservable, _super);
	    function IteratorObservable(iterator, project, thisArg, scheduler) {
	        _super.call(this);
	        if (iterator == null) {
	            throw new Error('iterator cannot be null.');
	        }
	        if (isObject_1.isObject(project)) {
	            this.thisArg = project;
	            this.scheduler = thisArg;
	        }
	        else if (isFunction_1.isFunction(project)) {
	            this.project = project;
	            this.thisArg = thisArg;
	            this.scheduler = scheduler;
	        }
	        else if (project != null) {
	            throw new Error('When provided, `project` must be a function.');
	        }
	        this.iterator = getIterator(iterator);
	    }
	    IteratorObservable.create = function (iterator, project, thisArg, scheduler) {
	        return new IteratorObservable(iterator, project, thisArg, scheduler);
	    };
	    IteratorObservable.dispatch = function (state) {
	        var index = state.index, hasError = state.hasError, thisArg = state.thisArg, project = state.project, iterator = state.iterator, subscriber = state.subscriber;
	        if (hasError) {
	            subscriber.error(state.error);
	            return;
	        }
	        var result = iterator.next();
	        if (result.done) {
	            subscriber.complete();
	            return;
	        }
	        if (project) {
	            result = tryCatch_1.tryCatch(project).call(thisArg, result.value, index);
	            if (result === errorObject_1.errorObject) {
	                state.error = errorObject_1.errorObject.e;
	                state.hasError = true;
	            }
	            else {
	                subscriber.next(result);
	                state.index = index + 1;
	            }
	        }
	        else {
	            subscriber.next(result.value);
	            state.index = index + 1;
	        }
	        if (subscriber.isUnsubscribed) {
	            return;
	        }
	        this.schedule(state);
	    };
	    IteratorObservable.prototype._subscribe = function (subscriber) {
	        var index = 0;
	        var _a = this, iterator = _a.iterator, project = _a.project, thisArg = _a.thisArg, scheduler = _a.scheduler;
	        if (scheduler) {
	            return scheduler.schedule(IteratorObservable.dispatch, 0, {
	                index: index, thisArg: thisArg, project: project, iterator: iterator, subscriber: subscriber
	            });
	        }
	        else {
	            do {
	                var result = iterator.next();
	                if (result.done) {
	                    subscriber.complete();
	                    break;
	                }
	                else if (project) {
	                    result = tryCatch_1.tryCatch(project).call(thisArg, result.value, index++);
	                    if (result === errorObject_1.errorObject) {
	                        subscriber.error(errorObject_1.errorObject.e);
	                        break;
	                    }
	                    subscriber.next(result);
	                }
	                else {
	                    subscriber.next(result.value);
	                }
	                if (subscriber.isUnsubscribed) {
	                    break;
	                }
	            } while (true);
	        }
	    };
	    return IteratorObservable;
	}(Observable_1.Observable));
	exports.IteratorObservable = IteratorObservable;
	var StringIterator = (function () {
	    function StringIterator(str, idx, len) {
	        if (idx === void 0) { idx = 0; }
	        if (len === void 0) { len = str.length; }
	        this.str = str;
	        this.idx = idx;
	        this.len = len;
	    }
	    StringIterator.prototype[iterator_1.$$iterator] = function () { return (this); };
	    StringIterator.prototype.next = function () {
	        return this.idx < this.len ? {
	            done: false,
	            value: this.str.charAt(this.idx++)
	        } : {
	            done: true,
	            value: undefined
	        };
	    };
	    return StringIterator;
	}());
	var ArrayIterator = (function () {
	    function ArrayIterator(arr, idx, len) {
	        if (idx === void 0) { idx = 0; }
	        if (len === void 0) { len = toLength(arr); }
	        this.arr = arr;
	        this.idx = idx;
	        this.len = len;
	    }
	    ArrayIterator.prototype[iterator_1.$$iterator] = function () { return this; };
	    ArrayIterator.prototype.next = function () {
	        return this.idx < this.len ? {
	            done: false,
	            value: this.arr[this.idx++]
	        } : {
	            done: true,
	            value: undefined
	        };
	    };
	    return ArrayIterator;
	}());
	function getIterator(obj) {
	    var i = obj[iterator_1.$$iterator];
	    if (!i && typeof obj === 'string') {
	        return new StringIterator(obj);
	    }
	    if (!i && obj.length !== undefined) {
	        return new ArrayIterator(obj);
	    }
	    if (!i) {
	        throw new TypeError('Object is not iterable');
	    }
	    return obj[iterator_1.$$iterator]();
	}
	var maxSafeInteger = Math.pow(2, 53) - 1;
	function toLength(o) {
	    var len = +o.length;
	    if (isNaN(len)) {
	        return 0;
	    }
	    if (len === 0 || !numberIsFinite(len)) {
	        return len;
	    }
	    len = sign(len) * Math.floor(Math.abs(len));
	    if (len <= 0) {
	        return 0;
	    }
	    if (len > maxSafeInteger) {
	        return maxSafeInteger;
	    }
	    return len;
	}
	function numberIsFinite(value) {
	    return typeof value === 'number' && root_1.root.isFinite(value);
	}
	function sign(value) {
	    var valueAsNumber = +value;
	    if (valueAsNumber === 0) {
	        return valueAsNumber;
	    }
	    if (isNaN(valueAsNumber)) {
	        return valueAsNumber;
	    }
	    return valueAsNumber < 0 ? -1 : 1;
	}
	//# sourceMappingURL=IteratorObservable.js.map

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var root_1 = __webpack_require__(5);
	var Symbol = root_1.root.Symbol;
	if (typeof Symbol === 'function') {
	    if (Symbol.iterator) {
	        exports.$$iterator = Symbol.iterator;
	    }
	    else if (typeof Symbol.for === 'function') {
	        exports.$$iterator = Symbol.for('iterator');
	    }
	}
	else {
	    if (root_1.root.Set && typeof new root_1.root.Set()['@@iterator'] === 'function') {
	        // Bug for mozilla version
	        exports.$$iterator = '@@iterator';
	    }
	    else if (root_1.root.Map) {
	        // es6-shim specific logic
	        var keys = Object.getOwnPropertyNames(root_1.root.Map.prototype);
	        for (var i = 0; i < keys.length; ++i) {
	            var key = keys[i];
	            if (key !== 'entries' && key !== 'size' && root_1.root.Map.prototype[key] === root_1.root.Map.prototype['entries']) {
	                exports.$$iterator = key;
	                break;
	            }
	        }
	    }
	    else {
	        exports.$$iterator = '@@iterator';
	    }
	}
	//# sourceMappingURL=iterator.js.map

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Observable_1 = __webpack_require__(4);
	var ScalarObservable_1 = __webpack_require__(23);
	var EmptyObservable_1 = __webpack_require__(24);
	/**
	 * We need this JSDoc comment for affecting ESDoc.
	 * @extends {Ignored}
	 * @hide true
	 */
	var ArrayLikeObservable = (function (_super) {
	    __extends(ArrayLikeObservable, _super);
	    function ArrayLikeObservable(arrayLike, mapFn, thisArg, scheduler) {
	        _super.call(this);
	        this.arrayLike = arrayLike;
	        this.scheduler = scheduler;
	        if (!mapFn && !scheduler && arrayLike.length === 1) {
	            this._isScalar = true;
	            this.value = arrayLike[0];
	        }
	        if (mapFn) {
	            this.mapFn = mapFn.bind(thisArg);
	        }
	    }
	    ArrayLikeObservable.create = function (arrayLike, mapFn, thisArg, scheduler) {
	        var length = arrayLike.length;
	        if (length === 0) {
	            return new EmptyObservable_1.EmptyObservable();
	        }
	        else if (length === 1 && !mapFn) {
	            return new ScalarObservable_1.ScalarObservable(arrayLike[0], scheduler);
	        }
	        else {
	            return new ArrayLikeObservable(arrayLike, mapFn, thisArg, scheduler);
	        }
	    };
	    ArrayLikeObservable.dispatch = function (state) {
	        var arrayLike = state.arrayLike, index = state.index, length = state.length, mapFn = state.mapFn, subscriber = state.subscriber;
	        if (subscriber.isUnsubscribed) {
	            return;
	        }
	        if (index >= length) {
	            subscriber.complete();
	            return;
	        }
	        var result = mapFn ? mapFn(arrayLike[index], index) : arrayLike[index];
	        subscriber.next(result);
	        state.index = index + 1;
	        this.schedule(state);
	    };
	    ArrayLikeObservable.prototype._subscribe = function (subscriber) {
	        var index = 0;
	        var _a = this, arrayLike = _a.arrayLike, mapFn = _a.mapFn, scheduler = _a.scheduler;
	        var length = arrayLike.length;
	        if (scheduler) {
	            return scheduler.schedule(ArrayLikeObservable.dispatch, 0, {
	                arrayLike: arrayLike, index: index, length: length, mapFn: mapFn, subscriber: subscriber
	            });
	        }
	        else {
	            for (var i = 0; i < length && !subscriber.isUnsubscribed; i++) {
	                var result = mapFn ? mapFn(arrayLike[i], i) : arrayLike[i];
	                subscriber.next(result);
	            }
	            subscriber.complete();
	        }
	    };
	    return ArrayLikeObservable;
	}(Observable_1.Observable));
	exports.ArrayLikeObservable = ArrayLikeObservable;
	//# sourceMappingURL=ArrayLikeObservable.js.map

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Subscriber_1 = __webpack_require__(8);
	var Notification_1 = __webpack_require__(35);
	/**
	 * @see {@link Notification}
	 *
	 * @param scheduler
	 * @param delay
	 * @return {Observable<R>|WebSocketSubject<T>|Observable<T>}
	 * @method observeOn
	 * @owner Observable
	 */
	function observeOn(scheduler, delay) {
	    if (delay === void 0) { delay = 0; }
	    return this.lift(new ObserveOnOperator(scheduler, delay));
	}
	exports.observeOn = observeOn;
	var ObserveOnOperator = (function () {
	    function ObserveOnOperator(scheduler, delay) {
	        if (delay === void 0) { delay = 0; }
	        this.scheduler = scheduler;
	        this.delay = delay;
	    }
	    ObserveOnOperator.prototype.call = function (subscriber, source) {
	        return source._subscribe(new ObserveOnSubscriber(subscriber, this.scheduler, this.delay));
	    };
	    return ObserveOnOperator;
	}());
	exports.ObserveOnOperator = ObserveOnOperator;
	/**
	 * We need this JSDoc comment for affecting ESDoc.
	 * @ignore
	 * @extends {Ignored}
	 */
	var ObserveOnSubscriber = (function (_super) {
	    __extends(ObserveOnSubscriber, _super);
	    function ObserveOnSubscriber(destination, scheduler, delay) {
	        if (delay === void 0) { delay = 0; }
	        _super.call(this, destination);
	        this.scheduler = scheduler;
	        this.delay = delay;
	    }
	    ObserveOnSubscriber.dispatch = function (arg) {
	        var notification = arg.notification, destination = arg.destination;
	        notification.observe(destination);
	    };
	    ObserveOnSubscriber.prototype.scheduleMessage = function (notification) {
	        this.add(this.scheduler.schedule(ObserveOnSubscriber.dispatch, this.delay, new ObserveOnMessage(notification, this.destination)));
	    };
	    ObserveOnSubscriber.prototype._next = function (value) {
	        this.scheduleMessage(Notification_1.Notification.createNext(value));
	    };
	    ObserveOnSubscriber.prototype._error = function (err) {
	        this.scheduleMessage(Notification_1.Notification.createError(err));
	    };
	    ObserveOnSubscriber.prototype._complete = function () {
	        this.scheduleMessage(Notification_1.Notification.createComplete());
	    };
	    return ObserveOnSubscriber;
	}(Subscriber_1.Subscriber));
	exports.ObserveOnSubscriber = ObserveOnSubscriber;
	var ObserveOnMessage = (function () {
	    function ObserveOnMessage(notification, destination) {
	        this.notification = notification;
	        this.destination = destination;
	    }
	    return ObserveOnMessage;
	}());
	exports.ObserveOnMessage = ObserveOnMessage;
	//# sourceMappingURL=observeOn.js.map

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Observable_1 = __webpack_require__(4);
	/**
	 * Represents a push-based event or value that an {@link Observable} can emit.
	 * This class is particularly useful for operators that manage notifications,
	 * like {@link materialize}, {@link dematerialize}, {@link observeOn}, and
	 * others. Besides wrapping the actual delivered value, it also annotates it
	 * with metadata of, for instance, what type of push message it is (`next`,
	 * `error`, or `complete`).
	 *
	 * @see {@link materialize}
	 * @see {@link dematerialize}
	 * @see {@link observeOn}
	 *
	 * @class Notification<T>
	 */
	var Notification = (function () {
	    function Notification(kind, value, exception) {
	        this.kind = kind;
	        this.value = value;
	        this.exception = exception;
	        this.hasValue = kind === 'N';
	    }
	    /**
	     * Delivers to the given `observer` the value wrapped by this Notification.
	     * @param {Observer} observer
	     * @return
	     */
	    Notification.prototype.observe = function (observer) {
	        switch (this.kind) {
	            case 'N':
	                return observer.next && observer.next(this.value);
	            case 'E':
	                return observer.error && observer.error(this.exception);
	            case 'C':
	                return observer.complete && observer.complete();
	        }
	    };
	    /**
	     * Given some {@link Observer} callbacks, deliver the value represented by the
	     * current Notification to the correctly corresponding callback.
	     * @param {function(value: T): void} next An Observer `next` callback.
	     * @param {function(err: any): void} [error] An Observer `error` callback.
	     * @param {function(): void} [complete] An Observer `complete` callback.
	     * @return {any}
	     */
	    Notification.prototype.do = function (next, error, complete) {
	        var kind = this.kind;
	        switch (kind) {
	            case 'N':
	                return next && next(this.value);
	            case 'E':
	                return error && error(this.exception);
	            case 'C':
	                return complete && complete();
	        }
	    };
	    /**
	     * Takes an Observer or its individual callback functions, and calls `observe`
	     * or `do` methods accordingly.
	     * @param {Observer|function(value: T): void} nextOrObserver An Observer or
	     * the `next` callback.
	     * @param {function(err: any): void} [error] An Observer `error` callback.
	     * @param {function(): void} [complete] An Observer `complete` callback.
	     * @return {any}
	     */
	    Notification.prototype.accept = function (nextOrObserver, error, complete) {
	        if (nextOrObserver && typeof nextOrObserver.next === 'function') {
	            return this.observe(nextOrObserver);
	        }
	        else {
	            return this.do(nextOrObserver, error, complete);
	        }
	    };
	    /**
	     * Returns a simple Observable that just delivers the notification represented
	     * by this Notification instance.
	     * @return {any}
	     */
	    Notification.prototype.toObservable = function () {
	        var kind = this.kind;
	        switch (kind) {
	            case 'N':
	                return Observable_1.Observable.of(this.value);
	            case 'E':
	                return Observable_1.Observable.throw(this.exception);
	            case 'C':
	                return Observable_1.Observable.empty();
	        }
	    };
	    /**
	     * A shortcut to create a Notification instance of the type `next` from a
	     * given value.
	     * @param {T} value The `next` value.
	     * @return {Notification<T>} The "next" Notification representing the
	     * argument.
	     */
	    Notification.createNext = function (value) {
	        if (typeof value !== 'undefined') {
	            return new Notification('N', value);
	        }
	        return this.undefinedValueNotification;
	    };
	    /**
	     * A shortcut to create a Notification instance of the type `error` from a
	     * given error.
	     * @param {any} [err] The `error` exception.
	     * @return {Notification<T>} The "error" Notification representing the
	     * argument.
	     */
	    Notification.createError = function (err) {
	        return new Notification('E', undefined, err);
	    };
	    /**
	     * A shortcut to create a Notification instance of the type `complete`.
	     * @return {Notification<any>} The valueless "complete" Notification.
	     */
	    Notification.createComplete = function () {
	        return this.completeNotification;
	    };
	    Notification.completeNotification = new Notification('C');
	    Notification.undefinedValueNotification = new Notification('N', undefined);
	    return Notification;
	}());
	exports.Notification = Notification;
	//# sourceMappingURL=Notification.js.map

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Observable_1 = __webpack_require__(4);
	var catch_1 = __webpack_require__(37);
	Observable_1.Observable.prototype.catch = catch_1._catch;
	//# sourceMappingURL=catch.js.map

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Subscriber_1 = __webpack_require__(8);
	/**
	 * Catches errors on the observable to be handled by returning a new observable or throwing an error.
	 * @param {function} selector a function that takes as arguments `err`, which is the error, and `caught`, which
	 *  is the source observable, in case you'd like to "retry" that observable by returning it again. Whatever observable
	 *  is returned by the `selector` will be used to continue the observable chain.
	 * @return {Observable} an observable that originates from either the source or the observable returned by the
	 *  catch `selector` function.
	 * @method catch
	 * @owner Observable
	 */
	function _catch(selector) {
	    var operator = new CatchOperator(selector);
	    var caught = this.lift(operator);
	    return (operator.caught = caught);
	}
	exports._catch = _catch;
	var CatchOperator = (function () {
	    function CatchOperator(selector) {
	        this.selector = selector;
	    }
	    CatchOperator.prototype.call = function (subscriber, source) {
	        return source._subscribe(new CatchSubscriber(subscriber, this.selector, this.caught));
	    };
	    return CatchOperator;
	}());
	/**
	 * We need this JSDoc comment for affecting ESDoc.
	 * @ignore
	 * @extends {Ignored}
	 */
	var CatchSubscriber = (function (_super) {
	    __extends(CatchSubscriber, _super);
	    function CatchSubscriber(destination, selector, caught) {
	        _super.call(this, destination);
	        this.selector = selector;
	        this.caught = caught;
	    }
	    // NOTE: overriding `error` instead of `_error` because we don't want
	    // to have this flag this subscriber as `isStopped`.
	    CatchSubscriber.prototype.error = function (err) {
	        if (!this.isStopped) {
	            var result = void 0;
	            try {
	                result = this.selector(err, this.caught);
	            }
	            catch (err) {
	                this.destination.error(err);
	                return;
	            }
	            this._innerSub(result);
	        }
	    };
	    CatchSubscriber.prototype._innerSub = function (result) {
	        this.unsubscribe();
	        this.destination.remove(this);
	        result.subscribe(this.destination);
	    };
	    return CatchSubscriber;
	}(Subscriber_1.Subscriber));
	//# sourceMappingURL=catch.js.map

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Observable_1 = __webpack_require__(4);
	var concatMap_1 = __webpack_require__(39);
	Observable_1.Observable.prototype.concatMap = concatMap_1.concatMap;
	//# sourceMappingURL=concatMap.js.map

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var mergeMap_1 = __webpack_require__(40);
	/**
	 * Projects each source value to an Observable which is merged in the output
	 * Observable, in a serialized fashion waiting for each one to complete before
	 * merging the next.
	 *
	 * <span class="informal">Maps each value to an Observable, then flattens all of
	 * these inner Observables using {@link concatAll}.</span>
	 *
	 * <img src="./img/concatMap.png" width="100%">
	 *
	 * Returns an Observable that emits items based on applying a function that you
	 * supply to each item emitted by the source Observable, where that function
	 * returns an (so-called "inner") Observable. Each new inner Observable is
	 * concatenated with the previous inner Observable.
	 *
	 * __Warning:__ if source values arrive endlessly and faster than their
	 * corresponding inner Observables can complete, it will result in memory issues
	 * as inner Observables amass in an unbounded buffer waiting for their turn to
	 * be subscribed to.
	 *
	 * Note: `concatMap` is equivalent to `mergeMap` with concurrency parameter set
	 * to `1`.
	 *
	 * @example <caption>For each click event, tick every second from 0 to 3, with no concurrency</caption>
	 * var clicks = Rx.Observable.fromEvent(document, 'click');
	 * var result = clicks.concatMap(ev => Rx.Observable.interval(1000).take(4));
	 * result.subscribe(x => console.log(x));
	 *
	 * @see {@link concat}
	 * @see {@link concatAll}
	 * @see {@link concatMapTo}
	 * @see {@link exhaustMap}
	 * @see {@link mergeMap}
	 * @see {@link switchMap}
	 *
	 * @param {function(value: T, ?index: number): Observable} project A function
	 * that, when applied to an item emitted by the source Observable, returns an
	 * Observable.
	 * @param {function(outerValue: T, innerValue: I, outerIndex: number, innerIndex: number): any} [resultSelector]
	 * A function to produce the value on the output Observable based on the values
	 * and the indices of the source (outer) emission and the inner Observable
	 * emission. The arguments passed to this function are:
	 * - `outerValue`: the value that came from the source
	 * - `innerValue`: the value that came from the projected Observable
	 * - `outerIndex`: the "index" of the value that came from the source
	 * - `innerIndex`: the "index" of the value from the projected Observable
	 * @return {Observable} an observable of values merged from the projected
	 * Observables as they were subscribed to, one at a time. Optionally, these
	 * values may have been projected from a passed `projectResult` argument.
	 * @return {Observable} An Observable that emits the result of applying the
	 * projection function (and the optional `resultSelector`) to each item emitted
	 * by the source Observable and taking values from each projected inner
	 * Observable sequentially.
	 * @method concatMap
	 * @owner Observable
	 */
	function concatMap(project, resultSelector) {
	    return this.lift(new mergeMap_1.MergeMapOperator(project, resultSelector, 1));
	}
	exports.concatMap = concatMap;
	//# sourceMappingURL=concatMap.js.map

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var subscribeToResult_1 = __webpack_require__(41);
	var OuterSubscriber_1 = __webpack_require__(43);
	/**
	 * Projects each source value to an Observable which is merged in the output
	 * Observable.
	 *
	 * <span class="informal">Maps each value to an Observable, then flattens all of
	 * these inner Observables using {@link mergeAll}.</span>
	 *
	 * <img src="./img/mergeMap.png" width="100%">
	 *
	 * Returns an Observable that emits items based on applying a function that you
	 * supply to each item emitted by the source Observable, where that function
	 * returns an Observable, and then merging those resulting Observables and
	 * emitting the results of this merger.
	 *
	 * @example <caption>Map and flatten each letter to an Observable ticking every 1 second</caption>
	 * var letters = Rx.Observable.of('a', 'b', 'c');
	 * var result = letters.mergeMap(x =>
	 *   Rx.Observable.interval(1000).map(i => x+i)
	 * );
	 * result.subscribe(x => console.log(x));
	 *
	 * @see {@link concatMap}
	 * @see {@link exhaustMap}
	 * @see {@link merge}
	 * @see {@link mergeAll}
	 * @see {@link mergeMapTo}
	 * @see {@link mergeScan}
	 * @see {@link switchMap}
	 *
	 * @param {function(value: T, ?index: number): Observable} project A function
	 * that, when applied to an item emitted by the source Observable, returns an
	 * Observable.
	 * @param {function(outerValue: T, innerValue: I, outerIndex: number, innerIndex: number): any} [resultSelector]
	 * A function to produce the value on the output Observable based on the values
	 * and the indices of the source (outer) emission and the inner Observable
	 * emission. The arguments passed to this function are:
	 * - `outerValue`: the value that came from the source
	 * - `innerValue`: the value that came from the projected Observable
	 * - `outerIndex`: the "index" of the value that came from the source
	 * - `innerIndex`: the "index" of the value from the projected Observable
	 * @param {number} [concurrent=Number.POSITIVE_INFINITY] Maximum number of input
	 * Observables being subscribed to concurrently.
	 * @return {Observable} An Observable that emits the result of applying the
	 * projection function (and the optional `resultSelector`) to each item emitted
	 * by the source Observable and merging the results of the Observables obtained
	 * from this transformation.
	 * @method mergeMap
	 * @owner Observable
	 */
	function mergeMap(project, resultSelector, concurrent) {
	    if (concurrent === void 0) { concurrent = Number.POSITIVE_INFINITY; }
	    if (typeof resultSelector === 'number') {
	        concurrent = resultSelector;
	        resultSelector = null;
	    }
	    return this.lift(new MergeMapOperator(project, resultSelector, concurrent));
	}
	exports.mergeMap = mergeMap;
	var MergeMapOperator = (function () {
	    function MergeMapOperator(project, resultSelector, concurrent) {
	        if (concurrent === void 0) { concurrent = Number.POSITIVE_INFINITY; }
	        this.project = project;
	        this.resultSelector = resultSelector;
	        this.concurrent = concurrent;
	    }
	    MergeMapOperator.prototype.call = function (observer, source) {
	        return source._subscribe(new MergeMapSubscriber(observer, this.project, this.resultSelector, this.concurrent));
	    };
	    return MergeMapOperator;
	}());
	exports.MergeMapOperator = MergeMapOperator;
	/**
	 * We need this JSDoc comment for affecting ESDoc.
	 * @ignore
	 * @extends {Ignored}
	 */
	var MergeMapSubscriber = (function (_super) {
	    __extends(MergeMapSubscriber, _super);
	    function MergeMapSubscriber(destination, project, resultSelector, concurrent) {
	        if (concurrent === void 0) { concurrent = Number.POSITIVE_INFINITY; }
	        _super.call(this, destination);
	        this.project = project;
	        this.resultSelector = resultSelector;
	        this.concurrent = concurrent;
	        this.hasCompleted = false;
	        this.buffer = [];
	        this.active = 0;
	        this.index = 0;
	    }
	    MergeMapSubscriber.prototype._next = function (value) {
	        if (this.active < this.concurrent) {
	            this._tryNext(value);
	        }
	        else {
	            this.buffer.push(value);
	        }
	    };
	    MergeMapSubscriber.prototype._tryNext = function (value) {
	        var result;
	        var index = this.index++;
	        try {
	            result = this.project(value, index);
	        }
	        catch (err) {
	            this.destination.error(err);
	            return;
	        }
	        this.active++;
	        this._innerSub(result, value, index);
	    };
	    MergeMapSubscriber.prototype._innerSub = function (ish, value, index) {
	        this.add(subscribeToResult_1.subscribeToResult(this, ish, value, index));
	    };
	    MergeMapSubscriber.prototype._complete = function () {
	        this.hasCompleted = true;
	        if (this.active === 0 && this.buffer.length === 0) {
	            this.destination.complete();
	        }
	    };
	    MergeMapSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
	        if (this.resultSelector) {
	            this._notifyResultSelector(outerValue, innerValue, outerIndex, innerIndex);
	        }
	        else {
	            this.destination.next(innerValue);
	        }
	    };
	    MergeMapSubscriber.prototype._notifyResultSelector = function (outerValue, innerValue, outerIndex, innerIndex) {
	        var result;
	        try {
	            result = this.resultSelector(outerValue, innerValue, outerIndex, innerIndex);
	        }
	        catch (err) {
	            this.destination.error(err);
	            return;
	        }
	        this.destination.next(result);
	    };
	    MergeMapSubscriber.prototype.notifyComplete = function (innerSub) {
	        var buffer = this.buffer;
	        this.remove(innerSub);
	        this.active--;
	        if (buffer.length > 0) {
	            this._next(buffer.shift());
	        }
	        else if (this.active === 0 && this.hasCompleted) {
	            this.destination.complete();
	        }
	    };
	    return MergeMapSubscriber;
	}(OuterSubscriber_1.OuterSubscriber));
	exports.MergeMapSubscriber = MergeMapSubscriber;
	//# sourceMappingURL=mergeMap.js.map

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var root_1 = __webpack_require__(5);
	var isArray_1 = __webpack_require__(11);
	var isPromise_1 = __webpack_require__(29);
	var Observable_1 = __webpack_require__(4);
	var iterator_1 = __webpack_require__(32);
	var InnerSubscriber_1 = __webpack_require__(42);
	var $$observable = __webpack_require__(18);
	function subscribeToResult(outerSubscriber, result, outerValue, outerIndex) {
	    var destination = new InnerSubscriber_1.InnerSubscriber(outerSubscriber, outerValue, outerIndex);
	    if (destination.isUnsubscribed) {
	        return;
	    }
	    if (result instanceof Observable_1.Observable) {
	        if (result._isScalar) {
	            destination.next(result.value);
	            destination.complete();
	            return;
	        }
	        else {
	            return result.subscribe(destination);
	        }
	    }
	    if (isArray_1.isArray(result)) {
	        for (var i = 0, len = result.length; i < len && !destination.isUnsubscribed; i++) {
	            destination.next(result[i]);
	        }
	        if (!destination.isUnsubscribed) {
	            destination.complete();
	        }
	    }
	    else if (isPromise_1.isPromise(result)) {
	        result.then(function (value) {
	            if (!destination.isUnsubscribed) {
	                destination.next(value);
	                destination.complete();
	            }
	        }, function (err) { return destination.error(err); })
	            .then(null, function (err) {
	            // Escaping the Promise trap: globally throw unhandled errors
	            root_1.root.setTimeout(function () { throw err; });
	        });
	        return destination;
	    }
	    else if (typeof result[iterator_1.$$iterator] === 'function') {
	        for (var _i = 0, _a = result; _i < _a.length; _i++) {
	            var item = _a[_i];
	            destination.next(item);
	            if (destination.isUnsubscribed) {
	                break;
	            }
	        }
	        if (!destination.isUnsubscribed) {
	            destination.complete();
	        }
	    }
	    else if (typeof result[$$observable] === 'function') {
	        var obs = result[$$observable]();
	        if (typeof obs.subscribe !== 'function') {
	            destination.error('invalid observable');
	        }
	        else {
	            return obs.subscribe(new InnerSubscriber_1.InnerSubscriber(outerSubscriber, outerValue, outerIndex));
	        }
	    }
	    else {
	        destination.error(new TypeError('unknown type returned'));
	    }
	}
	exports.subscribeToResult = subscribeToResult;
	//# sourceMappingURL=subscribeToResult.js.map

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Subscriber_1 = __webpack_require__(8);
	/**
	 * We need this JSDoc comment for affecting ESDoc.
	 * @ignore
	 * @extends {Ignored}
	 */
	var InnerSubscriber = (function (_super) {
	    __extends(InnerSubscriber, _super);
	    function InnerSubscriber(parent, outerValue, outerIndex) {
	        _super.call(this);
	        this.parent = parent;
	        this.outerValue = outerValue;
	        this.outerIndex = outerIndex;
	        this.index = 0;
	    }
	    InnerSubscriber.prototype._next = function (value) {
	        this.parent.notifyNext(this.outerValue, value, this.outerIndex, this.index++, this);
	    };
	    InnerSubscriber.prototype._error = function (error) {
	        this.parent.notifyError(error, this);
	        this.unsubscribe();
	    };
	    InnerSubscriber.prototype._complete = function () {
	        this.parent.notifyComplete(this);
	        this.unsubscribe();
	    };
	    return InnerSubscriber;
	}(Subscriber_1.Subscriber));
	exports.InnerSubscriber = InnerSubscriber;
	//# sourceMappingURL=InnerSubscriber.js.map

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Subscriber_1 = __webpack_require__(8);
	/**
	 * We need this JSDoc comment for affecting ESDoc.
	 * @ignore
	 * @extends {Ignored}
	 */
	var OuterSubscriber = (function (_super) {
	    __extends(OuterSubscriber, _super);
	    function OuterSubscriber() {
	        _super.apply(this, arguments);
	    }
	    OuterSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
	        this.destination.next(innerValue);
	    };
	    OuterSubscriber.prototype.notifyError = function (error, innerSub) {
	        this.destination.error(error);
	    };
	    OuterSubscriber.prototype.notifyComplete = function (innerSub) {
	        this.destination.complete();
	    };
	    return OuterSubscriber;
	}(Subscriber_1.Subscriber));
	exports.OuterSubscriber = OuterSubscriber;
	//# sourceMappingURL=OuterSubscriber.js.map

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Observable_1 = __webpack_require__(4);
	var map_1 = __webpack_require__(45);
	Observable_1.Observable.prototype.map = map_1.map;
	//# sourceMappingURL=map.js.map

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Subscriber_1 = __webpack_require__(8);
	/**
	 * Applies a given `project` function to each value emitted by the source
	 * Observable, and emits the resulting values as an Observable.
	 *
	 * <span class="informal">Like [Array.prototype.map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map),
	 * it passes each source value through a transformation function to get
	 * corresponding output values.</span>
	 *
	 * <img src="./img/map.png" width="100%">
	 *
	 * Similar to the well known `Array.prototype.map` function, this operator
	 * applies a projection to each value and emits that projection in the output
	 * Observable.
	 *
	 * @example <caption>Map every every click to the clientX position of that click</caption>
	 * var clicks = Rx.Observable.fromEvent(document, 'click');
	 * var positions = clicks.map(ev => ev.clientX);
	 * positions.subscribe(x => console.log(x));
	 *
	 * @see {@link mapTo}
	 * @see {@link pluck}
	 *
	 * @param {function(value: T, index: number): R} project The function to apply
	 * to each `value` emitted by the source Observable. The `index` parameter is
	 * the number `i` for the i-th emission that has happened since the
	 * subscription, starting from the number `0`.
	 * @param {any} [thisArg] An optional argument to define what `this` is in the
	 * `project` function.
	 * @return {Observable<R>} An Observable that emits the values from the source
	 * Observable transformed by the given `project` function.
	 * @method map
	 * @owner Observable
	 */
	function map(project, thisArg) {
	    if (typeof project !== 'function') {
	        throw new TypeError('argument is not a function. Are you looking for `mapTo()`?');
	    }
	    return this.lift(new MapOperator(project, thisArg));
	}
	exports.map = map;
	var MapOperator = (function () {
	    function MapOperator(project, thisArg) {
	        this.project = project;
	        this.thisArg = thisArg;
	    }
	    MapOperator.prototype.call = function (subscriber, source) {
	        return source._subscribe(new MapSubscriber(subscriber, this.project, this.thisArg));
	    };
	    return MapOperator;
	}());
	/**
	 * We need this JSDoc comment for affecting ESDoc.
	 * @ignore
	 * @extends {Ignored}
	 */
	var MapSubscriber = (function (_super) {
	    __extends(MapSubscriber, _super);
	    function MapSubscriber(destination, project, thisArg) {
	        _super.call(this, destination);
	        this.project = project;
	        this.count = 0;
	        this.thisArg = thisArg || this;
	    }
	    // NOTE: This looks unoptimized, but it's actually purposefully NOT
	    // using try/catch optimizations.
	    MapSubscriber.prototype._next = function (value) {
	        var result;
	        try {
	            result = this.project.call(this.thisArg, value, this.count++);
	        }
	        catch (err) {
	            this.destination.error(err);
	            return;
	        }
	        this.destination.next(result);
	    };
	    return MapSubscriber;
	}(Subscriber_1.Subscriber));
	//# sourceMappingURL=map.js.map

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Observable_1 = __webpack_require__(4);
	var filter_1 = __webpack_require__(47);
	Observable_1.Observable.prototype.filter = filter_1.filter;
	//# sourceMappingURL=filter.js.map

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Subscriber_1 = __webpack_require__(8);
	/**
	 * Filter items emitted by the source Observable by only emitting those that
	 * satisfy a specified predicate.
	 *
	 * <span class="informal">Like
	 * [Array.prototype.filter()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter),
	 * it only emits a value from the source if it passes a criterion function.</span>
	 *
	 * <img src="./img/filter.png" width="100%">
	 *
	 * Similar to the well-known `Array.prototype.filter` method, this operator
	 * takes values from the source Observable, passes them through a `predicate`
	 * function and only emits those values that yielded `true`.
	 *
	 * @example <caption>Emit only click events whose target was a DIV element</caption>
	 * var clicks = Rx.Observable.fromEvent(document, 'click');
	 * var clicksOnDivs = clicks.filter(ev => ev.target.tagName === 'DIV');
	 * clicksOnDivs.subscribe(x => console.log(x));
	 *
	 * @see {@link distinct}
	 * @see {@link distinctKey}
	 * @see {@link distinctUntilChanged}
	 * @see {@link distinctUntilKeyChanged}
	 * @see {@link ignoreElements}
	 * @see {@link partition}
	 * @see {@link skip}
	 *
	 * @param {function(value: T, index: number): boolean} predicate A function that
	 * evaluates each value emitted by the source Observable. If it returns `true`,
	 * the value is emitted, if `false` the value is not passed to the output
	 * Observable. The `index` parameter is the number `i` for the i-th source
	 * emission that has happened since the subscription, starting from the number
	 * `0`.
	 * @param {any} [thisArg] An optional argument to determine the value of `this`
	 * in the `predicate` function.
	 * @return {Observable} An Observable of values from the source that were
	 * allowed by the `predicate` function.
	 * @method filter
	 * @owner Observable
	 */
	function filter(predicate, thisArg) {
	    return this.lift(new FilterOperator(predicate, thisArg));
	}
	exports.filter = filter;
	var FilterOperator = (function () {
	    function FilterOperator(predicate, thisArg) {
	        this.predicate = predicate;
	        this.thisArg = thisArg;
	    }
	    FilterOperator.prototype.call = function (subscriber, source) {
	        return source._subscribe(new FilterSubscriber(subscriber, this.predicate, this.thisArg));
	    };
	    return FilterOperator;
	}());
	/**
	 * We need this JSDoc comment for affecting ESDoc.
	 * @ignore
	 * @extends {Ignored}
	 */
	var FilterSubscriber = (function (_super) {
	    __extends(FilterSubscriber, _super);
	    function FilterSubscriber(destination, predicate, thisArg) {
	        _super.call(this, destination);
	        this.predicate = predicate;
	        this.thisArg = thisArg;
	        this.count = 0;
	        this.predicate = predicate;
	    }
	    // the try catch block below is left specifically for
	    // optimization and perf reasons. a tryCatcher is not necessary here.
	    FilterSubscriber.prototype._next = function (value) {
	        var result;
	        try {
	            result = this.predicate.call(this.thisArg, value, this.count++);
	        }
	        catch (err) {
	            this.destination.error(err);
	            return;
	        }
	        if (result) {
	            this.destination.next(value);
	        }
	    };
	    return FilterSubscriber;
	}(Subscriber_1.Subscriber));
	//# sourceMappingURL=filter.js.map

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Observable_1 = __webpack_require__(4);
	var defaultIfEmpty_1 = __webpack_require__(49);
	Observable_1.Observable.prototype.defaultIfEmpty = defaultIfEmpty_1.defaultIfEmpty;
	//# sourceMappingURL=defaultIfEmpty.js.map

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Subscriber_1 = __webpack_require__(8);
	/**
	 * Emits a given value if the source Observable completes without emitting any
	 * `next` value, otherwise mirrors the source Observable.
	 *
	 * <span class="informal">If the source Observable turns out to be empty, then
	 * this operator will emit a default value.</span>
	 *
	 * <img src="./img/defaultIfEmpty.png" width="100%">
	 *
	 * `defaultIfEmpty` emits the values emitted by the source Observable or a
	 * specified default value if the source Observable is empty (completes without
	 * having emitted any `next` value).
	 *
	 * @example <caption>If no clicks happen in 5 seconds, then emit "no clicks"</caption>
	 * var clicks = Rx.Observable.fromEvent(document, 'click');
	 * var clicksBeforeFive = clicks.takeUntil(Rx.Observable.interval(5000));
	 * var result = clicksBeforeFive.defaultIfEmpty('no clicks');
	 * result.subscribe(x => console.log(x));
	 *
	 * @see {@link empty}
	 * @see {@link last}
	 *
	 * @param {any} [defaultValue=null] The default value used if the source
	 * Observable is empty.
	 * @return {Observable} An Observable that emits either the specified
	 * `defaultValue` if the source Observable emits no items, or the values emitted
	 * by the source Observable.
	 * @method defaultIfEmpty
	 * @owner Observable
	 */
	function defaultIfEmpty(defaultValue) {
	    if (defaultValue === void 0) { defaultValue = null; }
	    return this.lift(new DefaultIfEmptyOperator(defaultValue));
	}
	exports.defaultIfEmpty = defaultIfEmpty;
	var DefaultIfEmptyOperator = (function () {
	    function DefaultIfEmptyOperator(defaultValue) {
	        this.defaultValue = defaultValue;
	    }
	    DefaultIfEmptyOperator.prototype.call = function (subscriber, source) {
	        return source._subscribe(new DefaultIfEmptySubscriber(subscriber, this.defaultValue));
	    };
	    return DefaultIfEmptyOperator;
	}());
	/**
	 * We need this JSDoc comment for affecting ESDoc.
	 * @ignore
	 * @extends {Ignored}
	 */
	var DefaultIfEmptySubscriber = (function (_super) {
	    __extends(DefaultIfEmptySubscriber, _super);
	    function DefaultIfEmptySubscriber(destination, defaultValue) {
	        _super.call(this, destination);
	        this.defaultValue = defaultValue;
	        this.isEmpty = true;
	    }
	    DefaultIfEmptySubscriber.prototype._next = function (value) {
	        this.isEmpty = false;
	        this.destination.next(value);
	    };
	    DefaultIfEmptySubscriber.prototype._complete = function () {
	        if (this.isEmpty) {
	            this.destination.next(this.defaultValue);
	        }
	        this.destination.complete();
	    };
	    return DefaultIfEmptySubscriber;
	}(Subscriber_1.Subscriber));
	//# sourceMappingURL=defaultIfEmpty.js.map

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	exports.UserDataTerm = exports.Limit = exports.Order = exports.Below = exports.Above = exports.FindAll = exports.Find = exports.Collection = exports.TermBase = undefined;
	
	var _possibleConstructorReturn2 = __webpack_require__(51);
	
	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);
	
	var _inherits2 = __webpack_require__(120);
	
	var _inherits3 = _interopRequireDefault(_inherits2);
	
	var _typeof2 = __webpack_require__(52);
	
	var _typeof3 = _interopRequireDefault(_typeof2);
	
	var _classCallCheck2 = __webpack_require__(128);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	exports.applyChange = applyChange;
	
	var _Observable = __webpack_require__(4);
	
	__webpack_require__(129);
	
	__webpack_require__(131);
	
	__webpack_require__(144);
	
	__webpack_require__(46);
	
	__webpack_require__(44);
	
	__webpack_require__(146);
	
	__webpack_require__(148);
	
	var _snakeCase = __webpack_require__(151);
	
	var _snakeCase2 = _interopRequireDefault(_snakeCase);
	
	var _checkArgs = __webpack_require__(157);
	
	var _checkArgs2 = _interopRequireDefault(_checkArgs);
	
	var _validIndexValue = __webpack_require__(159);
	
	var _validIndexValue2 = _interopRequireDefault(_validIndexValue);
	
	var _serialization = __webpack_require__(160);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 @this TermBase
	
	 Validation check to throw an exception if a method is chained onto a
	 query that already has it. It belongs to TermBase, but we don't want
	 to pollute the objects with it (since it isn't useful to api users),
	 so it's dynamically bound with :: inside methods that use it.
	*/
	function checkIfLegalToChain(key) {
	  if (this._legalMethods.indexOf(key) === -1) {
	    throw new Error(key + ' cannot be called on the current query');
	  }
	  if ((0, _snakeCase2.default)(key) in this._query) {
	    throw new Error(key + ' has already been called on this query');
	  }
	}
	
	// Abstract base class for terms
	
	var TermBase = exports.TermBase = function () {
	  function TermBase(sendRequest, query, legalMethods) {
	    (0, _classCallCheck3.default)(this, TermBase);
	
	    this._sendRequest = sendRequest;
	    this._query = query;
	    this._legalMethods = legalMethods;
	  }
	  // Returns a sequence of the result set. Every time it changes the
	  // updated sequence will be emitted. If raw change objects are
	  // needed, pass the option 'rawChanges: true'. An observable is
	  // returned which will lazily emit the query when it is subscribed
	  // to
	
	
	  TermBase.prototype.watch = function watch() {
	    var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	
	    var _ref$rawChanges = _ref.rawChanges;
	    var rawChanges = _ref$rawChanges === undefined ? false : _ref$rawChanges;
	
	    var raw = this._sendRequest('subscribe', this._query);
	    if (rawChanges) {
	      return raw;
	    } else {
	      return makePresentable(raw, this._query);
	    }
	  };
	  // Grab a snapshot of the current query (non-changefeed). Emits an
	  // array with all results. An observable is returned which will
	  // lazily emit the query when subscribed to
	
	
	  TermBase.prototype.fetch = function fetch() {
	    var raw = this._sendRequest('query', this._query).map(function (val) {
	      delete val.$hz_v$;
	      return val;
	    });
	    if (this._query.find) {
	      return raw;
	    } else {
	      return raw.toArray();
	    }
	  };
	
	  TermBase.prototype.findAll = function findAll() {
	    for (var _len = arguments.length, fieldValues = Array(_len), _key = 0; _key < _len; _key++) {
	      fieldValues[_key] = arguments[_key];
	    }
	
	    checkIfLegalToChain.call(this, 'findAll');
	    (0, _checkArgs2.default)('findAll', arguments, { maxArgs: 100 });
	    return new FindAll(this._sendRequest, this._query, fieldValues);
	  };
	
	  TermBase.prototype.find = function find(idOrObject) {
	    checkIfLegalToChain.call(this, 'find');
	    (0, _checkArgs2.default)('find', arguments);
	    return new Find(this._sendRequest, this._query, idOrObject);
	  };
	
	  TermBase.prototype.order = function order(fields) {
	    var direction = arguments.length <= 1 || arguments[1] === undefined ? 'ascending' : arguments[1];
	
	    checkIfLegalToChain.call(this, 'order');
	    (0, _checkArgs2.default)('order', arguments, { minArgs: 1, maxArgs: 2 });
	    return new Order(this._sendRequest, this._query, fields, direction);
	  };
	
	  TermBase.prototype.above = function above(aboveSpec) {
	    var bound = arguments.length <= 1 || arguments[1] === undefined ? 'closed' : arguments[1];
	
	    checkIfLegalToChain.call(this, 'above');
	    (0, _checkArgs2.default)('above', arguments, { minArgs: 1, maxArgs: 2 });
	    return new Above(this._sendRequest, this._query, aboveSpec, bound);
	  };
	
	  TermBase.prototype.below = function below(belowSpec) {
	    var bound = arguments.length <= 1 || arguments[1] === undefined ? 'open' : arguments[1];
	
	    checkIfLegalToChain.call(this, 'below');
	    (0, _checkArgs2.default)('below', arguments, { minArgs: 1, maxArgs: 2 });
	    return new Below(this._sendRequest, this._query, belowSpec, bound);
	  };
	
	  TermBase.prototype.limit = function limit(size) {
	    checkIfLegalToChain.call(this, 'limit');
	    (0, _checkArgs2.default)('limit', arguments);
	    return new Limit(this._sendRequest, this._query, size);
	  };
	
	  return TermBase;
	}();
	
	// Turn a raw observable of server responses into user-presentable events
	//
	// `observable` is the base observable with full responses coming from
	//              the HorizonSocket
	// `query` is the value of `options` in the request
	
	
	function makePresentable(observable, query) {
	  // Whether the entire data structure is in each change
	  var pointQuery = Boolean(query.find);
	
	  if (pointQuery) {
	    var _ret = function () {
	      var hasEmitted = false;
	      var seedVal = null;
	      // Simplest case: just pass through new_val
	      return {
	        v: observable.filter(function (change) {
	          return !hasEmitted || change.type !== 'state';
	        }).scan(function (previous, change) {
	          hasEmitted = true;
	          if (change.new_val != null) {
	            delete change.new_val.$hz_v$;
	          }
	          if (change.old_val != null) {
	            delete change.old_val.$hz_v$;
	          }
	          if (change.state === 'synced') {
	            return previous;
	          } else {
	            return change.new_val;
	          }
	        }, seedVal)
	      };
	    }();
	
	    if ((typeof _ret === 'undefined' ? 'undefined' : (0, _typeof3.default)(_ret)) === "object") return _ret.v;
	  } else {
	    var _seedVal = { emitted: false, val: [] };
	    return observable.scan(function (state, change) {
	      if (change.new_val != null) {
	        delete change.new_val.$hz_v$;
	      }
	      if (change.old_val != null) {
	        delete change.old_val.$hz_v$;
	      }
	      if (change.state === 'synced') {
	        state.emitted = true;
	      }
	      state.val = applyChange(state.val.slice(), change);
	      return state;
	    }, _seedVal).filter(function (state) {
	      return state.emitted;
	    }).map(function (x) {
	      return x.val;
	    });
	  }
	}
	
	function applyChange(arr, change) {
	  switch (change.type) {
	    case 'remove':
	    case 'uninitial':
	      {
	        // Remove old values from the array
	        if (change.old_offset != null) {
	          arr.splice(change.old_offset, 1);
	        } else {
	          var index = arr.findIndex(function (x) {
	            return x.id === change.old_val.id;
	          });
	          arr.splice(index, 1);
	        }
	        break;
	      }
	    case 'add':
	    case 'initial':
	      {
	        // Add new values to the array
	        if (change.new_offset != null) {
	          // If we have an offset, put it in the correct location
	          arr.splice(change.new_offset, 0, change.new_val);
	        } else {
	          // otherwise for unordered results, push it on the end
	          arr.push(change.new_val);
	        }
	        break;
	      }
	    case 'change':
	      {
	        // Modify in place if a change is happening
	        if (change.old_offset != null) {
	          // Remove the old document from the results
	          arr.splice(change.old_offset, 1);
	        }
	        if (change.new_offset != null) {
	          // Splice in the new val if we have an offset
	          arr.splice(change.new_offset, 0, change.new_val);
	        } else {
	          // If we don't have an offset, find the old val and
	          // replace it with the new val
	          var _index = arr.findIndex(function (x) {
	            return x.id === change.old_val.id;
	          });
	          arr[_index] = change.new_val;
	        }
	        break;
	      }
	    case 'state':
	      {
	        // This gets hit if we have not emitted yet, and should
	        // result in an empty array being output.
	        break;
	      }
	    default:
	      throw new Error('unrecognized \'type\' field from server ' + JSON.stringify(change));
	  }
	  return arr;
	}
	
	/** @this Collection
	 Implements writeOps for the Collection class
	*/
	function writeOp(name, args, documents) {
	  (0, _checkArgs2.default)(name, args);
	  var isBatch = true;
	  var wrappedDocs = documents;
	  if (!Array.isArray(documents)) {
	    // Wrap in an array if we need to
	    wrappedDocs = [documents];
	    isBatch = false;
	  } else if (documents.length === 0) {
	    // Don't bother sending no-ops to the server
	    return _Observable.Observable.empty();
	  }
	  var options = Object.assign({}, this._query, { data: (0, _serialization.serialize)(wrappedDocs) });
	  var observable = this._sendRequest(name, options);
	  if (isBatch) {
	    // If this is a batch writeOp, each document may succeed or fail
	    // individually.
	    observable = observable.map(function (resp) {
	      return resp.error ? new Error(resp.error) : resp;
	    });
	  } else {
	    (function () {
	      // If this is a single writeOp, the entire operation should fail
	      // if any fails.
	      var _prevOb = observable;
	      observable = _Observable.Observable.create(function (subscriber) {
	        _prevOb.subscribe({
	          next: function next(resp) {
	            if (resp.error) {
	              // TODO: handle error ids when we get them
	              subscriber.error(new Error(resp.error));
	            } else {
	              subscriber.next(resp);
	            }
	          },
	          error: function error(err) {
	            subscriber.error(err);
	          },
	          complete: function complete() {
	            subscriber.complete();
	          }
	        });
	      });
	    })();
	  }
	  if (!this._lazyWrites) {
	    // Need to buffer response since this becomes a hot observable and
	    // when we subscribe matters
	    observable = observable.publishReplay().refCount();
	    observable.subscribe();
	  }
	  return observable;
	}
	
	var Collection = exports.Collection = function (_TermBase) {
	  (0, _inherits3.default)(Collection, _TermBase);
	
	  function Collection(sendRequest, collectionName, lazyWrites) {
	    (0, _classCallCheck3.default)(this, Collection);
	
	    var query = { collection: collectionName };
	    var legalMethods = ['find', 'findAll', 'justInitial', 'order', 'above', 'below', 'limit'];
	
	    var _this = (0, _possibleConstructorReturn3.default)(this, _TermBase.call(this, sendRequest, query, legalMethods));
	
	    _this._lazyWrites = lazyWrites;
	    return _this;
	  }
	
	  Collection.prototype.store = function store(documents) {
	    return writeOp.call(this, 'store', arguments, documents);
	  };
	
	  Collection.prototype.upsert = function upsert(documents) {
	    return writeOp.call(this, 'upsert', arguments, documents);
	  };
	
	  Collection.prototype.insert = function insert(documents) {
	    return writeOp.call(this, 'insert', arguments, documents);
	  };
	
	  Collection.prototype.replace = function replace(documents) {
	    return writeOp.call(this, 'replace', arguments, documents);
	  };
	
	  Collection.prototype.update = function update(documents) {
	    return writeOp.call(this, 'update', arguments, documents);
	  };
	
	  Collection.prototype.remove = function remove(documentOrId) {
	    var wrapped = (0, _validIndexValue2.default)(documentOrId) ? { id: documentOrId } : documentOrId;
	    return writeOp.call(this, 'remove', arguments, wrapped);
	  };
	
	  Collection.prototype.removeAll = function removeAll(documentsOrIds) {
	    if (!Array.isArray(documentsOrIds)) {
	      throw new Error('removeAll takes an array as an argument');
	    }
	    var wrapped = documentsOrIds.map(function (item) {
	      if ((0, _validIndexValue2.default)(item)) {
	        return { id: item };
	      } else {
	        return item;
	      }
	    });
	    return writeOp.call(this, 'removeAll', arguments, wrapped);
	  };
	
	  return Collection;
	}(TermBase);
	
	var Find = exports.Find = function (_TermBase2) {
	  (0, _inherits3.default)(Find, _TermBase2);
	
	  function Find(sendRequest, previousQuery, idOrObject) {
	    (0, _classCallCheck3.default)(this, Find);
	
	    var findObject = (0, _validIndexValue2.default)(idOrObject) ? { id: idOrObject } : idOrObject;
	    var query = Object.assign({}, previousQuery, { find: findObject });
	    return (0, _possibleConstructorReturn3.default)(this, _TermBase2.call(this, sendRequest, query, []));
	  }
	
	  return Find;
	}(TermBase);
	
	var FindAll = exports.FindAll = function (_TermBase3) {
	  (0, _inherits3.default)(FindAll, _TermBase3);
	
	  function FindAll(sendRequest, previousQuery, fieldValues) {
	    (0, _classCallCheck3.default)(this, FindAll);
	
	    var wrappedFields = fieldValues.map(function (item) {
	      return (0, _validIndexValue2.default)(item) ? { id: item } : item;
	    });
	    var options = { find_all: wrappedFields };
	    var findAllQuery = Object.assign({}, previousQuery, options);
	    var legalMethods = void 0;
	    if (wrappedFields.length === 1) {
	      legalMethods = ['order', 'above', 'below', 'limit'];
	    } else {
	      // The vararg version of findAll cannot have anything chained to it
	      legalMethods = [];
	    }
	    return (0, _possibleConstructorReturn3.default)(this, _TermBase3.call(this, sendRequest, findAllQuery, legalMethods));
	  }
	
	  return FindAll;
	}(TermBase);
	
	var Above = exports.Above = function (_TermBase4) {
	  (0, _inherits3.default)(Above, _TermBase4);
	
	  function Above(sendRequest, previousQuery, aboveSpec, bound) {
	    (0, _classCallCheck3.default)(this, Above);
	
	    var option = { above: [aboveSpec, bound] };
	    var query = Object.assign({}, previousQuery, option);
	    var legalMethods = ['findAll', 'order', 'below', 'limit'];
	    return (0, _possibleConstructorReturn3.default)(this, _TermBase4.call(this, sendRequest, query, legalMethods));
	  }
	
	  return Above;
	}(TermBase);
	
	var Below = exports.Below = function (_TermBase5) {
	  (0, _inherits3.default)(Below, _TermBase5);
	
	  function Below(sendRequest, previousQuery, belowSpec, bound) {
	    (0, _classCallCheck3.default)(this, Below);
	
	    var options = { below: [belowSpec, bound] };
	    var query = Object.assign({}, previousQuery, options);
	    var legalMethods = ['findAll', 'order', 'above', 'limit'];
	    return (0, _possibleConstructorReturn3.default)(this, _TermBase5.call(this, sendRequest, query, legalMethods));
	  }
	
	  return Below;
	}(TermBase);
	
	var Order = exports.Order = function (_TermBase6) {
	  (0, _inherits3.default)(Order, _TermBase6);
	
	  function Order(sendRequest, previousQuery, fields, direction) {
	    (0, _classCallCheck3.default)(this, Order);
	
	    var wrappedFields = Array.isArray(fields) ? fields : [fields];
	    var options = { order: [wrappedFields, direction] };
	    var query = Object.assign({}, previousQuery, options);
	    var legalMethods = ['findAll', 'above', 'below', 'limit'];
	    return (0, _possibleConstructorReturn3.default)(this, _TermBase6.call(this, sendRequest, query, legalMethods));
	  }
	
	  return Order;
	}(TermBase);
	
	var Limit = exports.Limit = function (_TermBase7) {
	  (0, _inherits3.default)(Limit, _TermBase7);
	
	  function Limit(sendRequest, previousQuery, size) {
	    (0, _classCallCheck3.default)(this, Limit);
	
	    var query = Object.assign({}, previousQuery, { limit: size });
	    // Nothing is legal to chain after .limit
	    return (0, _possibleConstructorReturn3.default)(this, _TermBase7.call(this, sendRequest, query, []));
	  }
	
	  return Limit;
	}(TermBase);
	
	var UserDataTerm = exports.UserDataTerm = function () {
	  function UserDataTerm(hz, handshake, socket) {
	    (0, _classCallCheck3.default)(this, UserDataTerm);
	
	    this._hz = hz;
	    this._before = _Observable.Observable.merge(socket.take(0), // just need to force connection
	    handshake // guarantee we get handshake even if we're already
	    // connected
	    );
	  }
	
	  UserDataTerm.prototype._query = function _query(userId) {
	    return this._hz('users').find(userId);
	  };
	
	  UserDataTerm.prototype.fetch = function fetch() {
	    var _this8 = this;
	
	    return this._before.concatMap(function (handshake) {
	      if (handshake.id === null) {
	        return _Observable.Observable.of({});
	      } else {
	        return _this8._query(handshake.id).fetch();
	      }
	    });
	  };
	
	  UserDataTerm.prototype.watch = function watch() {
	    var _this9 = this;
	
	    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	      args[_key2] = arguments[_key2];
	    }
	
	    return this._before.concatMap(function (handshake) {
	      if (handshake.id === null) {
	        return _Observable.Observable.of({});
	      } else {
	        var _query2;
	
	        return (_query2 = _this9._query(handshake.id)).watch.apply(_query2, args);
	      }
	    });
	  };
	
	  return UserDataTerm;
	}();
	//# sourceMappingURL=ast.js.map

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _typeof2 = __webpack_require__(52);
	
	var _typeof3 = _interopRequireDefault(_typeof2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = function (self, call) {
	  if (!self) {
	    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	  }
	
	  return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
	};

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _iterator = __webpack_require__(53);
	
	var _iterator2 = _interopRequireDefault(_iterator);
	
	var _symbol = __webpack_require__(104);
	
	var _symbol2 = _interopRequireDefault(_symbol);
	
	var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default ? "symbol" : typeof obj; };
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
	  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
	} : function (obj) {
	  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
	};

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(54), __esModule: true };

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(55);
	__webpack_require__(99);
	module.exports = __webpack_require__(103).f('iterator');

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $at  = __webpack_require__(56)(true);
	
	// 21.1.3.27 String.prototype[@@iterator]()
	__webpack_require__(59)(String, 'String', function(iterated){
	  this._t = String(iterated); // target
	  this._i = 0;                // next index
	// 21.1.5.2.1 %StringIteratorPrototype%.next()
	}, function(){
	  var O     = this._t
	    , index = this._i
	    , point;
	  if(index >= O.length)return {value: undefined, done: true};
	  point = $at(O, index);
	  this._i += point.length;
	  return {value: point, done: false};
	});

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(57)
	  , defined   = __webpack_require__(58);
	// true  -> String#at
	// false -> String#codePointAt
	module.exports = function(TO_STRING){
	  return function(that, pos){
	    var s = String(defined(that))
	      , i = toInteger(pos)
	      , l = s.length
	      , a, b;
	    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
	    a = s.charCodeAt(i);
	    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
	      ? TO_STRING ? s.charAt(i) : a
	      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
	  };
	};

/***/ },
/* 57 */
/***/ function(module, exports) {

	// 7.1.4 ToInteger
	var ceil  = Math.ceil
	  , floor = Math.floor;
	module.exports = function(it){
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};

/***/ },
/* 58 */
/***/ function(module, exports) {

	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function(it){
	  if(it == undefined)throw TypeError("Can't call method on  " + it);
	  return it;
	};

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var LIBRARY        = __webpack_require__(60)
	  , $export        = __webpack_require__(61)
	  , redefine       = __webpack_require__(76)
	  , hide           = __webpack_require__(66)
	  , has            = __webpack_require__(77)
	  , Iterators      = __webpack_require__(78)
	  , $iterCreate    = __webpack_require__(79)
	  , setToStringTag = __webpack_require__(95)
	  , getPrototypeOf = __webpack_require__(97)
	  , ITERATOR       = __webpack_require__(96)('iterator')
	  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
	  , FF_ITERATOR    = '@@iterator'
	  , KEYS           = 'keys'
	  , VALUES         = 'values';
	
	var returnThis = function(){ return this; };
	
	module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
	  $iterCreate(Constructor, NAME, next);
	  var getMethod = function(kind){
	    if(!BUGGY && kind in proto)return proto[kind];
	    switch(kind){
	      case KEYS: return function keys(){ return new Constructor(this, kind); };
	      case VALUES: return function values(){ return new Constructor(this, kind); };
	    } return function entries(){ return new Constructor(this, kind); };
	  };
	  var TAG        = NAME + ' Iterator'
	    , DEF_VALUES = DEFAULT == VALUES
	    , VALUES_BUG = false
	    , proto      = Base.prototype
	    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
	    , $default   = $native || getMethod(DEFAULT)
	    , $entries   = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined
	    , $anyNative = NAME == 'Array' ? proto.entries || $native : $native
	    , methods, key, IteratorPrototype;
	  // Fix native
	  if($anyNative){
	    IteratorPrototype = getPrototypeOf($anyNative.call(new Base));
	    if(IteratorPrototype !== Object.prototype){
	      // Set @@toStringTag to native iterators
	      setToStringTag(IteratorPrototype, TAG, true);
	      // fix for some old engines
	      if(!LIBRARY && !has(IteratorPrototype, ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
	    }
	  }
	  // fix Array#{values, @@iterator}.name in V8 / FF
	  if(DEF_VALUES && $native && $native.name !== VALUES){
	    VALUES_BUG = true;
	    $default = function values(){ return $native.call(this); };
	  }
	  // Define iterator
	  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
	    hide(proto, ITERATOR, $default);
	  }
	  // Plug for library
	  Iterators[NAME] = $default;
	  Iterators[TAG]  = returnThis;
	  if(DEFAULT){
	    methods = {
	      values:  DEF_VALUES ? $default : getMethod(VALUES),
	      keys:    IS_SET     ? $default : getMethod(KEYS),
	      entries: $entries
	    };
	    if(FORCED)for(key in methods){
	      if(!(key in proto))redefine(proto, key, methods[key]);
	    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
	  }
	  return methods;
	};

/***/ },
/* 60 */
/***/ function(module, exports) {

	module.exports = true;

/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(62)
	  , core      = __webpack_require__(63)
	  , ctx       = __webpack_require__(64)
	  , hide      = __webpack_require__(66)
	  , PROTOTYPE = 'prototype';
	
	var $export = function(type, name, source){
	  var IS_FORCED = type & $export.F
	    , IS_GLOBAL = type & $export.G
	    , IS_STATIC = type & $export.S
	    , IS_PROTO  = type & $export.P
	    , IS_BIND   = type & $export.B
	    , IS_WRAP   = type & $export.W
	    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
	    , expProto  = exports[PROTOTYPE]
	    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
	    , key, own, out;
	  if(IS_GLOBAL)source = name;
	  for(key in source){
	    // contains in native
	    own = !IS_FORCED && target && target[key] !== undefined;
	    if(own && key in exports)continue;
	    // export native or passed
	    out = own ? target[key] : source[key];
	    // prevent global pollution for namespaces
	    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
	    // bind timers to global for call from export context
	    : IS_BIND && own ? ctx(out, global)
	    // wrap global constructors for prevent change them in library
	    : IS_WRAP && target[key] == out ? (function(C){
	      var F = function(a, b, c){
	        if(this instanceof C){
	          switch(arguments.length){
	            case 0: return new C;
	            case 1: return new C(a);
	            case 2: return new C(a, b);
	          } return new C(a, b, c);
	        } return C.apply(this, arguments);
	      };
	      F[PROTOTYPE] = C[PROTOTYPE];
	      return F;
	    // make static versions for prototype methods
	    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
	    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
	    if(IS_PROTO){
	      (exports.virtual || (exports.virtual = {}))[key] = out;
	      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
	      if(type & $export.R && expProto && !expProto[key])hide(expProto, key, out);
	    }
	  }
	};
	// type bitmap
	$export.F = 1;   // forced
	$export.G = 2;   // global
	$export.S = 4;   // static
	$export.P = 8;   // proto
	$export.B = 16;  // bind
	$export.W = 32;  // wrap
	$export.U = 64;  // safe
	$export.R = 128; // real proto method for `library` 
	module.exports = $export;

/***/ },
/* 62 */
/***/ function(module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
	if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ },
/* 63 */
/***/ function(module, exports) {

	var core = module.exports = {version: '2.4.0'};
	if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	// optional / simple context binding
	var aFunction = __webpack_require__(65);
	module.exports = function(fn, that, length){
	  aFunction(fn);
	  if(that === undefined)return fn;
	  switch(length){
	    case 1: return function(a){
	      return fn.call(that, a);
	    };
	    case 2: return function(a, b){
	      return fn.call(that, a, b);
	    };
	    case 3: return function(a, b, c){
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function(/* ...args */){
	    return fn.apply(that, arguments);
	  };
	};

/***/ },
/* 65 */
/***/ function(module, exports) {

	module.exports = function(it){
	  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
	  return it;
	};

/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	var dP         = __webpack_require__(67)
	  , createDesc = __webpack_require__(75);
	module.exports = __webpack_require__(71) ? function(object, key, value){
	  return dP.f(object, key, createDesc(1, value));
	} : function(object, key, value){
	  object[key] = value;
	  return object;
	};

/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	var anObject       = __webpack_require__(68)
	  , IE8_DOM_DEFINE = __webpack_require__(70)
	  , toPrimitive    = __webpack_require__(74)
	  , dP             = Object.defineProperty;
	
	exports.f = __webpack_require__(71) ? Object.defineProperty : function defineProperty(O, P, Attributes){
	  anObject(O);
	  P = toPrimitive(P, true);
	  anObject(Attributes);
	  if(IE8_DOM_DEFINE)try {
	    return dP(O, P, Attributes);
	  } catch(e){ /* empty */ }
	  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
	  if('value' in Attributes)O[P] = Attributes.value;
	  return O;
	};

/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(69);
	module.exports = function(it){
	  if(!isObject(it))throw TypeError(it + ' is not an object!');
	  return it;
	};

/***/ },
/* 69 */
/***/ function(module, exports) {

	module.exports = function(it){
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = !__webpack_require__(71) && !__webpack_require__(72)(function(){
	  return Object.defineProperty(__webpack_require__(73)('div'), 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	// Thank's IE8 for his funny defineProperty
	module.exports = !__webpack_require__(72)(function(){
	  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 72 */
/***/ function(module, exports) {

	module.exports = function(exec){
	  try {
	    return !!exec();
	  } catch(e){
	    return true;
	  }
	};

/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(69)
	  , document = __webpack_require__(62).document
	  // in old IE typeof document.createElement is 'object'
	  , is = isObject(document) && isObject(document.createElement);
	module.exports = function(it){
	  return is ? document.createElement(it) : {};
	};

/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.1 ToPrimitive(input [, PreferredType])
	var isObject = __webpack_require__(69);
	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string
	module.exports = function(it, S){
	  if(!isObject(it))return it;
	  var fn, val;
	  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
	  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
	  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
	  throw TypeError("Can't convert object to primitive value");
	};

/***/ },
/* 75 */
/***/ function(module, exports) {

	module.exports = function(bitmap, value){
	  return {
	    enumerable  : !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable    : !(bitmap & 4),
	    value       : value
	  };
	};

/***/ },
/* 76 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(66);

/***/ },
/* 77 */
/***/ function(module, exports) {

	var hasOwnProperty = {}.hasOwnProperty;
	module.exports = function(it, key){
	  return hasOwnProperty.call(it, key);
	};

/***/ },
/* 78 */
/***/ function(module, exports) {

	module.exports = {};

/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var create         = __webpack_require__(80)
	  , descriptor     = __webpack_require__(75)
	  , setToStringTag = __webpack_require__(95)
	  , IteratorPrototype = {};
	
	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	__webpack_require__(66)(IteratorPrototype, __webpack_require__(96)('iterator'), function(){ return this; });
	
	module.exports = function(Constructor, NAME, next){
	  Constructor.prototype = create(IteratorPrototype, {next: descriptor(1, next)});
	  setToStringTag(Constructor, NAME + ' Iterator');
	};

/***/ },
/* 80 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	var anObject    = __webpack_require__(68)
	  , dPs         = __webpack_require__(81)
	  , enumBugKeys = __webpack_require__(93)
	  , IE_PROTO    = __webpack_require__(90)('IE_PROTO')
	  , Empty       = function(){ /* empty */ }
	  , PROTOTYPE   = 'prototype';
	
	// Create object with fake `null` prototype: use iframe Object with cleared prototype
	var createDict = function(){
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = __webpack_require__(73)('iframe')
	    , i      = enumBugKeys.length
	    , gt     = '>'
	    , iframeDocument;
	  iframe.style.display = 'none';
	  __webpack_require__(94).appendChild(iframe);
	  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
	  // createDict = iframe.contentWindow.Object;
	  // html.removeChild(iframe);
	  iframeDocument = iframe.contentWindow.document;
	  iframeDocument.open();
	  iframeDocument.write('<script>document.F=Object</script' + gt);
	  iframeDocument.close();
	  createDict = iframeDocument.F;
	  while(i--)delete createDict[PROTOTYPE][enumBugKeys[i]];
	  return createDict();
	};
	
	module.exports = Object.create || function create(O, Properties){
	  var result;
	  if(O !== null){
	    Empty[PROTOTYPE] = anObject(O);
	    result = new Empty;
	    Empty[PROTOTYPE] = null;
	    // add "__proto__" for Object.getPrototypeOf polyfill
	    result[IE_PROTO] = O;
	  } else result = createDict();
	  return Properties === undefined ? result : dPs(result, Properties);
	};

/***/ },
/* 81 */
/***/ function(module, exports, __webpack_require__) {

	var dP       = __webpack_require__(67)
	  , anObject = __webpack_require__(68)
	  , getKeys  = __webpack_require__(82);
	
	module.exports = __webpack_require__(71) ? Object.defineProperties : function defineProperties(O, Properties){
	  anObject(O);
	  var keys   = getKeys(Properties)
	    , length = keys.length
	    , i = 0
	    , P;
	  while(length > i)dP.f(O, P = keys[i++], Properties[P]);
	  return O;
	};

/***/ },
/* 82 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.14 / 15.2.3.14 Object.keys(O)
	var $keys       = __webpack_require__(83)
	  , enumBugKeys = __webpack_require__(93);
	
	module.exports = Object.keys || function keys(O){
	  return $keys(O, enumBugKeys);
	};

/***/ },
/* 83 */
/***/ function(module, exports, __webpack_require__) {

	var has          = __webpack_require__(77)
	  , toIObject    = __webpack_require__(84)
	  , arrayIndexOf = __webpack_require__(87)(false)
	  , IE_PROTO     = __webpack_require__(90)('IE_PROTO');
	
	module.exports = function(object, names){
	  var O      = toIObject(object)
	    , i      = 0
	    , result = []
	    , key;
	  for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
	  // Don't enum bug & hidden keys
	  while(names.length > i)if(has(O, key = names[i++])){
	    ~arrayIndexOf(result, key) || result.push(key);
	  }
	  return result;
	};

/***/ },
/* 84 */
/***/ function(module, exports, __webpack_require__) {

	// to indexed object, toObject with fallback for non-array-like ES3 strings
	var IObject = __webpack_require__(85)
	  , defined = __webpack_require__(58);
	module.exports = function(it){
	  return IObject(defined(it));
	};

/***/ },
/* 85 */
/***/ function(module, exports, __webpack_require__) {

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var cof = __webpack_require__(86);
	module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};

/***/ },
/* 86 */
/***/ function(module, exports) {

	var toString = {}.toString;
	
	module.exports = function(it){
	  return toString.call(it).slice(8, -1);
	};

/***/ },
/* 87 */
/***/ function(module, exports, __webpack_require__) {

	// false -> Array#indexOf
	// true  -> Array#includes
	var toIObject = __webpack_require__(84)
	  , toLength  = __webpack_require__(88)
	  , toIndex   = __webpack_require__(89);
	module.exports = function(IS_INCLUDES){
	  return function($this, el, fromIndex){
	    var O      = toIObject($this)
	      , length = toLength(O.length)
	      , index  = toIndex(fromIndex, length)
	      , value;
	    // Array#includes uses SameValueZero equality algorithm
	    if(IS_INCLUDES && el != el)while(length > index){
	      value = O[index++];
	      if(value != value)return true;
	    // Array#toIndex ignores holes, Array#includes - not
	    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
	      if(O[index] === el)return IS_INCLUDES || index || 0;
	    } return !IS_INCLUDES && -1;
	  };
	};

/***/ },
/* 88 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.15 ToLength
	var toInteger = __webpack_require__(57)
	  , min       = Math.min;
	module.exports = function(it){
	  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	};

/***/ },
/* 89 */
/***/ function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(57)
	  , max       = Math.max
	  , min       = Math.min;
	module.exports = function(index, length){
	  index = toInteger(index);
	  return index < 0 ? max(index + length, 0) : min(index, length);
	};

/***/ },
/* 90 */
/***/ function(module, exports, __webpack_require__) {

	var shared = __webpack_require__(91)('keys')
	  , uid    = __webpack_require__(92);
	module.exports = function(key){
	  return shared[key] || (shared[key] = uid(key));
	};

/***/ },
/* 91 */
/***/ function(module, exports, __webpack_require__) {

	var global = __webpack_require__(62)
	  , SHARED = '__core-js_shared__'
	  , store  = global[SHARED] || (global[SHARED] = {});
	module.exports = function(key){
	  return store[key] || (store[key] = {});
	};

/***/ },
/* 92 */
/***/ function(module, exports) {

	var id = 0
	  , px = Math.random();
	module.exports = function(key){
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};

/***/ },
/* 93 */
/***/ function(module, exports) {

	// IE 8- don't enum bug keys
	module.exports = (
	  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
	).split(',');

/***/ },
/* 94 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(62).document && document.documentElement;

/***/ },
/* 95 */
/***/ function(module, exports, __webpack_require__) {

	var def = __webpack_require__(67).f
	  , has = __webpack_require__(77)
	  , TAG = __webpack_require__(96)('toStringTag');
	
	module.exports = function(it, tag, stat){
	  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
	};

/***/ },
/* 96 */
/***/ function(module, exports, __webpack_require__) {

	var store      = __webpack_require__(91)('wks')
	  , uid        = __webpack_require__(92)
	  , Symbol     = __webpack_require__(62).Symbol
	  , USE_SYMBOL = typeof Symbol == 'function';
	
	var $exports = module.exports = function(name){
	  return store[name] || (store[name] =
	    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
	};
	
	$exports.store = store;

/***/ },
/* 97 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
	var has         = __webpack_require__(77)
	  , toObject    = __webpack_require__(98)
	  , IE_PROTO    = __webpack_require__(90)('IE_PROTO')
	  , ObjectProto = Object.prototype;
	
	module.exports = Object.getPrototypeOf || function(O){
	  O = toObject(O);
	  if(has(O, IE_PROTO))return O[IE_PROTO];
	  if(typeof O.constructor == 'function' && O instanceof O.constructor){
	    return O.constructor.prototype;
	  } return O instanceof Object ? ObjectProto : null;
	};

/***/ },
/* 98 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.13 ToObject(argument)
	var defined = __webpack_require__(58);
	module.exports = function(it){
	  return Object(defined(it));
	};

/***/ },
/* 99 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(100);
	var global        = __webpack_require__(62)
	  , hide          = __webpack_require__(66)
	  , Iterators     = __webpack_require__(78)
	  , TO_STRING_TAG = __webpack_require__(96)('toStringTag');
	
	for(var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++){
	  var NAME       = collections[i]
	    , Collection = global[NAME]
	    , proto      = Collection && Collection.prototype;
	  if(proto && !proto[TO_STRING_TAG])hide(proto, TO_STRING_TAG, NAME);
	  Iterators[NAME] = Iterators.Array;
	}

/***/ },
/* 100 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var addToUnscopables = __webpack_require__(101)
	  , step             = __webpack_require__(102)
	  , Iterators        = __webpack_require__(78)
	  , toIObject        = __webpack_require__(84);
	
	// 22.1.3.4 Array.prototype.entries()
	// 22.1.3.13 Array.prototype.keys()
	// 22.1.3.29 Array.prototype.values()
	// 22.1.3.30 Array.prototype[@@iterator]()
	module.exports = __webpack_require__(59)(Array, 'Array', function(iterated, kind){
	  this._t = toIObject(iterated); // target
	  this._i = 0;                   // next index
	  this._k = kind;                // kind
	// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
	}, function(){
	  var O     = this._t
	    , kind  = this._k
	    , index = this._i++;
	  if(!O || index >= O.length){
	    this._t = undefined;
	    return step(1);
	  }
	  if(kind == 'keys'  )return step(0, index);
	  if(kind == 'values')return step(0, O[index]);
	  return step(0, [index, O[index]]);
	}, 'values');
	
	// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
	Iterators.Arguments = Iterators.Array;
	
	addToUnscopables('keys');
	addToUnscopables('values');
	addToUnscopables('entries');

/***/ },
/* 101 */
/***/ function(module, exports) {

	module.exports = function(){ /* empty */ };

/***/ },
/* 102 */
/***/ function(module, exports) {

	module.exports = function(done, value){
	  return {value: value, done: !!done};
	};

/***/ },
/* 103 */
/***/ function(module, exports, __webpack_require__) {

	exports.f = __webpack_require__(96);

/***/ },
/* 104 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(105), __esModule: true };

/***/ },
/* 105 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(106);
	__webpack_require__(117);
	__webpack_require__(118);
	__webpack_require__(119);
	module.exports = __webpack_require__(63).Symbol;

/***/ },
/* 106 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// ECMAScript 6 symbols shim
	var global         = __webpack_require__(62)
	  , has            = __webpack_require__(77)
	  , DESCRIPTORS    = __webpack_require__(71)
	  , $export        = __webpack_require__(61)
	  , redefine       = __webpack_require__(76)
	  , META           = __webpack_require__(107).KEY
	  , $fails         = __webpack_require__(72)
	  , shared         = __webpack_require__(91)
	  , setToStringTag = __webpack_require__(95)
	  , uid            = __webpack_require__(92)
	  , wks            = __webpack_require__(96)
	  , wksExt         = __webpack_require__(103)
	  , wksDefine      = __webpack_require__(108)
	  , keyOf          = __webpack_require__(109)
	  , enumKeys       = __webpack_require__(110)
	  , isArray        = __webpack_require__(113)
	  , anObject       = __webpack_require__(68)
	  , toIObject      = __webpack_require__(84)
	  , toPrimitive    = __webpack_require__(74)
	  , createDesc     = __webpack_require__(75)
	  , _create        = __webpack_require__(80)
	  , gOPNExt        = __webpack_require__(114)
	  , $GOPD          = __webpack_require__(116)
	  , $DP            = __webpack_require__(67)
	  , $keys          = __webpack_require__(82)
	  , gOPD           = $GOPD.f
	  , dP             = $DP.f
	  , gOPN           = gOPNExt.f
	  , $Symbol        = global.Symbol
	  , $JSON          = global.JSON
	  , _stringify     = $JSON && $JSON.stringify
	  , PROTOTYPE      = 'prototype'
	  , HIDDEN         = wks('_hidden')
	  , TO_PRIMITIVE   = wks('toPrimitive')
	  , isEnum         = {}.propertyIsEnumerable
	  , SymbolRegistry = shared('symbol-registry')
	  , AllSymbols     = shared('symbols')
	  , OPSymbols      = shared('op-symbols')
	  , ObjectProto    = Object[PROTOTYPE]
	  , USE_NATIVE     = typeof $Symbol == 'function'
	  , QObject        = global.QObject;
	// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
	var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;
	
	// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
	var setSymbolDesc = DESCRIPTORS && $fails(function(){
	  return _create(dP({}, 'a', {
	    get: function(){ return dP(this, 'a', {value: 7}).a; }
	  })).a != 7;
	}) ? function(it, key, D){
	  var protoDesc = gOPD(ObjectProto, key);
	  if(protoDesc)delete ObjectProto[key];
	  dP(it, key, D);
	  if(protoDesc && it !== ObjectProto)dP(ObjectProto, key, protoDesc);
	} : dP;
	
	var wrap = function(tag){
	  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
	  sym._k = tag;
	  return sym;
	};
	
	var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function(it){
	  return typeof it == 'symbol';
	} : function(it){
	  return it instanceof $Symbol;
	};
	
	var $defineProperty = function defineProperty(it, key, D){
	  if(it === ObjectProto)$defineProperty(OPSymbols, key, D);
	  anObject(it);
	  key = toPrimitive(key, true);
	  anObject(D);
	  if(has(AllSymbols, key)){
	    if(!D.enumerable){
	      if(!has(it, HIDDEN))dP(it, HIDDEN, createDesc(1, {}));
	      it[HIDDEN][key] = true;
	    } else {
	      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
	      D = _create(D, {enumerable: createDesc(0, false)});
	    } return setSymbolDesc(it, key, D);
	  } return dP(it, key, D);
	};
	var $defineProperties = function defineProperties(it, P){
	  anObject(it);
	  var keys = enumKeys(P = toIObject(P))
	    , i    = 0
	    , l = keys.length
	    , key;
	  while(l > i)$defineProperty(it, key = keys[i++], P[key]);
	  return it;
	};
	var $create = function create(it, P){
	  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
	};
	var $propertyIsEnumerable = function propertyIsEnumerable(key){
	  var E = isEnum.call(this, key = toPrimitive(key, true));
	  if(this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return false;
	  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
	};
	var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
	  it  = toIObject(it);
	  key = toPrimitive(key, true);
	  if(it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return;
	  var D = gOPD(it, key);
	  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
	  return D;
	};
	var $getOwnPropertyNames = function getOwnPropertyNames(it){
	  var names  = gOPN(toIObject(it))
	    , result = []
	    , i      = 0
	    , key;
	  while(names.length > i){
	    if(!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META)result.push(key);
	  } return result;
	};
	var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
	  var IS_OP  = it === ObjectProto
	    , names  = gOPN(IS_OP ? OPSymbols : toIObject(it))
	    , result = []
	    , i      = 0
	    , key;
	  while(names.length > i){
	    if(has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true))result.push(AllSymbols[key]);
	  } return result;
	};
	
	// 19.4.1.1 Symbol([description])
	if(!USE_NATIVE){
	  $Symbol = function Symbol(){
	    if(this instanceof $Symbol)throw TypeError('Symbol is not a constructor!');
	    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
	    var $set = function(value){
	      if(this === ObjectProto)$set.call(OPSymbols, value);
	      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
	      setSymbolDesc(this, tag, createDesc(1, value));
	    };
	    if(DESCRIPTORS && setter)setSymbolDesc(ObjectProto, tag, {configurable: true, set: $set});
	    return wrap(tag);
	  };
	  redefine($Symbol[PROTOTYPE], 'toString', function toString(){
	    return this._k;
	  });
	
	  $GOPD.f = $getOwnPropertyDescriptor;
	  $DP.f   = $defineProperty;
	  __webpack_require__(115).f = gOPNExt.f = $getOwnPropertyNames;
	  __webpack_require__(112).f  = $propertyIsEnumerable;
	  __webpack_require__(111).f = $getOwnPropertySymbols;
	
	  if(DESCRIPTORS && !__webpack_require__(60)){
	    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
	  }
	
	  wksExt.f = function(name){
	    return wrap(wks(name));
	  }
	}
	
	$export($export.G + $export.W + $export.F * !USE_NATIVE, {Symbol: $Symbol});
	
	for(var symbols = (
	  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
	  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
	).split(','), i = 0; symbols.length > i; )wks(symbols[i++]);
	
	for(var symbols = $keys(wks.store), i = 0; symbols.length > i; )wksDefine(symbols[i++]);
	
	$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
	  // 19.4.2.1 Symbol.for(key)
	  'for': function(key){
	    return has(SymbolRegistry, key += '')
	      ? SymbolRegistry[key]
	      : SymbolRegistry[key] = $Symbol(key);
	  },
	  // 19.4.2.5 Symbol.keyFor(sym)
	  keyFor: function keyFor(key){
	    if(isSymbol(key))return keyOf(SymbolRegistry, key);
	    throw TypeError(key + ' is not a symbol!');
	  },
	  useSetter: function(){ setter = true; },
	  useSimple: function(){ setter = false; }
	});
	
	$export($export.S + $export.F * !USE_NATIVE, 'Object', {
	  // 19.1.2.2 Object.create(O [, Properties])
	  create: $create,
	  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
	  defineProperty: $defineProperty,
	  // 19.1.2.3 Object.defineProperties(O, Properties)
	  defineProperties: $defineProperties,
	  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
	  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
	  // 19.1.2.7 Object.getOwnPropertyNames(O)
	  getOwnPropertyNames: $getOwnPropertyNames,
	  // 19.1.2.8 Object.getOwnPropertySymbols(O)
	  getOwnPropertySymbols: $getOwnPropertySymbols
	});
	
	// 24.3.2 JSON.stringify(value [, replacer [, space]])
	$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function(){
	  var S = $Symbol();
	  // MS Edge converts symbol values to JSON as {}
	  // WebKit converts symbol values to JSON as null
	  // V8 throws on boxed symbols
	  return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
	})), 'JSON', {
	  stringify: function stringify(it){
	    if(it === undefined || isSymbol(it))return; // IE8 returns string on undefined
	    var args = [it]
	      , i    = 1
	      , replacer, $replacer;
	    while(arguments.length > i)args.push(arguments[i++]);
	    replacer = args[1];
	    if(typeof replacer == 'function')$replacer = replacer;
	    if($replacer || !isArray(replacer))replacer = function(key, value){
	      if($replacer)value = $replacer.call(this, key, value);
	      if(!isSymbol(value))return value;
	    };
	    args[1] = replacer;
	    return _stringify.apply($JSON, args);
	  }
	});
	
	// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
	$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__(66)($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
	// 19.4.3.5 Symbol.prototype[@@toStringTag]
	setToStringTag($Symbol, 'Symbol');
	// 20.2.1.9 Math[@@toStringTag]
	setToStringTag(Math, 'Math', true);
	// 24.3.3 JSON[@@toStringTag]
	setToStringTag(global.JSON, 'JSON', true);

/***/ },
/* 107 */
/***/ function(module, exports, __webpack_require__) {

	var META     = __webpack_require__(92)('meta')
	  , isObject = __webpack_require__(69)
	  , has      = __webpack_require__(77)
	  , setDesc  = __webpack_require__(67).f
	  , id       = 0;
	var isExtensible = Object.isExtensible || function(){
	  return true;
	};
	var FREEZE = !__webpack_require__(72)(function(){
	  return isExtensible(Object.preventExtensions({}));
	});
	var setMeta = function(it){
	  setDesc(it, META, {value: {
	    i: 'O' + ++id, // object ID
	    w: {}          // weak collections IDs
	  }});
	};
	var fastKey = function(it, create){
	  // return primitive with prefix
	  if(!isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
	  if(!has(it, META)){
	    // can't set metadata to uncaught frozen object
	    if(!isExtensible(it))return 'F';
	    // not necessary to add metadata
	    if(!create)return 'E';
	    // add missing metadata
	    setMeta(it);
	  // return object ID
	  } return it[META].i;
	};
	var getWeak = function(it, create){
	  if(!has(it, META)){
	    // can't set metadata to uncaught frozen object
	    if(!isExtensible(it))return true;
	    // not necessary to add metadata
	    if(!create)return false;
	    // add missing metadata
	    setMeta(it);
	  // return hash weak collections IDs
	  } return it[META].w;
	};
	// add metadata on freeze-family methods calling
	var onFreeze = function(it){
	  if(FREEZE && meta.NEED && isExtensible(it) && !has(it, META))setMeta(it);
	  return it;
	};
	var meta = module.exports = {
	  KEY:      META,
	  NEED:     false,
	  fastKey:  fastKey,
	  getWeak:  getWeak,
	  onFreeze: onFreeze
	};

/***/ },
/* 108 */
/***/ function(module, exports, __webpack_require__) {

	var global         = __webpack_require__(62)
	  , core           = __webpack_require__(63)
	  , LIBRARY        = __webpack_require__(60)
	  , wksExt         = __webpack_require__(103)
	  , defineProperty = __webpack_require__(67).f;
	module.exports = function(name){
	  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
	  if(name.charAt(0) != '_' && !(name in $Symbol))defineProperty($Symbol, name, {value: wksExt.f(name)});
	};

/***/ },
/* 109 */
/***/ function(module, exports, __webpack_require__) {

	var getKeys   = __webpack_require__(82)
	  , toIObject = __webpack_require__(84);
	module.exports = function(object, el){
	  var O      = toIObject(object)
	    , keys   = getKeys(O)
	    , length = keys.length
	    , index  = 0
	    , key;
	  while(length > index)if(O[key = keys[index++]] === el)return key;
	};

/***/ },
/* 110 */
/***/ function(module, exports, __webpack_require__) {

	// all enumerable object keys, includes symbols
	var getKeys = __webpack_require__(82)
	  , gOPS    = __webpack_require__(111)
	  , pIE     = __webpack_require__(112);
	module.exports = function(it){
	  var result     = getKeys(it)
	    , getSymbols = gOPS.f;
	  if(getSymbols){
	    var symbols = getSymbols(it)
	      , isEnum  = pIE.f
	      , i       = 0
	      , key;
	    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))result.push(key);
	  } return result;
	};

/***/ },
/* 111 */
/***/ function(module, exports) {

	exports.f = Object.getOwnPropertySymbols;

/***/ },
/* 112 */
/***/ function(module, exports) {

	exports.f = {}.propertyIsEnumerable;

/***/ },
/* 113 */
/***/ function(module, exports, __webpack_require__) {

	// 7.2.2 IsArray(argument)
	var cof = __webpack_require__(86);
	module.exports = Array.isArray || function isArray(arg){
	  return cof(arg) == 'Array';
	};

/***/ },
/* 114 */
/***/ function(module, exports, __webpack_require__) {

	// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
	var toIObject = __webpack_require__(84)
	  , gOPN      = __webpack_require__(115).f
	  , toString  = {}.toString;
	
	var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
	  ? Object.getOwnPropertyNames(window) : [];
	
	var getWindowNames = function(it){
	  try {
	    return gOPN(it);
	  } catch(e){
	    return windowNames.slice();
	  }
	};
	
	module.exports.f = function getOwnPropertyNames(it){
	  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
	};


/***/ },
/* 115 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
	var $keys      = __webpack_require__(83)
	  , hiddenKeys = __webpack_require__(93).concat('length', 'prototype');
	
	exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O){
	  return $keys(O, hiddenKeys);
	};

/***/ },
/* 116 */
/***/ function(module, exports, __webpack_require__) {

	var pIE            = __webpack_require__(112)
	  , createDesc     = __webpack_require__(75)
	  , toIObject      = __webpack_require__(84)
	  , toPrimitive    = __webpack_require__(74)
	  , has            = __webpack_require__(77)
	  , IE8_DOM_DEFINE = __webpack_require__(70)
	  , gOPD           = Object.getOwnPropertyDescriptor;
	
	exports.f = __webpack_require__(71) ? gOPD : function getOwnPropertyDescriptor(O, P){
	  O = toIObject(O);
	  P = toPrimitive(P, true);
	  if(IE8_DOM_DEFINE)try {
	    return gOPD(O, P);
	  } catch(e){ /* empty */ }
	  if(has(O, P))return createDesc(!pIE.f.call(O, P), O[P]);
	};

/***/ },
/* 117 */
/***/ function(module, exports) {



/***/ },
/* 118 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(108)('asyncIterator');

/***/ },
/* 119 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(108)('observable');

/***/ },
/* 120 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _setPrototypeOf = __webpack_require__(121);
	
	var _setPrototypeOf2 = _interopRequireDefault(_setPrototypeOf);
	
	var _create = __webpack_require__(125);
	
	var _create2 = _interopRequireDefault(_create);
	
	var _typeof2 = __webpack_require__(52);
	
	var _typeof3 = _interopRequireDefault(_typeof2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = function (subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : (0, _typeof3.default)(superClass)));
	  }
	
	  subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, {
	    constructor: {
	      value: subClass,
	      enumerable: false,
	      writable: true,
	      configurable: true
	    }
	  });
	  if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
	};

/***/ },
/* 121 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(122), __esModule: true };

/***/ },
/* 122 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(123);
	module.exports = __webpack_require__(63).Object.setPrototypeOf;

/***/ },
/* 123 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.3.19 Object.setPrototypeOf(O, proto)
	var $export = __webpack_require__(61);
	$export($export.S, 'Object', {setPrototypeOf: __webpack_require__(124).set});

/***/ },
/* 124 */
/***/ function(module, exports, __webpack_require__) {

	// Works with __proto__ only. Old v8 can't work with null proto objects.
	/* eslint-disable no-proto */
	var isObject = __webpack_require__(69)
	  , anObject = __webpack_require__(68);
	var check = function(O, proto){
	  anObject(O);
	  if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
	};
	module.exports = {
	  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
	    function(test, buggy, set){
	      try {
	        set = __webpack_require__(64)(Function.call, __webpack_require__(116).f(Object.prototype, '__proto__').set, 2);
	        set(test, []);
	        buggy = !(test instanceof Array);
	      } catch(e){ buggy = true; }
	      return function setPrototypeOf(O, proto){
	        check(O, proto);
	        if(buggy)O.__proto__ = proto;
	        else set(O, proto);
	        return O;
	      };
	    }({}, false) : undefined),
	  check: check
	};

/***/ },
/* 125 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(126), __esModule: true };

/***/ },
/* 126 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(127);
	var $Object = __webpack_require__(63).Object;
	module.exports = function create(P, D){
	  return $Object.create(P, D);
	};

/***/ },
/* 127 */
/***/ function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(61)
	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	$export($export.S, 'Object', {create: __webpack_require__(80)});

/***/ },
/* 128 */
/***/ function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	
	exports.default = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};

/***/ },
/* 129 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Observable_1 = __webpack_require__(4);
	var empty_1 = __webpack_require__(130);
	Observable_1.Observable.empty = empty_1.empty;
	//# sourceMappingURL=empty.js.map

/***/ },
/* 130 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var EmptyObservable_1 = __webpack_require__(24);
	exports.empty = EmptyObservable_1.EmptyObservable.create;
	//# sourceMappingURL=empty.js.map

/***/ },
/* 131 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Observable_1 = __webpack_require__(4);
	var publishReplay_1 = __webpack_require__(132);
	Observable_1.Observable.prototype.publishReplay = publishReplay_1.publishReplay;
	//# sourceMappingURL=publishReplay.js.map

/***/ },
/* 132 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var ReplaySubject_1 = __webpack_require__(133);
	var multicast_1 = __webpack_require__(142);
	/**
	 * @param bufferSize
	 * @param windowTime
	 * @param scheduler
	 * @return {ConnectableObservable<T>}
	 * @method publishReplay
	 * @owner Observable
	 */
	function publishReplay(bufferSize, windowTime, scheduler) {
	    if (bufferSize === void 0) { bufferSize = Number.POSITIVE_INFINITY; }
	    if (windowTime === void 0) { windowTime = Number.POSITIVE_INFINITY; }
	    return multicast_1.multicast.call(this, new ReplaySubject_1.ReplaySubject(bufferSize, windowTime, scheduler));
	}
	exports.publishReplay = publishReplay;
	//# sourceMappingURL=publishReplay.js.map

/***/ },
/* 133 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Subject_1 = __webpack_require__(134);
	var queue_1 = __webpack_require__(138);
	var observeOn_1 = __webpack_require__(34);
	/**
	 * @class ReplaySubject<T>
	 */
	var ReplaySubject = (function (_super) {
	    __extends(ReplaySubject, _super);
	    function ReplaySubject(bufferSize, windowTime, scheduler) {
	        if (bufferSize === void 0) { bufferSize = Number.POSITIVE_INFINITY; }
	        if (windowTime === void 0) { windowTime = Number.POSITIVE_INFINITY; }
	        _super.call(this);
	        this.events = [];
	        this.scheduler = scheduler;
	        this.bufferSize = bufferSize < 1 ? 1 : bufferSize;
	        this._windowTime = windowTime < 1 ? 1 : windowTime;
	    }
	    ReplaySubject.prototype._next = function (value) {
	        var now = this._getNow();
	        this.events.push(new ReplayEvent(now, value));
	        this._trimBufferThenGetEvents(now);
	        _super.prototype._next.call(this, value);
	    };
	    ReplaySubject.prototype._subscribe = function (subscriber) {
	        var events = this._trimBufferThenGetEvents(this._getNow());
	        var scheduler = this.scheduler;
	        if (scheduler) {
	            subscriber.add(subscriber = new observeOn_1.ObserveOnSubscriber(subscriber, scheduler));
	        }
	        var index = -1;
	        var len = events.length;
	        while (++index < len && !subscriber.isUnsubscribed) {
	            subscriber.next(events[index].value);
	        }
	        return _super.prototype._subscribe.call(this, subscriber);
	    };
	    ReplaySubject.prototype._getNow = function () {
	        return (this.scheduler || queue_1.queue).now();
	    };
	    ReplaySubject.prototype._trimBufferThenGetEvents = function (now) {
	        var bufferSize = this.bufferSize;
	        var _windowTime = this._windowTime;
	        var events = this.events;
	        var eventsCount = events.length;
	        var spliceCount = 0;
	        // Trim events that fall out of the time window.
	        // Start at the front of the list. Break early once
	        // we encounter an event that falls within the window.
	        while (spliceCount < eventsCount) {
	            if ((now - events[spliceCount].time) < _windowTime) {
	                break;
	            }
	            spliceCount += 1;
	        }
	        if (eventsCount > bufferSize) {
	            spliceCount = Math.max(spliceCount, eventsCount - bufferSize);
	        }
	        if (spliceCount > 0) {
	            events.splice(0, spliceCount);
	        }
	        return events;
	    };
	    return ReplaySubject;
	}(Subject_1.Subject));
	exports.ReplaySubject = ReplaySubject;
	var ReplayEvent = (function () {
	    function ReplayEvent(time, value) {
	        this.time = time;
	        this.value = value;
	    }
	    return ReplayEvent;
	}());
	//# sourceMappingURL=ReplaySubject.js.map

/***/ },
/* 134 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Observable_1 = __webpack_require__(4);
	var Subscriber_1 = __webpack_require__(8);
	var Subscription_1 = __webpack_require__(10);
	var SubjectSubscription_1 = __webpack_require__(135);
	var rxSubscriber_1 = __webpack_require__(16);
	var throwError_1 = __webpack_require__(136);
	var ObjectUnsubscribedError_1 = __webpack_require__(137);
	/**
	 * @class Subject<T>
	 */
	var Subject = (function (_super) {
	    __extends(Subject, _super);
	    function Subject(destination, source) {
	        _super.call(this);
	        this.destination = destination;
	        this.source = source;
	        this.observers = [];
	        this.isUnsubscribed = false;
	        this.isStopped = false;
	        this.hasErrored = false;
	        this.dispatching = false;
	        this.hasCompleted = false;
	        this.source = source;
	    }
	    Subject.prototype.lift = function (operator) {
	        var subject = new Subject(this.destination || this, this);
	        subject.operator = operator;
	        return subject;
	    };
	    Subject.prototype.add = function (subscription) {
	        return Subscription_1.Subscription.prototype.add.call(this, subscription);
	    };
	    Subject.prototype.remove = function (subscription) {
	        Subscription_1.Subscription.prototype.remove.call(this, subscription);
	    };
	    Subject.prototype.unsubscribe = function () {
	        Subscription_1.Subscription.prototype.unsubscribe.call(this);
	    };
	    Subject.prototype._subscribe = function (subscriber) {
	        if (this.source) {
	            return this.source.subscribe(subscriber);
	        }
	        else {
	            if (subscriber.isUnsubscribed) {
	                return;
	            }
	            else if (this.hasErrored) {
	                return subscriber.error(this.errorValue);
	            }
	            else if (this.hasCompleted) {
	                return subscriber.complete();
	            }
	            this.throwIfUnsubscribed();
	            var subscription = new SubjectSubscription_1.SubjectSubscription(this, subscriber);
	            this.observers.push(subscriber);
	            return subscription;
	        }
	    };
	    Subject.prototype._unsubscribe = function () {
	        this.source = null;
	        this.isStopped = true;
	        this.observers = null;
	        this.destination = null;
	    };
	    Subject.prototype.next = function (value) {
	        this.throwIfUnsubscribed();
	        if (this.isStopped) {
	            return;
	        }
	        this.dispatching = true;
	        this._next(value);
	        this.dispatching = false;
	        if (this.hasErrored) {
	            this._error(this.errorValue);
	        }
	        else if (this.hasCompleted) {
	            this._complete();
	        }
	    };
	    Subject.prototype.error = function (err) {
	        this.throwIfUnsubscribed();
	        if (this.isStopped) {
	            return;
	        }
	        this.isStopped = true;
	        this.hasErrored = true;
	        this.errorValue = err;
	        if (this.dispatching) {
	            return;
	        }
	        this._error(err);
	    };
	    Subject.prototype.complete = function () {
	        this.throwIfUnsubscribed();
	        if (this.isStopped) {
	            return;
	        }
	        this.isStopped = true;
	        this.hasCompleted = true;
	        if (this.dispatching) {
	            return;
	        }
	        this._complete();
	    };
	    Subject.prototype.asObservable = function () {
	        var observable = new SubjectObservable(this);
	        return observable;
	    };
	    Subject.prototype._next = function (value) {
	        if (this.destination) {
	            this.destination.next(value);
	        }
	        else {
	            this._finalNext(value);
	        }
	    };
	    Subject.prototype._finalNext = function (value) {
	        var index = -1;
	        var observers = this.observers.slice(0);
	        var len = observers.length;
	        while (++index < len) {
	            observers[index].next(value);
	        }
	    };
	    Subject.prototype._error = function (err) {
	        if (this.destination) {
	            this.destination.error(err);
	        }
	        else {
	            this._finalError(err);
	        }
	    };
	    Subject.prototype._finalError = function (err) {
	        var index = -1;
	        var observers = this.observers;
	        // optimization to block our SubjectSubscriptions from
	        // splicing themselves out of the observers list one by one.
	        this.observers = null;
	        this.isUnsubscribed = true;
	        if (observers) {
	            var len = observers.length;
	            while (++index < len) {
	                observers[index].error(err);
	            }
	        }
	        this.isUnsubscribed = false;
	        this.unsubscribe();
	    };
	    Subject.prototype._complete = function () {
	        if (this.destination) {
	            this.destination.complete();
	        }
	        else {
	            this._finalComplete();
	        }
	    };
	    Subject.prototype._finalComplete = function () {
	        var index = -1;
	        var observers = this.observers;
	        // optimization to block our SubjectSubscriptions from
	        // splicing themselves out of the observers list one by one.
	        this.observers = null;
	        this.isUnsubscribed = true;
	        if (observers) {
	            var len = observers.length;
	            while (++index < len) {
	                observers[index].complete();
	            }
	        }
	        this.isUnsubscribed = false;
	        this.unsubscribe();
	    };
	    Subject.prototype.throwIfUnsubscribed = function () {
	        if (this.isUnsubscribed) {
	            throwError_1.throwError(new ObjectUnsubscribedError_1.ObjectUnsubscribedError());
	        }
	    };
	    Subject.prototype[rxSubscriber_1.$$rxSubscriber] = function () {
	        return new Subscriber_1.Subscriber(this);
	    };
	    Subject.create = function (destination, source) {
	        return new Subject(destination, source);
	    };
	    return Subject;
	}(Observable_1.Observable));
	exports.Subject = Subject;
	/**
	 * We need this JSDoc comment for affecting ESDoc.
	 * @ignore
	 * @extends {Ignored}
	 */
	var SubjectObservable = (function (_super) {
	    __extends(SubjectObservable, _super);
	    function SubjectObservable(source) {
	        _super.call(this);
	        this.source = source;
	    }
	    return SubjectObservable;
	}(Observable_1.Observable));
	//# sourceMappingURL=Subject.js.map

/***/ },
/* 135 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Subscription_1 = __webpack_require__(10);
	/**
	 * We need this JSDoc comment for affecting ESDoc.
	 * @ignore
	 * @extends {Ignored}
	 */
	var SubjectSubscription = (function (_super) {
	    __extends(SubjectSubscription, _super);
	    function SubjectSubscription(subject, observer) {
	        _super.call(this);
	        this.subject = subject;
	        this.observer = observer;
	        this.isUnsubscribed = false;
	    }
	    SubjectSubscription.prototype.unsubscribe = function () {
	        if (this.isUnsubscribed) {
	            return;
	        }
	        this.isUnsubscribed = true;
	        var subject = this.subject;
	        var observers = subject.observers;
	        this.subject = null;
	        if (!observers || observers.length === 0 || subject.isUnsubscribed) {
	            return;
	        }
	        var subscriberIndex = observers.indexOf(this.observer);
	        if (subscriberIndex !== -1) {
	            observers.splice(subscriberIndex, 1);
	        }
	    };
	    return SubjectSubscription;
	}(Subscription_1.Subscription));
	exports.SubjectSubscription = SubjectSubscription;
	//# sourceMappingURL=SubjectSubscription.js.map

/***/ },
/* 136 */
/***/ function(module, exports) {

	"use strict";
	function throwError(e) { throw e; }
	exports.throwError = throwError;
	//# sourceMappingURL=throwError.js.map

/***/ },
/* 137 */
/***/ function(module, exports) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	/**
	 * An error thrown when an action is invalid because the object has been
	 * unsubscribed.
	 *
	 * @see {@link Subject}
	 * @see {@link BehaviorSubject}
	 *
	 * @class ObjectUnsubscribedError
	 */
	var ObjectUnsubscribedError = (function (_super) {
	    __extends(ObjectUnsubscribedError, _super);
	    function ObjectUnsubscribedError() {
	        _super.call(this, 'object unsubscribed');
	        this.name = 'ObjectUnsubscribedError';
	    }
	    return ObjectUnsubscribedError;
	}(Error));
	exports.ObjectUnsubscribedError = ObjectUnsubscribedError;
	//# sourceMappingURL=ObjectUnsubscribedError.js.map

/***/ },
/* 138 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var QueueScheduler_1 = __webpack_require__(139);
	exports.queue = new QueueScheduler_1.QueueScheduler();
	//# sourceMappingURL=queue.js.map

/***/ },
/* 139 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var QueueAction_1 = __webpack_require__(140);
	var FutureAction_1 = __webpack_require__(141);
	var QueueScheduler = (function () {
	    function QueueScheduler() {
	        this.active = false;
	        this.actions = []; // XXX: use `any` to remove type param `T` from `VirtualTimeScheduler`.
	        this.scheduledId = null;
	    }
	    QueueScheduler.prototype.now = function () {
	        return Date.now();
	    };
	    QueueScheduler.prototype.flush = function () {
	        if (this.active || this.scheduledId) {
	            return;
	        }
	        this.active = true;
	        var actions = this.actions;
	        // XXX: use `any` to remove type param `T` from `VirtualTimeScheduler`.
	        for (var action = null; action = actions.shift();) {
	            action.execute();
	            if (action.error) {
	                this.active = false;
	                throw action.error;
	            }
	        }
	        this.active = false;
	    };
	    QueueScheduler.prototype.schedule = function (work, delay, state) {
	        if (delay === void 0) { delay = 0; }
	        return (delay <= 0) ?
	            this.scheduleNow(work, state) :
	            this.scheduleLater(work, delay, state);
	    };
	    QueueScheduler.prototype.scheduleNow = function (work, state) {
	        return new QueueAction_1.QueueAction(this, work).schedule(state);
	    };
	    QueueScheduler.prototype.scheduleLater = function (work, delay, state) {
	        return new FutureAction_1.FutureAction(this, work).schedule(state, delay);
	    };
	    return QueueScheduler;
	}());
	exports.QueueScheduler = QueueScheduler;
	//# sourceMappingURL=QueueScheduler.js.map

/***/ },
/* 140 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var FutureAction_1 = __webpack_require__(141);
	/**
	 * We need this JSDoc comment for affecting ESDoc.
	 * @ignore
	 * @extends {Ignored}
	 */
	var QueueAction = (function (_super) {
	    __extends(QueueAction, _super);
	    function QueueAction() {
	        _super.apply(this, arguments);
	    }
	    QueueAction.prototype._schedule = function (state, delay) {
	        if (delay === void 0) { delay = 0; }
	        if (delay > 0) {
	            return _super.prototype._schedule.call(this, state, delay);
	        }
	        this.delay = delay;
	        this.state = state;
	        var scheduler = this.scheduler;
	        scheduler.actions.push(this);
	        scheduler.flush();
	        return this;
	    };
	    return QueueAction;
	}(FutureAction_1.FutureAction));
	exports.QueueAction = QueueAction;
	//# sourceMappingURL=QueueAction.js.map

/***/ },
/* 141 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var root_1 = __webpack_require__(5);
	var Subscription_1 = __webpack_require__(10);
	/**
	 * We need this JSDoc comment for affecting ESDoc.
	 * @ignore
	 * @extends {Ignored}
	 */
	var FutureAction = (function (_super) {
	    __extends(FutureAction, _super);
	    function FutureAction(scheduler, work) {
	        _super.call(this);
	        this.scheduler = scheduler;
	        this.work = work;
	        this.pending = false;
	    }
	    FutureAction.prototype.execute = function () {
	        if (this.isUnsubscribed) {
	            this.error = new Error('executing a cancelled action');
	        }
	        else {
	            try {
	                this.work(this.state);
	            }
	            catch (e) {
	                this.unsubscribe();
	                this.error = e;
	            }
	        }
	    };
	    FutureAction.prototype.schedule = function (state, delay) {
	        if (delay === void 0) { delay = 0; }
	        if (this.isUnsubscribed) {
	            return this;
	        }
	        return this._schedule(state, delay);
	    };
	    FutureAction.prototype._schedule = function (state, delay) {
	        var _this = this;
	        if (delay === void 0) { delay = 0; }
	        // Always replace the current state with the new state.
	        this.state = state;
	        // Set the pending flag indicating that this action has been scheduled, or
	        // has recursively rescheduled itself.
	        this.pending = true;
	        var id = this.id;
	        // If this action has an intervalID and the specified delay matches the
	        // delay we used to create the intervalID, don't call `setInterval` again.
	        if (id != null && this.delay === delay) {
	            return this;
	        }
	        this.delay = delay;
	        // If this action has an intervalID, but was rescheduled with a different
	        // `delay` time, cancel the current intervalID and call `setInterval` with
	        // the new `delay` time.
	        if (id != null) {
	            this.id = null;
	            root_1.root.clearInterval(id);
	        }
	        //
	        // Important implementation note:
	        //
	        // By default, FutureAction only executes once. However, Actions have the
	        // ability to be rescheduled from within the scheduled callback (mimicking
	        // recursion for asynchronous methods). This allows us to implement single
	        // and repeated actions with the same code path without adding API surface
	        // area, and implement tail-call optimization over asynchronous boundaries.
	        //
	        // However, JS runtimes make a distinction between intervals scheduled by
	        // repeatedly calling `setTimeout` vs. a single `setInterval` call, with
	        // the latter providing a better guarantee of precision.
	        //
	        // In order to accommodate both single and repeatedly rescheduled actions,
	        // use `setInterval` here for both cases. By default, the interval will be
	        // canceled after its first execution, or if the action schedules itself to
	        // run again with a different `delay` time.
	        //
	        // If the action recursively schedules itself to run again with the same
	        // `delay` time, the interval is not canceled, but allowed to loop again.
	        // The check of whether the interval should be canceled or not is run every
	        // time the interval is executed. The first time an action fails to
	        // reschedule itself, the interval is canceled.
	        //
	        this.id = root_1.root.setInterval(function () {
	            _this.pending = false;
	            var _a = _this, id = _a.id, scheduler = _a.scheduler;
	            scheduler.actions.push(_this);
	            scheduler.flush();
	            //
	            // Terminate this interval if the action didn't reschedule itself.
	            // Don't call `this.unsubscribe()` here, because the action could be
	            // rescheduled later. For example:
	            //
	            // ```
	            // scheduler.schedule(function doWork(counter) {
	            //   /* ... I'm a busy worker bee ... */
	            //   var originalAction = this;
	            //   /* wait 100ms before rescheduling this action again */
	            //   setTimeout(function () {
	            //     originalAction.schedule(counter + 1);
	            //   }, 100);
	            // }, 1000);
	            // ```
	            if (_this.pending === false && id != null) {
	                _this.id = null;
	                root_1.root.clearInterval(id);
	            }
	        }, delay);
	        return this;
	    };
	    FutureAction.prototype._unsubscribe = function () {
	        this.pending = false;
	        var _a = this, id = _a.id, scheduler = _a.scheduler;
	        var actions = scheduler.actions;
	        var index = actions.indexOf(this);
	        if (id != null) {
	            this.id = null;
	            root_1.root.clearInterval(id);
	        }
	        if (index !== -1) {
	            actions.splice(index, 1);
	        }
	        this.work = null;
	        this.state = null;
	        this.scheduler = null;
	    };
	    return FutureAction;
	}(Subscription_1.Subscription));
	exports.FutureAction = FutureAction;
	//# sourceMappingURL=FutureAction.js.map

/***/ },
/* 142 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var ConnectableObservable_1 = __webpack_require__(143);
	/**
	 * Returns an Observable that emits the results of invoking a specified selector on items
	 * emitted by a ConnectableObservable that shares a single subscription to the underlying stream.
	 *
	 * <img src="./img/multicast.png" width="100%">
	 *
	 * @param {Function} selector - a function that can use the multicasted source stream
	 * as many times as needed, without causing multiple subscriptions to the source stream.
	 * Subscribers to the given source will receive all notifications of the source from the
	 * time of the subscription forward.
	 * @return {Observable} an Observable that emits the results of invoking the selector
	 * on the items emitted by a `ConnectableObservable` that shares a single subscription to
	 * the underlying stream.
	 * @method multicast
	 * @owner Observable
	 */
	function multicast(subjectOrSubjectFactory) {
	    var subjectFactory;
	    if (typeof subjectOrSubjectFactory === 'function') {
	        subjectFactory = subjectOrSubjectFactory;
	    }
	    else {
	        subjectFactory = function subjectFactory() {
	            return subjectOrSubjectFactory;
	        };
	    }
	    return new ConnectableObservable_1.ConnectableObservable(this, subjectFactory);
	}
	exports.multicast = multicast;
	//# sourceMappingURL=multicast.js.map

/***/ },
/* 143 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Observable_1 = __webpack_require__(4);
	var Subscriber_1 = __webpack_require__(8);
	var Subscription_1 = __webpack_require__(10);
	/**
	 * @class ConnectableObservable<T>
	 */
	var ConnectableObservable = (function (_super) {
	    __extends(ConnectableObservable, _super);
	    function ConnectableObservable(source, subjectFactory) {
	        _super.call(this);
	        this.source = source;
	        this.subjectFactory = subjectFactory;
	    }
	    ConnectableObservable.prototype._subscribe = function (subscriber) {
	        return this.getSubject().subscribe(subscriber);
	    };
	    ConnectableObservable.prototype.getSubject = function () {
	        var subject = this.subject;
	        if (subject && !subject.isUnsubscribed) {
	            return subject;
	        }
	        return (this.subject = this.subjectFactory());
	    };
	    ConnectableObservable.prototype.connect = function () {
	        var source = this.source;
	        var subscription = this.subscription;
	        if (subscription && !subscription.isUnsubscribed) {
	            return subscription;
	        }
	        subscription = source.subscribe(this.getSubject());
	        subscription.add(new ConnectableSubscription(this));
	        return (this.subscription = subscription);
	    };
	    ConnectableObservable.prototype.refCount = function () {
	        return new RefCountObservable(this);
	    };
	    /**
	     * This method is opened for `ConnectableSubscription`.
	     * Not to call from others.
	     */
	    ConnectableObservable.prototype._closeSubscription = function () {
	        this.subject = null;
	        this.subscription = null;
	    };
	    return ConnectableObservable;
	}(Observable_1.Observable));
	exports.ConnectableObservable = ConnectableObservable;
	/**
	 * We need this JSDoc comment for affecting ESDoc.
	 * @ignore
	 * @extends {Ignored}
	 */
	var ConnectableSubscription = (function (_super) {
	    __extends(ConnectableSubscription, _super);
	    function ConnectableSubscription(connectable) {
	        _super.call(this);
	        this.connectable = connectable;
	    }
	    ConnectableSubscription.prototype._unsubscribe = function () {
	        var connectable = this.connectable;
	        connectable._closeSubscription();
	        this.connectable = null;
	    };
	    return ConnectableSubscription;
	}(Subscription_1.Subscription));
	/**
	 * We need this JSDoc comment for affecting ESDoc.
	 * @ignore
	 * @extends {Ignored}
	 */
	var RefCountObservable = (function (_super) {
	    __extends(RefCountObservable, _super);
	    function RefCountObservable(connectable, refCount) {
	        if (refCount === void 0) { refCount = 0; }
	        _super.call(this);
	        this.connectable = connectable;
	        this.refCount = refCount;
	    }
	    RefCountObservable.prototype._subscribe = function (subscriber) {
	        var connectable = this.connectable;
	        var refCountSubscriber = new RefCountSubscriber(subscriber, this);
	        var subscription = connectable.subscribe(refCountSubscriber);
	        if (!subscription.isUnsubscribed && ++this.refCount === 1) {
	            refCountSubscriber.connection = this.connection = connectable.connect();
	        }
	        return subscription;
	    };
	    return RefCountObservable;
	}(Observable_1.Observable));
	/**
	 * We need this JSDoc comment for affecting ESDoc.
	 * @ignore
	 * @extends {Ignored}
	 */
	var RefCountSubscriber = (function (_super) {
	    __extends(RefCountSubscriber, _super);
	    function RefCountSubscriber(destination, refCountObservable) {
	        _super.call(this, null);
	        this.destination = destination;
	        this.refCountObservable = refCountObservable;
	        this.connection = refCountObservable.connection;
	        destination.add(this);
	    }
	    RefCountSubscriber.prototype._next = function (value) {
	        this.destination.next(value);
	    };
	    RefCountSubscriber.prototype._error = function (err) {
	        this._resetConnectable();
	        this.destination.error(err);
	    };
	    RefCountSubscriber.prototype._complete = function () {
	        this._resetConnectable();
	        this.destination.complete();
	    };
	    RefCountSubscriber.prototype._resetConnectable = function () {
	        var observable = this.refCountObservable;
	        var obsConnection = observable.connection;
	        var subConnection = this.connection;
	        if (subConnection && subConnection === obsConnection) {
	            observable.refCount = 0;
	            obsConnection.unsubscribe();
	            observable.connection = null;
	            this.unsubscribe();
	        }
	    };
	    RefCountSubscriber.prototype._unsubscribe = function () {
	        var observable = this.refCountObservable;
	        if (observable.refCount === 0) {
	            return;
	        }
	        if (--observable.refCount === 0) {
	            var obsConnection = observable.connection;
	            var subConnection = this.connection;
	            if (subConnection && subConnection === obsConnection) {
	                obsConnection.unsubscribe();
	                observable.connection = null;
	            }
	        }
	    };
	    return RefCountSubscriber;
	}(Subscriber_1.Subscriber));
	//# sourceMappingURL=ConnectableObservable.js.map

/***/ },
/* 144 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Observable_1 = __webpack_require__(4);
	var scan_1 = __webpack_require__(145);
	Observable_1.Observable.prototype.scan = scan_1.scan;
	//# sourceMappingURL=scan.js.map

/***/ },
/* 145 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Subscriber_1 = __webpack_require__(8);
	/**
	 * Applies an accumulation function over the source Observable, and returns each
	 * intermediate result, with an optional seed value.
	 *
	 * <span class="informal">It's like {@link reduce}, but emits the current
	 * accumulation whenever the source emits a value.</span>
	 *
	 * <img src="./img/scan.png" width="100%">
	 *
	 * Combines together all values emitted on the source, using an accumulator
	 * function that knows how to join a new source value into the accumulation from
	 * the past. Is similar to {@link reduce}, but emits the intermediate
	 * accumulations.
	 *
	 * Returns an Observable that applies a specified `accumulator` function to each
	 * item emitted by the source Observable. If a `seed` value is specified, then
	 * that value will be used as the initial value for the accumulator. If no seed
	 * value is specified, the first item of the source is used as the seed.
	 *
	 * @example <caption>Count the number of click events</caption>
	 * var clicks = Rx.Observable.fromEvent(document, 'click');
	 * var ones = clicks.mapTo(1);
	 * var seed = 0;
	 * var count = ones.scan((acc, one) => acc + one, seed);
	 * count.subscribe(x => console.log(x));
	 *
	 * @see {@link expand}
	 * @see {@link mergeScan}
	 * @see {@link reduce}
	 *
	 * @param {function(acc: R, value: T, index: number): R} accumulator
	 * The accumulator function called on each source value.
	 * @param {T|R} [seed] The initial accumulation value.
	 * @return {Observable<R>} An observable of the accumulated values.
	 * @method scan
	 * @owner Observable
	 */
	function scan(accumulator, seed) {
	    return this.lift(new ScanOperator(accumulator, seed));
	}
	exports.scan = scan;
	var ScanOperator = (function () {
	    function ScanOperator(accumulator, seed) {
	        this.accumulator = accumulator;
	        this.seed = seed;
	    }
	    ScanOperator.prototype.call = function (subscriber, source) {
	        return source._subscribe(new ScanSubscriber(subscriber, this.accumulator, this.seed));
	    };
	    return ScanOperator;
	}());
	/**
	 * We need this JSDoc comment for affecting ESDoc.
	 * @ignore
	 * @extends {Ignored}
	 */
	var ScanSubscriber = (function (_super) {
	    __extends(ScanSubscriber, _super);
	    function ScanSubscriber(destination, accumulator, seed) {
	        _super.call(this, destination);
	        this.accumulator = accumulator;
	        this.index = 0;
	        this.accumulatorSet = false;
	        this.seed = seed;
	        this.accumulatorSet = typeof seed !== 'undefined';
	    }
	    Object.defineProperty(ScanSubscriber.prototype, "seed", {
	        get: function () {
	            return this._seed;
	        },
	        set: function (value) {
	            this.accumulatorSet = true;
	            this._seed = value;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    ScanSubscriber.prototype._next = function (value) {
	        if (!this.accumulatorSet) {
	            this.seed = value;
	            this.destination.next(value);
	        }
	        else {
	            return this._tryNext(value);
	        }
	    };
	    ScanSubscriber.prototype._tryNext = function (value) {
	        var index = this.index++;
	        var result;
	        try {
	            result = this.accumulator(this.seed, value, index);
	        }
	        catch (err) {
	            this.destination.error(err);
	        }
	        this.seed = result;
	        this.destination.next(result);
	    };
	    return ScanSubscriber;
	}(Subscriber_1.Subscriber));
	//# sourceMappingURL=scan.js.map

/***/ },
/* 146 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Observable_1 = __webpack_require__(4);
	var toArray_1 = __webpack_require__(147);
	Observable_1.Observable.prototype.toArray = toArray_1.toArray;
	//# sourceMappingURL=toArray.js.map

/***/ },
/* 147 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Subscriber_1 = __webpack_require__(8);
	/**
	 * @return {Observable<any[]>|WebSocketSubject<T>|Observable<T>}
	 * @method toArray
	 * @owner Observable
	 */
	function toArray() {
	    return this.lift(new ToArrayOperator());
	}
	exports.toArray = toArray;
	var ToArrayOperator = (function () {
	    function ToArrayOperator() {
	    }
	    ToArrayOperator.prototype.call = function (subscriber, source) {
	        return source._subscribe(new ToArraySubscriber(subscriber));
	    };
	    return ToArrayOperator;
	}());
	/**
	 * We need this JSDoc comment for affecting ESDoc.
	 * @ignore
	 * @extends {Ignored}
	 */
	var ToArraySubscriber = (function (_super) {
	    __extends(ToArraySubscriber, _super);
	    function ToArraySubscriber(destination) {
	        _super.call(this, destination);
	        this.array = [];
	    }
	    ToArraySubscriber.prototype._next = function (x) {
	        this.array.push(x);
	    };
	    ToArraySubscriber.prototype._complete = function () {
	        this.destination.next(this.array);
	        this.destination.complete();
	    };
	    return ToArraySubscriber;
	}(Subscriber_1.Subscriber));
	//# sourceMappingURL=toArray.js.map

/***/ },
/* 148 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Observable_1 = __webpack_require__(4);
	var take_1 = __webpack_require__(149);
	Observable_1.Observable.prototype.take = take_1.take;
	//# sourceMappingURL=take.js.map

/***/ },
/* 149 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Subscriber_1 = __webpack_require__(8);
	var ArgumentOutOfRangeError_1 = __webpack_require__(150);
	var EmptyObservable_1 = __webpack_require__(24);
	/**
	 * Emits only the first `count` values emitted by the source Observable.
	 *
	 * <span class="informal">Takes the first `count` values from the source, then
	 * completes.</span>
	 *
	 * <img src="./img/take.png" width="100%">
	 *
	 * `take` returns an Observable that emits only the first `count` values emitted
	 * by the source Observable. If the source emits fewer than `count` values then
	 * all of its values are emitted. After that, it completes, regardless if the
	 * source completes.
	 *
	 * @example <caption>Take the first 5 seconds of an infinite 1-second interval Observable</caption>
	 * var interval = Rx.Observable.interval(1000);
	 * var five = interval.take(5);
	 * five.subscribe(x => console.log(x));
	 *
	 * @see {@link takeLast}
	 * @see {@link takeUntil}
	 * @see {@link takeWhile}
	 * @see {@link skip}
	 *
	 * @throws {ArgumentOutOfRangeError} When using `take(i)`, it delivers an
	 * ArgumentOutOrRangeError to the Observer's `error` callback if `i < 0`.
	 *
	 * @param {number} count The maximum number of `next` values to emit.
	 * @return {Observable<T>} An Observable that emits only the first `count`
	 * values emitted by the source Observable, or all of the values from the source
	 * if the source emits fewer than `count` values.
	 * @method take
	 * @owner Observable
	 */
	function take(count) {
	    if (count === 0) {
	        return new EmptyObservable_1.EmptyObservable();
	    }
	    else {
	        return this.lift(new TakeOperator(count));
	    }
	}
	exports.take = take;
	var TakeOperator = (function () {
	    function TakeOperator(total) {
	        this.total = total;
	        if (this.total < 0) {
	            throw new ArgumentOutOfRangeError_1.ArgumentOutOfRangeError;
	        }
	    }
	    TakeOperator.prototype.call = function (subscriber, source) {
	        return source._subscribe(new TakeSubscriber(subscriber, this.total));
	    };
	    return TakeOperator;
	}());
	/**
	 * We need this JSDoc comment for affecting ESDoc.
	 * @ignore
	 * @extends {Ignored}
	 */
	var TakeSubscriber = (function (_super) {
	    __extends(TakeSubscriber, _super);
	    function TakeSubscriber(destination, total) {
	        _super.call(this, destination);
	        this.total = total;
	        this.count = 0;
	    }
	    TakeSubscriber.prototype._next = function (value) {
	        var total = this.total;
	        if (++this.count <= total) {
	            this.destination.next(value);
	            if (this.count === total) {
	                this.destination.complete();
	                this.unsubscribe();
	            }
	        }
	    };
	    return TakeSubscriber;
	}(Subscriber_1.Subscriber));
	//# sourceMappingURL=take.js.map

/***/ },
/* 150 */
/***/ function(module, exports) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	/**
	 * An error thrown when an element was queried at a certain index of an
	 * Observable, but no such index or position exists in that sequence.
	 *
	 * @see {@link elementAt}
	 * @see {@link take}
	 * @see {@link takeLast}
	 *
	 * @class ArgumentOutOfRangeError
	 */
	var ArgumentOutOfRangeError = (function (_super) {
	    __extends(ArgumentOutOfRangeError, _super);
	    function ArgumentOutOfRangeError() {
	        _super.call(this, 'argument out of range');
	        this.name = 'ArgumentOutOfRangeError';
	    }
	    return ArgumentOutOfRangeError;
	}(Error));
	exports.ArgumentOutOfRangeError = ArgumentOutOfRangeError;
	//# sourceMappingURL=ArgumentOutOfRangeError.js.map

/***/ },
/* 151 */
/***/ function(module, exports, __webpack_require__) {

	var sentenceCase = __webpack_require__(152)
	
	/**
	 * Snake case a string.
	 *
	 * @param  {String} str
	 * @param  {String} [locale]
	 * @return {String}
	 */
	module.exports = function (str, locale) {
	  return sentenceCase(str, locale, '_')
	}


/***/ },
/* 152 */
/***/ function(module, exports, __webpack_require__) {

	var lowerCase = __webpack_require__(153)
	
	var NON_WORD_REGEXP = __webpack_require__(154)
	var CAMEL_CASE_REGEXP = __webpack_require__(155)
	var TRAILING_DIGIT_REGEXP = __webpack_require__(156)
	
	/**
	 * Sentence case a string.
	 *
	 * @param  {String} str
	 * @param  {String} locale
	 * @param  {String} replacement
	 * @return {String}
	 */
	module.exports = function (str, locale, replacement) {
	  if (str == null) {
	    return ''
	  }
	
	  replacement = replacement || ' '
	
	  function replace (match, index, string) {
	    if (index === 0 || index === (string.length - match.length)) {
	      return ''
	    }
	
	    return replacement
	  }
	
	  str = String(str)
	    // Support camel case ("camelCase" -> "camel Case").
	    .replace(CAMEL_CASE_REGEXP, '$1 $2')
	    // Support digit groups ("test2012" -> "test 2012").
	    .replace(TRAILING_DIGIT_REGEXP, '$1 $2')
	    // Remove all non-word characters and replace with a single space.
	    .replace(NON_WORD_REGEXP, replace)
	
	  // Lower case the entire string.
	  return lowerCase(str, locale)
	}


/***/ },
/* 153 */
/***/ function(module, exports) {

	/**
	 * Special language-specific overrides.
	 *
	 * Source: ftp://ftp.unicode.org/Public/UCD/latest/ucd/SpecialCasing.txt
	 *
	 * @type {Object}
	 */
	var LANGUAGES = {
	  tr: {
	    regexp: /\u0130|\u0049|\u0049\u0307/g,
	    map: {
	      '\u0130': '\u0069',
	      '\u0049': '\u0131',
	      '\u0049\u0307': '\u0069'
	    }
	  },
	  az: {
	    regexp: /[\u0130]/g,
	    map: {
	      '\u0130': '\u0069',
	      '\u0049': '\u0131',
	      '\u0049\u0307': '\u0069'
	    }
	  },
	  lt: {
	    regexp: /[\u0049\u004A\u012E\u00CC\u00CD\u0128]/g,
	    map: {
	      '\u0049': '\u0069\u0307',
	      '\u004A': '\u006A\u0307',
	      '\u012E': '\u012F\u0307',
	      '\u00CC': '\u0069\u0307\u0300',
	      '\u00CD': '\u0069\u0307\u0301',
	      '\u0128': '\u0069\u0307\u0303'
	    }
	  }
	}
	
	/**
	 * Lowercase a string.
	 *
	 * @param  {String} str
	 * @return {String}
	 */
	module.exports = function (str, locale) {
	  var lang = LANGUAGES[locale]
	
	  str = str == null ? '' : String(str)
	
	  if (lang) {
	    str = str.replace(lang.regexp, function (m) { return lang.map[m] })
	  }
	
	  return str.toLowerCase()
	}


/***/ },
/* 154 */
/***/ function(module, exports) {

	module.exports = /[^\u0041-\u005A\u0061-\u007A\u00AA\u00B5\u00BA\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0\u08A2-\u08AC\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097F\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA697\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC\u0030-\u0039\u00B2\u00B3\u00B9\u00BC-\u00BE\u0660-\u0669\u06F0-\u06F9\u07C0-\u07C9\u0966-\u096F\u09E6-\u09EF\u09F4-\u09F9\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0B72-\u0B77\u0BE6-\u0BF2\u0C66-\u0C6F\u0C78-\u0C7E\u0CE6-\u0CEF\u0D66-\u0D75\u0E50-\u0E59\u0ED0-\u0ED9\u0F20-\u0F33\u1040-\u1049\u1090-\u1099\u1369-\u137C\u16EE-\u16F0\u17E0-\u17E9\u17F0-\u17F9\u1810-\u1819\u1946-\u194F\u19D0-\u19DA\u1A80-\u1A89\u1A90-\u1A99\u1B50-\u1B59\u1BB0-\u1BB9\u1C40-\u1C49\u1C50-\u1C59\u2070\u2074-\u2079\u2080-\u2089\u2150-\u2182\u2185-\u2189\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2CFD\u3007\u3021-\u3029\u3038-\u303A\u3192-\u3195\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\uA620-\uA629\uA6E6-\uA6EF\uA830-\uA835\uA8D0-\uA8D9\uA900-\uA909\uA9D0-\uA9D9\uAA50-\uAA59\uABF0-\uABF9\uFF10-\uFF19]+/g


/***/ },
/* 155 */
/***/ function(module, exports) {

	module.exports = /([\u0061-\u007A\u00B5\u00DF-\u00F6\u00F8-\u00FF\u0101\u0103\u0105\u0107\u0109\u010B\u010D\u010F\u0111\u0113\u0115\u0117\u0119\u011B\u011D\u011F\u0121\u0123\u0125\u0127\u0129\u012B\u012D\u012F\u0131\u0133\u0135\u0137\u0138\u013A\u013C\u013E\u0140\u0142\u0144\u0146\u0148\u0149\u014B\u014D\u014F\u0151\u0153\u0155\u0157\u0159\u015B\u015D\u015F\u0161\u0163\u0165\u0167\u0169\u016B\u016D\u016F\u0171\u0173\u0175\u0177\u017A\u017C\u017E-\u0180\u0183\u0185\u0188\u018C\u018D\u0192\u0195\u0199-\u019B\u019E\u01A1\u01A3\u01A5\u01A8\u01AA\u01AB\u01AD\u01B0\u01B4\u01B6\u01B9\u01BA\u01BD-\u01BF\u01C6\u01C9\u01CC\u01CE\u01D0\u01D2\u01D4\u01D6\u01D8\u01DA\u01DC\u01DD\u01DF\u01E1\u01E3\u01E5\u01E7\u01E9\u01EB\u01ED\u01EF\u01F0\u01F3\u01F5\u01F9\u01FB\u01FD\u01FF\u0201\u0203\u0205\u0207\u0209\u020B\u020D\u020F\u0211\u0213\u0215\u0217\u0219\u021B\u021D\u021F\u0221\u0223\u0225\u0227\u0229\u022B\u022D\u022F\u0231\u0233-\u0239\u023C\u023F\u0240\u0242\u0247\u0249\u024B\u024D\u024F-\u0293\u0295-\u02AF\u0371\u0373\u0377\u037B-\u037D\u0390\u03AC-\u03CE\u03D0\u03D1\u03D5-\u03D7\u03D9\u03DB\u03DD\u03DF\u03E1\u03E3\u03E5\u03E7\u03E9\u03EB\u03ED\u03EF-\u03F3\u03F5\u03F8\u03FB\u03FC\u0430-\u045F\u0461\u0463\u0465\u0467\u0469\u046B\u046D\u046F\u0471\u0473\u0475\u0477\u0479\u047B\u047D\u047F\u0481\u048B\u048D\u048F\u0491\u0493\u0495\u0497\u0499\u049B\u049D\u049F\u04A1\u04A3\u04A5\u04A7\u04A9\u04AB\u04AD\u04AF\u04B1\u04B3\u04B5\u04B7\u04B9\u04BB\u04BD\u04BF\u04C2\u04C4\u04C6\u04C8\u04CA\u04CC\u04CE\u04CF\u04D1\u04D3\u04D5\u04D7\u04D9\u04DB\u04DD\u04DF\u04E1\u04E3\u04E5\u04E7\u04E9\u04EB\u04ED\u04EF\u04F1\u04F3\u04F5\u04F7\u04F9\u04FB\u04FD\u04FF\u0501\u0503\u0505\u0507\u0509\u050B\u050D\u050F\u0511\u0513\u0515\u0517\u0519\u051B\u051D\u051F\u0521\u0523\u0525\u0527\u0561-\u0587\u1D00-\u1D2B\u1D6B-\u1D77\u1D79-\u1D9A\u1E01\u1E03\u1E05\u1E07\u1E09\u1E0B\u1E0D\u1E0F\u1E11\u1E13\u1E15\u1E17\u1E19\u1E1B\u1E1D\u1E1F\u1E21\u1E23\u1E25\u1E27\u1E29\u1E2B\u1E2D\u1E2F\u1E31\u1E33\u1E35\u1E37\u1E39\u1E3B\u1E3D\u1E3F\u1E41\u1E43\u1E45\u1E47\u1E49\u1E4B\u1E4D\u1E4F\u1E51\u1E53\u1E55\u1E57\u1E59\u1E5B\u1E5D\u1E5F\u1E61\u1E63\u1E65\u1E67\u1E69\u1E6B\u1E6D\u1E6F\u1E71\u1E73\u1E75\u1E77\u1E79\u1E7B\u1E7D\u1E7F\u1E81\u1E83\u1E85\u1E87\u1E89\u1E8B\u1E8D\u1E8F\u1E91\u1E93\u1E95-\u1E9D\u1E9F\u1EA1\u1EA3\u1EA5\u1EA7\u1EA9\u1EAB\u1EAD\u1EAF\u1EB1\u1EB3\u1EB5\u1EB7\u1EB9\u1EBB\u1EBD\u1EBF\u1EC1\u1EC3\u1EC5\u1EC7\u1EC9\u1ECB\u1ECD\u1ECF\u1ED1\u1ED3\u1ED5\u1ED7\u1ED9\u1EDB\u1EDD\u1EDF\u1EE1\u1EE3\u1EE5\u1EE7\u1EE9\u1EEB\u1EED\u1EEF\u1EF1\u1EF3\u1EF5\u1EF7\u1EF9\u1EFB\u1EFD\u1EFF-\u1F07\u1F10-\u1F15\u1F20-\u1F27\u1F30-\u1F37\u1F40-\u1F45\u1F50-\u1F57\u1F60-\u1F67\u1F70-\u1F7D\u1F80-\u1F87\u1F90-\u1F97\u1FA0-\u1FA7\u1FB0-\u1FB4\u1FB6\u1FB7\u1FBE\u1FC2-\u1FC4\u1FC6\u1FC7\u1FD0-\u1FD3\u1FD6\u1FD7\u1FE0-\u1FE7\u1FF2-\u1FF4\u1FF6\u1FF7\u210A\u210E\u210F\u2113\u212F\u2134\u2139\u213C\u213D\u2146-\u2149\u214E\u2184\u2C30-\u2C5E\u2C61\u2C65\u2C66\u2C68\u2C6A\u2C6C\u2C71\u2C73\u2C74\u2C76-\u2C7B\u2C81\u2C83\u2C85\u2C87\u2C89\u2C8B\u2C8D\u2C8F\u2C91\u2C93\u2C95\u2C97\u2C99\u2C9B\u2C9D\u2C9F\u2CA1\u2CA3\u2CA5\u2CA7\u2CA9\u2CAB\u2CAD\u2CAF\u2CB1\u2CB3\u2CB5\u2CB7\u2CB9\u2CBB\u2CBD\u2CBF\u2CC1\u2CC3\u2CC5\u2CC7\u2CC9\u2CCB\u2CCD\u2CCF\u2CD1\u2CD3\u2CD5\u2CD7\u2CD9\u2CDB\u2CDD\u2CDF\u2CE1\u2CE3\u2CE4\u2CEC\u2CEE\u2CF3\u2D00-\u2D25\u2D27\u2D2D\uA641\uA643\uA645\uA647\uA649\uA64B\uA64D\uA64F\uA651\uA653\uA655\uA657\uA659\uA65B\uA65D\uA65F\uA661\uA663\uA665\uA667\uA669\uA66B\uA66D\uA681\uA683\uA685\uA687\uA689\uA68B\uA68D\uA68F\uA691\uA693\uA695\uA697\uA723\uA725\uA727\uA729\uA72B\uA72D\uA72F-\uA731\uA733\uA735\uA737\uA739\uA73B\uA73D\uA73F\uA741\uA743\uA745\uA747\uA749\uA74B\uA74D\uA74F\uA751\uA753\uA755\uA757\uA759\uA75B\uA75D\uA75F\uA761\uA763\uA765\uA767\uA769\uA76B\uA76D\uA76F\uA771-\uA778\uA77A\uA77C\uA77F\uA781\uA783\uA785\uA787\uA78C\uA78E\uA791\uA793\uA7A1\uA7A3\uA7A5\uA7A7\uA7A9\uA7FA\uFB00-\uFB06\uFB13-\uFB17\uFF41-\uFF5A])([\u0041-\u005A\u00C0-\u00D6\u00D8-\u00DE\u0100\u0102\u0104\u0106\u0108\u010A\u010C\u010E\u0110\u0112\u0114\u0116\u0118\u011A\u011C\u011E\u0120\u0122\u0124\u0126\u0128\u012A\u012C\u012E\u0130\u0132\u0134\u0136\u0139\u013B\u013D\u013F\u0141\u0143\u0145\u0147\u014A\u014C\u014E\u0150\u0152\u0154\u0156\u0158\u015A\u015C\u015E\u0160\u0162\u0164\u0166\u0168\u016A\u016C\u016E\u0170\u0172\u0174\u0176\u0178\u0179\u017B\u017D\u0181\u0182\u0184\u0186\u0187\u0189-\u018B\u018E-\u0191\u0193\u0194\u0196-\u0198\u019C\u019D\u019F\u01A0\u01A2\u01A4\u01A6\u01A7\u01A9\u01AC\u01AE\u01AF\u01B1-\u01B3\u01B5\u01B7\u01B8\u01BC\u01C4\u01C7\u01CA\u01CD\u01CF\u01D1\u01D3\u01D5\u01D7\u01D9\u01DB\u01DE\u01E0\u01E2\u01E4\u01E6\u01E8\u01EA\u01EC\u01EE\u01F1\u01F4\u01F6-\u01F8\u01FA\u01FC\u01FE\u0200\u0202\u0204\u0206\u0208\u020A\u020C\u020E\u0210\u0212\u0214\u0216\u0218\u021A\u021C\u021E\u0220\u0222\u0224\u0226\u0228\u022A\u022C\u022E\u0230\u0232\u023A\u023B\u023D\u023E\u0241\u0243-\u0246\u0248\u024A\u024C\u024E\u0370\u0372\u0376\u0386\u0388-\u038A\u038C\u038E\u038F\u0391-\u03A1\u03A3-\u03AB\u03CF\u03D2-\u03D4\u03D8\u03DA\u03DC\u03DE\u03E0\u03E2\u03E4\u03E6\u03E8\u03EA\u03EC\u03EE\u03F4\u03F7\u03F9\u03FA\u03FD-\u042F\u0460\u0462\u0464\u0466\u0468\u046A\u046C\u046E\u0470\u0472\u0474\u0476\u0478\u047A\u047C\u047E\u0480\u048A\u048C\u048E\u0490\u0492\u0494\u0496\u0498\u049A\u049C\u049E\u04A0\u04A2\u04A4\u04A6\u04A8\u04AA\u04AC\u04AE\u04B0\u04B2\u04B4\u04B6\u04B8\u04BA\u04BC\u04BE\u04C0\u04C1\u04C3\u04C5\u04C7\u04C9\u04CB\u04CD\u04D0\u04D2\u04D4\u04D6\u04D8\u04DA\u04DC\u04DE\u04E0\u04E2\u04E4\u04E6\u04E8\u04EA\u04EC\u04EE\u04F0\u04F2\u04F4\u04F6\u04F8\u04FA\u04FC\u04FE\u0500\u0502\u0504\u0506\u0508\u050A\u050C\u050E\u0510\u0512\u0514\u0516\u0518\u051A\u051C\u051E\u0520\u0522\u0524\u0526\u0531-\u0556\u10A0-\u10C5\u10C7\u10CD\u1E00\u1E02\u1E04\u1E06\u1E08\u1E0A\u1E0C\u1E0E\u1E10\u1E12\u1E14\u1E16\u1E18\u1E1A\u1E1C\u1E1E\u1E20\u1E22\u1E24\u1E26\u1E28\u1E2A\u1E2C\u1E2E\u1E30\u1E32\u1E34\u1E36\u1E38\u1E3A\u1E3C\u1E3E\u1E40\u1E42\u1E44\u1E46\u1E48\u1E4A\u1E4C\u1E4E\u1E50\u1E52\u1E54\u1E56\u1E58\u1E5A\u1E5C\u1E5E\u1E60\u1E62\u1E64\u1E66\u1E68\u1E6A\u1E6C\u1E6E\u1E70\u1E72\u1E74\u1E76\u1E78\u1E7A\u1E7C\u1E7E\u1E80\u1E82\u1E84\u1E86\u1E88\u1E8A\u1E8C\u1E8E\u1E90\u1E92\u1E94\u1E9E\u1EA0\u1EA2\u1EA4\u1EA6\u1EA8\u1EAA\u1EAC\u1EAE\u1EB0\u1EB2\u1EB4\u1EB6\u1EB8\u1EBA\u1EBC\u1EBE\u1EC0\u1EC2\u1EC4\u1EC6\u1EC8\u1ECA\u1ECC\u1ECE\u1ED0\u1ED2\u1ED4\u1ED6\u1ED8\u1EDA\u1EDC\u1EDE\u1EE0\u1EE2\u1EE4\u1EE6\u1EE8\u1EEA\u1EEC\u1EEE\u1EF0\u1EF2\u1EF4\u1EF6\u1EF8\u1EFA\u1EFC\u1EFE\u1F08-\u1F0F\u1F18-\u1F1D\u1F28-\u1F2F\u1F38-\u1F3F\u1F48-\u1F4D\u1F59\u1F5B\u1F5D\u1F5F\u1F68-\u1F6F\u1FB8-\u1FBB\u1FC8-\u1FCB\u1FD8-\u1FDB\u1FE8-\u1FEC\u1FF8-\u1FFB\u2102\u2107\u210B-\u210D\u2110-\u2112\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u2130-\u2133\u213E\u213F\u2145\u2183\u2C00-\u2C2E\u2C60\u2C62-\u2C64\u2C67\u2C69\u2C6B\u2C6D-\u2C70\u2C72\u2C75\u2C7E-\u2C80\u2C82\u2C84\u2C86\u2C88\u2C8A\u2C8C\u2C8E\u2C90\u2C92\u2C94\u2C96\u2C98\u2C9A\u2C9C\u2C9E\u2CA0\u2CA2\u2CA4\u2CA6\u2CA8\u2CAA\u2CAC\u2CAE\u2CB0\u2CB2\u2CB4\u2CB6\u2CB8\u2CBA\u2CBC\u2CBE\u2CC0\u2CC2\u2CC4\u2CC6\u2CC8\u2CCA\u2CCC\u2CCE\u2CD0\u2CD2\u2CD4\u2CD6\u2CD8\u2CDA\u2CDC\u2CDE\u2CE0\u2CE2\u2CEB\u2CED\u2CF2\uA640\uA642\uA644\uA646\uA648\uA64A\uA64C\uA64E\uA650\uA652\uA654\uA656\uA658\uA65A\uA65C\uA65E\uA660\uA662\uA664\uA666\uA668\uA66A\uA66C\uA680\uA682\uA684\uA686\uA688\uA68A\uA68C\uA68E\uA690\uA692\uA694\uA696\uA722\uA724\uA726\uA728\uA72A\uA72C\uA72E\uA732\uA734\uA736\uA738\uA73A\uA73C\uA73E\uA740\uA742\uA744\uA746\uA748\uA74A\uA74C\uA74E\uA750\uA752\uA754\uA756\uA758\uA75A\uA75C\uA75E\uA760\uA762\uA764\uA766\uA768\uA76A\uA76C\uA76E\uA779\uA77B\uA77D\uA77E\uA780\uA782\uA784\uA786\uA78B\uA78D\uA790\uA792\uA7A0\uA7A2\uA7A4\uA7A6\uA7A8\uA7AA\uFF21-\uFF3A\u0030-\u0039\u00B2\u00B3\u00B9\u00BC-\u00BE\u0660-\u0669\u06F0-\u06F9\u07C0-\u07C9\u0966-\u096F\u09E6-\u09EF\u09F4-\u09F9\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0B72-\u0B77\u0BE6-\u0BF2\u0C66-\u0C6F\u0C78-\u0C7E\u0CE6-\u0CEF\u0D66-\u0D75\u0E50-\u0E59\u0ED0-\u0ED9\u0F20-\u0F33\u1040-\u1049\u1090-\u1099\u1369-\u137C\u16EE-\u16F0\u17E0-\u17E9\u17F0-\u17F9\u1810-\u1819\u1946-\u194F\u19D0-\u19DA\u1A80-\u1A89\u1A90-\u1A99\u1B50-\u1B59\u1BB0-\u1BB9\u1C40-\u1C49\u1C50-\u1C59\u2070\u2074-\u2079\u2080-\u2089\u2150-\u2182\u2185-\u2189\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2CFD\u3007\u3021-\u3029\u3038-\u303A\u3192-\u3195\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\uA620-\uA629\uA6E6-\uA6EF\uA830-\uA835\uA8D0-\uA8D9\uA900-\uA909\uA9D0-\uA9D9\uAA50-\uAA59\uABF0-\uABF9\uFF10-\uFF19])/g


/***/ },
/* 156 */
/***/ function(module, exports) {

	module.exports = /([\u0030-\u0039\u00B2\u00B3\u00B9\u00BC-\u00BE\u0660-\u0669\u06F0-\u06F9\u07C0-\u07C9\u0966-\u096F\u09E6-\u09EF\u09F4-\u09F9\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0B72-\u0B77\u0BE6-\u0BF2\u0C66-\u0C6F\u0C78-\u0C7E\u0CE6-\u0CEF\u0D66-\u0D75\u0E50-\u0E59\u0ED0-\u0ED9\u0F20-\u0F33\u1040-\u1049\u1090-\u1099\u1369-\u137C\u16EE-\u16F0\u17E0-\u17E9\u17F0-\u17F9\u1810-\u1819\u1946-\u194F\u19D0-\u19DA\u1A80-\u1A89\u1A90-\u1A99\u1B50-\u1B59\u1BB0-\u1BB9\u1C40-\u1C49\u1C50-\u1C59\u2070\u2074-\u2079\u2080-\u2089\u2150-\u2182\u2185-\u2189\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2CFD\u3007\u3021-\u3029\u3038-\u303A\u3192-\u3195\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\uA620-\uA629\uA6E6-\uA6EF\uA830-\uA835\uA8D0-\uA8D9\uA900-\uA909\uA9D0-\uA9D9\uAA50-\uAA59\uABF0-\uABF9\uFF10-\uFF19])([^\u0030-\u0039\u00B2\u00B3\u00B9\u00BC-\u00BE\u0660-\u0669\u06F0-\u06F9\u07C0-\u07C9\u0966-\u096F\u09E6-\u09EF\u09F4-\u09F9\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0B72-\u0B77\u0BE6-\u0BF2\u0C66-\u0C6F\u0C78-\u0C7E\u0CE6-\u0CEF\u0D66-\u0D75\u0E50-\u0E59\u0ED0-\u0ED9\u0F20-\u0F33\u1040-\u1049\u1090-\u1099\u1369-\u137C\u16EE-\u16F0\u17E0-\u17E9\u17F0-\u17F9\u1810-\u1819\u1946-\u194F\u19D0-\u19DA\u1A80-\u1A89\u1A90-\u1A99\u1B50-\u1B59\u1BB0-\u1BB9\u1C40-\u1C49\u1C50-\u1C59\u2070\u2074-\u2079\u2080-\u2089\u2150-\u2182\u2185-\u2189\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2CFD\u3007\u3021-\u3029\u3038-\u303A\u3192-\u3195\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\uA620-\uA629\uA6E6-\uA6EF\uA830-\uA835\uA8D0-\uA8D9\uA900-\uA909\uA9D0-\uA9D9\uAA50-\uAA59\uABF0-\uABF9\uFF10-\uFF19])/g


/***/ },
/* 157 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	exports.default = checkArgs;
	
	var _ordinal = __webpack_require__(158);
	
	var _ordinal2 = _interopRequireDefault(_ordinal);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// Validation helper
	function checkArgs(name, args) {
	  var _ref = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
	
	  var _ref$nullable = _ref.nullable;
	  var nullable = _ref$nullable === undefined ? false : _ref$nullable;
	  var _ref$minArgs = _ref.minArgs;
	  var minArgs = _ref$minArgs === undefined ? 1 : _ref$minArgs;
	  var _ref$maxArgs = _ref.maxArgs;
	  var maxArgs = _ref$maxArgs === undefined ? 1 : _ref$maxArgs;
	
	  if (minArgs === maxArgs && args.length !== minArgs) {
	    var plural = minArgs === 1 ? '' : 's';
	    throw new Error(name + ' must receive exactly ' + minArgs + ' argument' + plural);
	  }
	  if (args.length < minArgs) {
	    var plural1 = minArgs === 1 ? '' : 's';
	    throw new Error(name + ' must receive at least ' + minArgs + ' argument' + plural1 + '.');
	  }
	  if (args.length > maxArgs) {
	    var plural2 = maxArgs === 1 ? '' : 's';
	    throw new Error(name + ' accepts at most ' + maxArgs + ' argument' + plural2 + '.');
	  }
	  for (var i = 0; i < args.length; i++) {
	    if (!nullable && args[i] === null) {
	      var ordinality = maxArgs !== 1 ? ' ' + (0, _ordinal2.default)(i + 1) : '';
	      throw new Error('The' + ordinality + ' argument to ' + name + ' must be non-null');
	    }
	    if (args[i] === undefined) {
	      throw new Error('The ' + (0, _ordinal2.default)(i + 1) + ' argument to ' + name + ' must be defined');
	    }
	  }
	}
	//# sourceMappingURL=check-args.js.map

/***/ },
/* 158 */
/***/ function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	exports.default = ordinal;
	function ordinal(x) {
	  if ([11, 12, 13].indexOf(x) !== -1) {
	    return x + "th";
	  } else if (x % 10 === 1) {
	    return x + "st";
	  } else if (x % 10 === 2) {
	    return x + "nd";
	  } else if (x % 10 === 3) {
	    return x + "rd";
	  }
	  return x + "th";
	}
	//# sourceMappingURL=ordinal.js.map

/***/ },
/* 159 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _typeof2 = __webpack_require__(52);
	
	var _typeof3 = _interopRequireDefault(_typeof2);
	
	exports.default = validIndexValue;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// Checks whether the return value is a valid primary or secondary
	// index value in RethinkDB.
	function validIndexValue(val) {
	  if (val === null) {
	    return false;
	  }
	  if (['boolean', 'number', 'string'].indexOf(typeof val === 'undefined' ? 'undefined' : (0, _typeof3.default)(val)) !== -1) {
	    return true;
	  }
	  if (val instanceof ArrayBuffer) {
	    return true;
	  }
	  if (val instanceof Date) {
	    return true;
	  }
	  if (Array.isArray(val)) {
	    var _ret = function () {
	      var isValid = true;
	      val.forEach(function (v) {
	        isValid = isValid && validIndexValue(v);
	      });
	      return {
	        v: isValid
	      };
	    }();
	
	    if ((typeof _ret === 'undefined' ? 'undefined' : (0, _typeof3.default)(_ret)) === "object") return _ret.v;
	  }
	  return false;
	}
	//# sourceMappingURL=valid-index-value.js.map

/***/ },
/* 160 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _typeof2 = __webpack_require__(52);
	
	var _typeof3 = _interopRequireDefault(_typeof2);
	
	exports.deserialize = deserialize;
	exports.serialize = serialize;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var PRIMITIVES = ['string', 'number', 'boolean', 'function', 'symbol'];
	
	function modifyObject(doc) {
	  Object.keys(doc).forEach(function (key) {
	    doc[key] = deserialize(doc[key]);
	  });
	  return doc;
	}
	
	function deserialize(value) {
	  if (value == null) {
	    return value;
	  } else if (PRIMITIVES.indexOf(typeof value === 'undefined' ? 'undefined' : (0, _typeof3.default)(value)) !== -1) {
	    return value;
	  } else if (Array.isArray(value)) {
	    return value.map(deserialize);
	  } else if (value.$reql_type$ === 'TIME') {
	    var date = new Date();
	    date.setTime(value.epoch_time * 1000);
	    return date;
	  } else {
	    return modifyObject(value);
	  }
	}
	
	function jsonifyObject(doc) {
	  Object.keys(doc).forEach(function (key) {
	    doc[key] = serialize(doc[key]);
	  });
	  return doc;
	}
	
	function serialize(value) {
	  if (value == null) {
	    return value;
	  } else if (PRIMITIVES.indexOf(typeof value === 'undefined' ? 'undefined' : (0, _typeof3.default)(value)) !== -1) {
	    return value;
	  } else if (Array.isArray(value)) {
	    return value.map(serialize);
	  } else if (value instanceof Date) {
	    return {
	      $reql_type$: 'TIME',
	      epoch_time: value.getTime() / 1000,
	      // Rethink will serialize this as "+00:00", but accepts Z
	      timezone: 'Z'
	    };
	  } else {
	    return jsonifyObject(value);
	  }
	}
	//# sourceMappingURL=serialization.js.map

/***/ },
/* 161 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _classCallCheck2 = __webpack_require__(128);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	var _possibleConstructorReturn2 = __webpack_require__(51);
	
	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);
	
	var _inherits2 = __webpack_require__(120);
	
	var _inherits3 = _interopRequireDefault(_inherits2);
	
	var _AsyncSubject = __webpack_require__(162);
	
	var _BehaviorSubject = __webpack_require__(163);
	
	var _Subject2 = __webpack_require__(134);
	
	var _Observable = __webpack_require__(4);
	
	__webpack_require__(164);
	
	__webpack_require__(46);
	
	__webpack_require__(168);
	
	var _serialization = __webpack_require__(160);
	
	var _logging = __webpack_require__(170);
	
	var _engine = __webpack_require__(171);
	
	var _engine2 = _interopRequireDefault(_engine);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var transports = void 0;
	
	if (typeof window === 'undefined') {
	  transports = ['websocket'];
	}
	
	var PROTOCOL_VERSION = 'rethinkdb-horizon-v0';
	
	// Before connecting the first time
	var STATUS_UNCONNECTED = { type: 'unconnected' };
	// After the websocket is opened and handshake is completed
	var STATUS_READY = { type: 'ready' };
	// After unconnected, maybe before or after connected. Any socket level error
	var STATUS_ERROR = { type: 'error' };
	// Occurs when the socket closes
	var STATUS_DISCONNECTED = { type: 'disconnected' };
	
	var ProtocolError = function (_Error) {
	  (0, _inherits3.default)(ProtocolError, _Error);
	
	  function ProtocolError(msg, errorCode) {
	    (0, _classCallCheck3.default)(this, ProtocolError);
	
	    var _this = (0, _possibleConstructorReturn3.default)(this, _Error.call(this, msg));
	
	    _this.errorCode = errorCode;
	    return _this;
	  }
	
	  ProtocolError.prototype.toString = function toString() {
	    return this.message + ' (Code: ' + this.errorCode + ')';
	  };
	
	  return ProtocolError;
	}(Error);
	
	// Wraps native websockets with a Subject, which is both an Subscriber
	// and an Observable (it is bi-directional after all!). This
	// implementation is adapted from Rx.DOM.fromWebSocket and
	// RxSocketSubject by Ben Lesh, but it also deals with some simple
	// protocol level things like serializing from/to JSON, routing
	// request_ids, looking at the `state` field to decide when an
	// observable is closed.
	
	
	var HorizonSocket = function (_Subject) {
	  (0, _inherits3.default)(HorizonSocket, _Subject);
	
	  function HorizonSocket(host, secure, path, handshaker) {
	    (0, _classCallCheck3.default)(this, HorizonSocket);
	
	    var hostString = 'ws' + (secure ? 's' : '') + '://' + host;
	    var msgBuffer = [];
	    var ws = void 0,
	        handshakeDisp = void 0;
	    // Handshake is an asyncsubject because we want it to always cache
	    // the last value it received, like a promise
	    var handshake = new _AsyncSubject.AsyncSubject();
	    var statusSubject = new _BehaviorSubject.BehaviorSubject(STATUS_UNCONNECTED);
	
	    var isOpen = function isOpen() {
	      return Boolean(ws) && ws.readyState === 'open';
	    };
	
	    // Serializes to a string before sending
	    function wsSend(msg) {
	      var stringMsg = JSON.stringify((0, _serialization.serialize)(msg));
	
	      ws.send(stringMsg);
	    }
	
	    // This is the observable part of the Subject. It forwards events
	    // from the underlying websocket
	    var socketObservable = _Observable.Observable.create(function (subscriber) {
	      ws = (0, _engine2.default)(hostString, {
	        protocol: PROTOCOL_VERSION,
	        path: '/' + path,
	        transports: transports
	      });
	
	      ws.on('error', function () {
	        // If the websocket experiences the error, we forward it through
	        // to the observable. Unfortunately, the event we receive in
	        // this callback doesn't tell us much of anything, so there's no
	        // reason to forward it on and we just send a generic error.
	        statusSubject.next(STATUS_ERROR);
	        var errMsg = 'Websocket ' + hostString + ' experienced an error';
	        subscriber.error(new Error(errMsg));
	      });
	
	      ws.on('open', function () {
	        ws.on('message', function (data) {
	          var deserialized = (0, _serialization.deserialize)(JSON.parse(data));
	          (0, _logging.log)('Received', deserialized);
	          subscriber.next(deserialized);
	        });
	
	        ws.on('close', function (e) {
	          // This will happen if the socket is closed by the server If
	          // .close is called from the client (see closeSocket), this
	          // listener will be removed
	          statusSubject.next(STATUS_DISCONNECTED);
	          if (e !== 'forced close') {
	            subscriber.error(new Error('Socket closed unexpectedly with code: ' + e));
	          } else {
	            subscriber.complete();
	          }
	        });
	
	        // Send the handshake
	        handshakeDisp = _this2.makeRequest(handshaker()).subscribe(function (x) {
	          handshake.next(x);
	          handshake.complete();
	          statusSubject.next(STATUS_READY);
	        }, function (err) {
	          return handshake.error(err);
	        }, function () {
	          return handshake.complete();
	        });
	        // Send any messages that have been buffered
	        while (msgBuffer.length > 0) {
	          var msg = msgBuffer.shift();
	          (0, _logging.log)('Sending buffered:', msg);
	          wsSend(msg);
	        }
	      });
	      return function () {
	        if (handshakeDisp) {
	          handshakeDisp.unsubscribe();
	        }
	        // This is the "unsubscribe" method on the final Subject
	        closeSocket(1000, '');
	      };
	    }).share(); // This makes it a "hot" observable, and refCounts it
	    // Note possible edge cases: the `share` operator is equivalent to
	    // .multicast(() => new Subject()).refCount() // RxJS 5
	    // .multicast(new Subject()).refCount() // RxJS 4
	
	    // This is the Subscriber part of the Subject. How we can send stuff
	    // over the websocket
	    var socketSubscriber = {
	      next: function next(messageToSend) {
	        // When next is called on this subscriber
	        // Note: If we aren't ready, the message is silently dropped
	        if (isOpen()) {
	          (0, _logging.log)('Sending', messageToSend);
	          wsSend(messageToSend); // wsSend serializes to a string
	        } else {
	            (0, _logging.log)('Buffering', messageToSend);
	            msgBuffer.push(messageToSend);
	          }
	      },
	      error: function error(_error) {
	        // The subscriber is receiving an error. Better close the
	        // websocket with an error
	        if (!_error.code) {
	          throw new Error('no code specified. Be sure to pass ' + '{ code: ###, reason: "" } to error()');
	        }
	        closeSocket(_error.code, _error.reason);
	      },
	      complete: function complete() {
	        // complete for the subscriber here is equivalent to "close
	        // this socket successfully (which is what code 1000 is)"
	        closeSocket(1000, '');
	      }
	    };
	
	    function closeSocket(code, reason) {
	      statusSubject.next(STATUS_DISCONNECTED);
	      if (!code) {
	        ws.close(); // successful close
	      } else {
	          ws.close(code, reason);
	        }
	    }
	
	    // Subscriptions will be the observable containing all
	    // queries/writes/changefeed requests. Specifically, the documents
	    // that initiate them, each one with a different request_id
	
	    var _this2 = (0, _possibleConstructorReturn3.default)(this, _Subject.call(this, socketSubscriber, socketObservable));
	
	    var subscriptions = new _Subject2.Subject();
	    // Unsubscriptions is similar, only it holds only requests to
	    // close a particular request_id on the server. Currently we only
	    // need these for changefeeds.
	    var unsubscriptions = new _Subject2.Subject();
	    var outgoing = _Observable.Observable.merge(subscriptions, unsubscriptions);
	    // How many requests are outstanding
	    var activeRequests = 0;
	    // Monotonically increasing counter for request_ids
	    var requestCounter = 0;
	    // Unsubscriber for subscriptions/unsubscriptions
	    var subDisp = null;
	    // Now that super has been called, we can add attributes to this
	    _this2.handshake = handshake;
	    // Lets external users keep track of the current websocket status
	    // without causing it to connect
	    _this2.status = statusSubject;
	
	    var incrementActive = function incrementActive() {
	      if (++activeRequests === 1) {
	        // We subscribe the socket itself to the subscription and
	        // unsubscription requests. Since the socket is both an
	        // observable and an subscriber. Here it's acting as an subscriber,
	        // watching our requests.
	        subDisp = outgoing.subscribe(_this2);
	      }
	    };
	
	    // Decrement the number of active requests on the socket, and
	    // close the socket if we're the last request
	    var decrementActive = function decrementActive() {
	      if (--activeRequests === 0) {
	        subDisp.unsubscribe();
	      }
	    };
	
	    // This is used externally to send requests to the server
	    _this2.makeRequest = function (rawRequest) {
	      return _Observable.Observable.create(function (reqSubscriber) {
	        // Get a new request id
	        var request_id = requestCounter++;
	        // Add the request id to the request and the unsubscribe request
	        // if there is one
	        rawRequest.request_id = request_id;
	        var unsubscribeRequest = { request_id: request_id, type: 'end_subscription' };
	        // First, increment activeRequests and decide if we need to
	        // connect to the socket
	        incrementActive();
	
	        // Now send the request to the server
	        subscriptions.next(rawRequest);
	
	        // Create an observable from the socket that filters by request_id
	        var unsubscribeFilter = _this2.filter(function (x) {
	          return x.request_id === request_id;
	        }).subscribe(function (resp) {
	          // Need to faithfully end the stream if there is an error
	          if (resp.error !== undefined) {
	            reqSubscriber.error(new ProtocolError(resp.error, resp.error_code));
	          } else if (resp.data !== undefined || resp.token !== undefined) {
	            try {
	              reqSubscriber.next(resp);
	            } catch (e) {}
	          }
	          if (resp.state === 'synced') {
	            // Create a little dummy object for sync notifications
	            reqSubscriber.next({
	              type: 'state',
	              state: 'synced'
	            });
	          } else if (resp.state === 'complete') {
	            reqSubscriber.complete();
	          }
	        }, function (err) {
	          return reqSubscriber.error(err);
	        }, function () {
	          return reqSubscriber.complete();
	        });
	        return function () {
	          // Unsubscribe if necessary
	          unsubscriptions.next(unsubscribeRequest);
	          decrementActive();
	          unsubscribeFilter.unsubscribe();
	        };
	      });
	    };
	    return _this2;
	  }
	
	  return HorizonSocket;
	}(_Subject2.Subject);
	
	module.exports = HorizonSocket;
	//# sourceMappingURL=socket.js.map

/***/ },
/* 162 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Subject_1 = __webpack_require__(134);
	/**
	 * @class AsyncSubject<T>
	 */
	var AsyncSubject = (function (_super) {
	    __extends(AsyncSubject, _super);
	    function AsyncSubject() {
	        _super.apply(this, arguments);
	        this.value = null;
	        this.hasNext = false;
	    }
	    AsyncSubject.prototype._subscribe = function (subscriber) {
	        if (this.hasCompleted && this.hasNext) {
	            subscriber.next(this.value);
	        }
	        return _super.prototype._subscribe.call(this, subscriber);
	    };
	    AsyncSubject.prototype._next = function (value) {
	        this.value = value;
	        this.hasNext = true;
	    };
	    AsyncSubject.prototype._complete = function () {
	        var index = -1;
	        var observers = this.observers;
	        var len = observers.length;
	        // optimization to block our SubjectSubscriptions from
	        // splicing themselves out of the observers list one by one.
	        this.isUnsubscribed = true;
	        if (this.hasNext) {
	            while (++index < len) {
	                var o = observers[index];
	                o.next(this.value);
	                o.complete();
	            }
	        }
	        else {
	            while (++index < len) {
	                observers[index].complete();
	            }
	        }
	        this.isUnsubscribed = false;
	        this.unsubscribe();
	    };
	    return AsyncSubject;
	}(Subject_1.Subject));
	exports.AsyncSubject = AsyncSubject;
	//# sourceMappingURL=AsyncSubject.js.map

/***/ },
/* 163 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Subject_1 = __webpack_require__(134);
	var throwError_1 = __webpack_require__(136);
	var ObjectUnsubscribedError_1 = __webpack_require__(137);
	/**
	 * @class BehaviorSubject<T>
	 */
	var BehaviorSubject = (function (_super) {
	    __extends(BehaviorSubject, _super);
	    function BehaviorSubject(_value) {
	        _super.call(this);
	        this._value = _value;
	    }
	    BehaviorSubject.prototype.getValue = function () {
	        if (this.hasErrored) {
	            throwError_1.throwError(this.errorValue);
	        }
	        else if (this.isUnsubscribed) {
	            throwError_1.throwError(new ObjectUnsubscribedError_1.ObjectUnsubscribedError());
	        }
	        else {
	            return this._value;
	        }
	    };
	    Object.defineProperty(BehaviorSubject.prototype, "value", {
	        get: function () {
	            return this.getValue();
	        },
	        enumerable: true,
	        configurable: true
	    });
	    BehaviorSubject.prototype._subscribe = function (subscriber) {
	        var subscription = _super.prototype._subscribe.call(this, subscriber);
	        if (subscription && !subscription.isUnsubscribed) {
	            subscriber.next(this._value);
	        }
	        return subscription;
	    };
	    BehaviorSubject.prototype._next = function (value) {
	        _super.prototype._next.call(this, this._value = value);
	    };
	    BehaviorSubject.prototype._error = function (err) {
	        this.hasErrored = true;
	        _super.prototype._error.call(this, this.errorValue = err);
	    };
	    return BehaviorSubject;
	}(Subject_1.Subject));
	exports.BehaviorSubject = BehaviorSubject;
	//# sourceMappingURL=BehaviorSubject.js.map

/***/ },
/* 164 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Observable_1 = __webpack_require__(4);
	var merge_1 = __webpack_require__(165);
	Observable_1.Observable.merge = merge_1.merge;
	//# sourceMappingURL=merge.js.map

/***/ },
/* 165 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var merge_1 = __webpack_require__(166);
	exports.merge = merge_1.mergeStatic;
	//# sourceMappingURL=merge.js.map

/***/ },
/* 166 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var ArrayObservable_1 = __webpack_require__(22);
	var mergeAll_1 = __webpack_require__(167);
	var isScheduler_1 = __webpack_require__(25);
	/**
	 * Creates an output Observable which concurrently emits all values from every
	 * given input Observable.
	 *
	 * <span class="informal">Flattens multiple Observables together by blending
	 * their values into one Observable.</span>
	 *
	 * <img src="./img/merge.png" width="100%">
	 *
	 * `merge` subscribes to each given input Observable (either the source or an
	 * Observable given as argument), and simply forwards (without doing any
	 * transformation) all the values from all the input Observables to the output
	 * Observable. The output Observable only completes once all input Observables
	 * have completed. Any error delivered by an input Observable will be immediately
	 * emitted on the output Observable.
	 *
	 * @example <caption>Merge together two Observables: 1s interval and clicks</caption>
	 * var clicks = Rx.Observable.fromEvent(document, 'click');
	 * var timer = Rx.Observable.interval(1000);
	 * var clicksOrTimer = clicks.merge(timer);
	 * clicksOrTimer.subscribe(x => console.log(x));
	 *
	 * @example <caption>Merge together 3 Observables, but only 2 run concurrently</caption>
	 * var timer1 = Rx.Observable.interval(1000).take(10);
	 * var timer2 = Rx.Observable.interval(2000).take(6);
	 * var timer3 = Rx.Observable.interval(500).take(10);
	 * var concurrent = 2; // the argument
	 * var merged = timer1.merge(timer2, timer3, concurrent);
	 * merged.subscribe(x => console.log(x));
	 *
	 * @see {@link mergeAll}
	 * @see {@link mergeMap}
	 * @see {@link mergeMapTo}
	 * @see {@link mergeScan}
	 *
	 * @param {Observable} other An input Observable to merge with the source
	 * Observable. More than one input Observables may be given as argument.
	 * @param {number} [concurrent=Number.POSITIVE_INFINITY] Maximum number of input
	 * Observables being subscribed to concurrently.
	 * @param {Scheduler} [scheduler=null] The Scheduler to use for managing
	 * concurrency of input Observables.
	 * @return {Observable} an Observable that emits items that are the result of
	 * every input Observable.
	 * @method merge
	 * @owner Observable
	 */
	function merge() {
	    var observables = [];
	    for (var _i = 0; _i < arguments.length; _i++) {
	        observables[_i - 0] = arguments[_i];
	    }
	    observables.unshift(this);
	    return mergeStatic.apply(this, observables);
	}
	exports.merge = merge;
	/* tslint:enable:max-line-length */
	/**
	 * Creates an output Observable which concurrently emits all values from every
	 * given input Observable.
	 *
	 * <span class="informal">Flattens multiple Observables together by blending
	 * their values into one Observable.</span>
	 *
	 * <img src="./img/merge.png" width="100%">
	 *
	 * `merge` subscribes to each given input Observable (as arguments), and simply
	 * forwards (without doing any transformation) all the values from all the input
	 * Observables to the output Observable. The output Observable only completes
	 * once all input Observables have completed. Any error delivered by an input
	 * Observable will be immediately emitted on the output Observable.
	 *
	 * @example <caption>Merge together two Observables: 1s interval and clicks</caption>
	 * var clicks = Rx.Observable.fromEvent(document, 'click');
	 * var timer = Rx.Observable.interval(1000);
	 * var clicksOrTimer = Rx.Observable.merge(clicks, timer);
	 * clicksOrTimer.subscribe(x => console.log(x));
	 *
	 * @example <caption>Merge together 3 Observables, but only 2 run concurrently</caption>
	 * var timer1 = Rx.Observable.interval(1000).take(10);
	 * var timer2 = Rx.Observable.interval(2000).take(6);
	 * var timer3 = Rx.Observable.interval(500).take(10);
	 * var concurrent = 2; // the argument
	 * var merged = Rx.Observable.merge(timer1, timer2, timer3, concurrent);
	 * merged.subscribe(x => console.log(x));
	 *
	 * @see {@link mergeAll}
	 * @see {@link mergeMap}
	 * @see {@link mergeMapTo}
	 * @see {@link mergeScan}
	 *
	 * @param {Observable} input1 An input Observable to merge with others.
	 * @param {Observable} input2 An input Observable to merge with others.
	 * @param {number} [concurrent=Number.POSITIVE_INFINITY] Maximum number of input
	 * Observables being subscribed to concurrently.
	 * @param {Scheduler} [scheduler=null] The Scheduler to use for managing
	 * concurrency of input Observables.
	 * @return {Observable} an Observable that emits items that are the result of
	 * every input Observable.
	 * @static true
	 * @name merge
	 * @owner Observable
	 */
	function mergeStatic() {
	    var observables = [];
	    for (var _i = 0; _i < arguments.length; _i++) {
	        observables[_i - 0] = arguments[_i];
	    }
	    var concurrent = Number.POSITIVE_INFINITY;
	    var scheduler = null;
	    var last = observables[observables.length - 1];
	    if (isScheduler_1.isScheduler(last)) {
	        scheduler = observables.pop();
	        if (observables.length > 1 && typeof observables[observables.length - 1] === 'number') {
	            concurrent = observables.pop();
	        }
	    }
	    else if (typeof last === 'number') {
	        concurrent = observables.pop();
	    }
	    if (observables.length === 1) {
	        return observables[0];
	    }
	    return new ArrayObservable_1.ArrayObservable(observables, scheduler).lift(new mergeAll_1.MergeAllOperator(concurrent));
	}
	exports.mergeStatic = mergeStatic;
	//# sourceMappingURL=merge.js.map

/***/ },
/* 167 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var OuterSubscriber_1 = __webpack_require__(43);
	var subscribeToResult_1 = __webpack_require__(41);
	/**
	 * Converts a higher-order Observable into a first-order Observable which
	 * concurrently delivers all values that are emitted on the inner Observables.
	 *
	 * <span class="informal">Flattens an Observable-of-Observables.</span>
	 *
	 * <img src="./img/mergeAll.png" width="100%">
	 *
	 * `mergeAll` subscribes to an Observable that emits Observables, also known as
	 * a higher-order Observable. Each time it observes one of these emitted inner
	 * Observables, it subscribes to that and delivers all the values from the
	 * inner Observable on the output Observable. The output Observable only
	 * completes once all inner Observables have completed. Any error delivered by
	 * a inner Observable will be immediately emitted on the output Observable.
	 *
	 * @example <caption>Spawn a new interval Observable for each click event, and blend their outputs as one Observable</caption>
	 * var clicks = Rx.Observable.fromEvent(document, 'click');
	 * var higherOrder = clicks.map((ev) => Rx.Observable.interval(1000));
	 * var firstOrder = higherOrder.mergeAll();
	 * firstOrder.subscribe(x => console.log(x));
	 *
	 * @example <caption>Count from 0 to 9 every second for each click, but only allow 2 concurrent timers</caption>
	 * var clicks = Rx.Observable.fromEvent(document, 'click');
	 * var higherOrder = clicks.map((ev) => Rx.Observable.interval(1000).take(10));
	 * var firstOrder = higherOrder.mergeAll(2);
	 * firstOrder.subscribe(x => console.log(x));
	 *
	 * @see {@link combineAll}
	 * @see {@link concatAll}
	 * @see {@link exhaust}
	 * @see {@link merge}
	 * @see {@link mergeMap}
	 * @see {@link mergeMapTo}
	 * @see {@link mergeScan}
	 * @see {@link switch}
	 * @see {@link zipAll}
	 *
	 * @param {number} [concurrent=Number.POSITIVE_INFINITY] Maximum number of inner
	 * Observables being subscribed to concurrently.
	 * @return {Observable} An Observable that emits values coming from all the
	 * inner Observables emitted by the source Observable.
	 * @method mergeAll
	 * @owner Observable
	 */
	function mergeAll(concurrent) {
	    if (concurrent === void 0) { concurrent = Number.POSITIVE_INFINITY; }
	    return this.lift(new MergeAllOperator(concurrent));
	}
	exports.mergeAll = mergeAll;
	var MergeAllOperator = (function () {
	    function MergeAllOperator(concurrent) {
	        this.concurrent = concurrent;
	    }
	    MergeAllOperator.prototype.call = function (observer, source) {
	        return source._subscribe(new MergeAllSubscriber(observer, this.concurrent));
	    };
	    return MergeAllOperator;
	}());
	exports.MergeAllOperator = MergeAllOperator;
	/**
	 * We need this JSDoc comment for affecting ESDoc.
	 * @ignore
	 * @extends {Ignored}
	 */
	var MergeAllSubscriber = (function (_super) {
	    __extends(MergeAllSubscriber, _super);
	    function MergeAllSubscriber(destination, concurrent) {
	        _super.call(this, destination);
	        this.concurrent = concurrent;
	        this.hasCompleted = false;
	        this.buffer = [];
	        this.active = 0;
	    }
	    MergeAllSubscriber.prototype._next = function (observable) {
	        if (this.active < this.concurrent) {
	            this.active++;
	            this.add(subscribeToResult_1.subscribeToResult(this, observable));
	        }
	        else {
	            this.buffer.push(observable);
	        }
	    };
	    MergeAllSubscriber.prototype._complete = function () {
	        this.hasCompleted = true;
	        if (this.active === 0 && this.buffer.length === 0) {
	            this.destination.complete();
	        }
	    };
	    MergeAllSubscriber.prototype.notifyComplete = function (innerSub) {
	        var buffer = this.buffer;
	        this.remove(innerSub);
	        this.active--;
	        if (buffer.length > 0) {
	            this._next(buffer.shift());
	        }
	        else if (this.active === 0 && this.hasCompleted) {
	            this.destination.complete();
	        }
	    };
	    return MergeAllSubscriber;
	}(OuterSubscriber_1.OuterSubscriber));
	exports.MergeAllSubscriber = MergeAllSubscriber;
	//# sourceMappingURL=mergeAll.js.map

/***/ },
/* 168 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Observable_1 = __webpack_require__(4);
	var share_1 = __webpack_require__(169);
	Observable_1.Observable.prototype.share = share_1.share;
	//# sourceMappingURL=share.js.map

/***/ },
/* 169 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var multicast_1 = __webpack_require__(142);
	var Subject_1 = __webpack_require__(134);
	function shareSubjectFactory() {
	    return new Subject_1.Subject();
	}
	/**
	 * Returns a new Observable that multicasts (shares) the original Observable. As long as there is at least one
	 * Subscriber this Observable will be subscribed and emitting data. When all subscribers have unsubscribed it will
	 * unsubscribe from the source Observable. Because the Observable is multicasting it makes the stream `hot`.
	 * This is an alias for .publish().refCount().
	 *
	 * <img src="./img/share.png" width="100%">
	 *
	 * @return {Observable<T>} an Observable that upon connection causes the source Observable to emit items to its Observers
	 * @method share
	 * @owner Observable
	 */
	function share() {
	    return multicast_1.multicast.call(this, shareSubjectFactory).refCount();
	}
	exports.share = share;
	;
	//# sourceMappingURL=share.js.map

/***/ },
/* 170 */
/***/ function(module, exports) {

	"use strict";
	
	// Logging moved to its own module to avoid circular imports
	
	var debug = false;
	
	module.exports = {
	  log: function log() {
	    var _console;
	
	    return debug ? (_console = console).log.apply(_console, arguments) : undefined;
	  },
	  logError: function logError() {
	    var _console2;
	
	    return debug ? (_console2 = console).error.apply(_console2, arguments) : undefined;
	  },
	  enableLogging: function enableLogging() {
	    var deb = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];
	    debug = deb;
	  }
	};
	//# sourceMappingURL=logging.js.map

/***/ },
/* 171 */
/***/ function(module, exports, __webpack_require__) {

	
	module.exports =  __webpack_require__(172);


/***/ },
/* 172 */
/***/ function(module, exports, __webpack_require__) {

	
	module.exports = __webpack_require__(173);
	
	/**
	 * Exports parser
	 *
	 * @api public
	 *
	 */
	module.exports.parser = __webpack_require__(180);


/***/ },
/* 173 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/**
	 * Module dependencies.
	 */
	
	var transports = __webpack_require__(174);
	var Emitter = __webpack_require__(189);
	var debug = __webpack_require__(193)('engine.io-client:socket');
	var index = __webpack_require__(199);
	var parser = __webpack_require__(180);
	var parseuri = __webpack_require__(200);
	var parsejson = __webpack_require__(201);
	var parseqs = __webpack_require__(190);
	
	/**
	 * Module exports.
	 */
	
	module.exports = Socket;
	
	/**
	 * Noop function.
	 *
	 * @api private
	 */
	
	function noop(){}
	
	/**
	 * Socket constructor.
	 *
	 * @param {String|Object} uri or options
	 * @param {Object} options
	 * @api public
	 */
	
	function Socket(uri, opts){
	  if (!(this instanceof Socket)) return new Socket(uri, opts);
	
	  opts = opts || {};
	
	  if (uri && 'object' == typeof uri) {
	    opts = uri;
	    uri = null;
	  }
	
	  if (uri) {
	    uri = parseuri(uri);
	    opts.hostname = uri.host;
	    opts.secure = uri.protocol == 'https' || uri.protocol == 'wss';
	    opts.port = uri.port;
	    if (uri.query) opts.query = uri.query;
	  } else if (opts.host) {
	    opts.hostname = parseuri(opts.host).host;
	  }
	
	  this.secure = null != opts.secure ? opts.secure :
	    (global.location && 'https:' == location.protocol);
	
	  if (opts.hostname && !opts.port) {
	    // if no port is specified manually, use the protocol default
	    opts.port = this.secure ? '443' : '80';
	  }
	
	  this.agent = opts.agent || false;
	  this.hostname = opts.hostname ||
	    (global.location ? location.hostname : 'localhost');
	  this.port = opts.port || (global.location && location.port ?
	       location.port :
	       (this.secure ? 443 : 80));
	  this.query = opts.query || {};
	  if ('string' == typeof this.query) this.query = parseqs.decode(this.query);
	  this.upgrade = false !== opts.upgrade;
	  this.path = (opts.path || '/engine.io').replace(/\/$/, '') + '/';
	  this.forceJSONP = !!opts.forceJSONP;
	  this.jsonp = false !== opts.jsonp;
	  this.forceBase64 = !!opts.forceBase64;
	  this.enablesXDR = !!opts.enablesXDR;
	  this.timestampParam = opts.timestampParam || 't';
	  this.timestampRequests = opts.timestampRequests;
	  this.transports = opts.transports || ['polling', 'websocket'];
	  this.readyState = '';
	  this.writeBuffer = [];
	  this.policyPort = opts.policyPort || 843;
	  this.rememberUpgrade = opts.rememberUpgrade || false;
	  this.binaryType = null;
	  this.onlyBinaryUpgrades = opts.onlyBinaryUpgrades;
	  this.perMessageDeflate = false !== opts.perMessageDeflate ? (opts.perMessageDeflate || {}) : false;
	
	  if (true === this.perMessageDeflate) this.perMessageDeflate = {};
	  if (this.perMessageDeflate && null == this.perMessageDeflate.threshold) {
	    this.perMessageDeflate.threshold = 1024;
	  }
	
	  // SSL options for Node.js client
	  this.pfx = opts.pfx || null;
	  this.key = opts.key || null;
	  this.passphrase = opts.passphrase || null;
	  this.cert = opts.cert || null;
	  this.ca = opts.ca || null;
	  this.ciphers = opts.ciphers || null;
	  this.rejectUnauthorized = opts.rejectUnauthorized === undefined ? true : opts.rejectUnauthorized;
	
	  // other options for Node.js client
	  var freeGlobal = typeof global == 'object' && global;
	  if (freeGlobal.global === freeGlobal) {
	    if (opts.extraHeaders && Object.keys(opts.extraHeaders).length > 0) {
	      this.extraHeaders = opts.extraHeaders;
	    }
	  }
	
	  this.open();
	}
	
	Socket.priorWebsocketSuccess = false;
	
	/**
	 * Mix in `Emitter`.
	 */
	
	Emitter(Socket.prototype);
	
	/**
	 * Protocol version.
	 *
	 * @api public
	 */
	
	Socket.protocol = parser.protocol; // this is an int
	
	/**
	 * Expose deps for legacy compatibility
	 * and standalone browser access.
	 */
	
	Socket.Socket = Socket;
	Socket.Transport = __webpack_require__(179);
	Socket.transports = __webpack_require__(174);
	Socket.parser = __webpack_require__(180);
	
	/**
	 * Creates transport of the given type.
	 *
	 * @param {String} transport name
	 * @return {Transport}
	 * @api private
	 */
	
	Socket.prototype.createTransport = function (name) {
	  debug('creating transport "%s"', name);
	  var query = clone(this.query);
	
	  // append engine.io protocol identifier
	  query.EIO = parser.protocol;
	
	  // transport name
	  query.transport = name;
	
	  // session id if we already have one
	  if (this.id) query.sid = this.id;
	
	  var transport = new transports[name]({
	    agent: this.agent,
	    hostname: this.hostname,
	    port: this.port,
	    secure: this.secure,
	    path: this.path,
	    query: query,
	    forceJSONP: this.forceJSONP,
	    jsonp: this.jsonp,
	    forceBase64: this.forceBase64,
	    enablesXDR: this.enablesXDR,
	    timestampRequests: this.timestampRequests,
	    timestampParam: this.timestampParam,
	    policyPort: this.policyPort,
	    socket: this,
	    pfx: this.pfx,
	    key: this.key,
	    passphrase: this.passphrase,
	    cert: this.cert,
	    ca: this.ca,
	    ciphers: this.ciphers,
	    rejectUnauthorized: this.rejectUnauthorized,
	    perMessageDeflate: this.perMessageDeflate,
	    extraHeaders: this.extraHeaders
	  });
	
	  return transport;
	};
	
	function clone (obj) {
	  var o = {};
	  for (var i in obj) {
	    if (obj.hasOwnProperty(i)) {
	      o[i] = obj[i];
	    }
	  }
	  return o;
	}
	
	/**
	 * Initializes transport to use and starts probe.
	 *
	 * @api private
	 */
	Socket.prototype.open = function () {
	  var transport;
	  if (this.rememberUpgrade && Socket.priorWebsocketSuccess && this.transports.indexOf('websocket') != -1) {
	    transport = 'websocket';
	  } else if (0 === this.transports.length) {
	    // Emit error on next tick so it can be listened to
	    var self = this;
	    setTimeout(function() {
	      self.emit('error', 'No transports available');
	    }, 0);
	    return;
	  } else {
	    transport = this.transports[0];
	  }
	  this.readyState = 'opening';
	
	  // Retry with the next transport if the transport is disabled (jsonp: false)
	  try {
	    transport = this.createTransport(transport);
	  } catch (e) {
	    this.transports.shift();
	    this.open();
	    return;
	  }
	
	  transport.open();
	  this.setTransport(transport);
	};
	
	/**
	 * Sets the current transport. Disables the existing one (if any).
	 *
	 * @api private
	 */
	
	Socket.prototype.setTransport = function(transport){
	  debug('setting transport %s', transport.name);
	  var self = this;
	
	  if (this.transport) {
	    debug('clearing existing transport %s', this.transport.name);
	    this.transport.removeAllListeners();
	  }
	
	  // set up transport
	  this.transport = transport;
	
	  // set up transport listeners
	  transport
	  .on('drain', function(){
	    self.onDrain();
	  })
	  .on('packet', function(packet){
	    self.onPacket(packet);
	  })
	  .on('error', function(e){
	    self.onError(e);
	  })
	  .on('close', function(){
	    self.onClose('transport close');
	  });
	};
	
	/**
	 * Probes a transport.
	 *
	 * @param {String} transport name
	 * @api private
	 */
	
	Socket.prototype.probe = function (name) {
	  debug('probing transport "%s"', name);
	  var transport = this.createTransport(name, { probe: 1 })
	    , failed = false
	    , self = this;
	
	  Socket.priorWebsocketSuccess = false;
	
	  function onTransportOpen(){
	    if (self.onlyBinaryUpgrades) {
	      var upgradeLosesBinary = !this.supportsBinary && self.transport.supportsBinary;
	      failed = failed || upgradeLosesBinary;
	    }
	    if (failed) return;
	
	    debug('probe transport "%s" opened', name);
	    transport.send([{ type: 'ping', data: 'probe' }]);
	    transport.once('packet', function (msg) {
	      if (failed) return;
	      if ('pong' == msg.type && 'probe' == msg.data) {
	        debug('probe transport "%s" pong', name);
	        self.upgrading = true;
	        self.emit('upgrading', transport);
	        if (!transport) return;
	        Socket.priorWebsocketSuccess = 'websocket' == transport.name;
	
	        debug('pausing current transport "%s"', self.transport.name);
	        self.transport.pause(function () {
	          if (failed) return;
	          if ('closed' == self.readyState) return;
	          debug('changing transport and sending upgrade packet');
	
	          cleanup();
	
	          self.setTransport(transport);
	          transport.send([{ type: 'upgrade' }]);
	          self.emit('upgrade', transport);
	          transport = null;
	          self.upgrading = false;
	          self.flush();
	        });
	      } else {
	        debug('probe transport "%s" failed', name);
	        var err = new Error('probe error');
	        err.transport = transport.name;
	        self.emit('upgradeError', err);
	      }
	    });
	  }
	
	  function freezeTransport() {
	    if (failed) return;
	
	    // Any callback called by transport should be ignored since now
	    failed = true;
	
	    cleanup();
	
	    transport.close();
	    transport = null;
	  }
	
	  //Handle any error that happens while probing
	  function onerror(err) {
	    var error = new Error('probe error: ' + err);
	    error.transport = transport.name;
	
	    freezeTransport();
	
	    debug('probe transport "%s" failed because of error: %s', name, err);
	
	    self.emit('upgradeError', error);
	  }
	
	  function onTransportClose(){
	    onerror("transport closed");
	  }
	
	  //When the socket is closed while we're probing
	  function onclose(){
	    onerror("socket closed");
	  }
	
	  //When the socket is upgraded while we're probing
	  function onupgrade(to){
	    if (transport && to.name != transport.name) {
	      debug('"%s" works - aborting "%s"', to.name, transport.name);
	      freezeTransport();
	    }
	  }
	
	  //Remove all listeners on the transport and on self
	  function cleanup(){
	    transport.removeListener('open', onTransportOpen);
	    transport.removeListener('error', onerror);
	    transport.removeListener('close', onTransportClose);
	    self.removeListener('close', onclose);
	    self.removeListener('upgrading', onupgrade);
	  }
	
	  transport.once('open', onTransportOpen);
	  transport.once('error', onerror);
	  transport.once('close', onTransportClose);
	
	  this.once('close', onclose);
	  this.once('upgrading', onupgrade);
	
	  transport.open();
	
	};
	
	/**
	 * Called when connection is deemed open.
	 *
	 * @api public
	 */
	
	Socket.prototype.onOpen = function () {
	  debug('socket open');
	  this.readyState = 'open';
	  Socket.priorWebsocketSuccess = 'websocket' == this.transport.name;
	  this.emit('open');
	  this.flush();
	
	  // we check for `readyState` in case an `open`
	  // listener already closed the socket
	  if ('open' == this.readyState && this.upgrade && this.transport.pause) {
	    debug('starting upgrade probes');
	    for (var i = 0, l = this.upgrades.length; i < l; i++) {
	      this.probe(this.upgrades[i]);
	    }
	  }
	};
	
	/**
	 * Handles a packet.
	 *
	 * @api private
	 */
	
	Socket.prototype.onPacket = function (packet) {
	  if ('opening' == this.readyState || 'open' == this.readyState) {
	    debug('socket receive: type "%s", data "%s"', packet.type, packet.data);
	
	    this.emit('packet', packet);
	
	    // Socket is live - any packet counts
	    this.emit('heartbeat');
	
	    switch (packet.type) {
	      case 'open':
	        this.onHandshake(parsejson(packet.data));
	        break;
	
	      case 'pong':
	        this.setPing();
	        this.emit('pong');
	        break;
	
	      case 'error':
	        var err = new Error('server error');
	        err.code = packet.data;
	        this.onError(err);
	        break;
	
	      case 'message':
	        this.emit('data', packet.data);
	        this.emit('message', packet.data);
	        break;
	    }
	  } else {
	    debug('packet received with socket readyState "%s"', this.readyState);
	  }
	};
	
	/**
	 * Called upon handshake completion.
	 *
	 * @param {Object} handshake obj
	 * @api private
	 */
	
	Socket.prototype.onHandshake = function (data) {
	  this.emit('handshake', data);
	  this.id = data.sid;
	  this.transport.query.sid = data.sid;
	  this.upgrades = this.filterUpgrades(data.upgrades);
	  this.pingInterval = data.pingInterval;
	  this.pingTimeout = data.pingTimeout;
	  this.onOpen();
	  // In case open handler closes socket
	  if  ('closed' == this.readyState) return;
	  this.setPing();
	
	  // Prolong liveness of socket on heartbeat
	  this.removeListener('heartbeat', this.onHeartbeat);
	  this.on('heartbeat', this.onHeartbeat);
	};
	
	/**
	 * Resets ping timeout.
	 *
	 * @api private
	 */
	
	Socket.prototype.onHeartbeat = function (timeout) {
	  clearTimeout(this.pingTimeoutTimer);
	  var self = this;
	  self.pingTimeoutTimer = setTimeout(function () {
	    if ('closed' == self.readyState) return;
	    self.onClose('ping timeout');
	  }, timeout || (self.pingInterval + self.pingTimeout));
	};
	
	/**
	 * Pings server every `this.pingInterval` and expects response
	 * within `this.pingTimeout` or closes connection.
	 *
	 * @api private
	 */
	
	Socket.prototype.setPing = function () {
	  var self = this;
	  clearTimeout(self.pingIntervalTimer);
	  self.pingIntervalTimer = setTimeout(function () {
	    debug('writing ping packet - expecting pong within %sms', self.pingTimeout);
	    self.ping();
	    self.onHeartbeat(self.pingTimeout);
	  }, self.pingInterval);
	};
	
	/**
	* Sends a ping packet.
	*
	* @api private
	*/
	
	Socket.prototype.ping = function () {
	  var self = this;
	  this.sendPacket('ping', function(){
	    self.emit('ping');
	  });
	};
	
	/**
	 * Called on `drain` event
	 *
	 * @api private
	 */
	
	Socket.prototype.onDrain = function() {
	  this.writeBuffer.splice(0, this.prevBufferLen);
	
	  // setting prevBufferLen = 0 is very important
	  // for example, when upgrading, upgrade packet is sent over,
	  // and a nonzero prevBufferLen could cause problems on `drain`
	  this.prevBufferLen = 0;
	
	  if (0 === this.writeBuffer.length) {
	    this.emit('drain');
	  } else {
	    this.flush();
	  }
	};
	
	/**
	 * Flush write buffers.
	 *
	 * @api private
	 */
	
	Socket.prototype.flush = function () {
	  if ('closed' != this.readyState && this.transport.writable &&
	    !this.upgrading && this.writeBuffer.length) {
	    debug('flushing %d packets in socket', this.writeBuffer.length);
	    this.transport.send(this.writeBuffer);
	    // keep track of current length of writeBuffer
	    // splice writeBuffer and callbackBuffer on `drain`
	    this.prevBufferLen = this.writeBuffer.length;
	    this.emit('flush');
	  }
	};
	
	/**
	 * Sends a message.
	 *
	 * @param {String} message.
	 * @param {Function} callback function.
	 * @param {Object} options.
	 * @return {Socket} for chaining.
	 * @api public
	 */
	
	Socket.prototype.write =
	Socket.prototype.send = function (msg, options, fn) {
	  this.sendPacket('message', msg, options, fn);
	  return this;
	};
	
	/**
	 * Sends a packet.
	 *
	 * @param {String} packet type.
	 * @param {String} data.
	 * @param {Object} options.
	 * @param {Function} callback function.
	 * @api private
	 */
	
	Socket.prototype.sendPacket = function (type, data, options, fn) {
	  if('function' == typeof data) {
	    fn = data;
	    data = undefined;
	  }
	
	  if ('function' == typeof options) {
	    fn = options;
	    options = null;
	  }
	
	  if ('closing' == this.readyState || 'closed' == this.readyState) {
	    return;
	  }
	
	  options = options || {};
	  options.compress = false !== options.compress;
	
	  var packet = {
	    type: type,
	    data: data,
	    options: options
	  };
	  this.emit('packetCreate', packet);
	  this.writeBuffer.push(packet);
	  if (fn) this.once('flush', fn);
	  this.flush();
	};
	
	/**
	 * Closes the connection.
	 *
	 * @api private
	 */
	
	Socket.prototype.close = function () {
	  if ('opening' == this.readyState || 'open' == this.readyState) {
	    this.readyState = 'closing';
	
	    var self = this;
	
	    if (this.writeBuffer.length) {
	      this.once('drain', function() {
	        if (this.upgrading) {
	          waitForUpgrade();
	        } else {
	          close();
	        }
	      });
	    } else if (this.upgrading) {
	      waitForUpgrade();
	    } else {
	      close();
	    }
	  }
	
	  function close() {
	    self.onClose('forced close');
	    debug('socket closing - telling transport to close');
	    self.transport.close();
	  }
	
	  function cleanupAndClose() {
	    self.removeListener('upgrade', cleanupAndClose);
	    self.removeListener('upgradeError', cleanupAndClose);
	    close();
	  }
	
	  function waitForUpgrade() {
	    // wait for upgrade to finish since we can't send packets while pausing a transport
	    self.once('upgrade', cleanupAndClose);
	    self.once('upgradeError', cleanupAndClose);
	  }
	
	  return this;
	};
	
	/**
	 * Called upon transport error
	 *
	 * @api private
	 */
	
	Socket.prototype.onError = function (err) {
	  debug('socket error %j', err);
	  Socket.priorWebsocketSuccess = false;
	  this.emit('error', err);
	  this.onClose('transport error', err);
	};
	
	/**
	 * Called upon transport close.
	 *
	 * @api private
	 */
	
	Socket.prototype.onClose = function (reason, desc) {
	  if ('opening' == this.readyState || 'open' == this.readyState || 'closing' == this.readyState) {
	    debug('socket close with reason: "%s"', reason);
	    var self = this;
	
	    // clear timers
	    clearTimeout(this.pingIntervalTimer);
	    clearTimeout(this.pingTimeoutTimer);
	
	    // stop event from firing again for transport
	    this.transport.removeAllListeners('close');
	
	    // ensure transport won't stay open
	    this.transport.close();
	
	    // ignore further transport communication
	    this.transport.removeAllListeners();
	
	    // set ready state
	    this.readyState = 'closed';
	
	    // clear session id
	    this.id = null;
	
	    // emit close event
	    this.emit('close', reason, desc);
	
	    // clean buffers after, so users can still
	    // grab the buffers on `close` event
	    self.writeBuffer = [];
	    self.prevBufferLen = 0;
	  }
	};
	
	/**
	 * Filters upgrades, returning only those matching client transports.
	 *
	 * @param {Array} server upgrades
	 * @api private
	 *
	 */
	
	Socket.prototype.filterUpgrades = function (upgrades) {
	  var filteredUpgrades = [];
	  for (var i = 0, j = upgrades.length; i<j; i++) {
	    if (~index(this.transports, upgrades[i])) filteredUpgrades.push(upgrades[i]);
	  }
	  return filteredUpgrades;
	};
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 174 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/**
	 * Module dependencies
	 */
	
	var XMLHttpRequest = __webpack_require__(175);
	var XHR = __webpack_require__(177);
	var JSONP = __webpack_require__(196);
	var websocket = __webpack_require__(197);
	
	/**
	 * Export transports.
	 */
	
	exports.polling = polling;
	exports.websocket = websocket;
	
	/**
	 * Polling transport polymorphic constructor.
	 * Decides on xhr vs jsonp based on feature detection.
	 *
	 * @api private
	 */
	
	function polling(opts){
	  var xhr;
	  var xd = false;
	  var xs = false;
	  var jsonp = false !== opts.jsonp;
	
	  if (global.location) {
	    var isSSL = 'https:' == location.protocol;
	    var port = location.port;
	
	    // some user agents have empty `location.port`
	    if (!port) {
	      port = isSSL ? 443 : 80;
	    }
	
	    xd = opts.hostname != location.hostname || port != opts.port;
	    xs = opts.secure != isSSL;
	  }
	
	  opts.xdomain = xd;
	  opts.xscheme = xs;
	  xhr = new XMLHttpRequest(opts);
	
	  if ('open' in xhr && !opts.forceJSONP) {
	    return new XHR(opts);
	  } else {
	    if (!jsonp) throw new Error('JSONP disabled');
	    return new JSONP(opts);
	  }
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 175 */
/***/ function(module, exports, __webpack_require__) {

	// browser shim for xmlhttprequest module
	var hasCORS = __webpack_require__(176);
	
	module.exports = function(opts) {
	  var xdomain = opts.xdomain;
	
	  // scheme must be same when usign XDomainRequest
	  // http://blogs.msdn.com/b/ieinternals/archive/2010/05/13/xdomainrequest-restrictions-limitations-and-workarounds.aspx
	  var xscheme = opts.xscheme;
	
	  // XDomainRequest has a flow of not sending cookie, therefore it should be disabled as a default.
	  // https://github.com/Automattic/engine.io-client/pull/217
	  var enablesXDR = opts.enablesXDR;
	
	  // XMLHttpRequest can be disabled on IE
	  try {
	    if ('undefined' != typeof XMLHttpRequest && (!xdomain || hasCORS)) {
	      return new XMLHttpRequest();
	    }
	  } catch (e) { }
	
	  // Use XDomainRequest for IE8 if enablesXDR is true
	  // because loading bar keeps flashing when using jsonp-polling
	  // https://github.com/yujiosaka/socke.io-ie8-loading-example
	  try {
	    if ('undefined' != typeof XDomainRequest && !xscheme && enablesXDR) {
	      return new XDomainRequest();
	    }
	  } catch (e) { }
	
	  if (!xdomain) {
	    try {
	      return new ActiveXObject('Microsoft.XMLHTTP');
	    } catch(e) { }
	  }
	}


/***/ },
/* 176 */
/***/ function(module, exports) {

	
	/**
	 * Module exports.
	 *
	 * Logic borrowed from Modernizr:
	 *
	 *   - https://github.com/Modernizr/Modernizr/blob/master/feature-detects/cors.js
	 */
	
	try {
	  module.exports = typeof XMLHttpRequest !== 'undefined' &&
	    'withCredentials' in new XMLHttpRequest();
	} catch (err) {
	  // if XMLHttp support is disabled in IE then it will throw
	  // when trying to create
	  module.exports = false;
	}


/***/ },
/* 177 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/**
	 * Module requirements.
	 */
	
	var XMLHttpRequest = __webpack_require__(175);
	var Polling = __webpack_require__(178);
	var Emitter = __webpack_require__(189);
	var inherit = __webpack_require__(191);
	var debug = __webpack_require__(193)('engine.io-client:polling-xhr');
	
	/**
	 * Module exports.
	 */
	
	module.exports = XHR;
	module.exports.Request = Request;
	
	/**
	 * Empty function
	 */
	
	function empty(){}
	
	/**
	 * XHR Polling constructor.
	 *
	 * @param {Object} opts
	 * @api public
	 */
	
	function XHR(opts){
	  Polling.call(this, opts);
	
	  if (global.location) {
	    var isSSL = 'https:' == location.protocol;
	    var port = location.port;
	
	    // some user agents have empty `location.port`
	    if (!port) {
	      port = isSSL ? 443 : 80;
	    }
	
	    this.xd = opts.hostname != global.location.hostname ||
	      port != opts.port;
	    this.xs = opts.secure != isSSL;
	  } else {
	    this.extraHeaders = opts.extraHeaders;
	  }
	}
	
	/**
	 * Inherits from Polling.
	 */
	
	inherit(XHR, Polling);
	
	/**
	 * XHR supports binary
	 */
	
	XHR.prototype.supportsBinary = true;
	
	/**
	 * Creates a request.
	 *
	 * @param {String} method
	 * @api private
	 */
	
	XHR.prototype.request = function(opts){
	  opts = opts || {};
	  opts.uri = this.uri();
	  opts.xd = this.xd;
	  opts.xs = this.xs;
	  opts.agent = this.agent || false;
	  opts.supportsBinary = this.supportsBinary;
	  opts.enablesXDR = this.enablesXDR;
	
	  // SSL options for Node.js client
	  opts.pfx = this.pfx;
	  opts.key = this.key;
	  opts.passphrase = this.passphrase;
	  opts.cert = this.cert;
	  opts.ca = this.ca;
	  opts.ciphers = this.ciphers;
	  opts.rejectUnauthorized = this.rejectUnauthorized;
	
	  // other options for Node.js client
	  opts.extraHeaders = this.extraHeaders;
	
	  return new Request(opts);
	};
	
	/**
	 * Sends data.
	 *
	 * @param {String} data to send.
	 * @param {Function} called upon flush.
	 * @api private
	 */
	
	XHR.prototype.doWrite = function(data, fn){
	  var isBinary = typeof data !== 'string' && data !== undefined;
	  var req = this.request({ method: 'POST', data: data, isBinary: isBinary });
	  var self = this;
	  req.on('success', fn);
	  req.on('error', function(err){
	    self.onError('xhr post error', err);
	  });
	  this.sendXhr = req;
	};
	
	/**
	 * Starts a poll cycle.
	 *
	 * @api private
	 */
	
	XHR.prototype.doPoll = function(){
	  debug('xhr poll');
	  var req = this.request();
	  var self = this;
	  req.on('data', function(data){
	    self.onData(data);
	  });
	  req.on('error', function(err){
	    self.onError('xhr poll error', err);
	  });
	  this.pollXhr = req;
	};
	
	/**
	 * Request constructor
	 *
	 * @param {Object} options
	 * @api public
	 */
	
	function Request(opts){
	  this.method = opts.method || 'GET';
	  this.uri = opts.uri;
	  this.xd = !!opts.xd;
	  this.xs = !!opts.xs;
	  this.async = false !== opts.async;
	  this.data = undefined != opts.data ? opts.data : null;
	  this.agent = opts.agent;
	  this.isBinary = opts.isBinary;
	  this.supportsBinary = opts.supportsBinary;
	  this.enablesXDR = opts.enablesXDR;
	
	  // SSL options for Node.js client
	  this.pfx = opts.pfx;
	  this.key = opts.key;
	  this.passphrase = opts.passphrase;
	  this.cert = opts.cert;
	  this.ca = opts.ca;
	  this.ciphers = opts.ciphers;
	  this.rejectUnauthorized = opts.rejectUnauthorized;
	
	  // other options for Node.js client
	  this.extraHeaders = opts.extraHeaders;
	
	  this.create();
	}
	
	/**
	 * Mix in `Emitter`.
	 */
	
	Emitter(Request.prototype);
	
	/**
	 * Creates the XHR object and sends the request.
	 *
	 * @api private
	 */
	
	Request.prototype.create = function(){
	  var opts = { agent: this.agent, xdomain: this.xd, xscheme: this.xs, enablesXDR: this.enablesXDR };
	
	  // SSL options for Node.js client
	  opts.pfx = this.pfx;
	  opts.key = this.key;
	  opts.passphrase = this.passphrase;
	  opts.cert = this.cert;
	  opts.ca = this.ca;
	  opts.ciphers = this.ciphers;
	  opts.rejectUnauthorized = this.rejectUnauthorized;
	
	  var xhr = this.xhr = new XMLHttpRequest(opts);
	  var self = this;
	
	  try {
	    debug('xhr open %s: %s', this.method, this.uri);
	    xhr.open(this.method, this.uri, this.async);
	    try {
	      if (this.extraHeaders) {
	        xhr.setDisableHeaderCheck(true);
	        for (var i in this.extraHeaders) {
	          if (this.extraHeaders.hasOwnProperty(i)) {
	            xhr.setRequestHeader(i, this.extraHeaders[i]);
	          }
	        }
	      }
	    } catch (e) {}
	    if (this.supportsBinary) {
	      // This has to be done after open because Firefox is stupid
	      // http://stackoverflow.com/questions/13216903/get-binary-data-with-xmlhttprequest-in-a-firefox-extension
	      xhr.responseType = 'arraybuffer';
	    }
	
	    if ('POST' == this.method) {
	      try {
	        if (this.isBinary) {
	          xhr.setRequestHeader('Content-type', 'application/octet-stream');
	        } else {
	          xhr.setRequestHeader('Content-type', 'text/plain;charset=UTF-8');
	        }
	      } catch (e) {}
	    }
	
	    // ie6 check
	    if ('withCredentials' in xhr) {
	      xhr.withCredentials = true;
	    }
	
	    if (this.hasXDR()) {
	      xhr.onload = function(){
	        self.onLoad();
	      };
	      xhr.onerror = function(){
	        self.onError(xhr.responseText);
	      };
	    } else {
	      xhr.onreadystatechange = function(){
	        if (4 != xhr.readyState) return;
	        if (200 == xhr.status || 1223 == xhr.status) {
	          self.onLoad();
	        } else {
	          // make sure the `error` event handler that's user-set
	          // does not throw in the same tick and gets caught here
	          setTimeout(function(){
	            self.onError(xhr.status);
	          }, 0);
	        }
	      };
	    }
	
	    debug('xhr data %s', this.data);
	    xhr.send(this.data);
	  } catch (e) {
	    // Need to defer since .create() is called directly fhrom the constructor
	    // and thus the 'error' event can only be only bound *after* this exception
	    // occurs.  Therefore, also, we cannot throw here at all.
	    setTimeout(function() {
	      self.onError(e);
	    }, 0);
	    return;
	  }
	
	  if (global.document) {
	    this.index = Request.requestsCount++;
	    Request.requests[this.index] = this;
	  }
	};
	
	/**
	 * Called upon successful response.
	 *
	 * @api private
	 */
	
	Request.prototype.onSuccess = function(){
	  this.emit('success');
	  this.cleanup();
	};
	
	/**
	 * Called if we have data.
	 *
	 * @api private
	 */
	
	Request.prototype.onData = function(data){
	  this.emit('data', data);
	  this.onSuccess();
	};
	
	/**
	 * Called upon error.
	 *
	 * @api private
	 */
	
	Request.prototype.onError = function(err){
	  this.emit('error', err);
	  this.cleanup(true);
	};
	
	/**
	 * Cleans up house.
	 *
	 * @api private
	 */
	
	Request.prototype.cleanup = function(fromError){
	  if ('undefined' == typeof this.xhr || null === this.xhr) {
	    return;
	  }
	  // xmlhttprequest
	  if (this.hasXDR()) {
	    this.xhr.onload = this.xhr.onerror = empty;
	  } else {
	    this.xhr.onreadystatechange = empty;
	  }
	
	  if (fromError) {
	    try {
	      this.xhr.abort();
	    } catch(e) {}
	  }
	
	  if (global.document) {
	    delete Request.requests[this.index];
	  }
	
	  this.xhr = null;
	};
	
	/**
	 * Called upon load.
	 *
	 * @api private
	 */
	
	Request.prototype.onLoad = function(){
	  var data;
	  try {
	    var contentType;
	    try {
	      contentType = this.xhr.getResponseHeader('Content-Type').split(';')[0];
	    } catch (e) {}
	    if (contentType === 'application/octet-stream') {
	      data = this.xhr.response;
	    } else {
	      if (!this.supportsBinary) {
	        data = this.xhr.responseText;
	      } else {
	        try {
	          data = String.fromCharCode.apply(null, new Uint8Array(this.xhr.response));
	        } catch (e) {
	          var ui8Arr = new Uint8Array(this.xhr.response);
	          var dataArray = [];
	          for (var idx = 0, length = ui8Arr.length; idx < length; idx++) {
	            dataArray.push(ui8Arr[idx]);
	          }
	
	          data = String.fromCharCode.apply(null, dataArray);
	        }
	      }
	    }
	  } catch (e) {
	    this.onError(e);
	  }
	  if (null != data) {
	    this.onData(data);
	  }
	};
	
	/**
	 * Check if it has XDomainRequest.
	 *
	 * @api private
	 */
	
	Request.prototype.hasXDR = function(){
	  return 'undefined' !== typeof global.XDomainRequest && !this.xs && this.enablesXDR;
	};
	
	/**
	 * Aborts the request.
	 *
	 * @api public
	 */
	
	Request.prototype.abort = function(){
	  this.cleanup();
	};
	
	/**
	 * Aborts pending requests when unloading the window. This is needed to prevent
	 * memory leaks (e.g. when using IE) and to ensure that no spurious error is
	 * emitted.
	 */
	
	if (global.document) {
	  Request.requestsCount = 0;
	  Request.requests = {};
	  if (global.attachEvent) {
	    global.attachEvent('onunload', unloadHandler);
	  } else if (global.addEventListener) {
	    global.addEventListener('beforeunload', unloadHandler, false);
	  }
	}
	
	function unloadHandler() {
	  for (var i in Request.requests) {
	    if (Request.requests.hasOwnProperty(i)) {
	      Request.requests[i].abort();
	    }
	  }
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 178 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Module dependencies.
	 */
	
	var Transport = __webpack_require__(179);
	var parseqs = __webpack_require__(190);
	var parser = __webpack_require__(180);
	var inherit = __webpack_require__(191);
	var yeast = __webpack_require__(192);
	var debug = __webpack_require__(193)('engine.io-client:polling');
	
	/**
	 * Module exports.
	 */
	
	module.exports = Polling;
	
	/**
	 * Is XHR2 supported?
	 */
	
	var hasXHR2 = (function() {
	  var XMLHttpRequest = __webpack_require__(175);
	  var xhr = new XMLHttpRequest({ xdomain: false });
	  return null != xhr.responseType;
	})();
	
	/**
	 * Polling interface.
	 *
	 * @param {Object} opts
	 * @api private
	 */
	
	function Polling(opts){
	  var forceBase64 = (opts && opts.forceBase64);
	  if (!hasXHR2 || forceBase64) {
	    this.supportsBinary = false;
	  }
	  Transport.call(this, opts);
	}
	
	/**
	 * Inherits from Transport.
	 */
	
	inherit(Polling, Transport);
	
	/**
	 * Transport name.
	 */
	
	Polling.prototype.name = 'polling';
	
	/**
	 * Opens the socket (triggers polling). We write a PING message to determine
	 * when the transport is open.
	 *
	 * @api private
	 */
	
	Polling.prototype.doOpen = function(){
	  this.poll();
	};
	
	/**
	 * Pauses polling.
	 *
	 * @param {Function} callback upon buffers are flushed and transport is paused
	 * @api private
	 */
	
	Polling.prototype.pause = function(onPause){
	  var pending = 0;
	  var self = this;
	
	  this.readyState = 'pausing';
	
	  function pause(){
	    debug('paused');
	    self.readyState = 'paused';
	    onPause();
	  }
	
	  if (this.polling || !this.writable) {
	    var total = 0;
	
	    if (this.polling) {
	      debug('we are currently polling - waiting to pause');
	      total++;
	      this.once('pollComplete', function(){
	        debug('pre-pause polling complete');
	        --total || pause();
	      });
	    }
	
	    if (!this.writable) {
	      debug('we are currently writing - waiting to pause');
	      total++;
	      this.once('drain', function(){
	        debug('pre-pause writing complete');
	        --total || pause();
	      });
	    }
	  } else {
	    pause();
	  }
	};
	
	/**
	 * Starts polling cycle.
	 *
	 * @api public
	 */
	
	Polling.prototype.poll = function(){
	  debug('polling');
	  this.polling = true;
	  this.doPoll();
	  this.emit('poll');
	};
	
	/**
	 * Overloads onData to detect payloads.
	 *
	 * @api private
	 */
	
	Polling.prototype.onData = function(data){
	  var self = this;
	  debug('polling got data %s', data);
	  var callback = function(packet, index, total) {
	    // if its the first message we consider the transport open
	    if ('opening' == self.readyState) {
	      self.onOpen();
	    }
	
	    // if its a close packet, we close the ongoing requests
	    if ('close' == packet.type) {
	      self.onClose();
	      return false;
	    }
	
	    // otherwise bypass onData and handle the message
	    self.onPacket(packet);
	  };
	
	  // decode payload
	  parser.decodePayload(data, this.socket.binaryType, callback);
	
	  // if an event did not trigger closing
	  if ('closed' != this.readyState) {
	    // if we got data we're not polling
	    this.polling = false;
	    this.emit('pollComplete');
	
	    if ('open' == this.readyState) {
	      this.poll();
	    } else {
	      debug('ignoring poll - transport state "%s"', this.readyState);
	    }
	  }
	};
	
	/**
	 * For polling, send a close packet.
	 *
	 * @api private
	 */
	
	Polling.prototype.doClose = function(){
	  var self = this;
	
	  function close(){
	    debug('writing close packet');
	    self.write([{ type: 'close' }]);
	  }
	
	  if ('open' == this.readyState) {
	    debug('transport open - closing');
	    close();
	  } else {
	    // in case we're trying to close while
	    // handshaking is in progress (GH-164)
	    debug('transport not open - deferring close');
	    this.once('open', close);
	  }
	};
	
	/**
	 * Writes a packets payload.
	 *
	 * @param {Array} data packets
	 * @param {Function} drain callback
	 * @api private
	 */
	
	Polling.prototype.write = function(packets){
	  var self = this;
	  this.writable = false;
	  var callbackfn = function() {
	    self.writable = true;
	    self.emit('drain');
	  };
	
	  var self = this;
	  parser.encodePayload(packets, this.supportsBinary, function(data) {
	    self.doWrite(data, callbackfn);
	  });
	};
	
	/**
	 * Generates uri for connection.
	 *
	 * @api private
	 */
	
	Polling.prototype.uri = function(){
	  var query = this.query || {};
	  var schema = this.secure ? 'https' : 'http';
	  var port = '';
	
	  // cache busting is forced
	  if (false !== this.timestampRequests) {
	    query[this.timestampParam] = yeast();
	  }
	
	  if (!this.supportsBinary && !query.sid) {
	    query.b64 = 1;
	  }
	
	  query = parseqs.encode(query);
	
	  // avoid port if default for schema
	  if (this.port && (('https' == schema && this.port != 443) ||
	     ('http' == schema && this.port != 80))) {
	    port = ':' + this.port;
	  }
	
	  // prepend ? to query
	  if (query.length) {
	    query = '?' + query;
	  }
	
	  var ipv6 = this.hostname.indexOf(':') !== -1;
	  return schema + '://' + (ipv6 ? '[' + this.hostname + ']' : this.hostname) + port + this.path + query;
	};


/***/ },
/* 179 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Module dependencies.
	 */
	
	var parser = __webpack_require__(180);
	var Emitter = __webpack_require__(189);
	
	/**
	 * Module exports.
	 */
	
	module.exports = Transport;
	
	/**
	 * Transport abstract constructor.
	 *
	 * @param {Object} options.
	 * @api private
	 */
	
	function Transport (opts) {
	  this.path = opts.path;
	  this.hostname = opts.hostname;
	  this.port = opts.port;
	  this.secure = opts.secure;
	  this.query = opts.query;
	  this.timestampParam = opts.timestampParam;
	  this.timestampRequests = opts.timestampRequests;
	  this.readyState = '';
	  this.agent = opts.agent || false;
	  this.socket = opts.socket;
	  this.enablesXDR = opts.enablesXDR;
	
	  // SSL options for Node.js client
	  this.pfx = opts.pfx;
	  this.key = opts.key;
	  this.passphrase = opts.passphrase;
	  this.cert = opts.cert;
	  this.ca = opts.ca;
	  this.ciphers = opts.ciphers;
	  this.rejectUnauthorized = opts.rejectUnauthorized;
	
	  // other options for Node.js client
	  this.extraHeaders = opts.extraHeaders;
	}
	
	/**
	 * Mix in `Emitter`.
	 */
	
	Emitter(Transport.prototype);
	
	/**
	 * Emits an error.
	 *
	 * @param {String} str
	 * @return {Transport} for chaining
	 * @api public
	 */
	
	Transport.prototype.onError = function (msg, desc) {
	  var err = new Error(msg);
	  err.type = 'TransportError';
	  err.description = desc;
	  this.emit('error', err);
	  return this;
	};
	
	/**
	 * Opens the transport.
	 *
	 * @api public
	 */
	
	Transport.prototype.open = function () {
	  if ('closed' == this.readyState || '' == this.readyState) {
	    this.readyState = 'opening';
	    this.doOpen();
	  }
	
	  return this;
	};
	
	/**
	 * Closes the transport.
	 *
	 * @api private
	 */
	
	Transport.prototype.close = function () {
	  if ('opening' == this.readyState || 'open' == this.readyState) {
	    this.doClose();
	    this.onClose();
	  }
	
	  return this;
	};
	
	/**
	 * Sends multiple packets.
	 *
	 * @param {Array} packets
	 * @api private
	 */
	
	Transport.prototype.send = function(packets){
	  if ('open' == this.readyState) {
	    this.write(packets);
	  } else {
	    throw new Error('Transport not open');
	  }
	};
	
	/**
	 * Called upon open
	 *
	 * @api private
	 */
	
	Transport.prototype.onOpen = function () {
	  this.readyState = 'open';
	  this.writable = true;
	  this.emit('open');
	};
	
	/**
	 * Called with data.
	 *
	 * @param {String} data
	 * @api private
	 */
	
	Transport.prototype.onData = function(data){
	  var packet = parser.decodePacket(data, this.socket.binaryType);
	  this.onPacket(packet);
	};
	
	/**
	 * Called with a decoded packet.
	 */
	
	Transport.prototype.onPacket = function (packet) {
	  this.emit('packet', packet);
	};
	
	/**
	 * Called upon close.
	 *
	 * @api private
	 */
	
	Transport.prototype.onClose = function () {
	  this.readyState = 'closed';
	  this.emit('close');
	};


/***/ },
/* 180 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/**
	 * Module dependencies.
	 */
	
	var keys = __webpack_require__(181);
	var hasBinary = __webpack_require__(182);
	var sliceBuffer = __webpack_require__(184);
	var base64encoder = __webpack_require__(185);
	var after = __webpack_require__(186);
	var utf8 = __webpack_require__(187);
	
	/**
	 * Check if we are running an android browser. That requires us to use
	 * ArrayBuffer with polling transports...
	 *
	 * http://ghinda.net/jpeg-blob-ajax-android/
	 */
	
	var isAndroid = typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent);
	
	/**
	 * Check if we are running in PhantomJS.
	 * Uploading a Blob with PhantomJS does not work correctly, as reported here:
	 * https://github.com/ariya/phantomjs/issues/11395
	 * @type boolean
	 */
	var isPhantomJS = typeof navigator !== 'undefined' && /PhantomJS/i.test(navigator.userAgent);
	
	/**
	 * When true, avoids using Blobs to encode payloads.
	 * @type boolean
	 */
	var dontSendBlobs = isAndroid || isPhantomJS;
	
	/**
	 * Current protocol version.
	 */
	
	exports.protocol = 3;
	
	/**
	 * Packet types.
	 */
	
	var packets = exports.packets = {
	    open:     0    // non-ws
	  , close:    1    // non-ws
	  , ping:     2
	  , pong:     3
	  , message:  4
	  , upgrade:  5
	  , noop:     6
	};
	
	var packetslist = keys(packets);
	
	/**
	 * Premade error packet.
	 */
	
	var err = { type: 'error', data: 'parser error' };
	
	/**
	 * Create a blob api even for blob builder when vendor prefixes exist
	 */
	
	var Blob = __webpack_require__(188);
	
	/**
	 * Encodes a packet.
	 *
	 *     <packet type id> [ <data> ]
	 *
	 * Example:
	 *
	 *     5hello world
	 *     3
	 *     4
	 *
	 * Binary is encoded in an identical principle
	 *
	 * @api private
	 */
	
	exports.encodePacket = function (packet, supportsBinary, utf8encode, callback) {
	  if ('function' == typeof supportsBinary) {
	    callback = supportsBinary;
	    supportsBinary = false;
	  }
	
	  if ('function' == typeof utf8encode) {
	    callback = utf8encode;
	    utf8encode = null;
	  }
	
	  var data = (packet.data === undefined)
	    ? undefined
	    : packet.data.buffer || packet.data;
	
	  if (global.ArrayBuffer && data instanceof ArrayBuffer) {
	    return encodeArrayBuffer(packet, supportsBinary, callback);
	  } else if (Blob && data instanceof global.Blob) {
	    return encodeBlob(packet, supportsBinary, callback);
	  }
	
	  // might be an object with { base64: true, data: dataAsBase64String }
	  if (data && data.base64) {
	    return encodeBase64Object(packet, callback);
	  }
	
	  // Sending data as a utf-8 string
	  var encoded = packets[packet.type];
	
	  // data fragment is optional
	  if (undefined !== packet.data) {
	    encoded += utf8encode ? utf8.encode(String(packet.data)) : String(packet.data);
	  }
	
	  return callback('' + encoded);
	
	};
	
	function encodeBase64Object(packet, callback) {
	  // packet data is an object { base64: true, data: dataAsBase64String }
	  var message = 'b' + exports.packets[packet.type] + packet.data.data;
	  return callback(message);
	}
	
	/**
	 * Encode packet helpers for binary types
	 */
	
	function encodeArrayBuffer(packet, supportsBinary, callback) {
	  if (!supportsBinary) {
	    return exports.encodeBase64Packet(packet, callback);
	  }
	
	  var data = packet.data;
	  var contentArray = new Uint8Array(data);
	  var resultBuffer = new Uint8Array(1 + data.byteLength);
	
	  resultBuffer[0] = packets[packet.type];
	  for (var i = 0; i < contentArray.length; i++) {
	    resultBuffer[i+1] = contentArray[i];
	  }
	
	  return callback(resultBuffer.buffer);
	}
	
	function encodeBlobAsArrayBuffer(packet, supportsBinary, callback) {
	  if (!supportsBinary) {
	    return exports.encodeBase64Packet(packet, callback);
	  }
	
	  var fr = new FileReader();
	  fr.onload = function() {
	    packet.data = fr.result;
	    exports.encodePacket(packet, supportsBinary, true, callback);
	  };
	  return fr.readAsArrayBuffer(packet.data);
	}
	
	function encodeBlob(packet, supportsBinary, callback) {
	  if (!supportsBinary) {
	    return exports.encodeBase64Packet(packet, callback);
	  }
	
	  if (dontSendBlobs) {
	    return encodeBlobAsArrayBuffer(packet, supportsBinary, callback);
	  }
	
	  var length = new Uint8Array(1);
	  length[0] = packets[packet.type];
	  var blob = new Blob([length.buffer, packet.data]);
	
	  return callback(blob);
	}
	
	/**
	 * Encodes a packet with binary data in a base64 string
	 *
	 * @param {Object} packet, has `type` and `data`
	 * @return {String} base64 encoded message
	 */
	
	exports.encodeBase64Packet = function(packet, callback) {
	  var message = 'b' + exports.packets[packet.type];
	  if (Blob && packet.data instanceof global.Blob) {
	    var fr = new FileReader();
	    fr.onload = function() {
	      var b64 = fr.result.split(',')[1];
	      callback(message + b64);
	    };
	    return fr.readAsDataURL(packet.data);
	  }
	
	  var b64data;
	  try {
	    b64data = String.fromCharCode.apply(null, new Uint8Array(packet.data));
	  } catch (e) {
	    // iPhone Safari doesn't let you apply with typed arrays
	    var typed = new Uint8Array(packet.data);
	    var basic = new Array(typed.length);
	    for (var i = 0; i < typed.length; i++) {
	      basic[i] = typed[i];
	    }
	    b64data = String.fromCharCode.apply(null, basic);
	  }
	  message += global.btoa(b64data);
	  return callback(message);
	};
	
	/**
	 * Decodes a packet. Changes format to Blob if requested.
	 *
	 * @return {Object} with `type` and `data` (if any)
	 * @api private
	 */
	
	exports.decodePacket = function (data, binaryType, utf8decode) {
	  // String data
	  if (typeof data == 'string' || data === undefined) {
	    if (data.charAt(0) == 'b') {
	      return exports.decodeBase64Packet(data.substr(1), binaryType);
	    }
	
	    if (utf8decode) {
	      try {
	        data = utf8.decode(data);
	      } catch (e) {
	        return err;
	      }
	    }
	    var type = data.charAt(0);
	
	    if (Number(type) != type || !packetslist[type]) {
	      return err;
	    }
	
	    if (data.length > 1) {
	      return { type: packetslist[type], data: data.substring(1) };
	    } else {
	      return { type: packetslist[type] };
	    }
	  }
	
	  var asArray = new Uint8Array(data);
	  var type = asArray[0];
	  var rest = sliceBuffer(data, 1);
	  if (Blob && binaryType === 'blob') {
	    rest = new Blob([rest]);
	  }
	  return { type: packetslist[type], data: rest };
	};
	
	/**
	 * Decodes a packet encoded in a base64 string
	 *
	 * @param {String} base64 encoded message
	 * @return {Object} with `type` and `data` (if any)
	 */
	
	exports.decodeBase64Packet = function(msg, binaryType) {
	  var type = packetslist[msg.charAt(0)];
	  if (!global.ArrayBuffer) {
	    return { type: type, data: { base64: true, data: msg.substr(1) } };
	  }
	
	  var data = base64encoder.decode(msg.substr(1));
	
	  if (binaryType === 'blob' && Blob) {
	    data = new Blob([data]);
	  }
	
	  return { type: type, data: data };
	};
	
	/**
	 * Encodes multiple messages (payload).
	 *
	 *     <length>:data
	 *
	 * Example:
	 *
	 *     11:hello world2:hi
	 *
	 * If any contents are binary, they will be encoded as base64 strings. Base64
	 * encoded strings are marked with a b before the length specifier
	 *
	 * @param {Array} packets
	 * @api private
	 */
	
	exports.encodePayload = function (packets, supportsBinary, callback) {
	  if (typeof supportsBinary == 'function') {
	    callback = supportsBinary;
	    supportsBinary = null;
	  }
	
	  var isBinary = hasBinary(packets);
	
	  if (supportsBinary && isBinary) {
	    if (Blob && !dontSendBlobs) {
	      return exports.encodePayloadAsBlob(packets, callback);
	    }
	
	    return exports.encodePayloadAsArrayBuffer(packets, callback);
	  }
	
	  if (!packets.length) {
	    return callback('0:');
	  }
	
	  function setLengthHeader(message) {
	    return message.length + ':' + message;
	  }
	
	  function encodeOne(packet, doneCallback) {
	    exports.encodePacket(packet, !isBinary ? false : supportsBinary, true, function(message) {
	      doneCallback(null, setLengthHeader(message));
	    });
	  }
	
	  map(packets, encodeOne, function(err, results) {
	    return callback(results.join(''));
	  });
	};
	
	/**
	 * Async array map using after
	 */
	
	function map(ary, each, done) {
	  var result = new Array(ary.length);
	  var next = after(ary.length, done);
	
	  var eachWithIndex = function(i, el, cb) {
	    each(el, function(error, msg) {
	      result[i] = msg;
	      cb(error, result);
	    });
	  };
	
	  for (var i = 0; i < ary.length; i++) {
	    eachWithIndex(i, ary[i], next);
	  }
	}
	
	/*
	 * Decodes data when a payload is maybe expected. Possible binary contents are
	 * decoded from their base64 representation
	 *
	 * @param {String} data, callback method
	 * @api public
	 */
	
	exports.decodePayload = function (data, binaryType, callback) {
	  if (typeof data != 'string') {
	    return exports.decodePayloadAsBinary(data, binaryType, callback);
	  }
	
	  if (typeof binaryType === 'function') {
	    callback = binaryType;
	    binaryType = null;
	  }
	
	  var packet;
	  if (data == '') {
	    // parser error - ignoring payload
	    return callback(err, 0, 1);
	  }
	
	  var length = ''
	    , n, msg;
	
	  for (var i = 0, l = data.length; i < l; i++) {
	    var chr = data.charAt(i);
	
	    if (':' != chr) {
	      length += chr;
	    } else {
	      if ('' == length || (length != (n = Number(length)))) {
	        // parser error - ignoring payload
	        return callback(err, 0, 1);
	      }
	
	      msg = data.substr(i + 1, n);
	
	      if (length != msg.length) {
	        // parser error - ignoring payload
	        return callback(err, 0, 1);
	      }
	
	      if (msg.length) {
	        packet = exports.decodePacket(msg, binaryType, true);
	
	        if (err.type == packet.type && err.data == packet.data) {
	          // parser error in individual packet - ignoring payload
	          return callback(err, 0, 1);
	        }
	
	        var ret = callback(packet, i + n, l);
	        if (false === ret) return;
	      }
	
	      // advance cursor
	      i += n;
	      length = '';
	    }
	  }
	
	  if (length != '') {
	    // parser error - ignoring payload
	    return callback(err, 0, 1);
	  }
	
	};
	
	/**
	 * Encodes multiple messages (payload) as binary.
	 *
	 * <1 = binary, 0 = string><number from 0-9><number from 0-9>[...]<number
	 * 255><data>
	 *
	 * Example:
	 * 1 3 255 1 2 3, if the binary contents are interpreted as 8 bit integers
	 *
	 * @param {Array} packets
	 * @return {ArrayBuffer} encoded payload
	 * @api private
	 */
	
	exports.encodePayloadAsArrayBuffer = function(packets, callback) {
	  if (!packets.length) {
	    return callback(new ArrayBuffer(0));
	  }
	
	  function encodeOne(packet, doneCallback) {
	    exports.encodePacket(packet, true, true, function(data) {
	      return doneCallback(null, data);
	    });
	  }
	
	  map(packets, encodeOne, function(err, encodedPackets) {
	    var totalLength = encodedPackets.reduce(function(acc, p) {
	      var len;
	      if (typeof p === 'string'){
	        len = p.length;
	      } else {
	        len = p.byteLength;
	      }
	      return acc + len.toString().length + len + 2; // string/binary identifier + separator = 2
	    }, 0);
	
	    var resultArray = new Uint8Array(totalLength);
	
	    var bufferIndex = 0;
	    encodedPackets.forEach(function(p) {
	      var isString = typeof p === 'string';
	      var ab = p;
	      if (isString) {
	        var view = new Uint8Array(p.length);
	        for (var i = 0; i < p.length; i++) {
	          view[i] = p.charCodeAt(i);
	        }
	        ab = view.buffer;
	      }
	
	      if (isString) { // not true binary
	        resultArray[bufferIndex++] = 0;
	      } else { // true binary
	        resultArray[bufferIndex++] = 1;
	      }
	
	      var lenStr = ab.byteLength.toString();
	      for (var i = 0; i < lenStr.length; i++) {
	        resultArray[bufferIndex++] = parseInt(lenStr[i]);
	      }
	      resultArray[bufferIndex++] = 255;
	
	      var view = new Uint8Array(ab);
	      for (var i = 0; i < view.length; i++) {
	        resultArray[bufferIndex++] = view[i];
	      }
	    });
	
	    return callback(resultArray.buffer);
	  });
	};
	
	/**
	 * Encode as Blob
	 */
	
	exports.encodePayloadAsBlob = function(packets, callback) {
	  function encodeOne(packet, doneCallback) {
	    exports.encodePacket(packet, true, true, function(encoded) {
	      var binaryIdentifier = new Uint8Array(1);
	      binaryIdentifier[0] = 1;
	      if (typeof encoded === 'string') {
	        var view = new Uint8Array(encoded.length);
	        for (var i = 0; i < encoded.length; i++) {
	          view[i] = encoded.charCodeAt(i);
	        }
	        encoded = view.buffer;
	        binaryIdentifier[0] = 0;
	      }
	
	      var len = (encoded instanceof ArrayBuffer)
	        ? encoded.byteLength
	        : encoded.size;
	
	      var lenStr = len.toString();
	      var lengthAry = new Uint8Array(lenStr.length + 1);
	      for (var i = 0; i < lenStr.length; i++) {
	        lengthAry[i] = parseInt(lenStr[i]);
	      }
	      lengthAry[lenStr.length] = 255;
	
	      if (Blob) {
	        var blob = new Blob([binaryIdentifier.buffer, lengthAry.buffer, encoded]);
	        doneCallback(null, blob);
	      }
	    });
	  }
	
	  map(packets, encodeOne, function(err, results) {
	    return callback(new Blob(results));
	  });
	};
	
	/*
	 * Decodes data when a payload is maybe expected. Strings are decoded by
	 * interpreting each byte as a key code for entries marked to start with 0. See
	 * description of encodePayloadAsBinary
	 *
	 * @param {ArrayBuffer} data, callback method
	 * @api public
	 */
	
	exports.decodePayloadAsBinary = function (data, binaryType, callback) {
	  if (typeof binaryType === 'function') {
	    callback = binaryType;
	    binaryType = null;
	  }
	
	  var bufferTail = data;
	  var buffers = [];
	
	  var numberTooLong = false;
	  while (bufferTail.byteLength > 0) {
	    var tailArray = new Uint8Array(bufferTail);
	    var isString = tailArray[0] === 0;
	    var msgLength = '';
	
	    for (var i = 1; ; i++) {
	      if (tailArray[i] == 255) break;
	
	      if (msgLength.length > 310) {
	        numberTooLong = true;
	        break;
	      }
	
	      msgLength += tailArray[i];
	    }
	
	    if(numberTooLong) return callback(err, 0, 1);
	
	    bufferTail = sliceBuffer(bufferTail, 2 + msgLength.length);
	    msgLength = parseInt(msgLength);
	
	    var msg = sliceBuffer(bufferTail, 0, msgLength);
	    if (isString) {
	      try {
	        msg = String.fromCharCode.apply(null, new Uint8Array(msg));
	      } catch (e) {
	        // iPhone Safari doesn't let you apply to typed arrays
	        var typed = new Uint8Array(msg);
	        msg = '';
	        for (var i = 0; i < typed.length; i++) {
	          msg += String.fromCharCode(typed[i]);
	        }
	      }
	    }
	
	    buffers.push(msg);
	    bufferTail = sliceBuffer(bufferTail, msgLength);
	  }
	
	  var total = buffers.length;
	  buffers.forEach(function(buffer, i) {
	    callback(exports.decodePacket(buffer, binaryType, true), i, total);
	  });
	};
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 181 */
/***/ function(module, exports) {

	
	/**
	 * Gets the keys for an object.
	 *
	 * @return {Array} keys
	 * @api private
	 */
	
	module.exports = Object.keys || function keys (obj){
	  var arr = [];
	  var has = Object.prototype.hasOwnProperty;
	
	  for (var i in obj) {
	    if (has.call(obj, i)) {
	      arr.push(i);
	    }
	  }
	  return arr;
	};


/***/ },
/* 182 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {
	/*
	 * Module requirements.
	 */
	
	var isArray = __webpack_require__(183);
	
	/**
	 * Module exports.
	 */
	
	module.exports = hasBinary;
	
	/**
	 * Checks for binary data.
	 *
	 * Right now only Buffer and ArrayBuffer are supported..
	 *
	 * @param {Object} anything
	 * @api public
	 */
	
	function hasBinary(data) {
	
	  function _hasBinary(obj) {
	    if (!obj) return false;
	
	    if ( (global.Buffer && global.Buffer.isBuffer(obj)) ||
	         (global.ArrayBuffer && obj instanceof ArrayBuffer) ||
	         (global.Blob && obj instanceof Blob) ||
	         (global.File && obj instanceof File)
	        ) {
	      return true;
	    }
	
	    if (isArray(obj)) {
	      for (var i = 0; i < obj.length; i++) {
	          if (_hasBinary(obj[i])) {
	              return true;
	          }
	      }
	    } else if (obj && 'object' == typeof obj) {
	      if (obj.toJSON) {
	        obj = obj.toJSON();
	      }
	
	      for (var key in obj) {
	        if (Object.prototype.hasOwnProperty.call(obj, key) && _hasBinary(obj[key])) {
	          return true;
	        }
	      }
	    }
	
	    return false;
	  }
	
	  return _hasBinary(data);
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 183 */
/***/ function(module, exports) {

	module.exports = Array.isArray || function (arr) {
	  return Object.prototype.toString.call(arr) == '[object Array]';
	};


/***/ },
/* 184 */
/***/ function(module, exports) {

	/**
	 * An abstraction for slicing an arraybuffer even when
	 * ArrayBuffer.prototype.slice is not supported
	 *
	 * @api public
	 */
	
	module.exports = function(arraybuffer, start, end) {
	  var bytes = arraybuffer.byteLength;
	  start = start || 0;
	  end = end || bytes;
	
	  if (arraybuffer.slice) { return arraybuffer.slice(start, end); }
	
	  if (start < 0) { start += bytes; }
	  if (end < 0) { end += bytes; }
	  if (end > bytes) { end = bytes; }
	
	  if (start >= bytes || start >= end || bytes === 0) {
	    return new ArrayBuffer(0);
	  }
	
	  var abv = new Uint8Array(arraybuffer);
	  var result = new Uint8Array(end - start);
	  for (var i = start, ii = 0; i < end; i++, ii++) {
	    result[ii] = abv[i];
	  }
	  return result.buffer;
	};


/***/ },
/* 185 */
/***/ function(module, exports) {

	/*
	 * base64-arraybuffer
	 * https://github.com/niklasvh/base64-arraybuffer
	 *
	 * Copyright (c) 2012 Niklas von Hertzen
	 * Licensed under the MIT license.
	 */
	(function(chars){
	  "use strict";
	
	  exports.encode = function(arraybuffer) {
	    var bytes = new Uint8Array(arraybuffer),
	    i, len = bytes.length, base64 = "";
	
	    for (i = 0; i < len; i+=3) {
	      base64 += chars[bytes[i] >> 2];
	      base64 += chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
	      base64 += chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
	      base64 += chars[bytes[i + 2] & 63];
	    }
	
	    if ((len % 3) === 2) {
	      base64 = base64.substring(0, base64.length - 1) + "=";
	    } else if (len % 3 === 1) {
	      base64 = base64.substring(0, base64.length - 2) + "==";
	    }
	
	    return base64;
	  };
	
	  exports.decode =  function(base64) {
	    var bufferLength = base64.length * 0.75,
	    len = base64.length, i, p = 0,
	    encoded1, encoded2, encoded3, encoded4;
	
	    if (base64[base64.length - 1] === "=") {
	      bufferLength--;
	      if (base64[base64.length - 2] === "=") {
	        bufferLength--;
	      }
	    }
	
	    var arraybuffer = new ArrayBuffer(bufferLength),
	    bytes = new Uint8Array(arraybuffer);
	
	    for (i = 0; i < len; i+=4) {
	      encoded1 = chars.indexOf(base64[i]);
	      encoded2 = chars.indexOf(base64[i+1]);
	      encoded3 = chars.indexOf(base64[i+2]);
	      encoded4 = chars.indexOf(base64[i+3]);
	
	      bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
	      bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
	      bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
	    }
	
	    return arraybuffer;
	  };
	})("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/");


/***/ },
/* 186 */
/***/ function(module, exports) {

	module.exports = after
	
	function after(count, callback, err_cb) {
	    var bail = false
	    err_cb = err_cb || noop
	    proxy.count = count
	
	    return (count === 0) ? callback() : proxy
	
	    function proxy(err, result) {
	        if (proxy.count <= 0) {
	            throw new Error('after called too many times')
	        }
	        --proxy.count
	
	        // after first error, rest are passed to err_cb
	        if (err) {
	            bail = true
	            callback(err)
	            // future error callbacks will go to error handler
	            callback = err_cb
	        } else if (proxy.count === 0 && !bail) {
	            callback(null, result)
	        }
	    }
	}
	
	function noop() {}


/***/ },
/* 187 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module, global) {/*! https://mths.be/utf8js v2.0.0 by @mathias */
	;(function(root) {
	
		// Detect free variables `exports`
		var freeExports = typeof exports == 'object' && exports;
	
		// Detect free variable `module`
		var freeModule = typeof module == 'object' && module &&
			module.exports == freeExports && module;
	
		// Detect free variable `global`, from Node.js or Browserified code,
		// and use it as `root`
		var freeGlobal = typeof global == 'object' && global;
		if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) {
			root = freeGlobal;
		}
	
		/*--------------------------------------------------------------------------*/
	
		var stringFromCharCode = String.fromCharCode;
	
		// Taken from https://mths.be/punycode
		function ucs2decode(string) {
			var output = [];
			var counter = 0;
			var length = string.length;
			var value;
			var extra;
			while (counter < length) {
				value = string.charCodeAt(counter++);
				if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
					// high surrogate, and there is a next character
					extra = string.charCodeAt(counter++);
					if ((extra & 0xFC00) == 0xDC00) { // low surrogate
						output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
					} else {
						// unmatched surrogate; only append this code unit, in case the next
						// code unit is the high surrogate of a surrogate pair
						output.push(value);
						counter--;
					}
				} else {
					output.push(value);
				}
			}
			return output;
		}
	
		// Taken from https://mths.be/punycode
		function ucs2encode(array) {
			var length = array.length;
			var index = -1;
			var value;
			var output = '';
			while (++index < length) {
				value = array[index];
				if (value > 0xFFFF) {
					value -= 0x10000;
					output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
					value = 0xDC00 | value & 0x3FF;
				}
				output += stringFromCharCode(value);
			}
			return output;
		}
	
		function checkScalarValue(codePoint) {
			if (codePoint >= 0xD800 && codePoint <= 0xDFFF) {
				throw Error(
					'Lone surrogate U+' + codePoint.toString(16).toUpperCase() +
					' is not a scalar value'
				);
			}
		}
		/*--------------------------------------------------------------------------*/
	
		function createByte(codePoint, shift) {
			return stringFromCharCode(((codePoint >> shift) & 0x3F) | 0x80);
		}
	
		function encodeCodePoint(codePoint) {
			if ((codePoint & 0xFFFFFF80) == 0) { // 1-byte sequence
				return stringFromCharCode(codePoint);
			}
			var symbol = '';
			if ((codePoint & 0xFFFFF800) == 0) { // 2-byte sequence
				symbol = stringFromCharCode(((codePoint >> 6) & 0x1F) | 0xC0);
			}
			else if ((codePoint & 0xFFFF0000) == 0) { // 3-byte sequence
				checkScalarValue(codePoint);
				symbol = stringFromCharCode(((codePoint >> 12) & 0x0F) | 0xE0);
				symbol += createByte(codePoint, 6);
			}
			else if ((codePoint & 0xFFE00000) == 0) { // 4-byte sequence
				symbol = stringFromCharCode(((codePoint >> 18) & 0x07) | 0xF0);
				symbol += createByte(codePoint, 12);
				symbol += createByte(codePoint, 6);
			}
			symbol += stringFromCharCode((codePoint & 0x3F) | 0x80);
			return symbol;
		}
	
		function utf8encode(string) {
			var codePoints = ucs2decode(string);
			var length = codePoints.length;
			var index = -1;
			var codePoint;
			var byteString = '';
			while (++index < length) {
				codePoint = codePoints[index];
				byteString += encodeCodePoint(codePoint);
			}
			return byteString;
		}
	
		/*--------------------------------------------------------------------------*/
	
		function readContinuationByte() {
			if (byteIndex >= byteCount) {
				throw Error('Invalid byte index');
			}
	
			var continuationByte = byteArray[byteIndex] & 0xFF;
			byteIndex++;
	
			if ((continuationByte & 0xC0) == 0x80) {
				return continuationByte & 0x3F;
			}
	
			// If we end up here, it’s not a continuation byte
			throw Error('Invalid continuation byte');
		}
	
		function decodeSymbol() {
			var byte1;
			var byte2;
			var byte3;
			var byte4;
			var codePoint;
	
			if (byteIndex > byteCount) {
				throw Error('Invalid byte index');
			}
	
			if (byteIndex == byteCount) {
				return false;
			}
	
			// Read first byte
			byte1 = byteArray[byteIndex] & 0xFF;
			byteIndex++;
	
			// 1-byte sequence (no continuation bytes)
			if ((byte1 & 0x80) == 0) {
				return byte1;
			}
	
			// 2-byte sequence
			if ((byte1 & 0xE0) == 0xC0) {
				var byte2 = readContinuationByte();
				codePoint = ((byte1 & 0x1F) << 6) | byte2;
				if (codePoint >= 0x80) {
					return codePoint;
				} else {
					throw Error('Invalid continuation byte');
				}
			}
	
			// 3-byte sequence (may include unpaired surrogates)
			if ((byte1 & 0xF0) == 0xE0) {
				byte2 = readContinuationByte();
				byte3 = readContinuationByte();
				codePoint = ((byte1 & 0x0F) << 12) | (byte2 << 6) | byte3;
				if (codePoint >= 0x0800) {
					checkScalarValue(codePoint);
					return codePoint;
				} else {
					throw Error('Invalid continuation byte');
				}
			}
	
			// 4-byte sequence
			if ((byte1 & 0xF8) == 0xF0) {
				byte2 = readContinuationByte();
				byte3 = readContinuationByte();
				byte4 = readContinuationByte();
				codePoint = ((byte1 & 0x0F) << 0x12) | (byte2 << 0x0C) |
					(byte3 << 0x06) | byte4;
				if (codePoint >= 0x010000 && codePoint <= 0x10FFFF) {
					return codePoint;
				}
			}
	
			throw Error('Invalid UTF-8 detected');
		}
	
		var byteArray;
		var byteCount;
		var byteIndex;
		function utf8decode(byteString) {
			byteArray = ucs2decode(byteString);
			byteCount = byteArray.length;
			byteIndex = 0;
			var codePoints = [];
			var tmp;
			while ((tmp = decodeSymbol()) !== false) {
				codePoints.push(tmp);
			}
			return ucs2encode(codePoints);
		}
	
		/*--------------------------------------------------------------------------*/
	
		var utf8 = {
			'version': '2.0.0',
			'encode': utf8encode,
			'decode': utf8decode
		};
	
		// Some AMD build optimizers, like r.js, check for specific condition patterns
		// like the following:
		if (
			true
		) {
			!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
				return utf8;
			}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		}	else if (freeExports && !freeExports.nodeType) {
			if (freeModule) { // in Node.js or RingoJS v0.8.0+
				freeModule.exports = utf8;
			} else { // in Narwhal or RingoJS v0.7.0-
				var object = {};
				var hasOwnProperty = object.hasOwnProperty;
				for (var key in utf8) {
					hasOwnProperty.call(utf8, key) && (freeExports[key] = utf8[key]);
				}
			}
		} else { // in Rhino or a web browser
			root.utf8 = utf8;
		}
	
	}(this));
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)(module), (function() { return this; }())))

/***/ },
/* 188 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {/**
	 * Create a blob builder even when vendor prefixes exist
	 */
	
	var BlobBuilder = global.BlobBuilder
	  || global.WebKitBlobBuilder
	  || global.MSBlobBuilder
	  || global.MozBlobBuilder;
	
	/**
	 * Check if Blob constructor is supported
	 */
	
	var blobSupported = (function() {
	  try {
	    var a = new Blob(['hi']);
	    return a.size === 2;
	  } catch(e) {
	    return false;
	  }
	})();
	
	/**
	 * Check if Blob constructor supports ArrayBufferViews
	 * Fails in Safari 6, so we need to map to ArrayBuffers there.
	 */
	
	var blobSupportsArrayBufferView = blobSupported && (function() {
	  try {
	    var b = new Blob([new Uint8Array([1,2])]);
	    return b.size === 2;
	  } catch(e) {
	    return false;
	  }
	})();
	
	/**
	 * Check if BlobBuilder is supported
	 */
	
	var blobBuilderSupported = BlobBuilder
	  && BlobBuilder.prototype.append
	  && BlobBuilder.prototype.getBlob;
	
	/**
	 * Helper function that maps ArrayBufferViews to ArrayBuffers
	 * Used by BlobBuilder constructor and old browsers that didn't
	 * support it in the Blob constructor.
	 */
	
	function mapArrayBufferViews(ary) {
	  for (var i = 0; i < ary.length; i++) {
	    var chunk = ary[i];
	    if (chunk.buffer instanceof ArrayBuffer) {
	      var buf = chunk.buffer;
	
	      // if this is a subarray, make a copy so we only
	      // include the subarray region from the underlying buffer
	      if (chunk.byteLength !== buf.byteLength) {
	        var copy = new Uint8Array(chunk.byteLength);
	        copy.set(new Uint8Array(buf, chunk.byteOffset, chunk.byteLength));
	        buf = copy.buffer;
	      }
	
	      ary[i] = buf;
	    }
	  }
	}
	
	function BlobBuilderConstructor(ary, options) {
	  options = options || {};
	
	  var bb = new BlobBuilder();
	  mapArrayBufferViews(ary);
	
	  for (var i = 0; i < ary.length; i++) {
	    bb.append(ary[i]);
	  }
	
	  return (options.type) ? bb.getBlob(options.type) : bb.getBlob();
	};
	
	function BlobConstructor(ary, options) {
	  mapArrayBufferViews(ary);
	  return new Blob(ary, options || {});
	};
	
	module.exports = (function() {
	  if (blobSupported) {
	    return blobSupportsArrayBufferView ? global.Blob : BlobConstructor;
	  } else if (blobBuilderSupported) {
	    return BlobBuilderConstructor;
	  } else {
	    return undefined;
	  }
	})();
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 189 */
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
	  (this._callbacks[event] = this._callbacks[event] || [])
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
	  var self = this;
	  this._callbacks = this._callbacks || {};
	
	  function on() {
	    self.off(event, on);
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
	  var callbacks = this._callbacks[event];
	  if (!callbacks) return this;
	
	  // remove all handlers
	  if (1 == arguments.length) {
	    delete this._callbacks[event];
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
	    , callbacks = this._callbacks[event];
	
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
	  return this._callbacks[event] || [];
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
/* 190 */
/***/ function(module, exports) {

	/**
	 * Compiles a querystring
	 * Returns string representation of the object
	 *
	 * @param {Object}
	 * @api private
	 */
	
	exports.encode = function (obj) {
	  var str = '';
	
	  for (var i in obj) {
	    if (obj.hasOwnProperty(i)) {
	      if (str.length) str += '&';
	      str += encodeURIComponent(i) + '=' + encodeURIComponent(obj[i]);
	    }
	  }
	
	  return str;
	};
	
	/**
	 * Parses a simple querystring into an object
	 *
	 * @param {String} qs
	 * @api private
	 */
	
	exports.decode = function(qs){
	  var qry = {};
	  var pairs = qs.split('&');
	  for (var i = 0, l = pairs.length; i < l; i++) {
	    var pair = pairs[i].split('=');
	    qry[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
	  }
	  return qry;
	};


/***/ },
/* 191 */
/***/ function(module, exports) {

	
	module.exports = function(a, b){
	  var fn = function(){};
	  fn.prototype = b.prototype;
	  a.prototype = new fn;
	  a.prototype.constructor = a;
	};

/***/ },
/* 192 */
/***/ function(module, exports) {

	'use strict';
	
	var alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_'.split('')
	  , length = 64
	  , map = {}
	  , seed = 0
	  , i = 0
	  , prev;
	
	/**
	 * Return a string representing the specified number.
	 *
	 * @param {Number} num The number to convert.
	 * @returns {String} The string representation of the number.
	 * @api public
	 */
	function encode(num) {
	  var encoded = '';
	
	  do {
	    encoded = alphabet[num % length] + encoded;
	    num = Math.floor(num / length);
	  } while (num > 0);
	
	  return encoded;
	}
	
	/**
	 * Return the integer value specified by the given string.
	 *
	 * @param {String} str The string to convert.
	 * @returns {Number} The integer value represented by the string.
	 * @api public
	 */
	function decode(str) {
	  var decoded = 0;
	
	  for (i = 0; i < str.length; i++) {
	    decoded = decoded * length + map[str.charAt(i)];
	  }
	
	  return decoded;
	}
	
	/**
	 * Yeast: A tiny growing id generator.
	 *
	 * @returns {String} A unique id.
	 * @api public
	 */
	function yeast() {
	  var now = encode(+new Date());
	
	  if (now !== prev) return seed = 0, prev = now;
	  return now +'.'+ encode(seed++);
	}
	
	//
	// Map each character to its index.
	//
	for (; i < length; i++) map[alphabet[i]] = i;
	
	//
	// Expose the `yeast`, `encode` and `decode` functions.
	//
	yeast.encode = encode;
	yeast.decode = decode;
	module.exports = yeast;


/***/ },
/* 193 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * This is the web browser implementation of `debug()`.
	 *
	 * Expose `debug()` as the module.
	 */
	
	exports = module.exports = __webpack_require__(194);
	exports.log = log;
	exports.formatArgs = formatArgs;
	exports.save = save;
	exports.load = load;
	exports.useColors = useColors;
	exports.storage = 'undefined' != typeof chrome
	               && 'undefined' != typeof chrome.storage
	                  ? chrome.storage.local
	                  : localstorage();
	
	/**
	 * Colors.
	 */
	
	exports.colors = [
	  'lightseagreen',
	  'forestgreen',
	  'goldenrod',
	  'dodgerblue',
	  'darkorchid',
	  'crimson'
	];
	
	/**
	 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
	 * and the Firebug extension (any Firefox version) are known
	 * to support "%c" CSS customizations.
	 *
	 * TODO: add a `localStorage` variable to explicitly enable/disable colors
	 */
	
	function useColors() {
	  // is webkit? http://stackoverflow.com/a/16459606/376773
	  return ('WebkitAppearance' in document.documentElement.style) ||
	    // is firebug? http://stackoverflow.com/a/398120/376773
	    (window.console && (console.firebug || (console.exception && console.table))) ||
	    // is firefox >= v31?
	    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
	    (navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31);
	}
	
	/**
	 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
	 */
	
	exports.formatters.j = function(v) {
	  return JSON.stringify(v);
	};
	
	
	/**
	 * Colorize log arguments if enabled.
	 *
	 * @api public
	 */
	
	function formatArgs() {
	  var args = arguments;
	  var useColors = this.useColors;
	
	  args[0] = (useColors ? '%c' : '')
	    + this.namespace
	    + (useColors ? ' %c' : ' ')
	    + args[0]
	    + (useColors ? '%c ' : ' ')
	    + '+' + exports.humanize(this.diff);
	
	  if (!useColors) return args;
	
	  var c = 'color: ' + this.color;
	  args = [args[0], c, 'color: inherit'].concat(Array.prototype.slice.call(args, 1));
	
	  // the final "%c" is somewhat tricky, because there could be other
	  // arguments passed either before or after the %c, so we need to
	  // figure out the correct index to insert the CSS into
	  var index = 0;
	  var lastC = 0;
	  args[0].replace(/%[a-z%]/g, function(match) {
	    if ('%%' === match) return;
	    index++;
	    if ('%c' === match) {
	      // we only are interested in the *last* %c
	      // (the user may have provided their own)
	      lastC = index;
	    }
	  });
	
	  args.splice(lastC, 0, c);
	  return args;
	}
	
	/**
	 * Invokes `console.log()` when available.
	 * No-op when `console.log` is not a "function".
	 *
	 * @api public
	 */
	
	function log() {
	  // this hackery is required for IE8/9, where
	  // the `console.log` function doesn't have 'apply'
	  return 'object' === typeof console
	    && console.log
	    && Function.prototype.apply.call(console.log, console, arguments);
	}
	
	/**
	 * Save `namespaces`.
	 *
	 * @param {String} namespaces
	 * @api private
	 */
	
	function save(namespaces) {
	  try {
	    if (null == namespaces) {
	      exports.storage.removeItem('debug');
	    } else {
	      exports.storage.debug = namespaces;
	    }
	  } catch(e) {}
	}
	
	/**
	 * Load `namespaces`.
	 *
	 * @return {String} returns the previously persisted debug modes
	 * @api private
	 */
	
	function load() {
	  var r;
	  try {
	    r = exports.storage.debug;
	  } catch(e) {}
	  return r;
	}
	
	/**
	 * Enable namespaces listed in `localStorage.debug` initially.
	 */
	
	exports.enable(load());
	
	/**
	 * Localstorage attempts to return the localstorage.
	 *
	 * This is necessary because safari throws
	 * when a user disables cookies/localstorage
	 * and you attempt to access it.
	 *
	 * @return {LocalStorage}
	 * @api private
	 */
	
	function localstorage(){
	  try {
	    return window.localStorage;
	  } catch (e) {}
	}


/***/ },
/* 194 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * This is the common logic for both the Node.js and web browser
	 * implementations of `debug()`.
	 *
	 * Expose `debug()` as the module.
	 */
	
	exports = module.exports = debug;
	exports.coerce = coerce;
	exports.disable = disable;
	exports.enable = enable;
	exports.enabled = enabled;
	exports.humanize = __webpack_require__(195);
	
	/**
	 * The currently active debug mode names, and names to skip.
	 */
	
	exports.names = [];
	exports.skips = [];
	
	/**
	 * Map of special "%n" handling functions, for the debug "format" argument.
	 *
	 * Valid key names are a single, lowercased letter, i.e. "n".
	 */
	
	exports.formatters = {};
	
	/**
	 * Previously assigned color.
	 */
	
	var prevColor = 0;
	
	/**
	 * Previous log timestamp.
	 */
	
	var prevTime;
	
	/**
	 * Select a color.
	 *
	 * @return {Number}
	 * @api private
	 */
	
	function selectColor() {
	  return exports.colors[prevColor++ % exports.colors.length];
	}
	
	/**
	 * Create a debugger with the given `namespace`.
	 *
	 * @param {String} namespace
	 * @return {Function}
	 * @api public
	 */
	
	function debug(namespace) {
	
	  // define the `disabled` version
	  function disabled() {
	  }
	  disabled.enabled = false;
	
	  // define the `enabled` version
	  function enabled() {
	
	    var self = enabled;
	
	    // set `diff` timestamp
	    var curr = +new Date();
	    var ms = curr - (prevTime || curr);
	    self.diff = ms;
	    self.prev = prevTime;
	    self.curr = curr;
	    prevTime = curr;
	
	    // add the `color` if not set
	    if (null == self.useColors) self.useColors = exports.useColors();
	    if (null == self.color && self.useColors) self.color = selectColor();
	
	    var args = Array.prototype.slice.call(arguments);
	
	    args[0] = exports.coerce(args[0]);
	
	    if ('string' !== typeof args[0]) {
	      // anything else let's inspect with %o
	      args = ['%o'].concat(args);
	    }
	
	    // apply any `formatters` transformations
	    var index = 0;
	    args[0] = args[0].replace(/%([a-z%])/g, function(match, format) {
	      // if we encounter an escaped % then don't increase the array index
	      if (match === '%%') return match;
	      index++;
	      var formatter = exports.formatters[format];
	      if ('function' === typeof formatter) {
	        var val = args[index];
	        match = formatter.call(self, val);
	
	        // now we need to remove `args[index]` since it's inlined in the `format`
	        args.splice(index, 1);
	        index--;
	      }
	      return match;
	    });
	
	    if ('function' === typeof exports.formatArgs) {
	      args = exports.formatArgs.apply(self, args);
	    }
	    var logFn = enabled.log || exports.log || console.log.bind(console);
	    logFn.apply(self, args);
	  }
	  enabled.enabled = true;
	
	  var fn = exports.enabled(namespace) ? enabled : disabled;
	
	  fn.namespace = namespace;
	
	  return fn;
	}
	
	/**
	 * Enables a debug mode by namespaces. This can include modes
	 * separated by a colon and wildcards.
	 *
	 * @param {String} namespaces
	 * @api public
	 */
	
	function enable(namespaces) {
	  exports.save(namespaces);
	
	  var split = (namespaces || '').split(/[\s,]+/);
	  var len = split.length;
	
	  for (var i = 0; i < len; i++) {
	    if (!split[i]) continue; // ignore empty strings
	    namespaces = split[i].replace(/\*/g, '.*?');
	    if (namespaces[0] === '-') {
	      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
	    } else {
	      exports.names.push(new RegExp('^' + namespaces + '$'));
	    }
	  }
	}
	
	/**
	 * Disable debug output.
	 *
	 * @api public
	 */
	
	function disable() {
	  exports.enable('');
	}
	
	/**
	 * Returns true if the given mode name is enabled, false otherwise.
	 *
	 * @param {String} name
	 * @return {Boolean}
	 * @api public
	 */
	
	function enabled(name) {
	  var i, len;
	  for (i = 0, len = exports.skips.length; i < len; i++) {
	    if (exports.skips[i].test(name)) {
	      return false;
	    }
	  }
	  for (i = 0, len = exports.names.length; i < len; i++) {
	    if (exports.names[i].test(name)) {
	      return true;
	    }
	  }
	  return false;
	}
	
	/**
	 * Coerce `val`.
	 *
	 * @param {Mixed} val
	 * @return {Mixed}
	 * @api private
	 */
	
	function coerce(val) {
	  if (val instanceof Error) return val.stack || val.message;
	  return val;
	}


/***/ },
/* 195 */
/***/ function(module, exports) {

	/**
	 * Helpers.
	 */
	
	var s = 1000;
	var m = s * 60;
	var h = m * 60;
	var d = h * 24;
	var y = d * 365.25;
	
	/**
	 * Parse or format the given `val`.
	 *
	 * Options:
	 *
	 *  - `long` verbose formatting [false]
	 *
	 * @param {String|Number} val
	 * @param {Object} options
	 * @return {String|Number}
	 * @api public
	 */
	
	module.exports = function(val, options){
	  options = options || {};
	  if ('string' == typeof val) return parse(val);
	  return options.long
	    ? long(val)
	    : short(val);
	};
	
	/**
	 * Parse the given `str` and return milliseconds.
	 *
	 * @param {String} str
	 * @return {Number}
	 * @api private
	 */
	
	function parse(str) {
	  str = '' + str;
	  if (str.length > 10000) return;
	  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(str);
	  if (!match) return;
	  var n = parseFloat(match[1]);
	  var type = (match[2] || 'ms').toLowerCase();
	  switch (type) {
	    case 'years':
	    case 'year':
	    case 'yrs':
	    case 'yr':
	    case 'y':
	      return n * y;
	    case 'days':
	    case 'day':
	    case 'd':
	      return n * d;
	    case 'hours':
	    case 'hour':
	    case 'hrs':
	    case 'hr':
	    case 'h':
	      return n * h;
	    case 'minutes':
	    case 'minute':
	    case 'mins':
	    case 'min':
	    case 'm':
	      return n * m;
	    case 'seconds':
	    case 'second':
	    case 'secs':
	    case 'sec':
	    case 's':
	      return n * s;
	    case 'milliseconds':
	    case 'millisecond':
	    case 'msecs':
	    case 'msec':
	    case 'ms':
	      return n;
	  }
	}
	
	/**
	 * Short format for `ms`.
	 *
	 * @param {Number} ms
	 * @return {String}
	 * @api private
	 */
	
	function short(ms) {
	  if (ms >= d) return Math.round(ms / d) + 'd';
	  if (ms >= h) return Math.round(ms / h) + 'h';
	  if (ms >= m) return Math.round(ms / m) + 'm';
	  if (ms >= s) return Math.round(ms / s) + 's';
	  return ms + 'ms';
	}
	
	/**
	 * Long format for `ms`.
	 *
	 * @param {Number} ms
	 * @return {String}
	 * @api private
	 */
	
	function long(ms) {
	  return plural(ms, d, 'day')
	    || plural(ms, h, 'hour')
	    || plural(ms, m, 'minute')
	    || plural(ms, s, 'second')
	    || ms + ' ms';
	}
	
	/**
	 * Pluralization helper.
	 */
	
	function plural(ms, n, name) {
	  if (ms < n) return;
	  if (ms < n * 1.5) return Math.floor(ms / n) + ' ' + name;
	  return Math.ceil(ms / n) + ' ' + name + 's';
	}


/***/ },
/* 196 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {
	/**
	 * Module requirements.
	 */
	
	var Polling = __webpack_require__(178);
	var inherit = __webpack_require__(191);
	
	/**
	 * Module exports.
	 */
	
	module.exports = JSONPPolling;
	
	/**
	 * Cached regular expressions.
	 */
	
	var rNewline = /\n/g;
	var rEscapedNewline = /\\n/g;
	
	/**
	 * Global JSONP callbacks.
	 */
	
	var callbacks;
	
	/**
	 * Callbacks count.
	 */
	
	var index = 0;
	
	/**
	 * Noop.
	 */
	
	function empty () { }
	
	/**
	 * JSONP Polling constructor.
	 *
	 * @param {Object} opts.
	 * @api public
	 */
	
	function JSONPPolling (opts) {
	  Polling.call(this, opts);
	
	  this.query = this.query || {};
	
	  // define global callbacks array if not present
	  // we do this here (lazily) to avoid unneeded global pollution
	  if (!callbacks) {
	    // we need to consider multiple engines in the same page
	    if (!global.___eio) global.___eio = [];
	    callbacks = global.___eio;
	  }
	
	  // callback identifier
	  this.index = callbacks.length;
	
	  // add callback to jsonp global
	  var self = this;
	  callbacks.push(function (msg) {
	    self.onData(msg);
	  });
	
	  // append to query string
	  this.query.j = this.index;
	
	  // prevent spurious errors from being emitted when the window is unloaded
	  if (global.document && global.addEventListener) {
	    global.addEventListener('beforeunload', function () {
	      if (self.script) self.script.onerror = empty;
	    }, false);
	  }
	}
	
	/**
	 * Inherits from Polling.
	 */
	
	inherit(JSONPPolling, Polling);
	
	/*
	 * JSONP only supports binary as base64 encoded strings
	 */
	
	JSONPPolling.prototype.supportsBinary = false;
	
	/**
	 * Closes the socket.
	 *
	 * @api private
	 */
	
	JSONPPolling.prototype.doClose = function () {
	  if (this.script) {
	    this.script.parentNode.removeChild(this.script);
	    this.script = null;
	  }
	
	  if (this.form) {
	    this.form.parentNode.removeChild(this.form);
	    this.form = null;
	    this.iframe = null;
	  }
	
	  Polling.prototype.doClose.call(this);
	};
	
	/**
	 * Starts a poll cycle.
	 *
	 * @api private
	 */
	
	JSONPPolling.prototype.doPoll = function () {
	  var self = this;
	  var script = document.createElement('script');
	
	  if (this.script) {
	    this.script.parentNode.removeChild(this.script);
	    this.script = null;
	  }
	
	  script.async = true;
	  script.src = this.uri();
	  script.onerror = function(e){
	    self.onError('jsonp poll error',e);
	  };
	
	  var insertAt = document.getElementsByTagName('script')[0];
	  if (insertAt) {
	    insertAt.parentNode.insertBefore(script, insertAt);
	  }
	  else {
	    (document.head || document.body).appendChild(script);
	  }
	  this.script = script;
	
	  var isUAgecko = 'undefined' != typeof navigator && /gecko/i.test(navigator.userAgent);
	  
	  if (isUAgecko) {
	    setTimeout(function () {
	      var iframe = document.createElement('iframe');
	      document.body.appendChild(iframe);
	      document.body.removeChild(iframe);
	    }, 100);
	  }
	};
	
	/**
	 * Writes with a hidden iframe.
	 *
	 * @param {String} data to send
	 * @param {Function} called upon flush.
	 * @api private
	 */
	
	JSONPPolling.prototype.doWrite = function (data, fn) {
	  var self = this;
	
	  if (!this.form) {
	    var form = document.createElement('form');
	    var area = document.createElement('textarea');
	    var id = this.iframeId = 'eio_iframe_' + this.index;
	    var iframe;
	
	    form.className = 'socketio';
	    form.style.position = 'absolute';
	    form.style.top = '-1000px';
	    form.style.left = '-1000px';
	    form.target = id;
	    form.method = 'POST';
	    form.setAttribute('accept-charset', 'utf-8');
	    area.name = 'd';
	    form.appendChild(area);
	    document.body.appendChild(form);
	
	    this.form = form;
	    this.area = area;
	  }
	
	  this.form.action = this.uri();
	
	  function complete () {
	    initIframe();
	    fn();
	  }
	
	  function initIframe () {
	    if (self.iframe) {
	      try {
	        self.form.removeChild(self.iframe);
	      } catch (e) {
	        self.onError('jsonp polling iframe removal error', e);
	      }
	    }
	
	    try {
	      // ie6 dynamic iframes with target="" support (thanks Chris Lambacher)
	      var html = '<iframe src="javascript:0" name="'+ self.iframeId +'">';
	      iframe = document.createElement(html);
	    } catch (e) {
	      iframe = document.createElement('iframe');
	      iframe.name = self.iframeId;
	      iframe.src = 'javascript:0';
	    }
	
	    iframe.id = self.iframeId;
	
	    self.form.appendChild(iframe);
	    self.iframe = iframe;
	  }
	
	  initIframe();
	
	  // escape \n to prevent it from being converted into \r\n by some UAs
	  // double escaping is required for escaped new lines because unescaping of new lines can be done safely on server-side
	  data = data.replace(rEscapedNewline, '\\\n');
	  this.area.value = data.replace(rNewline, '\\n');
	
	  try {
	    this.form.submit();
	  } catch(e) {}
	
	  if (this.iframe.attachEvent) {
	    this.iframe.onreadystatechange = function(){
	      if (self.iframe.readyState == 'complete') {
	        complete();
	      }
	    };
	  } else {
	    this.iframe.onload = complete;
	  }
	};
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 197 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/**
	 * Module dependencies.
	 */
	
	var Transport = __webpack_require__(179);
	var parser = __webpack_require__(180);
	var parseqs = __webpack_require__(190);
	var inherit = __webpack_require__(191);
	var yeast = __webpack_require__(192);
	var debug = __webpack_require__(193)('engine.io-client:websocket');
	var BrowserWebSocket = global.WebSocket || global.MozWebSocket;
	
	/**
	 * Get either the `WebSocket` or `MozWebSocket` globals
	 * in the browser or try to resolve WebSocket-compatible
	 * interface exposed by `ws` for Node-like environment.
	 */
	
	var WebSocket = BrowserWebSocket;
	if (!WebSocket && typeof window === 'undefined') {
	  try {
	    WebSocket = __webpack_require__(198);
	  } catch (e) { }
	}
	
	/**
	 * Module exports.
	 */
	
	module.exports = WS;
	
	/**
	 * WebSocket transport constructor.
	 *
	 * @api {Object} connection options
	 * @api public
	 */
	
	function WS(opts){
	  var forceBase64 = (opts && opts.forceBase64);
	  if (forceBase64) {
	    this.supportsBinary = false;
	  }
	  this.perMessageDeflate = opts.perMessageDeflate;
	  Transport.call(this, opts);
	}
	
	/**
	 * Inherits from Transport.
	 */
	
	inherit(WS, Transport);
	
	/**
	 * Transport name.
	 *
	 * @api public
	 */
	
	WS.prototype.name = 'websocket';
	
	/*
	 * WebSockets support binary
	 */
	
	WS.prototype.supportsBinary = true;
	
	/**
	 * Opens socket.
	 *
	 * @api private
	 */
	
	WS.prototype.doOpen = function(){
	  if (!this.check()) {
	    // let probe timeout
	    return;
	  }
	
	  var self = this;
	  var uri = this.uri();
	  var protocols = void(0);
	  var opts = {
	    agent: this.agent,
	    perMessageDeflate: this.perMessageDeflate
	  };
	
	  // SSL options for Node.js client
	  opts.pfx = this.pfx;
	  opts.key = this.key;
	  opts.passphrase = this.passphrase;
	  opts.cert = this.cert;
	  opts.ca = this.ca;
	  opts.ciphers = this.ciphers;
	  opts.rejectUnauthorized = this.rejectUnauthorized;
	  if (this.extraHeaders) {
	    opts.headers = this.extraHeaders;
	  }
	
	  this.ws = BrowserWebSocket ? new WebSocket(uri) : new WebSocket(uri, protocols, opts);
	
	  if (this.ws.binaryType === undefined) {
	    this.supportsBinary = false;
	  }
	
	  if (this.ws.supports && this.ws.supports.binary) {
	    this.supportsBinary = true;
	    this.ws.binaryType = 'buffer';
	  } else {
	    this.ws.binaryType = 'arraybuffer';
	  }
	
	  this.addEventListeners();
	};
	
	/**
	 * Adds event listeners to the socket
	 *
	 * @api private
	 */
	
	WS.prototype.addEventListeners = function(){
	  var self = this;
	
	  this.ws.onopen = function(){
	    self.onOpen();
	  };
	  this.ws.onclose = function(){
	    self.onClose();
	  };
	  this.ws.onmessage = function(ev){
	    self.onData(ev.data);
	  };
	  this.ws.onerror = function(e){
	    self.onError('websocket error', e);
	  };
	};
	
	/**
	 * Override `onData` to use a timer on iOS.
	 * See: https://gist.github.com/mloughran/2052006
	 *
	 * @api private
	 */
	
	if ('undefined' != typeof navigator
	  && /iPad|iPhone|iPod/i.test(navigator.userAgent)) {
	  WS.prototype.onData = function(data){
	    var self = this;
	    setTimeout(function(){
	      Transport.prototype.onData.call(self, data);
	    }, 0);
	  };
	}
	
	/**
	 * Writes data to socket.
	 *
	 * @param {Array} array of packets.
	 * @api private
	 */
	
	WS.prototype.write = function(packets){
	  var self = this;
	  this.writable = false;
	
	  // encodePacket efficient as it uses WS framing
	  // no need for encodePayload
	  var total = packets.length;
	  for (var i = 0, l = total; i < l; i++) {
	    (function(packet) {
	      parser.encodePacket(packet, self.supportsBinary, function(data) {
	        if (!BrowserWebSocket) {
	          // always create a new object (GH-437)
	          var opts = {};
	          if (packet.options) {
	            opts.compress = packet.options.compress;
	          }
	
	          if (self.perMessageDeflate) {
	            var len = 'string' == typeof data ? global.Buffer.byteLength(data) : data.length;
	            if (len < self.perMessageDeflate.threshold) {
	              opts.compress = false;
	            }
	          }
	        }
	
	        //Sometimes the websocket has already been closed but the browser didn't
	        //have a chance of informing us about it yet, in that case send will
	        //throw an error
	        try {
	          if (BrowserWebSocket) {
	            // TypeError is thrown when passing the second argument on Safari
	            self.ws.send(data);
	          } else {
	            self.ws.send(data, opts);
	          }
	        } catch (e){
	          debug('websocket closed before onclose event');
	        }
	
	        --total || done();
	      });
	    })(packets[i]);
	  }
	
	  function done(){
	    self.emit('flush');
	
	    // fake drain
	    // defer to next tick to allow Socket to clear writeBuffer
	    setTimeout(function(){
	      self.writable = true;
	      self.emit('drain');
	    }, 0);
	  }
	};
	
	/**
	 * Called upon close
	 *
	 * @api private
	 */
	
	WS.prototype.onClose = function(){
	  Transport.prototype.onClose.call(this);
	};
	
	/**
	 * Closes socket.
	 *
	 * @api private
	 */
	
	WS.prototype.doClose = function(){
	  if (typeof this.ws !== 'undefined') {
	    this.ws.close();
	  }
	};
	
	/**
	 * Generates uri for connection.
	 *
	 * @api private
	 */
	
	WS.prototype.uri = function(){
	  var query = this.query || {};
	  var schema = this.secure ? 'wss' : 'ws';
	  var port = '';
	
	  // avoid port if default for schema
	  if (this.port && (('wss' == schema && this.port != 443)
	    || ('ws' == schema && this.port != 80))) {
	    port = ':' + this.port;
	  }
	
	  // append timestamp to URI
	  if (this.timestampRequests) {
	    query[this.timestampParam] = yeast();
	  }
	
	  // communicate binary support capabilities
	  if (!this.supportsBinary) {
	    query.b64 = 1;
	  }
	
	  query = parseqs.encode(query);
	
	  // prepend ? to query
	  if (query.length) {
	    query = '?' + query;
	  }
	
	  var ipv6 = this.hostname.indexOf(':') !== -1;
	  return schema + '://' + (ipv6 ? '[' + this.hostname + ']' : this.hostname) + port + this.path + query;
	};
	
	/**
	 * Feature detection for WebSocket.
	 *
	 * @return {Boolean} whether this transport is available.
	 * @api public
	 */
	
	WS.prototype.check = function(){
	  return !!WebSocket && !('__initialize' in WebSocket && this.name === WS.prototype.name);
	};
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 198 */
/***/ function(module, exports) {

	/* (ignored) */

/***/ },
/* 199 */
/***/ function(module, exports) {

	
	var indexOf = [].indexOf;
	
	module.exports = function(arr, obj){
	  if (indexOf) return arr.indexOf(obj);
	  for (var i = 0; i < arr.length; ++i) {
	    if (arr[i] === obj) return i;
	  }
	  return -1;
	};

/***/ },
/* 200 */
/***/ function(module, exports) {

	/**
	 * Parses an URI
	 *
	 * @author Steven Levithan <stevenlevithan.com> (MIT license)
	 * @api private
	 */
	
	var re = /^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;
	
	var parts = [
	    'source', 'protocol', 'authority', 'userInfo', 'user', 'password', 'host', 'port', 'relative', 'path', 'directory', 'file', 'query', 'anchor'
	];
	
	module.exports = function parseuri(str) {
	    var src = str,
	        b = str.indexOf('['),
	        e = str.indexOf(']');
	
	    if (b != -1 && e != -1) {
	        str = str.substring(0, b) + str.substring(b, e).replace(/:/g, ';') + str.substring(e, str.length);
	    }
	
	    var m = re.exec(str || ''),
	        uri = {},
	        i = 14;
	
	    while (i--) {
	        uri[parts[i]] = m[i] || '';
	    }
	
	    if (b != -1 && e != -1) {
	        uri.source = src;
	        uri.host = uri.host.substring(1, uri.host.length - 1).replace(/;/g, ':');
	        uri.authority = uri.authority.replace('[', '').replace(']', '').replace(/;/g, ':');
	        uri.ipv6uri = true;
	    }
	
	    return uri;
	};


/***/ },
/* 201 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {/**
	 * JSON parse.
	 *
	 * @see Based on jQuery#parseJSON (MIT) and JSON2
	 * @api private
	 */
	
	var rvalidchars = /^[\],:{}\s]*$/;
	var rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
	var rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
	var rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g;
	var rtrimLeft = /^\s+/;
	var rtrimRight = /\s+$/;
	
	module.exports = function parsejson(data) {
	  if ('string' != typeof data || !data) {
	    return null;
	  }
	
	  data = data.replace(rtrimLeft, '').replace(rtrimRight, '');
	
	  // Attempt to parse using the native JSON parser first
	  if (global.JSON && JSON.parse) {
	    return JSON.parse(data);
	  }
	
	  if (rvalidchars.test(data.replace(rvalidescape, '@')
	      .replace(rvalidtokens, ']')
	      .replace(rvalidbraces, ''))) {
	    return (new Function('return ' + data))();
	  }
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 202 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	exports.TokenStorage = exports.FakeStorage = undefined;
	
	var _typeof2 = __webpack_require__(52);
	
	var _typeof3 = _interopRequireDefault(_typeof2);
	
	var _classCallCheck2 = __webpack_require__(128);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	exports.authEndpoint = authEndpoint;
	exports.clearAuthTokens = clearAuthTokens;
	
	var _queryParse = __webpack_require__(203);
	
	var _queryParse2 = _interopRequireDefault(_queryParse);
	
	var _Observable = __webpack_require__(4);
	
	var _fetch = __webpack_require__(204);
	
	var _fetch2 = _interopRequireDefault(_fetch);
	
	__webpack_require__(210);
	
	__webpack_require__(44);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var HORIZON_JWT = 'horizon-jwt';
	
	/** @this Horizon **/
	function authEndpoint(name) {
	  var _this = this;
	
	  var endpointForName = function endpointForName(methods) {
	    if (methods.hasOwnProperty(name)) {
	      return methods[name];
	    } else {
	      throw new Error('Unconfigured auth type: ' + name);
	    }
	  };
	  if (!this._authMethods) {
	    return (0, _fetch2.default)(this._horizonPath + '/auth_methods').do(function (authMethods) {
	      _this._authMethods = authMethods;
	    }).map(endpointForName);
	  } else {
	    return _Observable.Observable.of(this._authMethods).map(endpointForName);
	  }
	}
	
	// Simple shim to make a Map look like local/session storage
	
	var FakeStorage = exports.FakeStorage = function () {
	  function FakeStorage() {
	    (0, _classCallCheck3.default)(this, FakeStorage);
	    this._storage = new Map();
	  }
	
	  FakeStorage.prototype.setItem = function setItem(a, b) {
	    return this._storage.set(a, b);
	  };
	
	  FakeStorage.prototype.getItem = function getItem(a) {
	    return this._storage.get(a);
	  };
	
	  FakeStorage.prototype.removeItem = function removeItem(a) {
	    return this._storage.delete(a);
	  };
	
	  return FakeStorage;
	}();
	
	function getStorage() {
	  var storeLocally = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];
	
	  var storage = void 0;
	  try {
	    if (!storeLocally || (typeof window === 'undefined' ? 'undefined' : (0, _typeof3.default)(window)) !== 'object' || window.localStorage === undefined) {
	      storage = new FakeStorage();
	    } else {
	      // Mobile safari in private browsing has a localStorage, but it
	      // has a size limit of 0
	      window.localStorage.setItem('$$fake', 1);
	      window.localStorage.removeItem('$$fake');
	      storage = window.localStorage;
	    }
	  } catch (error) {
	    if (window.sessionStorage === undefined) {
	      storage = new FakeStorage();
	    } else {
	      storage = window.sessionStorage;
	    }
	  }
	  return storage;
	}
	
	var TokenStorage = exports.TokenStorage = function () {
	  function TokenStorage() {
	    var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	
	    var _ref$authType = _ref.authType;
	    var authType = _ref$authType === undefined ? 'token' : _ref$authType;
	    var _ref$storage = _ref.storage;
	    var storage = _ref$storage === undefined ? getStorage(authType.storeLocally) : _ref$storage;
	    var _ref$path = _ref.path;
	    var path = _ref$path === undefined ? 'horizon' : _ref$path;
	    (0, _classCallCheck3.default)(this, TokenStorage);
	
	    this._storage = storage;
	    this._path = path;
	    if (typeof authType === 'string') {
	      this._authType = authType;
	    } else {
	      this._authType = 'token';
	      this.set(authType.token);
	    }
	  }
	
	  TokenStorage.prototype._getHash = function _getHash() {
	    var val = this._storage.getItem(HORIZON_JWT);
	    if (val == null) {
	      return {};
	    } else {
	      return JSON.parse(val);
	    }
	  };
	
	  TokenStorage.prototype._setHash = function _setHash(hash) {
	    this._storage.setItem(HORIZON_JWT, JSON.stringify(hash));
	  };
	
	  TokenStorage.prototype.set = function set(jwt) {
	    var current = this._getHash();
	    current[this._path] = jwt;
	    this._setHash(current);
	  };
	
	  TokenStorage.prototype.get = function get() {
	    return this._getHash()[this._path];
	  };
	
	  TokenStorage.prototype.remove = function remove() {
	    var current = this._getHash();
	    delete current[this._path];
	    this._setHash(current);
	  };
	
	  TokenStorage.prototype.setAuthFromQueryParams = function setAuthFromQueryParams() {
	    var parsed = typeof window !== 'undefined' ? (0, _queryParse2.default)(window.location.search) : {};
	
	    if (parsed.horizon_token != null) {
	      this.set(parsed.horizon_token);
	    }
	  };
	
	  // Handshake types are implemented here
	
	
	  TokenStorage.prototype.handshake = function handshake() {
	    // If we have a token, we should send it rather than requesting a
	    // new one
	    var token = this.get();
	    if (token != null) {
	      return { method: 'token', token: token };
	    } else if (this._authType === 'token') {
	      throw new Error('Attempting to authenticate with a token, but no token is present');
	    } else {
	      return { method: this._authType };
	    }
	  };
	
	  // Whether there is an auth token for the provided authType
	
	
	  TokenStorage.prototype.hasAuthToken = function hasAuthToken() {
	    return Boolean(this.get());
	  };
	
	  return TokenStorage;
	}();
	
	function clearAuthTokens() {
	  return getStorage().removeItem(HORIZON_JWT);
	}
	//# sourceMappingURL=auth.js.map

/***/ },
/* 203 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	
	exports.default = function (str) {
	  if (typeof str !== 'string') {
	    return {};
	  }
	
	  var str2 = str.trim().replace(/^(\?|#|&)/, '');
	
	  if (!str2) {
	    return {};
	  }
	
	  return str2.split('&').reduce(function (ret, param) {
	    var parts = param.replace(/\+/g, ' ').split('=');
	    // Firefox (pre 40) decodes `%3D` to `=`
	    // https://github.com/sindresorhus/query-string/pull/37
	    var key = parts.shift();
	    var val = parts.length > 0 ? parts.join('=') : undefined;
	
	    var key2 = decodeURIComponent(key);
	
	    // missing `=` should be `null`:
	    // http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
	    var val2 = val === undefined ? null : decodeURIComponent(val);
	
	    if (!ret.hasOwnProperty(key2)) {
	      ret[key2] = val2;
	    } else if (Array.isArray(ret[key2])) {
	      ret[key2].push(val2);
	    } else {
	      ret[key2] = [ret[key2], val2];
	    }
	
	    return ret;
	  }, {});
	};
	//# sourceMappingURL=query-parse.js.map

/***/ },
/* 204 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';
	
	exports.__esModule = true;
	exports.default = fetchJSON;
	
	var _Observable = __webpack_require__(4);
	
	__webpack_require__(205);
	
	__webpack_require__(207);
	
	global.self = global;
	__webpack_require__(208);
	
	function fetchJSON(url) {
	  return _Observable.Observable.fromPromise(fetch(url)).mergeMap(function (response) {
	    var contentType = response.headers.get('content-type');
	    if (contentType && contentType.indexOf('application/json') !== -1) {
	      return response.json();
	    } else {
	      return response.text().then(function (resp) {
	        return {
	          error: 'Response was not json',
	          responseBody: resp
	        };
	      });
	    }
	  });
	}
	//# sourceMappingURL=fetch.js.map
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 205 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Observable_1 = __webpack_require__(4);
	var fromPromise_1 = __webpack_require__(206);
	Observable_1.Observable.fromPromise = fromPromise_1.fromPromise;
	//# sourceMappingURL=fromPromise.js.map

/***/ },
/* 206 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var PromiseObservable_1 = __webpack_require__(30);
	exports.fromPromise = PromiseObservable_1.PromiseObservable.create;
	//# sourceMappingURL=fromPromise.js.map

/***/ },
/* 207 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Observable_1 = __webpack_require__(4);
	var mergeMap_1 = __webpack_require__(40);
	Observable_1.Observable.prototype.mergeMap = mergeMap_1.mergeMap;
	Observable_1.Observable.prototype.flatMap = mergeMap_1.mergeMap;
	//# sourceMappingURL=mergeMap.js.map

/***/ },
/* 208 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/*** IMPORTS FROM imports-loader ***/
	(function() {
	
	// the whatwg-fetch polyfill installs the fetch() function
	// on the global object (window or self)
	//
	// Return that as the export for use in Webpack, Browserify etc.
	__webpack_require__(209);
	module.exports = self.fetch.bind(self);
	
	
	/*** EXPORTS FROM exports-loader ***/
	module.exports = global.fetch;
	}.call(global));
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 209 */
/***/ function(module, exports) {

	(function(self) {
	  'use strict';
	
	  if (self.fetch) {
	    return
	  }
	
	  var support = {
	    searchParams: 'URLSearchParams' in self,
	    iterable: 'Symbol' in self && 'iterator' in Symbol,
	    blob: 'FileReader' in self && 'Blob' in self && (function() {
	      try {
	        new Blob()
	        return true
	      } catch(e) {
	        return false
	      }
	    })(),
	    formData: 'FormData' in self,
	    arrayBuffer: 'ArrayBuffer' in self
	  }
	
	  function normalizeName(name) {
	    if (typeof name !== 'string') {
	      name = String(name)
	    }
	    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
	      throw new TypeError('Invalid character in header field name')
	    }
	    return name.toLowerCase()
	  }
	
	  function normalizeValue(value) {
	    if (typeof value !== 'string') {
	      value = String(value)
	    }
	    return value
	  }
	
	  // Build a destructive iterator for the value list
	  function iteratorFor(items) {
	    var iterator = {
	      next: function() {
	        var value = items.shift()
	        return {done: value === undefined, value: value}
	      }
	    }
	
	    if (support.iterable) {
	      iterator[Symbol.iterator] = function() {
	        return iterator
	      }
	    }
	
	    return iterator
	  }
	
	  function Headers(headers) {
	    this.map = {}
	
	    if (headers instanceof Headers) {
	      headers.forEach(function(value, name) {
	        this.append(name, value)
	      }, this)
	
	    } else if (headers) {
	      Object.getOwnPropertyNames(headers).forEach(function(name) {
	        this.append(name, headers[name])
	      }, this)
	    }
	  }
	
	  Headers.prototype.append = function(name, value) {
	    name = normalizeName(name)
	    value = normalizeValue(value)
	    var list = this.map[name]
	    if (!list) {
	      list = []
	      this.map[name] = list
	    }
	    list.push(value)
	  }
	
	  Headers.prototype['delete'] = function(name) {
	    delete this.map[normalizeName(name)]
	  }
	
	  Headers.prototype.get = function(name) {
	    var values = this.map[normalizeName(name)]
	    return values ? values[0] : null
	  }
	
	  Headers.prototype.getAll = function(name) {
	    return this.map[normalizeName(name)] || []
	  }
	
	  Headers.prototype.has = function(name) {
	    return this.map.hasOwnProperty(normalizeName(name))
	  }
	
	  Headers.prototype.set = function(name, value) {
	    this.map[normalizeName(name)] = [normalizeValue(value)]
	  }
	
	  Headers.prototype.forEach = function(callback, thisArg) {
	    Object.getOwnPropertyNames(this.map).forEach(function(name) {
	      this.map[name].forEach(function(value) {
	        callback.call(thisArg, value, name, this)
	      }, this)
	    }, this)
	  }
	
	  Headers.prototype.keys = function() {
	    var items = []
	    this.forEach(function(value, name) { items.push(name) })
	    return iteratorFor(items)
	  }
	
	  Headers.prototype.values = function() {
	    var items = []
	    this.forEach(function(value) { items.push(value) })
	    return iteratorFor(items)
	  }
	
	  Headers.prototype.entries = function() {
	    var items = []
	    this.forEach(function(value, name) { items.push([name, value]) })
	    return iteratorFor(items)
	  }
	
	  if (support.iterable) {
	    Headers.prototype[Symbol.iterator] = Headers.prototype.entries
	  }
	
	  function consumed(body) {
	    if (body.bodyUsed) {
	      return Promise.reject(new TypeError('Already read'))
	    }
	    body.bodyUsed = true
	  }
	
	  function fileReaderReady(reader) {
	    return new Promise(function(resolve, reject) {
	      reader.onload = function() {
	        resolve(reader.result)
	      }
	      reader.onerror = function() {
	        reject(reader.error)
	      }
	    })
	  }
	
	  function readBlobAsArrayBuffer(blob) {
	    var reader = new FileReader()
	    reader.readAsArrayBuffer(blob)
	    return fileReaderReady(reader)
	  }
	
	  function readBlobAsText(blob) {
	    var reader = new FileReader()
	    reader.readAsText(blob)
	    return fileReaderReady(reader)
	  }
	
	  function Body() {
	    this.bodyUsed = false
	
	    this._initBody = function(body) {
	      this._bodyInit = body
	      if (typeof body === 'string') {
	        this._bodyText = body
	      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
	        this._bodyBlob = body
	      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
	        this._bodyFormData = body
	      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
	        this._bodyText = body.toString()
	      } else if (!body) {
	        this._bodyText = ''
	      } else if (support.arrayBuffer && ArrayBuffer.prototype.isPrototypeOf(body)) {
	        // Only support ArrayBuffers for POST method.
	        // Receiving ArrayBuffers happens via Blobs, instead.
	      } else {
	        throw new Error('unsupported BodyInit type')
	      }
	
	      if (!this.headers.get('content-type')) {
	        if (typeof body === 'string') {
	          this.headers.set('content-type', 'text/plain;charset=UTF-8')
	        } else if (this._bodyBlob && this._bodyBlob.type) {
	          this.headers.set('content-type', this._bodyBlob.type)
	        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
	          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8')
	        }
	      }
	    }
	
	    if (support.blob) {
	      this.blob = function() {
	        var rejected = consumed(this)
	        if (rejected) {
	          return rejected
	        }
	
	        if (this._bodyBlob) {
	          return Promise.resolve(this._bodyBlob)
	        } else if (this._bodyFormData) {
	          throw new Error('could not read FormData body as blob')
	        } else {
	          return Promise.resolve(new Blob([this._bodyText]))
	        }
	      }
	
	      this.arrayBuffer = function() {
	        return this.blob().then(readBlobAsArrayBuffer)
	      }
	
	      this.text = function() {
	        var rejected = consumed(this)
	        if (rejected) {
	          return rejected
	        }
	
	        if (this._bodyBlob) {
	          return readBlobAsText(this._bodyBlob)
	        } else if (this._bodyFormData) {
	          throw new Error('could not read FormData body as text')
	        } else {
	          return Promise.resolve(this._bodyText)
	        }
	      }
	    } else {
	      this.text = function() {
	        var rejected = consumed(this)
	        return rejected ? rejected : Promise.resolve(this._bodyText)
	      }
	    }
	
	    if (support.formData) {
	      this.formData = function() {
	        return this.text().then(decode)
	      }
	    }
	
	    this.json = function() {
	      return this.text().then(JSON.parse)
	    }
	
	    return this
	  }
	
	  // HTTP methods whose capitalization should be normalized
	  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']
	
	  function normalizeMethod(method) {
	    var upcased = method.toUpperCase()
	    return (methods.indexOf(upcased) > -1) ? upcased : method
	  }
	
	  function Request(input, options) {
	    options = options || {}
	    var body = options.body
	    if (Request.prototype.isPrototypeOf(input)) {
	      if (input.bodyUsed) {
	        throw new TypeError('Already read')
	      }
	      this.url = input.url
	      this.credentials = input.credentials
	      if (!options.headers) {
	        this.headers = new Headers(input.headers)
	      }
	      this.method = input.method
	      this.mode = input.mode
	      if (!body) {
	        body = input._bodyInit
	        input.bodyUsed = true
	      }
	    } else {
	      this.url = input
	    }
	
	    this.credentials = options.credentials || this.credentials || 'omit'
	    if (options.headers || !this.headers) {
	      this.headers = new Headers(options.headers)
	    }
	    this.method = normalizeMethod(options.method || this.method || 'GET')
	    this.mode = options.mode || this.mode || null
	    this.referrer = null
	
	    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
	      throw new TypeError('Body not allowed for GET or HEAD requests')
	    }
	    this._initBody(body)
	  }
	
	  Request.prototype.clone = function() {
	    return new Request(this)
	  }
	
	  function decode(body) {
	    var form = new FormData()
	    body.trim().split('&').forEach(function(bytes) {
	      if (bytes) {
	        var split = bytes.split('=')
	        var name = split.shift().replace(/\+/g, ' ')
	        var value = split.join('=').replace(/\+/g, ' ')
	        form.append(decodeURIComponent(name), decodeURIComponent(value))
	      }
	    })
	    return form
	  }
	
	  function headers(xhr) {
	    var head = new Headers()
	    var pairs = (xhr.getAllResponseHeaders() || '').trim().split('\n')
	    pairs.forEach(function(header) {
	      var split = header.trim().split(':')
	      var key = split.shift().trim()
	      var value = split.join(':').trim()
	      head.append(key, value)
	    })
	    return head
	  }
	
	  Body.call(Request.prototype)
	
	  function Response(bodyInit, options) {
	    if (!options) {
	      options = {}
	    }
	
	    this.type = 'default'
	    this.status = options.status
	    this.ok = this.status >= 200 && this.status < 300
	    this.statusText = options.statusText
	    this.headers = options.headers instanceof Headers ? options.headers : new Headers(options.headers)
	    this.url = options.url || ''
	    this._initBody(bodyInit)
	  }
	
	  Body.call(Response.prototype)
	
	  Response.prototype.clone = function() {
	    return new Response(this._bodyInit, {
	      status: this.status,
	      statusText: this.statusText,
	      headers: new Headers(this.headers),
	      url: this.url
	    })
	  }
	
	  Response.error = function() {
	    var response = new Response(null, {status: 0, statusText: ''})
	    response.type = 'error'
	    return response
	  }
	
	  var redirectStatuses = [301, 302, 303, 307, 308]
	
	  Response.redirect = function(url, status) {
	    if (redirectStatuses.indexOf(status) === -1) {
	      throw new RangeError('Invalid status code')
	    }
	
	    return new Response(null, {status: status, headers: {location: url}})
	  }
	
	  self.Headers = Headers
	  self.Request = Request
	  self.Response = Response
	
	  self.fetch = function(input, init) {
	    return new Promise(function(resolve, reject) {
	      var request
	      if (Request.prototype.isPrototypeOf(input) && !init) {
	        request = input
	      } else {
	        request = new Request(input, init)
	      }
	
	      var xhr = new XMLHttpRequest()
	
	      function responseURL() {
	        if ('responseURL' in xhr) {
	          return xhr.responseURL
	        }
	
	        // Avoid security warnings on getResponseHeader when not allowed by CORS
	        if (/^X-Request-URL:/m.test(xhr.getAllResponseHeaders())) {
	          return xhr.getResponseHeader('X-Request-URL')
	        }
	
	        return
	      }
	
	      xhr.onload = function() {
	        var options = {
	          status: xhr.status,
	          statusText: xhr.statusText,
	          headers: headers(xhr),
	          url: responseURL()
	        }
	        var body = 'response' in xhr ? xhr.response : xhr.responseText
	        resolve(new Response(body, options))
	      }
	
	      xhr.onerror = function() {
	        reject(new TypeError('Network request failed'))
	      }
	
	      xhr.ontimeout = function() {
	        reject(new TypeError('Network request failed'))
	      }
	
	      xhr.open(request.method, request.url, true)
	
	      if (request.credentials === 'include') {
	        xhr.withCredentials = true
	      }
	
	      if ('responseType' in xhr && support.blob) {
	        xhr.responseType = 'blob'
	      }
	
	      request.headers.forEach(function(value, name) {
	        xhr.setRequestHeader(name, value)
	      })
	
	      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
	    })
	  }
	  self.fetch.polyfill = true
	})(typeof self !== 'undefined' ? self : this);


/***/ },
/* 210 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Observable_1 = __webpack_require__(4);
	var do_1 = __webpack_require__(211);
	Observable_1.Observable.prototype.do = do_1._do;
	//# sourceMappingURL=do.js.map

/***/ },
/* 211 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Subscriber_1 = __webpack_require__(8);
	/**
	 * Perform a side effect for every emission on the source Observable, but return
	 * an Observable that is identical to the source.
	 *
	 * <span class="informal">Intercepts each emission on the source and runs a
	 * function, but returns an output which is identical to the source.</span>
	 *
	 * <img src="./img/do.png" width="100%">
	 *
	 * Returns a mirrored Observable of the source Observable, but modified so that
	 * the provided Observer is called to perform a side effect for every value,
	 * error, and completion emitted by the source. Any errors that are thrown in
	 * the aforementioned Observer or handlers are safely sent down the error path
	 * of the output Observable.
	 *
	 * This operator is useful for debugging your Observables for the correct values
	 * or performing other side effects.
	 *
	 * Note: this is different to a `subscribe` on the Observable. If the Observable
	 * returned by `do` is not subscribed, the side effects specified by the
	 * Observer will never happen. `do` therefore simply spies on existing
	 * execution, it does not trigger an execution to happen like `subscribe` does.
	 *
	 * @example <caption>Map every every click to the clientX position of that click, while also logging the click event</caption>
	 * var clicks = Rx.Observable.fromEvent(document, 'click');
	 * var positions = clicks
	 *   .do(ev => console.log(ev))
	 *   .map(ev => ev.clientX);
	 * positions.subscribe(x => console.log(x));
	 *
	 * @see {@link map}
	 * @see {@link subscribe}
	 *
	 * @param {Observer|function} [nextOrObserver] A normal Observer object or a
	 * callback for `next`.
	 * @param {function} [error] Callback for errors in the source.
	 * @param {function} [complete] Callback for the completion of the source.
	 * @return {Observable} An Observable identical to the source, but runs the
	 * specified Observer or callback(s) for each item.
	 * @method do
	 * @name do
	 * @owner Observable
	 */
	function _do(nextOrObserver, error, complete) {
	    return this.lift(new DoOperator(nextOrObserver, error, complete));
	}
	exports._do = _do;
	var DoOperator = (function () {
	    function DoOperator(nextOrObserver, error, complete) {
	        this.nextOrObserver = nextOrObserver;
	        this.error = error;
	        this.complete = complete;
	    }
	    DoOperator.prototype.call = function (subscriber, source) {
	        return source._subscribe(new DoSubscriber(subscriber, this.nextOrObserver, this.error, this.complete));
	    };
	    return DoOperator;
	}());
	/**
	 * We need this JSDoc comment for affecting ESDoc.
	 * @ignore
	 * @extends {Ignored}
	 */
	var DoSubscriber = (function (_super) {
	    __extends(DoSubscriber, _super);
	    function DoSubscriber(destination, nextOrObserver, error, complete) {
	        _super.call(this, destination);
	        var safeSubscriber = new Subscriber_1.Subscriber(nextOrObserver, error, complete);
	        safeSubscriber.syncErrorThrowable = true;
	        this.add(safeSubscriber);
	        this.safeSubscriber = safeSubscriber;
	    }
	    DoSubscriber.prototype._next = function (value) {
	        var safeSubscriber = this.safeSubscriber;
	        safeSubscriber.next(value);
	        if (safeSubscriber.syncErrorThrown) {
	            this.destination.error(safeSubscriber.syncErrorValue);
	        }
	        else {
	            this.destination.next(value);
	        }
	    };
	    DoSubscriber.prototype._error = function (err) {
	        var safeSubscriber = this.safeSubscriber;
	        safeSubscriber.error(err);
	        if (safeSubscriber.syncErrorThrown) {
	            this.destination.error(safeSubscriber.syncErrorValue);
	        }
	        else {
	            this.destination.error(err);
	        }
	    };
	    DoSubscriber.prototype._complete = function () {
	        var safeSubscriber = this.safeSubscriber;
	        safeSubscriber.complete();
	        if (safeSubscriber.syncErrorThrown) {
	            this.destination.error(safeSubscriber.syncErrorValue);
	        }
	        else {
	            this.destination.complete();
	        }
	    };
	    return DoSubscriber;
	}(Subscriber_1.Subscriber));
	//# sourceMappingURL=do.js.map

/***/ },
/* 212 */
/***/ function(module, exports, __webpack_require__) {

	var require;var require;/* WEBPACK VAR INJECTION */(function(global) {/*!
	    localForage -- Offline Storage, Improved
	    Version 1.4.2
	    https://mozilla.github.io/localForage
	    (c) 2013-2015 Mozilla, Apache License 2.0
	*/
	(function(f){if(true){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.localforage = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return require(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw (f.code="MODULE_NOT_FOUND", f)}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
	'use strict';
	var immediate = _dereq_(2);
	
	/* istanbul ignore next */
	function INTERNAL() {}
	
	var handlers = {};
	
	var REJECTED = ['REJECTED'];
	var FULFILLED = ['FULFILLED'];
	var PENDING = ['PENDING'];
	
	module.exports = exports = Promise;
	
	function Promise(resolver) {
	  if (typeof resolver !== 'function') {
	    throw new TypeError('resolver must be a function');
	  }
	  this.state = PENDING;
	  this.queue = [];
	  this.outcome = void 0;
	  if (resolver !== INTERNAL) {
	    safelyResolveThenable(this, resolver);
	  }
	}
	
	Promise.prototype["catch"] = function (onRejected) {
	  return this.then(null, onRejected);
	};
	Promise.prototype.then = function (onFulfilled, onRejected) {
	  if (typeof onFulfilled !== 'function' && this.state === FULFILLED ||
	    typeof onRejected !== 'function' && this.state === REJECTED) {
	    return this;
	  }
	  var promise = new this.constructor(INTERNAL);
	  if (this.state !== PENDING) {
	    var resolver = this.state === FULFILLED ? onFulfilled : onRejected;
	    unwrap(promise, resolver, this.outcome);
	  } else {
	    this.queue.push(new QueueItem(promise, onFulfilled, onRejected));
	  }
	
	  return promise;
	};
	function QueueItem(promise, onFulfilled, onRejected) {
	  this.promise = promise;
	  if (typeof onFulfilled === 'function') {
	    this.onFulfilled = onFulfilled;
	    this.callFulfilled = this.otherCallFulfilled;
	  }
	  if (typeof onRejected === 'function') {
	    this.onRejected = onRejected;
	    this.callRejected = this.otherCallRejected;
	  }
	}
	QueueItem.prototype.callFulfilled = function (value) {
	  handlers.resolve(this.promise, value);
	};
	QueueItem.prototype.otherCallFulfilled = function (value) {
	  unwrap(this.promise, this.onFulfilled, value);
	};
	QueueItem.prototype.callRejected = function (value) {
	  handlers.reject(this.promise, value);
	};
	QueueItem.prototype.otherCallRejected = function (value) {
	  unwrap(this.promise, this.onRejected, value);
	};
	
	function unwrap(promise, func, value) {
	  immediate(function () {
	    var returnValue;
	    try {
	      returnValue = func(value);
	    } catch (e) {
	      return handlers.reject(promise, e);
	    }
	    if (returnValue === promise) {
	      handlers.reject(promise, new TypeError('Cannot resolve promise with itself'));
	    } else {
	      handlers.resolve(promise, returnValue);
	    }
	  });
	}
	
	handlers.resolve = function (self, value) {
	  var result = tryCatch(getThen, value);
	  if (result.status === 'error') {
	    return handlers.reject(self, result.value);
	  }
	  var thenable = result.value;
	
	  if (thenable) {
	    safelyResolveThenable(self, thenable);
	  } else {
	    self.state = FULFILLED;
	    self.outcome = value;
	    var i = -1;
	    var len = self.queue.length;
	    while (++i < len) {
	      self.queue[i].callFulfilled(value);
	    }
	  }
	  return self;
	};
	handlers.reject = function (self, error) {
	  self.state = REJECTED;
	  self.outcome = error;
	  var i = -1;
	  var len = self.queue.length;
	  while (++i < len) {
	    self.queue[i].callRejected(error);
	  }
	  return self;
	};
	
	function getThen(obj) {
	  // Make sure we only access the accessor once as required by the spec
	  var then = obj && obj.then;
	  if (obj && typeof obj === 'object' && typeof then === 'function') {
	    return function appyThen() {
	      then.apply(obj, arguments);
	    };
	  }
	}
	
	function safelyResolveThenable(self, thenable) {
	  // Either fulfill, reject or reject with error
	  var called = false;
	  function onError(value) {
	    if (called) {
	      return;
	    }
	    called = true;
	    handlers.reject(self, value);
	  }
	
	  function onSuccess(value) {
	    if (called) {
	      return;
	    }
	    called = true;
	    handlers.resolve(self, value);
	  }
	
	  function tryToUnwrap() {
	    thenable(onSuccess, onError);
	  }
	
	  var result = tryCatch(tryToUnwrap);
	  if (result.status === 'error') {
	    onError(result.value);
	  }
	}
	
	function tryCatch(func, value) {
	  var out = {};
	  try {
	    out.value = func(value);
	    out.status = 'success';
	  } catch (e) {
	    out.status = 'error';
	    out.value = e;
	  }
	  return out;
	}
	
	exports.resolve = resolve;
	function resolve(value) {
	  if (value instanceof this) {
	    return value;
	  }
	  return handlers.resolve(new this(INTERNAL), value);
	}
	
	exports.reject = reject;
	function reject(reason) {
	  var promise = new this(INTERNAL);
	  return handlers.reject(promise, reason);
	}
	
	exports.all = all;
	function all(iterable) {
	  var self = this;
	  if (Object.prototype.toString.call(iterable) !== '[object Array]') {
	    return this.reject(new TypeError('must be an array'));
	  }
	
	  var len = iterable.length;
	  var called = false;
	  if (!len) {
	    return this.resolve([]);
	  }
	
	  var values = new Array(len);
	  var resolved = 0;
	  var i = -1;
	  var promise = new this(INTERNAL);
	
	  while (++i < len) {
	    allResolver(iterable[i], i);
	  }
	  return promise;
	  function allResolver(value, i) {
	    self.resolve(value).then(resolveFromAll, function (error) {
	      if (!called) {
	        called = true;
	        handlers.reject(promise, error);
	      }
	    });
	    function resolveFromAll(outValue) {
	      values[i] = outValue;
	      if (++resolved === len && !called) {
	        called = true;
	        handlers.resolve(promise, values);
	      }
	    }
	  }
	}
	
	exports.race = race;
	function race(iterable) {
	  var self = this;
	  if (Object.prototype.toString.call(iterable) !== '[object Array]') {
	    return this.reject(new TypeError('must be an array'));
	  }
	
	  var len = iterable.length;
	  var called = false;
	  if (!len) {
	    return this.resolve([]);
	  }
	
	  var i = -1;
	  var promise = new this(INTERNAL);
	
	  while (++i < len) {
	    resolver(iterable[i]);
	  }
	  return promise;
	  function resolver(value) {
	    self.resolve(value).then(function (response) {
	      if (!called) {
	        called = true;
	        handlers.resolve(promise, response);
	      }
	    }, function (error) {
	      if (!called) {
	        called = true;
	        handlers.reject(promise, error);
	      }
	    });
	  }
	}
	
	},{"2":2}],2:[function(_dereq_,module,exports){
	(function (global){
	'use strict';
	var Mutation = global.MutationObserver || global.WebKitMutationObserver;
	
	var scheduleDrain;
	
	{
	  if (Mutation) {
	    var called = 0;
	    var observer = new Mutation(nextTick);
	    var element = global.document.createTextNode('');
	    observer.observe(element, {
	      characterData: true
	    });
	    scheduleDrain = function () {
	      element.data = (called = ++called % 2);
	    };
	  } else if (!global.setImmediate && typeof global.MessageChannel !== 'undefined') {
	    var channel = new global.MessageChannel();
	    channel.port1.onmessage = nextTick;
	    scheduleDrain = function () {
	      channel.port2.postMessage(0);
	    };
	  } else if ('document' in global && 'onreadystatechange' in global.document.createElement('script')) {
	    scheduleDrain = function () {
	
	      // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
	      // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
	      var scriptEl = global.document.createElement('script');
	      scriptEl.onreadystatechange = function () {
	        nextTick();
	
	        scriptEl.onreadystatechange = null;
	        scriptEl.parentNode.removeChild(scriptEl);
	        scriptEl = null;
	      };
	      global.document.documentElement.appendChild(scriptEl);
	    };
	  } else {
	    scheduleDrain = function () {
	      setTimeout(nextTick, 0);
	    };
	  }
	}
	
	var draining;
	var queue = [];
	//named nextTick for less confusing stack traces
	function nextTick() {
	  draining = true;
	  var i, oldQueue;
	  var len = queue.length;
	  while (len) {
	    oldQueue = queue;
	    queue = [];
	    i = -1;
	    while (++i < len) {
	      oldQueue[i]();
	    }
	    len = queue.length;
	  }
	  draining = false;
	}
	
	module.exports = immediate;
	function immediate(task) {
	  if (queue.push(task) === 1 && !draining) {
	    scheduleDrain();
	  }
	}
	
	}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
	},{}],3:[function(_dereq_,module,exports){
	(function (global){
	'use strict';
	if (typeof global.Promise !== 'function') {
	  global.Promise = _dereq_(1);
	}
	
	}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
	},{"1":1}],4:[function(_dereq_,module,exports){
	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function getIDB() {
	    /* global indexedDB,webkitIndexedDB,mozIndexedDB,OIndexedDB,msIndexedDB */
	    if (typeof indexedDB !== 'undefined') {
	        return indexedDB;
	    }
	    if (typeof webkitIndexedDB !== 'undefined') {
	        return webkitIndexedDB;
	    }
	    if (typeof mozIndexedDB !== 'undefined') {
	        return mozIndexedDB;
	    }
	    if (typeof OIndexedDB !== 'undefined') {
	        return OIndexedDB;
	    }
	    if (typeof msIndexedDB !== 'undefined') {
	        return msIndexedDB;
	    }
	}
	
	var idb = getIDB();
	
	function isIndexedDBValid() {
	    try {
	        // Initialize IndexedDB; fall back to vendor-prefixed versions
	        // if needed.
	        if (!idb) {
	            return false;
	        }
	        // We mimic PouchDB here; just UA test for Safari (which, as of
	        // iOS 8/Yosemite, doesn't properly support IndexedDB).
	        // IndexedDB support is broken and different from Blink's.
	        // This is faster than the test case (and it's sync), so we just
	        // do this. *SIGH*
	        // http://bl.ocks.org/nolanlawson/raw/c83e9039edf2278047e9/
	        //
	        // We test for openDatabase because IE Mobile identifies itself
	        // as Safari. Oh the lulz...
	        if (typeof openDatabase !== 'undefined' && typeof navigator !== 'undefined' && navigator.userAgent && /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)) {
	            return false;
	        }
	
	        return idb && typeof idb.open === 'function' &&
	        // Some Samsung/HTC Android 4.0-4.3 devices
	        // have older IndexedDB specs; if this isn't available
	        // their IndexedDB is too old for us to use.
	        // (Replaces the onupgradeneeded test.)
	        typeof IDBKeyRange !== 'undefined';
	    } catch (e) {
	        return false;
	    }
	}
	
	function isWebSQLValid() {
	    return typeof openDatabase === 'function';
	}
	
	function isLocalStorageValid() {
	    try {
	        return typeof localStorage !== 'undefined' && 'setItem' in localStorage && localStorage.setItem;
	    } catch (e) {
	        return false;
	    }
	}
	
	// Abstracts constructing a Blob object, so it also works in older
	// browsers that don't support the native Blob constructor. (i.e.
	// old QtWebKit versions, at least).
	// Abstracts constructing a Blob object, so it also works in older
	// browsers that don't support the native Blob constructor. (i.e.
	// old QtWebKit versions, at least).
	function createBlob(parts, properties) {
	    /* global BlobBuilder,MSBlobBuilder,MozBlobBuilder,WebKitBlobBuilder */
	    parts = parts || [];
	    properties = properties || {};
	    try {
	        return new Blob(parts, properties);
	    } catch (e) {
	        if (e.name !== 'TypeError') {
	            throw e;
	        }
	        var Builder = typeof BlobBuilder !== 'undefined' ? BlobBuilder : typeof MSBlobBuilder !== 'undefined' ? MSBlobBuilder : typeof MozBlobBuilder !== 'undefined' ? MozBlobBuilder : WebKitBlobBuilder;
	        var builder = new Builder();
	        for (var i = 0; i < parts.length; i += 1) {
	            builder.append(parts[i]);
	        }
	        return builder.getBlob(properties.type);
	    }
	}
	
	// This is CommonJS because lie is an external dependency, so Rollup
	// can just ignore it.
	if (typeof Promise === 'undefined' && typeof _dereq_ !== 'undefined') {
	    _dereq_(3);
	}
	var Promise$1 = Promise;
	
	function executeCallback(promise, callback) {
	    if (callback) {
	        promise.then(function (result) {
	            callback(null, result);
	        }, function (error) {
	            callback(error);
	        });
	    }
	}
	
	// Some code originally from async_storage.js in
	// [Gaia](https://github.com/mozilla-b2g/gaia).
	
	var DETECT_BLOB_SUPPORT_STORE = 'local-forage-detect-blob-support';
	var supportsBlobs;
	var dbContexts;
	
	// Transform a binary string to an array buffer, because otherwise
	// weird stuff happens when you try to work with the binary string directly.
	// It is known.
	// From http://stackoverflow.com/questions/14967647/ (continues on next line)
	// encode-decode-image-with-base64-breaks-image (2013-04-21)
	function _binStringToArrayBuffer(bin) {
	    var length = bin.length;
	    var buf = new ArrayBuffer(length);
	    var arr = new Uint8Array(buf);
	    for (var i = 0; i < length; i++) {
	        arr[i] = bin.charCodeAt(i);
	    }
	    return buf;
	}
	
	//
	// Blobs are not supported in all versions of IndexedDB, notably
	// Chrome <37 and Android <5. In those versions, storing a blob will throw.
	//
	// Various other blob bugs exist in Chrome v37-42 (inclusive).
	// Detecting them is expensive and confusing to users, and Chrome 37-42
	// is at very low usage worldwide, so we do a hacky userAgent check instead.
	//
	// content-type bug: https://code.google.com/p/chromium/issues/detail?id=408120
	// 404 bug: https://code.google.com/p/chromium/issues/detail?id=447916
	// FileReader bug: https://code.google.com/p/chromium/issues/detail?id=447836
	//
	// Code borrowed from PouchDB. See:
	// https://github.com/pouchdb/pouchdb/blob/9c25a23/src/adapters/idb/blobSupport.js
	//
	function _checkBlobSupportWithoutCaching(txn) {
	    return new Promise$1(function (resolve) {
	        var blob = createBlob(['']);
	        txn.objectStore(DETECT_BLOB_SUPPORT_STORE).put(blob, 'key');
	
	        txn.onabort = function (e) {
	            // If the transaction aborts now its due to not being able to
	            // write to the database, likely due to the disk being full
	            e.preventDefault();
	            e.stopPropagation();
	            resolve(false);
	        };
	
	        txn.oncomplete = function () {
	            var matchedChrome = navigator.userAgent.match(/Chrome\/(\d+)/);
	            var matchedEdge = navigator.userAgent.match(/Edge\//);
	            // MS Edge pretends to be Chrome 42:
	            // https://msdn.microsoft.com/en-us/library/hh869301%28v=vs.85%29.aspx
	            resolve(matchedEdge || !matchedChrome || parseInt(matchedChrome[1], 10) >= 43);
	        };
	    })["catch"](function () {
	        return false; // error, so assume unsupported
	    });
	}
	
	function _checkBlobSupport(idb) {
	    if (typeof supportsBlobs === 'boolean') {
	        return Promise$1.resolve(supportsBlobs);
	    }
	    return _checkBlobSupportWithoutCaching(idb).then(function (value) {
	        supportsBlobs = value;
	        return supportsBlobs;
	    });
	}
	
	function _deferReadiness(dbInfo) {
	    var dbContext = dbContexts[dbInfo.name];
	
	    // Create a deferred object representing the current database operation.
	    var deferredOperation = {};
	
	    deferredOperation.promise = new Promise$1(function (resolve) {
	        deferredOperation.resolve = resolve;
	    });
	
	    // Enqueue the deferred operation.
	    dbContext.deferredOperations.push(deferredOperation);
	
	    // Chain its promise to the database readiness.
	    if (!dbContext.dbReady) {
	        dbContext.dbReady = deferredOperation.promise;
	    } else {
	        dbContext.dbReady = dbContext.dbReady.then(function () {
	            return deferredOperation.promise;
	        });
	    }
	}
	
	function _advanceReadiness(dbInfo) {
	    var dbContext = dbContexts[dbInfo.name];
	
	    // Dequeue a deferred operation.
	    var deferredOperation = dbContext.deferredOperations.pop();
	
	    // Resolve its promise (which is part of the database readiness
	    // chain of promises).
	    if (deferredOperation) {
	        deferredOperation.resolve();
	    }
	}
	
	function _getConnection(dbInfo, upgradeNeeded) {
	    return new Promise$1(function (resolve, reject) {
	
	        if (dbInfo.db) {
	            if (upgradeNeeded) {
	                _deferReadiness(dbInfo);
	                dbInfo.db.close();
	            } else {
	                return resolve(dbInfo.db);
	            }
	        }
	
	        var dbArgs = [dbInfo.name];
	
	        if (upgradeNeeded) {
	            dbArgs.push(dbInfo.version);
	        }
	
	        var openreq = idb.open.apply(idb, dbArgs);
	
	        if (upgradeNeeded) {
	            openreq.onupgradeneeded = function (e) {
	                var db = openreq.result;
	                try {
	                    db.createObjectStore(dbInfo.storeName);
	                    if (e.oldVersion <= 1) {
	                        // Added when support for blob shims was added
	                        db.createObjectStore(DETECT_BLOB_SUPPORT_STORE);
	                    }
	                } catch (ex) {
	                    if (ex.name === 'ConstraintError') {
	                        console.warn('The database "' + dbInfo.name + '"' + ' has been upgraded from version ' + e.oldVersion + ' to version ' + e.newVersion + ', but the storage "' + dbInfo.storeName + '" already exists.');
	                    } else {
	                        throw ex;
	                    }
	                }
	            };
	        }
	
	        openreq.onerror = function () {
	            reject(openreq.error);
	        };
	
	        openreq.onsuccess = function () {
	            resolve(openreq.result);
	            _advanceReadiness(dbInfo);
	        };
	    });
	}
	
	function _getOriginalConnection(dbInfo) {
	    return _getConnection(dbInfo, false);
	}
	
	function _getUpgradedConnection(dbInfo) {
	    return _getConnection(dbInfo, true);
	}
	
	function _isUpgradeNeeded(dbInfo, defaultVersion) {
	    if (!dbInfo.db) {
	        return true;
	    }
	
	    var isNewStore = !dbInfo.db.objectStoreNames.contains(dbInfo.storeName);
	    var isDowngrade = dbInfo.version < dbInfo.db.version;
	    var isUpgrade = dbInfo.version > dbInfo.db.version;
	
	    if (isDowngrade) {
	        // If the version is not the default one
	        // then warn for impossible downgrade.
	        if (dbInfo.version !== defaultVersion) {
	            console.warn('The database "' + dbInfo.name + '"' + ' can\'t be downgraded from version ' + dbInfo.db.version + ' to version ' + dbInfo.version + '.');
	        }
	        // Align the versions to prevent errors.
	        dbInfo.version = dbInfo.db.version;
	    }
	
	    if (isUpgrade || isNewStore) {
	        // If the store is new then increment the version (if needed).
	        // This will trigger an "upgradeneeded" event which is required
	        // for creating a store.
	        if (isNewStore) {
	            var incVersion = dbInfo.db.version + 1;
	            if (incVersion > dbInfo.version) {
	                dbInfo.version = incVersion;
	            }
	        }
	
	        return true;
	    }
	
	    return false;
	}
	
	// encode a blob for indexeddb engines that don't support blobs
	function _encodeBlob(blob) {
	    return new Promise$1(function (resolve, reject) {
	        var reader = new FileReader();
	        reader.onerror = reject;
	        reader.onloadend = function (e) {
	            var base64 = btoa(e.target.result || '');
	            resolve({
	                __local_forage_encoded_blob: true,
	                data: base64,
	                type: blob.type
	            });
	        };
	        reader.readAsBinaryString(blob);
	    });
	}
	
	// decode an encoded blob
	function _decodeBlob(encodedBlob) {
	    var arrayBuff = _binStringToArrayBuffer(atob(encodedBlob.data));
	    return createBlob([arrayBuff], { type: encodedBlob.type });
	}
	
	// is this one of our fancy encoded blobs?
	function _isEncodedBlob(value) {
	    return value && value.__local_forage_encoded_blob;
	}
	
	// Specialize the default `ready()` function by making it dependent
	// on the current database operations. Thus, the driver will be actually
	// ready when it's been initialized (default) *and* there are no pending
	// operations on the database (initiated by some other instances).
	function _fullyReady(callback) {
	    var self = this;
	
	    var promise = self._initReady().then(function () {
	        var dbContext = dbContexts[self._dbInfo.name];
	
	        if (dbContext && dbContext.dbReady) {
	            return dbContext.dbReady;
	        }
	    });
	
	    promise.then(callback, callback);
	    return promise;
	}
	
	// Open the IndexedDB database (automatically creates one if one didn't
	// previously exist), using any options set in the config.
	function _initStorage(options) {
	    var self = this;
	    var dbInfo = {
	        db: null
	    };
	
	    if (options) {
	        for (var i in options) {
	            dbInfo[i] = options[i];
	        }
	    }
	
	    // Initialize a singleton container for all running localForages.
	    if (!dbContexts) {
	        dbContexts = {};
	    }
	
	    // Get the current context of the database;
	    var dbContext = dbContexts[dbInfo.name];
	
	    // ...or create a new context.
	    if (!dbContext) {
	        dbContext = {
	            // Running localForages sharing a database.
	            forages: [],
	            // Shared database.
	            db: null,
	            // Database readiness (promise).
	            dbReady: null,
	            // Deferred operations on the database.
	            deferredOperations: []
	        };
	        // Register the new context in the global container.
	        dbContexts[dbInfo.name] = dbContext;
	    }
	
	    // Register itself as a running localForage in the current context.
	    dbContext.forages.push(self);
	
	    // Replace the default `ready()` function with the specialized one.
	    if (!self._initReady) {
	        self._initReady = self.ready;
	        self.ready = _fullyReady;
	    }
	
	    // Create an array of initialization states of the related localForages.
	    var initPromises = [];
	
	    function ignoreErrors() {
	        // Don't handle errors here,
	        // just makes sure related localForages aren't pending.
	        return Promise$1.resolve();
	    }
	
	    for (var j = 0; j < dbContext.forages.length; j++) {
	        var forage = dbContext.forages[j];
	        if (forage !== self) {
	            // Don't wait for itself...
	            initPromises.push(forage._initReady()["catch"](ignoreErrors));
	        }
	    }
	
	    // Take a snapshot of the related localForages.
	    var forages = dbContext.forages.slice(0);
	
	    // Initialize the connection process only when
	    // all the related localForages aren't pending.
	    return Promise$1.all(initPromises).then(function () {
	        dbInfo.db = dbContext.db;
	        // Get the connection or open a new one without upgrade.
	        return _getOriginalConnection(dbInfo);
	    }).then(function (db) {
	        dbInfo.db = db;
	        if (_isUpgradeNeeded(dbInfo, self._defaultConfig.version)) {
	            // Reopen the database for upgrading.
	            return _getUpgradedConnection(dbInfo);
	        }
	        return db;
	    }).then(function (db) {
	        dbInfo.db = dbContext.db = db;
	        self._dbInfo = dbInfo;
	        // Share the final connection amongst related localForages.
	        for (var k = 0; k < forages.length; k++) {
	            var forage = forages[k];
	            if (forage !== self) {
	                // Self is already up-to-date.
	                forage._dbInfo.db = dbInfo.db;
	                forage._dbInfo.version = dbInfo.version;
	            }
	        }
	    });
	}
	
	function getItem(key, callback) {
	    var self = this;
	
	    // Cast the key to a string, as that's all we can set as a key.
	    if (typeof key !== 'string') {
	        console.warn(key + ' used as a key, but it is not a string.');
	        key = String(key);
	    }
	
	    var promise = new Promise$1(function (resolve, reject) {
	        self.ready().then(function () {
	            var dbInfo = self._dbInfo;
	            var store = dbInfo.db.transaction(dbInfo.storeName, 'readonly').objectStore(dbInfo.storeName);
	            var req = store.get(key);
	
	            req.onsuccess = function () {
	                var value = req.result;
	                if (value === undefined) {
	                    value = null;
	                }
	                if (_isEncodedBlob(value)) {
	                    value = _decodeBlob(value);
	                }
	                resolve(value);
	            };
	
	            req.onerror = function () {
	                reject(req.error);
	            };
	        })["catch"](reject);
	    });
	
	    executeCallback(promise, callback);
	    return promise;
	}
	
	// Iterate over all items stored in database.
	function iterate(iterator, callback) {
	    var self = this;
	
	    var promise = new Promise$1(function (resolve, reject) {
	        self.ready().then(function () {
	            var dbInfo = self._dbInfo;
	            var store = dbInfo.db.transaction(dbInfo.storeName, 'readonly').objectStore(dbInfo.storeName);
	
	            var req = store.openCursor();
	            var iterationNumber = 1;
	
	            req.onsuccess = function () {
	                var cursor = req.result;
	
	                if (cursor) {
	                    var value = cursor.value;
	                    if (_isEncodedBlob(value)) {
	                        value = _decodeBlob(value);
	                    }
	                    var result = iterator(value, cursor.key, iterationNumber++);
	
	                    if (result !== void 0) {
	                        resolve(result);
	                    } else {
	                        cursor["continue"]();
	                    }
	                } else {
	                    resolve();
	                }
	            };
	
	            req.onerror = function () {
	                reject(req.error);
	            };
	        })["catch"](reject);
	    });
	
	    executeCallback(promise, callback);
	
	    return promise;
	}
	
	function setItem(key, value, callback) {
	    var self = this;
	
	    // Cast the key to a string, as that's all we can set as a key.
	    if (typeof key !== 'string') {
	        console.warn(key + ' used as a key, but it is not a string.');
	        key = String(key);
	    }
	
	    var promise = new Promise$1(function (resolve, reject) {
	        var dbInfo;
	        self.ready().then(function () {
	            dbInfo = self._dbInfo;
	            if (value instanceof Blob) {
	                return _checkBlobSupport(dbInfo.db).then(function (blobSupport) {
	                    if (blobSupport) {
	                        return value;
	                    }
	                    return _encodeBlob(value);
	                });
	            }
	            return value;
	        }).then(function (value) {
	            var transaction = dbInfo.db.transaction(dbInfo.storeName, 'readwrite');
	            var store = transaction.objectStore(dbInfo.storeName);
	
	            // The reason we don't _save_ null is because IE 10 does
	            // not support saving the `null` type in IndexedDB. How
	            // ironic, given the bug below!
	            // See: https://github.com/mozilla/localForage/issues/161
	            if (value === null) {
	                value = undefined;
	            }
	
	            transaction.oncomplete = function () {
	                // Cast to undefined so the value passed to
	                // callback/promise is the same as what one would get out
	                // of `getItem()` later. This leads to some weirdness
	                // (setItem('foo', undefined) will return `null`), but
	                // it's not my fault localStorage is our baseline and that
	                // it's weird.
	                if (value === undefined) {
	                    value = null;
	                }
	
	                resolve(value);
	            };
	            transaction.onabort = transaction.onerror = function () {
	                var err = req.error ? req.error : req.transaction.error;
	                reject(err);
	            };
	
	            var req = store.put(value, key);
	        })["catch"](reject);
	    });
	
	    executeCallback(promise, callback);
	    return promise;
	}
	
	function removeItem(key, callback) {
	    var self = this;
	
	    // Cast the key to a string, as that's all we can set as a key.
	    if (typeof key !== 'string') {
	        console.warn(key + ' used as a key, but it is not a string.');
	        key = String(key);
	    }
	
	    var promise = new Promise$1(function (resolve, reject) {
	        self.ready().then(function () {
	            var dbInfo = self._dbInfo;
	            var transaction = dbInfo.db.transaction(dbInfo.storeName, 'readwrite');
	            var store = transaction.objectStore(dbInfo.storeName);
	
	            // We use a Grunt task to make this safe for IE and some
	            // versions of Android (including those used by Cordova).
	            // Normally IE won't like `.delete()` and will insist on
	            // using `['delete']()`, but we have a build step that
	            // fixes this for us now.
	            var req = store["delete"](key);
	            transaction.oncomplete = function () {
	                resolve();
	            };
	
	            transaction.onerror = function () {
	                reject(req.error);
	            };
	
	            // The request will be also be aborted if we've exceeded our storage
	            // space.
	            transaction.onabort = function () {
	                var err = req.error ? req.error : req.transaction.error;
	                reject(err);
	            };
	        })["catch"](reject);
	    });
	
	    executeCallback(promise, callback);
	    return promise;
	}
	
	function clear(callback) {
	    var self = this;
	
	    var promise = new Promise$1(function (resolve, reject) {
	        self.ready().then(function () {
	            var dbInfo = self._dbInfo;
	            var transaction = dbInfo.db.transaction(dbInfo.storeName, 'readwrite');
	            var store = transaction.objectStore(dbInfo.storeName);
	            var req = store.clear();
	
	            transaction.oncomplete = function () {
	                resolve();
	            };
	
	            transaction.onabort = transaction.onerror = function () {
	                var err = req.error ? req.error : req.transaction.error;
	                reject(err);
	            };
	        })["catch"](reject);
	    });
	
	    executeCallback(promise, callback);
	    return promise;
	}
	
	function length(callback) {
	    var self = this;
	
	    var promise = new Promise$1(function (resolve, reject) {
	        self.ready().then(function () {
	            var dbInfo = self._dbInfo;
	            var store = dbInfo.db.transaction(dbInfo.storeName, 'readonly').objectStore(dbInfo.storeName);
	            var req = store.count();
	
	            req.onsuccess = function () {
	                resolve(req.result);
	            };
	
	            req.onerror = function () {
	                reject(req.error);
	            };
	        })["catch"](reject);
	    });
	
	    executeCallback(promise, callback);
	    return promise;
	}
	
	function key(n, callback) {
	    var self = this;
	
	    var promise = new Promise$1(function (resolve, reject) {
	        if (n < 0) {
	            resolve(null);
	
	            return;
	        }
	
	        self.ready().then(function () {
	            var dbInfo = self._dbInfo;
	            var store = dbInfo.db.transaction(dbInfo.storeName, 'readonly').objectStore(dbInfo.storeName);
	
	            var advanced = false;
	            var req = store.openCursor();
	            req.onsuccess = function () {
	                var cursor = req.result;
	                if (!cursor) {
	                    // this means there weren't enough keys
	                    resolve(null);
	
	                    return;
	                }
	
	                if (n === 0) {
	                    // We have the first key, return it if that's what they
	                    // wanted.
	                    resolve(cursor.key);
	                } else {
	                    if (!advanced) {
	                        // Otherwise, ask the cursor to skip ahead n
	                        // records.
	                        advanced = true;
	                        cursor.advance(n);
	                    } else {
	                        // When we get here, we've got the nth key.
	                        resolve(cursor.key);
	                    }
	                }
	            };
	
	            req.onerror = function () {
	                reject(req.error);
	            };
	        })["catch"](reject);
	    });
	
	    executeCallback(promise, callback);
	    return promise;
	}
	
	function keys(callback) {
	    var self = this;
	
	    var promise = new Promise$1(function (resolve, reject) {
	        self.ready().then(function () {
	            var dbInfo = self._dbInfo;
	            var store = dbInfo.db.transaction(dbInfo.storeName, 'readonly').objectStore(dbInfo.storeName);
	
	            var req = store.openCursor();
	            var keys = [];
	
	            req.onsuccess = function () {
	                var cursor = req.result;
	
	                if (!cursor) {
	                    resolve(keys);
	                    return;
	                }
	
	                keys.push(cursor.key);
	                cursor["continue"]();
	            };
	
	            req.onerror = function () {
	                reject(req.error);
	            };
	        })["catch"](reject);
	    });
	
	    executeCallback(promise, callback);
	    return promise;
	}
	
	var asyncStorage = {
	    _driver: 'asyncStorage',
	    _initStorage: _initStorage,
	    iterate: iterate,
	    getItem: getItem,
	    setItem: setItem,
	    removeItem: removeItem,
	    clear: clear,
	    length: length,
	    key: key,
	    keys: keys
	};
	
	// Sadly, the best way to save binary data in WebSQL/localStorage is serializing
	// it to Base64, so this is how we store it to prevent very strange errors with less
	// verbose ways of binary <-> string data storage.
	var BASE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
	
	var BLOB_TYPE_PREFIX = '~~local_forage_type~';
	var BLOB_TYPE_PREFIX_REGEX = /^~~local_forage_type~([^~]+)~/;
	
	var SERIALIZED_MARKER = '__lfsc__:';
	var SERIALIZED_MARKER_LENGTH = SERIALIZED_MARKER.length;
	
	// OMG the serializations!
	var TYPE_ARRAYBUFFER = 'arbf';
	var TYPE_BLOB = 'blob';
	var TYPE_INT8ARRAY = 'si08';
	var TYPE_UINT8ARRAY = 'ui08';
	var TYPE_UINT8CLAMPEDARRAY = 'uic8';
	var TYPE_INT16ARRAY = 'si16';
	var TYPE_INT32ARRAY = 'si32';
	var TYPE_UINT16ARRAY = 'ur16';
	var TYPE_UINT32ARRAY = 'ui32';
	var TYPE_FLOAT32ARRAY = 'fl32';
	var TYPE_FLOAT64ARRAY = 'fl64';
	var TYPE_SERIALIZED_MARKER_LENGTH = SERIALIZED_MARKER_LENGTH + TYPE_ARRAYBUFFER.length;
	
	function stringToBuffer(serializedString) {
	    // Fill the string into a ArrayBuffer.
	    var bufferLength = serializedString.length * 0.75;
	    var len = serializedString.length;
	    var i;
	    var p = 0;
	    var encoded1, encoded2, encoded3, encoded4;
	
	    if (serializedString[serializedString.length - 1] === '=') {
	        bufferLength--;
	        if (serializedString[serializedString.length - 2] === '=') {
	            bufferLength--;
	        }
	    }
	
	    var buffer = new ArrayBuffer(bufferLength);
	    var bytes = new Uint8Array(buffer);
	
	    for (i = 0; i < len; i += 4) {
	        encoded1 = BASE_CHARS.indexOf(serializedString[i]);
	        encoded2 = BASE_CHARS.indexOf(serializedString[i + 1]);
	        encoded3 = BASE_CHARS.indexOf(serializedString[i + 2]);
	        encoded4 = BASE_CHARS.indexOf(serializedString[i + 3]);
	
	        /*jslint bitwise: true */
	        bytes[p++] = encoded1 << 2 | encoded2 >> 4;
	        bytes[p++] = (encoded2 & 15) << 4 | encoded3 >> 2;
	        bytes[p++] = (encoded3 & 3) << 6 | encoded4 & 63;
	    }
	    return buffer;
	}
	
	// Converts a buffer to a string to store, serialized, in the backend
	// storage library.
	function bufferToString(buffer) {
	    // base64-arraybuffer
	    var bytes = new Uint8Array(buffer);
	    var base64String = '';
	    var i;
	
	    for (i = 0; i < bytes.length; i += 3) {
	        /*jslint bitwise: true */
	        base64String += BASE_CHARS[bytes[i] >> 2];
	        base64String += BASE_CHARS[(bytes[i] & 3) << 4 | bytes[i + 1] >> 4];
	        base64String += BASE_CHARS[(bytes[i + 1] & 15) << 2 | bytes[i + 2] >> 6];
	        base64String += BASE_CHARS[bytes[i + 2] & 63];
	    }
	
	    if (bytes.length % 3 === 2) {
	        base64String = base64String.substring(0, base64String.length - 1) + '=';
	    } else if (bytes.length % 3 === 1) {
	        base64String = base64String.substring(0, base64String.length - 2) + '==';
	    }
	
	    return base64String;
	}
	
	// Serialize a value, afterwards executing a callback (which usually
	// instructs the `setItem()` callback/promise to be executed). This is how
	// we store binary data with localStorage.
	function serialize(value, callback) {
	    var valueString = '';
	    if (value) {
	        valueString = value.toString();
	    }
	
	    // Cannot use `value instanceof ArrayBuffer` or such here, as these
	    // checks fail when running the tests using casper.js...
	    //
	    // TODO: See why those tests fail and use a better solution.
	    if (value && (value.toString() === '[object ArrayBuffer]' || value.buffer && value.buffer.toString() === '[object ArrayBuffer]')) {
	        // Convert binary arrays to a string and prefix the string with
	        // a special marker.
	        var buffer;
	        var marker = SERIALIZED_MARKER;
	
	        if (value instanceof ArrayBuffer) {
	            buffer = value;
	            marker += TYPE_ARRAYBUFFER;
	        } else {
	            buffer = value.buffer;
	
	            if (valueString === '[object Int8Array]') {
	                marker += TYPE_INT8ARRAY;
	            } else if (valueString === '[object Uint8Array]') {
	                marker += TYPE_UINT8ARRAY;
	            } else if (valueString === '[object Uint8ClampedArray]') {
	                marker += TYPE_UINT8CLAMPEDARRAY;
	            } else if (valueString === '[object Int16Array]') {
	                marker += TYPE_INT16ARRAY;
	            } else if (valueString === '[object Uint16Array]') {
	                marker += TYPE_UINT16ARRAY;
	            } else if (valueString === '[object Int32Array]') {
	                marker += TYPE_INT32ARRAY;
	            } else if (valueString === '[object Uint32Array]') {
	                marker += TYPE_UINT32ARRAY;
	            } else if (valueString === '[object Float32Array]') {
	                marker += TYPE_FLOAT32ARRAY;
	            } else if (valueString === '[object Float64Array]') {
	                marker += TYPE_FLOAT64ARRAY;
	            } else {
	                callback(new Error('Failed to get type for BinaryArray'));
	            }
	        }
	
	        callback(marker + bufferToString(buffer));
	    } else if (valueString === '[object Blob]') {
	        // Conver the blob to a binaryArray and then to a string.
	        var fileReader = new FileReader();
	
	        fileReader.onload = function () {
	            // Backwards-compatible prefix for the blob type.
	            var str = BLOB_TYPE_PREFIX + value.type + '~' + bufferToString(this.result);
	
	            callback(SERIALIZED_MARKER + TYPE_BLOB + str);
	        };
	
	        fileReader.readAsArrayBuffer(value);
	    } else {
	        try {
	            callback(JSON.stringify(value));
	        } catch (e) {
	            console.error("Couldn't convert value into a JSON string: ", value);
	
	            callback(null, e);
	        }
	    }
	}
	
	// Deserialize data we've inserted into a value column/field. We place
	// special markers into our strings to mark them as encoded; this isn't
	// as nice as a meta field, but it's the only sane thing we can do whilst
	// keeping localStorage support intact.
	//
	// Oftentimes this will just deserialize JSON content, but if we have a
	// special marker (SERIALIZED_MARKER, defined above), we will extract
	// some kind of arraybuffer/binary data/typed array out of the string.
	function deserialize(value) {
	    // If we haven't marked this string as being specially serialized (i.e.
	    // something other than serialized JSON), we can just return it and be
	    // done with it.
	    if (value.substring(0, SERIALIZED_MARKER_LENGTH) !== SERIALIZED_MARKER) {
	        return JSON.parse(value);
	    }
	
	    // The following code deals with deserializing some kind of Blob or
	    // TypedArray. First we separate out the type of data we're dealing
	    // with from the data itself.
	    var serializedString = value.substring(TYPE_SERIALIZED_MARKER_LENGTH);
	    var type = value.substring(SERIALIZED_MARKER_LENGTH, TYPE_SERIALIZED_MARKER_LENGTH);
	
	    var blobType;
	    // Backwards-compatible blob type serialization strategy.
	    // DBs created with older versions of localForage will simply not have the blob type.
	    if (type === TYPE_BLOB && BLOB_TYPE_PREFIX_REGEX.test(serializedString)) {
	        var matcher = serializedString.match(BLOB_TYPE_PREFIX_REGEX);
	        blobType = matcher[1];
	        serializedString = serializedString.substring(matcher[0].length);
	    }
	    var buffer = stringToBuffer(serializedString);
	
	    // Return the right type based on the code/type set during
	    // serialization.
	    switch (type) {
	        case TYPE_ARRAYBUFFER:
	            return buffer;
	        case TYPE_BLOB:
	            return createBlob([buffer], { type: blobType });
	        case TYPE_INT8ARRAY:
	            return new Int8Array(buffer);
	        case TYPE_UINT8ARRAY:
	            return new Uint8Array(buffer);
	        case TYPE_UINT8CLAMPEDARRAY:
	            return new Uint8ClampedArray(buffer);
	        case TYPE_INT16ARRAY:
	            return new Int16Array(buffer);
	        case TYPE_UINT16ARRAY:
	            return new Uint16Array(buffer);
	        case TYPE_INT32ARRAY:
	            return new Int32Array(buffer);
	        case TYPE_UINT32ARRAY:
	            return new Uint32Array(buffer);
	        case TYPE_FLOAT32ARRAY:
	            return new Float32Array(buffer);
	        case TYPE_FLOAT64ARRAY:
	            return new Float64Array(buffer);
	        default:
	            throw new Error('Unkown type: ' + type);
	    }
	}
	
	var localforageSerializer = {
	    serialize: serialize,
	    deserialize: deserialize,
	    stringToBuffer: stringToBuffer,
	    bufferToString: bufferToString
	};
	
	/*
	 * Includes code from:
	 *
	 * base64-arraybuffer
	 * https://github.com/niklasvh/base64-arraybuffer
	 *
	 * Copyright (c) 2012 Niklas von Hertzen
	 * Licensed under the MIT license.
	 */
	// Open the WebSQL database (automatically creates one if one didn't
	// previously exist), using any options set in the config.
	function _initStorage$1(options) {
	    var self = this;
	    var dbInfo = {
	        db: null
	    };
	
	    if (options) {
	        for (var i in options) {
	            dbInfo[i] = typeof options[i] !== 'string' ? options[i].toString() : options[i];
	        }
	    }
	
	    var dbInfoPromise = new Promise$1(function (resolve, reject) {
	        // Open the database; the openDatabase API will automatically
	        // create it for us if it doesn't exist.
	        try {
	            dbInfo.db = openDatabase(dbInfo.name, String(dbInfo.version), dbInfo.description, dbInfo.size);
	        } catch (e) {
	            return reject(e);
	        }
	
	        // Create our key/value table if it doesn't exist.
	        dbInfo.db.transaction(function (t) {
	            t.executeSql('CREATE TABLE IF NOT EXISTS ' + dbInfo.storeName + ' (id INTEGER PRIMARY KEY, key unique, value)', [], function () {
	                self._dbInfo = dbInfo;
	                resolve();
	            }, function (t, error) {
	                reject(error);
	            });
	        });
	    });
	
	    dbInfo.serializer = localforageSerializer;
	    return dbInfoPromise;
	}
	
	function getItem$1(key, callback) {
	    var self = this;
	
	    // Cast the key to a string, as that's all we can set as a key.
	    if (typeof key !== 'string') {
	        console.warn(key + ' used as a key, but it is not a string.');
	        key = String(key);
	    }
	
	    var promise = new Promise$1(function (resolve, reject) {
	        self.ready().then(function () {
	            var dbInfo = self._dbInfo;
	            dbInfo.db.transaction(function (t) {
	                t.executeSql('SELECT * FROM ' + dbInfo.storeName + ' WHERE key = ? LIMIT 1', [key], function (t, results) {
	                    var result = results.rows.length ? results.rows.item(0).value : null;
	
	                    // Check to see if this is serialized content we need to
	                    // unpack.
	                    if (result) {
	                        result = dbInfo.serializer.deserialize(result);
	                    }
	
	                    resolve(result);
	                }, function (t, error) {
	
	                    reject(error);
	                });
	            });
	        })["catch"](reject);
	    });
	
	    executeCallback(promise, callback);
	    return promise;
	}
	
	function iterate$1(iterator, callback) {
	    var self = this;
	
	    var promise = new Promise$1(function (resolve, reject) {
	        self.ready().then(function () {
	            var dbInfo = self._dbInfo;
	
	            dbInfo.db.transaction(function (t) {
	                t.executeSql('SELECT * FROM ' + dbInfo.storeName, [], function (t, results) {
	                    var rows = results.rows;
	                    var length = rows.length;
	
	                    for (var i = 0; i < length; i++) {
	                        var item = rows.item(i);
	                        var result = item.value;
	
	                        // Check to see if this is serialized content
	                        // we need to unpack.
	                        if (result) {
	                            result = dbInfo.serializer.deserialize(result);
	                        }
	
	                        result = iterator(result, item.key, i + 1);
	
	                        // void(0) prevents problems with redefinition
	                        // of `undefined`.
	                        if (result !== void 0) {
	                            resolve(result);
	                            return;
	                        }
	                    }
	
	                    resolve();
	                }, function (t, error) {
	                    reject(error);
	                });
	            });
	        })["catch"](reject);
	    });
	
	    executeCallback(promise, callback);
	    return promise;
	}
	
	function setItem$1(key, value, callback) {
	    var self = this;
	
	    // Cast the key to a string, as that's all we can set as a key.
	    if (typeof key !== 'string') {
	        console.warn(key + ' used as a key, but it is not a string.');
	        key = String(key);
	    }
	
	    var promise = new Promise$1(function (resolve, reject) {
	        self.ready().then(function () {
	            // The localStorage API doesn't return undefined values in an
	            // "expected" way, so undefined is always cast to null in all
	            // drivers. See: https://github.com/mozilla/localForage/pull/42
	            if (value === undefined) {
	                value = null;
	            }
	
	            // Save the original value to pass to the callback.
	            var originalValue = value;
	
	            var dbInfo = self._dbInfo;
	            dbInfo.serializer.serialize(value, function (value, error) {
	                if (error) {
	                    reject(error);
	                } else {
	                    dbInfo.db.transaction(function (t) {
	                        t.executeSql('INSERT OR REPLACE INTO ' + dbInfo.storeName + ' (key, value) VALUES (?, ?)', [key, value], function () {
	                            resolve(originalValue);
	                        }, function (t, error) {
	                            reject(error);
	                        });
	                    }, function (sqlError) {
	                        // The transaction failed; check
	                        // to see if it's a quota error.
	                        if (sqlError.code === sqlError.QUOTA_ERR) {
	                            // We reject the callback outright for now, but
	                            // it's worth trying to re-run the transaction.
	                            // Even if the user accepts the prompt to use
	                            // more storage on Safari, this error will
	                            // be called.
	                            //
	                            // TODO: Try to re-run the transaction.
	                            reject(sqlError);
	                        }
	                    });
	                }
	            });
	        })["catch"](reject);
	    });
	
	    executeCallback(promise, callback);
	    return promise;
	}
	
	function removeItem$1(key, callback) {
	    var self = this;
	
	    // Cast the key to a string, as that's all we can set as a key.
	    if (typeof key !== 'string') {
	        console.warn(key + ' used as a key, but it is not a string.');
	        key = String(key);
	    }
	
	    var promise = new Promise$1(function (resolve, reject) {
	        self.ready().then(function () {
	            var dbInfo = self._dbInfo;
	            dbInfo.db.transaction(function (t) {
	                t.executeSql('DELETE FROM ' + dbInfo.storeName + ' WHERE key = ?', [key], function () {
	                    resolve();
	                }, function (t, error) {
	
	                    reject(error);
	                });
	            });
	        })["catch"](reject);
	    });
	
	    executeCallback(promise, callback);
	    return promise;
	}
	
	// Deletes every item in the table.
	// TODO: Find out if this resets the AUTO_INCREMENT number.
	function clear$1(callback) {
	    var self = this;
	
	    var promise = new Promise$1(function (resolve, reject) {
	        self.ready().then(function () {
	            var dbInfo = self._dbInfo;
	            dbInfo.db.transaction(function (t) {
	                t.executeSql('DELETE FROM ' + dbInfo.storeName, [], function () {
	                    resolve();
	                }, function (t, error) {
	                    reject(error);
	                });
	            });
	        })["catch"](reject);
	    });
	
	    executeCallback(promise, callback);
	    return promise;
	}
	
	// Does a simple `COUNT(key)` to get the number of items stored in
	// localForage.
	function length$1(callback) {
	    var self = this;
	
	    var promise = new Promise$1(function (resolve, reject) {
	        self.ready().then(function () {
	            var dbInfo = self._dbInfo;
	            dbInfo.db.transaction(function (t) {
	                // Ahhh, SQL makes this one soooooo easy.
	                t.executeSql('SELECT COUNT(key) as c FROM ' + dbInfo.storeName, [], function (t, results) {
	                    var result = results.rows.item(0).c;
	
	                    resolve(result);
	                }, function (t, error) {
	
	                    reject(error);
	                });
	            });
	        })["catch"](reject);
	    });
	
	    executeCallback(promise, callback);
	    return promise;
	}
	
	// Return the key located at key index X; essentially gets the key from a
	// `WHERE id = ?`. This is the most efficient way I can think to implement
	// this rarely-used (in my experience) part of the API, but it can seem
	// inconsistent, because we do `INSERT OR REPLACE INTO` on `setItem()`, so
	// the ID of each key will change every time it's updated. Perhaps a stored
	// procedure for the `setItem()` SQL would solve this problem?
	// TODO: Don't change ID on `setItem()`.
	function key$1(n, callback) {
	    var self = this;
	
	    var promise = new Promise$1(function (resolve, reject) {
	        self.ready().then(function () {
	            var dbInfo = self._dbInfo;
	            dbInfo.db.transaction(function (t) {
	                t.executeSql('SELECT key FROM ' + dbInfo.storeName + ' WHERE id = ? LIMIT 1', [n + 1], function (t, results) {
	                    var result = results.rows.length ? results.rows.item(0).key : null;
	                    resolve(result);
	                }, function (t, error) {
	                    reject(error);
	                });
	            });
	        })["catch"](reject);
	    });
	
	    executeCallback(promise, callback);
	    return promise;
	}
	
	function keys$1(callback) {
	    var self = this;
	
	    var promise = new Promise$1(function (resolve, reject) {
	        self.ready().then(function () {
	            var dbInfo = self._dbInfo;
	            dbInfo.db.transaction(function (t) {
	                t.executeSql('SELECT key FROM ' + dbInfo.storeName, [], function (t, results) {
	                    var keys = [];
	
	                    for (var i = 0; i < results.rows.length; i++) {
	                        keys.push(results.rows.item(i).key);
	                    }
	
	                    resolve(keys);
	                }, function (t, error) {
	
	                    reject(error);
	                });
	            });
	        })["catch"](reject);
	    });
	
	    executeCallback(promise, callback);
	    return promise;
	}
	
	var webSQLStorage = {
	    _driver: 'webSQLStorage',
	    _initStorage: _initStorage$1,
	    iterate: iterate$1,
	    getItem: getItem$1,
	    setItem: setItem$1,
	    removeItem: removeItem$1,
	    clear: clear$1,
	    length: length$1,
	    key: key$1,
	    keys: keys$1
	};
	
	// Config the localStorage backend, using options set in the config.
	function _initStorage$2(options) {
	    var self = this;
	    var dbInfo = {};
	    if (options) {
	        for (var i in options) {
	            dbInfo[i] = options[i];
	        }
	    }
	
	    dbInfo.keyPrefix = dbInfo.name + '/';
	
	    if (dbInfo.storeName !== self._defaultConfig.storeName) {
	        dbInfo.keyPrefix += dbInfo.storeName + '/';
	    }
	
	    self._dbInfo = dbInfo;
	    dbInfo.serializer = localforageSerializer;
	
	    return Promise$1.resolve();
	}
	
	// Remove all keys from the datastore, effectively destroying all data in
	// the app's key/value store!
	function clear$2(callback) {
	    var self = this;
	    var promise = self.ready().then(function () {
	        var keyPrefix = self._dbInfo.keyPrefix;
	
	        for (var i = localStorage.length - 1; i >= 0; i--) {
	            var key = localStorage.key(i);
	
	            if (key.indexOf(keyPrefix) === 0) {
	                localStorage.removeItem(key);
	            }
	        }
	    });
	
	    executeCallback(promise, callback);
	    return promise;
	}
	
	// Retrieve an item from the store. Unlike the original async_storage
	// library in Gaia, we don't modify return values at all. If a key's value
	// is `undefined`, we pass that value to the callback function.
	function getItem$2(key, callback) {
	    var self = this;
	
	    // Cast the key to a string, as that's all we can set as a key.
	    if (typeof key !== 'string') {
	        console.warn(key + ' used as a key, but it is not a string.');
	        key = String(key);
	    }
	
	    var promise = self.ready().then(function () {
	        var dbInfo = self._dbInfo;
	        var result = localStorage.getItem(dbInfo.keyPrefix + key);
	
	        // If a result was found, parse it from the serialized
	        // string into a JS object. If result isn't truthy, the key
	        // is likely undefined and we'll pass it straight to the
	        // callback.
	        if (result) {
	            result = dbInfo.serializer.deserialize(result);
	        }
	
	        return result;
	    });
	
	    executeCallback(promise, callback);
	    return promise;
	}
	
	// Iterate over all items in the store.
	function iterate$2(iterator, callback) {
	    var self = this;
	
	    var promise = self.ready().then(function () {
	        var dbInfo = self._dbInfo;
	        var keyPrefix = dbInfo.keyPrefix;
	        var keyPrefixLength = keyPrefix.length;
	        var length = localStorage.length;
	
	        // We use a dedicated iterator instead of the `i` variable below
	        // so other keys we fetch in localStorage aren't counted in
	        // the `iterationNumber` argument passed to the `iterate()`
	        // callback.
	        //
	        // See: github.com/mozilla/localForage/pull/435#discussion_r38061530
	        var iterationNumber = 1;
	
	        for (var i = 0; i < length; i++) {
	            var key = localStorage.key(i);
	            if (key.indexOf(keyPrefix) !== 0) {
	                continue;
	            }
	            var value = localStorage.getItem(key);
	
	            // If a result was found, parse it from the serialized
	            // string into a JS object. If result isn't truthy, the
	            // key is likely undefined and we'll pass it straight
	            // to the iterator.
	            if (value) {
	                value = dbInfo.serializer.deserialize(value);
	            }
	
	            value = iterator(value, key.substring(keyPrefixLength), iterationNumber++);
	
	            if (value !== void 0) {
	                return value;
	            }
	        }
	    });
	
	    executeCallback(promise, callback);
	    return promise;
	}
	
	// Same as localStorage's key() method, except takes a callback.
	function key$2(n, callback) {
	    var self = this;
	    var promise = self.ready().then(function () {
	        var dbInfo = self._dbInfo;
	        var result;
	        try {
	            result = localStorage.key(n);
	        } catch (error) {
	            result = null;
	        }
	
	        // Remove the prefix from the key, if a key is found.
	        if (result) {
	            result = result.substring(dbInfo.keyPrefix.length);
	        }
	
	        return result;
	    });
	
	    executeCallback(promise, callback);
	    return promise;
	}
	
	function keys$2(callback) {
	    var self = this;
	    var promise = self.ready().then(function () {
	        var dbInfo = self._dbInfo;
	        var length = localStorage.length;
	        var keys = [];
	
	        for (var i = 0; i < length; i++) {
	            if (localStorage.key(i).indexOf(dbInfo.keyPrefix) === 0) {
	                keys.push(localStorage.key(i).substring(dbInfo.keyPrefix.length));
	            }
	        }
	
	        return keys;
	    });
	
	    executeCallback(promise, callback);
	    return promise;
	}
	
	// Supply the number of keys in the datastore to the callback function.
	function length$2(callback) {
	    var self = this;
	    var promise = self.keys().then(function (keys) {
	        return keys.length;
	    });
	
	    executeCallback(promise, callback);
	    return promise;
	}
	
	// Remove an item from the store, nice and simple.
	function removeItem$2(key, callback) {
	    var self = this;
	
	    // Cast the key to a string, as that's all we can set as a key.
	    if (typeof key !== 'string') {
	        console.warn(key + ' used as a key, but it is not a string.');
	        key = String(key);
	    }
	
	    var promise = self.ready().then(function () {
	        var dbInfo = self._dbInfo;
	        localStorage.removeItem(dbInfo.keyPrefix + key);
	    });
	
	    executeCallback(promise, callback);
	    return promise;
	}
	
	// Set a key's value and run an optional callback once the value is set.
	// Unlike Gaia's implementation, the callback function is passed the value,
	// in case you want to operate on that value only after you're sure it
	// saved, or something like that.
	function setItem$2(key, value, callback) {
	    var self = this;
	
	    // Cast the key to a string, as that's all we can set as a key.
	    if (typeof key !== 'string') {
	        console.warn(key + ' used as a key, but it is not a string.');
	        key = String(key);
	    }
	
	    var promise = self.ready().then(function () {
	        // Convert undefined values to null.
	        // https://github.com/mozilla/localForage/pull/42
	        if (value === undefined) {
	            value = null;
	        }
	
	        // Save the original value to pass to the callback.
	        var originalValue = value;
	
	        return new Promise$1(function (resolve, reject) {
	            var dbInfo = self._dbInfo;
	            dbInfo.serializer.serialize(value, function (value, error) {
	                if (error) {
	                    reject(error);
	                } else {
	                    try {
	                        localStorage.setItem(dbInfo.keyPrefix + key, value);
	                        resolve(originalValue);
	                    } catch (e) {
	                        // localStorage capacity exceeded.
	                        // TODO: Make this a specific error/event.
	                        if (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
	                            reject(e);
	                        }
	                        reject(e);
	                    }
	                }
	            });
	        });
	    });
	
	    executeCallback(promise, callback);
	    return promise;
	}
	
	var localStorageWrapper = {
	    _driver: 'localStorageWrapper',
	    _initStorage: _initStorage$2,
	    // Default API, from Gaia/localStorage.
	    iterate: iterate$2,
	    getItem: getItem$2,
	    setItem: setItem$2,
	    removeItem: removeItem$2,
	    clear: clear$2,
	    length: length$2,
	    key: key$2,
	    keys: keys$2
	};
	
	function executeTwoCallbacks(promise, callback, errorCallback) {
	    if (typeof callback === 'function') {
	        promise.then(callback);
	    }
	
	    if (typeof errorCallback === 'function') {
	        promise["catch"](errorCallback);
	    }
	}
	
	// Custom drivers are stored here when `defineDriver()` is called.
	// They are shared across all instances of localForage.
	var CustomDrivers = {};
	
	var DriverType = {
	    INDEXEDDB: 'asyncStorage',
	    LOCALSTORAGE: 'localStorageWrapper',
	    WEBSQL: 'webSQLStorage'
	};
	
	var DefaultDriverOrder = [DriverType.INDEXEDDB, DriverType.WEBSQL, DriverType.LOCALSTORAGE];
	
	var LibraryMethods = ['clear', 'getItem', 'iterate', 'key', 'keys', 'length', 'removeItem', 'setItem'];
	
	var DefaultConfig = {
	    description: '',
	    driver: DefaultDriverOrder.slice(),
	    name: 'localforage',
	    // Default DB size is _JUST UNDER_ 5MB, as it's the highest size
	    // we can use without a prompt.
	    size: 4980736,
	    storeName: 'keyvaluepairs',
	    version: 1.0
	};
	
	var driverSupport = {};
	// Check to see if IndexedDB is available and if it is the latest
	// implementation; it's our preferred backend library. We use "_spec_test"
	// as the name of the database because it's not the one we'll operate on,
	// but it's useful to make sure its using the right spec.
	// See: https://github.com/mozilla/localForage/issues/128
	driverSupport[DriverType.INDEXEDDB] = isIndexedDBValid();
	
	driverSupport[DriverType.WEBSQL] = isWebSQLValid();
	
	driverSupport[DriverType.LOCALSTORAGE] = isLocalStorageValid();
	
	var isArray = Array.isArray || function (arg) {
	    return Object.prototype.toString.call(arg) === '[object Array]';
	};
	
	function callWhenReady(localForageInstance, libraryMethod) {
	    localForageInstance[libraryMethod] = function () {
	        var _args = arguments;
	        return localForageInstance.ready().then(function () {
	            return localForageInstance[libraryMethod].apply(localForageInstance, _args);
	        });
	    };
	}
	
	function extend() {
	    for (var i = 1; i < arguments.length; i++) {
	        var arg = arguments[i];
	
	        if (arg) {
	            for (var key in arg) {
	                if (arg.hasOwnProperty(key)) {
	                    if (isArray(arg[key])) {
	                        arguments[0][key] = arg[key].slice();
	                    } else {
	                        arguments[0][key] = arg[key];
	                    }
	                }
	            }
	        }
	    }
	
	    return arguments[0];
	}
	
	function isLibraryDriver(driverName) {
	    for (var driver in DriverType) {
	        if (DriverType.hasOwnProperty(driver) && DriverType[driver] === driverName) {
	            return true;
	        }
	    }
	
	    return false;
	}
	
	var LocalForage = function () {
	    function LocalForage(options) {
	        _classCallCheck(this, LocalForage);
	
	        this.INDEXEDDB = DriverType.INDEXEDDB;
	        this.LOCALSTORAGE = DriverType.LOCALSTORAGE;
	        this.WEBSQL = DriverType.WEBSQL;
	
	        this._defaultConfig = extend({}, DefaultConfig);
	        this._config = extend({}, this._defaultConfig, options);
	        this._driverSet = null;
	        this._initDriver = null;
	        this._ready = false;
	        this._dbInfo = null;
	
	        this._wrapLibraryMethodsWithReady();
	        this.setDriver(this._config.driver);
	    }
	
	    // Set any config values for localForage; can be called anytime before
	    // the first API call (e.g. `getItem`, `setItem`).
	    // We loop through options so we don't overwrite existing config
	    // values.
	
	
	    LocalForage.prototype.config = function config(options) {
	        // If the options argument is an object, we use it to set values.
	        // Otherwise, we return either a specified config value or all
	        // config values.
	        if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object') {
	            // If localforage is ready and fully initialized, we can't set
	            // any new configuration values. Instead, we return an error.
	            if (this._ready) {
	                return new Error("Can't call config() after localforage " + 'has been used.');
	            }
	
	            for (var i in options) {
	                if (i === 'storeName') {
	                    options[i] = options[i].replace(/\W/g, '_');
	                }
	
	                this._config[i] = options[i];
	            }
	
	            // after all config options are set and
	            // the driver option is used, try setting it
	            if ('driver' in options && options.driver) {
	                this.setDriver(this._config.driver);
	            }
	
	            return true;
	        } else if (typeof options === 'string') {
	            return this._config[options];
	        } else {
	            return this._config;
	        }
	    };
	
	    // Used to define a custom driver, shared across all instances of
	    // localForage.
	
	
	    LocalForage.prototype.defineDriver = function defineDriver(driverObject, callback, errorCallback) {
	        var promise = new Promise$1(function (resolve, reject) {
	            try {
	                var driverName = driverObject._driver;
	                var complianceError = new Error('Custom driver not compliant; see ' + 'https://mozilla.github.io/localForage/#definedriver');
	                var namingError = new Error('Custom driver name already in use: ' + driverObject._driver);
	
	                // A driver name should be defined and not overlap with the
	                // library-defined, default drivers.
	                if (!driverObject._driver) {
	                    reject(complianceError);
	                    return;
	                }
	                if (isLibraryDriver(driverObject._driver)) {
	                    reject(namingError);
	                    return;
	                }
	
	                var customDriverMethods = LibraryMethods.concat('_initStorage');
	                for (var i = 0; i < customDriverMethods.length; i++) {
	                    var customDriverMethod = customDriverMethods[i];
	                    if (!customDriverMethod || !driverObject[customDriverMethod] || typeof driverObject[customDriverMethod] !== 'function') {
	                        reject(complianceError);
	                        return;
	                    }
	                }
	
	                var supportPromise = Promise$1.resolve(true);
	                if ('_support' in driverObject) {
	                    if (driverObject._support && typeof driverObject._support === 'function') {
	                        supportPromise = driverObject._support();
	                    } else {
	                        supportPromise = Promise$1.resolve(!!driverObject._support);
	                    }
	                }
	
	                supportPromise.then(function (supportResult) {
	                    driverSupport[driverName] = supportResult;
	                    CustomDrivers[driverName] = driverObject;
	                    resolve();
	                }, reject);
	            } catch (e) {
	                reject(e);
	            }
	        });
	
	        executeTwoCallbacks(promise, callback, errorCallback);
	        return promise;
	    };
	
	    LocalForage.prototype.driver = function driver() {
	        return this._driver || null;
	    };
	
	    LocalForage.prototype.getDriver = function getDriver(driverName, callback, errorCallback) {
	        var self = this;
	        var getDriverPromise = Promise$1.resolve().then(function () {
	            if (isLibraryDriver(driverName)) {
	                switch (driverName) {
	                    case self.INDEXEDDB:
	                        return asyncStorage;
	                    case self.LOCALSTORAGE:
	                        return localStorageWrapper;
	                    case self.WEBSQL:
	                        return webSQLStorage;
	                }
	            } else if (CustomDrivers[driverName]) {
	                return CustomDrivers[driverName];
	            } else {
	                throw new Error('Driver not found.');
	            }
	        });
	        executeTwoCallbacks(getDriverPromise, callback, errorCallback);
	        return getDriverPromise;
	    };
	
	    LocalForage.prototype.getSerializer = function getSerializer(callback) {
	        var serializerPromise = Promise$1.resolve(localforageSerializer);
	        executeTwoCallbacks(serializerPromise, callback);
	        return serializerPromise;
	    };
	
	    LocalForage.prototype.ready = function ready(callback) {
	        var self = this;
	
	        var promise = self._driverSet.then(function () {
	            if (self._ready === null) {
	                self._ready = self._initDriver();
	            }
	
	            return self._ready;
	        });
	
	        executeTwoCallbacks(promise, callback, callback);
	        return promise;
	    };
	
	    LocalForage.prototype.setDriver = function setDriver(drivers, callback, errorCallback) {
	        var self = this;
	
	        if (!isArray(drivers)) {
	            drivers = [drivers];
	        }
	
	        var supportedDrivers = this._getSupportedDrivers(drivers);
	
	        function setDriverToConfig() {
	            self._config.driver = self.driver();
	        }
	
	        function initDriver(supportedDrivers) {
	            return function () {
	                var currentDriverIndex = 0;
	
	                function driverPromiseLoop() {
	                    while (currentDriverIndex < supportedDrivers.length) {
	                        var driverName = supportedDrivers[currentDriverIndex];
	                        currentDriverIndex++;
	
	                        self._dbInfo = null;
	                        self._ready = null;
	
	                        return self.getDriver(driverName).then(function (driver) {
	                            self._extend(driver);
	                            setDriverToConfig();
	
	                            self._ready = self._initStorage(self._config);
	                            return self._ready;
	                        })["catch"](driverPromiseLoop);
	                    }
	
	                    setDriverToConfig();
	                    var error = new Error('No available storage method found.');
	                    self._driverSet = Promise$1.reject(error);
	                    return self._driverSet;
	                }
	
	                return driverPromiseLoop();
	            };
	        }
	
	        // There might be a driver initialization in progress
	        // so wait for it to finish in order to avoid a possible
	        // race condition to set _dbInfo
	        var oldDriverSetDone = this._driverSet !== null ? this._driverSet["catch"](function () {
	            return Promise$1.resolve();
	        }) : Promise$1.resolve();
	
	        this._driverSet = oldDriverSetDone.then(function () {
	            var driverName = supportedDrivers[0];
	            self._dbInfo = null;
	            self._ready = null;
	
	            return self.getDriver(driverName).then(function (driver) {
	                self._driver = driver._driver;
	                setDriverToConfig();
	                self._wrapLibraryMethodsWithReady();
	                self._initDriver = initDriver(supportedDrivers);
	            });
	        })["catch"](function () {
	            setDriverToConfig();
	            var error = new Error('No available storage method found.');
	            self._driverSet = Promise$1.reject(error);
	            return self._driverSet;
	        });
	
	        executeTwoCallbacks(this._driverSet, callback, errorCallback);
	        return this._driverSet;
	    };
	
	    LocalForage.prototype.supports = function supports(driverName) {
	        return !!driverSupport[driverName];
	    };
	
	    LocalForage.prototype._extend = function _extend(libraryMethodsAndProperties) {
	        extend(this, libraryMethodsAndProperties);
	    };
	
	    LocalForage.prototype._getSupportedDrivers = function _getSupportedDrivers(drivers) {
	        var supportedDrivers = [];
	        for (var i = 0, len = drivers.length; i < len; i++) {
	            var driverName = drivers[i];
	            if (this.supports(driverName)) {
	                supportedDrivers.push(driverName);
	            }
	        }
	        return supportedDrivers;
	    };
	
	    LocalForage.prototype._wrapLibraryMethodsWithReady = function _wrapLibraryMethodsWithReady() {
	        // Add a stub for each driver API method that delays the call to the
	        // corresponding driver method until localForage is ready. These stubs
	        // will be replaced by the driver methods as soon as the driver is
	        // loaded, so there is no performance impact.
	        for (var i = 0; i < LibraryMethods.length; i++) {
	            callWhenReady(this, LibraryMethods[i]);
	        }
	    };
	
	    LocalForage.prototype.createInstance = function createInstance(options) {
	        return new LocalForage(options);
	    };
	
	    return LocalForage;
	}();
	
	// The actual localForage object that we expose as a module or via a
	// global. It's extended by pulling in one of our other libraries.
	
	
	var localforage_js = new LocalForage();
	
	module.exports = localforage_js;
	
	},{"3":3}]},{},[4])(4)
	});
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 213 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (root, factory) {
	    if (true) {
	        // AMD. Register as an anonymous module.
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof exports === 'object' && typeof exports.nodeName !== 'string') {
	        // CommonJS
	        factory(exports);
	    } else {
	        // Browser globals
	        factory(root.maquette = {});
	    }
	}(this, function (exports) {
	    ;
	    ;
	    ;
	    ;
	    var NAMESPACE_W3 = 'http://www.w3.org/';
	    var NAMESPACE_SVG = NAMESPACE_W3 + '2000/svg';
	    var NAMESPACE_XLINK = NAMESPACE_W3 + '1999/xlink';
	    // Utilities
	    var emptyArray = [];
	    var extend = function (base, overrides) {
	        var result = {};
	        Object.keys(base).forEach(function (key) {
	            result[key] = base[key];
	        });
	        if (overrides) {
	            Object.keys(overrides).forEach(function (key) {
	                result[key] = overrides[key];
	            });
	        }
	        return result;
	    };
	    // Hyperscript helper functions
	    var same = function (vnode1, vnode2) {
	        if (vnode1.vnodeSelector !== vnode2.vnodeSelector) {
	            return false;
	        }
	        if (vnode1.properties && vnode2.properties) {
	            if (vnode1.properties.key !== vnode2.properties.key) {
	                return false;
	            }
	            return vnode1.properties.bind === vnode2.properties.bind;
	        }
	        return !vnode1.properties && !vnode2.properties;
	    };
	    var toTextVNode = function (data) {
	        return {
	            vnodeSelector: '',
	            properties: undefined,
	            children: undefined,
	            text: data.toString(),
	            domNode: null
	        };
	    };
	    var appendChildren = function (parentSelector, insertions, main) {
	        for (var i = 0, length_1 = insertions.length; i < length_1; i++) {
	            var item = insertions[i];
	            if (Array.isArray(item)) {
	                appendChildren(parentSelector, item, main);
	            } else {
	                if (item !== null && item !== undefined) {
	                    if (!item.hasOwnProperty('vnodeSelector')) {
	                        item = toTextVNode(item);
	                    }
	                    main.push(item);
	                }
	            }
	        }
	    };
	    // Render helper functions
	    var missingTransition = function () {
	        throw new Error('Provide a transitions object to the projectionOptions to do animations');
	    };
	    var DEFAULT_PROJECTION_OPTIONS = {
	        namespace: undefined,
	        eventHandlerInterceptor: undefined,
	        styleApplyer: function (domNode, styleName, value) {
	            // Provides a hook to add vendor prefixes for browsers that still need it.
	            domNode.style[styleName] = value;
	        },
	        transitions: {
	            enter: missingTransition,
	            exit: missingTransition
	        }
	    };
	    var applyDefaultProjectionOptions = function (projectorOptions) {
	        return extend(DEFAULT_PROJECTION_OPTIONS, projectorOptions);
	    };
	    var checkStyleValue = function (styleValue) {
	        if (typeof styleValue !== 'string') {
	            throw new Error('Style values must be strings');
	        }
	    };
	    var setProperties = function (domNode, properties, projectionOptions) {
	        if (!properties) {
	            return;
	        }
	        var eventHandlerInterceptor = projectionOptions.eventHandlerInterceptor;
	        var propNames = Object.keys(properties);
	        var propCount = propNames.length;
	        for (var i = 0; i < propCount; i++) {
	            var propName = propNames[i];
	            /* tslint:disable:no-var-keyword: edge case */
	            var propValue = properties[propName];
	            /* tslint:enable:no-var-keyword */
	            if (propName === 'className') {
	                throw new Error('Property "className" is not supported, use "class".');
	            } else if (propName === 'class') {
	                propValue.split(/\s+/).forEach(function (token) {
	                    return domNode.classList.add(token);
	                });
	            } else if (propName === 'classes') {
	                // object with string keys and boolean values
	                var classNames = Object.keys(propValue);
	                var classNameCount = classNames.length;
	                for (var j = 0; j < classNameCount; j++) {
	                    var className = classNames[j];
	                    if (propValue[className]) {
	                        domNode.classList.add(className);
	                    }
	                }
	            } else if (propName === 'styles') {
	                // object with string keys and string (!) values
	                var styleNames = Object.keys(propValue);
	                var styleCount = styleNames.length;
	                for (var j = 0; j < styleCount; j++) {
	                    var styleName = styleNames[j];
	                    var styleValue = propValue[styleName];
	                    if (styleValue) {
	                        checkStyleValue(styleValue);
	                        projectionOptions.styleApplyer(domNode, styleName, styleValue);
	                    }
	                }
	            } else if (propName === 'key') {
	                continue;
	            } else if (propValue === null || propValue === undefined) {
	                continue;
	            } else {
	                var type = typeof propValue;
	                if (type === 'function') {
	                    if (propName.lastIndexOf('on', 0) === 0) {
	                        if (eventHandlerInterceptor) {
	                            propValue = eventHandlerInterceptor(propName, propValue, domNode, properties);    // intercept eventhandlers
	                        }
	                        if (propName === 'oninput') {
	                            (function () {
	                                // record the evt.target.value, because IE and Edge sometimes do a requestAnimationFrame between changing value and running oninput
	                                var oldPropValue = propValue;
	                                propValue = function (evt) {
	                                    evt.target['oninput-value'] = evt.target.value;
	                                    // may be HTMLTextAreaElement as well
	                                    oldPropValue.apply(this, [evt]);
	                                };
	                            }());
	                        }
	                        domNode[propName] = propValue;
	                    }
	                } else if (type === 'string' && propName !== 'value' && propName !== 'innerHTML') {
	                    if (projectionOptions.namespace === NAMESPACE_SVG && propName === 'href') {
	                        domNode.setAttributeNS(NAMESPACE_XLINK, propName, propValue);
	                    } else {
	                        domNode.setAttribute(propName, propValue);
	                    }
	                } else {
	                    domNode[propName] = propValue;
	                }
	            }
	        }
	    };
	    var updateProperties = function (domNode, previousProperties, properties, projectionOptions) {
	        if (!properties) {
	            return;
	        }
	        var propertiesUpdated = false;
	        var propNames = Object.keys(properties);
	        var propCount = propNames.length;
	        for (var i = 0; i < propCount; i++) {
	            var propName = propNames[i];
	            // assuming that properties will be nullified instead of missing is by design
	            var propValue = properties[propName];
	            var previousValue = previousProperties[propName];
	            if (propName === 'class') {
	                if (previousValue !== propValue) {
	                    throw new Error('"class" property may not be updated. Use the "classes" property for conditional css classes.');
	                }
	            } else if (propName === 'classes') {
	                var classList = domNode.classList;
	                var classNames = Object.keys(propValue);
	                var classNameCount = classNames.length;
	                for (var j = 0; j < classNameCount; j++) {
	                    var className = classNames[j];
	                    var on = !!propValue[className];
	                    var previousOn = !!previousValue[className];
	                    if (on === previousOn) {
	                        continue;
	                    }
	                    propertiesUpdated = true;
	                    if (on) {
	                        classList.add(className);
	                    } else {
	                        classList.remove(className);
	                    }
	                }
	            } else if (propName === 'styles') {
	                var styleNames = Object.keys(propValue);
	                var styleCount = styleNames.length;
	                for (var j = 0; j < styleCount; j++) {
	                    var styleName = styleNames[j];
	                    var newStyleValue = propValue[styleName];
	                    var oldStyleValue = previousValue[styleName];
	                    if (newStyleValue === oldStyleValue) {
	                        continue;
	                    }
	                    propertiesUpdated = true;
	                    if (newStyleValue) {
	                        checkStyleValue(newStyleValue);
	                        projectionOptions.styleApplyer(domNode, styleName, newStyleValue);
	                    } else {
	                        projectionOptions.styleApplyer(domNode, styleName, '');
	                    }
	                }
	            } else {
	                if (!propValue && typeof previousValue === 'string') {
	                    propValue = '';
	                }
	                if (propName === 'value') {
	                    if (domNode[propName] !== propValue && domNode['oninput-value'] !== propValue) {
	                        domNode[propName] = propValue;
	                        // Reset the value, even if the virtual DOM did not change
	                        domNode['oninput-value'] = undefined;
	                    }
	                    // else do not update the domNode, otherwise the cursor position would be changed
	                    if (propValue !== previousValue) {
	                        propertiesUpdated = true;
	                    }
	                } else if (propValue !== previousValue) {
	                    var type = typeof propValue;
	                    if (type === 'function') {
	                        throw new Error('Functions may not be updated on subsequent renders (property: ' + propName + '). Hint: declare event handler functions outside the render() function.');
	                    }
	                    if (type === 'string' && propName !== 'innerHTML') {
	                        if (projectionOptions.namespace === NAMESPACE_SVG && propName === 'href') {
	                            domNode.setAttributeNS(NAMESPACE_XLINK, propName, propValue);
	                        } else {
	                            domNode.setAttribute(propName, propValue);
	                        }
	                    } else {
	                        if (domNode[propName] !== propValue) {
	                            domNode[propName] = propValue;
	                        }
	                    }
	                    propertiesUpdated = true;
	                }
	            }
	        }
	        return propertiesUpdated;
	    };
	    var findIndexOfChild = function (children, sameAs, start) {
	        if (sameAs.vnodeSelector !== '') {
	            // Never scan for text-nodes
	            for (var i = start; i < children.length; i++) {
	                if (same(children[i], sameAs)) {
	                    return i;
	                }
	            }
	        }
	        return -1;
	    };
	    var nodeAdded = function (vNode, transitions) {
	        if (vNode.properties) {
	            var enterAnimation = vNode.properties.enterAnimation;
	            if (enterAnimation) {
	                if (typeof enterAnimation === 'function') {
	                    enterAnimation(vNode.domNode, vNode.properties);
	                } else {
	                    transitions.enter(vNode.domNode, vNode.properties, enterAnimation);
	                }
	            }
	        }
	    };
	    var nodeToRemove = function (vNode, transitions) {
	        var domNode = vNode.domNode;
	        if (vNode.properties) {
	            var exitAnimation = vNode.properties.exitAnimation;
	            if (exitAnimation) {
	                domNode.style.pointerEvents = 'none';
	                var removeDomNode = function () {
	                    if (domNode.parentNode) {
	                        domNode.parentNode.removeChild(domNode);
	                    }
	                };
	                if (typeof exitAnimation === 'function') {
	                    exitAnimation(domNode, removeDomNode, vNode.properties);
	                    return;
	                } else {
	                    transitions.exit(vNode.domNode, vNode.properties, exitAnimation, removeDomNode);
	                    return;
	                }
	            }
	        }
	        if (domNode.parentNode) {
	            domNode.parentNode.removeChild(domNode);
	        }
	    };
	    var checkDistinguishable = function (childNodes, indexToCheck, parentVNode, operation) {
	        var childNode = childNodes[indexToCheck];
	        if (childNode.vnodeSelector === '') {
	            return;    // Text nodes need not be distinguishable
	        }
	        var properties = childNode.properties;
	        var key = properties ? properties.key === undefined ? properties.bind : properties.key : undefined;
	        if (!key) {
	            for (var i = 0; i < childNodes.length; i++) {
	                if (i !== indexToCheck) {
	                    var node = childNodes[i];
	                    if (same(node, childNode)) {
	                        if (operation === 'added') {
	                            throw new Error(parentVNode.vnodeSelector + ' had a ' + childNode.vnodeSelector + ' child ' + 'added, but there is now more than one. You must add unique key properties to make them distinguishable.');
	                        } else {
	                            throw new Error(parentVNode.vnodeSelector + ' had a ' + childNode.vnodeSelector + ' child ' + 'removed, but there were more than one. You must add unique key properties to make them distinguishable.');
	                        }
	                    }
	                }
	            }
	        }
	    };
	    var createDom;
	    var updateDom;
	    var updateChildren = function (vnode, domNode, oldChildren, newChildren, projectionOptions) {
	        if (oldChildren === newChildren) {
	            return false;
	        }
	        oldChildren = oldChildren || emptyArray;
	        newChildren = newChildren || emptyArray;
	        var oldChildrenLength = oldChildren.length;
	        var newChildrenLength = newChildren.length;
	        var transitions = projectionOptions.transitions;
	        var oldIndex = 0;
	        var newIndex = 0;
	        var i;
	        var textUpdated = false;
	        while (newIndex < newChildrenLength) {
	            var oldChild = oldIndex < oldChildrenLength ? oldChildren[oldIndex] : undefined;
	            var newChild = newChildren[newIndex];
	            if (oldChild !== undefined && same(oldChild, newChild)) {
	                textUpdated = updateDom(oldChild, newChild, projectionOptions) || textUpdated;
	                oldIndex++;
	            } else {
	                var findOldIndex = findIndexOfChild(oldChildren, newChild, oldIndex + 1);
	                if (findOldIndex >= 0) {
	                    // Remove preceding missing children
	                    for (i = oldIndex; i < findOldIndex; i++) {
	                        nodeToRemove(oldChildren[i], transitions);
	                        checkDistinguishable(oldChildren, i, vnode, 'removed');
	                    }
	                    textUpdated = updateDom(oldChildren[findOldIndex], newChild, projectionOptions) || textUpdated;
	                    oldIndex = findOldIndex + 1;
	                } else {
	                    // New child
	                    createDom(newChild, domNode, oldIndex < oldChildrenLength ? oldChildren[oldIndex].domNode : undefined, projectionOptions);
	                    nodeAdded(newChild, transitions);
	                    checkDistinguishable(newChildren, newIndex, vnode, 'added');
	                }
	            }
	            newIndex++;
	        }
	        if (oldChildrenLength > oldIndex) {
	            // Remove child fragments
	            for (i = oldIndex; i < oldChildrenLength; i++) {
	                nodeToRemove(oldChildren[i], transitions);
	                checkDistinguishable(oldChildren, i, vnode, 'removed');
	            }
	        }
	        return textUpdated;
	    };
	    var addChildren = function (domNode, children, projectionOptions) {
	        if (!children) {
	            return;
	        }
	        for (var i = 0; i < children.length; i++) {
	            createDom(children[i], domNode, undefined, projectionOptions);
	        }
	    };
	    var initPropertiesAndChildren = function (domNode, vnode, projectionOptions) {
	        addChildren(domNode, vnode.children, projectionOptions);
	        // children before properties, needed for value property of <select>.
	        if (vnode.text) {
	            domNode.textContent = vnode.text;
	        }
	        setProperties(domNode, vnode.properties, projectionOptions);
	        if (vnode.properties && vnode.properties.afterCreate) {
	            vnode.properties.afterCreate.apply(vnode.properties.bind || vnode.properties, [
	                domNode,
	                projectionOptions,
	                vnode.vnodeSelector,
	                vnode.properties,
	                vnode.children
	            ]);
	        }
	    };
	    createDom = function (vnode, parentNode, insertBefore, projectionOptions) {
	        var domNode, i, c, start = 0, type, found;
	        var vnodeSelector = vnode.vnodeSelector;
	        if (vnodeSelector === '') {
	            domNode = vnode.domNode = document.createTextNode(vnode.text);
	            if (insertBefore !== undefined) {
	                parentNode.insertBefore(domNode, insertBefore);
	            } else {
	                parentNode.appendChild(domNode);
	            }
	        } else {
	            for (i = 0; i <= vnodeSelector.length; ++i) {
	                c = vnodeSelector.charAt(i);
	                if (i === vnodeSelector.length || c === '.' || c === '#') {
	                    type = vnodeSelector.charAt(start - 1);
	                    found = vnodeSelector.slice(start, i);
	                    if (type === '.') {
	                        domNode.classList.add(found);
	                    } else if (type === '#') {
	                        domNode.id = found;
	                    } else {
	                        if (found === 'svg') {
	                            projectionOptions = extend(projectionOptions, { namespace: NAMESPACE_SVG });
	                        }
	                        if (projectionOptions.namespace !== undefined) {
	                            domNode = vnode.domNode = document.createElementNS(projectionOptions.namespace, found);
	                        } else {
	                            domNode = vnode.domNode = document.createElement(found);
	                        }
	                        if (insertBefore !== undefined) {
	                            parentNode.insertBefore(domNode, insertBefore);
	                        } else {
	                            parentNode.appendChild(domNode);
	                        }
	                    }
	                    start = i + 1;
	                }
	            }
	            initPropertiesAndChildren(domNode, vnode, projectionOptions);
	        }
	    };
	    updateDom = function (previous, vnode, projectionOptions) {
	        var domNode = previous.domNode;
	        var textUpdated = false;
	        if (previous === vnode) {
	            return false;    // By contract, VNode objects may not be modified anymore after passing them to maquette
	        }
	        var updated = false;
	        if (vnode.vnodeSelector === '') {
	            if (vnode.text !== previous.text) {
	                var newVNode = document.createTextNode(vnode.text);
	                domNode.parentNode.replaceChild(newVNode, domNode);
	                vnode.domNode = newVNode;
	                textUpdated = true;
	                return textUpdated;
	            }
	        } else {
	            if (vnode.vnodeSelector.lastIndexOf('svg', 0) === 0) {
	                projectionOptions = extend(projectionOptions, { namespace: NAMESPACE_SVG });
	            }
	            if (previous.text !== vnode.text) {
	                updated = true;
	                if (vnode.text === undefined) {
	                    domNode.removeChild(domNode.firstChild);    // the only textnode presumably
	                } else {
	                    domNode.textContent = vnode.text;
	                }
	            }
	            updated = updateChildren(vnode, domNode, previous.children, vnode.children, projectionOptions) || updated;
	            updated = updateProperties(domNode, previous.properties, vnode.properties, projectionOptions) || updated;
	            if (vnode.properties && vnode.properties.afterUpdate) {
	                vnode.properties.afterUpdate.apply(vnode.properties.bind || vnode.properties, [
	                    domNode,
	                    projectionOptions,
	                    vnode.vnodeSelector,
	                    vnode.properties,
	                    vnode.children
	                ]);
	            }
	        }
	        if (updated && vnode.properties && vnode.properties.updateAnimation) {
	            vnode.properties.updateAnimation(domNode, vnode.properties, previous.properties);
	        }
	        vnode.domNode = previous.domNode;
	        return textUpdated;
	    };
	    var createProjection = function (vnode, projectionOptions) {
	        return {
	            update: function (updatedVnode) {
	                if (vnode.vnodeSelector !== updatedVnode.vnodeSelector) {
	                    throw new Error('The selector for the root VNode may not be changed. (consider using dom.merge and add one extra level to the virtual DOM)');
	                }
	                updateDom(vnode, updatedVnode, projectionOptions);
	                vnode = updatedVnode;
	            },
	            domNode: vnode.domNode
	        };
	    };
	    ;
	    // The other two parameters are not added here, because the Typescript compiler creates surrogate code for desctructuring 'children'.
	    exports.h = function (selector) {
	        var properties = arguments[1];
	        if (typeof selector !== 'string') {
	            throw new Error();
	        }
	        var childIndex = 1;
	        if (properties && !properties.hasOwnProperty('vnodeSelector') && !Array.isArray(properties) && typeof properties === 'object') {
	            childIndex = 2;
	        } else {
	            // Optional properties argument was omitted
	            properties = undefined;
	        }
	        var text = undefined;
	        var children = undefined;
	        var argsLength = arguments.length;
	        // Recognize a common special case where there is only a single text node
	        if (argsLength === childIndex + 1) {
	            var onlyChild = arguments[childIndex];
	            if (typeof onlyChild === 'string') {
	                text = onlyChild;
	            } else if (onlyChild !== undefined && onlyChild !== null && onlyChild.length === 1 && typeof onlyChild[0] === 'string') {
	                text = onlyChild[0];
	            }
	        }
	        if (text === undefined) {
	            children = [];
	            for (; childIndex < argsLength; childIndex++) {
	                var child = arguments[childIndex];
	                if (child === null || child === undefined) {
	                    continue;
	                } else if (Array.isArray(child)) {
	                    appendChildren(selector, child, children);
	                } else if (child.hasOwnProperty('vnodeSelector')) {
	                    children.push(child);
	                } else {
	                    children.push(toTextVNode(child));
	                }
	            }
	        }
	        return {
	            vnodeSelector: selector,
	            properties: properties,
	            children: children,
	            text: text === '' ? undefined : text,
	            domNode: null
	        };
	    };
	    /**
	 * Contains simple low-level utility functions to manipulate the real DOM.
	 */
	    exports.dom = {
	        /**
	     * Creates a real DOM tree from `vnode`. The [[Projection]] object returned will contain the resulting DOM Node in
	     * its [[Projection.domNode|domNode]] property.
	     * This is a low-level method. Users wil typically use a [[Projector]] instead.
	     * @param vnode - The root of the virtual DOM tree that was created using the [[h]] function. NOTE: [[VNode]]
	     * objects may only be rendered once.
	     * @param projectionOptions - Options to be used to create and update the projection.
	     * @returns The [[Projection]] which also contains the DOM Node that was created.
	     */
	        create: function (vnode, projectionOptions) {
	            projectionOptions = applyDefaultProjectionOptions(projectionOptions);
	            createDom(vnode, document.createElement('div'), undefined, projectionOptions);
	            return createProjection(vnode, projectionOptions);
	        },
	        /**
	     * Appends a new childnode to the DOM which is generated from a [[VNode]].
	     * This is a low-level method. Users wil typically use a [[Projector]] instead.
	     * @param parentNode - The parent node for the new childNode.
	     * @param vnode - The root of the virtual DOM tree that was created using the [[h]] function. NOTE: [[VNode]]
	     * objects may only be rendered once.
	     * @param projectionOptions - Options to be used to create and update the [[Projection]].
	     * @returns The [[Projection]] that was created.
	     */
	        append: function (parentNode, vnode, projectionOptions) {
	            projectionOptions = applyDefaultProjectionOptions(projectionOptions);
	            createDom(vnode, parentNode, undefined, projectionOptions);
	            return createProjection(vnode, projectionOptions);
	        },
	        /**
	     * Inserts a new DOM node which is generated from a [[VNode]].
	     * This is a low-level method. Users wil typically use a [[Projector]] instead.
	     * @param beforeNode - The node that the DOM Node is inserted before.
	     * @param vnode - The root of the virtual DOM tree that was created using the [[h]] function.
	     * NOTE: [[VNode]] objects may only be rendered once.
	     * @param projectionOptions - Options to be used to create and update the projection, see [[createProjector]].
	     * @returns The [[Projection]] that was created.
	     */
	        insertBefore: function (beforeNode, vnode, projectionOptions) {
	            projectionOptions = applyDefaultProjectionOptions(projectionOptions);
	            createDom(vnode, beforeNode.parentNode, beforeNode, projectionOptions);
	            return createProjection(vnode, projectionOptions);
	        },
	        /**
	     * Merges a new DOM node which is generated from a [[VNode]] with an existing DOM Node.
	     * This means that the virtual DOM and the real DOM will have one overlapping element.
	     * Therefore the selector for the root [[VNode]] will be ignored, but its properties and children will be applied to the Element provided.
	     * This is a low-level method. Users wil typically use a [[Projector]] instead.
	     * @param domNode - The existing element to adopt as the root of the new virtual DOM. Existing attributes and childnodes are preserved.
	     * @param vnode - The root of the virtual DOM tree that was created using the [[h]] function. NOTE: [[VNode]] objects
	     * may only be rendered once.
	     * @param projectionOptions - Options to be used to create and update the projection, see [[createProjector]].
	     * @returns The [[Projection]] that was created.
	     */
	        merge: function (element, vnode, projectionOptions) {
	            projectionOptions = applyDefaultProjectionOptions(projectionOptions);
	            vnode.domNode = element;
	            initPropertiesAndChildren(element, vnode, projectionOptions);
	            return createProjection(vnode, projectionOptions);
	        }
	    };
	    /**
	 * Creates a [[CalculationCache]] object, useful for caching [[VNode]] trees.
	 * In practice, caching of [[VNode]] trees is not needed, because achieving 60 frames per second is almost never a problem.
	 * For more information, see [[CalculationCache]].
	 *
	 * @param <Result> The type of the value that is cached.
	 */
	    exports.createCache = function () {
	        var cachedInputs = undefined;
	        var cachedOutcome = undefined;
	        var result = {
	            invalidate: function () {
	                cachedOutcome = undefined;
	                cachedInputs = undefined;
	            },
	            result: function (inputs, calculation) {
	                if (cachedInputs) {
	                    for (var i = 0; i < inputs.length; i++) {
	                        if (cachedInputs[i] !== inputs[i]) {
	                            cachedOutcome = undefined;
	                        }
	                    }
	                }
	                if (!cachedOutcome) {
	                    cachedOutcome = calculation();
	                    cachedInputs = inputs;
	                }
	                return cachedOutcome;
	            }
	        };
	        return result;
	    };
	    /**
	 * Creates a {@link Mapping} instance that keeps an array of result objects synchronized with an array of source objects.
	 * See {@link http://maquettejs.org/docs/arrays.html|Working with arrays}.
	 *
	 * @param <Source>       The type of source items. A database-record for instance.
	 * @param <Target>       The type of target items. A [[Component]] for instance.
	 * @param getSourceKey   `function(source)` that must return a key to identify each source object. The result must either be a string or a number.
	 * @param createResult   `function(source, index)` that must create a new result object from a given source. This function is identical
	 *                       to the `callback` argument in `Array.map(callback)`.
	 * @param updateResult   `function(source, target, index)` that updates a result to an updated source.
	 */
	    exports.createMapping = function (getSourceKey, createResult, updateResult) {
	        var keys = [];
	        var results = [];
	        return {
	            results: results,
	            map: function (newSources) {
	                var newKeys = newSources.map(getSourceKey);
	                var oldTargets = results.slice();
	                var oldIndex = 0;
	                for (var i = 0; i < newSources.length; i++) {
	                    var source = newSources[i];
	                    var sourceKey = newKeys[i];
	                    if (sourceKey === keys[oldIndex]) {
	                        results[i] = oldTargets[oldIndex];
	                        updateResult(source, oldTargets[oldIndex], i);
	                        oldIndex++;
	                    } else {
	                        var found = false;
	                        for (var j = 1; j < keys.length + 1; j++) {
	                            var searchIndex = (oldIndex + j) % keys.length;
	                            if (keys[searchIndex] === sourceKey) {
	                                results[i] = oldTargets[searchIndex];
	                                updateResult(newSources[i], oldTargets[searchIndex], i);
	                                oldIndex = searchIndex + 1;
	                                found = true;
	                                break;
	                            }
	                        }
	                        if (!found) {
	                            results[i] = createResult(source, i);
	                        }
	                    }
	                }
	                results.length = newSources.length;
	                keys = newKeys;
	            }
	        };
	    };
	    /**
	 * Creates a [[Projector]] instance using the provided projectionOptions.
	 *
	 * For more information, see [[Projector]].
	 *
	 * @param projectionOptions   Options that influence how the DOM is rendered and updated.
	 */
	    exports.createProjector = function (projectorOptions) {
	        var projector;
	        var projectionOptions = applyDefaultProjectionOptions(projectorOptions);
	        projectionOptions.eventHandlerInterceptor = function (propertyName, eventHandler, domNode, properties) {
	            return function () {
	                // intercept function calls (event handlers) to do a render afterwards.
	                projector.scheduleRender();
	                return eventHandler.apply(properties.bind || this, arguments);
	            };
	        };
	        var renderCompleted = true;
	        var scheduled;
	        var stopped = false;
	        var projections = [];
	        var renderFunctions = [];
	        // matches the projections array
	        var doRender = function () {
	            scheduled = undefined;
	            if (!renderCompleted) {
	                return;    // The last render threw an error, it should be logged in the browser console.
	            }
	            renderCompleted = false;
	            for (var i = 0; i < projections.length; i++) {
	                var updatedVnode = renderFunctions[i]();
	                projections[i].update(updatedVnode);
	            }
	            renderCompleted = true;
	        };
	        projector = {
	            scheduleRender: function () {
	                if (!scheduled && !stopped) {
	                    scheduled = requestAnimationFrame(doRender);
	                }
	            },
	            stop: function () {
	                if (scheduled) {
	                    cancelAnimationFrame(scheduled);
	                    scheduled = undefined;
	                }
	                stopped = true;
	            },
	            resume: function () {
	                stopped = false;
	                renderCompleted = true;
	                projector.scheduleRender();
	            },
	            append: function (parentNode, renderMaquetteFunction) {
	                projections.push(exports.dom.append(parentNode, renderMaquetteFunction(), projectionOptions));
	                renderFunctions.push(renderMaquetteFunction);
	            },
	            insertBefore: function (beforeNode, renderMaquetteFunction) {
	                projections.push(exports.dom.insertBefore(beforeNode, renderMaquetteFunction(), projectionOptions));
	                renderFunctions.push(renderMaquetteFunction);
	            },
	            merge: function (domNode, renderMaquetteFunction) {
	                projections.push(exports.dom.merge(domNode, renderMaquetteFunction(), projectionOptions));
	                renderFunctions.push(renderMaquetteFunction);
	            },
	            replace: function (domNode, renderMaquetteFunction) {
	                var vnode = renderMaquetteFunction();
	                createDom(vnode, domNode.parentNode, domNode, projectionOptions);
	                domNode.parentNode.removeChild(domNode);
	                projections.push(createProjection(vnode, projectionOptions));
	                renderFunctions.push(renderMaquetteFunction);
	            },
	            detach: function (renderMaquetteFunction) {
	                for (var i = 0; i < renderFunctions.length; i++) {
	                    if (renderFunctions[i] === renderMaquetteFunction) {
	                        renderFunctions.splice(i, 1);
	                        return projections.splice(i, 1)[0];
	                    }
	                }
	                throw new Error('renderMaquetteFunction was not found');
	            }
	        };
	        return projector;
	    };
	}));
	//# sourceMappingURL=maquette.js.map


/***/ },
/* 214 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var maquette_1 = __webpack_require__(213);
	var register_page_1 = __webpack_require__(215);
	var utilities_1 = __webpack_require__(240);
	var main_menu_1 = __webpack_require__(241);
	__webpack_require__(244);
	// polyfill for object assign, since it is not supported by android.
	if (typeof Object.assign !== 'function') {
	    Object.assign = function (target) {
	        'use strict';
	        if (target == null) {
	            throw new TypeError('Cannot convert undefined or null to object');
	        }
	        target = Object(target);
	        for (var index = 1; index < arguments.length; index++) {
	            var source = arguments[index];
	            if (source != null) {
	                for (var key in source) {
	                    if (Object.prototype.hasOwnProperty.call(source, key)) {
	                        target[key] = source[key];
	                    }
	                }
	            }
	        }
	        return target;
	    };
	}
	// // plugin currently has an error with building for Android...
	// // https://github.com/katzer/cordova-plugin-local-notifications
	document.addEventListener('deviceready', function () {
	    alert('device is ready');
	    // Schedule notification for tomorrow to remember about the meeting
	    cordova.plugins.notification.local.schedule({
	        id: 10,
	        title: 'Meeting in 15 minutes!',
	        text: 'test een notificatie vanuit cordova',
	        data: { meetingId: '#123FG8' }
	    });
	    // Join BBM Meeting when user has clicked on the notification 
	    cordova.plugins.notification.local.on('click', function (notification) {
	        if (notification.id === 10) {
	        }
	    });
	    // Notification has reached its trigger time (Tomorrow at 8:45 AM)
	    cordova.plugins.notification.local.on('trigger', function (notification) {
	        if (notification.id !== 10) {
	            return;
	        }
	        // After 10 minutes update notification's title 
	        setTimeout(function () {
	            cordova.plugins.notification.local.update({
	                id: 10,
	                title: 'Meeting in 5 minutes!'
	            });
	        }, 600000);
	    });
	}, false);
	exports.createApp = function (dataService, store, router, userService, projector) {
	    var registerPage = register_page_1.createRegisterPage(dataService, userService, projector, utilities_1.randomId());
	    var mainMenu = main_menu_1.createMainMenu();
	    return {
	        renderMaquette: function () {
	            var currentPage = userService.getUserInfo() ? router.getCurrentPage() : registerPage;
	            return maquette_1.h('body', { class: 'app' }, [
	                maquette_1.h('div', { class: 'header' }, [
	                    currentPage.renderHeader(),
	                    maquette_1.h('div', { class: 'status' }, [dataService.isOnline() ? 'DB Connected' : 'DB Not connected'])
	                ]),
	                maquette_1.h('div', { key: currentPage, class: 'body' }, [
	                    mainMenu.renderMaquette(),
	                    currentPage.renderBody()
	                ])
	            ]);
	        }
	    };
	};


/***/ },
/* 215 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var page_1 = __webpack_require__(216);
	var text_1 = __webpack_require__(221);
	var text_field_1 = __webpack_require__(224);
	var button_1 = __webpack_require__(227);
	var image_uploader_1 = __webpack_require__(230);
	exports.createRegisterPage = function (dataService, userService, projector, id) {
	    var firstName = '';
	    var lastName = '';
	    var company = '';
	    var phoneNumber = '';
	    var image = '';
	    var address = '';
	    var city = '';
	    var country = '';
	    var doRegister = function () {
	        var canvas = document.getElementById('canvas');
	        image = canvas.toDataURL();
	        userService.updateUserInfo({
	            id: id,
	            firstName: firstName,
	            lastName: lastName,
	            phoneNumber: phoneNumber,
	            address: address,
	            city: city,
	            country: country,
	            company: company,
	            image: image
	        });
	    };
	    var page = page_1.createPage({
	        title: 'Registration',
	        dataService: dataService,
	        body: [
	            text_1.createText({ htmlContent: 'How may we identify you?' }),
	            text_field_1.createTextField({ label: 'First name' }, { getValue: function () { return firstName; }, setValue: function (value) { firstName = value; } }),
	            text_field_1.createTextField({ label: 'Last name' }, { getValue: function () { return lastName; }, setValue: function (value) { lastName = value; } }),
	            text_field_1.createTextField({ label: 'Phone number' }, { getValue: function () { return phoneNumber; }, setValue: function (value) { phoneNumber = value; } }),
	            text_field_1.createTextField({ label: 'Company' }, { getValue: function () { return company; }, setValue: function (value) { company = value; } }),
	            text_field_1.createTextField({ label: 'Address' }, { getValue: function () { return address; }, setValue: function (value) { address = value; } }),
	            text_field_1.createTextField({ label: 'City' }, { getValue: function () { return city; }, setValue: function (value) { city = value; } }),
	            text_field_1.createTextField({ label: 'Country' }, { getValue: function () { return country; }, setValue: function (value) { country = value; } }),
	            image_uploader_1.createImageUploader({ projector: projector, userService: userService, image: 'images/barcode.jpg' }, {}),
	            button_1.createButton({ text: 'Register', primary: true }, { onClick: doRegister })
	        ]
	    });
	    return page;
	};


/***/ },
/* 216 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var maquette_1 = __webpack_require__(213);
	__webpack_require__(217);
	exports.createPage = function (config) {
	    var title = config.title, body = config.body, destroy = config.destroy;
	    var getTitle = typeof title === 'string' ? function () { return title; } : title;
	    var page = {
	        destroy: destroy,
	        renderHeader: function () {
	            return maquette_1.h('span', { class: 'title' }, [getTitle()]);
	        },
	        renderBody: function () {
	            return maquette_1.h('div', { class: 'card page', key: page }, [
	                body.map(function (c) { return c.renderMaquette(); })
	            ]);
	        }
	    };
	    return page;
	};


/***/ },
/* 217 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(218);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(220)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./page.scss", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./page.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 218 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(219)();
	// imports
	
	
	// module
	exports.push([module.id, ".page {\n  display: flex;\n  flex-direction: column;\n  flex-grow: 1; }\n\n.header {\n  flex: 1 1 auto; }\n", ""]);
	
	// exports


/***/ },
/* 219 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];
	
		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};
	
		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 220 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];
	
	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}
	
		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();
	
		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";
	
		var styles = listToStyles(list);
		addStylesToDom(styles, options);
	
		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}
	
	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}
	
	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}
	
	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}
	
	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}
	
	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}
	
	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}
	
	function addStyle(obj, options) {
		var styleElement, update, remove;
	
		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}
	
		update(obj);
	
		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}
	
	var replaceText = (function () {
		var textStore = [];
	
		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();
	
	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;
	
		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}
	
	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
	
		if(media) {
			styleElement.setAttribute("media", media)
		}
	
		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}
	
	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;
	
		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}
	
		var blob = new Blob([css], { type: "text/css" });
	
		var oldSrc = linkElement.href;
	
		linkElement.href = URL.createObjectURL(blob);
	
		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 221 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var maquette_1 = __webpack_require__(213);
	__webpack_require__(222);
	exports.createText = function (config) {
	    var htmlContent = config.htmlContent;
	    return {
	        renderMaquette: function () {
	            return maquette_1.h('p', { class: 'text', innerHTML: htmlContent });
	        }
	    };
	};


/***/ },
/* 222 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(223);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(220)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./text.scss", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./text.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 223 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(219)();
	// imports
	
	
	// module
	exports.push([module.id, ".text {\n  display: block;\n  margin: 16px;\n  color: #222222; }\n", ""]);
	
	// exports


/***/ },
/* 224 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var maquette_1 = __webpack_require__(213);
	__webpack_require__(225);
	exports.createTextField = function (config, bindings) {
	    var getValue = bindings.getValue, setValue = bindings.setValue;
	    var handleInput = function (evt) {
	        setValue(evt.target.value);
	    };
	    var textField = {
	        renderMaquette: function () {
	            return maquette_1.h('label', { class: 'textField', key: textField }, [
	                maquette_1.h('span', { class: 'label' }, [config.label]),
	                maquette_1.h('input', { class: 'input', type: 'text', value: getValue(), oninput: handleInput })
	            ]);
	        }
	    };
	    return textField;
	};


/***/ },
/* 225 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(226);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(220)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./text-field.scss", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./text-field.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 226 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(219)();
	// imports
	
	
	// module
	exports.push([module.id, ".textField {\n  display: flex;\n  flex-direction: column;\n  margin: 8px;\n  height: 50px; }\n\n.label {\n  margin-left: 8px;\n  color: text-color-inverted; }\n\n.input {\n  border: 1px solid #cacaca;\n  padding: 3px 7px;\n  line-height: 24px;\n  border-radius: 4px; }\n", ""]);
	
	// exports


/***/ },
/* 227 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var maquette_1 = __webpack_require__(213);
	__webpack_require__(228);
	exports.createButton = function (config, bindings) {
	    var handleClick = function (evt) {
	        evt.preventDefault();
	        bindings.onClick();
	    };
	    return {
	        renderMaquette: function () {
	            return maquette_1.h('button', { class: 'button', classes: (_a = {}, _a['primary'] = config.primary, _a), onclick: handleClick }, [
	                config.text
	            ]);
	            var _a;
	        }
	    };
	};


/***/ },
/* 228 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(229);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(220)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./button.scss", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./button.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 229 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(219)();
	// imports
	
	
	// module
	exports.push([module.id, ".button {\n  margin: 24px 8px 8px 8px;\n  border: 1px solid #cacaca;\n  border-radius: 4px;\n  text-align: center;\n  background-color: LightSlateGrey;\n  color: white;\n  padding: 4px;\n  line-height: 24px;\n  font-size: 14px;\n  width: inherit;\n  font-weight: bold;\n  height: 35px; }\n\n.primary {\n  background-color: LimeGreen; }\n\n.invertedPrimary {\n  border: 1px solid green;\n  background: none;\n  color: green;\n  font-weight: 500; }\n\n.invertedDanger {\n  border: 1px solid red;\n  background: none;\n  color: red;\n  font-weight: 500; }\n", ""]);
	
	// exports


/***/ },
/* 230 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var modal_1 = __webpack_require__(231);
	var button_1 = __webpack_require__(227);
	var live_camera_1 = __webpack_require__(234);
	var maquette_1 = __webpack_require__(213);
	__webpack_require__(238);
	var Quagga = __webpack_require__(237); // library for scanning barcodes
	exports.createImageUploader = function (config, bindings) {
	    var projector = config.projector, image = config.image;
	    var getUserMediaIsSupported = true;
	    var modalIsOpen = false;
	    var elementsCreated = false;
	    var canvasCreated = false;
	    var canvas, context, video, videoObj, errBack, n = navigator;
	    errBack = function (error) {
	        console.log(String(error));
	    };
	    var checkUserMediaSupport = function () {
	        if (!(n.getUserMedia || n.webkitGetUserMedia || n.mozGetUserMedia)) {
	            getUserMediaIsSupported = false;
	        }
	    };
	    checkUserMediaSupport();
	    var createCanvas = function () {
	        if (!canvasCreated) {
	            canvas = document.getElementById('canvas');
	            context = canvas.getContext('2d');
	            canvasCreated = true;
	        }
	    };
	    var createElements = function () {
	        // this must happen only once
	        if (!elementsCreated) {
	            // Grab elements, create settings, etc.
	            createCanvas();
	            // get video from the holder
	            var parent_1 = document.getElementById('barcodeScanViewHolder');
	            video = parent_1.getElementsByTagName('video')[0];
	            videoObj = { 'video': true };
	            elementsCreated = true;
	        }
	    };
	    var getPicture = function (event) {
	        createCanvas();
	        if (event.target.files.length === 1 &&
	            event.target.files[0].type.indexOf('image/') === 0) {
	            var temp_image_1 = new Image();
	            temp_image_1.src = URL.createObjectURL(event.target.files[0]);
	            temp_image_1.onload = function () {
	                context.drawImage(temp_image_1, 0, 0, 320, 240);
	            };
	        }
	    };
	    var toggleModal = function () {
	        modalIsOpen = !modalIsOpen;
	        if (!modalIsOpen) {
	            Quagga.stop();
	        }
	    };
	    var createScreenShot = function () {
	        createElements();
	        context.drawImage(video, 0, 0, 320, 240);
	        toggleModal();
	    };
	    var openModalButton = button_1.createButton({
	        text: 'Use webcam',
	        primary: false
	    }, {
	        onClick: toggleModal
	    });
	    var setInitialImageAfterCreate = function () {
	        createCanvas();
	        var img = new Image;
	        img.src = image;
	        context.drawImage(img, 0, 0, 320, 240);
	    };
	    var createScreenshotButton = button_1.createButton({ text: 'Create Snapshot', primary: false }, { onClick: createScreenShot });
	    return {
	        renderMaquette: function () {
	            var modal = modal_1.createModal({
	                isOpen: modalIsOpen,
	                title: 'Create a snapshot',
	                contents: [
	                    createScreenshotButton,
	                    live_camera_1.createLiveCamera({ projector: projector, BarcodeScanEnabled: false }, {}) // we don't want to use barcodes when uploading images.
	                ]
	            }, {
	                toggleModal: toggleModal
	            });
	            return maquette_1.h('div', { class: 'live-camera-holder' }, [
	                maquette_1.h('div', { class: 'image-uploader-buttons' }, [
	                    getUserMediaIsSupported ? [
	                        modal.renderMaquette(),
	                        openModalButton.renderMaquette()
	                    ] : undefined,
	                    maquette_1.h('input', {
	                        class: 'button',
	                        type: 'file',
	                        capture: 'camera',
	                        accept: 'image/*',
	                        id: 'takePictureField',
	                        onchange: getPicture
	                    })
	                ]),
	                maquette_1.h('canvas', { id: 'canvas', width: '320', height: '240', afterCreate: setInitialImageAfterCreate })
	            ]);
	        }
	    };
	};


/***/ },
/* 231 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var maquette_1 = __webpack_require__(213);
	__webpack_require__(232);
	exports.createModal = function (config, bindings) {
	    var isOpen = config.isOpen, title = config.title, contents = config.contents;
	    var toggleModal = bindings.toggleModal;
	    return {
	        renderMaquette: function () {
	            if (isOpen) {
	                return maquette_1.h('div', { class: 'modal' }, [
	                    maquette_1.h('div', { class: 'modalContent' }, [
	                        maquette_1.h('div', { class: 'modalHeader' }, [
	                            title,
	                            maquette_1.h('div', { class: 'close', onclick: toggleModal }, ['X'])
	                        ]),
	                        contents.map(function (c) { return c.renderMaquette(); })
	                    ])
	                ]);
	            }
	            else {
	                return undefined;
	            }
	        }
	    };
	};


/***/ },
/* 232 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(233);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(220)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./modal.scss", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./modal.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 233 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(219)();
	// imports
	
	
	// module
	exports.push([module.id, "/* The Modal (background) */\n.modal {\n  position: fixed;\n  /* Stay in place */\n  z-index: 1;\n  /* Sit on top */\n  left: 0;\n  top: 0;\n  width: 100%;\n  /* Full width */\n  height: 100%;\n  /* Full height */\n  overflow: auto;\n  /* Enable scroll if needed */\n  background-color: black;\n  /* Fallback color */\n  background-color: rgba(0, 0, 0, 0.4);\n  /* Black w/ opacity */ }\n\n/* Modal header /Box */\n.modalHeader {\n  font-size: 30px;\n  padding: 10px;\n  border-bottom: 1px solid #dcdcdc; }\n\n/* Modal Content/Box */\n.modalContent {\n  background-color: #fefefe;\n  margin: 15% auto;\n  /* 15% from the top and centered */\n  padding: 40px;\n  border: 1px solid #888;\n  width: 80%;\n  /* Could be more or less, depending on screen size */ }\n\n/* The Close Button */\n.close {\n  color: #aaa;\n  float: right;\n  font-size: 28px;\n  font-weight: bold; }\n\n.close:hover,\n.close:focus {\n  color: black;\n  text-decoration: none;\n  cursor: pointer; }\n", ""]);
	
	// exports


/***/ },
/* 234 */
/***/ function(module, exports, __webpack_require__) {

	/*
	    this component returns a videoview,
	    and optionally an additional canvas and textview in which the code of a barcode is shown.
	*/
	"use strict";
	var maquette_1 = __webpack_require__(213);
	__webpack_require__(235);
	var Quagga = __webpack_require__(237); // library for scanning barcodes
	exports.createLiveCamera = function (config, bindings) {
	    var projector = config.projector, BarcodeScanEnabled = config.BarcodeScanEnabled;
	    var detectedCode = 'nothing detected yet...';
	    var barcodeReaders = ['ean_reader', 'code_128_reader', 'code_39_reader', 'codabar_reader', 'upc_reader', 'i2of5_reader'];
	    var startCamera = function () {
	        Quagga.init({
	            inputStream: {
	                name: 'Live',
	                type: 'LiveStream',
	                target: '#barcodeScanViewHolder'
	            },
	            decoder: {
	                readers: barcodeReaders
	            }
	        }, function (err) {
	            if (err) {
	                console.log(err);
	                return;
	            }
	            // only start quagga if we want it
	            if (BarcodeScanEnabled) {
	                console.log('Initialization finished. Ready to start');
	                Quagga.start();
	            }
	        });
	        Quagga.onProcessed(function (result) {
	            var drawingCtx = Quagga.canvas.ctx.overlay, drawingCanvas = Quagga.canvas.dom.overlay;
	            if (result) {
	                if (result.boxes) {
	                    drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute('width'), 10), parseInt(drawingCanvas.getAttribute('height'), 10));
	                    result.boxes.filter(function (box) {
	                        return box !== result.box;
	                    }).forEach(function (box) {
	                        Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, { color: 'green', lineWidth: 2 });
	                    });
	                }
	                if (result.box) {
	                    Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, { color: '#00F', lineWidth: 2 });
	                }
	                if (result.codeResult && result.codeResult.code) {
	                    Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, drawingCtx, { color: 'red', lineWidth: 3 });
	                }
	            }
	        });
	        Quagga.onDetected(function (result) {
	            var code = result.codeResult.code;
	            detectedCode = code;
	            projector.scheduleRender();
	        });
	    };
	    var temp_image = new Image();
	    var decodeImage = function (event) {
	        var parent = document.getElementById('barcodeScanViewHolder');
	        var imageCanvas = document.getElementById('uploadedImageCanvas');
	        var drawBoxCanvas = parent.getElementsByClassName('drawingBuffer')[0];
	        var imageContext = imageCanvas.getContext('2d');
	        var boxContext = drawBoxCanvas.getContext('2d');
	        if (event.target.files.length === 1 &&
	            event.target.files[0].type.indexOf('image/') === 0) {
	            temp_image.src = URL.createObjectURL(event.target.files[0]);
	            Quagga.decodeSingle({
	                decoder: {
	                    readers: barcodeReaders
	                },
	                locate: true,
	                src: temp_image.src
	            }, function (result) {
	                imageContext.canvas.height = boxContext.canvas.height;
	                imageContext.canvas.width = boxContext.canvas.width;
	                imageContext.drawImage(temp_image, 0, 0, drawBoxCanvas.width, drawBoxCanvas.height);
	                if (result) {
	                    if (result.codeResult) {
	                        console.log('result', result.codeResult.code);
	                        detectedCode = result.codeResult.code;
	                        projector.scheduleRender();
	                    }
	                    else {
	                        console.log('a box was detected, but no code detected');
	                    }
	                }
	                else {
	                    console.log('nothing detected');
	                    decodeImage(event); // recursion
	                }
	            });
	        }
	    };
	    return {
	        renderMaquette: function () {
	            return maquette_1.h('div', { class: 'camera-container' }, [
	                BarcodeScanEnabled ? [
	                    maquette_1.h('h2', [detectedCode]),
	                    maquette_1.h('input', { type: 'file', capture: 'camera', accept: 'image/*', id: 'takePictureField', onchange: decodeImage })
	                ] : undefined,
	                // after the DOM is loaded we will try to load the video in it
	                maquette_1.h('div', { id: 'barcodeScanViewHolder', class: 'viewport', afterCreate: startCamera }, [
	                    // for barcode scanning we need an extra canvas in here
	                    BarcodeScanEnabled ? maquette_1.h('canvas', { id: 'uploadedImageCanvas', class: 'overlayCanvas' }, []) : undefined
	                ])
	            ]);
	        }
	    };
	};


/***/ },
/* 235 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(236);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(220)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./live-camera.scss", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./live-camera.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 236 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(219)();
	// imports
	
	
	// module
	exports.push([module.id, "canvas {\n  margin: 24px 8px 8px 8px;\n  border: 1px solid black;\n  position: relative; }\n\nvideo {\n  margin: 24px 8px 8px 8px;\n  border: 2px solid #ffff00;\n  position: relative; }\n\n.viewport canvas {\n  z-index: 2;\n  position: absolute; }\n\n.viewport video {\n  position: absolute;\n  z-index: 0; }\n\n.viewport #uploadedImageCanvas {\n  z-index: 1;\n  position: absolute; }\n", ""]);
	
	// exports


/***/ },
/* 237 */
/***/ function(module, exports, __webpack_require__) {

	!function(e,t){ true?module.exports=t(t.toString())["default"]:"object"==typeof exports?exports.Quagga=t(t.toString())["default"]:e.Quagga=t(t.toString())["default"]}(this,function(e){return function(e){function t(r){if(n[r])return n[r].e;var o=n[r]={e:{},i:r,l:!1};return e[r].call(o.e,o,o.e,t),o.l=!0,o.e}var n={};return t.m=e,t.c=n,t.p="/",t(t.s=158)}([function(e,t,n){"use strict";var r=!0,o={disableLog:function(e){return"boolean"!=typeof e?new Error("Argument type: "+typeof e+". Please use a boolean."):(r=e,e?"adapter.js logging disabled":"adapter.js logging enabled")},log:function(){if("object"==typeof window){if(r)return;"undefined"!=typeof console&&"function"==typeof console.log&&console.log.apply(console,arguments)}},extractVersion:function(e,t,n){var r=e.match(t);return r&&r.length>=n&&parseInt(r[n],10)},detectBrowser:function(){var e={};if(e.browser=null,e.version=null,e.minVersion=null,"undefined"==typeof window||!window.navigator)return e.browser="Not a browser.",e;if(navigator.mozGetUserMedia)e.browser="firefox",e.version=this.extractVersion(navigator.userAgent,/Firefox\/([0-9]+)\./,1),e.minVersion=31;else if(navigator.webkitGetUserMedia)if(window.webkitRTCPeerConnection)e.browser="chrome",e.version=this.extractVersion(navigator.userAgent,/Chrom(e|ium)\/([0-9]+)\./,2),e.minVersion=38;else{if(!navigator.userAgent.match(/Version\/(\d+).(\d+)/))return e.browser="Unsupported webkit-based browser with GUM support but no WebRTC support.",e;e.browser="safari",e.version=this.extractVersion(navigator.userAgent,/AppleWebKit\/([0-9]+)\./,1),e.minVersion=602}else{if(!navigator.mediaDevices||!navigator.userAgent.match(/Edge\/(\d+).(\d+)$/))return e.browser="Not a supported browser.",e;e.browser="edge",e.version=this.extractVersion(navigator.userAgent,/Edge\/(\d+).(\d+)$/,2),e.minVersion=10547}return e.version<e.minVersion&&o.log("Browser: "+e.browser+" Version: "+e.version+" < minimum supported version: "+e.minVersion+"\n some things might not work!"),e}};e.e={log:o.log,disableLog:o.disableLog,browserDetails:o.detectBrowser(),extractVersion:o.extractVersion}},function(e,t,n){(function(e,r){var o=n(106),i={"function":!0,object:!0},a=i[typeof t]&&t&&!t.nodeType?t:void 0,c=i[typeof e]&&e&&!e.nodeType?e:void 0,s=o(a&&c&&"object"==typeof r&&r),u=o(i[typeof self]&&self),d=o(i[typeof window]&&window),f=o(i[typeof this]&&this),l=s||d!==(f&&f.window)&&d||u||f||Function("return this")();e.e=l}).call(t,n(48)(e),function(){return this}())},function(e,t,n){function r(e){var t=typeof e;return!!e&&("object"==t||"function"==t)}e.e=r},function(e,t,n){function r(e,t){e=a.a.bind()(o(),e),c.a.call(this,e,t)}function o(){var e={};return Object.keys(r.CONFIG_KEYS).forEach(function(t){e[t]=r.CONFIG_KEYS[t]["default"]}),e}var i=n(17),a=i&&i.__esModule?function(){return i["default"]}:function(){return i};Object.defineProperty(a,"a",{get:a});var c=n(6),s=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},u={CODE_L_START:{value:0},CODE_G_START:{value:10},START_PATTERN:{value:[1,1,1]},STOP_PATTERN:{value:[1,1,1]},MIDDLE_PATTERN:{value:[1,1,1,1,1]},EXTENSION_START_PATTERN:{value:[1,1,2]},CODE_PATTERN:{value:[[3,2,1,1],[2,2,2,1],[2,1,2,2],[1,4,1,1],[1,1,3,2],[1,2,3,1],[1,1,1,4],[1,3,1,2],[1,2,1,3],[3,1,1,2],[1,1,2,3],[1,2,2,2],[2,2,1,2],[1,1,4,1],[2,3,1,1],[1,3,2,1],[4,1,1,1],[2,1,3,1],[3,1,2,1],[2,1,1,3]]},CODE_FREQUENCY:{value:[0,11,13,14,19,25,28,21,22,26]},SINGLE_CODE_ERROR:{value:.7},AVG_CODE_ERROR:{value:.48},FORMAT:{value:"ean_13",writeable:!1}};r.prototype=Object.create(c.a.prototype,u),r.prototype.constructor=r,r.prototype._decodeCode=function(e,t){var n,r,o,i=[0,0,0,0],a=this,c=e,s=!a._row[c],u=0,d={error:Number.MAX_VALUE,code:-1,start:e,end:e};for(t||(t=a.CODE_PATTERN.length),n=c;n<a._row.length;n++)if(a._row[n]^s)i[u]++;else{if(u===i.length-1){for(r=0;t>r;r++)o=a._matchPattern(i,a.CODE_PATTERN[r]),o<d.error&&(d.code=r,d.error=o);return d.end=n,d.error>a.AVG_CODE_ERROR?null:d}u++,i[u]=1,s=!s}return null},r.prototype._findPattern=function(e,t,n,r,o){var i,a,c,s,u=[],d=this,f=0,l={error:Number.MAX_VALUE,code:-1,start:0,end:0};for(t||(t=d._nextSet(d._row)),void 0===n&&(n=!1),void 0===r&&(r=!0),void 0===o&&(o=d.AVG_CODE_ERROR),i=0;i<e.length;i++)u[i]=0;for(i=t;i<d._row.length;i++)if(d._row[i]^n)u[f]++;else{if(f===u.length-1){for(s=0,c=0;c<u.length;c++)s+=u[c];if(a=d._matchPattern(u,e),o>a)return l.error=a,l.start=i-s,l.end=i,l;if(!r)return null;for(c=0;c<u.length-2;c++)u[c]=u[c+2];u[u.length-2]=0,u[u.length-1]=0,f--}else f++;u[f]=1,n=!n}return null},r.prototype._findStart=function(){for(var e,t,n=this,r=n._nextSet(n._row);!t;){if(t=n._findPattern(n.START_PATTERN,r),!t)return null;if(e=t.start-(t.end-t.start),e>=0&&n._matchRange(e,t.start,0))return t;r=t.end,t=null}},r.prototype._verifyTrailingWhitespace=function(e){var t,n=this;return t=e.end+(e.end-e.start),t<n._row.length&&n._matchRange(e.end,t,0)?e:null},r.prototype._findEnd=function(e,t){var n=this,r=n._findPattern(n.STOP_PATTERN,e,t,!1);return null!==r?n._verifyTrailingWhitespace(r):null},r.prototype._calculateFirstDigit=function(e){var t,n=this;for(t=0;t<n.CODE_FREQUENCY.length;t++)if(e===n.CODE_FREQUENCY[t])return t;return null},r.prototype._decodePayload=function(e,t,n){var r,o,i=this,a=0;for(r=0;6>r;r++){if(e=i._decodeCode(e.end),!e)return null;e.code>=i.CODE_G_START?(e.code=e.code-i.CODE_G_START,a|=1<<5-r):a|=0<<5-r,t.push(e.code),n.push(e)}if(o=i._calculateFirstDigit(a),null===o)return null;if(t.unshift(o),e=i._findPattern(i.MIDDLE_PATTERN,e.end,!0,!1),null===e)return null;for(n.push(e),r=0;6>r;r++){if(e=i._decodeCode(e.end,i.CODE_G_START),!e)return null;n.push(e),t.push(e.code)}return e},r.prototype._decode=function(){var e,t,n=this,r=[],o=[],i={};if(e=n._findStart(),!e)return null;if(t={code:e.code,start:e.start,end:e.end},o.push(t),t=n._decodePayload(t,r,o),!t)return null;if(t=n._findEnd(t.end,!1),!t)return null;if(o.push(t),!n._checksum(r))return null;if(this.supplements.length>0){var a=this._decodeExtensions(t.end);if(!a)return null;var c=a.decodedCodes[a.decodedCodes.length-1],u={start:c.start+((c.end-c.start)/2|0),end:c.end};if(!n._verifyTrailingWhitespace(u))return null;i={supplement:a,code:r.join("")+a.code}}return s({code:r.join(""),start:e.start,end:t.end,codeset:"",startInfo:e,decodedCodes:o},i)},r.prototype._decodeExtensions=function(e){var t,n,r=this._nextSet(this._row,e),o=this._findPattern(this.EXTENSION_START_PATTERN,r,!1,!1);if(null===o)return null;for(t=0;t<this.supplements.length;t++)if(n=this.supplements[t].decode(this._row,o.end),null!==n)return{code:n.code,start:r,startInfo:o,end:n.end,codeset:"",decodedCodes:n.decodedCodes};return null},r.prototype._checksum=function(e){var t,n=0;for(t=e.length-2;t>=0;t-=2)n+=e[t];for(n*=3,t=e.length-1;t>=0;t-=2)n+=e[t];return n%10===0},r.CONFIG_KEYS={supplements:{type:"arrayOf(string)","default":[],description:"Allowed extensions to be decoded (2 and/or 5)"}},t.a=r},function(e,t,n){var r=n(12),o=n(1),i=r(o,"Map");e.e=i},function(e,t,n){var r=Array.isArray;e.e=r},function(e,t,n){function r(e,t){return this._row=[],this.config=e||{},this.supplements=t,this}r.prototype._nextUnset=function(e,t){var n;for(void 0===t&&(t=0),n=t;n<e.length;n++)if(!e[n])return n;return e.length},r.prototype._matchPattern=function(e,t,n){var r,o,i,a,c=0,s=0,u=0,d=0;for(n=n||this.SINGLE_CODE_ERROR||1,r=0;r<e.length;r++)u+=e[r],d+=t[r];if(d>u)return Number.MAX_VALUE;for(o=u/d,n*=o,r=0;r<e.length;r++){if(i=e[r],a=t[r]*o,s=Math.abs(i-a)/a,s>n)return Number.MAX_VALUE;c+=s}return c/d},r.prototype._nextSet=function(e,t){var n;for(t=t||0,n=t;n<e.length;n++)if(e[n])return n;return e.length},r.prototype._correctBars=function(e,t,n){for(var r=n.length,o=0;r--;)o=e[n[r]]*(1-(1-t)/2),o>1&&(e[n[r]]=o)},r.prototype._matchTrace=function(e,t){var n,r,o=[],i=this,a=i._nextSet(i._row),c=!i._row[a],s=0,u={error:Number.MAX_VALUE,code:-1,start:0};if(e){for(n=0;n<e.length;n++)o.push(0);for(n=a;n<i._row.length;n++)if(i._row[n]^c)o[s]++;else{if(s===o.length-1)return r=i._matchPattern(o,e),t>r?(u.start=n-a,u.end=n,u.counter=o,u):null;s++,o[s]=1,c=!c}}else for(o.push(0),n=a;n<i._row.length;n++)i._row[n]^c?o[s]++:(s++,o.push(0),o[s]=1,c=!c);return u.start=a,u.end=i._row.length-1,u.counter=o,u},r.prototype.decodePattern=function(e){var t,n=this;return n._row=e,t=n._decode(),null===t?(n._row.reverse(),t=n._decode(),t&&(t.direction=r.DIRECTION.REVERSE,t.start=n._row.length-t.start,t.end=n._row.length-t.end)):t.direction=r.DIRECTION.FORWARD,t&&(t.format=n.FORMAT),t},r.prototype._matchRange=function(e,t,n){var r;for(e=0>e?0:e,r=e;t>r;r++)if(this._row[r]!==n)return!1;return!0},r.prototype._fillCounters=function(e,t,n){var r,o=this,i=0,a=[];for(n="undefined"!=typeof n?n:!0,e="undefined"!=typeof e?e:o._nextUnset(o._row),t=t||o._row.length,a[i]=0,r=e;t>r;r++)o._row[r]^n?a[i]++:(i++,a[i]=1,n=!n);return a},Object.defineProperty(r.prototype,"FORMAT",{value:"unknown",writeable:!1}),r.DIRECTION={FORWARD:1,REVERSE:-1},r.Exception={StartNotFoundException:"Start-Info was not found!",CodeNotFoundException:"Code could not be found!",PatternNotFoundException:"Pattern could not be found!"},r.CONFIG_KEYS={},t.a=r},function(e,t,n){function r(e){var t=new Float32Array(2);return t[0]=e[0],t[1]=e[1],t}e.e=r},function(e,t,n){function r(e){return!!e&&"object"==typeof e}e.e=r},function(e,t,n){t.a={init:function(e,t){for(var n=e.length;n--;)e[n]=t},shuffle:function(e){var t,n,r=e.length-1;for(r;r>=0;r--)t=Math.floor(Math.random()*r),n=e[r],e[r]=e[t],e[t]=n;return e},toPointList:function(e){var t,n,r=[],o=[];for(t=0;t<e.length;t++){for(r=[],n=0;n<e[t].length;n++)r[n]=e[t][n];o[t]="["+r.join(",")+"]"}return"["+o.join(",\r\n")+"]"},threshold:function(e,t,n){var r,o=[];for(r=0;r<e.length;r++)n.apply(e,[e[r]])>=t&&o.push(e[r]);return o},maxIndex:function(e){var t,n=0;for(t=0;t<e.length;t++)e[t]>e[n]&&(n=t);return n},max:function r(e){var t,r=0;for(t=0;t<e.length;t++)e[t]>r&&(r=e[t]);return r},sum:function o(e){for(var t=e.length,o=0;t--;)o+=e[t];return o}}},function(e,t,n){t.a={drawRect:function(e,t,n,r){n.strokeStyle=r.color,n.fillStyle=r.color,n.lineWidth=1,n.beginPath(),n.strokeRect(e.x,e.y,t.x,t.y)},drawPath:function(e,t,n,r){n.strokeStyle=r.color,n.fillStyle=r.color,n.lineWidth=r.lineWidth,n.beginPath(),n.moveTo(e[0][t.x],e[0][t.y]);for(var o=1;o<e.length;o++)n.lineTo(e[o][t.x],e[o][t.y]);n.closePath(),n.stroke()},drawImage:function(e,t,n){var r,o=n.getImageData(0,0,t.x,t.y),i=o.data,a=e.length,c=i.length;if(c/a!==4)return!1;for(;a--;)r=e[a],i[--c]=255,i[--c]=r,i[--c]=r,i[--c]=r;return n.putImageData(o,0,0),!0}}},function(e,t,n){function r(e,t){for(var n=e.length;n--;)if(o(e[n][0],t))return n;return-1}var o=n(15);e.e=r},function(e,t,n){function r(e,t){var n=e[t];return o(n)?n:void 0}var o=n(142);e.e=r},function(e,t,n){function r(e){var t=typeof e;return"number"==t||"boolean"==t||"string"==t&&"__proto__"!=e||null==e}e.e=r},function(e,t,n){var r=n(12),o=r(Object,"create");e.e=o},function(e,t,n){function r(e,t){return e===t||e!==e&&t!==t}e.e=r},function(e,t,n){function r(e){var t=o(e)?s.call(e):"";return t==i||t==a}var o=n(2),i="[object Function]",a="[object GeneratorFunction]",c=Object.prototype,s=c.toString;e.e=r},function(e,t,n){var r=n(101),o=n(115),i=o(function(e,t,n){r(e,t,n)});e.e=i},function(e,t,n){function r(e,t){var n={x:e,y:t,toVec2:function(){return w.clone([this.x,this.y])},toVec3:function(){return C.clone([this.x,this.y,1])},round:function(){return this.x=this.x>0?Math.floor(this.x+.5):Math.floor(this.x-.5),this.y=this.y>0?Math.floor(this.y+.5):Math.floor(this.y-.5),this}};return n}function o(e,t,n){n||(n=e);for(var r=e.data,o=r.length,i=n.data;o--;)i[o]=r[o]<t?1:0}function i(e,t){t||(t=8);for(var n=e.data,r=n.length,o=8-t,i=1<<t,a=new Int32Array(i);r--;)a[n[r]>>o]++;return a}function a(e,t){function n(e,t){var n,r=0;for(n=e;t>=n;n++)r+=a[n];return r}function r(e,t){var n,r=0;for(n=e;t>=n;n++)r+=n*a[n];return r}function o(){var o,c,s,u,d,f,l,p=[0],h=(1<<t)-1;for(a=i(e,t),u=1;h>u;u++)o=n(0,u),c=n(u+1,h),s=o*c,0===s&&(s=1),d=r(0,u)*c,f=r(u+1,h)*o,l=d-f,p[u]=l*l/s;return _.a.maxIndex(p)}t||(t=8);var a,c,s=8-t;return c=o(),c<<s}function c(e,t){var n=a(e);return o(e,n,t),n}function s(e,t,n){function r(e){var t=!1;for(i=0;i<s.length;i++)a=s[i],a.fits(e)&&(a.add(e),t=!0);return t}var o,i,a,c,s=[];for(n||(n="rad"),o=0;o<e.length;o++)c=b.a.createPoint(e[o],o,n),r(c)||s.push(b.a.create(c,t));return s}function u(e,t,n){var r,o,i,a,c=0,s=0,u=[];for(r=0;t>r;r++)u[r]={score:0,item:null};for(r=0;r<e.length;r++)if(o=n.apply(this,[e[r]]),o>s)for(i=u[c],i.score=o,i.item=e[r],s=Number.MAX_VALUE,a=0;t>a;a++)u[a].score<s&&(s=u[a].score,c=a);return u}function d(e,t,n){for(var r,o=0,i=t.x,a=Math.floor(e.length/4),c=t.x/2,s=0,u=t.x;a>i;){for(r=0;c>r;r++)n[s]=Math.floor((.299*e[4*o+0]+.587*e[4*o+1]+.114*e[4*o+2]+(.299*e[4*(o+1)+0]+.587*e[4*(o+1)+1]+.114*e[4*(o+1)+2])+(.299*e[4*i+0]+.587*e[4*i+1]+.114*e[4*i+2])+(.299*e[4*(i+1)+0]+.587*e[4*(i+1)+1]+.114*e[4*(i+1)+2]))/4),s++,o+=2,i+=2;o+=u,i+=u}}function f(e,t,n){var r,o=e.length/4|0,i=n&&n.singleChannel===!0;if(i)for(r=0;o>r;r++)t[r]=e[4*r+0];else for(r=0;o>r;r++)t[r]=Math.floor(.299*e[4*r+0]+.587*e[4*r+1]+.114*e[4*r+2])}function l(e,t){for(var n=e.data,r=e.size.x,o=t.data,i=0,a=r,c=n.length,s=r/2,u=0;c>a;){for(var d=0;s>d;d++)o[u]=Math.floor((n[i]+n[i+1]+n[a]+n[a+1])/4),u++,i+=2,a+=2;i+=r,a+=r}}function p(e,t){var n=e[0],r=e[1],o=e[2],i=o*r,a=i*(1-Math.abs(n/60%2-1)),c=o-i,s=0,u=0,d=0;return t=t||[0,0,0],60>n?(s=i,u=a):120>n?(s=a,u=i):180>n?(u=i,d=a):240>n?(u=a,d=i):300>n?(s=a,d=i):360>n&&(s=i,d=a),t[0]=255*(s+c)|0,t[1]=255*(u+c)|0,t[2]=255*(d+c)|0,t}function h(e){var t,n=[],r=[];for(t=1;t<Math.sqrt(e)+1;t++)e%t===0&&(r.push(t),t!==e/t&&n.unshift(Math.floor(e/t)));return r.concat(n)}function v(e,t){for(var n=0,r=0,o=[];n<e.length&&r<t.length;)e[n]===t[r]?(o.push(e[n]),n++,r++):e[n]>t[r]?r++:n++;return o}function m(e,t){function n(e){for(var t=0,n=e[Math.floor(e.length/2)];t<e.length-1&&e[t]<l;)t++;return t>0&&(n=Math.abs(e[t]-l)>Math.abs(e[t-1]-l)?e[t-1]:e[t]),l/n<s[d+1]/s[d]&&l/n>s[d-1]/s[d]?{x:n,y:n}:null}var r,o=h(t.x),i=h(t.y),a=Math.max(t.x,t.y),c=v(o,i),s=[8,10,15,20,32,60,80],u={"x-small":5,small:4,medium:3,large:2,"x-large":1},d=u[e]||u.medium,f=s[d],l=Math.floor(a/f);return r=n(c),r||(r=n(h(a)),r||(r=n(h(l*f)))),r}function g(e){var t={value:parseFloat(e),unit:(e.indexOf("%")===e.length-1,"%")};return t}function y(e,t,n){var r={width:e,height:t},o=Object.keys(n).reduce(function(e,t){var o=n[t],i=g(o),a=E[t](i,r);return e[t]=a,e},{});return{sx:o.left,sy:o.top,sw:o.right-o.left,sh:o.bottom-o.top}}var b=n(51),_=n(9);t.f=r,t.c=c,t.d=s,t.e=u,t.i=d,t.j=f,t.g=l,t.a=p,t.b=m,t.h=y;var w={clone:n(7)},C={clone:n(80)},E={top:function(e,t){return"%"===e.unit?Math.floor(t.height*(e.value/100)):void 0},right:function(e,t){return"%"===e.unit?Math.floor(t.width-t.width*(e.value/100)):void 0},bottom:function(e,t){return"%"===e.unit?Math.floor(t.height-t.height*(e.value/100)):void 0},left:function(e,t){return"%"===e.unit?Math.floor(t.width*(e.value/100)):void 0}}},function(e,t,n){function r(e,t,n,r){t?this.data=t:n?(this.data=new n(e.x*e.y),n===Array&&r&&a.a.init(this.data,0)):(this.data=new Uint8Array(e.x*e.y),Uint8Array===Array&&r&&a.a.init(this.data,0)),this.size=e}var o=n(53),i=n(18),a=n(9),c={clone:n(7)};r.prototype.inImageWithBorder=function(e,t){return e.x>=t&&e.y>=t&&e.x<this.size.x-t&&e.y<this.size.y-t},r.sample=function(e,t,n){var r=Math.floor(t),o=Math.floor(n),i=e.size.x,a=o*e.size.x+r,c=e.data[a+0],s=e.data[a+1],u=e.data[a+i],d=e.data[a+i+1],f=c-s;t-=r,n-=o;var l=Math.floor(t*(n*(f-u+d)-f)+n*(u-c)+c);return l},r.clearArray=function(e){for(var t=e.length;t--;)e[t]=0},r.prototype.subImage=function(e,t){return new o.a(e,t,this)},r.prototype.subImageAsCopy=function(e,t){var n,r,o=e.size.y,i=e.size.x;for(n=0;i>n;n++)for(r=0;o>r;r++)e.data[r*i+n]=this.data[(t.y+r)*this.size.x+t.x+n]},r.prototype.copyTo=function(e){for(var t=this.data.length,n=this.data,r=e.data;t--;)r[t]=n[t]},r.prototype.get=function(e,t){return this.data[t*this.size.x+e]},r.prototype.getSafe=function(e,t){var n;if(!this.indexMapping){for(this.indexMapping={x:[],y:[]},n=0;n<this.size.x;n++)this.indexMapping.x[n]=n,this.indexMapping.x[n+this.size.x]=n;for(n=0;n<this.size.y;n++)this.indexMapping.y[n]=n,this.indexMapping.y[n+this.size.y]=n}return this.data[this.indexMapping.y[t+this.size.y]*this.size.x+this.indexMapping.x[e+this.size.x]]},r.prototype.set=function(e,t,n){return this.data[t*this.size.x+e]=n,this},r.prototype.zeroBorder=function(){var e,t=this.size.x,n=this.size.y,r=this.data;for(e=0;t>e;e++)r[e]=r[(n-1)*t+e]=0;for(e=1;n-1>e;e++)r[e*t]=r[e*t+(t-1)]=0},r.prototype.invert=function(){for(var e=this.data,t=e.length;t--;)e[t]=e[t]?0:1},r.prototype.convolve=function(e){var t,n,r,o,i=e.length/2|0,a=0;for(n=0;n<this.size.y;n++)for(t=0;t<this.size.x;t++){for(a=0,o=-i;i>=o;o++)for(r=-i;i>=r;r++)a+=e[o+i][r+i]*this.getSafe(t+r,n+o);this.data[n*this.size.x+t]=a}},r.prototype.moments=function(e){var t,n,r,o,i,a,s,u,d,f,l,p,h=this.data,v=this.size.y,m=this.size.x,g=[],y=[],b=Math.PI,_=b/4;if(0>=e)return y;for(i=0;e>i;i++)g[i]={m00:0,m01:0,m10:0,m11:0,m02:0,m20:0,theta:0,rad:0};for(n=0;v>n;n++)for(o=n*n,t=0;m>t;t++)r=h[n*m+t],r>0&&(a=g[r-1],a.m00+=1,a.m01+=n,a.m10+=t,a.m11+=t*n,a.m02+=o,a.m20+=t*t);for(i=0;e>i;i++)a=g[i],isNaN(a.m00)||0===a.m00||(f=a.m10/a.m00,l=a.m01/a.m00,s=a.m11/a.m00-f*l,u=a.m02/a.m00-l*l,d=a.m20/a.m00-f*f,p=(u-d)/(2*s),p=.5*Math.atan(p)+(s>=0?_:-_)+b,a.theta=(180*p/b+90)%180-90,a.theta<0&&(a.theta+=180),a.rad=p>b?p-b:p,a.vec=c.clone([Math.cos(p),Math.sin(p)]),y.push(a));return y},r.prototype.show=function(e,t){var n,r,o,i,a,c,s;for(t||(t=1),n=e.getContext("2d"),e.width=this.size.x,e.height=this.size.y,r=n.getImageData(0,0,e.width,e.height),o=r.data,i=0,s=0;s<this.size.y;s++)for(c=0;c<this.size.x;c++)a=s*this.size.x+c,i=this.get(c,s)*t,o[4*a+0]=i,o[4*a+1]=i,o[4*a+2]=i,o[4*a+3]=255;n.putImageData(r,0,0)},r.prototype.overlay=function(e,t,n){(!t||0>t||t>360)&&(t=360);for(var r=[0,1,1],o=[0,0,0],a=[255,255,255],c=[0,0,0],s=[],u=e.getContext("2d"),d=u.getImageData(n.x,n.y,this.size.x,this.size.y),f=d.data,l=this.data.length;l--;)r[0]=this.data[l]*t,s=r[0]<=0?a:r[0]>=360?c:i.a.bind()(r,o),f[4*l+0]=s[0],f[4*l+1]=s[1],f[4*l+2]=s[2],f[4*l+3]=255;u.putImageData(d,n.x,n.y)},t.a=r},function(e,t,n){function r(e,t,n,r){var o=-1,i=e.length;for(r&&i&&(n=e[++o]);++o<i;)n=t(n,e[o],o,e);return n}e.e=r},function(e,t,n){function r(e,t,n){return o(e,t,n)}var o=n(113);e.e=r},function(e,t,n){function r(e){var t=!1;if(null!=e&&"function"!=typeof e.toString)try{t=!!(e+"")}catch(n){}return t}e.e=r},function(e,t,n){function r(e,t){return e="number"==typeof e||i.test(e)?+e:-1,t=null==t?o:t,e>-1&&e%1==0&&t>e}var o=9007199254740991,i=/^(?:0|[1-9]\d*)$/;e.e=r},function(e,t,n){function r(e){var t=e&&e.constructor,n="function"==typeof t&&t.prototype||o;return e===n}var o=Object.prototype;e.e=r},function(e,t,n){function r(e){return o(e)&&c.call(e,"callee")&&(!u.call(e,"callee")||s.call(e)==i)}var o=n(27),i="[object Arguments]",a=Object.prototype,c=a.hasOwnProperty,s=a.toString,u=a.propertyIsEnumerable;e.e=r},function(e,t,n){function r(e){return null!=e&&a(o(e))&&!i(e)}var o=n(117),i=n(16),a=n(28);e.e=r},function(e,t,n){function r(e){return i(e)&&o(e)}var o=n(26),i=n(8);e.e=r},function(e,t,n){function r(e){return"number"==typeof e&&e>-1&&e%1==0&&o>=e}var o=9007199254740991;e.e=r},function(e,t,n){var r={searchDirections:[[0,1],[1,1],[1,0],[1,-1],[0,-1],[-1,-1],[-1,0],[-1,1]],create:function(e,t){function n(e,t,n,r){var o,d,f;for(o=0;7>o;o++){if(d=e.cy+s[e.dir][0],f=e.cx+s[e.dir][1],i=d*u+f,a[i]===t&&(0===c[i]||c[i]===n))return c[i]=n,e.cy=d,e.cx=f,!0;0===c[i]&&(c[i]=r),e.dir=(e.dir+1)%8}return!1}function r(e,t,n){return{dir:n,x:e,y:t,next:null,prev:null}}function o(e,t,o,i,a){var c,s,u,d=null,f={cx:t,cy:e,dir:0};if(n(f,i,o,a)){d=r(t,e,f.dir),c=d,u=f.dir,s=r(f.cx,f.cy,0),s.prev=c,c.next=s,s.next=null,c=s;do f.dir=(f.dir+6)%8,n(f,i,o,a),u!==f.dir?(c.dir=f.dir,s=r(f.cx,f.cy,0),s.prev=c,c.next=s,s.next=null,c=s):(c.dir=u,c.x=f.cx,c.y=f.cy),u=f.dir;while(f.cx!==t||f.cy!==e);d.prev=c.prev,c.prev.next=d}return d}var i,a=e.data,c=t.data,s=this.searchDirections,u=e.size.x;return{trace:function(e,t,r,o){return n(e,t,r,o)},contourTracing:function(e,t,n,r,i){return o(e,t,n,r,i)}}}};t.a=r},function(e,t,n){function r(){o.a.call(this)}var o=n(6),i=n(9),a={ALPHABETH_STRING:{value:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-. *$/+%"},ALPHABET:{value:[48,49,50,51,52,53,54,55,56,57,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,45,46,32,42,36,47,43,37]},CHARACTER_ENCODINGS:{value:[52,289,97,352,49,304,112,37,292,100,265,73,328,25,280,88,13,268,76,28,259,67,322,19,274,82,7,262,70,22,385,193,448,145,400,208,133,388,196,148,168,162,138,42]},ASTERISK:{value:148},FORMAT:{value:"code_39",writeable:!1}};r.prototype=Object.create(o.a.prototype,a),r.prototype.constructor=r,r.prototype._toCounters=function(e,t){var n,r=this,o=t.length,a=r._row.length,c=!r._row[e],s=0;for(i.a.init(t,0),n=e;a>n;n++)if(r._row[n]^c)t[s]++;else{if(s++,s===o)break;t[s]=1,c=!c}return t},r.prototype._decode=function(){var e,t,n,r,o=this,a=[0,0,0,0,0,0,0,0,0],c=[],s=o._findStart();if(!s)return null;r=o._nextSet(o._row,s.end);do{if(a=o._toCounters(r,a),n=o._toPattern(a),0>n)return null;if(e=o._patternToChar(n),0>e)return null;c.push(e),t=r,r+=i.a.sum(a),r=o._nextSet(o._row,r)}while("*"!==e);return c.pop(),c.length&&o._verifyTrailingWhitespace(t,r,a)?{code:c.join(""),start:s.start,end:r,startInfo:s,decodedCodes:c}:null},r.prototype._verifyTrailingWhitespace=function(e,t,n){var r,o=i.a.sum(n);return r=t-e-o,3*r>=o},r.prototype._patternToChar=function(e){var t,n=this;for(t=0;t<n.CHARACTER_ENCODINGS.length;t++)if(n.CHARACTER_ENCODINGS[t]===e)return String.fromCharCode(n.ALPHABET[t]);return-1},r.prototype._findNextWidth=function(e,t){var n,r=Number.MAX_VALUE;for(n=0;n<e.length;n++)e[n]<r&&e[n]>t&&(r=e[n]);return r},r.prototype._toPattern=function(e){for(var t,n,r=e.length,o=0,i=r,a=0,c=this;i>3;){for(o=c._findNextWidth(e,o),i=0,t=0,n=0;r>n;n++)e[n]>o&&(t|=1<<r-1-n,i++,a+=e[n]);if(3===i){for(n=0;r>n&&i>0;n++)if(e[n]>o&&(i--,2*e[n]>=a))return-1;return t}}return-1},r.prototype._findStart=function(){var e,t,n,r=this,o=r._nextSet(r._row),i=o,a=[0,0,0,0,0,0,0,0,0],c=0,s=!1;for(e=o;e<r._row.length;e++)if(r._row[e]^s)a[c]++;else{if(c===a.length-1){if(r._toPattern(a)===r.ASTERISK&&(n=Math.floor(Math.max(0,i-(e-i)/4)),r._matchRange(n,i,0)))return{start:i,end:e};for(i+=a[0]+a[1],t=0;7>t;t++)a[t]=a[t+2];a[7]=0,a[8]=0,c--}else c++;a[c]=1,s=!s}return null},t.a=r},function(e,t,n){function r(e,t){return e[0]*t[0]+e[1]*t[1]}e.e=r},function(e,t,n){function r(e){var t=-1,n=e?e.length:0;for(this.clear();++t<n;){var r=e[t];this.set(r[0],r[1])}}var o=n(135),i=n(136),a=n(137),c=n(138),s=n(139);r.prototype.clear=o,r.prototype["delete"]=i,r.prototype.get=a,r.prototype.has=c,r.prototype.set=s,e.e=r},function(e,t,n){function r(e,t){for(var n=-1,r=e.length;++n<r&&t(e[n],n,e)!==!1;);return e}e.e=r},function(e,t,n){function r(e,t,n){(void 0===n||o(e[t],n))&&("number"!=typeof t||void 0!==n||t in e)||(e[t]=n)}var o=n(15);e.e=r},function(e,t,n){function r(e,t,n){var r=e[t];a.call(e,t)&&o(r,n)&&(void 0!==n||t in e)||(e[t]=n)}var o=n(15),i=Object.prototype,a=i.hasOwnProperty;e.e=r},function(e,t,n){function r(e,t){var n=o(e,t);if(0>n)return!1;var r=e.length-1;return n==r?e.pop():a.call(e,n,1),!0}var o=n(11),i=Array.prototype,a=i.splice;e.e=r},function(e,t,n){function r(e,t){var n=o(e,t);return 0>n?void 0:e[n][1]}var o=n(11);e.e=r},function(e,t,n){function r(e,t){return o(e,t)>-1}var o=n(11);e.e=r},function(e,t,n){function r(e,t,n){var r=o(e,t);0>r?e.push([t,n]):e[r][1]=n}var o=n(11);e.e=r},function(e,t,n){function r(e){var t=new e.constructor(e.byteLength);return new o(t).set(new o(e)),t}var o=n(86);e.e=r},function(e,t,n){function r(e,t){var n=-1,r=e.length;for(t||(t=Array(r));++n<r;)t[n]=e[n];return t}e.e=r},function(e,t,n){function r(e,t){return o?void 0!==e[t]:a.call(e,t)}var o=n(14),i=Object.prototype,a=i.hasOwnProperty;e.e=r},function(e,t,n){function r(e){var t=e?e.length:void 0;return c(t)&&(a(e)||s(e)||i(e))?o(t,String):null}var o=n(105),i=n(25),a=n(5),c=n(28),s=n(144);e.e=r},function(e,t,n){function r(e){return i(e)&&o(e.length)&&!!D[A.call(e)]}var o=n(28),i=n(8),a="[object Arguments]",c="[object Array]",s="[object Boolean]",u="[object Date]",d="[object Error]",f="[object Function]",l="[object Map]",p="[object Number]",h="[object Object]",v="[object RegExp]",m="[object Set]",g="[object String]",y="[object WeakMap]",b="[object ArrayBuffer]",_="[object Float32Array]",w="[object Float64Array]",C="[object Int8Array]",E="[object Int16Array]",T="[object Int32Array]",R="[object Uint8Array]",S="[object Uint8ClampedArray]",O="[object Uint16Array]",x="[object Uint32Array]",D={};D[_]=D[w]=D[C]=D[E]=D[T]=D[R]=D[S]=D[O]=D[x]=!0,D[a]=D[c]=D[b]=D[s]=D[u]=D[d]=D[f]=D[l]=D[p]=D[h]=D[v]=D[m]=D[g]=D[y]=!1;var P=Object.prototype,A=P.toString;e.e=r},function(e,t,n){function r(e){var t=u(e);if(!t&&!c(e))return i(e);var n=a(e),r=!!n,d=n||[],f=d.length;for(var l in e)!o(e,l)||r&&("length"==l||s(l,f))||t&&"constructor"==l||d.push(l);return d}var o=n(98),i=n(99),a=n(43),c=n(26),s=n(23),u=n(24);e.e=r},function(e,t,n){function r(e){for(var t=-1,n=c(e),r=o(e),s=r.length,d=i(e),f=!!d,l=d||[],p=l.length;++t<s;){var h=r[t];f&&("length"==h||a(h,p))||"constructor"==h&&(n||!u.call(e,h))||l.push(h)}return l}var o=n(100),i=n(43),a=n(23),c=n(24),s=Object.prototype,u=s.hasOwnProperty;e.e=r},function(e,t,n){function r(e,t){if("function"!=typeof e)throw new TypeError(a);return t=c(void 0===t?e.length-1:i(t),0),function(){for(var n=arguments,r=-1,i=c(n.length-t,0),a=Array(i);++r<i;)a[r]=n[t+r];switch(t){case 0:return e.call(this,a);case 1:return e.call(this,n[0],a);case 2:return e.call(this,n[0],n[1],a)}var s=Array(t+1);for(r=-1;++r<t;)s[r]=n[r];return s[t]=a,o(e,this,s)}}var o=n(90),i=n(146),a="Expected a function",c=Math.max;e.e=r},function(e,t,n){e.e=function(e){return e.webpackPolyfill||(e.deprecate=function(){},e.paths=[],e.children=[],Object.defineProperty(e,"exports",{enumerable:!0,configurable:!1,get:function(){return e.e},set:function(t){return e.e=t}}),Object.defineProperty(e,"loaded",{enumerable:!0,configurable:!1,get:function(){return e.l}}),Object.defineProperty(e,"id",{enumerable:!0,configurable:!1,get:function(){return e.i}}),e.webpackPolyfill=1),e}},function(t,n,r){function o(e){d(e),L=G.a.create(ee.decoder,k)}function i(e){var t;if("VideoStream"===ee.inputStream.type)t=document.createElement("video"),M=X.a.createVideoStream(t);else if("ImageStream"===ee.inputStream.type)M=X.a.createImageStream();else if("LiveStream"===ee.inputStream.type){var n=a();n&&(t=n.querySelector("video"),t||(t=document.createElement("video"),n.appendChild(t))),M=X.a.createLiveStream(t),W.a.request(t,ee.inputStream.constraints).then(function(){M.trigger("canrecord")})["catch"](function(t){return e(t)})}M.setAttribute("preload","auto"),M.setInputStream(ee.inputStream),M.addEventListener("canrecord",c.bind(void 0,e))}function a(){var e=ee.inputStream.target;if(e&&e.nodeName&&1===e.nodeType)return e;var t="string"==typeof e?e:"#interactive.viewport";return document.querySelector(t)}function c(e){F.a.checkImageConstraints(M,ee.locator),u(ee),j=J.a.create(M,Q.dom.image),R(ee.numOfWorkers,function(){0===ee.numOfWorkers&&o(),s(e)})}function s(e){M.play(),e()}function u(){if("undefined"!=typeof document){var e=a();if(Q.dom.image=document.querySelector("canvas.imgBuffer"),Q.dom.image||(Q.dom.image=document.createElement("canvas"),Q.dom.image.className="imgBuffer",e&&"ImageStream"===ee.inputStream.type&&e.appendChild(Q.dom.image)),Q.ctx.image=Q.dom.image.getContext("2d"),Q.dom.image.width=M.getCanvasSize().x,Q.dom.image.height=M.getCanvasSize().y,Q.dom.overlay=document.querySelector("canvas.drawingBuffer"),!Q.dom.overlay){Q.dom.overlay=document.createElement("canvas"),Q.dom.overlay.className="drawingBuffer",e&&e.appendChild(Q.dom.overlay);var t=document.createElement("br");t.setAttribute("clear","all"),e&&e.appendChild(t)}Q.ctx.overlay=Q.dom.overlay.getContext("2d"),Q.dom.overlay.width=M.getCanvasSize().x,Q.dom.overlay.height=M.getCanvasSize().y}}function d(e){k=e?e:new U.a({x:M.getWidth(),y:M.getHeight()}),N=[$.clone([0,0]),$.clone([0,k.size.y]),$.clone([k.size.x,k.size.y]),$.clone([k.size.x,0])],F.a.init(k,ee.locator)}function f(){return ee.locate?F.a.locate():[[$.clone(N[0]),$.clone(N[1]),$.clone(N[2]),$.clone(N[3])]]}function l(e){function t(e){for(var t=e.length;t--;)e[t][0]+=i,e[t][1]+=a}function n(e){e[0].x+=i,e[0].y+=a,e[1].x+=i,e[1].y+=a}var r,o=M.getTopRight(),i=o.x,a=o.y;if(0!==i||0!==a){if(e.barcodes)for(r=0;r<e.barcodes.length;r++)l(e.barcodes[r]);if(e.line&&2===e.line.length&&n(e.line),e.box&&t(e.box),e.boxes&&e.boxes.length>0)for(r=0;r<e.boxes.length;r++)t(e.boxes[r])}}function p(e,t){t&&z&&(e.barcodes?e.barcodes.filter(function(e){return e.codeResult}).forEach(function(e){return p(e,t)}):e.codeResult&&z.addResult(t,M.getCanvasSize(),e.codeResult))}function h(e){return e&&(e.barcodes?e.barcodes.some(function(e){return e.codeResult}):e.codeResult)}function v(e,t){var n=e;e&&Z&&(l(e),p(e,t),n=e.barcodes||e),B.a.publish("processed",n),h(e)&&B.a.publish("detected",n)}function m(){var e,t;t=f(),t?(e=L.decodeFromBoundingBoxes(t),e=e||{},e.boxes=t,v(e,k.data)):v()}function g(){var e;if(Z){if(K.length>0){if(e=K.filter(function(e){return!e.busy})[0],!e)return;j.attachData(e.imageData)}else j.attachData(k.data);j.grab()&&(e?(e.busy=!0,e.worker.postMessage({cmd:"process",imageData:e.imageData},[e.imageData.buffer])):m())}else m()}function y(){var e=null,t=1e3/(ee.frequency||60);I=!1,function n(r){e=e||r,I||(r>=e&&(e+=t,g()),window.requestAnimFrame(n))}(performance.now())}function b(){Z&&"LiveStream"===ee.inputStream.type?y():g()}function _(e){var t,n={worker:void 0,imageData:new Uint8Array(M.getWidth()*M.getHeight()),busy:!0};t=E(),n.worker=new Worker(t),n.worker.onmessage=function(r){return"initialized"===r.data.event?(URL.revokeObjectURL(t),n.busy=!1,n.imageData=new Uint8Array(r.data.imageData),e(n)):void("processed"===r.data.event?(n.imageData=new Uint8Array(r.data.imageData),n.busy=!1,v(r.data.result,n.imageData)):"error"===r.data.event)},n.worker.postMessage({cmd:"init",size:{x:M.getWidth(),y:M.getHeight()},imageData:n.imageData,config:w(ee)},[n.imageData.buffer])}function w(e){return Y({},e,{inputStream:Y({},e.inputStream,{target:null})})}function C(e){function t(e){self.postMessage({event:"processed",imageData:o.data,result:e},[o.data.buffer])}function n(){self.postMessage({event:"initialized",imageData:o.data},[o.data.buffer])}if(e){var r=e()["default"];if(!r)return void self.postMessage({event:"error",message:"Quagga could not be created"})}var o;self.onmessage=function(e){if("init"===e.data.cmd){var i=e.data.config;i.numOfWorkers=0,o=new r.ImageWrapper({x:e.data.size.x,y:e.data.size.y},new Uint8Array(e.data.imageData)),r.init(i,n,o),r.onProcessed(t)}else"process"===e.data.cmd?(o.data=new Uint8Array(e.data.imageData),r.start()):"setReaders"===e.data.cmd&&r.setReaders(e.data.readers)}}function E(){var t,n;return"undefined"!=typeof e&&(n=e),t=new Blob(["("+C.toString()+")("+n+");"],{type:"text/javascript"}),window.URL.createObjectURL(t)}function T(e){L?L.setReaders(e):Z&&K.length>0&&K.forEach(function(t){t.worker.postMessage({cmd:"setReaders",readers:e})})}function R(e,t){var n=e-K.length;if(0===n)return t&&t();if(0>n){var r=K.slice(n);return r.forEach(function(e){e.worker.terminate()}),K=K.slice(0,n),t&&t()}for(var o=function(n){K.push(n),K.length>=e&&t&&t()},i=0;n>i;i++)_(o)}var S=r(17),O=S&&S.__esModule?function(){return S["default"]}:function(){return S};Object.defineProperty(O,"a",{get:O});var x=r(54),D=x&&x.__esModule?function(){return x["default"]}:function(){return x};Object.defineProperty(D,"a",{get:D});var P=r(150),A=P&&P.__esModule?function(){
	return P["default"]}:function(){return P};Object.defineProperty(A,"a",{get:A});var M,j,I,k,N,L,z,U=r(19),F=r(63),G=r(57),B=r(52),W=r(59),V=r(10),H=r(50),q=r(55),X=r(62),J=r(60),Y=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},$={clone:r(7)},Q={ctx:{image:null,overlay:null},dom:{image:null,overlay:null}},K=[],Z=!0,ee={};n["default"]={init:function(e,t,n){return ee=O.a.bind()({},q.a,e),n?(Z=!1,o(n),t()):void i(t)},start:function(){b()},stop:function(){I=!0,R(0),"LiveStream"===ee.inputStream.type&&(W.a.release(),M.clearEventHandlers())},pause:function(){I=!0},onDetected:function(e){B.a.subscribe("detected",e)},offDetected:function(e){B.a.unsubscribe("detected",e)},onProcessed:function(e){B.a.subscribe("processed",e)},offProcessed:function(e){B.a.unsubscribe("processed",e)},setReaders:function(e){T(e)},registerResultCollector:function(e){e&&"function"==typeof e.addResult&&(z=e)},canvas:Q,decodeSingle:function(e,t){var n=this;e=O.a.bind()({inputStream:{type:"ImageStream",sequence:!1,size:800,src:e.src},numOfWorkers:1,locator:{halfSample:!1}},e),this.init(e,function(){B.a.once("processed",function(e){n.stop(),t.call(null,e)},!0),b()})},ImageWrapper:U.a,ImageDebug:V.a,ResultCollector:H.a}},function(e,t,n){function r(e,t){return t?t.some(function(t){return Object.keys(t).every(function(n){return t[n]===e[n]})}):!1}function o(e,t){return"function"==typeof t?t(e):!0}var i=n(10);t.a={create:function(e){function t(t){return s&&t&&!r(t,e.blacklist)&&o(t,e.filter)}var n=document.createElement("canvas"),a=n.getContext("2d"),c=[],s=e.capacity||20,u=e.capture===!0;return{addResult:function(e,r,o){var d={};t(o)&&(s--,d.codeResult=o,u&&(n.width=r.x,n.height=r.y,i.a.drawImage(e,r,a),d.frame=n.toDataURL()),c.push(d))},getResults:function(){return c}}}}},function(e,t,n){var r={clone:n(7),dot:n(31)};t.a={create:function(e,t){function n(){o(e),i()}function o(e){s[e.id]=e,a.push(e)}function i(){var e,t=0;for(e=0;e<a.length;e++)t+=a[e].rad;c.rad=t/a.length,c.vec=r.clone([Math.cos(c.rad),Math.sin(c.rad)])}var a=[],c={rad:0,vec:r.clone([0,0])},s={};return n(),{add:function(e){s[e.id]||(o(e),i())},fits:function(e){var n=Math.abs(r.dot(e.point.vec,c.vec));return n>t},getPoints:function(){return a},getCenter:function(){return c}}},createPoint:function(e,t,n){return{rad:e[n],point:e,id:t}}}},function(e,t,n){t.a=function(){function e(e){return o[e]||(o[e]={subscribers:[]}),o[e]}function t(){o={}}function n(e,t){e.async?setTimeout(function(){e.callback(t)},4):e.callback(t)}function r(t,n,r){var o;if("function"==typeof n)o={callback:n,async:r};else if(o=n,!o.callback)throw"Callback was not specified on options";e(t).subscribers.push(o)}var o={};return{subscribe:function(e,t,n){return r(e,t,n)},publish:function(t,r){var o=e(t),i=o.subscribers;i.filter(function(e){return!!e.once}).forEach(function(e){n(e,r)}),o.subscribers=i.filter(function(e){return!e.once}),o.subscribers.forEach(function(e){n(e,r)})},once:function(e,t,n){r(e,{callback:t,async:n,once:!0})},unsubscribe:function(n,r){var o;n?(o=e(n),o&&r?o.subscribers=o.subscribers.filter(function(e){return e.callback!==r}):o.subscribers=[]):t()}}}()},function(e,t,n){function r(e,t,n){n||(n={data:null,size:t}),this.data=n.data,this.originalSize=n.size,this.I=n,this.from=e,this.size=t}r.prototype.show=function(e,t){var n,r,o,i,a,c,s;for(t||(t=1),n=e.getContext("2d"),e.width=this.size.x,e.height=this.size.y,r=n.getImageData(0,0,e.width,e.height),o=r.data,i=0,a=0;a<this.size.y;a++)for(c=0;c<this.size.x;c++)s=a*this.size.x+c,i=this.get(c,a)*t,o[4*s+0]=i,o[4*s+1]=i,o[4*s+2]=i,o[4*s+3]=255;r.data=o,n.putImageData(r,0,0)},r.prototype.get=function(e,t){return this.data[(this.from.y+t)*this.originalSize.x+this.from.x+e]},r.prototype.updateData=function(e){this.originalSize=e.size,this.data=e.data},r.prototype.updateFrom=function(e){return this.from=e,this},t.a=r},function(e,t){"undefined"!=typeof window&&(window.requestAnimFrame=function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(e){window.setTimeout(e,1e3/60)}}()),Math.imul=Math.imul||function(e,t){var n=e>>>16&65535,r=65535&e,o=t>>>16&65535,i=65535&t;return r*i+(n*i+r*o<<16>>>0)|0}},function(e,t,n){var r=void 0;r=n(56),t.a=r},function(e,t,n){e.e={inputStream:{name:"Live",type:"LiveStream",constraints:{width:640,height:480,facingMode:"environment"},area:{top:"0%",right:"0%",left:"0%",bottom:"0%"},singleChannel:!1},locate:!0,numOfWorkers:4,decoder:{readers:["code_128_reader"]},locator:{halfSample:!0,patchSize:"medium"}}},function(e,t,n){var r=n(58),o=(n(10),n(67)),i=n(3),a=n(30),c=n(68),s=n(66),u=n(74),d=n(71),f=n(69),l=n(70),p=n(73),h=n(72),v="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol?"symbol":typeof e},m={code_128_reader:o.a,ean_reader:i.a,ean_5_reader:l.a,ean_2_reader:f.a,ean_8_reader:d.a,code_39_reader:a.a,code_39_vin_reader:c.a,codabar_reader:s.a,upc_reader:u.a,upc_e_reader:p.a,i2of5_reader:h.a};t.a={create:function(e,t){function n(){}function o(){e.readers.forEach(function(e){var t,n={},r=[];"object"===("undefined"==typeof e?"undefined":v(e))?(t=e.format,n=e.config):"string"==typeof e&&(t=e),n.supplements&&(r=n.supplements.map(function(e){return new m[e]})),p.push(new m[t](n,r))})}function i(){}function a(e,n,r){function o(t){var r={y:t*Math.sin(n),x:t*Math.cos(n)};e[0].y-=r.y,e[0].x-=r.x,e[1].y+=r.y,e[1].x+=r.x}for(o(r);r>1&&(!t.inImageWithBorder(e[0],0)||!t.inImageWithBorder(e[1],0));)r-=Math.ceil(r/2),o(-r);return e}function c(e){return[{x:(e[1][0]-e[0][0])/2+e[0][0],y:(e[1][1]-e[0][1])/2+e[0][1]},{x:(e[3][0]-e[2][0])/2+e[2][0],y:(e[3][1]-e[2][1])/2+e[2][1]}]}function s(e){var n,o=null,i=r.a.getBarcodeLine(t,e[0],e[1]);for(r.a.toBinaryLine(i),n=0;n<p.length&&null===o;n++)o=p[n].decodePattern(i.line);return null===o?null:{codeResult:o,barcodeLine:i}}function u(e,t,n){var r,o,i,a=Math.sqrt(Math.pow(e[1][0]-e[0][0],2)+Math.pow(e[1][1]-e[0][1],2)),c=16,u=null,d=Math.sin(n),f=Math.cos(n);for(r=1;c>r&&null===u;r++)o=a/c*r*(r%2===0?-1:1),i={y:o*d,x:o*f},t[0].y+=i.x,t[0].x-=i.y,t[1].y+=i.x,t[1].x-=i.y,u=s(t);return u}function d(e){return Math.sqrt(Math.pow(Math.abs(e[1].y-e[0].y),2)+Math.pow(Math.abs(e[1].x-e[0].x),2))}function f(e){var t,n,r,o;l.ctx.overlay;return t=c(e),o=d(t),n=Math.atan2(t[1].y-t[0].y,t[1].x-t[0].x),t=a(t,n,Math.floor(.1*o)),null===t?null:(r=s(t),null===r&&(r=u(e,t,n)),null===r?null:{codeResult:r.codeResult,line:t,angle:n,pattern:r.barcodeLine.line,threshold:r.barcodeLine.threshold})}var l={ctx:{frequency:null,pattern:null,overlay:null},dom:{frequency:null,pattern:null,overlay:null}},p=[];return n(),o(),i(),{decodeFromBoundingBox:function(e){return f(e)},decodeFromBoundingBoxes:function(t){var n,r,o=[],i=e.multiple;for(n=0;n<t.length;n++){var a=t[n];if(r=f(a)||{},r.box=a,i)o.push(r);else if(r.codeResult)return r}return i?{barcodes:o}:void 0},setReaders:function(t){e.readers=t,p.length=0,o()}}}}},function(e,t,n){var r=(n(19),{}),o={DIR:{UP:1,DOWN:-1}};r.getBarcodeLine=function(e,t,n){function r(e,t){f=y[t*b+e],_+=f,w=w>f?f:w,C=f>C?f:C,g.push(f)}var o,i,a,c,s,u,d,f,l=0|t.x,p=0|t.y,h=0|n.x,v=0|n.y,m=Math.abs(v-p)>Math.abs(h-l),g=[],y=e.data,b=e.size.x,_=0,w=255,C=0;for(m&&(u=l,l=p,p=u,u=h,h=v,v=u),l>h&&(u=l,l=h,h=u,u=p,p=v,v=u),o=h-l,i=Math.abs(v-p),a=o/2|0,s=p,c=v>p?1:-1,d=l;h>d;d++)m?r(s,d):r(d,s),a-=i,0>a&&(s+=c,a+=o);return{line:g,min:w,max:C}},r.toBinaryLine=function(e){var t,n,r,i,a,c,s=e.min,u=e.max,d=e.line,f=s+(u-s)/2,l=[],p=(u-s)/12,h=-p;for(r=d[0]>f?o.DIR.UP:o.DIR.DOWN,l.push({pos:0,val:d[0]}),a=0;a<d.length-2;a++)t=d[a+1]-d[a],n=d[a+2]-d[a+1],i=h>t+n&&d[a+1]<1.5*f?o.DIR.DOWN:t+n>p&&d[a+1]>.5*f?o.DIR.UP:r,r!==i&&(l.push({pos:a,val:d[a]}),r=i);for(l.push({pos:d.length,val:d[d.length-1]}),c=l[0].pos;c<l[1].pos;c++)d[c]=d[c]>f?0:1;for(a=1;a<l.length-1;a++)for(p=l[a+1].val>l[a].val?l[a].val+(l[a+1].val-l[a].val)/3*2|0:l[a+1].val+(l[a].val-l[a+1].val)/3|0,c=l[a].pos;c<l[a+1].pos;c++)d[c]=d[c]>p?0:1;return{line:d,threshold:p}},r.debug={printFrequency:function(e,t){var n,r=t.getContext("2d");for(t.width=e.length,t.height=256,r.beginPath(),r.strokeStyle="blue",n=0;n<e.length;n++)r.moveTo(n,255),r.lineTo(n,255-e[n]);r.stroke(),r.closePath()},printPattern:function(e,t){var n,r=t.getContext("2d");for(t.width=e.length,r.fillColor="black",n=0;n<e.length;n++)1===e[n]&&r.fillRect(n,0,1,100)}},t.a=r},function(e,t,n){function r(e){return new Promise(function(t,n){function r(){o>0?e.videoWidth>0&&e.videoHeight>0?t():window.setTimeout(r,500):n("Unable to play video stream. Is webcam working?"),o--}var o=10;r()})}function o(e,t){return navigator.mediaDevices.getUserMedia(t).then(function(t){return new Promise(function(n){l=t,e.setAttribute("autoplay","true"),e.srcObject=t,e.addEventListener("loadedmetadata",function(){e.play(),n()})})}).then(r.bind(null,e))}function i(e){var t=u.a.bind()(e,["width","height","facingMode","aspectRatio","deviceId"]);return"undefined"!=typeof e.minAspectRatio&&e.minAspectRatio>0&&(t.aspectRatio=e.minAspectRatio,console.log("WARNING: Constraint 'minAspectRatio' is deprecated; Use 'aspectRatio' instead")),"undefined"!=typeof e.facing&&(t.facingMode=e.facing,console.log("WARNING: Constraint 'facing' is deprecated. Use 'facingMode' instead'")),t}function a(e,t){return"undefined"==typeof t.video.deviceId&&e?"undefined"!=typeof MediaStreamTrack&&"undefined"!=typeof MediaStreamTrack.getSources?new Promise(function(n){MediaStreamTrack.getSources(function(r){var o=r.filter(function(t){return"video"===t.kind&&t.facing===e})[0];return n(o?f.a.bind()({},t,{video:{deviceId:o.id}}):t)})}):Promise.resolve(f.a.bind()({},t,{video:{facingMode:e}})):Promise.resolve(t)}function c(e){var t={audio:!1,video:i(e)};return a(t.video.facingMode,t)}var s=n(145),u=s&&s.__esModule?function(){return s["default"]}:function(){return s};Object.defineProperty(u,"a",{get:u});var d=n(17),f=d&&d.__esModule?function(){return d["default"]}:function(){return d};Object.defineProperty(f,"a",{get:f});var l;t.a={request:function(e,t){return c(t).then(o.bind(null,e))},release:function(){var e=l&&l.getVideoTracks();e&&e.length&&e[0].stop(),l=null}}},function(e,t,n){var r=n(18),o={};o.create=function(e,t){var n,o={},i=e.getConfig(),a=(r.f.bind()(e.getRealWidth(),e.getRealHeight()),e.getCanvasSize()),c=r.f.bind()(e.getWidth(),e.getHeight()),s=e.getTopRight(),u=s.x,d=s.y,f=null,l=null;return n=t?t:document.createElement("canvas"),n.width=a.x,n.height=a.y,f=n.getContext("2d"),l=new Uint8Array(c.x*c.y),o.attachData=function(e){l=e},o.getData=function(){return l},o.grab=function(){var t,n=i.halfSample,o=e.getFrame();return o?(f.drawImage(o,0,0,a.x,a.y),t=f.getImageData(u,d,c.x,c.y).data,n?r.i.bind()(t,c,l):r.j.bind()(t,l,i),!0):!1},o.getSize=function(){return c},o},t.a=o},function(e,t,n){function r(e,t){e.onload=function(){t.loaded(this)}}var o={};o.load=function(e,t,n,o,i){var a,c,s,u=new Array(o),d=new Array(u.length);if(i===!1)u[0]=e;else for(a=0;a<u.length;a++)s=n+a,u[a]=e+"image-"+("00"+s).slice(-3)+".jpg";for(d.notLoaded=[],d.addImage=function(e){d.notLoaded.push(e)},d.loaded=function(e){for(var n=d.notLoaded,r=0;r<n.length;r++)if(n[r]===e){n.splice(r,1);for(var o=0;o<u.length;o++){var i=u[o].substr(u[o].lastIndexOf("/"));if(-1!==e.src.lastIndexOf(i)){d[o]=e;break}}break}0===n.length&&t.apply(null,[d])},a=0;a<u.length;a++)c=new Image,d.addImage(c),r(c,d),c.src=u[a]},t.a=o},function(e,t,n){var r=n(61),o={};o.createVideoStream=function(e){function t(){var t=e.videoWidth,o=e.videoHeight;n=i.size?t/o>1?i.size:Math.floor(t/o*i.size):t,r=i.size?t/o>1?Math.floor(o/t*i.size):i.size:o,u.x=n,u.y=r}var n,r,o={},i=null,a=["canrecord","ended"],c={},s={x:0,y:0},u={x:0,y:0};return o.getRealWidth=function(){return e.videoWidth},o.getRealHeight=function(){return e.videoHeight},o.getWidth=function(){return n},o.getHeight=function(){return r},o.setWidth=function(e){n=e},o.setHeight=function(e){r=e},o.setInputStream=function(t){i=t,e.src="undefined"!=typeof t.src?t.src:""},o.ended=function(){return e.ended},o.getConfig=function(){return i},o.setAttribute=function(t,n){e.setAttribute(t,n)},o.pause=function(){e.pause()},o.play=function(){e.play()},o.setCurrentTime=function(t){"LiveStream"!==i.type&&(e.currentTime=t)},o.addEventListener=function(t,n,r){-1!==a.indexOf(t)?(c[t]||(c[t]=[]),c[t].push(n)):e.addEventListener(t,n,r)},o.clearEventHandlers=function(){a.forEach(function(t){var n=c[t];n&&n.length>0&&n.forEach(function(n){e.removeEventListener(t,n)})})},o.trigger=function(e,n){var r,i=c[e];if("canrecord"===e&&t(),i&&i.length>0)for(r=0;r<i.length;r++)i[r].apply(o,n)},o.setTopRight=function(e){s.x=e.x,s.y=e.y},o.getTopRight=function(){return s},o.setCanvasSize=function(e){u.x=e.x,u.y=e.y},o.getCanvasSize=function(){return u},o.getFrame=function(){return e},o},o.createLiveStream=function(e){e.setAttribute("autoplay",!0);var t=o.createVideoStream(e);return t.ended=function(){return!1},t},o.createImageStream=function(){function e(){f=!1,r.a.load(v,function(e){l=e,c=e[0].width,s=e[0].height,n=a.size?c/s>1?a.size:Math.floor(c/s*a.size):c,o=a.size?c/s>1?Math.floor(s/c*a.size):a.size:s,_.x=n,_.y=o,f=!0,u=0,setTimeout(function(){t("canrecord",[])},0)},h,p,a.sequence)}function t(e,t){var n,r=y[e];if(r&&r.length>0)for(n=0;n<r.length;n++)r[n].apply(i,t)}var n,o,i={},a=null,c=0,s=0,u=0,d=!0,f=!1,l=null,p=0,h=1,v=null,m=!1,g=["canrecord","ended"],y={},b={x:0,y:0},_={x:0,y:0};return i.trigger=t,i.getWidth=function(){return n},i.getHeight=function(){return o},i.setWidth=function(e){n=e},i.setHeight=function(e){o=e},i.getRealWidth=function(){return c},i.getRealHeight=function(){return s},i.setInputStream=function(t){a=t,t.sequence===!1?(v=t.src,p=1):(v=t.src,p=t.length),e()},i.ended=function(){return m},i.setAttribute=function(){},i.getConfig=function(){return a},i.pause=function(){d=!0},i.play=function(){d=!1},i.setCurrentTime=function(e){u=e},i.addEventListener=function(e,t){-1!==g.indexOf(e)&&(y[e]||(y[e]=[]),y[e].push(t))},i.setTopRight=function(e){b.x=e.x,b.y=e.y},i.getTopRight=function(){return b},i.setCanvasSize=function(e){_.x=e.x,_.y=e.y},i.getCanvasSize=function(){return _},i.getFrame=function(){var e;return f?(d||(e=l[u],p-1>u?u++:setTimeout(function(){m=!0,t("ended",[])},0)),e):null},i},t.a=o},function(e,t,n){(function(e){function r(){var t;v=h.halfSample?new S.a({x:T.size.x/2|0,y:T.size.y/2|0}):T,E=O.b.bind()(h.patchSize,v.size),k.x=v.size.x/E.x|0,k.y=v.size.y/E.y|0,C=new S.a(v.size,void 0,Uint8Array,!1),y=new S.a(E,void 0,Array,!0),t=new ArrayBuffer(65536),g=new S.a(E,new Uint8Array(t,0,E.x*E.y)),m=new S.a(E,new Uint8Array(t,E.x*E.y*3,E.x*E.y),void 0,!0),R=A.a.bind()("undefined"!=typeof window?window:"undefined"!=typeof self?self:e,{size:E.x},t),w=new S.a({x:v.size.x/g.size.x|0,y:v.size.y/g.size.y|0},void 0,Array,!0),b=new S.a(w.size,void 0,void 0,!0),_=new S.a(w.size,void 0,Int32Array,!0)}function o(){h.useWorker||"undefined"==typeof document||(I.dom.binary=document.createElement("canvas"),I.dom.binary.className="binaryBuffer",I.ctx.binary=I.dom.binary.getContext("2d"),I.dom.binary.width=C.size.x,I.dom.binary.height=C.size.y)}function i(e){var t,n,r,o,i,a,c,s=C.size.x,u=C.size.y,d=-C.size.x,f=-C.size.y;for(t=0,n=0;n<e.length;n++)o=e[n],t+=o.rad;for(t/=e.length,t=(180*t/Math.PI+90)%180-90,0>t&&(t+=180),t=(180-t)*Math.PI/180,i=j.copy(j.create(),[Math.cos(t),Math.sin(t),-Math.sin(t),Math.cos(t)]),n=0;n<e.length;n++)for(o=e[n],r=0;4>r;r++)M.transformMat2(o.box[r],o.box[r],i);for(n=0;n<e.length;n++)for(o=e[n],r=0;4>r;r++)o.box[r][0]<s&&(s=o.box[r][0]),o.box[r][0]>d&&(d=o.box[r][0]),o.box[r][1]<u&&(u=o.box[r][1]),o.box[r][1]>f&&(f=o.box[r][1]);for(a=[[s,u],[d,u],[d,f],[s,f]],c=h.halfSample?2:1,i=j.invert(i,i),r=0;4>r;r++)M.transformMat2(a[r],a[r],i);for(r=0;4>r;r++)M.scale(a[r],a[r],c);return a}function a(){O.c.bind()(v,C),C.zeroBorder()}function c(){var e,t,n,r,o,i,a,c=[];for(e=0;e<k.x;e++)for(t=0;t<k.y;t++)n=g.size.x*e,r=g.size.y*t,f(n,r),m.zeroBorder(),x.a.init(y.data,0),i=D.a.create(m,y),a=i.rasterize(0),o=y.moments(a.count),c=c.concat(l(o,[e,t],n,r));return c}function s(e){var t,n,r=[],o=[];for(t=0;e>t;t++)r.push(0);for(n=_.data.length;n--;)_.data[n]>0&&r[_.data[n]-1]++;return r=r.map(function(e,t){return{val:e,label:t+1}}),r.sort(function(e,t){return t.val-e.val}),o=r.filter(function(e){return e.val>=5})}function u(e,t){var n,r,o,a,c=[],s=[];for(n=0;n<e.length;n++){for(r=_.data.length,c.length=0;r--;)_.data[r]===e[n].label&&(o=w.data[r],c.push(o));a=i(c),a&&s.push(a)}return s}function d(e){var t=O.d.bind()(e,.9),n=O.e.bind()(t,1,function(e){return e.getPoints().length}),r=[],o=[];if(1===n.length){r=n[0].item.getPoints();for(var i=0;i<r.length;i++)o.push(r[i].point)}return o}function f(e,t){C.subImageAsCopy(g,O.f.bind()(e,t)),R.skeletonize()}function l(e,t,n,r){var o,i,a,c,s=[],u=[],f=Math.ceil(E.x/3);if(e.length>=2){for(o=0;o<e.length;o++)e[o].m00>f&&s.push(e[o]);if(s.length>=2){for(a=d(s),i=0,o=0;o<a.length;o++)i+=a[o].rad;a.length>1&&a.length>=s.length/4*3&&a.length>e.length/4&&(i/=a.length,c={index:t[1]*k.x+t[0],pos:{x:n,y:r},box:[M.clone([n,r]),M.clone([n+g.size.x,r]),M.clone([n+g.size.x,r+g.size.y]),M.clone([n,r+g.size.y])],moments:a,rad:i,vec:M.clone([Math.cos(i),Math.sin(i)])},u.push(c))}}return u}function p(e){function t(){var e;for(e=0;e<_.data.length;e++)if(0===_.data[e]&&1===b.data[e])return e;return _.length}function n(e){var t,r,o,c,s,u,d={x:e%_.size.x,y:e/_.size.x|0};if(e<_.data.length)for(o=w.data[e],_.data[e]=i,s=0;s<P.a.searchDirections.length;s++)r=d.y+P.a.searchDirections[s][0],t=d.x+P.a.searchDirections[s][1],c=r*_.size.x+t,0!==b.data[c]?0===_.data[c]&&(u=Math.abs(M.dot(w.data[c].vec,o.vec)),u>a&&n(c)):_.data[c]=Number.MAX_VALUE}var r,o,i=0,a=.95,c=0;for(x.a.init(b.data,0),x.a.init(_.data,0),x.a.init(w.data,null),r=0;r<e.length;r++)o=e[r],w.data[o.index]=o,b.data[o.index]=1;for(b.zeroBorder();(c=t())<_.data.length;)i++,n(c);return i}var h,v,m,g,y,b,_,w,C,E,T,R,S=n(19),O=n(18),x=n(9),D=(n(10),n(64)),P=n(29),A=n(65),M={clone:n(7),dot:n(31),scale:n(78),transformMat2:n(79)},j={copy:n(75),create:n(76),invert:n(77)},I={ctx:{binary:null},dom:{binary:null}},k={x:0,y:0};t.a={init:function(e,t){h=t,T=e,r(),o()},locate:function(){var e,t,n;if(h.halfSample&&O.g.bind()(T,v),a(),e=c(),e.length<k.x*k.y*.05)return null;var r=p(e);return 1>r?null:(t=s(r),0===t.length?null:n=u(t,r))},checkImageConstraints:function(e,t){var n,r,o,i=e.getWidth(),a=e.getHeight(),c=t.halfSample?.5:1;if(e.getConfig().area&&(o=O.h.bind()(i,a,e.getConfig().area),e.setTopRight({x:o.sx,y:o.sy}),e.setCanvasSize({x:i,y:a}),i=o.sw,a=o.sh),r={x:Math.floor(i*c),y:Math.floor(a*c)},n=O.b.bind()(t.patchSize,r),e.setWidth(Math.floor(Math.floor(r.x/n.x)*(1/c)*n.x)),e.setHeight(Math.floor(Math.floor(r.y/n.y)*(1/c)*n.y)),e.getWidth()%n.x===0&&e.getHeight()%n.y===0)return!0;throw new Error("Image dimensions do not comply with the current settings: Width ("+i+" )and height ("+a+") must a multiple of "+n.x)}}}).call(t,function(){return this}())},function(e,t,n){var r=n(29),o={createContour2D:function(){return{dir:null,index:null,firstVertex:null,insideContours:null,nextpeer:null,prevpeer:null}},CONTOUR_DIR:{CW_DIR:0,CCW_DIR:1,UNKNOWN_DIR:2},DIR:{OUTSIDE_EDGE:-32767,INSIDE_EDGE:-32766},create:function(e,t){var n=e.data,i=t.data,a=e.size.x,c=e.size.y,s=r.a.create(e,t);return{rasterize:function(e){var t,r,u,d,f,l,p,h,v,m,g,y,b=[],_=0;for(y=0;400>y;y++)b[y]=0;for(b[0]=n[0],v=null,l=1;c-1>l;l++)for(d=0,r=b[0],f=1;a-1>f;f++)if(g=l*a+f,0===i[g])if(t=n[g],t!==r){if(0===d)u=_+1,b[u]=t,r=t,p=s.contourTracing(l,f,u,t,o.DIR.OUTSIDE_EDGE),null!==p&&(_++,d=u,h=o.createContour2D(),h.dir=o.CONTOUR_DIR.CW_DIR,h.index=d,h.firstVertex=p,h.nextpeer=v,h.insideContours=null,null!==v&&(v.prevpeer=h),v=h);else if(p=s.contourTracing(l,f,o.DIR.INSIDE_EDGE,t,d),null!==p){for(h=o.createContour2D(),h.firstVertex=p,h.insideContours=null,0===e?h.dir=o.CONTOUR_DIR.CCW_DIR:h.dir=o.CONTOUR_DIR.CW_DIR,h.index=e,m=v;null!==m&&m.index!==d;)m=m.nextpeer;null!==m&&(h.nextpeer=m.insideContours,null!==m.insideContours&&(m.insideContours.prevpeer=h),m.insideContours=h)}}else i[g]=d;else i[g]===o.DIR.OUTSIDE_EDGE||i[g]===o.DIR.INSIDE_EDGE?(d=0,r=i[g]===o.DIR.INSIDE_EDGE?n[g]:b[0]):(d=i[g],r=b[d]);for(m=v;null!==m;)m.index=e,m=m.nextpeer;return{cc:v,count:_}},debug:{drawContour:function(e,t){var n,r,i,a=e.getContext("2d"),c=t;for(a.strokeStyle="red",a.fillStyle="red",a.lineWidth=1,n=null!==c?c.insideContours:null;null!==c;){switch(null!==n?(r=n,n=n.nextpeer):(r=c,c=c.nextpeer,n=null!==c?c.insideContours:null),r.dir){case o.CONTOUR_DIR.CW_DIR:a.strokeStyle="red";break;case o.CONTOUR_DIR.CCW_DIR:a.strokeStyle="blue";break;case o.CONTOUR_DIR.UNKNOWN_DIR:a.strokeStyle="green"}i=r.firstVertex,a.beginPath(),a.moveTo(i.x,i.y);do i=i.next,a.lineTo(i.x,i.y);while(i!==r.firstVertex);a.stroke()}}}}}};t.a=o},function(module, exports, __webpack_require__) {function Skeletonizer(stdlib, foreign, buffer) {"use asm";var images=new stdlib.Uint8Array(buffer),size=foreign.size|0,imul=stdlib.Math.imul;function erode(inImagePtr, outImagePtr) {inImagePtr=inImagePtr|0;outImagePtr=outImagePtr|0;var v=0,u=0,sum=0,yStart1=0,yStart2=0,xStart1=0,xStart2=0,offset=0;for (v=1; (v|0)<(size - 1|0); v=v+1|0) {offset=offset+size|0;for (u=1; (u|0)<(size - 1|0); u=u+1|0) {yStart1=offset - size|0;yStart2=offset+size|0;xStart1=u - 1|0;xStart2=u+1|0;sum=(images[inImagePtr+yStart1+xStart1|0]|0)+(images[inImagePtr+yStart1+xStart2|0]|0)+(images[inImagePtr+offset+u|0]|0)+(images[inImagePtr+yStart2+xStart1|0]|0)+(images[inImagePtr+yStart2+xStart2|0]|0)|0;if ((sum|0) == (5|0)) {images[outImagePtr+offset+u|0]=1;} else {images[outImagePtr+offset+u|0]=0;}}}return;}function subtract(aImagePtr, bImagePtr, outImagePtr) {aImagePtr=aImagePtr|0;bImagePtr=bImagePtr|0;outImagePtr=outImagePtr|0;var length=0;length=imul(size, size)|0;while ((length|0)>0) {length=length - 1|0;images[outImagePtr+length|0]=(images[aImagePtr+length|0]|0) - (images[bImagePtr+length|0]|0)|0;}}function bitwiseOr(aImagePtr, bImagePtr, outImagePtr) {aImagePtr=aImagePtr|0;bImagePtr=bImagePtr|0;outImagePtr=outImagePtr|0;var length=0;length=imul(size, size)|0;while ((length|0)>0) {length=length - 1|0;images[outImagePtr+length|0]=images[aImagePtr+length|0]|0|(images[bImagePtr+length|0]|0)|0;}}function countNonZero(imagePtr) {imagePtr=imagePtr|0;var sum=0,length=0;length=imul(size, size)|0;while ((length|0)>0) {length=length - 1|0;sum=(sum|0)+(images[imagePtr+length|0]|0)|0;}return sum|0;}function init(imagePtr, value) {imagePtr=imagePtr|0;value=value|0;var length=0;length=imul(size, size)|0;while ((length|0)>0) {length=length - 1|0;images[imagePtr+length|0]=value;}}function dilate(inImagePtr, outImagePtr) {inImagePtr=inImagePtr|0;outImagePtr=outImagePtr|0;var v=0,u=0,sum=0,yStart1=0,yStart2=0,xStart1=0,xStart2=0,offset=0;for (v=1; (v|0)<(size - 1|0); v=v+1|0) {offset=offset+size|0;for (u=1; (u|0)<(size - 1|0); u=u+1|0) {yStart1=offset - size|0;yStart2=offset+size|0;xStart1=u - 1|0;xStart2=u+1|0;sum=(images[inImagePtr+yStart1+xStart1|0]|0)+(images[inImagePtr+yStart1+xStart2|0]|0)+(images[inImagePtr+offset+u|0]|0)+(images[inImagePtr+yStart2+xStart1|0]|0)+(images[inImagePtr+yStart2+xStart2|0]|0)|0;if ((sum|0)>(0|0)) {images[outImagePtr+offset+u|0]=1;} else {images[outImagePtr+offset+u|0]=0;}}}return;}function memcpy(srcImagePtr, dstImagePtr) {srcImagePtr=srcImagePtr|0;dstImagePtr=dstImagePtr|0;var length=0;length=imul(size, size)|0;while ((length|0)>0) {length=length - 1|0;images[dstImagePtr+length|0]=images[srcImagePtr+length|0]|0;}}function zeroBorder(imagePtr) {imagePtr=imagePtr|0;var x=0,y=0;for (x=0; (x|0)<(size - 1|0); x=x+1|0) {images[imagePtr+x|0]=0;images[imagePtr+y|0]=0;y=y+size - 1|0;images[imagePtr+y|0]=0;y=y+1|0;}for (x=0; (x|0)<(size|0); x=x+1|0) {images[imagePtr+y|0]=0;y=y+1|0;}}function skeletonize() {var subImagePtr=0,erodedImagePtr=0,tempImagePtr=0,skelImagePtr=0,sum=0,done=0;erodedImagePtr=imul(size, size)|0;tempImagePtr=erodedImagePtr+erodedImagePtr|0;skelImagePtr=tempImagePtr+erodedImagePtr|0;init(skelImagePtr, 0);zeroBorder(subImagePtr);do {erode(subImagePtr, erodedImagePtr);dilate(erodedImagePtr, tempImagePtr);subtract(subImagePtr, tempImagePtr, tempImagePtr);bitwiseOr(skelImagePtr, tempImagePtr, skelImagePtr);memcpy(erodedImagePtr, subImagePtr);sum=countNonZero(subImagePtr)|0;done=(sum|0) == 0|0;} while (!done);}return {skeletonize: skeletonize};} exports["a"]=Skeletonizer; },function(e,t,n){function r(){o.a.call(this),this._counters=[]}var o=n(6),i={ALPHABETH_STRING:{value:"0123456789-$:/.+ABCD"},ALPHABET:{value:[48,49,50,51,52,53,54,55,56,57,45,36,58,47,46,43,65,66,67,68]},CHARACTER_ENCODINGS:{value:[3,6,9,96,18,66,33,36,48,72,12,24,69,81,84,21,26,41,11,14]},START_END:{value:[26,41,11,14]},MIN_ENCODED_CHARS:{value:4},MAX_ACCEPTABLE:{value:2},PADDING:{value:1.5},FORMAT:{value:"codabar",writeable:!1}};r.prototype=Object.create(o.a.prototype,i),r.prototype.constructor=r,r.prototype._decode=function(){var e,t,n,r,o,i=this,a=[];if(this._counters=i._fillCounters(),e=i._findStart(),!e)return null;r=e.startCounter;do{if(n=i._toPattern(r),0>n)return null;if(t=i._patternToChar(n),0>t)return null;if(a.push(t),r+=8,a.length>1&&i._isStartEnd(n))break}while(r<i._counters.length);return a.length-2<i.MIN_ENCODED_CHARS||!i._isStartEnd(n)?null:i._verifyWhitespace(e.startCounter,r-8)&&i._validateResult(a,e.startCounter)?(r=r>i._counters.length?i._counters.length:r,o=e.start+i._sumCounters(e.startCounter,r-8),{code:a.join(""),start:e.start,end:o,startInfo:e,decodedCodes:a}):null},r.prototype._verifyWhitespace=function(e,t){return(0>=e-1||this._counters[e-1]>=this._calculatePatternLength(e)/2)&&(t+8>=this._counters.length||this._counters[t+7]>=this._calculatePatternLength(t)/2)},r.prototype._calculatePatternLength=function(e){var t,n=0;for(t=e;e+7>t;t++)n+=this._counters[t];return n},r.prototype._thresholdResultPattern=function(e,t){var n,r,o,i,a,c=this,s={space:{narrow:{size:0,counts:0,min:0,max:Number.MAX_VALUE},wide:{size:0,counts:0,min:0,max:Number.MAX_VALUE}},bar:{narrow:{size:0,counts:0,min:0,max:Number.MAX_VALUE},wide:{size:0,counts:0,min:0,max:Number.MAX_VALUE}}},u=t;for(o=0;o<e.length;o++){for(a=c._charToPattern(e[o]),i=6;i>=0;i--)n=2===(1&i)?s.bar:s.space,r=1===(1&a)?n.wide:n.narrow,r.size+=c._counters[u+i],r.counts++,a>>=1;u+=8}return["space","bar"].forEach(function(e){var t=s[e];t.wide.min=Math.floor((t.narrow.size/t.narrow.counts+t.wide.size/t.wide.counts)/2),t.narrow.max=Math.ceil(t.wide.min),t.wide.max=Math.ceil((t.wide.size*c.MAX_ACCEPTABLE+c.PADDING)/t.wide.counts)}),s},r.prototype._charToPattern=function(e){var t,n=this,r=e.charCodeAt(0);for(t=0;t<n.ALPHABET.length;t++)if(n.ALPHABET[t]===r)return n.CHARACTER_ENCODINGS[t];return 0},r.prototype._validateResult=function(e,t){var n,r,o,i,a,c,s=this,u=s._thresholdResultPattern(e,t),d=t;for(n=0;n<e.length;n++){for(c=s._charToPattern(e[n]),r=6;r>=0;r--){if(o=0===(1&r)?u.bar:u.space,i=1===(1&c)?o.wide:o.narrow,a=s._counters[d+r],a<i.min||a>i.max)return!1;c>>=1}d+=8}return!0},r.prototype._patternToChar=function(e){var t,n=this;for(t=0;t<n.CHARACTER_ENCODINGS.length;t++)if(n.CHARACTER_ENCODINGS[t]===e)return String.fromCharCode(n.ALPHABET[t]);return-1},r.prototype._computeAlternatingThreshold=function(e,t){var n,r,o=Number.MAX_VALUE,i=0;for(n=e;t>n;n+=2)r=this._counters[n],r>i&&(i=r),o>r&&(o=r);return(o+i)/2|0},r.prototype._toPattern=function(e){var t,n,r,o,i=7,a=e+i,c=1<<i-1,s=0;if(a>this._counters.length)return-1;for(t=this._computeAlternatingThreshold(e,a),n=this._computeAlternatingThreshold(e+1,a),r=0;i>r;r++)o=0===(1&r)?t:n,this._counters[e+r]>o&&(s|=c),c>>=1;return s},r.prototype._isStartEnd=function(e){var t;for(t=0;t<this.START_END.length;t++)if(this.START_END[t]===e)return!0;return!1},r.prototype._sumCounters=function(e,t){var n,r=0;for(n=e;t>n;n++)r+=this._counters[n];return r},r.prototype._findStart=function(){var e,t,n,r=this,o=r._nextUnset(r._row);for(e=1;e<this._counters.length;e++)if(t=r._toPattern(e),-1!==t&&r._isStartEnd(t))return o+=r._sumCounters(0,e),n=o+r._sumCounters(e,e+8),{start:o,end:n,startCounter:e,endCounter:e+8}},t.a=r},function(e,t,n){function r(){i.a.call(this)}function o(e,t,n){for(var r=n.length,o=0,i=0;r--;)i+=e[n[r]],o+=t[n[r]];return i/o}var i=n(6),a={CODE_SHIFT:{value:98},CODE_C:{value:99},CODE_B:{value:100},CODE_A:{value:101},START_CODE_A:{value:103},START_CODE_B:{value:104},START_CODE_C:{value:105},STOP_CODE:{value:106},CODE_PATTERN:{value:[[2,1,2,2,2,2],[2,2,2,1,2,2],[2,2,2,2,2,1],[1,2,1,2,2,3],[1,2,1,3,2,2],[1,3,1,2,2,2],[1,2,2,2,1,3],[1,2,2,3,1,2],[1,3,2,2,1,2],[2,2,1,2,1,3],[2,2,1,3,1,2],[2,3,1,2,1,2],[1,1,2,2,3,2],[1,2,2,1,3,2],[1,2,2,2,3,1],[1,1,3,2,2,2],[1,2,3,1,2,2],[1,2,3,2,2,1],[2,2,3,2,1,1],[2,2,1,1,3,2],[2,2,1,2,3,1],[2,1,3,2,1,2],[2,2,3,1,1,2],[3,1,2,1,3,1],[3,1,1,2,2,2],[3,2,1,1,2,2],[3,2,1,2,2,1],[3,1,2,2,1,2],[3,2,2,1,1,2],[3,2,2,2,1,1],[2,1,2,1,2,3],[2,1,2,3,2,1],[2,3,2,1,2,1],[1,1,1,3,2,3],[1,3,1,1,2,3],[1,3,1,3,2,1],[1,1,2,3,1,3],[1,3,2,1,1,3],[1,3,2,3,1,1],[2,1,1,3,1,3],[2,3,1,1,1,3],[2,3,1,3,1,1],[1,1,2,1,3,3],[1,1,2,3,3,1],[1,3,2,1,3,1],[1,1,3,1,2,3],[1,1,3,3,2,1],[1,3,3,1,2,1],[3,1,3,1,2,1],[2,1,1,3,3,1],[2,3,1,1,3,1],[2,1,3,1,1,3],[2,1,3,3,1,1],[2,1,3,1,3,1],[3,1,1,1,2,3],[3,1,1,3,2,1],[3,3,1,1,2,1],[3,1,2,1,1,3],[3,1,2,3,1,1],[3,3,2,1,1,1],[3,1,4,1,1,1],[2,2,1,4,1,1],[4,3,1,1,1,1],[1,1,1,2,2,4],[1,1,1,4,2,2],[1,2,1,1,2,4],[1,2,1,4,2,1],[1,4,1,1,2,2],[1,4,1,2,2,1],[1,1,2,2,1,4],[1,1,2,4,1,2],[1,2,2,1,1,4],[1,2,2,4,1,1],[1,4,2,1,1,2],[1,4,2,2,1,1],[2,4,1,2,1,1],[2,2,1,1,1,4],[4,1,3,1,1,1],[2,4,1,1,1,2],[1,3,4,1,1,1],[1,1,1,2,4,2],[1,2,1,1,4,2],[1,2,1,2,4,1],[1,1,4,2,1,2],[1,2,4,1,1,2],[1,2,4,2,1,1],[4,1,1,2,1,2],[4,2,1,1,1,2],[4,2,1,2,1,1],[2,1,2,1,4,1],[2,1,4,1,2,1],[4,1,2,1,2,1],[1,1,1,1,4,3],[1,1,1,3,4,1],[1,3,1,1,4,1],[1,1,4,1,1,3],[1,1,4,3,1,1],[4,1,1,1,1,3],[4,1,1,3,1,1],[1,1,3,1,4,1],[1,1,4,1,3,1],[3,1,1,1,4,1],[4,1,1,1,3,1],[2,1,1,4,1,2],[2,1,1,2,1,4],[2,1,1,2,3,2],[2,3,3,1,1,1,2]]},SINGLE_CODE_ERROR:{value:.64},AVG_CODE_ERROR:{value:.3},FORMAT:{value:"code_128",writeable:!1},MODULE_INDICES:{value:{bar:[0,2,4],space:[1,3,5]}}};r.prototype=Object.create(i.a.prototype,a),r.prototype.constructor=r,r.prototype._decodeCode=function(e,t){var n,r,i,a=[0,0,0,0,0,0],c=this,s=e,u=!c._row[s],d=0,f={error:Number.MAX_VALUE,code:-1,start:e,end:e,correction:{bar:1,space:1}};for(n=s;n<c._row.length;n++)if(c._row[n]^u)a[d]++;else{if(d===a.length-1){for(t&&c._correct(a,t),r=0;r<c.CODE_PATTERN.length;r++)i=c._matchPattern(a,c.CODE_PATTERN[r]),i<f.error&&(f.code=r,f.error=i);return f.end=n,-1===f.code||f.error>c.AVG_CODE_ERROR?null:(c.CODE_PATTERN[f.code]&&(f.correction.bar=o(c.CODE_PATTERN[f.code],a,this.MODULE_INDICES.bar),f.correction.space=o(c.CODE_PATTERN[f.code],a,this.MODULE_INDICES.space)),f)}d++,a[d]=1,u=!u}return null},r.prototype._correct=function(e,t){this._correctBars(e,t.bar,this.MODULE_INDICES.bar),this._correctBars(e,t.space,this.MODULE_INDICES.space)},r.prototype._findStart=function(){var e,t,n,r,i,a=[0,0,0,0,0,0],c=this,s=c._nextSet(c._row),u=!1,d=0,f={error:Number.MAX_VALUE,code:-1,start:0,end:0,correction:{bar:1,space:1}};for(e=s;e<c._row.length;e++)if(c._row[e]^u)a[d]++;else{if(d===a.length-1){for(i=0,r=0;r<a.length;r++)i+=a[r];for(t=c.START_CODE_A;t<=c.START_CODE_C;t++)n=c._matchPattern(a,c.CODE_PATTERN[t]),n<f.error&&(f.code=t,f.error=n);if(f.error<c.AVG_CODE_ERROR)return f.start=e-i,f.end=e,f.correction.bar=o(c.CODE_PATTERN[f.code],a,this.MODULE_INDICES.bar),f.correction.space=o(c.CODE_PATTERN[f.code],a,this.MODULE_INDICES.space),f;for(r=0;4>r;r++)a[r]=a[r+2];a[4]=0,a[5]=0,d--}else d++;a[d]=1,u=!u}return null},r.prototype._decode=function(){var e,t,n=this,r=n._findStart(),o=null,i=!1,a=[],c=0,s=0,u=[],d=[],f=!1,l=!0;if(null===r)return null;switch(o={code:r.code,start:r.start,end:r.end,correction:{bar:r.correction.bar,space:r.correction.space}},d.push(o),s=o.code,o.code){case n.START_CODE_A:e=n.CODE_A;break;case n.START_CODE_B:e=n.CODE_B;break;case n.START_CODE_C:e=n.CODE_C;break;default:return null}for(;!i;){if(t=f,f=!1,o=n._decodeCode(o.end,o.correction),null!==o)switch(o.code!==n.STOP_CODE&&(l=!0),o.code!==n.STOP_CODE&&(u.push(o.code),c++,s+=c*o.code),d.push(o),e){case n.CODE_A:if(o.code<64)a.push(String.fromCharCode(32+o.code));else if(o.code<96)a.push(String.fromCharCode(o.code-64));else switch(o.code!==n.STOP_CODE&&(l=!1),o.code){case n.CODE_SHIFT:f=!0,e=n.CODE_B;break;case n.CODE_B:e=n.CODE_B;break;case n.CODE_C:e=n.CODE_C;break;case n.STOP_CODE:i=!0}break;case n.CODE_B:if(o.code<96)a.push(String.fromCharCode(32+o.code));else switch(o.code!==n.STOP_CODE&&(l=!1),o.code){case n.CODE_SHIFT:f=!0,e=n.CODE_A;break;case n.CODE_A:e=n.CODE_A;break;case n.CODE_C:e=n.CODE_C;break;case n.STOP_CODE:i=!0}break;case n.CODE_C:if(o.code<100)a.push(o.code<10?"0"+o.code:o.code);else switch(o.code!==n.STOP_CODE&&(l=!1),o.code){case n.CODE_A:e=n.CODE_A;break;case n.CODE_B:e=n.CODE_B;break;case n.STOP_CODE:i=!0}}else i=!0;t&&(e=e===n.CODE_A?n.CODE_B:n.CODE_A)}return null===o?null:(o.end=n._nextUnset(n._row,o.end),n._verifyTrailingWhitespace(o)?(s-=c*u[u.length-1],s%103!==u[u.length-1]?null:a.length?(l&&a.splice(a.length-1,1),{code:a.join(""),start:r.start,end:o.end,codeset:e,startInfo:r,decodedCodes:d,endInfo:o}):null):null)},i.a.prototype._verifyTrailingWhitespace=function(e){var t,n=this;return t=e.end+(e.end-e.start)/2,t<n._row.length&&n._matchRange(e.end,t,0)?e:null},t.a=r},function(e,t,n){function r(){o.a.call(this)}var o=n(30),i={IOQ:/[IOQ]/g,AZ09:/[A-Z0-9]{17}/};r.prototype=Object.create(o.a.prototype),r.prototype.constructor=r,r.prototype._decode=function(){var e=o.a.prototype._decode.apply(this);if(!e)return null;var t=e.code;return t?(t=t.replace(i.IOQ,""),t.match(i.AZ09)&&this._checkChecksum(t)?(e.code=t,e):null):null},r.prototype._checkChecksum=function(e){return!!e},t.a=r},function(e,t,n){function r(){o.a.call(this)}var o=n(3),i={FORMAT:{value:"ean_2",writeable:!1}};r.prototype=Object.create(o.a.prototype,i),r.prototype.constructor=r,r.prototype.decode=function(e,t){this._row=e;var n,r=0,o=0,i=t,a=this._row.length,c=[],s=[];for(o=0;2>o&&a>i;o++){if(n=this._decodeCode(i),!n)return null;s.push(n),c.push(n.code%10),n.code>=this.CODE_G_START&&(r|=1<<1-o),1!=o&&(i=this._nextSet(this._row,n.end),i=this._nextUnset(this._row,i))}return 2!=c.length||parseInt(c.join(""))%4!==r?null:{code:c.join(""),decodedCodes:s,end:n.end}},t.a=r},function(e,t,n){function r(){a.a.call(this)}function o(e){var t;for(t=0;10>t;t++)if(e===s[t])return t;return null}function i(e){var t,n=e.length,r=0;for(t=n-2;t>=0;t-=2)r+=e[t];for(r*=3,t=n-1;t>=0;t-=2)r+=e[t];return r*=3,r%10}var a=n(3),c={FORMAT:{value:"ean_5",writeable:!1}},s=[24,20,18,17,12,6,3,10,9,5];r.prototype=Object.create(a.a.prototype,c),r.prototype.constructor=r,r.prototype.decode=function(e,t){this._row=e;var n,r=0,a=0,c=t,s=this._row.length,u=[],d=[];for(a=0;5>a&&s>c;a++){if(n=this._decodeCode(c),!n)return null;d.push(n),u.push(n.code%10),n.code>=this.CODE_G_START&&(r|=1<<4-a),4!=a&&(c=this._nextSet(this._row,n.end),c=this._nextUnset(this._row,c))}return 5!=u.length?null:i(u)!==o(r)?null:{code:u.join(""),decodedCodes:d,end:n.end}},t.a=r},function(e,t,n){function r(e,t){o.a.call(this,e,t)}var o=n(3),i={FORMAT:{value:"ean_8",writeable:!1}};r.prototype=Object.create(o.a.prototype,i),r.prototype.constructor=r,r.prototype._decodePayload=function(e,t,n){var r,o=this;for(r=0;4>r;r++){if(e=o._decodeCode(e.end,o.CODE_G_START),!e)return null;t.push(e.code),n.push(e)}if(e=o._findPattern(o.MIDDLE_PATTERN,e.end,!0,!1),null===e)return null;for(n.push(e),r=0;4>r;r++){if(e=o._decodeCode(e.end,o.CODE_G_START),!e)return null;n.push(e),t.push(e.code)}return e},t.a=r},function(e,t,n){function r(e){e=a.a.bind()(o(),e),c.a.call(this,e),this.barSpaceRatio=[1,1],e.normalizeBarSpaceWidth&&(this.SINGLE_CODE_ERROR=.38,this.AVG_CODE_ERROR=.09)}function o(){var e={};return Object.keys(r.CONFIG_KEYS).forEach(function(t){e[t]=r.CONFIG_KEYS[t]["default"]}),e}var i=n(17),a=i&&i.__esModule?function(){return i["default"]}:function(){return i};Object.defineProperty(a,"a",{get:a});var c=n(6),s=1,u=3,d={START_PATTERN:{value:[s,s,s,s]},STOP_PATTERN:{value:[s,s,u]},CODE_PATTERN:{value:[[s,s,u,u,s],[u,s,s,s,u],[s,u,s,s,u],[u,u,s,s,s],[s,s,u,s,u],[u,s,u,s,s],[s,u,u,s,s],[s,s,s,u,u],[u,s,s,u,s],[s,u,s,u,s]]},SINGLE_CODE_ERROR:{value:.78,writable:!0},AVG_CODE_ERROR:{value:.38,writable:!0},MAX_CORRECTION_FACTOR:{value:5},FORMAT:{value:"i2of5"}};r.prototype=Object.create(c.a.prototype,d),r.prototype.constructor=r,r.prototype._matchPattern=function(e,t){if(this.config.normalizeBarSpaceWidth){var n,r=[0,0],o=[0,0],i=[0,0],a=this.MAX_CORRECTION_FACTOR,s=1/a;for(n=0;n<e.length;n++)r[n%2]+=e[n],o[n%2]+=t[n];for(i[0]=o[0]/r[0],i[1]=o[1]/r[1],i[0]=Math.max(Math.min(i[0],a),s),i[1]=Math.max(Math.min(i[1],a),s),this.barSpaceRatio=i,n=0;n<e.length;n++)e[n]*=this.barSpaceRatio[n%2]}return c.a.prototype._matchPattern.call(this,e,t)},r.prototype._findPattern=function(e,t,n,r){var o,i,a,c,s=[],u=this,d=0,f={error:Number.MAX_VALUE,code:-1,start:0,end:0},l=u.AVG_CODE_ERROR;for(n=n||!1,r=r||!1,t||(t=u._nextSet(u._row)),o=0;o<e.length;o++)s[o]=0;for(o=t;o<u._row.length;o++)if(u._row[o]^n)s[d]++;else{if(d===s.length-1){for(c=0,a=0;a<s.length;a++)c+=s[a];if(i=u._matchPattern(s,e),l>i)return f.error=i,f.start=o-c,f.end=o,f;if(!r)return null;for(a=0;a<s.length-2;a++)s[a]=s[a+2];s[s.length-2]=0,s[s.length-1]=0,d--}else d++;s[d]=1,n=!n}return null},r.prototype._findStart=function(){for(var e,t,n=this,r=n._nextSet(n._row),o=1;!t;){if(t=n._findPattern(n.START_PATTERN,r,!1,!0),!t)return null;if(o=Math.floor((t.end-t.start)/4),e=t.start-10*o,e>=0&&n._matchRange(e,t.start,0))return t;r=t.end,t=null}},r.prototype._verifyTrailingWhitespace=function(e){var t,n=this;return t=e.end+(e.end-e.start)/2,t<n._row.length&&n._matchRange(e.end,t,0)?e:null},r.prototype._findEnd=function(){var e,t,n=this;return n._row.reverse(),e=n._findPattern(n.STOP_PATTERN),n._row.reverse(),null===e?null:(t=e.start,e.start=n._row.length-e.end,e.end=n._row.length-t,null!==e?n._verifyTrailingWhitespace(e):null)},r.prototype._decodePair=function(e){var t,n,r=[],o=this;for(t=0;t<e.length;t++){if(n=o._decodeCode(e[t]),!n)return null;r.push(n)}return r},r.prototype._decodeCode=function(e){var t,n,r,o=this,i=0,a=o.AVG_CODE_ERROR,c={error:Number.MAX_VALUE,code:-1,start:0,end:0};for(t=0;t<e.length;t++)i+=e[t];for(r=0;r<o.CODE_PATTERN.length;r++)n=o._matchPattern(e,o.CODE_PATTERN[r]),n<c.error&&(c.code=r,c.error=n);return c.error<a?c:void 0},r.prototype._decodePayload=function(e,t,n){for(var r,o,i=this,a=0,c=e.length,s=[[0,0,0,0,0],[0,0,0,0,0]];c>a;){for(r=0;5>r;r++)s[0][r]=e[a]*this.barSpaceRatio[0],s[1][r]=e[a+1]*this.barSpaceRatio[1],a+=2;if(o=i._decodePair(s),!o)return null;for(r=0;r<o.length;r++)t.push(o[r].code+""),n.push(o[r])}return o},r.prototype._verifyCounterLength=function(e){return e.length%10===0},r.prototype._decode=function(){var e,t,n,r,o=this,i=[],a=[];return(e=o._findStart())?(a.push(e),(t=o._findEnd())?(r=o._fillCounters(e.end,t.start,!1),o._verifyCounterLength(r)&&(n=o._decodePayload(r,i,a))?i.length%2!==0||i.length<6?null:(a.push(t),{code:i.join(""),start:e.start,end:t.end,startInfo:e,decodedCodes:a}):null):null):null},r.CONFIG_KEYS={normalizeBarSpaceWidth:{type:"boolean","default":!1,description:"If true, the reader tries to normalize thewidth-difference between bars and spaces"}},t.a=r},function(e,t,n){function r(e,t){o.a.call(this,e,t)}var o=n(3),i={CODE_FREQUENCY:{value:[[56,52,50,49,44,38,35,42,41,37],[7,11,13,14,19,25,28,21,22,26]]},STOP_PATTERN:{value:[1/6*7,1/6*7,1/6*7,1/6*7,1/6*7,1/6*7]},FORMAT:{value:"upc_e",writeable:!1}};r.prototype=Object.create(o.a.prototype,i),r.prototype.constructor=r,r.prototype._decodePayload=function(e,t,n){var r,o=this,i=0;for(r=0;6>r;r++){if(e=o._decodeCode(e.end),!e)return null;e.code>=o.CODE_G_START&&(e.code=e.code-o.CODE_G_START,i|=1<<5-r),t.push(e.code),n.push(e)}return o._determineParity(i,t)?e:null},r.prototype._determineParity=function(e,t){var n,r;for(r=0;r<this.CODE_FREQUENCY.length;r++)for(n=0;n<this.CODE_FREQUENCY[r].length;n++)if(e===this.CODE_FREQUENCY[r][n])return t.unshift(r),t.push(n),!0;return!1},r.prototype._convertToUPCA=function(e){var t=[e[0]],n=e[e.length-2];return t=2>=n?t.concat(e.slice(1,3)).concat([n,0,0,0,0]).concat(e.slice(3,6)):3===n?t.concat(e.slice(1,4)).concat([0,0,0,0,0]).concat(e.slice(4,6)):4===n?t.concat(e.slice(1,5)).concat([0,0,0,0,0,e[5]]):t.concat(e.slice(1,6)).concat([0,0,0,0,n]),t.push(e[e.length-1]),t},r.prototype._checksum=function(e){return o.a.prototype._checksum.call(this,this._convertToUPCA(e))},r.prototype._findEnd=function(e,t){return t=!0,o.a.prototype._findEnd.call(this,e,t)},r.prototype._verifyTrailingWhitespace=function(e){var t,n=this;return t=e.end+(e.end-e.start)/2,t<n._row.length&&n._matchRange(e.end,t,0)?e:void 0},t.a=r},function(e,t,n){function r(e,t){o.a.call(this,e,t)}var o=n(3),i={FORMAT:{value:"upc_a",writeable:!1}};r.prototype=Object.create(o.a.prototype,i),r.prototype.constructor=r,r.prototype._decode=function(){var e=o.a.prototype._decode.call(this);return e&&e.code&&13===e.code.length&&"0"===e.code.charAt(0)?(e.code=e.code.substring(1),e):null},t.a=r},function(e,t,n){function r(e,t){return e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e}e.e=r},function(e,t,n){function r(){var e=new Float32Array(4);return e[0]=1,e[1]=0,e[2]=0,e[3]=1,e}e.e=r},function(e,t,n){function r(e,t){var n=t[0],r=t[1],o=t[2],i=t[3],a=n*i-o*r;return a?(a=1/a,e[0]=i*a,e[1]=-r*a,e[2]=-o*a,e[3]=n*a,e):null}e.e=r},function(e,t,n){function r(e,t,n){return e[0]=t[0]*n,e[1]=t[1]*n,e}e.e=r},function(e,t,n){function r(e,t,n){var r=t[0],o=t[1];return e[0]=n[0]*r+n[2]*o,e[1]=n[1]*r+n[3]*o,e}e.e=r},function(e,t,n){function r(e){var t=new Float32Array(3);return t[0]=e[0],t[1]=e[1],t[2]=e[2],t}e.e=r},function(e,t,n){function r(){}var o=n(14),i=Object.prototype;r.prototype=o?o(null):i,e.e=r},function(e,t,n){function r(e){var t=-1,n=e?e.length:0;for(this.clear();++t<n;){var r=e[t];this.set(r[0],r[1])}}var o=n(128),i=n(129),a=n(130),c=n(131),s=n(132);r.prototype.clear=o,r.prototype["delete"]=i,r.prototype.get=a,r.prototype.has=c,r.prototype.set=s,e.e=r},function(e,t,n){var r=n(1),o=r.Reflect;e.e=o},function(e,t,n){var r=n(12),o=n(1),i=r(o,"Set");e.e=i},function(e,t,n){var r=n(1),o=r.Symbol;e.e=o},function(e,t,n){var r=n(1),o=r.Uint8Array;e.e=o},function(e,t,n){var r=n(12),o=n(1),i=r(o,"WeakMap");e.e=i},function(e,t,n){function r(e,t){return e.set(t[0],t[1]),e}e.e=r},function(e,t,n){function r(e,t){return e.add(t),e}e.e=r},function(e,t,n){function r(e,t,n){var r=n.length;switch(r){case 0:return e.call(t);case 1:return e.call(t,n[0]);case 2:return e.call(t,n[0],n[1]);case 3:return e.call(t,n[0],n[1],n[2])}return e.apply(t,n)}e.e=r},function(e,t,n){function r(e,t){for(var n=-1,r=t.length,o=e.length;++n<r;)e[o+n]=t[n];return e}e.e=r},function(e,t,n){function r(e,t){return e&&o(t,i(t),e)}var o=n(21),i=n(45);e.e=r},function(e,t,n){function r(e,t,n,w,C,E,T){var O;if(w&&(O=E?w(e,C,E,T):w(e)),void 0!==O)return O;if(!b(e))return e;var x=m(e);if(x){if(O=p(e),!t)return d(e,O)}else{var P=l(e),A=P==R||P==S;if(g(e))return u(e,t);if(P==D||P==_||A&&!E){if(y(e))return E?e:{};if(O=v(A?{}:e),!t)return O=c(O,e),n?f(e,O):O}else{if(!H[P])return E?e:{};O=h(e,P,t)}}T||(T=new o);var M=T.get(e);return M?M:(T.set(e,O),(x?i:s)(e,function(o,i){a(O,i,r(o,t,n,w,i,e,T))}),n&&!x?f(e,O):O)}var o=n(32),i=n(33),a=n(35),c=n(92),s=n(97),u=n(107),d=n(41),f=n(114),l=n(119),p=n(123),h=n(124),v=n(125),m=n(5),g=n(141),y=n(22),b=n(2),_="[object Arguments]",w="[object Array]",C="[object Boolean]",E="[object Date]",T="[object Error]",R="[object Function]",S="[object GeneratorFunction]",O="[object Map]",x="[object Number]",D="[object Object]",P="[object RegExp]",A="[object Set]",M="[object String]",j="[object Symbol]",I="[object WeakMap]",k="[object ArrayBuffer]",N="[object Float32Array]",L="[object Float64Array]",z="[object Int8Array]",U="[object Int16Array]",F="[object Int32Array]",G="[object Uint8Array]",B="[object Uint8ClampedArray]",W="[object Uint16Array]",V="[object Uint32Array]",H={};H[_]=H[w]=H[k]=H[C]=H[E]=H[N]=H[L]=H[z]=H[U]=H[F]=H[O]=H[x]=H[D]=H[P]=H[A]=H[M]=H[j]=H[G]=H[B]=H[W]=H[V]=!0,H[T]=H[R]=H[I]=!1,e.e=r},function(e,t,n){function r(e){return o(e)?i(e):{}}var o=n(2),i=Object.create;e.e=r},function(e,t,n){function r(e,t,n,s){s||(s=[]);for(var u=-1,d=e.length;++u<d;){var f=e[u];t>0&&c(f)&&(n||a(f)||i(f))?t>1?r(f,t-1,n,s):o(s,f):n||(s[s.length]=f)}return s}var o=n(91),i=n(25),a=n(5),c=n(27);e.e=r},function(e,t,n){var r=n(116),o=r();e.e=o},function(e,t,n){function r(e,t){return e&&o(e,t,i)}var o=n(96),i=n(45);e.e=r},function(e,t,n){function r(e,t){return i.call(e,t)||"object"==typeof e&&t in e&&null===a(e)}var o=Object.prototype,i=o.hasOwnProperty,a=Object.getPrototypeOf;e.e=r},function(e,t,n){function r(e){return o(Object(e))}var o=Object.keys;e.e=r},function(e,t,n){function r(e){e=null==e?e:Object(e);var t=[];for(var n in e)t.push(n);return t}var o=n(83),i=n(127),a=Object.prototype,c=o?o.enumerate:void 0,s=a.propertyIsEnumerable;c&&!s.call({valueOf:1},"valueOf")&&(r=function(e){return i(c(e))}),e.e=r},function(e,t,n){function r(e,t,n,l,p){if(e!==t){var h=s(t)||d(t)?void 0:f(t);i(h||t,function(i,s){if(h&&(s=i,i=t[s]),u(i))p||(p=new o),c(e,t,s,n,r,l,p);else{var d=l?l(e[s],i,s+"",e,t,p):void 0;void 0===d&&(d=i),a(e,s,d)}})}}var o=n(32),i=n(33),a=n(34),c=n(102),s=n(5),u=n(2),d=n(44),f=n(46);e.e=r},function(e,t,n){function r(e,t,n,r,v,m,g){var y=e[n],b=t[n],_=g.get(b);if(_)return void o(e,n,_);var w=m?m(y,b,n+"",e,t,g):void 0,C=void 0===w;C&&(w=b,s(b)||p(b)?s(y)?w=y:u(y)?w=a(y):(C=!1,w=i(b,!m)):l(b)||c(b)?c(y)?w=h(y):!f(y)||r&&d(y)?(C=!1,w=i(b,!m)):w=y:C=!1),g.set(b,w),C&&v(w,b,r,m,g),g["delete"](b),o(e,n,w)}var o=n(34),i=n(93),a=n(41),c=n(25),s=n(5),u=n(27),d=n(16),f=n(2),l=n(143),p=n(44),h=n(148);e.e=r},function(e,t,n){function r(e,t){return e=Object(e),o(t,function(t,n){return n in e&&(t[n]=e[n]),t},{})}var o=n(20);e.e=r},function(e,t,n){function r(e){return function(t){return null==t?void 0:t[e]}}e.e=r},function(e,t,n){function r(e,t){for(var n=-1,r=Array(e);++n<e;)r[n]=t(n);return r}e.e=r},function(e,t,n){function r(e){return e&&e.Object===Object?e:null}e.e=r},function(e,t,n){function r(e,t){if(t)return e.slice();var n=new e.constructor(e.length);return e.copy(n),n}e.e=r},function(e,t,n){function r(e){return i(a(e),o,new e.constructor)}var o=n(88),i=n(20),a=n(133);e.e=r},function(e,t,n){function r(e){var t=new e.constructor(e.source,o.exec(e));return t.lastIndex=e.lastIndex,t}var o=/\w*$/;e.e=r},function(e,t,n){function r(e){return i(a(e),o,new e.constructor)}var o=n(89),i=n(20),a=n(134);e.e=r},function(e,t,n){function r(e){return a?Object(a.call(e)):{}}var o=n(85),i=o?o.prototype:void 0,a=i?i.valueOf:void 0;e.e=r},function(e,t,n){function r(e,t){var n=t?o(e.buffer):e.buffer;return new e.constructor(n,e.byteOffset,e.length)}var o=n(40);e.e=r},function(e,t,n){function r(e,t,n,r){n||(n={});for(var i=-1,a=t.length;++i<a;){var c=t[i],s=r?r(n[c],e[c],c,n,e):e[c];o(n,c,s)}return n}var o=n(35);e.e=r},function(e,t,n){function r(e,t){return o(e,i(e),t)}var o=n(21),i=n(118);e.e=r},function(e,t,n){function r(e){return i(function(t,n){var r=-1,i=n.length,a=i>1?n[i-1]:void 0,c=i>2?n[2]:void 0;for(a="function"==typeof a?(i--,a):void 0,c&&o(n[0],n[1],c)&&(a=3>i?void 0:a,i=1),t=Object(t);++r<i;){var s=n[r];s&&e(t,s,r,a)}return t})}var o=n(126),i=n(47);e.e=r},function(e,t,n){function r(e){return function(t,n,r){for(var o=-1,i=Object(t),a=r(t),c=a.length;c--;){var s=a[e?c:++o];if(n(i[s],s,i)===!1)break}return t}}e.e=r},function(e,t,n){var r=n(104),o=r("length");e.e=o},function(e,t,n){var r=Object.getOwnPropertySymbols,o=r||function(){return[]};e.e=o},function(e,t,n){function r(e){return p.call(e)}var o=n(4),i=n(84),a=n(87),c="[object Map]",s="[object Object]",u="[object Set]",d="[object WeakMap]",f=Object.prototype,l=Function.prototype.toString,p=f.toString,h=o?l.call(o):"",v=i?l.call(i):"",m=a?l.call(a):"";(o&&r(new o)!=c||i&&r(new i)!=u||a&&r(new a)!=d)&&(r=function(e){var t=p.call(e),n=t==s?e.constructor:null,r="function"==typeof n?l.call(n):"";if(r)switch(r){case h:return c;case v:return u;case m:return d}return t}),e.e=r},function(e,t,n){function r(e,t){return o(e,t)&&delete e[t]}var o=n(42);e.e=r},function(e,t,n){function r(e,t){if(o){var n=e[t];return n===i?void 0:n}return c.call(e,t)?e[t]:void 0}var o=n(14),i="__lodash_hash_undefined__",a=Object.prototype,c=a.hasOwnProperty;e.e=r},function(e,t,n){function r(e,t,n){e[t]=o&&void 0===n?i:n}var o=n(14),i="__lodash_hash_undefined__";e.e=r},function(e,t,n){function r(e){var t=e.length,n=e.constructor(t);return t&&"string"==typeof e[0]&&i.call(e,"index")&&(n.index=e.index,n.input=e.input),n}var o=Object.prototype,i=o.hasOwnProperty;e.e=r},function(e,t,n){function r(e,t,n){var r=e.constructor;switch(t){case y:return o(e);case d:case f:return new r(+e);case b:case _:case w:case C:case E:case T:case R:case S:case O:return u(e,n);case l:return i(e);case p:case m:return new r(e);case h:return a(e);case v:return c(e);case g:return s(e)}}var o=n(40),i=n(108),a=n(109),c=n(110),s=n(111),u=n(112),d="[object Boolean]",f="[object Date]",l="[object Map]",p="[object Number]",h="[object RegExp]",v="[object Set]",m="[object String]",g="[object Symbol]",y="[object ArrayBuffer]",b="[object Float32Array]",_="[object Float64Array]",w="[object Int8Array]",C="[object Int16Array]",E="[object Int32Array]",T="[object Uint8Array]",R="[object Uint8ClampedArray]",S="[object Uint16Array]",O="[object Uint32Array]";e.e=r},function(e,t,n){function r(e){return"function"!=typeof e.constructor||i(e)?{}:o(a(e))}var o=n(94),i=n(24),a=Object.getPrototypeOf;e.e=r},function(e,t,n){function r(e,t,n){if(!c(n))return!1;var r=typeof t;return("number"==r?i(n)&&a(t,n.length):"string"==r&&t in n)?o(n[t],e):!1}var o=n(15),i=n(26),a=n(23),c=n(2);e.e=r},function(e,t,n){function r(e){for(var t,n=[];!(t=e.next()).done;)n.push(t.value);return n}e.e=r},function(e,t,n){function r(){this.__data__={hash:new o,map:i?new i:[],string:new o}}var o=n(81),i=n(4);e.e=r},function(e,t,n){function r(e){var t=this.__data__;return c(e)?a("string"==typeof e?t.string:t.hash,e):o?t.map["delete"](e):i(t.map,e)}var o=n(4),i=n(36),a=n(120),c=n(13);e.e=r},function(e,t,n){function r(e){var t=this.__data__;return c(e)?a("string"==typeof e?t.string:t.hash,e):o?t.map.get(e):i(t.map,e)}var o=n(4),i=n(37),a=n(121),c=n(13);e.e=r},function(e,t,n){function r(e){var t=this.__data__;return c(e)?a("string"==typeof e?t.string:t.hash,e):o?t.map.has(e):i(t.map,e)}var o=n(4),i=n(38),a=n(42),c=n(13);e.e=r},function(e,t,n){function r(e,t){var n=this.__data__;return c(e)?a("string"==typeof e?n.string:n.hash,e,t):o?n.map.set(e,t):i(n.map,e,t),this}var o=n(4),i=n(39),a=n(122),c=n(13);e.e=r},function(e,t,n){function r(e){var t=-1,n=Array(e.size);return e.forEach(function(e,r){n[++t]=[r,e]}),n}e.e=r},function(e,t,n){function r(e){var t=-1,n=Array(e.size);return e.forEach(function(e){n[++t]=e}),n}e.e=r},function(e,t,n){function r(){this.__data__={array:[],map:null}}e.e=r},function(e,t,n){function r(e){var t=this.__data__,n=t.array;return n?o(n,e):t.map["delete"](e)}var o=n(36);e.e=r},function(e,t,n){function r(e){var t=this.__data__,n=t.array;return n?o(n,e):t.map.get(e)}var o=n(37);e.e=r},function(e,t,n){function r(e){var t=this.__data__,n=t.array;return n?o(n,e):t.map.has(e)}var o=n(38);e.e=r},function(e,t,n){function r(e,t){var n=this.__data__,r=n.array;r&&(r.length<a-1?i(r,e,t):(n.array=null,n.map=new o(r)));var c=n.map;return c&&c.set(e,t),this}var o=n(82),i=n(39),a=200;e.e=r},function(e,t,n){function r(e){return function(){return e}}e.e=r},function(e,t,n){(function(e){var r=n(140),o=n(1),i={"function":!0,object:!0},a=i[typeof t]&&t&&!t.nodeType?t:void 0,c=i[typeof e]&&e&&!e.nodeType?e:void 0,s=c&&c.exports===a?a:void 0,u=s?o.Buffer:void 0,d=u?function(e){return e instanceof u}:r(!1);e.e=d}).call(t,n(48)(e))},function(e,t,n){function r(e){return null==e?!1:o(e)?l.test(d.call(e)):a(e)&&(i(e)?l:s).test(e)}var o=n(16),i=n(22),a=n(8),c=/[\\^$.*+?()[\]{}|]/g,s=/^\[object .+?Constructor\]$/,u=Object.prototype,d=Function.prototype.toString,f=u.hasOwnProperty,l=RegExp("^"+d.call(f).replace(c,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$");e.e=r},function(e,t,n){function r(e){if(!i(e)||d.call(e)!=a||o(e))return!1;var t=f(e);if(null===t)return!0;var n=t.constructor;return"function"==typeof n&&n instanceof n&&s.call(n)==u}var o=n(22),i=n(8),a="[object Object]",c=Object.prototype,s=Function.prototype.toString,u=s.call(Object),d=c.toString,f=Object.getPrototypeOf;e.e=r},function(e,t,n){function r(e){return"string"==typeof e||!o(e)&&i(e)&&s.call(e)==a}var o=n(5),i=n(8),a="[object String]",c=Object.prototype,s=c.toString;e.e=r},function(e,t,n){var r=n(95),o=n(103),i=n(47),a=i(function(e,t){return null==e?{}:o(e,r(t,1))});e.e=a},function(e,t,n){function r(e){if(!e)return 0===e?e:0;if(e=o(e),e===i||e===-i){var t=0>e?-1:1;return t*a}var n=e%1;return e===e?n?e-n:e:0}var o=n(147),i=1/0,a=1.7976931348623157e308;e.e=r},function(e,t,n){function r(e){if(i(e)){var t=o(e.valueOf)?e.valueOf():e;e=i(t)?t+"":t}if("string"!=typeof e)return 0===e?e:+e;e=e.replace(c,"");var n=u.test(e);return n||d.test(e)?f(e.slice(2),n?2:8):s.test(e)?a:+e}var o=n(16),i=n(2),a=NaN,c=/^\s+|\s+$/g,s=/^[-+]0x[0-9a-f]+$/i,u=/^0b[01]+$/i,d=/^0o[0-7]+$/i,f=parseInt;e.e=r},function(e,t,n){function r(e){return o(e,i(e))}var o=n(21),i=n(46);e.e=r},function(e,t,n){"use strict";var r={};r.generateIdentifier=function(){return Math.random().toString(36).substr(2,10)},r.localCName=r.generateIdentifier(),r.splitLines=function(e){return e.trim().split("\n").map(function(e){return e.trim()})},r.splitSections=function(e){var t=e.split("\nm=");return t.map(function(e,t){return(t>0?"m="+e:e).trim()+"\r\n"})},r.matchPrefix=function(e,t){return r.splitLines(e).filter(function(e){return 0===e.indexOf(t)})},r.parseCandidate=function(e){var t;t=0===e.indexOf("a=candidate:")?e.substring(12).split(" "):e.substring(10).split(" ");for(var n={foundation:t[0],component:t[1],protocol:t[2].toLowerCase(),priority:parseInt(t[3],10),ip:t[4],port:parseInt(t[5],10),type:t[7]},r=8;r<t.length;r+=2)switch(t[r]){case"raddr":n.relatedAddress=t[r+1];break;case"rport":n.relatedPort=parseInt(t[r+1],10);break;case"tcptype":n.tcpType=t[r+1]}return n},r.writeCandidate=function(e){var t=[];t.push(e.foundation),t.push(e.component),t.push(e.protocol.toUpperCase()),t.push(e.priority),t.push(e.ip),t.push(e.port);var n=e.type;return t.push("typ"),t.push(n),"host"!==n&&e.relatedAddress&&e.relatedPort&&(t.push("raddr"),t.push(e.relatedAddress),t.push("rport"),t.push(e.relatedPort)),e.tcpType&&"tcp"===e.protocol.toLowerCase()&&(t.push("tcptype"),t.push(e.tcpType)),"candidate:"+t.join(" ")},r.parseRtpMap=function(e){var t=e.substr(9).split(" "),n={payloadType:parseInt(t.shift(),10)};return t=t[0].split("/"),n.name=t[0],n.clockRate=parseInt(t[1],10),n.numChannels=3===t.length?parseInt(t[2],10):1,n},r.writeRtpMap=function(e){var t=e.payloadType;return void 0!==e.preferredPayloadType&&(t=e.preferredPayloadType),"a=rtpmap:"+t+" "+e.name+"/"+e.clockRate+(1!==e.numChannels?"/"+e.numChannels:"")+"\r\n"},r.parseExtmap=function(e){var t=e.substr(9).split(" ");return{id:parseInt(t[0],10),uri:t[1]}},r.writeExtmap=function(e){return"a=extmap:"+(e.id||e.preferredId)+" "+e.uri+"\r\n"},r.parseFmtp=function(e){for(var t,n={},r=e.substr(e.indexOf(" ")+1).split(";"),o=0;o<r.length;o++)t=r[o].trim().split("="),n[t[0].trim()]=t[1];return n},r.writeFmtp=function(e){var t="",n=e.payloadType;if(void 0!==e.preferredPayloadType&&(n=e.preferredPayloadType),e.parameters&&Object.keys(e.parameters).length){var r=[];Object.keys(e.parameters).forEach(function(t){r.push(t+"="+e.parameters[t])}),t+="a=fmtp:"+n+" "+r.join(";")+"\r\n"}return t},r.parseRtcpFb=function(e){var t=e.substr(e.indexOf(" ")+1).split(" ");return{type:t.shift(),parameter:t.join(" ")}},r.writeRtcpFb=function(e){var t="",n=e.payloadType;return void 0!==e.preferredPayloadType&&(n=e.preferredPayloadType),e.rtcpFeedback&&e.rtcpFeedback.length&&e.rtcpFeedback.forEach(function(e){t+="a=rtcp-fb:"+n+" "+e.type+(e.parameter&&e.parameter.length?" "+e.parameter:"")+"\r\n"}),t},r.parseSsrcMedia=function(e){var t=e.indexOf(" "),n={ssrc:parseInt(e.substr(7,t-7),10)},r=e.indexOf(":",t);return r>-1?(n.attribute=e.substr(t+1,r-t-1),n.value=e.substr(r+1)):n.attribute=e.substr(t+1),
	n},r.getDtlsParameters=function(e,t){var n=r.splitLines(e);n=n.concat(r.splitLines(t));var o=n.filter(function(e){return 0===e.indexOf("a=fingerprint:")})[0].substr(14),i={role:"auto",fingerprints:[{algorithm:o.split(" ")[0],value:o.split(" ")[1]}]};return i},r.writeDtlsParameters=function(e,t){var n="a=setup:"+t+"\r\n";return e.fingerprints.forEach(function(e){n+="a=fingerprint:"+e.algorithm+" "+e.value+"\r\n"}),n},r.getIceParameters=function(e,t){var n=r.splitLines(e);n=n.concat(r.splitLines(t));var o={usernameFragment:n.filter(function(e){return 0===e.indexOf("a=ice-ufrag:")})[0].substr(12),password:n.filter(function(e){return 0===e.indexOf("a=ice-pwd:")})[0].substr(10)};return o},r.writeIceParameters=function(e){return"a=ice-ufrag:"+e.usernameFragment+"\r\na=ice-pwd:"+e.password+"\r\n"},r.parseRtpParameters=function(e){for(var t={codecs:[],headerExtensions:[],fecMechanisms:[],rtcp:[]},n=r.splitLines(e),o=n[0].split(" "),i=3;i<o.length;i++){var a=o[i],c=r.matchPrefix(e,"a=rtpmap:"+a+" ")[0];if(c){var s=r.parseRtpMap(c),u=r.matchPrefix(e,"a=fmtp:"+a+" ");switch(s.parameters=u.length?r.parseFmtp(u[0]):{},s.rtcpFeedback=r.matchPrefix(e,"a=rtcp-fb:"+a+" ").map(r.parseRtcpFb),t.codecs.push(s),s.name.toUpperCase()){case"RED":case"ULPFEC":t.fecMechanisms.push(s.name.toUpperCase())}}}return r.matchPrefix(e,"a=extmap:").forEach(function(e){t.headerExtensions.push(r.parseExtmap(e))}),t},r.writeRtpDescription=function(e,t){var n="";return n+="m="+e+" ",n+=t.codecs.length>0?"9":"0",n+=" UDP/TLS/RTP/SAVPF ",n+=t.codecs.map(function(e){return void 0!==e.preferredPayloadType?e.preferredPayloadType:e.payloadType}).join(" ")+"\r\n",n+="c=IN IP4 0.0.0.0\r\n",n+="a=rtcp:9 IN IP4 0.0.0.0\r\n",t.codecs.forEach(function(e){n+=r.writeRtpMap(e),n+=r.writeFmtp(e),n+=r.writeRtcpFb(e)}),n+="a=rtcp-mux\r\n"},r.parseRtpEncodingParameters=function(e){var t,n=[],o=r.parseRtpParameters(e),i=-1!==o.fecMechanisms.indexOf("RED"),a=-1!==o.fecMechanisms.indexOf("ULPFEC"),c=r.matchPrefix(e,"a=ssrc:").map(function(e){return r.parseSsrcMedia(e)}).filter(function(e){return"cname"===e.attribute}),s=c.length>0&&c[0].ssrc,u=r.matchPrefix(e,"a=ssrc-group:FID").map(function(e){var t=e.split(" ");return t.shift(),t.map(function(e){return parseInt(e,10)})});u.length>0&&u[0].length>1&&u[0][0]===s&&(t=u[0][1]),o.codecs.forEach(function(e){if("RTX"===e.name.toUpperCase()&&e.parameters.apt){var r={ssrc:s,codecPayloadType:parseInt(e.parameters.apt,10),rtx:{payloadType:e.payloadType,ssrc:t}};n.push(r),i&&(r=JSON.parse(JSON.stringify(r)),r.fec={ssrc:t,mechanism:a?"red+ulpfec":"red"},n.push(r))}}),0===n.length&&s&&n.push({ssrc:s});var d=r.matchPrefix(e,"b=");return d.length&&(0===d[0].indexOf("b=TIAS:")?d=parseInt(d[0].substr(7),10):0===d[0].indexOf("b=AS:")&&(d=parseInt(d[0].substr(5),10)),n.forEach(function(e){e.maxBitrate=d})),n},r.writeSessionBoilerplate=function(){return"v=0\r\no=thisisadapterortc 8169639915646943137 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\n"},r.writeMediaSection=function(e,t,n,o){var i=r.writeRtpDescription(e.kind,t);if(i+=r.writeIceParameters(e.iceGatherer.getLocalParameters()),i+=r.writeDtlsParameters(e.dtlsTransport.getLocalParameters(),"offer"===n?"actpass":"active"),i+="a=mid:"+e.mid+"\r\n",i+=e.rtpSender&&e.rtpReceiver?"a=sendrecv\r\n":e.rtpSender?"a=sendonly\r\n":e.rtpReceiver?"a=recvonly\r\n":"a=inactive\r\n",e.rtpSender){var a="msid:"+o.id+" "+e.rtpSender.track.id+"\r\n";i+="a="+a,i+="a=ssrc:"+e.sendEncodingParameters[0].ssrc+" "+a}return i+="a=ssrc:"+e.sendEncodingParameters[0].ssrc+" cname:"+r.localCName+"\r\n"},r.getDirection=function(e,t){for(var n=r.splitLines(e),o=0;o<n.length;o++)switch(n[o]){case"a=sendrecv":case"a=sendonly":case"a=recvonly":case"a=inactive":return n[o].substr(2)}return t?r.getDirection(t):"sendrecv"},e.e=r},function(e,t,n){"use strict";!function(){var t=n(0).log,r=n(0).browserDetails;e.e.browserDetails=r,e.e.extractVersion=n(0).extractVersion,e.e.disableLog=n(0).disableLog;var o=n(151)||null,i=n(153)||null,a=n(155)||null,c=n(157)||null;switch(r.browser){case"opera":case"chrome":if(!o||!o.shimPeerConnection)return void t("Chrome shim is not included in this adapter release.");t("adapter.js shimming chrome."),e.e.browserShim=o,o.shimGetUserMedia(),o.shimMediaStream(),o.shimSourceObject(),o.shimPeerConnection(),o.shimOnTrack();break;case"firefox":if(!a||!a.shimPeerConnection)return void t("Firefox shim is not included in this adapter release.");t("adapter.js shimming firefox."),e.e.browserShim=a,a.shimGetUserMedia(),a.shimSourceObject(),a.shimPeerConnection(),a.shimOnTrack();break;case"edge":if(!i||!i.shimPeerConnection)return void t("MS edge shim is not included in this adapter release.");t("adapter.js shimming edge."),e.e.browserShim=i,i.shimGetUserMedia(),i.shimPeerConnection();break;case"safari":if(!c)return void t("Safari shim is not included in this adapter release.");t("adapter.js shimming safari."),e.e.browserShim=c,c.shimGetUserMedia();break;default:t("Unsupported browser!")}}()},function(e,t,n){"use strict";var r=n(0).log,o=n(0).browserDetails,i={shimMediaStream:function(){window.MediaStream=window.MediaStream||window.webkitMediaStream},shimOnTrack:function(){"object"!=typeof window||!window.RTCPeerConnection||"ontrack"in window.RTCPeerConnection.prototype||Object.defineProperty(window.RTCPeerConnection.prototype,"ontrack",{get:function(){return this._ontrack},set:function(e){var t=this;this._ontrack&&(this.removeEventListener("track",this._ontrack),this.removeEventListener("addstream",this._ontrackpoly)),this.addEventListener("track",this._ontrack=e),this.addEventListener("addstream",this._ontrackpoly=function(e){e.stream.addEventListener("addtrack",function(n){var r=new Event("track");r.track=n.track,r.receiver={track:n.track},r.streams=[e.stream],t.dispatchEvent(r)}),e.stream.getTracks().forEach(function(t){var n=new Event("track");n.track=t,n.receiver={track:t},n.streams=[e.stream],this.dispatchEvent(n)}.bind(this))}.bind(this))}})},shimSourceObject:function(){"object"==typeof window&&(!window.HTMLMediaElement||"srcObject"in window.HTMLMediaElement.prototype||Object.defineProperty(window.HTMLMediaElement.prototype,"srcObject",{get:function(){return this._srcObject},set:function(e){var t=this;return this._srcObject=e,this.src&&URL.revokeObjectURL(this.src),e?(this.src=URL.createObjectURL(e),e.addEventListener("addtrack",function(){t.src&&URL.revokeObjectURL(t.src),t.src=URL.createObjectURL(e)}),void e.addEventListener("removetrack",function(){t.src&&URL.revokeObjectURL(t.src),t.src=URL.createObjectURL(e)})):void(this.src="")}}))},shimPeerConnection:function(){window.RTCPeerConnection=function(e,t){r("PeerConnection"),e&&e.iceTransportPolicy&&(e.iceTransports=e.iceTransportPolicy);var n=new webkitRTCPeerConnection(e,t),o=n.getStats.bind(n);return n.getStats=function(e,t,n){var r=this,i=arguments;if(arguments.length>0&&"function"==typeof e)return o(e,t);var a=function(e){var t={},n=e.result();return n.forEach(function(e){var n={id:e.id,timestamp:e.timestamp,type:e.type};e.names().forEach(function(t){n[t]=e.stat(t)}),t[n.id]=n}),t},c=function(e,t){var n=new Map(Object.keys(e).map(function(t){return[t,e[t]]}));return t=t||e,Object.keys(t).forEach(function(e){n[e]=t[e]}),n};if(arguments.length>=2){var s=function(e){i[1](c(a(e)))};return o.apply(this,[s,arguments[0]])}return new Promise(function(t,n){1===i.length&&"object"==typeof e?o.apply(r,[function(e){t(c(a(e)))},n]):o.apply(r,[function(e){t(c(a(e),e.result()))},n])}).then(t,n)},n},window.RTCPeerConnection.prototype=webkitRTCPeerConnection.prototype,webkitRTCPeerConnection.generateCertificate&&Object.defineProperty(window.RTCPeerConnection,"generateCertificate",{get:function(){return webkitRTCPeerConnection.generateCertificate}}),o.version<51&&(["createOffer","createAnswer"].forEach(function(e){var t=webkitRTCPeerConnection.prototype[e];webkitRTCPeerConnection.prototype[e]=function(){var e=this;if(arguments.length<1||1===arguments.length&&"object"==typeof arguments[0]){var n=1===arguments.length?arguments[0]:void 0;return new Promise(function(r,o){t.apply(e,[r,o,n])})}return t.apply(this,arguments)}}),["setLocalDescription","setRemoteDescription","addIceCandidate"].forEach(function(e){var t=webkitRTCPeerConnection.prototype[e];webkitRTCPeerConnection.prototype[e]=function(){var e=arguments,n=this,r=new Promise(function(r,o){t.apply(n,[e[0],r,o])});return e.length<2?r:r.then(function(){e[1].apply(null,[])},function(t){e.length>=3&&e[2].apply(null,[t])})}}));var e=RTCPeerConnection.prototype.addIceCandidate;RTCPeerConnection.prototype.addIceCandidate=function(){return null===arguments[0]?Promise.resolve():e.apply(this,arguments)},["setLocalDescription","setRemoteDescription","addIceCandidate"].forEach(function(e){var t=webkitRTCPeerConnection.prototype[e];webkitRTCPeerConnection.prototype[e]=function(){return arguments[0]=new("addIceCandidate"===e?RTCIceCandidate:RTCSessionDescription)(arguments[0]),t.apply(this,arguments)}})},attachMediaStream:function(e,t){r("DEPRECATED, attachMediaStream will soon be removed."),o.version>=43?e.srcObject=t:"undefined"!=typeof e.src?e.src=URL.createObjectURL(t):r("Error attaching stream to element.")},reattachMediaStream:function(e,t){r("DEPRECATED, reattachMediaStream will soon be removed."),o.version>=43?e.srcObject=t.srcObject:e.src=t.src}};e.e={shimMediaStream:i.shimMediaStream,shimOnTrack:i.shimOnTrack,shimSourceObject:i.shimSourceObject,shimPeerConnection:i.shimPeerConnection,shimGetUserMedia:n(152),attachMediaStream:i.attachMediaStream,reattachMediaStream:i.reattachMediaStream}},function(e,t,n){"use strict";var r=n(0).log;e.e=function(){var e=function(e){if("object"!=typeof e||e.mandatory||e.optional)return e;var t={};return Object.keys(e).forEach(function(n){if("require"!==n&&"advanced"!==n&&"mediaSource"!==n){var r="object"==typeof e[n]?e[n]:{ideal:e[n]};void 0!==r.exact&&"number"==typeof r.exact&&(r.min=r.max=r.exact);var o=function(e,t){return e?e+t.charAt(0).toUpperCase()+t.slice(1):"deviceId"===t?"sourceId":t};if(void 0!==r.ideal){t.optional=t.optional||[];var i={};"number"==typeof r.ideal?(i[o("min",n)]=r.ideal,t.optional.push(i),i={},i[o("max",n)]=r.ideal,t.optional.push(i)):(i[o("",n)]=r.ideal,t.optional.push(i))}void 0!==r.exact&&"number"!=typeof r.exact?(t.mandatory=t.mandatory||{},t.mandatory[o("",n)]=r.exact):["min","max"].forEach(function(e){void 0!==r[e]&&(t.mandatory=t.mandatory||{},t.mandatory[o(e,n)]=r[e])})}}),e.advanced&&(t.optional=(t.optional||[]).concat(e.advanced)),t},t=function(t,n){if(t=JSON.parse(JSON.stringify(t)),t&&t.audio&&(t.audio=e(t.audio)),t&&"object"==typeof t.video){var o=t.video.facingMode;if(o=o&&("object"==typeof o?o:{ideal:o}),o&&("user"===o.exact||"environment"===o.exact||"user"===o.ideal||"environment"===o.ideal)&&(!navigator.mediaDevices.getSupportedConstraints||!navigator.mediaDevices.getSupportedConstraints().facingMode)&&(delete t.video.facingMode,"environment"===o.exact||"environment"===o.ideal))return navigator.mediaDevices.enumerateDevices().then(function(i){i=i.filter(function(e){return"videoinput"===e.kind});var a=i.find(function(e){return-1!==e.label.toLowerCase().indexOf("back")})||i.length&&i[i.length-1];return a&&(t.video.deviceId=o.exact?{exact:a.deviceId}:{ideal:a.deviceId}),t.video=e(t.video),r("chrome: "+JSON.stringify(t)),n(t)});t.video=e(t.video)}return r("chrome: "+JSON.stringify(t)),n(t)},n=function(e){return{name:{PermissionDeniedError:"NotAllowedError",ConstraintNotSatisfiedError:"OverconstrainedError"}[e.name]||e.name,message:e.message,constraint:e.constraintName,toString:function(){return this.name+(this.message&&": ")+this.message}}},o=function(e,r,o){t(e,function(e){navigator.webkitGetUserMedia(e,r,function(e){o(n(e))})})};navigator.getUserMedia=o;var i=function(e){return new Promise(function(t,n){navigator.getUserMedia(e,t,n)})};if(navigator.mediaDevices||(navigator.mediaDevices={getUserMedia:i,enumerateDevices:function(){return new Promise(function(e){var t={audio:"audioinput",video:"videoinput"};return MediaStreamTrack.getSources(function(n){e(n.map(function(e){return{label:e.label,kind:t[e.kind],deviceId:e.id,groupId:""}}))})})}}),navigator.mediaDevices.getUserMedia){var a=navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);navigator.mediaDevices.getUserMedia=function(e){return t(e,function(e){return a(e)["catch"](function(e){return Promise.reject(n(e))})})}}else navigator.mediaDevices.getUserMedia=function(e){return i(e)};"undefined"==typeof navigator.mediaDevices.addEventListener&&(navigator.mediaDevices.addEventListener=function(){r("Dummy mediaDevices.addEventListener called.")}),"undefined"==typeof navigator.mediaDevices.removeEventListener&&(navigator.mediaDevices.removeEventListener=function(){r("Dummy mediaDevices.removeEventListener called.")})}},function(e,t,n){"use strict";var r=n(149),o=n(0).log,i={shimPeerConnection:function(){window.RTCIceGatherer&&(window.RTCIceCandidate||(window.RTCIceCandidate=function(e){return e}),window.RTCSessionDescription||(window.RTCSessionDescription=function(e){return e})),window.RTCPeerConnection=function(e){var t=this,n=document.createDocumentFragment();if(["addEventListener","removeEventListener","dispatchEvent"].forEach(function(e){t[e]=n[e].bind(n)}),this.onicecandidate=null,this.onaddstream=null,this.ontrack=null,this.onremovestream=null,this.onsignalingstatechange=null,this.oniceconnectionstatechange=null,this.onnegotiationneeded=null,this.ondatachannel=null,this.localStreams=[],this.remoteStreams=[],this.getLocalStreams=function(){return t.localStreams},this.getRemoteStreams=function(){return t.remoteStreams},this.localDescription=new RTCSessionDescription({type:"",sdp:""}),this.remoteDescription=new RTCSessionDescription({type:"",sdp:""}),this.signalingState="stable",this.iceConnectionState="new",this.iceGatheringState="new",this.iceOptions={gatherPolicy:"all",iceServers:[]},e&&e.iceTransportPolicy)switch(e.iceTransportPolicy){case"all":case"relay":this.iceOptions.gatherPolicy=e.iceTransportPolicy;break;case"none":throw new TypeError('iceTransportPolicy "none" not supported')}e&&e.iceServers&&(this.iceOptions.iceServers=e.iceServers.filter(function(e){return e&&e.urls?(e.urls=e.urls.filter(function(e){return 0===e.indexOf("turn:")&&-1!==e.indexOf("transport=udp")})[0],!!e.urls):!1})),this.transceivers=[],this._localIceCandidatesBuffer=[]},window.RTCPeerConnection.prototype._emitBufferedCandidates=function(){var e=this,t=r.splitSections(e.localDescription.sdp);this._localIceCandidatesBuffer.forEach(function(n){var r=!n.candidate||0===Object.keys(n.candidate).length;if(r)for(var o=1;o<t.length;o++)-1===t[o].indexOf("\r\na=end-of-candidates\r\n")&&(t[o]+="a=end-of-candidates\r\n");else-1===n.candidate.candidate.indexOf("typ endOfCandidates")&&(t[n.candidate.sdpMLineIndex+1]+="a="+n.candidate.candidate+"\r\n");if(e.localDescription.sdp=t.join(""),e.dispatchEvent(n),null!==e.onicecandidate&&e.onicecandidate(n),!n.candidate&&"complete"!==e.iceGatheringState){var i=e.transceivers.every(function(e){return e.iceGatherer&&"completed"===e.iceGatherer.state});i&&(e.iceGatheringState="complete")}}),this._localIceCandidatesBuffer=[]},window.RTCPeerConnection.prototype.addStream=function(e){this.localStreams.push(e.clone()),this._maybeFireNegotiationNeeded()},window.RTCPeerConnection.prototype.removeStream=function(e){var t=this.localStreams.indexOf(e);t>-1&&(this.localStreams.splice(t,1),this._maybeFireNegotiationNeeded())},window.RTCPeerConnection.prototype.getSenders=function(){return this.transceivers.filter(function(e){return!!e.rtpSender}).map(function(e){return e.rtpSender})},window.RTCPeerConnection.prototype.getReceivers=function(){return this.transceivers.filter(function(e){return!!e.rtpReceiver}).map(function(e){return e.rtpReceiver})},window.RTCPeerConnection.prototype._getCommonCapabilities=function(e,t){var n={codecs:[],headerExtensions:[],fecMechanisms:[]};return e.codecs.forEach(function(e){for(var r=0;r<t.codecs.length;r++){var o=t.codecs[r];if(e.name.toLowerCase()===o.name.toLowerCase()&&e.clockRate===o.clockRate&&e.numChannels===o.numChannels){n.codecs.push(o);break}}}),e.headerExtensions.forEach(function(e){for(var r=0;r<t.headerExtensions.length;r++){var o=t.headerExtensions[r];if(e.uri===o.uri){n.headerExtensions.push(o);break}}}),n},window.RTCPeerConnection.prototype._createIceAndDtlsTransports=function(e,t){var n=this,o=new RTCIceGatherer(n.iceOptions),i=new RTCIceTransport(o);o.onlocalcandidate=function(a){var c=new Event("icecandidate");c.candidate={sdpMid:e,sdpMLineIndex:t};var s=a.candidate,u=!s||0===Object.keys(s).length;u?(void 0===o.state&&(o.state="completed"),c.candidate.candidate="candidate:1 1 udp 1 0.0.0.0 9 typ endOfCandidates"):(s.component="RTCP"===i.component?2:1,c.candidate.candidate=r.writeCandidate(s));var d=n.transceivers.every(function(e){return e.iceGatherer&&"completed"===e.iceGatherer.state});switch(n.iceGatheringState){case"new":n._localIceCandidatesBuffer.push(c),u&&d&&n._localIceCandidatesBuffer.push(new Event("icecandidate"));break;case"gathering":n._emitBufferedCandidates(),n.dispatchEvent(c),null!==n.onicecandidate&&n.onicecandidate(c),d&&(n.dispatchEvent(new Event("icecandidate")),null!==n.onicecandidate&&n.onicecandidate(new Event("icecandidate")),n.iceGatheringState="complete");break;case"complete":}},i.onicestatechange=function(){n._updateConnectionState()};var a=new RTCDtlsTransport(i);return a.ondtlsstatechange=function(){n._updateConnectionState()},a.onerror=function(){a.state="failed",n._updateConnectionState()},{iceGatherer:o,iceTransport:i,dtlsTransport:a}},window.RTCPeerConnection.prototype._transceive=function(e,t,n){var o=this._getCommonCapabilities(e.localCapabilities,e.remoteCapabilities);t&&e.rtpSender&&(o.encodings=e.sendEncodingParameters,o.rtcp={cname:r.localCName},e.recvEncodingParameters.length&&(o.rtcp.ssrc=e.recvEncodingParameters[0].ssrc),e.rtpSender.send(o)),n&&e.rtpReceiver&&(o.encodings=e.recvEncodingParameters,o.rtcp={cname:e.cname},e.sendEncodingParameters.length&&(o.rtcp.ssrc=e.sendEncodingParameters[0].ssrc),e.rtpReceiver.receive(o))},window.RTCPeerConnection.prototype.setLocalDescription=function(e){var t,n,o=this;if("offer"===e.type)this._pendingOffer&&(t=r.splitSections(e.sdp),n=t.shift(),t.forEach(function(e,t){var n=r.parseRtpParameters(e);o._pendingOffer[t].localCapabilities=n}),this.transceivers=this._pendingOffer,delete this._pendingOffer);else if("answer"===e.type){t=r.splitSections(o.remoteDescription.sdp),n=t.shift();var i=r.matchPrefix(n,"a=ice-lite").length>0;t.forEach(function(e,t){var a=o.transceivers[t],c=a.iceGatherer,s=a.iceTransport,u=a.dtlsTransport,d=a.localCapabilities,f=a.remoteCapabilities,l="0"===e.split("\n",1)[0].split(" ",2)[1];if(!l){var p=r.getIceParameters(e,n);if(i){var h=r.matchPrefix(e,"a=candidate:").map(function(e){return r.parseCandidate(e)}).filter(function(e){return"1"===e.component});s.setRemoteCandidates(h)}s.start(c,p,i?"controlling":"controlled");var v=r.getDtlsParameters(e,n);i&&(v.role="server"),u.start(v);var m=o._getCommonCapabilities(d,f);o._transceive(a,m.codecs.length>0,!1)}})}switch(this.localDescription={type:e.type,sdp:e.sdp},e.type){case"offer":this._updateSignalingState("have-local-offer");break;case"answer":this._updateSignalingState("stable");break;default:throw new TypeError('unsupported type "'+e.type+'"')}var a=arguments.length>1&&"function"==typeof arguments[1];if(a){var c=arguments[1];window.setTimeout(function(){c(),"new"===o.iceGatheringState&&(o.iceGatheringState="gathering"),o._emitBufferedCandidates()},0)}var s=Promise.resolve();return s.then(function(){a||("new"===o.iceGatheringState&&(o.iceGatheringState="gathering"),window.setTimeout(o._emitBufferedCandidates.bind(o),500))}),s},window.RTCPeerConnection.prototype.setRemoteDescription=function(e){var t=this,n=new MediaStream,o=[],i=r.splitSections(e.sdp),a=i.shift(),c=r.matchPrefix(a,"a=ice-lite").length>0;switch(i.forEach(function(i,s){var u,d,f,l,p,h,v,m,g,y,b,_,w=r.splitLines(i),C=w[0].substr(2).split(" "),E=C[0],T="0"===C[1],R=r.getDirection(i,a),S=r.parseRtpParameters(i);T||(b=r.getIceParameters(i,a),_=r.getDtlsParameters(i,a),_.role="client"),m=r.parseRtpEncodingParameters(i);var O=r.matchPrefix(i,"a=mid:");O=O.length?O[0].substr(6):r.generateIdentifier();var x,D=r.matchPrefix(i,"a=ssrc:").map(function(e){return r.parseSsrcMedia(e)}).filter(function(e){return"cname"===e.attribute})[0];D&&(x=D.value);var P=r.matchPrefix(i,"a=end-of-candidates").length>0,A=r.matchPrefix(i,"a=candidate:").map(function(e){return r.parseCandidate(e)}).filter(function(e){return"1"===e.component});if("offer"!==e.type||T)"answer"!==e.type||T||(u=t.transceivers[s],d=u.iceGatherer,f=u.iceTransport,l=u.dtlsTransport,p=u.rtpSender,h=u.rtpReceiver,v=u.sendEncodingParameters,g=u.localCapabilities,t.transceivers[s].recvEncodingParameters=m,t.transceivers[s].remoteCapabilities=S,t.transceivers[s].cname=x,(c||P)&&f.setRemoteCandidates(A),f.start(d,b,"controlling"),l.start(_),t._transceive(u,"sendrecv"===R||"recvonly"===R,"sendrecv"===R||"sendonly"===R),!h||"sendrecv"!==R&&"sendonly"!==R?delete u.rtpReceiver:(y=h.track,o.push([y,h]),n.addTrack(y)));else{var M=t._createIceAndDtlsTransports(O,s);if(P&&M.iceTransport.setRemoteCandidates(A),g=RTCRtpReceiver.getCapabilities(E),v=[{ssrc:1001*(2*s+2)}],h=new RTCRtpReceiver(M.dtlsTransport,E),y=h.track,o.push([y,h]),n.addTrack(y),t.localStreams.length>0&&t.localStreams[0].getTracks().length>=s){var j=t.localStreams[0].getTracks()[s];p=new RTCRtpSender(j,M.dtlsTransport)}t.transceivers[s]={iceGatherer:M.iceGatherer,iceTransport:M.iceTransport,dtlsTransport:M.dtlsTransport,localCapabilities:g,remoteCapabilities:S,rtpSender:p,rtpReceiver:h,kind:E,mid:O,cname:x,sendEncodingParameters:v,recvEncodingParameters:m},t._transceive(t.transceivers[s],!1,"sendrecv"===R||"sendonly"===R)}}),this.remoteDescription={type:e.type,sdp:e.sdp},e.type){case"offer":this._updateSignalingState("have-remote-offer");break;case"answer":this._updateSignalingState("stable");break;default:throw new TypeError('unsupported type "'+e.type+'"')}return n.getTracks().length&&(t.remoteStreams.push(n),window.setTimeout(function(){var e=new Event("addstream");e.stream=n,t.dispatchEvent(e),null!==t.onaddstream&&window.setTimeout(function(){t.onaddstream(e)},0),o.forEach(function(r){var o=r[0],i=r[1],a=new Event("track");a.track=o,a.receiver=i,a.streams=[n],t.dispatchEvent(e),null!==t.ontrack&&window.setTimeout(function(){t.ontrack(a)},0)})},0)),arguments.length>1&&"function"==typeof arguments[1]&&window.setTimeout(arguments[1],0),Promise.resolve()},window.RTCPeerConnection.prototype.close=function(){this.transceivers.forEach(function(e){e.iceTransport&&e.iceTransport.stop(),e.dtlsTransport&&e.dtlsTransport.stop(),e.rtpSender&&e.rtpSender.stop(),e.rtpReceiver&&e.rtpReceiver.stop()}),this._updateSignalingState("closed")},window.RTCPeerConnection.prototype._updateSignalingState=function(e){this.signalingState=e;var t=new Event("signalingstatechange");this.dispatchEvent(t),null!==this.onsignalingstatechange&&this.onsignalingstatechange(t)},window.RTCPeerConnection.prototype._maybeFireNegotiationNeeded=function(){var e=new Event("negotiationneeded");this.dispatchEvent(e),null!==this.onnegotiationneeded&&this.onnegotiationneeded(e)},window.RTCPeerConnection.prototype._updateConnectionState=function(){var e,t=this,n={"new":0,closed:0,connecting:0,checking:0,connected:0,completed:0,failed:0};if(this.transceivers.forEach(function(e){n[e.iceTransport.state]++,n[e.dtlsTransport.state]++}),n.connected+=n.completed,e="new",n.failed>0?e="failed":n.connecting>0||n.checking>0?e="connecting":n.disconnected>0?e="disconnected":n["new"]>0?e="new":(n.connected>0||n.completed>0)&&(e="connected"),e!==t.iceConnectionState){t.iceConnectionState=e;var r=new Event("iceconnectionstatechange");this.dispatchEvent(r),null!==this.oniceconnectionstatechange&&this.oniceconnectionstatechange(r)}},window.RTCPeerConnection.prototype.createOffer=function(){var e=this;if(this._pendingOffer)throw new Error("createOffer called while there is a pending offer.");var t;1===arguments.length&&"function"!=typeof arguments[0]?t=arguments[0]:3===arguments.length&&(t=arguments[2]);var n=[],o=0,i=0;if(this.localStreams.length&&(o=this.localStreams[0].getAudioTracks().length,i=this.localStreams[0].getVideoTracks().length),t){if(t.mandatory||t.optional)throw new TypeError("Legacy mandatory/optional constraints not supported.");void 0!==t.offerToReceiveAudio&&(o=t.offerToReceiveAudio),void 0!==t.offerToReceiveVideo&&(i=t.offerToReceiveVideo)}for(this.localStreams.length&&this.localStreams[0].getTracks().forEach(function(e){n.push({kind:e.kind,track:e,wantReceive:"audio"===e.kind?o>0:i>0}),"audio"===e.kind?o--:"video"===e.kind&&i--});o>0||i>0;)o>0&&(n.push({kind:"audio",wantReceive:!0}),o--),i>0&&(n.push({kind:"video",wantReceive:!0}),i--);var a=r.writeSessionBoilerplate(),c=[];n.forEach(function(t,n){var o,i,s=t.track,u=t.kind,d=r.generateIdentifier(),f=e._createIceAndDtlsTransports(d,n),l=RTCRtpSender.getCapabilities(u),p=[{ssrc:1001*(2*n+1)}];s&&(o=new RTCRtpSender(s,f.dtlsTransport)),t.wantReceive&&(i=new RTCRtpReceiver(f.dtlsTransport,u)),c[n]={iceGatherer:f.iceGatherer,iceTransport:f.iceTransport,dtlsTransport:f.dtlsTransport,localCapabilities:l,remoteCapabilities:null,rtpSender:o,rtpReceiver:i,kind:u,mid:d,sendEncodingParameters:p,recvEncodingParameters:null};var h=c[n];a+=r.writeMediaSection(h,h.localCapabilities,"offer",e.localStreams[0])}),this._pendingOffer=c;var s=new RTCSessionDescription({type:"offer",sdp:a});return arguments.length&&"function"==typeof arguments[0]&&window.setTimeout(arguments[0],0,s),Promise.resolve(s)},window.RTCPeerConnection.prototype.createAnswer=function(){var e=this,t=r.writeSessionBoilerplate();this.transceivers.forEach(function(n){var o=e._getCommonCapabilities(n.localCapabilities,n.remoteCapabilities);t+=r.writeMediaSection(n,o,"answer",e.localStreams[0])});var n=new RTCSessionDescription({type:"answer",sdp:t});return arguments.length&&"function"==typeof arguments[0]&&window.setTimeout(arguments[0],0,n),Promise.resolve(n)},window.RTCPeerConnection.prototype.addIceCandidate=function(e){if(null===e)this.transceivers.forEach(function(e){e.iceTransport.addIceCandidate({})});else{var t=e.sdpMLineIndex;if(e.sdpMid)for(var n=0;n<this.transceivers.length;n++)if(this.transceivers[n].mid===e.sdpMid){t=n;break}var o=this.transceivers[t];if(o){var i=Object.keys(e.candidate).length>0?r.parseCandidate(e.candidate):{};if("tcp"===i.protocol&&0===i.port)return;if("1"!==i.component)return;"endOfCandidates"===i.type&&(i={}),o.iceTransport.addRemoteCandidate(i);var a=r.splitSections(this.remoteDescription.sdp);a[t+1]+=(i.type?e.candidate.trim():"a=end-of-candidates")+"\r\n",this.remoteDescription.sdp=a.join("")}}return arguments.length>1&&"function"==typeof arguments[1]&&window.setTimeout(arguments[1],0),Promise.resolve()},window.RTCPeerConnection.prototype.getStats=function(){var e=[];this.transceivers.forEach(function(t){["rtpSender","rtpReceiver","iceGatherer","iceTransport","dtlsTransport"].forEach(function(n){t[n]&&e.push(t[n].getStats())})});var t=arguments.length>1&&"function"==typeof arguments[1]&&arguments[1];return new Promise(function(n){var r=new Map;Promise.all(e).then(function(e){e.forEach(function(e){Object.keys(e).forEach(function(t){r.set(t,e[t]),r[t]=e[t]})}),t&&window.setTimeout(t,0,r),n(r)})})}},attachMediaStream:function(e,t){o("DEPRECATED, attachMediaStream will soon be removed."),e.srcObject=t},reattachMediaStream:function(e,t){o("DEPRECATED, reattachMediaStream will soon be removed."),e.srcObject=t.srcObject}};e.e={shimPeerConnection:i.shimPeerConnection,shimGetUserMedia:n(154),attachMediaStream:i.attachMediaStream,reattachMediaStream:i.reattachMediaStream}},function(e,t,n){"use strict";e.e=function(){var e=function(e){return{name:{PermissionDeniedError:"NotAllowedError"}[e.name]||e.name,message:e.message,constraint:e.constraint,toString:function(){return this.name}}},t=navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);navigator.mediaDevices.getUserMedia=function(n){return t(n)["catch"](function(t){return Promise.reject(e(t))})}}},function(e,t,n){"use strict";var r=n(0).log,o=n(0).browserDetails,i={shimOnTrack:function(){"object"!=typeof window||!window.RTCPeerConnection||"ontrack"in window.RTCPeerConnection.prototype||Object.defineProperty(window.RTCPeerConnection.prototype,"ontrack",{get:function(){return this._ontrack},set:function(e){this._ontrack&&(this.removeEventListener("track",this._ontrack),this.removeEventListener("addstream",this._ontrackpoly)),this.addEventListener("track",this._ontrack=e),this.addEventListener("addstream",this._ontrackpoly=function(e){e.stream.getTracks().forEach(function(t){var n=new Event("track");n.track=t,n.receiver={track:t},n.streams=[e.stream],this.dispatchEvent(n)}.bind(this))}.bind(this))}})},shimSourceObject:function(){"object"==typeof window&&(!window.HTMLMediaElement||"srcObject"in window.HTMLMediaElement.prototype||Object.defineProperty(window.HTMLMediaElement.prototype,"srcObject",{get:function(){return this.mozSrcObject},set:function(e){this.mozSrcObject=e}}))},shimPeerConnection:function(){if("object"==typeof window&&(window.RTCPeerConnection||window.mozRTCPeerConnection)){window.RTCPeerConnection||(window.RTCPeerConnection=function(e,t){if(o.version<38&&e&&e.iceServers){for(var n=[],r=0;r<e.iceServers.length;r++){var i=e.iceServers[r];if(i.hasOwnProperty("urls"))for(var a=0;a<i.urls.length;a++){var c={url:i.urls[a]};0===i.urls[a].indexOf("turn")&&(c.username=i.username,c.credential=i.credential),n.push(c)}else n.push(e.iceServers[r])}e.iceServers=n}return new mozRTCPeerConnection(e,t)},window.RTCPeerConnection.prototype=mozRTCPeerConnection.prototype,mozRTCPeerConnection.generateCertificate&&Object.defineProperty(window.RTCPeerConnection,"generateCertificate",{get:function(){return mozRTCPeerConnection.generateCertificate}}),window.RTCSessionDescription=mozRTCSessionDescription,window.RTCIceCandidate=mozRTCIceCandidate),["setLocalDescription","setRemoteDescription","addIceCandidate"].forEach(function(e){var t=RTCPeerConnection.prototype[e];RTCPeerConnection.prototype[e]=function(){return arguments[0]=new("addIceCandidate"===e?RTCIceCandidate:RTCSessionDescription)(arguments[0]),t.apply(this,arguments)}});var e=RTCPeerConnection.prototype.addIceCandidate;RTCPeerConnection.prototype.addIceCandidate=function(){return null===arguments[0]?Promise.resolve():e.apply(this,arguments)};var t=function(e){var t=new Map;return Object.keys(e).forEach(function(n){t.set(n,e[n]),t[n]=e[n]}),t},n=RTCPeerConnection.prototype.getStats;RTCPeerConnection.prototype.getStats=function(e,r,o){return n.apply(this,[e||null]).then(function(e){return t(e)}).then(r,o)}}},shimGetUserMedia:function(){var e=function(e,t,n){var i=function(e){if("object"!=typeof e||e.require)return e;var t=[];return Object.keys(e).forEach(function(n){if("require"!==n&&"advanced"!==n&&"mediaSource"!==n){var r=e[n]="object"==typeof e[n]?e[n]:{ideal:e[n]};if(void 0===r.min&&void 0===r.max&&void 0===r.exact||t.push(n),void 0!==r.exact&&("number"==typeof r.exact?r.min=r.max=r.exact:e[n]=r.exact,delete r.exact),void 0!==r.ideal){e.advanced=e.advanced||[];var o={};"number"==typeof r.ideal?o[n]={min:r.ideal,max:r.ideal}:o[n]=r.ideal,e.advanced.push(o),delete r.ideal,Object.keys(r).length||delete e[n]}}}),t.length&&(e.require=t),e};return e=JSON.parse(JSON.stringify(e)),o.version<38&&(r("spec: "+JSON.stringify(e)),e.audio&&(e.audio=i(e.audio)),e.video&&(e.video=i(e.video)),r("ff37: "+JSON.stringify(e))),navigator.mozGetUserMedia(e,t,n)};navigator.getUserMedia=e;var t=function(e){return new Promise(function(t,n){navigator.getUserMedia(e,t,n)})};if(navigator.mediaDevices||(navigator.mediaDevices={getUserMedia:t,addEventListener:function(){},removeEventListener:function(){}}),navigator.mediaDevices.enumerateDevices=navigator.mediaDevices.enumerateDevices||function(){return new Promise(function(e){
	var t=[{kind:"audioinput",deviceId:"default",label:"",groupId:""},{kind:"videoinput",deviceId:"default",label:"",groupId:""}];e(t)})},o.version<41){var n=navigator.mediaDevices.enumerateDevices.bind(navigator.mediaDevices);navigator.mediaDevices.enumerateDevices=function(){return n().then(void 0,function(e){if("NotFoundError"===e.name)return[];throw e})}}},attachMediaStream:function(e,t){r("DEPRECATED, attachMediaStream will soon be removed."),e.srcObject=t},reattachMediaStream:function(e,t){r("DEPRECATED, reattachMediaStream will soon be removed."),e.srcObject=t.srcObject}};e.e={shimOnTrack:i.shimOnTrack,shimSourceObject:i.shimSourceObject,shimPeerConnection:i.shimPeerConnection,shimGetUserMedia:n(156),attachMediaStream:i.attachMediaStream,reattachMediaStream:i.reattachMediaStream}},function(e,t,n){"use strict";var r=n(0).log,o=n(0).browserDetails;e.e=function(){var e=function(e){return{name:{SecurityError:"NotAllowedError",PermissionDeniedError:"NotAllowedError"}[e.name]||e.name,message:{"The operation is insecure.":"The request is not allowed by the user agent or the platform in the current context."}[e.message]||e.message,constraint:e.constraint,toString:function(){return this.name+(this.message&&": ")+this.message}}},t=function(t,n,i){var a=function(e){if("object"!=typeof e||e.require)return e;var t=[];return Object.keys(e).forEach(function(n){if("require"!==n&&"advanced"!==n&&"mediaSource"!==n){var r=e[n]="object"==typeof e[n]?e[n]:{ideal:e[n]};if(void 0===r.min&&void 0===r.max&&void 0===r.exact||t.push(n),void 0!==r.exact&&("number"==typeof r.exact?r.min=r.max=r.exact:e[n]=r.exact,delete r.exact),void 0!==r.ideal){e.advanced=e.advanced||[];var o={};"number"==typeof r.ideal?o[n]={min:r.ideal,max:r.ideal}:o[n]=r.ideal,e.advanced.push(o),delete r.ideal,Object.keys(r).length||delete e[n]}}}),t.length&&(e.require=t),e};return t=JSON.parse(JSON.stringify(t)),o.version<38&&(r("spec: "+JSON.stringify(t)),t.audio&&(t.audio=a(t.audio)),t.video&&(t.video=a(t.video)),r("ff37: "+JSON.stringify(t))),navigator.mozGetUserMedia(t,n,function(t){i(e(t))})};navigator.getUserMedia=t;var n=function(e){return new Promise(function(t,n){navigator.getUserMedia(e,t,n)})};if(navigator.mediaDevices||(navigator.mediaDevices={getUserMedia:n,addEventListener:function(){},removeEventListener:function(){}}),navigator.mediaDevices.enumerateDevices=navigator.mediaDevices.enumerateDevices||function(){return new Promise(function(e){var t=[{kind:"audioinput",deviceId:"default",label:"",groupId:""},{kind:"videoinput",deviceId:"default",label:"",groupId:""}];e(t)})},o.version<41){var i=navigator.mediaDevices.enumerateDevices.bind(navigator.mediaDevices);navigator.mediaDevices.enumerateDevices=function(){return i().then(void 0,function(e){if("NotFoundError"===e.name)return[];throw e})}}if(o.version<49){var a=navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);navigator.mediaDevices.getUserMedia=function(t){return a(t)["catch"](function(t){return Promise.reject(e(t))})}}}},function(e,t,n){"use strict";var r={shimGetUserMedia:function(){navigator.getUserMedia=navigator.webkitGetUserMedia}};e.e={shimGetUserMedia:r.shimGetUserMedia}},function(e,t,n){e.e=n(49)}])});

/***/ },
/* 238 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(239);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(220)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./image-uploader.scss", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./image-uploader.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 239 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(219)();
	// imports
	
	
	// module
	exports.push([module.id, ".live-camera-holder .image-uploader-buttons {\n  display: block; }\n\n.camera-container #barcodeScanViewHolder {\n  height: 500px; }\n", ""]);
	
	// exports


/***/ },
/* 240 */
/***/ function(module, exports) {

	"use strict";
	exports.randomId = function () { return Math.random().toString(36).substr(2); };
	exports.nameOfUser = function (user) {
	    if (!user) {
	        return '';
	    }
	    return user.firstName + " " + user.lastName;
	};


/***/ },
/* 241 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var maquette_1 = __webpack_require__(213);
	__webpack_require__(242);
	var MENU_ITEMS = [
	    {
	        text: 'About me',
	        route: 'account'
	    },
	    {
	        text: 'People',
	        route: 'users'
	    },
	    {
	        text: 'Scan Barcodes',
	        route: 'barcodescanner'
	    },
	    {
	        text: 'Upload files',
	        route: 'file-upload'
	    },
	    {
	        text: 'Multiple camera support',
	        route: 'camera'
	    }
	];
	exports.createMainMenu = function () {
	    var isOpen = false;
	    var handleOverlayClick = function (evt) {
	        evt.preventDefault();
	        isOpen = false;
	    };
	    var handleMenuButtonClick = function (evt) {
	        evt.preventDefault();
	        isOpen = true;
	    };
	    var handleItemClick = function (evt) {
	        isOpen = false;
	        // not preventing default, so the url changes and routing kicks in
	    };
	    return {
	        renderMaquette: function () {
	            return maquette_1.h('div', { class: 'mainMenu' }, [
	                isOpen ? maquette_1.h('div', { key: 'overlay', class: 'overlay', onclick: handleOverlayClick }) : undefined,
	                maquette_1.h('div', { key: 'touchArea', class: 'touchArea', classes: (_a = {}, _a['isOpen'] = isOpen, _a) }, [
	                    isOpen ? [
	                        maquette_1.h('div', { class: 'menu' }, [
	                            MENU_ITEMS.map(function (item) { return maquette_1.h('div', { class: 'item' }, [
	                                maquette_1.h('a', { href: "#" + item.route, onclick: handleItemClick }, [item.text])
	                            ]); })
	                        ])
	                    ] : undefined
	                ]),
	                maquette_1.h('div', { key: 'openButton', class: 'openButton', onclick: handleMenuButtonClick }, ['☰'])
	            ]);
	            var _a;
	        }
	    };
	};


/***/ },
/* 242 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(243);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(220)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./main-menu.scss", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./main-menu.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 243 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(219)();
	// imports
	
	
	// module
	exports.push([module.id, ".mainMenu {\n  position: absolute;\n  width: 0;\n  top: 0;\n  left: 0;\n  height: 100vh;\n  z-index: 3; }\n\n.overlay {\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  width: 100vw;\n  background-color: rgba(0, 0, 0, 0.4); }\n\n.openButton {\n  color: #EEEEEE;\n  line-height: 24px;\n  font-size: 16px;\n  padding: 8px 8px 8px 16px;\n  width: 40px;\n  cursor: pointer; }\n\n.touchArea {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  width: calc(20vw + 10px);\n  left: -90vw;\n  transition: all .5s ease-in-out; }\n\n.touchArea.isOpen {\n  left: 0; }\n\n.menu {\n  height: 100%;\n  width: calc(20vw - 2px);\n  box-shadow: 0 0 15px black;\n  background-color: white;\n  font-weight: bold;\n  text-decoration: none; }\n  .menu a {\n    color: black;\n    text-decoration: none; }\n\n.item {\n  color: #EEEEEE;\n  line-height: 24px;\n  font-size: 16px;\n  padding: 8px 8px 8px 16px; }\n", ""]);
	
	// exports


/***/ },
/* 244 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(245);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(220)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./app.scss", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./app.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 245 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(219)();
	// imports
	exports.push([module.id, "@import url(https://fonts.googleapis.com/css?family=Roboto:400,700);", ""]);
	
	// module
	exports.push([module.id, "* {\n  box-sizing: border-box; }\n\n.app {\n  display: flex;\n  flex-direction: column;\n  font-family: \"Roboto\", sans-serif;\n  font-size: 14px;\n  height: 100vh;\n  line-height: 16px;\n  margin: 0;\n  overflow: hidden;\n  padding: 0; }\n\n.header {\n  background-color: #333;\n  color: white;\n  display: flex;\n  flex: 0 0 auto;\n  font-family: \"Roboto\", sans-serif;\n  font-size: 16px;\n  font-weight: bold;\n  height: 40px;\n  line-height: 24px;\n  padding: 8px 8px 8px 48px;\n  position: fixed;\n  width: 100%; }\n  .header .title {\n    flex: 1; }\n\n.body {\n  background-color: #ececec;\n  flex: 1 1 auto;\n  flex-direction: column;\n  margin-top: 40px;\n  overflow-y: scroll; }\n\n.profile-picture {\n  height: 50px;\n  width: 50px;\n  border-radius: 50%;\n  border: 1px solid #cacaca;\n  object-fit: cover; }\n\n.card {\n  background: white;\n  border: 1px solid lightgray;\n  border-bottom: 4px solid #d3d3d3;\n  border-right: 2px solid lightgray;\n  margin: 20pt;\n  padding: 10pt;\n  width: inherit; }\n\n.newFileContent {\n  display: block; }\n  .newFileContent input {\n    display: block;\n    width: 100%;\n    border: 1px solid #cacaca;\n    padding: 3px 7px;\n    line-height: 24px;\n    border-radius: 4px;\n    margin-top: 10px; }\n\n.attachment {\n  border: 1px solid #cacaca;\n  background-color: #f5f5f5;\n  padding: 10px;\n  display: flex;\n  margin-top: 10px; }\n  .attachment p {\n    flex: 1;\n    line-height: 0; }\n  .attachment .button {\n    margin-top: 0;\n    margin-bottom: 0; }\n", ""]);
	
	// exports


/***/ },
/* 246 */
/***/ function(module, exports) {

	"use strict";
	exports.createRouter = function (window, projector, registry) {
	    var hash = window.location.hash.substr(1);
	    var page;
	    window.onhashchange = function (evt) {
	        projector.scheduleRender();
	        hash = window.location.hash;
	        if (page && page.destroy) {
	            page.destroy();
	        }
	        page = registry.initializePage(hash.substr(1)); // strips the # token
	    };
	    return {
	        getCurrentPage: function () {
	            if (!page) {
	                page = registry.initializePage(hash);
	            }
	            return page;
	        }
	    };
	};


/***/ },
/* 247 */
/***/ function(module, exports) {

	"use strict";
	exports.createDataService = function (horizon, scheduleRender) {
	    var status = 'unconnected';
	    horizon.status(function (evt) {
	        status = evt.type;
	        scheduleRender();
	    });
	    return {
	        horizon: horizon,
	        isOnline: function () { return status === 'ready'; }
	    };
	};


/***/ },
/* 248 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var user_list_page_1 = __webpack_require__(249);
	var account_1 = __webpack_require__(253);
	var barcodescanner_1 = __webpack_require__(254);
	var multicam_1 = __webpack_require__(255);
	var chat_page_1 = __webpack_require__(259);
	var file_upload_1 = __webpack_require__(265);
	exports.createRouteRegistry = function (dataService, projector, userService) {
	    return {
	        initializePage: function (route) {
	            switch (route) {
	                case 'users':
	                    return user_list_page_1.createUserListPage(dataService, projector);
	                case 'account':
	                    return account_1.createAccountPage(dataService, userService, projector);
	                case 'barcodescanner':
	                    return barcodescanner_1.createBarcodePage(dataService, userService, projector);
	                case 'file-upload':
	                    return file_upload_1.createFileUploadPage(dataService, projector);
	                case 'camera':
	                    return multicam_1.createMultiCamPage(dataService, userService, projector);
	                default:
	                    var match = /chat\/(\w+)/.exec(route);
	                    if (match) {
	                        return chat_page_1.createChatPage(dataService, userService.getUserInfo(), match[1], projector);
	                    }
	                    // Nothing matches, default page:
	                    return user_list_page_1.createUserListPage(dataService, projector);
	            }
	        }
	    };
	};


/***/ },
/* 249 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var maquette_1 = __webpack_require__(213);
	var page_1 = __webpack_require__(216);
	var list_1 = __webpack_require__(250);
	var text_1 = __webpack_require__(221);
	exports.createUserListPage = function (dataService, projector) {
	    var users = undefined;
	    var usersCollection = dataService.horizon('users');
	    var subscription = usersCollection.order('lastName').watch().subscribe(function (allUsers) {
	        users = allUsers;
	        projector.scheduleRender();
	    });
	    var list = list_1.createList({
	        columns: [
	            { header: 'Profile picture', key: 'image' },
	            { header: 'First Name', key: 'firstName' },
	            { header: 'Last Name', key: 'lastName' },
	            { header: 'Phone number', key: 'phoneNumber' },
	            { header: 'Company', key: 'company' },
	            { header: 'Addres', key: 'address' }
	        ]
	    }, {
	        getItems: function () { return users; },
	        getKey: function (user) { return user.id; },
	        renderCell: function (item, columnKey) {
	            if (columnKey === 'image') {
	                return maquette_1.h('img', {
	                    src: item[columnKey] ?
	                        item[columnKey] :
	                        'images/default-profile-picture.png', class: 'profile-picture' }, [item[columnKey]]);
	            }
	            else if (columnKey === 'phoneNumber') {
	                return maquette_1.h('a', { href: "tel:" + item[columnKey] }, [item[columnKey]]);
	            }
	            else if (columnKey === 'address') {
	                return maquette_1.h('a', { href: "http://maps.apple.com?q=" +
	                        item[columnKey] +
	                        '+' +
	                        item['city'] +
	                        '+' +
	                        item['country'] }, [item[columnKey]]);
	            }
	            else {
	                return maquette_1.h('span', [item[columnKey]]);
	            }
	        },
	        rowClicked: function (item) {
	            var w = window;
	            w.location = "#chat/" + item.id;
	        }
	    });
	    return page_1.createPage({
	        title: 'Users',
	        dataService: dataService,
	        body: [
	            text_1.createText({ htmlContent: '<h2>Choose someone to chat with</h2>' }),
	            list
	        ],
	        destroy: function () {
	            subscription.unsubscribe();
	        }
	    });
	};


/***/ },
/* 250 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var maquette_1 = __webpack_require__(213);
	__webpack_require__(251);
	exports.createList = function (config, bindings) {
	    var getItems = bindings.getItems, getKey = bindings.getKey, renderCell = bindings.renderCell, rowClicked = bindings.rowClicked;
	    var columns = config.columns;
	    var handleClick = function (evt) {
	        var items = getItems();
	        var target = evt.currentTarget;
	        var id = target.getAttribute('data-itemId');
	        var founditem = items.filter(function (item) { return item.id === id; })[0];
	        rowClicked(founditem);
	    };
	    var list = {
	        renderMaquette: function () {
	            var items = getItems();
	            return maquette_1.h('div', { key: list, class: 'list' }, [
	                items ? [
	                    maquette_1.h('table', [
	                        maquette_1.h('thead', [
	                            maquette_1.h('tr', columns.map(function (c) { return maquette_1.h('th', [c.header]); }))
	                        ]),
	                        maquette_1.h('tbody', items.map(function (item) {
	                            return maquette_1.h('tr', { key: getKey(item), onclick: handleClick, 'data-itemId': item.id }, [
	                                columns.map(function (c) { return maquette_1.h('td', [renderCell(item, c.key)]); })
	                            ]);
	                        }))
	                    ])
	                ] : [
	                    maquette_1.h('span', ['Loading...'])
	                ]
	            ]);
	        }
	    };
	    return list;
	};


/***/ },
/* 251 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(252);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(220)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./list.scss", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./list.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 252 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(219)();
	// imports
	
	
	// module
	exports.push([module.id, ".list {\n  border-collapse: collapse;\n  flex: 1 1 auto; }\n  .list table {\n    border-collapse: collapse;\n    position: relative;\n    width: 100%; }\n  .list tr {\n    border-bottom: 1px solid #dadada;\n    background: #FFF;\n    transition: background-color .3s ease-in-out; }\n    .list tr:hover {\n      background-color: #efefef; }\n    .list tr th {\n      background-color: transparent;\n      color: black;\n      text-align: left;\n      padding: 8px; }\n    .list tr td {\n      margin: 0;\n      padding: 8px;\n      border: none; }\n", ""]);
	
	// exports


/***/ },
/* 253 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var page_1 = __webpack_require__(216);
	var text_field_1 = __webpack_require__(224);
	var button_1 = __webpack_require__(227);
	var image_uploader_1 = __webpack_require__(230);
	exports.createAccountPage = function (dataService, userService, projector) {
	    var _a = userService.getUserInfo(), id = _a.id, firstName = _a.firstName, lastName = _a.lastName, phoneNumber = _a.phoneNumber, image = _a.image, company = _a.company, address = _a.address, country = _a.country, city = _a.city;
	    var doUpdate = function () {
	        var canvas = document.getElementById('canvas');
	        image = canvas.toDataURL();
	        userService.updateUserInfo({
	            id: id,
	            firstName: firstName,
	            lastName: lastName,
	            phoneNumber: phoneNumber,
	            company: company,
	            address: address,
	            city: city,
	            country: country,
	            image: image
	        });
	        document.location.hash = '#users';
	    };
	    var page = page_1.createPage({
	        title: 'Account',
	        dataService: dataService,
	        body: [
	            text_field_1.createTextField({ label: 'First name' }, { getValue: function () { return firstName; }, setValue: function (value) { firstName = value; } }),
	            text_field_1.createTextField({ label: 'Last name' }, { getValue: function () { return lastName; }, setValue: function (value) { lastName = value; } }),
	            text_field_1.createTextField({ label: 'phone number' }, { getValue: function () { return phoneNumber; }, setValue: function (value) { phoneNumber = value; } }),
	            text_field_1.createTextField({ label: 'Company' }, { getValue: function () { return company; }, setValue: function (value) { company = value; } }),
	            text_field_1.createTextField({ label: 'Address' }, { getValue: function () { return address; }, setValue: function (value) { address = value; } }),
	            text_field_1.createTextField({ label: 'City' }, { getValue: function () { return city; }, setValue: function (value) { city = value; } }),
	            text_field_1.createTextField({ label: 'Country' }, { getValue: function () { return country; }, setValue: function (value) { country = value; } }),
	            image_uploader_1.createImageUploader({ projector: projector, userService: userService, image: image }, {}),
	            button_1.createButton({ text: 'Update', primary: true }, { onClick: doUpdate })
	        ]
	    });
	    return page;
	};


/***/ },
/* 254 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var page_1 = __webpack_require__(216);
	var live_camera_1 = __webpack_require__(234);
	__webpack_require__(237);
	exports.createBarcodePage = function (dataService, userService, projector) {
	    var page = page_1.createPage({
	        title: 'Barcodescanning',
	        dataService: dataService,
	        body: [
	            live_camera_1.createLiveCamera({ projector: projector, BarcodeScanEnabled: true }, {})
	        ]
	    });
	    return page;
	};


/***/ },
/* 255 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var page_1 = __webpack_require__(216);
	var camera_1 = __webpack_require__(256);
	__webpack_require__(237);
	exports.createMultiCamPage = function (dataService, userService, projector) {
	    var page = page_1.createPage({
	        title: 'Multicam testing',
	        dataService: dataService,
	        body: [
	            camera_1.createCamera({ projector: projector }, {})
	        ]
	    });
	    return page;
	};


/***/ },
/* 256 */
/***/ function(module, exports, __webpack_require__) {

	// This component creates a view where a video view is shown. 
	"use strict";
	var maquette_1 = __webpack_require__(213);
	__webpack_require__(257);
	exports.createCamera = function (config, bindings) {
	    var projector = config.projector;
	    var n = navigator;
	    var window = Window;
	    var videoElement;
	    var videoSources;
	    var audioSources;
	    var currentVideoSourceIndex;
	    var currentAudioSourceIndex;
	    var multipleCamerasAvailable;
	    n.getUserMedia = n.getUserMedia || n.webkitGetUserMedia || n.mozGetUserMedia || n.msGetUserMedia;
	    var successCallback = function (stream) {
	        window.stream = stream; // make stream available to console
	        videoElement.src = URL.createObjectURL(stream);
	        videoElement.play();
	    };
	    var errorCallback = function (error) {
	        console.log('navigator.getUserMedia error: ', error);
	    };
	    var start = function () {
	        if (window.stream) {
	            videoElement.src = null;
	            window.stream.getTracks().forEach(function (track) {
	                track.stop();
	            });
	        }
	        var audioSource = audioSources[currentAudioSourceIndex];
	        var videoSource = videoSources[currentVideoSourceIndex];
	        var constraints = {
	            audio: {
	                optional: [{
	                        sourceId: audioSource
	                    }]
	            },
	            video: {
	                optional: [{
	                        sourceId: videoSource
	                    }]
	            }
	        };
	        n.getUserMedia(constraints, successCallback, errorCallback);
	    };
	    var gotSources = function (sourceInfos) {
	        for (var i = 0; i !== sourceInfos.length; ++i) {
	            var sourceInfo = sourceInfos[i];
	            if (sourceInfo.kind === 'audioinput') {
	                audioSources.push(sourceInfo.deviceId);
	            }
	            else if (sourceInfo.kind === 'videoinput') {
	                videoSources.push(sourceInfo.deviceId);
	            }
	            else {
	            }
	        }
	        if (videoSources.length > 1 && !multipleCamerasAvailable) {
	            multipleCamerasAvailable = true;
	            projector.scheduleRender();
	        }
	    };
	    var initializeDevices = function () {
	        if (!n.mediaDevices || !n.mediaDevices.enumerateDevices) {
	            console.log('enumerateDevices() not supported.');
	            return;
	        }
	        n.mediaDevices.enumerateDevices()
	            .then(function (devices) {
	            gotSources(devices);
	            start();
	        })
	            .catch(function (err) {
	            console.error(err.name + ': ' + err.message);
	        });
	        console.log(videoSources);
	    };
	    var handleSwitchButtonClick = function () {
	        if (multipleCamerasAvailable) {
	            if (currentVideoSourceIndex < videoSources.length - 1) {
	                currentVideoSourceIndex++;
	            }
	            else {
	                currentVideoSourceIndex = 0;
	            }
	            start();
	        }
	    };
	    var createElementsAfterCreate = function () {
	        videoElement = document.querySelector('video');
	        videoSources = [];
	        audioSources = [];
	        currentVideoSourceIndex = 0;
	        currentAudioSourceIndex = 0;
	        multipleCamerasAvailable = false;
	        initializeDevices();
	    };
	    return {
	        renderMaquette: function () {
	            return maquette_1.h('div', { class: 'camera-holder' }, [
	                multipleCamerasAvailable ? maquette_1.h('button', { class: 'toggleWebcamButton', primary: false, onclick: handleSwitchButtonClick }, ['switch camera']) : undefined,
	                maquette_1.h('video', { autoplay: true, afterCreate: createElementsAfterCreate })
	            ]);
	        }
	    };
	};


/***/ },
/* 257 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(258);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(220)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./camera.scss", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./camera.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 258 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(219)();
	// imports
	
	
	// module
	exports.push([module.id, "video {\n  width: 100%;\n  max-width: 640px;\n  margin-left: auto;\n  margin-right: auto;\n  margin-top: 10px;\n  border: none; }\n\n.camera-holder {\n  position: relative;\n  width: inherit;\n  height: inherit; }\n\n.toggleWebcamButton {\n  top: 30px;\n  left: 20px;\n  z-index: 1;\n  position: absolute; }\n", ""]);
	
	// exports


/***/ },
/* 259 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var maquette_1 = __webpack_require__(213);
	var list_1 = __webpack_require__(250);
	var page_1 = __webpack_require__(216);
	var text_1 = __webpack_require__(221);
	var message_composer_1 = __webpack_require__(260);
	var utilities_1 = __webpack_require__(240);
	var jstz = __webpack_require__(263);
	exports.createChatPage = function (dataService, user, toUserId, projector) {
	    var timezone = jstz.determine();
	    var otherUser;
	    var messages;
	    var chatRoomId = [user.id, toUserId].sort().join('-'); // format: lowestUserId-highestUserId
	    var otherUserSubscription = dataService.horizon('users').find(toUserId).watch().subscribe(function (userInfo) {
	        otherUser = userInfo;
	        projector.scheduleRender();
	    });
	    var longitude;
	    var latitude;
	    var getLocation = function () {
	        if (navigator.geolocation) {
	            navigator.geolocation.getCurrentPosition(function showPosition(position) {
	                longitude = position.coords.longitude;
	                latitude = position.coords.latitude;
	                projector.scheduleRender();
	            });
	        }
	        else {
	            console.log('Geolocation is not supported by this browser.');
	        }
	    };
	    getLocation();
	    var messagesSubscription = dataService.horizon('directMessages')
	        .findAll({ chatRoomId: chatRoomId })
	        .order('timestamp', 'descending')
	        .limit(500)
	        .watch()
	        .subscribe(function (msgs) {
	        projector.scheduleRender();
	        messages = msgs.sort(function (msg1, msg2) { return msg1.timestamp - msg2.timestamp; });
	    });
	    var list = list_1.createList({ columns: [{ header: 'Picture', key: 'image' }, { header: 'From', key: 'from' }, { header: 'Message', key: 'message' }] }, {
	        getItems: function () { return messages; },
	        getKey: function (message) { return message.id; },
	        renderCell: function (item, columnKey) {
	            switch (columnKey) {
	                case 'image':
	                    return maquette_1.h('img', { class: 'profile-picture', src: item.fromUserId === toUserId ? otherUser.image : user.image });
	                case 'from':
	                    return item.fromUserId === toUserId ? otherUser.firstName : 'me';
	                case 'message':
	                    return item.text;
	            }
	        }
	    });
	    var timeZoneText = text_1.createText({ htmlContent: 'Current timezone: ' + timezone.name() });
	    var sendMessage = function (text) {
	        var message = {
	            date: new Date(),
	            timestamp: new Date().valueOf(),
	            fromUserId: user.id,
	            id: utilities_1.randomId(),
	            chatRoomId: chatRoomId,
	            text: text,
	            toUserId: toUserId
	        };
	        dataService.horizon('directMessages').upsert(message);
	    };
	    var messageComposer = message_composer_1.createMessageComposer({ sendMessage: sendMessage });
	    return page_1.createPage({
	        title: function () { return ("Chat with " + utilities_1.nameOfUser(otherUser)); },
	        dataService: dataService,
	        body: [
	            { renderMaquette: function () {
	                    var link = 'http://maps.apple.com/maps?z=12&t=m&q=loc:'
	                        + latitude
	                        + '+'
	                        + longitude;
	                    return maquette_1.h('a', { href: link }, [link]);
	                }
	            },
	            timeZoneText,
	            list,
	            messageComposer
	        ],
	        destroy: function () {
	            otherUserSubscription.unsubscribe();
	            messagesSubscription.unsubscribe();
	        }
	    });
	};


/***/ },
/* 260 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var maquette_1 = __webpack_require__(213);
	__webpack_require__(261);
	exports.createMessageComposer = function (bindings) {
	    var textToSend = '';
	    var handleKeyDown = function (evt) {
	        if (evt.which === 13) {
	            evt.preventDefault();
	            bindings.sendMessage(textToSend);
	            textToSend = '';
	        }
	    };
	    var handleInput = function (evt) {
	        textToSend = evt.target.value;
	    };
	    var handleSendClick = function (evt) {
	        evt.preventDefault();
	        bindings.sendMessage(textToSend);
	        textToSend = '';
	    };
	    return {
	        renderMaquette: function () {
	            return maquette_1.h('div', { class: 'messageComposer' }, [
	                maquette_1.h('input', { class: 'input', value: textToSend, oninput: handleInput, onkeydown: handleKeyDown }),
	                maquette_1.h('button', { class: 'send', onclick: handleSendClick }, ['Send'])
	            ]);
	        }
	    };
	};


/***/ },
/* 261 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(262);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(220)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./message-composer.scss", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./message-composer.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 262 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(219)();
	// imports
	
	
	// module
	exports.push([module.id, ".messageComposer {\n  flex: 0 0 auto;\n  display: flex;\n  padding: 20pt; }\n\n.input {\n  flex-grow: 1; }\n", ""]);
	
	// exports


/***/ },
/* 263 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(264).jstz;


/***/ },
/* 264 */
/***/ function(module, exports, __webpack_require__) {

	(function (root) {/*global exports, Intl*/
	/**
	 * This script gives you the zone info key representing your device's time zone setting.
	 *
	 * @name jsTimezoneDetect
	 * @version 1.0.5
	 * @author Jon Nylander
	 * @license MIT License - https://bitbucket.org/pellepim/jstimezonedetect/src/default/LICENCE.txt
	 *
	 * For usage and examples, visit:
	 * http://pellepim.bitbucket.org/jstz/
	 *
	 * Copyright (c) Jon Nylander
	 */
	
	
	/**
	 * Namespace to hold all the code for timezone detection.
	 */
	var jstz = (function () {
	    'use strict';
	    var HEMISPHERE_SOUTH = 's',
	
	        consts = {
	            DAY: 86400000,
	            HOUR: 3600000,
	            MINUTE: 60000,
	            SECOND: 1000,
	            BASELINE_YEAR: 2014,
	            MAX_SCORE: 864000000, // 10 days
	            AMBIGUITIES: {
	                'America/Denver':       ['America/Mazatlan'],
	                'America/Chicago':      ['America/Mexico_City'],
	                'America/Santiago':     ['America/Asuncion', 'America/Campo_Grande'],
	                'America/Montevideo':   ['America/Sao_Paulo'],
	                // Europe/Minsk should not be in this list... but Windows.
	                'Asia/Beirut':          ['Asia/Amman', 'Asia/Jerusalem', 'Europe/Helsinki', 'Asia/Damascus', 'Africa/Cairo', 'Asia/Gaza', 'Europe/Minsk'],
	                'Pacific/Auckland':     ['Pacific/Fiji'],
	                'America/Los_Angeles':  ['America/Santa_Isabel'],
	                'America/New_York':     ['America/Havana'],
	                'America/Halifax':      ['America/Goose_Bay'],
	                'America/Godthab':      ['America/Miquelon'],
	                'Asia/Dubai':           ['Asia/Yerevan'],
	                'Asia/Jakarta':         ['Asia/Krasnoyarsk'],
	                'Asia/Shanghai':        ['Asia/Irkutsk', 'Australia/Perth'],
	                'Australia/Sydney':     ['Australia/Lord_Howe'],
	                'Asia/Tokyo':           ['Asia/Yakutsk'],
	                'Asia/Dhaka':           ['Asia/Omsk'],
	                // In the real world Yerevan is not ambigous for Baku... but Windows.
	                'Asia/Baku':            ['Asia/Yerevan'],
	                'Australia/Brisbane':   ['Asia/Vladivostok'],
	                'Pacific/Noumea':       ['Asia/Vladivostok'],
	                'Pacific/Majuro':       ['Asia/Kamchatka', 'Pacific/Fiji'],
	                'Pacific/Tongatapu':    ['Pacific/Apia'],
	                'Asia/Baghdad':         ['Europe/Minsk', 'Europe/Moscow'],
	                'Asia/Karachi':         ['Asia/Yekaterinburg'],
	                'Africa/Johannesburg':  ['Asia/Gaza', 'Africa/Cairo']
	            }
	        },
	
	        /**
	         * Gets the offset in minutes from UTC for a certain date.
	         * @param {Date} date
	         * @returns {Number}
	         */
	        get_date_offset = function get_date_offset(date) {
	            var offset = -date.getTimezoneOffset();
	            return (offset !== null ? offset : 0);
	        },
	
	        /**
	         * This function does some basic calculations to create information about
	         * the user's timezone. It uses REFERENCE_YEAR as a solid year for which
	         * the script has been tested rather than depend on the year set by the
	         * client device.
	         *
	         * Returns a key that can be used to do lookups in jstz.olson.timezones.
	         * eg: "720,1,2".
	         *
	         * @returns {String}
	         */
	        lookup_key = function lookup_key() {
	            var january_offset = get_date_offset(new Date(consts.BASELINE_YEAR, 0, 2)),
	                june_offset = get_date_offset(new Date(consts.BASELINE_YEAR, 5, 2)),
	                diff = january_offset - june_offset;
	
	            if (diff < 0) {
	                return january_offset + ",1";
	            } else if (diff > 0) {
	                return june_offset + ",1," + HEMISPHERE_SOUTH;
	            }
	
	            return january_offset + ",0";
	        },
	
	
	        /**
	         * Tries to get the time zone key directly from the operating system for those
	         * environments that support the ECMAScript Internationalization API.
	         */
	        get_from_internationalization_api = function get_from_internationalization_api() {
	            if (typeof Intl === "undefined" || typeof Intl.DateTimeFormat === "undefined") {
	                return;
	            }
	            var format = Intl.DateTimeFormat();
	            if (typeof format === "undefined" || typeof format.resolvedOptions === "undefined") {
	                return;
	            }
	            return format.resolvedOptions().timeZone;
	        },
	
	        /**
	         * Starting point for getting all the DST rules for a specific year
	         * for the current timezone (as described by the client system).
	         *
	         * Returns an object with start and end attributes, or false if no
	         * DST rules were found for the year.
	         *
	         * @param year
	         * @returns {Object} || {Boolean}
	         */
	        dst_dates = function dst_dates(year) {
	            var yearstart = new Date(year, 0, 1, 0, 0, 1, 0).getTime();
	            var yearend = new Date(year, 12, 31, 23, 59, 59).getTime();
	            var current = yearstart;
	            var offset = (new Date(current)).getTimezoneOffset();
	            var dst_start = null;
	            var dst_end = null;
	
	            while (current < yearend - 86400000) {
	                var dateToCheck = new Date(current);
	                var dateToCheckOffset = dateToCheck.getTimezoneOffset();
	
	                if (dateToCheckOffset !== offset) {
	                    if (dateToCheckOffset < offset) {
	                        dst_start = dateToCheck;
	                    }
	                    if (dateToCheckOffset > offset) {
	                        dst_end = dateToCheck;
	                    }
	                    offset = dateToCheckOffset;
	                }
	
	                current += 86400000;
	            }
	
	            if (dst_start && dst_end) {
	                return {
	                    s: find_dst_fold(dst_start).getTime(),
	                    e: find_dst_fold(dst_end).getTime()
	                };
	            }
	
	            return false;
	        },
	
	        /**
	         * Probably completely unnecessary function that recursively finds the
	         * exact (to the second) time when a DST rule was changed.
	         *
	         * @param a_date - The candidate Date.
	         * @param padding - integer specifying the padding to allow around the candidate
	         *                  date for finding the fold.
	         * @param iterator - integer specifying how many milliseconds to iterate while
	         *                   searching for the fold.
	         *
	         * @returns {Date}
	         */
	        find_dst_fold = function find_dst_fold(a_date, padding, iterator) {
	            if (typeof padding === 'undefined') {
	                padding = consts.DAY;
	                iterator = consts.HOUR;
	            }
	
	            var date_start = new Date(a_date.getTime() - padding).getTime();
	            var date_end = a_date.getTime() + padding;
	            var offset = new Date(date_start).getTimezoneOffset();
	
	            var current = date_start;
	
	            var dst_change = null;
	            while (current < date_end - iterator) {
	                var dateToCheck = new Date(current);
	                var dateToCheckOffset = dateToCheck.getTimezoneOffset();
	
	                if (dateToCheckOffset !== offset) {
	                    dst_change = dateToCheck;
	                    break;
	                }
	                current += iterator;
	            }
	
	            if (padding === consts.DAY) {
	                return find_dst_fold(dst_change, consts.HOUR, consts.MINUTE);
	            }
	
	            if (padding === consts.HOUR) {
	                return find_dst_fold(dst_change, consts.MINUTE, consts.SECOND);
	            }
	
	            return dst_change;
	        },
	
	        windows7_adaptations = function windows7_adaptions(rule_list, preliminary_timezone, score, sample) {
	            if (score !== 'N/A') {
	                return score;
	            }
	            if (preliminary_timezone === 'Asia/Beirut') {
	                if (sample.name === 'Africa/Cairo') {
	                    if (rule_list[6].s === 1398376800000 && rule_list[6].e === 1411678800000) {
	                        return 0;
	                    }
	                }
	                if (sample.name === 'Asia/Jerusalem') {
	                    if (rule_list[6].s === 1395964800000 && rule_list[6].e === 1411858800000) {
	                        return 0;
	                }
	            }
	            } else if (preliminary_timezone === 'America/Santiago') {
	                if (sample.name === 'America/Asuncion') {
	                    if (rule_list[6].s === 1412481600000 && rule_list[6].e === 1397358000000) {
	                        return 0;
	                    }
	                }
	                if (sample.name === 'America/Campo_Grande') {
	                    if (rule_list[6].s === 1413691200000 && rule_list[6].e === 1392519600000) {
	                        return 0;
	                    }
	                }
	            } else if (preliminary_timezone === 'America/Montevideo') {
	                if (sample.name === 'America/Sao_Paulo') {
	                    if (rule_list[6].s === 1413687600000 && rule_list[6].e === 1392516000000) {
	                        return 0;
	                    }
	                }
	            } else if (preliminary_timezone === 'Pacific/Auckland') {
	                if (sample.name === 'Pacific/Fiji') {
	                    if (rule_list[6].s === 1414245600000 && rule_list[6].e === 1396101600000) {
	                        return 0;
	                    }
	                }
	            }
	
	            return score;
	        },
	
	        /**
	         * Takes the DST rules for the current timezone, and proceeds to find matches
	         * in the jstz.olson.dst_rules.zones array.
	         *
	         * Compares samples to the current timezone on a scoring basis.
	         *
	         * Candidates are ruled immediately if either the candidate or the current zone
	         * has a DST rule where the other does not.
	         *
	         * Candidates are ruled out immediately if the current zone has a rule that is
	         * outside the DST scope of the candidate.
	         *
	         * Candidates are included for scoring if the current zones rules fall within the
	         * span of the samples rules.
	         *
	         * Low score is best, the score is calculated by summing up the differences in DST
	         * rules and if the consts.MAX_SCORE is overreached the candidate is ruled out.
	         *
	         * Yah follow? :)
	         *
	         * @param rule_list
	         * @param preliminary_timezone
	         * @returns {*}
	         */
	        best_dst_match = function best_dst_match(rule_list, preliminary_timezone) {
	            var score_sample = function score_sample(sample) {
	                var score = 0;
	
	                for (var j = 0; j < rule_list.length; j++) {
	
	                    // Both sample and current time zone report DST during the year.
	                    if (!!sample.rules[j] && !!rule_list[j]) {
	
	                        // The current time zone's DST rules are inside the sample's. Include.
	                        if (rule_list[j].s >= sample.rules[j].s && rule_list[j].e <= sample.rules[j].e) {
	                            score = 0;
	                            score += Math.abs(rule_list[j].s - sample.rules[j].s);
	                            score += Math.abs(sample.rules[j].e - rule_list[j].e);
	
	                        // The current time zone's DST rules are outside the sample's. Discard.
	                        } else {
	                            score = 'N/A';
	                            break;
	                        }
	
	                        // The max score has been reached. Discard.
	                        if (score > consts.MAX_SCORE) {
	                            score = 'N/A';
	                            break;
	                        }
	                    }
	                }
	
	                score = windows7_adaptations(rule_list, preliminary_timezone, score, sample);
	
	                return score;
	            };
	            var scoreboard = {};
	            var dst_zones = jstz.olson.dst_rules.zones;
	            var dst_zones_length = dst_zones.length;
	            var ambiguities = consts.AMBIGUITIES[preliminary_timezone];
	
	            for (var i = 0; i < dst_zones_length; i++) {
	                var sample = dst_zones[i];
	                var score = score_sample(dst_zones[i]);
	
	                if (score !== 'N/A') {
	                    scoreboard[sample.name] = score;
	                }
	            }
	
	            for (var tz in scoreboard) {
	                if (scoreboard.hasOwnProperty(tz)) {
	                    if (ambiguities.indexOf(tz) != -1) {
	                        return tz;
	                    }
	                }
	            }
	
	            return preliminary_timezone;
	        },
	
	        /**
	         * Takes the preliminary_timezone as detected by lookup_key().
	         *
	         * Builds up the current timezones DST rules for the years defined
	         * in the jstz.olson.dst_rules.years array.
	         *
	         * If there are no DST occurences for those years, immediately returns
	         * the preliminary timezone. Otherwise proceeds and tries to solve
	         * ambiguities.
	         *
	         * @param preliminary_timezone
	         * @returns {String} timezone_name
	         */
	        get_by_dst = function get_by_dst(preliminary_timezone) {
	            var get_rules = function get_rules() {
	                var rule_list = [];
	                for (var i = 0; i < jstz.olson.dst_rules.years.length; i++) {
	                    var year_rules = dst_dates(jstz.olson.dst_rules.years[i]);
	                    rule_list.push(year_rules);
	                }
	                return rule_list;
	            };
	            var check_has_dst = function check_has_dst(rules) {
	                for (var i = 0; i < rules.length; i++) {
	                    if (rules[i] !== false) {
	                        return true;
	                    }
	                }
	                return false;
	            };
	            var rules = get_rules();
	            var has_dst = check_has_dst(rules);
	
	            if (has_dst) {
	                return best_dst_match(rules, preliminary_timezone);
	            }
	
	            return preliminary_timezone;
	        },
	
	        /**
	         * Uses get_timezone_info() to formulate a key to use in the olson.timezones dictionary.
	         *
	         * Returns an object with one function ".name()"
	         *
	         * @returns Object
	         */
	        determine = function determine() {
	            var preliminary_tz = get_from_internationalization_api();
	
	            if (!preliminary_tz) {
	                preliminary_tz = jstz.olson.timezones[lookup_key()];
	
	                if (typeof consts.AMBIGUITIES[preliminary_tz] !== 'undefined') {
	                    preliminary_tz = get_by_dst(preliminary_tz);
	                }
	            }
	
	            return {
	                name: function () {
	                    return preliminary_tz;
	                }
	            };
	        };
	
	    return {
	        determine: determine
	    };
	}());
	
	
	jstz.olson = jstz.olson || {};
	
	/**
	 * The keys in this dictionary are comma separated as such:
	 *
	 * First the offset compared to UTC time in minutes.
	 *
	 * Then a flag which is 0 if the timezone does not take daylight savings into account and 1 if it
	 * does.
	 *
	 * Thirdly an optional 's' signifies that the timezone is in the southern hemisphere,
	 * only interesting for timezones with DST.
	 *
	 * The mapped arrays is used for constructing the jstz.TimeZone object from within
	 * jstz.determine();
	 */
	jstz.olson.timezones = {
	    '-720,0': 'Etc/GMT+12',
	    '-660,0': 'Pacific/Pago_Pago',
	    '-660,1,s': 'Pacific/Apia', // Why? Because windows... cry!
	    '-600,1': 'America/Adak',
	    '-600,0': 'Pacific/Honolulu',
	    '-570,0': 'Pacific/Marquesas',
	    '-540,0': 'Pacific/Gambier',
	    '-540,1': 'America/Anchorage',
	    '-480,1': 'America/Los_Angeles',
	    '-480,0': 'Pacific/Pitcairn',
	    '-420,0': 'America/Phoenix',
	    '-420,1': 'America/Denver',
	    '-360,0': 'America/Guatemala',
	    '-360,1': 'America/Chicago',
	    '-360,1,s': 'Pacific/Easter',
	    '-300,0': 'America/Bogota',
	    '-300,1': 'America/New_York',
	    '-270,0': 'America/Caracas',
	    '-240,1': 'America/Halifax',
	    '-240,0': 'America/Santo_Domingo',
	    '-240,1,s': 'America/Santiago',
	    '-210,1': 'America/St_Johns',
	    '-180,1': 'America/Godthab',
	    '-180,0': 'America/Argentina/Buenos_Aires',
	    '-180,1,s': 'America/Montevideo',
	    '-120,0': 'America/Noronha',
	    '-120,1': 'America/Noronha',
	    '-60,1': 'Atlantic/Azores',
	    '-60,0': 'Atlantic/Cape_Verde',
	    '0,0': 'UTC',
	    '0,1': 'Europe/London',
	    '60,1': 'Europe/Berlin',
	    '60,0': 'Africa/Lagos',
	    '60,1,s': 'Africa/Windhoek',
	    '120,1': 'Asia/Beirut',
	    '120,0': 'Africa/Johannesburg',
	    '180,0': 'Asia/Baghdad',
	    '180,1': 'Europe/Moscow',
	    '210,1': 'Asia/Tehran',
	    '240,0': 'Asia/Dubai',
	    '240,1': 'Asia/Baku',
	    '270,0': 'Asia/Kabul',
	    '300,1': 'Asia/Yekaterinburg',
	    '300,0': 'Asia/Karachi',
	    '330,0': 'Asia/Kolkata',
	    '345,0': 'Asia/Kathmandu',
	    '360,0': 'Asia/Dhaka',
	    '360,1': 'Asia/Omsk',
	    '390,0': 'Asia/Rangoon',
	    '420,1': 'Asia/Krasnoyarsk',
	    '420,0': 'Asia/Jakarta',
	    '480,0': 'Asia/Shanghai',
	    '480,1': 'Asia/Irkutsk',
	    '525,0': 'Australia/Eucla',
	    '525,1,s': 'Australia/Eucla',
	    '540,1': 'Asia/Yakutsk',
	    '540,0': 'Asia/Tokyo',
	    '570,0': 'Australia/Darwin',
	    '570,1,s': 'Australia/Adelaide',
	    '600,0': 'Australia/Brisbane',
	    '600,1': 'Asia/Vladivostok',
	    '600,1,s': 'Australia/Sydney',
	    '630,1,s': 'Australia/Lord_Howe',
	    '660,1': 'Asia/Kamchatka',
	    '660,0': 'Pacific/Noumea',
	    '690,0': 'Pacific/Norfolk',
	    '720,1,s': 'Pacific/Auckland',
	    '720,0': 'Pacific/Majuro',
	    '765,1,s': 'Pacific/Chatham',
	    '780,0': 'Pacific/Tongatapu',
	    '780,1,s': 'Pacific/Apia',
	    '840,0': 'Pacific/Kiritimati'
	};
	
	/* Build time: 2014-11-28 11:10:50Z Build by invoking python utilities/dst.py generate */
	jstz.olson.dst_rules = {
	    "years": [
	        2008,
	        2009,
	        2010,
	        2011,
	        2012,
	        2013,
	        2014
	    ],
	    "zones": [
	        {
	            "name": "Africa/Cairo",
	            "rules": [
	                {
	                    "e": 1219957200000,
	                    "s": 1209074400000
	                },
	                {
	                    "e": 1250802000000,
	                    "s": 1240524000000
	                },
	                {
	                    "e": 1285880400000,
	                    "s": 1284069600000
	                },
	                false,
	                false,
	                false,
	                {
	                    "e": 1411678800000,
	                    "s": 1406844000000
	                }
	            ]
	        },
	        {
	            "name": "America/Asuncion",
	            "rules": [
	                {
	                    "e": 1205031600000,
	                    "s": 1224388800000
	                },
	                {
	                    "e": 1236481200000,
	                    "s": 1255838400000
	                },
	                {
	                    "e": 1270954800000,
	                    "s": 1286078400000
	                },
	                {
	                    "e": 1302404400000,
	                    "s": 1317528000000
	                },
	                {
	                    "e": 1333854000000,
	                    "s": 1349582400000
	                },
	                {
	                    "e": 1364094000000,
	                    "s": 1381032000000
	                },
	                {
	                    "e": 1395543600000,
	                    "s": 1412481600000
	                }
	            ]
	        },
	        {
	            "name": "America/Campo_Grande",
	            "rules": [
	                {
	                    "e": 1203217200000,
	                    "s": 1224388800000
	                },
	                {
	                    "e": 1234666800000,
	                    "s": 1255838400000
	                },
	                {
	                    "e": 1266721200000,
	                    "s": 1287288000000
	                },
	                {
	                    "e": 1298170800000,
	                    "s": 1318737600000
	                },
	                {
	                    "e": 1330225200000,
	                    "s": 1350792000000
	                },
	                {
	                    "e": 1361070000000,
	                    "s": 1382241600000
	                },
	                {
	                    "e": 1392519600000,
	                    "s": 1413691200000
	                }
	            ]
	        },
	        {
	            "name": "America/Goose_Bay",
	            "rules": [
	                {
	                    "e": 1225594860000,
	                    "s": 1205035260000
	                },
	                {
	                    "e": 1257044460000,
	                    "s": 1236484860000
	                },
	                {
	                    "e": 1289098860000,
	                    "s": 1268539260000
	                },
	                {
	                    "e": 1320555600000,
	                    "s": 1299988860000
	                },
	                {
	                    "e": 1352005200000,
	                    "s": 1331445600000
	                },
	                {
	                    "e": 1383454800000,
	                    "s": 1362895200000
	                },
	                {
	                    "e": 1414904400000,
	                    "s": 1394344800000
	                }
	            ]
	        },
	        {
	            "name": "America/Havana",
	            "rules": [
	                {
	                    "e": 1224997200000,
	                    "s": 1205643600000
	                },
	                {
	                    "e": 1256446800000,
	                    "s": 1236488400000
	                },
	                {
	                    "e": 1288501200000,
	                    "s": 1268542800000
	                },
	                {
	                    "e": 1321160400000,
	                    "s": 1300597200000
	                },
	                {
	                    "e": 1352005200000,
	                    "s": 1333256400000
	                },
	                {
	                    "e": 1383454800000,
	                    "s": 1362891600000
	                },
	                {
	                    "e": 1414904400000,
	                    "s": 1394341200000
	                }
	            ]
	        },
	        {
	            "name": "America/Mazatlan",
	            "rules": [
	                {
	                    "e": 1225008000000,
	                    "s": 1207472400000
	                },
	                {
	                    "e": 1256457600000,
	                    "s": 1238922000000
	                },
	                {
	                    "e": 1288512000000,
	                    "s": 1270371600000
	                },
	                {
	                    "e": 1319961600000,
	                    "s": 1301821200000
	                },
	                {
	                    "e": 1351411200000,
	                    "s": 1333270800000
	                },
	                {
	                    "e": 1382860800000,
	                    "s": 1365325200000
	                },
	                {
	                    "e": 1414310400000,
	                    "s": 1396774800000
	                }
	            ]
	        },
	        {
	            "name": "America/Mexico_City",
	            "rules": [
	                {
	                    "e": 1225004400000,
	                    "s": 1207468800000
	                },
	                {
	                    "e": 1256454000000,
	                    "s": 1238918400000
	                },
	                {
	                    "e": 1288508400000,
	                    "s": 1270368000000
	                },
	                {
	                    "e": 1319958000000,
	                    "s": 1301817600000
	                },
	                {
	                    "e": 1351407600000,
	                    "s": 1333267200000
	                },
	                {
	                    "e": 1382857200000,
	                    "s": 1365321600000
	                },
	                {
	                    "e": 1414306800000,
	                    "s": 1396771200000
	                }
	            ]
	        },
	        {
	            "name": "America/Miquelon",
	            "rules": [
	                {
	                    "e": 1225598400000,
	                    "s": 1205038800000
	                },
	                {
	                    "e": 1257048000000,
	                    "s": 1236488400000
	                },
	                {
	                    "e": 1289102400000,
	                    "s": 1268542800000
	                },
	                {
	                    "e": 1320552000000,
	                    "s": 1299992400000
	                },
	                {
	                    "e": 1352001600000,
	                    "s": 1331442000000
	                },
	                {
	                    "e": 1383451200000,
	                    "s": 1362891600000
	                },
	                {
	                    "e": 1414900800000,
	                    "s": 1394341200000
	                }
	            ]
	        },
	        {
	            "name": "America/Santa_Isabel",
	            "rules": [
	                {
	                    "e": 1225011600000,
	                    "s": 1207476000000
	                },
	                {
	                    "e": 1256461200000,
	                    "s": 1238925600000
	                },
	                {
	                    "e": 1288515600000,
	                    "s": 1270375200000
	                },
	                {
	                    "e": 1319965200000,
	                    "s": 1301824800000
	                },
	                {
	                    "e": 1351414800000,
	                    "s": 1333274400000
	                },
	                {
	                    "e": 1382864400000,
	                    "s": 1365328800000
	                },
	                {
	                    "e": 1414314000000,
	                    "s": 1396778400000
	                }
	            ]
	        },
	        {
	            "name": "America/Sao_Paulo",
	            "rules": [
	                {
	                    "e": 1203213600000,
	                    "s": 1224385200000
	                },
	                {
	                    "e": 1234663200000,
	                    "s": 1255834800000
	                },
	                {
	                    "e": 1266717600000,
	                    "s": 1287284400000
	                },
	                {
	                    "e": 1298167200000,
	                    "s": 1318734000000
	                },
	                {
	                    "e": 1330221600000,
	                    "s": 1350788400000
	                },
	                {
	                    "e": 1361066400000,
	                    "s": 1382238000000
	                },
	                {
	                    "e": 1392516000000,
	                    "s": 1413687600000
	                }
	            ]
	        },
	        {
	            "name": "Asia/Amman",
	            "rules": [
	                {
	                    "e": 1225404000000,
	                    "s": 1206655200000
	                },
	                {
	                    "e": 1256853600000,
	                    "s": 1238104800000
	                },
	                {
	                    "e": 1288303200000,
	                    "s": 1269554400000
	                },
	                {
	                    "e": 1319752800000,
	                    "s": 1301608800000
	                },
	                false,
	                false,
	                {
	                    "e": 1414706400000,
	                    "s": 1395957600000
	                }
	            ]
	        },
	        {
	            "name": "Asia/Damascus",
	            "rules": [
	                {
	                    "e": 1225486800000,
	                    "s": 1207260000000
	                },
	                {
	                    "e": 1256850000000,
	                    "s": 1238104800000
	                },
	                {
	                    "e": 1288299600000,
	                    "s": 1270159200000
	                },
	                {
	                    "e": 1319749200000,
	                    "s": 1301608800000
	                },
	                {
	                    "e": 1351198800000,
	                    "s": 1333058400000
	                },
	                {
	                    "e": 1382648400000,
	                    "s": 1364508000000
	                },
	                {
	                    "e": 1414702800000,
	                    "s": 1395957600000
	                }
	            ]
	        },
	        {
	            "name": "Asia/Dubai",
	            "rules": [
	                false,
	                false,
	                false,
	                false,
	                false,
	                false,
	                false
	            ]
	        },
	        {
	            "name": "Asia/Gaza",
	            "rules": [
	                {
	                    "e": 1219957200000,
	                    "s": 1206655200000
	                },
	                {
	                    "e": 1252015200000,
	                    "s": 1238104800000
	                },
	                {
	                    "e": 1281474000000,
	                    "s": 1269640860000
	                },
	                {
	                    "e": 1312146000000,
	                    "s": 1301608860000
	                },
	                {
	                    "e": 1348178400000,
	                    "s": 1333058400000
	                },
	                {
	                    "e": 1380229200000,
	                    "s": 1364508000000
	                },
	                {
	                    "e": 1411678800000,
	                    "s": 1395957600000
	                }
	            ]
	        },
	        {
	            "name": "Asia/Irkutsk",
	            "rules": [
	                {
	                    "e": 1224957600000,
	                    "s": 1206813600000
	                },
	                {
	                    "e": 1256407200000,
	                    "s": 1238263200000
	                },
	                {
	                    "e": 1288461600000,
	                    "s": 1269712800000
	                },
	                false,
	                false,
	                false,
	                false
	            ]
	        },
	        {
	            "name": "Asia/Jerusalem",
	            "rules": [
	                {
	                    "e": 1223161200000,
	                    "s": 1206662400000
	                },
	                {
	                    "e": 1254006000000,
	                    "s": 1238112000000
	                },
	                {
	                    "e": 1284246000000,
	                    "s": 1269561600000
	                },
	                {
	                    "e": 1317510000000,
	                    "s": 1301616000000
	                },
	                {
	                    "e": 1348354800000,
	                    "s": 1333065600000
	                },
	                {
	                    "e": 1382828400000,
	                    "s": 1364515200000
	                },
	                {
	                    "e": 1414278000000,
	                    "s": 1395964800000
	                }
	            ]
	        },
	        {
	            "name": "Asia/Kamchatka",
	            "rules": [
	                {
	                    "e": 1224943200000,
	                    "s": 1206799200000
	                },
	                {
	                    "e": 1256392800000,
	                    "s": 1238248800000
	                },
	                {
	                    "e": 1288450800000,
	                    "s": 1269698400000
	                },
	                false,
	                false,
	                false,
	                false
	            ]
	        },
	        {
	            "name": "Asia/Krasnoyarsk",
	            "rules": [
	                {
	                    "e": 1224961200000,
	                    "s": 1206817200000
	                },
	                {
	                    "e": 1256410800000,
	                    "s": 1238266800000
	                },
	                {
	                    "e": 1288465200000,
	                    "s": 1269716400000
	                },
	                false,
	                false,
	                false,
	                false
	            ]
	        },
	        {
	            "name": "Asia/Omsk",
	            "rules": [
	                {
	                    "e": 1224964800000,
	                    "s": 1206820800000
	                },
	                {
	                    "e": 1256414400000,
	                    "s": 1238270400000
	                },
	                {
	                    "e": 1288468800000,
	                    "s": 1269720000000
	                },
	                false,
	                false,
	                false,
	                false
	            ]
	        },
	        {
	            "name": "Asia/Vladivostok",
	            "rules": [
	                {
	                    "e": 1224950400000,
	                    "s": 1206806400000
	                },
	                {
	                    "e": 1256400000000,
	                    "s": 1238256000000
	                },
	                {
	                    "e": 1288454400000,
	                    "s": 1269705600000
	                },
	                false,
	                false,
	                false,
	                false
	            ]
	        },
	        {
	            "name": "Asia/Yakutsk",
	            "rules": [
	                {
	                    "e": 1224954000000,
	                    "s": 1206810000000
	                },
	                {
	                    "e": 1256403600000,
	                    "s": 1238259600000
	                },
	                {
	                    "e": 1288458000000,
	                    "s": 1269709200000
	                },
	                false,
	                false,
	                false,
	                false
	            ]
	        },
	        {
	            "name": "Asia/Yekaterinburg",
	            "rules": [
	                {
	                    "e": 1224968400000,
	                    "s": 1206824400000
	                },
	                {
	                    "e": 1256418000000,
	                    "s": 1238274000000
	                },
	                {
	                    "e": 1288472400000,
	                    "s": 1269723600000
	                },
	                false,
	                false,
	                false,
	                false
	            ]
	        },
	        {
	            "name": "Asia/Yerevan",
	            "rules": [
	                {
	                    "e": 1224972000000,
	                    "s": 1206828000000
	                },
	                {
	                    "e": 1256421600000,
	                    "s": 1238277600000
	                },
	                {
	                    "e": 1288476000000,
	                    "s": 1269727200000
	                },
	                {
	                    "e": 1319925600000,
	                    "s": 1301176800000
	                },
	                false,
	                false,
	                false
	            ]
	        },
	        {
	            "name": "Australia/Lord_Howe",
	            "rules": [
	                {
	                    "e": 1207407600000,
	                    "s": 1223134200000
	                },
	                {
	                    "e": 1238857200000,
	                    "s": 1254583800000
	                },
	                {
	                    "e": 1270306800000,
	                    "s": 1286033400000
	                },
	                {
	                    "e": 1301756400000,
	                    "s": 1317483000000
	                },
	                {
	                    "e": 1333206000000,
	                    "s": 1349537400000
	                },
	                {
	                    "e": 1365260400000,
	                    "s": 1380987000000
	                },
	                {
	                    "e": 1396710000000,
	                    "s": 1412436600000
	                }
	            ]
	        },
	        {
	            "name": "Australia/Perth",
	            "rules": [
	                {
	                    "e": 1206813600000,
	                    "s": 1224957600000
	                },
	                false,
	                false,
	                false,
	                false,
	                false,
	                false
	            ]
	        },
	        {
	            "name": "Europe/Helsinki",
	            "rules": [
	                {
	                    "e": 1224982800000,
	                    "s": 1206838800000
	                },
	                {
	                    "e": 1256432400000,
	                    "s": 1238288400000
	                },
	                {
	                    "e": 1288486800000,
	                    "s": 1269738000000
	                },
	                {
	                    "e": 1319936400000,
	                    "s": 1301187600000
	                },
	                {
	                    "e": 1351386000000,
	                    "s": 1332637200000
	                },
	                {
	                    "e": 1382835600000,
	                    "s": 1364691600000
	                },
	                {
	                    "e": 1414285200000,
	                    "s": 1396141200000
	                }
	            ]
	        },
	        {
	            "name": "Europe/Minsk",
	            "rules": [
	                {
	                    "e": 1224979200000,
	                    "s": 1206835200000
	                },
	                {
	                    "e": 1256428800000,
	                    "s": 1238284800000
	                },
	                {
	                    "e": 1288483200000,
	                    "s": 1269734400000
	                },
	                false,
	                false,
	                false,
	                false
	            ]
	        },
	        {
	            "name": "Europe/Moscow",
	            "rules": [
	                {
	                    "e": 1224975600000,
	                    "s": 1206831600000
	                },
	                {
	                    "e": 1256425200000,
	                    "s": 1238281200000
	                },
	                {
	                    "e": 1288479600000,
	                    "s": 1269730800000
	                },
	                false,
	                false,
	                false,
	                false
	            ]
	        },
	        {
	            "name": "Pacific/Apia",
	            "rules": [
	                false,
	                false,
	                false,
	                {
	                    "e": 1301752800000,
	                    "s": 1316872800000
	                },
	                {
	                    "e": 1333202400000,
	                    "s": 1348927200000
	                },
	                {
	                    "e": 1365256800000,
	                    "s": 1380376800000
	                },
	                {
	                    "e": 1396706400000,
	                    "s": 1411826400000
	                }
	            ]
	        },
	        {
	            "name": "Pacific/Fiji",
	            "rules": [
	                false,
	                false,
	                {
	                    "e": 1269698400000,
	                    "s": 1287842400000
	                },
	                {
	                    "e": 1327154400000,
	                    "s": 1319292000000
	                },
	                {
	                    "e": 1358604000000,
	                    "s": 1350741600000
	                },
	                {
	                    "e": 1390050000000,
	                    "s": 1382796000000
	                },
	                {
	                    "e": 1421503200000,
	                    "s": 1414850400000
	                }
	            ]
	        }
	    ]
	};    if (true) {
	        exports.jstz = jstz;
	    } else {
	        root.jstz = jstz;
	    }
	})(this);


/***/ },
/* 265 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var maquette_1 = __webpack_require__(213);
	var page_1 = __webpack_require__(216);
	var text_field_1 = __webpack_require__(224);
	var text_1 = __webpack_require__(221);
	var button_1 = __webpack_require__(227);
	exports.createFileUploadPage = function (dataService, projector) {
	    var newFileTitle = '';
	    var newFileContent = '';
	    var allEntries;
	    var fileSystem;
	    // do alerts as error callback
	    var onErrorLoadFs = function () { alert('onErrorLoadFs'); };
	    var onErrorCreateFile = function () { alert('onerrorcreatefile'); };
	    var onErrorReadFile = function () { alert('onErrorReadFile'); };
	    // get the folders in the filesystem
	    var getEntries = function (filesystem) {
	        var reader = filesystem.root.createReader();
	        reader.readEntries(function (entries) {
	            allEntries = entries;
	            projector.scheduleRender();
	        }, onErrorReadFile);
	    };
	    var deleteFile = function (evt) {
	        var target = evt.currentTarget;
	        var fileName = target.getAttribute('data-fileName');
	        fileSystem.root.getFile(fileName, { create: true, exclusive: false }, function (fileEntry) {
	            fileEntry.remove(function () {
	                console.log('File removed!');
	                getEntries(fileSystem);
	            }, function () {
	                console.log('error deleting the file ');
	            });
	        });
	    };
	    // read the content from a file
	    var readFile = function (fileEntry) {
	        fileEntry.file(function (file) {
	            var reader = new FileReader();
	            reader.onloadend = function () {
	                console.log('Successful file read: ' + this.result);
	            };
	            reader.readAsText(file);
	        }, onErrorReadFile);
	    };
	    // write content to a file
	    var writeFile = function (fileEntry, dataObj) {
	        // Create a FileWriter object for our FileEntry (log.txt).
	        fileEntry.createWriter(function (fileWriter) {
	            fileWriter.onwriteend = function () {
	                readFile(fileEntry);
	            };
	            fileWriter.onerror = function (e) {
	                console.log('Failed file read: ' + e.toString());
	            };
	            dataObj = new Blob([newFileContent], { type: 'text/plain' });
	            fileWriter.write(dataObj);
	        });
	        getEntries(fileSystem);
	    };
	    // in this function cordova's global functions can be used.
	    var onDeviceReady = function () {
	        allEntries = [];
	        console.log(FileTransfer);
	        window.requestFileSystem(window.TEMPORARY, 5 * 1024 * 1024, function (fs) {
	            fileSystem = fs;
	            getEntries(fileSystem);
	        }, onErrorLoadFs);
	    };
	    document.addEventListener('deviceready', onDeviceReady, false);
	    // Create new txt file (on button click)
	    var createNewFile = function () {
	        fileSystem.root.getFile(newFileTitle, { create: true, exclusive: false }, function (fileEntry) {
	            writeFile(fileEntry, null);
	        }, onErrorCreateFile);
	    };
	    var openFile = function (evt) {
	        var target = evt.currentTarget;
	        var fileName = target.getAttribute('data-fileName');
	        fileSystem.root.getFile(fileName, { create: true, exclusive: false }, function (fileEntry) {
	            fileEntry.file(function (file) {
	                var reader = new FileReader();
	                reader.onloadend = function () {
	                    alert('Successful file read: ' + this.result);
	                };
	                reader.readAsText(file);
	            }, onErrorReadFile);
	        });
	    };
	    var editFile = function (evt) {
	        var target = evt.currentTarget;
	        var fileName = target.getAttribute('data-fileName');
	        newFileTitle = fileName;
	        fileSystem.root.getFile(fileName, { create: true, exclusive: false }, function (fileEntry) {
	            fileEntry.file(function (file) {
	                var reader = new FileReader();
	                reader.onloadend = function () {
	                    newFileContent = this.result;
	                    projector.scheduleRender();
	                };
	                reader.readAsText(file);
	            }, onErrorReadFile);
	        });
	    };
	    // !! Assumes variable fileURL contains a valid URL to a path on the device,
	    //    for example, cdvfile://localhost/persistent/path/to/downloads/
	    // let fileTransfer = new FileTransfer();
	    // let uri = encodeURI("http://some.server.com/download.php");
	    // fileTransfer.download(
	    //     uri,
	    //     fileURL,
	    //     function(entry) {
	    //         console.log("download complete: " + entry.toURL());
	    //     },
	    //     function(error) {
	    //         console.log("download error source " + error.source);
	    //         console.log("download error target " + error.target);
	    //         console.log("upload error code" + error.code);
	    //     },
	    //     false,
	    //     {
	    //         headers: {
	    //             "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
	    //         }
	    //     }
	    // );
	    return page_1.createPage({
	        title: 'File upload / file reading',
	        dataService: dataService,
	        body: [
	            text_1.createText({ htmlContent: '<h2>All browsers/devices</h2>' }),
	            {
	                renderMaquette: function () {
	                    return maquette_1.h('div', [
	                        maquette_1.h('input', { type: 'file', name: 'file[]', multiple: true }, []),
	                        maquette_1.h('a', { download: 'pdf.pdf', href: 'images/pdf.pdf', title: 'imageName' }, ['download a fancy image']),
	                        maquette_1.h('hr')
	                    ]);
	                }
	            },
	            text_1.createText({ htmlContent: '<h2>[Cordova] add new file </h2>' }),
	            text_field_1.createTextField({ label: 'title' }, { getValue: function () { return newFileTitle; }, setValue: function (value) { newFileTitle = value; } }),
	            text_field_1.createTextField({ label: 'content' }, { getValue: function () { return newFileContent; }, setValue: function (value) { newFileContent = value; } }),
	            button_1.createButton({ text: 'Create the file', primary: true }, { onClick: createNewFile }),
	            {
	                renderMaquette: function () {
	                    return maquette_1.h('div', [
	                        allEntries ? maquette_1.h('div', [allEntries.map(function (entry) { return [
	                                maquette_1.h('div', { class: 'attachment', key: entry.name }, [
	                                    maquette_1.h('p', { key: entry.name }, [entry.name]),
	                                    maquette_1.h('button', { class: 'button invertedPrimary', onclick: editFile, key: entry.name, 'data-fileName': entry.name }, ['edit']),
	                                    maquette_1.h('button', { class: 'button invertedPrimary', onclick: openFile, key: entry.name, 'data-fileName': entry.name }, ['show/download']),
	                                    maquette_1.h('button', { class: 'button invertedDanger', onclick: deleteFile, key: entry.name, 'data-fileName': entry.name }, ['delete'])
	                                ])
	                            ]; })
	                        ])
	                            : maquette_1.h('div', ['loading files...'])
	                    ]);
	                }
	            }
	        ]
	    });
	};


/***/ },
/* 266 */
/***/ function(module, exports) {

	"use strict";
	exports.createUserService = function (store, scheduleRender) {
	    var users;
	    var userInfo;
	    var updateUserInfo = function (newUserInfo) {
	        users.upsert(newUserInfo).subscribe({
	            error: function (msg) { console.error(msg); },
	            complete: function () {
	                store.setItem('user-info', newUserInfo).then(function () {
	                    userInfo = newUserInfo;
	                    scheduleRender();
	                });
	            }
	        });
	    };
	    return {
	        initialize: function () {
	            return store.getItem('user-info').then(function (info) {
	                userInfo = info;
	            });
	        },
	        initializeHorizon: function (horizon) {
	            users = horizon('users');
	            // synchronize the userInfo with horizon in the background
	            if (userInfo) {
	                users.findAll({ id: userInfo.id }).fetch().subscribe(function (serverInfo) {
	                    if (serverInfo.length === 0) {
	                        // The server forgot about us, lets remind him who we are
	                        updateUserInfo(userInfo);
	                    }
	                    else {
	                        // The server may have updated info
	                        userInfo = serverInfo[0];
	                    }
	                }, function (err) {
	                    console.error(err);
	                });
	            }
	        },
	        updateUserInfo: updateUserInfo,
	        getUserInfo: function () { return userInfo; }
	    };
	};


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map