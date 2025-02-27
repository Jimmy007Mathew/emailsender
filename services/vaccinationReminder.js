const Child = require('../models/Child');
const User = require('../models/User');
const sendEmail = require('../utils/emailSender');

const checkVaccinationsAndSendReminders = async () => {
    const today = new Date();
    const oneWeekLater = new Date(today);
    oneWeekLater.setDate(today.getDate() + 7);

    try {
        const children = await Child.find().populate('parent');

        for (const child of children) {
            // Filter pending vaccinations that are due before today
            const pendingVaccinations = child.vaccinations.filter(
                (vaccination) =>
                    vaccination.status === 'Pending' &&
                    new Date(vaccination.scheduledDate) < today
            );

            // Filter upcoming vaccinations within the next week
            const upcomingVaccinations = child.vaccinations.filter(
                (vaccination) =>
                    vaccination.status === 'Pending' &&
                    new Date(vaccination.scheduledDate) > today &&
                    new Date(vaccination.scheduledDate) <= oneWeekLater
            );

            // Only send an email if there are pending or upcoming vaccinations
            if (pendingVaccinations.length > 0 || upcomingVaccinations.length > 0) {
                let emailText = `Dear Parent,\n\nThis is a reminder for your child ${child.name}:\n`;

                // Add pending vaccinations to the email
                if (pendingVaccinations.length > 0) {
                    emailText += `\nPending Vaccinations (Overdue):\n`;
                    pendingVaccinations.forEach((vaccination) => {
                        emailText += `- ${vaccination.name} (Was due on ${new Date(vaccination.scheduledDate).toDateString()})\n`;
                    });
                }

                // Add upcoming vaccinations to the email
                if (upcomingVaccinations.length > 0) {
                    emailText += `\nUpcoming Vaccinations (within the next week):\n`;
                    upcomingVaccinations.forEach((vaccination) => {
                        emailText += `- ${vaccination.name} (Scheduled on ${new Date(vaccination.scheduledDate).toDateString()})\n`;
                    });
                }

                emailText += `\nPlease ensure your child receives these vaccinations on time.\n\nBest regards,\nYour Health Center`;

                // Send the email
                await sendEmail(child.parent.email, "Vaccination Reminder", emailText);
            }
        }
    } catch (error) {
        console.error("Error checking vaccinations and sending reminders:", error);
    }
};

module.exports = checkVaccinationsAndSendReminders;
