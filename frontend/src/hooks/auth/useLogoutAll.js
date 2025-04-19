import { useMutation } from '@tanstack/react-query'
import { logoutAll } from '@/lib/api'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

export const useLogoutAll = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: logoutAll,
    onSuccess: (data) => {
      toast.success(data.message || 'Logged out from all devices')
      navigate('/login')
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Something went wrong'
      toast.error(message)
    },
  })
}
