import api from '@/lib/api'
import { User } from '@/types'

export const authApi = {
    // Register new user
    register: async (data: { email: string; password: string; name: string }) => {
        const response = await api.post('/auth/register', data)
        return response.data
    },

    // Login
    login: async (data: { email: string; password: string }) => {
        const response = await api.post<{ access_token: string; user: User }>('/auth/login', data)
        return response.data
    },

    // Get current user profile
    getProfile: async () => {
        const { data } = await api.get<User>('/profile')
        return data
    },

    // Update profile
    updateProfile: async (data: Partial<User>) => {
        const response = await api.patch('/profile', data)
        return response.data
    },

    // Change password
    changePassword: async (data: { currentPassword: string; newPassword: string }) => {
        const response = await api.patch('/profile/password', data)
        return response.data
    },
}
