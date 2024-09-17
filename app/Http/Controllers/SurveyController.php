<?php

namespace App\Http\Controllers;

use App\Enums\QuestionTypeEnum;
use App\Http\Requests\StoreSurveyAnswerRequest;
use App\Http\Resources\SurveyResource;
use App\Models\Survey;
use App\Http\Requests\SurveyStoreRequest;
use App\Http\Requests\SurveyUpdateRequest;
use App\Models\SurveyAnswer;
use App\Models\SurveyQuestion;
use App\Models\SurveyQuestionAnswer;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum;
use Symfony\Component\HttpFoundation\Request;

class SurveyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        //return all surveys that bellong to $user->id
        // return SurveyResource::collection
        // (
        //     Survey::where('user_id',$user->id)->orderBy('created_at','desc')->paginate(10)
        // );
        return SurveyResource::collection(
            Survey::where('user_id', $user->id )
            ->orderBy('created_at','desc')
            ->paginate(10)
        );
        // $surveys = Survey::where('user_id',$user->id)->orderBy('created_at','desc')->paginate(10);
        // return $surveys;
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(SurveyStoreRequest $request)
    {
       
        $data = $request->validated();
        
        $survey = new Survey;
        $survey->title = ($request->title);
        if ( isset($data['image'])){
            $relativePath = $this ->saveImage($data['image']);
            $survey->image = $relativePath;

        }
        $survey->description = ($data['description']);
        $survey->expire_date = ($data['expire_date']);
        $survey->user_id = ($data['user_id']);
        $survey->status = ($data['status']);
        $survey->slug =  ($data['slug']);
        $survey->save();
        

        foreach($data['questions'] as $question){
            $question['survey_id'] = $survey->id;
            $this->createQuestion($question);
        }


        
        // $survey = Survey::create($data);

        
        return new SurveyResource($survey);
    }

    /**
     * Display the specified resource.
     */
    public function show(Survey $survey, Request $request)
    {
        $user = $request -> user();
        //checking if the survey belongs to the auth user
        if ( $user-> id !== $survey -> user_id){
            return abort(403,'Unauthorized action');
        }
        return new SurveyResource($survey);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(SurveyUpdateRequest $request, Survey $survey)
    {
        $data = $request->validated();
        //check if the image was given and save on local file sistem
        if ( isset($data['image'])){
            $relativePath = $this -> saveImage($data['image']);
            $data['image'] = $relativePath;

            //if there is an old image delete it
            if ( $survey -> image){
                //if exists call the app path and delete it from storage
                $apsolutePath =  public_path($survey->image);
                File::delete($apsolutePath);
            }
        }

        $survey->update($data);

        //get ids as plain array of existing questions
        $existingIds = $survey->questions()->pluck('id')->toArray();

        //Get ids as plain array of new questions coming from the array
        $newIds = Arr::pluck($data['questions'],'id');

        //find questions to delite
        $toDelete = array_diff($existingIds, $newIds);

        //find quest to add
        $toAdd = array_diff($newIds, $existingIds);

        //Delite quests 
        SurveyQuestion::destroy($toDelete);

        //add Quests
        foreach($data['questions'] as $question){
            if ( in_array($question['id'], $toAdd)){
                $question['survey_id'] = $survey->id;
                $this-> createQuestion($question);
            }
        }
        //Updating existing questions
        //take data quests and converte it into a collection
        //and then index it by id
        //so it will be an assoc array where the key will be the question id
        $questionMap = collect($data['questions'])->keyBy('id');
        //then start itterate it through quests of this survey 
        // check if the qustion->id exists in $questionMap if it does update it;

        foreach( $survey-> questions as $question ){
            //if index exists in questionMap
            if ( isset($questionMap[$question->id])){
                $this->updateQuestion($question, $questionMap[$question->id]);
            }
        }


        //return survey resource with the given model
       return new SurveyResource($survey);

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Survey $survey, Request $request)
    {
        $user = $request->user();
        if ( $user-> id !== $survey->user_id){
            return abort( 403, "Unauthorized action");

        }
        $survey->delete();

        if ($survey->image){
            $apsolutePath = public_path($survey->image);
            File::delete($apsolutePath);
        }
        return response('',204);
    }


    //**Save image in local file sistem and return save image path
    //** */

    //check if the image is valid base 64string
    private function saveImage($image){
        if (preg_match('/^data:image\/(\w+);base64,/', $image, $type)){
            //take out base64 encoded text without mime type
            //taking everithing after the last coma
            $image = substr($image, strpos($image, ',') + 1);

            //Get file extension
            $type = strtolower($type[1]);

            //check if the file is an image
            if (!in_array($type,['jpg','png','gif','png','jpeg'])){
                throw new \Exeption('invalid image format');
            }

            //if there is a space replace it with +
            $image = str_replace(' ','+',$image);
            $image= base64_decode($image);

            //if decode fale for some reason
            if ($image === false){
                throw new \Exeption('base64_decode failed');

            }

        }else{
            //if the preg match didnt work
            throw new \Exeption('did not match data URI with image data');
        }
        $dir = 'images/';
        $file = Str::random(). '.' .$type;
        $apsolutePath = public_path($dir);
        $relativePath = $dir . $file;

        if ( !File::exists($apsolutePath)){
            File::makeDirectory($apsolutePath,077, true);
        }
        file_put_contents($relativePath, $image);

        return $relativePath;
    }

    private function createQuestion($question){

        if ( is_array($question['data'])){
            //it will be an object coming from the frontend so we need to json_encode it and save it as a string in the database
            $validator = Validator::make($question,[
                'question'=> 'required|string',
                'type' => ['required', Rule::in(['text', 'textarea','select','radio','checkbox','evaluation'])],
                'description' => 'nullable|string',
                'data.options.*.text'=>'required|string|min:1',
                'survey_id'=>'required|exists:App\Models\Survey,id'
            ]);
            if($validator->passes()){
                $question['data'] = json_encode($question['data']);
                $validator = Validator::make($question,[
                    'question'=> 'required|string',
                    'type' => ['required', Rule::in(['text', 'textarea','select','radio','checkbox','evaluation'])],
                    'description' => 'nullable|string',
                    'data'=>'present',
                    'survey_id'=>'required|exists:App\Models\Survey,id'
                ]);
            
            }else{
                Survey::where('id', $question['survey_id'])->delete();

            }


        }
            
        
        
        


        return SurveyQuestion::create($validator->validate());
    }

    private function updateQuestion(SurveyQuestion $question, $data){
        if (is_array($data['data'])){
           //if its array it means it came as an object checkbox or select, returns a string
           $validator = Validator::make($data,[
            'question'=> 'required|string',
            'type' => ['required', Rule::in(['text', 'textarea','select','radio','checkbox','evaluation'])],
            'description' => 'nullable|string',
            'data.options.*.text'=>'required|string|min:1',
        ]);
        if($validator->passes()){
            $data['data'] = json_encode($data['data']);
            $validator = Validator::make($data,[
                'question'=> 'required|string',
                'type' => ['required', Rule::in(['text', 'textarea','select','radio','checkbox','evaluation'])],
                'description' => 'nullable|string',
                'data'=>'present',
            ]);
        
        }
    }

        return $question->update($validator->validate());
    }
   
    public function getBySlug(Request $request){
        $survey = Survey::where('slug',$request->slug)->first();

        if( !$survey->status){
            return response("",404);
        }

        $currentDate = new \DateTime();
        $expireDate = new \DateTime($survey->expire_date);
        if ( $currentDate > $expireDate){
            return response("",404);
        }
        return new SurveyResource($survey);

    }
    

    public function storeAnswer(StoreSurveyAnswerRequest $request, Survey $survey){
        $validated = $request->validated();

        $surveyAnswer = SurveyAnswer::create([
            'survey_id'=>$survey->id,
            'start_date'=> date('Y-m-d H-i-s'),
            'end_date'=> date('Y-m-d H-i-s'),
        ]);

        foreach($validated['answers'] as $questionId => $answer){
            $question = SurveyQuestion::where(['id'=> $questionId, 'survey_id'=>  $survey->id ])->get();

            if ( !$question ){
                return response("Invalid question id: \"$questionId\"",400);
            }
            $data = [
                'survey_question_id'=>$questionId,
                'survey_answer_id'=> $surveyAnswer->id,
                'answer'=>is_array($answer)?json_encode($answer):$answer
            ];
            $questionAnswer = SurveyQuestionAnswer::create($data);
        }
        return response("",201);
    }

     
   
}
     



