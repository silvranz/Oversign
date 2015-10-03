$(document).ready(function(){

	$("#btnSendContactUs").click(function(){
		var contactus = {
			"name":$("#txtSenderName").val(),
			"email":$("#txtSenderEmail").val(),
			"message":$("#txtMessage").val(),
			"userid":"1" //harusnya session!!
		};
		console.log(contactus);
		$.ajax({
			url:"http://localhost:8080/oversign/service/contactus/insertcontactus",
			data:JSON.stringify(contactus),
			accept: 'application/json',
			contentType:"application/json",
			type:"POST",
			crossDomain:true,
			success:function(data){
				console.log(data);
			}
		});
	})
});