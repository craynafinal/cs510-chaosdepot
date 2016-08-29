$(document).ready(function() {

	// Masonry setup
	var $container = $('.masonry-container');

	$container.imagesLoaded( function () {
		$container.masonry({
			columnWidth: '.item',
			itemSelector: '.item'
		});   
	});

	// Button setup
	$('.buttonGoBack').click(function () {
		window.history.back();
	});

	// Sidebar search
	$('#navbar-search-button').click(function () {
		var select = $('#navbar-search-select option:selected');
		var search = $('#navbar-search-input');
		window.location.href = select.val() + '/search/' + search.val();
	});
	
	// Sidebar language selector
	$('#navbar-language-select').change(function () {
		var urlPart = window.location.pathname.split('/')[1];
		var selected = $('#navbar-language-select option:selected').val();

		if (urlPart.length === 2) {
			console.log(window.location.pathname);
			window.location.href = window.location.pathname.replace(urlPart, selected);
		} else {
			window.location.href = '/' + selected + '/' + window.location.pathname;
		}
	});
});
