<?php

require_once __DIR__.'/BaseRepository.class.php';

class CommentRepository extends BaseRepository{

    public function __construct(){
      parent::__construct("comments");
    }

    public function get_comments_by_lecture($lecture_id){
      return $this->query("SELECT c.id, c.content, c.created_at, u.id AS user_id, u.firstname, u.lastname FROM comments c JOIN users u ON c.user_id = u.id WHERE lecture_id = :id ORDER BY created_at DESC", ['id' => $lecture_id]);
    }

    public function get_comment_by_id($comment_id){
      return $this->query_unique("SELECT * FROM comments WHERE id = :id", ['id' => $comment_id]);
    }
}
?>