<?php

require_once __DIR__.'/BaseRepository.class.php';

class LectureRepository extends BaseRepository{

    public function __construct(){
      parent::__construct("lectures");
    }

    public function get_lectures_by_type($type_id, $user_id){
      return $this->query("SELECT c.name AS course_name, t.name AS type_name, l.*, MAX(CASE WHEN uq.id IS NOT NULL THEN 1 ELSE 0 END) AS is_completed FROM lectures l JOIN types t ON l.type_id = t.id JOIN courses c ON t.course_id = c.id LEFT JOIN quizzes q ON q.lecutre_id = l.id LEFT JOIN user_quizzes uq ON uq.quiz_id = q.id AND uq.user_id = :user_id WHERE type_id = :type_id GROUP BY l.id, c.name, t.name", ['type_id' => $type_id, 'user_id' => $user_id]);
    }

    public function get_lecture_by_id($lecture_id){
      return $this->query_unique("SELECT * FROM lectures WHERE id = :id", ['id' => $lecture_id]);
    }
}
?>