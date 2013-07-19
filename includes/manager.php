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
	 * @var SlidebarConfig
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
		return $this->IsRoleEnable(SlidebarAction::ADMIN);
	}

	/**
	 * Есть ли у этого пользователя роль на запись?
	 */
	public function IsWriteRole(){
		if ($this->IsAdminRole()){ return true; }
		return $this->IsRoleEnable(SlidebarAction::WRITE);
	}
	
	/**
	 * Есть ли у этого пользователя роль на чтение?
	 */
	public function IsViewRole(){
		if ($this->IsWriteRole()){ return true; }
		return $this->IsRoleEnable(SlidebarAction::VIEW);
	}

	/**
	 * Список элементов слайдера
	 * @return SliderList
	 */
	public function SliderList(){
		if (!$this->IsViewRole()){ return null; } // если у пользователя нет доступа на чтение, то выдаем пустоту
		
		$list = new SliderList();
		$rows = SliderQuery::Slider($this->db);
		while (($d = $this->db->fetch_array($rows))){
			$list->Add(new SliderItem($d));
		}
		
		return $list;
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