import { Navigate, Outlet } from "react-router-dom";

export default function ProtectRoutes({ allowedRoles }) {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("currentUser"));

    // Not logged in
    if (!token || !user) {
        return <Navigate to="/auth" replace />;
    }

    // Role not allowed
    console.log('allowed roles: ', allowedRoles);
    console.log('user role: ', allowedRoles.includes(user.role));
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />; 
    }

    return <Outlet />;
}
