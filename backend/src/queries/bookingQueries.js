const { getPool } = require('../config/database');

function mapBookingRow(row) {
  const visitDate =
    row.visit_date instanceof Date
      ? row.visit_date.toISOString().slice(0, 10)
      : String(row.visit_date).slice(0, 10);
  const created =
    row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at);

  return {
    id: row.id,
    placeId: row.place_id,
    placeName: row.place_name,
    date: visitDate,
    time: row.visit_time,
    visitors: row.visitors,
    name: row.contact_name,
    email: row.email,
    phone: row.phone,
    amount: Number(row.amount),
    paymentStatus: row.payment_status,
    paymentId: row.payment_id || undefined,
    qrCode: row.qr_code_payload || undefined,
    bookingDate: created,
    status: row.status,
    userId: row.user_id != null ? Number(row.user_id) : null,
  };
}

async function insertBooking(row) {
  const pool = getPool();
  await pool.query(
    `INSERT INTO bookings (
       id, user_id, place_id, place_name, visit_date, visit_time, visitors,
       contact_name, email, phone, amount, payment_status, payment_id, qr_code_payload, status
     ) VALUES (
       :id, :userId, :placeId, :placeName, :visitDate, :visitTime, :visitors,
       :contactName, :email, :phone, :amount, :paymentStatus, :paymentId, :qrCodePayload, :status
     )`,
    row
  );
}

async function listBookingsForEmail(email) {
  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT * FROM bookings WHERE email = :email ORDER BY created_at DESC`,
    { email }
  );
  return rows.map(mapBookingRow);
}

async function listBookingsForUserId(userId) {
  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT * FROM bookings WHERE user_id = :userId ORDER BY created_at DESC`,
    { userId }
  );
  return rows.map(mapBookingRow);
}

async function getBookingById(id) {
  const pool = getPool();
  const [rows] = await pool.query(`SELECT * FROM bookings WHERE id = :id LIMIT 1`, { id });
  return rows[0] ? mapBookingRow(rows[0]) : null;
}

async function cancelBooking(id, email, userId) {
  const pool = getPool();
  if (userId != null) {
    const [result] = await pool.query(
      `UPDATE bookings SET status = 'cancelled' WHERE id = :id AND user_id = :userId`,
      { id, userId }
    );
    return result.affectedRows > 0;
  }
  if (email) {
    const [result] = await pool.query(
      `UPDATE bookings SET status = 'cancelled' WHERE id = :id AND email = :email`,
      { id, email }
    );
    return result.affectedRows > 0;
  }
  return false;
}

module.exports = {
  insertBooking,
  listBookingsForEmail,
  listBookingsForUserId,
  getBookingById,
  cancelBooking,
  mapBookingRow,
};
