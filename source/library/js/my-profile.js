$(document).ready(function(){
	//$("#loginButton",loginModal).click(function(){
		var passingData = {
			"userid":"1"
		};
		$.ajax({
			url:"http://localhost:8080/oversign/service/myprofile/getprofile",
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