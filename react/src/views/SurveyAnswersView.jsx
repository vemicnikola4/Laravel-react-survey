import { useEffect ,useState} from "react";
import axiosClient from "../axios";
import { useParams } from "react-router-dom";
import FadeLoader from "react-spinners/FadeLoader";
import PageComponent from "../components/PageComponent";
import SurveyAnswerItem from "../components/SurveyAnswerItem";

const SurveyAnswersView = ()=>{
    const[answers,setAnswers] = useState([]);
    const[questions,setQuestions] = useState([]);

    const[loading,setLoading]= useState(false);
    const{id}= useParams();

    let answersArray  = [];
    let answersJsxArray = [];
    let answerJsxEvaluationArray = [];
    let totalAnswers = [];


    useEffect(()=>{
        setLoading(true);
        axiosClient.get(`surveys/${id}/answers`)
        .then((data)=>{
            setAnswers(data.data.answers);
            setLoading(false);

        })
        .catch((error)=>{
            console.log(error);
        })
        axiosClient.get(`surveys/${id}/questions`)
        .then((data)=>{
            setQuestions(data.data.questions);
            setLoading(false);

        })
        .catch((error)=>{
            console.log(error);
        })
    },[]);
    
    if ( questions.length > 0 ){

        questions.map((question)=>(
            answers.length > 0 ?
            answers.map((answer)=>(
                (answersArray[question.id] == undefined ?
                answersArray[question.id] = [] : null,
                answer.survey_question_id == question.id ?
                question.type == 'evaluation' ? answersArray[question.id].push (Number(answer.answer)):answersArray[question.id].push (answer.answer)

                : null
            )
            )) : null
        ))

        let arrayAnswersDuplicat = answersArray;
        if ( answersArray.length > 0 ){

            questions.forEach((question)=>{
                
                if ( question.type == 'checkbox'){

                    if ( answersArray[question.id].length > 0 ){
                        let checkboxArray = [];
                        answersArray[question.id].forEach((a)=>{ 
                            let str = JSON.stringify(a);
                            let strReplace = str.replace(/[^a-z0-9 ,-]/gi, '');
                            let arr = strReplace.split(",");
                            if ( arr.length > 0 ){
                                arr.forEach((e)=>{
                                    checkboxArray.push(e);
                                })
                            }
                        })
                        if( checkboxArray.length > 0 ){
                            answersArray[question.id]=checkboxArray;
                        }
                    }
                    // let str = JSON.stringify(answersArray[question.id]);
                    // let strReplace = str.replace(/[\W_]+/g," ");
                    // console.log(strReplace);

                    // answersArray[question.id].replace(/\D/g,'');

                    
                }
            })

            //** If the type of question is not evaluation, calculating what percent of each answer for an answer if the type of questioon is evaluation we gonna do the avg sql in the backend ans send it as an answer */
            for( let i = 0; i < questions.length; i++ ){
                //** if the type of question is evaluation do the avg value for each question */
                if ( questions[i].type == 'evaluation'){
                    let sum = 0;
                    let count = 0;
                    answersArray[questions[i].id].forEach((answer) => {
                        sum += answer;
                        count++;
                    });
                    totalAnswers[questions[i].id] =  answersArray[questions[i].id].length
                    let avg = sum/count;

                    avg = avg.toFixed(2);
                    if ( answerJsxEvaluationArray[questions[i].id] == undefined ){
                        answerJsxEvaluationArray[questions[i].id] = [];
                        answerJsxEvaluationArray[questions[i].id].push(avg);

                    }else{
                        answerJsxEvaluationArray[questions[i].id].push(avg);
                    }

                }else{
                //** if the type of question is select or radio or checkbox count how meny times each value shows for each question and put it as a areay element type string which will have a index matching question id*/

                    for( let j = 0; j < answersArray[questions[i].id].length; j++ ){
                        totalAnswers[questions[i].id] = answersArray[questions[i].id].length;
                        
                        let b = 0;
                        for( let h = 0; h < arrayAnswersDuplicat[questions[i].id].length; h++ ){
                            if (arrayAnswersDuplicat[questions[i].id][h] ==  answersArray[questions[i].id][j]){
                                b++;
                            }
                        }
                        //**Puting strings in a new array i would render */
                        if ( answersJsxArray[questions[i].id] == undefined ){
                            answersJsxArray[questions[i].id] = [];
                            let percentage = b /  answersArray[questions[i].id].length  * 100;
                            percentage = percentage.toFixed(2);
                            answersJsxArray[questions[i].id].push(`${answersArray[questions[i].id][j]} takes ${percentage}% of all answers`);
    
                        }else{
                            
                            let percentage =  b /  answersArray[questions[i].id].length  * 100;
                            percentage =  percentage.toFixed(2);
    
                            if(!answersJsxArray[questions[i].id].includes(`${answersArray[questions[i].id][j]} takes ${percentage}% of all answers`)){
                                answersJsxArray[questions[i].id].push(`${answersArray[questions[i].id][j]} takes ${percentage}% of all answers`);
    
                            }
                        }
                        
                       
                    }
                }                
                
            }
            
        }
       
    console.log(answersArray);
    }
    
    let br = 0;
    return (
        <>
        {loading &&
        <div className="flex items-center justify-center aligne-items-center h-screen">
            <FadeLoader />
        </div>
             }
        {!loading &&
        <PageComponent >
                    <div className="flex flex-col">
                <div className="overflow-x-auto">
                    <div className="p-1.5 w-full inline-block align-middle">
                        <div className="overflow-hidden border rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col"
                                            className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase ">Question</th>
                                        <th scope="col"
                                            className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase ">Answers</th>
                                        <th scope="col"
                                            className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase ">Number of answers</th>
                                        
                                    </tr>

                                </thead>

                                <tbody className="divide-y divide-gray-200">
                                {
                                questions.length > 0 &&
                                 (
                                    questions.map((question,key)=>(
                                        <tr key={key}>
                                            <td className="px-6 py-3 text-xs font-bold text-left text-gray-500">{question.question}</td>
                                            <td className="px-6 py-3 text-xs font-bold text-left text-gray-500">
                                            <ul>
                                                {/* Select checkbox and radio dispplay */}

                                                {
                                                    ['select','radio','checkbox'].includes(question.type) &&
                                                    answersArray.length > 0 &&

                                                    answersJsxArray[question.id].map((answer)=>(
                                                        
                                                        <li>{answer}</li>

                                                    )) 
                                                }
                                                {/* Type text and textarea display */}
                                                {
                                                    ['text','textarea'].includes(question.type) &&
                                                    answersArray.length > 0 &&

                                                    
                                                    answersArray[question.id].map((answer)=>(
                                                        
                                                        <li>{answer}</li>

                                                    )) 
                                                }
                                                {
                                                    question.type == 'evaluation' &&
                                                    answerJsxEvaluationArray.length > 0 &&
                                                    <li>{
                                                        answerJsxEvaluationArray[question.id]
                                                    
                                                        
                                                        }</li>
                                                    
                                                    
                                                }   
                                            </ul>
                                                

                                            </td>
                                            <td className="px-6 py-3 text-xs font-bold text-left text-gray-500">{totalAnswers[question.id]}</td>


                                        </tr>
                                    ))
                                )
                                }






                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

        </PageComponent>

        }
        </>

    )


}

export default SurveyAnswersView;