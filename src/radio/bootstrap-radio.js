/* options:
	to:			element			set the value of target element

	checked:	boolean			set radio checked or not
*/

!function ($) {
	// change radios status
	function checkRadio(_instance) {
		if(_instance.attr("checked") != null) return;

		// update all the radios
		var _name = _instance.attr("name");
		var _radios = $(".radio[data-toggle='radio'][name='" + _name + "']");
		_radios.removeAttr("checked");
		_instance.attr("checked", "checked");

		// update target element
		var _val = _instance.attr("data-value");
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
			checkRadio(_my);
		}
	});

	/*// change checkbox status
	function updateStatus(_instance, _checked) {
		if(_checked) {
			_instance.attr("checked", "checked");
		} else {
			_instance.removeAttr("checked", "checked");
		}
	}

	// update data to target status
	function updateTarget(_target, _checked) {
		if(_target != null) {
			_target.prop("checked", _checked);
		}
	}

	// click on the label
	$(document).on("click.bs.radio", "label", function(event){
		var _label = $(this);
		var _my = _label.find(".radio[data-toggle='radio']");
		var _checked = null;
		if(_my.length != 0) {			// find radio to go on
			var _target = $(_my.attr("data-to"));
			var _radio = _label.find("input[type='radio']");
			if(_radio.length != 0) {
				_checked = _radio.prop("checked");
			} else {
				_checked = !(_my.attr("checked") != null);
				updateTarget(_target, _checked);
			}
			updateStatus(_my, _checked);

			// change event
			_my.add(_target).change();
		}
	});
	*/
}(window.jQuery);