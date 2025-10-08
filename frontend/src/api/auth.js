import axios from 'axios'
import { API_BASE_URL } from '../config'

export const login = async (username, password) => {
    //IMPORTANTE: usamos axios sin api porque aún no tenemos tokens
    const response = await axios.post(API_BASE_URL + '/api/auth/login/', {
        username,
        password
    })
    return response.data
}