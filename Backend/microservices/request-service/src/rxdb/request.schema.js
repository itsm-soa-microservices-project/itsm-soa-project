module.exports = {
  title: "request schema",
  version: 0,
  description: "Schema for service requests",
  type: "object",
  properties: {
    id: { type: "string" },
    title: { type: "string" },
    description: { type: "string" },
    category: { type: "string" },
    priority: { type: "string" },
    status: { type: "string" },
    userId: { type: "string" },
    assigneeId: { type: "string" },
    createdAt: { type: "string" },
    updatedAt: { type: "string" }
  },
  required: ["id", "title", "description", "status", "userId", "createdAt", "updatedAt"],
  indexes: ["status", "userId"]
};
