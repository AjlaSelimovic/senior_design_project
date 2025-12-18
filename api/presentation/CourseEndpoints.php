<?php
require_once __DIR__.'/../Config.class.php';

  //Get all courses
  Flight::route('GET /courses', function(){
    Flight::courseService()->get_all_courses();
  });

  //ADMIN
  //Get all courses with types and lectures
  Flight::route('GET /admin/courses', function(){
    Flight::courseService()->get_all_courses_types_lectures();
  });

  //Create course
  Flight::route('POST /admin/courses', function(){
    $data = Flight::request()->data->getData();
    Flight::courseService()->create_course($data);
  });

  //Delete course
  Flight::route('DELETE /admin/courses/@course_id', function($course_id){
    Flight::courseService()->delete_course($course_id);
  });

  //Update course
  Flight::route('PUT /admin/courses/@course_id', function($course_id){
    $data = Flight::request()->data->getData();
    Flight::courseService()->update_course($data, $course_id);
  });
?>