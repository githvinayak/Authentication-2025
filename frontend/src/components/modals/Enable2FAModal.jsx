import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import OtpInput from "@/components/ui/OtpInput";
import { Button } from "@/components/ui/button";
import { useVerify2FA } from "@/hooks/auth/useVerify2FA";
import { useGetProfile } from "@/hooks/user/useGetProfile";
import { maskEmail } from "@/lib/maskEmail";

const Enable2FAModal = ({ open, onClose }) => {
  const enable2FA = useEnable2FA();
  const { data: profile } = useGetProfile();

  // const handleEnable = () => {
  //   enable2FA.mutate();
  //   setOpen(false);
  // };
  const [otp, setOtp] = useState("");
  const { mutate: verify2FA, isPending } = useVerify2FA();

  const handleVerify = () => {
    verify2FA(
      { otp },
      {
        onSuccess: () => {
          onClose();
          setOtp("");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Verify Two-Factor Authentication</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-600">
          An OTP has been sent to your email:{" "}
          <span className="font-medium text-black">
            {profile?.email ? maskEmail(profile.email) : "your email"}
          </span>
        </p>

        <div className="space-y-4">
          <OtpInput value={otp} onChange={setOtp} />
          <Button
            onClick={handleVerify}
            disabled={isPending}
            className="w-full"
          >
            {isPending ? "Verifying..." : "Verify"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Enable2FAModal;
