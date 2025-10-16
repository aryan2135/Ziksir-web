// components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState, ReactNode } from "react";
import userProfileStore from "@/store/userProfileStore";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { userData, setUserProfile } = userProfileStore();
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuth, setIsAuth] = useState<boolean>(false);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const client = await axios.get(
          `${import.meta.env.VITE_API_URI}/api/user/auth/verification`,
          { withCredentials: true }
        );
        setIsAuth(true);
        setUserProfile(client.data.user);
        localStorage.setItem(
          "currentUser",
          JSON.stringify({
            ...client.data.user,
            fullName: client.data.user.name,
            department: client.data.user.organizationAddress,
            organization: client.data.user.organizationCategory,
          })
        );
        localStorage.setItem("isAuthenticated", "true");
      } catch (error) {
        setIsAuth(false);
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, []);

  if (loading) return <div>Loading...</div>;

  return isAuth ? <>{children}</> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
