var listTemplate = [];
function loadTemplate(){
	var parentElement = $("#displayTemplate");
	$(listTemplate).each(function(i){
		var newItem = $(".templateItem",parentElement).clone().removeClass("templateItem").show();
		$(".templateName",newItem).text(this.templateName);
		$(".previewImage",newItem).attr("alt",this.previewImage);
		$(".rating",newItem).text(this.rating+" star ");
		$(".numUser",newItem).text(this.userRating);
		$(parentElement).append(newItem);
	})
}
$(document).ready(function(){
	$(".page-header").click(function(e){
		loadContent("http://localhost/oversign/template-workspace",1,"Website workspace",800,500);
	})
	$.ajax({
		url:"http://localhost:8080/oversign/service/store/getAllTemplateCategory",
		type:"GET",
		crossDomain:true,
		success:function(data){
			$(data).each(function(i){
				var categoryItem = $("<a href='#'>");
				$(categoryItem).text(this.categoryName);
				categoryItem[0].index = this.categoryNumber;				
				categoryItem[0].onclick = function(e){
					e.preventDefault;
					$("#displayTemplate")[0].updatePage({
						filter:{"categoryId":this.index}
					})
				}
				$("#categoryFilter").append($("<li>").append(categoryItem));
			})		
		}
	})
	$("#displayTemplate").pagination({
		url:"http://localhost:8080/oversign/service/store/getAllTemplate",
		filter:{"categoryId":1},
		sortText:["Created date","Rating","Template title"],
		itemFunction:function(item,parent,index){
			$(".previewImage",parent).attr("src",IMAGE_PATH+item.previewImage);
			$(".editButton",parent).attr("index",index+1).click(function(e){
				alert("edit template ke-"+$(this).attr("index"));
			})
			$(".previewButton",parent).attr("index",index+1).click(function(e){
				alert("preview template ke-"+$(this).attr("index"));
			})
		}
	});
});