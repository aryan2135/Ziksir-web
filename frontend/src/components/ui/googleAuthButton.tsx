import React, { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";

interface GoogleAuthButtonProps {
  children: ReactNode;
  onClick?: () => void;
}

const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({
  children,
  onClick,
}) => {
  return (
    <>
      <div className="flex items-center my-6">
        <div className="flex-grow h-px bg-gray-300"></div>
        <span className="mx-4 text-gray-500 text-sm bg-white px-2">or</span>
        <div className="flex-grow h-px bg-gray-300"></div>
      </div>
      <Button
        onClick={onClick}
        variant="outline"
        className="w-full py-5 px-4 font-medium text-gray-700 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-300 bg-white hover:bg-gray-50 flex items-center justify-center gap-2"
      >
        <FcGoogle className="text-lg sm:text-xl" />
        <span className="text-sm sm:text-base">{children}</span>
      </Button>
    </>
  );
};

export default GoogleAuthButton;
