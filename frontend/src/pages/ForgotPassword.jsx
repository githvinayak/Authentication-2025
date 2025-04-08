import { Lock } from "lucide-react";
import { useState } from "react";
import auth from "../assets/password.png";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import AuthLayout from "@/components/AuthLayout";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  //   const handleSubmit = (e) => {
  //     e.preventDefault()
  //     // TODO: Handle forgot password logic
  //     console.log("Send password reset email to:", email)
  //   }

  return (
    <AuthLayout>
        <div className="flex items-center justify-center ">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md space-y-6">
        {/* Header */}
        <div className="flex justify-center items-center text-4xl font-bold">
          <img src={auth} alt="auth" className="h-9 w-9" />
          <h1>Auth</h1>
        </div>

        <p className="text-center text-gray-500 text-sm">Reset your password</p>

        <form className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Email
            </label>
            <Input
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition"
          >
            Send reset link
          </button>
        </form>

        <div className="text-center text-sm">
          <Link to="/login" className="text-gray-700 hover:underline">
            Back to login
          </Link>
        </div>
      </div>
    </div>
    </AuthLayout>
  );
};

export default ForgotPassword;
