import api from './index'

export const gethabitaciones = async () => {
    const response = await api.get('backend/api/habitacion/')
    return response.data
}

export const gethabitacion = async (id) => {
    const response = await api.get(`backend/api/habitacion/${id}/`)
    return response.data
}

export const updatehabitacion = async (id, data) => {
    const response = await api.put(`backend/api/habitacion/${id}/`, data)
    return response.data
}

export const parcialUpdatehabitacion = async (id, data) => {
    const response = await api.patch(`backend/api/habitacion/${id}/`, data)
    return response.data
}

export const deletehabitacion = async (id) => {
    const response = await api.delete(`backend/api/habitacion/${id}/`)
    return response.data
}

export const createhabitacion = async (data) => {
    const response = await api.post('backend/api/habitacion/', data)
    return response.data
}