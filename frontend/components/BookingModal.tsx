'use client';

import { X, Calendar, Clock, Users, MapPin } from 'lucide-react';
import { Monument } from '@/data/monuments';
import { useState } from 'react';
import PaymentGateway from './PaymentGateway';
import { generateBookingId } from '@/utils/database';
import { QRCodeSVG } from 'qrcode.react';
import { apiFetch, ApiError } from '@/lib/api';

interface BookingModalProps {
  place: Monument;
  onClose: () => void;
  language?: 'en' | 'hi' | 'fr';
}

export default function BookingModal({ place, onClose, language = 'en' }: BookingModalProps) {
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    visitors: 1,
    name: '',
    email: '',
    phone: ''
  });
  const [showPayment, setShowPayment] = useState(false);
  const [bookingId, setBookingId] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [qrCode, setQrCode] = useState('');

  const totalAmount = bookingData.visitors * 50;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = generateBookingId();
    setBookingId(id);
    setShowPayment(true);
  };

  const handlePaymentSuccess = async (paymentId: string) => {
    const qrData = JSON.stringify({
      bookingId: bookingId,
      placeId: place.id,
      placeName: place.name,
      date: bookingData.date,
      time: bookingData.time,
      visitors: bookingData.visitors,
      name: bookingData.name,
      email: bookingData.email,
      amount: totalAmount,
      paymentId: paymentId
    });
    setQrCode(qrData);

    try {
      await apiFetch('/api/v1/bookings', {
        method: 'POST',
        body: JSON.stringify({
          id: bookingId,
          placeId: place.id,
          placeName: place.name,
          visitDate: bookingData.date,
          visitTime: bookingData.time,
          visitors: bookingData.visitors,
          contactName: bookingData.name,
          email: bookingData.email,
          phone: bookingData.phone,
          amount: totalAmount,
          paymentId,
          qrCode: qrData,
        }),
      });
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : 'Could not save booking on server';
      alert(msg);
      setShowPayment(false);
      return;
    }

    setShowPayment(false);
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {language === 'hi' ? 'बुकिंग सफल!' : language === 'fr' ? 'Réservation réussie!' : 'Booking Successful!'}
          </h3>
          <p className="text-gray-600 mb-6">
            {language === 'hi' 
              ? 'आपकी बुकिंग की पुष्टि ईमेल पर भेज दी गई है।'
              : language === 'fr'
              ? 'Votre confirmation de réservation a été envoyée par e-mail.'
              : 'Your booking confirmation has been sent to your email.'}
          </p>
          
          {/* QR Code */}
          {qrCode && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-3">
                {language === 'hi' ? 'आपका टिकट QR कोड' : language === 'fr' ? 'Votre code QR de billet' : 'Your Ticket QR Code'}
              </p>
              <div className="flex justify-center mb-3">
                <div className="bg-white p-3 rounded-lg">
                  <QRCodeSVG value={qrCode} size={150} />
                </div>
              </div>
              <p className="text-xs text-gray-500 mb-2">Booking ID: {bookingId}</p>
              <p className="text-xs text-gray-500">
                {language === 'hi' 
                  ? 'इस QR कोड को प्रवेश द्वार पर दिखाएं'
                  : language === 'fr'
                  ? 'Montrez ce code QR à l\'entrée'
                  : 'Show this QR code at the entrance'}
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => {
                onClose();
                window.location.href = '/bookings';
              }}
              className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              {language === 'hi' ? 'मेरी बुकिंग' : language === 'fr' ? 'Mes réservations' : 'My Bookings'}
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-gradient-to-r from-saffron to-green text-white rounded-lg font-semibold hover:shadow-lg transition-shadow"
            >
              {language === 'hi' ? 'ठीक है' : language === 'fr' ? 'D\'accord' : 'OK'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showPayment) {
    return (
      <PaymentGateway
        amount={totalAmount}
        bookingId={bookingId}
        onSuccess={handlePaymentSuccess}
        onCancel={() => setShowPayment(false)}
        language={language}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {language === 'hi' ? 'बुकिंग करें' : language === 'fr' ? 'Réserver' : 'Book Your Visit'}
          </h2>
          <p className="text-gray-600">
            {language === 'hi' ? place.nameHindi : language === 'fr' ? place.nameFrench : place.name}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              {language === 'hi' ? 'दिनांक' : language === 'fr' ? 'Date' : 'Date'}
            </label>
            <input
              type="date"
              value={bookingData.date}
              onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="w-4 h-4 inline mr-1" />
              {language === 'hi' ? 'समय' : language === 'fr' ? 'Heure' : 'Time'}
            </label>
            <select
              value={bookingData.time}
              onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron"
              required
            >
              <option value="">{language === 'hi' ? 'समय चुनें' : language === 'fr' ? 'Sélectionner l\'heure' : 'Select Time'}</option>
              <option value="09:00">9:00 AM</option>
              <option value="10:00">10:00 AM</option>
              <option value="11:00">11:00 AM</option>
              <option value="12:00">12:00 PM</option>
              <option value="14:00">2:00 PM</option>
              <option value="15:00">3:00 PM</option>
              <option value="16:00">4:00 PM</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Users className="w-4 h-4 inline mr-1" />
              {language === 'hi' ? 'आगंतुकों की संख्या' : language === 'fr' ? 'Nombre de visiteurs' : 'Number of Visitors'}
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={bookingData.visitors}
              onChange={(e) => setBookingData({ ...bookingData, visitors: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'hi' ? 'नाम' : language === 'fr' ? 'Nom' : 'Name'}
            </label>
            <input
              type="text"
              value={bookingData.name}
              onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'hi' ? 'ईमेल' : language === 'fr' ? 'E-mail' : 'Email'}
            </label>
            <input
              type="email"
              value={bookingData.email}
              onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'hi' ? 'फोन नंबर' : language === 'fr' ? 'Téléphone' : 'Phone Number'}
            </label>
            <input
              type="tel"
              value={bookingData.phone}
              onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron"
              required
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">
                {language === 'hi' ? 'प्रवेश शुल्क' : language === 'fr' ? 'Frais d\'entrée' : 'Entry Fee'}
              </span>
              <span className="font-semibold">₹{bookingData.visitors * 50}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">
                {language === 'hi' ? 'कुल' : language === 'fr' ? 'Total' : 'Total'}
              </span>
              <span className="font-bold text-lg text-saffron">₹{bookingData.visitors * 50}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-saffron to-green text-white rounded-lg font-semibold hover:shadow-lg transition-shadow disabled:opacity-50"
          >
            {loading 
              ? (language === 'hi' ? 'बुक कर रहे हैं...' : language === 'fr' ? 'Réservation...' : 'Booking...')
              : (language === 'hi' ? 'बुकिंग की पुष्टि करें' : language === 'fr' ? 'Confirmer la réservation' : 'Confirm Booking')
            }
          </button>
        </form>
      </div>
    </div>
  );
}

