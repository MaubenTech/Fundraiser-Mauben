"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Sparkles } from "lucide-react"

interface Donor {
  id: string
  name: string
  amount: number
  timestamp: Date
  badge: string
  isAnonymous: boolean
}

// Mock donor data - in real app this would come from API
const mockDonors: Donor[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    amount: 25000,
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    badge: "Innovation Catalyst",
    isAnonymous: false,
  },
  {
    id: "2",
    name: "Anonymous",
    amount: 10000,
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    badge: "Dream Builder",
    isAnonymous: true,
  },
  {
    id: "3",
    name: "Michael Chen",
    amount: 50000,
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    badge: "Future Architect",
    isAnonymous: false,
  },
  {
    id: "4",
    name: "Anonymous",
    amount: 5000,
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    badge: "Spark Starter",
    isAnonymous: true,
  },
  {
    id: "5",
    name: "Emily Rodriguez",
    amount: 15000,
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    badge: "Dream Builder",
    isAnonymous: false,
  },
  {
    id: "6",
    name: "David Kim",
    amount: 25000,
    timestamp: new Date(Date.now() - 1000 * 60 * 90),
    badge: "Innovation Catalyst",
    isAnonymous: false,
  },
]

export default function DonorWall() {
  const [donors, setDonors] = useState<Donor[]>(mockDonors)
  const [newDonation, setNewDonation] = useState<string | null>(null)

  // Simulate new donations
  useEffect(() => {
    const interval = setInterval(() => {
      const newDonor: Donor = {
        id: Date.now().toString(),
        name:
          Math.random() > 0.5
            ? "Anonymous"
            : ["Alex Thompson", "Maria Garcia", "James Wilson", "Lisa Park"][Math.floor(Math.random() * 4)],
        amount: [5000, 10000, 25000][Math.floor(Math.random() * 3)],
        timestamp: new Date(),
        badge: ["Spark Starter", "Dream Builder", "Innovation Catalyst"][Math.floor(Math.random() * 3)],
        isAnonymous: Math.random() > 0.6,
      }

      setDonors((prev) => [newDonor, ...prev.slice(0, 19)]) // Keep only latest 20
      setNewDonation(newDonor.id)

      // Remove animation after 3 seconds
      setTimeout(() => setNewDonation(null), 3000)
    }, 15000) // New donation every 15 seconds

    return () => clearInterval(interval)
  }, [])

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

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">Our Amazing Donors</h2>
        <p className="text-lg text-muted-foreground">Join our community of changemakers making a real difference</p>
      </div>

      <Card className="border-border bg-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-serif font-bold text-foreground">Recent Donations</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Live updates
            </div>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {donors.map((donor) => (
              <div
                key={donor.id}
                className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-500 ${
                  newDonation === donor.id
                    ? "bg-primary/5 border-primary/30 animate-pulse"
                    : "bg-muted/30 border-border hover:bg-muted/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Heart className="h-5 w-5 text-primary" />
                    </div>
                    {newDonation === donor.id && (
                      <div className="absolute -top-1 -right-1">
                        <Sparkles className="h-4 w-4 text-accent animate-bounce" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">
                        {donor.isAnonymous ? "Anonymous Donor" : donor.name}
                      </span>
                      <Badge className={getBadgeColor(donor.badge)}>{donor.badge}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">{formatTimeAgo(donor.timestamp)}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-primary">₦{donor.amount.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              Want to see your name here?{" "}
              <span className="text-primary font-semibold cursor-pointer hover:underline">Make a donation today!</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
