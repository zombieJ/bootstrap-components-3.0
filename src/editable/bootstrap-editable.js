/* options:
	data-editable:						enable element to be editable
							html		support html edit
*/

!function ($) {
	var _input = null;
	var _target = null;
	var _preContent = null;
	var preventPopup = false;

	// Update element content
	function updateElement() {
		// Update content
		if(_input != null && _target != null) {
			var _html = _target.attr("data-editable") == "html";
			var content = _input.val();
			if(_html)
				_target.html(content);
			else
				_target.text(content);

			if(_preContent != content) {
				_target.change();
			}
		}

		// Clean element & input
		if(_target != null) _target.show();
		_target = null;
		if(_input != null) _input.remove();
		_input = null;
	}

	// Create input for editable element
	$(document).on("click.bs.editable", "[data-editable]", function() {
		var _my = $(this);
		var _html = _my.attr("data-editable") == "html";
		var $input = _my.is("pre") ? $("<textarea>") : $("<input type='text'>");

		// Cleanup pre content
		updateElement();

		// Set input content
		var content = _html ? _my.html() : _my.text();
		$input.val(content);

		// Update CSS of input
		_my.after($input);
		$input.addClass("form-control")
		.css("margin", _my.css("margin"))
		.css("padding", _my.css("padding"))
		.css("font-size", _my.css("font-size"))
		.css("font-family", _my.css("font-family"))
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
		_preContent = content;
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