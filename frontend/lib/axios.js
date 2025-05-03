import axios from "axios";

export const axiosInstance=axios.create({
    baseURL:  "https://vercel-deployment-dvp2o9fnp-raychura-janvis-projects.vercel.app/api" ,
    withCredentials:true,

})
