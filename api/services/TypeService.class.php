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

    public function create_type($data){
        Flight::json(parent::add_element($data)); 
    }

    public function delete_type($type_id){
        $existingType = Flight::typeRepository()->get_type_by_id($type_id);

        if(isset($existingType['id'])){
            parent::delete_element($type_id);
            Flight::json(["message"=>"Successfully deleted!"], 200);
        }
        else {
            Flight::json(["message"=>"That type doesn't exist."], 404);
        }
    }

    public function update_type($data, $type_id){
        $existingType = Flight::typeRepository()->get_type_by_id($type_id);

        if(isset($existingType['id'])){
            parent::update_element($type_id, $data);
            Flight::json(["message"=>"Successfully updated!"], 200);
        }
        else {
            Flight::json(["message"=>"That type doesn't exist."], 404);
        }
    }
}
?>
