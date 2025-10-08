
import api from './index'

export const registrarUsuario = async (datos) => {
    try {
        const response = await api.post('/api/auth/registro/', datos)
        return response.data
    } catch (error) {
        throw error.response.data
    }
}