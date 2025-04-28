
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import Enable2FAModal from "@/components/modals/Enable2FAModal"
import Disable2FAModal from "@/components/modals/Disable2FAModal"
import { useGetProfile } from "@/hooks/user/useGetProfile"
import { useUpdateProfile } from "@/hooks/user/useUpdateProfile"
import { useUpdatePassword } from "@/hooks/user/useUpdatePassword"
import { useLogoutAll } from "@/hooks/auth/useLogoutAll"
import { useDeleteAccount } from "@/hooks/user/useDeleteAccount"
import { useEnable2FA } from "@/hooks/auth/useEnable2FA"

const Settings=()=>{
  const { data: user } = useGetProfile()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")

  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [twoFAPassword, setTwoFAPassword] = useState("")
  const [isEnabling2FA, setIsEnabling2FA] = useState(true)
  const [showEnable2FAModal, setShowEnable2FAModal] = useState(false)
  const [showDisable2FAModal, setShowDisable2FAModal] = useState(false)

  const updateProfile = useUpdateProfile()
  const updatePassword = useUpdatePassword()
  const logoutAll = useLogoutAll()
  const deleteAccount = useDeleteAccount()
  const enable2FA = useEnable2FA()

  useEffect(() => {
    if (user) {
      setName(user.name)
      setEmail(user.email)
    }
  }, [user])

  const handleProfileUpdate = () => {
    updateProfile.mutate({ name, email })
  }

  const handleToggle2FA = () => {
    setIsEnabling2FA(!user.twoFactorEnabled)
    setShowPasswordModal(true)
  }

  const handleConfirm2FAPassword = () => {
    if (!twoFAPassword) return

    if (isEnabling2FA) {
      enable2FA.mutate(
        { password: twoFAPassword },
        {
          onSuccess: () => {
            setShowPasswordModal(false)
            setShowEnable2FAModal(true)
            setTwoFAPassword("")
          },
          onError: (err) => {
            toast.error(err.response?.data?.message || "Failed to enable 2FA")
          },
        }
      )
    } else {
      setShowPasswordModal(false)
      setShowDisable2FAModal(true)
      setTwoFAPassword("")
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <Button onClick={handleProfileUpdate}>Update Profile</Button>
      </div>

      <div className="flex items-center justify-between mt-6">
        <span className="text-sm font-medium">Two-Factor Authentication</span>
        <Switch
          checked={user?.twoFactorEnabled}
          onCheckedChange={handleToggle2FA}
        />
      </div>

      <div className="mt-6 space-x-4">
        <Button variant="destructive" onClick={() => logoutAll.mutate()}>
          Logout from all devices
        </Button>
        <Button variant="destructive" onClick={() => deleteAccount.mutate()}>
          Delete Account
        </Button>
      </div>

      {/* Password Confirmation Modal */}
      <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Confirm to {isEnabling2FA ? "Enable" : "Disable"} 2FA
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600 mb-2">
            Please enter your password to continue:
          </p>
          <Input
            type="password"
            placeholder="Your password"
            value={twoFAPassword}
            onChange={(e) => setTwoFAPassword(e.target.value)}
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowPasswordModal(false)
                setTwoFAPassword("")
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleConfirm2FAPassword}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Enable2FAModal
        open={showEnable2FAModal}
        onClose={() => setShowEnable2FAModal(false)}
      />
      <Disable2FAModal
        open={showDisable2FAModal}
        onClose={() => setShowDisable2FAModal(false)}
      />
    </div>
  )
}

export default Settings