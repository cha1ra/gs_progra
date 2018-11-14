<?php

$url = $_POST['url'].'?text='.$_POST['text'].'&source=en&target='.$_POST['target'];

//echo $url;
echo file_get_contents($url);

// echo 123;

?>