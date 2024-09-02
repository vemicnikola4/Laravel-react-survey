<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\SurveyAnswer;
use App\Models\SurveyQuestion;

class Survey extends Model
{
    use HasFactory;
    protected $fillable = ['user_id','image','title','slug','status','description','created_at','updated_at','expire_date'];

    public function questions()
    {
        return $this->hasMany(SurveyQuestion::class);
    }

    public function answers()
    {
        return $this->hasMany(SurveyAnswer::class);
    }
}
