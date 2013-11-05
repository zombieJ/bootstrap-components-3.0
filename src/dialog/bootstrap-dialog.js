/*	this is to help hightlight target element with dark background.
options:
	title:			string				specify title of dialog.
	content:		element				specify content of dialog.
	close:			boolean				default is true for alert window contains close button
	confirm:		boolean				default is false for dialog can check yes or no
	buttons:		array				if setted will disable confirm, e.x.
										[{name: "delete", class: "btn btn-danger", left: true},
										{name: "Not Yet", value: -1}, {name: "That's Time!"}]
	!other options which contains in modal

callback:			[function]			it will trigger event when user close this dialog by click the return button.
										return boolean of confirm, and false of alert and close button.
*/

// init env
$._bc.vals.dialog = new Object();
$._bc.vals.dialog.z_index = 1051;

// init function
$.extend({
	dialog:function(options, callback){
		// get options
		var vars = $._bc.vars(options, callback);
		var _options = vars.options;
		var _callback = vars.callback;

		var _title = $._bc.get(_options, "title", "");
		var _content = $._bc.get(_options, "content", "");
		var _close = $._bc.get(_options, "close", true);
		var _confirm = $._bc.get(_options, "confirm", false);
		var _buttons = $._bc.get(_options, "buttons", null);

		var _ret = null;

		// generate modal
		var $modal = $('<div class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" style="display: none;">');
		var $modal_dialog = $('<div class="modal-dialog">');
		var $modal_content = $('<div class="modal-content">');
		var $modal_header = $('<div class="modal-header">');
		var $modal_header_close = $('<button type="button" class="close" data-dismiss="modal" aria-hidden="true">x</button>');
		var $modal_header_head = $('<h4 class="modal-title" id="myModalLabel">');
		var $modal_body = $('<div class="modal-body">');
		var $modal_footer = $('<div class="modal-footer">');

		$modal.appendTo("body");
		$modal.append($modal_dialog);
		$modal_dialog.append($modal_content);
		$modal_content.append($modal_header);
			if(_close) $modal_header.append($modal_header_close);
			$modal_header.append($modal_header_head);
		$modal_content.append($modal_body);
		$modal_content.append($modal_footer);

		// fill title & content
		$modal_header_head.html(_title);
		$modal_body.html(_content);

		// fill buttons in footer
		if(_buttons != null) {
			var _len = _buttons.length;
			for(var i = 0 ; i < _len ; i += 1) {
				var _btn = _buttons[i];
				var _name = _btn.name;
				var _class = $._bc.get(_btn, "class", "btn-default");
				var _left = _btn.left === true;
				var _value = $._bc.get(_btn, "value", _name);

				var $btn = $('<button type="button" class="btn">');
				$btn.text(_name);
				$btn.addClass(_class);
				if(_left) $btn.addClass("pull-left");
				$btn.data("value", _value);
				$modal_footer.append($btn);

				$btn.add($btn_confirm).click(function() {
				_ret = $(this).data("value");
				$modal.modal('hide');
			});
			}
		} else if(_confirm) {
			var $btn_cancel = $('<button type="button" class="btn btn-default">Cancel</button>').data("value", false);
			var $btn_confirm = $('<button type="button" class="btn btn-primary">Comfirm</button>').data("value", true);
			$modal_footer.append($btn_cancel);
			$modal_footer.append($btn_confirm);

			$btn_cancel.add($btn_confirm).click(function() {
				_ret = $(this).data("value");
				$modal.modal('hide');
			});
		} else {
			var $btn_close = $('<button type="button" class="btn btn-default">Close</button>').data("value", true);
			$modal_footer.append($btn_close);

			$btn_close.click(function() {
				_ret = $(this).data("value");
				$modal.modal('hide');
			});
		}

		// show dialog with options
		$modal.modal(_options);

		// move modal-backdrop to top
		var $back = $("body div.modal-backdrop:last");
		$back.css("z-index", $._bc.vals.dialog.z_index);
		$modal.css("z-index", $._bc.vals.dialog.z_index+1);
		$._bc.vals.dialog.z_index += 2;

		// begin hide window, return callback
		$modal.on('hide.bs.modal', function () {
			if(_callback != null) {
				return _callback.call($modal, _ret);
			}
		});

		// when show hidden, remove it
		$modal.on('hidden.bs.modal', function () {
			$(this).remove();
			$._bc.vals.dialog.z_index -= 2;
		});
		return $modal;
	}
});