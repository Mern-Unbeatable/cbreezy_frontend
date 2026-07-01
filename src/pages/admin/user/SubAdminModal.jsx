import { useEffect, useRef, useState } from "react";
import { Eye, EyeOff, X } from "lucide-react";

const FieldLabel = ({ children }) => (
  <label className="block text-xs sm:text-sm text-[#1f2937] mb-1.5">{children}</label>
);

const FieldInput = ({ className = "", ...props }) => (
  <input
    {...props}
    className={`h-10 sm:h-11 w-full rounded-md border border-transparent bg-[#EFEFEF] px-3 text-sm text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#ec8d47] ${className}`}
  />
);

const SubAdminModal = ({ isOpen, mode = "create", initialValues = null, loading = false, onClose, onSubmit }) => {
  const modalRef = useRef(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const isEdit = mode === "edit";

  useEffect(() => {
    if (!isOpen) return;

    setFullName(initialValues?.name || "");
    setEmail(initialValues?.email && initialValues.email !== "N/A" ? initialValues.email : "");
    setPassword("");
    setShowPassword(false);
  }, [isOpen, initialValues]);

  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose?.();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      fullName: fullName.trim(),
      email: email.trim(),
    };

    if (!isEdit || password.trim()) {
      payload.password = password;
    }

    await onSubmit?.(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div ref={modalRef} className="w-full max-w-md rounded-xl bg-[#f4f4f4] shadow-lg border border-[#d8d8d8]">
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 border-b border-[#d2d2d2]">
          <h3 className="text-xl font-medium text-[#111827] leading-none">
            {isEdit ? "Edit Sub-Admin" : "Add Sub-Admin"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="h-7 w-7 rounded-full bg-[#D9D9D9] text-[#333] grid place-items-center shrink-0"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-4 sm:px-5 py-4 space-y-4">
          <div>
            <FieldLabel>Full Name</FieldLabel>
            <FieldInput
              type="text"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder="Enter full name"
              required
            />
          </div>

          <div>
            <FieldLabel>Email</FieldLabel>
            <FieldInput
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter email address"
              required
            />
          </div>

          <div>
            <FieldLabel>{isEdit ? "New Password (optional)" : "Password"}</FieldLabel>
            <div className="relative">
              <FieldInput
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder={isEdit ? "Leave blank to keep current password" : "Minimum 8 characters"}
                required={!isEdit}
                minLength={isEdit ? undefined : 8}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#E97C35]"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="h-10 px-4 rounded-md bg-[#ec8d47] text-sm font-medium text-white disabled:opacity-60"
            >
              {loading ? "Saving..." : isEdit ? "Save Changes" : "Add Sub-Admin"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubAdminModal;
