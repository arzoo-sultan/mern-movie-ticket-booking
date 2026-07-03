import { inngest } from "./client.js";
import relaseSeatandDeleteBooking from "./functions/function.reserveSeat.js";
import syncUserCreation from "./functions/function.syncUserCreation.js";
import syncUserDeletion from "./functions/function.syncUserDeletion.js";
import syncUserUpdation from "./functions/function.syncUserUpdation.js";
import sendBookingConfirmationEmail from "./functions/function.sendbookingconfirmatioemail.js";
import sendReminder from "./functions/function.sendreminders.js";
import newMovieNotification from "./functions/function.newMovieNotification.js";
// Export everything together for your express/next handler to use
export { inngest };
export const functions = [
    syncUserCreation,
    syncUserDeletion,
    syncUserUpdation,
    relaseSeatandDeleteBooking,
    sendBookingConfirmationEmail,
    sendReminder,
     newMovieNotification
];