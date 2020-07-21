import { roadeyClient } from "."

export const getAllUsers = async () => {
    try {
        let response = await roadeyClient.get('/users')
        return response.data
    } catch (e) {
        console.log(e);
        console.log('We should probably handle this');
    }
}
