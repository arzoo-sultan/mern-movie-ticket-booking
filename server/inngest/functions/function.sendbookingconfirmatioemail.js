import { inngest } from "../client.js";
import Booking from "../../models/booking.model.js";
import sendEmail from "../../utils/nodemailer.js";

const sendBookingConfirmationEmail = inngest.createFunction(
  {
    id: 'send-booking-confirmation-email',
    triggers: [{ event: 'app/show.booked' }]
  },
  async ({ event, step }) => {
    const { bookingId } = event.data;

    await step.run('fetch-and-send-email', async () => {
      const booking = await Booking.findById(bookingId).populate({
        path: 'show',
        populate: { path: 'movie', model: 'Movie' }
      }).populate('user');

      if (!booking) return;
  await sendEmail({
    to:booking.user.email,
    subject:`Payment Confirmation :'${booking.show.movie.title}' booked!`,
    body:`
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      <h2>Hi ${booking.user.name},</h2>
      <p>Your booking for <strong style="color: #F84565;">${booking.show.movie.title}</strong> is confirmed.</p>
      <p>
        <strong>Date:</strong> ${new Date(booking.show.showDateTime).toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata' })}<br/>
        <strong>Time:</strong> ${new Date(booking.show.showDateTime).toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata' })}
      </p>
      <p>Enjoy the show! 🎬</p>
      <p>Thanks for booking with us!<br/>— QuickShow Team</p>
    </div>
  `
  })
      // TODO: add email sending logic here
      // e.g. send email to booking.user with booking details
    });
  }
);

export default sendBookingConfirmationEmail;