# ElectronicsWeb

**ElectronicsWeb** is a dynamic e-commerce website for buying and selling electronics.  
It features user authentication, product browsing, cart management, checkout, and order history.  
The frontend is built with **React + Vite**, and the backend is built with **Node.js + Express**, using **MongoDB Atlas** as the database.  

Check the live website here: [ElectronicsWeb Live](https://electronics-web-cl4o.vercel.app/)

---

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Project](#running-the-project)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- User authentication (Signup/Login) with JWT
- Browse products by category and search
- Add products to cart and wishlist
- Checkout and payment integration
- Order history and order details
- Responsive design for desktop and mobile

---

## Technologies Used

- **Frontend:** React, Vite, Axios  
- **Backend:** Node.js, Express  
- **Database:** MongoDB Atlas  
- **Deployment:** Vercel (frontend), Render (backend)

---

## Project Structure

ElectronicsWeb/
├─ client/
│ ├─ public/
│ └─ src/
│ ├─ api/
│ ├─ components/
│ │ ├─ CartItem.jsx
│ │ └─ OrderSummary.jsx
│ ├─ context/
│ │ └─ CartContext.jsx
│ ├─ hooks/
│ │ └─ useCart.js
│ └─ pages/
│ ├─ Cart.jsx
│ ├─ CategoryPage.jsx
│ ├─ CheckoutPage.jsx
│ ├─ HomePage.jsx
│ ├─ Login.jsx
│ ├─ OrderDetailsPage.jsx
│ ├─ OrderHistoryPage.jsx
│ ├─ OrderSuccess.jsx
│ ├─ PaymentPage.jsx
│ ├─ ProductPage.jsx
│ ├─ Products.jsx
│ ├─ SearchResults.jsx
│ ├─ Signup.jsx
│ └─ Wishlist.jsx
├─ server/
│ ├─ config/
│ │ └─ db.js
│ ├─ middleware/
│ │ └─ authMiddleware.js
│ ├─ models/
│ │ ├─ Order.js
│ │ ├─ Product.js
│ │ └─ User.js
│ ├─ routes/
│ │ ├─ auth.js
│ │ ├─ cartRoutes.js
│ │ ├─ orderRoutes.js
│ │ ├─ products.js
│ │ ├─ userCheckoutRoutes.js
│ │ └─ wishlistRoutes.js
│ ├─ .env
│ ├─ index.js
│ ├─ package.json
│ └─ package-lock.json
└─ .gitignore