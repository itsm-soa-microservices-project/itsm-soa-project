const emailService = require('./email.service');

const sendNotification = async ({ topic, request }) => {
  if (!request) {
    console.warn('Notification service received empty request event');
    return;
  }

  const subject = `New request created: ${request.title || 'No title'}`;
  const body = `A new request has been created with ID ${request.id}.\n\nDescription: ${request.description || 'N/A'}\nStatus: ${request.status || 'N/A'}`;

  await emailService.sendEmail({
    to: 'support@example.com',
    subject,
    body
  });
};

module.exports = {
  sendNotification
};
