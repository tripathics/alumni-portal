import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { UserProvider } from "./contexts/user";
import RootLayout from "./components/layouts/root";
import AuthLayout from "./components/layouts/auth";
import PrivateRoutes from "./components/routing/PrivateRoutes/PrivateRoutes";
import { Home, About, Login, Register } from "./views";
import Profile, {
  Education,
  Experience,
  PersonalProfile,
} from "./views/profile";
import Alumni, { MembershipForm } from "./views/alumni";

const router = createBrowserRouter([
  {
    path: "/",
    children: [
      {
        element: <RootLayout />,
        children: [
          { path: "", element: <Home /> },
          { path: "about", element: <About /> },
          {
            element: <PrivateRoutes />,
            children: [
              {
                path: "profile",
                element: <Profile />,
                children: [
                  { path: "", element: <PersonalProfile /> },
                  { path: "education", element: <Education /> },
                  { path: "experience", element: <Experience /> },
                  { path: "account", element: <h1>TODO: Account</h1> },
                ],
              },
              {
                path: "alumni-membership",
                element: <Alumni />,
                children: [
                  { path: "", element: <MembershipForm /> },
                  {
                    path: "status",
                    element: <h1>TODO: Status</h1>,
                  },
                ],
              },
            ],
          },
          { path: "*", element: <h1>Not Found</h1> },
        ],
      },
      {
        element: <AuthLayout />,
        children: [
          { path: "login", element: <Login /> },
          { path: "register", element: <Register /> },
        ],
      },
    ],
  },
]);

const App = () => {
  return (
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  );
};

export default App;
