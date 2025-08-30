import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
	try {
		const supabase = await createClient();

		// Get total raised amount and donor count
		const { data: completedDonations, error: donationsError } = await supabase
			.from("donations")
			.select("amount, quantity")
			.eq("payment_status", "completed");

		if (donationsError) {
			console.error("Supabase error:", donationsError);
			return NextResponse.json({ error: "Failed to fetch donation stats" }, { status: 500 });
		}

		// Calculate total raised (amount * quantity for each donation)
		const totalRaised = completedDonations.reduce((sum: number, donation: { amount: number; quantity: number }) => {
			return sum + donation.amount * donation.quantity;
		}, 0);

		// Get unique donor count
		const { data: uniqueDonors, error: donorsError } = await supabase.from("donations").select("donor_email").eq("payment_status", "completed");

		if (donorsError) {
			console.error("Supabase error:", donorsError);
			return NextResponse.json({ error: "Failed to fetch donor stats" }, { status: 500 });
		}

		const uniqueEmails = new Set(uniqueDonors.map((d: { donor_email: any; }) => d.donor_email));
		const totalDonors = uniqueEmails.size;

		// Get recent donations for display
		const { data: recentDonations, error: recentError } = await supabase
			.from("donations")
			.select("donor_name, amount, created_at")
			.eq("payment_status", "completed")
			.order("created_at", { ascending: false })
			.limit(5);

		if (recentError) {
			console.error("Supabase error:", recentError);
			return NextResponse.json({ error: "Failed to fetch recent donations" }, { status: 500 });
		}

		const stats = {
			totalRaised,
			totalDonors,
			goalAmount: 20000000, // 20 million naira goal
			recentDonations: recentDonations.map((d: { donor_name: any; amount: any; created_at: any; }) => ({
				donorName: d.donor_name,
				amount: d.amount,
				date: d.created_at,
			})),
		};

		return NextResponse.json({ stats, success: true });
	} catch (error) {
		console.error("Error fetching donation stats:", error);
		return NextResponse.json({ error: "Failed to fetch donation stats" }, { status: 500 });
	}
}
