const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { createUser, findUserByUsername } = require("../models/user.model");

const JWT_SECRET = process.env.JWT_SECRET || "change-me-super-secret";
const TOKEN_EXPIRATION = "12h";

function sanitizeUserRow(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    email: row.email || row.username,
    name: row.name || row.username,
    roles: [],
  };
}

function createToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });
}

async function registerUser({ email, password, name }) {
  const normalizedEmail = email.trim().toLowerCase();
  const existing = await findUserByUsername(normalizedEmail);

  if (existing) {
    const error = new Error("User already exists");
    error.code = "USER_EXISTS";
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const now = Math.floor(Date.now() / 1000);

  const user = await createUser({
    username: normalizedEmail,
    email: normalizedEmail,
    password: hashedPassword,
    name: name ? name.trim() : normalizedEmail,
    created_at: now,
    updated_at: now,
  });

  const sanitizedUser = sanitizeUserRow(user);
  const token = createToken({ id: sanitizedUser.id, email: sanitizedUser.email, name: sanitizedUser.name });

  return { user: sanitizedUser, token };
}

async function login({ email, password }) {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await findUserByUsername(normalizedEmail);

  if (!user) {
    const error = new Error("Invalid credentials");
    error.code = "INVALID_CREDENTIALS";
    throw error;
  }

  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) {
    const error = new Error("Invalid credentials");
    error.code = "INVALID_CREDENTIALS";
    throw error;
  }

  const sanitizedUser = sanitizeUserRow(user);
  const token = createToken({ id: sanitizedUser.id, email: sanitizedUser.email, name: sanitizedUser.name });

  return { user: sanitizedUser, token };
}

function validateToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    const error = new Error("Invalid token");
    error.code = "INVALID_TOKEN";
    throw error;
  }
}

module.exports = { registerUser, login, validateToken };
