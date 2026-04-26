"use client";

const reviews = [
  { name: "Sarah M.", role: "Regular Customer", rating: 5, text: "Mercury turned my ruined wedding dress into something pristine again. Absolute lifesavers. The express service is worth every penny!", avatar: "S" },
  { name: "James T.", role: "Business Professional", rating: 5, text: "I send all my suits here. Turnaround is always on time and the quality is impeccable. The online booking makes it incredibly convenient.", avatar: "J" },
  { name: "Priya K.", role: "Fashion Enthusiast", rating: 5, text: "Finally a dry cleaner that handles delicate fabrics properly. My silk sarees come back perfectly every single time. Highly recommend!", avatar: "P" },
  { name: "David L.", role: "Hotel Manager", rating: 5, text: "We use Mercury for our staff uniforms. Professional, reliable, and the bulk pricing is excellent. Can't imagine using anyone else.", avatar: "D" },
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
          <h2 className="text-4xl md:text-5xl font-black text-[#0a1628] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Trusted by Thousands
          </h2>
          <p className="text-[#4a5568] text-lg max-w-xl mx-auto">Real stories from people who trust Mercury with their wardrobe.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((r) => (
            <div key={r.name} className="card-lift bg-white rounded-2xl p-7 border border-[#e8edf3] shadow-sm">
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
