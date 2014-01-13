$(document).ready(function(){
	var _total = 0;
	var _loaded = 0;
	var t_id, _top = 0;
	var _nav = $("#nav_bar");
	loadPage("gettingStarted", "Getting Started");
	loadPage("slider", "Slider");
	loadPage("autotooltip", "Auto Tooltip");
	loadPage("dialog", "Dialog");
	loadPage("notify", "Notify");
	loadPage("datepicker", "Datepicker");
	loadPage("select", "Select");
	loadPage("callout", "Callout");
	loadPage("checkbox", "Checkbox");
	loadPage("radio", "Radio");

	// bind width of left nav bar
	$(window).resize(function() {
		$("#nav_left").width($("#ctnr_nav").width());
	});
	$(window).resize();

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
		$("#ctnr_content").append($div);

		// add left nav
		var $ul = $("<ul class='nav bs-sidenav'>");
		$("#nav_left").append($ul);
		$ul.hide();

		$.get('pages/' + page + '.html', function(data) {
			_loaded += 1;
			$div
			.addClass("chapter").html(data)
			.find("h1").attr("id", page);

			// bind to left nav bar
			$div.find("h1")
			.add($div.find("h2"))
			.add($div.find("h3")).each(function() {
				var _my = $(this);
				var _title =  $(this).text();
				var _id = $(this).attr("id") != null ? $(this).attr("id") : page + "_" + _title.replace(/[ '\?]/g, "");
				$(this).attr("id", _id);

				var $li = $("<li>");
				var $a = $("<a>");
				$li.append($a);
				$a
				.text(function() {
					if(_my.is("h3"))
						return "- " + _title;
					else
						return _title;
				})
				.attr("href", "#" + _id)
				.click(function() {
					scrollTop("#" + _id);
					return false;
				});
				if(_my.is("h1")) {
					$li.addClass("title");
				}
				$ul.append($li);
			});

			if(_loaded == _total) {
				$('body').scrollspy({ target: '#ctnr_nav' });

				// hide all left nav
				$($("#nav_left ul").hide()[0]).show();

				// refresh left nav bar
				$("#nav_left li").on('activate.bs.scrollspy', function () {
					var _my = $(this);
					var _ul = _my.closest("ul");
					if(_ul.is(":hidden")) {
						$("#nav_left ul").slideUp();
						_ul.slideDown();
						
						// top nav highlight
						var _h1 = _ul.find("a:first").attr("href");
						$("#nav_lst li")
						.removeClass("active")
						.find("[href=" + _h1 + "]").closest("li").addClass("active");
					}
				});
			}
		});
	}

	function scrollTop(element) {
		$("#nav_left").addClass("lock");
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
				$("#nav_left").removeClass("lock");
				$win.scrollTop(_top);
				clearInterval(t_id);
				t_id = null;
			}
		}, 30);
	}
	aaa = scrollTop;
});