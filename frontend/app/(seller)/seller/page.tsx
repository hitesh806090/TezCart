"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

export default function SellerPage() {
  // Sample inventory data
  const inventory = [
    { id: 1, name: "Premium Headphones", category: "Electronics", stock: 25, price: 299.99, status: "In Stock" },
    { id: 2, name: "Wireless Keyboard", category: "Electronics", stock: 0, price: 129.99, status: "Out of Stock" },
    { id: 3, name: "Ergonomic Mouse", category: "Electronics", stock: 42, price: 79.99, status: "In Stock" },
    { id: 4, name: "Laptop Stand", category: "Accessories", stock: 18, price: 89.99, status: "In Stock" },
    { id: 5, name: "USB-C Hub", category: "Electronics", stock: 12, price: 59.99, status: "Low Stock" },
  ];

  return (
    <div className="p-6 bg-obsidian min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Seller Dashboard</h1>
        <Link href="/seller/add-product">
          <Button className="bg-gold text-obsidian hover:bg-gold-dim">
            Add New Product
          </Button>
        </Link>
      </div>
      
      {/* Inventory Table - Desktop/Tablet View */}
      <div className="hidden md:block">
        <Card className="bg-surface border border-border-dark">
          <CardHeader>
            <CardTitle className="text-white">Inventory Management</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-white">Product</TableHead>
                  <TableHead className="text-white">Category</TableHead>
                  <TableHead className="text-white">Stock</TableHead>
                  <TableHead className="text-white">Price</TableHead>
                  <TableHead className="text-white">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="text-white">{item.name}</TableCell>
                    <TableCell className="text-zinc-300">{item.category}</TableCell>
                    <TableCell className="text-zinc-300">{item.stock}</TableCell>
                    <TableCell className="text-gold">${item.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        item.status === "In Stock"
                          ? "bg-green-900/30 text-green-400"
                          : item.status === "Low Stock"
                            ? "bg-yellow-900/30 text-yellow-400"
                            : "bg-red-900/30 text-red-400"
                      }`}>
                        {item.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden">
        <Card className="bg-surface border border-border-dark">
          <CardHeader>
            <CardTitle className="text-white">Inventory Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {inventory.map((item) => (
                <Card key={item.id} className="bg-zinc-900 border border-zinc-800 overflow-hidden">
                  <div className="p-4">
                    {/* Top Row: Avatar + Title + Status */}
                    <div className="flex items-start gap-3 mb-3">
                      <div className="bg-zinc-800 border-2 border-dashed rounded-xl w-10 h-10 flex items-center justify-center flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-white truncate">{item.name}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs flex-shrink-0 ${
                            item.status === "In Stock"
                              ? "bg-green-900/30 text-green-400"
                              : item.status === "Low Stock"
                                ? "bg-yellow-900/30 text-yellow-400"
                                : "bg-red-900/30 text-red-400"
                          }`}>
                            {item.status}
                          </span>
                        </div>
                        <p className="text-sm text-zinc-400 truncate">{item.category}</p>
                      </div>
                    </div>

                    {/* Middle Row: Details Grid */}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div>
                        <p className="text-xs text-zinc-400">Stock</p>
                        <p className="text-sm text-white">{item.stock}</p>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-400">Price</p>
                        <p className="text-sm text-gold">${item.price.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Row (Footer): Action Buttons */}
                  <div className="border-t border-zinc-800 grid grid-cols-2">
                    <button className="w-full rounded-none h-12 bg-gold hover:bg-gold-dim text-obsidian border-r border-zinc-800">
                      Edit
                    </button>
                    <button className="w-full rounded-none h-12 bg-surface hover:bg-zinc-700 text-white">
                      View
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}