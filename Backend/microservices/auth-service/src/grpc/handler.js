const { registerUser, login } = require("../services/auth.service");

async function Register(call, callback) {
  const { email, password, name } = call.request;

  try {
    const result = await registerUser({ email, password, name });
    callback(null, result);
  } catch (err) {
    callback({ code: err.code === "USER_EXISTS" ? 6 : 13, message: err.message });
  }
}

async function Login(call, callback) {
  const { email, password } = call.request;

  try {
    const result = await login({ email, password });
    callback(null, result);
  } catch (err) {
    callback({ code: err.code === "INVALID_CREDENTIALS" ? 16 : 13, message: err.message });
  }
}

module.exports = { Register, Login };
