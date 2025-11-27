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
}
?>
