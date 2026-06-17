import { useState, useEffect } from "react";

const images = [
  { url: "/Component.webp" },
  { url: "/Rectangle.webp" },
  { url: "/Property.webp" },
  { url: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=1200&q=80" },
];

export default function Banner() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const goTo = (index) => {
    setCurrent(index);
  };

  return (
    <div className="w-full h-[calc(55vh-80px)] sm:h-[calc(50vh-80px)] md:h-[calc(90vh-64px)] bg-black relative overflow-hidden">
      
      {images.map((img, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            i === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <img
            src={img.url}
            alt={`Slide ${i + 1}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30 z-20" />
        </div>
      ))}

      <div className="absolute bottom-[6%] md:bottom-[12%] left-1/2 -translate-x-1/2 z-40 flex gap-3 items-center">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`rounded-full transition-all duration-500 border-0 outline-none ${
              i === current ? "w-4 h-4 shadow-lg" : "w-2.5 h-2.5 bg-white/40 hover:bg-white/60"
            }`}
            style={{
              backgroundColor: i === current ? "#E97C35" : undefined,
            }}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}