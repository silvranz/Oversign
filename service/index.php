<?php
	header('Access-Control-Allow-Origin: *');
	define("BASEPATH","http://ww.ovs.com/");
	$requestUrl = $_POST["url"];
	$mappingJSON = @file_get_contents('mapping/'.$requestUrl.'.json');
	if($mappingJSON==FALSE){
		echo "<img src='".BASEPATH."source/images/404.jpg'>";
	}
	else{
		$mappingJSON = json_decode($mappingJSON);
		$listScript = Array();
		$listStyle = Array();
		$listExternal = Array();
		$tempHtml = "";
		libxml_use_internal_errors(true);
		$retDoc = new DOMDocument();
		foreach($mappingJSON as $key => $value){
			if($key == "html"){
				foreach($value as $htmlObj){
					$tempHtml = file_get_contents("../source/html/".$htmlObj->source);
					if(empty($htmlObj->target))
					{
						$retDoc->loadHTML($tempHtml);
					}
					else
					{					
						try{
							$tempHtml = $retDoc->createElement($tempHtml);
						}
						catch(DOMException $e){
							$tempHtml = $retDoc->createElement("div",$tempHtml);
						}
						$retDoc->getElementById($htmlObj->target)->appendChild($tempHtml);
					}
				}
			}
			else if($key == "js"){
				foreach($value as $script){
					$tempScript = $retDoc->createElement('script',' ');
					$tempScript->setAttribute ('type', 'text/javascript');
					$tempScript->setAttribute ('src', BASEPATH.'source/library/js/'.$script.".js");
					$body = $retDoc->getElementsByTagName('body')->item(0);
					$body->insertBefore($tempScript,$body->firstChild);
				}
			}
			else if($key == "css"){
				foreach($value as $style){
					$tempStyle = $retDoc->createElement('link','');
					$tempStyle->setAttribute ('rel', 'stylesheet');
					$tempStyle->setAttribute ('type', 'text/css');
					$tempStyle->setAttribute ('href', BASEPATH.'source/library/css/'.$style.".css");
					$body = $retDoc->getElementsByTagName('body')->item(0);
					$body->insertBefore($tempStyle,$body->firstChild);
				}
			}
			else if($key == "external"){
				foreach($value as $external){
					$listFile = scandir("../source/library/external/".$external);
					foreach($listFile as $subdir){
						if($subdir == "css"){
							$listStyle = scandir("../source/library/external/".$external."/".$subdir);
							foreach($listStyle as $styles){
								if($styles == "." || $styles == "..") continue;
								$tempStyle = $retDoc->createElement('link','');
								$tempStyle->setAttribute ('rel', 'stylesheet');
								$tempStyle->setAttribute ('type', 'text/css');
								$tempStyle->setAttribute ('href', BASEPATH.'source/library/external/'.$external."/".$subdir."/".$styles);
								$body = $retDoc->getElementsByTagName('body')->item(0);
								$body->insertBefore($tempStyle,$body->firstChild);
							}
						}
						else if($subdir == "js"){
							$listScript = scandir("../source/library/external/".$external."/".$subdir);
							foreach($listScript as $scripts){
								if($scripts == "." || $scripts == "..") continue;								
								$tempScript = $retDoc->createElement('script',' ');
								$tempScript->setAttribute ('type', 'text/javascript');
								$tempScript->setAttribute ('src', BASEPATH.'source/library/external/'.$external."/".$subdir."/".$scripts);
								$body = $retDoc->getElementsByTagName('body')->item(0);
								$body->insertBefore($tempScript,$body->firstChild);
							}
						}
					}
				}
			}
		}
		echo $retDoc->saveHTML();
	}
?>