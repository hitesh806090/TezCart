"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, Wallet, Download } from "lucide-react";

export default function SellerPayoutsPage() {
  const transactions = [
    { id: "TXN-9928", date: "Nov 29, 2025", description: "Payout for Order #ORD-8859", amount: 299.99, type: "credit", status: "Completed" },
    { id: "TXN-9927", date: "Nov 25, 2025", description: "Withdrawal to Bank Account ****8821", amount: 500.00, type: "debit", status: "Completed" },
    { id: "TXN-9926", date: "Nov 24, 2025", description: "Payout for Order #ORD-7723", amount: 129.99, type: "credit", status: "Processing" },
    { id: "TXN-9925", date: "Nov 20, 2025", description: "Commission Fee Adjustment", amount: 15.00, type: "debit", status: "Completed" },
  ];

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 pb-20">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Wallet Header Card */}
        <Card className="bg-gradient-to-br from-primary/20 via-background to-background border-primary/20 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-32 bg-primary/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/3" />
          <CardContent className="p-6 md:p-10 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
               <div>
                  <p className="text-muted-foreground font-medium mb-1 flex items-center gap-2">
                     <Wallet className="w-4 h-4" /> Total Balance
                  </p>
                  <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                     ₹12,450<span className="text-xl md:text-2xl text-muted-foreground font-normal">.00</span>
                  </h1>
                  <p className="text-xs text-emerald-500 mt-2 flex items-center font-medium bg-emerald-500/10 w-fit px-2 py-1 rounded-full">
                     <ArrowUpRight className="w-3 h-3 mr-1" />
                     +12.5% from last month
                  </p>
               </div>
               <Button size="lg" className="w-full md:w-auto bg-foreground text-background hover:bg-foreground/90 font-bold rounded-full px-8">
                  Withdraw Funds
               </Button>
            </div>
          </CardContent>
        </Card>

        {/* Transactions Section */}
        <div>
           <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Transaction History</h2>
              <Button variant="outline" size="sm" className="hidden md:flex">
                 <Download className="w-4 h-4 mr-2" />
                 Export
              </Button>
           </div>

           {/* Desktop Table View */}
           <div className="hidden md:block rounded-xl border border-border overflow-hidden bg-card/50">
              <table className="w-full text-left text-sm">
                 <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
                    <tr>
                       <th className="p-4">Date</th>
                       <th className="p-4">Transaction ID</th>
                       <th className="p-4">Description</th>
                       <th className="p-4">Status</th>
                       <th className="p-4 text-right">Amount</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-border">
                    {transactions.map((txn) => (
                       <tr key={txn.id} className="hover:bg-muted/30 transition-colors">
                          <td className="p-4 text-muted-foreground">{txn.date}</td>
                          <td className="p-4 font-mono text-xs">{txn.id}</td>
                          <td className="p-4 font-medium">{txn.description}</td>
                          <td className="p-4">
                             <Badge variant="outline" className={
                                txn.status === 'Completed' ? 'border-green-500/30 text-green-500' : 'border-amber-500/30 text-amber-500'
                             }>
                                {txn.status}
                             </Badge>
                          </td>
                          <td className={`p-4 text-right font-bold ${txn.type === 'credit' ? 'text-green-500' : 'text-red-500'}`}>
                             {txn.type === 'credit' ? '+' : '-'}₹{txn.amount.toFixed(2)}
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>

           {/* Mobile Card Stack View */}
           <div className="md:hidden space-y-3">
              {transactions.map((txn) => (
                 <Card key={txn.id} className="border-border bg-card/50">
                    <CardContent className="p-4">
                       <div className="flex justify-between items-start mb-2">
                          <span className="text-xs text-muted-foreground">{txn.date}</span>
                          <Badge variant="outline" className={
                             txn.status === 'Completed' ? 'border-green-500/30 text-green-500 text-[10px] px-1.5 py-0' : 'border-amber-500/30 text-amber-500 text-[10px] px-1.5 py-0'
                          }>
                             {txn.status}
                          </Badge>
                       </div>
                       <div className="flex justify-between items-center gap-4">
                          <div className="flex-1">
                             <p className="font-medium text-sm line-clamp-1">{txn.description}</p>
                             <p className="text-xs text-muted-foreground font-mono mt-0.5">{txn.id}</p>
                          </div>
                          <span className={`font-bold ${txn.type === 'credit' ? 'text-green-500' : 'text-red-500'}`}>
                             {txn.type === 'credit' ? '+' : '-'}₹{txn.amount.toFixed(2)}
                          </span>
                       </div>
                    </CardContent>
                 </Card>
              ))}
           </div>
        </div>

      </div>
    </div>
  );
}
