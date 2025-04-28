import { Lock, CheckCircle } from "lucide-react";
import auth from "../assets/password.png";
import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useVerifyEmail } from "@/hooks/auth/userVerifyEmail";

const Verify = () => {
  const { token } = useParams();
  const {
    mutate: verify,
    data,
    isSuccess,
    isPending,
    isError,
    error,
  } = useVerifyEmail();

  useEffect(() => {
    if (token) verify(token);
  }, [token]);
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md text-center space-y-6 flex flex-col items-center justify-center">
        {/* Header */}
        <div className="flex justify-center items-center text-4xl font-bold">
          <img src={auth} alt="auth" className="h-9 w-9" />
          <h1>Auth</h1>
        </div>

        {/* Subheading */}
        <p className="text-gray-500 text-sm">Confirming your verification</p>

        {/* Pending */}
        {isPending && (
          <div className="text-blue-500 font-medium text-sm px-4 py-2 rounded flex items-center justify-center gap-2 max-w-fit">
            <Loader2 className="w-4 h-4 animate-spin" />
            Verifying email...
          </div>
        )}

        {isSuccess && (
          <div className="bg-green-100 text-green-700 font-medium text-sm px-4 py-2 rounded flex items-center justify-center gap-2 max-w-fit">
            <CheckCircle className="w-4 h-4" />
            {data.message || "Email verified!"}
          </div>
        )}

        {isError && (
          <div className="bg-red-100 text-red-700 font-medium text-sm px-4 py-2 rounded flex items-center justify-center gap-2 max-w-fit">
            <XCircle className="w-4 h-4" />
            {error.response?.data?.message || "Verification failed"}
          </div>
        )}

        {/* Back to login */}
        <Link
          to="/login"
          className="text-sm text-gray-700 hover:underline block"
        >
          Back to login
        </Link>
      </div>
    </div>
  );
};

export default Verify;
