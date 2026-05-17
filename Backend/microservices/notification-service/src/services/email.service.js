const sendEmail = async ({ to, subject, body }) => {
  console.log('Sending notification email');
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Body: ${body}`);
  return {
    success: true,
    to,
    subject
  };
};

module.exports = {
  sendEmail
};
