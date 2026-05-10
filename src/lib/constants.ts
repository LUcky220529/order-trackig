export const ITEM_TYPES = [
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

export function computeEstimate(items: { type: string; quantity: number }[]) {
  if (!items.length) return { price: 0, hours: 0 };
  
  let totalPrice = 0;
  let maxHours = 0;

  items.forEach((item) => {
    const def = ITEM_TYPES.find((t) => t.label === item.type) || ITEM_TYPES[0];
    totalPrice += def.pricePerUnit * item.quantity;
    if (def.baseHours > maxHours) maxHours = def.baseHours;
  });

  return { price: totalPrice, hours: maxHours };
}

export function getDeliveryDate(pickupDate: string, pickupTime: string, hours: number) {
  if (!pickupDate || !pickupTime) return null;
  const d = new Date(`${pickupDate}T${pickupTime}`);
  d.setHours(d.getHours() + hours);
  return d;
}

export function formatDate(d: Date) {
  return d.toLocaleString("en-US", {
    weekday: "long", month: "long", day: "numeric",
    hour: "numeric", minute: "2-digit", hour12: true,
  });
}
