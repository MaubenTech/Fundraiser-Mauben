"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"

interface Testimonial {
  id: string
  name: string
  role: string
  content: string
  avatar: string
}

const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Adaora Okafor",
    role: "Software Developer",
    content:
      "The coding bootcamp changed my life completely. From having no tech background to landing my dream job at a fintech company in just 6 months. The mentorship and support were incredible.",
    avatar: "/placeholder.svg?height=60&width=60",
  },
  {
    id: "2",
    name: "Emeka Nwankwo",
    role: "Web Designer",
    content:
      "I never thought I could afford quality tech education. This program not only provided free training but also helped me build a portfolio that got me freelance clients immediately.",
    avatar: "/placeholder.svg?height=60&width=60",
  },
  {
    id: "3",
    name: "Fatima Hassan",
    role: "Data Analyst",
    content:
      "The practical approach to learning and real-world projects prepared me for the job market. I'm now working remotely for an international company and supporting my family.",
    avatar: "/placeholder.svg?height=60&width=60",
  },
  {
    id: "4",
    name: "Chidi Okwu",
    role: "Mobile App Developer",
    content:
      "From street vendor to app developer - this program showed me that with dedication and the right support, anything is possible. My apps now serve thousands of users.",
    avatar: "/placeholder.svg?height=60&width=60",
  },
]

export default function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    setIsAutoPlaying(false)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    setIsAutoPlaying(false)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
  }

  return (
    <div className="relative max-w-4xl mx-auto">
      <div className="overflow-hidden rounded-2xl">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="w-full flex-shrink-0">
              <Card className="border-border bg-card mx-4">
                <CardContent className="p-8 text-center">
                  <Quote className="h-12 w-12 text-primary/30 mx-auto mb-6" />
                  <blockquote className="text-lg text-foreground mb-6 leading-relaxed italic">
                    "{testimonial.content}"
                  </blockquote>
                  <div className="flex items-center justify-center gap-4">
                    <img
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="text-left">
                      <div className="font-semibold text-foreground">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <Button
        variant="outline"
        size="icon"
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-background/80 backdrop-blur border-border hover:bg-background"
        onClick={goToPrevious}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-background/80 backdrop-blur border-border hover:bg-background"
        onClick={goToNext}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-2 mt-6">
        {testimonials.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex ? "bg-primary scale-110" : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
            }`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  )
}
