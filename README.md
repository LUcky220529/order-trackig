# 🌌 Mercury Dry Cleaners — Premium Care, Spotless Results

A state-of-the-art, full-stack order management and tracking system built for modern dry cleaning businesses. Mercury provides a seamless experience for both customers and administrators, combining a premium aesthetic with robust functionality.

![Mercury Dashboard Preview](https://images.unsplash.com/photo-1545173153-5dd9a9602494?auto=format&fit=crop&q=80&w=1200)

## ✨ Key Features

### 🛍️ Customer Experience
- **Premium Landing Page:** A visually stunning, responsive interface designed to "WOW" customers.
- **Smart Booking System:** Multi-step booking form with real-time price estimation and delivery date calculations.
- **Live Order Tracking:** Public-facing tracking page (`/track/[id]`) with a visual timeline of the order progress.
- **Personalized Dashboard:** Secure Google Login for customers to view their entire order history and active requests.
- **Automated Bills:** Professional itemized receipts sent via email immediately after booking.

### 🛠️ Admin Capabilities
- **Advanced Dashboard:** Real-time statistics on revenue, pending orders, and cleaning progress.
- **Order Management:** Easily update order statuses (Pending → Picked Up → Cleaning → Delivered).
- **Offline Billing System:** Create bills for walk-in customers manually, which automatically triggers tracking emails.
- **Secure Access:** Dedicated admin login portal with protected routes.

---

## 🚀 Tech Stack

- **Framework:** [Next.js 16 (App Router)](https://nextjs.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) with custom animations
- **Database:** [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) with [Mongoose](https://mongoosejs.com/)
- **Authentication:** [NextAuth.js](https://next-auth.js.org/) (Google OAuth & Credentials)
- **Email System:** [Nodemailer](https://nodemailer.com/) with Gmail SMTP Integration
- **Deployment:** [Vercel](https://vercel.com/)

---

## 🛠️ Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/LUcky220529/order-trackig.git
cd mercury-dry-cleaner
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory and add the following:

```env
# Database
MONGODB_URI=your_mongodb_uri

# Email (Gmail App Password)
GMAIL_USER=your_email@gmail.com
GMAIL_APP_PASSWORD=your_app_password
ADMIN_EMAIL=your_notification_email@gmail.com

# Auth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Admin
ADMIN_PASSWORD=your_admin_password
```

### 4. Run Locally
```bash
npm run dev
```

---

## 🛡️ Security
- **Deployment Protection:** Recommended to disable Vercel Authentication in production settings for public tracking links.
- **Middleware:** Robust route protection using Next.js `proxy.ts` to secure admin and dashboard areas.

## 📄 License
This project is for demonstration purposes for Mercury Dry Cleaners.

