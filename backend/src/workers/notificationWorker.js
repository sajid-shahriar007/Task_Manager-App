import cron from 'node-cron';
import { Task } from '../models/Task.js';

// Every hour, scan for tasks that have just become overdue and log them.
// This runs in the background and does not block the API.
export function startNotificationWorker() {
    cron.schedule('0 * * * *', async () => {
        try {
            const now = new Date();
            const overdueTasks = await Task.find({
                completed: false,
                dueDate: { $ne: null, $lt: now },
            }).select('title userEmail dueDate priority');

            if (overdueTasks.length === 0) return;

            const byUser = overdueTasks.reduce((acc, t) => {
                acc[t.userEmail] = (acc[t.userEmail] || 0) + 1;
                return acc;
            }, {});

            console.log(
                `[worker] ${overdueTasks.length} overdue task(s) detected:`,
                byUser
            );
        } catch (err) {
            console.error('[worker] Overdue task scan failed:', err);
        }
    });

    console.log('[worker] Notification worker scheduled (hourly)');
}