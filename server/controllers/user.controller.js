import { clerkClient } from "@clerk/express";
import Booking from "../models/booking.model.js";
import Movie from "../models/movie.model.js"; // 1. Added missing Movie model import

// Api controller function to get user Bookings
export const getUserBookings = async (req, res) => {
  try {
    const { userId } = req.auth();

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized access." });
    }

    const bookings = await Booking.find({ user: userId })
      .populate({
        path: 'show',
        populate: {
          path: 'movie'
        }
      })
      .sort({ createdAt: -1 });

    return res.json({ success: true, bookings });
  } catch (error) {
    console.error("Error in getUserBookings:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Api controller function to Add/Remove Favourite Movie in Clerk User Metadata
export const updateFavourite = async (req, res) => {
  try {
    const { movieId } = req.body;
    const { userId } = req.auth();

    if (!movieId) {
      return res.status(400).json({ success: false, message: "Movie ID is required." });
    }

    // Fetch the absolute fresh user object from Clerk
    const user = await clerkClient.users.getUser(userId);

    // Safe parsing: Pull existing favourites using your exact frontend spelling
    let currentFavourites = user.privateMetadata.favourites || [];

    let isAdded = false;

    // Toggle logic: Remove if exists, add if it doesn't
    if (currentFavourites.includes(movieId)) {
      currentFavourites = currentFavourites.filter(item => item !== movieId);
    } else {
      currentFavourites.push(movieId);
      isAdded = true;
    }

    // Save directly back to Clerk using the identical spelling key
    await clerkClient.users.updateUserMetadata(userId, {
      privateMetadata: {
        favourites: currentFavourites
      }
    });

    return res.json({ 
      success: true, 
      message: isAdded ? "Added to favourites successfully." : "Removed from favourites successfully.",
      favourites: currentFavourites
    });

  } catch (error) {
    console.error("Error in updateFavourite:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get favourites
export const getFavourites = async (req, res) => {
  try {
    const { userId } = req.auth(); // 2. Extracted userId from authenticated request

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized access." });
    }

    // 3. Fetch user details from Clerk first to read privateMetadata
    const user = await clerkClient.users.getUser(userId);
    const favourites = user.privateMetadata?.favourites;

    // Guard clause: Handle cases where the user has no favorites yet
    if (!favourites || favourites.length === 0) {
        return res.json({ success: true, movies: [] });
    }

    // Fetching movies from database
    const movies = await Movie.find({ _id: { $in: favourites } });
    
    return res.json({ success: true, movies });

  } catch (error) {
    console.error("Error fetching favorite movies:", error);
    return res.status(500).json({ 
        success: false, 
        message: "Internal server error failed to fetch favorite movies." 
    });
  }
};