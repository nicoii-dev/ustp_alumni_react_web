import {
  Routes,
  Route,
  Navigate,
  useLocation,
  Switch,
  Outlet,
} from "react-router-dom";
//
import { getLocalStorageItem } from "../lib/util/getLocalStorage";

// pages
import DashboardLayout from "../components/layout/dashboard";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import Page404 from "../pages/Page404";
// admin
import AdminDashboardPage from "../pages/Admin/AdminDashboardPage";
import FreedomWallPage from "../pages/Admin/FreedomWallPage";
import AnnouncementsPage from "../pages/Admin/AnnounementsPage";
import EventsPage from "../pages/Admin/EventsPage";
import AlumniListPage from "../pages/Admin/AlumniListPage";
import JobPostingPage from "../pages/Admin/JobPostingPage";

import EmailVerification from "../pages/Auth/EmailVerification";

// ----------------------------------------------------------------------

export default function MainRoute() {
  const location = useLocation();
  const userData = getLocalStorageItem("userData");

  if (userData?.role === "admin") {
    return (
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route path="/" element={<AdminDashboardPage />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="freedom-wall" element={<FreedomWallPage />} />
          <Route path="announcements" element={<AnnouncementsPage />} />
          <Route path="events" element={<EventsPage />} />
          <Route path="alumni-list" element={<AlumniListPage />} />
          <Route path="job-posting" element={<JobPostingPage />} />
          <Route
            path="*"
            element={<Navigate to="404" state={{ from: location }} replace />}
          />
        </Route>
        <Route path="404" element={<Page404 />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="verify">
        <Route path=":email/:token" element={<EmailVerification />} />
      </Route>
      <Route path="404" element={<Page404 />} />
      <Route path="*" element={<Navigate to="/404" state={{ from: location }} replace />} />
    </Routes>
  );
}
