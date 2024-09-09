import { useParams } from "react-router-dom";
import axiosClient from "../axios";
import { useState,useEffect } from "react";
import FadeLoader from "react-spinners/FadeLoader";
import PageComponent from "../components/PageComponent";
import PublicQuestionView from "./PublicQuestionView";
import TButton from "../components/core/TButton";


const SurveyPublicView = ()=>{
    const answers = {};
    const[surveyFinished,setSurveyFinished] = useState(false);
    const[survey,setSurvey]= useState({
        questions: [],
    });
    const[loading,setLoading]= useState(false);
    // const[answers,setAnswers]= useState([]);
    const{slug}= useParams();
    const onSubmit = (e)=>{
        e.preventDefault();
        console.log(answers);
        axiosClient.post(`/survey/${survey.id}/answer`,{
            answers
        })
        .then((response)=>{
            setSurveyFinished(true);
        })
    }
    function answerChanged(question, value) {
        answers[question.id] = value;
        console.log(question, value);
      }

    useEffect(()=>{
        setLoading(true);
        axiosClient.get(`survey/get-by-slug/${slug}`)
        .then(({data})=>{
            setSurvey(data.data);
            setLoading(false);

        })
        .catch((err) =>{
            console.log(err);
        })
    },[]);
    const isNotEmpty = (obj) => Object.keys(obj).length > 0;
    
    return (
        <div>
            {loading  &&  <div className="flex items-center justify-center aligne-items-center h-screen">
                    <FadeLoader /> 
                </div> }
            { !loading && 
                <form className="container mx-auto" onSubmit={onSubmit}>
                    <div className="grid grid-cols-6">
                        <div className="mr-4">
                            <img src={survey.image_url} alt="" />
                        </div>
                        <div className="col-span-5">
                            <h1 className="text-3xl mb-3">{survey.title}</h1>
                            <p className="text-gray-500 text-small mb-3">Expire date: {survey.expire_date}</p>
                            <p className="text-gray-500 text-small mb-3">Description: {survey.description}</p>
                        </div>
                    </div>
                    {surveyFinished && (
                        <div className="py-8 px-6 bg-emerald-500 text-white w-[600px] mx-auto">
                            Thank You For Participating in the survey
                        </div>
                    )}
                    {!surveyFinished && (
                        <>
                        <div>
                            {isNotEmpty(survey) && 
                                survey.questions.map((question,index)=>(  
                                <PublicQuestionView
                                key={question.id}
                                question={question}
                                index={index}
                                answerChanged={(val) => answerChanged(question, val)}
                            />
                                ))}
                        </div>
                        <button
                            type="submit"
                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Submit
                        </button>
                        </>
                    )

                    }
                    
                </form>
                
            } 
        </div>
    )
}

export default SurveyPublicView;