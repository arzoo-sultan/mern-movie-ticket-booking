import Booking from "../models/booking.model.js";
import Show from "../models/show.model.js";  
import stripe from 'stripe'
// Cleaned up: Expects the already-fetched showData object instead of querying DB again
const checkSeatsAvailability = (showData, selectedSeats) => {
  const occupiedSeats = showData.occupiedSeats;

  // Check if any of the selected seats are already taken
  const isAnySeatTaken = selectedSeats.some(seat => {
    if (occupiedSeats instanceof Map) {
      return occupiedSeats.has(seat);
    }
    return !!occupiedSeats[seat];
  });

  return !isAnySeatTaken;
};

export const createBooking = async (req, res) => {
  try {
    // 1. Fixed: Changed req.auth() to req.auth to prevent middleware type crashes
    const { userId } = req.auth(); 
    const { showId, selectedSeats } = req.body;
       const {origin }=req.headers;
    // 2. Performance Fix: Fetch show data once right at the beginning
    const showData = await Show.findById(showId).populate('movie');
    if (!showData) {
      return res.status(404).json({ success: false, message: "Show not found." });
    }

    // 3. Pass the showData straight into the checker
    const isAvailable = checkSeatsAvailability(showData, selectedSeats);
    if (!isAvailable) {
      return res.status(400).json({ success: false, message: "Selected Seats are not available." });
    }

    // 4. Create the booking record
    const booking = await Booking.create({
      user: userId,
      show: showId,
      amount: showData.showPrice * selectedSeats.length,
      bookedSeats: selectedSeats
    });

    // 5. Fixed Map vs Object Assignment (and swapped .map for .forEach)
    selectedSeats.forEach((seat) => {
      if (showData.occupiedSeats instanceof Map) {
        showData.occupiedSeats.set(seat, userId);
      } else {
        showData.occupiedSeats[seat] = userId;
      }
    });

    showData.markModified('occupiedSeats');
    await showData.save();

    // Stripe Gateway Placeholder...
    const stripeInstance=new stripe(process.env.STRIPE_SECRET_KEY)
    //Creating line items for Stripe
    const line_items=[{
      price_data:{
         currency: "usd",
    product_data: {
        name: showData.movie.title,
    },
    unit_amount: Math.floor(booking.amount * 100)},
      quantity:1
    }]
    //session
    const session=await stripeInstance.checkout.sessions.create(
      {
        success_url:`${origin}/loading/my-bookings`,
        cancel_url:`${origin}/my-bookings`,
        line_items:line_items,
        mode:'payment',
        metadata:{
          bookingId:booking._id.toString()
        },
        expires_at:Math.floor(Date.now()/1000)+30 *60 ,//30 min
        
      }
    )
    booking.paymentLink=session.url

    await booking.save()


    return res.json({ success: true,url:session.url});

  } catch (error) {
    console.error("Error in createBooking:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};
//get occupiedSeats Data
export const getOccupiedSeats=async(req,res)=>{
    try {
         const {showId}=req.params;
         const showData=await Show.findById(showId)
         const occupiedSeats=Object.keys(showData.occupiedSeats)
         res.json({success:true,occupiedSeats})
    } catch (error) {
         return res.status(500).json({ success: false, message: error.message });
    }
}
