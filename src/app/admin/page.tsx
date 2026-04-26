"use client";
import { useEffect, useState } from "react";

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
  zip: string;
  pickupDate: string;
  pickupTime: string;
  express: boolean;
  items: OrderItem[];
  estimatedPrice: number;
  estimatedDelivery: string;
  status: string;
  createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  picked_up: "bg-blue-100 text-blue-800 border-blue-200",
  cleaning: "bg-purple-100 text-purple-800 border-purple-200",
  delivered: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "⏳ Pending",
  picked_up: "🚗 Picked Up",
  cleaning: "🧺 Cleaning",
  delivered: "✅ Delivered",
  cancelled: "❌ Cancelled",
};

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Order | null>(null);
  const [filter, setFilter] = useState("all");
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    const res = await fetch("/api/orders");
    const data = await res.json();
    if (data.success) setOrders(data.orders);
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id);
    await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await fetchOrders();
    if (selected?._id === id) setSelected((o) => o ? { ...o, status } : null);
    setUpdating(null);
  };

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    cleaning: orders.filter((o) => o.status === "cleaning").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    revenue: orders.filter((o) => o.status === "delivered").reduce((s, o) => s + o.estimatedPrice, 0),
  };

  return (
    <div className="min-h-screen bg-[#f0f4f8]" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div className="bg-[#0a1628] text-white px-6 py-4 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#b8963e] to-[#d4af5a] flex items-center justify-center font-black text-lg">M</div>
          <div>
            <p className="font-bold text-lg leading-none">Mercury Admin</p>
            <p className="text-[#9aa5b4] text-xs">Order Management Dashboard</p>
          </div>
        </div>
        <button onClick={fetchOrders} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 rounded-xl text-sm font-medium transition-colors">
          🔄 Refresh
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: "Total Orders", value: stats.total, icon: "📦", color: "from-[#0a1628] to-[#1e3a5f]" },
            { label: "Pending", value: stats.pending, icon: "⏳", color: "from-yellow-500 to-yellow-600" },
            { label: "In Cleaning", value: stats.cleaning, icon: "🧺", color: "from-purple-500 to-purple-600" },
            { label: "Delivered", value: stats.delivered, icon: "✅", color: "from-green-500 to-green-600" },
            { label: "Revenue", value: `₹${stats.revenue}`, icon: "💰", color: "from-[#b8963e] to-[#d4af5a]" },
          ].map((s) => (
            <div key={s.label} className={`bg-gradient-to-br ${s.color} rounded-2xl p-5 text-white shadow-lg`}>
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-2xl font-black">{s.value}</div>
              <div className="text-white/70 text-xs font-medium mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Orders Table */}
          <div className="flex-1 bg-white rounded-2xl shadow-sm border border-[#e8edf3] overflow-hidden">
            {/* Filter tabs */}
            <div className="flex gap-1 p-4 border-b border-[#e8edf3] overflow-x-auto">
              {["all", "pending", "picked_up", "cleaning", "delivered", "cancelled"].map((f) => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    filter === f ? "bg-[#0a1628] text-white" : "text-[#4a5568] hover:bg-[#f8fafc]"
                  }`}>
                  {f === "all" ? "All" : STATUS_LABELS[f]}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="p-16 text-center text-[#9aa5b4]">
                <div className="text-4xl mb-3 animate-spin">⏳</div>
                <p>Loading orders...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-16 text-center text-[#9aa5b4]">
                <div className="text-4xl mb-3">📭</div>
                <p className="font-medium">No orders yet</p>
              </div>
            ) : (
              <div className="divide-y divide-[#f0f4f8]">
                {filtered.map((order) => (
                  <button key={order._id} onClick={() => setSelected(order)}
                    className={`w-full text-left px-5 py-4 hover:bg-[#f8fafc] transition-colors ${selected?._id === order._id ? "bg-[#f0f4f8]" : ""}`}>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-bold text-[#0a1628] text-sm truncate">{order.name}</p>
                          {order.express && <span className="text-xs bg-[#b8963e]/10 text-[#b8963e] border border-[#b8963e]/20 px-2 py-0.5 rounded-full font-semibold">⚡ Express</span>}
                        </div>
                        <p className="text-xs text-[#9aa5b4] truncate">{order.address}, {order.city}</p>
                        <p className="text-xs text-[#9aa5b4] mt-0.5">📅 {order.pickupDate} · {order.items.length} item(s)</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-black text-[#b8963e] text-base">₹{order.estimatedPrice}</p>
                        <span className={`text-xs px-2 py-1 rounded-full border font-semibold ${STATUS_COLORS[order.status]}`}>
                          {STATUS_LABELS[order.status]}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Order Detail Panel */}
          <div className="lg:w-96">
            {selected ? (
              <div className="bg-white rounded-2xl shadow-sm border border-[#e8edf3] p-6 sticky top-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-bold text-[#0a1628] text-lg">Order Detail</h2>
                  <button onClick={() => setSelected(null)} className="text-[#9aa5b4] hover:text-[#0a1628] text-xl leading-none">×</button>
                </div>

                {/* Customer */}
                <div className="bg-[#f8fafc] rounded-xl p-4 mb-4">
                  <p className="text-xs font-bold text-[#9aa5b4] uppercase tracking-wider mb-2">Customer</p>
                  <p className="font-bold text-[#0a1628]">{selected.name}</p>
                  <p className="text-sm text-[#4a5568]">📞 {selected.phone}</p>
                  <p className="text-sm text-[#4a5568]">✉️ {selected.email}</p>
                </div>

                {/* Address */}
                <div className="bg-[#f8fafc] rounded-xl p-4 mb-4">
                  <p className="text-xs font-bold text-[#9aa5b4] uppercase tracking-wider mb-2">Pickup Address</p>
                  <p className="text-sm text-[#0a1628]">{selected.address}</p>
                  <p className="text-sm text-[#4a5568]">{selected.city} — {selected.zip}</p>
                  <p className="text-sm text-[#4a5568] mt-1">📅 {selected.pickupDate} at {selected.pickupTime}</p>
                  {selected.express && <p className="text-sm text-[#b8963e] font-semibold mt-1">⚡ Express Service</p>}
                </div>

                {/* Items */}
                <div className="bg-[#f8fafc] rounded-xl p-4 mb-4">
                  <p className="text-xs font-bold text-[#9aa5b4] uppercase tracking-wider mb-2">Items</p>
                  {selected.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm py-1 border-b border-[#e8edf3] last:border-0">
                      <span className="text-[#0a1628]">{item.type} ×{item.quantity}</span>
                      {item.instructions && <span className="text-[#9aa5b4] text-xs italic truncate ml-2">{item.instructions}</span>}
                    </div>
                  ))}
                  <div className="flex justify-between font-bold text-[#0a1628] pt-2 mt-1">
                    <span>Total</span>
                    <span className="text-[#b8963e]">₹{selected.estimatedPrice}</span>
                  </div>
                </div>

                {/* Delivery */}
                <div className="bg-[#f8fafc] rounded-xl p-4 mb-5">
                  <p className="text-xs font-bold text-[#9aa5b4] uppercase tracking-wider mb-1">Expected Delivery</p>
                  <p className="text-sm font-semibold text-[#0a1628]">{selected.estimatedDelivery}</p>
                </div>

                {/* Status update */}
                <div>
                  <p className="text-xs font-bold text-[#9aa5b4] uppercase tracking-wider mb-2">Update Status</p>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(STATUS_LABELS).map(([key, label]) => (
                      <button key={key} onClick={() => updateStatus(selected._id, key)}
                        disabled={selected.status === key || updating === selected._id}
                        className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all duration-200 ${
                          selected.status === key
                            ? STATUS_COLORS[key] + " cursor-default"
                            : "border-[#e8edf3] text-[#4a5568] hover:bg-[#0a1628] hover:text-white hover:border-[#0a1628]"
                        }`}>
                        {updating === selected._id ? "..." : label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-[#e8edf3] p-12 text-center text-[#9aa5b4]">
                <div className="text-5xl mb-3">👈</div>
                <p className="font-medium">Select an order to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
