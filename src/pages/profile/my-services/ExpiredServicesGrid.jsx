function StatusBadge({ status }) {
  const colors = {
    Expired: "bg-[#ED965D]",
    Active: "bg-[#2c9b73]",
    Suspended: "bg-[#EF4444]",
  };

  return (
    <span
      className={`absolute bottom-2 sm:bottom-0 left-2 sm:left-0 text-[9px] sm:text-[10px] font-semibold px-2 sm:px-2.5 py-0.5  ${colors[status] ?? "bg-[#6B7280]"} text-white`}
    >
      {status}
    </span>
  );
}

export default function ExpiredServicesGrid({ services, onRenewClick }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
      {services.map((service) => (
        <div key={service.id} className="bg-[#FDF2EB] rounded-lg sm:rounded-xl overflow-hidden border border-[#EAEAEA] shadow-[0_1px_0_rgba(0,0,0,0.04)] flex flex-col">
          <div className="relative">
            <img
              src={service.image}
              alt={service.title}
              className="w-full h-50 sm:h-40 md:h-60 object-cover"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/400x176?text=Service";
              }}
            />
            <StatusBadge status={service.status} />
          </div>

          <div className="flex flex-col flex-1 gap-1.5 sm:gap-2 px-2 sm:px-3 pb-2.5 sm:pb-3 pt-1.5 sm:pt-2">
            <h3 className="text-sm sm:text-base md:text-lg font-semibold leading-tight text-[#0C0C0C]">
              {service.title}
            </h3>
            <p className="flex-1 text-xs sm:text-sm md:text-base leading-[1.35] text-[#373737]">
              {service.description}
            </p>

            <button
              type="button"
              onClick={() => onRenewClick(service.id)}
              className="mt-1 sm:mt-1.5 w-full flex items-center justify-center gap-1.5 sm:gap-2 rounded-md border border-[#E97C35] bg-[#F8D6C0] text-[#E97C35] py-1.5 sm:py-2 text-xs sm:text-sm md:text-base font-semibold transition-colors"
            >
              <span>Renew this add</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
