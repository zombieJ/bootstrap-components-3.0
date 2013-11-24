/* options:
	to:			element			set the value of target element
*/

!function ($) {
	$(document).on("click.bs.select", ".btn-group ul.dropdown-menu[role='menu'][data-type='selector'] li a", function(event){
		var my = $(this);
		var _val = my.attr("value");
		var _text = my.text();
		if(_val == null) {
			_val = _text;
		}
		var $field = $(this).closest(".btn-group").find("[data-toggle='dropdown'][data-type='selector']");
		var $field_val = $field.find("[data-value]");
		var $field_target = $($field.attr("data-to"));
		$field_val.val(_val).text(_text).attr("data-value", _val);
		$field_target.val(_val);
	});
}(window.jQuery);