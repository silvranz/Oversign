function loadContent(url){
	history.pushState({}, null, url);
	$(".nav-item.active").removeClass("active");
	$("a[href='"+url+"']").addClass("active");
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
		"padding":"5%",
		"z-index":"2000"
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
	$(content).click(function(e){
		e.stopPropagation();
	})
	$(".close",content).click(function(){
		closeBlocker();
	})
	$(blocker).html(content).click(function(){
		closeBlocker();
	});
	$("body").append(blocker);
}
$(document).ready(function(){
	var onloadTarget = window.location.href.replace(BASE_URL,"");
	onloadTarget = onloadTarget==""?"home":onloadTarget;
	$("*").click(function(e){
		if($(this).hasClass("nav-item")){
			e.preventDefault();
			loadContent($(this).attr("href"));
		}
	});
	loadContent(onloadTarget);
	$.fn.customPopup = function(mode,animation,time){
		mode = defaultValue(mode,"fullscreen");
		animation = defaultValue(animation,defaultPopupAnimation());
		time = defaultValue(time,500);
		var content = this.clone();
		switch(mode){
			case "fullscreen":
				fullScreenPopup(content);
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
		return content;
	}
	$(".login-item").click(function(){
		var loginModal = $("#loginModal");
		loginModal = $(loginModal).customPopup();
		$("#btnRegisterNewMember",loginModal).click(function(){
			var parent = $(this).closest("#loginModal");
			$(".loginForm",parent).fadeOut(function(){
				$(".registerForm",parent).fadeIn();
			});
		})
		$("#btnBackToLoginReg",loginModal).click(function(){
			var parent = $(this).closest("#loginModal");
			$(".registerForm",parent).fadeOut(function(){
				$(".loginForm",parent).fadeIn();
			});
		})
		$("#btnForgotPassword",loginModal).click(function(){
			var parent = $(this).closest("#loginModal");
			$(".loginForm",loginModal).fadeOut(function(){
				$(".forgotPasswordForm",parent).fadeIn();
				$("#modalLabel",parent).text("Forgot Password");
				$("#modalLabelContent",parent).text("We will send confirmation and new password to your email.");
			});
		})
		$("#btnBackToLoginFor",loginModal).click(function(){
			var parent = $(this).closest("#loginModal");
			$(".forgotPasswordForm",parent).fadeOut(function(){
				$(".loginForm",parent).fadeIn();
				$("#modalLabel",parent).text("Login | Register");
				$("#modalLabelContent",parent).text("Input email and password to start managing your website.");
			});
		})
		$("#loginButton",loginModal).click(function(){
			var passingData = {
				"email":$("#txtLoginEmail",loginModal).val(),
				"password":$("#txtLoginPassword",loginModal).val(),
			};
			$.ajax({
				url:"http://localhost:8080/oversign/service/user/login",
				data:JSON.stringify(passingData),
				accept: 'application/json',
				contentType:"application/json",
				type:"POST",
				crossDomain:true,
				success:function(data){
					//harusnya proses response tapi belum bisa balikin response
					console.log(data);
				}
			})
		})
		$("#submitRegister",loginModal).click(function(){
			//attribut json-nya samain dengan objek parameter
			//contoh di register gw pake RegisterParam buat parameter di handlernya
			//RegisterParam punya email,password,confirmPass
			//double quotes("") buat nama parameter(email,password,confirmPass) usahain pake
			//case kemaren ga pake "" ga mau dibaca, yang ini belom coba sih
			var passingData = {
					"email":$("#txtRegisterEmail",loginModal).val(),
					"password":$("#txtRegisterPassword",loginModal).val(),
					"confirmPass":$("#txtRegisterConfirmPassword",loginModal).val()
				};
			//urlnya sesuaiin ama host+pathnya
			//host gw localhost:8080 + path buat register user/register
			$.ajax({
				url:"http://localhost:8080/oversign/service/user/register",
				data:JSON.stringify(passingData),
				accept: 'application/json',
				contentType:"application/json",
				type:"POST",
				crossDomain:true,
				success:function(data){
					//harusnya proses response tapi belum bisa balikin response
					console.log(data);
				}
			})
		})
	})
});