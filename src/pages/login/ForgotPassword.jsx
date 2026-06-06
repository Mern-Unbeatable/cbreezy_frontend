import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  forgotPassword,
  selectForgotPasswordLoading,
  setPendingResetEmail,
} from "../../features/auth/authSlice";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const sendingCode = useSelector(selectForgotPasswordLoading);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSendCode = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setError("");
    setSuccess("");

    try {
      await toast.promise(dispatch(forgotPassword({ email })).unwrap(), {
        pending: "Sending reset code...",
        success: "Reset code sent to your email",
        error: {
          render({ data }) {
            return data || "Failed to send reset code";
          },
        },
      });

      dispatch(setPendingResetEmail(email));
      setSuccess("Reset code sent to your email address");
      setTimeout(() => {
        navigate("/otp-verification", { state: { email } });
      }, 1200);
    } catch (err) {
      setError(err || "Failed to send reset code");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center  bg-[#FDF2EB]">
      <div className="w-full max-w-md px-6">
        <div className="bg-[#F8D6C0] rounded-lg shadow-lg p-8 border border-[#e0d0bc]">
          <h1 className="text-2xl font-bold text-center text-[#0C0C0C] mb-2 ">
            Forgot Password
          </h1>
          <p className="text-base text-center text-[#373737] mb-6 leading-relaxed">
            Enter your email address linked to your account.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-[#fff0f0] border border-[#f5c6c6] rounded text-[#c0392b] text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-[#f0fff0] border border-[#c6f6c6] rounded text-[#2d7a6e] text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSendCode}>
            {/* Email */}
            <div className="mb-6">
              <label className="block text-base font-semibold text-[#333] mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full px-4 py-3 bg-[#F5C3A2] border border-[#ddc8aa] rounded text-sm text-[#333] outline-none font-sans box-border focus:bg-white focus:border-[#e07b39] transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={sendingCode}
              className="w-full py-3 bg-[#E97C35] text-white border-0 rounded text-base font-bold cursor-pointer tracking-wide mb-1  transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {sendingCode ? "SENDING..." : "SEND CODE"}
              <span><ArrowRight /></span>
            </button>
          </form>

          <div className=" mt-6 space-y-2 text-sm text-[#373737]">
            <p>
              Already have an account?{" "}
              <a href="/login" className="text-[#e07b39] font-bold no-underline hover:opacity-80 transition-opacity">
                Sign In
              </a>
            </p>
            <p>
              New to Sidegurus?{" "}
              <a href="/signup" className="text-[#e07b39] font-bold no-underline hover:opacity-80 transition-opacity">
                Create an account
              </a>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-[#e0d0bc] text-center text-sm text-[#0C0C0C]">
            Need help? <span className="font-semibold text-[#0C0C0C]">Contact Customer Support</span> and we&apos;ll assist you.
          </div>
        </div>
      </div>
    </div>
  );
}
