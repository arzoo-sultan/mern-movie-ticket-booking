import { inngest } from "../client.js";
import Booking from "../../models/booking.model.js";
import sendEmail from "../../utils/nodemailer.js";
import { clerkClient } from "@clerk/express";

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
      });
      // ✅ removed .populate('user') — user is a Clerk string ID

      if (!booking) return;

      // ✅ fetch user from Clerk instead
      const clerkUser = await clerkClient.users.getUser(booking.user);
      const userEmail = clerkUser.emailAddresses[0].emailAddress;
      const userName = clerkUser.firstName || 'there';

      await sendEmail({
        to: userEmail,
        subject: `Payment Confirmation: '${booking.show.movie.title}' booked!`,
        body: `
          <div style="font-family: Arial, sans-serif; line-height: 1.5;">
            <h2>Hi ${userName},</h2>
            <p>Your booking for <strong style="color: #F84565;">${booking.show.movie.title}</strong> is confirmed.</p>
            <p>
              <strong>Date:</strong> ${new Date(booking.show.showDateTime).toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata' })}<br/>
              <strong>Time:</strong> ${new Date(booking.show.showDateTime).toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata' })}
            </p>
            <p>Enjoy the show! 🎬</p>
            <p>Thanks for booking with us!<br/>— QuickShow Team</p>
          </div>
        `
      });
    });
  }
);

export default sendBookingConfirmationEmail;