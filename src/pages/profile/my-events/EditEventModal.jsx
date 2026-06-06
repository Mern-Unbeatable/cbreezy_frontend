import { useEffect, useState } from "react";
import { X } from "lucide-react";

export default function EditEventModal({ isOpen, event, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "Expired",
    image: "",
    showRenew: false,
  });

  useEffect(() => {
    if (!event) return;
    setFormData({
      title: event.title || "",
      description: event.description || "",
      status: event.status || "Expired",
      image: event.image || "",
      showRenew: Boolean(event.showRenew),
    });
  }, [event]);

  if (!isOpen || !event) return null;

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...event,
      ...formData,
      title: formData.title.trim() || event.title,
      description: formData.description.trim() || event.description,
      image: formData.image.trim() || event.image,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-lg bg-[#FDF2EB] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-200 bg-[#F5C3A2] px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-800">Edit Event</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-700 transition hover:text-gray-900"
            aria-label="Close edit modal"
          >
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          <div>
            <label className="mb-1 block text-sm font-medium text-[#0C0C0C]">Event Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              className="w-full rounded border border-gray-200 bg-[#F8D6C0] px-3 py-2 focus:border-orange-300 focus:outline-none"
            />
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
