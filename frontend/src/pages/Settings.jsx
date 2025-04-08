import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Eye, EyeOff, Settings as SettingsIcon } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";

const Settings = () => {
  const [name, setName] = useState("Antonio");
  const [email, setEmail] = useState("hedhogs@gmail.com");
  const [role, setRole] = useState("User");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [twoFAEnabled, setTwoFAEnabled] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();

    // TODO: Call API to update profile, password & 2FA toggle
    console.log({
      name,
      email,
      currentPassword,
      newPassword,
      twoFAEnabled,
    });
  };

  return (
    <AuthLayout>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow space-y-6">
          {/* Header */}
          <div className="flex justify-center items-center text-3xl font-bold">
            <SettingsIcon className="text-gray-500 mr-2" />
            <h1>Settings</h1>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            {/* Name */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Current Password */}
            <div className="space-y-1 relative">
              <label className="text-sm font-medium text-gray-700">
                Current password
              </label>
              <Input
                type={showCurrentPassword ? "text" : "password"}
                placeholder="********"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <span
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-[38px] text-gray-600 cursor-pointer"
              >
                {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>

            {/* New Password */}
            <div className="space-y-1 relative">
              <label className="text-sm font-medium text-gray-700">
                New password
              </label>
              <Input
                type={showNewPassword ? "text" : "password"}
                placeholder="********"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <span
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-[38px] text-gray-600 cursor-pointer"
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>

            {/* Role (read-only) */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Role</label>
              <Input
                value={role}
                readOnly
                className="bg-gray-100 cursor-not-allowed"
              />
            </div>

            {/* Two-Factor Authentication */}
            <div className="flex items-center justify-between pt-2 border-t">
              <div>
                <p className="font-medium text-sm">Two Factor Authentication</p>
                <p className="text-sm text-gray-500">
                  Enable two factor authentication for your account
                </p>
              </div>
              <Switch
                checked={twoFAEnabled}
                onCheckedChange={setTwoFAEnabled}
                className="ml-4"
              />
            </div>

            {/* Save Button */}
            <Button type="submit" className="w-full mt-4">
              Save
            </Button>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Settings;
