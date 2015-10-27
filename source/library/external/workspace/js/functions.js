$(document).ready(function(){

	$('.md-trigger').click(function(e){
		e.preventDefault();
	});
	$('.md-close').click(function(e){
		e.preventDefault();
		$(this).closest('div.md-modal').removeClass('md-show');
	});
	$('.md-replace').click(function(e){
		e.preventDefault();
		$(this).closest('div.md-modal').removeClass('md-show');	
	});
});