function loadContent( url, windowOption, windowTitle, windowWidth, windowHeight ) {
	windowOption = (typeof windowOption === "undefined" || windowOption === null) ? 0 : windowOption;
	windowTitle = (typeof windowTitle === "undefined" || windowTitle === null) ? "" : windowTitle;
	windowWidth = (typeof windowWidth === "undefined" || windowWidth === null) ? screen.width : windowWidth;
	windowHeight = (typeof windowHeight === "undefined" || windowHeight === null) ? screen.height : windowHeight;


	if( url == "#" ){
		return;
	}

	var requestedPage = url.split(BASE_URL)[1];
	var windowHandler = "";
	
	if(windowOption == 0) {
		history.replaceState({}, null,url);
	} else {
		windowHandler = window.open("",windowTitle,"scrollbars=1,width="+windowWidth+", height="+windowHeight);
	}

	$.ajax({
		type:"POST",
		url:BASE_URL+"service/",
		data:{url:requestedPage},
		windowOption:windowOption,
		windowHandler:windowHandler,
		beforeSend:function(){
			if(this.windowOption == 0)
				$("#content").html($(".blocker").clone().show());
		},
		success:function(data){
			if(this.windowOption == 0){
				$("#content").html(data);
			}
			else if(this.windowOption == 1){
				this.windowHandler.document.documentElement.innerHTML = "";
				this.windowHandler.document.write(data);
			}
		}
	})

}
function testConnectionDB(){	
	$.ajax({
		url:BASE_URL+"service/engine/get",
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
	$("a").click(function(e){
		e.preventDefault();
		loadContent($(this).attr("href"));
	});
	loadContent(window.location.href);
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
				url:BASE_URL+"/service/user/login",
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
				url:BASE_URL+"/service/user/register",
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
	$(".clearfix #widgetButton").click(function(e){
		e.preventDefault();
		loadContent(BASE_URL+"/widget/workshop",1,"Widget workspace");
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
	$.fn.pagination = function( param ) {
		// if(typeof param.data != "undefined"){
		// 	param.data = $.extend({},$.fn.pagination.defaults.data,param.data);
		// }
		// var pagination = $.extend({},$.fn.pagination.defaults,param);
		// pagination.parent = this;
		// pagination.item = $(this).find("div.templateItem");
		// $.extend(this[0],$.fn.pagination.methods);
		// this[0].settingPage = pagination;
		// this[0].loadData();
	};
	$.fn.pagination.defaults = {
		maxRow:3,
		maxCol:3,
		data:{
			"limit":30,
			"sort":0,
			"offset":0
		},
		accept: 'application/json',
		contentType:"application/json",
		type:"POST",
		crossDomain:true,
		itemFunction:function(item,parent,index){},
		success:function(data){
			$(this.parent).empty();
			var pagination = this;
			if(typeof pagination.sortText != "undefined" && typeof pagination.sortText[0] != "undefined")
			{
				var listSorting = document.createElement("div");
				listSorting.style.width = "100%";
				var listSortText = pagination.sortText;
				var sortLength = listSortText.length;
				for(var i=0;i<sortLength;i++)
				{
					var sortLink = document.createElement("a");
					sortLink.href = "#";
					sortLink.sortIndex = i;
					sortLink.innerHTML = listSortText[i];
					sortLink.parentContainer = pagination.parent[0];
					sortLink.onclick = function(event){
						event.preventDefault();
						this.parentContainer.settingPage.data.sort = this.sortIndex;
						this.parentContainer.loadData();
					};
					listSorting.appendChild(sortLink);
				}
				$(pagination.parent)[0].appendChild(listSorting);				
			}
			var itemTemplate = pagination.item;
			pagination.itemWidth = Math.floor(pagination.parent.width()/pagination.maxCol);
			var listContent = document.createDocumentFragment();
			$(data).each(function(i){
				var newItem = $(itemTemplate).clone().show().css("display","inline-block").css("width",pagination.itemWidth+"px");
				for(var key in this){
					$("."+key,newItem).text(this[key]);
				}
				pagination.itemFunction(this,newItem,i);
				listContent.appendChild($(newItem)[0]);
			})
			var listPage = document.createElement("div");
			listPage.style.width = "100%";
			listPage.style["text-align"] = "right";
			var itemCount = data.length;
			var totalPage = Math.ceil(itemCount/(pagination.maxCol*pagination.maxRow));
			for(var i=1;i<=totalPage;i++)
			{
				var pageLink = document.createElement("a");
				pageLink.href = i;
				pageLink.innerHTML = i;
				pageLink.pageIndex = i;
				pageLink.parentContainer = pagination.parent[0];
				pageLink.onclick = function(e){
					e.preventDefault();
					this.parentContainer.settingPage.data.offset = this.parentContainer.settingPage.data.limit * (this.pageIndex-1);
					this.parentContainer.loadData();
				}
				listPage.appendChild(pageLink);
			}
			$(pagination.parent)[0].appendChild(listContent);
			$(pagination.parent)[0].appendChild(listPage);
		}
	};
	$.fn.pagination.methods = {
		updatePage:function(newSetting){
			$(this).empty();
			$.extend(this.settingPage,newSetting);
			this.loadData();
		},
		loadData:function(){
			var currentSetting = $.extend({},this.settingPage);
			$.extend(currentSetting.data,currentSetting.filter);
			currentSetting.data = JSON.stringify(currentSetting.data);
			$.ajax(currentSetting);
		}
	}
});