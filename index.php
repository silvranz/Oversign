<?php 
	define("BASEPATH","http://localhost:1234/oversign/");
?>
<html>
	<head>
		<!-- Basic Page Needs
		–––––––––––––––––––––––––––––––––––––––––––––––––– -->
		<meta charset="utf-8">
		<title>Oversign</title>
		<meta name="description" content="">
		<meta name="author" content="">

		<!-- Mobile Specific Metas
		–––––––––––––––––––––––––––––––––––––––––––––––––– -->
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<!-- FONT
		–––––––––––––––––––––––––––––––––––––––––––––––––– -->
		<link href='<?=BASEPATH?>source/library/external/skeleton/css/font.css' rel='stylesheet' type='text/css'>

		<!-- CSS
		–––––––––––––––––––––––––––––––––––––––––––––––––– -->
		<link rel="stylesheet" href="<?=BASEPATH?>source/library/external/skeleton/css/normalize.css">
		<link rel="stylesheet" href="<?=BASEPATH?>source/library/external/skeleton/css/skeleton.css">
		<link rel="stylesheet" href="<?=BASEPATH?>source/library/external/skeleton/css/custom.css">
		<link rel="stylesheet" href="<?=BASEPATH?>source/library/external/skeleton/css/top-navbar.css">
		<link rel="stylesheet" href="<?=BASEPATH?>source/library/external/skeleton/css/modal.css">


	    <script type="text/javascript" src="<?=BASEPATH?>source/library/js/config.js"></script>
		<script type="text/javascript" src="<?=BASEPATH?>source/library/js/jquery.js"></script>
	    <script type="text/javascript" src="<?=BASEPATH?>source/library/js/main.js"></script>
		<script src="<?=BASEPATH?>source/library/js/jquery.min.js"></script>
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
		<!--
		<div class="blocker">
			<img src="source/images/LoadingCircle.gif" />
		</div>-->
		<!-- Start Of Modal -->
		  	<!-- Modal Login -->
		<div class="md-modal md-effect-1" id="modal-login">
			<div class="md-content">
				<div class="md-content-header">
					<div class="row">
						<div class="eleven columns">
							<h4>Login</h4>
						</div>
						<div class="one columns">
							<a href="#" class="md-close modal-close-button"></a>
						</div>
					</div>
				</div>

				<form>
		          	<div class="row">
			            <div class="twelve columns">
			              	<label for="txtLoginEmail">Email</label>
			              	<input id="txtLoginEmail" class="u-full-width" type="text" placeholder="Ketik email Anda disini &hellip;" />
			            </div>
			            <div class="twelve columns">
			              	<label for="txtLoginPassword">Password</label>
			              	<input id="txtLoginPassword" class="u-full-width" type="password" placeholder="Ketik password Anda disini &hellip;" />
			            </div>
			            <div class="twelve columns taright">
			            	<a class="button button-primary" href="sites.html">Login</a>
			            </div>
			            <div class="twelve columns taright">
			            	Belum punya akun ? <a href="#" class="md-trigger md-replace" data-modal="modal-register">Daftar</a>
			            </div>
		          	</div>
		        </form>
			</div>
		</div>

		<!-- Modal Register -->
		<div class="md-modal md-effect-1" id="modal-register">
			<div class="md-content">
				<div class="md-content-header">
					<div class="row">
						<div class="eleven columns">
							<h4>Daftar</h4>
						</div>
						<div class="one columns">
							<a href="#" class="md-close modal-close-button"></a>
						</div>
					</div>
				</div>

				<form>
		          	<div class="row">
			            <div class="twelve columns">
			              	<label for="txtRegisterEmail">Email</label>
			              	<input id="txtRegisterEmail" class="u-full-width" type="text" placeholder="Ketik email Anda disini &hellip;" />
			            </div>
			            <div class="twelve columns">
			              	<label for="txtRegisterPassword">Password</label>
			              	<input id="txtRegisterPassword" class="u-full-width" type="password" placeholder="Ketik password Anda disini &hellip;" />
			            </div>
			            <div class="twelve columns">
			              	<label for="txtRegisterConfirmPassword">Konfirmasi Password</label>
			              	<input id="txtRegisterConfirmPassword" class="u-full-width" type="password" placeholder="Ketik konfirmasi password Anda disini &hellip;" />
			            </div>
			            <div class="twelve columns taright">
			            	<input class="button-primary" type="button" value="Daftar">
			            </div>
			            <div class="twelve columns taright">
			            	Sudah punya akun ? <a href="#" class="md-trigger md-replace" data-modal="modal-login">Login</a>
			            </div>
		          	</div>
		        </form>
			</div>
	</div>
		<!-- End Of Modal -->
		<div class="md-overlay"></div><!-- the overlay element -->

			<!-- JS -->
	<script src="<?=BASEPATH?>source/library/external/skeleton/js/modal/classie.js"></script>
	<script src="<?=BASEPATH?>source/library/external/skeleton/js/modal/modalEffects.js"></script>
	<script src="<?=BASEPATH?>source/library/external/skeleton/js/functions.js"></script>

	</body>
</html>