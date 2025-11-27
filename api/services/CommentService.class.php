<?php

require_once __DIR__.'/BaseService.class.php';
require_once __DIR__.'/../dao/CommentRepository.class.php';

class CommentService extends BaseService{

    public function __construct(){
        parent::__construct(new CommentRepository());
    }

    public function get_comments_by_lecture($lecture_id){
        $existingLecture = Flight::lectureRepository()->get_lecture_by_id($lecture_id);

        if(isset($existingLecture['id'])){
            Flight::json(Flight::commentRepository()->get_comments_by_lecture($lecture_id));
        }
        else {
            Flight::json(["message"=>"That lecture doesn't exist."], 404);
        }
    }

    public function add_comment($lecture_id, $user, $data){
        if(strlen($data['content']) == 0){
            return Flight::json(["message"=>"Comment can't be empty!"], 400);
        }

        $existingLecture = Flight::lectureRepository()->get_lecture_by_id($lecture_id);

        if(isset($existingLecture['id'])){
            $new_comment['lecture_id'] = $lecture_id;
            $new_comment['user_id'] = $user['id'];
            $new_comment['content'] = $data['content'];
            $new_comment['created_at'] = date("Y-m-d H:i:s");

            return Flight::json(parent::add_element($new_comment));
        }
        else {
            Flight::json(["message"=>"That lecture doesn't exist."], 404);
        }
    }

    public function delete_comment($comment_id, $user){
        $existingComment = Flight::commentRepository()->get_comment_by_id($comment_id);

        if(isset($existingComment['id'])){
            if($user['id'] == $existingComment['user_id']){
                parent::delete_element($comment_id);
            }
            else {
            Flight::json(["message"=>"That user can't delete this comment."], 400);
            }
        }
        else {
            Flight::json(["message"=>"That comment doesn't exist."], 404);
        }
    }
}
?>
