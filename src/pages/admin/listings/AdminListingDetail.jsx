import { useEffect, useState } from "react";
import { ChevronLeft, Mail, MapPin, Phone } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminListingById } from "../../../features/admin/adminSlice";

const statusStyles = {
  pending: "bg-[#fff7ed] text-[#9a3412]",
  approved: "bg-[#ecfdf5] text-[#047857]",
  suspended: "bg-[#fef2f2] text-[#b91c1c]",
};

const AdminListingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const listings = useSelector((state) => state.admin.listings);
  const listingDetail = useSelector((state) => state.admin.listingDetail);
  const listingDetailLoading = useSelector((state) => state.admin.listingDetailLoading);
  const listingDetailError = useSelector((state) => state.admin.listingDetailError);
  const [mainImage, setMainImage] = useState(null);

  useEffect(() => {
    if (id) {
      dispatch(fetchAdminListingById(id));
    }
  }, [dispatch, id]);

  const listingId = String(id);
  const listing =
    listings.find((item) => String(item.id) === listingId) ||
    location.state?.listing;

  const detail = listingDetail && String(listingDetail.id) === listingId ? listingDetail : null;
  const resolvedListing = detail || listing;

  if (listingDetailLoading && !resolvedListing) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#6b7280]">
        Loading listing details...
      </div>
    );
  }

  if (!resolvedListing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">404</h1>
          {listingDetailError && <p className="mb-3 text-sm text-red-600">{listingDetailError}</p>}
          <button onClick={() => navigate("/admin/listings")} className="text-orange-500 underline">
            Back to Listings
          </button>
        </div>
      </div>
    );
  }

  const thumbnails =
    Array.isArray(detail?.thumbnails) && detail.thumbnails.length > 0
      ? detail.thumbnails
      : resolvedListing.image
        ? [resolvedListing.image]
        : ["https://via.placeholder.com/600x450?text=Listing"];

  const galleryImages =
    Array.isArray(detail?.galleryImages) && detail.galleryImages.length > 0
      ? detail.galleryImages
      : thumbnails;

  const featureRows =
    Array.isArray(detail?.featureRows) && detail.featureRows.length > 0
      ? detail.featureRows
      : [
          { icon: "✦", title: "Verified Listing", desc: "Reviewed by admin before publishing." },
          { icon: "◉", title: "Clear Contact", desc: "Owner information is available for follow-up." },
        ];

  const serviceTargets =
    Array.isArray(detail?.serviceTargets) && detail.serviceTargets.length > 0
      ? detail.serviceTargets
      : ["Individuals", "Small Businesses", "Enterprises"];

  const commonServices =
    Array.isArray(detail?.commonServices) && detail.commonServices.length > 0
      ? detail.commonServices
      : ["Core listing package", "Standard support", "Optional add-ons"];

  const description =
    detail?.description ||
    resolvedListing.description ||
    "No detailed description available for this listing.";

  const status = String(detail?.status || resolvedListing.status || "pending").toLowerCase();
  const price = detail?.price || resolvedListing?.price || (resolvedListing.category === "Events" ? "325" : "149");
  const ownerName = detail?.owner?.name || resolvedListing.userName || "Listing Owner";
  const ownerPhone = detail?.owner?.phone || "N/A";
  const ownerEmail = detail?.owner?.email || "N/A";
  const ownerAddress = detail?.owner?.address || resolvedListing.location || "N/A";
  const ownerAvatar = detail?.owner?.avatar || "https://i.pravatar.cc/100?img=12";
  const spamReport = detail?.spamReport ?? resolvedListing.spamReport ?? 0;

  return (
    <div className="min-h-screen bg-[#fbfbfb] py-10 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <button
          onClick={() => navigate("/admin/listings")}
          className="flex items-center gap-1 text-orange-500 hover:text-orange-600 mb-8 text-sm font-semibold"
        >
          <ChevronLeft size={18} />
          Back to Listings
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
          <div>
            <div className="w-full aspect-4/3 rounded-sm overflow-hidden mb-4 bg-gray-100">
              <img src={mainImage || thumbnails[0]} alt={resolvedListing.title} className="w-full h-full object-cover" />
            </div>
            <div className="flex gap-2 w-full">
              {thumbnails.map((src, index) => (
                <div
                  key={src}
                  onClick={() => setMainImage(src)}
                  className={`flex-1 h-24 overflow-hidden border cursor-pointer transition-all ${(mainImage || (index === 0 && !mainImage)) === src ? "border-orange-400 shadow-sm" : "border-gray-200"}`}
                >
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1 text-[#0C0C0C] text-lg">
                <MapPin size={14} /> {resolvedListing.location}
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusStyles[status] || statusStyles.pending}`}>
                {status}
              </span>
            </div>

            <h1 className="text-2xl font-bold text-gray-800 mb-1">{resolvedListing.title}</h1>
            <p className="text-sm text-[#6b7280] mb-4">
              Listed by {ownerName} from {resolvedListing.country}
            </p>
            <p className="text-base text-[#373737] leading-relaxed mb-8">{description}</p>

            <h3 className="text-xl font-bold text-gray-800 mb-3">What This Listing Includes</h3>
            <p className="text-base text-[#373737] mb-4">
              This listing may include multiple service scopes and optional add-ons for better customer outcomes.
            </p>
            <p className="text-lg font-semibold text-gray-700 mb-2">Common scopes include:</p>
            <ul className="space-y-1 mb-4">
              {commonServices.map((item) => (
                <li key={item} className="flex items-start gap-2 text-base text-gray-600">
                  <span className="text-gray-400">•</span> {item}
                </li>
              ))}
            </ul>

            <div className="text-base text-gray-900 mb-5 flex items-center justify-between">
              <span>
                Category: <strong className="text-black">{resolvedListing.category}</strong>
              </span>
              <span>
                Spam Reports: <strong className="text-gray-700">{spamReport}</strong>
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-4xl font-black text-[#1a5c52] tracking-tight">${price}</span>
              <button className="bg-[#ee8142] text-white px-8 py-3 rounded text-[12px] font-bold uppercase transition shadow-sm" type="button">
                Review Needed
              </button>
            </div>
          </div>
        </div>

        <hr className="mb-8 border-gray-100" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <h2 className="text-2xl leading-tight font-bold text-gray-900 mb-6">Why Choose {resolvedListing.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
              {featureRows.map((feature) => (
                <div key={feature.title} className="p-4 border border-gray-200 rounded-md bg-[#fdfdfd] min-h-28">
                  <div className="w-7 h-7 rounded-md flex items-center justify-center mb-3" style={{ backgroundColor: "#e8f4f2" }}>
                    <span className="text-sm text-[#0f766e] leading-none">{feature.icon}</span>
                  </div>
                  <div className="pr-2">
                    <h3 className="font-semibold text-xl text-gray-900 leading-tight mb-2">{feature.title}</h3>
                    <p className="text-sm md:text-base text-gray-600 leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Who This Listing Is For</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
              {serviceTargets.map((target) => (
                <div key={target} className="px-5 py-3 border border-gray-200 rounded-xl bg-[#f8f8f8] text-gray-700 text-sm md:text-lg">
                  <span className="text-base inline-flex items-center gap-3 leading-none md:leading-normal">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0f766e] shrink-0"></span>
                    <span>{target}</span>
                  </span>
                </div>
              ))}
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-1">Listing Gallery</h2>
            <p className="text-base text-[#373737] mb-5 font-medium">Gallery</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {galleryImages.map((src) => (
                <div key={src} className="rounded-xl overflow-hidden h-40">
                  <img src={src} alt="Gallery" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="rounded-xl overflow-hidden border border-gray-200 bg-[#f8f8f8] shadow-sm">
              <div className="h-24 bg-[#025955]"></div>
              <div className="px-5 pb-5">
                <div className="relative -mt-9 mb-4 inline-block">
                  <img
                    src={ownerAvatar}
                    className="w-14 h-14 rounded-lg object-cover border-2 border-white shadow-sm"
                    alt={ownerName}
                  />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 leading-tight">{ownerName}</h3>
                <p className="text-lg text-gray-500 mb-4">Listing Owner</p>

                <div className="space-y-2.5 text-left">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Phone size={14} className="text-gray-700 shrink-0" /> {ownerPhone}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Mail size={14} className="text-gray-700 shrink-0" />
                    <span className="truncate">{ownerEmail}</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-gray-700 leading-snug">
                    <MapPin size={14} className="text-gray-700 shrink-0 mt-0.5" />
                    {ownerAddress}, {resolvedListing.country}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminListingDetail;
