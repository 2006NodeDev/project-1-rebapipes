import { roadeyClient  } from "."

export const roadeyLogin = async (username:string, password:string) => {
    let credentials = {
        username,
        password
    }
    try{
        let response = await roadeyClient .post('/login', credentials)
        console.log(response);
        return response.data//should be the user object
    } catch(e){
        console.log(e);
        //should probably do something is we get an error
    }
}
