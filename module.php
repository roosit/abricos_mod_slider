<?php 

class SliderModule extends Ab_Module {
	
	private $_manager = null;
	
	public function SliderModule(){
		$this->version = "0.0.3";
		$this->name = "slider";
		$this->takelink = "slider";
		
		$this->permission = new SliderPermission($this);
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

/**
 * Идентификаторы действий для определения ролей пользователя. 
 * Примечание: можно определить сколько угодно действий, но на практике обычно хватает 
 * трех: чтение, запись, администрирование 
 */ 
class SliderAction {
	/**
	 * Чтение
	 * @var integer
	 */
	const VIEW	= 10;
	
	/**
	 * Запись
	 * @var integer
	 */
	const WRITE	= 30;
	
	/**
	 * Администрирование
	 * @var integer
	 */
	const ADMIN	= 50;
}

/**
 * Базовые роли пользователя (используется при первичной инсталляции модуля в ядре)
 */
class SliderPermission extends Ab_UserPermission {

	public function SliderPermission(SliderModule $module){

		$defRoles = array(
			new Ab_UserRole(SliderAction::VIEW, Ab_UserGroup::GUEST),
			new Ab_UserRole(SliderAction::VIEW, Ab_UserGroup::REGISTERED),
			new Ab_UserRole(SliderAction::VIEW, Ab_UserGroup::ADMIN),
			
			new Ab_UserRole(SliderAction::WRITE, Ab_UserGroup::REGISTERED),
			new Ab_UserRole(SliderAction::WRITE, Ab_UserGroup::ADMIN),

			new Ab_UserRole(SliderAction::ADMIN, Ab_UserGroup::ADMIN),
		);

		parent::__construct($module, $defRoles);
	}

	public function GetRoles(){
		return array(
			SliderAction::VIEW => $this->CheckAction(SliderAction::VIEW),
			SliderAction::WRITE => $this->CheckAction(SliderAction::WRITE),
			SliderAction::ADMIN => $this->CheckAction(SliderAction::ADMIN)
		);
	}
}

Abricos::ModuleRegister(new SliderModule());

?>