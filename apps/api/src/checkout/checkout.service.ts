import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShippingMethod } from 'db';
import { TenantProvider } from '..//common/tenant.module';
import { CartService } from '../cart/cart.service';
import { AddressService } from '../address/address.service';
import { ProductService } from '../product/product.service';
import { TenantConfigService } from '../tenant-config/tenant-config.service';
import { PaymentService } from '../payment/payment.service';
import { OrderService } from '../order/order.service';
import { LoyaltyService } from '../loyalty/loyalty.service'; // Import LoyaltyService

@Injectable()
export class CheckoutService {
  private readonly logger = new Logger(CheckoutService.name);

  constructor(
    @InjectRepository(ShippingMethod)
    private readonly shippingMethodRepository: Repository<ShippingMethod>,
    private readonly tenantProvider: TenantProvider,
    private readonly cartService: CartService,
    private readonly addressService: AddressService,
    private readonly productService: ProductService,
    private readonly tenantConfigService: TenantConfigService,
    private readonly paymentService: PaymentService,
    private readonly orderService: OrderService,
    private readonly loyaltyService: LoyaltyService, // Inject LoyaltyService
  ) {}

  private get tenantId(): string {
    const tenantId = this.tenantProvider.tenantId;
    if (!tenantId) {
      throw new Error('Tenant context missing.');
    }
    return tenantId;
  }

  // Admin methods for managing shipping methods
  async createShippingMethod(methodData: Partial<ShippingMethod>): Promise<ShippingMethod> {
    const newMethod = this.shippingMethodRepository.create({
      ...methodData,
      tenantId: this.tenantId,
    });
    return this.shippingMethodRepository.save(newMethod);
  }

  async findAllShippingMethods(): Promise<ShippingMethod[]> {
    return this.shippingMethodRepository.find({ where: { tenantId: this.tenantId, isActive: true } });
  }

  async findShippingMethodById(id: string): Promise<ShippingMethod> {
    const method = await this.shippingMethodRepository.findOne({
      where: { id, tenantId: this.tenantId },
    });
    if (!method) {
      throw new NotFoundException(`Shipping method with ID ${id} not found.`);
    }
    return method;
  }

  async getAvailablePaymentMethods(userId: string, orderTotal: number, shippingAddressId?: string): Promise<string[]> {
    const availableMethods: string[] = ['card', 'upi', 'netbanking'];

    const tenant = await this.tenantConfigService.findTenantById(this.tenantId);
    const codSettings = (tenant.config as any)?.codSettings;

    if (codSettings?.isEnabled) {
      this.logger.debug(`COD is enabled at tenant level. Checking further rules.`);
      let codEligible = true;

      if (codSettings.maxAmount && orderTotal > codSettings.maxAmount) {
        codEligible = false;
        this.logger.debug(`COD not eligible: order total ${orderTotal} > maxAmount ${codSettings.maxAmount}`);
      }
      if (codSettings.minAmount && orderTotal < codSettings.minAmount) {
        codEligible = false;
        this.logger.debug(`COD not eligible: order total ${orderTotal} < minAmount ${codSettings.minAmount}`);
      }

      if (shippingAddressId && codEligible) {
        try {
          const shippingAddress = await this.addressService.findAddressById(userId, shippingAddressId);
          if (codSettings.restrictedRegions && codSettings.restrictedRegions.includes(shippingAddress.state)) {
            codEligible = false;
            this.logger.debug(`COD not eligible: address state ${shippingAddress.state} in restricted regions.`);
          }
        } catch (error) {
          this.logger.warn(`Could not validate shipping address ${shippingAddressId} for COD eligibility: ${error.message}`);
          codEligible = false;
        }
      }

      if (codEligible) {
        availableMethods.push('cod');
        this.logger.debug(`COD eligible for order total ${orderTotal} and address ${shippingAddressId}.`);
      }
    } else {
        this.logger.debug(`COD is disabled at tenant level.`);
    }

    return availableMethods;
  }

  async getCheckoutSummary(userId: string, cartId: string, addressId?: string, shippingMethodId?: string, pointsToRedeem: number = 0): Promise<any> {
    const cartDetails = await this.cartService.getCartWithDetails(cartId);
    if (!cartDetails.sellerGroups || cartDetails.sellerGroups.length === 0) {
      throw new BadRequestException('Cart is empty.');
    }

    let shippingAddress: any = null;
    if (addressId) {
      shippingAddress = await this.addressService.findAddressById(userId, addressId);
    }

    const availableShippingMethods = await this.findAllShippingMethods();
    let selectedShippingMethod: ShippingMethod | null = null;
    let shippingCost = 0;

    if (shippingMethodId) {
      selectedShippingMethod = await this.findShippingMethodById(shippingMethodId);
      shippingCost = selectedShippingMethod.baseCost;
    }

    let totalAmount = cartDetails.finalCartTotal + shippingCost; // Use finalCartTotal after automatic discounts

    // Apply loyalty points redemption discount
    let pointsDiscount = 0;
    if (pointsToRedeem > 0) {
        const userLoyalty = await this.loyaltyService.getUserLoyaltyPoints(userId);
        if (userLoyalty.balance < pointsToRedeem) {
            throw new BadRequestException('Insufficient loyalty points balance.');
        }
        pointsDiscount = pointsToRedeem; // Assuming 1 point = 1 unit of currency for MVP
        totalAmount -= pointsDiscount;
        if (totalAmount < 0) totalAmount = 0; // Ensure total doesn't go negative
    }

    const availablePaymentMethods = await this.getAvailablePaymentMethods(userId, totalAmount, shippingAddress?.id);

    return {
      cart: cartDetails,
      shippingAddress,
      availableShippingMethods,
      selectedShippingMethod,
      shippingCost,
      totalAmount,
      pointsRedeemed: pointsToRedeem,
      pointsDiscount: pointsDiscount,
      availablePaymentMethods,
    };
  }

  async processCheckout(
    userId: string,
    cartId: string,
    addressId: string,
    shippingMethodId: string,
    paymentMethod: string,
    pointsToRedeem: number = 0, // New parameter for points redemption
  ): Promise<any> {
    const checkoutSummary = await this.getCheckoutSummary(userId, cartId, addressId, shippingMethodId, pointsToRedeem);

    if (!checkoutSummary.shippingAddress) {
      throw new BadRequestException('Shipping address not selected.');
    }
    if (!checkoutSummary.selectedShippingMethod) {
      throw new BadRequestException('Shipping method not selected.');
    }
    if (!checkoutSummary.availablePaymentMethods.includes(paymentMethod)) {
      throw new BadRequestException(`Payment method '${paymentMethod}' is not available.`);
    }

    // Perform final stock checks before placing order
    for (const sellerGroup of checkoutSummary.cart.sellerGroups) {
        for (const item of sellerGroup.items) {
            const { stock } = await this.productService.findProductById(item.productId);
            if (stock < item.quantity) {
                throw new BadRequestException(`Insufficient stock for product ${item.product.title}.`);
            }
        }
    }

    // Redeem loyalty points if applicable
    if (pointsToRedeem > 0) {
        await this.loyaltyService.redeemPoints(userId, pointsToRedeem, 'redeem_checkout', `Redeemed for order in cart ${cartId}`, cartId);
    }

    // Create the order
    const order = await this.orderService.createOrderFromCheckout(
        userId,
        cartId,
        addressId,
        shippingMethodId,
        checkoutSummary.totalAmount, // Use the final total after discounts and points
        'INR' // Assuming INR for MVP, this should come from tenant config
    );

    let paymentResult: any;
    if (paymentMethod === 'cod') {
        paymentResult = await this.paymentService.createCodPayment(
            order.id,
            userId,
            order.totalAmount,
            'INR',
        );
    } else {
        paymentResult = await this.paymentService.createPaymentIntent(
            order.id,
            userId,
            order.totalAmount,
            'INR',
            'mock_gateway',
            paymentMethod,
        );
    }
    
    return {
      message: 'Order created. Proceed with payment.',
      orderId: order.id,
      paymentDetails: paymentResult,
    };
  }
}
