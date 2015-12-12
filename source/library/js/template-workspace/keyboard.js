$(document).ready(function(){

	$('body').on('keydown', function(e){

		if( last_selected_object ) {
			
			if( last_selected_object.hasClass('active') && !$("input").is(":focus") ) {

				e.preventDefault();
				var left = parseInt(last_selected_object.css('left'));
				var top = parseInt(last_selected_object.css('top'));

				if( e.keyCode == 37 ) {
					var change = (left-1)+'px';
					last_selected_object.css('left', change);
					last_selected_object.find('draggable-element').css('left', change);
				} else if( e.keyCode == 38 ) {
					var change = (top-1)+'px';
					last_selected_object.css('top', change);
					last_selected_object.find('draggable-element').css('top', change);
				} else if( e.keyCode == 39 ) {
					var change = (left+1)+'px';
					last_selected_object.css('left', change);
					last_selected_object.find('draggable-element').css('left', change);
				} else if( e.keyCode == 40 ) {
					var change = (top+1)+'px'
					last_selected_object.css('top', change);
					last_selected_object.find('draggable-element').css('top', change);
				}
			}
		}
	});
});