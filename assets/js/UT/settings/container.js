
//###########################################################################
// UT CONTAINER
//###########################################################################
	  
	// using container to create the objects
	_ut_container = new _UT.Container(
		{settings: GA_SETTINGS, map: GA_MAP, processor: GA_PROCESSOR}
	);

	// using container to fire
	_ut_container.call('fire',false,{
		__usePrevious: false,
		__useWindow: true
	});
	
//###########################################################################
// Additional Functions
//###########################################################################

	function s_trackPageview(params) {
		if(typeof params.__usePrevious == "undefined") params.__usePrevious = false;
		if(typeof params.__useWindow == "undefined") params.__useWindow = true;

		_ut_container.call('fire',
						   {},
						   params
		);
	}

	function s_trackFormErrors(formErrors) {
		_ut_container.call('fire',
						   {__include: ['_ut_omni']},
						   {
								__usePrevious: false,
								__useWindow: true,
							   	s_formErrors: formErrors,
								forceTrackLink: 'form_errors'
							}
		);
	}
	
	function s_trackAJAXPage(path) {
		// catching undefined paths
		if(!path)	path = "/undefined";
		
		// removing the current domain
		var regex = new RegExp("^https?://" + document.location.host, "i");
		path = path.replace(regex, "");
		
		// making sure path starts with a slash
		if(path.indexOf("/") != 0) path = "/" + path;
		
		s_trackPageview({
			s_isAjax: true,
		   	s_path: path,
			__usePrevious: false,
			__useWindow: false
		});
	}