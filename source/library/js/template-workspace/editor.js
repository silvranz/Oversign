/* CKEDITOR */
var renderCkeditorToElement = function( id, width, height ) {
	var wysiwygareaAvailable = isWysiwygareaAvailable();
	var editorElement = CKEDITOR.document.getById( id );

	if ( wysiwygareaAvailable ) {
		CKEDITOR.config.width = width;
		CKEDITOR.config.height = height;
		CKEDITOR.config.enterMode = CKEDITOR.ENTER_BR;
		CKEDITOR.config.fillEmptyBlocks = false;
		// CKEDITOR.config.shiftEnterMode = CKEDITOR.ENTER_BR;
		// CKEDITOR.config.autoParagraph = false;
		
		// CKEDITOR.config.basicEntities = false;
		CKEDITOR.config.allowedContent = true;
		CKEDITOR.config.removePlugins = 'resize, elementspath';
				
		CKEDITOR.config.extraPlugins = 'autogrow',
        CKEDITOR.config.autoGrow_minHeight = height;
        CKEDITOR.config.autoGrow_maxHeight = height + 400,
        CKEDITOR.config.autoGrow_bottomSpace = 50;

		// CKEDITOR.config.contentsCss = '../../dist/css/skeleton.css';
		// CKEDITOR.config.font_names = 'sans-serif;';
		// CKEDITOR.config.font_names = 'Source Serif Pro Bold/SourceSerifPro-Bold;' + config.font_names;
		
		// CKEDITOR.replace( id );

		CKEDITOR.replace( id , {
			on: {
				'instanceReady': function() {
					CKEDITOR.instances[id].focus();
				}
			},
		});
		// CKEDITOR.instances[id].on( 'focus', function () { this.execCommand( 'selectAll' ); });
	} else {
		editorElement.setAttribute( 'contenteditable', 'true' );
		CKEDITOR.inline( id );
	}
}

var isWysiwygareaAvailable = function() {
	if ( CKEDITOR.revision == ( '%RE' + 'V%' ) ) {
		return true;
	}
	return !!CKEDITOR.plugins.get( 'wysiwygarea' );
}

/* CORE FUNCTION */
var hideLeftContent = function(){
	$('.left-content').hide();
}

var updateCoordinate = function(e) {
	oldy = e.pageY;
	oldx = e.pageX;
}

var isHexaColor = function(sNum){
  	return (typeof sNum === "string") && sNum.length === 6 && ! isNaN( parseInt(sNum, 16) );
}

var resetEditorBg = function( param ) {

	if( param == 'bg-color' && editor.css('background-image') != 'none' ) {
		editor.css({
			'background' : '',
		});
	} else if( param == 'bg-image' ) {
		editor.css({
			'backgroundColor' : '',
		});
	}
}

var setEditorBgColor = function( color ) {
	resetEditorBg('bg-color');
	editor.stop().animate({ 
		'backgroundColor' : color 
	});
}

var setEditorBgImage = function( source_image ) {
	editor.stop().fadeOut(function(){
		resetEditorBg('bg-image');
		$(this).css({
			'background' : 'url('+source_image+') no-repeat center center fixed', 
			'-webkit-background-size' : 'cover',
			'-moz-background-size' : 'cover',
			'-o-background-size' : 'cover',
			'background-size' : 'cover',
		});	
	}).fadeIn();
}

var setEditorHighlightedBorder = function( class_list ) {
	
	var border_top = '1px dotted gray';
	var border_bottom = '1px dotted gray';
	editor_header_separator.hide();
	editor_footer_separator.hide();

	if( inArray('editor-header', class_list) ) {
		border_bottom = '2px solid #5cb85c';
		editor_header_separator.show();
		editor_footer_separator.hide();
	} else if( inArray('editor-footer', class_list) ) {
		border_top = '2px solid #5cb85c';
		editor_header_separator.hide();
		editor_footer_separator.show();
	} else if( inArray('editor-content', class_list) ) {
		// border_bottom = '1px dotted gray';
		// border_top = '1px dotted gray';
	}

	editor_header.css({
		'borderBottom' : border_bottom
	});
	editor_footer.css({
		'borderTop' : border_top
	});

	// if( inArray('editor-header', class_list) ) {
	// 	border_bottom = '1px dotted gray';
	// 	editor_header_separator.show();
	// 	editor_footer_separator.hide();
	// } else if( inArray('editor-footer', class_list) ) {
	// 	border_top = '1px dotted gray';
	// 	editor_header_separator.hide();
	// 	editor_footer_separator.show();
	// } else if( !inArray('editor-content', class_list) ) {
	// 	border_bottom = '1px dotted gray';
	// 	border_top = '1px dotted gray';
	// 	editor_header_separator.hide();
	// 	editor_footer_separator.hide();
	// }

	// editor.css({
	// 	'borderTop' : border_top,
	// 	'borderBottom' : border_bottom
	// });
}

var setMenuEditElement = function( element, status ) {

	status = (typeof status === "undefined" || status === null) ? 'show' : status; 
	$('.menu-edit-container').remove();
	$('.box-edit-properties').remove();

	if( status == 'show' ) {
		var menu_wrapper = $('<div class="menu-edit-container">'+
			'<div class="menu-edit-text">Edit Text</div>'+
			'<div class="menu-edit-properties">Properties</div>'+
			'<div class="menu-delete">Delete</div>'+
		'</div>');
		if( element.find('.draggable-element').attr('element-type') != 'text' ) {
			menu_wrapper.find('.menu-edit-text').remove();
		}

		menu_wrapper.css('top', element.height() + 30 + 'px');
		element.append(menu_wrapper);
	}
}

/* Menu Edit Element */
$('body').on('click', '.menu-edit-text', function(e){
	e.preventDefault();	
	
	var self = $(this).closest('div.draggable-holder').find('.draggable-element');
	var id = self.attr('id');

	if( !existElement('cke_'+id) ) {
		renderCkeditorToElement( id, self.width(), self.height() );
	}
	setMenuEditElement(false, 'destroy');
});

$('body').on('click', '.menu-delete', function(e){
	e.preventDefault();
	$(this).closest('div.draggable-holder').remove();
	setMenuEditElement(false, 'destroy');
});

/* Close Properties */
$('body').on('click', '.prop-close-button', function(e){
	e.preventDefault();
	$('.box-edit-properties').remove();
});

var validRepositionElementLeft = function( grabbed_object, direction ) {
	
	var width = parseInt(grabbed_object.css('width'));
	var height = parseInt(grabbed_object.css('height'));
	var editor_container_width = parseInt(editor_container.css('width'));
	var editor_container_height = parseInt(editor_container.css('height'));

	var left = parseInt(grabbed_object.css('left'));
	var top = parseInt(grabbed_object.css('top'));
	var right = left + width;
	var bottom = top + height;

	if( direction == 'left' && left <= 0 ) {
		return false;
	} else if( direction == 'top' && top <= 0 ) {
		return false;
	} else if( direction == 'right' && right >= editor_container_width ){
		return false;
	} else if( direction == 'bottom' && bottom >= editor_container_height ){
		return false;
	}

	return true;
}

var repositionElement = function( grabbed_object, e ) {

	var coord_x = e.pageX;
	var coord_y = e.pageY;
	var position_difference = 0;

	// MOVING UP
	if (coord_y < oldy) {

		if( validRepositionElementLeft(grabbed_object, 'top') ) {
			position_difference = Math.abs(coord_y - oldy);
			var top = parseFloat(grabbed_object.css('top')) - position_difference + 'px';
			grabbed_object.css('top', top);
			grabbed_object.find('.draggable-element').css('top', top);
		}
	}
	
	// MOVING DOWN
	if (coord_y > oldy) {

		if( validRepositionElementLeft(grabbed_object, 'bottom') ) {
			position_difference = Math.abs(coord_y - oldy);
			var top = parseFloat(grabbed_object.css('top')) + position_difference + 'px';
			grabbed_object.css('top', top);
			grabbed_object.find('.draggable-element').css('top', top);
		}
	}

	// MOVING RIGHT
	if (coord_x > oldx) {
		
		if( validRepositionElementLeft(grabbed_object, 'right') ) {
			position_difference = Math.abs(coord_x - oldx);
			var left = parseFloat(grabbed_object.css('left')) + position_difference + 'px';
			grabbed_object.css('left', left);
			grabbed_object.find('.draggable-element').css('left', left);
		}
	}
	
	// MOVING LEFT
	if (coord_x < oldx) {
		
		if(	validRepositionElementLeft(grabbed_object, 'left') ) {
			position_difference = Math.abs(coord_x - oldx);
			var left = parseFloat(grabbed_object.css('left')) - position_difference + 'px';
			grabbed_object.css('left', left);
			grabbed_object.find('.draggable-element').css('left', left);
		}
	}
}

var addElement = function( element, e ){

	var clone_element = element.clone().addClass('no-mg').addClass('grab');
	var random_coordinate = randomPosition(e);
	var coord_x = random_coordinate.x;
	var coord_y = random_coordinate.y;
	var id = 1;
	var element_type = clone_element.attr('element-type');

	// Set object counter, so we could set every element to hav an id.
	if ( flag_object_counter.hasOwnProperty(element_type) ) {
		id = parseInt(flag_object_counter[element_type]) + 1;
	} else {
		flag_object_counter[element_type] = id;
	}
	flag_object_counter[element_type] = id;
	

	if( element_type == 'text' ) {

		var clone_element_class = clone_element.attr('class');
		var wrapper = $('<div style="word-wrap: break-word;" element-type="'+element_type+'" class="'+clone_element_class+'"></div>');
		
		clone_element.removeAttr('element-type');
		clone_element.removeClass('draggable-element');
		clone_element.removeAttr('style');

		// SET ELEMENT UNCLICKABLE BUT STILL APPEAR
		clone_element.css('pointer-events','none');

		wrapper.append(clone_element);
		clone_element = wrapper;
	} else if( element_type == 'image' ) {

	}

	clone_element.attr('id', element_type+id);
	clone_element.css({
		'left' : coord_x + 'px',
		'top' : coord_y + 'px',
		'position' : 'static',
	});
	clone_element = wrapWithHolder(clone_element, coord_x, coord_y, element_type);
	// clone_element.draggable({
	// 	cancel: false,
	// 	disabled: false,
	// 	containment: editor_workspace,
	// 	drag: function(){
	// 		var self = $(this);
	// 		var left = self.css('left');
	// 		var top = self.css('top');

	// 		self.find('.draggable-element').css('left', left);
	// 		self.find('.draggable-element').css('top', top);

	// 		resetHolderSize( self );
	// 	},
	// 	stop: function() {

	// 		// MOZILLA BUG - FF SOMEHOW FOLLOW SET THIS BELOW PROPERTIES AUTOMATICALLY
	// 		resetHolderSize( $(this) );
	// 	}
	// });

	editor.append(clone_element);

	// TEXT ELEMENT WIDTH CANNOT BE READ UNTIL ELEMENT HAS BEEN APPENDED
	if( element_type == 'text' ) {
		var clone_element_width = clone_element.width() + 20;
		clone_element.find('.draggable-element').css('width', clone_element_width + 'px');
	}

	setMenuEditElement(clone_element);
	last_selected_object = clone_element;
}

var resetHolderSize = function( self ) {
	self.css({
		'width' : 'auto',
		'height' : 'auto',
		'right' : 'auto',
		'bottom' : 'auto'
	});
}

var wrapWithHolder = function( element, x, y, element_type ) { 

	var wrapper = $('<div class="draggable-holder active" style="padding: 5px; position:absolute; left: ' + x + 'px; top: ' + y + 'px;"> ' + 
		'<div class="edge active single-object top-right-point" style="cursor:ne-resize; height:10px; width:10px; position: absolute;right: -7px;top: -7px; border-radius: 3px; background-color: #3899ec;"></div>' +  
		'<div class="edge active single-object top-left-point" style="cursor:nw-resize; height:10px; width:10px; position: absolute;left: -7px;top: -7px; border-radius: 3px; background-color: #3899ec;"></div>' +  
		'<div class="edge active single-object bottom-right-point" style="cursor:se-resize; height:10px; width:10px; position: absolute;right: -7px;bottom: -7px; border-radius: 3px; background-color: #3899ec;"></div>' +  
		'<div class="edge active single-object bottom-left-point" style="cursor:sw-resize; height:10px; width:10px; position: absolute;left: -7px;bottom: -7px; border-radius: 3px; background-color: #3899ec;"></div>' +  
		'<div class="edge active single-object left-point" style="cursor:e-resize; height:10px; width:10px; position: absolute;left: -7px;bottom: 44%; border-radius: 3px; background-color: #3899ec;"></div>' +  
		'<div class="edge active single-object right-point" style="cursor:w-resize; height:10px; width:10px; position: absolute;right: -7px;bottom: 44%; border-radius: 3px; background-color: #3899ec;"></div>' +  
		'<div class="edge active single-object top-point" style="cursor:n-resize; height:10px; width:10px; position: absolute;top: -7px;left: 48%; border-radius: 3px; background-color: #3899ec;"></div>' +
		'<div class="edge active single-object bottom-point" style="cursor:s-resize; height:10px; width:10px; position: absolute;bottom: -7px;left: 48%; border-radius: 3px; background-color: #3899ec;"></div>' +
	'</div>');

	wrapper.append(element);
	return wrapper;
}

var randomPosition = function(e){
	var x = Math.floor(Math.random() * 440) + 360;
	// var y = Math.floor(Math.random() * 340) + 160;
	var y = e.pageY;
	return {
		'x' : x,
		'y' : y
	}
}

var existElement = function( id ) {
	return $('#'+id).length;
}

var inArray = function( validated_class, class_list ) {
	if( $.isArray(validated_class) ) {
		for( var i in validated_class ){
			var cur_class = validated_class[i];
			if( $.inArray(cur_class, class_list) == -1 ) {
				return false;
			}
		}
		return true;
	} else {
		return ( $.inArray(validated_class, class_list) > -1 );
	}
}

var resetAllSelectedObject = function(){
	$('.draggable-holder').removeClass('active');
	$('.edge').removeClass('active');
}

/* Upload Image + Set Background Image */
$('.bg-items', modal_image).click(function(){
	$('.bg-items', modal_image).removeClass('active');
	var self = $(this);
	self.addClass('active');
});

$('.bg-items', modal_image).dblclick(function(e){
	e.preventDefault();
	var selected_image = $('.bg-items.active', modal_image).clone().removeClass('active');
	var source = selected_image.find('img').attr('src');
	setEditorBgImage(source);
});

$('#btnUploadImage', modal_image).click(function(e){
	e.preventDefault();
	var selected_image = $('.bg-items.active', modal_image).clone().removeClass('active');
	var source = selected_image.find('img').attr('src');
	var image_element = $('<img class="draggable-element" src="'+source+'" style="width:440px; height:240px; position:static;" element-type="image" />');
	addElement(image_element, e);
});

$('#btnSetBackgroundImage', modal_image).click(function(e){
	e.preventDefault();
	var selected_image = $('.bg-items.active', modal_image).clone().removeClass('active');
	var source = selected_image.find('img').attr('src');
	setEditorBgImage(source);
});

$('#btnSetBackgroundColor').closest('form').submit(function(e){
	e.preventDefault();

	var hex_color = $('#txtHexColor').val();
	hex_color = hex_color.replace(/\#/g, '');

	if( isHexaColor(hex_color) ) {
		hex_color = '#'+hex_color;
		setEditorBgColor(hex_color);
	}
});

$('.left-content .content .category-content .category-view .items-section .bg-items').click(function(){
	var self = $(this);
	var color = self.css('background-color');
	setEditorBgColor(color);
});
/* END Upload Image + Set Background Image */

var resizeEditor = function( point, e ) {

	var position_difference = 0;
	if ( point == 'top-point' ) {

		position_difference = Math.abs(e.pageY - oldy);

		// MOVING UP
		if (e.pageY < oldy) {
			var curtop = parseFloat(editor_header_separator.css('top')) - position_difference + 'px';
			var curheight = parseFloat(editor_header.css('height')) - position_difference + 'px';
		}
		
		// MOVING DOWN
		if (e.pageY > oldy) {
			var curtop = parseFloat(editor_header_separator.css('top')) + position_difference + 'px';
			var curheight = parseFloat(editor_header.css('height')) + position_difference + 'px';
		}

		editor_header_separator.css('top', curtop);
		editor_header.css('height', curheight);

	} else if ( point == 'bottom-point' ) {

		position_difference = Math.abs(e.pageY - oldy);

		// MOVING UP
		if (e.pageY < oldy) {
			var curheight = parseFloat(editor.css('height')) - position_difference + 'px';
		}
		
		// MOVING DOWN
		if (e.pageY > oldy) {
			var curheight = parseFloat(editor.css('height')) + position_difference + 'px';
		}

		editor.css('height', curheight);
	}
}

var resizeSingleObject = function( point, e, grabbed_object, object ){

	var position_difference = 0;
	if ( point == 'top-point' ) {

		// MOVING UP
		if (e.pageY < oldy) {
			
			position_difference = Math.abs(e.pageY - oldy);
			var curtop = parseFloat(grabbed_object.css('top')) - position_difference + 'px';
			var curheight = parseFloat(object.css('height')) + position_difference + 'px';
			grabbed_object.css('top', curtop);
			object.css('height', curheight);
		}
		
		// MOVING DOWN
		if (e.pageY > oldy) {

			position_difference = Math.abs(e.pageY - oldy);
			var curtop = parseFloat(grabbed_object.css('top')) + position_difference + 'px';
			var curheight = parseFloat(object.css('height')) - position_difference + 'px';
			grabbed_object.css('top', curtop);
			object.css('height', curheight);
		}

	} else if ( point == 'right-point' ) {

		// MOVING RIGHT
		if (e.pageX > oldx) {

			position_difference = Math.abs(e.pageX - oldx);
			var curwidth = parseFloat(object.css('width')) + position_difference + 'px';
			object.css('width', curwidth);
		}
		
		// MOVING LEFT
		if (e.pageX < oldx) {

			position_difference = Math.abs(e.pageX - oldx);
			var curwidth = parseFloat(object.css('width')) - position_difference + 'px';
			object.css('width', curwidth);
		}

	} else if ( point == 'bottom-point' ) {

		// MOVING UP
		if (e.pageY < oldy) {
			
			position_difference = Math.abs(e.pageY - oldy);
			var curheight = parseFloat(object.css('height')) - position_difference + 'px';
			object.css('height', curheight);
		}
		
		// MOVING DOWN
		if (e.pageY > oldy) {
			
			position_difference = Math.abs(e.pageY - oldy);
			var curheight = parseFloat(object.css('height')) + position_difference + 'px';					
			object.css('height', curheight);
		}

	} else if ( point == 'left-point' ) {

		// MOVING RIGHT
		if (e.pageX > oldx) {
			
			position_difference = Math.abs(e.pageX - oldx);
			var curleft = parseFloat(grabbed_object.css('left')) + position_difference + 'px';
			var curwidth = parseFloat(object.css('width')) - position_difference + 'px';
			grabbed_object.css('left', curleft);
			object.css('width', curwidth);
		}
		
		// MOVING LEFT
		if (e.pageX < oldx) {
			
			position_difference = Math.abs(e.pageX - oldx);
			var curleft = parseFloat(grabbed_object.css('left')) - position_difference + 'px';
			var curwidth = parseFloat(object.css('width')) + position_difference + 'px';
			grabbed_object.css('left', curleft);
			object.css('width', curwidth);
		}

	} else if ( point == 'top-right-point' ) {

		// MOVING UP
		if (e.pageY < oldy) {

			position_difference = Math.abs(e.pageY - oldy);
			var curtop = parseFloat(grabbed_object.css('top')) - position_difference + 'px';
			var curheight = parseFloat(object.css('height')) + position_difference + 'px';
			grabbed_object.css('top', curtop);
			object.css('height', curheight);
		}

		// MOVING DOWN
		if (e.pageY > oldy) {
			
			position_difference = Math.abs(e.pageY - oldy);
			var curtop = parseFloat(grabbed_object.css('top')) + position_difference + 'px';
			var curheight = parseFloat(object.css('height')) - position_difference + 'px';
			grabbed_object.css('top', curtop);
			object.css('height', curheight);
		}

		// MOVING RIGHT
		if (e.pageX > oldx) {
			
			position_difference = Math.abs(e.pageX - oldx);
			var curwidth = parseFloat(object.css('width')) + position_difference + 'px';
			object.css('width', curwidth);
		}
		
		// MOVING LEFT
		if (e.pageX < oldx) {
			position_difference = Math.abs(e.pageX - oldx);
			var curwidth = parseFloat(object.css('width')) - position_difference + 'px';
			object.css('width', curwidth);
		}	

	} else if ( point == 'bottom-right-point' ) {

		// MOVING UP
		if (e.pageY < oldy) {
			
			position_difference = Math.abs(e.pageY - oldy);
			var curheight = parseFloat(object.css('height')) - position_difference + 'px';
			object.css('height', curheight);
		}
		
		// MOVING DOWN
		if (e.pageY > oldy) {
			
			position_difference = Math.abs(e.pageY - oldy);
			var curheight = parseFloat(object.css('height')) + position_difference + 'px';
			object.css('height', curheight);
		}

		// MOVING RIGHT
		if (e.pageX > oldx) {

			position_difference = Math.abs(e.pageX - oldx);
			var curwidth = parseFloat(object.css('width')) + position_difference + 'px';
			object.css('width', curwidth);
		}
		
		// MOVING LEFT
		if (e.pageX < oldx) {

			position_difference = Math.abs(e.pageX - oldx);
			var curwidth = parseFloat(object.css('width')) - position_difference + 'px';
			object.css('width', curwidth);
		}
	} else if ( point == 'bottom-left-point' ) {

		// MOVING UP
		if (e.pageY < oldy) {

			position_difference = Math.abs(e.pageY - oldy);
			var curheight = parseFloat(object.css('height')) - position_difference + 'px';
			object.css('height', curheight);
		}
		
		// MOVING DOWN
		if (e.pageY > oldy) {
			
			position_difference = Math.abs(e.pageY - oldy);
			var curheight = parseFloat(object.css('height')) + position_difference + 'px';
			object.css('height', curheight);
		}

		// MOVING RIGHT
		if (e.pageX > oldx) {

			position_difference = Math.abs(e.pageX - oldx);
			var curleft = parseFloat(grabbed_object.css('left')) + position_difference + 'px';
			var curwidth = parseFloat(object.css('width')) - position_difference + 'px';
			grabbed_object.css('left', curleft);
			object.css('width', curwidth);
		}
		
		// MOVING LEFT
		if (e.pageX < oldx) {
			
			position_difference = Math.abs(e.pageX - oldx);
			var curleft = parseFloat(grabbed_object.css('left')) - position_difference + 'px';
			var curwidth = parseFloat(object.css('width')) + position_difference + 'px';
			grabbed_object.css('left', curleft);
			object.css('width', curwidth);
		}

	} else if ( point == 'top-left-point' ) {

		// MOVING UP
		if (e.pageY < oldy) {
			
			position_difference = Math.abs(e.pageY - oldy);
			var curtop = parseFloat(grabbed_object.css('top')) - position_difference + 'px';
			var curheight = parseFloat(object.css('height')) + position_difference + 'px';
			grabbed_object.css('top', curtop);
			object.css('height', curheight);
		}
		
		// MOVING DOWN
		if (e.pageY > oldy) {

			position_difference = Math.abs(e.pageY - oldy);
			var curtop = parseFloat(grabbed_object.css('top')) + position_difference + 'px';
			var curheight = parseFloat(object.css('height')) - position_difference + 'px';
			grabbed_object.css('top', curtop);
			object.css('height', curheight);
		}

		// MOVING RIGHT
		if (e.pageX > oldx) {
			
			position_difference = Math.abs(e.pageX - oldx);
			var curleft = parseFloat(grabbed_object.css('left')) + position_difference + 'px';
			var curwidth = parseFloat(object.css('width')) - position_difference + 'px';
			grabbed_object.css('left', curleft);
			object.css('width', curwidth);
		}
		
		// MOVING LEFT
		if (e.pageX < oldx) {
			
			position_difference = Math.abs(e.pageX - oldx);
			var curleft = parseFloat(grabbed_object.css('left')) - position_difference + 'px';
			var curwidth = parseFloat(object.css('width')) + position_difference + 'px';
			grabbed_object.css('left', curleft);
			object.css('width', curwidth);
		}
	}

	setMenuEditElement(grabbed_object, 'destroy');
	setMenuEditProperties(grabbed_object, 'destroy');
}