import { useMutation } from '@tanstack/react-query'
import { registerUser } from '@/lib/api'
import { toast } from 'sonner'

export const useRegister = () => {

  return useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      toast.success(data.message || 'Registration successful. Please check your email to verify your account.')
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Something went wrong'
      toast.error(message)
    },
  })
}
