import React from "react";
import {Toaster} from 'react-hot-toast';
import { Route, Routes } from "react-router-dom";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import VerifyOtp from "./pages/VerifyOtp";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import useGetCurrentUser from "./hooks/useGetCurrentUser";
export const serverUrl = "http://localhost:8000";
function App() {
  useGetCurrentUser();
  return (
    <>
    <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000
        }}
      />
    <Routes>
      <Route path="/signup" element={<SignUp />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/signin" element={<SignIn />} />
    </Routes>
    </>
  );
}

export default App;
