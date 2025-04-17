import { useMutation } from '@tanstack/react-query'
import { updateProfile } from '@/lib/api'
import { toast } from 'sonner'

export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      toast.success(data.message || 'Profile updated successfully')
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Something went wrong'
      toast.error(message)
    },
  })
}
