<?php
require_once __DIR__.'/../Config.class.php';

  //Get types by course
  Flight::route('GET /types/@course_id', function($course_id){
    Flight::typeService()->get_types_by_course($course_id);
  });
?>