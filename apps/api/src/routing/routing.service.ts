import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface LatLng {
  latitude: number;
  longitude: number;
}

export interface RouteStep {
  instruction: string;
  distance: number; // in meters
  duration: number; // in seconds
}

export interface RouteDetails {
  distance: number; // total distance in meters
  duration: number; // total duration in seconds
  polyline: string; // encoded polyline
  steps: RouteStep[];
}

export interface DistanceMatrixEntry {
  distance: number; // in meters
  duration: number; // in seconds
  status: string; // 'OK', 'NOT_FOUND', etc.
}

export interface DistanceMatrix {
  originAddresses: string[];
  destinationAddresses: string[];
  rows: { elements: DistanceMatrixEntry[] }[];
}


@Injectable()
export class RoutingService {
  private readonly logger = new Logger(RoutingService.name);
  private readonly mockApiKey: string; // Placeholder for external API key

  constructor(private readonly configService: ConfigService) {
    this.mockApiKey = this.configService.get<string>('MOCK_ROUTING_API_KEY') || 'mock-api-key';
  }

  // --- Public methods for route optimization ---

  async getOptimizedRoute(origin: LatLng, destinations: LatLng[]): Promise<RouteDetails> {
    this.logger.log(`Mock: Optimizing route from ${JSON.stringify(origin)} to ${destinations.length} destinations.`);
    // In a real application, this would call an external API like Google Maps Directions API, Mapbox, etc.
    // For MVP, return mock data.
    const totalDistance = destinations.length * 5000; // Mock 5km per destination
    const totalDuration = destinations.length * 900;  // Mock 15 mins per destination

    return {
      distance: totalDistance,
      duration: totalDuration,
      polyline: 'mock_polyline_string_for_route',
      steps: destinations.map((_, i) => ({
        instruction: `Mock instruction to destination ${i + 1}`,
        distance: 5000,
        duration: 900,
      })),
    };
  }

  async calculateDistanceMatrix(origins: LatLng[], destinations: LatLng[]): Promise<DistanceMatrix> {
    this.logger.log(`Mock: Calculating distance matrix for ${origins.length} origins and ${destinations.length} destinations.`);
    // In a real application, this would call an external API
    // For MVP, return mock data.
    const rows = origins.map(origin => ({
      elements: destinations.map(destination => ({
        distance: Math.floor(Math.random() * 10000) + 1000, // 1-11km mock distance
        duration: Math.floor(Math.random() * 1800) + 300,  // 5-35min mock duration
        status: 'OK',
      })),
    }));

    return {
      originAddresses: origins.map(loc => `${loc.latitude},${loc.longitude}`),
      destinationAddresses: destinations.map(loc => `${loc.latitude},${loc.longitude}`),
      rows: rows,
    };
  }

  // Haversine formula (copied from AssignmentService, could be moved to a shared utility)
  // This is used internally for basic proximity in AssignmentService, but not by external APIs
  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of Earth in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}