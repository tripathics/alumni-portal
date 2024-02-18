import { Outlet } from "react-router-dom";
import Navbar from "./navigation/Navigation";

const Layout = () => {
  return (
    <div className="__layout">
      <Navbar />
      <main className="__layout-main">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
