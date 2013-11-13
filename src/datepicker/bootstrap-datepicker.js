/* options:
	target:		all(default)	contains date & time picker
				time			time picker only
				date			date picker only
				month			month picker only
				year			year picker only
	to:			string			set the value of target element
	container:	string			set datepicker component container
*/

// TODO:	add default date
//			add disabled date range

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
						var $element = $('<span>');
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
			return dateShadow;
		}

		// page change event handler
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
				draw();
			});
			$yearpicker_header_year_plus.click(function() {
				dateShadow = plusDays(dateShadow, 20);
				draw();
			});
			$yearpicker_body.on("click", "span", function() {
				var year = Number($(this).text());
				dateShadow = setDays(dateShadow, year);
				draw();

				if(!enable_yearpicker) {
					$yearpicker.slideUp();
					$monthpicker.slideDown();
				}
			});

			// month picker
			$monthpicker_header_year_minus.click(function() {
				dateShadow = plusDays(dateShadow, -1);
				draw();
			});
			$monthpicker_header_year_plus.click(function() {
				dateShadow = plusDays(dateShadow, 1);
				draw();
			});
			$monthpicker_body.on("click", "span", function() {
				var _month = Number($(this).attr("data-month"));
				dateShadow = setDays(dateShadow, null, _month);
				draw();

				if(!enable_monthpicker) {
					$monthpicker.slideUp();
					$datepicker.slideDown();
				}
			});

			// date picker
			$datepicker_header_month_minus.click(function() {
				dateShadow = plusDays(dateShadow, 0, -1);
				draw();
			});
			$datepicker_header_month_plus.click(function() {
				dateShadow = plusDays(dateShadow, 0, 1);
				draw();
			});
			$datepicker_body.on("click", "span:not(.inactive)", function() {
				var _date = Number($(this).text());
				dateShadow = setDays(dateShadow, null, null, _date);
				draw();
			});

			// time picker
			// hours
			$timepicker_group_hours_minus.click(function() {
				dateShadow.setHours(dateShadow.getHours() - 1);
				draw();
			});
			$timepicker_group_hours_plus.click(function() {
				dateShadow.setHours(dateShadow.getHours() + 1);
				draw();
			});
			$timepicker_group_hours_input.change(function() {
				var _val = digitization($(this).val(), 0, 23);
				dateShadow.setHours(_val);
				draw();
			});
			// minutes
			$timepicker_group_minutes_minus.click(function() {
				dateShadow.setMinutes(dateShadow.getMinutes() - 1);
				draw();
			});
			$timepicker_group_minutes_plus.click(function() {
				dateShadow.setMinutes(dateShadow.getMinutes() + 1);
				draw();
			});
			$timepicker_group_minutes_input.change(function() {
				var _val = digitization($(this).val(), 0, 59);
				dateShadow.setMinutes(_val);
				draw();
			});
			// seconds
			$timepicker_group_seconds_minus.click(function() {
				dateShadow.setSeconds(dateShadow.getSeconds() - 1);
				draw();
			});
			$timepicker_group_seconds_plus.click(function() {
				dateShadow.setSeconds(dateShadow.getSeconds() + 1);
				draw();
			});
			$timepicker_group_seconds_input.change(function() {
				var _val = digitization($(this).val(), 0, 59);
				dateShadow.setSeconds(_val);
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
				$yearpicker_body.append($element);
			}

			// month picker
			$monthpicker_header_title.text(_year);
			$monthpicker_body.find("span").each(function(i, ele) {
				var $element = $(ele);
				$element.removeClass("active");
				if(i == _month) {
					$element.addClass("active");
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
/**	$(document).on("click.bootstrapcomponent.datepicker", "[data-toggle='datepicker']", function(event){
		var _index = $._bc.vals.datepicker.index;
		$._bc.vals.datepicker.index++;

		var my = $(this);
		var $input = $(this);

		var date = new Date();

		var _target = my.attr("data-to");
		if(_target != null) $input = $(_target);

		var enable_datepicker = false;
		var enable_timepicker = false;
		var _type = my.attr("data-type");
		if(_type == null) _type = "all";
		if(_type == "all" || _type == "dater") enable_datepicker = true;
		if(_type == "all" || _type == "timer") enable_timepicker = true;

		function dd(str) {						// format "7" number as "07"
			str = str + "";
			if(str.length == 1)
				return "0" + str;
			return str;
		}
		function formatDate(date, outer) {		// get string as date, outer is the output text
			var str_date = "";
			var show_date = outer == null || (enable_datepicker && outer == true);
			var show_time = outer == null || (enable_timepicker && outer == true);
			if(show_date)
				str_date = date.getFullYear() + "-" + dd(date.getMonth()+1) + "-" + dd(date.getDate()) + (show_time ? " " : "");
			if(show_time)
				str_date += dd(date.getHours()) + ":" + dd(date.getMinutes()) + ":" + dd(date.getSeconds());
			return str_date;
		}
		function getDate(str) {					// get date by input string
			var _date;
			try {
				if(str.match(/^\d+:\d+:\d+/)) str = "1990-09-03 " + str;
				_date = new Date(Date.parse(str.replace(/-/g, "/")));
				if(_date == "Invalid Date" || _date == null)
					return date;
				else
					return _date;
			} catch(err) {
				return date;
			}
		}

		// ----- start click logic -----
		{
			// record pre date
			var _pre_date = $input.val();

			// get current date
			var _date = getDate($input.val());

			if(my.data("datepicker") == null) {
				var $datepicker = $("<div class='datepicker modal'>");
				// insert datepick. Add to my parent, if it is in .input-append.
				if(my.parent().hasClass("input-append"))
					$datepicker.insertAfter(my.parent());
				else
					$datepicker.insertAfter(my);

				var pos = $input.position();
				$datepicker.css("left", pos.left + "px");
				$datepicker.css("top", (pos.top + $(this).outerHeight()) + "px");

				my.data("datepicker", true);
				// date model
				var $date = $("<div class='datepicker-date'>");
				var $date_head  = $("<div class='datepicker-head'>");
				var $date_left = $("<button type='button' class='btn btn-primary btn-small datepicker-month-left'><i class='icon-chevron-left  icon-white'></i></button>");
				var $date_content = $("<h5></h5>");
				var $date_right = $("<button type='button' class='btn btn-primary btn-small datepicker-month-right'><i class='icon-chevron-right  icon-white'></i></button>");
				var $date_body = $("<div class='datepicker-body'>");
				var $date_days = $("<div class='datepicker-days'>");
				$date_days.append("<span>Sun</span>");
				$date_days.append("<span>Mon</span>");
				$date_days.append("<span>Tue</span>");
				$date_days.append("<span>Wed</span>");
				$date_days.append("<span>Thur</span>");
				$date_days.append("<span>Fri</span>");
				$date_days.append("<span>Sat</span>");
				var $date_dates = $("<div datepicker-dates>");

				$date.appendTo($datepicker);
				$date_head.appendTo($date);
				$date_left.appendTo($date_head);
				$date_content.appendTo($date_head);
				$date_right.appendTo($date_head);
				$date_body.appendTo($date);
				$date_days.appendTo($date_body);
				$date_dates.appendTo($date_body);
				if(!enable_datepicker) $date.hide();

				$date_left.data("m", -1);
				$date_right.data("m", 1);
				$date_left.add($date_right).click(function(){
					var value = $(this).data("m");
					var _mdate = new Date(getDate(genDate()));
					_mdate.setMonth(_mdate.getMonth() + value);
					if(value == -1 && _date.getMonth() == _mdate.getMonth()) {
						_mdate.setDate(0);
					} else if(value == 1 && (_date.getMonth() + 2) % 12 == _mdate.getMonth()) {
						_mdate.setDate(0);
					}
					_date = _mdate;
					setDateView();
				});

				function setDateView() {
					function getStartDay(date) {
						var _date = new Date(getDate(formatDate(date)));
						_date.setDate(1);
						return _date.getDay();
					}
					function getTotalDays(date) {
						var _date = new Date(getDate(formatDate(date)));
						_date.setDate(1);
						_date.setMonth(_date.getMonth() + 1);
						_date.setDate(0);
						return _date.getDate();
					}

					$date_content.html(_date.getFullYear() + "-" + dd(_date.getMonth()+1));

					$date_dates.empty();
					var _gsd = getStartDay(_date);
					for(var i = 0 ; i < _gsd ; i++) {
						$btn = $("<button type='button' class='btn'></button>");
						$btn.css("visibility", "hidden");
						$btn.appendTo($date_dates);
					}
					var _gtd = getTotalDays(_date);
					for(var i = 1 ; i <= _gtd ; i++) {
						$btn = $("<button type='button' class='btn'>"+i+"</button>");
						$btn.appendTo($date_dates);

						// set target date as mark
						if(i == _date.getDate()) {
							$btn.addClass("btn-warning");
						}

						// click to reset date
						$btn.click(function(){
							$date_dates.find("button").removeClass("btn-warning");
							$(this).addClass("btn-warning");
							_date = new Date(genDate());
						});
					}
				}
				setDateView();

				// spliter
				if(enable_datepicker && enable_timepicker) {
					var $split = $("<div class='datepicker-split'></div>");
					$split.appendTo($datepicker);
				}

				// time model
				var $time = $("<div class='datepicker-time'>");
				function genTimeUnit(type, max) {
					var $unit = $("<div class='datepicker-"+type+"'>");
					var $input = $("<input type='text' maxlength='2' />");
					var $unit_minus = $("<button type='button' class='btn'><i class='icon-minus'></i></button>");
					var $unit_plus = $("<button type='button' class='btn'><i class='icon-plus'></i></button>");

					$input.data("max", max);
					$unit_minus.data("m", -1);
					$unit_plus.data("m", 1);

					function fresh() {
						var num = parseInt($input.val(), 10);
						if(isNaN(num)) num = 0;
						if(num < 0) num = 0;
						if(num >= max) num = max - 1;
						$input.val(dd(num));
					}

					$unit_minus.add($unit_plus).click(function(){
						var value = $(this).data("m");
						var max = $input.data("max");
						var num = parseInt($input.val(), 10);
						num += value;
						$input.val(dd(num));
						fresh();
					});

					$input.blur(function(){
						fresh();
					});

					$input.appendTo($unit);
					$unit_minus.appendTo($unit);
					$unit_plus.appendTo($unit);

					return $unit;
				}
				var $hour = $(genTimeUnit("hour", 24));
				var $minute = $(genTimeUnit("minute", 60));
				var $second = $(genTimeUnit("second", 60));
				var $span1 = $("<span>:</span>");
				var $span2 = $("<span>:</span>");
				$hour.find("input").val(dd(_date.getHours()));
				$minute.find("input").val(dd(_date.getMinutes()));
				$second.find("input").val(dd(_date.getSeconds()));

				$time.appendTo($datepicker);
				$hour.appendTo($time);
				$span1.appendTo($time);
				$minute.appendTo($time);
				$span2.appendTo($time);
				$second.appendTo($time);
				if(!enable_timepicker) $time.hide();

				// function gen date with UI view
				function genDate() {
					var str = $date_content.html()+"-"+dd($date_body.find(".btn-warning").html());
					str += " " + dd($hour.find("input").val()) + ":" + dd($minute.find("input").val()) + ":" + dd($second.find("input").val());
					return str;
				}

				// remove when click body content
				$datepicker.click(function(event){
					event.stopPropagation();
				});
				$(document).bind('click.datepicker' + _index, function(event){
					var _stop = my.data("stop");
					my.data("stop", null);

					if(_stop)
						return;

					$datepicker.remove();
					my.data("datepicker", null);
					$input.val(formatDate(getDate(genDate()), true));
					$(document).unbind('click.datepicker' + _index);

					if(_pre_date != $input.val())
						$input.change();
				});
			}
		}
	});**/
}(window.jQuery);