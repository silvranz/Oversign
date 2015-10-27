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

var editor_json = {
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
		},
	],
	// 'elements' : [
	// 	{
	// 		"attribute": {
	// 			"type":"button",
	// 			"class":"button button-primary draggable-element no-mg grab",
	// 			"value":"Button",
	// 			"element-type":"button",
	// 			"style": {
	// 				"left":"773px",
	// 				"top":"202px",
	// 				"position":"static"
	// 			}
	// 		},
	// 		"id":"button1",
	// 		"tag":"input",
	// 		'showOnAllPages' : false,
	// 		"showOnPage": [
	// 			{
	// 				"id":"page1",
	// 				"display":true
	// 			},
	// 			{
	// 				"id":"page2",
	// 				"display":false
	// 			}
	// 		]
	// 	}
	// ],
	'elements' : [],
	'events' : []
};

var pages = editor_json.pages;
var elements = editor_json.elements;
var events = editor_json.events;
$(document).ready(function(){			
	init(editor_json);

	$('#btnPublish').click(function(e){
		e.preventDefault();
		saveState();
		var json = {
			'pages' : pages,
			'elements' : elements,
		}
		console.log(JSON.stringify(json, null, '\t'));
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

		if( element_type == 'text' ) {
			renderCkeditorToElement( id, self.width(), self.height() );
		}
	});

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
})