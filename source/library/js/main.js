function loadContent(url){
	history.replaceState({}, null, BASE_URL+url);
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
					console.log(data);
				}
			})
		})
		$("#submitRegister",loginModal).click(function(){
			var passingData = {
					"email":$("#txtRegisterEmail",loginModal).val(),
					"password":$("#txtRegisterPassword",loginModal).val(),
					"confirmPass":$("#txtRegisterConfirmPassword",loginModal).val()
				};
			$.ajax({
				url:"http://localhost:8080/oversign/service/user/register",
				data:JSON.stringify(passingData),
				accept: 'application/json',
				contentType:"application/json",
				type:"POST",
				crossDomain:true,
				success:function(data){
					console.log(data);
				}
			})
		})
	})
	
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
	$.fn.pagination = function(param){
		var data = param.data;
		var parent = this;
		var item = $(".templateItem",this);
		var colnum = Math.floor($(parent).width()/$(item).width());
		var pagenum = Math.ceil(data.length/(colnum*4));
		$(data).each(function(i){
			var newItem = $(item).clone().removeClass("templateItem").show().css({
				"background-image":"url('"+BASE_URL+"source/images/glass.png')",
				"background-size":"100% 100%",
				"margin":"auto"});
			for(var key in this){
				$("."+key,newItem).text(this[key]);
			}
			$(parent).append(newItem);
		})
		var paginationNumber = $("<div style='height:50px'></div>");
		var buttonNext = $("<div></div>").css({
			"display":"inline-block",
			"height":"50%",
			"width":"5%",
			"background-image":"url('"+BASE_URL+"source/images/arrowNext.png')",
			"background-size":"100% 100%",
			"cursor":"pointer"
		}).hover(function(){
			$(this).css("background-image","url('"+BASE_URL+"source/images/arrowNextHover.png')");
		},function(){
			$(this).css("background-image","url('"+BASE_URL+"source/images/arrowNext.png')");
		});
		var buttonPrev = $("<div></div>").css({
			"display":"inline-block",
			"height":"50%",
			"width":"5%",
			"background-image":"url('"+BASE_URL+"source/images/arrowPrev.png')",
			"background-size":"100% 100%",
			"cursor":"pointer"
		}).hover(function(){
			$(this).css("background-image","url('"+BASE_URL+"source/images/arrowPrevHover.png')");
		},function(){
			$(this).css("background-image","url('"+BASE_URL+"source/images/arrowPrev.png')");
		});
		var buttonLast = $("<div></div>").css({
			"display":"inline-block",
			"height":"50%",
			"width":"5%",
			"background-image":"url('"+BASE_URL+"source/images/arrowLast.png')",
			"background-size":"100% 100%",
			"cursor":"pointer"
		}).hover(function(){
			$(this).css("background-image","url('"+BASE_URL+"source/images/arrowLastHover.png')");
		},function(){
			$(this).css("background-image","url('"+BASE_URL+"source/images/arrowLast.png')");
		});
		var buttonFirst = $("<div></div>").css({
			"display":"inline-block",
			"height":"50%",
			"width":"5%",
			"background-image":"url('"+BASE_URL+"source/images/arrowFirst.png')",
			"background-size":"100% 100%",
			"cursor":"pointer"
		}).hover(function(){
			$(this).css("background-image","url('"+BASE_URL+"source/images/arrowFirstHover.png')");
		},function(){
			$(this).css("background-image","url('"+BASE_URL+"source/images/arrowFirst.png')");
		});
		$(paginationNumber).append(buttonFirst);
		$(paginationNumber).append(buttonPrev);
		for(var i=1;i<=15;i++){
			var link = $("<span style='float:left;margin:3px 15px;color:#008888'>"+i+"</span>");
			var pageNum = $("<div></div>").css({
				"display":"inline-block",
				"height":"50%",
				"width":"5%",
				"background-image":"url('"+BASE_URL+"source/images/buttonBg.png')",
				"background-size":"100% 100%",
				"cursor":"pointer",
				"text-align":"center"
			}).append(link).hover(function(){
				$(this).css("background-image","url('"+BASE_URL+"source/images/buttonBgHover.png')");
				$("span",this).css("color","#000000");
			},function(){
				$(this).css("background-image","url('"+BASE_URL+"source/images/buttonBg.png')");
				$("span",this).css("color","#008888");
			});;
			$(paginationNumber).append(pageNum);
		}
		var pageNum = $("<div></div>").css({
			"display":"inline-block",
			"height":"50%",
			"width":"5%",
			"background-image":"url('"+BASE_URL+"source/images/buttonBg.png')",
			"background-size":"100% 100%"
		}).append($("<img style='width:50%;height100%;float:left;margin:17px 12px' src='"+BASE_URL+"source/images/restPage.png'>"));
		$(paginationNumber).append(pageNum);
		$(paginationNumber).append(buttonNext);
		$(paginationNumber).append(buttonLast);
		$(parent).next().after(paginationNumber);
	}
});