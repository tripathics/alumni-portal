import { useEffect } from "react";
import { useUser } from "@/contexts/user";
import Header from "@/components/layouts/PageHeader";
import { NavLink } from "react-router-dom";

const UnauthorizedComponent = () => (
  <>
    <Header
      pageHeading="Unauthorized"
      subHeading={"You are not authorized to view this page."}
    />
    <div className="container __page-content">
      <p>If you are authorized, you can proceed by logging in.</p>
      <NavLink to="/login" className="btn primary">
        Login
      </NavLink>
    </div>
  </>
);

const LoadingComponent = () => (
  <>
    <Header
      pageHeading="Loading..."
      subHeading={"Please wait while we load the page."}
    />
    <div className="container __page-content"></div>
  </>
);

const ProtectedComponent = ({ children, adminComponent = false }) => {
  const { loading, user, admin, checkAuth } = useUser();

  useEffect(() => {
    checkAuth();
  }, []);

  return loading ? (
    <LoadingComponent />
  ) : user === null ? (
    <UnauthorizedComponent />
  ) : adminComponent ? (
    admin ? (
      children
    ) : (
      <UnauthorizedComponent />
    )
  ) : (
    children
  );
};

export default ProtectedComponent;
