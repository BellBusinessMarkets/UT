/*!
 * _UT JavaScript Library v1.0
 * http://bellbusinessmarkets.github.com/UT
 *
 * @preserve @copyright 2012, Bell Business Markets, http://www.bell.ca/enterprise/EntAbt_BellCie.page
 * @author Daniel Dallala <daniel.dallala@gmail.com> <@ddallala>
 * @contributors 
 *
 * Released under LGPL Version 3 license.
 * http://bellbusinessmarkets.github.com/UT/license.html
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * and the Lesser General Public License along with this program.  
 * If not, see <http://www.gnu.org/licenses/>.
 *
 * ---
 * Includes modified parts of jQuery and Simple Javascript Inheritance
 * Copyright 2011, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 */
// Inspired by base2 and Prototype
(function () {
    var initializing = false,
        fnTest = /xyz/.test(function () {
            xyz;
        }) ? /\b_super\b/ : /.*/;
    // The base Class implementation (does nothing)
    this.Class = function () {};

    // Create a new Class that inherits from this class
    Class.extend = function (prop) {
        var _super = this.prototype;

        // Instantiate a base class (but only create the instance,
        // don't run the init constructor)
        initializing = true;
        var prototype = new this();
        initializing = false;

        // Copy the properties over onto the new prototype
        for (var name in prop) {
            // Check if we're overwriting an existing function
            prototype[name] = typeof prop[name] == "function" && typeof _super[name] == "function" && fnTest.test(prop[name]) ? (function (name, fn) {
                return function () {
                    var tmp = this._super;

                    // Add a new ._super() method that is the same method
                    // but on the super-class
                    this._super = _super[name];

                    // The method only need to be bound temporarily, so we
                    // remove it when we're done executing
                    var ret = fn.apply(this, arguments);
                    this._super = tmp;

                    return ret;
                };
            })(name, prop[name]) : prop[name];
        }

        // The dummy class constructor

        function Class() {
            // All construction is actually done in the init method
            if (!initializing && this.init) this.init.apply(this, arguments);
        }

        // Populate our constructed prototype object
        Class.prototype = prototype;

        // Enforce the constructor to be what we expect
        Class.constructor = Class;

        // And make this class extendable
        Class.extend = arguments.callee;

        return Class;
    };
})();

/* 
 * Declaring namespace
 *   Start of _UT definition (influenced by jQuery Core)
 *
 * @type {Object}
 */
var _UT = (function () {

    // Define a local copy of _UT
    var _UT = {
        // UT info
        info: {
            version: "1.0",
            date: "2012-04-23",
            author: "DD"
        }
    },

        // A simple way to check for HTML strings or ID strings
        // Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
        quickExpr = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,

        // Check if a string has a non-whitespace character in it
        rnotwhite = /\S/,

        // Used for trimming whitespace
        trimLeft = /^\s+/,
        trimRight = /\s+$/,

        // Match a standalone tag
        rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>)?$/,

        // JSON RegExp
        rvalidchars = /^[\],:{}\s]*$/,
        rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
        rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
        rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,

        // Useragent RegExp
        rwebkit = /(webkit)[ \/]([\w.]+)/,
        ropera = /(opera)(?:.*version)?[ \/]([\w.]+)/,
        rmsie = /(msie) ([\w.]+)/,
        rmozilla = /(mozilla)(?:.*? rv:([\w.]+))?/,

        // Matches dashed string for camelizing
        rdashAlpha = /-([a-z]|[0-9])/ig,
        rmsPrefix = /^-ms-/,

        // Used by _UT.camelCase as callback to replace()
        fcamelCase = function (all, letter) {
            return (letter + "").toUpperCase();
        },

        // Keep a UserAgent string for use with _UT.browser
        userAgent = navigator.userAgent,

        // For matching the engine and version of the browser
        browserMatch,

        // The deferred used on DOM ready
        readyList,

        // The ready event handler
        DOMContentLoaded,

        // Save a reference to some core methods
        toString = Object.prototype.toString,
        hasOwn = Object.prototype.hasOwnProperty,
        push = Array.prototype.push,
        slice = Array.prototype.slice,
        trim = String.prototype.trim,
        indexOf = Array.prototype.indexOf,

        // [[Class]] -> type pairs
        class2type = {};

    _UT.extend = function () {
        var options, name, src, copy, copyIsArray, clone, target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false;

        // Handle a deep copy situation
        if (typeof target === "boolean") {
            deep = target;
            target = arguments[1] || {};
            // skip the boolean and the target
            i = 2;
        }

        // Handle case when target is a string or something (possible in deep copy)
        if (typeof target !== "object" && !_UT.isFunction(target)) {
            target = {};
        }

        // extend _UT itself if only one argument is passed
        if (length === i) {
            target = this;
            --i;
        }

        for (; i < length; i++) {
            // Only deal with non-null/undefined values
            if ((options = arguments[i]) != null) {
                // Extend the base object
                for (name in options) {
                    src = target[name];
                    copy = options[name];

                    // Prevent never-ending loop
                    if (target === copy) {
                        continue;
                    }

                    // Recurse if we're merging plain objects or arrays
                    if (deep && copy && (_UT.isPlainObject(copy) || (copyIsArray = _UT.isArray(copy)))) {
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && _UT.isArray(src) ? src : [];

                        } else {
                            clone = src && _UT.isPlainObject(src) ? src : {};
                        }

                        // Never move original objects, clone them
                        target[name] = _UT.extend(deep, clone, copy);

                        // Don't bring in undefined values
                    } else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }

        // Return the modified object
        return target;
    };

    _UT.extend({

        // See test/unit/core.js for details concerning isFunction.
        // Since version 1.3, DOM methods and functions like alert
        // aren't supported. They return false on IE (#2968).
        isFunction: function (obj) {
            return _UT.type(obj) === "function";
        },

        isArray: Array.isArray ||
        function (obj) {
            return _UT.type(obj) === "array";
        },

        copyArray: function (obj) {
            return _UT.extend(true, [], obj);
        },

        copyObject: function (obj) {
            return _UT.extend(true, {}, obj || {});
        },
        isWindow: function (obj) {
            return obj != null && obj == obj.window;
        },

        isNumeric: function (obj) {
            return !isNaN(parseFloat(obj)) && isFinite(obj);
        },

        type: function (obj) {
            return obj == null ? String(obj) : class2type[toString.call(obj)] || "object";
        },

        isPlainObject: function (obj) {
            // Must be an Object.
            // Because of IE, we also have to check the presence of the constructor property.
            // Make sure that DOM nodes and window objects don't pass through, as well
            if (!obj || _UT.type(obj) !== "object" || obj.nodeType || _UT.isWindow(obj)) {
                return false;
            }

            try {
                // Not own constructor property must be Object
                if (obj.constructor && !hasOwn.call(obj, "constructor") && !hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
                    return false;
                }
            } catch (e) {
                // IE8,9 Will throw exceptions on certain host objects #9897
                return false;
            }

            // Own properties are enumerated firstly, so to speed up,
            // if last one is own, then all properties are own.
            var key;
            for (key in obj) {}

            return key === undefined || hasOwn.call(obj, key);
        },

        isEmptyObject: function (obj) {
            for (var name in obj) {
                return false;
            }
            return true;
        },

        error: function (msg) {
            throw new Error(msg);
        },


        noop: function () {},

        // Evaluates a script in a global context
        // Workarounds based on findings by Jim Driscoll
        // http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
        globalEval: function (data) {
            if (data && rnotwhite.test(data)) {
                // We use execScript on Internet Explorer
                // We use an anonymous function so that context is window
                // rather than _UT in Firefox
                (window.execScript ||
                function (data) {
                    window["eval"].call(window, data);
                })(data);
            }
        },

        // Convert dashed to camelCase; used by the css and data modules
        // Microsoft forgot to hump their vendor prefix (#9572)
        camelCase: function (string) {
            return string.replace(rmsPrefix, "ms-").replace(rdashAlpha, fcamelCase);
        },

        nodeName: function (elem, name) {
            return elem.nodeName && elem.nodeName.toUpperCase() === name.toUpperCase();
        },

        // args is for internal usage only
        each: function (object, callback, args) {
            var name, i = 0,
                length = object.length,
                isObj = length === undefined || _UT.isFunction(object);

            if (args) {
                if (isObj) {
                    for (name in object) {

                        if (callback.apply(object[name], args) === false) {
                            break;
                        }
                    }
                } else {
                    for (; i < length;) {
                        if (callback.apply(object[i++], args) === false) {
                            break;
                        }
                    }
                }

                // A special, fast, case for the most common use of each
            } else {
                if (isObj) {
                    for (name in object) {
                        if (callback.call(object[name], name, object[name]) === false) {
                            break;
                        }
                    }
                } else {
                    for (; i < length;) {
                        if (callback.call(object[i], i, object[i++]) === false) {
                            break;
                        }
                    }
                }
            }

            return object;
        },

        // Use native String.trim function wherever possible
        trim: trim ?
        function (text) {
            return text == null ? "" : trim.call(text);
        } :

        // Otherwise use our own trimming functionality

        function (text) {
            return text == null ? "" : text.toString().replace(trimLeft, "").replace(trimRight, "");
        },


        inArray: function (elem, array, i) {
            var len;

            if (array) {
                if (indexOf) {
                    return indexOf.call(array, elem, i);
                }

                len = array.length;
                i = i ? i < 0 ? Math.max(0, len + i) : i : 0;

                for (; i < len; i++) {
                    // Skip accessing in sparse arrays
                    if (i in array && array[i] === elem) {
                        return i;
                    }
                }
            }

            return -1;
        },

        merge: function (first, second) {
            var i = first.length,
                j = 0;

            if (typeof second.length === "number") {
                for (var l = second.length; j < l; j++) {
                    first[i++] = second[j];
                }

            } else {
                while (second[j] !== undefined) {
                    first[i++] = second[j++];
                }
            }

            first.length = i;

            return first;
        },

        grep: function (elems, callback, inv) {
            var ret = [],
                retVal;
            inv = !! inv;

            // Go through the array, only saving the items
            // that pass the validator function
            for (var i = 0, length = elems.length; i < length; i++) {
                retVal = !! callback(elems[i], i);
                if (inv !== retVal) {
                    ret.push(elems[i]);
                }
            }

            return ret;
        },

        // arg is for internal usage only
        map: function (elems, callback, arg) {
            var value, key, ret = [],
                i = 0,
                length = elems.length,
                // _UT objects are treated as arrays
                isArray = /*elems instanceof _UT ||*/ length !== undefined && typeof length === "number" && ((length > 0 && elems[0] && elems[length - 1]) || length === 0 || _UT.isArray(elems));

            // Go through the array, translating each of the items to their
            if (isArray) {
                for (; i < length; i++) {
                    value = callback(elems[i], i, arg);

                    if (value != null) {
                        ret[ret.length] = value;
                    }
                }

                // Go through every key on the object,
            } else {
                for (key in elems) {
                    value = callback(elems[key], key, arg);

                    if (value != null) {
                        ret[ret.length] = value;
                    }
                }
            }

            // Flatten any nested arrays
            return ret.concat.apply([], ret);
        },

        // A global GUID counter for objects
        guid: 1,

        now: function () {
            return (new Date()).getTime();
        },

        // Use of _UT.browser is frowned upon.
        // More details: http://docs.jquery.com/Utilities/jQuery.browser
        uaMatch: function (ua) {
            ua = ua.toLowerCase();

            var match = rwebkit.exec(ua) || ropera.exec(ua) || rmsie.exec(ua) || ua.indexOf("compatible") < 0 && rmozilla.exec(ua) || [];

            return {
                browser: match[1] || "",
                version: match[2] || "0"
            };
        },

        browser: {},

        /**
         * Adds extensions (static/global function) to the _UT namespace
         * @param {Object} extensions Where key is name of function and value is the new function.
         */
        addExtensions: function (extensions) {
            return this.extend(extensions);
        },

        /**
         * Adds plugins to the instantiated adapter object
         * @param {Object} plugins Where key is name of function and value is the new function
		 * @param {string=} type The type of Adapter for which this plugin is valid (optional).
         */
        addPlugins: function (plugins, type) {
            if (typeof plugins == "object") {
                for (var name in plugins) {
                    // make exceptions for core methods and properties
                    if (type) { // take the second argument
                        _UT[type + "Adapter"].prototype[name] = plugins[name];
                    } else {
                        _UT.Adapter.prototype[name] = plugins[name];
                    }
                }
            }
        }
    });

    // Populate the class2type map
    _UT.each("Boolean Number String Function Array Date RegExp Object".split(" "), function (i, name) {
        class2type["[object " + name + "]"] = name.toLowerCase();
    });

    browserMatch = _UT.uaMatch(userAgent);
    if (browserMatch.browser) {
        _UT.browser[browserMatch.browser] = true;
        _UT.browser.version = browserMatch.version;
    }

    // Deprecated, use _UT.browser.webkit instead
    if (_UT.browser.webkit) {
        _UT.browser.safari = true;
    }

    // IE doesn't match non-breaking spaces with \s
    if (rnotwhite.test("\xA0")) {
        trimLeft = /^[\s\xA0]+/;
        trimRight = /[\s\xA0]+$/;
    }

    /**
     * UT Adapter.
     * @extends {Class}
	 * @interface
     */
    _UT.Adapter = Class.extend({

        /**
         * @constructor
		 * @param {!Object.<{id,args}>} settings Contains Adapter mandatory properties and Solution specific properties.
		 * @param {function(Object)} processor Function of 1 parameter (args) representing the Business Logic whose purpose is to transform the args received into a data object to be passed along.
		 * @param {function(Object)} map Function of 1 parameter (data) whose purpose is to format the received data and map it to the specific analytics tool used.
         */
        init: function (settings, processor, map) {
            try {
                this.settings = settings;
                this.processor = processor ||
                function () {};
                this.map = map ||
                function () {};

                // building default args and vars mapping to args
                this.args_default = {};
                this.vars_mapping = {};

                // args has to contain keys associated to an array where first item is default value and 2nd is array of variable keywords
                for (var k in settings.args) {
                    this.args_default[k] = settings.args[k][0];
                    this.vars_mapping[k] = settings.args[k][1];
                }

                // detect if id (variable name) present in settings and adds it to adapter
                if (settings.id) this.id = settings.id;

                // loading the Adapter Provider
                //  this.loadAdapter();
                return true;
            } catch (e) {
                _UT.exceptionHandler.push(e);
            }
        },

        /**
         * Method to fire beacon for Service
         * @param {Object} vars Arguments used in logic
         */
        fire: function (vars) {
            try {

                // parse the variables into arguments
                this.args = this.parseVars(vars);
                var args_tmp = _UT.copyObject(this.args || {}); // creating temporary copy
                // moving all arguments into data variable
                this.data = _UT.copyObject(this.args || {});

                // process the arguments into data
                this.data = this.processor(this.args);

                // map the data to specific solution
                this.map(this.data);

                // fire beacon
                // this.adapter.fire();
            } catch (e) {
                _UT.exceptionHandler.push(e);
            }
        },


        /**
         * Method to return the value of a specific key from the given scope
         * @param {string} k String representing the key as found in args
         * @param {Object} scope Represents the scope where the search variable should occur
         * @param {boolean=} useWindow if var not found in scope, then search in window
         * @return {string} value of the key from scope
         */
        getVarMapValue: function (k, scope, useWindow) {

            // loop through the array of possible variables (in the var_map object)
            var map_var_array = this.vars_mapping[k];

            // look for key directly
            if (typeof scope[k] != 'undefined') return scope[k];

            // look for key in var array - loop through each var array item
            for (var j = 0; j < map_var_array.length; j++) {
                // look in the scope for the key as defined in the array
                if (typeof scope[map_var_array[j]] != 'undefined') return scope[map_var_array[j]];
            }

            if (useWindow) return this.getVarMapValue(k, window);

            return undefined;
        },


        /**
         * Method to parse the variables received using special keywords to select default values
         * @param {Object} vars Variables to parse
         *            special properties:
         *                . __usePrevious: if should keep all the previous variables in memory
         *                . __useWindow: if should look in Window namespace for all variables
         * @return {Object} The arguments with values
         */
        parseVars: function (vars) {
			vars = vars || {};

            // saving previous args and current vars
            this.args_prev = _UT.copyObject(this.args || {});
            this.vars_used = _UT.copyObject(vars || {});

            // by default it cleans the Arguments returning them to default values unless __usePrevious set
            if (!vars.__usePrevious) this.args = _UT.copyObject(this.args_default);

            // find values in vars and map onto args - __useWindow to also check in window for the variable
            for (var i in this.args) {
                var val = this.getVarMapValue(i, vars, vars.__useWindow);
                if (typeof val != 'undefined') this.args[i] = val;
            }

            return this.args;
        }
    });


    /**
     * UT Container.
     * Class to group all Adapters and fire them using the same data
     * @extends {Class}
     */
    _UT.Container = Class.extend({

        /**
         * @constructor
		 * @param {...{settings: Object, processor: function, map: function}} Variable number of Adapter configurations.
         */
        init: function () {
            try {
                var self = this;
                this.adapters = [];

                // loop through arguments
                _UT.each(arguments, function () {
                    var service = this.settings.type;
                    if (typeof service == 'undefined') throw {
                        type: 'error',

                        name: 'Adapter Error',
                        message: 'No Service Type [type: ga/omni] in settings'
                    };

                    var servicename = service + 'Adapter';

                    if (typeof _UT[servicename] != "undefined") {
                        window[this.settings.id] = new _UT[servicename](this.settings, this.processor, this.map);
                        self.adapters.push(window[this.settings.id]);
                    } else throw {
                        type: 'error',
                        name: 'Adapter Error',
                        message: 'Adapter: _UT.' + service + 'Adapter does not exist'
                    };

                });
            } catch (e) {
                _UT.exceptionHandler.push(e);
            }
        },

        /**
         * Method to call a method of each Adapter
         * @param {string} method Name of methods
         * @param {Object} props Properties of the call method
         *            . __include: array of adapter ids to include
         *            . __exclude: array of adapter ids to exclude (one or the other)
         * @param {...*} arguments used in logic
         */
        call: function () {
            try {

                // extracting important information from arguments
                var method = arguments[0];
                var props = arguments[1];
                var args = [];
                for(var i=2;i<arguments.length;i++) args.push(arguments[i]);

                _UT.each(this.adapters, function (i) {
                    // this represents the current adapter    
                    if (props && (props.__include || props.__exclude)) {
                        // try include first
                        if (props.__include && new RegExp('^(' + props.__include.join('|') + ')$').test(this.id)) {
                            this[method] && this[method].apply(this, args);
                        }
                        // then exclude -verify if in list then negate only fire if not in list
                        if (!props.__include && !(props.__exclude && new RegExp('^(' + props.__exclude.join('|') + ')$').test(this.id))) {
                            this[method] && this[method].apply(this, args);
                        }
                    } else {
                        this[method] && this[method].apply(this, args);
                    }

                })

            } catch (e) {
                _UT.exceptionHandler.push(e);
            }
        }
    });
	
    /**
     * UT Exception
     * Class to handle exceptions
     * @extends {Class}
     */
    _UT.Exception = Class.extend({
        /**
         * Exception Object
         * @constructor
         */
        init: function () {
            this.errors = [];
            this.warnings = [];
        },
		
        /**
         * Method to push errors or warnings into the Object
         * @param {Object} e The error Object.
         */
        push: function (e) {
            if (e.type == 'warning') this.warnings.push(e);
            else this.errors.push(e);
        }
    });

    return _UT;

})();