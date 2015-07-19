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
function testConnectionDB(){	
	$.ajax({
		url:"http://localhost:8080/oversign/service/engine/get",
		type:"GET",
		crossDomain:true,
		success:function(data){
			console.log(data);
		}
	})
}
function closeBlocker(){
	$("div[data-class='blocker']").remove();
}
function defaultValue(variable,value){
	return typeof variable !== "undefined"?  variable:value;
}
function defaultPopupAnimation(){
	return {};
}
function fullScreenPopup(content){
	var blocker = $("<div data-class='blocker'>").css({
		"position":"fixed",
		"top":0,
		"left":0,
		"width":screen.width,
		"height":screen.height,
		"background-color":"rgba(0,0,0,0.5)",
		"padding":"5%"
	});
	/*var centerDiv = $("<div>").css({
		"width":screen.width/2,
		"height":screen.height/2,
		"position":"fixed",
		"top":"50%",
		"left":"50%",
		"margin-top":"-15%",
		"margin-left":"-25%",
		"border":"1px solid black",
		"background-color":"white"
	}).html(content);
	$(blocker).html(centerDiv);*/
	$(blocker).html(content);
	$("body").append(blocker);
		console.log(content);
}
$(document).ready(function(){
	$("#btnRegisterNewMember").click(function(){
		$(".loginForm").fadeOut(function(){
			$(".registerForm").fadeIn();
		});
	})
	$("#btnBackToLoginReg").click(function(){
		$(".registerForm").fadeOut(function(){
			$(".loginForm").fadeIn();
		});
	})
	$("#btnForgotPassword").click(function(){
		$(".loginForm").fadeOut(function(){
			$(".forgotPasswordForm").fadeIn();
			$("#modalLabel").text("Forgot Password");
			$("#modalLabelContent").text("We will send confirmation and new password to your email.");
		});
	})
	$("#btnBackToLoginFor").click(function(){
		$(".forgotPasswordForm").fadeOut(function(){
			$(".loginForm").fadeIn();
			$("#modalLabel").text("Login | Register");
			$("#modalLabelContent").text("Input email and password to start managing your website.");
		});
	})

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
				fullScreenPopup(this);
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
	$(".login-item").click(function(){
		$("#loginModal").customPopup();
	})
});