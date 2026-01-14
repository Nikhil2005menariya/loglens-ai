const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");

const signToken = (user) =>
  jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

/**
 * POST /api/auth/signup
 */
exports.signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        error: { message: "All fields required", code: "INVALID_INPUT" }
      });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({
        error: { message: "Email already registered", code: "EMAIL_EXISTS" }
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.create({
      username,
      email,
      passwordHash
    });

    const token = signToken(user);

    res.status(201).json({
      data: {
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/login
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        error: { message: "Invalid credentials", code: "AUTH_FAILED" }
      });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({
        error: { message: "Invalid credentials", code: "AUTH_FAILED" }
      });
    }

    const token = signToken(user);

    res.json({
      data: {
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/auth/me
 */
exports.me = async (req, res) => {
  res.json({
    data: {
      id: req.user.id,
      email: req.user.email
    }
  });
};
