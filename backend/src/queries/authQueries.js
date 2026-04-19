const { getPool } = require('../config/database');

async function findUserByEmail(email) {
  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT id, email, password_hash AS passwordHash, full_name AS fullName, phone,
            user_type AS userType, address, aadhaar, passport_number AS passportNumber,
            visa_number AS visaNumber, country, nationality, is_active AS isActive
     FROM users WHERE email = :email LIMIT 1`,
    { email }
  );
  return rows[0] || null;
}

async function findUserById(id) {
  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT id, email, full_name AS fullName, phone, user_type AS userType,
            address, aadhaar, passport_number AS passportNumber, visa_number AS visaNumber,
            country, nationality, is_active AS isActive, created_at AS createdAt
     FROM users WHERE id = :id LIMIT 1`,
    { id }
  );
  return rows[0] || null;
}

async function insertUser(payload) {
  const pool = getPool();
  const [result] = await pool.query(
    `INSERT INTO users (
       email, password_hash, full_name, phone, user_type,
       address, aadhaar, passport_number, visa_number, country, nationality
     ) VALUES (
       :email, :passwordHash, :fullName, :phone, :userType,
       :address, :aadhaar, :passportNumber, :visaNumber, :country, :nationality
     )`,
    payload
  );
  return result.insertId;
}

module.exports = { findUserByEmail, findUserById, insertUser };
