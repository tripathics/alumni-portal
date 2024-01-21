import Navigation from "./Navigation/Navigation";
import { Outlet } from "react-router";

const Layout = () => {
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
