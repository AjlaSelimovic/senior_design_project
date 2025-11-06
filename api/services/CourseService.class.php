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
}
?>
