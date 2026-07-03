import { inngest } from "../client.js";
import Show from "../../models/show.model.js";
import User from "../../models/user.model.js";
import sendEmail from "../../utils/nodemailer.js";

const sendReminder = inngest.createFunction(
  {
    id: 'send-show-reminders',
    triggers: [{ cron: '0 */8 * * *' }]
  },
  async ({ step }) => {
    const now = new Date();
    const in8hours = new Date(now.getTime() + 8 * 60 * 60 * 1000);
    const windowStart = new Date(in8hours.getTime() - 10 * 60 * 1000);

    const reminderTasks = await step.run('prepare-reminder-tasks', async () => {
      const shows = await Show.find({
        showDateTime: { $gte: windowStart, $lte: in8hours }
      }).populate('movie');

      const tasks = [];

      for (const show of shows) {
        if (!show.movie || !show.occupiedSeats) continue;

        const userIds = [...new Set(Object.values(show.occupiedSeats))];
        if (userIds.length === 0) continue;

        const users = await User.find({ _id: { $in: userIds } }).select('name email');

        for (const user of users) {
          tasks.push({
            userEmail: user.email,
            userName: user.name,
            movieTitle: show.movie.title,
            showTime: show.showDateTime
          });
        }
      }

      return tasks;
    });

    if (reminderTasks.length === 0) {
      return { sent: 0, message: 'No reminders to send' };
    }

    const results = await step.run('send-all-reminders', async () => {
      return await Promise.allSettled(
        reminderTasks.map(task => sendEmail({
          to: task.userEmail,
          subject: `Reminder: Your movie ${task.movieTitle} starts soon!`,
          body: `
            <div style="font-family: Arial, sans-serif; line-height: 1.5;">
              <h2>Hi ${task.userName},</h2>
              <p>Your movie <strong style="color: #F84565;">${task.movieTitle}</strong> starts soon!</p>
              <p><strong>Time:</strong> ${new Date(task.showTime).toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata' })}</p>
              <p>Enjoy the show! 🎬</p>
              <p>— QuickShow Team</p>
            </div>
          `
        }))
      );
    });

    const sent = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.length - sent;

    return {
      sent,
      failed,
      message: `Sent ${sent} reminder(s), ${failed} failed.`
    };
  }
);

export default sendReminder;