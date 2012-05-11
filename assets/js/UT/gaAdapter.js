/***************************************************************
 *  Google Analytics (GA) Adapter
 ***************************************************************/
// creating global exception handler
_UT.exceptionHandler = _UT.exceptionHandler || new _UT.Exception();

/**
 * UT Google Analytics Adapter.
 * @extends _UT.Adapter
 */
_UT.gaAdapter = _UT.Adapter.extend({
                                   
    // Adapter info
    info: {
        version: "1.1.1",
        date:    "2012-03-12",
        author: "DD"
    },                       
                               
    /**
     * Google Adapter
     * @constructor
     */
    init: function (settings, processor, map) {
        try {
            // calling the UT Adapter function to clean up
            this._super(settings, processor, map);
            
            // tracker name
            this.tracker = this.id

            // load _ga library
            window['_gaq'] = window['_gaq'] || [];

			if(typeof _gat == "undefined")
				(function() {
					var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
					ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
					var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
				})();
            
            // figuring out if prod or dev should be used
            var tmp_prod_urls = settings.prod_urls.split(",");
            for(var i=0;i<tmp_prod_urls.length;i++) tmp_prod_urls[i] = ".*" + tmp_prod_urls[i] + ".*";
            var regex_prod = new RegExp(tmp_prod_urls.join("|"), "i");

            var tmp_dev_urls = settings.dev_urls.split(",");
            for(var i=0;i<tmp_dev_urls.length;i++) tmp_dev_urls[i] = ".*" + tmp_dev_urls[i] + ".*";
            var regex_dev = new RegExp(tmp_dev_urls.join("|"), "i");

			if( regex_dev.test(window.location.host)) {
                // configuring GA
                _gaq.push([this.tracker + '._setAccount', settings.dev_account]);
            } else if( regex_prod.test(window.location.host)) {
                // configuring GA
                _gaq.push([this.tracker + '._setAccount', settings.prod_account]);
            } else {
                // configuring GA
                _gaq.push([this.tracker + '._setAccount', settings.dev_account]);
            }

            // Tracking sub and crossdomain
            if(settings.domainName) _gaq.push([this.tracker + '._setDomainName', settings.domainName]);
            if(typeof settings.allowLinker == 'boolean') _gaq.push([this.tracker + '._setAllowLinker', settings.allowLinker]);
			
			// e-Commerce
			this.transactions = [];
			this.transactions_completed = [];

            // always return true
            return true;
        } catch (e) {
            _UT.exceptionHandler.push(e);
        }
    },

    /**
     * method to fire beacon for Google Analytics
     */
    fire: function (vars) {

        // calling the UT Adapter function to clean up
        this._super(vars);
        
        if (this.error) {
            console.debug("ERROR");
            return false;
        }
        
		// fire pageview
        if(!this.isBlocked()) {
            if(this.hasPageName()) {
                 _gaq.push([this.tracker + '._trackPageview', this.getPageName()]);
            } else {
                _gaq.push([this.tracker + '._trackPageview']);
            }
        }
		
		// firing ecommerce
		if(this.transactions.length > 0) {
			this.sendTransaction();
		}
		
        this.unblockTrackPageView();
    },

    /**
     * method to fire track Event
     */    
    trackEvent: function(params) {
        params.unshift(this.tracker + '._trackEvent');
        _gaq.push(params);
    },
    /**
     * method to fire track Event
     */    
    setCustomVar: function(params) {
        params.unshift(this.tracker + '._setCustomVar');
        _gaq.push(params);
    },

    /**
     * method to add Transaction Info
     */    
    addTransaction: function(trans,prods) {
		
		// transaction object
		var transaction = {};
		
		// adding Transaction
		transaction.info = [this.tracker + '._addTrans',
				   trans.order_id,		// order ID - required
				   trans.store_name,	// affiliation or store name
				   trans.total,			// total - required
				   trans.tax,			// tax
				   trans.shipping,		// shipping
				   trans.city,			// city
				   trans.province,		// state or province
				   trans.country		// country
				   ];
		
		// adding products
		transaction.items = [];
		for(var i=0; i<prods.length;i++) {
			var prod = prods[i];
			transaction.items.push([this.tracker + '._addItem',
					   trans.order_id,	// order ID - required
					   prod.sku,		// SKU/code - required
					   prod.name,		// product name
					   prod.variation,	// category or variation
					   prod.price,		// unit price - required
					   prod.quantity	// quantity - required
					   ]);
		}

		// sending transaction
		this.transactions.push(transaction);
    },
	
    /**
     * method to send Transaction Info into Google Analytics
     */    
    sendTransaction: function(trans,prods) {
		
		// if trans and prod included, then add them to transaction object
		if(trans || prods){
			this.addTransaction(trans,prods)
		} 
		
		while(this.transactions.length >= 0) {
			var transaction = this.transactions.pop();

			// adding Transaction
			_gaq.push(transaction.info);			
					  
			// adding products
			for(var i=0; i<=transaction.items.length; i++) {
				_gaq.push(transaction.items[i]);
			}
			
			// sending transaction
			_gaq.push([this.tracker + '._trackTrans']); //submits transaction to the Analytics servers
			
			// saving transaction
			this.transactions_completed.push(transaction);
		}

    },

    /**
     * BblockTrackPageView
     */
    unblockTrackPageView: function() {
        this._blocked = false;
    },
    blockTrackPageView: function() {
        this._blocked = true;
    },
    isBlocked: function() {
        return !(!this._blocked);
    },
    
    /**
     * setPageName
     */    
     setPageName: function(pn) {
         this.pageName = pn;
     },
     resetPageName: function() {
         this.pageName = '';
     },
     hasPageName: function() {
         if(this.pageName) return true;
         return false;
     },
     getPageName: function() {
         return this.pageName?this.pageName:"";
     }
     
    /**
     * getTrackerName
     */ 
     ,getTrackerName: function() {
         var self = this;
         var trackerName = "";
        _gaq.push(function() {
          var pageTracker = _gat._getTrackerByName(self.id); // Gets the default tracker.
          trackerName = pageTracker._getName();
        });
		return trackerName;  
     }

    /**
     * getTrackerAccount
     */ 
     ,getTrackerAccount: function() {
         var self = this;
         var trackerAccount = "";
        _gaq.push(function() {
          var pageTracker = _gat._getTrackerByName(self.id); // Gets the default tracker.
          trackerAccount = pageTracker._getAccount();
        });
		return trackerAccount;
     }
	 
    /**
     * getTrackerVersion
     */ 
     ,getTrackerVersion: function() {
         var self = this;
         var trackerVersion = "";
        _gaq.push(function() {
          var pageTracker = _gat._getTrackerByName(self.id); // Gets the default tracker.
          trackerVersion = pageTracker._getVersion();
        });
		return trackerVersion;
     }

    /**
     * getVisitorCustomVar
     */ 
     ,getVisitorCustomVar: function(index) {
         var self = this;
         var visitorCustomVar1Value = "";
        _gaq.push(function() {
          var pageTracker = _gat._getTrackerByName(self.id); // Gets the default tracker.
          visitorCustomVar1Value = pageTracker._getVisitorCustomVar(index);
        });
		return visitorCustomVar1Value;
     }


});