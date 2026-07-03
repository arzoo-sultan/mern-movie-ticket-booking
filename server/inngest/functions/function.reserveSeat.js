import { inngest } from "../client.js";
import Booking from "../../models/booking.model.js";
import Show from "../../models/show.model.js";

const releaseSeatAndDeleteBooking = inngest.createFunction(
  {
    id: 'release-seat-and-delete-booking',
    event: 'app/checkpayment'
  },
  async ({ event, step }) => {
    const tenMinutesLater = new Date(Date.now() + 10 * 60 * 1000);
    await step.sleepUntil('wait-for-10-minutes', tenMinutesLater);

    await step.run('check-payment-status', async () => {
      const bookingId = event.data.bookingId;
      const booking = await Booking.findById(bookingId);

      if (!booking || booking.isPaid) return;

      const show = await Show.findById(booking.show);
      if (!show) return;

      booking.bookedSeats.forEach((seat) => {
        delete show.occupiedSeats[seat];
      });

      show.markModified('occupiedSeats');
      await show.save();
      await Booking.findByIdAndDelete(booking._id);
    });
  }
);

export default releaseSeatAndDeleteBooking;