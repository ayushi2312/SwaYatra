'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Mail, Lock, User, Eye, EyeOff, Phone, Home, CreditCard, Globe, FileText } from 'lucide-react';
import { apiFetch, ApiError } from '@/lib/api';
import { setUser } from '@/utils/auth';

type UserType = 'indian' | 'foreigner' | null;

export default function SignupPage() {
  const router = useRouter();
  const [userType, setUserType] = useState<UserType>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    aadhaar: '',
    password: '',
    confirmPassword: '',
    // Foreigner fields
    passport: '',
    visaNumber: '',
    country: '',
    nationality: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!userType) {
      setError('Please select whether you are an Indian citizen or Foreigner');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    // Validate Indian-specific fields
    if (userType === 'indian') {
      if (!formData.aadhaar || formData.aadhaar.length !== 12) {
        setError('Please enter a valid 12-digit Aadhaar number');
        return;
      }
      if (!formData.address) {
        setError('Please enter your address');
        return;
      }
    }

    // Validate Foreigner-specific fields
    if (userType === 'foreigner') {
      if (!formData.passport) {
        setError('Please enter your passport number');
        return;
      }
      if (!formData.visaNumber) {
        setError('Please enter your visa number');
        return;
      }
      if (!formData.country || !formData.nationality) {
        setError('Please enter your country and nationality');
        return;
      }
    }

    setLoading(true);

    try {
      const payload = {
        email: formData.email,
        password: formData.password,
        fullName: formData.name,
        phone: formData.phone,
        userType,
        address: userType === 'indian' ? formData.address : undefined,
        aadhaar: userType === 'indian' ? formData.aadhaar : undefined,
        passportNumber: userType === 'foreigner' ? formData.passport : undefined,
        visaNumber: userType === 'foreigner' ? formData.visaNumber : undefined,
        country: userType === 'foreigner' ? formData.country : undefined,
        nationality: userType === 'foreigner' ? formData.nationality : undefined,
      };
      const data = await apiFetch<{ user: Record<string, unknown>; token: string }>(
        '/api/v1/auth/register',
        {
          method: 'POST',
          body: JSON.stringify(payload),
          skipAuth: true,
        }
      );
      const u = data.user;
      setUser({
        id: typeof u.id === 'number' ? u.id : Number(u.id),
        email: String(u.email),
        name: formData.name,
        fullName: u.fullName as string | undefined,
        phone: formData.phone,
        userType: userType as 'indian' | 'foreigner',
        token: data.token,
        loggedIn: true,
      });
      router.push('/');
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Registration failed. Is the backend running?';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-saffron/10 via-white to-green/10 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-xl shadow-2xl p-8">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-saffron to-green rounded-full mb-4">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">SWA-YATRA</h1>
            <p className="text-gray-600">Smart Tourism System for Rajasthan</p>
            <p className="text-sm text-gray-500 mt-2">Create your account</p>
          </div>

          {/* Login/Signup Navigation */}
          <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-lg">
            <Link
              href="/login"
              className="flex-1 py-2 text-center text-sm font-medium text-gray-600 rounded-md hover:text-gray-900 transition-colors"
            >
              Sign In
            </Link>
            <button
              type="button"
              className="flex-1 py-2 text-center text-sm font-medium bg-white text-saffron rounded-md shadow-sm"
              disabled
            >
              Sign Up
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* User Type Selection */}
          {!userType && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                I am a:
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setUserType('indian')}
                  className="p-6 border-2 border-gray-300 rounded-lg hover:border-saffron hover:bg-saffron/5 transition-all text-left"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-gradient-to-br from-saffron to-green rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Indian Citizen</h3>
                      <p className="text-xs text-gray-500">भारतीय नागरिक</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">Register with Aadhaar number and Indian address</p>
                </button>

                <button
                  type="button"
                  onClick={() => setUserType('foreigner')}
                  className="p-6 border-2 border-gray-300 rounded-lg hover:border-saffron hover:bg-saffron/5 transition-all text-left"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <Globe className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Foreign Tourist</h3>
                      <p className="text-xs text-gray-500">विदेशी पर्यटक</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">Register with Passport and Visa details</p>
                </button>
              </div>
            </div>
          )}

          {/* Signup Form */}
          {userType && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Common Fields */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name {userType === 'indian' && '(पूरा नाम)'}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={userType === 'indian' ? 'राम कुमार शर्मा' : 'John Smith'}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder={userType === 'indian' ? '+91 9876543210' : '+1 2345678900'}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Indian-Specific Fields */}
              {userType === 'indian' && (
                <>
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                      Address (पता)
                    </label>
                    <div className="relative">
                      <Home className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="House No., Street, City, State, PIN Code"
                        rows={3}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="aadhaar" className="block text-sm font-medium text-gray-700 mb-2">
                      Aadhaar Number (आधार नंबर)
                    </label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        id="aadhaar"
                        name="aadhaar"
                        type="text"
                        value={formData.aadhaar}
                        onChange={handleChange}
                        placeholder="1234 5678 9012"
                        maxLength={12}
                        pattern="[0-9]{12}"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron focus:border-transparent"
                        required
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Enter 12-digit Aadhaar number (without spaces)</p>
                  </div>
                </>
              )}

              {/* Foreigner-Specific Fields */}
              {userType === 'foreigner' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="nationality" className="block text-sm font-medium text-gray-700 mb-2">
                        Nationality
                      </label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          id="nationality"
                          name="nationality"
                          type="text"
                          value={formData.nationality}
                          onChange={handleChange}
                          placeholder="e.g., American, British"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron focus:border-transparent"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                        Country of Residence
                      </label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          id="country"
                          name="country"
                          type="text"
                          value={formData.country}
                          onChange={handleChange}
                          placeholder="e.g., USA, UK"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="passport" className="block text-sm font-medium text-gray-700 mb-2">
                      Passport Number
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        id="passport"
                        name="passport"
                        type="text"
                        value={formData.passport}
                        onChange={handleChange}
                        placeholder="A12345678"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="visaNumber" className="block text-sm font-medium text-gray-700 mb-2">
                      Visa Number
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        id="visaNumber"
                        name="visaNumber"
                        type="text"
                        value={formData.visaNumber}
                        onChange={handleChange}
                        placeholder="V123456789"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Minimum 6 characters"
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron focus:border-transparent"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter your password"
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron focus:border-transparent"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-start">
                <input
                  type="checkbox"
                  className="mt-1 rounded border-gray-300 text-saffron focus:ring-saffron"
                  required
                />
                <label className="ml-2 text-sm text-gray-600">
                  I agree to the{' '}
                  <Link href="/terms" className="text-saffron hover:text-green">
                    Terms & Conditions
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-saffron hover:text-green">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <div className="flex gap-3">
                {userType && (
                  <button
                    type="button"
                    onClick={() => setUserType(null)}
                    className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Back
                  </button>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 bg-gradient-to-r from-saffron to-green text-white rounded-lg font-semibold hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating account...' : 'Create Account'}
                </button>
              </div>
            </form>
          )}

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="text-saffron hover:text-green font-semibold">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
