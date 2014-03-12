/* options:
	to:			element			set the value of target element(only for checkbox)

	checked:	boolean			set checkbox checked or not
*/

!function ($) {
	$.fn.extend({
		checkbox:function(options){
			// get options
			var _my = $(this);
			var vars = $._bc.vars(options);
			var _options = vars.options;
			var _checked = $._bc.get(_options, "checked", null);
			var _to = $._bc.get(_options, "to", null);
				var _target = _to != null ? $(_to) : $(_my.attr("data-to"));

			// set target element
			if(_to != null) {
				_my.attr("data-to", _to);
			}

			// set the value of checkbox and it will change target element too.
			if(_checked != null) {
				updateStatus(_my, _checked);
				updateTarget(_target, _checked);
			}
		}
	});

	// change checkbox status
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
			if(_target.is("[type='checkbox']") || _target.is("[type='radio']")) {
				_target.prop("checked", _checked);
			} else {
				_target.val(_checked);
			}
		}
	}

	// click on the label
	$(document).on("click.bs.checkbox.label", "label", function(event) {
		var _label = $(this);
		var _my = _label.find(".checkbox[data-toggle='checkbox']");
		var _checked = null;
		if(_my.length != 0) {			// find checkbox to go on
			var _disabled = _my.attr("disabled") != null;
			var _target = $(_my.attr("data-to"));
			var _checkbox = _label.find("input[type='checkbox']");
			if(_disabled) {
				if(_checkbox.length != 0) {
					_checked = _my.attr("checked") != null;
					_checkbox.prop("checked", _checked);
				}
			} else {
				if(_checkbox.length != 0) {
					_checked = _checkbox.prop("checked");
				} else {
					_checked = !(_my.attr("checked") != null);
					updateTarget(_target, _checked);
				}
			}
			updateStatus(_my, _checked);

			// change event
			_my.add(_target).change();
		}
	});

	// click on the checkbox without label
	$(document).on("click.bs.checkbox", ".checkbox[data-toggle='checkbox']", function(event){
		var _my = $(this);
		var _target = $(_my.attr("data-to"));
		var _checked = null;
		if(_my.closest("label").length == 0) {
			_checked = !(_my.attr("checked") != null);
			updateStatus(_my, _checked);
			updateTarget(_target, _checked);

			// change event
			_my.add(_target).change();
		}
	});

	// select all
	function elementValue(ele, val) {
		var _my = $(ele);
		if(_my.is("input[type='checkbox']")) {
			if(val != null) _my.prop("checked", val);
			return _my.prop("checked");
		} else {
			if(val != null) _my.checkbox({checked: val});
			return _my.attr("checked") == "checked";
		}
	}
	$(document).on("change.bs.checkbox_selectAll", "[data-checkbox-all]", function(event){
		var _name = $(this).attr("data-checkbox-all");
		var _value = elementValue(this);
		$("[data-checkbox-entity='" + _name + "']").each(function() {
			elementValue(this, _value);
		});
	});
	$(document).on("change.bs.checkbox_selectAll", "[data-checkbox-entity]", function(event){
		var _name = $(this).attr("data-checkbox-entity");
		var _checked = true;

		$("[data-checkbox-entity='" + _name + "']").each(function() {
			if(!elementValue(this)) {
				_checked = false;
				return false;
			}
		});
		$("[data-checkbox-all='" + _name + "']").each(function() {
			elementValue(this, _checked);
		});
	});
}(window.jQuery);