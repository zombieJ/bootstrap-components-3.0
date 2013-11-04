$.extend({_bc: new Object()});
// init vars for bootstrap-component use
$._bc.vals = new Object();

// get the setting & callback
$._bc.vars = function(options, callback){
	var vars = new Object();
	if(typeof(options) == 'object') {
		vars.options = options;
	} else if(typeof(options) == 'function') {
		vars.callback = options;
	} else if(typeof(options) == 'string') {
		vars.key = options;
	}
	if(typeof(callback) == 'function') {
		vars.callback = callback;
	}
	return vars;
}
// get the option by key and return default if not set
$._bc.get = function(options, key, defaultValue) {
	if(options != null) {
		if(options[key] != null) {
			return options[key];
		} else {
			return defaultValue;
		}
	} else {
		return defaultValue;
	}
}

// get a simple list to add / remove element
$._bc.list = function() {
	var list = new Array();
	list.add = function(obj) {
		list.push(obj);
	}
	list.remove = function(obj) {
		var loc = null;
		for (var i = 0; i < list.length; i++) {
			var _o = list[i];
			if(obj == _o) {
				loc = i;
				break;
			}
		}
		if(loc != null) list.splice(loc, 1);
	}
	return list;
}

// get the broswer version
var userAgent = navigator.userAgent.toLowerCase();
$._bc.browser = { 
version: (userAgent.match( /.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/ ) || [])[1], 
safari: /webkit/.test( userAgent ), 
opera: /opera/.test( userAgent ), 
msie: /msie/.test( userAgent ) && !/opera/.test( userAgent ), 
mozilla: /mozilla/.test( userAgent ) && !/(compatible|webkit)/.test( userAgent ) 
};