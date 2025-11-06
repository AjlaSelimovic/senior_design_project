<?php

require_once __DIR__.'/BaseService.class.php';
require_once __DIR__.'/../dao/TypeRepository.class.php';

class TypeService extends BaseService{

    public function __construct(){
        parent::__construct(new TypeRepository());
    }

    public function get_types_by_course($course_id){
        $existingCourse = Flight::courseRepository()->get_course_by_id($course_id);

        if(isset($existingCourse['id'])){
            Flight::json(Flight::typeRepository()->get_types_by_course($course_id));
        }
        else {
            Flight::json(["message"=>"That course doesn't exist."], 404);
        }
    }
}
?>
