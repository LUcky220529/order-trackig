"use client";
import React, { useState } from "react";
import { ITEM_TYPES, computeEstimate, getDeliveryDate, formatDate } from "@/lib/constants";

interface OfflineBillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function OfflineBillModal({ isOpen, onClose, onSuccess }: OfflineBillModalProps) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    express: false,
    items: [{ id: 1, type: "Shirt", quantity: 1, instructions: "" }],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const addItem = () => {
    setForm((f) => ({
      ...f,
      items: [...f.items, { id: Date.now(), type: "Shirt", quantity: 1, instructions: "" }],
    }));
  };

  const removeItem = (id: number) => {
    setForm((f) => ({ ...f, items: f.items.filter((i) => i.id !== id) }));
  };

  const updateItem = (id: number, field: string, value: string | number) => {
    setForm((f) => ({
      ...f,
      items: f.items.map((i) => (i.id === id ? { ...i, [field]: value } : i)),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.email) {
      setError("Please fill out customer details.");
      return;
    }
    
    setLoading(true);
    setError("");

    // Offline bills are dropped off in-store at the current time
    const now = new Date();
    const pickupDate = now.toISOString().split("T")[0];
    const pickupTime = now.toTimeString().substring(0, 5); // HH:MM

    const estBase = computeEstimate(form.items);
    let hours = estBase.hours;
    if (form.express) hours = Math.max(12, hours / 2); // Quick express logic

    const deliveryDateObj = getDeliveryDate(pickupDate, pickupTime, hours);
    const estimatedDelivery = deliveryDateObj ? formatDate(deliveryDateObj) : null;
    let estimatedPrice = estBase.price;
    if (form.express) estimatedPrice = Math.floor(estimatedPrice * 1.5);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          address: "In-store Drop-off",
          city: "In-store",
          zip: "000000",
          pickupDate,
          pickupTime,
          estimatedPrice,
          estimatedDelivery,
        }),
      });

      const data = await res.json();
      if (data.success) {
        onSuccess();
        setLastOrderId(data.orderId);
        setForm({
          name: "", phone: "", email: "", express: false,
          items: [{ id: Date.now(), type: "Shirt", quantity: 1, instructions: "" }],
        });
      } else {
        setError(data.message || "Failed to create order");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setLoading(false);
    }
  };

  const [lastOrderId, setLastOrderId] = useState<string | null>(null);

  if (lastOrderId) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#b8963e] to-[#d4af5a] flex items-center justify-center mx-auto mb-6 text-white text-4xl">✓</div>
          <h2 className="text-2xl font-black text-[#0a1628] mb-2">Order Created!</h2>
          <p className="text-[#4a5568] mb-6">The bill has been generated and the receipt was sent to the customer.</p>
          
          <div className="space-y-3">
            <a
              href={`/track/${lastOrderId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-[#0a1628] text-[#d4af5a] py-3 rounded-xl font-bold hover:scale-[1.02] transition-all"
            >
              📦 View Tracking Page
            </a>
            <button
              onClick={() => { setLastOrderId(null); onClose(); }}
              className="w-full py-3 text-[#9aa5b4] font-bold hover:text-[#0a1628] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="p-6 border-b border-[#e8edf3] flex justify-between items-center bg-[#0a1628] text-white">
          <h2 className="text-xl font-bold text-[#d4af5a]">Create Offline Bill</h2>
          <button onClick={onClose} className="text-[#9aa5b4] hover:text-white transition-colors">✕</button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">{error}</div>}

          <div className="space-y-6">
            {/* Customer Details */}
            <div>
              <h3 className="text-sm font-bold text-[#0a1628] mb-3 uppercase tracking-wider">Customer Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text" placeholder="Full Name" value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-[#f8fafc] border border-[#e8edf3] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#b8963e]"
                />
                <input
                  type="tel" placeholder="Phone Number" value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full bg-[#f8fafc] border border-[#e8edf3] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#b8963e]"
                />
                <input
                  type="email" placeholder="Email Address" value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-[#f8fafc] border border-[#e8edf3] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#b8963e] md:col-span-2"
                />
              </div>
            </div>

            {/* Service Options */}
            <div>
               <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.express} onChange={(e) => setForm({ ...form, express: e.target.checked })} className="rounded text-[#b8963e] focus:ring-[#b8963e]" />
                  <span className="text-sm font-bold text-[#0a1628]">Express Service (50% extra, faster delivery)</span>
               </label>
            </div>

            {/* Items */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-bold text-[#0a1628] uppercase tracking-wider">Clothing Items</h3>
                <button onClick={addItem} className="text-xs bg-[#e8edf3] hover:bg-[#d4af5a] hover:text-[#0a1628] text-[#4a5568] px-3 py-1.5 rounded-lg font-bold transition-colors">+ Add Item</button>
              </div>
              
              <div className="space-y-3">
                {form.items.map((item, idx) => (
                  <div key={item.id} className="flex gap-3 items-start bg-[#f8fafc] p-3 rounded-xl border border-[#e8edf3]">
                    <div className="w-6 h-6 rounded-md bg-[#0a1628] text-[#d4af5a] flex items-center justify-center text-xs font-bold mt-1 shrink-0">{idx + 1}</div>
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <select
                        value={item.type}
                        onChange={(e) => updateItem(item.id, "type", e.target.value)}
                        className="w-full bg-white border border-[#e8edf3] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#b8963e]"
                      >
                        {ITEM_TYPES.map((t) => (
                          <option key={t.label} value={t.label}>{t.label} (₹{t.pricePerUnit})</option>
                        ))}
                      </select>
                      <div className="flex items-center gap-2">
                         <span className="text-xs text-[#9aa5b4] font-semibold">Qty:</span>
                         <input type="number" min="1" value={item.quantity} onChange={(e) => updateItem(item.id, "quantity", parseInt(e.target.value) || 1)} className="w-16 bg-white border border-[#e8edf3] rounded-lg px-2 py-2 text-sm outline-none focus:border-[#b8963e] text-center" />
                      </div>
                      <input type="text" placeholder="Special Instructions..." value={item.instructions} onChange={(e) => updateItem(item.id, "instructions", e.target.value)} className="w-full bg-white border border-[#e8edf3] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#b8963e] sm:col-span-2" />
                    </div>
                    {form.items.length > 1 && (
                      <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-600 p-2 shrink-0">✕</button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-[#e8edf3] bg-[#f8fafc] flex justify-between items-center">
          <div>
            <p className="text-xs text-[#9aa5b4] font-bold uppercase tracking-wider">Estimated Total</p>
            <p className="text-2xl font-black text-[#0a1628]">₹{form.express ? Math.floor(computeEstimate(form.items).price * 1.5) : computeEstimate(form.items).price}</p>
          </div>
          <button onClick={handleSubmit} disabled={loading} className="bg-gradient-to-r from-[#0a1628] to-[#1e3a5f] hover:from-[#b8963e] hover:to-[#d4af5a] text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-all disabled:opacity-50">
            {loading ? "Generating..." : "Generate Bill & Email"}
          </button>
        </div>
      </div>
    </div>
  );
}
