import { useState } from "react";

const customerGuidelines = [
  {
    title: "1. Verify Before You Meet",
    points: [
      "Set up a virtual consultation using Zoom, FaceTime, or Google Meet before meeting in person.",
      "Verify identity and discuss service expectations clearly.",
      "Check available reviews, ratings, or work samples before confirming a booking."
    ]
  },
  {
    title: "2. Meet in a Public Place",
    points: [
      "Choose safe, public, and well-lit areas for first-time meetings.",
      "Bring a trusted friend or family member if you feel unsure."
    ]
  },
  {
    title: "3. Trust Your Instincts",
    points: [
      "If something feels off, politely decline and prioritize your safety.",
      "Ask clear questions about process, timing, and payment before finalizing."
    ]
  },
  {
    title: "4. Share Your Plans",
    points: [
      "Tell someone where you are going, who you are meeting, and when you expect to return.",
      "Use location sharing tools during in-person meetings when needed."
    ]
  },
  {
    title: "5. Handle Payments Securely",
    points: [
      "Avoid paying full amount upfront for unfinished services.",
      "Use traceable payment methods and keep payment proof."
    ]
  },
  {
    title: "6. Protect Personal Information",
    points: [
      "Do not overshare personal information during initial communication.",
      "Use platform messaging or secure communication channels."
    ]
  },
  {
    title: "7. Verify Credentials for Home Services",
    points: [
      "For licensed work, ask for certifications, business credentials, or references.",
      "Stay present when services are being performed at your home."
    ]
  },
  {
    title: "8. Keep Clear Written Agreements",
    points: [
      "Confirm scope, fees, and timing in written messages.",
      "Maintain records of important chats and confirmations."
    ]
  },
  {
    title: "9. Avoid Scams",
    points: [
      "Be cautious with suspicious urgency, vague identity, or unusual payment requests.",
      "Report suspicious behavior through platform support."
    ]
  },
  {
    title: "10. Exit Safely",
    points: [
      "If you feel uncomfortable at any point, end the meeting and leave immediately.",
      "Your safety should always come first."
    ]
  }
];

const providerGuidelines = [
  {
    title: "1. Verify Potential Clients",
    points: [
      "Request a Consultation Call: Use Zoom, Google Meet, or FaceTime to speak face-to-face with a potential client before meeting in person.",
      "a. Verify their identity.",
      "b. Understand their expectations and needs.",
      "Ask Questions: Gather as much information as possible about the service they need, the location, and any special requests before agreeing to meet.",
      "Research the Client: Check social media or online profiles to ensure they are legitimate."
    ]
  },
  {
    title: "2. Use Secure Communication Channels",
    points: [
      "Keep initial conversations on the platform where you are advertising your services. Avoid sharing personal phone numbers or email addresses until trust is established.",
      "Be cautious of clients who rush to take conversations offline."
    ]
  },
  {
    title: "3. Meet in Safe, Public Spaces",
    points: [
      "For first-time meetings, choose a public, well-lit location: A coffee shop or coworking space is ideal to discuss details or perform services that can be completed outside of private residences.",
      "Bring Someone Along: If possible, have a friend or colleague accompany you for added safety during the first meeting."
    ]
  },
  {
    title: "4. Know Your Surroundings",
    points: [
      "Share Your Location: Inform a friend or family member of where you're going, who you're meeting, and when you expect to return. Use location-sharing apps for real-time tracking.",
      "Have an Exit Strategy: Always park in a spot where you can leave quickly, and trust your instincts to walk away if something feels off."
    ]
  },
  {
    title: "5. Handle Payments Securely",
    points: [
      "Avoid Upfront Payment Issues: Do not accept payments via untraceable methods, such as cash apps without business verification or wire transfers. Use secure and trackable platforms like PayPal, Venmo, or Zelle.",
      "Request Deposits for Large Services: If providing a large service, require a deposit upfront. Be clear and provide written confirmation for all payment terms.",
      "Never Offer Free Services: If a client asks for a \"test run\" or a discount in exchange for exposure, proceed with caution. Your time and skills are valuable."
    ]
  },
  {
    title: "6. Protect Personal Information",
    points: [
      "Avoid sharing private information like your home address, Social Security number, or personal financial details. Use a P.O. Box or virtual business address if needed.",
      "Use a separate phone number for work purposes via apps like Google Voice or a business phone line."
    ]
  },
  {
    title: "7. Know the Scope of Work",
    points: [
      "Before agreeing to any project, clearly define the scope of work, fees, and deliverables. Get these details in writing through contracts, emails, or text confirmations.",
      "Be cautious if a client frequently changes expectations or requests services outside of what was agreed upon."
    ]
  },
  {
    title: "8. Maintain Professional Boundaries",
    points: [
      "Keep all interactions professional. Be polite but firm if a client behaves inappropriately or crosses personal boundaries.",
      "Decline services that make you uncomfortable or seem suspicious."
    ]
  },
  {
    title: "9. Share Your Portfolio Safely",
    points: [
      "Share pictures, videos, or samples of your work via professional platforms like LinkedIn, Instagram, or a personal website.",
      "Avoid sharing sensitive or private information.",
      "Watermark your photos or videos if showcasing unique work to protect your intellectual property."
    ]
  },
  {
    title: "10. Trust Your Instincts",
    points: [
      "If something feels wrong or a client is being overly demanding or vague, it's okay to decline the opportunity. Safety comes first.",
      "Develop a polite but firm way to say \"no\" to clients who are unprofessional or disrespectful of your boundaries."
    ]
  },
  {
    title: "11. Focus on Sanitation and Cleanliness",
    points: [
      "For services such as hair styling, massage therapy, or fitness, always practice professional hygiene standards. Sanitize tools, equipment, and personal spaces before and after use.",
      "Be transparent with clients about your sanitation policies and ensure they feel safe with you as a provider."
    ]
  },
  {
    title: "12. Maintain a Professional Online Presence",
    points: [
      "Build a professional portfolio or social media page to establish credibility and trust with potential clients.",
      "Encourage satisfied clients to leave reviews and ratings on the platform where you advertise your services. This helps attract more business while reassuring potential clients of your legitimacy."
    ]
  },
  {
    title: "13. Avoid Scams and Fraudulent Clients",
    points: [
      "Watch for red flags such as clients who:",
      "a. Refuse to share basic contact information.",
      "b. Pressure you into rushing a job.",
      "c. Request excessive personal details or upfront payments without meeting.",
      "If a client seems suspicious, report their activity to the platform immediately."
    ]
  },
  {
    title: "14. Document Everything",
    points: [
      "Keep records of all client communications, contracts, payment receipts, and agreements for your protection.",
      "If an issue arises, having written proof can help resolve disputes quickly and fairly."
    ]
  },
  {
    title: "15. Trustworthy Safety Tools",
    points: [
      "Use business management apps or tools like Calendly for scheduling, Square for payments, and Zoom for virtual consultations.",
      "Carry self-protection tools, such as pepper spray, when traveling to unfamiliar locations.",
      "By following these tips, service providers can safely and effectively promote their skills, connect with trustworthy clients, and grow their businesses. At SideGurus.com, we're committed to creating a professional, reliable, and secure space for local service providers to thrive.",
      "Your skills are valuable. Market them safely and confidently!"
    ]
  }
];

export default function SafetyGuide() {
  const [activeTab, setActiveTab] = useState("provider");

  const contentByTab = {
    customer: {
      heading: "Customer Safety Guidelines for Services Booked Online",
      description:
        "At SideGurus.com, your safety is our top priority. Follow these guidelines to ensure safe communication, secure meetings, and protected transactions when booking services online.",
      items: customerGuidelines
    },
    provider: {
      heading: "Service Providers Marketing and Safety Guidelines",
      description:
        "When offering your services on a platform, it is important to prioritize your safety and professional integrity. Here is a detailed list of safety tips to follow to ensure a secure and positive experience when meeting new clients and marketing your services.",
      items: providerGuidelines
    }
  };

  const activeContent = contentByTab[activeTab];
  const isProviderTab = activeTab === "provider";

  return (
    <div className="min-h-screen bg-[#f3ece6] py-6 sm:py-8 md:py-10">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 text-[#2f2f2f]">
        <div className="mx-auto w-full max-w-6xl">
        <header className="mb-7 sm:mb-8">
          <div className="flex flex-wrap gap-2.5 sm:gap-3 mb-6 sm:mb-7">
            <button
              type="button"
              onClick={() => setActiveTab("customer")}
              className={`inline-flex min-h-11 w-auto items-center justify-center rounded-md px-4 sm:px-5 py-2 text-xs sm:text-sm leading-tight text-center transition-colors ${
                activeTab === "customer"
                  ? "bg-[#E97C35] text-white"
                  : "border border-[#e3d6cc] bg-[#ecd4c2] text-[#373737]"
              }`}
            >
              Customer Safety
              <br />
              Guideline
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("provider")}
              className={`inline-flex min-h-11 w-auto items-center justify-center rounded-md px-4 sm:px-5 py-2 text-sm sm:text-base leading-tight text-center transition-colors ${
                activeTab === "provider"
                  ? "bg-[#E97C35] text-white"
                  : "border border-[#e3d6cc] bg-[#ecd4c2] text-[#555]"
              }`}
            >
              Service Providers
              <br />
              Safety Guidelines
            </button>
          </div>

          <h2 className="text-3xl sm:text-4xl  leading-[1.12] text-[#1f1f1f] font-semibold mb-3 sm:mb-4 max-w-4xl">{activeContent.heading}</h2>

          <p className="text-base sm:text-lg text-[#3d3d3d] leading-relaxed max-w-4xl">{activeContent.description}</p>

          {isProviderTab && (
            <p className="mt-3 sm:mt-4 text-sm sm:text-base text-[#3d3d3d] leading-relaxed max-w-5xl">
              <span className="font-semibold text-2xl text-[#222]">Service Providers Marketing and Safety Guidelines</span>
              <br />
              When offering your services on a platform, it&apos;s important to prioritize your safety and professional integrity. Here is a detailed list of safety tips to follow to ensure a secure and positive experience when meeting new clients and marketing your services:
            </p>
          )}
        </header>

        <section className="space-y-6 sm:space-y-7 md:space-y-8">
          {activeContent.items.map((item) => (
            <article key={item.title}>
              <h3 className="text-3xl leading-tight font-semibold mb-2.5 text-[#2a2a2a]">{item.title}</h3>
              <ul className="list-disc pl-5 sm:pl-6 text-base sm:text-lg text-[#3f3f3f] leading-relaxed space-y-1.5">
                {item.points.map((point, index) => (
                  <li key={`${item.title}-${index}`}>{point}</li>
                ))}
              </ul>
            </article>
          ))}
        </section>
        </div>
      </div>
    </div>
  );
}
