import { useParams, useNavigate } from "react-router-dom";
import { MapPin, Phone, Mail, ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  clearReportSpamError,
  clearServiceDetail,
  fetchServiceById,
  reportServiceSpam,
  selectServiceDetail,
  selectServiceDetailError,
  selectServiceReportSpamError,
  selectServiceReportSpamLoading,
} from "../../features/services/servicesSlice";

export default function ServiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [mainImage, setMainImage] = useState(null);
  const service = useSelector(selectServiceDetail);
  const serviceError = useSelector(selectServiceDetailError);
  const reportSpamLoading = useSelector(selectServiceReportSpamLoading);
  const reportSpamError = useSelector(selectServiceReportSpamError);

  useEffect(() => {
    if (!id) return;
    dispatch(fetchServiceById(id));

    return () => {
      dispatch(clearServiceDetail());
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
      await dispatch(reportServiceSpam(id)).unwrap();
      toast.success("Service reported as spam.");
    } catch {
      // Error toast handled by reportSpamError effect.
    }
  };

  if (serviceError) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Error Loading Service</h1>
          <p className="text-gray-600 mb-4">{serviceError}</p>
          <button
            onClick={() => dispatch(fetchServiceById(id))}
            className="px-5 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <button onClick={() => navigate("/services")} className="text-orange-500 underline">
            Back to Services
          </button>
        </div>
      </div>
    );
  }

  const {
    title, price, location, category, subCategory, image,
    description, thumbnails, galleryImages, features,
    serviceTargets,
    commonServices,
    provider,
  } = service;

  const thumbnailList = Array.isArray(thumbnails) && thumbnails.length > 0 ? thumbnails : image ? [image] : [];
  const galleryList = Array.isArray(galleryImages) && galleryImages.length > 0 ? galleryImages : thumbnailList;
  const featuresList = Array.isArray(features) ? features : [];
  const targetsList = Array.isArray(serviceTargets) ? serviceTargets : [];
  const commonServicesList = Array.isArray(commonServices) ? commonServices : [];

  return (
    <div className="min-h-screen bg-[#fbfbfb] py-10  px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto  ">
        
        {/* Back Button */}
        <button
          onClick={() => navigate("/services")}
          className="flex items-center gap-1 text-orange-500 hover:text-orange-600 mb-8 text-sm font-semibold"
        >
          <ChevronLeft size={18} />
          Back to Services
        </button>

        {/* TOP SECTION: IMAGE + MAIN INFO (Based on your Screenshot) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12 ">
          {/* Left: Images */}
          <div>
            <div className="w-full aspect-4/3 rounded-sm overflow-hidden mb-4 bg-gray-100">
              <img src={mainImage || image} alt={title} className="w-full h-full object-cover" />
            </div>
            <div className="flex gap-2 w-full">
              {thumbnailList.map((src, i) => (
                <div 
                  key={i} 
                  onClick={() => setMainImage(src)}
                  className={`flex-1 h-24 overflow-hidden border cursor-pointer transition-all ${(mainImage || (i === 0 && !mainImage)) === src ? 'border-orange-400 shadow-sm' : 'border-gray-200'}`}
                >
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Text Content */}
          <div className="flex flex-col">
            <div className="flex items-center gap-1 text-[#0C0C0C]  text-lg">
              <MapPin size={14} /> {location}
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">{title}</h1>
            <p className="text-base text-[#373737] leading-relaxed mb-8">{description}</p>
            
            <h3 className="text-xl font-bold text-gray-800 mb-3">What This Service Includes</h3>
            <p className="text-base text-[#373737] mb-4">
              Most {title} services may include a range of treatments designed to clean, restore, and protect your vehicle.
            </p>
            <p className="text-lg font-semibold text-gray-700 mb-2">Common services include:</p>
            <ul className="space-y-1 mb-4">
              {commonServicesList.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-base text-gray-600">
                  <span className="text-gray-400">•</span> {item}
                </li>
              ))}
            </ul>

            <div className="text-base text-gray-900 mb-4 flex flex-col md:flex-row md:items-center md:justify-between">
              <span>Category: <strong className="text-black">{category}</strong></span>
              <span>Sub Category: <strong className="text-gray-700">{subCategory}</strong></span>
            </div>

            <div className=" flex items-center justify-between">
              <span className="text-4xl font-black text-[#1a5c52] tracking-tight">${price}</span>
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


        {/* BOTTOM SECTION: ALL ADDITIONAL FEATURES (From your original code) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12   ">
          
          {/* Main Info Columns */}
          <div className="lg:col-span-2 flex flex-col">
            {/* Why Choose Section */}
            <h2 className="text-2xl   leading-tight font-bold text-gray-900 mb-6">Why Choose {title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
              {featuresList.map((f, i) => (
                <div key={i} className="p-4 border border-[#EAEAEA] rounded-md bg-[#FFFFFF] min-h-28">
                   <div
                     className="w-7 h-7 rounded-md flex items-center justify-center mb-3"
                     style={{ backgroundColor: "#e8f4f2" }}
                   >
                     <span className="text-sm text-[#0f766e] leading-none">{f.icon}</span>
                   </div>
                   <div className="pr-2">
                     <h3 className="font-semibold text-xl  text-gray-900 leading-tight mb-2">{f.title}</h3>
                     <p className="text-sm md:text-base text-gray-600 leading-relaxed">{f.desc}</p>
                   </div>
                </div>
              ))}
            </div>

            {/* Who This Service Is For */}
            <h2 className="text-2xl  font-bold text-gray-900 mb-4">Who This Service Is For</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
              {targetsList.map((t, i) => (
                <div key={i} className="px-5 py-3 border border-[#E8E8E8] rounded-xl bg-[#FFFFFF] text-gray-700 text-sm md:text-lg">
                  <span className="text-base inline-flex items-center gap-3 leading-none md:leading-normal">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0f766e] shrink-0"></span>
                    <span>{t}</span>
                  </span>
                </div>
              ))}
            </div>
            
            {/* Service Gallery - Hidden on mobile, shown on larger screens */}
            <div className="hidden lg:block">
              <h2 className="text-2xl  font-bold text-gray-900 mb-1">Service Gallery</h2>
              <p className="text-base text-[#373737] mb-5 font-medium">Gallery</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {galleryList.map((src, i) => (
                  <div key={i} className="rounded-xl overflow-hidden h-40">
                    <img src={src} alt="Gallery" className="w-full h-full object-cover " />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar: Provider Info */}
          <div className="lg:col-span-1">
            <div className="rounded-xl overflow-hidden border border-gray-200 bg-[#f8f8f8] shadow-sm">
              <div className="h-24 bg-[#025955]"></div>
              <div className="px-5 pb-5">
                <div className="relative -mt-9 mb-4 inline-block">
                  <img src={provider?.avatar || image} className="w-14 h-14 rounded-lg object-cover border-2 border-white shadow-sm" alt={provider?.name || "Provider"} />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 leading-tight">{provider?.name || "Service Provider"}</h3>
                <p className="text-lg text-gray-500 mb-4">{provider?.title || "Provider"}</p>
                
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
                </div>
              </div>
            </div>
          </div>

          {/* Service Gallery - Shown only on mobile */}
          <div className="lg:hidden lg:col-span-2">
            <h2 className="text-2xl  font-bold text-gray-900 mb-1">Service Gallery</h2>
            <p className="text-base text-[#373737] mb-5 font-medium">Gallery</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {galleryList.map((src, i) => (
                <div key={i} className="rounded-xl overflow-hidden h-40">
                  <img src={src} alt="Gallery" className="w-full h-full object-cover " />
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}