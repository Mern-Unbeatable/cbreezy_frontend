import { useState } from "react";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  clearPendingResetFlow,
  resetPassword,
  selectPendingResetEmail,
  selectPendingResetOtp,
  selectResetPasswordLoading,
} from "../../features/auth/authSlice";

export default function ResetPassword() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const storedResetEmail = useSelector(selectPendingResetEmail);
  const storedResetOtp = useSelector(selectPendingResetOtp);
  const isResetting = useSelector(selectResetPasswordLoading);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const resetEmail = storedResetEmail || location.state?.email || "";
  const verifiedOtp = storedResetOtp || location.state?.otp || "";

  const handleReset = async (e) => {
    e.preventDefault();

    if (!resetEmail || !verifiedOtp) {
      setError("Reset session expired. Please verify OTP again.");
      return;
    }

    if (!password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError("");

    try {
      await toast.promise(
        dispatch(
          resetPassword({
            email: resetEmail,
            otp: verifiedOtp,
            password,
            confirmPassword,
          })
        ).unwrap(),
        {
          pending: "Resetting password...",
          success: "Password reset successfully",
          error: {
            render({ data }) {
              return data || "Password reset failed";
            },
          },
        }
      );

      dispatch(clearPendingResetFlow());
      setSuccess("Password reset successfully!");
      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      setError(err || "Password reset failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center font-serif bg-[#fdf2eb]">
      <div className="w-full max-w-md px-6">
        <div className="bg-[#F8D6C0] rounded-lg shadow-lg p-8 border border-[#e0d0bc]">
          <h1 className="text-2xl font-bold text-center text-[#1a1a1a] mb-2 font-serif">
            Reset Password
          </h1>
          <p className="text-sm text-center text-[#6b6b6b] mb-6 leading-relaxed">
            Create a new password. It must be at least 8 characters.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-[#F5C3A2] border border-[#f5c6c6] rounded text-[#c0392b] text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-[#F5C3A2] border border-[#c6f6c6] rounded text-[#2d7a6e] text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleReset}>
            {/* Password */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-[#333] mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="8+ characters"
                  className="w-full px-4 py-3 bg-[#F5C3A2] border border-[#ddc8aa] rounded text-sm text-[#333] outline-none font-sans box-border focus:bg-white focus:border-[#e07b39] transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#333] transition-colors"
                >
                  {showPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-[#333] mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="w-full px-4 py-3 bg-[#F5C3A2] border border-[#ddc8aa] rounded text-sm text-[#333] outline-none font-sans box-border focus:bg-white focus:border-[#e07b39] transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#333] transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isResetting}
              className="w-full py-3 bg-[#e07b39] text-white border-0 rounded text-base font-bold cursor-pointer tracking-wide hover:bg-[#c9692a] transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isResetting ? "RESETTING..." : "RESET PASSWORD"}
              <span><ArrowRight /></span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
