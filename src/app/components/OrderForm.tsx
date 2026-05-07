"use client";
import { useState, useCallback, useEffect } from "react";
import { useSession } from "next-auth/react";

const ITEM_TYPES = [
  // Men's & Ladies' Garments
  { label: "Shirt", baseHours: 24, pricePerUnit: 150 },
  { label: "Pant", baseHours: 24, pricePerUnit: 150 },
  { label: "Coat", baseHours: 48, pricePerUnit: 350 },
  { label: "Coat Pant", baseHours: 48, pricePerUnit: 500 },
  { label: "Coat Pant & Waistcoat", baseHours: 48, pricePerUnit: 650 },
  { label: "Ladies Suit (2-piece)", baseHours: 48, pricePerUnit: 300 },
  { label: "Ladies Suit (3-piece)", baseHours: 48, pricePerUnit: 400 },
  { label: "Ladies Top", baseHours: 24, pricePerUnit: 150 },
  { label: "Ladies Kurti", baseHours: 24, pricePerUnit: 200 },
  // Household Items
  { label: "Bedsheet", baseHours: 48, pricePerUnit: 250 },
  { label: "Pillow Cover", baseHours: 24, pricePerUnit: 50 },
  { label: "Blanket (Single Bed)", baseHours: 48, pricePerUnit: 300 },
  { label: "Blanket (Double Bed)", baseHours: 48, pricePerUnit: 400 },
  { label: "Curtain (w/o lining)", baseHours: 48, pricePerUnit: 200 },
  { label: "Curtain (w/ lining)", baseHours: 48, pricePerUnit: 250 },
];

interface ClothingItem {
  id: number;
  type: string;
  quantity: number;
  instructions: string;
}

interface FormData {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  zip: string;
  pickupDate: string;
  pickupTime: string;
  items: ClothingItem[];
}

const initialForm: FormData = {
  name: "", phone: "", email: "",
  address: "", city: "", zip: "",
  pickupDate: "", pickupTime: "",
  items: [{ id: 1, type: "Shirt", quantity: 1, instructions: "" }],
};

function computeEstimate(form: FormData) {
  if (!form.items.length) return { price: 0, deliveryDate: null };

  let totalPrice = 0;
  let maxHours = 0;

  form.items.forEach((item) => {
    const def = ITEM_TYPES.find((t) => t.label === item.type) || ITEM_TYPES[0];
    totalPrice += def.pricePerUnit * item.quantity;
    if (def.baseHours > maxHours) maxHours = def.baseHours;
  });

  let deliveryDate: Date | null = null;
  if (form.pickupDate && form.pickupTime) {
    deliveryDate = new Date(`${form.pickupDate}T${form.pickupTime}`);
    deliveryDate.setHours(deliveryDate.getHours() + maxHours);
  }

  return { price: totalPrice, deliveryDate, hours: maxHours };
}

function formatDate(d: Date) {
  return d.toLocaleString("en-US", {
    weekday: "long", month: "long", day: "numeric",
    hour: "numeric", minute: "2-digit", hour12: true,
  });
}

const STEPS = ["Your Details", "Address & Time", "Clothing Items"];

export default function OrderForm() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [nextId, setNextId] = useState(2);
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.email) {
      setForm((f) => ({ ...f, email: session.user.email as string }));
    }
  }, [session]);

  const est = computeEstimate(form);

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          estimatedPrice: est.price,
          estimatedDelivery: est.deliveryDate ? formatDate(est.deliveryDate) : null,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setSubmitted(true);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const update = useCallback((field: keyof FormData, value: unknown) => {
    setForm((f) => ({ ...f, [field]: value }));
  }, []);

  const addItem = () => {
    setForm((f) => ({
      ...f,
      items: [...f.items, { id: nextId, type: "Shirt", quantity: 1, instructions: "" }],
    }));
    setNextId((n) => n + 1);
  };

  const removeItem = (id: number) => {
    setForm((f) => ({ ...f, items: f.items.filter((i) => i.id !== id) }));
  };

  const updateItem = (id: number, field: keyof ClothingItem, value: unknown) => {
    setForm((f) => ({
      ...f,
      items: f.items.map((i) => (i.id === id ? { ...i, [field]: value } : i)),
    }));
  };

  const inputCls = "w-full bg-white border border-[#e8edf3] rounded-xl px-4 py-3 text-[#0a1628] text-sm focus:outline-none input-field transition-all duration-200 hover:border-[#b8963e]/40 placeholder-[#9aa5b4]";
  const labelCls = "block text-xs font-semibold text-[#4a5568] mb-1.5 uppercase tracking-wider";

  if (submitted) {
    return (
      <div className="bg-white rounded-3xl p-16 shadow-2xl border border-[#e8edf3] text-center max-w-2xl mx-auto my-12">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#b8963e] to-[#d4af5a] flex items-center justify-center mx-auto mb-6 text-white text-4xl">✓</div>
        <h2 className="text-3xl font-black text-[#0a1628] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Booking Confirmed!</h2>
        <p className="text-[#4a5568] mb-2">We'll confirm your pickup via email & SMS shortly.</p>
        {est.deliveryDate && (
          <p className="text-[#b8963e] font-semibold mt-4">Expected Delivery: {formatDate(est.deliveryDate)}</p>
        )}
        <button onClick={() => { setSubmitted(false); setForm(initialForm); setStep(0); }}
          className="mt-8 bg-gradient-to-r from-[#0a1628] to-[#1e3a5f] text-white font-bold px-8 py-3 rounded-full hover:scale-105 transition-all duration-300">
          Book Another Pickup
        </button>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden w-full max-w-7xl mx-auto">
      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#d4af5a]/10 border border-[#d4af5a]/30 rounded-full px-4 py-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-[#b8963e]" />
            <span className="text-[#b8963e] text-sm font-bold tracking-wider uppercase">Book a Pickup</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-[#0a1628] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Schedule Your Pickup
          </h2>
          <p className="text-[#4a5568] text-lg">Takes less than 2 minutes. Free pickup, guaranteed results.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Form Card */}
          <div className="flex-1 bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Stepper */}
            <div className="flex border-b border-[#e8edf3]">
              {STEPS.map((s, i) => (
                <button key={s} onClick={() => i < step && setStep(i)}
                  className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                    i === step ? "bg-[#0a1628] text-[#d4af5a]"
                    : i < step ? "bg-[#f8fafc] text-[#b8963e] cursor-pointer"
                    : "bg-[#f8fafc] text-[#9aa5b4] cursor-not-allowed"
                  }`}>
                  <span className={`inline-flex items-center gap-2`}>
                    <span className={`w-5 h-5 rounded-full text-xs flex items-center justify-center font-black ${
                      i < step ? "bg-[#b8963e] text-white" : i === step ? "bg-[#d4af5a] text-[#0a1628]" : "bg-[#e8edf3] text-[#9aa5b4]"
                    }`}>{i < step ? "✓" : i + 1}</span>
                    <span className="hidden sm:inline">{s}</span>
                  </span>
                </button>
              ))}
            </div>

            <div className="p-8">
              {/* Step 1: User Details */}
              {step === 0 && (
                <div className="space-y-5 fade-in-up">
                  <h3 className="text-xl font-bold text-[#0a1628] mb-6">Personal Information</h3>
                  <div>
                    <label className={labelCls}>Full Name</label>
                    <input id="inp-name" type="text" placeholder="Rajesh Kumar" className={inputCls} value={form.name} onChange={(e) => update("name", e.target.value)} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Phone Number</label>
                      <input id="inp-phone" type="tel" placeholder="+91 98765 43210" className={inputCls} value={form.phone} onChange={(e) => update("phone", e.target.value)} />
                    </div>
                    <div>
                      <label className={labelCls}>Email Address</label>
                      <input id="inp-email" type="email" readOnly className={`${inputCls} bg-[#e8edf3] cursor-not-allowed`} value={form.email} />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Address */}
              {step === 1 && (
                <div className="space-y-5 fade-in-up">
                  <h3 className="text-xl font-bold text-[#0a1628] mb-6">Pickup Address &amp; Time</h3>
                  <div>
                    <label className={labelCls}>Street Address</label>
                    <input id="inp-address" type="text" placeholder="B-12, Block B, Mansarovar Garden" className={inputCls} value={form.address} onChange={(e) => update("address", e.target.value)} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>City</label>
                      <input id="inp-city" type="text" placeholder="West Delhi" className={inputCls} value={form.city} onChange={(e) => update("city", e.target.value)} />
                    </div>
                    <div>
                      <label className={labelCls}>Pin Code</label>
                      <input id="inp-zip" type="text" placeholder="110015" className={inputCls} value={form.zip} onChange={(e) => update("zip", e.target.value)} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Pickup Date</label>
                      <input id="inp-date" type="date" className={inputCls} value={form.pickupDate}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={(e) => update("pickupDate", e.target.value)} />
                    </div>
                    <div>
                      <label className={labelCls}>Pickup Time</label>
                      <input id="inp-time" type="time" className={inputCls} value={form.pickupTime} onChange={(e) => update("pickupTime", e.target.value)} />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Clothing Items */}
              {step === 2 && (
                <div className="fade-in-up">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-[#0a1628]">Clothing Items</h3>
                    <button id="add-item-btn" onClick={addItem}
                      className="flex items-center gap-2 bg-[#0a1628] text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-[#1e3a5f] transition-colors duration-200">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add Item
                    </button>
                  </div>

                  <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
                    {form.items.map((item, idx) => (
                      <div key={item.id} className="item-enter bg-[#f8fafc] border border-[#e8edf3] rounded-2xl p-4 relative">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#b8963e] to-[#d4af5a] flex items-center justify-center text-white text-xs font-black flex-shrink-0 mt-1">
                            {idx + 1}
                          </div>
                          <div className="flex-1 grid grid-cols-2 gap-3">
                            <div>
                              <label className={labelCls}>Item Type</label>
                              <select className={inputCls + " cursor-pointer"} value={item.type}
                                onChange={(e) => updateItem(item.id, "type", e.target.value)}>
                                {ITEM_TYPES.map((t) => (
                                  <option key={t.label} value={t.label}>{t.label}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className={labelCls}>Quantity</label>
                              <div className="flex items-center gap-2">
                                <button onClick={() => updateItem(item.id, "quantity", Math.max(1, item.quantity - 1))}
                                  className="w-8 h-8 rounded-lg bg-[#e8edf3] hover:bg-[#b8963e] hover:text-white text-[#0a1628] font-bold transition-colors duration-200 flex items-center justify-center text-lg">−</button>
                                <span className="w-8 text-center font-bold text-[#0a1628]">{item.quantity}</span>
                                <button onClick={() => updateItem(item.id, "quantity", item.quantity + 1)}
                                  className="w-8 h-8 rounded-lg bg-[#e8edf3] hover:bg-[#b8963e] hover:text-white text-[#0a1628] font-bold transition-colors duration-200 flex items-center justify-center text-lg">+</button>
                              </div>
                            </div>
                            <div className="col-span-2">
                              <label className={labelCls}>Special Instructions / Stain Details</label>
                              <textarea rows={2} placeholder="e.g. Red wine stain on left sleeve..." className={inputCls + " resize-none"} value={item.instructions}
                                onChange={(e) => updateItem(item.id, "instructions", e.target.value)} />
                            </div>
                          </div>
                          {form.items.length > 1 && (
                            <button onClick={() => removeItem(item.id)}
                              className="text-red-400 hover:text-red-600 transition-colors p-1 flex-shrink-0">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation buttons */}
              <div className="flex gap-3 mt-8">
                {step > 0 && (
                  <button onClick={() => setStep((s) => s - 1)}
                    className="flex-1 border-2 border-[#0a1628] text-[#0a1628] font-bold py-3.5 rounded-xl hover:bg-[#0a1628] hover:text-white transition-all duration-300">
                    ← Back
                  </button>
                )}
                {step < STEPS.length - 1 ? (
                  <button onClick={() => setStep((s) => s + 1)}
                    className="flex-1 bg-gradient-to-r from-[#0a1628] to-[#1e3a5f] text-white font-bold py-3.5 rounded-xl hover:from-[#b8963e] hover:to-[#d4af5a] transition-all duration-300">
                    Continue →
                  </button>
                ) : (
                  <button id="submit-order-btn" onClick={handleSubmit} disabled={loading}
                    className="flex-1 bg-gradient-to-r from-[#b8963e] to-[#d4af5a] text-white font-bold py-3.5 rounded-xl hover:scale-[1.02] hover:shadow-lg transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                    {loading ? (
                      <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg> Submitting...</>
                    ) : "✓ Confirm Booking"}
                  </button>
                )}
              </div>
              {error && (
                <p className="mt-3 text-red-500 text-sm text-center font-medium">{error}</p>
              )}
            </div>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:w-80 w-full sticky top-24">
            <div className="bg-[#0a1628] rounded-3xl p-6 text-white shadow-xl">
              <h3 className="font-bold text-lg mb-5 text-[#d4af5a]">📋 Order Summary</h3>

              {/* Items list */}
              <div className="space-y-2 mb-5">
                {form.items.length === 0 ? (
                  <p className="text-[#c0c8d4] text-sm text-center py-4">No items added yet</p>
                ) : (
                  form.items.map((item) => {
                    const def = ITEM_TYPES.find((t) => t.label === item.type) || ITEM_TYPES[0];
                    return (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-[#c0c8d4]">{item.type} ×{item.quantity}</span>
                        <span className="text-white font-semibold">₹{def.pricePerUnit * item.quantity}</span>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="border-t border-white/10 pt-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-[#c0c8d4] font-semibold">Estimated Total</span>
                  <span className="text-2xl font-black text-[#d4af5a] price-update" key={est.price}>₹{est.price}</span>
                </div>
              </div>

              {/* Delivery estimate */}
              <div className="mt-5 bg-white/5 rounded-2xl p-4">
                <p className="text-xs text-[#c0c8d4] uppercase tracking-wider mb-1 font-semibold">Expected Delivery</p>
                {est.deliveryDate ? (
                  <p className="text-white font-bold text-sm">{formatDate(est.deliveryDate)}</p>
                ) : (
                  <p className="text-[#9aa5b4] text-sm">Select pickup date &amp; time to see estimate</p>
                )}
                {est.hours && (
                  <p className="text-xs text-[#b8963e] mt-1 font-medium">
                    🕐 {est.hours}hr turnaround
                  </p>
                )}
              </div>

              {/* Pickup info */}
              {form.address && (
                <div className="mt-4 bg-white/5 rounded-2xl p-4">
                  <p className="text-xs text-[#c0c8d4] uppercase tracking-wider mb-1 font-semibold">Pickup Address</p>
                  <p className="text-white text-sm">{form.address}{form.city ? `, ${form.city}` : ""}</p>
                </div>
              )}

              <p className="text-center text-xs text-[#9aa5b4] mt-4">Free pickup &amp; delivery included</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
