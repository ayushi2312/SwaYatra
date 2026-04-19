const response = require('../utils/response');
const bookingQueries = require('../queries/bookingQueries');

function generateBookingId() {
  return `SWA-${Date.now()}-${Math.random().toString(36).substring(2, 11).toUpperCase()}`;
}

async function create(req, res, next) {
  try {
    const b = req.body || {};
    const {
      placeId,
      placeName,
      visitDate,
      visitTime,
      visitors,
      contactName,
      email,
      phone,
      amount,
      paymentId,
      qrCode,
    } = b;

    if (!placeId || !placeName || !visitDate || !visitTime || !visitors || !contactName || !email || !phone) {
      return response.badRequest(
        res,
        'Missing booking fields',
        'placeId, placeName, visitDate, visitTime, visitors, contactName, email, phone are required'
      );
    }

    const id = b.id && String(b.id).startsWith('SWA-') ? b.id : generateBookingId();
    const amt = amount != null ? Number(amount) : Number(visitors) * 50;
    const paymentStatus = paymentId ? 'completed' : 'pending';
    const qrCodePayload = qrCode || null;

    await bookingQueries.insertBooking({
      id,
      userId: req.user ? req.user.id : null,
      placeId,
      placeName,
      visitDate,
      visitTime,
      visitors: Number(visitors),
      contactName,
      email,
      phone,
      amount: amt,
      paymentStatus,
      paymentId: paymentId || null,
      qrCodePayload,
      status: 'confirmed',
    });

    const created = await bookingQueries.getBookingById(id);
    return response.created(res, { booking: created }, 'Booking created');
  } catch (e) {
    if (e.code === 'ER_NO_REFERENCED_ROW_2' || e.code === '1452') {
      return response.badRequest(res, 'Invalid place or user reference');
    }
    if (e.code === 'ER_DUP_ENTRY') {
      return response.fail(res, 409, 'Booking id already exists');
    }
    return next(e);
  }
}

async function listMine(req, res, next) {
  try {
    let bookings;
    if (req.user) {
      bookings = await bookingQueries.listBookingsForUserId(req.user.id);
    } else {
      const email = req.query.email;
      if (!email) {
        return response.badRequest(res, 'Pass email query or login with Bearer token');
      }
      bookings = await bookingQueries.listBookingsForEmail(email);
    }
    return response.ok(res, { bookings });
  } catch (e) {
    return next(e);
  }
}

async function getOne(req, res, next) {
  try {
    const booking = await bookingQueries.getBookingById(req.params.id);
    if (!booking) {
      return response.notFound(res, 'Booking not found');
    }
    if (req.user) {
      const sameUser = booking.userId && Number(booking.userId) === Number(req.user.id);
      const sameEmail = booking.email === req.user.email;
      if (!sameUser && !sameEmail) {
        return response.forbidden(res);
      }
    } else {
      const qEmail = req.query.email;
      if (!qEmail || qEmail !== booking.email) {
        return response.unauthorized(res, 'Add ?email= that matches this booking, or log in');
      }
    }
    return response.ok(res, { booking });
  } catch (e) {
    return next(e);
  }
}

async function cancel(req, res, next) {
  try {
    const email = req.user ? null : req.query.email;
    const userId = req.user ? req.user.id : null;
    if (!req.user && !email) {
      return response.badRequest(res, 'Login or pass ?email= for guest cancellation');
    }
    const ok = await bookingQueries.cancelBooking(req.params.id, email, userId);
    if (!ok) {
      return response.notFound(res, 'Booking not found or not allowed');
    }
    const booking = await bookingQueries.getBookingById(req.params.id);
    return response.ok(res, { booking }, 'Cancelled');
  } catch (e) {
    return next(e);
  }
}

module.exports = { create, listMine, getOne, cancel };
