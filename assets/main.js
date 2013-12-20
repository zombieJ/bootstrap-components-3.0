$(document).ready(function(){
	$.get('_nav.html', function(data) {
		$('body').prepend(data);
		
		$('body').scrollspy({ target: '#nav_bar' });
	});
});