!function ($) {
	$.fn.extend({
		tree: function(data, options){
			var _my = $(this);
			options = options || {};

			var _name = data.name;
			var _list = data.list || [];
			var _enabled = data.enabled !== false;
			var _open = _enabled ? data.open !== false : data.open === true;

			var $ul = _my.is("ul") ? _my : $("<ul class='treeView'>").appendTo(_my);
			var $li = $("<li>").appendTo($ul);
			var $a = $("<a class='tree-icon glyphicon'>").appendTo($li);
			var $name = (data.url ? $("<a>").attr("href", data.url) : $("<span>")).html(_name).insertAfter($a);

			if(!_enabled) $li.addClass("disabled");

			// Generate as list
			if(_list.length) {
				var cls_folder_open = options.folderOpenIcon || 'glyphicon-folder-close';
				var cls_folder_close = options.folderCloseIcon || 'glyphicon-folder-open';

				$a.attr("data-toggle", "tree")
				.attr("data-icon-open", cls_folder_open)
				.attr("data-icon-close", cls_folder_close)
				.addClass("glyphicon")
				.addClass(_open ? cls_folder_close : cls_folder_open);

				var $sub_ul = $("<ul class='tree-list'>").appendTo($li);
				$.each(_list, function(i, data) {
					$sub_ul.tree(data, options);
				});
				if(!_open) {
					$sub_ul.hide();
				}
			} else {
				var cls_file = options.itemIcon || 'glyphicon-file';

				$a.addClass(cls_file);
			}
			return _my;
		},
	});

	$(document).on("click.bs.treeView", "[data-toggle='tree']", function(event) {
		event.preventDefault();

		var _my = $(this);
		if(_my.closest("li").hasClass("disabled")) return;

		var $list = _my.parent().find("> .tree-list");
		var clsOpen = _my.attr("data-icon-open");
		var clsClose = _my.attr("data-icon-close");

		if($list.is(":hidden")) {
			_my.removeClass(clsOpen);
			_my.addClass(clsClose);
			$list.slideDown();
		} else {
			_my.addClass(clsOpen);
			_my.removeClass(clsClose);
			$list.slideUp();
		}
	});
}(window.jQuery);