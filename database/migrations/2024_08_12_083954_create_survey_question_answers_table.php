<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\SurveyAnswer;
use App\Models\SurveyQuestion;
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('survey_question_answers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('survey_question_id')->references('id')->on('survey_questions')->onUpdate('cascade')->cascadeOnDelete();
            $table->foreignId('survey_answer_id')->references('id')->on('survey_answers')->onUpdate('cascade')->cascadeOnDelete();
            $table->text('answer');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('survey_question_answers');
    }
};
