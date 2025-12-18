<?php

require_once __DIR__.'/BaseService.class.php';
require_once __DIR__.'/../dao/LectureRepository.class.php';

class LectureService extends BaseService{

    public function __construct(){
        parent::__construct(new LectureRepository());
    }

    public function get_lectures_by_type($type_id, $user){
        $existingType = Flight::typeRepository()->get_type_by_id($type_id);

        if(isset($existingType['id'])){
            Flight::json(Flight::lectureRepository()->get_lectures_by_type($type_id, $user['id']));
        }
        else {
            Flight::json(["message"=>"That type for the course doesn't exist."], 404);
        }
    }

    public function create_lecture($data){
        Flight::json(parent::add_element($data)); 
    }

    public function delete_lecture($lecture_id){
        $existingLecture = Flight::lectureRepository()->get_lecture_by_id($lecture_id);

        if(isset($existingLecture['id'])){
            parent::delete_element($lecture_id);
            Flight::json(["message"=>"Successfully deleted!"], 200);
        }
        else {
            Flight::json(["message"=>"That lecture doesn't exist."], 404);
        }
    }

    public function update_lecture($data, $lecture_id){
        $existingLecture = Flight::lectureRepository()->get_lecture_by_id($lecture_id);

        if(isset($existingLecture['id'])){
            parent::update_element($lecture_id, $data);
            Flight::json(["message"=>"Successfully updated!"], 200);
        }
        else {
            Flight::json(["message"=>"That lecture doesn't exist."], 404);
        }
    }
}
?>
