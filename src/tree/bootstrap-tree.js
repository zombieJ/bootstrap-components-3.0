!function ($) {
	$.fn.extend({
		tree: function(data, options){
			var _my = $(this);
			options = options || {};

			var _name = data.name;
			var _list = data.list || [];

			var $ul = _my.is("ul") ? _my : $("<ul class='treeView'>").appendTo(_my);
			var $li = $("<li>").appendTo($ul);
			var $a = $("<a class='tree-icon glyphicon'>").appendTo($li);
			var $name = $("<span>").html(_name).insertAfter($a);

			if(_list.length) {
				$a.attr("data-toggle", "tree")
				.addClass("glyphicon-folder-open");

				var $sub_ul = $("<ul class='tree-list'>").appendTo($li);
				$.each(_list, function(i, data) {
					$sub_ul.tree(data, options);
				});
			} else {
				$a.addClass("glyphicon-file");
			}
			return _my;
		},
	});

	$(document).on("click.bs.treeView", "[data-toggle='tree']", function(event) {
		event.preventDefault();

		var _my = $(this);
		var $list = _my.parent().find("> .tree-list");
		if($list.is(":hidden")) {
			$list.slideDown();
		} else {
			$list.slideUp();
		}
	});
}(window.jQuery);