$(document).ready(function(){
	$('.help .category ul li').click(function(e){
		e.preventDefault();
		var self = $(this);
		var content_selector = $('#'+self.attr('data-id'));

		$('.help .content').stop().fadeOut(200);
		$('.help .content').promise().done(function(){
			$('.help .content ul li div.description').hide();
			content_selector.stop().fadeIn(200);
		});
	});

	$('.help span.title').click(function(e){
		e.preventDefault();
		var self = $(this);
		self.closest('li').find('div.description').stop().slideToggle();
	});
});