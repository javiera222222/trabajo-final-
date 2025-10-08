import api from './index'

export const getpagos = async () => {
    const response = await api.get('backend/api/pago/')
    return response.data
}

export const getpago = async (id) => {
    const response = await api.get(`backend/api/pago/${id}/`)
    return response.data
}

export const updatepago = async (id, data) => {
    const response = await api.put(`backend/api/pago/${id}/`, data)
    return response.data
}

export const parcialUpdatepago = async (id, data) => {
    const response = await api.patch(`backend/api/pago/${id}/`, data)
    return response.data
}

export const deletepago = async (id) => {
    const response = await api.delete(`backend/api/pago/${id}/`)
    return response.data
}

export const createpago = async (data) => {
    const response = await api.post('backend/api/pago/', data)
    return response.data
}