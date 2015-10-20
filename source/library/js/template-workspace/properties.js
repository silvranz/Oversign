$(document).ready(function() {
	
	$('body').on('click', '.menu-edit-properties', function(e){
		e.preventDefault();
		var self = $(this).closest('div.draggable-holder');
		setMenuEditProperties( self );
		initElementProperties( self );
	});

	$('body').on('change', '.prop-opacity', function(){
		var value = $(this).val();
		var opacity = parseFloat( value / 100 );
		if( last_selected_object ) {
			last_selected_object.find('.draggable-element').css('opacity', opacity);
		}
	});

	initPropertiesControl();
});

var initPropertiesControl = function(){

	// *********************** //
	// GENERAL PROPERTIES
	// *********************** //
	
	// WIDTH
	$('body').on('keyup', '.prop-width', function(){
		$(this).trigger('change');
	});
	$('body').on('change', '.prop-width', function(){
		var value = $(this).val();
		var width = parseFloat( value ) + 'px';
		if( last_selected_object ) {
			last_selected_object.find('.draggable-element').css('width', width);
		}
	});

	// HEIGHT
	$('body').on('keyup', '.prop-height', function(){
		$(this).trigger('change');
	});
	$('body').on('change', '.prop-height', function(){
		var value = $(this).val();
		var height = parseFloat( value ) + 'px';
		if( last_selected_object ) {
			last_selected_object.find('.draggable-element').css('height', height);
		}
	});

	// XPOS
	$('body').on('keyup', '.prop-xpos', function(){
		$(this).trigger('change');
	});
	$('body').on('change', '.prop-xpos', function(){
		var value = $(this).val();
		var xpos = parseFloat( value ) + 'px';
		if( last_selected_object ) {
			last_selected_object.css('left', xpos);
		}
	});

	// YPOS
	$('body').on('keyup', '.prop-ypos', function(){
		$(this).trigger('change');
	});
	$('body').on('change', '.prop-ypos', function(){
		var value = $(this).val();
		var ypos = parseFloat( value ) + 'px';
		if( last_selected_object ) {
			last_selected_object.css('top', ypos);
		}
	});

	// TEXT COLOR
	$('body').on('change', '.prop-text-color', function(){
		var value = $(this).val();
		var text_color = rgb2hex( value );
		if( last_selected_object ) {
			last_selected_object.find('.draggable-element').css('color', text_color);
		}
	});

	// BACKGROUND COLOR
	$('body').on('change', '.prop-background-color', function(){
		var value = $(this).val();
		var bg_color = rgb2hex( value );
		if( last_selected_object ) {
			last_selected_object.find('.draggable-element').css('background-color', bg_color);
		}
	});

	// BORDER WIDTH
	$('body').on('keyup', '.prop-border-width', function(){
		$(this).trigger('change');
	});
	$('body').on('change', '.prop-border-width', function(){
		var value = $(this).val();
		var border_width = parseFloat( value ) + 'px';
		if( last_selected_object ) {
			last_selected_object.find('.draggable-element').css('border-width', border_width);
		}
	});

	// BORDER STYLE
	$('body').on('change', '.prop-border-style', function(){
		var value = $(this).val();
		if( last_selected_object ) {
			last_selected_object.find('.draggable-element').css('border-style', value);
		}
	});

	// BORDER RADIUS
	$('body').on('keyup', '.prop-border-radius', function(){
		$(this).trigger('change');
	});
	$('body').on('change', '.prop-border-radius', function(){
		var value = $(this).val();
		var border_radius = parseFloat( value ) + 'px';
		if( last_selected_object ) {
			last_selected_object.find('.draggable-element').css('border-radius', border_radius);
		}
	});

	// BORDER COLOR
	$('body').on('change', '.prop-border-color', function(){
		var value = $(this).val();
		var border_color = rgb2hex( value );
		if( last_selected_object ) {
			last_selected_object.find('.draggable-element').css('border-color', border_color);
		}
	});

	// *********************** //
	// END GENERAL PROPERTIES
	// *********************** //
	


	// *********************** //
	// SPECIFIC PROPERTIES
	// *********************** //
	
	// TEXTBOX
	$('body').on('keyup', '#prop-text-button', function(){
		var value = $(this).val();
		if( last_selected_object ) {
			last_selected_object.find('.draggable-element').val(value);
		}
	});

	$('body').on('keyup', '#prop-placeholder-textbox', function(){
		var value = $(this).val();
		if( last_selected_object ) {
			last_selected_object.find('.draggable-element').attr('placeholder', value);
		}
	});

	// *********************** //
	// END SPECIFIC PROPERTIES
	// *********************** //
}

var setMenuEditProperties = function( element, status ) {

	status = (typeof status === "undefined" || status === null) ? 'show' : status; 
	$('.box-edit-properties').remove();

	if( status == 'show' && element != false ) {

		var element_type = element.find('.draggable-element').attr('element-type');
		if( existElement('properties-'+element_type) ) {
			var menu_wrapper = $('<div class="box-edit-properties">'+
				'<div class="header">'+
					'<label class="title">Properties</label>'+
					
						'<a href="#" class="prop-close-button"></a>'+
				'</div>'+
				'<div class="container">'+
					'<div class="row small-pd-right"></div>'+
				'</div>'+
			'</div>');
			
			var properties_content = $('#properties-'+element_type).clone().show();
			menu_wrapper.find('.container > .row').append(properties_content);
			menu_wrapper.css('left', element.width() + 100 + 'px');
			element.append(menu_wrapper);
		}
	}
}

var initElementProperties = function( holder ) {
	var element = holder.find('.draggable-element');
	var element_type = element.attr('element-type');

	var opacity = element.css('opacity') * 100;
	var width = parseInt(element.css('width'));
	var height = parseInt(element.css('height'));
	var xpos = parseInt(element.css('left'));
	var ypos = parseInt(element.css('top'));
	var text_color = rgb2hex( element.css('color') );
	var bg_color = rgb2hex( element.css('background-color') );
	var border_width = parseInt(element.css('border-width'));
	var border_style = element.css('border-style');
	var border_radius = element.css('border-radius');
	var border_color = rgb2hex( element.css('border-color') );

	holder.find('.prop-opacity').val(opacity);
	holder.find('.prop-width').val(width);
	holder.find('.prop-height').val(height);
	holder.find('.prop-xpos').val(xpos);
	holder.find('.prop-ypos').val(ypos);
	holder.find('.prop-text-color').val(text_color);
	holder.find('.prop-background-color').val(bg_color);
	holder.find('.prop-border-width').val(border_width);
	holder.find('.prop-border-style option[value='+border_style+']').attr('selected','selected');
	holder.find('.prop-border-radius').val(border_radius);
	holder.find('.prop-border-color').val(border_color);

	if( element_type == 'button' ) {
		var text = element.val();
		holder.find('#prop-text-button').val(text);
	} else if( element_type == 'textbox' ) {
		var placeholder = element.attr('placeholder');
		holder.find('#prop-placeholder-textbox').val(placeholder);
	}
}

var rgb2hex = function(rgb) {
	if (  rgb.search("rgb") == -1 ) {
	  return rgb;
	} else {
	  rgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/);
	  function hex(x) {
	       return ("0" + parseInt(x).toString(16)).slice(-2);
	  }
	  return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]); 
	}
}