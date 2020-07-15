import { roadeyClient  } from "."

export const lightlyburningGetUserById = async (userId:number) =>{

    try{
        let response = await roadeyClient .get(`/users/${userId}`)
        return response.data
    } catch(e){
        console.log(e);
        console.log('we should probably handle this');   
    }
}
