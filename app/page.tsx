"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Target, Zap, ArrowRight } from "lucide-react";
import DonationForm from "@/components/donation-form";
import DonorWall from "@/components/donor-wall";
import AnimatedCounter from "@/components/animated-counter";
import TestimonialsCarousel from "@/components/testimonials-carousel";
import CampaignUpdates from "@/components/campaign-updates";
import ScrollAnimation from "@/components/scroll-animations";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

export default function HomePage() {
	const [stats, setStats] = useState({
		totalRaised: 0,
		totalDonors: 0,
		totalDonations: 0,
		goalAmount: 20000000,
	});
	const [isLoading, setIsLoading] = useState(true);

	const progressPercentage = Math.round((stats.totalRaised / stats.goalAmount) * 100);

	const videoRef = useRef<HTMLVideoElement>(null);

	const fetchStats = async () => {
		try {
			const response = await fetch("/donations/stats");
			if (response.ok) {
				const data = await response.json();
				setStats(data.stats);
			}
		} catch (error) {
			console.error("[v0] Error fetching donation stats:", error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		const video = videoRef.current;
		if (!video) return;

		video.playbackRate = 0.5; // Slow playback

		fetchStats();

		// Poll for updates every 30 seconds
		const interval = setInterval(fetchStats, 30000);

		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		const handleDonationUpdate = () => {
			fetchStats();
		};

		window.addEventListener("donationCompleted", handleDonationUpdate);
		return () => window.removeEventListener("donationCompleted", handleDonationUpdate);
	}, []);

	return (
		<div className="min-h-screen bg-background">
			{/* Navigation */}
			<nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
				<div className="container mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-2">
							<Image src="/donations/maubentech-logo.png" alt="MaubenTech Roots Logo" width={32} height={32} className="h-8 w-8" />
							<span className="text-lg sm:text-xl font-serif font-bold text-foreground">MaubenTech Roots</span>
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
						<Button
							className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold hover:scale-105 transition-transform text-sm sm:text-base px-3 sm:px-4"
							onClick={() => document.getElementById("donate")?.scrollIntoView({ behavior: "smooth" })}>
							Donate Now
						</Button>
					</div>
				</div>
			</nav>

			{/* Hero Section */}
			<section id="home" className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10 py-12 sm:py-20 lg:py-32">
				<video ref={videoRef} autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover z-0">
					<source src="/donations/hero-section-background-joined.mp4" type="video/mp4" />
				</video>

				<div className="absolute inset-0 bg-background/60 z-10"></div>

				<div className="container mx-auto px-4 relative z-20">
					<div className="max-w-4xl mx-auto text-center">
						<ScrollAnimation animation="fadeInUp">
							<h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-serif font-black text-foreground mb-4 sm:mb-6 leading-tight">
								Together, We Can Transform Lives with Tech
							</h1>
						</ScrollAnimation>

						<ScrollAnimation animation="fadeInUp" delay={200}>
							<p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-4 sm:px-0">
								Empowering communities through technology education and digital literacy programs. Every donation creates opportunities for a
								brighter future.
							</p>
						</ScrollAnimation>

						<ScrollAnimation animation="fadeInUp" delay={400}>
							<div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-12 px-4 sm:px-0">
								<Button
									size="lg"
									className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg hover:scale-105 transition-transform animate-pulse-glow w-full sm:w-auto"
									onClick={() => document.getElementById("donate")?.scrollIntoView({ behavior: "smooth" })}>
									<Heart className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
									Donate Now
								</Button>
								<Button
									size="lg"
									variant="outline"
									className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg bg-transparent hover:scale-105 transition-transform w-full sm:w-auto"
									onClick={() => document.getElementById("breaking-barriers")?.scrollIntoView({ behavior: "smooth" })}>
									<ArrowRight className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
									Learn More
								</Button>
							</div>
						</ScrollAnimation>

						{/* Live Fundraising Counter */}
						<ScrollAnimation animation="scaleIn" delay={600}>
							<div className="bg-card/80 backdrop-blur rounded-2xl p-4 sm:p-8 max-w-2xl mx-auto border border-border shadow-lg">
								{isLoading ? (
									<div className="text-center py-8">
										<div className="text-muted-foreground">Loading donation statistics...</div>
									</div>
								) : (
									<>
										<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
											<div className="text-center">
												<AnimatedCounter
													end={stats.totalRaised}
													prefix="₦"
													className="text-2xl sm:text-3xl font-serif font-bold text-primary mb-2"
												/>
												<div className="text-xs sm:text-sm text-muted-foreground">Raised</div>
											</div>
											<div className="text-center">
												<AnimatedCounter
													end={stats.goalAmount}
													prefix="₦"
													className="text-2xl sm:text-3xl font-serif font-bold text-accent mb-2"
												/>
												<div className="text-xs sm:text-sm text-muted-foreground">Goal</div>
											</div>
											<div className="text-center">
												<AnimatedCounter
													end={stats.totalDonors}
													className="text-2xl sm:text-3xl font-serif font-bold text-foreground mb-2"
												/>
												<div className="text-xs sm:text-sm text-muted-foreground">Donors</div>
											</div>
										</div>
										<div className="bg-muted/80 border border-muted-foreground/30 rounded-full h-3 mb-4 overflow-hidden">
											<div
												className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-1000 ease-out rounded-full"
												style={{ width: `${progressPercentage}%` }}
											/>
										</div>
										<p className="text-xs sm:text-sm text-muted-foreground">{progressPercentage}% of goal reached</p>
									</>
								)}
							</div>
						</ScrollAnimation>
					</div>
				</div>
			</section>

			{/* Impact Highlights */}
			<section className="py-12 sm:py-20 bg-muted/30">
				<div className="container mx-auto px-4">
					<ScrollAnimation animation="fadeInUp">
						<div className="text-center mb-12 sm:mb-16">
							<h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">Your Impact in Action</h2>
							<p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4 sm:px-0">
								See how your donations are creating real change in communities around the world
							</p>
						</div>
					</ScrollAnimation>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
						{[
							// { icon: Users, count: 2500, label: "Students Trained", prefix: "", suffix: "+" },
							{ icon: Target, count: 5, label: "Communities Reached", prefix: "", suffix: "" },
							{ icon: Zap, count: 89, label: "Job Placement Rate", prefix: "", suffix: "%" },
							{ icon: Heart, count: 1, label: "Lives Impacted", prefix: "", suffix: "k+" },
						].map((item, index) => (
							<ScrollAnimation key={index} animation="fadeInUp" delay={index * 100}>
								<Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border bg-card">
									<CardContent className="p-4 sm:p-6 text-center">
										<div className="bg-primary/10 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:bg-primary/20 transition-colors animate-float">
											<item.icon className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
										</div>
										<AnimatedCounter
											end={item.count}
											prefix={item.prefix}
											suffix={item.suffix}
											className="text-xl sm:text-2xl font-serif font-bold text-foreground mb-2"
										/>
										<p className="text-sm sm:text-base text-muted-foreground">{item.label}</p>
									</CardContent>
								</Card>
							</ScrollAnimation>
						))}
					</div>
				</div>
			</section>

			{/* Story & Mission Section */}
			<section id="breaking-barriers" className="py-12 sm:py-20">
				<div className="container mx-auto px-4">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
						<ScrollAnimation animation="fadeInLeft">
							<div className="relative">
								<Image
									src="/donations/breaking-barriers.jpg"
									alt="Students learning technology and coding"
									width={600}
									height={400}
									className="rounded-2xl shadow-lg w-full h-[300px] sm:h-[400px] object-cover"
								/>
							</div>
						</ScrollAnimation>

						<ScrollAnimation animation="fadeInRight">
							<div className="mt-8 lg:mt-0">
								<h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-foreground mb-4 sm:mb-6">
									Breaking Barriers Through Technology
								</h2>
								<p className="text-base sm:text-lg text-muted-foreground mb-4 sm:mb-6 leading-relaxed">
									In underserved communities across Nigeria, talented young minds lack access to quality technology education. Our mission is
									to bridge this digital divide by providing comprehensive coding bootcamps, digital literacy programs, and career mentorship.
								</p>
								<p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 leading-relaxed">
									Every donation directly funds laptops, internet access, instructor salaries, and job placement programs that transform lives
									and build stronger communities.
								</p>
								<Button
									className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold hover:scale-105 transition-transform w-full sm:w-auto"
									onClick={() => window.open("https://instagram.com/maubentech", "_blank")}>
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
	);
}
