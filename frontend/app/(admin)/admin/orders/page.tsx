"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search, Filter, Eye } from "lucide-react";

export default function AdminOrdersPage() {
  const orders = [
    { id: "ORD-001", customer: "John Doe", date: "2024-03-10", total: 463.32, status: "Processing", items: 3 },
    { id: "ORD-002", customer: "Sarah Smith", date: "2024-03-09", total: 129.99, status: "Shipped", items: 1 },
    { id: "ORD-003", customer: "Mike Johnson", date: "2024-03-09", total: 89.50, status: "Delivered", items: 2 },
    { id: "ORD-004", customer: "Emily Davis", date: "2024-03-08", total: 1250.00, status: "Cancelled", items: 1 },
    { id: "ORD-005", customer: "Chris Wilson", date: "2024-03-08", total: 34.99, status: "Processing", items: 1 },
  ];

  return (
    <div className="p-6 bg-obsidian min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">All Orders</h1>
          <p className="text-zinc-400 text-sm mt-1">Monitor and manage platform orders</p>
        </div>
        <Button className="bg-gold text-obsidian hover:bg-gold-dim font-semibold">
          Export Report
        </Button>
      </div>

      <Card className="bg-surface border border-border-dark mb-6">
        <CardContent className="p-4 flex gap-4">
           <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
              <Input placeholder="Search orders..." className="pl-9 bg-zinc-900 border-zinc-800" />
           </div>
           <Button variant="outline" className="border-zinc-800 text-zinc-300 hover:text-white">
              <Filter className="w-4 h-4 mr-2" /> Filter
           </Button>
        </CardContent>
      </Card>

      <Card className="bg-surface border border-border-dark">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-800 hover:bg-transparent">
                <TableHead className="text-zinc-400">Order ID</TableHead>
                <TableHead className="text-zinc-400">Customer</TableHead>
                <TableHead className="text-zinc-400">Date</TableHead>
                <TableHead className="text-zinc-400">Total</TableHead>
                <TableHead className="text-zinc-400">Items</TableHead>
                <TableHead className="text-zinc-400">Status</TableHead>
                <TableHead className="text-right text-zinc-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id} className="border-zinc-800 hover:bg-zinc-900/50">
                  <TableCell className="font-mono text-white">{order.id}</TableCell>
                  <TableCell className="text-zinc-300">{order.customer}</TableCell>
                  <TableCell className="text-zinc-300">{order.date}</TableCell>
                  <TableCell className="text-gold font-medium">${order.total.toFixed(2)}</TableCell>
                  <TableCell className="text-zinc-300">{order.items}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === "Delivered" ? "bg-green-900/30 text-green-400" :
                      order.status === "Shipped" ? "bg-blue-900/30 text-blue-400" :
                      order.status === "Processing" ? "bg-yellow-900/30 text-yellow-400" :
                      "bg-red-900/30 text-red-400"
                    }`}>
                      {order.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-white/10">
                       <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
