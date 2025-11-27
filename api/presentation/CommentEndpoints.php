<?php
require_once __DIR__.'/../Config.class.php';

  //Get all comments by lecture ID
  Flight::route('GET /comments/@lecture_id', function($lecture_id){
    Flight::commentService()->get_comments_by_lecture($lecture_id);
  });

  //Add comment
  Flight::route('POST /comments/@lecture_id', function($lecture_id){
    $data = Flight::request()->data->getData();
    Flight::commentService()->add_comment($lecture_id, Flight::get('validUser'), $data);
  });

  //Delete comment
  Flight::route('DELETE /comments/@comment_id', function($comment_id){
    Flight::commentService()->delete_comment($comment_id, Flight::get('validUser'));
  });
?>