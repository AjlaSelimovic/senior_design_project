<?php

require_once __DIR__.'/BaseRepository.class.php';

class UserRepository extends BaseRepository{

    public function __construct(){
      parent::__construct("users");
    }

    public function get_user_by_email($email){
      return $this->query_unique("SELECT * FROM users WHERE email = :email", ['email' => $email]);
    }
}
?>