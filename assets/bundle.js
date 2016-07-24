var cmacc =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var cmacc = {
	    helper: __webpack_require__(1),
	    parser: __webpack_require__(3),
	    compose: __webpack_require__(8),
	    render: __webpack_require__(20),
	    marked: __webpack_require__(21)
	};

	module.exports = cmacc;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var mergeJson = __webpack_require__(2);

	var helper = {

	    mergeJson: function (obj1, obj2) {
	        return mergeJson.merge(obj1, obj2);
	    },

	    queryAst: function (ast, key) {

	        var res = null;
	        var current = ast;

	        var keys = key.split('.');
	        for (var i in keys) {
	            var key = keys[i];
	            if(current.variables) {
	                current.variables.forEach(function (v, k) {
	                    if (v.key === key) {
	                        if (current.variables && current.variables[k]) {
	                            if(current.variables[k].link){
	                                res = current.variables[k].link;
	                                current = current.variables[k].link;
	                            }else{
	                                res = current.variables[k];
	                                current = current.variables[k];
	                            }

	                        }
	                    }
	                });
	            }
	        }

	        return res;
	    },

	    hashCode: function () {
	        var hash = 0, i, chr, len;
	        if (this.length === 0) return hash;
	        for (i = 0, len = this.length; i < len; i++) {
	            chr = this.charCodeAt(i);
	            hash = ((hash << 5) - hash) + chr;
	            hash |= 0; // Convert to 32bit integer
	        }
	        return hash;
	    }
	};

	module.exports = helper;

/***/ },
/* 2 */
/***/ function(module, exports) {

	// JSON Konstruktor für die Überprüfung ob ein Objekt JSON ist
	var jsonC = {}.constructor ;

	var isJSON = function(json){
	    if(json && json.constructor === jsonC){
	        return true ;
	    }else{
	        return false ;
	    }
	}

	exports.isJSON = isJSON ;


	var mergeJSON = function(json1, json2){
	    var result = null ;
	    if(isJSON(json2)){
	        result = {} ;
	        if(isJSON(json1)){
	            for(var key in json1){
	                result[key] = json1[key] ;
	            }
	        }

	        for(var key in json2){
	            if(typeof result[key] === "object" && typeof json2 === "object"){
	                result[key] = mergeJSON(result[key], json2[key]) ;
	            }else{
	                result[key] = json2[key] ;
	            }
	        }
	    }else if(Array.isArray(json1) && Array.isArray(json2)){
	        result = json1 ;

	        for(var i = 0; i < json2.length; i++){
	            if(result.indexOf(json2[i]) === -1){
	                result[result.length] = json2[i] ;
	            }
	        }
	    }else{
	        result = json2 ;
	    }

	    return result ;
	}

	exports.merge = mergeJSON ;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var imp = __webpack_require__(4);

	var regex = __webpack_require__(7);

	var parser = function (file, callback) {

	    var ast = {
	        file: file,
	        variables: [],
	        text: undefined,
	        src: undefined
	    };

	    imp.readFile(file, function (err, text) {

	        if (err) return callback(err)

	        ast.src = text;

	        text = text.replace(regex.REGEX_VARIABLE, function (found, key, ref, val) {
	            ast.variables.push({
	                key: key,
	                ref: ref,
	                val: val
	            });
	            return '';
	        });

	        if (text && text !== '')
	            ast.text = text;

	        callback(null, ast);

	    });
	};

	module.exports = parser;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var fs = __webpack_require__(5);
	var request = __webpack_require__(6);

	var imp = {

	    readFile : function(file, callback){
	        console.log(file)
	        if(/^http\:\/\//.test(file)){
	            request(file, function (error, response, body) {
	                if (!error && response.statusCode == 200) {
	                    callback(null, body)
	                }
	            })
	            return;
	        }

	        fs.readFile(file, 'utf8', callback);

	    }

	};

	module.exports = imp;

/***/ },
/* 5 */
/***/ function(module, exports) {

	

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = notexist;

/***/ },
/* 7 */
/***/ function(module, exports) {

	var regex = {
	    REGEX_VARIABLE: /\$\s?(\w*)\s?\=?\s?(?:\[([\.\w\/]*)\])?(?:\s?\=\>\s?)?((?:null)|(?:".*")|(?:\{[^\}]*[\s\}]*))?\n+/g,
	    REGEX_KEYVALUE: /(\"\w+\")\s?\:\s?((?:\"[^\"]*[\"])|(?:[\w\.]+))/g,
	    REGEX_INJECT: /(\n?)((?:\s{4}|\t)*)?\{\{([\w\.]*)\}\}/g,
	    REGEX_STRING: /^\"(.*)\"\,?$/
	};

	module.exports = regex;




/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var url = __webpack_require__(9);
	var path = __webpack_require__(15);
	var async = __webpack_require__(17);

	var helper = __webpack_require__(1);
	var parser = __webpack_require__(3);
	var resolve = __webpack_require__(19);

	var compose = function (file, parent, callback) {

	    parser(file, function (err, ast) {

	        if (err)
	            return callback(err);

	        var variables = [];
	        ast.variables.forEach(function (item, i) {
	            if(parent && parent) {
	                var inject = helper.queryAst(parent, item.key)
	                if (inject) {
	                    variables.push(inject);
	                }
	                else {
	                    variables.push(item);
	                }
	            }else{
	                variables.push(item);
	            }
	        });

	        if(parent) {
	            parent.file = ast.file;
	            parent.src = ast.src;
	            parent.text = ast.text;
	            parent.variables = variables;
	            ast = parent;
	        }

	        var exec = [];
	        ast.variables.forEach(function (item, i) {
	            exec.push(function (callback) {
	                resolve(ast.variables[i], ast, function (err, data) {
	                    if (ast.variables[i].ref && !ast.variables[i].src) {
	                        var location = url.resolve(ast.file, ast.variables[i].ref)
	                        compose(location, ast.variables[i], function (err, res) {
	                            callback();
	                        });
	                    } else {
	                        callback();
	                    }
	                });
	            });
	        });

	        async.series(exec, function (err, variables) {
	            callback(null, ast);
	        });

	    });

	}

	module.exports = compose;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	var punycode = __webpack_require__(10);

	exports.parse = urlParse;
	exports.resolve = urlResolve;
	exports.resolveObject = urlResolveObject;
	exports.format = urlFormat;

	exports.Url = Url;

	function Url() {
	  this.protocol = null;
	  this.slashes = null;
	  this.auth = null;
	  this.host = null;
	  this.port = null;
	  this.hostname = null;
	  this.hash = null;
	  this.search = null;
	  this.query = null;
	  this.pathname = null;
	  this.path = null;
	  this.href = null;
	}

	// Reference: RFC 3986, RFC 1808, RFC 2396

	// define these here so at least they only have to be
	// compiled once on the first module load.
	var protocolPattern = /^([a-z0-9.+-]+:)/i,
	    portPattern = /:[0-9]*$/,

	    // RFC 2396: characters reserved for delimiting URLs.
	    // We actually just auto-escape these.
	    delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],

	    // RFC 2396: characters not allowed for various reasons.
	    unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),

	    // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
	    autoEscape = ['\''].concat(unwise),
	    // Characters that are never ever allowed in a hostname.
	    // Note that any invalid chars are also handled, but these
	    // are the ones that are *expected* to be seen, so we fast-path
	    // them.
	    nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
	    hostEndingChars = ['/', '?', '#'],
	    hostnameMaxLen = 255,
	    hostnamePartPattern = /^[a-z0-9A-Z_-]{0,63}$/,
	    hostnamePartStart = /^([a-z0-9A-Z_-]{0,63})(.*)$/,
	    // protocols that can allow "unsafe" and "unwise" chars.
	    unsafeProtocol = {
	      'javascript': true,
	      'javascript:': true
	    },
	    // protocols that never have a hostname.
	    hostlessProtocol = {
	      'javascript': true,
	      'javascript:': true
	    },
	    // protocols that always contain a // bit.
	    slashedProtocol = {
	      'http': true,
	      'https': true,
	      'ftp': true,
	      'gopher': true,
	      'file': true,
	      'http:': true,
	      'https:': true,
	      'ftp:': true,
	      'gopher:': true,
	      'file:': true
	    },
	    querystring = __webpack_require__(12);

	function urlParse(url, parseQueryString, slashesDenoteHost) {
	  if (url && isObject(url) && url instanceof Url) return url;

	  var u = new Url;
	  u.parse(url, parseQueryString, slashesDenoteHost);
	  return u;
	}

	Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
	  if (!isString(url)) {
	    throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
	  }

	  var rest = url;

	  // trim before proceeding.
	  // This is to support parse stuff like "  http://foo.com  \n"
	  rest = rest.trim();

	  var proto = protocolPattern.exec(rest);
	  if (proto) {
	    proto = proto[0];
	    var lowerProto = proto.toLowerCase();
	    this.protocol = lowerProto;
	    rest = rest.substr(proto.length);
	  }

	  // figure out if it's got a host
	  // user@server is *always* interpreted as a hostname, and url
	  // resolution will treat //foo/bar as host=foo,path=bar because that's
	  // how the browser resolves relative URLs.
	  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
	    var slashes = rest.substr(0, 2) === '//';
	    if (slashes && !(proto && hostlessProtocol[proto])) {
	      rest = rest.substr(2);
	      this.slashes = true;
	    }
	  }

	  if (!hostlessProtocol[proto] &&
	      (slashes || (proto && !slashedProtocol[proto]))) {

	    // there's a hostname.
	    // the first instance of /, ?, ;, or # ends the host.
	    //
	    // If there is an @ in the hostname, then non-host chars *are* allowed
	    // to the left of the last @ sign, unless some host-ending character
	    // comes *before* the @-sign.
	    // URLs are obnoxious.
	    //
	    // ex:
	    // http://a@b@c/ => user:a@b host:c
	    // http://a@b?@c => user:a host:c path:/?@c

	    // v0.12 TODO(isaacs): This is not quite how Chrome does things.
	    // Review our test case against browsers more comprehensively.

	    // find the first instance of any hostEndingChars
	    var hostEnd = -1;
	    for (var i = 0; i < hostEndingChars.length; i++) {
	      var hec = rest.indexOf(hostEndingChars[i]);
	      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
	        hostEnd = hec;
	    }

	    // at this point, either we have an explicit point where the
	    // auth portion cannot go past, or the last @ char is the decider.
	    var auth, atSign;
	    if (hostEnd === -1) {
	      // atSign can be anywhere.
	      atSign = rest.lastIndexOf('@');
	    } else {
	      // atSign must be in auth portion.
	      // http://a@b/c@d => host:b auth:a path:/c@d
	      atSign = rest.lastIndexOf('@', hostEnd);
	    }

	    // Now we have a portion which is definitely the auth.
	    // Pull that off.
	    if (atSign !== -1) {
	      auth = rest.slice(0, atSign);
	      rest = rest.slice(atSign + 1);
	      this.auth = decodeURIComponent(auth);
	    }

	    // the host is the remaining to the left of the first non-host char
	    hostEnd = -1;
	    for (var i = 0; i < nonHostChars.length; i++) {
	      var hec = rest.indexOf(nonHostChars[i]);
	      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
	        hostEnd = hec;
	    }
	    // if we still have not hit it, then the entire thing is a host.
	    if (hostEnd === -1)
	      hostEnd = rest.length;

	    this.host = rest.slice(0, hostEnd);
	    rest = rest.slice(hostEnd);

	    // pull out port.
	    this.parseHost();

	    // we've indicated that there is a hostname,
	    // so even if it's empty, it has to be present.
	    this.hostname = this.hostname || '';

	    // if hostname begins with [ and ends with ]
	    // assume that it's an IPv6 address.
	    var ipv6Hostname = this.hostname[0] === '[' &&
	        this.hostname[this.hostname.length - 1] === ']';

	    // validate a little.
	    if (!ipv6Hostname) {
	      var hostparts = this.hostname.split(/\./);
	      for (var i = 0, l = hostparts.length; i < l; i++) {
	        var part = hostparts[i];
	        if (!part) continue;
	        if (!part.match(hostnamePartPattern)) {
	          var newpart = '';
	          for (var j = 0, k = part.length; j < k; j++) {
	            if (part.charCodeAt(j) > 127) {
	              // we replace non-ASCII char with a temporary placeholder
	              // we need this to make sure size of hostname is not
	              // broken by replacing non-ASCII by nothing
	              newpart += 'x';
	            } else {
	              newpart += part[j];
	            }
	          }
	          // we test again with ASCII char only
	          if (!newpart.match(hostnamePartPattern)) {
	            var validParts = hostparts.slice(0, i);
	            var notHost = hostparts.slice(i + 1);
	            var bit = part.match(hostnamePartStart);
	            if (bit) {
	              validParts.push(bit[1]);
	              notHost.unshift(bit[2]);
	            }
	            if (notHost.length) {
	              rest = '/' + notHost.join('.') + rest;
	            }
	            this.hostname = validParts.join('.');
	            break;
	          }
	        }
	      }
	    }

	    if (this.hostname.length > hostnameMaxLen) {
	      this.hostname = '';
	    } else {
	      // hostnames are always lower case.
	      this.hostname = this.hostname.toLowerCase();
	    }

	    if (!ipv6Hostname) {
	      // IDNA Support: Returns a puny coded representation of "domain".
	      // It only converts the part of the domain name that
	      // has non ASCII characters. I.e. it dosent matter if
	      // you call it with a domain that already is in ASCII.
	      var domainArray = this.hostname.split('.');
	      var newOut = [];
	      for (var i = 0; i < domainArray.length; ++i) {
	        var s = domainArray[i];
	        newOut.push(s.match(/[^A-Za-z0-9_-]/) ?
	            'xn--' + punycode.encode(s) : s);
	      }
	      this.hostname = newOut.join('.');
	    }

	    var p = this.port ? ':' + this.port : '';
	    var h = this.hostname || '';
	    this.host = h + p;
	    this.href += this.host;

	    // strip [ and ] from the hostname
	    // the host field still retains them, though
	    if (ipv6Hostname) {
	      this.hostname = this.hostname.substr(1, this.hostname.length - 2);
	      if (rest[0] !== '/') {
	        rest = '/' + rest;
	      }
	    }
	  }

	  // now rest is set to the post-host stuff.
	  // chop off any delim chars.
	  if (!unsafeProtocol[lowerProto]) {

	    // First, make 100% sure that any "autoEscape" chars get
	    // escaped, even if encodeURIComponent doesn't think they
	    // need to be.
	    for (var i = 0, l = autoEscape.length; i < l; i++) {
	      var ae = autoEscape[i];
	      var esc = encodeURIComponent(ae);
	      if (esc === ae) {
	        esc = escape(ae);
	      }
	      rest = rest.split(ae).join(esc);
	    }
	  }


	  // chop off from the tail first.
	  var hash = rest.indexOf('#');
	  if (hash !== -1) {
	    // got a fragment string.
	    this.hash = rest.substr(hash);
	    rest = rest.slice(0, hash);
	  }
	  var qm = rest.indexOf('?');
	  if (qm !== -1) {
	    this.search = rest.substr(qm);
	    this.query = rest.substr(qm + 1);
	    if (parseQueryString) {
	      this.query = querystring.parse(this.query);
	    }
	    rest = rest.slice(0, qm);
	  } else if (parseQueryString) {
	    // no query string, but parseQueryString still requested
	    this.search = '';
	    this.query = {};
	  }
	  if (rest) this.pathname = rest;
	  if (slashedProtocol[lowerProto] &&
	      this.hostname && !this.pathname) {
	    this.pathname = '/';
	  }

	  //to support http.request
	  if (this.pathname || this.search) {
	    var p = this.pathname || '';
	    var s = this.search || '';
	    this.path = p + s;
	  }

	  // finally, reconstruct the href based on what has been validated.
	  this.href = this.format();
	  return this;
	};

	// format a parsed object into a url string
	function urlFormat(obj) {
	  // ensure it's an object, and not a string url.
	  // If it's an obj, this is a no-op.
	  // this way, you can call url_format() on strings
	  // to clean up potentially wonky urls.
	  if (isString(obj)) obj = urlParse(obj);
	  if (!(obj instanceof Url)) return Url.prototype.format.call(obj);
	  return obj.format();
	}

	Url.prototype.format = function() {
	  var auth = this.auth || '';
	  if (auth) {
	    auth = encodeURIComponent(auth);
	    auth = auth.replace(/%3A/i, ':');
	    auth += '@';
	  }

	  var protocol = this.protocol || '',
	      pathname = this.pathname || '',
	      hash = this.hash || '',
	      host = false,
	      query = '';

	  if (this.host) {
	    host = auth + this.host;
	  } else if (this.hostname) {
	    host = auth + (this.hostname.indexOf(':') === -1 ?
	        this.hostname :
	        '[' + this.hostname + ']');
	    if (this.port) {
	      host += ':' + this.port;
	    }
	  }

	  if (this.query &&
	      isObject(this.query) &&
	      Object.keys(this.query).length) {
	    query = querystring.stringify(this.query);
	  }

	  var search = this.search || (query && ('?' + query)) || '';

	  if (protocol && protocol.substr(-1) !== ':') protocol += ':';

	  // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
	  // unless they had them to begin with.
	  if (this.slashes ||
	      (!protocol || slashedProtocol[protocol]) && host !== false) {
	    host = '//' + (host || '');
	    if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
	  } else if (!host) {
	    host = '';
	  }

	  if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
	  if (search && search.charAt(0) !== '?') search = '?' + search;

	  pathname = pathname.replace(/[?#]/g, function(match) {
	    return encodeURIComponent(match);
	  });
	  search = search.replace('#', '%23');

	  return protocol + host + pathname + search + hash;
	};

	function urlResolve(source, relative) {
	  return urlParse(source, false, true).resolve(relative);
	}

	Url.prototype.resolve = function(relative) {
	  return this.resolveObject(urlParse(relative, false, true)).format();
	};

	function urlResolveObject(source, relative) {
	  if (!source) return relative;
	  return urlParse(source, false, true).resolveObject(relative);
	}

	Url.prototype.resolveObject = function(relative) {
	  if (isString(relative)) {
	    var rel = new Url();
	    rel.parse(relative, false, true);
	    relative = rel;
	  }

	  var result = new Url();
	  Object.keys(this).forEach(function(k) {
	    result[k] = this[k];
	  }, this);

	  // hash is always overridden, no matter what.
	  // even href="" will remove it.
	  result.hash = relative.hash;

	  // if the relative url is empty, then there's nothing left to do here.
	  if (relative.href === '') {
	    result.href = result.format();
	    return result;
	  }

	  // hrefs like //foo/bar always cut to the protocol.
	  if (relative.slashes && !relative.protocol) {
	    // take everything except the protocol from relative
	    Object.keys(relative).forEach(function(k) {
	      if (k !== 'protocol')
	        result[k] = relative[k];
	    });

	    //urlParse appends trailing / to urls like http://www.example.com
	    if (slashedProtocol[result.protocol] &&
	        result.hostname && !result.pathname) {
	      result.path = result.pathname = '/';
	    }

	    result.href = result.format();
	    return result;
	  }

	  if (relative.protocol && relative.protocol !== result.protocol) {
	    // if it's a known url protocol, then changing
	    // the protocol does weird things
	    // first, if it's not file:, then we MUST have a host,
	    // and if there was a path
	    // to begin with, then we MUST have a path.
	    // if it is file:, then the host is dropped,
	    // because that's known to be hostless.
	    // anything else is assumed to be absolute.
	    if (!slashedProtocol[relative.protocol]) {
	      Object.keys(relative).forEach(function(k) {
	        result[k] = relative[k];
	      });
	      result.href = result.format();
	      return result;
	    }

	    result.protocol = relative.protocol;
	    if (!relative.host && !hostlessProtocol[relative.protocol]) {
	      var relPath = (relative.pathname || '').split('/');
	      while (relPath.length && !(relative.host = relPath.shift()));
	      if (!relative.host) relative.host = '';
	      if (!relative.hostname) relative.hostname = '';
	      if (relPath[0] !== '') relPath.unshift('');
	      if (relPath.length < 2) relPath.unshift('');
	      result.pathname = relPath.join('/');
	    } else {
	      result.pathname = relative.pathname;
	    }
	    result.search = relative.search;
	    result.query = relative.query;
	    result.host = relative.host || '';
	    result.auth = relative.auth;
	    result.hostname = relative.hostname || relative.host;
	    result.port = relative.port;
	    // to support http.request
	    if (result.pathname || result.search) {
	      var p = result.pathname || '';
	      var s = result.search || '';
	      result.path = p + s;
	    }
	    result.slashes = result.slashes || relative.slashes;
	    result.href = result.format();
	    return result;
	  }

	  var isSourceAbs = (result.pathname && result.pathname.charAt(0) === '/'),
	      isRelAbs = (
	          relative.host ||
	          relative.pathname && relative.pathname.charAt(0) === '/'
	      ),
	      mustEndAbs = (isRelAbs || isSourceAbs ||
	                    (result.host && relative.pathname)),
	      removeAllDots = mustEndAbs,
	      srcPath = result.pathname && result.pathname.split('/') || [],
	      relPath = relative.pathname && relative.pathname.split('/') || [],
	      psychotic = result.protocol && !slashedProtocol[result.protocol];

	  // if the url is a non-slashed url, then relative
	  // links like ../.. should be able
	  // to crawl up to the hostname, as well.  This is strange.
	  // result.protocol has already been set by now.
	  // Later on, put the first path part into the host field.
	  if (psychotic) {
	    result.hostname = '';
	    result.port = null;
	    if (result.host) {
	      if (srcPath[0] === '') srcPath[0] = result.host;
	      else srcPath.unshift(result.host);
	    }
	    result.host = '';
	    if (relative.protocol) {
	      relative.hostname = null;
	      relative.port = null;
	      if (relative.host) {
	        if (relPath[0] === '') relPath[0] = relative.host;
	        else relPath.unshift(relative.host);
	      }
	      relative.host = null;
	    }
	    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
	  }

	  if (isRelAbs) {
	    // it's absolute.
	    result.host = (relative.host || relative.host === '') ?
	                  relative.host : result.host;
	    result.hostname = (relative.hostname || relative.hostname === '') ?
	                      relative.hostname : result.hostname;
	    result.search = relative.search;
	    result.query = relative.query;
	    srcPath = relPath;
	    // fall through to the dot-handling below.
	  } else if (relPath.length) {
	    // it's relative
	    // throw away the existing file, and take the new path instead.
	    if (!srcPath) srcPath = [];
	    srcPath.pop();
	    srcPath = srcPath.concat(relPath);
	    result.search = relative.search;
	    result.query = relative.query;
	  } else if (!isNullOrUndefined(relative.search)) {
	    // just pull out the search.
	    // like href='?foo'.
	    // Put this after the other two cases because it simplifies the booleans
	    if (psychotic) {
	      result.hostname = result.host = srcPath.shift();
	      //occationaly the auth can get stuck only in host
	      //this especialy happens in cases like
	      //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
	      var authInHost = result.host && result.host.indexOf('@') > 0 ?
	                       result.host.split('@') : false;
	      if (authInHost) {
	        result.auth = authInHost.shift();
	        result.host = result.hostname = authInHost.shift();
	      }
	    }
	    result.search = relative.search;
	    result.query = relative.query;
	    //to support http.request
	    if (!isNull(result.pathname) || !isNull(result.search)) {
	      result.path = (result.pathname ? result.pathname : '') +
	                    (result.search ? result.search : '');
	    }
	    result.href = result.format();
	    return result;
	  }

	  if (!srcPath.length) {
	    // no path at all.  easy.
	    // we've already handled the other stuff above.
	    result.pathname = null;
	    //to support http.request
	    if (result.search) {
	      result.path = '/' + result.search;
	    } else {
	      result.path = null;
	    }
	    result.href = result.format();
	    return result;
	  }

	  // if a url ENDs in . or .., then it must get a trailing slash.
	  // however, if it ends in anything else non-slashy,
	  // then it must NOT get a trailing slash.
	  var last = srcPath.slice(-1)[0];
	  var hasTrailingSlash = (
	      (result.host || relative.host) && (last === '.' || last === '..') ||
	      last === '');

	  // strip single dots, resolve double dots to parent dir
	  // if the path tries to go above the root, `up` ends up > 0
	  var up = 0;
	  for (var i = srcPath.length; i >= 0; i--) {
	    last = srcPath[i];
	    if (last == '.') {
	      srcPath.splice(i, 1);
	    } else if (last === '..') {
	      srcPath.splice(i, 1);
	      up++;
	    } else if (up) {
	      srcPath.splice(i, 1);
	      up--;
	    }
	  }

	  // if the path is allowed to go above the root, restore leading ..s
	  if (!mustEndAbs && !removeAllDots) {
	    for (; up--; up) {
	      srcPath.unshift('..');
	    }
	  }

	  if (mustEndAbs && srcPath[0] !== '' &&
	      (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
	    srcPath.unshift('');
	  }

	  if (hasTrailingSlash && (srcPath.join('/').substr(-1) !== '/')) {
	    srcPath.push('');
	  }

	  var isAbsolute = srcPath[0] === '' ||
	      (srcPath[0] && srcPath[0].charAt(0) === '/');

	  // put the host back
	  if (psychotic) {
	    result.hostname = result.host = isAbsolute ? '' :
	                                    srcPath.length ? srcPath.shift() : '';
	    //occationaly the auth can get stuck only in host
	    //this especialy happens in cases like
	    //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
	    var authInHost = result.host && result.host.indexOf('@') > 0 ?
	                     result.host.split('@') : false;
	    if (authInHost) {
	      result.auth = authInHost.shift();
	      result.host = result.hostname = authInHost.shift();
	    }
	  }

	  mustEndAbs = mustEndAbs || (result.host && srcPath.length);

	  if (mustEndAbs && !isAbsolute) {
	    srcPath.unshift('');
	  }

	  if (!srcPath.length) {
	    result.pathname = null;
	    result.path = null;
	  } else {
	    result.pathname = srcPath.join('/');
	  }

	  //to support request.http
	  if (!isNull(result.pathname) || !isNull(result.search)) {
	    result.path = (result.pathname ? result.pathname : '') +
	                  (result.search ? result.search : '');
	  }
	  result.auth = relative.auth || result.auth;
	  result.slashes = result.slashes || relative.slashes;
	  result.href = result.format();
	  return result;
	};

	Url.prototype.parseHost = function() {
	  var host = this.host;
	  var port = portPattern.exec(host);
	  if (port) {
	    port = port[0];
	    if (port !== ':') {
	      this.port = port.substr(1);
	    }
	    host = host.substr(0, host.length - port.length);
	  }
	  if (host) this.hostname = host;
	};

	function isString(arg) {
	  return typeof arg === "string";
	}

	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}

	function isNull(arg) {
	  return arg === null;
	}
	function isNullOrUndefined(arg) {
	  return  arg == null;
	}


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module, global) {/*! https://mths.be/punycode v1.3.2 by @mathias */
	;(function(root) {

		/** Detect free variables */
		var freeExports = typeof exports == 'object' && exports &&
			!exports.nodeType && exports;
		var freeModule = typeof module == 'object' && module &&
			!module.nodeType && module;
		var freeGlobal = typeof global == 'object' && global;
		if (
			freeGlobal.global === freeGlobal ||
			freeGlobal.window === freeGlobal ||
			freeGlobal.self === freeGlobal
		) {
			root = freeGlobal;
		}

		/**
		 * The `punycode` object.
		 * @name punycode
		 * @type Object
		 */
		var punycode,

		/** Highest positive signed 32-bit float value */
		maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1

		/** Bootstring parameters */
		base = 36,
		tMin = 1,
		tMax = 26,
		skew = 38,
		damp = 700,
		initialBias = 72,
		initialN = 128, // 0x80
		delimiter = '-', // '\x2D'

		/** Regular expressions */
		regexPunycode = /^xn--/,
		regexNonASCII = /[^\x20-\x7E]/, // unprintable ASCII chars + non-ASCII chars
		regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, // RFC 3490 separators

		/** Error messages */
		errors = {
			'overflow': 'Overflow: input needs wider integers to process',
			'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
			'invalid-input': 'Invalid input'
		},

		/** Convenience shortcuts */
		baseMinusTMin = base - tMin,
		floor = Math.floor,
		stringFromCharCode = String.fromCharCode,

		/** Temporary variable */
		key;

		/*--------------------------------------------------------------------------*/

		/**
		 * A generic error utility function.
		 * @private
		 * @param {String} type The error type.
		 * @returns {Error} Throws a `RangeError` with the applicable error message.
		 */
		function error(type) {
			throw RangeError(errors[type]);
		}

		/**
		 * A generic `Array#map` utility function.
		 * @private
		 * @param {Array} array The array to iterate over.
		 * @param {Function} callback The function that gets called for every array
		 * item.
		 * @returns {Array} A new array of values returned by the callback function.
		 */
		function map(array, fn) {
			var length = array.length;
			var result = [];
			while (length--) {
				result[length] = fn(array[length]);
			}
			return result;
		}

		/**
		 * A simple `Array#map`-like wrapper to work with domain name strings or email
		 * addresses.
		 * @private
		 * @param {String} domain The domain name or email address.
		 * @param {Function} callback The function that gets called for every
		 * character.
		 * @returns {Array} A new string of characters returned by the callback
		 * function.
		 */
		function mapDomain(string, fn) {
			var parts = string.split('@');
			var result = '';
			if (parts.length > 1) {
				// In email addresses, only the domain name should be punycoded. Leave
				// the local part (i.e. everything up to `@`) intact.
				result = parts[0] + '@';
				string = parts[1];
			}
			// Avoid `split(regex)` for IE8 compatibility. See #17.
			string = string.replace(regexSeparators, '\x2E');
			var labels = string.split('.');
			var encoded = map(labels, fn).join('.');
			return result + encoded;
		}

		/**
		 * Creates an array containing the numeric code points of each Unicode
		 * character in the string. While JavaScript uses UCS-2 internally,
		 * this function will convert a pair of surrogate halves (each of which
		 * UCS-2 exposes as separate characters) into a single code point,
		 * matching UTF-16.
		 * @see `punycode.ucs2.encode`
		 * @see <https://mathiasbynens.be/notes/javascript-encoding>
		 * @memberOf punycode.ucs2
		 * @name decode
		 * @param {String} string The Unicode input string (UCS-2).
		 * @returns {Array} The new array of code points.
		 */
		function ucs2decode(string) {
			var output = [],
			    counter = 0,
			    length = string.length,
			    value,
			    extra;
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

		/**
		 * Creates a string based on an array of numeric code points.
		 * @see `punycode.ucs2.decode`
		 * @memberOf punycode.ucs2
		 * @name encode
		 * @param {Array} codePoints The array of numeric code points.
		 * @returns {String} The new Unicode string (UCS-2).
		 */
		function ucs2encode(array) {
			return map(array, function(value) {
				var output = '';
				if (value > 0xFFFF) {
					value -= 0x10000;
					output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
					value = 0xDC00 | value & 0x3FF;
				}
				output += stringFromCharCode(value);
				return output;
			}).join('');
		}

		/**
		 * Converts a basic code point into a digit/integer.
		 * @see `digitToBasic()`
		 * @private
		 * @param {Number} codePoint The basic numeric code point value.
		 * @returns {Number} The numeric value of a basic code point (for use in
		 * representing integers) in the range `0` to `base - 1`, or `base` if
		 * the code point does not represent a value.
		 */
		function basicToDigit(codePoint) {
			if (codePoint - 48 < 10) {
				return codePoint - 22;
			}
			if (codePoint - 65 < 26) {
				return codePoint - 65;
			}
			if (codePoint - 97 < 26) {
				return codePoint - 97;
			}
			return base;
		}

		/**
		 * Converts a digit/integer into a basic code point.
		 * @see `basicToDigit()`
		 * @private
		 * @param {Number} digit The numeric value of a basic code point.
		 * @returns {Number} The basic code point whose value (when used for
		 * representing integers) is `digit`, which needs to be in the range
		 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
		 * used; else, the lowercase form is used. The behavior is undefined
		 * if `flag` is non-zero and `digit` has no uppercase form.
		 */
		function digitToBasic(digit, flag) {
			//  0..25 map to ASCII a..z or A..Z
			// 26..35 map to ASCII 0..9
			return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
		}

		/**
		 * Bias adaptation function as per section 3.4 of RFC 3492.
		 * http://tools.ietf.org/html/rfc3492#section-3.4
		 * @private
		 */
		function adapt(delta, numPoints, firstTime) {
			var k = 0;
			delta = firstTime ? floor(delta / damp) : delta >> 1;
			delta += floor(delta / numPoints);
			for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
				delta = floor(delta / baseMinusTMin);
			}
			return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
		}

		/**
		 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
		 * symbols.
		 * @memberOf punycode
		 * @param {String} input The Punycode string of ASCII-only symbols.
		 * @returns {String} The resulting string of Unicode symbols.
		 */
		function decode(input) {
			// Don't use UCS-2
			var output = [],
			    inputLength = input.length,
			    out,
			    i = 0,
			    n = initialN,
			    bias = initialBias,
			    basic,
			    j,
			    index,
			    oldi,
			    w,
			    k,
			    digit,
			    t,
			    /** Cached calculation results */
			    baseMinusT;

			// Handle the basic code points: let `basic` be the number of input code
			// points before the last delimiter, or `0` if there is none, then copy
			// the first basic code points to the output.

			basic = input.lastIndexOf(delimiter);
			if (basic < 0) {
				basic = 0;
			}

			for (j = 0; j < basic; ++j) {
				// if it's not a basic code point
				if (input.charCodeAt(j) >= 0x80) {
					error('not-basic');
				}
				output.push(input.charCodeAt(j));
			}

			// Main decoding loop: start just after the last delimiter if any basic code
			// points were copied; start at the beginning otherwise.

			for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

				// `index` is the index of the next character to be consumed.
				// Decode a generalized variable-length integer into `delta`,
				// which gets added to `i`. The overflow checking is easier
				// if we increase `i` as we go, then subtract off its starting
				// value at the end to obtain `delta`.
				for (oldi = i, w = 1, k = base; /* no condition */; k += base) {

					if (index >= inputLength) {
						error('invalid-input');
					}

					digit = basicToDigit(input.charCodeAt(index++));

					if (digit >= base || digit > floor((maxInt - i) / w)) {
						error('overflow');
					}

					i += digit * w;
					t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

					if (digit < t) {
						break;
					}

					baseMinusT = base - t;
					if (w > floor(maxInt / baseMinusT)) {
						error('overflow');
					}

					w *= baseMinusT;

				}

				out = output.length + 1;
				bias = adapt(i - oldi, out, oldi == 0);

				// `i` was supposed to wrap around from `out` to `0`,
				// incrementing `n` each time, so we'll fix that now:
				if (floor(i / out) > maxInt - n) {
					error('overflow');
				}

				n += floor(i / out);
				i %= out;

				// Insert `n` at position `i` of the output
				output.splice(i++, 0, n);

			}

			return ucs2encode(output);
		}

		/**
		 * Converts a string of Unicode symbols (e.g. a domain name label) to a
		 * Punycode string of ASCII-only symbols.
		 * @memberOf punycode
		 * @param {String} input The string of Unicode symbols.
		 * @returns {String} The resulting Punycode string of ASCII-only symbols.
		 */
		function encode(input) {
			var n,
			    delta,
			    handledCPCount,
			    basicLength,
			    bias,
			    j,
			    m,
			    q,
			    k,
			    t,
			    currentValue,
			    output = [],
			    /** `inputLength` will hold the number of code points in `input`. */
			    inputLength,
			    /** Cached calculation results */
			    handledCPCountPlusOne,
			    baseMinusT,
			    qMinusT;

			// Convert the input in UCS-2 to Unicode
			input = ucs2decode(input);

			// Cache the length
			inputLength = input.length;

			// Initialize the state
			n = initialN;
			delta = 0;
			bias = initialBias;

			// Handle the basic code points
			for (j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				if (currentValue < 0x80) {
					output.push(stringFromCharCode(currentValue));
				}
			}

			handledCPCount = basicLength = output.length;

			// `handledCPCount` is the number of code points that have been handled;
			// `basicLength` is the number of basic code points.

			// Finish the basic string - if it is not empty - with a delimiter
			if (basicLength) {
				output.push(delimiter);
			}

			// Main encoding loop:
			while (handledCPCount < inputLength) {

				// All non-basic code points < n have been handled already. Find the next
				// larger one:
				for (m = maxInt, j = 0; j < inputLength; ++j) {
					currentValue = input[j];
					if (currentValue >= n && currentValue < m) {
						m = currentValue;
					}
				}

				// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
				// but guard against overflow
				handledCPCountPlusOne = handledCPCount + 1;
				if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
					error('overflow');
				}

				delta += (m - n) * handledCPCountPlusOne;
				n = m;

				for (j = 0; j < inputLength; ++j) {
					currentValue = input[j];

					if (currentValue < n && ++delta > maxInt) {
						error('overflow');
					}

					if (currentValue == n) {
						// Represent delta as a generalized variable-length integer
						for (q = delta, k = base; /* no condition */; k += base) {
							t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
							if (q < t) {
								break;
							}
							qMinusT = q - t;
							baseMinusT = base - t;
							output.push(
								stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
							);
							q = floor(qMinusT / baseMinusT);
						}

						output.push(stringFromCharCode(digitToBasic(q, 0)));
						bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
						delta = 0;
						++handledCPCount;
					}
				}

				++delta;
				++n;

			}
			return output.join('');
		}

		/**
		 * Converts a Punycode string representing a domain name or an email address
		 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
		 * it doesn't matter if you call it on a string that has already been
		 * converted to Unicode.
		 * @memberOf punycode
		 * @param {String} input The Punycoded domain name or email address to
		 * convert to Unicode.
		 * @returns {String} The Unicode representation of the given Punycode
		 * string.
		 */
		function toUnicode(input) {
			return mapDomain(input, function(string) {
				return regexPunycode.test(string)
					? decode(string.slice(4).toLowerCase())
					: string;
			});
		}

		/**
		 * Converts a Unicode string representing a domain name or an email address to
		 * Punycode. Only the non-ASCII parts of the domain name will be converted,
		 * i.e. it doesn't matter if you call it with a domain that's already in
		 * ASCII.
		 * @memberOf punycode
		 * @param {String} input The domain name or email address to convert, as a
		 * Unicode string.
		 * @returns {String} The Punycode representation of the given domain name or
		 * email address.
		 */
		function toASCII(input) {
			return mapDomain(input, function(string) {
				return regexNonASCII.test(string)
					? 'xn--' + encode(string)
					: string;
			});
		}

		/*--------------------------------------------------------------------------*/

		/** Define the public API */
		punycode = {
			/**
			 * A string representing the current Punycode.js version number.
			 * @memberOf punycode
			 * @type String
			 */
			'version': '1.3.2',
			/**
			 * An object of methods to convert from JavaScript's internal character
			 * representation (UCS-2) to Unicode code points, and back.
			 * @see <https://mathiasbynens.be/notes/javascript-encoding>
			 * @memberOf punycode
			 * @type Object
			 */
			'ucs2': {
				'decode': ucs2decode,
				'encode': ucs2encode
			},
			'decode': decode,
			'encode': encode,
			'toASCII': toASCII,
			'toUnicode': toUnicode
		};

		/** Expose `punycode` */
		// Some AMD build optimizers, like r.js, check for specific condition patterns
		// like the following:
		if (
			true
		) {
			!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
				return punycode;
			}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		} else if (freeExports && freeModule) {
			if (module.exports == freeExports) { // in Node.js or RingoJS v0.8.0+
				freeModule.exports = punycode;
			} else { // in Narwhal or RingoJS v0.7.0-
				for (key in punycode) {
					punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
				}
			}
		} else { // in Rhino or a web browser
			root.punycode = punycode;
		}

	}(this));

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(11)(module), (function() { return this; }())))

/***/ },
/* 11 */
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
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.decode = exports.parse = __webpack_require__(13);
	exports.encode = exports.stringify = __webpack_require__(14);


/***/ },
/* 13 */
/***/ function(module, exports) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	'use strict';

	// If obj.hasOwnProperty has been overridden, then calling
	// obj.hasOwnProperty(prop) will break.
	// See: https://github.com/joyent/node/issues/1707
	function hasOwnProperty(obj, prop) {
	  return Object.prototype.hasOwnProperty.call(obj, prop);
	}

	module.exports = function(qs, sep, eq, options) {
	  sep = sep || '&';
	  eq = eq || '=';
	  var obj = {};

	  if (typeof qs !== 'string' || qs.length === 0) {
	    return obj;
	  }

	  var regexp = /\+/g;
	  qs = qs.split(sep);

	  var maxKeys = 1000;
	  if (options && typeof options.maxKeys === 'number') {
	    maxKeys = options.maxKeys;
	  }

	  var len = qs.length;
	  // maxKeys <= 0 means that we should not limit keys count
	  if (maxKeys > 0 && len > maxKeys) {
	    len = maxKeys;
	  }

	  for (var i = 0; i < len; ++i) {
	    var x = qs[i].replace(regexp, '%20'),
	        idx = x.indexOf(eq),
	        kstr, vstr, k, v;

	    if (idx >= 0) {
	      kstr = x.substr(0, idx);
	      vstr = x.substr(idx + 1);
	    } else {
	      kstr = x;
	      vstr = '';
	    }

	    k = decodeURIComponent(kstr);
	    v = decodeURIComponent(vstr);

	    if (!hasOwnProperty(obj, k)) {
	      obj[k] = v;
	    } else if (Array.isArray(obj[k])) {
	      obj[k].push(v);
	    } else {
	      obj[k] = [obj[k], v];
	    }
	  }

	  return obj;
	};


/***/ },
/* 14 */
/***/ function(module, exports) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	'use strict';

	var stringifyPrimitive = function(v) {
	  switch (typeof v) {
	    case 'string':
	      return v;

	    case 'boolean':
	      return v ? 'true' : 'false';

	    case 'number':
	      return isFinite(v) ? v : '';

	    default:
	      return '';
	  }
	};

	module.exports = function(obj, sep, eq, name) {
	  sep = sep || '&';
	  eq = eq || '=';
	  if (obj === null) {
	    obj = undefined;
	  }

	  if (typeof obj === 'object') {
	    return Object.keys(obj).map(function(k) {
	      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
	      if (Array.isArray(obj[k])) {
	        return obj[k].map(function(v) {
	          return ks + encodeURIComponent(stringifyPrimitive(v));
	        }).join(sep);
	      } else {
	        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
	      }
	    }).join(sep);

	  }

	  if (!name) return '';
	  return encodeURIComponent(stringifyPrimitive(name)) + eq +
	         encodeURIComponent(stringifyPrimitive(obj));
	};


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	// resolves . and .. elements in a path array with directory names there
	// must be no slashes, empty elements, or device names (c:\) in the array
	// (so also no leading and trailing slashes - it does not distinguish
	// relative and absolute paths)
	function normalizeArray(parts, allowAboveRoot) {
	  // if the path tries to go above the root, `up` ends up > 0
	  var up = 0;
	  for (var i = parts.length - 1; i >= 0; i--) {
	    var last = parts[i];
	    if (last === '.') {
	      parts.splice(i, 1);
	    } else if (last === '..') {
	      parts.splice(i, 1);
	      up++;
	    } else if (up) {
	      parts.splice(i, 1);
	      up--;
	    }
	  }

	  // if the path is allowed to go above the root, restore leading ..s
	  if (allowAboveRoot) {
	    for (; up--; up) {
	      parts.unshift('..');
	    }
	  }

	  return parts;
	}

	// Split a filename into [root, dir, basename, ext], unix version
	// 'root' is just a slash, or nothing.
	var splitPathRe =
	    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
	var splitPath = function(filename) {
	  return splitPathRe.exec(filename).slice(1);
	};

	// path.resolve([from ...], to)
	// posix version
	exports.resolve = function() {
	  var resolvedPath = '',
	      resolvedAbsolute = false;

	  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
	    var path = (i >= 0) ? arguments[i] : process.cwd();

	    // Skip empty and invalid entries
	    if (typeof path !== 'string') {
	      throw new TypeError('Arguments to path.resolve must be strings');
	    } else if (!path) {
	      continue;
	    }

	    resolvedPath = path + '/' + resolvedPath;
	    resolvedAbsolute = path.charAt(0) === '/';
	  }

	  // At this point the path should be resolved to a full absolute path, but
	  // handle relative paths to be safe (might happen when process.cwd() fails)

	  // Normalize the path
	  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
	    return !!p;
	  }), !resolvedAbsolute).join('/');

	  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
	};

	// path.normalize(path)
	// posix version
	exports.normalize = function(path) {
	  var isAbsolute = exports.isAbsolute(path),
	      trailingSlash = substr(path, -1) === '/';

	  // Normalize the path
	  path = normalizeArray(filter(path.split('/'), function(p) {
	    return !!p;
	  }), !isAbsolute).join('/');

	  if (!path && !isAbsolute) {
	    path = '.';
	  }
	  if (path && trailingSlash) {
	    path += '/';
	  }

	  return (isAbsolute ? '/' : '') + path;
	};

	// posix version
	exports.isAbsolute = function(path) {
	  return path.charAt(0) === '/';
	};

	// posix version
	exports.join = function() {
	  var paths = Array.prototype.slice.call(arguments, 0);
	  return exports.normalize(filter(paths, function(p, index) {
	    if (typeof p !== 'string') {
	      throw new TypeError('Arguments to path.join must be strings');
	    }
	    return p;
	  }).join('/'));
	};


	// path.relative(from, to)
	// posix version
	exports.relative = function(from, to) {
	  from = exports.resolve(from).substr(1);
	  to = exports.resolve(to).substr(1);

	  function trim(arr) {
	    var start = 0;
	    for (; start < arr.length; start++) {
	      if (arr[start] !== '') break;
	    }

	    var end = arr.length - 1;
	    for (; end >= 0; end--) {
	      if (arr[end] !== '') break;
	    }

	    if (start > end) return [];
	    return arr.slice(start, end - start + 1);
	  }

	  var fromParts = trim(from.split('/'));
	  var toParts = trim(to.split('/'));

	  var length = Math.min(fromParts.length, toParts.length);
	  var samePartsLength = length;
	  for (var i = 0; i < length; i++) {
	    if (fromParts[i] !== toParts[i]) {
	      samePartsLength = i;
	      break;
	    }
	  }

	  var outputParts = [];
	  for (var i = samePartsLength; i < fromParts.length; i++) {
	    outputParts.push('..');
	  }

	  outputParts = outputParts.concat(toParts.slice(samePartsLength));

	  return outputParts.join('/');
	};

	exports.sep = '/';
	exports.delimiter = ':';

	exports.dirname = function(path) {
	  var result = splitPath(path),
	      root = result[0],
	      dir = result[1];

	  if (!root && !dir) {
	    // No dirname whatsoever
	    return '.';
	  }

	  if (dir) {
	    // It has a dirname, strip trailing slash
	    dir = dir.substr(0, dir.length - 1);
	  }

	  return root + dir;
	};


	exports.basename = function(path, ext) {
	  var f = splitPath(path)[2];
	  // TODO: make this comparison case-insensitive on windows?
	  if (ext && f.substr(-1 * ext.length) === ext) {
	    f = f.substr(0, f.length - ext.length);
	  }
	  return f;
	};


	exports.extname = function(path) {
	  return splitPath(path)[3];
	};

	function filter (xs, f) {
	    if (xs.filter) return xs.filter(f);
	    var res = [];
	    for (var i = 0; i < xs.length; i++) {
	        if (f(xs[i], i, xs)) res.push(xs[i]);
	    }
	    return res;
	}

	// String.prototype.substr - negative index don't work in IE8
	var substr = 'ab'.substr(-1) === 'b'
	    ? function (str, start, len) { return str.substr(start, len) }
	    : function (str, start, len) {
	        if (start < 0) start = str.length + start;
	        return str.substr(start, len);
	    }
	;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(16)))

/***/ },
/* 16 */
/***/ function(module, exports) {

	// shim for using process in browser

	var process = module.exports = {};

	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.

	var cachedSetTimeout;
	var cachedClearTimeout;

	(function () {
	  try {
	    cachedSetTimeout = setTimeout;
	  } catch (e) {
	    cachedSetTimeout = function () {
	      throw new Error('setTimeout is not defined');
	    }
	  }
	  try {
	    cachedClearTimeout = clearTimeout;
	  } catch (e) {
	    cachedClearTimeout = function () {
	      throw new Error('clearTimeout is not defined');
	    }
	  }
	} ())
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
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
	    var timeout = cachedSetTimeout(cleanUpNextTick);
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
	    cachedClearTimeout(timeout);
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
	        cachedSetTimeout(drainQueue, 0);
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
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, setImmediate, process) {(function (global, factory) {
	     true ? factory(exports) :
	    typeof define === 'function' && define.amd ? define(['exports'], factory) :
	    (factory((global.async = global.async || {})));
	}(this, function (exports) { 'use strict';

	    /**
	     * A faster alternative to `Function#apply`, this function invokes `func`
	     * with the `this` binding of `thisArg` and the arguments of `args`.
	     *
	     * @private
	     * @param {Function} func The function to invoke.
	     * @param {*} thisArg The `this` binding of `func`.
	     * @param {Array} args The arguments to invoke `func` with.
	     * @returns {*} Returns the result of `func`.
	     */
	    function apply(func, thisArg, args) {
	      var length = args.length;
	      switch (length) {
	        case 0: return func.call(thisArg);
	        case 1: return func.call(thisArg, args[0]);
	        case 2: return func.call(thisArg, args[0], args[1]);
	        case 3: return func.call(thisArg, args[0], args[1], args[2]);
	      }
	      return func.apply(thisArg, args);
	    }

	    /**
	     * Checks if `value` is the
	     * [language type](http://www.ecma-international.org/ecma-262/6.0/#sec-ecmascript-language-types)
	     * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	     *
	     * @static
	     * @memberOf _
	     * @since 0.1.0
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	     * @example
	     *
	     * _.isObject({});
	     * // => true
	     *
	     * _.isObject([1, 2, 3]);
	     * // => true
	     *
	     * _.isObject(_.noop);
	     * // => true
	     *
	     * _.isObject(null);
	     * // => false
	     */
	    function isObject(value) {
	      var type = typeof value;
	      return !!value && (type == 'object' || type == 'function');
	    }

	    var funcTag = '[object Function]';
	    var genTag = '[object GeneratorFunction]';
	    /** Used for built-in method references. */
	    var objectProto = Object.prototype;

	    /**
	     * Used to resolve the
	     * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	     * of values.
	     */
	    var objectToString = objectProto.toString;

	    /**
	     * Checks if `value` is classified as a `Function` object.
	     *
	     * @static
	     * @memberOf _
	     * @since 0.1.0
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is correctly classified,
	     *  else `false`.
	     * @example
	     *
	     * _.isFunction(_);
	     * // => true
	     *
	     * _.isFunction(/abc/);
	     * // => false
	     */
	    function isFunction(value) {
	      // The use of `Object#toString` avoids issues with the `typeof` operator
	      // in Safari 8 which returns 'object' for typed array and weak map constructors,
	      // and PhantomJS 1.9 which returns 'function' for `NodeList` instances.
	      var tag = isObject(value) ? objectToString.call(value) : '';
	      return tag == funcTag || tag == genTag;
	    }

	    /**
	     * Checks if `value` is object-like. A value is object-like if it's not `null`
	     * and has a `typeof` result of "object".
	     *
	     * @static
	     * @memberOf _
	     * @since 4.0.0
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	     * @example
	     *
	     * _.isObjectLike({});
	     * // => true
	     *
	     * _.isObjectLike([1, 2, 3]);
	     * // => true
	     *
	     * _.isObjectLike(_.noop);
	     * // => false
	     *
	     * _.isObjectLike(null);
	     * // => false
	     */
	    function isObjectLike(value) {
	      return !!value && typeof value == 'object';
	    }

	    /** `Object#toString` result references. */
	    var symbolTag = '[object Symbol]';

	    /** Used for built-in method references. */
	    var objectProto$1 = Object.prototype;

	    /**
	     * Used to resolve the
	     * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	     * of values.
	     */
	    var objectToString$1 = objectProto$1.toString;

	    /**
	     * Checks if `value` is classified as a `Symbol` primitive or object.
	     *
	     * @static
	     * @memberOf _
	     * @since 4.0.0
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is correctly classified,
	     *  else `false`.
	     * @example
	     *
	     * _.isSymbol(Symbol.iterator);
	     * // => true
	     *
	     * _.isSymbol('abc');
	     * // => false
	     */
	    function isSymbol(value) {
	      return typeof value == 'symbol' ||
	        (isObjectLike(value) && objectToString$1.call(value) == symbolTag);
	    }

	    /** Used as references for various `Number` constants. */
	    var NAN = 0 / 0;

	    /** Used to match leading and trailing whitespace. */
	    var reTrim = /^\s+|\s+$/g;

	    /** Used to detect bad signed hexadecimal string values. */
	    var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

	    /** Used to detect binary string values. */
	    var reIsBinary = /^0b[01]+$/i;

	    /** Used to detect octal string values. */
	    var reIsOctal = /^0o[0-7]+$/i;

	    /** Built-in method references without a dependency on `root`. */
	    var freeParseInt = parseInt;

	    /**
	     * Converts `value` to a number.
	     *
	     * @static
	     * @memberOf _
	     * @since 4.0.0
	     * @category Lang
	     * @param {*} value The value to process.
	     * @returns {number} Returns the number.
	     * @example
	     *
	     * _.toNumber(3.2);
	     * // => 3.2
	     *
	     * _.toNumber(Number.MIN_VALUE);
	     * // => 5e-324
	     *
	     * _.toNumber(Infinity);
	     * // => Infinity
	     *
	     * _.toNumber('3.2');
	     * // => 3.2
	     */
	    function toNumber(value) {
	      if (typeof value == 'number') {
	        return value;
	      }
	      if (isSymbol(value)) {
	        return NAN;
	      }
	      if (isObject(value)) {
	        var other = isFunction(value.valueOf) ? value.valueOf() : value;
	        value = isObject(other) ? (other + '') : other;
	      }
	      if (typeof value != 'string') {
	        return value === 0 ? value : +value;
	      }
	      value = value.replace(reTrim, '');
	      var isBinary = reIsBinary.test(value);
	      return (isBinary || reIsOctal.test(value))
	        ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
	        : (reIsBadHex.test(value) ? NAN : +value);
	    }

	    var INFINITY = 1 / 0;
	    var MAX_INTEGER = 1.7976931348623157e+308;
	    /**
	     * Converts `value` to a finite number.
	     *
	     * @static
	     * @memberOf _
	     * @since 4.12.0
	     * @category Lang
	     * @param {*} value The value to convert.
	     * @returns {number} Returns the converted number.
	     * @example
	     *
	     * _.toFinite(3.2);
	     * // => 3.2
	     *
	     * _.toFinite(Number.MIN_VALUE);
	     * // => 5e-324
	     *
	     * _.toFinite(Infinity);
	     * // => 1.7976931348623157e+308
	     *
	     * _.toFinite('3.2');
	     * // => 3.2
	     */
	    function toFinite(value) {
	      if (!value) {
	        return value === 0 ? value : 0;
	      }
	      value = toNumber(value);
	      if (value === INFINITY || value === -INFINITY) {
	        var sign = (value < 0 ? -1 : 1);
	        return sign * MAX_INTEGER;
	      }
	      return value === value ? value : 0;
	    }

	    /**
	     * Converts `value` to an integer.
	     *
	     * **Note:** This method is loosely based on
	     * [`ToInteger`](http://www.ecma-international.org/ecma-262/6.0/#sec-tointeger).
	     *
	     * @static
	     * @memberOf _
	     * @since 4.0.0
	     * @category Lang
	     * @param {*} value The value to convert.
	     * @returns {number} Returns the converted integer.
	     * @example
	     *
	     * _.toInteger(3.2);
	     * // => 3
	     *
	     * _.toInteger(Number.MIN_VALUE);
	     * // => 0
	     *
	     * _.toInteger(Infinity);
	     * // => 1.7976931348623157e+308
	     *
	     * _.toInteger('3.2');
	     * // => 3
	     */
	    function toInteger(value) {
	      var result = toFinite(value),
	          remainder = result % 1;

	      return result === result ? (remainder ? result - remainder : result) : 0;
	    }

	    /** Used as the `TypeError` message for "Functions" methods. */
	    var FUNC_ERROR_TEXT = 'Expected a function';

	    /* Built-in method references for those with the same name as other `lodash` methods. */
	    var nativeMax = Math.max;

	    /**
	     * Creates a function that invokes `func` with the `this` binding of the
	     * created function and arguments from `start` and beyond provided as
	     * an array.
	     *
	     * **Note:** This method is based on the
	     * [rest parameter](https://mdn.io/rest_parameters).
	     *
	     * @static
	     * @memberOf _
	     * @since 4.0.0
	     * @category Function
	     * @param {Function} func The function to apply a rest parameter to.
	     * @param {number} [start=func.length-1] The start position of the rest parameter.
	     * @returns {Function} Returns the new function.
	     * @example
	     *
	     * var say = _.rest(function(what, names) {
	     *   return what + ' ' + _.initial(names).join(', ') +
	     *     (_.size(names) > 1 ? ', & ' : '') + _.last(names);
	     * });
	     *
	     * say('hello', 'fred', 'barney', 'pebbles');
	     * // => 'hello fred, barney, & pebbles'
	     */
	    function rest(func, start) {
	      if (typeof func != 'function') {
	        throw new TypeError(FUNC_ERROR_TEXT);
	      }
	      start = nativeMax(start === undefined ? (func.length - 1) : toInteger(start), 0);
	      return function() {
	        var args = arguments,
	            index = -1,
	            length = nativeMax(args.length - start, 0),
	            array = Array(length);

	        while (++index < length) {
	          array[index] = args[start + index];
	        }
	        switch (start) {
	          case 0: return func.call(this, array);
	          case 1: return func.call(this, args[0], array);
	          case 2: return func.call(this, args[0], args[1], array);
	        }
	        var otherArgs = Array(start + 1);
	        index = -1;
	        while (++index < start) {
	          otherArgs[index] = args[index];
	        }
	        otherArgs[start] = array;
	        return apply(func, this, otherArgs);
	      };
	    }

	    function initialParams (fn) {
	        return rest(function (args /*..., callback*/) {
	            var callback = args.pop();
	            fn.call(this, args, callback);
	        });
	    }

	    function applyEach$1(eachfn) {
	        return rest(function (fns, args) {
	            var go = initialParams(function (args, callback) {
	                var that = this;
	                return eachfn(fns, function (fn, cb) {
	                    fn.apply(that, args.concat([cb]));
	                }, callback);
	            });
	            if (args.length) {
	                return go.apply(this, args);
	            } else {
	                return go;
	            }
	        });
	    }

	    /**
	     * The base implementation of `_.property` without support for deep paths.
	     *
	     * @private
	     * @param {string} key The key of the property to get.
	     * @returns {Function} Returns the new accessor function.
	     */
	    function baseProperty(key) {
	      return function(object) {
	        return object == null ? undefined : object[key];
	      };
	    }

	    /**
	     * Gets the "length" property value of `object`.
	     *
	     * **Note:** This function is used to avoid a
	     * [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792) that affects
	     * Safari on at least iOS 8.1-8.3 ARM64.
	     *
	     * @private
	     * @param {Object} object The object to query.
	     * @returns {*} Returns the "length" value.
	     */
	    var getLength = baseProperty('length');

	    /** Used as references for various `Number` constants. */
	    var MAX_SAFE_INTEGER = 9007199254740991;

	    /**
	     * Checks if `value` is a valid array-like length.
	     *
	     * **Note:** This function is loosely based on
	     * [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
	     *
	     * @static
	     * @memberOf _
	     * @since 4.0.0
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is a valid length,
	     *  else `false`.
	     * @example
	     *
	     * _.isLength(3);
	     * // => true
	     *
	     * _.isLength(Number.MIN_VALUE);
	     * // => false
	     *
	     * _.isLength(Infinity);
	     * // => false
	     *
	     * _.isLength('3');
	     * // => false
	     */
	    function isLength(value) {
	      return typeof value == 'number' &&
	        value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
	    }

	    /**
	     * Checks if `value` is array-like. A value is considered array-like if it's
	     * not a function and has a `value.length` that's an integer greater than or
	     * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
	     *
	     * @static
	     * @memberOf _
	     * @since 4.0.0
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
	     * @example
	     *
	     * _.isArrayLike([1, 2, 3]);
	     * // => true
	     *
	     * _.isArrayLike(document.body.children);
	     * // => true
	     *
	     * _.isArrayLike('abc');
	     * // => true
	     *
	     * _.isArrayLike(_.noop);
	     * // => false
	     */
	    function isArrayLike(value) {
	      return value != null && isLength(getLength(value)) && !isFunction(value);
	    }

	    /**
	     * A method that returns `undefined`.
	     *
	     * @static
	     * @memberOf _
	     * @since 2.3.0
	     * @category Util
	     * @example
	     *
	     * _.times(2, _.noop);
	     * // => [undefined, undefined]
	     */
	    function noop() {
	      // No operation performed.
	    }

	    function once(fn) {
	        return function () {
	            if (fn === null) return;
	            var callFn = fn;
	            fn = null;
	            callFn.apply(this, arguments);
	        };
	    }

	    var iteratorSymbol = typeof Symbol === 'function' && Symbol.iterator;

	    function getIterator (coll) {
	        return iteratorSymbol && coll[iteratorSymbol] && coll[iteratorSymbol]();
	    }

	    /* Built-in method references for those with the same name as other `lodash` methods. */
	    var nativeGetPrototype = Object.getPrototypeOf;

	    /**
	     * Gets the `[[Prototype]]` of `value`.
	     *
	     * @private
	     * @param {*} value The value to query.
	     * @returns {null|Object} Returns the `[[Prototype]]`.
	     */
	    function getPrototype(value) {
	      return nativeGetPrototype(Object(value));
	    }

	    /** Used for built-in method references. */
	    var objectProto$2 = Object.prototype;

	    /** Used to check objects for own properties. */
	    var hasOwnProperty = objectProto$2.hasOwnProperty;

	    /**
	     * The base implementation of `_.has` without support for deep paths.
	     *
	     * @private
	     * @param {Object} [object] The object to query.
	     * @param {Array|string} key The key to check.
	     * @returns {boolean} Returns `true` if `key` exists, else `false`.
	     */
	    function baseHas(object, key) {
	      // Avoid a bug in IE 10-11 where objects with a [[Prototype]] of `null`,
	      // that are composed entirely of index properties, return `false` for
	      // `hasOwnProperty` checks of them.
	      return object != null &&
	        (hasOwnProperty.call(object, key) ||
	          (typeof object == 'object' && key in object && getPrototype(object) === null));
	    }

	    /* Built-in method references for those with the same name as other `lodash` methods. */
	    var nativeKeys = Object.keys;

	    /**
	     * The base implementation of `_.keys` which doesn't skip the constructor
	     * property of prototypes or treat sparse arrays as dense.
	     *
	     * @private
	     * @param {Object} object The object to query.
	     * @returns {Array} Returns the array of property names.
	     */
	    function baseKeys(object) {
	      return nativeKeys(Object(object));
	    }

	    /**
	     * The base implementation of `_.times` without support for iteratee shorthands
	     * or max array length checks.
	     *
	     * @private
	     * @param {number} n The number of times to invoke `iteratee`.
	     * @param {Function} iteratee The function invoked per iteration.
	     * @returns {Array} Returns the array of results.
	     */
	    function baseTimes(n, iteratee) {
	      var index = -1,
	          result = Array(n);

	      while (++index < n) {
	        result[index] = iteratee(index);
	      }
	      return result;
	    }

	    /**
	     * This method is like `_.isArrayLike` except that it also checks if `value`
	     * is an object.
	     *
	     * @static
	     * @memberOf _
	     * @since 4.0.0
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is an array-like object,
	     *  else `false`.
	     * @example
	     *
	     * _.isArrayLikeObject([1, 2, 3]);
	     * // => true
	     *
	     * _.isArrayLikeObject(document.body.children);
	     * // => true
	     *
	     * _.isArrayLikeObject('abc');
	     * // => false
	     *
	     * _.isArrayLikeObject(_.noop);
	     * // => false
	     */
	    function isArrayLikeObject(value) {
	      return isObjectLike(value) && isArrayLike(value);
	    }

	    /** `Object#toString` result references. */
	    var argsTag = '[object Arguments]';

	    /** Used for built-in method references. */
	    var objectProto$3 = Object.prototype;

	    /** Used to check objects for own properties. */
	    var hasOwnProperty$1 = objectProto$3.hasOwnProperty;

	    /**
	     * Used to resolve the
	     * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	     * of values.
	     */
	    var objectToString$2 = objectProto$3.toString;

	    /** Built-in value references. */
	    var propertyIsEnumerable = objectProto$3.propertyIsEnumerable;

	    /**
	     * Checks if `value` is likely an `arguments` object.
	     *
	     * @static
	     * @memberOf _
	     * @since 0.1.0
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is correctly classified,
	     *  else `false`.
	     * @example
	     *
	     * _.isArguments(function() { return arguments; }());
	     * // => true
	     *
	     * _.isArguments([1, 2, 3]);
	     * // => false
	     */
	    function isArguments(value) {
	      // Safari 8.1 incorrectly makes `arguments.callee` enumerable in strict mode.
	      return isArrayLikeObject(value) && hasOwnProperty$1.call(value, 'callee') &&
	        (!propertyIsEnumerable.call(value, 'callee') || objectToString$2.call(value) == argsTag);
	    }

	    /**
	     * Checks if `value` is classified as an `Array` object.
	     *
	     * @static
	     * @memberOf _
	     * @since 0.1.0
	     * @type {Function}
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is correctly classified,
	     *  else `false`.
	     * @example
	     *
	     * _.isArray([1, 2, 3]);
	     * // => true
	     *
	     * _.isArray(document.body.children);
	     * // => false
	     *
	     * _.isArray('abc');
	     * // => false
	     *
	     * _.isArray(_.noop);
	     * // => false
	     */
	    var isArray = Array.isArray;

	    /** `Object#toString` result references. */
	    var stringTag = '[object String]';

	    /** Used for built-in method references. */
	    var objectProto$4 = Object.prototype;

	    /**
	     * Used to resolve the
	     * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	     * of values.
	     */
	    var objectToString$3 = objectProto$4.toString;

	    /**
	     * Checks if `value` is classified as a `String` primitive or object.
	     *
	     * @static
	     * @since 0.1.0
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is correctly classified,
	     *  else `false`.
	     * @example
	     *
	     * _.isString('abc');
	     * // => true
	     *
	     * _.isString(1);
	     * // => false
	     */
	    function isString(value) {
	      return typeof value == 'string' ||
	        (!isArray(value) && isObjectLike(value) && objectToString$3.call(value) == stringTag);
	    }

	    /**
	     * Creates an array of index keys for `object` values of arrays,
	     * `arguments` objects, and strings, otherwise `null` is returned.
	     *
	     * @private
	     * @param {Object} object The object to query.
	     * @returns {Array|null} Returns index keys, else `null`.
	     */
	    function indexKeys(object) {
	      var length = object ? object.length : undefined;
	      if (isLength(length) &&
	          (isArray(object) || isString(object) || isArguments(object))) {
	        return baseTimes(length, String);
	      }
	      return null;
	    }

	    /** Used as references for various `Number` constants. */
	    var MAX_SAFE_INTEGER$1 = 9007199254740991;

	    /** Used to detect unsigned integer values. */
	    var reIsUint = /^(?:0|[1-9]\d*)$/;

	    /**
	     * Checks if `value` is a valid array-like index.
	     *
	     * @private
	     * @param {*} value The value to check.
	     * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
	     * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
	     */
	    function isIndex(value, length) {
	      length = length == null ? MAX_SAFE_INTEGER$1 : length;
	      return !!length &&
	        (typeof value == 'number' || reIsUint.test(value)) &&
	        (value > -1 && value % 1 == 0 && value < length);
	    }

	    /** Used for built-in method references. */
	    var objectProto$5 = Object.prototype;

	    /**
	     * Checks if `value` is likely a prototype object.
	     *
	     * @private
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
	     */
	    function isPrototype(value) {
	      var Ctor = value && value.constructor,
	          proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto$5;

	      return value === proto;
	    }

	    /**
	     * Creates an array of the own enumerable property names of `object`.
	     *
	     * **Note:** Non-object values are coerced to objects. See the
	     * [ES spec](http://ecma-international.org/ecma-262/6.0/#sec-object.keys)
	     * for more details.
	     *
	     * @static
	     * @since 0.1.0
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The object to query.
	     * @returns {Array} Returns the array of property names.
	     * @example
	     *
	     * function Foo() {
	     *   this.a = 1;
	     *   this.b = 2;
	     * }
	     *
	     * Foo.prototype.c = 3;
	     *
	     * _.keys(new Foo);
	     * // => ['a', 'b'] (iteration order is not guaranteed)
	     *
	     * _.keys('hi');
	     * // => ['0', '1']
	     */
	    function keys(object) {
	      var isProto = isPrototype(object);
	      if (!(isProto || isArrayLike(object))) {
	        return baseKeys(object);
	      }
	      var indexes = indexKeys(object),
	          skipIndexes = !!indexes,
	          result = indexes || [],
	          length = result.length;

	      for (var key in object) {
	        if (baseHas(object, key) &&
	            !(skipIndexes && (key == 'length' || isIndex(key, length))) &&
	            !(isProto && key == 'constructor')) {
	          result.push(key);
	        }
	      }
	      return result;
	    }

	    function createArrayIterator(coll) {
	        var i = -1;
	        var len = coll.length;
	        return function next() {
	            return ++i < len ? { value: coll[i], key: i } : null;
	        };
	    }

	    function createES2015Iterator(iterator) {
	        var i = -1;
	        return function next() {
	            var item = iterator.next();
	            if (item.done) return null;
	            i++;
	            return { value: item.value, key: i };
	        };
	    }

	    function createObjectIterator(obj) {
	        var okeys = keys(obj);
	        var i = -1;
	        var len = okeys.length;
	        return function next() {
	            var key = okeys[++i];
	            return i < len ? { value: obj[key], key: key } : null;
	        };
	    }

	    function iterator(coll) {
	        if (isArrayLike(coll)) {
	            return createArrayIterator(coll);
	        }

	        var iterator = getIterator(coll);
	        return iterator ? createES2015Iterator(iterator) : createObjectIterator(coll);
	    }

	    function onlyOnce(fn) {
	        return function () {
	            if (fn === null) throw new Error("Callback was already called.");
	            var callFn = fn;
	            fn = null;
	            callFn.apply(this, arguments);
	        };
	    }

	    function _eachOfLimit(limit) {
	        return function (obj, iteratee, callback) {
	            callback = once(callback || noop);
	            if (limit <= 0 || !obj) {
	                return callback(null);
	            }
	            var nextElem = iterator(obj);
	            var done = false;
	            var running = 0;

	            function iterateeCallback(err) {
	                running -= 1;
	                if (err) {
	                    done = true;
	                    callback(err);
	                } else if (done && running <= 0) {
	                    return callback(null);
	                } else {
	                    replenish();
	                }
	            }

	            function replenish() {
	                while (running < limit && !done) {
	                    var elem = nextElem();
	                    if (elem === null) {
	                        done = true;
	                        if (running <= 0) {
	                            callback(null);
	                        }
	                        return;
	                    }
	                    running += 1;
	                    iteratee(elem.value, elem.key, onlyOnce(iterateeCallback));
	                }
	            }

	            replenish();
	        };
	    }

	    /**
	     * The same as [`eachOf`]{@link module:Collections.eachOf} but runs a maximum of `limit` async operations at a
	     * time.
	     *
	     * @name eachOfLimit
	     * @static
	     * @memberOf module:Collections
	     * @method
	     * @see [async.eachOf]{@link module:Collections.eachOf}
	     * @alias forEachOfLimit
	     * @category Collection
	     * @param {Array|Iterable|Object} coll - A collection to iterate over.
	     * @param {number} limit - The maximum number of async operations at a time.
	     * @param {Function} iteratee - A function to apply to each
	     * item in `coll`. The `key` is the item's key, or index in the case of an
	     * array. The iteratee is passed a `callback(err)` which must be called once it
	     * has completed. If no error has occurred, the callback should be run without
	     * arguments or with an explicit `null` argument. Invoked with
	     * (item, key, callback).
	     * @param {Function} [callback] - A callback which is called when all
	     * `iteratee` functions have finished, or an error occurs. Invoked with (err).
	     */
	    function eachOfLimit(coll, limit, iteratee, callback) {
	      _eachOfLimit(limit)(coll, iteratee, callback);
	    }

	    function doLimit(fn, limit) {
	        return function (iterable, iteratee, callback) {
	            return fn(iterable, limit, iteratee, callback);
	        };
	    }

	    /** Used as the `TypeError` message for "Functions" methods. */
	    var FUNC_ERROR_TEXT$1 = 'Expected a function';

	    /**
	     * Creates a function that invokes `func`, with the `this` binding and arguments
	     * of the created function, while it's called less than `n` times. Subsequent
	     * calls to the created function return the result of the last `func` invocation.
	     *
	     * @static
	     * @memberOf _
	     * @since 3.0.0
	     * @category Function
	     * @param {number} n The number of calls at which `func` is no longer invoked.
	     * @param {Function} func The function to restrict.
	     * @returns {Function} Returns the new restricted function.
	     * @example
	     *
	     * jQuery(element).on('click', _.before(5, addContactToList));
	     * // => allows adding up to 4 contacts to the list
	     */
	    function before(n, func) {
	      var result;
	      if (typeof func != 'function') {
	        throw new TypeError(FUNC_ERROR_TEXT$1);
	      }
	      n = toInteger(n);
	      return function() {
	        if (--n > 0) {
	          result = func.apply(this, arguments);
	        }
	        if (n <= 1) {
	          func = undefined;
	        }
	        return result;
	      };
	    }

	    /**
	     * Creates a function that is restricted to invoking `func` once. Repeat calls
	     * to the function return the value of the first invocation. The `func` is
	     * invoked with the `this` binding and arguments of the created function.
	     *
	     * @static
	     * @memberOf _
	     * @since 0.1.0
	     * @category Function
	     * @param {Function} func The function to restrict.
	     * @returns {Function} Returns the new restricted function.
	     * @example
	     *
	     * var initialize = _.once(createApplication);
	     * initialize();
	     * initialize();
	     * // `initialize` invokes `createApplication` once
	     */
	    function once$1(func) {
	      return before(2, func);
	    }

	    // eachOf implementation optimized for array-likes
	    function eachOfArrayLike(coll, iteratee, callback) {
	        callback = once$1(callback || noop);
	        var index = 0,
	            completed = 0,
	            length = coll.length;
	        if (length === 0) {
	            callback(null);
	        }

	        function iteratorCallback(err) {
	            if (err) {
	                callback(err);
	            } else if (++completed === length) {
	                callback(null);
	            }
	        }

	        for (; index < length; index++) {
	            iteratee(coll[index], index, onlyOnce(iteratorCallback));
	        }
	    }

	    // a generic version of eachOf which can handle array, object, and iterator cases.
	    var eachOfGeneric = doLimit(eachOfLimit, Infinity);

	    /**
	     * Like [`each`]{@link module:Collections.each}, except that it passes the key (or index) as the second argument
	     * to the iteratee.
	     *
	     * @name eachOf
	     * @static
	     * @memberOf module:Collections
	     * @method
	     * @alias forEachOf
	     * @category Collection
	     * @see [async.each]{@link module:Collections.each}
	     * @param {Array|Iterable|Object} coll - A collection to iterate over.
	     * @param {Function} iteratee - A function to apply to each
	     * item in `coll`. The `key` is the item's key, or index in the case of an
	     * array. The iteratee is passed a `callback(err)` which must be called once it
	     * has completed. If no error has occurred, the callback should be run without
	     * arguments or with an explicit `null` argument. Invoked with
	     * (item, key, callback).
	     * @param {Function} [callback] - A callback which is called when all
	     * `iteratee` functions have finished, or an error occurs. Invoked with (err).
	     * @example
	     *
	     * var obj = {dev: "/dev.json", test: "/test.json", prod: "/prod.json"};
	     * var configs = {};
	     *
	     * async.forEachOf(obj, function (value, key, callback) {
	     *     fs.readFile(__dirname + value, "utf8", function (err, data) {
	     *         if (err) return callback(err);
	     *         try {
	     *             configs[key] = JSON.parse(data);
	     *         } catch (e) {
	     *             return callback(e);
	     *         }
	     *         callback();
	     *     });
	     * }, function (err) {
	     *     if (err) console.error(err.message);
	     *     // configs is now a map of JSON data
	     *     doSomethingWith(configs);
	     * });
	     */
	    function eachOf (coll, iteratee, callback) {
	        var eachOfImplementation = isArrayLike(coll) ? eachOfArrayLike : eachOfGeneric;
	        eachOfImplementation(coll, iteratee, callback);
	    }

	    function doParallel(fn) {
	        return function (obj, iteratee, callback) {
	            return fn(eachOf, obj, iteratee, callback);
	        };
	    }

	    function _asyncMap(eachfn, arr, iteratee, callback) {
	        callback = once(callback || noop);
	        arr = arr || [];
	        var results = [];
	        var counter = 0;

	        eachfn(arr, function (value, _, callback) {
	            var index = counter++;
	            iteratee(value, function (err, v) {
	                results[index] = v;
	                callback(err);
	            });
	        }, function (err) {
	            callback(err, results);
	        });
	    }

	    /**
	     * Produces a new collection of values by mapping each value in `coll` through
	     * the `iteratee` function. The `iteratee` is called with an item from `coll`
	     * and a callback for when it has finished processing. Each of these callback
	     * takes 2 arguments: an `error`, and the transformed item from `coll`. If
	     * `iteratee` passes an error to its callback, the main `callback` (for the
	     * `map` function) is immediately called with the error.
	     *
	     * Note, that since this function applies the `iteratee` to each item in
	     * parallel, there is no guarantee that the `iteratee` functions will complete
	     * in order. However, the results array will be in the same order as the
	     * original `coll`.
	     *
	     * If `map` is passed an Object, the results will be an Array.  The results
	     * will roughly be in the order of the original Objects' keys (but this can
	     * vary across JavaScript engines)
	     *
	     * @name map
	     * @static
	     * @memberOf module:Collections
	     * @method
	     * @category Collection
	     * @param {Array|Iterable|Object} coll - A collection to iterate over.
	     * @param {Function} iteratee - A function to apply to each item in `coll`.
	     * The iteratee is passed a `callback(err, transformed)` which must be called
	     * once it has completed with an error (which can be `null`) and a
	     * transformed item. Invoked with (item, callback).
	     * @param {Function} [callback] - A callback which is called when all `iteratee`
	     * functions have finished, or an error occurs. Results is an Array of the
	     * transformed items from the `coll`. Invoked with (err, results).
	     * @example
	     *
	     * async.map(['file1','file2','file3'], fs.stat, function(err, results) {
	     *     // results is now an array of stats for each file
	     * });
	     */
	    var map = doParallel(_asyncMap);

	    /**
	     * Applies the provided arguments to each function in the array, calling
	     * `callback` after all functions have completed. If you only provide the first
	     * argument, then it will return a function which lets you pass in the
	     * arguments as if it were a single function call.
	     *
	     * @name applyEach
	     * @static
	     * @memberOf module:ControlFlow
	     * @method
	     * @category Control Flow
	     * @param {Array|Iterable|Object} fns - A collection of asynchronous functions to all
	     * call with the same arguments
	     * @param {...*} [args] - any number of separate arguments to pass to the
	     * function.
	     * @param {Function} [callback] - the final argument should be the callback,
	     * called when all functions have completed processing.
	     * @returns {Function} - If only the first argument is provided, it will return
	     * a function which lets you pass in the arguments as if it were a single
	     * function call.
	     * @example
	     *
	     * async.applyEach([enableSearch, updateSchema], 'bucket', callback);
	     *
	     * // partial application example:
	     * async.each(
	     *     buckets,
	     *     async.applyEach([enableSearch, updateSchema]),
	     *     callback
	     * );
	     */
	    var applyEach = applyEach$1(map);

	    function doParallelLimit(fn) {
	        return function (obj, limit, iteratee, callback) {
	            return fn(_eachOfLimit(limit), obj, iteratee, callback);
	        };
	    }

	    /**
	     * The same as [`map`]{@link module:Collections.map} but runs a maximum of `limit` async operations at a time.
	     *
	     * @name mapLimit
	     * @static
	     * @memberOf module:Collections
	     * @method
	     * @see [async.map]{@link module:Collections.map}
	     * @category Collection
	     * @param {Array|Iterable|Object} coll - A collection to iterate over.
	     * @param {number} limit - The maximum number of async operations at a time.
	     * @param {Function} iteratee - A function to apply to each item in `coll`.
	     * The iteratee is passed a `callback(err, transformed)` which must be called
	     * once it has completed with an error (which can be `null`) and a transformed
	     * item. Invoked with (item, callback).
	     * @param {Function} [callback] - A callback which is called when all `iteratee`
	     * functions have finished, or an error occurs. Results is an array of the
	     * transformed items from the `coll`. Invoked with (err, results).
	     */
	    var mapLimit = doParallelLimit(_asyncMap);

	    /**
	     * The same as [`map`]{@link module:Collections.map} but runs only a single async operation at a time.
	     *
	     * @name mapSeries
	     * @static
	     * @memberOf module:Collections
	     * @method
	     * @see [async.map]{@link module:Collections.map}
	     * @category Collection
	     * @param {Array|Iterable|Object} coll - A collection to iterate over.
	     * @param {Function} iteratee - A function to apply to each item in `coll`.
	     * The iteratee is passed a `callback(err, transformed)` which must be called
	     * once it has completed with an error (which can be `null`) and a
	     * transformed item. Invoked with (item, callback).
	     * @param {Function} [callback] - A callback which is called when all `iteratee`
	     * functions have finished, or an error occurs. Results is an array of the
	     * transformed items from the `coll`. Invoked with (err, results).
	     */
	    var mapSeries = doLimit(mapLimit, 1);

	    /**
	     * The same as [`applyEach`]{@link module:ControlFlow.applyEach} but runs only a single async operation at a time.
	     *
	     * @name applyEachSeries
	     * @static
	     * @memberOf module:ControlFlow
	     * @method
	     * @see [async.applyEach]{@link module:ControlFlow.applyEach}
	     * @category Control Flow
	     * @param {Array|Iterable|Object} fns - A collection of asynchronous functions to all
	     * call with the same arguments
	     * @param {...*} [args] - any number of separate arguments to pass to the
	     * function.
	     * @param {Function} [callback] - the final argument should be the callback,
	     * called when all functions have completed processing.
	     * @returns {Function} - If only the first argument is provided, it will return
	     * a function which lets you pass in the arguments as if it were a single
	     * function call.
	     */
	    var applyEachSeries = applyEach$1(mapSeries);

	    /**
	     * Creates a continuation function with some arguments already applied.
	     *
	     * Useful as a shorthand when combined with other control flow functions. Any
	     * arguments passed to the returned function are added to the arguments
	     * originally passed to apply.
	     *
	     * @name apply
	     * @static
	     * @memberOf module:Utils
	     * @method
	     * @category Util
	     * @param {Function} function - The function you want to eventually apply all
	     * arguments to. Invokes with (arguments...).
	     * @param {...*} arguments... - Any number of arguments to automatically apply
	     * when the continuation is called.
	     * @example
	     *
	     * // using apply
	     * async.parallel([
	     *     async.apply(fs.writeFile, 'testfile1', 'test1'),
	     *     async.apply(fs.writeFile, 'testfile2', 'test2')
	     * ]);
	     *
	     *
	     * // the same process without using apply
	     * async.parallel([
	     *     function(callback) {
	     *         fs.writeFile('testfile1', 'test1', callback);
	     *     },
	     *     function(callback) {
	     *         fs.writeFile('testfile2', 'test2', callback);
	     *     }
	     * ]);
	     *
	     * // It's possible to pass any number of additional arguments when calling the
	     * // continuation:
	     *
	     * node> var fn = async.apply(sys.puts, 'one');
	     * node> fn('two', 'three');
	     * one
	     * two
	     * three
	     */
	    var apply$1 = rest(function (fn, args) {
	        return rest(function (callArgs) {
	            return fn.apply(null, args.concat(callArgs));
	        });
	    });

	    /**
	     * Take a sync function and make it async, passing its return value to a
	     * callback. This is useful for plugging sync functions into a waterfall,
	     * series, or other async functions. Any arguments passed to the generated
	     * function will be passed to the wrapped function (except for the final
	     * callback argument). Errors thrown will be passed to the callback.
	     *
	     * If the function passed to `asyncify` returns a Promise, that promises's
	     * resolved/rejected state will be used to call the callback, rather than simply
	     * the synchronous return value.
	     *
	     * This also means you can asyncify ES2016 `async` functions.
	     *
	     * @name asyncify
	     * @static
	     * @memberOf module:Utils
	     * @method
	     * @alias wrapSync
	     * @category Util
	     * @param {Function} func - The synchronous function to convert to an
	     * asynchronous function.
	     * @returns {Function} An asynchronous wrapper of the `func`. To be invoked with
	     * (callback).
	     * @example
	     *
	     * // passing a regular synchronous function
	     * async.waterfall([
	     *     async.apply(fs.readFile, filename, "utf8"),
	     *     async.asyncify(JSON.parse),
	     *     function (data, next) {
	     *         // data is the result of parsing the text.
	     *         // If there was a parsing error, it would have been caught.
	     *     }
	     * ], callback);
	     *
	     * // passing a function returning a promise
	     * async.waterfall([
	     *     async.apply(fs.readFile, filename, "utf8"),
	     *     async.asyncify(function (contents) {
	     *         return db.model.create(contents);
	     *     }),
	     *     function (model, next) {
	     *         // `model` is the instantiated model object.
	     *         // If there was an error, this function would be skipped.
	     *     }
	     * ], callback);
	     *
	     * // es6 example
	     * var q = async.queue(async.asyncify(async function(file) {
	     *     var intermediateStep = await processFile(file);
	     *     return await somePromise(intermediateStep)
	     * }));
	     *
	     * q.push(files);
	     */
	    function asyncify(func) {
	        return initialParams(function (args, callback) {
	            var result;
	            try {
	                result = func.apply(this, args);
	            } catch (e) {
	                return callback(e);
	            }
	            // if result is Promise object
	            if (isObject(result) && typeof result.then === 'function') {
	                result.then(function (value) {
	                    callback(null, value);
	                }, function (err) {
	                    callback(err.message ? err : new Error(err));
	                });
	            } else {
	                callback(null, result);
	            }
	        });
	    }

	    /**
	     * A specialized version of `_.forEach` for arrays without support for
	     * iteratee shorthands.
	     *
	     * @private
	     * @param {Array} [array] The array to iterate over.
	     * @param {Function} iteratee The function invoked per iteration.
	     * @returns {Array} Returns `array`.
	     */
	    function arrayEach(array, iteratee) {
	      var index = -1,
	          length = array ? array.length : 0;

	      while (++index < length) {
	        if (iteratee(array[index], index, array) === false) {
	          break;
	        }
	      }
	      return array;
	    }

	    /**
	     * Creates a base function for methods like `_.forIn` and `_.forOwn`.
	     *
	     * @private
	     * @param {boolean} [fromRight] Specify iterating from right to left.
	     * @returns {Function} Returns the new base function.
	     */
	    function createBaseFor(fromRight) {
	      return function(object, iteratee, keysFunc) {
	        var index = -1,
	            iterable = Object(object),
	            props = keysFunc(object),
	            length = props.length;

	        while (length--) {
	          var key = props[fromRight ? length : ++index];
	          if (iteratee(iterable[key], key, iterable) === false) {
	            break;
	          }
	        }
	        return object;
	      };
	    }

	    /**
	     * The base implementation of `baseForOwn` which iterates over `object`
	     * properties returned by `keysFunc` and invokes `iteratee` for each property.
	     * Iteratee functions may exit iteration early by explicitly returning `false`.
	     *
	     * @private
	     * @param {Object} object The object to iterate over.
	     * @param {Function} iteratee The function invoked per iteration.
	     * @param {Function} keysFunc The function to get the keys of `object`.
	     * @returns {Object} Returns `object`.
	     */
	    var baseFor = createBaseFor();

	    /**
	     * The base implementation of `_.forOwn` without support for iteratee shorthands.
	     *
	     * @private
	     * @param {Object} object The object to iterate over.
	     * @param {Function} iteratee The function invoked per iteration.
	     * @returns {Object} Returns `object`.
	     */
	    function baseForOwn(object, iteratee) {
	      return object && baseFor(object, iteratee, keys);
	    }

	    /**
	     * Gets the index at which the first occurrence of `NaN` is found in `array`.
	     *
	     * @private
	     * @param {Array} array The array to search.
	     * @param {number} fromIndex The index to search from.
	     * @param {boolean} [fromRight] Specify iterating from right to left.
	     * @returns {number} Returns the index of the matched `NaN`, else `-1`.
	     */
	    function indexOfNaN(array, fromIndex, fromRight) {
	      var length = array.length,
	          index = fromIndex + (fromRight ? 1 : -1);

	      while ((fromRight ? index-- : ++index < length)) {
	        var other = array[index];
	        if (other !== other) {
	          return index;
	        }
	      }
	      return -1;
	    }

	    /**
	     * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
	     *
	     * @private
	     * @param {Array} array The array to search.
	     * @param {*} value The value to search for.
	     * @param {number} fromIndex The index to search from.
	     * @returns {number} Returns the index of the matched value, else `-1`.
	     */
	    function baseIndexOf(array, value, fromIndex) {
	      if (value !== value) {
	        return indexOfNaN(array, fromIndex);
	      }
	      var index = fromIndex - 1,
	          length = array.length;

	      while (++index < length) {
	        if (array[index] === value) {
	          return index;
	        }
	      }
	      return -1;
	    }

	    /**
	     * Determines the best order for running the functions in `tasks`, based on
	     * their requirements. Each function can optionally depend on other functions
	     * being completed first, and each function is run as soon as its requirements
	     * are satisfied.
	     *
	     * If any of the functions pass an error to their callback, the `auto` sequence
	     * will stop. Further tasks will not execute (so any other functions depending
	     * on it will not run), and the main `callback` is immediately called with the
	     * error.
	     *
	     * Functions also receive an object containing the results of functions which
	     * have completed so far as the first argument, if they have dependencies. If a
	     * task function has no dependencies, it will only be passed a callback.
	     *
	     * @name auto
	     * @static
	     * @memberOf module:ControlFlow
	     * @method
	     * @category Control Flow
	     * @param {Object} tasks - An object. Each of its properties is either a
	     * function or an array of requirements, with the function itself the last item
	     * in the array. The object's key of a property serves as the name of the task
	     * defined by that property, i.e. can be used when specifying requirements for
	     * other tasks. The function receives one or two arguments:
	     * * a `results` object, containing the results of the previously executed
	     *   functions, only passed if the task has any dependencies,
	     * * a `callback(err, result)` function, which must be called when finished,
	     *   passing an `error` (which can be `null`) and the result of the function's
	     *   execution.
	     * @param {number} [concurrency=Infinity] - An optional `integer` for
	     * determining the maximum number of tasks that can be run in parallel. By
	     * default, as many as possible.
	     * @param {Function} [callback] - An optional callback which is called when all
	     * the tasks have been completed. It receives the `err` argument if any `tasks`
	     * pass an error to their callback. Results are always returned; however, if an
	     * error occurs, no further `tasks` will be performed, and the results object
	     * will only contain partial results. Invoked with (err, results).
	     * @returns undefined
	     * @example
	     *
	     * async.auto({
	     *     // this function will just be passed a callback
	     *     readData: async.apply(fs.readFile, 'data.txt', 'utf-8'),
	     *     showData: ['readData', function(results, cb) {
	     *         // results.readData is the file's contents
	     *         // ...
	     *     }]
	     * }, callback);
	     *
	     * async.auto({
	     *     get_data: function(callback) {
	     *         console.log('in get_data');
	     *         // async code to get some data
	     *         callback(null, 'data', 'converted to array');
	     *     },
	     *     make_folder: function(callback) {
	     *         console.log('in make_folder');
	     *         // async code to create a directory to store a file in
	     *         // this is run at the same time as getting the data
	     *         callback(null, 'folder');
	     *     },
	     *     write_file: ['get_data', 'make_folder', function(results, callback) {
	     *         console.log('in write_file', JSON.stringify(results));
	     *         // once there is some data and the directory exists,
	     *         // write the data to a file in the directory
	     *         callback(null, 'filename');
	     *     }],
	     *     email_link: ['write_file', function(results, callback) {
	     *         console.log('in email_link', JSON.stringify(results));
	     *         // once the file is written let's email a link to it...
	     *         // results.write_file contains the filename returned by write_file.
	     *         callback(null, {'file':results.write_file, 'email':'user@example.com'});
	     *     }]
	     * }, function(err, results) {
	     *     console.log('err = ', err);
	     *     console.log('results = ', results);
	     * });
	     */
	    function auto (tasks, concurrency, callback) {
	        if (typeof concurrency === 'function') {
	            // concurrency is optional, shift the args.
	            callback = concurrency;
	            concurrency = null;
	        }
	        callback = once(callback || noop);
	        var keys$$ = keys(tasks);
	        var numTasks = keys$$.length;
	        if (!numTasks) {
	            return callback(null);
	        }
	        if (!concurrency) {
	            concurrency = numTasks;
	        }

	        var results = {};
	        var runningTasks = 0;
	        var hasError = false;

	        var listeners = {};

	        var readyTasks = [];

	        // for cycle detection:
	        var readyToCheck = []; // tasks that have been identified as reachable
	        // without the possibility of returning to an ancestor task
	        var uncheckedDependencies = {};

	        baseForOwn(tasks, function (task, key) {
	            if (!isArray(task)) {
	                // no dependencies
	                enqueueTask(key, [task]);
	                readyToCheck.push(key);
	                return;
	            }

	            var dependencies = task.slice(0, task.length - 1);
	            var remainingDependencies = dependencies.length;
	            if (remainingDependencies === 0) {
	                enqueueTask(key, task);
	                readyToCheck.push(key);
	                return;
	            }
	            uncheckedDependencies[key] = remainingDependencies;

	            arrayEach(dependencies, function (dependencyName) {
	                if (!tasks[dependencyName]) {
	                    throw new Error('async.auto task `' + key + '` has a non-existent dependency in ' + dependencies.join(', '));
	                }
	                addListener(dependencyName, function () {
	                    remainingDependencies--;
	                    if (remainingDependencies === 0) {
	                        enqueueTask(key, task);
	                    }
	                });
	            });
	        });

	        checkForDeadlocks();
	        processQueue();

	        function enqueueTask(key, task) {
	            readyTasks.push(function () {
	                runTask(key, task);
	            });
	        }

	        function processQueue() {
	            if (readyTasks.length === 0 && runningTasks === 0) {
	                return callback(null, results);
	            }
	            while (readyTasks.length && runningTasks < concurrency) {
	                var run = readyTasks.shift();
	                run();
	            }
	        }

	        function addListener(taskName, fn) {
	            var taskListeners = listeners[taskName];
	            if (!taskListeners) {
	                taskListeners = listeners[taskName] = [];
	            }

	            taskListeners.push(fn);
	        }

	        function taskComplete(taskName) {
	            var taskListeners = listeners[taskName] || [];
	            arrayEach(taskListeners, function (fn) {
	                fn();
	            });
	            processQueue();
	        }

	        function runTask(key, task) {
	            if (hasError) return;

	            var taskCallback = onlyOnce(rest(function (err, args) {
	                runningTasks--;
	                if (args.length <= 1) {
	                    args = args[0];
	                }
	                if (err) {
	                    var safeResults = {};
	                    baseForOwn(results, function (val, rkey) {
	                        safeResults[rkey] = val;
	                    });
	                    safeResults[key] = args;
	                    hasError = true;
	                    listeners = [];

	                    callback(err, safeResults);
	                } else {
	                    results[key] = args;
	                    taskComplete(key);
	                }
	            }));

	            runningTasks++;
	            var taskFn = task[task.length - 1];
	            if (task.length > 1) {
	                taskFn(results, taskCallback);
	            } else {
	                taskFn(taskCallback);
	            }
	        }

	        function checkForDeadlocks() {
	            // Kahn's algorithm
	            // https://en.wikipedia.org/wiki/Topological_sorting#Kahn.27s_algorithm
	            // http://connalle.blogspot.com/2013/10/topological-sortingkahn-algorithm.html
	            var currentTask;
	            var counter = 0;
	            while (readyToCheck.length) {
	                currentTask = readyToCheck.pop();
	                counter++;
	                arrayEach(getDependents(currentTask), function (dependent) {
	                    if (--uncheckedDependencies[dependent] === 0) {
	                        readyToCheck.push(dependent);
	                    }
	                });
	            }

	            if (counter !== numTasks) {
	                throw new Error('async.auto cannot execute tasks due to a recursive dependency');
	            }
	        }

	        function getDependents(taskName) {
	            var result = [];
	            baseForOwn(tasks, function (task, key) {
	                if (isArray(task) && baseIndexOf(task, taskName, 0) >= 0) {
	                    result.push(key);
	                }
	            });
	            return result;
	        }
	    }

	    /**
	     * A specialized version of `_.map` for arrays without support for iteratee
	     * shorthands.
	     *
	     * @private
	     * @param {Array} [array] The array to iterate over.
	     * @param {Function} iteratee The function invoked per iteration.
	     * @returns {Array} Returns the new mapped array.
	     */
	    function arrayMap(array, iteratee) {
	      var index = -1,
	          length = array ? array.length : 0,
	          result = Array(length);

	      while (++index < length) {
	        result[index] = iteratee(array[index], index, array);
	      }
	      return result;
	    }

	    /**
	     * Copies the values of `source` to `array`.
	     *
	     * @private
	     * @param {Array} source The array to copy values from.
	     * @param {Array} [array=[]] The array to copy values to.
	     * @returns {Array} Returns `array`.
	     */
	    function copyArray(source, array) {
	      var index = -1,
	          length = source.length;

	      array || (array = Array(length));
	      while (++index < length) {
	        array[index] = source[index];
	      }
	      return array;
	    }

	    /**
	     * Checks if `value` is a global object.
	     *
	     * @private
	     * @param {*} value The value to check.
	     * @returns {null|Object} Returns `value` if it's a global object, else `null`.
	     */
	    function checkGlobal(value) {
	      return (value && value.Object === Object) ? value : null;
	    }

	    /** Detect free variable `global` from Node.js. */
	    var freeGlobal = checkGlobal(typeof global == 'object' && global);

	    /** Detect free variable `self`. */
	    var freeSelf = checkGlobal(typeof self == 'object' && self);

	    /** Detect `this` as the global object. */
	    var thisGlobal = checkGlobal(typeof this == 'object' && this);

	    /** Used as a reference to the global object. */
	    var root = freeGlobal || freeSelf || thisGlobal || Function('return this')();

	    /** Built-in value references. */
	    var Symbol$1 = root.Symbol;

	    /** Used as references for various `Number` constants. */
	    var INFINITY$1 = 1 / 0;

	    /** Used to convert symbols to primitives and strings. */
	    var symbolProto = Symbol$1 ? Symbol$1.prototype : undefined;
	    var symbolToString = symbolProto ? symbolProto.toString : undefined;
	    /**
	     * The base implementation of `_.toString` which doesn't convert nullish
	     * values to empty strings.
	     *
	     * @private
	     * @param {*} value The value to process.
	     * @returns {string} Returns the string.
	     */
	    function baseToString(value) {
	      // Exit early for strings to avoid a performance hit in some environments.
	      if (typeof value == 'string') {
	        return value;
	      }
	      if (isSymbol(value)) {
	        return symbolToString ? symbolToString.call(value) : '';
	      }
	      var result = (value + '');
	      return (result == '0' && (1 / value) == -INFINITY$1) ? '-0' : result;
	    }

	    /**
	     * The base implementation of `_.slice` without an iteratee call guard.
	     *
	     * @private
	     * @param {Array} array The array to slice.
	     * @param {number} [start=0] The start position.
	     * @param {number} [end=array.length] The end position.
	     * @returns {Array} Returns the slice of `array`.
	     */
	    function baseSlice(array, start, end) {
	      var index = -1,
	          length = array.length;

	      if (start < 0) {
	        start = -start > length ? 0 : (length + start);
	      }
	      end = end > length ? length : end;
	      if (end < 0) {
	        end += length;
	      }
	      length = start > end ? 0 : ((end - start) >>> 0);
	      start >>>= 0;

	      var result = Array(length);
	      while (++index < length) {
	        result[index] = array[index + start];
	      }
	      return result;
	    }

	    /**
	     * Casts `array` to a slice if it's needed.
	     *
	     * @private
	     * @param {Array} array The array to inspect.
	     * @param {number} start The start position.
	     * @param {number} [end=array.length] The end position.
	     * @returns {Array} Returns the cast slice.
	     */
	    function castSlice(array, start, end) {
	      var length = array.length;
	      end = end === undefined ? length : end;
	      return (!start && end >= length) ? array : baseSlice(array, start, end);
	    }

	    /**
	     * Used by `_.trim` and `_.trimEnd` to get the index of the last string symbol
	     * that is not found in the character symbols.
	     *
	     * @private
	     * @param {Array} strSymbols The string symbols to inspect.
	     * @param {Array} chrSymbols The character symbols to find.
	     * @returns {number} Returns the index of the last unmatched string symbol.
	     */
	    function charsEndIndex(strSymbols, chrSymbols) {
	      var index = strSymbols.length;

	      while (index-- && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {}
	      return index;
	    }

	    /**
	     * Used by `_.trim` and `_.trimStart` to get the index of the first string symbol
	     * that is not found in the character symbols.
	     *
	     * @private
	     * @param {Array} strSymbols The string symbols to inspect.
	     * @param {Array} chrSymbols The character symbols to find.
	     * @returns {number} Returns the index of the first unmatched string symbol.
	     */
	    function charsStartIndex(strSymbols, chrSymbols) {
	      var index = -1,
	          length = strSymbols.length;

	      while (++index < length && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {}
	      return index;
	    }

	    /** Used to compose unicode character classes. */
	    var rsAstralRange = '\\ud800-\\udfff';
	    var rsComboMarksRange = '\\u0300-\\u036f\\ufe20-\\ufe23';
	    var rsComboSymbolsRange = '\\u20d0-\\u20f0';
	    var rsVarRange = '\\ufe0e\\ufe0f';
	    var rsAstral = '[' + rsAstralRange + ']';
	    var rsCombo = '[' + rsComboMarksRange + rsComboSymbolsRange + ']';
	    var rsFitz = '\\ud83c[\\udffb-\\udfff]';
	    var rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')';
	    var rsNonAstral = '[^' + rsAstralRange + ']';
	    var rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}';
	    var rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]';
	    var rsZWJ = '\\u200d';
	    var reOptMod = rsModifier + '?';
	    var rsOptVar = '[' + rsVarRange + ']?';
	    var rsOptJoin = '(?:' + rsZWJ + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*';
	    var rsSeq = rsOptVar + reOptMod + rsOptJoin;
	    var rsSymbol = '(?:' + [rsNonAstral + rsCombo + '?', rsCombo, rsRegional, rsSurrPair, rsAstral].join('|') + ')';
	    /** Used to match [string symbols](https://mathiasbynens.be/notes/javascript-unicode). */
	    var reComplexSymbol = RegExp(rsFitz + '(?=' + rsFitz + ')|' + rsSymbol + rsSeq, 'g');

	    /**
	     * Converts `string` to an array.
	     *
	     * @private
	     * @param {string} string The string to convert.
	     * @returns {Array} Returns the converted array.
	     */
	    function stringToArray(string) {
	      return string.match(reComplexSymbol);
	    }

	    /**
	     * Converts `value` to a string. An empty string is returned for `null`
	     * and `undefined` values. The sign of `-0` is preserved.
	     *
	     * @static
	     * @memberOf _
	     * @since 4.0.0
	     * @category Lang
	     * @param {*} value The value to process.
	     * @returns {string} Returns the string.
	     * @example
	     *
	     * _.toString(null);
	     * // => ''
	     *
	     * _.toString(-0);
	     * // => '-0'
	     *
	     * _.toString([1, 2, 3]);
	     * // => '1,2,3'
	     */
	    function toString(value) {
	      return value == null ? '' : baseToString(value);
	    }

	    /** Used to match leading and trailing whitespace. */
	    var reTrim$1 = /^\s+|\s+$/g;

	    /**
	     * Removes leading and trailing whitespace or specified characters from `string`.
	     *
	     * @static
	     * @memberOf _
	     * @since 3.0.0
	     * @category String
	     * @param {string} [string=''] The string to trim.
	     * @param {string} [chars=whitespace] The characters to trim.
	     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
	     * @returns {string} Returns the trimmed string.
	     * @example
	     *
	     * _.trim('  abc  ');
	     * // => 'abc'
	     *
	     * _.trim('-_-abc-_-', '_-');
	     * // => 'abc'
	     *
	     * _.map(['  foo  ', '  bar  '], _.trim);
	     * // => ['foo', 'bar']
	     */
	    function trim(string, chars, guard) {
	      string = toString(string);
	      if (string && (guard || chars === undefined)) {
	        return string.replace(reTrim$1, '');
	      }
	      if (!string || !(chars = baseToString(chars))) {
	        return string;
	      }
	      var strSymbols = stringToArray(string),
	          chrSymbols = stringToArray(chars),
	          start = charsStartIndex(strSymbols, chrSymbols),
	          end = charsEndIndex(strSymbols, chrSymbols) + 1;

	      return castSlice(strSymbols, start, end).join('');
	    }

	    var FN_ARGS = /^(function)?\s*[^\(]*\(\s*([^\)]*)\)/m;
	    var FN_ARG_SPLIT = /,/;
	    var FN_ARG = /(=.+)?(\s*)$/;
	    var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;

	    function parseParams(func) {
	        func = func.toString().replace(STRIP_COMMENTS, '');
	        func = func.match(FN_ARGS)[2].replace(' ', '');
	        func = func ? func.split(FN_ARG_SPLIT) : [];
	        func = func.map(function (arg) {
	            return trim(arg.replace(FN_ARG, ''));
	        });
	        return func;
	    }

	    /**
	     * A dependency-injected version of the [async.auto]{@link module:ControlFlow.auto} function. Dependent
	     * tasks are specified as parameters to the function, after the usual callback
	     * parameter, with the parameter names matching the names of the tasks it
	     * depends on. This can provide even more readable task graphs which can be
	     * easier to maintain.
	     *
	     * If a final callback is specified, the task results are similarly injected,
	     * specified as named parameters after the initial error parameter.
	     *
	     * The autoInject function is purely syntactic sugar and its semantics are
	     * otherwise equivalent to [async.auto]{@link module:ControlFlow.auto}.
	     *
	     * @name autoInject
	     * @static
	     * @memberOf module:ControlFlow
	     * @method
	     * @see [async.auto]{@link module:ControlFlow.auto}
	     * @category Control Flow
	     * @param {Object} tasks - An object, each of whose properties is a function of
	     * the form 'func([dependencies...], callback). The object's key of a property
	     * serves as the name of the task defined by that property, i.e. can be used
	     * when specifying requirements for other tasks.
	     * * The `callback` parameter is a `callback(err, result)` which must be called
	     *   when finished, passing an `error` (which can be `null`) and the result of
	     *   the function's execution. The remaining parameters name other tasks on
	     *   which the task is dependent, and the results from those tasks are the
	     *   arguments of those parameters.
	     * @param {Function} [callback] - An optional callback which is called when all
	     * the tasks have been completed. It receives the `err` argument if any `tasks`
	     * pass an error to their callback, and a `results` object with any completed
	     * task results, similar to `auto`.
	     * @example
	     *
	     * //  The example from `auto` can be rewritten as follows:
	     * async.autoInject({
	     *     get_data: function(callback) {
	     *         // async code to get some data
	     *         callback(null, 'data', 'converted to array');
	     *     },
	     *     make_folder: function(callback) {
	     *         // async code to create a directory to store a file in
	     *         // this is run at the same time as getting the data
	     *         callback(null, 'folder');
	     *     },
	     *     write_file: function(get_data, make_folder, callback) {
	     *         // once there is some data and the directory exists,
	     *         // write the data to a file in the directory
	     *         callback(null, 'filename');
	     *     },
	     *     email_link: function(write_file, callback) {
	     *         // once the file is written let's email a link to it...
	     *         // write_file contains the filename returned by write_file.
	     *         callback(null, {'file':write_file, 'email':'user@example.com'});
	     *     }
	     * }, function(err, results) {
	     *     console.log('err = ', err);
	     *     console.log('email_link = ', results.email_link);
	     * });
	     *
	     * // If you are using a JS minifier that mangles parameter names, `autoInject`
	     * // will not work with plain functions, since the parameter names will be
	     * // collapsed to a single letter identifier.  To work around this, you can
	     * // explicitly specify the names of the parameters your task function needs
	     * // in an array, similar to Angular.js dependency injection.
	     *
	     * // This still has an advantage over plain `auto`, since the results a task
	     * // depends on are still spread into arguments.
	     * async.autoInject({
	     *     //...
	     *     write_file: ['get_data', 'make_folder', function(get_data, make_folder, callback) {
	     *         callback(null, 'filename');
	     *     }],
	     *     email_link: ['write_file', function(write_file, callback) {
	     *         callback(null, {'file':write_file, 'email':'user@example.com'});
	     *     }]
	     *     //...
	     * }, function(err, results) {
	     *     console.log('err = ', err);
	     *     console.log('email_link = ', results.email_link);
	     * });
	     */
	    function autoInject(tasks, callback) {
	        var newTasks = {};

	        baseForOwn(tasks, function (taskFn, key) {
	            var params;

	            if (isArray(taskFn)) {
	                params = copyArray(taskFn);
	                taskFn = params.pop();

	                newTasks[key] = params.concat(params.length > 0 ? newTask : taskFn);
	            } else if (taskFn.length === 1) {
	                // no dependencies, use the function as-is
	                newTasks[key] = taskFn;
	            } else {
	                params = parseParams(taskFn);
	                if (taskFn.length === 0 && params.length === 0) {
	                    throw new Error("autoInject task functions require explicit parameters.");
	                }

	                params.pop();

	                newTasks[key] = params.concat(newTask);
	            }

	            function newTask(results, taskCb) {
	                var newArgs = arrayMap(params, function (name) {
	                    return results[name];
	                });
	                newArgs.push(taskCb);
	                taskFn.apply(null, newArgs);
	            }
	        });

	        auto(newTasks, callback);
	    }

	    var hasSetImmediate = typeof setImmediate === 'function' && setImmediate;
	    var hasNextTick = typeof process === 'object' && typeof process.nextTick === 'function';

	    function fallback(fn) {
	        setTimeout(fn, 0);
	    }

	    function wrap(defer) {
	        return rest(function (fn, args) {
	            defer(function () {
	                fn.apply(null, args);
	            });
	        });
	    }

	    var _defer;

	    if (hasSetImmediate) {
	        _defer = setImmediate;
	    } else if (hasNextTick) {
	        _defer = process.nextTick;
	    } else {
	        _defer = fallback;
	    }

	    var setImmediate$1 = wrap(_defer);

	    // Simple doubly linked list (https://en.wikipedia.org/wiki/Doubly_linked_list) implementation
	    // used for queues. This implementation assumes that the node provided by the user can be modified
	    // to adjust the next and last properties. We implement only the minimal functionality
	    // for queue support.
	    function DLL() {
	        this.head = this.tail = null;
	        this.length = 0;
	    }

	    function setInitial(dll, node) {
	        dll.length = 1;
	        dll.head = dll.tail = node;
	    }

	    DLL.prototype.removeLink = function (node) {
	        if (node.prev) node.prev.next = node.next;else this.head = node.next;
	        if (node.next) node.next.prev = node.prev;else this.tail = node.prev;

	        node.prev = node.next = null;
	        this.length -= 1;
	        return node;
	    };

	    DLL.prototype.empty = DLL;

	    DLL.prototype.insertAfter = function (node, newNode) {
	        newNode.prev = node;
	        newNode.next = node.next;
	        if (node.next) node.next.prev = newNode;else this.tail = newNode;
	        node.next = newNode;
	        this.length += 1;
	    };

	    DLL.prototype.insertBefore = function (node, newNode) {
	        newNode.prev = node.prev;
	        newNode.next = node;
	        if (node.prev) node.prev.next = newNode;else this.head = newNode;
	        node.prev = newNode;
	        this.length += 1;
	    };

	    DLL.prototype.unshift = function (node) {
	        if (this.head) this.insertBefore(this.head, node);else setInitial(this, node);
	    };

	    DLL.prototype.push = function (node) {
	        if (this.tail) this.insertAfter(this.tail, node);else setInitial(this, node);
	    };

	    DLL.prototype.shift = function () {
	        return this.head && this.removeLink(this.head);
	    };

	    DLL.prototype.pop = function () {
	        return this.tail && this.removeLink(this.tail);
	    };

	    function queue(worker, concurrency, payload) {
	        if (concurrency == null) {
	            concurrency = 1;
	        } else if (concurrency === 0) {
	            throw new Error('Concurrency must not be zero');
	        }

	        function _insert(data, insertAtFront, callback) {
	            if (callback != null && typeof callback !== 'function') {
	                throw new Error('task callback must be a function');
	            }
	            q.started = true;
	            if (!isArray(data)) {
	                data = [data];
	            }
	            if (data.length === 0 && q.idle()) {
	                // call drain immediately if there are no tasks
	                return setImmediate$1(function () {
	                    q.drain();
	                });
	            }
	            arrayEach(data, function (task) {
	                var item = {
	                    data: task,
	                    callback: callback || noop
	                };

	                if (insertAtFront) {
	                    q._tasks.unshift(item);
	                } else {
	                    q._tasks.push(item);
	                }
	            });
	            setImmediate$1(q.process);
	        }

	        function _next(tasks) {
	            return rest(function (args) {
	                workers -= 1;

	                arrayEach(tasks, function (task) {
	                    arrayEach(workersList, function (worker, index) {
	                        if (worker === task) {
	                            workersList.splice(index, 1);
	                            return false;
	                        }
	                    });

	                    task.callback.apply(task, args);

	                    if (args[0] != null) {
	                        q.error(args[0], task.data);
	                    }
	                });

	                if (workers <= q.concurrency - q.buffer) {
	                    q.unsaturated();
	                }

	                if (q.idle()) {
	                    q.drain();
	                }
	                q.process();
	            });
	        }

	        var workers = 0;
	        var workersList = [];
	        var q = {
	            _tasks: new DLL(),
	            concurrency: concurrency,
	            payload: payload,
	            saturated: noop,
	            unsaturated: noop,
	            buffer: concurrency / 4,
	            empty: noop,
	            drain: noop,
	            error: noop,
	            started: false,
	            paused: false,
	            push: function (data, callback) {
	                _insert(data, false, callback);
	            },
	            kill: function () {
	                q.drain = noop;
	                q._tasks.empty();
	            },
	            unshift: function (data, callback) {
	                _insert(data, true, callback);
	            },
	            process: function () {
	                while (!q.paused && workers < q.concurrency && q._tasks.length) {
	                    var tasks = [],
	                        data = [];
	                    var l = q._tasks.length;
	                    if (q.payload) l = Math.min(l, q.payload);
	                    for (var i = 0; i < l; i++) {
	                        var node = q._tasks.shift();
	                        tasks.push(node);
	                        data.push(node.data);
	                    }

	                    if (q._tasks.length === 0) {
	                        q.empty();
	                    }
	                    workers += 1;
	                    workersList.push(tasks[0]);

	                    if (workers === q.concurrency) {
	                        q.saturated();
	                    }

	                    var cb = onlyOnce(_next(tasks));
	                    worker(data, cb);
	                }
	            },
	            length: function () {
	                return q._tasks.length;
	            },
	            running: function () {
	                return workers;
	            },
	            workersList: function () {
	                return workersList;
	            },
	            idle: function () {
	                return q._tasks.length + workers === 0;
	            },
	            pause: function () {
	                q.paused = true;
	            },
	            resume: function () {
	                if (q.paused === false) {
	                    return;
	                }
	                q.paused = false;
	                var resumeCount = Math.min(q.concurrency, q._tasks.length);
	                // Need to call q.process once per concurrent
	                // worker to preserve full concurrency after pause
	                for (var w = 1; w <= resumeCount; w++) {
	                    setImmediate$1(q.process);
	                }
	            }
	        };
	        return q;
	    }

	    /**
	     * A cargo of tasks for the worker function to complete. Cargo inherits all of
	     * the same methods and event callbacks as [`queue`]{@link module:ControlFlow.queue}.
	     * @typedef {Object} CargoObject
	     * @memberOf module:ControlFlow
	     * @property {Function} length - A function returning the number of items
	     * waiting to be processed. Invoke like `cargo.length()`.
	     * @property {number} payload - An `integer` for determining how many tasks
	     * should be process per round. This property can be changed after a `cargo` is
	     * created to alter the payload on-the-fly.
	     * @property {Function} push - Adds `task` to the `queue`. The callback is
	     * called once the `worker` has finished processing the task. Instead of a
	     * single task, an array of `tasks` can be submitted. The respective callback is
	     * used for every task in the list. Invoke like `cargo.push(task, [callback])`.
	     * @property {Function} saturated - A callback that is called when the
	     * `queue.length()` hits the concurrency and further tasks will be queued.
	     * @property {Function} empty - A callback that is called when the last item
	     * from the `queue` is given to a `worker`.
	     * @property {Function} drain - A callback that is called when the last item
	     * from the `queue` has returned from the `worker`.
	     * @property {Function} idle - a function returning false if there are items
	     * waiting or being processed, or true if not. Invoke like `cargo.idle()`.
	     * @property {Function} pause - a function that pauses the processing of tasks
	     * until `resume()` is called. Invoke like `cargo.pause()`.
	     * @property {Function} resume - a function that resumes the processing of
	     * queued tasks when the queue is paused. Invoke like `cargo.resume()`.
	     * @property {Function} kill - a function that removes the `drain` callback and
	     * empties remaining tasks from the queue forcing it to go idle. Invoke like `cargo.kill()`.
	     */

	    /**
	     * Creates a `cargo` object with the specified payload. Tasks added to the
	     * cargo will be processed altogether (up to the `payload` limit). If the
	     * `worker` is in progress, the task is queued until it becomes available. Once
	     * the `worker` has completed some tasks, each callback of those tasks is
	     * called. Check out [these](https://camo.githubusercontent.com/6bbd36f4cf5b35a0f11a96dcd2e97711ffc2fb37/68747470733a2f2f662e636c6f75642e6769746875622e636f6d2f6173736574732f313637363837312f36383130382f62626330636662302d356632392d313165322d393734662d3333393763363464633835382e676966) [animations](https://camo.githubusercontent.com/f4810e00e1c5f5f8addbe3e9f49064fd5d102699/68747470733a2f2f662e636c6f75642e6769746875622e636f6d2f6173736574732f313637363837312f36383130312f38346339323036362d356632392d313165322d383134662d3964336430323431336266642e676966)
	     * for how `cargo` and `queue` work.
	     *
	     * While [`queue`]{@link module:ControlFlow.queue} passes only one task to one of a group of workers
	     * at a time, cargo passes an array of tasks to a single worker, repeating
	     * when the worker is finished.
	     *
	     * @name cargo
	     * @static
	     * @memberOf module:ControlFlow
	     * @method
	     * @see [async.queue]{@link module:ControlFlow.queue}
	     * @category Control Flow
	     * @param {Function} worker - An asynchronous function for processing an array
	     * of queued tasks, which must call its `callback(err)` argument when finished,
	     * with an optional `err` argument. Invoked with `(tasks, callback)`.
	     * @param {number} [payload=Infinity] - An optional `integer` for determining
	     * how many tasks should be processed per round; if omitted, the default is
	     * unlimited.
	     * @returns {module:ControlFlow.CargoObject} A cargo object to manage the tasks. Callbacks can
	     * attached as certain properties to listen for specific events during the
	     * lifecycle of the cargo and inner queue.
	     * @example
	     *
	     * // create a cargo object with payload 2
	     * var cargo = async.cargo(function(tasks, callback) {
	     *     for (var i=0; i<tasks.length; i++) {
	     *         console.log('hello ' + tasks[i].name);
	     *     }
	     *     callback();
	     * }, 2);
	     *
	     * // add some items
	     * cargo.push({name: 'foo'}, function(err) {
	     *     console.log('finished processing foo');
	     * });
	     * cargo.push({name: 'bar'}, function(err) {
	     *     console.log('finished processing bar');
	     * });
	     * cargo.push({name: 'baz'}, function(err) {
	     *     console.log('finished processing baz');
	     * });
	     */
	    function cargo(worker, payload) {
	      return queue(worker, 1, payload);
	    }

	    /**
	     * The same as [`eachOf`]{@link module:Collections.eachOf} but runs only a single async operation at a time.
	     *
	     * @name eachOfSeries
	     * @static
	     * @memberOf module:Collections
	     * @method
	     * @see [async.eachOf]{@link module:Collections.eachOf}
	     * @alias forEachOfSeries
	     * @category Collection
	     * @param {Array|Iterable|Object} coll - A collection to iterate over.
	     * @param {Function} iteratee - A function to apply to each item in `coll`. The
	     * `key` is the item's key, or index in the case of an array. The iteratee is
	     * passed a `callback(err)` which must be called once it has completed. If no
	     * error has occurred, the callback should be run without arguments or with an
	     * explicit `null` argument. Invoked with (item, key, callback).
	     * @param {Function} [callback] - A callback which is called when all `iteratee`
	     * functions have finished, or an error occurs. Invoked with (err).
	     */
	    var eachOfSeries = doLimit(eachOfLimit, 1);

	    /**
	     * Reduces `coll` into a single value using an async `iteratee` to return each
	     * successive step. `memo` is the initial state of the reduction. This function
	     * only operates in series.
	     *
	     * For performance reasons, it may make sense to split a call to this function
	     * into a parallel map, and then use the normal `Array.prototype.reduce` on the
	     * results. This function is for situations where each step in the reduction
	     * needs to be async; if you can get the data before reducing it, then it's
	     * probably a good idea to do so.
	     *
	     * @name reduce
	     * @static
	     * @memberOf module:Collections
	     * @method
	     * @alias inject
	     * @alias foldl
	     * @category Collection
	     * @param {Array|Iterable|Object} coll - A collection to iterate over.
	     * @param {*} memo - The initial state of the reduction.
	     * @param {Function} iteratee - A function applied to each item in the
	     * array to produce the next step in the reduction. The `iteratee` is passed a
	     * `callback(err, reduction)` which accepts an optional error as its first
	     * argument, and the state of the reduction as the second. If an error is
	     * passed to the callback, the reduction is stopped and the main `callback` is
	     * immediately called with the error. Invoked with (memo, item, callback).
	     * @param {Function} [callback] - A callback which is called after all the
	     * `iteratee` functions have finished. Result is the reduced value. Invoked with
	     * (err, result).
	     * @example
	     *
	     * async.reduce([1,2,3], 0, function(memo, item, callback) {
	     *     // pointless async:
	     *     process.nextTick(function() {
	     *         callback(null, memo + item)
	     *     });
	     * }, function(err, result) {
	     *     // result is now equal to the last value of memo, which is 6
	     * });
	     */
	    function reduce(coll, memo, iteratee, callback) {
	        callback = once(callback || noop);
	        eachOfSeries(coll, function (x, i, callback) {
	            iteratee(memo, x, function (err, v) {
	                memo = v;
	                callback(err);
	            });
	        }, function (err) {
	            callback(err, memo);
	        });
	    }

	    /**
	     * Version of the compose function that is more natural to read. Each function
	     * consumes the return value of the previous function. It is the equivalent of
	     * [compose]{@link module:ControlFlow.compose} with the arguments reversed.
	     *
	     * Each function is executed with the `this` binding of the composed function.
	     *
	     * @name seq
	     * @static
	     * @memberOf module:ControlFlow
	     * @method
	     * @see [async.compose]{@link module:ControlFlow.compose}
	     * @category Control Flow
	     * @param {...Function} functions - the asynchronous functions to compose
	     * @returns {Function} a function that composes the `functions` in order
	     * @example
	     *
	     * // Requires lodash (or underscore), express3 and dresende's orm2.
	     * // Part of an app, that fetches cats of the logged user.
	     * // This example uses `seq` function to avoid overnesting and error
	     * // handling clutter.
	     * app.get('/cats', function(request, response) {
	     *     var User = request.models.User;
	     *     async.seq(
	     *         _.bind(User.get, User),  // 'User.get' has signature (id, callback(err, data))
	     *         function(user, fn) {
	     *             user.getCats(fn);      // 'getCats' has signature (callback(err, data))
	     *         }
	     *     )(req.session.user_id, function (err, cats) {
	     *         if (err) {
	     *             console.error(err);
	     *             response.json({ status: 'error', message: err.message });
	     *         } else {
	     *             response.json({ status: 'ok', message: 'Cats found', data: cats });
	     *         }
	     *     });
	     * });
	     */
	    var seq = rest(function seq(functions) {
	        return rest(function (args) {
	            var that = this;

	            var cb = args[args.length - 1];
	            if (typeof cb == 'function') {
	                args.pop();
	            } else {
	                cb = noop;
	            }

	            reduce(functions, args, function (newargs, fn, cb) {
	                fn.apply(that, newargs.concat([rest(function (err, nextargs) {
	                    cb(err, nextargs);
	                })]));
	            }, function (err, results) {
	                cb.apply(that, [err].concat(results));
	            });
	        });
	    });

	    /**
	     * Creates a function which is a composition of the passed asynchronous
	     * functions. Each function consumes the return value of the function that
	     * follows. Composing functions `f()`, `g()`, and `h()` would produce the result
	     * of `f(g(h()))`, only this version uses callbacks to obtain the return values.
	     *
	     * Each function is executed with the `this` binding of the composed function.
	     *
	     * @name compose
	     * @static
	     * @memberOf module:ControlFlow
	     * @method
	     * @category Control Flow
	     * @param {...Function} functions - the asynchronous functions to compose
	     * @returns {Function} an asynchronous function that is the composed
	     * asynchronous `functions`
	     * @example
	     *
	     * function add1(n, callback) {
	     *     setTimeout(function () {
	     *         callback(null, n + 1);
	     *     }, 10);
	     * }
	     *
	     * function mul3(n, callback) {
	     *     setTimeout(function () {
	     *         callback(null, n * 3);
	     *     }, 10);
	     * }
	     *
	     * var add1mul3 = async.compose(mul3, add1);
	     * add1mul3(4, function (err, result) {
	     *     // result now equals 15
	     * });
	     */
	    var compose = rest(function (args) {
	      return seq.apply(null, args.reverse());
	    });

	    function concat$1(eachfn, arr, fn, callback) {
	        var result = [];
	        eachfn(arr, function (x, index, cb) {
	            fn(x, function (err, y) {
	                result = result.concat(y || []);
	                cb(err);
	            });
	        }, function (err) {
	            callback(err, result);
	        });
	    }

	    /**
	     * Applies `iteratee` to each item in `coll`, concatenating the results. Returns
	     * the concatenated list. The `iteratee`s are called in parallel, and the
	     * results are concatenated as they return. There is no guarantee that the
	     * results array will be returned in the original order of `coll` passed to the
	     * `iteratee` function.
	     *
	     * @name concat
	     * @static
	     * @memberOf module:Collections
	     * @method
	     * @category Collection
	     * @param {Array|Iterable|Object} coll - A collection to iterate over.
	     * @param {Function} iteratee - A function to apply to each item in `coll`.
	     * The iteratee is passed a `callback(err, results)` which must be called once
	     * it has completed with an error (which can be `null`) and an array of results.
	     * Invoked with (item, callback).
	     * @param {Function} [callback(err)] - A callback which is called after all the
	     * `iteratee` functions have finished, or an error occurs. Results is an array
	     * containing the concatenated results of the `iteratee` function. Invoked with
	     * (err, results).
	     * @example
	     *
	     * async.concat(['dir1','dir2','dir3'], fs.readdir, function(err, files) {
	     *     // files is now a list of filenames that exist in the 3 directories
	     * });
	     */
	    var concat = doParallel(concat$1);

	    function doSeries(fn) {
	        return function (obj, iteratee, callback) {
	            return fn(eachOfSeries, obj, iteratee, callback);
	        };
	    }

	    /**
	     * The same as [`concat`]{@link module:Collections.concat} but runs only a single async operation at a time.
	     *
	     * @name concatSeries
	     * @static
	     * @memberOf module:Collections
	     * @method
	     * @see [async.concat]{@link module:Collections.concat}
	     * @category Collection
	     * @param {Array|Iterable|Object} coll - A collection to iterate over.
	     * @param {Function} iteratee - A function to apply to each item in `coll`.
	     * The iteratee is passed a `callback(err, results)` which must be called once
	     * it has completed with an error (which can be `null`) and an array of results.
	     * Invoked with (item, callback).
	     * @param {Function} [callback(err)] - A callback which is called after all the
	     * `iteratee` functions have finished, or an error occurs. Results is an array
	     * containing the concatenated results of the `iteratee` function. Invoked with
	     * (err, results).
	     */
	    var concatSeries = doSeries(concat$1);

	    /**
	     * Returns a function that when called, calls-back with the values provided.
	     * Useful as the first function in a [`waterfall`]{@link module:ControlFlow.waterfall}, or for plugging values in to
	     * [`auto`]{@link module:ControlFlow.auto}.
	     *
	     * @name constant
	     * @static
	     * @memberOf module:Utils
	     * @method
	     * @category Util
	     * @param {...*} arguments... - Any number of arguments to automatically invoke
	     * callback with.
	     * @returns {Function} Returns a function that when invoked, automatically
	     * invokes the callback with the previous given arguments.
	     * @example
	     *
	     * async.waterfall([
	     *     async.constant(42),
	     *     function (value, next) {
	     *         // value === 42
	     *     },
	     *     //...
	     * ], callback);
	     *
	     * async.waterfall([
	     *     async.constant(filename, "utf8"),
	     *     fs.readFile,
	     *     function (fileData, next) {
	     *         //...
	     *     }
	     *     //...
	     * ], callback);
	     *
	     * async.auto({
	     *     hostname: async.constant("https://server.net/"),
	     *     port: findFreePort,
	     *     launchServer: ["hostname", "port", function (options, cb) {
	     *         startServer(options, cb);
	     *     }],
	     *     //...
	     * }, callback);
	     */
	    var constant = rest(function (values) {
	        var args = [null].concat(values);
	        return initialParams(function (ignoredArgs, callback) {
	            return callback.apply(this, args);
	        });
	    });

	    /**
	     * This method returns the first argument given to it.
	     *
	     * @static
	     * @since 0.1.0
	     * @memberOf _
	     * @category Util
	     * @param {*} value Any value.
	     * @returns {*} Returns `value`.
	     * @example
	     *
	     * var object = { 'user': 'fred' };
	     *
	     * console.log(_.identity(object) === object);
	     * // => true
	     */
	    function identity(value) {
	      return value;
	    }

	    function _createTester(eachfn, check, getResult) {
	        return function (arr, limit, iteratee, cb) {
	            function done(err) {
	                if (cb) {
	                    if (err) {
	                        cb(err);
	                    } else {
	                        cb(null, getResult(false));
	                    }
	                }
	            }
	            function wrappedIteratee(x, _, callback) {
	                if (!cb) return callback();
	                iteratee(x, function (err, v) {
	                    if (cb) {
	                        if (err) {
	                            cb(err);
	                            cb = iteratee = false;
	                        } else if (check(v)) {
	                            cb(null, getResult(true, x));
	                            cb = iteratee = false;
	                        }
	                    }
	                    callback();
	                });
	            }
	            if (arguments.length > 3) {
	                cb = cb || noop;
	                eachfn(arr, limit, wrappedIteratee, done);
	            } else {
	                cb = iteratee;
	                cb = cb || noop;
	                iteratee = limit;
	                eachfn(arr, wrappedIteratee, done);
	            }
	        };
	    }

	    function _findGetResult(v, x) {
	        return x;
	    }

	    /**
	     * Returns the first value in `coll` that passes an async truth test. The
	     * `iteratee` is applied in parallel, meaning the first iteratee to return
	     * `true` will fire the detect `callback` with that result. That means the
	     * result might not be the first item in the original `coll` (in terms of order)
	     * that passes the test.

	     * If order within the original `coll` is important, then look at
	     * [`detectSeries`]{@link module:Collections.detectSeries}.
	     *
	     * @name detect
	     * @static
	     * @memberOf module:Collections
	     * @method
	     * @alias find
	     * @category Collections
	     * @param {Array|Iterable|Object} coll - A collection to iterate over.
	     * @param {Function} iteratee - A truth test to apply to each item in `coll`.
	     * The iteratee is passed a `callback(err, truthValue)` which must be called
	     * with a boolean argument once it has completed. Invoked with (item, callback).
	     * @param {Function} [callback] - A callback which is called as soon as any
	     * iteratee returns `true`, or after all the `iteratee` functions have finished.
	     * Result will be the first item in the array that passes the truth test
	     * (iteratee) or the value `undefined` if none passed. Invoked with
	     * (err, result).
	     * @example
	     *
	     * async.detect(['file1','file2','file3'], function(filePath, callback) {
	     *     fs.access(filePath, function(err) {
	     *         callback(null, !err)
	     *     });
	     * }, function(err, result) {
	     *     // result now equals the first file in the list that exists
	     * });
	     */
	    var detect = _createTester(eachOf, identity, _findGetResult);

	    /**
	     * The same as [`detect`]{@link module:Collections.detect} but runs a maximum of `limit` async operations at a
	     * time.
	     *
	     * @name detectLimit
	     * @static
	     * @memberOf module:Collections
	     * @method
	     * @see [async.detect]{@link module:Collections.detect}
	     * @alias findLimit
	     * @category Collections
	     * @param {Array|Iterable|Object} coll - A collection to iterate over.
	     * @param {number} limit - The maximum number of async operations at a time.
	     * @param {Function} iteratee - A truth test to apply to each item in `coll`.
	     * The iteratee is passed a `callback(err, truthValue)` which must be called
	     * with a boolean argument once it has completed. Invoked with (item, callback).
	     * @param {Function} [callback] - A callback which is called as soon as any
	     * iteratee returns `true`, or after all the `iteratee` functions have finished.
	     * Result will be the first item in the array that passes the truth test
	     * (iteratee) or the value `undefined` if none passed. Invoked with
	     * (err, result).
	     */
	    var detectLimit = _createTester(eachOfLimit, identity, _findGetResult);

	    /**
	     * The same as [`detect`]{@link module:Collections.detect} but runs only a single async operation at a time.
	     *
	     * @name detectSeries
	     * @static
	     * @memberOf module:Collections
	     * @method
	     * @see [async.detect]{@link module:Collections.detect}
	     * @alias findSeries
	     * @category Collections
	     * @param {Array|Iterable|Object} coll - A collection to iterate over.
	     * @param {Function} iteratee - A truth test to apply to each item in `coll`.
	     * The iteratee is passed a `callback(err, truthValue)` which must be called
	     * with a boolean argument once it has completed. Invoked with (item, callback).
	     * @param {Function} [callback] - A callback which is called as soon as any
	     * iteratee returns `true`, or after all the `iteratee` functions have finished.
	     * Result will be the first item in the array that passes the truth test
	     * (iteratee) or the value `undefined` if none passed. Invoked with
	     * (err, result).
	     */
	    var detectSeries = _createTester(eachOfSeries, identity, _findGetResult);

	    function consoleFunc(name) {
	        return rest(function (fn, args) {
	            fn.apply(null, args.concat([rest(function (err, args) {
	                if (typeof console === 'object') {
	                    if (err) {
	                        if (console.error) {
	                            console.error(err);
	                        }
	                    } else if (console[name]) {
	                        arrayEach(args, function (x) {
	                            console[name](x);
	                        });
	                    }
	                }
	            })]));
	        });
	    }

	    /**
	     * Logs the result of an `async` function to the `console` using `console.dir`
	     * to display the properties of the resulting object. Only works in Node.js or
	     * in browsers that support `console.dir` and `console.error` (such as FF and
	     * Chrome). If multiple arguments are returned from the async function,
	     * `console.dir` is called on each argument in order.
	     *
	     * @name dir
	     * @static
	     * @memberOf module:Utils
	     * @method
	     * @category Util
	     * @param {Function} function - The function you want to eventually apply all
	     * arguments to.
	     * @param {...*} arguments... - Any number of arguments to apply to the function.
	     * @example
	     *
	     * // in a module
	     * var hello = function(name, callback) {
	     *     setTimeout(function() {
	     *         callback(null, {hello: name});
	     *     }, 1000);
	     * };
	     *
	     * // in the node repl
	     * node> async.dir(hello, 'world');
	     * {hello: 'world'}
	     */
	    var dir = consoleFunc('dir');

	    /**
	     * The post-check version of [`during`]{@link module:ControlFlow.during}. To reflect the difference in
	     * the order of operations, the arguments `test` and `fn` are switched.
	     *
	     * Also a version of [`doWhilst`]{@link module:ControlFlow.doWhilst} with asynchronous `test` function.
	     * @name doDuring
	     * @static
	     * @memberOf module:ControlFlow
	     * @method
	     * @see [async.during]{@link module:ControlFlow.during}
	     * @category Control Flow
	     * @param {Function} fn - A function which is called each time `test` passes.
	     * The function is passed a `callback(err)`, which must be called once it has
	     * completed with an optional `err` argument. Invoked with (callback).
	     * @param {Function} test - asynchronous truth test to perform before each
	     * execution of `fn`. Invoked with (...args, callback), where `...args` are the
	     * non-error args from the previous callback of `fn`.
	     * @param {Function} [callback] - A callback which is called after the test
	     * function has failed and repeated execution of `fn` has stopped. `callback`
	     * will be passed an error if one occured, otherwise `null`.
	     */
	    function doDuring(fn, test, callback) {
	        callback = onlyOnce(callback || noop);

	        var next = rest(function (err, args) {
	            if (err) return callback(err);
	            args.push(check);
	            test.apply(this, args);
	        });

	        function check(err, truth) {
	            if (err) return callback(err);
	            if (!truth) return callback(null);
	            fn(next);
	        }

	        check(null, true);
	    }

	    /**
	     * The post-check version of [`whilst`]{@link module:ControlFlow.whilst}. To reflect the difference in
	     * the order of operations, the arguments `test` and `iteratee` are switched.
	     *
	     * `doWhilst` is to `whilst` as `do while` is to `while` in plain JavaScript.
	     *
	     * @name doWhilst
	     * @static
	     * @memberOf module:ControlFlow
	     * @method
	     * @see [async.whilst]{@link module:ControlFlow.whilst}
	     * @category Control Flow
	     * @param {Function} iteratee - A function which is called each time `test`
	     * passes. The function is passed a `callback(err)`, which must be called once
	     * it has completed with an optional `err` argument. Invoked with (callback).
	     * @param {Function} test - synchronous truth test to perform after each
	     * execution of `iteratee`. Invoked with Invoked with the non-error callback
	     * results of `iteratee`.
	     * @param {Function} [callback] - A callback which is called after the test
	     * function has failed and repeated execution of `iteratee` has stopped.
	     * `callback` will be passed an error and any arguments passed to the final
	     * `iteratee`'s callback. Invoked with (err, [results]);
	     */
	    function doWhilst(iteratee, test, callback) {
	        callback = onlyOnce(callback || noop);
	        var next = rest(function (err, args) {
	            if (err) return callback(err);
	            if (test.apply(this, args)) return iteratee(next);
	            callback.apply(null, [null].concat(args));
	        });
	        iteratee(next);
	    }

	    /**
	     * Like ['doWhilst']{@link module:ControlFlow.doWhilst}, except the `test` is inverted. Note the
	     * argument ordering differs from `until`.
	     *
	     * @name doUntil
	     * @static
	     * @memberOf module:ControlFlow
	     * @method
	     * @see [async.doWhilst]{@link module:ControlFlow.doWhilst}
	     * @category Control Flow
	     * @param {Function} fn - A function which is called each time `test` fails.
	     * The function is passed a `callback(err)`, which must be called once it has
	     * completed with an optional `err` argument. Invoked with (callback).
	     * @param {Function} test - synchronous truth test to perform after each
	     * execution of `fn`. Invoked with the non-error callback results of `fn`.
	     * @param {Function} [callback] - A callback which is called after the test
	     * function has passed and repeated execution of `fn` has stopped. `callback`
	     * will be passed an error and any arguments passed to the final `fn`'s
	     * callback. Invoked with (err, [results]);
	     */
	    function doUntil(fn, test, callback) {
	        doWhilst(fn, function () {
	            return !test.apply(this, arguments);
	        }, callback);
	    }

	    /**
	     * Like [`whilst`]{@link module:ControlFlow.whilst}, except the `test` is an asynchronous function that
	     * is passed a callback in the form of `function (err, truth)`. If error is
	     * passed to `test` or `fn`, the main callback is immediately called with the
	     * value of the error.
	     *
	     * @name during
	     * @static
	     * @memberOf module:ControlFlow
	     * @method
	     * @see [async.whilst]{@link module:ControlFlow.whilst}
	     * @category Control Flow
	     * @param {Function} test - asynchronous truth test to perform before each
	     * execution of `fn`. Invoked with (callback).
	     * @param {Function} fn - A function which is called each time `test` passes.
	     * The function is passed a `callback(err)`, which must be called once it has
	     * completed with an optional `err` argument. Invoked with (callback).
	     * @param {Function} [callback] - A callback which is called after the test
	     * function has failed and repeated execution of `fn` has stopped. `callback`
	     * will be passed an error, if one occured, otherwise `null`.
	     * @example
	     *
	     * var count = 0;
	     *
	     * async.during(
	     *     function (callback) {
	     *         return callback(null, count < 5);
	     *     },
	     *     function (callback) {
	     *         count++;
	     *         setTimeout(callback, 1000);
	     *     },
	     *     function (err) {
	     *         // 5 seconds have passed
	     *     }
	     * );
	     */
	    function during(test, fn, callback) {
	        callback = onlyOnce(callback || noop);

	        function next(err) {
	            if (err) return callback(err);
	            test(check);
	        }

	        function check(err, truth) {
	            if (err) return callback(err);
	            if (!truth) return callback(null);
	            fn(next);
	        }

	        test(check);
	    }

	    function _withoutIndex(iteratee) {
	        return function (value, index, callback) {
	            return iteratee(value, callback);
	        };
	    }

	    /**
	     * Applies the function `iteratee` to each item in `coll`, in parallel.
	     * The `iteratee` is called with an item from the list, and a callback for when
	     * it has finished. If the `iteratee` passes an error to its `callback`, the
	     * main `callback` (for the `each` function) is immediately called with the
	     * error.
	     *
	     * Note, that since this function applies `iteratee` to each item in parallel,
	     * there is no guarantee that the iteratee functions will complete in order.
	     *
	     * @name each
	     * @static
	     * @memberOf module:Collections
	     * @method
	     * @alias forEach
	     * @category Collection
	     * @param {Array|Iterable|Object} coll - A collection to iterate over.
	     * @param {Function} iteratee - A function to apply to each item
	     * in `coll`. The iteratee is passed a `callback(err)` which must be called once
	     * it has completed. If no error has occurred, the `callback` should be run
	     * without arguments or with an explicit `null` argument. The array index is not
	     * passed to the iteratee. Invoked with (item, callback). If you need the index,
	     * use `eachOf`.
	     * @param {Function} [callback] - A callback which is called when all
	     * `iteratee` functions have finished, or an error occurs. Invoked with (err).
	     * @example
	     *
	     * // assuming openFiles is an array of file names and saveFile is a function
	     * // to save the modified contents of that file:
	     *
	     * async.each(openFiles, saveFile, function(err){
	     *   // if any of the saves produced an error, err would equal that error
	     * });
	     *
	     * // assuming openFiles is an array of file names
	     * async.each(openFiles, function(file, callback) {
	     *
	     *     // Perform operation on file here.
	     *     console.log('Processing file ' + file);
	     *
	     *     if( file.length > 32 ) {
	     *       console.log('This file name is too long');
	     *       callback('File name too long');
	     *     } else {
	     *       // Do work to process file here
	     *       console.log('File processed');
	     *       callback();
	     *     }
	     * }, function(err) {
	     *     // if any of the file processing produced an error, err would equal that error
	     *     if( err ) {
	     *       // One of the iterations produced an error.
	     *       // All processing will now stop.
	     *       console.log('A file failed to process');
	     *     } else {
	     *       console.log('All files have been processed successfully');
	     *     }
	     * });
	     */
	    function eachLimit(coll, iteratee, callback) {
	      eachOf(coll, _withoutIndex(iteratee), callback);
	    }

	    /**
	     * The same as [`each`]{@link module:Collections.each} but runs a maximum of `limit` async operations at a time.
	     *
	     * @name eachLimit
	     * @static
	     * @memberOf module:Collections
	     * @method
	     * @see [async.each]{@link module:Collections.each}
	     * @alias forEachLimit
	     * @category Collection
	     * @param {Array|Iterable|Object} coll - A colleciton to iterate over.
	     * @param {number} limit - The maximum number of async operations at a time.
	     * @param {Function} iteratee - A function to apply to each item in `coll`. The
	     * iteratee is passed a `callback(err)` which must be called once it has
	     * completed. If no error has occurred, the `callback` should be run without
	     * arguments or with an explicit `null` argument. The array index is not passed
	     * to the iteratee. Invoked with (item, callback). If you need the index, use
	     * `eachOfLimit`.
	     * @param {Function} [callback] - A callback which is called when all
	     * `iteratee` functions have finished, or an error occurs. Invoked with (err).
	     */
	    function eachLimit$1(coll, limit, iteratee, callback) {
	      _eachOfLimit(limit)(coll, _withoutIndex(iteratee), callback);
	    }

	    /**
	     * The same as [`each`]{@link module:Collections.each} but runs only a single async operation at a time.
	     *
	     * @name eachSeries
	     * @static
	     * @memberOf module:Collections
	     * @method
	     * @see [async.each]{@link module:Collections.each}
	     * @alias forEachSeries
	     * @category Collection
	     * @param {Array|Iterable|Object} coll - A collection to iterate over.
	     * @param {Function} iteratee - A function to apply to each
	     * item in `coll`. The iteratee is passed a `callback(err)` which must be called
	     * once it has completed. If no error has occurred, the `callback` should be run
	     * without arguments or with an explicit `null` argument. The array index is
	     * not passed to the iteratee. Invoked with (item, callback). If you need the
	     * index, use `eachOfSeries`.
	     * @param {Function} [callback] - A callback which is called when all
	     * `iteratee` functions have finished, or an error occurs. Invoked with (err).
	     */
	    var eachSeries = doLimit(eachLimit$1, 1);

	    /**
	     * Wrap an async function and ensure it calls its callback on a later tick of
	     * the event loop.  If the function already calls its callback on a next tick,
	     * no extra deferral is added. This is useful for preventing stack overflows
	     * (`RangeError: Maximum call stack size exceeded`) and generally keeping
	     * [Zalgo](http://blog.izs.me/post/59142742143/designing-apis-for-asynchrony)
	     * contained.
	     *
	     * @name ensureAsync
	     * @static
	     * @memberOf module:Utils
	     * @method
	     * @category Util
	     * @param {Function} fn - an async function, one that expects a node-style
	     * callback as its last argument.
	     * @returns {Function} Returns a wrapped function with the exact same call
	     * signature as the function passed in.
	     * @example
	     *
	     * function sometimesAsync(arg, callback) {
	     *     if (cache[arg]) {
	     *         return callback(null, cache[arg]); // this would be synchronous!!
	     *     } else {
	     *         doSomeIO(arg, callback); // this IO would be asynchronous
	     *     }
	     * }
	     *
	     * // this has a risk of stack overflows if many results are cached in a row
	     * async.mapSeries(args, sometimesAsync, done);
	     *
	     * // this will defer sometimesAsync's callback if necessary,
	     * // preventing stack overflows
	     * async.mapSeries(args, async.ensureAsync(sometimesAsync), done);
	     */
	    function ensureAsync(fn) {
	        return initialParams(function (args, callback) {
	            var sync = true;
	            args.push(function () {
	                var innerArgs = arguments;
	                if (sync) {
	                    setImmediate$1(function () {
	                        callback.apply(null, innerArgs);
	                    });
	                } else {
	                    callback.apply(null, innerArgs);
	                }
	            });
	            fn.apply(this, args);
	            sync = false;
	        });
	    }

	    function notId(v) {
	        return !v;
	    }

	    /**
	     * Returns `true` if every element in `coll` satisfies an async test. If any
	     * iteratee call returns `false`, the main `callback` is immediately called.
	     *
	     * @name every
	     * @static
	     * @memberOf module:Collections
	     * @method
	     * @alias all
	     * @category Collection
	     * @param {Array|Iterable|Object} coll - A collection to iterate over.
	     * @param {Function} iteratee - A truth test to apply to each item in the
	     * collection in parallel. The iteratee is passed a `callback(err, truthValue)`
	     * which must be called with a  boolean argument once it has completed. Invoked
	     * with (item, callback).
	     * @param {Function} [callback] - A callback which is called after all the
	     * `iteratee` functions have finished. Result will be either `true` or `false`
	     * depending on the values of the async tests. Invoked with (err, result).
	     * @example
	     *
	     * async.every(['file1','file2','file3'], function(filePath, callback) {
	     *     fs.access(filePath, function(err) {
	     *         callback(null, !err)
	     *     });
	     * }, function(err, result) {
	     *     // if result is true then every file exists
	     * });
	     */
	    var every = _createTester(eachOf, notId, notId);

	    /**
	     * The same as [`every`]{@link module:Collections.every} but runs a maximum of `limit` async operations at a time.
	     *
	     * @name everyLimit
	     * @static
	     * @memberOf module:Collections
	     * @method
	     * @see [async.every]{@link module:Collections.every}
	     * @alias allLimit
	     * @category Collection
	     * @param {Array|Iterable|Object} coll - A collection to iterate over.
	     * @param {number} limit - The maximum number of async operations at a time.
	     * @param {Function} iteratee - A truth test to apply to each item in the
	     * collection in parallel. The iteratee is passed a `callback(err, truthValue)`
	     * which must be called with a  boolean argument once it has completed. Invoked
	     * with (item, callback).
	     * @param {Function} [callback] - A callback which is called after all the
	     * `iteratee` functions have finished. Result will be either `true` or `false`
	     * depending on the values of the async tests. Invoked with (err, result).
	     */
	    var everyLimit = _createTester(eachOfLimit, notId, notId);

	    /**
	     * The same as [`every`]{@link module:Collections.every} but runs only a single async operation at a time.
	     *
	     * @name everySeries
	     * @static
	     * @memberOf module:Collections
	     * @method
	     * @see [async.every]{@link module:Collections.every}
	     * @alias allSeries
	     * @category Collection
	     * @param {Array|Iterable|Object} coll - A collection to iterate over.
	     * @param {Function} iteratee - A truth test to apply to each item in the
	     * collection in parallel. The iteratee is passed a `callback(err, truthValue)`
	     * which must be called with a  boolean argument once it has completed. Invoked
	     * with (item, callback).
	     * @param {Function} [callback] - A callback which is called after all the
	     * `iteratee` functions have finished. Result will be either `true` or `false`
	     * depending on the values of the async tests. Invoked with (err, result).
	     */
	    var everySeries = doLimit(everyLimit, 1);

	    function _filter(eachfn, arr, iteratee, callback) {
	        callback = once(callback || noop);
	        var results = [];
	        eachfn(arr, function (x, index, callback) {
	            iteratee(x, function (err, v) {
	                if (err) {
	                    callback(err);
	                } else {
	                    if (v) {
	                        results.push({ index: index, value: x });
	                    }
	                    callback();
	                }
	            });
	        }, function (err) {
	            if (err) {
	                callback(err);
	            } else {
	                callback(null, arrayMap(results.sort(function (a, b) {
	                    return a.index - b.index;
	                }), baseProperty('value')));
	            }
	        });
	    }

	    /**
	     * Returns a new array of all the values in `coll` which pass an async truth
	     * test. This operation is performed in parallel, but the results array will be
	     * in the same order as the original.
	     *
	     * @name filter
	     * @static
	     * @memberOf module:Collections
	     * @method
	     * @alias select
	     * @category Collection
	     * @param {Array|Iterable|Object} coll - A collection to iterate over.
	     * @param {Function} iteratee - A truth test to apply to each item in `coll`.
	     * The `iteratee` is passed a `callback(err, truthValue)`, which must be called
	     * with a boolean argument once it has completed. Invoked with (item, callback).
	     * @param {Function} [callback] - A callback which is called after all the
	     * `iteratee` functions have finished. Invoked with (err, results).
	     * @example
	     *
	     * async.filter(['file1','file2','file3'], function(filePath, callback) {
	     *     fs.access(filePath, function(err) {
	     *         callback(null, !err)
	     *     });
	     * }, function(err, results) {
	     *     // results now equals an array of the existing files
	     * });
	     */
	    var filter = doParallel(_filter);

	    /**
	     * The same as [`filter`]{@link module:Collections.filter} but runs a maximum of `limit` async operations at a
	     * time.
	     *
	     * @name filterLimit
	     * @static
	     * @memberOf module:Collections
	     * @method
	     * @see [async.filter]{@link module:Collections.filter}
	     * @alias selectLimit
	     * @category Collection
	     * @param {Array|Iterable|Object} coll - A collection to iterate over.
	     * @param {number} limit - The maximum number of async operations at a time.
	     * @param {Function} iteratee - A truth test to apply to each item in `coll`.
	     * The `iteratee` is passed a `callback(err, truthValue)`, which must be called
	     * with a boolean argument once it has completed. Invoked with (item, callback).
	     * @param {Function} [callback] - A callback which is called after all the
	     * `iteratee` functions have finished. Invoked with (err, results).
	     */
	    var filterLimit = doParallelLimit(_filter);

	    /**
	     * The same as [`filter`]{@link module:Collections.filter} but runs only a single async operation at a time.
	     *
	     * @name filterSeries
	     * @static
	     * @memberOf module:Collections
	     * @method
	     * @see [async.filter]{@link module:Collections.filter}
	     * @alias selectSeries
	     * @category Collection
	     * @param {Array|Iterable|Object} coll - A collection to iterate over.
	     * @param {Function} iteratee - A truth test to apply to each item in `coll`.
	     * The `iteratee` is passed a `callback(err, truthValue)`, which must be called
	     * with a boolean argument once it has completed. Invoked with (item, callback).
	     * @param {Function} [callback] - A callback which is called after all the
	     * `iteratee` functions have finished. Invoked with (err, results)
	     */
	    var filterSeries = doLimit(filterLimit, 1);

	    /**
	     * Calls the asynchronous function `fn` with a callback parameter that allows it
	     * to call itself again, in series, indefinitely.

	     * If an error is passed to the
	     * callback then `errback` is called with the error, and execution stops,
	     * otherwise it will never be called.
	     *
	     * @name forever
	     * @static
	     * @memberOf module:ControlFlow
	     * @method
	     * @category Control Flow
	     * @param {Function} fn - a function to call repeatedly. Invoked with (next).
	     * @param {Function} [errback] - when `fn` passes an error to it's callback,
	     * this function will be called, and execution stops. Invoked with (err).
	     * @example
	     *
	     * async.forever(
	     *     function(next) {
	     *         // next is suitable for passing to things that need a callback(err [, whatever]);
	     *         // it will result in this function being called again.
	     *     },
	     *     function(err) {
	     *         // if next is called with a value in its first parameter, it will appear
	     *         // in here as 'err', and execution will stop.
	     *     }
	     * );
	     */
	    function forever(fn, errback) {
	        var done = onlyOnce(errback || noop);
	        var task = ensureAsync(fn);

	        function next(err) {
	            if (err) return done(err);
	            task(next);
	        }
	        next();
	    }

	    /**
	     * Logs the result of an `async` function to the `console`. Only works in
	     * Node.js or in browsers that support `console.log` and `console.error` (such
	     * as FF and Chrome). If multiple arguments are returned from the async
	     * function, `console.log` is called on each argument in order.
	     *
	     * @name log
	     * @static
	     * @memberOf module:Utils
	     * @method
	     * @category Util
	     * @param {Function} function - The function you want to eventually apply all
	     * arguments to.
	     * @param {...*} arguments... - Any number of arguments to apply to the function.
	     * @example
	     *
	     * // in a module
	     * var hello = function(name, callback) {
	     *     setTimeout(function() {
	     *         callback(null, 'hello ' + name);
	     *     }, 1000);
	     * };
	     *
	     * // in the node repl
	     * node> async.log(hello, 'world');
	     * 'hello world'
	     */
	    var log = consoleFunc('log');

	    /**
	     * The same as [`mapValues`]{@link module:Collections.mapValues} but runs a maximum of `limit` async operations at a
	     * time.
	     *
	     * @name mapValuesLimit
	     * @static
	     * @memberOf module:Collections
	     * @method
	     * @see [async.mapValues]{@link module:Collections.mapValues}
	     * @category Collection
	     * @param {Object} obj - A collection to iterate over.
	     * @param {number} limit - The maximum number of async operations at a time.
	     * @param {Function} iteratee - A function to apply to each value in `obj`.
	     * The iteratee is passed a `callback(err, transformed)` which must be called
	     * once it has completed with an error (which can be `null`) and a
	     * transformed value. Invoked with (value, key, callback).
	     * @param {Function} [callback] - A callback which is called when all `iteratee`
	     * functions have finished, or an error occurs. Result is an object of the
	     * transformed values from the `obj`. Invoked with (err, result).
	     */
	    function mapValuesLimit(obj, limit, iteratee, callback) {
	        callback = once(callback || noop);
	        var newObj = {};
	        eachOfLimit(obj, limit, function (val, key, next) {
	            iteratee(val, key, function (err, result) {
	                if (err) return next(err);
	                newObj[key] = result;
	                next();
	            });
	        }, function (err) {
	            callback(err, newObj);
	        });
	    }

	    /**
	     * A relative of [`map`]{@link module:Collections.map}, designed for use with objects.
	     *
	     * Produces a new Object by mapping each value of `obj` through the `iteratee`
	     * function. The `iteratee` is called each `value` and `key` from `obj` and a
	     * callback for when it has finished processing. Each of these callbacks takes
	     * two arguments: an `error`, and the transformed item from `obj`. If `iteratee`
	     * passes an error to its callback, the main `callback` (for the `mapValues`
	     * function) is immediately called with the error.
	     *
	     * Note, the order of the keys in the result is not guaranteed.  The keys will
	     * be roughly in the order they complete, (but this is very engine-specific)
	     *
	     * @name mapValues
	     * @static
	     * @memberOf module:Collections
	     * @method
	     * @category Collection
	     * @param {Object} obj - A collection to iterate over.
	     * @param {Function} iteratee - A function to apply to each value and key in
	     * `coll`. The iteratee is passed a `callback(err, transformed)` which must be
	     * called once it has completed with an error (which can be `null`) and a
	     * transformed value. Invoked with (value, key, callback).
	     * @param {Function} [callback] - A callback which is called when all `iteratee`
	     * functions have finished, or an error occurs. Results is an array of the
	     * transformed items from the `obj`. Invoked with (err, result).
	     * @example
	     *
	     * async.mapValues({
	     *     f1: 'file1',
	     *     f2: 'file2',
	     *     f3: 'file3'
	     * }, function (file, key, callback) {
	     *   fs.stat(file, callback);
	     * }, function(err, result) {
	     *     // results is now a map of stats for each file, e.g.
	     *     // {
	     *     //     f1: [stats for file1],
	     *     //     f2: [stats for file2],
	     *     //     f3: [stats for file3]
	     *     // }
	     * });
	     */

	    var mapValues = doLimit(mapValuesLimit, Infinity);

	    /**
	     * The same as [`mapValues`]{@link module:Collections.mapValues} but runs only a single async operation at a time.
	     *
	     * @name mapValuesSeries
	     * @static
	     * @memberOf module:Collections
	     * @method
	     * @see [async.mapValues]{@link module:Collections.mapValues}
	     * @category Collection
	     * @param {Object} obj - A collection to iterate over.
	     * @param {Function} iteratee - A function to apply to each value in `obj`.
	     * The iteratee is passed a `callback(err, transformed)` which must be called
	     * once it has completed with an error (which can be `null`) and a
	     * transformed value. Invoked with (value, key, callback).
	     * @param {Function} [callback] - A callback which is called when all `iteratee`
	     * functions have finished, or an error occurs. Result is an object of the
	     * transformed values from the `obj`. Invoked with (err, result).
	     */
	    var mapValuesSeries = doLimit(mapValuesLimit, 1);

	    function has(obj, key) {
	        return key in obj;
	    }

	    /**
	     * Caches the results of an `async` function. When creating a hash to store
	     * function results against, the callback is omitted from the hash and an
	     * optional hash function can be used.
	     *
	     * If no hash function is specified, the first argument is used as a hash key,
	     * which may work reasonably if it is a string or a data type that converts to a
	     * distinct string. Note that objects and arrays will not behave reasonably.
	     * Neither will cases where the other arguments are significant. In such cases,
	     * specify your own hash function.
	     *
	     * The cache of results is exposed as the `memo` property of the function
	     * returned by `memoize`.
	     *
	     * @name memoize
	     * @static
	     * @memberOf module:Utils
	     * @method
	     * @category Util
	     * @param {Function} fn - The function to proxy and cache results from.
	     * @param {Function} hasher - An optional function for generating a custom hash
	     * for storing results. It has all the arguments applied to it apart from the
	     * callback, and must be synchronous.
	     * @returns {Function} a memoized version of `fn`
	     * @example
	     *
	     * var slow_fn = function(name, callback) {
	     *     // do something
	     *     callback(null, result);
	     * };
	     * var fn = async.memoize(slow_fn);
	     *
	     * // fn can now be used as if it were slow_fn
	     * fn('some name', function() {
	     *     // callback
	     * });
	     */
	    function memoize(fn, hasher) {
	        var memo = Object.create(null);
	        var queues = Object.create(null);
	        hasher = hasher || identity;
	        var memoized = initialParams(function memoized(args, callback) {
	            var key = hasher.apply(null, args);
	            if (has(memo, key)) {
	                setImmediate$1(function () {
	                    callback.apply(null, memo[key]);
	                });
	            } else if (has(queues, key)) {
	                queues[key].push(callback);
	            } else {
	                queues[key] = [callback];
	                fn.apply(null, args.concat([rest(function (args) {
	                    memo[key] = args;
	                    var q = queues[key];
	                    delete queues[key];
	                    for (var i = 0, l = q.length; i < l; i++) {
	                        q[i].apply(null, args);
	                    }
	                })]));
	            }
	        });
	        memoized.memo = memo;
	        memoized.unmemoized = fn;
	        return memoized;
	    }

	    /**
	     * Calls `callback` on a later loop around the event loop. In Node.js this just
	     * calls `setImmediate`.  In the browser it will use `setImmediate` if
	     * available, otherwise `setTimeout(callback, 0)`, which means other higher
	     * priority events may precede the execution of `callback`.
	     *
	     * This is used internally for browser-compatibility purposes.
	     *
	     * @name nextTick
	     * @static
	     * @memberOf module:Utils
	     * @method
	     * @alias setImmediate
	     * @category Util
	     * @param {Function} callback - The function to call on a later loop around
	     * the event loop. Invoked with (args...).
	     * @param {...*} args... - any number of additional arguments to pass to the
	     * callback on the next tick.
	     * @example
	     *
	     * var call_order = [];
	     * async.nextTick(function() {
	     *     call_order.push('two');
	     *     // call_order now equals ['one','two']
	     * });
	     * call_order.push('one');
	     *
	     * async.setImmediate(function (a, b, c) {
	     *     // a, b, and c equal 1, 2, and 3
	     * }, 1, 2, 3);
	     */
	    var _defer$1;

	    if (hasNextTick) {
	        _defer$1 = process.nextTick;
	    } else if (hasSetImmediate) {
	        _defer$1 = setImmediate;
	    } else {
	        _defer$1 = fallback;
	    }

	    var nextTick = wrap(_defer$1);

	    function _parallel(eachfn, tasks, callback) {
	        callback = callback || noop;
	        var results = isArrayLike(tasks) ? [] : {};

	        eachfn(tasks, function (task, key, callback) {
	            task(rest(function (err, args) {
	                if (args.length <= 1) {
	                    args = args[0];
	                }
	                results[key] = args;
	                callback(err);
	            }));
	        }, function (err) {
	            callback(err, results);
	        });
	    }

	    /**
	     * Run the `tasks` collection of functions in parallel, without waiting until
	     * the previous function has completed. If any of the functions pass an error to
	     * its callback, the main `callback` is immediately called with the value of the
	     * error. Once the `tasks` have completed, the results are passed to the final
	     * `callback` as an array.
	     *
	     * **Note:** `parallel` is about kicking-off I/O tasks in parallel, not about
	     * parallel execution of code.  If your tasks do not use any timers or perform
	     * any I/O, they will actually be executed in series.  Any synchronous setup
	     * sections for each task will happen one after the other.  JavaScript remains
	     * single-threaded.
	     *
	     * It is also possible to use an object instead of an array. Each property will
	     * be run as a function and the results will be passed to the final `callback`
	     * as an object instead of an array. This can be a more readable way of handling
	     * results from {@link async.parallel}.
	     *
	     * @name parallel
	     * @static
	     * @memberOf module:ControlFlow
	     * @method
	     * @category Control Flow
	     * @param {Array|Iterable|Object} tasks - A collection containing functions to run.
	     * Each function is passed a `callback(err, result)` which it must call on
	     * completion with an error `err` (which can be `null`) and an optional `result`
	     * value.
	     * @param {Function} [callback] - An optional callback to run once all the
	     * functions have completed successfully. This function gets a results array
	     * (or object) containing all the result arguments passed to the task callbacks.
	     * Invoked with (err, results).
	     * @example
	     * async.parallel([
	     *     function(callback) {
	     *         setTimeout(function() {
	     *             callback(null, 'one');
	     *         }, 200);
	     *     },
	     *     function(callback) {
	     *         setTimeout(function() {
	     *             callback(null, 'two');
	     *         }, 100);
	     *     }
	     * ],
	     * // optional callback
	     * function(err, results) {
	     *     // the results array will equal ['one','two'] even though
	     *     // the second function had a shorter timeout.
	     * });
	     *
	     * // an example using an object instead of an array
	     * async.parallel({
	     *     one: function(callback) {
	     *         setTimeout(function() {
	     *             callback(null, 1);
	     *         }, 200);
	     *     },
	     *     two: function(callback) {
	     *         setTimeout(function() {
	     *             callback(null, 2);
	     *         }, 100);
	     *     }
	     * }, function(err, results) {
	     *     // results is now equals to: {one: 1, two: 2}
	     * });
	     */
	    function parallelLimit(tasks, callback) {
	      _parallel(eachOf, tasks, callback);
	    }

	    /**
	     * The same as [`parallel`]{@link module:ControlFlow.parallel} but runs a maximum of `limit` async operations at a
	     * time.
	     *
	     * @name parallelLimit
	     * @static
	     * @memberOf module:ControlFlow
	     * @method
	     * @see [async.parallel]{@link module:ControlFlow.parallel}
	     * @category Control Flow
	     * @param {Array|Collection} tasks - A collection containing functions to run.
	     * Each function is passed a `callback(err, result)` which it must call on
	     * completion with an error `err` (which can be `null`) and an optional `result`
	     * value.
	     * @param {number} limit - The maximum number of async operations at a time.
	     * @param {Function} [callback] - An optional callback to run once all the
	     * functions have completed successfully. This function gets a results array
	     * (or object) containing all the result arguments passed to the task callbacks.
	     * Invoked with (err, results).
	     */
	    function parallelLimit$1(tasks, limit, callback) {
	      _parallel(_eachOfLimit(limit), tasks, callback);
	    }

	    /**
	     * A queue of tasks for the worker function to complete.
	     * @typedef {Object} QueueObject
	     * @memberOf module:ControlFlow
	     * @property {Function} length - a function returning the number of items
	     * waiting to be processed. Invoke with `queue.length()`.
	     * @property {boolean} started - a boolean indicating whether or not any
	     * items have been pushed and processed by the queue.
	     * @property {Function} running - a function returning the number of items
	     * currently being processed. Invoke with `queue.running()`.
	     * @property {Function} workersList - a function returning the array of items
	     * currently being processed. Invoke with `queue.workersList()`.
	     * @property {Function} idle - a function returning false if there are items
	     * waiting or being processed, or true if not. Invoke with `queue.idle()`.
	     * @property {number} concurrency - an integer for determining how many `worker`
	     * functions should be run in parallel. This property can be changed after a
	     * `queue` is created to alter the concurrency on-the-fly.
	     * @property {Function} push - add a new task to the `queue`. Calls `callback`
	     * once the `worker` has finished processing the task. Instead of a single task,
	     * a `tasks` array can be submitted. The respective callback is used for every
	     * task in the list. Invoke with `queue.push(task, [callback])`,
	     * @property {Function} unshift - add a new task to the front of the `queue`.
	     * Invoke with `queue.unshift(task, [callback])`.
	     * @property {Function} saturated - a callback that is called when the number of
	     * running workers hits the `concurrency` limit, and further tasks will be
	     * queued.
	     * @property {Function} unsaturated - a callback that is called when the number
	     * of running workers is less than the `concurrency` & `buffer` limits, and
	     * further tasks will not be queued.
	     * @property {number} buffer - A minimum threshold buffer in order to say that
	     * the `queue` is `unsaturated`.
	     * @property {Function} empty - a callback that is called when the last item
	     * from the `queue` is given to a `worker`.
	     * @property {Function} drain - a callback that is called when the last item
	     * from the `queue` has returned from the `worker`.
	     * @property {Function} error - a callback that is called when a task errors.
	     * Has the signature `function(error, task)`.
	     * @property {boolean} paused - a boolean for determining whether the queue is
	     * in a paused state.
	     * @property {Function} pause - a function that pauses the processing of tasks
	     * until `resume()` is called. Invoke with `queue.pause()`.
	     * @property {Function} resume - a function that resumes the processing of
	     * queued tasks when the queue is paused. Invoke with `queue.resume()`.
	     * @property {Function} kill - a function that removes the `drain` callback and
	     * empties remaining tasks from the queue forcing it to go idle. Invoke with `queue.kill()`.
	     */

	    /**
	     * Creates a `queue` object with the specified `concurrency`. Tasks added to the
	     * `queue` are processed in parallel (up to the `concurrency` limit). If all
	     * `worker`s are in progress, the task is queued until one becomes available.
	     * Once a `worker` completes a `task`, that `task`'s callback is called.
	     *
	     * @name queue
	     * @static
	     * @memberOf module:ControlFlow
	     * @method
	     * @category Control Flow
	     * @param {Function} worker - An asynchronous function for processing a queued
	     * task, which must call its `callback(err)` argument when finished, with an
	     * optional `error` as an argument.  If you want to handle errors from an
	     * individual task, pass a callback to `q.push()`. Invoked with
	     * (task, callback).
	     * @param {number} [concurrency=1] - An `integer` for determining how many
	     * `worker` functions should be run in parallel.  If omitted, the concurrency
	     * defaults to `1`.  If the concurrency is `0`, an error is thrown.
	     * @returns {module:ControlFlow.QueueObject} A queue object to manage the tasks. Callbacks can
	     * attached as certain properties to listen for specific events during the
	     * lifecycle of the queue.
	     * @example
	     *
	     * // create a queue object with concurrency 2
	     * var q = async.queue(function(task, callback) {
	     *     console.log('hello ' + task.name);
	     *     callback();
	     * }, 2);
	     *
	     * // assign a callback
	     * q.drain = function() {
	     *     console.log('all items have been processed');
	     * };
	     *
	     * // add some items to the queue
	     * q.push({name: 'foo'}, function(err) {
	     *     console.log('finished processing foo');
	     * });
	     * q.push({name: 'bar'}, function (err) {
	     *     console.log('finished processing bar');
	     * });
	     *
	     * // add some items to the queue (batch-wise)
	     * q.push([{name: 'baz'},{name: 'bay'},{name: 'bax'}], function(err) {
	     *     console.log('finished processing item');
	     * });
	     *
	     * // add some items to the front of the queue
	     * q.unshift({name: 'bar'}, function (err) {
	     *     console.log('finished processing bar');
	     * });
	     */
	    function queue$1 (worker, concurrency) {
	      return queue(function (items, cb) {
	        worker(items[0], cb);
	      }, concurrency, 1);
	    }

	    /**
	     * The same as [async.queue]{@link module:ControlFlow.queue} only tasks are assigned a priority and
	     * completed in ascending priority order.
	     *
	     * @name priorityQueue
	     * @static
	     * @memberOf module:ControlFlow
	     * @method
	     * @see [async.queue]{@link module:ControlFlow.queue}
	     * @category Control Flow
	     * @param {Function} worker - An asynchronous function for processing a queued
	     * task, which must call its `callback(err)` argument when finished, with an
	     * optional `error` as an argument.  If you want to handle errors from an
	     * individual task, pass a callback to `q.push()`. Invoked with
	     * (task, callback).
	     * @param {number} concurrency - An `integer` for determining how many `worker`
	     * functions should be run in parallel.  If omitted, the concurrency defaults to
	     * `1`.  If the concurrency is `0`, an error is thrown.
	     * @returns {module:ControlFlow.QueueObject} A priorityQueue object to manage the tasks. There are two
	     * differences between `queue` and `priorityQueue` objects:
	     * * `push(task, priority, [callback])` - `priority` should be a number. If an
	     *   array of `tasks` is given, all tasks will be assigned the same priority.
	     * * The `unshift` method was removed.
	     */
	    function priorityQueue (worker, concurrency) {
	        // Start with a normal queue
	        var q = queue$1(worker, concurrency);

	        // Override push to accept second parameter representing priority
	        q.push = function (data, priority, callback) {
	            if (callback == null) callback = noop;
	            if (typeof callback !== 'function') {
	                throw new Error('task callback must be a function');
	            }
	            q.started = true;
	            if (!isArray(data)) {
	                data = [data];
	            }
	            if (data.length === 0) {
	                // call drain immediately if there are no tasks
	                return setImmediate$1(function () {
	                    q.drain();
	                });
	            }

	            priority = priority || 0;
	            var nextNode = q._tasks.head;
	            while (nextNode && priority >= nextNode.priority) {
	                nextNode = nextNode.next;
	            }

	            arrayEach(data, function (task) {
	                var item = {
	                    data: task,
	                    priority: priority,
	                    callback: callback
	                };

	                if (nextNode) {
	                    q._tasks.insertBefore(nextNode, item);
	                } else {
	                    q._tasks.push(item);
	                }
	            });
	            setImmediate$1(q.process);
	        };

	        // Remove unshift function
	        delete q.unshift;

	        return q;
	    }

	    /**
	     * Runs the `tasks` array of functions in parallel, without waiting until the
	     * previous function has completed. Once any the `tasks` completed or pass an
	     * error to its callback, the main `callback` is immediately called. It's
	     * equivalent to `Promise.race()`.
	     *
	     * @name race
	     * @static
	     * @memberOf module:ControlFlow
	     * @method
	     * @category Control Flow
	     * @param {Array} tasks - An array containing functions to run. Each function
	     * is passed a `callback(err, result)` which it must call on completion with an
	     * error `err` (which can be `null`) and an optional `result` value.
	     * @param {Function} callback - A callback to run once any of the functions have
	     * completed. This function gets an error or result from the first function that
	     * completed. Invoked with (err, result).
	     * @returns undefined
	     * @example
	     *
	     * async.race([
	     *     function(callback) {
	     *         setTimeout(function() {
	     *             callback(null, 'one');
	     *         }, 200);
	     *     },
	     *     function(callback) {
	     *         setTimeout(function() {
	     *             callback(null, 'two');
	     *         }, 100);
	     *     }
	     * ],
	     * // main callback
	     * function(err, result) {
	     *     // the result will be equal to 'two' as it finishes earlier
	     * });
	     */
	    function race(tasks, callback) {
	        callback = once(callback || noop);
	        if (!isArray(tasks)) return callback(new TypeError('First argument to race must be an array of functions'));
	        if (!tasks.length) return callback();
	        arrayEach(tasks, function (task) {
	            task(callback);
	        });
	    }

	    var slice = Array.prototype.slice;

	    /**
	     * Same as [`reduce`]{@link module:Collections.reduce}, only operates on `array` in reverse order.
	     *
	     * @name reduceRight
	     * @static
	     * @memberOf module:Collections
	     * @method
	     * @see [async.reduce]{@link module:Collections.reduce}
	     * @alias foldr
	     * @category Collection
	     * @param {Array} array - A collection to iterate over.
	     * @param {*} memo - The initial state of the reduction.
	     * @param {Function} iteratee - A function applied to each item in the
	     * array to produce the next step in the reduction. The `iteratee` is passed a
	     * `callback(err, reduction)` which accepts an optional error as its first
	     * argument, and the state of the reduction as the second. If an error is
	     * passed to the callback, the reduction is stopped and the main `callback` is
	     * immediately called with the error. Invoked with (memo, item, callback).
	     * @param {Function} [callback] - A callback which is called after all the
	     * `iteratee` functions have finished. Result is the reduced value. Invoked with
	     * (err, result).
	     */
	    function reduceRight(array, memo, iteratee, callback) {
	      var reversed = slice.call(array).reverse();
	      reduce(reversed, memo, iteratee, callback);
	    }

	    /**
	     * Wraps the function in another function that always returns data even when it
	     * errors.
	     *
	     * The object returned has either the property `error` or `value`.
	     *
	     * @name reflect
	     * @static
	     * @memberOf module:Utils
	     * @method
	     * @category Util
	     * @param {Function} fn - The function you want to wrap
	     * @returns {Function} - A function that always passes null to it's callback as
	     * the error. The second argument to the callback will be an `object` with
	     * either an `error` or a `value` property.
	     * @example
	     *
	     * async.parallel([
	     *     async.reflect(function(callback) {
	     *         // do some stuff ...
	     *         callback(null, 'one');
	     *     }),
	     *     async.reflect(function(callback) {
	     *         // do some more stuff but error ...
	     *         callback('bad stuff happened');
	     *     }),
	     *     async.reflect(function(callback) {
	     *         // do some more stuff ...
	     *         callback(null, 'two');
	     *     })
	     * ],
	     * // optional callback
	     * function(err, results) {
	     *     // values
	     *     // results[0].value = 'one'
	     *     // results[1].error = 'bad stuff happened'
	     *     // results[2].value = 'two'
	     * });
	     */
	    function reflect(fn) {
	        return initialParams(function reflectOn(args, reflectCallback) {
	            args.push(rest(function callback(err, cbArgs) {
	                if (err) {
	                    reflectCallback(null, {
	                        error: err
	                    });
	                } else {
	                    var value = null;
	                    if (cbArgs.length === 1) {
	                        value = cbArgs[0];
	                    } else if (cbArgs.length > 1) {
	                        value = cbArgs;
	                    }
	                    reflectCallback(null, {
	                        value: value
	                    });
	                }
	            }));

	            return fn.apply(this, args);
	        });
	    }

	    function reject$1(eachfn, arr, iteratee, callback) {
	        _filter(eachfn, arr, function (value, cb) {
	            iteratee(value, function (err, v) {
	                if (err) {
	                    cb(err);
	                } else {
	                    cb(null, !v);
	                }
	            });
	        }, callback);
	    }

	    /**
	     * The opposite of [`filter`]{@link module:Collections.filter}. Removes values that pass an `async` truth test.
	     *
	     * @name reject
	     * @static
	     * @memberOf module:Collections
	     * @method
	     * @see [async.filter]{@link module:Collections.filter}
	     * @category Collection
	     * @param {Array|Iterable|Object} coll - A collection to iterate over.
	     * @param {Function} iteratee - A truth test to apply to each item in `coll`.
	     * The `iteratee` is passed a `callback(err, truthValue)`, which must be called
	     * with a boolean argument once it has completed. Invoked with (item, callback).
	     * @param {Function} [callback] - A callback which is called after all the
	     * `iteratee` functions have finished. Invoked with (err, results).
	     * @example
	     *
	     * async.reject(['file1','file2','file3'], function(filePath, callback) {
	     *     fs.access(filePath, function(err) {
	     *         callback(null, !err)
	     *     });
	     * }, function(err, results) {
	     *     // results now equals an array of missing files
	     *     createFiles(results);
	     * });
	     */
	    var reject = doParallel(reject$1);

	    /**
	     * A helper function that wraps an array or an object of functions with reflect.
	     *
	     * @name reflectAll
	     * @static
	     * @memberOf module:Utils
	     * @method
	     * @see [async.reflect]{@link module:Utils.reflect}
	     * @category Util
	     * @param {Array} tasks - The array of functions to wrap in `async.reflect`.
	     * @returns {Array} Returns an array of functions, each function wrapped in
	     * `async.reflect`
	     * @example
	     *
	     * let tasks = [
	     *     function(callback) {
	     *         setTimeout(function() {
	     *             callback(null, 'one');
	     *         }, 200);
	     *     },
	     *     function(callback) {
	     *         // do some more stuff but error ...
	     *         callback(new Error('bad stuff happened'));
	     *     },
	     *     function(callback) {
	     *         setTimeout(function() {
	     *             callback(null, 'two');
	     *         }, 100);
	     *     }
	     * ];
	     *
	     * async.parallel(async.reflectAll(tasks),
	     * // optional callback
	     * function(err, results) {
	     *     // values
	     *     // results[0].value = 'one'
	     *     // results[1].error = Error('bad stuff happened')
	     *     // results[2].value = 'two'
	     * });
	     *
	     * // an example using an object instead of an array
	     * let tasks = {
	     *     one: function(callback) {
	     *         setTimeout(function() {
	     *             callback(null, 'one');
	     *         }, 200);
	     *     },
	     *     two: function(callback) {
	     *         callback('two');
	     *     },
	     *     three: function(callback) {
	     *         setTimeout(function() {
	     *             callback(null, 'three');
	     *         }, 100);
	     *     }
	     * };
	     *
	     * async.parallel(async.reflectAll(tasks),
	     * // optional callback
	     * function(err, results) {
	     *     // values
	     *     // results.one.value = 'one'
	     *     // results.two.error = 'two'
	     *     // results.three.value = 'three'
	     * });
	     */
	    function reflectAll(tasks) {
	        var results;
	        if (isArray(tasks)) {
	            results = arrayMap(tasks, reflect);
	        } else {
	            results = {};
	            baseForOwn(tasks, function (task, key) {
	                results[key] = reflect.call(this, task);
	            });
	        }
	        return results;
	    }

	    /**
	     * The same as [`reject`]{@link module:Collections.reject} but runs a maximum of `limit` async operations at a
	     * time.
	     *
	     * @name rejectLimit
	     * @static
	     * @memberOf module:Collections
	     * @method
	     * @see [async.reject]{@link module:Collections.reject}
	     * @category Collection
	     * @param {Array|Iterable|Object} coll - A collection to iterate over.
	     * @param {number} limit - The maximum number of async operations at a time.
	     * @param {Function} iteratee - A truth test to apply to each item in `coll`.
	     * The `iteratee` is passed a `callback(err, truthValue)`, which must be called
	     * with a boolean argument once it has completed. Invoked with (item, callback).
	     * @param {Function} [callback] - A callback which is called after all the
	     * `iteratee` functions have finished. Invoked with (err, results).
	     */
	    var rejectLimit = doParallelLimit(reject$1);

	    /**
	     * The same as [`reject`]{@link module:Collections.reject} but runs only a single async operation at a time.
	     *
	     * @name rejectSeries
	     * @static
	     * @memberOf module:Collections
	     * @method
	     * @see [async.reject]{@link module:Collections.reject}
	     * @category Collection
	     * @param {Array|Iterable|Object} coll - A collection to iterate over.
	     * @param {Function} iteratee - A truth test to apply to each item in `coll`.
	     * The `iteratee` is passed a `callback(err, truthValue)`, which must be called
	     * with a boolean argument once it has completed. Invoked with (item, callback).
	     * @param {Function} [callback] - A callback which is called after all the
	     * `iteratee` functions have finished. Invoked with (err, results).
	     */
	    var rejectSeries = doLimit(rejectLimit, 1);

	    /**
	     * Creates a function that returns `value`.
	     *
	     * @static
	     * @memberOf _
	     * @since 2.4.0
	     * @category Util
	     * @param {*} value The value to return from the new function.
	     * @returns {Function} Returns the new constant function.
	     * @example
	     *
	     * var objects = _.times(2, _.constant({ 'a': 1 }));
	     *
	     * console.log(objects);
	     * // => [{ 'a': 1 }, { 'a': 1 }]
	     *
	     * console.log(objects[0] === objects[1]);
	     * // => true
	     */
	    function constant$1(value) {
	      return function() {
	        return value;
	      };
	    }

	    /**
	     * Attempts to get a successful response from `task` no more than `times` times
	     * before returning an error. If the task is successful, the `callback` will be
	     * passed the result of the successful task. If all attempts fail, the callback
	     * will be passed the error and result (if any) of the final attempt.
	     *
	     * @name retry
	     * @static
	     * @memberOf module:ControlFlow
	     * @method
	     * @category Control Flow
	     * @param {Object|number} [opts = {times: 5, interval: 0}| 5] - Can be either an
	     * object with `times` and `interval` or a number.
	     * * `times` - The number of attempts to make before giving up.  The default
	     *   is `5`.
	     * * `interval` - The time to wait between retries, in milliseconds.  The
	     *   default is `0`. The interval may also be specified as a function of the
	     *   retry count (see example).
	     * * If `opts` is a number, the number specifies the number of times to retry,
	     *   with the default interval of `0`.
	     * @param {Function} task - A function which receives two arguments: (1) a
	     * `callback(err, result)` which must be called when finished, passing `err`
	     * (which can be `null`) and the `result` of the function's execution, and (2)
	     * a `results` object, containing the results of the previously executed
	     * functions (if nested inside another control flow). Invoked with
	     * (callback, results).
	     * @param {Function} [callback] - An optional callback which is called when the
	     * task has succeeded, or after the final failed attempt. It receives the `err`
	     * and `result` arguments of the last attempt at completing the `task`. Invoked
	     * with (err, results).
	     * @example
	     *
	     * // The `retry` function can be used as a stand-alone control flow by passing
	     * // a callback, as shown below:
	     *
	     * // try calling apiMethod 3 times
	     * async.retry(3, apiMethod, function(err, result) {
	     *     // do something with the result
	     * });
	     *
	     * // try calling apiMethod 3 times, waiting 200 ms between each retry
	     * async.retry({times: 3, interval: 200}, apiMethod, function(err, result) {
	     *     // do something with the result
	     * });
	     *
	     * // try calling apiMethod 10 times with exponential backoff
	     * // (i.e. intervals of 100, 200, 400, 800, 1600, ... milliseconds)
	     * async.retry({
	     *   times: 10,
	     *   interval: function(retryCount) {
	     *     return 50 * Math.pow(2, retryCount);
	     *   }
	     * }, apiMethod, function(err, result) {
	     *     // do something with the result
	     * });
	     *
	     * // try calling apiMethod the default 5 times no delay between each retry
	     * async.retry(apiMethod, function(err, result) {
	     *     // do something with the result
	     * });
	     *
	     * // It can also be embedded within other control flow functions to retry
	     * // individual methods that are not as reliable, like this:
	     * async.auto({
	     *     users: api.getUsers.bind(api),
	     *     payments: async.retry(3, api.getPayments.bind(api))
	     * }, function(err, results) {
	     *     // do something with the results
	     * });
	     */
	    function retry(opts, task, callback) {
	        var DEFAULT_TIMES = 5;
	        var DEFAULT_INTERVAL = 0;

	        var options = {
	            times: DEFAULT_TIMES,
	            intervalFunc: constant$1(DEFAULT_INTERVAL)
	        };

	        function parseTimes(acc, t) {
	            if (typeof t === 'object') {
	                acc.times = +t.times || DEFAULT_TIMES;

	                acc.intervalFunc = typeof t.interval === 'function' ? t.interval : constant$1(+t.interval || DEFAULT_INTERVAL);
	            } else if (typeof t === 'number' || typeof t === 'string') {
	                acc.times = +t || DEFAULT_TIMES;
	            } else {
	                throw new Error("Invalid arguments for async.retry");
	            }
	        }

	        if (arguments.length < 3 && typeof opts === 'function') {
	            callback = task || noop;
	            task = opts;
	        } else {
	            parseTimes(options, opts);
	            callback = callback || noop;
	        }

	        if (typeof task !== 'function') {
	            throw new Error("Invalid arguments for async.retry");
	        }

	        var attempt = 1;
	        function retryAttempt() {
	            task(function (err) {
	                if (err && attempt++ < options.times) {
	                    setTimeout(retryAttempt, options.intervalFunc(attempt));
	                } else {
	                    callback.apply(null, arguments);
	                }
	            });
	        }

	        retryAttempt();
	    }

	    /**
	     * A close relative of [`retry`]{@link module:ControlFlow.retry}.  This method wraps a task and makes it
	     * retryable, rather than immediately calling it with retries.
	     *
	     * @name retryable
	     * @static
	     * @memberOf module:ControlFlow
	     * @method
	     * @see [async.retry]{@link module:ControlFlow.retry}
	     * @category Control Flow
	     * @param {Object|number} [opts = {times: 5, interval: 0}| 5] - optional
	     * options, exactly the same as from `retry`
	     * @param {Function} task - the asynchronous function to wrap
	     * @returns {Functions} The wrapped function, which when invoked, will retry on
	     * an error, based on the parameters specified in `opts`.
	     * @example
	     *
	     * async.auto({
	     *     dep1: async.retryable(3, getFromFlakyService),
	     *     process: ["dep1", async.retryable(3, function (results, cb) {
	     *         maybeProcessData(results.dep1, cb);
	     *     })]
	     * }, callback);
	     */
	    function retryable (opts, task) {
	        if (!task) {
	            task = opts;
	            opts = null;
	        }
	        return initialParams(function (args, callback) {
	            function taskFn(cb) {
	                task.apply(null, args.concat([cb]));
	            }

	            if (opts) retry(opts, taskFn, callback);else retry(taskFn, callback);
	        });
	    }

	    /**
	     * Run the functions in the `tasks` collection in series, each one running once
	     * the previous function has completed. If any functions in the series pass an
	     * error to its callback, no more functions are run, and `callback` is
	     * immediately called with the value of the error. Otherwise, `callback`
	     * receives an array of results when `tasks` have completed.
	     *
	     * It is also possible to use an object instead of an array. Each property will
	     * be run as a function, and the results will be passed to the final `callback`
	     * as an object instead of an array. This can be a more readable way of handling
	     *  results from {@link async.series}.
	     *
	     * **Note** that while many implementations preserve the order of object
	     * properties, the [ECMAScript Language Specification](http://www.ecma-international.org/ecma-262/5.1/#sec-8.6)
	     * explicitly states that
	     *
	     * > The mechanics and order of enumerating the properties is not specified.
	     *
	     * So if you rely on the order in which your series of functions are executed,
	     * and want this to work on all platforms, consider using an array.
	     *
	     * @name series
	     * @static
	     * @memberOf module:ControlFlow
	     * @method
	     * @category Control Flow
	     * @param {Array|Iterable|Object} tasks - A collection containing functions to run, each
	     * function is passed a `callback(err, result)` it must call on completion with
	     * an error `err` (which can be `null`) and an optional `result` value.
	     * @param {Function} [callback] - An optional callback to run once all the
	     * functions have completed. This function gets a results array (or object)
	     * containing all the result arguments passed to the `task` callbacks. Invoked
	     * with (err, result).
	     * @example
	     * async.series([
	     *     function(callback) {
	     *         // do some stuff ...
	     *         callback(null, 'one');
	     *     },
	     *     function(callback) {
	     *         // do some more stuff ...
	     *         callback(null, 'two');
	     *     }
	     * ],
	     * // optional callback
	     * function(err, results) {
	     *     // results is now equal to ['one', 'two']
	     * });
	     *
	     * async.series({
	     *     one: function(callback) {
	     *         setTimeout(function() {
	     *             callback(null, 1);
	     *         }, 200);
	     *     },
	     *     two: function(callback){
	     *         setTimeout(function() {
	     *             callback(null, 2);
	     *         }, 100);
	     *     }
	     * }, function(err, results) {
	     *     // results is now equal to: {one: 1, two: 2}
	     * });
	     */
	    function series(tasks, callback) {
	      _parallel(eachOfSeries, tasks, callback);
	    }

	    /**
	     * Returns `true` if at least one element in the `coll` satisfies an async test.
	     * If any iteratee call returns `true`, the main `callback` is immediately
	     * called.
	     *
	     * @name some
	     * @static
	     * @memberOf module:Collections
	     * @method
	     * @alias any
	     * @category Collection
	     * @param {Array|Iterable|Object} coll - A collection to iterate over.
	     * @param {Function} iteratee - A truth test to apply to each item in the array
	     * in parallel. The iteratee is passed a `callback(err, truthValue)` which must
	     * be called with a boolean argument once it has completed. Invoked with
	     * (item, callback).
	     * @param {Function} [callback] - A callback which is called as soon as any
	     * iteratee returns `true`, or after all the iteratee functions have finished.
	     * Result will be either `true` or `false` depending on the values of the async
	     * tests. Invoked with (err, result).
	     * @example
	     *
	     * async.some(['file1','file2','file3'], function(filePath, callback) {
	     *     fs.access(filePath, function(err) {
	     *         callback(null, !err)
	     *     });
	     * }, function(err, result) {
	     *     // if result is true then at least one of the files exists
	     * });
	     */
	    var some = _createTester(eachOf, Boolean, identity);

	    /**
	     * The same as [`some`]{@link module:Collections.some} but runs a maximum of `limit` async operations at a time.
	     *
	     * @name someLimit
	     * @static
	     * @memberOf module:Collections
	     * @method
	     * @see [async.some]{@link module:Collections.some}
	     * @alias anyLimit
	     * @category Collection
	     * @param {Array|Iterable|Object} coll - A collection to iterate over.
	     * @param {number} limit - The maximum number of async operations at a time.
	     * @param {Function} iteratee - A truth test to apply to each item in the array
	     * in parallel. The iteratee is passed a `callback(err, truthValue)` which must
	     * be called with a boolean argument once it has completed. Invoked with
	     * (item, callback).
	     * @param {Function} [callback] - A callback which is called as soon as any
	     * iteratee returns `true`, or after all the iteratee functions have finished.
	     * Result will be either `true` or `false` depending on the values of the async
	     * tests. Invoked with (err, result).
	     */
	    var someLimit = _createTester(eachOfLimit, Boolean, identity);

	    /**
	     * The same as [`some`]{@link module:Collections.some} but runs only a single async operation at a time.
	     *
	     * @name someSeries
	     * @static
	     * @memberOf module:Collections
	     * @method
	     * @see [async.some]{@link module:Collections.some}
	     * @alias anySeries
	     * @category Collection
	     * @param {Array|Iterable|Object} coll - A collection to iterate over.
	     * @param {Function} iteratee - A truth test to apply to each item in the array
	     * in parallel. The iteratee is passed a `callback(err, truthValue)` which must
	     * be called with a boolean argument once it has completed. Invoked with
	     * (item, callback).
	     * @param {Function} [callback] - A callback which is called as soon as any
	     * iteratee returns `true`, or after all the iteratee functions have finished.
	     * Result will be either `true` or `false` depending on the values of the async
	     * tests. Invoked with (err, result).
	     */
	    var someSeries = doLimit(someLimit, 1);

	    /**
	     * Sorts a list by the results of running each `coll` value through an async
	     * `iteratee`.
	     *
	     * @name sortBy
	     * @static
	     * @memberOf module:Collections
	     * @method
	     * @category Collection
	     * @param {Array|Iterable|Object} coll - A collection to iterate over.
	     * @param {Function} iteratee - A function to apply to each item in `coll`.
	     * The iteratee is passed a `callback(err, sortValue)` which must be called once
	     * it has completed with an error (which can be `null`) and a value to use as
	     * the sort criteria. Invoked with (item, callback).
	     * @param {Function} callback - A callback which is called after all the
	     * `iteratee` functions have finished, or an error occurs. Results is the items
	     * from the original `coll` sorted by the values returned by the `iteratee`
	     * calls. Invoked with (err, results).
	     * @example
	     *
	     * async.sortBy(['file1','file2','file3'], function(file, callback) {
	     *     fs.stat(file, function(err, stats) {
	     *         callback(err, stats.mtime);
	     *     });
	     * }, function(err, results) {
	     *     // results is now the original array of files sorted by
	     *     // modified date
	     * });
	     *
	     * // By modifying the callback parameter the
	     * // sorting order can be influenced:
	     *
	     * // ascending order
	     * async.sortBy([1,9,3,5], function(x, callback) {
	     *     callback(null, x);
	     * }, function(err,result) {
	     *     // result callback
	     * });
	     *
	     * // descending order
	     * async.sortBy([1,9,3,5], function(x, callback) {
	     *     callback(null, x*-1);    //<- x*-1 instead of x, turns the order around
	     * }, function(err,result) {
	     *     // result callback
	     * });
	     */
	    function sortBy(coll, iteratee, callback) {
	        map(coll, function (x, callback) {
	            iteratee(x, function (err, criteria) {
	                if (err) return callback(err);
	                callback(null, { value: x, criteria: criteria });
	            });
	        }, function (err, results) {
	            if (err) return callback(err);
	            callback(null, arrayMap(results.sort(comparator), baseProperty('value')));
	        });

	        function comparator(left, right) {
	            var a = left.criteria,
	                b = right.criteria;
	            return a < b ? -1 : a > b ? 1 : 0;
	        }
	    }

	    /**
	     * Sets a time limit on an asynchronous function. If the function does not call
	     * its callback within the specified milliseconds, it will be called with a
	     * timeout error. The code property for the error object will be `'ETIMEDOUT'`.
	     *
	     * @name timeout
	     * @static
	     * @memberOf module:Utils
	     * @method
	     * @category Util
	     * @param {Function} asyncFn - The asynchronous function you want to set the
	     * time limit.
	     * @param {number} milliseconds - The specified time limit.
	     * @param {*} [info] - Any variable you want attached (`string`, `object`, etc)
	     * to timeout Error for more information..
	     * @returns {Function} Returns a wrapped function that can be used with any of
	     * the control flow functions.
	     * @example
	     *
	     * async.timeout(function(callback) {
	     *     doAsyncTask(callback);
	     * }, 1000);
	     */
	    function timeout(asyncFn, milliseconds, info) {
	        var originalCallback, timer;
	        var timedOut = false;

	        function injectedCallback() {
	            if (!timedOut) {
	                originalCallback.apply(null, arguments);
	                clearTimeout(timer);
	            }
	        }

	        function timeoutCallback() {
	            var name = asyncFn.name || 'anonymous';
	            var error = new Error('Callback function "' + name + '" timed out.');
	            error.code = 'ETIMEDOUT';
	            if (info) {
	                error.info = info;
	            }
	            timedOut = true;
	            originalCallback(error);
	        }

	        return initialParams(function (args, origCallback) {
	            originalCallback = origCallback;
	            // setup timer and call original function
	            timer = setTimeout(timeoutCallback, milliseconds);
	            asyncFn.apply(null, args.concat(injectedCallback));
	        });
	    }

	    /* Built-in method references for those with the same name as other `lodash` methods. */
	    var nativeCeil = Math.ceil;
	    var nativeMax$1 = Math.max;
	    /**
	     * The base implementation of `_.range` and `_.rangeRight` which doesn't
	     * coerce arguments to numbers.
	     *
	     * @private
	     * @param {number} start The start of the range.
	     * @param {number} end The end of the range.
	     * @param {number} step The value to increment or decrement by.
	     * @param {boolean} [fromRight] Specify iterating from right to left.
	     * @returns {Array} Returns the range of numbers.
	     */
	    function baseRange(start, end, step, fromRight) {
	      var index = -1,
	          length = nativeMax$1(nativeCeil((end - start) / (step || 1)), 0),
	          result = Array(length);

	      while (length--) {
	        result[fromRight ? length : ++index] = start;
	        start += step;
	      }
	      return result;
	    }

	    /**
	     * The same as [times]{@link module:ControlFlow.times} but runs a maximum of `limit` async operations at a
	     * time.
	     *
	     * @name timesLimit
	     * @static
	     * @memberOf module:ControlFlow
	     * @method
	     * @see [async.times]{@link module:ControlFlow.times}
	     * @category Control Flow
	     * @param {number} count - The number of times to run the function.
	     * @param {number} limit - The maximum number of async operations at a time.
	     * @param {Function} iteratee - The function to call `n` times. Invoked with the
	     * iteration index and a callback (n, next).
	     * @param {Function} callback - see [async.map]{@link module:Collections.map}.
	     */
	    function timeLimit(count, limit, iteratee, callback) {
	      mapLimit(baseRange(0, count, 1), limit, iteratee, callback);
	    }

	    /**
	     * Calls the `iteratee` function `n` times, and accumulates results in the same
	     * manner you would use with [map]{@link module:Collections.map}.
	     *
	     * @name times
	     * @static
	     * @memberOf module:ControlFlow
	     * @method
	     * @see [async.map]{@link module:Collections.map}
	     * @category Control Flow
	     * @param {number} n - The number of times to run the function.
	     * @param {Function} iteratee - The function to call `n` times. Invoked with the
	     * iteration index and a callback (n, next).
	     * @param {Function} callback - see {@link module:Collections.map}.
	     * @example
	     *
	     * // Pretend this is some complicated async factory
	     * var createUser = function(id, callback) {
	     *     callback(null, {
	     *         id: 'user' + id
	     *     });
	     * };
	     *
	     * // generate 5 users
	     * async.times(5, function(n, next) {
	     *     createUser(n, function(err, user) {
	     *         next(err, user);
	     *     });
	     * }, function(err, users) {
	     *     // we should now have 5 users
	     * });
	     */
	    var times = doLimit(timeLimit, Infinity);

	    /**
	     * The same as [times]{@link module:ControlFlow.times} but runs only a single async operation at a time.
	     *
	     * @name timesSeries
	     * @static
	     * @memberOf module:ControlFlow
	     * @method
	     * @see [async.times]{@link module:ControlFlow.times}
	     * @category Control Flow
	     * @param {number} n - The number of times to run the function.
	     * @param {Function} iteratee - The function to call `n` times. Invoked with the
	     * iteration index and a callback (n, next).
	     * @param {Function} callback - see {@link module:Collections.map}.
	     */
	    var timesSeries = doLimit(timeLimit, 1);

	    /**
	     * A relative of `reduce`.  Takes an Object or Array, and iterates over each
	     * element in series, each step potentially mutating an `accumulator` value.
	     * The type of the accumulator defaults to the type of collection passed in.
	     *
	     * @name transform
	     * @static
	     * @memberOf module:Collections
	     * @method
	     * @category Collection
	     * @param {Array|Iterable|Object} coll - A collection to iterate over.
	     * @param {*} [accumulator] - The initial state of the transform.  If omitted,
	     * it will default to an empty Object or Array, depending on the type of `coll`
	     * @param {Function} iteratee - A function applied to each item in the
	     * collection that potentially modifies the accumulator. The `iteratee` is
	     * passed a `callback(err)` which accepts an optional error as its first
	     * argument. If an error is passed to the callback, the transform is stopped
	     * and the main `callback` is immediately called with the error.
	     * Invoked with (accumulator, item, key, callback).
	     * @param {Function} [callback] - A callback which is called after all the
	     * `iteratee` functions have finished. Result is the transformed accumulator.
	     * Invoked with (err, result).
	     * @example
	     *
	     * async.transform([1,2,3], function(acc, item, index, callback) {
	     *     // pointless async:
	     *     process.nextTick(function() {
	     *         acc.push(item * 2)
	     *         callback(null)
	     *     });
	     * }, function(err, result) {
	     *     // result is now equal to [2, 4, 6]
	     * });
	     *
	     * @example
	     *
	     * async.transform({a: 1, b: 2, c: 3}, function (obj, val, key, callback) {
	     *     setImmediate(function () {
	     *         obj[key] = val * 2;
	     *         callback();
	     *     })
	     * }, function (err, result) {
	     *     // result is equal to {a: 2, b: 4, c: 6}
	     * })
	     */
	    function transform(coll, accumulator, iteratee, callback) {
	        if (arguments.length === 3) {
	            callback = iteratee;
	            iteratee = accumulator;
	            accumulator = isArray(coll) ? [] : {};
	        }
	        callback = once(callback || noop);

	        eachOf(coll, function (v, k, cb) {
	            iteratee(accumulator, v, k, cb);
	        }, function (err) {
	            callback(err, accumulator);
	        });
	    }

	    /**
	     * Undoes a [memoize]{@link module:Utils.memoize}d function, reverting it to the original,
	     * unmemoized form. Handy for testing.
	     *
	     * @name unmemoize
	     * @static
	     * @memberOf module:Utils
	     * @method
	     * @see [async.memoize]{@link module:Utils.memoize}
	     * @category Util
	     * @param {Function} fn - the memoized function
	     * @returns {Function} a function that calls the original unmemoized function
	     */
	    function unmemoize(fn) {
	        return function () {
	            return (fn.unmemoized || fn).apply(null, arguments);
	        };
	    }

	    /**
	     * Repeatedly call `fn`, while `test` returns `true`. Calls `callback` when
	     * stopped, or an error occurs.
	     *
	     * @name whilst
	     * @static
	     * @memberOf module:ControlFlow
	     * @method
	     * @category Control Flow
	     * @param {Function} test - synchronous truth test to perform before each
	     * execution of `fn`. Invoked with ().
	     * @param {Function} iteratee - A function which is called each time `test` passes.
	     * The function is passed a `callback(err)`, which must be called once it has
	     * completed with an optional `err` argument. Invoked with (callback).
	     * @param {Function} [callback] - A callback which is called after the test
	     * function has failed and repeated execution of `fn` has stopped. `callback`
	     * will be passed an error and any arguments passed to the final `fn`'s
	     * callback. Invoked with (err, [results]);
	     * @returns undefined
	     * @example
	     *
	     * var count = 0;
	     * async.whilst(
	     *     function() { return count < 5; },
	     *     function(callback) {
	     *         count++;
	     *         setTimeout(function() {
	     *             callback(null, count);
	     *         }, 1000);
	     *     },
	     *     function (err, n) {
	     *         // 5 seconds have passed, n = 5
	     *     }
	     * );
	     */
	    function whilst(test, iteratee, callback) {
	        callback = onlyOnce(callback || noop);
	        if (!test()) return callback(null);
	        var next = rest(function (err, args) {
	            if (err) return callback(err);
	            if (test()) return iteratee(next);
	            callback.apply(null, [null].concat(args));
	        });
	        iteratee(next);
	    }

	    /**
	     * Repeatedly call `fn` until `test` returns `true`. Calls `callback` when
	     * stopped, or an error occurs. `callback` will be passed an error and any
	     * arguments passed to the final `fn`'s callback.
	     *
	     * The inverse of [whilst]{@link module:ControlFlow.whilst}.
	     *
	     * @name until
	     * @static
	     * @memberOf module:ControlFlow
	     * @method
	     * @see [async.whilst]{@link module:ControlFlow.whilst}
	     * @category Control Flow
	     * @param {Function} test - synchronous truth test to perform before each
	     * execution of `fn`. Invoked with ().
	     * @param {Function} fn - A function which is called each time `test` fails.
	     * The function is passed a `callback(err)`, which must be called once it has
	     * completed with an optional `err` argument. Invoked with (callback).
	     * @param {Function} [callback] - A callback which is called after the test
	     * function has passed and repeated execution of `fn` has stopped. `callback`
	     * will be passed an error and any arguments passed to the final `fn`'s
	     * callback. Invoked with (err, [results]);
	     */
	    function until(test, fn, callback) {
	        whilst(function () {
	            return !test.apply(this, arguments);
	        }, fn, callback);
	    }

	    /**
	     * Runs the `tasks` array of functions in series, each passing their results to
	     * the next in the array. However, if any of the `tasks` pass an error to their
	     * own callback, the next function is not executed, and the main `callback` is
	     * immediately called with the error.
	     *
	     * @name waterfall
	     * @static
	     * @memberOf module:ControlFlow
	     * @method
	     * @category Control Flow
	     * @param {Array} tasks - An array of functions to run, each function is passed
	     * a `callback(err, result1, result2, ...)` it must call on completion. The
	     * first argument is an error (which can be `null`) and any further arguments
	     * will be passed as arguments in order to the next task.
	     * @param {Function} [callback] - An optional callback to run once all the
	     * functions have completed. This will be passed the results of the last task's
	     * callback. Invoked with (err, [results]).
	     * @returns undefined
	     * @example
	     *
	     * async.waterfall([
	     *     function(callback) {
	     *         callback(null, 'one', 'two');
	     *     },
	     *     function(arg1, arg2, callback) {
	     *         // arg1 now equals 'one' and arg2 now equals 'two'
	     *         callback(null, 'three');
	     *     },
	     *     function(arg1, callback) {
	     *         // arg1 now equals 'three'
	     *         callback(null, 'done');
	     *     }
	     * ], function (err, result) {
	     *     // result now equals 'done'
	     * });
	     *
	     * // Or, with named functions:
	     * async.waterfall([
	     *     myFirstFunction,
	     *     mySecondFunction,
	     *     myLastFunction,
	     * ], function (err, result) {
	     *     // result now equals 'done'
	     * });
	     * function myFirstFunction(callback) {
	     *     callback(null, 'one', 'two');
	     * }
	     * function mySecondFunction(arg1, arg2, callback) {
	     *     // arg1 now equals 'one' and arg2 now equals 'two'
	     *     callback(null, 'three');
	     * }
	     * function myLastFunction(arg1, callback) {
	     *     // arg1 now equals 'three'
	     *     callback(null, 'done');
	     * }
	     */
	    function waterfall (tasks, callback) {
	        callback = once(callback || noop);
	        if (!isArray(tasks)) return callback(new Error('First argument to waterfall must be an array of functions'));
	        if (!tasks.length) return callback();
	        var taskIndex = 0;

	        function nextTask(args) {
	            if (taskIndex === tasks.length) {
	                return callback.apply(null, [null].concat(args));
	            }

	            var taskCallback = onlyOnce(rest(function (err, args) {
	                if (err) {
	                    return callback.apply(null, [err].concat(args));
	                }
	                nextTask(args);
	            }));

	            args.push(taskCallback);

	            var task = tasks[taskIndex++];
	            task.apply(null, args);
	        }

	        nextTask([]);
	    }

	    var index = {
	      applyEach: applyEach,
	      applyEachSeries: applyEachSeries,
	      apply: apply$1,
	      asyncify: asyncify,
	      auto: auto,
	      autoInject: autoInject,
	      cargo: cargo,
	      compose: compose,
	      concat: concat,
	      concatSeries: concatSeries,
	      constant: constant,
	      detect: detect,
	      detectLimit: detectLimit,
	      detectSeries: detectSeries,
	      dir: dir,
	      doDuring: doDuring,
	      doUntil: doUntil,
	      doWhilst: doWhilst,
	      during: during,
	      each: eachLimit,
	      eachLimit: eachLimit$1,
	      eachOf: eachOf,
	      eachOfLimit: eachOfLimit,
	      eachOfSeries: eachOfSeries,
	      eachSeries: eachSeries,
	      ensureAsync: ensureAsync,
	      every: every,
	      everyLimit: everyLimit,
	      everySeries: everySeries,
	      filter: filter,
	      filterLimit: filterLimit,
	      filterSeries: filterSeries,
	      forever: forever,
	      log: log,
	      map: map,
	      mapLimit: mapLimit,
	      mapSeries: mapSeries,
	      mapValues: mapValues,
	      mapValuesLimit: mapValuesLimit,
	      mapValuesSeries: mapValuesSeries,
	      memoize: memoize,
	      nextTick: nextTick,
	      parallel: parallelLimit,
	      parallelLimit: parallelLimit$1,
	      priorityQueue: priorityQueue,
	      queue: queue$1,
	      race: race,
	      reduce: reduce,
	      reduceRight: reduceRight,
	      reflect: reflect,
	      reflectAll: reflectAll,
	      reject: reject,
	      rejectLimit: rejectLimit,
	      rejectSeries: rejectSeries,
	      retry: retry,
	      retryable: retryable,
	      seq: seq,
	      series: series,
	      setImmediate: setImmediate$1,
	      some: some,
	      someLimit: someLimit,
	      someSeries: someSeries,
	      sortBy: sortBy,
	      timeout: timeout,
	      times: times,
	      timesLimit: timeLimit,
	      timesSeries: timesSeries,
	      transform: transform,
	      unmemoize: unmemoize,
	      until: until,
	      waterfall: waterfall,
	      whilst: whilst,

	      // aliases
	      all: every,
	      any: some,
	      forEach: eachLimit,
	      forEachSeries: eachSeries,
	      forEachLimit: eachLimit$1,
	      forEachOf: eachOf,
	      forEachOfSeries: eachOfSeries,
	      forEachOfLimit: eachOfLimit,
	      inject: reduce,
	      foldl: reduce,
	      foldr: reduceRight,
	      select: filter,
	      selectLimit: filterLimit,
	      selectSeries: filterSeries,
	      wrapSync: asyncify
	    };

	    exports['default'] = index;
	    exports.applyEach = applyEach;
	    exports.applyEachSeries = applyEachSeries;
	    exports.apply = apply$1;
	    exports.asyncify = asyncify;
	    exports.auto = auto;
	    exports.autoInject = autoInject;
	    exports.cargo = cargo;
	    exports.compose = compose;
	    exports.concat = concat;
	    exports.concatSeries = concatSeries;
	    exports.constant = constant;
	    exports.detect = detect;
	    exports.detectLimit = detectLimit;
	    exports.detectSeries = detectSeries;
	    exports.dir = dir;
	    exports.doDuring = doDuring;
	    exports.doUntil = doUntil;
	    exports.doWhilst = doWhilst;
	    exports.during = during;
	    exports.each = eachLimit;
	    exports.eachLimit = eachLimit$1;
	    exports.eachOf = eachOf;
	    exports.eachOfLimit = eachOfLimit;
	    exports.eachOfSeries = eachOfSeries;
	    exports.eachSeries = eachSeries;
	    exports.ensureAsync = ensureAsync;
	    exports.every = every;
	    exports.everyLimit = everyLimit;
	    exports.everySeries = everySeries;
	    exports.filter = filter;
	    exports.filterLimit = filterLimit;
	    exports.filterSeries = filterSeries;
	    exports.forever = forever;
	    exports.log = log;
	    exports.map = map;
	    exports.mapLimit = mapLimit;
	    exports.mapSeries = mapSeries;
	    exports.mapValues = mapValues;
	    exports.mapValuesLimit = mapValuesLimit;
	    exports.mapValuesSeries = mapValuesSeries;
	    exports.memoize = memoize;
	    exports.nextTick = nextTick;
	    exports.parallel = parallelLimit;
	    exports.parallelLimit = parallelLimit$1;
	    exports.priorityQueue = priorityQueue;
	    exports.queue = queue$1;
	    exports.race = race;
	    exports.reduce = reduce;
	    exports.reduceRight = reduceRight;
	    exports.reflect = reflect;
	    exports.reflectAll = reflectAll;
	    exports.reject = reject;
	    exports.rejectLimit = rejectLimit;
	    exports.rejectSeries = rejectSeries;
	    exports.retry = retry;
	    exports.retryable = retryable;
	    exports.seq = seq;
	    exports.series = series;
	    exports.setImmediate = setImmediate$1;
	    exports.some = some;
	    exports.someLimit = someLimit;
	    exports.someSeries = someSeries;
	    exports.sortBy = sortBy;
	    exports.timeout = timeout;
	    exports.times = times;
	    exports.timesLimit = timeLimit;
	    exports.timesSeries = timesSeries;
	    exports.transform = transform;
	    exports.unmemoize = unmemoize;
	    exports.until = until;
	    exports.waterfall = waterfall;
	    exports.whilst = whilst;
	    exports.all = every;
	    exports.allLimit = everyLimit;
	    exports.allSeries = everySeries;
	    exports.any = some;
	    exports.anyLimit = someLimit;
	    exports.anySeries = someSeries;
	    exports.find = detect;
	    exports.findLimit = detectLimit;
	    exports.findSeries = detectSeries;
	    exports.forEach = eachLimit;
	    exports.forEachSeries = eachSeries;
	    exports.forEachLimit = eachLimit$1;
	    exports.forEachOf = eachOf;
	    exports.forEachOfSeries = eachOfSeries;
	    exports.forEachOfLimit = eachOfLimit;
	    exports.inject = reduce;
	    exports.foldl = reduce;
	    exports.foldr = reduceRight;
	    exports.select = filter;
	    exports.selectLimit = filterLimit;
	    exports.selectSeries = filterSeries;
	    exports.wrapSync = asyncify;

	}));
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(18).setImmediate, __webpack_require__(16)))

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(setImmediate, clearImmediate) {var nextTick = __webpack_require__(16).nextTick;
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
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(18).setImmediate, __webpack_require__(18).clearImmediate))

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	var path = __webpack_require__(15);
	var async = __webpack_require__(17);

	var regex = __webpack_require__(7);
	var helper = __webpack_require__(1);

	var resolve = function (variable, ast, callback) {

	    if(variable.type)
	        return callback(null, variable);

	    if(ast.loc)
	        variable.loc = ast.loc + "." + variable.key
	    else
	        variable.loc = variable.key

	    if (!variable.val) {
	        variable.val = null;
	        variable.type = 'null';
	        return callback(null, variable);
	    }

	    if (variable.val.match(regex.REGEX_STRING)) {
	        variable.val = variable.val.match(regex.REGEX_STRING)[1];
	        variable.type = 'string';
	        return callback(null, variable);
	    }

	    variable.val.replace(regex.REGEX_KEYVALUE, function (found, key, val) {

	        variable = variable || {};
	        variable.variables = variable.variables || [];

	        var key = key.match(regex.REGEX_STRING)[1];

	        if (val === "null") {
	            variable.variables.push({
	                type:'null',
	                key: key,
	                val: null,
	                loc: ast.loc + "." + key
	            });
	            return found;
	        }

	        if (val.match(regex.REGEX_STRING)) {
	            var val = val.match(regex.REGEX_STRING)[1];
	            variable.variables.push({
	                type:'string',
	                key: key,
	                val: val,
	                loc: variable.loc + "." + key
	            });
	            return found;
	        }



	        var res = helper.queryAst(ast, val);
	        variable.variables.push({
	            type:'ref',
	            key: key,
	            val: val,
	            loc: variable.loc + "." + key,
	            link: res
	        });

	        return found;

	    });

	    callback(null, variable)
	};

	module.exports = resolve;

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	var path = __webpack_require__(15);
	var async = __webpack_require__(17);

	var regex = __webpack_require__(7);
	var helper = __webpack_require__(1);

	var render = function (ast, callback, editor) {

	    var exec = {};


	    ast.text.replace(regex.REGEX_INJECT, function (found, enter, prefix, key) {

	        exec[key] = function (callback) {

	            var res = helper.queryAst(ast, key) || {};

	            if (res.text) {
	                return render(res, function (ast, text) {
	                    callback(null, text)
	                });
	            }

	            var text = null;

	            if (editor)
	                text = "<cmacc-variable ref='" + res.loc + "'>" + (res.val || "!!" + key + "!!") + "</cmacc-variable>";
	            else
	                text = res.val || found;

	            callback(null, text);

	        };
	        return found;

	    });

	    async.series(exec, function (err, res) {


	        var text = ast.text.replace(regex.REGEX_INJECT, function (found, enter, prefix, key) {
	            var inject = res[key];

	            if (prefix)
	                inject = inject.replace(/^/gm, prefix);

	            return enter + inject;
	        });

	        if (editor) {
	            text = text.replace(/^(.*)$/gm, function (found) {

	                return found.replace(/^(\s*)((?:\>\s)|(?:\d\.\s))?(.*)$/, function (r, space, pre, cont) {
	                    if (cont)
	                        return (space || '') +
	                            (pre || '') +
	                            "<cmacc-section file='" +
	                            ast.file +
	                            "'>" + cont.trim() +
	                            "</cmacc-section>" +
	                            (cont.match(/(\ \ )?$/)[1] ? '  ' : '');
	                    else
	                        return ''
	                });
	            });
	        }

	        callback(null, text)
	    });


	};

	module.exports = render;

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/**
	 * marked - a markdown parser
	 * Copyright (c) 2011-2014, Christopher Jeffrey. (MIT Licensed)
	 * https://github.com/chjj/marked
	 */

	;(function() {

	/**
	 * Block-Level Grammar
	 */

	var block = {
	  newline: /^\n+/,
	  code: /^( {4}[^\n]+\n*)+/,
	  fences: noop,
	  hr: /^( *[-*_]){3,} *(?:\n+|$)/,
	  heading: /^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/,
	  nptable: noop,
	  lheading: /^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/,
	  blockquote: /^( *>[^\n]+(\n(?!def)[^\n]+)*\n*)+/,
	  list: /^( *)(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,
	  html: /^ *(?:comment *(?:\n|\s*$)|closed *(?:\n{2,}|\s*$)|closing *(?:\n{2,}|\s*$))/,
	  def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n+|$)/,
	  table: noop,
	  paragraph: /^((?:[^\n]+\n?(?!hr|heading|lheading|blockquote|tag|def))+)\n*/,
	  text: /^[^\n]+/
	};

	block.bullet = /(?:[*+-]|\d+\.)/;
	block.item = /^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/;
	block.item = replace(block.item, 'gm')
	  (/bull/g, block.bullet)
	  ();

	block.list = replace(block.list)
	  (/bull/g, block.bullet)
	  ('hr', '\\n+(?=\\1?(?:[-*_] *){3,}(?:\\n+|$))')
	  ('def', '\\n+(?=' + block.def.source + ')')
	  ();

	block.blockquote = replace(block.blockquote)
	  ('def', block.def)
	  ();

	block._tag = '(?!(?:'
	  + 'a|em|strong|small|s|cite|q|dfn|abbr|data|time|code'
	  + '|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo'
	  + '|span|br|wbr|ins|del|img)\\b)\\w+(?!:/|[^\\w\\s@]*@)\\b';

	block.html = replace(block.html)
	  ('comment', /<!--[\s\S]*?-->/)
	  ('closed', /<(tag)[\s\S]+?<\/\1>/)
	  ('closing', /<tag(?:"[^"]*"|'[^']*'|[^'">])*?>/)
	  (/tag/g, block._tag)
	  ();

	block.paragraph = replace(block.paragraph)
	  ('hr', block.hr)
	  ('heading', block.heading)
	  ('lheading', block.lheading)
	  ('blockquote', block.blockquote)
	  ('tag', '<' + block._tag)
	  ('def', block.def)
	  ();

	/**
	 * Normal Block Grammar
	 */

	block.normal = merge({}, block);

	/**
	 * GFM Block Grammar
	 */

	block.gfm = merge({}, block.normal, {
	  fences: /^ *(`{3,}|~{3,})[ \.]*(\S+)? *\n([\s\S]*?)\s*\1 *(?:\n+|$)/,
	  paragraph: /^/,
	  heading: /^ *(#{1,6}) +([^\n]+?) *#* *(?:\n+|$)/
	});

	block.gfm.paragraph = replace(block.paragraph)
	  ('(?!', '(?!'
	    + block.gfm.fences.source.replace('\\1', '\\2') + '|'
	    + block.list.source.replace('\\1', '\\3') + '|')
	  ();

	/**
	 * GFM + Tables Block Grammar
	 */

	block.tables = merge({}, block.gfm, {
	  nptable: /^ *(\S.*\|.*)\n *([-:]+ *\|[-| :]*)\n((?:.*\|.*(?:\n|$))*)\n*/,
	  table: /^ *\|(.+)\n *\|( *[-:]+[-| :]*)\n((?: *\|.*(?:\n|$))*)\n*/
	});

	/**
	 * Block Lexer
	 */

	function Lexer(options) {
	  this.tokens = [];
	  this.tokens.links = {};
	  this.options = options || marked.defaults;
	  this.rules = block.normal;

	  if (this.options.gfm) {
	    if (this.options.tables) {
	      this.rules = block.tables;
	    } else {
	      this.rules = block.gfm;
	    }
	  }
	}

	/**
	 * Expose Block Rules
	 */

	Lexer.rules = block;

	/**
	 * Static Lex Method
	 */

	Lexer.lex = function(src, options) {
	  var lexer = new Lexer(options);
	  return lexer.lex(src);
	};

	/**
	 * Preprocessing
	 */

	Lexer.prototype.lex = function(src) {
	  src = src
	    .replace(/\r\n|\r/g, '\n')
	    .replace(/\t/g, '    ')
	    .replace(/\u00a0/g, ' ')
	    .replace(/\u2424/g, '\n');

	  return this.token(src, true);
	};

	/**
	 * Lexing
	 */

	Lexer.prototype.token = function(src, top, bq) {
	  var src = src.replace(/^ +$/gm, '')
	    , next
	    , loose
	    , cap
	    , bull
	    , b
	    , item
	    , space
	    , i
	    , l;

	  while (src) {
	    // newline
	    if (cap = this.rules.newline.exec(src)) {
	      src = src.substring(cap[0].length);
	      if (cap[0].length > 1) {
	        this.tokens.push({
	          type: 'space'
	        });
	      }
	    }

	    // code
	    if (cap = this.rules.code.exec(src)) {
	      src = src.substring(cap[0].length);
	      cap = cap[0].replace(/^ {4}/gm, '');
	      this.tokens.push({
	        type: 'code',
	        text: !this.options.pedantic
	          ? cap.replace(/\n+$/, '')
	          : cap
	      });
	      continue;
	    }

	    // fences (gfm)
	    if (cap = this.rules.fences.exec(src)) {
	      src = src.substring(cap[0].length);
	      this.tokens.push({
	        type: 'code',
	        lang: cap[2],
	        text: cap[3] || ''
	      });
	      continue;
	    }

	    // heading
	    if (cap = this.rules.heading.exec(src)) {
	      src = src.substring(cap[0].length);
	      this.tokens.push({
	        type: 'heading',
	        depth: cap[1].length,
	        text: cap[2]
	      });
	      continue;
	    }

	    // table no leading pipe (gfm)
	    if (top && (cap = this.rules.nptable.exec(src))) {
	      src = src.substring(cap[0].length);

	      item = {
	        type: 'table',
	        header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
	        align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
	        cells: cap[3].replace(/\n$/, '').split('\n')
	      };

	      for (i = 0; i < item.align.length; i++) {
	        if (/^ *-+: *$/.test(item.align[i])) {
	          item.align[i] = 'right';
	        } else if (/^ *:-+: *$/.test(item.align[i])) {
	          item.align[i] = 'center';
	        } else if (/^ *:-+ *$/.test(item.align[i])) {
	          item.align[i] = 'left';
	        } else {
	          item.align[i] = null;
	        }
	      }

	      for (i = 0; i < item.cells.length; i++) {
	        item.cells[i] = item.cells[i].split(/ *\| */);
	      }

	      this.tokens.push(item);

	      continue;
	    }

	    // lheading
	    if (cap = this.rules.lheading.exec(src)) {
	      src = src.substring(cap[0].length);
	      this.tokens.push({
	        type: 'heading',
	        depth: cap[2] === '=' ? 1 : 2,
	        text: cap[1]
	      });
	      continue;
	    }

	    // hr
	    if (cap = this.rules.hr.exec(src)) {
	      src = src.substring(cap[0].length);
	      this.tokens.push({
	        type: 'hr'
	      });
	      continue;
	    }

	    // blockquote
	    if (cap = this.rules.blockquote.exec(src)) {
	      src = src.substring(cap[0].length);

	      this.tokens.push({
	        type: 'blockquote_start'
	      });

	      cap = cap[0].replace(/^ *> ?/gm, '');

	      // Pass `top` to keep the current
	      // "toplevel" state. This is exactly
	      // how markdown.pl works.
	      this.token(cap, top, true);

	      this.tokens.push({
	        type: 'blockquote_end'
	      });

	      continue;
	    }

	    // list
	    if (cap = this.rules.list.exec(src)) {
	      src = src.substring(cap[0].length);
	      bull = cap[2];

	      this.tokens.push({
	        type: 'list_start',
	        ordered: bull.length > 1
	      });

	      // Get each top-level item.
	      cap = cap[0].match(this.rules.item);

	      next = false;
	      l = cap.length;
	      i = 0;

	      for (; i < l; i++) {
	        item = cap[i];

	        // Remove the list item's bullet
	        // so it is seen as the next token.
	        space = item.length;
	        item = item.replace(/^ *([*+-]|\d+\.) +/, '');

	        // Outdent whatever the
	        // list item contains. Hacky.
	        if (~item.indexOf('\n ')) {
	          space -= item.length;
	          item = !this.options.pedantic
	            ? item.replace(new RegExp('^ {1,' + space + '}', 'gm'), '')
	            : item.replace(/^ {1,4}/gm, '');
	        }

	        // Determine whether the next list item belongs here.
	        // Backpedal if it does not belong in this list.
	        if (this.options.smartLists && i !== l - 1) {
	          b = block.bullet.exec(cap[i + 1])[0];
	          if (bull !== b && !(bull.length > 1 && b.length > 1)) {
	            src = cap.slice(i + 1).join('\n') + src;
	            i = l - 1;
	          }
	        }

	        // Determine whether item is loose or not.
	        // Use: /(^|\n)(?! )[^\n]+\n\n(?!\s*$)/
	        // for discount behavior.
	        loose = next || /\n\n(?!\s*$)/.test(item);
	        if (i !== l - 1) {
	          next = item.charAt(item.length - 1) === '\n';
	          if (!loose) loose = next;
	        }

	        this.tokens.push({
	          type: loose
	            ? 'loose_item_start'
	            : 'list_item_start'
	        });

	        // Recurse.
	        this.token(item, false, bq);

	        this.tokens.push({
	          type: 'list_item_end'
	        });
	      }

	      this.tokens.push({
	        type: 'list_end'
	      });

	      continue;
	    }

	    // html
	    if (cap = this.rules.html.exec(src)) {
	      src = src.substring(cap[0].length);
	      this.tokens.push({
	        type: this.options.sanitize
	          ? 'paragraph'
	          : 'html',
	        pre: !this.options.sanitizer
	          && (cap[1] === 'pre' || cap[1] === 'script' || cap[1] === 'style'),
	        text: cap[0]
	      });
	      continue;
	    }

	    // def
	    if ((!bq && top) && (cap = this.rules.def.exec(src))) {
	      src = src.substring(cap[0].length);
	      this.tokens.links[cap[1].toLowerCase()] = {
	        href: cap[2],
	        title: cap[3]
	      };
	      continue;
	    }

	    // table (gfm)
	    if (top && (cap = this.rules.table.exec(src))) {
	      src = src.substring(cap[0].length);

	      item = {
	        type: 'table',
	        header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
	        align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
	        cells: cap[3].replace(/(?: *\| *)?\n$/, '').split('\n')
	      };

	      for (i = 0; i < item.align.length; i++) {
	        if (/^ *-+: *$/.test(item.align[i])) {
	          item.align[i] = 'right';
	        } else if (/^ *:-+: *$/.test(item.align[i])) {
	          item.align[i] = 'center';
	        } else if (/^ *:-+ *$/.test(item.align[i])) {
	          item.align[i] = 'left';
	        } else {
	          item.align[i] = null;
	        }
	      }

	      for (i = 0; i < item.cells.length; i++) {
	        item.cells[i] = item.cells[i]
	          .replace(/^ *\| *| *\| *$/g, '')
	          .split(/ *\| */);
	      }

	      this.tokens.push(item);

	      continue;
	    }

	    // top-level paragraph
	    if (top && (cap = this.rules.paragraph.exec(src))) {
	      src = src.substring(cap[0].length);
	      this.tokens.push({
	        type: 'paragraph',
	        text: cap[1].charAt(cap[1].length - 1) === '\n'
	          ? cap[1].slice(0, -1)
	          : cap[1]
	      });
	      continue;
	    }

	    // text
	    if (cap = this.rules.text.exec(src)) {
	      // Top-level should never reach here.
	      src = src.substring(cap[0].length);
	      this.tokens.push({
	        type: 'text',
	        text: cap[0]
	      });
	      continue;
	    }

	    if (src) {
	      throw new
	        Error('Infinite loop on byte: ' + src.charCodeAt(0));
	    }
	  }

	  return this.tokens;
	};

	/**
	 * Inline-Level Grammar
	 */

	var inline = {
	  escape: /^\\([\\`*{}\[\]()#+\-.!_>])/,
	  autolink: /^<([^ >]+(@|:\/)[^ >]+)>/,
	  url: noop,
	  tag: /^<!--[\s\S]*?-->|^<\/?\w+(?:"[^"]*"|'[^']*'|[^'">])*?>/,
	  link: /^!?\[(inside)\]\(href\)/,
	  reflink: /^!?\[(inside)\]\s*\[([^\]]*)\]/,
	  nolink: /^!?\[((?:\[[^\]]*\]|[^\[\]])*)\]/,
	  strong: /^__([\s\S]+?)__(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/,
	  em: /^\b_((?:[^_]|__)+?)_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/,
	  code: /^(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/,
	  br: /^ {2,}\n(?!\s*$)/,
	  del: noop,
	  text: /^[\s\S]+?(?=[\\<!\[_*`]| {2,}\n|$)/
	};

	inline._inside = /(?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*/;
	inline._href = /\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*/;

	inline.link = replace(inline.link)
	  ('inside', inline._inside)
	  ('href', inline._href)
	  ();

	inline.reflink = replace(inline.reflink)
	  ('inside', inline._inside)
	  ();

	/**
	 * Normal Inline Grammar
	 */

	inline.normal = merge({}, inline);

	/**
	 * Pedantic Inline Grammar
	 */

	inline.pedantic = merge({}, inline.normal, {
	  strong: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
	  em: /^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/
	});

	/**
	 * GFM Inline Grammar
	 */

	inline.gfm = merge({}, inline.normal, {
	  escape: replace(inline.escape)('])', '~|])')(),
	  url: /^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/,
	  del: /^~~(?=\S)([\s\S]*?\S)~~/,
	  text: replace(inline.text)
	    (']|', '~]|')
	    ('|', '|https?://|')
	    ()
	});

	/**
	 * GFM + Line Breaks Inline Grammar
	 */

	inline.breaks = merge({}, inline.gfm, {
	  br: replace(inline.br)('{2,}', '*')(),
	  text: replace(inline.gfm.text)('{2,}', '*')()
	});

	/**
	 * Inline Lexer & Compiler
	 */

	function InlineLexer(links, options) {
	  this.options = options || marked.defaults;
	  this.links = links;
	  this.rules = inline.normal;
	  this.renderer = this.options.renderer || new Renderer;
	  this.renderer.options = this.options;

	  if (!this.links) {
	    throw new
	      Error('Tokens array requires a `links` property.');
	  }

	  if (this.options.gfm) {
	    if (this.options.breaks) {
	      this.rules = inline.breaks;
	    } else {
	      this.rules = inline.gfm;
	    }
	  } else if (this.options.pedantic) {
	    this.rules = inline.pedantic;
	  }
	}

	/**
	 * Expose Inline Rules
	 */

	InlineLexer.rules = inline;

	/**
	 * Static Lexing/Compiling Method
	 */

	InlineLexer.output = function(src, links, options) {
	  var inline = new InlineLexer(links, options);
	  return inline.output(src);
	};

	/**
	 * Lexing/Compiling
	 */

	InlineLexer.prototype.output = function(src) {
	  var out = ''
	    , link
	    , text
	    , href
	    , cap;

	  while (src) {
	    // escape
	    if (cap = this.rules.escape.exec(src)) {
	      src = src.substring(cap[0].length);
	      out += cap[1];
	      continue;
	    }

	    // autolink
	    if (cap = this.rules.autolink.exec(src)) {
	      src = src.substring(cap[0].length);
	      if (cap[2] === '@') {
	        text = cap[1].charAt(6) === ':'
	          ? this.mangle(cap[1].substring(7))
	          : this.mangle(cap[1]);
	        href = this.mangle('mailto:') + text;
	      } else {
	        text = escape(cap[1]);
	        href = text;
	      }
	      out += this.renderer.link(href, null, text);
	      continue;
	    }

	    // url (gfm)
	    if (!this.inLink && (cap = this.rules.url.exec(src))) {
	      src = src.substring(cap[0].length);
	      text = escape(cap[1]);
	      href = text;
	      out += this.renderer.link(href, null, text);
	      continue;
	    }

	    // tag
	    if (cap = this.rules.tag.exec(src)) {
	      if (!this.inLink && /^<a /i.test(cap[0])) {
	        this.inLink = true;
	      } else if (this.inLink && /^<\/a>/i.test(cap[0])) {
	        this.inLink = false;
	      }
	      src = src.substring(cap[0].length);
	      out += this.options.sanitize
	        ? this.options.sanitizer
	          ? this.options.sanitizer(cap[0])
	          : escape(cap[0])
	        : cap[0]
	      continue;
	    }

	    // link
	    if (cap = this.rules.link.exec(src)) {
	      src = src.substring(cap[0].length);
	      this.inLink = true;
	      out += this.outputLink(cap, {
	        href: cap[2],
	        title: cap[3]
	      });
	      this.inLink = false;
	      continue;
	    }

	    // reflink, nolink
	    if ((cap = this.rules.reflink.exec(src))
	        || (cap = this.rules.nolink.exec(src))) {
	      src = src.substring(cap[0].length);
	      link = (cap[2] || cap[1]).replace(/\s+/g, ' ');
	      link = this.links[link.toLowerCase()];
	      if (!link || !link.href) {
	        out += cap[0].charAt(0);
	        src = cap[0].substring(1) + src;
	        continue;
	      }
	      this.inLink = true;
	      out += this.outputLink(cap, link);
	      this.inLink = false;
	      continue;
	    }

	    // strong
	    if (cap = this.rules.strong.exec(src)) {
	      src = src.substring(cap[0].length);
	      out += this.renderer.strong(this.output(cap[2] || cap[1]));
	      continue;
	    }

	    // em
	    if (cap = this.rules.em.exec(src)) {
	      src = src.substring(cap[0].length);
	      out += this.renderer.em(this.output(cap[2] || cap[1]));
	      continue;
	    }

	    // code
	    if (cap = this.rules.code.exec(src)) {
	      src = src.substring(cap[0].length);
	      out += this.renderer.codespan(escape(cap[2], true));
	      continue;
	    }

	    // br
	    if (cap = this.rules.br.exec(src)) {
	      src = src.substring(cap[0].length);
	      out += this.renderer.br();
	      continue;
	    }

	    // del (gfm)
	    if (cap = this.rules.del.exec(src)) {
	      src = src.substring(cap[0].length);
	      out += this.renderer.del(this.output(cap[1]));
	      continue;
	    }

	    // text
	    if (cap = this.rules.text.exec(src)) {
	      src = src.substring(cap[0].length);
	      out += this.renderer.text(escape(this.smartypants(cap[0])));
	      continue;
	    }

	    if (src) {
	      throw new
	        Error('Infinite loop on byte: ' + src.charCodeAt(0));
	    }
	  }

	  return out;
	};

	/**
	 * Compile Link
	 */

	InlineLexer.prototype.outputLink = function(cap, link) {
	  var href = escape(link.href)
	    , title = link.title ? escape(link.title) : null;

	  return cap[0].charAt(0) !== '!'
	    ? this.renderer.link(href, title, this.output(cap[1]))
	    : this.renderer.image(href, title, escape(cap[1]));
	};

	/**
	 * Smartypants Transformations
	 */

	InlineLexer.prototype.smartypants = function(text) {
	  if (!this.options.smartypants) return text;
	  return text
	    // em-dashes
	    .replace(/---/g, '\u2014')
	    // en-dashes
	    .replace(/--/g, '\u2013')
	    // opening singles
	    .replace(/(^|[-\u2014/(\[{"\s])'/g, '$1\u2018')
	    // closing singles & apostrophes
	    .replace(/'/g, '\u2019')
	    // opening doubles
	    .replace(/(^|[-\u2014/(\[{\u2018\s])"/g, '$1\u201c')
	    // closing doubles
	    .replace(/"/g, '\u201d')
	    // ellipses
	    .replace(/\.{3}/g, '\u2026');
	};

	/**
	 * Mangle Links
	 */

	InlineLexer.prototype.mangle = function(text) {
	  if (!this.options.mangle) return text;
	  var out = ''
	    , l = text.length
	    , i = 0
	    , ch;

	  for (; i < l; i++) {
	    ch = text.charCodeAt(i);
	    if (Math.random() > 0.5) {
	      ch = 'x' + ch.toString(16);
	    }
	    out += '&#' + ch + ';';
	  }

	  return out;
	};

	/**
	 * Renderer
	 */

	function Renderer(options) {
	  this.options = options || {};
	}

	Renderer.prototype.code = function(code, lang, escaped) {
	  if (this.options.highlight) {
	    var out = this.options.highlight(code, lang);
	    if (out != null && out !== code) {
	      escaped = true;
	      code = out;
	    }
	  }

	  if (!lang) {
	    return '<pre><code>'
	      + (escaped ? code : escape(code, true))
	      + '\n</code></pre>';
	  }

	  return '<pre><code class="'
	    + this.options.langPrefix
	    + escape(lang, true)
	    + '">'
	    + (escaped ? code : escape(code, true))
	    + '\n</code></pre>\n';
	};

	Renderer.prototype.blockquote = function(quote) {
	  return '<blockquote>\n' + quote + '</blockquote>\n';
	};

	Renderer.prototype.html = function(html) {
	  return html;
	};

	Renderer.prototype.heading = function(text, level, raw) {
	  return '<h'
	    + level
	    + ' id="'
	    + this.options.headerPrefix
	    + raw.toLowerCase().replace(/[^\w]+/g, '-')
	    + '">'
	    + text
	    + '</h'
	    + level
	    + '>\n';
	};

	Renderer.prototype.hr = function() {
	  return this.options.xhtml ? '<hr/>\n' : '<hr>\n';
	};

	Renderer.prototype.list = function(body, ordered) {
	  var type = ordered ? 'ol' : 'ul';
	  return '<' + type + '>\n' + body + '</' + type + '>\n';
	};

	Renderer.prototype.listitem = function(text) {
	  return '<li>' + text + '</li>\n';
	};

	Renderer.prototype.paragraph = function(text) {
	  return '<p>' + text + '</p>\n';
	};

	Renderer.prototype.table = function(header, body) {
	  return '<table>\n'
	    + '<thead>\n'
	    + header
	    + '</thead>\n'
	    + '<tbody>\n'
	    + body
	    + '</tbody>\n'
	    + '</table>\n';
	};

	Renderer.prototype.tablerow = function(content) {
	  return '<tr>\n' + content + '</tr>\n';
	};

	Renderer.prototype.tablecell = function(content, flags) {
	  var type = flags.header ? 'th' : 'td';
	  var tag = flags.align
	    ? '<' + type + ' style="text-align:' + flags.align + '">'
	    : '<' + type + '>';
	  return tag + content + '</' + type + '>\n';
	};

	// span level renderer
	Renderer.prototype.strong = function(text) {
	  return '<strong>' + text + '</strong>';
	};

	Renderer.prototype.em = function(text) {
	  return '<em>' + text + '</em>';
	};

	Renderer.prototype.codespan = function(text) {
	  return '<code>' + text + '</code>';
	};

	Renderer.prototype.br = function() {
	  return this.options.xhtml ? '<br/>' : '<br>';
	};

	Renderer.prototype.del = function(text) {
	  return '<del>' + text + '</del>';
	};

	Renderer.prototype.link = function(href, title, text) {
	  if (this.options.sanitize) {
	    try {
	      var prot = decodeURIComponent(unescape(href))
	        .replace(/[^\w:]/g, '')
	        .toLowerCase();
	    } catch (e) {
	      return '';
	    }
	    if (prot.indexOf('javascript:') === 0 || prot.indexOf('vbscript:') === 0) {
	      return '';
	    }
	  }
	  var out = '<a href="' + href + '"';
	  if (title) {
	    out += ' title="' + title + '"';
	  }
	  out += '>' + text + '</a>';
	  return out;
	};

	Renderer.prototype.image = function(href, title, text) {
	  var out = '<img src="' + href + '" alt="' + text + '"';
	  if (title) {
	    out += ' title="' + title + '"';
	  }
	  out += this.options.xhtml ? '/>' : '>';
	  return out;
	};

	Renderer.prototype.text = function(text) {
	  return text;
	};

	/**
	 * Parsing & Compiling
	 */

	function Parser(options) {
	  this.tokens = [];
	  this.token = null;
	  this.options = options || marked.defaults;
	  this.options.renderer = this.options.renderer || new Renderer;
	  this.renderer = this.options.renderer;
	  this.renderer.options = this.options;
	}

	/**
	 * Static Parse Method
	 */

	Parser.parse = function(src, options, renderer) {
	  var parser = new Parser(options, renderer);
	  return parser.parse(src);
	};

	/**
	 * Parse Loop
	 */

	Parser.prototype.parse = function(src) {
	  this.inline = new InlineLexer(src.links, this.options, this.renderer);
	  this.tokens = src.reverse();

	  var out = '';
	  while (this.next()) {
	    out += this.tok();
	  }

	  return out;
	};

	/**
	 * Next Token
	 */

	Parser.prototype.next = function() {
	  return this.token = this.tokens.pop();
	};

	/**
	 * Preview Next Token
	 */

	Parser.prototype.peek = function() {
	  return this.tokens[this.tokens.length - 1] || 0;
	};

	/**
	 * Parse Text Tokens
	 */

	Parser.prototype.parseText = function() {
	  var body = this.token.text;

	  while (this.peek().type === 'text') {
	    body += '\n' + this.next().text;
	  }

	  return this.inline.output(body);
	};

	/**
	 * Parse Current Token
	 */

	Parser.prototype.tok = function() {
	  switch (this.token.type) {
	    case 'space': {
	      return '';
	    }
	    case 'hr': {
	      return this.renderer.hr();
	    }
	    case 'heading': {
	      return this.renderer.heading(
	        this.inline.output(this.token.text),
	        this.token.depth,
	        this.token.text);
	    }
	    case 'code': {
	      return this.renderer.code(this.token.text,
	        this.token.lang,
	        this.token.escaped);
	    }
	    case 'table': {
	      var header = ''
	        , body = ''
	        , i
	        , row
	        , cell
	        , flags
	        , j;

	      // header
	      cell = '';
	      for (i = 0; i < this.token.header.length; i++) {
	        flags = { header: true, align: this.token.align[i] };
	        cell += this.renderer.tablecell(
	          this.inline.output(this.token.header[i]),
	          { header: true, align: this.token.align[i] }
	        );
	      }
	      header += this.renderer.tablerow(cell);

	      for (i = 0; i < this.token.cells.length; i++) {
	        row = this.token.cells[i];

	        cell = '';
	        for (j = 0; j < row.length; j++) {
	          cell += this.renderer.tablecell(
	            this.inline.output(row[j]),
	            { header: false, align: this.token.align[j] }
	          );
	        }

	        body += this.renderer.tablerow(cell);
	      }
	      return this.renderer.table(header, body);
	    }
	    case 'blockquote_start': {
	      var body = '';

	      while (this.next().type !== 'blockquote_end') {
	        body += this.tok();
	      }

	      return this.renderer.blockquote(body);
	    }
	    case 'list_start': {
	      var body = ''
	        , ordered = this.token.ordered;

	      while (this.next().type !== 'list_end') {
	        body += this.tok();
	      }

	      return this.renderer.list(body, ordered);
	    }
	    case 'list_item_start': {
	      var body = '';

	      while (this.next().type !== 'list_item_end') {
	        body += this.token.type === 'text'
	          ? this.parseText()
	          : this.tok();
	      }

	      return this.renderer.listitem(body);
	    }
	    case 'loose_item_start': {
	      var body = '';

	      while (this.next().type !== 'list_item_end') {
	        body += this.tok();
	      }

	      return this.renderer.listitem(body);
	    }
	    case 'html': {
	      var html = !this.token.pre && !this.options.pedantic
	        ? this.inline.output(this.token.text)
	        : this.token.text;
	      return this.renderer.html(html);
	    }
	    case 'paragraph': {
	      return this.renderer.paragraph(this.inline.output(this.token.text));
	    }
	    case 'text': {
	      return this.renderer.paragraph(this.parseText());
	    }
	  }
	};

	/**
	 * Helpers
	 */

	function escape(html, encode) {
	  return html
	    .replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;')
	    .replace(/</g, '&lt;')
	    .replace(/>/g, '&gt;')
	    .replace(/"/g, '&quot;')
	    .replace(/'/g, '&#39;');
	}

	function unescape(html) {
	  return html.replace(/&([#\w]+);/g, function(_, n) {
	    n = n.toLowerCase();
	    if (n === 'colon') return ':';
	    if (n.charAt(0) === '#') {
	      return n.charAt(1) === 'x'
	        ? String.fromCharCode(parseInt(n.substring(2), 16))
	        : String.fromCharCode(+n.substring(1));
	    }
	    return '';
	  });
	}

	function replace(regex, opt) {
	  regex = regex.source;
	  opt = opt || '';
	  return function self(name, val) {
	    if (!name) return new RegExp(regex, opt);
	    val = val.source || val;
	    val = val.replace(/(^|[^\[])\^/g, '$1');
	    regex = regex.replace(name, val);
	    return self;
	  };
	}

	function noop() {}
	noop.exec = noop;

	function merge(obj) {
	  var i = 1
	    , target
	    , key;

	  for (; i < arguments.length; i++) {
	    target = arguments[i];
	    for (key in target) {
	      if (Object.prototype.hasOwnProperty.call(target, key)) {
	        obj[key] = target[key];
	      }
	    }
	  }

	  return obj;
	}


	/**
	 * Marked
	 */

	function marked(src, opt, callback) {
	  if (callback || typeof opt === 'function') {
	    if (!callback) {
	      callback = opt;
	      opt = null;
	    }

	    opt = merge({}, marked.defaults, opt || {});

	    var highlight = opt.highlight
	      , tokens
	      , pending
	      , i = 0;

	    try {
	      tokens = Lexer.lex(src, opt)
	    } catch (e) {
	      return callback(e);
	    }

	    pending = tokens.length;

	    var done = function(err) {
	      if (err) {
	        opt.highlight = highlight;
	        return callback(err);
	      }

	      var out;

	      try {
	        out = Parser.parse(tokens, opt);
	      } catch (e) {
	        err = e;
	      }

	      opt.highlight = highlight;

	      return err
	        ? callback(err)
	        : callback(null, out);
	    };

	    if (!highlight || highlight.length < 3) {
	      return done();
	    }

	    delete opt.highlight;

	    if (!pending) return done();

	    for (; i < tokens.length; i++) {
	      (function(token) {
	        if (token.type !== 'code') {
	          return --pending || done();
	        }
	        return highlight(token.text, token.lang, function(err, code) {
	          if (err) return done(err);
	          if (code == null || code === token.text) {
	            return --pending || done();
	          }
	          token.text = code;
	          token.escaped = true;
	          --pending || done();
	        });
	      })(tokens[i]);
	    }

	    return;
	  }
	  try {
	    if (opt) opt = merge({}, marked.defaults, opt);
	    return Parser.parse(Lexer.lex(src, opt), opt);
	  } catch (e) {
	    e.message += '\nPlease report this to https://github.com/chjj/marked.';
	    if ((opt || marked.defaults).silent) {
	      return '<p>An error occured:</p><pre>'
	        + escape(e.message + '', true)
	        + '</pre>';
	    }
	    throw e;
	  }
	}

	/**
	 * Options
	 */

	marked.options =
	marked.setOptions = function(opt) {
	  merge(marked.defaults, opt);
	  return marked;
	};

	marked.defaults = {
	  gfm: true,
	  tables: true,
	  breaks: false,
	  pedantic: false,
	  sanitize: false,
	  sanitizer: null,
	  mangle: true,
	  smartLists: false,
	  silent: false,
	  highlight: null,
	  langPrefix: 'lang-',
	  smartypants: false,
	  headerPrefix: '',
	  renderer: new Renderer,
	  xhtml: false
	};

	/**
	 * Expose
	 */

	marked.Parser = Parser;
	marked.parser = Parser.parse;

	marked.Renderer = Renderer;

	marked.Lexer = Lexer;
	marked.lexer = Lexer.lex;

	marked.InlineLexer = InlineLexer;
	marked.inlineLexer = InlineLexer.output;

	marked.parse = marked;

	if (true) {
	  module.exports = marked;
	} else if (typeof define === 'function' && define.amd) {
	  define(function() { return marked; });
	} else {
	  this.marked = marked;
	}

	}).call(function() {
	  return this || (typeof window !== 'undefined' ? window : global);
	}());

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }
/******/ ]);