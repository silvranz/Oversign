$(document).ready(function(){

	$('.md-trigger').click(function(e){
		e.preventDefault();
	});
	$('.md-close').click(function(e){
		e.preventDefault();
	});

	$('.md-replace').click(function( ev ){
		ev.preventDefault();
		$(this).closest('div.md-modal').removeClass('md-show');	
	});
});