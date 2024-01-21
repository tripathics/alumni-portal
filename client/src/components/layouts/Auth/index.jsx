import { Outlet } from "react-router";

const AuthLayout = () => (
  <div className="__layout">
    <main className="__layout-main">
      <Outlet />
    </main>
  </div>
);

export default AuthLayout;
