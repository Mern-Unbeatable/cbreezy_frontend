import SEO from "../../components/SEO";
import { useContext, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { AuthContext, ROLES, normalizeAppRole } from "../../context/AuthContext";
import { STORAGE_KEYS } from "../../utils/constants";
import { signInWithPopup } from "firebase/auth";
import {
  loginUser,
  loginWithFirebase,
  selectFirebaseLoginLoading,
  selectLoginLoading,
} from "../../features/auth/authSlice";
import { firebaseAuth, googleProvider } from "../../services/firebase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isLoggingIn = useSelector(selectLoginLoading);
  const isGoogleLoggingIn = useSelector(selectFirebaseLoginLoading);

  useEffect(() => {
    if (searchParams.get("session") === "expired") {
      setError("Your session expired. Please sign in again.");
    }
  }, [searchParams]);

  const getErrorMessage = (err, fallbackMessage) => {
    if (!err) return fallbackMessage;

    if (typeof err === "string") return err;

    const firebaseCode = err?.code;
    const firebaseMessages = {
      "auth/popup-closed-by-user": "Google sign-in was cancelled.",
      "auth/popup-blocked": "Popup was blocked. Please allow popups and try again.",
      "auth/configuration-not-found": "Firebase Auth configuration missing. Enable Authentication and Google provider in Firebase console for this project.",
      "auth/unauthorized-domain": "This domain is not authorized in Firebase Authentication.",
      "auth/operation-not-allowed": "Google sign-in is not enabled in Firebase console.",
      "auth/invalid-api-key": "Firebase API key is invalid or restricted for this domain.",
      "auth/network-request-failed": "Network issue while contacting Firebase. Please try again.",
    };

    if (firebaseCode && firebaseMessages[firebaseCode]) {
      return firebaseMessages[firebaseCode];
    }

    return (
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err?.message ||
      fallbackMessage
    );
  };

  /**
   * Handle regular login (form submission)
   * Defaults to USER role for regular login
   */
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    setError("");

    try {
      const response = await toast.promise(
        dispatch(loginUser({ email, password })).unwrap(),
        {
          pending: "Signing in...",
          success: "Login successful",
          error: {
            render({ data }) {
              return getErrorMessage(data, "Login failed. Please try again.");
            },
          },
        }
      );

      const data = response?.data || response?.result || response;
      const userFromApi = data?.user || data;
      const token = data?.token || data?.accessToken || userFromApi?.token;
      const userRole = normalizeAppRole(userFromApi?.role || data?.role);

      const userData = {
        email: userFromApi?.email || email,
        name: userFromApi?.fullName || userFromApi?.name || email.split("@")[0],
      };

      if (token) {
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      }

      login(userData, userRole);

      if (userRole === ROLES.ADMIN) {
        navigate("/admin/dashboard");
      } else if (userRole === ROLES.SUB_ADMIN) {
        navigate("/admin/listings");
      } else {
        navigate("/profile");
      }
    } catch (err) {
      setError(getErrorMessage(err, "Login failed. Please try again."));
    }
  };

  const handleGoogleLogin = async () => {
    setError("");

    try {
      const response = await toast.promise(
        (async () => {
          const firebaseResult = await signInWithPopup(firebaseAuth, googleProvider);
          const idToken = await firebaseResult.user.getIdToken();
          return dispatch(loginWithFirebase(idToken)).unwrap();
        })(),
        {
          pending: "Signing in with Google...",
          success: "Google login successful",
          error: {
            render({ data }) {
              return getErrorMessage(data, "Google login failed. Please try again.");
            },
          },
        }
      );

      const data = response?.data || response?.result || response;
      const userFromApi = data?.user || data;
      const token = data?.token || data?.accessToken || userFromApi?.token;
      const userRole = normalizeAppRole(userFromApi?.role || data?.role);

      const userData = {
        email: userFromApi?.email || "",
        name: userFromApi?.fullName || userFromApi?.name || "User",
      };

      if (token) {
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      }

      login(userData, userRole);

      if (userRole === ROLES.ADMIN) {
        navigate("/admin/dashboard");
      } else if (userRole === ROLES.SUB_ADMIN) {
        navigate("/admin/listings");
      } else {
        navigate("/profile");
      }
    } catch (err) {
      setError(getErrorMessage(err, "Google login failed. Please try again."));
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-serif bg-[#FDF2EB]">
      <SEO title="Sign In | SideGurus Local & Weekend Side Jobs" description="Sign in to your SideGurus account to manage local side jobs, weekend side hustles, and flexible side gigs near you." />
      {/* Left Side - Hidden on Mobile */}
      <div className="hidden md:flex w-full md:w-1/2 bg-[#FDF2EB] items-center justify-center p-10" style={{ borderRightColor: 'rgba(0, 0, 0, 0.08)', boxShadow: 'inset -15px 0 15px -10px rgba(0, 0, 0, 0.08)' }}>
        <a href="/" aria-label="Go to home">
          <img src="/logo.png" alt="logo" className="w-32 md:w-150" />
        </a>
      </div>

      {/* Right Side - Full width on mobile */}
      <div className="w-full md:w-1/2 bg-[#FDF2EB] flex items-center justify-center flex-1 p-4 md:p-0">
        <div className="w-full max-w-xs">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 inline-flex items-center gap-2 text-[#e07b39] hover:text-[#cf6d2e] transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">Back</span>
          </button>
          <h1 className="text-2xl font-bold mb-2 text-center ">
            Log In to Your Account
          </h1>
          <p className="text-base text-[#373737] text-center mb-7 leading-relaxed">
            Access your account to manage your listings, post new ads, and keep track of your services or events.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-[#fff0f0] border border-[#f5c6c6] rounded text-[#c0392b] text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            {/* Email */}
            <div className="mb-4">
              <label className="block text-base font-semibold  mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email here..."
                className="w-full px-3.5 py-2.5 bg-[#F8D6C0] border border-[#ddc8aa] rounded text-sm text-[#333] outline-none font-sans box-border focus:bg-white focus:border-[#e07b39] transition-all placeholder:text-[#373737] placeholder:opacity-80"
              />
            </div>

            {/* Password */}
            <div className="mb-5">
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-sm font-semibold text-[#333]">Password</label>
             
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password here..."
                  className="w-full h-11 px-3.5 pr-10 bg-[#F8D6C0] border border-[#ddc8aa] rounded text-sm text-[#333] outline-none font-sans box-border focus:bg-white focus:border-[#e07b39] transition-all placeholder:text-[#373737] placeholder:opacity-80"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#e07b39]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
               <a href="/forgot-password" className="text-xs text-[#e07b39] no-underline font-medium text-right block mt-2">
                  Forget Password?
                </a>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn || isGoogleLoggingIn}
              className="w-full py-3 bg-[#E97C35] text-white border-0 rounded text-base font-bold cursor-pointer "
            >
              {isLoggingIn ? "Signing In..." : "Sign In"}
            </button>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoggingIn || isGoogleLoggingIn}
              className="w-full mt-3 py-3 bg-white border border-[#d7d2cc] text-[#333] rounded text-base font-semibold cursor-pointer hover:bg-[#faf7f4] transition-colors"
            >
              {isGoogleLoggingIn ? "Signing In with Google..." : "Continue with Google"}
            </button>
          </form>

          <div className="text-center mt-4 text-sm text-[#555]">
            Don&apos;t Have an account?{" "}
            <a href="/signup" className="text-[#e07b39] font-bold no-underline ">Sign Up</a>
          </div>

        </div>
      </div>
    </div>
  );
}