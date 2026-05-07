"use client";
import { useEffect, useRef } from "react";

export default function Hero() {
  const particlesRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = particlesRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: { x: number; y: number; vx: number; vy: number; r: number; alpha: number }[] = [];
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.5 + 0.1,
      });
    }

    let animId: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(184, 150, 62, ${p.alpha})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0a1628 0%, #132240 40%, #1e3a5f 80%, #0a1628 100%)" }}
    >
      {/* Animated canvas particles */}
      <canvas ref={particlesRef} className="absolute inset-0 pointer-events-none" />

      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 orb-1"
        style={{ background: "radial-gradient(circle, #b8963e, transparent)" }} />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full opacity-8 orb-2"
        style={{ background: "radial-gradient(circle, #4a90d9, transparent)" }} />
      <div className="absolute top-1/2 right-1/3 w-64 h-64 rounded-full opacity-6 orb-3"
        style={{ background: "radial-gradient(circle, #c0c8d4, transparent)" }} />

      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: "linear-gradient(rgba(192,200,212,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(192,200,212,0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px"
        }} />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-full px-4 py-2 mb-8 fade-in-up">
          <div className="w-2 h-2 rounded-full bg-[#d4af5a] pulse-ring relative" />
          <span className="text-[#d4af5a] text-sm font-medium tracking-wider uppercase">Premium Garment Care</span>
        </div>

        {/* Headline */}
        <h1
          className="text-5xl md:text-7xl font-black mb-6 leading-tight fade-in-up"
          style={{ fontFamily: "'Playfair Display', serif", animationDelay: "0.1s" }}
        >
          <span className="text-white">Premium Care for</span>
          <br />
          <span className="gradient-pulse-text">Your Wardrobe</span>
          <br />
          <span className="text-white text-4xl md:text-6xl font-bold">at the Speed of </span>
          <span className="shimmer-text text-4xl md:text-6xl">Mercury</span>
        </h1>

        {/* Subtitle */}
        <p
          className="text-[#c0c8d4] text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          Professional dry cleaning with{" "}
          <span className="font-black text-[#d4af5a]">Free Doorstep Pickup &amp; Delivery</span>{" "}
          and <span className="font-black text-[#d4af5a]">Same Day Service</span>.
          Your clothes treated with the care they deserve — returned spotless, on time.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center fade-in-up" style={{ animationDelay: "0.3s" }}>
          <button
            id="hero-book-btn"
            onClick={() => window.location.href = "/login"}
            className="glow-pulse group flex items-center gap-3 bg-gradient-to-r from-[#b8963e] to-[#d4af5a] text-white font-bold px-8 py-4 rounded-full text-base shadow-2xl hover:shadow-[#b8963e]/50 hover:scale-105 transition-all duration-300"
          >
            <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Book a Free Pickup
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <button
            onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
            className="flex items-center gap-2 border border-white/30 text-white font-medium px-8 py-4 rounded-full text-base hover:bg-white/10 hover:border-white/50 transition-all duration-300"
          >
            See How It Works
          </button>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-8 mt-16 fade-in-up" style={{ animationDelay: "0.4s" }}>
          {[
            { icon: "⚡", label: "Same Day Service", highlight: true },
            { icon: "🌿", label: "Eco-Friendly Solvents", highlight: false },
            { icon: "🛡️", label: "Garment Insurance", highlight: false },
            { icon: "📍", label: "Free Pickup & Delivery", highlight: true },
          ].map((badge) => (
            <div key={badge.label} className={`badge-bounce flex items-center gap-2 ${badge.highlight ? "bg-[#d4af5a]/15 border border-[#d4af5a]/40 rounded-full px-4 py-1.5" : "text-[#c0c8d4]"}`}>
              <span className="icon-spin text-xl">{badge.icon}</span>
              <span className={`text-sm ${badge.highlight ? "font-black text-[#d4af5a]" : "font-medium text-[#c0c8d4]"}`}>{badge.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#c0c8d4] animate-bounce">
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}
