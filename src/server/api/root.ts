import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { authRouter } from "./routers/auth";
import { productRouter } from "./routers/product";
import { sellerRouter } from "./routers/seller";
import { cartRouter } from "./routers/cart";
import { orderRouter } from "./routers/order";
import { reviewRouter } from "./routers/review";
import { wishlistRouter } from "./routers/wishlist";
import { returnRouter } from "./routers/return";
import { messageRouter } from "./routers/message";
import { analyticsRouter } from "./routers/analytics";
import { couponRouter } from "./routers/coupon";
import { notificationRouter } from "./routers/notification";
import { categoryRouter } from "./routers/category";
import { paymentRouter } from "./routers/payment";
import { addressRouter } from "./routers/address";
import { trackingRouter } from "./routers/tracking";
import { reportRouter } from "./routers/report";
import { favoriteRouter } from "./routers/favorite";
import { searchRouter } from "./routers/search";
import { subscriptionRouter } from "./routers/subscription";
import { activityRouter } from "./routers/activity";
import { cmsRouter } from "./routers/cms";
import { fraudRouter } from "./routers/fraud";
import { disputeRouter } from "./routers/dispute";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  product: productRouter,
  seller: sellerRouter,
  cart: cartRouter,
  order: orderRouter,
  review: reviewRouter,
  wishlist: wishlistRouter,
  return: returnRouter,
  message: messageRouter,
  analytics: analyticsRouter,
  coupon: couponRouter,
  notification: notificationRouter,
  category: categoryRouter,
  payment: paymentRouter,
  address: addressRouter,
  tracking: trackingRouter,
  report: reportRouter,
  favorite: favoriteRouter,
  search: searchRouter,
  subscription: subscriptionRouter,
  activity: activityRouter,
  cms: cmsRouter,
  fraud: fraudRouter,
  dispute: disputeRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
