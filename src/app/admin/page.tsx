"use client";

import { useState } from "react";

type AdminOrder = {
  id: number;
  customerName: string;
  phone: string;
  address: string;
  district: string;
  note: string | null;
  paymentMethod: string;
  deliveryFee: number;
  subtotal: number;
  total: number;
  status: string;
  createdAt: string;
  items: {
    nameEn: string;
    size: string;
    color: string;
    price: number;
    quantity: number;
  }[];
};

const STATUSES = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  SHIPPED: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loadOrders = async (pw: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/orders", {
        headers: { "x-admin-password": pw },
      });
      if (res.status === 401) {
        setError("Wrong password");
        setAuthed(false);
        return;
      }
      const data = await res.json();
      setOrders(data.orders);
      setAuthed(true);
    } catch {
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId: number, status: string) => {
    await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-password": password },
      body: JSON.stringify({ orderId, status }),
    });
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
  };

  if (!authed) {
    return (
      <div className="mx-auto max-w-sm px-4 py-20">
        <h1 className="mb-4 text-2xl font-bold">🔐 Admin Login</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            loadOrders(password);
          }}
          className="space-y-3"
        >
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Admin password"
            className="w-full rounded-xl border-2 border-gray-300 px-4 py-3 outline-none focus:border-rose-500"
          />
          {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-rose-600 py-3 font-bold text-white hover:bg-rose-700 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">📦 Orders ({orders.length})</h1>
        <button
          onClick={() => loadOrders(password)}
          className="rounded-xl border border-gray-300 bg-white px-4 py-2 font-semibold hover:bg-gray-100"
        >
          🔄 Refresh
        </button>
      </div>

      {orders.length === 0 ? (
        <p className="py-16 text-center text-gray-500">No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-2xl border border-gray-200 bg-white p-5">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold">#{order.id}</span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${STATUS_COLORS[order.status]}`}
                  >
                    {order.status}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleString()}
                  </span>
                </div>
                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order.id, e.target.value)}
                  className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-semibold"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <p>
                    <span className="font-semibold">{order.customerName}</span> ·{" "}
                    <a href={`tel:${order.phone}`} className="font-semibold text-rose-600">
                      {order.phone}
                    </a>
                  </p>
                  <p className="text-gray-600">
                    {order.address} ({order.district})
                  </p>
                  {order.note && <p className="text-gray-500">📝 {order.note}</p>}
                </div>
                <div>
                  {order.items.map((item, idx) => (
                    <p key={idx} className="text-gray-600">
                      {item.nameEn} ({item.size}, {item.color}) × {item.quantity} = ৳
                      {item.price * item.quantity}
                    </p>
                  ))}
                  <p className="mt-1 font-bold">
                    Total: ৳{order.total}{" "}
                    <span className="font-normal text-gray-500">
                      (delivery ৳{order.deliveryFee}) · {order.paymentMethod}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
