/* options:
	to:			element			set the value of target element(only for checkbox)

	checked:	boolean			set checkbox checked or not
*/

!function ($) {
	$(document).on("click.bs.editable", "[data-editable]", function() {
		var _my = $(this);
		//_my.remove();
		var $input = $("<input type='text'>");
		_my.hide().after($input);
		$input
		.val(_my.text())
		.css("margin", _my.css("margin"))
		.css("padding", _my.css("padding"))
		.css("font-size", _my.css("font-size"))
		.select().focus();
	});
}(window.jQuery);