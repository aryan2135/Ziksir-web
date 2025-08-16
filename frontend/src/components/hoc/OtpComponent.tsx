import React, { useRef } from "react";
import { Input } from "@/components/ui/input";

interface OtpComponentProps {
  otp: string[];
  setOtp: React.Dispatch<React.SetStateAction<string[]>>;
}

const OtpComponent: React.FC<OtpComponentProps> = ({ otp, setOtp }) => {
  const inputsRef = useRef<HTMLInputElement[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;
    if (/^\d$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (index < inputsRef.current.length - 1) {
        inputsRef.current[index + 1]?.focus();
      }
    } else {
      e.target.value = "";
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        // Agar current box me value h toh pehle clear kare
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        // Agar khali h toh pichle box me jaye
        inputsRef.current[index - 1]?.focus();
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <p className="text-sm text-blue-500 font-semibold">
        Enter the OTP sent to your email
      </p>
      <div className="flex gap-3 justify-center">
        {Array.from({ length: 4 }).map((_, i) => (
          <Input
            key={i}
            type="text"
            inputMode="numeric"
            maxLength={1}
            className="w-12 sm:w-14 min-h-[3.2rem] text-center text-lg border border-gray-400 rounded-md focus:border-blue-500 focus:border-0"
            ref={(el) => {
              if (el) inputsRef.current[i] = el;
            }}
            value={otp[i] || ""}
            onChange={(e) => handleChange(e, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
          />
        ))}
      </div>
    </div>
  );
};

export default OtpComponent;
