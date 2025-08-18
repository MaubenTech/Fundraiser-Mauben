import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Heart, Users, Target, Zap, Play, ArrowRight } from "lucide-react"
import DonationForm from "@/components/donation-form"
import DonorWall from "@/components/donor-wall"
import AnimatedCounter from "@/components/animated-counter"
import TestimonialsCarousel from "@/components/testimonials-carousel"
import CampaignUpdates from "@/components/campaign-updates"
import ScrollAnimation from "@/components/scroll-animations"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-primary animate-pulse" />
              <span className="text-xl font-serif font-bold text-foreground">TechForGood</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-foreground hover:text-primary transition-colors">
                Home
              </a>
              <a href="#about" className="text-foreground hover:text-primary transition-colors">
                About
              </a>
              <a href="#impact" className="text-foreground hover:text-primary transition-colors">
                Impact
              </a>
              <a href="#contact" className="text-foreground hover:text-primary transition-colors">
                Contact
              </a>
            </div>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold hover:scale-105 transition-transform">
              Donate Now
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="home"
        className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10 py-20 lg:py-32"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <ScrollAnimation animation="fadeInUp">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-black text-foreground mb-6 leading-tight">
                Together, We Can Transform Lives with Tech
              </h1>
            </ScrollAnimation>

            <ScrollAnimation animation="fadeInUp" delay={200}>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                Empowering communities through technology education and digital literacy programs. Every donation
                creates opportunities for a brighter future.
              </p>
            </ScrollAnimation>

            {/* CTA Buttons */}
            <ScrollAnimation animation="fadeInUp" delay={400}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-4 text-lg hover:scale-105 transition-transform animate-pulse-glow"
                >
                  <Heart className="mr-2 h-5 w-5" />
                  Donate Now
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold px-8 py-4 text-lg bg-transparent hover:scale-105 transition-transform"
                >
                  <ArrowRight className="mr-2 h-5 w-5" />
                  Learn More
                </Button>
              </div>
            </ScrollAnimation>

            {/* Live Fundraising Counter */}
            <ScrollAnimation animation="scaleIn" delay={600}>
              <div className="bg-card/80 backdrop-blur rounded-2xl p-8 max-w-2xl mx-auto border border-border shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="text-center">
                    <AnimatedCounter
                      end={2847500}
                      prefix="₦"
                      className="text-3xl font-serif font-bold text-primary mb-2"
                    />
                    <div className="text-sm text-muted-foreground">Raised</div>
                  </div>
                  <div className="text-center">
                    <AnimatedCounter
                      end={5000000}
                      prefix="₦"
                      className="text-3xl font-serif font-bold text-accent mb-2"
                    />
                    <div className="text-sm text-muted-foreground">Goal</div>
                  </div>
                  <div className="text-center">
                    <AnimatedCounter end={1247} className="text-3xl font-serif font-bold text-foreground mb-2" />
                    <div className="text-sm text-muted-foreground">Donors</div>
                  </div>
                </div>
                <Progress value={57} className="h-3 mb-4" />
                <p className="text-sm text-muted-foreground">57% of goal reached</p>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* Impact Highlights */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <ScrollAnimation animation="fadeInUp">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">Your Impact in Action</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                See how your donations are creating real change in communities around the world
              </p>
            </div>
          </ScrollAnimation>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Users, count: 2500, label: "Students Trained", suffix: "+" },
              { icon: Target, count: 45, label: "Communities Reached" },
              { icon: Zap, count: 89, label: "Job Placement Rate", suffix: "%" },
              { icon: Heart, count: 15, label: "Lives Impacted", prefix: "₦", suffix: "M+" },
            ].map((item, index) => (
              <ScrollAnimation key={index} animation="fadeInUp" delay={index * 100}>
                <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border bg-card">
                  <CardContent className="p-6 text-center">
                    <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors animate-float">
                      <item.icon className="h-8 w-8 text-primary" />
                    </div>
                    <AnimatedCounter
                      end={item.count}
                      prefix={item.prefix}
                      suffix={item.suffix}
                      className="text-2xl font-serif font-bold text-foreground mb-2"
                    />
                    <p className="text-muted-foreground">{item.label}</p>
                  </CardContent>
                </Card>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* Story & Mission Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <ScrollAnimation animation="fadeInLeft">
              <div className="relative">
                <img
                  src="/placeholder.svg?height=500&width=600"
                  alt="Students learning technology"
                  className="rounded-2xl shadow-lg w-full h-[400px] object-cover"
                />
                <Button
                  size="lg"
                  className="absolute inset-0 m-auto w-20 h-20 rounded-full bg-primary/90 hover:bg-primary text-primary-foreground shadow-lg hover:scale-110 transition-transform"
                >
                  <Play className="h-8 w-8 ml-1" />
                </Button>
              </div>
            </ScrollAnimation>

            <ScrollAnimation animation="fadeInRight">
              <div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-6">
                  Breaking Barriers Through Technology
                </h2>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  In underserved communities across Nigeria, talented young minds lack access to quality technology
                  education. Our mission is to bridge this digital divide by providing comprehensive coding bootcamps,
                  digital literacy programs, and career mentorship.
                </p>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  Every donation directly funds laptops, internet access, instructor salaries, and job placement
                  programs that transform lives and build stronger communities.
                </p>
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold hover:scale-105 transition-transform">
                  Watch Our Story
                </Button>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <ScrollAnimation animation="fadeInUp">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">Success Stories</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Hear from the lives we've transformed through technology education
              </p>
            </div>
          </ScrollAnimation>

          <ScrollAnimation animation="scaleIn" delay={200}>
            <TestimonialsCarousel />
          </ScrollAnimation>
        </div>
      </section>

      {/* Campaign Updates */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <ScrollAnimation animation="fadeInUp">
            <CampaignUpdates />
          </ScrollAnimation>
        </div>
      </section>

      <section id="donate" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <ScrollAnimation animation="fadeInUp">
            <DonationForm />
          </ScrollAnimation>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <ScrollAnimation animation="fadeInUp">
            <DonorWall />
          </ScrollAnimation>
        </div>
      </section>
    </div>
  )
}
