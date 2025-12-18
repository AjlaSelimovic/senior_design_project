<?php
require_once __DIR__.'/../Config.class.php';

  //Get lectures by course type id
  Flight::route('GET /lectures/@type_id', function($type_id){
    Flight::lectureService()->get_lectures_by_type($type_id, Flight::get('validUser'));
  });

  //ADMIN
  //Create lecture
  Flight::route('POST /admin/lectures', function(){
    $data = Flight::request()->data->getData();
    Flight::lectureService()->create_lecture($data);
  });

  //Delete lecture
  Flight::route('DELETE /admin/lectures/@lecture_id', function($lecture_id){
    Flight::lectureService()->delete_lecture($lecture_id);
  });

  //Update lecture
  Flight::route('PUT /admin/lectures/@lecture_id', function($lecture_id){
    $data = Flight::request()->data->getData();
    Flight::lectureService()->update_lecture($data, $lecture_id);
  });
?>