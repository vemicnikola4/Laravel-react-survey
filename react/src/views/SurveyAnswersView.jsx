import { useEffect ,useState} from "react";
import axiosClient from "../axios";
import { useParams } from "react-router-dom";
import FadeLoader from "react-spinners/FadeLoader";

const SurveyAnswersView = ()=>{
    const[answers,setAnswers] = useState([]);
    const[questionTypes,setQuestionTypes] = useState([]);
    const[loading,setLoading]= useState(false);
    const{id}= useParams();
    let questTypes = [];

    let answersFinal =[];
    console.log(id);
    useEffect(()=>{
        setLoading(true);
        axiosClient.get(`surveys/${id}/answers`)
        .then((data)=>{
            console.log(data)
            setAnswers(data.data.answers);
            setQuestionTypes(data.data.questionTypes);
            setLoading(false);
            
        })
        .catch((error)=>{
            console.log(error);
        })
    },[]);

    if( answers.length > 0 ){
        let sum = 0;
        let num = 0;

        answers.forEach(answer => {
            let avg;
            if( answer.type == 'select' && ['1','2','3','4','5','6','7','8','9','10'].includes(answer.answer)){
                sum += Number(answer.answer);
                num++;

                answersFinal[answer.survey_question_id]={
                    question: answer.question,
                    answerAvg: sum/num,
                }
            }else if( answer.type == 'select' ){
                if( !answersFinal[answer.survey_question_id] ){
                    answersFinal[answer.survey_question_id] = {
                        question:answer.question,
                        answer:[],
                    };
                }
                answersFinal[answer.survey_question_id].answer.push(answer.answer);
            }
            console.log(sum/num);
            if( answer.type == 'radio' && ['1','2','3','4','5','6','7','8','9','10'].includes(answer.answer)){
                sum += Number(answer.answer);
                num++;

                answersFinal[answer.survey_question_id]={
                    question: answer.question,
                    answerAvg: sum/num,
                }
            }else if( answer.type == 'radio' ){
                if( !answersFinal[answer.survey_question_id] ){
                    answersFinal[answer.survey_question_id] = {
                        question:answer.question,
                        answer:[],
                    };
                }
                answersFinal[answer.survey_question_id].answer.push(answer.answer);
            }
            if( answer.type == 'text'){
               
                if( !answersFinal[answer.survey_question_id] ){
                    answersFinal[answer.survey_question_id] = {
                        question:answer.question,
                        answer:[],
                    };
                }
                answersFinal[answer.survey_question_id].answer.push(answer.answer);
            }
            if( answer.type == 'textarea'){
               
                if( !answersFinal[answer.survey_question_id] ){
                    answersFinal[answer.survey_question_id] = {
                        question:answer.question,
                        answer:[],
                    };
                }
                answersFinal[answer.survey_question_id].answer.push(answer.answer);
            }
        });
    }
    console.log(answersFinal);
    return (
    <>
    {loading && 
        <div className="flex items-center justify-center aligne-items-center h-screen">
            <FadeLoader />
        </div>
    }
    {!loading &&
        <div>
            <table border={1}>
                <thead>
                    <td>Question</td>
                    <td>Avg answer</td>
                    <td>List of textual answers</td>
                </thead>
                    
                <tbody>

            {
                    answersFinal.map((a,ind)=>(
                            
                                a.answerAvg ? (
                                    <tr key={ind}>
                                        <td>
                                            {a.question}
                                        </td>
                                        <td>
                                            {a.answerAvg.toFixed(2)}
                                        </td>
                                        <td>
                                            /
                                        </td>
                                    </tr>

                                    ) : (
                                    <tr key={ind}>
                                        <td>
                                            {a.question}
                                        </td>
                                        <td>
                                            /
                                        </td>
                                        <td>
                                            <ul>
                                            {a.answer.toString()}
                                            </ul>

                                        </td>
                                    </tr>
                                    )
                        
                        
                    ))
                    
               
            }
                </tbody>

            </table>

        </div>
        }
    </>
    )
}

export default SurveyAnswersView;