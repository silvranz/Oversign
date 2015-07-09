function loadContent(url){
	history.pushState({}, null, url);
	$(".blog-nav-item.active").removeClass("active");
	$("a[href='"+url+"']").addClass("active");
	console.log(url);
	$.ajax({
		type:"POST",
		url:BASE_URL+"service/",
		data:{url:url},
		beforeSend:function(){
			$("#content").html($(".blocker").clone().show());
		},
		success:function(data){
			$("#content").html(data);
		}
	})
}
function defaultValue(variable,value){
	return typeof variable !== "undefined"?  variable:value;
}
function defaultPopupAnimation(){
	return {};
}
$(document).ready(function(){
	var onloadTarget = window.location.href.replace(BASE_URL,"");
	onloadTarget = onloadTarget==""?"home":onloadTarget;
	$("*").click(function(e){
		if($(this).hasClass("blog-nav-item")){
			e.preventDefault();
			loadContent($(this).attr("href"));
		}
	});
	loadContent(onloadTarget);
	$.fn.customPopup = function(mode,animation,time){
		mode = defaultValue(mode,"fullscreen");
		animation = defaultValue(animation,defaultPopupAnimation());
		time = defaultValue(time,500);
		switch(mode){
			case "fullscreen":
				
				break;
			case "left":
				break;
			case "right":
				break;
			case "top":
				break;
			case "bottom":
				break;
		}
		return this;
	}
});