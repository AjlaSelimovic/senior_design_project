<?php
require_once __DIR__.'/../Config.class.php';

  //Get all courses
  Flight::route('GET /courses', function(){
    Flight::courseService()->get_all_courses();
  });
?>