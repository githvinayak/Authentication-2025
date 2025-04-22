import { useMutation } from '@tanstack/react-query'
import { verifyLogin2FA } from '@/lib/api'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

export const useVerifyLogin2FA = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: verifyLogin2FA,
    onSuccess: (data) => {
      toast.success(data.message || '2FA verification successful')
      navigate('/')
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Invalid OTP'
      toast.error(message)
    },
  })
}
