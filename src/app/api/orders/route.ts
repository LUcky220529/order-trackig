import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import nodemailer from "nodemailer";
import { ITEM_TYPES } from "@/lib/constants";

const transporter = process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD 
  ? nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    })
  : null;

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
  orderId?: string;
}): Promise<{ customerSuccess: boolean; customerError?: string; adminSuccess: boolean; adminError?: string }> {
  if (!transporter) return { customerSuccess: false, customerError: "No Gmail Credentials", adminSuccess: false, adminError: "No Gmail Credentials" };

  const itemsHtml = data.items
    .map((item) => {
      const def = ITEM_TYPES.find((t) => t.label === item.type) || ITEM_TYPES[0];
      const itemTotal = def.pricePerUnit * item.quantity;
      return `<tr>
          <td style="padding:12px;border-bottom:1px solid #e8edf3;">
            <p style="margin:0;font-weight:bold;color:#0a1628;">${item.type}</p>
            ${item.instructions ? `<p style="margin:4px 0 0;font-size:12px;color:#9aa5b4;">Note: ${item.instructions}</p>` : ""}
          </td>
          <td style="padding:12px;border-bottom:1px solid #e8edf3;text-align:center;color:#4a5568;">₹${def.pricePerUnit} × ${item.quantity}</td>
          <td style="padding:12px;border-bottom:1px solid #e8edf3;text-align:right;color:#0a1628;font-weight:bold;">₹${itemTotal}</td>
        </tr>`;
    })
    .join("");

  const subtotal = data.items.reduce((sum, item) => {
    const def = ITEM_TYPES.find((t) => t.label === item.type) || ITEM_TYPES[0];
    return sum + (def.pricePerUnit * item.quantity);
  }, 0);

  const expressHtml = data.express ? `
    <tr>
      <td style="padding:12px;border-bottom:1px solid #e8edf3;">
        <p style="margin:0;font-weight:bold;color:#b8963e;">⚡ Express Service Surcharge</p>
        <p style="margin:4px 0 0;font-size:12px;color:#9aa5b4;">50% extra for faster delivery</p>
      </td>
      <td style="padding:12px;border-bottom:1px solid #e8edf3;text-align:center;color:#4a5568;">—</td>
      <td style="padding:12px;border-bottom:1px solid #e8edf3;text-align:right;color:#b8963e;font-weight:bold;">+₹${Math.floor(subtotal * 0.5)}</td>
    </tr>
  ` : "";

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
              <th style="padding:12px;text-align:left;font-size:12px;color:#9aa5b4;text-transform:uppercase;">Item</th>
              <th style="padding:12px;text-align:center;font-size:12px;color:#9aa5b4;text-transform:uppercase;">Rate & Qty</th>
              <th style="padding:12px;text-align:right;font-size:12px;color:#9aa5b4;text-transform:uppercase;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
            ${expressHtml}
          </tbody>
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
      ${data.orderId ? `
      <div style="text-align:center;margin-top:20px;">
        <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/track/${data.orderId}"
          style="display:inline-block;background:linear-gradient(135deg,#b8963e,#d4af5a);color:#fff;font-weight:bold;padding:14px 32px;border-radius:50px;text-decoration:none;font-size:16px;">
          📦 Track Your Order
        </a>
        <p style="color:#9aa5b4;font-size:12px;margin-top:10px;">Or copy this link: ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/track/${data.orderId}</p>
      </div>` : ""}
    </div>
  `;

  // Send to Customer
  let customerErrorMsg;
  try {
    await transporter.sendMail({
      from: `"Mercury Dry Cleaners" <${process.env.GMAIL_USER}>`,
      to: data.email,
      subject: `🧺 Order Confirmation — ₹${data.estimatedPrice}`,
      html,
    });
  } catch (error: any) {
    console.error("Failed to send customer email:", error);
    customerErrorMsg = error.message;
  }

  // Send to Admin
  let adminErrorMsg;
  if (process.env.ADMIN_EMAIL) {
    try {
      await transporter.sendMail({
        from: `"Mercury Dry Cleaners" <${process.env.GMAIL_USER}>`,
        to: process.env.ADMIN_EMAIL,
        subject: `🧺 New Order from ${data.name} — ₹${data.estimatedPrice}`,
        html,
      });
    } catch (error: any) {
      console.error("Failed to send admin email:", error);
      adminErrorMsg = error.message;
    }
  }

  return {
    customerSuccess: !customerErrorMsg,
    customerError: customerErrorMsg,
    adminSuccess: !adminErrorMsg,
    adminError: adminErrorMsg
  };
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

    // Send email notification before returning response so it doesn't get killed in serverless environments
    let emailStatus = { customerSuccess: false, customerError: "Not attempted" };
    try {
      emailStatus = await sendNotificationEmail({ ...data, orderId: String(order._id) });
    } catch (e: any) {
      console.warn("⚠️ Email not sent (check GMAIL_USER and GMAIL_APP_PASSWORD):", e.message);
      emailStatus.customerError = e.message;
    }

    return NextResponse.json(
      { 
        success: true, 
        message: "Order saved!", 
        orderId: order._id,
        emailStatus 
      },
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
