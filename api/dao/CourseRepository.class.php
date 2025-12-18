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

    public function get_all_courses_types_lectures(){
      return $this->query_without_params("SELECT c.id AS course_id, c.name AS course_name, c.abbreviation AS course_abbreviation, c.description AS course_description, t.id AS type_id, t.name AS type_name, t.description AS type_description, l.id AS lecture_id, l.name AS lecture_name, l.description AS lecture_description, l.difficulty AS lecture_difficulty, l.video_url AS lecture_video_url FROM courses c
        JOIN types t ON c.id = t.course_id
        JOIN lectures l ON t.id = l.type_id");
    }
}
?>