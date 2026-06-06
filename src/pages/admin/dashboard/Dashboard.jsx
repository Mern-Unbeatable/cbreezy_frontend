

import { useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Eye,
  Landmark,
  Package,
  Trash2,
  UserRound,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../../../context/AuthContext";
import {
  deleteAdminListing,
  fetchAdminDashboardOverview,
  fetchAdminListings,
} from "../../../features/admin/adminSlice";
import { mapYearLabelToPeriod } from "../../../features/admin/adminAPI";
import Pagination from "../../../components/Pagination";

const iconMap = {
  UserRound,
  Package,
  Landmark,
  AlertTriangle,
};

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const adminName = user?.name || "Admin";
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const dashboardStats = useSelector((state) => state.admin.dashboard.stats);
  const sales = useSelector((state) => state.admin.dashboard.sales);
  const yearOptions = useSelector((state) => state.admin.yearOptions);
  const listings = useSelector((state) => state.admin.listings);
  const listingsPagination = useSelector((state) => state.admin.listingsPagination);
  const listingsLoading = useSelector((state) => state.admin.listingsLoading);
  const listingsError = useSelector((state) => state.admin.listingsError);
  const dashboardLoading = useSelector((state) => state.admin.dashboardLoading);
  const dashboardError = useSelector((state) => state.admin.dashboardError);

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedYear, setSelectedYear] = useState("This year");
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const [activeMonthIndex, setActiveMonthIndex] = useState(sales.tooltipIndex);
  const yearDropdownRef = useRef(null);

  const resultsPerPage = 20;

  const listingRows = useMemo(
    () =>
      listings.map((item) => ({
        id: item.id,
        title: item.title,
        category: item.category,
        userName: item.userName,
        country: item.country,
        location: item.location,
        spamReport: item.spamReport,
        status: item.status,
      })),
    [listings],
  );

  const totalPages = Math.max(1, Number(listingsPagination?.totalPages || 1));
  const paginatedRows = listingRows;

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    dispatch(fetchAdminDashboardOverview(mapYearLabelToPeriod(selectedYear)));
  }, [dispatch, selectedYear]);

  useEffect(() => {
    if (!yearOptions.length) return;
    if (!yearOptions.includes(selectedYear)) {
      setSelectedYear(yearOptions[0]);
    }
  }, [selectedYear, yearOptions]);

  useEffect(() => {
    dispatch(
      fetchAdminListings({
        status: "PENDING",
        sortBy: "createdAt",
        sortOrder: "desc",
        page: currentPage,
        limit: resultsPerPage,
      }),
    );
  }, [currentPage, dispatch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (yearDropdownRef.current && !yearDropdownRef.current.contains(event.target)) {
        setIsYearDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const chartWidth = 1000;
  const chartHeight = 260;
  const topPadding = 30;
  const bottomPadding = 20;
  const maxValue = sales.maxValue;
  const selectedSalesData = sales.salesData || [];
  const selectedYearOffset = yearOptions.indexOf(selectedYear);
  const selectedCalendarYear =
    new Date().getFullYear() - (selectedYearOffset >= 0 ? selectedYearOffset : 0);
  const showCalendarYear = selectedYear === "This year" || selectedYear === "Last year";

  const points = selectedSalesData.map((value, index) => {
    const x =
      selectedSalesData.length > 1
        ? (index / (selectedSalesData.length - 1)) * chartWidth
        : chartWidth / 2;
    const normalized = value / maxValue;
    const y = topPadding + (1 - normalized) * (chartHeight - topPadding - bottomPadding);
    return { x, y, value };
  });

  const hasSalesData = points.length > 0;

  const createSmoothLinePath = (chartPoints) => {
    if (!chartPoints.length) return "";

    const first = chartPoints[0];
    let path = `M ${first.x},${first.y}`;

    for (let i = 1; i < chartPoints.length; i += 1) {
      const prev = chartPoints[i - 1];
      const current = chartPoints[i];
      const controlX = (prev.x + current.x) / 2;
      path += ` C ${controlX},${prev.y} ${controlX},${current.y} ${current.x},${current.y}`;
    }

    return path;
  };

  const linePath = createSmoothLinePath(points);
  const areaPath = `${linePath} L ${chartWidth},${chartHeight} L 0,${chartHeight} Z`;

  const tooltipIndex = points.length ? Math.min(activeMonthIndex, points.length - 1) : 0;
  const tooltipPoint = points[tooltipIndex] || { x: 0, y: chartHeight - bottomPadding, value: 0 };
  const tooltipEdgeThreshold = 120;
  const isTooltipNearLeft = tooltipPoint.x <= tooltipEdgeThreshold;
  const isTooltipNearRight = tooltipPoint.x >= chartWidth - tooltipEdgeThreshold;

  const handleChartPointerMove = (event) => {
    if (!selectedSalesData.length) return;

    const rect = event.currentTarget.getBoundingClientRect();
    if (!rect.width) return;

    const relativeX = Math.min(
      Math.max((event.clientX - rect.left) / rect.width, 0),
      1,
    );
    const nextIndex = Math.round(relativeX * (selectedSalesData.length - 1));
    setActiveMonthIndex(nextIndex);
  };

  const handleDeleteListing = async (id) => {
    await toast.promise(dispatch(deleteAdminListing(id)).unwrap(), {
      pending: "Deleting listing...",
      success: "Listing deleted successfully",
      error: "Failed to delete listing",
    });
  };

  const handleViewListing = (id, listing) => {
    toast.info("Opening listing details...");
    navigate(`/admin/listings/${id}`, { state: { listing } });
  };

  return (
    <div className="space-y-3 md:space-y-4 ">
      <div className="px-2 md:px-0">
        <h1 className="text-2xl sm:text-3xl md:text-[48px] leading-none font-medium text-[#000000] font-['Poppins']">Dashboard Overview</h1>
        <p className="text-sm md:text-base text-[#464646] mt-2 font-['inter']">
          Welcome back, {adminName}. Here&apos;s what&apos;s happening today.
        </p>
        {dashboardError && <p className="text-sm text-red-600 mt-1">{dashboardError}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2 md:gap-3">
        {dashboardStats.map((item) => {
          const Icon = iconMap[item.icon] || Package;

          return (
            <div key={item.title} className="bg-white border border-[#e5e7eb] rounded-lg p-4 md:p-5 flex flex-col">
              <p className="text-[11px] md:text-[12px] text-[#6b7280] font-medium mb-3">{item.title}</p>

              <div className="flex items-center justify-between mb-3 flex-1">
                <p className="text-2xl sm:text-3xl m font-bold text-[#111827]">{item.value}</p>
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-[#E6EDED] text-[#004C48] flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6 md:w-7 md:h-7" strokeWidth={1.5} />
                </div>
              </div>

              <p className="text-[11px] md:text-[12px] text-[#004C48]">{item.delta}</p>
            </div>
          );
        })}
      </div>

      {!dashboardLoading && dashboardStats.length === 0 && (
        <div className="rounded-md border border-[#ececec] bg-white p-4 text-sm text-[#6b7280]">
          No dashboard overview data found for the selected period.
        </div>
      )}

      <section className="bg-white border border-[#ececec] rounded-md p-2 md:p-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2 md:mb-3 px-1 md:px-0">
          <h2 className="text-xl md:text-[30px] font-semibold text-[#111827]">Sales Performance</h2>

          <div className="relative" ref={yearDropdownRef}>
            <button
              onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
              className="px-3 py-1.5 text-sm text-[#4A5154] border border-[#e5e7eb] rounded hover:bg-[#f9fafb] flex items-center gap-2"
            >
              {selectedYear}
              {isYearDropdownOpen ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            {isYearDropdownOpen && (
              <div className="absolute top-full right-0 mt-1 text-sm bg-white border border-[#e5e7eb] rounded shadow-lg z-10">
                {yearOptions.map((year) => (
                  <button
                    key={year}
                    onClick={() => {
                      setSelectedYear(year);
                      setActiveMonthIndex(sales.tooltipIndex);
                      setIsYearDropdownOpen(false);
                    }}
                    className={`block w-full text-left px-3 py-2 text-sm bg-[#f9fafb] ${
                      selectedYear === year ? "bg-[#ecf2f1] text-[#004C48] font-semibold" : "text-[#6b7280]"
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div
          className="w-full h-60 md:h-70  border-[#efefef] rounded-md bg-white relative overflow-hidden px-2 md:px-3 pl-6 md:pl-10 pt-3 pb-6"
          onMouseMove={handleChartPointerMove}
        >
          <div className="absolute left-0 md:left-1 top-3 bottom-6 w-6 md:w-8 pointer-events-none">
            {sales.yAxisLabels.map((tick) => {
              const y = topPadding + (1 - tick.value / maxValue) * (chartHeight - topPadding - bottomPadding);
              return (
                <span
                  key={tick.label}
                  className="absolute left-0 text-[12px] md:text-sm text-[#717171]"
                  style={{ top: `${(y / chartHeight) * 100}%`, transform: "translateY(-50%)" }}
                >
                  {tick.label}
                </span>
              );
            })}
          </div>

          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="absolute top-3 bottom-6 left-6 md:left-10 right-2 md:right-3 h-[calc(100%-2.25rem)] w-[calc(100%-1.75rem)] md:w-[calc(100%-3.25rem)]" preserveAspectRatio="none">
            <defs>
              <linearGradient id="salesAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#e97c35" stopOpacity="0.78" />
                <stop offset="100%" stopColor="#e97c35" stopOpacity="0.02" />
              </linearGradient>
            </defs>

            {sales.gridTicks.map((tick) => {
              const y = topPadding + (1 - tick / maxValue) * (chartHeight - topPadding - bottomPadding);
              return (
                <line
                  key={tick}
                  x1="0"
                  y1={y}
                  x2={chartWidth}
                  y2={y}
                  stroke="#eceff1"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
              );
            })}

            {hasSalesData && (
              <>
                <line
                  x1={tooltipPoint.x}
                  y1={topPadding - 6}
                  x2={tooltipPoint.x}
                  y2={chartHeight - bottomPadding + 2}
                  stroke="#d7d7d7"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />

                <path
                  d={areaPath}
                  fill="url(#salesAreaGradient)"
                />
                <path
                  d={linePath}
                  fill="none"
                  stroke="#e97c35"
                  strokeWidth="3"
                />
              </>
            )}
          </svg>

          {hasSalesData && (
            <div
              className={`absolute top-7 bg-white border border-[#ebebeb] rounded-tl-lg rounded-tr-lg rounded-bl-lg shadow-2xl overflow-hidden ${
                isTooltipNearRight
                  ? "right-2 md:right-3"
                  : isTooltipNearLeft
                    ? "left-6 md:left-10"
                    : "-translate-x-1/2"
              }`}
              style={
                isTooltipNearRight || isTooltipNearLeft
                  ? undefined
                  : { left: `${(tooltipPoint.x / chartWidth) * 100}%` }
              }
            >
              <div className="bg-[#ec8d47] px-3 pr-20 py-1 text-sm font-semibold text-white">
                {sales.months[tooltipIndex]}{showCalendarYear ? ` ${selectedCalendarYear}` : ""}
              </div>
              <div className="px-3 pr-12 py-1.5 text-base font-semibold text-[#111827]">${tooltipPoint.value.toLocaleString()}</div>
            </div>
          )}

          {!hasSalesData && !dashboardLoading && (
            <div className="absolute inset-0 grid place-items-center text-sm text-[#6b7280] px-4 text-center">
              No sales performance data found for this period.
            </div>
          )}

          <div className="absolute bottom-1 left-6 md:left-10 right-2 md:right-3 grid grid-cols-12">
            {sales.months.map((month, index) => (
              <button
                key={month}
                type="button"
                onClick={() => setActiveMonthIndex(index)}
                onMouseEnter={() => setActiveMonthIndex(index)}
                onFocus={() => setActiveMonthIndex(index)}
                className={`text-[12px] md:text-sm text-center ${
                  tooltipIndex === index ? "text-[#111827] font-semibold" : "text-[#6b7280]"
                }`}
              >
                {month}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white border border-[#ececec] rounded-md p-2 md:p-3">
        <h2 className="text-xl md:text-2xl font-bold text-[#111827] mb-2 md:mb-3 px-1 md:px-0">Listing List</h2>
        {listingsError && <p className="text-sm text-red-600 px-1 md:px-0 mb-2">{listingsError}</p>}
        {listingsLoading && paginatedRows.length === 0 && (
          <p className="text-sm text-[#6b7280] px-1 md:px-0 mb-2">Loading listings...</p>
        )}
        {!listingsLoading && paginatedRows.length === 0 ? (
          <div className="border border-[#ececec] rounded-md p-4 bg-[#fafafa] text-sm text-[#6b7280] text-center">
            No data Listing List
          </div>
        ) : (
          <>
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-sm md:text-base">
                <thead>
                  <tr className="text-sm md:text-base text-[#0C0C0C] border-b border-[#ededed]">
                    <th className="py-2 px-2 md:px-3 font-medium whitespace-nowrap">Listing Name</th>
                    <th className="py-2 px-2 md:px-3 font-medium whitespace-nowrap">Category</th>
                    <th className="py-2 px-2 md:px-3 font-medium whitespace-nowrap">User name</th>
                    <th className="py-2 px-2 md:px-3 font-medium whitespace-nowrap">Country</th>
                    <th className="py-2 px-2 md:px-3 font-medium whitespace-nowrap">Location</th>
                    <th className="py-2 px-2 md:px-3 font-medium whitespace-nowrap">Spam Report</th>
                    <th className="py-2 px-2 md:px-3 font-medium whitespace-nowrap">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedRows.map((row) => (
                    <tr key={row.id} className="border-b border-[#f1f1f1] text-sm md:text-base text-[#000000]">
                      <td className="py-3 px-2 md:px-3">{row.title}</td>
                      <td className="py-3 px-2 md:px-3">
                        <span className="inline-flex rounded px-2 py-0.5 text-sm md:text-base bg-[#00534f] text-white whitespace-nowrap">
                          {row.category}
                        </span>
                      </td>
                      <td className="py-3 px-2 md:px-3">{row.userName}</td>
                      <td className="py-3 px-2 md:px-3">{row.country}</td>
                      <td className="py-3 px-2 md:px-3">{row.location}</td>
                      <td className="py-3 px-2 md:px-3">{row.spamReport}</td>
                      <td className="py-3 px-2 md:px-3">
                        <div className="flex items-center gap-6">
                          <button className="text-[#111827] " aria-label="View listing" onClick={() => handleViewListing(row.id, row)}>
                            <Eye className="w-4 h-4 md:w-5.5 md:h-5.5" />
                          </button>
                          <button className="text-[#dc2626]" aria-label="Delete listing" onClick={() => handleDeleteListing(row.id)}>
                            <Trash2 className="w-4 h-4 md:w-5.5 md:h-5.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="sm:hidden space-y-3">
              {paginatedRows.map((row) => (
                <div key={row.id} className="border border-[#ececec] rounded-md p-3 bg-[#fafafa]">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs text-[#000000] font-medium">Listing Name</p>
                        <p className="text-sm font-semibold text-[#111827]">{row.title}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button className="text-[#111827] hover:text-[#ec8d47]" aria-label="View listing" onClick={() => handleViewListing(row.id, row)}>
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-[#ef4444] hover:text-[#dc2626]" aria-label="Delete listing" onClick={() => handleDeleteListing(row.id)}>
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-xs pb-2 text-[#000000]">Category</p>
                        <span className="inline-flex rounded px-2 py-0.5 text-sm bg-[#00534f] text-white whitespace-nowrap">
                          {row.category}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-[#000000] pb-2">Spam Report</p>
                        <p className="text-sm font-medium text-[#000000]">{row.spamReport}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-xs pb-2 text-[#000000]">User</p>
                        <p className="text-sm pb-2 text-[#000000]">{row.userName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#000000]">Country</p>
                        <p className="text-sm text-[#000000]">{row.country}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-[#000000]">Location</p>
                      <p className="text-sm text-[#000000]">{row.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 md:mt-4">
              <Pagination
                current={currentPage}
                total={totalPages}
                onPageChange={setCurrentPage}
                totalResults={Number(listingsPagination?.total || 0)}
                resultsPerPage={resultsPerPage}
              />
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
