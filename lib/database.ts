export interface Donation {
	id: string;
	amount: number;
	donorName: string;
	donorEmail: string;
	donorPhone?: string;
	donationType: "one-time" | "monthly" | "quantity";
	quantity: number;
	tier: string;
	message?: string;
	isAnonymous: boolean;
	createdAt: string;
	updatedAt: string;
	status: "pending" | "completed" | "failed";
	paymentMethod?: string;
	transactionId?: string;
}

export interface DonationStats {
	totalRaised: number;
	totalDonors: number;
	totalDonations: number;
	goalAmount: number;
	recentDonations: Donation[];
}

// In-memory storage for development (replace with real database in production)
const donations: Donation[] = [];
let donationStats: DonationStats = {
	totalRaised: 0,
	totalDonors: 0,
	totalDonations: 0,
	goalAmount: 20000000, // 20 million naira
	recentDonations: [],
};

export const getDonations = (): Donation[] => donations;

export const getDonationStats = (): DonationStats => {
	// Recalculate stats from current donations
	const completedDonations = donations.filter((d) => d.status === "completed");
	const totalRaised = completedDonations.reduce((sum, d) => sum + d.amount * d.quantity, 0);
	const uniqueDonors = new Set(completedDonations.map((d) => d.donorEmail)).size;

	donationStats = {
		...donationStats,
		totalRaised,
		totalDonors: uniqueDonors,
		totalDonations: completedDonations.length,
		recentDonations: completedDonations.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5),
	};

	return donationStats;
};

export const addDonation = (donation: Omit<Donation, "id" | "createdAt" | "updatedAt">): Donation => {
	const newDonation: Donation = {
		...donation,
		id: `donation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	};

	donations.push(newDonation);
	return newDonation;
};

export const updateDonation = (id: string, updates: Partial<Donation>): Donation | null => {
	const index = donations.findIndex((d) => d.id === id);
	if (index === -1) return null;

	donations[index] = {
		...donations[index],
		...updates,
		updatedAt: new Date().toISOString(),
	};

	return donations[index];
};

export const deleteDonation = (id: string): boolean => {
	const index = donations.findIndex((d) => d.id === id);
	if (index === -1) return false;

	donations.splice(index, 1);
	return true;
};

export const getDonationById = (id: string): Donation | null => {
	return donations.find((d) => d.id === id) || null;
};
