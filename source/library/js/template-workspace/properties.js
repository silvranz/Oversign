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

	$('body').on('click', '.reorder-element', function(){
		var self = $(this);
		var holder = self.closest('.draggable-holder');
		var type = self.attr('type');

		if( type == 'bring-to-front' ) {
			while( holder.next().length ){
				swapElementPosition(holder, holder.next());
			}
		} else if( type == 'bring-forward' ) {
			if( holder.next().length ){
				swapElementPosition(holder, holder.next());
			}
		} else if( type == 'send-backward' ) {
			if( holder.prev().length ){
				swapElementPosition(holder, holder.prev());
			}
		} else if( type == 'send-to-back' ) {
			while( holder.prev().length ){
				swapElementPosition(holder, holder.prev());
			}
		}
	});

	$('body').on('click', '.manipulate-element', function(e){
		var self = $(this);
		var holder = self.closest('.draggable-holder');
		var element = holder.find('.draggable-element');
		var type = self.attr('type');
		var clone = element.clone();

		// Bugs on element text since it was wrapped by div
		if( clone.attr('element-type') == 'text' || clone.attr('element-type') == 'link' ) {
			clone.children().attr('id', clone.attr('id') );
			clone.children().attr('element-type', clone.attr('element-type') );
			clone.children().attr('parent-style', clone.attr('style') );
			clone = clone.children();
			clone.addClass('draggable-element');
		}

		if( type == 'cut' ) {
			copiedCuttedObject = {};
			copiedCuttedObject.element = clone;
			copiedCuttedObject.action_type = type;
			holder.remove();
		} else if( type == 'copy') {
			copiedCuttedObject = {};
			clone.removeAttr('id');
			copiedCuttedObject.element = clone;
			copiedCuttedObject.action_type = type;
		} else if( type == 'duplicate' ) {
			clone.removeAttr('id');
			addElement(clone, e, 'specific');
		} else if( type == 'paste' ) {

			if( !$.isEmptyObject(copiedCuttedObject) ) {
				var stored_element = copiedCuttedObject.element;
				var action_type = copiedCuttedObject.action_type;

				if( action_type == 'copy' ) {
					addElement(stored_element, e, 'specific');
				} else if ( action_type == 'cut' ) {
					addElement(stored_element, e, 'specific');
					copiedCuttedObject = {};
				}
			}
		}

		setRightClickMenu(false, 'destroy');
	});

	initPropertiesControl();
});

var initPropertiesControl = function(){

	// *********************** //
	// GENERAL PROPERTIES
	// *********************** //
	
	// WIDTH
	$('body').on('keyup', '.prop-width', function(e){
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

	// BORDER COLOR
	$('body').on('change', '.prop-switch-showall', function(){
		var value = $(this).prop('checked');
		if( last_selected_object ) {
			last_selected_object.find('.draggable-element').attr('showall', value);
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

	// WIDGET GALLERY
	$('body').on('keyup', '#prop-width-category-gallery', function(){
		$(this).trigger('change');
	});
	$('body').on('change', '#prop-width-category-gallery', function(){
		var value = $(this).val();
		var category_width = parseFloat( value ) + 'px';
		if( last_selected_object ) {
			last_selected_object.find('.gallery-category').css('width', category_width)
		}
	});

	$('body').on('keyup', '#prop-padding-top-gallery', function(){
		$(this).trigger('change');
	});
	$('body').on('change', '#prop-padding-top-gallery', function(){
		var value = $(this).val();
		var padding_top = parseFloat( value ) + 'px';
		if( last_selected_object ) {
			last_selected_object.find('.gallery-image-container li').css('padding-top', padding_top)
		}
	});

	$('body').on('keyup', '#prop-padding-right-gallery', function(){
		$(this).trigger('change');
	});
	$('body').on('change', '#prop-padding-right-gallery', function(){
		var value = $(this).val();
		var padding_right = parseFloat( value ) + 'px';
		if( last_selected_object ) {
			last_selected_object.find('.gallery-image-container li').css('padding-right', padding_right)
		}
	});

	$('body').on('keyup', '#prop-padding-bottom-gallery', function(){
		$(this).trigger('change');
	});
	$('body').on('change', '#prop-padding-bottom-gallery', function(){
		var value = $(this).val();
		var padding_bottom = parseFloat( value ) + 'px';
		if( last_selected_object ) {
			last_selected_object.find('.gallery-image-container li').css('padding-bottom', padding_bottom)
		}
	});

	$('body').on('keyup', '#prop-padding-left-gallery', function(){
		$(this).trigger('change');
	});
	$('body').on('change', '#prop-padding-left-gallery', function(){
		var value = $(this).val();
		var padding_left = parseFloat( value ) + 'px';
		if( last_selected_object ) {
			last_selected_object.find('.gallery-image-container li').css('padding-left', padding_left)
		}
	});

	$('body').on('keyup', '#prop-width-image-container-gallery', function(){
		$(this).trigger('change');
	});
	$('body').on('change', '#prop-width-image-container-gallery', function(){
		var value = $(this).val();
		var width = parseFloat( value ) + 'px';
		if( last_selected_object ) {
			last_selected_object.find('.gallery-image-container li > div').css('width', width)
		}
	});

	$('body').on('keyup', '#prop-width-image-container-gallery', function(){
		$(this).trigger('change');
	});
	$('body').on('change', '#prop-width-image-container-gallery', function(){
		var value = $(this).val();
		var width = parseFloat( value ) + 'px';
		if( last_selected_object ) {
			last_selected_object.find('.gallery-image-container li > div').css('width', width)
		}
	});

	$('body').on('keyup', '#prop-width-image-gallery', function(){
		$(this).trigger('change');
	});
	$('body').on('change', '#prop-width-image-gallery', function(){
		var value = $(this).val();
		var width = parseFloat( value ) + 'px';
		if( last_selected_object ) {
			last_selected_object.find('.gallery-image-container li div .image-gallery').css('width', width)
		}
	});
	
	$('body').on('keyup', '#prop-height-image-gallery', function(){
		$(this).trigger('change');
	});
	$('body').on('change', '#prop-height-image-gallery', function(){
		var value = $(this).val();
		var height = parseFloat( value ) + 'px';
		if( last_selected_object ) {
			last_selected_object.find('.gallery-image-container li div .image-gallery').css('height', height)
		}
	});

	// WIDGET ARTICLE
	$('body').on('keyup', '#prop-width-category-article', function(){
		$(this).trigger('change');
	});
	$('body').on('change', '#prop-width-category-article', function(){
		var value = $(this).val();
		var category_width = parseFloat( value ) + 'px';
		if( last_selected_object ) {
			last_selected_object.find('.article-category').css('width', category_width)
		}
	});

	// *********************** //
	// END SPECIFIC PROPERTIES
	// *********************** //
}

var setRightClickMenu = function( element, status, filter, e ) {
	status = (typeof status === "undefined" || status === null) ? 'show' : status;
	filter = (typeof filter === "undefined" || filter === null) ? 'menu-default' : filter; 
	$('.box-right-click-menu').remove();

	if( status == 'show' ) {

		var menu_wrapper = $('<div class="box-right-click-menu"></div>');
		var rightclickmenu_content = $('.contextmenu').clone().show();
		rightclickmenu_content.find('ul').not('.'+filter).remove();
		menu_wrapper.append(rightclickmenu_content);

		if( element != false ) {
			menu_wrapper.css('top', -50 + 'px');
			menu_wrapper.css('left', element.width() + 100 + 'px');
			element.append(menu_wrapper);
		}

		if( filter == 'menu-paste' ) {
			menu_wrapper.css('top', e.pageY-40 + 'px');
			menu_wrapper.css('left', e.pageX+5 + 'px');
			editor.append(menu_wrapper);
		}
	}
}

var swapElementPosition = function(a, b) {
    a = $(a); b = $(b);
    var tmp = $('<span>').hide();
    a.before(tmp);
    b.before(a);
    tmp.replaceWith(b);
};

var setMenuEditProperties = function( element, status ) {

	status = (typeof status === "undefined" || status === null) ? 'show' : status; 
	$('.box-edit-properties').remove();
	$('.box-edit-event').remove();

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
			menu_wrapper.css('top', element.height() - 30 + 'px');

			var element_left = parseInt(element.css('left'));
			var element_width = parseInt(element.css('width'));

			var total_left = element_left + element_width;
			var total_top = parseInt(element.css('top'));

			if( element_left < 407 && total_left > 900 ) {
				menu_wrapper.css('left', 250);
				menu_wrapper.css('top', 130);
			} else if( total_left > 900 ) {
				menu_wrapper.css('left', -395);
			} else if( total_top < 111 ) {
				menu_wrapper.css('top', menu_wrapper.height()+10);
			} else if( total_top > 1658 ) {
				menu_wrapper.css('top', -370);
			}

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
	var switch_showallpage = ( typeof element.attr('showall') === "undefined" || element.attr('showall') === null ) ? false : element.attr('showall');
	switch_showallpage = ( switch_showallpage == 'true' ) ? true : false;

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
	holder.find('.prop-switch-showall').prop('checked', switch_showallpage);

	if( element_type == 'button' ) {
		var text = element.val();
		holder.find('#prop-text-button').val(text);
	} else if( element_type == 'textbox' ) {
		var placeholder = element.attr('placeholder');
		holder.find('#prop-placeholder-textbox').val(placeholder);
	} else if( element_type == 'gallery' ) {
		var category_width = parseInt(element.find('.gallery-category').css('width'));
		var image_container_width = parseInt(element.find('.gallery-image-container li > div').css('width'));
		var image_width = parseInt(element.find('.gallery-image-container li div .image-gallery').css('width'));
		var image_height = parseInt(element.find('.gallery-image-container li div .image-gallery').css('height'));
		
		var padding_top = parseInt(element.find('.gallery-image-container li').css('padding-top'));
		var padding_right = parseInt(element.find('.gallery-image-container li').css('padding-right'));
		var padding_bottom = parseInt(element.find('.gallery-image-container li').css('padding-bottom'));
		var padding_left = parseInt(element.find('.gallery-image-container li').css('padding-left'));
		
		holder.find('#prop-width-category-gallery').val(category_width);
		holder.find('#prop-width-image-container-gallery').val(image_container_width);
		holder.find('#prop-width-image-gallery').val(image_width);
		holder.find('#prop-height-image-gallery').val(image_height);

		holder.find('#prop-padding-top-gallery').val(padding_top);
		holder.find('#prop-padding-right-gallery').val(padding_right);
		holder.find('#prop-padding-bottom-gallery').val(padding_bottom);
		holder.find('#prop-padding-left-gallery').val(padding_left);
	} else if( element_type == 'article' ) {
		var category_width = parseInt(element.find('.article-category').css('width'));
		holder.find('#prop-width-category-article').val(category_width);
	}
}

var rgb2hex = function(rgb) {

	if ( rgb.search("rgb") == -1 ) {
	  return rgb;
	} else {

		var check = rgb;
		check = check.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/);
		if( !check ) {
			var arr = rgb.split(',');
			arr.pop();
			arr = arr.join(',') + ')';
			arr = arr.replace('rgba', 'rgb');
			check = arr;
			check = check.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/);
		}
		function hex(x) {
			return ("0" + parseInt(x).toString(16)).slice(-2);
		}
		var result = "#" + hex(check[1]) + hex(check[2]) + hex(check[3]);
		return result; 
	}
}