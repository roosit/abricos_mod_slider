<?php
/**
 */

// классы объектов модуля лучше вынести в отдельный файл для удобства
require_once 'classes.php'; 

// все запросы к БД в одном месте
require_once 'dbquery.php';

class SliderManager extends Ab_ModuleManager {
	
	/**
	 * @var SliderManager
	 * 
	 * Очень удобно обращаться к функциям менеджера из сторонних модулей через эту 
	 * статичную переменную, которая содержит экзепляр этого класса
	 */
	public static $instance = null;
	
	/**
	 * Настойки модуля
	 * @var SliderConfig
	 */
	public $config = null;
	
	public function __construct($module){
		parent::__construct($module);
	
		SliderManager::$instance = $this;
	
		// берем возможные настройки из includes/config.php
		$this->config = new SliderConfig(Abricos::$config['module']['slider']);
	}
	
	/**
	 * Есть ли у этого пользователя роль админа?
	 */
	public function IsAdminRole(){
		return $this->IsRoleEnable(SliderAction::ADMIN);
	}

	/**
	 * Есть ли у этого пользователя роль на запись?
	 */
	public function IsWriteRole(){
		if ($this->IsAdminRole()){ return true; }
		return $this->IsRoleEnable(SliderAction::WRITE);
	}
	
	/**
	 * Есть ли у этого пользователя роль на чтение?
	 */
	public function IsViewRole(){
		if ($this->IsWriteRole()){ return true; }
		return $this->IsRoleEnable(SliderAction::VIEW);
	}
	
	public function AJAX($d){
		switch($d->do){
			case "initdata": return $this->InitDataToAJAX();

			case "sliderlist": return $this->SliderListToAJAX();
			case "slidersave": return $this->SliderSaveToAJAX($d->savedata);
			case "sliderremove": return $this->SliderRemove($d->sliderid);
		}
	
		return null;
	}
	
	public function InitDataToAJAX(){
		if (!$this->IsViewRole()){ return null; }
	
		$ret = new stdClass();
	
		$obj = $this->SliderListToAJAX();
		$ret->sliders = $obj->sliders;
	
		return $ret;
	}	

	/**
	 * Список элементов слайдера
	 * @return SliderList
	 */
	public function SliderList(){
		if (!$this->IsViewRole()){ return null; } // если у пользователя нет доступа на чтение, то выдаем пустоту
		
		$list = new SliderList();
		$rows = SliderQuery::SliderList($this->db);
		while (($d = $this->db->fetch_array($rows))){
			$list->Add(new SliderItem($d));
		}
		
		return $list;
	}
	
	public function SliderListToAJAX(){
		$list = $this->SliderList();
		if (empty($list)){ return null; }
		
		$ret = new stdClass();
		$ret->sliders = $list->ToAJAX();
		return $ret;
	}
	
	public function SliderSave($sd){
		if (!$this->IsAdminRole()){ return null; }
	
		$sliderid = intval($sd->id);
	
		$utm  = Abricos::TextParser(true);
		$utm->jevix->cfgSetAutoBrMode(true);
	
		$utmf  = Abricos::TextParser(true);
	
		$sd->tl = $utmf->Parser($sd->tl);
	
		if ($sliderid == 0){
			$sliderid = SliderQuery::SliderAppend($this->db, $sd);
		}else{
			SliderQuery::SliderUpdate($this->db, $sliderid, $sd);
		}
	
		return $sliderid;
	}
		
	public function SliderSaveToAJAX($sd){
		$sliderid = $this->SliderSave($sd);
	
		if (empty($sliderid)){ return null; }
	
		$ret = $this->SliderListToAJAX();
		$ret->sliderid = $sliderid;
		return $ret;
	}
	
	public function SliderRemove($sliderid){
		if (!$this->IsAdminRole()){ return null; }
	
		SliderQuery::SliderRemove($this->db, $sliderid);
	
		return true;
	}
	
    
	/*
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
	/**/
}	
?>