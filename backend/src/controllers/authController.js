const bcrypt = require('bcryptjs');
const response = require('../utils/response');
const authQueries = require('../queries/authQueries');
const { signToken } = require('../middleware/auth');

function publicUser(row) {
  return {
    id: row.id,
    email: row.email,
    name: row.fullName,
    fullName: row.fullName,
    phone: row.phone,
    userType: row.userType,
    address: row.address || undefined,
    aadhaar: row.aadhaar || undefined,
    passportNumber: row.passportNumber || undefined,
    visaNumber: row.visaNumber || undefined,
    country: row.country || undefined,
    nationality: row.nationality || undefined,
  };
}

async function register(req, res, next) {
  try {
    const body = req.body || {};
    const {
      email,
      password,
      fullName,
      phone,
      userType,
      address,
      aadhaar,
      passportNumber,
      visaNumber,
      country,
      nationality,
    } = body;

    if (!email || !password || !fullName || !phone || !userType) {
      return response.badRequest(res, 'Missing required fields', 'email, password, fullName, phone, userType are required');
    }
    if (!['indian', 'foreigner'].includes(userType)) {
      return response.badRequest(res, 'userType must be indian or foreigner');
    }

    const existing = await authQueries.findUserByEmail(email);
    if (existing) {
      return response.fail(res, 409, 'Email already registered');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const id = await authQueries.insertUser({
      email,
      passwordHash,
      fullName,
      phone,
      userType,
      address: userType === 'indian' ? address || null : null,
      aadhaar: userType === 'indian' ? aadhaar || null : null,
      passportNumber: userType === 'foreigner' ? passportNumber || null : null,
      visaNumber: userType === 'foreigner' ? visaNumber || null : null,
      country: userType === 'foreigner' ? country || null : null,
      nationality: userType === 'foreigner' ? nationality || null : null,
    });

    const userRow = await authQueries.findUserById(id);
    const token = signToken({ id, email });
    return response.created(res, { user: publicUser(userRow), token }, 'Registered');
  } catch (e) {
    return next(e);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return response.badRequest(res, 'email and password are required');
    }

    const row = await authQueries.findUserByEmail(email);
    if (!row) {
      return response.unauthorized(res, 'Invalid email or password');
    }

    const okPass = await bcrypt.compare(password, row.passwordHash);
    if (!okPass) {
      return response.unauthorized(res, 'Invalid email or password');
    }

    const token = signToken({ id: row.id, email: row.email });
    return response.ok(res, { user: publicUser(row), token }, 'Logged in');
  } catch (e) {
    return next(e);
  }
}

async function me(req, res, next) {
  try {
    if (!req.user) {
      return response.unauthorized(res);
    }
    const row = await authQueries.findUserById(req.user.id);
    if (!row) {
      return response.notFound(res, 'User not found');
    }
    return response.ok(res, { user: publicUser(row) });
  } catch (e) {
    return next(e);
  }
}

module.exports = { register, login, me, publicUser };
