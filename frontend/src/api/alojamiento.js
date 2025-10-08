import api from './index'

export const getAlojamientos = async () => {
    const response = await api.get('backend/api/alojamiento/')
    return response.data
}

export const getAlojamiento = async (id) => {
    const response = await api.get(`backend/api/alojamiento/${id}/`)
    return response.data
}

export const updateAlojamiento = async (id, data) => {
    const response = await api.put(`backend/api/alojamiento/${id}/`, data)
    return response.data
}

export const parcialUpdateAlojamiento = async (id, data) => {
    const response = await api.patch(`backend/api/alojamiento/${id}/`, data)
    return response.data
}

export const deleteAlojamiento = async (id) => {
    const response = await api.delete(`backend/api/alojamiento/${id}/`)
    return response.data
}

export const createAlojamiento = async (data) => {
    const response = await api.post('backend/api/alojamiento/', data,);
    return response.data
}