"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Quote, User } from "lucide-react";

interface Testimonial {
	id: string;
	name: string;
	age: number;
	content: string;
	gender: "male" | "female"; // Added gender property for avatar selection
}

const testimonials: Testimonial[] = [
	{
		id: "1",
		name: "James Kasimu",
		age: 20,
		content:
			"Prior to this time, I was scared of going into tech, but after MaubenTech's one-on-one session with me, I am ready to explore data analysis, one of the various career paths available to me through tech.",
		gender: "male", // Added gender for James
	},
	{
		id: "2",
		name: "Agho Sarah",
		age: 19,
		content: "Their first interaction with us and I had already learnt so much. Who knew tech could be used for businesses?",
		gender: "female", // Added gender for Sarah
	},
	{
		id: "3",
		name: "Samuel Stephen",
		age: 14,
		content: "I learnt about tech today with MaubenTech and I'm already interested in being a tech designer.",
		gender: "male", // Added gender for Samuel
	},
	{
		id: "4",
		name: "Mercy Agho",
		age: 19,
		content: "I'm excited about how broad and financially rewarding the tech field is. MaubenTech has opened my eyes to endless possibilities.",
		gender: "female", // Added gender for Mercy
	},
];

const GenderAvatar = ({ gender, name }: { gender: "male" | "female"; name: string }) => {
	return (
		<div
			className={`w-12 h-12 rounded-full flex items-center justify-center ${
				gender === "male" ? "bg-blue-100 text-blue-600" : "bg-pink-100 text-pink-600"
			}`}>
			<User className="h-6 w-6" />
		</div>
	);
};

export default function TestimonialsCarousel() {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isAutoPlaying, setIsAutoPlaying] = useState(true);

	useEffect(() => {
		if (!isAutoPlaying) return;

		const interval = setInterval(() => {
			setCurrentIndex((prev) => (prev + 1) % testimonials.length);
		}, 5000);

		return () => clearInterval(interval);
	}, [isAutoPlaying]);

	const goToPrevious = () => {
		setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
		setIsAutoPlaying(false);
	};

	const goToNext = () => {
		setCurrentIndex((prev) => (prev + 1) % testimonials.length);
		setIsAutoPlaying(false);
	};

	const goToSlide = (index: number) => {
		setCurrentIndex(index);
		setIsAutoPlaying(false);
	};

	return (
		<div className="relative max-w-4xl mx-auto">
			<div className="overflow-hidden rounded-2xl">
				<div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
					{testimonials.map((testimonial) => (
						<div key={testimonial.id} className="w-full flex-shrink-0">
							<Card className="border-border bg-card mx-4">
								<CardContent className="p-8 text-center">
									<Quote className="h-12 w-12 text-primary/30 mx-auto mb-6" />
									<blockquote className="text-lg text-foreground mb-6 leading-relaxed italic">"{testimonial.content}"</blockquote>
									<div className="flex items-center justify-center gap-4">
										<GenderAvatar gender={testimonial.gender} name={testimonial.name} />
										<div className="text-left">
											<div className="font-semibold text-foreground">{testimonial.name}</div>
											<div className="text-sm text-muted-foreground">Age {testimonial.age}</div>
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
				onClick={goToPrevious}>
				<ChevronLeft className="h-4 w-4" />
			</Button>

			<Button
				variant="outline"
				size="icon"
				className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-background/80 backdrop-blur border-border hover:bg-background"
				onClick={goToNext}>
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
	);
}
