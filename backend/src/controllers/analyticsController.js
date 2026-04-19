const response = require('../utils/response');
const analyticsQueries = require('../queries/analyticsQueries');
const hotelQueries = require('../queries/hotelQueries');
const {
  getTrendsFallback,
  getSeasonalFallback,
  getEntryPointsFallback,
} = require('../data/trendsFallback');

async function footfallRealtime(req, res, next) {
  try {
    const footfall = await analyticsQueries.getRealtimeFootfallAll();
    return response.ok(res, { footfall });
  } catch (e) {
    return next(e);
  }
}

async function footfallDaily(req, res, next) {
  try {
    const monumentId = req.query.monumentId || 'hawa-mahal';
    const daily = await analyticsQueries.getDailyFootfallForMonument(monumentId);
    return response.ok(res, { daily });
  } catch (e) {
    return next(e);
  }
}

async function hotelDistrictSummary(req, res, next) {
  try {
    const district = req.params.district || 'Jaipur';
    let summary = await hotelQueries.getDistrictSummary(district);
    if (!summary) {
      const hotels = await hotelQueries.listHotelsByDistrict(district);
      if (!hotels.length) {
        return response.notFound(res, 'No hotel summary for district');
      }
      const totalHotels = hotels.length;
      const totalRooms = hotels.reduce((s, h) => s + h.totalRooms, 0);
      const averageRating =
        Math.round((hotels.reduce((s, h) => s + h.rating, 0) / totalHotels) * 10) / 10;
      const averageOccupancy =
        Math.round((hotels.reduce((s, h) => s + h.occupancyRate, 0) / totalHotels) * 10) / 10;
      summary = {
        district,
        totalHotels,
        totalRooms,
        averageRating,
        averageOccupancy,
        priceDistribution: {
          budget: hotels.filter((h) => h.priceRange === 'budget').length,
          'mid-range': hotels.filter((h) => h.priceRange === 'mid-range').length,
          luxury: hotels.filter((h) => h.priceRange === 'luxury').length,
          premium: hotels.filter((h) => h.priceRange === 'premium').length,
        },
      };
    }
    return response.ok(res, { summary });
  } catch (e) {
    return next(e);
  }
}

async function hotelHighDemand(req, res, next) {
  try {
    const district = req.query.district || 'Jaipur';
    const threshold = Number(req.query.threshold || 80);
    const hotels = await hotelQueries.listHighDemandHotels(district, threshold);
    return response.ok(res, { hotels });
  } catch (e) {
    return next(e);
  }
}

async function hotelUnderutilized(req, res, next) {
  try {
    const district = req.query.district || 'Jaipur';
    const threshold = Number(req.query.threshold || 60);
    const hotels = await hotelQueries.listUnderutilizedHotels(district, threshold);
    return response.ok(res, { hotels });
  } catch (e) {
    return next(e);
  }
}

async function trends(req, res, next) {
  try {
    const year = Number(req.query.year || new Date().getFullYear());
    let trendsData = await analyticsQueries.getTourismTrendsBundle(year);
    if (!trendsData) {
      trendsData = getTrendsFallback(year);
    }
    return response.ok(res, { trends: trendsData });
  } catch (e) {
    return next(e);
  }
}

async function seasonal(req, res, next) {
  try {
    let seasonal = await analyticsQueries.getSeasonalAnalysisAll();
    if (!seasonal.length) {
      seasonal = getSeasonalFallback();
    }
    return response.ok(res, { seasonal });
  } catch (e) {
    return next(e);
  }
}

async function entryPoints(req, res, next) {
  try {
    let points = await analyticsQueries.getTouristEntryPointsAll();
    if (!points.length) {
      points = getEntryPointsFallback();
    }
    return response.ok(res, { entryPoints: points });
  } catch (e) {
    return next(e);
  }
}

module.exports = {
  footfallRealtime,
  footfallDaily,
  hotelDistrictSummary,
  hotelHighDemand,
  hotelUnderutilized,
  trends,
  seasonal,
  entryPoints,
};
