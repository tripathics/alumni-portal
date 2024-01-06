import { BrowserRouter, Routes, Route } from "react-router-dom";
import RootLayout from "./components/layouts/Root";
import UserProvider from "./contexts/user";
import { Home, Login, MembershipForm, Register } from "./views";
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
import ProtectedComponent from "./components/ProtectedComponent";

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <RootLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/profile"
              element={
                <ProtectedComponent>
                  <Profile />
                </ProtectedComponent>
              }
            >
              <Route path="" element={<PersonalProfile />} />
              <Route path="education" element={<Education />} />
              <Route path="experience" element={<Experience />} />
              <Route path="*" element={<h1>TODO</h1>} />
            </Route>
            <Route path="/admin" element={<Admin />}>
              <Route path="" element={<Dashboard />} />
              <Route path="annoucements" element={<Annoucements />} />
              <Route
                path="submission-updates"
                element={<SubmissionUpdates />}
              />
            </Route>
            <Route
              path="/membership-registration"
              element={
                <ProtectedComponent>
                  <MembershipForm />
                </ProtectedComponent>
              }
            />
            <Route path="*" element={<h1>404 Not found</h1>} />
          </Routes>
        </RootLayout>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
