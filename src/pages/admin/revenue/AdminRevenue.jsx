import { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Landmark,
  Package,
  UserRound,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { mapYearLabelToPeriod } from "../../../features/admin/adminAPI";
import { fetchAdminDashboardOverview } from "../../../features/admin/adminSlice";

const iconMap = {
  UserRound,
  Package,
  Landmark,
  AlertTriangle,
};

const AdminRevenue = () => {
  const dispatch = useDispatch();
  const [selectedYear, setSelectedYear] = useState("This year");
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);

  const yearOptions = useSelector((state) => state.admin.yearOptions);
  const stats = useSelector((state) => state.admin.dashboard.stats);
  const sales = useSelector((state) => state.admin.dashboard.sales);
  const dashboardLoading = useSelector((state) => state.admin.dashboardLoading);
  const dashboardError = useSelector((state) => state.admin.dashboardError);
  const [activeMonthIndex, setActiveMonthIndex] = useState(sales.tooltipIndex);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsYearDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
    setActiveMonthIndex(sales.tooltipIndex || 0);
  }, [sales.tooltipIndex]);

  const chartWidth = 1000;
  const chartHeight = 260;
  const topPadding = 30;
  const bottomPadding = 20;
  const maxValue = sales.maxValue;
  const selectedSalesData = sales.salesData;
  const normalizedSalesData = Array.isArray(selectedSalesData) ? selectedSalesData : [];
  const chartMonths = Array.isArray(sales.months) ? sales.months.slice(0, normalizedSalesData.length) : [];
  const selectedYearOffset = yearOptions.indexOf(selectedYear);
  const selectedCalendarYear =
    new Date().getFullYear() - (selectedYearOffset >= 0 ? selectedYearOffset : 0);
  const showCalendarYear = selectedYear === "This year" || selectedYear === "Last year";

  const points = normalizedSalesData.map((value, index) => {
    const x = normalizedSalesData.length > 1 ? (index / (normalizedSalesData.length - 1)) * chartWidth : chartWidth / 2;
    const normalized = value / maxValue;
    const y = topPadding + (1 - normalized) * (chartHeight - topPadding - bottomPadding);
    return { x, y, value };
  });
  const hasChartData = points.length > 0;

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
  const tooltipIndex = hasChartData ? Math.min(Math.max(activeMonthIndex, 0), points.length - 1) : 0;
  const tooltipPoint = hasChartData ? points[tooltipIndex] : { x: 0, y: 0, value: 0 };
  const tooltipEdgeThreshold = 120;
  const isTooltipNearLeft = hasChartData && tooltipPoint.x <= tooltipEdgeThreshold;
  const isTooltipNearRight = hasChartData && tooltipPoint.x >= chartWidth - tooltipEdgeThreshold;
  const summaryStats = stats.slice(0, 3);

  useEffect(() => {
    if (!hasChartData) {
      if (activeMonthIndex !== 0) {
        setActiveMonthIndex(0);
      }
      return;
    }

    if (activeMonthIndex > points.length - 1) {
      setActiveMonthIndex(points.length - 1);
    }
  }, [activeMonthIndex, hasChartData, points.length]);

  const handleChartPointerMove = (event) => {
    if (!hasChartData) return;

    const rect = event.currentTarget.getBoundingClientRect();
    if (!rect.width) return;

    const relativeX = Math.min(
      Math.max((event.clientX - rect.left) / rect.width, 0),
      1,
    );
    const nextIndex = Math.round(relativeX * (normalizedSalesData.length - 1));
    setActiveMonthIndex(nextIndex);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="px-2 md:px-0">
        <h1 className="text-2xl sm:text-3xl md:text-[34px] leading-none font-semibold text-[#111827]">Revenue Tracking</h1>
        <p className="text-sm md:text-base text-[#464646] mt-2">
          Monitor platform earnings and transaction history
        </p>
        {dashboardError && <p className="text-sm text-red-600 mt-1">{dashboardError}</p>}
      </div>

      {dashboardLoading && (
        <div className="rounded-md border border-[#ececec] bg-white p-4 text-sm text-[#6b7280]">Loading revenue data...</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
        {summaryStats.map((item, idx) => {
          const Icon = iconMap[item.icon] || Package;
          return (
            <div key={`${item.title}-${idx}`} className="bg-white border border-[#e5e7eb] rounded-lg p-4 md:p-5 flex flex-col">
              <p className="text-[11px] md:text-[12px] text-[#6b7280] font-medium mb-3">{item.title}</p>
              <div className="flex items-center justify-between mb-3 flex-1">
                <p className="text-3xl  leading-none font-bold text-[#111827]">{item.value}</p>
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-[#E6EDED] text-[#004C48] flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6 md:w-7 md:h-7" strokeWidth={1.5} />
                </div>
              </div>
              <p className="text-[11px] md:text-[12px] text-[#004C48]">{item.delta}</p>
            </div>
          );
        })}
      </div>

      <section className="bg-white border border-[#ececec] rounded-md p-2 md:p-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4 md:mb-6 px-1 md:px-0">
          <h2 className="text-xl md:text-[30px] font-semibold text-[#111827]">Sales Performance</h2>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
              className="px-3 py-1.5 text-sm text-[#4A5154] border border-[#e5e7eb] rounded hover:bg-[#f3f4f6] flex items-center gap-2"
            >
              {selectedYear}
              {isYearDropdownOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {isYearDropdownOpen && (
              <div className="absolute top-full right-0 mt-1 text-sm bg-white border border-[#e5e7eb] rounded shadow-lg z-10 min-w-30">
                {yearOptions.map((year) => (
                  <button
                    key={year}
                    onClick={() => {
                      setSelectedYear(year);
                      setActiveMonthIndex(sales.tooltipIndex);
                      setIsYearDropdownOpen(false);
                    }}
                    className={`block w-full text-left px-3 py-2 text-sm hover:bg-[#f3f4f6] ${
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
          className="w-full h-60 md:h-72 border border-[#efefef] rounded-md bg-white relative overflow-hidden px-2 md:px-3 pl-6 md:pl-10 pt-3 pb-6"
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
            {(Array.isArray(sales.gridTicks) ? sales.gridTicks : []).map((tick) => {
              const y = topPadding + (1 - tick / maxValue) * (chartHeight - topPadding - bottomPadding);
              return <line key={tick} x1="0" y1={y} x2={chartWidth} y2={y} stroke="#eceff1" strokeWidth="1" strokeDasharray="4 4" />;
            })}
            {hasChartData && (
              <>
                <line x1={tooltipPoint.x} y1={topPadding - 6} x2={tooltipPoint.x} y2={chartHeight - bottomPadding + 2} stroke="#d7d7d7" strokeWidth="1" strokeDasharray="4 4" />
                <path d={areaPath} fill="url(#salesAreaGradient)" />
                <path d={linePath} fill="none" stroke="#e97c35" strokeWidth="3" />
              </>
            )}
          </svg>

          {hasChartData && (
            <div
              className={`absolute top-7 bg-white border border-[#ebebeb] rounded-tl-lg rounded-tr-lg rounded-bl-lg shadow-2xl overflow-hidden z-20 ${
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
              <div className="bg-[#ec8d47] px-3 pr-16 py-1 text-sm font-semibold text-white">
                {chartMonths[tooltipIndex]}{showCalendarYear ? ` ${selectedCalendarYear}` : ""}
              </div>
              <div className="px-3 pr-12 py-1.5 text-base font-semibold text-[#111827]">${tooltipPoint.value.toLocaleString()}</div>
            </div>
          )}

          {!hasChartData && (
            <div className="absolute inset-0 flex items-center justify-center text-sm text-[#6b7280]">
              No sales data available for this period.
            </div>
          )}

          <div className="absolute bottom-1 left-6 md:left-10 right-2 md:right-3 grid grid-cols-12">
            {chartMonths.map((month, index) => (
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
    </div>
  );
};

export default AdminRevenue;
