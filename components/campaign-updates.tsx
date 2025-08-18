"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, Trophy } from "lucide-react"

interface Update {
  id: string
  title: string
  description: string
  date: string
  type: "milestone" | "event" | "achievement"
  image: string
  stats?: {
    participants?: number
    location?: string
    impact?: string
  }
}

const updates: Update[] = [
  {
    id: "1",
    title: "New Coding Bootcamp Launched in Lagos",
    description:
      "We've successfully launched our 5th coding bootcamp location, bringing quality tech education to even more communities.",
    date: "2024-01-15",
    type: "milestone",
    image: "/placeholder.svg?height=200&width=300",
    stats: {
      participants: 50,
      location: "Lagos, Nigeria",
    },
  },
  {
    id: "2",
    title: "100 Students Graduated This Quarter",
    description:
      "Celebrating another successful graduation ceremony with 100 new tech professionals ready to change the world.",
    date: "2024-01-10",
    type: "achievement",
    image: "/placeholder.svg?height=200&width=300",
    stats: {
      impact: "89% job placement rate",
    },
  },
  {
    id: "3",
    title: "Partnership with Tech Giants",
    description:
      "Exciting new partnerships with leading tech companies to provide internships and job opportunities for our graduates.",
    date: "2024-01-05",
    type: "milestone",
    image: "/placeholder.svg?height=200&width=300",
    stats: {
      impact: "200+ job opportunities",
    },
  },
  {
    id: "4",
    title: "Mobile Learning Lab Deployed",
    description:
      "Our new mobile learning lab is bringing tech education directly to rural communities that lack internet infrastructure.",
    date: "2023-12-28",
    type: "event",
    image: "/placeholder.svg?height=200&width=300",
    stats: {
      participants: 150,
      location: "Rural Communities",
    },
  },
]

export default function CampaignUpdates() {
  const getTypeColor = (type: string) => {
    switch (type) {
      case "milestone":
        return "bg-primary/10 text-primary border-primary/20"
      case "achievement":
        return "bg-accent/10 text-accent border-accent/20"
      case "event":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "milestone":
        return <Trophy className="h-4 w-4" />
      case "achievement":
        return <Users className="h-4 w-4" />
      case "event":
        return <Calendar className="h-4 w-4" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">Campaign Updates</h2>
        <p className="text-lg text-muted-foreground">Stay updated on our latest milestones and achievements</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {updates.map((update, index) => (
          <Card
            key={update.id}
            className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border bg-card overflow-hidden"
            style={{
              animationDelay: `${index * 100}ms`,
            }}
          >
            <div className="relative overflow-hidden">
              <img
                src={update.image || "/placeholder.svg"}
                alt={update.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-4 left-4">
                <Badge className={`${getTypeColor(update.type)} border`}>
                  {getTypeIcon(update.type)}
                  <span className="ml-1 capitalize">{update.type}</span>
                </Badge>
              </div>
            </div>

            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                <Calendar className="h-4 w-4" />
                {new Date(update.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>

              <h3 className="text-xl font-serif font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                {update.title}
              </h3>

              <p className="text-muted-foreground mb-4 leading-relaxed">{update.description}</p>

              {update.stats && (
                <div className="flex flex-wrap gap-4 text-sm">
                  {update.stats.participants && (
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      {update.stats.participants} participants
                    </div>
                  )}
                  {update.stats.location && (
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {update.stats.location}
                    </div>
                  )}
                  {update.stats.impact && (
                    <div className="flex items-center gap-1 text-primary font-semibold">
                      <Trophy className="h-4 w-4" />
                      {update.stats.impact}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
