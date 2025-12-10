import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { authApi } from '@/services/auth'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'next/navigation'

// Login mutation
export const useLogin = () => {
    const setAuth = useAuthStore(state => state.setAuth)
    const router = useRouter()

    return useMutation({
        mutationFn: authApi.login,
        onSuccess: (data) => {
            setAuth(data.user, data.access_token)
            router.push('/')
        },
    })
}

// Register mutation
export const useRegister = () => {
    const router = useRouter()

    return useMutation({
        mutationFn: authApi.register,
        onSuccess: () => {
            router.push('/login')
        },
    })
}

// Logout
export const useLogout = () => {
    const logout = useAuthStore(state => state.logout)
    const router = useRouter()
    const queryClient = useQueryClient()

    return () => {
        logout()
        queryClient.clear()
        router.push('/login')
    }
}

// Get profile
export const useProfile = () => {
    const isAuthenticated = useAuthStore(state => state.isAuthenticated)

    return useQuery({
        queryKey: ['profile'],
        queryFn: authApi.getProfile,
        enabled: isAuthenticated,
    })
}

// Update profile
export const useUpdateProfile = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: authApi.updateProfile,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profile'] })
        },
    })
}

// Change password
export const useChangePassword = () => {
    return useMutation({
        mutationFn: authApi.changePassword,
    })
}
