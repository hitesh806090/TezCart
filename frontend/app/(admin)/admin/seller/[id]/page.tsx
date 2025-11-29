"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle, XCircle, Mail, Phone, MapPin, Building2, Calendar, Star } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function AdminSellerDetailPage() {
  const params = useParams();
  const id = params.id as string;

  // Mock data based on ID (in a real app, fetch this)
  const seller = {
    id: id,
    name: "Electronics Hub",
    email: "contact@electronicshub.com",
    phone: "+1 (555) 123-4567",
    businessName: "ElectroHub LLC",
    businessAddress: "123 Tech Park, Silicon Valley, CA 94025",
    registrationDate: "2024-01-15",
    status: "Pending", // Pending, Approved, Rejected
    taxId: "US-123-456-789",
    documents: [
      { name: "Business License", status: "Verified" },
      { name: "Tax Certificate", status: "Pending Review" },
      { name: "ID Proof", status: "Verified" },
    ],
    stats: {
      totalProducts: 45,
      totalOrders: 120,
      totalRevenue: "$12,450.00",
      rating: 4.8,
    }
  };

  const [status, setStatus] = React.useState(seller.status);

  const handleApprove = () => {
    setStatus("Approved");
    // API call would go here
  };

  const handleReject = () => {
    setStatus("Rejected");
    // API call would go here
  };

  return (
    <div className="min-h-screen bg-obsidian p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="outline" size="icon" className="h-10 w-10 border-white/10 hover:bg-white/5">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">{seller.businessName}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-zinc-400 text-sm">Seller ID: #{seller.id}</span>
                <Badge variant={
                  status === "Approved" ? "default" : 
                  status === "Pending" ? "secondary" : "destructive"
                } className={
                  status === "Approved" ? "bg-green-500/10 text-green-500 hover:bg-green-500/20" : 
                  status === "Pending" ? "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20" : 
                  "bg-red-500/10 text-red-500 hover:bg-red-500/20"
                }>
                  {status}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            {status === "Pending" && (
              <>
                <Button 
                  onClick={handleReject}
                  variant="destructive" 
                  className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject Application
                </Button>
                <Button 
                  onClick={handleApprove}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve Seller
                </Button>
              </>
            )}
            {status === "Approved" && (
               <Button variant="outline" className="border-white/10 hover:bg-white/5 text-white">
                 Suspend Account
               </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Left Column: Details */}
          <div className="md:col-span-2 space-y-6">
            <Card className="bg-surface border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Business Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-zinc-500 uppercase tracking-wider font-medium">Contact Person</label>
                    <div className="text-white flex items-center gap-2">
                       {seller.name}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-zinc-500 uppercase tracking-wider font-medium">Email Address</label>
                    <div className="text-white flex items-center gap-2">
                       <Mail className="w-4 h-4 text-gold" />
                       <a href={`mailto:${seller.email}`} className="hover:text-gold transition-colors">{seller.email}</a>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-zinc-500 uppercase tracking-wider font-medium">Phone Number</label>
                    <div className="text-white flex items-center gap-2">
                       <Phone className="w-4 h-4 text-gold" />
                       {seller.phone}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-zinc-500 uppercase tracking-wider font-medium">Joined Date</label>
                    <div className="text-white flex items-center gap-2">
                       <Calendar className="w-4 h-4 text-gold" />
                       {seller.registrationDate}
                    </div>
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-xs text-zinc-500 uppercase tracking-wider font-medium">Business Address</label>
                    <div className="text-white flex items-center gap-2">
                       <MapPin className="w-4 h-4 text-gold shrink-0" />
                       {seller.businessAddress}
                    </div>
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-xs text-zinc-500 uppercase tracking-wider font-medium">Tax ID / EIN</label>
                    <div className="text-white flex items-center gap-2">
                       <Building2 className="w-4 h-4 text-gold shrink-0" />
                       {seller.taxId}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-surface border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Documents</CardTitle>
                <CardDescription className="text-zinc-400">KYC and business verification documents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {seller.documents.map((doc, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-white font-medium">{doc.name}</div>
                          <div className="text-xs text-zinc-400">PDF • 2.4 MB</div>
                        </div>
                      </div>
                      <Badge variant="outline" className={
                        doc.status === "Verified" ? "border-green-500/30 text-green-500" : "border-yellow-500/30 text-yellow-500"
                      }>
                        {doc.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Stats & Quick Actions */}
          <div className="space-y-6">
             <Card className="bg-surface border-white/10">
                <CardHeader>
                   <CardTitle className="text-white text-lg">Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                   <div className="flex justify-between items-center pb-4 border-b border-white/5">
                      <span className="text-zinc-400">Total Orders</span>
                      <span className="text-white font-mono font-bold">{seller.stats.totalOrders}</span>
                   </div>
                   <div className="flex justify-between items-center pb-4 border-b border-white/5">
                      <span className="text-zinc-400">Total Revenue</span>
                      <span className="text-white font-mono font-bold">{seller.stats.totalRevenue}</span>
                   </div>
                   <div className="flex justify-between items-center pb-4 border-b border-white/5">
                      <span className="text-zinc-400">Product Count</span>
                      <span className="text-white font-mono font-bold">{seller.stats.totalProducts}</span>
                   </div>
                   <div className="flex justify-between items-center">
                      <span className="text-zinc-400">Rating</span>
                      <div className="flex items-center text-amber-400 gap-1">
                        <span className="font-bold text-white">{seller.stats.rating}</span>
                        <Star className="w-4 h-4 fill-current" />
                      </div>
                   </div>
                </CardContent>
             </Card>

             <Card className="bg-surface border-white/10">
                <CardHeader>
                   <CardTitle className="text-white text-lg">Admin Notes</CardTitle>
                </CardHeader>
                <CardContent>
                   <textarea 
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-md p-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-gold min-h-[120px]"
                      placeholder="Add internal notes about this seller..."
                   />
                   <Button className="w-full mt-4 bg-zinc-800 hover:bg-zinc-700 text-white">
                      Save Note
                   </Button>
                </CardContent>
             </Card>
          </div>

        </div>
      </div>
    </div>
  );
}