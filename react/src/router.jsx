import { createBrowserRouter, Navigate } from "react-router-dom";
import Dashboard from "./views/Dashboard";
import Surveys from "./views/Surveys";
import Signup from "./views/Signup";
import Login from "./views/Login";
import GuestLayout from "./components/GuestLayout";
import DefaultLeyout from "./components/DefaultLayout";
import SurveyView from "./views/SurveyView";
import SurveyPublicView from "./views/SurveyPublicView";


const router = createBrowserRouter([
   
    {
        path:"/",
        element: <DefaultLeyout />,
        children: [
            {
                path:"/dashboard",
                element: <Navigate to="/" />
            },
            {
                path:"/",
                element: <Dashboard />
            },
            {
                path:"/surveys",
                element: <Surveys />
            },
            {
                path:"/surveys/create",
                element: <SurveyView />
            },
            {
                path:"/surveys/:id",
                element: <SurveyView />
            },
           
        ]

    },
    {
        path : "/",
        element: <GuestLayout />,
        children :[
            {
                path:"signup",//sklonim slash
                element: <Signup />
            },
            {
                path:"login",
                element: <Login />
            },
        ]
    },
    {
        path:"/survey/public/:slug",
        element: <SurveyPublicView />
    },
]);

export default router;

 