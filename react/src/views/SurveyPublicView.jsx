import { useParams } from "react-router-dom";
import axiosClient from "../axios";
import { useState,useEffect } from "react";
import FadeLoader from "react-spinners/FadeLoader";


const SurveyPublicView = ()=>{

    const[survey,setSurvey]= useState({});
    const[loading,setLoading]= useState(false);

    const{slug}= useParams();

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
    return (
        <div>
        {loading ? (
            <div className="flex items-center justify-center aligne-items-center h-screen">
                <FadeLoader />
              
            </div> ):(
            <div>
                {survey.title}
            </div>
          )
        }
        </div>
    )
}

export default SurveyPublicView;