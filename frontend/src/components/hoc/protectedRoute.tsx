// components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState, ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuth, setIsAuth] = useState<boolean>(false);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        await axios.get(
          `${import.meta.env.VITE_API_URI}/api/user/auth/verification`,
          { withCredentials: true }
        );
        setIsAuth(true);
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
