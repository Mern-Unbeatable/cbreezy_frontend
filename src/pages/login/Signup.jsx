import { useContext, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { signInWithPopup } from "firebase/auth";
import { AuthContext, ROLES } from "../../context/AuthContext";
import {
  clearRegions,
  fetchCountries,
  fetchRegionsByCountry,
  registerWithFirebase,
  registerUser,
  selectCountries,
  selectCountriesLoading,
  selectFirebaseRegisterLoading,
  selectRegions,
  selectRegionsLoading,
  selectRegisterLoading,
} from "../../features/auth/authSlice";
import { firebaseAuth, googleProvider } from "../../services/firebase";

export default function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    location: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const countries = useSelector(selectCountries);
  const regions = useSelector(selectRegions);
  const loadingCountries = useSelector(selectCountriesLoading);
  const loadingRegions = useSelector(selectRegionsLoading);
  const isSubmitting = useSelector(selectRegisterLoading);
  const isGoogleSubmitting = useSelector(selectFirebaseRegisterLoading);

  const getErrorMessage = (err, fallbackMessage) => {
    if (!err) return fallbackMessage;
    if (typeof err === "string") return err;

    const firebaseCode = err?.code;
    const firebaseMessages = {
      "auth/popup-closed-by-user": "Google sign-up was cancelled.",
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

  const selectedCountry = useMemo(
    () => countries.find((country) => String(country.id) === String(formData.country)),
    [countries, formData.country]
  );

  const selectedRegion = useMemo(
    () => regions.find((region) => String(region.id) === String(formData.location)),
    [regions, formData.location]
  );

  useEffect(() => {
    dispatch(fetchCountries()).unwrap().catch(() => {});
  }, [dispatch]);

  useEffect(() => {
    if (!formData.country) {
      dispatch(clearRegions());
      return;
    }

    dispatch(fetchRegionsByCountry(formData.country)).unwrap().catch(() => {});
  }, [dispatch, formData.country]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "country" ? { location: "" } : {}),
    }));
    setError("");
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.country || !formData.location || !formData.password || !formData.confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/;
    if (!passwordRegex.test(formData.password)) {
      setError("Password must include uppercase, lowercase, number, and special character");
      return;
    }

    setError("");
    try {
      await toast.promise(
        dispatch(
          registerUser({
            fullName: formData.name,
            email: formData.email,
            password: formData.password,
            confirmPassword: formData.confirmPassword,
            phoneNumber: formData.phone || undefined,
            countryName: selectedCountry?.name || "",
            regionName: selectedRegion?.name || "",
          })
        ).unwrap(),
        {
          pending: "Creating account...",
          success: "Registration successful",
          error: {
            render({ data }) {
              return getErrorMessage(data, "Registration failed. Please try again.");
            },
          },
        }
      );

      navigate("/verify-registration-otp", { state: { email: formData.email } });
    } catch (err) {
      setError(getErrorMessage(err, "Registration failed. Please try again."));
    }
  };

  const handleGoogleSignup = async () => {
    setError("");

    try {
      const response = await toast.promise(
        (async () => {
          const firebaseResult = await signInWithPopup(firebaseAuth, googleProvider);
          const idToken = await firebaseResult.user.getIdToken();
          return dispatch(registerWithFirebase(idToken)).unwrap();
        })(),
        {
          pending: "Creating account with Google...",
          success: "Google signup successful",
          error: {
            render({ data }) {
              return getErrorMessage(data, "Google signup failed. Please try again.");
            },
          },
        }
      );

      const data = response?.data || response?.result || response;
      const userFromApi = data?.user || data;
      const token = data?.token || data?.accessToken || userFromApi?.token;
      const roleFromApi = String(userFromApi?.role || data?.role || ROLES.USER).toLowerCase();
      const userRole = roleFromApi === ROLES.ADMIN ? ROLES.ADMIN : ROLES.USER;

      const userData = {
        email: userFromApi?.email || "",
        name: userFromApi?.fullName || userFromApi?.name || "User",
      };

      if (token) {
        localStorage.setItem("authToken", token);
      }

      login(userData, userRole);

      if (userRole === ROLES.ADMIN) {
        navigate("/admin/dashboard");
      } else {
        navigate("/profile");
      }
    } catch (err) {
      setError(getErrorMessage(err, "Google signup failed. Please try again."));
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-serif bg-[#fdf2eb]">
    {/* Left Side - Hidden on Mobile */}
      <div className="hidden md:flex w-full md:w-1/2 bg-[#fdf2eb] items-center justify-center p-10" style={{ borderRightColor: 'rgba(0, 0, 0, 0.08)', boxShadow: 'inset -15px 0 15px -10px rgba(0, 0, 0, 0.08)' }}>
   <Link to="/" >
    <img src="/logo.png" alt="logo" className="w-32 md:w-200" />
   </Link>
      </div>

      {/* Right Side - Full width on mobile */}
      <div className="w-full md:w-1/2 bg-[#fdf2eb] flex items-center justify-center overflow-y-auto flex-1 p-4 md:p-8">
        <div className="w-full max-w-sm">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 inline-flex items-center gap-2 text-[#e07b39] hover:text-[#cf6d2e] transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">Back</span>
          </button>
          <h1 className="text-2xl font-bold text-[#1a1a1a] mb-2 text-center font-serif">
            Create Your Free Account
          </h1>
          <p className="text-sm text-[#6b6b6b] text-center mb-6 leading-relaxed">
            Sign up to start posting service or event listings, reach more people, and showcase what you offer.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-[#fff0f0] border border-[#f5c6c6] rounded text-[#c0392b] text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup}>
            {/* Name */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-[#333] mb-1.5">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name....."
                className="w-full px-3.5 py-2.5 bg-[#F8D6C0] border border-[#ddc8aa] rounded text-sm text-[#333] outline-none font-sans box-border focus:bg-white focus:border-[#e07b39] transition-all"
              />
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-[#333] mb-1.5">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email here..."
                className="w-full px-3.5 py-2.5 bg-[#F8D6C0] border border-[#ddc8aa] rounded text-sm text-[#333] outline-none font-sans box-border focus:bg-white focus:border-[#e07b39] transition-all"
              />
            </div>

            {/* Phone Number */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-[#333] mb-1.5">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number..."
                className="w-full px-3.5 py-2.5 bg-[#F8D6C0] border border-[#ddc8aa] rounded text-sm text-[#333] outline-none font-sans box-border focus:bg-white focus:border-[#e07b39] transition-all"
              />
            </div>

            {/* Country and Location */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-sm font-semibold text-[#333] mb-1.5">
                  Country
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className={`w-full px-3.5 py-2.5 border rounded text-sm text-[#333] outline-none font-sans box-border transition-all focus:border-[#e07b39] ${
                    formData.country ? "bg-[#F8D6C0] border-[#e07b39]" : "bg-[#F8D6C0] border-[#ddc8aa]"
                  }`}
                  disabled={loadingCountries}
                >
                  <option value="">{loadingCountries ? "Loading..." : "Select Country"}</option>
                  {countries.map((country) => (
                    <option key={country.id} value={country.id}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#333] mb-1.5">
                  Location
                </label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className={`w-full px-3.5 py-2.5 border rounded text-sm text-[#333] outline-none font-sans box-border transition-all focus:border-[#e07b39] ${
                    formData.location ? "bg-[#F8D6C0] border-[#e07b39]" : "bg-[#F8D6C0] border-[#ddc8aa]"
                  }`}
                  disabled={!formData.country || loadingRegions}
                >
                  <option value="">
                    {loadingRegions ? "Loading..." : formData.country ? "Select Region" : "Select Country First"}
                  </option>
                  {regions.map((region) => (
                    <option key={region.id} value={region.id}>
                      {region.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-[#333] mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="w-full h-11 px-3.5 pr-10 bg-[#F8D6C0] border border-[#ddc8aa] rounded text-sm text-[#333] outline-none font-sans box-border focus:bg-white focus:border-[#e07b39] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7a7a7a] hover:text-[#e07b39]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-[#333] mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  className="w-full h-11 px-3.5 pr-10 bg-[#F8D6C0] border border-[#ddc8aa] rounded text-sm text-[#333] outline-none font-sans box-border focus:bg-white focus:border-[#e07b39] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7a7a7a] hover:text-[#e07b39]"
                  aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isGoogleSubmitting}
              className="w-full py-3 bg-[#e07b39] text-white border-0 rounded text-base font-bold cursor-pointer tracking-wide hover:bg-[#c9692a] transition-colors"
            >
              {isSubmitting ? "Creating Account..." : "Sign Up"}
            </button>

            <button
              type="button"
              onClick={handleGoogleSignup}
              disabled={isSubmitting || isGoogleSubmitting}
              className="w-full mt-3 py-3 bg-white border border-[#d7d2cc] text-[#333] rounded text-base font-semibold cursor-pointer hover:bg-[#faf7f4] transition-colors"
            >
              {isGoogleSubmitting ? "Creating Account with Google..." : "Continue with Google"}
            </button>
          </form>

          <div className="text-center mt-4 text-sm text-[#555]">
            Already Have an account?{" "}
            <a href="/login" className="text-[#e07b39] font-bold no-underline hover:opacity-80 transition-opacity">Log In</a>
          </div>
        </div>
      </div>
    </div>
  );
}
