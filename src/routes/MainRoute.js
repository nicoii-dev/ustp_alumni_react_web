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
import ReportsPage from "../pages/Admin/ReportsPage";
import UsersPage from "../pages/Admin/UsersPage";
// user
import HomePage from "../pages/User/HomePage";
import AboutPage from "../pages/User/AboutPage";
// labandero
import LabanderoDashboardPage from "../pages/Labandero/LabanderoDashboardPage";
import LabanderoProfilePage from "../pages/Labandero/LabanderoProfilePage";
// shop
import ShopDashboardPage from "../pages/LaundryShop/Shop/ShopDashboardPage";
import ServicesPage from "../pages/LaundryShop/ServicesPage";
import EmailVerification from "../pages/Auth/EmailVerification";
import ShopProfilePage from "../pages/LaundryShop/ShopProfilePage";

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
          <Route path="users" element={<UsersPage />} />
          <Route path="home" element={<HomePage />} />
          <Route
            path="*"
            element={<Navigate to="404" state={{ from: location }} replace />}
          />
        </Route>
        <Route path="404" element={<Page404 />} />
      </Routes>
    );
  }

  if (userData?.role === "user") {
    return (
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="home" element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route
            path="*"
            element={<Navigate to="404" state={{ from: location }} replace />}
          />
        </Route>
        <Route path="404" element={<Page404 />} />
      </Routes>
    );
  }

  if (userData?.role === "labandero") {
    return (
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="home" element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="profile" element={<LabanderoProfilePage />} />
          <Route
            path="*"
            element={<Navigate to="404" state={{ from: location }} replace />}
          />
        </Route>
        <Route path="404" element={<Page404 />} />
      </Routes>
    );
  }

  if (userData?.role === "shop") {
    return (
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route path="/" element={<ShopDashboardPage />} />
          <Route path="shops" element={<ShopDashboardPage />} />
          <Route path="home" element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          {/* <Route path="services" element={<ServicesPage />} />
          <Route path="profile" element={<ShopProfilePage />} /> */}
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
      {/* <Route path="*" element={<Navigate to="/404" state={{ from: location }} replace />} /> */}
    </Routes>
  );
}
