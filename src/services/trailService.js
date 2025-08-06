import api from './authService.js';

export const trailService = {
  async createTrail(trailData) {
    const response = await api.post('/trails', trailData);
    return response.data;
  },

  async getAllTrails() {
    const response = await api.get('/trails');
    return response.data;
  },

  async getTrailById(id) {
    const response = await api.get(`/trails/${id}`);
    return response.data;
  },

  async deleteTrail(id) {
    await api.delete(`/trails/${id}`);
  },

  // Convert GeoJSON route to waypoints format for backend
  convertRouteToWaypoints(route) {
    if (!route?.geometry?.coordinates) {
      throw new Error('Invalid route data');
    }

    return route.geometry.coordinates.map((coord, index) => ({
      latitude: coord[1],   // [lng, lat] -> lat
      longitude: coord[0],  // [lng, lat] -> lng
      order: index + 1
    }));
  },

  // Calculate route statistics
  calculateRouteStats(route, distance, ascent, descent, duration) {
    return {
      lengthKm: Number((distance / 1000).toFixed(2)),
      heightKm: Number((ascent / 1000).toFixed(3)), // Convert meters to km
      durationMinutes: Math.round(duration / 60)
    };
  }
};