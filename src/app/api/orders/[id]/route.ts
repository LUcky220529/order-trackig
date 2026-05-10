import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import nodemailer from "nodemailer";
import mongoose from "mongoose";

const transporter = process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD 
  ? nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    })
  : null;

async function sendStatusUpdateEmail(order: any) {
  if (!transporter || !order.email) return;

  let title = "";
  let message = "";
  
  if (order.status === "picked_up") {
    title = "🚗 Your order has been picked up!";
    message = `Hi ${order.name}, your garments have been safely picked up and are on their way to our cleaning facility.`;
  } else if (order.status === "delivered") {
    title = "✅ Your order has been delivered!";
    message = `Hi ${order.name}, your freshly cleaned garments have been delivered. Thank you for choosing Mercury Dry Cleaners!`;
  } else {
    return; // Don't send emails for other statuses
  }

  const html = `
    <div style="font-family:'Inter',sans-serif;max-width:600px;margin:0 auto;background:#f8fafc;padding:20px;">
      <div style="background:#0a1628;border-radius:16px;padding:32px;text-align:center;margin-bottom:20px;">
        <h1 style="color:#d4af5a;margin:0;font-size:24px;">Mercury Dry Cleaners</h1>
      </div>
      <div style="background:#fff;border-radius:16px;padding:24px;border:1px solid #e8edf3;">
        <h2 style="color:#0a1628;margin-top:0;">${title}</h2>
        <p style="color:#4a5568;font-size:16px;line-height:1.6;">${message}</p>
        <p style="color:#9aa5b4;font-size:14px;margin-top:24px;">If you have any questions, feel free to reply to this email.</p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"Mercury Dry Cleaners" <${process.env.GMAIL_USER}>`,
    to: order.email,
    subject: title,
    html,
  });
}

export async function GET(
  req: NextRequest,
  { params }: any
) {
  try {
    const { id } = await params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
       return NextResponse.json({ success: false, message: "Invalid Order ID format" }, { status: 400 });
    }

    await connectDB();
    const order = await Order.findById(id).lean();
    if (!order) return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: any
) {
  try {
    const { id } = await params;
    const { status } = await req.json();
    await connectDB();
    const updatedOrder = await Order.findByIdAndUpdate(
      id, 
      { status },
      { new: true }
    );

    if (updatedOrder) {
      sendStatusUpdateEmail(updatedOrder).catch((e) => 
        console.warn("⚠️ Customer notification email not sent:", e.message)
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: any
) {
  try {
    const { id } = await params;
    await connectDB();
    await Order.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
