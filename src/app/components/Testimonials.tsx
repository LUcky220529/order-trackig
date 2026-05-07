"use client";

const reviews = [
  { name: "Yashna Kapoor", role: "Verified Customer · 7 Reviews", rating: 5, text: "I got my sofa and curtains dry cleaned. Amazing results and no damage. Very professional team. They did it all so well and at my door step. Literally one call away before the guests come ❤️", avatar: "Y" },
  { name: "Madhu Bhatia", role: "Verified Customer · 4 Reviews", rating: 5, text: "Excellent laundry service! Clothes came back super clean, fresh, and well-ironed. Delivery was on time and staff was very polite. Highly recommended for anyone in Mansarovar Garden.", avatar: "M" },
  { name: "Muskan Sharma", role: "Verified Customer · 2 Reviews", rating: 5, text: "Quick service, great cleaning, and reasonable rates. Highly recommended. Good experience. Pickup and delivery smooth. Top-notch quality!", avatar: "M" },
  { name: "Tanisha Sahlot", role: "Verified Customer · 5 Reviews", rating: 5, text: "I gave my sneakers for cleaning and honestly they look almost new now. Very professional shoe cleaning service. Totally worth it!", avatar: "T" },
  { name: "Subhash Chand", role: "Verified Customer", rating: 5, text: "Great experience, from booking to delivery everything was smooth.", avatar: "S" },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-[#f8fafc] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#b8963e] via-[#4a90d9] to-[#b8963e]" />
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-[#0a1628]/5 border border-[#0a1628]/10 rounded-full px-4 py-2 mb-4">
            <span className="text-[#b8963e] text-sm font-medium tracking-wider uppercase">⭐ Customer Stories</span>
          </div>
          <h2 className="heading-underline text-4xl md:text-5xl font-black text-[#0a1628] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Trusted by Thousands
          </h2>
          <p className="text-[#4a5568] text-lg max-w-xl mx-auto">Real stories from people who trust Mercury with their wardrobe.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((r) => (
            <div key={r.name} className="tilt-card shimmer-card card-lift bg-white rounded-2xl p-7 border border-[#e8edf3] shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0a1628] to-[#1e3a5f] flex items-center justify-center text-white font-black text-lg flex-shrink-0">
                  {r.avatar}
                </div>
                <div>
                  <p className="font-bold text-[#0a1628]">{r.name}</p>
                  <p className="text-xs text-[#9aa5b4]">{r.role}</p>
                </div>
                <div className="ml-auto flex gap-0.5">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <span key={i} className="text-[#b8963e] text-sm">★</span>
                  ))}
                </div>
              </div>
              <p className="text-[#4a5568] text-sm leading-relaxed italic">&ldquo;{r.text}&rdquo;</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
