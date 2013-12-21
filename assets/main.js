$(document).ready(function(){
	var _nav;
	$.get('_nav.html', function(data) {
		_nav = $(data);
		$('body').prepend(_nav);

		loadPage("gettingStarted", "Getting Started");
	});

	function loadPage(page, name) {
		// add nav
		var $li = $("<li>");
		var $a = $("<a>");
		$a.text(name);
		$a.attr("href", "#" + page);
		$li.append($a);
		_nav.find("ul").append($li);

		// add container
		var $div = $("<div>");
		$div.text("loading '" + name + "'...");
		$(".container .row").append($div);

		$.get('_' + page + '.html', function(data) {
			var $content = $(data);
			$content.find("h1").attr("id", page);
			$div.addClass("chapter").html($content);

			$('body').scrollspy({ target: '#nav_lst' });
		});
	}
});