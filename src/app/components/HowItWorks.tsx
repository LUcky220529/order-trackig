"use client";
import { useEffect, useRef } from "react";

const steps = [
  {
    number: "01",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    title: "Schedule Pickup",
    desc: "Book online in minutes. Choose your preferred date and time — we come to your door, anywhere in the city.",
    color: "from-[#b8963e] to-[#d4af5a]",
  },
  {
    number: "02",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: "We Clean & Care",
    desc: "Our expert team inspects, treats stains, and applies eco-friendly dry cleaning processes for a flawless finish.",
    color: "from-[#1e3a5f] to-[#4a90d9]",
  },
  {
    number: "03",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    title: "Fresh Delivery",
    desc: "Your pristine garments are returned, perfectly pressed and packaged, right back to your doorstep.",
    color: "from-[#2d7a4f] to-[#4caf7a]",
  },
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.15 }
    );
    const els = sectionRef.current?.querySelectorAll(".reveal");
    els?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="how-it-works" ref={sectionRef} className="py-24 bg-[#f8fafc] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-5"
        style={{ background: "radial-gradient(circle, #0a1628, transparent)", transform: "translate(30%, -30%)" }} />
      <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-5"
        style={{ background: "radial-gradient(circle, #b8963e, transparent)", transform: "translate(-30%, 30%)" }} />

      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16 reveal">
          <div className="inline-flex items-center gap-2 bg-[#0a1628]/5 border border-[#0a1628]/10 rounded-full px-4 py-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-[#b8963e]" />
            <span className="text-[#0a1628] text-sm font-medium tracking-wider uppercase">Simple Process</span>
          </div>
          <h2
            className="text-4xl md:text-5xl font-black text-[#0a1628] mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            How It Works
          </h2>
          <p className="text-[#4a5568] text-lg max-w-xl mx-auto">
            Three effortless steps to immaculate clothes — no hassle, no guesswork.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector line (desktop) */}
          <div className="hidden md:block absolute top-14 left-1/6 right-1/6 h-px bg-gradient-to-r from-[#b8963e] via-[#4a90d9] to-[#4caf7a] opacity-30" />

          {steps.map((step, i) => (
            <div
              key={step.number}
              className="reveal card-lift"
              style={{ transitionDelay: `${i * 0.15}s` }}
            >
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#e8edf3] text-center h-full flex flex-col items-center relative">
                {/* Step number */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white border border-[#e8edf3] rounded-full w-8 h-8 flex items-center justify-center">
                  <span className="text-xs font-bold text-[#b8963e]">{i + 1}</span>
                </div>

                {/* Icon */}
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white mb-6 shadow-lg`}>
                  {step.icon}
                </div>

                {/* Large number watermark */}
                <div className="text-7xl font-black text-[#0a1628]/5 absolute top-4 right-4 leading-none select-none">
                  {step.number}
                </div>

                <h3 className="text-xl font-bold text-[#0a1628] mb-3">{step.title}</h3>
                <p className="text-[#4a5568] text-sm leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 reveal">
          {[
            { value: "5,000+", label: "Happy Customers" },
            { value: "48hr", label: "Standard Turnaround" },
            { value: "99.2%", label: "Satisfaction Rate" },
            { value: "24hr", label: "Express Option" },
          ].map((stat) => (
            <div key={stat.label} className="text-center bg-white rounded-xl p-6 shadow-sm border border-[#e8edf3]">
              <div className="text-3xl font-black text-[#b8963e] mb-1">{stat.value}</div>
              <div className="text-sm text-[#4a5568] font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
