"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, UserPlus, Mail, MoreHorizontal } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  role: "donor" | "admin" | "volunteer"
  totalDonated: number
  lastActive: string
  status: "active" | "inactive"
  joinDate: string
}

const mockUsers: User[] = [
  {
    id: "USR-001",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    role: "donor",
    totalDonated: 75000,
    lastActive: "2024-01-15",
    status: "active",
    joinDate: "2023-08-15",
  },
  {
    id: "USR-002",
    name: "Michael Chen",
    email: "michael@example.com",
    role: "donor",
    totalDonated: 150000,
    lastActive: "2024-01-14",
    status: "active",
    joinDate: "2023-06-20",
  },
  {
    id: "USR-003",
    name: "Admin User",
    email: "admin@techforgood.org",
    role: "admin",
    totalDonated: 0,
    lastActive: "2024-01-15",
    status: "active",
    joinDate: "2023-01-01",
  },
  {
    id: "USR-004",
    name: "Emily Rodriguez",
    email: "emily@example.com",
    role: "volunteer",
    totalDonated: 25000,
    lastActive: "2024-01-10",
    status: "active",
    joinDate: "2023-09-10",
  },
  {
    id: "USR-005",
    name: "David Kim",
    email: "david@example.com",
    role: "donor",
    totalDonated: 5000,
    lastActive: "2023-12-20",
    status: "inactive",
    joinDate: "2023-11-05",
  },
]

export default function UserManagement() {
  const [users] = useState<User[]>(mockUsers)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 border-red-200"
      case "volunteer":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "donor":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "inactive":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-foreground">1,247</div>
            <p className="text-sm text-muted-foreground">Total Users</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-foreground">1,189</div>
            <p className="text-sm text-muted-foreground">Active Donors</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-foreground">45</div>
            <p className="text-sm text-muted-foreground">Volunteers</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-foreground">3</div>
            <p className="text-sm text-muted-foreground">Administrators</p>
          </CardContent>
        </Card>
      </div>

      {/* User Management */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button className="flex items-center gap-2 bg-primary hover:bg-primary/90">
              <UserPlus className="h-4 w-4" />
              Add User
            </Button>
          </div>

          {/* Users Table */}
          <div className="rounded-md border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Total Donated</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <div className="font-semibold text-foreground">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getRoleColor(user.role)} variant="outline">
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold text-foreground">
                      {user.totalDonated > 0 ? `₦${user.totalDonated.toLocaleString()}` : "-"}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(user.status)} variant="outline">
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(user.lastActive).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(user.joinDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Mail className="h-4 w-4" />
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

          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">No users found matching your criteria.</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
