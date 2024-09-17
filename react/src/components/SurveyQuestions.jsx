import {PlusIcon} from "@heroicons/react/24/outline";
import {useEffect} from "react";
import {useState} from "react";
import {v4 as uuidv4} from "uuid";
import QuestionEditor from "./QuestionEditor";


// const SurveyQuestion = ({questions,onQuestionsUpdate}) => {
  
//   const[ myQuestions,setMyQuestions] = useState([...questions]);

  
//   return <>
//     </>
// }

export default function SurveyQuestions({questions, onQuestionsUpdate,error,setError}) {
  const [myQuestions, setMyQuestions] = useState([...questions]);

  //**ADD QUESTION */
  const addQuestion = (index) => {
    index = index !== undefined ? index : myQuestions.length;
    setError({
      title:'',
        image:'',
        description:'',
        expire_date:'',
        question:'',
        options:{
            key:null,
            text:null
        },
        errorClass:'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border-red-500',
        errorTextAreaClass:'block text-sm font-medium text-gray-700 border-red-500',
    })
    myQuestions.splice(index, 0, {
      id: uuidv4(),
      type: "text",
      question: "",
      description: "",
      data: {},
      
    })
    setMyQuestions([...myQuestions]);
    onQuestionsUpdate(myQuestions)
  };
  //**ADD QUESTION END*/

  //**COPY AND ADD */
  const copyAndAdd= (index)=>{
    setError({
      title:'',
        image:'',
        description:'',
        expire_date:'',
        question:'',
        options:{
            key:null,
            text:null
        },
        errorClass:'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border-red-500',
        errorTextAreaClass:'block text-sm font-medium text-gray-700 border-red-500',
    })
    
    if ( questions[index].data.options === undefined){
      const newQuest = {
        id: uuidv4(),
        type: questions[index].type,
        question: "",
        description: "",
        data: {
          options:[],
        },
      }
      myQuestions.push(newQuest);
      setMyQuestions([...myQuestions]);
      onQuestionsUpdate(myQuestions);
    }else{
      const data = questions[index].data.options;
      console.log(data.length);
      const optionsLength = data.length;
      const newQuest = {
        id: uuidv4(),
        type: questions[index].type,
        question: "",
        description: "",
        data: {
          options:[],
        },
      }
      for( let i = 0; i < optionsLength; i++){
        newQuest.data.options.push({
          uuid: uuidv4(),
          text:questions[index].data.options[i].text,
        })
      }
      myQuestions.push(newQuest);
      setMyQuestions([...myQuestions]);
      onQuestionsUpdate(myQuestions);
    }
    

  }
  //**COPY AND ADD END*/


  //**QUESTION CHANGE */
  const questionChange = (question) => {
    if (!question) return;
    const newQuestions = myQuestions.map((q) => {
      if (q.id == question.id) {
        return {...question};
      }
      return q;
    });
    setMyQuestions(newQuestions);
    onQuestionsUpdate(newQuestions);
  };
  //**QUESTION CHANGE END*/

  //**QUESTION DELETE */
  const deleteQuestion = (question) => {
    const newQuestions = myQuestions.filter((q) => q.id !== question.id);

    setMyQuestions(newQuestions);
    onQuestionsUpdate(newQuestions)
  };
  //**QUESTION DELETE END*/

  useEffect(() => {
    setMyQuestions(questions)
  }, [questions]);

  return (
    <>
      <div className="flex justify-between">
        <h3 className="text-2xl font-bold">Questions</h3>
        <button
          type="button"
          className="flex items-center text-sm py-1 px-4 rounded-sm text-white bg-gray-600 hover:bg-gray-700"
          onClick={() => addQuestion()}
        >
          <PlusIcon className="w-4 mr-2"/>
          Add question
        </button>
      </div>
      
      {myQuestions.length ? (
        myQuestions.map((q, ind) => (
          <QuestionEditor
            key={q.id}
            index={ind}
            question={q}
            questionChange={questionChange}
            addQuestion={addQuestion}
            deleteQuestion={deleteQuestion}
            error={error}
            copyAndAdd={copyAndAdd}
            
          />
        ))
      ) : (
        <div className="text-gray-400 text-center py-4">
          You don't have any questions created
        </div>
      )}
    </>
  );
}
