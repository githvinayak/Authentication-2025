import { Lock, Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

const ResetPassword = () => {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      alert("Passwords do not match")
      return
    }

    // TODO: Handle password reset logic with token
    console.log("Resetting password to:", password)
  }

  return (
    <div className="flex items-center justify-center ">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow space-y-6">
        {/* Header */}
        <div className="flex justify-center items-center text-4xl font-bold">
          <Lock className="text-yellow-500 mr-2" />
          <h1>Auth</h1>
        </div>

        <p className="text-center text-gray-500 text-sm">Set a new password</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* New Password */}
          <div className="space-y-1 relative">
            <label className="text-sm font-medium text-gray-700">New Password</label>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="*******"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[38px] text-gray-600 cursor-pointer"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1 relative">
            <label className="text-sm font-medium text-gray-700">Confirm Password</label>
            <Input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="********"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <span
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-[38px] text-gray-600 cursor-pointer"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>

          <Button type="submit" className="w-full">
            Reset Password
          </Button>
        </form>

        <div className="text-center text-sm">
          <Link to="/login" className="text-gray-700 hover:underline">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
