<?php 
/**
 * @package Abricos
 * @subpackage Slider
 * @license http://www.gnu.org/copyleft/gpl.html GNU/GPL, see LICENSE.php
 */

/**
 * Конфигурация модуля (данные могут быть определены в includes/config.php)
 * Инициализация в SliderManager
 */
class SliderConfig {

	/**
	 * @var SliderConfig
	 */
	public static $instance;
	
	/**
	 * Скорость в секундах, минутах?
	 * 
	 * @var integer
	 */
	public $speed = 2000;
	
	/**
	 * Интервал
	 * @var integer
	 */
	public $interval = 3000;

	public function __construct($cfg){
		SliderConfig::$instance = $this;

		if (empty($cfg)){ $cfg = array(); }

		if (isset($cfg['speed'])){
			$this->speed = intval($cfg['speed']);
		}

		if (isset($cfg['interval'])){
			$this->interval = intval($cfg['interval']);
		}
	}
}

/**
 * Элемент в слайдбаре (фотка, ссылка, описание)
 */
class SliderItem extends AbricosItem {
	
	/**
	 * Идентификатор картинки из менеджера файлов
	 * @var string
	 */
	public $image;
	
	/**
	 * Описание
	 * @var string
	 */
	public $title = '';
	
	/**
	 * Ссылка
	 * @var string
	 */
	public $url = '';
	
	/**
	 * Сортировка (чем больше, тем первее)
	 * @var integer
	 */
	public $order = 0;

	/**
	 * Инициализируем данные. Как правиль данные взяты из БД
	 * @param array $d
	 */
	public function __construct($d){
		parent::__construct($d);
		$this->image = strval($d['img']);
		$this->title = strval($d['tl']);
		$this->url = strval($d['tl']);
		$this->order = intval($d['ord']);
	}
	
	/**
	 * Преобразуем данные к упрощенному объекту для последующей конвертации в JSON 
	 * (этот процесс берет на себя ядро)
	 */
	public function ToAJAX(){
		$ret = parent::ToAJAX();
		$ret->img = $this->image;
		$ret->tl = $this->title;
		$ret->url = $this->url;
		$ret->ord = $this->order;
		return $ret;
	}	
}

/**
 * Список элементов слайдбара
 */
class SliderList extends AbricosList { }


?>