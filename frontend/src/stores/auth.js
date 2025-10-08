import { defineStore } from 'pinia'
import router from '../router'
import { login } from '../api/auth'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        access: localStorage.getItem('access_token') || null,
        refresh: localStorage.getItem('refresh_token') || null,
        user: null,
        grupos: JSON.parse(localStorage.getItem('user_grupos') || '[]')
    }),
    actions: {
        async login(username, password) {
            try {
                const data = await login(username, password)
                this.access = data.access
                this.refresh = data.refresh
                this.grupos = data.grupos
                localStorage.setItem('access_token', this.access)
                localStorage.setItem('refresh_token', this.refresh)
                localStorage.setItem('user_grupos', JSON.stringify(this.grupos))

            } catch (error) {
                throw new Error('Credenciales inválidas')
            }
        },
        logout() {
            this.access = null
            this.refresh = null
            this.grupos = []
            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')
            router.push('/')
            localStorage.removeItem('user_grupos')
        },
        setAccessToken(newAccess) {
            this.access = newAccess
            localStorage.setItem('access_token', newAccess)
        }
    }
})