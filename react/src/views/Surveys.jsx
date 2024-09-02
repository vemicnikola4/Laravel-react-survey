import { PlayCircleIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import TButton from "../components/core/TButton";
import PageComponent from "../components/PageComponent";
import SurveyListItem from "../components/SurveyListItem";
import { useStateContext } from "../contexts/ContextProvider";
import { useEffect, useState,CSSProperties} from "react";
import axiosClient from "../axios";
import Pagination from "../components/Pagination";
import FadeLoader from "react-spinners/FadeLoader";


const Surveys = () => {
    // const {surveys} = useStateContext();
    const{showToast}= useStateContext();
    const[surveys,setSurveys]= useState([]);
    const[loading,setLoading]= useState(false);
    const[meta,setMeta] = useState({});
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
    useEffect(()=>{
        
        getSurveys();
    },[]);

    const onPageClick = (link)=>{
        getSurveys(link.url);

    }
    const getSurveys = (url)=>{
        url = url || '/surveys';
        setLoading(true);
        
        axiosClient.get(url)
        .then(({data})=>{
            setSurveys(data.data);
            setMeta(data.meta);

            
            setLoading(false);

        });
    }
    return (
        <>
         {loading ? (
            <div className="flex items-center justify-center aligne-items-center h-screen">
           
              <FadeLoader />
          </div>
        ):(
            <PageComponent title="Surveys" buttons={
                (
                    <TButton color="green" to="/surveys/create">
                        <PlusCircleIcon className="h-6 w-6 mr-2"/>
                        Create new survey
                    </TButton>
                )
            }>  
            {
                surveys.length === 0 && 
                <div className="py-8 text-center text-gray-700">
                    You dont have surveys created
                </div>
            }
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
                    {/* {console.log(surveys)} */}
                    {surveys.map(survey=>(
                        <SurveyListItem survey={survey} key={survey.id} onDeleteClick={onDeleteClick}
                          />
                    ))}
                </div>

                {surveys.length > 0 && (<Pagination meta={meta} onPageClick={onPageClick}/>)}
            </PageComponent>
        )
        }
        </>
       
        
        
    )
}
export default Surveys;