"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Download, Eye, MoreHorizontal } from "lucide-react"

interface Donation {
  id: string
  donorName: string
  email: string
  amount: number
  type: "one-time" | "monthly"
  status: "completed" | "pending" | "failed"
  date: string
  paymentMethod: string
  badge: string
}

const mockDonations: Donation[] = [
  {
    id: "DON-001",
    donorName: "Sarah Johnson",
    email: "sarah@example.com",
    amount: 25000,
    type: "one-time",
    status: "completed",
    date: "2024-01-15",
    paymentMethod: "Credit Card",
    badge: "Innovation Catalyst",
  },
  {
    id: "DON-002",
    donorName: "Michael Chen",
    email: "michael@example.com",
    amount: 50000,
    type: "monthly",
    status: "completed",
    date: "2024-01-14",
    paymentMethod: "Bank Transfer",
    badge: "Future Architect",
  },
  {
    id: "DON-003",
    donorName: "Anonymous",
    email: "anonymous@donor.com",
    amount: 10000,
    type: "one-time",
    status: "pending",
    date: "2024-01-14",
    paymentMethod: "PayPal",
    badge: "Dream Builder",
  },
  {
    id: "DON-004",
    donorName: "Emily Rodriguez",
    email: "emily@example.com",
    amount: 15000,
    type: "one-time",
    status: "completed",
    date: "2024-01-13",
    paymentMethod: "Credit Card",
    badge: "Dream Builder",
  },
  {
    id: "DON-005",
    donorName: "David Kim",
    email: "david@example.com",
    amount: 5000,
    type: "one-time",
    status: "failed",
    date: "2024-01-13",
    paymentMethod: "Credit Card",
    badge: "Spark Starter",
  },
]

export default function DonationManagement() {
  const [donations] = useState<Donation[]>(mockDonations)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  const filteredDonations = donations.filter((donation) => {
    const matchesSearch =
      donation.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || donation.status === statusFilter
    const matchesType = typeFilter === "all" || donation.type === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "failed":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case "Spark Starter":
        return "bg-yellow-100 text-yellow-800"
      case "Dream Builder":
        return "bg-pink-100 text-pink-800"
      case "Innovation Catalyst":
        return "bg-blue-100 text-blue-800"
      case "Future Architect":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-foreground">₦2,847,500</div>
            <p className="text-sm text-muted-foreground">Total Donations</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-foreground">1,247</div>
            <p className="text-sm text-muted-foreground">Total Donors</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-foreground">₦22,840</div>
            <p className="text-sm text-muted-foreground">Average Donation</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-foreground">156</div>
            <p className="text-sm text-muted-foreground">Monthly Donors</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Donation Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search donations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="one-time">One-time</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>

          {/* Donations Table */}
          <div className="rounded-md border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Donation ID</TableHead>
                  <TableHead>Donor</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Badge</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDonations.map((donation) => (
                  <TableRow key={donation.id}>
                    <TableCell className="font-mono text-sm">{donation.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-semibold text-foreground">{donation.donorName}</div>
                        <div className="text-sm text-muted-foreground">{donation.email}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold text-foreground">₦{donation.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {donation.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(donation.status)} variant="outline">
                        {donation.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getBadgeColor(donation.badge)}>{donation.badge}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(donation.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredDonations.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">No donations found matching your criteria.</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
