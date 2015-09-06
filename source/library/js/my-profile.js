var userdata=[];
$(document).ready(function(){
	var passingData = {
		"userid":"3"
	};
	$.ajax({
		url:"http://localhost:8080/oversign/service/myprofile/getprofile",
		data:JSON.stringify(passingData),
		accept: 'application/json',
		contentType:"application/json",
		type:"POST",
		crossDomain:true,
		success:function(data){
			console.log(data);
			userdata=data;
			if(typeof(userdata[0].useraddress) === 'undefined') userdata[0].useraddress='-';
			if(typeof(userdata[0].usercity) === 'undefined') userdata[0].usercity='';
			if(typeof(userdata[0].userprovince) === 'undefined') userdata[0].userprovince='';
			if(typeof(userdata[0].usercountry) === 'undefined') userdata[0].usercountry='';
			if(typeof(userdata[0].userpostalcode) === 'undefined') userdata[0].userpostalcode='';
			if(typeof(userdata[0].companyaddress) === 'undefined') userdata[0].companyaddress='-';
			if(typeof(userdata[0].companycity) === 'undefined') userdata[0].companycity='';
			if(typeof(userdata[0].companyprovince) === 'undefined') userdata[0].companyprovince='';
			if(typeof(userdata[0].companycountry) === 'undefined') userdata[0].companycountry='';
			if(typeof(userdata[0].companypostalcode) === 'undefined') userdata[0].companypostalcode='';

			$("#spanName").text(userdata[0].userfullname);
			$("#spanEmail").text(userdata[0].useremail);
			$("#spanPhone").text(userdata[0].userphone);
			$("#spanAddress").text(userdata[0].useraddress
				+' '
				+userdata[0].usercity
				+' '
				+userdata[0].userprovince
				+' '
				+userdata[0].usercountry
				+' '
				+userdata[0].userpostalcode);
			$("#radioUse"+userdata[0].personaluser).prop("checked", true);
			$("#radioUse"+userdata[0].personaluser).parent().siblings().find('input[type="radio"]').prop("checked", false);
			$("#txtCompanyName").val(userdata[0].companyname);
			$("#txtCompanyAddress").val(userdata[0].companyaddress);
			$("#txtCompanyCity").val(userdata[0].companycity);
			$("#txtCompanyState").val(userdata[0].companyprovince);
			$("#ddlCountry").val(userdata[0].companycountry);
			$("#txtPostalCode").val(userdata[0].companypostalcode);

		}
	})

	$("#btnEditUserBasic").click(function(){
		$(this).replaceWith("<input type=\"button\" id=\"btnSaveUserBasic\" class=\"btn btn-primary\" value=\"Save\">");
		var name=$("#spanName").text();
		$("#spanName").replaceWith("<input type=\"text\" id=\"txtEditName\" value=\"" + name + "\">");
		var email=$("#spanEmail").text();
		$("p#spanEmail").replaceWith("<input type=\"text\" id=\"txtEditEmail\" value=\"" + email + "\">");
		var phone=$("#spanPhone").text();
		$("p#spanPhone").replaceWith("<input type=\"text\" id=\"txtEditPhone\" value=\"" + phone + "\">");
		//var address=$("#spanAddress").text();
		$("p#spanAddress").replaceWith(
			"<input type=\"text\" id=\"txtEditAddress\" value=\"" + userdata[0].useraddress + "\">"
			+"<input type=\"text\" id=\"txtEditCity\" value=\"" + userdata[0].usercity + "\">"
			+"<input type=\"text\" id=\"txtEditProvince\" value=\"" + userdata[0].userprovince + "\">"
			+"<input type=\"text\" id=\"txtEditCountry\" value=\"" + userdata[0].usercountry + "\">"
			+"<input type=\"text\" id=\"txtEditPostalCode\" value=\"" + userdata[0].userpostalcode + "\">"
			);
	})
});