import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
      ref: "User",
    },
    show: {
    type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Show",
    },
    amount: {
      type: Number,
      required: true,
    },
    // Optimized: Explicitly define array item type for cleaner validations
    bookedSeats: {
      type: [String],
      required: true,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paymentLink: {
      type: String,
    },
    // Best Practice: Store payment/transaction ID for order tracking
    transactionId: {
      type: String,
    }
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;