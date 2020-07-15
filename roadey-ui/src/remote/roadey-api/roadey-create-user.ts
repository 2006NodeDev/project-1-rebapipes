import { roadeyClient } from ".";
import { User} from "../../models/User";

export const roadeyCreateNewUser = async (username:string, password:string, firstName:string, lastName:string, email:string) => {
    let newUser: User = {
        userId: 0,
        username,
        password,
        firstName,
        lastName,
        email,
        role:{role:"Employee", roleId:3}
    }
    try{
        let response = await roadeyClient.post('/users', newUser)
        console.log(response);
        return response.data
    } catch(e){
        console.log(e);
    }
}
