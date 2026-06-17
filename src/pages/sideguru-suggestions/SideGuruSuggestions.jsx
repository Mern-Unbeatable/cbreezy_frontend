const SideGuruSuggestions = () => {
  const suggestions = {
    "Creative & Artistic": [
      "Caricature Artist – Creates humorous or exaggerated portraits at events or for personal use.",
      "Storyboard Artist – Designs visual storyboards for films, commercials, or animations.",
      "Muralist – Paints large-scale murals for homes, businesses, or public spaces.",
      "Comic Book Illustrator – Creates illustrations for comic books or graphic novels.",
      "Graffiti Artist – Offers custom graffiti art for businesses or private spaces.",
      "Tattoo Designer – Designs custom tattoos for clients before they visit a tattoo artist.",
      "Pet Portrait Artist – Creates custom portraits of pets in various artistic styles.",
      "Fantasy Map Illustrator – Designs maps for books, games, or tabletop RPGs like Dungeons & Dragons.",
      "Calligrapher – Specializes in elegant handwriting for weddings, events, or custom artwork.",
      "Digital Matte Painter – Creates digital backgrounds for films or video games.",
    ],
    "Tech & Digital Professions": [
      "AI Prompt Engineer – Helps businesses or individuals optimize AI tools like ChatGPT or MidJourney.",
      "Virtual Reality (VR) Experience Designer – Creates immersive VR environments for gaming or training.",
      "Droneographer – Specializes in aerial photography and videography using drones.",
      "3D Modeler – Designs 3D models for video games, animations, or 3D printing.",
      "Game Tester – Tests video games for bugs and provides feedback to developers.",
      "NFT Artist – Creates digital art for non-fungible tokens (NFTs).",
      "Chatbot Designer – Builds and customizes chatbots for businesses.",
      "Augmented Reality (AR) Developer – Creates AR experiences for apps or marketing campaigns.",
    ],
    "Event & Entertainment Professions": [
      "Escape Room Designer – Designs puzzles and themes for escape rooms.",
      "Party Motivator – Keeps guests engaged and energized at events or parties.",
      "Historical Reenactor – Portrays historical figures or events for educational or entertainment purposes.",
      "Voice Actor – Provides voiceovers for animations, commercials, or audiobooks.",
      "Puppeteer – Performs with puppets for events, children's parties, or TV shows.",
      "Stand-Up Comedy Writer – Writes jokes and routines for comedians.",
      "Costume Designer – Creates custom costumes for theater, film, or cosplay.",
      "Escape Artist – Performs escape stunts at events or parties.",
    ],
    "Lifestyle & Personal Services": [
      "Personal Historian – Writes and records life stories for individuals or families.",
      "Happiness Coach – Helps clients find joy and fulfillment in their lives.",
    ],
    "Food & Beverage Professions": [
      "Food Stylist – Prepares and arranges food for photography or film.",
      "Beverage Consultant – Creates custom drink menus for bars or events.",
      "Chocolate Sculptor – Designs edible chocolate sculptures for events or gifts.",
      "Foraging Guide – Leads foraging tours for wild edible plants and mushrooms.",
      "Tea Sommelier – Specializes in tea pairing and education.",
      "Cake Sculptor – Creates custom-shaped cakes for special occasions.",
      "Food Taster – Has a distinct pallet and will give feedback for your dishes, tells you what is missing and make that dish a mouth watering masterpiece.",
    ],
    "Outdoor & Adventure Professions": [
      "Geocaching Guide – Leads geocaching adventures for individuals or groups.",
      "Survival Skills Instructor – Teaches wilderness survival techniques.",
      "Treehouse Builder – Designs and constructs custom treehouses.",
      "Falconry Trainer – Offers falconry experiences or training sessions.",
      "Urban Explorer Guide – Leads tours of abandoned or hidden urban locations.",
      "Stargazing Guide – Hosts stargazing events and teaches astronomy basics.",
    ],
    "Business & Marketing Professions": [
      "Brand Namer – Creates unique and catchy names for businesses or products.",
      "Jingle Writer – Composes catchy jingles for commercials or brands.",
      "Crowdfunding Consultant – Helps individuals or businesses launch successful crowdfunding campaigns.",
      "Podcast Producer – Manages all aspects of podcast creation and distribution.",
      "E-Commerce Niche Finder – Identifies profitable niches for online businesses.",
      "Resume Writer – Creates professional resumes tailored to specific industries.",
      "LinkedIn Profile Writer – Optimizes LinkedIn profiles for job seekers or professionals.",
    ],
    "Niche Professions": [
      "Professional Apologist – Writes or delivers apologies on behalf of individuals or businesses.",
      "Time Capsule Creator – Designs and assembles time capsules for events or families.",
      "Memory Box Curator – Creates personalized memory boxes for special occasions.",
      "Laughter Yoga Instructor – Leads laughter yoga sessions for stress relief.",
      "Professional Whistler – Performs whistling at events or for recordings.",
      "Celebrity Impersonator – Impersonates famous celebrities for events or parties.",
      "Professional Line Stander – Waits in line for tickets, events, or product launches.",
      "Ethical Hacker – Tests the security of websites or systems for vulnerabilities.",
      "Professional Organizer for Digital Files – Helps clients organize their digital files and devices.",
      "Custom Perfume Maker – Creates personalized fragrances for clients.",
      "Professional Gift Wrapper – Offers high-end gift wrapping services.",
      "Balloon Artist – Creates intricate balloon sculptures for events.",
      "Pet Food Taster – Tests and reviews pet food for quality and taste.",
    ],
    "Eco-Friendly & Sustainable Professions": [
      "Upcycling Artist – Turns old or discarded items into new, functional art pieces.",
      "Composting Consultant – Helps households or businesses set up composting systems.",
      "Sustainable Living Coach – Teaches eco-friendly lifestyle practices.",
      "Green Roof Designer – Designs and installs eco-friendly green roofs.",
      "Zero-Waste Event Planner – Organizes events with minimal environmental impact.",
    ],
    "Unique Professions": [
      "Professional Sleeper – Tests mattresses, pillows, or sleep products for companies.",
      "Mystery Novelist – Writes custom mystery stories for individuals or events.",
      "Professional Dungeon Master – Hosts custom Dungeons & Dragons campaigns.",
      "Custom Puzzle Maker – Creates personalized jigsaw puzzles from photos or designs.",
      "Hologram Designer – Designs holographic displays for events or marketing.",
      "Professional Witness – Acts as a witness for weddings, legal documents, or events.",
      "Custom Emoji Designer – Creates personalized emojis for individuals or brands.",
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F9FAFB] to-white">
      {/* Header */}
      <div className="border-b border-[#ececec] bg-white">
        <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
          <h1 className="text-3xl md:text-5xl font-bold text-[#111827] mb-2">
            SideGuru Suggestions
          </h1>
          <p className="text-base md:text-lg text-[#6B7280]">
            Explore unique and unconventional side gig opportunities across various industries
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="space-y-12 md:space-y-16">
          {Object.entries(suggestions).map((category, index) => (
            <section key={index} className="scroll-mt-20">
              {/* Category Header */}
              <div className="mb-6 md:mb-8">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-1 w-1 rounded-full bg-[#E97C35]"></div>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#111827]">
                    {category[0]}
                  </h2>
                </div>
                <div className="h-1 w-16 bg-gradient-to-r from-[#E97C35] to-transparent rounded-full"></div>
              </div>

              {/* Suggestions Grid */}
              <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2">
                {category[1].map((suggestion, idx) => (
                  <div
                    key={idx}
                    className="group p-4 md:p-6 rounded-lg border border-[#ececec] bg-white hover:border-[#E97C35] hover:shadow-md transition-all duration-300 hover:bg-gradient-to-br hover:from-white hover:to-[#FEF5F0]"
                  >
                    <p className="text-sm md:text-base leading-relaxed text-[#374151] group-hover:text-[#111827]">
                      <span className="font-semibold text-[#E97C35]">
                        {suggestion.split(" – ")[0]}
                      </span>
                      {" – "}
                      {suggestion.split(" – ")[1]}
                    </p>
                  </div>
                ))}
              </div>

              {/* Divider */}
              {index < Object.entries(suggestions).length - 1 && (
                <div className="mt-12 md:mt-16 border-b border-[#ececec]"></div>
              )}
            </section>
          ))}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-gradient-to-r from-[#E97C35] to-[#cf6d2e] mt-16 md:mt-20">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-16 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 md:mb-4">
            Found Your Perfect Side Gig?
          </h3>
          <p className="text-base md:text-lg text-orange-50 mb-6">
            Connect with local service providers and find the right help for your needs
          </p>
          <a
            href="/services"
            className="inline-block px-8 md:px-10 py-3 md:py-4 bg-white text-[#E97C35] font-semibold rounded-lg hover:bg-orange-50 transition-colors duration-300"
          >
            Explore Services
          </a>
        </div>
      </div>
    </div>
  );
};

export default SideGuruSuggestions;
