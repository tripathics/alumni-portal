import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import RootLayout from "./components/layouts/Root";
import UserProvider from "./contexts/user";
import { Home, Login, About, Register } from "./views";
import Profile, {
  PersonalProfile,
  Education,
  Experience,
} from "./views/(dashboard)/Profile/page";
import Admin, {
  Annoucements,
  Dashboard,
  SubmissionUpdates,
} from "./views/(dashboard)/Admin/page";
import Alumni, { MembershipForm } from "./views/(dashboard)/Alumni/page";
import AuthLayout from "./components/layouts/Auth";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route element={<RootLayout />}>
        <Route path="" element={<Home />} />
        <Route path="about" element={<About />} />
        <Route element={<ProtectedRoutes />}>
          <Route path="admin" element={<Admin />}>
            <Route path="" element={<Dashboard />} />
            <Route path="annoucements" element={<Annoucements />} />
            <Route path="submission-updates" element={<SubmissionUpdates />} />
          </Route>
          <Route path="profile" element={<Profile />}>
            <Route path="" element={<PersonalProfile />} />
            <Route path="education" element={<Education />} />
            <Route path="experience" element={<Experience />} />
            <Route path="*" element={<h1>TODO</h1>} />
          </Route>
          <Route path="alumni-membership" element={<Alumni />}>
            <Route path="" element={<MembershipForm />} />
            <Route path="status" element={<h1>TODO</h1>} />
          </Route>
        </Route>
        <Route path="*" element={<h1>404 Not found</h1>} />
      </Route>
      <Route element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>
    </Route>
  )
);

function App() {
  return (
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  );
}

export default App;
