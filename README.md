# 🎬 QuickShow

QuickShow is a modern full-stack Movie Ticket Booking Platform built using the MERN Stack. The application allows users to discover movies, book seats securely, manage bookings, and enjoy a seamless authentication experience with secure online payments.

---

# Features

## User Features

* User Authentication with Clerk
* Browse latest movies
* View movie details
* Watch trailers
* Book movie tickets
* Select seats
* View booking history
* Manage favorite movies
* Secure online payments
* Responsive UI

---

## Admin Features

* Admin authentication
* Add and manage shows
* View all bookings
* Manage movie schedules
* Dashboard for administration

---

# Technologies Used

## Frontend

* React.js
* Vite
* React Router
* Axios
* Tailwind CSS

---

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose

---

## Authentication

* Clerk Authentication

Provides:

* Sign Up
* Sign In
* User Management
* JWT Authentication
* Protected Routes

---

## Database

MongoDB Atlas

Stores:

* Users
* Movies
* Shows
* Bookings
* Favorites

---

## Payment Gateway

Stripe

Implemented features:

* Secure Checkout
* Payment Verification
* Stripe Webhooks
* Booking Confirmation

---

## Background Jobs

Inngest

Used for asynchronous workflows and background event processing, improving scalability and keeping long-running tasks outside the main request lifecycle.

---

## External APIs

### TMDB (The Movie Database)

Movie information is fetched directly from the TMDB API, including:

* Movie posters
* Titles
* Ratings
* Descriptions
* Release dates
* Backdrop images

---

# Project Structure

```text
QuickShow/
│
├── client/
│   ├── components/
│   ├── pages/
│   ├── context/
│   ├── assets/
│   └── App.jsx
│
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── inngest/
│   ├── config/
│   └── app.js
│
└── README.md
```

---

# Main Technologies

* React
* Node.js
* Express
* MongoDB
* Clerk
* Stripe
* Inngest
* TMDB API
* Tailwind CSS
* Vercel

---

# What I Learned

This project provided hands-on experience with modern full-stack web development, including:

* Building RESTful APIs
* Authentication and authorization
* JWT-based protected routes
* MongoDB schema design
* Payment gateway integration
* Stripe webhook implementation
* Background event processing with Inngest
* Third-party API integration
* Environment variable management
* CORS configuration
* Deployment on Vercel
* Debugging production issues
* Full-stack application architecture
* Clean project organization
* Email notifications
* * Analytics dashboard
---

# Future Improvements
* QR code-based tickets
* Real-time seat locking
* AI-powered movie recommendations
* Search and filtering
* Movie reviews and ratings
* Push notifications
* Multi-language support

---

# Acknowledgements

This project was inspired by and developed while following the excellent MERN Stack course by **GreatStack**.
The implementation was further extended with additional features, production-ready integrations, debugging, deployment, and architectural improvements to gain practical, real-world development experience.

---

# License

This project is intended for educational and portfolio purposes.
