$(document).ready(function(){
	var _total = 0;
	var _loaded = 0;
	var t_id, _top = 0;
	var _nav = $("#nav_bar");
	loadPage("gettingStarted", "Getting Started");
	loadPage("slider", "Slider");

	function loadPage(page, name) {
		_total += 1;

		// add nav
		var $li = $("<li>");
		var $a = $("<a>");
		$a.text(name);
		$a.attr("href", "#" + page);
		$li.append($a);
		_nav.find("ul").append($li);

		$a.click(function() {
			scrollTop("#" + page);
			return false;
		});

		// add container
		var $div = $("<div>");
		$div.text("loading '" + name + "'...");
		$(".container .row").append($div);

		$.get('_' + page + '.html', function(data) {
			_loaded += 1;
			$div
			.addClass("chapter").html(data)
			.find("h1").attr("id", page);

			if(_loaded == _total) {
				$('body').scrollspy({ target: '#nav_lst' });
			}
		});
	}

	function scrollTop(element) {
		_top = $(element).offset().top;
		var $win = $(window);
		if(t_id != null) {
			clearInterval(t_id);
			t_id = null;
		}
		t_id = setInterval(function() {
			var w_top = $win.scrollTop();
			if(w_top != _top) {
				$win.scrollTop((w_top + _top) / 2);
			}

			var w_top_now = $win.scrollTop();
			if(Math.abs(w_top_now - _top) < 3 ||
			Math.abs(w_top_now - w_top) < 3) {
				$win.scrollTop(_top);
				clearInterval(t_id);
				t_id = null;
			}
		}, 30);
	}
	aaa = scrollTop;
});