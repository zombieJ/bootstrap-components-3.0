/* options:
	to:			element			set the value of target element
*/

!function ($) {
	$.fn.extend({
		radio:function(options){
			// get options
			var _my = $(this);
			var vars = $._bc.vars(options);
			var _options = vars.options;
			var _checked = $._bc.get(_options, "checked", null);
			var _to = $._bc.get(_options, "to", null);
			var _val = $._bc.get(_options, "value", null);

			// set target element
			if(_to != null) {
				_my.attr("data-to", _to);
			}

			// set radio value
			if(_val != null) {
				_my.attr("data-value", _val);
			}

			// set the value of radio and it will change target element too.
			if(_checked === true) {
				checkRadio(_my);
			} else if(_checked === false) {
				uncheckRadio(_my);
			}
		}
	});
	// change radios status
	function checkRadio(_instance) {
		if(_instance.attr("checked") != null) return;

		updateTarget(_instance, true);
	}
	// remove radios status
	function uncheckRadio(_instance) {
		if(_instance.attr("checked") == null) return;

		updateTarget(_instance, false);
	}
	// update target input
	function updateTarget(_instance, checked) {
		var _val = _instance.attr("data-value");

		// update all the radios
		var _name = _instance.attr("name");
		var _radios = $(".radio[data-toggle='radio'][name='" + _name + "']");
		_radios.removeAttr("checked");

		// if checked, update radio check status
		if(checked) {
			_instance.attr("checked", "checked");
		} else {
			_val = "";
		}

		// update target element
		var _target = $(_instance.attr("data-to"));
		var _pre_val = _target.val();
		_target.val(_val);

		// change event
		_instance.change();
		if(_pre_val != _val) {
			_target.change();
		}
	}

	// click radio
	$(document).on("click.bs.radio", ".radio[data-toggle='radio']", function(event){
		var _my = $(this);
		checkRadio(_my);
	});

	// click label who contains radio
	$(document).on("click.bs.radio", "label", function(event){
		var _label = $(this);
		var _my = _label.find(".radio[data-toggle='radio']");
		if(_my.length != 0) {			// find checkbox to go on
			var _disabled = _my.attr("disabled") != null;
			if(!_disabled) checkRadio(_my);
		}
	});
}(window.jQuery);