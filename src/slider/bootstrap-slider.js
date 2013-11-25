/* options:
	to:			element			set the value of target element
	min:		number			set min value
	max:		number			set max value
*/

!function ($) {
	function getLeft(element) {
		return Number(element.css("margin-left").replace("px", ""));
	}
	function getValue(element) {
		var _total_left = 0;
		var _element = $(element);
		while(_element.length != 0) {
			_total_left += getLeft(_element);
			_element = _element.prev();
		}
		return _total_left;
	}

	var _instance = null;
	var _mouseLeft = 0;
	$(document).on("mousedown.bs.slider", "button[data-toggle='slider']", function(event){
		_instance = $(this);
		_mouseLeft = event.pageX - _instance.offset().left;
		var _element = $(_instance.prev());
		while(_element.length != 0) {
			_mouseLeft += _element.outerWidth() + getLeft(_element);
			_element = _element.prev();
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

			// set the position of silder
			var _target = $(_instance.attr("data-to"));
			var _pre_val = Number(_target.val());
			var _process = _instance.parent();
			var _total_width = _process.outerWidth();
			var _instance_left = event.pageX - _process.offset().left - _mouseLeft;
			_instance.parent().find("button").each(function() {
				_total_width -= $(this).outerWidth();
			});
			if(_instance_left < 0) _instance_left = 0;
			if(_instance_left > _total_width) _instance_left = _total_width;
			_instance.css("margin-left", _instance_left);

			// set the value of slider
			var _ptg = getValue(_instance) / _total_width;
			var _val = _min + (_max - _min) * _ptg;
			_instance.val(_val).attr("data-value", _val);
			_target.val(_val);
			if(_pre_val != _val) {
				_target.change();
			}
		}
	});
}(window.jQuery);