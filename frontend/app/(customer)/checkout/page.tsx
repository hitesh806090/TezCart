import { Button } from "@/components/ui/button";

export default function CheckoutPage() {
  // Mock data for addresses
  const savedAddresses = [
    {
      id: 1,
      name: "John Doe",
      address: "123 Main St, Apt 4B",
      city: "New York",
      state: "NY",
      zip: "10001",
      phone: "+1 (555) 123-4567",
      isDefault: true,
    },
    {
      id: 2,
      name: "John Doe",
      address: "456 Park Ave",
      city: "New York",
      state: "NY",
      zip: "10022",
      phone: "+1 (555) 987-6543",
      isDefault: false,
    },
  ];

  // Mock order summary
  const orderSummary = {
    subtotal: 429.0,
    tax: 34.32,
    shipping: 0, // Free shipping
    grandTotal: 463.32,
  };

  return (
    <div className="min-h-screen bg-obsidian py-8">
      <div className="container max-w-7xl mx-auto px-4">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Shipping & Payment */}
          <div className="lg:col-span-2 space-y-8">
            {/* Delivery Address Section */}
            <div className="bg-surface border border-border-dark rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Delivery Address</h2>
              
              <div className="space-y-4">
                {savedAddresses.map((address) => (
                  <div 
                    key={address.id} 
                    className={`flex items-start p-4 border rounded-lg ${
                      address.isDefault 
                        ? "border-gold bg-amber-500/10" 
                        : "border-border-dark hover:border-gold/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="delivery-address"
                      id={`address-${address.id}`}
                      defaultChecked={address.isDefault}
                      className="mt-1 mr-3 text-gold focus:ring-gold"
                    />
                    <label htmlFor={`address-${address.id}`} className="flex-1 text-white">
                      <div className="font-medium">{address.name}</div>
                      <div>{address.address}</div>
                      <div>{address.city}, {address.state} {address.zip}</div>
                      <div className="mt-1">{address.phone}</div>
                      {address.isDefault && (
                        <div className="mt-2 text-gold text-sm font-medium">Default Address</div>
                      )}
                    </label>
                  </div>
                ))}
              </div>
              
              <Button
                variant="outline"
                className="mt-6 w-full border-gold text-gold hover:bg-gold/10"
              >
                + Add Address
              </Button>
            </div>
            
            {/* Payment Method Section */}
            <div className="bg-surface border border-border-dark rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Payment Method</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border border-border-dark rounded-lg p-4 text-center hover:border-gold cursor-pointer transition-colors">
                  <div className="text-white font-medium mb-2">UPI / GPay</div>
                  <div className="text-sm text-gray-400">Instant payment</div>
                </div>
                
                <div className="border border-border-dark rounded-lg p-4 text-center hover:border-gold cursor-pointer transition-colors">
                  <div className="text-white font-medium mb-2">Credit Card</div>
                  <div className="text-sm text-gray-400">Secure payment</div>
                </div>
                
                <div className="border border-border-dark rounded-lg p-4 text-center hover:border-gold cursor-pointer transition-colors">
                  <div className="text-white font-medium mb-2">Cash on Delivery</div>
                  <div className="text-sm text-gray-400">Pay at delivery</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-zinc-900 border border-border-dark rounded-lg p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-white mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-white">
                  <span>Subtotal</span>
                  <span>${orderSummary.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white">
                  <span>Tax</span>
                  <span>${orderSummary.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white">
                  <span>Shipping</span>
                  <span className="text-green-500">FREE</span>
                </div>
                <div className="border-t border-border-dark pt-3 mt-3">
                  <div className="flex justify-between text-white font-bold">
                    <span>Grand Total</span>
                    <span className="text-gold text-xl">${orderSummary.grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <Button className="w-full bg-amber-500 text-black hover:bg-amber-600 h-12 text-lg font-bold">
                Place Order
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}