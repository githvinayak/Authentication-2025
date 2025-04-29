import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Verify from "./pages/Verify";
import Settings from "./pages/Settings";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Disable2FA from "./pages/Disable2FA";
import Verify2FA from "./pages/Verify2FA";
import VerifyLogin2FA from "./pages/VerifyLogin2FA";
import Home from "./pages/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email" element={<Verify />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/disable-2fa" element={<Disable2FA />} />
        <Route path="/verify-2fa" element={<Verify2FA />} />
        <Route path="/verify-login-2fa" element={<VerifyLogin2FA />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
