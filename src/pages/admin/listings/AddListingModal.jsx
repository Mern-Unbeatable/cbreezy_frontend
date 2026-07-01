import { X } from "lucide-react";

const AddListingModal = ({ isOpen, onClose, onSelectType }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-xl bg-white shadow-lg border border-[#e5e7eb]">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#ececec]">
          <h3 className="text-lg font-semibold text-[#111827]">Add Listing</h3>
          <button
            type="button"
            onClick={onClose}
            className="h-7 w-7 rounded-full bg-[#f3f4f6] text-[#374151] grid place-items-center"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-4 space-y-3">
          <p className="text-sm text-[#6b7280]">Choose the listing type you want to create.</p>
          <button
            type="button"
            onClick={() => onSelectType?.("service")}
            className="w-full h-11 rounded-md bg-[#E97C35] text-sm font-medium text-white hover:bg-[#cf6d2e]"
          >
            Create Service Listing
          </button>
          <button
            type="button"
            onClick={() => onSelectType?.("event")}
            className="w-full h-11 rounded-md border border-[#E97C35] text-sm font-medium text-[#E97C35] hover:bg-[#fff7ed]"
          >
            Create Event Listing
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddListingModal;
