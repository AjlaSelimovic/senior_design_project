<?php

require_once __DIR__.'/BaseService.class.php';
require_once __DIR__.'/../dao/CourseRepository.class.php';

class CourseService extends BaseService{

    public function __construct(){
        parent::__construct(new CourseRepository());
    }

    public function get_all_courses(){
        Flight::json(Flight::courseRepository()->get_all_courses()); 
    }

    public function get_all_courses_types_lectures(){
        Flight::json(Flight::courseRepository()->get_all_courses_types_lectures()); 
    }

    public function create_course($data){
        Flight::json(parent::add_element($data)); 
    }

    public function delete_course($course_id){
        $existingCourse = Flight::courseRepository()->get_course_by_id($course_id);

        if(isset($existingCourse['id'])){
            parent::delete_element($course_id);
            Flight::json(["message"=>"Successfully deleted!"], 200);
        }
        else {
            Flight::json(["message"=>"That course doesn't exist."], 404);
        }
    }

    public function update_course($data, $course_id){
        $existingCourse = Flight::courseRepository()->get_course_by_id($course_id);

        if(isset($existingCourse['id'])){
            parent::update_element($course_id, $data);
            Flight::json(["message"=>"Successfully updated!"], 200);
        }
        else {
            Flight::json(["message"=>"That course doesn't exist."], 404);
        }
    }
}
?>
