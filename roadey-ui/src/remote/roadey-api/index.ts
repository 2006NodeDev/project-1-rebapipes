//this index is going to be for setting up the base axios client
import axios from 'axios'
import { roadeyBaseUrl } from '../../environment'


// we will use this object to send off all of the other request we make to the roadey api
export const roadeyClient  = axios.create({
    baseURL:roadeyBaseUrl,
    headers:{
        'Content-Type': 'application/json'
    },
    withCredentials:true
})
