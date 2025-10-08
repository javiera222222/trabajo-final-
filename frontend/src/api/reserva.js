import api from './index'

export const getReservas = async () => {
    const response = await api.get('backend/api/reserva/')
    return response.data
}

export const getReserva = async (id) => {
    const response = await api.get(`backend/api/reserva/${id}/`)
    return response.data
}

export const updateReserva = async (id, data) => {
    const response = await api.put(`backend/api/reserva/${id}/`, data)
    return response.data
}

export const parcialUpdateReserva = async (id, data) => {
    const response = await api.patch(`backend/api/reserva/${id}/`, data)
    return response.data
}

export const deleteReserva = async (id) => {
    const response = await api.delete(`backend/api/reserva/${id}/`)
    return response.data
}

export const createReserva = async (data) => {
    const response = await api.post('backend/api/reserva/', data)
    return response.data
}