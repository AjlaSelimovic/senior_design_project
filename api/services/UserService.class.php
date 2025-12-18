<?php

require_once __DIR__.'/BaseService.class.php';
require_once __DIR__.'/../dao/UserRepository.class.php';
require_once __DIR__.'/../dao/RoleRepository.class.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class UserService extends BaseService{

    protected $roleRepository;

    public function __construct(){
        parent::__construct(new UserRepository());
        $this->roleRepository = new RoleRepository();
    }
    
    public function register($data){
        $existingUser = $this->repository->get_user_by_email($data['email']);

        if(isset($existingUser['id'])){
            Flight::json(["message"=>"User with that email already exists. Try different email."], 400);
        }else{
            $userRole = $this->roleRepository->get_role_by_name("User");
            $data['role_id'] = $userRole['id'];
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

    public function get_user_profile($user){
        $existingUser = $this->repository->get_user_by_id($user['id']);
    
        if(isset($existingUser['id'])){
            Flight::json(Flight::userRepository()->get_user_profile($user['id']));
        }else{
            Flight::json(["message"=>"User doesn't exist"], 404);
        }
    }

    public function update_user_profile($user, $data){
        $existingUser = $this->repository->get_user_by_id($user['id']);
    
        if(isset($existingUser['id'])){
            Flight::json(parent::update_element($user['id'], $data));
        }else{
            Flight::json(["message"=>"User doesn't exist"], 404);
        }
    }

    public function get_all_users(){
        Flight::json(Flight::userRepository()->get_all_users());
    }

    public function delete_user($user_id){
        $loggedUser = Flight::get('validUser');
        $existingUser = $this->repository->get_user_by_id($user_id);

        if(isset($existingUser['id'])){
            $loggedRole = $loggedUser['role_name']; 
            $targetRole = $existingUser['role_name']; 

            if ($loggedRole == 'Admin') {
                if ($targetRole == 'Admin' || $targetRole == 'Head Admin') {
                    Flight::json(["message" => "Admins cannot delete other admins or head admins"], 403);
                    return;
                }
            }

            if ($loggedRole == 'Head Admin') {
                if ($targetRole == 'Head Admin') {
                    Flight::json(["message" => "Head Admin cannot delete other Head Admins"], 403);
                    return;
                }
            }

            Flight::json(parent::delete_element($user_id));
        }
        else {
            Flight::json(["message"=>"User doesn't exist"], 404);
        }
    }

    public function promote_user($user_id){
        $loggedUser = Flight::get('validUser');
        $existingUser = $this->repository->get_user_by_id($user_id);

        if(isset($existingUser['id'])){
            $loggedRole = $loggedUser['role_name']; 
            $targetRole = $existingUser['role_name']; 

            if ($loggedRole !== "Head Admin") {
                Flight::json(["message" => "Only Head Admin can promote users"], 403);
                return;
            }

            if ($targetRole === "Admin" || $targetRole === "Head Admin") {
                Flight::json(["message" => "You cannot promote Admins or Head Admins"], 403);
                return;
            }

            $adminRole = $this->roleRepository->get_role_by_name("Admin");

            parent::update_element($user_id, [
                "role_id" => $adminRole["id"]
            ]);

            Flight::json(["message" => "User promoted to Admin successfully"]);
        }
        else {
            Flight::json(["message"=>"User doesn't exist"], 404);
        }
    }

    public function demote_user($user_id){
        $loggedUser = Flight::get('validUser');
        $existingUser = $this->repository->get_user_by_id($user_id);

        if(isset($existingUser['id'])){
            $loggedRole = $loggedUser['role_name']; 
            $targetRole = $existingUser['role_name']; 

            if ($loggedRole !== "Head Admin") {
                Flight::json(["message" => "Only Head Admin can demote users"], 403);
                return;
            }

            if ($targetRole === "User") {
                Flight::json(["message" => "You cannot demote a regular user"], 403);
                return;
            }

            if ($targetRole === "Head Admin") {
                Flight::json(["message" => "You cannot demote a Head Admin"], 403);
                return;
            }

            $userRole = $this->roleRepository->get_role_by_name("User");

            parent::update_element($user_id, [
                "role_id" => $userRole["id"]
            ]);

            Flight::json(["message" => "Admin demoted to User successfully"]);
        }
        else {
            Flight::json(["message"=>"User doesn't exist"], 404);
        }
        
    }
}
?>
