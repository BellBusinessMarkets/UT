/**
 * @author      Maxime Haineault (max@centdessin.com)
 * @version     0.4
 * @desc        JavaScript cookie manipulation class (http://code.google.com/p/cookie-js/)
 * 
 * MIT Licensed.
 * http://www.opensource.org/licenses/mit-license.php
 */
_UT.addExtensions({
	
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
		
		/** Get Value of Cookie Once
		 *
		 *  @param string    value    The string to be stored
		 *  @param integer    key        The token that will be used to retrieve the cookie
		 *  @param integer    ttl        Time To Live (hours)
		 * 
		 *  @return value
		 */
		getValOnce: function(key, value, ttl) {
			var k = _UT.cookie.get(key);
			if (value) {
				_UT.cookie.set(key, value, ttl ? ttl : 0);
			}
			return value == k ? "" : value;
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