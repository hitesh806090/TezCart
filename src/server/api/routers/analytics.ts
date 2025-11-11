import { z } from "zod";
import { createTRPCRouter, sellerProcedure } from "@/server/api/trpc";

export const analyticsRouter = createTRPCRouter({
  getSellerStats: sellerProcedure.query(async ({ ctx }) => {
    const sellerProfile = await ctx.db.sellerProfile.findUnique({
      where: { userId: ctx.session.user.id },
    });

    if (!sellerProfile) {
      return null;
    }

    // Get product count
    const productCount = await ctx.db.product.count({
      where: { sellerId: sellerProfile.id },
    });

    // Get order stats
    const orders = await ctx.db.orderItem.findMany({
      where: { sellerId: sellerProfile.id },
      include: {
        order: true,
      },
    });

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
    const platformFee = totalRevenue * 0.1;
    const netRevenue = totalRevenue - platformFee;

    // Get order status breakdown
    const pendingOrders = orders.filter((o: any) => o.status === "PENDING").length;
    const processingOrders = orders.filter((o: any) => o.status === "PROCESSING").length;
    const shippedOrders = orders.filter((o: any) => o.status === "SHIPPED").length;
    const deliveredOrders = orders.filter((o: any) => o.status === "DELIVERED").length;

    // Get recent orders
    const recentOrders = orders
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10);

    // Get top products
    const productSales = orders.reduce((acc: any, item: any) => {
      if (!acc[item.productId]) {
        acc[item.productId] = {
          productId: item.productId,
          quantity: 0,
          revenue: 0,
        };
      }
      acc[item.productId].quantity += item.quantity;
      acc[item.productId].revenue += item.price * item.quantity;
      return acc;
    }, {});

    const topProducts = Object.values(productSales)
      .sort((a: any, b: any) => b.revenue - a.revenue)
      .slice(0, 5);

    // Get products for top products
    const topProductIds = topProducts.map((p: any) => p.productId);
    const products = await ctx.db.product.findMany({
      where: {
        id: { in: topProductIds },
      },
      include: {
        media: true,
      },
    });

    const topProductsWithDetails = topProducts.map((p: any) => ({
      ...p,
      product: products.find((prod: any) => prod.id === p.productId),
    }));

    return {
      productCount,
      totalOrders,
      totalRevenue,
      platformFee,
      netRevenue,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      recentOrders,
      topProducts: topProductsWithDetails,
    };
  }),

  getProductPerformance: sellerProcedure
    .input(z.object({ productId: z.string() }))
    .query(async ({ ctx, input }) => {
      const sellerProfile = await ctx.db.sellerProfile.findUnique({
        where: { userId: ctx.session.user.id },
      });

      if (!sellerProfile) {
        return null;
      }

      // Verify product ownership
      const product = await ctx.db.product.findUnique({
        where: { id: input.productId },
      });

      if (!product || product.sellerId !== sellerProfile.id) {
        return null;
      }

      // Get order items for this product
      const orderItems = await ctx.db.orderItem.findMany({
        where: {
          productId: input.productId,
          sellerId: sellerProfile.id,
        },
      });

      const totalSold = orderItems.reduce((sum: number, item: any) => sum + item.quantity, 0);
      const totalRevenue = orderItems.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

      // Get reviews
      const reviews = await ctx.db.review.findMany({
        where: {
          productId: input.productId,
          status: "APPROVED",
        },
      });

      const averageRating =
        reviews.length > 0
          ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length
          : 0;

      return {
        totalSold,
        totalRevenue,
        reviewCount: reviews.length,
        averageRating,
      };
    }),
});
