<?php
require_once __DIR__.'/../Config.class.php';

  //Get lectures by course type id
  Flight::route('GET /lectures/@type_id', function($type_id){
    Flight::lectureService()->get_lectures_by_type($type_id);
  });
?>