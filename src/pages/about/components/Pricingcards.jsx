const Logo = () => (
    <div className="flex flex-col items-center mb-6 mt-1.5">
        <img src="/logo.png" alt="SideGurus.com Logo" className="h-20" />
    </div>
);

export default function PricingCards() {
    return (
        <div className="w-full min-h-screen flex items-center justify-center py-14 sm:py-16 md:py-20 px-4 sm:px-6 md:px-10 bg-[#FDF2EB]">
            <div className="w-full container mx-auto flex flex-col items-center">
                <div className="flex flex-col sm:flex-row gap-6 md:gap-10 justify-center mb-16 items-stretch w-full max-w-5xl">
                    <div className="flex-1 rounded-3xl p-6 bg-[#004C48] shadow-xl">
                        <div className="bg-white rounded-3xl px-8 pb-8 pt-4 text-center h-full flex flex-col items-center">
                            <Logo />

                            <p className="text-base font-semibold mb-3 leading-relaxed text-[#004C48]">
                                Post On {" "}
                                <span className="font-semibold text-[#E97C35]">SIDEGURUS.COM:</span>{" "}
                                Where Your Talent Meets Opportunity & Your Events Bring People Together!
                            </p>

                            <p className="text-base mb-3 leading-relaxed text-[#004C48]">
                                Are you a professional, just starting out or anything in between?
                            </p>
                            <p className="text-base mb-3 leading-relaxed text-[#004C48]">
                                Do you host community events, workshops, pop-ups ect?
                            </p>
                            <p className="text-base mb-8 leading-relaxed text-[#004C48]">
                                Join a platform that supports local talent and strengthens communities.
                            </p>

                            <div className="w-full mt-auto flex flex-col gap-3.5">
                                <button className="w-full py-3.5 rounded-xl text-white text-sm font-semibold bg-[#004C48] shadow hover:shadow-lg transition-shadow">
                                    $0.99 Introductory price
                                </button>

                                <button className="w-full py-3 rounded-xl text-sm font-semibold tracking-widest border-2 bg-white hover:bg-gray-50 transition-colors border-[#004C48] text-[#004C48]">
                                    DOWNLOAD
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 rounded-3xl p-6 bg-[#E97C35] shadow-xl">
                        <div className="bg-white rounded-3xl px-8 pb-8 pt-4 text-center h-full flex flex-col items-center">
                            <Logo />

                            <p className="text-base font-semibold mb-5 leading-relaxed text-[#D05C23]">
                                Post Your Local Gigs, Side Hustles & Skilled Services
                            </p>

                            <p className="text-base mb-3 leading-relaxed text-[#D05C23]">
                                Are you a professional, just starting out or anything in between?
                            </p>
                            <p className="text-base mb-3 leading-relaxed text-[#D05C23]">
                                Do you host community events, workshops, pop-ups ect?
                            </p>
                            <p className="text-base mb-8 leading-relaxed text-[#D05C23]">
                                Join a platform that supports local talent and strengthens communities.
                            </p>

                            <div className="w-full mt-auto flex flex-col gap-3.5">
                                <button className="w-full py-3.5 rounded-xl text-white text-sm font-semibold bg-[#E97C35] shadow hover:shadow-lg transition-shadow">
                                    $2.99 Standard Price
                                </button>

                                <button className="w-full py-3 rounded-xl text-sm font-semibold tracking-widest border-2 bg-white hover:bg-gray-50 transition-colors border-[#E97C35] text-[#E97C35]">
                                    DOWNLOAD
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <p className="text-base text-center leading-relaxed max-w-5xl mx-auto text-[#443831]">
                    SideGurus.com is your go-to platform for local gigs, side hustles, and skilled services. Whether you&apos;re a
                    professional or just starting out, we connect you with clients who need your expertise! Support our
                    mission - download our flyer, share it in your community, and help us grow! Let&apos;s build opportunities
                    together. Visit us today!
                </p>
            </div>
        </div>
    );
}