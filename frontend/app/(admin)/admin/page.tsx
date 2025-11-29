import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

export default function AdminPage() {
  // Sample data for stats and seller registrations
  const stats = [
    { title: "Pending KYC", value: 12, color: "text-red-500" },
    { title: "Total GMV", value: "$124,567", color: "text-gold" },
  ];

  const sellerRegistrations = [
    { id: 1, name: "Electronics Hub", email: "contact@electronicshub.com", date: "2024-01-15", status: "Pending" },
    { id: 2, name: "Fashion Forward", email: "info@fashionforward.com", date: "2024-01-14", status: "Approved" },
    { id: 3, name: "Home Essentials", email: "support@homeessentials.com", date: "2024-01-13", status: "Pending" },
    { id: 4, name: "Gourmet Delights", email: "orders@gourmetdelights.com", date: "2024-01-12", status: "Rejected" },
  ];

  return (
    <div className="p-6 bg-obsidian min-h-screen">
      <h1 className="text-2xl font-bold text-white mb-6">Admin Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-surface border border-border-dark">
            <CardHeader>
              <CardTitle className={stat.color}>{stat.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Seller Registrations Table - Desktop/Tablet View */}
      <div className="hidden md:block">
        <Card className="bg-surface border border-border-dark">
          <CardHeader>
            <CardTitle className="text-white">Recent Seller Registrations</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-white">Seller</TableHead>
                  <TableHead className="text-white">Email</TableHead>
                  <TableHead className="text-white">Date</TableHead>
                  <TableHead className="text-white">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sellerRegistrations.map((registration) => (
                  <TableRow key={registration.id}>
                    <TableCell className="text-white">{registration.name}</TableCell>
                    <TableCell className="text-zinc-300">{registration.email}</TableCell>
                    <TableCell className="text-zinc-300">{registration.date}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        registration.status === "Approved"
                          ? "bg-green-900/30 text-green-400"
                          : registration.status === "Pending"
                            ? "bg-yellow-900/30 text-yellow-400"
                            : "bg-red-900/30 text-red-400"
                      }`}>
                        {registration.status}
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
            <CardTitle className="text-white">Recent Seller Registrations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sellerRegistrations.map((registration) => (
                <Card key={registration.id} className="bg-zinc-900 border border-zinc-800 overflow-hidden">
                  <div className="p-4">
                    {/* Top Row: Avatar + Title + Status */}
                    <div className="flex items-start gap-3 mb-3">
                      <div className="bg-zinc-800 border-2 border-dashed rounded-xl w-10 h-10 flex items-center justify-center flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-white truncate">{registration.name}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs flex-shrink-0 ${
                            registration.status === "Approved"
                              ? "bg-green-900/30 text-green-400"
                              : registration.status === "Pending"
                                ? "bg-yellow-900/30 text-yellow-400"
                                : "bg-red-900/30 text-red-400"
                          }`}>
                            {registration.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Middle Row: Details Grid */}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div>
                        <p className="text-xs text-zinc-400">Email</p>
                        <p className="text-sm text-zinc-300 truncate">{registration.email}</p>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-400">Date</p>
                        <p className="text-sm text-zinc-300">{registration.date}</p>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Row (Footer): Action Buttons */}
                  <div className="border-t border-zinc-800 grid grid-cols-2">
                    <button className="w-full rounded-none h-12 bg-gold hover:bg-gold-dim text-obsidian">
                      {registration.status === "Pending" ? "Approve" : "View"}
                    </button>
                    {registration.status === "Pending" && (
                      <button className="w-full rounded-none h-12 bg-red-600 hover:bg-red-700 text-white border-l border-zinc-800">
                        Reject
                      </button>
                    )}
                    {registration.status !== "Pending" && (
                      <div className="w-full rounded-none h-12 border-l border-zinc-800"></div>
                    )}
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