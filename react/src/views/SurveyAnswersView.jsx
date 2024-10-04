import { useEffect ,useState} from "react";
import axiosClient from "../axios";
import { useParams } from "react-router-dom";
import FadeLoader from "react-spinners/FadeLoader";
import PageComponent from "../components/PageComponent";
import SurveyAnswerItem from "../components/SurveyAnswerItem";
import ChartPie from "../components/ChartPie";

const SurveyAnswersView = ()=>{
    const[answers,setAnswers] = useState([]);
    const[questions,setQuestions] = useState([]);

    const[loading,setLoading]= useState(false);
    const{id}= useParams();

    let answersArray  = [];
    let answersJsxArray = [];
    let answerJsxEvaluationArray = [];
    let totalAnswers = [];

    const chartPieData={
        labels:[],
        datasets:[
            
           
        ],
    }
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

        let answersArrayDuplicat = answersArray;
        if ( answersArray.length > 0 ){

            //** If type of questions is checkbox jsom strinyfy and make one unique array and place it in arrayAnswers with key that match question.id */
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
                //** if the type of question is select or radio or checkbox count how mAny times each value shows for each question and put it as a areay element type string which will have a index matching question id*/

                    for( let j = 0; j < answersArray[questions[i].id].length; j++ ){
                        totalAnswers[questions[i].id] = answersArray[questions[i].id].length;
                        
                        let b = 0;
                        for( let h = 0; h < answersArrayDuplicat[questions[i].id].length; h++ ){
                            if (answersArrayDuplicat[questions[i].id][h] ==  answersArray[questions[i].id][j]){
                                b++;
                            }
                        }
                        //**Puting strings in a new array i will render */
                        if ( answersJsxArray[questions[i].id] == undefined ){
                            answersJsxArray[questions[i].id] = [];
                            let percentage = b /  answersArray[questions[i].id].length  * 100;
                            percentage = percentage.toFixed(2);

                            
                            
                            if ( answersJsxArray[questions[i].id]['val'] == undefined ){
                                answersJsxArray[questions[i].id]['val'] = [];
                                answersJsxArray[questions[i].id]['val'].push(`${answersArray[questions[i].id][j]} ${b}`);
                            }

                            if ( answersJsxArray[questions[i].id]['labels'] == undefined ){
                                answersJsxArray[questions[i].id]['labels'] = [];
                                answersJsxArray[questions[i].id]['labels'].push(answersArray[questions[i].id][j]);
                            }

    
                        }else{

                            let percentage =  b /  answersArray[questions[i].id].length  * 100;
                            percentage =  percentage.toFixed(2);
                            if ( !answersJsxArray[questions[i].id]['labels'].includes(answersArray[questions[i].id][j])){
                                answersJsxArray[questions[i].id]['labels'].push(answersArray[questions[i].id][j]);
                            }
                            if(!answersJsxArray[questions[i].id]['val'].includes(`${answersArray[questions[i].id][j]} ${b}`)){
                                answersJsxArray[questions[i].id]['val'].push(`${answersArray[questions[i].id][j]} ${b}`);
    
                            }
                        }
                        
                       
                    }
                }                
                
            }
            
        }
       
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
                                                {/* Select checkbox and radio dispplay */}

                                                {
                                                    ['select','radio','checkbox'].includes(question.type) &&
                                                    <div className="flex">
                                                    {answersArray.length > 0 &&
                                                    <ChartPie data={answersJsxArray[question.id]}/>
                                                    }
                                                    </div>
                                                    
                                                    // answersJsxArray[question.id].map((answer,key)=>(
                                                        
                                                    //     <li  key={key} >{answer}</li>

                                                    // )) 
                                                }
                                                {/* Type text and textarea display */}
                                                {
                                                    ['text','textarea'].includes(question.type) &&
                                                <ul>

                                                    {answersArray.length > 0 &&

                                                    
                                                    answersArray[question.id].map((answer,key)=>(
                                                        
                                                        <li key={key}>{answer}</li>

                                                    ))}
                                                </ul>

                                                }
                                                {
                                                    question.type == 'evaluation' &&
                                                    
                                                    answerJsxEvaluationArray.length > 0 &&
                                                    
                                                        <div className="text-lg">
                                                            {answerJsxEvaluationArray[question.id]}
                                                        </div>
                                                       
                                                    
                                                        
                                                    
                                                    
                                                }   
                                                

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