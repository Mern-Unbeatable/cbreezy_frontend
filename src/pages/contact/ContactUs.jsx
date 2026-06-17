import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  selectSupportSubmitLoading,
  submitContactUs,
} from "../../features/support/supportSlice";

export default function ContactUs() {
  const dispatch = useDispatch();
  const submitLoading = useSelector(selectSupportSubmitLoading);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = formData.name.trim();
    const email = formData.email.trim();
    const message = formData.message.trim();

    if (!name || !email || !message) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      await toast.promise(
        dispatch(
          submitContactUs({
            name,
            email,
            message,
          })
        ).unwrap(),
        {
          pending: "Sending message...",
          success: "Message sent successfully",
          error: {
            render({ data }) {
              return data || "Failed to send message";
            },
          },
        }
      );

      setFormData({
        name: "",
        email: "",
        message: "",
      });
    } catch {
      // Error already handled by toast.promise
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <img
        src="/Rectangle.png"
        alt="Contact background"
        className="absolute inset-0 h-full w-full object-cover bg-black/60"
      />
      <div className="absolute inset-0 bg-black/55" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
        <div className="w-full max-w-xl rounded-lg bg-[#efe7df] p-6 shadow-2xl sm:p-7">
          <h1 className="mb-4 text-4xl font-bold text-[#2f2f2f]">Contact Us</h1>

          <form className="space-y-3" onSubmit={handleSubmit}>
            <div>
              <label className="mb-1 block text-sm font-medium text-[#4a4a4a]">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded border border-[#e7c6ad] bg-[#e7c6ad] px-3 py-2 text-sm text-[#2f2f2f] outline-none focus:ring-2 focus:ring-[#e77f38]"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-[#4a4a4a]">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded border border-[#e7c6ad] bg-[#e7c6ad] px-3 py-2 text-sm text-[#2f2f2f] outline-none focus:ring-2 focus:ring-[#e77f38]"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-[#4a4a4a]">Message</label>
              <textarea
                rows={7}
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full resize-none rounded border border-[#e7c6ad] bg-[#e7c6ad] px-3 py-2 text-sm text-[#2f2f2f] outline-none focus:ring-2 focus:ring-[#e77f38]"
              />
            </div>

            <button
              type="submit"
              disabled={submitLoading}
              className="mt-2 w-full rounded bg-[#e77f38] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#d86f2e] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitLoading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
