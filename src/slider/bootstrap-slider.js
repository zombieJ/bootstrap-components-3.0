/* options:
	to:			element			set the value of target element

	min:		number			set min value
	max:		number			set max value

	number:		number			set the number of the slider blocks
	value:		array			set initial value of sliders
*/

!function ($) {
	$.fn.extend({
		slider:function(options){
			// get options
			var _my = $(this);
			var vars = $._bc.vars(options);
			var _options = vars.options;

			// set min / max value
			var _min = $._bc.get(_options, "min", 0);
			var _max = $._bc.get(_options, "max", 100);
			_my.attr("data-min", _min);
			_my.attr("data-max", _max);

			// set number
			var _number = _options.number;
			if(_number != null) {
				_my.empty();
				for(var i = 0 ; i < _number ; i += 1) {
					var $slider = $("<button type='button' class='btn btn-primary slider' data-toggle='slider'>");
					_my.append($slider);
				}
			}

			// mark as enhanced slider
			_my.attr("data-slider-container", "");

			// set default value
			var _values = $._bc.get(_options, "value", []);
			var _sliders = _my.find("button[data-toggle='slider']");
			{
				var _len = _values.length;
				var _default = _len == 0 ? _min : _values[_len - 1];
				$.each(_sliders, function(i, ele) {
					var _element = $(ele);
					var _val = i < _len ? _values[i] : _default;
					setValue(_element, _val);
				});
			}
		}
	});

	// dynamic controller without handler
	function index(element) {
		return element.parent().find("button[data-toggle='slider']").index(element);
	}
	function getLeft(element) {
		return Number(element.css("margin-left").replace("px", ""));
	}

	var _instance = null;
	var _mouseLeft = 0;
	function getValue(_instance) {
		// limit the range of min & max value
		var _min = Number(_instance.parent().attr("data-min"));
		var _max = Number(_instance.parent().attr("data-max"));
		if(_min == null || isNaN(_min)) _min = 0;
		if(_max == null || isNaN(_max)) _max = 100;

		// prepare value condition
		var _process = _instance.parent();
		var _sliders = _process.find("button[data-toggle='slider']");
		var _len = _sliders.length;
		var _index = index(_instance);
		var _value = 0;
		var _total_width = _process.outerWidth();
		for(var i = 0 ; i <= _index ; i += 1) {
			var _element = $(_sliders[i]);
			var _left = getLeft(_element);
			var _width = _element.outerWidth();
			_total_width -= _width;
			_value += _left;
		}
		for(var i = _index + 1 ; i < _len ; i += 1) {
			var _element = $(_sliders[i]);
			var _width = _element.outerWidth();
			_total_width -= _width;
		}

		// generate value
		var _ptg = _value / _total_width;
		var _val = _min + (_max - _min) * _ptg;
		return _val;
	}
	function setValue(_instance, value) {
		var _process = _instance.parent();

		// limit the range of min & max value
		var _min = Number(_process.attr("data-min"));
		var _max = Number(_process.attr("data-max"));
		if(_min == null || isNaN(_min)) _min = 0;
		if(_max == null || isNaN(_max)) _max = 100;

		// prepare value condition
		var _sliders = _process.find("button[data-toggle='slider']");
		var _index = index(_instance);
		var _total_width = _process.outerWidth();
		$.each(_sliders, function(i, ele) {
			var _element = $(ele);
			_total_width -= _element.outerWidth();
		});
		var _my_left = _total_width * (value - _min) / (_max - _min);
		for(var i = 0 ; i < _index ; i += 1) {
			var _element = $(_sliders[i]);
			_my_left += _element.outerWidth();
		}
		_instance.css("margin-left", _my_left + "px");
		_instance.val(value).attr("data-value", value);
	}
	function doStart(_instance, event) {
		_mouseLeft = event.pageX - _instance.offset().left;

		var _process = _instance.parent();
		var _sliders = _process.find("button[data-toggle='slider']");
		var _index = index(_instance);
		for(var i = 0 ; i < _index ; i += 1) {
			var _element = $(_sliders[i]);
			_mouseLeft += _element.outerWidth() + getLeft(_element);
		}
	}
	function doMove(_instance, event, recv) {
		// calculate enable range
		var _process = _instance.parent();
		var _sliders = _process.find("button[data-toggle='slider']");
		var _len = _sliders.length;
		var _index = index(_instance);
		var _total_width = _process.outerWidth();
		$.each(_sliders, function(i, ele) {
			var _element = $(ele);
			_total_width -= _element.outerWidth();
		});
		if(_process.attr("data-slider-container") == null) {
			var _value_range =_total_width;
			for(var i = 0 ; i < _index ; i += 1) {
				var _element = $(_sliders[i]);
				_value_range -= getLeft(_element);
			}
			for(var i = _index + 1 ; i < _len ; i += 1) {
				var _element = $(_sliders[i]);
				_value_range -= getLeft(_element);
			}

			var _instance_left = event.pageX - _process.offset().left - _mouseLeft;
			if(_instance_left < 0) _instance_left = 0;
			if(_instance_left > _value_range) _instance_left = _value_range;
			_instance.css("margin-left", _instance_left);
		} else {
			// TODO: set position of slider!
		}
	}
	function doChange(_instance) {
		var _target = $(_instance.attr("data-to"));
		var _pre_val = Number(_target.val());
		var _val = getValue(_instance);
		_instance.val(_val).attr("data-value", _val);
		_target.val(_val);
		if(_pre_val != _val) {
			_target.change();
		}
	}
	$(document).on("mousedown.bs.slider", "button[data-toggle='slider']", function(event){
		if(event.button == 0) {
			_instance = $(this);
			doStart(_instance, event);
		}
	});
	$(document).on("mousemove.bs.slider", function(event){
		if(_instance != null) {
			doMove(_instance, event);
			doChange(_instance);

			// loop trigger change event
			var _process = _instance.parent();
			var _sliders = _process.find("button[data-toggle='slider']");
			var _len = _sliders.length;
			var _index = index(_instance);
			$.each(_sliders, function(i, element) {
				if(i != _index) {
					doChange($(element));
				}
			});
		}
	});
	$(document).on("mouseup.bs.slider", function(event){
		if(event.button == 0) {
			_instance = null;
		}
	});
}(window.jQuery);