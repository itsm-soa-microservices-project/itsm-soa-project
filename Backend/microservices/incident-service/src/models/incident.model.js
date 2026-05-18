const mongoose = require("mongoose");

const incidentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  status: { type: String, default: "OPEN" },
  priority: { type: String, default: "MEDIUM" },
  reporterId: { type: String, default: "" },
  assigneeId: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

incidentSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

incidentSchema.pre("findOneAndUpdate", function (next) {
  this.set({ updatedAt: Date.now() });
  next();
});

module.exports = mongoose.model("Incident", incidentSchema);
