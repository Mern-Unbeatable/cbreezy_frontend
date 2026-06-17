import { useState, useRef, useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Camera, ChevronDown } from "lucide-react";
import { toast } from "react-toastify";
import { AuthContext } from "../../../context/AuthContext";
import {
  changeAccountPassword,
  clearRegions,
  fetchAccountSettings,
  fetchCountries,
  fetchRegionsByCountry,
  selectAccountSettingsData,
  selectAccountSettingsFetchError,
  selectAccountSettingsFetchLoading,
  selectAccountSettingsLoading,
  selectAccountSettingsError,
  selectChangePasswordLoading,
  selectChangePasswordError,
  selectCountries,
  selectCountriesError,
  selectCountriesLoading,
  selectRegions,
  selectRegionsError,
  selectRegionsLoading,
  updateAccountSettings,
} from "../../../features/auth/authSlice";

const InputField = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  rightIcon,
  disabled = false,
}) => (
  <div className="flex flex-col gap-1">
    {label && <label className="text-sm font-medium text-[#FFFFFF]">{label}</label>}
    <div className="relative">
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full bg-[#F8D6C0] text-[#2d2d2d] placeholder-[#9a8070] text-sm px-4 py-2.5 rounded focus:outline-none focus:ring-2 focus:ring-[#d4824a] transition disabled:cursor-not-allowed disabled:opacity-70"
      />
      {rightIcon && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b5a4e] cursor-pointer">
          {rightIcon}
        </span>
      )}
    </div>
  </div>
);

const SelectField = ({ label, placeholder, value, onChange, options = [], disabled = false }) => (
  <div className="flex flex-col gap-1">
    {label && <label className="text-sm font-medium text-[#FFFFFF]">{label}</label>}
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full appearance-none bg-[#F8D6C0] text-[#2d2d2d] text-sm px-4 py-2.5 rounded focus:outline-none focus:ring-2 focus:ring-[#d4824a] transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-70"
      >
        <option value="" disabled hidden>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={16}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b5a4e] pointer-events-none"
      />
    </div>
  </div>
);

const SectionCard = ({ title, children }) => (
  <div className="rounded-lg overflow-hidden border-2 border-[#E4E7E9]">
    <div className="bg-[#FDF2EB] px-6 py-5">
      <h2 className="text-xs font-bold tracking-widest uppercase text-[#3d3d3d]">{title}</h2>
    </div>
    <div className="bg-[#004C48] px-6 py-6">{children}</div>
  </div>
);

export default function AccountSettings() {
  const dispatch = useDispatch();
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const userName = user?.name || "";
  const accountSettingsData = useSelector(selectAccountSettingsData);
  const accountSettingsFetchLoading = useSelector(selectAccountSettingsFetchLoading);
  const accountSettingsFetchError = useSelector(selectAccountSettingsFetchError);
  const countries = useSelector(selectCountries);
  const regions = useSelector(selectRegions);
  const countriesError = useSelector(selectCountriesError);
  const regionsError = useSelector(selectRegionsError);
  const countriesLoading = useSelector(selectCountriesLoading);
  const regionsLoading = useSelector(selectRegionsLoading);
  const savingSettings = useSelector(selectAccountSettingsLoading);
  const changingPassword = useSelector(selectChangePasswordLoading);
  const accountSettingsError = useSelector(selectAccountSettingsError);
  const changePasswordError = useSelector(selectChangePasswordError);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [location, setLocation] = useState("");
  const [avatar, setAvatar] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const fileRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be 5MB or less");
        return;
      }

      const url = URL.createObjectURL(file);
      setAvatar(url);
      setAvatarFile(file);
    }
  };

  useEffect(() => {
    dispatch(fetchCountries());
    dispatch(fetchAccountSettings());
  }, [dispatch]);

  useEffect(() => {
    if (accountSettingsData) {
      setFullName(accountSettingsData.fullName || "");
      setEmail(accountSettingsData.email || "");
      setPhone(accountSettingsData.phoneNumber || "");
      setCountry(accountSettingsData.countryId ? String(accountSettingsData.countryId) : "");
      setAvatar(accountSettingsData.profileImage || "");
      setAvatarFile(null);
    }
  }, [accountSettingsData]);

  useEffect(() => {
    if (countriesError) {
      toast.error(countriesError);
    }
  }, [countriesError]);

  useEffect(() => {
    if (regionsError) {
      toast.error(regionsError);
    }
  }, [regionsError]);

  useEffect(() => {
    if (accountSettingsFetchError) {
      toast.error(accountSettingsFetchError);
    }
  }, [accountSettingsFetchError]);

  useEffect(() => {
    if (accountSettingsError) {
      toast.error(accountSettingsError);
    }
  }, [accountSettingsError]);

  useEffect(() => {
    if (changePasswordError) {
      toast.error(changePasswordError);
    }
  }, [changePasswordError]);

  useEffect(() => {
    if (!country) {
      dispatch(clearRegions());
      setLocation("");
      return;
    }

    dispatch(fetchRegionsByCountry(country));
    setLocation("");
  }, [country, dispatch]);

  useEffect(() => {
    if (accountSettingsData?.regionId) {
      setLocation(String(accountSettingsData.regionId));
    }
  }, [accountSettingsData?.regionId, regions]);

  const countryOptions = countries.map((item) => ({
    value: String(item.id),
    label: item.name,
  }));

  const locationOptions = regions.map((item) => ({
    value: String(item.id),
    label: item.name,
  }));

  const handleSaveChanges = async () => {
    if (!fullName.trim() || !phone.trim() || !country || !location) {
      toast.error("Please fill in full name, phone, country and location");
      return;
    }

    try {
      await toast.promise(
        dispatch(
          updateAccountSettings({
            fullName: fullName.trim(),
            phoneNumber: phone.trim(),
            countryId: country,
            regionId: location,
            profileImage: avatarFile,
          })
        ).unwrap(),
        {
          pending: "Saving account settings...",
          success: "Account settings updated successfully",
          error: {
            render({ data }) {
              return data || "Failed to update account settings";
            },
          },
        }
      );

      dispatch(fetchAccountSettings());
    } catch {
      // toast.promise handles error UI
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    try {
      await toast.promise(
        dispatch(
          changeAccountPassword({
            currentPassword,
            newPassword,
            confirmPassword,
          })
        ).unwrap(),
        {
          pending: "Changing password...",
          success: "Password changed successfully",
          error: {
            render({ data }) {
              return data || "Failed to change password";
            },
          },
        }
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      // toast.promise handles error UI
    }
  };

  return (
    <div className="min-h-screen bg-[#fbfbfb] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <p className="text-sm text-[#3d3d3d] mb-6">
          Hello {userName ? <span className="font-semibold">{userName}</span> : null}{" "}
          {userName ? <span className="text-[#9a9a9a]">(Not {userName}?</span> : null}{" "}
          <button
            onClick={handleLogout}
            className="text-[#d4824a] underline text-sm font-medium hover:text-[#b86830] transition"
          >
            Log Out
          </button>
          {userName ? <span className="text-[#9a9a9a]">)</span> : null}
        </p>

        <div className="flex flex-col gap-6">
          <SectionCard title="Account Setting">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="shrink-0 flex justify-center md:justify-start">
                <div className="relative w-40 h-40">
                  <img
                    src={avatar || "/logo.png"}
                    alt="Profile avatar"
                    className="w-40 h-40 rounded-full object-cover border-4 border-[#e8d5c4]"
                  />
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="absolute bottom-1 right-1 bg-[#e8d5c4] rounded-full p-1.5 shadow hover:bg-[#d4c4b4] transition"
                    title="Change photo"
                  >
                    <Camera size={14} className="text-[#3d3d3d]" />
                  </button>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </div>
              </div>

              <div className="flex-1 w-full">
                <div className="grid grid-cols-1 gap-4">
                  <InputField
                    label="Full Name"
                    placeholder="Your name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField
                      label="Email"
                      type="email"
                      placeholder="email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled
                    />
                    <InputField
                      label="Phone Number"
                      type="tel"
                      placeholder="+1-000-000-0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <SelectField
                      label="Country"
                      placeholder="Select country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      options={countryOptions}
                      disabled={countriesLoading || accountSettingsFetchLoading}
                    />
                    <SelectField
                      label="Location"
                      placeholder="Location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      options={locationOptions}
                      disabled={!country || regionsLoading || accountSettingsFetchLoading}
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-start">
                  <button
                    onClick={handleSaveChanges}
                    disabled={savingSettings}
                    className="px-6 py-2.5 bg-[#d4824a] text-white text-xs font-bold tracking-widest uppercase rounded transition disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {savingSettings ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Change Password">
            <div className="flex flex-col gap-4">
              <InputField
                label="Current Password"
                type={showCurrent ? "text" : "password"}
                placeholder=""
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                rightIcon={
                  showCurrent ? (
                    <EyeOff size={16} onClick={() => setShowCurrent(false)} />
                  ) : (
                    <Eye size={16} onClick={() => setShowCurrent(true)} />
                  )
                }
              />

              <InputField
                label="New Password"
                type={showNew ? "text" : "password"}
                placeholder="8+ characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                rightIcon={
                  showNew ? (
                    <EyeOff size={16} onClick={() => setShowNew(false)} />
                  ) : (
                    <Eye size={16} onClick={() => setShowNew(true)} />
                  )
                }
              />

              <InputField
                label="Confirm Password"
                type={showConfirm ? "text" : "password"}
                placeholder=""
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                rightIcon={
                  showConfirm ? (
                    <EyeOff size={16} onClick={() => setShowConfirm(false)} />
                  ) : (
                    <Eye size={16} onClick={() => setShowConfirm(true)} />
                  )
                }
              />

              <div className="mt-2">
                <button
                  onClick={handleChangePassword}
                  disabled={changingPassword}
                  className="px-6 py-2.5 bg-[#d4824a] text-white text-xs font-bold tracking-widest uppercase rounded transition disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {changingPassword ? "Changing..." : "Change Password"}
                </button>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
