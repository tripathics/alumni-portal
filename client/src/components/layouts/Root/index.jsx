import Navigation from "./Navigation/Navigation";
import { Outlet, useLocation } from "react-router";

const Layout = () => {
  const location = useLocation();
  if (["/login", "/register"].includes(location.pathname)) {
    return (
      <div className="__layout">
        <main className="__layout-main">
          <Outlet />
        </main>
      </div>
    );
  }

  return (
    <div className="__layout">
      <Navigation />
      <main className="__layout-main">
        <Outlet />
      </main>
      {/* footer (maybe not required) */}
    </div>
  );
};
export default Layout;
