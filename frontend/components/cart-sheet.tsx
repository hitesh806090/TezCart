import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

const mockCartItems: CartItem[] = [
  {
    id: 1,
    name: "Sony Headphones",
    price: 199,
    quantity: 1,
    image: "/placeholder-image.jpg",
  },
  {
    id: 2,
    name: "Nike Shoes",
    price: 230,
    quantity: 1,
    image: "/placeholder-image.jpg",
  },
];

const subtotal = mockCartItems.reduce(
  (sum, item) => sum + item.price * item.quantity,
  0
);

export function CartSheet({ variant = "icon" }: { variant?: "icon" | "text" }) {
  const CartTrigger = () => {
    if (variant === "text") {
      return (
        <SheetTrigger asChild>
          <button className="flex items-center text-white hover:text-gold py-2">
            <ShoppingCart className="h-5 w-5 mr-2" />
            Cart
          </button>
        </SheetTrigger>
      );
    }
    return (
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="h-6 w-6" />
          <span className="absolute -top-2 -right-2 bg-amber-500 text-black text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {mockCartItems.length}
          </span>
        </Button>
      </SheetTrigger>
    );
  };

  return (
    <Sheet>
      <CartTrigger />
      <SheetContent className="w-full max-w-md">
        <SheetHeader>
          <SheetTitle>My Cart ({mockCartItems.length} items)</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4">
          <div className="space-y-4">
            {mockCartItems.map((item) => (
              <div key={item.id} className="flex items-center space-x-4 p-2 border-b">
                <div className="flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={60}
                    height={60}
                    className="rounded-md object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{item.name}</h3>
                  <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="w-8 h-8 rounded-full border flex items-center justify-center">
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button className="w-8 h-8 rounded-full border flex items-center justify-center">
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t pt-4 sticky bottom-0 bg-white">
          <div className="flex justify-between items-center mb-4">
            <span>Subtotal</span>
            <span className="font-bold">${subtotal.toFixed(2)}</span>
          </div>
          <Button
            className="w-full bg-amber-500 text-black hover:bg-amber-600"
            asChild
          >
            <a href="/checkout">Checkout</a>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}