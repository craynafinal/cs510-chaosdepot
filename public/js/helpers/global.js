$(document).ready(function() {

	// Masonry setup
	var $container = $('.masonry-container');

	$container.imagesLoaded( function () {
		$container.masonry({
			columnWidth: '.item',
			itemSelector: '.item'
		});   
	});

	$("#searchdropdown li a").click(function(){
		$("#searchcategory").html($(this).text() + ' <span class="caret"></span>');
      	$("#searchcategory").val($(this).text());
	});

	// Button setup
	$('.buttonGoBack').click(function () {
		window.history.back();
	});

	// Language select
	
	// Search
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
