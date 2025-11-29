"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search, Filter, Eye, MoreHorizontal } from "lucide-react";
import Link from "next/link";

export default function AdminProductsPage() {
  const products = [
    { id: 1, name: "Neural Link Headset Pro", seller: "Electronics Hub", price: 299.99, stock: 45, status: "Active" },
    { id: 2, name: "Quantum Processor i9", seller: "Tech Giants", price: 499.00, stock: 12, status: "Active" },
    { id: 3, name: "Holographic Display 4K", seller: "Future Vision", price: 899.99, stock: 0, status: "Out of Stock" },
    { id: 4, name: "Ergonomic Chair V2", seller: "Office Comfort", price: 249.50, stock: 100, status: "Active" },
    { id: 5, name: "Mechanical Keyboard", seller: "KeyMaster", price: 129.99, stock: 23, status: "Draft" },
  ];

  return (
    <div className="p-6 bg-obsidian min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">All Products</h1>
          <p className="text-zinc-400 text-sm mt-1">Manage products across the platform</p>
        </div>
        <Button className="bg-gold text-obsidian hover:bg-gold-dim font-semibold">
          Export CSV
        </Button>
      </div>

      <Card className="bg-surface border border-border-dark mb-6">
        <CardContent className="p-4 flex gap-4">
           <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
              <Input placeholder="Search products..." className="pl-9 bg-zinc-900 border-zinc-800" />
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
                <TableHead className="text-zinc-400">Product Name</TableHead>
                <TableHead className="text-zinc-400">Seller</TableHead>
                <TableHead className="text-zinc-400">Price</TableHead>
                <TableHead className="text-zinc-400">Stock</TableHead>
                <TableHead className="text-zinc-400">Status</TableHead>
                <TableHead className="text-right text-zinc-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id} className="border-zinc-800 hover:bg-zinc-900/50">
                  <TableCell className="font-medium text-white">{product.name}</TableCell>
                  <TableCell className="text-zinc-300">{product.seller}</TableCell>
                  <TableCell className="text-zinc-300">${product.price.toFixed(2)}</TableCell>
                  <TableCell className="text-zinc-300">{product.stock}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      product.status === "Active" ? "bg-green-900/30 text-green-400" :
                      product.status === "Out of Stock" ? "bg-red-900/30 text-red-400" :
                      "bg-zinc-800 text-zinc-400"
                    }`}>
                      {product.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/product/${product.id}`}>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-white/10">
                           <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-white/10">
                         <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
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
