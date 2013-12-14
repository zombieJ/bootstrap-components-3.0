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
			// get options
			var _my = $(this);
			var vars = $._bc.vars(options);
			var _options = vars.options;
		}
	});

	// change checkbox status
	function updateStatus(_instance, _checked) {
		if(_checked) {
			_instance.attr("checked", "checked");
			_instance.addClass("glyphicon").addClass("glyphicon-ok");
		} else {
			_instance.removeAttr("checked", "checked");
			_instance.removeClass("glyphicon").removeClass("glyphicon-ok");
		}
	}

	// update data to target status
	function updateTarget(_instance, _checked) {
		var _target = $(_instance.attr("data-to"));
		_target.prop("checked", _checked);
	}

	// click on the label
	$(document).on("click.bs.checkbox", "label", function(event){
		var _label = $(this);
		var _my = _label.find(".checkbox[data-toggle='checkbox']");
		var _checked = null;
		if(_my.length != 0) {			// find checkbox to go on
			var _checkbox = _label.find("input[type='checkbox']");
			if(_checkbox.length != 0) {
				_checked = _checkbox.prop("checked");
			} else {
				_checked = !(_my.attr("checked") != null);
				updateTarget(_my, _checked);
			}
			updateStatus(_my, _checked);
		}
	});

	// click on the checkbox without label
	$(document).on("click.bs.checkbox", ".checkbox[data-toggle='checkbox']", function(event){
		var _my = $(this);
		var _checked = null;
		if(_my.closest("label").length == 0) {
			_checked = !(_my.attr("checked") != null);
			updateStatus(_my, _checked);
			updateTarget(_my, _checked);
		}
	});
}(window.jQuery);