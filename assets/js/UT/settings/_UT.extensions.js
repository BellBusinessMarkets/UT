//*************************************************
// *    Non-Core utilities - affects _UT Static Object
//****************************************************
_UT.addExtensions({
   
    getQueryParam: function (name) {
        var names_arr = name.split(",");
        if(names_arr.length > 1) {
            for(var i=0; i<names_arr.length;i++){
                if((r = _UT.getQueryParam(names_arr[i])) !== "") return r;
            }
            return "";
        }
        else {
            name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
            var regexS = "[\\?&]" + name + "=([^&#]*)";
            var regex = new RegExp(regexS);
            var results = regex.exec(window.location.href);
            if (results == null) return "";
            else return decodeURIComponent(results[1].replace(/\+/g, " "));
        }
    },

    /** Get Value of Cookie Once
     *
     *  @param string    value    The string to be stored
     *  @param integer    key        The token that will be used to retrieve the cookie
     *  @param integer    ttl        Time To Live (hours)
     * 
     *  @return value
     */
    getValOnce: function(value, key, ttl) {
        var k = _UT.cookie.get(key);
        if (value) {
            _UT.cookie.set(key, value, ttl ? ttl : 0);
        }
        return value == k ? "" : value;
    },
    
    /** To Lower Case
     *
     *  @param object    The object where each value will be lowerCased
     * 
     *  @return object
     */    
     lowerCase: function(obj) {
         _UT.each(obj, function(i,v) {
            if(typeof v == "string") obj[i] = v.toLowerCase();
        });
         return obj;
     },
    
    cookie: {    
    
        /** Get a cookie's value
         *
         *  @param integer    key        The token used to create the cookie
         *  @return void
         */
        get: function(key) {
            // Still not sure that "[a-zA-Z0-9.()=|%/]+($|;)" match *all* allowed characters in cookies
            tmp =  document.cookie.match((new RegExp(key +'=[a-zA-Z0-9.()=|%/_\'-]+($|;)','g')));
            if(!tmp || !tmp[0]) return null;
            else return unescape(tmp[0].substring(key.length+1,tmp[0].length).replace(';','')) || null;
            
        },    
        
        /** Set a cookie
         *
         *  @param integer    key        The token that will be used to retrieve the cookie
         *  @param string    value    The string to be stored
         *  @param integer    ttl        Time To Live (hours)
         *  @param string    path    Path in which the cookie is effective, default is "/" (optional)
         *  @param string    domain    Domain where the cookie is effective, default is window.location.hostname (optional)
         *  @param boolean     secure    Use SSL or not, default false (optional)
         * 
         *  @return setted cookie
         */
        set: function(key, value, ttl, path, domain, secure) {
            cookie = [key+'='+    escape(value),
                      'path='+    ((!path   || path=='')  ? '/' : path),
                      'domain='+  ((!domain || domain=='')?  window.location.hostname : domain)];

            if (ttl)         cookie.push("expires="+_UT.cookie.hoursToExpireDate(ttl));
            if (secure)      cookie.push('secure');

            return document.cookie = cookie.join('; ');
        },
        
        /** Unset a cookie
         *
         *  @param integer    key        The token that will be used to retrieve the cookie
         *  @param string    path    Path used to create the cookie (optional)
         *  @param string    domain    Domain used to create the cookie, default is null (optional)
         *  @return void
         */
        unset: function(key, path, domain) {
            path   = (!path   || typeof path   != 'string') ? '' : path;
            domain = (!domain || typeof domain != 'string') ? '' : domain;
            if (_UT.cookie.get(key)) _UT.cookie.set(key, '', 'Thu, 01-Jan-70 00:00:01 GMT', path, domain);
        },
    
        /** Return GTM date string of "now" + time to live
         *
         *  @param integer    ttl        Time To Live (hours)
         *  @return string
         */
        hoursToExpireDate: function(ttl) {
            if (parseInt(ttl) == 'NaN' ) return '';
            else {
                now = new Date();
                now.setTime(now.getTime() + (parseInt(ttl) * 60 * 60 * 1000));
                return now.toGMTString();            
            }
        },
    
        /** Return true if cookie functionnalities are available
         *
         *  @return boolean
         */
        test: function() {
            _UT.cookie.set('b49f729efde9b2578ea9f00563d06e57', 'true');
            if (_UT.cookie.get('b49f729efde9b2578ea9f00563d06e57') == 'true') {
                _UT.cookie.unset('b49f729efde9b2578ea9f00563d06e57');
                return true;
            }
            return false;
        },
		
		
        
        /** If Firebug JavaScript console is present, it will dump cookie string to console.
         * 
         *  @return void
         */
        dump: function() {
            if (typeof console != 'undefined') {
                console.log(document.cookie.split(';'));
            }
        },
		
        /** Get a cookie's domain
         *
         *  @param integer cookieDomainPeriod The number of periods to use
		 *  @param string url The URL to extract
         *  @return domain
         */
		getCookieDomain: function (n, d) {
			var p, c_d;
			if(!d) d = window.location.hostname;
		
			if (d) {
				n = n ? parseInt(n) : 2;
				n = n > 2 ? n : 2;
				p = d.lastIndexOf(".");
				if (p >= 0) {
					while (p >= 0 && n > 1) {
						p = d.lastIndexOf(".", p - 1);
						n--;
					}
					c_d = p > 0 && _UT.cookie.pt(d, ".") ? d.substring(p) : d;
				}
			}
			return c_d;
		},

		pt:  function (x, d) {
			var t = x, z = 0, y, r;
			while (t) {
				y = t.indexOf(d);
				y = y < 0 ? t.length : y;
				t = t.substring(0, y);
				r = _UT.cookie.c_gdf(t);
				if (r) {
					return r;
				}
				z += y + d.length;
				t = x.substring(z, x.length);
				t = z < x.length ? t : "";
			}
			return "";
		},

		c_gdf: function (t) {
			if (!_UT.isNumeric(t)) {
				return 1;
			}
			return 0;
		}
    }

});

//*************************************************
// *    Non-Core utilities - affects _UT Static Object
//****************************************************
_UT.addExtensions({

/**
sprintf() for JavaScript 0.7-beta1
http://www.diveintojavascript.com/projects/javascript-sprintf

Copyright (c) Alexandru Marasteanu <alexaholic [at) gmail (dot] com>
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.
    * Neither the name of sprintf() for JavaScript nor the
      names of its contributors may be used to endorse or promote products
      derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL Alexandru Marasteanu BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
**/
    sprintf: (function () {
        function get_type(variable) {
            return Object.prototype.toString.call(variable).slice(8, -1).toLowerCase();
        }

        function str_repeat(input, multiplier) {
            for (var output = []; multiplier > 0; output[--multiplier] = input) { /* do nothing */
            }
            return output.join('');
        }

        var str_format = function () {
                if (!str_format.cache.hasOwnProperty(arguments[0])) {
                    str_format.cache[arguments[0]] = str_format.parse(arguments[0]);
                }
                return str_format.format.call(null, str_format.cache[arguments[0]], arguments);
            };

        str_format.format = function (parse_tree, argv) {
            var cursor = 1,
                tree_length = parse_tree.length,
                node_type = '',
                arg, output = [],
                i, k, match, pad, pad_character, pad_length;
            for (i = 0; i < tree_length; i++) {
                node_type = get_type(parse_tree[i]);
                if (node_type === 'string') {
                    output.push(parse_tree[i]);
                } else if (node_type === 'array') {
                    match = parse_tree[i]; // convenience purposes only
                    if (match[2]) { // keyword argument
                        arg = argv[cursor];
                        for (k = 0; k < match[2].length; k++) {
                            if (!arg.hasOwnProperty(match[2][k])) {
                                throw (sprintf('[sprintf] property "%s" does not exist', match[2][k]));
                            }
                            arg = arg[match[2][k]];
                        }
                    } else if (match[1]) { // positional argument (explicit)
                        arg = argv[match[1]];
                    } else { // positional argument (implicit)
                        arg = argv[cursor++];
                    }

                    if (/[^s]/.test(match[8]) && (get_type(arg) != 'number')) {
                        throw (sprintf('[sprintf] expecting number but found %s', get_type(arg)));
                    }
                    switch (match[8]) {
                    case 'b':
                        arg = arg.toString(2);
                        break;
                    case 'c':
                        arg = String.fromCharCode(arg);
                        break;
                    case 'd':
                        arg = parseInt(arg, 10);
                        break;
                    case 'e':
                        arg = match[7] ? arg.toExponential(match[7]) : arg.toExponential();
                        break;
                    case 'f':
                        arg = match[7] ? parseFloat(arg).toFixed(match[7]) : parseFloat(arg);
                        break;
                    case 'o':
                        arg = arg.toString(8);
                        break;
                    case 's':
                        arg = ((arg = String(arg)) && match[7] ? arg.substring(0, match[7]) : arg);
                        break;
                    case 'u':
                        arg = Math.abs(arg);
                        break;
                    case 'x':
                        arg = arg.toString(16);
                        break;
                    case 'X':
                        arg = arg.toString(16).toUpperCase();
                        break;
                    }
                    arg = (/[def]/.test(match[8]) && match[3] && arg >= 0 ? '+' + arg : arg);
                    pad_character = match[4] ? match[4] == '0' ? '0' : match[4].charAt(1) : ' ';
                    pad_length = match[6] - String(arg).length;
                    pad = match[6] ? str_repeat(pad_character, pad_length) : '';
                    output.push(match[5] ? arg + pad : pad + arg);
                }
            }
            return output.join('');
        };

        str_format.cache = {};

        str_format.parse = function (fmt) {
            var _fmt = fmt,
                match = [],
                parse_tree = [],
                arg_names = 0;
            while (_fmt) {
                if ((match = /^[^\x25]+/.exec(_fmt)) !== null) {
                    parse_tree.push(match[0]);
                } else if ((match = /^\x25{2}/.exec(_fmt)) !== null) {
                    parse_tree.push('%');
                } else if ((match = /^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(_fmt)) !== null) {
                    if (match[2]) {
                        arg_names |= 1;
                        var field_list = [],
                            replacement_field = match[2],
                            field_match = [];
                        if ((field_match = /^([a-z_][a-z_\d]*)/i.exec(replacement_field)) !== null) {
                            field_list.push(field_match[1]);
                            while ((replacement_field = replacement_field.substring(field_match[0].length)) !== '') {
                                if ((field_match = /^\.([a-z_][a-z_\d]*)/i.exec(replacement_field)) !== null) {
                                    field_list.push(field_match[1]);
                                } else if ((field_match = /^\[(\d+)\]/.exec(replacement_field)) !== null) {
                                    field_list.push(field_match[1]);
                                } else {
                                    throw ('[sprintf] huh?');
                                }
                            }
                        } else {
                            throw ('[sprintf] huh?');
                        }
                        match[2] = field_list;
                    } else {
                        arg_names |= 2;
                    }
                    if (arg_names === 3) {
                        throw ('[sprintf] mixing positional and named placeholders is not (yet) supported');
                    }
                    parse_tree.push(match);
                } else {
                    throw ('[sprintf] huh?');
                }
                _fmt = _fmt.substring(match[0].length);
            }
            return parse_tree;
        };

        return str_format;
    })(),

    vsprintf: function (fmt, argv) {
        argv.unshift(fmt);
        return _UT.sprintf.apply(null, argv);
    }
});