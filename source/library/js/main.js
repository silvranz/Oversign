function loadContent(url,windowOption=0,windowTitle="",windowWidth = screen.width,windowHeight = screen.height){
	if(url=="#")return;
	var requestedPage = url.split("oversign/")[1];
	var windowHandler = "";
	if(windowOption == 0)
		history.replaceState({}, null,url);
	else
	{
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
	/*$(".clearfix.menuBar #widgetButton").click(function(e){
		e.preventDefault();
		loadContent("http://localhost/oversign/widget/workshop",1,"Widget workspace");
	})*/
	$(".clearfix.menuBar #widgetButton").click(function(e){
		e.preventDefault();
		window.a = {"pages":[{"id":"page1","name":"Page 1","header":{"background_color":"transparent","height":"150px","width":"100%","border_bottom_width":"1px","border_bottom_style":"dotted","border_bottom_color":"gray"},"footer":{"background_color":"transparent","height":"130px","width":"100%","border_top_width":"1px","border_top_style":"dotted","border_top_color":"gray"},"attribute":{"style":{"display":"block","background_color":"rgba(0, 0, 0, 0)"}},"is_homepage":true,"elements":[{"createdOnPage":"page1","attribute":{"id":"container1","classes":"container_box gray draggable_element no_mg grab","element_type":"container","style":{"left":"223px","top":"116px","position":"static","width":"711px","height":"281px"}},"id":"container1","tag":"div","showOnPage":[{"id":"page1","display":true},{"id":"page2","display":false},{"id":"page3","display":false}],"events":[]},{"createdOnPage":"page1","attribute":{"style":{"pointer_events":"none"},"element_type":"text","classes":"draggable_element no_mg grab","id":"text1","showall":"false","parent_style":"word_wrap: break_word; left: 261px; top: 145px; position: static; width: 144px; height: 41px;"},"id":"text1","tag":"div","html":"<h1 class=\'no_mg grab\' style=\'pointer_events: none;\'>Site Title</h1>","showOnPage":[{"id":"page1","display":true},{"id":"page2","display":false},{"id":"page3","display":false}],"events":[]},{"createdOnPage":"page1","attribute":{"id":"button1","type":"button","classes":"button button_danger draggable_element no_mg grab","value":"Button","element_type":"button","style":{"left":"746px","top":"251px","position":"static"}},"id":"button1","tag":"input","showOnPage":[{"id":"page1","display":true},{"id":"page2","display":false},{"id":"page3","display":false}],"events":[]},{"createdOnPage":"page1","attribute":{"style":{"pointer_events":"none"},"element_type":"link","classes":"draggable_element no_mg grab","id":"link1","showall":"false","parent_style":"word_wrap: break_word; left: 1013px; top: 88px; position: static; width: 159.778px; color: rgb(128, 128, 255); border_color: rgb(0, 255, 0); border_radius: 3px; background_color: rgb(255, 128, 255);"},"id":"link1","tag":"div","html":"<h4 id=\'link1\' class=\'no_mg grab\'  style=\'pointer-events: visible;\'>Simple Link</h4>","showOnPage":[{"id":"page1","display":true},{"id":"page2","display":false},{"id":"page3","display":false}],"events":[{"triggerElementId":"link1","triggerOn":"mouse_click","triggerEventCategory":"Mouse","affectingElementID":"","affectingElementType":"","actionCategory":"Navigation","additional_params":{"pageid":"page2"},"_triggerOn":"click","_action":"click","action":"navigation_linkpage"}]},{"createdOnPage":"page1","attribute":{"id":"textbox1","type":"text","classes":"u_full_width draggable_element no_mg grab","element_type":"textbox","style":{"left":"423px","top":"162px","position":"static"}},"id":"textbox1","tag":"input","showOnPage":[{"id":"page1","display":true},{"id":"page2","display":false},{"id":"page3","display":false}],"events":[]},{"createdOnPage":"page1","attribute":{"id":"image1","classes":"draggable_element no_mg grab","src":"images/available_images/4.jpg","element_type":"image","style":{"width":"440px","height":"240px","position":"static","left":"263px","top":"320px"}},"id":"image1","tag":"img","showOnPage":[{"id":"page1","display":true},{"id":"page2","display":false},{"id":"page3","display":false}],"events":[]}]},{"id":"page2","name":"Page 2","header":{"background_color":"transparent","height":"150px","width":"100%","border_bottom_width":"1px","border_bottom_style":"dotted","border_bottom_color":"gray"},"footer":{"background_color":"transparent","height":"130px","width":"100%","border_top_width":"1px","border_top_style":"dotted","border_top_color":"gray"},"attribute":{"style":{"display":"block","background_color":"rgb(208, 34, 227)"}},"is_homepage":false,"elements":[{"createdOnPage":"page2","attribute":{"style":{"pointer_events":"none"},"element_type":"link","classes":"draggable_element no_mg grab","id":"link2","showall":"false","parent_style":"word_wrap: break_word; left: 441px; top: 78px; position: static; width: 159.778px;"},"id":"link2","tag":"div","html":"<h4 id=\'link2\' class=\'no_mg grab\' style=\'pointer-events: visible;\'>Simple Link</h4>","showOnPage":[{"id":"page1","display":false},{"id":"page2","display":true},{"id":"page3","display":false}],"events":[{"triggerElementId":"link2","triggerOn":"mouse_click","triggerEventCategory":"Mouse","affectingElementID":"","affectingElementType":"","actionCategory":"Navigation","additional_params":{"pageid":"page1"},"_triggerOn":"click","_action":"click","action":"navigation_linkpage"}]}]},{"id":"page3","name":"page 3","header":{"background_color":"transparent","height":"110px","width":"100%","border_bottom_width":"1px","border_bottom_style":"dotted","border_bottom_color":"gray"},"footer":{"background_color":"transparent","height":"110px","width":"100%","border_top_width":"1px","border_top_style":"dotted","border_top_color":"gray"},"attribute":{"style":{"display":"block","background":"url(http://localhost/redesign/examples/oversign/images/available_images/3.jpg) 50% 50% / cover no_repeat fixed"}},"is_homepage":false,"elements":[]}],"homepage":"page1","pagename":"Page 1"};
		console.log(a);
		$.ajax({
				url:"http://localhost:8080/oversign/service/store/saveStore",
				data:JSON.stringify(window.a),
				accept: 'application/json',
				contentType:"application/json",
				type:"POST",
				crossDomain:true,
				success:function(data){
					console.log(data);
				}
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
		if(typeof param.data != "undefined"){
			param.data = $.extend({},$.fn.pagination.defaults.data,param.data);
		}
		var pagination = $.extend({},$.fn.pagination.defaults,param);
		pagination.parent = this;
		pagination.item = $(this).find("div.templateItem");
		$.extend(this[0],$.fn.pagination.methods);
		this[0].settingPage = pagination;
		this[0].loadData();
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