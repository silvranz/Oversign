$(document).ready(function(){
	$("#btnSendContactUs").click(function(e){

		e.preventDefault();
		var self = $(this);
		var form = self.closest('form').serializeToJSON();
		var rules = [
			{
				selector_name : 'txtSenderName',
				rules : [
					{
						'required' : true,
						'message' : 'Nama ini harus diisi'
					},
					{
						'alphanumeric' : true,
					},				
				]
			},
			{
				selector_name : 'txtSenderEmail',
				rules : [
					{
						'required' : true,
						'message' : 'Email harus diisi'
					},
					{
						'email' : true,
					},
				]
			},
			{
				selector_name : 'txtMessage',
				rules : [
					{
						'required' : true,
						'message' : 'Pesan harus diisi'
					},
				]
			},
		];
		var valid = $.validate(form, rules);

		if( valid ) {
			
			var contactus = {
				"name" : $("#txtSenderName").val(),
				"email" : $("#txtSenderEmail").val(),
				"message" : $("#txtMessage").val(),
				"userid" : "1" //harusnya session!!
			};

			$.ajax({
				url:BASE_URL+"/service/contactus/insertcontactus",
				data:JSON.stringify(contactus),
				accept: 'application/json',
				contentType:"application/json",
				type:"POST",
				crossDomain:true,
				success:function(data){
					console.log(data);
				}
			});
		}
	})
});