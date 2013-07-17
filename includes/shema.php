<?php
/**

 */


$charset = "CHARACTER SET 'utf8' COLLATE 'utf8_general_ci'";
$updateManager = Ab_UpdateManager::$current; 
$db = Abricos::$db;
$pfx = $db->prefix;

if ($updateManager->isInstall()){
	
	// конфигурация слайда
	$db->query_write("
		CREATE TABLE IF NOT EXISTS ".$pfx."slide_config (
		  `speed` varchar(250) NOT NULL default '' COMMENT 'Скорость',
		  `time` varchar(250) NOT NULL default '' COMMENT 'Интервал'
		 )".$charset
	);

	
	
}

if ($updateManager->isUpdate('0.0.2')){
	Abricos::GetModule('slider')->permission->Install();
}
?>