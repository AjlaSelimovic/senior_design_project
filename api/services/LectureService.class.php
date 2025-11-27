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
}
?>
