import { roadeyClient } from "."

export const getUserById = async (userId:number) => {
    try {
        let response = await roadeyClient.get(`/users/${userId}`)
        return response.data
    } catch (e) {
        console.log(e);
        console.log('We should probably handle this');
    }
}
