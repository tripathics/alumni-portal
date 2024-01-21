import useUser from "@/hooks/useUser";
import Header from "@/components/layouts/PageHeader";
import { Navigate, Outlet, useLocation } from "react-router";

const LoadingComponent = () => (
  <>
    <Header
      pageHeading="Loading..."
      subHeading={"Please wait while we load the page."}
    />
    <div className="container __page-content"></div>
  </>
);

const ProtectedRoutes = ({ adminRoute = false }) => {
  const {
    loading,
    user,
    admin,
    // checkAuth
  } = useUser();

  const location = useLocation();

  return loading ? (
    <LoadingComponent />
  ) : user === null || (adminRoute && !admin) ? (
    <Navigate to="/login" state={{ from: location }} />
  ) : (
    <Outlet />
  );
};

export default ProtectedRoutes;
