import User from "../../models/user.model.js";
import sendEmail from "../../utils/nodemailer.js";
import { inngest } from "../client.js";

const newMovieNotification = inngest.createFunction(
  {
    id: 'send-new-show-notification',
    triggers: [{ event: 'app/show.added' }]
  },
  async ({ event }) => {
    const { movieTitle} = event.data;
    const users = await User.find({});

    for (const user of users) {
      await sendEmail({
        to: user.email,
        subject: `New Show Added: ${movieTitle}`,
        body: `
          <div style="font-family: Arial, sans-serif; line-height: 1.5;">
            <h2>Hi ${user.name},</h2>
            <p>A new show has been added: <strong style="color: #F84565;">${movieTitle}</strong></p>
            <p>Book your seats now before they fill up!</p>
            <p>— QuickShow Team</p>
          </div>
        `
      });
    }

    return { message: 'Notifications sent.' };
  }
);

export default newMovieNotification;