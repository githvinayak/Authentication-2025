// src/pages/VerifyLogin2FA.jsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import OTPInput from "@/components/ui/OTPInput";
import AuthLayout from "@/components/AuthLayout";
import { useVerifyLogin2FA } from "@/hooks/auth/useVerifyLogin2FA";

const VerifyLogin2FA = () => {
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState(""); // ask user for email again, or store in localStorage after login
  const { mutate: verify2FA, isPending } = useVerifyLogin2FA();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6 || !email) return;
    verify2FA({ email, otp });
  };

  return (
    <AuthLayout>
      <div className="min-h-screen flex items-center justify-center px-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md space-y-4"
        >
          <h2 className="text-2xl font-semibold text-center">Login with 2FA</h2>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <OTPInput value={otp} onChange={setOtp} />
          <Button className="w-full" type="submit" disabled={isPending}>
          {isPending ? "Verifying..." : "Verify"}
          </Button>
        </form>
      </div>
    </AuthLayout>
  );
};

export default VerifyLogin2FA;
