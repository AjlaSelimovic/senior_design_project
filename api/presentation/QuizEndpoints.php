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
?>