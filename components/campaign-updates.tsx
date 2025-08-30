"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Trophy, Target, Rocket } from "lucide-react";

interface Update {
	id: string;
	title: string;
	description: string;
	date: string;
	type: "milestone" | "event" | "achievement" | "upcoming";
	image: string;
	stats?: {
		participants?: number;
		location?: string;
		impact?: string;
	};
}

const updates: Update[] = [
	{
		id: "1",
		title: "AI-Powered Learning Platform Launch",
		description:
			"We're developing an innovative AI-powered learning platform that will personalize tech education for every student, adapting to their learning style and pace.",
		date: "2028-09-15",
		type: "upcoming",
		image: "/futuristic-ai-learning-platform-with-holographic-d.png",
		stats: {
			participants: 1000,
			impact: "Personalized learning for all",
		},
	},
	{
		id: "2",
		title: "Virtual Coding Bootcamps",
		description:
			"Revolutionary virtual coding environments will allow students to collaboratively build and debug code in realtime, making complex programming concepts tangible.",
		date: "2026-01-20",
		type: "milestone",
		image: "/students-wearing-vr-headsets-coding-in-virtual-rea.png",
		stats: {
			impact: "100% engagement rate expected",
			location: "Virtual Campuses",
		},
	},
	{
		id: "3",
		title: "Quantum Computing Education Initiative",
		description:
			"Preparing the next generation for quantum computing by introducing quantum programming concepts and providing access to quantum simulators.",
		date: "2030-05-10",
		type: "achievement",
		image: "/quantum-computer-lab-with-glowing-quantum-processo.png",
		stats: {
			participants: 500,
			impact: "First quantum-ready graduates",
		},
	},
	{
		id: "4",
		title: "Satellite Internet Learning Hubs",
		description: "Deploying satellite-connected learning hubs to the most remote communities, ensuring no one is left behind in the digital revolution.",
		date: "2027-06-01",
		type: "upcoming",
		image: "/satellite-dish-and-modern-learning-hub-in-remote-a.png",
		stats: {
			participants: 2000,
			location: "Remote Communities",
		},
	},
];

export default function CampaignUpdates() {
	const getTypeColor = (type: string) => {
		switch (type) {
			case "milestone":
				return "bg-primary/10 text-primary border-primary/20";
			case "achievement":
				return "bg-accent/10 text-accent border-accent/20";
			case "event":
				return "bg-blue-100 text-blue-800 border-blue-200";
			case "upcoming":
				return "bg-purple-100 text-purple-800 border-purple-200";
			default:
				return "bg-muted text-muted-foreground";
		}
	};

	const getTypeIcon = (type: string) => {
		switch (type) {
			case "milestone":
				return <Trophy className="h-4 w-4" />;
			case "achievement":
				return <Target className="h-4 w-4" />;
			case "event":
				return <Calendar className="h-4 w-4" />;
			case "upcoming":
				return <Rocket className="h-4 w-4" />;
			default:
				return null;
		}
	};

	return (
		<div className="space-y-6">
			<div className="text-center">
				<h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">Future Vision</h2>
				<p className="text-lg text-muted-foreground">Discover our ambitious plans to revolutionize tech education</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{updates.map((update, index) => (
					<Card
						key={update.id}
						className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border bg-card overflow-hidden"
						style={{
							animationDelay: `${index * 100}ms`,
						}}>
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

							<h3 className="text-xl font-serif font-bold text-foreground mb-3 group-hover:text-primary transition-colors">{update.title}</h3>

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
	);
}
