// src/services/trailService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

class TrailService {
  constructor() {
    // Create axios instance with base configuration
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Postavi axios interceptor za auth token - koristi iste ključeve kao authService
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access_token'); // Promjena: access_token umjesto authToken
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Handle 401 responses
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Token is expired or invalid, redirect to login
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Konvertiraj route u waypoints s visinskim podacima
  convertRouteToWaypoints(route) {
    if (!route || !route.geometry || !route.geometry.coordinates) {
      throw new Error('Invalid route data');
    }

    const coordinates = route.geometry.coordinates;
    
    // Provjeri ima li route visinske podatke (3D koordinate)
    const hasElevation = coordinates.length > 0 && 
                        Array.isArray(coordinates[0]) && 
                        coordinates[0].length === 3;

    console.log('Converting route to waypoints:', {
      totalPoints: coordinates.length,
      hasElevation,
      samplePoint: coordinates[0]
    });

    // Ograniči broj waypoints da ne preopteretimo bazu
    const maxWaypoints = 1000;
    const step = Math.max(1, Math.floor(coordinates.length / maxWaypoints));
    
    const waypoints = [];
    
    for (let i = 0; i < coordinates.length; i += step) {
      const coord = coordinates[i];
      
      if (Array.isArray(coord) && coord.length >= 2) {
        const waypoint = {
          longitude: coord[0],
          latitude: coord[1],
          order: waypoints.length + 1
        };
        
        // Dodaj visinu ako je dostupna
        if (hasElevation && coord.length >= 3 && typeof coord[2] === 'number') {
          waypoint.elevation = Math.round(coord[2] * 100) / 100; // Zaokruži na 2 decimale
        }
        
        waypoints.push(waypoint);
      }
    }

    // Uvijek uključi zadnju točku
    const lastCoord = coordinates[coordinates.length - 1];
    if (lastCoord && waypoints[waypoints.length - 1]?.longitude !== lastCoord[0]) {
      const lastWaypoint = {
        longitude: lastCoord[0],
        latitude: lastCoord[1],
        order: waypoints.length + 1
      };
      
      if (hasElevation && lastCoord.length >= 3) {
        lastWaypoint.elevation = Math.round(lastCoord[2] * 100) / 100;
      }
      
      waypoints.push(lastWaypoint);
    }

    console.log('Generated waypoints:', waypoints.length, 'points');
    return waypoints;
  }

  // Stvori novu stazu
  async createTrail(trailData) {
    try {
      console.log('Creating trail with data:', trailData);
      
      const response = await this.api.post('/trails', trailData);
      console.log('Trail created successfully:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('Error creating trail:', error);
      throw error;
    }
  }

  // Dohvati sve staze
  async getAllTrails() {
    try {
      const response = await this.api.get('/trails');
      return response.data;
    } catch (error) {
      console.error('Error fetching trails:', error);
      throw error;
    }
  }

  // Dohvati stazu po ID-u s waypoints
  async getTrailById(id) {
    try {
      const response = await this.api.get(`/trails/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching trail:', error);
      throw error;
    }
  }

  // Dohvati staze korisnika
  async getUserTrails(userId) {
    try {
      const response = await this.api.get(`/trails/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user trails:', error);
      throw error;
    }
  }
  async getMyTrails() {
  try {
    const response = await this.api.get('/trails/my-trails');
    return response.data;
  } catch (error) {
    console.error('Error fetching my trails:', error);
    throw error;
  }
}
  // Obriši stazu
  async deleteTrail(id) {
    try {
      await this.api.delete(`/trails/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting trail:', error);
      throw error;
    }
  }

  // Ažuriraj stazu
  async updateTrail(id, trailData) {
    try {
      const response = await this.api.put(`/trails/${id}`, trailData);
      return response.data;
    } catch (error) {
      console.error('Error updating trail:', error);
      throw error;
    }
  }

  async rateTrail(trailId, rating) {
  try {
    const response = await this.api.post(`/trails/${trailId}/rating`, { rating });
    return response.data;
  } catch (error) {
    console.error('Error rating trail:', error);
    throw error;
  }
}

// Delete your rating for a trail
async deleteRating(trailId) {
  try {
    await this.api.delete(`/trails/${trailId}/rating`);
    return true;
  } catch (error) {
    console.error('Error deleting rating:', error);
    throw error;
  }
}

// Get rating stats for a trail
async getRatingStats(trailId) {
  try {
    const response = await this.api.get(`/trails/${trailId}/rating`);
    return response.data;
  } catch (error) {
    console.error('Error getting rating stats:', error);
    throw error;
  }
}

  // Konvertiraj waypoints natrag u GeoJSON za prikaz na karti
  waypointsToGeoJSON(waypoints) {
    if (!waypoints || !Array.isArray(waypoints)) {
      return null;
    }

    // Sortiraj waypoints po order (ne orderNo)
    const sortedWaypoints = [...waypoints].sort((a, b) => a.order - b.order);
    
    const coordinates = sortedWaypoints.map(wp => {
      const coord = [wp.longitude, wp.latitude];
      
      // Dodaj elevaciju ako postoji
      if (wp.elevation !== undefined && wp.elevation !== null) {
        coord.push(wp.elevation);
      }
      
      return coord;
    });

    return {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: coordinates
      },
      properties: {
        hasElevation: coordinates.length > 0 && coordinates[0].length === 3
      }
    };
  }

  // Izračunaj statistike rute iz waypoints
  calculateRouteStats(waypoints) {
    if (!waypoints || waypoints.length < 2) {
      return { distance: 0, ascent: 0, descent: 0 };
    }

    const sortedWaypoints = [...waypoints].sort((a, b) => a.order - b.order);
    
    let totalDistance = 0;
    let totalAscent = 0;
    let totalDescent = 0;

    for (let i = 1; i < sortedWaypoints.length; i++) {
      const prev = sortedWaypoints[i - 1];
      const curr = sortedWaypoints[i];

      // Izračunaj udaljenost između točaka (Haversine formula)
      const distance = this.calculateDistance(
        prev.latitude, prev.longitude,
        curr.latitude, curr.longitude
      );
      totalDistance += distance;

      // Izračunaj promjenu visine ako je dostupna
      if (prev.elevation !== undefined && curr.elevation !== undefined) {
        const elevationChange = curr.elevation - prev.elevation;
        if (elevationChange > 0) {
          totalAscent += elevationChange;
        } else {
          totalDescent += Math.abs(elevationChange);
        }
      }
    }

    return {
      distance: Math.round(totalDistance * 100) / 100, // km
      ascent: Math.round(totalAscent),                 // m
      descent: Math.round(totalDescent)                // m
    };
  }

  // Haversine formula za izračun udaljenosti
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radijus Zemlje u km
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }
}

export const trailService = new TrailService();