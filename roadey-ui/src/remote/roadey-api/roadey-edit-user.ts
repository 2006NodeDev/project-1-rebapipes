import { roadeyClient } from "."
import { User } from "../../models/User";

export const roadeyEditUser = async (updatedUser:User) => {
    try {
        let res = await roadeyClient.patch('/users', updatedUser)
        console.log(res);
        return res.data
    } catch (e) {
        console.log(e);
        throw e
    }
}
