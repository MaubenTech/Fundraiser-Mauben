import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getTierForAmount } from "@/lib/donation-tiers";
import type { DonationRequest } from "@/lib/types/donation";

export async function GET() {
	try {
		const supabase = await createClient();
		const { data: donations, error } = await supabase.from("donations").select("*").order("created_at", { ascending: false });

		if (error) {
			console.error("Supabase error:", error);
			return NextResponse.json({ error: "Failed to fetch donations" }, { status: 500 });
		}

		return NextResponse.json({ donations, success: true });
	} catch (error) {
		console.error("Error fetching donations:", error);
		return NextResponse.json({ error: "Failed to fetch donations" }, { status: 500 });
	}
}

export async function POST(request: NextRequest) {
	try {
		const body: DonationRequest = await request.json();
		const { amount, donorName, donorEmail, donorPhone, donationType, quantity = 1, message, isAnonymous = false, paymentMethod } = body;

		// Validate required fields
		if (!amount || !donorName || !donorEmail || !donationType) {
			return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
		}

		// Get tier information for the donation amount
		const tier = getTierForAmount(amount);

		const supabase = await createClient();
		const { data: donation, error } = await supabase
			.from("donations")
			.insert([
				{
					donor_name: donorName,
					donor_email: donorEmail,
					donor_phone: donorPhone,
					amount: Number(amount),
					donation_type: donationType,
					quantity: Number(quantity),
					tier_name: tier.title,
					tier_badge: tier.badge,
					tier_description: tier.description,
					payment_method: paymentMethod,
					payment_status: "pending",
				},
			])
			.select()
			.single();

		if (error) {
			console.error("Supabase error:", error);
			return NextResponse.json({ error: "Failed to create donation" }, { status: 500 });
		}

		return NextResponse.json({ donation, success: true }, { status: 201 });
	} catch (error) {
		console.error("Error creating donation:", error);
		return NextResponse.json({ error: "Failed to create donation" }, { status: 500 });
	}
}
