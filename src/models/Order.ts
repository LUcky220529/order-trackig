import mongoose, { Schema, model, models } from "mongoose";

const ClothingItemSchema = new Schema({
  type: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  instructions: { type: String, default: "" },
});

const OrderSchema = new Schema(
  {
    // Customer details
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },

    // Pickup address
    address: { type: String, required: true },
    city: { type: String, required: true },
    zip: { type: String, required: true },

    // Pickup schedule
    pickupDate: { type: String, required: true },
    pickupTime: { type: String, required: true },

    // Service options
    express: { type: Boolean, default: false },

    // Clothing items
    items: { type: [ClothingItemSchema], required: true },

    // Computed estimates (stored for records)
    estimatedPrice: { type: Number },
    estimatedDelivery: { type: String },

    // Order status
    status: {
      type: String,
      enum: ["pending", "picked_up", "cleaning", "delivered", "cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

// Prevent model re-compilation in Next.js dev mode
const Order = models.Order || model("Order", OrderSchema);

export default Order;
