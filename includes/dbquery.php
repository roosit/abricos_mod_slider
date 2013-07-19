<?php
/**

 */

class SliderQuery {
	
	public static function SliderList(Ab_Database $db){
		$sql = "
			SELECT
				s.sliderid as id,
				s.images as img,
				s,title as tl,
				s.url,
				s.ord
			FROM ".$db->prefix."slider s
			ORDER BY ord DESC 
		";
		return $db->query_read($sql);
	}
    
    /*
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
    /**/
    
}

?>