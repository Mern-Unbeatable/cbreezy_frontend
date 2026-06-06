import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Camera, Sparkles, Clock3, Target, MapPin, Phone, Mail, ChevronLeft, Dot, Calendar } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  clearReportSpamError,
  clearEventDetail,
  fetchEventById,
  reportEventSpam,
  selectEventDetail,
  selectEventDetailError,
  selectReportSpamError,
  selectReportSpamLoading,
} from "../../features/events/eventsSlice";

const featureIcons = {
  camera: Camera,
  sparkles: Sparkles,
  clock: Clock3,
  target: Target,
};

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const event = useSelector(selectEventDetail);
  const eventError = useSelector(selectEventDetailError);
  const reportSpamLoading = useSelector(selectReportSpamLoading);
  const reportSpamError = useSelector(selectReportSpamError);
  const [mainImage, setMainImage] = useState(null);

  useEffect(() => {
    if (!id) return;
    dispatch(fetchEventById(id));

    return () => {
      dispatch(clearEventDetail());
    };
  }, [dispatch, id]);

  useEffect(() => {
    setMainImage(null);
  }, [id]);

  useEffect(() => {
    if (reportSpamError) {
      toast.error(reportSpamError);
      dispatch(clearReportSpamError());
    }
  }, [dispatch, reportSpamError]);

  const handleReportSpam = async () => {
    if (!id || reportSpamLoading) return;

    try {
      await dispatch(reportEventSpam(id)).unwrap();
      toast.success("Event reported as spam.");
    } catch {
      // Error toast is handled by slice error observer.
    }
  };

  if (eventError) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Error Loading Event</h1>
          <p className="text-gray-600 mb-4">{eventError}</p>
          <button
            onClick={() => dispatch(fetchEventById(id))}
            className="px-5 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <button onClick={() => navigate("/events")} className="text-orange-500 underline">
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  const {
    title,
    price,
    location,
    category,
    subCategory,
    image,
    thumbnails,
    description,
    commonServices,
    features,
    serviceTargets,
    galleryImages,
    provider,
  } = event;

  const thumbnailList = Array.isArray(thumbnails) && thumbnails.length > 0 ? thumbnails : image ? [image] : [];
  const galleryList = Array.isArray(galleryImages) && galleryImages.length > 0 ? galleryImages : thumbnailList;
  const featuresList = Array.isArray(features) ? features : [];
  const targetsList = Array.isArray(serviceTargets) ? serviceTargets : [];
  const commonServicesList = Array.isArray(commonServices) ? commonServices : [];

  return (
    <div className="min-h-screen bg-[#fbfbfb] py-10 px-4">
      <div className="container mx-auto">
        <button
          onClick={() => navigate("/events")}
          className="flex items-center gap-1 text-orange-500 hover:text-orange-600 mb-8 text-sm font-semibold"
        >
          <ChevronLeft size={18} />
          Back to Events
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
          <div>
            <div className="w-full aspect-4/3 rounded-sm overflow-hidden mb-4 bg-gray-100">
              <img src={mainImage || image} alt={title} className="w-full h-full object-cover" />
            </div>
            <div className="flex gap-2 w-full">
              {thumbnailList.map((src, i) => (
                <div
                  key={i}
                  onClick={() => setMainImage(src)}
                  className={`flex-1 h-24 overflow-hidden border cursor-pointer transition-all ${mainImage === src ? "border-orange-400 shadow-sm" : "border-gray-200"}`}
                >
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1 text-black mb-2 text-base">
              <MapPin size={14} /> {location}
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">{title}</h1>
            <p className="text-base text-[#373737] leading-relaxed mb-4">{description}</p>

            <h3 className="text-xl font-bold text-gray-800 mb-3">What This Event Includes</h3>
            <p className="text-base text-[#373737] mb-2">
              Most event packages include a complete setup, onsite execution, and final delivery tailored to your booking.
            </p>
            <p className="text-xl font-semibold text-gray-900 mb-2">Common services include:</p>
            <ul className="space-y-1 mb-8">
              {commonServicesList.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-base text-gray-900">
                  <span className="text-[#373737]"><Dot /></span> {item}
                </li>
              ))}
            </ul>

            <div className="text-base text-gray-900 mb-4 flex flex-col md:flex-row md:items-center md:justify-between">
              <span>
                Category: <strong className="text-black">{category}</strong>
              </span>
              <span>
                Sub Category: <strong className="text-gray-700">{subCategory}</strong>
              </span>
            </div>

            <div className="flex items-center justify-between mt-auto">
              <span className="text-4xl font-black text-[#1a5c52] tracking-tight">{price}</span>
              <button
                onClick={handleReportSpam}
                disabled={reportSpamLoading}
                className="bg-[#ee8142] text-white px-8 py-3 rounded text-[12px] font-bold uppercase transition shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {reportSpamLoading ? "Reporting..." : "Report Spam"}
              </button>
            </div>
          </div>
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 ">
            <h2 className="text-2xl md:text-3xl leading-tight font-medium text-gray-900 my-6">Why Choose {title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12 ">
              {featuresList.map((feature, i) => {
                const Icon = featureIcons[feature.icon] || Camera;
                return (
                  <div key={i} className="p-4 border border-gray-200 rounded-md bg-[#004C48] min-h-28">
                    <div className="w-7 h-7 rounded-md flex items-center justify-center mb-3" style={{ backgroundColor: "#e8f4f2" }}>
                      <Icon size={14} className="text-[#0f766e]" />
                    </div>
                    <div className="pr-2">
                      <h3 className="font-semibold text-xl md:text-2xl text-white leading-tight mb-2">{feature.title}</h3>
                      <p className="text-sm md:text-base text-white leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <h2 className="ttext-2xl md:text-3xl leading-tight font-medium text-gray-900 mb-4">Who This Service Is For</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
              {targetsList.map((target, i) => (
                <div key={i} className="px-5 py-1.5 border border-gray-200 rounded-xl bg-[#f8f8f8] text-gray-700 text-base md:text-lg">
                  <span className="inline-flex items-center gap-3 leading-none md:leading-normal">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0f766e] shrink-0"></span>
                    <span>{target}</span>
                  </span>
                </div>
              ))}
            </div>

            <h2 className="text-2xl md:text-3xl leading-tight font-medium text-gray-900 mb-1">Event Gallery</h2>
            <p className="text-base text-[#373737] mb-5 ">Gallery</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {galleryList.map((src, i) => (
                <div key={i} className="rounded-lg overflow-hidden h-40">
                  <img src={src} alt="Gallery" className="w-full h-full object-cover " />
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="rounded-xl overflow-hidden border border-gray-200 bg-[#f8f8f8] shadow-sm">
              <div className="h-24 bg-[#025955]"></div>
              <div className="px-5 pb-5">
                <div className="relative -mt-9 mb-4 inline-block">
                  <img src={provider?.avatar || image} className="w-14 h-14 rounded-lg object-cover border-2 border-white shadow-sm" alt={provider?.name || "Organizer"} />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 leading-tight">{provider?.name || "Event Organizer"}</h3>
                <p className="text-lg text-gray-500 mb-4">{provider?.title || "Organizer"}</p>

                <div className="space-y-2.5 text-left">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Phone size={14} className="text-gray-700 shrink-0" /> {provider?.phone || "N/A"}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Mail size={14} className="text-gray-700 shrink-0" /> <span className="truncate">{provider?.email || "N/A"}</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-gray-700 leading-snug">
                    <MapPin size={14} className="text-gray-700 shrink-0 mt-0.5" /> {provider?.address || location}
                  </div>
                  
                  {provider?.startDate && provider?.endDate && (
                    <div className=" ">
                      <div className="flex items-center gap-2 text-sm text-[#0C0C0C]">
                        <Calendar size={14} className="text-[#0C0C0C] shrink-0" />
                        <div>
                          <div className="">Start Date: {provider.startDate}</div>
                          <div className="">End Date: {provider.endDate}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
