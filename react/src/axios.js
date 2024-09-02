import axios from "axios";
import router from "./router";



const axiosClient = axios.create({

    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api` //server url gde je api
})

//request interceptor
axiosClient.interceptors.request.use((config) => {
    // const token = '123';

    config.headers.Authorization = `Bearer ${localStorage.getItem('TOKEN')}`
    return config
  });
// axiosClient.interceptors.request.use((req)=>{
//     const token = '123';
//     req.headers.Authorization = `Bearer ${token}`;
//     return req;
// });


//response interceptors, prima dve funkcije prva u slucaju da je sve ok druga se izvrsava ako postoji greska
axiosClient.interceptors.response.use((res)=>{
    return res;
},(error)=>{
    if(error.response && error.response.status === 401 ){
        localStorage.removeItem('TOKEN');
        window.location.reload();
        return error;
    }
    throw error;
})



// const axiosClient = axios.create({
//     baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
//   });

// axiosClient.interceptors.request.use((config)=>{
//     const token = '123';//to do
//     config.headers.Authorization = `Bearer ${token}`;
//     return config;
// });


// axiosClient.interceptors.response.use(response => {
//     return response;

// }, error => {
//     if ( error.response && error.response.status === 401 ){
//         router.navigate('/login');
//         return error;
//     }
//     throw error;

// })
export default axiosClient;