import { useMutation } from '@tanstack/react-query'
import { updatePassword } from '@/lib/api'
import { toast } from 'sonner'

export const useUpdatePassword = () => {
  return useMutation({
    mutationFn: updatePassword,
    onSuccess: (data) => {
      toast.success(data.message || 'Password updated successfully')
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to update password'
      toast.error(message)
    },
  })
}
