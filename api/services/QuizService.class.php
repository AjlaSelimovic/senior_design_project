<?php

require_once __DIR__.'/BaseService.class.php';
require_once __DIR__.'/../dao/QuizRepository.class.php';

class QuizService extends BaseService{

    public function __construct(){
        parent::__construct(new QuizRepository());
    }

    public function get_quiz_by_lecture($lecture_id){
        $existingLecture = Flight::lectureRepository()->get_lecture_by_id($lecture_id);

        if(isset($existingLecture['id'])){
            $rows = Flight::quizRepository()->get_quiz_by_lecture($lecture_id);

            if(empty($rows)){
                return Flight::json(["message" => "No quiz found for this lecture."], 404);
            };

            $quiz = [
                "id" => $rows[0]['id'],
                "name" => $rows[0]['name'],
                "questions" => []
            ];

            foreach ($rows as $row) {
                $questionId = $row['question_id'];

                if (!isset($quiz['questions'][$questionId])) {
                    $quiz['questions'][$questionId] = [
                        "id" => $row['question_id'],
                        "content" => $row['question_content'],
                        "answers" => []
                    ];
                }

                $quiz['questions'][$questionId]["answers"][] = [
                    "id" => $row['answer_id'],
                    "content" => $row['answer_content'],
                    "is_correct" => (bool)$row['is_correct']
                ];
            }

            $quiz['questions'] = array_values($quiz['questions']);

            return Flight::json($quiz);
        }
        else {
            Flight::json(["message"=>"That lecture doesn't exist."], 404);
        }
    }

    public function complete_quiz($quiz_id, $user){
        $existingQuiz = Flight::quizRepository()->get_quiz_by_id($quiz_id);

        if(isset($existingQuiz['id'])){
            $completed_quiz['user_id'] = $user['id'];
            $completed_quiz['quiz_id'] = $quiz_id;
            $completed_quiz['completed_at'] = date("Y-m-d H:i:s");

            return Flight::json(Flight::quizRepository()->complete_quiz($completed_quiz));
        }
        else {
            Flight::json(["message"=>"That quiz doesn't exist."], 404);
        }
    }

    public function create_quiz($data) {
        $quiz = [
            "name" => $data["name"],
            "lecture_id" => $data["lecture_id"]
        ];

        $created_quiz = $this->repository->insert_quiz($quiz);

        foreach ($data["questions"] as $question) {
            $created_question = $this->repository->insert_question([
                "content" => $question["content"],
                "quiz_id" => $created_quiz["id"]
            ]);

            foreach ($question["answers"] as $answer) {
                $this->repository->insert_answer([
                    "content" => $answer["content"],
                    "is_correct" => $answer["is_correct"],
                    "question_id" => $created_question["id"]
                ]);
            }
        }
        return Flight::json([
            "message" => "Quiz created",
            "quiz_id" => $created_quiz["id"]
        ]);
    }

    public function delete_quiz($quiz_id){
        $existingQuiz = Flight::quizRepository()->get_quiz_by_id($quiz_id);

        if(isset($existingQuiz['id'])){
            parent::delete_element($quiz_id);
            Flight::json(["message"=>"Successfully deleted!"], 200);
        }
        else {
            Flight::json(["message"=>"That quiz doesn't exist."], 404);
        }
    }

    public function update_quiz($quiz_id, $quiz_data) {
        $quiz = [
            "name" => $quiz_data["name"],
            "lecture_id" => $quiz_data["lecture_id"]
        ];

        $this->repository->update_quiz($quiz_id, $quiz);
        $this->repository->delete_questions_by_quiz($quiz_id);

        foreach ($quiz_data["questions"] as $question) {

            $created_question = $this->repository->insert_question([
                "content" => $question["content"],
                "quiz_id" => $quiz_id
            ]);

            foreach ($question["answers"] as $answer) {
                $this->repository->insert_answer([
                    "content" => $answer["content"],
                    "is_correct" => $answer["is_correct"],
                    "question_id" => $created_question["id"]
                ]);
            }
        }

        return Flight::json([
            "message" => "Quiz updated",
            "quiz_id" => $quiz_id
        ]);
    }
}
?>
