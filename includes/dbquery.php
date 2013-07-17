<?php
/**

 */

class SliderQuery {
	
	public static function SliderList(Ab_Database $db){

		$sql = "
			SELECT
                file.filehash as flsh,
                file.filename as fln
			FROM ".$db->prefix."fm_file file, ".$db->prefix.'fm_folder folder
			WHERE file.folderid = folder.folderid AND file.attribute = 0 AND folder.name = "slider"
		';
		return $db->query_read($sql);
	}
    
    
    public static function SliderConfig(Ab_Database $db){
		$sql = "
			SELECT
				time,
				speed
			FROM ".$db->prefix."slide_config
		";
        return $db->query_first($sql);
	}
    
    public static function Update(Ab_Database $db, $speed="2000", $time="3000"){

		$sql = "
			UPDATE ".$db->prefix."slide_config
			SET time=".$time.", speed=".$speed."
		";
		$db->query_write($sql);
	}
    
    
}

?>