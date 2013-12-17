/* options:
				boolean			default false. true to open auto tooltips else to close it.
*/

!function ($) {
	var _on = false;

	$.extend({
		autotooltip:function(option){
			if(option === true && _on == false) {
				$(document).on("mouseover.bs.autotooltip", "[data-toggle='tooltip']", tooltipHandler);
				_on = true;
			} else if(option === false && _on == true) {
				$(document).off("mouseover.bs.autotooltip");
				_on = false;
			}
		}
	});

	function tooltipHandler() {
		var _my = $(this);
		if(_my.attr("data-original-title") == null) {
			_my.tooltip('show');
		}
	};
}(window.jQuery);