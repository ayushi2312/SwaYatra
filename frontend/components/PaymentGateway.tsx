'use client';

import { useState } from 'react';
import { CreditCard, Lock, CheckCircle } from 'lucide-react';

interface PaymentGatewayProps {
  amount: number;
  bookingId: string;
  onSuccess: (paymentId: string) => void;
  onCancel: () => void;
  language?: 'en' | 'hi' | 'fr';
}

export default function PaymentGateway({ amount, bookingId, onSuccess, onCancel, language = 'en' }: PaymentGatewayProps) {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'wallet'>('card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });
  const [upiId, setUpiId] = useState('');
  const [wallet, setWallet] = useState<'paytm' | 'phonepe' | 'gpay'>('paytm');
  const [processing, setProcessing] = useState(false);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      const paymentId = `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      setProcessing(false);
      onSuccess(paymentId);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {language === 'hi' ? 'भुगतान' : language === 'fr' ? 'Paiement' : 'Payment'}
          </h2>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <span className="text-gray-600">
              {language === 'hi' ? 'कुल राशि' : language === 'fr' ? 'Montant total' : 'Total Amount'}
            </span>
            <span className="text-2xl font-bold text-saffron">₹{amount}</span>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {language === 'hi' ? 'भुगतान विधि' : language === 'fr' ? 'Méthode de paiement' : 'Payment Method'}
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setPaymentMethod('card')}
              className={`p-3 rounded-lg border-2 transition-all ${
                paymentMethod === 'card'
                  ? 'border-saffron bg-saffron/10'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <CreditCard className="w-6 h-6 mx-auto mb-1" />
              <span className="text-xs">Card</span>
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod('upi')}
              className={`p-3 rounded-lg border-2 transition-all ${
                paymentMethod === 'upi'
                  ? 'border-saffron bg-saffron/10'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="w-6 h-6 mx-auto mb-1 bg-blue-500 rounded"></div>
              <span className="text-xs">UPI</span>
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod('wallet')}
              className={`p-3 rounded-lg border-2 transition-all ${
                paymentMethod === 'wallet'
                  ? 'border-saffron bg-saffron/10'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="w-6 h-6 mx-auto mb-1 bg-green-500 rounded"></div>
              <span className="text-xs">Wallet</span>
            </button>
          </div>
        </div>

        <form onSubmit={handlePayment} className="space-y-4">
          {paymentMethod === 'card' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'hi' ? 'कार्ड नंबर' : language === 'fr' ? 'Numéro de carte' : 'Card Number'}
                </label>
                <input
                  type="text"
                  value={cardDetails.number}
                  onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value.replace(/\D/g, '').slice(0, 16) })}
                  placeholder="1234 5678 9012 3456"
                  maxLength={16}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'hi' ? 'कार्डधारक का नाम' : language === 'fr' ? 'Nom du titulaire' : 'Cardholder Name'}
                </label>
                <input
                  type="text"
                  value={cardDetails.name}
                  onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                  placeholder="John Doe"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'hi' ? 'समाप्ति' : language === 'fr' ? 'Expiration' : 'Expiry'}
                  </label>
                  <input
                    type="text"
                    value={cardDetails.expiry}
                    onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                    placeholder="MM/YY"
                    maxLength={5}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                  <input
                    type="text"
                    value={cardDetails.cvv}
                    onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value.replace(/\D/g, '').slice(0, 3) })}
                    placeholder="123"
                    maxLength={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron"
                    required
                  />
                </div>
              </div>
            </>
          )}

          {paymentMethod === 'upi' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">UPI ID</label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="yourname@paytm"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron"
                required
              />
            </div>
          )}

          {paymentMethod === 'wallet' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'hi' ? 'वॉलेट चुनें' : language === 'fr' ? 'Choisir le portefeuille' : 'Select Wallet'}
              </label>
              <select
                value={wallet}
                onChange={(e) => setWallet(e.target.value as 'paytm' | 'phonepe' | 'gpay')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron"
              >
                <option value="paytm">Paytm</option>
                <option value="phonepe">PhonePe</option>
                <option value="gpay">Google Pay</option>
              </select>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
            <Lock className="w-4 h-4" />
            <span>
              {language === 'hi' 
                ? 'आपका भुगतान सुरक्षित रूप से संसाधित किया जाएगा'
                : language === 'fr'
                ? 'Votre paiement sera traité en toute sécurité'
                : 'Your payment will be processed securely'}
            </span>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              {language === 'hi' ? 'रद्द करें' : language === 'fr' ? 'Annuler' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={processing}
              className="flex-1 py-3 bg-gradient-to-r from-saffron to-green text-white rounded-lg font-semibold hover:shadow-lg transition-shadow disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {processing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{language === 'hi' ? 'प्रसंस्करण...' : language === 'fr' ? 'Traitement...' : 'Processing...'}</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>{language === 'hi' ? 'भुगतान करें' : language === 'fr' ? 'Payer' : 'Pay Now'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

