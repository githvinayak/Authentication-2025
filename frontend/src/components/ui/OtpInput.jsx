// components/OtpInput.jsx
import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";

const OtpInput = ({ value, onChange, length = 6 }) => {
  const inputs = useRef([]);
  const [otp, setOtp] = useState(new Array(length).fill(""));

  const handleChange = (el, index) => {
    const val = el.target.value.replace(/\D/, ""); // Allow only digits
    if (!val) return;

    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);
    onChange(newOtp.join(""));

    // Focus next input
    if (index < length - 1 && val) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  return (
    <div className="flex gap-2 justify-center">
      {otp.map((digit, i) => (
        <Input
          key={i}
          ref={(el) => (inputs.current[i] = el)}
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          className="w-12 h-12 text-center text-xl"
        />
      ))}
    </div>
  );
};

export default OtpInput;