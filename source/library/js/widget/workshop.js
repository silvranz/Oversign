var workshop;
var mappingAnimation = {"A0":[{
	start:"10",
	end:"20",
	animation:0
}]};
var currentObjectAnimation = "";
$(document).ready(function(){
	workshop  = $(".workshop");
	$(".leftPanel a").click(function(e){
		e.preventDefault();
		var tagName = $(this).prop("tagName");
		var tempClone = $(this).clone().attr("id",tagName+$(tagName,workshop).length+"");
		workshop.append(tempClone);
	})
	$(".workshop").on("click","*",function(e){
		e.preventDefault();
		currentObjectAnimation = $(this).attr("id");
		loadAnimation($(this).attr("id"));
	})
	$(".animationPanel #newAnimation").click(function(){
		insertAnimation();
	});
});

function defaultValue(variable,value){
	return typeof variable !== "undefined"?  variable:value;
}

function loadAnimation(id){
	$(".animationPanel .animationItem").remove();
	var listAnimation = mappingAnimation[id];
	if(typeof listAnimation === "undefined")return;
	var animationItemTemp;
	for(var i=0,len = listAnimation.length;i<len;i++){
		insertAnimation(listAnimation[i].start,listAnimation[i].end,listAnimation[i].animation,i);
	}
}

function insertAnimation(start,end,animation,index){
	start = defaultValue(start,"");
	end = defaultValue(end,"");
	animation = defaultValue(animation,0);
	index = defaultValue(index,$(".animationPanel .animationItem").length);
	var newAnimationButton = $(".animationPanel #newAnimation");
	var animationItemTemp = $(".animationPanel .animationItemTemplate").clone()
								.removeClass("animationItemTemplate").addClass("animationItem")
								.attr("index",index).show();
	$(".startFrame",animationItemTemp).val(start);
	$(".endFrame",animationItemTemp).val(end);
	console.log(animation);
	$(".animationType",animationItemTemp).val(animation);
	$(".valueControl",animationItemTemp).change(function(){
		var parent = $(this).closest(".animationItem");
		if(typeof mappingAnimation[currentObjectAnimation] === "undefined"){
			mappingAnimation[currentObjectAnimation] = [];
		}
		else if(typeof mappingAnimation[currentObjectAnimation][$(parent).attr("index")] === "undefined"){
			mappingAnimation[currentObjectAnimation][$(parent).attr("index")] = {
				start:"",
				end:"",
				animation:0
			}
		}
		mappingAnimation[currentObjectAnimation][$(parent).attr("index")][$(this).attr("typeValue")] = $(this).val();
	});
	$(newAnimationButton).before(animationItemTemp);
}