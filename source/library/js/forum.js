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
			console.log(data);		
		}
	})
	//$("#loginButton",loginModal).click(function(){
		var passingData = {
			"search":"mau"
		};
		$.ajax({
			url:"http://localhost:8080/oversign/service/forum/getsearchresult",
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
	//})
});