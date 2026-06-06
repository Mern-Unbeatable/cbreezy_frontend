import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  resendRegistrationOtp,
  selectPendingRegistrationEmail,
  selectResendOtpLoading,
  selectVerifyOtpLoading,
  setPendingRegistrationEmail,
  verifyRegistrationOtp,
} from "../../features/auth/authSlice";

export default function VerifyRegistrationOTP() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const storedEmail = useSelector(selectPendingRegistrationEmail);
  const verifying = useSelector(selectVerifyOtpLoading);
  const resending = useSelector(selectResendOtpLoading);
  const [otp, setOtp] = useState(["", "", "", "", ""]);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const inputRefs = useRef([]);

  const registrationEmail = storedEmail || location.state?.email || "";

  useEffect(() => {
    if (location.state?.email && !storedEmail) {
      dispatch(setPendingRegistrationEmail(location.state.email));
    }
  }, [dispatch, location.state?.email, storedEmail]);

  const handleChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e, startIndex) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    const digits = pastedText.replace(/\D/g, "").slice(0, otp.length - startIndex).split("");

    if (digits.length === 0) return;

    const newOtp = [...otp];
    digits.forEach((digit, idx) => {
      newOtp[startIndex + idx] = digit;
    });

    setOtp(newOtp);

    const nextIndex = Math.min(startIndex + digits.length, otp.length - 1);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!registrationEmail) {
      setError("Registration email not found. Please sign up again.");
      return;
    }

    const otpCode = otp.join("");
    if (otpCode.length !== 5) {
      setError("Please enter the complete 5-digit code");
      return;
    }

    setError("");
    try {
      await toast.promise(
        dispatch(
          verifyRegistrationOtp({
            email: registrationEmail,
            otp: otpCode,
          })
        ).unwrap(),
        {
          pending: "Verifying OTP...",
          success: "Registration verified successfully",
          error: {
            render({ data }) {
              return data || "OTP verification failed";
            },
          },
        }
      );

      navigate("/login");
    } catch (err) {
      setError(err || "OTP verification failed");
    }
  };

  const handleResend = async () => {
    if (!registrationEmail) {
      setError("Registration email not found. Please sign up again.");
      return;
    }

    setOtp(["", "", "", "", ""]);
    setError("");

    try {
      await toast.promise(
        dispatch(resendRegistrationOtp({ email: registrationEmail })).unwrap(),
        {
          pending: "Resending OTP...",
          success: "OTP resent to your email",
          error: {
            render({ data }) {
              return data || "Failed to resend OTP";
            },
          },
        }
      );

      setResendTimer(30);
    } catch (err) {
      setError(err || "Failed to resend OTP");
      return;
    }

    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    inputRefs.current[0]?.focus();
  };

  return (
    <div className="min-h-screen flex items-center justify-center font-serif bg-[#fdf2eb]">
      <div className="w-full max-w-md px-6">
        <div className="bg-[#F8D6C0] rounded-lg shadow-lg p-8 border border-[#e0d0bc]">
          <h1 className="text-2xl font-bold text-center text-[#1a1a1a] mb-2 font-serif">
            Verify Registration OTP
          </h1>
          <p className="text-base text-center text-[#6b6b6b] mb-6 leading-relaxed">
            Enter the 5-digit verification code sent to {registrationEmail || "your email"}.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-[#fff0f0] border border-[#f5c6c6] rounded text-[#c0392b] text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleVerify}>
            <div className="flex justify-center gap-3 mb-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={(e) => handlePaste(e, index)}
                  placeholder="0"
                  className="w-14 h-14 text-center text-lg font-bold border-2 border-[#E97C35] rounded text-[#333] outline-none focus:bg-white focus:border-[#E97C35] transition-all"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={verifying}
              className="w-full py-3 bg-[#E97C35] text-white border-0 rounded text-base font-bold cursor-pointer tracking-wide mb-4"
            >
              {verifying ? "Verifying..." : "Verify Account"}
            </button>
          </form>

          <div className="text-center text-sm text-[#555]">
            Didn&apos;t receive a code?{" "}
            <button
              onClick={handleResend}
              disabled={resendTimer > 0 || resending}
              className="text-[#e07b39] font-bold bg-none border-none cursor-pointer hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resending ? "Resending..." : resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}