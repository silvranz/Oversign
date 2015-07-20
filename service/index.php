<?php
	//defined('BASEPATH') OR exit('No direct script access allowed');
	$requestUrl = $_POST["url"];
	$mappingJSON = @file_get_contents('mapping/'.$requestUrl.'.json');
	if($mappingJSON==FALSE){
		echo "<img src='source/images/404.jpg'>";
	}
	else{
		$mappingJSON = json_decode($mappingJSON);
		$listScript = Array();
		$listStyle = Array();
		$listExternal = Array();
		$tempHtml = "";
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
					$tempScript->setAttribute ('src', 'http://localhost/oversign/source/library/js/'.$script.".js");
					$body = $retDoc->getElementsByTagName('body')->item(0);
					$body->insertBefore($tempScript,$body->firstChild);
				}
			}
			else if($key == "css"){
				foreach($value as $style){
					$tempStyle = $retDoc->createElement('link','');
					$tempStyle->setAttribute ('rel', 'stylesheet');
					$tempStyle->setAttribute ('type', 'text/css');
					$tempStyle->setAttribute ('href', 'http://localhost/oversign/source/library/css/'.$style.".css");
					$body = $retDoc->getElementsByTagName('body')->item(0);
					$body->insertBefore($tempStyle,$body->firstChild);
				}
			}
			else if($key == "external"){
				$listExternal = $value;
			}
		}
		echo $retDoc->saveHTML();
	}
?>