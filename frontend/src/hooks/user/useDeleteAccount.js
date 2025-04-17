import { useMutation } from '@tanstack/react-query'
import { deleteAccount } from '@/lib/api'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

export const useDeleteAccount = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: deleteAccount,
    onSuccess: (data) => {
      toast.success(data.message || 'Account deleted successfully')
      navigate('/register')
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Something went wrong'
      toast.error(message)
    },
  })
}
