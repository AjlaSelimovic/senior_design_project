<?php

require_once __DIR__.'/BaseRepository.class.php';

class UserRepository extends BaseRepository{

    public function __construct(){
      parent::__construct("users");
    }

    public function get_user_by_email($email){
      return $this->query_unique("SELECT u.id, u.firstname, u.lastname, u.email, u.dateofbirth, u.password, r.id AS role_id, r.name AS role_name FROM users u JOIN roles r ON u.role_id = r.id WHERE email = :email", ['email' => $email]);
    }

    public function get_user_by_id($user_id){
      return $this->query_unique("SELECT u.id, u.firstname, u.lastname, u.email, u.dateofbirth, u.password, r.id AS role_id, r.name AS role_name FROM users u JOIN roles r ON u.role_id = r.id WHERE u.id = :id", ['id' => $user_id]);
    }

    public function get_user_profile($user_id){
      return $this->query("SELECT u.firstname, u.lastname, u.email, u.dateofbirth, CONCAT(c.name, ' - ', t.name) as course_type, ROUND(
             (
                  COUNT(DISTINCT l.id)
                  /
                 (SELECT COUNT(*) 
                  FROM lectures l2 
                  WHERE l2.type_id = t.id)
              ) * 100
          , 2) AS completion_percentage  FROM users u
      LEFT JOIN  user_quizzes uq ON u.id = uq.user_id
      LEFT JOIN quizzes q ON uq.quiz_id = q.lecutre_id
      LEFT JOIN lectures l ON q.lecutre_id = l.id
      LEFT JOIN types t ON l.type_id = t.id
      LEFT JOIN courses c ON t.course_id = c.id
      WHERE u.id = :id
      GROUP BY u.id, t.id;", ['id' => $user_id]);
    }

    public function get_all_users(){
      return $this->query_without_params("SELECT u.id, u.firstname, u.lastname, u.email, u.dateofbirth, r.id AS role_id, r.name AS role_name FROM users u JOIN roles r ON u.role_id = r.id");
    }
}
?>