import { clerkClient } from "@clerk/express"; // Corrected import to query the backend API
import Booking from "../models/booking.model.js";
import Show from "../models/show.model.js";

// Api to check if user is admin
export const isAdmin = async (req, res) => {
  res.json({ success: true, isAdmin: true });
};

// Getting the dashboard data
export const getDashboardData = async (req, res) => {
  try {
    // 1. Run database calls simultaneously to boost performance speeds
    const [bookings, activeShows, totalUser] = await Promise.all([
      Booking.find({ isPaid: true }),
      Show.find({ showDateTime: { $gte: new Date() } }).populate('movie'),
      clerkClient.users.getCount() 
    ]);

    const dashboardData = {
      totalBookings: bookings.length,
      totalRevenue: bookings.reduce((acc, booking) => acc + booking.amount, 0),
      activeShows,
      totalUser
    };

    return res.json({ success: true, dashboardData });
  } catch (error) {
    console.error("Error in getDashboardData:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// API to get all Shows
export const getAllShows = async (req, res) => {
  try {
    // 2. Chained .sort() directly to the database query for error-free execution
    const shows = await Show.find({ showDateTime: { $gte: new Date() } })
      .populate('movie')
      .sort({ showDateTime: 1 });

    return res.json({ success: true, shows });
  } catch (error) {
    console.error("Error in getAllShows:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
// Api to get all bookings
export const getAllBookings = async (req, res) => {
  try {
    // Fixed: Changed path from plural 'shows' to singular 'show' to match the Booking schema
    const bookings = await Booking.find({})
      .populate('user') // Keep this if you have a local MongoDB model named 'User' matching Clerk IDs
      .populate({
        path: "show", // Fixed here
        populate: { path: 'movie' }
      })
      .sort({ createdAt: -1 });
        
    return res.json({ success: true, bookings });
  } catch (error) {
    console.error("Error in getAllBookings:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
}; 