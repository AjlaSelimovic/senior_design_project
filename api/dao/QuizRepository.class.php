<?php

require_once __DIR__.'/BaseRepository.class.php';

class QuizRepository extends BaseRepository{

    public function __construct(){
      parent::__construct("quizzes");
    }

    public function get_quiz_by_lecture($lecture_id){
      return $this->query("SELECT q.id, q.name, qq.id AS question_id, qq.content AS question_content, qa.id AS answer_id, qa.content AS answer_content, qa.is_correct FROM quizzes q JOIN quiz_questions qq ON q.id = qq.quiz_id JOIN question_answers qa ON qq.id = qa.question_id WHERE q.lecutre_id = :id", ['id' => $lecture_id]);
    }

    public function get_quiz_by_id($quiz_id){
      return $this->query_unique("SELECT * FROM quizzes WHERE id = :id", ['id' => $quiz_id]);
    }

    public function complete_quiz($completed_quiz){
      return $this->query("INSERT INTO user_quizzes (user_id, quiz_id, completed_at) VALUES (:user_id, :quiz_id, :completed_at)", ['user_id' => $completed_quiz['user_id'], 'quiz_id' => $completed_quiz['quiz_id'], 'completed_at' => $completed_quiz['completed_at']]);
    }
}
?>