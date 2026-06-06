import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Ticket, ConciergeBell, User, HandPlatter, CreditCard } from "lucide-react";

/**
 * UserDashboard Component
 *
 * This is the user dashboard where users can:
 * - View their posted events
 * - View their services
 * - Manage account settings
 *
 * Only accessible to users with 'user' role
 */
export default function Profile() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const userName = user?.name || "User";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const dashboardCards = [
    {
      label: "My Events",
      icon: <CreditCard size={80} strokeWidth={1.5} className="text-[#2D2B2B" />,
      bg: "bg-[#FFE5D5]",
      textColor: "text-[#2D2B2B]",
      onClick: () => navigate("/profile/my-events"),
    },
    {
      label: "My Services",
      icon: <HandPlatter size={80} strokeWidth={1.5} className="text-[#FFFFFF]" />,
      bg: "bg-[#FA8649]",
      textColor: "text-[#FFFFFF]",
      onClick: () => navigate("/profile/my-services"),
    },
    {
      label: "Account",
      icon: <User size={80} strokeWidth={1.5} className="text-white" />,
      bg: "#014D48",
      bgStyle: { backgroundColor: "#1a5c52" },
      textColor: "text-white",
      onClick: () => navigate("/profile/account"),
    },
  ];

  return (
    <div className="bg-[#fbfbfb] px-4 sm:px-6 py-14 md:py-24">
      <div className="container mx-auto">
        <div className="mx-auto w-full max-w-280">

          {/* Greeting Section */}
          <div className="mb-8">
            <p className="text-sm text-gray-700">
              Hello <span className="font-semibold">{userName}</span> (Not {userName}?{" "}
              <button
                onClick={handleLogout}
                className="text-orange-500 cursor-pointer hover:underline font-medium bg-none border-none p-0"
              >
                Log Out
              </button>
              )
            </p>
          </div>

          {/* Dashboard Cards Row */}
          <div className="flex flex-wrap justify-center gap-4">
            {dashboardCards.map((card, index) => (
              <button
                key={index}
                onClick={card.onClick}
                className={`flex h-70 w-full max-w-90 flex-col items-center justify-center rounded-xl border-none sm:w-85 ${card.bg}`}
                style={card.bgStyle || {}}
              >
                {card.icon}
                <p className={`mt-4 text-sm font-medium ${card.textColor}`}>{card.label}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}