$(document).ready(function() {

	$('body').on('click', '.menu-edit-event', function(e){
		e.preventDefault();
		var self = $(this).closest('div.draggable-holder');
		setMenuEditEvent( self );
		initElementEvent( self );
	});

	$('body').on('change', '#ddlLinkTo', function(){
		
		var self = $(this);
		var selected_value = self.find('option:selected').val();
		if( selected_value == 'link-page' ) {
			$('.section-link-page').removeClass('hide').show();
			$('.section-link-url').addClass('hide').hide();
		} else if( selected_value == 'link-url' ) {
			$('.section-link-page').addClass('hide').hide();
			$('.section-link-url').removeClass('hide').show();
		}
	});

	$('body').on('click', '#btnApplyEventLink', function(){

		var holder = $(this).closest('.draggable-holder');
		var selected_value = $('#ddlLinkTo').find('option:selected').val();
		var element_id = holder.find('.draggable-element').attr('id');
		var obj = {
			"triggerElementId" : element_id,
			"triggerOn": "mouse-click",
			"triggerEventCategory": "Mouse",
			"affectingElementID": "",
			"affectingElementType": "",
			"actionCategory": "Navigation",
			"additional_params": {
				// "pageid": "pagebox0"
			},
			"_triggerOn": "click",
			"_action": "click"
		};

		if( selected_value == 'link-page' ) {
			obj.action = 'navigation-linkpage';
			obj.additional_params.pageid = $('#ddlListPage').find('option:selected').val();
		} else if( selected_value == 'link-url' ) {
			obj.action = 'navigation-linkurl';
			obj.additional_params.url = $('#txtLinkURL').val();
		}

		for( key in events ) {
			var ev = events[key];
			if( ev.triggerElementId == element_id && ev.actionCategory == 'Navigation' ) {
				events.splice(key, 1);
			}
		}
		events.push(obj);

		hideLeftContent();
		resetAllSelectedObject();
		hideBoxTools();
		hideBoxPage();
		setMenuEditElement( false, 'destroy');
		setMenuEditProperties( false, 'destroy');
	});
});

var setMenuEditEvent = function( element, status ) {

	status = (typeof status === "undefined" || status === null) ? 'show' : status; 
	$('.box-edit-properties').remove();
	$('.box-edit-event').remove();

	if( status == 'show' && element != false ) {

		// var element_type = element.find('.draggable-element').attr('element-type');
		// INTENTIONALLY HARC CODED FOR ANY ELEMENT EVENTS TO LINK PAGE
		
		var element_type = 'link';

		if( existElement('event-'+element_type) ) {
			var menu_wrapper = $('<div class="box-edit-event">'+
				'<div class="header">'+
					'<label class="title">Events</label>'+
					'<a href="#" class="prop-close-button"></a>'+
				'</div>'+
				'<div class="container">'+
					'<div class="row small-pd-right"></div>'+
				'</div>'+
			'</div>');
			
			var event_content = $('#event-'+element_type).clone().show();
			menu_wrapper.find('.container > .row').append(event_content);
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

var initElementEvent = function( holder ) {

	var element_id = holder.find('.draggable-element').attr('id');
	$('.section-link-page').removeClass('hide').show();
	$('.section-link-url').addClass('hide').hide();

	// var option = $('<option value="default">- Choose page -</option>');
	// $('#ddlListPage').empty().append(option);

	for( key in pages ) {
		var page = pages[key];
		var option = $('<option></option>').text(page.name).val(page.id);
		$('#ddlListPage').append(option);
	}

	for( key in events ) {
		var ev = events[key];
		if( ev.triggerElementId == element_id && ev.actionCategory == 'Navigation' ) {
			if( ev.additional_params.hasOwnProperty('pageid') ) {
				var option_page_id = ev.additional_params.pageid;
				$('#ddlListPage').val(option_page_id);
			} else {
				$('.section-link-page').addClass('hide').hide();
				$('.section-link-url').removeClass('hide').show();

				var option_url = ev.additional_params.url;
				$('#txtLinkURL').val(option_url);
			}
		}
	}
}