/* options:
	to:			element			set the value of target element
	min:		number			set min value
	max:		number			set max value
*/

!function ($) {
	var _instance = null;
	var _mouseLeft = 0;
	$(document).on("mousedown.bs.slider", "button[data-toggle='slider']", function(event){
		_instance = $(this);
		_mouseLeft = event.pageX - _instance.offset().left;
	});
	$(document).on("mouseup.bs.slider", function(event){
		_instance = null;
	});
	$(document).on("mousemove.bs.slider", function(event){
		if(_instance != null) {
			var _target = $(_instance.attr("data-to"));
			var _pre_val = Number(_target.val());
			var _process = _instance.parent();
			var _min = Number(_instance.attr("data-min"));
			var _max = Number(_instance.attr("data-max"));
			var _process_width = _process.outerWidth();
			var _instance_width = _instance.outerWidth();
			var _total_width = _process_width - _instance_width;
			var _instance_left = event.pageX - _process.offset().left - _mouseLeft;
			if(_min == null || isNaN(_min)) {
				_min = 0;
			}
			if(_max == null || isNaN(_max)) {
				_max = 100;
			}
			if(_instance_left < 0) {
				_instance_left = 0;
			}
			if(_instance_left > _total_width) {
				_instance_left = _total_width;
			}
			_instance.css("margin-left", _instance_left);
			var _ptg = _instance_left / _total_width;
			var _val = _min + (_max - _min) * _ptg;
			_instance.val(_val).attr("data-value", _val);
			_target.val(_val);
			if(_pre_val != _val) {
				_target.change();
			}
		}
	});
}(window.jQuery);