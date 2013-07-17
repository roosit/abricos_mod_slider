<?php
/**

 */
$brick = Brick::$builder->brick;
$mod = Abricos::GetModule('slider');
$manager = $mod->GetManager();
$limit = $brick->param->param['count']; //берем из кирпича количество максимальных изображений в слайдере

$lst = "";

$rowslist = $manager->SliderList();
$rowsconf = $manager->SliderConfig();

$viewcount = 0;

while (($row = Abricos::$db->fetch_array($rowslist))){
	$viewcount++;

    $lst .= Brick::ReplaceVarByData($brick->param->var['row'], array(
		"filename" => $row['fln'],
		"filehash" => $row['flsh']
	));
}


$brick->param->var['result'] = $lst;
$brick->param->var['time'] = $rowsconf["time"];
$brick->param->var['speed'] = $rowsconf["speed"];
?>