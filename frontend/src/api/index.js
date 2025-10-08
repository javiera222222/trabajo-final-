import axios from 'axios'
import { API_BASE_URL } from '../config'
import { useAuthStore } from '../stores/auth'

const index = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})

// Interceptor para agregar el token antes de cada request
index.interceptors.request.use(config => {
    const authStore = useAuthStore()
    if (authStore.access) {
        config.headers.Authorization = `Bearer ${authStore.access}`
    }
    return config
})

// Interceptor para refrescar el token si el access expiró
index.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config
        const authStore = useAuthStore()

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true
            try {
                const response = await axios.post(API_BASE_URL + 'api/auth/refresh/', {
                    refresh: authStore.refresh
                })
                const newAccess = response.data.access
                authStore.setAccessToken(newAccess)

                // Reintenta la request original con el nuevo token
                originalRequest.headers.Authorization = `Bearer ${newAccess}`
                return index(originalRequest)

            } catch (refreshError) {
                authStore.logout()
                return Promise.reject(refreshError)
            }
        }

        return Promise.reject(error)
    }
)

export default index