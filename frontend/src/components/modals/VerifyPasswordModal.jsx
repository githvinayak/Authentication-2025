import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useVerifyPassword } from "@/hooks/auth/useVerifyPassword"

const VerifyPasswordModal = ({ open, onClose, onVerified }) => {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { mutate: verifyPassword, isPending } = useVerifyPassword()

  const handleSubmit = (e) => {
    e.preventDefault()
    verifyPassword(
      { password },
      {
        onSuccess: () => {
          setPassword("")
          setError("")
          onClose()
          onVerified(password)
        },
        onError: (err) => {
          setError("Incorrect password. Please try again.")
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Password Confirmation</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-sm text-gray-600">Please enter your password to continue:</p>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Verifying..." : "Confirm"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default VerifyPasswordModal
