import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart, CartStatus } from '../entities/cart.entity';
import { CartItem } from '../entities/cart-item.entity';
import { Product, ProductStatus } from '../entities/product.entity';
import { AddToCartDto, UpdateCartItemDto, ApplyCouponDto } from './dto/cart.dto';

@Injectable()
export class CartService {
    constructor(
        @InjectRepository(Cart)
        private cartsRepository: Repository<Cart>,
        @InjectRepository(CartItem)
        private cartItemsRepository: Repository<CartItem>,
        @InjectRepository(Product)
        private productsRepository: Repository<Product>,
    ) { }

    // Get or create cart for user/session
    async getOrCreateCart(userId?: string, sessionId?: string): Promise<Cart> {
        let cart: Cart | null = null;

        if (userId) {
            cart = await this.cartsRepository.findOne({
                where: { userId, status: CartStatus.ACTIVE },
                relations: ['items', 'items.product'],
            });
        } else if (sessionId) {
            cart = await this.cartsRepository.findOne({
                where: { sessionId, status: CartStatus.ACTIVE },
                relations: ['items', 'items.product'],
            });
        }

        if (!cart) {
            cart = this.cartsRepository.create({
                userId,
                sessionId,
                status: CartStatus.ACTIVE,
            });
            await this.cartsRepository.save(cart);
        }

        return cart;
    }

    async addToCart(
        addToCartDto: AddToCartDto,
        userId?: string,
        sessionId?: string,
    ): Promise<Cart> {
        const { productId, quantity } = addToCartDto;

        // Validate product
        const product = await this.productsRepository.findOne({
            where: { id: productId },
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        if (product.status !== ProductStatus.ACTIVE) {
            throw new BadRequestException('Product is not available');
        }

        if (product.trackInventory && product.stockQuantity < quantity) {
            throw new BadRequestException(
                `Only ${product.stockQuantity} items available in stock`,
            );
        }

        // Get or create cart
        const cart = await this.getOrCreateCart(userId, sessionId);

        // Check if product already in cart
        let cartItem = await this.cartItemsRepository.findOne({
            where: { cartId: cart.id, productId },
        });

        if (cartItem) {
            // Update quantity
            const newQuantity = cartItem.quantity + quantity;

            if (product.trackInventory && product.stockQuantity < newQuantity) {
                throw new BadRequestException(
                    `Only ${product.stockQuantity} items available in stock`,
                );
            }

            cartItem.quantity = newQuantity;
            cartItem.subtotal = (product.price - cartItem.discount) * newQuantity;
        } else {
            // Create new cart item
            cartItem = this.cartItemsRepository.create({
                cartId: cart.id,
                productId,
                quantity,
                price: product.price,
                discount: 0, // TODO: Apply promotional discounts
                subtotal: product.price * quantity,
                productSnapshot: {
                    name: product.name,
                    image: product.images?.[0] || '',
                    sku: product.sku || '',
                    seller: product.sellerId,
                },
                isAvailable: true,
            });
        }

        await this.cartItemsRepository.save(cartItem);

        // Recalculate cart totals
        await this.calculateCartTotals(cart.id);

        // Return updated cart
        return this.getCart(cart.id);
    }

    async getCart(cartId: string): Promise<Cart> {
        const cart = await this.cartsRepository.findOne({
            where: { id: cartId },
            relations: ['items', 'items.product'],
        });

        if (!cart) {
            throw new NotFoundException('Cart not found');
        }

        // Update availability for each item
        await this.updateItemsAvailability(cart);

        return cart;
    }

    async getMyCart(userId?: string, sessionId?: string): Promise<Cart> {
        const cart = await this.getOrCreateCart(userId, sessionId);
        await this.updateItemsAvailability(cart);
        return cart;
    }

    async updateCartItem(
        cartItemId: string,
        updateCartItemDto: UpdateCartItemDto,
        userId?: string,
        sessionId?: string,
    ): Promise<Cart> {
        const cartItem = await this.cartItemsRepository.findOne({
            where: { id: cartItemId },
            relations: ['cart', 'product'],
        });

        if (!cartItem) {
            throw new NotFoundException('Cart item not found');
        }

        // Verify ownership
        if (userId && cartItem.cart.userId !== userId) {
            throw new BadRequestException('This cart does not belong to you');
        }
        if (sessionId && cartItem.cart.sessionId !== sessionId) {
            throw new BadRequestException('This cart does not belong to you');
        }

        const { quantity } = updateCartItemDto;
        const product = cartItem.product;

        // Validate stock
        if (product.trackInventory && product.stockQuantity < quantity) {
            throw new BadRequestException(
                `Only ${product.stockQuantity} items available in stock`,
            );
        }

        // Update quantity and subtotal
        cartItem.quantity = quantity;
        cartItem.price = product.price; // Update to current price
        cartItem.subtotal = (product.price - cartItem.discount) * quantity;

        await this.cartItemsRepository.save(cartItem);

        // Recalculate cart totals
        await this.calculateCartTotals(cartItem.cartId);

        return this.getCart(cartItem.cartId);
    }

    async removeFromCart(
        cartItemId: string,
        userId?: string,
        sessionId?: string,
    ): Promise<Cart> {
        const cartItem = await this.cartItemsRepository.findOne({
            where: { id: cartItemId },
            relations: ['cart'],
        });

        if (!cartItem) {
            throw new NotFoundException('Cart item not found');
        }

        // Verify ownership
        if (userId && cartItem.cart.userId !== userId) {
            throw new BadRequestException('This cart does not belong to you');
        }
        if (sessionId && cartItem.cart.sessionId !== sessionId) {
            throw new BadRequestException('This cart does not belong to you');
        }

        const cartId = cartItem.cartId;
        await this.cartItemsRepository.remove(cartItem);

        // Recalculate cart totals
        await this.calculateCartTotals(cartId);

        return this.getCart(cartId);
    }

    async clearCart(userId?: string, sessionId?: string): Promise<void> {
        const cart = await this.getOrCreateCart(userId, sessionId);

        await this.cartItemsRepository.delete({ cartId: cart.id });

        // Reset cart totals
        cart.subtotal = 0;
        cart.tax = 0;
        cart.shipping = 0;
        cart.discount = 0;
        cart.total = 0;
        cart.itemCount = 0;

        await this.cartsRepository.save(cart);
    }

    async applyCoupon(
        applyCouponDto: ApplyCouponDto,
        userId?: string,
        sessionId?: string,
    ): Promise<Cart> {
        const cart = await this.getOrCreateCart(userId, sessionId);

        // TODO: Validate coupon code and calculate discount
        // For now, just save the coupon code
        cart.couponCode = applyCouponDto.couponCode;

        await this.cartsRepository.save(cart);
        await this.calculateCartTotals(cart.id);

        return this.getCart(cart.id);
    }

    async removeCoupon(userId?: string, sessionId?: string): Promise<Cart> {
        const cart = await this.getOrCreateCart(userId, sessionId);

        cart.discount = 0;

        await this.cartsRepository.save(cart);
        await this.calculateCartTotals(cart.id);

        return this.getCart(cart.id);
    }

    // Merge guest cart with user cart after login
    async mergeCart(userId: string, guestSessionId: string): Promise<Cart> {
        const userCart = await this.getOrCreateCart(userId);
        const guestCart = await this.cartsRepository.findOne({
            where: { sessionId: guestSessionId, status: CartStatus.ACTIVE },
            relations: ['items'],
        });

        if (!guestCart || guestCart.items.length === 0) {
            return userCart;
        }

        // Merge guest cart items into user cart
        for (const guestItem of guestCart.items) {
            const existingItem = await this.cartItemsRepository.findOne({
                where: { cartId: userCart.id, productId: guestItem.productId },
            });

            if (existingItem) {
                // Update quantity
                existingItem.quantity += guestItem.quantity;
                existingItem.subtotal =
                    (existingItem.price - existingItem.discount) * existingItem.quantity;
                await this.cartItemsRepository.save(existingItem);
            } else {
                // Move item to user cart
                guestItem.cartId = userCart.id;
                await this.cartItemsRepository.save(guestItem);
            }
        }

        // Mark guest cart as converted
        guestCart.status = CartStatus.CONVERTED;
        await this.cartsRepository.save(guestCart);

        // Recalculate user cart totals
        await this.calculateCartTotals(userCart.id);

        return this.getCart(userCart.id);
    }

    // Helper: Calculate cart totals
    private async calculateCartTotals(cartId: string): Promise<void> {
        const cart = await this.cartsRepository.findOne({
            where: { id: cartId },
            relations: ['items'],
        });

        if (!cart) {
            return;
        }

        let subtotal = 0;
        let itemCount = 0;

        for (const item of cart.items) {
            subtotal += Number(item.subtotal);
            itemCount += item.quantity;
        }

        // Calculate tax (example: 10%)
        const taxRate = 0.1;
        const tax = subtotal * taxRate;

        // Calculate shipping (example: free over $50, otherwise $5)
        const shipping = subtotal >= 50 ? 0 : 5;

        // TODO: Calculate discount based on coupon code
        const discount = 0;

        const total = subtotal + tax + shipping - discount;

        cart.subtotal = subtotal;
        cart.tax = tax;
        cart.shipping = shipping;
        cart.discount = discount;
        cart.total = total;
        cart.itemCount = itemCount;

        await this.cartsRepository.save(cart);
    }

    // Helper: Update item availability
    private async updateItemsAvailability(cart: Cart): Promise<void> {
        for (const item of cart.items) {
            if (!item.product) {
                item.isAvailable = false;
                continue;
            }

            const product = item.product;

            if (product.status !== ProductStatus.ACTIVE) {
                item.isAvailable = false;
            } else if (product.trackInventory && product.stockQuantity < item.quantity) {
                item.isAvailable = false;
            } else {
                item.isAvailable = true;
            }

            await this.cartItemsRepository.save(item);
        }
    }

    async getCartItemCount(userId?: string, sessionId?: string): Promise<number> {
        const cart = await this.getOrCreateCart(userId, sessionId);
        return cart.itemCount;
    }
}
