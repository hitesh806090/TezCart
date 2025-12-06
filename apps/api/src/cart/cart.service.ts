import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from 'db';
import { CartItem } from 'db';
import { TenantProvider } from '..//common/tenant.module';
import { ProductService } from '..//product/product.service';
import { InventoryService } from '..//inventory/inventory.service';
import { AutomaticDiscountService } from '../discount/automatic-discount.service'; // Import AutomaticDiscountService
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    private readonly tenantProvider: TenantProvider,
    private readonly productService: ProductService,
    private readonly inventoryService: InventoryService,
    private readonly automaticDiscountService: AutomaticDiscountService, // Inject AutomaticDiscountService
  ) {}

  private get tenantId(): string {
    const tenantId = this.tenantProvider.tenantId;
    if (!tenantId) {
      throw new Error('Tenant context missing.');
    }
    return tenantId;
  }

  async getOrCreateCart(userId?: string, sessionId?: string): Promise<Cart> {
    let cart: Cart;

    if (userId) {
      cart = await this.cartRepository.findOne({ where: { userId, tenantId: this.tenantId } });
    } else if (sessionId) {
      cart = await this.cartRepository.findOne({ where: { sessionId, tenantId: this.tenantId } });
    }

    if (!cart) {
      cart = this.cartRepository.create({
        userId,
        sessionId: userId ? null : (sessionId || uuidv4()),
        tenantId: this.tenantId,
      });
      cart = await this.cartRepository.save(cart);
    }
    return cart;
  }

  async mergeCarts(guestSessionId: string, userId: string): Promise<Cart> {
    const guestCart = await this.cartRepository.findOne({ where: { sessionId: guestSessionId, tenantId: this.tenantId }, relations: ['items'] });
    if (!guestCart) {
      return this.getOrCreateCart(userId);
    }

    const userCart = await this.getOrCreateCart(userId);

    for (const guestItem of guestCart.items) {
      await this.addItemToCart(userCart.id, guestItem.productId, guestItem.quantity, guestItem.attributes);
      await this.cartItemRepository.remove(guestItem);
    }
    await this.cartRepository.remove(guestCart);

    return userCart;
  }


  async addItemToCart(
    cartId: string,
    productId: string,
    quantity: number,
    attributes: object = {},
  ): Promise<Cart> {
    if (quantity <= 0) {
      throw new BadRequestException('Quantity must be greater than zero.');
    }

    const cart = await this.cartRepository.findOne({
      where: { id: cartId, tenantId: this.tenantId },
      relations: ['items', 'items.product'],
    });
    if (!cart) {
      throw new NotFoundException('Cart not found.');
    }

    const product = await this.productService.findProductById(productId);
    const { stock: availableStock } = await this.inventoryService.getStock(productId);

    if (availableStock < quantity) {
      throw new BadRequestException(`Not enough stock for ${product.title}. Available: ${availableStock}`);
    }

    let cartItem = cart.items.find(item =>
      item.productId === productId && JSON.stringify(item.attributes) === JSON.stringify(attributes)
    );

    if (cartItem) {
      cartItem.quantity += quantity;
      if (availableStock < cartItem.quantity) {
        throw new BadRequestException(`Not enough stock for ${product.title}. Total requested: ${cartItem.quantity}, Available: ${availableStock}`);
      }
      cartItem.price = product.salePrice || product.price;
      await this.cartItemRepository.save(cartItem);
    } else {
      cartItem = this.cartItemRepository.create({
        cartId: cart.id,
        productId: product.id,
        sellerId: product.sellerId,
        quantity,
        price: product.salePrice || product.price,
        attributes,
        tenantId: this.tenantId,
      });
      await this.cartItemRepository.save(cartItem);
    }

    await this.inventoryService.reserveStock(productId, quantity);

    return this.getCartWithDetails(cart.id);
  }

  async updateItemQuantity(cartId: string, itemId: string, newQuantity: number): Promise<Cart> {
    if (newQuantity <= 0) {
      return this.removeItemFromCart(cartId, itemId);
    }

    const cart = await this.cartRepository.findOne({
        where: { id: cartId, tenantId: this.tenantId },
        relations: ['items', 'items.product'],
    });
    if (!cart) {
        throw new NotFoundException('Cart not found.');
    }

    const cartItem = cart.items.find(item => item.id === itemId);
    if (!cartItem) {
        throw new NotFoundException('Cart item not found.');
    }

    const product = await this.productService.findProductById(cartItem.productId);
    const { stock: availableStock } = await this.inventoryService.getStock(product.id);

    const oldQuantity = cartItem.quantity;
    const quantityDifference = newQuantity - oldQuantity;

    if (quantityDifference > 0) {
        if (availableStock < quantityDifference) {
            throw new BadRequestException(`Not enough stock for ${product.title}. Available: ${availableStock}, Requested to add: ${quantityDifference}`);
        }
        await this.inventoryService.reserveStock(product.id, quantityDifference);
    } else if (quantityDifference < 0) {
        await this.inventoryService.releaseStock(product.id, -quantityDifference);
    }

    cartItem.quantity = newQuantity;
    await this.cartItemRepository.save(cartItem);

    return this.getCartWithDetails(cart.id);
  }


  async removeItemFromCart(cartId: string, itemId: string): Promise<Cart> {
    const cart = await this.cartRepository.findOne({
      where: { id: cartId, tenantId: this.tenantId },
      relations: ['items', 'items.product'],
    });
    if (!cart) {
      throw new NotFoundException('Cart not found.');
    }

    const cartItem = cart.items.find(item => item.id === itemId);
    if (!cartItem) {
      throw new NotFoundException('Cart item not found.');
    }

    await this.inventoryService.releaseStock(cartItem.productId, cartItem.quantity);

    await this.cartItemRepository.remove(cartItem);
    return this.getCartWithDetails(cart.id);
  }

  async clearCart(cartId: string): Promise<Cart> {
    const cart = await this.cartRepository.findOne({
      where: { id: cartId, tenantId: this.tenantId },
      relations: ['items', 'items.product'],
    });
    if (!cart) {
      throw new NotFoundException('Cart not found.');
    }

    for (const item of cart.items) {
      await this.inventoryService.releaseStock(item.productId, item.quantity);
    }

    await this.cartItemRepository.remove(cart.items);
    return this.getCartWithDetails(cart.id);
  }

  async getCartWithDetails(cartId: string): Promise<any> {
    let cart = await this.cartRepository.findOne({
      where: { id: cartId, tenantId: this.tenantId },
      relations: ['items', 'items.product', 'items.seller'],
    });

    if (!cart) {
      throw new NotFoundException('Cart not found.');
    }

    const sellerGroups: { [sellerId: string]: { seller: any; items: CartItem[]; subtotal: number } } = {};
    let cartTotal = 0;

    for (const item of cart.items) {
      const itemPrice = item.price * item.quantity;
      cartTotal += itemPrice;

      if (!sellerGroups[item.sellerId]) {
        sellerGroups[item.sellerId] = {
          seller: item.seller,
          items: [],
          subtotal: 0,
        };
      }
      sellerGroups[item.sellerId].items.push(item);
      sellerGroups[item.sellerId].subtotal += itemPrice;
    }

    cart = {
      ...cart,
      sellerGroups: Object.values(sellerGroups),
      cartTotal,
    };

    // Apply automatic discounts
    const cartWithDiscounts = await this.automaticDiscountService.applyAutomaticDiscountsToCart(cart);

    return cartWithDiscounts;
  }
}
