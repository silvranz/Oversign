<?php 
	define("BASEPATH","http://localhost/oversign/");
?>
<html>
	<head>
		<title>Drag and Drop website builder</title>
		<meta charset="utf-8" name="viewport" content="width=device-width, initial-scale=1">
		<link href="<?=BASEPATH?>source/library/external/bootstrap/css/custom.css" rel="stylesheet"> 
		<!-- Bootstrap CSS -->
    	<link href="<?=BASEPATH?>source/library/external/bootstrap/css/bootstrap.min.css" rel="stylesheet">
    	<!-- Bootstrap theme -->
    	<link href="<?=BASEPATH?>source/library/external/bootstrap/css/bootstrap-theme.min.css" rel="stylesheet">
    	<!-- Carousel -->
    	<link href="<?=BASEPATH?>source/library/external/bootstrap/css/carousel.css" rel="stylesheet">
		<script type="text/javascript" src="<?=BASEPATH?>source/library/js/jquery.js"></script>
	    <script type="text/javascript" src="<?=BASEPATH?>source/library/external/bootstrap/js/bootstrap.min.js"></script>
		<style>
			body{
				padding:0;
			}
			#content{
				width:100%;
				height:90%;
			}
			.blocker{
				background-color:rgba(0, 0, 0, 0.5);
				width: 100%;
				height: 100%;
				position: relative;
				top: 0;
				left: 0;
				display:none;
			}
			.blocker img{
				width:50%;
				height:50%;
				left:25%;
				top:25%;
				position:absolute;
			}
		</style>
		<script>
			function loadContent(url){
				history.pushState({}, null, url);
				console.log(url);
				$.ajax({
					type:"POST",
					url:"<?=BASEPATH?>service/",
					data:{url:url},
					beforeSend:function(){
						$("#content").html($(".blocker").clone().show());
					},
					success:function(data){
						$("#content").html(data);
					}
				})
			}
			function defaultValue(variable,value){
				return typeof variable !== "undefined"?  variable:value;
			}
			function defaultPopupAnimation(){
				return {};
			}
			$(document).ready(function(){
				$("*").click(function(e){
					if($(this).hasClass("blog-nav-item")){
						e.preventDefault();
						loadContent($(this).attr("href"));
					}					
				});
				loadContent("home");
				$.fn.customPopup = function(mode,animation,time){
					mode = defaultValue(mode,"fullscreen");
					animation = defaultValue(animation,defaultPopupAnimation());
					time = defaultValue(time,500);
					switch(mode){
						case "fullscreen":
							
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
					return this;
				}
			});
		</script>
	</head>
	<body>
		<header>
			<?php include("source/template/header.html"); ?>
		</header>		
		<div id="content">			
		</div>		
		<footer class="bs-docs-footer" role="contentinfo">
			<?php include("source/template/footer.html"); ?>
		</footer>
		<div class="blocker">
			<img src="source/images/LoadingCircle.gif" />
		</div>
		<!-- Start Of Modal -->
		<div class="modal fade" id="loginModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
		  <div class="modal-dialog">
		    <div class="modal-content">
		      	<div class="modal-header" style="background-color:#0066CC;">
			        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
			        <h4 class="modal-title" id="modalLabel" style="color:#FFFFCC;">Login | Register</h4>
			        <p style="color:#FFFFCC;" id="modalLabelContent">Input email and password to start managing your website.</p>
		      	</div>
			      <div class="modal-body">
			      	<!-- Form Login -->
			        <form class="loginForm">
			          <div class="form-group">
			            <label for="login-email" class="control-label">Email:</label>
			            <input type="text" class="form-control" id="txtLoginEmail">
			          </div>
			          <div class="form-group">
			            <label for="login-password" class="control-label">Password:</label>
			            <input type="password" class="form-control" id="txtLoginPassword">
			          </div>
			          <p> Forgot Password? <span> <a style="cursor:pointer;" id="btnForgotPassword">Click Here</a> </span></p>
			        </form>
			      	<div class="modal-footer loginForm">
				        <button type="button" class="btn btn-primary">Login</button>
				        <p> New Member? Please <span> <a href="#" id="btnRegisterNewMember">Register</a> </span></p>
			      	</div>
			      	<!-- End Of Form Login -->
			      	<!-- Form Register -->
			        <form class="registerForm" style="display:none;">
			          <div class="form-group">
			            <label for="register-email" class="control-label">Email:</label>
			            <input type="text" class="form-control" id="txtRegisterEmail">
			          </div>
			          <div class="form-group">
			            <label for="register-password" class="control-label">Password:</label>
			            <input type="password" class="form-control" id="txtRegisterPassword">
			          </div>
			          <div class="form-group">
			            <label for="register-confirm-password" class="control-label">Confirm Password:</label>
			            <input type="password" class="form-control" id="txtRegisterConfirmPassword">
			          </div>
			        </form>
			      <div class="modal-footer registerForm" style="display:none;">
			        <button type="button" class="btn btn-primary">Register</button>
			        <p> Already have an account? Please <span> <a href="#" id="btnBackToLoginReg">Login</a> </span></p>
			      </div>
			      <!-- End Of Form Login -->
			      <!-- Form Forgot Password -->
			        <form class="forgotPasswordForm" style="display:none;">
			          <div class="form-group">
			            <label for="forgot-email" class="control-label">Email:</label>
			            <input type="text" class="form-control" id="txtForgotEmail">
			          </div>
			          <div class="form-group">
			            <label for="register-password" class="control-label">Captcha:</label>
			           	<textarea placeholder="Captcha Here"></textarea>
			          </div>
			        </form>
			      <div class="modal-footer forgotPasswordForm" style="display:none;">
			        <button type="button" class="btn btn-primary">Submit</button>
			        <p> Already have an account? Please <span> <a href="#" id="btnBackToLoginFor">Login</a> </span></p>
			      </div>
			      <!-- End Of Form Login -->
			      </div>
		    </div>
		  </div>
		</div>
		<!-- End Of Modal -->
	</body>
</html>