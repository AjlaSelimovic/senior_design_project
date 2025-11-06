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
?>