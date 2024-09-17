<?php

namespace App\Http\Controllers;

use App\Http\Resources\SurveyAnswerResource;
use App\Http\Resources\SurveyResourceDashboard;
use App\Models\Survey;
use App\Models\SurveyAnswer;
use App\Models\SurveyQuestion;
use App\Models\SurveyQuestionAnswer;

use Illuminate\Http\Request;



class DashboardController extends Controller
{
    public function index(Request $request){

        $user = $request->user();

        //total numbers of surveys
        $total = Survey::query()->where('user_id',$user->id)->count();

        //latest survey
        $latest= Survey::query()->where('user_id',$user->id)->latest('created_at')->first();

        //total numbers of answers
        $totalAnswers= SurveyAnswer::query()->join(
            'surveys','survey_answers.survey_id','=','surveys.id'
        )->where('survey_answers.survey_id',$user->id)
        ->count();


        $latestAnswers = SurveyAnswer::query()->join('surveys','survey_answers.survey_id','=','surveys.id')->where('surveys.user_id',$user->id)->orderBy('end_date','DESC')->limit(5)->getModels('survey_answers.*');
        return[
            'totalSurveys'=> $total,
            'latestSurvey'=> $latest ? new SurveyResourceDashboard($latest): null,
            'totalAnswers'=> $totalAnswers,
            'latestAnswers'=>SurveyAnswerResource::collection($latestAnswers),
        ];
    }

    public function showSurveyAnswers(Request $request){

        $user = $request->user();
        $surveyId = $request->route('id');

        //return SurveyAnswerResource::collection(SurveyAnswer::query()->join('surveys','survey_answers.survey_id','=','surveys.id')->where('surveys.user_id',$user->id)->get());

        $answers = SurveyAnswer::query()->join('survey_question_answers','survey_answers.id','=','survey_question_answers.survey_answer_id')->where('survey_id',$surveyId)->get(['survey_question_id','answer']);
        $questions = SurveyQuestion::query()->join('survey_question_answers','survey_questions.id','=','survey_question_answers.survey_question_id')->where('survey_id',$surveyId)->distinct()->get(['survey_question_id','question','type']);

        $surveyTitle = Survey::where('id',$surveyId)->first('title');
        $ans = [];
        
       foreach( $answers as $answer ){
            $questionType = SurveyQuestion::where('id',$answer['survey_question_id'])->first('type');
            if (   $questionType['type'] == 'evaluation'){
                $count = SurveyQuestionAnswer::where('survey_question_id',$answer['survey_question_id'])->avg('answer');

                $ans[$answer['survey_question_id']] = $count;
            }else{
                $count = SurveyQuestionAnswer::where([['answer',$answer['answer']],['survey_question_id',$answer['survey_question_id']]])->count();

                $ans[$answer['survey_question_id']][$answer['answer']] = $count;
            }
            
       }
       
       $response = [];

      
       return [
            'answers'=>$answers
       ];


        // $questions = SurveyQuestion::where('survey_id',$surveyId)->get(['id','type','question']);

        // $answersDistinct = [];

        // foreach ( $questions as $question ){
        //     $answersDistinct[$question['id']] =  SurveyQuestionAnswer::where('survey_question_id',$question['id'])->distinct()->get(['answer']);
        // }



        // foreach( $answers as $answer ){

        //     foreach($questions as $question ){
        //         if ( $question['id'] == $answer['survey_question_id']){
        //             $answer['type'] = $question['type'];
        //             $answer['question'] = $question['question'];
        //         }
        //     }
        // }
        // $answersFinal = [];
        // $a = [];

        // foreach ( $answers as $answer ){
        //     $answersFinal[$answer['survey_question_id']]['question_type']= $answer['type'];
        //     $answersFinal[$answer['survey_question_id']]['survey_title']=  $surveyTitle;
        //     $answersFinal[$answer['survey_question_id']]['question_id']=  $answer['survey_question_id'];

        //     if ( $answersFinal[$answer['survey_question_id']]['question_type'] == 'evaluation'){
        //         $answersFinal[$answer['survey_question_id']]['answers'][]=(int)$answer['answer'];

        //         $answersFinal[$answer['survey_question_id']]['answer_avg'] = array_sum($answersFinal[$answer['survey_question_id']]['answers']) / count($answersFinal[$answer['survey_question_id']]['answers']);
        //     }

        //     if ( $answersFinal[$answer['survey_question_id']]['question_type'] == 'select' ||  $answersFinal[$answer['survey_question_id']]['question_type'] == 'checkbox' ||  $answersFinal[$answer['survey_question_id']]['question_type'] == 'radio'){

        //         if(!array_key_exists($answer['survey_question_id'],$values)){
        //             $values[$answer['survey_question_id']][] = $answer['answer'];

        //         }else if ( !in_array($answer['answer'],$values[$answer['survey_question_id']])){
        //             $values[$answer['survey_question_id']][] = $answer['answer'];

        //         }

        //         $answersFinal[$answer['survey_question_id']]['answers'][]= $answer['answer'];

        //     }else if($answersFinal[$answer['survey_question_id']]['question_type'] == 'text' ||  $answersFinal[$answer['survey_question_id']]['question_type'] == 'textarea'){
        //         $answersFinal[$answer['survey_question_id']]['answers'][]=$answer['answer'];

        //         if(!array_key_exists($answer['survey_question_id'],$values)){
        //             $values[$answer['survey_question_id']][] = $answer['answer'];

        //         }else if ( !in_array($answer['answer'],$values[$answer['survey_question_id']])){
        //             $values[$answer['survey_question_id']][] = $answer['answer'];

        //         }

        //     }

        //     $answersFinal[$answer['survey_question_id']]['question']= $answer['question'];

        // }
        // $v = [];

        // foreach( $answersFinal as $answer ){

        //     for( $i = 0; $i < count($values[$answer['question_id']]); $i++){
        //         // $answersFinal[$ind]['values'] = $val;

        //             $br = 0;
        //             foreach( $answer['answers'] as $a ){
        //                 if( $values[$answer['question_id']][$i] === $a){
        //                     $br++;
        //                     $values[$answer['question_id']][$i] = $br ;
        //                     if ( (!array_key_exists($answer['question_id'],$v))){
        //                         if (!array_key_exists($answer['question_id'][$a],$v )){
        //                             $v[$answer['question_id']][$a][]= $br;

        //                         }
        //                     }else{
        //                         $h = $v[$a];
        //                         $v[$answer['question_id']][$a] = $h + 1;
        //                     }
        //                 }
        //             }
        //         }
            

        // }
        // return $v;

        //foreach( $answersFinal as $answer ){

        //     for( $j = 0; $j < count( $answer['answers']); $j++ ){
        //         $br = 1;
        //         foreach( $answersDistinct as $answerDistinct ){
        //             if ( $answer['answers'][$j] == $answerDistinct){
        //                 $answersDistinct[$answerDistinct] += br;
        //             }

        //         }
        //     }


        // }
        // return $answersDistinct;
        // foreach( $answersFinal as $ind => $ans){
        //     $a[]= $ans;

        // }

        // return
        //     $a
        // ;


    // }
       }

    public function showSurveyQuestions(Request $request){

        $user = $request->user();
        $surveyId = $request->route('id');

        $questions = SurveyQuestion::where('survey_id',$surveyId)->get();

        return[
            'questions'=> $questions
        ];

    }

}
