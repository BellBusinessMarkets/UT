//###########################################################################
//GOOGLE ANALYTICS TEST
//###########################################################################

// SETTINGS - Solution and Library settings
var GA_SETTINGS = {
    id: '_ut_ga',
    type: 'ga',
	
	// Settings info
	info: _ut_INFO,

    /**
     * Constants - default args which will be available in processor and mapping
     *  args should be of form: "keyword" : [ (string)default_value , (array)keyword_array ]
     * the args keywords will be available in the args object
     */
    args: _ut_ARGS,

    /**
     * Solution Specific settings
     */
    prod_account: s_ga_prod_account,
    prod_urls: s_prod_urls,
    dev_account: s_ga_dev_account,
    dev_urls: s_dev_urls,
	
//	domainName: _UT.cookie.getCookieDomain(3), // ### basic tracking ### CAN BE SOURCE OF PROBLEM for CustomVars
//	allowLinker: '',
	
	/* 
	 * NON-ADAPTER settings - some need to be present in other adapters settings using the same processor
	 */	
	gmt_offset: "-5",
	search_query_param: s_internal_search_param,
	campaign: {
		external: {
			query_param: s_campaign_query_param,
			expiry: 30
		},
		internal: {
			query_param: s_internal_campaign_query_param
		},
		organic_prefix : "org:",
		referral_prefix : "ref:"
	},	

	eof:"eof"
};

// PROCESSOR - Business Logic to create Data object
var GA_PROCESSOR = _ut_PROCESSOR

// MAP - use the adapter helper functions or the Solution object directly
var GA_MAP = function (data) {

		if(data.is404ServerError) {
			this.setPageName("/404/" + data.sURL );
		}
		
		// EVENTS
		//this.trackEvent(['Technology', 'JS Version', data.JsFileInfo, null, true]);
		this.setCustomVar([ 5, // This custom var is set to slot #1.  Required parameter.
			'JS', // The name acts as a kind of category for the user activity.  Required parameter.
			data.JsFileInfo, // This value of the custom variable.  Required parameter.
			3 // Sets the scope to page-level.  Optional parameter.
		]);
		
		
		if(data.sPath) {
			this.setPageName("/ajax"+data.sPath);
			
			// ### this does not work since using the same slot on same page
			this.setCustomVar([ 1, // This custom var is set to slot #1.  Required parameter.
				'Page Type', // The name acts as a kind of category for the user activity.  Required parameter.
				'AJAX', // This value of the custom variable.  Required parameter.
				3 // Sets the scope to page-level.  Optional parameter.
			]);
		} else {
			this.setCustomVar([ 1, // This custom var is set to slot #1.  Required parameter.
				'Page Type', // The name acts as a kind of category for the user activity.  Required parameter.
				'HTML', // This value of the custom variable.  Required parameter.
				3 // Sets the scope to page-level.  Optional parameter.
			]);
		}

		// if forceTrackLink ==> dont fire pageview
		if(data.forceTrackLink) this.blockTrackPageView();
    };
