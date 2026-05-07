"use client";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#0a1628]/95 backdrop-blur-xl shadow-2xl border-b border-white/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <button onClick={() => scrollTo("hero")} className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-[#b8963e] to-[#d4af5a] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
            <span className="text-white font-black text-lg tracking-tight">M</span>
          </div>
          <div>
            <span className="text-white font-bold text-xl tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              Mercury
            </span>
            <span className="text-[#c0c8d4] text-sm block leading-none -mt-0.5 tracking-widest uppercase font-light">
              Dry Cleaners
            </span>
          </div>
        </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { label: "Services", id: "how-it-works" },
            { label: "About", id: "testimonials" },
            { label: "Contact", id: "footer" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="link-sweep text-[#c0c8d4] hover:text-[#d4af5a] text-sm font-medium tracking-wide transition-colors duration-200"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* CTA Button */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              window.location.href = "/login";
            }}
            className="hidden md:flex items-center gap-2 border border-[#d4af5a]/50 text-[#c0c8d4] font-medium px-5 py-2 rounded-full text-sm hover:border-[#d4af5a] hover:text-[#d4af5a] transition-all duration-300"
          >
            Track Order
          </button>
          
          <button
            id="nav-book-btn"
            onClick={() => window.location.href = "/login"}
            className="hidden md:flex items-center gap-2 bg-gradient-to-r from-[#b8963e] to-[#d4af5a] text-white font-semibold px-6 py-2.5 rounded-full text-sm shadow-lg hover:shadow-[#b8963e]/40 hover:scale-105 transition-all duration-300"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Book Pickup
          </button>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <div className={`w-6 h-0.5 bg-white mb-1.5 transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <div className={`w-6 h-0.5 bg-white mb-1.5 transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
            <div className={`w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-[#0a1628]/98 backdrop-blur-xl border-t border-white/10 transition-all duration-300 overflow-hidden ${
          menuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 py-4 flex flex-col gap-4">
          {[
            { label: "Services", id: "how-it-works" },
            { label: "About", id: "testimonials" },
            { label: "Contact", id: "footer" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="text-left text-[#c0c8d4] hover:text-white font-medium py-1"
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => {
              window.location.href = "/login";
            }}
            className="border border-[#d4af5a]/50 text-white font-medium px-6 py-2.5 rounded-full text-sm w-full mb-2"
          >
            Track Order / Login
          </button>
          <button
            onClick={() => window.location.href = "/login"}
            className="bg-gradient-to-r from-[#b8963e] to-[#d4af5a] text-white font-semibold px-6 py-2.5 rounded-full text-sm w-full"
          >
            Book Pickup
          </button>
        </div>
      </div>
    </nav>
  );
}
