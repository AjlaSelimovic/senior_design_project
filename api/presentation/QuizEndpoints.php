<?php
require_once __DIR__.'/../Config.class.php';

  //Get quiz by lecture
  Flight::route('GET /quizzes/@lecture_id', function($lecture_id){
    Flight::quizService()->get_quiz_by_lecture($lecture_id);
  });

  //Mark quiz as completed
  Flight::route('POST /quizzes/@quiz_id', function($quiz_id){
    Flight::quizService()->complete_quiz($quiz_id, Flight::get('validUser'));
  });

  //ADMIN
  //Create quiz
  Flight::route('POST /admin/quizzes', function(){
    $data = Flight::request()->data->getData();
    Flight::quizService()->create_quiz($data);
  });

  //Delete quiz
  Flight::route('DELETE /admin/quizzes/@quiz_id', function($quiz_id){
    Flight::quizService()->delete_quiz($quiz_id);
  });

  //Update quiz
  Flight::route('PUT /admin/quizzes/@quiz_id', function($quiz_id){
    $data = Flight::request()->data->getData();
    Flight::quizService()->update_quiz($quiz_id, $data);
  });
?>