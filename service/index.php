<?php
	//defined('BASEPATH') OR exit('No direct script access allowed');
	$requestUrl = $_POST["url"];
	$mappingJSON = json_decode(file_get_contents('mapping/'.$requestUrl.'.json'));
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
				$retDoc->createElement('script',' ')->setAttribute ('src', 'http://localhost/oversign/source/library/js/'.$script.".js");
			}
		}
		else if($key == "css"){
			foreach($value as $style){
				$retDoc->createElement('link','')->setAttribute ('src', 'http://localhost/oversign/source/library/css/'.$style.".css");
			}
		}
		else if($key == "external"){
			$listExternal = $value;
		}
	}
	echo $retDoc->saveHTML();
?>