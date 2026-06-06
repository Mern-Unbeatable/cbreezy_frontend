import { useRef, useEffect, useState } from "react";
import { ChevronDown, X } from "lucide-react";

const ModalCard = ({ title, onClose, children }) => {
  return (
    <div className="w-full max-w-80 sm:max-w-md md:max-w-lg rounded-xl bg-[#f4f4f4] shadow-lg border border-[#d8d8d8] mx-auto">
      <div className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 border-b border-[#d2d2d2]">
        <h3 className="text-xl md:text-2xl font-medium text-[#111827] leading-none">{title}</h3>
        <button
          type="button"
          onClick={onClose}
          className="h-7 w-7 rounded-full bg-[#D9D9D9] text-[#333] grid place-items-center shrink-0"
          aria-label="Close modal"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <div className="px-4 sm:px-5 py-3 sm:py-4 space-y-3 sm:space-y-4">{children}</div>
    </div>
  );
};

const FieldLabel = ({ children }) => (
  <label className="block text-xs sm:text-sm md:text-[14px] text-[#1f2937] mb-1.5 md:mb-2">{children}</label>
);

const FieldInput = (props) => (
  <input
    {...props}
    className="h-10 sm:h-11 md:h-12 w-full rounded-md border border-transparent bg-[#EFEFEF] px-3 md:px-4 text-xs sm:text-sm md:text-[14px] text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#ec8d47]"
  />
);

const AddCategoryModal = ({ isOpen, onClose, onSave, fixedType = "" }) => {
  const modalRef = useRef(null);
  const [categoryName, setCategoryName] = useState("");
  const normalizedFixedType = fixedType === "event" ? "event" : fixedType === "service" ? "service" : "";
  const [categoryType, setCategoryType] = useState(normalizedFixedType || "service");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    setCategoryType(normalizedFixedType || "service");
  }, [isOpen, normalizedFixedType]);

  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleImageChange = (event) => {
    const file = event.target.files?.[0] || null;
    setImageFile(file);

    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    } else {
      setImagePreview("");
    }
  };

  const handleSave = async () => {
    const isSaved = await onSave?.({
      name: categoryName,
      type: categoryType,
      image: imageFile,
    });
    if (isSaved) {
      setCategoryName("");
      setCategoryType(normalizedFixedType || "service");
      setImageFile(null);
      setImagePreview("");
      onClose();
    }
  };

  const categoryTypeLabel = categoryType === "event" ? "Event Category" : "Service Category";

  return (
    <div className="fixed inset-0 z-20 bg-black/35 p-3 sm:p-4 md:p-6 flex items-center justify-center overflow-y-auto">
      <div ref={modalRef} className="w-full max-w-80 sm:max-w-md md:max-w-lg my-auto">
        <ModalCard title="Add Category" onClose={onClose}>
          <div>
            <FieldLabel>Category Type</FieldLabel>
            {normalizedFixedType ? (
              <div className="h-10 sm:h-11 md:h-12 w-full rounded-md border border-transparent bg-[#EFEFEF] px-3 md:px-4 text-xs sm:text-sm md:text-[14px] text-[#111827] flex items-center">
                {categoryTypeLabel}
              </div>
            ) : (
              <div className="relative">
                <select
                  className="h-10 sm:h-11 md:h-12 w-full appearance-none rounded-md border border-transparent bg-[#EFEFEF] px-3 md:px-4 pr-10 text-xs sm:text-sm md:text-[14px] text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#ec8d47]"
                  value={categoryType}
                  onChange={(e) => setCategoryType(e.target.value)}
                >
                  <option value="service">Service Category</option>
                  <option value="event">Event Category</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#111827]" />
              </div>
            )}
          </div>

          <div>
            <FieldLabel>Category Name</FieldLabel>
            <FieldInput
              placeholder="Category Name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />
          </div>

          <div>
            <FieldLabel>Category Image (optional)</FieldLabel>
            <div className="space-y-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-xs sm:text-sm md:text-[14px] text-[#111827] file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:bg-[#e5e7eb] file:text-xs sm:file:text-sm file:font-medium hover:file:bg-[#d1d5db] cursor-pointer"
              />
              {imagePreview && (
                <div className="h-16 w-16 rounded-md border border-[#d1d5db] overflow-hidden bg-[#f9fafb]">
                  <img
                    src={imagePreview}
                    alt="Selected category preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={handleSave}
            className="h-9 sm:h-10 rounded-md bg-[#e97c35] px-6 text-white text-sm md:text-[16px] font-medium hover:bg-[#cf6d2e] w-full sm:w-auto"
          >
            Save
          </button>
        </ModalCard>
      </div>
    </div>
  );
};

export default AddCategoryModal;
