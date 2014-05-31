/* options:
	to:			element			set the value of target element

	min:		number			set min value
	max:		number			set max value

	number:		number			set the number of the slider blocks
	value:		array			set initial value of sliders. If set value without number, it will trade length of them as the number.
	single:		boolean			default false. Move slider will not influence other sliders if true.
	mixed:		boolean			default false. Slider can move every where with out order if true and single will always be true in this mode.
*/

!function ($) {
	$.fn.extend({
		slider:function(options){
			if(options == null) options = {number: 1};
			$(this).each(function() {
				// get options
				var _my = $(this);
				var vars = $._bc.vars(options);
				var _options = vars.options;

				// set min / max value
				var _min = $._bc.get(_options, "min", 0);
				var _max = $._bc.get(_options, "max", 100);
				_my.attr("data-min", _min);
				_my.attr("data-max", _max);

				// get values
				var _values = $._bc.get(_options, "value", []);
				var _single = $._bc.get(_options, "single", false);
				var _mixed = $._bc.get(_options, "mixed", false);

				// set number
				var _number = _options.number;
				if(_number == null && _values.length != 0) {
					_number = _values.length;
				}
				// create sliders with given number
				if(_number != null) {
					_my.empty();
					for(var i = 0 ; i < _number ; i += 1) {
						var $slider = $("<button type='button' class='btn btn-primary slider' data-toggle='slider'>");
						_my.append($slider);
					}
				}

				// mark as enhanced slider
				_my.attr("data-slider-container", "");
				if(_single) _my.attr("data-slider-single", "");
				if(_mixed) _my.attr("data-slider-mixed", "");

				// create the background between sliders
				var _sliders = _my.find("button[data-toggle='slider']");
				{
					var _len = _sliders.length;
					for(var i = _len - 1 ; i > 0  ; i -= 1) {
						var $bac = $("<div data-toggle='slider-background'>");
						$bac.attr("data-from", i - 1);
						$bac.attr("data-to", i);
						_my.prepend($bac);
					}
				}

				// set default value & set margin-left as left
				{
					var _len = _values.length;
					var _default = _len == 0 ? _min : _values[_len - 1];
					$.each(_sliders, function(i, ele) {
						var _element = $(ele);
						var _val = i < _len ? _values[i] : _default;
						setValue(_element, _val);

						var _style = _element.attr("style");
						if(_style != null) {
							_element.attr("style", _style.replace(/margin-left/g, "left"));
						}
					});
				}

				// refresh background for user draw color
				refreshBackfround(_my);
			});
		}
	});

	// dynamic controller without handler
	function index(element) {
		return element.parent().find("button[data-toggle='slider']").index(element);
	}
	function getLeft(element) {
		var _process = element.parent();
		if(_process.attr("data-slider-container") == null) {
			return Number(element.css("margin-left").replace("px", ""));
		} else {
			return Number(element.css("left").replace("px", ""));
		}
	}
	function getWidth(element) {
		var _width = element.outerWidth();
		if(element.parent().attr("data-slider-container") != null) {
			var _mgnLeft = Number(element.css("margin-left").replace("px", ""));
			_width += _mgnLeft * 2;
		}
		return _width;
		
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
		var _mixed = _process.attr("data-slider-mixed") != null;
		var _value = 0;
		var _total_width = _process.outerWidth() - 1;
		if(_mixed) {
			_total_width -= getWidth(_instance);
		} else {
			$.each(_sliders, function(i, ele) {
				var _element = $(ele);
				_total_width -= getWidth(_element);
			});
		}

		if(_process.attr("data-slider-container") == null) {
			for(var i = 0 ; i <= _index ; i += 1) {
				var _element = $(_sliders[i]);
				var _left = getLeft(_element);
				_value += _left;
			}
		} else {
			_value = getLeft(_instance);
			if(!_mixed) {
				for(var i = 0 ; i < _index ; i += 1) {
					var _element = $(_sliders[i]);
					_value -= getWidth(_element);
				}
			}
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
			_total_width -= getWidth(_element);
		});
		var _my_left = _total_width * (value - _min) / (_max - _min);
		for(var i = 0 ; i < _index ; i += 1) {
			var _element = $(_sliders[i]);
			_my_left += getWidth(_element);
		}
		if(_process.attr("data-slider-container") == null) {
			_instance.css("margin-left", _my_left);
		} else {
			_instance.css("left", _my_left);
		}
		_instance.val(value).attr("data-value", value);
	}
	function doStart(_instance, event) {
		_mouseLeft = event.pageX - _instance.offset().left;

		var _process = _instance.parent();
		if(_process.attr("data-slider-container") == null) {
			var _sliders = _process.find("button[data-toggle='slider']");
			var _index = index(_instance);
			for(var i = 0 ; i < _index ; i += 1) {
				var _element = $(_sliders[i]);
				_mouseLeft += getWidth(_element) + getLeft(_element);
			}
		}
	}
	function doMove(_instance, event, recv) {
		// calculate enable range
		var _process = _instance.parent();
		var _sliders = _process.find("button[data-toggle='slider']");
		var _len = _sliders.length;
		var _index = index(_instance);
		var _total_width = _process.outerWidth() - 1;
		if(_process.attr("data-slider-container") == null) {	// run as simple mode
			$.each(_sliders, function(i, ele) {
				var _element = $(ele);
				_total_width -= getWidth(_element);
			});
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
		} else {												// run as enhance mode
			var _mixed = _process.attr("data-slider-mixed") != null;
			var _single = _mixed || _process.attr("data-slider-single") != null;
			var _pre_left = getLeft(_instance);

			// move slider
			var _value_start = 0;
			var _value_end =_total_width - getWidth(_instance);

			if(!_mixed) {
				if(_index > 0) {// start
					var _prev = $(_sliders[_index - 1]);
					_value_start = getLeft(_prev) + getWidth(_prev);
				}
				if(_index < _len - 1) {
					if(_single) {
						var _next = $(_sliders[_index + 1]);
						_value_end = getLeft(_next) - getWidth(_instance);
					} else {
						var _next = $(_sliders[_index + 1]);
						var _last = $(_sliders[_len - 1]);
						_value_end = _total_width - (getLeft(_last) - getLeft(_instance)) - getWidth(_last);
					}
				}
			}

			var _instance_left = event.pageX - _process.offset().left - _mouseLeft;
			if(_instance_left < _value_start) _instance_left = _value_start;
			if(_instance_left > _value_end) _instance_left = _value_end;
			_instance.css("left", _instance_left);

			// move other after sliders
			if(!_single) {
				var _dis = _instance_left - _pre_left;
				for(var i = _index + 1 ; i < _len ; i += 1) {
					var _element = $(_sliders[i]);
					_element.css("left", (getLeft(_element) + _dis));
				}
			}
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
	function refreshBackfround(_instance) {
		var _process = $(_instance);
		if(_process.attr("data-slider-container") == null) {
			_process = _process.parent();
		}
		var _sliders = _process.find("button[data-toggle='slider']");
		var _lenSliders = _sliders.length;
		var _backgrounds = _process.find("div[data-toggle='slider-background']");
		var _lenBackgrounds = _backgrounds.length;
		for(var i = 0 ; i < _lenBackgrounds ; i += 1) {
			var _bac = $(_backgrounds[i]);
			var _prev = $(_sliders[i]);
			var _next = $(_sliders[i + 1]);
			var _left = getLeft(_prev) + getWidth(_prev) * 0.5;
			var _right = getLeft(_next) + getWidth(_next) * 0.5;
			var _width = _right - _left;

			_bac.css("left", _left);
			_bac.outerWidth(_width);
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

			// refresh background for user draw color
			refreshBackfround(_instance);
		}
	});
	$(document).on("mouseup.bs.slider", function(event){
		if(event.button == 0) {
			_instance = null;
		}
	});
}(window.jQuery);