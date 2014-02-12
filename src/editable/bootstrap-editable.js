/* options:
	data-editable:						enable element to be editable
							html		support html edit
*/

!function ($) {
	var _input = null;
	var _target = null;
	var preventPopup = false;

	// Update element content
	function updateElement() {
		// Update content
		if(_input != null && _target != null) {
			_target.text(_input.val());
		}

		// Clean element & input
		if(_input != null) _input.remove();
		_input = null;
		if(_target != null) _target.show();
		_target = null;
	}

	// Create input for editable element
	$(document).on("click.bs.editable", "[data-editable]", function() {
		var _my = $(this);

		// Update CSS of input
		var $input = $("<input type='text'>");
		_my.after($input);
		$input.addClass("form-control")
		.val(_my.text())
		.css("margin", _my.css("margin"))
		.css("padding", _my.css("padding"))
		.css("font-size", _my.css("font-size"))
		.css("line-height",  _my.css("line-height"))
		.css("display", _my.css("display"))
		.css("min-width", _my.css("width"))
		.css("height", "auto").css("width", "auto")
		.select().focus();

		// Prevent input click event
		$input.click(function() {
			preventPopup = true;
		}).keydown(function(event) {
			if(event.which == 13) {
				updateElement();
			}
		});

		_my.hide();
		preventPopup = true;

		_input = $input;
		_target = _my;
	});

	// Remove input
	$(document).on("click.bs.removeEditable", function() {
		if(preventPopup == true) {
			preventPopup = false;
			return;
		}
		updateElement();
	});
}(window.jQuery);