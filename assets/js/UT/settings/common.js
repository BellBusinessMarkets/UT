//###########################################################################
// COMMON TO ALL SOLUTIONS
//###########################################################################

// INFO
_ut_INFO = {
		date:	"2012-05-04",
		author: "DD"
};

// DEFAULTS - different for each domain, sub-domain - DONT DELETE ANY VARIABLE HERE
s_dev_urls = '';
s_prod_urls = 'bellbusinessmarkets.github.com';
s_ga_prod_account = "UA-31166244-1";
s_ga_dev_account = "UA-31166244-1";
s_internal_search_param = "";
s_campaign_query_param = '';
s_internal_campaign_query_param = '';

// DOMAIN SPECIFIC
var s_domain_settings = [
						 
	/* bellbusinessmarkets.github.com */
	{
//		s_prod_urls: '',
//		s_dev_urls: '' +
//					'',
//		s_ga_prod_account: 	'XXXXXXXX-1',
//		s_ga_dev_account:	'XXXXXXXX-2',
//		s_internal_search_param: '',
//		s_internal_campaign_query_param: '',
//		s_campaign_query_param: '',

	}

];

// looping through the domain settings
for(var i =0;i<s_domain_settings.length;i++){
	var settings = s_domain_settings[i];
	var base_dev_urls = "localhost";
	if( s_domainMatches(settings.s_prod_urls || "" ) || s_domainMatches(settings.s_dev_urls || "" )){
		
		if(typeof settings.s_dev_urls != "undefined")					s_dev_urls = base_dev_urls + "," + settings.s_dev_urls;
		if(typeof settings.s_prod_urls != "undefined")					s_prod_urls = settings.s_prod_urls;
			
		if(typeof settings.s_ga_prod_account != "undefined")			s_ga_prod_account = settings.s_ga_prod_account;
		if(typeof settings.s_ga_dev_account != "undefined")				s_ga_dev_account = settings.s_ga_dev_account;
		
		if(typeof settings.s_company != "undefined")					s_company = settings.s_company;
		if(typeof settings.s_internal_search_param != "undefined")		s_internal_search_param = settings.s_internal_search_param;
		if(typeof settings.s_campaign_query_param != "undefined")		s_campaign_query_param = settings.s_campaign_query_param;
		if(typeof settings.s_internal_campaign_query_param != "undefined")		
				s_internal_campaign_query_param = settings.s_internal_campaign_query_param;

		break; // exit out of loop
	}
	
}

function s_domainMatches(list) {
	var cur_domain = window.location.hostname;
	var domains = list.split(",");
	for(var i=0;i<domains.length;i++) {
		if(cur_domain.indexOf(domains[i]) != -1) return true;
	}
	return false;
}


//-----------------------------------------
// Adding some Constants
//-----------------------------------------
_UT.myConstants = {
		server_error   : "errors:Server Error - code ", // STR_SERVER_ERROR
		page_not_found  : "errors:Page Not Found - Error 404", // STR_PAGE_NOT_FOUND
		pagename_undefined  : "errors:Page Name - Undefined", // STR_PAGENAME_UNDEFINED
		undefined    : "undefined", // UNDEFINED
		unknown   : "Unknown", // UNDEFINED
		channel_limit  : 100, // CHANNEL_STR_LIMIT
		pagename_limit : 100, // PAGENAME_STR_LIMIT
		prop_limit  : 100, // PROPS_STR_LIMIT
		evar_limit  : 255, // EVARS_STR_LIMIT
		url_timeout_delay  : 800, // URL_TIMEOUT_DELAY
		img_beacon_delay : 600, // IMGBEACON_CHECK_DELAY
		img_beacon_ie_limit: 2083, // IMGBEACON_IE_LIMIT
		expire_at_visit: 0, // EXPIRE AT THE VISIT
		no_timeout_func: "no timeout", // NO_TIME_OUT_FUNCTION
		//end of array                
		EOA : "EOA"
}

// InPage vars
_ut_ARGS = {
		// Core
	
		// Generic
        sPN: ["", ["s_pageName", "sPN"]],
		
		// Page-Specific
		sPS: ["",["sPS","s_page_state","s_PageState","s_pageState"]], //page state
		sEID: ["", ["sEID","s_errorID","s_errorId"]], // Error ID
		sEF: ["", ["s_formErrors"]],
		sPath: ["", ["s_path"]],
		
		// not available as variable
		forceTrackLink: ["", ["forceTrackLink"]],
	
		eof:"eof"
    };

// common processor
_ut_PROCESSOR = function (args) {
		var data = this.data;
		var settings = this.settings;
		
		// Some helper variables
		data.pageNameSuffix = "";
		data.sec_1 = "";
		data.sec_2 = "";
		data.sec_3 = "";
		data.page = "";
		data.products = [];
		data.sAN = "";

		//** PAGENAME / HIERARCHY ***
		
		function s_setPageNameParts(pn) {
			if(pn) {
				var pn_parts = pn.split(":");
	
				if(pn_parts.length >= 2) 	data.sec_1 = pn_parts[0];
				if(pn_parts.length >= 3)	data.sec_2 = pn_parts[1];
				if(pn_parts.length >= 4)	data.sec_3 = pn_parts[2];
				data.page = pn_parts[pn_parts.length-1];
	
			}
		}
		s_setPageNameParts(args.sPN);


		//** PAGESTATE ***
		if(args.sPS) {
			data.pageNameSuffix += ":" + args.sPS; // adding pagestate to name in case multiple sent on same page
			
			// deconstructing pageState
			if(args.sPS.match(/^(\d{3}|A\d{2})-[0-3]-(\d{1}|\w{1}|1[0-3])$/)!=null){
					var s_psArray = args.sPS.split("-")
					var action = s_psArray[0];
					var actionType = s_psArray[1];
					var actionResult = s_psArray[2];
					
					data.sAN = (!action?"000":action+"") + "";
					
					if(!args.sEF) { // if form Error, then dont send events
						switch(actionType){
								case "0":    
									//single step action
									data.isSingleStepAction = true;
									
								break;
								case "1": 
									// action started
									data.isActionStarted = true;
								break;
								case "2":    
									// action completed
									data.isActionCompleted = true;
								break;
						}
						
						switch(actionResult){
								case "0":    
	
								break;
								case "1":   
									// action succeeded
									data.isActionSucceeded = true;
								   
								break;
								case "2":
									// action failed
									data.isActionFailed = true; 
									
								break;
								case "3":
									// action delayed
									data.isActionDelayed = true;
									
								break;
								case "4": 
									// system error
									data.isSystemError = true;
								break;   
								
	
							}
					}
			}
			
			// special pagestates
			 switch(args.sPS.toLowerCase()) {
				 
				//server error processing
				case "server error":
					if (args.sEID == "404"){
						data.is404ServerError = true;
						data.sPN = _UT.myConstants.page_not_found;
						// fixing pagename
						s_setPageNameParts(data.sPN);
						data.pageNameSuffix = "";
					} else if (args.sEID == "600"){
						data.is600ServerError = true;
						data.pageNameSuffix += ":" + args.sEID;
					} else {
						data.isServerError = true;
						data.sPN = _UT.myConstants.server_error + args.sEID;
						// fixing pagename
						s_setPageNameParts(data.sPN);
						data.pageNameSuffix = "";
					}
				break;	
				 
			 }
			
		}

		//** PAGE URL ***
		data.sURL = document.location.href;  // with query string  
		
		//* Internal search term ***
		data.sIST = _UT.getQueryParam(settings.search_query_param).toLowerCase();

		//* Internal Campaign 
		data.int_campaign = _UT.getQueryParam(settings.campaign.internal.query_param);

		//* Campaign 
		data.campaign = _UT.getQueryParam(settings.campaign.external.query_param);
		
		//*** FORM VALIDATION ***
		if (args.sEF) {
			//s.flushPVL8r();
			data.sEF = args.sEF.trim().trim('/');
			data.pageNameSuffix += ":validation";
			data.isFormValidationError = true;
		}
		

		//*** File Info ***
		data.JsFileInfo = _UT.sprintf("_UT-%s:%s:%s/%s-%s:%s:%s/s-%s:%s", 
															 _UT.info.version, _UT.info.author, _UT.info.date.replace(/-/g,""), 
															 settings.type,
															 this.info.version, this.info.author, this.info.date.replace(/-/g,""),
															 settings.info.author, settings.info.date.replace(/-/g,""));
        return data;
    };