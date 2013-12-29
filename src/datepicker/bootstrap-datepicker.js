/* options:
	target:		all(default)	contains date & time picker
				time			time picker only
				date			date picker only
				month			month picker only
				year			year picker only
	to:			element			set the value of target element
	container:	string			set datepicker component container
	before:		string			set the date/time picker can't pass
	after:		string			set the date/time picker can't before
	goon:		boolean			default false. True will change value immediately when click. - TODO
*/

// init env
$._bc.vals.datepicker = new Object();
$._bc.vals.datepicker.index = 1;

// init function
!function ($) {
	// var
	var _instance = null;
	var _preventEvent = false;

	// Functions
	function refreshInstance(instance) {
		if(_instance != null) {
			var _type = _instance.getType();
			var _date = _instance.getDate();
			var _target = _instance.getTarget();
			var _preVal = _target.val();
			var _val = null;
			switch(_type) {
			case "year":
				_val = _date.getFullYear();
				break;
			case "month":
				_val = _date.getFullYear() + "-" + fillZero(_date.getMonth() + 1);
				break;
			case "date":
				_val = _date.getFullYear() + "-" + fillZero(_date.getMonth() + 1) + "-" + fillZero(_date.getDate());
				break;
			case "time":
				_val = fillZero(_date.getHours()) + ":" + fillZero(_date.getMinutes()) + ":" + fillZero(_date.getSeconds());
				break;
			default:
				_val = _date.getFullYear() + "-" + fillZero(_date.getMonth() + 1) + "-" + fillZero(_date.getDate()) + " ";
				_val += fillZero(_date.getHours()) + ":" + fillZero(_date.getMinutes()) + ":" + fillZero(_date.getSeconds());
				break;
			}
			_target.val(_val);
			_instance.remove();
			_instance = null;

			// trigger event
			if(_val != _preVal) {
				_target.change();
			}
		}
		_instance = instance;
	}
	function toDate(str) {
		if(str == null) {
			return new Date();
		}
		var _str = str.trim().replace(/-/g,"/");
		if(_str.match(/^\d{4}$/)) {
			_str = _str + "/01/01";
		} else if(_str.match(/^\d{4}\/\d{1,2}$/)) {
			_str = _str + "/01";
		} else if(_str.match(/^\d{1,2}:\d{1,2}:\d{1,2}$/)) {
			_str = "2013/11/14 " + _str;
		}
		var date = new Date(_str);
		if(date == null || isNaN(date)) {
			return new Date();
		}
		return date;
	}
	function getDaysOfMonth(date) {
		var _startDay, _days;
		var _date = new Date(date.getTime());
		_date.setMonth(_date.getMonth() + 1, 0);
		_days =  _date.getDate();
		_date.setDate(1);
		_startDay = _date.getDay();
		return [_startDay, _days];
	}
	function fillZero(str, len) {
		if(len == null) {
			len = 2;
		}
		var ret = str + "";
		while(ret.length < len) {
			ret = "0" + ret;
		}
		return ret;
	}
	function toString(date) {
		return	date.getFullYear() + "-" + fillZero(date.getMonth() + 1) + "-" + fillZero(date.getDate()) + " " +
				fillZero(date.getHours()) + ":" + fillZero(date.getMinutes()) + ":" + fillZero(date.getSeconds())
	}
	function plusDays(date, year, month, day) {
		if(month == null) {
			month = 0;
		}
		if(day == null) {
			day = 0;
		}
		var _ret = new Date(date.getTime());
		var _year = _ret.getFullYear();
		var _month = _ret.getMonth() + month + year * 12;
		var _date = _ret.getDate();

		_ret.setMonth(_month, 1);
		var _days = getDaysOfMonth(_ret)[1];
		if(_date <= _days) {
			_ret.setDate(_date);
		} else {
			_ret.setDate(_days);
		}

		_date = _ret.getDate() + day;
		_ret.setDate(_date);
		return _ret;
	}
	function setDays(date, year, month, day) {
		if(year == null) {
			year = date.getFullYear();
		}
		if(month == null) {
			month = date.getMonth();
		}
		if(day == null) {
			day = date.getDate();
		}
		var _ret = new Date(date.getTime());
		_ret.setFullYear(year, month, 1);
		var _days = getDaysOfMonth(_ret);
		if(day > _days) {
			day = _days;
		}
		_ret.setFullYear(year, month, day);
		return _ret;
	}
	function digitization(str, mix, max) {
		var _str = str + "";
		var _val = Number(_str);
		if(isNaN(_val) || _val == null) {
			_val = 0;
		}
		if(_val < mix) {
			_val = mix;
		}
		if(_val > max) {
			_val = max;
		}
		return _val;
	}
	// set the current date
	function getDateInRange(current, target, before, after) {
		if(before != null && target > before) {
			return new Date(before.getTime());
		}
		if(after != null && target < after) {
			return new Date(after.getTime());
		}
		return target;
	}

	// Datepicker Handler
	$(document).on("click.bs.datepicker", "[data-toggle='datepicker']", function(event){
		_preventEvent = true;
		var my = $(this);
		var _target = $(my.attr("data-to"));
			var target = _target.length != 0 ? _target : my;
		var _container = $(my.attr("data-container"));
			var container = target.parent();
			if(container.hasClass("input-group-btn")) {
				container = container.parent();
			}
			if(container.hasClass("input-group")) {
				container = container.parent();
			}
			container = _container.length != 0 ? _container : container;
		var _type = my.attr("data-type");
			var enable_yearpicker = false;
			var enable_monthpicker = false;
			var enable_datepicker = false;
			var enable_timepicker = false;
			switch(_type) {
			case "year":
				enable_yearpicker = true;
				break;
			case "month":
				enable_monthpicker = true;
				break;
			case "date":
				enable_datepicker = true;
				break;
			case "time":
				enable_timepicker = true;
				break;
			default:
				_type = "all";
				enable_datepicker = true;
				enable_timepicker = true;
			}
		var _date = target.val();
			var date = toDate(_date);
			var dateShadow = new Date(date.getTime());		// an date which is display the current view
			var dateCurrent = new Date(date.getTime());		// an date which is mark as current date
		var _before = my.attr("data-before");
			var before = _before == null ? null : toDate(_before);
		var _after = my.attr("data-after");
			var after = _after == null ? null : toDate(_after);

		// generate datepicker component
		var $container = $('<div class="bsc-datepicker">');
		var $yearpicker = $('<div class="yearpicker picker-group">');
			var $yearpicker_header = $('<div class="picker-header">');
				var $yearpicker_header_year_minus = $('<button class="btn btn-default minus" type="button">');
					$yearpicker_header_year_minus.html('<span class="glyphicon glyphicon-chevron-left"></span>');
				var $yearpicker_header_title = $('<h4>&nbsp;</h4>');
				var $yearpicker_header_year_plus = $('<button class="btn btn-default plus" type="button">');
					$yearpicker_header_year_plus.html('<span class="glyphicon glyphicon-chevron-right"></span>');
			var $yearpicker_body = $('<div class="picker-body picker-selectable clearfix">');
		var $monthpicker = $('<div class="monthpicker picker-group">');
			var $monthpicker_header = $('<div class="picker-header">');
				var $monthpicker_header_year_minus = $('<button class="btn btn-default minus" type="button">');
					$monthpicker_header_year_minus.html('<span class="glyphicon glyphicon-chevron-left"></span>');
				var $monthpicker_header_title = $('<h4>&nbsp;</h4>');
				var $monthpicker_header_year_plus = $('<button class="btn btn-default plus" type="button">');
					$monthpicker_header_year_plus.html('<span class="glyphicon glyphicon-chevron-right"></span>');
			var $monthpicker_body = $('<div class="picker-body picker-selectable clearfix">');
		var $datepicker = $('<div class="datepicker picker-group">');
			var $datepicker_header = $('<div class="picker-header">');
				var $datepicker_header_month_minus = $('<button class="btn btn-default minus" type="button">');
					$datepicker_header_month_minus.html('<span class="glyphicon glyphicon-step-backward"></span>');
				var $datepicker_header_title = $('<h4>&nbsp;</h4>');
				var $datepicker_header_month_plus = $('<button class="btn btn-default plus" type="button">');
					$datepicker_header_month_plus.html('<span class="glyphicon glyphicon-step-forward"></span>');
			var $datepicker_body = $('<div class="picker-body">');
				var $datepicker_body_description = $('<div class="datepicker-body-description clearfix">');
				var $datepicker_body_date = $('<div class="datepicker-body-value picker-selectable clearfix">');
		var $timepicker = $('<div class="timepicker picker-group clearfix">');
			var $timepicker_group_hours = $('<div class="timepicker-group">');
				var $timepicker_group_hours_input = $('<input class="form-control" type="text" />');
				var $timepicker_group_hours_minus = $('<button type="button" class="btn btn-default time-minus">');
					$timepicker_group_hours_minus.html('<span class="glyphicon glyphicon-minus"></span>');
				var $timepicker_group_hours_plus = $('<button type="button" class="btn btn-default time-plus">');
					$timepicker_group_hours_plus.html('<span class="glyphicon glyphicon-plus"></span>');
			var $timepicker_group_minutes = $('<div class="timepicker-group">');
				var $timepicker_group_minutes_input = $('<input class="form-control" type="text" />');
				var $timepicker_group_minutes_minus = $('<button type="button" class="btn btn-default time-minus">');
					$timepicker_group_minutes_minus.html('<span class="glyphicon glyphicon-minus"></span>');
				var $timepicker_group_minutes_plus = $('<button type="button" class="btn btn-default time-plus">');
					$timepicker_group_minutes_plus.html('<span class="glyphicon glyphicon-plus"></span>');
			var $timepicker_group_seconds = $('<div class="timepicker-group">');
				var $timepicker_group_seconds_input = $('<input class="form-control" type="text" />');
				var $timepicker_group_seconds_minus = $('<button type="button" class="btn btn-default time-minus">');
					$timepicker_group_seconds_minus.html('<span class="glyphicon glyphicon-minus"></span>');
				var $timepicker_group_seconds_plus = $('<button type="button" class="btn btn-default time-plus">');
					$timepicker_group_seconds_plus.html('<span class="glyphicon glyphicon-plus"></span>');

		$container.appendTo(container);
		$container.append($yearpicker);
			$yearpicker.append($yearpicker_header);
				$yearpicker_header.append($yearpicker_header_year_minus);
				$yearpicker_header.append($yearpicker_header_title);
				$yearpicker_header.append($yearpicker_header_year_plus);
			$yearpicker.append($yearpicker_body);
		$container.append($monthpicker);
			$monthpicker.append($monthpicker_header);
				$monthpicker_header.append($monthpicker_header_year_minus);
				$monthpicker_header.append($monthpicker_header_title);
				$monthpicker_header.append($monthpicker_header_year_plus);
			$monthpicker.append($monthpicker_body);
				$.each(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'], function(i, _month) {
					var $element = $('<span>');
					$element.attr("data-month", i);
					$element.text(_month);
					$monthpicker_body.append($element);
				});
		$container.append($datepicker);
			$datepicker.append($datepicker_header);
				$datepicker_header.append($datepicker_header_month_minus);
				$datepicker_header.append($datepicker_header_title);
				$datepicker_header.append($datepicker_header_month_plus);
			$datepicker.append($datepicker_body);
				$datepicker_body.append($datepicker_body_description);
					$.each(['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'], function(i, _description) {
						var $element = $('<span class="disabled">');
						$element.text(_description);
						$datepicker_body_description.append($element);
					});
				$datepicker_body.append($datepicker_body_date);
		$container.append($timepicker);
			$timepicker.append($timepicker_group_hours);
				$timepicker_group_hours.append($timepicker_group_hours_input);
				$timepicker_group_hours.append($timepicker_group_hours_minus);
				$timepicker_group_hours.append($timepicker_group_hours_plus);
			$timepicker.append('<span class="timepicker-spliter">:</span>');
			$timepicker.append($timepicker_group_minutes);
				$timepicker_group_minutes.append($timepicker_group_minutes_input);
				$timepicker_group_minutes.append($timepicker_group_minutes_minus);
				$timepicker_group_minutes.append($timepicker_group_minutes_plus);
			$timepicker.append('<span class="timepicker-spliter">:</span>');
			$timepicker.append($timepicker_group_seconds);
				$timepicker_group_seconds.append($timepicker_group_seconds_input);
				$timepicker_group_seconds.append($timepicker_group_seconds_minus);
				$timepicker_group_seconds.append($timepicker_group_seconds_plus);

		refreshInstance($container);
		var pos = target.offset();
		$container.offset({
			left: pos.left,
			top: pos.top + target.outerHeight(),
		}).click(function() {
			_preventEvent = true;
		});

		// bind data
		$container.getTarget = function() {
			return target;
		}
		$container.getType = function() {
			return _type;
		}
		$container.getDate = function() {
			//return dateShadow;
			return dateCurrent;
		}

		// page change event handler
			function refreshCurrentDate() {
				dateCurrent = getDateInRange(dateCurrent, dateShadow, before, after);
			}
			// switch picker view
			$datepicker_header_title.click(function() {
				$datepicker.slideUp();
				$monthpicker.slideDown();
			});
			$monthpicker_header_title.click(function() {
				$monthpicker.slideUp();
				$yearpicker.slideDown();
			});

			// year picker
			$yearpicker_header_year_minus.click(function() {
				dateShadow = plusDays(dateShadow, -20);
				refreshCurrentDate();
				draw();
			});
			$yearpicker_header_year_plus.click(function() {
				dateShadow = plusDays(dateShadow, 20);
				refreshCurrentDate();
				draw();
			});
			$yearpicker_body.on("click", "span:not(.disabled)", function() {
				var year = Number($(this).text());
				dateShadow = setDays(dateShadow, year);
				refreshCurrentDate();
				draw();

				if(!enable_yearpicker) {
					$yearpicker.slideUp();
					$monthpicker.slideDown();
				}
			});

			// month picker
			$monthpicker_header_year_minus.click(function() {
				dateShadow = plusDays(dateShadow, -1);
				refreshCurrentDate();
				draw();
			});
			$monthpicker_header_year_plus.click(function() {
				dateShadow = plusDays(dateShadow, 1);
				refreshCurrentDate();
				draw();
			});
			$monthpicker_body.on("click", "span:not(.disabled)", function() {
				var _month = Number($(this).attr("data-month"));
				dateShadow = setDays(dateShadow, null, _month);
				refreshCurrentDate();
				draw();

				if(!enable_monthpicker) {
					$monthpicker.slideUp();
					$datepicker.slideDown();
				}
			});

			// date picker
			$datepicker_header_month_minus.click(function() {
				dateShadow = plusDays(dateShadow, 0, -1);
				refreshCurrentDate();
				draw();
			});
			$datepicker_header_month_plus.click(function() {
				dateShadow = plusDays(dateShadow, 0, 1);
				refreshCurrentDate();
				draw();
			});
			$datepicker_body.on("click", "span:not(.inactive):not(.disabled)", function() {
				var _date = Number($(this).text());
				dateShadow = setDays(dateShadow, null, null, _date);
				refreshCurrentDate();
				draw();
			});

			// time picker
			// hours
			$timepicker_group_hours_minus.click(function() {
				dateShadow.setHours(dateShadow.getHours() - 1);
				refreshCurrentDate();
				draw();
			});
			$timepicker_group_hours_plus.click(function() {
				dateShadow.setHours(dateShadow.getHours() + 1);
				refreshCurrentDate();
				draw();
			});
			$timepicker_group_hours_input.change(function() {
				var _val = digitization($(this).val(), 0, 23);
				dateShadow.setHours(_val);
				refreshCurrentDate();
				draw();
			});
			// minutes
			$timepicker_group_minutes_minus.click(function() {
				dateShadow.setMinutes(dateShadow.getMinutes() - 1);
				refreshCurrentDate();
				draw();
			});
			$timepicker_group_minutes_plus.click(function() {
				dateShadow.setMinutes(dateShadow.getMinutes() + 1);
				refreshCurrentDate();
				draw();
			});
			$timepicker_group_minutes_input.change(function() {
				var _val = digitization($(this).val(), 0, 59);
				dateShadow.setMinutes(_val);
				refreshCurrentDate();
				draw();
			});
			// seconds
			$timepicker_group_seconds_minus.click(function() {
				dateShadow.setSeconds(dateShadow.getSeconds() - 1);
				refreshCurrentDate();
				draw();
			});
			$timepicker_group_seconds_plus.click(function() {
				dateShadow.setSeconds(dateShadow.getSeconds() + 1);
				refreshCurrentDate();
				draw();
			});
			$timepicker_group_seconds_input.change(function() {
				var _val = digitization($(this).val(), 0, 59);
				dateShadow.setSeconds(_val);
				refreshCurrentDate();
				draw();
			});

		// show needed components
		if(!enable_yearpicker) {
			$yearpicker.hide();
		}
		if(!enable_monthpicker) {
			$monthpicker.hide();
		}
		if(!enable_datepicker) {
			$datepicker.hide();
		}
		if(!enable_timepicker) {
			$timepicker.hide();
		}

		// fill date in the view
		function draw() {
			var _year = dateShadow.getFullYear();
				var year_start = _year - _year % 20;
				var year_end = year_start + 19;
			var _month = dateShadow.getMonth();
				var month = _month + 1;
			var _date = dateShadow.getDate();
				var days = getDaysOfMonth(dateShadow);
			var _hours = dateShadow.getHours();
			var _minutes = dateShadow.getMinutes();
			var _seconds = dateShadow.getSeconds();

			// year picker
			$yearpicker_header_title.text(year_start + " - " + year_end);
			$yearpicker_body.empty();
			for(var i = year_start ; i <= year_end ; i += 1) {
				var $element = $('<span>');
				$element.text(i);
				if(i == _year) {
					$element.addClass('active');
				}
				if(		(before != null && before.getFullYear() < i) || 
						( after != null && after.getFullYear() > i)) {
					$element.addClass('disabled');
				}
				$yearpicker_body.append($element);
			}

			// month picker
			$monthpicker_header_title.text(_year);
			$monthpicker_body.find("span").each(function(i, ele) {
				var $element = $(ele);
				$element.removeClass("active");
				$element.removeClass("disabled");
				if(i == _month) {
					$element.addClass("active");
				}
				if(		(before != null && before.getFullYear() * 100 + before.getMonth() < _year * 100 + i) || 
						( after != null && after.getFullYear() * 100 + after.getMonth() > _year * 100 + i)) {
					$element.addClass('disabled');
				}
			});

			// date picker
			$datepicker_header_title.text(_year + "-" + fillZero(month));
			$datepicker_body_date.empty();
			for(var i = 0; i < days[0] ; i+= 1) {
				var $element = $('<span class="inactive">');
				$datepicker_body_date.append($element);
			}

			for(var i = 1; i <= days[1] ; i+= 1) {
				var $element = $('<span>');
				$element.text(fillZero(i));
				if(i == _date) {
					$element.addClass('active');
				}
				if(		(before != null && before.getFullYear() * 10000 + before.getMonth() * 100 + before.getDate() < _year * 10000 + _month * 100 + i) || 
						( after != null && after.getFullYear() * 10000 + after.getMonth() * 100 + after.getDate() > _year * 10000 + _month * 100 + i)) {
					$element.addClass('disabled');
				}
				$datepicker_body_date.append($element);
			}

			// time picker
			$timepicker_group_hours_input.val(fillZero(_hours));
			$timepicker_group_minutes_input.val(fillZero(_minutes));
			$timepicker_group_seconds_input.val(fillZero(_seconds));
		}
		draw();

		// get date by view
		function viewToDate() {
			var _year = $yearpicker_body.find("span.active");
		}
	});

	// hide datapicker if exist
	$(document).on("click.bs.datepicker", function(event){
		if(_preventEvent == true) {
			_preventEvent = false;
		} else {
			refreshInstance(null);
		}
	});
}(window.jQuery);