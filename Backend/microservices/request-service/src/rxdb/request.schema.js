module.exports = {
  title: "request schema",
  version: 0,
  description: "Schema for service requests",
  type: "object",

  primaryKey: "id",

  properties: {
    id: { type: "string", maxLength: 100 },
    title: { type: "string" },
    description: { type: "string" },
    category: { type: "string" },
    priority: { type: "string" },
    status: { type: "string" },
    userId: { type: "string" },
    assigneeId: { type: "string" },
    createdAt: { type: "number" },
    updatedAt: { type: "number" }
  },

  required: ["id", "title", "description", "status", "userId", "createdAt", "updatedAt"],

  indexes: ["status", "userId"]
};