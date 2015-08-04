$(document).ready(function(){
	$.ajax({
		url:"http://localhost:8080/oversign/service/forum/getpopularhashtag",
		type:"GET",
		crossDomain:true,
		success:function(data){
			console.log(data);		}
	})
	$.ajax({
		url:"http://localhost:8080/oversign/service/forum/gethotthread",
		type:"GET",
		crossDomain:true,
		success:function(data){
			console.log(data);		}
	})
});