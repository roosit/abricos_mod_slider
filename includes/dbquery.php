<?php
/**

 */

class SliderQuery {
	
	public static function SliderList(Ab_Database $db){
		$sql = "
			SELECT
				s.sliderid as id,
				s.filehash as img,
				s.title as tl,
				s.url,
				s.ord
			FROM ".$db->prefix."slider s
			ORDER BY ord DESC 
		";
		return $db->query_read($sql);
	}
	
	public static function SliderAppend(Ab_Database $db, $d){
		$sql = "
			INSERT INTO ".$db->prefix."slider
			(title) VALUES (
				'".bkstr($d->tl)."'
			)
		";
		$db->query_write($sql);
		return $db->insert_id();
	}
	
	public static function SliderUpdate(Ab_Database $db, $sliderid, $d){
		$sql = "
			UPDATE ".$db->prefix."slider
			SET
				title='".bkstr($d->tl)."'
			WHERE sliderid=".bkint($sliderid)."
			LIMIT 1
		";
		$db->query_write($sql);
	}
	
	public static function SliderRemove(Ab_Database $db, $sliderid){
		$sql = "
			DELETE ".$db->prefix."slider
			WHERE sliderid=".bkint($sliderid)."
			LIMIT 1
		";
		$db->query_write($sql);
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