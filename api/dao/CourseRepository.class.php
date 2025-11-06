<?php

require_once __DIR__.'/BaseRepository.class.php';

class CourseRepository extends BaseRepository{

    public function __construct(){
      parent::__construct("courses");
    }

    public function get_all_courses(){
      return $this->query_without_params("SELECT * FROM courses");
    }

    public function get_course_by_id($course_id){
      return $this->query_unique("SELECT * FROM courses WHERE id = :id", ['id' => $course_id]);
    }
}
?>