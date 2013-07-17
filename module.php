<?php 

class SliderModule extends Ab_Module {
	
	private $_manager = null;
	
	public function SliderModule(){
		$this->version = "0.0.2";
		$this->name = "slider";
		$this->takelink = "slider";
		
		/* $this->permission = new SliderPermission($this); */
	}

	/**
	 * Получить имя кирпича контента
	 *
	 * @return string
	 */
	public function GetContentName(){
		$adress = $this->registry->adress;
		
		if($adress->level == 2 && substr($adress->dir[1], 0, 4) != 'page'){
			return "view";
		}
		return "index";
	}
	
	/**
	 * Получить менеджер
	 *
	 * @return NewsManager
	 */
	public function GetManager(){
		if (is_null($this->_manager)){
			require_once 'includes/manager.php';
			$this->_manager = new SliderManager($this);
		}
		return $this->_manager;
	} 
	
}

Abricos::GetModule('comment');
Abricos::ModuleRegister(new SliderModule());

?>