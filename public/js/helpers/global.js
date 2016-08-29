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

	$('#searchCategory').css({'display': ''});
});

function selectLanguage(select) {
	if (select.selectedIndex.value !== '') {
		var urlPart = window.location.pathname.split('/')[1];
		var selected = select.options[select.selectedIndex].value;

		if (urlPart.length === 2) {
			window.location.href = window.location.pathname.replace(urlPart, selected);
		} else {
			window.location.href = '/' + selected + '/' + window.location.pathname;
		}
	}
}

function searchPortfolio(searchForm) {
	window.location.href = searchForm.form.category.value + '/search/' + searchForm.form.search.value;
}
