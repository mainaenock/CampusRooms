# CampusRooms Documentation

## Overview

**CampusRooms** is a web platform connecting students and landlords for campus accommodation. It features a robust admin dashboard, listing management, user registration, chat, flagging/reporting, and payment integration (e.g., M-Pesa). The project is structured as a full-stack application with a Node.js/Express backend and a React frontend.

---

## Table of Contents

- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [Key Features](#key-features)
- [Admin Dashboard](#admin-dashboard)
- [Flagging System](#flagging-system)
- [Payment Integration](#payment-integration)
- [Affiliate Marketing System](#affiliate-marketing-system)
- [Chat System](#chat-system)
- [Deployment](#deployment)
- [Future Improvements](#future-improvements)
- [Contributing](#contributing)
- [License](#license)

---

## Project Structure

```
CampusRooms/
  backend/         # Node.js/Express backend
    controllers/   # Route controllers
    models/        # Mongoose models
    routes/        # API routes
    middlewares/   # Express middlewares
    mpesa/         # M-Pesa integration
    uploads/       # Uploaded images
    utils/         # Utility functions
    scripts/       # Admin/maintenance scripts
  frontend/
    Campus-rooms/  # React frontend (Vite)
      src/
        components/  # Reusable React components
        pages/       # Page-level components
        config/      # API config
        services/    # Service utilities
        styles/      # CSS/Tailwind
        utils/       # Utility functions
```

---

## Setup & Installation

### Prerequisites

- Node.js (v16+ recommended)
- npm or yarn
- MongoDB (local or cloud)
- (Optional) M-Pesa sandbox credentials

### Backend

1. Navigate to the backend directory:
   ```sh
   cd CampusRooms/backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up your environment variables (see `.env.example` if available).
4. Start the backend server:
   ```sh
   npm start
   ```

### Frontend

1. Navigate to the frontend directory:
   ```sh
   cd CampusRooms/frontend/Campus-rooms
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up your environment variables (see `.env.example` or Vite docs).
4. Start the frontend dev server:
   ```sh
   npm run dev
   ```

---

## Environment Variables

- **Backend**: Configure MongoDB URI, JWT secrets, M-Pesa credentials, etc.
- **Frontend**: Set `VITE_API_URL` in your `.env` file to point to your backend API.

---

## Key Features

- **User Registration & Login**: Students and landlords can register, login, and manage their profiles.
- **Listings Management**: Landlords can create, update, and delete property listings.
- **Flagging System**: Users can flag inappropriate listings; admins can review and take action.
- **Admin Dashboard**: View stats, manage users/listings, toggle payment requirements, and more.
- **Chat System**: Real-time messaging between students and landlords.
- **Payment Integration**: M-Pesa for listing payments (configurable by admin).
- **Affiliate Marketing System**: Marketers can earn commissions for successful listings (see below).
- **Notifications**: WhatsApp notifications for flagged listings.
- **Performance Tools**: Cache management and performance monitoring for admins.

---

## Admin Dashboard

- **Stats Overview**: Total users, landlords, students, listings, paid/featured/flagged listings.
- **Recent Listings/Users**: Quick access to the latest activity.
- **User Management**: View all users, filter by role, and access landlord listings.
- **Flagged Listings**: Review, notify landlords, or delete flagged properties.
- **Featured Listings**: Manage featured properties.
- **Payment Requirement Toggle**: Enable/disable payment for new listings.
- **Performance Tools**: Manage cache and monitor app performance.

---

## Flagging System

- Users can flag listings for review.
- Admins can view flag details, notify landlords, or delete flagged listings.
- Bulk actions: Notify all or delete all flagged listings.

---

## Payment Integration

- M-Pesa integration for listing payments.
- **Listing Fee**: Each new listing costs **200 Ksh** (Kenyan Shillings).
- Admins can toggle whether payment is required for new listings.

---

## Affiliate Marketing System

CampusRooms includes an affiliate marketing system to incentivize user-driven growth:

- **Affiliate Marketer Registration**: Users can enlist as affiliate marketers via a dedicated registration process.
- **Commission Structure**: For every successful property listing made through an affiliate marketer, the marketer receives **50 Ksh** out of the 200 Ksh listing fee. The website retains **150 Ksh**.
- **Tracking**: Each affiliate marketer is assigned a unique code or link. When a landlord uses this code/link to pay for a listing, the marketer's commission is automatically tracked in the database.
- **Admin Tools**: Admins can view marketer performance, total commissions, and manage marketer accounts.
- **Payouts**: Marketers can request payouts or receive automatic payments based on accumulated commissions (implementation details can be expanded as needed).

---

## Chat System

- Real-time chat between students and landlords.
- Admins can view chat history and delete conversations.

---

## Deployment

- **Backend**: Can be deployed to Heroku, Render, or any Node.js-compatible host.
- **Frontend**: Deployable to Vercel, Netlify, or any static hosting provider.
- See `DEPLOYMENT_GUIDE.md` for detailed steps.

---

## Future Improvements

- **Expand Affiliate System**: Add more detailed analytics, referral bonuses, and automated payout options for marketers.
- **Mobile App**: Develop a mobile version using React Native or Flutter for broader accessibility.
- **Advanced Analytics**: Add more detailed analytics for admins and landlords.
- **Automated Moderation**: Use AI or rule-based systems to pre-screen listings and messages for inappropriate content.
- **Multi-language Support**: Support for additional languages to reach a wider audience.

---

## Contributing

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes with clear messages.
4. Open a pull request describing your changes.

---

## License

This project is licensed under the MIT License.

---

**For more details, see the individual `README.md` files in the backend and frontend directories.** 