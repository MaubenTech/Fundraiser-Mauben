export interface DonationTier {
	amount: number;
	title: string;
	badge: string;
	description: string;
	icon: string;
	minAmount: number;
	maxAmount: number;
}

export const DONATION_TIERS: DonationTier[] = [
	{
		amount: 10000,
		title: "Plant a Seed",
		badge: "Seed Planter",
		description: "Provides basic learning materials for one student",
		icon: "🌱",
		minAmount: 10000,
		maxAmount: 19999,
	},
	{
		amount: 20000,
		title: "Start a Spark",
		badge: "Spark Starter",
		description: "Provides basic coding materials for one student",
		icon: "⚡",
		minAmount: 20000,
		maxAmount: 49999,
	},
	{
		amount: 50000,
		title: "Empower a Dream",
		badge: "Dream Builder",
		description: "Funds one week of intensive training",
		icon: "💝",
		minAmount: 50000,
		maxAmount: 99999,
	},
	{
		amount: 100000,
		title: "Fuel Innovation",
		badge: "Training Catalyst",
		description: "Funds two weeks of intensive training",
		icon: "🚀",
		minAmount: 100000,
		maxAmount: 199999,
	},
	{
		amount: 200000,
		title: "Build a Future",
		badge: "Innovation Catalyst",
		description: "Provides comprehensive coding bootcamp access",
		icon: "👑",
		minAmount: 200000,
		maxAmount: 499999,
	},
	{
		amount: 500000,
		title: "Transform Lives",
		badge: "Future Architect",
		description: "Provides laptop and full program access for one student",
		icon: "⭐",
		minAmount: 500000,
		maxAmount: 999999,
	},
	{
		amount: 1000000,
		title: "Champion Change",
		badge: "Life Transformer",
		description: "Sponsors multiple students with equipment",
		icon: "🏆",
		minAmount: 1000000,
		maxAmount: 4999999,
	},
	// Hidden tiers for higher amounts
	{
		amount: 5000000,
		title: "Build Legacy",
		badge: "Change Champion",
		description: "Funds an entire program cohort",
		icon: "💎",
		minAmount: 5000000,
		maxAmount: 9999999,
	},
	{
		amount: 10000000,
		title: "Create Impact",
		badge: "Legacy Builder",
		description: "Establishes a complete learning center",
		icon: "🌟",
		minAmount: 10000000,
		maxAmount: 99999999,
	},
	{
		amount: 100000000,
		title: "Transform Communities",
		badge: "Visionary Patron",
		description: "Creates a comprehensive and conducive tech education hub for students to learn and collaborate while growing",
		icon: "🏛️",
		minAmount: 100000000,
		maxAmount: Number.POSITIVE_INFINITY,
	},
];

export const getTierForAmount = (amount: number): DonationTier => {
	return DONATION_TIERS.find((tier) => amount >= tier.minAmount && amount <= tier.maxAmount) || DONATION_TIERS[0];
};
