<?php

require_once __DIR__.'/BaseService.class.php';
require_once __DIR__.'/../dao/UserRepository.class.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class UserService extends BaseService{

    public function __construct(){
        parent::__construct(new UserRepository());
    }
    
    public function register($data){
        $existingUser = $this->repository->get_user_by_email($data['email']);

        if(isset($existingUser['id'])){
            Flight::json(["message"=>"User with that email already exists. Try different email."], 400);
        }else{
            //Default User Role
            //TODO : make sure to pull the exact id from the database
            $data['role_id'] = 1;
            Flight::json(Flight::userService()->add_element($data));
        }
    }

    public function login($data){
        $existingUser = $this->repository->get_user_by_email($data['email']);
    
        if(isset($existingUser['id'])){
            if($existingUser['password'] == $data['password']){
                unset($existingUser['password']);
                $jwt = JWT::encode($existingUser, Config::JWT_SECRET(), 'HS256');
                Flight::json(['token' => $jwt]);
            }else{
                Flight::json(["message"=>"Password is incorrect"], 404);
            }
        }else{
            Flight::json(["message"=>"User with that email doesn't exist"], 404);
        }
    }
}
?>
