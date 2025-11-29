'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// Define types
type OrderStatus = 'pending' | 'processing' | 'ready' | 'completed';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  date: string;
  timeAgo: string;
  customer: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  paymentStatus: 'paid' | 'pending' | 'refunded';
}

const OrderManagementPage = () => {
  const [activeTab, setActiveTab] = useState<OrderStatus>('pending');

  // Mock data for orders
  const mockOrders: Order[] = [
    {
      id: 'ORD-123',
      date: '2023-11-15',
      timeAgo: '2 mins ago',
      customer: 'John Doe',
      items: [
        { id: 'item1', name: 'Sony Headphones', quantity: 1, price: 199.99 },
        { id: 'item2', name: 'Phone Case', quantity: 2, price: 29.99 },
      ],
      total: 259.97,
      status: 'pending',
      paymentStatus: 'paid',
    },
    {
      id: 'ORD-124',
      date: '2023-11-15',
      timeAgo: '15 mins ago',
      customer: 'Jane Smith',
      items: [
        { id: 'item3', name: 'Wireless Mouse', quantity: 1, price: 49.99 },
      ],
      total: 49.99,
      status: 'processing',
      paymentStatus: 'paid',
    },
    {
      id: 'ORD-125',
      date: '2023-11-14',
      timeAgo: '2 hours ago',
      customer: 'Bob Johnson',
      items: [
        { id: 'item4', name: 'Laptop Stand', quantity: 1, price: 39.99 },
        { id: 'item5', name: 'USB Cable', quantity: 3, price: 12.99 },
      ],
      total: 78.96,
      status: 'ready',
      paymentStatus: 'paid',
    },
    {
      id: 'ORD-126',
      date: '2023-11-14',
      timeAgo: '5 hours ago',
      customer: 'Alice Williams',
      items: [
        { id: 'item6', name: 'Bluetooth Speaker', quantity: 1, price: 89.99 },
      ],
      total: 89.99,
      status: 'completed',
      paymentStatus: 'paid',
    },
    {
      id: 'ORD-127',
      date: '2023-11-13',
      timeAgo: '1 day ago',
      customer: 'Charlie Brown',
      items: [
        { id: 'item7', name: 'Gaming Keyboard', quantity: 1, price: 129.99 },
        { id: 'item8', name: 'Mouse Pad', quantity: 1, price: 19.99 },
      ],
      total: 149.98,
      status: 'pending',
      paymentStatus: 'paid',
    },
    {
      id: 'ORD-128',
      date: '2023-11-13',
      timeAgo: '1 day ago',
      customer: 'Diana Prince',
      items: [
        { id: 'item9', name: 'Smart Watch', quantity: 1, price: 249.99 },
      ],
      total: 249.99,
      status: 'processing',
      paymentStatus: 'paid',
    },
  ];

  const getOrdersByStatus = (status: OrderStatus) => {
    return mockOrders.filter(order => order.status === status);
  };

  const getStatusLabel = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'processing': return 'Processing';
      case 'ready': return 'Ready for Pickup';
      case 'completed': return 'Completed';
      default: return status;
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'ready': return 'bg-indigo-100 text-indigo-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Order Management</h1>
        <Button variant="ghost" className="mt-4 md:mt-0">
          Export CSV
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as OrderStatus)} className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto mb-8 flex md:grid md:grid-cols-4 min-w-max">
          <TabsTrigger value="pending" className="whitespace-nowrap flex-shrink-0">Pending</TabsTrigger>
          <TabsTrigger value="processing" className="whitespace-nowrap flex-shrink-0">Processing</TabsTrigger>
          <TabsTrigger value="ready" className="whitespace-nowrap flex-shrink-0">Ready for Pickup</TabsTrigger>
          <TabsTrigger value="completed" className="whitespace-nowrap flex-shrink-0">Completed</TabsTrigger>
        </TabsList>

        {/* Tab Content */}
        {(['pending', 'processing', 'ready', 'completed'] as OrderStatus[]).map((status) => (
          <TabsContent key={status} value={status} className="space-y-4">
            {/* Desktop Table View */}
            <div className="hidden md:table w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Items (Summary)</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getOrdersByStatus(status).map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">#{order.id}</TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell>
                        <ul>
                          {order.items.map((item) => (
                            <li key={item.id}>{item.quantity}x {item.name}</li>
                          ))}
                        </ul>
                      </TableCell>
                      <TableCell>${order.total.toFixed(2)}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                          {getStatusLabel(order.status)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost">Manage</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {getOrdersByStatus(status).map((order) => (
                <Card key={order.id} className="overflow-hidden">
                  {/* Card Top: Order ID and Time ago */}
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold">#{order.id}</h3>
                      <span className="text-sm text-gray-500">{order.timeAgo}</span>
                    </div>
                    
                    {/* Card Middle: Items, Customer, Total */}
                    <div className="mt-3 space-y-2">
                      <ul className="text-sm">
                        {order.items.map((item) => (
                          <li key={item.id} className="flex">
                            <span className="w-6">{item.quantity}x</span>
                            <span>{item.name}</span>
                          </li>
                        ))}
                      </ul>
                      <p className="text-sm">Customer: {order.customer}</p>
                      <p className="text-sm">Total: ${order.total.toFixed(2)} ({order.paymentStatus})</p>
                    </div>
                  </CardContent>
                  
                  {/* Card Footer: Action Buttons */}
                  <CardFooter className="p-4 bg-zinc-900 border-t border-zinc-800 flex flex-col space-y-2">
                    {status === 'pending' ? (
                      <Button className="w-full bg-amber-500 hover:bg-amber-600">
                        Accept Order
                      </Button>
                    ) : status === 'processing' ? (
                      <Button variant="outline" className="w-full border-zinc-700 text-white hover:bg-zinc-800">
                        Print Label
                      </Button>
                    ) : (
                      <Button variant="ghost" className="w-full hover:bg-zinc-800">
                        Manage
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default OrderManagementPage;