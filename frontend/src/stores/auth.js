import { defineStore } from 'pinia'
import router from '../router'
import { login } from '../api/auth'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        access: localStorage.getItem('access_token') || null,
        refresh: localStorage.getItem('refresh_token') || null,
        user: JSON.parse(localStorage.getItem('user_data') || 'null'),
        grupos: JSON.parse(localStorage.getItem('user_grupos') || '[]')
    }),

    actions: {
        async login(username, password) {
            try {
                const data = await login(username, password)

                this.access = data.access
                this.refresh = data.refresh
                this.user = data.user
                this.grupos = data.grupos || []

                localStorage.setItem('access_token', this.access)
                localStorage.setItem('refresh_token', this.refresh)
                localStorage.setItem('user_data', JSON.stringify(this.user))
                localStorage.setItem('user_grupos', JSON.stringify(this.grupos))

                router.push('/Bienvenida')
            } catch (error) {
                console.error('Error al iniciar sesión:', error.response?.data || error)
                throw new Error('Credenciales inválidas')
            }
        },

        logout() {
            this.access = null
            this.refresh = null
            this.user = null
            this.grupos = []

            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')
            localStorage.removeItem('user_data')
            localStorage.removeItem('user_grupos')

            router.push('/')
        },

        setAccessToken(newAccess) {
            this.access = newAccess
            localStorage.setItem('access_token', newAccess)
        }
    }
})
