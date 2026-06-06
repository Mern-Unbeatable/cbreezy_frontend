import { useEffect, useState } from "react";
import { X } from "lucide-react";

export default function EditServiceModal({ isOpen, service, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    country: "",
    location: "",
    availableStart: "",
    availableEnd: "",
    email: "",
    phone: "",
    facebook: "",
    instagram: "",
    status: "Expired",
    image: "",
    showRenew: false,
  });

  useEffect(() => {
    if (!service) return;
    setFormData({
      title: service.title || "",
      category: service.category || "",
      description: service.description || "",
      country: service.country || "",
      location: service.location || "",
      availableStart: service.availableStart || "",
      availableEnd: service.availableEnd || "",
      email: service.email || "",
      phone: service.phone || "",
      facebook: service.facebook || "",
      instagram: service.instagram || "",
      status: service.status || "Expired",
      image: service.image || "",
      showRenew: Boolean(service.showRenew),
    });
  }, [service]);

  if (!isOpen || !service) return null;

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSave({
      ...service,
      ...formData,
      title: formData.title.trim() || service.title,
      description: formData.description.trim() || service.description,
      category: formData.category.trim(),
      country: formData.country.trim(),
      location: formData.location.trim(),
      availableStart: formData.availableStart.trim(),
      availableEnd: formData.availableEnd.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      facebook: formData.facebook.trim(),
      instagram: formData.instagram.trim(),
      image: formData.image.trim() || service.image,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-lg bg-[#FDF2EB] shadow-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-200 bg-[#F5C3A2] px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-800">Edit Service</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-700 transition hover:text-gray-900"
            aria-label="Close edit modal"
          >
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-5 overflow-y-auto">
          <div>
            <h3 className="text-base text-[#0C0C0C] font-semibold mb-3">Service Details</h3>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 mb-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-[#0C0C0C]">Service Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  className="w-full rounded border border-gray-200 bg-[#F8D6C0] px-3 py-2 focus:border-orange-300 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-[#0C0C0C]">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => handleChange("category", e.target.value)}
                  className="w-full rounded border border-gray-200 bg-[#F8D6C0] px-3 py-2 text-sm text-[#373737] focus:border-orange-300 focus:outline-none"
                >
                  <option value="">Select category</option>
                  <option value="Beauty">Beauty</option>
                  <option value="Photography">Photography</option>
                  <option value="Home Service">Home Service</option>
                  <option value="Consulting">Consulting</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-[#0C0C0C]">Description</label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="w-full resize-none rounded border border-gray-200 bg-[#F8D6C0] px-3 py-2 focus:border-orange-300 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-[#0C0C0C]">Country</label>
              <select
                value={formData.country}
                onChange={(e) => handleChange("country", e.target.value)}
                className="w-full rounded border border-gray-200 bg-[#F8D6C0] px-3 py-2 text-sm text-[#373737] focus:border-orange-300 focus:outline-none"
              >
                <option value="">Select country</option>
                <option value="Bangladesh">Bangladesh</option>
                <option value="USA">USA</option>
                <option value="UK">UK</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-[#0C0C0C]">Location</label>
              <select
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
                className="w-full rounded border border-gray-200 bg-[#F8D6C0] px-3 py-2 text-sm text-[#373737] focus:border-orange-300 focus:outline-none"
              >
                <option value="">Location</option>
                <option value="Dhaka">Dhaka</option>
                <option value="Chittagong">Chittagong</option>
                <option value="Sylhet">Sylhet</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-[#0C0C0C]">Available Start</label>
              <select
                value={formData.availableStart}
                onChange={(e) => handleChange("availableStart", e.target.value)}
                className="w-full rounded border border-gray-200 bg-[#F8D6C0] px-3 py-2 text-sm text-[#373737] focus:border-orange-300 focus:outline-none"
              >
                <option value="">Select month</option>
                <option value="January">January</option>
                <option value="February">February</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-[#0C0C0C]">Available End</label>
              <select
                value={formData.availableEnd}
                onChange={(e) => handleChange("availableEnd", e.target.value)}
                className="w-full rounded border border-gray-200 bg-[#F8D6C0] px-3 py-2 text-sm text-[#373737] focus:border-orange-300 focus:outline-none"
              >
                <option value="">Select month</option>
                <option value="January">January</option>
                <option value="February">February</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-[#0C0C0C]">Status</label>
              <select
                value={formData.status}
                onChange={(e) => handleChange("status", e.target.value)}
                className="w-full rounded border border-gray-200 bg-[#F8D6C0] px-3 py-2 focus:border-orange-300 focus:outline-none"
              >
                <option value="Expired">Expired</option>
                <option value="Suspended">Suspended</option>
                <option value="Active">Active</option>
              </select>
            </div>

            <div className="flex items-end">
              <label className="inline-flex items-center gap-2 text-sm text-[#0C0C0C]">
                <input
                  type="checkbox"
                  checked={formData.showRenew}
                  onChange={(e) => handleChange("showRenew", e.target.checked)}
                  className="h-4 w-4 accent-[#E97C35]"
                />
                Show Renew Button
              </label>
            </div>
          </div>

          <div>
            <h3 className="text-base text-[#0C0C0C] font-semibold mb-3">Provider Contact Information</h3>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 mb-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-[#0C0C0C]">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="w-full rounded border border-gray-200 bg-[#F8D6C0] px-3 py-2 text-sm focus:border-orange-300 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-[#0C0C0C]">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className="w-full rounded border border-gray-200 bg-[#F8D6C0] px-3 py-2 text-sm focus:border-orange-300 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-[#0C0C0C]">Facebook</label>
                <input
                  type="url"
                  value={formData.facebook}
                  onChange={(e) => handleChange("facebook", e.target.value)}
                  className="w-full rounded border border-gray-200 bg-[#F8D6C0] px-3 py-2 text-sm focus:border-orange-300 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-[#0C0C0C]">Instagram</label>
                <input
                  type="url"
                  value={formData.instagram}
                  onChange={(e) => handleChange("instagram", e.target.value)}
                  className="w-full rounded border border-gray-200 bg-[#F8D6C0] px-3 py-2 text-sm focus:border-orange-300 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-[#0C0C0C]">Image URL</label>
            <input
              type="text"
              value={formData.image}
              onChange={(e) => handleChange("image", e.target.value)}
              className="w-full rounded border border-gray-200 bg-[#F8D6C0] px-3 py-2 focus:border-orange-300 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded bg-[#E97C35] px-4 py-2 text-sm font-semibold text-white"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
