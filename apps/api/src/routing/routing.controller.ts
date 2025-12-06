import { Controller, Get, Query, Logger, BadRequestException } from '@nestjs/common';
import { RoutingService } from './routing.service';
import { ApiTags, ApiQuery } from '@nestjs/swagger';

interface LatLngDto {
  latitude: number;
  longitude: number;
}

@ApiTags('Routing')
@Controller('routing')
export class RoutingController {
  private readonly logger = new Logger(RoutingController.name);

  constructor(private readonly routingService: RoutingService) {}

  @Get('optimize-route')
  @ApiQuery({ name: 'originLat', type: Number, description: 'Origin Latitude' })
  @ApiQuery({ name: 'originLng', type: Number, description: 'Origin Longitude' })
  @ApiQuery({ name: 'destinations', type: String, isArray: true, description: 'Comma-separated list of Lat,Lng pairs (e.g., "10.1,20.2;11.1,21.2")' })
  async getOptimizedRoute(
    @Query('originLat') originLat: number,
    @Query('originLng') originLng: number,
    @Query('destinations') destinations: string, // "lat,lng;lat,lng"
  ) {
    if (!originLat || !originLng || !destinations) {
      throw new BadRequestException('Origin and at least one destination are required.');
    }

    const origin = { latitude: Number(originLat), longitude: Number(originLng) };
    const dests: LatLngDto[] = destinations.split(';').map(pair => {
      const [lat, lng] = pair.split(',').map(Number);
      if (isNaN(lat) || isNaN(lng)) {
        throw new BadRequestException('Invalid destination format. Use "lat,lng;lat,lng".');
      }
      return { latitude: lat, longitude: lng };
    });

    return this.routingService.getOptimizedRoute(origin, dests);
  }

  @Get('distance-matrix')
  @ApiQuery({ name: 'origins', type: String, isArray: true, description: 'Comma-separated list of Lat,Lng pairs for origins' })
  @ApiQuery({ name: 'destinations', type: String, isArray: true, description: 'Comma-separated list of Lat,Lng pairs for destinations' })
  async getDistanceMatrix(
    @Query('origins') origins: string,
    @Query('destinations') destinations: string,
  ) {
    if (!origins || !destinations) {
      throw new BadRequestException('At least one origin and one destination are required.');
    }

    const parseLatLng = (str: string): LatLngDto[] => {
      return str.split(';').map(pair => {
        const [lat, lng] = pair.split(',').map(Number);
        if (isNaN(lat) || isNaN(lng)) {
          throw new BadRequestException('Invalid LatLng format. Use "lat,lng;lat,lng".');
        }
        return { latitude: lat, longitude: lng };
      });
    };

    const parsedOrigins = parseLatLng(origins);
    const parsedDestinations = parseLatLng(destinations);

    return this.routingService.calculateDistanceMatrix(parsedOrigins, parsedDestinations);
  }
}