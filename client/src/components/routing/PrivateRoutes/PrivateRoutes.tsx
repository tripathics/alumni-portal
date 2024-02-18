import useUser from "@/hooks/user";
import { Navigate, Outlet, useLocation } from "react-router";

const ProtectedRoutes = ({ adminRoute = false }) => {
  const { user, admin, loading } = useUser();

  const location = useLocation();

  return loading ? (
    <div>Loading...</div>
  ) : user === null || (adminRoute && !admin) ? (
    <Navigate to="/login" state={{ from: location.pathname }} />
  ) : (
    <Outlet />
  );
};

export default ProtectedRoutes;
