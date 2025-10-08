import api from './index'

export const getfotos = async () => {
    const response = await api.get('backend/api/fotos/')
    return response.data
}

export const getfoto = async (habitacion) => {
    const response = await api.get(`backend/api/fotos/?habitacion=${habitacion}`);
    return response.data;
};


export const updatefoto = async (id, data) => {
    const response = await api.put(`backend/api/fotos/${id}/`, data)
    return response.data
}

export const parcialUpdatefoto = async (id, data) => {
    const response = await api.patch(`backend/api/fotos/${id}/`, data)
    return response.data
}

export const deletefoto = async (id) => {
    const response = await api.delete(`backend/api/fotos/${id}/`)
    return response.data
}

export const createfoto = async (data) => {
    const response = await api.post('backend/api/fotos/', data)
    return response.data
}