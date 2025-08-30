import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getTierForAmount } from "@/lib/donation-tiers";
import type { PledgeRequest } from "@/lib/types/donation";

export async function GET() {
	try {
		const supabase = await createClient();
		const { data: pledges, error } = await supabase.from("pledges").select("*").order("created_at", { ascending: false });

		if (error) {
			console.error("Supabase error:", error);
			return NextResponse.json({ error: "Failed to fetch pledges" }, { status: 500 });
		}

		return NextResponse.json({ pledges, success: true });
	} catch (error) {
		console.error("Error fetching pledges:", error);
		return NextResponse.json({ error: "Failed to fetch pledges" }, { status: 500 });
	}
}

export async function POST(request: NextRequest) {
	try {
		const body: PledgeRequest = await request.json();
		const { amount, donorName, donorEmail, donorPhone, donationType, quantity = 1, pledgeDate, message, isAnonymous = false } = body;

		// Validate required fields
		if (!amount || !donorName || !donorEmail || !donationType || !pledgeDate) {
			return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
		}

		// Validate pledge date is in the future
		const pledgeDateObj = new Date(pledgeDate);
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		if (pledgeDateObj < today) {
			return NextResponse.json({ error: "Pledge date must be in the future" }, { status: 400 });
		}

		// Get tier information for the pledge amount
		const tier = getTierForAmount(amount);

		const supabase = await createClient();
		const { data: pledge, error } = await supabase
			.from("pledges")
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
					pledge_date: pledgeDate,
					message,
					is_anonymous: isAnonymous,
					status: "active",
				},
			])
			.select()
			.single();

		if (error) {
			console.error("Supabase error:", error);
			return NextResponse.json({ error: "Failed to create pledge" }, { status: 500 });
		}

		return NextResponse.json({ pledge, success: true }, { status: 201 });
	} catch (error) {
		console.error("Error creating pledge:", error);
		return NextResponse.json({ error: "Failed to create pledge" }, { status: 500 });
	}
}
