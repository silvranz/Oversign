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
	$.ajax({
		url:"http://localhost:8080/oversign/service/store/getAllTemplateCategory",
		type:"GET",
		crossDomain:true,
		success:function(data){			
			$(data).each(function(i){
				var categoryItem = $("<a href='#'>");
				$(categoryItem).text(this.categoryName).click(function(e){
					e.preventDefault();
				});
				$("#categoryFilter").append($("<li>").append(categoryItem));
			})		
		}
	})
	$.ajax({
		url:"http://localhost:8080/oversign/service/store/getAllTemplate",
		type:"GET",
		crossDomain:true,
		success:function(data){
			listTemplate = data;
			$("#displayTemplate").pagination({
				data:data
			});
			//loadTemplate();
		}
	})
});