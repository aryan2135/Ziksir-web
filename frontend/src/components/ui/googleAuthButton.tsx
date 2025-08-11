import React, { ReactNode } from "react";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";

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
        className="w-full py-5 px-6 font-medium text-gray-700 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-300 bg-white hover:bg-gray-50 flex items-center gap-2"
      >
        <img
          src="https://grafik.agency/wp-content/uploads/Google-G.jpg"
          alt=""
          className="w-14 h-6"
        />
        <span className="text-sm sm:text-base">{children}</span>
      </Button>
    </>
  );
};
export default GoogleAuthButton;