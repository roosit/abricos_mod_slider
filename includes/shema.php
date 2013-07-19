<?php
/**

 */


$charset = "CHARACTER SET 'utf8' COLLATE 'utf8_general_ci'";
$updateManager = Ab_UpdateManager::$current; 
$db = Abricos::$db;
$pfx = $db->prefix;

if ($updateManager->isInstall()){
	
	// Дабы не усложнять систему, такие настройки лучше вынести в includes/config.php
	/*
	// конфигурация слайда
	$db->query_write("
		CREATE TABLE IF NOT EXISTS ".$pfx."slide_config (
		  `speed` varchar(250) NOT NULL default '' COMMENT 'Скорость',
		  `time` varchar(250) NOT NULL default '' COMMENT 'Интервал'
		 )".$charset
	);
	/**/
}

if ($updateManager->isUpdate('0.0.2')){
	Abricos::GetModule('slider')->permission->Install();
}

if ($updateManager->isUpdate('0.0.3')){
	
	// элементы слайдера
	$db->query_write("
		CREATE TABLE IF NOT EXISTS ".$pfx."slider (
			`sliderid` int(10) unsigned NOT NULL auto_increment COMMENT 'Идентификатор',
			
			`filehash` varchar(8) NOT NULL DEFAULT '' COMMENT 'Идентификатор картинки из менеджера файлов',
			`title` varchar(250) NOT NULL DEFAULT '' COMMENT 'Название',
			`url` varchar(250) NOT NULL DEFAULT '' COMMENT 'URL',
			`ord` int(5) NOT NULL DEFAULT 0 COMMENT 'Сортировка',

			PRIMARY KEY (`sliderid`)
		 )".$charset
	);
}

?>