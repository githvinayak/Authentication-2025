import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Lock } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import auth from "../assets/password.png";
import { Link } from "react-router-dom";
import AuthLayout from "@/components/AuthLayout";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <AuthLayout>
      <div className="flex items-center justify-center">
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md space-y-6">
          {/* Header */}
          <div className="text-center space-y-1">
            <div className="flex justify-center items-center text-4xl">
              <img src={auth} alt="auth" className="h-9 w-9" />
              <h1 className="font-bold">Auth</h1>
            </div>
            <p className="text-gray-500 text-sm">Welcome back</p>
          </div>

          {/* Login Form */}
          <form className="space-y-4">
            {/* Email */}
            <div>
              <label className="block mb-1 text-sm font-medium">Email</label>
              <Input type="email" placeholder="john.doe@example.com" required />
            </div>

            {/* Password with toggle */}
            <div>
              <label className="block mb-1 text-sm font-medium">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="******"
                  className="pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-right text-sm">
              <Link
                to="/forgot-password"
                className="text-gray-500 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <Button type="submit" className="w-full bg-black hover:bg-gray-900">
              Login
            </Button>
          </form>

          {/* OAuth Buttons */}
          <div className="flex gap-4">
            <Button
              variant="outline"
              className="w-full flex justify-center items-center gap-2"
            >
              <FcGoogle size={18} />
            </Button>
            <Button
              variant="outline"
              className="w-full flex justify-center items-center gap-2"
            >
              <FaGithub size={18} />
            </Button>
          </div>

          {/* Bottom Link */}
          <p className="text-sm text-center font-medium text-gray-600">
            Don't have an account?
            <Link
              to="/register"
              className="text-black font-semibold hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;
