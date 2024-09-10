<?php

namespace App\Http\Controllers;

use App\Http\Resources\SurveyAnswerResource;
use App\Http\Resources\SurveyResourceDashboard;
use App\Models\Survey;
use App\Models\SurveyAnswer;
use App\Models\SurveyQuestion;
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

        // return SurveyAnswerResource::collection(SurveyAnswer::query()->join('surveys','survey_answers.survey_id','=','surveys.id')->where('surveys.user_id',$user->id)->get());

        $answers = SurveyAnswer::query()->join('survey_question_answers','survey_answers.id','=','survey_question_answers.survey_answer_id')->where('survey_id',$surveyId)->get(['survey_question_id','survey_answer_id','answer']);

        $questions = SurveyQuestion::where('survey_id',$surveyId)->get(['id','type','question']);
        foreach( $answers as $answer ){
            foreach($questions as $question ){
                if ( $question['id'] == $answer['survey_question_id']){
                    $answer['type'] = $question['type'];
                    $answer['question'] = $question['question'];
                }
            }
        }
        return[
            'answers'=>$answers,
        ];


    }
}
