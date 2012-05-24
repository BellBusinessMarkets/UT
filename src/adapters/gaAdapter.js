/*!
 * _UT Library - gaAdapter (Google Analytics Adapter)
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
 */
 
// creating global exception handler
_UT.exceptionHandler = _UT.exceptionHandler || new _UT.Exception();

/**
 * UT Google Analytics Adapter.
 * @implements {_UT.Adapter}
 */
_UT.gaAdapter = _UT.Adapter.extend({
                                   
    // Adapter info
    info: {
        version: "1.1.0",
        date:    "2011-12-23",
        author: "DD"
    },                       
                               
	/**
	 * @constructor
	 * @param {!Object.<{id,args}>} settings Contains Adapter mandatory properties and Solution specific properties.
	 * @param {function(Object)} processor Function of 1 parameter (args) representing the Business Logic whose purpose is to transform the args received into a data object to be passed along.
	 * @param {function(Object)} map Function of 1 parameter (data) whose purpose is to format the received data and map it to the specific analytics tool used.
	 */
    init: function (settings, processor, map) {
        try {
            // calling the UT Adapter function to clean up
            this._super(settings, processor, map);
            
            // tracker name
            this.tracker = this.id

            // load _ga library
            window['_gaq'] = window['_gaq'] || [];
            (function() {
                var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
                ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
                var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
            })();
            
            // figuring out if prod or dev should be used
            var tmp_prod_urls = settings.prod_urls.split(",");
            for(var i=0;i<tmp_prod_urls.length;i++) tmp_prod_urls[i] = ".*" + tmp_prod_urls[i] + ".*";
            var regex = new RegExp(tmp_prod_urls.join("|"), "i");
            if( regex.test(window.location.host)) {
                // configuring GA
                _gaq.push([this.tracker + '._setAccount', settings.prod_account]);
            } else {
                // configuring GA
                _gaq.push([this.tracker + '._setAccount', settings.dev_account]);
            }
            
            // Tracking sub and crossdomain
            if(settings.domainName) _gaq.push([this.tracker + '._setDomainName', settings.domainName]);
            if(typeof settings.allowLinker == 'boolean') _gaq.push([this.tracker + '._setAllowLinker', settings.allowLinker]);
			if(settings.cookiePath) _gaq.push([this.tracker + '._setCookiePath', settings.cookiePath]);


            // always return true
            return true;
        } catch (e) {
            _UT.exceptionHandler.push(e);
        }
    },

	/**
	 * Method to fire beacon for Google Analytics
	 * @param {Object} vars Arguments used in logic
	 */
    fire: function (vars) {
        // calling the UT Adapter function to clean up
        this._super(vars);
        
        if (this.error) {
            console.debug("ERROR");
            return false;
        }
        
        if(!this.isBlocked()) {
            if(this.hasPageName()) {
                 _gaq.push([this.tracker + '._trackPageview', this.getPageName()]);
            } else {
                _gaq.push([this.tracker + '._trackPageview']);
            }
        }
        this.unblockTrackPageView();
    },

    /**
     * Method to fire track Event
	 * @param {Array} params Array of Google Analytics parameters for specific function
     */    
    trackEvent: function(params) {
        params.unshift(this.tracker + '._trackEvent');
        _gaq.push(params);
    },
    /**
     * Method to fire track Event
	 * @param {Array} params Array of Google Analytics parameters <index, name, value, opt_scope>
     */    
    setCustomVar: function(params) {
        params.unshift(this.tracker + '._setCustomVar');
        _gaq.push(params);
    },

    /**
     * Method to prevent trackpageview from being fired
     */
    unblockTrackPageView: function() {
        this._blocked = false;
    },
    /**
     * Method to unblock trackpageview
     */
    blockTrackPageView: function() {
        this._blocked = true;
    },
    /**
     * Method check if trackpageview blocked
	 * @private
	 * @return {boolean}
     */
    isBlocked: function() {
        return !(!this._blocked);
    },
    
    /**
     * Method to set the pagename of the current page
	 * @param {string} pn Name of page to send to GA
     */    
     setPageName: function(pn) {
		 if(typeof pn == "string") {
			if(pn.charAt(0) != "/") pn = "/" + pn; 
   			this.pageName = pn;
		 }
     },
    /**
     * Method to set reset the pagename
     */
     resetPageName: function() {
         this.pageName = '';
     },
    /**
     * Check whether a pagename override has been set
	 * @return {boolean}
     */
     hasPageName: function() {
         if(this.pageName) return true;
         return false;
     },
    /**
     * Check whether a pagename override has been set
	 * @return {string} The pagename
     */
     getPageName: function() {
         return this.pageName?this.pageName:"";
     }
     
    /**
     * getTrackerName
     */ 
/*     getTrackerName: function() {
         var self = this;
         var trackerName = "";
        _gaq.push(function() {
          var pageTracker = _gat._getTrackerByName(self.id); // Gets the default tracker.
          trackerName = pageTracker._getName();
        });
        
     }*/
    
});