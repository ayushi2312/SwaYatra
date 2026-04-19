"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jaipurHotels = void 0;
exports.getDistrictHotelStats = getDistrictHotelStats;
exports.getHotelAvailability = getHotelAvailability;
exports.getUnderutilizedHotels = getUnderutilizedHotels;
exports.getHighDemandHotels = getHighDemandHotels;
exports.jaipurHotels = [
    {
        id: 'hotel-1',
        name: 'Rambagh Palace',
        district: 'Jaipur',
        location: 'Bhawani Singh Road',
        rating: 4.8,
        totalRooms: 78,
        availableRooms: 12,
        priceRange: 'premium',
        category: 'heritage',
        coordinates: { lat: 26.8962, lng: 75.8064 },
        occupancyRate: 84.6,
        verified: true
    },
    {
        id: 'hotel-2',
        name: 'The Oberoi Rajvilas',
        district: 'Jaipur',
        location: 'Goner Road',
        rating: 4.9,
        totalRooms: 71,
        availableRooms: 8,
        priceRange: 'luxury',
        category: 'resort',
        coordinates: { lat: 26.9124, lng: 75.7873 },
        occupancyRate: 88.7,
        verified: true
    },
    {
        id: 'hotel-3',
        name: 'ITC Rajputana',
        district: 'Jaipur',
        location: 'Palace Road',
        rating: 4.6,
        totalRooms: 218,
        availableRooms: 45,
        priceRange: 'luxury',
        category: 'hotel',
        coordinates: { lat: 26.9205, lng: 75.7873 },
        occupancyRate: 79.4,
        verified: true
    },
    {
        id: 'hotel-4',
        name: 'Holiday Inn',
        district: 'Jaipur',
        location: 'Tonk Road',
        rating: 4.3,
        totalRooms: 150,
        availableRooms: 38,
        priceRange: 'mid-range',
        category: 'hotel',
        coordinates: { lat: 26.9124, lng: 75.7873 },
        occupancyRate: 74.7,
        verified: true
    },
    {
        id: 'hotel-5',
        name: 'Hotel Clarks Amer',
        district: 'Jaipur',
        location: 'Jawahar Lal Nehru Marg',
        rating: 4.2,
        totalRooms: 180,
        availableRooms: 52,
        priceRange: 'mid-range',
        category: 'hotel',
        coordinates: { lat: 26.9124, lng: 75.7873 },
        occupancyRate: 71.1,
        verified: true
    },
    {
        id: 'hotel-6',
        name: 'Umaid Bhawan Heritage Hotel',
        district: 'Jaipur',
        location: 'Durgapura',
        rating: 4.5,
        totalRooms: 45,
        availableRooms: 12,
        priceRange: 'mid-range',
        category: 'heritage',
        coordinates: { lat: 26.8500, lng: 75.8000 },
        occupancyRate: 73.3,
        verified: true
    },
    {
        id: 'hotel-7',
        name: 'Treebo Trend',
        district: 'Jaipur',
        location: 'C-Scheme',
        rating: 4.0,
        totalRooms: 60,
        availableRooms: 25,
        priceRange: 'budget',
        category: 'hotel',
        coordinates: { lat: 26.9124, lng: 75.7873 },
        occupancyRate: 58.3,
        verified: true
    },
    {
        id: 'hotel-8',
        name: 'FabHotel Prime',
        district: 'Jaipur',
        location: 'Malviya Nagar',
        rating: 4.1,
        totalRooms: 85,
        availableRooms: 32,
        priceRange: 'budget',
        category: 'hotel',
        coordinates: { lat: 26.9124, lng: 75.7873 },
        occupancyRate: 62.4,
        verified: true
    }
];
function getDistrictHotelStats(district = 'Jaipur') {
    const districtHotels = exports.jaipurHotels.filter(h => h.district === district);
    const totalHotels = districtHotels.length;
    const totalRooms = districtHotels.reduce((sum, h) => sum + h.totalRooms, 0);
    const averageRating = districtHotels.reduce((sum, h) => sum + h.rating, 0) / totalHotels;
    const averageOccupancy = districtHotels.reduce((sum, h) => sum + h.occupancyRate, 0) / totalHotels;
    const priceDistribution = {
        budget: districtHotels.filter(h => h.priceRange === 'budget').length,
        'mid-range': districtHotels.filter(h => h.priceRange === 'mid-range').length,
        luxury: districtHotels.filter(h => h.priceRange === 'luxury').length,
        premium: districtHotels.filter(h => h.priceRange === 'premium').length
    };
    return {
        district,
        totalHotels,
        totalRooms,
        averageRating: Math.round(averageRating * 10) / 10,
        averageOccupancy: Math.round(averageOccupancy * 10) / 10,
        priceDistribution
    };
}
function getHotelAvailability(district) {
    if (district) {
        return exports.jaipurHotels.filter(h => h.district === district);
    }
    return exports.jaipurHotels;
}
function getUnderutilizedHotels(threshold = 60) {
    return exports.jaipurHotels.filter(h => h.occupancyRate < threshold);
}
function getHighDemandHotels(threshold = 80) {
    return exports.jaipurHotels.filter(h => h.occupancyRate > threshold);
}
