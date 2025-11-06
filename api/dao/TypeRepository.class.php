<?php

require_once __DIR__.'/BaseRepository.class.php';

class TypeRepository extends BaseRepository{

    public function __construct(){
      parent::__construct("types");
    }

    public function get_types_by_course($course_id){
      return $this->query("SELECT c.name AS course_name ,t.* FROM types t JOIN courses c ON t.course_id = c.id WHERE course_id = :id", ['id' => $course_id]);
    }

    public function get_type_by_id($type_id){
      return $this->query_unique("SELECT * FROM types WHERE id = :id", ['id' => $type_id]);
    }
}
?>