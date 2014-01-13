/* options:
	to:			element			set the value of target element
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
			var _disabled = _my.attr("disabled") != null;
			if(!_disabled) checkRadio(_my);
		}
	});
}(window.jQuery);