const requestSchema = {
  title: "request schema",
  version: 0,
  primaryKey: "id",
  type: "object",

  properties: {
    id: {
      type: "string",
      maxLength: 100
    },

    title: {
      type: "string"
    },

    description: {
      type: "string"
    },

    status: {
      type: "string",
      default: "OPEN"
    },

    userId: {
      type: "string"
    },

    createdAt: {
      type: "string"
    }
  },

  required: [
    "id",
    "title"
  ]
};

module.exports = requestSchema;
