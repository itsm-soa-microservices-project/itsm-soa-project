const grpc = require("@grpc/grpc-js");
const { registerUser, login, validateToken } = require("../services/auth.service");

async function Register(call, callback) {
  const { email, password, name } = call.request;

  try {
    const result = await registerUser({ email, password, name });
    callback(null, result);
  } catch (err) {
    callback({ code: err.code === "USER_EXISTS" ? grpc.status.ALREADY_EXISTS : grpc.status.INTERNAL, message: err.message });
  }
}

async function Login(call, callback) {
  const { email, password } = call.request;

  try {
    const result = await login({ email, password });
    callback(null, result);
  } catch (err) {
    callback({ code: err.code === "INVALID_CREDENTIALS" ? grpc.status.INVALID_ARGUMENT : grpc.status.INTERNAL, message: err.message });
  }
}

async function VerifyToken(call, callback) {
  const { token } = call.request;

  if (!token) {
    return callback({ code: grpc.status.INVALID_ARGUMENT, message: "Token is required" }, null);
  }

  try {
    const decoded = validateToken(token);
    const user = {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
      roles: decoded.roles || []
    };
    callback(null, { valid: true, user });
  } catch (err) {
    callback(null, { valid: false, user: null });
  }
}

module.exports = { Register, Login, VerifyToken };
