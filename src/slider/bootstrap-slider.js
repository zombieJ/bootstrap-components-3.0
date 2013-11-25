/* options:
	to:			element			set the value of target element
	min:		number			set min value
	max:		number			set max value
*/

!function ($) {
	function index(element) {
		return element.parent().find("button").index(element);
	}
	function getLeft(element) {
		return Number(element.css("margin-left").replace("px", ""));
	}


	/*function getValue(element) {
		var _total_left = 0;
		var _element = $(element);
		while(_element.length != 0) {
			_total_left += getLeft(_element);
			_element = _element.prev();
		}
		return _total_left;
	}*/

	var _instance = null;
	var _mouseLeft = 0;
	$(document).on("mousedown.bs.slider", "button[data-toggle='slider']", function(event){
		_instance = $(this);
		_mouseLeft = event.pageX - _instance.offset().left;

		var _process = _instance.parent();
		var _sliders = _process.find("button");
		var _index = index(_instance);
		for(var i = 0 ; i < _index ; i += 1) {
			var _element = $(_sliders[i]);
			_mouseLeft += _element.outerWidth() + getLeft(_element);
		}
	});
	$(document).on("mouseup.bs.slider", function(event){
		_instance = null;
	});
	$(document).on("mousemove.bs.slider", function(event){
		if(_instance != null) {
			// limit the range of min & max value
			var _min = Number(_instance.parent().attr("data-min"));
			var _max = Number(_instance.parent().attr("data-max"));
			if(_min == null || isNaN(_min)) _min = 0;
			if(_max == null || isNaN(_max)) _max = 100;

			// calculate enable range
			var _process = _instance.parent();
			var _sliders = _process.find("button");
			var _len = _sliders.length;
			var _index = index(_instance);
			var _value = 0;
			var _total_width = _process.outerWidth();
			var _value_range = _total_width;
			for(var i = 0 ; i < _index ; i += 1) {
				var _element = $(_sliders[i]);
				var _left = getLeft(_element);
				var _width = _element.outerWidth();
				_value_range -= _left + _width;
				_total_width -= _width;
				_value += _left;
			}
			_value_range -= _instance.outerWidth();
			_total_width -= _instance.outerWidth();
			for(var i = _index + 1 ; i < _len ; i += 1) {
				var _element = $(_sliders[i]);
				var _width = _element.outerWidth();
				_value_range -= getLeft(_element) + _width;
				_total_width -= _width;
			}

			var _instance_left = event.pageX - _process.offset().left - _mouseLeft;
			if(_instance_left < 0) _instance_left = 0;
			if(_instance_left > _value_range) _instance_left = _value_range;
			_value += _instance_left;
			_instance.css("margin-left", _instance_left);

			// generate value
			var _target = $(_instance.attr("data-to"));
			var _pre_val = Number(_target.val());
			var _ptg = _value / _total_width;
			var _val = _min + (_max - _min) * _ptg;
			_instance.val(_val).attr("data-value", _val);
			_target.val(_val);
			if(_pre_val != _val) {
				_target.change();
			}
		}
	});
}(window.jQuery);