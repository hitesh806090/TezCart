"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

// Mock data for orders
const mockOrders = [
  {
    id: "ORD-001",
    date: "2023-06-15T10:30:00Z",
    customer: "John Doe",
    items: [
      { name: "Sony WH-1000XM5 Wireless Headphones", quantity: 1, price: 299.99 },
      { name: "Premium Headphone Case", quantity: 1, price: 29.99 }
    ],
    total: 329.98,
    status: "pending", // pending, processing, ready, completed
    timeAgo: "2 mins ago"
  },
  {
    id: "ORD-002",
    date: "2023-06-15T09:45:00Z",
    customer: "Jane Smith",
    items: [
      { name: "Wireless Bluetooth Speaker", quantity: 2, price: 89.99 }
    ],
    total: 179.98,
    status: "processing",
    timeAgo: "15 mins ago"
  },
  {
    id: "ORD-003",
    date: "2023-06-15T08:20:00Z",
    customer: "Raj Patel",
    items: [
      { name: "Gaming Mouse", quantity: 1, price: 79.99 },
      { name: "Mechanical Keyboard", quantity: 1, price: 129.99 }
    ],
    total: 209.98,
    status: "ready",
    timeAgo: "45 mins ago"
  },
  {
    id: "ORD-004",
    date: "2023-06-14T16:30:00Z",
    customer: "Priya Sharma",
    items: [
      { name: "Smart Watch", quantity: 1, price: 249.99 },
      { name: "Charging Cable", quantity: 2, price: 19.99 }
    ],
    total: 289.97,
    status: "completed",
    timeAgo: "1 day ago"
  },
  {
    id: "ORD-005",
    date: "2023-06-15T11:15:00Z",
    customer: "Michael Johnson",
    items: [
      { name: "Laptop Stand", quantity: 1, price: 59.99 },
      { name: "USB Hub", quantity: 1, price: 39.99 }
    ],
    total: 99.98,
    status: "pending",
    timeAgo: "Just now"
  },
  {
    id: "ORD-006",
    date: "2023-06-15T10:00:00Z",
    customer: "Sarah Williams",
    items: [
      { name: "Wireless Earbuds", quantity: 1, price: 129.99 }
    ],
    total: 129.98,
    status: "processing",
    timeAgo: "30 mins ago"
  }
];

const OrderManagementPage = () => {
  const [activeTab, setActiveTab] = useState("pending");

  // Filter orders based on active tab
  const getFilteredOrders = (status: string) => {
    return mockOrders.filter(order => order.status === status);
  };

  // Function to update order status
  const handleOrderAction = (orderId: string, action: string) => {
    console.log(`Action ${action} performed on order ${orderId}`);
    // In a real application, you would make an API call to update the order status
  };

  // Format date to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="min-h-screen bg-obsidian p-6">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-4 sm:mb-0">Order Management</h1>
          <Button variant="outline" className="border-border-dark text-white hover:bg-surface">
            Export CSV
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-surface border border-border-dark">
            <TabsTrigger 
              value="pending" 
              className={`data-[state=active]:bg-amber-500 data-[state=active]:text-black ${
                activeTab === 'pending' ? 'bg-amber-500 text-black' : 'text-white'
              }`}
            >
              Pending
            </TabsTrigger>
            <TabsTrigger 
              value="processing" 
              className={`data-[state=active]:bg-amber-500 data-[state=active]:text-black ${
                activeTab === 'processing' ? 'bg-amber-500 text-black' : 'text-white'
              }`}
            >
              Processing
            </TabsTrigger>
            <TabsTrigger 
              value="ready" 
              className={`data-[state=active]:bg-amber-500 data-[state=active]:text-black ${
                activeTab === 'ready' ? 'bg-amber-500 text-black' : 'text-white'
              }`}
            >
              Ready for Pickup
            </TabsTrigger>
            <TabsTrigger 
              value="completed" 
              className={`data-[state=active]:bg-amber-500 data-[state=active]:text-black ${
                activeTab === 'completed' ? 'bg-amber-500 text-black' : 'text-white'
              }`}
            >
              Completed
            </TabsTrigger>
          </TabsList>

          {/* Pending Orders Tab */}
          <TabsContent value="pending" className="mt-6">
            <div className="hidden md:block">
              <table className="w-full border-collapse border border-border-dark rounded-lg overflow-hidden">
                <thead className="bg-surface">
                  <tr>
                    <th className="border border-border-dark p-3 text-left text-white">Order ID</th>
                    <th className="border border-border-dark p-3 text-left text-white">Date</th>
                    <th className="border border-border-dark p-3 text-left text-white">Customer</th>
                    <th className="border border-border-dark p-3 text-left text-white">Items</th>
                    <th className="border border-border-dark p-3 text-left text-white">Total</th>
                    <th className="border border-border-dark p-3 text-left text-white">Status</th>
                    <th className="border border-border-dark p-3 text-left text-white">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {getFilteredOrders('pending').map((order) => (
                    <tr key={order.id} className="border border-border-dark hover:bg-surface/50">
                      <td className="border border-border-dark p-3 text-white">#{order.id}</td>
                      <td className="border border-border-dark p-3 text-white">{formatDate(order.date)}</td>
                      <td className="border border-border-dark p-3 text-white">{order.customer}</td>
                      <td className="border border-border-dark p-3 text-white">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="text-gray-300">
                            {item.quantity}x {item.name}
                          </div>
                        ))}
                      </td>
                      <td className="border border-border-dark p-3 text-white">${order.total.toFixed(2)}</td>
                      <td className="border border-border-dark p-3">
                        <Badge
                          className={`${
                            order.status === 'pending'
                              ? 'bg-amber-500/20 text-amber-500'
                              : order.status === 'processing'
                              ? 'bg-blue-500/20 text-blue-500'
                              : order.status === 'ready'
                              ? 'bg-green-500/20 text-green-500'
                              : 'bg-gray-500/20 text-gray-500'
                          }`}
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="border border-border-dark p-3">
                        <Button
                          variant="outline"
                          className="border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-black"
                          onClick={() => handleOrderAction(order.id, 'accept')}
                        >
                          Manage
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View for Pending Orders */}
            <div className="md:hidden space-y-4">
              {getFilteredOrders('pending').map((order) => (
                <Card key={order.id} className="bg-surface border border-border-dark">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="text-white font-bold">#{order.id}</div>
                      <div className="text-gray-400 text-sm">{order.timeAgo}</div>
                    </div>

                    <div className="mb-4 space-y-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="text-gray-300 text-sm">
                          {item.quantity}x {item.name}
                        </div>
                      ))}
                      <div className="text-gray-300 text-sm">Customer: {order.customer}</div>
                      <div className="text-gray-300 text-sm">Total: ${order.total.toFixed(2)} (Paid)</div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 bg-amber-900/20 flex flex-col space-y-2">
                    <Button
                      className="w-full bg-amber-500 text-black hover:bg-amber-600"
                      onClick={() => handleOrderAction(order.id, 'accept')}
                    >
                      Accept Order
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Processing Orders Tab */}
          <TabsContent value="processing" className="mt-6">
            <div className="hidden md:block">
              <table className="w-full border-collapse border border-border-dark rounded-lg overflow-hidden">
                <thead className="bg-surface">
                  <tr>
                    <th className="border border-border-dark p-3 text-left text-white">Order ID</th>
                    <th className="border border-border-dark p-3 text-left text-white">Date</th>
                    <th className="border border-border-dark p-3 text-left text-white">Customer</th>
                    <th className="border border-border-dark p-3 text-left text-white">Items</th>
                    <th className="border border-border-dark p-3 text-left text-white">Total</th>
                    <th className="border border-border-dark p-3 text-left text-white">Status</th>
                    <th className="border border-border-dark p-3 text-left text-white">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {getFilteredOrders('processing').map((order) => (
                    <tr key={order.id} className="border border-border-dark hover:bg-surface/50">
                      <td className="border border-border-dark p-3 text-white">#{order.id}</td>
                      <td className="border border-border-dark p-3 text-white">{formatDate(order.date)}</td>
                      <td className="border border-border-dark p-3 text-white">{order.customer}</td>
                      <td className="border border-border-dark p-3 text-white">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="text-gray-300">
                            {item.quantity}x {item.name}
                          </div>
                        ))}
                      </td>
                      <td className="border border-border-dark p-3 text-white">${order.total.toFixed(2)}</td>
                      <td className="border border-border-dark p-3">
                        <Badge
                          className={`${
                            order.status === 'pending'
                              ? 'bg-amber-500/20 text-amber-500'
                              : order.status === 'processing'
                              ? 'bg-blue-500/20 text-blue-500'
                              : order.status === 'ready'
                              ? 'bg-green-500/20 text-green-500'
                              : 'bg-gray-500/20 text-gray-500'
                          }`}
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="border border-border-dark p-3">
                        <Button
                          variant="outline"
                          className="border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-black"
                          onClick={() => handleOrderAction(order.id, 'manage')}
                        >
                          Manage
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View for Processing Orders */}
            <div className="md:hidden space-y-4">
              {getFilteredOrders('processing').map((order) => (
                <Card key={order.id} className="bg-surface border border-border-dark">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="text-white font-bold">#{order.id}</div>
                      <div className="text-gray-400 text-sm">{order.timeAgo}</div>
                    </div>

                    <div className="mb-4 space-y-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="text-gray-300 text-sm">
                          {item.quantity}x {item.name}
                        </div>
                      ))}
                      <div className="text-gray-300 text-sm">Customer: {order.customer}</div>
                      <div className="text-gray-300 text-sm">Total: ${order.total.toFixed(2)} (Paid)</div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 bg-zinc-900/20 flex flex-col space-y-2">
                    <Button
                      className="w-full bg-zinc-600 text-white hover:bg-zinc-700"
                      onClick={() => handleOrderAction(order.id, 'print-label')}
                    >
                      Print Label
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Ready for Pickup Orders Tab */}
          <TabsContent value="ready" className="mt-6">
            <div className="hidden md:block">
              <table className="w-full border-collapse border border-border-dark rounded-lg overflow-hidden">
                <thead className="bg-surface">
                  <tr>
                    <th className="border border-border-dark p-3 text-left text-white">Order ID</th>
                    <th className="border border-border-dark p-3 text-left text-white">Date</th>
                    <th className="border border-border-dark p-3 text-left text-white">Customer</th>
                    <th className="border border-border-dark p-3 text-left text-white">Items</th>
                    <th className="border border-border-dark p-3 text-left text-white">Total</th>
                    <th className="border border-border-dark p-3 text-left text-white">Status</th>
                    <th className="border border-border-dark p-3 text-left text-white">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {getFilteredOrders('ready').map((order) => (
                    <tr key={order.id} className="border border-border-dark hover:bg-surface/50">
                      <td className="border border-border-dark p-3 text-white">#{order.id}</td>
                      <td className="border border-border-dark p-3 text-white">{formatDate(order.date)}</td>
                      <td className="border border-border-dark p-3 text-white">{order.customer}</td>
                      <td className="border border-border-dark p-3 text-white">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="text-gray-300">
                            {item.quantity}x {item.name}
                          </div>
                        ))}
                      </td>
                      <td className="border border-border-dark p-3 text-white">${order.total.toFixed(2)}</td>
                      <td className="border border-border-dark p-3">
                        <Badge
                          className={`${
                            order.status === 'pending'
                              ? 'bg-amber-500/20 text-amber-500'
                              : order.status === 'processing'
                              ? 'bg-blue-500/20 text-blue-500'
                              : order.status === 'ready'
                              ? 'bg-green-500/20 text-green-500'
                              : 'bg-gray-500/20 text-gray-500'
                          }`}
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="border border-border-dark p-3">
                        <Button
                          variant="outline"
                          className="border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-black"
                          onClick={() => handleOrderAction(order.id, 'manage')}
                        >
                          Manage
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View for Ready Orders */}
            <div className="md:hidden space-y-4">
              {getFilteredOrders('ready').map((order) => (
                <Card key={order.id} className="bg-surface border border-border-dark">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="text-white font-bold">#{order.id}</div>
                      <div className="text-gray-400 text-sm">{order.timeAgo}</div>
                    </div>

                    <div className="mb-4 space-y-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="text-gray-300 text-sm">
                          {item.quantity}x {item.name}
                        </div>
                      ))}
                      <div className="text-gray-300 text-sm">Customer: {order.customer}</div>
                      <div className="text-gray-300 text-sm">Total: ${order.total.toFixed(2)} (Paid)</div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 bg-green-900/20 flex flex-col space-y-2">
                    <Button
                      className="w-full bg-green-600 text-white hover:bg-green-700"
                      onClick={() => handleOrderAction(order.id, 'ready-pickup')}
                    >
                      Ready for Pickup
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Completed Orders Tab */}
          <TabsContent value="completed" className="mt-6">
            <div className="hidden md:block">
              <table className="w-full border-collapse border border-border-dark rounded-lg overflow-hidden">
                <thead className="bg-surface">
                  <tr>
                    <th className="border border-border-dark p-3 text-left text-white">Order ID</th>
                    <th className="border border-border-dark p-3 text-left text-white">Date</th>
                    <th className="border border-border-dark p-3 text-left text-white">Customer</th>
                    <th className="border border-border-dark p-3 text-left text-white">Items</th>
                    <th className="border border-border-dark p-3 text-left text-white">Total</th>
                    <th className="border border-border-dark p-3 text-left text-white">Status</th>
                    <th className="border border-border-dark p-3 text-left text-white">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {getFilteredOrders('completed').map((order) => (
                    <tr key={order.id} className="border border-border-dark hover:bg-surface/50">
                      <td className="border border-border-dark p-3 text-white">#{order.id}</td>
                      <td className="border border-border-dark p-3 text-white">{formatDate(order.date)}</td>
                      <td className="border border-border-dark p-3 text-white">{order.customer}</td>
                      <td className="border border-border-dark p-3 text-white">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="text-gray-300">
                            {item.quantity}x {item.name}
                          </div>
                        ))}
                      </td>
                      <td className="border border-border-dark p-3 text-white">${order.total.toFixed(2)}</td>
                      <td className="border border-border-dark p-3">
                        <Badge
                          className={`${
                            order.status === 'pending'
                              ? 'bg-amber-500/20 text-amber-500'
                              : order.status === 'processing'
                              ? 'bg-blue-500/20 text-blue-500'
                              : order.status === 'ready'
                              ? 'bg-green-500/20 text-green-500'
                              : 'bg-gray-500/20 text-gray-500'
                          }`}
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="border border-border-dark p-3">
                        <Button
                          variant="outline"
                          className="border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-black"
                          onClick={() => handleOrderAction(order.id, 'view')}
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View for Completed Orders */}
            <div className="md:hidden space-y-4">
              {getFilteredOrders('completed').map((order) => (
                <Card key={order.id} className="bg-surface border border-border-dark">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="text-white font-bold">#{order.id}</div>
                      <div className="text-gray-400 text-sm">{order.timeAgo}</div>
                    </div>

                    <div className="mb-4 space-y-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="text-gray-300 text-sm">
                          {item.quantity}x {item.name}
                        </div>
                      ))}
                      <div className="text-gray-300 text-sm">Customer: {order.customer}</div>
                      <div className="text-gray-300 text-sm">Total: ${order.total.toFixed(2)} (Paid)</div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 bg-gray-900/20 flex flex-col space-y-2">
                    <Button
                      variant="outline"
                      className="w-full border-gray-500 text-gray-500 hover:bg-gray-500 hover:text-white"
                      onClick={() => handleOrderAction(order.id, 'view')}
                    >
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default OrderManagementPage;