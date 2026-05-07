import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendNotificationEmail(data: {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  zip: string;
  pickupDate: string;
  pickupTime: string;
  express: boolean;
  items: { type: string; quantity: number; instructions: string }[];
  estimatedPrice: number;
  estimatedDelivery: string;
}) {
  if (!process.env.RESEND_API_KEY || !process.env.ADMIN_EMAIL) return;

  const itemsHtml = data.items
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px 12px;border-bottom:1px solid #e8edf3;">${item.type}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e8edf3;text-align:center;">${item.quantity}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e8edf3;color:#9aa5b4;">${item.instructions || "—"}</td>
        </tr>`
    )
    .join("");

  const html = `
    <div style="font-family:'Inter',sans-serif;max-width:600px;margin:0 auto;background:#f8fafc;padding:20px;">
      <div style="background:#0a1628;border-radius:16px;padding:32px;text-align:center;margin-bottom:20px;">
        <h1 style="color:#d4af5a;margin:0;font-size:24px;">🧺 New Order — Mercury Dry Cleaners</h1>
      </div>
      <div style="background:#fff;border-radius:16px;padding:24px;margin-bottom:16px;border:1px solid #e8edf3;">
        <h2 style="color:#0a1628;margin-top:0;">Customer Details</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Phone:</strong> ${data.phone}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Address:</strong> ${data.address}, ${data.city} — ${data.zip}</p>
        <p><strong>Pickup:</strong> ${data.pickupDate} at ${data.pickupTime}</p>
        ${data.express ? `<p style="color:#b8963e;font-weight:bold;">⚡ Express Service</p>` : ""}
      </div>
      <div style="background:#fff;border-radius:16px;padding:24px;margin-bottom:16px;border:1px solid #e8edf3;">
        <h2 style="color:#0a1628;margin-top:0;">Items Ordered</h2>
        <table style="width:100%;border-collapse:collapse;">
          <thead>
            <tr style="background:#f8fafc;">
              <th style="padding:8px 12px;text-align:left;font-size:12px;color:#9aa5b4;text-transform:uppercase;">Item</th>
              <th style="padding:8px 12px;text-align:center;font-size:12px;color:#9aa5b4;text-transform:uppercase;">Qty</th>
              <th style="padding:8px 12px;text-align:left;font-size:12px;color:#9aa5b4;text-transform:uppercase;">Notes</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
        </table>
      </div>
      <div style="background:#0a1628;border-radius:16px;padding:24px;color:#fff;display:flex;justify-content:space-between;">
        <div>
          <p style="color:#9aa5b4;margin:0;font-size:12px;">ESTIMATED TOTAL</p>
          <p style="color:#d4af5a;font-size:28px;font-weight:900;margin:4px 0;">₹${data.estimatedPrice}</p>
        </div>
        <div style="text-align:right;">
          <p style="color:#9aa5b4;margin:0;font-size:12px;">EXPECTED DELIVERY</p>
          <p style="color:#fff;font-size:14px;font-weight:600;margin:4px 0;">${data.estimatedDelivery}</p>
        </div>
      </div>
    </div>
  `;

  await resend.emails.send({
    from: "Mercury Dry Cleaners <onboarding@resend.dev>",
    to: process.env.ADMIN_EMAIL,
    subject: `🧺 New Order from ${data.name} — ₹${data.estimatedPrice}`,
    html,
  });
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    await connectDB();

    const order = await Order.create({
      name: data.name,
      phone: data.phone,
      email: data.email,
      address: data.address,
      city: data.city,
      zip: data.zip,
      pickupDate: data.pickupDate,
      pickupTime: data.pickupTime,
      express: data.express,
      items: data.items,
      estimatedPrice: data.estimatedPrice,
      estimatedDelivery: data.estimatedDelivery,
    });

    console.log(`✅ Order saved! ID: ${order._id} | ${data.name} | ₹${data.estimatedPrice}`);

    // Send email notification (non-blocking)
    sendNotificationEmail(data).catch((e) =>
      console.warn("⚠️ Email not sent (set RESEND_API_KEY + ADMIN_EMAIL to enable):", e.message)
    );

    return NextResponse.json(
      { success: true, message: "Order saved!", orderId: order._id },
      { status: 201 }
    );
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error("❌ MongoDB error:", errMsg);
    return NextResponse.json(
      { success: false, message: `DB Error: ${errMsg}` },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const orders = await Order.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, orders }, { status: 200 });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, message: errMsg }, { status: 500 });
  }
}
