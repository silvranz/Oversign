$(document).ready(function(){	
	$('body').on('click', '.menu-edit-events', function(e){
		e.preventDefault();
		var self = $(this).closest('div.draggable-holder');
		setMenuEditEvents( self );
	});
})
var setMenuEditEvents = function( element, status ) {

	status = (typeof status === "undefined" || status === null) ? 'show' : status;
	$('.box-edit-events').remove();

	if( status == 'show' && element != false ) {
		var elementId = element.find('.draggable-element').attr('id');
		var menu_wrapper = $('<div element="'+elementId+'" class="box-edit-events">'+
			'<div class="header">'+
				'<label class="title">Events</label>'+
				
					'<a href="#" class="event-close-button"></a>'+
			'</div>'+
			'<div class="container">'+
				'<div class="row small-pd-right">'+
					'<div id="existingAction"></div>'+
				'</div>'+
			'</div>'+
			'<div class="action" style="display:none">'+
				'<div class="row small-pd-right category-view">'+
					'<div class="title-section">'+
						'<div class="title">Available Action</div>'+
					'</div>'+
					'<select id="actionList"><option value="click">click</option></select>'+
					'<button class="button pickActionButton button-primary u-full-width md-trigger"> Pick Action </button>'+
				'</div>'+
			'</div>'+
			'<div class="events" style="display:none">'+
				'<div class="row small-pd-right">'+
					'<div id="addedEvent"></div>'+
					'<button class="button addEventButton button-primary u-full-width md-trigger"> + </button>'+
					'<button class="button defineEventsButton button-primary u-full-width md-trigger"> Define Events </button>'+
				'</div>'+
			'</div>'+
			'<div class="newEvent" style="display:none">'+
				'<div class="row small-pd-right">'+
					'<select id="objectList"><option value="">No Object</option></select>'+
					'<select id="eventList"><option value="link">Link Page</option></select>'+
					'<div id="eventProp"><select id="pageList"></select></div>'+
					'<button class="button addNewEvent button-primary u-full-width md-trigger"> Add Events </button>'+
				'</div>'+
			'</div>'+
		'</div>');
			
		var currentEvents = initElementEvents(menu_wrapper,elementId);
		var newEventButton = $("<button class='button button-primary u-full-width md-trigger'> Add New Event </button>");
		for(var i=0;i<pages.length;i++){
			$("#pageList",menu_wrapper).append("<option value='"+pages[i].id+"'>"+pages[i].name+"</option>")
		}
		$(newEventButton).click(function(e){
			var parent = $(this).closest(".box-edit-events");
			$(".container",parent).slideToggle();
			$(".action",parent).slideToggle();
		})
		$(".pickActionButton",menu_wrapper).click(function(e){
			var parent = $(this).closest(".box-edit-events");
			$(".action",parent).slideToggle();
			$(".events",parent).slideToggle();
			$(parent).attr("pickAction",$("#actionList",parent).val());
		})
		$(".defineEventsButton",menu_wrapper).click(function(e){
			var parent = $(this).closest(".box-edit-events");
			$(".events",parent).slideToggle();
			$(".container",parent).slideToggle();
			var currentPageId = $("#btnOpenBoxPage>span").attr("active-page-id");
			var currentElementId = $(parent).attr("element");
			var newAction = $(parent).attr("pickAction");
			for(var i=0;i<pages.length;i++){
				if(pages[i].id == currentPageId){
					for(var j=0;j<pages[i].events;j++){
						if(pages[i].events[j].id == currentElementId){
							for(var k=0;k<pages[i].event[j].actions.length;i++){
								if(pages[i].event[j].actions[k].name == newAction){
									pages[i].event[j].actions[k].event.push({
										object:$(parent).attr("object"),
										name:$(parent).attr("event"),
										values:[$(parent).attr("evenValue")]
									});
								}
							}
							pages[i].event[j].actions.push({
								name:newAction,
								event:[{
									object:$(parent).attr("object"),
									name:$(parent).attr("event"),
									values:[$(parent).attr("evenValue")]
								}]
							});
						}
					}
					pages[i].events.push({
						id:currentElementId,
						actions:[{
							name:newAction,
							event:[{
								object:$(parent).attr("object"),
								name:$(parent).attr("event"),
								values:[$(parent).attr("evenValue")]
							}]
						}]
					});
				}
			}
		})
		$(".addEventButton",menu_wrapper).click(function(e){
			var parent = $(this).closest(".box-edit-events");
			$(".events",parent).slideToggle();
			$(".newEvent",parent).slideToggle();
		})
		$(".addNewEvent",menu_wrapper).click(function(e){
			var parent = $(this).closest(".box-edit-events");
			$(".events",parent).slideToggle();
			$(".newEvent",parent).slideToggle();
			$(parent).attr("object",$("#objectList",parent).val());
			$(parent).attr("event",$("#eventList",parent).val());
			$(parent).attr("eventValue",$("#pageList",parent).val());
		})
		menu_wrapper.find('.container > .row').append(currentEvents);
		menu_wrapper.find('.container > .row').append(newEventButton);
		menu_wrapper.css('left', element.width() + 100 + 'px');
		menu_wrapper.css('top', element.height() - 150 + 'px');
		element.append(menu_wrapper);		
	}
}

var initElementEvents = function( menu_wrapper,id ) {
	var currentPage = $("#btnOpenBoxPage>span").attr("active-page-id");
	for(var i=0;i<pages.length;i++){
		if(pages[i].id = currentPage){
			for(var j=0;j<pages[i].events.length;j++){
				if(pages[i].events[j].id == id){
					for(var k=0;k<pages[i].events[j].actions.length;k++){
						$("#existingAction",menu_wrapper).append($("<button class='button'>"+pages[i].events[j].actions[k].name+"</button>"));			
						$("#existingAction",menu_wrapper).append($("<button class='button'>x</button>"));				
					}
				}
			}
		}
	}
}