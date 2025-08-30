import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
	try {
		const supabase = await createClient();
		const { data: donation, error } = await supabase.from("donations").select("*").eq("id", params.id).single();

		if (error) {
			if (error.code === "PGRST116") {
				return NextResponse.json({ error: "Donation not found" }, { status: 404 });
			}
			console.error("Supabase error:", error);
			return NextResponse.json({ error: "Failed to fetch donation" }, { status: 500 });
		}

		return NextResponse.json({ donation, success: true });
	} catch (error) {
		console.error("Error fetching donation:", error);
		return NextResponse.json({ error: "Failed to fetch donation" }, { status: 500 });
	}
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
	try {
		const body = await request.json();

		const supabase = await createClient();
		const { data: donation, error } = await supabase
			.from("donations")
			.update({
				...body,
				updated_at: new Date().toISOString(),
			})
			.eq("id", params.id)
			.select()
			.single();

		if (error) {
			if (error.code === "PGRST116") {
				return NextResponse.json({ error: "Donation not found" }, { status: 404 });
			}
			console.error("Supabase error:", error);
			return NextResponse.json({ error: "Failed to update donation" }, { status: 500 });
		}

		return NextResponse.json({ donation, success: true });
	} catch (error) {
		console.error("Error updating donation:", error);
		return NextResponse.json({ error: "Failed to update donation" }, { status: 500 });
	}
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
	try {
		const supabase = await createClient();
		const { error } = await supabase.from("donations").delete().eq("id", params.id);

		if (error) {
			console.error("Supabase error:", error);
			return NextResponse.json({ error: "Failed to delete donation" }, { status: 500 });
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Error deleting donation:", error);
		return NextResponse.json({ error: "Failed to delete donation" }, { status: 500 });
	}
}
