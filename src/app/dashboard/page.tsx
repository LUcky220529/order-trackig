"use client";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import OrderForm from "../components/OrderForm";

interface Order {
  _id: string;
  pickupDate: string;
  items: any[];
  estimatedPrice: number;
  status: string;
  createdAt: string;
}

const STATUS_STEPS = ["pending", "picked_up", "cleaning", "delivered"];
const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  picked_up: "Picked Up",
  cleaning: "Cleaning",
  delivered: "Delivered",
  cancelled: "Cancelled"
};

export default function CustomerDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showOrderForm, setShowOrderForm] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchOrders();
    }
  }, [status, router]);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/portal/orders");
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
        if (data.orders.length === 0) {
          setShowOrderForm(true);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a1628]">
        <div className="text-[#d4af5a] text-4xl animate-spin">⏳</div>
      </div>
    );
  }

  const activeOrders = orders.filter(o => o.status !== "delivered" && o.status !== "cancelled");
  const pastOrders = orders.filter(o => o.status === "delivered" || o.status === "cancelled");

  return (
    <div className="min-h-screen relative" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Background Image with Heavy Frosted Overlay */}
      <div className="fixed inset-0 bg-[url('/login-bg.png?v=2')] bg-cover bg-center opacity-40 z-0" />
      <div className="fixed inset-0 bg-[#f8fafc]/80 backdrop-blur-3xl z-0" />

      {/* Header */}
      <div className="relative bg-[#0a1628] text-white overflow-hidden shadow-2xl">
        {/* Subtle abstract gradient instead of stretched image */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-[#b8963e]/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-[#d4af5a]/5 to-transparent rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a1628]" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#b8963e] to-[#d4af5a] flex items-center justify-center font-black text-3xl shadow-[0_0_20px_rgba(212,175,90,0.3)]">M</div>
            <div>
              <p className="font-bold text-3xl leading-none mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>My Dashboard</p>
              <p className="text-[#c0c8d4] text-sm font-medium flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                {session?.user?.email}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button onClick={() => router.push("/")} className="text-[#c0c8d4] hover:text-white text-sm font-medium transition-colors hidden sm:block">
              Return to Website
            </button>
            {!showOrderForm && (
              <button onClick={() => setShowOrderForm(true)} className="glow-pulse bg-gradient-to-r from-[#b8963e] to-[#d4af5a] text-white px-6 py-3 rounded-full text-sm font-bold shadow-lg hover:scale-105 transition-all">
                + New Pickup
              </button>
            )}
            <button onClick={() => signOut()} className="bg-white/10 hover:bg-red-500/20 text-white hover:text-red-300 border border-white/20 hover:border-red-500/50 px-5 py-3 rounded-full text-sm font-medium transition-all duration-300">
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 relative z-10">
        
        {/* Order Form Section */}
        {showOrderForm && (
          <div className="mb-16 fade-in-up">
            <div className="flex items-center justify-between mb-4 max-w-7xl mx-auto px-6">
              <h2 className="text-2xl font-black text-[#0a1628]" style={{ fontFamily: "'Playfair Display', serif" }}>New Booking</h2>
              {orders.length > 0 && (
                <button onClick={() => setShowOrderForm(false)} className="text-[#9aa5b4] hover:text-red-500 text-sm font-bold transition-colors flex items-center gap-1">
                  ✕ Cancel
                </button>
              )}
            </div>
            <OrderForm />
          </div>
        )}

        {/* Active Orders */}
        {!showOrderForm && activeOrders.length === 0 && orders.length > 0 && (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#e8edf3] shadow-xl shimmer-card mb-12 fade-in-up">
            <div className="w-20 h-20 bg-[#f8fafc] rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">✨</span>
            </div>
            <h3 className="text-2xl font-bold text-[#0a1628] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>All caught up!</h3>
            <p className="text-[#4a5568] font-medium max-w-md mx-auto">You have no active orders right now. Ready for your next premium clean?</p>
            <button onClick={() => setShowOrderForm(true)} className="mt-8 bg-[#0a1628] text-white px-8 py-3 rounded-full text-sm font-bold shadow-lg hover:bg-[#1e3a5f] hover:scale-105 transition-all">
              Book a Pickup
            </button>
          </div>
        )}

        {!showOrderForm && activeOrders.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-black text-[#0a1628] mb-8 flex items-center gap-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              <span className="w-8 h-px bg-[#d4af5a]" /> 
              Active Orders
            </h2>
            <div className="grid lg:grid-cols-2 gap-8">
              {activeOrders.map((order, idx) => (
                <div key={order._id} className="tilt-card bg-white rounded-3xl p-8 shadow-xl border border-[#e8edf3] fade-in-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
                    <div>
                      <div className="inline-flex items-center gap-2 bg-[#d4af5a]/10 border border-[#d4af5a]/30 rounded-full px-3 py-1 mb-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#b8963e] animate-pulse" />
                        <span className="text-[#b8963e] text-xs font-bold tracking-wider uppercase">In Progress</span>
                      </div>
                      <p className="font-black text-2xl text-[#0a1628]">Order #{order._id.slice(-6).toUpperCase()}</p>
                      <p className="text-sm text-[#9aa5b4] mt-1">Placed {new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="sm:text-right bg-[#f8fafc] p-4 rounded-2xl border border-[#e8edf3]">
                      <p className="text-xs text-[#9aa5b4] font-bold uppercase tracking-wider mb-1">Estimated Total</p>
                      <p className="text-2xl font-black text-[#b8963e]">₹{order.estimatedPrice}</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="relative mt-10">
                    <div className="overflow-hidden h-3 mb-6 text-xs flex rounded-full bg-[#f0f4f8] shadow-inner">
                      <div style={{ width: `${((STATUS_STEPS.indexOf(order.status) + 1) / STATUS_STEPS.length) * 100}%` }} 
                           className="shadow-[0_0_10px_rgba(212,175,90,0.5)] flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-[#b8963e] to-[#d4af5a] transition-all duration-1000 relative">
                        <div className="absolute top-0 right-0 bottom-0 w-10 bg-gradient-to-r from-transparent to-white/30" />
                      </div>
                    </div>
                    <div className="flex justify-between text-xs font-bold">
                      {STATUS_STEPS.map((step, idx) => {
                        const isCompleted = STATUS_STEPS.indexOf(order.status) >= idx;
                        const isCurrent = STATUS_STEPS.indexOf(order.status) === idx;
                        return (
                          <div key={step} className={`flex flex-col items-center gap-2 ${isCompleted ? "text-[#0a1628]" : "text-[#9aa5b4] hidden sm:flex"}`}>
                            <div className={`w-4 h-4 rounded-full border-2 ${isCurrent ? "border-[#d4af5a] bg-white shadow-[0_0_10px_rgba(212,175,90,0.5)] scale-125" : isCompleted ? "bg-[#d4af5a] border-[#d4af5a]" : "border-[#e8edf3] bg-[#f8fafc]"} transition-all duration-500`} />
                            <span>{STATUS_LABELS[step]}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Order History */}
        {!showOrderForm && pastOrders.length > 0 && (
          <div className="fade-in-up" style={{ animationDelay: "0.2s" }}>
            <h2 className="text-3xl font-black text-[#0a1628] mb-8 flex items-center gap-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              <span className="w-8 h-px bg-[#d4af5a]" /> 
              Order History
            </h2>
            <div className="bg-white rounded-3xl border border-[#e8edf3] shadow-xl overflow-hidden max-w-5xl">
              <div className="divide-y divide-[#e8edf3]">
                {pastOrders.map((order, idx) => (
                  <div key={order._id} className="p-5 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-[#f8fafc] transition-colors group">
                    <div className="mb-4 sm:mb-0">
                      <div className="flex items-center gap-3 mb-1">
                        <p className="font-bold text-lg text-[#0a1628]">Order #{order._id.slice(-6).toUpperCase()}</p>
                        <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${order.status === "delivered" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                          {STATUS_LABELS[order.status]}
                        </span>
                      </div>
                      <p className="text-sm text-[#4a5568]">{new Date(order.createdAt).toLocaleDateString()} · <span className="font-semibold text-[#0a1628]">{order.items.length} items</span></p>
                    </div>
                    <div className="sm:text-right flex items-center sm:block gap-4">
                      <p className="text-xs text-[#9aa5b4] uppercase tracking-wider font-bold mb-1 hidden sm:block">Total Paid</p>
                      <p className="font-black text-xl text-[#0a1628]">₹{order.estimatedPrice}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
