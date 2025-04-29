import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"
import { useDisable2FA } from "@/hooks/auth/useDisable2FA"

const Disable2FAModal = ({ open, onClose }) => {
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const { mutate: disable2FA, isPending } = useDisable2FA()

  const handleDisable = (e) => {
    e.preventDefault()
    disable2FA(
      { password },
      {
        onSuccess: () => {
          setPassword("")
          onClose()
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Disable Two-Factor Authentication</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleDisable} className="space-y-4">
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Disabling..." : "Disable 2FA"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default Disable2FAModal


