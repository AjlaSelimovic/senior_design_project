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

    public function insert_quiz($quiz) {
      $this->query(
          "INSERT INTO quizzes (name, lecutre_id) VALUES (:name, :lecutre_id)",
          [
              "name" => $quiz["name"],
              "lecutre_id" => $quiz["lecture_id"]
          ]
      );

      $quiz["id"] = $this->conn->lastInsertId();
      return $quiz;
    }

    public function insert_question($question) {
      $this->query(
          "INSERT INTO quiz_questions (content, quiz_id) VALUES (:content, :quiz_id)",
          [
              "content" => $question["content"],
              "quiz_id" => $question["quiz_id"]
          ]
      );

      $question["id"] = $this->conn->lastInsertId();
      return $question;
    }

    public function insert_answer($answer) {
      $this->query(
          "INSERT INTO question_answers (content, is_correct, question_id)
          VALUES (:content, :is_correct, :question_id)",
          [
              "content" => $answer["content"],
              "is_correct" => $answer["is_correct"],
              "question_id" => $answer["question_id"]
          ]
      );

      return true;
    }

    public function update_quiz($quiz_id, $quiz) {
      $this->query(
          "UPDATE quizzes SET name = :name, lecutre_id = :lecutre_id WHERE id = :id",
          [
              "name" => $quiz["name"],
              "lecutre_id" => $quiz["lecture_id"],
              "id" => $quiz_id
          ]
      );
    }

    public function delete_questions_by_quiz($quiz_id) {
      $this->query(
          "DELETE qa FROM question_answers qa
          JOIN quiz_questions qq ON qa.question_id = qq.id
          WHERE qq.quiz_id = :quiz_id",
          ["quiz_id" => $quiz_id]
      );

      $this->query(
          "DELETE FROM quiz_questions WHERE quiz_id = :quiz_id",
          ["quiz_id" => $quiz_id]
      );
    }
}
?>