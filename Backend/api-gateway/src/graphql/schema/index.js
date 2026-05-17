const authResolver =
  require("./auth.resolver");

const requestResolver =
  require("./request.resolver");

const incidentResolver =
  require("./incident.resolver");

const { merge } = require("lodash");

module.exports = merge(
  {},
  authResolver,
  requestResolver,
  incidentResolver
);