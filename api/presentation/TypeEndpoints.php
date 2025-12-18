<?php
require_once __DIR__.'/../Config.class.php';

  //Get types by course
  Flight::route('GET /types/@course_id', function($course_id){
    Flight::typeService()->get_types_by_course($course_id);
  });

  //ADMIN
  //Create type
  Flight::route('POST /admin/types', function(){
    $data = Flight::request()->data->getData();
    Flight::typeService()->create_type($data);
  });

  //Delete type
  Flight::route('DELETE /admin/types/@type_id', function($type_id){
    Flight::typeService()->delete_type($type_id);
  });

  //Update type
  Flight::route('PUT /admin/types/@type_id', function($type_id){
    $data = Flight::request()->data->getData();
    Flight::typeService()->update_type($data, $type_id);
  });
?>