<?php
require_once __DIR__.'/../Config.class.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

  //Register
  Flight::route('POST /users/register', function(){
    $data = Flight::request()->data->getData();
    Flight::userService()->register($data);
  });

  //Login
  Flight::route('POST /users/login', function(){
    $data = Flight::request()->data->getData();
    Flight::userService()->login($data);
  });

  //Get user profile
  Flight::route('GET /users/profile', function(){
    Flight::userService()->get_user_profile(Flight::get('validUser'));
  });

  //Update user profile
  Flight::route('PUT /users/profile', function(){
    $data = Flight::request()->data->getData();
    Flight::userService()->update_user_profile(Flight::get('validUser'), $data);
  });


  //ADMIN
  //Get all users
  Flight::route('GET /admin/users', function(){
    Flight::userService()->get_all_users();
  });

  //Delete user
  Flight::route('DELETE /admin/users/@user_id', function($user_id){
    Flight::userService()->delete_user($user_id);
  });

  //Promote user
  Flight::route('PUT /admin/users/@user_id/promote', function($user_id){
    Flight::userService()->promote_user($user_id);
  });

  //Demote user
  Flight::route('PUT /admin/users/@user_id/demote', function($user_id){
    Flight::userService()->demote_user($user_id);
  });
?>