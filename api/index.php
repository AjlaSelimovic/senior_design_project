<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

require_once __DIR__.'/vendor/autoload.php';
require_once __DIR__.'/services/UserService.class.php';
require_once __DIR__.'/dao/UserRepository.class.php';
require_once __DIR__.'/services/CourseService.class.php';
require_once __DIR__.'/dao/CourseRepository.class.php';
require_once __DIR__.'/services/TypeService.class.php';
require_once __DIR__.'/dao/TypeRepository.class.php';
require_once __DIR__.'/services/LectureService.class.php';
require_once __DIR__.'/dao/LectureRepository.class.php';

Flight::register('userRepository','UserRepository');
Flight::register('userService', 'UserService');
Flight::register('courseRepository','CourseRepository');
Flight::register('courseService', 'CourseService');
Flight::register('typeRepository','TypeRepository');
Flight::register('typeService', 'TypeService');
Flight::register('lectureRepository','LectureRepository');
Flight::register('lectureService', 'LectureService');

//Middleware
Flight::route('/*', function(){
    $path = Flight::request()->url;
    if($path == '/users/login' || $path == '/users/register'){
        return TRUE;
    }
    $headers = getallheaders();
    if(@!$headers['Authorization']){
        Flight::json(["message" => "Unauthorized access"], 403);
        return FALSE;
    }else{
        try {
            $decoded = (array)JWT::decode($headers['Authorization'], new Key(Config::JWT_SECRET(), 'HS256'));
            Flight::set('validUser', $decoded);
            return TRUE;
        } catch (\Exception $e) {
            Flight::json(["message" => "Token authorization invalid"], 403);
            return FALSE;
        }
    }
});

require_once __DIR__.'/presentation/UserEndpoints.php';
require_once __DIR__.'/presentation/CourseEndpoints.php';
require_once __DIR__.'/presentation/TypeEndpoints.php';
require_once __DIR__.'/presentation/LectureEndpoints.php';

Flight::start();
?>