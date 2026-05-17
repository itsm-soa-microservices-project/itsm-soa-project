const emailService = require("./email.service");

const formatNotification = (topic, payload) => {
  const isRequest = topic === "REQUEST_CREATED";
  const eventType = isRequest ? "request" : "incident";

  const title = payload.title || payload.name || "No title provided";
  const userId = payload.userId || payload.requesterId || payload.requester_id || "unknown-user";
  const priority = payload.priority || payload.severity || "NORMAL";
  const status = payload.status || "UNKNOWN";

  return {
    eventType,
    title,
    userId,
    priority,
    status,
    rawPayload: payload
  };
};

const processEvent = async (topic, payload) => {
  const notification = formatNotification(topic, payload);

  console.log("[Notification Service] Event received:", {
    topic,
    eventType: notification.eventType,
    title: notification.title,
    userId: notification.userId,
    priority: notification.priority,
    status: notification.status
  });

  const message = `Notification generated for ${notification.eventType}: ${notification.title} (user=${notification.userId}, priority=${notification.priority}, status=${notification.status})`;

  await emailService.sendEmailNotification(notification.eventType, notification.rawPayload, message);
};

module.exports = {
  processEvent
};