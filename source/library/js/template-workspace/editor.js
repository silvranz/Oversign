// FROM MAIN HTML
(function(old) {
	$.fn.attr = function() {
		if(arguments.length === 0) {
			if(this.length === 0) {
				return null;
			}

			var obj = {};
			$.each(this[0].attributes, function() {
				if(this.specified) {
					obj[this.name] = this.value;
				}
			});

			return obj;
		}

		return old.apply(this, arguments);
	};
})($.fn.attr);

$(document).ready(function(e) {

	editor_container = $('#editor-container');
	editor_workspace = $('#editor-workspace');
	editor = $('#editor-content');
	editor_header = $('#editor-header');
	editor_footer = $('#editor-footer');
	editor_header_separator = $('.editor-header-separator');
	editor_footer_separator = $('.editor-footer-separator');
	modal_image = $('.modal-image');

	grabbed_object = false;
	last_selected_object = false;
	is_resizing_object = false;
	is_resizing_editor = false;
	is_reposition_object = false;
	point = false;
	oldx = 0;
	oldy = 0;
	flag_object_counter = {};
	copiedCuttedObject = {};

	json_obj = {
		'pages' : [
			{
				id : 'page1',
				name : 'Page 1',
				header : {
					'background-color' : 'transparent',
					'height' : '150px',
					'width' : '100%',
				},
				footer : {
					'background-color' : 'transparent',
					'height' : '130px',
					'width' : '100%',
				},
				attribute : {
					'style' : {
						'background-color': "rgba(0, 0, 0, 0)",
					}
				},
				is_homepage : true,
			},
			{
				id : 'page2',
				name : 'Page 2',
				header : {
					'background-color' : 'transparent',
					'height' : '150px',
					'width' : '100%',
				},
				footer : {
					'background-color' : 'transparent',
					'height' : '130px',
					'width' : '100%',
				},
				attribute : {
					'style' : {
						'background-color': "rgba(0, 0, 0, 0)",
					}
				},
				is_homepage : false,
			},
		],
		'elements' : [],
		'events' : [],
	};
	editor_json = json_obj;
	pages = editor_json.pages;
	elements = editor_json.elements;
	events = editor_json.events;

	$('#btnPublish').click(function(e){
		e.preventDefault();

		saveState();
		var old_json = convertToOldFormatJSON();
		old_json = JSON.stringify(old_json);
		old_json = old_json.replace(/\\"/g,'\\\'');
		old_json = old_json.replace(/\\t/g,'');
		old_json = old_json.replace(/\\n/g,'');
	});

	$('#btnPreview').click(function(e){
		e.preventDefault();

		saveState();

		var old_json = convertToOldFormatJSON();
		var stringify = JSON.stringify(old_json);

		stringify = stringify.replace(/\\"/g,'\'');
		stringify = stringify.replace(/\\t/g,'');
		stringify = stringify.replace(/\\n/g,'');
		
		sessionStorage.setItem("stringify", stringify);
		window.open("preview.html","_blank");
		
	});

	$('.left-control-list').click(function(e){
		var self = $(this);
		var selector_id = '#'+self.attr('trigger-content-id');

		hideLeftContent();
		hideBoxTools();
		hideBoxPage();
		setRightClickMenu( false, 'destroy');
		$(selector_id).fadeIn(100);
	});

	$('.category').click(function(){
		var self = $(this);
		var selector_id = '#'+self.attr('trigger-panel-id');

		$('.category-content', self.closest('div[id="add-content"]')).hide();
		$(selector_id).fadeIn();
	});

	$('.left-content .draggable-element').click(function(e){
		var self = $(this);
		addElement(self, e);
		hideLeftContent();
		setRightClickMenu( false, 'destroy');
	});

	$('body').on('dblclick', '.draggable-element', function(){
		var self = $(this);
		var id = self.attr('id');
		var element_type = self.attr('element-type');

		if( element_type == 'text' || element_type == 'link' ) {
			renderCkeditorToElement( id, self.width(), self.height() );
		}
	});

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

	$('#btnApplyBackgroundToOtherPages').click(function(e){
		e.preventDefault();

		var container_style = editor_workspace.attr('style');
		var arr_container_style = container_style.split(';');
		arr_container_style.pop();
		var pagestyle = {};
		for( key in arr_container_style ) {
			var style = arr_container_style[key];
			var arr_style = style.split(/:(.+)/);
			var properties = arr_style[0].trim().toString();
			var value = arr_style[1].trim().toString();
			pagestyle[properties] = value;
		}

		for( key in pages ) {
			var page = pages[key];
			page.attribute.style = pagestyle;
		}
	});

	$('.left-content .content .category-content .category-view .items-section .bg-items').click(function(){
		var self = $(this);
		var color = self.css('background-color');
		setEditorBgColor(color);
	});
	/* END Upload Image + Set Background Image */

	$(document).mouseup(function(e) {
		grabbed_object = null;
		is_resizing_object = false;
		is_reposition_object = false;
		point = false;
		removeDraggedAlong();
	});

	$(document).on('contextmenu', function(e) {
		e.preventDefault();
	});

	$(document).mousedown(function(e) {
		
		var class_list = e.target.classList;
		
		if ( inArray(Array('edge', 'single-object'), class_list ) ) { // USER WANT TO RESIZE SINGLE OBJECT

			grabbed_object = $(e.target).parent();
			point = class_list[class_list.length-1];
			point = ( point == 'active' ) ? class_list[class_list.length-2] : point;
			oldx = e.pageX;
			oldy = e.pageY;
			is_resizing_object = true;
			removeDraggedAlong();
			// grabbed_object.draggable("destroy");

		} else if( inArray('editor-content-separator', class_list) ) { // USER WANT TO RESIZE EITHER EDITOR HEADER OR FOOTER

			// grabbed_object = $(e.target).parent();
			point = class_list[class_list.length-1];
			point = ( point == 'active' ) ? class_list[class_list.length-2] : point;
			oldx = e.pageX;
			oldy = e.pageY;
			is_resizing_editor = true;
			return false;

		} else if ( inArray('draggable-element', class_list) ) { // USER JUST SELECT ONE OBJECT

			e.preventDefault();
			resetAllSelectedObject();
			hideBoxTools();
			hideBoxPage();

			grabbed_object = $(e.target).closest('.draggable-holder');
			last_selected_object = grabbed_object;

			grabbed_object.addClass('active');
			grabbed_object.find('.edge').addClass('active');
			is_reposition_object = true;

			if( e.which == 1 ) {

				// CHECK IF SELECTED OBJECT IS CONTAINER OR NOT
				if( grabbed_object.find('.draggable-element').attr('element-type') == 'container' ) {

					var container = grabbed_object.find('.draggable-element');
					var container_left = parseInt(container.css('left'));
					var container_top = parseInt(container.css('top'));
					var container_width = parseInt(container.css('width'));
					var container_height = parseInt(container.css('height'));

					editor_workspace.find('.draggable-element').each(function(){

						var self = $(this);
						var left = parseInt(self.css('left'));
						var top = parseInt(self.css('top'));
						var width = parseInt(self.css('width'));
						var height = parseInt(self.css('height'));

						var distance_top = (top - container_top);
						var distance_left = (left - container_left);

						if( width <= container_width && height <= container_height && container_left <= left && container_top <= top && (distance_left+width) <= container_width && (distance_top+height) <= container_height ) {
							self.addClass('dragged-along');
						}
					});
				}

				setRightClickMenu( false, 'destroy');
				setMenuEditElement(grabbed_object);
			} else if( e.which == 3 ) {
				is_reposition_object = false;
				setRightClickMenu( grabbed_object );
			}

		} else if( inArray('editor-workspace', class_list) ) {
			hideLeftContent();
			resetAllSelectedObject();
			hideBoxTools();
			hideBoxPage();
			setMenuEditElement( false, 'destroy');
			setMenuEditProperties( false, 'destroy');

			if( e.which == 1 ) {
				setRightClickMenu( false, 'destroy');
			} else if( e.which == 3 ) {
				setRightClickMenu( false, 'show', 'menu-paste', e);
			}

			if( last_selected_object ) {
				var id = last_selected_object.find('.draggable-element').attr('id');
				var element_type = last_selected_object.find('.draggable-element').attr('element-type');

				if( element_type == 'text' ) {
					var width = last_selected_object.css('width');
					var height = last_selected_object.css('height');

					last_selected_object.find('.draggable-element').css('width', width);
					last_selected_object.find('.draggable-element').css('height', height);
				}

				if( CKEDITOR.instances[id] ) {
					CKEDITOR.instances[id].destroy(false);
				}
			}
		}

		if( $('#switch-ruler').prop('checked') ){
			setEditorHighlightedBorder(class_list);
		}
	});

	$(document).mousemove(function(e){
		if( is_reposition_object ){
			repositionElement(grabbed_object, e);
		} else if ( is_resizing_object ) {
			var object = $('.draggable-element', grabbed_object);
			resizeSingleObject( point, e, grabbed_object, object );
		} else if( is_resizing_editor ) {
			resizeEditor(point, e);
		}

		updateCoordinate(e);
	});

	// $('body').on('mouseover', '.box-page .box-list-page ul li .preview-workspace-container', function(){
	// 	var workspace_preview = $(this).find('img').clone();
	// 	workspace_preview.attr({
	// 		'width' : 880,
	// 		'height' : 2132
	// 	});
	// 	$('.enlarge-preview-workspace').empty().append(workspace_preview).clearQueue().show();
	// });

	// $('body').on('mouseleave', '.box-page .box-list-page ul li .preview-workspace-container', function(){
	// 	$('.enlarge-preview-workspace').stop().delay(1000).queue(function(){
	// 		$(this).empty().hide();
	// 	});
	// });

	// $('body').on('mouseover', '.enlarge-preview-workspace', function(){
	// 	$(this).clearQueue().show();
	// });

	// $('body').on('mouseleave', '.enlarge-preview-workspace', function(){
	// 	$(this).stop().delay(1000).queue(function(){
	// 		$(this).empty().hide();
	// 	});
	// });

	convertToOldFormatJSON = function(){
		var json = {
			'pages' : pages,
			'elements' : elements,
			'events' : events,
		}

		for( key_parent in json.pages ) {
			var page = json.pages[key_parent];
			var pageid = page.id;
			if( page.is_homepage ) {
				json.homepage = pageid;
				json.pagename = page.name;
			}
			page.elements = [];

			for( key in json.elements ) {
				var element = json.elements[key];
				var showOnPage = element.showOnPage;

				// SET EVENTS FOR ELEMENT
				element.events = [];
				for( skey in json.events ) {
					var ev = json.events[skey];
					if( element.id == ev.triggerElementId ) {
						element.events.push(ev);	
					}
				}

				for( subkey in showOnPage ){
					var cur = showOnPage[subkey];
					if( cur.id == pageid && cur.display == true) {
						page.elements.push(element);
						break;
					}
				}
			}
		}

		delete json.elements;
		delete json.events;
		return json;
	}

	convertToNewFormatJSON = function( json_str ) {
		
		var new_format = {
			'pages' : [],
			'elements' : [],
			'events' : []
		}
		var parsed_json = JSON.parse(json_str);

		for( key_parent in parsed_json.pages ) {

			var page = parsed_json.pages[key_parent];
			for( key in page.elements ) {

				var element = page.elements[key];
				if( element.hasOwnProperty('events') ) {
					for( sub_key in element.events ) {
						var ev = element.events[sub_key];
						new_format.events.push(ev);
					}
				}

				delete element.events;

				// check if element exists
				var found = false;
				for( check_key in new_format.elements ) {
					var curelement = new_format.elements[check_key];
					if( curelement.id == element.id ) {
						found = true;
						break;
					}
				}

				if( !found ) {
					new_format.elements.push(element);
				}
			}

			delete page.elements;
			new_format.pages.push(page);
		}

		console.log(new_format);

		return new_format;
	}

	renderWorkspaceToThumbnail = function( selector_preview ) {

		$('body').find('.box-page').css('display','none');
		$('body').find('.enlarge-preview-workspace').css('display','none');

		html2canvas([$('body')[0]], {
			logging : true
		}).then(function(canvas) {
	        var editor_container_height = $('#editor-container').height();
	    	
	    	// canvas is the final rendered <canvas> element
	        var extra_canvas = document.createElement("canvas");
	        extra_canvas.setAttribute('width',1349);
	        extra_canvas.setAttribute('height',editor_container_height);

	        var ctx = extra_canvas.getContext('2d');
	        ctx.drawImage(canvas,0,0,canvas.width, canvas.height,0,0,1349, editor_container_height);
	        var dataURL = extra_canvas.toDataURL();
	        var img = $(document.createElement('img'));
	        img.attr('src', dataURL);
	        img.attr({
	        	'src' : dataURL,
	        	'width' : 60,
	        	'height' : 40,
	        });

	        selector_preview.empty().append(img);
	    });
	}

	/* CKEDITOR */
	renderCkeditorToElement = function( id, width, height ) {
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

	isWysiwygareaAvailable = function() {
		if ( CKEDITOR.revision == ( '%RE' + 'V%' ) ) {
			return true;
		}
		return !!CKEDITOR.plugins.get( 'wysiwygarea' );
	}

	/* CORE FUNCTION */
	hideLeftContent = function(){
		$('.left-content').fadeOut(100);
	}

	hideBoxTools = function(){
		$('.box-tools').fadeOut(100);
	}

	hideBoxPage = function(){
		$('.box-page').fadeOut(100);
	}

	updateCoordinate = function(e) {
		oldy = e.pageY;
		oldx = e.pageX;
	}

	isHexaColor = function(sNum){
	  	return (typeof sNum === "string") && sNum.length === 6 && ! isNaN( parseInt(sNum, 16) );
	}

	resetEditorBg = function( param ) {

		if( param == 'bg-color' && editor_workspace.css('background-image') != 'none' ) {
			editor_workspace.css({
				'background' : '',
			});
		} else if( param == 'bg-image' ) {
			editor_workspace.css({
				'backgroundColor' : '',
			});
		}
	}

	setEditorBgColor = function( color ) {
		resetEditorBg('bg-color');
		editor_workspace.stop().animate({ 
			'backgroundColor' : color 
		});
	}

	setEditorBgImage = function( source_image ) {
		editor_workspace.stop().fadeOut(function(){
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

	setEditorHighlightedBorder = function( class_list ) {
		
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
	}

	setMenuEditElement = function( element, status ) {

		status = (typeof status === "undefined" || status === null) ? 'show' : status; 
		$('.menu-edit-container').remove();
		$('.box-edit-properties').remove();
		$('.box-edit-event').remove();

		if( status == 'show' ) {
			var menu_wrapper = $('<div class="menu-edit-container">'+
				'<div class="menu-edit-text">Edit Text</div>'+
				'<div class="menu-edit-properties">Properties</div>'+
				'<div class="menu-edit-event">Events</div>'+
				'<div class="menu-delete">Delete</div>'+
			'</div>');
			var element_type = element.find('.draggable-element').attr('element-type');

			if( element_type != 'text' && element_type != 'link' ) {
				menu_wrapper.find('.menu-edit-text').remove();
			}
			if( element_type != 'link' && element_type != 'button' && element_type != 'image' ) {
				menu_wrapper.find('.menu-edit-event').remove();
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
		var holder = $(this).closest('div.draggable-holder');
		holder.remove();
		setMenuEditElement(false, 'destroy');
		removeElement(holder);
	});

	removeElement = function( holder ) {
		var id = holder.find('.draggable-element').attr('id');
		for( key in elements ){
			var element = elements[key];
			if( element.id == id ) {
				elements.splice(key, 1);
				break;
			}
		}
	}

	/* Close Properties */
	$('body').on('click', '.prop-close-button', function(e){
		e.preventDefault();
		$('.box-edit-properties').remove();
		$('.box-edit-event').remove();
	});

	/* Ruler */
	$('body').on('click', '#switch-ruler', function(){
		var self = $(this);
		setRulerVisible(self.prop('checked'));
	});
	$('body').on('click', '#btnOpenBoxTools', function(e){
		e.preventDefault();
		var self = $(this);

		hideLeftContent();
		hideBoxPage();
		setRightClickMenu( false, 'destroy');
		$('.box-tools').stop().fadeToggle(100);
	});

	// Box Page
	$('body').on('click', '#btnOpenBoxPage', function(e){
		e.preventDefault();
		var self = $(this);

		hideLeftContent();
		hideBoxTools();
		setRightClickMenu( false, 'destroy');

		$('.box-page').stop().fadeToggle(100);
	});

	// Modal Add Page
	$('body').on('click', '#btnOpenModalAddPage', function(e){
		$('.input-page-name').val('').removeClass('selected').hide();
	});

	$('body').on('click', '.btnChoosePageItem', function(e) {
		e.preventDefault();
		var self = $(this);
		$('.input-page-name').removeClass('selected').hide();

		self.parent().find('.input-page-name').addClass('selected').show();
	});

	$('body').on('keyup', '.input-page-name.selected', function(e){
		if( e.keyCode == 13 ) { // WHEN PRESS ENTER
			$('#btnAddPage').trigger('click');
		}
	});

	$('body').on('click', '#btnAddPage', function(e){
		e.preventDefault();
		var pagename = $('.input-page-name.selected').val();
		var page = addPage(pagename, 'add');
		setContainerHeaderFooter(page);
		displayFilteredElement(page.id);
		$('.left-control').fadeIn(100);
		// prevent all object being selected
		// $('.draggable-holder').removeClass('active');
		// $('.edge-holder').removeClass('active');
		// setMenuEditElement(false, 'destroy');
	});

	addPage = function( page, status ) {

		status = (typeof status === "undefined" || status === null) ? 'init' : status;
		var tmp_page = $('.box-page .box-list-page ul li.item-template').clone().removeAttr('class').show();
		var pageid = setObjectCounter('page');
		var activePageId = false;
		var activePageText = false;

		if( status == 'init' ) {
			if( page.is_homepage ) {
				activePageText = page.name;
				activePageId = page.id;
				setContainerHeaderFooter(page);
				displayFilteredElement(activePageId);
			}
			tmp_page.attr('id', page.id);
			tmp_page.find('.page-name').text(page.name);

			newpage = page;
			// saveState();
			
		} else if( status == 'add' ) {
			activePageText = page;
			activePageId = pageid;
			tmp_page.attr('id', pageid);
			tmp_page.find('.page-name').text(page);

			var newpage = {
				id : pageid,
				name : page,
				header : {
					'background-color' : 'transparent',
					'height' : '110px',
					'width' : '100%',
				},
				footer : {
					'background-color' : 'transparent',
					'height' : '110px',
					'width' : '100%',
				},
				attribute : {
					'style' : {
						'background-color': "rgba(0, 0, 0, 0)",
					}
				},
				is_homepage : false,
			}

			for( key in elements ) {
				var element = elements[key];
				var display = ( typeof element.attribute['showall'] === "undefined" || element.attribute['showall'] === null ) ? false : element.attribute['showall'];
				display = ( display == 'true' ) ? true : false;
				elements[key].showOnPage.push({
					'id' : pageid,
					'display': display,
				});
			}
			pages.push(newpage);
			saveState();
		
		} else if( status == 'duplicate' ) {

			var newpage = $.extend(true, {}, page);
			newpage.id = pageid;
			newpage.name = 'Copy from ' + page.name;
			newpage.is_homepage = false;

			var flagExistsPageName = true;
			while(flagExistsPageName){
				for( key in pages ) {
					var curpage = pages[key];
					if( curpage.name == newpage.name ) {
						newpage.name = 'Copy ' + newpage.name;
						flagExistsPageName = true;
						break;
					} else {
						flagExistsPageName = false;
					}
				}
			}

			tmp_page.attr('id', pageid);
			tmp_page.find('.page-name').text(newpage.name);

			for( key in elements ) {
				var element = elements[key];
				var showall = ( typeof element.attribute['showall'] === "undefined" || element.attribute['showall'] === null ) ? false : element.attribute['showall'];
				showall = ( showall == 'true' ) ? true : false;

				if( showall ) {
					elements[key].showOnPage.push({
						'id' : pageid,
						'display': true,
					});
				} else {

					if( element.createdOnPage == page.id ) {

						var newelement = $.extend(true, {}, element);
						element.showOnPage.push({
							'id' : pageid,
							'display' : false,
						});

						var id = parseInt(flag_object_counter[newelement.attribute['element-type']]) + 1;
						flag_object_counter[newelement.attribute['element-type']] = id;

						newelement.createdOnPage = pageid;
						newelement.id = newelement.attribute['element-type'] + id;
						newelement.attribute.id = newelement.attribute['element-type'] + id;
						for( k in newelement.showOnPage ) {
							newelement.showOnPage[k].display = false;
						}
						newelement.showOnPage.push({
							'id' : pageid,
							'display' : true,
						});

						elements.push(newelement);
					}

					// for( k in elements[key].showOnPage ) {
					// 	var show_on_page = elements[key].showOnPage[k];
					// 	if( show_on_page.id == page.id ) {
					// 		elements[key].showOnPage.push({
					// 			'id' : pageid,
					// 			'display': show_on_page.display,
					// 		});
					// 		break;
					// 	}
					// }
				}
			}

			pages.push(newpage);
			setContainerHeaderFooter(newpage);
			displayFilteredElement(newpage.id);
		}

		if( newpage.is_homepage ) {
			tmp_page.find('.switch-homepage').prop('checked', true);
		}
		$('.box-page .box-list-page ul').append(tmp_page);
		
		if( activePageId && activePageText) {
			$('#btnOpenBoxPage span').attr('active-page-id', activePageId).text(activePageText);
		}
		initModal();

		return newpage;
	}

	refreshObjectCounter = function(){
		var max_id = 1;
		var element_type = 'page';
		for( key in pages ) {
			var page = pages[key];
			var counter = parseInt(page.id.replace(/\D/g, ''));
			if ( flag_object_counter.hasOwnProperty(element_type) ) {
				if( flag_object_counter[element_type] < counter ) {
					flag_object_counter[element_type] = counter;
				}
			} else {
				flag_object_counter[element_type] = counter;
			}
		}

		for( key in elements ) {
			var element = elements[key];
			var element_type = element.attribute['element-type'];
			var counter = parseInt(element.id.replace(/\D/g, ''));
			if ( flag_object_counter.hasOwnProperty(element_type) ) {
				if( flag_object_counter[element_type] < counter ) {
					flag_object_counter[element_type] = counter;
				}
			} else {
				flag_object_counter[element_type] = counter;
			}
		}

		// console.log(flag_object_counter);
	}

	setObjectCounter = function( element_type ) {
		var id = 1;
		if ( flag_object_counter.hasOwnProperty(element_type) ) {
			id = parseInt(flag_object_counter[element_type]) + 1;
		}

		flag_object_counter[element_type] = id;
		return (element_type+id);
	}

	init = function( json ){
		initPages(pages);
		refreshObjectCounter();

		initModal();
	}

	initPages = function( pages ) {
		var activePageText = '';
		var activePageId = '';
		for( var i in pages ) {
			var page = pages[i];
			addPage( page, 'init' );
		}

		// When page area is clicked, navigate to selected page
		$('body').on('click', '.box-page .box-list-page ul li', function(e){
			e.preventDefault();
			e.stopImmediatePropagation();

			if( !inArray(Array('btnRenamePage', 'btnDuplicatePage','btnTriggerDeletePageModal'), e.target.classList ) ) {
				
				var active_page_id = $('#btnOpenBoxPage span').attr('active-page-id');
				// var selector_preview = $('.box-page .box-list-page li[id='+active_page_id+']').find('.preview-workspace-container');
				// renderWorkspaceToThumbnail( selector_preview );

				saveState();

				var self = $(this).closest('li');
				var pageid = self.attr('id');
				var page = findPageById(pages, pageid);
				
				setContainerHeaderFooter(page);
				displayFilteredElement(pageid);
				$('#btnOpenBoxPage span').attr('active-page-id', page.id).text(page.name);
			}

			// console.log(JSON.stringify(pages, null, '\t'));
		});

		// Page Control
		$('body').on('click', '.box-page .box-list-page .btnTriggerRenamePageModal', function(e){
			e.preventDefault();
			e.stopImmediatePropagation();
			var self = $(this);
			var id = self.closest('li').attr('id');
			var pagename = self.closest('li').find('.page-name').text();
			$('#txtRenamePage').val(pagename);
			$('#btnRenamePage').attr('data-id', id);
		});
		$('body').on('click', '#btnRenamePage', function(e){
			e.preventDefault();
			e.stopImmediatePropagation();

			var self = $(this);
			var pageid = self.attr('data-id');
			
			for( key in pages ) {
				var page = pages[key];
				if( page.id == pageid ) {
					page.name = $('#txtRenamePage').val();
					$('#'+pageid).find('.page-name').text(page.name);
					break;
				}
			}
		});
		$('body').on('click', '.box-page .box-list-page .btnDuplicatePage', function(e){
			e.preventDefault();
			e.stopImmediatePropagation();
			saveState();

			console.log('Duplicate page');

			var self = $(this);
			var pageid = self.closest('li').attr('id');
			var page = findPageById(pages, pageid);
			var newpage = addPage(page, 'duplicate');
			$('#btnOpenBoxPage span').attr('active-page-id', newpage.id).text(newpage.name);

			initModal();
		});	
		$('body').on('click', '.box-page .box-list-page .btnTriggerDeletePageModal', function(e){
			e.preventDefault();
			e.stopImmediatePropagation();
			var self = $(this);
			var id = self.closest('li').attr('id');
			var pagename = self.closest('li').find('.page-name').text();
			$('#page-delete-confirmation').html('Are you sure to delete <b>'+pagename+'</b> ?');
			$('#btnDeletePage').attr('data-id', id);
		});

		$('body').on('click', '#btnDeletePage', function(e){
			e.preventDefault();
			e.stopImmediatePropagation();

			var self = $(this);
			var pageid = self.attr('data-id');
			
			for( key in pages ) {
				var page = pages[key];
				if( page.id == pageid ) {
					pages.splice(key, 1);
					break;
				}
			}

			for( key in elements ) {
				var element = elements[key];
				var show_on_page = element.showOnPage;
				for( k in show_on_page ) {
					if( show_on_page[k].id == pageid ) {
						elements[key].showOnPage.splice(k, 1);
						break;
					}
				}
			}

			$('.box-page .box-list-page li[id="'+pageid+'"]').remove();

			if( pages.length ) {
				if( $('#btnOpenBoxPage span').attr('active-page-id') == pageid ) {
					editor_container.find('.draggable-holder').remove();

					var page = pages[0];
					setContainerHeaderFooter(page);
					displayFilteredElement(page.id);
					$('#btnOpenBoxPage span').attr('active-page-id', page.id).text(page.name);
				}
			} else {
				editor_container.find('.draggable-holder').remove();
				resetWorkspace();
				$('#btnOpenBoxPage span').attr('active-page-id', 0).text("Add page...");
				$('.left-control').fadeOut(100);
			}
		});

		$('body').on('click', '.box-page .box-list-page .switch-homepage', function(e){
			e.preventDefault();
			e.stopImmediatePropagation();
			$('.switch-homepage').prop('checked', false);
			
			var self = $(this);
			var pageid = self.closest('li').attr('id');
			self.closest('label.switch').find('.switch-input').prop('checked', true);

			for( key in pages ) {
				var page = pages[key];
				if( page.id == pageid ) {
					pages[key].is_homepage = true;
				} else {
					pages[key].is_homepage = false;
				}
			}
		});
	}

	resetWorkspace = function(){
		editor_workspace.css('background-color', 'transparent');
		editor_header.css('background-color', 'transparent');
		editor_footer.css('background-color', 'transparent');
	}

	saveState = function(){
		
		// save pages state
		var pageid = $('#btnOpenBoxPage span').attr('active-page-id');
		var page = findPageById(pages, pageid);
		if( page ) {

			// Save header style
			var header_style = editor_header.attr('style');
			var arr_header_style = header_style.split(';');
			arr_header_style.pop();
			for( key in arr_header_style ) {
				var style = arr_header_style[key];
				var arr_style = style.split(':');
				var properties = arr_style[0].trim().toString();
				var value = arr_style[1].trim().toString();
				page.header[properties] = value;
			}

			// Save footer style
			var footer_style = editor_footer.attr('style');
			var arr_footer_style = footer_style.split(';');
			arr_footer_style.pop();
			for( key in arr_footer_style ) {
				var style = arr_footer_style[key];
				var arr_style = style.split(':');
				var properties = arr_style[0].trim().toString();
				var value = arr_style[1].trim().toString();
				page.footer[properties] = value;
			}

			// Save container style
			page.attribute.style = {};
			var container_style = editor_workspace.attr('style');
			var arr_container_style = container_style.split(';');
			arr_container_style.pop();
			for( key in arr_container_style ) {
				var style = arr_container_style[key];
				var arr_style = style.split(/:(.+)/);
				var properties = arr_style[0].trim().toString();
				var value = arr_style[1].trim().toString();
				page.attribute.style[properties] = value;
			}

			editor_container.find('.draggable-element').each(function(){

				var self = $(this);
				var active_page_id = $('#btnOpenBoxPage span').attr('active-page-id');

				var element = {};
				element.createdOnPage = active_page_id;
				element.attribute = self.attr();
				element.id = element.attribute.id;
				if( self.attr('element-type') == 'text' || self.attr('element-type') == 'link' ) {
					element.attribute['parent-style'] = self.attr('style');
					element.attribute['style'] = self.children().attr('style');
					element.tag = 'div';
					element.html = self.html();
				} else if( self.attr('element-type') == 'gallery' || self.attr('element-type') == 'article' ) {
					element.attribute['style'] = self.attr('style');
					element.tag = 'div';
					element.html = self.html();
				} else {
					element.tag = self.prop('tagName').toLowerCase();
				}
				
				var element_style = element.attribute.style;
				var arr_element_style = element_style.split(';');
				arr_element_style.pop();
				element.attribute.style = {};

				for( key in arr_element_style ) {
					var style = arr_element_style[key];
					var arr_style = style.split(':');
					var properties = arr_style[0].trim().toString();
					var value = arr_style[1].trim().toString();
					element.attribute.style[properties] = value;
				}

				var showall = ( typeof element.attribute['showall'] === "undefined" || element.attribute['showall'] === null ) ? false : element.attribute['showall'];
				showall = ( showall == 'true' ) ? true : false;

				var exists_element = findElementById(elements, element.id);
				if( exists_element ) {

					var tmp_showonpage = exists_element.showOnPage;
					var tmp_createdonpage = exists_element.createdOnPage;

					// ELEMENT NEVER BEEN TOGGLED ON OFF, THIS IS NECESSARY BECAUSE USER CAN DUPLICATE PAGE
					if( showall ) {
						for( key in tmp_showonpage ) {
							tmp_showonpage[key].display = true;
						}
					} else {
						for( key in tmp_showonpage ) {
							tmp_showonpage[key].display = false;
							if( tmp_showonpage[key].id == exists_element.createdOnPage ) {
								tmp_showonpage[key].display = true;
							}
						}
					}
					exists_element = element;
					exists_element.showOnPage = tmp_showonpage;
					exists_element.createdOnPage = tmp_createdonpage;

					// REPLACE EXISTS ELEMENT WITH NEW ONE
					for( i in elements ) {
						var curelem = elements[i];
						if( curelem.id == exists_element.id ) {
							elements[i] = exists_element;
							break;
						}
					}
				} else {
					
					var show_on_page = [];
					for( key in pages ) {
						var p = pages[key];
						var appended = {
							id : p.id,
							display : false,
						};
						if( showall ) {
							appended.display = true;
						}
						else if( appended.id == active_page_id ) {
							appended.display = true;
						}
						show_on_page.push(appended);
					}
					
					element.showOnPage = show_on_page;
					elements.push(element);
					// delete element.attribute.id;
				}
			});
			editor_container.find('.draggable-holder').remove();
		}

		// console.log(JSON.stringify(elements, null, '\t'));
	}

	displayFilteredElement = function( pageid ) {

		for( i in elements ) {
			var element = elements[i];
			var show_on_page = element.showOnPage;
			for( j in show_on_page ) {
				var page = show_on_page[j];
				if( page.id == pageid && page.display == true ) {
					var rendered = renderElementToHTML(element);
					addElement(rendered, false, 'render');
				}
			}
		}

		resetAllSelectedObject();
	}

	renderElementToHTML = function( element ) {
		var rendered = $('<'+element.tag+'>');
		rendered.attr('id', element.id);

		if( element.attribute['element-type'] == 'text' || element.attribute['element-type'] == 'link' ) {
			for( key in element.attribute['parent-style'] ) {
				var value = element.attribute['parent-style'][key];
				rendered.css(key, value);
			}
			delete element.attribute.style;
			for( key in element.attribute ) {
				var value = element.attribute[key];
				rendered.attr(key, value);
			}
			rendered.html(element.html);
		} else if( element.attribute['element-type'] == 'gallery' || element.attribute['element-type'] == 'article' ) {
			for( key in element.attribute['style'] ) {
				var value = element.attribute['style'][key];
				rendered.css(key, value);
			}
			delete element.attribute.style;
			for( key in element.attribute ) {
				var value = element.attribute[key];
				rendered.attr(key, value);
			}
			rendered.html(element.html);
		} else {
			for( key in element.attribute.style ) {
				var value = element.attribute.style[key];
				rendered.css(key, value);
			}
			delete element.attribute.style;
			for( key in element.attribute ) {
				var value = element.attribute[key];
				rendered.attr(key, value);
			}
		}
		return rendered;
	}

	findPageById = function( pages, search_id ) {
		for( var i in pages ) {
			var page = pages[i];
			if( page.id == search_id ){
				return page;
			}
		}
		return false;
	}

	findElementById = function( elements, search_id ) {
		for( var i in elements ) {
			var element = elements[i];
			if( element.id == search_id ){
				return element;
			}
		}
		return false;
	}

	setContainerHeaderFooter = function( page ) {
		var header = page.header;
		var footer = page.footer;

		for (key in header) {
		    if (header.hasOwnProperty(key)) {
		        editor_header.css(key, header[key]);
		    }
		}
		for (key in footer) {
		    if (footer.hasOwnProperty(key)) {
		        editor_footer.css(key, footer[key]);
		    }
		}

		// set page background
		resetEditorBg('bg-color');
		resetEditorBg('bg-image');
		var container_style = page.attribute.style;
		for (key in container_style) {
			if (container_style.hasOwnProperty(key)) {
		    	editor_workspace.css(key, container_style[key]);
		    }
		}
	}

	setRulerVisible = function( status ) {
		if( status ) {
			$('.ruler.vertical.left').css('border-right', '1px dotted gray');
			$('.ruler.vertical.right').css('border-left', '1px dotted gray');
			editor_header.css('border-bottom', '1px dotted gray');
			editor_footer.css('border-top', '1px dotted gray');
		} else {
			$('.ruler.vertical.left').css('border-right', 'transparent');
			$('.ruler.vertical.right').css('border-left', 'transparent');
			editor_header.css('border-bottom', 'transparent');
			editor_footer.css('border-top', 'transparent');
		}
	}

	validRepositionElementLeft = function( grabbed_object, direction ) {
		
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

	repositionElement = function( grabbed_object, e ) {

		var coord_x = e.pageX;
		var coord_y = e.pageY;
		var position_difference = 0;

		// MOVING UP
		if (coord_y < oldy) {

			if( validRepositionElementLeft(grabbed_object, 'top') ) {
				position_difference = Math.abs(coord_y - oldy);
				
				if( $('.dragged-along').length > 1 ) {
					$('.dragged-along').each(function(){
						var self = $(this);
						var holder = self.closest('.draggable-holder');
						var top = parseFloat(holder.css('top')) - position_difference + 'px';
						
						holder.css('top', top);
						self.css('top', top);
					});
				} else {
					var top = parseFloat(grabbed_object.css('top')) - position_difference + 'px';
					grabbed_object.css('top', top);
					grabbed_object.find('.draggable-element').css('top', top);
				}
			}
		}
		
		// MOVING DOWN
		if (coord_y > oldy) {

			if( validRepositionElementLeft(grabbed_object, 'bottom') ) {
				position_difference = Math.abs(coord_y - oldy);

				if( $('.dragged-along').length > 1 ) {
					$('.dragged-along').each(function(){
						var self = $(this);
						var holder = self.closest('.draggable-holder');
						var top = parseFloat(holder.css('top')) + position_difference + 'px';
						
						holder.css('top', top);
						self.css('top', top);
					});
				} else {
					var top = parseFloat(grabbed_object.css('top')) + position_difference + 'px';
					grabbed_object.css('top', top);
					grabbed_object.find('.draggable-element').css('top', top);
				}
			}
		}

		// MOVING RIGHT
		if (coord_x > oldx) {
			
			if( validRepositionElementLeft(grabbed_object, 'right') ) {
				position_difference = Math.abs(coord_x - oldx);

				if( $('.dragged-along').length > 1 ) {
					$('.dragged-along').each(function(){
						var self = $(this);
						var holder = self.closest('.draggable-holder');
						var left = parseFloat(holder.css('left')) + position_difference + 'px';
						
						holder.css('left', left);
						self.css('left', left);
					});
				} else {
					var left = parseFloat(grabbed_object.css('left')) + position_difference + 'px';
					grabbed_object.css('left', left);
					grabbed_object.find('.draggable-element').css('left', left);
				}
			}
		}
		
		// MOVING LEFT
		if (coord_x < oldx) {
			
			if(	validRepositionElementLeft(grabbed_object, 'left') ) {
				position_difference = Math.abs(coord_x - oldx);

				if( $('.dragged-along').length > 1 ) {
					$('.dragged-along').each(function(){
						var self = $(this);
						var holder = self.closest('.draggable-holder');
						var left = parseFloat(holder.css('left')) - position_difference + 'px';
						
						holder.css('left', left);
						self.css('left', left);
					});
				} else {
					var left = parseFloat(grabbed_object.css('left')) - position_difference + 'px';
					grabbed_object.css('left', left);
					grabbed_object.find('.draggable-element').css('left', left);
				}
			}
		}
	}

	removeDraggedAlong = function(){
		$('.draggable-element').removeClass('dragged-along');
	}

	addElement = function( element, e, position ) {

		position = (typeof position === "undefined" || position === null) ? 'random' : position; 

		var clone_element = element.clone().addClass('no-mg').addClass('grab');
		var id = 1;
		var element_type = clone_element.attr('element-type');

		if( position == 'random' ) {
			var random_coordinate = randomPosition(e);
			var coord_x = random_coordinate.x;
			var coord_y = random_coordinate.y;
		} else if( position == 'specific' ) {
			var coord_x = e.pageX;
			var coord_y = e.pageY;
		} else if ( position == 'render' ) {
			var coord_x = parseInt(element.css('left'));
			var coord_y = parseInt(element.css('top'));
		}
		

		if( element_type == 'text' || element_type == 'link' ) {

			var clone_element_class = clone_element.attr('class');
			var clone_element_style = ( typeof clone_element.attr('parent-style') != 'undefined' ) ? clone_element.attr('parent-style') : 'word-wrap: break-word;';
			var wrapper = $('<div style="'+clone_element_style+'" element-type="'+element_type+'" class="'+clone_element_class+'"></div>');

			clone_element.removeAttr('parent-style');
			clone_element.removeAttr('element-type');
			clone_element.removeClass('draggable-element');

			// SET ELEMENT UNCLICKABLE BUT STILL APPEAR
			clone_element.css('pointer-events','none');

			// SET CHILD ELEMENTS TO HAVE CLASS
			clone_element.children().addClass('no-mg').addClass('grab');
			clone_element.children().css('pointer-events','none');

			if( typeof clone_element.attr('id') != 'undefined'  ) {
				wrapper.attr('id', clone_element.attr('id'));
				clone_element.removeAttr('id');
			}

			// GET THE COORDINATES SINCE THE STYLE IS NOT SET BEFORE
			if( position == 'render' ) {
				coord_x = parseInt(wrapper.css('left'));
				coord_y = parseInt(wrapper.css('top'));
				var display = ( typeof clone_element.attr('showall') === "undefined" || clone_element.attr('showall') === null ) ? false : clone_element.attr('showall');
				display = ( display == 'true' ) ? true : false;
				wrapper.attr('showall', display);
			}

			if( position == 'specific' ) {
				wrapper.append(clone_element);
			} else {
				wrapper.append(clone_element.html());
			}
			
			clone_element = wrapper;
		}

		// Intentionally check id of the children since bugs of text element that wrapped by div
		if( typeof clone_element.attr('id') == "undefined" && typeof clone_element.children().attr('id') == "undefined" ) {
			// Set object counter, so we could set every element to have an id.
			var id = setObjectCounter(element_type);
			clone_element.attr('id', id);
		}

		clone_element.css({
			'left' : coord_x + 'px',
			'top' : coord_y + 'px',
			'position' : 'static',
		});
		clone_element = wrapWithHolder(clone_element, coord_x, coord_y, element_type);
		editor.append(clone_element);

		// TEXT ELEMENT WIDTH CANNOT BE READ UNTIL ELEMENT HAS BEEN APPENDED
		if( ( element_type == 'text' || element_type == 'link' ) && position != 'render' ) {
			var clone_element_width = clone_element.width() + 20;
			clone_element.find('.draggable-element').css('width', clone_element_width + 'px');
		} else if( element_type == 'article' && position != 'render' ){
			var clone_element_width = clone_element.width() + 100;
			clone_element.find('.draggable-element').css('width', clone_element_width + 'px');
		}

		last_selected_object = clone_element;

		/* SAVE STATE EVERY TIME ELEMENT IS ADDED INTO WORKSPACE */
		/* IF NOT RENDER, SAVE BECAUSE IT WILL CAUSE LOOPING FOREVER */
		if( position != 'render' ) {
			// saveState();
			// var activePageId = $('#btnOpenBoxPage span').attr('active-page-id');
			// var page = findPageById(pages, activePageId);
			// setContainerHeaderFooter(page);
			// displayFilteredElement(activePageId);

			// $('#'+id).closest('.draggable-holder').addClass('active');
			// $('#'+id).closest('.draggable-holder').find('.edge').addClass('active');
			// setMenuEditElement($('#'+id).closest('.draggable-holder'));
		}
	}

	resetHolderSize = function( self ) {
		self.css({
			'width' : 'auto',
			'height' : 'auto',
			'right' : 'auto',
			'bottom' : 'auto'
		});
	}

	wrapWithHolder = function( element, x, y, element_type ) { 

		var padding = (element_type == 'container') ? '0' : '5px';
		var wrapper = $('<div class="draggable-holder active" style="padding: '+padding+' ;position:absolute; left: ' + x + 'px; top: ' + y + 'px;"> ' + 
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

	randomPosition = function(e){
		var x = Math.floor(Math.random() * 440) + 360;
		// var y = Math.floor(Math.random() * 340) + 160;
		var y = e.pageY;
		return {
			'x' : x,
			'y' : y
		}
	}

	existElement = function( id ) {
		return $('#'+id).length;
	}

	inArray = function( validated_class, class_list ) {
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

	resetAllSelectedObject = function(){
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

	$('#btnApplyBackgroundToOtherPages').click(function(e){
		e.preventDefault();

		var container_style = editor_workspace.attr('style');
		var arr_container_style = container_style.split(';');
		arr_container_style.pop();
		var pagestyle = {};
		for( key in arr_container_style ) {
			var style = arr_container_style[key];
			var arr_style = style.split(/:(.+)/);
			var properties = arr_style[0].trim().toString();
			var value = arr_style[1].trim().toString();
			pagestyle[properties] = value;
		}

		for( key in pages ) {
			var page = pages[key];
			page.attribute.style = pagestyle;
		}
	});

	$('.left-content .content .category-content .category-view .items-section .bg-items').click(function(){
		var self = $(this);
		var color = self.css('background-color');
		setEditorBgColor(color);
	});
	/* END Upload Image + Set Background Image */

	resizeEditor = function( point, e ) {

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

	resizeSingleObject = function( point, e, grabbed_object, object ){

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

	init(editor_json);
});