import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket, WsResponse, WebSocketServer } from '@nestjs/platform-socket.io';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { OrderService } from '../order/order.service';
import { DeliveryPartnerService } from '../delivery-partner/delivery-partner.service';
import { TenantProvider } from '../common/tenant.module'; // Import TenantProvider
import { Order } from 'db';
import { DeliveryPartnerProfile } from 'db';

@WebSocketGateway({
  cors: {
    origin: '*', // Allow all origins for development, refine in production
  },
})
export class TrackingGateway {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(TrackingGateway.name);

  constructor(
    private readonly orderService: OrderService,
    private readonly deliveryPartnerService: DeliveryPartnerService,
    private readonly tenantProvider: TenantProvider, // Inject TenantProvider
  ) {}

  // Handle client connections
  handleConnection(@ConnectedSocket() client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
    // Extract tenantId from client (e.g., from query params or handshake headers)
    const tenantId = client.handshake.query.tenantId as string;
    if (tenantId) {
      // Join a tenant-specific room
      client.join(`tenant-${tenantId}`);
      this.logger.log(`Client ${client.id} joined tenant-${tenantId} room`);
    } else {
      this.logger.warn(`Client ${client.id} connected without tenantId.`);
    }
  }

  // Handle client disconnections
  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  // Subscribe to order status updates for a specific order
  @SubscribeMessage('subscribeToOrder')
  async subscribeToOrder(@ConnectedSocket() client: Socket, @MessageBody() data: { orderId: string, tenantId: string }) {
    if (!data.orderId || !data.tenantId) {
      client.emit('error', 'orderId and tenantId are required');
      return;
    }

    const { orderId, tenantId } = data;
    // Basic authorization check (ensure client belongs to this tenant and can view this order)
    // For MVP, just join room. Proper auth would be part of JWT/session validation on connect.

    // Join order-specific room for granular updates
    client.join(`order-${tenantId}-${orderId}`);
    this.logger.log(`Client ${client.id} subscribed to order-${tenantId}-${orderId}`);

    // Emit current status immediately
    try {
      // Temporarily set tenant context for order service if needed, or rely on client data
      const order = await this.orderService.findOrderById(orderId); // This needs tenantId from tenantProvider
      client.emit(`orderStatus-${orderId}`, order);
    } catch (error) {
      this.logger.error(`Error fetching order ${orderId}: ${error.message}`);
      client.emit('error', `Could not fetch order ${orderId}`);
    }
  }

  // Method to emit order status update
  emitOrderStatusUpdate(order: Order) {
    this.logger.log(`Emitting status update for order ${order.id} (tenant-${order.tenantId})`);
    // Emit to a general room for the tenant and to the specific order room
    this.server.to(`tenant-${order.tenantId}`).emit('orderUpdate', order);
    this.server.to(`order-${order.tenantId}-${order.id}`).emit(`orderStatus-${order.id}`, order);
  }

  // Method to emit delivery partner location update
  emitDeliveryPartnerLocation(partner: DeliveryPartnerProfile) {
    this.logger.log(`Emitting location update for partner ${partner.id} (tenant-${partner.tenantId})`);
    // Emit to all clients in the tenant room (for map views, admin dashboard)
    this.server.to(`tenant-${partner.tenantId}`).emit('deliveryPartnerLocationUpdate', partner);
    // Optionally, emit to specific orders that this partner is handling
    // (requires knowing which orders the partner is currently assigned to)
  }
}
