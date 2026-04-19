'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { Booking } from '@/utils/database';
import { isAuthenticated } from '@/utils/auth';
import { apiFetch, ApiError } from '@/lib/api';
import { Calendar, Clock, Users, MapPin, CheckCircle, X, Download, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { downloadBookingTicketPdf } from '@/utils/ticketPdf';

export default function BookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [language, setLanguage] = useState<'en' | 'hi' | 'fr'>('en');

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    (async () => {
      try {
        const data = await apiFetch<{ bookings: Booking[] }>('/api/v1/bookings');
        setBookings(data.bookings || []);
      } catch {
        setBookings([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-saffron/10 via-white to-green/10 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-saffron border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-saffron/10 via-white to-green/10">
      <Header onCityPassClick={() => {}} />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {language === 'hi' ? 'मेरी बुकिंग' : language === 'fr' ? 'Mes Réservations' : 'My Bookings'}
          </h1>
          <p className="text-gray-600">
            {language === 'hi' 
              ? 'आपकी सभी बुकिंग यहाँ देखी जा सकती हैं'
              : language === 'fr'
              ? 'Toutes vos réservations peuvent être consultées ici'
              : 'View all your bookings here'}
          </p>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {language === 'hi' ? 'कोई बुकिंग नहीं मिली' : language === 'fr' ? 'Aucune réservation' : 'No Bookings Found'}
            </h3>
            <p className="text-gray-600 mb-6">
              {language === 'hi' 
                ? 'आपने अभी तक कोई बुकिंग नहीं की है'
                : language === 'fr'
                ? 'Vous n\'avez pas encore fait de réservation'
                : 'You haven\'t made any bookings yet'}
            </p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-gradient-to-r from-saffron to-green text-white rounded-lg font-semibold hover:shadow-lg transition-shadow"
            >
              {language === 'hi' ? 'अभी बुक करें' : language === 'fr' ? 'Réserver maintenant' : 'Book Now'}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-bold text-gray-900">{booking.placeName}</h3>
                      {booking.status === 'confirmed' && booking.paymentStatus === 'completed' ? (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          {language === 'hi' ? 'पुष्ट' : language === 'fr' ? 'Confirmé' : 'Confirmed'}
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
                          {language === 'hi' ? 'लंबित' : language === 'fr' ? 'En attente' : 'Pending'}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mb-4">Booking ID: {booking.id}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-saffron mb-1">₹{booking.amount}</div>
                    <div className="text-xs text-gray-500">
                      {language === 'hi' ? 'कुल राशि' : language === 'fr' ? 'Montant total' : 'Total Amount'}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-5 h-5 text-saffron" />
                    <div>
                      <div className="text-xs text-gray-500">
                        {language === 'hi' ? 'दिनांक' : language === 'fr' ? 'Date' : 'Date'}
                      </div>
                      <div className="font-semibold">{new Date(booking.date).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-5 h-5 text-green" />
                    <div>
                      <div className="text-xs text-gray-500">
                        {language === 'hi' ? 'समय' : language === 'fr' ? 'Heure' : 'Time'}
                      </div>
                      <div className="font-semibold">{booking.time}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="w-5 h-5 text-blue-500" />
                    <div>
                      <div className="text-xs text-gray-500">
                        {language === 'hi' ? 'आगंतुक' : language === 'fr' ? 'Visiteurs' : 'Visitors'}
                      </div>
                      <div className="font-semibold">{booking.visitors}</div>
                    </div>
                  </div>
                </div>

                {booking.qrCode && (
                  <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <QrCode className="w-5 h-5 text-saffron" />
                        <span className="font-semibold text-gray-900">
                          {language === 'hi' ? 'टिकट QR कोड' : language === 'fr' ? 'Code QR du billet' : 'Ticket QR Code'}
                        </span>
                      </div>
                      <button
                        onClick={() => setSelectedBooking(selectedBooking?.id === booking.id ? null : booking)}
                        className="text-sm text-saffron hover:text-green font-medium"
                      >
                        {selectedBooking?.id === booking.id 
                          ? (language === 'hi' ? 'छुपाएं' : language === 'fr' ? 'Masquer' : 'Hide')
                          : (language === 'hi' ? 'दिखाएं' : language === 'fr' ? 'Afficher' : 'Show')
                        }
                      </button>
                    </div>
                    {selectedBooking?.id === booking.id && (
                      <div className="flex justify-center p-4 bg-white rounded-lg">
                        <QRCodeSVG value={booking.qrCode} size={200} />
                      </div>
                    )}
                  </div>
                )}

                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={async () => {
                      try {
                        await downloadBookingTicketPdf(booking);
                      } catch {
                        alert(
                          language === 'hi'
                            ? 'PDF बनाने में समस्या आई'
                            : language === 'fr'
                              ? 'Impossible de générer le PDF'
                              : 'Could not generate PDF ticket'
                        );
                      }
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                  >
                    <Download className="w-4 h-4" />
                    {language === 'hi' ? 'डाउनलोड' : language === 'fr' ? 'Télécharger' : 'Download'}
                  </button>
                  {booking.status === 'confirmed' && (
                    <button
                      onClick={async () => {
                        if (!confirm(language === 'hi' ? 'क्या आप इस बुकिंग को रद्द करना चाहते हैं?' : language === 'fr' ? 'Voulez-vous annuler cette réservation?' : 'Do you want to cancel this booking?')) {
                          return;
                        }
                        try {
                          await apiFetch<{ booking: Booking }>(
                            `/api/v1/bookings/${encodeURIComponent(booking.id)}/cancel`,
                            { method: 'PATCH' }
                          );
                          const data = await apiFetch<{ bookings: Booking[] }>('/api/v1/bookings');
                          setBookings(data.bookings || []);
                          alert(language === 'hi' ? 'बुकिंग रद्द कर दी गई' : language === 'fr' ? 'Réservation annulée' : 'Booking cancelled');
                        } catch (e) {
                          const msg = e instanceof ApiError ? e.message : 'Cancel failed';
                          alert(msg);
                        }
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                    >
                      <X className="w-4 h-4" />
                      {language === 'hi' ? 'रद्द करें' : language === 'fr' ? 'Annuler' : 'Cancel'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

