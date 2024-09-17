import { useEffect, useState} from "react";
import PageComponent from "../components/PageComponent";
import { PhotoIcon, TrashIcon, PlusCircleIcon, LinkIcon} from "@heroicons/react/24/outline";
import TButton from "../components/core/TButton";
import axiosClient from "../axios";
import { useNavigate, useParams  } from "react-router-dom";
import SurveyQuestions from "../components/SurveyQuestions";
import {v4 as uuidv4} from "uuid";
import { useStateContext } from "../contexts/ContextProvider";
import FadeLoader from "react-spinners/FadeLoader";


const SurveyView = () => {
    const[survey, setSurvey] = useState({
        title: "",
        slug: uuidv4(),
        status: false,
        description: "",
        image: null,
        image_url: null,
        expire_date: "",
        questions: [],
    })
    const [error,setError] = useState({
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
    });
    const[loading,setLoading] = useState(false);
    const{id}= useParams();
    const inputClass = 'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border-red';
    const textAreaClass=   "block text-sm font-medium text-gray-700";
    const{showToast}= useStateContext();

    const navigate = useNavigate();

    const onSubmit = (e) => {
        e.preventDefault();
        const payload = {...survey};
        if ( payload.image ){
            payload.image = payload.image_url;
        }
        // there is two ways to send an img to backend one is to create a form data and send with the form data an actual file and the second one is to create a base64 string to convert that file and send as a part of JSON

        delete payload.image_url;//we dont need it we placed in the image the url 
        
        //AXIOS request
        let res = null;
        if(id){
            res = axiosClient.put(`survey/${id}`,payload);
        }else{
            res =  axiosClient.post ('/survey',payload);

        }
        res
        .then(({data})=>{
            console.log(data);
            navigate('/surveys');
            if(id){
                showToast('The survey was updated successfuly');
            }else{
                showToast('The survey was created successfuly');
            }
        })
        //   const finalErrors = Object.values(error.response.data.errors).reduce((accum, next) => [...accum, ...next], [])
            //   console.log(finalErrors)
            //   setError({__html: finalErrors.join('<br>')})
        .catch((err) => {
            if (err && err.response) {
                const finalError = err.response.data.errors;
                if ( finalError.title ){
                    setError(prevState=>{
                        return {...prevState,
                            title:finalError.title
                        }
                    })
                }
                if ( finalError.image ){
                    setError(prevState=>{
                        return {...prevState,
                            image:finalError.image
                        }
                    })
                }
                if ( finalError.description ){
                    setError(prevState=>{
                        return {...prevState,
                            description:finalError.description
                        }
                    })
                }
                if ( finalError.expire_date ){
                    setError(prevState=>{
                        return {...prevState,
                            expire_date:finalError.expire_date
                        }
                    })
                }
                if ( finalError.question ){
                    setError(prevState=>{
                        return {...prevState,
                            question:finalError.question
                        }
                    })
                }
                console.log(err.response.data.errors);
                
                let a = [0,1,2,3,4,5,6,7,8,9,10];
                a.forEach(e=>{
                    if ( finalError[`data.options.${e}.text`]){
                        console.log(finalError);
        
                            setError(prevState=>{
                                
                                return {...prevState,
                                    options:{
                                        key: e,
                                        text: 'Option values must not be empty',
                                    }
                                }
                            })
                        }
                })
                
                //to do errors for questions

            }
          

          });
         
    }
    const onDeleteClick = (id) =>{
        if(!id){
            return;
        }else{
            if (window.confirm("Are you sure you want to delete this survey?")) {
                axiosClient.delete(`/survey/${id}`).then(() => {
                  getSurveys();
                //   showToast('The survey was deleted');
                showToast('The survey was deleted');
                });
              }
        }

    }
    const onImageChoose = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = () =>{
            setSurvey({
                ...survey,
                image: file,
                image_url:reader.result
            })
            e.target.value = "";
        }
        reader.readAsDataURL(file);
        
    }
    const onSurveyUpdate = (survey)=>{
        setSurvey({...survey});
    }
    const onQuestionUpdate = (questions)=>{
        setSurvey({
            ...survey,
            questions:questions,
        })
    }
    // const copyAndAdd = (index) => {
    //     setError({
    //       title:'',
    //         image:'',
    //         description:'',
    //         expire_date:'',
    //         question:'',
    //         options:{
    //             key:null,
    //             text:null
    //         },
    //         errorClass:'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border-red-500',
    //         errorTextAreaClass:'block text-sm font-medium text-gray-700 border-red-500',
    //     })
    //     const newQuestion = {
    //       id: uuidv4(),
    //       type: survey.questions[index].type,
    //       question: survey.questions[index].question,
    //       description: survey.questions[index].description,
    //       data: survey.questions[index].data,
    //     }
    //     const newQuestions = survey.questions.push(newQuestion);
    //     onQuestionUpdate(newQuestions);
    //   }
    useEffect(()=>{
        if(id){
            setLoading(true);
            axiosClient.get(`survey/${id}`)
            .then(({data})=>{
                setSurvey(data.data);
                console.log(survey);
                setLoading(false);
            })
            .catch((res)=>{
                console.log(res);
            })
        }
    },[])
    return (
    <PageComponent title={(!id ? "Create new survey" : "Update survey")}
        buttons={
            <div className="flex gap-2">
                 <TButton color="green" to={!loading ? `/survey/public/${survey.slug}` : null} >
                    <LinkIcon className="h-6 w-6 mr-2"/>
                    Public Link
                </TButton>
                <TButton color="red" onClick={e=>onDeleteClick(survey.id)}>
                    <TrashIcon className="h-6 w-6 mr-2"/>
                    Delete
                </TButton>
            </div>
        }
    >
        {
            (loading ?(
                <div className="flex items-center justify-center aligne-items-center h-screen">
                    <FadeLoader />
                </div>
            ):(
                <form action="#" method="POST" onSubmit={onSubmit} >
                <div className="shadow sm:overflow-hidden sm:rounde-md">
                    <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
                        {/* image label */}
                        <label htmlFor="" className="block text-sm font-medium text-gray-700">Photo</label>
                        {/*Image */}
                        <div className="mt-1 flex items-center">
                            {
                                //if there is an image_url in state dislay <img>
                                survey.image_url && (
                                <img
                                src={survey.image_url}
                                alt=""
                                className="w-32 h-32 object-cover"
                                />
                                )
                            }                          
                            {
                                !survey.image_url && (
                                //otherwise display span with icon provided from heroicons
                                <span className="flex justify-center items-center text-gray-400 h-12 w-12 overflow-hidden bg-gray-100 rounded-full">
                                    <PhotoIcon className="w-8 h-8"/>
                                </span>
                            )}
                             <button
                                type="button"
                                className="relative ml-5 rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                <input
                                type="file"
                                name="image"
                                
                                className="absolute left-0 top-0 right-0 bottom-0 opacity-0" 
                                onChange={onImageChoose}
                                />
                                Change
                            </button>
                        
                        </div>
                        {/*Image input end*/}
                        {/*Image error*/}
                          {
                        error.image &&(<div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 container ">{
                            error.image
                            }
                            </div>)
                        } 
                        {/*Image error end*/}

                        {/*Title*/}
                        <div className="col-span-6 sm:col-span-3">
                            <label
                            htmlFor="title"
                            className="block text-sm font-medium text-gray-700"
                            >
                            Survey Title
                            </label>
                            <input
                            type="text"
                            name="title"
                            id="title"
                            value={survey.title}
                            onChange={(e) =>
                                setSurvey({ ...survey, title: e.target.value })
                            }
                            placeholder="Survey Title"
                            className={ error.title ? (error.errorClass) : (inputClass) }
                            />
                        </div>
                        {/*Title end*/}
                        {/*Title error*/}
                        {
                        error.title &&(<div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 container ">{
                            error.title
                            }
                            </div>)
                        } 
                        {/*Title error end*/}
                        {/* Description */}
                        <div className="col-span-6 sm:col-span-3">
                            <label
                            htmlFor="title"
                            className={
                                error.description ? (errorTextAreaClass):(textAreaClass)
                            }
                            >
                            Survey Title
                            </label>
                            <textarea
                            name="description"
                            id="description"
                            value={survey.description || ""} 
                            onChange={(e)=> 
                                setSurvey({...survey,description:e.target.value})
                            }
                            placeholder="Describe your survey"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                
                            >

                            </textarea>
                        </div>
                        {/* description */}
                         {/*Description error*/}
                         {
                        error.description &&(<div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 container ">{
                            error.description
                            }
                            </div>)
                        } 
                        {/* Description error end */}
                        {/*Expire Date*/}
                        <div className="col-span-6 sm:col-span-3">
                            <label
                            htmlFor="expire_date"
                            className="block text-sm font-medium text-gray-700"
                            >
                            Expire Date
                            </label>
                            <input
                            type="date"
                            name="expire_date"
                            id="expire_date"
                            value={survey.expire_date}
                            onChange={(e) =>
                                setSurvey({ ...survey, expire_date: e.target.value })
                            }
                            className={error.expire_date ? 
                                ("mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border-red-500"):
                                ("mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ") }
                            />
                        </div>
                        {/*Expire Date end*/}
                        {/*Expire date error*/}
                        {
                       error.expire_date &&(<div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 container ">{
                           error.expire_date
                            }
                            </div>)
                        } 
                        {/* Expire date error end */}
                        {/*Active*/}
                        <div className="flex items-start">
                            <div className="flex h-5 items-center">
                            <input
                                id="status"
                                name="status"
                                type="checkbox"
                                checked={survey.status}
                                onChange={(e) =>
                                setSurvey({ ...survey, status: e.target.checked })
                                }
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            </div>
                            <div className="ml-3 text-sm">
                            <label
                                htmlFor="comments"
                                className="font-medium text-gray-700"
                            >
                                Active
                            </label>
                            <p className="text-gray-500">
                                Whether to make survey publicly available
                            </p>
                            </div>
                        </div>
                        {/*Active*/}
                        {/* SurveyQuestion */}
                        <SurveyQuestions survey={survey} onQuestionsUpdate={onQuestionUpdate} questions={survey.questions} onSurveyUpdate={onSurveyUpdate} error={error} setError={setError}/>
                        {/* SurveyQuestion End*/}
                    </div>
                    <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                        <TButton>
                            Save
                        </TButton>
                    </div>
                </div>
            </form>
            ))
        }
            
        </PageComponent>
    );
};

export default SurveyView;