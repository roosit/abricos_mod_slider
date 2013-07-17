<?php
/**
 */

require_once 'dbquery.php';

class SliderManager extends Ab_ModuleManager {

	public function SliderList(){
		return SliderQuery::SliderList($this->db);
	}
    
    public function SliderConfig(){
		return SliderQuery::SliderConfig($this->db);
	}
    
    public function Update($data){
		if (!$this->IsAdminRole()){ return null; }
				
		$messageid = $data->id;
		$userid = Abricos::$user->info['userid'];
		$body = nl2br($data->rp_body);		
		FeedbackQuery::Update(Brick::$db, $speed, $time);
	}
}	
?>