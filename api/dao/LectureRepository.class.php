<?php

require_once __DIR__.'/BaseRepository.class.php';

class LectureRepository extends BaseRepository{

    public function __construct(){
      parent::__construct("lectures");
    }

    //TODO: Join user quizes table to track completed lectures
    public function get_lectures_by_type($type_id){
      return $this->query("SELECT c.name AS course_name, t.name AS type_name, l.* FROM lectures l JOIN types t ON l.type_id = t.id JOIN courses c ON t.course_id = c.id WHERE type_id = :id", ['id' => $type_id]);
    }
}
?>