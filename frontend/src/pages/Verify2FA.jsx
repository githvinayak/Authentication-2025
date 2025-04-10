import { useState } from "react";
import OtpInput from "@/components/ui/OtpInput";
import { Button } from "@/components/ui/button";
import AuthLayout from "@/components/AuthLayout";

const Verify2FA = () => {
  const [otp, setOtp] = useState("");

  const handleSubmit = async () => {
    try {
      const res = await fetch("/api/auth/verify-2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ otp }),
      });

      const data = await res.json();
      console.log(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AuthLayout>
      <div className="max-w-md mx-auto p-4 space-y-4">
        <h2 className="text-2xl font-semibold text-center">Enter 2FA OTP</h2>
        <OtpInput value={otp} onChange={setOtp} />
        <Button className="w-full" onClick={handleSubmit}>
          Verify
        </Button>
      </div>
    </AuthLayout>
  );
};

export default Verify2FA;
