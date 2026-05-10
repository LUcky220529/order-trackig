"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface OrderItem {
  type: string;
  quantity: number;
  instructions: string;
}

interface Order {
  _id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  pickupDate: string;
  pickupTime: string;
  express: boolean;
  items: OrderItem[];
  estimatedPrice: number;
  estimatedDelivery: string;
  status: string;
  createdAt: string;
}

const STATUSES = [
  { key: "pending",    label: "Order Received",  icon: "📋", desc: "Your order has been placed and is awaiting pickup." },
  { key: "picked_up", label: "Picked Up",        icon: "🚗", desc: "Your garments have been safely picked up." },
  { key: "cleaning",  label: "In Cleaning",      icon: "🧺", desc: "Your garments are being professionally cleaned." },
  { key: "delivered", label: "Delivered",        icon: "✅", desc: "Your garments have been delivered. Thank you!" },
];

export default function TrackOrderPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/orders/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.order) setOrder(data.order);
        else setNotFound(true);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  const currentIdx = order ? STATUSES.findIndex((s) => s.key === order.status) : -1;
  const isCancelled = order?.status === "cancelled";

  return (
    <div className="min-h-screen bg-[#f0f4f8]" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div className="bg-[#0a1628] text-white px-6 py-5 shadow-xl">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#b8963e] to-[#d4af5a] flex items-center justify-center font-black text-lg">M</div>
            <div>
              <p className="font-bold text-lg leading-none">Mercury Dry Cleaners</p>
              <p className="text-[#9aa5b4] text-xs">Order Tracking</p>
            </div>
          </div>
          <a href="/" className="text-sm text-[#d4af5a] hover:underline font-semibold">← Back to Home</a>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">
        {loading && (
          <div className="text-center py-32 text-[#9aa5b4]">
            <div className="text-5xl mb-4 animate-spin">⏳</div>
            <p className="font-semibold text-lg">Loading your order...</p>
          </div>
        )}

        {notFound && !loading && (
          <div className="text-center py-32 text-[#9aa5b4]">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-black text-[#0a1628] mb-2">Order Not Found</h2>
            <p>We couldn&apos;t find an order with this ID. Please double-check the link.</p>
          </div>
        )}

        {order && !loading && (
          <>
            {/* Order ID & Name */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#e8edf3] p-6 mb-6">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <p className="text-xs font-bold text-[#9aa5b4] uppercase tracking-wider mb-1">Customer</p>
                  <p className="text-xl font-black text-[#0a1628]">{order.name}</p>
                  <p className="text-sm text-[#4a5568]">📅 Pickup: {order.pickupDate} at {order.pickupTime}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-[#9aa5b4] uppercase tracking-wider mb-1">Total Bill</p>
                  <p className="text-3xl font-black text-[#b8963e]">₹{order.estimatedPrice}</p>
                  {order.express && <span className="text-xs bg-[#b8963e]/10 text-[#b8963e] border border-[#b8963e]/20 px-2 py-0.5 rounded-full font-bold">⚡ Express</span>}
                </div>
              </div>
            </div>

            {/* Status Timeline */}
            {!isCancelled ? (
              <div className="bg-white rounded-2xl shadow-sm border border-[#e8edf3] p-6 mb-6">
                <h2 className="text-xs font-bold text-[#9aa5b4] uppercase tracking-wider mb-6">Order Progress</h2>
                <div className="relative">
                  {STATUSES.map((s, i) => {
                    const done = i < currentIdx;
                    const active = i === currentIdx;
                    const upcoming = i > currentIdx;
                    return (
                      <div key={s.key} className="flex items-start gap-4 mb-6 last:mb-0">
                        {/* Line connector */}
                        <div className="flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0 transition-all duration-500 ${
                            done    ? "bg-green-500 shadow-lg shadow-green-200" :
                            active  ? "bg-[#0a1628] shadow-lg shadow-[#0a1628]/20 ring-4 ring-[#d4af5a]/30" :
                                      "bg-[#f0f4f8] grayscale opacity-50"
                          }`}>
                            {s.icon}
                          </div>
                          {i < STATUSES.length - 1 && (
                            <div className={`w-0.5 h-8 mt-1 transition-all duration-500 ${done ? "bg-green-400" : "bg-[#e8edf3]"}`} />
                          )}
                        </div>
                        <div className={`pt-1.5 ${upcoming ? "opacity-40" : ""}`}>
                          <p className={`font-bold text-sm ${active ? "text-[#0a1628]" : done ? "text-green-600" : "text-[#9aa5b4]"}`}>{s.label}</p>
                          {(active || done) && <p className="text-xs text-[#4a5568] mt-0.5">{s.desc}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-100 rounded-2xl p-6 mb-6 text-center">
                <div className="text-4xl mb-2">❌</div>
                <p className="font-bold text-red-700 text-lg">Order Cancelled</p>
                <p className="text-red-500 text-sm mt-1">This order has been cancelled. Please contact us for any queries.</p>
              </div>
            )}

            {/* Items Breakdown */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#e8edf3] p-6 mb-6">
              <h2 className="text-xs font-bold text-[#9aa5b4] uppercase tracking-wider mb-4">Items in this Order</h2>
              <div className="divide-y divide-[#f0f4f8]">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between py-3">
                    <div>
                      <p className="font-semibold text-[#0a1628] text-sm">{item.type}</p>
                      {item.instructions && <p className="text-xs text-[#9aa5b4] italic mt-0.5">Note: {item.instructions}</p>}
                    </div>
                    <p className="text-sm font-bold text-[#0a1628]">×{item.quantity}</p>
                  </div>
                ))}
              </div>
              {order.estimatedDelivery && (
                <div className="mt-4 pt-4 border-t border-[#f0f4f8]">
                  <p className="text-xs text-[#9aa5b4] uppercase font-bold tracking-wider mb-1">Expected Delivery</p>
                  <p className="text-sm font-semibold text-[#0a1628]">🕐 {order.estimatedDelivery}</p>
                </div>
              )}
            </div>

            {/* Help */}
            <div className="text-center text-[#9aa5b4] text-sm">
              <p>Need help? Call us or reply to your confirmation email.</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
