/*!
 * _UT Library - omniAdapter (Omniture Adapter)
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
 * This adapter requires the s_code and omniture plugins in order to be 
 * functionnal.
 * Contact your Adobe Account Manager or Client Care to retrieve the code.
 */
 
// creating global exception handler
_UT.exceptionHandler = _UT.exceptionHandler || new _UT.Exception();


// settings at bottom

/************* DO NOT ALTER ANYTHING BELOW THIS LINE ! **************/
var s_code='';//



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


/**
 * UT Omniture Adapter.
 * @implements {_UT.Adapter}
 */
_UT.omniAdapter = _UT.Adapter.extend({
                                     
    // Adapter info
    info: {
        version: "1.11",
        date:    "2012-01-27",
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
            
            // if more beaons need to be fired during processing
            this.fire_queue = [];

            // check if omni defined
            if (typeof s_gi == 'undefined') {
                this.error = true;
                throw {
                    type: 'error',
                    name: 'omniAdapter Error',
                    message: 's_code.js Library not loaded'
                };
            }

            // configuring Omniture
            this.s_account = settings.dev_account;
            this.s = s_gi(this.s_account);
            var s = this.s;

            // configuring the dynamic accounts
            s.dynamicAccountSelection = typeof settings.dynamicAccountSelection!='undefined'?settings.dynamicAccountSelection:true; // used to select between prod and dev accounts
            s.dynamicAccountMatch = window.location.host;
            s.dynamicAccountList = _UT.sprintf("%1$s=%2$s;%3$s=%4$s", settings.dev_account, settings.dev_urls ? settings.dev_urls : "", settings.prod_account, settings.prod_urls ? settings.prod_urls : "");

            // use plugins
            s.usePlugins = typeof settings.usePlugins!='undefined'?settings.usePlugins:true;

            // charSet
            s.charSet = settings.charSet || "ISO-8859-1";

            // Conversion Config
            s.currencyCode = settings.currencyCode || "USD";

            // Link Tracking Config
            s.trackDownloadLinks = typeof settings.trackDownloadLinks!='undefined'?settings.trackDownloadLinks: true;
            s.linkDownloadFileTypes = settings.linkDownloadFileTypes || "exe,zip,wav,mp3,mov,mpg,avi,wmv,doc,pdf,xls";

            s.trackExternalLinks = typeof settings.trackExternalLinks!='undefined'?settings.trackExternalLinks: true;
            s.linkInternalFilters = _UT.sprintf("javascript:,%1$s,%2$s", settings.dev_urls ? settings.dev_urls : "", settings.prod_urls ? settings.prod_urls : "");

            s.trackInlineStats = settings.trackInlineStats || true; // Clickmap
            s.linkLeaveQueryString = settings.linkLeaveQueryString || false;


            // First party cookie - tracking server
            this.settings.use_first_party_cookies = typeof settings.use_first_party_cookies != 'undefined' ? settings.use_first_party_cookies : false; // checks if object exists
            s.trackingServer = (!(!settings.use_first_party_cookies) && typeof settings.use_first_party_cookies.trackingServer != 'undefined' ? settings.use_first_party_cookies.trackingServer : "");
            s.trackingServerSecure = (!(!settings.use_first_party_cookies) && typeof settings.use_first_party_cookies.trackingServerSecure != 'undefined' ? settings.use_first_party_cookies.trackingServerSecure : "");

            // if not first-party cookie, visitorNamespace is used for cookie domain .visitorNamespace.112.2o7.net
            s.visitorNamespace = settings.visitorNamespace
                || (function(){ if(settings.prod_account) return settings.prod_account.split(",")[0];return"" })() 
                || "";

           s.cookieDomainPeriods=location.host.match(/\.(co(m?)|net)\.(au|nz|jp|uk|mx|sg|ph|es|ie|br)/)?3:2;// Todo: update list of top domain

            // data center
            s.dc = settings.dc || "112";
            s.server = settings.server || window.location.hostname.toLowerCase().replace("www.","");
            
            
            // -- Plugin specific settings
            settings.plugins = settings.plugins||{};
            
            // attach omniture plugins
            this.addOmniPlugins();

            // always return true
            return true;
        } catch (e) {
            _UT.exceptionHandler.push(e);
        }
    },

	/**
	 * Method to fire beacon for Omniture
	 * @param {Object} vars Arguments used in logic
	 */
    fire: function (vars) {
        // calling the UT Adapter function to clean up
        this._super(vars);

        if (this.error) {
            console.debug("ERROR");
            return false;
        }

        var s = this.s;
        if(this.isTrackLink()){
            s.linkTrackEvents = this.tracklink.linkTrackEvents;
            s.linkTrackVars = this.tracklink.linkTrackVars;
            void(s.tl(this.tracklink.anchorObj,this.tracklink.type,this.tracklink.name));
            this.resetTrackLink();
        } else{
            void(s.t())
        }
        
        // clean the s object
        this.clean();
        //var s_code=s.t();if(s_code)document.write(s_code);
        
        if(this.fireQueueHasMore()){
            this.fire(this.fireQueueNext());
        }
    },

    /**
     * Method to add new beacon parameters to Queue for firing
	 * @param {Object} args Arguments used in logic
     */
    fireQueueAdd: function(args) {
        this.fire_queue.push(args);
    },
    /**
     * Method to get the next beacon from the Queue
	 * @protected
	 * @return {Object} Parameters to use for beacon
     */
    fireQueueNext: function() {
        return this.fire_queue.pop();
    },
    /**
     * Method to check if there are more beacons waiting to be fired
	 * @protected
	 * @return {boolean}
     */
    fireQueueHasMore: function() {
        return this.fire_queue.length > 0;
    },
    
    /**
     * Method clean the s object
     */
    clean: function() {
        var s = this.s;
        s.events="";
        s.products="";
        s.purchaseID="";
        s.zip="";
        s.state="";
        for(var i=1;i<=75;i++){
            s["eVar"+i]='';
        }
        for(var i=1;i<=75;i++){
            s["prop"+i]='';
        }
    },

    /**
     * Method to check if a beacon is a Custom Link tracking beacon
	 * @return {boolean}
     */
    isTrackLink: function() {
        if(!this.tracklink) return false;
        return this.tracklink._set;
    },
    /**
     * Method to set beacon as a Custom Link tracking beacon
	 * @param {{anchorObj: element,type: string,name: string,linkTrackVars:string,linkTrackEvents:string, _overwrite: boolean}} params
     */
    setTrackLink: function(params) {
        this.tracklink = this.tracklink || {};
        this.tracklink._set = typeof params._set != "undefined"?params._set:true;
        this.tracklink.anchorObj = params.anchorObj?params.anchorObj:true;
        this.tracklink.type = params.type?params.type:'o';
        this.tracklink.name = params.name?params.name:'';
        if(params._overwrite) {
            this.tracklink.linkTrackEvents = params.linkTrackEvents?params.linkTrackEvents:'None';
            this.tracklink.linkTrackVars = params.linkTrackVars?params.linkTrackVars:'None';
        } else {
            if(!this.settings.linkTrackVars) this.settings.linkTrackVars = "";
            if(!this.settings.linkTrackEvents) this.settings.linkTrackEvents = "";
            this.tracklink.linkTrackVars = this.settings.linkTrackVars + (params.linkTrackVars?","+params.linkTrackVars:'');
            this.tracklink.linkTrackEvents = this.settings.linkTrackEvents + (params.linkTrackEvents?","+params.linkTrackEvents:'');
        }
    },
    /**
     * Method to reset the Custom Link Tracking
     */
    resetTrackLink: function() {
        this.setTrackLink({_set: false});
    },
    
    
    /**
     * Method to Add Omniture Plugins
	 * @private
     */
    addOmniPlugins: function() {
        var s=this.s, self=this, settings = self.settings;
        
        s.doPlugins = function() {
            
            // setting-up formAnalsis
            if(settings.plugins.setupFormAnalysis && !settings.plugins.setupFormAnalysis._loaded) {
                s.setupFormAnalysis(); 
                settings.plugins.setupFormAnalysis._loaded=true;
            }
            
            // updating Beacon Name
            settings.beacon_name= "s_i_"+ (typeof s.visitorNamespace != "undefined"?s.visitorNamespace:s.fun).replace(/_/gi,"");
        };
        
        //------------------------
        // Plugin List
        //------------------------
        
        /*
         * Plugin: getTimeParting 1.4.1 - Set timeparting values based on time zone (15 min)    
         *        - changes: scoping all variables to the function using var
         */
        s.getTimeParting=new Function();
        
        /*
         * Plugin: Days since last Visit 1.1.H - capture time from last visit
         */
        s.getDaysSinceLastVisit=new Function();        

        /*
         * Plugin: Visit Number By Month 2.0 - Return the user visit number
         */
        s.getVisitNum=new Function();
        
        /*
         * Plugin: getNewRepeat 1.0 - Returns whether a user is new or repeat.
         */
        s.getNewRepeat=new Function();
         

        /*
         * Plugin: getPreviousValue_v1.0 - return previous value of designated
         *   variable (requires split utility)
         */
        s.getPreviousValue=new Function();
        /*
         * Plugin: getValOnce 0.2 - get a value once per session or number of days
         */
        s.getValOnce=new Function();

        /*
         * Function - read combined cookies v 0.3
         */
        if(!s.__ccucr){s.c_rr=s.c_r;s.__ccucr = true;
        s_sess ="ut_i_"+this.settings.prod_account.replace(",","_")+this.settings.id+'_s_sess';
        s_pers ="ut_i_"+this.settings.prod_account.replace(",","_")+this.settings.id+'_s_pers';
        s.c_r=new Function();}
        /*
         * Function - write combined cookies v 0.3
         */
        if(!s.__ccucw){s.c_wr=s.c_w;s.__ccucw = true;
        s.c_w=new Function();}
        
        /*
        * Utility Function: split v1.5 - split a string (JS 1.0 compatible)
        */
        s.split=new Function();
        
        /*
         * Plugin: getQueryParam 2.3
         */
        s.getQueryParam=new Function();
        
        /* 
         * Plugin Utility: Replace v1.0 
         */
        s.repl=new Function();

        /*
         * Plugin: s.crossVisitParticipation : 1.2.1 Tweaked BWS (limits cookie length)
         * - stacks values from specified variable in cookie and returns value
         */
        s.crossVisitParticipation = new Function();
        
        /*
         * s.join: 1.0 - s.join(v,p)
         */
        s.join = new Function();
    

        /*
         * Plugin: Form Analysis 2.1 (Success, Error, Abandonment)
         */
        s.setupFormAnalysis=new Function();

        // settings
        if(s.setupFormAnalysis && settings.plugins.setupFormAnalysis) {
            var FA_SETTINGS = settings.plugins.setupFormAnalysis;
            s.formList=FA_SETTINGS.formList||"";
            s.trackFormList=typeof FA_SETTINGS.trackFormList!='undefined'?FA_SETTINGS.trackFormList: false;
            s.trackPageName=typeof FA_SETTINGS.trackPageName!='undefined'?FA_SETTINGS.trackPageName: true;
            s.useCommerce=typeof FA_SETTINGS.useCommerce!='undefined'?FA_SETTINGS.useCommerce: false;
            s.varUsed=FA_SETTINGS.varUsed||"";     // if useCommerce = true, then use "eVars" in varUsed
            s.eventList=FA_SETTINGS.eventList||""; //Abandon,Success,Error
        }


       /*
         * Plugin: getPageName v2.1 - parse URL and return
         */
        s.getPageName=new Function();
        
        // settings
        if(s.getPageName && settings.plugins.getPageName) {
            var PN_SETTINGS = settings.plugins.getPageName;
            s.siteID=PN_SETTINGS.siteID||"";            // leftmost value in pagename
            s.defaultPage=PN_SETTINGS.defaultPage||"";// filename to add when none exists(index.html, index.jsp)
            s.queryVarsList=PN_SETTINGS.queryVarsList||"";   // query parameters to keep
            s.pathExcludeDelim=PN_SETTINGS.pathExcludeDelim||";";  // portion of the path to exclude
            s.pathConcatDelim=PN_SETTINGS.pathConcatDelim||":";   // page name component separator
            s.pathExcludeList=PN_SETTINGS.pathExcludeList||"";   // elements to exclude from the path
        }
        
        
       /*
        * Plugin: MEDIA
        */
        /* Module: Media */
        s.m_Media_c="";
        s.m_i("Media");
        
        
        /*Configure Media Module Functions */
        s.loadModule("Media");
        if(s.Media && settings.plugins.Media) {
            var MEDIA_SETTINGS = settings.plugins.Media;
            
            if(typeof MEDIA_SETTINGS.autoTrack != 'undefined') s.Media.autoTrack= MEDIA_SETTINGS.autoTrack;
            if(typeof MEDIA_SETTINGS.trackWhilePlaying != 'undefined') s.Media.trackWhilePlaying=MEDIA_SETTINGS.trackWhilePlaying;
            if(typeof MEDIA_SETTINGS.trackVars != 'undefined') s.Media.trackVars=MEDIA_SETTINGS.trackVars; // extra vars to send
            if(typeof MEDIA_SETTINGS.trackEvents != 'undefined') s.Media.trackEvents=MEDIA_SETTINGS.trackEvents; // extra events to send            
            if(typeof MEDIA_SETTINGS.trackMilestones != 'undefined') s.Media.trackMilestones=MEDIA_SETTINGS.trackMilestones;
            if(typeof MEDIA_SETTINGS.playerName != 'undefined') s.Media.playerName=MEDIA_SETTINGS.playerName;
            if(typeof MEDIA_SETTINGS.monitor != 'undefined') s.Media.monitor = MEDIA_SETTINGS.monitor;
            
            if(typeof MEDIA_SETTINGS.trackUsingContextData != 'undefined') 
                s.Media.trackUsingContextData = MEDIA_SETTINGS.trackUsingContextData;
            if(typeof MEDIA_SETTINGS.contextDataMapping != 'undefined') 
                s.Media.contextDataMapping = MEDIA_SETTINGS.contextDataMapping;
            
        }
        
        

        /********************************************************************
         *
         * channelManager v2.45
         *
         *******************************************************************/
        /*
         * channelManager v2.45 - Tracking External Traffic
         */
        s.channelManager=new Function()
        
        /*Configure channelManager */
        if(s.channelManager && settings.plugins.channelManager) {
            var CM_SETTINGS = settings.plugins.channelManager;
            
            if(typeof CM_SETTINGS.extraSearchEngines != 'undefined') s._extraSearchEngines= CM_SETTINGS.extraSearchEngines;
            if(typeof CM_SETTINGS.channelDomain != 'undefined') s._channelDomain= CM_SETTINGS.channelDomain;
            if(typeof CM_SETTINGS.channelParameter != 'undefined') s._channelParameter= CM_SETTINGS.channelParameter;
            if(typeof CM_SETTINGS.channelPattern != 'undefined') s._channelPattern= CM_SETTINGS.channelPattern;
            
            // calling plugin
            if(CM_SETTINGS._callOnLoad) {
                s.channelManager(
                             CM_SETTINGS.external_query_param, // campaign query string paramater
                             '', // url override
                             '', // cookie name
                             '' // no idea         
                );
            }
        } 
        
        /*
         * Plugin: getTimeToComplete 0.4.1 - return the time from start to stop (TWEAK from BWSolutions to handle multiple calls)
         */
        s.getTimeToComplete=new Function();        
        
    },

    /**
     * Method to add an event to the s.event string
	 * @param {string} ev The event name
	 * @param {string|number=} serializer The serializer used with event (optional).
	 * @return {this}
     */
    addEvent: function(ev,serializer) {
        var s = this.s;
        
        if(!s.events) s.events="";
        
        // adding the serializer
        if(serializer) ev += ":" + serializer;
        // removes the event if already exists (even if it has an serializer)
        this.removeEvent(ev);
        
        // then adds it back
        s.events = s.events.aVal(ev);
        
        return this;
    },
     
    /**
     * Method to remove an event to the s.event string
	 * @param {string} ev The event name
	 * @return {this}
     */
    removeEvent: function(ev) {
        var s = this.s;
        if(!s.events) return s;
        
        // remove event even when serializer present
        for (var cur_evs = s.events.split(","), remaining_evs = [], new_ev = ev.split(":")[0], i = 0; i < cur_evs.length; i++) {
            var cur_ev = cur_evs[i].split(":")[0];
            new_ev != cur_ev && remaining_evs.push(cur_evs[i])
        }
        s.events = remaining_evs.join(",");
        
        return this;
    },
     
    /**
     * Method to add a product to the product string
	 * Ex: addProduct(['c','n','q','t','event5=3434'], {type: 'incrementor', value: ['event4',5,345345]},{type: 'incrementor', value: ['event7',5,345345]})
	 *
	 * @param {Array} prod Array representing the product parameters: category,name,quantity,total,incrementor,merchandising
	 * @param {...Object} Object representing extra merchandising or incrementors
	 * @return {this}
	 *
     */
    addProduct: function(prod) {
        var s = this.s;
         
        // filling in uninitialized product string values
        for(var i =0; i<6;i++)if(typeof prod[i] == 'undefined') prod[i]="";
        // verifying if s.product initialized
        if(!s.products) s.products="";    
        
        // extract all events from product array and add them to events
        var incr_exps = (prod[4]?prod[4].split("|"):[]);
        var merch_exps = (prod[5]?prod[5].split("|"):[]);
        for(var i = 0; i< incr_exps.length; i++) {
            var ev = incr_exps[i].split("=")[0];
            if(ev)this.addEvent(ev);
        }
            
        // loop through the arguments that are extra, extract the events and the serializer, also add to incrementor expression
        if(arguments.length > 1) {
            for(var i =1; i < arguments.length; i++) {
                if(arguments[i].type == 'incrementor') {
                    var incr_param = arguments[i].value;
                    var ev = incr_param[0].split("=")[0];
                    if(ev) {
                        this.addEvent(ev,(typeof incr_param[1]!= 'undefined'?incr_param[1]:''));
                        incr_exps.push(incr_param[0]);
                    }
                }
                if(arguments[i].type == 'merchandising') {
                    var merch_param = arguments[i].value;
                    var merch = merch_param.split("=")[0];
                    if(merch) {
                        merch_exps.push(merch_param);
                    }
                }
                
            }
        }

        // adding prod array to string
        s.products = s.products.aVal(prod[0]+";"+prod[1]+";"+prod[2]+";"+prod[3]+";"+incr_exps.join('|')+";"+merch_exps.join('|'));

        return this;
    },
         
    /**
     * Method to purchase a product to the s.product string using event purchase
	 * Ex: purchaseProduct(['c','n','q','t','event5=3434'], {type: 'incrementor', value: ['event4',5,345345]},{type: 'incrementor', value: ['event7',5,345345]})
	 *
	 * @param {Array} prod Array representing the product parameters: category,name,quantity,total,incrementor,merchandising
	 * @param {...Object} Object representing extra merchandising or incrementors
	 * @return {this}
	 *
     */
    purchaseProduct: function(prod) {
        this.addEvent("purchase").addProduct.apply(this,arguments);    // sending all the arguments to add
        return this;
    },
         
    /**
     * Method to to add an event incrementor
	 * @param {string} ev Name of event
	 * @param {number} qty Quantity to increment by
	 * @return {this}
	 *
     */
    addEventIncrementor: function(ev,qty) {
        this.addEvent(ev);
        this.addProduct(['','','','',ev+"="+qty,'']);
        return this;
    },

    /**
     * Method to clean and remove empty references form dynamic variables 
     * @param {string} type Type of variable to remove: eVar or prop
     * @param {number} max_num Size of given variable space within the s object (usually 75)
     */
    cleanVariables: function(type,max_num){
        var s = this.s;
        for(var i = 1; i<=max_num;i++) {
            var value = s[type + i];

            if(value && value.substring(0,2) == "D=") {    // check if value is dynamic

                // verifying dynamic props
                var prop_regex = /c([0-9][0-9]?)/i;
                var r = value.match(prop_regex);
                if(r && (typeof s['prop'+r[1]] =="undefined" || s['prop'+r[1]] =="")){
                    value = value.replace(prop_regex,"");
                }
                
                // verifying dynamic evars
                var evar_regex = /v([0-9][0-9]?)/i;
                var r = value.match(evar_regex);
                if(r && (s['eVar'+r[1]] == "undefined" || s['eVar'+r[1]] =="")){
                    value = value.replace(evar_regex,"");
                }
                
                // cleaning value after filtering
                value=value.replace(/\=\+/gi,'=');
                if(value == "D=") s[type + i] = ""; 
            }
        }
    }

});

//-----------------------------------------------------
// Adding some Plugins to Omni Adapter Instances
//-----------------------------------------------------
_UT.addPlugins({

   /*
    * Plugin: MEDIA
    */
 
     /**
     * Call on video load
     * @param {string} mediaName Name of the video
     * @param {number} mediaLength Length of the video in seconds
     * @param {string} mediaPlayerName Name of media player (ex: YouTube)
     */
    startMovie: function(mediaName,mediaLength,mediaPlayerName) {
        var s = this.s;
        s.Media.open(mediaName,mediaLength,mediaPlayerName);
        this.playMovie(mediaName,0);
    },
    
     /**
     * Call on video resume from pause and slider release
     * @param {string} mediaName Name of the video
     * @param {number} mediaOffset Time in seconds of current offset
     */
    playMovie: function(mediaName,mediaOffset){
        var s = this.s;
        s.Media.play(mediaName,mediaOffset); //, segmentNum, segment, segmentLength);
    },
    
     /**
     * Call on video pause and slider grab
     * @param {string} mediaName Name of the video
     * @param {number} mediaOffset Time in seconds of current offset
     */
    stopMovie: function(mediaName,mediaOffset){
        var s = this.s;
        s.Media.stop(mediaName,mediaOffset);
    },
    
     /**
     * Call on video end
     * @param {string} mediaName Name of the video
     * @param {number} mediaOffset Time in seconds of current offset
     */
    endMovie: function(mediaName,mediaOffset){
        var s = this.s;
        this.stopMovie(mediaName,mediaOffset);
        s.Media.close(mediaName);
    }
         
}, 'omni');

//-----------------------------------------
// Augmenting some Native Objects
//-----------------------------------------

String.prototype.midtruncate = function s_trimString(len) {
    if (this.length == 0)
        return "";
    if (this.length > len) {
        tmp_oversize = this.length - len;
        return this.substr(0,(this.length/2)-(tmp_oversize/2)-2) + ".." + this.substr((this.length/2)+(tmp_oversize/2));
    }
    return this;
}
// Appends a value to a string delimited by strSeparator (default is CSV)
String.prototype.aVal= function(strValue, strSeparator){
    if (arguments.length > 0){
        if (arguments.length == 1) strSeparator=",";
        if (!this.valExists(strValue)){
            return (this.length>0?this+strSeparator:"")+strValue;
        }
    }
    return this;
}
// Removes a value from a string delimited by strSeparator (default is CSV)
String.prototype.rVal = function(strValue, strSeparator){
    if (arguments.length > 0){
        if (arguments.length == 1) strSeparator=",";
        if (this.valExists(strValue)){
            var tmp_csv_values = (this.replace(strValue,"").replace(strSeparator+strSeparator,strSeparator));
            if (tmp_csv_values.indexOf(strSeparator)==0){
                tmp_csv_values = tmp_csv_values.substring(1,tmp_csv_values.length);
            }
            return tmp_csv_values;
        }
    }
    return this;
}
String.prototype.valExists = function(strValue, strSeparator){
    var tmp_val_exists = false;
    if (arguments.length > 0){
        if (arguments.length == 1) strSeparator=",";
        if(typeof(this)!="undefined") {
            var tmp_csv_values = this.split(strSeparator);
            var i=0;
            do {
                tmp_val_exists = (tmp_csv_values[i] == strValue);
                i++;
            } while((i<tmp_csv_values.length) && !tmp_val_exists)
        }
    }
    return tmp_val_exists;
}

/**
 * trim 1.0 (trim characters at beginning and end of string - default trimming is on spaces)
 * @param String string  String.                            Mandatory
 * @param String         Character or string to trim off    Optional
 */
String.prototype.trim = function (){            
    if (this == "") return "";
    if(arguments.length > 0 && arguments[0] != "") {
        var str = arguments[0];
        expreg = new RegExp('(^'+ str +'*)|('+ str +'*$)', 'g');
    } else {
        expreg = /(^\s*)|(\s*$)/g;
    } 
    return this.replace(expreg,'');
} 